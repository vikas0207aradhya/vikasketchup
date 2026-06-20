import { DEFAULT_STATUS_KEY } from './statuses'

export interface StatusRecord {
  key: string
  updatedAt: number
}

const KV_KEY = 'vikasketchup:status'

// In-memory fallback so `npm run dev` works before Vercel KV is connected.
// On Vercel this resets per cold-start; that's fine for local testing —
// once you add the KV env vars below it persists for real.
let memoryStore: StatusRecord = {
  key: DEFAULT_STATUS_KEY,
  updatedAt: Date.now(),
}

function hasKvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function readStatus(): Promise<StatusRecord> {
  if (hasKvConfigured()) {
    const { kv } = await import('@vercel/kv')
    const record = await kv.get<StatusRecord>(KV_KEY)
    if (record) return record
    return memoryStore
  }
  return memoryStore
}

export async function writeStatus(key: string): Promise<StatusRecord> {
  const record: StatusRecord = { key, updatedAt: Date.now() }
  if (hasKvConfigured()) {
    const { kv } = await import('@vercel/kv')
    await kv.set(KV_KEY, record)
  } else {
    memoryStore = record
  }
  return record
}
