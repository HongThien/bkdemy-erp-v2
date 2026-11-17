-- Thùy 17/11 "Tính lại": chụp lại SỐ của báo cáo tuần Toán khối 9, tuần 09–15/11 (đã duyệt).
-- Bản nộp 17/11 12:53 chụp lúc dạng yếu đầu tuần còn theo luật 2 cửa sổ (đầu 296 → cuối 445).
-- Luật hiện hành (một luật, mig 202611131539) + khối HAI CHIỀU (mig 202611171404, phien_ban 3).
-- Chỉ đổi cột `so` (số máy tính). GIỮ trạng thái đã duyệt, phần tự viết (tu_viet), ca_nhan, người duyệt.
-- Trend: chạy bằng role migrate ⇒ current_nhan_su_id() null ⇒ cả 4 tuần tính theo luật hiện hành.
-- Ghi một dòng sổ log (da_duyet → da_duyet) để còn vết chụp lại.

do $$
declare v_id uuid := 'de12a6f2-2263-4bd3-be10-a7acab98c29c'; v_o jsonb; v_tuan date; v_tt text;
begin
  select o, tuan, trang_thai into v_o, v_tuan, v_tt from bao_cao_tuan_khoi where id = v_id for update;
  if v_o is distinct from '[{"mon":"Toán","khoi":"9"}]'::jsonb or v_tuan <> date '2026-11-09' then
    raise exception 'Báo cáo % không đúng phạm vi mong đợi (o=%, tuan=%)', v_id, v_o, v_tuan;
  end if;

  update bao_cao_tuan_khoi
     set so = public.fn_bctk_so(v_o, v_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, v_tuan)),
         updated_at = now()
   where id = v_id;

  insert into bao_cao_tuan_khoi_log (bao_cao_id, tu, den, nguoi, ghi_chu)
  values (v_id, v_tt, v_tt, null,
          'Chụp lại số theo luật dạng yếu hiện hành + hai chiều (Thùy 17/11 "Tính lại"); bản cũ đầu 296 → cuối 445');
end $$;
