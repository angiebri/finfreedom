# 💰 Личные финансы — Путь к $1 000 000

Next.js 14 + Supabase + Tailwind CSS

---

## 🚀 Быстрый старт

### 1. Установить зависимости
```bash
npm install
```

### 2. Настроить Supabase

1. Зайди на [supabase.com](https://supabase.com) → создай новый проект
2. В **SQL Editor** выполни содержимое файла `supabase-schema.sql`
3. Скопируй ключи из **Project Settings → API**:
   - `Project URL`
   - `anon public key`

### 3. Настроить переменные окружения
```bash
cp .env.local.example .env.local
```
Вставь свои ключи в `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 4. Настроить Google OAuth (опционально)

1. Supabase Dashboard → **Authentication → Providers → Google**
2. Включи Google, скопируй **Callback URL**
3. Зайди в [console.cloud.google.com](https://console.cloud.google.com)
4. Создай OAuth 2.0 Client ID, добавь Callback URL в Authorized redirect URIs
5. Вставь Client ID и Client Secret в Supabase

### 5. Запустить локально
```bash
npm run dev
```
Открой [http://localhost:3000](http://localhost:3000)

---

## 🌐 Деплой на Vercel

```bash
npm install -g vercel
vercel
```

В панели Vercel добавь переменные окружения:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

В Supabase → **Authentication → URL Configuration** добавь:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## 📁 Структура проекта

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       # Страница входа
│   │   ├── register/page.tsx    # Регистрация
│   │   └── callback/route.ts    # OAuth callback
│   ├── dashboard/page.tsx       # Главная (защищённая)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Боковая навигация
│   │   └── DashboardShell.tsx   # Основной layout
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Обзор
│   │   ├── IncomePage.tsx       # Доходы
│   │   ├── ExpensesPage.tsx     # Расходы + диаграмма
│   │   ├── BanksPage.tsx        # Банки и счета
│   │   ├── AssetsPage.tsx       # Активы + подушка
│   │   ├── MortgagePage.tsx     # Квартира/ипотека
│   │   └── HistoryPage.tsx      # История
│   ├── forms/
│   │   └── DynamicRow.tsx       # Редактируемая строка
│   ├── charts/
│   │   └── ExpensePieChart.tsx  # Круговая диаграмма
│   └── ui/index.tsx             # UI-компоненты
├── hooks/
│   └── useFinanceData.ts        # Данные + Supabase sync
├── lib/supabase/
│   ├── client.ts                # Браузерный клиент
│   └── server.ts                # Серверный клиент
├── middleware.ts                 # Auth middleware
└── types/finance.ts             # TypeScript типы
```

---

## ✨ Функциональность

- **Авторизация** — Email/пароль + Google OAuth (Supabase)
- **Данные в облаке** — всё хранится в Supabase, доступно с любого устройства
- **Дашборд** — капитал, доходы, расходы, дельта, подушка, вехи к $1M
- **Доходы** — активный + пассивный, редактируемые названия, комментарии
- **Расходы** — произвольные статьи, категории, круговая диаграмма
- **Банки** — банки, брокеры, ИИС, крипто, наличные
- **Активы** — USD, EUR, акции, ИИС, вклады, земля
- **Квартира** — ипотека, equity, ROI, окупаемость
- **История** — автозапись при каждом сохранении, экспорт CSV
- **Мобильная версия** — гамбургер-меню, адаптивная вёрстка
# finfreedom
