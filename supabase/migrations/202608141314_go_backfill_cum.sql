-- ============================================================================
-- 202608141314 — GỠ BACKFILL CỤM (đè lên 202608131918_cum_bai.sql §6)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 14/08, gật rõ ràng): **CỤM LÀ THỦ CÔNG** — người tạo cụm, đặt tên, rồi mới gán bài vào.
--   Migration trước tự backfill 1.279 cụm (Đại) + 10 (KHTN) từ các chuỗi gốc-clone ⇒ hệ tự khẳng định
--   "đây là một cụm" thay cho người. Sai nguyên tắc.
--
-- VÀ NÓ THỪA: lý do ban đầu backfill là giữ hành vi mã đề. Nhưng khoá tiêu thụ đã là
--   `ma_cum ?? parent_ma_cau ?? ma_cau` — **tầng `parent_ma_cau` ở giữa TỰ giữ nguyên hành vi cũ**.
--   Từ lúc thêm tầng đó, backfill không còn tác dụng gì ngoài việc đẻ cụm không tên không ai xin.
--   (Chính spec-cum-bai.md §2 cấm bịa cụm cho câu lẻ — rồi backfill lại bịa cho chuỗi clone. Mâu thuẫn.)
--
-- MẤT GÌ (đã liệt kê & CEO gật):
--   · 1.279 dòng `dai_cum_bai` + 10 dòng `khtn_cum_bai` — TOÀN BỘ do backfill sinh.
--     Đã kiểm trước khi xoá: 0 dòng có tên · 0 dòng được gom thêm câu ngoài chuỗi clone gốc ·
--     0 cạnh tiền đề. Không có một chút công người nào trong đó.
--   · `ma_cum` của ~10.642 câu Đại + 33 câu KHTN → NULL (về tab "Chưa phân cụm").
-- KHÔNG MẤT: không câu nào, không clone nào, không quan hệ gốc-clone nào — `parent_ma_cau`/`nguon`
--   KHÔNG bị đụng. Bảng cụm, cột `ma_cum`, 4 bảng tiền đề, 8 hàm bao đóng GIỮ NGUYÊN, chỉ rỗng dữ liệu.
-- HÀNH VI: mã đề + tài liệu không đổi một ly (khoá rơi xuống `parent_ma_cau`).
--
-- ⚠ CHỈ XOÁ CỤM DO MÁY SINH, không xoá của người: điều kiện `ten is null` VÀ mọi câu trong cụm cùng
--   MỘT khoá cũ `coalesce(parent_ma_cau, ma_cau)` (= đúng dấu vân tay của backfill). Cụm người tạo
--   luôn có tên, hoặc gom bài từ nhiều chuỗi khác nhau ⇒ không khớp ⇒ sống sót. Chạy lại vô hại.
-- ============================================================================

do $$
declare
  n_dai int; n_khtn int; n_cau_dai int; n_cau_khtn int; n_giu int;
begin
  -- Chụp số trước khi xoá để in ra (và để soi lại trong log nếu sau này cần đối chiếu).
  select count(*) into n_cau_dai  from dai_cau_hoi  where ma_cum is not null;
  select count(*) into n_cau_khtn from khtn_cau_hoi where ma_cum is not null;

  -- ĐẠI — xoá cụm mang đúng vân tay backfill. FK `on delete set null` tự đưa câu về "chưa phân cụm".
  with may_sinh as (
    select c.ma_cum from dai_cum_bai c
     where c.ten is null
       and (select count(distinct coalesce(q.parent_ma_cau, q.ma_cau))
              from dai_cau_hoi q where q.ma_cum = c.ma_cum) <= 1
  )
  delete from dai_cum_bai d using may_sinh m where d.ma_cum = m.ma_cum;
  get diagnostics n_dai = row_count;

  -- KHTN — y hệt.
  with may_sinh as (
    select c.ma_cum from khtn_cum_bai c
     where c.ten is null
       and (select count(distinct coalesce(q.parent_ma_cau, q.ma_cau))
              from khtn_cau_hoi q where q.ma_cum = c.ma_cum) <= 1
  )
  delete from khtn_cum_bai d using may_sinh m where d.ma_cum = m.ma_cum;
  get diagnostics n_khtn = row_count;

  select (select count(*) from dai_cum_bai) + (select count(*) from khtn_cum_bai) into n_giu;
  raise notice 'Gỡ backfill: xoá % cụm Đại + % cụm KHTN. Câu về "chưa phân cụm": % Đại + % KHTN. Cụm còn giữ lại (của người): %.',
    n_dai, n_khtn, n_cau_dai, n_cau_khtn, n_giu;
end $$;

-- ── KIỂM: không câu nào rụng, không câu nào trỏ vào cụm đã xoá ───────────────
do $$
declare r record;
begin
  for r in
    select 'dai' nhanh,
           (select count(*) from dai_cau_hoi where xoa_at is null) tong,
           (select count(*) from dai_cau_hoi q where q.ma_cum is not null
              and not exists (select 1 from dai_cum_bai c where c.ma_cum = q.ma_cum)) mo_coi
    union all
    select 'khtn',
           (select count(*) from khtn_cau_hoi where xoa_at is null),
           (select count(*) from khtn_cau_hoi q where q.ma_cum is not null
              and not exists (select 1 from khtn_cum_bai c where c.ma_cum = q.ma_cum))
  loop
    if r.mo_coi > 0 then
      raise exception 'LỆCH (%): % câu trỏ vào cụm không còn tồn tại. Rollback.', r.nhanh, r.mo_coi;
    end if;
    raise notice '% — % câu còn sống, 0 câu mồ côi cụm ✓', r.nhanh, r.tong;
  end loop;
end $$;
