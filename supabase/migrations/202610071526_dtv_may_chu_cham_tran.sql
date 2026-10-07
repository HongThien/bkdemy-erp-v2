-- ============================================================================
-- 202610071526 — dtv_may_chu_cham_tran   (áp: `node scripts/migrate.mjs --only 202610071526_dtv_may_chu_cham_tran.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (P1 Phase 2.2 — Thùy 07/10: "máy chấm thì nặng hơn nhưng vẫn phải làm đúng"): sau phase 2.1 (Leo tháp), TRẬN ĐẤU với bot (Đấu trường BK) của môn có kho DB (Toán · KHTN)
--   vẫn lấy câu bằng fn_dtv_kho_bo_cau — hàm đó gửi kèm ĐÁP ÁN cho bất kỳ ai gọi (cả anon) ⇒ lộ đáp án mọi câu kho, kể cả câu của đề Leo tháp đã chấm ở máy chủ.
--   ⇒ ① trận với bot cũng dùng ĐỀ CHẤM Ở MÁY CHỦ: fn_dtv_de_tran_moi (đề ngẫu nhiên, bắt đầu ngay) · phát câu bằng fn_dtv_de_lay (không đáp án) · fn_dtv_cham_tran (chấm từng câu;
--      "bỏ qua" p_chon=-1 = nhận mất câu để xem đáp án — chỉ sau ≥2 giây, mỗi câu 1 lần ⇒ không "xem đáp án" hàng loạt rồi đi thi) · fn_dtv_tran_ket (số câu đúng/số câu do MÁY CHỦ đếm; ghi dtv_tran);
--      ② KHOÁ fn_dtv_kho_bo_cau ở migration RIÊNG 202610071540 (áp SAU KHI bản game mới đã deploy — nếu không bản cũ đang chạy sẽ gãy trận với bot).
-- HỆ QUẢ (nói rõ): trận ONLINE 2 người / giải của môn có kho (Toán · KHTN) và khách chưa đăng nhập TẠM KHÔNG còn chơi được (không có trọng tài ở máy chủ) — Phase 2.4.
--   Tiếng Anh không bị ảnh hưởng (kho từ nằm trong game).
-- GIỚI HẠN còn lại: kết quả thắng/thua/hoà + điểm tốc độ vẫn do game (trọng tài bot ở client) khai — chỉ dùng để tính XP luyện tập, KHÔNG dùng cho xếp hạng. Số câu ĐÚNG do máy chủ đếm.
-- MẤT GÌ: không xoá dữ liệu. Nới CHECK dtv_de.che_do (thêm 'bot'); thêm cột dtv_tran.de_id/nguon_cham. (Chưa thu quyền gì — xem migration 202610071540.)
-- ============================================================================

alter table dtv_de drop constraint if exists dtv_de_che_do_check;
alter table dtv_de add constraint dtv_de_che_do_check check (che_do in ('song_con', 'vo_tan', 'bot'));
alter table dtv_tran add column if not exists de_id uuid references dtv_de(id);
alter table dtv_tran add column if not exists nguon_cham text not null default 'client';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'dtv_tran_nguon_cham_chk') then
    alter table dtv_tran add constraint dtv_tran_nguon_cham_chk check (nguon_cham in ('client', 'server'));
  end if;
end $$;
comment on column dtv_tran.nguon_cham is 'server = SỐ CÂU ĐÚNG do máy chủ đếm từ đề chấm ở máy chủ (dtv_de); thắng/thua/điểm vẫn do game khai.';

-- Leo tháp: các hàm chấm tháp chỉ dành cho đề tháp (không dùng nhầm đề trận)
create or replace function public._dtv_de_la_thap(p_che_do text) returns boolean language sql immutable as $$ select p_che_do in ('song_con', 'vo_tan') $$;
revoke all on function public._dtv_de_la_thap(text) from public, anon, authenticated;

-- ĐỀ TRẬN với bot (môn có kho DB). Bắt đầu tính giờ ngay khi dựng.
create or replace function public.fn_dtv_de_tran_moi(p_uid text, p_mon text, p_khoi text, p_chu_de text default null, p_so integer default 15) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_seed text := md5(random()::text || clock_timestamp()::text); v_ds jsonb; v_ma text[]; v_id uuid; v_so integer := least(greatest(coalesce(p_so, 15), 3), 40);
  v_cd text := case when p_chu_de in ('tron', 'auto', '') then null else p_chu_de end;
begin
  perform public._dtv_kiem_uid(p_uid);
  if left(coalesce(p_uid, ''), 3) <> 'hs_' then raise exception 'Chỉ tài khoản học sinh mới có đề chấm ở máy chủ.'; end if;
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  if not public._kho_co_mon(p_mon) then raise exception 'Môn này chưa chấm ở máy chủ.'; end if;
  v_ds := public.fn_dtv_kho_bo_cau(p_mon, p_khoi, v_cd, v_so, v_seed, false);
  if v_ds is null or jsonb_array_length(v_ds) < 3 then raise exception 'Chủ đề này chưa đủ câu trắc nghiệm.'; end if;
  v_ma := array(select e->>'ma_cau' from jsonb_array_elements(v_ds) with ordinality t(e, o) order by o);
  insert into dtv_de (uid, mon, che_do, khoi, chu_de, nhom, seed, ma_cau, so_cau, giay_goc, bat_dau_at)
  values (p_uid, p_mon, 'bot', p_khoi, v_cd, p_khoi, v_seed, v_ma, cardinality(v_ma), public._dtv_giay_thap(p_mon), clock_timestamp()) returning id into v_id;
  return jsonb_build_object('de_id', v_id, 'so_cau', cardinality(v_ma));
end $$;
revoke all on function public.fn_dtv_de_tran_moi(text, text, text, text, integer) from public, anon;
grant execute on function public.fn_dtv_de_tran_moi(text, text, text, text, integer) to authenticated;

-- CHẤM 1 câu của trận. p_chon: 0–3 = phương án · -1 = bỏ qua (mất câu, để xem đáp án; ≥ 2 giây từ câu trước). Tuần tự, mỗi câu 1 lần.
create or replace function public.fn_dtv_cham_tran(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer default 0) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_troi_ms numeric; v_ms integer; v_dung boolean; v_idx integer; v_chon integer := coalesce(p_chon, -1); v_opts jsonb;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  if d.che_do <> 'bot' then raise exception 'Đề này không phải trận đấu'; end if;
  if d.ket_thuc_at is not null then raise exception 'Trận đã kết thúc'; end if;
  if p_thu_tu <> d.so_tra_loi + 1 or p_thu_tu > d.so_cau then raise exception 'Sai thứ tự câu'; end if;
  v_troi_ms := extract(epoch from (v_now - coalesce(d.cau_cuoi_at, d.bat_dau_at))) * 1000;
  if v_chon not between 0 and 3 then
    v_chon := -1;
    if v_troi_ms < 2000 then raise exception 'Chưa hết lượt câu này'; end if;     -- chặn "bỏ qua liên tục để xem đáp án"
  end if;
  k := public._dtv_kho_cau_mot(d.mon, d.ma_cau[p_thu_tu]);
  if k is null then raise exception 'Câu không còn trong kho'; end if;
  v_idx := (k->>'dung')::int; v_opts := k->'opts';
  v_dung := v_chon = v_idx;
  v_ms := least(greatest(coalesce(p_ms, 0), 150), greatest(v_troi_ms, 150))::int;
  insert into dtv_cau_log (uid, de_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, dap_an, tra_loi, dung, ms, nguon_cham)
  values (p_uid, p_de_id, d.mon, 'bot', coalesce(d.chu_de, 'tron'), p_thu_tu, k->>'ma_cau', k->>'ma_cau', left(k->>'de', 500), left(v_opts->>v_idx, 300),
          case when v_chon >= 0 then left(coalesce(v_opts->>v_chon, ''), 300) else '' end, v_dung, v_ms, 'server');
  update dtv_de set so_tra_loi = so_tra_loi + 1, so_dung = so_dung + case when v_dung then 1 else 0 end, so_sai = so_sai + case when v_dung then 0 else 1 end, cau_cuoi_at = v_now where id = p_de_id;
  return jsonb_build_object('dung', v_dung, 'dung_idx', v_idx, 'giai', k->'giai');
end $$;
revoke all on function public.fn_dtv_cham_tran(text, uuid, integer, integer, integer) from public, anon;
grant execute on function public.fn_dtv_cham_tran(text, uuid, integer, integer, integer) to authenticated;

-- Tháp: không nhận đề trận (và ngược lại ở trên)
create or replace function public._dtv_kiem_de_thap(p_che_do text) returns void language plpgsql immutable as $$
begin if not public._dtv_de_la_thap(p_che_do) then raise exception 'Đề này không phải đề Leo tháp'; end if; end $$;
revoke all on function public._dtv_kiem_de_thap(text) from public, anon, authenticated;

-- KẾT THÚC trận: số đúng/số câu do MÁY CHỦ đếm → ghi dtv_tran + XP như cũ (qua fn_dtv_ghi_tran_mon), gắn de_id + nhật ký câu. Idempotent.
create or replace function public.fn_dtv_tran_ket(p_uid text, p_de_id uuid, p_ket_qua text, p_diem integer default 0, p_doi_thu text default '') returns jsonb
language plpgsql security definer set search_path = public as $$
declare d dtv_de; r jsonb; v_tran uuid;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  if d.che_do <> 'bot' then raise exception 'Đề này không phải trận đấu'; end if;
  if p_ket_qua not in ('thang', 'thua', 'hoa') then raise exception 'Kết quả không hợp lệ'; end if;
  if d.ket_thuc_at is not null then
    select t.id into v_tran from dtv_tran t where t.de_id = d.id limit 1;
    return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', 0, 'len_cap', false, 'tran_id', v_tran);
  end if;
  r := public.fn_dtv_ghi_tran_mon(p_uid, d.mon, 'bot', coalesce(d.chu_de, 'tron'), p_ket_qua, d.so_dung, d.so_cau, greatest(coalesce(p_diem, 0), 0), coalesce(p_doi_thu, ''));
  v_tran := (r->>'tran_id')::uuid;
  update dtv_tran set de_id = d.id, nguon_cham = 'server' where id = v_tran;
  update dtv_cau_log set tran_id = v_tran where de_id = d.id;
  update dtv_de set ket_thuc_at = clock_timestamp() where id = d.id;
  return r;
end $$;
revoke all on function public.fn_dtv_tran_ket(text, uuid, text, integer, text) from public, anon;
grant execute on function public.fn_dtv_tran_ket(text, uuid, text, integer, text) to authenticated;

-- Đề tháp: chặn dùng nhầm đề trận — fn_dtv_cham / fn_dtv_thap_ket (sinh từ định nghĩa LIVE, chỉ chèn 1 dòng kiểm tra sau khi tìm thấy đề)
create or replace function public.fn_dtv_de_bat_dau(p_uid text, p_de_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public._dtv_kiem_uid(p_uid);
  update dtv_de set bat_dau_at = clock_timestamp(), cau_cuoi_at = null where id = p_de_id and uid = p_uid and bat_dau_at is null and ket_thuc_at is null and che_do in ('song_con', 'vo_tan');
  if not found and not exists (select 1 from dtv_de where id = p_de_id and uid = p_uid) then raise exception 'Đề không thuộc về em'; end if;
end $$;


CREATE OR REPLACE FUNCTION public.fn_dtv_cham(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_truoc timestamptz; v_troi_ms numeric; v_ms integer; v_dung boolean; v_dung_idx integer;
  v_han_ms numeric; v_opts jsonb; v_het_gio boolean := false; v_chon integer := coalesce(p_chon, -1);
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
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_dtv_thap_ket(p_uid text, p_de_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d dtv_de; n dtv_nguoi_choi; v_ngay date := _dtv_hom_nay(); v_tang integer; v_sai integer; v_ms integer; v_luot uuid; v_xp integer; v_luot_hom_nay integer;
  v_cap_truoc integer; v_cap_sau integer; v_xong boolean;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  perform public._dtv_kiem_de_thap(d.che_do);
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
end $function$
;
