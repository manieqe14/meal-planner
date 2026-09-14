import { usePlanner } from '../hooks/usePlanner'
import type { Person, PlannedMeal } from '../types/planner'
import type { MealCategory, Recipe } from '../types/recipe'
import { CATEGORY_BADGE } from '../utils/categoryStyles'
import { roundTo } from '../utils/number'
import { mealCalories, personPortions } from '../utils/nutrition'
import { PortionStepper } from './PortionStepper'

interface MealSlotRowProps {
  dayIndex: number
  slot: MealCategory
  meal: PlannedMeal
  people: Person[]
  options: Recipe[]
}

export const MealSlotRow = ({
  dayIndex,
  slot,
  meal,
  people,
  options,
}: MealSlotRowProps) => {
  const { setMeal, setMealPortions } = usePlanner()
  const recipe = options.find((r) => r.id === meal.recipeId)

  return (
    <div>
      <span
        className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${CATEGORY_BADGE[slot]}`}
      >
        {slot}
      </span>
      <select
        value={meal.recipeId ?? ''}
        onChange={(e) => setMeal(dayIndex, slot, e.target.value || null)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      >
        <option value="">— brak —</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
            {option.calories != null ? ` (${option.calories} kcal/porcja)` : ''}
          </option>
        ))}
      </select>

      {meal.recipeId && (
        <div className="mt-1.5 space-y-1.5">
          <PortionStepper
            label="Porcje"
            value={meal.basePortions}
            onChange={(value) => setMealPortions(dayIndex, slot, value)}
          />
          <div className="space-y-0.5 px-1">
            {people.map((person) => {
              const portions = personPortions(meal.basePortions, person, people)
              return (
                <div
                  key={person.id}
                  className="flex justify-between text-[11px] text-slate-500"
                >
                  <span>{person.name}</span>
                  <span className="tabular-nums">
                    {roundTo(portions, 2)} porcji ·{' '}
                    {roundTo(mealCalories(recipe, portions))} kcal
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
