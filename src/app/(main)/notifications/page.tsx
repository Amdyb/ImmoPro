'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Bell, Shield, Calendar, MessageCircle, Heart, Home, Star, ChevronRight, Check } from 'lucide-react'
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

const mockNotifications = [
  { id: '1', type: 'visit', icon: Calendar, color: 'bg-blue-900', title: 'Visite confirmee', body: 'Mamadou Ba a confirme votre visite pour le 17 Jun a 09:00', time: '2 min', read: false, link: '/book-visit/1' },
  { id: '2', type: 'message', icon: MessageCircle, color: 'bg-emerald-500', title: 'Nouveau message', body: 'Aminata Sow: Bonjour, je suis toujours interessee par l appartement', time: '15 min', read: false, link: '/messages' },
  { id: '3', type: 'verified', icon: Shield, color: 'bg-yellow-400', title: 'Bien verifie', body: 'Votre annonce "Villa moderne 4ch" a ete verifiee par ImmoPro', time: '1h', read: false, link: '/property/1' },
  { id: '4', type: 'favorite', icon: Heart, color: 'bg-rose-500', title: 'Nouveau favori', body: '3 personnes ont sauvegarde votre bien cette semaine', time: '2h', read: true, link: '/dashboard' },
  { id: '5', type: 'visit_request', icon: Calendar, color: 'bg-purple-500', title: 'Demande de visite', body: 'Cheikh Ndiaye souhaite visiter votre studio le 20 Jun', time: '3h', read: true, link: '/dashboard' },
  { id: '6', type: 'review', icon: Star, color: 'bg-amber-400', title: 'Nouvel avis', body: 'Fatou Diallo vous a laisse un avis 5 etoiles', time: '1j', read: true, link: '/profile' },
  { id: '7', type: 'property', icon: Home, color: 'bg-teal-500', title: 'Nouveau bien correspondant', body: 'Un appartement a Almadies correspond a votre recherche', time: '1j', read: true, link: '/search' },
  { id: '8', type: 'message', icon: MessageCircle, color: 'bg-emerald-500', title: 'Message de ImmoPro', body: 'Bienvenue sur ImmoPro! Completez votre profil pour plus de visibilite', time: '2j', read: true, link: '/profile' },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  function markAllRead() {
    playTap()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function handleNotificationClick(n: typeof notifications[0]) {
    playTap()
    markRead(n.id)
    router.push(n.link)
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    return true
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-blue-900 dark:text-yellow-400 text-xs font-bold bg-blue-900/5 dark:bg-yellow-400/10 px-3 py-2 rounded-xl">
              <Check size={12} /> Tout lire
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'unread', label: 'Non lues' + (unreadCount > 0 ? ' (' + unreadCount + ')' : '') },
          ].map(f => (
            <button key={f.id} onClick={() => { playTap(); setFilter(f.id) }}
              className={cn('px-4 py-2 rounded-xl text-xs font-bold transition-all',
                filter === f.id ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="font-black text-slate-400 text-lg">Aucune notification</p>
            <p className="text-slate-400 text-sm mt-1">Vous etes a jour!</p>
          </div>
        ) : (
          filtered.map(n => (
            <button key={n.id} onClick={() => handleNotificationClick(n)}
              className={cn('w-full flex items-start gap-4 px-5 py-4 text-left transition-colors',
                !n.read ? 'bg-blue-900/3 dark:bg-blue-900/10 hover:bg-blue-900/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800')}>
              <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5', n.color)}>
                <n.icon size={18} className={n.color === 'bg-yellow-400' || n.color === 'bg-amber-400' ? 'text-blue-900' : 'text-white'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm leading-tight', !n.read ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300')}>
                    {n.title}
                  </p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs text-slate-400">{n.time}</span>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-900 dark:bg-yellow-400 flex-shrink-0" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.body}</p>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="h-24" />
    </div>
  )
}
