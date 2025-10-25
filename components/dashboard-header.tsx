import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  email: string
  plan_type: string
}

export function DashboardHeader({ user }: { user: User }) {
  const planLabels: Record<string, string> = {
    free: "Gratuito",
    basic: "Básico",
    premium: "Premium",
    sports: "iRun Sports",
  }

  const planColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    free: "outline",
    basic: "secondary",
    premium: "default",
    sports: "destructive",
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo-irun.png" alt="iRun" width={40} height={40} className="rounded-lg" />
          </Link>

          {/* User Info and Actions */}
          <div className="flex items-center gap-2">
            <Badge variant={planColors[user.plan_type] || "outline"} className="hidden sm:inline-flex text-xs">
              {planLabels[user.plan_type] || "Gratuito"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-2 gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-to-br from-[#0b2396] to-[#d9a520] text-white text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">{user.name.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 border-b">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant={planColors[user.plan_type] || "outline"} className="mt-2 text-xs">
                    {planLabels[user.plan_type] || "Gratuito"}
                  </Badge>
                </div>
                <DropdownMenuItem asChild>
                  <form action={signOut} className="w-full">
                    <Button variant="ghost" size="sm" type="submit" className="w-full justify-start px-2">
                      Sair
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
