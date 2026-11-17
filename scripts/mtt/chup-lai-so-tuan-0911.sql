-- ============================================================================
-- CHỤP LẠI SỔ KẾT QUẢ MỤC TIÊU TUẦN — tuần 09/11 → 15/11/2026 (Thùy gật 17/11: "Làm đi")
-- Chạy ở Supabase SQL Editor, MỘT LẦN, từng bước. Không phải migration (việc dữ liệu một lần).
--
-- VÌ SAO: sổ tuần đó (mtt_chot, máy chụp 00:00 16/11) mang lỗi quy câu → nhóm (ô đo là DẠNG bài NDB bị coi là NHÓM ⇒ Phần 1 sai nhóm,
--   % "chưa đo", tên hiện mã). Lỗi đã sửa ở mig 202611161844. Sổ bất biến (trigger mtt_chot_bat_bien_trg) ⇒ muốn số đúng phải xoá dòng sổ
--   tuần đó rồi để bộ điều phối chụp lại (_mtt_lam_moi bước (a): tính lại TẠI MỐC 00:00 16/11 bằng hàm đang chạy).
-- MẤT GÌ (Luật xoá): MỌI dòng mtt_chot có tuan = 2026-11-09 (sổ kết quả tuần 09–15/11, mọi HS × môn). Không đụng tuần khác, không đụng bảng khác.
-- SAU KHI XOÁ: lượt điều phối kế (≤ 5 phút, mỗi lượt ≤ 20 giây cho việc này) chụp lại — CHỈ cho tờ ĐÃ CÔNG BỐ (luật 16/11). Em của lớp
--   chưa công bố tuần 09/11 sẽ KHÔNG còn dòng sổ tuần đó (đúng luật mới: chưa công bố thì không vào sổ). Bước 1 cho biết bao nhiêu em như vậy.
--   Bản chụp lại dùng luật ĐANG CHẠY (17/11: Phần 1 = buổi trong tuần), không phải luật lúc 16/11.
-- ============================================================================

-- ── BƯỚC 1 — XEM TRƯỚC (chỉ đọc). Dán kết quả cho Claude. ──
select
  (select count(*) from mtt_chot     where tuan = '2026-11-09')                                          as so_dong_so_se_xoa,
  (select count(*) from mtt_luu      where tuan = '2026-11-09')                                          as so_to_dem,
  (select count(*) from mtt_luu      where tuan = '2026-11-09' and coalesce((payload->>'chot')::boolean, false)) as so_to_cong_bo_se_chup_lai,
  (select count(*) from mtt_lop_chot where tuan = '2026-11-09')                                          as so_lop_da_cong_bo;

-- ── BƯỚC 2 — XOÁ (chỉ chạy khi Claude/Thùy đã xem Bước 1). Một khối, hỏng ở đâu là huỷ cả khối. ──
do $$
declare
  v_so   int;
  v_chup int;
  v_xoa  int;
begin
  select count(*) into v_so   from mtt_chot where tuan = '2026-11-09';
  select count(*) into v_chup from mtt_luu  where tuan = '2026-11-09' and coalesce((payload->>'chot')::boolean, false);
  if v_so = 0 then raise exception 'Sổ tuần 09/11 không còn dòng nào — không có gì để xoá.'; end if;
  if v_chup = 0 then
    raise exception 'Không có tờ ĐÃ CÔNG BỐ nào của tuần 09/11 ⇒ xoá xong máy sẽ KHÔNG chụp lại được dòng nào. DỪNG.';
  end if;
  execute 'alter table public.mtt_chot disable trigger mtt_chot_bat_bien_trg';
  delete from public.mtt_chot where tuan = '2026-11-09';
  get diagnostics v_xoa = row_count;
  execute 'alter table public.mtt_chot enable trigger mtt_chot_bat_bien_trg';
  if v_xoa <> v_so then raise exception 'Xoá % dòng, khác % dòng đã đếm — huỷ.', v_xoa, v_so; end if;
  raise notice 'Đã xoá % dòng sổ tuần 09/11. Máy sẽ chụp lại % tờ đã công bố ở lượt điều phối kế.', v_xoa, v_chup;
end $$;

-- ── BƯỚC 3 — KIỂM (chạy sau ~10 phút). ──
-- trigger chặn xoá phải bật lại ('O' = bật) · số dòng sổ tuần 09/11 = số tờ đã công bố ở Bước 1 · chot_at là giờ mới
select
  (select tgenabled from pg_trigger where tgname = 'mtt_chot_bat_bien_trg')                              as trigger_bat,
  (select count(*) from mtt_chot where tuan = '2026-11-09')                                              as so_dong_so_moi,
  (select max(chot_at) from mtt_chot where tuan = '2026-11-09')                                          as chup_luc;
