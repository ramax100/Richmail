# RichMail - Disposable Email Service

Aplikasi email sementara (temporary/disposable email) dengan dukungan **custom domain**. Terima email sungguhan dari Gmail, Yahoo, Outlook, dll langsung ke inbox web Anda.

**Gratis. Tanpa kartu kredit. Bisa deploy dari HP.**

---

## Komunitas

**Projek ini gratis dan bebas dikembangkan!**

Gabung channel Telegram untuk diskusi, update, dan bantuan:

👉 **https://t.me/GrupRichStore**

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
- **Statistik Lengkap** — Total email, email hari ini, statistik per domain
- **Dark Theme Admin** — Tampilan admin modern dan nyaman
- **Zero Dependencies** — Hanya butuh Node.js, tanpa npm packages
- **Mobile Friendly** — Responsive, bisa diakses dari HP
- **Auto Setup Domain** — Tambah domain baru dari admin panel

---

## Yang Dibutuhkan

| Layanan | Fungsi | Biaya |
|---------|--------|-------|
| [Cloudflare](https://cloudflare.com) | Menerima email & routing ke app | **Gratis** |
| [Render](https://render.com) | Hosting web app | **Gratis** |
| [GitHub](https://github.com) | Menyimpan source code | **Gratis** |
| Domain | Alamat email (misal: `@domain.com`) | Mulai Rp 14.000/tahun |

**Total biaya: Rp 0 - Rp 14.000/tahun** (hanya biaya domain)

---

## Cara Kerja (Arsitektur)

```
Seseorang kirim email ke alamat@domainanda.com
        │
        ▼
Cloudflare Email Routing (menangkap email)
        │
        ▼
Cloudflare Email Worker (meneruskan email ke app)
        │
        ▼ POST /webhook/email (dengan secret key)
        │
RichMail App di Render.com (menyimpan & menampilkan)
        │
        ▼
Anda buka web → baca email di inbox
```

---

## Cara Deploy (Step-by-Step Lengkap)

### Langkah 1: Fork Repository

1. Login ke [GitHub](https://github.com)
2. Buka halaman repository ini
3. Klik tombol **"Fork"** di kanan atas
4. Sekarang Anda punya copy di akun sendiri

---

### Langkah 2: Deploy ke Render

1. Buka [render.com](https://render.com)
2. Klik **"Get Started for Free"** → **Sign up with GitHub** (gratis, tanpa kartu)
3. Setelah login, klik **"New +"** → **"Web Service"**
4. Cari dan pilih repository **Richmail** yang sudah di-fork → klik **"Connect"**
5. Isi settings:

| Field | Value |
|-------|-------|
| Name | `richmail` (atau nama bebas) |
| Region | Singapore (Southeast Asia) |
| Branch | `main` |
| Runtime | **Node** |
| Build Command | `echo "no build"` |
| Start Command | `node server/app.js` |
| Instance Type | **Free** |

6. Klik **"Create Web Service"**
7. Tunggu 2-3 menit sampai status **"Live"**
8. Catat URL Anda, contoh: `https://richmail.onrender.com`

---

### Langkah 3: Set Environment Variables di Render

Di Render → service Anda → tab **"Environment"** → tambah variable berikut:

| Key | Value | Penjelasan |
|-----|-------|-----------|
| `MAIL_DOMAINS` | `domainanda.com` | Domain email Anda. Kalau lebih dari 1, pisah pakai koma: `domain1.com,domain2.com` |
| `ADMIN_PASSWORD` | *(buat sendiri)* | Password untuk masuk admin panel. Contoh: `MyP@ssw0rd!` — pilih yang susah ditebak |
| `WEBHOOK_SECRET` | *(buat sendiri)* | Kunci rahasia untuk verifikasi email masuk. Buat random, contoh: `xK9mW2pL7qR4s` — **ingat/catat ini karena nanti dipakai di Cloudflare Worker juga** |
| `EMAIL_EXPIRY` | `60` | Berapa menit sebelum email otomatis dihapus. 60 = 1 jam |

**Opsional** (untuk fitur auto-setup domain dari admin panel):

| Key | Value | Penjelasan |
|-----|-------|-----------|
| `CLOUDFLARE_API_TOKEN` | *(dari Cloudflare)* | Cara dapat: lihat Langkah 7 di bawah |
| `CLOUDFLARE_ACCOUNT_ID` | *(dari Cloudflare)* | Cara dapat: lihat Langkah 7 di bawah |

Klik **"Save Changes"**.

---

### Langkah 4: Daftar Cloudflare & Tambah Domain

#### 4a. Daftar Cloudflare
1. Buka [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Daftar dengan email — **gratis, tanpa kartu kredit**

#### 4b. Tambah Domain
1. Setelah login, klik **"Add a site"**
2. Ketik domain Anda (contoh: `domainanda.com`) → klik **"Add site"**
3. Pilih plan **Free (gratis)** → klik **"Continue"**
4. Cloudflare akan menampilkan **2 nameserver**, contoh:
   ```
   adam.ns.cloudflare.com
   bella.ns.cloudflare.com
   ```
5. **CATAT** 2 nameserver ini

#### 4c. Ganti Nameserver Domain
1. Login ke panel tempat Anda beli domain (Jagoan Hosting / Namecheap / Niagahoster / dll)
2. Cari pengaturan **"Nameserver"** atau **"DNS Management"**
3. Ganti/ubah nameserver ke 2 nameserver Cloudflare yang tadi dicatat
4. Simpan
5. Kembali ke Cloudflare → klik **"Done, check nameservers"**
6. Tunggu 5-30 menit sampai status domain berubah jadi **"Active"** (cek di halaman Overview)

---

### Langkah 5: Enable Email Routing

1. Di Cloudflare Dashboard → klik domain Anda
2. Menu kiri → klik **"Email"** → **"Email Routing"**
3. Klik **"Enable Email Routing"** (link biru di atas)
4. Jika muncul peringatan tentang MX record → klik **"Add records automatically"**
5. Status akan berubah menjadi **"Ready"** atau **"Active"**

---

### Langkah 6: Buat Email Worker & Set Routing

#### 6a. Buat Email Worker
1. Masih di halaman Email Routing → klik tab **"Email Workers"**
2. Klik **"Create"**
3. Beri nama: `richmail-worker`
4. **Hapus semua** code default yang ada di editor
5. **Copy-paste code di bawah ini** (edit 2 baris yang ditandai):

```javascript
export default {
  async email(message, env, ctx) {
    // ⬇️ GANTI URL DENGAN URL RENDER ANDA ⬇️
    var url = "https://NAMA-APP-ANDA.onrender.com/webhook/email";
    // ⬇️ GANTI SECRET SAMA DENGAN WEBHOOK_SECRET DI RENDER ⬇️
    var secret = "WEBHOOK_SECRET_ANDA";
    var subject = message.headers.get("subject") || "No Subject";
    var from = message.from || "unknown";
    var to = message.to || "unknown";
    var date = message.headers.get("date") || new Date().toISOString();
    var contentType = message.headers.get("content-type") || "";
    var raw = await new Response(message.raw).text();
    var body = "";
    var html = "";
    var idx = raw.indexOf("\r\n\r\n");
    if (idx === -1) {
      idx = raw.indexOf("\n\n");
    }
    if (idx > -1) {
      var content = raw.substring(idx + 4);
      if (contentType.indexOf("multipart") > -1) {
        var boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/);
        if (boundaryMatch) {
          var boundary = boundaryMatch[1];
          var parts = content.split("--" + boundary);
          for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part.indexOf("text/plain") > -1) {
              var partBody = part.indexOf("\r\n\r\n");
              if (partBody === -1) partBody = part.indexOf("\n\n");
              if (partBody > -1) {
                body = part.substring(partBody + 4).trim();
                body = body.replace(/--$/, "").trim();
              }
            } else if (part.indexOf("text/html") > -1) {
              var partHtml = part.indexOf("\r\n\r\n");
              if (partHtml === -1) partHtml = part.indexOf("\n\n");
              if (partHtml > -1) {
                html = part.substring(partHtml + 4).trim();
                html = html.replace(/--$/, "").trim();
              }
            }
          }
        }
      } else if (contentType.indexOf("text/html") > -1) {
        html = content.trim();
        body = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      } else {
        body = content.trim();
      }
    }
    if (!body && html) {
      body = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret
      },
      body: JSON.stringify({
        from: from,
        to: to,
        subject: subject,
        text: body,
        html: html,
        date: date
      })
    });
  }
}
```

6. Klik **"Save and Deploy"**

> **PENTING:** Worker ini hanya dibuat **1 kali**. Worker yang sama bisa dipakai untuk semua domain di akun Cloudflare Anda.

#### 6b. Set Catch-All Route
1. Kembali ke **"Email Routing"** → tab **"Routing rules"**
2. Di bagian **"Catch-all address"** → klik **Edit**
3. Ubah Action menjadi: **"Send to a Worker"**
4. Pilih: **richmail-worker**
5. Klik **Save**

---

### Langkah 7: Buat Cloudflare API Token (Opsional)

Ini hanya diperlukan kalau Anda mau **tambah domain baru langsung dari admin panel** (fitur auto-setup).

#### 7a. Buat API Token
1. Buka [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Klik **"Create Token"**
3. Scroll ke bawah → klik **"Get started"** (di bawah "Custom token")
4. Isi:
   - **Token name:** `RichMail` (atau nama bebas)
   - **Permissions** (klik "+ Add more" untuk tambah baris):
     | Kolom Kiri | Kolom Tengah | Kolom Kanan |
     |---|---|---|
     | Zone | Zone | Edit |
     | Zone | DNS | Edit |
     | Zone | Zone Settings | Edit |
     | Zone | Email Routing Rules | Edit |
   - **Zone Resources:** Include → All zones
   - **Account Resources:** Include → All accounts
5. Klik **"Continue to summary"** → **"Create Token"**
6. **Copy token** (hanya muncul 1x!) → simpan

#### 7b. Ambil Account ID
1. Buka [dash.cloudflare.com](https://dash.cloudflare.com) → klik domain Anda
2. Di halaman Overview, scroll ke bawah kanan
3. Cari **"Account ID"** → copy

#### 7c. Taruh di Render
1. Render → service Anda → Environment → tambah:
   - `CLOUDFLARE_API_TOKEN` = *(token dari step 7a)*
   - `CLOUDFLARE_ACCOUNT_ID` = *(ID dari step 7b)*
2. Save Changes

---

### Langkah 8: Test!

1. Buka URL app Anda: `https://NAMA-APP-ANDA.onrender.com`
2. Generate atau buat email address (contoh: `test@domainanda.com`)
3. Buka Gmail/Yahoo → kirim email ke alamat tersebut
4. Kembali ke app → tunggu beberapa detik → email muncul!

---

## Cara Tambah Domain Baru

### Dari Admin Panel:
1. Buka `https://NAMA-APP-ANDA.onrender.com/admin.html`
2. Login dengan password admin
3. Ketik domain baru → klik **"+ Tambah & Auto Setup"**

### Langkah Manual (per domain baru):
1. **Ganti nameserver** domain baru ke Cloudflare (di panel registrar)
2. **Enable Email Routing** — Cloudflare → domain baru → Email → Email Routing → klik "Enable Email Routing"
3. **Set Catch-all** — Routing rules → Catch-all → Edit → Send to Worker → pilih `richmail-worker` → Save

### Jangan lupa:
Tambahkan domain baru ke environment variable `MAIL_DOMAINS` di Render:
```
MAIL_DOMAINS=domain1.com,domain2.com,domain3.com
```
Ini supaya domain tidak hilang saat Render restart.

---

## Tentang Webhook Secret

**Webhook Secret** adalah kunci rahasia yang Anda buat sendiri. Bisa berupa kata/kalimat random apapun.

**Fungsinya:** Memastikan hanya Cloudflare Worker Anda yang bisa mengirim email ke app. Tanpa secret yang benar, email palsu dari orang lain akan ditolak.

**Aturan penting:**
- Secret di **Render** (environment variable `WEBHOOK_SECRET`) harus **sama persis** dengan yang ada di code **Cloudflare Worker** (baris `var secret = "..."`)
- Kalau berbeda, email tidak akan masuk
- Buat yang random dan sulit ditebak

---

## Environment Variables (Lengkap)

| Variable | Wajib? | Penjelasan |
|----------|--------|-----------|
| `MAIL_DOMAINS` | **Ya** | Domain email Anda, pisah koma. Contoh: `mail.com,inbox.id` |
| `ADMIN_PASSWORD` | **Ya** | Password login admin panel. Buat yang susah ditebak |
| `WEBHOOK_SECRET` | **Ya** | Kunci rahasia. Harus sama dengan yang di Cloudflare Worker |
| `EMAIL_EXPIRY` | Tidak | Menit sebelum email auto-hapus (default: 60) |
| `CLOUDFLARE_API_TOKEN` | Tidak | Untuk fitur auto-setup domain di admin panel |
| `CLOUDFLARE_ACCOUNT_ID` | Tidak | Account ID Cloudflare (untuk auto-setup) |
| `PORT` | Tidak | Port web server (default: 3000, Render set otomatis) |

---

## Struktur Project

```
Richmail/
├── server/
│   ├── app.js            # Web server + semua API routes
│   ├── database.js       # Penyimpanan data (JSON file)
│   └── cloudflare.js     # Helper auto-setup domain via Cloudflare API
├── public/
│   ├── index.html        # Halaman inbox utama
│   ├── admin.html        # Admin panel (kelola domain, statistik)
│   ├── style.css         # Styling tampilan
│   └── app.js            # Logic frontend
├── cloudflare-worker.js  # Code untuk Cloudflare Email Worker
├── config.js             # File konfigurasi
├── Dockerfile            # Untuk deploy via Docker
├── docker-compose.yml    # Untuk deploy di VPS
├── render.yaml           # Render blueprint
└── package.json
```

---

## API Endpoints

### Public API:
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

### Admin API (butuh password):
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

### Docker (untuk VPS sendiri)
```bash
git clone https://github.com/ramax100/Richmail.git
cd Richmail
# Edit docker-compose.yml sesuai kebutuhan
docker compose up -d
```

### Manual (lokal/VPS)
```bash
git clone https://github.com/ramax100/Richmail.git
cd Richmail
MAIL_DOMAINS=domainanda.com ADMIN_PASSWORD=passwordanda WEBHOOK_SECRET=secretanda node server/app.js
```

---

## FAQ

**Q: Apakah benar-benar gratis?**
A: Ya. Render + Cloudflare = gratis. Hanya bayar domain (mulai Rp 14rb/tahun).

**Q: Bisa deploy dari HP tanpa PC?**
A: Ya! Gunakan Google Cloud Shell (shell.cloud.google.com) di browser HP atau langsung deploy via Render dashboard.

**Q: Email dari Gmail/Yahoo bisa masuk?**
A: Ya, email dari layanan manapun bisa masuk selama MX record dan Email Routing sudah benar.

**Q: Berapa lama email tersimpan?**
A: Sesuai setting `EMAIL_EXPIRY` (default 60 menit). Ubah di Environment Render.

**Q: Bisa untuk banyak domain?**
A: Ya, tidak ada batasan. Tambah lewat admin panel atau environment variable.

**Q: Render free tier ada batasannya?**
A: App akan "sleep" setelah 15 menit tidak ada traffic. Akses pertama setelah sleep butuh ~30 detik. Email yang masuk saat sleep tetap diterima saat app bangun.

**Q: Apa bedanya WEBHOOK_SECRET dengan ADMIN_PASSWORD?**
A: `ADMIN_PASSWORD` untuk login ke admin panel. `WEBHOOK_SECRET` untuk verifikasi email yang masuk dari Cloudflare. Keduanya harus berbeda dan rahasia.

**Q: Apakah Cloudflare Worker perlu dibuat per domain?**
A: Tidak. Worker dibuat **1 kali saja** dan berlaku untuk semua domain di akun Cloudflare yang sama. Domain baru hanya perlu set Catch-all ke worker yang sudah ada.

**Q: Kenapa Email Routing tidak bisa di-enable otomatis?**
A: Ini limitasi Cloudflare — untuk pertama kali enable di domain baru, harus dari dashboard (1 klik). Setelah aktif, semuanya berjalan otomatis.

---

## Keamanan

- **Ganti** `ADMIN_PASSWORD` — jangan pakai default
- **Buat** `WEBHOOK_SECRET` yang unik dan panjang
- **Jangan share** API Token Cloudflare
- Email bersifat **sementara** dan auto-terhapus
- Admin panel **dilindungi password**
- Webhook **diverifikasi** dengan secret key

---

## Lisensi

**MIT License** — Projek ini gratis dan bebas dikembangkan oleh siapapun.

Silakan fork, modifikasi, dan gunakan untuk keperluan pribadi maupun komersial.

---

## Komunitas & Support

Gabung channel Telegram untuk diskusi, update, request fitur, dan bantuan:

👉 **https://t.me/GrupRichStore**

---

## Kontribusi

Pull request welcome! Silakan fork dan buat perubahan.

---

## Credits

Dibuat dengan Node.js, Cloudflare Email Routing, dan Render.
