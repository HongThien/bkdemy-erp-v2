-- ============================================================================
-- 202611161738_mo_lai_phase_sua_ghi_chu
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202611161734 để lại trong thân fn_mo_lai_phase một dòng ghi chú có chữ "coalesce(mon, 'Toán')" ⇒ cổng
--   db_ham_mon_mac_dinh (dò theo chữ trong thân hàm) đếm nhầm hàm này. Chỉ sửa chữ ghi chú, không đổi câu lệnh nào.
-- MẤT GÌ: không mất gì.
-- ============================================================================
do $$
declare v_def text; v_src text;
  c1 constant text := '-- 16/11: bỏ coalesce(mon, ''Toán'') — lịch sử Elo luôn có môn';
begin
  select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p where p.oid = 'public.fn_mo_lai_phase(uuid,text)'::regprocedure;
  if md5(v_src) <> 'a214883816980e30ce38a6132489135a' then raise exception 'fn_mo_lai_phase đã khác bản lúc viết migration (16/11).'; end if;
  if (length(v_def) - length(replace(v_def, c1, ''))) / length(c1) <> 1 then raise exception 'fn_mo_lai_phase: mốc thay không khớp đúng một lần.'; end if;
  execute replace(v_def, c1, '-- 16/11: môn lấy thẳng từ lịch sử Elo (luôn có môn, không tự điền)');
end $$;
