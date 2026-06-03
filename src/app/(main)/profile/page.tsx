'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Shield, Star, Home, Key, Settings, ChevronRight, Bell, Moon, Globe, LogOut, Edit3, Award, Zap, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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

const menuItems = [
  { icon: Home, label: 'Mes annonces', desc: '3 biens publies', href: '/my-properties' },
  { icon: Key, label: 'Mes locations', desc: '1 contrat actif', href: '/my-leases' },
  { icon: Star, label: 'Mes avis', desc: '12 avis recus', href: '/my-reviews' },
  { icon: Award, label: 'Passeport Locataire', desc: 'Score: 4.6 / 5', href: '/passport' },
  { icon: Zap, label: 'Mon abonnement', desc: 'Plan Gratuit - Mettre a niveau', href: '/subscription' },
  { icon: Shield, label: 'Verification terrain', desc: 'Obtenez le badge verifie', href: '/land-verification' },
  { icon: BarChart3, label: 'Analytics', desc: 'Performance de vos annonces', href: '/analytics' },
  { icon: Star, label: 'Centre de litiges', desc: 'Signaler un probleme', href: '/disputes' },
]

const settingsItems = [
  { icon: Bell, label: 'Notifications', desc: 'Actives' },
  { icon: Moon, label: 'Theme', desc: 'Automatique' },
  { icon: Globe, label: 'Langue', desc: 'Francais' },
  { icon: Shield, label: 'Confidentialite', desc: 'Parametres' },
]

export default function ProfilePage() {
  const [soundEnabled, setSoundEnabled] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 px-5 pt-14 pb-6">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Profil</h1>
          <button onClick={playTap} className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Settings size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-blue-900 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-2xl">A</span>
            </div>
            <button onClick={playTap} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center shadow">
              <Edit3 size={12} className="text-blue-900" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Amdy Boubacar</h2>
              <span className="flex items-center gap-1 bg-blue-900/10 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                <Shield size={8} /> Verifie
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">amdy@amdylabs.com</p>
            <p className="text-slate-400 text-xs mt-0.5">Membre depuis mai 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { value: '3', label: 'Annonces' },
            { value: '4.6', label: 'Note moy.' },
            { value: '12', label: 'Avis' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-blue-900 dark:text-yellow-400">{value}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
          {menuItems.map(({ icon: Icon, label, desc, href }, i) => (
            <Link key={label} href={href} onClick={playTap}>
              <div className={cn('flex items-center gap-4 px-4 py-4 active:bg-slate-50 transition-colors',
                i < menuItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : '')}>
                <div className="w-10 h-10 rounded-2xl bg-blue-900/5 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-blue-900 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 dark:text-white text-sm">{label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="px-4 pt-4 pb-2 text-xs font-black text-slate-400 uppercase tracking-wider">Parametres</p>
          {settingsItems.map(({ icon: Icon, label, desc }, i) => (
            <button key={label} onClick={playTap} className={cn('w-full flex items-center gap-4 px-4 py-4 active:bg-slate-50 transition-colors',
              i < settingsItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : '')}>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-black text-slate-900 dark:text-white text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
          <div className="flex items-center gap-4 px-4 py-4 border-t border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <Bell size={18} className="text-slate-600 dark:text-slate-300" />
            </div>
            <div className="flex-1">
              <p className="font-black text-slate-900 dark:text-white text-sm">Sons</p>
              <p className="text-slate-400 text-xs mt-0.5">{soundEnabled ? 'Actives' : 'Desactives'}</p>
            </div>
            <button onClick={() => { setSoundEnabled(!soundEnabled); playTap() }}
              className={cn('w-12 h-6 rounded-full transition-all duration-300 relative',
                soundEnabled ? 'bg-blue-900' : 'bg-slate-200')}>
              <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300',
                soundEnabled ? 'left-7' : 'left-1')} />
            </button>
          </div>
        </div>

        <button onClick={playTap} className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-500 font-black py-4 rounded-3xl border border-rose-100">
          <LogOut size={18} />
          <span>Se deconnecter</span>
        </button>
        <div className="h-8" />
      </div>
    </div>
  )
}
