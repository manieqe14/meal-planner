import { useState } from 'react'
import type { ReactElement } from 'react'
import { CalendarDays, ChefHat, ShoppingCart, Utensils } from 'lucide-react'
import { RecipeProvider } from './context/RecipeProvider'
import { PlannerProvider } from './context/PlannerProvider'
import { PlannerView } from './components/PlannerView'
import { ShoppingListView } from './components/ShoppingListView'
import { RecipeLibrary } from './components/RecipeLibrary'

const TABS = [
  { id: 'planner', label: 'Planer', icon: CalendarDays },
  { id: 'shopping', label: 'Lista zakupów', icon: ShoppingCart },
  { id: 'library', label: 'Baza Przepisów', icon: Utensils },
] as const

type Tab = (typeof TABS)[number]['id']

const VIEWS = {
  planner: PlannerView,
  shopping: ShoppingListView,
  library: RecipeLibrary,
} satisfies Record<Tab, () => ReactElement>

const App = () => {
  const [tab, setTab] = useState<Tab>('planner')
  const ActiveView = VIEWS[tab]

  return (
    <RecipeProvider>
      <PlannerProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <ChefHat className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-xl font-bold leading-tight">
                    Meal Planner
                  </h1>
                  <p className="text-sm text-slate-500">
                    Planuj cykl 2-tygodniowy i generuj listę zakupów
                  </p>
                </div>
              </div>

              <nav className="flex gap-1 rounded-xl bg-slate-100 p-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      tab === id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <ActiveView />
          </main>
        </div>
      </PlannerProvider>
    </RecipeProvider>
  )
}

export default App
