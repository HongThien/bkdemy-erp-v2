-- ============================================================================
-- 202610282052 — buoi_tu_dong_dong_et_btvn_trong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 28/10: "các buổi không có ET và BT trên hệ thống — sau 1 tiếng mà không có — thì task tự động đóng luôn, coi như
--   đã hoàn thành". Trước đây mỗi buổi thường đều sinh việc "Chấm ET" + "Chấm BTVN" cho TA (fn_viec_buoi_thuong) bất kể buổi
--   có ET/BTVN hay không; việc chỉ đóng khi có người bấm. Đo 28/10: 87 việc ET + 120 việc BTVN treo ở buổi KHÔNG có gì để
--   chấm (tháng 9–10, đủ Toán · Văn · Tiếng Anh). Treo ET còn CHẶN đóng ET các buổi sau (fn_dong_phase bắt đóng theo thứ tự
--   ngày vì Elo tính tuần tự) và đẻ đề xuất gậy "trễ" oan.
--
--   Luật (từng khâu riêng — buổi có ET mà không có BTVN thì chỉ việc BTVN tự đóng, và ngược lại):
--   • Buổi thường, không huỷ, không phải buổi MT (buổi MT có việc 'mt' riêng).
--   • "Có ET" = có ô chấm ET (gami_session_problems phase 'et') · hoặc ET online (bai_test loai 'et') · hoặc phiếu ET
--     (tai_lieu loai 'et') của lớp + ngày đó. "Có BTVN" = phiếu BTVN (tai_lieu 'btvn') · ô chấm BTVN · bài nộp BTVN (btvn_nop) ·
--     hoặc BTVN online (bai_test 'btvn') — cùng định nghĩa fn_dong_btvn đang dùng + bản online. (Giáo trình buổi = bài trên
--     lớp, KHÔNG phải ET/BTVN.)
--   • Mốc = giờ KẾT THÚC buổi + 1 tiếng (giờ VN). Qua mốc mà vẫn không có ⇒ đóng khâu đó với giờ đóng = CHÍNH mốc ấy (không
--     phải giờ job chạy) ⇒ mọi chỗ đọc "giờ đóng đầu" (_viec_dong_dau, fn_viec_tien_do, gậy, báo cáo trợ lý) thấy đóng ĐÚNG HẠN.
--   • Đóng y như đóng tay một khâu trống: ghi et_dong_at / btvn_dong_at rồi fn_buoi_recompute_hoan_tat. (fn_dong_phase với ET
--     không có ô chấm cũng chỉ làm đúng vậy — không Elo, không EXP; EXP tháng không đọc btvn_dong_at.)
--   • Lịch sử đóng/mở do trigger _trg_buoi_hoc_phase_log tự ghi, actor = null (= hệ thống).
--   • Đề xuất gậy vận hành ĐANG CHỜ của đúng khâu vừa tự đóng ⇒ máy tự rút ('bo_qua', ghi rõ lý do) — "coi như đã hoàn thành".
--   • Phiếu ET/BTVN được thêm SAU khi đã tự đóng ⇒ khâu vẫn đóng; người làm bấm "Mở lại" (fn_mo_lai_phase) như đóng nhầm thường.
--   Job chạy 15 phút/lần (lịch ở 202610282053, SQL Editor). File này chạy hàm 1 lần ngay khi áp để dọn tồn đọng tháng 9–10.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Đổi trạng thái: đề xuất gậy 'cho' của các khâu ET/BTVN tự đóng ⇒ 'bo_qua' (dòng vẫn còn, xem lại được).
-- ============================================================================

create or replace function public._buoi_tu_dong_khong_et_btvn()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  r record;
  v_et integer := 0; v_bt integer := 0; v_rut integer := 0; v_n integer;
  v_ly_do constant text := 'Máy tự rút (Thùy 28/10): buổi không có ET/BTVN trên hệ thống — việc tự đóng sau 1 tiếng, coi như hoàn thành';
begin
  for r in
    with b as (
      select bh.id, bh.lop_id, bh.ngay, bh.et_dong_at, bh.btvn_dong_at,
             ((bh.ngay::text || ' ' || bh.gio_ket_thuc::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '1 hour' as moc
      from buoi_hoc bh
      where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.gio_ket_thuc is not null
        and (bh.et_dong_at is null or bh.btvn_dong_at is null)
        and bh.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
        and not exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay)
    )
    select b.*,
      b.et_dong_at is null and not (
           exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'et')
        or exists (select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et')
        or exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'et')) as dong_et,
      b.btvn_dong_at is null and not (
           exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'btvn')
        or exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'btvn')
        or exists (select 1 from btvn_nop n where n.buoi_hoc_id = b.id)
        or exists (select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'btvn')) as dong_bt
    from b
    where b.moc <= now()
  loop
    if not (r.dong_et or r.dong_bt) then continue; end if;
    if r.dong_et then
      update buoi_hoc set et_dong_at = r.moc, updated_at = now() where id = r.id and et_dong_at is null;
      if found then
        v_et := v_et + 1;
        update gay_de_xuat set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null, ly_do_bo_qua = v_ly_do
        where trang_thai = 'cho' and nguon = 'vanhanh' and ref_key like 'vh:' || r.id::text || '|et|%';
        get diagnostics v_n = row_count; v_rut := v_rut + v_n;
      end if;
    end if;
    if r.dong_bt then
      update buoi_hoc set btvn_dong_at = r.moc, updated_at = now() where id = r.id and btvn_dong_at is null;
      if found then
        v_bt := v_bt + 1;
        update gay_de_xuat set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null, ly_do_bo_qua = v_ly_do
        where trang_thai = 'cho' and nguon = 'vanhanh' and ref_key like 'vh:' || r.id::text || '|btvn|%';
        get diagnostics v_n = row_count; v_rut := v_rut + v_n;
      end if;
    end if;
    perform public.fn_buoi_recompute_hoan_tat(r.id);
  end loop;
  return jsonb_build_object('et', v_et, 'btvn', v_bt, 'gay_rut', v_rut);
end $function$;

comment on function public._buoi_tu_dong_khong_et_btvn() is
  'Tự đóng việc Chấm ET / Chấm BTVN của buổi thường không có ET / BTVN trên hệ thống, 1 tiếng sau giờ kết thúc buổi (giờ đóng = mốc đó); rút đề xuất gậy đang chờ của khâu đó. pg_cron 15 phút/lần. Thùy 28/10, mig 202610282052.';
revoke execute on function public._buoi_tu_dong_khong_et_btvn() from public, anon, authenticated;
grant execute on function public._buoi_tu_dong_khong_et_btvn() to postgres;   -- pg_cron chạy job dưới quyền postgres

-- Dọn tồn đọng ngay khi áp (lịch 15 phút/lần lo các buổi về sau).
select public._buoi_tu_dong_khong_et_btvn();
