// nhap-kho.mjs — đưa 13 câu "Chữ số tận cùng của lũy thừa" (TCLT.soan.md: 3 mẫu + 10 clone) vào Kho lớp 6, dạng T106020802.
//   node kho-rules/dai/lo/k6/tan-cung-luy-thua/nhap-kho.mjs          # chạy thử (ROLLBACK)
//   node kho-rules/dai/lo/k6/tan-cung-luy-thua/nhap-kho.mjs --ghi    # ghi thật
// Cổng 1: dung-de-tu-soan.mjs --chi-kiem. Cổng 2 (ở đây): nhân chứng độc lập — TÍNH LẠI chữ số tận cùng từ ĐỀ bằng lũy thừa mô-đun BigInt
// (số mũ chồng tính thật), so với `dap_an` và dòng "Vậy … là d." của lời giải; lệch ⇒ không ghi.
// Mẫu: nguon='le'. Clone: nguon='clone', clone_method='clone_doi_so', parent_ma_cau = bài mẫu cùng kiểu số dư. Mọi câu da_duyet=false, nguon_giai='ai'.
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'

const DANG = 'T106020802'
const GHI = process.argv.includes('--ghi')
const md = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'TCLT.soan.md'), 'utf8').replace(/\r\n/g, '\n')
const than = md.slice(0, md.search(/^## GHI CHÚ/m))

const modPow = (b, e, m) => { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n } return r }

const cau = []
for (const kc of than.split(/^(?=### )/m).slice(1)) {
  const nhan = kc.match(/^### (.+?) \| /)[1]
  const dapAn = kc.match(/dap_an=(\S+)/)[1]
  const de = kc.match(/^\*\*Đề:\*\*\s*(.+)$/m)[1].trim()
  const loiGiai = kc.slice(kc.indexOf('**Phần 1. Hướng dẫn**')).trim()
  const m = de.match(/^Tìm chữ số tận cùng của số \$(\d+)\^\{(?:(\d+)\^\{(\d+)\}|(\d+))\}\$\.$/)
  if (!m) throw new Error(`${nhan}: đề không đúng khuôn «Tìm chữ số tận cùng của số $x^{…}$.»: ${de}`)
  const x = BigInt(m[1])
  const thap = m[2] !== undefined
  const E = thap ? BigInt(m[2]) ** BigInt(m[3]) : BigInt(m[4])
  const dMay = String(modPow(x, E, 10n))
  const r = Number(E % 4n)
  const ket = loiGiai.split('\n').filter((l) => l.trim()).pop().match(/có chữ số tận cùng là (\d)\.$/)
  if (!ket) throw new Error(`${nhan}: dòng cuối lời giải phải kết bằng «có chữ số tận cùng là d.»`)
  if (dMay !== dapAn || ket[1] !== dMay) throw new Error(`${nhan}: LỆCH — máy ${dMay}, dap_an ${dapAn}, lời giải ${ket[1]}`)
  // số dư của số mũ cho 4 phải đúng với dòng "= 4k + r" / "= 4k" trong lời giải
  const kd = loiGiai.match(/=4k\+(\d)\$|=4k\$/)
  const rLG = kd ? (kd[1] ? Number(kd[1]) : 0) : null
  if (rLG !== null && rLG !== r) throw new Error(`${nhan}: LỆCH số dư — máy ${r}, lời giải ${rLG}`)
  cau.push({ nhan, r, thap, dang_chinh: DANG, khoi: '6', loai_cau: 'tra_loi_ngan', noi_dung: de, dap_an: dapAn, loi_giai: loiGiai,
    nguon: nhan.startsWith('Clone') ? 'clone' : 'le', nguon_giai: 'ai', ai_model: 'claude-sonnet-5-5',
    ten_de_goc: nhan.startsWith('Bài toán') ? 'Bài toán 1. Tìm chữ số tận cùng của lũy thừa (hướng dẫn giải mẫu)' : null })
  console.log(`  ✔ ${nhan.padEnd(12)} ${de.replace(/^Tìm chữ số tận cùng của số /, '').padEnd(20)} số mũ dư ${r} · máy: ${dMay}`)
}
if (cau.length !== 13) throw new Error(`cần 13 câu, có ${cau.length}`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList: cau.map(({ nhan, r, thap, ...q }) => q) })
  const ma = Object.fromEntries(cau.map((q, i) => [q.nhan, r.maCauList[i]]))
  const cha = (q) => (q.r === 0 ? ma['Bài toán 1b'] : q.nhan === 'Clone 10' ? ma['Bài toán 1c'] : ma['Bài toán 1a'])
  let nClone = 0
  for (const q of cau.filter((x) => x.nhan.startsWith('Clone'))) {
    await c.query(`update dai_cau_hoi set parent_ma_cau = $2, clone_method = 'clone_doi_so' where ma_cau = $1`, [ma[q.nhan], cha(q)])
    nClone++
  }
  console.log(`\n${GHI ? 'GHI THẬT' : 'CHẠY THỬ'}: mới ${r.maCauList.length - r.trung.length} · trùng câu cũ ${r.trung.length} · gắn cha cho ${nClone} clone`)
  cau.forEach((q, i) => console.log(`  ${q.nhan.padEnd(12)} → ${r.maCauList[i]}${q.nhan.startsWith('Clone') ? '  (cha ' + cha(q) + ')' : ''}${r.trung.some((t) => t.idx === i) ? '  (TRÙNG câu đã có)' : ''}`))
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
