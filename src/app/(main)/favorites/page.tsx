'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Shield, Trash2, Search } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
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

export default function FavoritesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('*, properties(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setItems(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  async function removeFavorite(favoriteId: string) {
    playTap()
    await supabase.from('favorites').delete().eq('id', favoriteId)
    setItems(prev => prev.filter(i => i.id !== favoriteId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center px-5">
        <Heart size={56} className="text-slate-200 dark:text-slate-700 mb-4" />
        <p className="font-black text-slate-900 dark:text-white text-xl mb-2">Vos favoris</p>
        <p className="text-slate-400 text-sm text-center mb-6">Connectez-vous pour sauvegarder des biens</p>
        <Link href="/login">
          <button className="bg-blue-900 text-white font-black px-6 py-3 rounded-2xl">Se connecter</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Favoris</h1>
        <p className="text-slate-400 text-sm mt-1">{items.length} bien{items.length > 1 ? 's' : ''} sauvegarde{items.length > 1 ? 's' : ''}</p>
      </div>

      <div className="px-5 py-5">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="font-black text-slate-400 text-lg">Aucun favori</p>
            <p className="text-slate-400 text-sm mt-1">Sauvegardez des biens pour les retrouver ici</p>
            <Link href="/search">
              <button className="mt-6 bg-blue-900 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 mx-auto">
                <Search size={16} /> Parcourir les biens
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const p = item.properties
              if (!p) return null
              return (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                  <Link href={'/property/' + p.id} onClick={playTap}>
                    <div className="h-40 relative overflow-hidden bg-slate-200">
                      <img src={p.photos?.[0] || getPropertyImage(p.property_type)} alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = getPropertyImage(p.property_type) }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      {p.is_verified && (
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 bg-white/90 text-blue-900 text-xs font-black px-2 py-0.5 rounded-full">
                            <Shield size={8} /> Verifie
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/95 text-slate-900 text-sm font-black px-3 py-1 rounded-xl">
                          {formatPrice(p.price)}{p.listing_type === 'rent' ? '/mois' : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-black text-slate-900 dark:text-white">{p.title}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                        <MapPin size={12} /><span>{p.city}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFavorite(item.id)}
                      className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={16} className="text-rose-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}
