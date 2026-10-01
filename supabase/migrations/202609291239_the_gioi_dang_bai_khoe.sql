-- ============================================================================
-- THẾ GIỚI BK — ĐĂNG BÀI KHOE (Thùy 29/09, tính năng CHÍNH của kênh):
--   "HS không được tự đăng bài ⇒ Đăng bài = Đăng bài khoe. Làm xong việc tốt ⇒ hiện 'Đăng bài khoe BK nào', bấm mới lên kênh Thế giới.
--    Tin chính của Thế giới là do người đăng; tin hệ thống tự đăng ít thôi, chủ yếu tin S giật gân."
--   Chốt: (1) HS khoe là LÊN THẾ GIỚI — tầng S/A/B chỉ dùng cho tin hệ thống tự đăng · (2) thành tích đủ chuẩn nào cũng khoe được ·
--   (3) tối đa 3 bài khoe / em / ngày (giờ VN) · hạn khoe 3 ngày kể từ lúc đạt (CTO đề xuất, Thùy không phản đối).
-- Thành tích = tin SUY từ sự kiện thật (_the_gioi_tin) ⇒ em không bịa được; bài khoe = 1 dòng khi em BẤM (CLAUDE §1.5), gỡ = go_at.
-- Kèm: câu dẫn của người khoe (nhóm 'khoe') · bình luận chọn được MỌI câu khen (Thùy: "list 30 câu mà app mới có 4–5 câu").
-- ============================================================================

create table public.the_gioi_bai_khoe (
  id          uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  tin_khoa    text not null check (tin_khoa ~ '^[a-z_]+:'),   -- khoá tự nhiên của thành tích (CLAUDE §2)
  cau_ma      text references public.the_gioi_danh_muc(ma),  -- câu dẫn em chọn; NULL = em không kèm câu (không áp dụng)
  dang_at     timestamptz not null default now(),
  go_at       timestamptz,                                    -- em tự gỡ bài
  updated_at  timestamptz not null default now(),
  unique (hoc_sinh_id, tin_khoa)
);
create index the_gioi_bai_khoe_tin_idx on public.the_gioi_bai_khoe (tin_khoa) where go_at is null;
create index the_gioi_bai_khoe_ngay_idx on public.the_gioi_bai_khoe (hoc_sinh_id, dang_at);
create trigger the_gioi_bai_khoe_log after insert or update or delete on public.the_gioi_bai_khoe for each row execute function public._the_gioi_ghi_log();
alter table public.the_gioi_bai_khoe enable row level security;   -- không policy: chỉ qua hàm

-- Câu dẫn của NGƯỜI KHOE (khác câu khen của người xem). Nháp CTO — Thùy duyệt/sửa trong danh mục.
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('k01','cau','Cày mãi mới được đó 😤','{khoe}',201), ('k02','cau','Nhẹ nhàng thôi mà 😎','{khoe}',202),
  ('k03','cau','Hôm nay tớ hơi đỉnh 🔥','{khoe}',203), ('k04','cau','Không ngờ luôn á 😳','{khoe}',204),
  ('k05','cau','Công sức cả tuần đây 💪','{khoe}',205), ('k06','cau','Lần đầu làm được luôn! 🥳','{khoe}',206),
  ('k07','cau','Chia vía cho mọi người nè 🍀','{khoe}',207), ('k08','cau','Cảm ơn thầy cô nhiều 🫡','{khoe}',208),
  ('k09','cau','Chưa phải giới hạn đâu 🚀','{khoe}',209), ('k10','cau','Ai học cùng tớ không? 🤝','{khoe}',210),
  ('k11','cau','Khoe xíu thôi nha 🤭','{khoe}',211), ('k12','cau','Cố gắng được đền đáp rồi ✨','{khoe}',212);

-- Thành tích CHỜ KHOE của 1 em: của em (hoặc đội em) · đạt trong 3 ngày · không phải tin S (S hệ thống đã tự đăng) · chưa từng khoe.
create or replace function public._the_gioi_cho_khoe(p_me uuid)
returns setof record language sql stable security definer set search_path = public as $$
  select t.khoa, t.tang, t.nhom, t.kieu, t.mon, t.at, t.chi_tiet, t.lop_id
  from public._the_gioi_tin(now() - interval '3 days') t
  where p_me = any(t.thanh_vien) and t.tang <> 'S'
    and not exists (select 1 from the_gioi_bai_khoe b where b.hoc_sinh_id = p_me and b.tin_khoa = t.khoa)
$$;

create or replace function public.fn_the_gioi_cho_khoe()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_hom_nay timestamptz := ((now() at time zone 'Asia/Ho_Chi_Minh')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
begin
  if v_me is null then return null; end if;
  return jsonb_build_object(
    'gioi_han', 3,
    'da_khoe_hom_nay', (select count(*) from the_gioi_bai_khoe where hoc_sinh_id = v_me and dang_at >= v_hom_nay),
    'tin', coalesce((select jsonb_agg(jsonb_build_object('khoa', x.khoa, 'tang', x.tang, 'nhom', x.nhom, 'kieu', x.kieu, 'mon', x.mon, 'at', x.at,
                       'chi_tiet', x.chi_tiet, 'lop', (select ten_lop from lop where id = x.lop_id)) order by x.at desc)
                     from public._the_gioi_cho_khoe(v_me) as x(khoa text, tang text, nhom text, kieu text, mon text, at timestamptz, chi_tiet jsonb, lop_id uuid)), '[]'::jsonb));
end $$;

create or replace function public.fn_the_gioi_khoe(p_khoa text, p_cau text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_hom_nay timestamptz := ((now() at time zone 'Asia/Ho_Chi_Minh')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh'; v_n int;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới khoe được'; end if;
  if exists (select 1 from the_gioi_bai_khoe where hoc_sinh_id = v_me and tin_khoa = p_khoa) then raise exception 'Thành tích này em đã khoe rồi'; end if;
  if not exists (select 1 from public._the_gioi_cho_khoe(v_me) as x(khoa text, tang text, nhom text, kieu text, mon text, at timestamptz, chi_tiet jsonb, lop_id uuid)
                 where x.khoa = p_khoa) then raise exception 'Thành tích này không còn khoe được (quá 3 ngày hoặc không phải của em)'; end if;
  if p_cau is not null and not exists (select 1 from the_gioi_danh_muc where ma = p_cau and loai = 'cau' and 'khoe' = any(nhom) and an_at is null) then
    raise exception 'Câu dẫn không hợp lệ'; end if;
  perform pg_advisory_xact_lock(hashtext('the_gioi_khoe:' || v_me));   -- 2 lần bấm cùng lúc không vượt giới hạn
  select count(*) into v_n from the_gioi_bai_khoe where hoc_sinh_id = v_me and dang_at >= v_hom_nay;
  if v_n >= 3 then raise exception 'Hôm nay em đã khoe 3 bài rồi — mai khoe tiếp nhé!'; end if;
  insert into the_gioi_bai_khoe (hoc_sinh_id, tin_khoa, cau_ma) values (v_me, p_khoa, p_cau);
  return jsonb_build_object('gioi_han', 3, 'da_khoe_hom_nay', v_n + 1);
end $$;

create or replace function public.fn_the_gioi_go_khoe(p_khoa text)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  update the_gioi_bai_khoe set go_at = now(), updated_at = now() where hoc_sinh_id = v_me and tin_khoa = p_khoa and go_at is null;
  if not found then raise exception 'Không thấy bài khoe của em'; end if;
end $$;

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
  select coalesce(jsonb_agg(j order by ghim desc, ngay desc, hang, moc desc), '[]'::jsonb) into v_tin from (
    select coalesce(k.dang_at, t.at) as moc, (coalesce(k.dang_at, t.at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay,
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
      when 'lop' then (t.tang in ('S', 'A') or k.dang_at is not null) and t.lop_id = any(v_lop)
      when 'ban' then (t.tang in ('S', 'A') or k.dang_at is not null) and t.thanh_vien && v_ban
    end
    order by coalesce(k.dang_at, t.at) desc limit 60) q;

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

-- Bình luận: người xem chọn được MỌI câu khen (không còn giới hạn câu hợp loại — app xếp câu hợp loại lên đầu).
CREATE OR REPLACE FUNCTION public.fn_the_gioi_binh_luan(p_khoa text, p_ma text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_me uuid := public.my_hoc_sinh_id(); v_tin record; v_chu boolean; v_ban uuid[]; v_bl the_gioi_binh_luan;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới bình luận được'; end if;
  select * into v_tin from public._the_gioi_tin_mo(p_khoa);
  v_chu := v_me = any(v_tin.thanh_vien);
  if not v_chu and exists (select 1 from the_gioi_an_tin a where a.tin_khoa = p_khoa and a.an) then raise exception 'Tin đã được chủ tin ẩn'; end if;
  if not exists (select 1 from the_gioi_danh_muc d where d.ma = p_ma and d.an_at is null and (
      d.loai = 'sticker'
      or (d.loai = 'cau' and case when v_chu then 'cam_on' = any(d.nhom) else not (d.nhom && array['cam_on', 'khoe']) end))) then
    raise exception 'Câu/sticker không hợp tin này'; end if;
  if (select count(*) from the_gioi_binh_luan where tin_khoa = p_khoa and hs_id = v_me and go_at is null) >= 3 then
    raise exception 'Mỗi tin em bình luận tối đa 3 lần'; end if;
  insert into the_gioi_binh_luan (tin_khoa, hs_id, noi_dung_ma) values (p_khoa, v_me, p_ma) returning * into v_bl;
  v_ban := array(select public._ban_be_cua(v_me));
  return jsonb_build_object('bl', public._the_gioi_bl_json(v_bl, v_me, v_ban), 'khen', public._the_gioi_khen_json(p_khoa, v_me, v_ban));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_the_gioi_home()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ban uuid[];
  v_khoa text[];
  v_tin jsonb;
  v_tt jsonb;
begin
  if v_me is null then return null; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_khoa := array(select t.khoa from public._the_gioi_tin(now() - interval '30 days') t where v_me = any(t.thanh_vien));

  -- tương tác mới trên tin của em (không đếm của chính em, không đếm cái em đã ẩn)
  with moi as (
    select k.hs_id, k.updated_at at from the_gioi_khen k
      where k.tin_khoa = any(v_khoa) and k.hs_id is not null and k.hs_id <> v_me and k.an_at is null and k.updated_at >= now() - interval '24 hours'
    union all
    select b.hs_id, b.created_at from the_gioi_binh_luan b
      where b.tin_khoa = any(v_khoa) and b.hs_id <> v_me and b.an_at is null and b.go_at is null and b.created_at >= now() - interval '24 hours'
  )
  select jsonb_build_object('so', count(*), 'so_nguoi', count(distinct hs_id),
           'nguoi', (select public._the_gioi_nguoi(m2.hs_id, (select ten_lop from public._the_gioi_lop(m2.hs_id, null)), m2.hs_id = any(v_ban))
                     from moi m2 order by m2.at desc limit 1))
    into v_tt from moi;

  -- tin nổi bật: S của Thế giới (đã lọc quyền/ẩn trong fn_the_gioi_kenh), thiếu thì tin của bạn bè, rồi của lớp
  v_tin := coalesce((public.fn_the_gioi_kenh('tg'))->'tin', '[]'::jsonb);
  if jsonb_array_length(v_tin) = 0 then v_tin := coalesce((public.fn_the_gioi_kenh('ban'))->'tin', '[]'::jsonb); end if;
  if jsonb_array_length(v_tin) = 0 then v_tin := coalesce((public.fn_the_gioi_kenh('lop'))->'tin', '[]'::jsonb); end if;

  return jsonb_build_object(
    'cho_khoe', (select public.fn_the_gioi_cho_khoe()),   -- thành tích chờ khoe ⇒ Home mời "Đăng bài khoe BK nào!"
    'tuong_tac', v_tt,
    'loi_moi', (select count(*) from ban_be_loi_moi where nguoi_nhan = v_me and trang_thai = 'cho'),
    'tin', coalesce((select jsonb_agg(x - 'khen') from (select x from jsonb_array_elements(v_tin) x
                      where not coalesce((x->>'cua_toi')::boolean, false) limit 2) q), '[]'::jsonb));
end $function$;

revoke execute on function public._the_gioi_cho_khoe(uuid) from public, anon, authenticated;
revoke execute on function public.fn_the_gioi_cho_khoe() from public, anon;
revoke execute on function public.fn_the_gioi_khoe(text, text) from public, anon;
revoke execute on function public.fn_the_gioi_go_khoe(text) from public, anon;
grant execute on function public.fn_the_gioi_cho_khoe() to authenticated;
grant execute on function public.fn_the_gioi_khoe(text, text) to authenticated;
grant execute on function public.fn_the_gioi_go_khoe(text) to authenticated;
