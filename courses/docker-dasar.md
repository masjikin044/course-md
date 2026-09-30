# Docker Dasar

Course ini membawa Anda dari nol: memahami apa itu container, memakai image, menulis Dockerfile, mengelola data dan jaringan, sampai menjalankan banyak layanan dengan Docker Compose.

## Modul 1 — Apa itu Docker dan Container?

**Container** adalah cara membungkus aplikasi beserta seluruh kebutuhannya (runtime, library, konfigurasi) dalam satu paket terisolasi. Aplikasi yang berjalan di laptop Anda akan berjalan sama di server, karena lingkungannya ikut terbawa.

| Konsep | Penjelasan singkat |
|---|---|
| **Image** | Cetakan/templat read-only berisi aplikasi dan dependensinya |
| **Container** | Image yang sedang berjalan (instance-nya) |
| **Dockerfile** | Resep tertulis untuk membangun image |
| **Registry** | Tempat menyimpan image, contoh: Docker Hub |
| **Volume** | Penyimpanan data yang tetap ada walau container dihapus |
| **Network** | Jaringan virtual agar container saling terhubung |

### Container vs Virtual Machine

- **VM** membawa sistem operasi lengkap sendiri → berat, butuh menit untuk menyala.
- **Container** berbagi kernel dengan host → ringan, menyala dalam hitungan detik, memakai memori jauh lebih sedikit.

## Modul 2 — Instalasi dan Verifikasi

Pasang **Docker Desktop** (Windows/macOS) atau **Docker Engine** (Linux) dari situs resmi docker.com. Setelah terpasang, cek dengan:

```bash
docker --version
docker run hello-world
```

Jika muncul pesan "Hello from Docker!", instalasi Anda berhasil. Perintah tersebut otomatis mengunduh image `hello-world` lalu menjalankannya sebagai container.

> Di Linux, agar tidak perlu mengetik `sudo` di setiap perintah: `sudo usermod -aG docker $USER`, lalu logout dan login kembali.

## Modul 3 — Bekerja dengan Image

```bash
docker pull nginx:1.27        # unduh image dengan tag versi tertentu
docker images                 # daftar image lokal
docker rmi nginx:1.27         # hapus image
docker search redis           # cari image di Docker Hub
```

Format nama image: `nama:tag`. Jika tag tidak ditulis, Docker memakai `latest`. **Sebaiknya selalu tulis tag versi** agar hasil build konsisten.

## Modul 4 — Menjalankan Container

```bash
docker run nginx                              # jalan di foreground
docker run -d --name web -p 8080:80 nginx     # jalan di background
```

Penjelasan opsi penting:

| Opsi | Fungsi |
|---|---|
| `-d` | Detached: jalan di latar belakang |
| `--name web` | Memberi nama container |
| `-p 8080:80` | Petakan port host **8080** ke port container **80** |
| `-e KEY=nilai` | Mengisi environment variable |
| `-v data:/path` | Memasang volume/folder ke container |
| `--rm` | Hapus container otomatis saat berhenti |
| `-it` | Mode interaktif dengan terminal |

Buka `http://localhost:8080` di browser — halaman sambutan Nginx akan tampil.

## Modul 5 — Mengelola Container

```bash
docker ps                  # container yang sedang berjalan
docker ps -a               # semua container (termasuk yang berhenti)
docker stop web            # hentikan
docker start web           # jalankan lagi
docker restart web         # restart
docker rm web              # hapus (harus berhenti dulu)
docker rm -f web           # paksa hapus walau masih jalan
```

### Melihat log dan masuk ke dalam container

```bash
docker logs web            # lihat log
docker logs -f web         # ikuti log secara live
docker exec -it web sh     # buka shell di dalam container
docker inspect web         # detail konfigurasi (JSON)
docker stats               # pemakaian CPU/memori real-time
```

## Modul 6 — Membuat Dockerfile

Dockerfile adalah berkas teks bernama persis `Dockerfile` (tanpa ekstensi). Contoh untuk aplikasi Node.js:

```dockerfile
# 1. Image dasar
FROM node:20-alpine

# 2. Folder kerja di dalam container
WORKDIR /app

# 3. Salin file dependensi dulu (agar cache build efisien)
COPY package*.json ./

# 4. Pasang dependensi
RUN npm ci --omit=dev

# 5. Salin sisa kode aplikasi
COPY . .

# 6. Dokumentasi port yang dipakai aplikasi
EXPOSE 3000

# 7. Perintah yang dijalankan saat container start
CMD ["node", "server.js"]
```

### Instruksi yang wajib dikenal

| Instruksi | Fungsi |
|---|---|
| `FROM` | Menentukan image dasar |
| `WORKDIR` | Menetapkan folder kerja |
| `COPY` / `ADD` | Menyalin file ke image (utamakan `COPY`) |
| `RUN` | Menjalankan perintah **saat build** |
| `CMD` | Perintah default **saat container berjalan** |
| `ENTRYPOINT` | Perintah utama yang tidak mudah ditimpa |
| `ENV` | Mengatur environment variable |
| `EXPOSE` | Mendokumentasikan port |
| `ARG` | Variabel yang hanya ada saat build |

### Build dan jalankan

```bash
docker build -t aplikasi-saya:1.0 .
docker run -d -p 3000:3000 --name app aplikasi-saya:1.0
```

Tanda titik (`.`) di akhir perintah build adalah **konteks build**: folder tempat Docker mencari file yang akan disalin.

## Modul 7 — .dockerignore dan Praktik Build yang Baik

Buat berkas `.dockerignore` agar file yang tidak perlu tidak ikut disalin (build lebih cepat dan lebih aman):

```text
node_modules
.git
.env
*.log
Dockerfile
.dockerignore
```

Kebiasaan yang disarankan:

- Pakai image dasar yang kecil (`-alpine` atau `-slim`).
- Salin file dependensi **sebelum** kode, agar layer cache terpakai ulang.
- Jangan menaruh rahasia (password, API key) di dalam image.
- Satu container, satu tanggung jawab utama.
- Selalu pin versi tag, hindari `latest` di produksi.

### Multi-stage build

Memisahkan tahap build dan tahap jalan agar image akhir kecil:

```dockerfile
# Tahap 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Tahap 2: hasil akhir, hanya berisi file statis
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Modul 8 — Volume: Menyimpan Data

Data di dalam container **hilang saat container dihapus**. Gunakan volume agar data bertahan.

```bash
docker volume create data-db
docker volume ls

# Named volume: dikelola Docker
docker run -d --name db -v data-db:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=rahasia postgres:16

# Bind mount: memakai folder di komputer Anda (cocok untuk development)
docker run -d -p 8080:80 -v "$(pwd)":/usr/share/nginx/html:ro nginx
```

| Jenis | Cocok untuk |
|---|---|
| **Named volume** | Data database, data yang harus awet |
| **Bind mount** | Development: kode di host langsung terlihat di container |

## Modul 9 — Jaringan (Network)

Container di **user-defined network** yang sama bisa saling memanggil memakai **nama container** sebagai hostname.

```bash
docker network create app-net
docker run -d --name db --network app-net -e POSTGRES_PASSWORD=rahasia postgres:16
docker run -d --name api --network app-net -p 3000:3000 aplikasi-saya:1.0
```

Di dalam container `api`, database dapat diakses dengan host `db`, bukan `localhost`.

```bash
docker network ls
docker network inspect app-net
```

## Modul 10 — Docker Compose

Compose menjalankan banyak container sekaligus dari satu berkas `compose.yaml` (atau `docker-compose.yml`).

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:rahasia@db:5432/appdb
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: rahasia
      POSTGRES_DB: appdb
    volumes:
      - data-db:/var/lib/postgresql/data

volumes:
  data-db:
```

Perintah yang sering dipakai:

```bash
docker compose up -d          # buat & jalankan semua layanan
docker compose ps             # status layanan
docker compose logs -f api    # log satu layanan
docker compose exec api sh    # masuk ke layanan
docker compose down           # hentikan & hapus container + network
docker compose down -v        # sekaligus hapus volume (data hilang!)
docker compose up -d --build  # build ulang image lalu jalankan
```

> Untuk menyimpan password dengan rapi, pisahkan ke berkas `.env` dan rujuk memakai `${NAMA_VARIABEL}` di `compose.yaml`. Jangan commit `.env` ke Git.

## Modul 11 — Docker Hub dan Membagikan Image

```bash
docker login
docker tag aplikasi-saya:1.0 usernameanda/aplikasi-saya:1.0
docker push usernameanda/aplikasi-saya:1.0
docker pull usernameanda/aplikasi-saya:1.0
```

Nama image untuk registry publik harus berformat `username/nama:tag`.

## Modul 12 — Membersihkan Ruang Disk

Seiring waktu, image dan container lama menumpuk.

```bash
docker system df              # lihat pemakaian disk
docker container prune        # hapus semua container yang berhenti
docker image prune            # hapus image tanpa tag (dangling)
docker image prune -a         # hapus semua image yang tidak dipakai
docker volume prune           # hapus volume yang tidak dipakai
docker system prune           # bersihkan sekaligus (hati-hati)
```

## Modul 13 — Troubleshooting Umum

| Masalah | Penyebab & solusi |
|---|---|
| `port is already allocated` | Port host sudah dipakai. Ganti sisi kiri, misal `-p 8081:80`. |
| Container langsung berhenti (`Exited`) | Proses utama selesai/gagal. Cek `docker logs nama`. |
| `permission denied` di Linux | Tambahkan user ke grup docker (lihat Modul 2). |
| Perubahan kode tidak terlihat | Build ulang: `docker compose up -d --build`. |
| Aplikasi tidak bisa konek ke database | Pakai nama layanan (`db`), bukan `localhost`, dan pastikan satu network. |
| Data hilang setelah container dihapus | Belum memakai volume (Modul 8). |

## Ringkasan dan Langkah Selanjutnya

- **Image** = cetakan, **container** = hasil jalannya.
- Tulis `Dockerfile`, build dengan `docker build`, jalankan dengan `docker run`.
- Simpan data dengan **volume**, hubungkan layanan dengan **network**.
- Untuk banyak layanan, gunakan **Docker Compose**.

Latihan mandiri: bungkus sebuah situs statis (HTML) ke dalam image Nginx, jalankan di port 8080, lalu ubah menjadi `compose.yaml`.
