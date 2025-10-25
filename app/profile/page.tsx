import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Award, Activity } from "lucide-react"
import { Suspense } from "react"
import { AchievementsSection } from "@/components/achievements-section"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user stats
  const stats = await sql`
    SELECT 
      COUNT(DISTINCT id) as total_activities,
      COALESCE(SUM(distance_km), 0) as total_distance,
      COALESCE(SUM(calories_burned), 0) as total_calories
    FROM public.activities
    WHERE user_id = ${session.id}
  `

  const couponsStats = await sql`
    SELECT COUNT(*) as used_coupons
    FROM public.user_coupons
    WHERE user_id = ${session.id} AND status = 'used'
  `

  const userStats = stats[0]
  const usedCouponsCount = Number(couponsStats[0]?.used_coupons || 0)

  const planLabels: Record<string, string> = {
    free: "Gratuito",
    basic: "Básico",
    premium: "Premium",
    sports: "iRun Sports",
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl mb-1 font-semiboldboldum">Meu Perfil</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Suas informações e estatísticas</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-[#0b2396] to-[#d9a520] text-white text-2xl">
                  {session.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{session.name}</h2>
                <p className="text-sm text-muted-foreground">{session.email}</p>
              </div>
              <Badge variant="default" className="text-sm">
                {planLabels[session.plan_type] || "Gratuito"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{userStats.total_activities}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                Distância Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(userStats.total_distance).toFixed(1)} km</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Calorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(userStats.total_calories).toFixed(0)} kcal</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="text-sm font-medium">{session.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{session.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Membro desde</p>
                <p className="text-sm font-medium">
                  {new Date(session.created_at).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <AchievementsSection
          totalDistance={Number(userStats.total_distance)}
          totalCalories={Number(userStats.total_calories)}
          totalActivities={Number(userStats.total_activities)}
          usedCoupons={usedCouponsCount}
          userPlan={session.plan_type}
        />
      </main>
      <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t" />}>
        <BottomNav />
      </Suspense>
    </div>
  )
}
