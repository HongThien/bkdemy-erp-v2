// node ghi.mjs <root> <dir> <khoi> [--ghi]   (mặc định: chạy thử rồi ROLLBACK)
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const [root, D, khoi] = process.argv.slice(2)
const GHI = process.argv.includes('--ghi')
const require = createRequire(root + '/')
const pg = require('pg')
const env = readFileSync(root + '/.env', 'utf8')
const m = env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, '') })
await c.connect()
const kq = JSON.parse(readFileSync(D + '/ket_qua.json', 'utf8'))
const dapan = JSON.parse(readFileSync(D + '/mau_kiem_dap_an.json', 'utf8'))
const cao = kq.filter(r => r.dang_bai_id && r.chac === 'cao' && !(r.ma_cau in dapan))
console.log('mức cao ngoài mẫu kiểm:', cao.length)
const cnt = async () => (await c.query(`
  select count(*) filter (where dang_bai_id is null) chua, count(*) filter (where dang_bai_id is not null) da
  from _bdm_cau_giai((select array_agg(ma_dang) from dai_ban_do where khoi=$1))`, [khoi])).rows[0]
await c.query('begin')
try {
  const truoc = await cnt()
  const gan0 = +(await c.query('select count(*) from dai_bdm_gan_cau')).rows[0].count
  // chỉ câu: còn sống, CHƯA có dòng gán (không đè gán của người/AI cũ), dạng bài tồn tại
  const r = await c.query(`
    insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
    select t.ma_cau, t.db, 'ai'
    from unnest($1::text[], $2::text[]) t(ma_cau, db)
    join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
    join dai_bdm_dang_bai d on d.id = t.db
    where not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    on conflict (ma_cau) do nothing`, [cao.map(x => x.ma_cau), cao.map(x => x.dang_bai_id)])
  const sau = await cnt()
  const gan1 = +(await c.query('select count(*) from dai_bdm_gan_cau')).rows[0].count
  console.log('chèn', r.rowCount, '· bảng gán', gan0, '→', gan1)
  console.log('câu (gồm bản sao) chưa gán', truoc.chua, '→', sau.chua, '· đã gán', truoc.da, '→', sau.da)
  if (r.rowCount !== gan1 - gan0) throw new Error('lệch số dòng chèn')
  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('↩ ROLLBACK (chạy thử, không ghi)') }
} catch (e) { await c.query('rollback'); console.log('LỖI → rollback:', e.message) }
await c.end()
