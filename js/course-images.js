/* ============================================================
   course-images.js — FILE TAMBAHAN (baru)
   Menambahkan logo kecil (kiri & kanan) pada cover kartu course
   di halaman katalog, TANPA mengubah app.js, courses.js,
   style.css, maupun file .md.

   CARA PAKAI
   1. Taruh gambar logo di folder:  images/courses/
      (format bebas: .svg .png .webp .jpg — disarankan persegi)
   2. Daftarkan di peta COURSE_IMAGES di bawah ini:
        "id-course": { left: "nama-file.svg", right: "nama-file.svg" }
      - cukup tulis nama file (otomatis dicari di images/courses/)
      - boleh path lengkap / URL penuh jika perlu
      - left & right sama-sama opsional
   3. Alternatif: langsung di js/courses.js, tambahkan field
        logoLeft: "html.svg", logoRight: "docker.svg"
      (field di courses.js akan menang atas peta di bawah)

   Course tanpa logo → memakai default.svg di kiri.
   Gambar yang gagal dimuat otomatis disembunyikan (tidak ada ikon rusak).
   ============================================================ */
(function () {
  "use strict";

  var IMAGE_DIR = "images/courses/";
  var DEFAULT_LEFT = "default.svg";     // dipakai jika course belum didaftarkan
  var SHOW_DEFAULT = true;              // false = course tanpa logo dibiarkan polos

  // ====== EDIT DI SINI ======
  var COURSE_IMAGES = {
    "html-dasar":   { left: "html.svg" },
    "css-dasar":    { left: "css.svg" },
    "js-dasar":     { left: "js.svg" },
    "docker-dasar": { left: "docker.jpg" }

    // Contoh dua logo (kiri & kanan):
    // "fullstack-web": { left: "html.svg", right: "js.svg" }
  };
  // ==========================

  var COURSES = window.COURSES || [];

  function resolve(src) {
    if (!src) return "";
    if (/^(https?:)?\/\//i.test(src) || src.indexOf("/") !== -1) return src;
    return IMAGE_DIR + src;
  }

  // Suntik CSS sendiri (style.css asli tidak disentuh)
  var css = document.createElement("style");
  css.setAttribute("data-course-images", "");
  css.textContent =
    ".card-cover{position:relative}" +
    ".cover-logo{position:absolute;top:10px;width:36px;height:36px;padding:4px;" +
    "border-radius:9px;background:rgba(255,255,255,.94);object-fit:contain;" +
    "box-shadow:0 2px 8px rgba(0,0,0,.25)}" +
    ".cover-logo.left{left:16px}" +
    ".cover-logo.right{right:16px}";
  document.head.appendChild(css);

  function addLogo(cover, src, side) {
    var url = resolve(src);
    if (!url) return;
    var img = document.createElement("img");
    img.className = "cover-logo " + side;
    img.src = url;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () { img.remove(); });
    cover.appendChild(img);
  }

  function decorate(card) {
    if (card.hasAttribute("data-logo-done")) return;
    var link = card.querySelector('a[href*="id="]');
    var cover = card.querySelector(".card-cover");
    if (!link || !cover) return;
    card.setAttribute("data-logo-done", "");

    var id = "";
    try { id = new URL(link.getAttribute("href"), location.href).searchParams.get("id") || ""; }
    catch (e) { return; }

    var course = null;
    for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) { course = COURSES[i]; break; }

    var map = COURSE_IMAGES[id] || {};
    var left = (course && course.logoLeft) || map.left || (SHOW_DEFAULT ? DEFAULT_LEFT : "");
    var right = (course && course.logoRight) || map.right || "";

    addLogo(cover, left, "left");
    addLogo(cover, right, "right");
  }

  function run() {
    var grid = document.getElementById("grid");
    if (!grid) return;
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), decorate);
  }

  // app.js merender ulang kartu (mis. saat pencarian) → pantau perubahan grid
  function start() {
    var grid = document.getElementById("grid");
    if (!grid) return;
    new MutationObserver(run).observe(grid, { childList: true });
    run();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
