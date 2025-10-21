import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bike, Waves, Trophy } from "lucide-react"

interface ActivityData {
  id: number
  activity_type: string
  distance_km: number
  duration_minutes: number
  calories_burned: number | null
  date: string
  source: string | null
}

export function RecentActivities({ activities }: { activities: ActivityData[] }) {
  const activityIcons: Record<string, any> = {
    running: Activity,
    cycling: Bike,
    swimming: Waves,
    sports_plus: Trophy,
  }

  const activityLabels: Record<string, string> = {
    running: "Corrida",
    cycling: "Ciclismo",
    swimming: "Natação",
    sports_plus: "SPORTS+",
  }

  const activityColors: Record<string, string> = {
    running: "bg-blue-100 text-blue-700",
    cycling: "bg-green-100 text-green-700",
    swimming: "bg-cyan-100 text-cyan-700",
    sports_plus: "bg-purple-100 text-purple-700",
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Suas últimas atividades aparecerão aqui</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8 font-extralight">Nenhuma atividade registrada ainda</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Suas últimas {activities.length} atividades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.activity_type]
            const date = new Date(activity.date).toLocaleDateString("pt-BR")

            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${activityColors[activity.activity_type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activityLabels[activity.activity_type]}</p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{Number(activity.distance_km).toFixed(1)} km</p>
                  <p className="text-xs text-muted-foreground">{activity.duration_minutes} min</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
