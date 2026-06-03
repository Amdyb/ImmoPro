import { NextRequest, NextResponse } from 'next/server'

// Wave API integration
async function initiateWavePayment(amount: number, phone: string, description: string) {
  const apiKey = process.env.WAVE_API_KEY
  if (!apiKey) return { success: false, error: 'Wave not configured' }

  try {
    const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'XOF',
        error_url: process.env.NEXT_PUBLIC_APP_URL + '/payment/error',
        success_url: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
        payment_reasons: [{ vat: '0', amount: amount.toString(), description }],
      }),
    })
    const data = await response.json()
    return { success: true, data, wave_launch_url: data.wave_launch_url }
  } catch(e) {
    return { success: false, error: 'Wave payment failed' }
  }
}

// Orange Money API integration  
async function initiateOrangeMoneyPayment(amount: number, phone: string, description: string) {
  // Orange Money Senegal API
  const merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY
  if (!merchantKey) return { success: false, error: 'Orange Money not configured' }

  try {
    // Get token first
    const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + merchantKey },
      body: 'grant_type=client_credentials',
    })
    const { access_token } = await tokenResponse.json()

    const payResponse = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        merchant_key: merchantKey,
        currency: 'OUV',
        order_id: 'IMMO-' + Date.now(),
        amount,
        return_url: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
        cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/payment/error',
        notif_url: process.env.NEXT_PUBLIC_APP_URL + '/api/payment/webhook',
        lang: 'fr',
        reference: description,
      }),
    })
    const data = await payResponse.json()
    return { success: true, data, payment_url: data.payment_url }
  } catch(e) {
    return { success: false, error: 'Orange Money payment failed' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, amount, phone, description, plan } = body

    if (!amount || !method) {
      return NextResponse.json({ error: 'Amount and method required' }, { status: 400 })
    }

    let result
    if (method === 'wave') {
      result = await initiateWavePayment(amount, phone, description || 'ImmoPro Abonnement ' + plan)
    } else if (method === 'orange_money') {
      result = await initiateOrangeMoneyPayment(amount, phone, description || 'ImmoPro Abonnement ' + plan)
    } else {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch(error) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}
