// SINH PHIÊN BẢN TRẮC NGHIỆM (distractor theo lỗi) cho câu tính toán — worker cho Claude Code.
// Spec: spec-mcq-form.md (CEO chốt 08/09). Pattern giống scripts/hangdoi-giai.mjs (quota Claude Code, không API trả phí).
//
//   1) node scripts/mcq-sinh.mjs --list [--dang T107010401] [--n 40] [--out lo.json]
//        → JSON: câu pool (§2) chưa có form + key_gia_tri đã chuẩn hoá (scripts/lib/huuti.mjs) + bảng rule + phân bố
//          vị trí đáp án đúng hiện có (để cân A/B/C/D) + ≤2 form mẫu đã duyệt cùng dạng. Câu KHÔNG parse được đáp số
//          → in riêng kèm lý do, KHÔNG đưa vào lô (§1.5 không đoán). Claude ĐỌC rồi TỰ SINH trong chat theo §5.2.
//   2) Claude viết kq.json: [{ ma_cau, dap_an:'A'|'B'|'C'|'D', lua_chon:[{text,dung,rule?,duong_sai?} ×4] } | { ma_cau, bo:'lý do' }]
//   3) node scripts/mcq-sinh.mjs --verify kq.json        → kiểm MÁY (§5.3), in OK/FAIL từng câu. Không ghi gì.
//   4) node scripts/mcq-sinh.mjs --ghi kq.json [--model claude-fable-5-1]
//        → verify lại rồi INSERT dai_cau_form_tn (nguon='ai', da_duyet=false), mỗi câu 1 transaction; câu đã có form
//          hiệu lực → bỏ qua, không đè. Trigger DB kiểm lần nữa (4 phương án / 1 đúng / rule tồn tại).
// Kết nối: DATABASE_URL trong .env (cùng cách các script khác).
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parseHuuTi, hinhThuc, ratEq } from './lib/huuti.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const env = envf(join(root, '.env'))
const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const has = (k) => args.includes(k)

// Pool 1 (spec §2) — 9 dạng lớp 7 "Số hữu tỉ" nhóm tính toán.
const POOL1 = ['T107010201', 'T107010202', 'T107010203', 'T107010206', 'T107010207', 'T107010401', 'T107010403', 'T107010404', 'T107010301']
const TBL = 'dai_cau_form_tn'
const LETTERS = ['A', 'B', 'C', 'D']

const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()
try {
  if (has('--list')) await list()
  else if (has('--verify')) { const r = await verify(opt('--verify')); process.exitCode = r.fail ? 1 : 0 }
  else if (has('--ghi')) await ghi(opt('--ghi'))
  else console.log('Dùng: --list [--dang X] [--n 40] [--out f.json] | --verify kq.json | --ghi kq.json [--model m]')
} finally { await c.end() }

async function rules() { return (await c.query('select ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong from dai_mcq_rule where active order by ma')).rows }

async function list() {
  const dang = opt('--dang'), n = Number(opt('--n', 40))
  const dangs = dang ? [dang] : POOL1
  const { rows } = await c.query(`
    select q.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an, q.loi_giai
    from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
    where q.xoa_at is null and q.dang_chinh = any($1)
      and q.da_duyet                                   -- CỬA 2 chỉ nhận câu đã qua CỬA 1 (spec-kho-chuan.md §4, từ 08/09)
      and q.dap_an is not null and q.dap_an <> '' and q.lua_chon is null and q.menh_de is null
      and not exists (select 1 from ${TBL} f where f.ma_cau = q.ma_cau and f.xoa_at is null)
    order by q.dang_chinh, q.ma_cau`, [dangs])
  const cau = [], bo = []
  for (const r of rows) {
    const p = parseHuuTi(r.dap_an)
    if (!p.ok) { bo.push({ ma_cau: r.ma_cau, dap_an: r.dap_an, ly_do: p.ly_do }); continue }
    if (cau.length < n) cau.push({ ...r, key_gia_tri: p.canon, hinh_thuc: hinhThuc(r.dap_an) })
  }
  const phanBo = Object.fromEntries(LETTERS.map((l) => [l, 0]))
  for (const r of (await c.query(`select dap_an, count(*)::int n from ${TBL} where xoa_at is null group by 1`)).rows) phanBo[r.dap_an] = r.n
  const mau = (await c.query(`
    select f.ma_cau, q.noi_dung, f.lua_chon, f.dap_an from ${TBL} f join dai_cau_hoi q on q.ma_cau = f.ma_cau
    where f.xoa_at is null and f.da_duyet and q.dang_chinh = any($1) order by f.duyet_at desc limit 2`, [dangs])).rows
  const out = { sinh_luc: new Date().toISOString(), dangs, rule: await rules(), phan_bo_dap_an_hien_co: phanBo, mau, cau }
  const f = opt('--out')
  if (f) { writeFileSync(f, JSON.stringify(out, null, 1), 'utf8'); console.log(`→ ${f}`) } else console.log(JSON.stringify(out, null, 1))
  console.error(`\nLô: ${cau.length} câu (còn ${Math.max(0, rows.length - bo.length - cau.length)} chưa lấy) · phân bố đúng hiện có: ${JSON.stringify(phanBo)}`)
  if (bo.length) { console.error(`BỎ ${bo.length} câu KHÔNG parse được đáp số (sửa đáp số kho qua UI rồi chạy lại):`); for (const b of bo) console.error(`  ${b.ma_cau}  "${String(b.dap_an).replace(/\s+/g, ' ').slice(0, 60)}"  → ${b.ly_do}`) }
}

// Kiểm 1 câu theo §5.3 — trả mảng lỗi (rỗng = OK). Đáp số LẤY TỪ DB (nhân chứng thứ hai), không tin file.
function kiemCau(item, dbRow, ruleMap) {
  const err = []
  if (!dbRow) return ['không có trong kho / đã có form / không thuộc pool']
  const key = parseHuuTi(dbRow.dap_an)
  if (!key.ok) return [`đáp số kho không parse được: ${key.ly_do}`]
  const lc = item.lua_chon
  if (!Array.isArray(lc) || lc.length !== 4) return ['phải đúng 4 phương án']
  const dungIdx = lc.map((x, i) => (x.dung ? i : -1)).filter((i) => i >= 0)
  if (dungIdx.length !== 1) err.push('phải đúng 1 phương án dung=true')
  if (!LETTERS.includes(item.dap_an)) err.push('dap_an phải A..D')
  else if (dungIdx.length === 1 && LETTERS[dungIdx[0]] !== item.dap_an) err.push(`dap_an=${item.dap_an} không khớp vị trí dung (${LETTERS[dungIdx[0]]})`)
  const parsed = lc.map((x) => parseHuuTi(x.text))
  parsed.forEach((p, i) => { if (!p.ok) err.push(`phương án ${LETTERS[i]} không parse được: ${p.ly_do}`) })
  if (err.length) return err
  // Đúng phải = key kho
  const pd = parsed[dungIdx[0]]
  if (pd.canon !== key.canon) err.push(`phương án đúng (${pd.canon}) ≠ đáp số kho (${key.canon})`)
  // Khác nhau đôi một theo GIÁ TRỊ
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (parsed[i].canon === parsed[j].canon) err.push(`${LETTERS[i]} và ${LETTERS[j]} cùng giá trị ${parsed[i].canon}`)
  // Cùng hình thức
  // Cùng hình thức. Ngoại lệ (spec §5.2 rule 3): đáp án là TẬP (x² = k) thì distractor "thiếu nghiệm" (R21) là 1 giá trị —
  // cho phép tối đa 2 phương án đơn, còn lại phải là tập (để không loại trừ bằng mắt).
  // Luật (nới 08/09 đêm, sau khi máy sinh 462 câu): hình thức của ĐÁP ÁN ĐÚNG phải xuất hiện ≥2 lần trong 4 phương án —
  // đáp án đúng không được là "cái duy nhất khác kiểu" (HS loại trừ bằng mắt). Distractor khác kiểu (số nguyên giữa
  // các phân số) được phép — kiểu lạ là distractor thì HS loại nó cũng vô hại. Tập: tối đa 2 phương án đơn.
  const ht = lc.map((x) => hinhThuc(x.text))
  const htDung = ht[dungIdx[0]]
  if (ht.filter((h) => h === htDung).length < 2) err.push(`đáp án đúng là hình thức duy nhất (${htDung}) giữa ${ht.join('/')}`)
  if (htDung === 'tap' && ht.filter((h) => h !== 'tap').length > 2) err.push(`đáp án là tập nhưng >2 phương án đơn: ${ht.join('/')}`)
  // Rule: tồn tại, khác nhau, ≤1 dự phòng
  const rs = lc.filter((x) => !x.dung).map((x) => x.rule)
  rs.forEach((r, i) => { if (!r || !ruleMap.has(r)) err.push(`distractor ${i + 1} thiếu rule / rule không tồn tại (${r})`) })
  if (new Set(rs).size !== rs.length) err.push(`3 distractor phải 3 rule khác nhau (${rs.join(',')})`)
  if (rs.filter((r) => ruleMap.get(r)?.du_phong).length > 1) err.push('quá 1 rule dự phòng')
  lc.filter((x) => !x.dung).forEach((x, i) => { if (!x.duong_sai || String(x.duong_sai).trim().length < 8) err.push(`distractor ${i + 1} thiếu duong_sai`) })
  return err
}

async function verify(file, quiet = false) {
  const items = JSON.parse(readFileSync(file, 'utf8'))
  const ruleMap = new Map((await rules()).map((r) => [r.ma, r]))
  const mas = items.map((x) => x.ma_cau)
  const { rows } = await c.query(`
    select q.ma_cau, q.dap_an from dai_cau_hoi q
    where q.ma_cau = any($1) and q.xoa_at is null and q.lua_chon is null and q.menh_de is null
      and not exists (select 1 from ${TBL} f where f.ma_cau = q.ma_cau and f.xoa_at is null)`, [mas])
  const db = new Map(rows.map((r) => [r.ma_cau, r]))
  let ok = 0, fail = 0, boN = 0
  const pass = [], phanBo = Object.fromEntries(LETTERS.map((l) => [l, 0]))
  for (const it of items) {
    if (it.bo) { boN++; if (!quiet) console.log(`BỎ   ${it.ma_cau}  ${it.bo}`); continue }
    const err = kiemCau(it, db.get(it.ma_cau), ruleMap)
    if (err.length) { fail++; console.log(`FAIL ${it.ma_cau}\n  - ${err.join('\n  - ')}`) }
    else { ok++; pass.push(it); phanBo[it.dap_an]++; if (!quiet) console.log(`OK   ${it.ma_cau}  đúng=${it.dap_an}  rule=${it.lua_chon.filter((x) => !x.dung).map((x) => x.rule).join(',')}`) }
  }
  const max = Math.max(...Object.values(phanBo)), tong = Object.values(phanBo).reduce((a, b) => a + b, 0)
  const lech = tong >= 8 && max / tong > 0.4
  console.log(`\n${ok} OK · ${fail} FAIL · ${boN} bỏ · phân bố đúng ${JSON.stringify(phanBo)}${lech ? '  ⚠ LỆCH >40% — cân lại vị trí đúng' : ''}`)
  return { pass, fail: fail + (lech ? 1 : 0) }
}

async function ghi(file) {
  const model = opt('--model', 'claude-fable-5-1')
  const { pass, fail } = await verify(file, true)
  if (fail) { console.error('\n✖ Có câu FAIL hoặc phân bố lệch — sửa file rồi chạy lại. KHÔNG ghi.'); process.exitCode = 1; return }
  let n = 0, skip = 0
  for (const it of pass) {
    const { rows } = await c.query('select dap_an from dai_cau_hoi where ma_cau = $1', [it.ma_cau])
    const key = parseHuuTi(rows[0]?.dap_an ?? '')
    await c.query('begin')
    try {
      const r = await c.query(`
        insert into ${TBL} (ma_cau, lua_chon, dap_an, key_gia_tri, nguon, ai_model)
        select $1, $2::jsonb, $3, $4, 'ai', $5
        where not exists (select 1 from ${TBL} f where f.ma_cau = $1 and f.xoa_at is null)
        returning id`, [it.ma_cau, JSON.stringify(it.lua_chon), it.dap_an, key.canon, model])
      await c.query('commit')
      if (r.rowCount) n++; else skip++
    } catch (e) { await c.query('rollback'); console.error(`✖ ${it.ma_cau}: ${e.message}`); process.exitCode = 1 }
  }
  console.log(`\nĐã ghi ${n} form (da_duyet=false) · bỏ qua ${skip} câu đã có form.`)
}
