import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message } = body
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({ success: false, error: 'SMS not configured' })
    }

    const toPhone = phone.startsWith('+') ? phone : '+221' + phone
    const url = 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json'
    const smsBody = new URLSearchParams({ From: fromNumber, To: toPhone, Body: message })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
      },
      body: smsBody.toString(),
    })

    const data = await response.json()
    return NextResponse.json({ success: response.ok, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'SMS failed' }, { status: 500 })
  }
}
