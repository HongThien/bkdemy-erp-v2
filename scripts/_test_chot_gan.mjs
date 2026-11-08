// Chạy thử mig 202610261834 TRONG ROLLBACK: dạng bài của mọi câu trước/sau phải y hệt, trừ câu Đúng/Sai (luật Đ/S).
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
try {
  await q('begin'); await q('set local statement_timeout = 0')
  await q(`create temp table truoc as select ma_cau, kho, dang_bai_id from bdm_cau_dang`)
  const t = Date.now()
  await q(fs.readFileSync('supabase/migrations/202610261834_bdm_chot_gan_cum_doi_ung_cat_ma_cu.sql', 'utf8'))
  console.log('mig', Date.now() - t, 'ms')
  await q(`create temp table sau as select ma_cau, kho, dang_bai_id from bdm_cau_dang`)
  console.log('trước', (await q(`select count(*)::int n from truoc`))[0].n, '· sau', (await q(`select count(*)::int n from sau`))[0].n)
  console.log('mất:', await q(`select coalesce(q.loai_cau, h.loai_cau) loai, count(*)::int n from truoc t left join sau s using (ma_cau, kho)
      left join dai_cau_hoi q on t.kho = 'dai' and q.ma_cau = t.ma_cau left join hgt_cau_hoi h on t.kho = 'hgt' and h.ma_cau = t.ma_cau where s.ma_cau is null group by 1`))
  console.log('đổi dạng bài:', (await q(`select count(*)::int n from truoc t join sau s using (ma_cau, kho) where s.dang_bai_id is distinct from t.dang_bai_id`))[0].n,
    await q(`select coalesce(q.loai_cau, h.loai_cau) loai, count(*)::int n from truoc t join sau s using (ma_cau, kho) left join dai_cau_hoi q on t.kho = 'dai' and q.ma_cau = t.ma_cau left join hgt_cau_hoi h on t.kho = 'hgt' and h.ma_cau = t.ma_cau where s.dang_bai_id is distinct from t.dang_bai_id group by 1`).then((r) => JSON.stringify(r)),
    '· thêm mới:', (await q(`select count(*)::int n from sau s left join truoc t using (ma_cau, kho) where t.ma_cau is null`))[0].n)
  console.log('gán theo nguồn:', await q(`select nguon, count(*)::int n from dai_bdm_gan_cau group by 1 order by 1`))
  const t2 = Date.now(); await q(`select count(*) from bdm_cau_hoi where dang_chinh = 'NDB00419'`); console.log('view 1 dạng', Date.now() - t2, 'ms')
} finally { await q('rollback'); await c.end() }
