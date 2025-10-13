import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"
import { Suspense } from "react"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2396] to-[#d9a520] p-4">
      <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-white/10 rounded-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
