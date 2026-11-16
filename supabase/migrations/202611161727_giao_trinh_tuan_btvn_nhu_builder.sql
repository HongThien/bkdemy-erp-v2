-- ============================================================================
-- 202611161727 — giao_trinh_tuan_btvn_nhu_builder
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   fn_gtt_dat_khung (mig 202611161716) gọi fn_tl_bdm_dat_buoi với p_so_btvn MẶC ĐỊNH CỦA DB (_tong 4), còn builder truyền _tong 5
--   (tailieuBdm.ts datBuoi, Thùy 13/11) ⇒ chọn nhóm ở màn Giáo trình tuần ra BTVN 4 câu, ở builder ra 5 câu — hai cửa sổ hành xử khác nhau.
--   Truyền đúng giá trị builder truyền. (Hằng số đang nằm ở client — đưa mặc định xuống DB là việc riêng, không làm ở đây.)
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thay thân 1 hàm (giữ chữ ký).
-- ============================================================================

create or replace function fn_gtt_dat_khung(p_lop uuid, p_ngay date, p_chon jsonb, p_tai_lieu uuid default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l lop; v_buoi uuid; v_tl uuid; v_nhanh text; v_n int; v_tt int;
begin
  l := public._gtt_kiem_ca(p_lop, p_ngay);
  select g.buoi_id, p.tai_lieu_id into v_buoi, v_tl
    from gtt_ca g join tai_lieu_phan p on p.id = g.buoi_id where g.lop_id = p_lop and g.ngay = p_ngay;

  if v_buoi is null then
    if p_tai_lieu is null then raise exception 'Ca chưa gắn buổi — chọn giáo trình để thêm buổi mới.' using errcode = 'P0001'; end if;
    perform 1 from tai_lieu t where t.id = p_tai_lieu and t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.luu_tru_tu is null
                                and t.lop_id = p_lop and t.mon = l.mon for update;
    if not found then raise exception 'Giáo trình này không phải giáo trình của lớp.' using errcode = 'P0001'; end if;
    v_tl := p_tai_lieu;
  end if;

  select t.nhanh into v_nhanh from tai_lieu t where t.id = v_tl;
  if v_nhanh = 'hinh' then
    raise exception 'Khung giáo trình Hình chưa sửa được ở màn này — mở builder Hình.' using errcode = 'P0001';
  end if;

  if v_buoi is null then
    select count(*) filter (where p.loai_phan = 'buoi'), coalesce(max(p.thu_tu), -1) + 1 into v_n, v_tt
      from tai_lieu_phan p where p.tai_lieu_id = v_tl;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values (v_tl, v_tt, 'buoi', 'Buổi ' || (v_n + 1))
    returning id into v_buoi;
    insert into gtt_ca (lop_id, ngay, buoi_id, mon) values (p_lop, p_ngay, v_buoi, l.mon);
  end if;

  -- p_so_btvn = đúng giá trị builder truyền (src/lib/tailieuBdm.ts datBuoi: SO_BTVN_MAC_DINH + _tong 5 — Thùy 13/11 BTVN 5 câu / nhóm)
  perform public.fn_tl_bdm_dat_buoi(v_tl, v_buoi, coalesce(p_chon, '[]'::jsonb),
    p_so_btvn => '{"_tong": 5, "tu_luan": 2, "trac_nghiem": 2, "tra_loi_ngan": 1}'::jsonb);
  return public._gtt_ca_json(p_lop, p_ngay, public._gtt_snap_duyet(l.mon, l.khoi, p_ngay - (extract(isodow from p_ngay)::int - 1)));
end $$;

