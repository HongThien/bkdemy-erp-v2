-- 17/11/2026 · Thùy "Xoá cả A–F" — mục A: bỏ bộ "chỉ ET + MT" (btvn = false) khỏi bản lưu sẵn mastery.
-- Từ 17/11 10:40 mọi hàm / màn đọc mastery bản CÓ BTVN (mig 202611171038) ⇒ bộ này không còn ai đọc.
-- Làm: lượt làm mới chỉ chụp bộ có BTVN · hai cửa đọc chỉ dùng bản chụp khi gọi bản có BTVN (gọi bản ET+MT thì tính trực tiếp — vẫn đúng)
-- · đối chiếu chỉ so bộ có BTVN · xoá 23.510 dòng mastery_luu_san + 4.519 dòng mastery_luu_san_mon (btvn = false).
-- Sinh bằng .tmp-claude/gen-mig3.mjs từ thân hàm ĐANG CHẠY. Không đổi chữ ký, không đổi quyền.
do $$ begin
  if md5(pg_get_functiondef('public.fn_mastery_lam_moi'::regproc)) <> '1f5359e260f79694515fba289fd3c158' then raise exception 'Hàm fn_mastery_lam_moi đã bị đổi sau lúc sinh migration — sinh lại'; end if;
  if md5(pg_get_functiondef('public._mastery_lan_cap_nhanh'::regproc)) <> 'e0fd242813a3ac05331e77e21a0c7e28' then raise exception 'Hàm _mastery_lan_cap_nhanh đã bị đổi sau lúc sinh migration — sinh lại'; end if;
  if md5(pg_get_functiondef('public._mastery_mon_doc'::regproc)) <> 'faa47cf69952197cbb1988e24ca9c6eb' then raise exception 'Hàm _mastery_mon_doc đã bị đổi sau lúc sinh migration — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_mastery_doi_chieu'::regproc)) <> '9b6c3f45bd292ac1143400af2032cdd5' then raise exception 'Hàm fn_mastery_doi_chieu đã bị đổi sau lúc sinh migration — sinh lại'; end if;
end $$;

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
    -- [14/11] ghi PHẦN KHÁC BIỆT (trước: xoá hết dòng của em rồi chèn lại — ~135 dòng / em / lượt dù không đổi gì)
    with moi as materialized (
      /* 17/11 Thùy: MỘT mastery = bản CÓ BTVN ⇒ chỉ chụp bộ btvn = true (bộ "chỉ ET + MT" đã bỏ) */
      select m.hoc_sinh_id, true as btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin, m.t_cuoi as lan_cuoi
        from public._mastery_lan_cap_t(v_bdm, v_lo, true, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
    ), xoa as (   -- nút không còn trong kết quả mới
      delete from mastery_luu_san s
       where s.hoc_sinh_id = any(v_lo)
         and not exists (select 1 from moi m where m.hoc_sinh_id = s.hoc_sinh_id and m.btvn = s.btvn and m.cap = s.cap and m.nut = s.nut)
    )
    insert into mastery_luu_san (hoc_sinh_id, btvn, cap, nut, score, n, muc, tin, lan_cuoi)
    select m.hoc_sinh_id, m.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin, m.lan_cuoi from moi m
    on conflict (hoc_sinh_id, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin, lan_cuoi = excluded.lan_cuoi
      where (mastery_luu_san.score, mastery_luu_san.n, mastery_luu_san.muc, mastery_luu_san.tin, mastery_luu_san.lan_cuoi)
            is distinct from (excluded.score, excluded.n, excluded.muc, excluded.tin, excluded.lan_cuoi);
    -- 13/11: cache môn MỘT VÙNG (KHTN · Vật lý · Hóa học) cùng lượt, cùng sổ em bẩn — chỉ em có lớp môn đó đang học
    with moi as materialized (
      select m.hoc_sinh_id, m.mon, b.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin
        from (values (true)) b(btvn)   /* 17/11: chỉ bộ có BTVN */
        cross join lateral public._mastery_mon_cap(
          array(select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                 where hl.hoc_sinh_id = any(v_lo) and hl.trang_thai = 'dang_hoc' and l.mon = any(public._mastery_mon_ds())),
          b.btvn, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m
       where m.score is not null
    ), xoa as (
      delete from mastery_luu_san_mon s
       where s.hoc_sinh_id = any(v_lo)
         and not exists (select 1 from moi m where m.hoc_sinh_id = s.hoc_sinh_id and m.mon = s.mon and m.btvn = s.btvn and m.cap = s.cap and m.nut = s.nut)
    )
    insert into mastery_luu_san_mon (hoc_sinh_id, mon, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, m.mon, m.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin from moi m
    on conflict (hoc_sinh_id, mon, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin
      where (mastery_luu_san_mon.score, mastery_luu_san_mon.n, mastery_luu_san_mon.muc, mastery_luu_san_mon.tin)
            is distinct from (excluded.score, excluded.n, excluded.muc, excluded.tin);
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
end $function$;

CREATE OR REPLACE FUNCTION public._mastery_lan_cap_nhanh(p_bdm boolean, p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[], p_window integer, p_tin_cao integer, p_tin_tb integer)
 RETURNS TABLE(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
 LANGUAGE plpgsql
 STABLE ROWS 20000
AS $function$
declare v_sach uuid[]; v_con uuid[];
begin
  if coalesce(p_include_btvn, false) and p_since is null and p_den is null and p_window = 5   /* 17/11: chỉ lưu sẵn bộ có BTVN */ and p_tin_cao = 5 and p_tin_tb = 3
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
end $function$;

CREATE OR REPLACE FUNCTION public._mastery_mon_doc(p_mon text, p_hs uuid[], p_include_btvn boolean, p_caps text[])
 RETURNS TABLE(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER ROWS 5000
 SET search_path TO 'public'
AS $function$
declare v_sach uuid[]; v_con uuid[];
begin
  if not (p_mon = any(public._mastery_mon_ds())) then return; end if;
  v_sach := case when coalesce(p_include_btvn, false) then public._mastery_hs_sach(p_hs) else '{}'::uuid[] end;   /* 17/11: chỉ lưu sẵn bộ có BTVN */
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

CREATE OR REPLACE FUNCTION public.fn_mastery_doi_chieu(p_so integer DEFAULT 20)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid[]; v_bdm boolean := public._mastery_bdm_bat(); v_lech jsonb;
begin
  select array_agg(hoc_sinh_id) into v_hs from (
    select t.hoc_sinh_id from mastery_luu_san_tinh t
     where not exists (select 1 from mastery_ban_log l where l.hoc_sinh_id = t.hoc_sinh_id and l.at > t.moc)
     order by random() limit greatest(1, least(coalesce(p_so, 20), 200))) x;
  if v_hs is null then return jsonb_build_object('so_em', 0, 'lech', 0); end if;
  with song as (
    select m.hoc_sinh_id, true as btvn, m.cap, m.nut, m.score, m.n::int as n, m.muc, m.tin   /* 17/11: chỉ bộ có BTVN */
      from public._mastery_lan_cap(v_bdm, v_hs, true, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
  ),
  chup as (select hoc_sinh_id, btvn, cap, nut, score, n, muc, tin from mastery_luu_san where hoc_sinh_id = any(v_hs)),
  lech as ((select 'chi_tinh' as loai, * from (select * from song except select * from chup) a)
           union all (select 'chi_chup', * from (select * from chup except select * from song) b))
  select jsonb_build_object('so_em', cardinality(v_hs), 'lech', (select count(*) from lech),
                            'mau', coalesce((select jsonb_agg(to_jsonb(l)) from (select * from lech limit 10) l), '[]'::jsonb))
    into v_lech;
  return v_lech;
end $function$;

delete from mastery_luu_san where not btvn;
delete from mastery_luu_san_mon where not btvn;
