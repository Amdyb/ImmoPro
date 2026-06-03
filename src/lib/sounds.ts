'use client'

type SoundType = 'tap' | 'save' | 'success' | 'message' | 'notification' | 'error' | 'whoosh'

const soundEnabled = () => {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('immopro_sounds') !== 'false'
}

export function playSound(type: SoundType) {
  if (!soundEnabled()) return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)

    switch(type) {
      case 'tap':
        o.frequency.setValueAtTime(700, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08)
        g.gain.setValueAtTime(0.05, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.12)
        break

      case 'save':
        o.type = 'sine'
        o.frequency.setValueAtTime(440, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15)
        g.gain.setValueAtTime(0.06, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2)
        break

      case 'success':
        o.type = 'sine'
        const notes = [523, 659, 784]
        notes.forEach((freq, i) => {
          const ctx2 = new AudioCtx()
          const o2 = ctx2.createOscillator()
          const g2 = ctx2.createGain()
          o2.type = 'sine'
          o2.connect(g2); g2.connect(ctx2.destination)
          o2.frequency.value = freq
          g2.gain.setValueAtTime(0.06, ctx2.currentTime + i * 0.12)
          g2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + i * 0.12 + 0.2)
          o2.start(ctx2.currentTime + i * 0.12)
          o2.stop(ctx2.currentTime + i * 0.12 + 0.2)
        })
        return

      case 'message':
        o.type = 'sine'
        o.frequency.setValueAtTime(600, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08)
        g.gain.setValueAtTime(0.04, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15)
        break

      case 'notification':
        o.type = 'sine'
        o.frequency.setValueAtTime(880, ctx.currentTime)
        o.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
        g.gain.setValueAtTime(0.05, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.25)
        break

      case 'error':
        o.type = 'sawtooth'
        o.frequency.setValueAtTime(200, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)
        g.gain.setValueAtTime(0.04, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2)
        break

      case 'whoosh':
        o.type = 'sine'
        o.frequency.setValueAtTime(200, ctx.currentTime)
        o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
        g.gain.setValueAtTime(0.03, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15)
        break
    }
  } catch(e) {}
}

export function toggleSounds(enabled: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('immopro_sounds', enabled ? 'true' : 'false')
  }
}

export function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('immopro_sounds') !== 'false'
}
