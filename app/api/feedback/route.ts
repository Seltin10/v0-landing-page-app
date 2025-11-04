import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      motivationScale,
      rewardRanking,
      valuePerception,
      partnerImportance,
      easeOfUse,
      favoriteFeature,
      improvementSuggestion,
      paymentWillingness,
      acceptablePriceRange,
      competitorComparison,
      uniqueFeature,
      recommendationLikelihood,
      usageFrequency,
    } = body

    await sql`
      CREATE TABLE IF NOT EXISTS public.user_feedback (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        motivation_scale INTEGER CHECK (motivation_scale BETWEEN 1 AND 5),
        reward_ranking JSONB,
        value_perception INTEGER CHECK (value_perception BETWEEN 1 AND 5),
        partner_importance INTEGER CHECK (partner_importance BETWEEN 1 AND 5),
        ease_of_use INTEGER CHECK (ease_of_use BETWEEN 1 AND 5),
        favorite_feature TEXT,
        improvement_suggestion TEXT,
        payment_willingness VARCHAR(50),
        acceptable_price_range VARCHAR(50),
        competitor_comparison TEXT,
        unique_feature TEXT,
        recommendation_likelihood INTEGER CHECK (recommendation_likelihood BETWEEN 0 AND 10),
        usage_frequency VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      )
    `

    // Check if user already submitted feedback
    const existing = await sql`
      SELECT id FROM public.user_feedback
      WHERE user_id = ${session.id}
    `

    if (existing.length > 0) {
      // Update existing feedback
      await sql`
        UPDATE public.user_feedback
        SET 
          motivation_scale = ${motivationScale},
          reward_ranking = ${JSON.stringify(rewardRanking)},
          value_perception = ${valuePerception},
          partner_importance = ${partnerImportance},
          ease_of_use = ${easeOfUse},
          favorite_feature = ${favoriteFeature || null},
          improvement_suggestion = ${improvementSuggestion || null},
          payment_willingness = ${paymentWillingness},
          acceptable_price_range = ${acceptablePriceRange},
          competitor_comparison = ${competitorComparison || null},
          unique_feature = ${uniqueFeature || null},
          recommendation_likelihood = ${recommendationLikelihood},
          usage_frequency = ${usageFrequency}
        WHERE user_id = ${session.id}
      `
    } else {
      // Insert new feedback
      await sql`
        INSERT INTO public.user_feedback (
          user_id,
          motivation_scale,
          reward_ranking,
          value_perception,
          partner_importance,
          ease_of_use,
          favorite_feature,
          improvement_suggestion,
          payment_willingness,
          acceptable_price_range,
          competitor_comparison,
          unique_feature,
          recommendation_likelihood,
          usage_frequency
        ) VALUES (
          ${session.id},
          ${motivationScale},
          ${JSON.stringify(rewardRanking)},
          ${valuePerception},
          ${partnerImportance},
          ${easeOfUse},
          ${favoriteFeature || null},
          ${improvementSuggestion || null},
          ${paymentWillingness},
          ${acceptablePriceRange},
          ${competitorComparison || null},
          ${uniqueFeature || null},
          ${recommendationLikelihood},
          ${usageFrequency}
        )
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
