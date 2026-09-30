# Linux Fundamental

Course ini fokus pada **perintah dasar Linux** di terminal: berpindah folder, mengelola file, membaca isi file, mencari, izin akses, sampai proses dan paket. Semua contoh bisa dicoba di Ubuntu/Debian, WSL di Windows, atau terminal macOS (sebagian besar sama).

## Modul 1 — Mengenal Terminal

Terminal menampilkan **prompt**, misalnya:

```bash
budi@laptop:~$
```

- `budi` = nama user, `laptop` = nama komputer
- `~` = folder home Anda
- `$` = user biasa (tanda `#` berarti root/administrator)

Format perintah: `perintah [opsi] [argumen]`, contoh `ls -l /etc`.

Tips yang menghemat waktu:

- Tombol **Tab** melengkapi nama file/perintah otomatis.
- Tombol **↑ / ↓** memutar riwayat perintah.
- **Ctrl + C** membatalkan perintah yang sedang berjalan.
- **Ctrl + L** (atau `clear`) membersihkan layar.

## Modul 2 — Bantuan Bawaan

```bash
man ls          # manual lengkap (keluar dengan tombol q)
ls --help       # ringkasan opsi
whatis ls       # penjelasan satu baris
type cd         # cek jenis perintah
```

Biasakan membaca `man` atau `--help` sebelum bertanya. Itu kebiasaan paling berharga.

## Modul 3 — Navigasi Folder

```bash
pwd             # tampilkan lokasi sekarang
ls              # isi folder
ls -l           # format panjang (izin, pemilik, ukuran, tanggal)
ls -a           # termasuk file tersembunyi (diawali titik)
ls -lah         # gabungan: panjang, semua file, ukuran mudah dibaca
cd Documents    # masuk ke folder Documents
cd ..           # naik satu tingkat
cd ~            # ke folder home (sama dengan cd tanpa argumen)
cd -            # kembali ke folder sebelumnya
```

### Path absolut dan relatif

| Jenis | Contoh | Keterangan |
|---|---|---|
| **Absolut** | `/home/budi/Documents` | Dimulai dari `/` (root) |
| **Relatif** | `Documents/tugas` | Dihitung dari lokasi sekarang |
| `.` | `./skrip.sh` | Folder saat ini |
| `..` | `../data` | Folder induk |

## Modul 4 — Struktur Direktori Linux

| Folder | Isi |
|---|---|
| `/` | Akar seluruh sistem |
| `/home` | Folder pribadi tiap user |
| `/etc` | File konfigurasi sistem |
| `/var` | Data yang berubah: log, cache |
| `/tmp` | File sementara |
| `/usr` | Program dan library |
| `/bin`, `/sbin` | Perintah dasar sistem |
| `/dev` | Representasi perangkat |
| `/root` | Folder home user root |

Di Linux, **semuanya adalah file**, dan nama file **peka huruf besar/kecil**: `Data.txt` berbeda dengan `data.txt`.

## Modul 5 — Membuat, Menyalin, Memindah, Menghapus

```bash
mkdir proyek                 # buat folder
mkdir -p proyek/src/css      # buat folder bertingkat sekaligus
touch catatan.txt            # buat file kosong
cp catatan.txt salinan.txt   # salin file
cp -r proyek proyek-backup   # salin folder (recursive)
mv salinan.txt arsip.txt     # ganti nama ATAU pindahkan
mv arsip.txt proyek/         # pindahkan ke folder
rm arsip.txt                 # hapus file
rm -r proyek-backup          # hapus folder beserta isinya
rmdir folder-kosong          # hapus folder kosong
```

> ⚠️ **Tidak ada Recycle Bin di terminal.** `rm` menghapus permanen. Gunakan `rm -i` agar diminta konfirmasi, dan jangan pernah menjalankan `rm -rf /` atau perintah `rm -rf` yang belum Anda pahami.

### Wildcard

```bash
ls *.txt          # semua file berakhiran .txt
ls data?.csv      # ? = tepat satu karakter (data1.csv, dataA.csv)
rm log-*.tmp      # hapus semua log-....tmp
```

## Modul 6 — Membaca Isi File

```bash
cat catatan.txt          # tampilkan seluruh isi
less panjang.log         # baca per halaman (q untuk keluar, / untuk cari)
head -n 5 data.csv       # 5 baris pertama
tail -n 5 data.csv       # 5 baris terakhir
tail -f app.log          # ikuti penambahan baris secara live
wc -l data.csv           # hitung jumlah baris
```

## Modul 7 — Menulis ke File dan Redirection

```bash
echo "Halo Linux" > sapa.txt      # tulis (menimpa isi lama)
echo "Baris kedua" >> sapa.txt    # tambah di akhir (append)
cat sapa.txt
```

| Simbol | Fungsi |
|---|---|
| `>` | Arahkan output ke file (timpa) |
| `>>` | Arahkan output ke file (tambah) |
| `<` | Ambil input dari file |
| `2>` | Arahkan pesan error ke file |
| `\|` | **Pipe**: output perintah kiri menjadi input perintah kanan |

Contoh pipe:

```bash
ls -l | wc -l                    # hitung jumlah entri
cat log.txt | grep "error"       # tampilkan baris berisi "error"
history | tail -n 10             # 10 perintah terakhir
```

## Modul 8 — Mencari File dan Teks

```bash
find . -name "*.md"              # cari file berdasarkan nama
find /var/log -type f -size +1M  # file lebih dari 1 MB
grep "error" app.log             # cari teks di dalam file
grep -i "error" app.log          # abaikan huruf besar/kecil
grep -n "error" app.log          # tampilkan nomor baris
grep -r "TODO" .                 # cari rekursif di semua file
which python3                    # lokasi sebuah perintah
```

## Modul 9 — Izin Akses (Permissions)

Hasil `ls -l`:

```text
-rwxr-xr-- 1 budi staf 1204 Sep 28 10:00 skrip.sh
```

Bacaan bagian pertama `-rwxr-xr--`:

| Posisi | Arti |
|---|---|
| `-` | Jenis: `-` file, `d` folder |
| `rwx` | Izin **pemilik** (user) |
| `r-x` | Izin **grup** |
| `r--` | Izin **lainnya** (others) |

`r` = read (4), `w` = write (2), `x` = execute (1).

```bash
chmod +x skrip.sh        # beri izin eksekusi
chmod 644 catatan.txt    # rw-r--r--
chmod 755 skrip.sh       # rwxr-xr-x
chmod u+w,go-w file.txt  # notasi huruf
chown budi:staf file.txt # ganti pemilik (butuh sudo)
```

Menjalankan skrip di folder saat ini: `./skrip.sh`.

## Modul 10 — Superuser: sudo

`sudo` menjalankan satu perintah dengan hak administrator.

```bash
sudo apt update
sudo nano /etc/hosts
whoami            # tampilkan user aktif
id                # UID dan grup
```

Gunakan `sudo` seperlunya. Kesalahan dengan hak root bisa merusak sistem.

## Modul 11 — Mengelola Paket (Debian/Ubuntu)

```bash
sudo apt update                 # perbarui daftar paket
sudo apt upgrade                # perbarui paket terpasang
sudo apt install htop           # pasang paket
sudo apt remove htop            # hapus paket
apt search nginx                # cari paket
```

Distro lain memakai manajer paket berbeda: `dnf` (Fedora/RHEL), `pacman` (Arch), `brew` (macOS).

## Modul 12 — Proses dan Sumber Daya

```bash
ps aux                # daftar semua proses
top                   # pantau proses live (q untuk keluar)
htop                  # versi lebih nyaman (perlu dipasang)
kill 1234             # hentikan proses berdasarkan PID
kill -9 1234          # paksa hentikan (pilihan terakhir)
pkill firefox         # hentikan berdasarkan nama
df -h                 # ruang disk per partisi
du -sh folder/        # ukuran sebuah folder
free -h               # pemakaian memori
uname -a              # info kernel dan sistem
```

Menjalankan di latar belakang:

```bash
sleep 60 &            # jalankan di background
jobs                  # lihat pekerjaan background
```

## Modul 13 — Editor Teks di Terminal

**nano** (paling ramah pemula):

```bash
nano catatan.txt
```

- Simpan: **Ctrl + O**, lalu Enter
- Keluar: **Ctrl + X**

**vim** ada hampir di semua server. Bekal minimal: tekan `i` untuk menulis, `Esc` untuk berhenti menulis, ketik `:wq` untuk simpan dan keluar, `:q!` untuk keluar tanpa simpan.

## Modul 14 — Jaringan Dasar dan Arsip

```bash
ping -c 4 google.com             # tes koneksi
curl https://example.com         # ambil isi sebuah URL
wget https://example.com/file.zip # unduh file
ip a                             # lihat alamat IP

tar -czf backup.tar.gz folder/   # kompres jadi .tar.gz
tar -xzf backup.tar.gz           # ekstrak
zip -r arsip.zip folder/         # buat zip
unzip arsip.zip                  # ekstrak zip
```

## Modul 15 — Ringkasan Cheat Sheet

| Tujuan | Perintah |
|---|---|
| Lihat lokasi | `pwd` |
| Isi folder | `ls -lah` |
| Pindah folder | `cd` |
| Buat folder/file | `mkdir`, `touch` |
| Salin/pindah/hapus | `cp`, `mv`, `rm` |
| Baca file | `cat`, `less`, `head`, `tail` |
| Cari | `find`, `grep` |
| Izin | `chmod`, `chown` |
| Admin | `sudo` |
| Paket | `apt install` |
| Proses | `ps`, `top`, `kill` |
| Bantuan | `man`, `--help` |

Latihan mandiri: buat folder `latihan`, isi dengan tiga file teks, salin ke `backup/`, cari kata tertentu memakai `grep`, lalu kompres menjadi `backup.tar.gz`.
