import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const hs = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
await hs.auth.signInWithPassword({ email: 'hs0004@hs.bkdemy.local', password: 'HS0004' })
const { data: myId } = await hs.rpc('my_hoc_sinh_id')
const { data, error } = await hs.from('hoc_sinh').select('id, ma_hs, khoi').eq('id', myId)
console.log('HS0004 tự đọc hoc_sinh của mình:', JSON.stringify(data), error?.message)
await hs.auth.signOut()
