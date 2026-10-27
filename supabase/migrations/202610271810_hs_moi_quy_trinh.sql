-- QUY TRÌNH HỌC SINH MỚI (Thùy 27/10): mỗi khi có HS mới, Ops làm 1 checklist theo quy trình; cần bảng theo dõi
-- PH–HS nào đã xong bước nào.
--   • hs_moi_buoc      — danh mục bước (sửa ở tab Checklist). Mã gốc = id; xoá = kho rác `xoa_at` (tick cũ vẫn trỏ được).
--   • hs_moi_tick      — 1 dòng = (HS × bước) ĐÃ LÀM. Chưa làm = KHÔNG có dòng (§1.5). Bỏ tick = xoá dòng.
--   • hs_moi_tick_log  — trigger tự ghi mọi lần tick / bỏ tick (actor + ts), app không phải nhớ ghi.
-- Ngày nhập học hiệu lực = hoc_sinh.ngay_nhap_hoc, thiếu thì ngày vào lớp sớm nhất (222/353 HS đang học thiếu ngay_nhap_hoc).
-- HS nhập học > 4 tuần (28 ngày) ⇒ MẶC ĐỊNH FULL (suy lúc đọc, không ghi tick giả).
-- Quyền: chức năng 'hs_moi' (đọc = co_chuc_nang, ghi = co_quyen_ghi). Mọi phép đếm ở fn_hs_moi_* — client chỉ render.

create table if not exists public.hs_moi_buoc (
  id uuid primary key default gen_random_uuid(),
  ten text not null check (btrim(ten) <> ''),
  mo_ta text,
  mau text not null default '#22c55e' check (mau ~ '^#[0-9a-fA-F]{6}$'),
  thu_tu integer not null default 100,
  xoa_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hs_moi_tick (
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  buoc_id uuid not null references public.hs_moi_buoc(id),
  actor uuid default public._btyeu_my_ns(),
  ts timestamptz not null default now(),
  primary key (hoc_sinh_id, buoc_id)
);

create table if not exists public.hs_moi_tick_log (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null,
  buoc_id uuid not null,
  hanh_dong text not null check (hanh_dong in ('tick', 'bo_tick')),
  actor uuid,
  ts timestamptz not null default now()
);
create index if not exists hs_moi_tick_log_hs_idx on public.hs_moi_tick_log (hoc_sinh_id, ts);

create or replace function public._hs_moi_buoc_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists hs_moi_buoc_touch_trg on public.hs_moi_buoc;
create trigger hs_moi_buoc_touch_trg before update on public.hs_moi_buoc
  for each row execute function public._hs_moi_buoc_touch();

create or replace function public._hs_moi_tick_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into hs_moi_tick_log (hoc_sinh_id, buoc_id, hanh_dong, actor) values (new.hoc_sinh_id, new.buoc_id, 'tick', public._btyeu_my_ns());
    return new;
  end if;
  insert into hs_moi_tick_log (hoc_sinh_id, buoc_id, hanh_dong, actor) values (old.hoc_sinh_id, old.buoc_id, 'bo_tick', public._btyeu_my_ns());
  return old;
end $$;
drop trigger if exists hs_moi_tick_log_trg on public.hs_moi_tick;
create trigger hs_moi_tick_log_trg after insert or delete on public.hs_moi_tick
  for each row execute function public._hs_moi_tick_log();

-- RLS
alter table public.hs_moi_buoc enable row level security;
alter table public.hs_moi_tick enable row level security;
alter table public.hs_moi_tick_log enable row level security;

drop policy if exists hs_moi_buoc_doc on public.hs_moi_buoc;
create policy hs_moi_buoc_doc on public.hs_moi_buoc for select to authenticated using (public.co_chuc_nang('hs_moi'));
drop policy if exists hs_moi_buoc_them on public.hs_moi_buoc;
create policy hs_moi_buoc_them on public.hs_moi_buoc for insert to authenticated with check (public.co_quyen_ghi('hs_moi'));
drop policy if exists hs_moi_buoc_sua on public.hs_moi_buoc;
create policy hs_moi_buoc_sua on public.hs_moi_buoc for update to authenticated
  using (public.co_quyen_ghi('hs_moi')) with check (public.co_quyen_ghi('hs_moi'));

drop policy if exists hs_moi_tick_doc on public.hs_moi_tick;
create policy hs_moi_tick_doc on public.hs_moi_tick for select to authenticated using (public.co_chuc_nang('hs_moi'));
drop policy if exists hs_moi_tick_them on public.hs_moi_tick;
create policy hs_moi_tick_them on public.hs_moi_tick for insert to authenticated with check (public.co_quyen_ghi('hs_moi'));
drop policy if exists hs_moi_tick_xoa on public.hs_moi_tick;
create policy hs_moi_tick_xoa on public.hs_moi_tick for delete to authenticated using (public.co_quyen_ghi('hs_moi'));

drop policy if exists hs_moi_tick_log_doc on public.hs_moi_tick_log;
create policy hs_moi_tick_log_doc on public.hs_moi_tick_log for select to authenticated using (public.co_chuc_nang('hs_moi'));

grant select, insert, update on public.hs_moi_buoc to authenticated;
grant select, insert, delete on public.hs_moi_tick to authenticated;
grant select on public.hs_moi_tick_log to authenticated;

-- Ngày nhập học hiệu lực của 1 HS (một chỗ duy nhất).
create or replace function public._hs_moi_ngay_nhap(p_hs uuid) returns date
language sql stable security definer set search_path = public as $$
  select coalesce(h.ngay_nhap_hoc, (select min(l.ngay_vao) from hoc_sinh_lop l where l.hoc_sinh_id = h.id))
    from hoc_sinh h where h.id = p_hs
$$;

-- 1 dòng dashboard (dùng chung cho bảng + kết quả trả về sau khi tick để client vá tại chỗ).
create or replace function public._hs_moi_dong(p_hs uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  with hom_nay as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date d),
  b as (select id from hs_moi_buoc where xoa_at is null),
  h as (
    select h.id, h.ma_hs, h.ho_ten, h.khoi, p.ho_ten ph_ten, p.so_dien_thoai ph_sdt,
           public._hs_moi_ngay_nhap(h.id) ngay
      from hoc_sinh h left join phu_huynh p on p.id = h.phu_huynh_id
     where h.id = p_hs
  ),
  x as (
    select h.*, (select d from hom_nay) - h.ngay so_ngay,
           coalesce((select jsonb_agg(t.buoc_id) from hs_moi_tick t join b on b.id = t.buoc_id where t.hoc_sinh_id = h.id), '[]'::jsonb) xong,
           (select count(*) from hs_moi_tick t join b on b.id = t.buoc_id where t.hoc_sinh_id = h.id) so_xong,
           (select count(*) from b) tong
      from h
  )
  select jsonb_build_object(
    'hs_id', id, 'ma_hs', ma_hs, 'ho_ten', ho_ten, 'khoi', khoi, 'ph_ten', ph_ten, 'ph_sdt', ph_sdt,
    'ngay_nhap_hoc', ngay, 'so_ngay', so_ngay,
    'qua_4_tuan', coalesce(so_ngay > 28, false),
    'xong', xong, 'so_xong', so_xong, 'tong', tong,
    'full', coalesce(so_ngay > 28, false) or so_xong >= tong)
  from x
$$;

-- Dashboard: p_so_tuan = 1..4 (HS nhập học trong N tuần gần nhất) hoặc null = mọi HS đang học;
-- p_khoi null = mọi khối; p_chi_chua_full = chỉ hiện dòng chưa full (mặc định của màn).
create or replace function public.fn_hs_moi_dashboard(p_so_tuan integer default 4, p_khoi text default null, p_chi_chua_full boolean default true)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_tu date;
  v_rows jsonb;
begin
  if not public.co_chuc_nang('hs_moi') then raise exception 'Không có quyền xem Quy trình HS mới'; end if;
  v_tu := case when p_so_tuan is null then null
               else (now() at time zone 'Asia/Ho_Chi_Minh')::date - 7 * p_so_tuan end;
  select coalesce(jsonb_agg(r order by (r->>'ngay_nhap_hoc') desc nulls last, r->>'ho_ten'), '[]'::jsonb) into v_rows
    from (
      select public._hs_moi_dong(h.id) r
        from hoc_sinh h
       where h.trang_thai = 'dang_hoc'
         and (p_khoi is null or h.khoi = p_khoi)
         and (v_tu is null or public._hs_moi_ngay_nhap(h.id) >= v_tu)
    ) s
   where not p_chi_chua_full or not (r->>'full')::boolean;

  return jsonb_build_object(
    'buoc', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ten', ten, 'mo_ta', mo_ta, 'mau', mau, 'thu_tu', thu_tu) order by thu_tu, created_at)
                        from hs_moi_buoc where xoa_at is null), '[]'::jsonb),
    'khoi', coalesce((select jsonb_agg(k order by nullif(regexp_replace(k, '\D', '', 'g'), '')::int, k)
                        from (select distinct khoi k from hoc_sinh where trang_thai = 'dang_hoc' and khoi is not null) s), '[]'::jsonb),
    'rows', v_rows,
    'so_dong', jsonb_array_length(v_rows));
end $$;

-- Tick / bỏ tick 1 ô; trả lại dòng đã tính lại để màn vá đúng dòng đó (không quét lại cả bảng).
create or replace function public.fn_hs_moi_tick(p_hs uuid, p_buoc uuid, p_xong boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('hs_moi') then raise exception 'Không có quyền tick Quy trình HS mới'; end if;
  if p_xong then
    if not exists (select 1 from hs_moi_buoc where id = p_buoc and xoa_at is null) then raise exception 'Bước không còn trong checklist'; end if;
    insert into hs_moi_tick (hoc_sinh_id, buoc_id) values (p_hs, p_buoc) on conflict do nothing;
  else
    delete from hs_moi_tick where hoc_sinh_id = p_hs and buoc_id = p_buoc;
  end if;
  return public._hs_moi_dong(p_hs);
end $$;

revoke execute on function public._hs_moi_ngay_nhap(uuid) from public, anon;
revoke execute on function public._hs_moi_dong(uuid) from public, anon;
revoke execute on function public.fn_hs_moi_dashboard(integer, text, boolean) from public, anon;
revoke execute on function public.fn_hs_moi_tick(uuid, uuid, boolean) from public, anon;
grant execute on function public.fn_hs_moi_dashboard(integer, text, boolean) to authenticated;
grant execute on function public.fn_hs_moi_tick(uuid, uuid, boolean) to authenticated;
