# Assessment Deliverables & Testing Guide

## 1. Demo Script (5–7 Minutes)

**[0:00 - 1:00] Introduction & Value Proposition**
*Presenter:* "Welcome to OfferPilot AI. OfferPilot AI is a premium, AI-powered job offer intelligence platform designed to help job seekers compare offers, negotiate smarter, and make better career decisions. The job market is highly competitive, and candidates often leave money on the table because they don't know how to negotiate complex compensation packages involving equity, bonuses, and benefits. OfferPilot solves this."

**[1:00 - 2:00] Core Feature: Offer Extraction**
*Presenter:* "Let's start by adding a new job offer. Instead of manually typing in complex details, I can just upload my PDF offer letter."
*(Action: Click 'Add Offer', upload a sample PDF, click 'Auto-fill with AI')*
*Presenter:* "Our AI extracts the base salary, equity, sign-on bonus, and benefits perfectly in seconds. It even gives a confidence score so you can trust the data."

**[2:00 - 3:00] Core Feature: Offer Comparison**
*Presenter:* "Now that we have multiple offers, how do they stack up? I'll head over to the Comparisons tab."
*(Action: Select two offers and generate a comparison)*
*Presenter:* "The AI generates a side-by-side analysis, highlighting the financial strengths of Offer A versus the superior benefits of Offer B, helping the candidate make a holistic decision."

**[3:00 - 4:00] Core Feature: AI Negotiation Coach**
*Presenter:* "Once I've chosen an offer, I want to negotiate the base salary. I'll open the AI Negotiation Coach."
*(Action: Open chat for an offer, ask "Help me draft an email asking for a $10k increase in base salary")*
*Presenter:* "Because the AI has the full context of this specific offer, it instantly drafts a highly professional, polite, and data-driven email that I can send directly to the recruiter."

**[4:00 - 5:00] Monetization (Stripe Integration)**
*Presenter:* "OfferPilot uses a freemium model. Free users get a limited number of AI analyses. If a user hits their limit, they are seamlessly prompted to upgrade."
*(Action: Go to Settings > Billing, click Upgrade to Pro)*
*Presenter:* "We use Stripe for secure checkout and subscription management. Once upgraded, users have unlimited access to our AI tools."

**[5:00 - 6:00] Technical Architecture & Conclusion**
*Presenter:* "Under the hood, we are built on Next.js 16 App Router, using Supabase for Auth and Storage, Neon Serverless PostgreSQL with Prisma, and the Vercel AI SDK integrating OpenAI. The UI is built with Tailwind and Framer Motion for a premium, fast experience. OfferPilot AI is fully production-ready. Thank you."

---

## 2. Reviewer Testing Guide

Follow these steps to fully test the application:

### A. Authentication
1. Go to the home page and click **Sign Up**.
2. Create an account with a test email/password.
3. Verify you are redirected to the Dashboard.

### B. Offer Management & AI Extraction
1. Go to **Offers** > **New Offer**.
2. Upload a sample Job Offer PDF.
3. Click **Auto-fill with AI**.
4. Verify the form populates automatically. Click **Save Changes**.

### C. AI Chat
1. Click on your newly created offer.
2. Click on the **Chat / Negotiate** tab.
3. Send a message like: "What are the weaknesses of this offer?"
4. Verify the streaming AI response.

### D. Billing & Limits
1. Go to **Settings** > **Billing**.
2. Verify you are on the "Free Plan" and the usage meters reflect your actions.
3. Click **Upgrade to Pro**. You will be redirected to Stripe Checkout.
4. Complete the checkout using the Stripe Test Card (see below).
5. Verify you are redirected back, your plan says "Pro Plan", and usage meters are hidden.

---

## 3. Test Credentials

### Supabase Auth (Test Users)
You can create your own test users via the Sign Up page, or use:
- **Email:** `test@offerpilot.ai`
- **Password:** `password123!`
*(Note: Create this user in your Supabase dashboard first)*

### Stripe Test Cards
When testing the Stripe Checkout flow in Test Mode, use the following card details:
- **Card Number:** `4242 4242 4242 4242`
- **MM/YY:** Any future date (e.g., `12/30`)
- **CVC:** Any 3 digits (e.g., `123`)
- **Name:** Test User
- **ZIP:** Any 5 digits (e.g., `12345`)

---

## 4. Deployment Checklist

Before deploying to Vercel, ensure the following steps are completed:

- [ ] **Supabase Setup**: 
  - Create a new project.
  - Set up Email auth.
  - Create a public/private storage bucket named `offer-documents`.
- [ ] **Database Setup**:
  - Provision a Neon Serverless PostgreSQL database.
  - Push Prisma schema (`npx prisma db push` or `npx prisma migrate deploy`).
- [ ] **Stripe Setup**:
  - Obtain Test or Live Keys.
  - Create the `Pro Plan` product and get the Price ID.
  - Set up the Webhook endpoint in Stripe pointing to your Vercel domain.
- [ ] **Vercel Setup**:
  - Connect your GitHub repository.
  - Populate all environment variables from `.env.example`.
- [ ] **Build Check**:
  - Ensure `npm run build` succeeds locally without warnings.

---

## 5. Production Checklist

After deploying to Vercel, verify these items in the live environment:

- [ ] **Auth flows**: Signup, Login, and Password Reset function correctly.
- [ ] **Database Connection**: Dashboard loads without Prisma connection errors.
- [ ] **Storage**: PDF uploads succeed and can be accessed securely.
- [ ] **AI Features**: Extraction and Chat stream properly (no Edge Function timeouts).
- [ ] **Webhooks**: Perform a test purchase in Stripe to ensure the webhook successfully upgrades the user's plan in the production database.
- [ ] **Performance**: Verify Lighthouse scores are >95.
