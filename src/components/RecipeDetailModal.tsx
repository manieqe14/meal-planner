import { Clock, Flame, Users } from 'lucide-react'
import type { Recipe } from '../types/recipe'
import { CATEGORY_BADGE } from '../utils/categoryStyles'
import { Modal } from './Modal'

interface RecipeDetailModalProps {
  recipe: Recipe | null
  onClose: () => void
}

export const RecipeDetailModal = ({
  recipe,
  onClose,
}: RecipeDetailModalProps) => {
  if (!recipe) return null

  return (
    <Modal open={!!recipe} onClose={onClose} title={recipe.title}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${CATEGORY_BADGE[recipe.category]}`}
          >
            {recipe.category}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <Clock className="h-4 w-4" /> {recipe.prepTimeMinutes} min
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <Users className="h-4 w-4" /> {recipe.servings} porcji
          </span>
          {recipe.calories != null && (
            <span className="inline-flex items-center gap-1 text-sm text-slate-500">
              <Flame className="h-4 w-4" /> {recipe.calories} kcal / porcja
            </span>
          )}
        </div>

        {recipe.macros && (
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ['Białko', recipe.macros.protein],
                ['Węglowodany', recipe.macros.carbs],
                ['Tłuszcz', recipe.macros.fat],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100"
              >
                <div className="text-lg font-semibold text-slate-900">
                  {value} g
                </div>
                <div className="text-xs text-slate-500">{label} / porcja</div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Składniki
          </h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-dashed border-slate-100 py-1 text-sm text-slate-700"
              >
                <span>{ing.name}</span>
                <span className="text-slate-500">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Przygotowanie
          </h3>
          <ol className="space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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
    </Modal>
  )
}
