// B3 → B4: nạp phần "chưa chắc" + "để trống/thiếu dạng" của một khối vào kho tạm (dai_bdm_de_xuat / dai_bdm_cau_thieu_dang).
//   node scripts/bdm-b3-nap-de-xuat.mjs <ket_qua.json> [--mau <mau_kiem_dap_an.json>] [--ghi]
// Mặc định chạy thử rồi ROLLBACK. Chỉ nạp câu CHƯA có dòng ở dai_bdm_gan_cau (không đè gán đã có).
// ket_qua.json = mảng {ma_cau, dang_bai_id|null, chac:'cao'|'vua'|null, ly_do}; --mau = các câu kiểm giấu nhãn (bỏ qua).
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'

const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const f = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--mau')
const iM = args.indexOf('--mau')
const mau = iM >= 0 ? JSON.parse(readFileSync(args[iM + 1], 'utf8')) : {}
if (!f) { console.error('Dùng: node scripts/bdm-b3-nap-de-xuat.mjs <ket_qua.json> [--mau <file>] [--ghi]'); process.exit(2) }
const kq = JSON.parse(readFileSync(f, 'utf8')).filter((r) => !(r.ma_cau in mau))
const vua = kq.filter((r) => r.dang_bai_id && r.chac !== 'cao')
const trong = kq.filter((r) => !r.dang_bai_id)
console.log(`chưa chắc: ${vua.length} · để trống/thiếu dạng: ${trong.length}`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const a = await c.query(`
    insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon)
    select t.ma_cau, t.db, 'vua', t.ly, 'ai' from unnest($1::text[], $2::text[], $3::text[]) t(ma_cau, db, ly)
    join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
    join dai_bdm_dang_bai d on d.id = t.db
    where not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    on conflict (ma_cau) do nothing`, [vua.map((x) => x.ma_cau), vua.map((x) => x.dang_bai_id), vua.map((x) => x.ly_do ?? '')])
  const b = await c.query(`
    insert into dai_bdm_cau_thieu_dang (ma_cau, ly_do, nguon)
    select t.ma_cau, coalesce(nullif(btrim(t.ly), ''), 'AI không xếp được'), 'ai' from unnest($1::text[], $2::text[]) t(ma_cau, ly)
    join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
    where not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    on conflict (ma_cau) do nothing`, [trong.map((x) => x.ma_cau), trong.map((x) => x.ly_do ?? '')])
  console.log(`nạp de_xuat ${a.rowCount}/${vua.length} · thieu_dang ${b.rowCount}/${trong.length}`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
