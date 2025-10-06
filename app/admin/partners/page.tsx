import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PartnersTable } from "@/components/partners-table"

async function checkAdmin(userId: string) {
  const result = await sql`
    SELECT id FROM public.admins WHERE user_id = ${userId}
  `
  return result.length > 0
}

export default async function AdminPartnersPage() {
  const session = await getSession()

  if (!session || !(await checkAdmin(session.id))) {
    redirect("/dashboard")
  }

  const partners = await sql`
    SELECT 
      p.id,
      p.name,
      p.cnpj,
      p.email,
      p.phone,
      p.category,
      p.city,
      p.state,
      p.is_active,
      COUNT(c.id) as coupon_count
    FROM public.partners p
    LEFT JOIN public.coupons c ON p.id = c.partner_id AND c.is_active = true
    GROUP BY p.id
    ORDER BY p.name
  `

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={session} />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Parceiros</h1>
            <p className="text-muted-foreground">Gerencie estabelecimentos parceiros</p>
          </div>
          <Button asChild>
            <Link href="/admin/partners/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Parceiro
            </Link>
          </Button>
        </div>

        <PartnersTable partners={partners} />
      </main>
    </div>
  )
}
