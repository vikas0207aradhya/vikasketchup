'use client'

import { useEffect, useState } from 'react'
import { moodGlow, StatusMood } from '@/lib/statuses'

interface StatusPayload {
  key: string
  label: string
  emoji: string
  mood: StatusMood
  updatedAt: number
  location: string | null
  battery: number | null
}

function timeAgo(ms: number) {
  const diff = Math.max(0, Date.now() - ms)
  const s = Math.floor(diff / 1000)
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function BatteryIcon({ level }: { level: number }) {
  const low = level <= 20
  return (
    <span className="flex items-center gap-1">
      <svg viewBox="0 0 24 12" className="h-3 w-5" fill="none">
        <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect
          x="2"
          y="2"
          width={Math.max(1, (17 * level) / 100)}
          height="8"
          rx="1"
          fill={low ? '#d97757' : 'currentColor'}
        />
      </svg>
      <span className="font-mono text-[10px] text-muted/80">{level}%</span>
    </span>
  )
}

export default function LiveStatusBadge() {
  const [status, setStatus] = useState<StatusPayload | null>(null)
  const [, forceTick] = useState(0)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' })
        if (!res.ok) throw new Error('bad response')
        const data: StatusPayload = await res.json()
        if (!cancelled) {
          setStatus(data)
          setErrored(false)
        }
      } catch {
        if (!cancelled) setErrored(true)
      }
    }

    poll()
    const interval = setInterval(poll, 12000)
    const tickInterval = setInterval(() => forceTick((t) => t + 1), 1000)

    return () => {
      cancelled = true
      clearInterval(interval)
      clearInterval(tickInterval)
    }
  }, [])

  const mood = status?.mood ?? 'active'
  const glow = moodGlow[mood]

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className="absolute inline-flex h-full w-full animate-breathe rounded-full"
            style={{ backgroundColor: glow.ring, boxShadow: `0 0 12px 2px ${glow.glow}` }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: glow.ring }}
          />
        </span>

        <span className="tracking-label text-[11px] font-medium text-muted">NOW</span>

        <span className="flex items-center gap-1.5 text-bone">
          {status ? (
            <>
              <span aria-hidden="true">{status.emoji}</span>
              <span className="text-sm font-medium">{status.label}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-muted">
              {errored ? 'Status unavailable' : 'Loading…'}
            </span>
          )}
        </span>

        {status && (
          <span className="font-mono text-[10px] text-muted/70">{timeAgo(status.updatedAt)}</span>
        )}
      </div>

      {status && (status.location || status.battery !== null) && (
        <div className="flex items-center gap-3 pl-5 text-muted/80">
          {status.location && (
            <span className="flex items-center gap-1 text-[11px]">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {status.location}
            </span>
          )}
          {status.battery !== null && <BatteryIcon level={status.battery} />}
        </div>
      )}
    </div>
  )
}
