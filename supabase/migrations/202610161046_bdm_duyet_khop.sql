-- B4 DUYỆT KHỚP — duyệt câu xếp vào dạng bài của BẢN ĐỒ MỚI (Thùy 16/10)
--   spec-ban-do-4-tang.md §0 B3→B4 + §13 (mục B4 chi tiết).
--
-- Luật đã chốt:
--   · Mức "cao" (AI chắc) = coi như đã gán (dai_bdm_gan_cau, nguon='ai'); chấp nhận ~1,3% sai, SỬA HẬU KIỂM bằng kiểm mẫu.
--   · Mức "chưa chắc" + câu chưa có dạng ở lại KHO TẠM (= không có dòng ở dai_bdm_gan_cau). Đủ thông tin thì CHUYỂN ĐI (gán).
--   · Chia người: mỗi người 1 PHẠM VI, không trùng nhau (khối + chủ đề; chủ đề NULL = phần còn lại của khối).
--
-- "Thiếu = không có dòng": 4 bảng nhỏ, mỗi bảng chỉ có dòng khi CÓ sự kiện thật. Không cột NULL cho "chưa duyệt".

-- ── 1. Đề xuất (câu ở kho tạm có DẠNG ĐỀ XUẤT mà chưa chắc) ───────────────────────
create table if not exists dai_bdm_de_xuat (
  ma_cau      text primary key references dai_cau_hoi(ma_cau),
  dang_bai_id text not null references dai_bdm_dang_bai(id),
  chac        text not null default 'vua' check (chac in ('cao','vua')),
  ly_do       text not null default '',
  nguon       text not null default 'ai' check (nguon in ('ai','nguoi')),
  at          timestamptz not null default now()
);
create index if not exists dai_bdm_de_xuat_db_idx on dai_bdm_de_xuat(dang_bai_id);

-- ── 2. "Thiếu dạng" (AI/người báo: bản đồ chưa có dạng cho câu này) ────────────────
create table if not exists dai_bdm_cau_thieu_dang (
  ma_cau text primary key references dai_cau_hoi(ma_cau),
  ly_do  text not null,
  nguon  text not null default 'ai' check (nguon in ('ai','nguoi')),
  actor  uuid default jwt_uid(),
  at     timestamptz not null default now()
);

-- ── 3. Kiểm mẫu hậu kiểm (chỉ có dòng khi người ĐÃ xem câu mức cao) ───────────────
create table if not exists dai_bdm_kiem_mau (
  ma_cau         text primary key references dai_cau_hoi(ma_cau),
  dang_bai_ai_id text not null references dai_bdm_dang_bai(id),   -- dạng AI đã gán lúc đó
  ket_qua        text not null check (ket_qua in ('giu','doi')),
  actor          uuid default jwt_uid(),
  at             timestamptz not null default now()
);

-- ── 4. Phạm vi người duyệt ─────────────────────────────────────────────────────────
create table if not exists dai_bdm_duyet_pham_vi (
  id          bigint generated always as identity primary key,
  tai_khoan_id uuid not null references tai_khoan(id),
  khoi        text not null,
  chu_de_id   text references dai_bdm_chu_de(id),   -- NULL = phần còn lại của khối (kể cả câu chưa có chỗ)
  created_at  timestamptz not null default now()
);
-- không trùng: mỗi (khối, chủ đề) đúng 1 chủ; "phần còn lại" mỗi khối đúng 1 chủ
create unique index if not exists dai_bdm_duyet_pham_vi_uq on dai_bdm_duyet_pham_vi (khoi, coalesce(chu_de_id, '*'));

alter table dai_bdm_de_xuat         enable row level security;
alter table dai_bdm_cau_thieu_dang  enable row level security;
alter table dai_bdm_kiem_mau        enable row level security;
alter table dai_bdm_duyet_pham_vi   enable row level security;
drop policy if exists dai_bdm_de_xuat_member_all on dai_bdm_de_xuat;
create policy dai_bdm_de_xuat_member_all on dai_bdm_de_xuat for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists dai_bdm_cau_thieu_dang_member_all on dai_bdm_cau_thieu_dang;
create policy dai_bdm_cau_thieu_dang_member_all on dai_bdm_cau_thieu_dang for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists dai_bdm_kiem_mau_member_all on dai_bdm_kiem_mau;
create policy dai_bdm_kiem_mau_member_all on dai_bdm_kiem_mau for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
-- phạm vi: chỉ ĐỌC trực tiếp; ghi qua RPC admin (security definer)
drop policy if exists dai_bdm_duyet_pham_vi_member_sel on dai_bdm_duyet_pham_vi;
create policy dai_bdm_duyet_pham_vi_member_sel on dai_bdm_duyet_pham_vi for select to authenticated using (la_thanh_vien());

-- ── 5. Quyền theo phạm vi ──────────────────────────────────────────────────────────
-- Chủ của chủ đề X (khối K) = dòng (K, X) nếu có; không thì dòng (K, NULL). Admin duyệt được hết.
create or replace function _bdm_duyet_duoc(p_khoi text, p_chu_de text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select la_admin from my_quyen()), false)
      or exists (
        select 1 from dai_bdm_duyet_pham_vi v
         where v.tai_khoan_id = jwt_uid() and v.khoi = p_khoi
           and (v.chu_de_id = p_chu_de
                or (v.chu_de_id is null
                    and not exists (select 1 from dai_bdm_duyet_pham_vi w where w.khoi = p_khoi and w.chu_de_id = p_chu_de)))
      )
$$;

-- ── 6. Nguồn hàng đợi (đã lọc theo phạm vi của người gọi) ─────────────────────────
create or replace function _bdm_khop_nguon(p_khoi text, p_hang text)
returns table (ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
language sql stable as $$
  select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from dai_bdm_de_xuat dx
      join dai_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null
      join dai_bdm_dang_bai d on d.id = dx.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, null::text, t.ly_do, null::text
      from dai_bdm_cau_thieu_dang t
      join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null
      join dai_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    select cg.ma_cau, null::text, null::text, ''::text, null::text
      from _bdm_cau_giai((select coalesce(array_agg(ma_dang), '{}') from dai_ban_do where khoi = p_khoi)) cg
      join dai_cau_hoi q on q.ma_cau = cg.ma_cau and q.xoa_at is null
     where p_hang = 'trong' and cg.la_goc and cg.dang_bai_id is null
       and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = cg.ma_cau)
       and not exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = cg.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from dai_bdm_gan_cau g
      join dai_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null
      join dai_bdm_dang_bai d on d.id = g.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (không nhảy giữa các lần mở)
  ) s
  where _bdm_duyet_duoc(p_khoi, s.chu_de_id)
$$;

-- ── 7. Đếm cho thanh tab + độ chính xác đo được ───────────────────────────────────
create or replace function fn_bdm_khop_dem(p_khoi text) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'de_xuat', (select count(*) from _bdm_khop_nguon(p_khoi, 'de_xuat')),
    'thieu',   (select count(*) from _bdm_khop_nguon(p_khoi, 'thieu')),
    'trong',   (select count(*) from _bdm_khop_nguon(p_khoi, 'trong')),
    'mau',     (select count(*) from _bdm_khop_nguon(p_khoi, 'mau')),
    'kiem_n',   (select count(*) from dai_bdm_kiem_mau k join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from dai_bdm_kiem_mau k join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                  where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
$$;

-- ── 8. Một trang câu của 1 hàng đợi ───────────────────────────────────────────────
create or replace function fn_bdm_khop_hang(p_khoi text, p_hang text, p_limit integer default 30, p_offset integer default 0)
returns jsonb language sql stable as $$
  with s as materialized (select * from _bdm_khop_nguon(p_khoi, p_hang)),
  pg as (select * from s order by ma_cau limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select jsonb_build_object(
    'tong', (select count(*) from s),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'ma_cau', q.ma_cau, 'loai', q.loai_cau, 'noi_dung', q.noi_dung, 'lua_chon', q.lua_chon, 'menh_de', q.menh_de,
        'dap_an', q.dap_an, 'anh_de', q.anh_de, 'ly_do', pg.ly_do, 'chac', pg.chac,
        'dang_bai_id', pg.dang_bai_id, 'dang_bai', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'chuyen_de', ch.ten,
        'dang_cu', b.ten_dang, 'chuyen_de_cu', b.ten_chuyen_de
      ) order by pg.ma_cau)
      from pg
      join dai_cau_hoi q on q.ma_cau = pg.ma_cau
      left join dai_ban_do b on b.ma_dang = q.dang_chinh
      left join dai_bdm_dang_bai d on d.id = pg.dang_bai_id
      left join dai_bdm_nhom n on n.id = d.nhom_id
      left join dai_bdm_chu_de cd on cd.id = n.chu_de_id
      left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id), '[]'::jsonb))
$$;

-- ── 9. Danh sách dạng bài đích của 1 khối (để chọn) ───────────────────────────────
create or replace function fn_bdm_khop_dich(p_khoi text) returns jsonb
language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dang_bai', d.ten, 'mo_ta', d.mo_ta, 'nhom', n.ten, 'chuyen_de', ch.ten, 'chu_de', cd.ten, 'chu_de_id', cd.id
  ) order by cd.thu_tu, ch.id, n.thu_tu, d.thu_tu), '[]'::jsonb)
  from dai_bdm_chu_de cd
  join dai_bdm_nhom n on n.chu_de_id = cd.id
  join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
  join dai_bdm_dang_bai d on d.nhom_id = n.id
  where cd.khoi = p_khoi
$$;

-- ── 10. Quyết định (1 câu / 1 lần, transactional) ────────────────────────────────
--   gan        : chuyển câu khỏi kho tạm vào dạng bài p_dang_bai (người xác nhận ⇒ nguon='nguoi')
--   thieu      : báo "bản đồ thiếu dạng" (ly_do bắt buộc), vẫn ở kho tạm
--   bo_de_xuat : đề xuất sai ⇒ xoá đề xuất, câu về hàng "chưa có dạng"
--   mau_giu    : kiểm mẫu, AI gán đúng
--   mau_doi    : kiểm mẫu, AI gán sai ⇒ đổi sang p_dang_bai (nguon='nguoi')
create or replace function fn_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text default null, p_ly_do text default null)
returns jsonb language plpgsql as $$
declare
  v_khoi text; v_cd_hien text; v_cd_dich text; v_ai text; v_nguon text;
begin
  select b.khoi into v_khoi
    from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;

  -- chủ đề HIỆN TẠI của câu (chỗ đang gán, hoặc chỗ đang được đề xuất); NULL = chưa có chỗ
  select g.dang_bai_id, g.nguon into v_ai, v_nguon from dai_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select cd.id into v_cd_hien
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where d.id = coalesce(v_ai, (select x.dang_bai_id from dai_bdm_de_xuat x where x.ma_cau = p_ma_cau));
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
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $$;

-- ── 11. Quản lý phạm vi (admin) ───────────────────────────────────────────────────
create or replace function fn_bdm_khop_pham_vi() returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'la_admin', coalesce((select la_admin from my_quyen()), false),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'id', v.id, 'tai_khoan_id', v.tai_khoan_id, 'khoi', v.khoi, 'chu_de_id', v.chu_de_id, 'chu_de', cd.ten,
        'nguoi', coalesce(ns.ho_ten, tk.email), 'cua_toi', v.tai_khoan_id = jwt_uid()
      ) order by v.khoi, cd.thu_tu nulls last, v.id)
      from dai_bdm_duyet_pham_vi v
      join tai_khoan tk on tk.id = v.tai_khoan_id
      left join nhan_su ns on ns.id = tk.nhan_su_id
      left join dai_bdm_chu_de cd on cd.id = v.chu_de_id
     where coalesce((select la_admin from my_quyen()), false) or v.tai_khoan_id = jwt_uid()), '[]'::jsonb))
$$;

create or replace function fn_bdm_khop_ung_vien() returns jsonb
language sql stable security definer set search_path = public as $$
  select case when coalesce((select la_admin from my_quyen()), false)
    then coalesce((select jsonb_agg(jsonb_build_object('tai_khoan_id', tk.id, 'ho_ten', coalesce(ns.ho_ten, tk.email)) order by coalesce(ns.ho_ten, tk.email))
                     from tai_khoan tk left join nhan_su ns on ns.id = tk.nhan_su_id where tk.hoc_sinh_id is null), '[]'::jsonb)
    else '[]'::jsonb end
$$;

create or replace function fn_bdm_khop_giao(p_tai_khoan uuid, p_khoi text, p_chu_de text default null) returns bigint
language plpgsql security definer set search_path = public as $$
declare v bigint;
begin
  if not coalesce((select la_admin from my_quyen()), false) then raise exception 'Chỉ admin được giao phạm vi'; end if;
  if p_chu_de is not null and not exists (select 1 from dai_bdm_chu_de where id = p_chu_de and khoi = p_khoi) then
    raise exception 'Chủ đề % không thuộc khối %', p_chu_de, p_khoi;
  end if;
  insert into dai_bdm_duyet_pham_vi (tai_khoan_id, khoi, chu_de_id) values (p_tai_khoan, p_khoi, p_chu_de) returning id into v;
  return v;
exception when unique_violation then
  raise exception 'Phạm vi này đã giao cho người khác — gỡ trước khi giao lại';
end $$;

create or replace function fn_bdm_khop_go(p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not coalesce((select la_admin from my_quyen()), false) then raise exception 'Chỉ admin được gỡ phạm vi'; end if;
  delete from dai_bdm_duyet_pham_vi where id = p_id;
end $$;

-- ── 12. Quyền gọi (bài học 14/10: helper cũng phải GRANT; anon không được gọi) ────
do $$
declare f text;
begin
  foreach f in array array[
    '_bdm_duyet_duoc(text,text)', '_bdm_khop_nguon(text,text)', 'fn_bdm_khop_dem(text)', 'fn_bdm_khop_hang(text,text,integer,integer)',
    'fn_bdm_khop_dich(text)', 'fn_bdm_khop_quyet(text,text,text,text)', 'fn_bdm_khop_pham_vi()', 'fn_bdm_khop_ung_vien()',
    'fn_bdm_khop_giao(uuid,text,text)', 'fn_bdm_khop_go(bigint)'
  ] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
