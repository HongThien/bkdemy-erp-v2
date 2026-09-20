-- ============================================================================
-- 202609202123 — et_resolve_bien_the_tu_rai
-- ----------------------------------------------------------------------------
-- BUG THẬT (CEO 20/09): "ET có 3 mã đề. Phát hành online cho học sinh làm
--   nhưng hệ thống chỉ nhận mã 1, không nhận mã còn lại."
--
-- NGUYÊN NHÂN (đã verify DB live, `tai_lieu.cau_hinh`): `resolve_bien_the`
--   (mig 202608181719) đọc mã đề của HS từ `cau_hinh.hsMaDe[hoc_sinh_id]` —
--   map này KHÔNG tự sinh, chỉ được điền khi GV chủ động vào panel "👥 Gán mã
--   đề theo HS" ở ETScreen bấm "🎲 Rải tự động" rồi bấm lại "💾 Lưu ET" lần 2.
--   Panel đó CHỈ hiện khi roster đã điểm danh "có mặt" — GV soạn/lưu ET TRƯỚC
--   giờ học (rất phổ biến) thì panel rỗng, không gán được lúc đó, dễ quên quay
--   lại. Kiểm 10 ET gần nhất có `co_nhieu_ma_de=true`: ít nhất 1 ET (11A1
--   12/09) có `hsMaDe = null` — xác nhận đúng giả thuyết, không phải suy đoán.
--   Hệ quả: `coalesce(hsMaDe[hs], 1)` → MỌI HS rơi về mã 1, dù `bai_test_cau`
--   đã snapshot đủ câu mã 2/3 — đúng cái mã đề sinh ra để CHỐNG (xem comment
--   gốc của mig 202608181719) lại bị vô hiệu hoá bởi 1 bước thao tác tay bị bỏ sót.
--
-- FIX — pure-derive, bỏ phụ thuộc bước tay dễ quên (đúng tinh thần CLAUDE.md
--   §4 "GV không tích/làm gì thêm, hệ tự suy"): `resolve_bien_the` vẫn ưu
--   tiên TUYỆT ĐỐI `hsMaDe` nếu GV đã gán tay (giữ quyền chủ động xếp chỗ
--   ngồi/né HS cạnh nhau trùng đề) — CHỈ khi KHÔNG có gán tay mới rơi vào
--   nhánh mới: rải ĐỀU theo hash ổn định của hoc_sinh_id, modulo ĐÚNG số mã đề
--   THẬT SỰ đã snapshot cho bai_test đó (đếm distinct bien_the trong
--   bai_test_cau — KHÔNG hardcode 3, ET chỉ có 1 mã đề vẫn ra đúng 1 như cũ).
--   Hash ổn định (không random mỗi lần gọi) — cùng 1 HS luôn ra cùng kết quả
--   trước khi bai_lam chốt thật (bai_lam.bien_the mới là giá trị ĐÔNG CỨNG).
--
-- MẤT GÌ: không — CREATE OR REPLACE 1 hàm, không đổi bảng/cột. ET chỉ có 1 mã
--   đề (đa số) hành vi giữ nguyên y hệt (luôn ra 1).
-- ============================================================================

create or replace function public.resolve_bien_the(p_bai_test uuid)
returns smallint
language sql stable security definer set search_path = public as $$
  select coalesce(
    -- Ưu tiên 1: GV đã gán tay trong hsMaDe.
    (tl.cau_hinh->'hsMaDe'->> (public.my_hoc_sinh_id())::text)::smallint,
    -- Ưu tiên 2: chưa gán tay → rải đều theo hash ổn định, modulo ĐÚNG số mã đề
    -- thật đã snapshot (1 nếu ET không có biến thể — hành vi y hệt trước đây).
    (1 + abs(hashtext(public.my_hoc_sinh_id()::text || ':' || p_bai_test::text))
       % greatest(1, (select count(distinct bc.bien_the) from bai_test_cau bc where bc.bai_test_id = p_bai_test)))::smallint,
    1
  )
  from bai_test bt join tai_lieu tl on tl.id = bt.nguon_tai_lieu_id
  where bt.id = p_bai_test
$$;
grant execute on function public.resolve_bien_the(uuid) to authenticated;
