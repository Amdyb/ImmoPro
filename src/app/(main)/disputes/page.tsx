'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { AlertTriangle, Plus, ArrowLeft, Upload, X, CheckCircle, Clock, Shield, ChevronRight, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

const disputeTypes = [
  { id: 'rent', label: 'Augmentation de loyer', icon: '💰' },
  { id: 'deposit', label: 'Caution non restituee', icon: '🔒' },
  { id: 'damage', label: 'Degats dans le logement', icon: '🏚' },
  { id: 'fraud', label: 'Annonce frauduleuse', icon: '⚠️' },
  { id: 'contract', label: 'Non respect du contrat', icon: '📄' },
  { id: 'other', label: 'Autre litige', icon: '❓' },
]

const mockDisputes = [
  { id: 'DISP-2024-00123', type: 'Augmentation de loyer', status: 'open', date: '15 mai 2024', property: 'Appartement Almadies', updated: '2h' },
  { id: 'DISP-2024-00098', type: 'Degats dans le logement', status: 'in_review', date: '28 avril 2024', property: 'Villa Ngor', updated: '1j' },
  { id: 'DISP-2024-00045', type: 'Caution non restituee', status: 'resolved', date: '10 mars 2024', property: 'Studio Point E', updated: '3j' },
]

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  open: { label: 'Ouvert', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: AlertTriangle },
  in_review: { label: 'En cours', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  resolved: { label: 'Resolu', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
}

export default function DisputesPage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [description, setDescription] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [evidence, setEvidence] = useState<{ file: File, preview: string }[]>([])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const preview = URL.createObjectURL(file)
      setEvidence(prev => [...prev, { file, preview }])
    })
    e.target.value = ''
  }

  async function handleSubmit() {
    if (!selectedType || !description) { toast.error('Veuillez remplir tous les champs'); return }
    setSubmitting(true)
    try {
      const { error } = await supabase.from('disputes').insert({
        description: selectedType + ': ' + description,
        status: 'open',
        evidence_urls: [],
      })
      if (error) console.error(error)
      setSubmitted(true)
      toast.success('Litige soumis avec succes')
    } catch(e) { toast.error('Erreur lors de la soumission') }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle size={36} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Litige soumis!</h1>
        <p className="text-slate-500 text-center mb-2 text-sm">Votre demande a ete enregistree</p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 w-full mb-6 mt-4">
          <p className="text-slate-500 text-xs text-center">Notre equipe va examiner votre litige sous 48h et vous contactera par message.</p>
        </div>
        <button onClick={() => { setSubmitted(false); setShowForm(false); setStep(1); setSelectedType(''); setDescription('') }}
          className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl">
          Voir mes litiges
        </button>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="bg-blue-900 pt-14 pb-6 px-5">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => { playTap(); step > 1 ? setStep(s => s-1) : setShowForm(false) }}
              className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl font-black">Nouveau litige</h1>
              <p className="text-white/50 text-xs">Etape {step} sur 3</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1,2,3].map(s => (
              <div key={s} className={cn('h-1 flex-1 rounded-full transition-all', s <= step ? 'bg-yellow-400' : 'bg-white/20')} />
            ))}
          </div>
        </div>

        <div className="px-5 py-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Type de litige</h2>
              <p className="text-slate-500 text-sm mb-6">Quel est le probleme rencontre?</p>
              <div className="space-y-3">
                {disputeTypes.map(type => (
                  <button key={type.id} onClick={() => { playTap(); setSelectedType(type.label) }}
                    className={cn('w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all',
                      selectedType === type.label ? 'border-blue-900 bg-blue-900/5' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                    <span className="text-2xl">{type.icon}</span>
                    <p className={cn('font-black text-sm', selectedType === type.label ? 'text-blue-900 dark:text-yellow-400' : 'text-slate-900 dark:text-white')}>
                      {type.label}
                    </p>
                    {selectedType === type.label && <CheckCircle size={18} className="text-blue-900 dark:text-yellow-400 ml-auto" />}
                  </button>
                ))}
              </div>
              <button onClick={() => { playTap(); setStep(2) }} disabled={!selectedType}
                className={cn('w-full mt-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                  selectedType ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Description</h2>
              <p className="text-slate-500 text-sm mb-6">Decrivez le probleme en detail</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bien concerne (optionnel)</p>
                  <input value={propertyId} onChange={e => setPropertyId(e.target.value)}
                    placeholder="Nom ou adresse du bien"
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description detaillee</p>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Expliquez la situation en detail. Plus vous donnez d informations, plus nous pourrons vous aider rapidement..."
                    rows={6}
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none" />
                </div>
              </div>
              <button onClick={() => { playTap(); setStep(3) }} disabled={!description}
                className={cn('w-full mt-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                  description ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
                Continuer
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Preuves</h2>
              <p className="text-slate-500 text-sm mb-6">Ajoutez des photos ou documents pour appuyer votre demande</p>

              <label className="w-full border-2 border-dashed border-blue-900/30 rounded-3xl p-6 flex flex-col items-center gap-3 mb-5 bg-blue-50 dark:bg-blue-900/10 cursor-pointer block">
                <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleFileSelect} />
                <div className="w-12 h-12 rounded-2xl bg-blue-900/10 flex items-center justify-center">
                  <Upload size={22} className="text-blue-900" />
                </div>
                <div className="text-center">
                  <p className="font-black text-blue-900 text-sm">Ajouter des preuves</p>
                  <p className="text-slate-400 text-xs mt-1">Photos, contrats, reçus (JPG, PDF)</p>
                </div>
              </label>

              {evidence.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {evidence.map((e, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                      <img src={e.preview} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setEvidence(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
                    Vos informations sont confidentielles et ne seront partagees qu avec les parties concernees et notre equipe de mediation.
                  </p>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={submitting}
                className="w-full bg-yellow-400 text-blue-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2">
                {submitting
                  ? <div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
                  : <><CheckCircle size={18} /> Soumettre le litige</>}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Centre de litiges</h1>
            <p className="text-slate-400 text-xs mt-0.5">Signalez un probleme, nous vous aidons</p>
          </div>
          <button onClick={() => { playTap(); setShowForm(true) }}
            className="flex items-center gap-2 bg-blue-900 text-white font-black text-sm px-4 py-2.5 rounded-2xl">
            <Plus size={16} /> Nouveau
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Info banner */}
        <div className="bg-blue-900/5 dark:bg-blue-900/20 rounded-3xl p-4 flex items-start gap-3">
          <Shield size={20} className="text-blue-900 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-blue-900 dark:text-yellow-400 text-sm">Mediation ImmoPro</p>
            <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
              Notre equipe examine chaque litige sous 48h. Nous facilitons la resolution amiable entre les parties.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['Mes litiges', 'Historique'].map((tab, i) => (
            <button key={tab} onClick={playTap}
              className={cn('px-4 py-2 rounded-xl text-xs font-bold transition-all',
                i === 0 ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
              {tab}
            </button>
          ))}
        </div>

        {/* Disputes list */}
        <div className="space-y-3">
          {mockDisputes.map(dispute => {
            const status = statusConfig[dispute.status]
            const StatusIcon = status.icon
            return (
              <div key={dispute.id} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <p className="font-black text-slate-900 dark:text-white text-sm">{dispute.type}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{dispute.property}</p>
                  </div>
                  <span className={cn('flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl flex-shrink-0', status.color)}>
                    <StatusIcon size={11} /> {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs">{dispute.id}</p>
                    <p className="text-slate-400 text-xs">Ouvert le {dispute.date}</p>
                  </div>
                  <button onClick={playTap} className="flex items-center gap-1 text-blue-900 dark:text-yellow-400 text-xs font-bold">
                    Voir details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="h-24" />
      </div>
    </div>
  )
}
