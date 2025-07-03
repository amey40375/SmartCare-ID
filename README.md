# SmartCare - Service Platform

Platform layanan profesional yang menghubungkan pengguna dengan penyedia layanan (mitra) untuk berbagai jasa seperti SmartMassage, SmartBarber, dan SmartClean.

## Fitur Utama

### Multi-Role System
- **User**: Bisa memesan layanan dan mengelola pesanan
- **Mitra**: Penyedia layanan yang bisa menerima dan menyelesaikan pesanan
- **Admin**: Mengelola verifikasi mitra, top-up saldo, dan monitoring platform

### Layanan Tersedia
- **SmartMassage**: Layanan pijat profesional
- **SmartBarber**: Layanan potong rambut dan grooming
- **SmartClean**: Layanan pembersihan rumah

### Sistem Pembayaran
- Saldo digital untuk user dan mitra
- Sistem top-up dengan approval admin
- Tracking transaksi lengkap

## Teknologi

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon)
- **UI**: Shadcn/ui + Tailwind CSS
- **ORM**: Drizzle ORM

## Akun Demo

- **Admin**: admin@smartcare.com / admin123
- **User**: user@example.com / user123
- **Mitra**: mitra@example.com / mitra123

## Local Development

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Run development server
npm run dev
```

## Deployment

Aplikasi ini sudah dikonfigurasi untuk deployment ke Vercel. Lihat file `DEPLOYMENT.md` untuk panduan lengkap.

## Database

Database PostgreSQL online menggunakan Neon dengan schema:
- Users (multi-role: user, mitra, admin)
- Orders (status tracking lengkap)
- Mitra Applications (sistem approval)
- Top-up Requests (manajemen saldo)
- Chat Messages (komunikasi real-time)

## Lisensi

MIT License