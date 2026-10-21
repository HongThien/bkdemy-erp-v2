-- ============================================================================
-- 202610211555 — lop_1_1_khong_tinh_gv
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 21/10: "Thảo Nguyên có phải giáo viên đâu" → phân công GV của Thảo Nguyên ở 8S1 là nhập nhầm (Thùy đã xoá);
--   còn 8F1 "là lớp 1-1, dạy 1-1 không tính giáo viên". _la_gv_kiem_ta (mig 202610151425) coi MỌI phân công vai 'gv' là GV
--   ⇒ dạy kèm 1-1 làm TA mất lương TA + không bị đòi chấm công. Lớp 1-1 chưa có dấu nào trên ERP (8F1, 11F1 để bậc C như lớp
--   thường) ⇒ thêm cờ lop.la_1_1 (mặc định false), bật cho 2 lớp đuôi F hiện có; _la_gv_kiem_ta bỏ qua lớp 1-1.
--   Lớp 1-1 mới: bật cờ khi tạo lớp (màn Lớp — chưa có ô, sửa bằng SQL tới khi có).
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 cột, viết lại thân 1 hàm.
-- ============================================================================

alter table public.lop add column if not exists la_1_1 boolean not null default false;
comment on column public.lop.la_1_1 is 'Lớp kèm 1-1 (Thùy 21/10): dạy lớp 1-1 KHÔNG tính là giáo viên khi xét GV kiêm TA';
update public.lop set la_1_1 = true where ten_lop in ('8F1', '11F1') and not la_1_1;

create or replace function public._la_gv_kiem_ta(p_ns uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from phan_cong_lop pc join lop l on l.id = pc.lop_id
                  where pc.nhan_su_id = p_ns and pc.vai_tro = 'gv' and not l.la_1_1)   -- dạy 1-1 không tính GV (Thùy 21/10)
$$;
