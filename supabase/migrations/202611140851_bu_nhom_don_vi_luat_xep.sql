-- ĐƠN VỊ CỦA BÙ THEO NHÓM CÙNG LỚP · CÙNG BUỔI (Thùy 14/11: "học bù cùng lớp cùng buổi thì giảm đơn vị — 1 người 4, 2 người 3 (mỗi người), 3 người 2 (mỗi người)").
-- Màn Lịch phòng báo "LỐ 8/6" khi 2 em 7B1 cùng nghỉ 08/11 xếp chung 1 ca: trước đây MỖI em bù cố định 4. Luật đúng: nhóm = cùng ca + cùng buổi gốc (buoi_hoc_hs.bu_cho_buoi_id);
-- tổng nhóm 1 em = 4 · 2 em = 6 · 3 em = 6 (mỗi em 4 / 3 / 2). 4 em trở lên chưa có luật — tạm 2/em.
-- LÀM: (1) hàm tính đơn vị theo cỡ nhóm; (2) trigger TÍNH LẠI đơn vị lưu của cả nhóm mỗi khi nhóm đổi (em vào · gỡ · vắng · buổi huỷ/đổi ca) — vắng KHÔNG tính vào nhóm
--   (cùng cách _ca_bo_tro_tinh đã loại vắng); (3) fn_ca_bo_tro_xep chặn theo PHẦN TĂNG THÊM của ca (em thứ 2 cùng bài +2, em thứ 3 +0) thay vì cứng 4;
--   (4) fn_ca_bo_tro_ung_vien hiện đơn vị theo nhóm (don_vi) + phần tăng (them_dv); (5) làm lại đơn vị cho các nhóm đang lưu theo luật cũ (bản cũ vào bu_dv_cu_20261114, hoàn lại được).
-- KHÔNG đổi: yếu · đuổi · hình (tính theo từng em); mọi chỗ đọc đơn vị (_ca_bo_tro_tinh, fn_ca_bo_tro_ngay, màn Lấp đầy) tự đúng vì cùng đọc buoi_hoc_hs.don_vi.
-- nới CHECK: bù 2 em/nhóm = 3 đơn vị mỗi em (trước chỉ 1 · 2 · 4)
alter table public.buoi_hoc_hs drop constraint buoi_hoc_hs_don_vi_check;
alter table public.buoi_hoc_hs add constraint buoi_hoc_hs_don_vi_check check (don_vi is null or don_vi = any (array[1, 2, 3, 4]));
create or replace function public._ca_bo_tro_dv_bu_moi_em(p_n bigint) returns smallint language sql immutable as $f$
  select (case when coalesce(p_n, 1) <= 1 then 4 when p_n = 2 then 3 else 2 end)::smallint
$f$;
create or replace function public._ca_bo_tro_dv_bu_nhom(p_n bigint) returns integer language sql immutable as $f$
  select (case when coalesce(p_n, 0) <= 0 then 0 else p_n * public._ca_bo_tro_dv_bu_moi_em(p_n) end)::integer
$f$;
-- số em ĐANG trong nhóm bù (ca × buổi gốc): buổi chưa huỷ, không vắng; p_tru_hs = bỏ em này ra (đang xét thêm/đã nằm sẵn)
create or replace function public._ca_bo_tro_n_bu(p_ca uuid, p_bai uuid, p_tru_hs uuid default null) returns integer language sql stable security definer set search_path to 'public' as $f$
  select count(distinct hh.hoc_sinh_id)::int
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
   where b.ca_bo_tro_id = p_ca and b.loai = 'bu' and b.trang_thai <> 'huy' and hh.bu_cho_buoi_id = p_bai and hh.don_vi is not null
     and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep') and (p_tru_hs is null or hh.hoc_sinh_id <> p_tru_hs)
$f$;
create or replace function public._ca_bo_tro_dv_them_bu(p_ca uuid, p_bai uuid, p_hs uuid) returns integer language sql stable security definer set search_path to 'public' as $f$
  select public._ca_bo_tro_dv_bu_nhom(n + 1) - public._ca_bo_tro_dv_bu_nhom(n) from (select public._ca_bo_tro_n_bu(p_ca, p_bai, p_hs) as n) x
$f$;
-- tính lại đơn vị lưu của MỌI nhóm bù trong 1 ca
create or replace function public._ca_bo_tro_cap_nhat_dv_bu(p_ca uuid) returns void language sql security definer set search_path to 'public' as $f$
  with act as (
    select hh.id, hh.bu_cho_buoi_id as bai, hh.hoc_sinh_id
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
     where b.ca_bo_tro_id = p_ca and b.loai = 'bu' and b.trang_thai <> 'huy' and hh.bu_cho_buoi_id is not null and hh.don_vi is not null
       and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep')),
  n as (select bai, count(distinct hoc_sinh_id) as n from act group by bai)
  update buoi_hoc_hs hh set don_vi = public._ca_bo_tro_dv_bu_moi_em(n.n)
    from act join n on n.bai = act.bai
   where hh.id = act.id and hh.don_vi is distinct from public._ca_bo_tro_dv_bu_moi_em(n.n)
$f$;
revoke all on function public._ca_bo_tro_n_bu(uuid, uuid, uuid), public._ca_bo_tro_dv_them_bu(uuid, uuid, uuid), public._ca_bo_tro_cap_nhat_dv_bu(uuid) from public, anon, authenticated;
grant execute on function public._ca_bo_tro_n_bu(uuid, uuid, uuid), public._ca_bo_tro_dv_them_bu(uuid, uuid, uuid) to authenticated; -- fn_ca_bo_tro_xep / ung_vien gọi trong quyền người dùng

-- trigger: nhóm đổi ⇒ tính lại cả ca
create or replace function public._trg_hh_dv_bu() returns trigger language plpgsql security definer set search_path to 'public' as $f$
declare v uuid;
begin
  if tg_op in ('INSERT', 'UPDATE') and new.bu_cho_buoi_id is not null then
    select b.ca_bo_tro_id into v from buoi_hoc b where b.id = new.buoi_hoc_id and b.loai = 'bu';
    if v is not null then perform public._ca_bo_tro_cap_nhat_dv_bu(v); end if;
  end if;
  if tg_op in ('DELETE', 'UPDATE') and old.bu_cho_buoi_id is not null then
    select b.ca_bo_tro_id into v from buoi_hoc b where b.id = old.buoi_hoc_id and b.loai = 'bu';
    if v is not null then perform public._ca_bo_tro_cap_nhat_dv_bu(v); end if;
  end if;
  return null;
end $f$;
create trigger trg_hh_dv_bu_ins after insert on public.buoi_hoc_hs for each row when (new.bu_cho_buoi_id is not null) execute function public._trg_hh_dv_bu();
create trigger trg_hh_dv_bu_del after delete on public.buoi_hoc_hs for each row when (old.bu_cho_buoi_id is not null) execute function public._trg_hh_dv_bu();
create trigger trg_hh_dv_bu_upd after update of diem_danh, bu_cho_buoi_id, buoi_hoc_id on public.buoi_hoc_hs for each row when (old.bu_cho_buoi_id is not null or new.bu_cho_buoi_id is not null) execute function public._trg_hh_dv_bu();

create or replace function public._trg_buoi_dv_bu() returns trigger language plpgsql security definer set search_path to 'public' as $f$
begin
  if old.ca_bo_tro_id is not null then perform public._ca_bo_tro_cap_nhat_dv_bu(old.ca_bo_tro_id); end if;
  if new.ca_bo_tro_id is not null and new.ca_bo_tro_id is distinct from old.ca_bo_tro_id then perform public._ca_bo_tro_cap_nhat_dv_bu(new.ca_bo_tro_id); end if;
  if new.ca_bo_tro_id is not null and new.ca_bo_tro_id is not distinct from old.ca_bo_tro_id then perform public._ca_bo_tro_cap_nhat_dv_bu(new.ca_bo_tro_id); end if;
  return null;
end $f$;
create trigger trg_buoi_dv_bu after update of ca_bo_tro_id, trang_thai on public.buoi_hoc for each row
  when (new.loai = 'bu' and (old.ca_bo_tro_id is distinct from new.ca_bo_tro_id or old.trang_thai is distinct from new.trang_thai)) execute function public._trg_buoi_dv_bu();

-- ── xếp + ứng viên (dựng lại từ định nghĩa đang chạy)
CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_xep(p_ca uuid, p_loai text, p_hoc_sinh uuid, p_ref uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_buoi uuid; v_bhh uuid; v_dv smallint; v_nguoi uuid; v_lop uuid; v_ta uuid; v_bu_cho uuid; v_phut int; v_delta int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('duoi', 'bu', 'yeu', 'hinh') then raise exception 'Loại phải là duoi | bu | yeu | hinh.'; end if;
  select * into c from ca_bo_tro where id = p_ca for update;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  if c.trang_thai <> 'mo' then raise exception 'Ca đã huỷ.'; end if;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;
  if p_loai = 'duoi' and v_phut < 60 then raise exception 'Bổ trợ đuổi cần đủ 1 tiếng — ca này chỉ % phút.', v_phut; end if;
  v_dv := public._ca_bo_tro_don_vi(p_loai, p_hoc_sinh, c.mon);
  v_delta := v_dv;
  -- Thùy 14/11: BÙ cùng lớp cùng buổi gốc chia đơn vị — 1 em 4 · 2 em 3/em (6) · 3 em 2/em (6). Chặn theo PHẦN TĂNG THÊM của ca; đơn vị lưu cho cả nhóm do trigger tính lại.
  if p_loai = 'bu' then
    select b.id into v_bu_cho from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_ref and hh.hoc_sinh_id = p_hoc_sinh;
    if v_bu_cho is not null then
      v_delta := public._ca_bo_tro_dv_them_bu(p_ca, v_bu_cho, p_hoc_sinh);
      v_dv := public._ca_bo_tro_dv_bu_moi_em(public._ca_bo_tro_n_bu(p_ca, v_bu_cho, p_hoc_sinh) + 1);
    end if;
  end if;
  -- Thùy 24/09: Lộc chốt với PH RỒI mới điền ⇒ xếp = đã chốt ⇒ trừ đơn vị NGAY, chặn luôn lúc xếp (không còn bước "chờ PH / Xác nhận").
  select * into t from public._ca_bo_tro_tinh(p_ca);
  if t.don_vi_dung + v_delta > c.don_vi then raise exception 'Ca chỉ còn % đơn vị, em cần % — ca đã đủ đơn vị.', c.don_vi - t.don_vi_dung, v_delta; end if;

  -- lớp của em (để tìm TA lớp) + kiểm tra ref thuộc đúng em
  if p_loai = 'duoi' then
    select lop_id into v_lop from bo_tro_duoi where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'can_duoi';
    if not found then raise exception 'Đợt đuổi không hợp lệ.'; end if;
  elsif p_loai = 'bu' then
    select b.lop_id, b.id into v_lop, v_bu_cho from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_ref and hh.hoc_sinh_id = p_hoc_sinh;
    if not found then raise exception 'Lần nghỉ không hợp lệ.'; end if;
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.hoc_sinh_id = p_hoc_sinh and x.bu_cho_buoi_id = v_bu_cho and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
      then raise exception 'Lần nghỉ này đã có buổi bù còn hiệu lực.'; end if;
  elsif p_loai = 'yeu' then
    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;
    -- Thùy 12/11: trần TUẦN = đơn vị của mức (L2 = 2 · L3 = 4)
    if public._btyeu_dv_tuan(p_hoc_sinh, c.mon, c.ngay) + v_dv > v_dv then
      raise exception 'Em đã dùng đủ % đơn vị bổ trợ yếu tuần này (mức L%) — không xếp thêm ca khối trong tuần.', v_dv,
        coalesce((select l.level from hs_level l where l.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon and l.loai = 'kien_thuc'), 1);
    end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  else
    if not exists (select 1 from bo_tro_hinh where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case Hình không hợp lệ.'; end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  end if;
  -- Thùy 09/10: suất theo TRỌNG SỐ LỚP (S 0.5 · A 0.75 · B/C 1), 3 suất/TA. Em đã có lượt trong ca này (vd 2 lần bù) không tính thêm.
  if not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where bb.ca_bo_tro_id = p_ca and bb.trang_thai <> 'huy'
                 and x.hoc_sinh_id = p_hoc_sinh and x.don_vi is not null and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
     and public._ca_bo_tro_suc_nguoi(p_ca) + public._bt_trong_so_lop(v_lop) > 3 * c.so_ta then
    raise exception 'Ca hết suất: còn % suất, em cần % (lớp bậc %).', 3 * c.so_ta - public._ca_bo_tro_suc_nguoi(p_ca), public._bt_trong_so_lop(v_lop),
      coalesce((select bac from lop where id = v_lop), '?');
  end if;
  -- người dạy mặc định (câu 6): yếu = người trực; bù/đuổi = TA lớp em nếu đang trực ca này, không thì người trực
  v_ta := case when v_lop is null then null else public._ta_cua_lop(v_lop) end;
  v_nguoi := case when p_loai not in ('yeu', 'hinh') and v_ta is not null and v_ta in (c.nhan_su_id, c.nhan_su_2_id) then v_ta else c.nhan_su_id end;

  if p_loai = 'bu' then
    select id into v_buoi from buoi_hoc where ca_bo_tro_id = p_ca and loai = 'bu' and trang_thai = 'mo' order by created_at limit 1;
  end if;
  if v_buoi is null then
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_id)
    values (case p_loai when 'duoi' then 'bo_tro_duoi' when 'bu' then 'bu' when 'hinh' then 'bo_tro_hinh' else 'bo_tro_yeu' end, null, c.ngay, public._thu_cua_ngay(c.ngay),
            c.gio_bat_dau, c.gio_ket_thuc, c.phong, v_nguoi, 'mo', public.jwt_uid(), p_ca)
    returning id into v_buoi;
  end if;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_duoi_id, bu_cho_buoi_id, bo_tro_yeu_id, bo_tro_hinh_id, don_vi, xac_nhan_ph_at, xac_nhan_boi)
  values (v_buoi, p_hoc_sinh, case when p_loai = 'duoi' then p_ref end, v_bu_cho, case when p_loai = 'yeu' then p_ref end, case when p_loai = 'hinh' then p_ref end, v_dv, now(), public.jwt_uid())
  returning id into v_bhh;
  return jsonb_build_object('buoi_hoc_id', v_buoi, 'bhh_id', v_bhh, 'don_vi', v_dv, 'nguoi_day_tg', v_nguoi);
end $function$;

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
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi, hh.buoi_hoc_id as bai
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
      -- Thùy 12/11: trần TUẦN = đơn vị của mức (L2 = 2 · L3 = 4); đủ thì không hiện ứng viên
      and public._btyeu_dv_tuan(y.hoc_sinh_id, y.mon, c.ngay) + public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon) <= public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon)
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
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop,
        'don_vi', public._ca_bo_tro_dv_bu_moi_em(public._ca_bo_tro_n_bu(p_ca, bai, hoc_sinh_id) + 1), 'them_dv', public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id),
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id) and v_cho_hs >= public._bt_trong_so_lop(lop_id), 'ly_do_khong_vua', case when v_con < public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id) then 'cần ' || public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id) || ' · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
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

-- ── làm lại đơn vị đang lưu theo luật cũ (bản cũ vào bảng lưu — hoàn lại: update buoi_hoc_hs h set don_vi = c.don_vi_cu from bu_dv_cu_20261114 c where c.hh_id = h.id)
create table public.bu_dv_cu_20261114 (hh_id uuid primary key, don_vi_cu smallint not null, luu_at timestamptz not null default now());
alter table public.bu_dv_cu_20261114 enable row level security;
create policy bu_dv_cu_member_read on public.bu_dv_cu_20261114 for select to authenticated using (public.la_thanh_vien());
insert into public.bu_dv_cu_20261114 (hh_id, don_vi_cu)
select act.id, hh.don_vi from (
    select hh.id, b.ca_bo_tro_id as ca, hh.bu_cho_buoi_id as bai, hh.hoc_sinh_id
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
     where b.ca_bo_tro_id is not null and b.loai = 'bu' and b.trang_thai <> 'huy' and hh.bu_cho_buoi_id is not null and hh.don_vi is not null and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep')) act
  join (select ca, bai, count(distinct hoc_sinh_id) as n from (
          select b.ca_bo_tro_id as ca, hh.bu_cho_buoi_id as bai, hh.hoc_sinh_id
            from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
           where b.ca_bo_tro_id is not null and b.loai = 'bu' and b.trang_thai <> 'huy' and hh.bu_cho_buoi_id is not null and hh.don_vi is not null and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep')) q group by ca, bai) g on g.ca = act.ca and g.bai = act.bai
  join buoi_hoc_hs hh on hh.id = act.id
 where hh.don_vi is distinct from public._ca_bo_tro_dv_bu_moi_em(g.n);
select public._ca_bo_tro_cap_nhat_dv_bu(id) from ca_bo_tro;
