// Chạy thử mig 202610011520 (dữ liệu bản đồ phiêu lưu) trong 1 transaction rồi ROLLBACK — không ghi gì thật.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  await c.query(fs.readFileSync('supabase/migrations/202610011520_ban_do_phieu_luu.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const ems = await q(`select distinct on (l.mon, l.khoi) hl.hoc_sinh_id, tk.id tk, l.mon, l.khoi from hoc_sinh_lop hl join lop l on l.id=hl.lop_id join tai_khoan tk on tk.hoc_sinh_id=hl.hoc_sinh_id
     where hl.trang_thai='dang_hoc' and l.khoi in ('4T','7','9','12','6') and l.mon in ('Toán','KHTN') order by l.mon, l.khoi, hl.hoc_sinh_id`)
  for (const e of ems) {
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: e.tk, role: 'authenticated' })])
    const t = Date.now()
    const v = (await q(`select public.fn_ban_do_phieu_luu($1) v`, [e.mon]))[0].v
    const ms = Date.now() - t
    const man = v.luc_dia.flatMap((l) => l.khu_vuc.flatMap((k) => k.man))
    const tt = man.reduce((a, m) => ((a[m.trang_thai] = (a[m.trang_thai] ?? 0) + 1), a), {})
    const quai = man.flatMap((m) => m.quai)
    console.log(`${e.mon} k${e.khoi}: ${v.luc_dia.length} lục địa · ${v.luc_dia.reduce((s, l) => s + l.khu_vuc.length, 0)} khu · ${man.length} màn (${man.filter((m) => m.so_cau > 0).length} có câu) · ${quai.length} quái (${quai.filter((x) => x.la_boss).length} boss) · trạng thái ${JSON.stringify(tt)} · đã dạy ${man.filter((m) => m.da_day).length} · ${ms} ms`)
  }
  console.log('Mẫu 1 lục địa:', JSON.stringify((await q(`select public.fn_ban_do_phieu_luu('Toán') v`))[0].v.luc_dia[0], null, 0).slice(0, 700))
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
