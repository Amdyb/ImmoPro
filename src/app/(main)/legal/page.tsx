'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ArrowLeft, Lock, Scale, Phone, Mail, MapPin, FileText, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function LegalPage() {
  const router = useRouter()
  const [active, setActive] = useState('help')

  const tabs = [
    { id: 'help', label: 'Aide', icon: HelpCircle },
    { id: 'privacy', label: 'Confidentialite', icon: Lock },
    { id: 'terms', label: 'CGU', icon: Scale },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'about', label: 'A propos', icon: FileText },
  ]

  const helpItems = [
    { q: 'Comment publier une annonce?', a: 'Appuyez sur + en bas, remplissez les 4 etapes et publiez.' },
    { q: 'Comment contacter un proprietaire?', a: 'Sur la page annonce, appuyez Appeler ou WhatsApp.' },
    { q: 'Qu est-ce que le Passeport Locataire?', a: 'Votre score de confiance sur ImmoPro.' },
    { q: 'Comment signaler une annonce?', a: 'Allez dans Centre de litiges depuis votre profil.' },
    { q: 'Comment supprimer mon compte?', a: 'Profil > Parametres > Supprimer mon compte.' },
    { q: 'L app est-elle sur iOS et Android?', a: 'Appuyez Partager > Ajouter a l ecran d accueil.' },
    { q: 'Quels modes de paiement?', a: 'Wave, Orange Money, Free Money et carte bancaire.' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-blue-900 pt-14 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white text-xl font-black">Aide et informations</h1>
      </div>
      <div className="flex overflow-x-auto px-5 py-3 gap-2 border-b border-slate-100 dark:border-slate-800" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={cn('flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all',
              active === id ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
            <Icon size={12} />{label}
          </button>
        ))}
      </div>
      <div className="px-5 py-6 pb-24 space-y-3">
        {active === 'help' && helpItems.map((item, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4">
            <p className="font-black text-slate-900 dark:text-white text-sm mb-1">{item.q}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{item.a}</p>
          </div>
        ))}
        {active === 'privacy' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 space-y-4">
            <p className="font-black text-slate-900 dark:text-white">Politique de confidentialite</p>
            {[['Collecte','Nom, email, telephone et biens publies.'],['Partage','Nous ne vendons jamais vos donnees.'],['Securite','Chiffrement SSL, mots de passe hashas.'],['Contact','privacy@immopro.agency']].map(([t,a]) => (
              <div key={t}><p className="font-bold text-slate-900 dark:text-white text-sm">{t}</p><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{a}</p></div>
            ))}
          </div>
        )}
        {active === 'terms' && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 space-y-4">
            <p className="font-black text-slate-900 dark:text-white">Conditions d utilisation</p>
            {[['Gratuit','Toujours gratuit pour acheteurs et locataires.'],['Interdit','Annonces frauduleuses et contenu illegal interdits.'],['Litiges','Tribunaux competents du Senegal.']].map(([t,a]) => (
              <div key={t}><p className="font-bold text-slate-900 dark:text-white text-sm">{t}</p><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{a}</p></div>
            ))}
          </div>
        )}
        {active === 'contact' && (
          <div className="space-y-3">
            {[{icon:Mail,label:'Email',value:'support@immopro.agency',href:'mailto:support@immopro.agency',color:'bg-blue-900'},{icon:Phone,label:'WhatsApp',value:'+221 77 000 00 00',href:'https://wa.me/221770000000',color:'bg-emerald-500'}].map(({icon:Icon,label,value,href,color}) => (
              <a key={label} href={href}><div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex items-center gap-4"><div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center',color)}><Icon size={20} className="text-white" /></div><div><p className="font-black text-slate-900 dark:text-white">{label}</p><p className="text-slate-400 text-sm">{value}</p></div></div></a>
            ))}
          </div>
        )}
        {active === 'about' && (
          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5"><p className="font-black text-slate-900 dark:text-white mb-2">Notre mission</p><p className="text-slate-500 dark:text-slate-400 text-sm">ImmoPro democratise l acces a l immobilier en Afrique.</p></div>
            <div className="bg-blue-900 rounded-3xl p-5 text-center"><p className="font-black text-white">Powered by AMDY LABS</p><p className="text-white/60 text-sm mt-1">Version 1.0 · 2026</p></div>
          </div>
        )}
      </div>
    </div>
  )
}
