'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Share2, Shield, MapPin, Bed, Bath, Maximize, Phone, MessageCircle, Calendar, ChevronLeft, ChevronRight, CheckCircle, Copy, Link as LinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, formatPrice } from '@/lib/utils'
import { AdBannerCard } from '@/components/ads/AdBanner'
import { getPropertyImages } from '@/lib/propertyImages'
import { supabase } from '@/lib/supabase'

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

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(440, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.3)
  } catch(e) {}
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

  useEffect(() => {
    async function fetchProperty() {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()
      setProperty(data)
      setLoading(false)
      if (data) {
        await supabase.from('properties').update({ views_count: (data.views_count || 0) + 1 }).eq('id', params.id)
      }
    }
    fetchProperty()
  }, [params.id])

  function toggleSave() {
    playSuccess()
    setSaved(!saved)
  }

  function copyLink() {
    playTap()
    const url = 'https://immopro.agency/property/' + params.id
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareWhatsApp() {
    playTap()
    if (!property) return
    const url = 'https://immopro.agency/property/' + params.id
    const text = 'Decouvrez ce bien sur ImmoPro: ' + property.title + ' - ' + formatPrice(property.price) + (property.listing_type === 'rent' ? '/mois' : '') + ' a ' + property.city + '. ' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <p className="font-black text-slate-900 text-xl mb-2">Bien introuvable</p>
        <button onClick={() => router.back()} className="text-blue-900 font-bold">Retour</button>
      </div>
    )
  }

  const images = property.photos?.length > 0 ? property.photos : getPropertyImages(property.property_type)
  const totalPhotos = images.length

  const amenities = property.amenities || []
  const ownerPhone = '+221 77 123 45 67'

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* Photo Gallery */}
      <div className="relative h-72 overflow-hidden bg-slate-200">
        <img
          src={images[photoIndex % totalPhotos]}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = getPropertyImages(property.property_type)[0] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {photoIndex > 0 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i - 1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center z-10">
            <ChevronLeft size={18} className="text-slate-700" />
          </button>
        )}
        {photoIndex < totalPhotos - 1 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i + 1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center z-10">
            <ChevronRight size={18} className="text-slate-700" />
          </button>
        )}

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 z-10">
          <button onClick={() => { playTap(); router.back() }}
            className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => { playTap(); setShowShare(!showShare) }}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Share2 size={18} className="text-slate-700" />
            </button>
            <button onClick={toggleSave}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Heart size={18} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'} />
            </button>
          </div>
        </div>

        {property.is_verified && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 mt-2 z-10">
            <span className="flex items-center gap-1 bg-white/90 backdrop-blur text-blue-900 text-xs font-black px-3 py-1 rounded-full shadow">
              <Shield size={10} /> Bien verifie
            </span>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
          {photoIndex + 1}/{totalPhotos}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: Math.min(totalPhotos, 5) }).map((_, i) => (
            <div key={i} className={cn('h-1.5 rounded-full transition-all', i === photoIndex % 5 ? 'bg-white w-4' : 'bg-white/50 w-1.5')} />
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowShare(false)}>
          <div className="w-full bg-white dark:bg-slate-800 rounded-t-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-4">Partager cette annonce</h3>
            <div className="space-y-3">
              <button onClick={shareWhatsApp}
                className="w-full flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 dark:text-white">WhatsApp</p>
                  <p className="text-slate-500 text-xs">Partager via WhatsApp</p>
                </div>
              </button>
              <button onClick={copyLink}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center">
                  {copied ? <CheckCircle size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 dark:text-white">{copied ? 'Copie!' : 'Copier le lien'}</p>
                  <p className="text-slate-500 text-xs">immopro.agency/property/{params.id.slice(0,8)}...</p>
                </div>
              </button>
            </div>
            <button onClick={() => setShowShare(false)} className="w-full mt-4 py-3 text-slate-500 font-bold">Fermer</button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-5 space-y-5 pb-32">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{formatPrice(property.price)}</h1>
            <span className={cn('flex-shrink-0 text-xs font-black px-3 py-1 rounded-xl mt-1',
              property.listing_type === 'rent' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700')}>
              {property.listing_type === 'rent' ? 'Location' : 'Vente'}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">{property.title}</h2>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <MapPin size={14} className="text-yellow-500" />
            <span>{property.address ? property.address + ', ' : ''}{property.city}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Bed, value: property.bedrooms || '-', label: 'Chambres' },
            { icon: Bath, value: property.bathrooms || '-', label: 'SDB' },
            { icon: Maximize, value: property.surface_area ? property.surface_area + ' m2' : '-', label: 'Surface' },
            { icon: Shield, value: property.property_type, label: 'Type' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
              <Icon size={18} className="text-blue-900 dark:text-yellow-400 mx-auto mb-1" />
              <p className="font-black text-slate-900 dark:text-white text-sm capitalize">{value}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {property.description && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
            <h3 className="font-black text-slate-900 dark:text-white mb-2">A propos</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {showFullDesc ? property.description : property.description.slice(0, 120) + '...'}
            </p>
            <button onClick={() => { playTap(); setShowFullDesc(!showFullDesc) }}
              className="text-blue-900 dark:text-yellow-400 font-black text-sm mt-2">
              {showFullDesc ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )}

        {amenities.length > 0 && (
          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-3">Equipements</h3>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((a: string) => (
                <div key={a} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-2">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdBannerCard />

        {/* Owner Card */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 h-16 relative">
            <div className="absolute bottom-0 left-4 translate-y-1/2">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400 border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                <span className="text-blue-900 font-black text-xl">P</span>
              </div>
            </div>
          </div>
          <div className="pt-10 pb-4 px-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-slate-900 dark:text-white">Proprietaire Verifie</p>
                  <span className="flex items-center gap-1 bg-blue-900/10 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    <Shield size={8} /> Pro
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">Membre ImmoPro</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <span className="text-slate-500 text-xs">4.8 (23 avis)</span>
            </div>
            <button onClick={playTap} className="mt-3 text-blue-900 dark:text-yellow-400 text-sm font-bold">
              Voir tous ses biens →
            </button>
          </div>
        </div>

        {/* Share CTA */}
        <button onClick={() => { playTap(); setShowShare(true) }}
          className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-black py-3.5 rounded-2xl">
          <LinkIcon size={18} />
          Partager cette annonce
        </button>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex gap-3 max-w-lg mx-auto">
          <a href={'tel:' + ownerPhone} onClick={playTap}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-3.5 rounded-2xl">
            <Phone size={18} />
            <span>Appeler</span>
          </a>
          <a href={'https://wa.me/' + ownerPhone.replace(/\s/g, '').replace('+', '')} onClick={playTap}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-black py-3.5 rounded-2xl">
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
          <button onClick={() => { playSuccess() }}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-black py-3.5 rounded-2xl">
            <Calendar size={18} />
            <span>Visite</span>
          </button>
        </div>
      </div>
    </div>
  )
}
