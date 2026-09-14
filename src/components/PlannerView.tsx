import { useMemo, useState } from 'react'
import { Download, RotateCcw, Settings, Target, Upload } from 'lucide-react'
import { WEEK_DAYS, WEEKS_IN_CYCLE } from '../constants'
import { usePlanner } from '../hooks/usePlanner'
import { useRecipes } from '../hooks/useRecipes'
import type { MealCategory, Recipe } from '../types/recipe'
import { DayCard } from './DayCard'
import { PeopleSettingsModal } from './PeopleSettingsModal'

export const PlannerView = () => {
  const { people, exportState, importState, resetState } = usePlanner()
  const { recipes } = useRecipes()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const recipesByCategory = useMemo(
    () =>
      recipes.reduce(
        (map, recipe) =>
          new Map(map).set(recipe.category, [
            ...(map.get(recipe.category) ?? []),
            recipe,
          ]),
        new Map<MealCategory, Recipe[]>(),
      ),
    [recipes],
  )

  const weeks = Array.from({ length: WEEKS_IN_CYCLE }, (_, index) => index)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Planer 2-tygodniowy
          </h2>
          <p className="text-sm text-slate-500">
            Dobierz dania i porcje tak, aby trafić w dzienny cel kaloryczny.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportState}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" /> Eksport
          </button>
          <button
            type="button"
            onClick={importState}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Upload className="h-4 w-4" /> Import
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Zresetować cały plan i przywrócić domyślne osoby?',
                )
              ) {
                resetState()
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Settings className="h-4 w-4" /> Osoby i cele
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {people.map((person) => (
          <span
            key={person.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-slate-200"
          >
            <Target className="h-4 w-4 text-emerald-600" />
            {person.name}: {person.dailyCalorieTarget} kcal
          </span>
        ))}
      </div>

      <div className="space-y-8">
        {weeks.map((week) => (
          <section key={week}>
            <h3 className="mb-3 text-lg font-semibold text-slate-800">
              Tydzień {week + 1}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {WEEK_DAYS.map((label, dayOfWeek) => {
                const dayIndex = week * WEEK_DAYS.length + dayOfWeek
                return (
                  <DayCard
                    key={dayIndex}
                    dayIndex={dayIndex}
                    label={label}
                    people={people}
                    recipesByCategory={recipesByCategory}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <PeopleSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
