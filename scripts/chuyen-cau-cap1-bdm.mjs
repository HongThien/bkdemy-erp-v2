// Mang câu của kho cũ sang bản đồ mới K3 / K5 (Thùy 03/11: "Chuyển câu cũ từ kho sang") — y mẫu bước 7 của bdm-k4-lui-tang.mjs.
//   câu GỐC sống (không Đ/S) của mỗi dạng cũ -> dai_bdm_gan_cau (nguon 'doi_ung') vào dạng bài mới; bản sao đi theo gốc (_bdm_cau_giai).
//   Dạng cũ đối ứng >1 dạng mới (K5 Tổng Tỉ ẩn tổng · 4 dạng con) KHÔNG gán: thà để 'chưa gán' còn hơn đoán (§1.5).
//   Không đụng: dạng không có đối ứng ('Chưa phân dạng', Ôn tập giữa kỳ I K5). Không ghi đè câu đã có gan_cau.
//   node scripts/chuyen-cau-cap1-bdm.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const dem = async (khoi) => (await q(`
    with mot as (select u.ma_dang_cu, min(u.dich_dang_bai) db from dai_bdm_doi_ung u join dai_ban_do b on b.ma_dang=u.ma_dang_cu
                  where b.khoi=$1 group by 1 having count(*)=1 and count(u.dich_dang_bai)=1)
    select count(*) filter (where q.parent_ma_cau is null and q.loai_cau<>'dung_sai') goc,
           count(*) filter (where q.parent_ma_cau is null and q.loai_cau='dung_sai') ds,
           count(*) filter (where q.parent_ma_cau is not null) ban_sao,
           count(*) filter (where q.parent_ma_cau is null and q.loai_cau<>'dung_sai' and not exists(select 1 from mot where mot.ma_dang_cu=q.dang_chinh)
                            and exists (select 1 from dai_bdm_doi_ung u where u.ma_dang_cu=q.dang_chinh)) goc_da_dich
    from dai_cau_hoi q join dai_ban_do b on b.ma_dang=q.dang_chinh
    where b.khoi=$1 and q.xoa_at is null`, [khoi]))[0]
  for (const khoi of ['3', '5']) {
    const truoc = await dem(khoi)
    const r = await c.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
      select q.ma_cau, u.dich_dang_bai, 'doi_ung'
        from dai_ban_do b
        join dai_cau_hoi q on q.dang_chinh = b.ma_dang
        join dai_bdm_doi_ung u on u.ma_dang_cu = b.ma_dang
       where b.khoi = $1 and q.parent_ma_cau is null and q.xoa_at is null and q.loai_cau <> 'dung_sai' and u.dich_dang_bai is not null
         and (select count(*) from dai_bdm_doi_ung x where x.ma_dang_cu = b.ma_dang) = 1
         and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = q.ma_cau)
      on conflict (ma_cau) do nothing`, [khoi])
    // bản sao: _bdm_cau_giai phải thấy dạng bài qua gốc
    const sao = (await q(`select count(*) n from dai_cau_hoi s join dai_bdm_gan_cau g on g.ma_cau = s.parent_ma_cau
                           join dai_ban_do b on b.ma_dang = s.dang_chinh where b.khoi=$1 and s.xoa_at is null`, [khoi]))[0].n
    console.log(`K${khoi}: trước`, JSON.stringify(truoc), `· GÁN gốc ${r.rowCount} · bản sao theo gốc ${sao}`)
    if (+truoc.ds) throw new Error(`K${khoi}: có ${truoc.ds} câu Đ/S gốc — chưa xử lý, dừng`)
    const khong = (await q(`select count(*) n from dai_cau_hoi q join dai_ban_do b on b.ma_dang=q.dang_chinh where b.khoi=$1 and q.xoa_at is null and q.parent_ma_cau is null and q.loai_cau<>'dung_sai'
                             and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau=q.ma_cau)`, [khoi]))[0].n
    console.log(`   gốc còn CHƯA gán (không đối ứng / đối ứng >1): ${khong}`)
  }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
