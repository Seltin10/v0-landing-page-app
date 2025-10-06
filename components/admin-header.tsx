import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { LayoutDashboard, Users, Store, Target, Gift } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

export function AdminHeader({ user }: { user: User }) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#0b2396] to-[#d9a520] bg-clip-text text-transparent">
                iRun Admin
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-sm hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 text-sm hover:text-primary">
                <Users className="h-4 w-4" />
                Usuários
              </Link>
              <Link href="/admin/partners" className="flex items-center gap-2 text-sm hover:text-primary">
                <Store className="h-4 w-4" />
                Parceiros
              </Link>
              <Link href="/admin/goals" className="flex items-center gap-2 text-sm hover:text-primary">
                <Target className="h-4 w-4" />
                Metas
              </Link>
              <Link href="/admin/coupons" className="flex items-center gap-2 text-sm hover:text-primary">
                <Gift className="h-4 w-4" />
                Cupons
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-[#0b2396] to-[#d9a520] text-white">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>

            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
