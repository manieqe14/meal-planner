import { useContext } from 'react'
import { RecipeContext } from '../context/recipeContext'
import type { RecipeContextValue } from '../context/recipeContext'

/**
 * Zwraca API do zarządzania bazą przepisów.
 * Musi być użyty wewnątrz <RecipeProvider>.
 */
export const useRecipes = (): RecipeContextValue => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipes musi być użyty wewnątrz <RecipeProvider>.')
  }
  return context
}
