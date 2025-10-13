import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Suspense } from "react"

export default async function CommunitiesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Comunidades</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Conecte-se com outros atletas</p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Em breve</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A funcionalidade de comunidades estará disponível em breve. Você poderá se conectar com outros atletas,
              participar de desafios e compartilhar suas conquistas.
            </p>
          </CardContent>
        </Card>
      </main>
      <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t" />}>
        <BottomNav />
      </Suspense>
    </div>
  )
}
