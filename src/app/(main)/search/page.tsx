'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Search, MapPin, Heart, Shield, X, SlidersHorizontal } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { AdBannerStrip } from '@/components/ads/AdBanner'
import { getPropertyImage } from '@/lib/propertyImages'
import { supabase } from '@/lib/supabase'

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

const listingTypes = ['Tous', 'Vente', 'Location']
const propertyTypes = ['Tous', 'Appartement', 'Villa', 'Maison', 'Terrain']

interface Property {
  id: string
  title: string
  city: string | null
  price: number
  listing_type: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  surface_area: number | null
  is_verified: boolean
  photos: string[]
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [listingFilter, setListingFilter] = useState('Tous')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      let q = supabase.from('properties').select('*').eq('status', 'available').order('created_at', { ascending: false })
      if (listingFilter === 'Vente') q = q.eq('listing_type', 'sale')
      if (listingFilter === 'Location') q = q.eq('listing_type', 'rent')
      if (typeFilter === 'Appartement') q = q.eq('property_type', 'apartment')
      if (typeFilter === 'Villa') q = q.eq('property_type', 'villa')
      if (typeFilter === 'Maison') q = q.eq('property_type', 'house')
      if (typeFilter === 'Terrain') q = q.eq('property_type', 'land')
      const { data } = await q
      setProperties(data || [])
      setLoading(false)
    }
    fetchProperties()
  }, [listingFilter, typeFilter])

  const filtered = properties.filter(p =>
    query === '' ||
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    (p.city || '').toLowerCase().includes(query.toLowerCase())
  )

  function toggleSave(id: string) {
    playTap()
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

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
          {loading ? 'Chargement...' : filtered.length + ' bien' + (filtered.length > 1 ? 's' : '') + ' trouve' + (filtered.length > 1 ? 's' : '')}
        </p>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p, index) => (
              <div key={p.id}>
                {index > 0 && index % 3 === 0 && <AdBannerStrip className="mb-4" />}
                <Link href={'/property/' + p.id} onClick={playTap}>
                  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform">
                    <div className="h-44 relative overflow-hidden bg-slate-200">
                      <img
                        src={p.photos?.[0] || getPropertyImage(p.property_type)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = getPropertyImage(p.property_type) }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {p.is_verified && (
                          <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
                            <Shield size={8} /> Verifie
                          </span>
                        )}
                        <span className={cn('text-xs font-black px-2 py-0.5 rounded-full',
                          p.listing_type === 'rent' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-blue-900')}>
                          {p.listing_type === 'rent' ? 'Location' : 'Vente'}
                        </span>
                      </div>
                      <button onClick={e => { e.preventDefault(); toggleSave(p.id) }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                        <Heart size={15} className={savedItems.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                      </button>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/95 text-slate-900 text-sm font-black px-3 py-1 rounded-xl">
                          {formatPrice(p.price)}{p.listing_type === 'rent' ? '/mois' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">{p.title}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                        <MapPin size={12} /><span>{p.city}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                        {p.bedrooms && <span>{p.bedrooms} ch.</span>}
                        {p.bathrooms && <span>{p.bathrooms} sdb.</span>}
                        {p.surface_area && <span>{p.surface_area} m2</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16">
                <Search size={48} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="font-black text-slate-400 text-lg">Aucun resultat</p>
                <p className="text-slate-400 text-sm mt-1">Essayez d autres termes</p>
              </div>
            )}
          </div>
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}
