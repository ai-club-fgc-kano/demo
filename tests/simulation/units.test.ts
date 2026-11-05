import { describe, expect, it } from 'vitest'

import {
  addQuantity,
  boundQuantity,
  canSubtract,
  evaluateThreshold,
  formatQuantity,
  subtractQuantity,
} from '@/lib/simulation/domain/units'

describe('unit-safe quantity helpers', () => {
  it('bounds invalid, negative, and over-capacity values', () => {
    expect(boundQuantity({ value: -3, capacity: 10 })).toBe(0)
    expect(boundQuantity({ value: 14, capacity: 10 })).toBe(10)
    expect(boundQuantity({ value: Number.NaN, capacity: 10 })).toBe(0)
  })

  it('adds and subtracts without crossing the configured capacity', () => {
    const quantity = { value: 8, capacity: 10 }

    expect(addQuantity(quantity, 5)).toBe(10)
    expect(subtractQuantity(quantity, 3)).toBe(5)
    expect(subtractQuantity(quantity, 20)).toBe(0)
  })

  it('rejects invalid or unaffordable subtraction', () => {
    expect(canSubtract({ value: 4, capacity: 10 }, 4)).toBe(true)
    expect(canSubtract({ value: 4, capacity: 10 }, 5)).toBe(false)
    expect(canSubtract({ value: 4, capacity: 10 }, -1)).toBe(false)
    expect(canSubtract({ value: 4, capacity: 10 }, Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('evaluates thresholds from highest severity to reserve', () => {
    const thresholds = { reserve: 70, warning: 45, critical: 20, failure: 0 }

    expect(evaluateThreshold(80, thresholds)).toBe('reserve')
    expect(evaluateThreshold(60, thresholds)).toBe('nominal')
    expect(evaluateThreshold(40, thresholds)).toBe('warning')
    expect(evaluateThreshold(10, thresholds)).toBe('critical')
    expect(evaluateThreshold(0, thresholds)).toBe('failure')
  })

  it('formats quantities with their units', () => {
    expect(formatQuantity({ value: 64, unit: 'L' })).toBe('64 L')
    expect(formatQuantity({ value: 12.5, unit: 'kWh' }, 1)).toBe('12.5 kWh')
  })
})
