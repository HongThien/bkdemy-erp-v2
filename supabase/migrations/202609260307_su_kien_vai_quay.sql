-- ============================================================================
-- 202609260307 — SỰ KIỆN: thêm việc "quay" (bàn vòng quay riêng) — Thùy 26/09
-- ----------------------------------------------------------------------------
-- VÌ SAO: thực tế có 2 laptop — 1 người CHECK-IN, 1 người ở BÀN QUAY. HS check-in xong ra bàn quay,
--   màn quay hiện danh sách HS đã check-in mà chưa quay để HS tìm tên mình rồi bấm QUAY.
--   ⇒ thêm vai 'quay'; fn_sk_quay chỉ cho vai 'quay' (người check-in KHÔNG quay nữa);
--   thêm fn_sk_cho_quay (danh sách chờ quay, theo thứ tự check-in).
--   "Quầy quà" (đổi quà) KHÔNG thuộc hệ này (Thùy 26/09) — bỏ khỏi app; vai 'quaqua' + fn_sk_doi_qua
--   để nguyên trong DB (không ai được giao ⇒ vô hại), không xoá.
-- MẤT GÌ: KHÔNG. Nới CHECK (thêm 1 giá trị), create or replace cùng chữ ký, 1 hàm mới.
-- ============================================================================

alter table sk_phan_cong drop constraint if exists sk_phan_cong_vai_check;
alter table sk_phan_cong add constraint sk_phan_cong_vai_check check (vai in ('checkin', 'quay', 'quantro', 'quaqua', 'quanly'));

create or replace function public._sk_vai(p_su_kien uuid) returns text[] language plpgsql stable security definer set search_path = public as $$
declare v text[];
begin
  if public._sk_la_admin() then return array['checkin','quay','quantro','quaqua','quanly']; end if;
  select coalesce(array_agg(vai), '{}') into v from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = public._sk_ns_id();
  if 'quanly' = any(v) then return array['checkin','quay','quantro','quaqua','quanly']; end if;
  return v;
end $$;

create or replace function public.fn_sk_quay(p_nguoi uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare nc record; v_cfg jsonb; v_tong numeric; v_r numeric; v_acc numeric := 0; seg jsonb; v_xu int; v_cu int;
begin
  perform public._sk_can((select su_kien_id from sk_nguoi_choi where id = p_nguoi), array['quay']);
  select * into nc from sk_nguoi_choi where id = p_nguoi for update;
  if not found then raise exception 'Không tìm thấy người chơi.'; end if;
  if nc.hoc_sinh_id is null then raise exception 'Vòng quay chỉ dành cho học sinh BK.'; end if;
  if not exists (select 1 from sk_checkin where nguoi_choi_id = p_nguoi) then raise exception 'Bạn chưa check-in.'; end if;
  select so_xu into v_cu from sk_xu where nguoi_choi_id = p_nguoi and nguon = 'vong_quay';
  if v_cu is not null then return jsonb_build_object('xu', v_cu, 'da_quay', true); end if;

  select cau_hinh->'vong_quay' into v_cfg from sk_su_kien where id = nc.su_kien_id;
  select sum((e->>'ti_le')::numeric) into v_tong from jsonb_array_elements(v_cfg) e;
  if v_tong is null or v_tong <= 0 then raise exception 'Sự kiện chưa cấu hình vòng quay.'; end if;
  v_r := random() * v_tong;
  for seg in select e from jsonb_array_elements(v_cfg) e loop
    v_acc := v_acc + (seg->>'ti_le')::numeric;
    v_xu := (seg->>'xu')::int;
    exit when v_r < v_acc;
  end loop;
  insert into sk_xu (nguoi_choi_id, so_xu, nguon, ghi_chu) values (p_nguoi, v_xu, 'vong_quay', 'Vòng quay check-in');
  return jsonb_build_object('xu', v_xu, 'da_quay', false);
end $$;

create or replace function public.fn_sk_quay_gan_day(p_su_kien uuid, p_limit int default 10)
returns table (id uuid, ten text, so int, xu int, at timestamptz)
language sql stable security definer set search_path = public as $$
  select x.id, nc.ten, nc.so, x.so_xu, x.at
  from sk_xu x join sk_nguoi_choi nc on nc.id = x.nguoi_choi_id
  where nc.su_kien_id = p_su_kien and x.nguon = 'vong_quay' and public._sk_co_vai(p_su_kien, array['checkin','quay','quantro','quaqua','quanly'])
  order by x.at desc
  limit least(greatest(p_limit, 1), 50)
$$;

create or replace function public.fn_sk_tong_quan(p_su_kien uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(p_su_kien, array['checkin','quay','quantro','quaqua','quanly']);
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
  if exists (select 1 from unnest(v) x where x not in ('checkin', 'quay', 'quantro', 'quaqua', 'quanly')) then
    raise exception 'Vai không hợp lệ.';
  end if;
  if not exists (select 1 from nhan_su where id = p_nhan_su) then raise exception 'Không tìm thấy nhân sự.'; end if;
  delete from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = p_nhan_su and not (vai = any(v));
  insert into sk_phan_cong (su_kien_id, nhan_su_id, vai)
    select p_su_kien, p_nhan_su, x from unnest(v) x
  on conflict do nothing;
  return (select coalesce(array_agg(vai order by vai), '{}') from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = p_nhan_su);
end $$;

-- HS BK đã check-in mà CHƯA quay — màn bàn quay (cũ nhất trước = đến trước quay trước).
create or replace function public.fn_sk_cho_quay(p_su_kien uuid)
returns table (nguoi_choi_id uuid, ten text, so int, lop text, checkin_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(p_su_kien, array['quay']);
  return query
    select nc.id, nc.ten, nc.so,
           (select string_agg(distinct l.ten_lop, ', ') from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.hoc_sinh_id = nc.hoc_sinh_id and hl.trang_thai = 'dang_hoc'),
           c.at
    from sk_checkin c
    join sk_nguoi_choi nc on nc.id = c.nguoi_choi_id
    where nc.su_kien_id = p_su_kien and nc.hoc_sinh_id is not null
      and not exists (select 1 from sk_xu x where x.nguoi_choi_id = nc.id and x.nguon = 'vong_quay')
    order by c.at
    limit 300;
end $$;

revoke all on function public.fn_sk_cho_quay(uuid) from public;
revoke all on function public.fn_sk_cho_quay(uuid) from anon;
grant execute on function public.fn_sk_cho_quay(uuid) to authenticated;

-- Kiểm tra ngay (1 dòng): co_vai_quay = true, anon_goi_duoc = 0.
select
  pg_get_constraintdef((select oid from pg_constraint where conname = 'sk_phan_cong_vai_check')) like '%quay''%' as co_vai_quay,
  (select count(*) from pg_proc where proname in ('fn_sk_cho_quay', 'fn_sk_quay', '_sk_vai', 'fn_sk_tong_quan', 'fn_sk_quay_gan_day', 'fn_sk_phan_cong_luu')
     and has_function_privilege('anon', oid, 'execute')) as anon_goi_duoc;
