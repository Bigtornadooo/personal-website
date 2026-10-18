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
  var pin = section.querySelector(".pr-pin");
  var hopper = section.querySelector(".pr-hopper");
  var cards = Array.prototype.slice.call(track.querySelectorAll(".pr-card"));
  var spots = [], cardTop = 0, hopW = 0, hopH = 0; // card centres (track coords) and the card top (pin coords)
  var restoringFocus = false; // focus moved back by closeDetail, not by the user tabbing

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
    if (hopper) {
      spots = cards.map(function (c) { return c.offsetLeft + c.offsetWidth / 2; });
      cardTop = cards[0].getBoundingClientRect().top - pin.getBoundingClientRect().top;
      hopW = hopper.offsetWidth; hopH = hopper.offsetHeight;
    }
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
    hop(maxX ? (window.scrollY - top) / maxX : 0);
  }

  /* The Growtopia character hops from card to card, Pixar-lamp style: crouch,
     stretch in the air, squash on landing. Scrolling only decides WHICH card he
     should stand on; each hop is a short timed animation, so he always lands,
     even if the scrolling stops halfway. Pops in at the start, whirls away at the end. */
  var IN = 0.03, OUT = 0.95, HOP = 110, HOP_MS = 560, POP_MS = 380, AWAY_MS = 520;
  var cur = 0, jump = null, vis = 0, visAnim = null, looping = false, lastRaw = -1;

  function hop(raw) { // called from update(): just remember where the scroll is and make sure we animate
    lastRaw = raw;
    if (!looping) { looping = true; requestAnimationFrame(frame); }
  }

  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function frame(now) {
    if (!hopper || !spots.length || !pinned) { looping = false; return; }
    var raw = lastRaw, n = spots.length;
    var want = raw >= 0 && raw <= OUT;                       // should he be on screen?
    var target = Math.round(Math.min(1, Math.max(0, (raw - IN) / (OUT - IN))) * (n - 1));

    // appear / disappear are timed too
    if (want && vis === 0 && !visAnim) { cur = target; jump = null; visAnim = { dir: 1, t0: now }; }
    if (!want && vis === 1 && !visAnim) { visAnim = { dir: -1, t0: now }; }
    var scale = vis, op = vis, spin = 0, lift = 0;
    if (visAnim) {
      var d = visAnim.dir > 0 ? POP_MS : AWAY_MS;
      var a = Math.min(1, (now - visAnim.t0) / d);
      if (visAnim.dir > 0) { scale = a < 0.7 ? a / 0.7 * 1.15 : 1.15 - (a - 0.7) / 0.3 * 0.15; op = Math.min(1, a * 3); }
      else { scale = 1 - a; op = 1 - a; spin = a * 720; lift = -a * 60; }
      if (a >= 1) { vis = visAnim.dir > 0 ? 1 : 0; visAnim = null; }
    }

    // start the next hop (one card at a time, so fast scrolls become a quick series of hops)
    if (vis === 1 && !jump && target !== cur) {
      jump = { from: cur, to: cur + (target > cur ? 1 : -1), t0: now };
    }
    var cx = spots[cur], y = 0, sx = 1, sy = 1, rot = 0, s;
    if (jump) {
      var t = Math.min(1, (now - jump.t0) / HOP_MS), dir = jump.to > jump.from ? 1 : -1;
      var A = spots[jump.from], B = spots[jump.to];
      if (t < 0.2) {                       // crouch
        cx = A; s = Math.sin((t / 0.2) * Math.PI) * 0.22; sy = 1 - s; sx = 1 + s * 0.6;
      } else if (t < 0.8) {                // in the air
        var u = ease((t - 0.2) / 0.6);
        cx = A + (B - A) * u; y = -HOP * 4 * u * (1 - u);
        s = Math.sin(u * Math.PI); sy = 1 + 0.12 * s; sx = 1 - 0.07 * s; rot = dir * (10 - 18 * u);
      } else {                             // land and squash
        cx = B; s = Math.sin(((t - 0.8) / 0.2) * Math.PI) * 0.25; sy = 1 - s; sx = 1 + s * 0.6;
      }
      if (t >= 1) { cur = jump.to; jump = null; }
    }

    var x = lastX || 0;                    // the cards' current slide offset
    var left = cx - x - hopW / 2, topY = cardTop - hopH + y + lift;
    hopper.style.opacity = String(op);
    hopper.style.transform = "translate3d(" + left.toFixed(1) + "px," + topY.toFixed(1) + "px,0) rotate(" + (rot + spin).toFixed(1) +
      "deg) scale(" + (sx * scale).toFixed(3) + "," + (sy * scale).toFixed(3) + ")";

    // keep animating while something is moving; otherwise wait for the next scroll
    if (jump || visAnim || (vis === 1 && target !== cur)) requestAnimationFrame(frame);
    else looping = false;
  }

  // The username section's character pops in when it scrolls into view.
  var why = document.getElementById("why");
  if (why && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es, obs) {
      if (es[0].isIntersecting) { why.classList.add("is-in"); obs.disconnect(); }
    }, { threshold: 0.35 }).observe(why);
  } else if (why) why.classList.add("is-in");

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
    if (!pinned || restoringFocus) return;
    var card = e.target.closest(".pr-card");
    if (!card) return;
    var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    var x = Math.min(maxX, Math.max(0, card.offsetLeft - pad));
    var y = top + x;
    if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: "instant" });
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
      window.scrollTo({ top: o.y, behavior: "instant" }); // the site sets scroll-behavior: smooth, so "auto" would animate
      restoringFocus = true;
      o.button.focus({ preventScroll: true });
      restoringFocus = false;
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
