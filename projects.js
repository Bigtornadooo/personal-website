/* ============================================================================
   Projects rail + detail panels.

   Rail: the section is a tall wrapper (height = track overflow + 100vh) with a
   sticky 100vh panel inside. While the panel is pinned, vertical scroll is
   mapped to translateX on the track, so the five cards slide right to left;
   once the last card has passed, the wrapper ends and normal scroll resumes.
   Measurements happen on load / resize only; the scroll handler just reads
   scrollY inside requestAnimationFrame and writes one transform.

   No scroll-jacking on narrow screens (< 768px) or with reduced motion: the
   track becomes a normal swipeable row with scroll-snap (CSS: .pr--free).

   Detail panels (Live-Sync walkthrough, Claim! demo) sit directly below the
   rail and are hidden until their card's button is pressed. Back (or Escape)
   hides the panel and returns to the exact scroll position on the rail.
   ========================================================================== */
(function () {
  "use strict";
  var section = document.getElementById("projects");
  if (!section) return;
  var viewport = section.querySelector(".pr-viewport");
  var track = section.querySelector(".pr-track");
  var hint = section.querySelector(".pr-hint");
  var mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  var mqNarrow = matchMedia("(max-width: 767px)");

  var top = 0, maxX = 0, pinned = false, ticking = false, lastX = null;

  function measure() {
    pinned = !mqReduce.matches && !mqNarrow.matches;
    section.classList.toggle("pr--free", !pinned);
    if (hint) hint.textContent = pinned ? "Scroll to browse" : (mqNarrow.matches ? "Swipe to browse" : "Scroll sideways to browse");
    if (!pinned) {
      section.style.height = "";
      track.style.transform = "";
      lastX = null;
      return;
    }
    maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
    section.style.height = (maxX + window.innerHeight) + "px";
    top = section.getBoundingClientRect().top + window.scrollY;
    lastX = null;
    update();
  }

  function update() {
    ticking = false;
    if (!pinned) return;
    var p = maxX ? (window.scrollY - top) / maxX : 0;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    var x = Math.round(p * maxX);
    if (x !== lastX) {
      track.style.transform = "translate3d(" + (-x) + "px,0,0)";
      lastX = x;
    }
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  var resizeQueued = false;
  function queueMeasure() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(function () { resizeQueued = false; measure(); });
  }
  window.addEventListener("resize", queueMeasure);
  window.addEventListener("load", queueMeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueMeasure);
  [mqReduce, mqNarrow].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener("change", queueMeasure);
    else if (mq.addListener) mq.addListener(queueMeasure);
  });
  measure();

  // Keyboard: tabbing to a card that is off to the side scrolls the page so the card slides into view.
  track.addEventListener("focusin", function (e) {
    if (!pinned) return;
    var card = e.target.closest(".pr-card");
    if (!card) return;
    var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    var x = Math.min(maxX, Math.max(0, card.offsetLeft - pad));
    var y = top + x;
    if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: "auto" });
  });

  /* ------------------------------------------------------- detail panels */
  var open = null; // { panel, button, y }

  function loadMedia(panel) {
    // GIFs are only requested once their panel is opened (the full run waits for its own toggle).
    panel.querySelectorAll("img[data-src]").forEach(function (img) {
      if (img.closest("details")) return;
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }

  function openDetail(button) {
    var panel = document.getElementById(button.getAttribute("data-detail"));
    if (!panel) return;
    if (open) closeDetail(false);
    open = { panel: panel, button: button, y: window.scrollY };
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    loadMedia(panel);
    // Let other scripts (the Live-Sync timeline) re-measure now that the panel has a size.
    window.dispatchEvent(new Event("resize"));
    var y = panel.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: mqReduce.matches ? "auto" : "smooth" });
    var back = panel.querySelector(".pr-back");
    if (back) back.focus({ preventScroll: true });
  }

  function closeDetail(restore) {
    if (!open) return;
    var o = open;
    open = null;
    o.panel.hidden = true;
    o.button.setAttribute("aria-expanded", "false");
    if (restore !== false) {
      window.scrollTo({ top: o.y, behavior: "auto" });
      o.button.focus({ preventScroll: true });
    }
  }

  section.querySelectorAll(".pr-open").forEach(function (b) {
    b.addEventListener("click", function () { openDetail(b); });
  });
  document.querySelectorAll(".pr-detail .pr-back").forEach(function (b) {
    b.addEventListener("click", function () { closeDetail(); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) { e.preventDefault(); closeDetail(); }
  });

  // The full 65 second run loads only when its toggle is opened.
  document.querySelectorAll(".claim-full").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      d.querySelectorAll("img[data-src]").forEach(function (img) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      });
    });
  });
})();
