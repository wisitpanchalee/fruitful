# Fruitful — ระบบจัดการรับซื้อผลไม้และคลังสินค้า

โครงสร้างโปรเจกต์มี 2 ส่วน:

## 📦 `fruitful-prototype/` — เวอร์ชัน prototype (deploy ได้ทันที)

Static HTML/CSS/JS — ไม่ต้อง build ไม่ต้องใช้ DB
**👉 Deploy โฟลเดอร์นี้บน Cloudflare Pages เพื่อดูเว็บออนไลน์**

## 🚀 `fruitful-next/` — เวอร์ชัน production (Next.js + Supabase)

Next.js 14 (App Router) + Supabase (PostgreSQL + Auth) — สำหรับใช้งานจริง
ดู [`fruitful-next/DEPLOY.md`](./fruitful-next/DEPLOY.md) สำหรับขั้นตอนเชื่อม DB และ deploy
