import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { WEEKS_IN_CYCLE } from '../constants'
import { usePlanner } from '../hooks/usePlanner'
import { isBrowser } from '../utils/env'
import { shoppingListToText } from '../utils/shoppingList'

const itemKey = (name: string, unit: string) => `${name}|${unit}`

export const ShoppingListView = () => {
  const { shoppingListForWeek } = usePlanner()
  const [week, setWeek] = useState(0)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const items = useMemo(
    () => shoppingListForWeek(week),
    [shoppingListForWeek, week],
  )

  const toggle = (key: string) =>
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )

  const copy = async () => {
    if (!isBrowser()) return
    await navigator.clipboard.writeText(shoppingListToText(items))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const weeks = Array.from({ length: WEEKS_IN_CYCLE }, (_, index) => index)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lista zakupów</h2>
          <p className="text-sm text-slate-500">
            Składniki zsumowane z zaplanowanych posiłków wybranego tygodnia.
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={items.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" /> Skopiowano
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Kopiuj do Todoist
            </>
          )}
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {weeks.map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setWeek(index)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              week === index
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            Tydzień {index + 1}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center text-slate-500">
          Brak składników — zaplanuj posiłki w tym tygodniu.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {items.map((item) => {
            const key = itemKey(item.name, item.unit)
            const isChecked = checkedKeys.includes(key)
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(key)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      isChecked
                        ? 'text-slate-400 line-through'
                        : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-slate-500">
                    {item.amount} {item.unit}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
