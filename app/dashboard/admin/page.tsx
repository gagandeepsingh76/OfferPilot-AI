import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react"
import { getCurrentAppUser } from "@/lib/current-user"
import { isStripeCheckoutConfigured, isStripeWebhookConfigured } from "@/lib/stripe"
import { isOpenAIConfigured } from "@/lib/openai"

function statusLabel(enabled: boolean) {
  return enabled ? "Ready" : "Needs configuration"
}

function StatusRow({ label, ready, detail }: { label: string; ready: boolean; detail: string }) {
  const Icon = ready ? CheckCircle2 : CircleAlert

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
      <div>
        <div className="font-medium">{label}</div>
        <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
      </div>
      <div className={ready ? "flex items-center gap-2 text-sm text-green-600" : "flex items-center gap-2 text-sm text-yellow-600"}>
        <Icon className="h-4 w-4" />
        {statusLabel(ready)}
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const user = await getCurrentAppUser()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const databaseConfigured = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("user:password@host"))
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project.supabase.co")
  )
  const openAiConfigured = isOpenAIConfigured()
  const appUrlConfigured = Boolean(appUrl && !appUrl.includes("your-domain.com") && !appUrl.includes("localhost"))

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-muted-foreground">
            Deployment readiness checks for the current environment. No secrets are displayed.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <StatusRow
          label="Authenticated session"
          ready={Boolean(user)}
          detail={user ? `${user.name} (${user.email})` : "No active user session was detected."}
        />
        <StatusRow
          label="Demo mode"
          ready={Boolean(user?.isDemo)}
          detail={user?.isDemo ? "Demo mode is active and uses static seeded data for fast local QA." : "Demo mode is inactive for this session."}
        />
        <StatusRow
          label="Database"
          ready={databaseConfigured}
          detail={databaseConfigured ? "DATABASE_URL is configured. Migrations and seed should be run before deploy." : "DATABASE_URL is missing or still set to a placeholder."}
        />
        <StatusRow
          label="Supabase Auth"
          ready={supabaseConfigured}
          detail={supabaseConfigured ? "Supabase URL and anon key are configured for email and OAuth flows." : "Supabase keys are missing or placeholders; auth falls back to safe disabled states."}
        />
        <StatusRow
          label="Stripe Checkout"
          ready={isStripeCheckoutConfigured()}
          detail={isStripeCheckoutConfigured() ? "Stripe secret key and Pro price ID are configured." : "Stripe checkout requires STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID."}
        />
        <StatusRow
          label="Stripe Webhook"
          ready={isStripeWebhookConfigured()}
          detail={isStripeWebhookConfigured() ? "Webhook signing secret is configured." : "Production subscriptions require STRIPE_WEBHOOK_SECRET."}
        />
        <StatusRow
          label="OpenAI"
          ready={openAiConfigured}
          detail={openAiConfigured ? "AI features can call OpenAI." : "AI routes will show deterministic fallback guidance instead of crashing."}
        />
        <StatusRow
          label="Production app URL"
          ready={appUrlConfigured}
          detail={appUrlConfigured ? "NEXT_PUBLIC_APP_URL is configured for production redirects." : "Set NEXT_PUBLIC_APP_URL to the deployed HTTPS origin before production use."}
        />
      </div>
    </div>
  )
}
