'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const roles = [
  { id: 'buyer', label: 'Acheteur', desc: 'Je cherche a acheter' },
  { id: 'tenant', label: 'Locataire', desc: 'Je cherche a louer' },
  { id: 'landlord', label: 'Proprietaire', desc: 'Je loue mes biens' },
  { id: 'agent', label: 'Agent', desc: 'Agent immobilier' },
  { id: 'agency', label: 'Agence', desc: 'Agence immobiliere' },
  { id: 'manager', label: 'Gestionnaire', desc: 'Gestion de biens' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('buyer')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!email || !password || !fullName) { toast.error('Veuillez remplir tous les champs'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone, role } }
    })
    if (error) { toast.error(error.message) }
    else {
      toast.success('Compte cree!')
      // Send WhatsApp welcome
      if (phone) {
        fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'welcome', phone, data: { userName: fullName } })
        }).catch(() => {})
      }
      router.push('/home')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 pt-14 pb-8 px-6">
        <div className="flex items-center gap-4 mb-5">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
              <ArrowLeft size={18} className="text-white" />
            </button>
          )}
          <div>
            <h1 className="text-white text-2xl font-black">Creer un compte</h1>
            <p className="text-white/50 text-xs">Etape {step} sur 2</p>
          </div>
        </div>
        <div className="flex gap-2">
          {[1,2].map(s => (
            <div key={s} className={cn('h-1 flex-1 rounded-full transition-all', s <= step ? 'bg-yellow-400' : 'bg-white/20')} />
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 mb-6">Vos informations</h2>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom complet" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telephone" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 pl-11 pr-11 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button onClick={() => { if (!fullName||!email||!password) { toast.error('Remplir tous les champs'); return } setStep(2) }}
              className="w-full bg-blue-900 text-white font-black py-3 px-6 rounded-2xl flex items-center justify-center gap-2 mt-4">
              Continuer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 mb-2">Votre profil</h2>
            <p className="text-slate-500 text-sm mb-6">Qui etes-vous sur ImmoPro ?</p>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className={cn('bg-white rounded-3xl p-4 text-left border-2 transition-all shadow-sm',
                    role === r.id ? 'border-blue-900 bg-blue-50' : 'border-slate-100')}>
                  <p className={cn('font-black text-sm', role === r.id ? 'text-blue-900' : 'text-slate-900')}>{r.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-blue-900 text-white font-black py-3 px-6 rounded-2xl flex items-center justify-center gap-2 mt-6">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Creer mon compte</span><ArrowRight size={18} /></>}
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Deja un compte?{" "}
            <Link href="/login" className="text-blue-900 font-black">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
