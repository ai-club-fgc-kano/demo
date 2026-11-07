import { describe, expect, it } from 'vitest'
import { getActionDefinition } from '@/lib/missions/lunar-south-pole/actions'

describe('action definitions', () => {
  it('describes operations with typed costs and risk', () => {
    expect(getActionDefinition('eva')).toMatchObject({
      category: 'operations',
      crewHours: 8,
      resourceCost: {},
      risk: 'high',
    })
  })

  it('describes construction as delayed work', () => {
    expect(getActionDefinition('solar')).toMatchObject({
      category: 'module',
      crewHours: 6,
      risk: 'moderate',
    })
  })
})
