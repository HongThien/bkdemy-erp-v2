-- BTVN nộp qua app PH — CEO chốt 09/09: hệ đẩy vào BUỔI HỌC GẦN NHẤT của lớp HS đang học
-- (không còn đòi buổi có phiếu BTVN, không ưu tiên buổi chưa đóng). Nộp muộn / nộp bù → trợ giảng
-- tự gán lại bằng "chuyển buổi" ⇒ picker phải có MỌI buổi gần đây, kèm cờ có phiếu / đã đóng.
-- Bối cảnh: 4T1 chỉ có phiếu BTVN 22/08 (đã đóng 04/09) → bản cũ gán mọi bài nộp về 22/08 và
-- picker không có buổi nào khác để chuyển (e2e 09/09).
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. Chỉ redefine 2 hàm; fn_btvn_buoi_cua_lop đổi kiểu trả về
-- (thêm cột co_phieu) nên phải DROP rồi CREATE lại — client btvnnop.ts đã đọc cột mới.

create or replace function public.fn_btvn_nop_tao_auto(p_hoc_sinh_id uuid, p_paths text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_buoi uuid; v_ret jsonb;
begin
  -- Buổi gần nhất (≤ hôm nay giờ VN) trong các lớp HS đang học; cùng ngày thì buổi bắt đầu muộn hơn.
  select b.id into v_buoi
  from buoi_hoc b
  join hoc_sinh_lop hl on hl.lop_id = b.lop_id and hl.hoc_sinh_id = p_hoc_sinh_id and hl.trang_thai = 'dang_hoc'
  where b.trang_thai <> 'huy' and b.loai = 'thuong'
    and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
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

-- Picker chuyển buổi: mọi buổi thường 60 ngày gần đây (≤ hôm nay), cờ đã đóng BTVN + có phiếu BTVN.
drop function if exists public.fn_btvn_buoi_cua_lop(uuid);
create function public.fn_btvn_buoi_cua_lop(p_lop_id uuid)
returns table (id uuid, ngay date, dong boolean, co_phieu boolean)
language sql stable as $$
  select b.id, b.ngay,
         (b.btvn_dong_at is not null) as dong,
         exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'btvn') as co_phieu
  from buoi_hoc b
  where b.lop_id = p_lop_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
    and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date - 60
  order by b.ngay desc
  limit 12
$$;
grant execute on function public.fn_btvn_buoi_cua_lop(uuid) to authenticated;
