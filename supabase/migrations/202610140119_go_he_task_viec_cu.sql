-- ============================================================================
-- 202610140119 — go_he_task_viec_cu   (PHẦN 2/2: XOÁ HẲN hệ việc phát triển cũ — KHÔNG HOÀN TÁC ĐƯỢC)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 14/10, trả lời câu hỏi xoá: "Xoá hoàn toàn hệ thống task phát triển cũ. Làm lại từ đầu cho clear.
--   Idea cũ: bỏ hết." Hệ mới là task_phat_trien (file …0118). Hệ cũ quá phức tạp với người lowtech và mọi nơi
--   đọc nó đã được trỏ sang bảng mới (fn_pt_push_dem · fn_pt_push_dem_1 · _troly_cc_viec_phat_trien ·
--   fn_gay_lich_su ở file …0118; phía client: lib/gay.ts, lib/troly.ts, lib/troly-tracuu.ts, app PT).
--   ⚠ ÁP FILE …0118 TRƯỚC, kiểm màn "Task phát triển" chạy rồi mới áp file này.
--
-- MẤT GÌ (Luật xoá — liệt kê CHÍNH XÁC; Thùy đã gật 14/10):
--   BẢNG (cả dữ liệu): viec (task phát triển, kể cả task mẹ/con) · viec_cap_nhat (cập nhật tiến độ) ·
--                      viec_log (lịch sử trạng thái) · y_tuong (idea/backlog) · loai_viec (loại việc + thang khối lượng).
--   TRIGGER (đi theo bảng): hom_thu_viec_trg · tg_viec_nghiem_thu_tinh · trg_log_viec · trg_pt_viec_push_badge ·
--                           trg_pt_viec_cap_nhat_push_badge.
--   HÀM: log_viec() · _trg_pt_viec_push() · _trg_pt_viec_cap_nhat_push() · fn_viec_nghiem_thu_tinh() ·
--        _hom_thu_tg_viec() · fn_pt_viec_cua_toi() · fn_pt_viec_hom_nay() · fn_pt_viec_can_cap_nhat(uuid) ·
--        fn_giaoviec_dong_task_me(uuid,text) · giaoviec_housekeeping().
--   KHÔNG đụng: gay_ledger / gay_de_xuat (lịch sử gậy giữ nguyên — dòng gậy cũ trỏ ref 'viec:<id>' chỉ còn
--   là chuỗi mô tả); viec_van_hanh_duyet (việc vận hành, KHÁC); mọi thứ của hòm thư / order / task mới.
--   Cố ý KHÔNG dùng CASCADE: nếu còn đối tượng nào phụ thuộc, câu lệnh lỗi và cả file rollback — không xoá lan.
--   Nếu có job pg_cron gọi giaoviec_housekeeping(): gỡ job đó (cron.unschedule) — nó sẽ báo lỗi mỗi lần chạy.
-- ============================================================================

-- 1) bảng con → bảng gốc
drop table public.viec_log;
drop table public.viec_cap_nhat;
drop table public.viec;          -- kéo theo 3 trigger gắn trên viec
drop table public.y_tuong;
drop table public.loai_viec;

-- 2) hàm của hệ cũ
drop function if exists public.log_viec();
drop function if exists public._trg_pt_viec_push();
drop function if exists public._trg_pt_viec_cap_nhat_push();
drop function if exists public.fn_viec_nghiem_thu_tinh();
drop function if exists public._hom_thu_tg_viec();
drop function if exists public.fn_pt_viec_cua_toi();
drop function if exists public.fn_pt_viec_hom_nay();
drop function if exists public.fn_pt_viec_can_cap_nhat(uuid);
drop function if exists public.fn_giaoviec_dong_task_me(uuid, text);
drop function if exists public.giaoviec_housekeeping();
