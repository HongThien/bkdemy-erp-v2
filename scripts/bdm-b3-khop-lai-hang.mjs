// B3 KHỚP LẠI hàng duyệt — áp kết quả máy khớp lại (xuat-lo --hang) cho câu ĐANG Ở hàng duyệt (dai_bdm_de_xuat / dai_bdm_cau_thieu_dang).
//   node scripts/bdm-b3-khop-lai-hang.mjs <thư mục lô, vd kho-rules/dai/lo/b3/k6-hang2010> [--ghi]   (mặc định chạy thử rồi ROLLBACK)
// Cần: ket_qua.json (bdm-b3-gop-lo) + mau_kiem_dap_an.json (câu mẫu — bỏ qua).
// Mỗi câu thật, theo kết quả mới:
//   cao   ⇒ ghi dai_bdm_gan_cau (nguon 'ai'), rút khỏi hàng duyệt (xoá dòng de_xuat / thieu_dang của câu)
//   vừa   ⇒ có dòng de_xuat (thêm / cập nhật dạng + lý do); rút khỏi thieu_dang
//   trống ⇒ có dòng thieu_dang (thêm / cập nhật lý do); rút khỏi de_xuat
// CHỈ đụng dòng nguon='ai' (quyết định của người — nguon='nguoi' — giữ nguyên). Không đè câu đã có dai_bdm_gan_cau. Trigger bản đồ mới tự ghi dai_bdm_log.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'

const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const D = args.find((a) => !a.startsWith('--'))
if (!D) { console.error('Dùng: node scripts/bdm-b3-khop-lai-hang.mjs <thư mục lô> [--ghi]'); process.exit(2) }
const kq = JSON.parse(readFileSync(join(D, 'ket_qua.json'), 'utf8'))
const mau = JSON.parse(readFileSync(join(D, 'mau_kiem_dap_an.json'), 'utf8'))
const real = kq.filter((r) => !(r.ma_cau in mau))
const cao = real.filter((r) => r.dang_bai_id && r.chac === 'cao')
const vua = real.filter((r) => r.dang_bai_id && r.chac !== 'cao')
const trong = real.filter((r) => !r.dang_bai_id)
console.log(`câu thật ${real.length}: cao ${cao.length} · vừa ${vua.length} · trống ${trong.length}`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const ma = (a) => a.map((x) => x.ma_cau)
  // 1) CAO ⇒ gan_cau + rút khỏi hàng
  const g = await c.query(`
    insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
    select t.ma_cau, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma_cau, db)
    join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
    join dai_bdm_dang_bai d on d.id = t.db
    where not exists (select 1 from dai_bdm_gan_cau x where x.ma_cau = t.ma_cau)
      and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = t.ma_cau and x.nguon = 'nguoi')
      and not exists (select 1 from dai_bdm_cau_thieu_dang x where x.ma_cau = t.ma_cau and x.nguon = 'nguoi')
    on conflict (ma_cau) do nothing returning ma_cau`, [ma(cao), cao.map((x) => x.dang_bai_id)])
  const gMa = g.rows.map((r) => r.ma_cau)
  const r1 = await c.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai'`, [gMa])
  const r2 = await c.query(`delete from dai_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [gMa])
  console.log(`CAO: gan_cau +${g.rowCount}/${cao.length} · rút de_xuat ${r1.rowCount} · rút thieu_dang ${r2.rowCount}`)

  // 2) VỪA ⇒ de_xuat (upsert, chỉ dòng ai) + rút thieu_dang
  const v = await c.query(`
    insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon)
    select t.ma_cau, t.db, 'vua', t.ly, 'ai' from unnest($1::text[], $2::text[], $3::text[]) t(ma_cau, db, ly)
    join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
    join dai_bdm_dang_bai d on d.id = t.db
    where not exists (select 1 from dai_bdm_gan_cau x where x.ma_cau = t.ma_cau)
      and not exists (select 1 from dai_bdm_cau_thieu_dang x where x.ma_cau = t.ma_cau and x.nguon = 'nguoi')
    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = 'vua', ly_do = excluded.ly_do, at = now()
      where dai_bdm_de_xuat.nguon = 'ai' returning ma_cau`, [ma(vua), vua.map((x) => x.dang_bai_id), vua.map((x) => x.ly_do ?? '')])
  const r3 = await c.query(`delete from dai_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [v.rows.map((r) => r.ma_cau)])
  console.log(`VỪA: de_xuat upsert ${v.rowCount}/${vua.length} · rút thieu_dang ${r3.rowCount}`)

  // 3) TRỐNG ⇒ thieu_dang (upsert, chỉ dòng ai) + rút de_xuat
  const t = await c.query(`
    insert into dai_bdm_cau_thieu_dang (ma_cau, ly_do, nguon)
    select t.ma_cau, coalesce(nullif(btrim(t.ly), ''), 'AI không xếp được'), 'ai' from unnest($1::text[], $2::text[]) t(ma_cau, ly)
    join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
    where not exists (select 1 from dai_bdm_gan_cau x where x.ma_cau = t.ma_cau)
      and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = t.ma_cau and x.nguon = 'nguoi')
    on conflict (ma_cau) do update set ly_do = excluded.ly_do, at = now()
      where dai_bdm_cau_thieu_dang.nguon = 'ai' returning ma_cau`, [ma(trong), trong.map((x) => x.ly_do ?? '')])
  const r4 = await c.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai'`, [t.rows.map((r) => r.ma_cau)])
  console.log(`TRỐNG: thieu_dang upsert ${t.rowCount}/${trong.length} · rút de_xuat ${r4.rowCount}`)

  const dem = (await c.query(`select (select count(*) from dai_bdm_de_xuat) de_xuat, (select count(*) from dai_bdm_cau_thieu_dang) thieu_dang, (select count(*) from dai_bdm_gan_cau) gan_cau`)).rows[0]
  console.log('sau:', dem)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử, không ghi)')
} catch (e) { try { await c.query('rollback') } catch {} console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
