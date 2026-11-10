-- ============================================================================
-- 202611091800 — bdm_cau_giai_khong_quet_ca_kho
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 09/11 "Không tải được bản đồ mới: canceling statement due to statement timeout — bản đồ rất hay bị lỗi này".
--   fn_bdm_cay (và mọi hàm đếm bản đồ) gọi _bdm_cau_giai. Bản cũ tra cụm của câu GỐC bằng
--   `left join dai_cau_hoi g on g.ma_cau = q.goc and q.goc <> q.ma_cau` ⇒ planner băm CẢ bảng dai_cau_hoi
--   (Seq Scan 69.811 dòng ≈ 83 MB) ở MỌI lần mở bản đồ, khối nào cũng vậy. Cache nóng ≈ 0,9 s; lúc DB bận phải đọc đĩa
--   (Supabase gói nhỏ giới hạn IO) ⇒ vượt trần 8 s của role authenticated ⇒ lỗi chập chờn.
--   Thêm: hàm SQL gọi với mảng tham số ⇒ planner dùng kế hoạch chung ước sai (≈46k block/lần dù mảng thật chỉ cần ≈5k) ⇒ chuyển
--   plpgsql RETURN QUERY EXECUTE … USING để mỗi lần lập kế hoạch theo mảng thật.
--   Sửa: chỉ tra cụm cho đúng các câu gốc CẦN (bản sao không có ma_cum), qua khoá chính. Kết quả trả về GIỮ Y HỆT
--   (đã so md5 toàn bộ đầu ra fn_bdm_cay 13 khối trước/sau trong transaction ROLLBACK).
-- MẤT GÌ (Luật xoá): Không. Chỉ CREATE OR REPLACE thân hàm, cùng chữ ký / kiểu trả về / quyền.
-- ============================================================================

create or replace function public._bdm_cau_giai(p_dang_cu text[])
 returns table(ma_cau text, goc text, la_goc boolean, ma_dang_cu text, ma_cum_cu text, dang_bai_id text, nguon text)
 language plpgsql
 stable
as $function$
begin
  -- EXECUTE … USING: lập kế hoạch theo ĐÚNG mảng dạng mỗi lần gọi (kế hoạch chung của hàm SQL ước sai ⇒ ~46k block / lần)
  return query execute $q$
  with q as materialized (
    select c.ma_cau, coalesce(c.parent_ma_cau, c.ma_cau) as goc, c.parent_ma_cau is null as la_goc, c.dang_chinh, c.ma_cum
      from dai_cau_hoi c
     where c.xoa_at is null and c.loai_cau <> 'dung_sai' and c.dang_chinh = any ($1)
  ),
  par as materialized (  -- cụm của câu GỐC — chỉ cho bản sao thiếu cụm, tra theo khoá chính (không quét cả kho)
    select g.ma_cau, g.ma_cum
      from dai_cau_hoi g
     where g.ma_cau = any (array(select distinct q.goc from q where q.goc <> q.ma_cau and q.ma_cum is null))
  ),
  mot as (  -- dạng cũ gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài (trường hợp ①)
    select d.ma_dang_cu, min(d.dich_dang_bai) as db
      from dai_bdm_doi_ung d
     where d.ma_dang_cu = any ($1)
     group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_dang_bai) = 1
  )
  select q.ma_cau, q.goc, q.la_goc, q.dang_chinh, coalesce(q.ma_cum, g.ma_cum),
         coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db),
         case when gc.ma_cau is not null or gg.ma_cau is not null then 'gan_cau'
              when cu.ma_cum_cu is not null then 'gan_cum'
              when mot.db is not null then 'doi_ung' end
    from q
    left join par g on g.ma_cau = q.goc and q.goc <> q.ma_cau
    left join dai_bdm_gan_cau gc on gc.ma_cau = q.ma_cau
    left join dai_bdm_gan_cau gg on gg.ma_cau = q.goc and q.goc <> q.ma_cau
    left join dai_bdm_doi_ung_cum cu on cu.ma_cum_cu = coalesce(q.ma_cum, g.ma_cum)
    left join mot on mot.ma_dang_cu = q.dang_chinh
  $q$ using p_dang_cu;
end
$function$;
