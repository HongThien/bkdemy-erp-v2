-- ============================================================================
-- 202611041646 — ta_don_gia_sua_xoa_va_chup_thong_so
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 04/11: "Phần set đơn giá của đầu việc cần có quyền edit — thêm, sửa, xoá. Tất cả các phần liên quan đến
--   lương phải snapshot mỗi lần chốt, đổi thông số hiện tại không làm thay đổi quá khứ."
--   Trước: ta_don_gia CHỈ THÊM (trigger _ta_don_gia_chi_them chặn sửa/xoá), đổi giá = dòng mới có hiệu lực mới; bản chốt
--   (ta_luong_ky_dong) chụp KẾT QUẢ lương từng TA nhưng KHÔNG chụp thông số đã dùng.
--   Nay:
--   · SỬA (fn_ta_sua_don_gia: giá trị · tên · hiệu lực · ghi chú) và XOÁ MỀM (fn_ta_xoa_don_gia: xoa_at + lý do, dòng ẩn khỏi
--     mọi phép tính) — quyền ghi 'ta_luong'. Mã + khoảng sĩ số (danh tính dòng) không đổi được: muốn mục khác thì thêm dòng mới.
--   · Khoá quá khứ: dòng có hiệu lực ≤ đầu một tháng ĐÃ CHỐT (và chưa mở lại) thì không sửa/xoá được — cả hiệu lực cũ lẫn mới
--     (_ta_don_gia_kiem_sua; thêm mới đã có _ta_don_gia_khoa_ky). Xoá cứng luôn bị chặn.
--   · Mọi thêm/sửa/xoá đơn giá ghi vết cũ/mới + người làm (ta_cong_log qua _ta_cong_ghi_log).
--   · Chốt kỳ chụp ta_luong_ky.thong_so = { don_gia: các dòng đang hiệu lực tại đầu kỳ, loai_viec: toàn bộ loại việc } —
--     bất biến cùng bản chốt (_ta_luong_ky_bat_bien so cả thong_so). Đọc lại: fn_ta_ky_thong_so(kỳ, lần).
--   · fn_ta_don_gia_ds: bảng đơn giá kèm id + cờ khoá (thay fn_ta_bang_don_gia ở màn; hàm cũ giữ nguyên, không xoá).
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. Thay trigger chặn-sửa bằng trigger kiểm-sửa (đổi luật theo yêu cầu Thùy).
-- ============================================================================

alter table public.ta_don_gia add column if not exists xoa_at timestamptz;
alter table public.ta_don_gia add column if not exists xoa_boi uuid references public.nhan_su(id);
alter table public.ta_don_gia add column if not exists ly_do_xoa text;
alter table public.ta_luong_ky add column if not exists thong_so jsonb not null default '{}'::jsonb;

-- Dòng này có đang chi phối một tháng đã chốt không (hiệu lực ≤ đầu tháng đã chốt) ⇒ trả tháng đó
create or replace function public._ta_don_gia_ky_khoa(p_hieu_luc date) returns date
language sql stable security definer set search_path = public as $$
  select max(k.ky) from ta_luong_ky k where k.mo_lai_at is null and k.ky >= p_hieu_luc
$$;
revoke all on function public._ta_don_gia_ky_khoa(date) from public, anon, authenticated;

drop trigger if exists ta_don_gia_chi_them on public.ta_don_gia;
create or replace function public._ta_don_gia_kiem_sua() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_ky date;
begin
  if tg_op = 'DELETE' then raise exception 'Không xoá cứng đơn giá — dùng Xoá (ẩn dòng, giữ lịch sử)'; end if;
  if (new.ma, new.si_tu, new.si_den) is distinct from (old.ma, old.si_tu, old.si_den) then
    raise exception 'Không đổi mã / khoảng sĩ số của dòng đơn giá — thêm dòng mới cho mục khác';
  end if;
  if old.xoa_at is not null then raise exception 'Dòng đơn giá đã xoá — không sửa được'; end if;
  v_ky := coalesce(public._ta_don_gia_ky_khoa(old.hieu_luc_tu), public._ta_don_gia_ky_khoa(new.hieu_luc_tu));
  if v_ky is not null then
    raise exception 'Dòng này đang dùng cho tháng % đã chốt lương — không sửa/xoá (mở lại kỳ, hoặc thêm giá mới có hiệu lực sau tháng đó)',
      to_char(v_ky, 'MM/YYYY');
  end if;
  return new;
end $$;
create trigger ta_don_gia_kiem_sua before update or delete on public.ta_don_gia
  for each row execute function public._ta_don_gia_kiem_sua();
drop trigger if exists ta_don_gia_log on public.ta_don_gia;
create trigger ta_don_gia_log after insert or update on public.ta_don_gia
  for each row execute function public._ta_cong_ghi_log();

create or replace function public.fn_ta_sua_don_gia(p_id uuid, p_gia numeric, p_hieu_luc_tu date, p_ten text default null, p_ghi_chu text default null)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền sửa đơn giá'; end if;
  if p_gia is null or p_gia < 0 then raise exception 'Giá trị phải ≥ 0'; end if;
  update ta_don_gia set gia_tri = p_gia, hieu_luc_tu = coalesce(p_hieu_luc_tu, hieu_luc_tu),
         ten = coalesce(nullif(btrim(p_ten), ''), ten), ghi_chu = coalesce(p_ghi_chu, ghi_chu)
   where id = p_id;
  if not found then raise exception 'Không thấy dòng đơn giá'; end if;
end $$;
revoke all on function public.fn_ta_sua_don_gia(uuid, numeric, date, text, text) from public, anon;
grant execute on function public.fn_ta_sua_don_gia(uuid, numeric, date, text, text) to authenticated;

create or replace function public.fn_ta_xoa_don_gia(p_id uuid, p_ly_do text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền xoá đơn giá'; end if;
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Xoá đơn giá phải ghi lý do'; end if;
  update ta_don_gia set xoa_at = now(), xoa_boi = public.current_nhan_su_id(), ly_do_xoa = btrim(p_ly_do)
   where id = p_id and xoa_at is null;
  if not found then raise exception 'Không thấy dòng đơn giá (hoặc đã xoá)'; end if;
end $$;
revoke all on function public.fn_ta_xoa_don_gia(uuid, text) from public, anon;
grant execute on function public.fn_ta_xoa_don_gia(uuid, text) to authenticated;

create or replace function public.fn_ta_don_gia_ds(p_ngay date default null)
returns table (id uuid, ma text, ten text, si_tu integer, si_den integer, gia_tri numeric, don_vi text, hieu_luc_tu date,
               dang_hieu_luc boolean, ghi_chu text, nguoi_dat text, dat_at timestamptz, khoa_ky date)
language plpgsql stable security definer set search_path = public as $$
declare v_ngay date := coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date);
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem đơn giá'; end if;
  return query
  select d.id, d.ma, d.ten, d.si_tu, d.si_den, d.gia_tri, d.don_vi, d.hieu_luc_tu,
         d.hieu_luc_tu = (select max(d2.hieu_luc_tu) from ta_don_gia d2
                           where d2.ma = d.ma and coalesce(d2.si_tu, -1) = coalesce(d.si_tu, -1) and d2.hieu_luc_tu <= v_ngay and d2.xoa_at is null),
         d.ghi_chu, n.ho_ten, d.tao_at, public._ta_don_gia_ky_khoa(d.hieu_luc_tu)
    from ta_don_gia d left join nhan_su n on n.id = d.tao_boi
   where d.xoa_at is null
   order by d.ma, d.si_tu nulls first, d.hieu_luc_tu desc;
end $$;
revoke all on function public.fn_ta_don_gia_ds(date) from public, anon;
grant execute on function public.fn_ta_don_gia_ds(date) to authenticated;

-- Thông số lương của một kỳ (đơn giá đang hiệu lực tại đầu kỳ + loại việc) — dùng lúc chốt
create or replace function public._ta_thong_so_ky(p_ky date) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'chup_at', now(),
    'don_gia', coalesce((select jsonb_agg(jsonb_build_object('ma', x.ma, 'ten', x.ten, 'si_tu', x.si_tu, 'si_den', x.si_den,
                                   'gia_tri', x.gia_tri, 'don_vi', x.don_vi, 'hieu_luc_tu', x.hieu_luc_tu) order by x.ma, x.si_tu nulls first)
                         from (select distinct on (d.ma, coalesce(d.si_tu, -1)) d.*
                                 from ta_don_gia d
                                where d.xoa_at is null and d.hieu_luc_tu <= date_trunc('month', p_ky)::date
                                order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc) x), '[]'::jsonb),
    'loai_viec', coalesce((select jsonb_agg(to_jsonb(l) order by l.thu_tu, l.ma) from ta_loai_viec l), '[]'::jsonb))
$$;
revoke all on function public._ta_thong_so_ky(date) from public, anon, authenticated;

create or replace function public.fn_ta_ky_thong_so(p_ky date, p_lan integer default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem bản chốt'; end if;
  select k.thong_so || jsonb_build_object('lan', k.lan, 'chot_at', k.chot_at) into v
    from ta_luong_ky k where k.ky = date_trunc('month', p_ky)::date and (p_lan is null or k.lan = p_lan)
   order by k.lan desc limit 1;
  return v;
end $$;
revoke all on function public.fn_ta_ky_thong_so(date, integer) from public, anon;
grant execute on function public.fn_ta_ky_thong_so(date, integer) to authenticated;

CREATE OR REPLACE FUNCTION public._ta_doi_chieu(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date, vao_at timestamp with time zone, ra_at timestamp with time zone, vao_chot timestamp with time zone, ra_chot timestamp with time zone, quen_ra boolean, khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, hoc_sinh text, ghi_chu text, khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_den date := coalesce(p_den, p_tu);
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  return query
  -- CA CÓ MẶT
  select 'ca'::text, cc.id, cc.id, cc.nhan_su_id, ns.ho_ten, cc.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         (cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay),
         cc.khai_bu, cc.nguon, null::text, null::text, null::uuid, null::text, null::time, null::time, null::text, ''::text,
         null::boolean,
         array_remove(array[
           case when cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay then 'quen_ra' end,
           case when cc.khai_bu then 'khai_bu' end,
           case when cc.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when not exists (select 1 from ta_cong_viec v where v.cham_cong_id = cc.id and v.trang_thai <> 'tu_choi') then 'ca_khong_viec' end
         ], null),
         null::text, cc.duyet, cc.ly_do_duyet
    from ta_cham_cong cc join nhan_su ns on ns.id = cc.nhan_su_id
   where cc.ngay between p_tu and v_den and (p_ns is null or cc.nhan_su_id = p_ns)
  union all
  -- VIỆC
  select 'viec'::text, cv.id, cv.cham_cong_id, cv.nhan_su_id, ns.ho_ten, cv.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         false, cv.khai_bu, cv.nguon, cv.loai_viec, lv.ten, cv.lop_id, l.ten_lop, cv.gio_bat_dau, cv.gio_ket_thuc, cv.hoc_sinh, cv.ghi_chu,
         kq.khop,
         array_remove(array[
           case when lv.tinh_vao = 'tg' and not kq.khop and exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong' and b.trang_thai = 'huy') then 'buoi_huy' end,
           case when lv.tinh_vao = 'tg' and not exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong') then 'khong_co_buoi' end,
           case when lv.tinh_vao = 'tg' and exists (select 1 from ta_cong_viec o join ta_loai_viec lo on lo.ma = o.loai_viec
                        where o.lop_id = cv.lop_id and o.ngay = cv.ngay and lo.tinh_vao = 'tg' and o.trang_thai <> 'tu_choi'
                          and o.nhan_su_id <> cv.nhan_su_id) then 'hai_ta_cung_buoi' end,
           case when cc.id is not null and cv.gio_bat_dau is not null
                     and cv.gio_bat_dau < (coalesce(cc.vao_chot, cc.vao_at) at time zone 'Asia/Ho_Chi_Minh')::time - interval '15 minutes' then 'truoc_gio_vao' end,
           case when cc.id is not null and cv.gio_ket_thuc is not null and coalesce(cc.ra_chot, cc.ra_at) is not null
                     and cv.gio_ket_thuc > (coalesce(cc.ra_chot, cc.ra_at) at time zone 'Asia/Ho_Chi_Minh')::time + interval '15 minutes' then 'sau_gio_ra' end,
           case when cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null and exists (select 1 from ta_cong_viec o
                        where o.nhan_su_id = cv.nhan_su_id and o.ngay = cv.ngay and o.id <> cv.id and o.trang_thai <> 'tu_choi'
                          and o.gio_bat_dau < cv.gio_ket_thuc and o.gio_ket_thuc > cv.gio_bat_dau) then 'trung_gio' end,
           case when cv.gio_bat_dau < time '07:00' or cv.gio_ket_thuc > time '22:30' then 'ngoai_gio' end,
           case when lv.don_vi = 'gio' and (cv.gio_bat_dau is null or cv.gio_ket_thuc is null) then 'thieu_gio' end,
           case when lv.nhom = 'ngoai_package' and not exists (select 1 from ta_don_gia d where d.ma = 'gia_' || lv.ma and d.hieu_luc_tu <= cv.ngay and d.xoa_at is null) then 'chua_don_gia' end,
           case when cv.khai_bu then 'khai_bu' end,
           case when cv.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when cc.id is not null and cc.duyet = 'tu_choi' then 'ca_bi_tu_choi' end,
           -- trợ giảng ở lớp mà NGÀY ĐÓ chưa có TA nào được phân công
           case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                     and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id)) then 'lop_chua_co_ta' end
         ], null),
         case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                   and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id, cv.nhan_su_id))
                then (select n2.ho_ten from public._ta_tg_tai(cv.ngay, cv.lop_id) t join nhan_su n2 on n2.id = t.nhan_su_id
                       order by t.la_chinh desc, n2.ho_ten limit 1)
              when cv.ca_bo_tro_id is not null and not exists (select 1 from ca_bo_tro c where c.id = cv.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))
                then (select n2.ho_ten from ca_bo_tro c join nhan_su n2 on n2.id = c.nhan_su_id where c.id = cv.ca_bo_tro_id)
         end,
         cv.trang_thai, cv.ly_do_duyet
    from ta_cong_viec cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    join nhan_su ns on ns.id = cv.nhan_su_id
    left join lop l on l.id = cv.lop_id
    left join ta_cham_cong cc on cc.id = cv.cham_cong_id
    cross join lateral (select case
        when lv.tinh_vao = 'tg' then exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                                              and b.loai = 'thuong' and b.trang_thai <> 'huy')
        when cv.loai_viec = 'bo_tro_dinh_ki' then exists (select 1 from ca_bo_tro c where c.ngay = cv.ngay and c.trang_thai = 'mo'
                                              and (c.id = cv.ca_bo_tro_id or cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
        when cv.loai_viec in ('bo_tro_bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_on_thi') then exists (
              select 1 from buoi_hoc b
               where b.ngay = cv.ngay and b.trang_thai <> 'huy'
                 and b.loai = any (case cv.loai_viec when 'bo_tro_bu' then array['bu'] when 'bo_tro_on_thi' then array['bo_tro_on_thi'] when 'bo_tro_yeu' then array['bo_tro_yeu', 'bo_tro_hinh'] else array['bo_tro_duoi'] end)
                 and (b.id = cv.buoi_hoc_id or b.nguoi_day = cv.nhan_su_id
                      or exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
                 and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'))
        when lv.tinh_vao = 'trong_thi' then exists (select 1 from buoi_hoc b join ky_thi kt on kt.buoi_hoc_id = b.id
                                              where b.lop_id = cv.lop_id and b.ngay = cv.ngay)
        else false end as khop) kq
   where cv.ngay between p_tu and v_den and (p_ns is null or cv.nhan_su_id = p_ns)
   order by 6, 5, 1, 18 nulls first;
end $function$;

CREATE OR REPLACE FUNCTION public._ta_ky_tinh_trang(p_ky date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ky date := date_trunc('month', p_ky)::date;
        v_den date := (date_trunc('month', p_ky) + interval '1 month' - interval '1 day')::date;
        v_han int; v_mo_tu timestamptz; v_dot timestamptz;
        v_ca int; v_viec int; v_quen int; k ta_luong_ky; v_moc date := public._ta_moc_cham_cong();
begin
  v_han := coalesce((select d.gia_tri::int from ta_don_gia d where d.ma = 'han_duyet_ngay' and d.hieu_luc_tu <= v_ky and d.xoa_at is null
                      order by d.hieu_luc_tu desc limit 1), 3);
  -- chốt được từ 00:00 ngày (hạn + 1) tháng sau, giờ VN; đợt khai lùi phủ kỳ này có hạn muộn hơn thì theo đợt
  v_mo_tu := ((v_ky + interval '1 month' + make_interval(days => v_han))::timestamp at time zone 'Asia/Ho_Chi_Minh');
  select max(d.han) into v_dot from ta_dot_khai_bu d where d.tu <= v_den and d.den >= v_ky;
  if v_dot is not null and v_dot > v_mo_tu then v_mo_tu := v_dot; end if;
  select count(*) into v_ca from ta_cham_cong c where c.ngay between v_ky and v_den and c.duyet = 'cho_duyet';
  select count(*) into v_viec from ta_cong_viec v where v.ngay between v_ky and v_den and v.trang_thai = 'cho_duyet';
  select count(*) into v_quen from ta_cham_cong c where c.ngay between v_ky and v_den and c.ra_at is null and c.ra_chot is null and c.duyet <> 'tu_choi';
  select * into k from ta_luong_ky where ky = v_ky and mo_lai_at is null;
  return jsonb_build_object(
    'ky', v_ky, 'da_chot', k.id is not null, 'lan', k.lan, 'chot_at', k.chot_at,
    'chot_boi', (select ho_ten from nhan_su where id = k.chot_boi), 'so_ta', k.so_ta, 'tong_net', k.tong_net,
    'mo_chot_tu', v_mo_tu, 'cho_duyet_ca', v_ca, 'cho_duyet_viec', v_viec, 'quen_checkout', v_quen,
    'moc_cham_cong', v_moc, 'truoc_moc', v_den < v_moc,
    'co_the_chot', k.id is null and v_den >= v_moc and now() >= v_mo_tu and v_ca + v_viec + v_quen = 0,
    'lich_su', coalesce((select jsonb_agg(jsonb_build_object('lan', h.lan, 'chot_at', h.chot_at,
                   'chot_boi', (select ho_ten from nhan_su where id = h.chot_boi), 'tong_net', h.tong_net, 'so_ta', h.so_ta,
                   'ghi_chu', h.ghi_chu, 'mo_lai_at', h.mo_lai_at, 'mo_lai_boi', (select ho_ten from nhan_su where id = h.mo_lai_boi),
                   'ly_do_mo_lai', h.ly_do_mo_lai) order by h.lan desc)
                 from ta_luong_ky h where h.ky = v_ky), '[]'::jsonb));
end $function$;

CREATE OR REPLACE FUNCTION public._ta_luong_tinh(p_ky date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric, ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
with
k as (
  select date_trunc('month', p_ky)::date as tu,
         (date_trunc('month', p_ky)::date + interval '1 month' - interval '1 day')::date as den
),
cv_ok as (   -- việc được tính lương: đã duyệt VÀ ca có mặt của nó đã duyệt (việc nhập hộ / nạp cũ không gắn ca: chỉ cần việc đã duyệt)
  select cv.* from ta_cong_viec cv, k
   where cv.ky = k.tu and cv.trang_thai = 'da_duyet'
     and (cv.cham_cong_id is null
          or exists (select 1 from ta_cham_cong cc where cc.id = cv.cham_cong_id and cc.duyet = 'da_duyet'))
),
dg as (   -- đơn giá đang hiệu lực tại đầu kỳ (dòng mới nhất có hieu_luc_tu <= đầu kỳ)
  select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
    from ta_don_gia d, k where d.hieu_luc_tu <= k.tu and d.xoa_at is null
   order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
),
cfg as (
  select (select gia_tri from dg where ma = 'he_so_tg')            as w_tg,
         (select gia_tri from dg where ma = 'he_so_btvn')          as w_btvn,
         (select gia_tri from dg where ma = 'he_so_bo_tro')        as w_bt,
         (select gia_tri from dg where ma = 'chi_tieu_bo_tro_gio') as chi_tieu,
         (select gia_tri from dg where ma = 'btvn_lop_8_buoi')     as btvn_8,
         (select gia_tri from dg where ma = 'btvn_lop_4_buoi')     as btvn_4
),
ta_sel as (
  select x.nhan_su_id from (
    select pk.nhan_su_id from public._ta_pc_khoang() pk, k where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
    union
    select cv.nhan_su_id from cv_ok cv
  ) x where p_ns is null or x.nhan_su_id = p_ns
),
lop_cua as (
  -- Lớp thuộc về TA được phân công (la_chu) giữ BTVN + chỉ tiêu bổ trợ + bậc lương, kể cả khi nhờ người dạy hộ.
  -- Lớp TA có công TG mà không được phân công = dạy hộ: tiền TG của buổi đó đi theo người dạy (CEO 12/10).
  select x.nhan_su_id, x.lop_id, bool_or(x.chu) as la_chu, bool_or(x.la_chinh) as la_chinh
    from (
      -- Lớp chủ = được phân công vào BẤT KỲ NGÀY NÀO trong kỳ (theo log): phân công SAU kỳ không tính vào kỳ này
      -- (Tùng 6A3, Vân Anh 7S3 phân 11–12/10); TA bị rút giữa kỳ vẫn giữ lớp cho kỳ đó (Thùy 14/10).
      select pk.nhan_su_id, pk.lop_id, true as chu,
             coalesce((select lg.la_chinh from phan_cong_lop_log lg
                        where lg.nhan_su_id = pk.nhan_su_id and lg.lop_id = pk.lop_id and lg.vai_tro = 'tg'
                          and lg.hanh_dong in ('them', 'doi_chinh') and (lg.ts at time zone 'Asia/Ho_Chi_Minh')::date <= k.den
                        order by lg.ts desc limit 1), false) as la_chinh
        from public._ta_pc_khoang() pk join ta_sel s on s.nhan_su_id = pk.nhan_su_id, k
       where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
      union all
      select cv.nhan_su_id, cv.lop_id, false, false
        from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
        join ta_sel s on s.nhan_su_id = cv.nhan_su_id
       where lv.tinh_vao = 'tg' and cv.lop_id is not null
    ) x
   group by x.nhan_su_id, x.lop_id
),
lop_stat as (
  select lc.nhan_su_id, lc.lop_id, l.ten_lop, lc.la_chu, lc.la_chinh,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
        and b.ngay between k.tu and k.den)::int as so_buoi,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong'
        and b.ngay between k.tu and k.den)::int as so_buoi_lich,
    -- BTVN thật (CEO 12/10): buổi lớp mình mà CHÍNH TA này đã chấm (gami_grades.graded_by → tai_khoan → nhan_su)
    -- trong hạn duyệt của kỳ. Buổi MT/thi không có câu BTVN ⇒ không có dòng chấm ⇒ không tính;
    -- BTVN online TA chưa chấm (hoặc chấm sau hạn) ⇒ không tính.
    (select count(*) from buoi_hoc b, k
      where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between k.tu and k.den
        and exists (select 1 from gami_session_problems p
                      join gami_grades g on g.problem_id = p.id and g.buoi_hoc_id = b.id
                      join tai_khoan tk on tk.id = g.graded_by
                     where p.buoi_hoc_id = b.id and p.phase = 'btvn' and not p.hidden and tk.nhan_su_id = lc.nhan_su_id
                       and g.graded_at < ((k.tu + interval '1 month')
                             + make_interval(days => coalesce((select gia_tri::int from dg where ma = 'han_duyet_ngay'), 3)))
                             ::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int as btvn_lam,
    (select avg(x.c) from k, generate_series(k.tu, k.den, interval '1 day') d(d),
        lateral (select count(*)::int as c from hoc_sinh_lop h
                  where h.lop_id = lc.lop_id and h.ngay_vao <= d.d::date
                    and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x) as si_tb,
    -- TG: từ CHẤM CÔNG đã duyệt (K2), theo ngày. Trông thi ở LỚP MÌNH nằm trong công TG: cùng ngày chỉ tính
    -- một lần vào TG (không trả tiền trông thi riêng — xem ngoai_dong), kể cả khi hôm đó chỉ có dòng trông thi.
    (select count(distinct cv.ngay) from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
      where cv.nhan_su_id = lc.nhan_su_id and cv.lop_id = lc.lop_id
        and lv.tinh_vao in ('tg', 'trong_thi'))::int as tg_lam
    from lop_cua lc join lop l on l.id = lc.lop_id
),
lop_bac as (
  select ls.*, coalesce(
      (select b.gia_tri from dg b
        where b.ma = 'bac_luong'
          and round(coalesce(ls.si_tb, 0))::int >= b.si_tu
          and (b.si_den is null or round(coalesce(ls.si_tb, 0))::int <= b.si_den)
        order by b.si_tu desc limit 1),
      (select min(gia_tri) from dg where ma = 'bac_luong')) as luong
    from lop_stat ls
),
chinh as (
  select distinct on (lb.nhan_su_id) lb.nhan_su_id, lb.lop_id as chinh_lop, lb.ten_lop as chinh_ten, lb.luong as chinh_luong
    from lop_bac lb
   -- lớp chính = lớp TA THỰC SỰ có công TG (bằng chứng), rồi mới tới cờ la_chinh trong phân công
   order by lb.nhan_su_id, lb.la_chu desc, (lb.tg_lam > 0) desc, lb.la_chinh desc, lb.luong desc, lb.ten_lop
),
lop_tien as (
  select lb.*, lb.tg_lam as tg_tinh,
         case when lb.so_buoi_lich <= 5 then c.btvn_4 else c.btvn_8 end as btvn_dm,
         c.w_tg, c.w_btvn
    from lop_bac lb, cfg c
),
lop_kq as (
  select lt.*,
         case when lt.so_buoi > 0 then lt.tg_tinh::numeric / lt.so_buoi else 0 end as ti_le_tg,
         case when lt.btvn_dm > 0 then lt.btvn_lam::numeric / lt.btvn_dm else 0 end as ti_le_btvn
    from lop_tien lt
),
lop_tong as (
  select lk.nhan_su_id,
         sum(round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn)))::numeric as tien,
         -- Lớp chủ chỉ vào chỉ tiêu bổ trợ khi TA CÓ HOẠT ĐỘNG ở lớp đó trong kỳ (có công TG hoặc đã chấm BTVN).
         -- Chặn phân công "treo" (phụ, chưa làm gì) làm tăng chỉ tiêu oan; sau này chấm công thay hẳn bước này.
         (count(*) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)))::int as n_chu,
         coalesce(sum(lk.luong) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)), 0)::numeric as sum_bac_chu,
         (count(*) filter (where lk.tg_lam > 0))::int as n_lop_tg,
         coalesce(sum(lk.luong) filter (where lk.tg_lam > 0), 0)::numeric as sum_bac_tg,
         coalesce(sum(lk.tg_lam) filter (where not lk.la_chu), 0)::int as tg_ho,
         jsonb_agg(jsonb_build_object(
           'lop', lk.ten_lop, 'la_chu', lk.la_chu, 'co_hoat_dong', (lk.tg_lam > 0 or lk.btvn_lam > 0), 'si_tb', round(lk.si_tb::numeric, 2), 'bac', lk.luong,
           'tg_lam', lk.tg_tinh, 'so_buoi', lk.so_buoi, 'ti_le_tg', round(lk.ti_le_tg, 4),
           'btvn_lam', lk.btvn_lam, 'btvn_dinh_muc', lk.btvn_dm, 'ti_le_btvn', round(lk.ti_le_btvn, 4),
           'tien', round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn))) order by lk.ten_lop) as ds
    from lop_kq lk group by lk.nhan_su_id
),
bo as (
  select cv.nhan_su_id,
         sum(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric as gio
    from cv_ok cv join ta_loai_viec lv on lv.ma = cv.loai_viec
   where lv.tinh_vao = 'bo_tro'
     and cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null
   group by cv.nhan_su_id
),
ngoai_dong as (
  select cv.nhan_su_id, lv.ma as loai, cv.ngay, l.ten_lop,
         case lv.don_vi when 'gio' then coalesce(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0, 0)
                        else 1 end as so_luong,
         (select gia_tri from dg where dg.ma = 'gia_' || lv.ma) as don_gia
    from cv_ok cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    left join lop l on l.id = cv.lop_id
   where lv.nhom = 'ngoai_package'
     -- trông thi lớp mình nằm trong công TG, không tính riêng
     and not (lv.tinh_vao = 'trong_thi' and exists (
            select 1 from lop_cua lc where lc.nhan_su_id = cv.nhan_su_id and lc.lop_id = cv.lop_id))
),
ngoai as (
  select nd.nhan_su_id,
         sum(round(nd.so_luong * coalesce(nd.don_gia, 0)))::numeric as tien,
         jsonb_agg(jsonb_build_object('loai', nd.loai, 'ngay', nd.ngay, 'lop', nd.ten_lop,
                   'so_luong', round(nd.so_luong::numeric, 2), 'don_gia', nd.don_gia,
                   'thieu_don_gia', nd.don_gia is null) order by nd.ngay) as ds
    from ngoai_dong nd group by nd.nhan_su_id
),
ket as (
  select s.nhan_su_id,
         coalesce(lt.tien, 0) as package_lop,
         coalesce(bo.gio, 0) as bo_tro_gio,
         -- Mỗi lớp có phần bổ trợ riêng (8 giờ, 40% bậc lớp ấy): chỉ tiêu = 8 × số lớp được phân công (không có thì
         -- theo lớp có TG); tiền = 0,4 × giờ ÷ chỉ tiêu × Σ bậc các lớp đó. Giờ dùng chung, không gắn lớp.
         case when n_bt.n = 0 then 0
              else round(c.w_bt * coalesce(bo.gio, 0) / nullif(c.chi_tieu * n_bt.n, 0) * n_bt.bac) end as bo_tro_tien,
         n_bt.n as n_lop_bt,
         n_bt.bac as bac_bt,
         coalesce(ng.tien, 0) as ngoai_package,
         coalesce((select g.tien_phat from gay_chot_thang g, k where g.ky = k.tu and g.nhan_su_id = s.nhan_su_id), 0) as tien_phat,
         lt.ds as ds_lop, ng.ds as ds_ngoai, ch.chinh_ten, ch.chinh_luong,
         coalesce(lt.tg_ho, 0) as day_thay, c.chi_tieu
    from ta_sel s
    left join lop_tong lt on lt.nhan_su_id = s.nhan_su_id
    left join chinh ch on ch.nhan_su_id = s.nhan_su_id
    left join bo on bo.nhan_su_id = s.nhan_su_id
    left join ngoai ng on ng.nhan_su_id = s.nhan_su_id, cfg c
    cross join lateral (
      select case when coalesce(lt.n_chu, 0) > 0 then lt.n_chu else coalesce(lt.n_lop_tg, 0) end as n,
             case when coalesce(lt.n_chu, 0) > 0 then lt.sum_bac_chu else coalesce(lt.sum_bac_tg, 0) end as bac) n_bt
)
select kt.nhan_su_id, n.ho_ten, kt.package_lop, round(kt.bo_tro_gio, 2), kt.bo_tro_tien, kt.ngoai_package,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package,
       kt.tien_phat,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package - kt.tien_phat,
       jsonb_build_object('lop', coalesce(kt.ds_lop, '[]'::jsonb),
                          'bo_tro', jsonb_build_object('gio', round(kt.bo_tro_gio, 2),
                                    'so_lop', kt.n_lop_bt, 'chi_tieu_moi_lop', kt.chi_tieu,
                                    'chi_tieu', kt.chi_tieu * kt.n_lop_bt,
                                    'ti_le', round(kt.bo_tro_gio / nullif(kt.chi_tieu * kt.n_lop_bt, 0), 4),
                                    'tong_bac', kt.bac_bt, 'lop_chinh', kt.chinh_ten, 'tien', kt.bo_tro_tien),
                          'ngoai_package', coalesce(kt.ds_ngoai, '[]'::jsonb),
                          'day_thay', kt.day_thay,
                          'tien_phat', kt.tien_phat)
  from ket kt join nhan_su n on n.id = kt.nhan_su_id
 where (p_ns is not null or kt.package_lop + kt.bo_tro_tien + kt.ngoai_package + kt.tien_phat <> 0)
   -- Thùy 15/10: GV kiêm TA KHÔNG nhận lương TA — từ tháng có chấm công trên ERP (tháng 9 trở về giữ nguyên)
   and not (p_ky >= public._ta_moc_cham_cong() and public._la_gv_kiem_ta(kt.nhan_su_id))
 order by n.ho_ten
$function$;

CREATE OR REPLACE FUNCTION public.fn_ta_dat_don_gia(p_ma text, p_gia numeric, p_hieu_luc_tu date, p_ten text DEFAULT NULL::text, p_si_tu integer DEFAULT NULL::integer, p_si_den integer DEFAULT NULL::integer, p_ghi_chu text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid; v_ten text; v_dv text;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền đổi đơn giá'; end if;
  select d.ten, d.don_vi into v_ten, v_dv from ta_don_gia d where d.ma = p_ma and d.xoa_at is null order by d.hieu_luc_tu desc limit 1;
  v_ten := coalesce(p_ten, v_ten, p_ma);
  insert into ta_don_gia (ma, ten, gia_tri, don_vi, si_tu, si_den, hieu_luc_tu, ghi_chu, tao_boi)
  values (p_ma, v_ten, p_gia, coalesce(v_dv, ''), p_si_tu, p_si_den, p_hieu_luc_tu, coalesce(p_ghi_chu, ''), public.current_nhan_su_id())
  returning id into v_id;
  return v_id;
end $function$;

CREATE OR REPLACE FUNCTION public._ta_luong_ky_bat_bien()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if tg_table_name = 'ta_luong_ky_dong' or tg_op = 'DELETE' then
    raise exception 'Bản chốt lương bất biến — mở lại kỳ rồi chốt lần mới';
  end if;
  if old.mo_lai_at is not null or new.mo_lai_at is null
     or (new.id, new.ky, new.lan, new.chot_at, new.chot_boi, new.ghi_chu, new.so_ta, new.tong_net, new.thong_so)
        is distinct from (old.id, old.ky, old.lan, old.chot_at, old.chot_boi, old.ghi_chu, old.so_ta, old.tong_net, old.thong_so) then
    raise exception 'Bản chốt lương bất biến — chỉ được ghi mở lại một lần';
  end if;
  return new;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ta_chot_ky(p_ky date, p_ghi_chu text DEFAULT ''::text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ky date := date_trunc('month', p_ky)::date; t jsonb; v_rows jsonb; v_id uuid; v_lan int;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền chốt lương'; end if;
  perform pg_advisory_xact_lock(hashtext('ta_chot_ky'), extract(epoch from v_ky)::int);   -- hai người bấm cùng lúc
  t := public._ta_ky_tinh_trang(v_ky);
  if (t->>'da_chot')::boolean then raise exception 'Tháng % đã chốt (lần %)', to_char(v_ky, 'MM/YYYY'), t->>'lan'; end if;
  if (t->>'truoc_moc')::boolean then
    raise exception 'Tháng % trước khi có chấm công trên ERP (bắt đầu %) — lương tháng này tính ngoài ERP, không chốt ở đây',
      to_char(v_ky, 'MM/YYYY'), to_char((t->>'moc_cham_cong')::date, 'DD/MM/YYYY');
  end if;
  if now() < (t->>'mo_chot_tu')::timestamptz then
    raise exception 'Chưa hết hạn duyệt/sửa công — chốt được từ %',
      to_char(((t->>'mo_chot_tu')::timestamptz at time zone 'Asia/Ho_Chi_Minh'), 'HH24:MI DD/MM/YYYY');
  end if;
  if (t->>'cho_duyet_ca')::int + (t->>'cho_duyet_viec')::int + (t->>'quen_checkout')::int > 0 then
    raise exception 'Còn % ca và % việc chờ duyệt, % ca quên checkout — xử lý xong mới chốt',
      t->>'cho_duyet_ca', t->>'cho_duyet_viec', t->>'quen_checkout';
  end if;
  select coalesce(jsonb_agg(to_jsonb(l)), '[]'::jsonb) into v_rows from public._ta_luong_tinh(v_ky, null) l;
  select coalesce(max(lan), 0) + 1 into v_lan from ta_luong_ky where ky = v_ky;
  insert into ta_luong_ky (ky, lan, chot_boi, ghi_chu, so_ta, tong_net, thong_so)
  values (v_ky, v_lan, public.current_nhan_su_id(), coalesce(p_ghi_chu, ''), jsonb_array_length(v_rows),
          coalesce((select sum((e->>'net')::numeric) from jsonb_array_elements(v_rows) e), 0),
          public._ta_thong_so_ky(v_ky))   -- Thùy 04/11: chụp TOÀN BỘ thông số lương lúc chốt
  returning id into v_id;
  insert into ta_luong_ky_dong (ky_id, nhan_su_id, ho_ten, package_lop, bo_tro_gio, bo_tro_tien, ngoai_package, gross, tien_phat, net, chi_tiet)
  select v_id, r.nhan_su_id, r.ho_ten, r.package_lop, r.bo_tro_gio, r.bo_tro_tien, r.ngoai_package, r.gross, r.tien_phat, r.net, r.chi_tiet
    from jsonb_to_recordset(v_rows) as r(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric,
                                          ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb);
  return v_lan;
end $function$;
