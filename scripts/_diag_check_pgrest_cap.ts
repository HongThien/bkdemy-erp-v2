import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

for (const lim of [500, 1000, 1500, 5000, 10000]) {
  const { data, count } = await supabase.from('gami_grades').select('id', { count: 'exact' }).limit(lim)
  console.log(`limit(${lim}) -> returned ${data?.length} rows (total table count via head: ${count})`)
}
