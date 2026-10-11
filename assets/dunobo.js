(() => {
  'use strict';
  const menu=document.querySelector('.dunobo-menu'),subjects=document.querySelector('.dunobo-subjects');
  const closeMenu=()=>{subjects?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open subject menu');};
  menu?.addEventListener('click',()=>{const open=subjects.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close subject menu':'Open subject menu');});
  document.addEventListener('click',e=>{if(!e.target.closest('.dunobo-bar'))closeMenu();});
  const pages=[
    {title:'Human Atlas',url:'/human-atlas/',detail:'Human origins, migrations and evidence · 13 guided stories',tags:'evolution archaeology genetics ancestors map'},
    {title:'Clue Club',url:'/human-atlas/kids/',detail:'Six adventures for curious minds under 12',tags:'kids children narration discoveries'},
    {title:'Nibelungen Atlas',url:'/anthropology/nibelungenhort/',detail:'The treasure legend, the Rhine and the evidence',tags:'anthropology nibelungenhort treasure history'},
    {title:'Rhine through time',url:'/anthropology/nibelungenhort/river-change.html',detail:'Compare historical maps across five periods',tags:'maps river geography landscape'},
    {title:'Nibelungen video library',url:'/anthropology/nibelungenhort/videos.html',detail:'Six films and explainers with viewing notes',tags:'watch videos documentary'},
    {title:'Anthropology',url:'/anthropology/',detail:'Stories, places and perspectives',tags:'culture humans'},
    {title:'Quantum Biology',url:'/quantum-biology/',detail:'32 mechanisms, interactive models, evidence and history',tags:'physics life quantum biology tunneling photosynthesis magnetoreception'},
    {title:'Privacy & sources',url:'/human-atlas/privacy.html',detail:'Browser storage, narration and reuse',tags:'privacy licence source'}
  ];
  const dialog=document.createElement('dialog');dialog.id='dunoboSearch';dialog.setAttribute('aria-labelledby','siteSearchTitle');
  dialog.innerHTML='<div class="site-search-head"><h2 id="siteSearchTitle">Where will curiosity take you?</h2><button aria-label="Close search" data-search-close>✕</button></div><input id="siteSearchInput" type="search" aria-label="Search topics and collections" placeholder="Try origins, treasure, maps…" autocomplete="off"><p class="site-search-hint">Explore a collection or follow a topic. Press Esc to close.</p><div class="site-search-results" aria-live="polite"></div>';
  document.body.append(dialog);
  const input=dialog.querySelector('input'),results=dialog.querySelector('.site-search-results');
  function render(){const term=input.value.trim().toLowerCase();const found=pages.filter(p=>(p.title+' '+p.detail+' '+p.tags).toLowerCase().includes(term));results.replaceChildren();for(const p of found){const a=document.createElement('a');a.href=p.url;const group=document.createElement('span'),title=document.createElement('strong'),desc=document.createElement('small'),arrow=document.createElement('span');title.textContent=p.title;desc.textContent=p.detail;arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');group.append(title,desc);a.append(group,arrow);results.append(a);}if(!found.length){const p=document.createElement('p');p.textContent='No matching collection. Try “human”, “maps” or “treasure”.';results.append(p);}}
  let searchOpener;
  function openSearch(){if(dialog.open)return;closeMenu();searchOpener=document.activeElement;input.value='';render();dialog.showModal();input.focus();}
  document.querySelector('[data-site-search]')?.addEventListener('click',openSearch);
  dialog.querySelector('[data-search-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>searchOpener?.focus());input.addEventListener('input',render);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){const a=results.querySelector('a');if(a)location.href=a.href;}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelectorAll('.dunobo-resources[open]').forEach(d=>d.open=false);}if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!document.querySelector('dialog[open]')&&!e.target.closest('input,textarea,select,[contenteditable]')){e.preventDefault();openSearch();}});
  // Keep each atlas's original IDs, actions and event listeners intact.
  const type=document.body.dataset.design;
  if(type==='human'||type==='nibelungen'){
    const header=document.querySelector('body>header'),nav=header?.querySelector('nav');
    if(nav){const details=document.createElement('details');details.className='dunobo-resources';const summary=document.createElement('summary');summary.textContent='Resources';details.append(summary);header.append(details);details.append(nav);
      if(type==='human'){for(const selector of ['#collectionOpen','#chooseGroups','#encounters','.journey-bar [data-release-open]']){const button=document.querySelector(selector);if(button)nav.append(button);}
        const toolbar=document.querySelector('.toolbar'),filters=document.querySelector('#filterPanel');
        const placeFilters=()=>{filters.style.top=(toolbar.offsetTop+toolbar.offsetHeight)+'px';};
        new ResizeObserver(placeFilters).observe(toolbar);placeFilters();
      }
      nav.addEventListener('click',e=>{if(e.target.closest('button,a'))details.open=false;});
      document.addEventListener('click',e=>{if(!details.contains(e.target))details.open=false;});
    }
    if(type==='nibelungen'){const intro=document.querySelector('.visual-intro'),timeline=document.querySelector('.timebar');if(intro&&timeline)timeline.after(intro);}
  }
})();
