// B3 Khớp cho kho HGT — GHI kết quả máy khớp. Cặp với bdm-b3-hgt-xuat-lo.mjs.
//   node scripts/bdm-b3-hgt-ghi.mjs <thu-muc> <khoi> [--khong-gan] [--ghi]     (mặc định: chạy thử rồi ROLLBACK)
//   --khong-gan (luật Thùy 20/10 "đề xuất trước, ghi sau"): mức cao cũng chỉ vào hgt_bdm_de_xuat (chac 'cao'), không ghi gan_cau
// Đọc <thu-muc>/lo-NN.json + out-NN.json (out = [{ma_cau, dang_bai_id|null, chac:'cao'|'vua'|null, ly_do}]) ⇒
//   chac='cao' → hgt_bdm_gan_cau (nguon='ai') · chac='vua' → hgt_bdm_de_xuat · dang_bai_id=null → hgt_bdm_cau_thieu_dang
// Chỉ ghi câu CHƯA có dòng ở cả ba bảng (không đè gán của người/AI trước), câu còn sống, dạng bài tồn tại.
// Trong 1 transaction; lệch số dòng ⇒ ROLLBACK. Sau --ghi nên đọc lại bằng kết nối riêng (đừng tin dòng "ĐÃ GHI").
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import { bien } from './kho/cau-hinh.mjs'

const [thuMuc, khoi] = process.argv.slice(2)
const GHI = process.argv.includes('--ghi')
const KHONG_GAN = process.argv.includes('--khong-gan')
if (!thuMuc || !khoi) { console.error('Dùng: node scripts/bdm-b3-hgt-ghi.mjs <thu-muc> <khoi> [--ghi]'); process.exit(2) }

const kq = []
const loi = []
for (const f of fs.readdirSync(thuMuc).filter((x) => /^lo-\d+\.json$/.test(x)).sort()) {
  const lo = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8'))
  const fo = path.join(thuMuc, f.replace('lo-', 'out-'))
  if (!fs.existsSync(fo)) { loi.push(`${f}: chưa có ${path.basename(fo)}`); continue }
  const out = new Map(JSON.parse(fs.readFileSync(fo, 'utf8')).map((r) => [r.ma_cau, r]))
  for (const l of lo) {
    const r = out.get(l.ma_cau)
    if (!r) { loi.push(`${f}: thiếu ${l.ma_cau}`); continue }
    if (r.dang_bai_id && !['cao', 'vua'].includes(r.chac)) { loi.push(`${f}: ${l.ma_cau} chac lạ "${r.chac}"`); continue }
    kq.push({ ma_cau: l.ma_cau, db: r.dang_bai_id || null, chac: r.dang_bai_id ? r.chac : null, ly_do: String(r.ly_do || '').slice(0, 400) })
  }
}
console.log('đọc', kq.length, 'câu · lỗi', loi.length)
loi.slice(0, 12).forEach((x) => console.log('  ', x))
if (loi.length) process.exit(1)

const cao = KHONG_GAN ? [] : kq.filter((r) => r.chac === 'cao'), vua = kq.filter((r) => r.chac === 'vua' || (KHONG_GAN && r.chac === 'cao')), trong = kq.filter((r) => !r.db)
console.log(`cao ${cao.length} · vua ${vua.length} · null ${trong.length}`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  // chủ đề hgt CÓ dạng bài (K9 có thêm "Hình học không gian" rỗng — 23/10)
  const cd = (await c.query(`select cd.id from dai_bdm_chu_de cd where cd.khoi = $1 and cd.nhanh = 'hgt'
     and exists (select 1 from dai_bdm_nhom n join dai_bdm_dang_bai d on d.nhom_id = n.id where n.chu_de_id = cd.id)`, [khoi])).rows
  if (cd.length !== 1) throw new Error(`khối ${khoi} có ${cd.length} chủ đề vùng hgt — cần đúng 1 để gắn "thiếu dạng"`)
  const chuDe = cd[0].id
  const hopLe = new Set((await c.query(`select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = $1`, [chuDe])).rows.map((r) => r.id))
  const sai = kq.filter((r) => r.db && !hopLe.has(r.db))
  if (sai.length) throw new Error('dạng bài không thuộc chủ đề hgt của khối: ' + [...new Set(sai.map((r) => r.db))].slice(0, 5).join(','))
  const chua = `not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = t.ma_cau) and not exists (select 1 from hgt_bdm_de_xuat e where e.ma_cau = t.ma_cau) and not exists (select 1 from hgt_bdm_cau_thieu_dang d where d.ma_cau = t.ma_cau)`
  const chay = async (sql, cot) => { let n = 0; for (let i = 0; i < cot[0].length; i += 200) n += (await c.query(sql, cot.map((a) => a.slice(i, i + 200)))).rowCount; return n }
  const nCao = await chay(`insert into hgt_bdm_gan_cau (ma_cau, dang_bai_id, nguon) select t.ma_cau, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma_cau, db) join hgt_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null where ${chua} on conflict (ma_cau) do nothing`, [cao.map((r) => r.ma_cau), cao.map((r) => r.db)])
  const nVua = await chay(`insert into hgt_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) select t.ma_cau, t.db, t.chac, t.ly, 'ai' from unnest($1::text[], $2::text[], $3::text[], $4::text[]) t(ma_cau, db, ly, chac) join hgt_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null where ${chua} on conflict (ma_cau) do nothing`, [vua.map((r) => r.ma_cau), vua.map((r) => r.db), vua.map((r) => r.ly_do), vua.map((r) => r.chac)])
  const nTrong = await chay(`insert into hgt_bdm_cau_thieu_dang (ma_cau, chu_de_id, ly_do, nguon) select t.ma_cau, '${chuDe}', coalesce(nullif(btrim(t.ly), ''), 'AI không xếp được'), 'ai' from unnest($1::text[], $2::text[]) t(ma_cau, ly) join hgt_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null where ${chua} on conflict (ma_cau) do nothing`, [trong.map((r) => r.ma_cau), trong.map((r) => r.ly_do)])
  console.log(`chèn: gán ${nCao}/${cao.length} · đề xuất ${nVua}/${vua.length} · thiếu dạng ${nTrong}/${trong.length}`)
  if (nCao !== cao.length || nVua !== vua.length || nTrong !== trong.length) throw new Error('lệch số dòng — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT (hãy đọc lại bằng kết nối riêng)' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
