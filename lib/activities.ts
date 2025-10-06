"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function addActivity(formData: FormData) {
  const userId = formData.get("userId") as string
  const activityType = formData.get("activity_type") as string
  const distance = Number.parseFloat(formData.get("distance") as string)
  const duration = Number.parseInt(formData.get("duration") as string)
  const calories = formData.get("calories") ? Number.parseInt(formData.get("calories") as string) : null
  const date = formData.get("date") as string

  if (!userId || !activityType || !distance || !duration || !date) {
    return { error: "Todos os campos obrigatórios devem ser preenchidos" }
  }

  if (!["running", "cycling", "swimming"].includes(activityType)) {
    return { error: "Tipo de atividade inválido" }
  }

  try {
    await sql`
      INSERT INTO public.activities (user_id, activity_type, distance_km, duration_minutes, calories_burned, date, source)
      VALUES (${userId}, ${activityType}, ${distance}, ${duration}, ${calories}, ${date}, 'manual')
    `

    // Update goal progress
    await updateGoalProgress(userId, activityType, distance, calories || 0, date)

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Add activity error:", error)
    return { error: "Erro ao registrar atividade" }
  }
}

async function updateGoalProgress(
  userId: string,
  activityType: string,
  distance: number,
  calories: number,
  activityDate: string,
) {
  const date = new Date(activityDate)

  // Update daily goals
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  await updateGoalsForPeriod(userId, activityType, distance, calories, "daily", dayStart, dayEnd)

  // Update weekly goals
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - date.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  await updateGoalsForPeriod(userId, activityType, distance, calories, "weekly", weekStart, weekEnd)

  // Update monthly goals
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

  await updateGoalsForPeriod(userId, activityType, distance, calories, "monthly", monthStart, monthEnd)

  // Update caloric goals (cumulative)
  await updateCaloricGoals(userId, calories)
}

async function updateGoalsForPeriod(
  userId: string,
  activityType: string,
  distance: number,
  calories: number,
  goalType: string,
  periodStart: Date,
  periodEnd: Date,
) {
  // Get applicable goals
  const goals = await sql`
    SELECT id, target_value, target_unit, activity_type
    FROM public.goals
    WHERE goal_type = ${goalType}
      AND is_active = true
      AND (activity_type = ${activityType} OR activity_type = 'any')
  `

  for (const goal of goals) {
    const value = goal.target_unit === "km" ? distance : calories

    // Upsert progress
    await sql`
      INSERT INTO public.user_goal_progress (user_id, goal_id, period_start, period_end, current_value, target_value)
      VALUES (${userId}, ${goal.id}, ${periodStart.toISOString()}, ${periodEnd.toISOString()}, ${value}, ${goal.target_value})
      ON CONFLICT (user_id, goal_id, period_start)
      DO UPDATE SET 
        current_value = user_goal_progress.current_value + ${value},
        is_completed = (user_goal_progress.current_value + ${value}) >= ${goal.target_value},
        completed_at = CASE 
          WHEN (user_goal_progress.current_value + ${value}) >= ${goal.target_value} AND user_goal_progress.completed_at IS NULL
          THEN NOW()
          ELSE user_goal_progress.completed_at
        END
    `
  }
}

async function updateCaloricGoals(userId: string, calories: number) {
  const goals = await sql`
    SELECT id, target_value
    FROM public.goals
    WHERE goal_type = 'caloric'
      AND is_active = true
  `

  for (const goal of goals) {
    // Check if progress exists
    const existing = await sql`
      SELECT id, current_value
      FROM public.user_goal_progress
      WHERE user_id = ${userId}
        AND goal_id = ${goal.id}
        AND is_completed = false
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (existing.length > 0) {
      const newValue = Number(existing[0].current_value) + calories
      await sql`
        UPDATE public.user_goal_progress
        SET current_value = ${newValue},
            is_completed = ${newValue} >= ${goal.target_value},
            completed_at = CASE 
              WHEN ${newValue} >= ${goal.target_value} THEN NOW()
              ELSE completed_at
            END
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO public.user_goal_progress (user_id, goal_id, period_start, period_end, current_value, target_value)
        VALUES (${userId}, ${goal.id}, NOW(), NOW() + INTERVAL '1 year', ${calories}, ${goal.target_value})
      `
    }
  }
}
