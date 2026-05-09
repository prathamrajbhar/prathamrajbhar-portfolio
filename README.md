# Modern Full-Stack Portfolio

A high-performance, production-grade portfolio built with the latest web technologies.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma 7](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Analytics:** Custom page view tracking
- **Deployment:** Optimized for Vercel/Self-hosting

## 🛠️ Features

- **Dynamic Data Layer:** Every section (Projects, Blog, Experience, Skills) is backed by a PostgreSQL database.
- **Prisma 7 Architecture:** Uses the latest Prisma 7 driver adapters for improved performance and connection handling.
- **Build Resilience:** Custom try/catch wrappers in the data layer ensure the site builds successfully even if the database is unreachable during CI/CD.
- **SEO Optimized:** Dynamic `sitemap.xml` and `robots.txt` generation.
- **Responsive Design:** Fully responsive UI with dark mode support.
- **Real-time Analytics:** Tracks unique page views per session.

## 🏁 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `DATABASE_URL` (PostgreSQL).

3. **Database Setup:**
   Generate the Prisma client and push the schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Seed Data:**
   Populate the database with initial portfolio content:
   ```bash
   npm run db:seed
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🏗️ Commands

- `npm run dev`: Start development server
- `npm run build`: Generate production build (automatically handles Prisma client generation)
- `npm run db:studio`: Open Prisma Studio to manage data visually
- `npm run db:seed`: Reset and seed the database with real portfolio content

## 📝 License

MIT
