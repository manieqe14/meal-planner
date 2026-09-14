import type { CyclePlan, Person } from '../types/planner'
import { isBrowser } from './env'

/**
 * Zrzut całego stanu aplikacji (osoby + plan cyklu).
 * Przepisy nie są częścią stanu — pochodzą z recipes.json.
 */
export interface AppState {
  version: 1
  people: Person[]
  cyclePlan: CyclePlan
}

const isPerson = (value: unknown): value is Person =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Person).id === 'string' &&
  typeof (value as Person).name === 'string' &&
  typeof (value as Person).dailyCalorieTarget === 'number'

const isAppState = (value: unknown): value is AppState =>
  typeof value === 'object' &&
  value !== null &&
  (value as AppState).version === 1 &&
  Array.isArray((value as AppState).people) &&
  (value as AppState).people.every(isPerson) &&
  Array.isArray((value as AppState).cyclePlan)

/** Buduje obiekt stanu do eksportu. */
export const buildState = (people: Person[], cyclePlan: CyclePlan): AppState => ({
  version: 1,
  people,
  cyclePlan,
})

/** Waliduje i zwraca stan z pliku, lub null gdy niepoprawny. */
export const parseState = (raw: string): AppState | null => {
  try {
    const parsed = JSON.parse(raw) as unknown
    return isAppState(parsed) ? parsed : null
  } catch {
    return null
  }
}

/** Pobiera plik od użytkownika i zwraca jego zawartość tekstową. */
export const pickFile = (): Promise<string | null> =>
  new Promise((resolve) => {
    if (!isBrowser()) return resolve(null)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsText(file)
    }
    input.click()
  })

/** Pobiera stan aplikacji jako plik .json. */
export const downloadState = (state: AppState) => {
  if (!isBrowser()) return
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'meal-planner-state.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
