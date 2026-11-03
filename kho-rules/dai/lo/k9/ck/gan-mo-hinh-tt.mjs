// gan-mo-hinh-tt.mjs [--ghi] — gắn các bài Hình CUỐI KÌ I K9 (đề cương kho tham khảo, 03/11) vào MÔ HÌNH TIẾP TUYẾN của Hình–Luyện.
//   hai_tt → "Mô hình hai tiếp tuyến" · ba_tt → "Mô hình ba tiếp tuyến" · tt_khac / khong_tt → để trống (§1.5 thà bỏ trống còn hơn đánh sai).
// Nguồn nhãn: <MA>.hinh.phanloai.json (khoá "P<phần> Bài <nhãn>") do trạm soạn điền, trạm soát (Opus) duyệt.
// Nối nhãn → ma_cau: thứ tự trong tai_lieu (phần, câu) CHỈ là ứng viên; NHÂN CHỨNG THỨ HAI = nội dung đề trong bản soạn khớp noi_dung câu trong DB.
//   Lệch dù 1 câu ⇒ bỏ cả đề (không gắn gì), in cảnh báo.
// Chỉ UPDATE hinh_bai khi mo_hinh_id IS NULL (không đè mô hình người đã gán). Mặc định ROLLBACK.
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
const ENV = readFileSync(join(HERE, '../../../../../.env'), 'utf8')
const lay = (k) => { const m = ENV.match(new RegExp('[ \\t]*' + k + '[ \\t]*=[ \\t]*(.+?)[ \\t\\r]*$', 'm')); return m ? m[1].replace(/^["']|["']$/g, '') : null }
const url = lay('DATABASE_URL')   // cả chạy thử cũng UPDATE trong transaction rồi ROLLBACK ⇒ cần role ghi
const MO_HINH = { hai_tt: 'c0fae5a5-a3ea-492e-9c2f-620c2378cf2f', ba_tt: '195ba557-5707-4d87-a36f-d01559deefb7' }
const chuan = (s) => String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').replace(/\$/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase()

// bản soạn → [{ khoa:'P1 Bài 3', de:'…' }] theo thứ tự tệp
function docSoan(f) {
  const out = []; let phan = 0, cur = null
  for (const dong of readFileSync(f, 'utf8').split(/\r?\n/)) {
    let m
    if ((m = dong.match(/## PHẦN (\d+)/))) { phan = Number(m[1]); continue }
    if ((m = dong.match(/^### ([^|]+?)\s*\|/))) { cur = { khoa: `P${phan} ${m[1].trim()}`, de: [], trongDe: false }; out.push(cur); continue }
    if (!cur) continue
    if (/\*\*Đề:\*\*/.test(dong)) { cur.trongDe = true; cur.de.push(dong.replace(/^\*\*Đề:\*\*\s*/, '')); continue }
    if (/\*\*[^*]+:\*\*|^\*\*Phần/.test(dong)) { cur.trongDe = false; continue }
    if (cur.trongDe) cur.de.push(dong)
  }
  return out.map((x) => ({ khoa: x.khoa, de: x.de.join(' ') }))
}

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('begin')
const ds = JSON.parse(readFileSync(join(HERE, 'ds.json'), 'utf8'))
const gan = new Map()   // ma_cau → { tt, tu: [MA…] }
const canhBao = []
const tatca = new Map()   // ma_cau → { tt, de } (mọi câu đã qua nhân chứng)
for (const x of ds) {
  const LV = x.LV
  const f = join(HERE, `${x.ma}.hinh.soan.md`), pj = join(HERE, `${x.ma}.hinh.phanloai.json`), dg = join(LV, 'da-ghi.txt')
  if (!existsSync(dg) || !existsSync(f) || !existsSync(pj)) continue
  const tl = readFileSync(dg, 'utf8').match(/[0-9a-f-]{36}/)?.[0]
  const soan = docSoan(f), pl = JSON.parse(readFileSync(pj, 'utf8'))
  const db = (await c.query(
    `select tc.ma_cau, h.noi_dung from tai_lieu_cau tc join tai_lieu_phan p on p.id=tc.phan_id
       join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau
      where p.tai_lieu_id=$1 order by p.thu_tu, tc.thu_tu`, [tl])).rows
  if (db.length !== soan.length) { canhBao.push(`${x.ma}: ${db.length} câu DB ≠ ${soan.length} bài trong bản soạn ⇒ BỎ CẢ ĐỀ`); continue }
  const lech = soan.filter((s, i) => { const a = chuan(s.de).slice(0, 50), b = chuan(db[i].noi_dung).slice(0, 50); return !(a && b && (b.startsWith(a.slice(0, 30)) || a.startsWith(b.slice(0, 30)))) })
  if (lech.length) { if (process.env.DEBUG_TT) lech.forEach((l) => console.log('  ·', l.khoa, '|', chuan(l.de).slice(0, 70), '|', chuan(db[soan.indexOf(l)].noi_dung).slice(0, 70))); canhBao.push(`${x.ma}: ${lech.length} câu nội dung lệch (${lech.map((l) => l.khoa).join(', ')}) ⇒ BỎ CẢ ĐỀ`); continue }
  const thieu = soan.filter((s) => !pl[s.khoa])
  if (thieu.length) { canhBao.push(`${x.ma}: phanloai thiếu ${thieu.map((l) => l.khoa).join(', ')} ⇒ các câu đó bỏ qua`) }
  soan.forEach((s, i) => {
    const tt = pl[s.khoa]?.tt
    if (tt && !tatca.has(db[i].ma_cau)) tatca.set(db[i].ma_cau, { tt, de: s.de })
    if (!MO_HINH[tt]) return
    const cu = gan.get(db[i].ma_cau)
    if (cu && cu.tt !== tt) canhBao.push(`${db[i].ma_cau}: xung đột ${cu.tt} (${cu.tu.join(',')}) ↔ ${tt} (${x.ma}) ⇒ BỎ câu này`), cu.xungDot = true
    else if (cu) cu.tu.push(x.ma)
    else gan.set(db[i].ma_cau, { tt, tu: [x.ma] })
  })
}
const dem = { hai_tt: 0, ba_tt: 0, khong_co_bai: 0, da_co_mo_hinh: 0 }
for (const [ma, g] of gan) {
  if (g.xungDot) continue
  const r = await c.query(`select id, mo_hinh_id from hinh_bai where nguon_ma_cau=$1 and khoi='9'`, [ma])
  if (!r.rowCount) { dem.khong_co_bai++; continue }
  if (r.rows[0].mo_hinh_id) { dem.da_co_mo_hinh++; continue }
  await c.query(`update hinh_bai set mo_hinh_id=$2, updated_at=now() where id=$1 and mo_hinh_id is null`, [r.rows[0].id, MO_HINH[g.tt]])
  dem[g.tt]++
}

// ── --xep: xếp câu Hình (đang tạm HH00108) vào đúng bài theo chủ đề — chỉ đổi dang_chinh, mã câu bất biến ──
if (process.argv.includes('--xep')) {
  const B = { DT: 'HH00105', LG: 'HH00095', CUNG: 'HH00106', QUAT: 'HH00107', TT: 'HH00108', TT2: 'HH00109' }
  const dich = (g) => {
    if (g.tt === 'hai_tt') return B.TT2
    return B.TT   // phần còn lại (ba_tt / tt_khac / không tiếp tuyến) GIỮ HH00108: tự đoán chủ đề bằng từ khoá quá nhiễu (§1.5) — người xếp tay
  }
  const kq = {}, mau = {}
  for (const [ma, g] of tatca) {
    const d = dich(g); if (d === B.TT) { kq[d] = (kq[d] ?? 0) + 1; continue }
    const r = await c.query(`update hinh_hoc_cau_hoi set dang_chinh=$2 where ma_cau=$1 and dang_chinh='HH00108' and xoa_at is null returning ma_cau`, [ma, d])
    if (r.rowCount === 1) { kq[d] = (kq[d] ?? 0) + 1; (mau[d] ??= []).push(chuan(g.de).slice(0, 60)) }
  }
  console.log('xếp dạng:', kq)
  if (process.env.MAU) for (const [d, l] of Object.entries(mau)) { console.log(d); l.slice(0, 6).forEach((x) => console.log('   ', x)) }
}
console.log(dem); for (const w of canhBao) console.log('⚠', w)
if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('Chạy thử — ROLLBACK. Thêm --ghi để ghi thật.') }
await c.end()
