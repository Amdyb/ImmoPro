import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsApp, notifications } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, phone, data } = body

    if (!phone) {
      return NextResponse.json({ error: 'Phone required' }, { status: 400 })
    }

    let message = ''

    switch (type) {
      case 'visit_confirmed':
        message = notifications.visitConfirmed(data.propertyTitle, data.date, data.time)
        break
      case 'new_message':
        message = notifications.newMessage(data.senderName, data.propertyTitle)
        break
      case 'property_verified':
        message = notifications.propertyVerified(data.propertyTitle)
        break
      case 'new_visit_request':
        message = notifications.newVisitRequest(data.visitorName, data.propertyTitle, data.date)
        break
      case 'welcome':
        message = notifications.welcomeMessage(data.userName)
        break
      default:
        message = data.message || 'Message de ImmoPro'
    }

    const result = await sendWhatsApp({ to: phone, message })
    return NextResponse.json(result)
  } catch (error) {
    console.error('WhatsApp error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
