(() => {
 'use strict';
 const data=JSON.parse(document.getElementById('atlas-data').textContent),bySlug=new Map(data.mechanisms.map(m=>[m.slug,m]));
 const panels=[...document.querySelectorAll('.mechanism-panel')];
 for(const panel of panels){const details=document.createElement('details');details.className='flat-diagrams';const summary=document.createElement('summary');summary.textContent='Read the original 2D comparison diagrams';details.append(summary);const head=panel.querySelector('.comparison-head');head.before(details);for(const selector of ['.comparison-head','.comparison','.comparison-note']){const node=panel.querySelector(selector);if(node)details.append(node);}}
})();
