import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows

console.log('## hinh_ban_do: mã trông thế nào? (87 dòng 8-số!)')
console.log('   tổng:', (await q(`select count(*)::int c from hinh_ban_do`))[0].c)
console.log('   mẫu:', (await q(`select ma_dang_hinh from hinh_ban_do order by 1 limit 6`)).map(r=>r.ma_dang_hinh).join(', '))
console.log('   pattern:', JSON.stringify((await q(`select
   count(*) filter (where ma_dang_hinh ~ '^HD[0-9]+$')::int hd,
   count(*) filter (where ma_dang_hinh ~ '^[0-9]{8}$')::int so8, count(*)::int tong from hinh_ban_do`))[0]))
for (const t of ['dai_ban_do','khtn_ban_do','hgt_ban_do'])
  console.log(`   hinh_ban_do ∩ ${t}: ${(await q(`select count(*)::int c from hinh_ban_do h join ${t} y on y.ma_dang=h.ma_dang_hinh`))[0].c}`)
console.log('   hinh_ban_do cột:', (await q(`select column_name from information_schema.columns where table_schema='public' and table_name='hinh_ban_do' order by 1`)).map(r=>r.column_name).join(', '))
console.log('   ma_dang_hinh dùng ở bảng nào:', (await q(`select table_name from information_schema.columns where table_schema='public' and column_name='ma_dang_hinh' order by 1`)).map(r=>r.table_name).join(', '))

console.log('\n## BUỔI BÙ (lop_id null, 740 dòng gami) — nối về lớp bằng gì?')
console.log('   bảng có buoi_goc/session_bu:', (await q(`select table_name from information_schema.tables where table_schema='public' and (table_name like '%bu%')`)).map(r=>r.table_name).join(', '))
console.log('   buoi_hoc_hs cột:', (await q(`select column_name from information_schema.columns where table_schema='public' and table_name='buoi_hoc_hs' order by 1`)).map(r=>r.column_name).join(', '))
const bu = await q(`select count(*)::int n,
    count(*) filter (where exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id=b.id))::int co_hs
  from buoi_hoc b where b.lop_id is null and b.loai='bu'`)
console.log('   buổi bù có buoi_hoc_hs:', JSON.stringify(bu[0]))
// môn của buổi bù = môn lớp của HS trong buổi đó?
const bu2 = await q(`select count(distinct l.mon)::int so_mon, count(*)::int n from buoi_hoc b
  join buoi_hoc_hs h on h.buoi_hoc_id=b.id join hoc_sinh_lop hl on hl.hoc_sinh_id=h.hoc_sinh_id
  join lop l on l.id=hl.lop_id where b.lop_id is null and b.loai='bu'`)
console.log('   (thử) môn qua hoc_sinh_lop:', JSON.stringify(bu2[0]))

console.log('\n## 740 dòng gami buổi-bù: mã có ở kho nào?')
console.log(JSON.stringify((await q(`select
   count(*) filter (where x.ma_dang in (select ma_dang from dai_ban_do))::int o_dai,
   count(*) filter (where x.ma_dang in (select ma_dang from khtn_ban_do))::int o_khtn,
   count(*) filter (where x.ma_dang in (select ma_dang from hgt_ban_do))::int o_hgt,
   count(*) filter (where x.ma_cau in (select ma_cau from dai_cau_hoi))::int cau_dai,
   count(*) filter (where x.ma_cau in (select ma_cau from khtn_cau_hoi))::int cau_khtn,
   count(*) filter (where x.ma_cau in (select ma_cau from hgt_cau_hoi))::int cau_hgt
  from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id
  where b.lop_id is null and x.ma_dang is not null`))[0]))

console.log('\n## kho_tag_log (ai_value/final_value = mã dạng) — có mon?')
console.log(JSON.stringify(await q(`select mon, count(*)::int n from kho_tag_log group by 1`)))

console.log('\n## dai_cau_hoi.dap_an 8-số = đáp án THẬT hay mã? (không được đụng)')
console.log((await q(`select ma_cau, dap_an from dai_cau_hoi where dap_an ~ '^[0-9]{8}$' limit 6`)).map(r=>`   ${r.ma_cau} → dap_an=${r.dap_an}`).join('\n'))

console.log('\n## tai_lieu.cau_hinh — khoá nào chứa ma_cau?')
console.log(JSON.stringify((await q(`select
   count(*) filter (where cau_hinh ? 'btvnLinesByCau')::int a,
   count(*) filter (where cau_hinh ? 'etFormByCau')::int b,
   count(*) filter (where cau_hinh ? 'etMaDe')::int d,
   count(*) filter (where cau_hinh ? 'colByCau')::int e,
   count(*) filter (where cau_hinh ? 'phanBac')::int f,
   count(*)::int tong from tai_lieu where cau_hinh is not null`))[0]))
await c.end()
