"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bike, Waves, Flame, Trophy, Medal, Gem } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

interface Stats {
  total_running: number
  total_cycling: number
  total_swimming: number
  total_calories: number
  running_bronze: number
  running_silver: number
  running_gold: number
  running_diamond: number
  cycling_bronze: number
  cycling_silver: number
  cycling_gold: number
  cycling_diamond: number
  swimming_bronze: number
  swimming_silver: number
  swimming_gold: number
  swimming_diamond: number
  calorie_bronze: number
  calorie_silver: number
  calorie_gold: number
}

export function StatsCards({ stats }: { stats: Stats }) {
  const [selectedSport, setSelectedSport] = useState<"running" | "cycling" | "swimming" | "sports_plus">("running")

  const sportLabels = {
    running: "CORRIDA",
    cycling: "BIKE",
    swimming: "NATAÇÃO",
    sports_plus: "META CALÓRICA",
  }

  const sportIcons = {
    running: Activity,
    cycling: Bike,
    swimming: Waves,
    sports_plus: Trophy,
  }

  let currentDistance = 0
  let bronzeGoal = 0
  let silverGoal = 0
  let goldGoal = 0
  let diamondGoal = 0

  if (selectedSport === "running") {
    currentDistance = stats.total_running
    bronzeGoal = stats.running_bronze
    silverGoal = stats.running_silver
    goldGoal = stats.running_gold
    diamondGoal = stats.running_diamond
  } else if (selectedSport === "cycling") {
    currentDistance = stats.total_cycling
    bronzeGoal = stats.cycling_bronze
    silverGoal = stats.cycling_silver
    goldGoal = stats.cycling_gold
    diamondGoal = stats.cycling_diamond
  } else if (selectedSport === "swimming") {
    currentDistance = stats.total_swimming
    bronzeGoal = stats.swimming_bronze
    silverGoal = stats.swimming_silver
    goldGoal = stats.swimming_gold
    diamondGoal = stats.swimming_diamond
  }

  const bronzeProgress = Math.min((currentDistance / bronzeGoal) * 100, 100)
  const silverProgress = Math.min((currentDistance / silverGoal) * 100, 100)
  const goldProgress = Math.min((currentDistance / goldGoal) * 100, 100)
  const diamondProgress = Math.min((currentDistance / diamondGoal) * 100, 100)

  const calorieBronzeProgress = Math.min((stats.total_calories / stats.calorie_bronze) * 100, 100)
  const calorieSilverProgress = Math.min((stats.total_calories / stats.calorie_silver) * 100, 100)
  const calorieGoldProgress = Math.min((stats.total_calories / stats.calorie_gold) * 100, 100)

  const goals =
    selectedSport === "sports_plus"
      ? // Updated SPORTS+ to show three calorie-based goals
        [
          {
            title: "META BRONZE",
            target: `${stats.calorie_bronze} KCAL`,
            current: Number(stats.total_calories).toFixed(0),
            progress: calorieBronzeProgress,
            icon: Flame,
            iconColor: "text-amber-700",
          },
          {
            title: "META PRATA",
            target: `${stats.calorie_silver} KCAL`,
            current: Number(stats.total_calories).toFixed(0),
            progress: calorieSilverProgress,
            icon: Flame,
            iconColor: "text-gray-400",
          },
          {
            title: "META OURO",
            target: `${stats.calorie_gold} KCAL`,
            current: Number(stats.total_calories).toFixed(0),
            progress: calorieGoldProgress,
            icon: Flame,
            iconColor: "text-yellow-500",
          },
        ]
      : [
          {
            title: "META BRONZE",
            target: `${bronzeGoal} ${selectedSport === "swimming" ? "KM (500M)" : "KM"}`,
            current: Number(currentDistance).toFixed(1),
            progress: bronzeProgress,
            icon: Medal,
            iconColor: "text-amber-700",
          },
          {
            title: "META PRATA",
            target: `${silverGoal} ${selectedSport === "swimming" ? "KM (1000M)" : "KM"}`,
            current: Number(currentDistance).toFixed(1),
            progress: silverProgress,
            icon: Medal,
            iconColor: "text-gray-400",
          },
          {
            title: "META OURO",
            target: `${goldGoal} ${selectedSport === "swimming" ? "KM (2000M)" : "KM"}`,
            current: Number(currentDistance).toFixed(1),
            progress: goldProgress,
            icon: Medal,
            iconColor: "text-yellow-500",
          },
          {
            title: "META DIAMANTE",
            target: `${diamondGoal} ${selectedSport === "swimming" ? "KM (3000M)" : "KM"}`,
            current: Number(currentDistance).toFixed(1),
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

      <div
        className={`grid gap-3 ${selectedSport === "sports_plus" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}
      >
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
