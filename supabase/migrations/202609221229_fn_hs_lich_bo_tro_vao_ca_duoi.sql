-- ============================================================================
-- 202609221229 — fn_hs_lich_bo_tro_vao_ca_duoi
-- ----------------------------------------------------------------------------
-- Thùy 22/09: "TA bấm có mặt ở ca đuổi thì app HS đâu có cho mở gì" — root cause:
-- fn_hs_lich_bo_tro() (nguồn DUY NHẤT cho box "Bổ trợ" ở CẢ 3 cấp, đã gom sẵn
-- "yếu/bù/đuổi") hardcode `vao_ca` CHỈ đúng cho loai='bo_tro_yeu'. Buổi đuổi VẪN
-- xuất hiện trong lịch (loai='bo_tro_duoi' có select) nhưng nút "Vào ca luyện →"
-- (LichBoTroHS, gate bằng `c.vao_ca`) không bao giờ bật cho nó.
--
-- Sửa: vao_ca đúng cho CẢ bo_tro_yeu LẪN bo_tro_duoi (cùng điều kiện: buổi hôm
-- nay, TA đã điểm danh có_mặt, buổi chưa đóng đánh giá) — KHÔNG đổi cho `bu`
-- (buổi bù là buổi học thật, luồng khác hẳn, không có khái niệm "vào ca luyện").
--
-- DROP fn_duoi_ca_cua_toi() — hàm tôi vừa thêm ở mig 202609221221 cùng buổi làm
-- việc này, hoá ra THỪA: lich (fn_hs_lich_bo_tro) đã có đủ mon + vao_ca cho đuổi
-- rồi, không cần RPC riêng nữa → 2 nguồn cùng 1 câu hỏi "ca đuổi đang mở" là SAI
-- luật §2.0 (1 công thức, 1 chỗ). Hàm này CHƯA được app nào gọi (mới thêm cùng
-- phiên làm việc, chưa kịp dùng) nên drop an toàn, không ai đang phụ thuộc.
--
-- MẤT GÌ (Luật xoá): drop function fn_duoi_ca_cua_toi() — hàm tự thêm cách đây
-- vài phút trong CHÍNH phiên này, chưa merge/chưa ai gọi từ code, không mất dữ
-- liệu hay hành vi đang chạy. fn_hs_lich_bo_tro CREATE OR REPLACE — không đổi
-- tham số/shape trả về, chỉ nới điều kiện vao_ca.
-- ============================================================================

create or replace function public.fn_hs_lich_bo_tro()
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'buoi_id', b.id, 'loai', b.loai, 'ngay', b.ngay,
    'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
    'mon', case b.loai when 'bo_tro_yeu' then y.mon else l.mon end,
    'nguoi', coalesce(ns.ho_ten, ns2.ho_ten),
    'diem_danh', hh.diem_danh,
    'hom_nay', b.ngay = public._btyeu_today(),
    'vao_ca', coalesce(b.loai in ('bo_tro_yeu', 'bo_tro_duoi') and b.ngay = public._btyeu_today()
                       and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null, false)
  ) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
  from buoi_hoc_hs hh
  join buoi_hoc b on b.id = hh.buoi_hoc_id
  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  left join buoi_hoc bg on bg.id = hh.bu_cho_buoi_id
  left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
  left join lop l on l.id = coalesce(bg.lop_id, d.lop_id)
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  left join nhan_su ns2 on ns2.id = b.nguoi_day
  where hh.hoc_sinh_id = public.my_hoc_sinh_id()
    and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')
    and b.trang_thai = 'mo'
    and b.ngay >= public._btyeu_today()
$function$;

grant execute on function public.fn_hs_lich_bo_tro() to authenticated;

drop function if exists public.fn_duoi_ca_cua_toi();
