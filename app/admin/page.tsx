'use client'

import { useEffect, useState } from 'react'
import { STATUSES } from '@/lib/statuses'

const STORAGE_KEY = 'vikasketchup_admin_secret'

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [savedSecret, setSavedSecret] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) setSavedSecret(stored)
    refreshCurrent()
  }, [])

  async function refreshCurrent() {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' })
      const data = await res.json()
      setActiveKey(data.key)
    } catch {
      // ignore — page still works without this
    }
  }

  function saveSecret() {
    if (!secret.trim()) return
    window.localStorage.setItem(STORAGE_KEY, secret.trim())
    setSavedSecret(secret.trim())
    setSecret('')
  }

  function signOut() {
    window.localStorage.removeItem(STORAGE_KEY)
    setSavedSecret(null)
  }

  async function setStatus(key: string) {
    if (!savedSecret || sending) return
    setSending(true)
    setMessage(null)
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-status-secret': savedSecret },
        body: JSON.stringify({ status: key }),
      })
      if (!res.ok) {
        const err = await res.json()
        setMessage(err.error ?? 'Something went wrong')
      } else {
        const data = await res.json()
        setActiveKey(data.key)
        setMessage(`Set to "${data.label}"`)
      }
    } catch {
      setMessage('Network error — try again')
    } finally {
      setSending(false)
    }
  }

  if (!savedSecret) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-void px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl text-bone">Admin access</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your status secret. It's stored only on this device.
          </p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveSecret()}
            placeholder="Secret key"
            className="mt-5 w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-bone outline-none focus:border-ember"
          />
          <button
            onClick={saveSecret}
            className="mt-3 w-full rounded-lg bg-ember px-4 py-3 font-medium text-void transition-opacity hover:opacity-90"
          >
            Continue
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-void px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-bone">Set status</h1>
          <button onClick={signOut} className="text-xs text-muted hover:text-ember">
            Sign out
          </button>
        </div>

        {message && <p className="mt-3 text-sm text-ember">{message}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          {Object.values(STATUSES).map((s) => (
            <button
              key={s.key}
              onClick={() => setStatus(s.key)}
              disabled={sending}
              className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-5 transition-colors disabled:opacity-50 ${
                activeKey === s.key
                  ? 'border-ember bg-ember/10'
                  : 'border-hairline bg-surface hover:border-ember/50'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-sm font-medium text-bone">{s.label}</span>
              {s.source === 'auto' && (
                <span className="tracking-label text-[9px] text-muted">AUTO-SYNCED</span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted">
          Auto-synced statuses (Sleeping, Driving) are normally set by iOS Shortcuts, but you can
          override them here any time — the next automation will overwrite it again.
        </p>
      </div>
    </main>
  )
}
