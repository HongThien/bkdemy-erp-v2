-- ============================================================================
-- 202611121742 — sau_gio_doi_muc
-- VÌ SAO (Thùy 12/11, qua phiên "Hoàn thiện phòng làm việc"): "Trong bổ trợ sau giờ - có chức năng thay đổi level. tức là khi thấy nó
--   cần lên L2 thì chỉnh lên L2 và nó sẽ chuyển sang xuất hiện ở bên bổ trợ yếu".
--   · fn_btnhe_doi_muc(hs, môn, mức 2|3|4): em đang ở sau giờ (đề xuất MỚI NHẤT = L1 đã duyệt) ⇒ đi ĐÚNG đường chốt có sẵn:
--     fn_btk_luu (đề xuất mức mới, cùng nhóm/ưu tiên của L1; quyền = trưởng khối trở lên trong phạm vi, _btk_la_tk) → chờ duyệt →
--     _btk_duyet_chay (thân fn_btk_duyet: trần sức chứa, hs_level_log cũ→mới + actor, mở/gộp case bổ trợ yếu vào hàng xếp của Lộc).
--     Không viết đường ghi riêng. Người đổi đã nằm trong phạm vi chốt ⇒ duyệt luôn trong cùng giao dịch (chỉnh xong là sang bổ trợ yếu).
--   · fn_btk_duyet = kiểm quyền trưởng bộ môn + gọi _btk_duyet_chay (thân giữ nguyên từng dòng).
--   · Hàng chờ sau giờ tự rời (fn_btnhe_cho chỉ lấy đề xuất mới nhất còn L1). Ca sau giờ đã khởi tạo KHÔNG tự huỷ:
--     fn_btnhe_ds trả 'muc_moi' cho em đã đổi mức sau khi ca được tạo ⇒ màn báo "em đã chuyển Lx", người dùng tự quyết huỷ/giữ.
-- MẤT GÌ (Luật xoá): không — create or replace hàm, thêm 2 hàm.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._btk_duyet_chay(p_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v bo_tro_de_xuat; v_chan text; v_lv_cu smallint; v_case uuid; v_truoc uuid; v_n integer := 0;
  v_nhom text[]; v_uid uuid := public.jwt_uid(); v_ly_do text;
begin
  select * into v from bo_tro_de_xuat where id = p_id for update;
  if v.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
  if v.trang_thai <> 'cho_duyet' then raise exception 'Dòng không ở trạng thái chờ duyệt.'; end if;

  -- (1) trần 70 em / 20 Cao — cùng hàm màn duyệt cũ (trigger trg_btyeu_suc_chua vẫn chặn lần nữa khi mở case)
  if v.muc <> 1 and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = v.hoc_sinh_id and y.mon = v.mon and y.trang_thai = 'dang_xu') then -- L1 sau giờ: không mở case khối ⇒ không kiểm trần
    v_chan := public.fn_btyeu_kiem_suc_chua(v.hoc_sinh_id, v.mon, v.uu_tien::int);
    if v_chan is not null then raise exception '%', v_chan; end if;
  end if;

  -- (2) mức: ghi log trước rồi trạng thái (y như duyetLevel)
  select level into v_lv_cu from hs_level where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and loai = 'kien_thuc';
  select string_agg(n->>'ten', ', ') into v_ly_do from jsonb_array_elements(v.nhom) n;
  v_ly_do := 'Trưởng khối đề xuất (Dashboard học tập) — nhóm: ' || coalesce(v_ly_do, '') || case when v.ghi_chu <> '' then ' · ' || v.ghi_chu else '' end;
  insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
  values (v.hoc_sinh_id, v.mon, 'kien_thuc', coalesce(v_lv_cu, 0), null, jsonb_build_object('nguon', 'truong_khoi_de_xuat', 'de_xuat_id', v.id),
          v.muc, v_ly_do, v_uid);
  insert into hs_level (hoc_sinh_id, mon, loai, level, updated_at) values (v.hoc_sinh_id, v.mon, 'kien_thuc', v.muc, now())
  on conflict (hoc_sinh_id, mon, loai) do update set level = excluded.level, updated_at = now();

  -- 11/11 Thùy: L1 = bổ trợ SAU GIỜ ⇒ KHÔNG mở case vào hàng xếp của Lộc; em vào HÀNG CHỜ SAU GIỜ (fn_btnhe_cho) chờ khởi tạo ca.
  if v.muc = 1 then
    update bo_tro_de_xuat set trang_thai = 'da_duyet', duyet_boi = public.current_nhan_su_id(), duyet_at = now(),
           case_id = null, so_dang = (select count(*) from public._sau_gio_dang(v.hoc_sinh_id, v.mon)), updated_at = now()
     where id = p_id;
    return jsonb_build_object('case_id', null, 'sau_gio', true, 'so_dang', (select so_dang from bo_tro_de_xuat where id = p_id));
  end if;

  -- (3) mở case mới hoặc gộp vào case đang mở (y như moHoacGopCaseBoTroYeu)
  select id into v_case from bo_tro_yeu where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and trang_thai = 'dang_xu';
  if v_case is null then
    select id into v_truoc from bo_tro_yeu where hoc_sinh_id = v.hoc_sinh_id and mon = v.mon and trang_thai = 'hoan_thanh' order by created_at desc limit 1;
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, actor, case_truoc_id, uu_tien)
    values (v.hoc_sinh_id, v.lop_id, v.mon, 'thu_cong', v_ly_do, v_uid, v_truoc, v.uu_tien)
    returning id into v_case;
  end if;

  -- (4) dạng vào case: "nhóm quyết, dạng thực thi" — mọi dạng ĐÃ ĐO chưa đạt của nhóm tick; nhóm mà mọi dạng đạt ⇒ dạng thấp nhất
  select array_agg(n->>'ma') into v_nhom from jsonb_array_elements(v.nhom) n;
  with dg as (
    select m.nut as ma_dang, m.score, m.n, m.muc, coalesce(hh.ma_bai, db.nhom_id) as nhom
      from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[v.hoc_sinh_id], true, null, null, array['dang'], 5, 5, 3) m
      left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
     where m.cap = 'dang'
  ),
  ung as (select dg.*, row_number() over (partition by dg.nhom order by dg.score, dg.n desc, dg.ma_dang) as rn from dg where dg.nhom = any(v_nhom)),
  chon as (
    select u.* from ung u
     where (u.muc <> 'dat' or u.rn = 1)
       and public._kho_ten_dang(v.mon, u.ma_dang) is not null and not public._kho_dang_da_xoa_mem(u.ma_dang)
  ),
  ins as (
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
    select v_case, c.ma_dang, 'duyet', c.score, least(c.n, 32767)::smallint from chon c
    on conflict (bo_tro_yeu_id, ma_dang) do nothing
    returning 1
  )
  select count(*) into v_n from ins;

  update bo_tro_de_xuat set trang_thai = 'da_duyet', duyet_boi = public.current_nhan_su_id(), duyet_at = now(),
         case_id = v_case, so_dang = v_n, updated_at = now()
   where id = p_id;
  return jsonb_build_object('case_id', v_case, 'so_dang', v_n);
end $function$;

revoke execute on function public._btk_duyet_chay(uuid) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.fn_btk_duyet(p_id uuid)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v bo_tro_de_xuat;
begin
  select * into v from bo_tro_de_xuat where id = p_id;
  if v.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
  if not public._btk_la_tbm(v.mon, v.khoi) then raise exception 'Chỉ trưởng bộ môn % duyệt được khối %', v.mon, v.khoi using errcode = '42501'; end if;
  return public._btk_duyet_chay(p_id);
end $function$;

-- Đổi mức em đang ở bổ trợ SAU GIỜ (L1) lên L2/L3/L4 — Thùy 12/11
CREATE OR REPLACE FUNCTION public.fn_btnhe_doi_muc(p_hs uuid, p_mon text, p_muc integer)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v bo_tro_de_xuat; v_id uuid; v_r jsonb; v_ca integer;
begin
  if p_muc not in (2, 3, 4) then raise exception 'Chỉ đổi từ sau giờ (L1) lên L2, L3 hoặc L4.'; end if;
  select * into v from bo_tro_de_xuat where hoc_sinh_id = p_hs and mon = p_mon order by tao_at desc limit 1;
  if v.id is null or v.muc <> 1 or v.trang_thai <> 'da_duyet' then raise exception 'Em không đang ở bổ trợ sau giờ (L1) — không đổi mức ở đây.'; end if;
  if not public._btk_la_tk(v.mon, v.khoi) then raise exception 'Không có quyền chốt bổ trợ khối % môn %', v.khoi, v.mon using errcode = '42501'; end if;
  v_id := public.fn_btk_luu(null, p_hs, p_mon, (select array_agg(n->>'ma') from jsonb_array_elements(v.nhom) n), p_muc, v.uu_tien,
                            'Đổi mức từ bổ trợ sau giờ (L1) lên L' || p_muc || case when v.ghi_chu <> '' then ' · ' || v.ghi_chu else '' end);
  update bo_tro_de_xuat set trang_thai = 'cho_duyet', gui_boi = public.current_nhan_su_id(), gui_at = now(), updated_at = now() where id = v_id;
  v_r := public._btk_duyet_chay(v_id);
  -- ca sau giờ còn mở của em (chưa nhập xong): KHÔNG tự huỷ, chỉ báo
  select count(*) into v_ca from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
   where hh.hoc_sinh_id = p_hs and cn.mon = p_mon and cn.trang_thai <> 'huy' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null;
  return v_r || jsonb_build_object('de_xuat_id', v_id, 'muc', p_muc, 'ca_sau_gio_con_mo', v_ca);
end $function$;
revoke execute on function public.fn_btnhe_doi_muc(uuid, text, integer) from public, anon;
grant execute on function public.fn_btnhe_doi_muc(uuid, text, integer) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_btnhe_ds(p_tu date, p_den date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'ca_id', c.id, 'lop_id', c.lop_id, 'ten_lop', l.ten_lop, 'mon', c.mon, 'khoi', c.khoi, 'kieu', c.kieu, 'ngay', c.ngay,
    'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong, 'trang_thai', c.trang_thai,
    'truong_khoi_id', c.truong_khoi_id, 'truong_khoi_ten', tk.ho_ten, 'ta_id', c.ta_id, 'ta_ten', ta.ho_ten,
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
              'buoi_id', b.id, 'buoi_hoc_hs_id', hh.id, 'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs,
              'buoi_trang_thai', b.trang_thai, 'diem_danh', hh.diem_danh, 'danh_gia_xong_at', b.danh_gia_xong_at,
              'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id),
              'co_test', exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'),
              'test_da_nop', exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id
                                     where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop'),
              'ket_qua', y.ket_qua,
              -- Thùy 12/11: em đã được đổi mức (L2/L3/L4) SAU khi ca này tạo ⇒ màn báo "đã chuyển Lx"
              'muc_moi', (select dx.muc from bo_tro_de_xuat dx where dx.hoc_sinh_id = h.id and dx.mon = c.mon and dx.trang_thai = 'da_duyet'
                            and dx.muc <> 1 and dx.duyet_at > c.created_at order by dx.duyet_at desc limit 1)) order by h.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh h on h.id = hh.hoc_sinh_id
           left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
          where b.ca_bo_tro_nhe_id = c.id)
  ) order by c.ngay desc, c.gio_bat_dau desc), '[]'::jsonb)
  from ca_bo_tro_nhe c join lop l on l.id = c.lop_id
  left join nhan_su tk on tk.id = c.truong_khoi_id left join nhan_su ta on ta.id = c.ta_id
  where c.ngay between p_tu and p_den and public.la_thanh_vien()
    and (public._btnhe_duoc_tao(c.mon, c.khoi) or c.truong_khoi_id = public.current_nhan_su_id() or c.ta_id = public.current_nhan_su_id())
$function$;
