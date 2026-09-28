# JavaScript Dasar

> Kode akses default course ini: **JS-2026** (ubah di `js/courses.js`).

## Modul 1 — Variabel dan Tipe Data

```js
const nama = "Rina";      // tidak bisa diganti
let umur = 21;            // bisa diganti
const aktif = true;
const nilai = [90, 85, 78];
const user = { nama, umur };
```

Gunakan `const` sebagai kebiasaan; pakai `let` hanya jika nilainya memang berubah.

## Modul 2 — Fungsi

```js
function luas(p, l) {
  return p * l;
}

const luasArrow = (p, l) => p * l;

console.log(luas(4, 5)); // 20
```

## Modul 3 — Kondisi dan Perulangan

```js
const skor = 78;

if (skor >= 85) {
  console.log("A");
} else if (skor >= 70) {
  console.log("B");
} else {
  console.log("C");
}

for (const n of [1, 2, 3]) console.log(n);

[10, 20, 30].forEach((n, i) => console.log(i, n));
```

## Modul 4 — Manipulasi DOM

```js
const judul = document.querySelector("#judul");
judul.textContent = "Judul baru";
judul.classList.add("aktif");

const item = document.createElement("li");
item.textContent = "Item baru";
document.querySelector("ul").appendChild(item);
```

## Modul 5 — Event

```js
document.querySelector("#tombol").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Tombol diklik!");
});
```

## Modul 6 — Fetch dan Async/Await

```js
async function muatMateri(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error("Gagal memuat:", err);
    return "";
  }
}
```

Pola inilah yang dipakai platform ini untuk membaca file `.md` lalu merendernya dengan Marked.js.

## Modul 7 — LocalStorage

```js
localStorage.setItem("tema", JSON.stringify("dark"));
const tema = JSON.parse(localStorage.getItem("tema"));
localStorage.removeItem("tema");
```

Data tersimpan di perangkat pengguna dan bertahan setelah browser ditutup.

## Proyek Akhir

Buat daftar tugas (to-do list) yang bisa menambah, menandai selesai, menghapus item, serta menyimpan datanya di LocalStorage.
