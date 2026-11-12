-- ============================================================================
-- 202611121420 — Môn LÝ HÓA, đợt 1: nền vận hành (Thùy 12/11: "Thêm bộ môn Lý hóa, vai trò giống KHTN", khối 10 11 12)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Lý hóa = 1 trung tâm riêng (§1.6), chỉ học ở khối 10–12. Đợt 1 chỉ mở phần VẬN HÀNH (lớp, nhân sự, TKB,
--   phân công, học phí) — kho/bản đồ/tài liệu/ET/app HS là đợt 2–4, chưa đụng ở đây.
--   1. Registry `_mon_khoi_hop_le` (CHECK `lop_mon_khoi_hop_le` + thanh chọn môn app HS dùng nó): thêm Lý hóa ⇒ khối 10/11/12.
--      Dựng từ bản đang chạy (chỉ có nhánh TSA = 12), thêm 1 nhánh. Đang có 0 lớp Lý hóa ⇒ CHECK không vướng dữ liệu cũ.
--   2. Nới CHECK môn của sổ tay công thức (`sotay_ct_chu_de`, `sotay_ct_hinh`) — 2 bảng duy nhất có CHECK theo NHÃN môn;
--      màn sổ tay chọn môn theo danh mục, thiếu nhãn là DB chặn đúng lúc bấm lưu.
-- MẤT GÌ (Luật xoá): không mất dữ liệu. Thay thân 1 hàm (giữ chữ ký) + drop/add lại 2 CHECK cùng tên với tập giá trị rộng hơn.
-- ============================================================================

create or replace function public._mon_khoi_hop_le(p_mon text, p_khoi text)
 returns boolean language sql immutable
as $function$
  select case
    when p_mon = 'TSA' then p_khoi = '12'
    when p_mon = 'Lý hóa' then p_khoi in ('10', '11', '12') -- mig 202611121420
    else true end
$function$;

alter table public.sotay_ct_chu_de drop constraint sotay_ct_chu_de_mon_check;
alter table public.sotay_ct_chu_de add constraint sotay_ct_chu_de_mon_check
  check (mon = any (array['Toán', 'KHTN', 'Lý hóa', 'Tiếng Anh', 'Văn', 'TSA']));

alter table public.sotay_ct_hinh drop constraint sotay_ct_hinh_mon_check;
alter table public.sotay_ct_hinh add constraint sotay_ct_hinh_mon_check
  check (mon = any (array['Toán', 'KHTN', 'Lý hóa', 'Tiếng Anh', 'Văn', 'TSA']));
