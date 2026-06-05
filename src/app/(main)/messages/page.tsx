'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { Search, Send, Phone, Shield, MapPin, Mic, Image as ImageIcon, ArrowLeft, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
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

const mockConversations = [
  { id: '1', name: 'Mamadou Ba', role: 'Proprietaire', avatar: 'M', verified: true, lastMessage: 'Bonjour, la villa est toujours disponible.', time: '10:30', unread: 2, property: 'Villa moderne 4ch, Ngor', online: true },
  { id: '2', name: 'Aminata Sow', role: 'Locataire', avatar: 'A', verified: false, lastMessage: 'Merci pour votre reponse.', time: 'Hier', unread: 0, property: 'Appartement 3p, Almadies', online: false },
  { id: '3', name: 'ImmoPro Support', role: 'Support', avatar: 'IP', verified: true, lastMessage: 'Bienvenue sur ImmoPro!', time: '2j', unread: 1, property: '', online: true },
  { id: '4', name: 'Cheikh Ndiaye', role: 'Agent', avatar: 'C', verified: true, lastMessage: 'Le terrain est disponible.', time: '3j', unread: 0, property: 'Terrain 600m2, Diamniadio', online: false },
]

const mockMessages: Record<string, {id:string,content:string,sent:boolean,time:string}[]> = {
  '1': [
    { id: '1', content: 'Bonjour, je suis interesse par votre villa a Ngor.', sent: false, time: '10:15' },
    { id: '2', content: 'Bonjour! Oui elle est toujours disponible. Quand visitez-vous?', sent: true, time: '10:18' },
    { id: '3', content: 'Je suis disponible samedi matin?', sent: false, time: '10:22' },
    { id: '4', content: 'Parfait! Samedi a 10h ca vous convient?', sent: true, time: '10:25' },
  ],
  '3': [
    { id: '1', content: 'Bienvenue sur ImmoPro! Comment pouvons-nous vous aider?', sent: true, time: '9:00' },
  ],
}

const autoReplies = [
  'Merci pour votre message, je vous recontacte bientot.',
  'Bien recu! Je vais verifier et vous revenir.',
  'D accord, je note votre demande.',
  'Parfait, nous allons organiser ca.',
]

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const [user, setUser] = useState<any>(null)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeChat])

  const activeConv = conversations.find(c => c.id === activeChat)
  const chatMessages = activeChat ? (messages[activeChat] || []) : []

  function sendMessage() {
    if (!message.trim() || !activeChat) return
    const newMsg = { id: Date.now().toString(), content: message.trim(), sent: false, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }))
    setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: message.trim(), time: 'Maintenant' } : c))
    setMessage('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply = { id: (Date.now() + 1).toString(), content: autoReplies[Math.floor(Math.random() * autoReplies.length)], sent: true, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), reply] }))
    }, 1500)
  }

  if (activeChat && activeConv) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 pt-12 pb-3 flex items-center gap-3">
          <button onClick={() => setActiveChat(null)} className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <ArrowLeft size={18} className="text-slate-700 dark:text-white" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 flex items-center justify-center">
              <span className="text-white font-black text-sm">{activeConv.avatar}</span>
            </div>
            {activeConv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-black text-slate-900 dark:text-white text-sm">{activeConv.name}</p>
              {activeConv.verified && <Shield size={12} className="text-blue-900 dark:text-yellow-400" />}
            </div>
            <p className="text-xs text-slate-400">{typing ? 'En train d ecrire...' : activeConv.online ? 'En ligne' : activeConv.role}</p>
          </div>
          <a href="tel:+221771234567" className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Phone size={16} className="text-slate-700 dark:text-white" />
          </a>
        </div>
        {activeConv.property && (
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700">
            <MapPin size={12} className="text-yellow-500" />
            <p className="text-xs text-slate-500 font-medium truncate">{activeConv.property}</p>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {chatMessages.map(msg => (
            <div key={msg.id} className={cn('flex', msg.sent ? 'justify-start' : 'justify-end')}>
              <div className={cn('max-w-xs px-4 py-2.5 rounded-2xl text-sm', msg.sent ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-sm' : 'bg-blue-900 text-white rounded-tr-sm')}>
                <p>{msg.content}</p>
                <p className={cn('text-xs mt-1', msg.sent ? 'text-slate-400' : 'text-white/60')}>{msg.time}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3 flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: i * 0.15 + 's' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <ImageIcon size={18} className="text-slate-500" />
            </button>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center px-4 py-2.5">
              <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Message..." className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none" />
              <Mic size={16} className="text-slate-400 ml-2" />
            </div>
            <button onClick={sendMessage} disabled={!message.trim()} className={cn('w-10 h-10 rounded-2xl flex items-center justify-center transition-all', message.trim() ? 'bg-blue-900 active:scale-95' : 'bg-slate-100 dark:bg-slate-700')}>
              <Send size={16} className={message.trim() ? 'text-white' : 'text-slate-400'} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Messages</h1>
            <p className="text-xs text-slate-400 mt-0.5">{user ? user.email : 'Non connecte'}</p>
          </div>
          <Link href="/notifications">
            <button className="relative w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Bell size={18} className="text-slate-700 dark:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-900 rounded-full" />
            </button>
          </Link>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Rechercher une conversation..." className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none text-slate-700 dark:text-white placeholder:text-slate-400" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {conversations.map(conv => (
          <button key={conv.id} onClick={() => setActiveChat(conv.id)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center">
                <span className="text-white font-black">{conv.avatar}</span>
              </div>
              {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <p className={cn('font-black text-sm', conv.unread > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300')}>{conv.name}</p>
                  {conv.verified && <Shield size={11} className="text-blue-900 dark:text-yellow-400" />}
                </div>
                <span className="text-xs text-slate-400">{conv.time}</span>
              </div>
              {conv.property && <p className="text-xs text-blue-900 dark:text-yellow-400 font-medium mb-0.5 truncate">{conv.property}</p>}
              <p className={cn('text-xs truncate', conv.unread > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400')}>{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center"><span className="text-white text-xs font-black">{conv.unread}</span></div>}
          </button>
        ))}
      </div>
      <div className="h-24" />
    </div>
  )
}
