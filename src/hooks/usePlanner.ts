import { useContext } from 'react'
import { PlannerContext } from '../context/plannerContext'

/**
 * Dostęp do planera cyklu 2-tygodniowego.
 * Musi być użyty wewnątrz <PlannerProvider>.
 */
export const usePlanner = () => {
  const context = useContext(PlannerContext)
  if (!context) {
    throw new Error('usePlanner musi być użyty wewnątrz <PlannerProvider>.')
  }
  return context
}
