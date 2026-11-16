-- ============================================================================
-- 202611161916 — giao_trinh_tuan_buoi_ke_tiep
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 (sửa mig 202611161902): "t muốn khi giáo viên chọn thì hệ thống tự đề xuất — vì còn liên quan đến đại · hình, mỗi lớp có
--   2 cái giáo trình nên hệ thống chọn được đâu". ⇒ Hệ KHÔNG đoán giáo trình cho ca (bỏ đề xuất theo ca trên lưới); người chọn giáo trình,
--   hệ đề xuất BUỔI KẾ TIẾP CHƯA GÁN của đúng giáo trình đó.
--   Buổi kế tiếp = buổi đầu tiên đứng SAU buổi đã dùng cuối cùng (đã gán ngày dạy cho lớp hoặc đã gắn ca) — buổi bị bỏ qua giữa chừng
--   không đề xuất lại (cùng luật đã chốt ở mig 1902). Gắn xong một ca thì buổi kế tiếp tự dịch (màn đọc lại nền).
--   fn_gtt_man_tuan: bỏ khoá 'de_xuat' ở ca, thêm 'ke_tiep' ở mỗi giáo trình của lớp. Chi phí theo một khối (K2).
--   _gtt_de_xuat / fn_gtt_nhan_de_xuat (mig 1902) KHÔNG còn màn nào gọi — giữ nguyên, chờ Thùy gật mới drop (Luật xoá).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Hàm mới _gtt_ke_tiep; thay thân fn_gtt_man_tuan (giữ chữ ký; mất khoá 'de_xuat' ở ca — chỉ màn Giáo trình tuần đọc, sửa cùng lượt).
-- ============================================================================

-- Buổi kế tiếp chưa gán của MỘT giáo trình (của lớp).
create or replace function _gtt_ke_tiep(p_tai_lieu uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select b.id from (
    select x.*, max(case when x.dung then x.stt end) over () as cuoi
      from (select p.id, row_number() over (order by p.thu_tu, p.id) as stt,
                   (exists (select 1 from tai_lieu d where d.lop_id = t.lop_id and d.loai = 'giao_trinh_buoi' and d.nguon_buoi = p.id::text)
                    or exists (select 1 from gtt_ca g where g.buoi_id = p.id)) as dung
              from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id = t.id and p.loai_phan = 'buoi'
             where t.id = p_tai_lieu) x) b
   where b.stt > coalesce(b.cuoi, 0)
   order by b.stt limit 1
$$;
revoke execute on function _gtt_ke_tiep(uuid) from public, anon, authenticated;

create or replace function fn_gtt_man_tuan(p_mon text, p_khoi text, p_tuan date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_lops uuid[]; v_snap jsonb; v_tt gtt_duyet;
begin
  perform public._gtt_kiem_pham_vi(p_mon, p_khoi);
  if extract(isodow from p_tuan) <> 1 then raise exception 'Tuần phải bắt đầu bằng thứ Hai.' using errcode = 'P0001'; end if;

  v_lops := array(select l.id from lop l where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc');
  v_tt := public._gtt_trang_thai(p_mon, p_khoi, p_tuan);
  v_snap := case when v_tt.hanh_dong = 'duyet' then v_tt.khung end;

  return jsonb_build_object(
    'mon', p_mon, 'khoi', p_khoi, 'tuan', p_tuan, 'den', p_tuan + 6,
    'sua', true, 'duyet', public._gtt_la_tbm(p_mon),
    'trang_thai', case when v_tt.id is null then null else jsonb_build_object(
        'hanh_dong', v_tt.hanh_dong, 'at', v_tt.at, 'ghi_chu', v_tt.ghi_chu,
        'ho_ten', (select n.ho_ten from nhan_su n where n.id = v_tt.nhan_su_id)) end,
    'lich_su', coalesce((select jsonb_agg(jsonb_build_object('hanh_dong', d.hanh_dong, 'at', d.at, 'ghi_chu', d.ghi_chu, 'ho_ten', n.ho_ten) order by d.so desc)
                           from (select * from gtt_duyet d where d.mon = p_mon and d.khoi = p_khoi and d.tuan = p_tuan order by d.so desc limit 10) d
                           left join nhan_su n on n.id = d.nhan_su_id), '[]'::jsonb),
    'lop', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', l.id, 'ten_lop', l.ten_lop,
               'giao_trinh', coalesce((
                  select jsonb_agg(jsonb_build_object('id', t.id, 'ten', t.ten, 'nhanh', t.nhanh,
                           -- buổi kế tiếp chưa gán của giáo trình này (đề xuất khi người chọn giáo trình cho ca)
                           'ke_tiep', (select jsonb_build_object('id', p.id, 'tieu_de', p.tieu_de,
                                         'stt', (select count(*) from tai_lieu_phan x where x.tai_lieu_id = p.tai_lieu_id and x.loai_phan = 'buoi'
                                                   and (x.thu_tu < p.thu_tu or (x.thu_tu = p.thu_tu and x.id <= p.id))),
                                         'khung', public._gtt_khung(p.id))
                                         from tai_lieu_phan p where p.id = public._gtt_ke_tiep(t.id)))
                           order by t.updated_at desc)
                    from tai_lieu t where t.lop_id = l.id and t.loai = 'giao_trinh' and t.ban_do = 'moi'
                     and t.luu_tru_tu is null and t.mon = l.mon), '[]'::jsonb),
               'ca', coalesce((select jsonb_agg(public._gtt_ca_json(c.lop_id, c.ngay, v_snap) order by c.ngay)
                                 from public._gtt_ca(array[l.id], p_tuan, p_tuan + 6) c), '[]'::jsonb))
             order by l.ten_lop)
        from lop l where l.id = any (v_lops)), '[]'::jsonb),
    -- liên kết của ca không còn trong TKB (đổi lịch) — không tự xoá, màn nêu cờ
    'mo_coi', coalesce((
      select jsonb_agg(jsonb_build_object('lop_id', g.lop_id, 'ngay', g.ngay, 'buoi_id', g.buoi_id) order by g.ngay)
        from gtt_ca g
       where g.lop_id = any (v_lops) and g.ngay between p_tuan and p_tuan + 6
         and not exists (select 1 from public._gtt_ca(array[g.lop_id], g.ngay, g.ngay) c)), '[]'::jsonb));
end $$;
