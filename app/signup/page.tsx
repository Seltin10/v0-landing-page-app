import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignupForm } from "@/components/signup-form"

export default async function SignupPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2396] to-[#d9a520] p-4">
      <SignupForm />
    </div>
  )
}
