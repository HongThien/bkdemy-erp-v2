import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
// 1) CHECK nguon hiện tại trên DB thật (migration 'et/mt' của phiên kia đã áp chưa?)
const { data: mig } = await supabase.from('_migrations').select('ten').ilike('ten', '%canh_bao_yeu_nguon%')
console.log('migration canh_bao_yeu_nguon đã áp:', JSON.stringify((mig ?? []).map((m: any) => m.ten)))
// 2) Nút 🚨 ở ET/DanhGia có "sống" không = buổi 30 ngày qua có dạng để bấm không?
const since = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10)
const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay').gte('ngay', since).eq('loai', 'thuong').limit(500)
const ids = (buois ?? []).map((b: any) => b.id)
let probs: any[] = []
for (let f = 0; f < ids.length; f += 100) { const { data } = await supabase.from('gami_session_problems').select('buoi_hoc_id, phase, ma_dang').in('buoi_hoc_id', ids.slice(f, f + 100)).in('phase', ['et', 'ingame', 'mt']); probs = probs.concat(data ?? []) }
for (const ph of ['et', 'ingame', 'mt']) {
  const co = new Set(probs.filter((p) => p.phase === ph).map((p) => p.buoi_hoc_id))
  const coDang = new Set(probs.filter((p) => p.phase === ph && p.ma_dang).map((p) => p.buoi_hoc_id))
  console.log(`${ph.padEnd(7)}: ${co.size} buổi có bài · ${coDang.size} buổi có ≥1 dạng gắn → nút 🚨 bấm được ở ${co.size ? (100 * coDang.size / co.size).toFixed(0) : 0}% buổi`)
}
