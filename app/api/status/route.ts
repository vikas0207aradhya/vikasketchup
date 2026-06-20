import { NextRequest, NextResponse } from 'next/server'
import { readStatus, writeStatus, writeMeta } from '@/lib/store'
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
    location: record.location ?? null,
    battery: record.battery ?? null,
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

  let body: { status?: string; location?: string; battery?: number }
  try {
    body = await req.json()
  } catch {
    const params = new URL(req.url).searchParams
    body = {
      status: params.get('status') ?? undefined,
      location: params.get('location') ?? undefined,
      battery: params.get('battery') ? Number(params.get('battery')) : undefined,
    }
  }

  let record

  if (body.status) {
    if (!STATUSES[body.status]) {
      return NextResponse.json(
        { error: `Unknown status "${body.status}". Valid keys: ${Object.keys(STATUSES).join(', ')}` },
        { status: 400 }
      )
    }
    record = await writeStatus(body.status, {
      location: body.location,
      battery: body.battery,
    })
  } else {
    record = await writeMeta({
      location: body.location,
      battery: body.battery,
    })
  }

  const def = getStatus(record.key)
  return NextResponse.json({
    key: def.key,
    label: def.label,
    emoji: def.emoji,
    mood: def.mood,
    updatedAt: record.updatedAt,
    location: record.location ?? null,
    battery: record.battery ?? null,
  })
}
