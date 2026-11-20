# VazifaFlow rejasi

## Mahsulot maqsadi
VazifaFlow kichik jamoa yoki shaxsiy foydalanish uchun vazifalarni tez qo‘shish, tartiblash va yakunlash imkonini beradigan o‘zbekcha web-ilova.

## Texnik yondashuv
- Frontend: React, TypeScript, Tailwind CSS, tRPC React Query.
- Backend: Express va tRPC public API.
- Ma’lumotlar bazasi: Drizzle ORM + MySQL. Hozirgi MVP umumiy workspace sifatida ishlaydi; vazifalar serverda doimiy saqlanadi.
- Tekshiruv: TypeScript check, Vitest, Vite production build.

## Tuzilma
- `client/src/pages/Home.tsx`: dashboard, filtrlar, forma va vazifa kartalari.
- `client/src/index.css`: vizual sistema va responsive layout.
- `server/routers.ts`: vazifalar uchun list, create, update, delete va clearCompleted API’lari.
- `server/db.ts`: Drizzle query funksiyalari.
- `drizzle/schema.ts`: `tasks` jadvali.
- `public/manus-routes.json`: route manifest.

## Dizayn
Uslublar: editorial task board (0.46), calm SaaS dashboard (0.31), brutalist utility (0.23). Tanlov: editorial task board.

- Design movement: jurnal sahifasidagi tipografik aniqlik va ish stoli ritmi.
- Core principles: ko‘rinadigan ustuvorlik, bir qarashda holat, qisqa harakat yo‘li, ortiqcha bezaksiz iliq interfeys.
- Color philosophy: krem fon diqqatni tinch saqlaydi; indigo asosiy harakatlarni, amber esa muhimlikni bildiradi.
- Layout paradigm: chapdagi brend rail va o‘ngda keng ishchi canvas; kartalar zich, ammo nafas oladigan.
- Signature elements: qizil “live” nuqta, raqamli progress ring, status chiplar.
- Interaction: vazifani qo‘shish paneli doim ko‘rinadi; status almashtirish bir bosishda.
- Animation: faqat 150–220ms opacity/translate; harakat mazmunni tushuntirsin.
- Typography: Inter system sans + Georgia italic aksent.
- Brand essence: “Ishni ko‘rinadigan qil.” Shaxsiy, tartibli, amaliy.
- Brand voice: “Bugun nimani oldinga suramiz?” va “Ro‘yxat emas, natija.”
- Wordmark: `V` belgisi ichida yo‘l ko‘rsatuvchi nuqta.
- Signature color: chuqur indigo `#3934A3`.
