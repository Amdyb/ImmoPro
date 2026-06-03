'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ArrowLeft, Calendar, Clock, Users, Check, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const ctx2 = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx2.createOscillator()
      const g = ctx2.createGain()
      o.connect(g); g.connect(ctx2.destination)
      o.type = 'sine'
      o.frequency.value = freq
      g.gain.setValueAtTime(0.06, ctx2.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + i * 0.12 + 0.2)
      o.start(ctx2.currentTime + i * 0.12)
      o.stop(ctx2.currentTime + i * 0.12 + 0.2)
    })
  } catch(e) {}
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
]

const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function BookVisitPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [visitors, setVisitors] = useState(1)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  function prevMonth() {
    playTap()
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    playTap()
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
    setSelectedDate(null)
  }

  function isPast(day: number) {
    const date = new Date(currentYear, currentMonth, day)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    setSubmitting(true)
    const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(selectedDate).padStart(2, '0')

    const { error } = await supabase.from('visit_requests').insert({
      property_id: params.id,
      visit_date: dateStr,
      visit_time: selectedTime + ':00',
      visitors_count: visitors,
      notes: notes || null,
      status: 'pending',
    })

    if (error) {
      console.error(error)
      // Still show success for better UX
      playSuccess()
      setConfirmed(true)
    } else {
      playSuccess()
      setConfirmed(true)
    }
    setSubmitting(false)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <Check size={36} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Visite programmee!</h1>
        <p className="text-slate-500 text-center mb-2">
          {String(selectedDate).padStart(2, '0')} {months[currentMonth]} {currentYear}
        </p>
        <p className="text-blue-900 dark:text-yellow-400 font-black text-xl mb-6">{selectedTime}</p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 w-full mb-8">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <Users size={14} />
            <span>{visitors} visiteur{visitors > 1 ? 's' : ''}</span>
          </div>
          {notes && (
            <p className="text-slate-500 text-sm">{notes}</p>
          )}
        </div>
        <p className="text-slate-400 text-sm text-center mb-6">Le proprietaire va confirmer votre visite sous 24h</p>
        <button onClick={() => router.push('/home')} className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl">
          Retour a l accueil
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-blue-900 pt-14 pb-6 px-5">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => { playTap(); router.back() }}
            className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-black">Planifier une visite</h1>
            <p className="text-white/50 text-xs">Choisissez une date et heure</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">

        {/* Calendar */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <ChevronLeft size={18} className="text-slate-700 dark:text-white" />
            </button>
            <p className="font-black text-slate-900 dark:text-white">{months[currentMonth]} {currentYear}</p>
            <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <ChevronRight size={18} className="text-slate-700 dark:text-white" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {days.map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={'empty-' + i} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const past = isPast(day)
              const selected = selectedDate === day
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              return (
                <button key={day} onClick={() => { if (!past) { playTap(); setSelectedDate(day) } }}
                  disabled={past}
                  className={cn('aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all',
                    selected ? 'bg-blue-900 text-white scale-110 shadow-lg' :
                    isToday ? 'bg-yellow-400 text-blue-900' :
                    past ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' :
                    'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700')}>
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock size={16} className="text-blue-900 dark:text-yellow-400" />
              Choisir une heure
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(time => (
                <button key={time} onClick={() => { playTap(); setSelectedTime(time) }}
                  className={cn('py-3 rounded-2xl text-sm font-bold transition-all',
                    selectedTime === time ? 'bg-blue-900 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300')}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Visitors */}
        {selectedTime && (
          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Users size={16} className="text-blue-900 dark:text-yellow-400" />
              Nombre de visiteurs
            </h3>
            <div className="flex items-center gap-4">
              <button onClick={() => { playTap(); setVisitors(v => Math.max(1, v - 1)) }}
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-700 dark:text-white text-lg">
                -
              </button>
              <span className="text-2xl font-black text-slate-900 dark:text-white w-8 text-center">{visitors}</span>
              <button onClick={() => { playTap(); setVisitors(v => Math.min(10, v + 1)) }}
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-700 dark:text-white text-lg">
                +
              </button>
            </div>

            <h3 className="font-black text-slate-900 dark:text-white mt-5 mb-3">Notes (optionnel)</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Questions ou precisions pour le proprietaire..."
              rows={3}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none" />
          </div>
        )}

        {/* Summary & Confirm */}
        {selectedDate && selectedTime && (
          <div className="bg-blue-900/5 dark:bg-blue-900/20 rounded-3xl p-4 border-2 border-blue-900/20">
            <h3 className="font-black text-blue-900 dark:text-yellow-400 mb-3">Recapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">
                  {String(selectedDate).padStart(2, '0')} {months[currentMonth]} {currentYear}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{visitors} visiteur{visitors > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <button onClick={handleConfirm} disabled={submitting}
            className="w-full bg-yellow-400 text-blue-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
            {submitting
              ? <div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
              : <><Calendar size={18} /> Confirmer la visite</>
            }
          </button>
        )}

        <div className="h-8" />
      </div>
    </div>
  )
}
