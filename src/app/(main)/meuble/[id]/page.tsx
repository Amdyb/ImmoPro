'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Share2, Shield, MapPin, Bed, Bath, Maximize, Wifi, Users, Clock, CheckCircle, ChevronLeft, ChevronRight, Star, X, Phone, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { getPropertyImages } from '@/lib/propertyImages'
import { toast } from 'sonner'

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

function playSuccess() {
  try {
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.type = 'sine'; o.connect(g); g.connect(ctx.destination)
      o.frequency.value = freq
      g.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2)
      o.start(ctx.currentTime + i * 0.12); o.stop(ctx.currentTime + i * 0.12 + 0.2)
    })
  } catch(e) {}
}

export default function MeubleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [waitlistJoined, setWaitlistJoined] = useState(false)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('properties').select('*').eq('id', params.id).single()
      setProperty(data)
      setLoading(false)
    }
    fetch()
  }, [params.id])

  async function joinWaitlist() {
    if (!phone) { toast.error('Entrez votre numero'); return }
    setSubmitting(true)
    const { error } = await supabase.from('waitlist').insert({
      property_id: params.id,
      phone: phone.startsWith('+') ? phone : '+221' + phone,
      name,
    })
    if (!error) {
      await supabase.from('properties').update({ waitlist_count: (property.waitlist_count || 0) + 1 }).eq('id', params.id)
      // Send WhatsApp confirmation
      fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          phone: phone.startsWith('+') ? phone : '+221' + phone,
          data: { userName: name || 'cher client' }
        })
      }).catch(() => {})
      playSuccess()
      setWaitlistJoined(true)
    }
    setSubmitting(false)
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Photo gallery */}
      <div className="relative h-72 overflow-hidden bg-slate-200">
        <img src={images[photoIndex % images.length]} alt={property.title}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = getPropertyImages(property.property_type)[0] }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12">
          <button onClick={() => { playTap(); router.back() }}
            className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => { playTap(); setSaved(!saved) }}
              className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center">
              <Heart size={18} className={saved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'} />
            </button>
          </div>
        </div>

        {photoIndex > 0 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i - 1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">
            <ChevronLeft size={18} className="text-slate-700" />
          </button>
        )}
        {photoIndex < images.length - 1 && (
          <button onClick={() => { playTap(); setPhotoIndex(i => i + 1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">
            <ChevronRight size={18} className="text-slate-700" />
          </button>
        )}

        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="bg-yellow-400 text-blue-900 text-xs font-black px-3 py-1 rounded-full">Meuble</span>
          {property.is_verified && (
            <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
              <Shield size={8} /> Verifie
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-5 space-y-5 pb-32">
        {/* Title + price */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{property.title}</h1>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1 mb-2">
            <MapPin size={14} className="text-yellow-500" /><span>{property.city}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-blue-900 dark:text-yellow-400">
              {(property.price_per_night || property.price).toLocaleString('fr-FR')} FCFA
            </span>
            <span className="text-slate-400 text-sm">/nuit</span>
          </div>
          {property.price_per_week && (
            <p className="text-slate-400 text-xs mt-1">
              {property.price_per_week.toLocaleString('fr-FR')} FCFA/semaine
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Bed, value: property.bedrooms || '-', label: 'Chambres' },
            { icon: Bath, value: property.bathrooms || '-', label: 'SDB' },
            { icon: Maximize, value: property.surface_area ? property.surface_area + 'm2' : '-', label: 'Surface' },
            { icon: Clock, value: property.min_stay + 'n', label: 'Min. sejour' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
              <Icon size={16} className="text-blue-900 dark:text-yellow-400 mx-auto mb-1" />
              <p className="font-black text-slate-900 dark:text-white text-sm">{value}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Waitlist indicator */}
        {property.waitlist_count > 0 && (
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-rose-700 dark:text-rose-400 text-sm">Tres demande!</p>
              <p className="text-rose-600/70 dark:text-rose-400/70 text-xs">{property.waitlist_count} personnes sur liste d attente</p>
            </div>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
            <h3 className="font-black text-slate-900 dark:text-white mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{property.description}</p>
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

        {/* Host card */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
          <h3 className="font-black text-slate-900 dark:text-white mb-3">Hote</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center">
              <span className="text-white font-black text-lg">H</span>
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white">Hote Verifie ImmoPro</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                <span className="text-slate-400 text-xs ml-1">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex gap-3">
          <a href={'https://wa.me/12487030072?text=Bonjour, je suis interesse par: ' + property.title}
            className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={20} className="text-white" />
          </a>
          <button onClick={() => { playTap(); setShowWaitlist(true) }}
            className="flex-1 bg-blue-900 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2">
            <Users size={18} />
            {property.waitlist_count > 0 ? 'Rejoindre la liste d attente' : 'Reserver maintenant'}
          </button>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setShowWaitlist(false)}>
          <div className="w-full bg-white dark:bg-slate-800 rounded-t-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {waitlistJoined ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2">Vous etes sur la liste!</h3>
                <p className="text-slate-500 text-sm mb-4">Nous vous contacterons via WhatsApp des qu une disponibilite s ouvre.</p>
                <button onClick={() => { setShowWaitlist(false); setWaitlistJoined(false) }}
                  className="w-full bg-blue-900 text-white font-black py-3.5 rounded-2xl">
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg">Liste d attente</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Nous vous alerterons des disponibilites</p>
                  </div>
                  <button onClick={() => setShowWaitlist(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <X size={16} className="text-slate-500" />
                  </button>
                </div>

                {property.waitlist_count > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 mb-4 flex items-center gap-2">
                    <Users size={16} className="text-amber-600 flex-shrink-0" />
                    <p className="text-amber-700 dark:text-amber-400 text-xs font-bold">
                      {property.waitlist_count} personnes attendent deja ce logement
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Votre prenom (optionnel)"
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                    <span className="text-slate-500 font-bold text-sm">+221</span>
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="77 XXX XX XX" type="tel"
                      className="flex-1 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                  </div>
                </div>

                <button onClick={joinWaitlist} disabled={submitting || !phone}
                  className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                    phone && !submitting ? 'bg-yellow-400 text-blue-900 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
                  {submitting
                    ? <div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
                    : <><CheckCircle size={18} /> Me notifier par WhatsApp</>
                  }
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
