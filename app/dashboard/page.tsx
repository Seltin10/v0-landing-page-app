import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivities } from "@/components/recent-activities"
import { BottomNav } from "@/components/bottom-nav"
import { PartnerAdsBanner } from "@/components/partner-ads-banner"
import { RewardStatsCards } from "@/components/reward-stats-cards"
import { EcoCalculator } from "@/components/eco-calculator"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const goalStats = {
    total_running: 15.5,
    total_cycling: 25.3,
    total_swimming: 2.1,
    total_calories: 2500,
    running_bronze: 2,
    running_silver: 5,
    running_gold: 20,
    running_diamond: 30,
    cycling_bronze: 10,
    cycling_silver: 20,
    cycling_gold: 30,
    cycling_diamond: 50,
    swimming_bronze: 0.5,
    swimming_silver: 1,
    swimming_gold: 2,
    swimming_diamond: 3,
    calorie_bronze: 1000,
    calorie_silver: 2000,
    calorie_gold: 3000,
  }

  const activities = [
    {
      id: "1",
      activity_type: "running",
      distance_km: 5.2,
      duration_minutes: 28,
      calories_burned: 420,
      date: new Date().toISOString(),
      source: "strava",
    },
    {
      id: "2",
      activity_type: "cycling",
      distance_km: 15.8,
      duration_minutes: 45,
      calories_burned: 580,
      date: new Date(Date.now() - 86400000).toISOString(),
      source: "apple_health",
    },
    {
      id: "3",
      activity_type: "swimming",
      distance_km: 1.2,
      duration_minutes: 35,
      calories_burned: 320,
      date: new Date(Date.now() - 172800000).toISOString(),
      source: "google_fit",
    },
  ]

  const partners = [
    {
      id: "1",
      name: "Nike Running",
      logo_url: "/nike-swoosh.png",
      category: "Esportes",
    },
    {
      id: "2",
      name: "Adidas",
      logo_url: "/adidas-logo.png",
      category: "Vestuário",
    },
    {
      id: "3",
      name: "Decathlon",
      logo_url: "/decathlon-logo.jpg",
      category: "Equipamentos",
    },
  ]

  const rewardStats = {
    totalSavings: 350.75,
    usedCoupons: 12,
    preferredPartner: "Nike Running",
  }

  return (
    <div className="min-h-screen pb-20 bg-indigo-50">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <div className="pt-2">
          <h2 className="text-chart-4 leading-7 text-xl mx-0 px-0 py-2.5 border-0 font-sans font-extralight sm:text-2xl">
            Seja Bem-Vindo, {session.name || session.email?.split("@")[0]}
          </h2>
        </div>

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

        <EcoCalculator totalRunning={goalStats.total_running} totalCycling={goalStats.total_cycling} />
      </main>
      <BottomNav />
    </div>
  )
}
