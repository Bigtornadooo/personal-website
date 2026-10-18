/* Front page: hide the career-log rail while the front page is on screen, and
   drop the "Reviews" nav link while there are no mod reviews (mods.js removes
   the #mods chapter in that case). */
(function () {
  "use strict";
  var front = document.getElementById("front");
  if (!front) return;

  if (!document.getElementById("mods")) {
    var link = document.querySelector("[data-mods-link]");
    if (link) link.remove();
  }

  document.body.classList.add("at-front");
  if (!("IntersectionObserver" in window)) { document.body.classList.remove("at-front"); return; }
  new IntersectionObserver(function (entries) {
    // The rail comes in once most of the front page has scrolled away.
    document.body.classList.toggle("at-front", entries[0].intersectionRatio > 0.35);
  }, { threshold: [0, 0.35, 0.6, 1] }).observe(front);
})();
