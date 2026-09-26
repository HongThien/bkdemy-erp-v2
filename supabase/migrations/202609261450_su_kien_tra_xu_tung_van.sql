-- ============================================================================
-- 202609261450 — su_kien_tra_xu_tung_van
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/09: "Quản trò ko cần lưu xu nữa. Qua mỗi trận trả xu luôn" + "đủ 3 lượt chơi rồi thôi".
--   Trước: điện thoại quản trò CỘNG DỒN xu 3 ván trong localStorage, cuối lượt bấm KẾT THÚC mới ghi
--   1 dòng/người vào sk_xu ⇒ quản trò phải giữ số, tắt máy/đổi máy giữa lượt là mất.
--   Giờ: mỗi ván TV game ra kết quả ⇒ điện thoại gọi fn_sk_tra_xu_van ⇒ xu vào sổ NGAY (1 dòng/người/ván,
--   khoá theo matchId ván nên TV phát lại kết quả mỗi 1s / 2 điện thoại cùng nghe cũng không cộng đúp).
--   Đủ so_van (cấu hình sự kiện, mặc định 3) ⇒ hàm TỰ kết thúc lượt, không nhận ván thứ 4.
--   Số ván đã chơi = số matchId khác nhau trong sổ (suy động, không lưu biến đếm).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   · DROP INDEX sk_xu_1_game_luot (unique (luot_id, nguoi_choi_id) where nguon='game') rồi TẠO LẠI cùng tên,
--     hẹp hơn: thêm "and van is null". Chỉ là chỉ mục — KHÔNG mất dòng dữ liệu nào. Lý do: index cũ cho mỗi
--     người đúng 1 dòng game/lượt ⇒ chặn đúng thứ cần làm (1 dòng/ván). Dòng cũ (van null) vẫn được khoá như cũ.
--   · Không xoá bảng/cột/dòng nào. Cột mới sk_xu.van: NULL = không áp dụng (vòng quay/đổi quà/điều chỉnh,
--     hoặc game nhập tay cả lượt qua fn_sk_ket_thuc).
-- ÁP: SQL Editor (các hàm sk_* đều do postgres sở hữu) ⇒ phải revoke tường minh khỏi anon (CLAUDE.md §2.1).
-- ============================================================================

alter table sk_xu add column if not exists van bigint;
comment on column sk_xu.van is 'matchId của ván game (TV game phát). Chỉ dòng nguon=game trả theo từng ván. NULL = không áp dụng.';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'sk_xu_van_chi_game') then
    alter table sk_xu add constraint sk_xu_van_chi_game check (van is null or nguon = 'game');
  end if;
end $$;

drop index if exists sk_xu_1_game_luot;
create unique index if not exists sk_xu_1_game_luot on sk_xu (luot_id, nguoi_choi_id) where nguon = 'game' and van is null;
create unique index if not exists sk_xu_1_game_van on sk_xu (luot_id, nguoi_choi_id, van) where nguon = 'game' and van is not null;

-- Tình trạng xu game của 1 lượt: số ván đã trả / tối đa / đã xong / tổng xu theo slot.
create or replace function public._sk_xu_luot(p_luot uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'so_van', (select count(distinct x.van) from sk_xu x where x.luot_id = p_luot and x.nguon = 'game' and x.van is not null),
    'toi_da', (select coalesce((s.cau_hinh->>'so_van')::int, 3) from sk_luot lu join sk_phong ph on ph.id = lu.phong_id join sk_su_kien s on s.id = ph.su_kien_id where lu.id = p_luot),
    'xong',   (select lu.trang_thai <> 'dang_choi' from sk_luot lu where lu.id = p_luot),
    'tong',   coalesce((select jsonb_object_agg(t.slot::text, t.xu) from (
                select dk.slot, sum(x.so_xu)::int as xu
                from sk_dang_ky dk join sk_xu x on x.nguoi_choi_id = dk.nguoi_choi_id and x.luot_id = dk.luot_id and x.nguon = 'game'
                where dk.luot_id = p_luot and dk.slot is not null group by dk.slot) t), '{}'::jsonb)
  )
$$;

create or replace function public.fn_sk_xu_luot(p_luot uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(public._sk_sk_cua_luot(p_luot), array['quantro']);
  return public._sk_xu_luot(p_luot);
end $$;

-- Trả xu 1 ván ngay khi TV game ra kết quả. Idempotent theo (lượt, matchId).
create or replace function public.fn_sk_tra_xu_van(p_luot uuid, p_van bigint, p_ket_qua jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_luot record; v_dk record; v_xu int; v_max int; v_da int; v_co boolean := false;
begin
  perform public._sk_can(public._sk_sk_cua_luot(p_luot), array['quantro']);
  if p_van is null then raise exception 'Thiếu mã ván.'; end if;
  select * into v_luot from sk_luot where id = p_luot for update;
  if not found then raise exception 'Không tìm thấy lượt.'; end if;
  -- ván này đã trả rồi (TV phát lại kết quả mỗi 1s, 2 máy quản trò cùng nghe) ⇒ trả tình trạng, không ghi gì
  if exists (select 1 from sk_xu where luot_id = p_luot and nguon = 'game' and van = p_van) then
    return public._sk_xu_luot(p_luot);
  end if;
  if v_luot.trang_thai <> 'dang_choi' then raise exception 'Lượt này đã kết thúc rồi.'; end if;
  select coalesce((s.cau_hinh->>'so_van')::int, 3) into v_max
    from sk_phong ph join sk_su_kien s on s.id = ph.su_kien_id where ph.id = v_luot.phong_id;
  select count(distinct van) into v_da from sk_xu where luot_id = p_luot and nguon = 'game' and van is not null;
  if v_da >= v_max then raise exception 'Lượt này đã đủ % ván rồi.', v_max; end if;
  for v_dk in select * from sk_dang_ky where luot_id = p_luot and trang_thai = 'dang_choi' loop
    select coalesce(max((e->>'xu')::int), 0) into v_xu
      from jsonb_array_elements(coalesce(p_ket_qua, '[]'::jsonb)) e where (e->>'slot')::int = v_dk.slot;
    if v_xu < 0 or v_xu > 100 then raise exception 'Xu slot % không hợp lệ: %', v_dk.slot, v_xu; end if;
    if v_xu > 0 then
      insert into sk_xu (nguoi_choi_id, so_xu, nguon, luot_id, van, ghi_chu)
      values (v_dk.nguoi_choi_id, v_xu, 'game', p_luot, p_van, v_luot.game || ' · ván ' || (v_da + 1) || ' · slot ' || v_dk.slot)
      on conflict do nothing;
      v_co := true;
    end if;
  end loop;
  if not v_co then raise exception 'Kết quả ván không có bạn nào của lượt này — không ghi.'; end if;
  -- đủ số ván ⇒ tự kết thúc lượt: HS rảnh, đăng ký lại được
  if v_da + 1 >= v_max then
    update sk_dang_ky set trang_thai = 'xong', updated_at = now() where luot_id = p_luot and trang_thai = 'dang_choi';
    update sk_luot set trang_thai = 'xong', ket_thuc_at = now() where id = p_luot;
  end if;
  return public._sk_xu_luot(p_luot);
end $$;

revoke all on function public._sk_xu_luot(uuid), public.fn_sk_xu_luot(uuid), public.fn_sk_tra_xu_van(uuid, bigint, jsonb) from public;
revoke all on function public._sk_xu_luot(uuid), public.fn_sk_xu_luot(uuid), public.fn_sk_tra_xu_van(uuid, bigint, jsonb) from anon;
grant execute on function public.fn_sk_xu_luot(uuid), public.fn_sk_tra_xu_van(uuid, bigint, jsonb) to authenticated;

-- Huỷ lượt khi đã trả xu ván nào đó ⇒ HS về "Lượt kế", chơi lại 3 ván nữa = nhận xu 2 lần. Chặn: phải dùng Kết thúc sớm.
-- (create or replace cùng chữ ký ⇒ giữ nguyên quyền cũ; thân giữ nguyên + 1 dòng chặn.)
create or replace function public.fn_sk_huy_luot(p_luot uuid) returns void
language plpgsql security definer set search_path = public as $$
declare l record;
begin
  perform public._sk_can(public._sk_sk_cua_luot(p_luot), array['quantro']);
  select * into l from sk_luot where id = p_luot for update;
  if not found or l.trang_thai <> 'dang_choi' then raise exception 'Lượt không còn đang chơi.'; end if;
  if exists (select 1 from sk_xu where luot_id = p_luot and nguon = 'game') then
    raise exception 'Lượt này đã trả xu rồi — không huỷ được, bấm "Kết thúc sớm".';
  end if;
  update sk_dang_ky set trang_thai = 'co_mat', luot_id = null, slot = null, updated_at = now()
   where luot_id = p_luot and trang_thai = 'dang_choi';
  update sk_luot set trang_thai = 'huy', ket_thuc_at = now() where id = p_luot;
end $$;

-- Kiểm sau khi áp (kỳ vọng: 2 index game, anon_goi_duoc = 0)
select
  (select string_agg(indexname, ', ') from pg_indexes where tablename = 'sk_xu' and indexname like 'sk_xu_1_game%') as index_game,
  (select count(*) from pg_proc where proname in ('_sk_xu_luot', 'fn_sk_xu_luot', 'fn_sk_tra_xu_van')
     and has_function_privilege('anon', oid, 'execute')) as anon_goi_duoc;
