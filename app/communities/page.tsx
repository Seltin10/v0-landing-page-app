import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Target, Ticket, Medal, Crown, Plus, UserPlus } from "lucide-react"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const COMPANY_GROUPS = [
  {
    id: 1,
    name: "Tech Runners",
    company: "TechCorp Brasil",
    memberCount: 24,
    members: [
      { id: 1, name: "Carlos Silva", goalsCompleted: 45, couponsRedeemed: 12, initials: "CS" },
      { id: 2, name: "Ana Santos", goalsCompleted: 42, couponsRedeemed: 15, initials: "AS" },
      { id: 3, name: "Pedro Costa", goalsCompleted: 38, couponsRedeemed: 10, initials: "PC" },
      { id: 4, name: "Maria Oliveira", goalsCompleted: 35, couponsRedeemed: 14, initials: "MO" },
      { id: 5, name: "João Ferreira", goalsCompleted: 32, couponsRedeemed: 9, initials: "JF" },
      { id: 6, name: "Juliana Lima", goalsCompleted: 28, couponsRedeemed: 11, initials: "JL" },
      { id: 7, name: "Rafael Souza", goalsCompleted: 25, couponsRedeemed: 8, initials: "RS" },
      { id: 8, name: "Beatriz Alves", goalsCompleted: 22, couponsRedeemed: 13, initials: "BA" },
    ],
  },
  {
    id: 2,
    name: "Finance Runners",
    company: "Banco Nacional",
    memberCount: 18,
    members: [
      { id: 9, name: "Lucas Martins", goalsCompleted: 50, couponsRedeemed: 18, initials: "LM" },
      { id: 10, name: "Fernanda Rocha", goalsCompleted: 47, couponsRedeemed: 16, initials: "FR" },
      { id: 11, name: "Ricardo Dias", goalsCompleted: 40, couponsRedeemed: 14, initials: "RD" },
      { id: 12, name: "Camila Nunes", goalsCompleted: 36, couponsRedeemed: 12, initials: "CN" },
      { id: 13, name: "Bruno Cardoso", goalsCompleted: 33, couponsRedeemed: 10, initials: "BC" },
      { id: 14, name: "Patricia Gomes", goalsCompleted: 30, couponsRedeemed: 15, initials: "PG" },
      { id: 15, name: "Thiago Barbosa", goalsCompleted: 27, couponsRedeemed: 9, initials: "TB" },
    ],
  },
  {
    id: 3,
    name: "Health Team",
    company: "Hospital São Lucas",
    memberCount: 15,
    members: [
      { id: 16, name: "Daniela Mendes", goalsCompleted: 48, couponsRedeemed: 20, initials: "DM" },
      { id: 17, name: "Rodrigo Pinto", goalsCompleted: 44, couponsRedeemed: 17, initials: "RP" },
      { id: 18, name: "Amanda Reis", goalsCompleted: 41, couponsRedeemed: 13, initials: "AR" },
      { id: 19, name: "Felipe Araujo", goalsCompleted: 37, couponsRedeemed: 11, initials: "FA" },
      { id: 20, name: "Larissa Moura", goalsCompleted: 34, couponsRedeemed: 16, initials: "LM" },
      { id: 21, name: "Gabriel Castro", goalsCompleted: 29, couponsRedeemed: 8, initials: "GC" },
    ],
  },
  {
    id: 4,
    name: "Startup Squad",
    company: "InovaTech",
    memberCount: 12,
    members: [
      { id: 22, name: "Isabela Freitas", goalsCompleted: 39, couponsRedeemed: 19, initials: "IF" },
      { id: 23, name: "Marcelo Teixeira", goalsCompleted: 36, couponsRedeemed: 14, initials: "MT" },
      { id: 24, name: "Vanessa Correia", goalsCompleted: 31, couponsRedeemed: 12, initials: "VC" },
      { id: 25, name: "Diego Monteiro", goalsCompleted: 28, couponsRedeemed: 10, initials: "DM" },
      { id: 26, name: "Priscila Vieira", goalsCompleted: 24, couponsRedeemed: 15, initials: "PV" },
    ],
  },
]

const getRankBadge = (rank: number) => {
  if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />
  if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />
  if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />
  return null
}

export default async function CommunitiesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen pb-20 bg-indigo-50">
      <DashboardHeader user={session} />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl mb-1 font-semibold">Comunidades</h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Grupos de corrida de empresas e rankings
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              Criar Grupo
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar Amigos
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {COMPANY_GROUPS.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{group.company}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {group.memberCount} membros
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="goals" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="goals" className="text-xs sm:text-sm">
                      <Target className="h-4 w-4 mr-1" />
                      Metas
                    </TabsTrigger>
                    <TabsTrigger value="coupons" className="text-xs sm:text-sm">
                      <Ticket className="h-4 w-4 mr-1" />
                      Cupons
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="goals" className="space-y-2 mt-4">
                    {[...group.members]
                      .sort((a, b) => b.goalsCompleted - a.goalsCompleted)
                      .map((member, index) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            index < 3 ? "bg-muted/50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 w-8">
                              {getRankBadge(index + 1) || (
                                <span className="text-sm font-semibold text-muted-foreground">{index + 1}º</span>
                              )}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold">{member.goalsCompleted}</span>
                            <span className="text-xs text-muted-foreground">metas</span>
                          </div>
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="coupons" className="space-y-2 mt-4">
                    {[...group.members]
                      .sort((a, b) => b.couponsRedeemed - a.couponsRedeemed)
                      .map((member, index) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            index < 3 ? "bg-muted/50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 w-8">
                              {getRankBadge(index + 1) || (
                                <span className="text-sm font-semibold text-muted-foreground">{index + 1}º</span>
                              )}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-bold">{member.couponsRedeemed}</span>
                            <span className="text-xs text-muted-foreground">cupons</span>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t" />}>
        <BottomNav />
      </Suspense>
    </div>
  )
}
