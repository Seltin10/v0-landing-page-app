"use server"

import { cookies } from "next/headers"
import { sql } from "./db"
import { redirect } from "next/navigation"

export async function partnerSignIn(formData: FormData) {
  const cnpj = formData.get("cnpj") as string
  const email = formData.get("email") as string

  if (!cnpj || !email) {
    return { error: "CNPJ e email são obrigatórios" }
  }

  try {
    // Find partner
    const result = await sql`
      SELECT id, name, cnpj, email, is_active
      FROM public.partners
      WHERE cnpj = ${cnpj} AND email = ${email}
    `

    if (result.length === 0) {
      return { error: "Parceiro não encontrado" }
    }

    const partner = result[0]

    if (!partner.is_active) {
      return { error: "Parceiro inativo. Entre em contato com o suporte." }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("partner_session", JSON.stringify(partner), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return { success: true, partner }
  } catch (error) {
    console.error("[v0] Partner signin error:", error)
    return { error: "Erro ao fazer login" }
  }
}

export async function partnerSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete("partner_session")
  redirect("/partner/login")
}
