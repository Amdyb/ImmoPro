'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { MapPin, Shield, Heart, Bell, ChevronRight, Search, Plus, Star, Home, Building, Trees, Key, Tag } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getPropertyImage } from '@/lib/propertyImages'
import { AdBannerCard, AdBannerStrip } from '@/components/ads/AdBanner'

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

function PropertyCard({ p, saved, onSave }: { p: any, saved: boolean, onSave: () => void }) {
  return (
    <Link href={p.is_meuble ? '/meuble/' + p.id : '/property/' + p.id} onClick={playTap}>
      <div className="w-52 flex-shrink-0 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform">
        <div className="h-36 relative overflow-hidden bg-slate-200">
          <img src={p.photos?.[0] || getPropertyImage(p.property_type)} alt={p.title}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = getPropertyImage(p.property_type) }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {p.is_verified && (
              <span className="flex items-center gap-0.5 bg-white/90 text-blue-900 text-xs font-black px-1.5 py-0.5 rounded-full">
                <Shield size={7} /> Verifie
              </span>
            )}
            {p.is_meuble && (
              <span className="bg-yellow-400 text-blue-900 text-xs font-black px-1.5 py-0.5 rounded-full">Meuble</span>
            )}
            {!p.is_meuble && (
              <span className={cn('text-xs font-black px-1.5 py-0.5 rounded-full',
                p.listing_type === 'rent' ? 'bg-emerald-500 text-white' : 'bg-blue-900 text-white')}>
                {p.listing_type === 'rent' ? 'Location' : 'Vente'}
              </span>
            )}
          </div>
          <button onClick={e => { e.preventDefault(); onSave() }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
            <Heart size={13} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
          </button>
          <div className="absolute bottom-2 left-2">
            <span className="bg-white/95 text-slate-900 text-xs font-black px-2 py-0.5 rounded-lg">
              {formatPrice(p.price_per_night || p.price)}
              {p.is_meuble ? '/nuit' : p.listing_type === 'rent' ? '/mois' : ''}
            </span>
          </div>
        </div>
        <div className="p-3">
          <p className="font-black text-slate-900 dark:text-white text-sm leading-tight line-clamp-1">{p.title}</p>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
            <MapPin size={10} /><span className="truncate">{p.city}</span>
          </div>
          {p.waitlist_count > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-500 text-xs font-bold">{p.waitlist_count} en attente</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function Row({ title, icon: Icon, properties, link, saved, onSave }: {
  title: string
  icon: any
  properties: any[]
  link: string
  saved: string[]
  onSave: (id: string) => void
}) {
  if (properties.length === 0) return null
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-900/10 dark:bg-blue-900/30 flex items-center justify-center">
            <Icon size={14} className="text-blue-900 dark:text-yellow-400" />
          </div>
          <h2 className="text-base font-black text-slate-900 dark:text-white">{title}</h2>
        </div>
        <Link href={link} onClick={playTap}>
          <span className="text-blue-900 dark:text-yellow-400 text-xs font-bold flex items-center gap-0.5">
            Voir tout <ChevronRight size={14} />
          </span>
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {properties.map(p => (
          <PropertyCard key={p.id} p={p} saved={saved.includes(p.id)} onSave={() => onSave(p.id)} />
        ))}
      </div>
    </div>
  )
}

function HeroSection({ variant }: { variant: 'primary' | 'secondary' }) {
  if (variant === 'primary') {
    return (
      <div className="mx-5 mb-6">
        <AdBannerCard />
      </div>
    )
  }
  return (
    <div className="mx-5 mb-6">
      <AdBannerStrip />
    </div>
  )
}

export default function HomePage() {
  const [saved, setSaved] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [location, setLocation] = useState('Afrique')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Record<string, any[]>>({
    featured: [],
    apptRent: [],
    meuble: [],
    houseRent: [],
    houseSale: [],
    terrains: [],
    champs: [],
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => setLocation('Dakar'))
    }
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: all } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
    if (!all) { setLoading(false); return }

    setData({
      featured: all.filter(p => p.is_featured).slice(0, 8),
      apptRent: all.filter(p => p.property_type === 'apartment' && p.listing_type === 'rent' && !p.is_meuble).slice(0, 8),
      meuble: all.filter(p => p.is_meuble).sort((a, b) => (b.waitlist_count || 0) - (a.waitlist_count || 0)).slice(0, 8),
      houseRent: all.filter(p => ['house', 'villa'].includes(p.property_type) && p.listing_type === 'rent' && !p.is_meuble).slice(0, 8),
      houseSale: all.filter(p => ['house', 'villa', 'apartment'].includes(p.property_type) && p.listing_type === 'sale').slice(0, 8),
      terrains: all.filter(p => p.property_type === 'land' && !p.is_agricultural).slice(0, 8),
      champs: all.filter(p => p.property_type === 'land' && p.is_agricultural).slice(0, 8),
    })
    setLoading(false)
  }

  function toggleSave(id: string) {
    playTap()
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon apres-midi' : 'Bonsoir'
  const userName = user?.email?.split('@')[0] || ''

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
              <MapPin size={11} className="text-yellow-500" />
              <span>{location}</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {greeting}{userName ? ', ' + userName : ''}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <button className="relative w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bell size={18} className="text-slate-700 dark:text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" />
              </button>
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-blue-900 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="ImmoPro" className="w-8 h-8 object-contain"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <Link href="/search" onClick={playTap}>
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <span className="text-slate-400 text-sm">Rechercher un logement...</span>
          </div>
        </Link>
      </div>

      <div className="py-5">
        {loading ? (
          <div className="space-y-8 px-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-xl w-40 mb-3 animate-pulse" />
                <div className="flex gap-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-52 h-48 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* 1 — En Vedette */}
            <Row title="En Vedette" icon={Star} properties={data.featured} link="/search" saved={saved} onSave={toggleSave} />

            {/* 2 — Appartements a louer */}
            <Row title="Appartements a Louer" icon={Building} properties={data.apptRent} link="/search" saved={saved} onSave={toggleSave} />

            {/* 3 — Appartements Meubles */}
            <Row title="Appartements Meubles" icon={Key} properties={data.meuble} link="/meuble" saved={saved} onSave={toggleSave} />

            {/* Hero Ad 1 */}
            <HeroSection variant="primary" />

            {/* 4 — Maisons a louer */}
            <Row title="Maisons a Louer" icon={Home} properties={data.houseRent} link="/search" saved={saved} onSave={toggleSave} />

            {/* 5 — Maisons a vendre */}
            <Row title="Maisons a Vendre" icon={Tag} properties={data.houseSale} link="/search" saved={saved} onSave={toggleSave} />

            {/* Hero Ad 2 */}
            <HeroSection variant="secondary" />

            {/* 6 — Terrains */}
            <Row title="Terrains" icon={MapPin} properties={data.terrains} link="/search" saved={saved} onSave={toggleSave} />

            {/* 7 — Champs */}
            <Row title="Champs Agricoles" icon={Trees} properties={data.champs} link="/search" saved={saved} onSave={toggleSave} />
          </>
        )}
        <div className="h-24" />
      </div>

      {/* FAB */}
      <Link href="/add-property">
        <button onClick={playTap}
          className="fixed bottom-20 right-5 w-14 h-14 bg-yellow-400 rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform z-40">
          <Plus size={24} className="text-blue-900" />
        </button>
      </Link>
    </div>
  )
}
