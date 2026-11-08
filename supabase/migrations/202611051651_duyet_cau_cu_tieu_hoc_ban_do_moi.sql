-- ============================================================================
-- 202611051651 — duyet_cau_cu_tieu_hoc_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 "Bản đồ các khối tiểu học m phải tự duyệt các câu từ bản đồ cũ sang chứ. sao lại bật là chưa duyệt".
--   Khi chuyển khối 3 · 4 · 4T · 5 · 5T sang bản đồ mới (mig 202610262053 / 202610281827 / 202611010017 / 202611031857) chỉ đổi
--   cờ khối + dựng đối ứng/gán; cờ da_duyet của câu GIỮ NGUYÊN. Bản đồ cũ cho dùng câu cũ chưa duyệt qua luật "câu cũ tạm dùng"
--   (_kho_cau_chuan: tạo trước _kho_ngay_bat, không nghi, không claude_code) ⇒ màn bản đồ mới (fn_bdm_kho_cau, lọc theo da_duyet)
--   bật cả loạt "chưa duyệt" — đo 05/11: 3 · 63 / 4 · 374 / 4T · 62 / 5 · 395 / 5T · 288 câu có dạng thật (không phải dạng chờ).
-- LÀM: bật da_duyet (duyet_nguon 'may' — duyệt theo luật, không ai bấm) cho câu của bản đồ cũ (dang_chinh là dạng thật của khối
--   tiểu học, KHÔNG phải dạng chờ …000000) mà:
--     · máy KHÔNG nghi đáp số (kiem_may is distinct from 'nghi') — câu nghi để người xem (§1.5 thà bỏ trống còn hơn đánh sai), và
--     · hoặc đã thuộc kho chuẩn (bản đồ cũ đang dùng), hoặc có lời giải (> 20 kí tự). 5T: 270 câu bước 2 sách đã khớp bộ kiểm đáp số.
--   Đo trước khi viết: duyệt 3 · 55 / 4 · 370 / 4T · 7 / 5 · 378 / 5T · 280 = 1090. Giữ lại: 90 câu nghi + 2 câu khối 4 thiếu cả
--   đáp án lẫn lời giải. Câu dạng chờ (đề thi mới nhập, sách chưa phân dạng) KHÔNG đụng — đó là câu mới, không phải câu bản đồ cũ.
-- MẤT GÌ (Luật xoá): Không xoá gì. Chỉ UPDATE da_duyet false → true (trigger _kho_cau_duyet_nguon ghi duyet_at = now()).
--   Quay lại: update … set da_duyet = false where duyet_nguon = 'may' and duyet_at = <thời điểm áp> and ma_cau like 'T1%'.
-- ============================================================================
do $$
declare n int;
begin
  update dai_cau_hoi c
     set da_duyet = true, duyet_nguon = 'may'
    from dai_ban_do b
   where b.ma_dang = c.dang_chinh
     and b.khoi in ('3', '4', '5', '4T', '5T')
     and c.dang_chinh not like '%000000'
     and c.xoa_at is null
     and not c.da_duyet
     and c.kiem_may is distinct from 'nghi'
     and (c.kho_chuan or coalesce(length(trim(c.loi_giai)), 0) > 20);
  get diagnostics n = row_count;
  -- đo trước 1090; cho lệch nhẹ nếu phiên khác vừa duyệt/thêm vài câu, lệch lớn ⇒ dừng cả lượt
  if n < 1000 or n > 1150 then raise exception 'Duyệt câu cũ tiểu học bất thường: % dòng (đo trước 1090)', n; end if;
  raise notice 'Đã duyệt % câu bản đồ cũ khối 3/4/4T/5/5T', n;
end $$;
