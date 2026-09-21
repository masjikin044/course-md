/* ============================================================
   app.js — Logika utama platform
   Halaman katalog (index.html) & halaman materi (course.html)
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG;
  const COURSES = window.COURSES || [];
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- Utilitas ---------- */
  // Hash djb2 — dipakai agar kode akses tidak tertulis polos di source code.
  // Catatan: ini pengaman ringan sisi klien, bukan keamanan tingkat server.
  function makeHash(str) {
    let h = 5381;
    const s = String(str).trim().toUpperCase();
    for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
    return h >>> 0;
  }
  window.makeHash = makeHash; // panggil di Console untuk membuat codeHash baru

  const store = {
    read(key, fb) { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch (e) { return fb; } },
    write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  };
  const getCourse = (id) => COURSES.find((c) => c.id === id);
  const unlockedList = () => store.read(CFG.storageKey, []);
  const isUnlocked = (c) =>
    !c.locked || unlockedList().includes("*") || unlockedList().includes(c.id);

  function unlock(id) {
    const list = unlockedList();
    if (!list.includes(id)) list.push(id);
    store.write(CFG.storageKey, list);
  }

  /* ---------- Link pendaftaran ---------- */
  function waLink(courseTitle) {
    return "https://wa.me/" + CFG.whatsapp + "?text=" +
      encodeURIComponent(CFG.whatsappText + (courseTitle || "-"));
  }
  function mailLink(courseTitle) {
    return "mailto:" + CFG.email +
      "?subject=" + encodeURIComponent(CFG.emailSubject) +
      "&body=" + encodeURIComponent(
        "Halo admin,\n\nSaya ingin meminta kode akses untuk course: " +
        (courseTitle || "-") + "\n\nNama:\nBukti pendaftaran:\n\nTerima kasih.");
  }

  /* ---------- Tema ---------- */
  function initTheme() {
    const saved = store.read(CFG.themeKey, null);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    const btn = $("#themeBtn");
    if (btn) btn.addEventListener("click", () => {
      const now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", now);
      store.write(CFG.themeKey, now);
    });
  }

  /* =========================================================
     HALAMAN KATALOG
     ========================================================= */
  function initCatalog() {
    const grid = $("#grid");
    const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
    ["#heroRegister", "#ctaForm"].forEach((s) => { const el = $(s); if (el) el.href = CFG.googleForm; });
    const wa = $("#ctaWa"); if (wa) wa.href = waLink("");
    const ml = $("#ctaMail"); if (ml) ml.href = mailLink("");

    function render(term) {
      const q = (term || "").toLowerCase();
      const items = COURSES.filter((c) =>
        (c.title + " " + c.desc + " " + (c.tags || []).join(" ")).toLowerCase().includes(q));
      grid.innerHTML = items.map(cardHTML).join("");
      $("#empty").hidden = items.length > 0;
    }

    function cardHTML(c) {
      const open = isUnlocked(c);
      const status = !c.locked
        ? '<span class="chip open">Gratis</span>'
        : open ? '<span class="chip open">Terbuka</span>'
               : '<span class="chip lock">Terkunci</span>';
      return `<article class="card">
        <div class="card-cover" style="--c:${c.cover || "#4f46e5"}">
          <span class="badge">${c.level || "Umum"}</span>
        </div>
        <div class="card-body">
          <h3>${c.title}</h3>
          <p>${c.desc || ""}</p>
          <div class="meta">
            ${status}
            <span class="chip">⏱ ${c.duration || "-"}</span>
            ${(c.tags || []).map((t) => `<span class="chip">${t}</span>`).join("")}
          </div>
        </div>
        <div class="card-foot">
          <a class="btn ${open ? "primary" : ""} block" href="course.html?id=${encodeURIComponent(c.id)}">
            ${open ? "Mulai Belajar" : "Buka dengan Kode Akses"}
          </a>
        </div>
      </article>`;
    }

    render("");
    const search = $("#search");
    if (search) search.addEventListener("input", (e) => render(e.target.value));
  }

  /* =========================================================
     HALAMAN MATERI (READER)
     ========================================================= */
  function initReader() {
    const id = new URLSearchParams(location.search).get("id");
    const course = getCourse(id) || COURSES[0];
    if (!course) { document.body.innerHTML = "<p style='padding:40px'>Course tidak ditemukan.</p>"; return; }

    document.title = course.title + " — " + CFG.brand;
    $("#gForm").href = CFG.googleForm;
    $("#gWa").href = waLink(course.title);
    $("#gMail").href = mailLink(course.title);
    $("#gateTitle").textContent = course.title;

    if (isUnlocked(course)) return openReader(course);

    /* --- Gerbang akses --- */
    const gate = $("#gate"); gate.hidden = false;
    const msg = $("#gateMsg");
    const input = $("#codeInput");

    function tryUnlock() {
      const val = input.value.trim();
      if (!val) return;
      const h = makeHash(val);
      if (h === course.codeHash) {
        unlock(course.id); success();
      } else if (window.MASTER_CODE_HASH && h === window.MASTER_CODE_HASH) {
        const l = unlockedList(); if (!l.includes("*")) l.push("*");
        store.write(CFG.storageKey, l); success();
      } else {
        msg.textContent = "Kode akses tidak cocok. Periksa kembali atau hubungi admin.";
        msg.className = "gate-msg err";
        input.select();
      }
    }
    function success() {
      msg.textContent = "Kode diterima. Membuka materi…";
      msg.className = "gate-msg ok";
      setTimeout(() => { gate.hidden = true; openReader(course); }, 500);
    }

    $("#unlockBtn").addEventListener("click", tryUnlock);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
    $("#previewLink").addEventListener("click", (e) => {
      e.preventDefault();
      const free = COURSES.find((c) => !c.locked);
      location.href = free ? "course.html?id=" + free.id : "index.html";
    });
  }

  /* --- Render materi --- */
  async function openReader(course) {
    $("#gate").hidden = true;
    const reader = $("#reader"); reader.hidden = false;
    $("#sideTitle").textContent = course.title;

    const md = $("#md");
    try {
      const res = await fetch(course.file, { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();

      marked.setOptions({ gfm: true, breaks: false });
      md.innerHTML = marked.parse(text);

      if (window.hljs) $$("pre code", md).forEach((b) => hljs.highlightElement(b));
      buildTOC(md);
      buildPager(course);
      trackProgress(course);
    } catch (err) {
      md.innerHTML = `<h1>Materi gagal dimuat</h1>
        <p class="muted">Tidak dapat membaca <code>${course.file}</code>.</p>
        <p class="muted small">Jika dibuka langsung dari file lokal (file://), jalankan lewat server statis
        seperti <code>npx serve</code> atau buka versi yang sudah dideploy di Vercel.</p>`;
      console.error(err);
    }

    // Sidebar mobile
    const sb = $("#sidebar"), scrim = $("#scrim");
    const toggle = (on) => { sb.classList.toggle("open", on); scrim.classList.toggle("show", on); };
    $("#navBtn").addEventListener("click", () => toggle(!sb.classList.contains("open")));
    scrim.addEventListener("click", () => toggle(false));
    $("#toc").addEventListener("click", (e) => { if (e.target.tagName === "A") toggle(false); });

    $("#lockBtn").addEventListener("click", () => {
      if (!confirm("Kunci ulang course ini di perangkat ini?")) return;
      store.write(CFG.storageKey, unlockedList().filter((x) => x !== course.id && x !== "*"));
      location.href = "index.html";
    });
  }

  /* --- Daftar isi otomatis dari heading Markdown --- */
  function buildTOC(root) {
    const toc = $("#toc");
    const heads = $$("h2, h3", root);
    if (!heads.length) { toc.innerHTML = '<p class="muted small">Materi ini tanpa sub-bab.</p>'; return; }
    toc.innerHTML = heads.map((h, i) => {
      if (!h.id) h.id = "sec-" + i + "-" + (h.textContent || "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `<a class="${h.tagName.toLowerCase()}" href="#${h.id}">${h.textContent}</a>`;
    }).join("");

    const links = $$("a", toc);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    heads.forEach((h) => obs.observe(h));
  }

  /* --- Navigasi course sebelumnya/berikutnya --- */
  function buildPager(course) {
    const i = COURSES.findIndex((c) => c.id === course.id);
    const set = (el, c, label) => {
      if (!c) return;
      el.hidden = false; el.href = "course.html?id=" + c.id;
      el.textContent = label.replace("%s", c.title);
    };
    set($("#prevCourse"), COURSES[i - 1], "← %s");
    set($("#nextCourse"), COURSES[i + 1], "%s →");
  }

  /* --- Progres baca (LocalStorage) --- */
  function trackProgress(course) {
    const bar = $("#progressBar"), txt = $("#progressText");
    const saved = store.read(CFG.progressKey, {});
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 100;
      bar.style.width = pct + "%";
      txt.textContent = pct + "% dibaca";
      if (pct > (saved[course.id] || 0)) { saved[course.id] = pct; store.write(CFG.progressKey, saved); }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    if ($("#grid")) initCatalog();
    if (document.body.classList.contains("reader-body")) initReader();
  });
})();
