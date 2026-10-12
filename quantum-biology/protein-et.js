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
  const colour = { donor: '#128ca3', acceptor: '#9471c7', heme: '#c58b35', trp: '#cf5478', bridge: '#7d9e4c' };
  const donor = {chain: 'B', resn: 'HEM'};
  const heme = {chain: 'A', resn: 'HEM'};
  const trp = {chain: 'A', resi: 191};
  const bridge = {chain: 'A', resi: [192, 193, 194]};
  const centres = {or: [donor, heme, trp, bridge]};
  let viewer, model, defaultView, libraryPromise, loading = false;
  let scene = 'complex', state = 'before', account = 'compare', labels = true;
  let surfaces = [], surfacesLoading = false, selectedLabel;
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

  function addLabel(label, position, borderColor) {
    return viewer.addLabel(label, {
      position, font: 'sans-serif', fontSize: viewport.clientWidth < 450 ? 10 : 12,
      fontColor: dark() ? '#f0f3ed' : '#233b45', backgroundColor: dark() ? '#14242b' : '#f5faf8',
      backgroundOpacity: .92, borderColor, borderThickness: 1, padding: 4,
      inFront: true, showBackground: true
    });
  }

  function updateLabels() {
    viewer.removeAllLabels();
    selectedLabel = null;
    if (!labels) return;
    const b = mean({...donor, elem: 'Fe'}), a = mean({...heme, elem: 'Fe'}), w = mean({...trp, atom: 'CH2'});
    // Offsets are label placement only; the molecular coordinates are never moved.
    addLabel(state === 'before' ? 'Cc heme · Fe(II)' : 'Cc heme · Fe(III)', {...b, y: b.y - 4}, colour.donor);
    addLabel(state === 'before' ? 'Trp191 · radical' : 'Trp191 · reduced', {...w, z: w.z + 3}, colour.trp);
    addLabel('CcP heme', {...a, y: a.y + 4}, colour.acceptor);
    if (scene !== 'complex' || account !== 'effective') {
      const region = mean({...bridge, atom: 'CA'});
      addLabel('A194 · A193 · G192', {...region, y: region.y + 4, z: region.z + 4}, colour.bridge);
    }
  }

  function applyStyle() {
    if (!viewer) return;
    const palette = dark() ? {donor: '#64c4d5', acceptor: '#bb9ceb', heme: '#f1c66c', trp: '#ff87a7', bridge: '#bbd987'} : colour;
    viewer.setBackgroundColor(dark() ? '#101e25' : '#f0f6f4');
    viewer.setStyle({}, {});
    if (scene !== 'centres') {
      viewer.setStyle({chain: 'A', hetflag: false}, {cartoon: {color: palette.acceptor, opacity: scene === 'complex' ? .85 : .18}});
      viewer.setStyle({chain: 'B', hetflag: false}, {cartoon: {color: palette.donor, opacity: scene === 'complex' ? .95 : .25}});
    }
    viewer.setStyle(donor, {stick: {radius: .2, color: palette.heme}});
    viewer.setStyle(heme, {stick: {radius: .2, color: palette.heme}});
    viewer.setStyle(trp, {stick: {radius: .22, color: state === 'before' ? palette.trp : dark() ? '#d69ab0' : '#ac6f88'}});
    if (account !== 'effective' || scene !== 'complex') viewer.setStyle(bridge, {stick: {radius: .2, color: palette.bridge}});
    viewer.addStyle({resn: 'HEM', elem: 'Fe'}, {sphere: {radius: .72, color: dark() ? '#f1c66c' : '#a97028'}});
    updateLabels();
    for (const surface of surfaces) viewer.setSurfaceMaterialStyle(surface.id, {color: surface.color === colour.acceptor ? palette.acceptor : palette.donor, depthWrite: false, opacity: surfaceCheckbox.checked && scene !== 'centres' ? .2 : 0});
    viewer.render();
  }

  function setView(next) {
    scene = next;
    root.querySelectorAll('[data-et-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.etView === scene)));
    text('[data-et-view-label]', {complex: 'Protein folds & cofactors', interface: 'Bridge residues & redox sites', centres: 'Cofactors & bridge · protein folds hidden'}[scene]);
    if (!viewer) return;
    viewer.setView(defaultView.slice());
    if (scene !== 'complex') { viewer.zoomTo(centres); viewer.zoom(1.5); }
    applyStyle();
  }

  function setState(next) {
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
    if (account === 'quantum') setView('interface');
    else setView('complex');
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
  root.addEventListener('et:stepchange', e => setState(e.detail.state));
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
  new MutationObserver(() => { if (panel.classList.contains('active') && viewport.clientWidth) init(); }).observe(panel, {attributes: true, attributeFilter: ['class']});
})();
