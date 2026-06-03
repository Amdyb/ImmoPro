import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Property {
  id: string
  title: string
  description: string | null
  property_type: string
  listing_type: string
  status: string
  price: number
  negotiable: boolean
  bedrooms: number | null
  bathrooms: number | null
  surface_area: number | null
  address: string | null
  city: string | null
  country: string
  latitude: number | null
  longitude: number | null
  amenities: string[]
  photos: string[]
  is_verified: boolean
  is_featured: boolean
  views_count: number
  created_at: string
}

export function useProperties(filters?: {
  listing_type?: string
  property_type?: string
  city?: string
  is_featured?: boolean
}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (filters?.listing_type) query = query.eq('listing_type', filters.listing_type)
      if (filters?.property_type) query = query.eq('property_type', filters.property_type)
      if (filters?.city) query = query.ilike('city', '%' + filters.city + '%')
      if (filters?.is_featured) query = query.eq('is_featured', true)

      const { data, error } = await query
      if (error) setError(error.message)
      else setProperties(data || [])
      setLoading(false)
    }
    fetchProperties()
  }, [JSON.stringify(filters)])

  return { properties, loading, error }
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperty() {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      setProperty(data)
      setLoading(false)
    }
    if (id) fetchProperty()
  }, [id])

  return { property, loading }
}
