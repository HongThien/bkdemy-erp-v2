-- SỬA GẤP (Thùy 10/11 ~19:50 — màn Chấm MT "canceling statement due to statement timeout" từng lúc, đổi lớp ~5 s):
-- GỐC (đã tái hiện bằng 2 kết nối): trigger ghi điểm đánh dấu em "bẩn" bằng UPSERT vào mastery_ban; lượt làm mới mastery
-- (fn_mastery_lam_moi, 5 phút/lần, 1 giao dịch tới 20–53 s) XOÁ đúng các dòng đó ⇒ giữ khoá tới hết lượt ⇒ lệnh ghi điểm /
-- dựng lưới MT của em đang được làm mới phải ĐỨNG CHỜ ⇒ quá 8 s là timeout. Em vừa được chấm = em đang bẩn ⇒ hay đụng nhau.
-- SỬA: đánh dấu bẩn = CHỈ GHI THÊM 1 dòng nhật ký (mastery_ban_log, không khoá duy nhất) ⇒ ghi điểm KHÔNG BAO GIỜ chờ khoá.
--   · em BẨN = có dòng nhật ký mới hơn MỐC bản chụp của em (mastery_luu_san_tinh.moc);
--   · lượt làm mới: mốc = lúc bắt đầu − 2 phút (bù giao dịch ghi điểm đang dở lúc bắt đầu) ⇒ không sót; em có điểm trong 2 phút
--     đó vẫn bẩn tới lượt sau (đọc vẫn đúng vì em bẩn tính trực tiếp);
--   · dọn nhật ký: chỉ xoá dòng CŨ (> 10 phút, đã nằm dưới mốc) — không đụng dòng đang được chèn.
-- Bảng mastery_ban cũ: thôi dùng, KHÔNG xoá (dòng còn lại chép sang nhật ký). Mọi thứ khác giữ nguyên (khoá 1 lượt, 4 tầng,
-- chụp lại em thiếu tầng chuyên đề — thân lượt làm mới lấy theo bản ĐANG CHẠY ở mig 202611101756).
-- MẤT GÌ: không. Thêm 1 bảng, 1 cột (mặc định), thay 5 hàm.

create table if not exists public.mastery_ban_log (
  id bigserial primary key,
  hoc_sinh_id uuid not null,
  at timestamptz not null default clock_timestamp()
);
create index if not exists mastery_ban_log_hs_at_idx on public.mastery_ban_log (hoc_sinh_id, at);
alter table public.mastery_ban_log enable row level security;

alter table public.mastery_luu_san_tinh add column if not exists moc timestamptz not null default '-infinity';
update public.mastery_luu_san_tinh set moc = tinh_at - interval '2 minutes' where moc = '-infinity';
insert into public.mastery_ban_log (hoc_sinh_id, at) select hoc_sinh_id, ban_at from public.mastery_ban;

-- 1. đánh dấu bẩn: chỉ chèn, không bao giờ chờ khoá
create or replace function public._mastery_danh_dau_ban(p_hs uuid[])
returns void language sql volatile security definer set search_path = public as $$
  insert into mastery_ban_log (hoc_sinh_id) select distinct x from unnest(p_hs) x where x is not null
$$;

create or replace function public.fn_mastery_danh_dau_tat_ca()
returns integer language sql volatile security definer set search_path = public as $$
  with x as (insert into mastery_ban_log (hoc_sinh_id) select hoc_sinh_id from mastery_luu_san_tinh returning 1)
  select count(*)::int from x
$$;

-- 2. em SẠCH = đã chụp và không có dòng nhật ký mới hơn mốc
create or replace function public._mastery_hs_sach(p_hs uuid[])
returns uuid[] language sql stable security definer set search_path = public as $$
  select array(
    select x from unnest(p_hs) x
    join mastery_luu_san_tinh t on t.hoc_sinh_id = x
    where not exists (select 1 from mastery_ban_log l where l.hoc_sinh_id = x and l.at > t.moc)
      and (session_user <> 'authenticator' or public.la_thanh_vien()
           or exists (select 1 from tai_khoan tk where tk.id = public.jwt_uid() and tk.hoc_sinh_id = x))
  )
$$;

-- 3. làm mới
create or replace function public.fn_mastery_lam_moi(p_giay integer default 20)
returns integer language plpgsql volatile security definer set search_path = public as $$
declare v_t0 timestamptz := clock_timestamp(); v_moc timestamptz := clock_timestamp() - interval '2 minutes';
        v_bdm boolean := public._mastery_bdm_bat(); v_lo uuid[]; v_xong uuid[] := '{}';
begin
  if not public._mastery_theo_lan_bat() then return 0; end if;
  if not pg_try_advisory_xact_lock(hashtext('fn_mastery_lam_moi')) then return -1; end if;   -- đang có lượt khác chạy
  loop
    exit when clock_timestamp() - v_t0 > make_interval(secs => greatest(1, least(coalesce(p_giay, 20), 240)));
    -- em bẩn (nhật ký mới hơn mốc), cũ nhất trước; bỏ em vừa làm trong lượt này
    select coalesce(array_agg(z.hs), '{}') into v_lo
    from (select l.hoc_sinh_id as hs, min(l.at) as tu
            from mastery_ban_log l left join mastery_luu_san_tinh t on t.hoc_sinh_id = l.hoc_sinh_id
           where (t.hoc_sinh_id is null or l.at > t.moc) and not (l.hoc_sinh_id = any(v_xong))
           group by l.hoc_sinh_id order by min(l.at) limit 20) z;
    if cardinality(v_lo) = 0 then
      select coalesce(array_agg(h.id), '{}') into v_lo
      from (select h.id from hoc_sinh h
            where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id)
              and not (h.id = any(v_xong))
            order by h.id limit 20) h;
    end if;
    if cardinality(v_lo) = 0 then   -- 10/11: bản chụp cũ thiếu cấp chuyên đề/chủ đề (mig 202611101756) ⇒ chụp lại dần, cũ nhất trước
      select coalesce(array_agg(z.hoc_sinh_id), '{}') into v_lo
      from (select t.hoc_sinh_id from mastery_luu_san_tinh t
            where exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = t.hoc_sinh_id and s.cap = 'nhom')
              and not exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = t.hoc_sinh_id and s.cap = 'chuyen_de')
              and not (t.hoc_sinh_id = any(v_xong))
            order by t.tinh_at limit 20) z;
    end if;
    exit when cardinality(v_lo) = 0;
    delete from mastery_luu_san where hoc_sinh_id = any(v_lo);
    insert into mastery_luu_san (hoc_sinh_id, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, false, m.cap, m.nut, m.score, m.n, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_lo, false, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
    union all
    select m.hoc_sinh_id, true, m.cap, m.nut, m.score, m.n, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_lo, true, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
    on conflict (hoc_sinh_id, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin;
    insert into mastery_luu_san_tinh (hoc_sinh_id, tinh_at, moc) select unnest(v_lo), now(), v_moc
      on conflict (hoc_sinh_id) do update set tinh_at = excluded.tinh_at, moc = excluded.moc;
    v_xong := v_xong || v_lo;
  end loop;
  -- dọn nhật ký cũ đã nằm dưới mốc (không đụng dòng mới đang chèn)
  delete from mastery_ban_log l using mastery_luu_san_tinh t
   where t.hoc_sinh_id = l.hoc_sinh_id and l.at <= t.moc and l.at < clock_timestamp() - interval '10 minutes';
  return (select count(distinct l.hoc_sinh_id) from mastery_ban_log l left join mastery_luu_san_tinh t on t.hoc_sinh_id = l.hoc_sinh_id
           where t.hoc_sinh_id is null or l.at > t.moc)::int
       + (select count(*) from hoc_sinh h where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id))::int;
end $$;

-- 4. đối chiếu: chỉ lấy em sạch theo nhật ký
create or replace function public.fn_mastery_doi_chieu(p_so integer default 20)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_hs uuid[]; v_bdm boolean := public._mastery_bdm_bat(); v_lech jsonb;
begin
  select array_agg(hoc_sinh_id) into v_hs from (
    select t.hoc_sinh_id from mastery_luu_san_tinh t
     where not exists (select 1 from mastery_ban_log l where l.hoc_sinh_id = t.hoc_sinh_id and l.at > t.moc)
     order by random() limit greatest(1, least(coalesce(p_so, 20), 200))) x;
  if v_hs is null then return jsonb_build_object('so_em', 0, 'lech', 0); end if;
  with song as (
    select m.hoc_sinh_id, false as btvn, m.cap, m.nut, m.score, m.n::int as n, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_hs, false, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
    union all
    select m.hoc_sinh_id, true, m.cap, m.nut, m.score, m.n::int, m.muc, m.tin
      from public._mastery_lan_cap(v_bdm, v_hs, true, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
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
revoke all on function public.fn_mastery_danh_dau_tat_ca() from public, anon, authenticated;
revoke all on function public.fn_mastery_lam_moi(integer) from public, anon, authenticated;
revoke all on function public.fn_mastery_doi_chieu(integer) from public, anon, authenticated;
grant execute on function public.fn_mastery_lam_moi(integer) to service_role;
grant execute on function public.fn_mastery_danh_dau_tat_ca() to service_role;
grant execute on function public.fn_mastery_doi_chieu(integer) to service_role;
