import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const docs = (await c.query(`select t.id, t.ten, t.loai, t.khoi, t.mon, t.nhanh, t.ngay::date::text ngay, l.ten_lop, t.nguon_id, t.created_at, t.updated_at,
  (select count(*) from tai_lieu_phan p where p.tai_lieu_id=t.id) n_phan,
  (select count(*) from tai_lieu_phan p join tai_lieu_cau c on c.phan_id=p.id where p.tai_lieu_id=t.id) n_cau,
  t.cau_hinh is not null and t.cau_hinh<>'{}'::jsonb as co_ch
  from tai_lieu t left join lop l on l.id=t.lop_id where t.loai='mt_buoi' order by t.created_at desc limit 8`)).rows
console.table(docs.map(d=>({id:d.id.slice(0,8), ten:d.ten, khoi:d.khoi, lop:d.ten_lop, ngay:d.ngay, nguon:d.nguon_id?.slice(0,8), created:d.created_at.toISOString().slice(0,16), n_phan:d.n_phan, n_cau:d.n_cau, co_ch:d.co_ch})))
for (const d of docs.slice(0,2)) {
  console.log(`\n=== ${d.ten} ${d.ten_lop} ${d.ngay}`)
  const ph = (await c.query(`select p.thu_tu, p.loai_phan, p.ref_ma, p.tieu_de, (select count(*) from tai_lieu_cau c where c.phan_id=p.id) n from tai_lieu_phan p where p.tai_lieu_id=$1 order by p.thu_tu`, [d.id])).rows
  console.table(ph)
  const caus = (await c.query(`select p.thu_tu p_tt, c.thu_tu, c.ma_cau, exists(select 1 from dai_cau_hoi k where k.ma_cau=c.ma_cau) co_kho from tai_lieu_phan p join tai_lieu_cau c on c.phan_id=p.id where p.tai_lieu_id=$1 order by p.thu_tu, c.thu_tu`, [d.id])).rows
  console.log('câu:', caus.length, 'không có trong kho Đại:', caus.filter(x=>!x.co_kho).map(x=>x.ma_cau).join(',') || 'không')
  const ch = (await c.query(`select cau_hinh from tai_lieu where id=$1`, [d.id])).rows[0].cau_hinh ?? {}
  console.log('cau_hinh keys:', Object.keys(ch).join(','), '| hinhByMa:', Object.keys(ch.hinhByMa??{}).length, '| etMaDe:', Object.keys(ch.etMaDe??{}).length)
  if (d.nguon_id) {
    const m = (await c.query(`select (select count(*) from tai_lieu_phan p join tai_lieu_cau c on c.phan_id=p.id where p.tai_lieu_id=$1) n_cau, cau_hinh from tai_lieu where id=$1`, [d.nguon_id])).rows[0]
    console.log('master: n_cau', m.n_cau, '| hinhByMa', Object.keys(m.cau_hinh?.hinhByMa??{}).length, '| etMaDe', Object.keys(m.cau_hinh?.etMaDe??{}).length)
  }
}
await c.end()
