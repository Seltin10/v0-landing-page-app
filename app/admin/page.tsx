import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Target, Gift } from "lucide-react"
import Link from "next/link"

async function checkAdmin(userId: string) {
  const result = await sql`
    SELECT id FROM public.admins WHERE user_id = ${userId}
  `
  return result.length > 0
}

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = await checkAdmin(session.id)

  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Get system stats
  const stats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM public.users) as total_users,
      (SELECT COUNT(*) FROM public.partners WHERE is_active = true) as total_partners,
      (SELECT COUNT(*) FROM public.goals WHERE is_active = true) as total_goals,
      (SELECT COUNT(*) FROM public.coupons WHERE is_active = true) as total_coupons,
      (SELECT COUNT(*) FROM public.user_coupons WHERE status = 'used') as total_redemptions
  `

  const cards = [
    {
      title: "Usuários",
      value: stats[0].total_users,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600",
    },
    {
      title: "Parceiros",
      value: stats[0].total_partners,
      icon: Store,
      href: "/admin/partners",
      color: "text-green-600",
    },
    {
      title: "Metas",
      value: stats[0].total_goals,
      icon: Target,
      href: "/admin/goals",
      color: "text-purple-600",
    },
    {
      title: "Cupons",
      value: stats[0].total_coupons,
      icon: Gift,
      href: "/admin/coupons",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={session} />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie todo o sistema iRun</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total de Resgates</span>
                <span className="font-medium">{stats[0].total_redemptions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
