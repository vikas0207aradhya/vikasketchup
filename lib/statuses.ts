export type StatusMood = 'rest' | 'active' | 'focus' | 'social'

export interface StatusDef {
  key: string
  label: string
  emoji: string
  mood: StatusMood
  source: 'auto' | 'manual'
}

// Every status this site can ever show. Add new ones here —
// nothing else in the codebase needs to change.
export const STATUSES: Record<string, StatusDef> = {
  sleeping: { key: 'sleeping', label: 'Sleeping', emoji: '😴', mood: 'rest', source: 'auto' },
  driving: { key: 'driving', label: 'Driving', emoji: '🚗', mood: 'active', source: 'auto' },
  scrolling: { key: 'scrolling', label: 'Scrolling', emoji: '📱', mood: 'social', source: 'manual' },
  coding: { key: 'coding', label: 'Shipping code', emoji: '💻', mood: 'focus', source: 'manual' },
  gym: { key: 'gym', label: 'At the gym', emoji: '🏋️', mood: 'active', source: 'manual' },
  eating: { key: 'eating', label: 'Eating', emoji: '🍽️', mood: 'social', source: 'manual' },
  gaming: { key: 'gaming', label: 'Gaming', emoji: '🎮', mood: 'social', source: 'manual' },
  reading: { key: 'reading', label: 'Reading', emoji: '📖', mood: 'focus', source: 'manual' },
  online: { key: 'online', label: 'Online', emoji: '🟢', mood: 'active', source: 'manual' },
  afk: { key: 'afk', label: 'AFK', emoji: '🚪', mood: 'rest', source: 'manual' },
}

export const DEFAULT_STATUS_KEY = 'online'

export const moodGlow: Record<StatusMood, { ring: string; glow: string }> = {
  rest: { ring: '#7c6a60', glow: 'rgba(124,106,96,0.35)' },
  active: { ring: '#c98a6b', glow: 'rgba(201,138,107,0.45)' },
  focus: { ring: '#b97a5c', glow: 'rgba(185,122,92,0.4)' },
  social: { ring: '#d99b78', glow: 'rgba(217,155,120,0.4)' },
}

export function getStatus(key: string): StatusDef {
  return STATUSES[key] ?? STATUSES[DEFAULT_STATUS_KEY]
}
