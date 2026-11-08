// XOÁ chuyên đề "Hình Giữa kì 1" K9 bản đầu (167 bài, 5 nhóm chủ đề) — Thùy gật 04/11 ("4 ý giữ được, bỏ các bài giải tam giác và thực tế thôi")
// để dựng lại bản chỉ gồm bài hình 3–4 ý. Chỉ mất: 1 tai_lieu + 10 tai_lieu_phan + 167 tai_lieu_cau (tham chiếu); bài kho hinh_bai KHÔNG đụng.
// 1 transaction; lệch kỳ vọng ⇒ rollback.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const ID = 'da22bf68-6441-49fb-ba08-95a8da33d17c'
const n = async (s) => Number((await c.query(s, [ID])).rows[0].n)
await c.query('begin')
try {
  const [tl] = (await c.query(`select ten, khoi, loai from tai_lieu where id = $1`, [ID])).rows
  const truoc = {
    ten: tl?.ten, khoi: tl?.khoi, loai: tl?.loai,
    phan: await n(`select count(*) n from tai_lieu_phan where tai_lieu_id = $1`),
    cau: await n(`select count(*) n from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1`),
    bai_kho_k9: Number((await c.query(`select count(*) n from hinh_bai where khoi = '9'`)).rows[0].n),
  }
  console.log('TRƯỚC', truoc)
  if (truoc.ten !== 'Chuyên đề Hình Giữa kì 1' || truoc.khoi !== '9' || truoc.loai !== 'chuyen_de' || truoc.phan !== 10 || truoc.cau !== 167) throw new Error('Lệch kỳ vọng — dừng')
  const d = await c.query(`delete from tai_lieu where id = $1`, [ID])
  const sau = { xoa: d.rowCount, phan: await n(`select count(*) n from tai_lieu_phan where tai_lieu_id = $1`), bai_kho_k9: Number((await c.query(`select count(*) n from hinh_bai where khoi = '9'`)).rows[0].n) }
  console.log('SAU', sau)
  if (sau.xoa !== 1 || sau.phan !== 0 || sau.bai_kho_k9 !== truoc.bai_kho_k9) throw new Error('Verify sau lệch — rollback')
  await c.query('commit'); console.log('COMMIT ✅')
} catch (e) { await c.query('rollback'); console.error('ROLLBACK ❌', e.message); process.exitCode = 1 }
await c.end()
