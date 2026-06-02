'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ArrowLeft, Heart, Share2, Shield, MapPin, Bed, Bath, Maximize, Phone, MessageCircle, Calendar, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, formatPrice } from '@/lib/utils'

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
    o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1)
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.3)
  } catch(e) {}
}

const gradients = [
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-pink-600',
]

const amenities = [
  'Eau courante', 'Electricite', 'Climatisation', 'Parking',
  'Gardiennage', 'Generateur', 'Cuisine equipee', 'Terrasse',
]

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showFullDesc, setShowFullDesc] = useState(false)

  const property = {
    id: params.id,
    title: 'Villa moderne 4 chambres',
    location: 'Almadies, Dakar',
    price: 85000000,
    type: 'sale',
    beds: 4,
    baths: 4,
    area: 250,
    propertyType: 'Villa',
    verified: true,
    description: 'Belle villa moderne avec piscine, espaces verts, cuisine equipee, situee dans un quartier calme et securise. Proche des ecoles internationales et des commerces. Idéale pour une famille ou un investissement locatif premium.',
    owner: { name: 'Mamadou Ba', phone: '+221 77 123 45 67', verified: true },
    photos: [0, 1, 2, 3, 4],
  }

  function toggleSave() {
    playSuccess()
    setSaved(!saved)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* Photo Gallery */}
      <div className="relative h-72 bg-gradient-to-br overflow-hidden">
        <div className={cn('absolute inset-0 bg-gradient-to-br', gradients[photoIndex % gradients.length])} />

        {/* Nav arrows */}
        {photoIndex > 0 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i - 1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center z-10">
            <ChevronLeft size={18} className="text-slate-700" />
          </button>
        )}
        {photoIndex < property.photos.length - 1 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i + 1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center z-10">
            <ChevronRight size={18} className="text-slate-700" />
          </button>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12 z-10">
          <button onClick={() => { playTap(); router.back() }}
            className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => { playTap() }}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Share2 size={18} className="text-slate-700" />
            </button>
            <button onClick={toggleSave}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Heart size={18} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'} />
            </button>
          </div>
        </div>

        {/* Photo counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
          {photoIndex + 1}/{property.photos.length}
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {property.photos.map((_, i) => (
            <div key={i} className={cn('w-1.5 h-1.5 rounded-full transition-all', i === photoIndex ? 'bg-white w-4' : 'bg-white/50')} />
          ))}
        </div>

        {/* Verified badge */}
        {property.verified && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 mt-10">
            <span className="flex items-center gap-1 bg-white/90 backdrop-blur text-blue-900 text-xs font-black px-3 py-1 rounded-full shadow">
              <Shield size={10} /> Bien verifie
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-5 space-y-5 pb-32">

        {/* Price + Title */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{formatPrice(property.price)}</h1>
            <span className={cn('flex-shrink-0 text-xs font-black px-3 py-1 rounded-xl mt-1',
              property.type === 'rent' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700')}>
              {property.type === 'rent' ? 'Location' : 'Vente'}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">{property.title}</h2>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <MapPin size={14} className="text-yellow-500" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Bed, value: property.beds, label: 'Chambres' },
            { icon: Bath, value: property.baths, label: 'SDB' },
            { icon: Maximize, value: property.area, label: 'm2' },
            { icon: Shield, value: property.propertyType, label: 'Type' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
              <Icon size={18} className="text-blue-900 dark:text-yellow-400 mx-auto mb-1" />
              <p className="font-black text-slate-900 dark:text-white text-sm">{value}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
          <h3 className="font-black text-slate-900 dark:text-white mb-2">A propos de ce bien</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {showFullDesc ? property.description : property.description.slice(0, 120) + '...'}
          </p>
          <button onClick={() => { playTap(); setShowFullDesc(!showFullDesc) }}
            className="text-blue-900 dark:text-yellow-400 font-black text-sm mt-2">
            {showFullDesc ? 'Voir moins' : 'Voir plus'}
          </button>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-black text-slate-900 dark:text-white mb-3">Equipements</h3>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map(a => (
              <div key={a} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-2">
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Owner */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
          <h3 className="font-black text-slate-900 dark:text-white mb-3">Proprietaire</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-lg">{property.owner.name[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-900 dark:text-white">{property.owner.name}</p>
                {property.owner.verified && (
                  <span className="flex items-center gap-1 bg-blue-900/10 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    <Shield size={8} /> Verifie
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-0.5">{property.owner.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex gap-3 max-w-lg mx-auto">
          <a href={'tel:' + property.owner.phone} onClick={playTap}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-3.5 rounded-2xl">
            <Phone size={18} />
            <span>Appeler</span>
          </a>
          <a href={'https://wa.me/' + property.owner.phone.replace(/\s/g, '')} onClick={playTap}
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
