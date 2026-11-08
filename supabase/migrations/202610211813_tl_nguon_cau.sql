-- ============================================================================
-- 202610211813 — tl_nguon_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 21/10: chuyên đề (ôn tập, gom từ đề thi / đề cương) — mỗi bài in kèm chú thích "đề cương / đề thi trường nào",
--   nội dung câu xuống dòng dưới. Nguồn của câu không nằm cùng chỗ: bài Hình–Luyện có sẵn hinh_bai.nguon (tên đề khi nhập);
--   câu Đại chỉ ghi nguon = 'de_thi' ⇒ phải tra ngược đề thi (tai_lieu loai de_thi) đang chứa câu đó. Gom MỘT hàm cho
--   mọi bản in đọc (Đại · Hình), kèm rút gọn tên đề ở DB (một nguồn duy nhất, không viết lại ở client).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thêm 2 hàm đọc.
-- ============================================================================

-- Rút gọn tên đề để in: "Đề kiểm tra giữa học kì 1 Toán 7 năm 2025-2026 — THCS Thanh Miện (đề chẵn)"
--   ⇒ "Đề thi giữa kì 1 năm 2025-2026 — THCS Thanh Miện"; "Đề cương ôn tập giữa học kì 1 Toán 7 — THCS Tây Mỗ" ⇒ "Đề cương giữa kì 1 — THCS Tây Mỗ".
create or replace function _nguon_ngan(p text) returns text language sql immutable as $$
  select nullif(btrim(
    regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
      coalesce(p, ''),
      '\s*\([^()]*\)\s*$', ''),            -- ghi chú cuối "(đề chẵn)", "(mã đề A)"…
      '^Đề kiểm tra', 'Đề thi'),
      'ôn tập\s+', '', 'g'),
      'học kì', 'kì', 'g'),
      '\s+Toán\s+\d+T?(\s|$)', '\1', 'g')   -- môn + khối đã rõ từ chuyên đề (Postgres: \b là backspace, không phải ranh giới từ)
  ), '')
$$;

-- Nguồn từng câu / bài của 1 tài liệu (mã câu ⇒ chú thích ngắn). Không có nguồn ⇒ không có dòng (§1.5).
create or replace function fn_tl_nguon_cau(p_tai_lieu uuid) returns table (ma_cau text, nguon text)
language sql stable security definer set search_path to 'public' as $$
  with cau as (
    select distinct tc.ma_cau from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
     where p.tai_lieu_id = p_tai_lieu and la_thanh_vien()
  ), tu_de as (
    select c.ma_cau, string_agg(distinct _nguon_ngan(t.ten), '; ') nguon
      from cau c join tai_lieu_cau tc on tc.ma_cau = c.ma_cau join tai_lieu_phan p on p.id = tc.phan_id
      join tai_lieu t on t.id = p.tai_lieu_id and t.loai = 'de_thi' and t.id <> p_tai_lieu
     group by c.ma_cau
  )
  select c.ma_cau, coalesce(_nguon_ngan(hb.nguon), d.nguon)
    from cau c left join hinh_bai hb on hb.ma_bai = c.ma_cau left join tu_de d on d.ma_cau = c.ma_cau
   where coalesce(_nguon_ngan(hb.nguon), d.nguon) is not null
$$;

revoke execute on function fn_tl_nguon_cau(uuid) from public, anon;
grant execute on function fn_tl_nguon_cau(uuid) to authenticated;
