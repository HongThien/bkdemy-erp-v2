-- MASTERY LƯU SẴN (Thùy 10/11) — bảng chụp kết quả mastery theo lần "tới hiện tại", đánh dấu BẨN khi dữ liệu nguồn đổi.
-- Đo trước (reports/do-man-cham-mastery.html): mỗi ngày chỉ ~40% HS có lần đo mới ⇒ phần lớn em đọc thẳng bảng được.
-- LUẬT GIỮ ĐÚNG TINH THẦN "mastery không lưu — suy động" (CLAUDE §1):
--   1. Bảng là BẢN CHỤP, không phải nguồn: chỉ fn_mastery_lam_moi ghi (bằng chính _mastery_lan_cap); app không ghi.
--   2. Xoá đi dựng lại lúc nào cũng được từ dữ liệu chấm gốc.
--   3. Đọc LUÔN đúng: em nào BẨN (hoặc chưa từng chụp) ⇒ tính trực tiếp như cũ; chỉ em SẠCH mới đọc bảng.
--      ⇒ lịch làm mới (pg_cron) chỉ quyết định NHANH hay không, không quyết định ĐÚNG hay không.
--   4. Đối chiếu: fn_mastery_doi_chieu(n) lấy ngẫu nhiên n em sạch, tính lại trực tiếp, báo ô lệch.
-- Chỉ chụp lời gọi "tới hiện tại, tham số mặc định" (p_since/p_den null, cửa sổ 5, tin 5/3, bản đồ đang bật) — 2 nguồn:
-- btvn=false (ET+MT, mặc định) và btvn=true (mọi nguồn, bổ trợ dùng). Gọi tại một MỐC (báo cáo tuần, trước/sau ca) vẫn tính trực tiếp.
-- Chỉ áp khi công tắc mastery_theo_lan BẬT (tắt ⇒ về theo câu, không dùng bảng).
-- Nguồn làm BẨN (trigger cấp câu lệnh, chỉ ghi cờ — không tính gì, chấm điểm không chậm thêm):
--   chấm buổi (gami_grades) · bài làm app (bai_lam_cau, bai_lam) · phiếu bổ trợ (bt_grades) · sửa câu của buổi/bài (gami_session_problems,
--   bai_test_cau) · đổi ngày buổi (buoi_hoc) · đổi khối HS · gán/đề xuất dạng cho câu (dai/hgt_bdm_gan_cau, _de_xuat; kể cả câu con theo
--   parent_ma_cau) · chuyển dạng sang nhóm khác / xoá dạng (dai_bdm_dang_bai) · bật/tắt công tắc mastery (đánh bẩn tất cả).
--   Nguồn hiếm không bắt (thêm/xoá bài Hình–Học, đổi dang_chinh / xoá câu ảnh hưởng quy "anh em") ⇒ lưới đêm: fn_mastery_danh_dau_tat_ca().

-- 1. Bảng
create table if not exists public.mastery_luu_san (
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  btvn boolean not null,                 -- false = ET+MT · true = mọi nguồn (p_include_btvn)
  cap text not null check (cap in ('dang', 'nhom')),
  nut text not null,                     -- mã dạng / mã nhóm
  score numeric not null, n integer not null, muc text not null, tin text not null,
  primary key (hoc_sinh_id, btvn, cap, nut)
);
create table if not exists public.mastery_luu_san_tinh (   -- em ĐÃ CHỤP (kể cả em 0 ô) + lúc chụp
  hoc_sinh_id uuid primary key references hoc_sinh(id) on delete cascade,
  tinh_at timestamptz not null default now()
);
create table if not exists public.mastery_ban (            -- em BẨN: dữ liệu nguồn đổi sau lần chụp
  hoc_sinh_id uuid primary key references hoc_sinh(id) on delete cascade,
  ban_at timestamptz not null default clock_timestamp()
);
alter table public.mastery_luu_san enable row level security;
alter table public.mastery_luu_san_tinh enable row level security;
alter table public.mastery_ban enable row level security;
-- không policy cho authenticated: chỉ đọc/ghi qua hàm security definer bên dưới

-- index phục vụ dò "ai từng làm câu này" khi bản đồ đổi dạng của câu
create index if not exists gami_session_problems_ma_cau_don_idx on public.gami_session_problems (ma_cau);
create index if not exists bai_test_cau_ma_cau_idx on public.bai_test_cau (ma_cau);
create index if not exists bai_lam_cau_bai_test_cau_id_idx on public.bai_lam_cau (bai_test_cau_id);

-- 2. Đánh dấu bẩn
create or replace function public._mastery_danh_dau_ban(p_hs uuid[])
returns void language sql volatile security definer set search_path = public as $$
  insert into mastery_ban (hoc_sinh_id, ban_at)
  select x, clock_timestamp() from (select distinct x from unnest(p_hs) x where x is not null) d
  on conflict (hoc_sinh_id) do update set ban_at = clock_timestamp()
$$;

-- HS từng làm các câu này (kể cả câu con nhận dạng theo câu mẹ)
create or replace function public._mastery_hs_lam_cau(p_ma_cau text[])
returns uuid[] language sql stable security definer set search_path = public as $$
  with c as (
    select unnest(p_ma_cau) as ma_cau
    union select q.ma_cau from dai_cau_hoi q where q.parent_ma_cau = any(p_ma_cau)
  )
  select array(
    select g.hoc_sinh_id from gami_session_problems sp join c on c.ma_cau = sp.ma_cau join gami_grades g on g.problem_id = sp.id
    union select bl.hoc_sinh_id from bai_test_cau btc join c on c.ma_cau = btc.ma_cau
            join bai_lam_cau blc on blc.bai_test_cau_id = btc.id join bai_lam bl on bl.id = blc.bai_lam_id
    union select tl.hoc_sinh_id from bt_grades b join c on c.ma_cau = b.ma_cau join tai_lieu tl on tl.id = b.tai_lieu_id
  )
$$;

-- trigger cấp câu lệnh — transition table: moi (NEW TABLE) / cu (OLD TABLE)
create or replace function public._mastery_ban_tg()
returns trigger language plpgsql security definer set search_path = public as $$
declare v uuid[] := '{}';
begin
  if TG_TABLE_NAME = 'gami_grades' then
    if TG_OP in ('INSERT', 'UPDATE') then v := v || array(select hoc_sinh_id from moi); end if;
    if TG_OP in ('UPDATE', 'DELETE') then v := v || array(select hoc_sinh_id from cu); end if;
  elsif TG_TABLE_NAME = 'bai_lam_cau' then
    if TG_OP in ('INSERT', 'UPDATE') then v := v || array(select bl.hoc_sinh_id from moi join bai_lam bl on bl.id = moi.bai_lam_id); end if;
    if TG_OP in ('UPDATE', 'DELETE') then v := v || array(select bl.hoc_sinh_id from cu join bai_lam bl on bl.id = cu.bai_lam_id); end if;
  elsif TG_TABLE_NAME = 'bai_lam' then
    if TG_OP = 'UPDATE' then v := array(select moi.hoc_sinh_id from moi join cu on cu.id = moi.id where moi.trang_thai is distinct from cu.trang_thai);
    elsif TG_OP = 'DELETE' then v := array(select hoc_sinh_id from cu); end if;
  elsif TG_TABLE_NAME = 'bt_grades' then
    if TG_OP in ('INSERT', 'UPDATE') then v := v || array(select tl.hoc_sinh_id from moi join tai_lieu tl on tl.id = moi.tai_lieu_id); end if;
    if TG_OP in ('UPDATE', 'DELETE') then v := v || array(select tl.hoc_sinh_id from cu join tai_lieu tl on tl.id = cu.tai_lieu_id); end if;
  elsif TG_TABLE_NAME = 'gami_session_problems' then
    v := array(select g.hoc_sinh_id from moi join cu on cu.id = moi.id join gami_grades g on g.problem_id = moi.id
               where (moi.ma_dang, moi.ma_cau, moi.phase, moi.buoi_hoc_id, moi.hinh_baitoan_id)
                     is distinct from (cu.ma_dang, cu.ma_cau, cu.phase, cu.buoi_hoc_id, cu.hinh_baitoan_id));
  elsif TG_TABLE_NAME = 'bai_test_cau' then
    v := array(select bl.hoc_sinh_id from moi join cu on cu.id = moi.id
               join bai_lam_cau blc on blc.bai_test_cau_id = moi.id join bai_lam bl on bl.id = blc.bai_lam_id
               where (moi.ma_dang, moi.ma_cau) is distinct from (cu.ma_dang, cu.ma_cau));
  elsif TG_TABLE_NAME = 'buoi_hoc' then
    v := array(select g.hoc_sinh_id from moi join cu on cu.id = moi.id
               join gami_session_problems sp on sp.buoi_hoc_id = moi.id join gami_grades g on g.problem_id = sp.id
               where moi.ngay is distinct from cu.ngay);
  elsif TG_TABLE_NAME = 'hoc_sinh' then
    v := array(select moi.id from moi join cu on cu.id = moi.id where moi.khoi is distinct from cu.khoi);
  elsif TG_TABLE_NAME in ('dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat') then
    if TG_OP = 'INSERT' then v := public._mastery_hs_lam_cau(array(select ma_cau from moi));
    elsif TG_OP = 'DELETE' then v := public._mastery_hs_lam_cau(array(select ma_cau from cu));
    else v := public._mastery_hs_lam_cau(array(select ma_cau from moi union select ma_cau from cu)); end if;
  elsif TG_TABLE_NAME = 'dai_bdm_dang_bai' then
    if TG_OP = 'UPDATE' then
      v := array(select distinct s.hoc_sinh_id from moi join cu on cu.id = moi.id join mastery_luu_san s on s.cap = 'dang' and s.nut = moi.id
                 where moi.nhom_id is distinct from cu.nhom_id);
    else v := array(select distinct s.hoc_sinh_id from cu join mastery_luu_san s on s.cap = 'dang' and s.nut = cu.id); end if;
  elsif TG_TABLE_NAME = 'he_thong_cong_tac' then
    if exists (select 1 from moi join cu on cu.ma = moi.ma where moi.ma in ('mastery_theo_lan', 'mastery_ban_do_moi') and moi.bat is distinct from cu.bat) then
      perform public.fn_mastery_danh_dau_tat_ca();
    end if;
    return null;
  end if;
  if cardinality(v) > 0 then perform public._mastery_danh_dau_ban(v); end if;
  return null;
end $$;

-- gắn trigger (mỗi sự kiện một trigger vì transition table)
do $$
declare t text; e text;
begin
  foreach t in array array['gami_grades', 'bai_lam_cau', 'bt_grades', 'dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat'] loop
    execute format('drop trigger if exists trg_mastery_ban_ins on public.%I', t);
    execute format('create trigger trg_mastery_ban_ins after insert on public.%I referencing new table as moi for each statement execute function public._mastery_ban_tg()', t);
    execute format('drop trigger if exists trg_mastery_ban_upd on public.%I', t);
    execute format('create trigger trg_mastery_ban_upd after update on public.%I referencing new table as moi old table as cu for each statement execute function public._mastery_ban_tg()', t);
    execute format('drop trigger if exists trg_mastery_ban_del on public.%I', t);
    execute format('create trigger trg_mastery_ban_del after delete on public.%I referencing old table as cu for each statement execute function public._mastery_ban_tg()', t);
  end loop;
  foreach t in array array['bai_lam', 'gami_session_problems', 'bai_test_cau', 'buoi_hoc', 'hoc_sinh', 'dai_bdm_dang_bai', 'he_thong_cong_tac'] loop
    execute format('drop trigger if exists trg_mastery_ban_upd on public.%I', t);
    execute format('create trigger trg_mastery_ban_upd after update on public.%I referencing new table as moi old table as cu for each statement execute function public._mastery_ban_tg()', t);
  end loop;
  foreach t in array array['bai_lam', 'dai_bdm_dang_bai'] loop
    execute format('drop trigger if exists trg_mastery_ban_del on public.%I', t);
    execute format('create trigger trg_mastery_ban_del after delete on public.%I referencing old table as cu for each statement execute function public._mastery_ban_tg()', t);
  end loop;
end $$;

-- 3. Lưới: đánh bẩn tất cả HS đang có bản chụp (đêm / khi đổi công tắc). Không xoá bản chụp — đọc vẫn đúng vì em bẩn tính trực tiếp.
create or replace function public.fn_mastery_danh_dau_tat_ca()
returns integer language sql volatile security definer set search_path = public as $$
  with x as (
    insert into mastery_ban (hoc_sinh_id, ban_at)
    select hoc_sinh_id, clock_timestamp() from mastery_luu_san_tinh
    on conflict (hoc_sinh_id) do update set ban_at = clock_timestamp()
    returning 1
  ) select count(*)::int from x
$$;

-- 4. Làm mới: chụp lại em BẨN + em đang học CHƯA chụp; mỗi lô 20 em; hộp thời gian. Trả số em còn chờ.
--    Chống đua: chỉ gỡ cờ bẩn nếu ban_at còn đúng giá trị đọc được lúc bắt đầu (bị đánh bẩn lại trong lúc tính ⇒ giữ cờ).
create or replace function public.fn_mastery_lam_moi(p_giay integer default 20)
returns integer language plpgsql volatile security definer set search_path = public as $$
declare v_t0 timestamptz := clock_timestamp(); v_bdm boolean := public._mastery_bdm_bat(); r record; v_lo uuid[]; v_ban jsonb;
begin
  if not public._mastery_theo_lan_bat() then return 0; end if;
  loop
    exit when clock_timestamp() - v_t0 > make_interval(secs => greatest(1, least(coalesce(p_giay, 20), 240)));
    select coalesce(array_agg(x.hs), '{}'), coalesce(jsonb_object_agg(x.hs, x.ban_at), '{}') into v_lo, v_ban
    from (
      select b.hoc_sinh_id as hs, b.ban_at from mastery_ban b order by b.ban_at limit 20
    ) x;
    if cardinality(v_lo) = 0 then
      select coalesce(array_agg(h.id), '{}') into v_lo
      from (select h.id from hoc_sinh h
            where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id)
            order by h.id limit 20) h;
    end if;
    exit when cardinality(v_lo) = 0;
    delete from mastery_luu_san where hoc_sinh_id = any(v_lo);
    insert into mastery_luu_san (hoc_sinh_id, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, false, m.cap, m.nut, m.score, m.n, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_lo, false, null, null, array['dang', 'nhom'], 5, 5, 3) m where m.score is not null
    union all
    select m.hoc_sinh_id, true, m.cap, m.nut, m.score, m.n, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_lo, true, null, null, array['dang', 'nhom'], 5, 5, 3) m where m.score is not null;
    insert into mastery_luu_san_tinh (hoc_sinh_id, tinh_at) select unnest(v_lo), now()
      on conflict (hoc_sinh_id) do update set tinh_at = excluded.tinh_at;
    delete from mastery_ban b where b.hoc_sinh_id = any(v_lo) and b.ban_at = (v_ban ->> b.hoc_sinh_id::text)::timestamptz;
  end loop;
  return (select count(*) from mastery_ban)::int
       + (select count(*) from hoc_sinh h where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id))::int;
end $$;

-- 5. Đọc. Em SẠCH = đã chụp và không bẩn. Người gọi không phải nhân sự (HS) chỉ được đọc bản chụp của chính mình.
create or replace function public._mastery_hs_sach(p_hs uuid[])
returns uuid[] language sql stable security definer set search_path = public as $$
  select array(
    select x from unnest(p_hs) x
    where exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = x)
      and not exists (select 1 from mastery_ban b where b.hoc_sinh_id = x)
      and (session_user <> 'authenticator' or public.la_thanh_vien()
           or exists (select 1 from tai_khoan tk where tk.id = public.jwt_uid() and tk.hoc_sinh_id = x))
  )
$$;
create or replace function public._mastery_luu_san_doc(p_hs uuid[], p_btvn boolean, p_caps text[])
returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
language sql stable security definer set search_path = public as $$
  select s.hoc_sinh_id, s.cap, s.nut, s.score, s.n::bigint, s.muc, s.tin
  from mastery_luu_san s where s.hoc_sinh_id = any(public._mastery_hs_sach(p_hs)) and s.btvn = p_btvn and s.cap = any(p_caps)
$$;

-- cùng chữ ký _mastery_lan_cap: bản chụp cho em sạch + tính trực tiếp cho em còn lại; tham số khác mặc định ⇒ tính trực tiếp hết
create or replace function public._mastery_lan_cap_nhanh(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                         p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[],
                                                         p_window integer, p_tin_cao integer, p_tin_tb integer)
returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
language plpgsql stable rows 20000 as $$
declare v_sach uuid[]; v_con uuid[];
begin
  if p_since is null and p_den is null and p_window = 5 and p_tin_cao = 5 and p_tin_tb = 3
     and p_bdm = public._mastery_bdm_bat() and public._mastery_theo_lan_bat() then
    v_sach := public._mastery_hs_sach(p_hs);
    if cardinality(v_sach) > 0 then
      return query select * from public._mastery_luu_san_doc(v_sach, coalesce(p_include_btvn, false), p_caps);
    end if;
    v_con := array(select unnest(p_hs) except select unnest(v_sach));
    if cardinality(v_con) > 0 then
      return query select * from public._mastery_lan_cap(p_bdm, v_con, p_include_btvn, null, null, p_caps, p_window, p_tin_cao, p_tin_tb);
    end if;
  else
    return query select * from public._mastery_lan_cap(p_bdm, p_hs, p_include_btvn, p_since, p_den, p_caps, p_window, p_tin_cao, p_tin_tb);
  end if;
end $$;

-- 6. Nối đường đọc: mọi chỗ đang gọi _mastery_lan_cap để ĐỌC chuyển sang bản nhanh (fn_mastery_lam_moi vẫn gọi bản tính).
create or replace function public._mastery_lan_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                    p_since timestamp with time zone, p_den timestamp with time zone, p_cap text,
                                                    p_window integer, p_tin_cao integer, p_tin_tb integer)
returns table(hoc_sinh_id uuid, nut text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  select c.hoc_sinh_id, c.nut, c.score, c.n, c.muc, c.tin
  from public._mastery_lan_cap_nhanh(p_bdm, p_hs, p_include_btvn, p_since, p_den, array[p_cap], p_window, p_tin_cao, p_tin_tb) c
$$;

do $$
declare f text; d text;
begin
  -- thay đúng lời gọi _mastery_lan_cap( ⇒ _mastery_lan_cap_nhanh( trong 3 hàm đọc của bổ trợ (định nghĩa hiện hành, không chép tay)
  foreach f in array array['_btyeu_dang_theo_nhom', 'fn_btyeu_case_dang_nhom', 'fn_btyeu_dang_goi_y_nhom'] loop
    select pg_get_functiondef(p.oid) into d from pg_proc p where p.proname = f and p.pronamespace = 'public'::regnamespace;
    if d is null or position('public._mastery_lan_cap(' in d) = 0 then raise exception 'Không thấy lời gọi _mastery_lan_cap trong %', f; end if;
    execute replace(d, 'public._mastery_lan_cap(', 'public._mastery_lan_cap_nhanh(');
  end loop;
end $$;

-- 7. Đối chiếu: n em sạch ngẫu nhiên, bản chụp vs tính trực tiếp (cả 2 nguồn). Trả số ô lệch + mẫu.
create or replace function public.fn_mastery_doi_chieu(p_so integer default 20)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_hs uuid[]; v_bdm boolean := public._mastery_bdm_bat(); v_lech jsonb;
begin
  select array_agg(hoc_sinh_id) into v_hs from (
    select t.hoc_sinh_id from mastery_luu_san_tinh t where not exists (select 1 from mastery_ban b where b.hoc_sinh_id = t.hoc_sinh_id)
    order by random() limit greatest(1, least(coalesce(p_so, 20), 200))) x;
  if v_hs is null then return jsonb_build_object('so_em', 0, 'lech', 0); end if;
  with song as (
    select m.hoc_sinh_id, false as btvn, m.cap, m.nut, m.score, m.n::int as n, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_hs, false, null, null, array['dang', 'nhom'], 5, 5, 3) m where m.score is not null
    union all
    select m.hoc_sinh_id, true, m.cap, m.nut, m.score, m.n::int, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_hs, true, null, null, array['dang', 'nhom'], 5, 5, 3) m where m.score is not null
  ),
  chup as (select hoc_sinh_id, btvn, cap, nut, score, n, muc, tin from mastery_luu_san where hoc_sinh_id = any(v_hs)),
  lech as ((select 'chi_tinh' as loai, * from (select * from song except select * from chup) a)
           union all (select 'chi_chup', * from (select * from chup except select * from song) b))
  select jsonb_build_object('so_em', cardinality(v_hs), 'lech', (select count(*) from lech),
                            'mau', coalesce((select jsonb_agg(to_jsonb(l)) from (select * from lech limit 10) l), '[]'::jsonb))
    into v_lech;
  return v_lech;
end $$;

revoke all on function public._mastery_danh_dau_ban(uuid[]) from public, anon, authenticated;
revoke all on function public._mastery_hs_lam_cau(text[]) from public, anon, authenticated;
revoke all on function public.fn_mastery_danh_dau_tat_ca() from public, anon, authenticated;
revoke all on function public.fn_mastery_lam_moi(integer) from public, anon, authenticated;
revoke all on function public.fn_mastery_doi_chieu(integer) from public, anon, authenticated;
grant execute on function public.fn_mastery_lam_moi(integer) to service_role;
grant execute on function public.fn_mastery_danh_dau_tat_ca() to service_role;
grant execute on function public.fn_mastery_doi_chieu(integer) to service_role;
revoke all on function public._mastery_hs_sach(uuid[]) from public, anon;
revoke all on function public._mastery_luu_san_doc(uuid[], boolean, text[]) from public, anon;
revoke all on function public._mastery_lan_cap_nhanh(boolean, uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) from public, anon;
grant execute on function public._mastery_hs_sach(uuid[]) to authenticated, service_role;
grant execute on function public._mastery_luu_san_doc(uuid[], boolean, text[]) to authenticated, service_role;
grant execute on function public._mastery_lan_cap_nhanh(boolean, uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) to authenticated, service_role;

-- 8. LỊCH (chạy TAY trong Supabase SQL Editor — role migrate không có quyền schema cron):
--   5 phút/lần, NGHỈ 17:00–22:59 giờ VN (= 10–15 UTC, giờ HS chơi — trong giờ đó em bẩn vẫn tính trực tiếp như trước, chỉ không nhanh hơn):
--   select cron.schedule('mastery_lam_moi', '*/5 0-9,16-23 * * *', $c$select public.fn_mastery_lam_moi(50)$c$);
--   select cron.schedule('mastery_luoi_dem', '0 19 * * *', $c$select public.fn_mastery_danh_dau_tat_ca()$c$);   -- 02:00 giờ VN (cron chạy UTC)
