-- HÌNH GIẢI TÍCH lên BẢN ĐỒ MỚI (builder B6 bước 6; Thùy 21/10 "nối luôn — HGT theo bản đồ mới", để Chuyên đề / giáo trình
-- nhánh HGT chọn câu theo nhóm · dạng bài như Đại).
--   · hgt_bdm_gan_cau (câu HGT → dạng bài) ĐÃ CÓ từ mig 202610181814_ban_do_moi_kho_hgt (979 câu đã gán lúc viết, 650 đề xuất,
--     356 thiếu dạng) — file này KHÔNG tạo bảng, chỉ cho builder đọc.
--   · _tl_bdm_cau_vi_tri(khoi): thêm câu HGT đã gán ⇒ MỌI hàm builder (cây chọn, kho câu nhóm, gợi ý, ET) thấy câu HGT
--     mà không sửa từng hàm. Mã câu HGT (T3…) và Đại (T1…) không trùng nhau.

CREATE OR REPLACE FUNCTION public._tl_bdm_cau_vi_tri(p_khoi text)
 RETURNS TABLE(ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  return query
  with cg as materialized (
    select * from _bdm_cau_giai(array(
      select b.ma_dang from dai_ban_do b where b.khoi = p_khoi
      union
      select unnest(_bdm_dang_cu_cua_khoi(p_khoi))))
  ),
  mot_nhom as (
    select d.ma_dang_cu, min(d.dich_nhom) as nhom
      from dai_bdm_doi_ung d
     group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_nhom) = 1
  )
  select c.ma_cau, c.parent_ma_cau is null, coalesce(cg.ma_cum_cu, c.parent_ma_cau, c.ma_cau), c.loai_cau,
         cg.dang_bai_id, coalesce(db.nhom_id, mn.nhom)
    from cg
    join dai_cau_hoi c on c.ma_cau = cg.ma_cau
    left join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
    left join mot_nhom mn on mn.ma_dang_cu = cg.ma_dang_cu and cg.dang_bai_id is null
   where c.kho_chuan and c.xoa_at is null
  union all
  -- HGT: chỉ câu ĐÃ GÁN dạng bài (hgt_bdm_gan_cau), dạng bài thuộc chủ đề của khối này
  select h.ma_cau, h.parent_ma_cau is null, coalesce(h.ma_cum, h.parent_ma_cau, h.ma_cau), h.loai_cau, g.dang_bai_id, db.nhom_id
    from hgt_bdm_gan_cau g
    join hgt_cau_hoi h on h.ma_cau = g.ma_cau
    join dai_bdm_dang_bai db on db.id = g.dang_bai_id
    join dai_bdm_nhom n on n.id = db.nhom_id
    join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where cd.khoi = p_khoi and h.kho_chuan and h.xoa_at is null;
end $function$;
