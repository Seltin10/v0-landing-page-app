"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Target, Store, Wallet, Users } from "lucide-react"
import { Suspense } from "react"

function BottomNavContent() {
  const pathname = usePathname()

  const navItems = [
    { href: "/profile", icon: User, label: "Perfil" },
    { href: "/dashboard", icon: Target, label: "Metas" },
    { href: "/partners", icon: Store, label: "Parceiros" },
    { href: "/rewards", icon: Wallet, label: "Carteira" },
    { href: "/communities", icon: Users, label: "Grupos" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/goals")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? "text-[#0b2396]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function BottomNav() {
  return (
    <Suspense
      fallback={
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-inset-bottom">
          <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto" />
        </nav>
      }
    >
      <BottomNavContent />
    </Suspense>
  )
}
