// Breakdown chi tiết: ≥1/4 (OR) vs ≥2/4, dùng THẲNG listCandidatesLop thật (đã recency-scoped 2
// cửa sổ cho cả 4 kênh). 1 lần chạy, 1 snapshot đồng nhất.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop, type Candidate } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tongHS = 0
const all: Candidate[] = []
const t0 = Date.now()
for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const cands = await listCandidatesLop(l.id)
  all.push(...cands)
}
console.log(`\n=== ${lops?.length} lớp Toán · ${tongHS} HS · ${Date.now() - t0}ms ===\n`)

const sig1 = (c: Candidate) => c.kenh.includes('trend')
const sig2 = (c: Candidate) => c.kenh.includes('pct_yeu')
const sig3 = (c: Candidate) => c.kenh.includes('so_lop_et')
const sig4 = (c: Candidate) => c.kenh.includes('so_lop_mt')
const baoDong = (c: Candidate) => c.kenh.includes('chuong_do') || c.kenh.includes('tien_quyet')
const soTinHieu4 = (c: Candidate) => [sig1(c), sig2(c), sig3(c), sig4(c)].filter(Boolean).length

// ── Đếm riêng từng kênh (trên TOÀN roster, không chỉ candidate đã lọt — all chứa MỌI candidate
// listCandidatesLop trả về, kể cả người chỉ có thái độ, nên lọc đúng cần soi qua sheet trực tiếp
// KHÔNG cần vì kenh chỉ push khi tín hiệu đó CÓ THẬT dù có đủ ngưỡng hay không) ──
const c1 = all.filter(sig1).length, c2 = all.filter(sig2).length, c3 = all.filter(sig3).length, c4 = all.filter(sig4).length
const c34 = all.filter(baoDong).length
console.log(`Kênh 1 (chuyên đề qua ngưỡng, 2 cửa sổ): ${c1}/${tongHS} = ${(100*c1/tongHS).toFixed(1)}%`)
console.log(`Kênh 2 (%dạng yếu >10%, 2 cửa sổ):        ${c2}/${tongHS} = ${(100*c2/tongHS).toFixed(1)}%`)
console.log(`Kênh 3 (ET 4 buổi, 2 cửa sổ):              ${c3}/${tongHS} = ${(100*c3/tongHS).toFixed(1)}%`)
console.log(`Kênh 4 (MT gần nhất, 2 cửa sổ):            ${c4}/${tongHS} = ${(100*c4/tongHS).toFixed(1)}%`)
console.log(`Báo động ③④:                               ${c34}/${tongHS} = ${(100*c34/tongHS).toFixed(1)}%`)

// ── Phân bố đúng-N-tín-hiệu (chỉ 4 kênh dữ liệu, KHÔNG gộp báo động) ──
const demSo4: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
for (const c of all) demSo4[soTinHieu4(c)]++
// Roster KHÔNG lọt listCandidatesLop nào cả (0 tín hiệu MỌI loại, kể cả thái độ) không nằm trong `all`
// — bù thêm dòng "0" cho đủ tổng roster.
const demSo4Full = { ...demSo4, 0: tongHS - all.length + demSo4[0] }
console.log(`\n── Phân bố đúng-N-tín-hiệu (4 kênh dữ liệu, trên TOÀN roster ${tongHS} HS) ──`)
for (const n of [0, 1, 2, 3, 4]) console.log(`   đúng ${n}: ${demSo4Full[n]}/${tongHS} = ${(100*demSo4Full[n]/tongHS).toFixed(1)}%`)

// ── 2 kịch bản, KHÔNG gộp báo động trước, để thấy đúng CHỈ riêng ngưỡng-kênh ──
const or1 = tongHS - demSo4Full[0]
const ge2 = demSo4Full[2] + demSo4Full[3] + demSo4Full[4]
console.log(`\n── CHỈ 4 kênh dữ liệu (chưa gộp báo động) ──`)
console.log(`   ≥1/4 (OR): ${or1}/${tongHS} = ${(100*or1/tongHS).toFixed(1)}%`)
console.log(`   ≥2/4:      ${ge2}/${tongHS} = ${(100*ge2/tongHS).toFixed(1)}%`)

// ── 2 kịch bản, GỘP báo động (đúng luật thật đang chạy — báo động luôn tự đủ) ──
const orFinal = all.filter((c) => soTinHieu4(c) >= 1 || baoDong(c)).length
const geFinal = all.filter((c) => soTinHieu4(c) >= 2 || baoDong(c)).length
console.log(`\n── GỘP báo động ③④ (đúng luật "Duyệt bổ trợ" thật) ──`)
console.log(`   ≥1/4 HOẶC báo động: ${orFinal}/${tongHS} = ${(100*orFinal/tongHS).toFixed(1)}%`)
console.log(`   ≥2/4 HOẶC báo động: ${geFinal}/${tongHS} = ${(100*geFinal/tongHS).toFixed(1)}%  ← đang CHẠY THẬT`)

// ── Trong ≥2/4, có bao nhiêu chỉ đủ ĐÚNG 2, đúng 3, đúng 4 (không tính báo động riêng) ──
console.log(`\n── Trong nhóm ≥2/4 (không kể báo-động-mà-thiếu-≥2): đúng 2=${demSo4Full[2]} · đúng 3=${demSo4Full[3]} · đúng 4=${demSo4Full[4]}`)
