'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Save, Trash2, Star, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
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

const titleTypes = [
  { id: 'titre_foncier', label: 'Titre Foncier' },
  { id: 'tni', label: 'T.N.I' },
  { id: 'deliberation', label: 'Deliberation' },
  { id: 'bail_99_ans', label: 'Bail 99 ans' },
]

const landUses = [
  { id: 'residential', label: 'Residentiel' },
  { id: 'agricultural', label: 'Agricole' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'mixed', label: 'Mixte' },
]

const amenitiesList = [
  'Eau courante','Electricite','Climatisation','Parking',
  'Gardiennage','Generateur','Cuisine equipee','Terrasse',
  'Piscine','Ascenseur','Internet','Meuble',
  'WiFi','Netflix','Linge fourni','Vue mer',
  'Titre Foncier','Viabilise','Route bitumee',
]

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [property, setProperty] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('properties').select('*').eq('id', params.id).single()
      if (data) { setProperty(data); setForm(data) }
      setLoading(false)
    }
    load()
  }, [params.id])

  function update(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }))
  }

  function toggleAmenity(a: string) {
    playTap()
    setForm((prev: any) => ({
      ...prev,
      amenities: prev.amenities?.includes(a)
        ? prev.amenities.filter((x: string) => x !== a)
        : [...(prev.amenities || []), a]
    }))
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('properties').update({
      title: form.title,
      description: form.description,
      price: parseInt(form.price) || 0,
      price_per_night: form.price_per_night ? parseInt(form.price_per_night) : null,
      price_per_week: form.price_per_week ? parseInt(form.price_per_week) : null,
      min_stay: form.min_stay ? parseInt(form.min_stay) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      surface_area: form.surface_area ? parseFloat(form.surface_area) : null,
      address: form.address,
      city: form.city,
      country: form.country,
      amenities: form.amenities || [],
      is_verified: form.is_verified,
      is_featured: form.is_featured,
      is_meuble: form.is_meuble,
      negotiable: form.negotiable,
      status: form.status,
      title_type: form.title_type,
      land_use: form.land_use,
      is_agricultural: form.is_agricultural,
      listing_type: form.listing_type,
      property_type: form.property_type,
      views_count: parseInt(form.views_count) || 0,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    }).eq('id', params.id)

    if (error) { toast.error('Erreur: ' + error.message) }
    else { toast.success('Annonce mise a jour!'); router.back() }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette annonce?')) return
    await supabase.from('properties').delete().eq('id', params.id)
    toast.success('Annonce supprimee')
    router.push('/admin')
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
    </div>
  )

  if (!property) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <p className="font-black text-slate-900 text-xl">Annonce introuvable</p>
      <button onClick={() => router.back()} className="text-blue-900 font-bold mt-4">Retour</button>
    </div>
  )

  const isLand = ['land', 'field'].includes(form.property_type)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-5 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { playTap(); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-black">Modifier</h1>
            <p className="text-white/50 text-xs truncate max-w-[200px]">{property.title}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 bg-yellow-400 text-blue-900 font-black text-sm px-4 py-2.5 rounded-xl">
          {saving ? <div className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> : <Save size={16} />}
          Sauvegarder
        </button>
      </div>

      <div className="px-5 py-6 space-y-5 pb-32">

        {/* Quick toggles */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
          <p className="font-black text-slate-900 dark:text-white text-sm mb-4">Options rapides</p>
          <div className="space-y-3">
            {[
              { key: 'is_verified', label: 'Annonce verifiee', icon: Shield },
              { key: 'is_featured', label: 'En vedette', icon: Star },
              { key: 'is_meuble', label: 'Appartement meuble', icon: Check },
              { key: 'negotiable', label: 'Prix negociable', icon: Check },
              { key: 'is_agricultural', label: 'Terrain agricole', icon: Check },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { playTap(); update(key, !form[key]) }}
                className="w-full flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{label}</span>
                <div className={cn('w-12 h-6 rounded-full transition-all relative', form[key] ? 'bg-blue-900' : 'bg-slate-200 dark:bg-slate-700')}>
                  <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', form[key] ? 'left-7' : 'left-1')} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Statut</p>
          <div className="flex gap-2">
            {[
              { id: 'available', label: 'Disponible' },
              { id: 'rented', label: 'Loue' },
              { id: 'sold', label: 'Vendu' },
              { id: 'unavailable', label: 'Indispo' },
            ].map(s => (
              <button key={s.id} onClick={() => { playTap(); update('status', s.id) }}
                className={cn('flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
                  form.status === s.id ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Type</p>
            <select value={form.property_type} onChange={e => update('property_type', e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none">
              <option value="apartment">Appartement</option>
              <option value="villa">Villa</option>
              <option value="house">Maison</option>
              <option value="land">Terrain</option>
              <option value="office">Bureau</option>
              <option value="commercial">Commerce</option>
            </select>
          </div>
          <div>
            <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Transaction</p>
            <select value={form.listing_type} onChange={e => update('listing_type', e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none">
              <option value="rent">Location</option>
              <option value="sale">Vente</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Titre</p>
          <input value={form.title || ''} onChange={e => update('title', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
        </div>

        {/* Description */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Description</p>
          <textarea value={form.description || ''} onChange={e => update('description', e.target.value)}
            rows={4} className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none resize-none" />
        </div>

        {/* Price */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Prix (FCFA)</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
              <span className="text-slate-400 text-sm">Prix principal</span>
              <input value={form.price || ''} onChange={e => update('price', e.target.value)}
                type="number" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none text-right font-black" />
            </div>
            {form.is_meuble && (
              <>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                  <span className="text-slate-400 text-sm">Par nuit</span>
                  <input value={form.price_per_night || ''} onChange={e => update('price_per_night', e.target.value)}
                    type="number" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none text-right font-black" />
                </div>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                  <span className="text-slate-400 text-sm">Par semaine</span>
                  <input value={form.price_per_week || ''} onChange={e => update('price_per_week', e.target.value)}
                    type="number" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none text-right font-black" />
                </div>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                  <span className="text-slate-400 text-sm">Sejour min. (nuits)</span>
                  <input value={form.min_stay || ''} onChange={e => update('min_stay', e.target.value)}
                    type="number" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none text-right font-black" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Details */}
        {!isLand && (
          <div>
            <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Details</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'bedrooms', label: 'Chambres' },
                { key: 'bathrooms', label: 'SDB' },
                { key: 'surface_area', label: 'm2' },
              ].map(({ key, label }) => (
                <div key={key} className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">{label}</p>
                  <input value={form[key] || ''} onChange={e => update(key, e.target.value)}
                    type="number" className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none text-center font-black" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Localisation</p>
          <div className="space-y-2">
            <input value={form.address || ''} onChange={e => update('address', e.target.value)}
              placeholder="Adresse" className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.city || ''} onChange={e => update('city', e.target.value)}
                placeholder="Ville" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
              <input value={form.country || ''} onChange={e => update('country', e.target.value)}
                placeholder="Pays" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.latitude || ''} onChange={e => update('latitude', e.target.value)}
                placeholder="Latitude" type="number" step="any"
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
              <input value={form.longitude || ''} onChange={e => update('longitude', e.target.value)}
                placeholder="Longitude" type="number" step="any"
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Land title */}
        {isLand && (
          <>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Type de titre</p>
              <div className="grid grid-cols-2 gap-2">
                {titleTypes.map(t => (
                  <button key={t.id} onClick={() => { playTap(); update('title_type', t.id) }}
                    className={cn('p-3 rounded-2xl border-2 text-sm font-bold transition-all',
                      form.title_type === t.id ? 'border-blue-900 bg-blue-900/5 text-blue-900' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Usage</p>
              <div className="grid grid-cols-2 gap-2">
                {landUses.map(u => (
                  <button key={u.id} onClick={() => { playTap(); update('land_use', u.id) }}
                    className={cn('p-3 rounded-2xl border-2 text-sm font-bold transition-all',
                      form.land_use === u.id ? 'border-blue-900 bg-blue-900/5 text-blue-900' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Amenities */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Equipements</p>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map(a => (
              <button key={a} onClick={() => toggleAmenity(a)}
                className={cn('flex items-center gap-2 p-3 rounded-2xl border-2 text-left text-sm transition-all',
                  form.amenities?.includes(a) ? 'border-blue-900 bg-blue-900/5 text-blue-900 font-bold' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  form.amenities?.includes(a) ? 'border-blue-900 bg-blue-900' : 'border-slate-300')}>
                  {form.amenities?.includes(a) && <Check size={10} className="text-white" />}
                </div>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Nombre de vues</p>
          <input value={form.views_count || ''} onChange={e => update('views_count', e.target.value)}
            type="number" className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none" />
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-yellow-400 text-blue-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          {saving ? <div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> : <Save size={18} />}
          Sauvegarder les modifications
        </button>

        {/* Delete */}
        <button onClick={handleDelete}
          className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-black py-4 rounded-2xl flex items-center justify-center gap-2 border border-rose-100">
          <Trash2 size={18} /> Supprimer cette annonce
        </button>

        <div className="h-8" />
      </div>
    </div>
  )
}
