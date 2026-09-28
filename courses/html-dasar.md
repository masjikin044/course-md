# HTML Dasar untuk Pemula

> Course gratis. Setelah menyelesaikan modul ini, Anda mampu membuat halaman web statis yang rapi dan semantik.

## Modul 1 — Mengenal HTML

HTML (*HyperText Markup Language*) adalah bahasa penanda yang menyusun struktur halaman web. Browser membaca tag HTML lalu menampilkannya sebagai teks, gambar, tautan, dan elemen lain.

Kerangka minimal sebuah dokumen HTML:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Halaman Pertama Saya</title>
</head>
<body>
  <h1>Halo, dunia!</h1>
  <p>Ini paragraf pertama saya.</p>
</body>
</html>
```

Simpan dengan nama `index.html`, lalu buka lewat browser.

## Modul 2 — Teks dan Heading

Gunakan `<h1>` sampai `<h6>` sesuai tingkat kepentingan, bukan sesuai ukuran huruf.

| Tag | Fungsi |
|---|---|
| `<h1>`–`<h6>` | Judul bertingkat |
| `<p>` | Paragraf |
| `<strong>` | Penekanan kuat (tebal) |
| `<em>` | Penekanan (miring) |
| `<br>` | Ganti baris |

### Latihan
Buat halaman berisi satu `<h1>`, dua `<h2>`, dan tiga paragraf.

## Modul 3 — Tautan, Gambar, dan Daftar

```html
<a href="https://example.com" target="_blank" rel="noopener">Kunjungi situs</a>
<img src="foto.jpg" alt="Deskripsi gambar" width="400">

<ul>
  <li>Item tanpa urutan</li>
</ul>
<ol>
  <li>Item berurutan</li>
</ol>
```

Atribut `alt` wajib diisi agar gambar tetap dapat dipahami pembaca layar.

## Modul 4 — Tag Semantik

Struktur semantik memudahkan mesin pencari dan aksesibilitas:

```html
<header>...</header>
<nav>...</nav>
<main>
  <article>
    <section>...</section>
  </article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

Hindari memakai `<div>` untuk semua hal bila ada tag semantik yang lebih tepat.

## Modul 5 — Form

```html
<form action="/kirim" method="post">
  <label for="nama">Nama</label>
  <input id="nama" name="nama" type="text" required>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" placeholder="nama@email.com">

  <button type="submit">Kirim</button>
</form>
```

Selalu pasangkan `<label for>` dengan `id` input agar ramah aksesibilitas.

## Proyek Akhir

Buat satu halaman profil pribadi yang memuat header, navigasi, bagian "Tentang Saya", daftar keahlian, galeri tiga gambar, form kontak, dan footer.

---

Lanjut ke course **CSS Dasar & Layout Modern** untuk mempercantik halaman ini.
