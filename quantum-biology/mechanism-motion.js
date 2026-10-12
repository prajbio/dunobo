/* Shared explanatory clock. Progress is editorial, never physical reaction time. */
(() => {
'use strict';
for(const [selector,prefix,anchor] of [['.enzyme-ht','ht','.ht-layout'],['.protein-et','et','.et-stage']]){
 const root=document.querySelector(selector);if(!root)continue;
 const bar=document.createElement('div');bar.className='molecular-motion';bar.innerHTML=`<div><button type="button" data-motion-play aria-pressed="false">▶ Animate mechanism</button><button type="button" data-motion-reset>Restart</button><label>Speed <select data-motion-speed aria-label="Animation speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label><label><input type="checkbox" data-motion-loop checked> Loop</label></div><label class="motion-scrub">Reaction progress <input type="range" min="0" max="1000" value="0" data-motion-scrub aria-label="Explanatory reaction progress"><output data-motion-progress>0%</output></label><p>Continuous teaching animation · timing, motion and fades are illustrative, not a molecular-dynamics calculation. <span data-motion-status>Ready</span></p>`;
 root.querySelector(anchor).before(bar);root.classList.add('has-motion');
 let progress=0,playing=false,frame=0,last=0;
 const play=bar.querySelector('[data-motion-play]'),range=bar.querySelector('[data-motion-scrub]'),output=bar.querySelector('output'),status=bar.querySelector('[data-motion-status]');
 const smooth=x=>x*x*(3-2*x),clamp=x=>Math.max(0,Math.min(1,x));
 function emit(){const transfer=smooth(clamp((progress-.4)/.2));const q=progress<.4?.4*smooth(progress/.4):progress<=.6?.4:.4+.6*smooth((progress-.6)/.4);const step=prefix==='ht'?(progress<.12?0:progress<.4?1:progress<.6?2:3):(progress<.12?0:progress<.5?1:progress<.65?2:3);range.value=Math.round(progress*1000);output.textContent=Math.round(progress*100)+'%';root.dispatchEvent(new CustomEvent(prefix+':motion',{detail:{progress,transfer,q,step,state:progress<.5?'before':'after'}}));}
 function stop(){playing=false;cancelAnimationFrame(frame);play.textContent=progress>=1?'↻ Replay mechanism':'▶ Animate mechanism';play.setAttribute('aria-pressed','false');status.textContent='Paused';}
 function tick(now){if(!playing)return;if(document.hidden||!root.closest('.mechanism-panel').classList.contains('active')){stop();return;}const dt=Math.min(80,now-last);last=now;progress=Math.min(1,progress+dt/14000*Number(bar.querySelector('select').value));emit();if(progress>=1){if(bar.querySelector('[data-motion-loop]').checked){progress=0;status.textContent='Loop restart · not a reverse reaction';}else{stop();return;}}frame=requestAnimationFrame(tick);}
 function seek(p){stop();progress=p;emit();}
 play.addEventListener('click',()=>{if(playing){stop();return;}if(progress>=1)progress=0;playing=true;last=performance.now();play.textContent='Ⅱ Pause animation';play.setAttribute('aria-pressed','true');status.textContent='Playing';frame=requestAnimationFrame(tick);});
 bar.querySelector('[data-motion-reset]').addEventListener('click',()=>seek(0));range.addEventListener('input',()=>seek(Number(range.value)/1000));
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const n=b.dataset[prefix+'Step'];if(n!==undefined)seek([0,.35,.5,1][Number(n)]);if(b.dataset.etSequence==='reset')seek(0);if(b.dataset.etState)seek(b.dataset.etState==='after'?1:0);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});new MutationObserver(()=>{if(!root.closest('.mechanism-panel').classList.contains('active'))stop();}).observe(root.closest('.mechanism-panel'),{attributes:true,attributeFilter:['class']});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();},{rootMargin:'150px'}).observe(root.querySelector(prefix==='ht'?'.ht-viewport':'.et-viewport'));
}
})();
