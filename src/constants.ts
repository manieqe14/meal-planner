import type { MealCategory } from './types/recipe'
import type { Person } from './types/planner'

/** Klucze localStorage — jedno źródło prawdy. */
export const STORAGE_KEYS = {
  cyclePlan: 'meal-planner:cycle-plan',
  people: 'meal-planner:people',
} as const

/** Dni tygodnia (etykiety). */
export const WEEK_DAYS = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
] as const

export type WeekDay = (typeof WEEK_DAYS)[number]

/** Sloty posiłków w kolejności spożywania w ciągu dnia. */
export const PLAN_SLOTS = [
  'Śniadanie',
  'Obiad',
  'Przekąska',
  'Kolacja',
] as const satisfies readonly MealCategory[]

export const WEEKS_IN_CYCLE = 2
export const CYCLE_LENGTH = WEEK_DAYS.length * WEEKS_IN_CYCLE

/** Krok zmiany liczby porcji w UI. */
export const PORTION_STEP = 0.5

/** Tolerancja (w kcal) uznania celu dziennego za trafiony. */
export const CALORIE_TOLERANCE = 100

/** Domyślne osoby — edytowalne i utrwalane w localStorage. */
export const DEFAULT_PEOPLE: Person[] = [
  { id: 'ty', name: 'Ty', dailyCalorieTarget: 2400 },
  { id: 'zona', name: 'Żona', dailyCalorieTarget: 1800 },
]
