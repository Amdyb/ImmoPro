'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) { toast.error('Veuillez remplir tous les champs'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error('Email ou mot de passe incorrect') }
    else { toast.success('Connexion reussie'); router.push('/home') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-blue-900 flex flex-col items-center justify-center pt-20 pb-12 px-6">
        <h1 className="text-white text-3xl font-black">ImmoPro</h1>
        <p className="text-white/50 text-sm mt-1">Trouvez. Faites confiance. Habitez.</p>
      </div>
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-10">
        <h2 className="text-2xl font-black text-slate-900 mb-1">Connexion</h2>
        <p className="text-slate-500 text-sm mb-8">Acces a votre compte ImmoPro</p>
        <div className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 pl-11 pr-11 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400" />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-blue-900 text-white font-black py-3 px-6 rounded-2xl flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Se connecter</span><ArrowRight size={18} /></>}
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Pas encore de compte?{" "}
            <Link href="/register" className="text-blue-900 font-black">S inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
