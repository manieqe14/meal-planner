import type { ReactNode } from 'react'
import defaultRecipes from '../data/recipes.json'
import type { Recipe } from '../types/recipe'
import { RecipeContext } from './recipeContext'
import type { RecipeContextValue } from './recipeContext'

const RECIPES = defaultRecipes as Recipe[]
const RECIPE_BY_ID = new Map(RECIPES.map((recipe) => [recipe.id, recipe]))

const recipeContextValue: RecipeContextValue = {
  recipes: RECIPES,
  getRecipeById: (id) => RECIPE_BY_ID.get(id),
}

export const RecipeProvider = ({ children }: { children: ReactNode }) => (
  <RecipeContext value={recipeContextValue}>{children}</RecipeContext>
)
