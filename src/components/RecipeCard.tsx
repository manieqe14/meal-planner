import { Clock, Flame, Users } from 'lucide-react'
import type { Recipe } from '../types/recipe'
import { CATEGORY_BADGE } from '../utils/categoryStyles'

interface RecipeCardProps {
  recipe: Recipe
  onView: (recipe: Recipe) => void
}

export const RecipeCard = ({ recipe, onView }: RecipeCardProps) => {
  return (
    <div className="group flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${CATEGORY_BADGE[recipe.category]}`}
        >
          {recipe.category}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onView(recipe)}
        className="mb-3 text-left text-lg font-semibold text-slate-900 transition hover:text-emerald-700"
      >
        {recipe.title}
      </button>

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-4 w-4" /> {recipe.prepTimeMinutes} min
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4" /> {recipe.servings} porcji
        </span>
        {recipe.calories != null && (
          <span className="inline-flex items-center gap-1">
            <Flame className="h-4 w-4" /> {recipe.calories} kcal
          </span>
        )}
      </div>

      {recipe.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
