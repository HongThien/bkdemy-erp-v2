-- ============================================================================
-- Giao diện app HS lớp 9–12: skin tự chọn + Home mới (spec-giao-dien-hs.md, Thùy chốt 28/09/2026)
--
-- (1) hs_giao_dien — lựa chọn giao diện của HS. Dữ liệu KHÔNG-học-tập ⇒ không nhãn môn (CLAUDE §1.6).
--     1 dòng / HS, RA ĐỜI khi HS xong màn hướng dẫn lần đầu (chọn skin hoặc giữ mặc định). Chưa có dòng
--     = chưa xem hướng dẫn + đang dùng mặc định (§1.5: thiếu = không có dòng, không đẻ dòng chờ).
--     ⚠ Thêm skin mới (vd 'lofi') PHẢI nới CHECK `skin` bằng migration mới, không thì DB chặn đúng lúc HS bấm.
-- (2) hs_giao_dien_log — TRIGGER tự ghi mọi lần tạo/đổi (actor + ts + cũ/mới), app không tự nhớ ghi.
--     Thùy chốt "không cho HS bầu trước — làm rồi đo" ⇒ log này chính là phiếu bầu (đếm skin chọn/bỏ).
-- (3) lich_thi_lon — kỳ thi lớn cho widget đếm ngược (THPT, vào 10, học kỳ). Trung tâm nhập sẵn, HS chỉ đọc.
--     KHÁC `ky_thi` (bảng kỳ thi sát hạch Level theo lớp) — đừng gộp.
-- (4) RPC: fn_hs_giao_dien_cua_toi · fn_hs_luu_giao_dien · fn_hs_home_912 (Elo + hạng trong lớp + đếm ngược,
--     tính ở Postgres theo §2.0 — client chỉ vẽ).
-- ============================================================================

create table public.hs_giao_dien (
  hoc_sinh_id       uuid primary key references public.hoc_sinh(id) on delete cascade,
  skin              text not null check (skin in ('toi_gian', 'dau_truong', 'y2k', 'soft', 'rpg')),
  che_do            text not null default 'he_thong' check (che_do in ('sang', 'toi', 'he_thong')),
  hinh_nen          text not null default 'mac_dinh' check (hinh_nen ~ '^[a-z0-9_]{1,40}$'),
  huong_dan_xong_at timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table public.hs_giao_dien enable row level security;
create policy hs_giao_dien_doc_cua_minh on public.hs_giao_dien for select to authenticated
  using (hoc_sinh_id = public.my_hoc_sinh_id());
-- Ghi CHỈ qua fn_hs_luu_giao_dien (security definer) — không policy insert/update.

create table public.hs_giao_dien_log (
  id          bigint generated always as identity primary key,
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  actor       uuid,
  at          timestamptz not null default now(),
  cu          jsonb,          -- NULL = lần tạo dòng (không có trạng thái cũ — "không áp dụng")
  moi         jsonb not null
);
create index hs_giao_dien_log_hs_idx on public.hs_giao_dien_log (hoc_sinh_id, at);
alter table public.hs_giao_dien_log enable row level security;
-- Không policy: chỉ trigger (definer) ghi, staff/Claude đọc qua role riêng.

create or replace function public._hs_giao_dien_ghi_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and (old.skin, old.che_do, old.hinh_nen) is not distinct from (new.skin, new.che_do, new.hinh_nen) then
    return new;
  end if;
  insert into hs_giao_dien_log (hoc_sinh_id, actor, cu, moi)
  values (new.hoc_sinh_id, public.jwt_uid(),
          case when tg_op = 'UPDATE' then jsonb_build_object('skin', old.skin, 'che_do', old.che_do, 'hinh_nen', old.hinh_nen) end,
          jsonb_build_object('skin', new.skin, 'che_do', new.che_do, 'hinh_nen', new.hinh_nen));
  return new;
end $$;
create trigger hs_giao_dien_log_trg after insert or update on public.hs_giao_dien
  for each row execute function public._hs_giao_dien_ghi_log();

create table public.lich_thi_lon (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null check (length(btrim(ten)) > 0),
  ngay       date not null,
  khoi       text[] not null check (cardinality(khoi) > 0),
  created_at timestamptz not null default now()
);
alter table public.lich_thi_lon enable row level security;
create policy lich_thi_lon_doc on public.lich_thi_lon for select to authenticated using (true);

-- ── RPC ──────────────────────────────────────────────────────────────────────
create or replace function public.fn_hs_giao_dien_cua_toi()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('skin', g.skin, 'che_do', g.che_do, 'hinh_nen', g.hinh_nen)
  from hs_giao_dien g where g.hoc_sinh_id = public.my_hoc_sinh_id()
$$;

create or replace function public.fn_hs_luu_giao_dien(p_skin text, p_che_do text, p_hinh_nen text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh mới lưu giao diện được'; end if;
  insert into hs_giao_dien (hoc_sinh_id, skin, che_do, hinh_nen)
  values (v_hs, p_skin, p_che_do, p_hinh_nen)
  on conflict (hoc_sinh_id) do update
    set skin = excluded.skin, che_do = excluded.che_do, hinh_nen = excluded.hinh_nen, updated_at = now();
  return jsonb_build_object('skin', p_skin, 'che_do', p_che_do, 'hinh_nen', p_hinh_nen);
end $$;

-- Home 9–12: Elo từng môn + hạng trong lớp đang học môn đó (theo Elo, bằng điểm = cùng hạng) + ≤2 kỳ thi lớn
-- sắp tới của khối em. Môn chưa có lớp đang học ⇒ chỉ có Elo, không có khoá hạng (jsonb_strip_nulls).
create or replace function public.fn_hs_home_912()
returns jsonb language sql stable security definer set search_path = public as $$
  with me as (select h.id, h.khoi from hoc_sinh h where h.id = public.my_hoc_sinh_id()),
  hom_nay as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d),
  elo_toi as (
    select e.mon, e.elo,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.hoc_sinh_id = e.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = e.mon
             order by hl.ngay_vao desc nulls last limit 1) as lop_id
    from gami_elo e join me on me.id = e.hoc_sinh_id
  ),
  xep as (
    select t.mon, t.elo,
           case when t.lop_id is not null then
             (select 1 + count(*) from hoc_sinh_lop hl join gami_elo e2 on e2.hoc_sinh_id = hl.hoc_sinh_id and e2.mon = t.mon
               where hl.lop_id = t.lop_id and hl.trang_thai = 'dang_hoc' and e2.elo > t.elo) end as hang,
           case when t.lop_id is not null then
             (select count(*) from hoc_sinh_lop hl join gami_elo e2 on e2.hoc_sinh_id = hl.hoc_sinh_id and e2.mon = t.mon
               where hl.lop_id = t.lop_id and hl.trang_thai = 'dang_hoc') end as so_hs
    from elo_toi t
  )
  select jsonb_build_object(
    'elo', coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('mon', mon, 'elo', elo, 'hang', hang, 'so_hs', so_hs)) order by elo desc) from xep), '[]'::jsonb),
    'thi', coalesce((select jsonb_agg(jsonb_build_object('ten', k.ten, 'ngay', k.ngay, 'con_ngay', k.ngay - (select d from hom_nay)) order by k.ngay)
                     from (select t.ten, t.ngay from lich_thi_lon t, me
                           where t.ngay >= (select d from hom_nay) and me.khoi = any (t.khoi)
                           order by t.ngay limit 2) k), '[]'::jsonb)
  )
$$;

revoke execute on function public.fn_hs_giao_dien_cua_toi()               from public, anon;
revoke execute on function public.fn_hs_luu_giao_dien(text, text, text)   from public, anon;
revoke execute on function public.fn_hs_home_912()                        from public, anon;
revoke execute on function public._hs_giao_dien_ghi_log()                 from public, anon;
grant execute on function public.fn_hs_giao_dien_cua_toi()             to authenticated;
grant execute on function public.fn_hs_luu_giao_dien(text, text, text) to authenticated;
grant execute on function public.fn_hs_home_912()                      to authenticated;
