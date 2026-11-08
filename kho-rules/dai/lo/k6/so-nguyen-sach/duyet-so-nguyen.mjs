// duyet-so-nguyen.mjs — Thùy 27/10 "Duyệt toàn bộ bài số nguyên": (1) CHẤP NHẬN dạng bài (đề xuất AI / gán AI → gán 'nguoi' qua _bdm_nguoi_gan_cau) cho mọi câu Đại K6 thuộc chủ đề SỐ NGUYÊN (NCD00189);
//   (2) đặt da_duyet=true (duyet_nguon='ai' — AI thực thi theo lệnh CEO, không giả là người duyệt từng câu); (3) duyệt luôn 196 câu bài giảng ở kho trên lớp (dai_cau_lop).
//   node kho-rules/dai/lo/k6/so-nguyen-sach/duyet-so-nguyen.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k6/so-nguyen-sach/'
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  // phạm vi: câu thường (không Đ/S), chưa xoá, có đề xuất HOẶC gán vào dạng của chủ đề số nguyên
  const ds = await q(`select x.ma_cau, x.dang_bai_id, 'de_xuat' src from dai_bdm_de_xuat x join dai_bdm_dang_bai d on d.id=x.dang_bai_id join dai_bdm_nhom n on n.id=d.nhom_id join dai_cau_hoi c on c.ma_cau=x.ma_cau
     where n.chu_de_id='NCD00189' and c.xoa_at is null and c.loai_cau<>'dung_sai'
     union all select g.ma_cau, g.dang_bai_id, 'gan_'||g.nguon from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id=g.dang_bai_id join dai_bdm_nhom n on n.id=d.nhom_id join dai_cau_hoi c on c.ma_cau=g.ma_cau
     where n.chu_de_id='NCD00189' and c.xoa_at is null and c.loai_cau<>'dung_sai'`)
  const dem = {}; for (const r of ds) dem[r.src] = (dem[r.src] ?? 0) + 1
  console.log('phạm vi câu thường:', ds.length, JSON.stringify(dem))
  for (const r of ds) await c.query(`select public._bdm_nguoi_gan_cau('dai',$1,$2)`, [r.ma_cau, r.dang_bai_id])
  const ma = ds.map((r) => r.ma_cau)
  // đề xuất đã được CHẤP NHẬN (thành gán 'nguoi') ⇒ rút dòng đề xuất của đúng các câu này (quy ước rút hàng đợi câu vừa gán)
  const xo = await c.query(`delete from dai_bdm_de_xuat where ma_cau = any($1)`, [ma])
  console.log('rút dòng đề xuất:', xo.rowCount)
  const up = await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau=any($1) and not da_duyet`, [ma])
  console.log('dai_cau_hoi duyệt mới:', up.rowCount, '(đã duyệt từ trước:', ma.length - up.rowCount, ')')
  const sau = await q(`select (select count(*) from dai_bdm_de_xuat x where x.ma_cau=any($1)) con_de_xuat, (select count(*) from dai_bdm_gan_cau g where g.ma_cau=any($1) and g.nguon='nguoi') gan_nguoi, (select count(*) from dai_cau_hoi c where c.ma_cau=any($1) and c.da_duyet and c.kho_chuan) kho_chuan`, [ma])
  console.log('sau:', JSON.stringify(sau[0]))
  // kho trên lớp
  const gm = JSON.parse(readFileSync(D + 'giang-ma-cau.json', 'utf8'))
  const ul = await c.query(`update dai_cau_lop set da_duyet=true, duyet_at=now() where ma_cau=any($1) and xoa_at is null and not da_duyet`, [gm])
  console.log('dai_cau_lop duyệt:', ul.rowCount, '/', gm.length)
  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK (chạy thử)') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
