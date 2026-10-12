-- ============================================================================
-- 202610121645 — nt_dht_dong_bo: NÔNG TRẠI BK TIÊU ĐIỂM HỌC TẬP (ĐHT) THẬT (bước 3a "hoàn thiện game", Thùy 12/10)
-- ----------------------------------------------------------------------------
-- Thùy chốt 12/10: "Điểm học tập: TẤT CẢ (mua hạt, mở ô, phân, con vật, thú cưng…)". ĐHT = đồng tiền riêng của app để chơi game: kiếm SUY từ lượt đạt,
--   tiêu = bảng dht_tieu (đã có, Đấu Từ cũng dùng), số dư = _dht_so_du (replay, trần 6.000). Game KHÔNG còn "điểm chăm chỉ" giả lập.
-- CƠ CHẾ ĐỒNG BỘ: game giữ bộ đếm TÍCH LUỸ `dem.diemTieu` (tổng điểm đã tiêu từ khi chơi). App gửi tổng đó ⇒ server so với `nt_dht.da_tieu` đã ghi:
--   · lần đầu (chưa có dòng) ⇒ lập MỐC = tổng hiện có, KHÔNG trừ (lịch sử tiêu bằng điểm giả của bản thử không tính vào ví thật);
--   · tổng > đã ghi ⇒ trừ đúng phần chênh qua fn_dht_tieu (nguon 'nong_trai') — KHÔNG đủ điểm ⇒ từ chối, giữ nguyên (game báo em);
--   · tổng < đã ghi (em xoá nông trại làm lại) ⇒ lập lại MỐC, không hoàn điểm. Bộ đếm tích luỹ ⇒ gửi lại bao nhiêu lần cũng không trừ đôi.
-- GHI CHÚ TRUNG THỰC: bộ đếm do client gửi ⇒ khai THIẾU chi tiêu là có thể (mua miễn phí) — chống bằng luật server là B4. Số dư KHÔNG âm được.
-- MẤT GÌ: không xoá/thu hẹp gì — thêm 1 bảng + 1 hàm, thay thân fn_nt_nhip (chỉ THÊM khoá dht_so_du / dht_da_tieu).
-- ============================================================================
create table if not exists public.nt_dht (
  hoc_sinh_id uuid primary key references public.hoc_sinh(id) on delete cascade,
  da_tieu     bigint not null default 0 check (da_tieu >= 0),
  cap_nhat    timestamptz not null default now()
);
alter table public.nt_dht enable row level security;
revoke all on public.nt_dht from anon, authenticated;

create or replace function public.fn_nt_dht_dong_bo(p_tong_tieu bigint)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_row nt_dht; v_delta bigint; v_j jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_tong_tieu is null or p_tong_tieu < 0 or p_tong_tieu > 100000000 then raise exception 'Số liệu không hợp lệ.' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtext('nt_dht:' || v_hs::text));
  select * into v_row from nt_dht where hoc_sinh_id = v_hs for update;
  if not found then
    insert into nt_dht (hoc_sinh_id, da_tieu) values (v_hs, p_tong_tieu);
    v_j := public._dht_so_du(v_hs);
    return jsonb_build_object('ok', true, 'moc', true, 'so_du', (v_j->>'so_du')::int, 'da_tieu', p_tong_tieu);
  end if;
  v_delta := p_tong_tieu - v_row.da_tieu;
  if v_delta < 0 then   -- làm lại từ đầu: lập lại mốc, không hoàn điểm
    update nt_dht set da_tieu = p_tong_tieu, cap_nhat = now() where hoc_sinh_id = v_hs;
    v_j := public._dht_so_du(v_hs);
    return jsonb_build_object('ok', true, 'moc', true, 'so_du', (v_j->>'so_du')::int, 'da_tieu', p_tong_tieu);
  end if;
  if v_delta > 0 then
    v_j := public._dht_so_du(v_hs);
    if (v_j->>'so_du')::int < v_delta then
      return jsonb_build_object('ok', false, 'loi', 'khong_du', 'so_du', (v_j->>'so_du')::int, 'da_tieu', v_row.da_tieu, 'can', v_delta);
    end if;
    -- tiêu theo từng khoản ≤ 2.000 để mỗi dòng dht_tieu gọn (nguon 'nong_trai', tham chiếu = tổng luỹ kế sau khoản này)
    declare v_con bigint := v_delta; v_chunk integer; v_luy bigint := v_row.da_tieu;
    begin
      while v_con > 0 loop
        v_chunk := least(v_con, 2000)::int; v_luy := v_luy + v_chunk; v_con := v_con - v_chunk;
        perform public.fn_dht_tieu(v_chunk, 'nong_trai', 'nt:' || v_luy::text);
      end loop;
    end;
    update nt_dht set da_tieu = p_tong_tieu, cap_nhat = now() where hoc_sinh_id = v_hs;
  end if;
  v_j := public._dht_so_du(v_hs);
  return jsonb_build_object('ok', true, 'moc', false, 'so_du', (v_j->>'so_du')::int, 'da_tieu', p_tong_tieu);
end $$;
revoke all on function public.fn_nt_dht_dong_bo(bigint) from public;
revoke execute on function public.fn_nt_dht_dong_bo(bigint) from anon;
grant execute on function public.fn_nt_dht_dong_bo(bigint) to authenticated;

-- fn_nt_nhip: thêm số dư ĐHT + mốc đã tiêu (game tính điểm hiển thị = so_du − (đã tiêu cục bộ − da_tieu))
create or replace function public.fn_nt_nhip()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); c nt_cau_hinh; v_now timestamptz := clock_timestamp(); v_ngay date;
  v_gioi integer; v_row nt_gio_choi; v_them integer := 0; v_dht jsonb; v_da bigint;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  select * into c from nt_cau_hinh where id = 1;
  v_ngay := public._nt_ngay(v_now);
  v_gioi := c.gio_toi_da_phut * 60;
  select * into v_row from nt_gio_choi where hoc_sinh_id = v_hs and ngay = v_ngay for update;
  if not found then
    insert into nt_gio_choi (hoc_sinh_id, ngay, giay, nhip_cuoi) values (v_hs, v_ngay, 0, v_now) returning * into v_row;
  else
    if extract(epoch from (v_now - v_row.nhip_cuoi)) <= 90 then v_them := floor(extract(epoch from (v_now - v_row.nhip_cuoi)))::int; end if;
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
    'con_lai_giay', case when c.bat then greatest(0, v_gioi - v_row.giay) end,
    'het', c.bat and v_row.giay >= v_gioi,
    'dht_so_du', (v_dht->>'so_du')::int,
    'dht_da_tieu', v_da
  );
end $$;
