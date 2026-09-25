-- ============================================================================
-- 202609260315 — SỰ KIỆN: tách "Đăng ký game" khỏi "Check-in" (vai dangky) — Thùy 26/09
-- ----------------------------------------------------------------------------
-- VÌ SAO: check-in chỉ HS BK (1 lần/em, rồi ra bàn quay); đăng ký game có cả HS ngoài (cấp số) và mỗi em
--   đăng ký nhiều lần. Dự kiến 1 người làm cả 2 nhưng "biết đâu cần 2 người" ⇒ 2 vai riêng, giao được
--   cho 1 hoặc 2 người. Kèm danh sách đã check-in hiện ngay dưới ô tìm (fn_sk_da_checkin).
--   Gate: checkin → fn_sk_checkin · dangky → fn_sk_them_khach, fn_sk_dang_ky · cả hai → fn_sk_tim,
--   fn_sk_nguoi_choi_bk (đăng ký game cho HS BK chưa check-in vẫn được — check-in không bắt buộc).
--   fn_sk_checkin trước đây KHÔNG có cổng riêng (dựa vào fn_sk_nguoi_choi_bk) ⇒ nay thêm cổng 'checkin'
--   để người chỉ được giao đăng ký game không check-in được.
-- MẤT GÌ: KHÔNG. Nới CHECK (thêm 1 giá trị), create or replace cùng chữ ký, 1 hàm mới.
-- ============================================================================

alter table sk_phan_cong drop constraint if exists sk_phan_cong_vai_check;
alter table sk_phan_cong add constraint sk_phan_cong_vai_check check (vai in ('checkin', 'dangky', 'quay', 'quantro', 'quaqua', 'quanly'));

create or replace function public._sk_vai(p_su_kien uuid) returns text[] language plpgsql stable security definer set search_path = public as $$
declare v text[];
begin
  if public._sk_la_admin() then return array['checkin','dangky','quay','quantro','quaqua','quanly']; end if;
  select coalesce(array_agg(vai), '{}') into v from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = public._sk_ns_id();
  if 'quanly' = any(v) then return array['checkin','dangky','quay','quantro','quaqua','quanly']; end if;
  return v;
end $$;

create or replace function public.fn_sk_quay_gan_day(p_su_kien uuid, p_limit int default 10)
returns table (id uuid, ten text, so int, xu int, at timestamptz)
language sql stable security definer set search_path = public as $$
  select x.id, nc.ten, nc.so, x.so_xu, x.at
  from sk_xu x join sk_nguoi_choi nc on nc.id = x.nguoi_choi_id
  where nc.su_kien_id = p_su_kien and x.nguon = 'vong_quay' and public._sk_co_vai(p_su_kien, array['checkin','dangky','quay','quantro','quaqua','quanly'])
  order by x.at desc
  limit least(greatest(p_limit, 1), 50)
$$;

create or replace function public.fn_sk_tong_quan(p_su_kien uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(p_su_kien, array['checkin','dangky','quay','quantro','quaqua','quanly']);
  return (
    select jsonb_build_object(
      'su_kien', to_jsonb(s),
      'tong_nguoi', (select count(*) from sk_nguoi_choi where su_kien_id = s.id),
      'tong_khach', (select count(*) from sk_nguoi_choi where su_kien_id = s.id and hoc_sinh_id is null),
      'tong_checkin', (select count(*) from sk_checkin c join sk_nguoi_choi n on n.id = c.nguoi_choi_id where n.su_kien_id = s.id),
      'tong_quay', (select count(*) from sk_xu x join sk_nguoi_choi n on n.id = x.nguoi_choi_id where n.su_kien_id = s.id and x.nguon = 'vong_quay'),
      'xu_phat', (select coalesce(sum(x.so_xu), 0) from sk_xu x join sk_nguoi_choi n on n.id = x.nguoi_choi_id where n.su_kien_id = s.id and x.so_xu > 0),
      'xu_doi', (select coalesce(-sum(x.so_xu), 0) from sk_xu x join sk_nguoi_choi n on n.id = x.nguoi_choi_id where n.su_kien_id = s.id and x.nguon = 'doi_qua'),
      'phong', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', p.id, 'ten', p.ten, 'hang_doi', p.hang_doi, 'ma_hub', p.ma_hub,
          'luot', (select jsonb_build_object('id', l.id, 'game', l.game, 'bat_dau_at', l.bat_dau_at,
                     'nguoi', coalesce((select jsonb_agg(jsonb_build_object('dang_ky_id', d.id, 'slot', d.slot, 'ten', n.ten, 'so', n.so) order by d.slot)
                                 from sk_dang_ky d join sk_nguoi_choi n on n.id = d.nguoi_choi_id
                                 where d.luot_id = l.id and d.trang_thai = 'dang_choi'), '[]'::jsonb))
                   from sk_luot l where l.phong_id = p.id and l.trang_thai = 'dang_choi'),
          'co_mat', coalesce((select jsonb_agg(jsonb_build_object('dang_ky_id', d.id, 'ten', n.ten, 'so', n.so, 'la_khach', n.hoc_sinh_id is null, 'so_lan_bo_qua', d.so_lan_bo_qua) order by d.created_at)
                     from sk_dang_ky d join sk_nguoi_choi n on n.id = d.nguoi_choi_id
                     where d.phong_id = p.id and d.trang_thai = 'co_mat'), '[]'::jsonb),
          'cho', coalesce((select jsonb_agg(jsonb_build_object('dang_ky_id', d.id, 'ten', n.ten, 'so', n.so, 'la_khach', n.hoc_sinh_id is null, 'so_lan_bo_qua', d.so_lan_bo_qua) order by d.created_at)
                     from sk_dang_ky d join sk_nguoi_choi n on n.id = d.nguoi_choi_id
                     where d.phong_id = p.id and d.trang_thai = 'cho'), '[]'::jsonb),
          'so_luot_xong', (select count(*) from sk_luot l where l.phong_id = p.id and l.trang_thai = 'xong')
        ) order by p.thu_tu, p.ten)
        from sk_phong p where p.su_kien_id = s.id), '[]'::jsonb)
    )
    from sk_su_kien s where s.id = p_su_kien
  );
end $$;

create or replace function public.fn_sk_phan_cong_luu(p_su_kien uuid, p_nhan_su uuid, p_vai text[]) returns text[]
language plpgsql security definer set search_path = public as $$
declare v text[] := coalesce(p_vai, '{}');
begin
  perform public._sk_can(p_su_kien, array['quanly']);
  if exists (select 1 from unnest(v) x where x not in ('checkin', 'dangky', 'quay', 'quantro', 'quaqua', 'quanly')) then
    raise exception 'Vai không hợp lệ.';
  end if;
  if not exists (select 1 from nhan_su where id = p_nhan_su) then raise exception 'Không tìm thấy nhân sự.'; end if;
  delete from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = p_nhan_su and not (vai = any(v));
  insert into sk_phan_cong (su_kien_id, nhan_su_id, vai)
    select p_su_kien, p_nhan_su, x from unnest(v) x
  on conflict do nothing;
  return (select coalesce(array_agg(vai order by vai), '{}') from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = p_nhan_su);
end $$;

create or replace function public.fn_sk_nguoi_choi_bk(p_su_kien uuid, p_hoc_sinh uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid; v_ten text;
begin
  perform public._sk_can(p_su_kien, array['checkin','dangky']);
  select id into v from sk_nguoi_choi where su_kien_id = p_su_kien and hoc_sinh_id = p_hoc_sinh;
  if v is not null then return v; end if;
  select ho_ten into v_ten from hoc_sinh where id = p_hoc_sinh;
  if v_ten is null then raise exception 'Không tìm thấy học sinh.'; end if;
  insert into sk_nguoi_choi (su_kien_id, so, hoc_sinh_id, ten)
  values (p_su_kien, public._sk_cap_so(p_su_kien), p_hoc_sinh, v_ten)
  on conflict (su_kien_id, hoc_sinh_id) do nothing
  returning id into v;
  if v is null then select id into v from sk_nguoi_choi where su_kien_id = p_su_kien and hoc_sinh_id = p_hoc_sinh; end if;
  return v;
end $$;

create or replace function public.fn_sk_checkin(p_su_kien uuid, p_hoc_sinh uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  perform public._sk_can(p_su_kien, array['checkin']);
  v := public.fn_sk_nguoi_choi_bk(p_su_kien, p_hoc_sinh);
  insert into sk_checkin (nguoi_choi_id) values (v) on conflict do nothing;
  return v;
end $$;

create or replace function public.fn_sk_them_khach(p_su_kien uuid, p_ten text)
returns table (id uuid, so int)
language plpgsql security definer set search_path = public as $$
declare v_ten text := btrim(coalesce(p_ten, ''));
begin
  perform public._sk_can(p_su_kien, array['dangky']);
  if v_ten = '' then raise exception 'Nhập tên bạn.'; end if;
  return query
    insert into sk_nguoi_choi as n (su_kien_id, so, hoc_sinh_id, ten)
    values (p_su_kien, public._sk_cap_so(p_su_kien), null, v_ten)
    returning n.id, n.so;
end $$;

create or replace function public.fn_sk_tim(p_su_kien uuid, p_q text)
returns table (
  nguoi_choi_id uuid, hoc_sinh_id uuid, ten text, so int, lop text, la_khach boolean,
  da_checkin boolean, xu_quay int, so_du int, dang_ky_id uuid, dang_ky_trang_thai text, phong_ten text
)
language plpgsql stable security definer set search_path = public as $$
declare q text := public.fn_bo_dau(btrim(coalesce(p_q, ''))); v_so int;
begin
  perform public._sk_can(p_su_kien, array['checkin','dangky','quaqua']);
  if q = '' then return; end if;
  if ltrim(q, '#') ~ '^[0-9]+$' then v_so := ltrim(q, '#')::int; end if;
  return query
  with ung as (
    -- HS BK đang học khớp tên
    select h.id as hs_id, h.ho_ten as ten_goc, nc.id as nc_id, nc.so as nc_so
    from hoc_sinh h
    left join sk_nguoi_choi nc on nc.su_kien_id = p_su_kien and nc.hoc_sinh_id = h.id
    where v_so is null and h.trang_thai = 'dang_hoc' and public.fn_bo_dau(h.ho_ten) like '%' || q || '%'
    union all
    -- người chơi của sự kiện khớp số / khách khớp tên (HS BK đã có ở nhánh trên)
    select nc.hoc_sinh_id, nc.ten, nc.id, nc.so
    from sk_nguoi_choi nc
    where nc.su_kien_id = p_su_kien
      and ((v_so is not null and nc.so = v_so)
           or (v_so is null and nc.hoc_sinh_id is null and public.fn_bo_dau(nc.ten) like '%' || q || '%'))
  )
  select u.nc_id, u.hs_id, u.ten_goc, u.nc_so,
         (select string_agg(distinct l.ten_lop, ', ') from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
           where hl.hoc_sinh_id = u.hs_id and hl.trang_thai = 'dang_hoc'),
         u.hs_id is null,
         exists (select 1 from sk_checkin c where c.nguoi_choi_id = u.nc_id),
         (select x.so_xu from sk_xu x where x.nguoi_choi_id = u.nc_id and x.nguon = 'vong_quay'),
         case when u.nc_id is null then 0 else public._sk_so_du(u.nc_id) end,
         dk.id, dk.trang_thai, p.ten
  from ung u
  left join sk_dang_ky dk on dk.nguoi_choi_id = u.nc_id and dk.trang_thai in ('cho', 'co_mat', 'dang_choi')
  left join sk_phong p on p.id = dk.phong_id
  order by (public.fn_bo_dau(u.ten_goc) like q || '%') desc, u.ten_goc
  limit 30;
end $$;

create or replace function public.fn_sk_dang_ky(p_phong uuid, p_nguoi uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid; v_ph record; v_cu text;
begin
  perform public._sk_can((select su_kien_id from sk_phong where id = p_phong), array['dangky']);
  select * into v_ph from sk_phong where id = p_phong;
  if not found then raise exception 'Không tìm thấy phòng.'; end if;
  if not v_ph.hang_doi then raise exception 'Phòng % không dùng hàng chờ.', v_ph.ten; end if;
  if not exists (select 1 from sk_nguoi_choi where id = p_nguoi and su_kien_id = v_ph.su_kien_id) then
    raise exception 'Người chơi không thuộc sự kiện này.';
  end if;
  select p.ten into v_cu from sk_dang_ky d join sk_phong p on p.id = d.phong_id
   where d.nguoi_choi_id = p_nguoi and d.trang_thai in ('cho', 'co_mat', 'dang_choi');
  if v_cu is not null then raise exception 'Bạn này đang có chỗ ở hàng % rồi — chơi xong mới đăng ký lại được.', v_cu; end if;
  begin
    insert into sk_dang_ky (phong_id, nguoi_choi_id) values (p_phong, p_nguoi) returning id into v;
  exception when unique_violation then
    raise exception 'Bạn này vừa được đăng ký ở máy khác.';
  end;
  return v;
end $$;

-- Danh sách HS đã check-in (mới nhất trên cùng) — hiện ngay dưới ô tìm ở tab Check-in.
create or replace function public.fn_sk_da_checkin(p_su_kien uuid)
returns table (nguoi_choi_id uuid, ten text, so int, lop text, checkin_at timestamptz, xu_quay int)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(p_su_kien, array['checkin','quay']);
  return query
    select nc.id, nc.ten, nc.so,
           (select string_agg(distinct l.ten_lop, ', ') from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.hoc_sinh_id = nc.hoc_sinh_id and hl.trang_thai = 'dang_hoc'),
           c.at,
           (select x.so_xu from sk_xu x where x.nguoi_choi_id = nc.id and x.nguon = 'vong_quay')
    from sk_checkin c
    join sk_nguoi_choi nc on nc.id = c.nguoi_choi_id
    where nc.su_kien_id = p_su_kien
    order by c.at desc
    limit 500;
end $$;

revoke all on function public.fn_sk_da_checkin(uuid) from public;
revoke all on function public.fn_sk_da_checkin(uuid) from anon;
grant execute on function public.fn_sk_da_checkin(uuid) to authenticated;

-- Kiểm tra ngay (1 dòng): co_vai_dangky = true, anon_goi_duoc = 0.
select
  pg_get_constraintdef((select oid from pg_constraint where conname = 'sk_phan_cong_vai_check')) like '%dangky%' as co_vai_dangky,
  (select count(*) from pg_proc where proname in ('fn_sk_da_checkin', 'fn_sk_checkin', 'fn_sk_dang_ky', 'fn_sk_them_khach', 'fn_sk_tim', 'fn_sk_nguoi_choi_bk', '_sk_vai', 'fn_sk_tong_quan', 'fn_sk_quay_gan_day', 'fn_sk_phan_cong_luu')
     and has_function_privilege('anon', oid, 'execute')) as anon_goi_duoc;
