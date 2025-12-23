import { createClient } from '@supabase/supabase-js'

// These should be set as environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface WaitlistSubmission {
  name: string
  email: string
  source?: string
}

export async function submitToWaitlist(data: WaitlistSubmission) {
  const { data: result, error } = await supabase
    .from('waitlist_submissions')
    .insert([{ ...data, source: data.source || 'landing_page' }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return result
}

