import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { AdminHeader } from "@/components/admin-header"
import { NewPartnerForm } from "@/components/new-partner-form"

async function checkAdmin(userId: string) {
  const result = await sql`
    SELECT id FROM public.admins WHERE user_id = ${userId}
  `
  return result.length > 0
}

export default async function NewPartnerPage() {
  const session = await getSession()

  if (!session || !(await checkAdmin(session.id))) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={session} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Novo Parceiro</h1>
          <p className="text-muted-foreground">Cadastre um novo estabelecimento parceiro</p>
        </div>

        <NewPartnerForm />
      </main>
    </div>
  )
}
