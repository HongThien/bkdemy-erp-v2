-- ============================================================================
-- ÂN XÁ GẬY — CEO 24/09/2026: "gậy từ trước 21/9 coi như không phạt, xoá toàn bộ
-- lịch sử duyệt gậy từ 21/9 về trước". Mốc = việc có hạn < 22/09/2026 00:00 (giờ VN).
--
-- Đo trước khi xoá (23/09 23:xx): gay_de_xuat hạn < 22/9 = 1.747 (1.140 chờ · 602 bỏ
-- qua · 5 đã đánh) · gay_ledger 2 dòng (Tạ Quang Tùng, đánh 17:46 21/9: 1 tự động cho
-- task 03/09 + 1 thủ công) · gay_log ~2.310 dòng vết của các bản ghi trên · gay_chot_thang
-- rỗng. Giữ lại: 44 chờ + 3 bỏ qua (hạn ≥ 22/9), 5 ledger từ 22/9.
--
-- Đi kèm ở client (cùng commit): GAY_MOC_LICH_SU 01/09 → 22/09 và quetGayTuDong bỏ qua
-- việc có hạn trước mốc — không thì lần mở tab Đề xuất kế tiếp máy đẻ lại y nguyên.
-- Mốc ân xá dashboard TA/GV/OPS (01/09, mig 202609070015) GIỮ NGUYÊN — CEO chốt tách riêng.
-- Hard delete theo yêu cầu CEO (đã liệt kê & gật rõ ràng). Thứ tự FK: de_xuat (ledger_id) → ledger.
-- ============================================================================
do $$
declare
  c_moc constant timestamptz := '2026-09-22 00:00:00+07';
  v_dx int; v_led int; v_log int;
  v_led_ids uuid[]; v_dx_ids uuid[];
begin
  select coalesce(array_agg(id), '{}') into v_dx_ids from gay_de_xuat where deadline_at < c_moc;
  select coalesce(array_agg(id), '{}') into v_led_ids from gay_ledger where created_at < c_moc;

  delete from gay_log where (bang = 'gay_de_xuat' and row_id = any(v_dx_ids)) or (bang = 'gay_ledger' and row_id = any(v_led_ids));
  get diagnostics v_log = row_count;
  delete from gay_de_xuat where id = any(v_dx_ids);
  get diagnostics v_dx = row_count;
  delete from gay_ledger where id = any(v_led_ids);
  get diagnostics v_led = row_count;

  raise notice 'Ân xá gậy trước 22/09: xoá % đề xuất, % ledger, % log', v_dx, v_led, v_log;
  -- chốt an toàn: con số phải khớp đo trước (1.747 / 2). Lệch ⇒ có ghi thêm giữa chừng, dừng để xem lại.
  if v_dx <> 1747 or v_led <> 2 then
    raise exception 'Số dòng xoá lệch đo trước (de_xuat=% ledger=%) — rollback, kiểm lại trước khi chạy.', v_dx, v_led;
  end if;
end $$;
