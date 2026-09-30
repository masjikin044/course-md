# Git Dasar

**Git** adalah sistem *version control*: mencatat setiap perubahan pada proyek Anda sehingga bisa dilacak, dibandingkan, dan dikembalikan. Course ini membahas Git di komputer Anda (lokal). Untuk berkolaborasi lewat internet, lanjutkan ke course **GitHub Dasar**.

## Modul 1 — Mengapa Git?

- Kembali ke versi lama kapan saja jika ada kesalahan.
- Melihat siapa mengubah apa, kapan, dan mengapa.
- Bekerja paralel di *branch* tanpa merusak kode utama.
- Menjadi standar di hampir semua tim pengembang.

> **Git ≠ GitHub.** Git adalah alat di komputer Anda. GitHub adalah layanan online untuk menyimpan repositori Git dan berkolaborasi.

## Modul 2 — Instalasi dan Konfigurasi Awal

Unduh dari git-scm.com (Windows/macOS) atau pasang lewat paket (Linux: `sudo apt install git`).

```bash
git --version

git config --global user.name "Nama Anda"
git config --global user.email "email@contoh.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"   # opsional: pakai VS Code

git config --list                                # cek konfigurasi
```

Nama dan email ini akan tercatat pada setiap commit Anda.

## Modul 3 — Konsep Inti: Tiga Area

```text
Working Directory  →  Staging Area  →  Repository
   (file Anda)      (git add)        (git commit)
```

| Area | Arti |
|---|---|
| **Working directory** | File yang sedang Anda edit |
| **Staging area** | Daftar perubahan yang disiapkan untuk commit berikutnya |
| **Repository** | Riwayat commit yang tersimpan permanen di folder `.git` |

**Commit** adalah *snapshot* proyek pada satu titik waktu, lengkap dengan pesan dan identitas pembuatnya.

## Modul 4 — Membuat Repositori dan Commit Pertama

```bash
mkdir proyek-saya
cd proyek-saya
git init                          # mulai repositori baru

echo "# Proyek Saya" > README.md
git status                        # README.md masih 'untracked'

git add README.md                 # masukkan ke staging
git commit -m "Tambah README"     # simpan snapshot
git log                           # lihat riwayat
```

Perintah `git add` bisa memakai `git add .` untuk memasukkan semua perubahan di folder saat ini.

## Modul 5 — Siklus Kerja Harian

```bash
git status                # apa yang berubah?
git diff                  # bedanya apa (belum di-staging)?
git diff --staged         # bedanya apa (sudah di-staging)?
git add nama-file         # siapkan perubahan
git commit -m "Pesan"     # simpan
git log --oneline         # riwayat ringkas
git log --oneline --graph --all   # riwayat bercabang dalam bentuk grafik
```

### Menulis pesan commit yang baik

- Singkat, jelas, dan berbentuk perintah: `Perbaiki validasi form login`.
- Satu commit = satu perubahan logis.
- Hindari pesan seperti `update` atau `fix` saja.

## Modul 6 — .gitignore

Beberapa file tidak boleh masuk repositori: dependensi, file rahasia, hasil build.

```text
node_modules/
.env
*.log
dist/
.DS_Store
```

Simpan sebagai berkas `.gitignore` di akar proyek. Jika file sudah terlanjur di-track, hentikan pelacakannya dengan `git rm --cached nama-file`.

## Modul 7 — Membatalkan dan Memperbaiki

```bash
git restore nama-file            # buang perubahan yang belum di-staging
git restore --staged nama-file   # keluarkan dari staging (perubahan tetap ada)
git commit --amend -m "Pesan baru"   # ubah commit TERAKHIR (jangan jika sudah dibagikan)
git revert <id-commit>           # buat commit baru yang membatalkan commit lama (aman)
```

### reset: hati-hati

```bash
git reset --soft HEAD~1    # batalkan commit terakhir, perubahan tetap di staging
git reset --mixed HEAD~1   # batalkan commit, perubahan kembali ke working directory
git reset --hard HEAD~1    # batalkan commit DAN buang perubahan (tidak bisa dibalikkan mudah)
```

> ⚠️ Jangan memakai `reset --hard` pada commit yang sudah dibagikan ke orang lain. Gunakan `git revert` sebagai gantinya.

## Modul 8 — Branch (Percabangan)

Branch memungkinkan Anda mengembangkan fitur di jalur terpisah.

```bash
git branch                     # daftar branch
git branch fitur-login         # buat branch
git switch fitur-login         # pindah ke branch itu
git switch -c fitur-profil     # buat sekaligus pindah
git branch -d fitur-login      # hapus branch (jika sudah di-merge)
```

Alur khas: buat branch → commit di sana → gabungkan ke `main` bila sudah beres.

## Modul 9 — Merge dan Konflik

```bash
git switch main
git merge fitur-login          # gabungkan fitur-login ke main
```

### Menangani konflik

Konflik terjadi saat dua branch mengubah baris yang sama. Git menandai file seperti ini:

```text
<<<<<<< HEAD
versi dari branch saat ini
=======
versi dari branch yang digabung
>>>>>>> fitur-login
```

Langkah menyelesaikan:

1. Buka file, pilih/gabungkan isi yang benar, **hapus ketiga baris penanda** (`<<<<<<<`, `=======`, `>>>>>>>`).
2. `git add nama-file`
3. `git commit` (atau `git merge --continue`).

Untuk membatalkan merge yang bermasalah: `git merge --abort`.

> Pastikan tidak ada penanda konflik yang tertinggal di file sebelum commit. Jika tertinggal, penanda itu ikut tampil di situs Anda.

## Modul 10 — Menyimpan Pekerjaan Sementara (Stash)

```bash
git stash                  # simpan perubahan sementara, working directory bersih
git stash list
git stash pop              # kembalikan perubahan terakhir
git stash drop             # buang stash terakhir
```

Berguna saat harus berpindah branch mendadak.

## Modul 11 — Tag dan Melihat Riwayat

```bash
git tag v1.0.0                       # tandai versi
git tag -a v1.0.1 -m "Rilis 1.0.1"   # tag beranotasi
git tag                              # daftar tag
git show <id-commit>                 # detail satu commit
git blame nama-file                  # siapa mengubah tiap baris
git log --author="Nama" --since="2 weeks ago"
```

## Modul 12 — Cheat Sheet

| Tujuan | Perintah |
|---|---|
| Mulai repositori | `git init` |
| Cek status | `git status` |
| Siapkan perubahan | `git add .` |
| Simpan | `git commit -m "pesan"` |
| Lihat riwayat | `git log --oneline --graph` |
| Buat & pindah branch | `git switch -c nama` |
| Gabungkan | `git merge nama` |
| Batalkan perubahan file | `git restore file` |
| Batalkan commit aman | `git revert id` |
| Simpan sementara | `git stash` / `git stash pop` |

Latihan mandiri: buat repositori baru, buat tiga commit, buat branch `fitur`, ubah satu file di dua branch, lalu sengaja buat dan selesaikan sebuah konflik merge.
