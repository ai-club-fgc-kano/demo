'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'outpost-theme'
type ThemeChoice = 'light' | 'dark'

/**
 * The theme preference lives in an external store rather than component state so
 * the first paint can be derived from storage without a state-setting effect.
 * Storage access is guarded: private or restricted contexts fall back to the
 * in-memory choice.
 */
let memoryTheme: ThemeChoice = 'dark'
const listeners = new Set<() => void>()

function readTheme(): ThemeChoice {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage can be unavailable; keep the in-memory preference.
  }
  return memoryTheme
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function writeTheme(next: ThemeChoice): void {
  memoryTheme = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Persisting the preference is optional; the theme still applies this session.
  }
  for (const listener of listeners) listener()
}

const getSnapshot = () => readTheme()
const getServerSnapshot = (): ThemeChoice => 'dark'

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    writeTheme(readTheme() === 'dark' ? 'light' : 'dark')
  }, [])

  return { dark: theme === 'dark', toggleTheme }
}
