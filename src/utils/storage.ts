import type { FormDraft, PetClothingPlan } from '../types'

const DRAFT_KEY = 'pet-clothes-fit:draft'
const CURRENT_PLAN_KEY = 'pet-clothes-fit:current-plan'
const PLANS_KEY = 'pet-clothes-fit:plans'

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function getDraft(): FormDraft {
  return readJson<FormDraft>(DRAFT_KEY, {})
}

export function saveDraft(patch: Partial<FormDraft>): boolean {
  return writeJson(DRAFT_KEY, { ...getDraft(), ...patch })
}

export function clearDraft(): void {
  window.localStorage.removeItem(DRAFT_KEY)
}

export function getCurrentPlan(): PetClothingPlan | null {
  return readJson<PetClothingPlan | null>(CURRENT_PLAN_KEY, null)
}

export function saveCurrentPlan(plan: PetClothingPlan): boolean {
  return writeJson(CURRENT_PLAN_KEY, plan)
}

export function clearCurrentPlan(): void {
  window.localStorage.removeItem(CURRENT_PLAN_KEY)
}

export function getPlans(): PetClothingPlan[] {
  const plans = readJson<PetClothingPlan[]>(PLANS_KEY, [])
  return Array.isArray(plans)
    ? plans.filter((plan) => plan && typeof plan.id === 'string')
    : []
}

export function getPlanById(id: string): PetClothingPlan | null {
  return getPlans().find((plan) => plan.id === id) ?? null
}

export function savePlan(plan: PetClothingPlan): boolean {
  const plans = getPlans()
  const existingIndex = plans.findIndex((item) => item.id === plan.id)

  if (existingIndex >= 0) {
    plans[existingIndex] = plan
  } else {
    plans.unshift(plan)
  }

  return writeJson(PLANS_KEY, plans)
}

export function deletePlan(id: string): boolean {
  return writeJson(PLANS_KEY, getPlans().filter((plan) => plan.id !== id))
}

export function resetTestDraft(): void {
  clearDraft()
  clearCurrentPlan()
}
