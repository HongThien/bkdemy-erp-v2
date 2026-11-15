-- ============================================================================
-- 202611152202 — recompute_exp_thang_analyze_bang_tam
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   fn_recompute_exp_thang(lớp, tháng) chạy mỗi lần TA đóng ET / đóng BTVN / mở lại phase (fn_dong_phase, fn_dong_btvn, fn_mo_lai_phase, cron BTVN app).
--   Bảng tạm `_ret_buoi` (các buổi của lớp trong tháng — 4–12 dòng) KHÔNG có thống kê ⇒ Postgres coi bảng mới là 10 trang ≈ 1.700 dòng
--   ⇒ ở bước tính độ đúng BTVN (gami_grades ⋈ gami_session_problems ⋈ _ret_buoi) chọn Hash Join + QUÉT CẢ gami_grades (205 nghìn dòng, 35 MB)
--   và cả gami_session_problems, mỗi lượt đóng. Đo 15/11 22:01 (6 ca lớp × tháng, thời gian trong DB): riêng bước đó 55–78 ms / tổng ~100 ms khi dữ liệu
--   đã nằm trong bộ nhớ; lượt nguội 1.718 ms (đọc 35 MB từ đĩa) — khớp số cộng dồn của người dùng thật (tb ~0,8 s, max 7,4 s).
--   Thêm `analyze _ret_buoi` (0,3–0,4 ms) ⇒ planner biết bảng có 4–9 dòng ⇒ Nested Loop theo index: câu nối 70 ms → 0,6–3 ms,
--   trang đọc 5.273 → 300–2.400, cả hàm ~100 ms → ~55–68 ms khi ấm; chi phí hết phụ thuộc cỡ gami_grades (gấp 10 HS thì bản cũ quét 350 MB mỗi lượt đóng).
--   Đây là ca K25 (spec-kien-truc.md): bảng tạm thiếu `analyze`. Công thức EXP không đổi một chữ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì. Chỉ chèn một câu `analyze` vào thân hàm (thay chuỗi khớp đúng một lần, khoá md5 thân hàm cũ).
-- ============================================================================
do $$
declare v_def text; v_src text;
  c1 constant text := 'select id into v_buoi_cuoi from _ret_buoi order by ngay desc limit 1;';
begin
  select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p where p.oid = 'public.fn_recompute_exp_thang(uuid,text)'::regprocedure;
  if md5(v_src) <> '34d4fcd62bce7a8b2b3e3fbdab05c2fd' then raise exception 'fn_recompute_exp_thang đã khác bản lúc viết migration (15/11) — đọc lại trước khi áp.'; end if;
  if (length(v_def) - length(replace(v_def, c1, ''))) / length(c1) <> 1 then raise exception 'fn_recompute_exp_thang: mốc thay không khớp đúng một lần.'; end if;
  v_def := replace(v_def, c1,
    E'analyze _ret_buoi;   -- 15/11 (K25): không có thống kê thì planner đoán ~1.700 dòng và quét cả gami_grades ở bước _ret_acc\n  ' || c1);
  execute v_def;
end $$;
