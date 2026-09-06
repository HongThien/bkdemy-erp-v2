import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows

// Mã dạng trong bảng ĐO trông như thế nào? (nhóm theo pattern)
const consumers = ['bai_test_cau','bo_tro_duoi_dang','bo_tro_yeu_dang','bt_grades','buoi_danh_gia_dang','ca_test_cau','canh_bao_yeu','gami_session_problems']
for (const t of consumers) {
  const r = await q(`select
      case when ma_dang ~ '^[0-9]{8}$' then 'vitri-8so'
           when ma_dang ~ '^[A-Z]{2}[0-9]+$' then 'prefix2-'||left(ma_dang,2)
           else 'khac: '||left(ma_dang,10) end as pat,
      count(*)::int n,
      count(*) filter (where ma_dang in (select ma_dang from dai_ban_do))::int co_o_dai,
      count(*) filter (where ma_dang in (select ma_dang from khtn_ban_do))::int co_o_khtn,
      count(*) filter (where ma_dang in (select ma_dang from hgt_ban_do))::int co_o_hgt
    from ${t} where ma_dang is not null and ma_dang <> '' group by 1 order by 2 desc limit 6`)
  console.log(`\n## ${t}`)
  r.forEach(x=>console.log(`   ${x.pat.padEnd(18)} ${String(x.n).padStart(5)}  (đại ${x.co_o_dai} · khtn ${x.co_o_khtn} · hgt ${x.co_o_hgt})`))
}

// hinh_dang / hinh_y có chảy vào cột nào?
console.log('\n## hinh_dang mẫu:', (await q(`select ma_dang_hinh from hinh_dang order by 1 limit 5`)).map(r=>r.ma_dang_hinh).join(', '))
console.log('## hinh_ban_do mẫu:', (await q(`select * from hinh_ban_do limit 3`)).map(r=>JSON.stringify(r)).join('\n   '))

// Function/trigger nào đụng ma_dang bằng cách CẮT CHUỖI?
const fn = await q(`select p.proname, p.prosrc from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and (p.prosrc ilike '%ma_dang%')`)
console.log('\n## FUNCTION đụng ma_dang:', fn.length)
fn.forEach(f=>{
  const risky = /substr|left\(|right\(|like\s*'[0-9]|~\s*'\^/i.test(f.prosrc)
  console.log(`   ${f.proname}${risky?'   ⚠ CÓ CẮT CHUỖI/REGEX':''}`)
})
await c.end()
