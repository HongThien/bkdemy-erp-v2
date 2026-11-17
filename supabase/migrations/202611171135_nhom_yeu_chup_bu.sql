-- 17/11/2026 · điểm 5 bước 1b: chụp bù NHÓM yếu cho ảnh hiện tại + mọi tuần đầu đã có (2 tuần: 09/11, 16/11). Chỉ điền so_nhom_yeu + nhom; số dạng yếu đã chụp KHÔNG đổi.
-- CHỤP BÙ: ảnh hiện tại (bản lưu sẵn) + 2 tuần đầu đã có (tính tại mốc 00:00 thứ Hai). Chỉ điền 2 cột mới; số dạng yếu đã chụp KHÔNG đổi.
do $$
declare r record; v_moc timestamptz;
begin
  for r in select distinct mon from dang_yeu_hien_tai loop
    update dang_yeu_hien_tai d set so_nhom_yeu = coalesce(x.so, 0), nhom = coalesce(x.ds, '[]'::jsonb)
      from (select h.hoc_sinh_id, y.so, y.ds from (select distinct hoc_sinh_id from dang_yeu_hien_tai where mon = r.mon) h
              left join (select ny.hoc_sinh_id, count(*)::int so,
                                jsonb_agg(jsonb_build_object('nhom', ny.nhom, 'ten_nhom', ny.ten_nhom, 'score', round(ny.score, 2), 'n', ny.n) order by ny.score) ds
                           from public._nhom_yeu_tai_lo(array(select hoc_sinh_id from dang_yeu_hien_tai where mon = r.mon), r.mon, null) ny group by 1) y
                on y.hoc_sinh_id = h.hoc_sinh_id) x
     where d.mon = r.mon and d.hoc_sinh_id = x.hoc_sinh_id;
  end loop;
  for r in select distinct tuan, mon from dang_yeu_dau_tuan loop
    v_moc := (r.tuan::timestamp at time zone 'Asia/Ho_Chi_Minh');
    update dang_yeu_dau_tuan d set so_nhom_yeu = coalesce(x.so, 0), nhom = coalesce(x.ds, '[]'::jsonb)
      from (select h.hoc_sinh_id, y.so, y.ds from (select distinct hoc_sinh_id from dang_yeu_dau_tuan where tuan = r.tuan and mon = r.mon) h
              left join (select ny.hoc_sinh_id, count(*)::int so,
                                jsonb_agg(jsonb_build_object('nhom', ny.nhom, 'ten_nhom', ny.ten_nhom, 'score', round(ny.score, 2), 'n', ny.n) order by ny.score) ds
                           from public._nhom_yeu_tai_lo(array(select hoc_sinh_id from dang_yeu_dau_tuan where tuan = r.tuan and mon = r.mon), r.mon, v_moc) ny group by 1) y
                on y.hoc_sinh_id = h.hoc_sinh_id) x
     where d.tuan = r.tuan and d.mon = r.mon and d.hoc_sinh_id = x.hoc_sinh_id;
  end loop;
end $$;
