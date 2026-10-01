-- THẾ GIỚI BK — kênh LỚP + BẠN BÈ tự đăng lại tin A, B nhưng có HẠN MỨC (Thùy 29/09: "kênh thế giới tin tự động chỉ cấp S, còn kênh
-- cá nhân và kênh lớp thì cấp A, B nhưng tính toán để không bị spam quá, trôi hết tin học sinh muốn thấy").
-- Định nghĩa lấy nguyên từ DB đang chạy; chỉ đổi khúc chọn tin (window rn_em / rn_ngay). Thế giới giữ nguyên: S ∪ bài khoe.
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

  -- Tin của kênh = BÀI KHOE của HS (tin chính — Thùy 29/09) + tin hệ thống tự đăng (Thế giới: chỉ S · Lớp/Bạn bè: S, A).
  -- Xếp: tin S ghim 24h → theo NGÀY lên kênh (mới trước) → trong ngày: S → bài khoe → A → theo giờ (1–2 trang đầu luôn là tin chất lượng).
  -- Thùy 29/09: Thế giới tự đăng CHỈ S · Lớp/Bạn bè tự đăng A + B nhưng CÓ HẠN MỨC để bài HS khoe không bị trôi:
  --   mỗi em ≤ 1 tin tự động / ngày / kênh (lấy tin tốt nhất: A trước B) · mỗi kênh ≤ 6 tin tự động / ngày. Tin S + bài khoe không tính hạn mức.
  select coalesce(jsonb_agg(j order by ghim desc, ngay desc, hang, moc desc), '[]'::jsonb) into v_tin from (select * from (
    select t.tang as tang_goc, (k.dang_at is not null) as la_khoe,
      row_number() over (partition by (coalesce(k.dang_at, t.at) at time zone 'Asia/Ho_Chi_Minh')::date, (t.tang = 'S' or k.dang_at is not null), t.thanh_vien[1]
                         order by case t.tang when 'A' then 0 else 1 end, t.at desc) as rn_em,
      row_number() over (partition by (coalesce(k.dang_at, t.at) at time zone 'Asia/Ho_Chi_Minh')::date, (t.tang = 'S' or k.dang_at is not null)
                         order by case t.tang when 'A' then 0 else 1 end, t.at desc) as rn_ngay,
      coalesce(k.dang_at, t.at) as moc, (coalesce(k.dang_at, t.at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay,
      (t.tang = 'S' and t.at >= now() - interval '24 hours') as ghim,
      case when t.tang = 'S' then 0 when k.dang_at is not null then 1 when t.tang = 'A' then 2 else 3 end as hang,
      jsonb_build_object(
        'khoe', case when k.dang_at is not null then jsonb_build_object('dang_at', k.dang_at,
                  'cau', (select d.noi_dung from the_gioi_danh_muc d where d.ma = k.cau_ma),
                  'la_em', k.hoc_sinh_id = v_me) end) ||
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
    left join lateral (select b.dang_at, b.cau_ma, b.hoc_sinh_id from the_gioi_bai_khoe b
                       where b.tin_khoa = t.khoa and b.go_at is null order by b.dang_at limit 1) k on true
    where case p_kenh
      when 'tg'  then t.tang = 'S' or k.dang_at is not null
      when 'lop' then t.lop_id = any(v_lop)
      when 'ban' then t.thanh_vien && v_ban
    end
    ) x
    where x.la_khoe or x.tang_goc = 'S' or (x.rn_em = 1 and x.rn_ngay <= 6)
    order by x.moc desc limit 60) q;

  if p_kenh = 'tg' then
    -- tin A gộp 1 thẻ / loại: hôm nay (huy hiệu ★1–3 gộp 7 ngày vì chốt tháng đổ dồn 1 ngày)
    select coalesce(jsonb_agg(g order by g->>'kieu'), '[]'::jsonb) into v_gop from (
      select jsonb_build_object('kieu', t.kieu, 'so', count(*),
        -- tổng bình luận (còn hiện) trên các tin trong thẻ gộp ⇒ nút 'Đọc bình luận (N)' (Thùy 29/09)
        'so_bl', (select count(*) from the_gioi_binh_luan b join _tgk u3 on u3.khoa = b.tin_khoa
                  where u3.tang = 'A' and u3.kieu = t.kieu and b.an_at is null and b.go_at is null
                    and u3.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end),
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
