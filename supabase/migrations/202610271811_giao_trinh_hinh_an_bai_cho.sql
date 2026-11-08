-- ============================================================================
-- 202610271811 — giao_trinh_hinh_an_bai_cho
-- ----------------------------------------------------------------------------
-- VÌ SAO: bộ chọn bài học của giáo trình Hình (mig 202610271757) hiện cả bài "Chưa phân dạng — Hình học N" (mã …000000 = dạng chờ,
--   kho-rules/README.md) — đó là chỗ chứa câu chưa xếp, không phải bài để dạy. Ẩn khỏi bộ chọn (câu vẫn nguyên trong kho).
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ đổi thân 1 hàm đọc.
-- ============================================================================
create or replace function fn_tl_hh_cay_chon(p_khoi text) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_bai', b.ma_bai, 'ten', b.ten_bai, 'thu_tu', b.thu_tu, 'chu_de_id', b.chu_de_id, 'chu_de', cd.ten,
           'so_cau', (select count(*) from _tl_hh_cau_chuan(b.ma_bai)),
           'co_ly_thuyet', exists (select 1 from hinh_hoc_bai_ly_thuyet l where l.ma_bai = b.ma_bai and (btrim(l.noi_dung) <> '' or l.file_url is not null))
         ) order by cd.thu_tu nulls last, cd.id, b.thu_tu, b.ma_bai), '[]'::jsonb)
    from hinh_hoc_bai b left join dai_bdm_chu_de cd on cd.id = b.chu_de_id
   where b.khoi = p_khoi and b.ma_bai not like '%000000' and la_thanh_vien()
$$;
