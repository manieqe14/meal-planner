import { createContext } from 'react'
import type { CyclePlan, Person, ShoppingItem } from '../types/planner'
import type { MealCategory } from '../types/recipe'

export interface PlannerContextValue {
  people: Person[]
  cyclePlan: CyclePlan
  /** Aktualizuje dane osoby (nazwa / cel kaloryczny). */
  updatePerson: (id: string, updates: Partial<Omit<Person, 'id'>>) => void
  /** Ustawia (lub czyści) danie w danym slocie dnia. */
  setMeal: (
    dayIndex: number,
    slot: MealCategory,
    recipeId: string | null,
  ) => void
  /** Ustawia porcję bazową posiłku (porcje osób wyliczane proporcjonalnie). */
  setMealPortions: (
    dayIndex: number,
    slot: MealCategory,
    basePortions: number,
  ) => void
  /** Suma kalorii osoby w danym dniu. */
  dailyCalories: (dayIndex: number, personId: string) => number
  /** Lista zakupów dla wskazanego tygodnia cyklu (0 = pierwszy). */
  shoppingListForWeek: (weekIndex: number) => ShoppingItem[]
  /** Eksportuje stan aplikacji (osoby + plan) jako plik .json. */
  exportState: () => void
  /** Importuje stan aplikacji z pliku .json. */
  importState: () => Promise<void>
  /** Czyści cały plan i przywraca domyślne osoby. */
  resetState: () => void
}

export const PlannerContext = createContext<PlannerContextValue | null>(null)
