// tao-ban-do.mjs — TẠO bản đồ mới K11 chủ đề "Giới hạn. Hàm số liên tục" (CEO chốt 19/10: "Chốt bản đồ ver này, tạo luôn trực tiếp trên bản đồ mới").
//   node kho-rules/dai/lo/k11/gioi-han/tao-ban-do.mjs          → chạy thử trong transaction rồi ROLLBACK, in số liệu + 8 dòng mẫu
//   node kho-rules/dai/lo/k11/gioi-han/tao-ban-do.mjs --ghi    → ghi thật + lưu mã vào <LV>/gh-ids.json (để trạm soạn lý thuyết / ví dụ dùng)
// Chỉ THÊM dòng mới (không sửa / xoá gì có sẵn). Tên + mô tả viết chữ thường có ký hiệu Unicode (không LaTeX) vì màn bản đồ hiện chữ thô.
import pg from 'pg'
import { writeFileSync, mkdirSync } from 'node:fs'
import { CD } from './du-lieu.mjs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const LV = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k11'

const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', n: 'ⁿ' }
/** TeX nhẹ → chữ thường: chỉ xử lý các mẫu có trong du-lieu.mjs; còn sót `\` hoặc `{}` ⇒ báo lỗi để sửa tay */
export function plain(s) {
  let t = String(s).replace(/\$/g, '').replace(/\{,\}/g, ',')
  t = t.replace(/\\dfrac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)').replace(/\\dfrac(\d)(\d)/g, '$1/$2').replace(/\\dfrac\\infty\\infty/g, '∞/∞').replace(/\\dfrac L0/g, 'L/0').replace(/\\dfrac1\{([^{}]+)\}/g, '1/$1')
  t = t.replace(/\\mathbb R/g, 'ℝ').replace(/\\lim/g, 'lim').replace(/\\infty/g, '∞').replace(/\\pm/g, '±').replace(/\\to/g, '→').replace(/\\cdot/g, '·').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥').replace(/\\ne\b/g, '≠').replace(/\\dots/g, '…').replace(/\\sqrt\[3\]\{([^{}]+)\}/g, '∛($1)').replace(/\\sqrt\{([^{}]+)\}/g, '√($1)').replace(/\\sqrt\s*(\w)/g, '√$1')
  t = t.replace(/\^\{?([0-4n])\}?(?![0-9a-z])/g, (_, k) => SUP[k]).replace(/\^\{([^{}]+)\}/g, '^($1)').replace(/_\{([^{}]+)\}/g, '_$1').replace(/\\left|\\right/g, '').replace(/\\,/g, ' ')
  t = t.replace(/\(\(([^()]+)\)\)/g, '($1)').replace(/\(([A-Za-z0-9ⁿ²³]{1,6})\)\/\(([A-Za-z0-9ⁿ²³]{1,6})\)/g, '$1/$2').replace(/\s+/g, ' ').trim()
  return t
}
export const conTeX = (t) => /\\|[{}]/.test(t)

const dem = { cd: 0, nhom: 0, dang: 0 }
const ten = (s) => plain(s)
const loi = []
for (const c of CD) for (const n of c.nhom) {
  for (const [lbl, v] of [['nhóm', n.ten], ...n.dang.flatMap((d) => [['dạng', d[0]], ['mô tả', d[1]]])]) if (conTeX(plain(v))) loi.push(`${lbl}: ${plain(v)}`)
}
if (loi.length) { console.error('Còn TeX chưa đổi được — sửa plain() hoặc dữ liệu:\n  ' + loi.join('\n  ')); process.exit(3) }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const co = (await c.query(`select id from dai_bdm_chu_de where khoi='11' and ten='Giới hạn. Hàm số liên tục'`)).rows
  if (co.length) throw new Error('đã có chủ đề này (' + co[0].id + ') — không tạo lại')
  const tt = ((await c.query(`select coalesce(max(thu_tu),0)+1 n from dai_bdm_chu_de where khoi='11'`)).rows[0].n)
  const cdId = (await c.query(`insert into dai_bdm_chu_de (khoi, ten, thu_tu, nhanh) values ('11', 'Giới hạn. Hàm số liên tục', $1, 'toan') returning id`, [tt])).rows[0].id
  dem.cd++
  const ids = { chu_de: cdId, chuyen_de: [] }
  let i = 0
  for (const ch of CD) {
    i++
    const chId = (await c.query(`insert into dai_bdm_chuyen_de (ten) values ($1) returning id`, [ten(ch.ten)])).rows[0].id
    await c.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values ($1, $2, $3)`, [cdId, chId, i])
    const E = { id: chId, ten: ten(ch.ten), nhom: [] }
    let j = 0
    for (const n of ch.nhom) {
      j++
      const nId = (await c.query(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, thu_tu) values ($1, $2, $3, $4) returning id`, [cdId, chId, ten(n.ten), j])).rows[0].id
      dem.nhom++
      const N = { id: nId, ten: ten(n.ten), dang: [] }
      let k = 0
      for (const d of n.dang) {
        k++
        const dId = (await c.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu) values ($1, $2, $3, $4) returning id`, [nId, ten(d[0]), plain(d[1]), k])).rows[0].id
        dem.dang++
        N.dang.push({ id: dId, ten: ten(d[0]), mo_ta: plain(d[1]), nguon: d[2], de: d[3] ?? [] })
      }
      E.nhom.push(N)
    }
    ids.chuyen_de.push(E)
  }
  console.log(`${GHI ? 'GHI THẬT' : 'CHẠY THỬ (sẽ ROLLBACK)'} — chủ đề ${dem.cd} (thứ tự ${tt}) · chuyên đề ${CD.length} · nhóm ${dem.nhom} · dạng ${dem.dang}`)
  for (const e of ids.chuyen_de.slice(0, 1)) for (const n of e.nhom.slice(0, 2)) { console.log(`  ${n.id} ${n.ten}`); for (const d of n.dang.slice(0, 2)) console.log(`     ${d.id} ${d.ten} — ${d.mo_ta}`) }
  if (GHI) { mkdirSync(LV, { recursive: true }); writeFileSync(`${LV}/gh-ids.json`, JSON.stringify(ids, null, 1)) }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ Đã ghi — mã ở ' + LV + '/gh-ids.json' : 'Đã ROLLBACK — DB không đổi. Thêm --ghi để ghi thật.')
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI:', e.message); process.exitCode = 1 } finally { await c.end() }
