import { Minus, Plus } from 'lucide-react'
import { PORTION_STEP } from '../constants'

interface PortionStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
}

const buttonClass =
  'flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-40'

export const PortionStepper = ({
  label,
  value,
  onChange,
}: PortionStepperProps) => (
  <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2 py-1">
    <span className="text-xs font-medium text-slate-600">{label}</span>
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Mniej: ${label}`}
        onClick={() => onChange(value - PORTION_STEP)}
        disabled={value <= 0}
        className={buttonClass}
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-9 text-center text-sm font-semibold tabular-nums text-slate-800">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Więcej: ${label}`}
        onClick={() => onChange(value + PORTION_STEP)}
        className={buttonClass}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  </div>
)
