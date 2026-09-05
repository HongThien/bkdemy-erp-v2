import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const docs = (await c.query(`select t.id, t.ten, t.loai, t.khoi, t.mon, t.nhanh, t.ngay::date::text ngay, t.nguon_id, t.created_at, t.cau_hinh, l.ten_lop,
   (select count(*) from tai_lieu_phan p where p.tai_lieu_id=t.id) n_phan from tai_lieu t join lop l on l.id=t.lop_id where l.ten_lop='9K1' and t.loai in ('mt_buoi') order by t.created_at desc limit 3`)).rows
for (const d of docs) {
  console.log(`\n=== ${d.id} ${d.ten} | ${d.ten_lop} ${d.ngay} | mon=${d.mon} nhanh=${d.nhanh} khoi=${d.khoi} nguon=${d.nguon_id?.slice(0,8)} created=${d.created_at.toISOString().slice(0,16)}`)
  const ch = d.cau_hinh ?? {}
  console.log('cau_hinh keys:', Object.keys(ch).join(','), '| etMaDe', Object.keys(ch.etMaDe??{}).length, '| hsMaDe', Object.keys(ch.hsMaDe??{}).length, '| hinhByMa', Object.keys(ch.hinhByMa??{}).length, '| hinhMaDe', JSON.stringify(ch.hinhMaDe??null)?.slice(0,200), '| nhanhByCau', Object.keys(ch.nhanhByCau??{}).length)
  const ph = (await c.query(`select p.id, p.thu_tu, p.loai_phan, p.tieu_de, p.kieu, (select string_agg(c.ma_cau, ',' order by c.thu_tu) from tai_lieu_cau c where c.phan_id=p.id) mas from tai_lieu_phan p where p.tai_lieu_id=$1 order by p.thu_tu`, [d.id])).rows
  for (const p of ph) console.log(` phần ${p.thu_tu} [${p.loai_phan}] "${p.tieu_de}" kieu=${p.kieu}:`, p.mas)
  const mas = ph.flatMap(p=>(p.mas??'').split(',')).filter(m=>m && !m.startsWith('HINH:'))
  if (mas.length) {
    const kho = await c.query(`select ma_cau, 'dai' src from dai_cau_hoi where ma_cau=any($1) union all select ma_cau,'hgt' from hgt_cau_hoi where ma_cau=any($1) union all select ma_cau,'khtn' from khtn_cau_hoi where ma_cau=any($1)`, [mas])
    const found = new Set(kho.rows.map(r=>r.ma_cau)); console.log(' câu không thấy trong kho nào:', mas.filter(m=>!found.has(m)).join(',') || 'không')
    const bySrc = {}; for (const r of kho.rows) bySrc[r.src]=(bySrc[r.src]??0)+1; console.log(' theo kho:', JSON.stringify(bySrc))
  }
  const hinh = ph.flatMap(p=>(p.mas??'').split(',')).filter(m=>m.startsWith('HINH:'))
  if (hinh.length) console.log(' hàng HINH:', hinh.length, hinh.map(h=>h.slice(5,13)).join(','), '| có trong hinhByMa:', hinh.filter(h=>ch.hinhByMa?.[h]).length)
  if (d.nguon_id) { const m = (await c.query(`select ten, cau_hinh from tai_lieu where id=$1`, [d.nguon_id])).rows[0]; console.log(' master:', m?.ten, '| master hinhByMa', Object.keys(m?.cau_hinh?.hinhByMa??{}).length, 'etMaDe', Object.keys(m?.cau_hinh?.etMaDe??{}).length) }
}
await c.end()
