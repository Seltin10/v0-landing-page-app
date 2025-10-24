"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bike, Waves, Flame, Trophy, Medal, Gem } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

interface Stats {
  total_running: number
  daily_goal: number
  weekly_goal: number
  monthly_goal: number
  diamond_goal: number
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

  const bronzeProgress = Math.min((stats.total_running / stats.daily_goal) * 100, 100)
  const silverProgress = Math.min((stats.total_running / stats.weekly_goal) * 100, 100)
  const goldProgress = Math.min((stats.total_running / stats.monthly_goal) * 100, 100)
  const diamondProgress = Math.min((stats.total_running / stats.diamond_goal) * 100, 100)
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
            iconColor: "text-orange-500",
          },
        ]
      : [
          {
            title: "META BRONZE",
            target: "2 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: bronzeProgress,
            icon: Medal,
            iconColor: "text-amber-700",
          },
          {
            title: "META PRATA",
            target: "7 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: silverProgress,
            icon: Medal,
            iconColor: "text-gray-400",
          },
          {
            title: "META OURO",
            target: "30 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: goldProgress,
            icon: Medal,
            iconColor: "text-yellow-500",
          },
          {
            title: "META DIAMANTE",
            target: "100 KM",
            current: Number(stats.total_running).toFixed(1),
            progress: diamondProgress,
            icon: Gem,
            iconColor: "text-cyan-400",
          },
        ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 items-center">
        {(["running", "cycling", "swimming", "sports_plus"] as const).map((sport) => {
          const Icon = sportIcons[sport]
          return (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs transition-all w-48 ${
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

      <div className={`grid gap-3 ${selectedSport === "sports_plus" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {goals.map((goal) => {
          const Icon = goal.icon
          return (
            <Card key={goal.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {goal.title}
                </CardTitle>
                <Icon className={`h-4 w-4 flex-shrink-0 ${goal.iconColor}`} />
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-normal text-xl">{goal.current}</span>
                  <span className="text-muted-foreground font-normal text-xs">/ {goal.target}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-normal">Progresso</span>
                    <span className="font-normal">{goal.progress.toFixed(0)}%</span>
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
