-- ============================================================================
-- 202611161613 — ta_cong_si_so_ca_bo_tro
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 16/11: "Khi chấm công các ca bổ trợ, hệ thống cần hiện thêm số lượng học sinh trong ca để người chấm công rõ hơn
--   vì sẽ có những ca HS có hẹn mà không đến."
--   fn_ta_cong_si_so(từ, đến): mỗi việc BỔ TRỢ (tinh_vao bo_tro · bo_tro_dac_biet) có nối được tới ca trực / buổi bổ trợ ⇒
--   số em CÓ HẸN · CÓ MẶT · VẮNG · CHƯA ĐIỂM DANH (đếm từ buoi_hoc_hs — cùng nguồn màn ca bổ trợ fn_ca_bo_tro_ngay).
--   Nối: việc.ca_bo_tro_id ⇒ mọi buổi của ca đó · việc.buoi_hoc_id ⇒ ca của buổi (nếu có) hoặc chính buổi đó ·
--   bổ trợ định kì chưa gắn ca ⇒ ca DUY NHẤT TA trực hôm đó (nhiều ca ⇒ không đoán, không có dòng — §1.5, giống _ta_cong_viec_o).
--   Việc không nối được (chỉ ghi tên HS bằng chữ) ⇒ không có dòng, màn không hiện số. Nối được mà 0 em ⇒ dòng 0.
--   Phạm vi xem như fn_ta_cong_lich_su (_ta_cong_xem_duoc). Màn chỉ ghép theo id để HIỂN THỊ.
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 hàm đọc.
-- ============================================================================

create or replace function public.fn_ta_cong_si_so(p_tu date, p_den date default null)
returns table (viec_id uuid, hen integer, co_mat integer, vang integer, chua_dd integer, ten_vang text)
language plpgsql stable security definer set search_path = public as $$
declare v_den date := coalesce(p_den, p_tu);
begin
  if not public._ta_cong_xem_duoc() then raise exception 'Không có quyền xem sĩ số ca bổ trợ'; end if;
  return query
  with v as (
    select cv.id, cv.ngay, cv.nhan_su_id, cv.loai_viec, cv.buoi_hoc_id,
           coalesce(cv.ca_bo_tro_id,
                    (select b.ca_bo_tro_id from buoi_hoc b where b.id = cv.buoi_hoc_id),
                    case when cv.loai_viec = 'bo_tro_dinh_ki' and cv.buoi_hoc_id is null then
                      (select min(c.id::text)::uuid from ca_bo_tro c
                        where c.ngay = cv.ngay and c.trang_thai = 'mo' and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)
                       having count(*) = 1) end) as ca_id
      from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec
     where cv.ngay between p_tu and v_den and lv.tinh_vao in ('bo_tro', 'bo_tro_dac_biet')
  ), hs as (   -- mỗi (việc × em): điểm danh của em trong ca / buổi đó
    select v.id as viec_id, hh.hoc_sinh_id,
           coalesce(bool_or(hh.diem_danh = 'co_mat'), false) as co, coalesce(bool_and(hh.diem_danh in ('vang', 'vang_phep')), false) as vg
      from v
      join buoi_hoc b on (v.ca_id is not null and b.ca_bo_tro_id = v.ca_id) or (v.ca_id is null and b.id = v.buoi_hoc_id)
      join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
     where b.trang_thai <> 'huy' and (v.ca_id is null or hh.don_vi is not null)
     group by v.id, hh.hoc_sinh_id
  )
  select v.id, coalesce(g.hen, 0), coalesce(g.co_mat, 0), coalesce(g.vang, 0), coalesce(g.chua, 0), g.ten_vang
    from v
    left join (select hs.viec_id, count(*)::int as hen, (count(*) filter (where hs.co))::int as co_mat,
                      (count(*) filter (where hs.vg and not hs.co))::int as vang,
                      (count(*) filter (where not hs.co and not coalesce(hs.vg, false)))::int as chua,
                      string_agg(h.ho_ten, ', ' order by h.ho_ten) filter (where hs.vg and not hs.co) as ten_vang
                 from hs join hoc_sinh h on h.id = hs.hoc_sinh_id group by hs.viec_id) g on g.viec_id = v.id
   where v.ca_id is not null or v.buoi_hoc_id is not null;   -- nối được ca/buổi: ca 0 em hẹn cũng hiện 0
end $$;
revoke all on function public.fn_ta_cong_si_so(date, date) from public, anon;
grant execute on function public.fn_ta_cong_si_so(date, date) to authenticated;
