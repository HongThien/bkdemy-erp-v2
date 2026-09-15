// Data-quality: trong các buổi MT chấm 7 ngày qua, bao nhiêu câu MT KHÔNG có ma_dang?
// Câu không dạng = engine (HS×dạng) không thấy, đồng thời làm lệch TB lớp của kênh 4 (ca 8A1).
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const since = new Date(Date.now() - 7 * 86400_000).toISOString()
let all: any[] = []
for (let f = 0; ; f += 1000) { const { data } = await supabase.from('gami_grades').select('buoi_hoc_id, problem_id, prob:problem_id(phase, ma_dang)').gte('graded_at', since).range(f, f + 999); all = all.concat(data ?? []); if ((data ?? []).length < 1000) break }
const mt = all.filter((r) => r.prob?.phase === 'mt')
const perBuoi = new Map<string, { probs: Map<string, boolean> }>()
for (const r of mt) { let b = perBuoi.get(r.buoi_hoc_id); if (!b) { b = { probs: new Map() }; perBuoi.set(r.buoi_hoc_id, b) } b.probs.set(r.problem_id, !!r.prob?.ma_dang) }
const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay, lop:lop_id(ten_lop, mon)').in('id', [...perBuoi.keys()])
const rows = (buois ?? []).map((b: any) => { const p = perBuoi.get(b.id)!; const tong = p.probs.size, coDang = [...p.probs.values()].filter(Boolean).length; return { ngay: b.ngay, lop: b.lop?.ten_lop, mon: b.lop?.mon, tong, thieu: tong - coDang } }).sort((a, b) => b.thieu - a.thieu || a.ngay.localeCompare(b.ngay))
const tongCau = rows.reduce((s, r) => s + r.tong, 0), tongThieu = rows.reduce((s, r) => s + r.thieu, 0)
console.log(`MT 7 ngày qua: ${rows.length} buổi · ${tongCau} câu · ${tongThieu} câu KHÔNG có ma_dang (${(100 * tongThieu / tongCau).toFixed(0)}%) · ${rows.filter((r) => r.thieu > 0).length} buổi bị dính`)
for (const r of rows) console.log(`  ${r.ngay} ${String(r.lop).padEnd(5)} ${String(r.mon).padEnd(9)} ${String(r.tong).padStart(3)} câu · thiếu dạng ${String(r.thieu).padStart(3)}${r.thieu > 0 ? '  ← engine mù ' + (100 * r.thieu / r.tong).toFixed(0) + '% đề' : ''}`)
