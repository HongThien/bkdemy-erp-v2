-- ============================================================================
-- NÔNG TRẠI — nhịp 30 giây không tính lại ví ĐHT cả lịch sử mỗi lần (audit timeout 11/11, CLAUDE.md §2.0).
--
-- Đo 11/11 (pg_stat_statements): fn_nt_nhip 4.242 lần × 202 ms · fn_nt_dht_dong_bo 3.059 lần × 208 ms.
-- Gần hết thời gian là `_dht_so_du(hs)`: nó gọi `fn_nhiem_vu_hoan_thanh` cho TỪNG tháng × từng cấu hình nhiệm vụ
-- (quét lại cả lịch sử học của em) — và fn_nt_nhip gọi nó mỗi 30 giây, fn_nt_dht_dong_bo gọi 3 + 2×(số khoản) lần.
--
-- (1) fn_nt_nhip: số dư ĐHT trên nhịp là số HIỂN THỊ cho game (không phải số quyết định tiêu — tiêu luôn kiểm lại
--     bằng số chính xác trong fn_nt_dht_dong_bo / fn_dht_tieu) ⇒ đọc BẢN LƯU `nt_dht_so_du_luu`, tính lại khi:
--       · nhịp ĐẦU của một lượt chơi (chưa có dòng giờ chơi hôm nay, hoặc cách nhịp trước > 90 s — đúng ngưỡng
--         "liên tục" của chính hàm) ⇒ mở game là thấy số đúng, kể cả ĐHT vừa kiếm khi học;
--       · bản lưu cũ hơn 5 phút (§2.0: đọc lại nền ≥ 5 phút);
--       · có khoản tiêu / hoàn ĐHT mới sau lúc lưu (dht_tieu / dht_hoan có tao_at > tinh_at) — tiêu ở chỗ khác hiện ngay.
--     Đang chơi liên tục mà em kiếm thêm ĐHT ở tab khác ⇒ game thấy chậm tối đa 5 phút. Không đổi khoá/giờ chơi.
-- (2) fn_nt_dht_dong_bo: tính số dư chính xác MỘT lần (dưới đúng khoá 'dht:' của fn_dht_tieu), ghi các khoản tiêu thẳng
--     như fn_dht_tieu ghi (cùng cột, cùng nguon/ma_tham_chieu), số dư sau = số dư trước − delta (các khoản tiêu đều rơi vào
--     HÔM NAY = ngày cuối của vòng _dht_so_du nên trừ thẳng là đúng từng đơn vị). Trước: 3 + 2×(số khoản) lần _dht_so_du.
-- Phần còn lại giữ nguyên từng chữ (pg_get_functiondef 11/11).
-- Kiểm 12/11 (ROLLBACK, 10 HS có vườn, SAU mig 202611112152 bản chụp nhiệm vụ): nhịp đầu lượt / nhịp liên tục / nhịp ngay sau
-- khi tiêu, đồng bộ tiêu 1 khoản · 2 khoản (hoàn thử 5.000 ĐHT trong giao dịch) · không đủ — kết quả (bỏ gio_ms), dòng dht_tieu và
-- số dư sau khớp 30/30. Với bản chụp nhiệm vụ đã áp, _dht_so_du còn ~40–60 ms ⇒ thời gian cũ ≈ mới (~40–70 ms); phần lợi còn lại là
-- nhịp liên tục không gọi _dht_so_du (0 truy vấn nhiệm vụ/30 s) và đồng bộ tiêu gọi 1 lần thay vì 3 + 2×(số khoản).
-- ============================================================================

create table if not exists public.nt_dht_so_du_luu (
  hoc_sinh_id uuid primary key references public.hoc_sinh(id) on delete cascade,
  so_du integer not null,
  tinh_at timestamptz not null default clock_timestamp()
);
comment on table public.nt_dht_so_du_luu is 'Bản lưu số dư ĐHT để HIỂN THỊ trên nhịp nông trại (fn_nt_nhip). Không dùng để quyết định tiêu. Mig 202611112136.';
alter table public.nt_dht_so_du_luu enable row level security;   -- chỉ hàm security definer đọc/ghi
revoke all on public.nt_dht_so_du_luu from anon, authenticated;

-- số dư ĐHT cho màn: dùng bản lưu nếu còn tươi, không thì tính lại + lưu
create or replace function public._nt_dht_so_du_hien(p_hs uuid, p_tinh_lai boolean)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare v_l nt_dht_so_du_luu; v_so integer;
begin
  if not p_tinh_lai then
    select * into v_l from nt_dht_so_du_luu where hoc_sinh_id = p_hs;
    if found and v_l.tinh_at > clock_timestamp() - interval '5 minutes'
       and not exists (select 1 from dht_tieu t where t.hoc_sinh_id = p_hs and t.tao_at > v_l.tinh_at)
       and not exists (select 1 from dht_hoan h where h.hoc_sinh_id = p_hs and h.tao_at > v_l.tinh_at) then
      return v_l.so_du;
    end if;
  end if;
  v_so := (public._dht_so_du(p_hs)->>'so_du')::int;
  perform public._nt_dht_so_du_ghi(p_hs, v_so);
  return v_so;
end $function$;
revoke execute on function public._nt_dht_so_du_hien(uuid, boolean) from public, anon, authenticated;

create or replace function public._nt_dht_so_du_ghi(p_hs uuid, p_so integer)
returns void
language sql
security definer
set search_path to 'public'
as $function$
  insert into nt_dht_so_du_luu (hoc_sinh_id, so_du, tinh_at) values (p_hs, p_so, clock_timestamp())
  on conflict (hoc_sinh_id) do update set so_du = excluded.so_du, tinh_at = excluded.tinh_at;
$function$;
revoke execute on function public._nt_dht_so_du_ghi(uuid, integer) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.fn_nt_nhip()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id(); c nt_cau_hinh; v_now timestamptz := clock_timestamp(); v_ngay date;
  v_gioi integer; v_row nt_gio_choi; v_them integer := 0; v_dht integer; v_da bigint; v_bt boolean := public._nt_bao_tri();
  v_dau boolean := true;   -- nhịp đầu của lượt chơi ⇒ tính ĐHT chính xác
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  select * into c from nt_cau_hinh where id = 1;
  v_ngay := public._nt_ngay(v_now);
  v_gioi := c.gio_toi_da_phut * 60;
  select * into v_row from nt_gio_choi where hoc_sinh_id = v_hs and ngay = v_ngay for update;
  if not found then
    insert into nt_gio_choi (hoc_sinh_id, ngay, giay, nhip_cuoi) values (v_hs, v_ngay, 0, v_now) returning * into v_row;
  else
    v_dau := extract(epoch from (v_now - v_row.nhip_cuoi)) > 90;
    if extract(epoch from (v_now - v_row.nhip_cuoi)) <= 90 and not v_bt then v_them := floor(extract(epoch from (v_now - v_row.nhip_cuoi)))::int; end if;
    if c.bat then v_them := least(v_them, greatest(0, v_gioi - v_row.giay)); end if;
    update nt_gio_choi set giay = giay + v_them, nhip_cuoi = v_now where hoc_sinh_id = v_hs and ngay = v_ngay returning * into v_row;
  end if;
  v_dht := public._nt_dht_so_du_hien(v_hs, v_dau);
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
    'dht_so_du', v_dht,
    'dht_da_tieu', v_da
  );
end $function$;

CREATE OR REPLACE FUNCTION public.fn_nt_dht_dong_bo(p_tong_tieu bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); v_row nt_dht; v_delta bigint; v_so integer;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_tong_tieu is null or p_tong_tieu < 0 or p_tong_tieu > 100000000 then raise exception 'Số liệu không hợp lệ.' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtext('nt_dht:' || v_hs::text));
  perform pg_advisory_xact_lock(hashtext('dht:' || v_hs::text));   -- cùng khoá fn_dht_tieu: số dư không đổi dưới tay tới hết giao dịch
  select * into v_row from nt_dht where hoc_sinh_id = v_hs for update;
  if not found then
    insert into nt_dht (hoc_sinh_id, da_tieu) values (v_hs, p_tong_tieu);
    v_so := (public._dht_so_du(v_hs)->>'so_du')::int;
    perform public._nt_dht_so_du_ghi(v_hs, v_so);
    return jsonb_build_object('ok', true, 'moc', true, 'so_du', v_so, 'da_tieu', p_tong_tieu);
  end if;
  v_delta := p_tong_tieu - v_row.da_tieu;
  if v_delta < 0 then   -- làm lại từ đầu: lập lại mốc, không hoàn điểm
    update nt_dht set da_tieu = p_tong_tieu, cap_nhat = now() where hoc_sinh_id = v_hs;
    v_so := (public._dht_so_du(v_hs)->>'so_du')::int;
    perform public._nt_dht_so_du_ghi(v_hs, v_so);
    return jsonb_build_object('ok', true, 'moc', true, 'so_du', v_so, 'da_tieu', p_tong_tieu);
  end if;
  v_so := (public._dht_so_du(v_hs)->>'so_du')::int;
  if v_delta > 0 then
    if v_so < v_delta then
      return jsonb_build_object('ok', false, 'loi', 'khong_du', 'so_du', v_so, 'da_tieu', v_row.da_tieu, 'can', v_delta);
    end if;
    -- tiêu theo từng khoản ≤ 2.000 để mỗi dòng dht_tieu gọn (nguon 'nong_trai', tham chiếu = tổng luỹ kế sau khoản này) —
    -- ghi đúng dòng fn_dht_tieu ghi; đã kiểm đủ tổng ở trên dưới cùng khoá nên không cần kiểm lại từng khoản
    declare v_con bigint := v_delta; v_chunk integer; v_luy bigint := v_row.da_tieu;
    begin
      while v_con > 0 loop
        v_chunk := least(v_con, 2000)::int; v_luy := v_luy + v_chunk; v_con := v_con - v_chunk;
        insert into dht_tieu (hoc_sinh_id, ngay, so, nguon, ma_tham_chieu)
          values (v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, v_chunk, 'nong_trai', 'nt:' || v_luy::text);
      end loop;
    end;
    update nt_dht set da_tieu = p_tong_tieu, cap_nhat = now() where hoc_sinh_id = v_hs;
    v_so := v_so - v_delta::int;   -- khoản tiêu rơi vào hôm nay = ngày cuối của _dht_so_du ⇒ trừ thẳng
  end if;
  perform public._nt_dht_so_du_ghi(v_hs, v_so);
  return jsonb_build_object('ok', true, 'moc', false, 'so_du', v_so, 'da_tieu', p_tong_tieu);
end $function$;
