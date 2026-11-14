-- PHÒNG DÙNG CHUNG (Thùy 14/11: "trần 2 ca cho phép trùng … hoạt động khác cũng có thể chung, ví dụ test đầu vào").
-- Trước: lưu Lịch khối / tạo ca tay bị CHẶN cứng khi phòng đang có chính khoá · test · hoạt động phát sinh. Nay: chỉ CHÍNH KHOÁ (TKB) còn chặn;
-- test đầu vào + hoạt động phát sinh = CẢNH BÁO (lưu được nếu xác nhận) và không tính vào trần 2 ca bổ trợ/phòng cùng giờ (trần đó giữ nguyên).
-- Chiều ngược lại đã sẵn: xếp khung test / thêm hoạt động phát sinh vào phòng có ca bổ trợ vốn chỉ cảnh báo (fn_ts_khung_trung_phong, PhatSinhModal "Vẫn lưu").
-- KHÔNG đổi: fn_tkb_kiem_trung (lưu TKB chính khoá vẫn chặn trùng test/phát sinh), trần 2 ca bổ trợ/phòng, kiểm trùng NGƯỜI TRỰC.
CREATE OR REPLACE FUNCTION public.fn_lich_truc_kiem_trung(p_thu integer, p_gio_bd time without time zone, p_gio_kt time without time zone, p_phong text, p_ns uuid, p_ns2 uuid, p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date, p_bo_qua uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare
  v_tu date := greatest(coalesce(p_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date), (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v_den date;
  v jsonb;
begin
  v_den := v_tu + 27;
  if p_den is not null and p_den < v_den then v_den := p_den; end if;
  if v_den < v_tu then return '[]'::jsonb; end if;

  with l as (
    select * from public.fn_phong_lich(v_tu, v_den) x
    where public._thu_cua_ngay(x.ngay) = p_thu and x.gio_bat_dau < p_gio_kt and x.gio_ket_thuc > p_gio_bd
      and (p_bo_qua is null or (x.ref_id not like 'lt-' || p_bo_qua::text || '-%'
            and x.ref_id not in (select 'ca-' || c.id::text from ca_bo_tro c where c.lich_truc_id = p_bo_qua)))
  ),
  phong_bt as ( -- số khối bổ trợ cùng phòng từng ngày
    select x.ngay, count(*) n from l x where x.phong_ma = p_phong and x.nguon in ('bo_tro', 'bo_tro_khoi') group by x.ngay
  ),
  hit as (
    select x.*, 'phong'::text as kieu,
           case when x.nguon = 'chinh_khoa' then 'chan'                                   -- chính khoá (TKB) = gốc, giữ chặn
                when x.nguon not in ('bo_tro', 'bo_tro_khoi') then 'canh_bao'      -- Thùy 14/11: test đầu vào / hoạt động phát sinh CHUNG được phòng — chỉ cảnh báo
                when coalesce((select n from phong_bt b where b.ngay = x.ngay), 0) >= 2 then 'chan'
                else 'canh_bao' end as muc
    from l x where p_phong is not null and x.phong_ma = p_phong
    union all
    select x.*, 'nguoi', case when x.nguon = 'bo_tro_khoi' and x.gio_bat_dau = p_gio_bd and x.gio_ket_thuc = p_gio_kt
                                   and x.ref_id like 'lt-%' then 'canh_bao' else 'chan' end
    from l x where (p_ns is not null and p_ns = any(x.nhan_su_ids)) or (p_ns2 is not null and p_ns2 = any(x.nhan_su_ids))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'kieu', g.kieu, 'muc', g.muc, 'nguon', g.nguon, 'tieu_de', g.tieu_de, 'phong', g.phong_ma, 'phu_trach', g.phu_trach,
           'gio_bat_dau', to_char(g.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(g.gio_ket_thuc, 'HH24:MI'), 'ngay', g.ngays)
         order by g.muc desc, g.kieu, g.gio_bat_dau), '[]'::jsonb)
  into v
  from (
    select h.kieu, max(h.muc) as muc, h.nguon, h.tieu_de, h.phong_ma, h.phu_trach, h.gio_bat_dau, h.gio_ket_thuc,
           array_agg(distinct h.ngay order by h.ngay) as ngays -- max(muc): 'canh_bao' < 'chan' theo chữ ⇒ 1 ngày chặn là chặn
    from hit h group by h.kieu, h.nguon, h.tieu_de, h.phong_ma, h.phu_trach, h.gio_bat_dau, h.gio_ket_thuc
  ) g;
  return v;
end
$function$;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_tao(p_ngay date, p_gio_bd time without time zone, p_gio_kt time without time zone, p_mon text, p_khoi text, p_phong text, p_so_ta integer, p_ns uuid, p_ns2 uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v uuid; v_phong text := nullif(trim(p_phong), ''); v_ns2 uuid := case when p_so_ta = 2 then p_ns2 end; r record; v_bt int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ns is null then raise exception 'Ca phải có người trực.'; end if;
  if p_so_ta = 2 and (p_ns2 is null or p_ns2 = p_ns) then raise exception 'Ca 2 TA phải có người trực thứ 2 khác người 1.'; end if;
  if p_gio_kt <= p_gio_bd then raise exception 'Giờ kết thúc phải sau giờ bắt đầu.'; end if;

  -- Lịch phòng chung (Thùy 10/11): chặn trùng chính khoá/test/phát sinh · đủ 2 khối bổ trợ cùng phòng · người trực đang ở chỗ khác
  for r in select * from public.fn_phong_lich(p_ngay, p_ngay) x
           where x.gio_bat_dau < p_gio_kt and x.gio_ket_thuc > p_gio_bd
             and ((v_phong is not null and x.phong_ma = v_phong) or p_ns = any(x.nhan_su_ids) or (v_ns2 is not null and v_ns2 = any(x.nhan_su_ids)))
           order by x.gio_bat_dau
  loop
    -- buổi bổ trợ LẺ của chính người trực (chưa vào ca nào) = thứ ca này sinh ra để chứa ⇒ không tính trùng
    if r.nguon = 'bo_tro' and r.ref_id !~ '^(ca|nhe)-' and (p_ns = any(r.nhan_su_ids) or (v_ns2 is not null and v_ns2 = any(r.nhan_su_ids))) then continue; end if;
    if p_ns = any(r.nhan_su_ids) or (v_ns2 is not null and v_ns2 = any(r.nhan_su_ids)) then
      raise exception 'Trùng người trực: đang có % · % %–% lúc này.', r.tieu_de, coalesce(r.phong_ma, 'chưa phòng'), to_char(r.gio_bat_dau, 'HH24:MI'), to_char(r.gio_ket_thuc, 'HH24:MI');
    end if;
    if r.nguon = 'chinh_khoa' then
      raise exception 'Trùng phòng %: % %–% (lịch phòng chung).', v_phong, r.tieu_de, to_char(r.gio_bat_dau, 'HH24:MI'), to_char(r.gio_ket_thuc, 'HH24:MI');
    end if;
    if r.nguon not in ('bo_tro', 'bo_tro_khoi') then continue; end if; -- Thùy 14/11: test đầu vào / hoạt động phát sinh chung được phòng (không tính vào trần 2 ca bổ trợ)
    v_bt := v_bt + 1;
  end loop;
  if v_bt >= 2 then raise exception 'Phòng % lúc %–% đã có % khối bổ trợ — tối đa 2/phòng cùng giờ.', v_phong, to_char(p_gio_bd, 'HH24:MI'), to_char(p_gio_kt, 'HH24:MI'), v_bt; end if;

  insert into ca_bo_tro (ngay, gio_bat_dau, gio_ket_thuc, mon, khoi, phong, so_ta, nhan_su_id, nhan_su_2_id, created_by)
  values (p_ngay, p_gio_bd, p_gio_kt, p_mon, nullif(p_khoi, ''), v_phong, coalesce(p_so_ta, 1), p_ns, v_ns2, public.jwt_uid())
  returning id into v;
  return v;
end
$function$;
