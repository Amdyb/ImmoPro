'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { User, Home, Shield, Star, Settings, ChevronRight, Bell, LogOut, Edit3, Award, Zap, BarChart3, AlertTriangle, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

const menuSections = [
  {
    title: 'Mon espace',
    items: [
      { icon: Home, label: 'Mes annonces', desc: 'Gerer mes biens publies', href: '/dashboard' },
      { icon: Award, label: 'Passeport Locataire', desc: 'Mon score de confiance', href: '/passport' },
      { icon: BarChart3, label: 'Analytics', desc: 'Performance de mes annonces', href: '/analytics' },
      { icon: Zap, label: 'Mon abonnement', desc: 'Plan Gratuit - Mettre a niveau', href: '/subscription' },
    ]
  },
  {
    title: 'Outils',
    items: [
      { icon: Shield, label: 'Verification terrain', desc: 'Obtenez le badge verifie', href: '/land-verification' },
      { icon: AlertTriangle, label: 'Centre de litiges', desc: 'Signaler un probleme', href: '/disputes' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', desc: 'Gerer mes alertes', href: '/notifications' },
      { icon: Settings, label: 'Parametres', desc: 'Compte et securite', href: '#' },
    ]
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [propertyCount, setPropertyCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles').select('*').eq('id', user.id).single()
        setProfile(profileData)
        const { count } = await supabase
          .from('properties').select('*', { count: 'exact', head: true }).eq('owner_id', user.id)
        setPropertyCount(count || 0)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleLogout() {
    playTap()
    await supabase.auth.signOut()
    router.push('/')
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
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <User size={36} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Mon profil</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Connectez-vous pour acceder a votre profil</p>
        <Link href="/login" className="w-full">
          <button className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl mb-3">Se connecter</button>
        </Link>
        <Link href="/register" className="w-full">
          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-4 rounded-2xl">Creer un compte</button>
        </Link>
      </div>
    )
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-16 px-5">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-black">Mon profil</h1>
          <button onClick={playTap} className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <Edit3 size={16} className="text-white" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-blue-900 flex items-center justify-center">
                <span className="text-white font-black text-2xl">{initials}</span>
              </div>
              <button onClick={playTap} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow">
                <Camera size={12} className="text-blue-900" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-black text-slate-900 dark:text-white text-lg">{displayName}</h2>
              <p className="text-slate-400 text-sm">{user.email}</p>
              {profile?.phone && <p className="text-slate-400 text-sm">{profile.phone}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className={cn('text-xs font-black px-2 py-0.5 rounded-lg',
                  profile?.role === 'admin' ? 'bg-yellow-100 text-yellow-700' :
                  profile?.role === 'agent' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')}>
                  {profile?.role || 'Utilisateur'}
                </span>
                {profile?.is_verified && (
                  <span className="flex items-center gap-1 text-xs font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg">
                    <Shield size={10} /> Verifie
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Annonces', value: propertyCount.toString() },
              { label: 'Favoris', value: '0' },
              { label: 'Avis', value: '5.0' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-3 text-center">
                <p className="font-black text-blue-900 dark:text-yellow-400 text-lg">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {menuSections.map(section => (
          <div key={section.title} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="px-4 pt-4 pb-2 text-xs font-black text-slate-400 uppercase tracking-wider">{section.title}</p>
            {section.items.map(({ icon: Icon, label, desc, href }) => (
              <Link key={label} href={href}>
                <button onClick={playTap} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-t border-slate-50 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-2xl bg-blue-900/5 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-blue-900 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-black text-slate-900 dark:text-white text-sm">{label}</p>
                    <p className="text-slate-400 text-xs">{desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                </button>
              </Link>
            ))}
          </div>
        ))}

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-black py-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
          <LogOut size={18} /> Se deconnecter
        </button>

        <div className="text-center py-4">
          <p className="text-slate-300 dark:text-slate-600 text-xs">ImmoPro v1.0 · Powered by AMDY LABS</p>
        </div>
        <div className="h-24" />
      </div>
    </div>
  )
}
