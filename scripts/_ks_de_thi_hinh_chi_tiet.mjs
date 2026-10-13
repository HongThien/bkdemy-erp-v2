// Khảo sát (chỉ đọc): cấu trúc câu HÌNH trong đề thi của một khối — tổng, gom nhóm bài, mẫu 1 bài nhiều ý.
// Chạy: node scripts/_ks_de_thi_hinh_chi_tiet.mjs 8
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const khoi = process.argv[2] || '8'
const q = async (s, p) => (await c.query(s, p)).rows
const tong = await q(`
  with x as (select t.id, tc.ma_cau, h.loai_cau, h.loi_giai, h.anh_de, h.anh_dap_an, h.dang_chinh, h.da_duyet
    from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id=t.id join tai_lieu_cau tc on tc.phan_id=p.id
    join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where t.loai='de_thi' and t.khoi=$1 and h.xoa_at is null)
  select count(distinct id)::int de, count(*)::int cau, count(distinct ma_cau)::int cau_khac_nhau,
    count(*) filter (where coalesce(loi_giai,'')<>'')::int co_lg, count(*) filter (where anh_de is not null)::int co_hinh_de,
    count(*) filter (where anh_dap_an is not null)::int co_hinh_lg, count(*) filter (where da_duyet)::int da_duyet
  from x`, [khoi])
console.log('TỔNG', tong[0])
console.table(await q(`
  select h.loai_cau, count(*)::int so from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id=t.id join tai_lieu_cau tc on tc.phan_id=p.id
  join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where t.loai='de_thi' and t.khoi=$1 and h.xoa_at is null group by 1 order by 2 desc`, [khoi]))
console.table(await q(`
  select b.ma_bai, b.ten_bai, count(*)::int so from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id=t.id join tai_lieu_cau tc on tc.phan_id=p.id
  join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau join hinh_hoc_bai b on b.ma_bai=h.dang_chinh where t.loai='de_thi' and t.khoi=$1 and h.xoa_at is null group by 1,2 order by 3 desc limit 12`, [khoi]))
// mẫu: 1 đề có nhomBai chứa câu hình
const de = await q(`select t.id, t.ten, t.cau_hinh->'deThi' dt from tai_lieu t where t.loai='de_thi' and t.khoi=$1 and jsonb_array_length(coalesce(t.cau_hinh->'deThi'->'nhomBai','[]'::jsonb))>0 order by t.created_at limit 40`, [khoi])
let in1 = 0
for (const d of de) {
  const hinh = new Set((await q(`select tc.ma_cau from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where p.tai_lieu_id=$1`, [d.id])).map(r => r.ma_cau))
  const nb = (d.dt.nhomBai || []).filter(g => JSON.stringify(g).match(/HH/) && [...hinh].some(mc => JSON.stringify(g).includes(mc)))
  if (!nb.length) continue
  if (in1++ >= 1) break
  console.log('\nĐỀ:', d.ten)
  console.log('khoá deThi:', Object.keys(d.dt))
  console.log('nhomBai[hình] mẫu:', JSON.stringify(nb[0]).slice(0, 900))
  const mcs = [...hinh].filter(mc => JSON.stringify(nb[0]).includes(mc))
  for (const r of await q(`select ma_cau, loai_cau, left(noi_dung, 420) nd, left(coalesce(loi_giai,''), 300) lg, anh_de is not null as co_anh from hinh_hoc_cau_hoi where ma_cau = any($1) order by ma_cau`, [mcs]))
    console.log('\n  ●', r.ma_cau, r.loai_cau, 'hình:', r.co_anh, '\n   ĐỀ:', r.nd.replace(/\n/g, ' ⏎ '), '\n   LG:', r.lg.replace(/\n/g, ' ⏎ '))
  console.log('nhanCau mẫu:', JSON.stringify(Object.fromEntries(Object.entries(d.dt.nhanCau || {}).filter(([k]) => mcs.includes(k)))))
}
await c.query('ROLLBACK'); await c.end()
