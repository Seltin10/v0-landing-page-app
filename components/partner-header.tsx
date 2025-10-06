import { partnerSignOut } from "@/lib/partner-auth"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"

interface Partner {
  id: number
  name: string
  email: string
}

export function PartnerHeader({ partner }: { partner: Partner }) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#0b2396] to-[#d9a520] rounded-lg">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">{partner.name}</p>
              <p className="text-xs text-muted-foreground">Parceiro iRun</p>
            </div>
          </div>

          <form action={partnerSignOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
