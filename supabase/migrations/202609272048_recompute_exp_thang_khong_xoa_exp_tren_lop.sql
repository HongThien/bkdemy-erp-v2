-- ============================================================================
-- 202609272048 — recompute_exp_thang_khong_xoa_exp_tren_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_recompute_exp_thang (chạy mỗi lần đóng ET/BTVN) làm "xoá rồi ghi lại" EXP (lớp × tháng) bằng
--   `delete from gami_exp_ledger where ref_buoi_hoc_id in (select id from _ret_buoi)` — KHÔNG lọc nguồn.
--   Nguồn mới 'exp_tren_lop' (game trong buổi, mig 202609272045) cũng gắn ref_buoi_hoc_id ⇒ đóng ET là XOÁ SẠCH
--   EXP game đã phát, và recompute không ghi lại (nó không sinh nguồn này). Bắt được khi rà trước lúc mở cho GV
--   (27/09) — lúc đó chưa có dòng exp_tren_lop nào ⇒ chưa mất gì.
--   Sửa: hàm recompute chỉ được xoá những gì nó tự sinh ⇒ thêm `and source <> 'exp_tren_lop'`. Chèn vào định nghĩa
--   ĐANG CHẠY (không chép đè thân hàm — phiên khác có thể đang sửa); khẳng định đúng 1 chỗ khớp.
--
-- MẤT GÌ (Luật xoá): KHÔNG. Thu HẸP một lệnh delete sẵn có (xoá ít đi), không xoá thêm gì.
-- ============================================================================
do $$
declare d text; n int;
  cu  constant text := 'delete from gami_exp_ledger where ref_buoi_hoc_id in (select id from _ret_buoi);';
  moi constant text := 'delete from gami_exp_ledger where ref_buoi_hoc_id in (select id from _ret_buoi) and source <> ''exp_tren_lop''; -- mig 202609272048: EXP game trong buổi không thuộc recompute';
begin
  select pg_get_functiondef(p.oid) into d from pg_proc p join pg_namespace s on s.oid = p.pronamespace
    where s.nspname = 'public' and p.proname = 'fn_recompute_exp_thang';
  if d is null then raise exception 'Không thấy fn_recompute_exp_thang'; end if;
  if position('exp_tren_lop' in d) > 0 then return; end if; -- đã vá (chạy lại vô hại)
  n := (length(d) - length(replace(d, cu, ''))) / length(cu);
  if n <> 1 then raise exception 'fn_recompute_exp_thang: mong đúng 1 lệnh delete theo _ret_buoi, thấy % — sửa tay.', n; end if;
  execute replace(d, cu, moi);
end $$;
