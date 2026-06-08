import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const keyword = searchParams.get('keyword')

  if (!lat || !lng || !keyword) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return NextResponse.json({ results: [] })

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    return NextResponse.json(data)
  } catch(e) {
    return NextResponse.json({ results: [] })
  }
}
