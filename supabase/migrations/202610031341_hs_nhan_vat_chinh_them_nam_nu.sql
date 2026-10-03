-- NHÂN VẬT CHÍNH: thêm 2 nhà thám hiểm ban đầu (nam · nu) vào danh sách chọn ⇒ đủ 6 (Thùy 03/10: "tính cả 2 nhân vật ban đầu là 6").
-- Chỉ NỚI ràng buộc (4 → 6 mã) — không dòng nào mất; thân hàm lấy từ bản đang chạy (pg_get_functiondef), chỉ đổi danh sách mã.

alter table public.hs_nhan_vat_chinh drop constraint if exists hs_nhan_vat_chinh_nhan_vat_check;
alter table public.hs_nhan_vat_chinh add constraint hs_nhan_vat_chinh_nhan_vat_check
  check (nhan_vat in ('nam', 'nu', 'su_tu', 'cao', 'ninja', 'elf'));

create or replace function public.fn_hs_chon_nhan_vat(p_nhan_vat text)
returns text language plpgsql security definer set search_path = public as $function$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh mới chọn được nhân vật'; end if;
  if p_nhan_vat is null or p_nhan_vat not in ('nam', 'nu', 'su_tu', 'cao', 'ninja', 'elf') then raise exception 'Nhân vật không hợp lệ: %', p_nhan_vat; end if;
  insert into hs_nhan_vat_chinh (hoc_sinh_id, nhan_vat) values (v_hs, p_nhan_vat)
  on conflict (hoc_sinh_id) do update set nhan_vat = excluded.nhan_vat, updated_at = now();
  return p_nhan_vat;
end $function$;

revoke all on function public.fn_hs_chon_nhan_vat(text) from public;
revoke execute on function public.fn_hs_chon_nhan_vat(text) from anon;
grant execute on function public.fn_hs_chon_nhan_vat(text) to authenticated;
