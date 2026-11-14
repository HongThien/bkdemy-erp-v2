-- [14/11 · tối ưu] fn_de_thi_ds (màn Duyệt đề / Kho đề thi): fn_de_thi_thieu bị chạy 3 LẦN cho mỗi đề.
-- Vì sao: "cross join lateral (select fn_de_thi_thieu(t.id) v) th" rồi dùng th.v ở 3 cột ⇒ Postgres kéo subquery lên và chép lời gọi hàm
-- (STABLE) vào TỪNG chỗ tham chiếu. Đo 14/11: 25 đề = 620 ms, trong đó fn_de_thi_thieu × 25 chỉ 200 ms.
-- Sửa: thêm "offset 0" (rào tối ưu) ⇒ hàm chạy đúng 1 lần/đề. KHÔNG đổi kết quả: so cũ–mới 11 lượt gọi (2 môn × 5 tab + lọc khối), 708 dòng, lệch 0;
-- thời gian 25,0 s → 9,6 s (100 đề/lượt). Thân hàm lấy từ DB lúc sinh, có chốt md5 thân cũ.
-- Cùng mẫu có ở 10 hàm khác (_kho_ten_dang × 2, _task_xong_at × 3…) — đã đo, chênh < 10 % ⇒ KHÔNG sửa (không đáng đụng).


do $chot$ begin
  if (select md5(prosrc) from pg_proc where oid = 'public.fn_de_thi_ds(text, text, text, text, integer, timestamp with time zone, text, text)'::regprocedure) <> '8cf5093c7d579dee1b5d5419f5f5a8b6' then
    raise exception 'Thân hàm fn_de_thi_ds đã đổi so với lúc sinh migration — sinh lại.';
  end if;
end $chot$;

CREATE OR REPLACE FUNCTION public.fn_de_thi_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_tab text DEFAULT 'cho_duyet'::text, p_tim text DEFAULT NULL::text, p_gioi_han integer DEFAULT 25, p_truoc timestamp with time zone DEFAULT NULL::timestamp with time zone, p_ky text DEFAULT NULL::text, p_nam_hoc text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, ten text, khoi text, mon text, created_at timestamp with time zone, updated_at timestamp with time zone, duyet_at timestamp with time zone, nguon text, nam integer, co_de_goc boolean, so_cau integer, so_chan integer, so_chua_dang integer, so_canh_bao_nhap integer, so_luot integer, luot_gan_nhat date, ky text, nam_hoc integer)
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
    cross join lateral (select public.fn_de_thi_thieu(t.id) v offset 0) th
   order by t.created_at desc
$function$;

