'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Search, Send, Phone, MoreVertical, Image as ImageIcon, Mic, MapPin, Shield } from 'lucide-react'
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

function playMessageSent() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(600, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08)
    g.gain.setValueAtTime(0.04, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15)
  } catch(e) {}
}

const mockConversations = [
  {
    id: '1', name: 'Mamadou Ba', role: 'Proprietaire', avatar: 'M', verified: true,
    lastMessage: 'Bonjour, la villa est toujours disponible.', time: '10:30', unread: 2,
    property: 'Villa moderne 4ch, Ngor',
    online: true,
  },
  {
    id: '2', name: 'Aminata Sow', role: 'Locataire', avatar: 'A', verified: false,
    lastMessage: 'Merci pour votre reponse, je suis interesse.', time: 'Hier', unread: 0,
    property: 'Appartement 3p, Almadies',
    online: false,
  },
  {
    id: '3', name: 'ImmoPro Support', role: 'Support', avatar: 'IP', verified: true,
    lastMessage: 'Bienvenue sur ImmoPro! Comment pouvons-nous vous aider?', time: '2j', unread: 1,
    property: '',
    online: true,
  },
  {
    id: '4', name: 'Cheikh Ndiaye', role: 'Agent', avatar: 'C', verified: true,
    lastMessage: 'Le terrain de Diamniadio est disponible pour visite.', time: '3j', unread: 0,
    property: 'Terrain 600m2, Diamniadio',
    online: false,
  },
]

const mockMessages: Record<string, any[]> = {
  '1': [
    { id: '1', content: 'Bonjour, je suis interesse par votre villa a Ngor.', sent: false, time: '10:15' },
    { id: '2', content: 'Bonjour! Oui elle est toujours disponible. Quand souhaitez-vous visiter?', sent: true, time: '10:18' },
    { id: '3', content: 'Je suis disponible ce weekend. Est-ce possible samedi matin?', sent: false, time: '10:22' },
    { id: '4', content: 'Parfait! Samedi a 10h ca vous convient?', sent: true, time: '10:25' },
    { id: '5', content: 'Bonjour, la villa est toujours disponible.', sent: true, time: '10:30' },
  ],
  '3': [
    { id: '1', content: 'Bienvenue sur ImmoPro! Comment pouvons-nous vous aider?', sent: true, time: '9:00' },
  ],
}

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === activeChat)
  const chatMessages = activeChat ? (messages[activeChat] || []) : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function sendMessage() {
    if (!message.trim() || !activeChat) return
    playMessageSent()
    const newMsg = { id: Date.now().toString(), content: message.trim(), sent: false, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }))
    setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: message.trim(), time: 'Maintenant', unread: 0 } : c))
    setMessage('')
  }

  if (activeChat && activeConv) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 pt-12 pb-3 flex items-center gap-3">
          <button onClick={() => { playTap(); setActiveChat(null) }}
            className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <ArrowLeft size={18} className="text-slate-700 dark:text-white" />
          </button>
          <div className="relative flex-shrink-0">
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
            <p className="text-xs text-slate-400">{activeConv.online ? 'En ligne' : activeConv.role}</p>
          </div>
          <a href="tel:+221771234567" onClick={playTap}
            className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Phone size={16} className="text-slate-700 dark:text-white" />
          </a>
          <button onClick={playTap} className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <MoreVertical size={16} className="text-slate-700 dark:text-white" />
          </button>
        </div>

        {/* Property context */}
        {activeConv.property && (
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700">
            <MapPin size={12} className="text-yellow-500 flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeConv.property}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.sent ? 'justify-start' : 'justify-end')}>
              <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm',
                msg.sent
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-sm'
                  : 'bg-blue-900 text-white rounded-tr-sm')}>
                <p className="leading-relaxed">{msg.content}</p>
                <p className={cn('text-xs mt-1', msg.sent ? 'text-slate-400' : 'text-white/60')}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3 pb-safe">
          <div className="flex items-center gap-2">
            <button onClick={playTap} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <ImageIcon size={18} className="text-slate-500" />
            </button>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center px-4 py-2.5">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Message..."
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button onClick={playTap} className="ml-2 flex-shrink-0">
                <Mic size={16} className="text-slate-400" />
              </button>
            </div>
            <button onClick={sendMessage} disabled={!message.trim()}
              className={cn('w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all',
                message.trim() ? 'bg-blue-900 active:scale-95' : 'bg-slate-100 dark:bg-slate-700')}>
              <Send size={16} className={message.trim() ? 'text-white' : 'text-slate-400'} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Messages</h1>
          <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center">
            <span className="text-white text-xs font-black">{conversations.reduce((a, c) => a + c.unread, 0)}</span>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Rechercher une conversation..." className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none text-slate-700 dark:text-white placeholder:text-slate-400" />
        </div>
      </div>

      {/* Conversations */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {conversations.map(conv => (
          <button key={conv.id} onClick={() => { playTap(); setActiveChat(conv.id) }}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:bg-slate-100">
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
                  {conv.verified && <Shield size={11} className="text-blue-900 dark:text-yellow-400 flex-shrink-0" />}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{conv.time}</span>
              </div>
              {conv.property && (
                <p className="text-xs text-blue-900 dark:text-yellow-400 font-medium mb-0.5 truncate">{conv.property}</p>
              )}
              <p className={cn('text-xs truncate', conv.unread > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400')}>{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-black">{conv.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="h-24" />
    </div>
  )
}
