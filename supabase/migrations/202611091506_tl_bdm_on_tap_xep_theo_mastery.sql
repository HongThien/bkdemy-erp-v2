-- ============================================================================
-- tl_bdm_on_tap_xep_theo_mastery
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 09/11: "ôn tập tự xếp theo mastery của lớp — có"): nhóm gợi ý ôn tập của phiếu BTVN (bản đồ mới) trước đây chỉ là nhóm của các buổi
--   trước, GV tự chọn (fn_tl_bdm_on_tap_ung_vien — chưa đọc mastery). Mastery bản đồ mới đã BẬT (24/10) ⇒ xếp theo MỨC NẮM HIỆN TẠI của lớp, tính NGAY LÚC GỌI
--   (không lưu — mastery là suy động, CLAUDE §1): nhóm lớp đang YẾU lên đầu.
-- LUẬT:
--   · Số đo = fn_mastery_cells_moi(HS đang học của lớp, include_btvn = false) ⇒ đúng mastery mặc định (ET + MT; BTVN/ôn tập vẫn là tham khảo, KHÔNG đổi quy định).
--   · Ô đo của mastery bản đồ mới là DẠNG BÀI ⇒ gom lên NHÓM qua tl_bdm_dang_bai_v.nhom_id; điểm nhóm = trung bình điểm các ô (HS × dạng bài) của nhóm.
--   · Thứ tự: ① đã đo mà chưa đạt (điểm tăng dần — yếu nhất đầu) ② CHƯA ĐO (giữ thứ tự buổi; §5: chưa-đo KHÔNG gộp vào yếu) ③ đã đạt.
--   · Hàm cũ fn_tl_bdm_on_tap_ung_vien GIỮ NGUYÊN (hàm mới gọi lại để lấy danh sách ứng viên) — client lùi về hàm cũ nếu hàm mới lỗi/chậm.
-- MẤT GÌ (Luật xoá): không mất gì — thêm 1 hàm.
-- ============================================================================

create or replace function public.fn_tl_bdm_on_tap_xep(p_master uuid, p_buoi uuid, p_lop uuid)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_hs uuid[]; v_out jsonb;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được giáo trình.' using errcode = '42501'; end if;
  select coalesce(array_agg(hl.hoc_sinh_id), '{}') into v_hs from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc';

  with uv as (
    select e ->> 'nhom' as nhom, e ->> 'ten' as ten, e ->> 'buoi' as buoi, t.o as thu
      from jsonb_array_elements(public.fn_tl_bdm_on_tap_ung_vien(p_master, p_buoi)) with ordinality as t(e, o)
  ),
  cells as (
    select c.hoc_sinh_id, c.ma_dang, c.score, c.muc from public.fn_mastery_cells_moi(v_hs, false) c
  ),
  tn as (
    select db.nhom_id as nhom, count(distinct c.hoc_sinh_id)::int as so_hs_do, count(*)::int as so_o,
           round(avg(c.score)::numeric, 2) as diem,
           round(100.0 * count(*) filter (where c.muc = 'dat') / count(*))::int as pct_dat
      from cells c join public.tl_bdm_dang_bai_v db on db.id = c.ma_dang
     where c.score is not null
     group by db.nhom_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'nhom', uv.nhom, 'ten', uv.ten, 'buoi', uv.buoi,
           'so_hs', coalesce(array_length(v_hs, 1), 0), 'so_hs_do', coalesce(tn.so_hs_do, 0),
           'diem', tn.diem, 'pct_dat', tn.pct_dat,
           'muc', case when tn.diem is null then null when tn.diem >= 0.8 then 'dat' when tn.diem >= 0.5 then 'can_luyen' else 'yeu' end
         ) order by case when tn.diem is null then 1 when tn.diem >= 0.8 then 2 else 0 end, tn.diem, uv.thu), '[]'::jsonb)
    into v_out
    from uv left join tn on tn.nhom = uv.nhom;
  return v_out;
end $$;

revoke execute on function public.fn_tl_bdm_on_tap_xep(uuid, uuid, uuid) from public, anon;
grant execute on function public.fn_tl_bdm_on_tap_xep(uuid, uuid, uuid) to authenticated;
