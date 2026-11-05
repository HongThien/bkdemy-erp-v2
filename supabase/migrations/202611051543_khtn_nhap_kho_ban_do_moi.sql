-- ============================================================================
-- 202611051543 — khtn_nhap_kho_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 "Làm luôn" — tài khoản anh Ngọc (trưởng bộ môn KHTN) mở phiên Nhập kho bị chặn
--   "Môn KHTN chưa nối luồng phân dạng câu vào bản đồ mới". KHTN đã có bản đồ mới + khtn_bdm_gan_cau nhưng thiếu
--   hàng chờ (chưa chắc · thiếu dạng · kiểm mẫu · từ chối), bộ hàm Duyệt kho, và phiên chỉ nối Toán.
-- CÁCH (đối xứng Toán, §1.6 — cùng khuôn, bảng riêng, dispatch qua registry):
--   • 4 bảng khtn_bdm_de_xuat · _cau_thieu_dang · _kiem_mau · _tu_choi (cùng cột với dai_bdm_*).
--   • Bộ Duyệt kho fn_khtn_bdm_khop_{dem,hang,nguon_ds,dich,quyet} cùng chữ ký fn_bdm_khop_* ⇒ màn Duyệt kho dùng chung,
--     chỉ đổi tiền tố theo môn. Quyền duyệt = trưởng khối KHTN của khối trở lên (_khtn_bdm_duyet_duoc). Gán qua _khtn_bdm_gan.
--   • Phiên: registry _phien_kho_nhanh_ds + ('khtn', …) · _phien_kho_mon + 'KHTN' · _phien_kho_phan1 chặn câu khác môn phiên,
--     kiểm dạng/chủ đề ở khtn_bdm_*, 'cao' gán qua _khtn_bdm_gan · fn_phien_kho_{tong,hang,dang} rẽ theo môn ·
--     fn_phien_kho_them + fn_bdm_nhap_cau nhận kho 'khtn' (dạng chờ K<khối>000000, chưa duyệt).
-- MẤT GÌ: không xoá/drop gì. Thêm 4 bảng + 7 hàm. Viết lại (create or replace) _phien_kho_nhanh_ds · _phien_kho_mon ·
--   _phien_kho_phan1 · fn_phien_kho_tong · fn_phien_kho_hang · fn_phien_kho_dang · fn_phien_kho_them · fn_bdm_nhap_cau
--   — nhánh Toán giữ nguyên.
-- ============================================================================

-- ── 1. HÀNG CHỜ KHTN — cùng khuôn dai_bdm_* (§1.6: đối xứng môn) ───────────────
create table if not exists khtn_bdm_de_xuat (
  ma_cau      text primary key references khtn_cau_hoi(ma_cau),
  dang_bai_id text not null references khtn_bdm_dang_bai(id),
  chac        text not null default 'vua' check (chac in ('cao', 'vua')),
  ly_do       text not null default '',
  nguon       text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  at          timestamptz not null default now()
);
create table if not exists khtn_bdm_cau_thieu_dang (
  ma_cau    text primary key references khtn_cau_hoi(ma_cau),
  ly_do     text not null,
  nguon     text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  actor     uuid default public.jwt_uid(),
  at        timestamptz not null default now(),
  chu_de_id text references khtn_bdm_chu_de(id)          -- NULL = không nêu chủ đề (không áp dụng)
);
create table if not exists khtn_bdm_kiem_mau (
  ma_cau         text primary key references khtn_cau_hoi(ma_cau),
  dang_bai_ai_id text not null references khtn_bdm_dang_bai(id),
  ket_qua        text not null check (ket_qua in ('giu', 'doi')),
  actor          uuid default public.jwt_uid(),
  at             timestamptz not null default now()
);
create table if not exists khtn_bdm_tu_choi (
  id             bigint generated always as identity primary key,
  ma_cau         text not null,
  dang_bai_ai_id text,                                     -- NULL = câu chưa có dạng AI (không áp dụng)
  hang           text not null,
  kho_rac        boolean not null default false,
  ly_do          text not null,
  actor          uuid default public.jwt_uid(),
  at             timestamptz not null default now()
);
do $$ declare t text; begin
  foreach t in array array['khtn_bdm_de_xuat', 'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn_bdm_tu_choi'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_all', t);
    execute format('create policy %I on %I for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()))', t || '_member_all', t);
    execute format('revoke all on %I from anon', t);
  end loop;
end $$;

-- ── 2. QUYỀN DUYỆT KHTN: trưởng khối KHTN của khối trở lên ─────────────────────
create or replace function public._khtn_bdm_duyet_duoc(p_khoi text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select la_admin from my_quyen()), false) or public._truong_khoi_tro_len('KHTN', p_khoi)
$$;

-- ── 3. NGUỒN 4 HÀNG (chưa chắc · thiếu dạng · chưa có dạng · kiểm mẫu ~10%) ────
create or replace function public._khtn_bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql STABLE
AS $function$
  select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from khtn_bdm_de_xuat dx
      join khtn_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join khtn_bdm_dang_bai d on d.id = dx.dang_bai_id
      join khtn_bdm_nhom n on n.id = d.nhom_id
      join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, t.chu_de_id, t.ly_do, null::text
      from khtn_bdm_cau_thieu_dang t
      join khtn_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join khtn_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    -- chưa có dạng: câu gốc của khối, chưa gán / chưa đề xuất / chưa báo thiếu. Chủ đề gợi ý = nhóm bản đồ mới dựng từ dạng cũ (ma_cu).
    select q.ma_cau, null::text, (select min(n.chu_de_id) from khtn_bdm_nhom n where n.ma_cu = q.dang_chinh), ''::text, null::text
      from khtn_cau_hoi q
      join khtn_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from khtn_bdm_chu_de c2 where c2.khoi = p_khoi)
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from khtn_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from khtn_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from khtn_bdm_gan_cau g
      join khtn_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
      join khtn_bdm_dang_bai d on d.id = g.dang_bai_id
      join khtn_bdm_nhom n on n.id = d.nhom_id
      join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from khtn_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (như Toán)
  ) s
  where public._khtn_bdm_duyet_duoc(p_khoi)
$function$;

create or replace function public.fn_khtn_bdm_khop_dem(p_khoi text, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE sql STABLE
AS $function$
  with s as materialized (select x.ma_cau, x.chu_de_id, h.hang from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h(hang)
                           cross join lateral public._khtn_bdm_khop_nguon(p_khoi, h.hang) x
                          where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
                            and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau))))
  select jsonb_build_object(
    'de_xuat', (select count(*) from s where hang = 'de_xuat'),
    'thieu',   (select count(*) from s where hang = 'thieu'),
    'trong',   (select count(*) from s where hang = 'trong'),
    'mau',     (select count(*) from s where hang = 'mau'),
    'kiem_n',   (select count(*) from khtn_bdm_kiem_mau k join khtn_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from khtn_bdm_kiem_mau k join khtn_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
$function$;

create or replace function public.fn_khtn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE sql STABLE
AS $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from public._khtn_bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'khtn' and d.ma = x.ma_cau) ds on true
     where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
       and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau)))
  ),
  pg as (select * from s order by (de_sau_at is not null), de_sau_at, ma_cau
          limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', b.ten_dang, 'chuyen_de_cu', b.ten_chuyen_de,
        'nhanh', 'khtn', 'nguon_tl', public._kho_nguon_cau(q.ma_cau)
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join khtn_cau_hoi q on q.ma_cau = pg.ma_cau
      left join khtn_ban_do b on b.ma_dang = q.dang_chinh
      left join khtn_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join khtn_bdm_nhom n on n.id = d.nhom_id
      left join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
      left join khtn_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$;

create or replace function public.fn_khtn_bdm_khop_nguon_ds(p_khoi text, p_hang text, p_chu_de text DEFAULT NULL::text)
 RETURNS TABLE(nguon text, so_cau bigint) LANGUAGE sql STABLE
AS $function$
  select n, count(*) from public._khtn_bdm_khop_nguon(p_khoi, p_hang) s, unnest(public._kho_nguon_cau(s.ma_cau)) n
   where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de
   group by n order by n
$function$;

create or replace function public.fn_khtn_bdm_khop_dich(p_khoi text)
 RETURNS jsonb LANGUAGE sql STABLE
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dang_bai', d.ten, 'mo_ta', d.mo_ta, 'nhom', n.ten, 'nhom_id', n.id,
    'chuyen_de', ch.ten, 'chuyen_de_id', ch.id, 'chu_de', cd.ten, 'chu_de_id', cd.id
  ) order by cd.thu_tu, ch.id, n.thu_tu, d.thu_tu), '[]'::jsonb)
  from khtn_bdm_chu_de cd
  join khtn_bdm_nhom n on n.chu_de_id = cd.id
  join khtn_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
  join khtn_bdm_dang_bai d on d.nhom_id = n.id
  where cd.khoi = p_khoi
$function$;

-- Người duyệt quyết 1 câu — cùng hành động với fn_bdm_khop_quyet (Toán). Gán đi qua _khtn_bdm_gan (bản sao đi theo gốc).
create or replace function public.fn_khtn_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text DEFAULT NULL::text, p_ly_do text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE plpgsql
AS $function$
declare v_khoi text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  select b.khoi into v_khoi from khtn_cau_hoi q join khtn_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;
  if not public._khtn_bdm_duyet_duoc(v_khoi) then raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn (KHTN khối %)', p_ma_cau, v_khoi; end if;
  select g.dang_bai_id, g.nguon into v_ai, v_nguon from khtn_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from khtn_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  if p_dang_bai is not null then
    select cd.id into v_cd_dich from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi;
    if v_cd_dich is null then raise exception 'Dạng bài % không tồn tại trong KHTN khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
    delete from khtn_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from khtn_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    insert into khtn_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) values (p_ma_cau, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    delete from khtn_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from khtn_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into khtn_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into khtn_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from khtn_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into khtn_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into khtn_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from khtn_bdm_gan_cau where (ma_cau = p_ma_cau or ma_cau in (select c.ma_cau from khtn_cau_hoi c where c.parent_ma_cau = p_ma_cau)) and nguon = 'ai';
    end if;
    delete from khtn_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from khtn_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform public.fn_kho_tu_choi_cau('khtn', p_ma_cau, public.current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$;

revoke execute on function public._khtn_bdm_duyet_duoc(text), public._khtn_bdm_khop_nguon(text, text),
  public.fn_khtn_bdm_khop_dem(text, text, text), public.fn_khtn_bdm_khop_hang(text, text, integer, integer, text, text),
  public.fn_khtn_bdm_khop_nguon_ds(text, text, text), public.fn_khtn_bdm_khop_dich(text),
  public.fn_khtn_bdm_khop_quyet(text, text, text, text) from public, anon;
grant execute on function public._khtn_bdm_duyet_duoc(text), public._khtn_bdm_khop_nguon(text, text),
  public.fn_khtn_bdm_khop_dem(text, text, text), public.fn_khtn_bdm_khop_hang(text, text, integer, integer, text, text),
  public.fn_khtn_bdm_khop_nguon_ds(text, text, text), public.fn_khtn_bdm_khop_dich(text),
  public.fn_khtn_bdm_khop_quyet(text, text, text, text) to authenticated;

-- ── 4. NỐI PHIÊN CLAUDE + NHẬP CÂU ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public._phien_kho_nhanh_ds()
 RETURNS TABLE(nhanh text, cau text, ban_do_cu text, gan text, de_xuat text, thieu text, kiem_mau text, vung text)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select * from (values
    ('dai', 'dai_cau_hoi', 'dai_ban_do', 'dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'dai_bdm_cau_thieu_dang', 'dai_bdm_kiem_mau', 'toan'),
    ('hgt', 'hgt_cau_hoi', 'hgt_ban_do', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', 'hgt_bdm_cau_thieu_dang', 'hgt_bdm_kiem_mau', 'hgt'),
    ('khtn', 'khtn_cau_hoi', 'khtn_ban_do', 'khtn_bdm_gan_cau', 'khtn_bdm_de_xuat', 'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn')
  ) r(nhanh, cau, ban_do_cu, gan, de_xuat, thieu, kiem_mau, vung)
$function$;

CREATE OR REPLACE FUNCTION public._phien_kho_mon()
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
AS $function$ select array['Toán', 'KHTN'] $function$;

CREATE OR REPLACE FUNCTION public._phien_kho_phan1(p_p claude_phien, p_ma_cau text, p_ket_qua text, p_dang_bai text, p_ly_do text, p_chu_de text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; v_q jsonb; v_khoi text; v_gan_nguon text; v_gan_db text; v_mau boolean; v_cd text; v_ly text := btrim(coalesce(p_ly_do, '')); v_nguoi boolean;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    exit when v_q is not null;
  end loop;
  if v_q is null then raise exception 'Không có câu %.', p_ma_cau; end if;
  -- 05/11: KHTN nối vào cùng luồng — câu phải đúng môn của phiên (bảng khtn_* chỉ cho phiên KHTN).
  if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then raise exception 'Câu % không thuộc môn % của phiên.', p_ma_cau, p_p.mon; end if;
  if v_q->>'xoa_at' is not null then raise exception 'Câu % đang ở kho rác.', p_ma_cau; end if;
  if v_q->>'parent_ma_cau' is not null then raise exception 'Câu % là bản sao của % — phân câu gốc, bản sao tự đi theo.', p_ma_cau, v_q->>'parent_ma_cau'; end if;
  if v_q->>'loai_cau' = 'dung_sai' then raise exception 'Câu % là Đúng/Sai — xếp theo chủ đề (đường riêng), không xếp theo dạng.', p_ma_cau; end if;
  execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
  if v_khoi is distinct from p_p.khoi then raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi; end if;

  execute format('select nguon, dang_bai_id from %I where ma_cau = $1', r.gan) into v_gan_nguon, v_gan_db using p_ma_cau;
  execute format('select exists (select 1 from %I where ma_cau = $1)', r.kiem_mau) into v_mau using p_ma_cau;
  if v_gan_nguon is not null and (v_gan_nguon <> 'ai' or v_mau) then
    raise exception 'Câu % đã được NGƯỜI quyết (gán dạng / kiểm mẫu) — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;
  -- 04/11 (Thùy: "thêm được, không được xoá"): dòng chờ duyệt / thiếu dạng do NGƯỜI nhập cũng là người đã quyết ⇒ Claude không đụng.
  execute format('select exists (select 1 from %I where ma_cau = $1 and nguon is distinct from ''ai'')
                      or exists (select 1 from %I where ma_cau = $1 and nguon is distinct from ''ai'')', r.de_xuat, r.thieu)
    into v_nguoi using p_ma_cau;
  if v_nguoi then
    raise exception 'Câu % đang có dòng chờ duyệt / thiếu dạng do NGƯỜI nhập — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;

  if p_ket_qua in ('cao', 'vua') and r.nhanh = 'khtn' then
    select cd.id into v_cd
      from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi;
    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ KHTN khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;
  elsif p_ket_qua in ('cao', 'vua') then
    select cd.id into v_cd
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi and cd.nhanh = r.vung;
    if v_cd is null then raise exception 'Dạng bài % không thuộc vùng % của khối % (câu % là nhánh %).', coalesce(p_dang_bai, '?'), r.vung, p_p.khoi, p_ma_cau, r.nhanh; end if;
  end if;

  if p_ket_qua = 'cao' then
    if r.nhanh = 'khtn' then
      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)
    else
    execute format($q$insert into %I (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.gan)
      using p_ma_cau, p_dang_bai;
    end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.de_xuat) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'vua' then
    if v_ly = '' then raise exception 'Đề xuất (chưa chắc) phải kèm lý do phân vân.'; end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.gan) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'vua', $3, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = 'vua', ly_do = excluded.ly_do, nguon = 'ai', at = now()$q$, r.de_xuat)
      using p_ma_cau, p_dang_bai, v_ly;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'thieu' then
    if v_ly = '' then raise exception 'Báo thiếu dạng phải kèm lý do (câu này hỏi gì mà bản đồ chưa có).'; end if;
    -- chủ đề của hàng "thiếu": chủ đề Claude nêu (nếu có, phải đúng khối + vùng) — để trưởng khối thấy câu ở đúng chỗ.
    if p_chu_de is not null then
      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;
      else select cd.id into v_cd from dai_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi and cd.nhanh = r.vung; end if;
      if v_cd is null then raise exception 'Chủ đề % không thuộc vùng % của khối %.', p_chu_de, r.vung, p_p.khoi; end if;
    end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.gan) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.de_xuat) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, chu_de_id, ly_do, nguon) values ($1, $2, $3, 'ai')
                     on conflict (ma_cau) do update set chu_de_id = excluded.chu_de_id, ly_do = excluded.ly_do, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.thieu)
      using p_ma_cau, v_cd, v_ly;
  else
    raise exception 'ket_qua phải là cao · vua · thieu.';
  end if;
  return jsonb_build_object('ma_cau', p_ma_cau, 'ket_qua', p_ket_qua, 'dang_bai_id', case when p_ket_qua = 'thieu' then null else p_dang_bai end,
                            'nhanh', r.nhanh, 'truoc', case when v_gan_db is not null then 'ai_gan:' || v_gan_db else null end);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_them(p_phien uuid, p_ds jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_ok int := 0; v_trung int := 0; v_loi int := 0;
        v_nh text; v_tbl text; v_ma text; v_cu text; v_k text; v_phan jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu (xem tro-giup).'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lô tối đa 20 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' else 'dai' end);
      if v_p.mon = 'KHTN' and v_nh <> 'khtn' then raise exception 'Phiên KHTN: nhanh phải là khtn.'; end if;
      if v_p.mon <> 'KHTN' and v_nh not in ('dai', 'hgt') then raise exception 'nhanh phải là dai hoặc hgt.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      execute format($q$select min(c.ma_cau) from %I c where c.xoa_at is null
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1$q$, v_tbl)
        into v_cu using v_k;
      if v_cu is not null then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'trung', true, 'ma_cau', v_cu));
        v_trung := v_trung + 1;
        continue;
      end if;
      v_ma := public.fn_bdm_nhap_cau(case v_nh when 'dai' then 'toan' else v_nh end, v_p.khoi,
                                     x || jsonb_build_object('nguon_giai', case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end),
                                     null, null);
      if nullif(trim(x->>'ten_de_goc'), '') is not null then
        execute format('update %I set ten_de_goc = $2 where ma_cau = $1', v_tbl) using v_ma, trim(x->>'ten_de_goc');
      end if;
      v_phan := null;
      if jsonb_typeof(x->'phan') = 'object' and x->>'loai_cau' <> 'dung_sai' then
        v_phan := public._phien_kho_phan1(v_p, v_ma, x->'phan'->>'ket_qua', x->'phan'->>'dang_bai_id', x->'phan'->>'ly_do', x->'phan'->>'chu_de_id');
      end if;
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'ma_cau', v_ma, 'nhanh', v_nh, 'phan', v_phan));
      v_ok := v_ok + 1;
    exception when others then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', false, 'loi', sqlerrm, 'dau_de', left(coalesce(x->>'noi_dung', ''), 60)));
      v_loi := v_loi + 1;
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'them_cau', jsonb_build_object('so_cau', jsonb_array_length(p_ds)),
          jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_bdm_nhap_cau(p_mon text, p_khoi text, p_cau jsonb, p_dang_bai text, p_chu_de text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare t text := public.fn_kho_tbl(p_mon); v_cho text; v_ok boolean; v_seq int; v_ma text; v_loai text := p_cau->>'loai_cau';
        v_md jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null or t not in ('dai', 'hgt', 'khtn') then raise exception 'Kho % chưa có bản đồ mới', coalesce(p_mon, '∅'); end if;
  if (t = 'khtn' and not exists (select 1 from khtn_bdm_chu_de where khoi = p_khoi))
     or (t <> 'khtn' and not coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', p_khoi)), false)) then
    raise exception 'Khối % chưa chạy bản đồ mới — nhập theo bản đồ cũ', p_khoi;
  end if;
  if nullif(trim(p_cau->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
  v_cho := public._kho_dang_cho(t, p_khoi);
  execute format('select exists (select 1 from %I where ma_dang = $1)', t || '_ban_do') into v_ok using v_cho;
  if not v_ok then raise exception 'Khối % chưa có dạng chờ % ở kho %', p_khoi, v_cho, t; end if;

  perform pg_advisory_xact_lock(hashtext(t || '_cau_hoi:' || v_cho));
  execute format($q$select coalesce(max(substr(ma_cau, length($1) + 1)::int), 0) from %I
                    where ma_cau like $1 || '%%' and substr(ma_cau, length($1) + 1) ~ '^[0-9]+$'$q$, t || '_cau_hoi')
    into v_seq using v_cho;
  v_ma := v_cho || lpad((v_seq + 1)::text, greatest(3, length((v_seq + 1)::text)), '0');   -- lpad CẮT chuỗi dài hơn 3 ⇒ phải nới

  if v_loai = 'dung_sai' then
    select coalesce(jsonb_agg(m || jsonb_build_object('ma_dang', v_cho) order by o), '[]'::jsonb) into v_md
      from jsonb_array_elements(coalesce(p_cau->'menh_de', '[]'::jsonb)) with ordinality e(m, o);
  end if;
  execute format($q$insert into %I (ma_cau, dang_chinh, loai_cau, noi_dung, dap_an, loi_giai, lua_chon, menh_de, anh_de, anh_dap_an, nguon, nguon_giai)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'le', $11)$q$, t || '_cau_hoi')
    using v_ma, v_cho, v_loai, trim(p_cau->>'noi_dung'),
          case when v_loai = 'dung_sai' then null else nullif(trim(p_cau->>'dap_an'), '') end,
          nullif(trim(p_cau->>'loi_giai'), ''),
          case when jsonb_typeof(p_cau->'lua_chon') = 'array' then p_cau->'lua_chon' end,
          v_md, nullif(p_cau->>'anh_de', ''), nullif(p_cau->>'anh_dap_an', ''),
          coalesce(nullif(p_cau->>'nguon_giai', ''), 'nguoi');

  if v_loai = 'dung_sai' then
    if p_chu_de is not null and t <> 'khtn' then   -- KHTN chưa có kho Đ/S cấp chủ đề
      execute format($q$insert into %I (ma_cau, chu_de_id, nguon) values ($1, $2, 'nguoi')$q$, t || '_bdm_kho_ds') using v_ma, p_chu_de;
    end if;
  elsif p_dang_bai is not null and t = 'khtn' then
    perform public._khtn_bdm_gan(v_ma, p_dang_bai, 'nguoi');
  elsif p_dang_bai is not null then
    perform public._bdm_nguoi_gan_cau(t, v_ma, p_dang_bai);
  end if;
  return v_ma;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_tong(p_phien uuid)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  v_p := public._phien_kho_vao(p_phien);
  return jsonb_build_object('khoi', v_p.khoi, 'mon', v_p.mon,
    'dem', case when v_p.mon = 'KHTN' then public.fn_khtn_bdm_khop_dem(v_p.khoi) else public.fn_bdm_khop_dem(v_p.khoi) end);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_hang(p_phien uuid, p_hang text, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_l int; v_o int;
begin
  v_p := public._phien_kho_vao(p_phien);
  if p_hang not in ('trong', 'de_xuat', 'thieu', 'mau') then raise exception 'hang phải là trong · de_xuat · thieu · mau.'; end if;
  v_l := least(greatest(coalesce(p_limit, 20), 1), 50); v_o := greatest(coalesce(p_offset, 0), 0);
  if v_p.mon = 'KHTN' then return public.fn_khtn_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;
  return public.fn_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_dang(p_phien uuid, p_dang_bai text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_l int; v_o int;
begin
  v_p := public._phien_kho_vao(p_phien);
  v_l := least(greatest(coalesce(p_limit, 30), 1), 50); v_o := greatest(coalesce(p_offset, 0), 0);
  if v_p.mon = 'KHTN' then
    perform public._phien_bd_kiem_khoi('khtn_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_khtn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
  end if;
  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
  return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
end $function$;
