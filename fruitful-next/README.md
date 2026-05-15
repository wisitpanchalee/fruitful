# Fruitful · Next.js + Supabase + Cloudflare Pages

ระบบจัดการรับซื้อผลไม้และคลังสินค้า — เวอร์ชัน production พร้อม DB, Auth, และ deploy

## Tech stack

- **Next.js 14** (App Router, TypeScript, Edge runtime)
- **Supabase** — PostgreSQL + Auth + REST API auto
- **Cloudflare Pages** — Hosting ฟรี ผ่าน `@cloudflare/next-on-pages`

## เริ่มต้น (Local development)

```bash
cd fruitful-next
npm install
cp .env.example .env.local
# ใส่ค่า Supabase URL + ANON KEY (ดู DEPLOY.md ขั้นตอนสร้าง Supabase project)

npm run dev
```

เปิด http://localhost:3000

## โครงสร้าง

```
fruitful-next/
├── src/
│   ├── app/
│   │   ├── login/           # หน้า login + signup + server actions
│   │   ├── (app)/           # หน้าหลังเข้าระบบ (มี sidebar + topbar)
│   │   │   ├── dashboard/   # ✅ เชื่อม DB จริง
│   │   │   ├── suppliers/   # ✅ เชื่อม DB จริง
│   │   │   ├── warehouse/   # ✅ เชื่อม DB จริง
│   │   │   ├── payment/     # ✅ เชื่อม DB จริง
│   │   │   └── ...          # อื่นๆ stub — phase 2
│   │   └── api/             # REST API routes (edge runtime)
│   ├── components/          # Icon, KPI, Sidebar, Topbar, FruitChip ...
│   ├── lib/
│   │   ├── supabase/        # client / server / middleware
│   │   ├── types.ts         # Type definitions ตาม DB schema
│   │   └── format.ts        # baht, kg, ...
│   └── middleware.ts        # Auth gate (Edge)
├── supabase/
│   ├── migrations/0001_initial_schema.sql  # สคีมา + RLS + trigger
│   └── seed.sql                            # ข้อมูลตัวอย่าง
├── wrangler.toml            # Cloudflare Pages config
└── next.config.mjs
```

## หน้าที่ทำเสร็จแล้ว (Phase 1)

- ✅ Login / signup (Supabase Auth)
- ✅ Sidebar + Topbar
- ✅ Dashboard (KPI + ใบรับซื้อล่าสุด + ความจุคลัง)
- ✅ Suppliers (รายชื่อ + ยอดซื้อ + ค้างชำระ)
- ✅ Warehouse (zone map)
- ✅ Payment (คิวชำระเงิน)
- ✅ Middleware auth gate
- ✅ REST API ตัวอย่าง (`/api/dashboard`)

## หน้าที่ยังเป็น stub (Phase 2 — ทำเมื่อร้องขอ)

- Purchasing (PO builder + เครื่องชั่ง)
- Inventory (4 แท็บ + barcode)
- Accounting (P&L)
- Reports (พยากรณ์)
- Mobile (สแกน + เซ็น)

## Deploy

ดู [DEPLOY.md](./DEPLOY.md) — ทุกขั้นตอน Supabase + Cloudflare Pages
