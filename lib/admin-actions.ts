"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function createPartner(formData: FormData) {
  const name = formData.get("name") as string
  const cnpj = formData.get("cnpj") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const category = formData.get("category") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string

  if (!name || !cnpj || !email) {
    return { error: "Nome, CNPJ e email são obrigatórios" }
  }

  try {
    // Check if CNPJ already exists
    const existing = await sql`
      SELECT id FROM public.partners WHERE cnpj = ${cnpj}
    `

    if (existing.length > 0) {
      return { error: "CNPJ já cadastrado" }
    }

    await sql`
      INSERT INTO public.partners (name, cnpj, email, phone, category, address, city, state)
      VALUES (${name}, ${cnpj}, ${email}, ${phone || null}, ${category || null}, ${address || null}, ${city || null}, ${state || null})
    `

    revalidatePath("/admin/partners")
    return { success: true }
  } catch (error) {
    console.error("[v0] Create partner error:", error)
    return { error: "Erro ao criar parceiro" }
  }
}
