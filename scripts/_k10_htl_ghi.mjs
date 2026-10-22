// Ghi kết quả duyệt lại chuyên đề Hệ thức lượng K10 (19/10).   node scripts/_k10_htl_ghi.mjs [--ghi]   (mặc định chạy khô, ROLLBACK)
//   GAN       → dai_bdm_gan_cau (nguon 'ai'), KHÔNG đè gán đã có; câu đang là đề xuất tự rời hàng đợi (_bdm_khop_nguon loại câu đã gán)
//   DEXUAT    → cập nhật dai_bdm_de_xuat (dang_bai_id + ly_do, chac 'vua')
//   KHONGKHOP → chỉ nối ghi chú vào ly_do của đề xuất cũ (không xoá, không chuyển)
import fs from 'node:fs'
import pg from 'pg'
import { GAN, DEXUAT, KHONGKHOP } from '../kho-rules/dai/lo/k10-htl/quyet-dinh.mjs'

const GHI = process.argv.includes('--ghi')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')
try {
  const dem = async () => (await c.query(`select (select count(*) from dai_bdm_gan_cau) gan, (select count(*) from dai_bdm_de_xuat) dx`)).rows[0]
  const truoc = await dem()
  // GAN
  const r1 = await c.query(`
    insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
    select t.m, t.d, 'ai' from unnest($1::text[], $2::text[]) t(m, d)
    join dai_cau_hoi q on q.ma_cau = t.m and q.xoa_at is null and q.loai_cau <> 'dung_sai'
    join dai_bdm_dang_bai b on b.id = t.d
    join dai_bdm_de_xuat x on x.ma_cau = t.m
    where not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.m)
    on conflict (ma_cau) do nothing`, [GAN.map((x) => x[0]), GAN.map((x) => x[1])])
  // DEXUAT (chỉ câu còn là đề xuất và chưa được gán)
  let r2 = 0
  for (const [m, d, ly] of DEXUAT) {
    r2 += (await c.query(`update dai_bdm_de_xuat x set dang_bai_id = $2, ly_do = $3, chac = 'vua', nguon = 'ai', at = now()
      where x.ma_cau = $1 and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = x.ma_cau)`, [m, d, `[duyệt lại 19/10] ${ly}`])).rowCount
  }
  // KHÔNG KHỚP: nối ghi chú
  let r3 = 0
  for (const [m, ly] of Object.entries(KHONGKHOP)) {
    r3 += (await c.query(`update dai_bdm_de_xuat x set ly_do = $2, at = now()
      where x.ma_cau = $1 and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = x.ma_cau)`, [m, `[duyệt lại 19/10] KHÔNG khớp dạng nào của chuyên đề (${ly}) — đề xuất thiếu dạng. ${'(đề xuất cũ giữ nguyên chờ Thùy quyết)'}`])).rowCount
  }
  const sau = await dem()
  console.log({ gan_chen: r1.rowCount, ky_vong_gan: GAN.length, dx_cap_nhat: r2, ky_vong_dx: DEXUAT.length, khong_khop_ghi_chu: r3, ky_vong_kk: Object.keys(KHONGKHOP).length, truoc, sau })
  if (r1.rowCount !== GAN.length || r2 !== DEXUAT.length || r3 !== Object.keys(KHONGKHOP).length) throw new Error('lệch số dòng so với kỳ vọng — không ghi')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? 'ĐÃ GHI' : 'chạy khô (rollback)')
} catch (e) { await c.query('rollback'); console.log('LỖI → rollback:', e.message) }
await c.end()
