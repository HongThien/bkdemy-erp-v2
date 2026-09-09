// Có HS nào ĐÃ vượt 1000 dòng gami_grades chưa? (getDanhGiaCase / getLichSuChuyenDe đọc per-HS)
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('trang_thai', 'dang_hoc').limit(500)
const seen = new Set<string>(); const res: { ten: string; lop: string; n: number }[] = []
for (const l of (lops ?? []) as any[]) {
  const { data: roster } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(ho_ten)').eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  for (const r of (roster ?? []) as any[]) {
    if (seen.has(r.hoc_sinh_id)) continue; seen.add(r.hoc_sinh_id)
    const { count } = await supabase.from('gami_grades').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', r.hoc_sinh_id)
    res.push({ ten: r.hoc_sinh?.ho_ten, lop: l.ten_lop, n: count ?? 0 })
  }
}
res.sort((a, b) => b.n - a.n)
console.log(`HS đang học: ${res.length} · vượt 1000: ${res.filter((r) => r.n > 1000).length} · vượt 800: ${res.filter((r) => r.n > 800).length} · max: ${res[0]?.n}`)
console.log('Top 10:'); for (const r of res.slice(0, 10)) console.log(`  ${String(r.n).padStart(5)}  ${r.ten} (${r.lop})`)
