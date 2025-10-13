import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { GoalCard } from "@/components/goal-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"

export default async function GoalsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Get all active goals with user progress
  const goalsWithProgress = await sql`
    SELECT 
      g.id,
      g.title,
      g.description,
      g.goal_type,
      g.activity_type,
      g.target_value,
      g.target_unit,
      g.required_plan,
      ugp.current_value,
      ugp.is_completed,
      ugp.period_start,
      ugp.period_end
    FROM public.goals g
    LEFT JOIN public.user_goal_progress ugp ON g.id = ugp.goal_id 
      AND ugp.user_id = ${session.id}
      AND (
        (g.goal_type = 'daily' AND ugp.period_start::date = CURRENT_DATE) OR
        (g.goal_type = 'weekly' AND ugp.period_start::date = date_trunc('week', CURRENT_DATE)::date) OR
        (g.goal_type = 'monthly' AND ugp.period_start::date = date_trunc('month', CURRENT_DATE)::date) OR
        (g.goal_type = 'caloric' AND ugp.is_completed = false)
      )
    WHERE g.is_active = true
    ORDER BY g.goal_type, g.target_value
  `

  const dailyGoals = goalsWithProgress.filter((g: any) => g.goal_type === "daily")
  const weeklyGoals = goalsWithProgress.filter((g: any) => g.goal_type === "weekly")
  const monthlyGoals = goalsWithProgress.filter((g: any) => g.goal_type === "monthly")
  const caloricGoals = goalsWithProgress.filter((g: any) => g.goal_type === "caloric")

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Metas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Complete metas e ganhe cupons de desconto
          </p>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="daily" className="text-xs sm:text-sm py-2">
              Diárias
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs sm:text-sm py-2">
              Semanais
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs sm:text-sm py-2">
              Mensais
            </TabsTrigger>
            <TabsTrigger value="caloric" className="text-xs sm:text-sm py-2">
              Calóricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 mt-6">
            {dailyGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma meta diária disponível</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dailyGoals.map((goal: any) => (
                  <GoalCard key={goal.id} goal={goal} userPlan={session.plan_type} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4 mt-6">
            {weeklyGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma meta semanal disponível</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weeklyGoals.map((goal: any) => (
                  <GoalCard key={goal.id} goal={goal} userPlan={session.plan_type} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 mt-6">
            {monthlyGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma meta mensal disponível</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {monthlyGoals.map((goal: any) => (
                  <GoalCard key={goal.id} goal={goal} userPlan={session.plan_type} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="caloric" className="space-y-4 mt-6">
            {caloricGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma meta calórica disponível</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {caloricGoals.map((goal: any) => (
                  <GoalCard key={goal.id} goal={goal} userPlan={session.plan_type} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t" />}>
        <BottomNav />
      </Suspense>
    </div>
  )
}
