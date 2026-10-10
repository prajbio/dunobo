/* Discovery images and publication context stay distinct. Source data load on demand. */
(function () {
  'use strict';
  const cache = new Map();
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const doi = value => String(value || '').trim().toLowerCase();
  const identityKeys = m => [m.originalImageUrl || m.src,...(m.figureDois || []).map(doi),/^10\./.test(m.id || '') ? doi(m.id) : null].filter(Boolean);
  function json(path) {
    if (!cache.has(path)) cache.set(path, fetch(path, {cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Images unavailable');return r.json();}).catch(error=>{cache.delete(path);throw error;}));
    return cache.get(path);
  }
  const statusText = {
    available:'Reusable figures available',
    source_not_indexed:'No match in the publication index checked',
    no_open_media:'No reusable media retrieved from the open collection',
    license_review:'Reuse permission requires review',
    no_figures:'No eligible figures found in the retrieved article',
    check_failed:'Source check could not be completed',
    database_reference:'Database reference; not a photograph of this discovery'
  };
  function nearbyImages(e) {
    const index = window.SITE_INDEX, own = window.EVIDENCE_IMAGES || {};
    const local = window.LOCALITY_IMAGES || {};
    const key = index?.recordToSite[e.id];
    const seen = new Set((own[e.id] || []).map(m=>m.src));
    const related = [];
    for(const record of window.CATALOGUE.events) {
      if(record.id !== e.id && (!key || index.recordToSite[record.id] !== key))continue;
      const collection=[...(local[record.id] || []),...(record.id === e.id ? [] : own[record.id] || [])];
      for(const m of collection) if(!seen.has(m.src)) {
        seen.add(m.src); related.push({...m,context:m.context || 'Related discovery at the same locality: '+record.site,recordId:record.id});
      }
    }
    return related;
  }
  function thumbnail(m,index) {
    return '<button class="research-image" data-media-image="'+index+'" aria-label="Enlarge '+escape(m.label || m.evidenceType || 'publication figure')+'"><img src="'+escape(m.thumbnail || m.src)+'" alt="'+escape(m.title || m.caption)+'" width="'+m.width+'" height="'+m.height+'" loading="lazy"><span>'+escape(m.label || m.evidenceType || 'Publication figure')+'</span></button>';
  }
  function gallery(images, position) {
    const m=images[position];if(!m)return;
    modal(m.label || m.evidenceType || 'Publication figure',
      '<div class="gallery-controls"><button data-media-prev '+(position===0?'disabled':'')+'>← Previous</button><span>'+(position+1)+' of '+images.length+'</span><button data-media-next '+(position===images.length-1?'disabled':'')+'>Next →</button></div>'+
      '<p class="media-context">'+escape(m.context || 'Figure from a publication linked to this record. Read the caption for the sites and specimens shown.')+'</p>'+
      '<img class="big-photo" src="'+escape(m.src)+'" alt="'+escape(m.caption)+'">'+
      '<p>'+escape(m.caption)+'</p><p><a href="'+escape(m.licenseUrl)+'" target="_blank" rel="noopener noreferrer">'+escape(m.license)+'</a></p>'+
      '<div class="media-links"><a href="'+escape(m.sourcePageUrl)+'" target="_blank" rel="noopener noreferrer">Publication / image source ↗</a><a href="'+escape(m.originalImageUrl || m.src)+'" target="_blank" rel="noopener noreferrer">Original full-size image ↗</a></div>'+
      '<details class="media-audit"><summary>Study authors & image credits</summary><p>'+escape(m.author)+'</p></details>'+
      '<p class="image-note">'+escape(m.changes || 'No changes to the source figure.')+'</p>', 'RESEARCH IMAGE GALLERY');
    const body=document.querySelector('#dialogBody');
    body.querySelector('[data-media-prev]').onclick=()=>gallery(images,position-1);
    body.querySelector('[data-media-next]').onclick=()=>gallery(images,position+1);
    body.querySelector('.big-photo').onerror=event=>{event.target.hidden=true;const p=document.createElement('p');p.textContent='This image could not load. Open its original source using the link below.';event.target.after(p);};
  }
  async function mount(container,e) {
    if(!container)return;
    container.dataset.mediaRecord=e.id;
    container.innerHTML='<h3>IMAGES FROM THIS LOCATION & RESEARCH</h3><p role="status">Checking the image collection…</p>';
    const current=()=>container.isConnected && container.dataset.mediaRecord===e.id;
    try {
      const index=await json('publication-media-index.json');
      const entries=[...new Set(e.sources.map(key=>doi(window.CATALOGUE.sources[key]?.doi)).filter(Boolean))].map(key=>({doi:key,...index.papers[key]}));
      const loaded=await Promise.all(entries.filter(p=>p.file).map(async p=>{try{return await json(p.file);}catch{return{doi:p.doi,figures:[],failed:true};}}));
      if(!current())return;
      const nearby=nearbyImages(e), publications=[],seen=new Set([...(window.EVIDENCE_IMAGES[e.id] || []),...nearby].flatMap(identityKeys));
      for(const paper of loaded)for(const m of paper.figures || [])if(!identityKeys(m).some(key=>seen.has(key))) {
        identityKeys(m).forEach(key=>seen.add(key));
        publications.push({...m,context:'From '+paper.title+'. Linked publication context; not necessarily this individual discovery.',paperTitle:paper.title});
      }
      const images=[...nearby,...publications];
      container.innerHTML='<h3>IMAGES FROM THIS LOCATION & RESEARCH</h3>'+
        (nearby.length?'<p><strong>From this locality</strong> · '+nearby.length+' image'+(nearby.length===1?'':'s')+'</p><p class="media-note">Verified site and discovery images. Captions identify the material shown; some finds belong to different layers or individuals at the same location.</p><div class="research-image-grid">'+nearby.slice(0,4).map((m,i)=>thumbnail(m,i)).join('')+'</div>':'')+
        (publications.length?'<p><strong>Linked publication figures</strong> · '+publications.length+'</p><p class="media-note">A paper can cover several sites and specimens. Open a figure and read its caption to see what it shows.</p><div class="research-image-grid">'+publications.slice(0,4).map((m,i)=>thumbnail(m,nearby.length+i)).join('')+'</div>':'')+
        (images.length?'<button data-media-all>Explore all '+images.length+' research images →</button>':'<p class="media-note">'+((window.EVIDENCE_IMAGES[e.id] || []).length?'No additional reusable images were retrieved from the sources checked.':'A reusable image has not yet been matched to this discovery in the sources checked. The publication links remain available below.')+'</p>')+
        (loaded.some(p=>p.failed)?'<p role="status">Some image lists could not load. <button data-media-retry>Try again</button></p>':'')+
        '<details class="media-audit"><summary>Image sources & coverage</summary><p>Photographs, maps and analytical figures serve different purposes. A publication link alone does not identify a pictured person or object.</p>'+entries.map(p=>'<p><a href="https://doi.org/'+escape(p.doi)+'" target="_blank" rel="noopener noreferrer">'+escape(p.doi)+' ↗</a><br>'+escape(statusText[p.status] || 'Image source has not been checked')+'</p>').join('')+'<button data-media-coverage>View atlas image coverage</button></details>';
      container.querySelectorAll('[data-media-image]').forEach(button=>button.onclick=()=>gallery(images,Number(button.dataset.mediaImage)));
      container.querySelector('[data-media-all]')?.addEventListener('click',()=>gallery(images,0));
      container.querySelector('[data-media-retry]')?.addEventListener('click',()=>mount(container,e));
      container.querySelector('[data-media-coverage]').onclick=()=>coverage(index);
      container.querySelectorAll('.research-image img').forEach(img=>img.onerror=()=>{img.hidden=true;img.closest('button').classList.add('image-unavailable');});
    } catch {
      if(!current())return;
      container.innerHTML='<h3>IMAGES FROM THIS LOCATION & RESEARCH</h3><p>The image index could not load. Your discovery text and publication links are still available.</p><button data-media-retry>Try images again</button>';
      container.querySelector('button').onclick=()=>mount(container,e);
    }
  }
  function coverage(index) {
    const s=index.summary;
    modal('How much can I see?', '<p>'+Number(s.doisChecked).toLocaleString()+' cited DOI identifiers checked for available publication images.</p><div class="media-coverage"><p><strong>'+Number(s.localFigures).toLocaleString()+'</strong> imported publication figures</p><p><strong>'+Number(s.papersWithImages).toLocaleString()+'</strong> publications with reusable figures</p><p><strong>'+Number(s.recordsWithPublicationImages).toLocaleString()+'</strong> records linked to those publications</p></div>'+(s.verifiedLocalityFigures?'<p><strong>'+s.verifiedLocalityFigures+' locality figures</strong> have also been visually checked against their captions and matched to named locations.</p>':'')+'<p>These are figure and reference-coverage counts, not counts of specimen photographs. A shared publication can describe many sites. Images are not proof that two records show the same individual.</p><p>Some publications are not indexed, not openly reusable, have unavailable media, or need individual rights review. Unresolved images are left unassigned. Database metadata licenses do not automatically cover publication images.</p><p>ROAD stores photographs, but its public exports do not expose the image files checked here. AADR sample metadata do not supply a photograph for every individual.</p><p><a href="image-coverage.json" download>Download the complete image coverage audit</a></p>', 'IMAGE COVERAGE');
  }
  window.AtlasMedia={mount,gallery,coverage:async()=>{
    try { coverage(await json('publication-media-index.json')); }
    catch { modal('Image coverage unavailable','<p>The image index could not load. Close this panel and try again when connected.</p>','IMAGE COVERAGE'); }
  }};
})();
