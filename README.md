# OfferPilot AI

**AI-Powered Job Offer Intelligence Platform**
> Compare offers, negotiate smarter, and make better career decisions with AI.

OfferPilot AI is a premium SaaS application designed to help job seekers evaluate and negotiate job offers. By leveraging advanced AI, users can upload offer documents, automatically extract complex compensation packages, compare multiple offers side-by-side, and chat with an AI Negotiation Coach to draft professional responses.

## Features
- 📄 **AI Offer Parsing**: Upload a PDF offer letter and let AI extract base salary, equity, sign-on bonuses, PTO, and benefits with confidence scoring.
- ⚖️ **Side-by-Side Comparison**: Select multiple offers to generate an AI-driven comparative analysis highlighting strengths and weaknesses.
- 💬 **Negotiation Coach**: Context-aware AI chatbot that helps you formulate negotiation strategies and draft recruiter emails based on your specific offer details.
- 💳 **Stripe Subscriptions**: Tiered usage limits. Free users get limited analyses, while Pro users ($19/mo) unlock unlimited AI features.
- 🎨 **Premium UI/UX**: World-class SaaS design built with Next.js App Router, Tailwind CSS, and Framer Motion.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Server Actions, Server Components)
- **Database**: Neon (Serverless PostgreSQL) + Prisma ORM
- **Authentication**: Supabase Auth (SSR)
- **Storage**: Supabase Storage (PDF Uploads)
- **AI**: Vercel AI SDK + OpenAI (`gpt-4o-mini`)
- **Payments**: Stripe (Checkout, Customer Portal, Webhooks)
- **Styling**: Tailwind CSS, Lucide React, Framer Motion
- **Forms**: React Hook Form, Zod

## Folder Structure
```text
/app               # Next.js App Router (Pages, Layouts, API Routes)
  /api             # API Endpoints (Stripe Webhooks, AI Chat, Extract, Compare)
  /auth            # Supabase Auth Callbacks
  /dashboard       # Protected Application Views (Offers, Comparisons, Settings)
/components        # Reusable React Components (UI, Forms, Marketing)
/lib               # Utilities, Configs, Prisma Client, Supabase Client, AI Usage limits
/prisma            # Database Schema and Migrations
/server/actions    # Next.js Server Actions (Database Mutations, Stripe Integrations)
```

## Database Schema (Prisma)
The application relies on a strictly typed relational schema:
- **`User`**: Core user table synced with Supabase Auth.
- **`Profile`**: Extended user preferences and roles.
- **`Subscription`**: Syncs with Stripe webhooks (Plan, Customer IDs, Period Ends).
- **`Offer`**: Represents a single job offer, storing company, title, and status.
- **`Compensation`**: One-to-one with Offer, storing salary, equity, and benefits (JSON).
- **`OfferDocument`**: One-to-many with Offer, storing Supabase Storage URLs for PDFs.
- **`Comparison` & `ChatSession`**: Links offers to AI interactions.
- **`UsageRecord` & `AuditLog`**: Tracks monthly AI usage limits and logs important lifecycle events.

## Environment Variables
Create a `.env` file in the root directory and configure the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Neon / Prisma
DATABASE_URL=your_neon_transactional_connection_string
DIRECT_URL=your_neon_direct_connection_string

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/offerpilot-ai.git
   cd offerpilot-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup (Prisma):**
   Ensure your Neon database is running and `DATABASE_URL` is set.
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Stripe Setup
1. Create a Stripe account and switch to **Test Mode**.
2. Create a Product named "Pro Plan" with a recurring monthly price of $19.
3. Save the resulting Price ID to `STRIPE_PRO_PRICE_ID`.
4. Configure a Stripe Webhook endpoint pointing to `https://your-domain.com/api/webhooks/stripe` listening for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Save the Webhook Signing Secret to `STRIPE_WEBHOOK_SECRET`.

## Deployment
OfferPilot AI is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add all the Environment Variables listed above in the Vercel dashboard.
4. Deploy. Vercel will automatically run `npm run build` and provision the necessary edge infrastructure for the App Router and Vercel AI SDK.

## Future Improvements
- Multi-currency support and real-time conversion.
- Integration with external compensation APIs (e.g., Levels.fyi).
- Team and sharing features for collaborative negotiation coaching.
