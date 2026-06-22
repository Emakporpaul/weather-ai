/**
 * Tests for formatters.js — pure functions, no rendering needed.
 * These are the cheapest, highest-value tests in the whole app: no mocking,
 * no DOM, just input -> output. getConditionCategory is the most important
 * one since it drives which icon and background color the whole UI shows.
 */
import { describe, it, expect } from 'vitest'
import { msToKmh, getConditionCategory } from '../utils/formatters'

describe('msToKmh', () => {
  it('converts meters/second to km/h correctly', () => {
    expect(msToKmh(10)).toBe(36)
    expect(msToKmh(0)).toBe(0)
  })

  it('rounds to the nearest whole number', () => {
    expect(msToKmh(2.78)).toBe(10) // 2.78 * 3.6 = 10.008 -> 10
  })
})

describe('getConditionCategory', () => {
  it('maps thunderstorm codes (200-299) correctly', () => {
    expect(getConditionCategory(200)).toBe('thunderstorm')
    expect(getConditionCategory(299)).toBe('thunderstorm')
  })

  it('maps rain codes (300-599) correctly', () => {
    expect(getConditionCategory(300)).toBe('rain')
    expect(getConditionCategory(500)).toBe('rain')
    expect(getConditionCategory(599)).toBe('rain')
  })

  it('maps snow codes (600-699) correctly', () => {
    expect(getConditionCategory(600)).toBe('snow')
    expect(getConditionCategory(699)).toBe('snow')
  })

  it('maps fog/atmosphere codes (700-799) correctly', () => {
    expect(getConditionCategory(741)).toBe('fog')
  })

  it('maps exactly 800 to clear', () => {
    expect(getConditionCategory(800)).toBe('clear')
  })

  it('maps codes above 800 to cloudy', () => {
    expect(getConditionCategory(801)).toBe('cloudy')
    expect(getConditionCategory(804)).toBe('cloudy')
  })

  it('returns unknown only for negative/invalid codes', () => {
    // Note: codes above 800 (e.g. 801-804+) are valid OWM "cloudy" codes,
    // and the function has no upper bound, so very large numbers also
    // fall into 'cloudy'. Only negative/unrecognized low values hit 'unknown'.
    expect(getConditionCategory(-1)).toBe('unknown')
  })
})
