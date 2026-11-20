-- ET làm TRƯỚC khi HS đến (Thùy 20/11): màn ET cần cả lớp + trạng thái điểm danh của buổi (chưa điểm danh / có mặt / vắng),
-- để rải mã đề trước và chỉ IN cho em có mặt. Trước đó chỉ lấy em 'co_mat' ⇒ chưa điểm danh thì danh sách rỗng, không rải được.
-- Trả: mọi em đang học của lớp + mọi em có dòng điểm danh trong buổi 'thuong' (học bù/chuyển lớp vẫn thấy). diem_danh NULL = chưa điểm danh.
-- Đọc thuần, invoker + RLS (không security definer).
create or replace function public.fn_et_ds_hs_cua_buoi(p_lop uuid, p_ngay date)
 returns table(id uuid, ho_ten text, ma_hs text, diem_danh text)
 language sql
 stable
 set search_path to 'public'
as $$
  with bu as (
    select b.id from buoi_hoc b
     where b.lop_id = p_lop and b.ngay = p_ngay and b.loai = 'thuong'
     order by b.created_at limit 1
  )
  select h.id, h.ho_ten, h.ma_hs, d.diem_danh
    from hoc_sinh h
    left join bu on true
    left join buoi_hoc_hs d on d.buoi_hoc_id = bu.id and d.hoc_sinh_id = h.id
   where d.id is not null
      or h.id in (select hl.hoc_sinh_id from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc')
   order by h.ho_ten
   limit 500;
$$;
revoke execute on function public.fn_et_ds_hs_cua_buoi(uuid, date) from public, anon;
grant execute on function public.fn_et_ds_hs_cua_buoi(uuid, date) to authenticated, service_role;
