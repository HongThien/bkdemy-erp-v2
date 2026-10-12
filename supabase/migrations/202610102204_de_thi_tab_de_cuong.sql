-- Kho đề thi: TAB RIÊNG "Đề cương" (CEO 10/10/2026).
-- Đề cương ôn tập (không phải đề thi) vẫn là tai_lieu(loai='de_thi') — dùng nguyên màn sửa / in / giao — nhưng mang dấu
-- cau_hinh.deThi.kieu = 'de_cuong' (do ghi.mjs ghi từ de.json.kieu). Dấu này tách đề cương ra khỏi 3 tab suy-động
-- Chờ duyệt / Sẵn sàng / Đã giao (để không lẫn vào hàng đợi duyệt đề thi) và cho một tab thứ tư 'de_cuong'.
--  · fn_de_thi_ds(p_tab='de_cuong') = mọi đề cương (mọi trạng thái); 3 tab cũ loại đề cương ra.
--  · fn_de_thi_dem trả thêm khoá 'de_cuong'; 3 khoá cũ không còn đếm đề cương.
-- Chữ ký hàm KHÔNG đổi (create or replace giữ nguyên quyền).

CREATE OR REPLACE FUNCTION public.fn_de_thi_dem(p_mon text, p_khoi text DEFAULT NULL::text)
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
$function$;

CREATE OR REPLACE FUNCTION public.fn_de_thi_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_tab text DEFAULT 'cho_duyet'::text, p_tim text DEFAULT NULL::text, p_gioi_han integer DEFAULT 25, p_truoc timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(id uuid, ten text, khoi text, mon text, created_at timestamp with time zone, updated_at timestamp with time zone, duyet_at timestamp with time zone, nguon text, nam integer, co_de_goc boolean, so_cau integer, so_chan integer, so_chua_dang integer, so_canh_bao_nhap integer, so_luot integer, luot_gan_nhat date)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with trang as (
    select t.* from tai_lieu t
     where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
       and (nullif(btrim(p_tim), '') is null or t.ten ilike '%' || btrim(p_tim) || '%')
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
                  (select max(g.ngay) from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn')))
    from trang t
    cross join lateral (select public.fn_de_thi_thieu(t.id) v) th
   order by t.created_at desc
$function$;
