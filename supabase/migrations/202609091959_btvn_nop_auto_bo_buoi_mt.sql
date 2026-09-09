-- BTVN nộp qua app PH — bỏ qua buổi TEST THÁNG (CEO gật 09/09 tối).
-- Lỗ phát hiện khi test thật: 4T1·05/09 là buổi MT (tai_lieu mt_buoi) → fn_viec_buoi_thuong không sinh task
-- BTVN cho TG (`where not b.co_mt`) → bài PH nộp bị gán vào đó thành "tàng hình", TA không mở được.
-- Sửa: hàm auto chọn buổi thường gần nhất KHÔNG có mt_buoi; picker chuyển buổi cũng ẩn buổi MT (cùng lý do).
-- MẤT GÌ (Luật xoá): không xoá dữ liệu; chỉ redefine 2 hàm, giữ nguyên chữ ký.

create or replace function public.fn_btvn_nop_tao_auto(p_hoc_sinh_id uuid, p_paths text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_buoi uuid; v_ret jsonb;
begin
  select b.id into v_buoi
  from buoi_hoc b
  join hoc_sinh_lop hl on hl.lop_id = b.lop_id and hl.hoc_sinh_id = p_hoc_sinh_id and hl.trang_thai = 'dang_hoc'
  where b.trang_thai <> 'huy' and b.loai = 'thuong'
    and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and not exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'mt_buoi')
  order by b.ngay desc, b.gio_bat_dau desc nulls last, b.id
  limit 1;
  if v_buoi is null then
    raise exception 'Chưa có buổi học nào của con để nộp bài — liên hệ trung tâm.';
  end if;
  v_ret := public.fn_btvn_nop_tao(p_hoc_sinh_id, v_buoi, p_paths);
  return v_ret || jsonb_build_object('buoi_hoc_id', v_buoi, 'gan_tam', true);
end $$;
revoke execute on function public.fn_btvn_nop_tao_auto(uuid, text[]) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'ph_nop') then
    grant execute on function public.fn_btvn_nop_tao_auto(uuid, text[]) to ph_nop;
  end if;
end $$;

create or replace function public.fn_btvn_buoi_cua_lop(p_lop_id uuid)
returns table (id uuid, ngay date, dong boolean, co_phieu boolean)
language sql stable as $$
  select b.id, b.ngay,
         (b.btvn_dong_at is not null) as dong,
         exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'btvn') as co_phieu
  from buoi_hoc b
  where b.lop_id = p_lop_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
    and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date - 60
    and not exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'mt_buoi')
  order by b.ngay desc
  limit 12
$$;
grant execute on function public.fn_btvn_buoi_cua_lop(uuid) to authenticated;
