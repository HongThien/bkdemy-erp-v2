-- ============================================================================
-- 202611161902 — giao_trinh_tuan_de_xuat
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11: "Hiện tại có 1 số lớp Giáo trình có trước rồi, thì hệ thống tự load bài được ko (theo chiều thời gian — cái nào chưa gán
--   thì buổi sắp tới đấy)". Màn Giáo trình tuần tự hiện ĐỀ XUẤT buổi cho mỗi ca trống (suy ra, KHÔNG ghi — pure-derive, CLAUDE §4);
--   trưởng khối bấm nhận (cả tuần một lần, hoặc từng ca qua fn_gtt_chon_buoi) thì mới thành liên kết gtt_ca.
--   Luật đề xuất (đo 16/11: 217 buổi / 68 giáo trình; 23 buổi chưa gán đứng SAU buổi đã gán cuối · 9 buổi bị bỏ qua giữa chừng):
--   · Hàng đợi mỗi giáo trình = các buổi đứng SAU buổi đã dùng cuối cùng (đã gán ngày dạy cho lớp hoặc đã gắn ca). Buổi bị bỏ qua giữa chừng
--     coi là GV chủ ý bỏ ⇒ không đề xuất lại.
--   · Giáo trình của một ca = giáo trình của lần gán gần nhất CÙNG THỨ (lớp Đại + Hình dạy cố định theo thứ — đo 4 tuần qua); giáo trình đó
--     hết buổi ⇒ giáo trình mới nhất cùng nhánh còn buổi (KHTN theo chủ đề nối tiếp). Chưa có lịch sử cùng thứ ⇒ chỉ đề xuất khi lớp có
--     đúng 1 giáo trình còn buổi; còn lại để trống (thà bỏ trống còn hơn đánh sai, CLAUDE §1.5).
--   · Ca đi theo thời gian từ HÔM NAY (ca còn lại tuần này cũng tiêu buổi trước), bỏ qua ca đã gắn / đã gán ngày dạy; chỉ trả ca trong khoảng hỏi.
--   Chi phí: theo các lớp của MỘT khối (K2), không quét lịch sử đo. Đo ở DEVLOG 16/11.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Hàm mới _gtt_de_xuat · fn_gtt_nhan_de_xuat; thay thân fn_gtt_man_tuan (giữ chữ ký, thêm khoá 'de_xuat' ở mỗi ca).
-- ============================================================================

create or replace function _gtt_de_xuat(p_lops uuid[], p_tu date, p_den date)
returns table (lop_id uuid, ngay date, buoi_id uuid, tai_lieu_id uuid)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_lop uuid; c record; v_gt uuid; v_nhanh text; v_b uuid; v_hang jsonb;
begin
  foreach v_lop in array coalesce(p_lops, '{}') loop
    -- hàng đợi: {giáo trình: [buổi…]} — buổi đứng sau buổi đã dùng cuối cùng
    select coalesce(jsonb_object_agg(q.gt, q.ds), '{}'::jsonb) into v_hang
      from (select b.gt::text as gt, jsonb_agg(b.id order by b.stt) as ds
              from (select x.*, max(case when x.dung then x.stt end) over (partition by x.gt) as cuoi
                      from (select t.id as gt, p.id, row_number() over (partition by t.id order by p.thu_tu, p.id) as stt,
                                   (exists (select 1 from tai_lieu d where d.lop_id = v_lop and d.loai = 'giao_trinh_buoi' and d.nguon_buoi = p.id::text)
                                    or exists (select 1 from gtt_ca g where g.buoi_id = p.id)) as dung
                              from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id = t.id and p.loai_phan = 'buoi'
                             where t.lop_id = v_lop and t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.luu_tru_tu is null) x) b
             where b.stt > coalesce(b.cuoi, 0)
             group by b.gt) q;

    for c in select x.ngay from public._gtt_ca(array[v_lop], v_today, p_den) x
              where not x.huy
                and not exists (select 1 from gtt_ca g where g.lop_id = v_lop and g.ngay = x.ngay)
                and not exists (select 1 from tai_lieu t where t.lop_id = v_lop and t.ngay = x.ngay and t.loai = 'giao_trinh_buoi')
              order by x.ngay loop
      v_gt := null; v_nhanh := null; v_b := null;
      -- giáo trình của lần gán gần nhất cùng thứ
      select g.id, g.nhanh into v_gt, v_nhanh
        from tai_lieu d join tai_lieu g on g.id = d.nguon_id
       where d.lop_id = v_lop and d.loai = 'giao_trinh_buoi' and d.ngay < c.ngay
         and extract(isodow from d.ngay) = extract(isodow from c.ngay)
         and g.lop_id = v_lop and g.loai = 'giao_trinh' and g.ban_do = 'moi' and g.luu_tru_tu is null
       order by d.ngay desc limit 1;
      if v_gt is not null and jsonb_array_length(coalesce(v_hang -> v_gt::text, '[]'::jsonb)) = 0 then
        -- hết buổi ⇒ giáo trình mới nhất cùng nhánh còn buổi
        select t.id into v_gt from tai_lieu t
         where t.lop_id = v_lop and t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.luu_tru_tu is null
           and t.nhanh is not distinct from v_nhanh and jsonb_array_length(coalesce(v_hang -> t.id::text, '[]'::jsonb)) > 0
         order by t.created_at desc limit 1;
        if not found then v_gt := null; end if;
      elsif v_gt is null and (select count(*) from jsonb_each(v_hang) e where jsonb_array_length(e.value) > 0) = 1 then
        select e.key::uuid into v_gt from jsonb_each(v_hang) e where jsonb_array_length(e.value) > 0;
      end if;
      if v_gt is not null and jsonb_array_length(coalesce(v_hang -> v_gt::text, '[]'::jsonb)) > 0 then
        v_b := (v_hang -> v_gt::text ->> 0)::uuid;
        v_hang := jsonb_set(v_hang, array[v_gt::text], (v_hang -> v_gt::text) - 0);
        if c.ngay >= p_tu then
          lop_id := v_lop; ngay := c.ngay; buoi_id := v_b; tai_lieu_id := v_gt;
          return next;
        end if;
      end if;
    end loop;
  end loop;
end $$;
revoke execute on function _gtt_de_xuat(uuid[], date, date) from public, anon, authenticated;

-- Nhận MỌI đề xuất của (môn × khối × tuần) một lần. Ca đã có người gắn trong lúc đó ⇒ bỏ qua.
create or replace function fn_gtt_nhan_de_xuat(p_mon text, p_khoi text, p_tuan date) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_lops uuid[]; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  perform public._gtt_kiem_pham_vi(p_mon, p_khoi);
  if extract(isodow from p_tuan) <> 1 then raise exception 'Tuần phải bắt đầu bằng thứ Hai.' using errcode = 'P0001'; end if;
  perform pg_advisory_xact_lock(hashtext('gtt|' || p_mon || '|' || p_khoi || '|' || p_tuan::text));
  v_lops := array(select l.id from lop l where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc');
  insert into gtt_ca (lop_id, ngay, buoi_id, mon)
  select d.lop_id, d.ngay, d.buoi_id, p_mon
    from public._gtt_de_xuat(v_lops, greatest(p_tuan, v_today), p_tuan + 6) d
  on conflict do nothing;
  return public.fn_gtt_man_tuan(p_mon, p_khoi, p_tuan);
end $$;
revoke execute on function fn_gtt_nhan_de_xuat(text, text, date) from public, anon;
grant execute on function fn_gtt_nhan_de_xuat(text, text, date) to authenticated;

create or replace function fn_gtt_man_tuan(p_mon text, p_khoi text, p_tuan date) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_lops uuid[]; v_snap jsonb; v_tt gtt_duyet; v_dx jsonb;
begin
  perform public._gtt_kiem_pham_vi(p_mon, p_khoi);
  if extract(isodow from p_tuan) <> 1 then raise exception 'Tuần phải bắt đầu bằng thứ Hai.' using errcode = 'P0001'; end if;

  v_lops := array(select l.id from lop l where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc');
  v_tt := public._gtt_trang_thai(p_mon, p_khoi, p_tuan);
  v_snap := case when v_tt.hanh_dong = 'duyet' then v_tt.khung end;
  -- đề xuất buổi cho ca trống (suy ra, không ghi) — {lớp|ngày: buổi}
  select coalesce(jsonb_object_agg(d.lop_id::text || '|' || d.ngay::text, jsonb_build_object(
           'id', p.id, 'tai_lieu_id', t.id, 'ten_gt', t.ten, 'nhanh', t.nhanh, 'tieu_de', p.tieu_de,
           'stt', (select count(*) from tai_lieu_phan x where x.tai_lieu_id = p.tai_lieu_id and x.loai_phan = 'buoi'
                     and (x.thu_tu < p.thu_tu or (x.thu_tu = p.thu_tu and x.id <= p.id))),
           'khung', public._gtt_khung(p.id))), '{}'::jsonb)
    into v_dx
    from public._gtt_de_xuat(v_lops, p_tuan, p_tuan + 6) d
    join tai_lieu_phan p on p.id = d.buoi_id join tai_lieu t on t.id = d.tai_lieu_id;

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
               'ca', coalesce((select jsonb_agg(public._gtt_ca_json(c.lop_id, c.ngay, v_snap)
                                                || jsonb_build_object('de_xuat', v_dx -> (c.lop_id::text || '|' || c.ngay::text)) order by c.ngay)
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
