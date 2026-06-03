'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Home, Camera, DollarSign, Check, Building, Layers, Key, Building2, Store, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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

const propertyTypes = [
  { id: 'apartment', label: 'Appartement', icon: Building },
  { id: 'villa', label: 'Villa', icon: Home },
  { id: 'house', label: 'Maison', icon: Building2 },
  { id: 'land', label: 'Terrain', icon: Layers },
  { id: 'commercial', label: 'Commerce', icon: Store },
  { id: 'office', label: 'Bureau', icon: Building },
]

const listingTypes = [
  { id: 'rent', label: 'Louer', icon: Key, color: 'bg-emerald-500' },
  { id: 'sale', label: 'Vendre', icon: DollarSign, color: 'bg-blue-900' },
]

const amenitiesList = [
  'Eau courante', 'Electricite', 'Climatisation', 'Parking',
  'Gardiennage', 'Generateur', 'Cuisine equipee', 'Terrasse',
  'Piscine', 'Ascenseur', 'Internet', 'Meuble',
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
    propertyType: '', listingType: '', title: '', description: '',
    bedrooms: '', bathrooms: '', surface: '', address: '', city: '',
    country: 'Senegal', amenities: [] as string[], price: '', negotiable: false,
  })

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
      const preview = URL.createObjectURL(file)
      setPhotos(prev => [...prev, { file, preview }])
    })
    e.target.value = ''
  }

  function removePhoto(index: number) {
    playTap()
    setPhotos(prev => prev.filter((_, i) => i !== index))
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
        title: form.title, description: form.description,
        property_type: form.propertyType, listing_type: form.listingType,
        status: 'available', price: parseInt(form.price), negotiable: form.negotiable,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        surface_area: form.surface ? parseFloat(form.surface) : null,
        address: form.address, city: form.city, country: form.country,
        amenities: form.amenities, photos: photoUrls,
        is_verified: false, is_featured: false, views_count: 0,
      })

      if (error) { toast.error('Erreur lors de la publication') }
      else { playSuccess(); toast.success('Annonce publiee!'); setTimeout(() => router.push('/home'), 1500) }
    } catch(e) { toast.error('Une erreur est survenue') }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-6 px-5">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { playTap(); step > 1 ? setStep(s => s-1) : router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-black">Ajouter un bien</h1>
            <p className="text-white/50 text-xs">Etape {step} sur 4</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all', step >= s.id ? 'bg-yellow-400' : 'bg-white/10')}>
                {step > s.id ? <Check size={14} className="text-blue-900" /> : <s.icon size={14} className={step >= s.id ? 'text-blue-900' : 'text-white/50'} />}
              </div>
              {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 rounded-full transition-all', step > s.id ? 'bg-yellow-400' : 'bg-white/20')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6">

        {step === 1 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Type de bien</h2>
            <p className="text-slate-500 text-sm mb-6">Quel type de bien souhaitez-vous publier ?</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {propertyTypes.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { playTap(); update('propertyType', id) }}
                  className={cn('p-4 rounded-3xl border-2 text-left transition-all', form.propertyType === id ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700')}>
                  <Icon size={24} className={cn('mb-2', form.propertyType === id ? 'text-blue-900' : 'text-slate-400')} />
                  <p className={cn('font-black text-sm', form.propertyType === id ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>{label}</p>
                </button>
              ))}
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">Transaction</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {listingTypes.map(({ id, label, icon: Icon, color }) => (
                <button key={id} onClick={() => { playTap(); update('listingType', id) }}
                  className={cn('p-4 rounded-3xl border-2 flex items-center gap-3 transition-all', form.listingType === id ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700')}>
                  <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center', color)}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className={cn('font-black', form.listingType === id ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>{label}</p>
                </button>
              ))}
            </div>
            <button onClick={() => { playTap(); setStep(2) }} disabled={!form.propertyType || !form.listingType}
              className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all', form.propertyType && form.listingType ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Details du bien</h2>
            <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Titre de l annonce" className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
            <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description detaillee..." rows={3} className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none" />
            <div className="grid grid-cols-3 gap-3">
              <input value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} placeholder="Chambres" type="number" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <input value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} placeholder="SDB" type="number" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <input value={form.surface} onChange={e => update('surface', e.target.value)} placeholder="m2" type="number" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
            </div>
            <input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Adresse complete" className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Ville" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <input value={form.country} onChange={e => update('country', e.target.value)} placeholder="Pays" className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-sm mb-3">Equipements</p>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={cn('flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all text-sm', form.amenities.includes(a) ? 'border-blue-900 bg-blue-900/5 text-blue-900 font-bold' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                    <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0', form.amenities.includes(a) ? 'border-blue-900 bg-blue-900' : 'border-slate-300')}>
                      {form.amenities.includes(a) && <Check size={10} className="text-white" />}
                    </div>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { playTap(); setStep(3) }} disabled={!form.title}
              className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all', form.title ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Photos</h2>
            <p className="text-slate-500 text-sm mb-6">Ajoutez jusqu a 10 photos de qualite</p>

            <label htmlFor="photo-upload" className="w-full border-2 border-dashed border-blue-900/40 rounded-3xl p-8 flex flex-col items-center gap-3 mb-5 bg-blue-50 dark:bg-blue-900/10 cursor-pointer hover:bg-blue-100 transition-all block">
              <div className="w-14 h-14 rounded-2xl bg-blue-900/10 flex items-center justify-center">
                <Upload size={24} className="text-blue-900" />
              </div>
              <div className="text-center">
                <p className="font-black text-blue-900 text-sm">Appuyez pour ajouter des photos</p>
                <p className="text-slate-400 text-xs mt-1">JPG, PNG · Max 5MB par photo</p>
              </div>
            </label>
            <input id="photo-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <div className="absolute top-1.5 left-1.5 bg-blue-900 text-white text-xs font-black px-2 py-0.5 rounded-lg">Principale</div>}
                    <button onClick={() => removePhoto(i)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <label htmlFor="photo-upload" className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 cursor-pointer">
                    <Camera size={20} className="text-slate-300" />
                  </label>
                )}
              </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 mb-6">
              <p className="font-black text-slate-900 dark:text-white text-sm mb-2">Conseils photos</p>
              {['Photographiez toutes les pieces', 'Utilisez la lumiere naturelle', 'Format paysage de preference', 'Minimum 5 photos recommandees'].map(tip => (
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

        {step === 4 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Prix et publication</h2>
            <p className="text-slate-500 text-sm mb-6">Definissez votre prix en FCFA</p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-4 flex items-center gap-3 mb-4">
              <span className="text-slate-400 font-bold text-sm">FCFA</span>
              <input value={form.price} onChange={e => update('price', e.target.value)} placeholder="0" type="number"
                className="flex-1 bg-transparent text-2xl font-black text-slate-900 dark:text-white focus:outline-none" />
              {form.listingType === 'rent' && <span className="text-slate-400 text-sm">/mois</span>}
            </div>
            <button onClick={() => { playTap(); update('negotiable', !form.negotiable) }}
              className={cn('w-full flex items-center justify-between p-4 rounded-2xl border-2 mb-6 transition-all', form.negotiable ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700')}>
              <div>
                <p className={cn('font-black text-sm', form.negotiable ? 'text-blue-900' : 'text-slate-900 dark:text-white')}>Prix negociable</p>
                <p className="text-slate-400 text-xs mt-0.5">Les acheteurs peuvent faire une offre</p>
              </div>
              <div className={cn('w-12 h-6 rounded-full transition-all relative', form.negotiable ? 'bg-blue-900' : 'bg-slate-200')}>
                <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', form.negotiable ? 'left-7' : 'left-1')} />
              </div>
            </button>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 mb-6 space-y-2">
              <p className="font-black text-slate-900 dark:text-white text-sm mb-3">Recapitulatif</p>
              {[
                { label: 'Type', value: form.propertyType },
                { label: 'Transaction', value: form.listingType === 'rent' ? 'Location' : 'Vente' },
                { label: 'Titre', value: form.title || '-' },
                { label: 'Ville', value: form.city || '-' },
                { label: 'Photos', value: photos.length + ' photo' + (photos.length !== 1 ? 's' : '') },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={!form.price || submitting}
              className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all', form.price && !submitting ? 'bg-yellow-400 text-blue-900' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              {submitting ? <><div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> Publication...</> : <><Check size={18} /> Publier le bien</>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
