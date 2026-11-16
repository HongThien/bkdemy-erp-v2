-- ============================================================================
-- 202611161722 — giao_trinh_tuan_mot_cong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Mig 202611161716 (Giáo trình tuần) viết cổng phạm vi (môn × khối) lặp ở fn_gtt_man_tuan và fn_gtt_chuyen. Gom về MỘT hàm cổng
--   _gtt_kiem_pham_vi (cùng nếp _kiem của hệ) ⇒ một chỗ sửa luật, và cổng tự động check:kien-truc (db_secdef_khong_cong) nhận ra được.
--   Không đổi hành vi: cùng điều kiện _trong_pham_vi, cùng câu lỗi, cùng mã lỗi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thay thân 2 hàm (create or replace, giữ chữ ký).
-- ============================================================================

create or replace function _gtt_kiem_pham_vi(p_mon text, p_khoi text) returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if not public._trong_pham_vi(p_mon, p_khoi) then
    raise exception 'Môn % khối % ngoài phạm vi của bạn.', p_mon, p_khoi using errcode = '42501';
  end if;
end $$;
revoke execute on function _gtt_kiem_pham_vi(text, text) from public, anon, authenticated;

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
               'giao_trinh', coalesce((select jsonb_agg(jsonb_build_object('id', t.id, 'ten', t.ten, 'nhanh', t.nhanh) order by t.updated_at desc)
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


create or replace function fn_gtt_chuyen(p_mon text, p_khoi text, p_tuan date, p_hanh_dong text, p_ghi_chu text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_tt gtt_duyet;
begin
  perform public._gtt_kiem_pham_vi(p_mon, p_khoi);
  if extract(isodow from p_tuan) <> 1 then raise exception 'Tuần phải bắt đầu bằng thứ Hai.' using errcode = 'P0001'; end if;
  if p_hanh_dong not in ('gui', 'duyet', 'tra_lai') then raise exception 'Hành động không hợp lệ.' using errcode = 'P0001'; end if;
  if p_hanh_dong in ('duyet', 'tra_lai') and not public._gtt_la_tbm(p_mon) then
    raise exception 'Chỉ trưởng bộ môn % mới duyệt / trả lại được.', p_mon using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtext('gtt|' || p_mon || '|' || p_khoi || '|' || p_tuan::text));
  v_tt := public._gtt_trang_thai(p_mon, p_khoi, p_tuan);

  if p_hanh_dong = 'gui' and v_tt.hanh_dong = 'gui' then
    raise exception 'Tuần này đã gửi, đang chờ trưởng bộ môn duyệt.' using errcode = 'P0001';
  elsif p_hanh_dong = 'duyet' and v_tt.hanh_dong is distinct from 'gui' then
    raise exception 'Chưa có bản gửi duyệt.' using errcode = 'P0001';
  elsif p_hanh_dong = 'tra_lai' then
    if v_tt.hanh_dong is null or v_tt.hanh_dong = 'tra_lai' then raise exception 'Chưa có bản để trả lại.' using errcode = 'P0001'; end if;
    if nullif(trim(p_ghi_chu), '') is null then raise exception 'Trả lại phải ghi lý do.' using errcode = 'P0001'; end if;
  end if;

  insert into gtt_duyet (mon, khoi, tuan, hanh_dong, ghi_chu, khung, nhan_su_id)
  values (p_mon, p_khoi, p_tuan, p_hanh_dong, nullif(trim(p_ghi_chu), ''),
          case when p_hanh_dong = 'duyet' then public._gtt_snap(p_mon, p_khoi, p_tuan) end,
          public.current_nhan_su_id());

  return public.fn_gtt_man_tuan(p_mon, p_khoi, p_tuan);
end $$;

