import { PLAN_SLOTS } from '../constants'
import type { CyclePlan, Person, ShoppingItem } from '../types/planner'
import type { Recipe } from '../types/recipe'
import { normalizeIngredient } from './normalizeIngredient'
import { roundTo } from './number'
import { personPortions } from './nutrition'

type RecipeResolver = (id: string) => Recipe | undefined

const itemKey = (name: string, unit: string) =>
  `${name.trim().toLowerCase()}|${unit.trim().toLowerCase()}`

/** Łączna liczba porcji danego posiłku (suma proporcjonalnych porcji osób). */
const totalServings = (basePortions: number, people: Person[]) =>
  people.reduce(
    (sum, person) => sum + personPortions(basePortions, person, people),
    0,
  )

/**
 * Buduje listę zakupów dla podanych dni: agreguje składniki wszystkich
 * zaplanowanych posiłków, skalując je przez łączną liczbę porcji obu osób
 * oraz bazową liczbę porcji przepisu.
 */
export const buildShoppingList = (
  days: CyclePlan,
  people: Person[],
  getRecipeById: RecipeResolver,
): ShoppingItem[] => {
  const totals = days.reduce(
    (dayAcc, day) =>
      PLAN_SLOTS.reduce((slotAcc, slot) => {
        const meal = day.meals[slot]
        const recipe = meal.recipeId ? getRecipeById(meal.recipeId) : undefined
        const servings = recipe ? totalServings(meal.basePortions, people) : 0
        if (!recipe || servings <= 0) return slotAcc

        return recipe.ingredients.reduce((ingAcc, ing) => {
          const normalized = normalizeIngredient(ing)
          if (!normalized) return ingAcc

          const perServing = normalized.amount / (recipe.servings || 1)
          const addition = perServing * servings
          const key = itemKey(normalized.name, normalized.unit)
          const existing = ingAcc.get(key)
          const next: ShoppingItem = existing
            ? { ...existing, amount: existing.amount + addition }
            : { name: normalized.name, unit: normalized.unit, amount: addition }
          return new Map(ingAcc).set(key, next)
        }, slotAcc)
      }, dayAcc),
    new Map<string, ShoppingItem>(),
  )

  return Array.from(totals.values())
    .map((item) => ({ ...item, amount: roundTo(item.amount, 2) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
}

/**
 * Reprezentacja tekstowa gotowa do wklejenia do Todoist:
 * jedna pozycja w linii, bez znaczników (Todoist tworzy zadanie z każdej linii).
 */
export const shoppingListToText = (items: ShoppingItem[]) =>
  items
    .map((item) => {
      const quantity = `${item.amount} ${item.unit}`.trim()
      return quantity ? `${item.name} – ${quantity}` : item.name
    })
    .join('\n')
