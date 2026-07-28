// Quét candidate 4 kênh trên NHIỀU lớp thật — kiểm cỡ danh sách + đọc thử lý do.
// Chạy: npx vite-node scripts/_diag_danhgia_candidate.ts
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(100)
let tongHS = 0, tongCand = 0
const demKenh: Record<string, number> = {}
const all: any[] = []
const t0 = Date.now()
for (const l of (lops ?? []).slice(0, 12) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  const cands = await listCandidatesLop(l.id)
  tongHS += count; tongCand += cands.length
  for (const c of cands) { for (const k of c.kenh) demKenh[k] = (demKenh[k] ?? 0) + 1; all.push({ ...c, lop: l.ten_lop }) }
}
console.log(`\n=== 12 lớp Toán · ${tongHS} HS · ${Date.now() - t0}ms ===`)
const dg = all.filter((c) => c.trongDigest).length
console.log(`Quét thô : ${tongCand}/${tongHS} = ${(100*tongCand/tongHS).toFixed(1)}% roster`)
console.log(`DIGEST tuần (trongDigest): ${dg}/${tongHS} = ${(100*dg/tongHS).toFixed(1)}%  (mục tiêu spec §8: 10-15%)`)
console.log('Theo kênh:', JSON.stringify(demKenh))
// Calibrate ngưỡng cắt (spec §8: candidate nên ~10–15% roster).
console.log(`\n── Phân bố ưu tiên → chọn ngưỡng cắt ──`)
for (const m of [0, 10, 15, 20, 25, 30, 40, 50, 60]) {
  const n = all.filter((c) => c.uuTien >= m).length
  const pct = 100 * n / tongHS
  console.log(`   uuTien >= ${String(m).padStart(2)} -> ${String(n).padStart(3)} HS = ${pct.toFixed(1).padStart(5)}%${pct >= 10 && pct <= 15 ? '  <= trúng mục tiêu 10-15%' : ''}`)
}

console.log(`\n── TOP 5 ưu tiên (đọc thử lý do) ──`)
for (const c of all.sort((a, b) => b.uuTien - a.uuTien).slice(0, 5)) {
  console.log(`\n▸ ${c.ho_ten} (${c.lop}) · ưu tiên ${c.uuTien} · kênh: ${c.kenh.join('+') || '—'}`)
  console.log(`  level: KT ${c.sheet.levelKienThuc}→${c.deXuatKienThuc.deXuat} · TĐ ${c.sheet.levelThaiDo}→${c.deXuatThaiDo.deXuat}`)
  for (const l of c.lyDo) console.log(`   · ${l}`)
}
await supabase.auth.signOut()
