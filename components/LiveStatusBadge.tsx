'use client'

import { useEffect, useState } from 'react'
import { moodGlow, StatusMood } from '@/lib/statuses'

interface StatusPayload {
  key: string
  label: string
  emoji: string
  mood: StatusMood
  updatedAt: number
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
  )
}
