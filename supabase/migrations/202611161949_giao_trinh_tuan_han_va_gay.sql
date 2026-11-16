-- ============================================================================
-- 202611161949 — giao_trinh_tuan_han_va_gay
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 "Chốt như đề xuất" (spec-van-hanh-tuan.md §3.8, §8.1): Giáo trình tuần T có
--     H1 = 23:59 thứ Sáu trước tuần T — trưởng khối GỬI DUYỆT (mốc "điền xong" = bấm Gửi duyệt);
--     H2 = 12:00 thứ Bảy trước tuần T — trưởng bộ môn DUYỆT hoặc TRẢ LẠI bản đã gửi;
--     trễ ⇒ ĐỀ XUẤT GẬY (gay_de_xuat, người quyết theo spec-truong-khoi §3: gậy trưởng khối — Trang; gậy trưởng bộ môn — CEO).
--   Việc tồn = invariant (CLAUDE §4), không bảng tasks: màn tuần đọc 'han' (hạn + đã trễ chưa) trong fn_gtt_man_tuan.
--   Kiểm trễ theo lịch ⇒ MỘT dòng tinh_san_dang_ky (K4, Thùy 16/11 "việc theo lịch ⇒ đăng ký bộ điều phối"), mỗi giờ, xét tuần này + tuần sau;
--   ref_key duy nhất ⇒ chạy lại không đẻ trùng. Tính năng có từ 16/11 ⇒ kỳ đầu phải điền = tuần 23/11 (hạn 23:59 20/11) — tuần trước đó không gậy.
--   Ô (môn × khối) không có trưởng khối ⇒ không gậy H1 (trưởng bộ môn làm thay — như Báo cáo tuần). Gậy H2 cho người giữ ghế trưởng bộ môn của môn
--   (_quan_ly_mon_cua); QLCL toàn hệ không tính.
--   nguon = 'vanhanh' (CHECK gay_de_xuat.nguon chỉ có vanhanh · giaoviec — như Báo cáo tuần).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Hàm mới _gtt_han · _gtt_han_json · _gtt_de_xuat_tre · _gtt_gay_tre_chay; 1 dòng tinh_san_dang_ky; thay thân fn_gtt_man_tuan (thêm khoá 'han').
-- ============================================================================

-- Hạn của tuần T (T = thứ Hai): H1 = 23:59:59 thứ Sáu trước · H2 = 12:00 thứ Bảy trước (giờ VN).
create or replace function _gtt_han(p_tuan date, out dien timestamptz, out duyet timestamptz)
language sql stable set search_path = public as $$
  select ((p_tuan - 2)::timestamp at time zone 'Asia/Ho_Chi_Minh') - interval '1 second',
         ((p_tuan - 2)::timestamp + interval '12 hours') at time zone 'Asia/Ho_Chi_Minh'
$$;

-- Hạn + trạng thái trễ của (môn × khối × tuần) — dùng chung cho màn và cho đề xuất gậy (một chỗ định nghĩa "trễ").
create or replace function _gtt_han_json(p_mon text, p_khoi text, p_tuan date) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
           'dien', h.dien, 'duyet', h.duyet, 'gui_at', g.at, 'xu_ly_at', x.at,
           'tre_dien', now() > h.dien and (g.at is null or g.at > h.dien),
           'tre_duyet', g.at is not null and g.at <= h.duyet and now() > h.duyet and (x.at is null or x.at > h.duyet))
    from public._gtt_han(p_tuan) h
    left join lateral (select d.at, d.so from gtt_duyet d
                        where d.mon = p_mon and d.khoi = p_khoi and d.tuan = p_tuan and d.hanh_dong = 'gui' order by d.so limit 1) g on true
    left join lateral (select d.at from gtt_duyet d
                        where d.mon = p_mon and d.khoi = p_khoi and d.tuan = p_tuan and d.hanh_dong in ('duyet', 'tra_lai') and d.so > g.so
                        order by d.so limit 1) x on true
$$;

-- Đề xuất gậy trễ H1 / H2 cho tuần T. Trả số đề xuất mới.
create or replace function _gtt_de_xuat_tre(p_tuan date) returns int
language plpgsql security definer set search_path = public as $$
declare h record; r record; n int := 0; k int;
begin
  if p_tuan < date '2026-11-23' then return 0; end if;   -- tính năng có từ 16/11: kỳ đầu = tuần 23/11
  select * into h from public._gtt_han(p_tuan);
  if now() <= h.dien then return 0; end if;
  for r in
    select o.mon, o.khoi, public._gtt_han_json(o.mon, o.khoi, p_tuan) as j
      from (select l.mon, l.khoi from lop l
             where l.trang_thai = 'dang_hoc' and l.khoi is not null
               and exists (select 1 from public._gtt_ca(array[l.id], p_tuan, p_tuan + 6) c where not c.huy)
               -- chỉ lớp đã có giáo trình bản đồ mới (môn chưa dùng giáo trình bản đồ mới thì chưa có gì để điền — không gậy oan)
               and exists (select 1 from tai_lieu t where t.lop_id = l.id and t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.luu_tru_tu is null)
             group by l.mon, l.khoi) o
  loop
    if (r.j ->> 'tre_dien')::boolean then
      insert into gay_de_xuat (nhan_su_id, nguon, ref_key, mo_ta, deadline_at, tre_phut, so_gay)
      select q.nhan_su_id, 'vanhanh', 'gtt_dien:' || r.mon || '|' || r.khoi || '|' || p_tuan || '|' || q.nhan_su_id,
             'Giáo trình tuần ' || to_char(p_tuan, 'DD/MM') || '–' || to_char(p_tuan + 6, 'DD/MM') || ' · ' || r.mon || ' khối ' || r.khoi
               || case when r.j ->> 'gui_at' is null then ' — chưa gửi duyệt (hạn ' else ' — gửi duyệt trễ (hạn ' end
               || to_char(h.dien at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM') || ')',
             h.dien,
             greatest(1, ceil(extract(epoch from (coalesce((r.j ->> 'gui_at')::timestamptz, now()) - h.dien)) / 60))::int, 1
        from phan_cong_quan_ly_khoi q join nhan_su ns on ns.id = q.nhan_su_id and ns.trang_thai = 'dang_lam'
       where q.mon = r.mon and q.khoi = r.khoi and q.vai = 'truong'
      on conflict (ref_key) do nothing;
      get diagnostics k = row_count; n := n + k;
    end if;
    if (r.j ->> 'tre_duyet')::boolean then
      insert into gay_de_xuat (nhan_su_id, nguon, ref_key, mo_ta, deadline_at, tre_phut, so_gay)
      select ns.id, 'vanhanh', 'gtt_duyet:' || r.mon || '|' || r.khoi || '|' || p_tuan || '|' || ns.id,
             'Duyệt giáo trình tuần ' || to_char(p_tuan, 'DD/MM') || '–' || to_char(p_tuan + 6, 'DD/MM') || ' · ' || r.mon || ' khối ' || r.khoi
               || case when r.j ->> 'xu_ly_at' is null then ' — chưa duyệt / trả lại (hạn ' else ' — duyệt trễ (hạn ' end
               || to_char(h.duyet at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM') || ')',
             h.duyet,
             greatest(1, ceil(extract(epoch from (coalesce((r.j ->> 'xu_ly_at')::timestamptz, now()) - h.duyet)) / 60))::int, 1
        from nhan_su ns
       where ns.trang_thai = 'dang_lam' and r.mon = any (public._quan_ly_mon_cua(ns.id))
      on conflict (ref_key) do nothing;
      get diagnostics k = row_count; n := n + k;
    end if;
  end loop;
  return n;
end $$;

-- Lượt của bộ điều phối: xét tuần này + tuần sau (hạn của tuần sau rơi vào T6 / T7 tuần này).
create or replace function _gtt_gay_tre_chay() returns int
language sql security definer set search_path = public as $$
  select coalesce(sum(public._gtt_de_xuat_tre(t)), 0)::int
    from (values (date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date),
                 ((date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') + interval '7 days')::date)) v(t)
$$;

revoke execute on function _gtt_han(date) from public, anon, authenticated;
revoke execute on function _gtt_han_json(text, text, date) from public, anon, authenticated;
revoke execute on function _gtt_de_xuat_tre(date) from public, anon, authenticated;
revoke execute on function _gtt_gay_tre_chay() from public, anon, authenticated;

insert into tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu)
values ('gtt_gay_tre', 'Giáo trình tuần: đề xuất gậy trễ hạn gửi (23:59 T6) / duyệt (12:00 T7)', 'public._gtt_gay_tre_chay()',
        60, null, 85, 10, true, 'Thùy 16/11 · spec-van-hanh-tuan §3.8 · ref_key duy nhất ⇒ chạy lại không trùng')
on conflict (ma) do nothing;

CREATE OR REPLACE FUNCTION public.fn_gtt_man_tuan(p_mon text, p_khoi text, p_tuan date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    'han', public._gtt_han_json(p_mon, p_khoi, p_tuan),   -- hạn H1 / H2 + trễ (mig 202611161949)
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
end $function$;
