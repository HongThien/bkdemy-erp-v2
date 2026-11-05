// Chốt số liệu báo cáo HỌC KÌ cho mọi em đang học Toán / KHTN (Thùy 05/11: "snap luôn, không tính lại realtime").
// Gọi fn_bc_ky_chot_hs từng em (đóng vai admin để chot_boi đúng người), lần lượt — mỗi lời gọi tính cả khối nên nặng:
// CHẠY NGOÀI 17–22h (giờ HS chơi). Em đã chốt sẽ được chốt lại (bản cũ vào bc_ky_so_lieu_log).
//   node scripts/bao-cao-ky/chot-so-lieu.mjs [ky_id] [--thu]      (--thu = chỉ đếm, không ghi)
import pg from 'pg'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf8')
const url = (process.env.DATABASE_URL_RW || env.match(/^DATABASE_URL=(.*)$/m)?.[1] || '').trim()
const thu = process.argv.includes('--thu')
const kyArg = process.argv.slice(2).find((a) => !a.startsWith('--'))
const c = new pg.Client({ connectionString: url })
await c.connect()
const gio = (new Date().getUTCHours() + 7) % 24
if (gio >= 17 && gio < 22 && !thu) { console.log(`Đang ${gio}h — giờ HS chơi, không chạy. Chạy lại sau 22h.`); process.exit(1) }

const ky = kyArg
  ? (await c.query(`select id, ten from ky_hoc where id = $1`, [kyArg])).rows[0]
  : (await c.query(`select id, ten from ky_hoc order by den_thang desc, created_at desc limit 1`)).rows[0]
if (!ky) throw new Error('Không có kì')
const admin = (await c.query(`select t.id from nhan_su n join tai_khoan t on t.nhan_su_id = n.id where n.la_admin_he_thong order by n.ho_ten limit 1`)).rows[0]
const ds = (await c.query(`
  select distinct hl.hoc_sinh_id, l.mon
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.trang_thai = 'dang_hoc' and l.mon in ('Toán', 'KHTN')
   order by l.mon, hl.hoc_sinh_id`)).rows
console.log(`Kì "${ky.ten}" — ${ds.length} cặp (em × môn)${thu ? ' — CHẠY THỬ, không ghi' : ''}`)
if (thu) process.exit(0)

let ok = 0, loi = 0
const t0 = Date.now()
for (const [i, r] of ds.entries()) {
  try {
    await c.query('begin')
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: admin.id, role: 'authenticated' })])
    await c.query(`select public.fn_bc_ky_chot_hs($1, $2, $3)`, [r.hoc_sinh_id, r.mon, ky.id])
    await c.query('commit'); ok++
  } catch (e) { await c.query('rollback'); loi++; console.log('LỖI', r.hoc_sinh_id, r.mon, e.message) }
  if ((i + 1) % 25 === 0) console.log(`${i + 1}/${ds.length} · ${Math.round((Date.now() - t0) / 1000)}s`)
}
const n = (await c.query(`select count(*) from bc_ky_so_lieu where ky_id = $1`, [ky.id])).rows[0].count
console.log(`XONG: chốt ${ok} · lỗi ${loi} · bc_ky_so_lieu có ${n} dòng cho kì · ${Math.round((Date.now() - t0) / 1000)}s`)
await c.end()
