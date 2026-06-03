'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdBannerProps {
  variant?: 'card' | 'strip' | 'square'
  className?: string
}

const sponsoredAds = [
  {
    id: '1',
    title: 'Century 21 Dakar',
    subtitle: 'Agence immobiliere de confiance depuis 1995',
    cta: 'Contacter',
    color: 'from-blue-900 to-blue-700',
    textColor: 'text-white',
    badge: 'Sponsor',
  },
  {
    id: '2',
    title: 'Banque de l Habitat du Senegal',
    subtitle: 'Financement immobilier jusqu a 25 ans',
    cta: 'Simuler mon pret',
    color: 'from-emerald-600 to-emerald-800',
    textColor: 'text-white',
    badge: 'Partenaire',
  },
  {
    id: '3',
    title: 'SICAP Liberte',
    subtitle: 'Nouveaux logements sociaux disponibles',
    cta: 'En savoir plus',
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-white',
    badge: 'Promo',
  },
]

export function AdBannerCard({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState(false)
  const ad = sponsoredAds[Math.floor(Math.random() * sponsoredAds.length)]

  if (dismissed) return null

  return (
    <div className={cn('relative rounded-3xl overflow-hidden p-4 bg-gradient-to-br shadow-lg', ad.color, className)}>
      <button onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
        <X size={12} className="text-white" />
      </button>
      <div className="absolute top-3 left-3">
        <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">{ad.badge}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-white font-black text-base">{ad.title}</h3>
        <p className="text-white/70 text-xs mt-1 mb-3">{ad.subtitle}</p>
        <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-black px-4 py-2 rounded-xl transition-all">
          {ad.cta} <ExternalLink size={12} />
        </button>
      </div>
    </div>
  )
}

export function AdBannerStrip({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState(false)
  const ad = sponsoredAds[0]

  if (dismissed) return null

  return (
    <div className={cn('relative flex items-center gap-3 bg-gradient-to-r rounded-2xl p-3', ad.color, className)}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">{ad.badge}</span>
          <p className="text-white font-black text-sm">{ad.title}</p>
        </div>
        <p className="text-white/70 text-xs mt-0.5">{ad.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-xl">
          {ad.cta}
        </button>
        <button onClick={() => setDismissed(true)} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <X size={10} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export function GoogleAdSlot({ slot, className }: { slot: string, className?: string }) {
  return (
    <div className={cn('bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-dashed border-slate-200 dark:border-slate-700 min-h-16 flex items-center justify-center', className)}>
      <div className="text-center py-4">
        <p className="text-slate-300 dark:text-slate-600 text-xs font-bold">Google AdSense</p>
        <p className="text-slate-200 dark:text-slate-700 text-xs">Slot: {slot}</p>
      </div>
    </div>
  )
}

export default function AdBanner({ variant = 'card', className }: AdBannerProps) {
  if (variant === 'strip') return <AdBannerStrip className={className} />
  return <AdBannerCard className={className} />
}
