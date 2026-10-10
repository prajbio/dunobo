/* A deliberate locate action is stronger than the gentle focus used while browsing. */
(function () {
  let located = null;
  const banner = document.createElement('section');
  banner.className = 'map-location'; banner.hidden = true;
  banner.setAttribute('aria-label', 'Located discovery');
  banner.innerHTML = '<div role="status"><span class="eyebrow">LOCATION FOUND</span><strong></strong><small></small></div><button data-location-open>Back to discovery</button><button data-location-close aria-label="Dismiss location highlight">✕</button>';
  document.querySelector('.map-shell').append(banner);
  const ring = svgEl('g', {id:'locatedMarker','pointer-events':'none','aria-hidden':'true'}, $('#map'));
  window.clearMapLocation = () => {
    located = null; window.locatedRecordId = null; banner.hidden = true; ring.replaceChildren();
    document.body.classList.remove('located-view');
  };
  window.updateLocationMarker = () => {
    ring.replaceChildren();
    if (!located) return;
    const [x,y] = project(located.xy);
    ring.setAttribute('transform', `translate(${x},${y})`);
    svgEl('circle', {r:27*units,fill:'none',stroke:'#ffe0a2','stroke-width':3,'vector-effect':'non-scaling-stroke'}, ring);
    svgEl('circle', {r:34*units,fill:'none',stroke:'#ffe0a2','stroke-opacity':.4,'stroke-width':1,'vector-effect':'non-scaling-stroke'}, ring);
  };
  window.locateDiscovery = e => {
    if (!e || !Array.isArray(e.xy) || !e.xy.every(Number.isFinite)) return;
    window.AtlasAudio?.stop(); stop(); exploreFreely();
    document.body.classList.remove('focus-mode');
    selectRecord(e.id, false, true); closeBrowse(); closeDetail();
    $('#filterPanel').hidden = true; $('#filtersOpen').setAttribute('aria-expanded','false');
    located = e; window.locatedRecordId = e.id;
    zoomScale = Math.max(zoomScale, e.locType === 'site' ? 10 : 3);
    view.w = baseWidth / zoomScale;
    const [x,y] = project(e.xy); view.cx = x; view.cy = y;
    banner.querySelector('strong').textContent = e.site;
    banner.querySelector('small').textContent = (e.locType === 'site' ? 'Approximate site location' : 'Regional guide, not an exact findspot')+' · '+e.location;
    banner.hidden = false; document.body.classList.add('located-view');
    updateView(); window.updateLocationMarker();
    $('#map').focus({preventScroll:true});
    $('#announce').textContent = 'Zoomed to '+e.site+'. '+(e.locType === 'site' ? 'Approximate location highlighted.' : 'Regional guide highlighted.');
  };
  banner.querySelector('[data-location-open]').onclick = () => { if (located) selectRecord(located.id, false, true); };
  banner.querySelector('[data-location-close]').onclick = () => { window.clearMapLocation(); updateView(); };
})();
