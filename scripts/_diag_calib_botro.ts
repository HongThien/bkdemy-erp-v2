// Calibrate tiêu chí candidate mới trên data THẬT — đo tỉ lệ hiện tại + breakdown kênh.
// Chạy: npx vite-node scripts/_diag_calib_botro.ts
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tongHS = 0
const demKenh: Record<string, number> = {}
const all: any[] = []
const t0 = Date.now()
for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  const cands = await listCandidatesLop(l.id)
  tongHS += count
  for (const c of cands) { for (const k of c.kenh) demKenh[k] = (demKenh[k] ?? 0) + 1; all.push({ ...c, lop: l.ten_lop }) }
}
console.log(`\n=== ${lops?.length} lớp Toán · ${tongHS} HS roster · ${Date.now() - t0}ms ===`)
console.log(`Hiện tại (kenh.some khác thai_do): ${all.length}/${tongHS} = ${(100*all.length/tongHS).toFixed(1)}%`)
console.log('Theo kênh:', JSON.stringify(demKenh))

// Chỉ-đề-xuất-vì-trend-nhẹ: có kenh trend nhưng KHÔNG dien, KHÔNG so_lop, KHÔNG chuong_do/tien_quyet
const chiTrendNhe = all.filter((c) => c.kenh.includes('trend') && !c.kenh.includes('so_lop')
  && !c.kenh.includes('chuong_do') && !c.kenh.includes('tien_quyet')
  && c.deXuatKienThuc.bangChung.dien.length === 0)
console.log(`\nChỉ lọt vì "trend" (không dạng yếu thật, không so-lớp, không báo động): ${chiTrendNhe.length}`)

// Nếu bỏ hẳn kênh trend khỏi điều kiện lọt-vào (giữ dien / so_lop / chuong_do / tien_quyet / doiLevel):
const sietChat = all.filter((c) =>
  c.deXuatKienThuc.bangChung.dien.length > 0 || c.kenh.includes('so_lop')
  || c.kenh.includes('chuong_do') || c.kenh.includes('tien_quyet'))
console.log(`Nếu chỉ giữ (dạng yếu thật · so-lớp kém · báo động): ${sietChat.length}/${tongHS} = ${(100*sietChat.length/tongHS).toFixed(1)}%`)
