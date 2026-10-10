/* Curated stories open quickly; the complete metadata collection loads on demand. */
let researchPromise = null;
function loadAtlasScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = src;
    script.onload = resolve; script.onerror = () => { script.remove(); reject(new Error('Collection download failed')); };
    document.head.append(script);
  });
}
async function ensureResearch() {
  if (window.EXTERNAL_CATALOGUE && window.SITE_INDEX?.complete) return;
  if (!researchPromise) researchPromise = (async () => {
    if (!window.EXTERNAL_CATALOGUE) await loadAtlasScript('external.js?v=b0246d734db9b4b0');
    if (!window.SITE_INDEX?.complete) { await loadAtlasScript('sites.js?v=d4894b614b2a28d5'); window.SITE_INDEX.complete = true; }
    document.querySelector('#refCount').textContent = Object.keys(window.CATALOGUE.sources).length;
    document.querySelector('#totalCount').textContent = window.CATALOGUE.events.length.toLocaleString() + ' evidence records loaded';
    const region=document.querySelector('#regionFilter');for(const name of new Set(window.CATALOGUE.events.map(e=>e.region)))if(![...region.options].some(o=>o.value===name))region.add(new Option(name,name));if (typeof render === 'function') render();
  })().catch(error => { researchPromise = null; throw error; });
  return researchPromise;
}
async function withResearch(action) {
  if (window.EXTERNAL_CATALOGUE && window.SITE_INDEX?.complete) return action();
  modal('Opening the research collection', '<p>The full ROAD and AADR collection is loading. This may take a moment on a slower connection.</p><p role="status">Loading evidence records…</p>', 'RESEARCH COLLECTION');
  const ticket = window.atlasModalRevision;
  try { await ensureResearch(); if (window.atlasModalRevision === ticket && document.querySelector('#dialog').open) {document.querySelector('#dialog').close();action();} }
  catch { if (window.atlasModalRevision === ticket && document.querySelector('#dialog').open) {
    modal('The collection could not load', '<p>Your connection may be interrupted. The curated atlas is still available.</p><button data-retry-collection>Try again</button>', 'RESEARCH COLLECTION');
    document.querySelector('[data-retry-collection]').onclick = () => withResearch(action);
  } }
}
