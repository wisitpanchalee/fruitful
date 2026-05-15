# คู่มือ Deploy — Fruitful

Deploy ฟรี 100% ด้วย **Supabase** (DB + Auth) + **Cloudflare Pages** (hosting)

---

## ส่วนที่ 1: ตั้งค่า Supabase

### 1.1 สร้าง project

1. ไปที่ https://supabase.com → สมัคร/ล็อกอิน (ใช้ GitHub ได้)
2. คลิก **"New Project"**
3. กรอก:
   - **Name**: `fruitful`
   - **Database Password**: ตั้งรหัสที่จำได้ (จดไว้)
   - **Region**: `Southeast Asia (Singapore)` — ใกล้ไทยที่สุด
   - **Plan**: **Free**
4. รอประมาณ 2 นาทีให้ project พร้อม

### 1.2 รัน SQL migration

1. ไปที่ **SQL Editor** (sidebar ซ้าย)
2. คลิก **"New query"**
3. เปิดไฟล์ [`supabase/migrations/0001_initial_schema.sql`](./supabase/migrations/0001_initial_schema.sql) คัดลอกทั้งหมด → วางใน editor
4. คลิก **"Run"** (มุมขวาล่าง) — ต้องสำเร็จไม่มี error

### 1.3 ใส่ seed data

1. **New query** ใหม่
2. เปิดไฟล์ [`supabase/seed.sql`](./supabase/seed.sql) → คัดลอก → วาง → **Run**

### 1.4 เปิด Email Auth (ปิด confirm email สำหรับเริ่มต้น)

1. ไปที่ **Authentication** → **Providers** → **Email**
2. ตรวจสอบ **Enable Email Provider** = ON
3. **Confirm email**: ปิดไว้ก่อน (เปิดทีหลังเมื่อพร้อม production)
4. **Save**

### 1.5 เก็บค่า API keys

1. ไปที่ **Project Settings** → **API**
2. คัดลอก 2 ค่าไว้:
   - **Project URL** (เช่น `https://abcdefgh.supabase.co`)
   - **anon public** key (string ยาวๆ ขึ้นต้น `eyJ...`)

---

## ส่วนที่ 2: รัน local

### 2.1 ติดตั้ง dependencies

```bash
cd fruitful-next
npm install
```

### 2.2 ตั้งค่า env

สร้างไฟล์ `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

ใส่ค่าจากข้อ 1.5

### 2.3 รัน dev server

```bash
npm run dev
```

เปิด http://localhost:3000 → จะ redirect ไป `/login`

### 2.4 สมัครบัญชีแรก

1. คลิก "สมัครสมาชิก"
2. กรอกชื่อ + อีเมล + รหัสผ่าน
3. ระบบจะสร้าง profile ใน DB อัตโนมัติ (role = `warehouse_manager`)
4. หลังสมัครเสร็จ login → เข้า dashboard

---

## ส่วนที่ 3: Deploy ขึ้น Cloudflare Pages

### 3.1 สมัคร Cloudflare

1. ไปที่ https://dash.cloudflare.com → สมัคร (ฟรี)
2. ไปที่เมนู **Workers & Pages**

### 3.2 Push code ขึ้น GitHub

```bash
cd fruitful-next
git init
git add .
git commit -m "Initial Fruitful Next.js + Supabase"
# สร้าง repo บน GitHub แล้ว:
git remote add origin https://github.com/USERNAME/fruitful.git
git push -u origin main
```

### 3.3 เชื่อม Cloudflare Pages กับ GitHub

1. ใน Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorize Cloudflare ให้เข้าถึง GitHub
3. เลือก repo `fruitful`
4. ตั้งค่า build:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: ถ้า monorepo ใส่ `fruitful-next` ถ้าไม่ ปล่อยว่าง
5. **Environment variables** (Production + Preview ทั้งคู่):
   - `NEXT_PUBLIC_SUPABASE_URL` = ค่าจากข้อ 1.5
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ค่าจากข้อ 1.5
   - `NODE_VERSION` = `20`
6. ใน **Compatibility flags** ให้เพิ่ม `nodejs_compat` ทั้ง **Production** และ **Preview**
7. คลิก **"Save and Deploy"** — รอ 2-3 นาที

### 3.4 เพิ่ม Supabase redirect URLs

ใน Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://fruitful.pages.dev` (หรือ domain ที่ Cloudflare assign)
- **Redirect URLs**: เพิ่ม `https://fruitful.pages.dev/**`

---

## ส่วนที่ 4: Custom domain (optional)

หากต้องการใช้โดเมนของตัวเอง:

1. Cloudflare Pages → project ของคุณ → **Custom domains** → **Set up a custom domain**
2. ใส่โดเมน (เช่น `fruitful.example.com`)
3. ทำตามขั้นตอน DNS ที่แสดง

---

## ค่าใช้จ่ายขั้นต่ำ (Free tier)

| Service           | Free quota                       | เพียงพอสำหรับ                 |
|-------------------|----------------------------------|------------------------------|
| Supabase          | 500MB DB, 50k MAU, 2GB egress    | SME / โรงงานขนาดเล็ก-กลาง   |
| Cloudflare Pages  | 500 builds/เดือน, ไม่จำกัด requests | Production จริงได้เลย      |

**ข้อควรระวัง — Supabase ฟรี**: ถ้าไม่มี traffic 7 วัน project จะ pause ต้องคลิก "Restore" ใน dashboard (ไม่เสียข้อมูล)

---

## Troubleshooting

### "Edge runtime cannot find module"
ทุก `page.tsx` และ `route.ts` ต้องมี `export const runtime = 'edge'` ที่ด้านบน

### "Permission denied for table X"
ตรวจสอบ RLS policies ใน Supabase → Database → Policies — ดูใน migration ว่ารันครบ

### Cloudflare build ล้มเหลว
- ตรวจ `NODE_VERSION = 20` ในตั้งค่า env
- ตรวจ `nodejs_compat` flag เปิดทั้ง production และ preview

### หน้า login ไม่ redirect หลัง signup
ปิด "Confirm email" ใน Supabase Auth (ข้อ 1.4)
