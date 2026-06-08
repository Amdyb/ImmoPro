'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Share2, Shield, MapPin, Bed, Bath, Maximize, Phone, MessageCircle, Calendar, ChevronLeft, ChevronRight, CheckCircle, Copy, Link as LinkIcon, Building, Trees, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, formatPrice } from '@/lib/utils'
import { AdBannerCard } from '@/components/ads/AdBanner'
import { getPropertyImages } from '@/lib/propertyImages'
import { supabase } from '@/lib/supabase'

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

const titleTypeLabels: Record<string, string> = {
  titre_foncier: 'Titre Foncier',
  tni: 'T.N.I',
  deliberation: 'Deliberation',
  bail_99_ans: 'Bail 99 ans',
}

const landUseLabels: Record<string, string> = {
  residential: 'Residentiel',
  agricultural: 'Agricole',
  commercial: 'Commercial',
  mixed: 'Mixte',
}

const nearbyTypes = [
  { type: 'mosque', label: 'Mosquee', icon: '🕌', keyword: 'mosque' },
  { type: 'school', label: 'Ecole', icon: '🏫', keyword: 'school' },
  { type: 'hospital', label: 'Hopital', icon: '🏥', keyword: 'hospital' },
  { type: 'supermarket', label: 'Supermarche', icon: '🛒', keyword: 'supermarket' },
  { type: 'airport', label: 'Aeroport', icon: '✈️', keyword: 'airport' },
  { type: 'market', label: 'Marche', icon: '🏪', keyword: 'market' },
  { type: 'beach', label: 'Plage', icon: '🏖', keyword: 'beach' },
  { type: 'restaurant', label: 'Restaurant', icon: '🍽', keyword: 'restaurant' },
]

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function formatDist(km: number) {
  return km < 1 ? Math.round(km * 1000) + 'm' : km.toFixed(1) + 'km'
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [nearby, setNearby] = useState<any[]>([])
  const [loadingNearby, setLoadingNearby] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      const { data } = await supabase.from('properties').select('*').eq('id', params.id).single()
      setProperty(data)
      setLoading(false)
      if (data) {
        await supabase.from('properties').update({ views_count: (data.views_count || 0) + 1 }).eq('id', params.id)
        if (data.latitude && data.longitude) fetchNearby(data.latitude, data.longitude)
      }
    }
    fetchProperty()
  }, [params.id])

  async function fetchNearby(lat: number, lng: number) {
    setLoadingNearby(true)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) { setLoadingNearby(false); return }

    const results: any[] = []
    for (const poi of nearbyTypes.slice(0, 4)) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&keyword=${poi.keyword}&key=${apiKey}`
        const res = await fetch('/api/nearby?lat=' + lat + '&lng=' + lng + '&keyword=' + poi.keyword)
        const data = await res.json()
        if (data.results?.[0]) {
          const place = data.results[0]
          const dist = getDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)
          results.push({ ...poi, name: place.name, distance: dist })
        }
      } catch(e) {}
    }
    setNearby(results)
    setLoadingNearby(false)
  }

  function copyLink() {
    playTap()
    navigator.clipboard.writeText('https://immopro.agency/property/' + params.id).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareWhatsApp() {
    playTap()
    if (!property) return
    const url = 'https://immopro.agency/property/' + params.id
    const text = 'Decouvrez ce logement sur ImmoPro: ' + property.title + ' - ' + formatPrice(property.price) + (property.listing_type === 'rent' ? '/mois' : '') + ' a ' + property.city + '. ' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
    </div>
  )

  if (!property) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <p className="font-black text-slate-900 text-xl mb-2">Logement introuvable</p>
      <button onClick={() => router.back()} className="text-blue-900 font-bold">Retour</button>
    </div>
  )

  const images = property.photos?.length > 0 ? property.photos : getPropertyImages(property.property_type)
  const isLand = property.property_type === 'land'
  const ownerPhone = '+221771234567'

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* Gallery */}
      <div className="relative h-72 overflow-hidden bg-slate-200">
        <img src={images[photoIndex % images.length]} alt={property.title}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = getPropertyImages(property.property_type)[0] }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {photoIndex > 0 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i - 1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
            <ChevronLeft size={18} className="text-slate-700" />
          </button>
        )}
        {photoIndex < images.length - 1 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i + 1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
            <ChevronRight size={18} className="text-slate-700" />
          </button>
        )}

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12">
          <button onClick={() => { playTap(); router.back() }}
            className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => { playTap(); setShowShare(!showShare) }}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Share2 size={18} className="text-slate-700" />
            </button>
            <button onClick={() => { playTap(); setSaved(!saved) }}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Heart size={18} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 flex gap-2">
          {property.is_verified && (
            <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
              <Shield size={8} /> Verifie
            </span>
          )}
          {property.is_meuble && (
            <span className="bg-yellow-400 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">Meuble</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">
          {photoIndex + 1}/{images.length}
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowShare(false)}>
          <div className="w-full bg-white dark:bg-slate-800 rounded-t-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-4">Partager</h3>
            <div className="space-y-3">
              <button onClick={shareWhatsApp}
                className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900">WhatsApp</p>
                  <p className="text-slate-500 text-xs">Partager via WhatsApp</p>
                </div>
              </button>
              <button onClick={copyLink}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center">
                  {copied ? <CheckCircle size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900">{copied ? 'Copie!' : 'Copier le lien'}</p>
                  <p className="text-slate-500 text-xs">immopro.agency/property/...</p>
                </div>
              </button>
            </div>
            <button onClick={() => setShowShare(false)} className="w-full mt-4 py-3 text-slate-500 font-bold">Fermer</button>
          </div>
        </div>
      )}

      <div className="px-5 py-5 space-y-5 pb-32">

        {/* Title + price */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight flex-1">
              {formatPrice(property.price_per_night || property.price)}
              <span className="text-base font-bold text-slate-400 ml-1">
                {property.is_meuble ? '/nuit' : property.listing_type === 'rent' ? '/mois' : ''}
              </span>
            </h1>
            <span className={cn('flex-shrink-0 text-xs font-black px-3 py-1 rounded-xl mt-1',
              property.listing_type === 'rent' && !property.is_meuble ? 'bg-emerald-100 text-emerald-700' :
              property.is_meuble ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700')}>
              {property.is_meuble ? 'Meuble' : property.listing_type === 'rent' ? 'Location' : 'Vente'}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">{property.title}</h2>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <MapPin size={14} className="text-yellow-500" />
            <span>{property.address ? property.address + ', ' : ''}{property.city}</span>
          </div>
          {property.price_per_week && (
            <p className="text-slate-400 text-xs mt-1">
              {property.price_per_week.toLocaleString('fr-FR')} FCFA/semaine · Min. {property.min_stay} nuit{property.min_stay > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: isLand ? Trees : Bed, value: isLand ? (property.is_agricultural ? 'Agricole' : 'Terrain') : (property.bedrooms || '-'), label: isLand ? 'Usage' : 'Chambres' },
            { icon: isLand ? Building : Bath, value: isLand ? (titleTypeLabels[property.title_type] || '-') : (property.bathrooms || '-'), label: isLand ? 'Titre' : 'SDB' },
            { icon: Maximize, value: property.surface_area ? property.surface_area + (property.is_agricultural ? ' ha' : ' m2') : '-', label: 'Surface' },
            { icon: isLand ? MapPin : Clock, value: isLand ? (property.city || '-') : (property.property_type), label: isLand ? 'Ville' : 'Type' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
              <Icon size={16} className="text-blue-900 dark:text-yellow-400 mx-auto mb-1" />
              <p className="font-black text-slate-900 dark:text-white text-xs leading-tight">{value}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Land title info */}
        {isLand && property.title_type && (
          <div className="bg-blue-900/5 dark:bg-blue-900/20 rounded-3xl p-4">
            <h3 className="font-black text-blue-900 dark:text-yellow-400 mb-3 flex items-center gap-2">
              <Shield size={16} /> Informations juridiques
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type de titre</span>
                <span className="font-black text-slate-900 dark:text-white">{titleTypeLabels[property.title_type] || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Usage</span>
                <span className="font-black text-slate-900 dark:text-white">{landUseLabels[property.land_use] || '-'}</span>
              </div>
              {property.is_agricultural && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Type</span>
                  <span className="font-black text-emerald-600">Terrain agricole</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
            <h3 className="font-black text-slate-900 dark:text-white mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {showFullDesc ? property.description : property.description.slice(0, 150) + (property.description.length > 150 ? '...' : '')}
            </p>
            {property.description.length > 150 && (
              <button onClick={() => { playTap(); setShowFullDesc(!showFullDesc) }}
                className="text-blue-900 dark:text-yellow-400 font-black text-sm mt-2">
                {showFullDesc ? 'Voir moins' : 'Voir plus'}
              </button>
            )}
          </div>
        )}

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-3">Equipements</h3>
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map((a: string) => (
                <div key={a} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-2">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby POIs */}
        {property.latitude && (
          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-3">A proximite</h3>
            {loadingNearby ? (
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
              </div>
            ) : nearby.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {nearby.map(poi => (
                  <div key={poi.type} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-2">
                    <span className="text-xl flex-shrink-0">{poi.icon}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{poi.name}</p>
                      <p className="text-slate-400 text-xs">{poi.label} · {formatDist(poi.distance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {nearbyTypes.map(poi => (
                  <div key={poi.type} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
                    <span className="text-2xl block mb-1">{poi.icon}</span>
                    <p className="text-slate-400 text-xs">{poi.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <AdBannerCard />

        {/* Owner card */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 h-14 relative">
            <div className="absolute bottom-0 left-4 translate-y-1/2">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                <span className="text-blue-900 font-black text-lg">P</span>
              </div>
            </div>
          </div>
          <div className="pt-8 pb-4 px-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-black text-slate-900 dark:text-white">Proprietaire Verifie</p>
              <span className="flex items-center gap-1 bg-blue-900/10 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                <Shield size={8} /> Pro
              </span>
            </div>
            <p className="text-slate-400 text-xs">Membre ImmoPro · Reponse rapide</p>
            <div className="flex mt-2">
              {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              <span className="text-slate-400 text-xs ml-1">4.8 (23 avis)</span>
            </div>
          </div>
        </div>

        <button onClick={() => { playTap(); setShowShare(true) }}
          className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-black py-3.5 rounded-2xl">
          <LinkIcon size={18} /> Partager cette annonce
        </button>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex gap-3 max-w-lg mx-auto">
          <a href={'tel:' + ownerPhone} onClick={playTap}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-3.5 rounded-2xl">
            <Phone size={18} /> Appeler
          </a>
          <a href={'https://wa.me/' + ownerPhone.replace(/\s/g, '').replace('+', '')} onClick={playTap}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-black py-3.5 rounded-2xl">
            <MessageCircle size={18} /> WhatsApp
          </a>
          <a href={'/book-visit/' + params.id} onClick={playTap}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-black py-3.5 rounded-2xl">
            <Calendar size={18} /> Visite
          </a>
        </div>
      </div>
    </div>
  )
}
