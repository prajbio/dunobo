/* No silent refresh: keep a visitor's place until they choose to update. */
(function () {
  'use strict';
  const version = 15;
  const buttons = [...document.querySelectorAll('[data-release-open]')];
  let latest = version, checking = null, checked = false, failed = false;
  const dialog = document.createElement('dialog');
  dialog.className = 'release-dialog';
  dialog.setAttribute('aria-labelledby', 'releaseTitle');
  dialog.innerHTML = '<button class="release-close" aria-label="Close updates">✕</button><span class="release-kicker">HUMAN ATLAS · EDITION '+version+'</span><h2 id="releaseTitle">A clearer, more reliable atlas.</h2><p>This edition improves story links, narration controls, saved-progress clearing and privacy information.</p><ul><li><strong>13 stories</strong> with evidence and publication links at every stop.</li><li><strong>5,590 evidence records available</strong> across the curated atlas, ROAD archaeology and AADR ancient-DNA metadata. Imported records have different review levels; this is not all published research.</li><li><strong>Clue Club for under 12s</strong>: eighteen discoveries in 54 chapters, six themed journeys and locally hosted AI narration. Jump to a chapter, change the pace and listen to each detective answer.</li><li><strong>Research image galleries</strong> with original captions, source links and licences. Verified locality images are distinguished from broader publication figures.</li><li><strong>Locate on map</strong> now centres, zooms and names the selected discovery. Return to its evidence with one tap.</li><li>An image coverage audit explains what is available and what still needs review.</li></ul><div class="release-actions"><a href="kids.html">Explore Clue Club →</a><a href="index.html#story=overview&stop=1">Open the guided atlas →</a></div><p class="release-status" role="status" aria-live="polite"></p><div class="release-actions"><button data-check-release>Check for updates</button><button data-refresh-release>Refresh this page</button></div><p class="release-note">Refresh keeps your story or discovery link. Clue Club progress stays in this browser. Map filters may reset. Clue Club uses the same recorded AI voice on phones and computers; device voices remain an option.</p>';
  document.body.append(dialog);
  const status = dialog.querySelector('.release-status');
  const checkButton = dialog.querySelector('[data-check-release]');
  const refreshButton = dialog.querySelector('[data-refresh-release]');
  function renderStatus() {
    status.textContent = checking ? 'Checking for a newer edition…' : failed ? 'Could not check for updates. You can keep exploring and try again when connected.' : latest > version ? 'Edition '+latest+' is available. Refresh when you are ready; your story link will be kept.' : checked ? 'Edition '+version+' is the latest available edition.' : 'You are viewing edition '+version+'.';
    checkButton.disabled = !!checking;
    refreshButton.textContent = latest > version ? 'Load edition '+latest : 'Refresh this page';
    buttons.forEach(button => {
      button.textContent = latest > version ? 'Update ready' : 'Edition '+version;
      button.setAttribute('aria-label', latest > version ? 'A new atlas edition is available. Open updates.' : 'Edition '+version+': what’s new and check for updates');
      button.classList.toggle('update-ready', latest > version);
    });
  }
  async function check() {
    if (checking) return checking;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    failed = false;
    checking = Promise.resolve().then(async () => {
      try {
        const response = await fetch('release.json?check='+Date.now(), {cache:'no-store', signal:controller.signal});
        if (!response.ok) throw Error('Update check unavailable');
        const release = await response.json();
        if (!Number.isSafeInteger(release.version) || release.version < 1) throw Error('Invalid edition');
        latest = Math.max(version, release.version); checked = true;
      } catch { failed = true; }
      finally { clearTimeout(timeout); checking = null; renderStatus(); }
    });
    renderStatus();
    return checking;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    window.AtlasAudio?.stop(); window.AtlasVideo?.stop(); window.KidsNarration?.stop();
    renderStatus(); dialog.showModal(); check();
  }));
  dialog.querySelector('.release-close').onclick = () => dialog.close();
  checkButton.onclick = check;
  refreshButton.onclick = () => {
    const url = new URL(location.href);
    url.searchParams.set('atlas_release', latest+'-'+Date.now());
    location.replace(url.href);
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  window.addEventListener('pageshow', () => check());
  renderStatus(); check();
})();
