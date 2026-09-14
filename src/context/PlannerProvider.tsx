import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CYCLE_LENGTH,
  DEFAULT_PEOPLE,
  PLAN_SLOTS,
  STORAGE_KEYS,
  WEEK_DAYS,
} from '../constants'
import { useRecipes } from '../hooks/useRecipes'
import type {
  CyclePlan,
  DayMeals,
  DayPlan,
  Person,
  PlannedMeal,
} from '../types/planner'
import type { MealCategory } from '../types/recipe'
import { roundTo } from '../utils/number'
import { dailyCaloriesForPerson } from '../utils/nutrition'
import { buildShoppingList } from '../utils/shoppingList'
import { readStorage, writeStorage } from '../utils/storage'
import {
  buildState,
  downloadState,
  parseState,
  pickFile,
} from '../utils/state'
import { PlannerContext } from './plannerContext'
import type { PlannerContextValue } from './plannerContext'

const emptyMeal = (): PlannedMeal => ({ recipeId: null, basePortions: 0 })

const emptyDay = (): DayPlan => ({
  meals: Object.fromEntries(
    PLAN_SLOTS.map((slot) => [slot, emptyMeal()]),
  ) as DayMeals,
})

const emptyCycle = (): CyclePlan => Array.from({ length: CYCLE_LENGTH }, emptyDay)

const isValidCycle = (value: unknown) =>
  Array.isArray(value) && value.length === CYCLE_LENGTH

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const { getRecipeById } = useRecipes()

  const [people, setPeople] = useState(() =>
    readStorage(STORAGE_KEYS.people, DEFAULT_PEOPLE, Array.isArray),
  )
  const [cyclePlan, setCyclePlan] = useState(() =>
    readStorage(STORAGE_KEYS.cyclePlan, emptyCycle(), isValidCycle),
  )

  useEffect(() => writeStorage(STORAGE_KEYS.people, people), [people])
  useEffect(() => writeStorage(STORAGE_KEYS.cyclePlan, cyclePlan), [cyclePlan])

  const updateDay = useCallback(
    (dayIndex: number, updater: (day: DayPlan) => DayPlan) =>
      setCyclePlan((plan) =>
        plan.map((day, i) => (i === dayIndex ? updater(day) : day)),
      ),
    [],
  )

  const updatePerson = useCallback(
    (id: string, updates: Partial<Omit<Person, 'id'>>) =>
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, ...updates } : person,
        ),
      ),
    [],
  )

  const setMeal = useCallback(
    (dayIndex: number, slot: MealCategory, recipeId: string | null) =>
      updateDay(dayIndex, (day) => ({
        meals: {
          ...day.meals,
          [slot]: {
            recipeId,
            // przy wyborze dania: 1 porcja bazowa (lub zachowaj istniejącą),
            // przy czyszczeniu — 0.
            basePortions: recipeId ? day.meals[slot].basePortions || 1 : 0,
          },
        },
      })),
    [updateDay],
  )

  const setMealPortions = useCallback(
    (dayIndex: number, slot: MealCategory, basePortions: number) =>
      updateDay(dayIndex, (day) => ({
        meals: {
          ...day.meals,
          [slot]: {
            ...day.meals[slot],
            basePortions: Math.max(0, basePortions),
          },
        },
      })),
    [updateDay],
  )

  const dailyCalories = useCallback(
    (dayIndex: number, personId: string) => {
      const day = cyclePlan[dayIndex]
      const person = people.find((p) => p.id === personId)
      return day && person
        ? roundTo(dailyCaloriesForPerson(day, person, people, getRecipeById))
        : 0
    },
    [cyclePlan, people, getRecipeById],
  )

  const shoppingListForWeek = useCallback(
    (weekIndex: number) => {
      const start = weekIndex * WEEK_DAYS.length
      const days = cyclePlan.slice(start, start + WEEK_DAYS.length)
      return buildShoppingList(days, people, getRecipeById)
    },
    [cyclePlan, people, getRecipeById],
  )

  const exportState = useCallback(() => {
    downloadState(buildState(people, cyclePlan))
  }, [people, cyclePlan])

  const importState = useCallback(async () => {
    const raw = await pickFile()
    if (!raw) return
    const parsed = parseState(raw)
    if (!parsed) {
      window.alert('Nieprawidłowy plik stanu aplikacji.')
      return
    }
    setPeople(parsed.people)
    setCyclePlan(parsed.cyclePlan)
  }, [])

  const resetState = useCallback(() => {
    setPeople(DEFAULT_PEOPLE)
    setCyclePlan(emptyCycle())
  }, [])

  const value = useMemo<PlannerContextValue>(
    () => ({
      people,
      cyclePlan,
      updatePerson,
      setMeal,
      setMealPortions,
      dailyCalories,
      shoppingListForWeek,
      exportState,
      importState,
      resetState,
    }),
    [
      people,
      cyclePlan,
      updatePerson,
      setMeal,
      setMealPortions,
      dailyCalories,
      shoppingListForWeek,
      exportState,
      importState,
      resetState,
    ],
  )

  return <PlannerContext value={value}>{children}</PlannerContext>
}
