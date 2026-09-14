import type { CalorieStatus } from './nutrition'
import type { MealCategory } from '../types/recipe'

/**
 * Klasy Tailwind dla oznaczeń (badge) poszczególnych kategorii posiłków.
 */
export const CATEGORY_BADGE: Record<MealCategory, string> = {
  Śniadanie: 'bg-amber-100 text-amber-800 ring-amber-200',
  Obiad: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Kolacja: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  Przekąska: 'bg-rose-100 text-rose-800 ring-rose-200',
}

/**
 * Klasy Tailwind dla oznaczeń statusu dziennego bilansu kalorii.
 */
export const CALORIE_STATUS_BADGE: Record<CalorieStatus, string> = {
  under: 'bg-amber-100 text-amber-800',
  'on-target': 'bg-emerald-100 text-emerald-800',
  over: 'bg-rose-100 text-rose-800',
}
