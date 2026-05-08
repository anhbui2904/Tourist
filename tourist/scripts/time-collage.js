(function () {
  var base = "../image/";
  var sets = [
    { folder: "toinay", label: "Tonight", files: ["hn1.jpeg", "hn2.jpg", "hn3.jpg", "hn4.jpg", "hn5.jpg"] },
    { folder: "23h", label: "2-3 hours", files: ["231.jpg", "232.jpg", "233.jpg", "234.jpg", "235.jpg"] },
    { folder: "12h", label: "Half day", files: ["121.jpg", "122.jpg", "123.jpg", "124.jpg", "125.jpg"] },
    { folder: "1ngay", label: "1 day", files: ["11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg"] },
    { folder: "cuoituan", label: "Weekend", files: ["ct1.jpg", "ct2.jpg", "ct3.jpg", "ct4.jpg", "ct5.jpg"] },
  ];

  var root = document.querySelector("[data-time-collage]");
  if (!root) return;

  var imgs = [].slice.call(root.querySelectorAll("[data-collage-img]"));
  var labelEl = document.getElementById("wl-time-label");
  var prevBtn = root.querySelector("[data-time-prev]");
  var nextBtn = root.querySelector("[data-time-next]");
  if (imgs.length !== 5 || !labelEl || !prevBtn || !nextBtn) return;

  var idx = 0;

  function apply() {
    var s = sets[idx];
    labelEl.textContent = s.label;
    for (var i = 0; i < 5; i++) {
      imgs[i].src = base + s.folder + "/" + s.files[i];
      imgs[i].alt = s.label + " — photo " + (i + 1);
    }
  }

  function prev() {
    idx = (idx - 1 + sets.length) % sets.length;
    apply();
  }

  function next() {
    idx = (idx + 1) % sets.length;
    apply();
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  apply();
})();
