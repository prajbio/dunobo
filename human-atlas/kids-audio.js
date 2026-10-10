/* Pre-rendered neural narration. Playback never sends a child's text or voice away. */
(function () {
  'use strict';
  const players = new Set();
  let rate = 1;
  try { const saved = Number(localStorage.getItem('human-atlas-kids-audio-rate')); if ([0.85,1,1.12].includes(saved)) rate = saved; } catch {}
  const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function stopAll() { players.forEach(p=>p.stop()); window.AtlasAudio?.stop(); }
  function mount(container, clue, {answer=false}={}) {
    container.recordedPlayer?.destroy();
    const entry = window.KIDS_NARRATION?.stories[clue.id];
    const text = answer ? clue.reveal : [clue.title+'.',...clue.chapters.map(c=>c.title+'. '+c.text),'New word: '+clue.word[0]+'. '+clue.word[1],'Detective question: '+clue.wonder].join('\n');
    container.innerHTML = '<div class="recorded-narration"><div class="recorded-top"><button data-record-play class="primary">▶ '+(answer?'Hear answer':'Hear story')+'</button><label>Speed <select aria-label="'+(answer?'Answer':'Story')+' narration speed"><option value="0.85">Gentle</option><option value="1">Story pace</option><option value="1.12">Brisk</option></select></label></div><audio controls preload="metadata" aria-label="'+escape((answer?'Answer to: ':'Story: ')+clue.title)+'"></audio><p class="narration-status" role="status">Warm AI narrator · '+(entry?Math.ceil((answer?entry.answerDuration:entry.duration)/60)+' min':'read along below')+'</p><details class="device-narration"><summary>Use a device voice instead</summary><div data-device-voice></div></details></div>';
    const audio = container.querySelector('audio'), button = container.querySelector('[data-record-play]'), status = container.querySelector('.narration-status'), select = container.querySelector('select');
    let disposed = false, generation = 0, pendingSeek = null, currentChapter = -1;
    select.value = String(rate); audio.playbackRate = rate;
    if (entry) audio.src = answer ? entry.answerSrc : entry.src;
    function resetButton() { button.textContent='▶ '+(answer?'Hear answer':'Hear story'); button.setAttribute('aria-pressed','false'); }
    function showChapter(force=false) {
      if(answer||!entry)return;
      const index=Math.max(0,entry.chapters.reduce((found,time,i)=>audio.currentTime>=time?i:found,0));
      if(force||index!==currentChapter){currentChapter=index;status.textContent=(audio.paused?'Paused':'Listening')+' · Chapter '+(index+1)+' of 3: '+clue.chapters[index].title;}
    }
    function otherPlayersStop() { players.forEach(p=>{if(p!==player)p.stop();}); window.AtlasAudio?.stop(); }
    function pause() { generation++; pendingSeek=null; audio.pause(); }
    function stop() { pause(); if(audio.readyState)audio.currentTime=0; currentChapter=-1; resetButton(); status.textContent='Warm AI narrator · '+(entry?Math.ceil((answer?entry.answerDuration:entry.duration)/60)+' min':'read along below'); }
    async function play() {
      otherPlayersStop(); const token=++generation; status.textContent='Loading narration…';
      try { await audio.play(); if(disposed||token!==generation)audio.pause(); }
      catch { if(!disposed&&token===generation)status.textContent='The recording could not play. Try again, choose a device voice, or read the complete story below.'; }
    }
    function seek(seconds) { pendingSeek=seconds; if(audio.readyState){audio.currentTime=seconds;pendingSeek=null;} play(); }
    const player={stop,seek,destroy(){disposed=true;stop();audio.removeAttribute('src');audio.load();players.delete(player);}};
    players.add(player);container.recordedPlayer=player;
    audio.addEventListener('loadedmetadata',()=>{if(pendingSeek!==null){audio.currentTime=pendingSeek;pendingSeek=null;}});
    audio.addEventListener('play',()=>{if(disposed){audio.pause();return;}otherPlayersStop();button.textContent='Ⅱ Pause';button.setAttribute('aria-pressed','true');status.textContent=answer?'Listening to the detective answer.':'Listening · follow the chapters below.';showChapter(true);});
    audio.addEventListener('pause',()=>{if(!disposed){button.textContent=audio.currentTime>0&&!audio.ended?'▶ Continue listening':'▶ '+(answer?'Hear answer':'Hear story');button.setAttribute('aria-pressed','false');if(audio.currentTime>0&&!audio.ended)showChapter(true);}});
    audio.addEventListener('timeupdate',()=>{if(!audio.paused)showChapter();});
    audio.addEventListener('ended',()=>{resetButton();status.textContent=answer?'That is what the evidence can tell us.':'Story finished. What do you think about the detective question?';});
    audio.addEventListener('error',()=>{if(!disposed){resetButton();status.textContent='The recording could not load. Try a device voice or read along below.';}});
    button.setAttribute('aria-pressed','false');
    button.onclick=()=>{if(!audio.paused)pause();else play();};
    select.onchange=()=>{rate=Number(select.value);players.forEach(p=>p.setRate(rate));try{localStorage.setItem('human-atlas-kids-audio-rate',String(rate));}catch{}};
    player.setRate=value=>{audio.playbackRate=value;select.value=String(value);};
    const fallback=container.querySelector('[data-device-voice]');
    AtlasAudio.mount(fallback,()=>text,{kids:true,answer});
    fallback.addEventListener('click',event=>{if(event.target.closest('[data-audio-play]'))players.forEach(p=>p.stop());},true);
    if(!entry){button.disabled=true;audio.hidden=true;status.textContent='Read the full story below, or choose a device voice.';}
    return player;
  }
  window.KidsNarration={mount,stop:stopAll,resetRate(){rate=1;players.forEach(p=>p.setRate(rate));}};
  window.addEventListener('pagehide',stopAll);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
})();
