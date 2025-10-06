import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ConsentForm } from "@/components/consent-form"

export default async function ConsentPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.lgpd_consent) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2396] to-[#d9a520] p-4">
      <ConsentForm userId={session.id} />
    </div>
  )
}
