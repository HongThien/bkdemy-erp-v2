-- Bổ trợ nhẹ — danh sách lớp: tính dạng yếu CẢ LỚP MỘT LƯỢT (Thùy 10/11, đo bằng scripts/_do_man_cham_mastery.mjs).
-- Trước: mỗi em gọi fn_btyeu_dang_yeu_2_cua_so_moi HAI lần (đếm + danh sách) ⇒ lớp 17 em = 34 lượt ≈ 8,2 s — vượt trần 8 s của app
-- sau khi luật nhóm (mig 202611101521) làm mỗi lượt chậm thêm. Nay: _dang_yeu_tai_lo(cả lớp, môn, null) một lần — cùng luật
-- (mốc 2 cửa sổ tính tới hôm nay, cùng phần Hình mô hình), rồi gom theo em.
create or replace function public.fn_btnhe_lop_hs(p_lop uuid, p_ngay date)
returns table(hoc_sinh_id uuid, ho_ten text, ma_hs text, so_dang_yeu integer, dang_yeu text[], so_ca_nhe_tuan integer)
language plpgsql stable security definer set search_path to 'public' as $function$
#variable_conflict use_column
declare v_mon text; v_khoi text; v_tuan date := date_trunc('week', p_ngay)::date; v_hs uuid[];
begin
  select l.mon, l.khoi into v_mon, v_khoi from lop l where l.id = p_lop;
  if v_mon is null then raise exception 'Không thấy lớp.'; end if;
  if not public._btnhe_duoc_tao(v_mon, v_khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  select array_agg(hl.hoc_sinh_id) into v_hs from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc';
  return query
  with dy as materialized (select * from public._dang_yeu_tai_lo(coalesce(v_hs, '{}'), v_mon, null))
  select h.id, h.ho_ten, h.ma_hs,
         (select count(*)::int from dy where dy.hoc_sinh_id = h.id),
         (select coalesce(array_agg(dy.ten_dang order by dy.score), '{}') from dy where dy.hoc_sinh_id = h.id),
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy'
             and b.ngay >= v_tuan and b.ngay < v_tuan + 7)
    from hoc_sinh h
   where h.id = any(coalesce(v_hs, '{}'))
   order by h.ho_ten;
end $function$;
