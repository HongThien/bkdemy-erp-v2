import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows

console.log('## MÃ CÂU có trùng không?')
for (const [a,b] of [['dai_cau_hoi','khtn_cau_hoi'],['dai_cau_hoi','hgt_cau_hoi'],['khtn_cau_hoi','hgt_cau_hoi']])
  console.log(`   ${a} ∩ ${b}: ${(await q(`select count(*)::int c from ${a} x join ${b} y using (ma_cau)`))[0].c}`)
console.log('   số câu:', (await q(`select (select count(*) from dai_cau_hoi) dai,(select count(*) from khtn_cau_hoi) khtn,(select count(*) from hgt_cau_hoi) hgt`))[0])

console.log('\n## Bảng nào chứa ma_cau (text trần)?')
console.log((await q(`select table_name from information_schema.columns where table_schema='public' and column_name='ma_cau' order by 1`)).map(r=>r.table_name).join(', '))

console.log('\n## HÌNH GIẢI TÍCH: dấu vết vận hành')
console.log('   tai_lieu nhanh=hinh_gt:', (await q(`select count(*)::int c from tai_lieu where nhanh='hinh_gt'`))[0].c)
const tlgt = await q(`select id, ten, khoi, loai from tai_lieu where nhanh='hinh_gt' limit 10`)
tlgt.forEach(t=>console.log(`     ${t.loai} K${t.khoi} ${t.ten}`))
console.log('   hgt_cau_hoi:', (await q(`select count(*)::int c from hgt_cau_hoi`))[0].c)

console.log('\n## 108 dòng gami "Toán ambiguous (đại∩hgt)" — chúng đến từ buổi nào?')
const r108 = await q(`select l.ten_lop, b.ma_buoi, b.ngay, x.ma_dang, count(*)::int n
  from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id
  where l.mon='Toán' and x.ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from hgt_ban_do)
  group by 1,2,3,4 order by 3 desc limit 15`)
r108.forEach(r=>console.log(`     ${r.ten_lop} ${r.ma_buoi} ${r.ngay} ${r.ma_dang} x${r.n}`))

console.log('\n## Dòng mon=NULL (buoi_hoc không có lop_id) — là gì?')
const nul = await q(`select b.id, b.ma_buoi, b.ngay, b.lop_id, count(*)::int n
  from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id where b.lop_id is null
  group by 1,2,3,4 order by 5 desc limit 10`)
nul.forEach(r=>console.log(`     ma_buoi=${r.ma_buoi} ngay=${r.ngay} n=${r.n}`))
console.log('   buoi_hoc lop_id null tổng:', (await q(`select count(*)::int c from buoi_hoc where lop_id is null`))[0].c)

console.log('\n## Cột tham chiếu ma_dang trong JSONB (tai_lieu.cau_hinh / btvn_ontap_config…)?')
console.log('   tai_lieu_phan.ref_ma mẫu:', (await q(`select ref_ma from tai_lieu_phan where ref_ma is not null limit 5`)).map(r=>r.ref_ma).join(', '))
console.log('   btvn_ontap_config:', (await q(`select count(*)::int c from btvn_ontap_config`))[0].c, 'dòng')

console.log('\n## mastery: có lọc môn không? (kiểm bằng cột trong bảng nguồn)')
console.log('   -> xem src/lib/mastery.ts, đây chỉ liệt kê bảng nguồn có mon:',
  (await q(`select table_name from information_schema.columns where table_schema='public' and column_name='mon' order by 1`)).map(r=>r.table_name).join(', '))
await c.end()
