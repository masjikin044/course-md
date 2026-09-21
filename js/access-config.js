/* ============================================================
   access-config.js — FILE TAMBAHAN (baru)
   Tidak mengubah js/config.js maupun js/courses.js yang lama.
   Ubah nilai di sini untuk mengatur kode Admin/User dan isi popup promo.
   ============================================================ */
window.ACCESS_EXTRA = {

  /* --- Kode akses penuh (buka SEMUA course) ---
     Dua kode berbeda, keduanya membuka semua course; hanya beda
     label/badge yang tampil di situs.
     Cara membuat hash kode baru: buka situs → F12 → Console → ketik
        makeHash("KODE-ANDA")
     lalu salin angkanya ke bawah ini. */
  adminCodeHash: 1470414177,     // kode default: ADMIN-2026
  userAllCodeHash: 60966770,     // kode default: MEMBER-ALL-2026

  adminLabel: "Admin",
  userAllLabel: "Akses Penuh",

  /* --- Popup diskon --- */
  popup: {
    enabled: true,
    // Popup baru muncul setelah pengunjung berada di website selama N detik.
    // Hitungan dimulai saat pertama masuk dan lanjut walau pindah halaman.
    delaySeconds: 40,
    // "daily"  = tampil sekali per hari per perangkat
    // "session" = sekali per sesi browser
    // "always" = setiap buka halaman manapun
    frequency: "daily",

    badge: "🔥 Promo Terbatas",
    title: "Diskon 30% Semua Course!",
    desc: "Daftar hari ini dan dapatkan potongan harga untuk semua paket course. Berlaku untuk pendaftar baru.",
    code: "BELAJAR30",
    ctaText: "Klaim Diskon Sekarang",
    note: "Gunakan kode promo saat konfirmasi via WhatsApp atau Email."
  }
};
