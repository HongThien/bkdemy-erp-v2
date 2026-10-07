-- ============================================================================
-- 202610071335 — dtv_may_chu_cham_thap   (áp: `node scripts/migrate.mjs --only 202610071335_dtv_may_chu_cham_thap.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (P1 Phase 2 — Thùy 07/10: "máy chấm thì nặng hơn nhưng vẫn cần phải làm đúng"): trước đây câu kho DB gửi kèm ĐÁP ÁN xuống game, đúng/sai và số tầng do game tự khai
--   ⇒ ai cũng sửa được điểm ⇒ không thể xếp hạng (C1 "Leo tháp Sinh tồn" ⛔). Giờ với LEO THÁP môn có kho DB (Toán · KHTN), MÁY CHỦ GIỮ ĐÁP ÁN:
--   · fn_dtv_de_moi   : máy chủ dựng ĐỀ THÁP HÔM NAY (cùng thuật toán/seed như game: mọi em cùng câu) và LƯU danh sách mã câu (chỉ mã, không lưu nội dung) → dtv_de;
--   · fn_dtv_de_lay   : phát câu theo lô KHÔNG kèm đáp án/lời giải;
--   · fn_dtv_de_bat_dau: đóng dấu giờ bắt đầu (sau đếm ngược) — mốc để chặn trả lời ngoài giờ;
--   · fn_dtv_cham     : nhận 1 câu trả lời (phải tuần tự, mỗi câu 1 lần), CHẤM Ở MÁY CHỦ, ghi dtv_cau_log (nguon_cham='server'), trả đúng/sai + đáp án + lời giải SAU khi đã trả lời;
--                       chặn: câu sai thứ tự · lượt đã kết thúc/đã rơi · quá hạn (Sinh tồn: 5 phút trừ 3s mỗi câu sai; Vô tận: quá giờ câu = rơi);
--   · fn_dtv_thap_ket : TẦNG / SỐ SAI / THỜI GIAN do MÁY CHỦ TÍNH từ các câu đã chấm (không còn nhận số từ client) → dtv_thap_luot (nguon_cham='server') + XP như cũ. Idempotent.
--   Chỉ tài khoản học sinh (uid hs_*) mới có đề chấm ở máy chủ. Tiếng Anh (kho từ nằm trong client — dữ liệu DEMO) và các trận đấu bot/mạng/giải: Phase 2 tiếp theo, vẫn nguon_cham='client'.
-- LƯU Ý: tin được CHỐNG SỬA SỐ (không khai khống tầng, không đoán đáp án từ mạng), KHÔNG chống được chuyện em tra bài ngoài app — đó là giới hạn của mọi game học online.
-- MẤT GÌ: không xoá/sửa dữ liệu cũ. Thêm bảng dtv_de; thêm cột de_id vào dtv_cau_log, dtv_thap_luot (+ nguon_cham cho dtv_thap_luot, mặc định 'client' cho dữ liệu cũ).
-- ============================================================================

create table if not exists dtv_de (
  id uuid primary key default gen_random_uuid(),
  uid text not null references dtv_nguoi_choi(uid),
  hoc_sinh_id uuid generated always as (case when left(uid, 3) = 'hs_' then substr(uid, 4)::uuid end) stored,
  mon text not null,
  che_do text not null check (che_do in ('song_con', 'vo_tan')),
  khoi text not null,
  chu_de text,                          -- null = tháp tổng của khối
  nhom text not null,                   -- khối · hoặc 'khối|mã chủ đề' (nhóm bảng xếp hạng như game)
  seed text not null,
  ma_cau text[] not null,               -- thứ tự câu của đề (CHỈ mã; nội dung + đáp án lấy từ kho lúc phát/chấm)
  so_cau integer not null,
  giay_goc integer not null,            -- Vô tận: thời gian câu đầu (do máy chủ quy định theo môn)
  so_tra_loi integer not null default 0,
  so_dung integer not null default 0,
  so_sai integer not null default 0,
  phat_ms integer not null default 0,   -- Sinh tồn: tổng giây bị trừ vì sai
  chet boolean not null default false,  -- Vô tận: đã rơi
  tao_at timestamptz not null default now(),
  bat_dau_at timestamptz,
  cau_cuoi_at timestamptz,
  ket_thuc_at timestamptz,
  luot_id uuid
);
create index if not exists dtv_de_hs_idx on dtv_de (hoc_sinh_id, tao_at) where hoc_sinh_id is not null;
comment on table dtv_de is 'Đề Leo tháp chấm Ở MÁY CHỦ (P1 phase 2): chỉ lưu mã câu + bộ đếm; đáp án nằm ở kho, không bao giờ gửi xuống game trước khi em trả lời.';
alter table dtv_de enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'dtv_de' and policyname = 'dtv_de_nhan_vien') then
    create policy dtv_de_nhan_vien on dtv_de for select to authenticated using (public.la_thanh_vien());
  end if;
end $$;

alter table dtv_cau_log add column if not exists de_id uuid references dtv_de(id);
create unique index if not exists dtv_cau_log_de_thu_tu_uq on dtv_cau_log (de_id, thu_tu) where de_id is not null;
alter table dtv_thap_luot add column if not exists de_id uuid references dtv_de(id);
alter table dtv_thap_luot add column if not exists nguon_cham text not null default 'client';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'dtv_thap_luot_nguon_cham_chk') then
    alter table dtv_thap_luot add constraint dtv_thap_luot_nguon_cham_chk check (nguon_cham in ('client', 'server'));
  end if;
end $$;
comment on column dtv_thap_luot.nguon_cham is 'server = tầng/sai/thời gian do MÁY CHỦ tính từ các câu đã chấm (dtv_de); client = game tự khai (cũ, không dùng để xếp hạng chính thức).';

-- Thời gian câu đầu của Vô tận theo môn (khớp nguon/index.ts: Toán 40 · KHTN 25 · Anh 10)
create or replace function public._dtv_giay_thap(p_mon text) returns integer
language sql immutable as $$ select case p_mon when 'Toán' then 40 when 'KHTN' then 25 else 10 end $$;
-- Vô tận: giayVoTan(tầng, gốc) = max(max(3, round(gốc×0.3)), gốc − floor(tầng/10)×max(1, round(gốc×0.1)))
create or replace function public._dtv_giay_vo_tan(p_tang integer, p_goc integer) returns integer
language sql immutable as $$
  select greatest(greatest(3, round(p_goc * 0.3)::int), p_goc - (p_tang / 10) * greatest(1, round(p_goc * 0.1)::int))
$$;
revoke all on function public._dtv_giay_thap(text), public._dtv_giay_vo_tan(integer, integer) from public, anon, authenticated;

-- 1 câu kho theo mã (đủ nội dung + ĐÁP ÁN) — chỉ dùng trong máy chủ; cùng cách suy đáp án với fn_dtv_kho_bo_cau (form TN đã duyệt hoặc lua_chon + dap_an)
create or replace function public._dtv_kho_cau_mot(p_mon text, p_ma_cau text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_form text := _kho_form_tn_cua(_kho_cau_tbl(p_mon)); v_kq jsonb;
begin
  if not _kho_co_mon(p_mon) then return null; end if;
  execute format($q$
    with c0 as (
      select c.ma_cau, c.noi_dung, c.anh_de, c.loi_giai, c.lua_chon, c.dap_an, b.ten_dang, b.muc_do, %3$s as form_lc
      from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
      where c.ma_cau = $1 and c.xoa_at is null
    )
    select jsonb_build_object('ma_cau', ma_cau, 'de', noi_dung, 'anh', anh_de, 'giai', loi_giai, 'dang', ten_dang, 'muc', muc_do,
      'opts', case when form_lc is not null then (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(form_lc) with ordinality t(e, o)) else lua_chon end,
      'dung', case when form_lc is not null then (select (o - 1)::int from jsonb_array_elements(form_lc) with ordinality t(e, o) where (e->>'dung')::boolean limit 1)
                   else ascii(upper(trim(dap_an))) - 65 end)
    from c0$q$, v_cau, v_bd,
    case when v_form is null then 'null::jsonb'
         else format('(select f.lua_chon from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null limit 1)', v_form) end)
    using p_ma_cau into v_kq;
  return v_kq;
end $$;
revoke all on function public._dtv_kho_cau_mot(text, text) from public, anon, authenticated;

-- Dựng ĐỀ THÁP hôm nay (tất định theo ngày VN: mọi em cùng câu) và lưu danh sách mã câu
create or replace function public.fn_dtv_de_moi(p_uid text, p_mon text, p_che_do text, p_khoi text, p_chu_de text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_seed text; v_ds jsonb; v_ma text[]; v_id uuid; v_nhom text; v_goc integer := public._dtv_giay_thap(p_mon);
begin
  perform public._dtv_kiem_uid(p_uid);
  if left(coalesce(p_uid, ''), 3) <> 'hs_' then raise exception 'Chỉ tài khoản học sinh mới có đề chấm ở máy chủ.'; end if;
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  if p_che_do not in ('song_con', 'vo_tan') then raise exception 'Chế độ tháp không hợp lệ'; end if;
  if not public._kho_co_mon(p_mon) then raise exception 'Môn này chưa chấm ở máy chủ.'; end if;
  v_seed := format('thap|%s|%s|%s|%s%s', p_che_do, p_mon, p_khoi, case when p_chu_de is not null then p_chu_de || '|' else '' end, public._dtv_hom_nay()::text);
  v_ds := public.fn_dtv_kho_bo_cau(p_mon, p_khoi, p_chu_de, 200, v_seed, true);
  if v_ds is null or jsonb_array_length(v_ds) < 5 then raise exception 'Chủ đề này chưa đủ câu trắc nghiệm.'; end if;
  v_ma := array(select e->>'ma_cau' from jsonb_array_elements(v_ds) with ordinality t(e, o) order by o);
  v_nhom := case when p_chu_de is not null then p_khoi || '|' || p_chu_de else p_khoi end;
  insert into dtv_de (uid, mon, che_do, khoi, chu_de, nhom, seed, ma_cau, so_cau, giay_goc)
  values (p_uid, p_mon, p_che_do, p_khoi, p_chu_de, v_nhom, v_seed, v_ma, cardinality(v_ma), v_goc) returning id into v_id;
  return jsonb_build_object('de_id', v_id, 'so_cau', cardinality(v_ma), 'giay_goc', v_goc, 'nhom', v_nhom);
end $$;
revoke all on function public.fn_dtv_de_moi(text, text, text, text, text) from public, anon;
grant execute on function public.fn_dtv_de_moi(text, text, text, text, text) to authenticated;

-- Phát câu theo lô — KHÔNG kèm đáp án / lời giải. Chỉ phát tới (số câu đã trả lời + 40).
create or replace function public.fn_dtv_de_lay(p_uid text, p_de_id uuid, p_tu integer, p_so integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d dtv_de; v_kq jsonb := '[]'::jsonb; k integer; c jsonb; v_den integer;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  v_den := least(d.so_cau, p_tu + least(greatest(coalesce(p_so, 20), 1), 40) - 1, d.so_tra_loi + 40);
  for k in greatest(p_tu, 1) .. v_den loop
    c := public._dtv_kho_cau_mot(d.mon, d.ma_cau[k]);
    if c is null then continue; end if;
    v_kq := v_kq || jsonb_build_array(jsonb_build_object('thu_tu', k, 'ma_cau', c->>'ma_cau', 'de', c->'de', 'anh', c->'anh', 'dang', c->'dang', 'muc', c->'muc', 'opts', c->'opts'));
  end loop;
  return v_kq;
end $$;
revoke all on function public.fn_dtv_de_lay(text, uuid, integer, integer) from public, anon;
grant execute on function public.fn_dtv_de_lay(text, uuid, integer, integer) to authenticated;

-- Đóng dấu giờ bắt đầu (game gọi khi hết đếm ngược). Gọi lại không đổi mốc.
create or replace function public.fn_dtv_de_bat_dau(p_uid text, p_de_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public._dtv_kiem_uid(p_uid);
  update dtv_de set bat_dau_at = clock_timestamp(), cau_cuoi_at = null where id = p_de_id and uid = p_uid and bat_dau_at is null and ket_thuc_at is null;
  if not found and not exists (select 1 from dtv_de where id = p_de_id and uid = p_uid) then raise exception 'Đề không thuộc về em'; end if;
end $$;
revoke all on function public.fn_dtv_de_bat_dau(text, uuid) from public, anon;
grant execute on function public.fn_dtv_de_bat_dau(text, uuid) to authenticated;

-- CHẤM 1 câu ở máy chủ. p_chon = chỉ số phương án (0–3), -1 = bỏ qua/hết giờ phía game. Trả đúng/sai + đáp án + lời giải (chỉ sau khi đã trả lời).
create or replace function public.fn_dtv_cham(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer default 0) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_truoc timestamptz; v_troi_ms numeric; v_ms integer; v_dung boolean; v_dung_idx integer;
  v_han_ms numeric; v_opts jsonb; v_het_gio boolean := false; v_chon integer := coalesce(p_chon, -1);
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  if d.ket_thuc_at is not null or d.chet then raise exception 'Lượt này đã kết thúc'; end if;
  if d.bat_dau_at is null then raise exception 'Lượt chưa bắt đầu'; end if;
  if p_thu_tu <> d.so_tra_loi + 1 or p_thu_tu > d.so_cau then raise exception 'Sai thứ tự câu'; end if;
  v_truoc := coalesce(d.cau_cuoi_at, d.bat_dau_at);
  v_troi_ms := extract(epoch from (v_now - v_truoc)) * 1000;

  -- hạn: Sinh tồn = 5 phút gốc − giây phạt (+ 6 giây trễ mạng) · Vô tận = giờ của câu hiện tại (+ 2,5 giây trễ mạng)
  if d.che_do = 'song_con' then
    if extract(epoch from (v_now - d.bat_dau_at)) * 1000 > 300000 - d.phat_ms + 6000 then return jsonb_build_object('het_gio', true); end if;
  else
    v_han_ms := public._dtv_giay_vo_tan(d.so_dung, d.giay_goc) * 1000 + 2500;
    if v_troi_ms > v_han_ms then v_het_gio := true; v_chon := -1; end if;
  end if;

  k := public._dtv_kho_cau_mot(d.mon, d.ma_cau[p_thu_tu]);
  if k is null then raise exception 'Câu không còn trong kho'; end if;
  v_dung_idx := (k->>'dung')::int;
  v_dung := (not v_het_gio) and v_chon = v_dung_idx;
  v_opts := k->'opts';
  v_ms := least(greatest(coalesce(p_ms, 0), 150), greatest(v_troi_ms, 150))::int;   -- thời gian game khai bị kẹp theo thời gian máy chủ thấy

  insert into dtv_cau_log (uid, de_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, dap_an, tra_loi, dung, ms, nguon_cham)
  values (p_uid, p_de_id, d.mon, d.che_do, d.nhom, p_thu_tu, k->>'ma_cau', k->>'ma_cau', left(k->>'de', 500), left(v_opts->>v_dung_idx, 300),
          case when v_chon between 0 and 3 then left(coalesce(v_opts->>v_chon, ''), 300) else '' end, v_dung, v_ms, 'server');

  update dtv_de set so_tra_loi = so_tra_loi + 1, so_dung = so_dung + case when v_dung then 1 else 0 end, so_sai = so_sai + case when v_dung then 0 else 1 end,
         phat_ms = phat_ms + case when d.che_do = 'song_con' and not v_dung then 3000 else 0 end,
         chet = (d.che_do = 'vo_tan' and not v_dung), cau_cuoi_at = v_now
   where id = p_de_id;
  return jsonb_build_object('dung', v_dung, 'dung_idx', v_dung_idx, 'giai', k->'giai', 'het_gio', v_het_gio,
                            'so_dung', d.so_dung + case when v_dung then 1 else 0 end, 'so_sai', d.so_sai + case when v_dung then 0 else 1 end);
end $$;
revoke all on function public.fn_dtv_cham(text, uuid, integer, integer, integer) from public, anon;
grant execute on function public.fn_dtv_cham(text, uuid, integer, integer, integer) to authenticated;

-- KẾT THÚC lượt: tầng / sai / thời gian do MÁY CHỦ tính; ghi dtv_thap_luot + XP như cũ. Gọi lại ⇒ trả kết quả cũ (idempotent).
create or replace function public.fn_dtv_thap_ket(p_uid text, p_de_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  d dtv_de; n dtv_nguoi_choi; v_ngay date := _dtv_hom_nay(); v_tang integer; v_sai integer; v_ms integer; v_luot uuid; v_xp integer; v_luot_hom_nay integer;
  v_cap_truoc integer; v_cap_sau integer; v_xong boolean;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;
  v_xong := d.ket_thuc_at is not null;
  if v_xong then
    return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', 0, 'len_cap', false, 'luot_id', d.luot_id, 'tang', d.so_dung, 'sai', d.so_sai,
      'bxh', fn_dtv_thap_bxh_mon(d.che_do, d.mon, d.nhom, true, p_uid));
  end if;
  v_tang := d.so_dung; v_sai := d.so_sai;
  v_ms := case when d.bat_dau_at is null then 0
               when d.che_do = 'song_con' then least(300000, (extract(epoch from (clock_timestamp() - d.bat_dau_at)) * 1000)::int)
               else (extract(epoch from (coalesce(d.cau_cuoi_at, clock_timestamp()) - d.bat_dau_at)) * 1000)::int end;

  insert into dtv_thap_luot (uid, mon, nhom, che_do, ngay, tang, sai, ms, de_id, nguon_cham)
  values (p_uid, d.mon, d.nhom, d.che_do, v_ngay, v_tang, v_sai, v_ms, d.id, 'server') returning id into v_luot;

  select count(*) into v_luot_hom_nay from dtv_thap_luot where uid = p_uid and ngay = v_ngay;
  v_xp := case when v_luot_hom_nay > 30 then 0 else least(v_tang, 100) * 2 end;
  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_ngay then n.chuoi_ngay when n.ngay_hoc_cuoi = v_ngay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_ngay, cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi x cross join lateral _dtv_cap(x.xp) where x.uid = p_uid;
  update dtv_de set ket_thuc_at = clock_timestamp(), luot_id = v_luot where id = d.id;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc, 'luot_id', v_luot, 'tang', v_tang, 'sai', v_sai, 'ms', v_ms,
    'bxh', fn_dtv_thap_bxh_mon(d.che_do, d.mon, d.nhom, true, p_uid));
end $$;
revoke all on function public.fn_dtv_thap_ket(text, uuid) from public, anon;
grant execute on function public.fn_dtv_thap_ket(text, uuid) to authenticated;
