/**
 * Mission-agnostic simulation primitives.
 *
 * These types describe the shared vocabulary of the mission log and mission
 * status. Mission-specific state (resources, modules, incidents) lives in the
 * mission package under `lib/missions/*` so a second scenario can be added
 * without editing the engine's logging contract.
 */

export type LogKind = 'system' | 'action' | 'event'

export type LogTone = 'good' | 'warning' | 'critical'

export type LogEntry = {
  cycle: number
  kind: LogKind
  title: string
  detail: string
  tone?: LogTone
}

export type MissionStatus = 'active' | 'success' | 'failed'
