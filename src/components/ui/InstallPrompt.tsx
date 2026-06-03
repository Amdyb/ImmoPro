'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)

    const dismissed = localStorage.getItem('immopro_install_dismissed')
    if (dismissed) return

    if (ios) {
      const isStandalone = (window.navigator as any).standalone
      if (!isStandalone) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
      return
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowPrompt(true), 3000)
    })
  }, [])

  function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setShowPrompt(false)
        setDeferredPrompt(null)
      })
    }
  }

  function handleDismiss() {
    setShowPrompt(false)
    localStorage.setItem('immopro_install_dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center flex-shrink-0">
          <img src="/logo.png" alt="ImmoPro" className="w-10 h-10 rounded-xl object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-black text-slate-900 dark:text-white text-sm">Installer ImmoPro</p>
          {isIOS ? (
            <p className="text-slate-500 text-xs mt-0.5">
              Appuyez sur <strong>Partager</strong> puis <strong>Sur l ecran d accueil</strong>
            </p>
          ) : (
            <p className="text-slate-500 text-xs mt-0.5">
              Installez l app pour un acces rapide
            </p>
          )}
        </div>
        <button onClick={handleDismiss} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
          <X size={14} className="text-slate-500" />
        </button>
      </div>
      {!isIOS && (
        <button onClick={handleInstall}
          className="w-full mt-3 bg-blue-900 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 text-sm active:scale-95 transition-transform">
          <Download size={16} /> Installer maintenant
        </button>
      )}
    </div>
  )
}
