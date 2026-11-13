-- ============================================================================
-- DASHBOARD HỌC TẬP CHO MỌI MÔN (Thùy 13/11: "Dashboard học tập cần làm cho tất cả các môn")
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_dbht_moi_mon.mjs từ DB đang chạy — đừng sửa tay.
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_dbht_bang chỉ lấy ô khi _kho_ban_do_tbl(môn) = 'dai_ban_do' (Toán); engine mastery theo lần (_mastery_lan_d) chỉ quy
--   lượt đo về dạng bài/nhóm của bản đồ Toán ⇒ KHTN (6.621 lần đo/30 ngày, 55 em) ra bảng trống. Tính thẳng KHTN khối 9 = ~3 s
--   (> trần 1–2 s, §2.0) ⇒ phải có bản lưu sẵn.
--   (1) Engine môn MỘT VÙNG (KHTN · Vật lý · Hóa học): _mastery_mon_d / _mastery_mon_cap — CÙNG luật _mastery_lan_cap (30 ngày,
--       ≤5 lần gần nhất, ngưỡng 80/50, độ tin 5/3), quy lượt đo qua _mastery_luot_do_quy(cờ một-vùng = true) rồi về cây
--       bản đồ mới của đúng môn (tl_bdm_dang_bai_v / tl_bdm_nhom_v có cột mon). Mã ô tự mang môn (KDB/LDB/QDB…).
--   (2) Cache mastery_luu_san_mon (thêm cột mon) — fn_mastery_lam_moi tính luôn cho em có lớp môn một vùng trong CÙNG lượt,
--       cùng sổ em bẩn (mastery_ban_log / mastery_luu_san_tinh). Trigger em bẩn gắn thêm vào bảng gán/đề xuất/dạng bài của 3 môn.
--   (3) fn_dbht_bang + fn_dbht_o_lich_su: Toán đi đường cũ (y nguyên), môn một vùng đọc cache môn; tên cột lấy từ cây đúng môn.
--   (4) Đánh dấu bẩn em có lớp môn một vùng ⇒ cron chụp ngay lượt sau; chưa chụp thì hàm đọc tính thẳng (chậm tạm thời).
--   Toán: KHÔNG đổi engine, KHÔNG đổi cache, KHÔNG đổi số (so cũ–mới khớp từng dòng trước khi áp).
-- MẤT GÌ (Luật xoá): không mất gì — thêm 1 bảng, 4 hàm, trigger; create or replace 4 hàm (giữ chữ ký, ACL).
-- ============================================================================
set local check_function_bodies = off;

create table public.mastery_luu_san_mon (
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  mon text not null,
  btvn boolean not null,
  cap text not null,
  nut text not null,
  score numeric not null,
  n integer not null,
  muc text not null,
  tin text not null,
  primary key (hoc_sinh_id, mon, btvn, cap, nut)
);
alter table public.mastery_luu_san_mon enable row level security;   -- như mastery_luu_san: chỉ đọc/ghi qua hàm security definer
create index mastery_luu_san_mon_nut_idx on public.mastery_luu_san_mon (cap, nut);

-- (1) môn một vùng đo theo bản đồ mới — 1 registry
create or replace function public._mastery_mon_ds()
 returns text[] language sql immutable
as $function$ select array['KHTN', 'Vật lý', 'Hóa học'] $function$;

-- lượt đo → dạng bài / nhóm / chuyên đề / chủ đề của ĐÚNG môn (cùng luật bỏ tự luyện trừ cấp 1 như _mastery_lan_d)
create or replace function public._mastery_mon_d(p_hs uuid[], p_include_btvn boolean, p_since timestamptz, p_den timestamptz)
 returns table(hoc_sinh_id uuid, mon text, luot text, value numeric, t timestamptz, src text, dang text, nhom text, chuyen_de text, chu_de text)
 language sql stable
 set search_path to 'public'
as $function$
  select l.hoc_sinh_id, d.mon, l.luot, l.value, l.t, l.src, l.ma_dang, d.nhom_id, n.chuyen_de_id, n.chu_de_id
    from public._mastery_luot_do_quy(public._mastery_bdm_bat(), true, p_hs, p_include_btvn, p_since, p_den) l
    join tl_bdm_dang_bai_v d on d.id = l.ma_dang and d.mon = any(public._mastery_mon_ds())
    join tl_bdm_nhom_v n on n.id = d.nhom_id and n.mon = d.mon
   where l.src <> 'tu_luyen' or l.cap1
$function$;

-- CÙNG luật _mastery_lan_cap (Toán), thêm chiều môn
create or replace function public._mastery_mon_cap(p_hs uuid[], p_include_btvn boolean, p_since timestamptz, p_den timestamptz,
                                                   p_caps text[], p_window integer, p_tin_cao integer, p_tin_tb integer)
 returns table(hoc_sinh_id uuid, mon text, cap text, nut text, score numeric, n bigint, muc text, tin text)
 language sql stable rows 5000
 set search_path to 'public'
as $function$
  with d as materialized (
    select * from public._mastery_mon_d(p_hs, p_include_btvn, greatest(p_since, coalesce(p_den, now()) - interval '30 days'), p_den)
  ),
  lan as (
    select hoc_sinh_id, mon, 'dang'::text as cap, dang as nut, luot, avg(value) as p, max(t) as t from d where 'dang' = any(p_caps) group by 1, 2, 4, 5
    union all
    select hoc_sinh_id, mon, 'nhom', nhom, luot, avg(value), max(t) from d where 'nhom' = any(p_caps) and nhom is not null group by 1, 2, 4, 5
    union all
    select hoc_sinh_id, mon, 'chuyen_de', chuyen_de, luot, avg(value), max(t) from d where 'chuyen_de' = any(p_caps) and chuyen_de is not null group by 1, 2, 4, 5
    union all
    select hoc_sinh_id, mon, 'chu_de', chu_de, luot, avg(value), max(t) from d where 'chu_de' = any(p_caps) and chu_de is not null group by 1, 2, 4, 5
  ),
  rk as (select lan.*, row_number() over (partition by hoc_sinh_id, mon, cap, nut order by t desc, luot desc) as rn from lan)
  select hoc_sinh_id, mon, cap, nut,
         avg(p) filter (where rn <= p_window) as score,
         count(*) as n,
         case when avg(p) filter (where rn <= p_window) >= 0.8 then 'dat'
              when avg(p) filter (where rn <= p_window) >= 0.5 then 'can_luyen' else 'yeu' end,
         case when count(*) >= p_tin_cao then 'cao' when count(*) >= p_tin_tb then 'tb' else 'thap' end
    from rk group by hoc_sinh_id, mon, cap, nut
$function$;

-- đọc nhanh: em đã chụp & không bẩn ⇒ bản lưu; còn lại tính thẳng (như _mastery_lan_cap_nhanh của Toán)
create or replace function public._mastery_mon_doc(p_mon text, p_hs uuid[], p_include_btvn boolean, p_caps text[])
 returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
 language plpgsql stable security definer rows 5000
 set search_path to 'public'
as $function$
declare v_sach uuid[]; v_con uuid[];
begin
  if not (p_mon = any(public._mastery_mon_ds())) then return; end if;
  v_sach := public._mastery_hs_sach(p_hs);
  if cardinality(v_sach) > 0 then
    return query select s.hoc_sinh_id, s.cap, s.nut, s.score, s.n::bigint, s.muc, s.tin from mastery_luu_san_mon s
                  where s.hoc_sinh_id = any(v_sach) and s.mon = p_mon and s.btvn = coalesce(p_include_btvn, false) and s.cap = any(p_caps);
  end if;
  v_con := array(select unnest(p_hs) except select unnest(v_sach));
  if cardinality(v_con) > 0 then
    return query select m.hoc_sinh_id, m.cap, m.nut, m.score, m.n, m.muc, m.tin
                   from public._mastery_mon_cap(v_con, p_include_btvn, null, null, p_caps, 5, 5, 3) m
                  where m.mon = p_mon and m.score is not null;
  end if;
end $function$;
revoke all on function public._mastery_mon_ds() from public, anon;
revoke all on function public._mastery_mon_d(uuid[], boolean, timestamptz, timestamptz) from public, anon;
revoke all on function public._mastery_mon_cap(uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) from public, anon;
revoke all on function public._mastery_mon_doc(text, uuid[], boolean, text[]) from public, anon;
grant execute on function public._mastery_mon_ds() to authenticated;
grant execute on function public._mastery_mon_d(uuid[], boolean, timestamptz, timestamptz) to authenticated;
grant execute on function public._mastery_mon_cap(uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) to authenticated;
grant execute on function public._mastery_mon_doc(text, uuid[], boolean, text[]) to authenticated;

-- (2) fn_mastery_lam_moi: thêm cache môn một vùng (phần Toán y nguyên)
CREATE OR REPLACE FUNCTION public.fn_mastery_lam_moi(p_giay integer DEFAULT 20)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    -- 13/11: cache môn MỘT VÙNG (KHTN · Vật lý · Hóa học) cùng lượt, cùng sổ em bẩn — chỉ em có lớp môn đó đang học
    delete from mastery_luu_san_mon where hoc_sinh_id = any(v_lo);
    insert into mastery_luu_san_mon (hoc_sinh_id, mon, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, m.mon, b.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin
      from (values (false), (true)) b(btvn)
      cross join lateral public._mastery_mon_cap(
        array(select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
               where hl.hoc_sinh_id = any(v_lo) and hl.trang_thai = 'dang_hoc' and l.mon = any(public._mastery_mon_ds())),
        b.btvn, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m
     where m.score is not null;
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
end $function$
;
-- _mastery_ban_tg: thêm bảng của 3 môn một vùng
CREATE OR REPLACE FUNCTION public._mastery_ban_tg()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  elsif TG_TABLE_NAME in ('dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', 'khtn_bdm_gan_cau', 'khtn_bdm_de_xuat', 'vatly_bdm_gan_cau', 'vatly_bdm_de_xuat', 'hoahoc_bdm_gan_cau', 'hoahoc_bdm_de_xuat') then
    if TG_OP = 'INSERT' then v := public._mastery_hs_lam_cau(array(select ma_cau from moi));
    elsif TG_OP = 'DELETE' then v := public._mastery_hs_lam_cau(array(select ma_cau from cu));
    else v := public._mastery_hs_lam_cau(array(select ma_cau from moi union select ma_cau from cu)); end if;
  elsif TG_TABLE_NAME = 'dai_bdm_dang_bai' then
    if TG_OP = 'UPDATE' then
      v := array(select distinct s.hoc_sinh_id from moi join cu on cu.id = moi.id join mastery_luu_san s on s.cap = 'dang' and s.nut = moi.id
                 where moi.nhom_id is distinct from cu.nhom_id);
    else v := array(select distinct s.hoc_sinh_id from cu join mastery_luu_san s on s.cap = 'dang' and s.nut = cu.id); end if;
  elsif TG_TABLE_NAME in ('khtn_bdm_dang_bai', 'vatly_bdm_dang_bai', 'hoahoc_bdm_dang_bai') then   -- 13/11: dạng bài môn một vùng đổi nhóm / bị xoá
    if TG_OP = 'UPDATE' then
      v := array(select distinct s.hoc_sinh_id from moi join cu on cu.id = moi.id join mastery_luu_san_mon s on s.cap = 'dang' and s.nut = moi.id
                 where moi.nhom_id is distinct from cu.nhom_id);
    else v := array(select distinct s.hoc_sinh_id from cu join mastery_luu_san_mon s on s.cap = 'dang' and s.nut = cu.id); end if;
  elsif TG_TABLE_NAME = 'he_thong_cong_tac' then
    if exists (select 1 from moi join cu on cu.ma = moi.ma where moi.ma in ('mastery_theo_lan', 'mastery_ban_do_moi') and moi.bat is distinct from cu.bat) then
      perform public.fn_mastery_danh_dau_tat_ca();
    end if;
    return null;
  end if;
  if cardinality(v) > 0 then perform public._mastery_danh_dau_ban(v); end if;
  return null;
end $function$
;
create trigger trg_mastery_ban_ins after insert on public.khtn_bdm_gan_cau referencing new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.khtn_bdm_gan_cau referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.khtn_bdm_gan_cau referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_ins after insert on public.khtn_bdm_de_xuat referencing new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.khtn_bdm_de_xuat referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.khtn_bdm_de_xuat referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.khtn_bdm_dang_bai referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.khtn_bdm_dang_bai referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_ins after insert on public.vatly_bdm_gan_cau referencing new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.vatly_bdm_gan_cau referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.vatly_bdm_gan_cau referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_ins after insert on public.vatly_bdm_de_xuat referencing new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.vatly_bdm_de_xuat referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.vatly_bdm_de_xuat referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.vatly_bdm_dang_bai referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.vatly_bdm_dang_bai referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_ins after insert on public.hoahoc_bdm_gan_cau referencing new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.hoahoc_bdm_gan_cau referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.hoahoc_bdm_gan_cau referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_ins after insert on public.hoahoc_bdm_de_xuat referencing new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.hoahoc_bdm_de_xuat referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.hoahoc_bdm_de_xuat referencing old table as cu for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_upd after update on public.hoahoc_bdm_dang_bai referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();
create trigger trg_mastery_ban_del after delete on public.hoahoc_bdm_dang_bai referencing old table as cu for each statement execute function _mastery_ban_tg();
-- (3) fn_dbht_bang: môn một vùng đọc cache môn, tên cột theo cây đúng môn (phần Toán y nguyên)
CREATE OR REPLACE FUNCTION public.fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer DEFAULT 4, p_cap text DEFAULT 'chuyen_de'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  ca as (select case p_cap when 'nhom' then 'nhom' when 'chu_de' then 'chu_de' else 'chuyen_de' end as c),
  -- ⭐ 10/11 (Thùy): đọc BẢNG CHỤP mastery theo lần (em bẩn mới tính trực tiếp) — một lượt cho cấp đang xem + cấp nhóm (cột Nhóm yếu)
  m as materialized (
    select x.* from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), (select array_agg(hoc_sinh_id) from hs), true,
                                                  null, null, array[(select c from ca), 'nhom'], 5, 5, 3) x
     where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and x.score is not null
    union all   -- 13/11: môn một vùng (KHTN · Vật lý · Hóa học) — cache theo môn
    select x.* from public._mastery_mon_doc(p_mon, (select array_agg(hoc_sinh_id) from hs), true, array[(select c from ca), 'nhom']) x
     where x.score is not null
  ),
  o as (select m.hoc_sinh_id, m.nut as cot, round(100 * m.score)::int as p, m.n, m.muc, m.tin from m where m.cap = (select c from ca)),
  ny as (select m.hoc_sinh_id, count(*) filter (where m.muc = 'yeu')::int as nhom_yeu from m where m.cap = 'nhom' group by m.hoc_sinh_id),
  cot as (select distinct o.cot from o),
  cot_ten as (
    select cot.cot as ma,
           coalesce(case when hb.ma_bai is not null then 'Hình · ' || hb.ten_bai
                         when p_cap = 'nhom' then nb.ten when p_cap = 'chu_de' then cd.ten else ch.ten end,
                    case when p_cap = 'nhom' then vn.ten when p_cap = 'chu_de' then vcd.ten else vch.ten end, cot.cot) as ten,
           coalesce(case when p_cap = 'nhom' then coalesce(ch.ten, cd.ten) when hb.ma_bai is not null and p_cap <> 'chu_de' then cd.ten end,
                    case when p_cap = 'nhom' then coalesce(vch.ten, vcd.ten) end) as cha,
           (hb.ma_bai is not null or cd.nhanh in ('hinh', 'hinh_hoc', 'hinh_luyen'))::int as t0,
           coalesce(cd.thu_tu, vcd.thu_tu, 0) as t1, coalesce(bo.thu_tu, vo.thu_tu, 0) as t2, coalesce(nb.thu_tu, hb.thu_tu, vn.thu_tu, 0) as t3
      from cot
      left join hinh_hoc_bai hb on hb.ma_bai = cot.cot
      left join dai_bdm_nhom nb on p_cap = 'nhom' and nb.id = cot.cot
      left join dai_bdm_chuyen_de ch on ch.id = case when p_cap = 'nhom' then nb.chuyen_de_id when p_cap = 'chuyen_de' then cot.cot end
      left join lateral (select o2.chu_de_id, o2.thu_tu from dai_bdm_o o2 join dai_bdm_chu_de c2 on c2.id = o2.chu_de_id
                          where ch.id is not null and o2.chuyen_de_id = ch.id and (nb.id is null or o2.chu_de_id = nb.chu_de_id)
                          order by c2.thu_tu limit 1) bo on true
      left join dai_bdm_chu_de cd on cd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, hb.chu_de_id, nb.chu_de_id, bo.chu_de_id)
      -- 13/11: môn một vùng — tên/thứ tự từ cây bản đồ mới của ĐÚNG môn (view có cột mon)
      left join tl_bdm_nhom_v vn on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and p_cap = 'nhom' and vn.mon = p_mon and vn.id = cot.cot
      left join tl_bdm_chuyen_de_v vch on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and vch.mon = p_mon
                                       and vch.id = case when p_cap = 'nhom' then vn.chuyen_de_id when p_cap = 'chuyen_de' then cot.cot end
      left join lateral (select o3.chu_de_id, o3.thu_tu from tl_bdm_o_v o3 join tl_bdm_chu_de_v c3 on c3.id = o3.chu_de_id and c3.mon = p_mon
                          where o3.mon = p_mon and vch.id is not null and o3.chuyen_de_id = vch.id and (vn.id is null or o3.chu_de_id = vn.chu_de_id)
                          order by c3.thu_tu limit 1) vo on true
      left join tl_bdm_chu_de_v vcd on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and vcd.mon = p_mon
                                    and vcd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, vn.chu_de_id, vo.chu_de_id)
  ),
  bd as (   -- báo động (chuông GV/TA) 30 ngày, đúng môn, chưa có quyết định bổ trợ nào sau chuông
    select cb.hoc_sinh_id, count(*)::int as so, max(cb.created_at) as moi_nhat,
           (array_agg(coalesce(nullif(btrim(cb.ghi_chu), ''), cb.nguon) order by cb.created_at desc))[1] as ghi_chu
      from canh_bao_yeu cb left join buoi_hoc b on b.id = cb.buoi_hoc_id left join lop bl on bl.id = b.lop_id
     where cb.hoc_sinh_id in (select hoc_sinh_id from hs) and cb.created_at >= now() - interval '30 days' and (bl.mon is null or bl.mon = p_mon)
       and not exists (select 1 from bo_tro_de_xuat dx where dx.hoc_sinh_id = cb.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai <> 'huy' and dx.tao_at >= cb.created_at)
     group by cb.hoc_sinh_id
  ),
  bt as (
    select hs.hoc_sinh_id,
           coalesce((select jsonb_build_object('id', dx.id, 'tt', dx.trang_thai) from bo_tro_de_xuat dx
                      where dx.hoc_sinh_id = hs.hoc_sinh_id and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
                    (select jsonb_build_object('id', y.id, 'tt', 'dang_bo_tro') from bo_tro_yeu y
                      where y.hoc_sinh_id = hs.hoc_sinh_id and y.mon = p_mon and y.trang_thai = 'dang_xu' limit 1)) as j
      from hs
  )
  select jsonb_build_object(
    'tu', null,
    'tinh_at', (select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id in (select hoc_sinh_id from hs)),
    'co_do', (public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' or p_mon = any(public._mastery_mon_ds())),   -- 13/11: môn đã đo theo bản đồ mới chưa
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', ma, 'ten', ten, 'cha', cha) order by t0, t1, t2, t3, ten) from cot_ten), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', hs.hoc_sinh_id, 'ten', x.ho_ten, 'lop_id', hs.lop_id, 'lop', hs.ten_lop,
              'nhom_yeu', ny.nhom_yeu, 'dang_yeu', dy.so_dang_yeu,
              'bao_dong', case when bd.so > 0 then jsonb_build_object('so', bd.so, 'at', bd.moi_nhat, 'ghi_chu', bd.ghi_chu) end,
              'bt', bt.j,
              'o', coalesce((select jsonb_object_agg(o.cot, jsonb_build_object('p', o.p, 'n', o.n, 'muc', o.muc, 'tin', o.tin, 'd', null, 'dk', false))
                               from o where o.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten)
            from hs join hoc_sinh x on x.id = hs.hoc_sinh_id
            left join ny on ny.hoc_sinh_id = hs.hoc_sinh_id
            left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = hs.hoc_sinh_id and dy.mon = p_mon
            left join bd on bd.hoc_sinh_id = hs.hoc_sinh_id
            left join bt on bt.hoc_sinh_id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$function$
;
-- (3) fn_dbht_o_lich_su: thêm đường môn một vùng (phần Toán y nguyên)
CREATE OR REPLACE FUNCTION public.fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_ngay integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with d as (
    select x.* from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true, null, null) x
     where case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
       and public._kho_ban_do_tbl(p_mon) = 'dai_ban_do'
    union all   -- 13/11: môn một vùng
    select x.hoc_sinh_id, x.luot, x.value, x.t, x.src, x.dang, x.nhom, x.chuyen_de, x.chu_de, false
      from public._mastery_mon_d(array[p_hs], true, null, null) x
     where x.mon = p_mon and case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
  ),
  moc as (select now() - make_interval(days => greatest(1, coalesce(p_so_ngay, 30))) as tu),
  lu as (select luot, min(t) as t, min(src) as src, sum(value) as dung, count(*) as tong, avg(value) as p_lan from d group by luot),
  k as (select lu.*, row_number() over (order by t, luot) as k, case when (select bool_or(hh) from d) then 3 else 5 end as cs from lu),
  lq as (   -- "hiện tại" tại lần k = TB ≤cs lần gần nhất trong 30 ngày tính tới lần k (cùng luật _mastery_lan_cap)
    select k.*, w.tl, w.so_lan5
      from k cross join lateral (
        select avg(x.p_lan) as tl, count(*)::int as so_lan5
          from (select x.p_lan from k x where x.k <= k.k and x.t > k.t - interval '30 days' order by x.k desc limit k.cs) x
      ) w
  ),
  ld as (
    select lq.*, round(100 * tl)::int as p, round(100 * p_lan)::int as p_luot,
           round(100 * (p_lan - lag(tl) over (order by k)))::int as delta, round(100 * lag(tl) over (order by k))::int as p_truoc
      from lq
  )
  select jsonb_build_object(
    'tu', ((select tu from moc) at time zone 'Asia/Ho_Chi_Minh')::date, 'dau_ky', null, 'so_ngay', greatest(1, coalesce(p_so_ngay, 30)),
    'co_cu', exists (select 1 from ld where ld.t < (select tu from moc)),
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', (ld.t at time zone 'Asia/Ho_Chi_Minh')::date, 'kenh', ld.src, 'dung', round(ld.dung, 2), 'tong', ld.tong, 'so_lan5', ld.so_lan5,
              'p', ld.p, 'p_luot', ld.p_luot, 'p_truoc', ld.p_truoc, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', null, 'dang', coalesce(public._kho_ten_dang(p_mon, w.dang), case when public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' then (select v.ten from tl_bdm_dang_bai_v v where v.id = w.dang and v.mon = p_mon) end, w.dang), 'g', round(w.value, 2)))
                        from d w where w.luot = ld.luot))
            order by ld.k) from ld where ld.t >= (select tu from moc)), '[]'::jsonb)
  )
$function$
;
-- (4) em có lớp môn một vùng: đánh dấu bẩn để cron chụp cache môn ngay lượt sau
insert into mastery_ban_log (hoc_sinh_id)
select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
 where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = any(public._mastery_mon_ds());
