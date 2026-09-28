# CSS Dasar & Layout Modern

> Kode akses default course ini: **CSS-2026** (ubah di `js/courses.js`).

## Modul 1 — Cara Menghubungkan CSS

Ada tiga cara, dan yang direkomendasikan adalah file eksternal:

```html
<link rel="stylesheet" href="css/style.css">
```

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #14161d;
}
```

## Modul 2 — Selector

| Selector | Contoh | Menyasar |
|---|---|---|
| Tag | `p { }` | Semua paragraf |
| Class | `.card { }` | Elemen ber-class `card` |
| ID | `#header { }` | Elemen ber-id `header` |
| Turunan | `.card p { }` | Paragraf di dalam `.card` |
| Pseudo | `a:hover { }` | Tautan saat disentuh kursor |

Prioritas (spesifisitas): inline style > ID > class > tag.

## Modul 3 — Box Model

Setiap elemen adalah kotak berisi *content*, *padding*, *border*, dan *margin*.

```css
* { box-sizing: border-box; }

.card {
  padding: 16px;
  border: 1px solid #e2e6ef;
  border-radius: 12px;
  margin-bottom: 20px;
}
```

> `box-sizing: border-box` membuat lebar elemen sudah termasuk padding dan border. Selalu pakai ini.

## Modul 4 — Flexbox

Cocok untuk penataan satu sumbu (baris atau kolom):

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
```

## Modul 5 — CSS Grid

Cocok untuk tata letak dua sumbu:

```css
.grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

Pola `auto-fill` + `minmax` membuat grid otomatis responsif tanpa media query.

## Modul 6 — Responsive Design

```css
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}
```

Terapkan pendekatan *mobile first*: tulis gaya dasar untuk layar kecil, lalu tambahkan penyesuaian untuk layar besar.

## Modul 7 — Variabel CSS dan Tema

```css
:root {
  --bg: #ffffff;
  --text: #14161d;
  --accent: #4f46e5;
}
html[data-theme="dark"] {
  --bg: #0e1017;
  --text: #e8ebf2;
}
body { background: var(--bg); color: var(--text); }
```

## Proyek Akhir

Ubah halaman profil dari course HTML menjadi tampilan modern: navbar flex, galeri grid, kartu berbayang, dan mode gelap memakai variabel CSS.
