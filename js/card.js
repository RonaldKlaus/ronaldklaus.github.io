/* Visitenkarte · turn, tilt, sheen, the one-time turn hint and the dark-card dot (see REDESIGN.md, section 6).
 * Language-neutral: the hidden turn button carries its labels in data-label-front / data-label-back.
 * URL parameters for comparisons: ?side=back shows the back, ?tilt=0.5,-0.3 freezes the tilt.
 * #back opens the card on the back without turning (used by the language switch on the back);
 * the hash follows the visible side via history.replaceState, so reloading keeps the side.
 * Defensive: if markup from another version is cached alongside this file, missing parts are
 * skipped instead of aborting, so at least turning by click/tap keeps working.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var card = document.querySelector('.card');
  if (!card) return;

  var stage = document.querySelector('.stage') || document.body;
  var front = card.querySelector('.face.front');
  var back = card.querySelector('.face.back');
  var srButton = document.querySelector('.turn-sr');
  var params = new URLSearchParams(location.search);
  var root = document.documentElement;
  var BACK_HASH = '#back';
  var flipped = params.get('side') === 'back' || location.hash === BACK_HASH;
  var fixedTilt = params.get('tilt');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var TURN_MS = 900;
  var HINT_DELAY_MS = 1000;
  var STORAGE_KEY = 'rk-card-turned';
  var INTERACTIVE = 'a, button, input, select, textarea, label, summary, [tabindex], [contenteditable]';
  var tx = 0;
  var ty = 0;
  var frame = 0;
  var turnTimer = 0;
  var hintTimer = 0;

  if (fixedTilt) {
    var parts = fixedTilt.split(',');
    tx = clamp(parseFloat(parts[0]) || 0);
    ty = clamp(parseFloat(parts[1]) || 0);
  }

  function clamp(v) {
    return Math.max(-1, Math.min(1, v));
  }

  function tiltEnabled() {
    return !fixedTilt && finePointer.matches && !reducedMotion.matches;
  }

  function render() {
    frame = 0;
    var s = card.style;
    s.setProperty('--rx', -ty * 8 + 'deg');
    s.setProperty('--ry', (flipped ? 180 : 0) + tx * 12 + 'deg');
    s.setProperty('--gx', 50 + tx * 45 + '%');
    s.setProperty('--gy', 50 + ty * 45 + '%');
    s.setProperty('--band', 50 + tx * 40 + '%');
    s.setProperty('--shx', -tx * 24 + 'px');
    s.setProperty('--shy', 36 - ty * 16 + 'px');
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  // The hidden face is inert (not focusable, not announced) and ignores pointer events via CSS.
  function applySide() {
    if (front) front.inert = flipped;
    if (back) back.inert = !flipped;
    if (srButton) {
      var label = flipped ? srButton.dataset.labelBack : srButton.dataset.labelFront;
      if (label) {
        srButton.setAttribute('aria-label', label);
        srButton.textContent = label;
      }
    }
  }

  function storageGet() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function storageSet() {
    try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* private mode etc. */ }
  }

  function stopHint() {
    clearTimeout(hintTimer);
    card.classList.remove('hint');
  }

  // Only the side hash is managed; any other fragment is left alone.
  function syncHash() {
    if (location.hash && location.hash !== BACK_HASH) return;
    if (!window.history || !history.replaceState) return;
    var url = location.pathname + location.search + (flipped ? BACK_HASH : '');
    try { history.replaceState(history.state, '', url); } catch (e) { /* sandboxed etc. */ }
  }

  function turn() {
    var hiddenFace = flipped ? back : front; // the face that is about to be hidden
    var focused = document.activeElement;
    var focusWillBeLost = !!(hiddenFace && focused && hiddenFace.contains(focused));

    stopHint();
    storageSet();
    flipped = !flipped;
    card.classList.add('turning');
    clearTimeout(turnTimer);
    turnTimer = setTimeout(function () {
      card.classList.remove('turning');
    }, TURN_MS);
    applySide();
    syncHash();
    schedule();

    // Focus only moves if it sat on the face that just became inert (it would fall to <body>).
    // Never on a plain tap: programmatic focus from <body> would show a focus ring on mobile.
    if (focusWillBeLost && srButton) srButton.focus({ preventScroll: true });
  }

  // Easter egg: the dot on the front toggles a dark card. A dark copy of the front sits
  // just above the real front. To dark it is revealed by a circle growing out of the dot,
  // then the card itself turns dark and the copy goes. To light the card turns light at
  // once under the copy, and the copy's circle shrinks back into the dot. With reduced
  // motion the copy just fades in or out. Not remembered: a reload is light again.
  var dot = front && front.querySelector('.dot');
  var REVEAL_MS = 650;
  var FADE_MS = 200;
  var dark = false;
  var revealing = false;

  // Offsets, not getBoundingClientRect: the card may be tilted in 3D.
  function offsetWithin(el, ancestor) {
    var x = 0;
    var y = 0;
    while (el && el !== ancestor) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return { x: x, y: y };
  }

  function applyTheme() {
    card.classList.add('theme-swap');
    card.classList.toggle('is-dark', dark);
    dot.setAttribute('aria-pressed', String(dark));
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        card.classList.remove('theme-swap');
      });
    });
  }

  function toggleTheme() {
    if (revealing) return; // a second click mid-animation is ignored
    dark = !dark;
    if (typeof front.animate !== 'function') {
      applyTheme();
      return;
    }

    var copy = front.cloneNode(true);
    copy.classList.add('reveal', 'is-dark');
    copy.removeAttribute('aria-label');
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;

    var keyframes;
    var options;
    if (reducedMotion.matches) {
      keyframes = [{ opacity: 0 }, { opacity: 1 }];
      options = { duration: FADE_MS, easing: 'ease' };
    } else {
      var o = offsetWithin(dot, front);
      var cx = o.x + dot.offsetWidth / 2;
      var cy = o.y + dot.offsetHeight / 2;
      var w = front.offsetWidth;
      var h = front.offsetHeight;
      var r = Math.ceil(Math.sqrt(Math.pow(Math.max(cx, w - cx), 2) + Math.pow(Math.max(cy, h - cy), 2))) + 1;
      var at = ' at ' + cx + 'px ' + cy + 'px)';
      keyframes = [{ clipPath: 'circle(0px' + at }, { clipPath: 'circle(' + r + 'px' + at }];
      options = { duration: REVEAL_MS, easing: 'cubic-bezier(.65, 0, .35, 1)' };
    }
    options.fill = 'both';
    if (!dark) {
      keyframes.reverse();
    }

    revealing = true;
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (dark) applyTheme();
      copy.remove();
      revealing = false;
    }

    // Insert, start the animation and (to light) swap the card in the same task,
    // so no frame shows the light card without the dark copy on top.
    card.insertBefore(copy, front.nextSibling);
    try {
      copy.animate(keyframes, options).onfinish = finish;
    } catch (e) {
      if (!dark) applyTheme();
      finish();
      return;
    }
    if (!dark) applyTheme();
    setTimeout(finish, (reducedMotion.matches ? FADE_MS : REVEAL_MS) + 500); // safety net if onfinish never fires
  }

  if (dot) {
    dot.disabled = false; // disabled in the markup so it is inert without JS
    dot.addEventListener('click', function (e) {
      e.stopPropagation(); // never turns the card
      toggleTheme();
    });
  }

  stage.addEventListener('mousemove', function (e) {
    if (!tiltEnabled()) return;
    var r = stage.getBoundingClientRect();
    tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
    ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
    schedule();
  });

  stage.addEventListener('mouseleave', function () {
    if (!tiltEnabled()) return;
    tx = 0;
    ty = 0;
    schedule();
  });

  // Turning off tilt mid-session (e.g. reduced motion switched on) recentres the card.
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', function () {
      if (reducedMotion.matches) stopHint();
      if (!tiltEnabled() && !fixedTilt) {
        tx = 0;
        ty = 0;
        schedule();
      }
    });
  }

  // Keyboard / screen-reader control. Focus stays on it after turning.
  if (srButton) srButton.addEventListener('click', turn);

  // Main way: click or tap on the card. Only 'click' is used, so a tap fires once and
  // scrolling never turns the card. The turn indicator has pointer-events: none.
  card.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.target.closest && e.target.closest(INTERACTIVE)) return; // links just do their job
    var selection = window.getSelection && window.getSelection();
    if (selection && !selection.isCollapsed && selection.toString().trim() !== '') return; // user is selecting text
    turn();
  });

  // Someone edits the URL or follows an in-page link to #back (or away from it).
  window.addEventListener('hashchange', function () {
    var wantBack = location.hash === BACK_HASH;
    if (wantBack !== flipped && (wantBack || !location.hash)) turn();
  });

  // One-time hint: a short wiggle about the Y axis, added on top of the tilt (--wiggle).
  // Skipped for reduced motion, comparison URLs, visitors who have turned the card before,
  // and browsers without @property (the keyframes would jump instead of easing).
  card.addEventListener('animationend', function () {
    card.classList.remove('hint');
  });

  var hintAllowed = !flipped && !fixedTilt && !params.has('side') && !reducedMotion.matches &&
    !storageGet() && window.CSS && typeof CSS.registerProperty === 'function';
  if (hintAllowed) {
    hintTimer = setTimeout(function () {
      if (!flipped && !reducedMotion.matches) card.classList.add('hint');
    }, HINT_DELAY_MS);
  }

  // Starting on the back (#back or ?side=back): show it without the turn animation.
  // The inline script in <head> already sets .start-back for #back to avoid a flash of the front.
  if (flipped) root.classList.add('start-back');
  applySide();
  render();
  if (root.classList.contains('start-back')) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('start-back');
      });
    });
  }
})();
