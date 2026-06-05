import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

export const hasEnv = Boolean(url && key)

// Kho v2 nằm ở schema public của project mới → không cần .schema()
export const supabase = createClient(url ?? '', key ?? '')
