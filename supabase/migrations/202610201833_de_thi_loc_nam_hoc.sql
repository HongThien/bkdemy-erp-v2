-- ============================================================================
-- KHO ĐỀ THI — lọc theo NĂM HỌC (Thùy 20/10). Năm học = số năm ĐẦU (2025 ⇒ "2025–2026"); NULL = chưa rõ.
-- cau_hinh.deThi.nam KHÔNG thống nhất nghĩa (đề "2024-2025" lưu 2024 = năm đầu; thi thử / vào 10 "2026" lưu năm thi =
-- năm CUỐI) nên SUY, không ghi dữ liệu (_de_thi_nam_hoc), đặt tay ở cau_hinh.deThi.namHoc thì thắng:
--   ① tên có "YYYY-YYYY+1" ⇒ YYYY · ② không có nam ⇒ chưa rõ · ③ tên có "tháng N" ⇒ N ≥ 8 ? nam : nam−1
--   ④ kỳ Giữa/Cuối kì I ⇒ nam (thi ở năm đầu) · ⑤ còn lại (kì II, khảo sát, thi thử, vào 10) ⇒ nam−1.
-- fn_de_thi_ds / fn_de_thi_dem thêm p_nam_hoc (text: '2025' | 'chua_ro' | NULL = mọi năm) ⇒ drop + tạo lại (chỉ hàm).
-- fn_de_thi_nam_hoc(p_mon) = các năm học đang có (cho ô lọc).
-- ============================================================================
create or replace function public._de_thi_nam_hoc(p_cau_hinh jsonb, p_ten text) returns int
language sql immutable as $$
  select case
    when (p_cau_hinh -> 'deThi' ->> 'namHoc') ~ '^\d{4}$' then (p_cau_hinh -> 'deThi' ->> 'namHoc')::int
    when x.r is not null and x.r[2]::int = x.r[1]::int + 1 then x.r[1]::int
    when x.nam is null then null
    when x.th is not null then case when x.th::int between 8 and 12 then x.nam else x.nam - 1 end
    when public._de_thi_ky(p_cau_hinh, p_ten) in ('gk1', 'ck1') then x.nam
    else x.nam - 1 end
  from (select regexp_match(coalesce(p_ten, ''), '(20\d\d)\s*[-–—/]\s*(20\d\d)') r,
               case when (p_cau_hinh -> 'deThi' ->> 'nam') ~ '^\d{4}$' then (p_cau_hinh -> 'deThi' ->> 'nam')::int end nam,
               (regexp_match(lower(coalesce(p_ten, '')), 'tháng\s+(\d{1,2})\M'))[1] th) x
$$;

-- điều kiện lọc dùng chung cho ds + dem
create or replace function public._de_thi_khop_nam_hoc(p_cau_hinh jsonb, p_ten text, p_nam_hoc text) returns boolean
language sql immutable as $$
  select case when p_nam_hoc is null then true
              when p_nam_hoc = 'chua_ro' then public._de_thi_nam_hoc(p_cau_hinh, p_ten) is null
              when p_nam_hoc ~ '^\d{4}$' then public._de_thi_nam_hoc(p_cau_hinh, p_ten) = p_nam_hoc::int
              else false end
$$;

drop function if exists public.fn_de_thi_ds(text, text, text, text, integer, timestamptz, text);
create function public.fn_de_thi_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_tab text DEFAULT 'cho_duyet'::text, p_tim text DEFAULT NULL::text,
                                    p_gioi_han integer DEFAULT 25, p_truoc timestamp with time zone DEFAULT NULL::timestamp with time zone,
                                    p_ky text DEFAULT NULL::text, p_nam_hoc text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, ten text, khoi text, mon text, created_at timestamp with time zone, updated_at timestamp with time zone, duyet_at timestamp with time zone,
               nguon text, nam integer, co_de_goc boolean, so_cau integer, so_chan integer, so_chua_dang integer, so_canh_bao_nhap integer, so_luot integer,
               luot_gan_nhat date, ky text, nam_hoc integer)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with trang as (
    select t.* from tai_lieu t
     where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
       and (nullif(btrim(p_tim), '') is null or t.ten ilike '%' || btrim(p_tim) || '%')
       and (p_ky is null or public._de_thi_ky(t.cau_hinh, t.ten) = p_ky)
       and public._de_thi_khop_nam_hoc(t.cau_hinh, t.ten, p_nam_hoc)
       and case p_tab
             when 'de_cuong'  then coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong'
             when 'cho_duyet' then not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is null
             when 'san_sang'  then not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is not null
             when 'da_giao'   then not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and public._de_thi_da_giao(t.id)
             else true end
       and (p_truoc is null or t.created_at < p_truoc)
     order by t.created_at desc
     limit least(greatest(p_gioi_han, 1), 100)
  )
  select t.id, t.ten, t.khoi, t.mon, t.created_at, t.updated_at, t.duyet_at,
         nullif(t.cau_hinh -> 'deThi' ->> 'nguon', ''), nullif(t.cau_hinh -> 'deThi' ->> 'nam', '')::int,
         coalesce(t.cau_hinh -> 'deThi' ->> 'pdfGocUrl', t.file_url) is not null,
         (th.v ->> 'tong')::int, (th.v ->> 'so_chan')::int, (th.v ->> 'so_chua_dang')::int,
         (select count(*)::int from jsonb_object_keys(case when jsonb_typeof(t.cau_hinh -> 'deThi' -> 'canhBaoCau') = 'object'
                                                          then t.cau_hinh -> 'deThi' -> 'canhBaoCau' else '{}'::jsonb end)),
         -- số lần giao = lượt thi + số buổi đã gán (Giáo trình / BTVN)
         (select count(*)::int from bai_test b where b.nguon_tai_lieu_id = t.id)
           + (select count(*)::int from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn')),
         greatest((select max(b.ngay) from bai_test b where b.nguon_tai_lieu_id = t.id),
                  (select max(g.ngay) from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn'))),
         public._de_thi_ky(t.cau_hinh, t.ten),
         public._de_thi_nam_hoc(t.cau_hinh, t.ten)
    from trang t
    cross join lateral (select public.fn_de_thi_thieu(t.id) v) th
   order by t.created_at desc
$function$;
revoke all on function public.fn_de_thi_ds(text, text, text, text, integer, timestamptz, text, text) from public;
grant execute on function public.fn_de_thi_ds(text, text, text, text, integer, timestamptz, text, text) to authenticated;

drop function if exists public.fn_de_thi_dem(text, text, text);
create function public.fn_de_thi_dem(p_mon text, p_khoi text DEFAULT NULL::text, p_ky text DEFAULT NULL::text, p_nam_hoc text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'cho_duyet', count(*) filter (where not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is null),
    'san_sang',  count(*) filter (where not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is not null),
    'da_giao',   count(*) filter (where not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and public._de_thi_da_giao(t.id)),
    'de_cuong',  count(*) filter (where coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong'))
  from tai_lieu t
  where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
    and (p_ky is null or public._de_thi_ky(t.cau_hinh, t.ten) = p_ky)
    and public._de_thi_khop_nam_hoc(t.cau_hinh, t.ten, p_nam_hoc)
$function$;
revoke all on function public.fn_de_thi_dem(text, text, text, text) from public;
grant execute on function public.fn_de_thi_dem(text, text, text, text) to authenticated;

-- Các năm học đang có của 1 môn (mới nhất trước) + có đề chưa rõ năm không — cho ô lọc.
create or replace function public.fn_de_thi_nam_hoc(p_mon text)
returns jsonb language sql stable set search_path to 'public' as $$
  select jsonb_build_object(
    'nam', coalesce((select jsonb_agg(n order by n desc) from (
             select distinct public._de_thi_nam_hoc(t.cau_hinh, t.ten) n from tai_lieu t where t.loai = 'de_thi' and t.mon = p_mon) x
           where n is not null), '[]'::jsonb),
    'co_chua_ro', exists (select 1 from tai_lieu t where t.loai = 'de_thi' and t.mon = p_mon and public._de_thi_nam_hoc(t.cau_hinh, t.ten) is null))
$$;
revoke all on function public.fn_de_thi_nam_hoc(text) from public;
grant execute on function public.fn_de_thi_nam_hoc(text) to authenticated;
