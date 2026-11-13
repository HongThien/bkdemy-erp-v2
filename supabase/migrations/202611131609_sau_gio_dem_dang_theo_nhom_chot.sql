-- ============================================================================
-- 202611131609 — sau_gio_dem_dang_theo_nhom_chot
-- VÌ SAO (Thùy 13/11 "Sửa đi"): mig 202611131528 đổi DẠNG IN sau giờ sang "dạng yếu trong nhóm GV đã chốt" (_btnhe_dang_chot), nhưng số "x dạng"
--   ở hàng chờ (fn_btnhe_cho), form khởi tạo (fn_btnhe_hs_duyet), tô em trong lớp (fn_btnhe_lop_hs) và số dạng lưu lúc duyệt L1 (_btk_duyet_chay)
--   vẫn đếm theo luật cũ _sau_gio_dang (mọi dạng yếu của em) ⇒ Thu Giang hàng chờ ghi 12 dạng, in ra 7. Nay cả 4 đếm từ _btnhe_dang_chot.
--   _btk_duyet_chay: đếm sau khi dòng đề xuất đã chuyển da_duyet (đếm trong cùng câu update sẽ ra 0).
-- MẤT GÌ (Luật xoá): không — create or replace 4 hàm. _sau_gio_dang không còn ai gọi (giữ hàm, không xoá).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_btnhe_cho()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
      'de_xuat_id', d.id, 'hoc_sinh_id', d.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'mon', d.mon, 'khoi', d.khoi,
      'lop_id', d.lop_id, 'ten_lop', l.ten_lop, 'nhom', d.nhom, 'uu_tien', d.uu_tien, 'ghi_chu', d.ghi_chu, 'duyet_at', d.duyet_at,
      'so_dang', (select count(*) from public._btnhe_dang_chot(d.hoc_sinh_id, d.mon)))
    order by d.mon, d.khoi, l.ten_lop, h.ho_ten), '[]'::jsonb)
    from bo_tro_de_xuat d join hoc_sinh h on h.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
   where d.trang_thai = 'da_duyet' and d.muc = 1 and public.la_thanh_vien() and not exists (select 1 from ca_bo_tro_nhe cx where cx.lop_id = d.lop_id and cx.trang_thai <> 'huy' and cx.ngay >= public._btnhe_dau_tuan())   /* 12/11: lớp đã khởi tạo tuần này ⇒ rời danh sách */
     and d.id = (select d2.id from bo_tro_de_xuat d2 where d2.hoc_sinh_id = d.hoc_sinh_id and d2.mon = d.mon order by d2.tao_at desc limit 1)   /* đề xuất MỚI NHẤT còn là L1 */ and public._btnhe_duoc_tao(d.mon, d.khoi)
     and not public._btnhe_da_co_tuan(d.hoc_sinh_id, d.mon)   /* 12/11: 1 tuần 1 lần */
$function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_hs_duyet(p_lop uuid)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, cho boolean, duyet_at timestamp with time zone, so_ca_tuan integer, so_dang integer, nhom jsonb, ghi_chu text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare l record; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date;
begin
  select * into l from lop where id = p_lop;
  if l.id is null then raise exception 'Không thấy lớp.'; end if;
  if not public.la_thanh_vien() or not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  return query
  with dx as (
    select distinct on (d.hoc_sinh_id) d.*
      from bo_tro_de_xuat d
      join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
     where d.mon = l.mon
     order by d.hoc_sinh_id, d.tao_at desc
  )
  select h.id, h.ho_ten, h.ma_hs,
         not public._btnhe_da_co_tuan(h.id, l.mon)   /* 12/11: 1 tuần 1 lần */,
         dx.duyet_at,
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         (select count(*)::int from public._btnhe_dang_chot(h.id, l.mon)),
         dx.nhom, dx.ghi_chu
    from dx join hoc_sinh h on h.id = dx.hoc_sinh_id
   where dx.trang_thai = 'da_duyet' and dx.muc = 1
   order by h.ho_ten;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_lop_hs(p_lop uuid, p_ngay date)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, so_dang_yeu integer, dang_yeu text[], so_ca_nhe_tuan integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_mon text; v_khoi text; v_tuan date := date_trunc('week', p_ngay)::date; v_hs uuid[];
begin
  select l.mon, l.khoi into v_mon, v_khoi from lop l where l.id = p_lop;
  if v_mon is null then raise exception 'Không thấy lớp.'; end if;
  if not public._btnhe_duoc_tao(v_mon, v_khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  select array_agg(hl.hoc_sinh_id) into v_hs from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc';
  return query
  with dy as materialized (select x.id as hoc_sinh_id, s.ten_dang, s.score  -- 11/11: cùng luật dạng sau giờ (_sau_gio_dang)
                            from unnest(coalesce(v_hs, '{}'::uuid[])) x(id) cross join lateral public._btnhe_dang_chot(x.id, v_mon) s)
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
           case_id = null, so_dang = (select count(*) from public._btnhe_dang_chot(v.hoc_sinh_id, v.mon)), updated_at = now()
     where id = p_id;
    -- 13/11: đếm SAU khi dòng đã duyệt (_btnhe_dang_chot đọc lượt chốt da_duyet mới nhất)
    update bo_tro_de_xuat set so_dang = (select count(*) from public._btnhe_dang_chot(v.hoc_sinh_id, v.mon)) where id = p_id;
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
