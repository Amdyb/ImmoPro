'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Search, MapPin, Heart, Shield, X } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'

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

const allProperties = [
  { id: '1', title: 'Appartement 3 pieces', location: 'Almadies, Dakar', price: 250000, type: 'rent', beds: 3, baths: 2, area: 120, verified: true, propertyType: 'apartment', gradient: 'from-blue-400 to-blue-600' },
  { id: '2', title: 'Villa moderne 4 ch.', location: 'Ngor, Dakar', price: 85000000, type: 'sale', beds: 4, baths: 4, area: 250, verified: true, propertyType: 'villa', gradient: 'from-emerald-400 to-teal-600' },
  { id: '3', title: 'Terrain 600 m2', location: 'Diamniadio, Dakar', price: 15000000, type: 'sale', beds: null, baths: null, area: 600, verified: false, propertyType: 'land', gradient: 'from-amber-400 to-orange-500' },
  { id: '4', title: 'Studio meuble', location: 'Point E, Dakar', price: 150000, type: 'rent', beds: 1, baths: 1, area: 35, verified: true, propertyType: 'apartment', gradient: 'from-purple-400 to-purple-600' },
  { id: '5', title: 'Terrain 1000 m2', location: 'Saly, Mbour', price: 25000000, type: 'sale', beds: null, baths: null, area: 1000, verified: false, propertyType: 'land', gradient: 'from-rose-400 to-pink-600' },
  { id: '6', title: 'Duplex 5 chambres', location: 'Mermoz, Dakar', price: 75000000, type: 'sale', beds: 5, baths: 3, area: 300, verified: true, propertyType: 'house', gradient: 'from-indigo-400 to-indigo-600' },
  { id: '7', title: 'Appartement meuble', location: 'Plateau, Dakar', price: 400000, type: 'rent', beds: 2, baths: 1, area: 80, verified: true, propertyType: 'apartment', gradient: 'from-cyan-400 to-cyan-600' },
  { id: '8', title: 'Villa avec piscine', location: 'Yoff, Dakar', price: 120000000, type: 'sale', beds: 6, baths: 4, area: 450, verified: true, propertyType: 'villa', gradient: 'from-teal-400 to-teal-600' },
]

const listingTypes = ['Tous', 'Vente', 'Location']
const propertyTypes = ['Tous', 'Appartement', 'Villa', 'Maison', 'Terrain']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [listingFilter, setListingFilter] = useState('Tous')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [savedItems, setSavedItems] = useState<string[]>([])

  function toggleSave(id: string) {
    playTap()
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filtered = allProperties.filter(p => {
    const matchQuery = query === '' || p.title.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase())
    const matchListing = listingFilter === 'Tous' || (listingFilter === 'Vente' && p.type === 'sale') || (listingFilter === 'Location' && p.type === 'rent')
    const matchType = typeFilter === 'Tous' ||
      (typeFilter === 'Appartement' && p.propertyType === 'apartment') ||
      (typeFilter === 'Villa' && p.propertyType === 'villa') ||
      (typeFilter === 'Maison' && p.propertyType === 'house') ||
      (typeFilter === 'Terrain' && p.propertyType === 'land')
    return matchQuery && matchListing && matchType
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-white mb-4">Rechercher</h1>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Appartement a Dakar, terrain, villa..."
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-10 pr-12 py-3.5 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {listingTypes.map(t => (
            <button key={t} onClick={() => { playTap(); setListingFilter(t) }}
              className={cn('flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                listingFilter === t ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
              {t}
            </button>
          ))}
          <div className="w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0 mx-1" />
          {propertyTypes.map(t => (
            <button key={t} onClick={() => { playTap(); setTypeFilter(t) }}
              className={cn('flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                typeFilter === t ? 'bg-yellow-400 text-blue-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">
          {filtered.length} bien{filtered.length > 1 ? 's' : ''} trouve{filtered.length > 1 ? 's' : ''}
        </p>
        <div className="space-y-4">
          {filtered.map(p => (
            <Link key={p.id} href={'/property/' + p.id} onClick={playTap}>
              <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform">
                <div className={cn('h-44 bg-gradient-to-br relative', p.gradient)}>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {p.verified && (
                      <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
                        <Shield size={8} /> Verifie
                      </span>
                    )}
                    <span className={cn('text-xs font-black px-2 py-0.5 rounded-full',
                      p.type === 'rent' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-blue-900')}>
                      {p.type === 'rent' ? 'Location' : 'Vente'}
                    </span>
                  </div>
                  <button onClick={e => { e.preventDefault(); toggleSave(p.id) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Heart size={15} className={savedItems.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/95 text-slate-900 text-sm font-black px-3 py-1 rounded-xl">
                      {formatPrice(p.price)}{p.type === 'rent' ? '/mois' : ''}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <MapPin size={12} /><span>{p.location}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                    {p.beds && <span>{p.beds} ch.</span>}
                    {p.baths && <span>{p.baths} sdb.</span>}
                    <span>{p.area} m2</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={48} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="font-black text-slate-400 text-lg">Aucun resultat</p>
            <p className="text-slate-400 text-sm mt-1">Essayez d autres termes de recherche</p>
          </div>
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}
