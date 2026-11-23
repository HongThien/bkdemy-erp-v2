// Hình–Học K8 · sửa chữ đề 2 câu cuối kì 1 bị máy kiểm báo "đề gốc lỗi" rồi duyệt (Thùy 23/11: "Sửa rồi duyệt").
//   HHC015483 (HH00176): đề thiếu định nghĩa E ⇒ "Gọi D, E lần lượt là điểm đối xứng với H qua AB và AC" (khớp lời giải + ý d); bỏ chữ "Bổ sung đề" / "(đề bổ sung)" trong lời giải.
//   HHC015613 (HH00183): ý a "DECF" ⇒ "EMCF" (khớp ý c + lời giải đang làm).
//   node scripts/kho/hh-k8-sua-de-2-cau-loi-duyet.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-sua-de-2-cau-loi-duyet.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-sua-de-2-cau-loi-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const nhanDoi = (s, tu, den) => { if (s.split(tu).length !== 2) throw new Error('không khớp đúng 1 chỗ: ' + tu); return s.replace(tu, den) }
const SUA = {
  HHC015483: { dang: 'HH00176', nd: (s) => nhanDoi(s, 'Gọi $D$ là điểm đối xứng với $H$ qua $AC$.', 'Gọi $D$, $E$ lần lượt là điểm đối xứng với $H$ qua $AB$ và $AC$.'),
    lg: (s) => { s = nhanDoi(s, 'Bổ sung đề: $D$ là điểm đối xứng với $H$ qua $AB$, $E$ là điểm đối xứng với $H$ qua $AC$.\n\n', ''); s = nhanDoi(s, 'qua $AB$ (đề bổ sung)', 'qua $AB$ (gt)'); return nhanDoi(s, 'qua $AC$ (đề bổ sung)', 'qua $AC$ (gt)') } },
  HHC015613: { dang: 'HH00183', nd: (s) => nhanDoi(s, 'a) Tứ giác $DECF$ là hình bình hành.', 'a) Tứ giác $EMCF$ là hình bình hành.'), lg: (s) => s },
}
await c.query('begin')
try {
  const lui = []
  for (const [ma, f] of Object.entries(SUA)) {
    const [r] = await q(`select noi_dung, loi_giai, dang_chinh, da_duyet from hinh_hoc_cau_hoi where ma_cau=$1 and xoa_at is null`, [ma])
    if (!r || r.dang_chinh !== f.dang || r.da_duyet) throw new Error(ma + ' không ở trạng thái mong đợi')
    const nd = f.nd(r.noi_dung), lg = f.lg(r.loi_giai)
    lui.push({ ma_cau: ma, noi_dung_cu: r.noi_dung, loi_giai_cu: r.loi_giai })
    await q(`update hinh_hoc_cau_hoi set noi_dung=$2, loi_giai=$3, da_duyet=true, duyet_at=now(), duyet_nguon='ai' where ma_cau=$1`, [ma, nd, lg])
    console.log(ma, '→ sửa đề + duyệt')
  }
  const sau = await q(`select ma_cau, da_duyet, kho_chuan, left(noi_dung, 140) nd, (loi_giai ~ 'đề bổ sung|Bổ sung đề') con_chu_bo_sung from hinh_hoc_cau_hoi where ma_cau = any($1)`, [Object.keys(SUA)])
  console.log(sau)
  if (sau.some((s) => !s.da_duyet || !s.kho_chuan || s.con_chu_bo_sung)) throw new Error('đọc lại không đạt')
  const tong = await q(`select count(*) filter (where da_duyet) duyet, count(*) filter (where kho_chuan) chuan, count(*) n from hinh_hoc_cau_hoi where dang_chinh = any($1) and xoa_at is null and ma_cau = any($2)`, [['HH00173','HH00174','HH00175','HH00176','HH00183','HH00184','HH00185','HH00186','HH00187','HH00188'], JSON.parse(fs.readFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json', 'utf8')).map((x) => x.ma_cau)])
  console.log('136 câu cuối kì:', tong[0])
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-sua-de-2-cau-loi-23-11.json', JSON.stringify(lui, null, 1)); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
