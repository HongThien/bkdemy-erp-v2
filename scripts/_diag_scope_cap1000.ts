// PHẠM VI bug cap-1000: mỗi lớp dang_hoc (mọi môn) — roster có bao nhiêu dòng gami_grades tổng?
// Lớp >1000 = từng bị napLanDo cắt cụt im lặng trước fix. Dùng count exact (head) — không bị cap.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const { data: lops } = await supabase.from('lop').select('id, ten_lop, mon').eq('trang_thai', 'dang_hoc').limit(500)
const out: { ten: string; mon: string; hs: number; rows: number }[] = []
for (const l of (lops ?? []) as any[]) {
  const { data: roster } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id').eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  const hsIds = (roster ?? []).map((r: any) => r.hoc_sinh_id)
  if (!hsIds.length) continue
  const { count } = await supabase.from('gami_grades').select('id', { count: 'exact', head: true }).in('hoc_sinh_id', hsIds)
  out.push({ ten: l.ten_lop, mon: l.mon, hs: hsIds.length, rows: count ?? 0 })
}
out.sort((a, b) => b.rows - a.rows)
const over = out.filter((o) => o.rows > 1000)
console.log(`Lớp dang_hoc có roster: ${out.length} · VƯỢT 1000 dòng (bị cắt trước fix): ${over.length} = ${(100 * over.length / out.length).toFixed(0)}%`)
console.log(`Theo môn (vượt/tổng): ` + ['Toán', 'KHTN', 'Tiếng Anh', 'Văn'].map((m) => `${m} ${over.filter((o) => o.mon === m).length}/${out.filter((o) => o.mon === m).length}`).join(' · '))
console.log('\nTop 15 lớp nhiều dòng nhất:')
for (const o of out.slice(0, 15)) console.log(`  ${o.ten.padEnd(6)} ${o.mon.padEnd(9)} ${String(o.hs).padStart(2)} HS  ${String(o.rows).padStart(6)} dòng${o.rows > 1000 ? '  ← bị cắt (chỉ thấy 1000)' : ''}`)
console.log('\nLớp DƯỚI 1000 (không ảnh hưởng):', out.filter((o) => o.rows <= 1000).map((o) => `${o.ten}(${o.rows})`).join(', ') || '—')
