/* Illustrative weak-coupling Marcus sequence, not a fitted protein simulation.
   G_R(q)=q²; G_P(q)=(q-1)²-0.2, arbitrary units. See structures/README.md. */
(() => {
  'use strict';
  const root = document.querySelector('.protein-et');
  const comparison = root?.querySelector('.et-mechanism');
  if (!comparison) return;
  const stages = [
    {
      name: 'Reactants', q: 0, state: 'before',
      classical: 'Surrounding nuclei and solvent begin near the reactant configuration. The marker tracks this environment, not an electron.',
      quantum: 'The donor is Cc Fe(II); Trp191•+ is the acceptor. At this configuration, the localized-charge states differ in free energy.',
      caption: 'The electron-transfer event has not happened.'
    },
    {
      name: 'Reorganize', q: .4, state: 'before',
      classical: 'Thermal fluctuations reach a transfer-ready environment. The two localized-charge free-energy curves meet at the highlighted configuration.',
      quantum: 'The states are matched in this simplified picture. Electronic coupling can enable a transition; a matching configuration does not guarantee transfer.',
      caption: 'The environment is prepared. The electron is still assigned to the reactant state.'
    },
    {
      name: 'Transfer', q: .4, state: 'after',
      classical: 'The successful event switches from the reactant curve to the product curve at the same nuclear coordinate. An effective rate summarizes these events.',
      quantum: 'Coupling through the intervening bonds and contacts connects the charge states. Cc becomes Fe(III) and the Trp191 radical is reduced.',
      caption: 'One electron changes redox site. The nuclear configuration has not yet relaxed.'
    },
    {
      name: 'Relax', q: 1, state: 'after',
      classical: 'Nuclei and solvent relax toward the product configuration. The selected product state is now lower in free energy in this illustrative model.',
      quantum: 'The product charge state remains: Cc Fe(III) and neutral Trp191. The peroxidase heme remains ferryl during this first incoming-electron step.',
      caption: 'The product environment relaxes. This completes the illustrated first-electron event.'
    }
  ];
  let step = 0, playing = false, timer = 0;
  const playButton = comparison.querySelector('[data-et-sequence=play]');
  const px = q => 60 + (q + .2) / 1.4 * 350;
  const py = g => 235 - (g + .3) / 1.8 * 190;
  const set = (selector, value) => { comparison.querySelector(selector).textContent = value; };
  function stop() {
    clearTimeout(timer);
    playing = false;
    playButton.setAttribute('aria-pressed', 'false');
    playButton.textContent = step === stages.length - 1 ? 'Replay explanation' : 'Play explanation';
  }
  function show(next, notify = true) {
    step = next;
    const s = stages[step], r = s.q * s.q, p = (s.q - 1) ** 2 - .2;
    comparison.dataset.step = String(step);
    comparison.querySelectorAll('[data-et-step]').forEach(button => button.setAttribute('aria-pressed', String(+button.dataset.etStep === step)));
    const marker = comparison.querySelector('[data-et-energy-marker]');
    marker.setAttribute('cx', px(s.q));
    marker.setAttribute('cy', py(s.state === 'before' ? r : p));
    marker.dataset.charge = s.state;
    const cursor = comparison.querySelector('[data-et-q-cursor]');
    cursor.setAttribute('x1', px(s.q)); cursor.setAttribute('x2', px(s.q));
    cursor.setAttribute('y2', marker.getAttribute('cy'));
    for (const [level, value] of [['R', r], ['P', p]]) {
      const group = comparison.querySelector(`[data-et-level=${level}]`);
      group.setAttribute('transform', `translate(0 ${py(value)})`);
      group.dataset.occupied = String(level === (s.state === 'before' ? 'R' : 'P'));
    }
    comparison.querySelector('[data-et-coupling]').setAttribute('d', `M192 ${py(r)}L268 ${py(p)}`);
    comparison.querySelector('[data-et-coupling-label]').setAttribute('y', (py(r) + py(p)) / 2 - 12);
    set('[data-et-classical-copy]', s.classical);
    set('[data-et-quantum-copy]', s.quantum);
    set('[data-et-charge-key]', `${s.state === 'before' ? 'Reactant' : 'Product'} charge state selected`);
    set('#et-energy-desc', `${s.name}. ${s.classical}`);
    set('#et-state-desc', `${s.name}. ${s.quantum}`);
    const caption = comparison.querySelector('[data-et-step-caption]');
    const strong = document.createElement('strong'); strong.textContent = `0${step + 1} · ${s.name}. `;
    caption.replaceChildren(strong, document.createTextNode(s.caption));
    if (!playing) playButton.textContent = step === stages.length - 1 ? 'Replay explanation' : 'Play explanation';
    if (notify) root.dispatchEvent(new CustomEvent('et:stepchange', {detail: {state: s.state}}));
  }
  function advance() {
    if (!playing || document.hidden || !comparison.offsetWidth) { stop(); return; }
    if (step === stages.length - 1) { stop(); return; }
    show(step + 1);
    timer = setTimeout(advance, 2600);
  }
  comparison.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-et-step')) { stop(); show(+button.dataset.etStep); }
    if (button.dataset.etSequence === 'reset') { stop(); show(0); }
    if (button.dataset.etSequence === 'play') {
      if (playing) stop();
      else {
        if (step === stages.length - 1) show(0);
        playing = true;
        playButton.textContent = 'Pause explanation';
        playButton.setAttribute('aria-pressed', 'true');
        timer = setTimeout(advance, 2600);
      }
    }
  });
  root.addEventListener('et:statechange', e => {
    // The original before/after buttons and the guided sequence share one state.
    // Same-state events from this sequence must not collapse the prepare/relax steps.
    if (stages[step].state !== e.detail.state) { stop(); show(e.detail.state === 'after' ? 2 : 0, false); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }).observe(comparison);
  new MutationObserver(() => { if (!comparison.offsetWidth) stop(); }).observe(root.closest('.mechanism-panel'), {attributes: true, attributeFilter: ['class', 'style']});
  show(0, false);
  function revealComparison() {
    if (location.hash !== '#et-mechanism') return;
    if (!root.closest('.mechanism-panel').classList.contains('active')) {
      document.querySelector('[data-mechanism="electron-transfer"]').click();
      history.replaceState(null, '', '#et-mechanism');
    }
    requestAnimationFrame(() => comparison.scrollIntoView({block: 'start', behavior: 'instant'}));
  }
  window.addEventListener('hashchange', revealComparison);
  window.addEventListener('load', revealComparison, {once: true});
  revealComparison();
})();
