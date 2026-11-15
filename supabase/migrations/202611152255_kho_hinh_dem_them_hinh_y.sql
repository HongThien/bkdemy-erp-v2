-- ============================================================================
-- 202611152255 — kho_hinh_dem_them_hinh_y
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Bộ đếm hình đề (mig 202611152245, spec-giai-bai §C12) chưa đếm hình theo Ý của Hình luyện (`hinh_y.anh_de`, mã gốc `ma_y`).
--   Thùy 15/11 "nốt đi" ⇒ thêm kho `hinh_luyen_y`; khối lấy qua bài cha (`hinh_y.bai_id → hinh_bai.khoi`).
--   Chỉ NỚI check (thêm một giá trị) trên 2 bảng mới tạo tối nay (vài dòng) + thay thân hàm đếm (chữ ký giữ nguyên).
-- MẤT GÌ: không.
-- ============================================================================

alter table public.kho_hinh_nguon   drop constraint if exists kho_hinh_nguon_kho_check;
alter table public.kho_hinh_nguon   add  constraint kho_hinh_nguon_kho_check   check (kho in ('dai','hgt','hinh_hoc','hinh_hoc_lop','hinh_luyen','hinh_luyen_y'));
alter table public.kho_hinh_lenh_ve drop constraint if exists kho_hinh_lenh_ve_kho_check;
alter table public.kho_hinh_lenh_ve add  constraint kho_hinh_lenh_ve_kho_check check (kho in ('dai','hgt','hinh_hoc','hinh_hoc_lop','hinh_luyen','hinh_luyen_y'));

create or replace function public.fn_kho_hinh_dem(p_mon text default 'Toán')
returns table (kho text, khoi text, co_hinh int, goc int, ve_lai int, ve_lai_theo_ma jsonb, ve_lenh int, ve_moi int, chua_ro int, lenh_cho int)
language sql stable security invoker set search_path = public as $$
  with cau as (
    select 'dai'::text kho, c.ma_cau, c.anh_de url,
           case when substr(c.dang_chinh,3,2) ~ '^0[0-9]$' then substr(c.dang_chinh,4,1) else substr(c.dang_chinh,3,2) end khoi
      from dai_cau_hoi c where c.anh_de is not null and c.anh_de <> '' and c.xoa_at is null and p_mon = 'Toán'
    union all
    select 'hgt', c.ma_cau, c.anh_de,
           case when substr(c.dang_chinh,3,2) ~ '^0[0-9]$' then substr(c.dang_chinh,4,1) else substr(c.dang_chinh,3,2) end
      from hgt_cau_hoi c where c.anh_de is not null and c.anh_de <> '' and c.xoa_at is null and p_mon = 'Toán'
    union all
    select 'hinh_hoc', c.ma_cau, c.anh_de,
           coalesce(b.khoi, case when length(c.dang_chinh) = 10 then ltrim(substr(c.dang_chinh,3,2),'0') end)
      from hinh_hoc_cau_hoi c left join hinh_hoc_bai b on b.ma_bai = c.dang_chinh
     where c.anh_de is not null and c.anh_de <> '' and c.xoa_at is null and p_mon = 'Toán'
    union all
    select 'hinh_hoc_lop', c.ma_cau, c.anh_de, b.khoi
      from hinh_hoc_cau_lop c left join hinh_hoc_bai b on b.ma_bai = c.dang_bai_id
     where c.anh_de is not null and c.anh_de <> '' and c.xoa_at is null and c.mon = p_mon
    union all
    select 'hinh_luyen', h.ma_bai, h.anh_de, h.khoi
      from hinh_bai h where h.anh_de is not null and h.anh_de <> '' and p_mon = 'Toán'
    union all
    select 'hinh_luyen_y', y.ma_y, y.anh_de, h.khoi
      from hinh_y y left join hinh_bai h on h.id = y.bai_id
     where y.anh_de is not null and y.anh_de <> '' and p_mon = 'Toán'
  ), nhan as (
    select distinct on (n.kho, n.ma_cau) n.kho, n.ma_cau, n.url, n.nguon, n.ma_loi, n.tao_at
      from kho_hinh_nguon n where n.mon = p_mon order by n.kho, n.ma_cau, n.tao_at desc, n.id desc
  ), lenh as (
    select distinct on (l.kho, l.ma_cau) l.kho, l.ma_cau, l.tao_at
      from kho_hinh_lenh_ve l where l.mon = p_mon order by l.kho, l.ma_cau, l.tao_at desc, l.id desc
  ), gop as (
    select c.kho, coalesce(c.khoi, '?') khoi,
           case when n.url = c.url then n.nguon end nguon,
           case when n.url = c.url then n.ma_loi end ma_loi,
           (l.ma_cau is not null
            and not coalesce(n.url = c.url and n.nguon <> 'goc' and n.tao_at > l.tao_at, false)) lenh_cho
      from cau c
      left join nhan n on n.kho = c.kho and n.ma_cau = c.ma_cau
      left join lenh l on l.kho = c.kho and l.ma_cau = c.ma_cau
  ), dem_loi as (
    select x.kho, x.khoi, jsonb_object_agg(x.m, x.so order by x.m) theo_ma
      from (select g.kho, g.khoi, m, count(*)::int so
              from gop g cross join lateral unnest(string_to_array(g.ma_loi, null)) m
             where g.nguon = 've_lai' group by 1,2,3) x
     group by x.kho, x.khoi
  )
  select g.kho, g.khoi, count(*)::int,
         count(*) filter (where g.nguon = 'goc')::int,
         count(*) filter (where g.nguon = 've_lai')::int,
         coalesce((select d.theo_ma from dem_loi d where d.kho = g.kho and d.khoi = g.khoi), '{}'::jsonb),
         count(*) filter (where g.nguon = 've_lenh')::int,
         count(*) filter (where g.nguon = 've_moi')::int,
         count(*) filter (where g.nguon is null)::int,
         count(*) filter (where g.lenh_cho)::int
    from gop g group by g.kho, g.khoi order by g.kho, g.khoi
$$;
revoke execute on function public.fn_kho_hinh_dem(text) from public, anon;
grant execute on function public.fn_kho_hinh_dem(text) to authenticated, service_role;
