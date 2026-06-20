import { DEFAULT_STATUS_KEY } from './statuses'

export interface StatusRecord {
  key: string
  updatedAt: number
  location?: string
  battery?: number
}

const KV_KEY = 'vikasketchup:status'

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

export async function writeStatus(
  key: string,
  extra?: { location?: string; battery?: number }
): Promise<StatusRecord> {
  const previous = await readStatus()
  const record: StatusRecord = {
    key,
    updatedAt: Date.now(),
    location: extra?.location ?? previous.location,
    battery: extra?.battery ?? previous.battery,
  }
  if (hasKvConfigured()) {
    const { kv } = await import('@vercel/kv')
    await kv.set(KV_KEY, record)
  } else {
    memoryStore = record
  }
  return record
}

export async function writeMeta(extra: { location?: string; battery?: number }): Promise<StatusRecord> {
  const previous = await readStatus()
  return writeStatus(previous.key, extra)
}
