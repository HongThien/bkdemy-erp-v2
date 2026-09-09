// Giải mã: mỗi dòng ĐO mang ma_dang trùng thì THỰC SỰ thuộc môn/nhánh nào?
// Nhân chứng: đường lop.mon (buoi_hoc→lop | bai_test.mon | ca_test.mon | bo_tro_*.lop_id).
import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows

console.log('## mã câu mẫu mỗi kho')
for (const [t,col] of [['dai_cau_hoi','ma_cau'],['khtn_cau_hoi','ma_cau'],['hgt_cau_hoi','ma_cau']])
  console.log(`   ${t}:`, (await q(`select ${col} from ${t} order by 1 limit 3`)).map(r=>r[col]).join(', '))

console.log('\n## 3 mã trùng ĐẠI ∩ HGT')
console.log((await q(`select d.ma_dang, d.ten_dang toan, h.ten_dang hgt from dai_ban_do d join hgt_ban_do h using (ma_dang)`))
  .map(r=>`   ${r.ma_dang} | Đại: ${r.toan} | GT: ${r.hgt}`).join('\n'))
console.log('\n## 7 mã trùng KHTN ∩ HGT')
console.log((await q(`select k.ma_dang from khtn_ban_do k join hgt_ban_do h using (ma_dang)`)).map(r=>r.ma_dang).join(', '))

// Nguồn môn cho từng bảng đo
const SRC = {
  buoi_danh_gia_dang: `select x.ma_dang, l.mon from buoi_danh_gia_dang x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id`,
  gami_session_problems: `select x.ma_dang, l.mon, x.ma_cau from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id`,
  bai_test_cau: `select x.ma_dang, t.mon from bai_test_cau x join bai_test t on t.id=x.bai_test_id`,
  ca_test_cau: `select x.ma_dang, t.mon from ca_test_cau x join ca_test t on t.id=x.ca_test_id`,
  canh_bao_yeu: `select x.ma_dang, l.mon from canh_bao_yeu x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id`,
  bo_tro_duoi_dang: `select x.ma_dang, l.mon from bo_tro_duoi_dang x join bo_tro_duoi p on p.id=x.bo_tro_duoi_id left join lop l on l.id=p.lop_id`,
  bo_tro_yeu_dang: `select x.ma_dang, p.mon from bo_tro_yeu_dang x join bo_tro_yeu p on p.id=x.bo_tro_yeu_id`,
  bt_grades: `select x.ma_dang, t.mon, t.nhanh from bt_grades x join tai_lieu t on t.id=x.tai_lieu_id`,
}
console.log('\n## PHÂN GIẢI MÔN cho từng bảng đo')
for (const [t, sql] of Object.entries(SRC)) {
  try {
    const r = await q(`with s as (${sql}) select coalesce(mon,'(NULL)') mon, count(*)::int n,
        count(*) filter (where ma_dang in (select ma_dang from dai_ban_do))::int o_dai,
        count(*) filter (where ma_dang in (select ma_dang from khtn_ban_do))::int o_khtn,
        count(*) filter (where ma_dang in (select ma_dang from hgt_ban_do))::int o_hgt,
        count(*) filter (where ma_dang not in (select ma_dang from dai_ban_do)
                          and ma_dang not in (select ma_dang from khtn_ban_do)
                          and ma_dang not in (select ma_dang from hgt_ban_do))::int mo_coi
      from s where ma_dang is not null and ma_dang<>'' group by 1 order by 2 desc`)
    console.log(` ${t}:`)
    r.forEach(x=>console.log(`    mon=${String(x.mon).padEnd(7)} ${String(x.n).padStart(5)} dòng | khớp đại ${x.o_dai} · khtn ${x.o_khtn} · hgt ${x.o_hgt} · MỒ CÔI ${x.mo_coi}`))
  } catch(e){ console.log(` ${t}: ERR ${e.message}`) }
}

// Ca nguy hiểm: dòng mon='Toán' mà mã CÓ ở cả đại lẫn hgt → cần nhân chứng ma_cau
console.log('\n## Toán: dòng mã có ở CẢ đại lẫn hgt (cần ma_cau phân giải)')
const amb = await q(`with s as (${SRC.gami_session_problems}) select count(*)::int n,
   count(*) filter (where ma_cau is not null)::int co_ma_cau from s
   where mon='Toán' and ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from hgt_ban_do)`)
console.log('   gami_session_problems:', JSON.stringify(amb[0]))
const amb2 = await q(`with s as (${SRC.buoi_danh_gia_dang}) select count(*)::int n from s
   where mon='Toán' and ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from hgt_ban_do)`)
console.log('   buoi_danh_gia_dang:', JSON.stringify(amb2[0]))

console.log('\n## FUNCTION/TRIGGER đụng ma_dang')
const fn = await q(`select p.proname, p.prosrc from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.prosrc ilike '%ma_dang%'`)
fn.forEach(f=>console.log(`   ${f.proname}${/substr|left\s*\(|right\s*\(|~\s*'\^/i.test(f.prosrc)?'   ⚠ CẮT CHUỖI/REGEX':''}`))
await c.end()
