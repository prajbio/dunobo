window.ATLAS_VIDEOS = [
  {id:'r4813IYxSYc',title:'Are Neanderthals and modern humans related?',channel:'Natural History Museum',description:'A museum explainer on the relationship between Neanderthals and our species.',events:['neanmix','oase','bacho','vindija','altai','denny','chagyrskaya','kebara','elsidron','chapelle'],topic:'Related topic · human relationships'},
  {id:'tSEasJzhWUM',title:'In Search of Denisovans in the Altai Mountains',channel:'Smithsonian’s National Museum of Natural History',description:'A Human Origins Today talk about investigating Denisovans in the Altai Mountains.',events:['denny','altai','xiahe','harbin','penghu','denmix'],topic:'Research talk · Denisovan discoveries'},
  {id:'GMr-Fhb5gEs',title:'Your Inner Neanderthal: Neanderthal and Denisovan DNA in Modern Human Genomes',channel:'Smithsonian’s National Museum of Natural History',description:'A research talk about ancient ancestry preserved in modern genomes.',events:['neanmix','denmix','deneast','africareturn','epas','wallacea','oase','ustishim'],topic:'Related topic · ancient ancestry'}
,
  {id:'ejClEYGOqnY',title:'The oldest human footprints in Europe',channel:'Natural History Museum',description:'Follow the museum team investigating ancient footprints at Happisburgh, Norfolk.',events:['laetoli','white'],topic:'Related discovery · Happisburgh footprints'}
];
window.AtlasVideo = {stop(root=document) {
  root.querySelectorAll('[data-video-slot] iframe').forEach(frame=>{
    const card=frame.closest('.video-card');frame.remove();const button=card?.querySelector('[data-video-play]');if(button)button.hidden=false;
  });
}};
function videoHtml(e) {
  const videos=window.ATLAS_VIDEOS.filter(v=>v.events.includes(e.id));
  if(!videos.length)return '';
  return `<section class="video-section"><h3>WATCH & EXPLORE</h3><p class="image-note">Museum explainers and research talks add context. The publications above support this record; a related video may discuss the broader topic or reflect an earlier stage of research.</p>${videos.map(v=>`<article class="video-card"><span class="eyebrow">${esc(v.topic)}</span><h4>${esc(v.title)}</h4><p>${esc(v.channel)}</p><p>${esc(v.description)}</p><div data-video-slot="${v.id}"></div><button data-video-play="${v.id}">▶ Play video here</button> <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></article>`).join('')}<p class="image-note">Videos load only when you press Play. YouTube controls captions and playback availability.</p></section>`;
}
function bindVideos(root) {
  root.querySelectorAll('[data-video-play]').forEach(button=>button.onclick=()=>{
    AtlasAudio.stop();AtlasVideo.stop();const v=window.ATLAS_VIDEOS.find(v=>v.id===button.dataset.videoPlay);if(!v)return;
    const slot=root.querySelector('[data-video-slot="'+v.id+'"]');
    const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+v.id+'?rel=0';frame.title=v.title;frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';slot.replaceChildren(frame);button.hidden=true;
  });
}
