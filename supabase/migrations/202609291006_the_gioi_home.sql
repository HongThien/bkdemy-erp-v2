-- ============================================================================
-- THẾ GIỚI BK trên MÀN CHÍNH HS (Thùy 29/09: bỏ thẻ "Việc cần làm" — HS ít việc, từng ô đã có chấm đỏ; chỗ đó hiện THÔNG BÁO Thế giới BK).
-- fn_the_gioi_home() trả 1 gói nhỏ cho thẻ ở Home:
--   tuong_tac : lượt thả cảm xúc + bình luận MỚI (24h) của bạn khác trên tin của em · người mới nhất (theo luật tên/mã)
--   loi_moi   : số lời mời kết bạn đang chờ em
--   tin       : ≤2 tin nổi bật để khoe ngay ở Home — tin S (Thế giới) trước, không có thì tin mới nhất của bạn bè / lớp
-- Mọi số đếm ở Postgres (CLAUDE §2.0); client chỉ vẽ.
-- ============================================================================
create or replace function public.fn_the_gioi_home()
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ban uuid[];
  v_khoa text[];
  v_tin jsonb;
  v_tt jsonb;
begin
  if v_me is null then return null; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_khoa := array(select t.khoa from public._the_gioi_tin(now() - interval '30 days') t where v_me = any(t.thanh_vien));

  -- tương tác mới trên tin của em (không đếm của chính em, không đếm cái em đã ẩn)
  with moi as (
    select k.hs_id, k.updated_at at from the_gioi_khen k
      where k.tin_khoa = any(v_khoa) and k.hs_id is not null and k.hs_id <> v_me and k.an_at is null and k.updated_at >= now() - interval '24 hours'
    union all
    select b.hs_id, b.created_at from the_gioi_binh_luan b
      where b.tin_khoa = any(v_khoa) and b.hs_id <> v_me and b.an_at is null and b.go_at is null and b.created_at >= now() - interval '24 hours'
  )
  select jsonb_build_object('so', count(*), 'so_nguoi', count(distinct hs_id),
           'nguoi', (select public._the_gioi_nguoi(m2.hs_id, (select ten_lop from public._the_gioi_lop(m2.hs_id, null)), m2.hs_id = any(v_ban))
                     from moi m2 order by m2.at desc limit 1))
    into v_tt from moi;

  -- tin nổi bật: S của Thế giới (đã lọc quyền/ẩn trong fn_the_gioi_kenh), thiếu thì tin của bạn bè, rồi của lớp
  v_tin := coalesce((public.fn_the_gioi_kenh('tg'))->'tin', '[]'::jsonb);
  if jsonb_array_length(v_tin) = 0 then v_tin := coalesce((public.fn_the_gioi_kenh('ban'))->'tin', '[]'::jsonb); end if;
  if jsonb_array_length(v_tin) = 0 then v_tin := coalesce((public.fn_the_gioi_kenh('lop'))->'tin', '[]'::jsonb); end if;

  return jsonb_build_object(
    'tuong_tac', v_tt,
    'loi_moi', (select count(*) from ban_be_loi_moi where nguoi_nhan = v_me and trang_thai = 'cho'),
    'tin', coalesce((select jsonb_agg(x - 'khen') from (select x from jsonb_array_elements(v_tin) x
                      where not coalesce((x->>'cua_toi')::boolean, false) limit 2) q), '[]'::jsonb));
end $$;

revoke execute on function public.fn_the_gioi_home() from public, anon;
grant execute on function public.fn_the_gioi_home() to authenticated;
