import { logout } from '@/server/actions/auth'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Welcome to your protected dashboard!</p>
      <form action={async () => {
        "use server"
        await logout()
      }}>
        <Button variant="destructive" type="submit">Log out</Button>
      </form>
    </div>
  )
}
