// THROWAWAY — seed data test UI DuyetChamScreen (node ... [--xoa] để dọn).
// 1 bai_test btvn 8B1 + 1 câu TLN key '12' + 2 HS trả 'x=12'/'x = 12' (wrong) + 1 báo sai.
import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const E = { ...envf('.env'), ...envf('.env.local') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()

if (process.argv.includes('--xoa')) {
  const r = await c.query("delete from bai_test where id in (select bai_test_id from bai_test_cau where ma_cau='ZZTEST02') returning id")
  await c.query("delete from question_accepted_answers where ma_cau='ZZTEST02'")
  console.log('đã xoá', r.rowCount, 'bai_test test + cache ZZTEST02')
  await c.end(); process.exit(0)
}

const lop = (await c.query("select id from lop where ten_lop='8B1' limit 1")).rows[0]
const hss = (await c.query("select hs.id, hs.ho_ten from hoc_sinh_lop hl join hoc_sinh hs on hs.id=hl.hoc_sinh_id where hl.lop_id=$1 and hl.trang_thai='dang_hoc' order by hs.ho_ten limit 2", [lop.id])).rows
const bt = (await c.query("insert into bai_test(lop_id,ngay,loai,mon,so_cau) values($1,current_date,'btvn','Toán',1) returning id", [lop.id])).rows[0]
const cau = (await c.query(`insert into bai_test_cau(bai_test_id,thu_tu,ma_cau,loai_cau,noi_dung,dap_an_key,diem)
  values($1,1,'ZZTEST02','tra_loi_ngan','Giải phương trình $2x-24=0$.','"12"'::jsonb,1) returning id`, [bt.id])).rows[0]
const answers = ['"x=12"', '"x = 12"']
let firstBlc = null
for (let i = 0; i < hss.length; i++) {
  const bl = (await c.query("insert into bai_lam(bai_test_id,hoc_sinh_id,trang_thai,nop_at) values($1,$2,'da_nop',now()) returning id", [bt.id, hss[i].id])).rows[0]
  const blc = (await c.query(`insert into bai_lam_cau(bai_lam_id,bai_test_cau_id,dap_an_hs,verdict,diem,cham_boi) values($1,$2,$3::jsonb,'wrong',0,'exact') returning id`, [bl.id, cau.id, answers[i]])).rows[0]
  if (!firstBlc) firstBlc = blc.id
}
await c.query("insert into bai_test_report(bai_lam_cau_id,hoc_sinh_id,y_kien) values($1,$2,'Em nghĩ x=12 là đúng ạ')", [firstBlc, hss[0].id])
console.log('seeded bai_test', bt.id, '· 2 HS:', hss.map((h) => h.ho_ten).join(', '), '· 1 report')
await c.end()
