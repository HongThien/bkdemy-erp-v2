// Vá bản mt_buoi 9K1 (0bd260b8) đang 0 phần do bug lọc bậc (mt.ts, fix 04/09): chép custom phans + câu
// từ master (26a60777) y hệt ganMTVaoBuoi KHÔNG lọc. Chỉ INSERT vào doc rỗng — guard: doc phải đang 0 phần.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const CON = process.argv[2] ?? '0bd260b8-cdd5-41bd-99cb-a853477b4220' // id doc con (truyền qua argv)
const { rows: [con] } = await c.query(`select id, nguon_id, ten, (select count(*)::int from tai_lieu_phan p where p.tai_lieu_id=$1) n_phan from tai_lieu where id=$1`, [CON])
if (!con) throw new Error('không thấy doc con')
if (con.n_phan !== 0) throw new Error(`doc con đã có ${con.n_phan} phần — không vá`)
const master = con.nguon_id
await c.query('begin')
try {
  const { rows: phans } = await c.query(`select id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, hien_lt from tai_lieu_phan where tai_lieu_id=$1 and loai_phan='custom' order by thu_tu`, [master])
  let t = 0, nCau = 0
  for (const p of phans) {
    const { rows: [np] } = await c.query(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, hien_lt) values ($1,$2,'custom',null,$3,$4,$5,$6) returning id`, [CON, t++, p.tieu_de, p.noi_dung, p.kieu, p.hien_lt])
    const { rowCount } = await c.query(`insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select $1, ma_cau, thu_tu from tai_lieu_cau where phan_id=$2`, [np.id, p.id])
    nCau += rowCount
  }
  await c.query(`update tai_lieu set updated_at=now() where id=$1`, [CON])
  await c.query(`update linkgen_jobs set status='pending', attempt=0, error=null, updated_at=now() where tai_lieu_id=$1`, [CON])
  await c.query('commit')
  console.log(`✅ ${con.ten}: chép ${phans.length} phần, ${nCau} câu; job link đặt lại pending`)
} catch (e) { await c.query('rollback'); throw e }
console.log(JSON.stringify((await c.query(`select p.thu_tu, p.tieu_de, (select count(*) from tai_lieu_cau x where x.phan_id=p.id) n from tai_lieu_phan p where p.tai_lieu_id=$1 order by p.thu_tu`, [CON])).rows))
await c.end()
