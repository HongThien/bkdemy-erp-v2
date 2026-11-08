// Bản đồ mới KHỐI 4 — LÙI XUỐNG 1 TẦNG, toàn bộ vào MỘT chủ đề «Số tự nhiên» (Thùy 28/10: "Cách m chuyển là đúng rồi. Chuyển đi.
// Và mang bài tập theo"). K4 chưa chạy bản đồ mới (không trong _bdm_ds_khoi_chay), 0 dạng bài, 0 câu gán lúc chuyển.
//   chủ đề (9) → chuyên đề · chuyên đề (26) → nhóm · nhóm (80) → dạng bài (mang theo mô tả + lý thuyết) — MÃ MỚI (đổi bảng = đổi loại mã)
//   đối ứng dạng cũ → nhóm (80) ⇒ dạng cũ → dạng bài mới (1–1) · tài liệu trỏ nhóm cũ ⇒ nhóm mới chứa dạng đó (bump updated_at)
//   "mang bài tập theo": câu GỐC sống của mỗi dạng cũ ⇒ dai_bdm_gan_cau (nguon 'doi_ung'); Đ/S ⇒ kho Đ/S chủ đề; bản sao theo gốc
//   rồi XOÁ chủ đề/ô/chuyên đề/nhóm cũ (Thùy gật 28/10). 1 transaction; lệch số ⇒ ROLLBACK.
//   node scripts/bdm-k4-lui-tang.mjs [--ghi]
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const KHOI = '4', TEN_CD = 'Số tự nhiên'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const one = async (s, p) => (await q(s, p))[0]
try {
  await c.query('begin')
  const cdCu = await q(`select id, ten, thu_tu from dai_bdm_chu_de where khoi = $1 and nhanh = 'toan' order by thu_tu`, [KHOI])
  if (cdCu.some((x) => x.ten === TEN_CD) || cdCu.length !== 9) throw new Error(`trạng thái K4 lạ (${cdCu.length} chủ đề) — dừng`)
  const ids = cdCu.map((x) => x.id)
  const dangCo = +(await one(`select count(*) n from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = any($1)`, [ids])).n
  if (dangCo) throw new Error(`K4 đã có ${dangCo} dạng bài — dừng`)
  const oCu = await q(`select o.chu_de_id, o.chuyen_de_id, o.thu_tu, cx.ten, cx.mo_ta from dai_bdm_o o join dai_bdm_chuyen_de cx on cx.id = o.chuyen_de_id where o.chu_de_id = any($1)`, [ids])
  const nhCu = await q(`select * from dai_bdm_nhom where chu_de_id = any($1)`, [ids])
  const duCu = +(await one(`select count(*) n from dai_bdm_doi_ung where dich_chu_de = any($1)`, [ids])).n
  if (duCu) throw new Error(`${duCu} dòng đối ứng trỏ thẳng ô (chủ đề, chuyên đề) K4 — chưa xử lý, dừng`)

  // 1) chủ đề mới
  const cdMoi = (await one(`insert into dai_bdm_chu_de (khoi, ten, thu_tu, nhanh) values ($1, $2, 100, 'toan') returning id`, [KHOI, TEN_CD])).id
  // 2) chủ đề cũ → chuyên đề mới (+ ô)
  const cxMoi = {}
  for (const x of cdCu) {
    const id = (await one(`insert into dai_bdm_chuyen_de (ten) values ($1) returning id`, [x.ten])).id
    await c.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values ($1, $2, $3)`, [cdMoi, id, x.thu_tu])
    cxMoi[x.id] = id
  }
  // 3) chuyên đề cũ → nhóm mới
  const nhMoi = {}   // key chu_de_cu|chuyen_de_cu → nhóm mới
  for (const o of oCu) {
    const id = (await one(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, thu_tu) values ($1, $2, $3, $4, $5) returning id`,
      [cdMoi, cxMoi[o.chu_de_id], o.ten, o.mo_ta, o.thu_tu])).id
    nhMoi[o.chu_de_id + '|' + o.chuyen_de_id] = id
  }
  // 4) nhóm cũ → dạng bài mới (mô tả + lý thuyết theo)
  const dbMoi = {}, nhChua = {}
  for (const n of nhCu) {
    const cha = nhMoi[n.chu_de_id + '|' + n.chuyen_de_id]
    if (!cha) throw new Error(`nhóm ${n.id} không có ô cha`)
    dbMoi[n.id] = (await one(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
      values ($1, $2, $3, $4, $5, $6, $7) returning id`, [cha, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file, n.thu_tu])).id
    nhChua[n.id] = cha
  }
  // 5) đối ứng: dạng cũ → dạng bài mới
  let du = 0
  for (const [cu, moi] of Object.entries(dbMoi)) du += (await c.query(`update dai_bdm_doi_ung set dich_dang_bai = $2, dich_nhom = null where dich_nhom = $1`, [cu, moi])).rowCount
  // 6) tài liệu trỏ nhóm cũ ⇒ nhóm mới chứa dạng đó; bump tài liệu
  let tl = 0
  for (const [cu, cha] of Object.entries(nhChua)) {
    const r = await c.query(`update tai_lieu_phan set ref_ma = $2 where ref_ma = $1 returning tai_lieu_id`, [cu, cha])
    tl += r.rowCount
    if (r.rowCount) await c.query(`update tai_lieu set updated_at = now() where id = any($1)`, [[...new Set(r.rows.map((x) => x.tai_lieu_id))]])
  }
  // 7) mang bài tập theo: câu gốc sống của dạng cũ ⇒ gán dạng bài mới; Đ/S ⇒ kho Đ/S chủ đề
  const gan = await c.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
    select q.ma_cau, d.dich_dang_bai, 'doi_ung' from dai_bdm_doi_ung d join dai_cau_hoi q on q.dang_chinh = d.ma_dang_cu
     where d.dich_dang_bai = any($1) and q.parent_ma_cau is null and q.xoa_at is null and q.loai_cau <> 'dung_sai'
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = q.ma_cau)
    on conflict (ma_cau) do nothing`, [Object.values(dbMoi)])
  const ds = await c.query(`insert into dai_bdm_kho_ds (ma_cau, chu_de_id, nguon)
    select q.ma_cau, $2, 'ai' from dai_bdm_doi_ung d join dai_cau_hoi q on q.dang_chinh = d.ma_dang_cu
     where d.dich_dang_bai = any($1) and q.parent_ma_cau is null and q.xoa_at is null and q.loai_cau = 'dung_sai'
       and not exists (select 1 from dai_bdm_kho_ds k where k.ma_cau = q.ma_cau)
    on conflict do nothing`, [Object.values(dbMoi), cdMoi])
  // 8) xoá bản cũ (lá → gốc)
  const xNh = await c.query(`delete from dai_bdm_nhom where id = any($1)`, [nhCu.map((n) => n.id)])
  const xO = await c.query(`delete from dai_bdm_o where chu_de_id = any($1)`, [ids])
  const xCx = await c.query(`delete from dai_bdm_chuyen_de where id = any($1)`, [oCu.map((o) => o.chuyen_de_id)])
  const xCd = await c.query(`delete from dai_bdm_chu_de where id = any($1)`, [ids])
  await c.query(`update dai_bdm_chu_de set thu_tu = 1 where id = $1`, [cdMoi])

  // kiểm
  const sau = await one(`select (select count(*) from dai_bdm_chu_de where khoi = $1) cd, (select count(*) from dai_bdm_o where chu_de_id = $2) cx,
     (select count(*) from dai_bdm_nhom where chu_de_id = $2) nh, (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = $2) db,
     (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = $2 and coalesce(d.ly_thuyet,'') <> '') lt`, [KHOI, cdMoi])
  console.log(`chủ đề mới ${cdMoi} «${TEN_CD}»: chuyên đề ${Object.keys(cxMoi).length} · nhóm ${Object.keys(nhMoi).length} · dạng bài ${Object.keys(dbMoi).length}`)
  console.log(`đối ứng nối lại ${du} · phần tài liệu nối lại ${tl} · gán câu gốc ${gan.rowCount} · Đ/S vào kho chủ đề ${ds.rowCount}`)
  console.log(`xoá cũ: nhóm ${xNh.rowCount} · ô ${xO.rowCount} · chuyên đề ${xCx.rowCount} · chủ đề ${xCd.rowCount}`)
  console.log('sau:', sau)
  const ok = +sau.cd === 1 && +sau.cx === cdCu.length && +sau.nh === oCu.length && +sau.db === nhCu.length && du === nhCu.length
    && xNh.rowCount === nhCu.length && xCd.rowCount === cdCu.length && xCx.rowCount === oCu.length
  if (!ok) throw new Error('lệch số — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
