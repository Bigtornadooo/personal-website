/* ============================================================================
   Bespoke page-local script. Does not touch scrollcraft.js.

   Two independent pieces:
   1. The signature move: a live git-log of the page itself. Every entry is
      real markup present from load (see .log-line in index.html); this
      script only promotes entries from "queued" to "committed", moves the
      HEAD marker, and lets a click jump to the section a commit belongs to.
   2. The Live-Sync demo: a connecting line whose fill tracks scroll
      progress through the seven real-screenshot stages, plus an append-only
      "lit" state per stage. Supporting craft for one section, not the
      site's signature move.

   Reduced motion and no-JS both still show complete, readable content in
   either piece: the log rail's queued state and the demo's plain stage text
   carry the meaning without the animation.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = (window.ScrollCraft && ScrollCraft.reduce) ||
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };

  /* ---------------------------------------------------------- the log rail */
  (function initLog() {
    var lines = Array.prototype.slice.call(document.querySelectorAll(".log-line"));
    if (!lines.length) return;

    var list = document.querySelector(".log-rail__list");
    var railState = document.querySelector(".log-rail");

    // FNV-1a 32-bit over each commit's own message text: the "hash" beside
    // it is a real deterministic function of the content it labels, not a
    // decorative random string.
    function fnv1a(str) {
      var h = 0x811c9dc5;
      for (var i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
      }
      return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
    }

    var targets = [];
    lines.forEach(function (line, i) {
      var hashEl = line.querySelector(".hash");
      var msgEl = line.querySelector(".msg");
      if (hashEl && msgEl) hashEl.textContent = fnv1a(msgEl.textContent.trim());
      var id = line.getAttribute("data-target");
      var el = id && document.getElementById(id);
      line.dataset.index = i;
      if (el) targets.push({ el: el, line: line, i: i });
    });

    var maxCommitted = -1;
    var headIndex = -1;

    function setHead(i) {
      if (i === headIndex) return;
      headIndex = i;
      lines.forEach(function (l, li) { l.classList.toggle("is-head", li === i); });
      if (list && i > -1 && !reduce) {
        var el = lines[i];
        var top = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2;
        list.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
      if (railState) {
        railState.setAttribute("data-sc-verify-state",
          "committed:" + (maxCommitted + 1) + "/" + lines.length + " head:" + i);
      }
    }
    function commitUpTo(i) {
      if (i <= maxCommitted) return;
      for (var k = maxCommitted + 1; k <= i; k++) lines[k].classList.add("is-committed");
      maxCommitted = i;
    }

    // Entry 0 is already on screen at load. Ground it rather than leaving
    // the log empty for the first viewport.
    commitUpTo(0);
    setHead(0);

    if ("IntersectionObserver" in window && targets.length) {
      // Track which markers sit inside the thin centre band, and treat the
      // highest-index one as HEAD. Correct in both scroll directions
      // without guessing direction from one entry's rect.
      var inBand = new Set();
      function recompute() {
        if (!inBand.size) return;
        var maxI = Math.max.apply(null, Array.from(inBand));
        commitUpTo(maxI);
        setHead(maxI);
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var t = targets.find(function (t) { return t.el === e.target; });
          if (!t) return;
          if (e.isIntersecting) inBand.add(t.i); else inBand.delete(t.i);
        });
        recompute();
      }, { rootMargin: "-42% 0px -50% 0px", threshold: 0 });
      targets.forEach(function (t) { io.observe(t.el); });
    } else {
      commitUpTo(lines.length - 1);
      setHead(lines.length - 1);
    }

    lines.forEach(function (line) {
      line.addEventListener("click", function (ev) {
        var id = line.getAttribute("data-target");
        var el = id && document.getElementById(id);
        if (!el) return;
        ev.preventDefault();
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", "#" + id);
      });
    });
  })();

  /* -------------------------------------------------------- Live-Sync demo */
  (function initDemo() {
    var demo = document.querySelector(".demo");
    if (!demo) return;
    var fill = demo.querySelector(".demo-line__fill");
    var stages = Array.prototype.slice.call(demo.querySelectorAll(".demo-stage"));

    function update() {
      if (!fill) return;
      var rect = demo.getBoundingClientRect();
      var vh = window.innerHeight;
      var ref = vh * 0.45; // same band convention as the log rail
      var p = rect.height > 0 ? clamp01((ref - rect.top) / rect.height) : 0;
      fill.style.transform = "scaleY(" + p.toFixed(4) + ")";
      demo.setAttribute("data-sc-verify-state", "p:" + p.toFixed(2));
    }

    if (!reduce) {
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { update(); ticking = false; });
      }, { passive: true });
      window.addEventListener("resize", update);
      update();
    } else if (fill) {
      fill.style.transform = "scaleY(1)";
    }

    // A small bespoke count-up for the one real figure in the demo (the
    // routing stage's 80%+ inference-cost cut). Deliberately NOT the
    // engine's data-sc-count: that element sits inside a tall data-sc-act
    // flow section, so the engine's own scrubbed-by-section-progress window
    // would fire it early, well before the reader has actually scrolled to
    // the routing stage. Triggered once, off the same "is-lit" moment as
    // the stage itself, so the number lands exactly when the stage does.
    var counted = false;
    function runCount(el) {
      if (counted) return;
      counted = true;
      var spec = (el.getAttribute("data-demo-count") || "0 0").split(/\s+/).map(Number);
      var from = spec[0] || 0, to = spec[1] || 0;
      if (reduce) { el.textContent = to; return; }
      var start = null, dur = 1300;
      var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
      function frame(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        el.textContent = Math.round(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-lit");
          var countEl = e.target.querySelector("[data-demo-count]");
          if (countEl) runCount(countEl);
        });
      }, { rootMargin: "-30% 0px -40% 0px", threshold: 0 });
      stages.forEach(function (s) { io.observe(s); });
    } else {
      stages.forEach(function (s) {
        s.classList.add("is-lit");
        var countEl = s.querySelector("[data-demo-count]");
        if (countEl) runCount(countEl);
      });
    }
  })();
})();
