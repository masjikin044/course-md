# Panduan Logo Course

Fitur tambahan: logo kecil di cover kartu course (kiri dan/atau kanan).

## File yang ditambahkan
- `images/courses/` — folder khusus logo (html.svg, css.svg, js.svg, docker.svg, default.svg)
- `js/course-images.js` — logika + peta logo per course
- `index.html` — hanya ditambah 1 baris `<script src="js/course-images.js"></script>`

File lain (app.js, courses.js, style.css, course.html, .md) tidak diubah.

## Menambah logo untuk course baru
1. Simpan gambar (svg/png/webp, disarankan persegi) di `images/courses/`, mis. `git.svg`.
2. Daftarkan di bagian `COURSE_IMAGES` pada `js/course-images.js`:
```js
"git-dasar": { left: "git.svg" },
"fullstack": { left: "html.svg", right: "js.svg" }   // dua logo
```
3. Atau tulis langsung di `js/courses.js` pada entri course: `logoLeft: "git.svg", logoRight: "js.svg"` (lebih diutamakan daripada peta).

## Catatan
- Cukup nama file; folder `images/courses/` otomatis ditambahkan. Path lengkap/URL juga boleh.
- Course tanpa logo memakai `default.svg` (matikan dengan `SHOW_DEFAULT = false`).
- Gambar yang gagal dimuat otomatis disembunyikan.
- Setelah `git push`, Vercel otomatis memperbarui situs.
