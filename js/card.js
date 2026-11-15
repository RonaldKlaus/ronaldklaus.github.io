/* Visitenkarte · turn, tilt and sheen (see REDESIGN.md, section 6).
 * Language-neutral: button labels come from data-label-front / data-label-back.
 * URL parameters for comparisons: ?side=back shows the back, ?tilt=0.5,-0.3 freezes the tilt.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var stage = document.querySelector('.stage');
  var card = document.querySelector('.card');
  var front = document.querySelector('.face.front');
  var back = document.querySelector('.face.back');
  var button = document.querySelector('.turn');
  if (!stage || !card || !front || !back || !button) return;

  var label = button.querySelector('.turn-label') || button;
  var params = new URLSearchParams(location.search);
  var flipped = params.get('side') === 'back';
  var fixedTilt = params.get('tilt');
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  var TURN_MS = 900;
  var INTERACTIVE = 'a, button, input, select, textarea, label, summary, [tabindex], [contenteditable]';
  var tx = 0;
  var ty = 0;
  var frame = 0;
  var turnTimer = 0;

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

    front.inert = flipped;
    back.inert = !flipped;
    label.textContent = flipped ? button.dataset.labelBack : button.dataset.labelFront;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
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
    if (!tiltEnabled() && !fixedTilt) {
      tx = 0;
      ty = 0;
      schedule();
    }
  });

  function turn() {
    flipped = !flipped;
    card.classList.add('turning');
    clearTimeout(turnTimer);
    turnTimer = setTimeout(function () {
      card.classList.remove('turning');
    }, TURN_MS);
    schedule();
  }

  // The button stays the accessible control (keyboard, screen readers).
  button.addEventListener('click', turn);

  // A click or tap on a free area of the card turns it too. Only 'click' is used,
  // so a tap fires once and scrolling never turns the card.
  card.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.target.closest(INTERACTIVE)) return; // links etc. just do their job
    var selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.toString().trim() !== '') return; // user is selecting text
    turn();
  });

  render();
})();
