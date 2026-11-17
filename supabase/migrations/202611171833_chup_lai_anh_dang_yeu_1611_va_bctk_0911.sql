-- Thùy 17/11 "M chụp lại đi": ảnh dang_yeu_dau_tuan tuần 16/11 chụp 00:05 16/11, TRƯỚC khi đổi luật mastery sáng 17/11
-- (mig 202611171010… bỏ luyện, tính BTVN) ⇒ báo cáo tuần 09–15/11 so hai luật khác nhau
-- (đầu tuần = ảnh 09/11 đã chụp lại theo luật mới; cuối tuần = ảnh 16/11 luật cũ). K9 Toán: B lưu 445, luật hiện hành 287.
-- Luật dạng yếu GIỮ NGUYÊN (Thùy 17/11: 1 lần đo vẫn kết luận được, nghi yếu = yếu).
-- 1) Chụp lại ảnh 16/11 mọi môn (dạng + nhóm). chot_id: mọi dòng tuần 16/11 đang null (đã kiểm), hàm chụp cũng ghi null ⇒ không mất gì.
--    Lượt chốt bổ trợ (_btk_* / _btnhe_*) không đọc dang_yeu_dau_tuan (pg_proc: chỉ _dang_yeu_chup_tuan, _qlcl_*, fn_bctk_so, fn_qlcl_*).
-- 2) Tính lại 5 bản báo cáo tuần 09–15/11 (chỉ cột so, giữ trạng thái), log 1 dòng mỗi bản.
-- 3) Nhân chứng: K9 Toán phải ra 287 dạng cuối tuần — lệch ⇒ huỷ cả lượt.

do $$
declare v_k9 int; r record; v_n int := 0;
begin
  perform public._dang_yeu_chup_tuan(date '2026-11-16');

  select sum(so_dang_yeu)::int into v_k9 from dang_yeu_dau_tuan where tuan = date '2026-11-16' and mon = 'Toán' and khoi = '9';
  if v_k9 is distinct from 287 then raise exception 'K9 Toán ảnh 16/11 = %, mong 287 — huỷ', v_k9; end if;

  for r in select id, o, tuan, trang_thai from bao_cao_tuan_khoi where tuan = date '2026-11-09' for update loop
    update bao_cao_tuan_khoi
       set so = public.fn_bctk_so(r.o, r.tuan) || jsonb_build_object('trend', public.fn_bctk_trend(r.o, r.tuan)),
           updated_at = now()
     where id = r.id;
    insert into bao_cao_tuan_khoi_log (bao_cao_id, tu, den, nguoi, ghi_chu)
    values (r.id, r.trang_thai, r.trang_thai, null, 'Chụp lại số sau khi chụp lại ảnh dạng yếu 16/11 theo luật hiện hành (Thùy 17/11 "M chụp lại đi")');
    v_n := v_n + 1;
  end loop;
  if v_n <> 5 then raise exception 'Mong 5 bản tuần 09/11, gặp %', v_n; end if;
end $$;
