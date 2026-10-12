(() => {
 'use strict';
 const data=JSON.parse(document.getElementById('atlas-data').textContent),bySlug=new Map(data.mechanisms.map(m=>[m.slug,m]));
 const panels=[...document.querySelectorAll('.mechanism-panel')];
 for(const panel of panels){const details=document.createElement('details');details.className='flat-diagrams';const summary=document.createElement('summary');summary.textContent='Read the original 2D comparison diagrams';details.append(summary);const head=panel.querySelector('.comparison-head');head.before(details);for(const selector of ['.comparison-head','.comparison','.comparison-note']){const node=panel.querySelector(selector);if(node)details.append(node);}}
 const explorer=document.createElement('section');explorer.className='scene-explorer';explorer.setAttribute('aria-label','Interactive 3D mechanism explorer');
 explorer.innerHTML=`<div class="scene-heading"><div><h4>Explore the mechanism in 3D</h4><p>Rotate the same model. Compare two explanations.</p></div><span class="scene-status"></span></div><div class="scene-modes" role="group" aria-label="3D explanation"><button data-scene-mode="compare" aria-pressed="true">Compare both</button><button data-scene-mode="classical" aria-pressed="false">Classical / effective</button><button data-scene-mode="quantum" aria-pressed="false">Quantum account</button></div><div class="scene-canvas-wrap"><canvas class="scene-canvas" tabindex="0" role="img" aria-label="Rotatable 3D conceptual mechanism. Drag to rotate; arrow keys rotate, plus and minus zoom."></canvas><span class="scene-hint">Drag to rotate · scroll or +/− to zoom · arrow keys rotate</span></div><div class="scene-controls"><button data-action="play" aria-pressed="false">Play process</button><button data-action="reset">Reset view</button><button data-action="out" aria-label="Zoom out 3D model">−</button><button data-action="in" aria-label="Zoom in 3D model">+</button><label><input type="checkbox" data-labels checked> Labels</label><label class="scene-scrub">Process stage <input type="range" min="0" max="100" value="35" aria-label="Conceptual process stage"></label></div><div class="scene-captions"><div data-caption="classical"><h5>Classical / effective baseline</h5><p></p></div><div data-caption="quantum"><h5>Quantum mechanism / proposed account</h5><p></p></div></div><p class="scene-boundary"></p>`;
 const canvas=explorer.querySelector('canvas'),ctx=canvas.getContext('2d'),stage=explorer.querySelector('input[type=range]');
 if(!ctx)return;
 let current=null,mode='compare',yaw=-.28,pitch=.22,zoom=1,phase=.35,playing=false,raf=0,last=0,visible=true,labels=true,drag=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const colour=()=>{const c=getComputedStyle(document.documentElement);return {bg:c.getPropertyValue('--d-bg').trim(),text:c.getPropertyValue('--d-text').trim(),muted:c.getPropertyValue('--d-muted').trim(),line:c.getPropertyValue('--d-line').trim(),accent:c.getPropertyValue('--d-accent').trim(),quantum:document.documentElement.dataset.theme==='dark'?'#cbb0f2':'#8254ad',blue:document.documentElement.dataset.theme==='dark'?'#73bdce':'#087d91'};};
 const node=(x,y,z,r=13,label='')=>({x,y,z,r,label});
 function geometry(m){
  const type=m.diagram,pts=[],edges=[],paths=[];let kind='chain';
  if(['spin','oxygen','isotopes','sensor','posner'].includes(type))kind='spin';
  else if(['dna-charge','ciss','chirality','collective','brain','photon-channel'].includes(type))kind='helix';
  else if(['barrier','tautomer','olfaction','surfaces'].includes(type))kind='barrier';
  else if(['network','coherence','noise','vibronic','vibration'].includes(type))kind='network';
  else if(type==='isomer')kind='isomer';
  if(kind==='helix'){
   for(let i=0;i<16;i++){const a=i*.65,x=-110+i*14.7;pts.push(node(x,Math.sin(a)*42,Math.cos(a)*42,7));if(i)edges.push([i-1,i]);}
   if(type==='dna-charge')for(let i=0;i<16;i++){const a=i*.65+Math.PI;pts.push(node(-110+i*14.7,Math.sin(a)*42,Math.cos(a)*42,7));if(i)edges.push([15+i,16+i]);edges.push([i,16+i]);}
   paths.push(pts.slice(0,16));pts[0].label=m.labels[0];pts[8].label=m.labels[1];pts[15].label=m.labels[2];
  }else if(kind==='spin'){
   pts.push(node(-65,0,0,26,m.labels[0]),node(65,0,0,26,m.labels[1]),node(0,70,22,14,m.labels[2]));edges.push([0,1],[0,2],[1,2]);paths.push([pts[0],pts[1],pts[2]]);
   if(type==='posner')for(let i=0;i<6;i++){const a=i*Math.PI/3;pts.push(node(Math.cos(a)*55,Math.sin(a)*55,(i%2?1:-1)*45,10));edges.push([i+3,(i+1)%6+3]);}
  }else if(kind==='barrier'){
   pts.push(node(-110,15,0,15,m.labels[0]),node(0,-45,0,10,m.labels[1]),node(110,15,0,15,m.labels[2]));edges.push([0,1],[1,2]);paths.push([pts[0],pts[1],pts[2]]);
  }else if(kind==='network'){
   [[-110,20,0],[-40,-45,20],[-25,65,-25],[45,-30,-30],[65,60,30],[120,0,0]].forEach((p,i)=>pts.push(node(...p,12,i===0?m.labels[0]:i===5?m.labels[2]:i===1?m.labels[1]:'')));
   edges.push([0,1],[0,2],[1,3],[2,4],[3,4],[3,5],[4,5]);paths.push([pts[0],pts[1],pts[3],pts[5]],[pts[0],pts[2],pts[4],pts[5]]);
  }else{
   for(let i=0;i<7;i++){const bend=kind==='isomer'?(i>3?(i-3)*25:0):Math.sin(i*1.2)*22;pts.push(node(-110+i*36,bend,Math.cos(i)*22,i===0||i===6?18:10,i===0?m.labels[0]:i===3?m.labels[1]:i===6?m.labels[2]:''));if(i)edges.push([i-1,i]);}paths.push(pts);
   if(type==='pcet'){const relay=pts.map(p=>node(p.x,p.y+65,-25,6));for(let i=0;i<relay.length;i++){pts.push(relay[i]);if(i)edges.push([6+i,7+i]);}paths.push(relay);}
  }
  return {kind,pts,edges,paths};
 }
 function render(){if(!current)return;const rect=canvas.getBoundingClientRect();if(!rect.width)return;const ratio=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);const c=colour();ctx.fillStyle=c.bg;ctx.fillRect(0,0,w,h);const split=mode==='compare',vertical=split&&w<500,views=split?['classical','quantum']:[mode];
  views.forEach((view,index)=>{const box={x:vertical?0:split?index*w/2:0,y:vertical?index*h/2:0,w:vertical?w:split?w/2:w,h:vertical?h/2:h};drawView(view,box,c);});
  if(split){ctx.strokeStyle=c.line;ctx.beginPath();if(vertical){ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);}else{ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);}ctx.stroke();}
 }
 function drawView(view,b,c){
  ctx.save();ctx.beginPath();ctx.rect(b.x,b.y,b.w,b.h);ctx.clip();const q=view==='quantum',g=geometry(current),scale=Math.min(b.w/330,(b.h-65)/200)*zoom,cx=b.x+b.w/2,cy=b.y+b.h/2+8;
  const project=p=>{const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw),y=p.y*Math.cos(pitch)-z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+z*Math.cos(pitch),f=480/(480+depth);return {x:cx+x*scale*f,y:cy+y*scale*f,z:depth,f};};
  const line=(points,color,width=2,dash=[])=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>{const v=project(p);i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y);});ctx.stroke();ctx.setLineDash([]);};
  ctx.font='600 12px system-ui';ctx.fillStyle=q?c.quantum:c.blue;ctx.textAlign='left';ctx.fillText(q?'QUANTUM ACCOUNT':'CLASSICAL / EFFECTIVE',b.x+16,b.y+26);
  // A perspective grid makes depth and shared camera orientation visible.
  for(let i=-3;i<=3;i++){line([node(-130,100,i*30),node(130,100,i*30)],c.line,1);line([node(i*40,100,-90),node(i*40,100,90)],c.line,1);}
  if(g.kind==='barrier'){
   const back=[node(-24,25,-45),node(-24,-65,-45),node(24,-65,-45),node(24,25,-45)],front=back.map(p=>node(p.x,p.y,45));line([...front,front[0]],c.muted,1.5);line([...back,back[0]],c.line,1.5);front.forEach((p,i)=>line([p,back[i]],c.line,1));
  }
  g.edges.forEach(([a,z])=>line([g.pts[a],g.pts[z]],c.line,3));
  if(q){for(const path of g.paths){const wave=[];for(let i=0;i<=80;i++){const t=i/80*(path.length-1),idx=Math.min(path.length-2,Math.floor(t)),u=t-idx,a=path[idx],d=path[idx+1];wave.push(node(a.x+(d.x-a.x)*u,g.kind==='barrier'?15+Math.sin(i*.6-phase*12)*8:a.y+(d.y-a.y)*u+Math.sin(i*.6-phase*12)*8,a.z+(d.z-a.z)*u+Math.cos(i*.6-phase*12)*8));}line(wave,c.quantum,2.5);}}
  else g.paths.forEach(path=>line(path,c.blue,2,[4,5]));
  const dots=g.pts.map(p=>({...p,screen:project(p)})).sort((a,z)=>z.screen.z-a.screen.z);
  for(const p of dots){const v=p.screen,r=Math.max(3,p.r*scale*v.f),gradient=ctx.createRadialGradient(v.x-r*.3,v.y-r*.4,1,v.x,v.y,r);gradient.addColorStop(0,q?'#d9cdf5':'#c4e9e1');gradient.addColorStop(1,q?c.quantum:c.blue);ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(v.x,v.y,r,0,Math.PI*2);ctx.fill();if(labels&&p.label){ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillStyle=c.text;const words=p.label.length>24?p.label.match(/.{1,22}(?:\s|$)|.+$/g):[p.label];(words||[p.label]).slice(0,2).forEach((word,i)=>ctx.fillText(word.trim(),clamp(v.x,b.x+65,b.x+b.w-65),v.y+r+16+i*12));}}
  const path=g.paths[0];if(path){const t=phase*(path.length-1),idx=Math.min(path.length-2,Math.floor(t)),u=t-idx,a=path[idx],d=path[idx+1];const pos=node(a.x+(d.x-a.x)*u,q&&g.kind==='barrier'?15:a.y+(d.y-a.y)*u,a.z+(d.z-a.z)*u);const v=project(pos);ctx.fillStyle=q?c.quantum:c.accent;ctx.beginPath();ctx.arc(v.x,v.y,6*scale,0,Math.PI*2);ctx.fill();}
  if(g.kind==='spin')for(let i=0;i<2;i++){const p=g.pts[i],angle=q?phase*Math.PI*2*(i?-1:1):i?Math.PI:0;line([p,node(p.x+Math.sin(angle)*35,p.y-Math.cos(angle)*35,p.z+Math.sin(angle)*20)],q?c.quantum:c.blue,3);}
  ctx.restore();
 }
 function stop(){playing=false;cancelAnimationFrame(raf);raf=0;const b=explorer.querySelector('[data-action=play]');b.textContent='Play process';b.setAttribute('aria-pressed','false');}
 function tick(time){if(!playing||!visible||document.hidden){stop();return;}phase=(phase+Math.min((time-last)||0,50)/6500)%1;last=time;stage.value=Math.round(phase*100);render();raf=requestAnimationFrame(tick);}
 function setMode(value){mode=value;explorer.querySelectorAll('[data-scene-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sceneMode===mode)));explorer.querySelectorAll('[data-caption]').forEach(d=>d.hidden=mode!=='compare'&&d.dataset.caption!==mode);render();}
 function mount(){const panel=panels.find(p=>p.classList.contains('active'));if(!panel){stop();explorer.remove();return;}const m=bySlug.get(panel.id.replace('mechanism-',''));if(m?.slug==='electron-transfer'){stop();current=null;explorer.remove();return;}if(!m||(m===current&&explorer.parentElement===panel))return;stop();current=m;phase=.35;stage.value=35;panel.querySelector('.flat-diagrams').before(explorer);explorer.querySelector('.scene-status').textContent=m.status+' · '+m.relation;for(const key of ['classical','quantum'])explorer.querySelector(`[data-caption=${key}] p`).textContent=m[key==='classical'?'baseline':'quantum'];explorer.querySelector('.scene-boundary').textContent='Conceptual 3D schematic, not an atomic structure or a numerical simulation. Process stage has no physical time or probability scale. '+m.boundary;canvas.setAttribute('aria-label',m.title+'. Rotatable conceptual 3D model. Drag or use arrow keys to rotate; plus and minus zoom.');setMode(mode);}
 explorer.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.sceneMode)setMode(b.dataset.sceneMode);if(b.dataset.action==='play'){if(playing)stop();else{playing=true;last=performance.now();b.textContent='Pause process';b.setAttribute('aria-pressed','true');raf=requestAnimationFrame(tick);}}if(b.dataset.action==='reset'){yaw=-.28;pitch=.22;zoom=1;phase=.35;stage.value=35;stop();}if(b.dataset.action==='in')zoom=clamp(zoom*1.15,.55,1.8);if(b.dataset.action==='out')zoom=clamp(zoom/1.15,.55,1.8);render();});
 stage.addEventListener('input',()=>{stop();phase=Number(stage.value)/100;render();});explorer.querySelector('[data-labels]').addEventListener('change',e=>{labels=e.target.checked;render();});
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.009;pitch=clamp(pitch+(e.clientY-drag.y)*.009,-1.3,1.3);drag={x:e.clientX,y:e.clientY};render();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom*Math.exp(-e.deltaY*.001),.55,1.8);render();},{passive:false});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=.15;if(e.key==='ArrowRight')yaw+=.15;if(e.key==='ArrowUp')pitch=clamp(pitch-.15,-1.3,1.3);if(e.key==='ArrowDown')pitch=clamp(pitch+.15,-1.3,1.3);if(['+','='].includes(e.key))zoom=clamp(zoom*1.15,.55,1.8);if(e.key==='-')zoom=clamp(zoom/1.15,.55,1.8);if(e.key==='Home'){yaw=-.28;pitch=.22;zoom=1;}render();});
 new MutationObserver(mount).observe(document.querySelector('.atlas-layout'),{subtree:true,attributes:true,attributeFilter:['class']});
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 new ResizeObserver(render).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop();},{threshold:.05}).observe(explorer);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 document.getElementById('book-toggle').addEventListener('click',()=>{stop();explorer.hidden=document.getElementById('book-toggle').getAttribute('aria-pressed')==='true';});
 mount();
})();
