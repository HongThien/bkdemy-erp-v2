// Chốt số liệu báo cáo HỌC KÌ cho mọi em đang học Toán / KHTN (Thùy 05/11: "snap luôn, không tính lại realtime").
// Gọi fn_bc_ky_chot_hs từng em (đóng vai admin để chot_boi đúng người), lần lượt — mỗi lời gọi tính cả khối nên nặng:
// CHẠY NGOÀI 17–22h (giờ HS chơi). Em đã chốt sẽ được chốt lại (bản cũ vào bc_ky_so_lieu_log).
//   node scripts/bao-cao-ky/chot-so-lieu.mjs [ky_id] [--thu] [--gio-hs]   (--tiep = bỏ qua em đã chốt kì này, dùng khi lượt trước đứt giữa chừng; --thu = chỉ đếm; --gio-hs = vẫn chạy trong 17–22h, nghỉ 1,5 s giữa các em)
import pg from 'pg'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf8')
const url = (process.env.DATABASE_URL_RW || env.match(/^DATABASE_URL=(.*)$/m)?.[1] || '').trim()
const thu = process.argv.includes('--thu')
const kyArg = process.argv.slice(2).find((a) => !a.startsWith('--'))
// Kết nối DB hay bị ngắt sau ~1 phút (05/11 đứt 2 lần) ⇒ đứt thì mở kết nối mới và làm lại đúng em đó (tối đa 3 lần).
let c
async function ketNoi() {
  if (c) c.end().catch(() => {})
  for (let lan = 1; ; lan++) {   // mạng chập chờn (05/11: ENOTFOUND tên máy chủ) ⇒ chờ rồi thử lại, tối đa 6 lần
    c = new pg.Client({ connectionString: url })
    c.on('error', (e) => console.log('… kết nối bị ngắt:', e.message))
    try { await c.connect(); return } catch (e) {
      if (lan >= 6) throw e
      console.log(`… chưa kết nối được (${e.message}), thử lại sau 10s`); await new Promise((r) => setTimeout(r, 10000))
    }
  }
}
await ketNoi()
const gio = (new Date().getUTCHours() + 7) % 24
const gioHs = gio >= 17 && gio < 22
if (gioHs && !thu && !process.argv.includes('--gio-hs')) { console.log(`Đang ${gio}h — giờ HS chơi, không chạy. Chạy lại sau 22h.`); process.exit(1) }

const ky = kyArg
  ? (await c.query(`select id, ten from ky_hoc where id = $1`, [kyArg])).rows[0]
  : (await c.query(`select id, ten from ky_hoc order by den_thang desc, created_at desc limit 1`)).rows[0]
if (!ky) throw new Error('Không có kì')
const admin = (await c.query(`select t.id from nhan_su n join tai_khoan t on t.nhan_su_id = n.id where n.la_admin_he_thong order by n.ho_ten limit 1`)).rows[0]
const ds = (await c.query(`
  select distinct hl.hoc_sinh_id, l.mon
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.trang_thai = 'dang_hoc' and l.mon in ('Toán', 'KHTN')
     and (not $2 or not exists (select 1 from bc_ky_so_lieu s where s.hoc_sinh_id = hl.hoc_sinh_id and s.mon = l.mon and s.ky_id = $1))
   order by l.mon, hl.hoc_sinh_id`, [ky.id, process.argv.includes('--tiep')])).rows
console.log(`Kì "${ky.ten}" — ${ds.length} cặp (em × môn)${thu ? ' — CHẠY THỬ, không ghi' : ''}`)
if (thu) process.exit(0)

let ok = 0, loi = 0
const t0 = Date.now()
const laDut = (e) => /terminated|ECONNRESET|ENOTFOUND|ETIMEDOUT|Connection|not queryable|closed/i.test(e?.message ?? '')
for (const [i, r] of ds.entries()) {
  for (let lan = 1; ; lan++) {
    try {
      await c.query('begin')
      await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: admin.id, role: 'authenticated' })])
      await c.query(`select public.fn_bc_ky_chot_hs($1, $2, $3)`, [r.hoc_sinh_id, r.mon, ky.id])
      await c.query('commit'); ok++
      break
    } catch (e) {
      if (laDut(e) && lan < 3) { console.log(`… mở lại kết nối (lần ${lan})`); await ketNoi(); continue }
      try { await c.query('rollback') } catch { /* kết nối đã chết */ }
      loi++; console.log('LỖI', r.hoc_sinh_id, r.mon, e.message); break
    }
  }
  if (gioHs) await new Promise((res) => setTimeout(res, 1500))   // giờ HS chơi: nhả DB giữa các em
  if ((i + 1) % 25 === 0) console.log(`${i + 1}/${ds.length} · ${Math.round((Date.now() - t0) / 1000)}s`)
}
const n = (await c.query(`select count(*) from bc_ky_so_lieu where ky_id = $1`, [ky.id])).rows[0].count
console.log(`XONG: chốt ${ok} · lỗi ${loi} · bc_ky_so_lieu có ${n} dòng cho kì · ${Math.round((Date.now() - t0) / 1000)}s`)
await c.end()
