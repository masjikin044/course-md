# Course Platform — Static Web (HTML + CSS + Vanilla JS)

Platform pembelajaran statis: materi ditulis dalam Markdown, dirender di browser dengan
Marked.js + Highlight.js, dan dikunci dengan kode akses sederhana berbasis LocalStorage.
Tanpa backend, tanpa database, tanpa build step.

## Struktur

```
/
├── index.html        Halaman katalog course
├── course.html       Halaman materi (reader + sidebar)
├── vercel.json       Konfigurasi hosting Vercel
├── css/style.css     Seluruh gaya tampilan (tema terang & gelap)
├── js/
│   ├── config.js     Link Google Form, WhatsApp, Email
│   ├── courses.js    Manifest/katalog course
│   └── app.js        Logika katalog, akses, render Markdown, TOC
└── courses/          Materi .md
    ├── html-dasar.md
    ├── css-dasar.md
    └── js-dasar.md
```

## Menjalankan secara lokal

`fetch()` tidak bisa membaca file dari `file://`, jadi gunakan server statis apa pun:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

Buka `http://localhost:8000`.

## Menambah course baru

1. Buat file baru di `/courses/`, misal `git-dasar.md`.
2. Buka halaman web, tekan F12 → Console, ketik `makeHash("GIT-2026")` lalu salin angkanya.
3. Tambahkan entri baru di akhir array pada `js/courses.js`:

```js
{
  id: "git-dasar",
  title: "Git & GitHub Dasar",
  desc: "Version control untuk pemula.",
  level: "Pemula",
  duration: "2 jam",
  tags: ["Git"],
  cover: "#10b981",
  file: "courses/git-dasar.md",
  locked: true,
  codeHash: 1358198740   // hasil makeHash("GIT-2026")
}
```

4. `git add . && git commit -m "add git-dasar" && git push`

Vercel akan otomatis build ulang. Menambah entri di akhir array tidak mengubah `id` course
lain, sehingga tautan lama, progres baca, dan status akses pengguna tetap aman
(semuanya disimpan per-`id` di LocalStorage).

## Kode akses default (contoh)

| Course | Kode |
|---|---|
| HTML Dasar | — (gratis) |
| CSS Dasar | `CSS-2026` |
| JavaScript Dasar | `JS-2026` |
| Master (buka semua) | `GIT-2026` |

Ganti seluruh `codeHash` sebelum dipakai produksi.

> **Catatan keamanan.** Karena situs ini murni statis, file `.md` tetap dapat diakses
> langsung lewat URL `/courses/nama-file.md` oleh siapa pun yang menebaknya. Penguncian
> ini bersifat pembatas antarmuka, bukan proteksi kriptografis. Untuk materi bernilai
> tinggi, pertimbangkan Vercel Password Protection, atau simpan materi premium di luar
> repo publik.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo tersebut.
3. Framework Preset: **Other**. Build Command: kosongkan. Output Directory: `.`
4. Deploy. Setiap `git push` berikutnya akan otomatis ter-deploy.

## Kustomisasi cepat

- Ganti link pendaftaran, nomor WhatsApp, dan email di `js/config.js`.
- Ganti warna merek pada variabel `--accent` di `css/style.css`.
