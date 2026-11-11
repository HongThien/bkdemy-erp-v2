-- HỌC SINH XUẤT SẮC NHẤT KHỐI (Thùy 11/11 — trước gọi "Học sinh tiêu biểu"): mỗi (tháng × môn × khối) chọn TAY đúng 1 em
-- trong số các em đã được giải XUẤT SẮC của các lớp thuộc khối đó. Không phải giải cấp lớp ⇒ không đụng slot/ngân sách lớp.
-- Lưu trỏ vào giải Xuất sắc gốc (giai_thuong_id). KHÔNG đặt FK được: giai_thuong thuộc owner postgres, role migrate không có quyền REFERENCES.
-- Thay vào đó: bỏ xác nhận giải gốc (xoá dòng giai_thuong) ⇒ hàm đọc chỉ nhận lượt chọn còn trỏ tới giải Xuất sắc đang tồn tại (join), coi như chưa chọn.
-- Chưa chọn = KHÔNG có dòng (§1.5). Đổi lựa chọn ghi vết bằng trigger (§4).
create table if not exists public.giai_thuong_xs_khoi (
  thang date not null,
  mon text not null,
  khoi text not null,
  giai_thuong_id uuid not null unique,
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  chon_boi uuid references public.nhan_su(id),
  chon_at timestamptz not null default now(),
  primary key (thang, mon, khoi)
);
alter table public.giai_thuong_xs_khoi enable row level security;
drop policy if exists giai_thuong_xs_khoi_member_all on public.giai_thuong_xs_khoi;
create policy giai_thuong_xs_khoi_member_all on public.giai_thuong_xs_khoi
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
revoke all on public.giai_thuong_xs_khoi from anon;

create table if not exists public.giai_thuong_xs_khoi_log (
  id bigserial primary key,
  thang date not null, mon text not null, khoi text not null,
  hs_cu uuid, hs_moi uuid,
  actor uuid,
  at timestamptz not null default now()
);
alter table public.giai_thuong_xs_khoi_log enable row level security;
drop policy if exists giai_thuong_xs_khoi_log_member_read on public.giai_thuong_xs_khoi_log;
create policy giai_thuong_xs_khoi_log_member_read on public.giai_thuong_xs_khoi_log
  for select to authenticated using (la_thanh_vien());
revoke all on public.giai_thuong_xs_khoi_log from anon;

create or replace function public._giai_thuong_xs_khoi_log_tg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into giai_thuong_xs_khoi_log (thang, mon, khoi, hs_cu, hs_moi, actor) values (old.thang, old.mon, old.khoi, old.hoc_sinh_id, null, public.fn_traogiai_actor());
    return old;
  end if;
  if tg_op = 'UPDATE' and old.hoc_sinh_id is not distinct from new.hoc_sinh_id then return new; end if;
  insert into giai_thuong_xs_khoi_log (thang, mon, khoi, hs_cu, hs_moi, actor)
  values (new.thang, new.mon, new.khoi, case when tg_op = 'UPDATE' then old.hoc_sinh_id end, new.hoc_sinh_id, public.fn_traogiai_actor());
  return new;
end $$;
revoke execute on function public._giai_thuong_xs_khoi_log_tg() from public, anon;
drop trigger if exists trg_giai_thuong_xs_khoi_log on public.giai_thuong_xs_khoi;
create trigger trg_giai_thuong_xs_khoi_log after insert or update or delete on public.giai_thuong_xs_khoi
  for each row execute function public._giai_thuong_xs_khoi_log_tg();

-- ĐỌC: mỗi (môn × khối) có ít nhất 1 giải Xuất sắc trong tháng ⇒ 1 nhóm: ứng viên (điểm MT + hạng khối, giảm dần) + em đang được chọn.
create or replace function public.fn_traogiai_xs_khoi(p_ym text, p_khoi text default null)
returns jsonb language plpgsql stable as $$
declare v_thang date; v_out jsonb;
begin
  if p_ym is null or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;
  v_thang := (p_ym || '-01')::date;
  with uv as (
    select g.id as giai_id, g.hoc_sinh_id, g.mon, l.khoi, l.id as lop_id, l.ten_lop, h.ho_ten, h.ma_hs
      from giai_thuong g join lop l on l.id = g.lop_id join hoc_sinh h on h.id = g.hoc_sinh_id
     where g.thang = v_thang and g.loai_giai = 'xuat_sac' and l.khoi is not null
       and (p_khoi is null or l.khoi = p_khoi)
  ), lops as (select distinct lop_id, mon from uv),
  mt as (
    select lo.lop_id, r.hoc_sinh_id, r.tb, r.rank_now, r.rank_total
      from lops lo cross join lateral public.fn_rank_diem_mt_lop(lo.lop_id, lo.mon, p_ym) r
  ), ds as (
    select uv.*, mt.tb, mt.rank_now, mt.rank_total
      from uv left join mt on mt.lop_id = uv.lop_id and mt.hoc_sinh_id = uv.hoc_sinh_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'mon', n.mon, 'khoi', n.khoi,
           'chonGiaiThuongId', (select x.giai_thuong_id from giai_thuong_xs_khoi x join ds on ds.giai_id = x.giai_thuong_id
                                where x.thang = v_thang and x.mon = n.mon and x.khoi = n.khoi),
           'ungVien', (select jsonb_agg(jsonb_build_object(
                          'giaiThuongId', d.giai_id, 'hocSinhId', d.hoc_sinh_id, 'hoTen', d.ho_ten, 'maHs', d.ma_hs,
                          'lopId', d.lop_id, 'lop', d.ten_lop, 'mt', round(d.tb, 2), 'hangKhoi', d.rank_now, 'tongKhoi', d.rank_total)
                        order by d.tb desc nulls last, d.rank_now nulls last, d.ho_ten)
                         from ds d where d.mon = n.mon and d.khoi = n.khoi)
         ) order by n.mon, n.khoi), '[]'::jsonb)
    into v_out
    from (select distinct mon, khoi from ds) n;
  return v_out;
end $$;

-- GHI: chọn (hoặc đổi) em xuất sắc nhất khối = trỏ vào 1 giải Xuất sắc của tháng đó; môn + khối suy từ chính giải đó.
create or replace function public.fn_traogiai_xs_khoi_chon(p_ym text, p_giai_thuong uuid)
returns void language plpgsql as $$
declare v_thang date; g record;
begin
  if p_ym is null or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;
  v_thang := (p_ym || '-01')::date;
  select gt.id, gt.hoc_sinh_id, gt.mon, gt.thang, gt.loai_giai, l.khoi into g
    from giai_thuong gt join lop l on l.id = gt.lop_id where gt.id = p_giai_thuong;
  if g.id is null then raise exception 'Không thấy giải.'; end if;
  if g.loai_giai <> 'xuat_sac' then raise exception 'Chỉ chọn trong số học sinh được giải Xuất sắc.'; end if;
  if g.thang <> v_thang then raise exception 'Giải này không thuộc tháng %.', p_ym; end if;
  if g.khoi is null then raise exception 'Lớp của giải chưa có khối.'; end if;
  insert into giai_thuong_xs_khoi (thang, mon, khoi, giai_thuong_id, hoc_sinh_id, chon_boi)
  values (v_thang, g.mon, g.khoi, g.id, g.hoc_sinh_id, public.fn_traogiai_actor())
  on conflict (thang, mon, khoi) do update
    set giai_thuong_id = excluded.giai_thuong_id, hoc_sinh_id = excluded.hoc_sinh_id,
        chon_boi = excluded.chon_boi, chon_at = now();
end $$;

create or replace function public.fn_traogiai_xs_khoi_bo(p_ym text, p_mon text, p_khoi text)
returns void language plpgsql as $$
begin
  if p_ym is null or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;
  delete from giai_thuong_xs_khoi where thang = (p_ym || '-01')::date and mon = p_mon and khoi = p_khoi;
end $$;

revoke execute on function public.fn_traogiai_xs_khoi(text, text) from public, anon;
revoke execute on function public.fn_traogiai_xs_khoi_chon(text, uuid) from public, anon;
revoke execute on function public.fn_traogiai_xs_khoi_bo(text, text, text) from public, anon;
grant execute on function public.fn_traogiai_xs_khoi(text, text) to authenticated;
grant execute on function public.fn_traogiai_xs_khoi_chon(text, uuid) to authenticated;
grant execute on function public.fn_traogiai_xs_khoi_bo(text, text, text) to authenticated;
