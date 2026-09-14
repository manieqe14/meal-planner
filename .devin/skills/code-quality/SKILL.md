---
name: code-quality
description: Reguły jakości kodu dla projektu meal-planner (immutability, brak let, inferencja TS, DRY, utils, constants)
triggers:
  - user
  - model
---

# Reguły jakości kodu — meal-planner

Stosuj te reguły przy każdej zmianie kodu w tym projekcie (React + Vite + TypeScript + Tailwind).
Są nadrzędne wobec ogólnych nawyków — jeśli coś jest z nimi sprzeczne, wygrywają te reguły.

## 1. Bez testów
- Nie pisz testów jednostkowych, integracyjnych ani e2e. Nie zakładaj plików `*.test.ts(x)`, `*.spec.ts(x)`.
- Nie dodawaj frameworków testowych ani skryptów testowych do `package.json`.
- Weryfikuj poprawność przez `npm run typecheck`, `npm run lint` i `npm run build` — nie przez testy.

## 2. Immutability przede wszystkim
- Nigdy nie mutuj obiektów ani tablic. Używaj `map`, `filter`, `reduce`, spreadów `{ ...obj }` / `[...arr]`.
- Zero `push`, `splice`, `pop`, `sort` in-place, przypisań `obj.x = ...` na współdzielonych danych. Jeśli potrzebujesz `sort`, kopiuj wcześniej: `[...arr].sort(...)`.
- Deklaruj dane jako `readonly` / `as const` tam, gdzie to naturalnie wynika.

## 3. Zakaz `let` (i `var`)
- Używaj wyłącznie `const`. Jeśli sięgasz po `let`, przeprojektuj kod.
- Zamiast budować wartość mutacją w `let`, policz ją wyrażeniem (ternary, `map`/`reduce`) albo **IIFE**.

```ts
// ŹLE
let label = 'brak'
if (count > 0) label = `${count} szt`

// DOBRZE — ternary
const label = count > 0 ? `${count} szt` : 'brak'

// DOBRZE — IIFE, gdy logika jest bardziej złożona
const plan = (() => {
  const base = createEmptyPlan()
  return slots.reduce((acc, slot) => fill(acc, slot), base)
})()
```

## 4. IIFE zamiast tymczasowych mutacji
- Gdy wynik wymaga kilku kroków, opakuj je w IIFE zwracające `const`, zamiast mutować zmienną `let`.
- IIFE trzymaj krótkie i czytelne; jeśli rośnie — wyodrębnij nazwaną funkcję do `utils`.

## 5. Maksymalna inferencja TypeScript
- Nie deklaruj typów, które TS sam wywnioskuje. Unikaj nadmiarowych adnotacji.
- Adnotuj tylko: publiczne API/kontrakty (props komponentów, sygnatury eksportowanych funkcji, kształty danych), gdy inferencja jest błędna lub zbyt szeroka.

```ts
// ŹLE — zbędne adnotacje
const count: number = 0
const names: string[] = items.map((i: Item): string => i.name)

// DOBRZE — niech TS wnioskuje
const count = 0
const names = items.map((i) => i.name)
```

- Nie rzutuj bez potrzeby (`as`). Preferuj poprawne typy źródłowe.

## 6. Wyprowadzaj typy ze stałych (`as const` + `typeof` / `keyof`)
- Gdy się da, NIE deklaruj typu osobno — wyprowadź go ze stałej (single source of truth). Definiujesz dane raz, typ wynika z nich automatycznie.
- Stosuj `as const` + `keyof typeof` (klucze), `typeof x[keyof typeof x]` (wartości) oraz `(typeof arr)[number]` (elementy tablicy).

```ts
// ŹLE — typ i dane osobno, łatwo się rozjadą
type MealCategory = 'Śniadanie' | 'Obiad' | 'Kolacja' | 'Przekąska'
const CATEGORIES = ['Śniadanie', 'Obiad', 'Kolacja', 'Przekąska']

// DOBRZE — dane raz, typ wyprowadzony
const MEAL_CATEGORIES = ['Śniadanie', 'Obiad', 'Kolacja', 'Przekąska'] as const
type MealCategory = (typeof MEAL_CATEGORIES)[number]

// DOBRZE — obiekt jako źródło typów
const STORAGE_KEYS = {
  recipes: 'meal-planner:recipes',
  weekPlan: 'meal-planner:week-plan',
} as const
type StorageKeyName = keyof typeof STORAGE_KEYS        // 'recipes' | 'weekPlan'
type StorageKeyValue = (typeof STORAGE_KEYS)[StorageKeyName]
```

- Deklaruj ręczny `interface`/`type` tylko dla kontraktów, których nie da się (sensownie) wyprowadzić ze stałej.

## 7. Arrow functions zamiast `function`
- Deklaruj funkcje jako `const fn = (...) => ...`, nie `function fn(...)`.
- Dotyczy helperów, utili i handlerów. (Komponenty React też mogą być arrow — trzymaj się jednego stylu w pliku/module.)

```ts
// ŹLE
function slugify(text) { ... }

// DOBRZE
const slugify = (text: string) => ...
```

## 8. DRY — wyodrębniaj wszystko, co powtarzalne, do `utils`
- Powtórzony fragment logiki = kandydat do `src/utils/`. Nie kopiuj-wklejaj.
- Typowe guardy i helpery MUSZĄ trafić do utili, np. sprawdzenie środowiska przeglądarki:

```ts
// ŹLE — powtarzane w wielu plikach
if (typeof window === 'undefined') return fallback

// DOBRZE — reużywalny util w src/utils/env.ts
export const isBrowser = () => typeof window !== 'undefined'
```

- Współdzielona logika stylów, formatowania, dostępu do storage itp. również idzie do utili.

## 9. Stałe do dedykowanego pliku `constants`
- Literały-konfiguracje (klucze localStorage, prefiksy, limity, nazwy) trzymaj w `src/constants.ts` (lub `src/config/constants.ts`), nie rozsiane po modułach.

```ts
// ŹLE — w środku modułu
const STORAGE_KEY = 'meal-planner:recipes'

// DOBRZE — src/constants.ts
export const STORAGE_KEYS = {
  recipes: 'meal-planner:recipes',
  weekPlan: 'meal-planner:week-plan',
} as const
```

## 10. Ogólna jakość
- Zwięzły kod: eliminuj zbędne zagnieżdżenia i duplikaty gałęzi.
- Nazwy opisowe, spójne z resztą projektu; komentarze tylko tam, gdzie wyjaśniają "dlaczego".
- Trzymaj się istniejących wzorców, bibliotek i konwencji projektu.

## Checklista przed zakończeniem zmiany
- [ ] Zero `let` / `var`, zero mutacji in-place.
- [ ] Brak zbędnych adnotacji typów — TS wnioskuje, gdzie się da.
- [ ] Typy wyprowadzone ze stałych (`as const` + `typeof`/`keyof`), gdzie to możliwe.
- [ ] Funkcje jako arrow (`const fn = () => ...`).
- [ ] Powtarzalna logika i guardy wyniesione do `utils`.
- [ ] Stałe konfiguracyjne w pliku `constants`.
- [ ] Brak testów.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` przechodzą.
