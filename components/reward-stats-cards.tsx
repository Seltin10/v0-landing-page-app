"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Ticket, Store } from "lucide-react"

interface RewardStats {
  totalSavings: number
  usedCoupons: number
  preferredPartner: string | null
}

export function RewardStatsCards({ stats }: { stats: RewardStats }) {
  const cards = [
    {
      title: "ESTIMATIVA DE ECONOMIA",
      value: `R$ ${stats.totalSavings.toFixed(2)}`,
      icon: DollarSign,
      description: "Total economizado",
    },
    {
      title: "CUPONS UTILIZADOS",
      value: stats.usedCoupons.toString(),
      icon: Ticket,
      description: "Cupons resgatados",
    },
    {
      title: "EMPRESA PREFERIDA",
      value: stats.preferredPartner || "Nenhuma",
      icon: Store,
      description: "Mais utilizada",
    },
  ]

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-green-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="font-semibold text-xl">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
