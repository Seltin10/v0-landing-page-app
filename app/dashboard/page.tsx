import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivities } from "@/components/recent-activities"
import { BottomNav } from "@/components/bottom-nav"
import { PartnerAdBanner } from "@/components/partner-ad-banner"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const stats = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN activity_type = 'running' THEN distance_km ELSE 0 END), 0) as total_running
    FROM public.activities
    WHERE user_id = ${session.id}
  `

  // Get recent activities
  const activities = await sql`
    SELECT id, activity_type, distance_km, duration_minutes, calories_burned, date, source
    FROM public.activities
    WHERE user_id = ${session.id}
    ORDER BY date DESC, created_at DESC
    LIMIT 10
  `

  const goalStats = {
    total_running: Number(stats[0].total_running),
    daily_goal: 2,
    weekly_goal: 7,
    monthly_goal: 30,
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <div className="mb-8">
          <PartnerAdBanner />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Minhas Metas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Sincronizado via Apple Health, Google Fit e Strava
          </p>
        </div>

        <StatsCards stats={goalStats} />

        <RecentActivities activities={activities} />
      </main>
      <BottomNav />
    </div>
  )
}
