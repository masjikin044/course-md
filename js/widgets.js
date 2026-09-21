/* ============================================================
   widgets.js — FILE TAMBAHAN (baru)
   Menambahkan 2 fitur tanpa mengubah index.html, course.html,
   css/style.css, js/app.js, js/config.js, js/courses.js yang lama:
     1. Tab melayang di sisi kanan -> panel kode akses + login admin/user
     2. Popup promo diskon saat masuk situs

   Kompatibel dengan sistem akses lama: menulis ke localStorage
   dengan key & format yang SAMA PERSIS dengan js/app.js
   (array id course yang terbuka, "*" = semua course terbuka),
   sehingga js/app.js yang lama otomatis mengenalinya tanpa disentuh.
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const COURSES = window.COURSES || [];
  const EXTRA = window.ACCESS_EXTRA || {};
  const STORAGE_KEY = CFG.storageKey || "belajarid_access_v1";
  const ROLE_KEY = "belajarid_role_v1";           // key baru, terpisah, tidak bentrok
  const POPUP_KEY = "belajarid_popup_seen_v1";    // key baru, terpisah

  /* ---------- Storage helper (format sama dengan store di app.js) ---------- */
  function readList() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function writeList(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }
  function readRole() { try { return localStorage.getItem(ROLE_KEY); } catch (e) { return null; } }
  function writeRole(v) { try { localStorage.setItem(ROLE_KEY, v); } catch (e) {} }

  function hashOf(str) {
    if (window.makeHash) return window.makeHash(str);
    // Fallback bila app.js belum sempat mengekspos makeHash (urutan script)
    let h = 5381; const s = String(str).trim().toUpperCase();
    for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
    return h >>> 0;
  }

  function currentCourseId() {
    if (!document.body.classList.contains("reader-body")) return null;
    return new URLSearchParams(location.search).get("id");
  }

  /* ============================================================
     STYLE — memakai variabel warna yang SUDAH ADA di css/style.css
     (--bg, --surface, --border, --text, --muted, --accent, dst)
     supaya tampilan menyatu tanpa menambah palet baru.
     ============================================================ */
  function injectStyle() {
    const css = `
    [hidden]{display:none !important}
    .wj-tab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:500;
      background:var(--accent);color:#fff;border:none;border-radius:10px 0 0 10px;
      padding:14px 10px;cursor:pointer;font-size:.82rem;font-weight:700;writing-mode:vertical-rl;
      text-orientation:mixed;box-shadow:var(--shadow);letter-spacing:.03em}
    .wj-tab:hover{filter:brightness(1.08)}
    .wj-badge{position:fixed;top:calc(14px + env(safe-area-inset-top,0px));right:14px;z-index:499;
      background:var(--accent);color:#fff;font-size:.72rem;font-weight:700;padding:5px 11px;
      border-radius:999px;box-shadow:var(--shadow)}
    .wj-scrim{display:none;position:fixed;inset:0;background:rgba(6,8,15,.5);z-index:600}
    .wj-scrim.show{display:block}
    .wj-panel{position:fixed;top:0;right:0;bottom:0;width:340px;max-width:88vw;z-index:601;
      background:var(--surface);border-left:1px solid var(--border);box-shadow:var(--shadow);
      transform:translateX(102%);transition:transform .25s ease;overflow-y:auto;
      padding:calc(20px + env(safe-area-inset-top,0px)) 20px 24px}
    .wj-panel.open{transform:none}
    .wj-panel h3{margin:0 0 4px;font-size:1.05rem;color:var(--text)}
    .wj-panel .wj-sub{color:var(--muted);font-size:.85rem;margin-bottom:16px}
    .wj-close{position:absolute;top:14px;right:14px;background:var(--surface-2);
      border:1px solid var(--border);color:var(--text);width:30px;height:30px;
      border-radius:8px;cursor:pointer;font-size:1rem}
    .wj-section{border-top:1px solid var(--border);padding-top:16px;margin-top:16px}
    .wj-section:first-of-type{border-top:none;margin-top:0;padding-top:0}
    .wj-section label{display:block;font-size:.8rem;color:var(--muted);margin-bottom:6px;font-weight:600}
    .wj-select,.wj-input{width:100%;padding:10px 12px;border-radius:9px;border:1px solid var(--border);
      background:var(--bg);color:var(--text);font-size:.9rem;margin-bottom:8px}
    .wj-input:focus,.wj-select:focus{outline:2px solid var(--accent);outline-offset:1px}
    .wj-btn{width:100%;padding:10px 14px;border-radius:9px;border:1px solid var(--accent);
      background:var(--accent);color:#fff;font-weight:700;font-size:.88rem;cursor:pointer}
    .wj-btn:hover{filter:brightness(1.07)}
    .wj-btn.ghost{background:transparent;color:var(--text);border-color:var(--border)}
    .wj-msg{font-size:.82rem;min-height:18px;margin:6px 0 2px;font-weight:600}
    .wj-msg.err{color:#dc2626}.wj-msg.ok{color:#0f9d58}
    .wj-status{font-size:.78rem;color:var(--muted);background:var(--surface-2);
      border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:14px}
    .wj-status b{color:var(--text)}

    .wj-popup-scrim{display:none;position:fixed;inset:0;background:rgba(6,8,15,.6);
      z-index:700;align-items:center;justify-content:center;padding:20px}
    .wj-popup-scrim.show{display:flex}
    .wj-popup{background:var(--surface);border:1px solid var(--border);border-radius:16px;
      max-width:420px;width:100%;padding:28px;text-align:center;position:relative;
      box-shadow:var(--shadow)}
    .wj-popup-badge{display:inline-block;background:var(--accent-soft,var(--surface-2));
      color:var(--accent);font-weight:700;font-size:.75rem;padding:4px 12px;
      border-radius:999px;margin-bottom:12px}
    .wj-popup h2{margin:0 0 10px;font-size:1.4rem;color:var(--text)}
    .wj-popup p{color:var(--muted);font-size:.92rem;margin-bottom:16px}
    .wj-popup-code{display:inline-block;border:1px dashed var(--accent);color:var(--accent);
      font-weight:700;letter-spacing:.05em;padding:6px 16px;border-radius:8px;margin-bottom:16px}
    .wj-popup-close{position:absolute;top:12px;right:12px;background:var(--surface-2);
      border:1px solid var(--border);color:var(--text);width:30px;height:30px;
      border-radius:8px;cursor:pointer;font-size:1rem}
    .wj-popup-note{font-size:.76rem;color:var(--muted);margin-top:12px}
    @media (max-width:480px){.wj-tab{padding:12px 8px;font-size:.78rem}}
    `;
    const style = document.createElement("style");
    style.setAttribute("data-widgets", "belajarid");
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ============================================================
     PANEL AKSES (tab kanan)
     ============================================================ */
  function buildPanel() {
    const scrim = document.createElement("div");
    scrim.className = "wj-scrim";

    const tab = document.createElement("button");
    tab.className = "wj-tab";
    tab.textContent = "🔑 Kode Akses";

    const panel = document.createElement("div");
    panel.className = "wj-panel";

    const cId = currentCourseId();
    const courseOptions = COURSES.map((c) =>
      `<option value="${c.id}" ${c.id === cId ? "selected" : ""}>${c.title}</option>`
    ).join("");

    panel.innerHTML = `
      <button class="wj-close" aria-label="Tutup">✕</button>
      <h3>Buka Akses Course</h3>
      <p class="wj-sub">Masukkan kode akses untuk membuka satu course tertentu.</p>

      <div class="wj-section">
        <label for="wj-course-select">Pilih course</label>
        <select id="wj-course-select" class="wj-select">${courseOptions}</select>
        <label for="wj-course-code">Kode akses</label>
        <input id="wj-course-code" class="wj-input" type="text" placeholder="Contoh: CSS-2026" autocomplete="off" spellcheck="false">
        <button id="wj-course-submit" class="wj-btn">Buka Course Ini</button>
        <p id="wj-course-msg" class="wj-msg"></p>
      </div>

      <div class="wj-section">
        <h3 style="font-size:.95rem">Login Admin / Akses Penuh</h3>
        <p class="wj-sub">Untuk pengelola atau member dengan akses ke semua course.</p>
        <label for="wj-role-code">Kode Admin / Akses Penuh</label>
        <input id="wj-role-code" class="wj-input" type="text" placeholder="Kode admin atau akses penuh" autocomplete="off" spellcheck="false">
        <button id="wj-role-submit" class="wj-btn ghost">Login</button>
        <p id="wj-role-msg" class="wj-msg"></p>
      </div>

      <div id="wj-current-status"></div>
    `;

    document.body.appendChild(scrim);
    document.body.appendChild(tab);
    document.body.appendChild(panel);

    const toggle = (on) => { panel.classList.toggle("open", on); scrim.classList.toggle("show", on); };
    tab.addEventListener("click", () => toggle(true));
    scrim.addEventListener("click", () => toggle(false));
    panel.querySelector(".wj-close").addEventListener("click", () => toggle(false));

    renderStatus(panel.querySelector("#wj-current-status"));

    /* Buka satu course pakai kode course tersebut */
    panel.querySelector("#wj-course-submit").addEventListener("click", () => {
      const id = panel.querySelector("#wj-course-select").value;
      const code = panel.querySelector("#wj-course-code").value.trim();
      const msg = panel.querySelector("#wj-course-msg");
      const course = COURSES.find((c) => c.id === id);
      if (!code || !course) return;

      if (hashOf(code) === course.codeHash) {
        const list = readList();
        if (!list.includes(id)) list.push(id);
        writeList(list);
        msg.className = "wj-msg ok";
        msg.textContent = "Kode benar. Membuka course…";
        setTimeout(() => location.href = "course.html?id=" + encodeURIComponent(id), 500);
      } else {
        msg.className = "wj-msg err";
        msg.textContent = "Kode tidak cocok untuk course ini.";
      }
    });

    /* Login admin / akses penuh */
    panel.querySelector("#wj-role-submit").addEventListener("click", () => {
      const code = panel.querySelector("#wj-role-code").value.trim();
      const msg = panel.querySelector("#wj-role-msg");
      if (!code) return;
      const h = hashOf(code);

      let role = null;
      if (EXTRA.adminCodeHash && h === EXTRA.adminCodeHash) role = "admin";
      else if (EXTRA.userAllCodeHash && h === EXTRA.userAllCodeHash) role = "userAll";

      if (role) {
        const list = readList();
        if (!list.includes("*")) list.push("*");
        writeList(list);
        writeRole(role);
        msg.className = "wj-msg ok";
        msg.textContent = "Login berhasil. Semua course terbuka…";
        setTimeout(() => location.reload(), 600);
      } else {
        msg.className = "wj-msg err";
        msg.textContent = "Kode admin/akses penuh tidak cocok.";
      }
    });
  }

  function renderStatus(container) {
    const list = readList();
    const role = readRole();
    if (list.includes("*")) {
      const label = role === "admin" ? (EXTRA.adminLabel || "Admin") : (EXTRA.userAllLabel || "Akses Penuh");
      container.innerHTML = `<div class="wj-status">Status: <b>${label}</b> — semua course terbuka di perangkat ini.
        <br><a href="#" id="wj-logout" style="color:var(--accent)">Keluar dari mode ini</a></div>`;
      const out = container.querySelector("#wj-logout");
      if (out) out.addEventListener("click", (e) => {
        e.preventDefault();
        writeList(readList().filter((x) => x !== "*"));
        try { localStorage.removeItem(ROLE_KEY); } catch (err) {}
        location.reload();
      });
    } else if (list.length) {
      container.innerHTML = `<div class="wj-status">Course terbuka di perangkat ini: <b>${list.length}</b></div>`;
    }
  }

  function buildRoleBadge() {
    const list = readList();
    if (!list.includes("*")) return;
    const role = readRole();
    const label = role === "admin" ? (EXTRA.adminLabel || "Admin") : (EXTRA.userAllLabel || "Akses Penuh");
    const badge = document.createElement("div");
    badge.className = "wj-badge";
    badge.textContent = "★ " + label;
    document.body.appendChild(badge);
  }

  /* ============================================================
     POPUP PROMO
     ============================================================ */
  function shouldShowPopup() {
    const p = EXTRA.popup || {};
    if (!p.enabled) return false;
    if (p.frequency === "always") return true;

    let seen = null;
    try { seen = JSON.parse(sessionStorage.getItem(POPUP_KEY + "_session")); } catch (e) {}
    if (p.frequency === "session") return !seen;

    // default: "daily"
    let lastDate = null;
    try { lastDate = localStorage.getItem(POPUP_KEY); } catch (e) {}
    const today = new Date().toISOString().slice(0, 10);
    return lastDate !== today;
  }

  function markPopupShown() {
    const p = EXTRA.popup || {};
    try { sessionStorage.setItem(POPUP_KEY + "_session", "true"); } catch (e) {}
    if (p.frequency === "daily") {
      try { localStorage.setItem(POPUP_KEY, new Date().toISOString().slice(0, 10)); } catch (e) {}
    }
  }

  function buildPopup() {
    const p = EXTRA.popup || {};
    if (!shouldShowPopup()) return;

    const scrim = document.createElement("div");
    scrim.className = "wj-popup-scrim";
    scrim.innerHTML = `
      <div class="wj-popup" role="dialog" aria-modal="true">
        <button class="wj-popup-close" aria-label="Tutup">✕</button>
        <span class="wj-popup-badge">${p.badge || "Promo"}</span>
        <h2>${p.title || "Promo Spesial"}</h2>
        <p>${p.desc || ""}</p>
        ${p.code ? `<div class="wj-popup-code">${p.code}</div><br>` : ""}
        <button class="wj-btn" id="wj-popup-cta">${p.ctaText || "Daftar Sekarang"}</button>
        ${p.note ? `<p class="wj-popup-note">${p.note}</p>` : ""}
      </div>`;
    document.body.appendChild(scrim);

    requestAnimationFrame(() => scrim.classList.add("show"));
    markPopupShown();

    function close() { scrim.classList.remove("show"); setTimeout(() => scrim.remove(), 200); }
    scrim.addEventListener("click", (e) => { if (e.target === scrim) close(); });
    scrim.querySelector(".wj-popup-close").addEventListener("click", close);
    scrim.querySelector("#wj-popup-cta").addEventListener("click", () => {
      window.open(CFG.googleForm || "#", "_blank", "noopener");
      close();
    });
  }

  /* Jadwalkan popup: tampil setelah EXTRA.popup.delaySeconds detik di website.
     Waktu masuk disimpan di sessionStorage supaya hitungan lanjut lintas halaman. */
  const ENTRY_KEY = "belajarid_entry_ts_v1";
  function schedulePopup() {
    const p = EXTRA.popup || {};
    if (!p.enabled) return;
    const delayMs = (Number(p.delaySeconds) || 0) * 1000;
    const now = Date.now();
    let start = now;
    try {
      const saved = Number(sessionStorage.getItem(ENTRY_KEY));
      if (saved && saved <= now) start = saved;
      else sessionStorage.setItem(ENTRY_KEY, String(now));
    } catch (e) {}
    setTimeout(buildPopup, Math.max(0, delayMs - (now - start)));
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    injectStyle();
    buildPanel();
    buildRoleBadge();
    schedulePopup();
  });
})();
