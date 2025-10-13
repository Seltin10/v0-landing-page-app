import { PartnerLoginForm } from "@/components/partner-login-form"
import { Suspense } from "react"

export default function PartnerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2396] to-[#d9a520] p-4">
      <Suspense fallback={<div className="text-center text-white">Carregando...</div>}>
        <PartnerLoginForm />
      </Suspense>
    </div>
  )
}
