# 🧾 Receipt Scanner & Financial Dashboard (Lao Localization)

A premium Next.js application designed to help users manage their finances by scanning receipts and visualizing spending patterns with a full **Lao (🇱🇦) localized experience**.

## ✨ Key Features

- **AI-Powered Receipt Scanning**: Automatically extract data from receipts including date, total amount, and category.
- **Interactive Financial Dashboard**:
  - **Overview Statistics**: Real-time tracking of total spending, average spend, and top spending categories.
  - **Comparative Area Chart**: Visualize spending trends between the current and previous month (including month-on-month % change).
  - **Category Bar Chart**: breakdown of spending across different categories.
- **Full Lao Localization (🇱🇦)**:
  - **LAK Currency Support**: All monetary values are formatted in Lao Kip (LAK).
  - **Localized Dates/Calendar**: Complete Lao locale integration for days, months, and 24-hour time formatting.
  - **Native UI**: All labels, tooltips, and descriptions localized in Lao.
- **Responsive Management**: Manage and filter receipts with ease.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **Styling**: Vanilla CSS & [Shadcn UI](https://ui.shadcn.com)
- **Charts**: [Recharts](https://recharts.org)
- **Database**: [Prisma](https://www.prisma.io) (PostgreSQL/SQLite)
- **Auth**: Integrated session management
- **Date Management**: [date-fns](https://date-fns.org) with custom Lao locale

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- NPM / PNPM / Bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd receipt-scanner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file and add your database and auth secrets.

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🇱🇦 Localization Note
This project features a custom-built Lao locale extension for `date-fns` located in `lib/locales/lo.ts`, providing accurate translations for narrow, abbreviated, and wide formats according to Lao language standards.
