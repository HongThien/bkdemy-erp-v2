-- ============================================================================
-- 202611031841 — dtv_xao_phuong_an   (áp: `node scripts/migrate.mjs --only 202611031841_dtv_xao_phuong_an.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 — học sinh THUỘC VỊ TRÍ đáp án ở Đấu trường (câu lặp lại, đáp án luôn nằm cùng chỗ A/B/C/D).
--   ⇒ ĐẤU TRƯỜNG (trận bot · leo tháp Sinh tồn/Vô tận — mọi đề chấm ở máy chủ `dtv_de`) xáo thứ tự phương án MỖI ĐỀ.
--   Phạm vi CHỈ game Đấu trường: bài giao / ET / BTVN / bổ trợ vẫn giữ luật "giấy và app giống hệt, không xáo" (Thùy 29/09).
-- CÁCH LÀM:
--   · `dtv_de.xao` = chuỗi ngẫu nhiên cấp lúc sinh đề (default), KHÔNG bao giờ trả xuống client ⇒ client không suy được hoán vị.
--   · `_dtv_hoan_vi(xao, thu_tu, n)` = hoán vị của câu thứ `thu_tu`: phần tử j (vị trí hiển thị, 0-based) = chỉ số phương án GỐC.
--     Đề cũ (xao NULL = "không áp dụng", sinh trước mig này) ⇒ hoán vị đồng nhất ⇒ đề đang dở lúc áp mig vẫn chấm đúng.
--   · `fn_dtv_de_lay` phát opts theo thứ tự đã xáo; `fn_dtv_cham` / `fn_dtv_cham_tran` nhận `p_chon` = VỊ TRÍ HIỂN THỊ, đổi về chỉ số gốc
--     để chấm, và trả `dung_idx` theo VỊ TRÍ HIỂN THỊ ⇒ client không đổi gì. Nhật ký `dtv_cau_log` ghi NỘI DUNG phương án (không phụ thuộc vị trí).
--   · Thứ tự CÂU giữ nguyên: tháp cần cùng chuỗi câu cho mọi người (BXH công bằng, tăng dần độ khó); trận bot vốn đã ngẫu nhiên.
-- MẤT GÌ: không xoá / drop / thu hẹp gì. Thêm 1 cột (nullable, default cho đề mới) + 1 hàm nội bộ; thay thân 3 hàm (giữ chữ ký + quyền).
-- ============================================================================

alter table public.dtv_de add column if not exists xao text;
alter table public.dtv_de alter column xao set default md5(random()::text || clock_timestamp()::text);
comment on column public.dtv_de.xao is
  'Khoá xáo phương án của đề (bí mật, không trả client). NULL = đề sinh trước 03/11, không xáo. Hoán vị: _dtv_hoan_vi(xao, thu_tu, n).';

create or replace function public._dtv_hoan_vi(p_xao text, p_thu_tu integer, p_n integer)
returns integer[]
language sql immutable
set search_path to 'public'
as $$
  select coalesce(array_agg(i order by case when p_xao is null then i::text else md5(p_xao || ':' || p_thu_tu || ':' || i) end, i), '{}'::integer[])
  from generate_series(0, greatest(coalesce(p_n, 0), 0) - 1) i
$$;
revoke execute on function public._dtv_hoan_vi(text, integer, integer) from public, anon, authenticated;

create or replace function public.fn_dtv_de_lay(p_uid text, p_de_id uuid, p_tu integer, p_so integer)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare d dtv_de; v_kq jsonb := '[]'::jsonb; k integer; c jsonb; v_den integer; v_hv integer[];
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  v_den := least(d.so_cau, p_tu + least(greatest(coalesce(p_so, 20), 1), 40) - 1, d.so_tra_loi + 40);
  for k in greatest(p_tu, 1) .. v_den loop
    c := public._dtv_kho_cau_tim(d.mon, d.khoi, d.ma_cau[k]);
    if c is null then continue; end if;
    v_hv := public._dtv_hoan_vi(d.xao, k, jsonb_array_length(c->'opts'));
    v_kq := v_kq || jsonb_build_array(jsonb_build_object('thu_tu', k, 'ma_cau', c->>'ma_cau', 'de', c->'de', 'anh', c->'anh', 'dang', c->'dang', 'muc', c->'muc',
      'opts', (select coalesce(jsonb_agg(c->'opts'->g order by j), '[]'::jsonb) from unnest(v_hv) with ordinality t(g, j))));
  end loop;
  return v_kq;
end $function$;

create or replace function public.fn_dtv_cham(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer default 0)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_truoc timestamptz; v_troi_ms numeric; v_ms integer; v_dung boolean; v_dung_idx integer;
  v_han_ms numeric; v_opts jsonb; v_het_gio boolean := false; v_chon integer := coalesce(p_chon, -1); v_hv integer[]; v_goc integer := -1;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  perform public._dtv_kiem_de_thap(d.che_do);
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

  k := public._dtv_kho_cau_tim(d.mon, d.khoi, d.ma_cau[p_thu_tu]);
  if k is null then raise exception 'Câu không còn trong kho'; end if;
  v_dung_idx := (k->>'dung')::int;
  v_opts := k->'opts';
  -- p_chon = VỊ TRÍ HIỂN THỊ (đã xáo) ⇒ đổi về chỉ số gốc trong kho
  v_hv := public._dtv_hoan_vi(d.xao, p_thu_tu, jsonb_array_length(v_opts));
  if v_chon between 0 and cardinality(v_hv) - 1 then v_goc := v_hv[v_chon + 1]; end if;
  v_dung := (not v_het_gio) and v_goc = v_dung_idx;
  v_ms := least(greatest(coalesce(p_ms, 0), 150), greatest(v_troi_ms, 150))::int;   -- thời gian game khai bị kẹp theo thời gian máy chủ thấy

  insert into dtv_cau_log (uid, de_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, dap_an, tra_loi, dung, ms, nguon_cham)
  values (p_uid, p_de_id, d.mon, d.che_do, d.nhom, p_thu_tu, k->>'ma_cau', k->>'ma_cau', left(k->>'de', 500), left(v_opts->>v_dung_idx, 300),
          case when v_goc >= 0 then left(coalesce(v_opts->>v_goc, ''), 300) else '' end, v_dung, v_ms, 'server');

  update dtv_de set so_tra_loi = so_tra_loi + 1, so_dung = so_dung + case when v_dung then 1 else 0 end, so_sai = so_sai + case when v_dung then 0 else 1 end,
         phat_ms = phat_ms + case when d.che_do = 'song_con' and not v_dung then 3000 else 0 end,
         chet = (d.che_do = 'vo_tan' and not v_dung), cau_cuoi_at = v_now
   where id = p_de_id;
  return jsonb_build_object('dung', v_dung, 'dung_idx', coalesce(array_position(v_hv, v_dung_idx) - 1, v_dung_idx), 'giai', k->'giai', 'het_gio', v_het_gio,
                            'so_dung', d.so_dung + case when v_dung then 1 else 0 end, 'so_sai', d.so_sai + case when v_dung then 0 else 1 end);
end $function$;

create or replace function public.fn_dtv_cham_tran(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer default 0)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_troi_ms numeric; v_ms integer; v_dung boolean; v_idx integer; v_chon integer := coalesce(p_chon, -1); v_opts jsonb;
  v_hv integer[]; v_goc integer := -1;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  if d.che_do <> 'bot' then raise exception 'Đề này không phải trận đấu'; end if;
  if d.ket_thuc_at is not null then raise exception 'Trận đã kết thúc'; end if;
  if p_thu_tu <> d.so_tra_loi + 1 or p_thu_tu > d.so_cau then raise exception 'Sai thứ tự câu'; end if;
  v_troi_ms := extract(epoch from (v_now - coalesce(d.cau_cuoi_at, d.bat_dau_at))) * 1000;
  k := public._dtv_kho_cau_tim(d.mon, d.khoi, d.ma_cau[p_thu_tu]);
  if k is null then raise exception 'Câu không còn trong kho'; end if;
  v_idx := (k->>'dung')::int; v_opts := k->'opts';
  -- p_chon = VỊ TRÍ HIỂN THỊ (đã xáo) ⇒ đổi về chỉ số gốc trong kho
  v_hv := public._dtv_hoan_vi(d.xao, p_thu_tu, jsonb_array_length(v_opts));
  if v_chon between 0 and cardinality(v_hv) - 1 then v_goc := v_hv[v_chon + 1];
  else
    if v_troi_ms < 2000 then raise exception 'Chưa hết lượt câu này'; end if;     -- chặn "bỏ qua liên tục để xem đáp án"
  end if;
  v_dung := v_goc = v_idx;
  v_ms := least(greatest(coalesce(p_ms, 0), 150), greatest(v_troi_ms, 150))::int;
  insert into dtv_cau_log (uid, de_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, dap_an, tra_loi, dung, ms, nguon_cham)
  values (p_uid, p_de_id, d.mon, 'bot', coalesce(d.chu_de, 'tron'), p_thu_tu, k->>'ma_cau', k->>'ma_cau', left(k->>'de', 500), left(v_opts->>v_idx, 300),
          case when v_goc >= 0 then left(coalesce(v_opts->>v_goc, ''), 300) else '' end, v_dung, v_ms, 'server');
  update dtv_de set so_tra_loi = so_tra_loi + 1, so_dung = so_dung + case when v_dung then 1 else 0 end, so_sai = so_sai + case when v_dung then 0 else 1 end, cau_cuoi_at = v_now where id = p_de_id;
  return jsonb_build_object('dung', v_dung, 'dung_idx', coalesce(array_position(v_hv, v_idx) - 1, v_idx), 'giai', k->'giai');
end $function$;
