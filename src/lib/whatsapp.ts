// WhatsApp notification system via Twilio

interface WhatsAppMessage {
  to: string
  message: string
}

export async function sendWhatsApp({ to, message }: WhatsAppMessage) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

  if (!accountSid || !authToken) {
    console.log('Twilio not configured - WhatsApp not sent')
    return { success: false, error: 'Not configured' }
  }

  const phone = to.startsWith('+') ? to : '+' + to
  const url = 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json'

  const body = new URLSearchParams({
    From: from,
    To: 'whatsapp:' + phone,
    Body: message,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
    },
    body: body.toString(),
  })

  const data = await response.json()
  return { success: response.ok, data }
}

// Notification templates
export const notifications = {
  visitConfirmed: (propertyTitle: string, date: string, time: string) =>
    'ImmoPro: Votre visite est confirmee!' +
    'Bien: ' + propertyTitle +
    'Date: ' + date + ' a ' + time +
    'Bonne visite! - ImmoPro.agency',

  newMessage: (senderName: string, propertyTitle: string) =>
    'ImmoPro: Nouveau message de ' + senderName +
    'Concernant: ' + propertyTitle +
    'Repondez sur immopro.agency/messages',

  propertyVerified: (propertyTitle: string) =>
    'ImmoPro: Votre bien a ete verifie!' +
    propertyTitle + ' a obtenu le badge Verifie.' +
    'Vos annonces seront plus visibles! - ImmoPro.agency',

  newVisitRequest: (visitorName: string, propertyTitle: string, date: string) =>
    'ImmoPro: Nouvelle demande de visite!' +
    'De: ' + visitorName +
    'Pour: ' + propertyTitle +
    'Le: ' + date +
    'Repondez sur immopro.agency/dashboard',

  welcomeMessage: (userName: string) =>
    'Bienvenue sur ImmoPro ' + userName + '!' +
    'Trouvez, louez ou vendez en toute confiance en Afrique.' +
    'Demarrez sur: immopro.agency/home',
}
