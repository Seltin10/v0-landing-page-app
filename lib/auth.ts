"use server"

import { cookies } from "next/headers"
import { sql } from "./db"
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
    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM public.users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { error: "Email já cadastrado" }
    }

    // Create user (in production, hash the password!)
    const result = await sql`
      INSERT INTO public.users (id, email, name, plan_type)
      VALUES (gen_random_uuid()::text, ${email}, ${name}, 'free')
      RETURNING id, email, name
    `

    const user = result[0]

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

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    // Find user (in production, verify hashed password!)
    const result = await sql`
      SELECT id, email, name, plan_type, lgpd_consent
      FROM public.users
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return { error: "Email ou senha incorretos" }
    }

    const user = result[0]

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return { success: true, user }
  } catch (error) {
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

  if (!session) return null

  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function updateLGPDConsent(userId: string, consent: boolean) {
  try {
    await sql`
      UPDATE public.users
      SET lgpd_consent = ${consent},
          lgpd_consent_date = NOW()
      WHERE id = ${userId}
    `
    return { success: true }
  } catch (error) {
    console.error("[v0] LGPD consent error:", error)
    return { error: "Erro ao atualizar consentimento" }
  }
}
