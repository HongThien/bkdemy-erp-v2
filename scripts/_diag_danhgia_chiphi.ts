// ƯỚC CHI PHÍ 1 lượt gọi Claude — đo trên PAYLOAD THẬT, không đoán.
// Chạy: npx vite-node scripts/_diag_danhgia_chiphi.ts
// ⚠ Đây là ƯỚC LƯỢNG (quy đổi ký tự → token). Số THẬT in ra ở log worker sau
//   lượt gọi đầu (`usage.input_tokens`) — lấy số đó thay cho bảng này.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop, goiGon, listCandidatesLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

// System prompt lấy thẳng từ worker để khỏi lệch.
const wk = readFileSync('worker/danhgia.mjs', 'utf8')
const SYSTEM = wk.slice(wk.indexOf('const SYSTEM = `') + 16, wk.indexOf('`\n\n// ── SCHEMA'))
const SCHEMA_LEN = wk.slice(wk.indexOf('const SCHEMA = {'), wk.indexOf('async function phan')).length

// JSON + tiếng Việt: ~3.2 ký tự/token (tiếng Việt có dấu tốn hơn tiếng Anh).
const CH_PER_TOK = 3.2
const tok = (n: number) => Math.round(n / CH_PER_TOK)

// Giá Opus 4.8 (USD / 1 triệu token).
const GIA = { vao: 5, ra: 25, cacheGhi: 6.25, cacheDoc: 0.5 }
const USD_VND = 26_000

const { data: lops } = await supabase.from('lop').select('id, ten_lop, mon')
  .eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(60)

const rows: any[] = []
for (const l of (lops ?? []).slice(0, 10) as any[]) {
  const sheets = await getStatSheetLop(l.id)
  if (!sheets.length) continue
  const cands = new Set((await listCandidatesLop(l.id)).map((c) => c.hoc_sinh_id))
  const loc = sheets.filter((s) => cands.has(s.hoc_sinh_id))
  const caLop = JSON.stringify(goiGon(sheets, l.ten_lop), null, 1)
  const chiTH = JSON.stringify(goiGon(loc, l.ten_lop, sheets.length), null, 1)
  rows.push({ lop: l.ten_lop, hs: sheets.length, hsTH: loc.length,
              tokCaLop: tok(caLop.length), tokLoc: tok(chiTH.length) })
}
rows.sort((a, b) => a.hs - b.hs)

const tokCoDinh = tok(SYSTEM.length + SCHEMA_LEN) // phần lặp lại mọi lượt → cache được
console.log(`\n=== PHẦN CỐ ĐỊNH (system prompt + schema) ===`)
console.log(`   ${SYSTEM.length + SCHEMA_LEN} ký tự ≈ ${tokCoDinh} token — lặp lại mọi lượt gọi`)
console.log(`   ⚠ dưới 4096 token thì Opus KHÔNG cache được → hiện ${tokCoDinh < 4096 ? 'CHƯA đủ ngưỡng, cache vô hiệu' : 'đủ ngưỡng, cache có tác dụng'}`)

console.log(`\n=== PAYLOAD THEO LỚP (stat sheet đã lọc gọn) ===`)
// ⚠ token "ra" gồm CẢ token SUY NGHĨ (adaptive thinking) — thinking bị tính giá
// output. effort:'high' nghĩ nhiều → đây mới là khoản tốn nhất, không phải payload.
const RA = (n: number) => 260 * n + 150   // phần chữ trả về
const NGHI = (n: number) => 700 * n + 400 // phần suy nghĩ, ước ở effort high
const tienVND = (tokVao: number, tokRa: number, g = GIA) => Math.round(((tokVao * g.vao + tokRa * g.ra) / 1e6) * USD_VND)
console.log('   lớp        HS  →có TH   tok cả lớp   tok đã lọc   tiết kiệm')
for (const r of rows) {
  const tk = r.tokCaLop ? Math.round((1 - r.tokLoc / r.tokCaLop) * 100) : 0
  console.log(`   ${String(r.lop).padEnd(10)} ${String(r.hs).padStart(2)}  ${String(r.hsTH).padStart(5)}   ${String(r.tokCaLop).padStart(10)}   ${String(r.tokLoc).padStart(10)}   ${String(tk).padStart(8)}%`)
}

const tbHS = rows.reduce((a, r) => a + r.hs, 0) / rows.length
const tbTH = rows.reduce((a, r) => a + r.hsTH, 0) / rows.length
const tbCaLop = rows.reduce((a, r) => a + r.tokCaLop, 0) / rows.length
const tbLoc = rows.reduce((a, r) => a + r.tokLoc, 0) / rows.length
const vaoA = tokCoDinh + tbCaLop, raA = RA(tbHS) + NGHI(tbHS)
const vaoB = tokCoDinh + tbLoc, raB = RA(tbTH) + NGHI(tbTH)
console.log(`\n=== TRUNG BÌNH 1 LỚP (${tbHS.toFixed(1)} HS · ${tbTH.toFixed(1)} em có tín hiệu) ===`)
console.log(`   [A] gửi cả lớp   : vào ~${Math.round(vaoA)} · ra ~${Math.round(raA)} tok (gồm ~${Math.round(NGHI(tbHS))} tok suy nghĩ) → ${tienVND(vaoA, raA).toLocaleString('vi-VN')} đ`)
console.log(`   [B] chỉ em có TH : vào ~${Math.round(vaoB)} · ra ~${Math.round(raB)} tok (gồm ~${Math.round(NGHI(tbTH))} tok suy nghĩ) → ${tienVND(vaoB, raB).toLocaleString('vi-VN')} đ  ← đang dùng`)
console.log(`   → lọc tiết kiệm ~${Math.round((1 - tienVND(vaoB, raB) / tienVND(vaoA, raA)) * 100)}%`)

const { count: soLop } = await supabase.from('lop').select('*', { count: 'exact', head: true }).eq('trang_thai', 'dang_hoc')
const dLuot = tienVND(vaoB, raB)
console.log(`\n=== QUÉT HẾT ${soLop} LỚP ĐANG HỌC, 1 LẦN/TUẦN ===`)
console.log(`   ${(dLuot * (soLop ?? 0)).toLocaleString('vi-VN')} đ/tuần · ${Math.round(dLuot * (soLop ?? 0) * 4.3).toLocaleString('vi-VN')} đ/tháng`)

console.log(`\n=== SO MODEL (cùng payload trung bình) ===`)
console.log('   (đã lọc + tính cả token suy nghĩ)')
for (const [ten, g] of [['Opus 4.8', { vao: 5, ra: 25 }], ['Sonnet 5 (KM tới 31/8)', { vao: 2, ra: 10 }], ['Sonnet 5 (giá thường)', { vao: 3, ra: 15 }], ['Haiku 4.5', { vao: 1, ra: 5 }]] as any[]) {
  const d = tienVND(vaoB, raB, g)
  console.log(`   ${String(ten).padEnd(24)} ${d.toLocaleString('vi-VN').padStart(6)} đ/lượt · ${(d * (soLop ?? 0) * 4.3).toLocaleString('vi-VN').padStart(9)} đ/tháng · Batch -50%: ${Math.round(d * (soLop ?? 0) * 4.3 / 2).toLocaleString('vi-VN')} đ/tháng`)
}
await supabase.auth.signOut()
