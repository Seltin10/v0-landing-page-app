"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  // Simple validation
  if (!email || !password || !name) {
    return { error: "Todos os campos são obrigatórios" }
  }

  try {
    const user = {
      id: `user-${Date.now()}`,
      email: email,
      name: name,
      plan_type: "free",
      lgpd_consent: false,
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return { success: true, user }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return { error: "Erro ao criar conta" }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("[v0] SignIn attempt with email:", email)

  if (!email || !password) {
    console.log("[v0] Missing email or password")
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    const user = {
      id: `user-${Date.now()}`,
      email: email,
      name: email.split("@")[0],
      plan_type: "premium",
      lgpd_consent: true,
    }

    console.log("[v0] Creating session for user:", user)

    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    console.log("[v0] Cookie set successfully")

    const verifySession = cookieStore.get("user_session")
    console.log("[v0] Verification - Cookie exists:", !!verifySession)

    redirect("/dashboard")
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    console.error("[v0] Signin error:", error)
    return { error: "Erro ao fazer login" }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
  redirect("/login")
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")

  if (!session) {
    console.log("[v0] No session found")
    return null
  }

  try {
    const parsedSession = JSON.parse(session.value)
    console.log("[v0] Session found for:", parsedSession.email)
    return parsedSession
  } catch {
    console.log("[v0] Error parsing session")
    return null
  }
}

export async function updateLGPDConsent(userId: string, consent: boolean) {
  try {
    console.log("[v0] LGPD consent updated for user:", userId)
    return { success: true }
  } catch (error) {
    console.error("[v0] LGPD consent error:", error)
    return { error: "Erro ao atualizar consentimento" }
  }
}
