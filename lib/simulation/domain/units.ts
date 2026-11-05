export type ThresholdBand = 'reserve' | 'nominal' | 'warning' | 'critical' | 'failure'

export type UnitValue = {
  value: number
  unit: string
}

export type BoundedQuantity = {
  value: number
  capacity: number
}

function finite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback
}

export function boundQuantity(quantity: BoundedQuantity): number {
  const capacity = Math.max(0, finite(quantity.capacity))
  return Math.min(capacity, Math.max(0, finite(quantity.value)))
}

export function addQuantity(quantity: BoundedQuantity, delta: number): number {
  return boundQuantity({ ...quantity, value: quantity.value + finite(delta) })
}

export function subtractQuantity(quantity: BoundedQuantity, amount: number): number {
  return addQuantity(quantity, -Math.max(0, finite(amount)))
}

export function canSubtract(quantity: BoundedQuantity, amount: number): boolean {
  return finite(amount) >= 0 && finite(quantity.value) >= amount
}

export type ConditionBand = 'critical' | 'watch' | 'nominal'

export function evaluateCondition(value: number): ConditionBand {
  if (value < 35) return 'critical'
  if (value < 65) return 'watch'
  return 'nominal'
}

export function evaluateThreshold(
  value: number,
  thresholds: { reserve: number; warning: number; critical: number; failure: number },
): ThresholdBand {
  if (value <= thresholds.failure) return 'failure'
  if (value <= thresholds.critical) return 'critical'
  if (value <= thresholds.warning) return 'warning'
  if (value < thresholds.reserve) return 'nominal'
  return 'reserve'
}

export function formatQuantity(quantity: UnitValue, maximumFractionDigits = 0): string {
  const value = finite(quantity.value)
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value)} ${quantity.unit}`
}
