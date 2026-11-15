-- ============================================================================
-- 202611152141 — duoi_man_ta_hai_lo_chua_co_dang_va_dot_da_xong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 15/11 "Bổ trợ đuổi fix đi" — hai lỗ thấy khi dò lỗi in giấy 14/11, màn buổi đuổi của TA (DuoiCaTA) TRỐNG phần tiến trình mà không nói vì sao:
--   (a) đợt `can_duoi` mà giáo viên CHƯA chọn dạng mục tiêu (bo_tro_duoi_dang 0 dòng) ⇒ không có gì để dạy / in.
--       Tuần này có thật: 1 đợt 0 dạng, chưa duyệt kế hoạch, đã dạy 2 buổi (11/11, 13/11).
--   (b) đợt đã bấm "Hoàn thành" / "Đã bắt kịp" nhưng còn buổi đã xếp ⇒ fn_duoi_tien_trinh chỉ trả đợt `can_duoi` ⇒ buổi đó trống.
--       Tuần này có thật: 1 đợt hoàn thành 13/11 còn buổi 14/11 và 15/11.
--   Cách sửa — suy, không đẻ dòng, không tự huỷ buổi (CLAUDE.md §4):
--   ① Hàm MỚI fn_duoi_buoi_tinh_trang(p_buoi): mỗi em trong buổi đuổi — trạng thái ĐỢT, số dạng mục tiêu / đã xong, dạng chưa xong, kế hoạch đã duyệt chưa,
--      giáo viên của lớp (người phải chọn dạng), số buổi của đợt còn xếp sau buổi này. Màn TA đọc để HIỆN LÝ DO thay vì để trống.
--      Chi phí theo MỘT buổi (≤ vài em). KHÔNG đổi fn_duoi_tien_trinh (app HS + bản app TA đang chạy giữ nguyên hành vi).
--   ② fn_bo_tro_tu_kiem (banner "tự kiểm hiển thị" ở Lịch phòng — người xếp lịch nhìn) thêm 2 dòng báo cho buổi đuổi sắp tới:
--      đợt chưa có dạng mục tiêu · đợt đã hoàn thành mà buổi còn đó (buổi thừa: gỡ em / huỷ buổi). Việc gỡ / huỷ vẫn do người xếp lịch làm.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Một hàm mới (chỉ nhân sự) + thêm hai câu kiểm vào fn_bo_tro_tu_kiem.
-- ============================================================================

create or replace function public.fn_duoi_buoi_tinh_trang(p_buoi uuid)
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự xem được.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'hoc_sinh_id', hh.hoc_sinh_id, 'bo_tro_duoi_id', d.id,
           'trang_thai_dot', d.trang_thai, 'hoan_thanh_at', d.hoan_thanh_at,
           'ke_hoach_duyet', (d.dang_duyet_at is not null),
           'so_dang', coalesce(t.so_dang, 0), 'so_dang_xong', coalesce(t.so_xong, 0),
           'dang_chua_xong', coalesce(t.chua_xong, '[]'::jsonb),
           'gv', coalesce((select jsonb_agg(n.ho_ten order by pc.la_chinh desc nulls last, n.ho_ten)
                             from phan_cong_lop pc join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam'
                            where pc.lop_id = d.lop_id and pc.vai_tro = 'gv'), '[]'::jsonb),
           'so_buoi_sau', (select count(*) from buoi_hoc_hs h2 join buoi_hoc b2 on b2.id = h2.buoi_hoc_id
                            where h2.bo_tro_duoi_id = d.id and b2.id <> b.id and b2.trang_thai = 'mo' and b2.danh_gia_xong_at is null
                              and (b2.ngay, coalesce(b2.gio_bat_dau, time '00:00')) > (b.ngay, coalesce(b.gio_bat_dau, time '00:00')))
         ) order by hh.hoc_sinh_id), '[]'::jsonb)
    into v_out
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_duoi_id is not null
    join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
    left join lop l on l.id = d.lop_id
    left join lateral (
      select count(*)::int as so_dang, count(*) filter (where td.xong)::int as so_xong,
             jsonb_agg(jsonb_build_object('ma_dang', td.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(l.mon, td.ma_dang), td.ma_dang)) order by td.ma_dang)
               filter (where not td.xong) as chua_xong
        from public._duoi_tien_do_dang(d.hoc_sinh_id, l.mon, array(select x.ma_dang from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id)) td
    ) t on true
   where b.id = p_buoi and b.loai = 'bo_tro_duoi';
  return v_out;
end $function$;

-- ② tự kiểm: sửa thân hàm đang sống bằng thay chuỗi khớp ĐÚNG MỘT lần, khoá md5 (hàm đã bị phiên khác đổi thì dừng).
do $$
declare v_def text; v_src text;
  c1 constant text := '(select tk.email from tai_khoan tk where tk.hoc_sinh_id = hh.hoc_sinh_id limit 1) as email';
  c2 constant text := 'v_hs := v_hs || to_jsonb(h.ho_ten);';
begin
  select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p where p.oid = 'public.fn_bo_tro_tu_kiem(date,date)'::regprocedure;
  if md5(v_src) <> '5ea68db9da48ca9306fdf19bbc71d99c' then raise exception 'fn_bo_tro_tu_kiem đã khác bản lúc viết migration (15/11) — đọc lại trước khi áp.'; end if;
  if (length(v_def) - length(replace(v_def, c1, ''))) / length(c1) <> 1 or (length(v_def) - length(replace(v_def, c2, ''))) / length(c2) <> 1 then
    raise exception 'fn_bo_tro_tu_kiem: mốc thay không khớp đúng một lần.';
  end if;
  v_def := replace(v_def, c1, c1 || E',\n                    hh.bo_tro_duoi_id as dot, (select d.trang_thai from bo_tro_duoi d where d.id = hh.bo_tro_duoi_id) as dot_tt,\n'
                               || E'                    (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = hh.bo_tro_duoi_id) as so_dang');
  v_def := replace(v_def, c2, c2 || E'\n      -- 15/11: buổi đuổi mà đợt của em không còn / chưa có nội dung ⇒ báo người xếp lịch (màn TA cũng hiện lý do, fn_duoi_buoi_tinh_trang)\n'
                               || E'      if r.loai = ''bo_tro_duoi'' and h.dot is not null and (select bb.danh_gia_xong_at from buoi_hoc bb where bb.id = r.id) is null then   -- buổi đã dạy xong thì thôi\n'
                               || E'        if h.dot_tt is distinct from ''can_duoi'' then v_loi := v_loi || format(''Đợt đuổi của %s đã hoàn thành — buổi này thừa: gỡ em khỏi buổi hoặc huỷ buổi'', h.ho_ten);\n'
                               || E'        elsif h.so_dang = 0 then v_loi := v_loi || format(''Đợt đuổi của %s chưa có dạng mục tiêu (giáo viên chưa chốt kế hoạch) — TA không có gì để dạy / in'', h.ho_ten);\n'
                               || E'        end if;\n'
                               || E'      end if;');
  execute v_def;
end $$;
