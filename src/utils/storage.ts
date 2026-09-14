import { isBrowser } from './env'

/**
 * Odczyt z localStorage z bezpiecznym fallbackiem i opcjonalną walidacją kształtu.
 */
export const readStorage = <T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => boolean,
): T => {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as unknown
    if (isValid && !isValid(parsed)) return fallback
    return parsed as T
  } catch (error) {
    console.warn(`Nie udało się wczytać "${key}" z localStorage:`, error)
    return fallback
  }
}

/** Zapis do localStorage (no-op poza przeglądarką). */
export const writeStorage = (key: string, value: unknown) => {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Nie udało się zapisać "${key}" w localStorage:`, error)
  }
}
