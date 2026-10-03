-- CÔNG TẮC "HIỆU ỨNG GAME" của học sinh (Thùy 02/10: "phải có tính năng tắt hẳn hiệu ứng game để những đứa không thích không cần xem").
-- Tắt ⇒ Tự luyện không mở bản đồ phiêu lưu / màn đấu, làm bài dạng thường. Lưu theo TÀI KHOẢN (em đổi máy vẫn giữ), mặc định BẬT.
-- Không đổi chữ ký fn_hs_luu_giao_dien (thêm tham số = tạo bản trùng tên, PostgREST gọi 3 tham số sẽ mơ hồ) ⇒ hàm lưu riêng.

alter table hs_giao_dien add column if not exists hieu_ung_game boolean not null default true;

-- đọc: thêm hieu_ung_game (thân lấy từ bản đang chạy, pg_get_functiondef 02/10)
create or replace function public.fn_hs_giao_dien_cua_toi()
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select jsonb_build_object('skin', g.skin, 'che_do', g.che_do, 'hinh_nen', g.hinh_nen, 'hieu_ung_game', g.hieu_ung_game)
  from hs_giao_dien g where g.hoc_sinh_id = public.my_hoc_sinh_id()
$function$;

-- lưu công tắc: chỉ ĐỔI dòng đã có (dòng ra đời ở bước chọn giao diện lần đầu — tạo ở đây sẽ đánh dấu nhầm "đã xong hướng dẫn")
create or replace function public.fn_hs_luu_hieu_ung_game(p_bat boolean)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh mới đổi được hiệu ứng game'; end if;
  if p_bat is null then raise exception 'Thiếu giá trị bật/tắt'; end if;
  update hs_giao_dien set hieu_ung_game = p_bat, updated_at = now() where hoc_sinh_id = v_hs;
  if not found then raise exception 'Em chọn giao diện lần đầu trước đã'; end if;
  return public.fn_hs_giao_dien_cua_toi();
end $function$;
revoke all on function public.fn_hs_luu_hieu_ung_game(boolean) from public;
grant execute on function public.fn_hs_luu_hieu_ung_game(boolean) to authenticated;

-- log: ghi cả hieu_ung_game (thân lấy từ bản đang chạy)
create or replace function public._hs_giao_dien_ghi_log()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if tg_op = 'UPDATE' and (old.skin, old.che_do, old.hinh_nen, old.hieu_ung_game) is not distinct from (new.skin, new.che_do, new.hinh_nen, new.hieu_ung_game) then
    return new;
  end if;
  insert into hs_giao_dien_log (hoc_sinh_id, actor, cu, moi)
  values (new.hoc_sinh_id, public.jwt_uid(),
          case when tg_op = 'UPDATE' then jsonb_build_object('skin', old.skin, 'che_do', old.che_do, 'hinh_nen', old.hinh_nen, 'hieu_ung_game', old.hieu_ung_game) end,
          jsonb_build_object('skin', new.skin, 'che_do', new.che_do, 'hinh_nen', new.hinh_nen, 'hieu_ung_game', new.hieu_ung_game));
  return new;
end $function$;
