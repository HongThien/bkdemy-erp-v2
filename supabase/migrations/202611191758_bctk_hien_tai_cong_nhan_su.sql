-- fn_bctk_hien_tai / fn_bctk_hien_tai_o (mig 202611191751): thêm cổng TƯỜNG MINH "phải là nhân sự đã đăng nhập" ở đầu thân, trước cổng trưởng bộ môn.
-- Lý do: check:kien-truc (K14) nhận diện cổng của hàm security definer theo từ khoá và không biết _bctk_gac_tbm ⇒ đếm hai hàm này là "không thấy cổng" (trần 135 → 136).
-- Hai hàm vốn đã có cổng trưởng bộ môn; dòng mới là lớp kiểm thứ nhất (người chưa gắn nhân sự bị chặn ngay), không nới gì.

CREATE OR REPLACE FUNCTION public.fn_bctk_hien_tai()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_tuan date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_mon text[];
begin
  if public.current_nhan_su_id() is null then raise exception 'Chỉ nhân sự đã đăng nhập' using errcode = '42501'; end if;
  perform public._bctk_gac_tbm();
  v_mon := public._bctk_cac_mon_toi();
  return jsonb_build_object(
    'tuan', v_tuan, 'den', v_tuan + 6,
    'mon', (select coalesce(jsonb_agg(jsonb_build_object(
              'mon', m.mon,
              'tinh_at', (select min(s.tinh_at) from bctk_so_hien_tai_o s where s.mon = m.mon and s.tuan = v_tuan),
              'tong', (select public._bctk_gom_tong(array_agg(s.tong)) from bctk_so_hien_tai_o s where s.mon = m.mon and s.tuan = v_tuan),
              'khoi', (select coalesce(jsonb_agg(jsonb_build_object(
                          'khoi', s.khoi, 'tinh_at', s.tinh_at, 'tong', s.tong,
                          'truong', (select n.ho_ten from phan_cong_quan_ly_khoi q join nhan_su n on n.id = q.nhan_su_id
                                      where q.mon = s.mon and q.khoi = s.khoi and q.vai = 'truong'))
                        order by coalesce(substring(s.khoi from '^[0-9]+')::int, 0), s.khoi), '[]'::jsonb)
                         from bctk_so_hien_tai_o s where s.mon = m.mon and s.tuan = v_tuan))
            order by m.mon), '[]'::jsonb)
              from unnest(v_mon) m(mon)));
end
$function$;

CREATE OR REPLACE FUNCTION public.fn_bctk_hien_tai_o(p_mon text, p_khoi text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_tuan date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_o jsonb := jsonb_build_array(jsonb_build_object('mon', p_mon, 'khoi', p_khoi));
  v_so jsonb;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chỉ nhân sự đã đăng nhập' using errcode = '42501'; end if;
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  v_so := public.fn_bctk_so(v_o, v_tuan);
  return v_so
    || jsonb_build_object('trend', (
         select jsonb_agg(jsonb_build_object('tuan', w.tuan, 'tong', case when w.k = 0 then v_so->'tong' else coalesce(
                    (select s.tong from bctk_so_tuan_o s where s.tuan = w.tuan and s.mon = p_mon and s.khoi = p_khoi),
                    public.fn_bctk_so(v_o, w.tuan)->'tong') end) order by w.tuan)
           from (select k, (v_tuan - 7 * k)::date as tuan from generate_series(0, 3) k) w))
    || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, v_tuan))
    || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, v_tuan));
end
$function$;
