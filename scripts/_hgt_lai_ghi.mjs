// Ghi kết quả KHỚP LẠI kho HGT (cặp với _hgt_lai_xuat.mjs). Chỉ động vào dòng nguon='ai' / đề xuất; KHÔNG đụng gán của NGƯỜI.
//   node scripts/_hgt_lai_ghi.mjs <thu-muc> <khoi> [--ghi]   (mặc định chạy thử rồi ROLLBACK)
// cao → hgt_bdm_gan_cau(ai) · vua → hgt_bdm_de_xuat · trống → hgt_bdm_cau_thieu_dang(ai, chủ đề hgt của khối)
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')

const [thuMuc, khoi] = process.argv.slice(2)
const GHI = process.argv.includes('--ghi')
if (!thuMuc || !khoi) { console.error('Dùng: node scripts/_hgt_lai_ghi.mjs <thu-muc> <khoi> [--ghi]'); process.exit(2) }

const kq = [], loi = []
for (const f of fs.readdirSync(thuMuc).filter((x) => /^lo-\d+\.json$/.test(x)).sort()) {
  const lo = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8'))
  const fo = path.join(thuMuc, f.replace('.json', '.out.json'))
  if (!fs.existsSync(fo)) { loi.push(`${f}: chưa có out`); continue }
  const out = new Map(JSON.parse(fs.readFileSync(fo, 'utf8')).map((r) => [r.ma_cau, r]))
  for (const l of lo) {
    const r = out.get(l.ma_cau)
    if (!r) { loi.push(`${f}: thiếu ${l.ma_cau}`); continue }
    if (r.dang_bai_id && !['cao', 'vua'].includes(r.chac)) { loi.push(`${f}: ${l.ma_cau} chac lạ "${r.chac}"`); continue }
    kq.push({ ma_cau: l.ma_cau, cu: l.hien_tai, db: r.dang_bai_id || null, chac: r.dang_bai_id ? r.chac : null, ly_do: String(r.ly_do || '').slice(0, 400) })
  }
}
console.log('đọc', kq.length, 'câu · lỗi', loi.length); loi.slice(0, 15).forEach((x) => console.log('  ', x))
if (loi.length) process.exit(1)
const cao = kq.filter((r) => r.chac === 'cao'), vua = kq.filter((r) => r.chac === 'vua'), trong = kq.filter((r) => !r.db)
console.log(`cao ${cao.length} · vua ${vua.length} · trống ${trong.length}`)
const doi = kq.filter((r) => r.db && !String(r.cu).startsWith(r.db + ' ('))
console.log('đổi dạng so với hiện tại:', doi.length)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const cde = (await c.query(`select id from dai_bdm_chu_de where khoi = $1 and nhanh = 'hgt' order by thu_tu`, [khoi])).rows.map((r) => r.id)
  if (cde.length !== 1) throw new Error('khối ' + khoi + ' có ' + cde.length + ' chủ đề hgt — cần 1')
  const dangOk = new Set((await c.query(`select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = $1`, [cde[0]])).rows.map((r) => r.id))
  for (const r of kq) if (r.db && !dangOk.has(r.db)) throw new Error('dạng ' + r.db + ' không thuộc chủ đề hgt khối ' + khoi)
  const nguoi = new Set((await c.query(`select ma_cau from hgt_bdm_gan_cau where nguon = 'nguoi'`)).rows.map((r) => r.ma_cau))
  const ids = kq.map((r) => r.ma_cau)
  let ghi = 0, bo = 0
  for (const r of kq) {
    if (nguoi.has(r.ma_cau)) { bo++; continue }
    await c.query(`delete from hgt_bdm_gan_cau where ma_cau = $1 and nguon = 'ai'`, [r.ma_cau])
    await c.query(`delete from hgt_bdm_de_xuat where ma_cau = $1`, [r.ma_cau])
    await c.query(`delete from hgt_bdm_cau_thieu_dang where ma_cau = $1 and nguon = 'ai'`, [r.ma_cau])
    if (r.chac === 'cao') await c.query(`insert into hgt_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')`, [r.ma_cau, r.db])
    else if (r.chac === 'vua') await c.query(`insert into hgt_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'vua', $3, 'ai')`, [r.ma_cau, r.db, r.ly_do])
    else await c.query(`insert into hgt_bdm_cau_thieu_dang (ma_cau, chu_de_id, ly_do, nguon) values ($1, $2, $3, 'ai')`, [r.ma_cau, cde[0], r.ly_do || '(không ghi lý do)'])
    ghi++
  }
  console.log({ ghi, bo_vi_nguoi_gan: bo, tong: ids.length })
  if (GHI) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK (chạy thử)') }
} catch (e) { await c.query('rollback'); console.error('LỖI ⇒ rollback:', e.message); process.exit(1) }
await c.end()
