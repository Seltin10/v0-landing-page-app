"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function claimCoupon(userId: string, couponId: number) {
  try {
    // Check if coupon is still available
    const coupon = await sql`
      SELECT id, current_redemptions, max_redemptions, valid_until
      FROM public.coupons
      WHERE id = ${couponId}
        AND is_active = true
        AND valid_until >= CURRENT_DATE
        AND current_redemptions < max_redemptions
    `

    if (coupon.length === 0) {
      return { error: "Cupom não disponível" }
    }

    // Check if user already claimed this coupon
    const existing = await sql`
      SELECT id FROM public.user_coupons
      WHERE user_id = ${userId} AND coupon_id = ${couponId}
    `

    if (existing.length > 0) {
      return { error: "Você já resgatou este cupom" }
    }

    // Generate redemption code
    const code = generateRedemptionCode()

    // Create user coupon
    await sql`
      INSERT INTO public.user_coupons (user_id, coupon_id, redemption_code, status)
      VALUES (${userId}, ${couponId}, ${code}, 'available')
    `

    // Update coupon redemption count
    await sql`
      UPDATE public.coupons
      SET current_redemptions = current_redemptions + 1
      WHERE id = ${couponId}
    `

    revalidatePath("/rewards")
    return { success: true }
  } catch (error) {
    console.error("[v0] Claim coupon error:", error)
    return { error: "Erro ao resgatar cupom" }
  }
}

function generateRedemptionCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
