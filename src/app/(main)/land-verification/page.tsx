'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ArrowLeft, Upload, CheckCircle, Shield, FileText, X, AlertTriangle, Clock, Star } from 'lucide-react'
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

const requiredDocs = [
  { id: 'titre_foncier', label: 'Titre Foncier', desc: 'Document officiel de propriete', required: true },
  { id: 'plan_cadastral', label: 'Plan Cadastral', desc: 'Plan de bornage du terrain', required: true },
  { id: 'acte_vente', label: 'Acte de Vente', desc: 'Contrat de vente notarie', required: false },
  { id: 'permis_construire', label: 'Permis de Construire', desc: 'Si construction existante', required: false },
  { id: 'quittance', label: 'Quittance de Taxe', desc: 'Preuves de paiement des taxes', required: false },
]

const verificationSteps = [
  { step: 1, label: 'Soumission', desc: 'Documents telecharges', done: true },
  { step: 2, label: 'Verification', desc: 'Examen par notre equipe', done: false },
  { step: 3, label: 'Validation', desc: 'Confirmation officielle', done: false },
  { step: 4, label: 'Badge', desc: 'Badge Terrain Verifie obtenu', done: false },
]

export default function LandVerificationPage() {
  const router = useRouter()
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { file: File, name: string }>>({})
  const [propertyTitle, setPropertyTitle] = useState('')
  const [propertyLocation, setPropertyLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleFileSelect(docId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop lourd (max 10MB)'); return }
    setUploadedDocs(prev => ({ ...prev, [docId]: { file, name: file.name } }))
    e.target.value = ''
  }

  function removeDoc(docId: string) {
    playTap()
    setUploadedDocs(prev => {
      const next = { ...prev }
      delete next[docId]
      return next
    })
  }

  const requiredUploaded = requiredDocs.filter(d => d.required).every(d => uploadedDocs[d.id])

  async function handleSubmit() {
    if (!requiredUploaded || !propertyTitle || !propertyLocation) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitted(true)
    toast.success('Demande de verification soumise!')
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle size={36} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Demande soumise!</h1>
        <p className="text-slate-500 text-center text-sm mb-6">Notre equipe va verifier vos documents sous 3-5 jours ouvrables</p>

        {/* Progress tracker */}
        <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 mb-6">
          <p className="font-black text-slate-900 dark:text-white text-sm mb-4">Suivi de verification</p>
          {verificationSteps.map((s, i) => (
            <div key={s.step} className="flex items-start gap-3 mb-3">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black',
                s.done ? 'bg-emerald-500 text-white' : i === 1 ? 'bg-yellow-400 text-blue-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-400')}>
                {s.done ? <CheckCircle size={14} /> : s.step}
              </div>
              <div className="flex-1 pt-1">
                <p className={cn('font-black text-sm', s.done ? 'text-emerald-600' : i === 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400')}>{s.label}</p>
                <p className="text-slate-400 text-xs">{s.desc}</p>
              </div>
              {i === 1 && <Clock size={16} className="text-yellow-500 flex-shrink-0 mt-1" />}
            </div>
          ))}
        </div>

        <button onClick={() => router.push('/home')} className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl">
          Retour a l accueil
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-8 px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { playTap(); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-black">Verification de terrain</h1>
            <p className="text-white/50 text-xs">Obtenez le badge Terrain Verifie</p>
          </div>
        </div>

        {/* Badge preview */}
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <Shield size={28} className="text-blue-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-black">Badge Terrain Verifie</p>
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-white/60 text-xs mt-0.5">Augmente la confiance des acheteurs de 3x</p>
            <p className="text-yellow-400 text-xs font-bold mt-1">Gratuit pour les membres Pro</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">

        {/* Property info */}
        <div>
          <h2 className="font-black text-slate-900 dark:text-white mb-4">Informations du terrain</h2>
          <div className="space-y-3">
            <input value={propertyTitle} onChange={e => setPropertyTitle(e.target.value)}
              placeholder="Titre de l annonce (ex: Terrain 600m2 Almadies)"
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
            <input value={propertyLocation} onChange={e => setPropertyLocation(e.target.value)}
              placeholder="Localisation precise (quartier, ville)"
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-900 dark:text-white">Documents requis</h2>
            <span className="text-xs text-slate-400">{Object.keys(uploadedDocs).length}/{requiredDocs.length} uploades</span>
          </div>

          <div className="space-y-3">
            {requiredDocs.map(doc => {
              const uploaded = uploadedDocs[doc.id]
              return (
                <div key={doc.id} className={cn('rounded-2xl border-2 overflow-hidden transition-all',
                  uploaded ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800')}>
                  <div className="flex items-center gap-3 p-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      uploaded ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700')}>
                      <FileText size={18} className={uploaded ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn('font-black text-sm', uploaded ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white')}>
                          {doc.label}
                        </p>
                        {doc.required && !uploaded && (
                          <span className="text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-lg font-bold">Requis</span>
                        )}
                        {uploaded && <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />}
                      </div>
                      {uploaded
                        ? <p className="text-emerald-600 dark:text-emerald-400 text-xs truncate">{uploaded.name}</p>
                        : <p className="text-slate-400 text-xs">{doc.desc}</p>
                      }
                    </div>
                    {uploaded ? (
                      <button onClick={() => removeDoc(doc.id)}
                        className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <X size={13} className="text-rose-500" />
                      </button>
                    ) : (
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*,application/pdf" className="hidden"
                          onChange={e => handleFileSelect(doc.id, e)} />
                        <div className="flex items-center gap-1.5 bg-blue-900 text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap">
                          <Upload size={12} /> Ajouter
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
            Soumettez uniquement des documents authentiques. Toute fausse declaration entraine la suspension du compte et des poursuites judiciaires.
          </p>
        </div>

        <button onClick={handleSubmit} disabled={!requiredUploaded || !propertyTitle || !propertyLocation || submitting}
          className={cn('w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
            requiredUploaded && propertyTitle && propertyLocation && !submitting
              ? 'bg-yellow-400 text-blue-900 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
          {submitting
            ? <><div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" /> Soumission...</>
            : <><Shield size={18} /> Soumettre pour verification</>
          }
        </button>

        <div className="h-8" />
      </div>
    </div>
  )
}
