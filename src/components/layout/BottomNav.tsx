'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Map, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const navItems = [
  { href: '/home', icon: Home, label: 'Accueil' },
  { href: '/search', icon: Search, label: 'Rechercher' },
  { href: '/map', icon: Map, label: 'Carte' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/profile', icon: User, label: 'Profil' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} onClick={playTap}
              className={cn('flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[56px] relative',
                active ? 'bg-blue-900/5' : '')}>
              {href === '/messages' && (
                <span className="absolute top-1.5 right-2.5 w-2 h-2 bg-blue-900 rounded-full" />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-blue-900 dark:text-yellow-400' : 'text-slate-400'} />
              <span className={cn('text-xs', active ? 'font-black text-blue-900 dark:text-yellow-400' : 'font-semibold text-slate-400')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
