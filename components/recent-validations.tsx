import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface Validation {
  redemption_code: string
  used_at: string
  coupon_title: string
  discount_type: string
  discount_value: number
  user_name: string
}

export function RecentValidations({ validations }: { validations: Validation[] }) {
  if (validations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Validações Recentes</CardTitle>
          <CardDescription>Últimas validações de cupons</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma validação ainda</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validações Recentes</CardTitle>
        <CardDescription>Últimas {validations.length} validações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validations.map((validation, index) => {
            const date = new Date(validation.used_at).toLocaleString("pt-BR")
            const discount =
              validation.discount_type === "percentage"
                ? `${validation.discount_value}%`
                : validation.discount_type === "fixed"
                  ? `R$ ${validation.discount_value}`
                  : "Brinde"

            return (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-green-100 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{validation.coupon_title}</p>
                  <p className="text-xs text-muted-foreground">
                    {validation.user_name} • {date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{discount}</p>
                  <p className="text-xs text-muted-foreground font-mono">{validation.redemption_code}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
