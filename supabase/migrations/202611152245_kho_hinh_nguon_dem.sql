-- ============================================================================
-- 202611152245 — kho_hinh_nguon_dem
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 15/11 (spec-giai-bai.md §A8, §C12): hình đề "gốc ổn giữ · gốc quá tệ (mã a–f) vẽ lại · có lệnh thì vẽ lại" + BỘ ĐẾM theo khối.
--   Đo 15/11: đường dẫn ảnh trong bucket không cho biết ảnh là gốc hay vẽ (cả hai ở nhap_kho/…) ⇒ phải ghi NHÃN NGUỒN riêng.
--   Pure-derive (CLAUDE.md §4, §1.5): chỉ đẻ dòng khi có kết quả thật — một dòng nhãn lúc GẮN một hình, một dòng lệnh lúc người RA LỆNH.
--   "Chưa rõ nguồn" = câu có anh_de mà không có nhãn khớp URL hiện tại (không đẻ dòng chờ). "Lệnh đang chờ" = lệnh chưa có nhãn vẽ sau nó.
--   Nhãn bám (kho, ma_cau, url): ai đổi ảnh mà không ghi nhãn ⇒ câu tự rơi về "chưa rõ nguồn" — không đếm sai im lặng.
-- PHIẾU (spec-kien-truc §9): miền KHO · mã gốc = id identity · mon có cột · ghi = claude_build (script), đọc = authenticated + claude_ro ·
--   không màn nào gọi (sổ md `scripts/kho/so-hinh.mjs` gọi fn_kho_hinh_dem) · đếm cả kho ~13k ảnh, đo ở lượt áp · index theo (kho, ma_cau) ·
--   không polling · hạn giữ: giữ hết (≤ vài dòng mỗi ảnh, là lịch sử nguồn hình — K17).
-- MẤT GÌ: không — chỉ tạo mới 2 bảng + 1 hàm.
-- ============================================================================

create table if not exists public.kho_hinh_lenh_ve (
  id        bigint generated always as identity primary key,
  mon       text not null default 'Toán' check (mon <> ''),
  kho       text not null check (kho in ('dai','hgt','hinh_hoc','hinh_hoc_lop','hinh_luyen')),
  ma_cau    text not null,                 -- mã gốc của câu / bài trong kho đó
  url_luc_ra text,                         -- anh_de lúc ra lệnh (đối chiếu: đã thay ảnh chưa)
  ly_do     text,
  ra_boi    text not null,                 -- người ra lệnh (Thùy / trưởng khối — ghi tên)
  tao_at    timestamptz not null default clock_timestamp()
);
comment on table public.kho_hinh_lenh_ve is 'Lệnh VẼ LẠI hình đề (spec-giai-bai §A8.3). Một dòng = một câu được ra lệnh. Đang chờ = chưa có nhãn ve_* sau tao_at. Giữ hết (K17).';
create index if not exists kho_hinh_lenh_ve_cau_idx on public.kho_hinh_lenh_ve (kho, ma_cau, tao_at desc);

create table if not exists public.kho_hinh_nguon (
  id        bigint generated always as identity primary key,
  mon       text not null default 'Toán' check (mon <> ''),
  kho       text not null check (kho in ('dai','hgt','hinh_hoc','hinh_hoc_lop','hinh_luyen')),
  ma_cau    text not null,
  url       text not null,                 -- đúng giá trị anh_de được gắn
  nguon     text not null check (nguon in ('goc','ve_lai','ve_lenh','ve_moi')),
  ma_loi    text check (ma_loi ~ '^[a-f]{1,6}$'),
  lenh_id   bigint references public.kho_hinh_lenh_ve(id),
  ghi_boi   text not null,                 -- 'claude_code' / tên người
  tao_at    timestamptz not null default clock_timestamp(),
  constraint kho_hinh_nguon_ma_loi_ck check ((nguon = 've_lai') = (ma_loi is not null))
);
comment on table public.kho_hinh_nguon is 'Nhãn NGUỒN của hình đề lúc gắn (spec-giai-bai §A8.4): goc · ve_lai (ma_loi a–f) · ve_lenh · ve_moi. Hiện tại = dòng mới nhất cùng (kho, ma_cau) có url = anh_de hiện tại. Giữ hết (K17).';
create index if not exists kho_hinh_nguon_cau_idx on public.kho_hinh_nguon (kho, ma_cau, tao_at desc) include (url, nguon, ma_loi);
create index if not exists kho_hinh_nguon_lenh_idx on public.kho_hinh_nguon (lenh_id) where lenh_id is not null;

alter table public.kho_hinh_lenh_ve enable row level security;
alter table public.kho_hinh_nguon   enable row level security;
drop policy if exists kho_hinh_lenh_ve_doc on public.kho_hinh_lenh_ve;
create policy kho_hinh_lenh_ve_doc on public.kho_hinh_lenh_ve for select to authenticated using (true);
drop policy if exists kho_hinh_nguon_doc on public.kho_hinh_nguon;
create policy kho_hinh_nguon_doc on public.kho_hinh_nguon for select to authenticated using (true);
-- Ghi: chỉ script (role sở hữu claude_build / service_role) — không policy ghi cho authenticated.

-- Bộ đếm theo kho × khối. Đếm cả kho (~13k ảnh) — chỉ cho sổ md / CLI, KHÔNG cho màn (K2).
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
comment on function public.fn_kho_hinh_dem(text) is 'Bộ đếm hình đề theo kho × khối (spec-giai-bai §C12). Đếm cả kho — chỉ cho sổ md / CLI, không gọi từ màn.';
revoke execute on function public.fn_kho_hinh_dem(text) from public, anon;
grant execute on function public.fn_kho_hinh_dem(text) to authenticated, service_role;
