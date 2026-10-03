// Kiểm SAU khi nhập 1 khối Hạt Mầm — đọc thẳng DB (không tin log của nhap.mjs) + thử tải 1 ảnh. CHỈ ĐỌC.
// Chạy: node scripts/khtn-hatmam/kiem-sau-nhap.mjs <khối>
import pg from 'pg'
process.loadEnvFile('.env')
const khoi = process.argv[2]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
console.log(await q(`select count(*)::int cau, count(*) filter (where right(dang_chinh, 6) = '000000')::int dang_cho,
    count(*) filter (where da_duyet)::int da_duyet, count(distinct dang_chinh)::int so_dang, count(*) filter (where muc_cau is null)::int thieu_muc,
    count(*) filter (where noi_dung like '%](hinh/%' or loi_giai like '%](hinh/%')::int anh_chua_doi
  from khtn_cau_hoi where ten_de_goc like 'Hạt Mầm · K0' || $1 || '%' and xoa_at is null`, [khoi]))
console.log(await q(`select d.loai, count(*)::int so, sum((select count(*) from khtn_de_xuat_cau x where x.de_xuat_id = d.id))::int cau,
    count(*) filter (where exists (select 1 from khtn_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))::int da_quyet
  from khtn_de_xuat d where d.lo = $1 group by 1`, ['hatmam-k' + khoi]))
// đề xuất dạng mới TRÙNG tên trong cùng chuyên đề (agent cố ý đặt cùng tên để gộp) — học thuật sẽ thấy 2 thẻ cho 1 dạng
console.log(await q(`select ma_chuyen_de, ten, count(*)::int so from khtn_de_xuat where lo = $1 and loai = 'dang_moi' group by 1, 2 having count(*) > 1`, ['hatmam-k' + khoi]))
// câu trong đề xuất phải đang ở dạng chờ
console.log(await q(`select count(*)::int cau_de_xuat_khong_o_dang_cho from khtn_de_xuat_cau x join khtn_de_xuat d on d.id = x.de_xuat_id
  join khtn_cau_hoi q on q.ma_cau = x.ma_cau where d.lo = $1 and right(q.dang_chinh, 6) <> '000000'`, ['hatmam-k' + khoi]))
const [{ url }] = await q(`select substring(noi_dung from '\\((https://[^)]+/hat_mam/[^)]+)\\)') url from khtn_cau_hoi
  where ten_de_goc like 'Hạt Mầm · K0' || $1 || '%' and noi_dung like '%/hat_mam/%' limit 1`, [khoi])
const r = await fetch(url); console.log('ảnh mẫu', r.status, r.headers.get('content-type'), url.split('/').slice(-3).join('/'))
await c.end()
