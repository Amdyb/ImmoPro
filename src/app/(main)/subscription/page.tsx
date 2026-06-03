'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Check, Star, Zap, Crown, ArrowLeft, Shield, MessageCircle, BarChart3, Bell, Camera, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { playSound } from '@/lib/sounds'

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: '',
    color: 'from-slate-500 to-slate-600',
    icon: Star,
    description: 'Pour decouvrir ImmoPro',
    features: [
      '3 annonces maximum',
      '3 photos par annonce',
      'Recherche de base',
      'Messagerie limitee',
      'Profil standard',
    ],
    limitations: [
      'Pas de mise en vedette',
      'Pas d analytics',
      'Support standard',
    ],
    cta: 'Plan actuel',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 5000,
    period: '/mois',
    color: 'from-blue-600 to-blue-800',
    icon: Zap,
    description: 'Pour les proprietaires actifs',
    features: [
      '10 annonces',
      '10 photos par annonce',
      'Badge Verifie',
      'Messagerie illimitee',
      'Statistiques de base',
      'Support prioritaire',
      'Recherche avancee',
    ],
    limitations: [],
    cta: 'Choisir Starter',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15000,
    period: '/mois',
    color: 'from-blue-900 to-indigo-900',
    icon: Crown,
    description: 'Pour les agents et agences',
    features: [
      'Annonces illimitees',
      '20 photos par annonce',
      'Badge Pro verifie',
      'Mise en vedette 3 annonces/mois',
      'Analytics avances',
      'Page agence personnalisee',
      'Notifications WhatsApp',
      'Support dedie',
      'QR code par annonce',
    ],
    limitations: [],
    cta: 'Choisir Pro',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 35000,
    period: '/mois',
    color: 'from-yellow-500 to-amber-600',
    icon: Crown,
    description: 'Pour les grandes agences',
    features: [
      'Tout du plan Pro',
      'Annonces illimitees',
      'Mise en vedette illimitee',
      'Logo et banniere personnalises',
      'Sous-domaine dedie',
      'API access',
      'Gestionnaire de compte dedie',
      'Formation et onboarding',
      'Rapport mensuel detaille',
    ],
    limitations: [],
    cta: 'Contacter Sales',
    popular: false,
  },
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('free')
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  function handleSelect(planId: string) {
    playSound('tap')
    setSelected(planId)
  }

  function handleSubscribe(planId: string) {
    playSound('success')
    if (planId === 'free') return
    if (planId === 'premium') {
      window.open('https://wa.me/221771234567?text=Je souhaite souscrire au plan Premium ImmoPro', '_blank')
      return
    }
    // Future: integrate Wave/Orange Money payment
    alert('Paiement via Wave/Orange Money - Bientot disponible!')
  }

  const getPrice = (price: number) => {
    if (price === 0) return 'Gratuit'
    const discounted = billing === 'yearly' ? Math.round(price * 0.8) : price
    return new Intl.NumberFormat('fr-FR').format(discounted) + ' FCFA'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Header */}
      <div className="bg-blue-900 pt-14 pb-8 px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { playSound('tap'); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-black">Abonnements</h1>
        </div>
        <p className="text-white/70 text-sm mb-2">Choisissez le plan adapte a votre activite</p>
        <div className="flex items-center gap-2 bg-emerald-500/20 rounded-xl px-3 py-2 w-fit">
          <span className="text-emerald-300 text-xs font-black">100% GRATUIT pour les locataires et acheteurs</span>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-1 w-fit">
          <button onClick={() => { playSound('tap'); setBilling('monthly') }}
            className={cn('px-4 py-2 rounded-xl text-sm font-bold transition-all', billing === 'monthly' ? 'bg-white text-blue-900' : 'text-white')}>
            Mensuel
          </button>
          <button onClick={() => { playSound('tap'); setBilling('yearly') }}
            className={cn('px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5', billing === 'yearly' ? 'bg-white text-blue-900' : 'text-white')}>
            Annuel
            <span className={cn('text-xs font-black px-1.5 py-0.5 rounded-lg', billing === 'yearly' ? 'bg-emerald-500 text-white' : 'bg-emerald-400/30 text-emerald-300')}>-20%</span>
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {plans.map(plan => {
          const Icon = plan.icon
          const isSelected = selected === plan.id
          return (
            <div key={plan.id} onClick={() => handleSelect(plan.id)}
              className={cn('bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border-2 transition-all cursor-pointer',
                isSelected ? 'border-blue-900 dark:border-yellow-400' : 'border-transparent',
                plan.popular ? 'shadow-xl shadow-blue-900/10' : '')}>

              {plan.popular && (
                <div className="bg-yellow-400 text-blue-900 text-center text-xs font-black py-1.5">
                  Plus populaire
                </div>
              )}

              {/* Plan header */}
              <div className={cn('bg-gradient-to-r p-5', plan.color)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Icon size={20} className={plan.id === 'premium' ? 'text-blue-900' : 'text-white'} />
                    </div>
                    <div>
                      <p className={cn('font-black text-lg', plan.id === 'premium' ? 'text-blue-900' : 'text-white')}>{plan.name}</p>
                      <p className={cn('text-xs', plan.id === 'premium' ? 'text-blue-900/70' : 'text-white/70')}>{plan.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('font-black text-xl', plan.id === 'premium' ? 'text-blue-900' : 'text-white')}>
                      {getPrice(plan.price)}
                    </p>
                    {plan.price > 0 && (
                      <p className={cn('text-xs', plan.id === 'premium' ? 'text-blue-900/70' : 'text-white/70')}>{plan.period}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-4 space-y-2">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-emerald-600" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{f}</span>
                  </div>
                ))}
                {plan.limitations.map(l => (
                  <div key={l} className="flex items-center gap-2 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-400 text-xs font-bold">-</span>
                    </div>
                    <span className="text-slate-400 text-sm line-through">{l}</span>
                  </div>
                ))}

                <button onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id) }}
                  className={cn('w-full py-3 rounded-2xl font-black text-sm mt-3 transition-all active:scale-95',
                    plan.id === 'free' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default' :
                    plan.popular ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' :
                    plan.id === 'premium' ? 'bg-yellow-400 text-blue-900' :
                    'bg-blue-900/10 text-blue-900 dark:text-yellow-400')}>
                  {plan.cta}
                </button>
              </div>
            </div>
          )
        })}

        {/* Payment methods */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="font-black text-slate-900 dark:text-white text-sm mb-3">Moyens de paiement acceptes</p>
          <div className="flex gap-3 flex-wrap">
            {['Wave', 'Orange Money', 'Free Money', 'Carte bancaire'].map(method => (
              <span key={method} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl">
                {method}
              </span>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
