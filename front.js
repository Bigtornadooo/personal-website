/* Front page: drop the "Reviews" nav link while there are no mod reviews
   (mods.js removes the #mods chapter in that case). */
(function () {
  "use strict";
  if (!document.getElementById("mods")) {
    var link = document.querySelector("[data-mods-link]");
    if (link) link.remove();
  }
})();
