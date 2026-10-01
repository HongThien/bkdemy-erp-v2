-- ============================================================================
-- NGÀY NGHỈ CỦA CHUỗI: quyền ghi RIÊNG (lá 'chuoi_nghi'), không dính luồng huy hiệu (Thùy 01/10: "huy hiệu thiết kế riêng 1 luồng khác").
-- Mig 202610011512 đặt co_quyen_ghi('huyhieu'); đổi sang co_quyen_ghi('chuoi_nghi') — admin hệ thống vẫn ghi được, vai khác cấp qua Phân quyền.
-- Thêm kiểm khoảng ngày + chống trùng cùng khoảng/khối khi nhập nhầm 2 lần. Chỉ cho ngày từ hôm nay trở đi hoặc ≤ 30 ngày trước (sửa bù cho kỳ nghỉ vừa qua).
-- ============================================================================
create or replace function public.fn_chuoi_ngay_nghi_ghi(p_tu date, p_den date, p_khoi text[], p_ly_do text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid; v_khoi text[] := coalesce(p_khoi, '{}');
begin
  if not public.co_quyen_ghi('chuoi_nghi') then raise exception 'Chỉ người được cấp quyền "Ngày nghỉ của chuỗi" mới nhập được.'; end if;
  if p_tu is null or p_den is null or p_den < p_tu then raise exception 'Khoảng ngày không hợp lệ.'; end if;
  if p_den - p_tu > 60 then raise exception 'Mỗi lần nhập tối đa 61 ngày.'; end if;
  if p_tu < (now() at time zone 'Asia/Ho_Chi_Minh')::date - 30 then raise exception 'Chỉ nhập được ngày nghỉ từ 30 ngày trước trở đi.'; end if;
  if length(btrim(coalesce(p_ly_do, ''))) = 0 then raise exception 'Cần ghi lý do (vd Tết Nguyên đán, tuần thi giữa kỳ).'; end if;
  if exists (select 1 from chuoi_ngay_nghi n where n.xoa_at is null and n.tu = p_tu and n.den = p_den and n.khoi = v_khoi) then
    raise exception 'Đã có đúng khoảng ngày này cho cùng khối.';
  end if;
  insert into chuoi_ngay_nghi (tu, den, khoi, ly_do) values (p_tu, p_den, v_khoi, btrim(p_ly_do)) returning id into v;
  return v;
end $$;

create or replace function public.fn_chuoi_ngay_nghi_go(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('chuoi_nghi') then raise exception 'Chỉ người được cấp quyền "Ngày nghỉ của chuỗi" mới gỡ được.'; end if;
  update chuoi_ngay_nghi set xoa_at = now() where id = p_id and xoa_at is null;
end $$;

revoke all on function public.fn_chuoi_ngay_nghi_ghi(date, date, text[], text) from public, anon;
grant execute on function public.fn_chuoi_ngay_nghi_ghi(date, date, text[], text) to authenticated;
revoke all on function public.fn_chuoi_ngay_nghi_go(uuid) from public, anon;
grant execute on function public.fn_chuoi_ngay_nghi_go(uuid) to authenticated;
