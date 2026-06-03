'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Home, Users, Wrench, BarChart3, Bell, Plus, CheckCircle, MessageCircle, Calendar } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
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

const tabs = [
  { id: 'overview', label: 'Apercu', icon: BarChart3 },
  { id: 'properties', label: 'Biens', icon: Home },
  { id: 'tenants', label: 'Locataires', icon: Users },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
]

const properties = [
  { id: '1', title: 'Appartement 3p, Almadies', rent: 250000, status: 'occupied', tenant: 'Mamadou Ba', gradient: 'from-blue-400 to-blue-600' },
  { id: '2', title: 'Villa 4ch, Ngor', rent: 850000, status: 'vacant', tenant: null, gradient: 'from-emerald-400 to-teal-600' },
  { id: '3', title: 'Studio, Point E', rent: 150000, status: 'occupied', tenant: 'Aminata Sow', gradient: 'from-purple-400 to-purple-600' },
]

const tenants = [
  { name: 'Mamadou Ba', property: 'Appart. 3p, Almadies', since: 'Jan 2024', score: 4.8, avatar: 'M' },
  { name: 'Aminata Sow', property: 'Studio, Point E', since: 'Mar 2023', score: 4.5, avatar: 'A' },
]

const maintenance = [
  { id: '1', issue: 'Fuite eau salle de bain', property: 'Appart. 4A', type: 'Plomberie', status: 'open', time: '2h' },
  { id: '2', issue: 'Climatisation en panne', property: 'Villa 2', type: 'Climatisation', status: 'in_progress', time: '1j' },
  { id: '3', issue: 'Porte defectueuse', property: 'Appart. 3B', type: 'Electricite', status: 'resolved', time: '3j' },
]

const statusColors: Record<string, string> = {
  open: 'text-rose-600 bg-rose-50',
  in_progress: 'text-amber-600 bg-amber-50',
  resolved: 'text-emerald-600 bg-emerald-50',
}

const statusLabels: Record<string, string> = {
  open: 'Ouvert',
  in_progress: 'En cours',
  resolved: 'Resolu',
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-6 px-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/60 text-sm">Tableau de bord</p>
            <h1 className="text-white text-2xl font-black">Bonjour, Amdy</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={playTap} className="relative w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Bell size={18} className="text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center">
              <span className="text-blue-900 font-black">A</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { value: '3', label: 'Biens' },
            { value: '2', label: 'Locataires' },
            { value: '1', label: 'Vacant' },
            { value: '2', label: 'Tickets' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-white font-black text-xl">{value}</p>
              <p className="text-white/50 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-5">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { playTap(); setActiveTab(id) }}
              className={cn('flex items-center gap-1.5 px-4 py-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
                activeTab === id ? 'border-blue-900 text-blue-900 dark:text-yellow-400 dark:border-yellow-400' : 'border-transparent text-slate-400')}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
              <p className="text-slate-500 text-sm mb-1">Revenus ce mois</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(400000)}</p>
              <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">+12% vs mois dernier</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white mb-3">Activites recentes</h3>
              <div className="space-y-3">
                {[
                  { icon: Wrench, text: 'Nouvelle demande maintenance - Appart. 4A', time: '2h', color: 'bg-rose-50 text-rose-600' },
                  { icon: MessageCircle, text: 'Message de Aminata Sow', time: 'Hier', color: 'bg-blue-50 text-blue-600' },
                  { icon: CheckCircle, text: 'Loyer recu - Mamadou Ba', time: '2j', color: 'bg-emerald-50 text-emerald-600' },
                  { icon: Calendar, text: 'Visite programmee - Villa Ngor', time: '3j', color: 'bg-purple-50 text-purple-600' },
                ].map(({ icon: Icon, text, time, color }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
                      <Icon size={16} />
                    </div>
                    <p className="flex-1 text-slate-700 dark:text-slate-300 text-xs">{text}</p>
                    <span className="text-slate-400 text-xs">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white">Mes biens</h3>
              <Link href="/add-property" onClick={playTap}>
                <button className="flex items-center gap-1 bg-blue-900 text-white text-xs font-bold px-3 py-2 rounded-xl">
                  <Plus size={14} /> Ajouter
                </button>
              </Link>
            </div>
            {properties.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <div className={cn('h-24 bg-gradient-to-br relative', p.gradient)}>
                  <div className="absolute top-3 right-3">
                    <span className={cn('text-xs font-black px-2 py-1 rounded-xl', p.status === 'occupied' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700')}>
                      {p.status === 'occupied' ? 'Occupe' : 'Vacant'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-black text-slate-900 dark:text-white">{p.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-blue-900 dark:text-yellow-400 font-black text-sm">{formatPrice(p.rent)}/mois</span>
                    {p.tenant && <span className="text-slate-400 text-xs">Loc: {p.tenant}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 dark:text-white">Mes locataires</h3>
            {tenants.map(t => (
              <div key={t.name} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-lg">{t.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.property}</p>
                    <p className="text-slate-400 text-xs">Depuis {t.since}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="font-black text-slate-900 dark:text-white">{t.score}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={playTap} className="flex-1 flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold py-2 rounded-xl">
                    <MessageCircle size={14} /> Message
                  </button>
                  <button onClick={playTap} className="flex-1 flex items-center justify-center gap-1 bg-blue-900 text-white text-xs font-bold py-2 rounded-xl">
                    Voir profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 dark:text-white">Demandes de maintenance</h3>
            {maintenance.map(m => (
              <div key={m.id} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-black text-slate-900 dark:text-white text-sm">{m.issue}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{m.property} - {m.type}</p>
                  </div>
                  <span className={cn('text-xs font-black px-2 py-1 rounded-xl flex-shrink-0', statusColors[m.status])}>
                    {statusLabels[m.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Il y a {m.time}</span>
                  <button onClick={playTap} className="text-blue-900 dark:text-yellow-400 text-xs font-bold">Voir details</button>
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
