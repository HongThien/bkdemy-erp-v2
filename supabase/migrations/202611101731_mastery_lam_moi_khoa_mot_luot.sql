-- fn_mastery_lam_moi: MỘT LƯỢT TẠI MỘT LÚC + ghi đè thay vì lỗi trùng khoá (phiên khác báo 10/11 17:30:
-- "fn_mastery_lam_moi lỗi trùng khoá ở HH00023"). Không tái hiện được khi chạy một mình ⇒ gốc là HAI lượt chạy SONG SONG
-- (lượt chụp lần đầu 82 s lúc 16:52 + một lượt gọi tay cùng lúc): cả hai cùng xoá rồi chèn ô của cùng một em ⇒ lượt commit sau
-- đâm khoá chính (hoc_sinh_id, btvn, cap, nut). Sửa:
--   1. khoá tư vấn theo giao dịch — lượt đến sau thấy đang có lượt chạy thì trả ngay (-1 = "đang có lượt khác chạy"), không chờ, không lỗi;
--   2. chèn ô bằng ON CONFLICT DO UPDATE — kể cả khi có đường ghi khác lọt vào, cũng không làm hỏng cả lượt.
-- Mọi thứ khác giữ nguyên (chống đua cờ bẩn, hộp thời gian, lô 20 em).
create or replace function public.fn_mastery_lam_moi(p_giay integer default 20)
returns integer language plpgsql volatile security definer set search_path = public as $$
declare v_t0 timestamptz := clock_timestamp(); v_bdm boolean := public._mastery_bdm_bat(); v_lo uuid[]; v_ban jsonb;
begin
  if not public._mastery_theo_lan_bat() then return 0; end if;
  if not pg_try_advisory_xact_lock(hashtext('fn_mastery_lam_moi')) then return -1; end if;   -- đang có lượt khác chạy
  loop
    exit when clock_timestamp() - v_t0 > make_interval(secs => greatest(1, least(coalesce(p_giay, 20), 240)));
    select coalesce(array_agg(x.hs), '{}'), coalesce(jsonb_object_agg(x.hs, x.ban_at), '{}') into v_lo, v_ban
    from (select b.hoc_sinh_id as hs, b.ban_at from mastery_ban b order by b.ban_at limit 20) x;
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
      from public._mastery_lan_cap(v_bdm, v_lo, true, null, null, array['dang', 'nhom'], 5, 5, 3) m where m.score is not null
    on conflict (hoc_sinh_id, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin;
    insert into mastery_luu_san_tinh (hoc_sinh_id, tinh_at) select unnest(v_lo), now()
      on conflict (hoc_sinh_id) do update set tinh_at = excluded.tinh_at;
    delete from mastery_ban b where b.hoc_sinh_id = any(v_lo) and b.ban_at = (v_ban ->> b.hoc_sinh_id::text)::timestamptz;
  end loop;
  return (select count(*) from mastery_ban)::int
       + (select count(*) from hoc_sinh h where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id))::int;
end $$;
revoke all on function public.fn_mastery_lam_moi(integer) from public, anon, authenticated;
grant execute on function public.fn_mastery_lam_moi(integer) to service_role;
