'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const slides = [
  {
    icon: MapPin,
    color: 'bg-blue-900',
    title: 'Trouvez le bien ideal',
    subtitle: 'Recherchez parmi des milliers de biens verifies en Afrique et dans la diaspora.',
  },
  {
    icon: Shield,
    color: 'bg-emerald-500',
    title: 'Faites confiance',
    subtitle: 'Tous nos biens sont verifies. Proprietaires et locataires ont un profil de confiance.',
  },
  {
    icon: Star,
    color: 'bg-yellow-400',
    title: 'Habitez sereinement',
    subtitle: 'Gestion locative, passeport locataire, et suivi des contrats en un seul endroit.',
  },
]

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

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  function next() {
    playTap()
    if (current < slides.length - 1) {
      setCurrent(c => c + 1)
    } else {
      router.push('/register')
    }
  }

  const slide = slides[current]
  const Icon = slide.icon

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Skip */}
      <div className="flex justify-end px-6 pt-14">
        <Link href="/login" onClick={playTap}>
          <span className="text-slate-400 text-sm font-bold">Passer</span>
        </Link>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        <div className={cn('w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl transition-all duration-500', slide.color)}>
          <Icon size={56} className={slide.color === 'bg-yellow-400' ? 'text-blue-900' : 'text-white'} strokeWidth={1.5} />
        </div>

        <div className="text-center max-w-xs">
          <h1 className="text-3xl font-black text-slate-900 leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-12">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { playTap(); setCurrent(i) }}
              className={cn('rounded-full transition-all duration-300',
                i === current ? 'w-8 h-2.5 bg-blue-900' : 'w-2.5 h-2.5 bg-slate-200')}>
            </button>
          ))}
        </div>

        <button onClick={next}
          className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-900/20">
          {current < slides.length - 1 ? (
            <> Suivant <ArrowRight size={18} /> </>
          ) : (
            <> Commencer <ArrowRight size={18} /> </>
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            Deja un compte ?{' '}
            <Link href="/login" onClick={playTap} className="text-blue-900 font-black">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
