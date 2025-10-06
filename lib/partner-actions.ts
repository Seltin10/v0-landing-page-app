"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function validateCoupon(formData: FormData) {
  const code = (formData.get("code") as string).toUpperCase().trim()
  const partnerId = Number.parseInt(formData.get("partnerId") as string)

  if (!code || !partnerId) {
    return { error: "Código e parceiro são obrigatórios" }
  }

  try {
    // Find coupon by redemption code
    const result = await sql`
      SELECT 
        uc.id,
        uc.user_id,
        uc.coupon_id,
        uc.status,
        c.title as coupon_title,
        c.discount_type,
        c.discount_value,
        c.partner_id,
        c.valid_until,
        u.name as user_name
      FROM public.user_coupons uc
      JOIN public.coupons c ON uc.coupon_id = c.id
      JOIN public.users u ON uc.user_id = u.id
      WHERE uc.redemption_code = ${code}
    `

    if (result.length === 0) {
      return { error: "Código de cupom inválido" }
    }

    const coupon = result[0]

    // Check if coupon belongs to this partner
    if (coupon.partner_id !== partnerId) {
      return { error: "Este cupom não pertence ao seu estabelecimento" }
    }

    // Check if already used
    if (coupon.status === "used") {
      return { error: "Este cupom já foi utilizado" }
    }

    // Check if expired
    if (new Date(coupon.valid_until) < new Date()) {
      await sql`
        UPDATE public.user_coupons
        SET status = 'expired'
        WHERE id = ${coupon.id}
      `
      return { error: "Este cupom está expirado" }
    }

    // Mark as used
    await sql`
      UPDATE public.user_coupons
      SET status = 'used',
          used_at = NOW(),
          validated_by = ${partnerId}
      WHERE id = ${coupon.id}
    `

    revalidatePath("/partner")
    return {
      success: true,
      coupon: {
        user_name: coupon.user_name,
        coupon_title: coupon.coupon_title,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
    }
  } catch (error) {
    console.error("[v0] Validate coupon error:", error)
    return { error: "Erro ao validar cupom" }
  }
}
