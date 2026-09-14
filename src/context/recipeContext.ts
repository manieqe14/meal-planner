import { createContext } from 'react'
import type { Recipe } from '../types/recipe'

/**
 * Wartość udostępniana przez RecipeContext.
 * Baza przepisów jest tylko-do-odczytu i pochodzi z pliku recipes.json.
 */
export interface RecipeContextValue {
  /** Lista przepisów wczytana z bazy. */
  recipes: Recipe[]
  /** Zwraca przepis o podanym id lub undefined. */
  getRecipeById: (id: string) => Recipe | undefined
}

export const RecipeContext = createContext<RecipeContextValue | null>(null)
