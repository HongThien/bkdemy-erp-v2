// Sinh migration gộp Bài học khối 8 về mô hình GỐC HỌ (CEO 17/09):
//  · Giữ 9 Bài của mô hình `la_goc_ho=true`.
//  · 17 Bài của mô hình con → chuyển toàn bộ câu sang Bài của gốc họ tương ứng (leo `hinh_mo_hinh_cha`),
//    sau đó XÓA Bài con (+ lý thuyết Bài con).
//  · `mo_hinh_id` trong câu giữ nguyên (nhãn mastery — mô hình con vẫn tồn tại phía Luyện, chỉ Bài học flat).
//
// Không đụng gì phía `hinh_mo_hinh`/`hinh_baitoan`/… (Luyện chạy nguyên vẹn).

import pg from 'pg'
import { readFileSync, writeFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()

const mos = (await c.query(`select id, ma, ten, la_goc_ho from hinh_mo_hinh where khoi='8'`)).rows
const byId = new Map(mos.map(m => [m.id, m]))
const byTen = new Map(mos.map(m => [m.ten.trim(), m]))
const edges = (await c.query(`select mo_hinh_id, cha_id from hinh_mo_hinh_cha where mo_hinh_id = any($1)`,
  [mos.map(m => m.id)])).rows
const chaCua = new Map(mos.map(m => [m.id, new Set()]))
for (const e of edges) chaCua.get(e.mo_hinh_id).add(e.cha_id)

function gocHo(id) {
  const m = byId.get(id); if (!m || m.la_goc_ho) return id
  const q = [...(chaCua.get(id) ?? [])], seen = new Set([id])
  while (q.length) {
    const x = q.shift(); if (seen.has(x)) continue; seen.add(x)
    const xm = byId.get(x); if (!xm) continue
    if (xm.la_goc_ho) return x
    for (const p of chaCua.get(x) ?? []) if (!seen.has(p)) q.push(p)
  }
  return null
}

// Nạp Bài học K8 hiện có
const bais = (await c.query(`select ma_bai, ten_bai, thu_tu from hinh_hoc_bai where khoi='8' order by thu_tu`)).rows
const baiByTen = new Map(bais.map(b => [b.ten_bai.trim(), b]))

const esc = (v) => v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`

// Phân loại Bài → gốc họ hay con
const baiCon = []  // {ma_bai_con, ma_bai_goc, ten_con, ten_goc}
const baiGoc = []
for (const b of bais) {
  const m = byTen.get(b.ten_bai.trim())
  if (!m) { console.error(`⚠ Bài "${b.ten_bai}" (${b.ma_bai}) không tra được mô hình khối 8 → BỎ QUA`); continue }
  if (m.la_goc_ho) { baiGoc.push({ ma_bai: b.ma_bai, ten_bai: b.ten_bai }); continue }
  const gocId = gocHo(m.id)
  if (!gocId) { console.error(`⚠ Bài "${b.ten_bai}" mô hình ${m.ma} không có gốc họ → BỎ QUA`); continue }
  const gocM = byId.get(gocId)
  const gocBai = baiByTen.get(gocM.ten.trim())
  if (!gocBai) { console.error(`⚠ Không có Bài gốc "${gocM.ten}" cho ${m.ma} → BỎ QUA`); continue }
  baiCon.push({ ma_bai_con: b.ma_bai, ma_bai_goc: gocBai.ma_bai, ten_con: b.ten_bai, ten_goc: gocBai.ten_bai, mh_ma: m.ma })
}

console.log(`Bài gốc họ giữ: ${baiGoc.length}`)
console.log(`Bài con gộp: ${baiCon.length}`)

// Đếm câu cần chuyển trong từng Bài con
const nCauCon = new Map()
for (const c1 of baiCon) {
  const n = (await c.query(`select count(*)::int n from hinh_hoc_cau_hoi where dang_chinh=$1`, [c1.ma_bai_con])).rows[0].n
  nCauCon.set(c1.ma_bai_con, n)
}
const tongChuyen = [...nCauCon.values()].reduce((a,b)=>a+b, 0)

// Sinh SQL migration
const now = new Date()
const pad = n => String(n).padStart(2,'0')
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`
const path = `supabase/migrations/${ts}_gop_hinh_k8_ve_goc_ho.sql`

const p = []
p.push(`-- ============================================================================`)
p.push(`-- ${ts} — GỘP Bài học HÌNH khối 8 về MÔ HÌNH GỐC HỌ (CEO 17/09)`)
p.push(`-- ----------------------------------------------------------------------------`)
p.push(`-- VÌ SAO: CEO chốt K8 chỉ giữ 9 Bài GỐC HỌ (Tứ giác, Hình thang, Hình thang cân,`)
p.push(`-- Hình bình hành, Hình chữ nhật, Hình thoi, Hình vuông, Tam giác vuông - trung điểm,`)
p.push(`-- Hình học Test). Mô hình CON của K8 (17 cái) → bỏ khỏi cây "Bài học", gom câu về Bài GỐC.`)
p.push(`--`)
p.push(`-- QUY TRÌNH:`)
p.push(`--   1. UPDATE hinh_hoc_cau_hoi.dang_chinh (${tongChuyen} câu) từ Bài con → Bài gốc tương ứng.`)
p.push(`--      \`mo_hinh_id\` GIỮ NGUYÊN (mô hình con vẫn tồn tại ở hinh_mo_hinh — mastery signal không mất).`)
p.push(`--   2. DELETE hinh_hoc_bai_ly_thuyet của ${baiCon.length} Bài con (cascade khi xóa Bài).`)
p.push(`--   3. DELETE ${baiCon.length} Bài con khỏi hinh_hoc_bai.`)
p.push(`--`)
p.push(`-- MẤT GÌ: 17 Bài con trong \`hinh_hoc_bai\` (và lý thuyết) — nội dung câu KHÔNG mất (chỉ đổi dang_chinh).`)
p.push(`-- KHÔNG đụng \`hinh_mo_hinh\`/\`hinh_baitoan\`/… (phía Luyện nguyên vẹn).`)
p.push(`--`)
p.push(`-- Bảng mapping Bài con → Bài gốc (đã kiểm hierarchy qua hinh_mo_hinh_cha):`)
for (const c1 of baiCon) {
  p.push(`--   ${c1.ma_bai_con} "${c1.ten_con}"  (${c1.mh_ma})  →  ${c1.ma_bai_goc} "${c1.ten_goc}"  · ${nCauCon.get(c1.ma_bai_con)} câu`)
}
p.push(`-- ============================================================================`)
p.push(``)
p.push(`begin;`)
p.push(``)
p.push(`-- PRE-CHECK: 17 Bài con vẫn còn ─ nếu đã chạy migration này rồi thì không còn.`)
p.push(`do $$`)
p.push(`declare n int;`)
p.push(`begin`)
p.push(`  select count(*) into n from hinh_hoc_bai where ma_bai in (${baiCon.map(c=>esc(c.ma_bai_con)).join(',')});`)
p.push(`  if n = 0 then raise exception 'Không còn Bài con nào của K8 — migration này đã chạy hoặc data khác trạng thái. Bỏ qua.'; end if;`)
p.push(`  if n <> ${baiCon.length} then raise notice 'Kỳ vọng ${baiCon.length} Bài con, có %', n; end if;`)
p.push(`end $$;`)
p.push(``)
p.push(`-- STAGE 1: Chuyển câu từng Bài con sang Bài gốc.`)
p.push(`-- Điều chỉnh thu_tu để không trùng — cộng offset = max(thu_tu) hiện tại của Bài gốc.`)
for (const c1 of baiCon) {
  p.push(`update hinh_hoc_cau_hoi set`)
  p.push(`  dang_chinh = ${esc(c1.ma_bai_goc)},`)
  p.push(`  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = ${esc(c1.ma_bai_goc)}), 0)`)
  p.push(`  where dang_chinh = ${esc(c1.ma_bai_con)};`)
}
p.push(``)
p.push(`-- STAGE 2: Xóa lý thuyết Bài con (FK cascade khi xóa Bài, nhưng xóa tường minh để tránh dựa vào cascade).`)
p.push(`delete from hinh_hoc_bai_ly_thuyet where ma_bai in (${baiCon.map(c=>esc(c.ma_bai_con)).join(',')});`)
p.push(``)
p.push(`-- STAGE 3: Xóa Bài con — chỉ được nếu KHÔNG còn câu tham chiếu (FK ON DELETE RESTRICT ở hinh_hoc_cau_hoi.dang_chinh).`)
p.push(`delete from hinh_hoc_bai where ma_bai in (${baiCon.map(c=>esc(c.ma_bai_con)).join(',')});`)
p.push(``)
p.push(`-- POST-CHECK`)
p.push(`do $$`)
p.push(`declare n_bai int; n_cau int;`)
p.push(`begin`)
p.push(`  select count(*) into n_bai from hinh_hoc_bai where khoi='8';`)
p.push(`  select count(*) into n_cau from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='8';`)
p.push(`  raise notice 'K8 sau gộp: % Bài học, % câu (kỳ vọng ${baiGoc.length} Bài).', n_bai, n_cau;`)
p.push(`  if n_bai <> ${baiGoc.length} then raise exception 'Số Bài sai: kỳ vọng ${baiGoc.length}, có %', n_bai; end if;`)
p.push(`end $$;`)
p.push(``)
p.push(`commit;`)

writeFileSync(path, p.join('\n'), 'utf8')
console.log(`\n✅ Migration: ${path}`)
console.log(`   Chuyển ${tongChuyen} câu · Xóa ${baiCon.length} Bài con · Giữ ${baiGoc.length} Bài gốc họ.`)

await c.end()
