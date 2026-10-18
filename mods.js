/* ============================================================================
   Bigtornado reviews mods: renders window.MOD_REVIEWS (assets/mod-reviews.js)
   into the #mods chapter. Runs before ScrollCraft.mount so the rendered rows
   are part of the page like any other markup.

   With no reviews in the data file, the chapter and its log-rail entry are
   removed, so an empty section is never published.
   ========================================================================== */
(function () {
  "use strict";

  var section = document.getElementById("mods");
  var reviews = (window.MOD_REVIEWS || []).filter(function (r) { return r && r.code; });
  if (!section) return;
  if (!reviews.length) {
    section.remove();
    var entry = document.querySelector('.log-line[data-target="mods-mark"]');
    if (entry) entry.closest("li").remove();
    return;
  }

  var RATINGS = [
    ["workload", "Workload"],
    ["difficulty", "Difficulty"],
    ["worth", "Worth it"],
  ];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function filled(s) { return typeof s === "string" ? s.trim() !== "" : s != null; }

  function pips(value) {
    var v = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
    var box = el("span", "pips");
    box.setAttribute("aria-hidden", "true");
    for (var i = 1; i <= 5; i++) box.appendChild(el("i", i <= v ? "on" : ""));
    return box;
  }

  function ratingsBlock(r) {
    var dl = el("dl", "mod-ratings");
    RATINGS.forEach(function (pair) {
      var v = r.ratings && r.ratings[pair[0]];
      if (!filled(v)) return;
      var row = el("div", "mod-rating");
      row.appendChild(el("dt", "", pair[1]));
      var dd = el("dd");
      dd.appendChild(pips(v));
      dd.appendChild(el("span", "sr", v + " of 5"));
      row.appendChild(dd);
      dl.appendChild(row);
    });
    return dl;
  }

  // The breakdown: one bar split by weight, then each component with its note.
  // Without weights (only the reviewer's own scores) it shows the list alone.
  function breakdown(components) {
    var weighted = components.every(function (c) { return filled(c.weight) && Number(c.weight) > 0; });
    var wrap = el("div", "mod-breakdown");
    wrap.appendChild(el("h4", "", weighted ? "Where the marks go" : "How it went"));
    if (!weighted) {
      var plain = el("ol", "weight-list weight-list--plain");
      components.forEach(function (c) {
        var li = el("li");
        var head = el("div", "comp-head comp-head--plain");
        head.appendChild(el("span", "comp-name", c.name));
        if (filled(c.score)) head.appendChild(el("span", "comp-score", c.score));
        li.appendChild(head);
        if (filled(c.note)) li.appendChild(el("p", "comp-note comp-note--plain", c.note));
        plain.appendChild(li);
      });
      wrap.appendChild(plain);
      return wrap;
    }
    var total = components.reduce(function (a, c) { return a + (Number(c.weight) || 0); }, 0) || 1;
    var bar = el("div", "weight-bar");
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", components.map(function (c) { return c.name + " " + c.weight + "%"; }).join(", "));
    var list = el("ol", "weight-list");
    components.forEach(function (c, i) {
      var tone = "t" + (i % 5);
      var seg = el("span", "seg " + tone);
      seg.style.flexGrow = String(Number(c.weight) || 0);
      seg.style.flexBasis = "0";
      if ((Number(c.weight) || 0) / total >= 0.12) seg.textContent = c.weight + "%";
      bar.appendChild(seg);

      var li = el("li");
      var head = el("div", "comp-head");
      head.appendChild(el("span", "swatch " + tone));
      head.appendChild(el("span", "comp-name", c.name));
      head.appendChild(el("span", "comp-w", c.weight + "%" + (filled(c.score) ? ", " + c.score : "")));
      li.appendChild(head);
      if (filled(c.note)) li.appendChild(el("p", "comp-note", c.note));
      list.appendChild(li);
    });
    if (Math.round(total) !== 100) {
      wrap.appendChild(el("p", "mod-warn", "Weights add up to " + total + "%, not 100%."));
    }
    wrap.appendChild(bar);
    wrap.appendChild(list);
    return wrap;
  }

  function renderReview(r, i) {
    var item = el("details", "mod");
    item.id = "mod-" + String(r.code).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (i === 0) item.open = true;

    var sum = el("summary", "mod-summary");
    sum.appendChild(el("span", "mod-code", r.code));
    var mid = el("span", "mod-head");
    mid.appendChild(el("span", "mod-title", r.title || ""));
    if (filled(r.verdict)) mid.appendChild(el("span", "mod-verdict", r.verdict));
    sum.appendChild(mid);
    var hasRatings = r.ratings && RATINGS.some(function (pair) { return filled(r.ratings[pair[0]]); });
    if (hasRatings) sum.appendChild(ratingsBlock(r));
    else if (filled(r.grade)) {
      var g = el("span", "mod-grade", r.grade);
      g.setAttribute("aria-label", "Final grade " + r.grade);
      sum.appendChild(g);
    } else sum.appendChild(el("span"));
    sum.appendChild(el("span", "mod-toggle"));
    item.appendChild(sum);

    var body = el("div", "mod-body");
    var meta = el("dl", "mod-meta");
    [["Taken", r.taken], ["Units", filled(r.mcs) ? r.mcs + " MCs" : ""], ["Grade", r.grade], ["Updated", r.updated]]
      .forEach(function (p) {
        if (!filled(p[1])) return;
        var row = el("div");
        row.appendChild(el("dt", "", p[0]));
        row.appendChild(el("dd", "", p[1]));
        meta.appendChild(row);
      });
    body.appendChild(meta);

    var main = el("div", "mod-main");
    (r.review || []).filter(filled).forEach(function (p) { main.appendChild(el("p", "mod-p", p)); });
    if (r.components && r.components.length) main.appendChild(breakdown(r.components));

    if (filled(r.takeIf) || filled(r.skipIf)) {
      var fit = el("div", "mod-fit");
      if (filled(r.takeIf)) { var a = el("div", "fit take"); a.appendChild(el("h4", "", "Take it if")); a.appendChild(el("p", "", r.takeIf)); fit.appendChild(a); }
      if (filled(r.skipIf)) { var b = el("div", "fit skip"); b.appendChild(el("h4", "", "Think twice if")); b.appendChild(el("p", "", r.skipIf)); fit.appendChild(b); }
      main.appendChild(fit);
    }
    var tips = (r.tips || []).filter(filled);
    if (tips.length) {
      var t = el("div", "mod-tips");
      t.appendChild(el("h4", "", "If you take it"));
      var ul = el("ul");
      tips.forEach(function (x) { ul.appendChild(el("li", "", x)); });
      t.appendChild(ul);
      main.appendChild(t);
    }
    body.appendChild(main);
    item.appendChild(body);
    return item;
  }

  var list = section.querySelector(".mod-list");
  reviews.forEach(function (r, i) { list.appendChild(renderReview(r, i)); });

  // reviews.html#mod-ma1522 (from the cards on the main page): open that review and go to it.
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    if (!target || !target.classList.contains("mod")) return;
    list.querySelectorAll(".mod").forEach(function (m) { m.open = m === target; m.classList.toggle("is-target", m === target); });
    requestAnimationFrame(function () { target.scrollIntoView({ block: "start" }); });
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
  section.querySelector(".mod-count").textContent =
    reviews.length === 1 ? "1 module reviewed" : reviews.length + " modules reviewed";
})();
