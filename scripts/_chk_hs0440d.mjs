import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const hs = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
const { data, error } = await hs.auth.signInWithPassword({ email: 'hs0440@hs.bkdemy.local', password: 'HS0440' })
console.log('login với PIN mặc định "HS0440":', error ? `LỖI: ${error.message}` : `THÀNH CÔNG (uid ${data.user.id})`)
if (data?.session) await hs.auth.signOut()
