// CHẠY 1 LẦN (Thùy OK 09/09 tối): xoá dữ liệu bổ trợ yếu TEST của Triệu Đức Tùng tạo 09/09 — 2 buổi + bài sinh trong buổi.
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const BUOI = ['2de89692-0640-486b-8421-674f5d2b17ca', '4a3678d5-e47b-4302-a997-5406fd646c7b']
try {
  await c.query('begin')
  const bt = (await c.query(`select id from bai_test where buoi_hoc_id = any($1)`, [BUOI])).rows.map(r => r.id)
  const bl = (await c.query(`select id from bai_lam where bai_test_id = any($1)`, [bt])).rows.map(r => r.id)
  const n = {}
  n.goi_y = (await c.query(`delete from bai_lam_goi_y where bai_lam_id = any($1)`, [bl])).rowCount
  n.bai_lam_cau = (await c.query(`delete from bai_lam_cau where bai_lam_id = any($1)`, [bl])).rowCount
  n.tu_luyen_dang_lan = (await c.query(`delete from tu_luyen_dang_lan where bai_test_id = any($1)`, [bt])).rowCount
  n.bai_lam = (await c.query(`delete from bai_lam where id = any($1)`, [bl])).rowCount
  n.bai_test_cau = (await c.query(`delete from bai_test_cau where bai_test_id = any($1)`, [bt])).rowCount
  n.bai_test = (await c.query(`delete from bai_test where id = any($1)`, [bt])).rowCount
  n.dang_reset = (await c.query(`update bo_tro_yeu_dang set day_at = null, day_buoi_id = null where day_buoi_id = any($1)`, [BUOI])).rowCount
  n.buoi_hoc_hs = (await c.query(`delete from buoi_hoc_hs where buoi_hoc_id = any($1)`, [BUOI])).rowCount
  n.buoi_hoc = (await c.query(`delete from buoi_hoc where id = any($1) and loai = 'bo_tro_yeu'`, [BUOI])).rowCount
  if (n.buoi_hoc !== 2 || n.bai_test !== 5) throw new Error('Số dòng lệch dự kiến: ' + JSON.stringify(n))
  await c.query('commit')
  console.log('ĐÃ XOÁ:', JSON.stringify(n))
} catch (e) { await c.query('rollback'); console.error('ROLLBACK:', e.message) }
console.log('còn lại buổi bổ trợ yếu của Tùng:', JSON.stringify((await c.query(`select b.id, b.ngay::text, b.trang_thai from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id=b.id where hh.hoc_sinh_id='30a354aa-0c70-4dbb-88c7-4a540d2dd8bb' and b.loai='bo_tro_yeu'`)).rows))
console.log('dạng case:', JSON.stringify((await c.query(`select ma_dang, day_at, day_buoi_id, dong_at from bo_tro_yeu_dang where bo_tro_yeu_id='55b97f6c-763a-4cfd-889a-55c3aac502ba'`)).rows))
await c.end()
