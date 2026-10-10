'use strict';
const clearDialog=document.querySelector('#clearDialog');
document.querySelector('#clearLocalProgress').onclick=()=>clearDialog.showModal();
document.querySelector('#cancelClear').onclick=()=>clearDialog.close();
document.querySelector('#confirmClear').onclick=()=>{
  let cleared=false;
  try {localStorage.removeItem('human-atlas-clue-club');localStorage.removeItem('human-atlas-kids-audio-rate');cleared=true;} catch {}
  clearDialog.close();document.querySelector('#clearStatus').textContent=cleared?'Saved progress and listening preference cleared. Reload any other open Clue Club tabs to start fresh.':'This browser did not allow access to site storage. You can clear this website’s data in browser settings.';
};
