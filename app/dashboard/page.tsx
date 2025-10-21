import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivities } from "@/components/recent-activities"
import { BottomNav } from "@/components/bottom-nav"
import { PartnerAdsBanner } from "@/components/partner-ads-banner"
import { RewardStatsCards } from "@/components/reward-stats-cards"

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

  const partners = await sql`
    SELECT id, name, logo_url, category
    FROM public.partners
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT 10
  `

  // Get total savings from used coupons
  const savingsResult = await sql`
    SELECT COALESCE(SUM(c.discount_value), 0) as total_savings
    FROM public.user_coupons uc
    JOIN public.coupons c ON uc.coupon_id = c.id
    WHERE uc.user_id = ${session.id} AND uc.status = 'used'
  `

  // Get count of used coupons
  const usedCouponsResult = await sql`
    SELECT COUNT(*) as used_count
    FROM public.user_coupons
    WHERE user_id = ${session.id} AND status = 'used'
  `

  // Get most frequently used partner
  const preferredPartnerResult = await sql`
    SELECT p.name, COUNT(*) as usage_count
    FROM public.user_coupons uc
    JOIN public.coupons c ON uc.coupon_id = c.id
    JOIN public.partners p ON c.partner_id = p.id
    WHERE uc.user_id = ${session.id} AND uc.status = 'used'
    GROUP BY p.id, p.name
    ORDER BY usage_count DESC
    LIMIT 1
  `

  const goalStats = {
    total_running: Number(stats[0].total_running),
    daily_goal: 2,
    weekly_goal: 7,
    monthly_goal: 30,
  }

  const rewardStats = {
    totalSavings: Number(savingsResult[0]?.total_savings || 0),
    usedCoupons: Number(usedCouponsResult[0]?.used_count || 0),
    preferredPartner: preferredPartnerResult[0]?.name || null,
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <PartnerAdsBanner partners={partners} />

        <div>
          <h1 className="sm:text-2xl mb-1 text-xl leading-5 font-normal">Minhas Metas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Sincronizado via Apple Health, Google Fit e Strava
          </p>
        </div>

        <StatsCards stats={goalStats} />

        <RewardStatsCards stats={rewardStats} />

        <RecentActivities activities={activities} />
      </main>
      <BottomNav />
    </div>
  )
}
