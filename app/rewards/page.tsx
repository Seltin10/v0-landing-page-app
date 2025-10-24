import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { CouponCard } from "@/components/coupon-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"

export default async function RewardsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Get available coupons (from completed goals)
  const availableCoupons = await sql`
    SELECT DISTINCT
      c.id,
      c.title,
      c.description,
      c.discount_type,
      c.discount_value,
      c.valid_until,
      p.name as partner_name,
      p.logo_url,
      g.title as goal_title
    FROM public.coupons c
    JOIN public.partners p ON c.partner_id = p.id
    JOIN public.goals g ON c.goal_id = g.id
    JOIN public.user_goal_progress ugp ON g.id = ugp.goal_id
    WHERE ugp.user_id = ${session.id}
      AND ugp.is_completed = true
      AND c.is_active = true
      AND c.valid_until >= CURRENT_DATE
      AND c.current_redemptions < c.max_redemptions
      AND NOT EXISTS (
        SELECT 1 FROM public.user_coupons uc
        WHERE uc.user_id = ${session.id}
          AND uc.coupon_id = c.id
      )
    ORDER BY c.valid_until
  `

  // Get user's earned coupons
  const earnedCoupons = await sql`
    SELECT 
      uc.id as user_coupon_id,
      uc.redemption_code,
      uc.status,
      uc.earned_at,
      uc.used_at,
      c.title,
      c.description,
      c.discount_type,
      c.discount_value,
      c.valid_until,
      c.terms,
      p.name as partner_name,
      p.logo_url,
      p.address,
      p.city,
      p.state
    FROM public.user_coupons uc
    JOIN public.coupons c ON uc.coupon_id = c.id
    JOIN public.partners p ON c.partner_id = p.id
    WHERE uc.user_id = ${session.id}
    ORDER BY uc.earned_at DESC
  `

  const activeCoupons = earnedCoupons.filter((c: any) => c.status === "available")
  const usedCoupons = earnedCoupons.filter((c: any) => c.status === "used")

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl mb-1 font-normalal">Recompensas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Resgate e gerencie seus cupons de desconto
          </p>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="available" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Disponíveis</span>
              <span className="sm:hidden">Disp.</span>
              <span className="ml-1">({availableCoupons.length})</span>
            </TabsTrigger>
            <TabsTrigger value="earned" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Usados</span>
              <span className="sm:hidden">Usados</span>
              <span className="ml-1">({activeCoupons.length})</span>
            </TabsTrigger>
            <TabsTrigger value="used" className="text-xs sm:text-sm py-2">
              <span className="hidden sm:inline">Expirados</span>
              <span className="sm:hidden">Expirados</span>
              <span className="ml-1">({usedCoupons.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-4">
            {availableCoupons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-2">Nenhum cupom disponível no momento</p>
                <p className="text-xs text-muted-foreground">Complete metas para desbloquear recompensas!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableCoupons.map((coupon: any) => (
                  <Suspense key={coupon.id} fallback={<div className="h-48 animate-pulse bg-muted rounded-lg" />}>
                    <CouponCard coupon={coupon} userId={session.id} type="available" />
                  </Suspense>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="earned" className="space-y-4 mt-4">
            {activeCoupons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Você ainda não resgatou nenhum cupom</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeCoupons.map((coupon: any) => (
                  <Suspense
                    key={coupon.user_coupon_id}
                    fallback={<div className="h-48 animate-pulse bg-muted rounded-lg" />}
                  >
                    <CouponCard coupon={coupon} userId={session.id} type="earned" />
                  </Suspense>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="used" className="space-y-4 mt-4">
            {usedCoupons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Nenhum cupom utilizado ainda</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {usedCoupons.map((coupon: any) => (
                  <Suspense
                    key={coupon.user_coupon_id}
                    fallback={<div className="h-48 animate-pulse bg-muted rounded-lg" />}
                  >
                    <CouponCard coupon={coupon} userId={session.id} type="used" />
                  </Suspense>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  )
}
