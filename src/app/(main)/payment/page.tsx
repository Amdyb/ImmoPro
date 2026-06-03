'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { ArrowLeft, CheckCircle, Phone, Smartphone, CreditCard, Shield, Zap } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function playTap() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.setValueAtTime(700, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08)
    g.gain.setValueAtTime(0.05, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.12)
  } catch(e) {}
}

const paymentMethods = [
  { id: 'wave', label: 'Wave', desc: 'Paiement instantane', color: 'bg-blue-500', available: true },
  { id: 'orange_money', label: 'Orange Money', desc: 'Paiement mobile', color: 'bg-orange-500', available: true },
  { id: 'free_money', label: 'Free Money', desc: 'Paiement mobile', color: 'bg-red-500', available: false },
  { id: 'card', label: 'Carte bancaire', desc: 'Visa / Mastercard', color: 'bg-slate-700', available: false },
]

const plans: Record<string, { name: string, price: number, features: string[] }> = {
  starter: { name: 'Starter', price: 5000, features: ['10 annonces', 'Badge Verifie', 'Messagerie illimitee'] },
  pro: { name: 'Pro', price: 15000, features: ['Annonces illimitees', 'Mise en vedette', 'Analytics avances'] },
  premium: { name: 'Premium', price: 35000, features: ['Tout Pro', 'Page agence', 'Gestionnaire dedie'] },
}

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  if (!searchParams) return null
  const planId = searchParams.get('plan') || 'starter'
  const plan = plans[planId] || plans.starter

  const [selectedMethod, setSelectedMethod] = useState('wave')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handlePayment() {
    if (!phone) { toast.error('Entrez votre numero de telephone'); return }
    setLoading(true)
    playTap()

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          amount: plan.price,
          phone,
          plan: planId,
          description: 'ImmoPro Plan ' + plan.name,
        }),
      })
      const data = await res.json()

      if (data.wave_launch_url) {
        window.location.href = data.wave_launch_url
      } else if (data.payment_url) {
        window.location.href = data.payment_url
      } else {
        // Demo mode - show success
        toast.success('Paiement initie! Suivez les instructions sur votre telephone.')
        setTimeout(() => setSuccess(true), 1500)
      }
    } catch(e) {
      toast.error('Erreur de paiement. Reessayez.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle size={36} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Paiement reussi!</h1>
        <p className="text-slate-500 text-center mb-2">Plan {plan.name} active</p>
        <p className="text-blue-900 dark:text-yellow-400 font-black text-xl mb-6">{new Intl.NumberFormat('fr-FR').format(plan.price)} FCFA/mois</p>
        <button onClick={() => router.push('/profile')} className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl">
          Voir mon profil
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-6 px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { playTap(); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-black">Paiement</h1>
            <p className="text-white/50 text-xs">Plan {plan.name} — {new Intl.NumberFormat('fr-FR').format(plan.price)} FCFA/mois</p>
          </div>
        </div>

        {/* Plan summary */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
              <Zap size={18} className="text-blue-900" />
            </div>
            <div>
              <p className="text-white font-black">Plan {plan.name}</p>
              <p className="text-white/60 text-xs">{new Intl.NumberFormat('fr-FR').format(plan.price)} FCFA / mois</p>
            </div>
          </div>
          <div className="space-y-1">
            {plan.features.map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                <span className="text-white/80 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">

        {/* Payment methods */}
        <div>
          <h2 className="font-black text-slate-900 dark:text-white mb-4">Mode de paiement</h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map(method => (
              <button key={method.id}
                onClick={() => { if (method.available) { playTap(); setSelectedMethod(method.id) } }}
                disabled={!method.available}
                className={cn('p-4 rounded-2xl border-2 text-left transition-all relative',
                  !method.available ? 'opacity-40 cursor-not-allowed border-slate-100 dark:border-slate-700' :
                  selectedMethod === method.id ? 'border-blue-900 bg-blue-900/5 dark:border-yellow-400' :
                  'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-2', method.color)}>
                  <Smartphone size={16} className="text-white" />
                </div>
                <p className={cn('font-black text-sm', selectedMethod === method.id ? 'text-blue-900 dark:text-yellow-400' : 'text-slate-900 dark:text-white')}>{method.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{method.desc}</p>
                {!method.available && (
                  <span className="absolute top-2 right-2 text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-lg font-bold">Bientot</span>
                )}
                {selectedMethod === method.id && method.available && (
                  <CheckCircle size={16} className="absolute top-3 right-3 text-blue-900 dark:text-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Phone input */}
        <div>
          <h2 className="font-black text-slate-900 dark:text-white mb-3">Numero de telephone</h2>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+221 77 XXX XX XX"
              type="tel"
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
          </div>
          <p className="text-slate-400 text-xs mt-2">Entrez le numero associe a votre compte {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}</p>
        </div>

        {/* Security notice */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-start gap-3">
          <Shield size={16} className="text-blue-900 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Paiement securise. Vos donnees bancaires ne sont jamais stockees sur nos serveurs. Transaction chiffree SSL.
          </p>
        </div>

        {/* Pay button */}
        <button onClick={handlePayment} disabled={loading || !phone}
          className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
            phone && !loading ? 'bg-yellow-400 text-blue-900 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
          {loading
            ? <><div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> Traitement...</>
            : <>Payer {new Intl.NumberFormat('fr-FR').format(plan.price)} FCFA</>
          }
        </button>

        <div className="h-8" />
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  )
}
