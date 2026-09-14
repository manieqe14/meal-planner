import { CALORIE_TOLERANCE, PLAN_SLOTS } from '../constants'
import type { DayPlan, Person } from '../types/planner'
import type { Recipe } from '../types/recipe'

type RecipeResolver = (id: string) => Recipe | undefined

/** Najwyższy cel kaloryczny spośród osób (punkt odniesienia proporcji). */
const maxTarget = (people: Person[]) =>
  people.reduce((max, person) => Math.max(max, person.dailyCalorieTarget), 0)

/** Współczynnik proporcji osoby względem osoby o najwyższym celu (0..1). */
export const portionFactor = (person: Person, people: Person[]) => {
  const top = maxTarget(people)
  return top > 0 ? person.dailyCalorieTarget / top : 0
}

/** Porcje danej osoby dla posiłku o zadanej porcji bazowej. */
export const personPortions = (
  basePortions: number,
  person: Person,
  people: Person[],
) => basePortions * portionFactor(person, people)

/** Kalorie posiłku = kcal przepisu (na porcję) × liczba porcji. */
export const mealCalories = (recipe: Recipe | undefined, portions: number) =>
  recipe?.calories != null ? recipe.calories * portions : 0

/** Suma kalorii dla osoby w danym dniu (porcje proporcjonalne do celu). */
export const dailyCaloriesForPerson = (
  day: DayPlan,
  person: Person,
  people: Person[],
  getRecipeById: RecipeResolver,
) =>
  PLAN_SLOTS.reduce((total, slot) => {
    const meal = day.meals[slot]
    const recipe = meal.recipeId ? getRecipeById(meal.recipeId) : undefined
    const portions = personPortions(meal.basePortions, person, people)
    return total + mealCalories(recipe, portions)
  }, 0)

export type CalorieStatus = 'under' | 'on-target' | 'over'

/** Klasyfikuje sumę kalorii względem celu (z tolerancją). */
export const calorieStatus = (total: number, target: number): CalorieStatus => {
  if (total < target - CALORIE_TOLERANCE) return 'under'
  if (total > target + CALORIE_TOLERANCE) return 'over'
  return 'on-target'
}
