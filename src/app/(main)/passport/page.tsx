'use client'

export const dynamic = 'force-dynamic'

import { Shield, Star, CheckCircle, FileText, Phone, Briefcase, Home, AlertCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

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

const verifications = [
  { label: 'Telephone verifie', done: true, icon: Phone },
  { label: 'Piece d identite', done: true, icon: Shield },
  { label: 'References verifiees', done: true, icon: Star },
  { label: 'Emploi verifie', done: false, icon: Briefcase },
  { label: 'Historique locatif', done: true, icon: Home },
]

const documents = [
  { label: 'Piece d identite', status: 'Verifiee', color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Contrat de travail', status: 'Verifie', color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Bulletin de salaire', status: 'Verifie', color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Justificatif domicile', status: 'En attente', color: 'text-amber-600 bg-amber-50' },
]

const rentalHistory = [
  { address: 'Appartement 3p, Almadies', period: 'Jan 2022 - Dec 2023', rating: 4.8, status: 'Termine' },
  { address: 'Studio, Point E', period: 'Mar 2020 - Dec 2021', rating: 4.5, status: 'Termine' },
  { address: 'Villa, Ngor', period: 'Jan 2024 - Present', rating: null, status: 'En cours' },
]

export default function PassportPage() {
  const router = useRouter()
  const score = 4.6
  const scorePercent = (score / 5) * 100

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Header */}
      <div className="bg-blue-900 pt-14 pb-8 px-5">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { playTap(); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-black">Passeport Locataire</h1>
        </div>

        {/* Profile card */}
        <div className="bg-white/10 rounded-3xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-900 font-black text-2xl">A</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-black text-lg">Amdy Boubacar</h2>
                <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  <Shield size={8} /> Verifie
                </span>
              </div>
              <p className="text-white/60 text-xs">Locataire · Dakar, Senegal</p>
              <p className="text-white/40 text-xs mt-0.5">ID: IMP-762349 · Membre mars 2023</p>
            </div>
          </div>

          {/* Score */}
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70 text-xs font-bold">Score de confiance</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} className={i <= Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'} />
                ))}
                <span className="text-white font-black text-sm ml-1">{score}</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                style={{ width: scorePercent + '%' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-white/40 text-xs">0</span>
              <span className="text-yellow-400 text-xs font-bold">Excellent</span>
              <span className="text-white/40 text-xs">5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '3', label: 'Locations', sub: 'completees' },
            { value: '0', label: 'Litiges', sub: 'resolus' },
            { value: '4.8', label: 'Note', sub: 'moyenne' },
          ].map(({ value, label, sub }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-3 text-center shadow-sm border border-slate-100 dark:border-slate-700">
              <p className="text-xl font-black text-blue-900 dark:text-yellow-400">{value}</p>
              <p className="text-slate-700 dark:text-white text-xs font-bold">{label}</p>
              <p className="text-slate-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>

        {/* Verifications */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-black text-slate-900 dark:text-white mb-4">Verifications</h3>
          <div className="space-y-3">
            {verifications.map(({ label, done, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                  done ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-100 dark:bg-slate-700')}>
                  <Icon size={16} className={done ? 'text-emerald-600' : 'text-slate-400'} />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                {done
                  ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                  : <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-900 dark:text-white">Documents</h3>
            <button onClick={playTap} className="text-blue-900 dark:text-yellow-400 text-xs font-bold">Voir tout</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {documents.map(({ label, status, color }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-3">
                <FileText size={20} className="text-slate-400 mb-2" />
                <p className="text-slate-900 dark:text-white text-xs font-black leading-tight">{label}</p>
                <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block', color)}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rental History */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-black text-slate-900 dark:text-white mb-4">Historique locatif</h3>
          <div className="space-y-3">
            {rentalHistory.map((r, i) => (
              <div key={i} className={cn('flex items-center gap-3 pb-3', i < rentalHistory.length - 1 && 'border-b border-slate-100 dark:border-slate-700')}>
                <div className="w-10 h-10 rounded-2xl bg-blue-900/5 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Home size={18} className="text-blue-900 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 dark:text-white text-sm leading-tight">{r.address}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{r.period}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {r.rating ? (
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-slate-700 dark:text-white text-xs font-black">{r.rating}</span>
                    </div>
                  ) : (
                    <span className="text-emerald-600 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                      {r.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share passport */}
        <button onClick={playTap}
          className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
          <Shield size={18} />
          Partager mon passeport
        </button>

        <div className="h-8" />
      </div>
    </div>
  )
}
