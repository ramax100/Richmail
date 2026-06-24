# RichMail - Disposable Email Service

Aplikasi email sementara (temporary/disposable email) dengan dukungan **custom domain**. Terima email sungguhan dari Gmail, Yahoo, Outlook, dll langsung ke inbox web Anda.

**Gratis. Tanpa kartu kredit. Bisa deploy dari HP.**

---

## Fitur

- **Custom Domain** — Gunakan domain Anda sendiri (bisa banyak domain)
- **Terima Email Sungguhan** — Email dari Gmail/Yahoo/Outlook langsung masuk
- **Web Inbox** — Baca, hapus email dari browser
- **Generate Email Random** — Buat alamat email acak dengan 1 klik
- **Custom Username** — Pilih username sendiri (misal: `nama@domain.com`)
- **Auto Refresh** — Inbox update otomatis setiap 5 detik
- **Multi-Domain** — Tambah banyak domain sekaligus
- **Admin Panel** — Kelola domain, lihat statistik, panduan setup
- **Password Protected** — Admin panel dilindungi password
- **Auto Cleanup** — Email otomatis terhapus setelah waktu tertentu
- **Statistik** — Total email, email hari ini, per domain breakdown
- **Dark Theme Admin** — Tampilan admin modern dan nyaman
- **Zero Dependencies** — Hanya butuh Node.js, tanpa npm packages
- **Mobile Friendly** — Responsive, bisa diakses dari HP

---

## Demo

| Halaman | Deskripsi |
|---------|-----------|
| `/` | Inbox utama - generate email, terima & baca pesan |
| `/admin.html` | Admin panel - kelola domain, statistik |

---

## Yang Dibutuhkan

| Layanan | Fungsi | Biaya |
|---------|--------|-------|
| [Cloudflare](https://cloudflare.com) | Menerima email & routing ke app | Gratis |
| [Render](https://render.com) | Hosting web app | Gratis |
| [GitHub](https://github.com) | Menyimpan source code | Gratis |
| Domain | Alamat email (misal: `@domain.com`) | Mulai Rp 14.000/tahun |

**Total biaya: Rp 0 - Rp 14.000/tahun** (hanya biaya domain)

---

## Cara Deploy (Step-by-Step)

### Langkah 1: Fork/Clone Repository

1. Login ke GitHub
2. Fork repository ini, atau clone:
```bash
git clone https://github.com/ramax100/Richmail.git
```

---

### Langkah 2: Deploy ke Render

1. Buka [render.com](https://render.com) → daftar dengan GitHub (gratis, tanpa kartu)
2. Klik **"New +"** → **"Web Service"**
3. Connect repository **Richmail**
4. Isi settings:

| Field | Value |
|-------|-------|
| Name | `richmail` (atau nama lain) |
| Region | Singapore (Southeast Asia) |
| Branch | `main` |
| Runtime | **Node** |
| Build Command | `echo "no build"` |
| Start Command | `node server/app.js` |
| Instance Type | **Free** |

5. Klik **"Create Web Service"**
6. Tunggu 2-3 menit sampai status **"Live"**

---

### Langkah 3: Set Environment Variables

Di Render → service Anda → tab **"Environment"**, tambahkan:

| Key | Value | Keterangan |
|-----|-------|-----------|
| `MAIL_DOMAINS` | `yourdomain.com` | Domain Anda (pisah koma jika banyak) |
| `ADMIN_PASSWORD` | `passwordanda` | Password untuk admin panel |
| `WEBHOOK_SECRET` | `secret-key-random-anda` | Secret untuk verifikasi webhook |
| `EMAIL_EXPIRY` | `60` | Menit sebelum email auto-hapus |
| `CLOUDFLARE_API_TOKEN` | *(dari Cloudflare)* | Untuk auto-setup domain |
| `CLOUDFLARE_ACCOUNT_ID` | *(dari Cloudflare)* | Account ID Cloudflare |

> **Penting:** Ganti semua value di atas dengan milik Anda sendiri. Jangan gunakan default.

---

### Langkah 4: Setup Cloudflare

#### 4a. Daftar Cloudflare (gratis)
1. Buka [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Daftar dengan email (tanpa kartu kredit)

#### 4b. Tambah Domain ke Cloudflare
1. Klik **"Add a site"** → masukkan domain Anda
2. Pilih plan **Free** → Continue
3. Cloudflare akan kasih **2 nameserver** (contoh: `xxx.ns.cloudflare.com`)
4. **Ganti nameserver** di panel tempat beli domain ke nameserver Cloudflare
5. Tunggu 5-30 menit sampai status domain jadi **"Active"**

#### 4c. Enable Email Routing
1. Di Cloudflare → pilih domain → menu kiri **"Email"** → **"Email Routing"**
2. Klik **"Enable Email Routing"**
3. Jika ada peringatan tentang MX record → klik **"Add records automatically"**

#### 4d. Buat Email Worker
1. Di halaman Email Routing → tab **"Email Workers"**
2. Klik **"Create"** → beri nama `richmail-worker`
3. Hapus semua code default
4. Buka file `cloudflare-worker.js` di repository ini
5. **Edit baris pertama** di dalam function: ganti URL ke URL Render Anda:
```javascript
var url = "https://NAMA-APP-ANDA.onrender.com/webhook/email";
```
6. **Edit baris kedua**: ganti secret sama dengan `WEBHOOK_SECRET` di Render:
```javascript
var secret = "secret-key-random-anda";
```
7. Copy-paste semua code ke editor Cloudflare
8. Klik **"Save and Deploy"**

#### 4e. Set Catch-All Route
1. Kembali ke **"Email Routing"** → tab **"Routing rules"**
2. Di bagian **"Catch-all address"** → klik **Edit**
3. Action: pilih **"Send to a Worker"**
4. Pilih: **richmail-worker**
5. Klik **Save**

---

### Langkah 5: Buat Cloudflare API Token (Opsional - untuk auto-setup domain)

Ini diperlukan jika ingin menambah domain baru langsung dari admin panel.

1. Buka [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Klik **"Create Token"**
3. Scroll ke bawah → klik **"Get started"** (Custom Token)
4. Isi:
   - Token name: `RichMail`
   - Permissions:
     | Kiri | Tengah | Kanan |
     |------|--------|-------|
     | Zone | Zone | Edit |
     | Zone | DNS | Edit |
     | Zone | Zone Settings | Edit |
     | Zone | Email Routing Rules | Edit |
   - Zone Resources: **Include** → **All zones**
5. Klik **"Continue to summary"** → **"Create Token"**
6. Copy token → taruh di environment variable `CLOUDFLARE_API_TOKEN` di Render

Untuk **Account ID**:
1. Buka Cloudflare → klik domain Anda → halaman Overview
2. Scroll ke bawah kanan → copy **"Account ID"**
3. Taruh di environment variable `CLOUDFLARE_ACCOUNT_ID` di Render

---

### Langkah 6: Test!

1. Buka `https://NAMA-APP-ANDA.onrender.com`
2. Generate atau buat email address
3. Kirim email dari Gmail ke alamat tersebut
4. Tunggu beberapa detik → email muncul di inbox!

---

## Cara Tambah Domain Baru

### Dari Admin Panel:
1. Buka `https://NAMA-APP-ANDA.onrender.com/admin.html`
2. Login dengan password admin
3. Ketik domain baru → klik **"+ Tambah & Auto Setup"**
4. Ikuti langkah manual yang ditampilkan:
   - Ganti nameserver domain di registrar
   - Klik "Enable Email Routing" di Cloudflare
   - Set Catch-all → Send to Worker

### Jangan lupa:
Tambahkan domain baru juga ke environment variable `MAIL_DOMAINS` di Render:
```
MAIL_DOMAINS=domain1.com,domain2.com,domain3.com
```
Ini supaya domain tidak hilang saat Render restart.

---

## Environment Variables

| Variable | Required | Default | Keterangan |
|----------|----------|---------|-----------|
| `MAIL_DOMAINS` | Ya | - | Domain email, pisah koma |
| `ADMIN_PASSWORD` | Ya | - | Password admin panel |
| `WEBHOOK_SECRET` | Ya | - | Secret untuk webhook verification |
| `EMAIL_EXPIRY` | Tidak | `60` | Menit sebelum email auto-hapus |
| `CLOUDFLARE_API_TOKEN` | Tidak | - | Untuk auto-setup domain |
| `CLOUDFLARE_ACCOUNT_ID` | Tidak | - | Cloudflare Account ID |
| `PORT` | Tidak | `3000` | Port web server |

---

## Struktur Project

```
Richmail/
├── server/
│   ├── app.js            # Web server + API routes
│   ├── database.js       # JSON file storage
│   └── cloudflare.js     # Cloudflare API helper
├── public/
│   ├── index.html        # Halaman inbox utama
│   ├── admin.html        # Admin panel
│   ├── style.css         # Styling
│   └── app.js            # Frontend logic
├── cloudflare-worker.js  # Code untuk Cloudflare Email Worker
├── config.js             # Konfigurasi app
├── Dockerfile            # Docker deployment
├── docker-compose.yml    # Docker Compose (untuk VPS)
├── fly.toml              # Fly.io config (alternatif)
├── render.yaml           # Render blueprint
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/domains` | Daftar domain aktif |
| GET | `/api/generate?domain=x` | Generate email random |
| POST | `/api/mailbox` | Buat mailbox custom |
| GET | `/api/emails?address=x` | Ambil inbox |
| GET | `/api/email/:id` | Baca satu email |
| DELETE | `/api/email/:id` | Hapus satu email |
| DELETE | `/api/emails?address=x` | Hapus semua email |
| POST | `/webhook/email` | Webhook terima email dari Cloudflare |
| GET | `/health` | Health check |

### Admin API (butuh Authorization header):
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| POST | `/admin/api/login` | Login admin |
| GET | `/admin/api/stats` | Statistik |
| GET | `/admin/api/domains` | List domain |
| POST | `/admin/api/domains` | Tambah domain |
| DELETE | `/admin/api/domains?domain=x` | Hapus domain |
| POST | `/admin/api/domains/auto-setup` | Auto setup via Cloudflare |

---

## Deployment Alternatif

### Docker (VPS)
```bash
git clone https://github.com/ramax100/Richmail.git
cd Richmail
docker compose up -d
```

### Manual (VPS/Local)
```bash
git clone https://github.com/ramax100/Richmail.git
cd Richmail
node server/app.js
```

---

## Arsitektur

```
Email pengirim (Gmail/Yahoo/dll)
        │
        ▼
Cloudflare Email Routing
        │
        ▼
Cloudflare Email Worker
        │
        ▼ POST /webhook/email
        │
RichMail App (Render.com)
        │
        ▼
JSON Storage → Web Inbox
```

---

## FAQ

**Q: Apakah benar-benar gratis?**
A: Ya, selama menggunakan Render free tier + Cloudflare free plan. Hanya perlu bayar domain.

**Q: Bisa diakses dari HP?**
A: Ya, semua bisa dilakukan dari browser HP.

**Q: Email dari Gmail bisa masuk?**
A: Ya, email dari layanan manapun bisa masuk selama MX record benar.

**Q: Berapa lama email tersimpan?**
A: Sesuai setting `EMAIL_EXPIRY` (default 60 menit). Bisa diubah.

**Q: Bisa untuk banyak domain?**
A: Ya, tidak ada batasan jumlah domain.

**Q: Apakah aman?**
A: Email disimpan di server Render. Untuk keamanan tambahan, ganti `ADMIN_PASSWORD` dan `WEBHOOK_SECRET` dengan nilai yang kuat.

**Q: Render free tier ada batasannya?**
A: Ya, app akan "sleep" setelah 15 menit tidak ada traffic. Akses pertama setelah sleep butuh ~30 detik untuk "bangun". Email yang masuk saat sleep akan tetap diterima karena Cloudflare Worker yang meneruskan.

---

## Keamanan

- Ganti `ADMIN_PASSWORD` dari default
- Gunakan `WEBHOOK_SECRET` yang unik dan panjang
- Jangan share API Token Cloudflare Anda
- Email bersifat sementara dan akan otomatis terhapus

---

## Kontribusi

Pull request welcome! Silakan fork dan buat perubahan.

---

## Lisensi

MIT License

---

## Credits

Dibuat dengan Node.js, Cloudflare Email Routing, dan Render.
