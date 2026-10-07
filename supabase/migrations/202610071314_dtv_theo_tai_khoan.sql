-- ============================================================================
-- 202610071314 — dtv_theo_tai_khoan   (áp: `node scripts/migrate.mjs --only 202610071314_dtv_theo_tai_khoan.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (P1 — Thùy 07/10: "thông tin mọi thứ đi theo TÀI KHOẢN HỌC SINH" + "ghi lại MỌI THỨ trên app vào DB để sau này track được; không tính vào mastery dạng bài"):
--   Đấu Từ (Đấu trường BK · Chinh phục BK · Giải Vô địch…) đang lưu theo MÃ MÁY (uid ngẫu nhiên, anon) ⇒ không gắn được học sinh, không vào được Bảng xếp hạng/thưởng/thống kê.
--   ⇒ ① hồ sơ Đấu Từ của em có uid = 'hs_' || hoc_sinh_id (tự tạo bằng fn_dtv_ho_so_hs — KHÔNG phải chọn lại tên/nhân vật);
--      ② MỌI hàm fn_dtv_* nhận p_uid giờ kiểm `_dtv_kiem_uid`: uid bắt đầu 'hs_' CHỈ chính tài khoản đó dùng được (anon/người khác bị chặn) — hồ sơ MÁY (demo, uid khác) giữ nguyên;
--      ③ bảng dtv_cau_log = NHẬT KÝ TỪNG CÂU (đề, em chọn gì, đúng/sai, bao nhiêu ms, thuộc trận/lượt tháp nào) — ghi lại mọi thứ, để track về sau; KHÔNG đụng độ nắm dạng bài (mastery);
--      ④ dtv_tran / dtv_thap_luot / dtv_cau_log có cột hoc_sinh_id SUY từ uid (generated) ⇒ nối thẳng sang hoc_sinh; ghi_tran_mon trả thêm tran_id, thap_ghi_mon trả thêm luot_id để gắn nhật ký câu.
-- CHƯA LÀM (Phase 2, ghi rõ để khỏi hiểu nhầm): MÁY CHỦ CHẤM — hiện câu hỏi từ kho vẫn gửi kèm đáp án cho game, đúng/sai và điểm do client khai ⇒ cột dtv_cau_log.nguon_cham = 'client' (chưa tin tuyệt đối);
--   vì vậy Bảng xếp hạng C1 (Leo tháp) vẫn "Sắp có" cho tới khi chấm ở máy chủ.
-- MẤT GÌ: không xoá/sửa dữ liệu. Thay thân 12 hàm fn_dtv_* (thêm kiểm uid; hàm LANGUAGE sql được bọc thành plpgsql, kết quả y nguyên); ghi_tran_mon/thap_ghi_mon trả thêm 1 khoá JSON.
--   Hàm sinh từ định nghĩa LIVE ngày 07/10 (không chép tay).
-- ============================================================================

alter table dtv_nguoi_choi add column if not exists hoc_sinh_id uuid references hoc_sinh(id);
create unique index if not exists dtv_nguoi_choi_hs_uq on dtv_nguoi_choi (hoc_sinh_id) where hoc_sinh_id is not null;
comment on column dtv_nguoi_choi.hoc_sinh_id is 'Hồ sơ gắn tài khoản học sinh (uid = hs_<id>). NULL = hồ sơ theo máy (demo cũ).';

alter table dtv_tran add column if not exists hoc_sinh_id uuid generated always as (case when left(uid, 3) = 'hs_' then substr(uid, 4)::uuid end) stored;
alter table dtv_thap_luot add column if not exists hoc_sinh_id uuid generated always as (case when left(uid, 3) = 'hs_' then substr(uid, 4)::uuid end) stored;
create index if not exists dtv_tran_hs_idx on dtv_tran (hoc_sinh_id, tao_at) where hoc_sinh_id is not null;
create index if not exists dtv_thap_luot_hs_idx on dtv_thap_luot (hoc_sinh_id, tao_at) where hoc_sinh_id is not null;

-- NHẬT KÝ TỪNG CÂU (mọi chế độ của Đấu Từ). Chỉ ghi khi có câu trả lời thật (hoặc hết giờ) — §1.5.
create table if not exists dtv_cau_log (
  id uuid primary key default gen_random_uuid(),
  uid text not null references dtv_nguoi_choi(uid),
  hoc_sinh_id uuid generated always as (case when left(uid, 3) = 'hs_' then substr(uid, 4)::uuid end) stored,
  tran_id uuid references dtv_tran(id),
  luot_id uuid references dtv_thap_luot(id),
  mon text not null,
  che_do text not null,                 -- bot · doi · mang · giai · on_tap · noi_tu · song_con · vo_tan
  chu_de text not null default '',
  thu_tu integer not null,              -- thứ tự câu trong trận/lượt (từ 1)
  ma_cau text,                          -- kho DB: ma_cau · tiếng Anh: id từ
  cau_id text,                          -- id phía game
  de text,                              -- đề (cắt 500 ký tự) — để còn đọc lại khi câu kho đổi
  tra_loi text,                         -- phương án em chọn ('' = hết giờ / bỏ qua)
  dung boolean not null,
  ms integer,                           -- thời gian trả lời
  nguon_cham text not null default 'client' check (nguon_cham in ('client', 'server')),
  tao_at timestamptz not null default now()
);
create index if not exists dtv_cau_log_hs_idx on dtv_cau_log (hoc_sinh_id, tao_at) where hoc_sinh_id is not null;
create index if not exists dtv_cau_log_tran_idx on dtv_cau_log (tran_id);
comment on table dtv_cau_log is 'Nhật ký TỪNG CÂU Đấu Từ gắn tài khoản (uid hs_*). Ghi lại mọi thứ để track; KHÔNG cộng vào độ nắm dạng bài (Thùy 07/10). nguon_cham=client: đúng/sai do game khai, chưa chấm ở máy chủ.';
alter table dtv_cau_log enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'dtv_cau_log' and policyname = 'dtv_cau_log_nhan_vien') then
    create policy dtv_cau_log_nhan_vien on dtv_cau_log for select to authenticated using (public.la_thanh_vien());
  end if;
end $$;

-- Hồ sơ 'hs_*' chỉ chính chủ tài khoản dùng được; hồ sơ máy (uid khác) không bị ràng buộc
create or replace function public._dtv_kiem_uid(p_uid text) returns void
language plpgsql stable security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if p_uid is not null and left(p_uid, 3) = 'hs_' then
    if v_hs is null or p_uid <> 'hs_' || v_hs::text then raise exception 'Không có quyền với hồ sơ này.'; end if;
  end if;
end $$;
revoke all on function public._dtv_kiem_uid(text) from public, anon, authenticated;

-- Hồ sơ Đấu Từ của CHÍNH em (tự tạo lần đầu): tên = 2 từ cuối họ tên, nhân vật theo giới tính (hoặc p_nv nếu app truyền)
create or replace function public.fn_dtv_ho_so_hs(p_nv text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); v_uid text; h hoc_sinh%rowtype; v_ma text; v_nv text; v_ten text;
begin
  if v_hs is null then raise exception 'Chỉ học sinh đăng nhập mới dùng được.'; end if;
  v_uid := 'hs_' || v_hs::text;
  if not exists (select 1 from dtv_nguoi_choi where uid = v_uid) then
    select * into h from hoc_sinh where id = v_hs;
    v_nv := case when p_nv in ('tham_hiem_nam', 'tham_hiem_nu', 'hiep_si_dem', 'phap_su') then p_nv when h.gioi_tinh = 'nu' then 'tham_hiem_nu' else 'tham_hiem_nam' end;
    v_ten := (select string_agg(w, ' ' order by o) from (select w, o from regexp_split_to_table(btrim(h.ho_ten), '\s+') with ordinality t(w, o) order by o desc limit 2) z);
    loop
      v_ma := 'BK-' || lpad((floor(random() * 100000))::int::text, 5, '0');
      exit when not exists (select 1 from dtv_nguoi_choi where ma = v_ma);
    end loop;
    insert into dtv_nguoi_choi (uid, ma, ten, nv, hoc_sinh_id) values (v_uid, v_ma, coalesce(nullif(v_ten, ''), 'Học sinh'), v_nv, v_hs);
  end if;
  return jsonb_build_object('uid', v_uid, 'ho_so', public._dtv_ho_so_json(v_uid));
end $$;
revoke all on function public.fn_dtv_ho_so_hs(text) from public, anon;
grant execute on function public.fn_dtv_ho_so_hs(text) to authenticated;

-- Ghi NHẬT KÝ CÂU theo lô (≤ 80 câu mỗi lần). Mỗi phần tử p_cau: {thu_tu, ma_cau, cau_id, de, tra_loi, dung, ms}
create or replace function public.fn_dtv_ghi_cau(p_uid text, p_mon text, p_che_do text, p_chu_de text, p_tran_id uuid, p_luot_id uuid, p_cau jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare v_n integer;
begin
  perform public._dtv_kiem_uid(p_uid);
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  if jsonb_typeof(p_cau) <> 'array' then raise exception 'Dữ liệu không hợp lệ'; end if;
  if p_che_do not in ('bot', 'doi', 'mang', 'giai', 'on_tap', 'noi_tu', 'song_con', 'vo_tan') then raise exception 'Chế độ không hợp lệ'; end if;
  if p_tran_id is not null and not exists (select 1 from dtv_tran where id = p_tran_id and uid = p_uid) then raise exception 'Trận không thuộc về em'; end if;
  if p_luot_id is not null and not exists (select 1 from dtv_thap_luot where id = p_luot_id and uid = p_uid) then raise exception 'Lượt không thuộc về em'; end if;
  insert into dtv_cau_log (uid, tran_id, luot_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, tra_loi, dung, ms)
  select p_uid, p_tran_id, p_luot_id, coalesce(nullif(p_mon, ''), 'Tiếng Anh'), p_che_do, coalesce(p_chu_de, ''),
         coalesce((e->>'thu_tu')::int, 0), nullif(e->>'ma_cau', ''), nullif(e->>'cau_id', ''), left(e->>'de', 500), coalesce(e->>'tra_loi', ''),
         coalesce((e->>'dung')::boolean, false), least(greatest(coalesce((e->>'ms')::int, 0), 0), 600000)
  from (select e from jsonb_array_elements(p_cau) e limit 80) x(e);
  get diagnostics v_n = row_count;
  return v_n;
end $$;
revoke all on function public.fn_dtv_ghi_cau(text, text, text, text, uuid, uuid, jsonb) from public;
grant execute on function public.fn_dtv_ghi_cau(text, text, text, text, uuid, uuid, jsonb) to anon, authenticated;

-- fn_dtv_ho_so (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_ho_so(p_uid text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (select _dtv_ho_so_json(p_uid));
end $function$;

-- fn_dtv_ho_so_luu (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_ho_so_luu(p_uid text, p_ten text, p_nv text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ma text;
begin
  perform public._dtv_kiem_uid(p_uid);
  if p_nv not in ('tham_hiem_nam','tham_hiem_nu','hiep_si_dem','phap_su') then p_nv := 'tham_hiem_nam'; end if;
  if exists (select 1 from dtv_nguoi_choi where uid = p_uid) then
    update dtv_nguoi_choi set ten = btrim(p_ten), nv = p_nv, cap_nhat_at = now() where uid = p_uid;
  else
    loop
      v_ma := 'BK-' || lpad((floor(random() * 100000))::int::text, 5, '0');
      exit when not exists (select 1 from dtv_nguoi_choi where ma = v_ma);
    end loop;
    insert into dtv_nguoi_choi (uid, ma, ten, nv) values (p_uid, v_ma, btrim(p_ten), p_nv);
  end if;
  return _dtv_ho_so_json(p_uid);
end $function$
;

-- fn_dtv_ghi_tran (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_ghi_tran(p_uid text, p_che_do text, p_chu_de text, p_ket_qua text, p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (select fn_dtv_ghi_tran_mon(p_uid, 'Tiếng Anh', p_che_do, p_chu_de, p_ket_qua, p_so_dung, p_so_cau, p_diem, p_doi_thu));
end $function$;

-- fn_dtv_ghi_tran_mon (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_ghi_tran_mon(p_uid text, p_mon text, p_che_do text, p_chu_de text, p_ket_qua text, p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_cau integer := least(greatest(coalesce(p_so_cau, 0), 0), 40);
  v_dung integer := least(greatest(coalesce(p_so_dung, 0), 0), least(greatest(coalesce(p_so_cau, 0), 0), 40));
  v_xp integer; v_hom_nay date := _dtv_hom_nay(); v_cap_truoc integer; v_cap_sau integer;
  v_luot_hom_nay integer; n dtv_nguoi_choi; v_tran uuid;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;

  v_xp := case
    when p_che_do = 'on_tap' then v_dung * 2
    when p_che_do = 'noi_tu' then least(v_dung, 30) * 2 + case p_ket_qua when 'thang' then 20 else 0 end
    else v_dung * 5 + case p_ket_qua when 'thang' then 40 when 'hoa' then 20 else 10 end
  end;
  select count(*) into v_luot_hom_nay from dtv_tran
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom_nay;
  if v_luot_hom_nay >= 60 then v_xp := 0; end if;

  insert into dtv_tran (uid, mon, che_do, chu_de, ket_qua, so_dung, so_cau, diem, xp, doi_thu)
  values (p_uid, coalesce(nullif(p_mon, ''), 'Tiếng Anh'), p_che_do, coalesce(nullif(p_chu_de, ''), 'tron'), p_ket_qua, v_dung, v_cau,
          least(greatest(coalesce(p_diem, 0), 0), 10000), v_xp, nullif(p_doi_thu, ''))
  returning id into v_tran;

  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    so_tran  = n.so_tran  + case when p_che_do in ('bot','mang','giai') then 1 else 0 end,
    so_thang = n.so_thang + case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then 1 else 0 end,
    chuoi_thang = case when p_che_do not in ('bot','mang','giai') then n.chuoi_thang
                       when p_ket_qua = 'thang' then n.chuoi_thang + 1
                       when p_ket_qua = 'thua' then 0 else n.chuoi_thang end,
    chuoi_thang_max = greatest(n.chuoi_thang_max,
                       case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then n.chuoi_thang + 1 else 0 end),
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_hom_nay then n.chuoi_ngay
                      when n.ngay_hoc_cuoi = v_hom_nay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_hom_nay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc, 'tran_id', v_tran);
end $function$
;

-- fn_dtv_gop_tu (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_gop_tu(p_uid text, p_en text, p_vi text, p_loai text, p_vd text, p_vdvi text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_n integer;
begin
  perform public._dtv_kiem_uid(p_uid);
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  select count(*) into v_n from dtv_gop_tu
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = _dtv_hom_nay();
  if v_n >= 10 then raise exception 'Hôm nay em đã góp đủ 10 từ rồi'; end if;
  if coalesce(btrim(p_vd), '') <> '' and position(lower(btrim(p_en)) in lower(p_vd)) = 0 then
    raise exception 'Câu ví dụ phải chứa từ được đóng góp';
  end if;
  insert into dtv_gop_tu (uid, en, vi, loai_tu, vi_du, vi_du_vi)
  values (p_uid, lower(btrim(p_en)), btrim(p_vi),
          case when p_loai in ('n','v','adj','adv','phr') then p_loai else 'khong_ro' end,
          coalesce(btrim(p_vd), ''), coalesce(btrim(p_vdvi), ''));
  return jsonb_build_object('con_lai_hom_nay', 9 - v_n);
end $function$
;

-- fn_dtv_gop_tu_cua_toi (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_gop_tu_cua_toi(p_uid text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (select coalesce(jsonb_agg(jsonb_build_object('en', en, 'vi', vi, 'loai_tu', loai_tu, 'trang_thai', trang_thai, 'tao_at', tao_at)
                            order by tao_at desc), '[]'::jsonb)
  from (select * from dtv_gop_tu where uid = p_uid order by tao_at desc limit 50) t);
end $function$;

-- fn_dtv_gop_y (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_gop_y(p_uid text, p_noi_dung text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  if not exists (select 1 from dtv_nguoi_choi where uid = p_uid) then raise exception 'Chưa có hồ sơ người chơi'; end if;
  insert into dtv_gop_y (uid, noi_dung) values (p_uid, btrim(p_noi_dung));
end $function$
;

-- fn_dtv_thap_ghi (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_thap_ghi(p_uid text, p_che_do text, p_tang integer, p_sai integer, p_ms integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (select fn_dtv_thap_ghi_mon(p_uid, p_che_do, 'Tiếng Anh', '', p_tang, p_sai, p_ms));
end $function$;

-- fn_dtv_thap_ghi_mon (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_thap_ghi_mon(p_uid text, p_che_do text, p_mon text, p_nhom text, p_tang integer, p_sai integer, p_ms integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_ngay date := _dtv_hom_nay();
  v_tang integer := greatest(coalesce(p_tang, 0), 0);
  v_ms integer := greatest(coalesce(p_ms, 0), 0);
  v_mon text := coalesce(nullif(p_mon, ''), 'Tiếng Anh');
  v_xp integer; v_luot_hom_nay integer; n dtv_nguoi_choi; v_luot uuid; v_cap_truoc integer; v_cap_sau integer;
begin
  perform public._dtv_kiem_uid(p_uid);
  if p_che_do not in ('song_con','vo_tan') then raise exception 'Chế độ tháp không hợp lệ'; end if;
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;
  if v_tang > 0 and v_ms < v_tang * 400 then raise exception 'Kết quả không hợp lệ'; end if;
  if p_che_do = 'song_con' and v_ms > 302000 then v_ms := 300000; end if;

  insert into dtv_thap_luot (uid, mon, nhom, che_do, ngay, tang, sai, ms)
  values (p_uid, v_mon, coalesce(p_nhom, ''), p_che_do, v_ngay, v_tang, greatest(coalesce(p_sai, 0), 0), v_ms)
  returning id into v_luot;

  select count(*) into v_luot_hom_nay from dtv_thap_luot where uid = p_uid and ngay = v_ngay;
  v_xp := case when v_luot_hom_nay > 30 then 0 else least(v_tang, 100) * 2 end;
  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_ngay then n.chuoi_ngay when n.ngay_hoc_cuoi = v_ngay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_ngay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc, 'luot_id', v_luot,
    'bxh', fn_dtv_thap_bxh_mon(p_che_do, v_mon, coalesce(p_nhom, ''), true, p_uid));
end $function$
;

-- fn_dtv_thap_bxh (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_thap_bxh(p_che_do text, p_hom_nay boolean, p_uid text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (select fn_dtv_thap_bxh_mon(p_che_do, 'Tiếng Anh', '', p_hom_nay, p_uid));
end $function$;

-- fn_dtv_thap_bxh_mon (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_thap_bxh_mon(p_che_do text, p_mon text, p_nhom text, p_hom_nay boolean, p_uid text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (with l as (
    select distinct on (t.uid) t.uid, t.tang, t.sai, t.ms, t.tao_at
    from dtv_thap_luot t
    where t.che_do = p_che_do and t.mon = p_mon and t.nhom = coalesce(p_nhom, '')
      and (not p_hom_nay or t.ngay = _dtv_hom_nay())
    order by t.uid, t.tang desc,
      case when p_che_do = 'song_con' then t.sai else t.ms end asc, t.tao_at asc
  ), x as (
    select l.*, n.ma, n.ten, n.nv,
      row_number() over (order by l.tang desc, case when p_che_do = 'song_con' then l.sai else l.ms end asc, l.tao_at asc) as hang
    from l join dtv_nguoi_choi n on n.uid = l.uid
  )
  select jsonb_build_object(
    'so_nguoi', (select count(*) from x),
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'tang', tang, 'sai', sai, 'ms', ms) order by hang)
                     from (select * from x order by hang limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'tang', tang, 'sai', sai, 'ms', ms) from x where uid = p_uid)));
end $function$;

-- fn_dtv_bxh (thêm kiểm uid theo tài khoản)
CREATE OR REPLACE FUNCTION public.fn_dtv_bxh(p_tieu_chi text, p_uid text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (with g as (
    select n.uid, n.ma, n.ten, n.nv, c.cap,
           case p_tieu_chi
             when 'chuoi_thang' then n.chuoi_thang_max
             when 'chuoi_ngay'  then case when n.ngay_hoc_cuoi >= _dtv_hom_nay() - 1 then n.chuoi_ngay else 0 end
             else n.xp end as gt
    from dtv_nguoi_choi n cross join lateral _dtv_cap(n.xp) c
  ), x as (
    select g.*, rank() over (order by gt desc) as hang from g where gt > 0
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'cap', cap, 'gt', gt) order by hang, ten)
                     from (select * from x order by hang, ten limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'gt', gt) from x where uid = p_uid)));
end $function$;

