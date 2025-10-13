import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignupForm } from "@/components/signup-form"
import { Suspense } from "react"

export default async function SignupPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2396] to-[#d9a520] p-4">
      <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-white/10 rounded-lg" />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
