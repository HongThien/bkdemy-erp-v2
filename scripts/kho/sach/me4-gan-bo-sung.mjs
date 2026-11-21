// me4-gan-bo-sung.mjs — GHI ĐỀ XUẤT dạng bài cho các câu ME4 sau khi bản đồ được bổ sung 9 dạng (Thùy duyệt 21/11).
//   node scripts/kho/sach/me4-gan-bo-sung.mjs <khop.json> <dang-mu-bs.json> [--ghi]
// khop.json = [{ ma_cau, ma_nguon, dang, dx_cu }] — các câu mà trạm LÀM và trạm gán MÙ (Opus) cùng ra MỘT dạng.
// Khác gan-dang.mjs: gan-dang từ chối câu ĐÃ có đề xuất; ở đây có 2 câu mang đề xuất tạm (chưa duyệt) cần sửa sang dạng đúng ⇒ UPDATE đề xuất
// (chỉ khi dạng cũ trùng `dx_cu` đã đọc, chưa ai duyệt/gán). Câu chưa có đề xuất ⇒ INSERT. Mức chắc = mức của trạm mù (cao | vua).
// Không --ghi: chạy thử trong transaction rồi ROLLBACK.
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const [khopTep, muTep] = process.argv.slice(2).filter((x) => !x.startsWith('--'))
const GHI = process.argv.includes('--ghi')
if (!khopTep || !muTep) { console.error('Dùng: node scripts/kho/sach/me4-gan-bo-sung.mjs <khop.json> <dang-mu-bs.json> [--ghi]'); process.exit(2) }
const khop = JSON.parse(readFileSync(khopTep, 'utf8')), mu = JSON.parse(readFileSync(muTep, 'utf8'))
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
const CHO = 'T14T000000'
let ma = 0
const dem = { moi: 0, sua: 0, bo_qua: 0 }
try {
  await db.query('begin')
  const bd = new Set((await db.query(`select ma_dang from bdm_ban_do where khoi = '4T' and nhanh_bdm = 'toan'`)).rows.map((r) => r.ma_dang))
  for (const k of khop) {
    const { rows: [q] } = await db.query(`select dang_chinh, xoa_at, ten_de_goc, da_duyet,
        exists (select 1 from dai_bdm_gan_cau x where x.ma_cau in (c.ma_cau, c.parent_ma_cau)) co_gan,
        (select dang_bai_id from dai_bdm_de_xuat x where x.ma_cau = c.ma_cau) dx
      from dai_cau_hoi c where ma_cau = $1`, [k.ma_cau])
    const nhan = `${k.ma_cau} (${k.ma_nguon})`
    if (!q || q.xoa_at || q.dang_chinh !== CHO || q.co_gan || !q.ten_de_goc?.endsWith(`· ${k.ma_nguon}`)) { console.log(`  bỏ qua ${nhan}: không còn đúng điều kiện`); dem.bo_qua++; continue }
    if (!bd.has(k.dang)) { console.log(`  bỏ qua ${nhan}: dạng ${k.dang} không có trong bản đồ 4T`); dem.bo_qua++; continue }
    const m = mu[k.ma_nguon]
    const chac = m?.chac === 'cao' ? 'cao' : 'vua'
    const ly = `kiem-dang=dat/model_khac (claude-opus-5-5 gán mù ra cùng dạng ${k.dang}; lượt me4-mu-bs-2026-11-21; làm: claude-sonnet-5-5 sau khi bản đồ bổ sung 9 dạng) · ${String(m?.ly_do ?? '').slice(0, 300)}`
    if (q.dx == null) {
      await db.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, $3, $4, 'ai')`, [k.ma_cau, k.dang, chac, ly]); dem.moi++
    } else if (q.dx === k.dx_cu) {
      if (q.dx === k.dang) { dem.bo_qua++; continue }
      await db.query(`update dai_bdm_de_xuat set dang_bai_id = $2, chac = $3, ly_do = $4, at = now() where ma_cau = $1 and dang_bai_id = $5`, [k.ma_cau, k.dang, chac, ly, k.dx_cu]); dem.sua++
      console.log(`  sửa đề xuất ${nhan}: ${k.dx_cu} → ${k.dang}`)
    } else { console.log(`  bỏ qua ${nhan}: đề xuất đã đổi (${q.dx}) so với lúc đọc (${k.dx_cu})`); dem.bo_qua++ }
  }
  const { rows: [t] } = await db.query(`select count(*) n, count(*) filter (where x.chac = 'cao') cao from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau = x.ma_cau where q.ten_de_goc like 'Toán 4 ME · %'`)
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', JSON.stringify(dem), `· câu ME4 có đề xuất dạng: ${t.n} (mức cao ${t.cao})`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
