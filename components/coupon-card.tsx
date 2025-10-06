"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, MapPin, Calendar, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { claimCoupon } from "@/lib/coupons"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Coupon {
  id?: number
  user_coupon_id?: number
  title: string
  description: string
  discount_type: string
  discount_value: number
  valid_until: string
  partner_name: string
  logo_url?: string
  goal_title?: string
  redemption_code?: string
  status?: string
  terms?: string
  address?: string
  city?: string
  state?: string
}

export function CouponCard({ coupon, userId, type }: { coupon: Coupon; userId: string; type: string }) {
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const router = useRouter()

  const discountText =
    coupon.discount_type === "percentage"
      ? `${coupon.discount_value}% OFF`
      : coupon.discount_type === "fixed"
        ? `R$ ${coupon.discount_value} OFF`
        : "Brinde"

  const validUntil = new Date(coupon.valid_until).toLocaleDateString("pt-BR")

  async function handleClaim() {
    if (!coupon.id) return

    setLoading(true)
    const result = await claimCoupon(userId, coupon.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <Card className={type === "used" ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                {coupon.title}
              </CardTitle>
              <CardDescription className="mt-1">{coupon.partner_name}</CardDescription>
            </div>
            <Badge variant={type === "used" ? "secondary" : "default"} className="text-lg font-bold">
              {discountText}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{coupon.description}</p>

          {type === "earned" && coupon.redemption_code && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Código de resgate</p>
              <p className="text-xl font-mono font-bold tracking-wider">{coupon.redemption_code}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Válido até {validUntil}</span>
          </div>

          {coupon.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {coupon.city}, {coupon.state}
              </span>
            </div>
          )}

          {type === "available" && coupon.goal_title && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Meta "{coupon.goal_title}" concluída!</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {type === "available" && (
            <Button onClick={handleClaim} disabled={loading} className="w-full">
              {loading ? "Resgatando..." : "Resgatar Cupom"}
            </Button>
          )}
          {type === "earned" && (
            <Button onClick={() => setShowDetails(true)} variant="outline" className="w-full">
              Ver Detalhes
            </Button>
          )}
          {type === "used" && (
            <Badge variant="secondary" className="w-full justify-center py-2">
              Cupom Utilizado
            </Badge>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{coupon.title}</DialogTitle>
            <DialogDescription>{coupon.partner_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Código de resgate</p>
              <p className="text-3xl font-mono font-bold tracking-wider">{coupon.redemption_code}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Descrição</h4>
              <p className="text-sm text-muted-foreground">{coupon.description}</p>
            </div>
            {coupon.terms && (
              <div>
                <h4 className="font-semibold mb-2">Termos de uso</h4>
                <p className="text-sm text-muted-foreground">{coupon.terms}</p>
              </div>
            )}
            {coupon.address && (
              <div>
                <h4 className="font-semibold mb-2">Localização</h4>
                <p className="text-sm text-muted-foreground">
                  {coupon.address}
                  <br />
                  {coupon.city}, {coupon.state}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Válido até {validUntil}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
