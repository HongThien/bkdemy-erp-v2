-- Thùy 14/10: "Bổ trợ yếu chưa đánh giá được Hình" ⇒ BƯỚC 1: danh sách "Hình yếu theo mô hình" cho quản trị + trợ giảng (chưa luyện trên app).
-- Gốc (đo 14/10): bổ trợ yếu chỉ đọc số đo theo MÃ DẠNG (fn_mastery_cells). Số đo Hình mô hình nằm ở fn_mastery_cells_hinh (theo hinh_baitoan_id, không có
-- mã dạng) ⇒ 350 ô yếu / 141 HS không bao giờ vào case. Hình theo dạng (HH… · hình giải tích T3…) thì ĐÃ được thấy.
-- Đơn vị = (HS × bài toán Hình) gắn tên MÔ HÌNH — đúng đơn vị app đang hiện (mastery.ts getHinhMasteryHS). Hàm gốc fn_mastery_cells_hinh giữ nguyên (window 3 · tin 3/2).
-- Trợ giảng dạy trên giấy rồi bấm "đã dạy": ghi vết APPEND-ONLY (mỗi lần bấm 1 dòng, dòng mới nhất của (HS × bài) thắng; bỏ đánh dấu = 1 dòng da_day=false).
-- Đo lại SAU ngày đã dạy mà vẫn yếu ⇒ cờ yeu_sau_day (bảng thấy ngay cái nào dạy rồi mà chưa lên).
create table if not exists public.hinh_yeu_da_day (
  id uuid primary key default gen_random_uuid(),
  seq bigint generated always as identity,   -- thứ tự ghi: dòng seq lớn nhất của (HS × bài) thắng (created_at trùng khi 2 lần bấm cùng giao dịch)
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  hinh_baitoan_id uuid not null references public.hinh_baitoan(id),
  da_day boolean not null,
  nguoi_id uuid references public.nhan_su(id),
  created_at timestamptz not null default now()
);
create index if not exists hinh_yeu_da_day_hs_bai on public.hinh_yeu_da_day (hoc_sinh_id, hinh_baitoan_id, seq desc);
alter table public.hinh_yeu_da_day enable row level security;
drop policy if exists hinh_yeu_da_day_member_read on public.hinh_yeu_da_day;
create policy hinh_yeu_da_day_member_read on public.hinh_yeu_da_day for select to authenticated using (public.la_thanh_vien());
-- Ghi CHỈ qua fn_hinh_yeu_danh_dau_day (không policy insert/update/delete).

create or replace function public.fn_hinh_yeu_theo_mo_hinh(p_chi_cua_toi boolean default false)
returns jsonb
language sql stable security definer set search_path = public as $$
  with ns as (select public._btyeu_my_ns() as id),
  hs as (
    select h.id, h.ho_ten, h.ma_hs, h.khoi from hoc_sinh h
    where h.trang_thai = 'dang_hoc'
      and (not coalesce(p_chi_cua_toi, false)
           or exists (select 1 from hoc_sinh_lop hl join phan_cong_lop pc on pc.lop_id = hl.lop_id
                      where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and pc.nhan_su_id = (select id from ns)))
  ),
  m as (
    select c.hoc_sinh_id, c.hinh_baitoan_id, c.score, c.n, c.tin
    from public.fn_mastery_cells_hinh((select coalesce(array_agg(id), '{}') from hs), true) c
    where c.muc = 'yeu'
  ),
  cuoi as (   -- ngày đo gần nhất của (HS × bài toán): ngày buổi, không có thì ngày chấm (cùng cách fn_mastery_cells_hinh)
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           max(coalesce(bh.ngay, (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date)) as ngay
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where sp.hinh_baitoan_id is not null and g.hoc_sinh_id in (select hoc_sinh_id from m)
    group by 1, 2
  ),
  day_cuoi as (
    select distinct on (d.hoc_sinh_id, d.hinh_baitoan_id) d.hoc_sinh_id, d.hinh_baitoan_id, d.da_day, d.created_at, n2.ho_ten as nguoi
    from hinh_yeu_da_day d left join nhan_su n2 on n2.id = d.nguoi_id
    where d.hoc_sinh_id in (select hoc_sinh_id from m)
    order by d.hoc_sinh_id, d.hinh_baitoan_id, d.seq desc
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'hoc_sinh_id', hs.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi,
    'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc' and l.mon = 'Toán' order by hl.ngay_vao desc limit 1),
    'co_case_yeu', exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = hs.id and y.trang_thai = 'dang_xu'),
    'hinh_baitoan_id', m.hinh_baitoan_id, 'bai_ma', b.ma, 'phat_bieu', left(coalesce(b.phat_bieu, b.de_bai_chuan, ''), 160),
    'mo_hinh_id', mh.id, 'mo_hinh', mh.ten,
    'score', round(m.score, 2), 'n', m.n, 'tin', m.tin, 'cuoi_do', c.ngay,
    'da_day', coalesce(dc.da_day, false), 'da_day_at', case when coalesce(dc.da_day, false) then dc.created_at end, 'da_day_boi', case when coalesce(dc.da_day, false) then dc.nguoi end,
    'yeu_sau_day', coalesce(dc.da_day, false) and c.ngay > (dc.created_at at time zone 'Asia/Ho_Chi_Minh')::date
  ) order by hs.ho_ten, m.score, mh.ten), '[]'::jsonb) end
  from m
  join hs on hs.id = m.hoc_sinh_id
  join hinh_baitoan b on b.id = m.hinh_baitoan_id
  join hinh_mo_hinh mh on mh.id = b.mo_hinh_id
  left join cuoi c on c.hoc_sinh_id = m.hoc_sinh_id and c.hinh_baitoan_id = m.hinh_baitoan_id
  left join day_cuoi dc on dc.hoc_sinh_id = m.hoc_sinh_id and dc.hinh_baitoan_id = m.hinh_baitoan_id
$$;
revoke all on function public.fn_hinh_yeu_theo_mo_hinh(boolean) from public, anon;
grant execute on function public.fn_hinh_yeu_theo_mo_hinh(boolean) to authenticated, service_role;

create or replace function public.fn_hinh_yeu_danh_dau_day(p_hoc_sinh uuid, p_baitoan uuid, p_da_day boolean default true)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public._btyeu_my_ns(); v_at timestamptz;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not exists (select 1 from hoc_sinh where id = p_hoc_sinh) then raise exception 'Không thấy học sinh.'; end if;
  if not exists (select 1 from hinh_baitoan where id = p_baitoan) then raise exception 'Không thấy bài toán Hình.'; end if;
  insert into hinh_yeu_da_day (hoc_sinh_id, hinh_baitoan_id, da_day, nguoi_id)
    values (p_hoc_sinh, p_baitoan, coalesce(p_da_day, true), v_ns) returning created_at into v_at;
  return jsonb_build_object('da_day', coalesce(p_da_day, true), 'da_day_at', v_at, 'da_day_boi', (select ho_ten from nhan_su where id = v_ns));
end $$;
revoke all on function public.fn_hinh_yeu_danh_dau_day(uuid, uuid, boolean) from public, anon;
grant execute on function public.fn_hinh_yeu_danh_dau_day(uuid, uuid, boolean) to authenticated, service_role;
