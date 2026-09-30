# GitHub Dasar

**GitHub** adalah layanan online untuk menyimpan repositori Git, berkolaborasi, dan mempublikasikan proyek. Course ini mengasumsikan Anda sudah memahami dasar Git (commit, branch, merge) dari course **Git Dasar**.

## Modul 1 — Apa yang Ditawarkan GitHub?

- **Repositori jarak jauh (remote)**: cadangan dan pusat kode.
- **Kolaborasi**: Pull Request, review, issue, diskusi.
- **Publikasi**: GitHub Pages, integrasi dengan Vercel/Netlify.
- **Otomasi**: GitHub Actions untuk tes dan deploy otomatis.

## Modul 2 — Membuat Akun dan Menghubungkan Git

1. Daftar di github.com dan verifikasi email.
2. Pastikan email di `git config user.email` sama dengan email akun (agar commit tercatat atas nama Anda).
3. Pilih cara autentikasi: **HTTPS + token**, atau **SSH key**.

### Opsi A — HTTPS dengan Personal Access Token

GitHub tidak lagi menerima password akun untuk operasi Git. Buat token di **Settings → Developer settings → Personal access tokens**, beri izin `repo`, lalu pakai token itu sebagai "password" saat diminta. Git Credential Manager (terpasang bersama Git for Windows) akan menyimpannya.

### Opsi B — SSH Key (disarankan untuk pemakaian rutin)

```bash
ssh-keygen -t ed25519 -C "email@contoh.com"
# tekan Enter untuk lokasi default, isi passphrase (opsional)

cat ~/.ssh/id_ed25519.pub       # salin isinya
```

Tempel isi kunci publik di **Settings → SSH and GPG keys → New SSH key**, lalu uji:

```bash
ssh -T git@github.com
```

## Modul 3 — Membuat Repositori dan Menghubungkannya

### Dari repositori lokal yang sudah ada

Buat repositori kosong di GitHub (tanpa README agar tidak bentrok), lalu:

```bash
git remote add origin https://github.com/username/proyek-saya.git
git branch -M main
git push -u origin main
```

`-u` menyimpan hubungan sehingga selanjutnya cukup `git push` dan `git pull`.

### Dari repositori yang sudah ada di GitHub

```bash
git clone https://github.com/username/proyek-saya.git
cd proyek-saya
```

```bash
git remote -v          # lihat alamat remote
```

## Modul 4 — Push, Pull, dan Fetch

```bash
git push                # kirim commit lokal ke GitHub
git pull                # ambil dan gabungkan perubahan dari GitHub
git fetch               # ambil saja, belum digabung (lebih aman untuk mengecek)
git push -u origin fitur-baru   # kirim branch baru pertama kali
```

Jika `git push` ditolak karena remote punya commit yang belum Anda miliki, jalankan `git pull` dulu, selesaikan konflik jika ada, lalu `push` lagi.

> Hindari `git push --force` pada branch bersama. Bila terpaksa, pakai `--force-with-lease`.

## Modul 5 — Alur Kerja Fitur dengan Branch dan Pull Request

Alur yang dipakai hampir semua tim:

```bash
git switch main
git pull
git switch -c fitur-halaman-kontak

# ... edit file, lalu:
git add .
git commit -m "Tambah halaman kontak"
git push -u origin fitur-halaman-kontak
```

Lalu di GitHub:

1. Klik tombol **Compare & pull request**.
2. Isi judul dan deskripsi: apa yang berubah dan mengapa.
3. Minta **reviewer**, tunggu masukan.
4. Setelah disetujui, klik **Merge pull request**.
5. Kembali ke lokal: `git switch main && git pull`, lalu hapus branch lama.

### Pilihan cara merge di GitHub

| Cara | Hasil |
|---|---|
| **Merge commit** | Menyimpan seluruh riwayat branch + satu commit penggabung |
| **Squash and merge** | Semua commit dilebur jadi satu commit rapi |
| **Rebase and merge** | Commit dipindah lurus ke atas main, tanpa commit penggabung |

## Modul 6 — Fork: Berkontribusi ke Proyek Orang Lain

Anda tidak punya izin tulis di proyek orang lain, jadi:

1. Klik **Fork** untuk menyalinnya ke akun Anda.
2. `git clone` fork Anda.
3. Tambahkan repositori asli sebagai `upstream`:

```bash
git remote add upstream https://github.com/pemilik-asli/proyek.git
git fetch upstream
git merge upstream/main        # sinkronkan dengan proyek asli
```

4. Buat branch, commit, push ke fork Anda, lalu buka **Pull Request** ke repositori asli.

## Modul 7 — Issues dan Manajemen Proyek

**Issue** dipakai untuk melaporkan bug, meminta fitur, atau mencatat tugas.

- Beri judul jelas dan langkah reproduksi.
- Gunakan **label** (`bug`, `enhancement`, `good first issue`) dan **assignee**.
- Tutup issue otomatis lewat pesan commit atau deskripsi PR: `Closes #12`.
- **Projects** menyediakan papan kanban untuk melacak progres.

## Modul 8 — File Penting di Repositori

| File | Fungsi |
|---|---|
| `README.md` | Halaman depan proyek: apa ini, cara pakai |
| `.gitignore` | Daftar file yang tidak dilacak |
| `LICENSE` | Aturan pemakaian kode oleh orang lain |
| `CONTRIBUTING.md` | Panduan bagi kontributor |

README yang baik memuat: deskripsi singkat, cara instalasi, contoh pemakaian, dan cara berkontribusi.

## Modul 9 — Keamanan Repositori

- **Jangan pernah commit rahasia**: password, API key, file `.env`. Repositori publik dapat dipindai otomatis oleh siapa saja.
- Jika rahasia terlanjur ter-push, **anggap sudah bocor**: cabut dan buat ulang kuncinya, lalu bersihkan riwayat. Sekadar menghapus file di commit baru tidak cukup.
- Aktifkan **Two-Factor Authentication (2FA)** di akun Anda.
- Aktifkan proteksi branch `main` (wajib review PR) untuk proyek tim.
- Pilih visibilitas **Private** untuk kode yang tidak untuk publik.

## Modul 10 — Deploy Situs Statis

**Lewat Vercel** (seperti platform course ini): hubungkan akun GitHub di vercel.com, impor repositori, lalu setiap `git push` ke `main` otomatis men-deploy versi terbaru.

**Lewat GitHub Pages**: buka **Settings → Pages**, pilih branch `main` dan folder root, simpan. Situs tersedia di `https://username.github.io/nama-repo/`.

## Modul 11 — Masalah Umum

| Masalah | Solusi |
|---|---|
| `Authentication failed` | Pakai token (bukan password) atau siapkan SSH key |
| `rejected ... non-fast-forward` | Jalankan `git pull` dulu, selesaikan konflik, lalu push |
| `Permission denied (publickey)` | Kunci SSH belum ditambahkan ke GitHub atau tidak dimuat |
| Penanda `<<<<<<< HEAD` muncul di situs | Konflik merge belum dibersihkan. Buka file, hapus penanda, commit ulang |
| Push berhasil tapi situs tidak berubah | Cek status deploy di Vercel/Pages dan hard refresh browser (Ctrl+F5) |
| Commit tidak tercatat atas nama saya | Email di `git config` berbeda dengan email akun GitHub |

## Modul 12 — Cheat Sheet

| Tujuan | Perintah / Langkah |
|---|---|
| Salin repo | `git clone URL` |
| Hubungkan remote | `git remote add origin URL` |
| Kirim | `git push` |
| Ambil & gabung | `git pull` |
| Branch baru ke GitHub | `git push -u origin nama` |
| Kolaborasi | Pull Request di GitHub |
| Sinkron fork | `git fetch upstream` + `git merge upstream/main` |

Latihan mandiri: buat repositori publik, tambahkan README, buat branch fitur, kirim Pull Request ke diri sendiri, lalu merge lewat tampilan GitHub.
