import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { PartnerHeader } from "@/components/partner-header"
import { ValidateCouponForm } from "@/components/validate-coupon-form"
import { RecentValidations } from "@/components/recent-validations"

async function getPartnerSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("partner_session")

  if (!session) return null

  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export default async function PartnerPage() {
  const session = await getPartnerSession()

  if (!session) {
    redirect("/partner/login")
  }

  // Get partner stats
  const stats = await sql`
    SELECT 
      COUNT(*) as total_validations,
      COUNT(*) FILTER (WHERE used_at::date = CURRENT_DATE) as today_validations
    FROM public.user_coupons
    WHERE validated_by = ${session.id}
      AND status = 'used'
  `

  // Get recent validations
  const validations = await sql`
    SELECT 
      uc.redemption_code,
      uc.used_at,
      c.title as coupon_title,
      c.discount_type,
      c.discount_value,
      u.name as user_name
    FROM public.user_coupons uc
    JOIN public.coupons c ON uc.coupon_id = c.id
    JOIN public.users u ON uc.user_id = u.id
    WHERE uc.validated_by = ${session.id}
      AND uc.status = 'used'
    ORDER BY uc.used_at DESC
    LIMIT 10
  `

  return (
    <div className="min-h-screen bg-background">
      <PartnerHeader partner={session} />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel do Parceiro</h1>
          <p className="text-muted-foreground">Valide cupons de clientes iRun</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-card border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Validações Hoje</p>
            <p className="text-4xl font-bold">{stats[0].today_validations}</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Total de Validações</p>
            <p className="text-4xl font-bold">{stats[0].total_validations}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ValidateCouponForm partnerId={session.id} />
          <RecentValidations validations={validations} />
        </div>
      </main>
    </div>
  )
}
