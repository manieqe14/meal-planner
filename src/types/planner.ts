import type { MealCategory } from './recipe'

/**
 * Osoba, dla której planujemy posiłki (Ty / żona).
 */
export interface Person {
  id: string
  name: string
  dailyCalorieTarget: number
}

/**
 * Zaplanowany posiłek: jedno wspólne danie oraz porcja bazowa.
 * Porcja każdej osoby wyliczana jest proporcjonalnie do jej celu kalorycznego
 * (osoba o najwyższym celu = mnożnik 1), więc proporcje są zawsze zachowane.
 */
export interface PlannedMeal {
  recipeId: string | null
  basePortions: number
}

export type DayMeals = Record<MealCategory, PlannedMeal>

export interface DayPlan {
  meals: DayMeals
}

/** Plan całego cyklu (14 dni). */
export type CyclePlan = DayPlan[]

/** Zagregowana pozycja listy zakupów. */
export interface ShoppingItem {
  name: string
  unit: string
  amount: number
}
