'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Search, MapPin, Shield, Heart, Wifi, Users } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getPropertyImage } from '@/lib/propertyImages'

function playTap() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.setValueAtTime(700, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08)
    g.gain.setValueAtTime(0.05, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.12)
  } catch(e) {}
}

const cities = ['Toutes', 'Dakar', 'Saly', 'Lac Rose', 'Ziguinchor', 'Saint-Louis', 'Abidjan', 'Casablanca', 'Lagos']

export default function MeublePage() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('Toutes')
  const [saved, setSaved] = useState<string[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let q = supabase.from('properties').select('*')
        .eq('is_meuble', true)
        .eq('status', 'available')
        .order('waitlist_count', { ascending: false })
      if (city !== 'Toutes') q = q.eq('city', city)
      const { data } = await q
      setProperties(data || [])
      setLoading(false)
    }
    fetchData()
  }, [city])

  const filtered = properties.filter(p =>
    query === '' ||
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.city?.toLowerCase().includes(query.toLowerCase())
  )

  function toggleSave(id: string) {
    playTap()
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Appartements Meubles</h1>
            <p className="text-xs text-slate-400 mt-0.5">Sejours courte duree en Afrique</p>
          </div>
        </div>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Ville, quartier..."
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none text-slate-700 dark:text-white placeholder:text-slate-400" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {cities.map(c => (
            <button key={c} onClick={() => { playTap(); setCity(c) }}
              className={cn('flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all',
                city === c ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-slate-500 text-sm font-medium mb-4">
          {loading ? 'Chargement...' : filtered.length + ' logement' + (filtered.length > 1 ? 's' : '') + ' disponible' + (filtered.length > 1 ? 's' : '')}
        </p>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(p => (
              <Link key={p.id} href={'/meuble/' + p.id} onClick={playTap}>
                <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform">
                  <div className="h-48 relative overflow-hidden bg-slate-200">
                    <img src={p.photos?.[0] || getPropertyImage(p.property_type)} alt={p.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = getPropertyImage(p.property_type) }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {p.is_verified && (
                        <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
                          <Shield size={8} /> Verifie
                        </span>
                      )}
                      <span className="bg-yellow-400 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">Meuble</span>
                    </div>
                    {p.waitlist_count > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 bg-rose-500 text-white text-xs font-black px-2 py-1 rounded-full">
                          <Users size={10} /> {p.waitlist_count} en attente
                        </span>
                      </div>
                    )}
                    <button onClick={e => { e.preventDefault(); toggleSave(p.id) }}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <Heart size={14} className={saved.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/95 text-slate-900 text-sm font-black px-3 py-1 rounded-xl">
                        {(p.price_per_night || p.price).toLocaleString('fr-FR')} FCFA
                        <span className="text-slate-500 font-normal text-xs"> /nuit</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 dark:text-white mb-1">{p.title}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-sm mb-2">
                      <MapPin size={12} /><span>{p.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {p.bedrooms && <span>{p.bedrooms} ch.</span>}
                      {p.surface_area && <span>{p.surface_area} m2</span>}
                      {p.amenities?.includes('WiFi') && <span className="flex items-center gap-1"><Wifi size={10} /> WiFi</span>}
                      {p.min_stay && <span>Min. {p.min_stay} nuit{p.min_stay > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="font-black text-slate-400 text-lg">Aucun logement</p>
                <p className="text-slate-400 text-sm mt-1">Essayez une autre ville</p>
              </div>
            )}
          </div>
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}
