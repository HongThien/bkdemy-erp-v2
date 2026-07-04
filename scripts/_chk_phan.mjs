import pg from 'pg'; import { readFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
for (const loai of ['giao_trinh_buoi','et']) {
  const doc = (await c.query("select id,ten,lop_id,ngay,mon from tai_lieu where loai=$1 and lop_id is not null and ngay is not null order by created_at desc limit 1",[loai])).rows[0]
  if (!doc) { console.log(loai,'— ko có doc bám lớp'); continue }
  const phans = (await c.query("select loai_phan, count(*) n, sum((select count(*) from tai_lieu_cau tc where tc.phan_id=p.id)) ncau from tai_lieu_phan p where tai_lieu_id=$1 group by loai_phan",[doc.id])).rows
  console.log(`\n${loai}: "${doc.ten.slice(0,30)}" (lớp+ngày ✓)`)
  phans.forEach(x=>console.log('   loai_phan=',x.loai_phan,'·',x.n,'phan ·',x.ncau||0,'câu'))
}
await c.end()
