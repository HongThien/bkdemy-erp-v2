import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows

console.log('## tai_lieu: cột nối buổi?')
console.log((await q(`select column_name from information_schema.columns where table_schema='public' and table_name='tai_lieu' order by 1`)).map(r=>r.column_name).join(', '))
console.log('\n## tai_lieu_phan cột:', (await q(`select column_name from information_schema.columns where table_schema='public' and table_name='tai_lieu_phan' order by 1`)).map(r=>r.column_name).join(', '))

console.log('\n## 108 dòng gami ambiguous — phân giải bằng ma_cau (dai∩hgt = 0 nên ma_cau SẠCH)')
const r = await q(`select x.ma_dang,
    count(*)::int n,
    count(*) filter (where x.ma_cau in (select ma_cau from hgt_cau_hoi))::int la_hgt,
    count(*) filter (where x.ma_cau in (select ma_cau from dai_cau_hoi))::int la_dai,
    count(*) filter (where x.ma_cau is null)::int khong_ma_cau
  from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id
  where l.mon='Toán' and x.ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from hgt_ban_do)
  group by 1 order by 2 desc`)
r.forEach(x=>console.log(`   ${x.ma_dang}: ${x.n} dòng | hgt ${x.la_hgt} · đại ${x.la_dai} · KHÔNG ma_cau ${x.khong_ma_cau}`))

console.log('\n## 49 dòng không ma_cau — buổi đó có tài liệu nhánh hinh_gt không?')
const r2 = await q(`select b.ma_buoi, b.ngay::date, x.ma_dang, x.phase, count(*)::int n,
    exists(select 1 from tai_lieu t where t.nhanh='hinh_gt' and t.ten like '%'||l.ten_lop||'%') co_tl_gt
  from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id
  where l.mon='Toán' and x.ma_cau is null and x.ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from hgt_ban_do)
  group by 1,2,3,4,6 order by 2 desc limit 20`)
r2.forEach(x=>console.log(`   ${x.ma_buoi} ${x.ngay.toISOString?.().slice(0,10)??x.ngay} ${x.ma_dang} ${x.phase} x${x.n} · lớp có TL hình_gt: ${x.co_tl_gt}`))

console.log('\n## 47 dòng buoi_danh_gia_dang ambiguous — buổi nào?')
const r3 = await q(`select l.ten_lop, b.ma_buoi, b.ngay::date, x.ma_dang, count(*)::int n
  from buoi_danh_gia_dang x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id
  where l.mon='Toán' and x.ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from hgt_ban_do)
  group by 1,2,3,4 order by 3 desc limit 20`)
r3.forEach(x=>console.log(`   ${x.ten_lop} ${x.ma_buoi} ${x.ngay.toISOString?.().slice(0,10)??x.ngay} ${x.ma_dang} x${x.n}`))

console.log('\n## tai_lieu_phan.ref_ma / tai_lieu_cau.ma_cau — có nhãn môn qua tai_lieu?')
console.log('   tai_lieu_phan có ref_ma là ma_dang:', (await q(`select count(*)::int c from tai_lieu_phan where loai_phan in ('dang','btvn','ontap')`))[0].c)
const byMon = await q(`select t.mon, t.nhanh, count(*)::int c from tai_lieu_phan p join tai_lieu t on t.id=p.tai_lieu_id
  where p.loai_phan in ('dang','btvn','ontap') group by 1,2 order by 3 desc`)
byMon.forEach(x=>console.log(`     mon=${x.mon} nhanh=${x.nhanh??'(null)'} → ${x.c} phan`))
const cauByMon = await q(`select t.mon, t.nhanh, count(*)::int c from tai_lieu_cau tc join tai_lieu t on t.id=tc.tai_lieu_id group by 1,2 order by 3 desc`)
console.log('   tai_lieu_cau:'); cauByMon.forEach(x=>console.log(`     mon=${x.mon} nhanh=${x.nhanh??'(null)'} → ${x.c} câu`))
await c.end()
