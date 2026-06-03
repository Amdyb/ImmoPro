'use client'

import { useState } from 'react'
import { X, ExternalLink, MapPin, Building } from 'lucide-react'
import { cn } from '@/lib/utils'

const sponsoredAds = [
  {
    id: '1',
    brand: 'SenegIndia',
    title: 'Leader de l immobilier au Senegal',
    subtitle: 'Appartements, villas et terrains a Dakar, Diamniadio et partout au Senegal.',
    cta: 'Decouvrir nos projets',
    badge: 'Sponsor Premium',
    location: 'Dakar · Diamniadio',
    color: 'from-[#1a3a6b] to-[#0f2347]',
    accent: '#f0a500',
    projects: ['SV CITY - Yoff', 'SD CITY - Diamniadio', 'SN CITY - Ndiakhirate'],
  },
  {
    id: '2',
    brand: 'SenegIndia',
    title: 'SV CITY - Yoff Virage',
    subtitle: 'Villas et appartements modernes avec titre foncier. Certification ISO.',
    cta: 'En savoir plus',
    badge: 'Nouveau projet',
    location: 'Yoff, Dakar',
    color: 'from-[#0f2347] to-[#1a3a6b]',
    accent: '#f0a500',
    projects: [],
  },
  {
    id: '3',
    brand: 'SenegIndia',
    title: 'SD CITY - Diamniadio',
    subtitle: 'Terrains viabilises titre foncier. Investissez dans la nouvelle ville.',
    cta: 'Voir les terrains',
    badge: 'Disponible',
    location: 'Diamniadio',
    color: 'from-[#1a3a6b] to-[#243f6e]',
    accent: '#f0a500',
    projects: [],
  },
]

export function AdBannerCard({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState(false)
  const [current, setCurrent] = useState(0)
  const ad = sponsoredAds[current]

  if (dismissed) return null

  return (
    <div className={cn('relative rounded-3xl overflow-hidden shadow-xl', className)}>
      {/* Hero Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={[
            '/senegindia-1.png',
            '/senegindia-2.png',
            'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
          ][current] || '/senegindia-1.png'}
          alt="SenegIndia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2347]/90 to-[#0f2347]/20" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: ad.accent }}>
            <Building size={14} className="text-white" />
          </div>
          <span className="text-white font-black text-sm">{ad.brand}</span>
        </div>
        <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <X size={12} className="text-white" />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: ad.accent + '99' }}>{ad.badge}</span>
        </div>
      </div>

      {/* Background */}
      <div className={cn('bg-gradient-to-br p-4', ad.color)}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: ad.accent, transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-5" style={{ background: ad.accent, transform: 'translate(-30%, 30%)' }} />

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-white font-black text-base leading-tight mb-1">{ad.title}</h3>
          <p className="text-white/70 text-xs mb-3 leading-relaxed">{ad.subtitle}</p>

          {ad.projects.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {ad.projects.map(p => (
                <span key={p} className="text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>{p}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/60 text-xs">
              <MapPin size={10} />
              <span>{ad.location}</span>
            </div>
            <button className="flex items-center gap-1 font-black text-xs px-4 py-2 rounded-xl" style={{ background: ad.accent, color: '#0f2347' }}>
              {ad.cta} <ExternalLink size={11} />
            </button>
          </div>
        </div>

        {/* Dots */}
        {sponsoredAds.length > 1 && (
          <div className="flex gap-1.5 mt-4 relative z-10">
            {sponsoredAds.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={cn('h-1 rounded-full transition-all', i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/30')} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function AdBannerStrip({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState(false)
  const ad = sponsoredAds[0]

  if (dismissed) return null

  return (
    <div className={cn('relative flex items-center gap-3 rounded-2xl p-3 overflow-hidden bg-gradient-to-r', ad.color, className)}>
      <div className="absolute right-0 top-0 bottom-0 w-20 opacity-10 rounded-l-full" style={{ background: ad.accent }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ad.accent }}>
        <Building size={16} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-white font-black text-xs">{ad.brand} — {ad.title}</p>
        <p className="text-white/60 text-xs mt-0.5">{ad.location}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
        <button className="font-black text-xs px-3 py-1.5 rounded-xl whitespace-nowrap" style={{ background: ad.accent, color: '#0f2347' }}>
          Voir
        </button>
        <button onClick={() => setDismissed(true)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <X size={10} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default function AdBanner({ className }: { className?: string }) {
  return <AdBannerCard className={className} />
}
