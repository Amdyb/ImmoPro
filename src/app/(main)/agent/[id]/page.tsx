'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ArrowLeft, Shield, Star, Phone, MessageCircle, MapPin, Heart, Share2, CheckCircle, Home, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, formatPrice } from '@/lib/utils'
import { getPropertyImage } from '@/lib/propertyImages'

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

const mockAgent = {
  id: '1',
  name: 'Mamadou Ba',
  title: 'Agent Immobilier Senior',
  agency: 'Century 21 Dakar',
  phone: '+221 77 123 45 67',
  email: 'mamadou.ba@century21.sn',
  location: 'Dakar, Senegal',
  bio: 'Agent immobilier experimente avec plus de 10 ans dans le secteur. Specialiste des biens de standing a Dakar et ses environs. Accompagnement personnalise pour chaque client.',
  verified: true,
  rating: 4.8,
  reviews: 47,
  listings: 12,
  sold: 89,
  joined: '2019',
  specialties: ['Villas', 'Appartements', 'Terrains', 'Commercial'],
  bannerColor: 'from-blue-900 to-blue-700',
  properties: [
    { id: '1', title: 'Villa moderne 4 chambres', city: 'Ngor, Dakar', price: 85000000, type: 'sale', property_type: 'villa', verified: true },
    { id: '2', title: 'Appartement 3 pieces', city: 'Almadies, Dakar', price: 250000, type: 'rent', property_type: 'apartment', verified: true },
    { id: '3', title: 'Duplex 5 chambres', city: 'Mermoz, Dakar', price: 75000000, type: 'sale', property_type: 'house', verified: false },
    { id: '4', title: 'Villa avec piscine', city: 'Yoff, Dakar', price: 120000000, type: 'sale', property_type: 'villa', verified: true },
  ]
}

export default function AgentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('listings')

  const agent = mockAgent

  function toggleSave(id: string) {
    playTap()
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function shareProfile() {
    playTap()
    const url = 'https://immopro.agency/agent/' + params.id
    const text = 'Decouvrez le profil de ' + agent.name + ' sur ImmoPro: ' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Banner */}
      <div className={cn('h-44 bg-gradient-to-br relative', agent.bannerColor)}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-0 left-8 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="absolute top-12 left-5 flex items-center gap-3 z-10">
          <button onClick={() => { playTap(); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
        </div>
        <div className="absolute top-12 right-5 z-10">
          <button onClick={shareProfile}
            className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
            <Share2 size={18} className="text-white" />
          </button>
        </div>

        {/* Agency name on banner */}
        <div className="absolute bottom-4 right-5">
          <p className="text-white/60 text-xs font-bold">{agent.agency}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-5">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg -mt-8 relative z-10 p-5">
          {/* Avatar */}
          <div className="flex items-end gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 -mt-12 flex-shrink-0">
              <span className="text-white font-black text-3xl">{agent.name[0]}</span>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">{agent.name}</h1>
                {agent.verified && (
                  <span className="flex items-center gap-1 bg-blue-900/10 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    <Shield size={8} /> Verifie
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm">{agent.title}</p>
              <p className="text-blue-900 dark:text-yellow-400 text-xs font-bold">{agent.agency}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={i <= Math.round(agent.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
              ))}
            </div>
            <span className="font-black text-slate-900 dark:text-white text-sm">{agent.rating}</span>
            <span className="text-slate-400 text-xs">({agent.reviews} avis)</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { value: agent.listings.toString(), label: 'Annonces' },
              { value: agent.sold.toString(), label: 'Ventes' },
              { value: agent.joined, label: 'Depuis' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-3 text-center">
                <p className="font-black text-blue-900 dark:text-yellow-400 text-lg">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
            <MapPin size={14} className="text-yellow-500" />
            <span>{agent.location}</span>
          </div>

          {/* Contact buttons */}
          <div className="flex gap-2">
            <a href={'tel:' + agent.phone} onClick={playTap}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-black py-3 rounded-2xl text-sm">
              <Phone size={16} /> Appeler
            </a>
            <a href={'https://wa.me/' + agent.phone.replace(/\s/g, '').replace('+', '')}
              target="_blank" rel="noopener noreferrer" onClick={playTap}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-black py-3 rounded-2xl text-sm">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-5">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 gap-1">
          {[
            { id: 'listings', label: 'Annonces (' + agent.properties.length + ')' },
            { id: 'about', label: 'A propos' },
            { id: 'reviews', label: 'Avis (' + agent.reviews + ')' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => { playTap(); setActiveTab(id) }}
              className={cn('flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
                activeTab === id ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-yellow-400 shadow-sm' : 'text-slate-400')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-3">
            {agent.properties.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="h-40 relative overflow-hidden bg-slate-200">
                  <img src={getPropertyImage(p.property_type)} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
                  <button onClick={() => toggleSave(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Heart size={14} className={savedItems.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/95 text-slate-900 text-sm font-black px-3 py-1 rounded-xl">
                      {formatPrice(p.price)}{p.type === 'rent' ? '/mois' : ''}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 dark:text-white">{p.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                    <MapPin size={12} /><span>{p.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white mb-2">Biographie</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{agent.bio}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white mb-3">Specialites</h3>
              <div className="flex flex-wrap gap-2">
                {agent.specialties.map(s => (
                  <span key={s} className="bg-blue-900/10 text-blue-900 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white mb-3">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{agent.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle size={16} className="text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{agent.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{agent.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {[
              { name: 'Fatou Diallo', rating: 5, text: 'Excellent agent, tres professionnel. A trouve mon appartement en 2 semaines!', date: 'Mars 2024' },
              { name: 'Ibrahima Ndiaye', rating: 5, text: 'Service impeccable. Mamadou connait tres bien le marche dakarois.', date: 'Fev 2024' },
              { name: 'Aissatou Sy', rating: 4, text: 'Bon suivi, tres reactif. Je recommande vivement.', date: 'Jan 2024' },
            ].map((r, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black">{r.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-900 dark:text-white text-sm">{r.name}</p>
                      <span className="text-slate-400 text-xs">{r.date}</span>
                    </div>
                    <div className="flex mt-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} className={i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}
