-- ============================================================================
-- 202610142016 — ta_cong_lop_cua_buoi_bo_tro
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 14/10 (ảnh app TA): bấm "Ghi công" ô gợi ý "Bổ trợ đuổi" ⇒ lỗi 'Loại việc "Bổ trợ đuổi" cần chọn lớp'.
--   Buổi bù/yếu/đuổi KHÔNG có buoi_hoc.lop_id — lớp nằm ở từng HS (bo_tro_duoi.lop_id · bo_tro_yeu.lop_id ·
--   buổi gốc em nghỉ bu_cho_buoi_id). fn_ta_hom_nay đưa lop_id = null lên ô gợi ý, fn_ta_khai_viec lấy lớp từ
--   buoi_hoc.lop_id (null), trigger _ta_cong_viec_kiem bắt can_lop ⇒ MỌI ô gợi ý buổi bổ trợ đều chết.
--   Test trước đó (test_chamcong.mjs) chỉ khai bổ trợ qua "thêm việc ngoài lịch" có chọn lớp ⇒ không phủ nhánh này.
--   Sửa: 1 hàm _ta_lop_cua_buoi (lớp chiếm nhiều HS nhất trong buổi) dùng chung cho gợi ý, khai việc, trigger.
--   Trigger: có buoi_hoc_id thì không bắt lớp (đối chiếu + lương bổ trợ bám buổi). Kèm: gợi ý buổi bổ trợ
--   nhận cả người đứng lớp TA (nguoi_day_tg), không chỉ nguoi_day — NHƯNG ca yếu nằm trong ca trực của chính mình thì
--   không gợi ý riêng (ca trực đã bao).
--   (Lương cộng thẳng giờ bổ trợ ⇒ gợi ý cả ca trực lẫn ca yếu bên trong là nhân đôi giờ. Gộp giờ trùng trong lương
--   = đổi luật lương (T9 có dòng trùng giờ thật) ⇒ chờ Thùy quyết, KHÔNG làm ở đây.)
--
-- MẤT GÌ (Luật xoá): không xoá gì. 3 hàm viết lại thân (cùng chữ ký, cùng quyền).
-- ============================================================================

create or replace function public._ta_lop_cua_buoi(p_buoi uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select b.lop_id from buoi_hoc b where b.id = p_buoi),
    (select x.lop_id from (
        select coalesce(d.lop_id, y.lop_id, me.lop_id) as lop_id
        from buoi_hoc_hs hh
        left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
        left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
        left join buoi_hoc me on me.id = hh.bu_cho_buoi_id
        where hh.buoi_hoc_id = p_buoi) x
     where x.lop_id is not null
     group by x.lop_id order by count(*) desc, x.lop_id limit 1))
$$;
revoke all on function public._ta_lop_cua_buoi(uuid) from public, anon;
grant execute on function public._ta_lop_cua_buoi(uuid) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_ta_hom_nay(p_at timestamp with time zone DEFAULT now())
 RETURNS TABLE(nguon text, loai_viec text, lop_id uuid, ten_lop text, buoi_hoc_id uuid, ca_bo_tro_id uuid, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, dang_dien_ra boolean, da_khai boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public.current_nhan_su_id();
        v_ngay date := (p_at at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (p_at at time zone 'Asia/Ho_Chi_Minh')::time;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  return query
  with k1 as (
    -- buổi thường của lớp mình TẠI NGÀY ĐÓ; buổi có kỳ thi ⇒ gợi ý trông thi
    select 'buoi_thuong'::text as nguon,
           case when exists (select 1 from ky_thi kt where kt.buoi_hoc_id = b.id) then 'trong_thi' else 'tro_giang' end::text as loai_viec,
           b.lop_id, l.ten_lop, b.id as buoi_hoc_id, null::uuid as ca_bo_tro_id, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b join lop l on l.id = b.lop_id
      join public._ta_tg_tai(v_ngay, null, v_ns) pc on pc.lop_id = b.lop_id
     where b.ngay = v_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
    union all
    -- ca trực bổ trợ khối đã xếp cho mình
    select 'ca_bo_tro', 'bo_tro_dinh_ki', null::uuid, concat_ws(' ', c.mon, c.khoi), null::uuid, c.id, c.gio_bat_dau, c.gio_ket_thuc
      from ca_bo_tro c
     where c.ngay = v_ngay and c.trang_thai = 'mo' and v_ns in (c.nhan_su_id, c.nhan_su_2_id)
    union all
    -- buổi bù / yếu / đuổi mình dạy
    select 'buoi_bo_tro',
           case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end,
           l.id, l.ten_lop, b.id, null::uuid, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
     where b.ngay = v_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and v_ns in (b.nguoi_day, b.nguoi_day_tg)
       and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and v_ns in (c.nhan_su_id, c.nhan_su_2_id))   -- ca yếu nằm trong ca trực của mình: ca trực đã bao
  )
  select x.nguon, x.loai_viec, x.lop_id, x.ten_lop, x.buoi_hoc_id, x.ca_bo_tro_id, x.gio_bat_dau, x.gio_ket_thuc,
         (x.gio_bat_dau is not null and x.gio_ket_thuc is not null
            and v_gio between x.gio_bat_dau - interval '30 minutes' and x.gio_ket_thuc + interval '30 minutes'),
         exists (select 1 from ta_cong_viec cv where cv.nhan_su_id = v_ns and cv.trang_thai <> 'tu_choi'
                   and ((x.buoi_hoc_id is not null and cv.buoi_hoc_id = x.buoi_hoc_id and cv.loai_viec = x.loai_viec)
                     or (x.ca_bo_tro_id is not null and cv.ca_bo_tro_id = x.ca_bo_tro_id)))
    from k1 x
   order by x.gio_bat_dau nulls last;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ta_khai_viec(p_loai text, p_ngay date, p_lop uuid DEFAULT NULL::uuid, p_buoi uuid DEFAULT NULL::uuid, p_ca uuid DEFAULT NULL::uuid, p_bat time without time zone DEFAULT NULL::time without time zone, p_ket time without time zone DEFAULT NULL::time without time zone, p_hs text DEFAULT NULL::text, p_ghi_chu text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public.current_nhan_su_id(); v_cc uuid; v_id uuid; v_lop uuid := p_lop; v_buoi uuid := p_buoi;
        v_bat time := p_bat; v_ket time := p_ket; v_tinh text;
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_het timestamptz := ((p_ngay + coalesce(p_ket, time '23:59'))::timestamp at time zone 'Asia/Ho_Chi_Minh');
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  if p_ngay > v_homnay then raise exception 'Không khai trước cho ngày chưa tới'; end if;
  if now() > v_het + interval '24 hours' and not public._ta_duoc_khai_bu(p_ngay) then
    raise exception 'Đã quá 24 giờ kể từ khi việc diễn ra — nhờ quản lý nhập hộ';
  end if;
  select id into v_cc from ta_cham_cong where nhan_su_id = v_ns and ngay = p_ngay and duyet <> 'tu_choi' order by vao_at desc limit 1;
  if v_cc is null then raise exception 'Chưa checkin ngày %', to_char(p_ngay, 'DD/MM'); end if;
  select tinh_vao into v_tinh from ta_loai_viec where ma = p_loai;
  if v_lop is null and v_buoi is not null then v_lop := public._ta_lop_cua_buoi(v_buoi); end if;
  if v_lop is null and p_loai = 'tro_giang' then
    select t.lop_id into v_lop from public._ta_tg_tai(p_ngay, null, v_ns) t order by t.la_chinh desc limit 1;
    if v_lop is null then
      raise exception 'Ngày % bạn chưa được phân công lớp nào — chọn đúng lớp đã trợ giảng', to_char(p_ngay, 'DD/MM');
    end if;
  end if;
  if v_buoi is null and v_tinh in ('tg', 'trong_thi') and v_lop is not null then
    select b.id, coalesce(v_bat, b.gio_bat_dau), coalesce(v_ket, b.gio_ket_thuc) into v_buoi, v_bat, v_ket
      from buoi_hoc b
     where b.lop_id = v_lop and b.ngay = p_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
     order by b.gio_bat_dau nulls last limit 1;
  end if;
  begin
    insert into ta_cong_viec (nhan_su_id, cham_cong_id, ngay, loai_viec, lop_id, buoi_hoc_id, ca_bo_tro_id,
                              gio_bat_dau, gio_ket_thuc, hoc_sinh, ghi_chu, nguon, khai_bu, created_by)
    values (v_ns, v_cc, p_ngay, p_loai, v_lop, v_buoi, p_ca, v_bat, v_ket, p_hs, coalesce(p_ghi_chu, ''),
            case when v_buoi is not null or p_ca is not null then 'he_thong' else 'tu_khai' end, p_ngay < v_homnay, v_ns)
    returning id into v_id;
  exception when unique_violation then
    raise exception 'Việc này đã ghi công rồi';
  end;
  return v_id;
end $function$;

CREATE OR REPLACE FUNCTION public._ta_cong_viec_kiem()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare v ta_loai_viec;
begin
  select * into v from ta_loai_viec where ma = new.loai_viec;
  if not v.active then raise exception 'Loại việc % đã ngừng dùng', new.loai_viec; end if;
  if new.lop_id is null and new.buoi_hoc_id is not null then new.lop_id := public._ta_lop_cua_buoi(new.buoi_hoc_id); end if;
  -- Buổi bổ trợ chính là bằng chứng (đối chiếu + lương bổ trợ bám buổi, không bám lớp) ⇒ có buổi thì không bắt lớp.
  if v.can_lop and new.lop_id is null and new.buoi_hoc_id is null then raise exception 'Loại việc "%" cần chọn lớp', v.ten; end if;
  if new.loai_viec = 'khac' and btrim(coalesce(new.ghi_chu, '')) = '' then raise exception 'Việc khác phải ghi chú'; end if;
  new.updated_at := now();
  return new;
end $function$;
