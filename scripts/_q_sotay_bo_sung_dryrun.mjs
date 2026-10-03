// Chạy THỬ migration bổ sung thẻ Toán 12 trong 1 transaction rồi ROLLBACK.
import fs from 'node:fs'
import pg from 'pg'; process.loadEnvFile('.env')
const f = process.argv[2]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p = []) => (await c.query(s, p)).rows
await c.query('begin')
try {
  await c.query(fs.readFileSync(f, 'utf8'))
  console.log('thẻ Toán đã có cong_thuc:', (await q(`select count(*)::int n from sotay_cong_thuc where mon='Toán' and cong_thuc is not null`))[0].n, '/ 77')
  console.log('nhật ký sua:', (await q(`select count(*)::int n from sotay_ct_lich_su where hanh_dong='sua' and ma_the like 'CT12-%'`))[0].n)
  console.log('trạng thái:', await q(`select trang_thai, count(*)::int from sotay_cong_thuc where mon='Toán' group by 1`))
  await q(`update sotay_cong_thuc set trang_thai='da_duyet' where ma='CT12-XS-04'`)
  const m = (await q(`select _sotay_muc_json('CT12-XS-04') j`))[0].j
  console.log('mục XS-04 cho app:', JSON.stringify({ noi_dung: m.noi_dung, cong_thuc: m.cong_thuc?.slice(0, 40), vd: m.vd?.kq, nham: m.nham?.length, lq: m.lq?.map((x) => x.ma) }))
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end() }
