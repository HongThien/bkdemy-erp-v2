-- Đợt 3 bước 5 (spec-kien-truc.md §4: "ghi phần khác biệt, cấm xoá hết chèn lại") — cache mastery. Thùy 14/11 "làm mastery luôn".
-- Đo 14/11: mastery_luu_san ~50,7 nghìn dòng mà cộng dồn 765 nghìn lượt chèn / 710 nghìn lượt xoá. Mỗi em bẩn = xoá ~135 dòng + chèn ~135 dòng
-- dù thường chỉ 1–2 nút đổi; 02:00 mỗi đêm đánh dấu MỌI em ⇒ xoá + chèn lại cả bảng (50 nghìn dòng) trong khi hầu như không số nào đổi.
-- Ở 10.000 HS = ~1,35 triệu dòng xoá + chèn mỗi đêm. Sau: chỉ ghi nút thật sự đổi / mới, chỉ xoá nút không còn.
-- KHÔNG đổi: công thức (_mastery_lan_cap / _mastery_mon_cap), cơ chế em bẩn (mastery_ban_log + mốc), thứ tự chọn em, mốc tinh_at / moc, hàm đọc.
-- Thân hàm sinh từ định nghĩa đang sống (md5 prosrc 3df1bc3e…), thay đúng 2 khối ghi.
-- KHÔNG dời hàng đợi bẩn sang tinh_san_ban: sổ bẩn của mastery là nhật ký chỉ-chèn (không tranh khoá trên đường HS nộp bài);
-- tinh_san_ban đang thiết kế khoá (sổ, khoá) ⇒ upsert sẽ khiến giao dịch dài (nhập kho, gán dạng hàng loạt) chặn HS nộp bài. Xem DEVLOG 14/11.

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
      select m.hoc_sinh_id, false as btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin
        from public._mastery_lan_cap(v_bdm, v_lo, false, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
      union all
      select m.hoc_sinh_id, true, m.cap, m.nut, m.score, m.n, m.muc, m.tin
        from public._mastery_lan_cap(v_bdm, v_lo, true, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
    ), xoa as (   -- nút không còn trong kết quả mới
      delete from mastery_luu_san s
       where s.hoc_sinh_id = any(v_lo)
         and not exists (select 1 from moi m where m.hoc_sinh_id = s.hoc_sinh_id and m.btvn = s.btvn and m.cap = s.cap and m.nut = s.nut)
    )
    insert into mastery_luu_san (hoc_sinh_id, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, m.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin from moi m
    on conflict (hoc_sinh_id, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin
      where (mastery_luu_san.score, mastery_luu_san.n, mastery_luu_san.muc, mastery_luu_san.tin)
            is distinct from (excluded.score, excluded.n, excluded.muc, excluded.tin);
    -- 13/11: cache môn MỘT VÙNG (KHTN · Vật lý · Hóa học) cùng lượt, cùng sổ em bẩn — chỉ em có lớp môn đó đang học
    with moi as materialized (
      select m.hoc_sinh_id, m.mon, b.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin
        from (values (false), (true)) b(btvn)
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
