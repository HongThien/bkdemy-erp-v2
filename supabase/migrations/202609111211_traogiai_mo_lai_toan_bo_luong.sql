-- ============================================================================
-- 202609111211 — TRAO GIẢI: mở lại 1 giải = RESET toàn bộ luồng từ đó (CEO 11/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: bản 1719 chỉ cho mở giải chốt SAU CÙNG. Ca cắn: chốt Tiến bộ xong muốn đưa 1 em từ Tiến bộ lên Xuất sắc
--   → mở lại Xuất sắc bị chặn "phải mở lại Tiến bộ trước"; kể cả sau khi mở Tiến bộ, dòng giai_thuong Tiến bộ đã
--   chốt vẫn giữ HS đó → UNIQUE(hoc_sinh_id, thang, mon) chặn insert Xuất sắc.
-- CEO chọn: "mở lại 1 giải = reset toàn bộ luồng từ giải đó trở đi" — xoá dấu chốt + XÁC NHẬN của giải đó và
--   MỌI giải sau (Xuất sắc → Tiến bộ → Chăm chỉ). HS quay lại pool, tick lại từ đầu. Không cho mở lại giải nào
--   nếu tháng đã công bố (`cong_bo_at`).
--
-- MẤT GÌ (Luật xoá): xoá `giai_thuong_lop_giai` + `giai_thuong` (chưa công bố) của giai đoạn mở + các giai đoạn
--   SAU nó; xoá `giai_thuong_lop_thang` (dấu hoàn thành lớp). CEO tự tick lại. Không đụng giải đã công bố (chặn).
-- ============================================================================

create or replace function public.fn_traogiai_mo_lai_giai(p_ym text, p_lop uuid, p_loai text)
returns void language plpgsql as $$
declare v_thang date; v_thu_tu int; v_cac_loai text[];
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  v_thang := (p_ym || '-01')::date;
  -- Không có dấu chốt cho giải này ⇒ idempotent (client có thể spam)
  if not exists (select 1 from giai_thuong_lop_giai where lop_id = p_lop and thang = v_thang and loai_giai = p_loai) then return; end if;
  -- Chặn khi tháng đã công bố (không rollback được sau cong_bo_at)
  if exists (select 1 from giai_thuong g where g.lop_id = p_lop and g.thang = v_thang and g.cong_bo_at is not null) then
    raise exception 'Tháng này đã công bố kết quả — không mở lại được.';
  end if;
  -- Thứ tự cố định XS(1) < TB(2) < CC(3); lấy p_loai và mọi loai sau nó
  select o into v_thu_tu from unnest(array['xuat_sac', 'tien_bo', 'cham_chi']) with ordinality as t(l, o) where t.l = p_loai;
  if v_thu_tu is null then raise exception 'loai_giai không hợp lệ: %', p_loai; end if;
  select array_agg(l) into v_cac_loai from unnest(array['xuat_sac', 'tien_bo', 'cham_chi']) with ordinality as t(l, o) where o >= v_thu_tu;
  -- Xoá xác nhận (giai_thuong chưa công bố) + dấu chốt (giai_thuong_lop_giai) của p_loai và các giải sau
  delete from giai_thuong where lop_id = p_lop and thang = v_thang and loai_giai = any(v_cac_loai) and cong_bo_at is null;
  delete from giai_thuong_lop_giai where lop_id = p_lop and thang = v_thang and loai_giai = any(v_cac_loai);
  -- Lớp không còn "hoàn thành" (vì mất giải)
  delete from giai_thuong_lop_thang where lop_id = p_lop and thang = v_thang;
end $$;
grant execute on function public.fn_traogiai_mo_lai_giai(text, uuid, text) to authenticated;
