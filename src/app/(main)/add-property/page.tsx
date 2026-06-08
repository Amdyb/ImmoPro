'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Home, Camera, DollarSign, Check, Building, Layers, Key, Building2, Store, X, Upload, Trees, Briefcase } from 'lucide-react'
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

const propertyTypes = [
  { id: 'apartment', label: 'Appartement', icon: Building, transactions: ['rent', 'sale', 'meuble'] },
  { id: 'villa', label: 'Villa', icon: Home, transactions: ['rent', 'sale', 'meuble'] },
  { id: 'house', label: 'Maison', icon: Building2, transactions: ['rent', 'sale', 'meuble'] },
  { id: 'land', label: 'Terrain', icon: Layers, transactions: ['sale'] },
  { id: 'field', label: 'Champ', icon: Trees, transactions: ['sale'] },
  { id: 'office', label: 'Bureau', icon: Briefcase, transactions: ['rent', 'sale'] },
  { id: 'commercial', label: 'Commerce', icon: Store, transactions: ['rent', 'sale'] },
]

const titleTypes = [
  { id: 'titre_foncier', label: 'Titre Foncier', desc: 'Document officiel de propriete' },
  { id: 'tni', label: 'T.N.I', desc: 'Titre Non Identifie' },
  { id: 'deliberation', label: 'Deliberation', desc: 'Deliberation municipale' },
  { id: 'bail_99_ans', label: 'Bail 99 ans', desc: 'Bail emphyteotique durable' },
]

const landUses = [
  { id: 'residential', label: 'Residentiel', desc: 'Construction maison/immeuble' },
  { id: 'agricultural', label: 'Agricole', desc: 'Culture, elevage, maraichage' },
  { id: 'commercial', label: 'Commercial', desc: 'Commerce, industrie, bureau' },
  { id: 'mixed', label: 'Mixte', desc: 'Usage multiple autorise' },
]

const amenitiesList = [
  'Eau courante', 'Electricite', 'Climatisation', 'Parking',
  'Gardiennage', 'Generateur', 'Cuisine equipee', 'Terrasse',
  'Piscine', 'Ascenseur', 'Internet', 'Meuble',
  'WiFi', 'Netflix', 'Linge fourni', 'Vue mer',
]

const steps = [
  { id: 1, label: 'Type', icon: Home },
  { id: 2, label: 'Details', icon: Building },
  { id: 3, label: 'Photos', icon: Camera },
  { id: 4, label: 'Prix', icon: DollarSign },
]

export default function AddPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [photos, setPhotos] = useState<{ file: File, preview: string }[]>([])
  const [form, setForm] = useState({
    propertyType: '',
    listingType: '',
    title: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    surface: '',
    surfaceUnit: 'm2',
    address: '',
    city: '',
    country: 'Senegal',
    amenities: [] as string[],
    price: '',
    pricePerNight: '',
    pricePerWeek: '',
    minStay: '1',
    negotiable: false,
    titleType: '',
    landUse: '',
    isAgricultural: false,
    isMeuble: false,
  })

  const selectedType = propertyTypes.find(t => t.id === form.propertyType)
  const isLand = ['land', 'field'].includes(form.propertyType)
  const isMeuble = form.listingType === 'meuble'

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleAmenity(a: string) {
    playTap()
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
    }))
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.slice(0, 10 - photos.length).forEach(file => {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5MB)'); return }
      setPhotos(prev => [...prev, { file, preview: URL.createObjectURL(file) }])
    })
    e.target.value = ''
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const photoUrls: string[] = []
      for (const photo of photos) {
        const fileName = Date.now() + '-' + Math.random().toString(36).slice(2) + '.jpg'
        const { data, error } = await supabase.storage.from('property-photos').upload(fileName, photo.file, { contentType: photo.file.type })
        if (!error && data) {
          const { data: urlData } = supabase.storage.from('property-photos').getPublicUrl(data.path)
          photoUrls.push(urlData.publicUrl)
        }
      }

      const { error } = await supabase.from('properties').insert({
        title: form.title,
        description: form.description,
        property_type: form.propertyType === 'field' ? 'land' : form.propertyType,
        listing_type: isMeuble ? 'rent' : form.listingType,
        status: 'available',
        price: isMeuble ? parseInt(form.pricePerNight) : parseInt(form.price),
        price_per_night: isMeuble ? parseInt(form.pricePerNight) : null,
        price_per_week: isMeuble && form.pricePerWeek ? parseInt(form.pricePerWeek) : null,
        min_stay: isMeuble ? parseInt(form.minStay) : null,
        negotiable: form.negotiable,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        surface_area: form.surface ? parseFloat(form.surface) : null,
        address: form.address,
        city: form.city,
        country: form.country,
        amenities: form.amenities,
        photos: photoUrls,
        is_verified: false,
        is_featured: false,
        views_count: 0,
        is_meuble: isMeuble,
        rental_type: isMeuble ? 'short_term' : 'long_term',
        title_type: isLand ? form.titleType : null,
        land_use: isLand ? form.landUse : null,
        is_agricultural: form.propertyType === 'field',
        waitlist_count: 0,
      })

      if (error) { toast.error('Erreur lors de la publication'); console.error(error) }
      else {
        playSuccess()
        toast.success('Annonce publiee!')
        setTimeout(() => router.push('/home'), 1500)
      }
    } catch(e) { toast.error('Une erreur est survenue') }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-blue-900 pt-14 pb-6 px-5">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { playTap(); step > 1 ? setStep(s => s - 1) : router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-black">Publier une annonce</h1>
            <p className="text-white/50 text-xs">Etape {step} sur 4</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                step >= s.id ? 'bg-yellow-400' : 'bg-white/10')}>
                {step > s.id ? <Check size={14} className="text-blue-900" /> : <s.icon size={14} className={step >= s.id ? 'text-blue-900' : 'text-white/50'} />}
              </div>
              {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 rounded-full transition-all', step > s.id ? 'bg-yellow-400' : 'bg-white/20')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6">

        {/* STEP 1 — Type + Transaction */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Type de bien</h2>
            <p className="text-slate-500 text-sm mb-5">Quel type de bien souhaitez-vous publier?</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {propertyTypes.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { playTap(); update('propertyType', id); update('listingType', '') }}
                  className={cn('p-4 rounded-3xl border-2 text-left transition-all',
                    form.propertyType === id ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                  <Icon size={24} className={cn('mb-2', form.propertyType === id ? 'text-blue-900' : 'text-slate-400')} />
                  <p className={cn('font-black text-sm', form.propertyType === id ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>{label}</p>
                </button>
              ))}
            </div>

            {/* Transaction type */}
            {form.propertyType && (
              <div className="mb-6">
                <h3 className="font-black text-slate-900 dark:text-white mb-3">Transaction</h3>
                <div className="space-y-2">
                  {selectedType?.transactions.map(t => {
                    const labels: Record<string, { label: string, desc: string, color: string }> = {
                      sale: { label: 'Vente', desc: 'Ceder definitivement le bien', color: 'bg-blue-900' },
                      rent: { label: 'Location', desc: 'Louer au mois', color: 'bg-emerald-500' },
                      meuble: { label: 'Meuble / Sejour', desc: 'Louer a la nuit ou semaine', color: 'bg-yellow-500' },
                    }
                    const info = labels[t]
                    return (
                      <button key={t} onClick={() => { playTap(); update('listingType', t); update('isMeuble', t === 'meuble') }}
                        className={cn('w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all',
                          form.listingType === t ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', info.color)}>
                          <DollarSign size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={cn('font-black text-sm', form.listingType === t ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>{info.label}</p>
                          <p className="text-slate-400 text-xs">{info.desc}</p>
                        </div>
                        {form.listingType === t && <Check size={18} className="text-blue-900 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Land title type */}
            {isLand && form.listingType && (
              <div className="mb-6">
                <h3 className="font-black text-slate-900 dark:text-white mb-3">Type de titre</h3>
                <div className="space-y-2">
                  {titleTypes.map(t => (
                    <button key={t.id} onClick={() => { playTap(); update('titleType', t.id) }}
                      className={cn('w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all',
                        form.titleType === t.id ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                      <div className="flex-1">
                        <p className={cn('font-black text-sm', form.titleType === t.id ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>{t.label}</p>
                        <p className="text-slate-400 text-xs">{t.desc}</p>
                      </div>
                      {form.titleType === t.id && <Check size={16} className="text-blue-900 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Land use */}
            {isLand && form.titleType && (
              <div className="mb-6">
                <h3 className="font-black text-slate-900 dark:text-white mb-3">Usage du terrain</h3>
                <div className="grid grid-cols-2 gap-2">
                  {landUses.map(u => (
                    <button key={u.id} onClick={() => { playTap(); update('landUse', u.id) }}
                      className={cn('p-3 rounded-2xl border-2 text-left transition-all',
                        form.landUse === u.id ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                      <p className={cn('font-black text-xs', form.landUse === u.id ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>{u.label}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{u.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => { playTap(); setStep(2) }}
              disabled={!form.propertyType || !form.listingType || (isLand && (!form.titleType || !form.landUse))}
              className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                form.propertyType && form.listingType && (!isLand || (form.titleType && form.landUse))
                  ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2 — Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Details du bien</h2>

            <input value={form.title} onChange={e => update('title', e.target.value)}
              placeholder={isLand ? 'Ex: Terrain TF 600m2 Almadies' : isMeuble ? 'Ex: Studio meuble vue mer Saly' : 'Ex: Villa moderne 4 chambres'}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />

            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Description detaillee..." rows={3}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none" />

            {/* Surface with unit selector */}
            <div className="flex gap-2">
              <input value={form.surface} onChange={e => update('surface', e.target.value)}
                placeholder="Surface" type="number"
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                {['m2', 'ha'].map(unit => (
                  <button key={unit} onClick={() => { playTap(); update('surfaceUnit', unit) }}
                    className={cn('px-4 py-3 text-sm font-bold transition-all',
                      form.surfaceUnit === unit ? 'bg-blue-900 text-white' : 'text-slate-500')}>
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms/bathrooms — not for land */}
            {!isLand && (
              <div className="grid grid-cols-2 gap-3">
                <input value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}
                  placeholder="Chambres" type="number"
                  className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                <input value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)}
                  placeholder="Salles de bain" type="number"
                  className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              </div>
            )}

            <input value={form.address} onChange={e => update('address', e.target.value)}
              placeholder="Adresse complete"
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />

            <div className="grid grid-cols-2 gap-3">
              <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Ville"
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <input value={form.country} onChange={e => update('country', e.target.value)} placeholder="Pays"
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
            </div>

            {/* Amenities — not for land/field */}
            {!isLand && (
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm mb-3">Equipements</p>
                <div className="grid grid-cols-2 gap-2">
                  {(isMeuble
                    ? ['WiFi', 'Climatisation', 'Cuisine equipee', 'Linge fourni', 'Netflix', 'Parking', 'Piscine', 'Terrasse', 'Vue mer', 'Gardiennage', 'Generateur', 'Ascenseur']
                    : amenitiesList
                  ).map(a => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={cn('flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all text-sm',
                        form.amenities.includes(a) ? 'border-blue-900 bg-blue-900/5 text-blue-900 font-bold' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                      <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        form.amenities.includes(a) ? 'border-blue-900 bg-blue-900' : 'border-slate-300')}>
                        {form.amenities.includes(a) && <Check size={10} className="text-white" />}
                      </div>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => { playTap(); setStep(3) }} disabled={!form.title}
              className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                form.title ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 3 — Photos */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Photos</h2>
            <p className="text-slate-500 text-sm mb-6">Ajoutez jusqu a 10 photos de qualite</p>

            <label className="w-full border-2 border-dashed border-blue-900/30 rounded-3xl p-8 flex flex-col items-center gap-3 mb-5 bg-blue-50 dark:bg-blue-900/10 cursor-pointer block">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              <div className="w-14 h-14 rounded-2xl bg-blue-900/10 flex items-center justify-center">
                <Upload size={24} className="text-blue-900" />
              </div>
              <div className="text-center">
                <p className="font-black text-blue-900 text-sm">Appuyez pour ajouter des photos</p>
                <p className="text-slate-400 text-xs mt-1">JPG, PNG · Max 5MB par photo</p>
              </div>
            </label>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <div className="absolute top-1.5 left-1.5 bg-blue-900 text-white text-xs font-black px-2 py-0.5 rounded-lg">Principale</div>}
                    <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 mb-6">
              <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Conseils photos</p>
              {['Photographiez toutes les pieces', 'Utilisez la lumiere naturelle', 'Format paysage de preference', 'Minimum 3 photos recommandees'].map(tip => (
                <div key={tip} className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Check size={12} className="text-emerald-500 flex-shrink-0" />{tip}
                </div>
              ))}
            </div>

            <button onClick={() => { playTap(); setStep(4) }}
              className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 bg-blue-900 text-white">
              {photos.length > 0 ? photos.length + ' photo' + (photos.length > 1 ? 's' : '') + ' — Continuer' : 'Continuer sans photo'}
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 4 — Prix */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Prix</h2>
            <p className="text-slate-500 text-sm mb-6">
              {isMeuble ? 'Definissez vos tarifs par nuit' : 'Definissez votre prix en FCFA'}
            </p>

            {isMeuble ? (
              <div className="space-y-3 mb-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-4">
                  <p className="text-xs text-slate-400 mb-1">Prix par nuit (FCFA) *</p>
                  <input value={form.pricePerNight} onChange={e => update('pricePerNight', e.target.value)}
                    placeholder="Ex: 25000" type="number"
                    className="w-full bg-transparent text-2xl font-black text-slate-900 dark:text-white focus:outline-none" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-4">
                  <p className="text-xs text-slate-400 mb-1">Prix par semaine (FCFA) optionnel</p>
                  <input value={form.pricePerWeek} onChange={e => update('pricePerWeek', e.target.value)}
                    placeholder="Ex: 150000" type="number"
                    className="w-full bg-transparent text-2xl font-black text-slate-900 dark:text-white focus:outline-none" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-4">
                  <p className="text-xs text-slate-400 mb-1">Sejour minimum (nuits)</p>
                  <div className="flex items-center gap-4 mt-1">
                    <button onClick={() => update('minStay', Math.max(1, parseInt(form.minStay) - 1).toString())}
                      className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 font-black text-xl text-slate-700 dark:text-white">-</button>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{form.minStay}</span>
                    <button onClick={() => update('minStay', (parseInt(form.minStay) + 1).toString())}
                      className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 font-black text-xl text-slate-700 dark:text-white">+</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-4 flex items-center gap-3 mb-4">
                <span className="text-slate-400 font-bold text-sm">FCFA</span>
                <input value={form.price} onChange={e => update('price', e.target.value)}
                  placeholder="0" type="number"
                  className="flex-1 bg-transparent text-2xl font-black text-slate-900 dark:text-white focus:outline-none" />
                {form.listingType === 'rent' && <span className="text-slate-400 text-sm">/mois</span>}
              </div>
            )}

            {!isMeuble && (
              <button onClick={() => { playTap(); update('negotiable', !form.negotiable) }}
                className={cn('w-full flex items-center justify-between p-4 rounded-2xl border-2 mb-6 transition-all',
                  form.negotiable ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700')}>
                <div>
                  <p className={cn('font-black text-sm', form.negotiable ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>Prix negociable</p>
                  <p className="text-slate-400 text-xs mt-0.5">Les acheteurs peuvent faire une offre</p>
                </div>
                <div className={cn('w-12 h-6 rounded-full transition-all relative', form.negotiable ? 'bg-blue-900' : 'bg-slate-200')}>
                  <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', form.negotiable ? 'left-7' : 'left-1')} />
                </div>
              </button>
            )}

            {/* Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 mb-6 space-y-2">
              <p className="font-black text-slate-900 dark:text-white text-sm mb-3">Recapitulatif</p>
              {[
                { label: 'Type', value: form.propertyType },
                { label: 'Transaction', value: isMeuble ? 'Meuble / Sejour' : form.listingType === 'rent' ? 'Location' : 'Vente' },
                { label: 'Titre', value: isLand ? titleTypes.find(t => t.id === form.titleType)?.label || '-' : '-' },
                { label: 'Usage', value: isLand ? landUses.find(u => u.id === form.landUse)?.label || '-' : '-' },
                { label: 'Titre annonce', value: form.title || '-' },
                { label: 'Ville', value: form.city || '-' },
                { label: 'Surface', value: form.surface ? form.surface + ' ' + form.surfaceUnit : '-' },
                { label: 'Photos', value: photos.length + ' photo' + (photos.length !== 1 ? 's' : '') },
              ].filter(({ label }) => !isLand ? !['Titre', 'Usage'].includes(label) : true)
               .map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit}
              disabled={(!isMeuble && !form.price) || (isMeuble && !form.pricePerNight) || submitting}
              className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                ((!isMeuble && form.price) || (isMeuble && form.pricePerNight)) && !submitting
                  ? 'bg-yellow-400 text-blue-900 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              {submitting
                ? <><div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> Publication...</>
                : <><Check size={18} /> Publier l annonce</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
