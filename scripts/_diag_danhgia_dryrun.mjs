// DRY-RUN engine đánh giá trên DATA THẬT (chỉ SELECT, không ghi gì). Xem output có hợp lý không
// trước khi build service/UI. Chạy: node scripts/_chk_dgh.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { masteryOfDang, MASTERY_CONFIG } from '../src/gami/mastery.js'
import { deXuatLevelKienThuc, deXuatLevelThaiDo, chuoiDiemChuyenDe, trungBinhTruot3, DANHGIA_CONFIG } from '../src/gami/danhgia.js'

const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()

const MON = 'Toán'
// Lần đo vào mastery, scope môn (buổi bù lùi về buổi gốc), kèm chuyên đề.
const { rows: do_luong } = await c.query(`
  select d.*, da.ma_chuyen_de, da.ten_chuyen_de
  from (
    select g.hoc_sinh_id, p.phase as src, p.ma_dang,
           case g.result when 'correct' then 1 when 'partial' then 0.5 when 'wrong' then 0 end as value,
           g.graded_at as t,
           coalesce(l.mon, (select lg.mon from buoi_hoc_hs bhs
             join buoi_hoc bg on bg.id = bhs.bu_cho_buoi_id join lop lg on lg.id = bg.lop_id
             where bhs.buoi_hoc_id = bh.id and bhs.hoc_sinh_id = g.hoc_sinh_id limit 1)) as mon
    from gami_grades g
    join gami_session_problems p on p.id = g.problem_id
    join buoi_hoc bh on bh.id = g.buoi_hoc_id
    left join lop l on l.id = bh.lop_id
    where p.phase in ('et','mt','btvn')
  ) d
  join dai_ban_do da on da.ma_dang = d.ma_dang
  where d.mon = $1`, [MON])

const { rows: thaiDo } = await c.query(`
  select k.hoc_sinh_id, k.thai_do, b.ngay::text as t
  from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id
  where k.thai_do is not null`)

const { rows: coDo } = await c.query('select distinct hoc_sinh_id from canh_bao_yeu')

// Gom theo HS.
const byHS = new Map()
for (const r of do_luong) {
  let h = byHS.get(r.hoc_sinh_id)
  if (!h) { h = { dang: new Map(), dangEtMt: new Map(), cd: new Map() }; byHS.set(r.hoc_sinh_id, h) }
  const ev = { value: Number(r.value), t: r.t, src: r.src }
  if (!h.dang.has(r.ma_dang)) h.dang.set(r.ma_dang, [])
  h.dang.get(r.ma_dang).push(ev)
  if (r.src !== 'btvn') { // nửa "chỉ ET+MT" — để bắt cờ BTVN che
    if (!h.dangEtMt.has(r.ma_dang)) h.dangEtMt.set(r.ma_dang, [])
    h.dangEtMt.get(r.ma_dang).push(ev)
  }
  if (!h.cd.has(r.ma_chuyen_de)) h.cd.set(r.ma_chuyen_de, { ten: r.ten_chuyen_de, cau: [] })
  h.cd.get(r.ma_chuyen_de).cau.push(ev)
}
const tdByHS = new Map()
for (const r of thaiDo) { if (!tdByHS.has(r.hoc_sinh_id)) tdByHS.set(r.hoc_sinh_id, []); tdByHS.get(r.hoc_sinh_id).push(r) }
const coDoHS = new Set(coDo.map((r) => r.hoc_sinh_id))

const NOW = Date.now()
const demKT = {}, demTD = {}
let tongDien = 0, tongChe = 0, tongThieuDo = 0, hsCoChe = 0
for (const [hsId, h] of byHS) {
  const dangs = []
  for (const [ma, evs] of h.dang) {
    const m = masteryOfDang(evs, MASTERY_CONFIG)
    if (!m) continue
    const mEtMt = h.dangEtMt.has(ma) ? masteryOfDang(h.dangEtMt.get(ma), MASTERY_CONFIG) : null
    dangs.push({ ma_dang: ma, score: m.score, n: m.n, scoreEtMt: mEtMt?.score ?? null })
  }
  const kt = deXuatLevelKienThuc({ levelHienTai: 0, dangs, coChuongDo: coDoHS.has(hsId), bayGio: NOW })
  demKT[kt.deXuat] = (demKT[kt.deXuat] ?? 0) + 1
  tongDien += kt.bangChung.dien.length
  tongThieuDo += kt.bangChung.yeuThieuDo.length
  tongChe += kt.bangChung.btvnChe.length
  if (kt.bangChung.btvnChe.length) hsCoChe++
  const td = deXuatLevelThaiDo(tdByHS.get(hsId) ?? [])
  demTD[td.deXuat] = (demTD[td.deXuat] ?? 0) + 1
}

console.log(`\n=== DRY-RUN engine trên data THẬT · môn ${MON} · ${byHS.size} HS · ${do_luong.length} lần đo ===`)
console.log('\n-- Đề xuất LEVEL KIẾN THỨC (mọi HS coi như đang ở L0) --')
for (const k of Object.keys(demKT).sort()) console.log(`   L${k}: ${demKT[k]} HS  (${(100 * demKT[k] / byHS.size).toFixed(1)}%)`)
console.log(`   Σ ô trong diện bổ trợ: ${tongDien} · ô yếu THIẾU lần đo (chỉ cảnh báo): ${tongThieuDo}`)
console.log(`   Cờ "BTVN che": ${tongChe} ô, ở ${hsCoChe} HS`)
console.log('\n-- Đề xuất LEVEL THÁI ĐỘ (độc lập) --')
for (const k of Object.keys(demTD).sort()) console.log(`   L${k}: ${demTD[k]} HS  (${(100 * demTD[k] / byHS.size).toFixed(1)}%)`)

// Trend chuyên đề: 1 HS có nhiều data nhất, xem chuỗi + MA-3 ra hình gì.
const [hsMax] = [...byHS.entries()].sort((a, b) => b[1].cd.size - a[1].cd.size)
const { rows: [ten] } = await c.query('select ho_ten from hoc_sinh where id=$1', [hsMax[0]])
console.log(`\n-- TREND chuyên đề · HS mẫu "${ten.ho_ten}" (${hsMax[1].cd.size} chuyên đề) --`)
let duMA = 0
for (const [, cd] of [...hsMax[1].cd].slice(0, 6)) {
  const ch = chuoiDiemChuyenDe(cd.cau)
  const diem = ch.map((x) => x.diem?.score ?? null)
  if (trungBinhTruot3(diem).some((x) => x != null)) duMA++
  const fmt = (v, o) => (v == null ? ' —  ' : v.toFixed(2) + (o?.itLanDo ? '⚠' : ' '))
  console.log(`   ${cd.ten.slice(0, 32).padEnd(32)} ${ch.map((x, i) => `${x.cuaSo.slice(5)}:${fmt(diem[i], x.diem)}`).join(' ')}`)
}
console.log(`   (⚠ = dưới ${DANHGIA_CONFIG.GATE_N} câu trong cửa sổ → vẫn ra số, kèm cờ "ít lần đo")`)
console.log(`   Chuyên đề đủ 3 cửa sổ để mượt MA-3: ${duMA}/6 mẫu`)
await c.end()
