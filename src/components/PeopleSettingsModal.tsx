import { usePlanner } from '../hooks/usePlanner'
import { Modal } from './Modal'

interface PeopleSettingsModalProps {
  open: boolean
  onClose: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'

export const PeopleSettingsModal = ({
  open,
  onClose,
}: PeopleSettingsModalProps) => {
  const { people, updatePerson } = usePlanner()

  return (
    <Modal open={open} onClose={onClose} title="Osoby i cele kaloryczne">
      <div className="space-y-5">
        <p className="text-sm text-slate-500">
          Ustaw imię oraz docelową liczbę kalorii na dzień dla każdej osoby.
        </p>
        {people.map((person) => (
          <div key={person.id} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Imię
              </label>
              <input
                className={inputClass}
                value={person.name}
                onChange={(e) => updatePerson(person.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cel kaloryczny (kcal/dzień)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                className={inputClass}
                value={person.dailyCalorieTarget}
                onChange={(e) =>
                  updatePerson(person.id, {
                    dailyCalorieTarget: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
