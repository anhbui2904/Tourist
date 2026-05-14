(function () {
  var root = document.querySelector("[data-promo-carousel]");
  if (!root) return;
  var vp = root.querySelector(".wl-promo-carousel__viewport");
  var prev = root.querySelector("[data-promo-prev]");
  var next = root.querySelector("[data-promo-next]");
  if (!vp || !prev || !next) return;

  function rowGapPx() {
    var row = vp.querySelector(".wl-cards-row");
    if (!row) return 25;
    var g = getComputedStyle(row).gap;
    if (g && g !== "normal") {
      var px = parseFloat(g);
      if (!isNaN(px)) return px;
    }
    return 25;
  }

  /**
   * Các mốc scrollLeft. Hàng có thể chỉ có 2 con (Tonight + .wl-promo-duo rất rộng);
   * phải thêm bước cuộn theo “một thẻ” bên trong duo, không thì không tới được poster 1–2h.
   */
  function scrollSnapPositions() {
    var row = vp.querySelector(".wl-cards-row");
    if (!row) return [0];
    var gap = rowGapPx();
    var maxScroll = Math.max(0, vp.scrollWidth - vp.clientWidth);
    if (maxScroll < 1) return [0];

    var kids = [].slice.call(row.children);
    var stepEl =
      (row.querySelector(".wl-promo-duo .wl-ct7") ||
        row.querySelector(".wl-promo-duo .wl-promo-23h-poster") ||
        row.querySelector(".wl-promo-duo aside") ||
        kids[0]);
    var wStep = stepEl ? stepEl.offsetWidth : 0;
    if (!wStep || wStep < 48) wStep = 281;
    var step = wStep + gap;

    var positions = [0];
    var afterFirst = kids[0] ? kids[0].offsetWidth + gap : 0;
    if (afterFirst > 0 && afterFirst <= maxScroll + 0.5 && afterFirst > 4) {
      positions.push(afterFirst);
    }

    var x = afterFirst > 0 ? afterFirst : 0;
    while (true) {
      x += step;
      if (x >= maxScroll - 0.5) {
        if (positions[positions.length - 1] < maxScroll - 1) {
          positions.push(maxScroll);
        }
        break;
      }
      positions.push(x);
    }

    positions.sort(function (a, b) {
      return a - b;
    });
    var out = [];
    for (var i = 0; i < positions.length; i++) {
      if (i === 0 || Math.abs(positions[i] - out[out.length - 1]) > 2) {
        out.push(positions[i]);
      }
    }
    return out;
  }

  function nearestIndex(positions, x) {
    var best = 0;
    for (var i = 0; i < positions.length; i++) {
      if (Math.abs(positions[i] - x) < Math.abs(positions[best] - x)) best = i;
    }
    return best;
  }

  function go(delta) {
    var positions = scrollSnapPositions();
    var n = positions.length;
    if (n < 1) return;
    var cur = nearestIndex(positions, vp.scrollLeft);
    var nextIdx = cur + delta;
    if (nextIdx < 0) nextIdx = n - 1;
    if (nextIdx >= n) nextIdx = 0;
    var target = positions[nextIdx];
    var reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      vp.scrollLeft = target;
      return;
    }
    var start = vp.scrollLeft;
    var deltaX = target - start;
    if (Math.abs(deltaX) < 0.5) return;
    var duration = Math.min(900, Math.max(380, Math.abs(deltaX) * 0.55));
    var t0 = performance.now();
    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    function frame(now) {
      var elapsed = now - t0;
      var t = Math.min(1, elapsed / duration);
      vp.scrollLeft = start + deltaX * easeInOutCubic(t);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  prev.addEventListener("click", function () {
    go(-1);
  });
  next.addEventListener("click", function () {
    go(1);
  });
})();
