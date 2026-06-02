'use client'

export const dynamic = 'force-dynamic'

import { Heart, MapPin, Shield, Trash2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

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

const mockFavorites = [
  { id: '1', title: 'Appartement 3 pieces', location: 'Almadies, Dakar', price: 250000, type: 'rent', beds: 3, area: 120, verified: true, gradient: 'from-blue-400 to-blue-600' },
  { id: '2', title: 'Villa moderne 4 ch.', location: 'Ngor, Dakar', price: 85000000, type: 'sale', beds: 4, area: 250, verified: true, gradient: 'from-emerald-400 to-teal-600' },
  { id: '6', title: 'Duplex 5 chambres', location: 'Mermoz, Dakar', price: 75000000, type: 'sale', beds: 5, area: 300, verified: true, gradient: 'from-indigo-400 to-indigo-600' },
]

export default function FavoritesPage() {
  const [items, setItems] = useState(mockFavorites)

  function remove(id: string) {
    playTap()
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Favoris</h1>
        <p className="text-slate-400 text-sm mt-1">{items.length} bien{items.length > 1 ? 's' : ''} sauvegarde{items.length > 1 ? 's' : ''}</p>
      </div>

      <div className="px-5 py-5">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="font-black text-slate-400 text-lg">Aucun favori</p>
            <p className="text-slate-400 text-sm mt-1">Sauvegardez des biens pour les retrouver ici</p>
            <Link href="/search">
              <button className="mt-6 bg-blue-900 text-white font-black px-6 py-3 rounded-2xl">
                Parcourir les biens
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <Link href={'/property/' + p.id} onClick={playTap}>
                  <div className={cn('h-40 bg-gradient-to-br relative', p.gradient)}>
                    {p.verified && (
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
                          <Shield size={8} /> Verifie
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/95 text-slate-900 text-sm font-black px-3 py-1 rounded-xl">
                        {formatPrice(p.price)}{p.type === 'rent' ? '/mois' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 dark:text-white text-base">{p.title}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                      <MapPin size={12} /><span>{p.location}</span>
                    </div>
                  </div>
                  <button onClick={() => remove(p.id)}
                    className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={16} className="text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}
