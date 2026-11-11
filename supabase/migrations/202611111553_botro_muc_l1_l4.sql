-- ============================================================================
-- 202611111553 — botro_muc_l1_l4
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 11/11, qua phiên "Hoàn thiện phòng làm việc" + trả lời trực tiếp): mức chốt bổ trợ của trưởng khối:
--   "L1: 2 đơn vị bổ trợ · L2: 4 đơn vị · L3: bổ trợ riêng với GV, không dùng vào bổ trợ khối · Bổ trợ sau giờ là 1 nhãn riêng —
--    không liên quan đến bổ trợ khối" → hỏi lại: "Sau giờ là 1 mức … hoặc đổi toàn bộ thành L1234, m xem cái nào OK hơn".
-- CHỌN thang L1–L4 (theo độ nặng), vì GIỮ ĐƯỢC NGHĨA dữ liệu đang có (L1 cũ chính là "trước/sau giờ"):
--     L1 = Sau giờ (TA kèm sau buổi học)        — NGOÀI ca khối, không tính đơn vị khối
--     L2 = 2 đơn vị ca bổ trợ khối
--     L3 = 4 đơn vị ca bổ trợ khối               (= L2 cũ "buổi riêng TA")
--     L4 = Bổ trợ riêng với GV                    — NGOÀI ca khối (= L3 cũ "buổi riêng GV")
--     L0 = không bổ trợ (không có dòng hs_level) — như cũ.
--   (L0 không dùng cho "sau giờ" vì L0 đã nghĩa "dừng bổ trợ"; "L1.2" không lưu được trong cột số nguyên.)
-- Bổ trợ HÌNH (bo_tro_hinh.muc) KHÔNG đổi — thang riêng.
-- Trần 70 em / 20 Cao (fn_btyeu_kiem_suc_chua) KHÔNG đổi — vẫn đếm mọi case (chưa có quyết định tách).
--
-- MẤT GÌ (Luật xoá): không mất dòng nào. ALTER 5 CHECK (nới 0–3 → 0–4, 1–3 → 1–4). UPDATE hs_level (10 dòng mức 2 → 3) +
--   bo_tro_de_xuat (11 dòng mức 2 → 3) để giữ nghĩa; có log cho từng dòng. hs_level_log cũ giữ nguyên số cũ (lịch sử).
-- ============================================================================

-- (1) nới CHECK 0–3 → 0–4 / 1–3 → 1–4
alter table hs_level drop constraint hs_level_level_check, add constraint hs_level_level_check check (level >= 0 and level <= 4);
alter table hs_level_log drop constraint hs_level_log_level_chot_check, add constraint hs_level_log_level_chot_check check (level_chot >= 0 and level_chot <= 4);
alter table hs_level_log drop constraint hs_level_log_level_cu_check, add constraint hs_level_log_level_cu_check check (level_cu >= 0 and level_cu <= 4);
alter table hs_level_log drop constraint hs_level_log_level_may_de_xuat_check, add constraint hs_level_log_level_may_de_xuat_check check (level_may_de_xuat >= 0 and level_may_de_xuat <= 4);
alter table bo_tro_de_xuat drop constraint bo_tro_de_xuat_muc_check, add constraint bo_tro_de_xuat_muc_check check (muc = any (array[1, 2, 3, 4]));

-- (2) dời mức cũ sang thang mới, GIỮ NGHĨA: cũ 2 "buổi riêng TA" (4 đv) → L3 · cũ 3 "buổi riêng GV" → L4 · cũ 1 "trước/sau giờ" giữ L1.
--     Không sửa dòng log cũ (lịch sử bất biến) — thêm 1 dòng log cho mỗi em bị dời, ghi rõ lý do.
insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
select hoc_sinh_id, mon, loai, level, null, jsonb_build_object('nguon', 'doi_thang_l1_l4'), level + 1,
       'Đổi thang mức L1–L4 (Thùy 11/11): giữ nghĩa cũ — L' || level || ' cũ thành L' || (level + 1), null
  from hs_level where level in (2, 3);
update hs_level set level = level + 1, updated_at = now() where level in (2, 3);
update bo_tro_de_xuat set muc = muc + 1 where muc in (2, 3);   -- trigger _log ghi vết từng dòng

-- (3) hàm
CREATE OR REPLACE FUNCTION public._ca_bo_tro_don_vi(p_loai text, p_hs uuid, p_mon text)
 RETURNS smallint
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_loai in ('duoi', 'bu') then 4
              when p_loai = 'hinh' then (case when coalesce((select h.muc from bo_tro_hinh h where h.hoc_sinh_id = p_hs and h.trang_thai = 'dang_xu' order by h.created_at desc limit 1), 1) <= 1 then 1 else 4 end)
              -- Thùy 11/11 thang L1–L4: L1 sau giờ = 1 (ngoài ca khối, giữ số cũ nếu lỡ gắn ca) · L2 = 2 · L3 = 4 · L4 GV riêng = 4 (ngoài ca khối)
              else (case coalesce((select l.level from hs_level l where l.hoc_sinh_id = p_hs and l.mon = p_mon and l.loai = 'kien_thuc'), 1)
                      when 0 then 1 when 1 then 1 when 2 then 2 else 4 end) end::smallint
$function$;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_ung_vien(p_ca uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_con int; v_cho_hs numeric; v_phut int; v_out jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select * into c from ca_bo_tro where id = p_ca;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  select * into t from public._ca_bo_tro_tinh(p_ca);
  v_con := c.don_vi - t.don_vi_dung;
  v_cho_hs := 3 * c.so_ta - public._ca_bo_tro_suc_nguoi(p_ca); -- Thùy 09/10: suất còn lại theo trọng số lớp
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;

  with
  duoi as (
    select d.id as ref_id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, d.created_at,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat') as da_hoc,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) as dang_cho,
           d.so_buoi_du_kien
    from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
    where d.trang_thai = 'can_duoi' and d.dang_duyet_at is not null and l.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.ngay = c.ngay)
  ),
  bu as (
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id join lop l on l.id = b.lop_id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
    where hh.diem_danh in ('vang', 'vang_phep') and b.loai = 'thuong' and b.trang_thai <> 'huy' and l.mon = c.mon and (c.khoi is null or l.khoi = c.khoi)
      and not exists (select 1 from bang_khong_bu k where k.buoi_hoc_hs_id = hh.id)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                      where x.hoc_sinh_id = hh.hoc_sinh_id and x.bu_cho_buoi_id = hh.buoi_hoc_id and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
  ),
  yeu as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id,
           coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 1) as level,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false)) as so_dang
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level in (2, 3)) -- Thùy 11/11: chỉ L2 (2 đv) · L3 (4 đv) vào ca khối; L1 sau giờ · L4 riêng GV không vào khối; L0 = không bổ trợ
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  ),
  hinh as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at, y.muc, y.ly_do,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id
    from bo_tro_hinh y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_hinh_id = y.id and bb.loai = 'bo_tro_hinh' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  )
  select jsonb_build_object(
    'ca', jsonb_build_object('id', c.id, 'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'con', v_con, 'so_hs_xn', t.so_hs_xn, 'cho_hs', v_cho_hs, 'toi_da_hs', 3 * c.so_ta, 'phut', v_phut),
    'duoi', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'duoi', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', case when da_hoc = 0 then 'CHƯA đuổi buổi nào' else 'đã đuổi ' || da_hoc || coalesce('/' || so_buoi_du_kien, '') end || ' · vào ' || to_char(created_at, 'DD/MM') || ' (' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - created_at::date) || ' ngày)',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'da_xep_ngay_khac', dang_cho > 0,
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= 4 and v_cho_hs >= public._bt_trong_so_lop(lop_id) and v_phut >= 60, 'ly_do_khong_vua', case when v_phut < 60 then 'Đuổi cần ca ≥60''' when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by (da_hoc = 0) desc, created_at), '[]'::jsonb) from duoi where so_buoi_du_kien is null or da_hoc + dang_cho < so_buoi_du_kien),
    'bu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= 4 and v_cho_hs >= public._bt_trong_so_lop(lop_id), 'ly_do_khong_vua', case when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon),
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon)) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon)) then 'cần ' || (public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon)) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu),
    'hinh', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'hinh', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when muc <= 1 then 1 else 4 end,
        'chi_tiet', 'Hình L' || muc || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · mở ' || to_char(created_at, 'DD/MM') || coalesce(' · ' || left(ly_do, 60), ''),
        'uu_tien', uu_tien, 'level', muc,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (case when muc <= 1 then 1 else 4 end) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (case when muc <= 1 then 1 else 4 end) then 'cần ' || (case when muc <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from hinh)
  ) into v_out;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_capacity_khoi(p_mon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with lich as (
    select khoi, sum(don_vi)::int dv_lich
    from lich_truc_bo_tro
    where hieu_luc_tu <= current_date and (hieu_luc_den is null or hieu_luc_den >= current_date)
      and (p_mon is null or mon = p_mon) and khoi is not null
    group by khoi),
  cs as (
    select hs.khoi, public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon)::int dv, (y.uu_tien = 3) cao
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and (p_mon is null or y.mon = p_mon)
      -- Thùy 11/11: chỉ L2 · L3 dùng đơn vị khối (L1 sau giờ · L4 riêng GV ngoài khối)
      and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level in (2, 3))
    union all
    select hs.khoi, public._ca_bo_tro_don_vi('hinh', h.hoc_sinh_id, 'Toán')::int, (h.uu_tien = 3)
    from bo_tro_hinh h join hoc_sinh hs on hs.id = h.hoc_sinh_id
    where h.trang_thai = 'dang_xu' and (p_mon is null or p_mon = 'Toán')),
  dung as (select khoi, sum(dv)::int dv, count(*)::int n, count(*) filter (where cao)::int n_cao from cs where khoi is not null group by khoi)
  select coalesce(jsonb_agg(jsonb_build_object(
      'khoi', k.khoi, 'dv_lich', coalesce(l.dv_lich, 0), 'capacity', round(0.4 * coalesce(l.dv_lich, 0), 1),
      'dung', coalesce(d.dv, 0), 'case_n', coalesce(d.n, 0), 'cao_n', coalesce(d.n_cao, 0))
    order by (regexp_replace(k.khoi, '\D', '', 'g'))::int, k.khoi), '[]'::jsonb)
  from (select khoi from lich union select khoi from dung) k
  left join lich l using (khoi) left join dung d using (khoi)
$function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_doi_level(p_case uuid, p_level integer, p_ly_do text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare y record; v_cu integer; v_huy integer := 0; v_rt integer := 0; v_ly text := nullif(trim(coalesce(p_ly_do, '')), '');
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_level not in (0, 1, 2, 3, 4) then raise exception 'Mức phải là 0–4.'; end if;
  select * into y from bo_tro_yeu where id = p_case;
  if y.id is null then raise exception 'Không thấy case.'; end if;
  if y.trang_thai <> 'dang_xu' then raise exception 'Case đã đóng — không đổi mức được.'; end if;
  select coalesce((select level from hs_level where hoc_sinh_id = y.hoc_sinh_id and mon = y.mon and loai = 'kien_thuc'), 0) into v_cu;
  if p_level = v_cu then return jsonb_build_object('level', v_cu, 'khong_doi', true); end if;
  if p_level = 0 and exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                             where hh.bo_tro_yeu_id = p_case and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat') then
    raise exception 'Em đang có ca đã điểm danh có mặt mà chưa đóng — TA hoàn tất ca đó trước rồi mới hạ L0.';
  end if;

  -- Log TRƯỚC (bằng chứng) — cùng khuôn duyetLevel (src/lib/danhgia.ts)
  insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
    values (y.hoc_sinh_id, y.mon, 'kien_thuc', v_cu, null, jsonb_build_object('nguon', 'doi_level_case', 'case_id', p_case), p_level,
            coalesce(v_ly, case when p_level = 0 then 'Hạ L0 — hết yếu, dừng bổ trợ' else 'Đổi mức bổ trợ' end), public.jwt_uid());
  if p_level = 0 then
    delete from hs_level where hoc_sinh_id = y.hoc_sinh_id and mon = y.mon and loai = 'kien_thuc'; -- L0 = không có dòng (§1.5)
    update buoi_hoc b set trang_thai = 'huy', ly_do_huy = 'Hạ L0 — dừng bổ trợ' || coalesce(': ' || v_ly, ''), updated_at = now()
      from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id = p_case and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
        and hh.diem_danh is null;
    get diagnostics v_huy = row_count;
    update bai_test t set trang_thai = 'dong', dong_at = now()
      where t.loai = 'retest' and t.trang_thai = 'mo' and t.hoc_sinh_id = y.hoc_sinh_id
        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = p_case)
        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop');
    get diagnostics v_rt = row_count;
    update bo_tro_yeu set trang_thai = 'hoan_thanh', hoan_thanh_at = now(), ket_qua = 'bo',
      ghi_chu_dong = concat_ws(' — ', 'Hạ L0 (hết yếu, dừng bổ trợ)', v_ly) where id = p_case;
  else
    insert into hs_level (hoc_sinh_id, mon, loai, level, updated_at) values (y.hoc_sinh_id, y.mon, 'kien_thuc', p_level, now())
      on conflict (hoc_sinh_id, mon, loai) do update set level = excluded.level, updated_at = now();
    -- đơn vị của buổi đã xếp chưa học theo mức mới (L1 = 1 · L2+ = 4)
    update buoi_hoc_hs hh set don_vi = public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon)
      from buoi_hoc b where b.id = hh.buoi_hoc_id and hh.bo_tro_yeu_id = p_case and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.don_vi is not null;
  end if;
  return jsonb_build_object('level_cu', v_cu, 'level', p_level, 'buoi_huy', v_huy, 'retest_dong', v_rt, 'dong_case', p_level = 0);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btk_luu(p_id uuid, p_hs uuid, p_mon text, p_nhom text[], p_muc integer, p_uu_tien integer, p_ghi_chu text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_lop record; v_dx bo_tro_de_xuat; v_nhom jsonb; v_id uuid; v_me uuid := public.current_nhan_su_id();
begin
  if p_id is not null then
    select * into v_dx from bo_tro_de_xuat where id = p_id for update;
    if v_dx.id is null then raise exception 'Không thấy dòng bổ trợ.'; end if;
    p_hs := v_dx.hoc_sinh_id; p_mon := v_dx.mon;
  end if;
  select * into v_lop from public._btk_lop_hs(p_hs, p_mon);
  if v_lop.khoi is null then raise exception 'Em không học lớp % nào đang mở.', p_mon; end if;
  if not public._btk_la_tk(p_mon, v_lop.khoi) then raise exception 'Không có quyền đề xuất bổ trợ khối % môn %', v_lop.khoi, p_mon using errcode = '42501'; end if;
  if coalesce(cardinality(p_nhom), 0) = 0 then raise exception 'Chọn ít nhất 1 nhóm.'; end if;
  if p_muc not in (1, 2, 3, 4) or p_uu_tien not in (1, 2, 3) then raise exception 'Mức / ưu tiên không hợp lệ.'; end if;
  -- ảnh chụp nhóm do DB đọc lại (không tin số client gửi); nhóm em chưa đo vẫn nhận (p null)
  select jsonb_agg(jsonb_build_object('ma', x.ma,
           'ten', coalesce(m.ten, nb.ten, hh.ten_bai, x.ma), 'cha', coalesce(m.cha, ch.ten),
           'p', case when m.score is not null then round(100 * m.score)::int end, 'n', m.n, 'muc', m.muc) order by m.score nulls last)
    into v_nhom
    from (select distinct unnest(p_nhom) as ma) x
    left join public._btk_nhom_hs(array[p_hs], p_mon) m on m.ma = x.ma
    left join dai_bdm_nhom nb on nb.id = x.ma left join dai_bdm_chuyen_de ch on ch.id = nb.chuyen_de_id
    left join hinh_hoc_bai hh on hh.ma_bai = x.ma
   where nb.id is not null or hh.ma_bai is not null;
  if v_nhom is null then raise exception 'Nhóm không có trong bản đồ.'; end if;

  if p_id is null then
    if exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai = 'dang_xu') then
      raise exception 'Em đang có case bổ trợ % mở — chờ xong case rồi đề xuất tiếp.', p_mon;
    end if;
    if exists (select 1 from bo_tro_de_xuat where hoc_sinh_id = p_hs and mon = p_mon and trang_thai in ('nhap', 'cho_duyet', 'tra_lai')) then
      raise exception 'Em đã có trong Danh sách bổ trợ — sửa dòng đó.';
    end if;
    insert into bo_tro_de_xuat (hoc_sinh_id, mon, khoi, lop_id, nhom, muc, uu_tien, ghi_chu, tao_boi)
    values (p_hs, p_mon, v_lop.khoi, v_lop.lop_id, v_nhom, p_muc, p_uu_tien, coalesce(p_ghi_chu, ''), v_me)
    returning id into v_id;
    return v_id;
  end if;
  if v_dx.trang_thai not in ('nhap', 'tra_lai') then raise exception 'Dòng đã gửi trưởng bộ môn / đã xử lý — không sửa được.'; end if;
  update bo_tro_de_xuat set nhom = v_nhom, muc = p_muc, uu_tien = p_uu_tien, ghi_chu = coalesce(p_ghi_chu, ''),
         trang_thai = 'nhap', khoi = v_lop.khoi, lop_id = v_lop.lop_id, updated_at = now()
   where id = p_id;
  return p_id;
end $function$;
