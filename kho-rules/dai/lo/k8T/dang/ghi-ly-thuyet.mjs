// ghi-ly-thuyet.mjs — ghi lý thuyết NHÓM + lý thuyết / ví dụ DẠNG (khối 8T) từ các tệp lN.out.txt do trạm soạn viết.
// Khuôn tệp:  #NHOM <id> · @LT · …  |  #DANG <id> · @LT · … · @VD · …   (LaTeX một dấu \).
// CHỈ GHI VÀO Ô TRỐNG (không đè gì có sẵn). Chặn: đoạn lý thuyết không mở bằng thẻ · ##VD thiếu "Bài giải" · \frac trần · \( \) · \text chữ Việt · lý thuyết chứa ##VD.
//   node kho-rules/dai/lo/k8T/dang/ghi-ly-thuyet.mjs <thư_mục_chứa_lN.out.txt> [--ghi]     (mặc định chạy thử ROLLBACK)
import pg from 'pg'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
process.loadEnvFile('.env')
const THU_MUC = process.argv[2]
const GHI = process.argv.includes('--ghi')
if (!THU_MUC) { console.error('Dùng: node ghi-ly-thuyet.mjs <thư mục> [--ghi]'); process.exit(2) }

const nhom = new Map(), dang = new Map(), loi = []
for (const f of readdirSync(THU_MUC).filter((x) => /^l\d+\.out\.txt$/.test(x)).sort()) {
  const dong = readFileSync(join(THU_MUC, f), 'utf8').replace(/\r/g, '').split('\n')
  let cur = null, muc = null
  const buf = { LT: [], VD: [] }
  const dong_goi = () => {
    if (!cur) return
    const lt = buf.LT.join('\n').trim(), vd = buf.VD.join('\n').trim()
    if (cur.kind === 'nhom') nhom.set(cur.id, { lt, f }); else dang.set(cur.id, { lt, vd, f })
    buf.LT = []; buf.VD = []
  }
  for (const d of dong) {
    let m
    if ((m = d.match(/^#(NHOM|DANG) (\S+)/))) { dong_goi(); cur = { kind: m[1] === 'NHOM' ? 'nhom' : 'dang', id: m[2] }; muc = null; continue }
    if (d.trim() === '@LT') { muc = 'LT'; continue }
    if (d.trim() === '@VD') { muc = 'VD'; continue }
    if (cur && muc) buf[muc].push(d)
  }
  dong_goi()
}

const TH = /^##(ĐN|ĐL|TC|CY|PP|NX)(\s|$)/
function kiemLT(ten, lt) {
  if (!lt) return loi.push(`${ten}: lý thuyết rỗng`)
  if (/##VD/.test(lt)) loi.push(`${ten}: lý thuyết có ##VD`)
  for (const kh of lt.split(/\n\s*\n/)) if (!TH.test(kh.trim())) loi.push(`${ten}: đoạn không mở bằng thẻ: «${kh.trim().slice(0, 50)}»`)
}
function kiemChung(ten, s) {
  if (/\\frac(?!\w)|\\frac\{/.test(s.replace(/\\dfrac/g, ''))) loi.push(`${ten}: dùng \\frac (phải \\dfrac)`)
  if (/\\\(|\\\)/.test(s)) loi.push(`${ten}: dùng \\( \\)`)
  if (/\\text\{[^}]*[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s)) loi.push(`${ten}: \\text chứa chữ Việt có dấu`)
  const dollar = (s.match(/(?<!\\)\$/g) || []).length
  if (dollar % 2) loi.push(`${ten}: số dấu $ lẻ`)
}
function kiemVD(ten, vd) {
  if (!vd) return loi.push(`${ten}: ví dụ rỗng`)
  const ds = vd.split(/\n(?=##VD)/).filter((x) => x.trim())
  if (!ds.length) loi.push(`${ten}: không có ##VD`)
  for (const v of ds) {
    if (!/^##VD/.test(v)) loi.push(`${ten}: ví dụ không mở bằng ##VD`)
    if (!/\n\s*(\*\*)?(Bài giải|Lời giải|Giải)(\*\*)?\s*[:.]/i.test(v)) loi.push(`${ten}: ##VD thiếu «Bài giải:»`)
  }
}
for (const [id, v] of nhom) { kiemLT('nhóm ' + id, v.lt); kiemChung('nhóm ' + id, v.lt) }
for (const [id, v] of dang) { kiemLT('dạng ' + id, v.lt); kiemChung('dạng ' + id, v.lt); kiemVD('dạng ' + id, v.vd); kiemChung('dạng ' + id + ' (ví dụ)', v.vd) }
console.log(`đọc: ${nhom.size} nhóm · ${dang.size} dạng · lỗi định dạng: ${loi.length}`)
if (loi.length) { console.log(loi.slice(0, 80).join('\n')); if (loi.length > 80) console.log('… +' + (loi.length - 80)) }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  await c.query('begin')
  const hop = new Set((await c.query(`select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='8T'`)).rows.map((r) => r.id))
  const hopN = new Set((await c.query(`select n.id from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='8T'`)).rows.map((r) => r.id))
  let n = 0, d = 0, bo = 0
  for (const [id, v] of nhom) {
    if (!hopN.has(id)) { loi.push('nhóm lạ ' + id); continue }
    if (loi.some((x) => x.startsWith('nhóm ' + id))) { bo++; continue }
    n += (await c.query(`update dai_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(ly_thuyet,'') = ''`, [id, v.lt])).rowCount
  }
  for (const [id, v] of dang) {
    if (!hop.has(id)) { loi.push('dạng lạ ' + id); continue }
    if (loi.some((x) => x.startsWith('dạng ' + id))) { bo++; continue }
    d += (await c.query(`update dai_bdm_dang_bai set ly_thuyet = case when coalesce(ly_thuyet,'')='' then $2 else ly_thuyet end, vi_du = case when coalesce(vi_du,'')='' then $3 else vi_du end, updated_at = now() where id = $1`, [id, v.lt, v.vd])).rowCount
  }
  const kiem = (await c.query(`select count(*)::int tong, count(*) filter (where coalesce(d.ly_thuyet,'')<>'')::int lt, count(*) filter (where coalesce(d.vi_du,'')<>'')::int vd
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='8T'`)).rows[0]
  console.log(`nhóm cập nhật ${n} · dạng cập nhật ${d} · bỏ vì lỗi ${bo} · sau ghi (cả khối 8T):`, kiem)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
