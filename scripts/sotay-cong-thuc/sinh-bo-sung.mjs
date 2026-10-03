// ============================================================================
// Sinh migration BỔ SUNG thẻ Toán 12 theo khuôn mục sổ tay (toan12-bo-sung.mjs) ⇒ stdout.
//   node scripts/sotay-cong-thuc/sinh-bo-sung.mjs > supabase/migrations/<ts>_sotay_toan12_bo_sung.sql
// Kiểm trước khi sinh (lỗi ⇒ dừng, không in SQL): đủ đúng bộ mã thẻ · mọi `lq` trỏ thẻ có thật · mọi $…$ render được
// bằng KaTeX ở chế độ strict (bắt cả chữ có dấu lọt vào công thức).
// Chỉ ghi vào thẻ CHƯA AI SỬA (cap_nhat_boi null, chưa có cong_thuc, còn chờ duyệt) — không đè việc người làm trên ERP.
// ============================================================================
import katex from 'katex'
import { THE } from './toan12.mjs'
import { BO_SUNG } from './toan12-bo-sung.mjs'

const loi = []
const maThe = new Set(THE.map((t) => t.ma))
for (const ma of maThe) if (!BO_SUNG[ma]) loi.push(`thiếu bổ sung cho ${ma}`)
for (const ma of Object.keys(BO_SUNG)) if (!maThe.has(ma)) loi.push(`bổ sung cho mã lạ ${ma}`)
const kiemTex = (ma, s) => {
  for (const m of String(s).matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'error' }) } catch (e) { loi.push(`${ma}: ${e.message.split('\n')[0]} — ${m[1].slice(0, 60)}`) }
  }
}
for (const [ma, b] of Object.entries(BO_SUNG)) {
  if (!b.tom_tat || !b.vd?.de || !b.vd?.kq || !b.nham?.length) loi.push(`${ma}: thiếu tóm tắt / ví dụ / hay nhầm`)
  for (const x of b.lq ?? []) if (!maThe.has(x)) loi.push(`${ma}: lq trỏ mã không có ${x}`)
  for (const s of [b.tom_tat, b.vd?.de, b.vd?.kq, ...(b.vd?.buoc ?? []), ...(b.nham ?? []), ...(b.bien ?? []).flat()]) kiemTex(ma, s)
}
if (loi.length) { console.error(loi.join('\n')); process.exit(1) }

const s = (v) => v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`
const j = (v) => v == null ? 'null' : `${s(JSON.stringify(v))}::jsonb`
const arr = (a) => `array[${(a ?? []).map(s).join(', ')}]::text[]`
const ra = []
ra.push(`-- ============================================================================
-- Bổ sung ${Object.keys(BO_SUNG).length} thẻ Toán 12 theo KHUÔN MỤC SỔ TAY chung (Thùy 03/10: "Toán cũng kiểu thế" — như mục KHTN).
-- Sinh bằng scripts/sotay-cong-thuc/sinh-bo-sung.mjs — đừng sửa tay.
-- Mỗi thẻ: công thức cũ (noi_dung) → cong_thuc · noi_dung = 1 câu tóm tắt · vd (ví dụ từng bước) · nham (hay nhầm) · bien (kí hiệu, thẻ thống kê) · lq (xem thêm).
-- Chỉ ghi thẻ CHƯA AI SỬA trên ERP (cap_nhat_boi null, cong_thuc null, chờ duyệt) — thẻ người đã sửa giữ nguyên. Thẻ vẫn 'cho_duyet'.
-- Trigger ghi nhật ký 'sua' kèm bản cũ cho từng thẻ.
-- MẤT GÌ: không — nội dung cũ chuyển sang cột cong_thuc, bản cũ còn trong sotay_ct_lich_su.ban_cu.
-- ============================================================================
`)
for (const [ma, b] of Object.entries(BO_SUNG)) {
  ra.push(`update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = ${s(b.tom_tat)},
  vd = ${j(b.vd)}, nham = ${j(b.nham)}, bien = ${j(b.bien ?? null)}, lq = ${arr(b.lq)}
where ma = ${s(ma)} and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';
`)
}
process.stdout.write(ra.join('\n'))
