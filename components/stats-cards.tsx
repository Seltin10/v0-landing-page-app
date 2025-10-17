"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bike, Waves, Flame, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

interface Stats {
  total_running: number
  daily_goal: number
  weekly_goal: number
  monthly_goal: number
}

export function StatsCards({ stats }: { stats: Stats }) {
  const [selectedSport, setSelectedSport] = useState<"running" | "cycling" | "swimming" | "sports_plus">("running")

  const sportLabels = {
    running: "CORRIDA",
    cycling: "BIKE",
    swimming: "NATAÇÃO",
    sports_plus: "SPORTS+",
  }

  const sportIcons = {
    running: Activity,
    cycling: Bike,
    swimming: Waves,
    sports_plus: Trophy,
  }

  const dailyProgress = Math.min((stats.total_running / stats.daily_goal) * 100, 100)
  const weeklyProgress = Math.min((stats.total_running / stats.weekly_goal) * 100, 100)
  const monthlyProgress = Math.min((stats.total_running / stats.monthly_goal) * 100, 100)
  const caloricProgress = 45 // Mock data for now

  const goals =
    selectedSport === "sports_plus"
      ? [
          {
            title: "META CALÓRICA",
            target: "5.000 KCAL",
            current: "2.250",
            progress: caloricProgress,
            icon: Flame,
          },
        ]
      : [
          {
            title: "META DIÁRIA",
            target: "2 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: dailyProgress,
            icon: Activity,
          },
          {
            title: "META SEMANAL",
            target: "7 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: weeklyProgress,
            icon: Activity,
          },
          {
            title: "META MENSAL",
            target: "30 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: monthlyProgress,
            icon: Activity,
          },
        ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {(["running", "cycling", "swimming", "sports_plus"] as const).map((sport) => {
          const Icon = sportIcons[sport]
          return (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                selectedSport === sport
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {sportLabels[sport]}
            </button>
          )
        })}
      </div>

      <div className={`grid gap-3 ${selectedSport === "sports_plus" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
        {goals.map((goal) => {
          const Icon = goal.icon
          return (
            <Card key={goal.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {goal.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{goal.current}</span>
                  <span className="text-sm text-muted-foreground font-medium">/ {goal.target}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium">Progresso</span>
                    <span className="font-semibold">{goal.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
