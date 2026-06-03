'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Shield, MapPin, Star, Building, Users, CheckCircle, Phone, MessageCircle, ChevronRight } from 'lucide-react'
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

const features = [
  { icon: Shield, title: 'Biens verifies', desc: 'Chaque annonce est authentifiee par notre equipe', color: 'bg-blue-900' },
  { icon: MapPin, title: 'Carte interactive', desc: 'Recherchez par zone geographique avec prix en temps reel', color: 'bg-emerald-500' },
  { icon: Star, title: 'Passeport Locataire', desc: 'Score de confiance pour locataires et proprietaires', color: 'bg-yellow-500' },
  { icon: MessageCircle, title: 'WhatsApp integre', desc: 'Contactez directement les proprietaires', color: 'bg-emerald-600' },
  { icon: Building, title: 'Gestion locative', desc: 'Tableau de bord proprietaire complet', color: 'bg-purple-500' },
  { icon: Users, title: 'Pour toute l Afrique', desc: 'Dakar, Abidjan, Casablanca, Lagos et plus', color: 'bg-rose-500' },
]

const testimonials = [
  { name: 'Aminata Diallo', role: 'Locataire, Dakar', text: 'J ai trouve mon appartement en 3 jours. Le passeport locataire m a vraiment aide a convaincre le proprietaire.', rating: 5 },
  { name: 'Mamadou Ba', role: 'Proprietaire, Ngor', text: 'Je gere mes 3 biens depuis mon telephone. Les visites sont bien organisees et les locataires serieux.', rating: 5 },
  { name: 'Cheikh Ndiaye', role: 'Agent immobilier', text: 'Ma page agent sur ImmoPro m apporte 10 nouveaux clients par mois. Indispensable pour mon activite.', rating: 5 },
]

const cities = ['Dakar', 'Almadies', 'Ngor', 'Saly', 'Saint-Louis', 'Touba', 'Ziguinchor', 'Lac Rose', 'Abidjan', 'Casablanca', 'Lagos']

export default function LandingPage() {
  const [cityIndex, setCityIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCityIndex(i => (i + 1) % cities.length), 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ImmoPro" className="w-8 h-8 rounded-xl" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
          <span className="font-black text-blue-900 text-lg">ImmoPro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button onClick={playTap} className="text-slate-600 font-bold text-sm hidden md:block">Se connecter</button>
          </Link>
          <Link href="/register">
            <button onClick={playTap} className="bg-blue-900 text-white font-black text-sm px-4 py-2.5 rounded-xl">
              Commencer
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-yellow-400" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full mb-6">
            <Shield size={12} className="text-yellow-400" />
            La plateforme immobiliere de confiance en Afrique
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            Trouvez votre bien a{' '}
            <span className="text-yellow-400 transition-all duration-500">{cities[cityIndex]}</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Achetez, louez ou vendez en toute confiance. Biens verifies, proprietaires certifies, locataires evalues.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/home">
              <button onClick={playTap} className="bg-yellow-400 text-blue-900 font-black text-base px-8 py-4 rounded-2xl flex items-center gap-2 justify-center active:scale-95 transition-transform shadow-xl">
                Voir les biens <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/register">
              <button onClick={playTap} className="bg-white/10 backdrop-blur text-white font-black text-base px-8 py-4 rounded-2xl flex items-center gap-2 justify-center border border-white/20">
                Publier une annonce
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { value: '51+', label: 'Biens disponibles' },
              { value: '20', label: 'Villes au Senegal' },
              { value: '100%', label: 'Annonces verifiees' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-500">Une plateforme complete pour tous vos besoins immobiliers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4', color)}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Disponible partout en Afrique</h2>
          <p className="text-slate-500 mb-8">Du Senegal au Nigeria en passant par le Maroc et la Cote d Ivoire</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Dakar', 'Saly', 'Saint-Louis', 'Touba', 'Ziguinchor', 'Lac Rose', 'Abidjan', 'Casablanca', 'Lagos', 'Douala', 'Bamako'].map(city => (
              <Link key={city} href={'/search?q=' + city}>
                <button onClick={playTap} className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all">
                  <MapPin size={12} /> {city}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Ils nous font confiance</h2>
            <p className="text-slate-500">Des milliers d utilisateurs satisfaits a travers l Afrique</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-black text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Pret a commencer?</h2>
          <p className="text-white/70 mb-8">Rejoignez des milliers d utilisateurs qui font confiance a ImmoPro</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <button onClick={playTap} className="bg-yellow-400 text-blue-900 font-black text-base px-8 py-4 rounded-2xl flex items-center gap-2 justify-center active:scale-95 transition-transform">
                Creer un compte gratuit <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/home">
              <button onClick={playTap} className="bg-white/10 text-white font-black text-base px-8 py-4 rounded-2xl flex items-center gap-2 justify-center border border-white/20">
                Parcourir les biens
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="ImmoPro" className="w-8 h-8 rounded-xl" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
            <span className="font-black text-white text-lg">ImmoPro</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { title: 'Plateforme', links: ['Accueil', 'Rechercher', 'Carte', 'Abonnements'] },
              { title: 'Utilisateurs', links: ['Acheteurs', 'Locataires', 'Proprietaires', 'Agents'] },
              { title: 'Villes', links: ['Dakar', 'Saly', 'Saint-Louis', 'Abidjan'] },
              { title: 'ImmoPro', links: ['A propos', 'Contact', 'CGU', 'Confidentialite'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-black text-white text-sm mb-3">{title}</p>
                {links.map(link => (
                  <p key={link} className="text-slate-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">{link}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">2026 ImmoPro. Tous droits reserves.</p>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs">Powered by</span>
              <span className="font-black text-xs bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AMDY LABS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
