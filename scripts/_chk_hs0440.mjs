import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })

const { data: hs, error: e1 } = await admin.from('hoc_sinh').select('*').eq('ma_hs', 'HS0440').maybeSingle()
console.log('hoc_sinh:', JSON.stringify(hs, null, 2), e1?.message)

if (hs) {
  const { data: tk, error: e2 } = await admin.from('tai_khoan').select('*').eq('hoc_sinh_id', hs.id).maybeSingle()
  console.log('tai_khoan:', JSON.stringify(tk, null, 2), e2?.message)

  if (tk?.email) {
    const { data: users, error: e3 } = await admin.auth.admin.listUsers()
    const u = users?.users?.find(x => x.email === tk.email)
    console.log('auth.users match:', u ? { id: u.id, email: u.email, email_confirmed_at: u.email_confirmed_at, banned_until: u.banned_until, last_sign_in_at: u.last_sign_in_at, created_at: u.created_at } : 'KHÔNG TÌM THẤY', e3?.message)
  }
}
