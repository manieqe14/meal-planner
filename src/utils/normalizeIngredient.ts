import type { Ingredient } from '../types/recipe'

/**
 * Kanoniczna postać składnika po normalizacji nazwy i jednostki.
 */
export interface NormalizedIngredient {
  name: string
  amount: number
  unit: string
}

/**
 * Aliasy nazw składników — klucz to nazwa znormalizowana (lowercase),
 * wartość to kanoniczna nazwa, pod którą składnik ma się pojawiać na liście.
 */
const NAME_ALIASES: Record<string, string> = {
  jajko: 'Jajka',
  'masło roztopione': 'Masło',
  'masło miękkie': 'Masło',
  'mleko 3,5%': 'Mleko',
  'mąka pszenna typ 405': 'Mąka pszenna',
  'ser mozzarella tarty': 'Ser mozzarella',
  'szpinak sałatkowy': 'Szpinak',
  'szpinak baby': 'Szpinak',
}

/**
 * Konwersje jednostek per składnik.
 * `target` to jednostka docelowa, `from` mapuje jednostkę źródłową na mnożnik.
 */
const UNIT_CONVERSIONS: Record<string, { target: string; from: Record<string, number> }> = {
  Masło: { target: 'g', from: { 'łyżeczki': 5, 'łyżeczka': 5 } },
  'Oliwa z oliwek': { target: 'ml', from: { łyżki: 15, łyżka: 15 } },
  Czosnek: { target: 'ząbki', from: { ząbek: 1 } },
  Sól: { target: 'g', from: { łyżeczka: 5, szczypta: 0.5 } },
  Pieprz: { target: 'g', from: { szczypta: 0.5 } },
  'Proszek do pieczenia': { target: 'g', from: { łyżeczka: 5 } },
  'Jogurt naturalny': { target: 'g', from: { łyżki: 15, łyżka: 15 } },
  Cukier: { target: 'g', from: { łyżki: 15, łyżka: 15 } },
  'Kmin rzymski': { target: 'g', from: { łyżeczka: 2 } },
  Cebula: { target: 'szt', from: { g: 0.005 } },
  Cukinia: { target: 'szt', from: { g: 0.002 } },
}

/**
 * Składniki, które nie powinny trafiać na listę zakupów (są w domu / darmowe).
 */
const IGNORED_NAMES = new Set(['woda', 'woda ciepła'])

/**
 * Normalizuje nazwę i jednostkę składnika tak, aby te same produkty
 * agregowały się na liście zakupów jako jedna pozycja.
 */
export const normalizeIngredient = (ingredient: Ingredient): NormalizedIngredient | null => {
  const key = ingredient.name.trim().toLowerCase()
  if (IGNORED_NAMES.has(key)) return null

  const normalizedName = NAME_ALIASES[key] ?? ingredient.name
  const conversion = UNIT_CONVERSIONS[normalizedName]

  if (!conversion || ingredient.unit === conversion.target) {
    return { name: normalizedName, amount: ingredient.amount, unit: ingredient.unit }
  }

  const factor = conversion.from[ingredient.unit]
  if (factor == null) {
    return { name: normalizedName, amount: ingredient.amount, unit: ingredient.unit }
  }

  return { name: normalizedName, amount: ingredient.amount * factor, unit: conversion.target }
}
