import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Lock } from "lucide-react"

interface Goal {
  id: number
  title: string
  description: string
  goal_type: string
  activity_type: string
  target_value: number
  target_unit: string
  required_plan: string
  current_value: number | null
  is_completed: boolean | null
}

const planHierarchy: Record<string, number> = {
  free: 0,
  basic: 1,
  premium: 2,
  sports: 3,
}

export function GoalCard({ goal, userPlan }: { goal: Goal; userPlan: string }) {
  const currentValue = Number(goal.current_value || 0)
  const targetValue = Number(goal.target_value)
  const progress = Math.min((currentValue / targetValue) * 100, 100)
  const isLocked = planHierarchy[userPlan] < planHierarchy[goal.required_plan]

  const activityLabels: Record<string, string> = {
    running: "Corrida",
    cycling: "Ciclismo",
    swimming: "Natação",
    sports_plus: "SPORTS+",
    any: "Qualquer",
  }

  const planLabels: Record<string, string> = {
    free: "Gratuito",
    basic: "Básico",
    premium: "Premium",
    sports: "iRun Sports",
  }

  return (
    <Card className={isLocked ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {goal.title}
              {goal.is_completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
            </CardTitle>
            <CardDescription className="mt-1">{goal.description}</CardDescription>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">{activityLabels[goal.activity_type]}</Badge>
          {isLocked && <Badge variant="secondary">{planLabels[goal.required_plan]}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isLocked ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">
                  {currentValue.toFixed(1)} / {targetValue.toFixed(1)} {goal.target_unit}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            {goal.is_completed ? (
              <p className="text-sm text-green-600 font-medium">Meta concluída!</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Faltam {(targetValue - currentValue).toFixed(1)} {goal.target_unit}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Faça upgrade para {planLabels[goal.required_plan]} para desbloquear
          </p>
        )}
      </CardContent>
    </Card>
  )
}
