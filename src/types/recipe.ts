/**
 * Kategorie posiłków dostępne w aplikacji.
 */
export const MEAL_CATEGORIES = [
  'Śniadanie',
  'Obiad',
  'Kolacja',
  'Przekąska',
] as const

export type MealCategory = (typeof MEAL_CATEGORIES)[number]

/**
 * Pojedynczy składnik przepisu.
 */
export interface Ingredient {
  name: string
  amount: number
  unit: string
}

/**
 * Makroskładniki (w gramach), opcjonalne dla przepisu.
 */
export interface Macros {
  protein: number
  carbs: number
  fat: number
}

/**
 * Pełny przepis kulinarny.
 */
export interface Recipe {
  id: string
  title: string
  category: MealCategory
  prepTimeMinutes: number
  servings: number
  calories?: number
  macros?: Macros
  ingredients: Ingredient[]
  instructions: string[]
  tags: string[]
}
