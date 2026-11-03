-- ============================================================================
-- NÔNG TRẠI — CÔNG TẮC BẢO TRÌ (Thùy 03/11 tối: "thông báo game nông trại đang bảo trì, ko vào được game, hiện thông báo khi học sinh click")
-- Công tắc = 1 dòng tinh_nang 'nt_bao_tri': mo_tu ≤ hôm nay ⇒ ĐANG bảo trì; mo_tu = NULL ⇒ chơi bình thường.
--   Bật/tắt ở màn Admin → "Mở tính năng app HS" (hoặc update tinh_nang set mo_tu = null where ma = 'nt_bao_tri'), không cần deploy.
-- Khi bảo trì:
--   · App (bản mới): bấm Nông trại ⇒ hộp "đang bảo trì", không mở game.
--   · Server (có hiệu lực NGAY, kể cả máy đang chạy bản app cũ): fn_nt_nhip trả het=true (game hiện màn chặn, không chơi tiếp)
--     và fn_nt_luu_ghi KHÔNG ghi bản lưu (trả ok=false) ⇒ không bản lưu nào bị đè trong lúc bảo trì.
-- ============================================================================

insert into public.tinh_nang (ma, ten, nhom, thu_tu, mo_tu, mo_ta)
values ('nt_bao_tri', 'Nông trại BK — ĐANG BẢO TRÌ', 'choi', 126, date '2026-11-03',
        'BẬT = nông trại đang bảo trì: học sinh bấm vào chỉ thấy thông báo, server không cho chơi/ghi bản lưu. TẮT (bỏ ngày) = chơi lại bình thường.')
on conflict (ma) do update set mo_tu = excluded.mo_tu;

create or replace function public._nt_bao_tri() returns boolean
language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from tinh_nang where ma = 'nt_bao_tri' and mo_tu is not null and mo_tu <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
$$;

create or replace function public.fn_nt_nhip()
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  v_hs uuid := public.my_hoc_sinh_id(); c nt_cau_hinh; v_now timestamptz := clock_timestamp(); v_ngay date;
  v_gioi integer; v_row nt_gio_choi; v_them integer := 0; v_dht jsonb; v_da bigint; v_bt boolean := public._nt_bao_tri();
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  select * into c from nt_cau_hinh where id = 1;
  v_ngay := public._nt_ngay(v_now);
  v_gioi := c.gio_toi_da_phut * 60;
  select * into v_row from nt_gio_choi where hoc_sinh_id = v_hs and ngay = v_ngay for update;
  if not found then
    insert into nt_gio_choi (hoc_sinh_id, ngay, giay, nhip_cuoi) values (v_hs, v_ngay, 0, v_now) returning * into v_row;
  else
    if extract(epoch from (v_now - v_row.nhip_cuoi)) <= 90 and not v_bt then v_them := floor(extract(epoch from (v_now - v_row.nhip_cuoi)))::int; end if;
    if c.bat then v_them := least(v_them, greatest(0, v_gioi - v_row.giay)); end if;
    update nt_gio_choi set giay = giay + v_them, nhip_cuoi = v_now where hoc_sinh_id = v_hs and ngay = v_ngay returning * into v_row;
  end if;
  v_dht := public._dht_so_du(v_hs);
  select da_tieu into v_da from nt_dht where hoc_sinh_id = v_hs;
  return jsonb_build_object(
    'gio_ms', floor(extract(epoch from v_now) * 1000)::bigint,
    'ngay', v_ngay,
    'bat', c.bat,
    'da_choi_giay', v_row.giay,
    'gioi_han_giay', case when c.bat then v_gioi end,
    'con_lai_giay', case when v_bt then 0 when c.bat then greatest(0, v_gioi - v_row.giay) end,
    'het', v_bt or (c.bat and v_row.giay >= v_gioi),
    'bao_tri', v_bt,
    'dht_so_du', (v_dht->>'so_du')::int,
    'dht_da_tieu', v_da
  );
end $function$;

create or replace function public.fn_nt_luu_ghi(p_state jsonb, p_cap_nhat timestamp with time zone default null::timestamp with time zone)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare v_hs uuid := public.my_hoc_sinh_id(); v_cu nt_luu; v_moi timestamptz;
        v_gio bigint := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  -- BẢO TRÌ: không ghi gì, trả bản đang có (giữ nguyên dữ liệu)
  if public._nt_bao_tri() then
    select * into v_cu from nt_luu where hoc_sinh_id = v_hs;
    return jsonb_build_object('ok', false, 'bao_tri', true, 'state', v_cu.state, 'cap_nhat', v_cu.cap_nhat, 'gio_ms', v_gio);
  end if;
  if p_state is null or jsonb_typeof(p_state) <> 'object' or (p_state->>'v') is distinct from '2' then raise exception 'Bản lưu không hợp lệ.' using errcode = '22023'; end if;
  if octet_length(p_state::text) > 262144 then raise exception 'Bản lưu quá lớn.' using errcode = '22023'; end if;

  select * into v_cu from nt_luu where hoc_sinh_id = v_hs for update;
  if not found then
    if p_cap_nhat is not null then
      return jsonb_build_object('ok', false, 'state', null, 'cap_nhat', null, 'gio_ms', v_gio);
    end if;
    insert into nt_luu (hoc_sinh_id, state) values (v_hs, p_state) returning cap_nhat into v_moi;
    return jsonb_build_object('ok', true, 'cap_nhat', v_moi, 'gio_ms', v_gio);
  end if;
  if p_cap_nhat is distinct from v_cu.cap_nhat then
    return jsonb_build_object('ok', false, 'state', v_cu.state, 'cap_nhat', v_cu.cap_nhat, 'gio_ms', v_gio);
  end if;
  update nt_luu set state = p_state, cap_nhat = clock_timestamp() where hoc_sinh_id = v_hs returning cap_nhat into v_moi;
  return jsonb_build_object('ok', true, 'cap_nhat', v_moi, 'gio_ms', v_gio);
end $function$;

revoke all on function public._nt_bao_tri() from public, anon;
grant execute on function public._nt_bao_tri() to authenticated;
