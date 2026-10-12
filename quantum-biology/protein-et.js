/* Structure-based case study. See structures/README.md for selections and sources. */
(() => {
  'use strict';
  const root = document.querySelector('.protein-et');
  if (!root) return;
  const assetBase = new URL('.', document.currentScript.src);
  const panel = root.closest('.mechanism-panel');
  const viewport = root.querySelector('.et-viewport');
  const target = root.querySelector('.et-viewer');
  const status = root.querySelector('.et-load-status');
  const fallback = root.querySelector('.et-fallback');
  const surfaceCheckbox = root.querySelector('[data-et-surface]');
  const overlaysCheckbox = root.querySelector('[data-et-overlays]');
  const colour = { donor: '#128ca3', acceptor: '#9471c7', heme: '#c58b35', trp: '#cf5478', bridge: '#7d9e4c' };
  const donor = {chain: 'B', resn: 'HEM'};
  const heme = {chain: 'A', resn: 'HEM'};
  const trp = {chain: 'A', resi: 191};
  const bridge = {chain: 'A', resi: [192, 193, 194]};
  const centres = {or: [donor, heme, trp, bridge]};
  let viewer, model, defaultView, libraryPromise, loading = false;
  let scene = 'interface', state = 'before', account = 'compare', labels = true, mechanismStep = 0;
  let surfaces = [], surfacesLoading = false, selectedLabel;
  let dipoleShapes = [], siteShapes = [], dipoleFrame = 0, environmentQ = 0;
  const add = (a, b, scale = 1) => ({x: a.x + b.x * scale, y: a.y + b.y * scale, z: a.z + b.z * scale});
  const unit = a => { const length = Math.hypot(a.x, a.y, a.z); return {x: a.x / length, y: a.y / length, z: a.z / length}; };
  const cross = (a, b) => ({x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x});
  const sequenceQ = [0, .4, .4, 1];
  const mechanismCopy = [
    ['Reactants', 'Blue-to-amber arrows mark an initial environmental polarization around the two redox sites.', 'The donor heme, green bridge residues and Trp191 form the highlighted structural region. The radical is still on Trp191.', 'Start: Cc Fe(II) + Trp191•+. Rotate the pair to locate both redox sites.'],
    ['Reorganize', 'The schematic dipoles turn toward a transfer-ready configuration. The protein coordinates stay fixed.', 'The proposed coupling bridge stays connected. Preparation makes a transfer possible; it does not guarantee one.', 'Prepared environment: the redox labels have not changed. The dipole positions and angles are teaching choices.'],
    ['Transfer', 'The dipoles hold their orientation across the electronic event: nuclear relaxation follows afterwards.', 'Cc loses one electron and Trp191 gains it. The arrow marks the net change between sites; the green bridge is not a series of occupied intermediates.', 'Transferred: Cc Fe(III) + neutral Trp191. Arrow = net redox change, not an electron trajectory.'],
    ['Relax', 'The dipoles turn again to represent relaxation around the product charges.', 'The product redox labels remain. The peroxidase heme is still ferryl after this first incoming electron.', 'Products: the environment has relaxed. Playback is an explanatory sequence with no physical timescale.']
  ];
  const dark = () => document.documentElement.dataset.theme === 'dark';
  const text = (selector, value) => { root.querySelector(selector).textContent = value; };

  function loadLibrary() {
    if (window.$3Dmol) return Promise.resolve();
    if (!libraryPromise) libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('vendor/3Dmol-2.5.5.min.js', assetBase).href;
      script.onload = resolve;
      script.onerror = () => { script.remove(); libraryPromise = null; reject(new Error('Molecular viewer unavailable')); };
      document.head.append(script);
    });
    return libraryPromise;
  }

  function mean(selection) {
    const atoms = model.selectedAtoms(selection);
    if (!atoms.length) throw new Error('Missing structural selection');
    return atoms.reduce((p, a) => ({x: p.x + a.x / atoms.length, y: p.y + a.y / atoms.length, z: p.z + a.z / atoms.length}), {x: 0, y: 0, z: 0});
  }

  function addLabel(label, position, borderColor, screenOffset = {x: 0, y: 0}) {
    return viewer.addLabel(label, {
      position, font: 'sans-serif', fontSize: viewport.clientWidth < 450 ? 10 : 12,
      fontColor: dark() ? '#f0f3ed' : '#233b45', backgroundColor: dark() ? '#14242b' : '#f5faf8',
      backgroundOpacity: .92, borderColor, borderThickness: 1, padding: 4,
      inFront: true, showBackground: true, screenOffset
    });
  }

  function updateSceneText() {
    const copy = mechanismCopy[mechanismStep];
    text('[data-et-3d-step]', `0${mechanismStep + 1} · ${copy[0]}`);
    text('[data-et-3d-classical]', copy[1]);
    text('[data-et-3d-quantum]', copy[2]);
    text('[data-et-3d-caption]', overlaysCheckbox.checked ? copy[3] : 'Mechanism overlays hidden. The fixed molecular structure and redox labels remain available.');
    root.querySelector('.et-protein-mechanism').dataset.step = String(mechanismStep);
    root.querySelector('.et-protein-mechanism').dataset.account = account;
    root.querySelectorAll('[data-et-layer]').forEach(el => { el.hidden = account !== 'compare' && el.dataset.etLayer !== account; });
  }

  function clearShapes(shapes) { shapes.forEach(shape => viewer.removeShape(shape)); shapes.length = 0; }

  function geometry() {
    const d = mean({...donor, elem: 'Fe'}), a = mean({...trp, atom: ['CG', 'CD1', 'CD2', 'NE1', 'CE2', 'CE3', 'CZ2', 'CZ3', 'CH2']});
    const axis = unit(add(a, d, -1));
    const u = unit(cross(axis, Math.abs(axis.z) < .9 ? {x: 0, y: 0, z: 1} : {x: 0, y: 1, z: 0}));
    return {d, a, axis, u, v: unit(cross(axis, u))};
  }

  function drawDipoles(q) {
    clearShapes(dipoleShapes);
    if (!overlaysCheckbox.checked || account === 'quantum') return;
    const {d, a, axis, u, v} = geometry();
    // These six glyphs are explanatory shapes, never molecular atoms. Their
    // positions, lengths and rotations are editorial choices, not electrostatics.
    [d, a].forEach((centre, site) => {
      for (let i = 0; i < 3; i++) {
        const theta = i * 2 * Math.PI / 3 + (site ? .35 : 0);
        const radial = add({x: 0, y: 0, z: 0}, u, Math.cos(theta));
        const radial3D = add(radial, v, Math.sin(theta));
        const position = add(centre, radial3D, site ? 7 : 9);
        const angle = -.85 + q * 1.7 + site * Math.PI;
        const direction = add({x: 0, y: 0, z: 0}, radial3D, Math.cos(angle));
        const vector = add(direction, axis, Math.sin(angle));
        const start = add(position, vector, -1.7), end = add(position, vector, 1.7);
        dipoleShapes.push(viewer.addArrow({start, end, radius: .21, radiusRatio: 2.2, mid: .7, color: dark() ? '#f5c76e' : '#b97922'}));
        dipoleShapes.push(viewer.addSphere({center: start, radius: .48, color: dark() ? '#72bdff' : '#397da8'}));
      }
    });
  }

  function updateOverlays() {
    cancelAnimationFrame(dipoleFrame);
    clearShapes(dipoleShapes);
    clearShapes(siteShapes);
    if (!overlaysCheckbox.checked) { clearShapes(dipoleShapes); return; }
    const {d, a, u} = geometry();
    // Halos annotate chemical sites. They are not orbitals or density contours.
    siteShapes.push(viewer.addSphere({center: d, radius: 4.9, color: colour.donor, opacity: state === 'before' ? .16 : .06}));
    siteShapes.push(viewer.addSphere({center: a, radius: 3.1, color: colour.trp, opacity: state === 'after' ? .22 : .07}));
    if (account !== 'effective' && state === 'after') {
      // A reaction-scheme arrow, offset from the atoms, denotes only net transfer.
      // No moving electron, sequence of bridge populations or spatial path is drawn.
      const start = add(d, u, 4), end = add(a, u, 4);
      siteShapes.push(viewer.addArrow({start, end, radius: .34, radiusRatio: 2.8, mid: .86, color: dark() ? '#ff87a7' : colour.trp, opacity: 1}));
      if (labels) addLabel('Net 1 e− change', add(start, add(end, start, -1), .5), colour.trp, {x: -50, y: 65});
    }
    const from = environmentQ, to = sequenceQ[mechanismStep];
    if (from === to || mechanismStep === 2 || account === 'quantum' || matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) {
      environmentQ = to; drawDipoles(to); return;
    }
    const began = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - began) / 850), eased = t * t * (3 - 2 * t);
      environmentQ = from + (to - from) * eased;
      drawDipoles(environmentQ); viewer.render();
      if (t < 1) dipoleFrame = requestAnimationFrame(frame);
    }
    drawDipoles(from);
    dipoleFrame = requestAnimationFrame(frame);
  }

  function updateLabels() {
    viewer.removeAllLabels();
    selectedLabel = null;
    if (!labels) return;
    const b = mean({...donor, elem: 'Fe'}), a = mean({...heme, elem: 'Fe'}), w = mean({...trp, atom: 'CH2'});
    // Offsets are label placement only; the molecular coordinates are never moved.
    addLabel(state === 'before' ? 'Cc heme · Fe(II)' : 'Cc heme · Fe(III)', b, colour.donor, {x: -50, y: 36});
    addLabel(state === 'before' ? 'Trp191 · radical' : 'Trp191 · reduced', w, colour.trp, {x: -40, y: 35});
    addLabel('CcP heme', a, colour.acceptor, {x: 12, y: -22});
    if (account !== 'effective' && overlaysCheckbox.checked) {
      const region = mean({...bridge, atom: 'CA'});
      addLabel('A194 · A193 · G192', region, colour.bridge, {x: -65, y: -35});
    }
  }

  function applyStyle() {
    updateSceneText();
    if (!viewer) return;
    const palette = dark() ? {donor: '#64c4d5', acceptor: '#bb9ceb', heme: '#f1c66c', trp: '#ff87a7', bridge: '#bbd987'} : colour;
    viewer.setBackgroundColor(dark() ? '#101e25' : '#f0f6f4');
    viewer.setStyle({}, {});
    if (scene !== 'centres') {
      viewer.setStyle({chain: 'A', hetflag: false}, {cartoon: {color: palette.acceptor, opacity: scene === 'complex' ? .85 : .38}});
      viewer.setStyle({chain: 'B', hetflag: false}, {cartoon: {color: palette.donor, opacity: scene === 'complex' ? .95 : .45}});
    }
    viewer.setStyle(donor, {stick: {radius: .2, color: palette.heme}});
    viewer.setStyle(heme, {stick: {radius: .2, color: palette.heme}});
    viewer.setStyle(trp, {stick: {radius: .22, color: state === 'before' ? palette.trp : dark() ? '#d69ab0' : '#ac6f88'}});
    if (account !== 'effective' && overlaysCheckbox.checked) viewer.setStyle(bridge, {stick: {radius: .27, color: palette.bridge}, sphere: {radius: .35, color: palette.bridge}});
    viewer.addStyle({resn: 'HEM', elem: 'Fe'}, {sphere: {radius: .72, color: dark() ? '#f1c66c' : '#a97028'}});
    updateLabels();
    updateOverlays();
    for (const surface of surfaces) viewer.setSurfaceMaterialStyle(surface.id, {color: surface.color === colour.acceptor ? palette.acceptor : palette.donor, depthWrite: false, opacity: surfaceCheckbox.checked && scene !== 'centres' ? .2 : 0});
    viewer.render();
  }

  function setView(next) {
    scene = next;
    root.querySelectorAll('[data-et-focus]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    root.querySelectorAll('[data-et-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etView === scene)));
    text('[data-et-view-label]', {complex: 'Protein folds & cofactors', interface: 'Bridge residues & redox sites', centres: 'Cofactors & bridge · protein folds hidden'}[scene]);
    if (!viewer) return;
    viewer.setView(defaultView.slice());
    if (scene !== 'complex') { viewer.zoomTo(centres); viewer.zoom(1.12); }
    applyStyle();
  }

  function setState(next, nextStep) {
    if (Number.isInteger(nextStep)) mechanismStep = nextStep;
    else if (state !== next) mechanismStep = next === 'after' ? 2 : 0;
    state = next;
    const after = state === 'after';
    root.querySelectorAll('[data-et-state]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etState === state)));
    text('[data-et-donor]', after ? 'Heme Fe(III)' : 'Heme Fe(II)');
    text('[data-et-donor-note]', after ? 'Oxidized donor: one electron donated.' : 'Reduced donor, ready to lose one electron.');
    text('[data-et-acceptor]', after ? 'Trp191 · neutral' : 'Trp191•+');
    text('[data-et-acceptor-note]', after ? 'The radical is reduced by that electron.' : 'Radical cation, ready to accept one electron.');
    text('.et-state-message', after ? 'One electron transferred: the donor is oxidized and Trp191 is reduced. Coordinates remain fixed.' : 'Select “After 1 e−” to compare the products.');
    applyStyle();
    root.dispatchEvent(new CustomEvent('et:statechange', {detail: {state}}));
  }

  function setAccount(next) {
    account = next;
    root.querySelectorAll('[data-et-account]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etAccount === account)));
    root.querySelectorAll('[data-et-explanation]').forEach(el => { el.hidden = account !== 'compare' && el.dataset.etExplanation !== account; });
    root.querySelector('.et-explanation').dataset.account = account;
    // Switching explanatory layers preserves the user's camera and chosen step.
    applyStyle();
  }

  function focusSite(site) {
    if (!viewer) return;
    const selection = {donor, bridge, acceptor: trp}[site];
    setView('interface');
    viewer.zoomTo(selection); viewer.zoom(.7); viewer.render();
    root.querySelectorAll('[data-et-focus]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etFocus === site)));
    text('[data-et-view-label]', {donor: 'Cytochrome c · donor heme', bridge: 'Proposed bridge · Ala194–Ala193–Gly192', acceptor: 'Peroxidase · Trp191 acceptor'}[site]);
    viewport.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    viewport.focus({preventScroll: true});
  }

  async function showSurfaces() {
    if (!viewer) return;
    if (surfaces.length || !surfaceCheckbox.checked) { applyStyle(); return; }
    if (surfacesLoading) return;
    surfacesLoading = true;
    surfaceCheckbox.disabled = true;
    const pending = [];
    try {
      for (const [chain, color] of [['A', colour.acceptor], ['B', colour.donor]]) {
        // Displayed envelope is a calculated van der Waals surface, not density data.
        const surface = viewer.addSurface(window.$3Dmol.SurfaceType.VDW, {opacity: .2, color, depthWrite: false}, {chain, hetflag: false});
        surfaces.push({id: surface.surfid, color});
        pending.push(surface);
      }
      await Promise.all(pending);
      applyStyle();
    } catch (_) {
      surfaces.forEach(surface => viewer.removeSurface(surface.id));
      surfaces = [];
      surfaceCheckbox.checked = false;
      text('[data-et-view-label]', 'Envelopes unavailable · ribbon structure remains usable');
    } finally { surfacesLoading = false; surfaceCheckbox.disabled = false; }
  }

  async function init() {
    if (viewer || loading || !viewport.clientWidth) return;
    loading = true;
    fallback.hidden = true;
    status.hidden = false;
    status.textContent = 'Loading the measured protein structure…';
    try {
      const [, pdb] = await Promise.all([
        loadLibrary(),
        fetch(new URL('structures/2PCC.pdb', assetBase), {signal: AbortSignal.timeout(20000)})
          .then(response => { if (!response.ok) throw new Error('Coordinates unavailable'); return response.text(); })
      ]);
      // Keep just one crystallographic A/B pair and its hemes. Retain metadata and
      // connectivity records; 3Dmol ignores bonds to atoms absent from the selection.
      const pair = pdb.split(/\r?\n/).filter(line => {
        if (/^(ATOM  |HETATM|TER   )/.test(line)) return ['A', 'B'].includes(line[21]) && line.slice(17, 20) !== 'HOH';
        return true;
      }).join('\n');
      viewer = window.$3Dmol.createViewer(target, {backgroundColor: dark() ? '#101e25' : '#f0f6f4', antialias: true});
      viewer.setProjection('orthographic');
      model = viewer.addModel(pair, 'pdb');
      const donorIron = model.selectedAtoms({...donor, elem: 'Fe'}), acceptorIron = model.selectedAtoms({...heme, elem: 'Fe'});
      if (donorIron.length !== 1 || acceptorIron.length !== 1 || model.selectedAtoms(trp).length !== 14) throw new Error('Unexpected coordinates');
      viewer.zoomTo();
      viewer.rotate(180, 'y');
      viewer.rotate(-45, 'vz');
      viewer.zoom(1.5);
      defaultView = viewer.getView().slice();
      viewer.setClickable(centres, true, atom => {
        if (selectedLabel) viewer.removeLabel(selectedLabel);
        selectedLabel = addLabel(`${atom.resn} ${atom.chain}${atom.resi} · ${atom.atom}`, atom, colour.heme);
        viewer.render();
      });
      target.querySelector('canvas')?.setAttribute('aria-hidden', 'true');
      target.addEventListener('webglcontextlost', () => {
        fallback.hidden = false;
        status.hidden = false;
        status.textContent = 'The 3D graphics connection was lost. Reload this page to restore it.';
        root.querySelector('[data-et-action=retry]').hidden = true;
      }, true);
      status.hidden = true;
      setView(scene);
      if (surfaceCheckbox.checked) await showSurfaces();
    } catch (_) {
      if (viewer) { viewer.clear(); viewer = null; }
      target.replaceChildren();
      fallback.hidden = false;
      status.textContent = '3D unavailable · see the structure link below';
    } finally { loading = false; }
  }

  root.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.dataset.etView) setView(button.dataset.etView);
    if (button.dataset.etState) setState(button.dataset.etState);
    if (button.dataset.etAccount) setAccount(button.dataset.etAccount);
    if (button.dataset.etFocus) focusSite(button.dataset.etFocus);
    const action = button.dataset.etAction;
    if (action === 'retry') init();
    if (action === 'bridge') {
      setView('interface');
      viewport.scrollIntoView({block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      viewport.focus({preventScroll: true});
    }
    if (action === 'reset') setView('complex');
    if (action === 'labels') { labels = !labels; button.setAttribute('aria-pressed', String(labels)); applyStyle(); }
    if (viewer && (action === 'in' || action === 'out')) { viewer.zoom(action === 'in' ? 1.18 : 1 / 1.18); viewer.render(); }
  });
  surfaceCheckbox.addEventListener('change', showSurfaces);
  overlaysCheckbox.addEventListener('change', applyStyle);
  root.addEventListener('et:stepchange', e => setState(e.detail.state, e.detail.step));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(dipoleFrame); environmentQ = sequenceQ[mechanismStep]; if (viewer) { drawDipoles(environmentQ); viewer.render(); } }
  });
  viewport.addEventListener('keydown', e => {
    if (!viewer) return;
    const rotate = {ArrowLeft: [-12, 'vy'], ArrowRight: [12, 'vy'], ArrowUp: [-12, 'vx'], ArrowDown: [12, 'vx']};
    if (rotate[e.key]) { e.preventDefault(); viewer.rotate(...rotate[e.key]); viewer.render(); }
    else if (['+', '=', '-'].includes(e.key)) { e.preventDefault(); viewer.zoom(e.key === '-' ? 1 / 1.15 : 1.15); viewer.render(); }
    else if (e.key === 'Home') { e.preventDefault(); setView('complex'); }
  });
  new ResizeObserver(() => { if (viewer && viewport.clientWidth) { viewer.resize(); viewer.render(); } }).observe(viewport);
  new MutationObserver(() => { if (viewer) applyStyle(); }).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  const intersection = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) init();
  }, {rootMargin: '300px'});
  intersection.observe(viewport);
  updateSceneText();
  new MutationObserver(() => { if (panel.classList.contains('active') && viewport.clientWidth) init(); }).observe(panel, {attributes: true, attributeFilter: ['class']});
})();
