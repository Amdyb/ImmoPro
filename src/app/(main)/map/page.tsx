'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, Layers, Locate, X, Shield, ChevronRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'

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

const properties = [
  { id: '1', title: 'Appartement 3 pieces', location: 'Almadies', price: 250000, type: 'rent', verified: true, lat: 14.7298, lng: -17.5130, gradient: 'from-blue-400 to-blue-600' },
  { id: '2', title: 'Villa moderne 4 ch.', location: 'Ngor', price: 85000000, type: 'sale', verified: true, lat: 14.7469, lng: -17.5139, gradient: 'from-emerald-400 to-teal-600' },
  { id: '3', title: 'Terrain 600 m2', location: 'Diamniadio', price: 15000000, type: 'sale', verified: false, lat: 14.7245, lng: -17.4823, gradient: 'from-amber-400 to-orange-500' },
  { id: '4', title: 'Studio meuble', location: 'Point E', price: 150000, type: 'rent', verified: true, lat: 14.6892, lng: -17.4618, gradient: 'from-purple-400 to-purple-600' },
  { id: '5', title: 'Duplex 5 chambres', location: 'Mermoz', price: 75000000, type: 'sale', verified: true, lat: 14.7167, lng: -17.4833, gradient: 'from-indigo-400 to-indigo-600' },
  { id: '6', title: 'Villa avec piscine', location: 'Yoff', price: 120000000, type: 'sale', verified: true, lat: 14.7500, lng: -17.4833, gradient: 'from-teal-400 to-teal-600' },
]

function formatShortPrice(price: number, type: string) {
  if (price >= 1000000) return (price / 1000000).toFixed(0) + 'M'
  if (price >= 1000) return (price / 1000).toFixed(0) + 'K'
  return price.toString() + (type === 'rent' ? '/m' : '')
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Tous')
  const filters = ['Tous', 'Vente', 'Location']

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places'
    script.async = true
    script.onload = () => {
      if (!mapRef.current) return
      const google = (window as any).google
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 14.7167, lng: -17.4677 },
        zoom: 12,
        disableDefaultUI: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f7fa' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfdbfe' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        ],
      })
      mapInstanceRef.current = map
      properties.forEach(p => {
        const priceLabel = formatShortPrice(p.price, p.type)
        const color = p.type === 'rent' ? '#10b981' : '#0B3D91'
        const markerDiv = document.createElement('div')
        markerDiv.innerHTML = '<div style="background:' + color + ';color:white;padding:6px 10px;border-radius:20px;font-size:11px;font-weight:900;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:2px solid white;cursor:pointer;">' + priceLabel + '</div>'
        const overlay = new google.maps.OverlayView()
        overlay.onAdd = function() { this.getPanes().overlayMouseTarget.appendChild(markerDiv) }
        overlay.draw = function() {
          const projection = this.getProjection()
          const pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(p.lat, p.lng))
          if (pos) {
            markerDiv.style.position = 'absolute'
            markerDiv.style.left = (pos.x - 30) + 'px'
            markerDiv.style.top = (pos.y - 15) + 'px'
          }
        }
        overlay.setMap(map)
        markerDiv.addEventListener('click', () => { playTap(); setSelectedProperty(p); map.panTo({ lat: p.lat, lng: p.lng }) })
      })
      setMapLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-3 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Rechercher dans cette zone..."
              className="w-full bg-white/95 backdrop-blur-xl rounded-2xl pl-10 pr-12 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none shadow-lg" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-900 rounded-xl flex items-center justify-center">
              <SlidersHorizontal size={14} className="text-white" />
            </button>
          </div>
          <div className="flex gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => { playTap(); setActiveFilter(f) }}
                className={cn('px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all',
                  activeFilter === f ? 'bg-blue-900 text-white' : 'bg-white/95 text-slate-600')}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={mapRef} className="flex-1 w-full" />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button onClick={playTap} className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur shadow-lg flex items-center justify-center">
          <Layers size={18} className="text-slate-700" />
        </button>
        <button onClick={playTap} className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur shadow-lg flex items-center justify-center">
          <Locate size={18} className="text-slate-700" />
        </button>
      </div>

      <div className="absolute left-4 bottom-28 z-20">
        <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg">
          <p className="text-xs font-black text-slate-700">{properties.length} biens</p>
        </div>
      </div>

      {selectedProperty && (
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <div className="flex">
              <div className={cn('w-24 flex-shrink-0 bg-gradient-to-br', selectedProperty.gradient)} />
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-sm leading-tight">{selectedProperty.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{selectedProperty.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-900 font-black text-sm">
                        {formatPrice(selectedProperty.price)}{selectedProperty.type === 'rent' ? '/mois' : ''}
                      </span>
                      {selectedProperty.verified && (
                        <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-bold">
                          <Shield size={10} /> Verifie
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => { playTap(); setSelectedProperty(null) }}
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                      <X size={14} className="text-slate-500" />
                    </button>
                    <Link href={'/property/' + selectedProperty.id} onClick={playTap}>
                      <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center">
                        <ChevronRight size={14} className="text-white" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  )
}
