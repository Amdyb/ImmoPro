'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Shield, MapPin, Star, Building, Users, MessageCircle, Search, Heart, Bell, ChevronRight, Play, CheckCircle, Menu, X } from 'lucide-react'
import Link from 'next/link'

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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

const cities = ['Dakar', 'Almadies', 'Saly', 'Saint-Louis', 'Touba', 'Ziguinchor', 'Lac Rose', 'Abidjan', 'Casablanca', 'Lagos', 'Ngor', 'Mermoz']

const features = [
  { icon: Shield, title: 'Biens 100% verifies', desc: 'Chaque annonce est authentifiee par notre equipe avant publication. Zero arnaque.', color: 'bg-blue-900', stat: '21 biens verifies' },
  { icon: MapPin, title: 'Carte interactive', desc: 'Recherchez par zone avec prix en temps reel. Dessinez votre zone de recherche.', color: 'bg-emerald-500', stat: '20 villes couvertes' },
  { icon: Star, title: 'Passeport Locataire', desc: 'Score de confiance pour rassurer les proprietaires. Votre reputation vous precede.', color: 'bg-yellow-500', stat: 'Score jusqu a 5.0' },
  { icon: MessageCircle, title: 'Contact direct', desc: 'Appelez, envoyez un WhatsApp ou un message directement depuis l annonce.', color: 'bg-green-500', stat: 'Reponse en < 1h' },
  { icon: Building, title: 'Gestion locative', desc: 'Tableau de bord proprietaire: loyers, maintenances, visites, locataires.', color: 'bg-purple-500', stat: 'Tout en 1 ecran' },
  { icon: Users, title: 'Pour toute l Afrique', desc: 'Senegal, Cote d Ivoire, Maroc, Nigeria et plus. La plateforme panafricaine.', color: 'bg-rose-500', stat: '6 pays couverts' },
]

const howItWorks = [
  { step: '01', title: 'Recherchez', desc: 'Tapez votre ville ou quartier. Filtrez par type, prix, surface.', icon: Search, color: 'bg-blue-900' },
  { step: '02', title: 'Sauvegardez', desc: 'Ajoutez vos biens preferes aux favoris. Comparez facilement.', icon: Heart, color: 'bg-rose-500' },
  { step: '03', title: 'Contactez', desc: 'Appelez ou WhatsApp le proprietaire directement. Planifiez une visite.', icon: MessageCircle, color: 'bg-emerald-500' },
  { step: '04', title: 'Emmenagez', desc: 'Signez votre contrat en toute confiance. Bienvenue chez vous!', icon: CheckCircle, color: 'bg-yellow-500' },
]

const testimonials = [
  { name: 'Aminata Diallo', role: 'Locataire', city: 'Dakar', text: 'J ai trouve mon appartement en 3 jours. Le passeport locataire m a aide a convaincre le proprietaire rapidement.', rating: 5, avatar: 'A' },
  { name: 'Mamadou Ba', role: 'Proprietaire', city: 'Ngor', text: 'Je gere mes 3 biens depuis mon telephone. Les visites sont bien organisees, les locataires serieux.', rating: 5, avatar: 'M' },
  { name: 'Cheikh Ndiaye', role: 'Agent immobilier', city: 'Almadies', text: 'Ma page agent sur ImmoPro m apporte 10 nouveaux clients par mois. Indispensable pour mon activite.', rating: 5, avatar: 'C' },
  { name: 'Fatou Sow', role: 'Acheteuse', city: 'Saly', text: 'J ai achete ma villa de vacances a Saly sans me deplacer. Photos, visite virtuelle, tout etait la.', rating: 5, avatar: 'F' },
]

const stats = [
  { value: '51+', label: 'Biens disponibles', sub: 'et ca augmente chaque jour' },
  { value: '20', label: 'Villes au Senegal', sub: 'de Dakar a Ziguinchor' },
  { value: '6', label: 'Pays africains', sub: 'et en expansion' },
  { value: '0 FCFA', label: 'Pour les utilisateurs', sub: 'toujours gratuit' },
]

export default function LandingPage() {
  const [cityIndex, setCityIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCityIndex(i => (i + 1) % cities.length), 2000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Sticky Nav */}
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent')}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ImmoPro" className="w-9 h-9 rounded-xl"
              onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
            <span className={cn('font-black text-xl transition-colors', scrolled ? 'text-blue-900' : 'text-white')}>ImmoPro</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {['Biens', 'Carte', 'Abonnements', 'A propos'].map(item => (
              <Link key={item} href={item === 'Biens' ? '/home' : item === 'Carte' ? '/map' : item === 'Abonnements' ? '/subscription' : '/home'}>
                <button onClick={playTap} className={cn('text-sm font-bold transition-colors', scrolled ? 'text-slate-600 hover:text-blue-900' : 'text-white/80 hover:text-white')}>
                  {item}
                </button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button onClick={playTap} className={cn('text-sm font-bold transition-colors', scrolled ? 'text-slate-600' : 'text-white')}>
                Se connecter
              </button>
            </Link>
            <Link href="/register">
              <button onClick={playTap} className="bg-yellow-400 text-blue-900 font-black text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform">
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen
              ? <X size={24} className={scrolled ? 'text-slate-900' : 'text-white'} />
              : <Menu size={24} className={scrolled ? 'text-slate-900' : 'text-white'} />
            }
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-b border-slate-100 px-6 py-4 space-y-3">
            {['Biens', 'Carte', 'Abonnements'].map(item => (
              <Link key={item} href={item === 'Biens' ? '/home' : item === 'Carte' ? '/map' : '/subscription'}>
                <button onClick={() => { playTap(); setMenuOpen(false) }} className="w-full text-left text-slate-700 font-bold py-2">
                  {item}
                </button>
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-3 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full border-2 border-blue-900 text-blue-900 font-black py-3 rounded-xl">Se connecter</button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full bg-blue-900 text-white font-black py-3 rounded-xl">S inscrire</button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-800/30 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/20">
                <Shield size={12} className="text-yellow-400" />
                Plateforme immobiliere de confiance en Afrique
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                Trouvez votre logement a{' '}
                <span className="text-yellow-400 block mt-1 transition-all duration-500">
                  {cities[cityIndex]}
                </span>
              </h1>

              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Trouvez votre logement ou publiez votre annonce en toute confiance. Biens verifies, proprietaires certifies. <span className="text-yellow-400 font-bold">100% gratuit</span> pour les acheteurs et locataires.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/home">
                  <button onClick={playTap} className="bg-yellow-400 text-blue-900 font-black text-base px-8 py-4 rounded-2xl flex items-center gap-2 justify-center active:scale-95 transition-transform shadow-xl shadow-yellow-400/20 w-full sm:w-auto">
                    Voir les logements <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/register">
                  <button onClick={playTap} className="bg-white/10 backdrop-blur text-white font-black text-base px-8 py-4 rounded-2xl flex items-center gap-2 justify-center border border-white/20 w-full sm:w-auto">
                    Publier une annonce
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                  <span className="text-white/60 text-xs ml-1">4.9/5</span>
                </div>
                <span className="text-white/30">·</span>
                <span className="text-white/60 text-xs">51+ logements actifs</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60 text-xs">20 villes couvertes</span>
              </div>
            </div>

            {/* Hero visual — mock phone */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl p-3">
                  {/* Mock app screen */}
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    <div className="bg-blue-900 px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-black text-sm">ImmoPro</span>
                        <Bell size={14} className="text-white" />
                      </div>
                      <div className="bg-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
                        <Search size={12} className="text-white/60" />
                        <span className="text-white/60 text-xs">Rechercher...</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      {[
                        { title: 'Villa Almadies', price: '85M FCFA', type: 'Vente', color: 'from-emerald-400 to-teal-500' },
                        { title: 'Appart. Plateau', price: '250K/mois', type: 'Location', color: 'from-blue-400 to-blue-600' },
                        { title: 'Terrain Saly', price: '25M FCFA', type: 'Vente', color: 'from-amber-400 to-orange-500' },
                      ].map(p => (
                        <div key={p.title} className="bg-slate-50 rounded-2xl overflow-hidden">
                          <div className={cn('h-16 bg-gradient-to-br', p.color, 'relative')}>
                            <span className="absolute bottom-1.5 left-2 text-white text-xs font-black bg-white/20 px-2 py-0.5 rounded-lg">{p.price}</span>
                            <span className="absolute top-1.5 right-2 text-xs font-black px-1.5 py-0.5 rounded-lg bg-white/90 text-slate-700">{p.type}</span>
                          </div>
                          <div className="px-2 py-1.5">
                            <p className="font-black text-slate-900 text-xs">{p.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -right-8 top-8 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
                  <Shield size={14} className="text-blue-900" />
                  <span className="text-xs font-black text-slate-900">Verifie</span>
                </div>
                <div className="absolute -left-8 bottom-16 bg-yellow-400 rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
                  <Star size={14} className="text-blue-900 fill-blue-900" />
                  <span className="text-xs font-black text-blue-900">4.9 / 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-blue-900 mb-1">{value}</p>
              <p className="font-bold text-slate-900 text-sm">{label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-900 font-black text-sm bg-blue-900/10 px-4 py-2 rounded-full">Comment ca marche</span>
            <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">Simple comme bonjour</h2>
            <p className="text-slate-500">Trouvez votre bien en 4 etapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map(({ step, title, desc, icon: Icon, color }, i) => (
              <div key={step} className="relative text-center">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-slate-200 -translate-x-4 z-0" />
                )}
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10', color)}>
                  <Icon size={28} className="text-white" />
                </div>
                <p className="text-xs font-black text-slate-400 mb-1">{step}</p>
                <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-900 font-black text-sm bg-blue-900/10 px-4 py-2 rounded-full">Fonctionnalites</span>
            <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-500">Une plateforme complete pour tous vos besoins immobiliers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, color, stat }) => (
              <div key={title} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4', color)}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{desc}</p>
                <span className="text-xs font-black text-blue-900 bg-blue-900/5 px-2 py-1 rounded-lg">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free for users banner */}
      <section className="py-16 px-6 bg-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Toujours gratuit pour les utilisateurs</h2>
          <p className="text-white/80 text-lg mb-6">Recherche, favoris, messages, visites — tout est gratuit pour les acheteurs et locataires. Toujours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Recherche illimitee', 'Favoris', 'Messages', 'Visites', 'Carte', 'Notifications', 'Passeport Locataire'].map(f => (
              <span key={f} className="bg-white/20 text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5">
                <CheckCircle size={14} /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-900 font-black text-sm bg-blue-900/10 px-4 py-2 rounded-full">Temoignages</span>
            <h2 className="text-3xl font-black text-slate-900 mt-4 mb-3">Ils nous font confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-4 text-sm">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Disponible partout</h2>
          <p className="text-slate-500 mb-8">Du Senegal au Nigeria, de Casablanca a Abidjan</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Dakar', 'Saly', 'Saint-Louis', 'Touba', 'Lac Rose', 'Ziguinchor', 'Abidjan', 'Casablanca', 'Lagos', 'Douala', 'Bamako', 'Thies', 'Kaolack', 'Louga'].map(city => (
              <Link key={city} href={'/search'}>
                <button onClick={playTap}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all">
                  <MapPin size={12} /> {city}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-2xl" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">Pret a trouver votre bien?</h2>
          <p className="text-white/70 text-lg mb-8">Rejoignez des milliers d utilisateurs qui font confiance a ImmoPro. C est gratuit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <button onClick={playTap}
                className="bg-yellow-400 text-blue-900 font-black text-lg px-10 py-4 rounded-2xl flex items-center gap-2 justify-center active:scale-95 transition-transform shadow-xl">
                Creer un compte gratuit <ArrowRight size={22} />
              </button>
            </Link>
            <Link href="/home">
              <button onClick={playTap}
                className="bg-white/10 text-white font-black text-lg px-10 py-4 rounded-2xl flex items-center gap-2 justify-center border border-white/20">
                Parcourir les biens
              </button>
            </Link>
          </div>
          <p className="text-white/40 text-sm mt-6">Aucune carte bancaire requise · Toujours gratuit pour les utilisateurs</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="ImmoPro" className="w-10 h-10 rounded-xl"
              onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
            <div>
              <span className="font-black text-white text-xl">ImmoPro</span>
              <p className="text-slate-500 text-xs">Find. Trust. Live.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { title: 'Plateforme', links: [{ label: 'Accueil', href: '/home' }, { label: 'Rechercher', href: '/search' }, { label: 'Carte', href: '/map' }, { label: 'Abonnements', href: '/subscription' }] },
              { title: 'Utilisateurs', links: [{ label: 'Acheteurs', href: '/home' }, { label: 'Locataires', href: '/home' }, { label: 'Proprietaires', href: '/register' }, { label: 'Agents', href: '/register' }] },
              { title: 'Villes', links: [{ label: 'Dakar', href: '/search' }, { label: 'Saly', href: '/search' }, { label: 'Saint-Louis', href: '/search' }, { label: 'Abidjan', href: '/search' }] },
              { title: 'ImmoPro', links: [{ label: 'Admin', href: '/admin' }, { label: 'Disputes', href: '/disputes' }, { label: 'Verification', href: '/land-verification' }, { label: 'Contact', href: '/messages' }] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-black text-white text-sm mb-4">{title}</p>
                {links.map(({ label, href }) => (
                  <Link key={label} href={href}>
                    <p className="text-slate-400 text-xs mb-2.5 hover:text-white cursor-pointer transition-colors">{label}</p>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">2026 ImmoPro. Tous droits reserves. immopro.agency</p>
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
