-- THẾ GIỚI BK — hệ thống KHÔNG tự đăng tin tầng B nữa (Thùy 29/09: "đa số tin phải là HS khoe; tin hệ thống tự sinh phải S, chí ít A; B bỏ không đăng").
-- Tin B (ET 9–9,5đ · tự luyện ≥50 câu đúng) vẫn SUY trong _the_gioi_tin — làm "thành tích được quyền khoe" cho tính năng Đăng bài khoe (sắp build).
-- Định nghĩa lấy nguyên từ DB đang chạy, chỉ thêm điều kiện t.tang <> 'B' ở danh sách tin (thẻ gộp chỉ gồm A — không đổi).
CREATE OR REPLACE FUNCTION public.fn_the_gioi_kenh(p_kenh text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ban uuid[];
  v_lop uuid[];
  v_hom_nay timestamptz := ((now() at time zone 'Asia/Ho_Chi_Minh')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_tin jsonb; v_gop jsonb := '[]'::jsonb;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới xem được Thế giới BK'; end if;
  if p_kenh not in ('tg', 'lop', 'ban') then raise exception 'Kênh không hợp lệ: %', p_kenh; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_lop := array(select hl.lop_id from hoc_sinh_lop hl where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc');

  create temp table if not exists _tgk (khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamptz, chi_tiet jsonb, ten_lop text) on commit drop;
  truncate _tgk;
  insert into _tgk
  select t.*, coalesce((select l.ten_lop from lop l where l.id = t.lop_id), (select x.ten_lop from public._the_gioi_lop(t.thanh_vien[1], t.mon) x))
  from public._the_gioi_tin(now() - interval '7 days') t
  where not exists (select 1 from the_gioi_an_tin a where a.tin_khoa = t.khoa and a.an and not (v_me = any(t.thanh_vien)));
  -- lớp của tin chưa gắn lop_id (huy hiệu, nỗ lực) = lớp môn đó của em chủ tin
  update _tgk set lop_id = (select x.lop_id from public._the_gioi_lop(thanh_vien[1], mon) x) where lop_id is null;

  -- Thùy 29/09: "người ta chỉ lướt 1–2 trang đầu ⇒ phải là tin chất lượng" ⇒ xếp theo TẦNG trước (S → A → B), cùng tầng mới theo giờ.
  select coalesce(jsonb_agg(j order by ghim desc, hang, at desc), '[]'::jsonb) into v_tin from (
    select t.at, (t.tang = 'S' and t.at >= now() - interval '24 hours') as ghim,
      case t.tang when 'S' then 0 when 'A' then 1 else 2 end as hang,
      jsonb_build_object(
        'khoa', t.khoa, 'tang', t.tang, 'nhom', t.nhom, 'kieu', t.kieu, 'mon', t.mon, 'at', t.at, 'lop', t.ten_lop, 'chi_tiet', t.chi_tiet,
        'ghim', (t.tang = 'S' and t.at >= now() - interval '24 hours'),
        'nguoi', case when t.hoc_sinh_id is not null then public._the_gioi_nguoi(t.hoc_sinh_id, t.ten_lop, t.hoc_sinh_id = any(v_ban) or t.hoc_sinh_id = v_me) end,
        'doi', case when t.hoc_sinh_id is null then jsonb_build_object('so', coalesce(array_length(t.thanh_vien, 1), 0),
                 'thanh_vien', (select coalesce(jsonb_agg(public._the_gioi_nguoi(m, t.ten_lop, m = any(v_ban) or m = v_me)), '[]'::jsonb) from unnest(t.thanh_vien[1:4]) m)) end,
        'cua_toi', v_me = any(t.thanh_vien),
        'la_ban', t.thanh_vien && v_ban,
        'da_an', exists (select 1 from the_gioi_an_tin a where a.tin_khoa = t.khoa and a.an),
        'khen', public._the_gioi_khen_json(t.khoa, v_me, v_ban)) j
    from _tgk t
    where t.tang <> 'B' and case p_kenh
      when 'tg'  then t.tang = 'S'
      when 'lop' then t.lop_id = any(v_lop)
      when 'ban' then t.thanh_vien && v_ban
    end
    order by case t.tang when 'S' then 0 when 'A' then 1 else 2 end, t.at desc limit 60) q;

  if p_kenh = 'tg' then
    -- tin A gộp 1 thẻ / loại: hôm nay (huy hiệu ★1–3 gộp 7 ngày vì chốt tháng đổ dồn 1 ngày)
    select coalesce(jsonb_agg(g order by g->>'kieu'), '[]'::jsonb) into v_gop from (
      select jsonb_build_object('kieu', t.kieu, 'so', count(*),
        'ds', (select jsonb_agg(jsonb_build_object('khoa', u.khoa, 'kieu', u.kieu, 'nhom', u.nhom, 'lop', u.ten_lop, 'chi_tiet', u.chi_tiet, 'at', u.at,
                  'nguoi', case when u.hoc_sinh_id is not null then public._the_gioi_nguoi(u.hoc_sinh_id, u.ten_lop, u.hoc_sinh_id = any(v_ban) or u.hoc_sinh_id = v_me) end,
                  'doi', case when u.hoc_sinh_id is null then jsonb_build_object('so', coalesce(array_length(u.thanh_vien, 1), 0)) end,
                  'la_ban', u.thanh_vien && v_ban, 'cua_toi', v_me = any(u.thanh_vien),
                  'khen', public._the_gioi_khen_json(u.khoa, v_me, v_ban)) order by (u.thanh_vien && v_ban) desc, u.at desc)
               from (select * from _tgk u2 where u2.tang = 'A' and u2.kieu = t.kieu
                       and u2.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end
                     order by u2.at desc limit 30) u)) g
      from _tgk t
      where t.tang = 'A' and t.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end
      group by t.kieu) z;
  end if;

  return jsonb_build_object(
    'toi', jsonb_build_object('hien', coalesce((select hien from the_gioi_cai_dat where hoc_sinh_id = v_me), 'ten'),
                              'so_ban', coalesce(array_length(v_ban, 1), 0),
                              'loi_moi', (select count(*) from ban_be_loi_moi where nguoi_nhan = v_me and trang_thai = 'cho')),
    'tin', v_tin, 'gop', v_gop);
end $function$;
