-- Bổ trợ Hình phần 2 (17/10): các hàm đang chỉ biết Yếu/Bù/Đuổi học thêm loại Hình. Thân lấy từ DB đang chạy (scripts/_gen_bthinh_mig2.mjs).
-- Công/lương: buổi Hình tính y hệt buổi Yếu (loại việc `bo_tro_yeu`, cùng đơn giá/quy tắc) — Thùy chưa nói khác.

CREATE OR REPLACE FUNCTION public.fn_btyeu_don_ca_khong_dien_ra()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  if not public.la_thanh_vien() then return '[]'::jsonb; end if;
  with cu as (
    select b.id, b.ngay, hh.hoc_sinh_id
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      and b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date and hh.diem_danh is distinct from 'co_mat'
    union all
    select b.id, b.ngay, hh.hoc_sinh_id
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_hinh_id is not null
    where b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      and b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date and hh.diem_danh is distinct from 'co_mat'
  ),
  up as (
    update buoi_hoc b set trang_thai = 'huy', ly_do_huy = coalesce(b.ly_do_huy, 'Không diễn ra — qua ngày không điểm danh (tự động ' || to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI') || ')'), updated_at = now()
    from cu where b.id = cu.id returning b.id, b.ngay
  )
  select coalesce(jsonb_agg(jsonb_build_object('buoi_id', id, 'ngay', ngay)), '[]'::jsonb) into v from up;
  return v;
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_bo_tro_dashboard_tuan(p_den date DEFAULT NULL::date, p_so_tuan integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with hn as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as ngay),
  moc as (select date_trunc('week', coalesce(p_den, (select ngay from hn))::timestamp)::date as t2_cuoi,
                 greatest(1, least(coalesce(p_so_tuan, 3), 12)) as n),
  tuan as (select (m.t2_cuoi - 7 * g.i) as tu, (m.t2_cuoi - 7 * g.i + 6) as den, g.i as lui
           from moc m cross join lateral generate_series(0, m.n - 1) as g(i)),
  luot as (
    select t.tu, b.loai, b.id as buoi_id, b.ngay, b.gio_bat_dau, b.ly_do_huy, hs.ho_ten, hs.ma_hs,
           coalesce(ns.ho_ten, ns2.ho_ten) as nguoi,
           coalesce(
             (select l.ten_lop from buoi_hoc g join lop l on l.id = g.lop_id where g.id = hh.bu_cho_buoi_id),
             (select l.ten_lop from bo_tro_duoi d join lop l on l.id = d.lop_id where d.id = hh.bo_tro_duoi_id),
             (select l.ten_lop from bo_tro_yeu y join hoc_sinh_lop hl on hl.hoc_sinh_id = y.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                join lop l on l.id = hl.lop_id and l.mon = y.mon where y.id = hh.bo_tro_yeu_id order by hl.ngay_vao desc limit 1),
             (select l.ten_lop from bo_tro_hinh yh join hoc_sinh_lop hl on hl.hoc_sinh_id = yh.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                join lop l on l.id = hl.lop_id and l.mon = yh.mon where yh.id = hh.bo_tro_hinh_id order by hl.ngay_vao desc limit 1)) as lop,
           case
             when b.trang_thai = 'huy' and b.ly_do_huy ilike 'OPS gỡ%' then 'go'
             when hh.diem_danh = 'vang' then 'vang'
             when hh.diem_danh = 'co_mat' or b.trang_thai = 'hoan_tat' or (b.danh_gia_xong_at is not null and b.trang_thai <> 'huy')
               then case when b.danh_gia_xong_at is not null or b.trang_thai = 'hoan_tat' then 'hoan_tat' else 'dang_do' end
             when b.trang_thai = 'huy' then 'khong_dien_ra'
             when b.ngay < (select ngay from hn) then 'qua_han'
             else 'cho' end as tt
    from tuan t
    join buoi_hoc b on b.ngay between t.tu and t.den and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh')
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
    join hoc_sinh hs on hs.id = hh.hoc_sinh_id and hs.trang_thai is distinct from 'test'
    left join nhan_su ns on ns.id = b.nguoi_day_tg
    left join nhan_su ns2 on ns2.id = b.nguoi_day
  ),
  dem as (
    select tu, loai,
           count(*) filter (where tt <> 'go') as chot,
           count(*) filter (where tt in ('hoan_tat', 'dang_do')) as da_chay,
           count(*) filter (where tt = 'hoan_tat') as hoan_tat,
           count(*) filter (where tt = 'dang_do') as dang_do,
           count(*) filter (where tt = 'vang') as vang,
           count(*) filter (where tt = 'khong_dien_ra') as khong_dien_ra,
           count(*) filter (where tt = 'qua_han') as qua_han,
           count(*) filter (where tt = 'cho') as cho,
           count(*) filter (where tt = 'go') as go
    from luot group by tu, loai
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'tu', t.tu, 'den', t.den, 'dang_chay', (select ngay from hn) between t.tu and t.den, 'tuong_lai', t.tu > (select ngay from hn),
    'tong', (select jsonb_build_object('chot', coalesce(sum(d.chot), 0), 'da_chay', coalesce(sum(d.da_chay), 0)) from dem d where d.tu = t.tu),
    'loai', (select coalesce(jsonb_object_agg(k.loai, jsonb_build_object(
               'chot', coalesce(d.chot, 0), 'da_chay', coalesce(d.da_chay, 0), 'hoan_tat', coalesce(d.hoan_tat, 0), 'dang_do', coalesce(d.dang_do, 0),
               'vang', coalesce(d.vang, 0), 'khong_dien_ra', coalesce(d.khong_dien_ra, 0), 'qua_han', coalesce(d.qua_han, 0),
               'cho', coalesce(d.cho, 0), 'go', coalesce(d.go, 0))), '{}'::jsonb)
             from (values ('bo_tro_yeu'), ('bu'), ('bo_tro_duoi'), ('bo_tro_hinh')) k(loai) left join dem d on d.tu = t.tu and d.loai = k.loai),
    'ds', (select coalesce(jsonb_agg(jsonb_build_object('loai', l.loai, 'tt', l.tt, 'buoi_id', l.buoi_id, 'ngay', l.ngay, 'gio_bat_dau', l.gio_bat_dau,
               'ho_ten', l.ho_ten, 'ma_hs', l.ma_hs, 'lop', l.lop, 'nguoi', l.nguoi, 'ly_do', l.ly_do_huy)
               order by l.ngay, l.gio_bat_dau nulls last, l.ho_ten), '[]'::jsonb) from luot l where l.tu = t.tu)
  ) order by t.tu desc), '[]'::jsonb) end
  from tuan t
$function$
;

CREATE OR REPLACE FUNCTION public.fn_hs_lich_bo_tro()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'buoi_id', b.id, 'loai', b.loai, 'ngay', b.ngay,
    'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
    'mon', case b.loai when 'bo_tro_yeu' then y.mon when 'bo_tro_hinh' then yh.mon else l.mon end,
    'nguoi', coalesce(ns.ho_ten, ns2.ho_ten),
    'diem_danh', hh.diem_danh,
    'hom_nay', b.ngay = public._btyeu_today(),
    'vao_ca', coalesce(b.loai in ('bo_tro_yeu', 'bo_tro_duoi', 'bu') and b.ngay = public._btyeu_today()
                       and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null, false)
  ) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
  from buoi_hoc_hs hh
  join buoi_hoc b on b.id = hh.buoi_hoc_id
  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  left join bo_tro_hinh yh on yh.id = hh.bo_tro_hinh_id
  left join buoi_hoc bg on bg.id = hh.bu_cho_buoi_id
  left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
  left join lop l on l.id = coalesce(bg.lop_id, d.lop_id)
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  left join nhan_su ns2 on ns2.id = b.nguoi_day
  where hh.hoc_sinh_id = public.my_hoc_sinh_id()
    and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh')
    and b.trang_thai = 'mo'
    and b.ngay >= public._btyeu_today()
$function$
;

CREATE OR REPLACE FUNCTION public.fn_bo_tro_tu_kiem(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_goc text := current_setting('request.jwt.claims', true); v_tu date := greatest(coalesce(p_tu, public._btyeu_today()), public._btyeu_today()); -- chỉ ca từ HÔM NAY (ca đã qua: app HS không hiện lịch cũ, ca xong rời ô TA — đúng thiết kế)
        v_den date := coalesce(p_den, coalesce(p_tu, public._btyeu_today()) + 1);
        r record; h record; v_loi text[]; v_hs jsonb; v_n int := 0; v_out jsonb := '[]'::jsonb; v_tk uuid; v_email text; v_d jsonb; v_hs_loi text[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  for r in
    select b.id, b.loai, b.ngay, b.gio_bat_dau, coalesce(b.nguoi_day_tg, b.nguoi_day) as owner, ns.ho_ten as ta, ns.trang_thai as ta_tt, ns.la_admin_he_thong as ta_admin
    from buoi_hoc b left join nhan_su ns on ns.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    where b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh') and b.trang_thai = 'mo' and b.ngay between v_tu and v_den
      and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
    order by b.ngay, b.gio_bat_dau
  loop
    v_n := v_n + 1; v_loi := '{}';
    -- ── phía TA
    if r.owner is null then v_loi := v_loi || 'Chưa gán người đứng ca';
    elsif r.ta_tt is distinct from 'dang_lam' then v_loi := v_loi || format('%s không còn ở trạng thái đang làm', r.ta);
    else
      select tk.id, tk.email into v_tk, v_email from tai_khoan tk where tk.nhan_su_id = r.owner order by tk.created_at limit 1;
      if v_tk is null then v_loi := v_loi || format('%s chưa có tài khoản đăng nhập', r.ta);
      else
        if not coalesce(r.ta_admin, false) and not exists (select 1 from vi_tri v join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
                                                          where v.nhan_su_id = r.owner and vc.chuc_nang = 'buoihoc') then
          v_loi := v_loi || format('%s thiếu quyền "Buổi học" — app TA ẩn mọi ô', r.ta);
        end if;
        perform set_config('request.jwt.claims', jsonb_build_object('sub', v_tk, 'email', v_email, 'role', 'authenticated')::text, true);
        begin
          v_d := case r.loai when 'bo_tro_yeu' then public.fn_btyeu_viec_cua_toi()->'ca'
                             when 'bo_tro_hinh' then public.fn_bthinh_viec_cua_toi()->'ca'
                             when 'bu' then public.fn_bu_ca_cua_toi() else public.fn_duoi_ca_cua_toi() end;
          if not exists (select 1 from jsonb_array_elements(coalesce(v_d, '[]'::jsonb)) e where (e->>'buoi_id')::uuid = r.id) then
            v_loi := v_loi || format('App TA của %s KHÔNG hiện ca này', r.ta);
          end if;
        exception when others then v_loi := v_loi || format('App TA của %s lỗi khi tải: %s', r.ta, sqlerrm);
        end;
      end if;
    end if;
    -- ── phía HS (chỉ em chưa báo vắng)
    v_hs := '[]'::jsonb;
    for h in select hh.hoc_sinh_id, hs.ho_ten, (select tk.id from tai_khoan tk where tk.hoc_sinh_id = hh.hoc_sinh_id limit 1) as tk,
                    (select tk.email from tai_khoan tk where tk.hoc_sinh_id = hh.hoc_sinh_id limit 1) as email
             from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id
             where hh.buoi_hoc_id = r.id and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep')
    loop
      v_hs := v_hs || to_jsonb(h.ho_ten);
      if h.tk is null then v_loi := v_loi || format('%s chưa có tài khoản app HS', h.ho_ten);
      else
        perform set_config('request.jwt.claims', jsonb_build_object('sub', h.tk, 'email', h.email, 'role', 'authenticated')::text, true);
        begin
          if not exists (select 1 from jsonb_array_elements(coalesce(public.fn_hs_lich_bo_tro(), '[]'::jsonb)) e where (e->>'buoi_id')::uuid = r.id) then
            v_loi := v_loi || format('App HS của %s KHÔNG hiện lịch ca này', h.ho_ten);
          end if;
        exception when others then v_loi := v_loi || format('App HS của %s lỗi khi tải: %s', h.ho_ten, sqlerrm);
        end;
      end if;
    end loop;
    perform set_config('request.jwt.claims', coalesce(v_goc, ''), true);
    if array_length(v_loi, 1) > 0 then
      v_out := v_out || jsonb_build_object('buoi_id', r.id, 'loai', r.loai, 'ngay', r.ngay, 'gio', to_char(r.gio_bat_dau, 'HH24:MI'),
                                           'ta', r.ta, 'hs', v_hs, 'loi', to_jsonb(v_loi));
    end if;
  end loop;
  perform set_config('request.jwt.claims', coalesce(v_goc, ''), true);
  return jsonb_build_object('tu', v_tu, 'den', v_den, 'so_ca', v_n, 'loi', v_out);
end $function$
;

CREATE OR REPLACE FUNCTION public._ta_lop_cua_buoi(p_buoi uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(
    (select b.lop_id from buoi_hoc b where b.id = p_buoi),
    (select x.lop_id from (
        select coalesce(d.lop_id, y.lop_id, h.lop_id, me.lop_id,
                        (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hh.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = h.mon limit 1)) as lop_id
        from buoi_hoc_hs hh
        left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
        left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
        left join bo_tro_hinh h on h.id = hh.bo_tro_hinh_id
        left join buoi_hoc me on me.id = hh.bu_cho_buoi_id
        where hh.buoi_hoc_id = p_buoi) x
     where x.lop_id is not null
     group by x.lop_id order by count(*) desc, x.lop_id limit 1))
$function$
;

CREATE OR REPLACE FUNCTION public._ta_buoi_thieu_cong(p_tu date, p_den date)
 RETURNS TABLE(loai text, ngay date, lop_id uuid, ten text, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, buoi_hoc_id uuid, ca_bo_tro_id uuid, nhan_su_id uuid, nguoi_phu_trach text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (now() at time zone 'Asia/Ho_Chi_Minh')::time;
        v_tu date := greatest(p_tu, public._ta_moc_cham_cong());
        v_den date := least(coalesce(p_den, p_tu), v_homnay);
begin
  return query
  select 'buoi'::text, b.ngay, b.lop_id, l.ten_lop, b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, ai.id, ai.ho_ten
    from buoi_hoc b join lop l on l.id = b.lop_id
    left join lateral (select n.id, n.ho_ten from public._ta_tg_tai(b.ngay, b.lop_id) t join nhan_su n on n.id = t.nhan_su_id
                        order by t.la_chinh desc, n.ho_ten limit 1) ai on true
   where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and (ai.id is null or not public._la_gv_kiem_ta(ai.id))   -- Thùy 15/10: GV kiêm TA không chấm công
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec
                      where cv.lop_id = b.lop_id and cv.ngay = b.ngay and lv.tinh_vao in ('tg', 'trong_thi') and cv.trang_thai <> 'tu_choi')
  union all
  select 'ca'::text, c.ngay, null::uuid, concat_ws(' ', 'Trực bổ trợ', c.mon, c.khoi), c.gio_bat_dau, c.gio_ket_thuc, null::uuid, c.id,
         c.nhan_su_id, (select n.ho_ten from nhan_su n where n.id = c.nhan_su_id)
    from ca_bo_tro c
   where c.trang_thai = 'mo' and c.ngay between v_tu and v_den and not public._la_gv_kiem_ta(c.nhan_su_id)
     and (c.ngay < v_homnay or c.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv
                      where cv.trang_thai <> 'tu_choi' and cv.ngay = c.ngay
                        and (cv.ca_bo_tro_id = c.id or (cv.loai_viec = 'bo_tro_dinh_ki' and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))))
  union all
  -- Buổi bổ trợ TA đứng lớp đã diễn ra, có em có mặt, chưa ai ghi công; buổi nằm trong ca trực của chính người đó thì ca trực đã bao.
  select case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' else 'bo_tro_duoi' end,
         b.ngay, l.id, (case b.loai when 'bu' then 'Buổi bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' when 'bo_tro_hinh' then 'Bổ trợ Hình' else 'Bổ trợ đuổi' end) || coalesce(' ' || l.ten_lop, ''),
         b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, n.id, n.ho_ten
    from buoi_hoc b
    join nhan_su n on n.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
   where b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh') and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and not public._la_gv_kiem_ta(n.id)
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.diem_danh = 'co_mat')
     and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and n.id in (c.nhan_su_id, c.nhan_su_2_id))
     and not exists (select 1 from ta_cong_viec cv where cv.buoi_hoc_id = b.id and cv.trang_thai <> 'tu_choi')
   order by 2, 5 nulls last;
end $function$
;

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
           case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' else 'bo_tro_duoi' end,
           l.id, l.ten_lop, b.id, null::uuid, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
     where b.ngay = v_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh') and b.trang_thai <> 'huy' and v_ns in (b.nguoi_day, b.nguoi_day_tg)
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
end $function$
;

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
           case when lv.nhom = 'ngoai_package' and not exists (select 1 from ta_don_gia d where d.ma = 'gia_' || lv.ma and d.hieu_luc_tu <= cv.ngay) then 'chua_don_gia' end,
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
        when cv.loai_viec in ('bo_tro_bu', 'bo_tro_yeu', 'bo_tro_duoi') then exists (
              select 1 from buoi_hoc b
               where b.ngay = cv.ngay and b.trang_thai <> 'huy'
                 and b.loai = any (case cv.loai_viec when 'bo_tro_bu' then array['bu'] when 'bo_tro_yeu' then array['bo_tro_yeu', 'bo_tro_hinh'] else array['bo_tro_duoi'] end)
                 and (b.id = cv.buoi_hoc_id or b.nguoi_day = cv.nhan_su_id
                      or exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
                 and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'))
        when lv.tinh_vao = 'trong_thi' then exists (select 1 from buoi_hoc b join ky_thi kt on kt.buoi_hoc_id = b.id
                                              where b.lop_id = cv.lop_id and b.ngay = cv.ngay)
        else false end as khop) kq
   where cv.ngay between p_tu and v_den and (p_ns is null or cv.nhan_su_id = p_ns)
   order by 6, 5, 1, 18 nulls first;
end $function$
;
