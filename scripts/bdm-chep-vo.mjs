// Chép VỎ bản đồ cũ (Đại) sang BẢN ĐỒ MỚI nháp — CEO 08/10, spec-ban-do-4-tang.md §9.3.
//   chủ đề → chủ đề (giữ khối + thứ tự mã) · chuyên đề → chuyên đề (mỗi cái riêng, CEO tự gộp thành dùng chung)
//   dạng   → NHÓM BÀI (kèm lý thuyết + mô tả ngắn) · cụm → DẠNG BÀI
//   + ghi ĐỐI ỨNG: dạng cũ → nhóm chép từ nó (②) · cụm cũ → dạng bài chép từ nó ⇒ câu có cụm tự về dạng bài,
//     câu chưa có cụm hiện "chưa gán" trên nhóm (AI gán sau). KHÔNG chép câu.
//   BỎ (CEO 08/10): "Chưa phân dạng" (T1xx000000) + chủ đề THÙNG (danh sách THUNG dưới đây).
//   Khối nào đã có chủ đề trong bản nháp ⇒ BỎ QUA khối đó (không nhân đôi việc CEO đã soạn).
//
// Chạy:  node scripts/bdm-chep-vo.mjs          → chạy thử trong ROLLBACK, in số liệu
//        node scripts/bdm-chep-vo.mjs --ghi    → ghi thật (1 transaction; lệch số kiểm ⇒ ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')

const GHI = process.argv.includes('--ghi')
const THUNG = ['T11105', 'T10703', 'T10804', 'T10910', 'T10911', 'T10908'] // Ôn tập khối 10 · Đề thi đầu vào M9 (K7, K8) · Ôn tập 8 · Đề thi đầu vào · Các dạng bài Toán nâng cao

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const daCo = (await q(`select distinct khoi from dai_bdm_chu_de`)).map((r) => r.khoi)
  if (daCo.length) console.log('Bỏ qua khối đã có bản nháp:', daCo.join(', '))

  // Dạng cũ được chép (nguồn mọi bước sau)
  await q(`create temp table nguon on commit drop as
    select b.* from dai_ban_do b
     where b.ma_dang not like '%000000' and b.ma_chu_de <> all ($1::text[]) and b.khoi <> all ($2::text[])`, [THUNG, daCo])

  await q(`create temp table m_cd on commit drop as
    select x.khoi, x.ma_chu_de, x.ten,
           row_number() over (partition by x.khoi order by x.ma_chu_de) as tt,
           'NCD' || lpad(nextval('dai_bdm_chu_de_seq')::text, 5, '0') as id
      from (select distinct on (ma_chu_de) khoi, ma_chu_de, ten_chu_de as ten from nguon order by ma_chu_de) x`)
  await q(`insert into dai_bdm_chu_de (id, khoi, ten, thu_tu) select id, khoi, ten, tt from m_cd`)

  await q(`create temp table m_ch on commit drop as
    select x.ma_chu_de, x.ma_chuyen_de, x.ten,
           row_number() over (partition by x.ma_chu_de order by coalesce(t.thu_tu, 10000), x.ma_chuyen_de) as tt,
           'NCH' || lpad(nextval('dai_bdm_chuyen_de_seq')::text, 5, '0') as id
      from (select distinct on (ma_chuyen_de) ma_chu_de, ma_chuyen_de, ten_chuyen_de as ten from nguon order by ma_chuyen_de) x
      left join dai_chuyen_de_thu_tu t on t.ma_chuyen_de = x.ma_chuyen_de`)
  await q(`insert into dai_bdm_chuyen_de (id, ten) select id, ten from m_ch`)
  await q(`insert into dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu)
           select cd.id, ch.id, ch.tt from m_ch ch join m_cd cd on cd.ma_chu_de = ch.ma_chu_de`)

  await q(`create temp table m_n on commit drop as
    select b.ma_dang, b.ma_chu_de, b.ma_chuyen_de, b.ten_dang, coalesce(b.mo_ta_ngan, '') as mo_ta,
           row_number() over (partition by b.ma_chuyen_de order by b.ma_dang) as tt,
           'NNB' || lpad(nextval('dai_bdm_nhom_seq')::text, 5, '0') as id
      from nguon b`)
  await q(`insert into dai_bdm_nhom (id, chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
           select n.id, cd.id, ch.id, n.ten_dang, n.mo_ta, coalesce(lt.noi_dung, ''), lt.file_url, lt.ten_file, n.tt
             from m_n n
             join m_cd cd on cd.ma_chu_de = n.ma_chu_de
             join m_ch ch on ch.ma_chuyen_de = n.ma_chuyen_de
             left join dai_dang_ly_thuyet lt on lt.ma_dang = n.ma_dang`)
  await q(`insert into dai_bdm_doi_ung (ma_dang_cu, dich_nhom) select ma_dang, id from m_n`)

  await q(`create temp table m_db on commit drop as
    select cb.ma_cum, n.id as nhom_id, coalesce(nullif(btrim(cb.ten), ''), 'Cụm ' || cb.thu_tu) as ten,
           row_number() over (partition by cb.ma_dang order by cb.thu_tu, cb.ma_cum) as tt,
           'NDB' || lpad(nextval('dai_bdm_dang_bai_seq')::text, 5, '0') as id
      from dai_cum_bai cb join m_n n on n.ma_dang = cb.ma_dang`)
  await q(`insert into dai_bdm_dang_bai (id, nhom_id, ten, thu_tu) select id, nhom_id, ten, tt from m_db`)
  await q(`insert into dai_bdm_doi_ung_cum (ma_cum_cu, dang_bai_id) select ma_cum, id from m_db`)

  // ── Kiểm số ──
  const [k] = await q(`select
      (select count(*) from nguon) as dang_nguon,
      (select count(distinct ma_chu_de) from nguon) as cd_nguon,
      (select count(distinct ma_chuyen_de) from nguon) as ch_nguon,
      (select count(*) from dai_cum_bai where ma_dang in (select ma_dang from nguon)) as cum_nguon,
      (select count(*) from dai_dang_ly_thuyet where ma_dang in (select ma_dang from nguon) and (btrim(noi_dung) <> '' or file_url is not null)) as lt_nguon,
      (select count(*) from m_cd) as cd, (select count(*) from m_ch) as ch, (select count(*) from m_n) as nhom, (select count(*) from m_db) as db,
      (select count(*) from dai_bdm_nhom where id in (select id from m_n) and (btrim(ly_thuyet) <> '' or ly_thuyet_file_url is not null)) as nhom_lt,
      (select count(*) from dai_bdm_doi_ung where dich_nhom in (select id from m_n)) as doi_ung,
      (select count(*) from dai_bdm_doi_ung_cum where dang_bai_id in (select id from m_db)) as doi_ung_cum`)
  console.table(k)
  const lech = [['dang_nguon', 'nhom'], ['cd_nguon', 'cd'], ['ch_nguon', 'ch'], ['cum_nguon', 'db'], ['lt_nguon', 'nhom_lt'], ['dang_nguon', 'doi_ung'], ['cum_nguon', 'doi_ung_cum']]
    .filter(([a, b]) => String(k[a]) !== String(k[b]))
  const theoKhoi = await q(`select cd.khoi, count(distinct cd.id) chu_de, count(distinct o.chuyen_de_id) chuyen_de, count(distinct n.id) nhom, count(distinct d.id) dang_bai
      from m_cd cd left join dai_bdm_o o on o.chu_de_id = cd.id left join dai_bdm_nhom n on n.chu_de_id = cd.id
      left join dai_bdm_dang_bai d on d.nhom_id = n.id group by 1 order by 1`)
  console.table(theoKhoi)
  // Chưa gán sau khi chép (câu có cụm phải tự về; câu chưa cụm hiện ở nhóm)
  for (const kh of ['6', '12']) {
    const tong = (await q(`select fn_bdm_cay($1) -> 'tong' t`, [kh]))[0]?.t
    console.log(`khối ${kh} — tổng sau chép:`, JSON.stringify(tong))
  }
  if (lech.length) {
    console.log('❌ LỆCH SỐ:', lech.map(([a, b]) => `${a}=${k[a]} ≠ ${b}=${k[b]}`).join(' · '), '⇒ ROLLBACK')
    await c.query('rollback')
  } else if (GHI) {
    await c.query('commit'); console.log('✅ COMMIT — đã chép vỏ')
  } else {
    await c.query('rollback'); console.log('(chạy thử — ROLLBACK, chưa ghi gì; thêm --ghi để ghi thật)')
  }
} catch (e) {
  await c.query('rollback'); console.log('❌ LỖI ⇒ ROLLBACK:', e.message, e.where ?? '')
}
await c.end()
