import { PLAN_SLOTS } from '../constants'
import { usePlanner } from '../hooks/usePlanner'
import type { Person } from '../types/planner'
import type { MealCategory, Recipe } from '../types/recipe'
import { CALORIE_STATUS_BADGE } from '../utils/categoryStyles'
import { calorieStatus } from '../utils/nutrition'
import { MealSlotRow } from './MealSlotRow'

interface DayCardProps {
  dayIndex: number
  label: string
  people: Person[]
  recipesByCategory: Map<MealCategory, Recipe[]>
}

export const DayCard = ({
  dayIndex,
  label,
  people,
  recipesByCategory,
}: DayCardProps) => {
  const { cyclePlan, dailyCalories } = usePlanner()
  const day = cyclePlan[dayIndex]

  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h4 className="mb-2 font-semibold text-slate-900">{label}</h4>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {people.map((person) => {
          const total = dailyCalories(dayIndex, person.id)
          const status = calorieStatus(total, person.dailyCalorieTarget)
          return (
            <span
              key={person.id}
              className={`rounded-md px-2 py-0.5 text-xs font-medium tabular-nums ${CALORIE_STATUS_BADGE[status]}`}
              title={`Cel: ${person.dailyCalorieTarget} kcal`}
            >
              {person.name}: {total} / {person.dailyCalorieTarget}
            </span>
          )
        })}
      </div>

      <div className="space-y-3">
        {PLAN_SLOTS.map((slot) => (
          <MealSlotRow
            key={slot}
            dayIndex={dayIndex}
            slot={slot}
            meal={day.meals[slot]}
            people={people}
            options={recipesByCategory.get(slot) ?? []}
          />
        ))}
      </div>
    </div>
  )
}
