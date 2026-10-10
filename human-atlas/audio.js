/* Optional browser narration. Text remains available whether or not a voice exists. */
(function () {
  'use strict';
  // Keep sentences intact where possible so a voice can finish its thought.
  function speechChunks(text) {
    const sentences = String(text).trim().replace(/([.!?][”’"']?)\s+/g, '$1\n').split(/\n+/);
    const chunks = [];
    for (const sentence of sentences) {
      let chunk = '';
      for (const word of sentence.trim().split(/\s+/)) {
        if (chunk && (chunk + ' ' + word).length > 180) { chunks.push(chunk); chunk = ''; }
        chunk += (chunk ? ' ' : '') + word;
      }
      if (chunk) chunks.push(chunk);
    }
    return chunks;
  }
  window.atlasSpeechChunks = speechChunks;
  function createNarrator(synth, Utterance, changed = () => {}) {
    let generation = 0, status = 'idle', queue = [], index = 0, options = {}, current;
    const emit = (next, message = '') => { status = next; changed({status, message}); };
    const cancel = () => { generation++; if (synth) synth.cancel(); queue = []; current = null; };
    function next(token) {
      if (token !== generation) return;
      if (index >= queue.length) { current = null; emit('idle', 'Finished reading.'); return; }
      current = new Utterance(queue[index++]);
      current.lang = 'en'; current.rate = options.rate || 1;
      const voice = synth.getVoices().find(v => v.voiceURI === options.voice);
      if (voice) { current.voice = voice; current.lang = voice.lang; }
      current.onend = () => next(token);
      current.onerror = e => {
        if (token !== generation) return;
        cancel(); emit('error', 'This voice could not play. Choose another voice or read the text below.');
      };
      synth.speak(current);
    }
    return {
      start(text, settings = {}) {
        cancel(); options = settings;
        if (!synth || !Utterance) { emit('error', 'Read-aloud is unavailable in this browser. The complete text is on screen.'); return; }
        queue = speechChunks(text);
        if (!queue.length || !String(text).trim()) { emit('idle'); return; }
        index = 0; emit('playing', 'Reading aloud.'); synth.resume(); next(generation);
      },
      pause() { if (status === 'playing') { synth.pause(); emit('paused', 'Paused.'); } },
      resume() { if (status === 'paused') { synth.resume(); emit('playing', 'Reading aloud.'); } },
      stop() { cancel(); emit('idle', 'Stopped.'); },
      get status() { return status; }
    };
  }
  window.createAtlasNarrator = createNarrator;
  let active = null;
  const synth = window.speechSynthesis;
  const narrator = createNarrator(synth, window.SpeechSynthesisUtterance, update => {
    if (!active) return;
    const play = active.querySelector('[data-audio-play]');
    play.textContent = update.status === 'playing' ? 'Ⅱ Pause' : update.status === 'paused' ? '▶ Resume' : active.dataset.listenText || '▶ Listen';
    play.setAttribute('aria-pressed', String(update.status === 'playing'));
    play.setAttribute('aria-label', update.status === 'playing' ? 'Pause narration' : update.status === 'paused' ? 'Resume narration' : active.dataset.listenLabel || 'Listen to this text');
    active.querySelector('[data-audio-stop]').disabled = !['playing','paused'].includes(update.status);
    active.querySelector('[data-audio-status]').textContent = update.message;
    active.dataset.status = update.status;
  });
  function mount(container, getText, profile = {}) {
    if (!container) return;
    container.classList.add('audio-controls');
    container.innerHTML = '<div class="audio-buttons"><button data-audio-play aria-pressed="false" aria-label="Listen to this text">▶ Listen</button><button data-audio-stop disabled aria-label="Stop narration">■ Stop</button><label>Speed <select data-audio-rate aria-label="Narration speed"><option value="0.85">Slower</option><option value="1" selected>Normal</option><option value="1.15">Faster</option></select></label><details class="voice-picker"><summary>Voice</summary><label>Reading voice<select data-audio-voice aria-label="Reading voice"></select></label></details></div><span data-audio-status role="status" aria-live="polite">Optional read-aloud · text stays on screen.</span>';
    if (profile.kids) {
      container.dataset.listenText = profile.answer ? '▶ Hear answer' : '▶ Hear story';
      container.dataset.listenLabel = profile.answer ? 'Listen to the answer' : 'Listen to this story';
      container.querySelector('[data-audio-play]').textContent = container.dataset.listenText;
      container.querySelector('[data-audio-play]').setAttribute('aria-label', container.dataset.listenLabel);
      const rates = container.querySelector('[data-audio-rate]');
      rates.replaceChildren(new Option('Gentle', '0.8'), new Option('Story pace', '0.93'), new Option('Brisk', '1.08'));
      rates.value = '0.93';
      container.querySelector('[data-audio-status]').textContent = profile.answer ? 'Hear what the clues can tell us.' : 'Settle in, explorer. Let’s follow the clues together.';
    }
    function voices() {
      const select = container.querySelector('[data-audio-voice]'), selected = select.value;
      select.replaceChildren(new Option('Browser default', ''));
      (synth?.getVoices() || []).filter(v => /^en(?:-|$)/i.test(v.lang)).forEach(v => select.add(new Option(v.name, v.voiceURI)));
      if ([...select.options].some(o => o.value === selected)) select.value = selected;
    }
    voices(); container.updateVoices = voices;
    container.querySelector('[data-audio-play]').onclick = () => {
      window.AtlasVideo?.stop();
      if (active === container && narrator.status === 'playing') return narrator.pause();
      if (active === container && narrator.status === 'paused') return narrator.resume();
      narrator.stop(); active = container;
      narrator.start(getText(), {rate: Number(container.querySelector('[data-audio-rate]').value), voice: container.querySelector('[data-audio-voice]').value});
    };
    container.querySelector('[data-audio-stop]').onclick = () => narrator.stop();
    for (const select of container.querySelectorAll('select')) select.onchange = () => { if (active === container) narrator.stop(); };
  }
  synth?.addEventListener('voiceschanged', () => document.querySelectorAll('.audio-controls').forEach(c => c.updateVoices?.()));
  window.AtlasAudio = { mount, stop: () => narrator.stop() };
  window.addEventListener('pagehide', () => narrator.stop());
  document.addEventListener('visibilitychange', () => { if (document.hidden) narrator.stop(); });
})();
