// ============================================================================
// Sinh SQL nạp thẻ công thức từ toan12.mjs ⇒ in ra stdout (dán vào file migration seed).
//   node scripts/sotay-cong-thuc/sinh-seed.mjs > supabase/migrations/<ts>_sotay_cong_thuc_seed_toan12.sql
//
// Mọi thẻ vào DB ở trạng thái 'cho_duyet' (spec §4: chưa có 2 nguồn độc lập ⇒ GV duyệt hết).
// SAU KHI NẠP: DB là chân lý, sửa trên ERP (màn Sổ tay). toan12.mjs chỉ còn là đầu vào lịch sử —
// đừng sửa file rồi nạp lại đè lên bản người đã duyệt.
// `on conflict do nothing` ⇒ chạy lại không đè thẻ đã có.
// ============================================================================
import { THE, HINH, CHU_DE } from './toan12.mjs'

const MON = 'Toán', KHOI = '12'
// Chuỗi SQL chuẩn: chỉ nhân đôi nháy đơn (standard_conforming_strings = on ⇒ `\` giữ nguyên — LaTeX an toàn).
const s = (v) => v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`
const arr = (a) => `array[${(a ?? []).map(s).join(', ')}]::text[]`

const out = []
out.push(`-- ============================================================================
-- Nạp đợt 1 SỔ TAY CÔNG THỨC — Toán 12 (sinh bằng scripts/sotay-cong-thuc/sinh-seed.mjs, đừng sửa tay)
-- ${CHU_DE.length} chủ đề · ${HINH.length} hình (chưa có ảnh) · ${THE.length} thẻ, tất cả 'cho_duyet'.
-- MẤT GÌ: không. Chỉ INSERT, on conflict do nothing.
-- ============================================================================
`)
out.push('insert into public.sotay_ct_chu_de (mon, khoi, ma, ten, thu_tu) values')
out.push(CHU_DE.map((c, i) => `  (${s(MON)}, ${s(KHOI)}, ${s(c.ma)}, ${s(c.ten)}, ${i + 1})`).join(',\n') + '\non conflict do nothing;\n')

out.push('insert into public.sotay_ct_hinh (mon, khoi, ma, ten, mo_ta) values')
out.push(HINH.map((h) => `  (${s(MON)}, ${s(KHOI)}, ${s(h.ma)}, ${s(h.ten)}, ${s(h.mo_ta)})`).join(',\n') + '\non conflict do nothing;\n')

const thuTu = {}
out.push('insert into public.sotay_cong_thuc (ma, mon, khoi, chu_de, thu_tu, ten, ten_khac, noi_dung, luu_y, cau_nho, hinh, nguon, ct2018, ghi_chu_kiem) values')
out.push(THE.map((t) => {
  thuTu[t.chu_de] = (thuTu[t.chu_de] ?? 0) + 1
  return `  (${s(t.ma)}, ${s(MON)}, ${s(KHOI)}, ${s(t.chu_de)}, ${thuTu[t.chu_de]}, ${s(t.ten)}, ${arr(t.ten_khac)},
   ${s(t.noi_dung)},
   ${s(t.luu_y)}, ${s(t.cau_nho)}, ${s(t.hinh)}, ${arr(t.nguon)}, ${s(t.ct2018)}, ${s(t.ghi_chu_kiem)})`
}).join(',\n') + '\non conflict (ma) do nothing;')

process.stdout.write(out.join('\n') + '\n')
