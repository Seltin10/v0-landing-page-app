import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Calendar, Ticket, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type TrophyTier = "bronze" | "silver" | "gold" | "platinum"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tier: TrophyTier
  earned: boolean
  progress?: number
  target?: number
}

interface AchievementsSectionProps {
  totalDistance: number
  totalCalories: number
  totalActivities: number
  usedCoupons: number
  userPlan: string
}

const tierColors: Record<TrophyTier, string> = {
  bronze: "text-amber-700",
  silver: "text-slate-400",
  gold: "text-yellow-500",
  platinum: "text-cyan-400",
}

const tierBgColors: Record<TrophyTier, string> = {
  bronze: "bg-amber-700/10",
  silver: "bg-slate-400/10",
  gold: "bg-yellow-500/10",
  platinum: "bg-cyan-400/10",
}

const tierLabels: Record<TrophyTier, string> = {
  bronze: "Bronze",
  silver: "Prata",
  gold: "Ouro",
  platinum: "Platina",
}

export function AchievementsSection({
  totalDistance,
  totalCalories,
  totalActivities,
  usedCoupons,
  userPlan,
}: AchievementsSectionProps) {
  // Define achievements based on metrics
  const achievements: Achievement[] = [
    // Distance achievements
    {
      id: "distance-bronze",
      title: "Primeiros Passos",
      description: "Complete 10 km",
      icon: <MapPin className="h-5 w-5" />,
      tier: "bronze",
      earned: totalDistance >= 10,
      progress: totalDistance,
      target: 10,
    },
    {
      id: "distance-silver",
      title: "Maratonista Iniciante",
      description: "Complete 50 km",
      icon: <MapPin className="h-5 w-5" />,
      tier: "silver",
      earned: totalDistance >= 50,
      progress: totalDistance,
      target: 50,
    },
    {
      id: "distance-gold",
      title: "Corredor Dedicado",
      description: "Complete 100 km",
      icon: <MapPin className="h-5 w-5" />,
      tier: "gold",
      earned: totalDistance >= 100,
      progress: totalDistance,
      target: 100,
    },
    {
      id: "distance-platinum",
      title: "Lenda da Estrada",
      description: "Complete 500 km",
      icon: <MapPin className="h-5 w-5" />,
      tier: "platinum",
      earned: totalDistance >= 500,
      progress: totalDistance,
      target: 500,
    },
    // Frequency achievements
    {
      id: "frequency-bronze",
      title: "Começando Bem",
      description: "Complete 5 atividades",
      icon: <Calendar className="h-5 w-5" />,
      tier: "bronze",
      earned: totalActivities >= 5,
      progress: totalActivities,
      target: 5,
    },
    {
      id: "frequency-silver",
      title: "Consistência",
      description: "Complete 25 atividades",
      icon: <Calendar className="h-5 w-5" />,
      tier: "silver",
      earned: totalActivities >= 25,
      progress: totalActivities,
      target: 25,
    },
    {
      id: "frequency-gold",
      title: "Atleta Comprometido",
      description: "Complete 50 atividades",
      icon: <Calendar className="h-5 w-5" />,
      tier: "gold",
      earned: totalActivities >= 50,
      progress: totalActivities,
      target: 50,
    },
    {
      id: "frequency-platinum",
      title: "Máquina Imparável",
      description: "Complete 200 atividades",
      icon: <Calendar className="h-5 w-5" />,
      tier: "platinum",
      earned: totalActivities >= 200,
      progress: totalActivities,
      target: 200,
    },
    // Coupons achievements
    {
      id: "coupons-bronze",
      title: "Primeira Recompensa",
      description: "Use 1 cupom",
      icon: <Ticket className="h-5 w-5" />,
      tier: "bronze",
      earned: usedCoupons >= 1,
      progress: usedCoupons,
      target: 1,
    },
    {
      id: "coupons-silver",
      title: "Caçador de Ofertas",
      description: "Use 5 cupons",
      icon: <Ticket className="h-5 w-5" />,
      tier: "silver",
      earned: usedCoupons >= 5,
      progress: usedCoupons,
      target: 5,
    },
    {
      id: "coupons-gold",
      title: "Mestre das Economias",
      description: "Use 10 cupons",
      icon: <Ticket className="h-5 w-5" />,
      tier: "gold",
      earned: usedCoupons >= 10,
      progress: usedCoupons,
      target: 10,
    },
    {
      id: "coupons-platinum",
      title: "Rei dos Descontos",
      description: "Use 50 cupons",
      icon: <Ticket className="h-5 w-5" />,
      tier: "platinum",
      earned: usedCoupons >= 50,
      progress: usedCoupons,
      target: 50,
    },
  ]

  // Add calorie achievements only for Sports+ users
  if (userPlan === "sports") {
    achievements.push(
      {
        id: "calories-bronze",
        title: "Queimando Calorias",
        description: "Queime 1.000 kcal",
        icon: <Flame className="h-5 w-5" />,
        tier: "bronze",
        earned: totalCalories >= 1000,
        progress: totalCalories,
        target: 1000,
      },
      {
        id: "calories-silver",
        title: "Fornalha Humana",
        description: "Queime 5.000 kcal",
        icon: <Flame className="h-5 w-5" />,
        tier: "silver",
        earned: totalCalories >= 5000,
        progress: totalCalories,
        target: 5000,
      },
      {
        id: "calories-gold",
        title: "Incinerador",
        description: "Queime 10.000 kcal",
        icon: <Flame className="h-5 w-5" />,
        tier: "gold",
        earned: totalCalories >= 10000,
        progress: totalCalories,
        target: 10000,
      },
      {
        id: "calories-platinum",
        title: "Vulcão Ativo",
        description: "Queime 50.000 kcal",
        icon: <Flame className="h-5 w-5" />,
        tier: "platinum",
        earned: totalCalories >= 50000,
        progress: totalCalories,
        target: 50000,
      },
    )
  }

  const earnedCount = achievements.filter((a) => a.earned).length
  const totalCount = achievements.length

  const earnedByTier = {
    bronze: achievements.filter((a) => a.tier === "bronze" && a.earned).length,
    silver: achievements.filter((a) => a.tier === "silver" && a.earned).length,
    gold: achievements.filter((a) => a.tier === "gold" && a.earned).length,
    platinum: achievements.filter((a) => a.tier === "platinum" && a.earned).length,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#0b2396]" />
            Conquistas
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {earnedCount}/{totalCount}
          </Badge>
        </div>
        <div className="flex gap-2 mt-3">
          {(["bronze", "silver", "gold", "platinum"] as TrophyTier[]).map((tier) => (
            <div key={tier} className="flex items-center gap-1 text-xs">
              <Trophy className={cn("h-4 w-4", tierColors[tier])} />
              <span className="text-muted-foreground">{earnedByTier[tier]}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const progressPercent = achievement.target
              ? Math.min(100, ((achievement.progress || 0) / achievement.target) * 100)
              : 0

            return (
              <div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-lg transition-all border-2",
                  achievement.earned
                    ? cn("border-current", tierBgColors[achievement.tier])
                    : "border-border bg-muted/30 opacity-60",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      achievement.earned ? tierColors[achievement.tier] : "text-muted-foreground",
                      achievement.earned ? tierBgColors[achievement.tier] : "bg-muted",
                    )}
                  >
                    {achievement.earned ? <Trophy className="h-5 w-5" /> : achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm leading-tight">{achievement.title}</h3>
                      {achievement.earned && (
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] px-1.5 py-0", tierColors[achievement.tier])}
                        >
                          {tierLabels[achievement.tier]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    {!achievement.earned && achievement.target && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {achievement.progress?.toFixed(0)} / {achievement.target}
                          </span>
                          <span>{progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0b2396] transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
