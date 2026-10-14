-- ============================================================================
-- 202610141248 — hinh_luyen_chua_phan_theo_mo_hinh
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "Sao thêm bài vào kho lại phải gán bài gì. Thêm bài vào kho mô hình chỉ cần mô hình thôi".
--   Trước: "chưa phân mô hình" = bài có ý chưa gán vào BÀI của mô hình (hinh_y.baitoan_id null) ⇒ gán mô hình rồi
--   bài vẫn nằm trong hàng đợi. Sửa: VÀO KHO = gán MÔ HÌNH cho cả bài (hinh_bai.mo_hinh_id). Gán ý → bài mô hình
--   là bước sau, tuỳ chọn, không còn là điều kiện vào kho.
--   Bài đời cũ chỉ có ý gán (chưa có mo_hinh_id, vd HLB00095) vẫn coi là đã vào kho — khớp fn_hl_kho_cua_mo_hinh.
--
-- MẤT GÌ: không. Thân 2 hàm lấy từ bản ĐANG CHẠY (pg_get_functiondef), chỉ đổi điều kiện lọc.
-- ============================================================================
create or replace function fn_hl_kho_chua_phan(p_khoi text, p_gioi_han integer default 30, p_bo_qua integer default 0)
returns jsonb language sql stable set search_path to 'public' as $function$
  with b as (
    select hb.* from hinh_bai hb
     where (p_khoi is null or hb.khoi = p_khoi)
       and hb.mo_hinh_id is null
       and not exists (select 1 from hinh_y y where y.bai_id = hb.id and y.baitoan_id is not null)
     order by hb.created_at, hb.ma_bai
     limit greatest(1, least(coalesce(p_gioi_han, 30), 200)) offset greatest(0, coalesce(p_bo_qua, 0))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'ma_bai', b.ma_bai, 'khoi', b.khoi, 'nguon', b.nguon, 'nguon_ma_cau', b.nguon_ma_cau,
    'de_bai', b.de_bai, 'gia_thiet_chung', b.gia_thiet_chung, 'huong_dan', b.huong_dan, 'anh_de', b.anh_de,
    'can_tach_tay', b.can_tach_tay, 'mo_hinh_id', b.mo_hinh_id,
    'y', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', y.id, 'ma_y', y.ma_y, 'thu_tu', y.thu_tu, 'nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung,
            'gia_thiet_them', y.gia_thiet_them, 'dap_an', y.dap_an, 'loi_giai', y.loi_giai, 'anh_loi_giai', y.anh_loi_giai,
            'anh_de', y.anh_de, 'da_duyet', y.da_duyet, 'baitoan_id', y.baitoan_id) order by y.thu_tu), '[]'::jsonb)
            from hinh_y y where y.bai_id = b.id)
  ) order by b.created_at, b.ma_bai), '[]'::jsonb) from b
$function$;

create or replace function fn_hl_dem_chua_phan()
returns table(khoi text, so_bai bigint, so_y bigint) language sql stable set search_path to 'public' as $function$
  select hb.khoi, count(distinct hb.id), count(y.id)
    from hinh_bai hb left join hinh_y y on y.bai_id = hb.id
   where hb.mo_hinh_id is null
     and not exists (select 1 from hinh_y y2 where y2.bai_id = hb.id and y2.baitoan_id is not null)
   group by hb.khoi
$function$;
