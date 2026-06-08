'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Users, Home, Shield, AlertTriangle, BarChart3, CheckCircle, XCircle, Eye, Trash2, Star, Bell, Settings, LogOut, Search } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

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
  { id: 'overview', label: 'Vue globale', icon: BarChart3 },
  { id: 'properties', label: 'Biens', icon: Home },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'disputes', label: 'Litiges', icon: AlertTriangle },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [properties, setProperties] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, featured: 0, verified: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    setLoading(true)
    if (activeTab === 'overview' || activeTab === 'properties') {
      const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
      setProperties(data || [])
      setStats({
        total: data?.length || 0,
        featured: data?.filter(p => p.is_featured).length || 0,
        verified: data?.filter(p => p.is_verified).length || 0,
        pending: data?.filter(p => !p.is_verified).length || 0,
      })
    }
    if (activeTab === 'users') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
    }
    setLoading(false)
  }

  async function toggleVerify(id: string, current: boolean) {
    playTap()
    await supabase.from('properties').update({ is_verified: !current }).eq('id', id)
    fetchData()
  }

  async function toggleFeatured(id: string, current: boolean) {
    playTap()
    await supabase.from('properties').update({ is_featured: !current }).eq('id', id)
    fetchData()
  }

  async function deleteProperty(id: string) {
    if (!confirm('Supprimer cette annonce?')) return
    playTap()
    await supabase.from('properties').delete().eq('id', id)
    fetchData()
  }

  const filteredProperties = properties.filter(p =>
    search === '' ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center">
            <Shield size={16} className="text-blue-900" />
          </div>
          <div>
            <h1 className="font-black text-white">ImmoPro Admin</h1>
            <p className="text-slate-400 text-xs">Panneau d administration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={playTap} className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center">
            <Bell size={16} className="text-slate-300" />
          </button>
          <button onClick={playTap} className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center">
            <Settings size={16} className="text-slate-300" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center">
            <span className="text-blue-900 font-black text-sm">A</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 bg-slate-800 min-h-screen border-r border-slate-700 pt-4 hidden md:block">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { playTap(); setActiveTab(id) }}
              className={cn('w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all',
                activeTab === id ? 'bg-blue-900/40 text-yellow-400 border-r-2 border-yellow-400' : 'text-slate-400 hover:text-white hover:bg-slate-700')}>
              <Icon size={16} />
              {label}
            </button>
          ))}
          <div className="mt-auto pt-8 px-4">
            <a href="/home">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white">
                <LogOut size={16} /> Retour au site
              </button>
            </a>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { playTap(); setActiveTab(id) }}
              className={cn('flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all',
                activeTab === id ? 'text-yellow-400' : 'text-slate-500')}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 pb-24 md:pb-6">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white">Vue globale</h2>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total biens', value: stats.total, icon: Home, color: 'bg-blue-900' },
                  { label: 'En vedette', value: stats.featured, icon: Star, color: 'bg-yellow-600' },
                  { label: 'Verifies', value: stats.verified, icon: CheckCircle, color: 'bg-emerald-700' },
                  { label: 'En attente', value: stats.pending, icon: AlertTriangle, color: 'bg-rose-700' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-slate-400 text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent properties */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700">
                <div className="px-4 py-3 border-b border-slate-700">
                  <h3 className="font-black text-white">Annonces recentes</h3>
                </div>
                <div className="divide-y divide-slate-700">
                  {properties.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">{p.title}</p>
                        <p className="text-slate-400 text-xs">{p.city} · {formatPrice(p.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.is_verified
                          ? <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-lg font-bold">Verifie</span>
                          : <span className="text-xs bg-amber-900 text-amber-400 px-2 py-0.5 rounded-lg font-bold">En attente</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Properties */}
          {activeTab === 'properties' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Gestion des biens</h2>
                <span className="text-slate-400 text-sm">{filteredProperties.length} biens</span>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un bien..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-900" />
              </div>

              <div className="space-y-3">
                {filteredProperties.map(p => (
                  <div key={p.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <p className="font-black text-white">{p.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{p.city}, {p.country} · {formatPrice(p.price)} · {p.views_count} vues</p>
                      </div>
                      <div className="flex gap-1">
                        {p.is_featured && <span className="text-xs bg-yellow-900 text-yellow-400 px-2 py-0.5 rounded-lg font-bold">Vedette</span>}
                        {p.is_verified
                          ? <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-lg font-bold">Verifie</span>
                          : <span className="text-xs bg-amber-900 text-amber-400 px-2 py-0.5 rounded-lg font-bold">En attente</span>
                        }
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={'/property/' + p.id} target="_blank" rel="noopener noreferrer">
                        <button onClick={playTap} className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition-all">
                          <Eye size={13} /> Voir
                        </button>
                      </a>
                      <a href={'/edit-property/' + p.id}>
                        <button onClick={playTap} className="flex items-center gap-1.5 bg-blue-900/50 text-blue-400 hover:bg-blue-900 text-xs font-bold px-3 py-2 rounded-xl transition-all">
                          <Eye size={13} /> Editer
                        </button>
                      </a>
                      <button onClick={() => toggleVerify(p.id, p.is_verified)}
                        className={cn('flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all',
                          p.is_verified ? 'bg-rose-900/50 text-rose-400 hover:bg-rose-900' : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900')}>
                        {p.is_verified ? <><XCircle size={13} /> Deverifier</> : <><CheckCircle size={13} /> Verifier</>}
                      </button>
                      <button onClick={() => toggleFeatured(p.id, p.is_featured)}
                        className={cn('flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all',
                          p.is_featured ? 'bg-slate-700 text-slate-400' : 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-900')}>
                        <Star size={13} /> {p.is_featured ? 'Retirer' : 'Vedette'}
                      </button>
                      <button onClick={() => deleteProperty(p.id)}
                        className="flex items-center gap-1.5 bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 text-xs font-bold px-3 py-2 rounded-xl transition-all ml-auto">
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Utilisateurs</h2>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Chargement...</div>
              ) : users.length === 0 ? (
                <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                  <Users size={40} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold">Aucun utilisateur enregistre</p>
                  <p className="text-slate-500 text-sm mt-1">Les utilisateurs apparaitront ici apres inscription</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map(u => (
                    <div key={u.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-black">{(u.full_name || 'U')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white">{u.full_name || 'Utilisateur'}</p>
                        <p className="text-slate-400 text-xs">{u.role} · {new Date(u.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.is_verified && <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-lg font-bold">Verifie</span>}
                        <span className={cn('text-xs px-2 py-0.5 rounded-lg font-bold',
                          u.role === 'admin' ? 'bg-yellow-900 text-yellow-400' :
                          u.role === 'agent' ? 'bg-blue-900 text-blue-400' :
                          'bg-slate-700 text-slate-400')}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disputes */}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Centre de litiges</h2>
              <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                <AlertTriangle size={40} className="text-yellow-400 mx-auto mb-3" />
                <p className="text-white font-black text-lg">Aucun litige actif</p>
                <p className="text-slate-400 text-sm mt-1">Les litiges soumis par les utilisateurs apparaitront ici</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
