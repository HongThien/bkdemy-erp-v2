// ghi.mjs — Thùy 16/11: đưa bài "chứng minh chia hết" (ảnh) + 10 bài clone vào dạng NDB03054 "Bài toán về chia hết"
//   (khối 8 · chủ đề NCD00155 Phân tích đa thức thành nhân tử · chuyên đề "Các bài toán nâng cao về PTĐTTNT").
// Luồng bổ sung bài lẻ (spec-giai-bai.md §C11): dạng do người chỉ định ⇒ gán 'nguoi'; kho về nhà (dai_cau_hoi); Thùy 16/11 "tự duyệt luôn" ⇒ duyệt cả 11 câu sau khi trạm kiểm ĐẠT.
// Đề trong ảnh ($n^3-16n$ chia hết cho 48, n chẵn) SAI (n = 2 cho -24) ⇒ bài gốc ghi bản đã sửa $n^3-4n$, lý do sửa ghi ở kiem_may_ghi + ten_de_goc.
//   node kho-rules/dai/lo/k8/bai-le-chia-het-1611/ghi.mjs          → cổng khuôn + chạy thử (ROLLBACK)
//   node kho-rules/dai/lo/k8/bai-le-chia-het-1611/ghi.mjs --ghi    → ghi thật, MỘT transaction
import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'
import katex from 'katex'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'

const D = 'kho-rules/dai/lo/k8/bai-le-chia-het-1611/'
const GHI = process.argv.includes('--ghi')
const DANG = 'NDB03054'
const loi = (s) => { console.error('✘', s); process.exit(2) }

// Đề cố định (đã kiểm máy ở kiem-menh-de.mjs) — tệp soạn phải chép y nguyên.
const DE = {
  G: String.raw`Chứng minh rằng $n^3-4n\ \vdots\ 48$ với $n$ là số nguyên chẵn.`,
  C1: String.raw`Chứng minh rằng $n^3+20n\ \vdots\ 48$ với $n$ là số nguyên chẵn.`,
  C2: String.raw`Chứng minh rằng $n^3-n\ \vdots\ 24$ với $n$ là số nguyên lẻ.`,
  C3: String.raw`Chứng minh rằng $n^3+3n^2-n-3\ \vdots\ 48$ với $n$ là số nguyên lẻ.`,
  C4: String.raw`Chứng minh rằng $n^4-4n^3-4n^2+16n\ \vdots\ 384$ với $n$ là số nguyên chẵn.`,
  C5: String.raw`Chứng minh rằng $n^3-16n\ \vdots\ 384$ với $n$ là số nguyên chia hết cho $4$.`,
  C6: String.raw`Chứng minh rằng $n^5-5n^3+4n\ \vdots\ 120$ với mọi số nguyên $n$.`,
  C7: String.raw`Chứng minh rằng $n^3+3n^2+2n\ \vdots\ 6$ với mọi số nguyên $n$.`,
  C8: String.raw`Chứng minh rằng $n^3-13n\ \vdots\ 6$ với mọi số nguyên $n$.`,
  C9: String.raw`Chứng minh rằng $(n^2+n-1)^2-1\ \vdots\ 24$ với mọi số nguyên $n$.`,
  C10: String.raw`Chứng minh rằng $n^2+4n+3\ \vdots\ 8$ với $n$ là số nguyên lẻ.`,
}
const THU_TU = Object.keys(DE)

// ── đọc tệp soạn + cổng khuôn
const txt = readFileSync(D + 'bai.soan.md', 'utf8').replace(/\r\n/g, '\n')
const khoi = txt.split(/^### /m).slice(1)
const bai = new Map()
for (const k of khoi) {
  const ma = k.slice(0, k.indexOf('\n')).trim()
  const than = k.slice(k.indexOf('\n') + 1).trim()
  if (bai.has(ma)) loi(`trùng mã ${ma}`)
  const iP1 = than.indexOf('**Phần 1. Hướng dẫn**'), iP2 = than.indexOf('**Phần 2. Trình bày**')
  if (!than.startsWith('**Đề:**') || iP1 < 0 || iP2 < iP1) loi(`${ma}: thiếu Đề / Phần 1 / Phần 2 hoặc sai thứ tự`)
  const de = than.slice('**Đề:**'.length, iP1).trim()
  const loiGiai = than.slice(iP1).trim()
  if (de !== DE[ma]) loi(`${ma}: đề trong tệp soạn khác đề cố định\n  soạn: ${de}\n  chuẩn: ${DE[ma]}`)
  if (/\*\*Chưa chắc:\*\*/.test(than)) loi(`${ma}: có cờ Chưa chắc — xử lý trước khi ghi`)
  if (/\n\n\n/.test(loiGiai)) loi(`${ma}: có hai dòng trống liền nhau`)
  if (/\\times|\\left|\\right|\\frac\{|\\\(|\\equiv|\\pmod/.test(loiGiai)) loi(`${ma}: có lệnh LaTeX bị cấm (\\times, \\left, \\frac, \\(, đồng dư)`)
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(loiGiai)) loi(`${ma}: có ký tự điều khiển`)
  if (!/\*\*Mấu chốt:\*\*/.test(loiGiai)) loi(`${ma}: thiếu Mấu chốt`)
  const soBuoc = (loiGiai.slice(0, loiGiai.indexOf('**Phần 2. Trình bày**')).match(/\*\*Bước \d+\.\*\*/g) ?? []).length
  if (soBuoc < 3 || soBuoc > 6) loi(`${ma}: Phần 1 có ${soBuoc} bước (cần 3–6)`)
  if ((loiGiai.match(/\$/g) ?? []).length % 2) loi(`${ma}: số dấu $ lẻ`)
  for (const m of loiGiai.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch { loi(`${ma}: KaTeX không dựng được: ${m[1].slice(0, 80)}`) }
  }
  if (!/Vậy /.test(loiGiai.slice(loiGiai.indexOf('**Phần 2. Trình bày**')))) loi(`${ma}: Phần 2 thiếu dòng kết "Vậy …"`)
  bai.set(ma, { de, loiGiai })
}
for (const ma of THU_TU) if (!bai.has(ma)) loi(`thiếu bài ${ma}`)
if (bai.size !== THU_TU.length) loi(`tệp soạn có ${bai.size} bài, cần ${THU_TU.length}`)
console.log(`✔ cổng khuôn: ${bai.size} bài`)

// ── dựng lô
const MODEL = 'claude-sonnet-5-5' // trạm soạn; trạm giải mù + soát: Opus (biên bản bai.kiem.md)
const L = (ma, extra = {}) => ({
  khoi: '8', loai_cau: 'tu_luan', noi_dung: bai.get(ma).de, dap_an: null, loi_giai: bai.get(ma).loiGiai,
  dang_bai: DANG, dang_bai_chot: true, nguon: 'clone', nguon_giai: 'ai', giai_method: 'claude_code', ai_model: MODEL, ten_de_goc: null, ...extra,
})
const NGHI_GOC = 'Đề gốc (ảnh Thùy gửi 16/11) in "$n^3-16n$ chia hết cho 48 với n là số chẵn" — SAI: n = 2 cho $-24$ (n chẵn chỉ bảo đảm chia hết cho 24). ' +
  'Đã sửa hệ số 16 thành 4 để có mệnh đề đúng gần nhất $n^3-4n$ chia hết cho 48.'
const lo = [
  L('G', { nguon: 'le', ten_de_goc: 'Thùy gửi 16/11/2026 (ảnh) — đề in $n^3-16n$ chia hết cho 48 (sai), đã sửa thành $n^3-4n$' }),
  ...THU_TU.slice(1).map((ma) => L(ma)),
]

process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  await c.query(`set local statement_timeout='60s'`)
  const { rows: [d] } = await c.query(
    `select d.id, d.ten, cd.khoi, cd.id cd from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where d.id=$1`, [DANG])
  if (!d || d.khoi !== '8' || d.cd !== 'NCD00155' || d.ten !== 'Bài toán về chia hết') throw new Error('dạng đích không như lúc dò: ' + JSON.stringify(d))
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList: lo })
  if (r.trung.length) throw new Error('có câu trùng kho: ' + JSON.stringify(r.trung))
  if (r.bdm.gan !== lo.length) throw new Error(`gán dạng ${r.bdm.gan}/${lo.length}`)
  const [goc, ...cl] = r.maCauList
  for (const ma of cl) {
    await c.query(
      `update dai_cau_hoi set parent_ma_cau=$2, clone_method='claude_may_sinh', kiem_may='khop', kiem_may_boi='claude_code', kiem_may_at=now(), kiem_may_ghi=$3 where ma_cau=$1`,
      [ma, goc, 'Mệnh đề chia hết kiểm máy: quét n nguyên trên [-3000; 3000] (kiem-menh-de.mjs); các đẳng thức biến đổi kiểm BigInt; lời giải qua trạm giải mù + soát.'])
  }
  const KIEM = 'Mệnh đề chia hết kiểm máy: quét n nguyên trên [-3000; 3000] (kiem-menh-de.mjs); các đẳng thức biến đổi kiểm BigInt; lời giải qua trạm giải mù + soát (bai.kiem.md).'
  await c.query(`update dai_cau_hoi set kiem_may='khop', kiem_may_boi='claude_code', kiem_may_at=now(), kiem_may_ghi=$2 where ma_cau=$1`, [goc, NGHI_GOC + ' ' + KIEM])
  // Thùy 16/11 "tự duyệt luôn": biên bản trạm kiểm phải ĐẠT rồi mới duyệt cả 11 câu.
  if (!readFileSync(D + 'bai.kiem.md', 'utf8').startsWith('KẾT LUẬN: ĐẠT')) throw new Error('bai.kiem.md chưa có KẾT LUẬN: ĐẠT')
  await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau = any($1::text[])`, [r.maCauList])
  const { rows } = await c.query(
    `select q.ma_cau, q.dang_chinh, q.nguon, q.nguon_loai, q.nguon_giai, q.giai_method, q.clone_method, q.parent_ma_cau, q.da_duyet, q.kiem_may, g.dang_bai_id, g.nguon gan_nguon, left(q.noi_dung, 60) nd
       from dai_cau_hoi q left join dai_bdm_gan_cau g on g.ma_cau=q.ma_cau where q.ma_cau = any($1::text[]) order by q.ma_cau`, [r.maCauList])
  console.table(rows)
  if (rows.length !== lo.length || rows.some((x) => x.dang_bai_id !== DANG || !x.da_duyet || x.kiem_may !== 'khop')) throw new Error('kiểm sau ghi không đạt')
  if (GHI) {
    await c.query('commit')
    writeFileSync(D + 'ma-cau.json', JSON.stringify({ dang: DANG, goc, clone: cl }, null, 1) + '\n')
    console.log('✔ ĐÃ GHI', goc, '+', cl.length, 'clone')
  } else { await c.query('rollback'); console.log('✔ chạy thử xong (ROLLBACK) — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
