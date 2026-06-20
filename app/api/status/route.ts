import { NextRequest, NextResponse } from 'next/server'
import { readStatus, writeStatus } from '@/lib/store'
import { getStatus, STATUSES } from '@/lib/statuses'

export const dynamic = 'force-dynamic'

export async function GET() {
  const record = await readStatus()
  const def = getStatus(record.key)
  return NextResponse.json({
    key: def.key,
    label: def.label,
    emoji: def.emoji,
    mood: def.mood,
    updatedAt: record.updatedAt,
  })
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-status-secret') ?? new URL(req.url).searchParams.get('secret')

  if (!process.env.STATUS_SECRET) {
    return NextResponse.json(
      { error: 'Server missing STATUS_SECRET env var. Set it before this endpoint can be used.' },
      { status: 500 }
    )
  }

  if (secret !== process.env.STATUS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { status?: string }
  try {
    body = await req.json()
  } catch {
    // Allow Shortcuts to also send the key as a query param, since
    // building a JSON body in the Shortcuts app is an extra step.
    body = { status: new URL(req.url).searchParams.get('status') ?? undefined }
  }

  const key = body.status
  if (!key || !STATUSES[key]) {
    return NextResponse.json(
      { error: `Unknown status "${key}". Valid keys: ${Object.keys(STATUSES).join(', ')}` },
      { status: 400 }
    )
  }

  const record = await writeStatus(key)
  const def = getStatus(record.key)
  return NextResponse.json({
    key: def.key,
    label: def.label,
    emoji: def.emoji,
    mood: def.mood,
    updatedAt: record.updatedAt,
  })
}
