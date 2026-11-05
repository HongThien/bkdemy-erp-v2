-- ============================================================================
-- 202611051751 — Nông trại: SẢN LƯỢNG mọi cây ×0,5 (nt_cay.goc) + trả trần xu ngày về 4
-- Thùy 05/11: "Tỉ lệ [100 EXP = 1 xu] fix rồi. Chỉ có thay đổi số lượng EXP thu được của cây thôi."
-- ----------------------------------------------------------------------------
-- VÌ SAO: kinh tế game chỉnh 30/09 cho đích 30–45 xu/tháng; 12/10 trần tài khoản hạ còn 20 xu/tháng nhưng vòi EXP KHÔNG chỉnh lại.
--   Đo bản lưu 05/11: 2 em chăm nhất ~240 EXP/ngày chơi ⇒ đủ 20 xu sau ~8–9 ngày. Đích Thùy: 15–20 ngày.
--   goc ×0,5 ⇒ ~120 EXP/ngày ⇒ ~17 ngày. Mọi nguồn từ cây (bán thẳng, bánh chế từ nông sản, thức ăn gà bò) giảm cùng tỉ lệ, giá bán giữ nguyên.
-- BẢN SAO: game (repo bk-nong-trai, js/data.js RUONG[].goc) tự tính sản lượng ô của mình; server tính lại ở _nt_o_tt từ nt_cay.goc
--   (trộm/giúp bạn thật). Hai bên phải cùng số ⇒ commit game cùng ngày, chép vào public/games/nong-trai/ bằng scripts/dong-bo-nong-trai.mjs.
--   goc thành số lẻ (3,5 · 2,5 · 5,5) ⇒ cột integer → numeric. _nt_o_tt đã làm toán double precision + làm tròn ngẫu nhiên phần lẻ (_nt_bam) — không sửa hàm.
-- TRẦN NGÀY: mig 202611051621 hạ 4 → 1 là chặn ngọn (Thùy: "liên quan gì đến trần") ⇒ trả về 4 (Thùy chốt 23/10, chốt an toàn chống lỗi game).
-- MẤT GÌ (Luật xoá): không xoá gì. Đổi kiểu 1 cột + 13 số + 1 ô cấu hình. Hoàn tác: goc = goc * 2.
-- ============================================================================
alter table public.nt_cay alter column goc type numeric using goc::numeric;
do $$
declare n int;
begin
  update public.nt_cay set goc = goc / 2;
  get diagnostics n = row_count;
  if n <> 13 then raise exception 'nt_cay: % ≠ 13 dòng', n; end if;
end $$;
update public.nt_cau_hinh set xu_toi_da_ngay = 4, updated_at = now() where id = 1;
