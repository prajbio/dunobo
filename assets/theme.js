// Apply the saved choice before the page paints. Light is the Dunobo default.
(() => {
  const key='dunobo-theme';
  let theme='light';
  try { if(localStorage.getItem(key)==='dark') theme='dark'; } catch {}
  const apply=value=>{
    const dark=value==='dark';
    document.documentElement.dataset.theme=dark?'dark':'light';
    document.documentElement.style.colorScheme=dark?'dark':'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#101b20':'#ffffff');
    document.querySelectorAll('[data-theme-toggle]').forEach(button=>{
      const label=dark?'Switch to light theme':'Switch to dark theme';
      button.setAttribute('aria-label',label);button.title=label;
      button.querySelector('[data-theme-label]').textContent=dark?'Light':'Dark';
    });
  };
  apply(theme);
  document.addEventListener('DOMContentLoaded',()=>{
    apply(document.documentElement.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button=>button.addEventListener('click',()=>{
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      apply(next);try { localStorage.setItem(key,next); } catch {}
    }));
  });
  window.addEventListener('storage',event=>{if(event.key===key||event.key===null)apply(event.newValue==='dark'?'dark':'light');});
})();
