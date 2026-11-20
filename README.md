# VazifaFlow

**Ishni ko‘rinadigan qil.** VazifaFlow — shaxsiy foydalanuvchi yoki kichik jamoa uchun vazifalarni bitta aniq ish oqimida boshqaradigan, o‘zbek tilidagi full-stack web-ilova. Vazifa qo‘shiladi, ustuvorligi va muddati belgilanadi, holati bir bosishda o‘zgartiriladi va barcha ma’lumotlar backend orqali ma’lumotlar bazasida saqlanadi.

![VazifaFlow dashboard](docs/vazifaflow-dashboard.png)

## Muammo va yechim

Oddiy todo ro‘yxatlarda vazifalar ko‘payganda nima muhimligi, nima jarayonda ekani va qaysi ishlar tugaganini ko‘rish qiyinlashadi. VazifaFlow bu muammoni uchta holat — **Kutilmoqda**, **Jarayonda**, **Bajarildi** — ustuvorlik nuqtalari, muddatlar, qidiruv va kunlik progress bilan hal qiladi.

## Asosiy imkoniyatlar

- yangi vazifaga sarlavha, izoh, ustuvorlik va muddat berish;
- mavjud vazifani tahrirlash yoki o‘chirish;
- vazifa holatini `Kutilmoqda → Jarayonda → Bajarildi` tartibida bir bosishda o‘zgartirish;
- sarlavha yoki izoh bo‘yicha qidirish;
- holat bo‘yicha filterlash va ustuvorlikni ko‘rish;
- bajarilgan vazifalarni birdaniga tozalash;
- umumiy workspace orqali shaxsiy yoki kichik jamoa ishlashi;
- desktop, planshet va mobil ekranlarga mos interfeys;
- bo‘sh holat, yuklanish, validatsiya va xatolik xabarlari.

## Texnologiyalar

| Qism | Texnologiya |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| UI | Custom CSS, Lucide Icons, Sonner toast xabarlari |
| Backend | Express, tRPC 11 |
| Ma’lumotlar bazasi | MySQL + Drizzle ORM |
| Tekshiruv | TypeScript check, Vitest, Vite production build |
| Ishga tushirish | pnpm, Node.js 20+ |

## Lokal ishga tushirish

1. Repository’ni yuklab oling va loyiha papkasiga kiring:

```bash
git clone https://github.com/RaximjonRaximov/vazifaflow.git
cd vazifaflow
```

2. Bog‘liqliklarni o‘rnating:

```bash
pnpm install
```

3. `.env` faylida `DATABASE_URL` ni MySQL ulanish satri bilan belgilang:

```env
DATABASE_URL=mysql://user:password@localhost:3306/vazifaflow
```

4. Sxemani bazaga qo‘llang va development serverni ishga tushiring:

```bash
pnpm db:push
pnpm dev
```

Ilova `http://localhost:3000` manzilida ochiladi.

## Ishlashini tekshirish

```bash
pnpm check   # TypeScript xatolarini tekshiradi
pnpm test    # Vitest testlari
pnpm build   # Frontend va backend production build
```

Loyiha ishga tushgach, `GET /` dashboardni, `GET /manus-routes.json` route manifestni, `GET /api/health` esa backend health check’ni qaytaradi. Barcha biznes API so‘rovlari `/api/trpc` gateway orqali ishlaydi.

## Backend API

API tRPC orqali quyidagi procedure’larni beradi:

| Procedure | Vazifasi |
| --- | --- |
| `tasks.list` | Qidiruv bilan barcha vazifalarni olish |
| `tasks.create` | Yangi vazifa yaratish |
| `tasks.update` | Sarlavha, izoh, muddat, ustuvorlik yoki statusni yangilash |
| `tasks.remove` | Bitta vazifani o‘chirish |
| `tasks.clearDone` | Barcha bajarilgan vazifalarni o‘chirish |

`tasks.create` sarlavha bo‘sh bo‘lmasligini va 180 belgidan oshmasligini tekshiradi. Ustuvorlik faqat `low`, `medium`, `high`; status esa faqat `todo`, `doing`, `done` qiymatlarini qabul qiladi.

## Papkalar tuzilmasi

```text
client/
  public/manus-routes.json    # frontend route deklaratsiyasi
  src/pages/Home.tsx          # asosiy dashboard va foydalanuvchi oqimi
  src/index.css               # VazifaFlow dizayn tizimi
server/
  db.ts                       # Drizzle query funksiyalari
  routers.ts                  # tRPC backend contract
  _core/                      # Express, auth va platforma starter kodi
drizzle/
  schema.ts                   # users va tasks jadvallari
docs/
  vazifaflow-dashboard.png    # README screenshot
plan.md                       # loyiha rejasi va dizayn qarorlari
TODO.md                       # qabul mezonlari va keyingi ishlar
```

## Muhim eslatma

MVP hozircha umumiy workspace modelidan foydalanadi: login qilmagan foydalanuvchilar ham bir xil vazifalar ro‘yxatini ko‘rishi mumkin. Keyingi bosqichda workspace’larni foydalanuvchi va jamoa a’zolariga ajratish, email orqali taklif yuborish, drag-and-drop Kanban hamda takrorlanuvchi vazifalarni qo‘shish mumkin.

## Litsenziya

MIT
