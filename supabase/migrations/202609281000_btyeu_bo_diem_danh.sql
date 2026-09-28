-- Thùy 28/09: (1) Bổ trợ yếu — "chạm 1 lần là điểm danh, chạm lần nữa là BỎ điểm danh" (app TA).
-- (2) 2 buổi TA điểm danh "có mặt" nhầm, HS không đi: Nguyễn Hải Nam 21/09 21:00 (TA Hoàng Thị Quỳnh Trang) · Lưu Nguyễn Tuệ Lâm 24/09 21:00
--     (TA Trần Thị Thảo Nguyên). Kiểm 28/09: cả 2 buổi 0 bài luyện, 0 câu trả lời, chưa đóng ca, không test/retest, không dạng nào đánh dấu dạy
--     ⇒ sửa thành VẮNG + HUỶ buổi (y hệt nút "Vắng · huỷ buổi" của TA) ⇒ case về Cần xếp kèm tag "không diễn ra"; ca trực 24/09 trả đơn vị.
--     Hải Nam có 1 dòng nhận xét nháp (buoi_danh_gia) — GIỮ, không xoá.

-- ── 1) Bỏ điểm danh (1 nguồn, kiểm ở DB) ────────────────────────────────────────────────────────────────────────────
-- Được bỏ khi em CHƯA làm gì trong ca: chưa trả lời câu nào, chưa đóng ca (chưa sinh test), chưa hoàn tất.
-- Bỏ "vắng" = mở lại buổi đã huỷ vì vắng — chỉ khi case chưa có buổi chờ học khác (tránh 2 buổi chờ).
create or replace function public.fn_btyeu_bo_diem_danh(p_bhh uuid) returns void
language plpgsql security definer set search_path = public as $$
declare r record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_cau integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select hh.id, hh.diem_danh, hh.bo_tro_yeu_id, b.id as buoi_id, b.loai, b.trang_thai, b.danh_gia_xong_at, b.nguoi_day_tg, b.ly_do_huy
    into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh;
  if r.id is null or r.loai <> 'bo_tro_yeu' then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if r.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if r.diem_danh is null then return; end if; -- chưa điểm danh: không có gì để bỏ
  if r.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất — không bỏ điểm danh được.'; end if;
  if exists (select 1 from bai_test t where t.buoi_hoc_id = r.buoi_id and t.loai = 'bo_tro_test') then
    raise exception 'Ca đã đóng (đã sinh test cuối ca) — không bỏ điểm danh được.'; end if;
  select count(*) into v_cau from bai_test t join bai_lam bl on bl.bai_test_id = t.id join bai_lam_cau k on k.bai_lam_id = bl.id
    where t.buoi_hoc_id = r.buoi_id and k.verdict is not null;
  if v_cau > 0 then raise exception 'Em đã làm % câu trong ca — không bỏ điểm danh được.', v_cau; end if;
  if r.diem_danh in ('vang', 'vang_phep') and r.trang_thai = 'huy' then
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_yeu_id = r.bo_tro_yeu_id and bb.id <> r.buoi_id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) then
      raise exception 'Em đã được xếp buổi khác — không mở lại buổi này được.'; end if;
    update buoi_hoc set trang_thai = 'mo', ly_do_huy = null, updated_at = now() where id = r.buoi_id;
  end if;
  update buoi_hoc_hs set diem_danh = null, btyeu_che_do = null where id = p_bhh;
end $$;
grant execute on function public.fn_btyeu_bo_diem_danh(uuid) to authenticated;

-- ── 2) Sửa 2 buổi điểm danh nhầm (where giữ đúng trạng thái đã kiểm ⇒ chạy lại không đè gì) ──────────────────────────
update public.buoi_hoc_hs set diem_danh = 'vang', btyeu_che_do = null
  where id in ('5b407bd0-7573-464c-b038-97b5290e2169', 'fa263f9f-ca91-46a2-aeff-0d3b3b861add') and diem_danh = 'co_mat';
update public.buoi_hoc set trang_thai = 'huy', ly_do_huy = 'Không diễn ra — HS không đến, TA điểm danh nhầm "có mặt" (sửa 28/09 theo Thùy)', updated_at = now()
  where id in ('8e19c2ad-19f9-4a94-a457-3faac5312729', '12212003-6149-47cd-97ec-c3a90af4b676') and trang_thai = 'mo' and danh_gia_xong_at is null;
