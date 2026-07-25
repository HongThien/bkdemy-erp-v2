// SOI nhận định của Claude: mọi con số/mã nó nêu có THẬT trong stat sheet không?
// Bịa số là rủi ro nguy hiểm nhất — TA đọc rồi xử lý sai học sinh.
// Chạy: node scripts/_diag_soi_nhan_dinh.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const raw = readFileSync('.env.local', 'utf8')
const env = (k) => { const l = raw.split(/\r?\n/).find((x) => x.trim().startsWith(k + '=')); return l ? l.slice(l.indexOf('=') + 1).trim() : null }
const svc = createClient(env('VITE_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE'))

const { data } = await svc.from('danhgia_ai_job').select('stat_sheet, ket_qua, model')
  .eq('trang_thai', 'done').order('created_at', { ascending: false }).limit(1)
const { stat_sheet: s, ket_qua: k, model } = data[0]
console.log(`Lớp ${s.ten_lop} · ${model}\n`)

// Bảng tra: mã dạng → điểm thật, theo từng em
const that = new Map()
for (const h of s.hoc_sinh) {
  const m = new Map()
  for (const d of h.dang ?? []) m.set(d.ma, d)
  that.set(h.hoc_sinh_id, { ten: h.ho_ten, dang: m, sheet: h })
}

let biaMa = 0, saiSo = 0, dungSo = 0
console.log('── ĐỐI CHIẾU TỪNG MÃ DẠNG CLAUDE NHẮC TỚI ──')
for (const h of k.hoc_sinh ?? []) {
  const g = that.get(h.hoc_sinh_id)
  if (!g) { console.log(`  ⚠ ${h.ho_ten}: KHÔNG có trong stat sheet gửi đi!`); continue }
  const nhac = [...new Set([...(h.ly_do ?? '').matchAll(/\b(\d{8})\b/g)].map((x) => x[1]).concat(h.dang_uu_tien_bo_tro ?? []))]
  const loi = []
  for (const ma of nhac) {
    if (!g.dang.has(ma)) { loi.push(`${ma} KHÔNG có trong dữ liệu gửi`); biaMa++; continue }
    dungSo++
  }
  // Soi con số trong ly_do: mọi "0.xx" phải khớp một điểm thật nào đó của em
  const soNeu = [...new Set([...(h.ly_do ?? '').matchAll(/\b0\.\d+\b/g)].map((x) => Number(x[0])))]
  const diemThat = new Set()
  for (const d of g.dang.values()) { diemThat.add(d.diem); if (d.diem_chi_giam_sat != null) diemThat.add(d.diem_chi_giam_sat) }
  for (const c of g.sheet.chuyen_de ?? []) for (const p of c.chuoi ?? []) if (p.diem != null) diemThat.add(p.diem)
  const laLung = soNeu.filter((x) => ![...diemThat].some((y) => Math.abs(y - x) < 0.005))
  if (laLung.length) { loi.push(`số không khớp dữ liệu nào: ${laLung.join(', ')}`); saiSo += laLung.length }

  console.log(`  ${String(h.ho_ten).padEnd(22)} ${String(h.phan_loai).padEnd(18)} ${String(h.do_tin).padEnd(12)} ${nhac.length} mã · ${loi.length ? '❌ ' + loi.join(' | ') : '✓ khớp hết'}`)
}

console.log('\n── PHÂN BỐ NHÃN (nhãn cao nhất mà nhiều quá thì mất khả năng xếp ưu tiên) ──')
const dem = {}
for (const h of k.hoc_sinh ?? []) dem[h.phan_loai] = (dem[h.phan_loai] ?? 0) + 1
for (const [n, c] of Object.entries(dem)) console.log(`  ${n.padEnd(20)} ${c}/${k.hoc_sinh.length}`)

console.log('\n── SỐ MÃ TRONG "dạng nên bổ trợ trước" (nhiều quá thì hết là ưu tiên) ──')
for (const h of k.hoc_sinh ?? []) {
  const n = h.dang_uu_tien_bo_tro?.length ?? 0
  if (n) console.log(`  ${String(h.ho_ten).padEnd(22)} ${n} mã${n > 4 ? '  ⚠ quá nhiều để gọi là "ưu tiên trước"' : ''}`)
}

console.log(`\nTỔNG: ${dungSo} mã khớp · ${biaMa} mã bịa · ${saiSo} con số không khớp`)
console.log(biaMa || saiSo ? '❌ CÓ chỗ không khớp dữ liệu' : '✅ Không bịa mã, không bịa số')
