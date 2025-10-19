"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bike, Waves, Flame, Dumbbell } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

interface Stats {
  total_running: number
  daily_goal: number
  weekly_goal: number
  monthly_goal: number
}

export function StatsCards({ stats }: { stats: Stats }) {
  const [selectedSport, setSelectedSport] = useState<"running" | "cycling" | "swimming" | "sportsplus">("running")

  const sportLabels = {
    running: "CORRIDA",
    cycling: "BIKE",
    swimming: "NATAÇÃO",
    sportsplus: "SPORTS+",
  }

  const sportIcons = {
    running: Activity,
    cycling: Bike,
    swimming: Waves,
    sportsplus: Dumbbell,
  }

  const dailyProgress = Math.min((stats.total_running / stats.daily_goal) * 100, 100)
  const weeklyProgress = Math.min((stats.total_running / stats.weekly_goal) * 100, 100)
  const monthlyProgress = Math.min((stats.total_running / stats.monthly_goal) * 100, 100)
  const caloricProgress = 45 // Mock data for now

  const getWeeklyTarget = () => {
    if (selectedSport === "cycling") return "20 KM"
    if (selectedSport === "swimming") return "2.000 M"
    return "7 KM"
  }

  const getMonthlyTarget = () => {
    if (selectedSport === "cycling") return "80 KM"
    if (selectedSport === "swimming") return "8.000 M"
    return "30 KM"
  }

  const sportsPlusGoals = [
    {
      title: "META CALÓRICA 1",
      target: "2.000 KCAL",
      current: "900",
      progress: 45,
      icon: Flame,
    },
    {
      title: "META CALÓRICA 2",
      target: "5.000 KCAL",
      current: "2.250",
      progress: 45,
      icon: Flame,
    },
    {
      title: "META CALÓRICA 3",
      target: "8.000 KCAL",
      current: "3.600",
      progress: 45,
      icon: Flame,
    },
    {
      title: "META CALÓRICA 4",
      target: "10.000 KCAL",
      current: "4.500",
      progress: 45,
      icon: Flame,
    },
  ]

  const allGoals = [
    {
      title: "META DIÁRIA",
      target: "2 KM",
      current: Number(stats.total_running).toFixed(1),
      progress: dailyProgress,
      icon: Activity,
      sports: ["running"], // Only show for running
    },
    {
      title: "META SEMANAL",
      target: getWeeklyTarget(),
      current: Number(stats.total_running).toFixed(1),
      progress: weeklyProgress,
      icon: Activity,
      sports: ["running", "cycling", "swimming"], // Show for all sports
    },
    {
      title: "META MENSAL",
      target: getMonthlyTarget(),
      current: Number(stats.total_running).toFixed(1),
      progress: monthlyProgress,
      icon: Activity,
      sports: ["running", "cycling", "swimming"], // Show for all sports
    },
    {
      title: "META CALÓRICA",
      target: "5.000 KCAL",
      current: "2.250",
      progress: caloricProgress,
      icon: Flame,
      sports: ["running", "cycling", "swimming"], // Show for all sports
    },
  ]

  const goals =
    selectedSport === "sportsplus" ? sportsPlusGoals : allGoals.filter((goal) => goal.sports.includes(selectedSport))

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        {(["running", "cycling", "swimming", "sportsplus"] as const).map((sport) => {
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

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
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
