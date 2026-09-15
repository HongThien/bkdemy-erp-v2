-- ============================================================================
-- fn_ca_test_gan_de — GÁN ĐỀ NGUYÊN TỬ cho ca test (xoá kq + câu cũ, ghi tai_lieu_id, chèn câu mới trong
-- CÙNG transaction, có advisory lock theo ca_test_id).
-- ----------------------------------------------------------------------------
-- VÌ SAO (14/09): 2 ca bị GẤP ĐÔI câu (34 → 68, 39 → 78) — client `ganDeCaTest` làm 3 bước rời (delete kq,
--   delete cau, insert) không khoá; app dev bật React StrictMode nên effect "tự gán đề đang dùng" ở card Điểm
--   danh chạy 2 lần cách 60ms, cả hai đều thấy "chưa có câu" rồi cùng chèn. Ca Bảo Châu đã bị chấm trên danh
--   sách 68 dòng ⇒ kết quả lệch ghép, phải chấm lại. Gán đề giờ đi qua RPC: `pg_advisory_xact_lock` theo ca ⇒
--   lần gọi thứ hai chờ lần đầu commit rồi mới xoá/chèn lại ⇒ luôn đúng 1 bộ câu.
-- Client vẫn build rows (registry môn→bảng + hàng HÌNH ở TS), DB chỉ nhận jsonb và ghi nguyên tử.
-- UNIQUE (ca_test_id, thu_tu) — lưới an toàn cuối — áp ở migration SAU khi dọn 2 ca trùng (CEO gật xoá).
-- MẤT GÌ (Luật xoá): không. Chỉ create function + grant.
-- ============================================================================
create or replace function public.fn_ca_test_gan_de(p_ca_test_id uuid, p_tai_lieu_id uuid, p_rows jsonb)
returns integer language plpgsql as $$
declare
  v_n integer;
begin
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) = 0 then
    raise exception 'Tài liệu chưa có câu nào.';
  end if;
  -- Khoá theo ca tới hết transaction: 2 lần gán song song ⇒ tuần tự, lần sau thay lần trước, không chồng.
  perform pg_advisory_xact_lock(hashtext(p_ca_test_id::text));
  delete from public.ca_test_cau_kq where ca_test_cau_id in (select id from public.ca_test_cau where ca_test_id = p_ca_test_id);
  delete from public.ca_test_cau where ca_test_id = p_ca_test_id;
  update public.ca_test set tai_lieu_id = p_tai_lieu_id where id = p_ca_test_id;
  insert into public.ca_test_cau (ca_test_id, thu_tu, ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai,
                                  anh_de, anh_dap_an, ma_dang, diem_toi_da, nhanh, muc_do, ten_chuyen_de)
  select p_ca_test_id, r.thu_tu, r.ma_cau, r.loai_cau, r.noi_dung, r.lua_chon, r.menh_de, r.dap_an, r.loi_giai,
         r.anh_de, r.anh_dap_an, r.ma_dang, coalesce(r.diem_toi_da, 1), r.nhanh, r.muc_do, r.ten_chuyen_de
  from jsonb_to_recordset(p_rows) as r(
    thu_tu integer, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text,
    anh_de text, anh_dap_an text, ma_dang text, diem_toi_da numeric, nhanh text, muc_do smallint, ten_chuyen_de text);
  get diagnostics v_n = row_count;
  return v_n;
end $$;
grant execute on function public.fn_ca_test_gan_de(uuid, uuid, jsonb) to authenticated;
