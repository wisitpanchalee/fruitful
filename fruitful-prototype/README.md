# Fruitful Prototype

Static HTML/CSS/JS prototype ของระบบ Fruitful — ใช้ React + Babel จาก CDN ไม่ต้อง build

## Deploy

โฟลเดอร์นี้ deploy ได้ตรงๆ บน Cloudflare Pages โดย:

1. Connect GitHub repo
2. Set **Root directory**: `fruitful-prototype`
3. **Build command**: (เว้นว่าง)
4. **Build output directory**: `/` (หรือเว้นว่าง)

Cloudflare Pages จะ serve `index.html` เป็นหน้าหลักให้อัตโนมัติ

## Local

เปิดด้วย static server:

```bash
npx serve fruitful-prototype/
# หรือ
python3 -m http.server 8000 -d fruitful-prototype/
```
