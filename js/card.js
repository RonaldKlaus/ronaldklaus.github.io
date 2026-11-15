/* Visitenkarte · turn, tilt, sheen and the one-time turn hint (see REDESIGN.md, section 6).
 * Language-neutral: each face carries its own turn icon with a static aria-label in the HTML.
 * URL parameters for comparisons: ?side=back shows the back, ?tilt=0.5,-0.3 freezes the tilt.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var stage = document.querySelector('.stage');
  var card = document.querySelector('.card');
  var front = document.querySelector('.face.front');
  var back = document.querySelector('.face.back');
  if (!stage || !card || !front || !back) return;

  var frontIcon = front.querySelector('.turn-icon');
  var backIcon = back.querySelector('.turn-icon');
  var params = new URLSearchParams(location.search);
  var flipped = params.get('side') === 'back';
  var fixedTilt = params.get('tilt');
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');
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
    front.inert = flipped;
    back.inert = !flipped;
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

  function turn(fromIcon) {
    var hiddenFace = flipped ? back : front; // the face that is about to be hidden
    var focused = document.activeElement;
    // A pointer-down on plain card text already moved focus to <body>; hand it to the new icon too.
    var moveFocus = fromIcon || !focused || focused === document.body || hiddenFace.contains(focused);

    stopHint();
    storageSet();
    flipped = !flipped;
    card.classList.add('turning');
    clearTimeout(turnTimer);
    turnTimer = setTimeout(function () {
      card.classList.remove('turning');
    }, TURN_MS);
    applySide();
    schedule();

    // Never lose focus to <body> when the focused element just became inert.
    // :focus-visible decides whether a ring shows (keyboard yes, mouse/touch no).
    if (moveFocus) {
      var icon = flipped ? backIcon : frontIcon;
      if (icon) icon.focus({ preventScroll: true });
    }
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
  reducedMotion.addEventListener('change', function () {
    if (reducedMotion.matches) stopHint();
    if (!tiltEnabled() && !fixedTilt) {
      tx = 0;
      ty = 0;
      schedule();
    }
  });

  // The turn icons are the accessible controls (keyboard, screen readers).
  [frontIcon, backIcon].forEach(function (icon) {
    if (icon) icon.addEventListener('click', function () { turn(true); });
  });

  // A click or tap on a free area of the card turns it too. Only 'click' is used,
  // so a tap fires once and scrolling never turns the card.
  card.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.target.closest(INTERACTIVE)) return; // links and the icons handle themselves
    var selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.toString().trim() !== '') return; // user is selecting text
    turn(false);
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

  applySide();
  render();
})();
