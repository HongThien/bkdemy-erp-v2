// Gán 27 câu GỐC của sách (CĐ13 Trung bình cộng) vào 12 dạng bài của chuyên đề NCH00516 — bản đồ mới 4T.
//   node scripts/kho/ban-do-4t-tbc-gan.mjs [--ghi]     (mặc định chạy thử rồi ROLLBACK)
// Hai người xếp ĐỘC LẬP (Opus + Sonnet mù, kho-rules/dai/lo/b3/k4T-tbc/): 27/27 cùng dạng. Mức chắc: cả hai nói 'cao' ⇒ ghi dai_bdm_gan_cau
// (nguon 'ai'); BẤT KỲ bên nào nói 'vừa' ⇒ chỉ vào dai_bdm_de_xuat chờ người duyệt. Không đè câu đã có gán/đề xuất (nguon 'nguoi' giữ nguyên).
import { readFileSync } from 'node:fs'
import pg from 'pg'
const GHI = process.argv.includes('--ghi')
const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const sonnet = JSON.parse(readFileSync('kho-rules/dai/lo/b3/k4T-tbc/lo-01.out.json', 'utf8'))
const mine = JSON.parse(readFileSync(process.argv.find((a) => a.endsWith('mine.json')) ?? 'mine.json', 'utf8'))
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
try {
  await db.query('begin')
  const hop = new Set((await db.query(`select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chuyen_de_id = 'NCH00516'`)).rows.map((r) => r.id))
  const gan = [], dx = []
  for (const s of sonnet) {
    const m = mine[s.ma_cau]
    if (!m || m[0] !== s.dang_bai_id) throw new Error(`${s.ma_cau}: hai bên lệch dạng — dừng`)
    if (!hop.has(s.dang_bai_id)) throw new Error(`${s.ma_cau}: dạng ${s.dang_bai_id} không thuộc chuyên đề TBC`)
    ;(m[1] === 'cao' && s.chac === 'cao' ? gan : dx).push(s)
  }
  const co = new Set((await db.query(`select ma_cau from dai_bdm_gan_cau where ma_cau = any($1) union select ma_cau from dai_bdm_de_xuat where ma_cau = any($1)`, [sonnet.map((s) => s.ma_cau)])).rows.map((r) => r.ma_cau))
  let g = 0, d = 0
  for (const s of gan) if (!co.has(s.ma_cau)) { await db.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')`, [s.ma_cau, s.dang_bai_id]); g++ }
  for (const s of dx) if (!co.has(s.ma_cau)) { await db.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'vua', $3, 'ai')`, [s.ma_cau, s.dang_bai_id, s.ly_do || 'hai bên chưa thống nhất mức chắc'])
    d++ }
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ', `· gán thẳng ${g} · đề xuất ${d} · đã có sẵn ${co.size}`)
  console.table(Object.entries([...gan].reduce((a, s) => ((a[s.dang_bai_id] = (a[s.dang_bai_id] || 0) + 1), a), {})).map(([k, v]) => ({ dang: k, so_cau: v })))
  console.log('đề xuất:', dx.map((s) => `${s.ma_cau}→${s.dang_bai_id}`).join(', '))
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('✘', e.message); process.exitCode = 1 } finally { await db.end() }
