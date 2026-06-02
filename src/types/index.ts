export type UserRole = 'buyer' | 'tenant' | 'landlord' | 'agent' | 'agency' | 'manager' | 'admin'
export type PropertyType = 'apartment' | 'house' | 'land' | 'villa' | 'commercial' | 'office'
export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented'
export type ListingType = 'sale' | 'rent'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  bio: string | null
  is_verified: boolean
  verification_status: VerificationStatus
  preferred_language: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  owner_id: string
  agency_id: string | null
  agent_id: string | null
  title: string
  description: string | null
  property_type: PropertyType
  listing_type: ListingType
  status: PropertyStatus
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
  videos: string[]
  voice_description_url: string | null
  is_verified: boolean
  is_featured: boolean
  views_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Agency {
  id: string
  owner_id: string
  name: string
  logo_url: string | null
  description: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  country: string
  is_verified: boolean
  subscription_tier: string
  created_at: string
}

export interface VisitRequest {
  id: string
  property_id: string
  requester_id: string
  owner_id: string
  visit_date: string
  visit_time: string
  visitors_count: number
  notes: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'rescheduled' | 'completed'
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  property_id: string | null
  content: string | null
  image_url: string | null
  voice_note_url: string | null
  is_read: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  type: string | null
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}
