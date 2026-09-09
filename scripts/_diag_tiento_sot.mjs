// Chạy migration trong transaction rồi SOI các dòng không phân giải được. Rollback.
import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows
await c.query('begin')
try {
  await c.query(readFileSync('supabase/migrations/202608141259_tien_to_ma_theo_mon.sql','utf8'))
  const khos = (loai, col) => `(select string_agg(distinct m.kho,'/' order by m.kho) from _tt_mapping m where m.loai='${loai}' and m.ma_cu=${col})`

  console.log('## nhanh có thật trong tai_lieu')
  console.log(JSON.stringify(await q(`select coalesce(nhanh,'(null)') nhanh, mon, count(*)::int n from tai_lieu group by 1,2 order by 3 desc`)))

  console.log('\n## tai_lieu_phan.ref_ma còn sót — nhóm theo (mon, nhanh, kho ứng viên)')
  console.log((await q(`select t.mon, coalesce(t.nhanh,'(null)') nhanh, ${khos('dang','p.ref_ma')} khos, count(*)::int n
    from tai_lieu_phan p join tai_lieu t on t.id=p.tai_lieu_id where p.ref_ma ~ '^[0-9]' group by 1,2,3 order by 4 desc`))
    .map(r=>`   mon=${r.mon} nhanh=${r.nhanh} ứng viên=${r.khos} → ${r.n} dòng`).join('\n'))

  console.log('\n## gami_session_problems còn sót')
  console.log((await q(`select coalesce(l.mon,'(bù/NULL)') mon, ${khos('dang','x.ma_dang')} khos, ${khos('cau','x.ma_cau')} khos_cau, count(*)::int n
    from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id
    where x.ma_dang ~ '^[0-9]' group by 1,2,3 order by 4 desc`))
    .map(r=>`   mon=${r.mon} dạng∈${r.khos} câu∈${r.khos_cau??'-'} → ${r.n} dòng`).join('\n'))

  console.log('\n## buoi_danh_gia_dang còn sót')
  console.log((await q(`select coalesce(l.mon,'(bù/NULL)') mon, ${khos('dang','x.ma_dang')} khos, count(*)::int n
    from buoi_danh_gia_dang x join buoi_hoc b on b.id=x.buoi_hoc_id left join lop l on l.id=b.lop_id
    where x.ma_dang ~ '^[0-9]' group by 1,2 order by 3 desc`))
    .map(r=>`   mon=${r.mon} dạng∈${r.khos} → ${r.n} dòng`).join('\n'))

  console.log('\n## gami ma_cau còn sót (2 dòng)')
  console.log(JSON.stringify(await q(`select x.ma_cau, ${khos('cau','x.ma_cau')} khos from gami_session_problems x where x.ma_cau ~ '^[0-9]'`)))

  console.log('\n## KIỂM: mã kho HÌNH (T2) có xuất hiện ở bảng đo nào không?')
  console.log('   cột dùng ma_dang_hinh:', (await q(`select table_name from information_schema.columns where table_schema='public' and column_name like '%dang_hinh%'`)).map(r=>r.table_name).join(', ') || '(chỉ hinh_ban_do)')
  console.log('   hinh_y / hinh_bai nối đo bằng:', (await q(`select table_name from information_schema.columns where table_schema='public' and column_name='hinh_y_id'`)).map(r=>r.table_name).join(', '))
} finally { await c.query('rollback'); await c.end() }
