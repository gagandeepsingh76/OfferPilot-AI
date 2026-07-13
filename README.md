<div align="center">
  <img src="public/readme/logo.svg" alt="OfferPilot AI logo" width="96" height="96" />

  <h1>OfferPilot AI</h1>

  <p><strong>AI-powered job offer intelligence for high-stakes career decisions.</strong></p>

  <p>Compare compensation, review resumes, coach negotiations, and manage billing from one polished SaaS cockpit.</p>

  <img src="public/readme/hero-banner.png" alt="OfferPilot AI hero banner showing the dashboard" width="100%" />
</div>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=0B1220" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="Neon" src="https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge&logo=neon&logoColor=001B1F" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Auth_+_Storage-3FCF8E?style=for-the-badge&logo=supabase&logoColor=0B1220" />
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-Billing-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-AI_Coach-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <img alt="Build Passing" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" />
</p>

---

## Screenshots

| Landing Page | Dashboard |
| --- | --- |
| <img src="public/readme/landing-page.png" alt="OfferPilot AI landing page" /> | <img src="public/readme/dashboard.png" alt="OfferPilot AI dashboard" /> |
| Recruiter-ready product story with demo entry, value props, pricing, and FAQs. | Decision cockpit for active offers, salary signals, and next best actions. |

| Offers | AI Chat |
| --- | --- |
| <img src="public/readme/offers.png" alt="Offer management table" /> | <img src="public/readme/ai-chat.png" alt="AI Negotiation Coach chat screen" /> |
| Seeded demo offers show compensation, status, and action menus in one scannable table. | Offer-specific chat for strategy, leverage, and recruiter-ready messaging. |

| Resume Review | Offer Comparison |
| --- | --- |
| <img src="public/readme/resume-review.png" alt="AI resume review screen" /> | <img src="public/readme/offer-comparison.png" alt="Offer comparison screen" /> |
| Role targeting plus resume text prepares the AI review workflow. | Select competing packages before generating a structured AI comparison. |

| Analytics | Billing |
| --- | --- |
| <img src="public/readme/analytics.png" alt="Compensation analytics dashboard" /> | <img src="public/readme/billing.png" alt="Stripe billing settings" /> |
| Compensation charts turn offer data into clear decision signals. | Stripe-ready subscription management with Pro demo safeguards. |

| Settings | Mobile View |
| --- | --- |
| <img src="public/readme/settings.png" alt="Profile settings screen" /> | <img src="public/readme/mobile-view.png" alt="Mobile dashboard view" /> |
| Profile, billing, security, notifications, and preferences live in one settings system. | Captured from the live app at a 390px mobile viewport. |

## Animated Demo

<div align="center">
  <img src="public/readme/demo.gif" alt="Animated OfferPilot AI demo" width="100%" />
</div>

The walkthrough shows the landing page, OAuth-ready login screen, demo account sign-in, dashboard, offer creation, resume review, AI negotiation chat, offer comparison, billing, and logout menu.

## Features

| Capability | What it does | Product signal |
| --- | --- | --- |
| 🔐 Authentication | Supabase SSR auth, Google OAuth, callback handling, password recovery, and protected dashboard sessions. | Production SaaS foundation |
| 🧠 AI Resume Review | Paste a resume, choose a target role, and request AI feedback for role fit and negotiation leverage. | Career intelligence |
| ⚖️ Offer Comparison | Select multiple offers and prepare AI-powered compensation analysis. | Decision support |
| 💬 AI Chat | Offer-specific negotiation coach backed by the app's AI chat API and live offer context. | Personalized guidance |
| 📊 Analytics | Salary, package, pipeline, and highest-offer metrics across tracked opportunities. | Executive clarity |
| 💳 Stripe Billing | Checkout, customer portal, webhook handlers, subscription sync, and Pro plan state. | Monetization-ready |
| 🔎 Google OAuth | Google sign-in through Supabase provider configuration. | Recruiter-friendly auth |
| 🧪 Demo Mode | Seeded account with realistic offers for instant local QA and portfolio demos. | No setup friction |
| 📱 Responsive Design | Dashboard, tables, forms, and settings adapt across desktop and mobile widths. | Device-ready |
| 🌗 Dark Mode | Theme provider, mode toggle, and Tailwind design tokens support light/dark/system preferences. | Polished UX |

<details>
<summary><strong>More Product Highlights</strong></summary>

- Server Actions for offer mutations, settings updates, auth, and Stripe session creation.
- Prisma schema covering users, profiles, subscriptions, offers, compensation, documents, comparisons, chat sessions, usage records, and audit logs.
- Demo data layer for reliable screenshots, testing, and recruiter walkthroughs.
- Structured validation with Zod and React Hook Form.
- Modern UI stack with Tailwind CSS, shadcn-style primitives, Lucide icons, Sonner toasts, and Framer Motion.

</details>

## Architecture

```mermaid
flowchart LR
  User[User / Recruiter] --> Vercel[Vercel Edge + Hosting]
  Vercel --> App[Next.js App Router]

  subgraph Frontend
    App --> React[React 19 UI]
    React --> Tailwind[Tailwind CSS + Design Tokens]
  end

  subgraph Backend
    App --> Actions[Server Actions]
    App --> API[Route Handlers]
    Actions --> Prisma[Prisma ORM]
    API --> Prisma
    Prisma --> Neon[(Neon PostgreSQL)]
    API --> OpenAI[OpenAI via Vercel AI SDK]
    API --> Stripe[Stripe Checkout + Webhooks]
    Actions --> Stripe
  end

  App --> Supabase[Supabase Auth + Storage]
  API --> Supabase
```

## Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,supabase,postgres,vercel" alt="Next.js, React, TypeScript, Tailwind CSS, Prisma, Supabase, PostgreSQL, and Vercel icons" />
</p>

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router, Server Components, Server Actions |
| UI | React 19, Tailwind CSS 4, shadcn-style components, Lucide React, Framer Motion |
| Database | Neon serverless PostgreSQL with Prisma ORM |
| Auth & Storage | Supabase Auth SSR, Google OAuth, Supabase Storage |
| AI | Vercel AI SDK, OpenAI, streaming chat primitives |
| Billing | Stripe Checkout, Customer Portal, webhooks, subscription state |
| Forms & Validation | React Hook Form, Zod |
| Deployment | Vercel with environment-based integrations |

## Project Structure

```txt
.
├── app/
│   ├── (auth)/                 # Login, signup, reset, password recovery
│   ├── api/                    # AI, PDF extraction, comparison, Stripe webhooks
│   ├── auth/                   # Supabase callback route
│   ├── dashboard/              # Offers, comparisons, resume, analytics, settings
│   ├── privacy/                # Legal pages
│   ├── terms/
│   ├── layout.tsx              # App shell and metadata
│   └── page.tsx                # Marketing landing page
├── components/
│   ├── billing/                # Subscription UI
│   ├── dashboard/              # Sidebar, header, command palette
│   ├── marketing/              # Landing sections
│   ├── offers/                 # Offer forms and row actions
│   ├── resume/                 # Resume reviewer
│   ├── settings/               # Profile, preferences, security forms
│   └── ui/                     # Reusable primitives
├── lib/
│   ├── supabase/               # Browser, server, middleware clients
│   ├── ai-usage.ts             # Usage limits
│   ├── current-user.ts         # App user + demo account resolution
│   ├── demo-data.ts            # Seeded portfolio data
│   ├── openai.ts               # OpenAI client config
│   ├── prisma.ts               # Prisma singleton
│   └── stripe.ts               # Stripe guards and client
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── readme/                 # README logo, hero, screenshots, demo GIF
├── server/actions/             # Auth, offers, settings, Stripe server actions
├── types/
├── proxy.ts                    # Supabase session middleware hook
└── package.json
```

## Getting Started

### Installation

```bash
git clone https://github.com/gagandeepsingh76/OfferPilot-AI.git
cd OfferPilot-AI
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Fill in Supabase, Neon, OpenAI, and Stripe values before running production-like flows.

### Run Locally

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open the local URL printed by Next.js. For a zero-friction walkthrough, use **Explore Demo** or **Continue with Demo Account**.

### Production Deployment

```bash
npm run lint
npm run typecheck
npm run build
```

Deploy the repository to Vercel after configuring the environment variables below.

## Environment Variables

| Variable | Required | Used by | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | Prisma, Neon | Pooled Neon PostgreSQL connection string for application queries. |
| `DIRECT_URL` | Yes | Prisma migrations | Direct Neon PostgreSQL connection string for migrations and schema operations. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase | Public Supabase project URL for auth and storage clients. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase | Public anonymous key used by Supabase browser and server clients. |
| `NEXT_PUBLIC_APP_URL` | Yes | Auth, Stripe, redirects | Canonical app URL for OAuth callbacks, password reset, checkout, and portal returns. |
| `OPENAI_API_KEY` | Yes for AI | OpenAI | API key for resume review, comparisons, negotiation chat, and extraction workflows. |
| `STRIPE_SECRET_KEY` | Yes for billing | Stripe server SDK | Secret key for creating checkout and customer portal sessions. |
| `STRIPE_WEBHOOK_SECRET` | Yes for billing | Stripe webhooks | Signing secret for validating Stripe webhook events. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes for billing | Stripe client flows | Publishable key for client-side Stripe integrations. |
| `STRIPE_PRO_PRICE_ID` | Yes for billing | Stripe Checkout | Recurring Pro plan price ID used when creating checkout sessions. |

<details>
<summary><strong>Example .env.local shape</strong></summary>

```env
DATABASE_URL="postgres://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgres://user:password@host/dbname?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
```

</details>

## Deployment

### Vercel

1. Import the GitHub repository into Vercel.
2. Add every variable from `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to the production URL.
4. Deploy with the default Next.js build command.

### Supabase

1. Create a Supabase project.
2. Enable Google as an OAuth provider.
3. Add the production callback URL: `https://your-domain.com/auth/callback`.
4. Create a storage bucket for offer documents if PDF upload/extraction is enabled.
5. Copy the project URL and anon key into Vercel.

### Stripe

1. Create a recurring Pro product and price.
2. Store the price ID in `STRIPE_PRO_PRICE_ID`.
3. Add a webhook endpoint at `https://your-domain.com/api/webhooks/stripe`.
4. Subscribe to checkout, subscription, and invoice lifecycle events.
5. Store the webhook signing secret in `STRIPE_WEBHOOK_SECRET`.

## Screenshots Section

Every image in this README was captured from the running local application and stored under `public/readme/`.

| Asset | Description |
| --- | --- |
| `hero-banner.png` | Branded cover banner composed with the live dashboard capture. |
| `landing-page.png` | Marketing homepage with demo entry and pricing narrative. |
| `dashboard.png` | Demo dashboard with seeded offers and KPI cards. |
| `offers.png` | Offer management table with compensation totals and status badges. |
| `ai-chat.png` | Real Negotiation Coach chat screen captured from the production build. |
| `resume-review.png` | Resume review form with target-role context and pasted resume text. |
| `offer-comparison.png` | Comparison workflow with Google and Meta selected. |
| `analytics.png` | Compensation analytics cards and package chart. |
| `billing.png` | Billing settings with Stripe-ready Pro plan controls. |
| `settings.png` | Profile settings inside the account management area. |
| `mobile-view.png` | Mobile dashboard capture at a 390px viewport. |
| `demo.gif` | Animated walkthrough generated from live browser frames. |

## Assignment Compliance

- [x] Authentication with Supabase SSR sessions
- [x] Google OAuth-ready login surface
- [x] Demo mode for instant recruiter walkthroughs
- [x] Protected dashboard shell
- [x] Offer tracking and compensation modeling
- [x] AI resume review workflow
- [x] AI-powered offer comparison workflow
- [x] Offer-specific negotiation coach and AI chat API
- [x] Stripe billing and subscription management
- [x] Analytics view for compensation decisions
- [x] Settings area for profile, billing, security, notifications, and preferences
- [x] Responsive desktop and mobile UI
- [x] Dark mode support
- [x] Production deployment guide

## Performance

| Check | Status |
| --- | --- |
| Lint | ✔ `npm run lint` |
| Typecheck | ✔ `npm run typecheck` |
| Production Build | ✔ `npm run build` |
| Responsive QA | ✔ Desktop and 390px mobile screenshots captured from the running app |

## Future Roadmap

- Multi-currency compensation normalization with exchange-rate snapshots.
- External compensation benchmark integrations.
- Negotiation email templates with tone controls.
- Shared comparison links for mentors or advisors.
- Offer document timeline and version history.
- Admin-facing usage analytics and plan conversion reporting.
- Richer AI memory across offer, resume, and negotiation sessions.

## License

This project is licensed under the **MIT License**.

## Footer

<div align="center">
  <strong>Made with ❤️ by Gagandeep Singh</strong>
  <br />
  <br />
  <a href="https://github.com/gagandeepsingh76">GitHub Profile</a>
  ·
  <a href="https://www.linkedin.com/in/gagandeepsingh76">LinkedIn</a>
  ·
  <a href="https://offer-pilot-ai-alpha.vercel.app">Portfolio</a>
</div>
