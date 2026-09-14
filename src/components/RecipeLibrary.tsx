import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useRecipes } from '../hooks/useRecipes'
import { MEAL_CATEGORIES } from '../types/recipe'
import type { MealCategory, Recipe } from '../types/recipe'
import { RecipeCard } from './RecipeCard'
import { RecipeDetailModal } from './RecipeDetailModal'

type CategoryFilter = MealCategory | 'Wszystkie'

export const RecipeLibrary = () => {
  const { recipes } = useRecipes()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Wszystkie')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Recipe | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    recipes.forEach((r) => r.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pl'))
  }, [recipes])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return recipes.filter((recipe) => {
      if (category !== 'Wszystkie' && recipe.category !== category) return false
      if (activeTag && !recipe.tags.includes(activeTag)) return false
      if (query) {
        const haystack = [
          recipe.title,
          ...recipe.tags,
          ...recipe.ingredients.map((i) => i.name),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [recipes, search, category, activeTag])

  return (
    <div>
      {/* Nagłówek */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Baza przepisów</h2>
        <p className="text-sm text-slate-500">
          {recipes.length} {recipes.length === 1 ? 'przepis' : 'przepisów'} w
          bazie
        </p>
      </div>

      {/* Filtry */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj po nazwie, składniku lub tagu…"
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['Wszystkie', ...MEAL_CATEGORIES] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                category === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded-md px-2 py-0.5 text-xs transition ${
                  activeTag === tag
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center text-slate-500">
          Brak przepisów spełniających kryteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onView={setViewing} />
          ))}
        </div>
      )}

      <RecipeDetailModal recipe={viewing} onClose={() => setViewing(null)} />
    </div>
  )
}
