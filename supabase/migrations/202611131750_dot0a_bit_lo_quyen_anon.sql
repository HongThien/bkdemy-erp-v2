-- ĐỢT 0a (13/11/2026) — bịt lỗ quyền đang hở với người CHƯA đăng nhập. Chỉ đổi QUYỀN, không đổi dữ liệu.
-- Spec: spec-kien-truc.md §7, §10 (đợt 0). Bằng chứng: reports/audit-scale-13-11.md §4.
-- Nguyên tắc: quyền của authenticated / service_role / claude_ro / fdw_bkdemy_web / ph_nop / web_lead_writer GIỮ NGUYÊN
-- (có kiểm tự động bên dưới, lệch là rollback). Chỉ anon/PUBLIC bị thu.

set local lock_timeout = '5s';

-- ───────────────────────── A. 8 bảng chưa bật RLS ─────────────────────────
alter table public.bao_cao_ph enable row level security;
revoke all on public.bao_cao_ph from anon;
drop policy if exists claude_ro_select on public.bao_cao_ph;
create policy claude_ro_select on public.bao_cao_ph for select to claude_ro using (true);
drop policy if exists bao_cao_ph_member_all on public.bao_cao_ph;
create policy bao_cao_ph_member_all on public.bao_cao_ph for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
drop policy if exists bao_cao_ph_fdw_select on public.bao_cao_ph;
create policy bao_cao_ph_fdw_select on public.bao_cao_ph for select to fdw_bkdemy_web using (true);  -- app phụ huynh đọc qua FDW

alter table public.bao_cao_ph_preset enable row level security;
revoke all on public.bao_cao_ph_preset from anon;
drop policy if exists claude_ro_select on public.bao_cao_ph_preset;
create policy claude_ro_select on public.bao_cao_ph_preset for select to claude_ro using (true);
drop policy if exists bao_cao_ph_preset_member_all on public.bao_cao_ph_preset;
create policy bao_cao_ph_preset_member_all on public.bao_cao_ph_preset for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

alter table public.bo_tro_duoi enable row level security;
revoke all on public.bo_tro_duoi from anon;
drop policy if exists claude_ro_select on public.bo_tro_duoi;
create policy claude_ro_select on public.bo_tro_duoi for select to claude_ro using (true);
drop policy if exists bo_tro_duoi_member_all on public.bo_tro_duoi;
create policy bo_tro_duoi_member_all on public.bo_tro_duoi for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

alter table public.hinh_linkgen_jobs enable row level security;
revoke all on public.hinh_linkgen_jobs from anon;
drop policy if exists claude_ro_select on public.hinh_linkgen_jobs;
create policy claude_ro_select on public.hinh_linkgen_jobs for select to claude_ro using (true);
drop policy if exists hinh_linkgen_jobs_member_all on public.hinh_linkgen_jobs;
create policy hinh_linkgen_jobs_member_all on public.hinh_linkgen_jobs for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

alter table public.phan_cong_ca enable row level security;
revoke all on public.phan_cong_ca from anon;
drop policy if exists claude_ro_select on public.phan_cong_ca;
create policy claude_ro_select on public.phan_cong_ca for select to claude_ro using (true);
drop policy if exists phan_cong_ca_member_all on public.phan_cong_ca;
create policy phan_cong_ca_member_all on public.phan_cong_ca for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

alter table public.kho_cau_log enable row level security;
revoke all on public.kho_cau_log from anon;
drop policy if exists claude_ro_select on public.kho_cau_log;
create policy claude_ro_select on public.kho_cau_log for select to claude_ro using (true);
drop policy if exists kho_cau_log_member_select on public.kho_cau_log;
create policy kho_cau_log_member_select on public.kho_cau_log for select to authenticated using ((select public.la_thanh_vien()));  -- ghi: chỉ trigger log_kho_cau (security definer)

alter table public._migrations enable row level security;
revoke all on public._migrations from anon;
drop policy if exists claude_ro_select on public._migrations;
create policy claude_ro_select on public._migrations for select to claude_ro using (true);
revoke all on public._migrations from authenticated;

alter table public._tt_mapping enable row level security;
revoke all on public._tt_mapping from anon;
drop policy if exists claude_ro_select on public._tt_mapping;
create policy claude_ro_select on public._tt_mapping for select to claude_ro using (true);
revoke all on public._tt_mapping from authenticated;


-- ───────────────────────── B. Hàm: thu EXECUTE của PUBLIC/anon ─────────────────────────
-- GIỮ cho anon: (1) hàm đã grant TƯỜNG MINH cho anon (bot có p_secret, game khách fn_dtv_*/fn_game_bxh*/fn_xep_chu_*);
-- (2) hàm dùng trong policy / default / check / view / index (anon gặp policy vẫn phải gọi được để nhận "false");
-- (3) hàm mà các hàm invoker ở (1)(2) gọi tới. Hàm trigger không đụng (không gọi được qua API).
create temp table _d0_truoc on commit drop as
  select r.rolname, p.oid as fn
  from pg_proc p cross join (select rolname, oid from pg_roles where rolname in ('authenticated','service_role','claude_ro','fdw_bkdemy_web','ph_nop','web_lead_writer','postgres')) r
  where p.pronamespace = 'public'::regnamespace and has_function_privilege(r.oid, p.oid, 'execute');

do $d0$
declare
  v_dung text; r record; n_thu int := 0; n_lech int;
  v_giu_them text[] := array['_kho_ngay_bat', 'fn_hinh_tt_node', 'fn_traogiai_slot_max', 'fn_hl_gia_thiet_phan'];
begin
  select string_agg(s, ' ') into v_dung from (
    select coalesce(qual, '') || ' ' || coalesce(with_check, '') as s from pg_policies
    union all select pg_get_expr(adbin, adrelid) from pg_attrdef
    union all select pg_get_constraintdef(oid) from pg_constraint where contype = 'c'
    union all select pg_get_viewdef(oid) from pg_class where relkind in ('v', 'm') and relnamespace = 'public'::regnamespace
    union all select pg_get_indexdef(indexrelid) from pg_index where indexprs is not null or indpred is not null
  ) x;
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and pg_get_userbyid(p.proowner) = current_user
      and p.prokind in ('f', 'p')
      and p.prorettype <> 'trigger'::regtype
      and has_function_privilege('anon', p.oid, 'execute')
      and coalesce(p.proacl::text, '') !~ '(^|[{,])anon='
      and p.proname <> all (v_giu_them)
      and v_dung !~ ('(^|[^a-z0-9_])' || p.proname || '[[:space:]]*[(]')
  loop
    execute format('revoke execute on routine %s from public, anon', r.sig);
    execute format('grant execute on routine %s to authenticated, service_role, claude_ro, fdw_bkdemy_web, ph_nop, web_lead_writer', r.sig);
    n_thu := n_thu + 1;
  end loop;
  raise notice 'dot 0a: da thu quyen anon/PUBLIC tren % ham', n_thu;
  if n_thu < 300 then raise exception 'dot 0a: chi thu duoc % ham (ky vong ~437) — dung lai', n_thu; end if;

  -- KIỂM: các role khác không mất hàm nào
  select count(*) into n_lech from _d0_truoc t join pg_roles ro on ro.rolname = t.rolname
   where not has_function_privilege(ro.oid, t.fn, 'execute');
  if n_lech > 0 then raise exception 'dot 0a: % cap (role, ham) BI MAT quyen — rollback', n_lech; end if;
end
$d0$;

-- 2 hàm retest không ai gọi từ client; chỉ trigger/hàm security definer gọi ⇒ đóng hẳn với người dùng API
revoke execute on function _btyeu_bu_retest(uuid,text[]) from public, anon, authenticated;
revoke execute on function fn_btyeu_retest_ghi(uuid) from public, anon, authenticated;

-- ───────────────────────── C. View: anon không còn quyền gì ─────────────────────────
revoke all on public.bdm_ban_do,
  public.bdm_ban_do_hgt,
  public.bdm_ban_do_toan,
  public.bdm_cau_dang,
  public.bdm_cau_form_tn,
  public.bdm_cau_hoi,
  public.bdm_cau_menh_de,
  public.bdm_dang_ly_thuyet,
  public.hinh_hoc_ban_do,
  public.hmh_ban_do,
  public.hmh_cau_hoi,
  public.hmh_cum_bai,
  public.hmh_cum_tien_de,
  public.hmh_dang_ly_thuyet,
  public.v_dien_loi_hs,
  public.v_giaibai_bai,
  public.v_giaibai_hoan_thien,
  public.v_giaibai_nhan,
  public.v_hinh_chua_giai,
  public.v_khao_sat_cum_toa,
  public.v_khao_sat_cum_truong,
  public.v_khao_sat_kenh,
  public.v_khao_sat_lead,
  public.v_khao_sat_vector,
  public.v_mcq_loi_hs
  from anon;

-- ───────────────────────── D. Cổng cho 6 hàm security definer chưa kiểm người gọi ─────────────────────────
-- Chặn người dùng API (anon/authenticated) không phải nhân sự. Tác vụ nền, service role, role DB trực tiếp không bị chặn.
do $d0g$
begin
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_dai_chuyen_dang(text,text)'::regprocedure) is distinct from '63cf27fbb8db9dc81be879313587aad9' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', 'fn_dai_chuyen_dang';
  end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_dai_chuyen_chuyen_de(text,text)'::regprocedure) is distinct from 'f2a6d98929bc510ed5885f81bb94383d' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', 'fn_dai_chuyen_chuyen_de';
  end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_dai_gop_cau_dang(text,text)'::regprocedure) is distinct from '9912005bd23ee06b672f630900dd7055' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', 'fn_dai_gop_cau_dang';
  end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_ca_test_phan_cong_lai(uuid,text)'::regprocedure) is distinct from '6f17a012bcc81695bd86993e27b26540' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', 'fn_ca_test_phan_cong_lai';
  end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_btyeu_ca_sap_toi(date,date)'::regprocedure) is distinct from '56ad68ec766a14673eaeb48a89837952' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', 'fn_btyeu_ca_sap_toi';
  end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_lich_truc_cua_hs(uuid,text,date)'::regprocedure) is distinct from 'dde24da376abae3717e8439035f18d1e' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', 'fn_lich_truc_cua_hs';
  end if;
end
$d0g$;

CREATE OR REPLACE FUNCTION public.fn_dai_chuyen_dang(p_ma_dang text, p_ma_chuyen_de_moi text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_new_ma_dang  text;
  v_ten_cd       text;
  v_ma_chu_de    text;
  v_ten_chu_de   text;
  v_khoi         text;
  v_muc_do       smallint;
  t              text;
  bang_textref_chi_ma_dang text[] := array[
    'gami_session_problems','bai_test_cau','tu_luyen_dang_lan',
    'buoi_danh_gia_dang','bo_tro_duoi_dang','bo_tro_yeu_dang','canh_bao_yeu'
  ];
begin
  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)
  if not (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then
    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';
  end if;

  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang) then
    raise exception 'fn_dai_chuyen_dang: dạng "%" không tồn tại', p_ma_dang;
  end if;

  -- Denormalize từ dạng khác cùng chuyên đề đích (lấy muc_do luôn)
  select ten_chuyen_de, ma_chu_de, ten_chu_de, khoi, muc_do
    into v_ten_cd, v_ma_chu_de, v_ten_chu_de, v_khoi, v_muc_do
    from dai_ban_do
   where ma_chuyen_de = p_ma_chuyen_de_moi and ma_dang <> p_ma_dang
   limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_dang: chuyên đề đích "%" chưa tồn tại (cần ≥1 dạng khác — tạo chuyên đề mới bằng luồng riêng)', p_ma_chuyen_de_moi;
  end if;

  if (select ma_chuyen_de from dai_ban_do where ma_dang = p_ma_dang) = p_ma_chuyen_de_moi then
    raise exception 'fn_dai_chuyen_dang: dạng "%" đã ở chuyên đề "%"', p_ma_dang, p_ma_chuyen_de_moi;
  end if;

  v_new_ma_dang := fn_dai_chuyen_dang_ma_moi(p_ma_dang, p_ma_chuyen_de_moi);

  -- Update dai_ban_do — FK cascade tự lo bảng con
  update dai_ban_do set
    ma_dang       = v_new_ma_dang,
    ma_chuyen_de  = p_ma_chuyen_de_moi,
    ten_chuyen_de = v_ten_cd,
    ma_chu_de     = v_ma_chu_de,
    ten_chu_de    = v_ten_chu_de,
    khoi          = v_khoi
  where ma_dang = p_ma_dang;

  -- ca_test_cau có SNAPSHOT ten_chuyen_de + muc_do → sync TẤT CẢ trong 1 update
  update public.ca_test_cau set
    ma_dang       = v_new_ma_dang,
    ten_chuyen_de = v_ten_cd,
    muc_do        = v_muc_do
  where ma_dang = p_ma_dang;

  -- Bảng text-ref còn lại chỉ có cột ma_dang → update loop
  foreach t in array bang_textref_chi_ma_dang loop
    execute format('update public.%I set ma_dang = %L where ma_dang = %L', t, v_new_ma_dang, p_ma_dang);
  end loop;

  return v_new_ma_dang;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dai_chuyen_chuyen_de(p_ma_chuyen_de text, p_ma_chu_de_moi text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_new_cd     text;
  v_ten_chu    text;
  v_khoi       text;
  v_ten_cd_cu  text;
  t            text;
  bang_textref text[] := array[
    'gami_session_problems','ca_test_cau','bai_test_cau','tu_luyen_dang_lan',
    'buoi_danh_gia_dang','bo_tro_duoi_dang','bo_tro_yeu_dang','canh_bao_yeu'
  ];
begin
  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)
  if not (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then
    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';
  end if;

  -- 1. Validate nguồn
  select ten_chuyen_de into v_ten_cd_cu
    from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_chuyen_de: chuyên đề "%" không tồn tại', p_ma_chuyen_de;
  end if;

  -- 2. Chủ đề đích tồn tại (có ≥1 chuyên đề KHÁC nguồn) — lấy denormalize
  select ten_chu_de, khoi into v_ten_chu, v_khoi
    from dai_ban_do
   where ma_chu_de = p_ma_chu_de_moi and ma_chuyen_de <> p_ma_chuyen_de
   limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_chuyen_de: chủ đề đích "%" chưa tồn tại (cần ≥1 chuyên đề khác)', p_ma_chu_de_moi;
  end if;

  -- 3. Không chuyển vào chính chủ đề đang có
  if (select ma_chu_de from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de limit 1) = p_ma_chu_de_moi then
    raise exception 'fn_dai_chuyen_chuyen_de: chuyên đề "%" đã ở chủ đề "%"', p_ma_chuyen_de, p_ma_chu_de_moi;
  end if;

  -- 4. Sinh mã chuyên đề mới (max STT+1 trong chủ đề đích)
  v_new_cd := fn_dai_sinh_ma_chuyen_de(p_ma_chu_de_moi, null);

  -- 5. Build mapping ma_dang cũ → mới cho mọi dạng trong chuyên đề nguồn
  --    (bảo tồn 2 số STT cuối) — dùng làm chuẩn cho text-ref update sau.
  create temp table _cd_map (ma_dang_cu text primary key, ma_dang_moi text not null) on commit drop;
  insert into _cd_map (ma_dang_cu, ma_dang_moi)
  select ma_dang, v_new_cd || substring(ma_dang from length(ma_dang) - 1)
    from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de;

  -- 6. Update dai_ban_do — 1 batch (FK cascade tự lo con)
  update dai_ban_do b set
    ma_dang       = m.ma_dang_moi,
    ma_chuyen_de  = v_new_cd,
    ma_chu_de     = p_ma_chu_de_moi,
    ten_chu_de    = v_ten_chu,
    khoi          = v_khoi
  from _cd_map m
  where m.ma_dang_cu = b.ma_dang;

  -- 7. Update dai_chuyen_de_ly_thuyet (PK text, không FK cascade)
  update dai_chuyen_de_ly_thuyet
     set ma_chuyen_de = v_new_cd
   where ma_chuyen_de = p_ma_chuyen_de;

  -- 8. Update text-ref không FK — batch qua _cd_map
  foreach t in array bang_textref loop
    execute format(
      'update public.%I x set ma_dang = m.ma_dang_moi from _cd_map m where m.ma_dang_cu = x.ma_dang',
      t
    );
  end loop;

  return v_new_cd;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dai_gop_cau_dang(p_ma_dang_nguon text, p_ma_dang_dich text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  n_cau  int;
  n_md   int;
begin
  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)
  if not (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then
    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';
  end if;

  if p_ma_dang_nguon is null or p_ma_dang_dich is null then
    raise exception 'fn_dai_gop_cau_dang: nguồn/đích không được NULL';
  end if;
  if p_ma_dang_nguon = p_ma_dang_dich then
    raise exception 'fn_dai_gop_cau_dang: nguồn và đích trùng nhau (%)', p_ma_dang_nguon;
  end if;
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang_nguon) then
    raise exception 'fn_dai_gop_cau_dang: dạng nguồn "%" không tồn tại', p_ma_dang_nguon;
  end if;
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'fn_dai_gop_cau_dang: dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;

  update dai_cau_hoi set dang_chinh = p_ma_dang_dich where dang_chinh = p_ma_dang_nguon;
  get diagnostics n_cau = row_count;

  update dai_cau_menh_de set dang_chinh = p_ma_dang_dich where dang_chinh = p_ma_dang_nguon;
  get diagnostics n_md = row_count;

  return jsonb_build_object('so_cau', n_cau, 'so_menh_de', n_md);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ca_test_phan_cong_lai(p_ung_vien_id uuid, p_khoi text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n integer := 0;
begin
  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)
  if not (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then
    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';
  end if;

  if p_khoi is null then return 0; end if;
  with pc as (select mon, nguoi_cham_id, nguoi_tra_bai_id from public.test_dau_vao_phan_cong where khoi = p_khoi),
  upd as (
    update public.ca_test ct
       set nguoi_cham_id    = case when ct.cham_xong_at is null then pc.nguoi_cham_id else ct.nguoi_cham_id end,
           nguoi_tra_bai_id = pc.nguoi_tra_bai_id
      from pc
     where ct.ung_vien_id = p_ung_vien_id and ct.mon = pc.mon
       and ct.trang_thai <> 'huy' and ct.tra_bai_xong_at is null
       and (ct.nguoi_tra_bai_id is distinct from pc.nguoi_tra_bai_id
            or (ct.cham_xong_at is null and ct.nguoi_cham_id is distinct from pc.nguoi_cham_id))
     returning 1)
  select count(*) into n from upd;
  return n;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_sap_toi(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su
  select case when (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then (
with kh as (
    select coalesce(p_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as tu,
           coalesce(p_den, (now() at time zone 'Asia/Ho_Chi_Minh')::date + 28) as den
  ),
  b as (
    select y.mon, bh.ngay, bh.gio_bat_dau, bh.gio_ket_thuc, bh.phong, bh.nguoi_day_tg,
           bh.id as buoi_id, hh.hoc_sinh_id, hs.ho_ten, hs.khoi, hh.diem_danh, y.id as case_id
    from buoi_hoc bh
    join buoi_hoc_hs hh on hh.buoi_hoc_id = bh.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh hs on hs.id = hh.hoc_sinh_id, kh
    where bh.loai = 'bo_tro_yeu' and bh.trang_thai = 'mo' and bh.ngay between kh.tu and kh.den
  ),
  g as (
    select mon, ngay, gio_bat_dau, nguoi_day_tg,
           min(gio_ket_thuc) as gio_ket_thuc, min(phong) as phong,
           count(*)::int as so_hs,
           jsonb_agg(jsonb_build_object('buoi_id', buoi_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'khoi', khoi, 'diem_danh', diem_danh, 'case_id', case_id) order by ho_ten) as hs
    from b group by 1,2,3,4
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'mon', g.mon, 'ngay', g.ngay, 'gio_bat_dau', g.gio_bat_dau, 'gio_ket_thuc', g.gio_ket_thuc, 'phong', g.phong,
    'nguoi_day_tg', g.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'so_hs', g.so_hs, 'hs', g.hs,
    'lich_truc_id', lt.id, 'suc_chua', coalesce(lt.suc_chua, 3),
    'lich_truc_pham_vi', case when lt.id is null then null else 'khối ' || lt.khoi || lt.bac end
  ) order by g.ngay, g.gio_bat_dau nulls last, g.mon), '[]'::jsonb)
  from g
  left join nhan_su ns on ns.id = g.nguoi_day_tg
  left join lateral (
    select t.id, t.suc_chua, t.khoi, t.bac from lich_truc_bo_tro t
    where t.mon = g.mon and t.gio_bat_dau = g.gio_bat_dau and t.nhan_su_id = g.nguoi_day_tg
      and t.thu = (case extract(isodow from g.ngay)::int when 7 then 8 else extract(isodow from g.ngay)::int + 1 end)
      and t.hieu_luc_tu <= g.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= g.ngay)
    order by t.khoi limit 1
  ) lt on true
  ) end
$function$;

CREATE OR REPLACE FUNCTION public.fn_lich_truc_cua_hs(p_hoc_sinh uuid, p_mon text, p_ngay date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su
  select case when (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then (
with d as (select coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as ngay),
  lops as (
    select l.khoi, l.bac, coalesce(b.thu_tu, 0) as bac_tt
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id left join lop_bac b on b.ma = l.bac
    where hl.hoc_sinh_id = p_hoc_sinh and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon
  ),
  hs as (
    select coalesce((select khoi from lops limit 1), (select khoi from hoc_sinh where id = p_hoc_sinh)) as khoi,
           coalesce((select min(bac_tt) from lops), 0) as bac_tt
  ),
  chon as (
    select t.*, coalesce(tb.thu_tu, 0) as t_tt from lich_truc_bo_tro t left join lop_bac tb on tb.ma = t.bac, d, hs
    where t.mon = p_mon and t.khoi = hs.khoi and coalesce(tb.thu_tu, 0) >= hs.bac_tt
      and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'thu', c.thu, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'khoi', c.khoi, 'bac', c.bac, 'lop_id', null, 'ghi_chu', c.ghi_chu, 'suc_chua', c.suc_chua
  ) order by c.thu, c.gio_bat_dau), '[]'::jsonb)
  from chon c left join nhan_su ns on ns.id = c.nhan_su_id
  ) end
$function$;

-- ───────────────────────── E. Mặc định ĐÓNG cho đối tượng mới của role ghi ─────────────────────────
-- Hàm mới: PUBLIC/anon không tự có EXECUTE; authenticated + service_role + claude_ro có sẵn. Cần cho anon ⇒ grant tường minh.
alter default privileges for role claude_build revoke execute on functions from public;
alter default privileges for role claude_build in schema public grant execute on functions to authenticated, service_role, claude_ro;
-- Bảng mới: anon không tự có quyền (8 bảng hở ở trên sinh ra từ mặc định cũ + quên bật RLS).
alter default privileges for role claude_build in schema public revoke all on tables from anon;

-- ───────────────────────── KIỂM CUỐI ─────────────────────────
do $d0k$
declare n int;
begin
  select count(*) into n from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' and not c.relrowsecurity
     and c.relname in ('_migrations','_tt_mapping','bao_cao_ph','bao_cao_ph_preset','bo_tro_duoi','hinh_linkgen_jobs','kho_cau_log','phan_cong_ca');
  if n > 0 then raise exception 'dot 0a: con % bang chua bat RLS', n; end if;
  select count(*) into n from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
     and c.relname in ('_migrations','_tt_mapping','bao_cao_ph','bao_cao_ph_preset','bo_tro_duoi','hinh_linkgen_jobs','kho_cau_log','phan_cong_ca')
     and (has_table_privilege('anon', c.oid, 'select') or has_table_privilege('anon', c.oid, 'insert') or has_table_privilege('anon', c.oid, 'update') or has_table_privilege('anon', c.oid, 'delete'));
  if n > 0 then raise exception 'dot 0a: anon con quyen tren % bang', n; end if;
  select count(*) into n from pg_proc p where p.pronamespace = 'public'::regnamespace
     and p.proname in ('fn_dai_chuyen_dang','fn_dai_chuyen_chuyen_de','fn_dai_gop_cau_dang','fn_btyeu_ca_sap_toi','fn_lich_truc_cua_hs','fn_btyeu_retest_ghi','_btyeu_bu_retest','_kho_snapshot_cau','fn_ca_test_phan_cong_lai')
     and has_function_privilege('anon', p.oid, 'execute');
  if n > 0 then raise exception 'dot 0a: anon con goi duoc % ham trong nhom nguy hiem', n; end if;
end
$d0k$;
