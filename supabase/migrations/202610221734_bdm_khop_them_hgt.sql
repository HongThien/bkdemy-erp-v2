-- ============================================================================
-- 202610221734 — bdm_khop_them_hgt
-- ----------------------------------------------------------------------------
-- VÌ SAO: màn Bản đồ mới › Duyệt kho (B4 duyệt khớp) chỉ đọc câu Đại (dai_cau_hoi + dai_bdm_*). Câu hình giải tích (hgt_cau_hoi,
-- Véc tơ K10 …) đã được đẩy vào bản đồ mới (hgt_bdm_gan_cau / de_xuat / cau_thieu_dang) nhưng KHÔNG hiện ở chế độ duyệt ⇒
-- Thùy 22/10: "sửa chế độ duyệt để duyệt cả kho Giải tích". Cùng bảng dạng bài (dai_bdm_dang_bai) nên chỉ cần mở rộng đường đọc/ghi.
--   • 2 bảng mới hgt_bdm_kiem_mau / hgt_bdm_tu_choi (bản sao của dai_*; FK sang hgt_cau_hoi).
--   • _bdm_khop_nguon: thêm 5 nhánh hgt (de_xuat · thieu · trong · mau), vẫn bỏ câu Đúng/Sai (đã có kho_ds cấp chủ đề).
--   • fn_bdm_khop_dem: kiem_n/kiem_giu cộng cả hgt.   • fn_bdm_khop_hang: nội dung câu lấy từ bảng của nhánh (thêm cột 'nhanh').
--   • fn_bdm_khop_quyet: câu hgt đi đường _bdm_khop_quyet_hgt (cùng luật, đổi bảng; dạng đích phải thuộc chủ đề nhánh hgt).
-- ma_cau Đại / hgt KHÔNG trùng nhau (đã đo: 0 giao) nên khoá 'ma_cau' ở kho_de_sau / nhận xét vẫn đủ.
--
-- MẤT GÌ: không có. Chỉ create table / create or replace function (giữ chữ ký, giữ ACL cũ).
-- ============================================================================

create table if not exists hgt_bdm_kiem_mau (
  ma_cau         text primary key references hgt_cau_hoi(ma_cau),
  dang_bai_ai_id text not null references dai_bdm_dang_bai(id),
  ket_qua        text not null check (ket_qua in ('giu','doi')),
  actor          uuid default jwt_uid(),
  at             timestamptz not null default now()
);
alter table hgt_bdm_kiem_mau enable row level security;
drop policy if exists hgt_bdm_kiem_mau_member_all on hgt_bdm_kiem_mau;
create policy hgt_bdm_kiem_mau_member_all on hgt_bdm_kiem_mau for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());

create table if not exists hgt_bdm_tu_choi (
  id             bigint generated always as identity primary key,
  ma_cau         text not null references hgt_cau_hoi(ma_cau),
  dang_bai_ai_id text references dai_bdm_dang_bai(id),
  hang           text not null check (hang in ('de_xuat','mau','thieu','trong')),
  kho_rac        boolean not null default false,
  ly_do          text not null check (btrim(ly_do) <> ''),
  actor          uuid default jwt_uid(),
  at             timestamptz not null default now()
);
create index if not exists hgt_bdm_tu_choi_cau_idx on hgt_bdm_tu_choi (ma_cau);
alter table hgt_bdm_tu_choi enable row level security;
drop policy if exists hgt_bdm_tu_choi_doc on hgt_bdm_tu_choi;
create policy hgt_bdm_tu_choi_doc on hgt_bdm_tu_choi for select to authenticated using (la_thanh_vien());
drop policy if exists hgt_bdm_tu_choi_ghi on hgt_bdm_tu_choi;
create policy hgt_bdm_tu_choi_ghi on hgt_bdm_tu_choi for insert to authenticated with check (la_thanh_vien());
revoke update, delete, truncate on hgt_bdm_tu_choi from authenticated, anon, public;
grant select, insert on hgt_bdm_tu_choi to authenticated;

-- ── nguồn các hàng ──────────────────────────────────────────────────────────
create or replace function public._bdm_khop_nguon(p_khoi text, p_hang text)
 returns table(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 language sql
 stable
as $function$
  select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from dai_bdm_de_xuat dx
      join dai_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = dx.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, null::text, t.ly_do, null::text
      from dai_bdm_cau_thieu_dang t
      join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    select cg.ma_cau, null::text, null::text, ''::text, null::text
      from _bdm_cau_giai((select coalesce(array_agg(ma_dang), '{}') from dai_ban_do where khoi = p_khoi)) cg
      join dai_cau_hoi q on q.ma_cau = cg.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
     where p_hang = 'trong' and cg.la_goc and cg.dang_bai_id is null
       and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = cg.ma_cau)
       and not exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = cg.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from dai_bdm_gan_cau g
      join dai_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = g.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (không nhảy giữa các lần mở)

    -- ═════ HÌNH GIẢI TÍCH (hgt) — cùng luật, bảng hgt_* ═════
    union all
    select dx.ma_cau, dx.dang_bai_id, cd.id, dx.ly_do, dx.chac
      from hgt_bdm_de_xuat dx
      join hgt_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = dx.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, cd.id, t.ly_do, null::text
      from hgt_bdm_cau_thieu_dang t
      join hgt_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_chu_de cd on cd.id = t.chu_de_id
     where p_hang = 'thieu' and cd.khoi = p_khoi
       and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    select q.ma_cau, null::text, null::text, ''::text, null::text
      from hgt_cau_hoi q
      join hgt_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from dai_bdm_chu_de c2 where c2.khoi = p_khoi and c2.nhanh = 'hgt')
       and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from hgt_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from hgt_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
       and not exists (select 1 from hgt_bdm_kho_ds k where k.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from hgt_bdm_gan_cau g
      join hgt_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = g.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from hgt_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0
  ) s
  where _bdm_duyet_duoc(p_khoi, s.chu_de_id)
$function$;

-- ── đếm ─────────────────────────────────────────────────────────────────────
create or replace function public.fn_bdm_khop_dem(p_khoi text, p_chu_de text default null)
 returns jsonb
 language sql
 stable
as $function$
  select jsonb_build_object(
    'de_xuat', (select count(*) from _bdm_khop_nguon(p_khoi, 'de_xuat') s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'thieu',   (select count(*) from _bdm_khop_nguon(p_khoi, 'thieu')   s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'trong',   (select count(*) from _bdm_khop_nguon(p_khoi, 'trong')   s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'mau',     (select count(*) from _bdm_khop_nguon(p_khoi, 'mau')     s where p_chu_de is null or s.chu_de_id is null or s.chu_de_id = p_chu_de),
    'kiem_n',   (select count(*) from (
                   select k.ma_cau, k.dang_bai_ai_id from dai_bdm_kiem_mau k union all select k.ma_cau, k.dang_bai_ai_id from hgt_bdm_kiem_mau k) k
                   join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from (
                   select k.ma_cau, k.dang_bai_ai_id, k.ket_qua from dai_bdm_kiem_mau k union all select k.ma_cau, k.dang_bai_ai_id, k.ket_qua from hgt_bdm_kiem_mau k) k
                   join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                  where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
$function$;

-- ── danh sách theo hàng (giữ thứ tự "để sau xuống cuối" của mig 202610221621) ───
create or replace function public.fn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer default 30, p_offset integer default 0, p_chu_de text default null)
 returns jsonb
 language sql
 stable
as $function$
  with s as materialized (
    select x.*, ds.at as de_sau_at
      from _bdm_khop_nguon(p_khoi, p_hang) x
      left join lateral (select max(d.at) at from kho_de_sau d
                          where d.doi_tuong = 'bdm_khop' and d.mon = 'toan' and d.ma = x.ma_cau) ds on true
     where p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de
  ),
  pg as (select * from s order by (de_sau_at is not null), de_sau_at, ma_cau
          limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', coalesce(b.ten_dang, hb.ten_dang), 'chuyen_de_cu', coalesce(b.ten_chuyen_de, hb.ten_chuyen_de),
        'nhanh', q.nhanh
      ) order by (pg.de_sau_at is not null), pg.de_sau_at, pg.ma_cau)
      from pg
      join lateral (
        select c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.dang_chinh, 'dai'::text as nhanh
          from dai_cau_hoi c where c.ma_cau = pg.ma_cau
        union all
        select c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.dang_chinh, 'hgt'::text
          from hgt_cau_hoi c where c.ma_cau = pg.ma_cau
      ) q on true
      left join dai_ban_do b on b.ma_dang = q.dang_chinh and q.nhanh = 'dai'
      left join hgt_ban_do hb on hb.ma_dang = q.dang_chinh and q.nhanh = 'hgt'
      left join dai_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join dai_bdm_nhom n on n.id = d.nhom_id
      left join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$function$;

-- ── quyết định cho câu hgt (cùng luật fn_bdm_khop_quyet, đổi bảng) ─────────────
create or replace function public._bdm_khop_quyet_hgt(p_ma_cau text, p_hanh_dong text, p_dang_bai text default null, p_ly_do text default null)
 returns jsonb
 language plpgsql
as $function$
declare
  v_khoi text; v_cd_hien text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  select b.khoi into v_khoi
    from hgt_cau_hoi q join hgt_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;

  select g.dang_bai_id, g.nguon into v_ai, v_nguon from hgt_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from hgt_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  select cd.id into v_cd_hien
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where d.id = coalesce(v_ai, v_dx);
  if v_cd_hien is null then
    select t.chu_de_id into v_cd_hien from hgt_bdm_cau_thieu_dang t where t.ma_cau = p_ma_cau;
  end if;
  if not _bdm_duyet_duoc(v_khoi, v_cd_hien) then
    raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn', p_ma_cau;
  end if;

  if p_dang_bai is not null then
    select cd.id into v_cd_dich
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi and cd.nhanh = 'hgt';
    if v_cd_dich is null then raise exception 'Dạng bài % không thuộc chủ đề hình giải tích của khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    insert into hgt_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
      on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = jwt_uid(), at = now();
    delete from hgt_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from hgt_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    -- chủ đề của hàng "thiếu": chỗ đang đề xuất, hoặc chủ đề hgt duy nhất của khối
    if v_cd_hien is null then
      select cd.id into v_cd_hien from dai_bdm_chu_de cd where cd.khoi = v_khoi and cd.nhanh = 'hgt' order by cd.thu_tu limit 1;
    end if;
    insert into hgt_bdm_cau_thieu_dang (ma_cau, chu_de_id, ly_do, nguon) values (p_ma_cau, v_cd_hien, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = jwt_uid(), at = now();
    delete from hgt_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from hgt_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into hgt_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into hgt_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    update hgt_bdm_gan_cau set dang_bai_id = p_dang_bai, nguon = 'nguoi', actor = jwt_uid(), at = now() where ma_cau = p_ma_cau;
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from hgt_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into hgt_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into hgt_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from hgt_bdm_gan_cau where ma_cau = p_ma_cau and nguon = 'ai';
    end if;
    delete from hgt_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from hgt_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform fn_kho_tu_choi_cau('hgt', p_ma_cau, current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$;
revoke all on function public._bdm_khop_quyet_hgt(text, text, text, text) from public, anon;
grant execute on function public._bdm_khop_quyet_hgt(text, text, text, text) to authenticated;

-- fn_bdm_khop_quyet: câu hgt ⇒ chuyển sang bản hgt; còn lại giữ nguyên.
create or replace function public.fn_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text default null, p_ly_do text default null)
 returns jsonb
 language plpgsql
as $function$
declare
  v_khoi text; v_cd_hien text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  if exists (select 1 from hgt_cau_hoi h where h.ma_cau = p_ma_cau and h.xoa_at is null) then
    return _bdm_khop_quyet_hgt(p_ma_cau, p_hanh_dong, p_dang_bai, p_ly_do);
  end if;

  select b.khoi into v_khoi
    from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;

  select g.dang_bai_id, g.nguon into v_ai, v_nguon from dai_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from dai_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  select cd.id into v_cd_hien
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where d.id = coalesce(v_ai, v_dx);
  if not _bdm_duyet_duoc(v_khoi, v_cd_hien) then
    raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn', p_ma_cau;
  end if;

  if p_dang_bai is not null then
    select cd.id into v_cd_dich
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi;
    if v_cd_dich is null then raise exception 'Dạng bài % không tồn tại trong khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
      on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = jwt_uid(), at = now();
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from dai_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    insert into dai_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) values (p_ma_cau, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = jwt_uid(), at = now();
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into dai_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into dai_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    update dai_bdm_gan_cau set dang_bai_id = p_dang_bai, nguon = 'nguoi', actor = jwt_uid(), at = now() where ma_cau = p_ma_cau;
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from dai_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into dai_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into dai_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from dai_bdm_gan_cau where ma_cau = p_ma_cau and nguon = 'ai';
    end if;
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from dai_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform fn_kho_tu_choi_cau('toan', p_ma_cau, current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$;
