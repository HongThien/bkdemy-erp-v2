-- ============================================================================
-- qlcl_dang_yeu_widget — Thùy 29/10, spec-truong-khoi.md §8.4: widget "HS có dạng yếu · số dạng yếu" ở màn chính ERP.
--
-- Đo thật 29/10: tính dạng yếu (fn_btyeu_dang_yeu_2_cua_so_moi) ~0,33 s/em ⇒ khối 8 (45 em) 15 s, Toán toàn hệ (341 em) 112 s —
-- vượt trần ~8 s của PostgREST, KHÔNG tính thẳng lúc mở màn được. Hàm đo cũng trả rỗng khi không có nhân sự đăng nhập
-- (la_thanh_vien) ⇒ không chạy bằng cron được.
-- ⇒ LƯU SẴN + TÍNH LƯỜI: bảng dang_yeu_hien_tai (1 dòng / em × môn = kết quả lần tính gần nhất). Mở widget ⇒ client gọi
--   fn_qlcl_lam_moi theo lô ≤ 10 em (~3 s) cho tới khi hết em "cũ"; widget đọc bảng nên mở ra là có số.
--   Em "cũ" = chưa có dòng · mốc 2 cửa sổ đã sang mốc mới · có điểm chấm mới sau lần tính · lần tính quá 12 giờ.
-- Công thức dạng yếu vẫn MỘT nguồn: fn_btyeu_dang_yeu_2_cua_so_moi (không viết lại).
-- Số "đầu tuần" (đóng băng lúc Trang Chốt tuần) = P3, chưa có ⇒ cột trả null.
-- ============================================================================

create table if not exists dang_yeu_hien_tai (
  mon          text not null,
  hoc_sinh_id  uuid not null references hoc_sinh(id),
  so_dang_yeu  integer not null,
  dang         jsonb not null default '[]'::jsonb,   -- [{ma_dang, ten_dang, score, n}]
  moc          date not null,                        -- _btyeu_moc_2_cua_so() lúc tính
  tinh_at      timestamptz not null default now(),
  primary key (mon, hoc_sinh_id)
);
comment on table dang_yeu_hien_tai is 'Kết quả tính dạng yếu gần nhất của mỗi em × môn (cache cho widget Trưởng khối, spec-truong-khoi.md §8.4). Nguồn công thức: fn_btyeu_dang_yeu_2_cua_so_moi. Làm mới lười qua fn_qlcl_lam_moi.';
alter table dang_yeu_hien_tai enable row level security;
drop policy if exists dyht_doc on dang_yeu_hien_tai;
create policy dyht_doc on dang_yeu_hien_tai for select to authenticated using (public.la_thanh_vien());

-- dò "có điểm mới sau lần tính" theo em
create index if not exists gami_grades_hs_graded_idx on gami_grades (hoc_sinh_id, graded_at);

-- Em đang học của ô (môn × khối)
create or replace function public._qlcl_hs_cua_o(p_mon text, p_khoi text)
returns table (hoc_sinh_id uuid)
language sql stable security definer set search_path = public as $$
  select distinct hl.hoc_sinh_id
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
$$;

-- Em của ô cần tính lại
create or replace function public._qlcl_hs_can_tinh(p_mon text, p_khoi text)
returns table (hoc_sinh_id uuid)
language sql stable security definer set search_path = public as $$
  select h.hoc_sinh_id
    from public._qlcl_hs_cua_o(p_mon, p_khoi) h
    left join dang_yeu_hien_tai d on d.mon = p_mon and d.hoc_sinh_id = h.hoc_sinh_id
   where d.hoc_sinh_id is null
      or d.moc <> public._btyeu_moc_2_cua_so()
      or d.tinh_at < now() - interval '12 hours'
      or exists (select 1 from gami_grades g where g.hoc_sinh_id = h.hoc_sinh_id and g.graded_at > d.tinh_at)
   order by d.tinh_at nulls first
$$;

-- Tính lại tối đa p_toi_da em "cũ" của ô; trả số em còn cũ. Ai trong phạm vi ô (hoặc toàn hệ) gọi được.
create or replace function public.fn_qlcl_lam_moi(p_mon text, p_khoi text, p_toi_da integer default 10)
returns integer language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_moc date := public._btyeu_moc_2_cua_so(); v_dang jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  for v_hs in select hoc_sinh_id from public._qlcl_hs_can_tinh(p_mon, p_khoi) limit greatest(1, least(coalesce(p_toi_da, 10), 30)) loop
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', d.ma_dang, 'ten_dang', d.ten_dang, 'score', round(d.score, 2), 'n', d.n) order by d.score), '[]'::jsonb)
      into v_dang from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, p_mon) d;
    insert into dang_yeu_hien_tai (mon, hoc_sinh_id, so_dang_yeu, dang, moc, tinh_at)
      values (p_mon, v_hs, jsonb_array_length(v_dang), v_dang, v_moc, now())
      on conflict (mon, hoc_sinh_id) do update set so_dang_yeu = excluded.so_dang_yeu, dang = excluded.dang, moc = excluded.moc, tinh_at = excluded.tinh_at;
  end loop;
  return (select count(*) from public._qlcl_hs_can_tinh(p_mon, p_khoi));
end $$;

-- Widget: mỗi ô trong phạm vi của tôi. Số "hiện tại" = lần tính gần nhất; so_can_tinh > 0 ⇒ client gọi fn_qlcl_lam_moi.
create or replace function public.fn_qlcl_tong_quan()
returns table (mon text, khoi text, vai text, so_hs integer, so_hs_yeu integer, so_dang_yeu integer, so_can_tinh integer,
               tinh_at timestamptz, dau_tuan_hs_yeu integer, dau_tuan_dang_yeu integer)
language sql stable security definer set search_path = public as $$
  select p.mon, p.khoi, p.vai,
         (select count(*)::int from public._qlcl_hs_cua_o(p.mon, p.khoi)),
         (select count(*)::int from public._qlcl_hs_cua_o(p.mon, p.khoi) h join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id where d.so_dang_yeu > 0),
         (select coalesce(sum(d.so_dang_yeu), 0)::int from public._qlcl_hs_cua_o(p.mon, p.khoi) h join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id),
         (select count(*)::int from public._qlcl_hs_can_tinh(p.mon, p.khoi)),
         (select max(d.tinh_at) from public._qlcl_hs_cua_o(p.mon, p.khoi) h join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id),
         null::int, null::int  -- đầu tuần: chờ P3 (đóng băng lúc Chốt tuần)
    from public.fn_pham_vi_cua_toi() p
   where public.la_thanh_vien()
   order by p.mon, p.khoi
$$;

-- Bảng chi tiết 1 ô: em có dạng yếu (theo lần tính gần nhất) + trạng thái xử lý.
create or replace function public.fn_qlcl_dang_yeu_hs(p_mon text, p_khoi text)
returns table (hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, so_dang_yeu integer, dang jsonb, tinh_at timestamptz,
               so_ca_nhe_tuan integer, co_case_yeu boolean, dang_theo_doi boolean)
language plpgsql stable security definer set search_path = public as $$
declare v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date;
begin
  if not public.la_thanh_vien() or not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  return query
  select h.id, h.ho_ten, h.ma_hs, l.id, l.ten_lop, d.so_dang_yeu, d.dang, d.tinh_at,
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.id and y.mon = p_mon and y.trang_thai = 'dang_xu'),
         exists (select 1 from bo_tro_theo_doi t where t.hoc_sinh_id = h.id and t.mon = p_mon and t.trang_thai = 'theo_doi')
    from dang_yeu_hien_tai d
    join hoc_sinh h on h.id = d.hoc_sinh_id
    join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                   where hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
                   order by hl.ngay_vao desc limit 1) l on true
   where d.mon = p_mon and d.so_dang_yeu > 0
   order by d.so_dang_yeu desc, h.ho_ten;
end $$;

do $$
declare f text;
begin
  foreach f in array array[
    'public._qlcl_hs_cua_o(text, text)', 'public._qlcl_hs_can_tinh(text, text)', 'public.fn_qlcl_lam_moi(text, text, integer)',
    'public.fn_qlcl_tong_quan()', 'public.fn_qlcl_dang_yeu_hs(text, text)']
  loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
