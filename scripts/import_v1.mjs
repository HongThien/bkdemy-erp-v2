// Import HS + PH + lớp + ghi danh từ V1 (Supabase REST, anon) sang V2 (pg, claude_build).
// Chạy: node scripts/import_v1.mjs  — IDEMPOTENT: upsert theo mã, chạy lại không nhân đôi.
// Quyết định Thùy 06-11: import TẤT CẢ HS (nghỉ/bảo lưu giữ hồ sơ, không ghi danh lớp);
// band "Upper-X"→X1, "Inter-X"→X2, "Lower-X"→X3 (mức 1 = xịn nhất); band T → S1.
import { readFileSync } from 'node:fs'
import pg from 'pg'

const envV1 = readFileSync(new URL('../../bkdemy-erp/.env.local', import.meta.url), 'utf8')
const V1_URL = envV1.match(/VITE_SUPABASE_URL=(.+)/)[1].trim()
const V1_KEY = envV1.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim()
const H = { apikey: V1_KEY, Authorization: `Bearer ${V1_KEY}` }
const v1 = async (path) => {
  const r = await fetch(`${V1_URL}/rest/v1/${path}`, { headers: H })
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`)
  return r.json()
}

const dbUrl = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: dbUrl })
await c.connect()

// ── helpers map ───────────────────────────────────────────────────
const GT = { Nam: 'nam', 'Nữ': 'nu', nam: 'nam', nu: 'nu' }
const TT = { 'Đang học': 'dang_hoc', 'Bảo lưu': 'bao_luu', 'Nghỉ học': 'nghi' }
// "Upper - A" → A1 · "Inter - S" → S2 · "Lower - C" → C3 · mọi "- T" → S1
function mapBand(b) {
  if (!b) return null
  const m = b.match(/^(Upper|Inter|Lower)\s*-\s*([SABCT])$/i)
  if (!m) return null
  const bac = m[2].toUpperCase()
  if (bac === 'T') return 'S1'
  const muc = { UPPER: 1, INTER: 2, LOWER: 3 }[m[1].toUpperCase()]
  return `${bac}${muc}`
}
// bậc lớp đoán từ tên: 8A1→A, 9S1→S, 5T1→S (T=bậc S); chữ môn (K/E/V) hoặc tên lạ → null
function bacFromTenLop(ten, mon) {
  if (mon !== 'Toán') return null
  const m = ten.match(/^\d+([SABCT])\d/)
  if (!m) return null
  return m[1] === 'T' ? 'S' : m[1]
}
const maHS = (v1ma) => `HS${String(v1ma).padStart(4, '0')}`

// ── 1) Kéo V1 ─────────────────────────────────────────────────────
const students = await v1('students?select=*&limit=2000')
const lops = await v1('lop_hoc?select=ten_lop,khoi,mon,active&limit=500')
console.log(`V1: ${students.length} HS, ${lops.length} lớp`)

// ── 2) Lớp: upsert theo ten_lop (V2 chưa có unique → select trước) ─
const lopId = new Map() // ten_lop → id
for (const l of lops) {
  const ex = await c.query('select id from lop where ten_lop=$1', [l.ten_lop])
  if (ex.rows[0]) { lopId.set(l.ten_lop, ex.rows[0].id); continue }
  const r = await c.query(
    `insert into lop (ten_lop, mon, khoi, bac, trang_thai) values ($1,$2,$3,$4,$5) returning id`,
    [l.ten_lop, l.mon ?? 'Toán', l.khoi ?? null, bacFromTenLop(l.ten_lop, l.mon ?? 'Toán'), l.active ? 'dang_hoc' : 'dong'])
  lopId.set(l.ten_lop, r.rows[0].id)
}
console.log(`Lớp V2 sẵn sàng: ${lopId.size}`)

// ── 3) Phụ huynh: dedup theo ma_ph V1; HS không có ma_ph nhưng có tên PH → mã thế thân ổn định ──
const phId = new Map() // ma_ph → id
for (const s of students) {
  const ma = s.ma_ph ? String(s.ma_ph) : (s.ten_ph ? `V1HS${s.ma_hs}` : null)
  if (!ma || phId.has(ma)) continue
  const ex = await c.query('select id from phu_huynh where ma_ph=$1', [ma])
  if (ex.rows[0]) { phId.set(ma, ex.rows[0].id); continue }
  const r = await c.query(
    `insert into phu_huynh (ma_ph, ho_ten, so_dien_thoai, email, dia_chi) values ($1,$2,$3,$4,$5) returning id`,
    [ma, s.ten_ph ?? 'PH ' + s.ten_hs, s.sdt_ph1 ?? null, s.email_ph ?? null, s.dia_chi ?? null])
  phId.set(ma, r.rows[0].id)
}
console.log(`PH: ${phId.size}`)

// ── 4) Học sinh: upsert theo ma_hs ────────────────────────────────
const mnl = new Map((await c.query('select id, ma from muc_nang_luc')).rows.map((r) => [r.ma, r.id]))
const hsId = new Map()
let nhs = 0
for (const s of students) {
  const ma = maHS(s.ma_hs)
  const phMa = s.ma_ph ? String(s.ma_ph) : (s.ten_ph ? `V1HS${s.ma_hs}` : null)
  const vals = [ma, s.ten_hs, s.ngay_sinh ?? null, GT[s.gioi_tinh] ?? null, s.khoi ?? null,
    TT[s.trang_thai] ?? 'dang_hoc', s.truong_hoc ?? null, s.dia_chi ?? null, s.ngay_nhap_hoc ?? null,
    s.diem_test_dau_vao ?? null, phMa ? phId.get(phMa) : null]
  const ex = await c.query('select id from hoc_sinh where ma_hs=$1', [ma])
  if (ex.rows[0]) {
    hsId.set(s.ma_hs, ex.rows[0].id)
    await c.query(`update hoc_sinh set ho_ten=$2, ngay_sinh=$3, gioi_tinh=$4, khoi=$5, trang_thai=$6,
      truong_hoc=$7, dia_chi=$8, ngay_nhap_hoc=$9, diem_test_dau_vao=$10, phu_huynh_id=$11 where ma_hs=$1`, vals)
  } else {
    const r = await c.query(`insert into hoc_sinh (ma_hs, ho_ten, ngay_sinh, gioi_tinh, khoi, trang_thai,
      truong_hoc, dia_chi, ngay_nhap_hoc, diem_test_dau_vao, phu_huynh_id)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`, vals)
    hsId.set(s.ma_hs, r.rows[0].id); nhs++
  }
}
console.log(`HS mới: ${nhs} / tổng ${students.length}`)

// ── 5) Ghi danh: 4 cột lop_* → hoc_sinh_lop; band gắn vào lớp TOÁN (V1 band là Toán) ──
let ghidanh = 0, thieuLop = new Set()
for (const s of students) {
  if (TT[s.trang_thai] !== 'dang_hoc') continue // HS nghỉ/bảo lưu: giữ hồ sơ, không ghi danh
  for (const col of ['lop_toan', 'lop_van', 'lop_anh', 'lop_khtn']) {
    const ten = s[col]
    if (!ten) continue
    const lid = lopId.get(ten)
    if (!lid) { thieuLop.add(ten); continue }
    const band = col === 'lop_toan' ? mapBand(s.band_nang_luc) : null
    await c.query(`insert into hoc_sinh_lop (hoc_sinh_id, lop_id, muc_nang_luc_id, trang_thai)
      values ($1,$2,$3,'dang_hoc')
      on conflict (hoc_sinh_id, lop_id) do update set muc_nang_luc_id = coalesce(excluded.muc_nang_luc_id, hoc_sinh_lop.muc_nang_luc_id), trang_thai='dang_hoc'`,
      [hsId.get(s.ma_hs), lid, band ? mnl.get(band) : null])
    ghidanh++
  }
}
console.log(`Ghi danh: ${ghidanh} dòng. Lớp V1 không thấy trong lop_hoc: ${[...thieuLop].join(', ') || 'không'}`)

// ── 6) Đẩy hs_seq vượt max (mã HS0xxx tường minh làm sequence tụt) ──
await c.query(`select setval('hs_seq', greatest((select coalesce(max(substring(ma_hs from 3)::int),0) from hoc_sinh where ma_hs ~ '^HS[0-9]+$'), (select last_value from hs_seq)))`)
await c.end()
console.log('XONG.')
