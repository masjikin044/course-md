/* ============================================================
   courses.js — MANIFEST COURSE
   Cara menambah course baru:
   1. Buat file baru di folder /courses/, misal: "git-dasar.md"
   2. Tambahkan satu objek pada array di bawah ini.
   3. Commit & push ke GitHub → Vercel otomatis deploy ulang.

   Keterangan field:
   - id       : unik, dipakai di URL course.html?id=...
   - file     : path file markdown
   - locked   : true = butuh kode akses, false = gratis/terbuka
   - codeHash : hash djb2 dari kode akses (JANGAN tulis kodenya langsung)
                Cara membuat: buka halaman web, lalu di Console ketik
                   makeHash("KODE-ANDA")
                Salin angka yang keluar ke sini.
   ============================================================ */
window.COURSES = [
  {
    id: "html-dasar",
    title: "HTML Dasar untuk Pemula",
    desc: "Memahami struktur dokumen web, tag semantik, form, dan tabel dari nol.",
    level: "Pemula",
    duration: "3 jam",
    tags: ["HTML", "Frontend"],
    cover: "#6366f1",
    file: "courses/html-dasar.md",
    locked: false,          // contoh course gratis
    codeHash: null
  },
  {
    id: "css-dasar",
    title: "CSS Dasar & Layout Modern",
    desc: "Selector, box model, Flexbox, Grid, sampai responsive design.",
    level: "Pemula",
    duration: "4 jam",
    tags: ["CSS", "Frontend"],
    cover: "#0ea5e9",
    file: "courses/css-dasar.md",
    locked: true,
    codeHash: 2930175021    // kode: CSS-2026
  },
  {
    id: "js-dasar",
    title: "JavaScript Dasar",
    desc: "Variabel, fungsi, DOM, event, dan fetch API untuk web interaktif.",
    level: "Menengah",
    duration: "6 jam",
    tags: ["JavaScript", "Frontend"],
    cover: "#f59e0b",
    file: "courses/js-dasar.md",
    locked: true,
    codeHash: 3466904759    // kode: JS-2026
  },

   {
    id: "docker-dasar",
    title: "Docker Dasar",
    desc: "Memahami konsep container, Dockerfile, dan docker-compose untuk development.",
    level: "Menengah",
    duration: "5 jam",
    tags: ["Docker", "DevOps"],
    cover: "#2700b3",
    file: "courses/docker-dasar.md",
    locked: true,
    codeHash: 397525850     // kode: DOCKER-2026
  }
];

/* Kode master opsional — membuka SEMUA course sekaligus.
   Isi null untuk menonaktifkan. Contoh di bawah = "GIT-2026". */
window.MASTER_CODE_HASH = 1358198740;
