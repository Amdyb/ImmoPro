'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Search, Bell, MapPin, SlidersHorizontal, Heart, ChevronRight, Shield, Home, Key, Layers, Building, Building2, Store, Plus } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useProperties } from '@/hooks/useProperties'
import { getPropertyImage } from '@/lib/propertyImages'
import { AdBannerCard, AdBannerStrip } from '@/components/ads/AdBanner'

const categories = [
  { id: 'all', label: 'Tout', bg: 'bg-slate-600', icon: Home },
  { id: 'buy', label: 'Acheter', bg: 'bg-blue-900', icon: Home },
  { id: 'rent', label: 'Louer', bg: 'bg-emerald-500', icon: Key },
  { id: 'land', label: 'Terrain', bg: 'bg-amber-500', icon: Layers },
  { id: 'apartment', label: 'Appart.', bg: 'bg-purple-500', icon: Building },
  { id: 'house', label: 'Maison', bg: 'bg-rose-500', icon: Building2 },
]

const gradients: Record<string, string> = {
  apartment: 'from-blue-400 to-blue-600',
  villa: 'from-emerald-400 to-teal-600',
  land: 'from-amber-400 to-orange-500',
  house: 'from-rose-400 to-pink-600',
  commercial: 'from-slate-400 to-slate-600',
  office: 'from-indigo-400 to-indigo-600',
}

function playTap() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.setValueAtTime(800, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15)
  } catch(e) {}
}

function playSave() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(440, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2)
  } catch(e) {}
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [userCity, setUserCity] = useState('Afrique')
  const [searchQuery, setSearchQuery] = useState('')

  const { properties: featured, loading: loadingFeatured } = useProperties({ is_featured: true })
  const { properties: recent, loading: loadingRecent } = useProperties()

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch('https://nominatim.openstreetmap.org/reverse?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&format=json&accept-language=fr')
          .then(r => r.json())
          .then(data => {
            const city = data.address?.city || data.address?.town || data.address?.state || 'Votre ville'
            const country = data.address?.country || ''
            setUserCity(city + ', ' + country)
          })
          .catch(() => {})
      },
      () => {}
    )
  }, [])

  function toggleSave(id: string) {
    playSave()
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filteredRecent = recent.filter(p => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'buy') return p.listing_type === 'sale'
    if (activeCategory === 'rent') return p.listing_type === 'rent'
    if (activeCategory === 'land') return p.property_type === 'land'
    if (activeCategory === 'apartment') return p.property_type === 'apartment'
    if (activeCategory === 'house') return p.property_type === 'house'
    return true
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ImmoPro" className="w-8 h-8 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div>
              <div className="flex items-center gap-1">
                <MapPin size={12} className="text-yellow-500" />
                <span className="text-xs text-slate-500 font-medium">{userCity}</span>
              </div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">ImmoPro</h1>
            </div>
          </div>
          <a href="/notifications">
            <button onClick={playTap} className="relative w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Bell size={18} className="text-slate-700 dark:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" />
            </button>
          </a>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un bien, quartier, ville..."
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-10 pr-12 py-3.5 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none" />
          <button onClick={playTap} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-900 rounded-xl flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-white" />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-7">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button key={cat.id} onClick={() => { playTap(); setActiveCategory(cat.id) }} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200', cat.bg, activeCategory === cat.id ? 'scale-110 shadow-lg' : 'opacity-75')}>
                  <Icon size={22} className="text-white" strokeWidth={1.8} />
                </div>
                <span className={cn('text-xs font-bold', activeCategory === cat.id ? 'text-blue-900 dark:text-yellow-400' : 'text-slate-500')}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold">Annonces verifiees</span>
            </div>
            <h2 className="text-white text-xl font-black leading-tight mb-1">Trouvez le bien qui vous correspond</h2>
            <p className="text-white/60 text-xs mb-4">Des biens authentifies pour votre tranquillite.</p>
            <Link href="/search">
              <button onClick={playTap} className="bg-yellow-400 text-blue-900 font-black text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform">
                Voir les biens
              </button>
            </Link>
          </div>
        </div>

        <AdBannerCard />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">En vedette</h2>
            <Link href="/search" className="flex items-center gap-0.5 text-blue-900 dark:text-yellow-400 text-xs font-bold">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          {loadingFeatured ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex-shrink-0 w-52 h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5">
              {featured.slice(0, 5).map((p) => (
                <Link key={p.id} href={'/property/' + p.id} className="flex-shrink-0 w-52" onClick={playTap}>
                  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="h-36 relative overflow-hidden bg-slate-200">
                      <img src={p.photos?.[0] || getPropertyImage(p.property_type)} alt={p.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                      {p.is_verified && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
                            <Shield size={8} /> Verifie
                          </span>
                        </div>
                      )}
                      <button onClick={(e) => { e.preventDefault(); toggleSave(p.id) }} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                        <Heart size={14} className={savedItems.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                      </button>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="bg-white/95 text-slate-900 text-xs font-black px-2.5 py-1 rounded-xl">
                          {formatPrice(p.price)}{p.listing_type === 'rent' ? '/mois' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-slate-900 dark:text-white text-sm leading-tight mb-1">{p.title}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
                        <MapPin size={10} /><span>{p.city}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-slate-500">
                        {p.bedrooms && <span>{p.bedrooms} ch.</span>}
                        {p.bathrooms && <span>{p.bathrooms} sdb.</span>}
                        {p.surface_area && <span>{p.surface_area} m2</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <AdBannerStrip />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {activeCategory === 'all' ? 'Annonces recentes' : 'Resultats filtres'}
              {' '}
              <span className="text-slate-400 font-normal text-sm">({filteredRecent.length})</span>
            </h2>
            <Link href="/search" className="flex items-center gap-0.5 text-blue-900 dark:text-yellow-400 text-xs font-bold">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          {loadingRecent ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecent.slice(0, 6).map((p) => (
                <Link key={p.id} href={'/property/' + p.id} onClick={playTap}>
                  <div className="bg-white dark:bg-slate-800 rounded-3xl flex overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-slate-200">
                    <img src={p.photos?.[0] || getPropertyImage(p.property_type)} alt={p.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                  </div>
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-slate-900 dark:text-white text-sm leading-tight">{p.title}</h3>
                        <button onClick={(e) => { e.preventDefault(); toggleSave(p.id) }}>
                          <Heart size={16} className={savedItems.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-300'} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 mb-2">
                        <MapPin size={10} /><span>{p.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-900 dark:text-yellow-400 font-black text-sm">
                          {formatPrice(p.price)}{p.listing_type === 'rent' ? '/mois' : ''}
                        </span>
                        {p.is_verified && (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <Shield size={10} /> Verifie
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="h-4" />
      </div>

      <a href="/add-property"
        className="fixed bottom-24 right-5 z-50 w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 active:scale-95 transition-transform">
        <Plus size={26} className="text-blue-900" strokeWidth={2.5} />
      </a>
    </div>
  )
}
