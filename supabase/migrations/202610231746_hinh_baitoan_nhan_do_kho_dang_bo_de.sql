-- HÌNH–LUYỆN: NHÃN của BÀI trong mô hình — Độ khó · Dạng bài · Bổ đề (Thùy 23/10)
--   "Mỗi bài trong mô hình cần có các nhãn: Độ khó, Dạng bài, Bổ đề. Còn trong kho bài thì các ý sẽ được gán với bài
--    trong mô hình và kế thừa các nhãn luôn."
--   · Dạng bài / Bổ đề: dùng lại danh mục hinh_dang / hinh_bo_de (như nhãn ý 19/10, mig 202610191644), nhiều nhãn/bài,
--     cùng luật khối: nhãn.khoi ≤ khối của mô hình (nhãn lớp dưới dùng được cho bài lớp trên).
--   · Độ khó: thang 1–5 (như "Mức độ" bản đồ Đại). Chưa đánh = KHÔNG có dòng (§1.5), không cột NULL trên hinh_baitoan.
--   · KẾ THỪA: ý đã gán bài (hinh_y.baitoan_id) ⇒ nhãn hiệu lực của ý = nhãn của bài — SUY lúc đọc (fn_hl_y_nhan_hieu_luc),
--     không chép xuống ý ⇒ sửa nhãn bài là mọi ý gán vào nó đổi theo, không có bản sao lệch. Ý chưa gán giữ nhãn riêng.
--     Nhãn riêng của ý đã gán (nếu có từ trước) vẫn nằm trong hinh_y_dang/hinh_y_bo_de nhưng không còn hiệu lực;
--     fn_hl_y_nhan_dat chặn dán thêm cho ý đã gán (sửa ở bài).

create table if not exists hinh_baitoan_dang (
  id          bigint generated always as identity primary key,
  baitoan_id  uuid not null references hinh_baitoan(id),
  dang_id     uuid not null references hinh_dang(id),
  nguon       text not null default 'nguoi' check (nguon in ('nguoi','ai')),
  actor       uuid default jwt_uid(),
  at          timestamptz not null default now(),
  unique (baitoan_id, dang_id)
);
create table if not exists hinh_baitoan_bo_de (
  id          bigint generated always as identity primary key,
  baitoan_id  uuid not null references hinh_baitoan(id),
  bo_de_id    uuid not null references hinh_bo_de(id),
  nguon       text not null default 'nguoi' check (nguon in ('nguoi','ai')),
  actor       uuid default jwt_uid(),
  at          timestamptz not null default now(),
  unique (baitoan_id, bo_de_id)
);
create table if not exists hinh_baitoan_do_kho (
  id          bigint generated always as identity primary key,
  baitoan_id  uuid not null unique references hinh_baitoan(id),
  do_kho      smallint not null check (do_kho between 1 and 5),
  actor       uuid default jwt_uid(),
  at          timestamptz not null default now()
);
create index if not exists hinh_baitoan_dang_d_idx on hinh_baitoan_dang (dang_id);
create index if not exists hinh_baitoan_bo_de_b_idx on hinh_baitoan_bo_de (bo_de_id);

-- ── Luật khối: nhãn.khoi ≤ khối của mô hình gốc chứa bài ──────────────────────────────────────
create or replace function _hl_nhan_hop_khoi_bai(p_bai uuid, p_loai text, p_nhan uuid) returns void language plpgsql as $$
declare v_kb int; v_kn int; v_ten text;
begin
  select _hl_so_khoi(g.khoi) into v_kb
    from hinh_baitoan b join hinh_mo_hinh g on g.id = fn_hl_goc_mo_hinh(b.mo_hinh_id) where b.id = p_bai;
  if p_loai = 'dang' then select _hl_so_khoi(khoi), ten into v_kn, v_ten from hinh_dang where id = p_nhan;
  else select _hl_so_khoi(khoi), ten into v_kn, v_ten from hinh_bo_de where id = p_nhan; end if;
  if v_ten is null then raise exception 'Không thấy nhãn % %', p_loai, p_nhan; end if;
  if v_kn is not null and v_kb is not null and v_kn > v_kb then
    raise exception 'Nhãn «%» là của lớp % — bài lớp % không dùng được (chỉ dùng nhãn từ lớp mình trở xuống)', v_ten, v_kn, v_kb;
  end if;
end $$;
create or replace function _hl_trg_nhan_khoi_bai() returns trigger language plpgsql as $$
begin
  if tg_table_name = 'hinh_baitoan_dang' then perform _hl_nhan_hop_khoi_bai(new.baitoan_id, 'dang', new.dang_id);
  else perform _hl_nhan_hop_khoi_bai(new.baitoan_id, 'bo_de', new.bo_de_id); end if;
  return new;
end $$;
drop trigger if exists trg_hl_bai_dang_khoi on hinh_baitoan_dang;
create trigger trg_hl_bai_dang_khoi before insert or update on hinh_baitoan_dang for each row execute function _hl_trg_nhan_khoi_bai();
drop trigger if exists trg_hl_bai_bo_de_khoi on hinh_baitoan_bo_de;
create trigger trg_hl_bai_bo_de_khoi before insert or update on hinh_baitoan_bo_de for each row execute function _hl_trg_nhan_khoi_bai();

-- Ghi vết (nhật ký chung dai_bdm_log, khoá = id dòng)
drop trigger if exists trg_hl_bai_dang_log on hinh_baitoan_dang;
create trigger trg_hl_bai_dang_log after insert or update or delete on hinh_baitoan_dang for each row execute function _bdm_ghi_log();
drop trigger if exists trg_hl_bai_bo_de_log on hinh_baitoan_bo_de;
create trigger trg_hl_bai_bo_de_log after insert or update or delete on hinh_baitoan_bo_de for each row execute function _bdm_ghi_log();
drop trigger if exists trg_hl_bai_do_kho_log on hinh_baitoan_do_kho;
create trigger trg_hl_bai_do_kho_log after insert or update or delete on hinh_baitoan_do_kho for each row execute function _bdm_ghi_log();

-- ── RLS ─────────────────────────────────────────────────────────────────────────────────────
alter table hinh_baitoan_dang enable row level security;
alter table hinh_baitoan_bo_de enable row level security;
alter table hinh_baitoan_do_kho enable row level security;
drop policy if exists hinh_baitoan_dang_member_all on hinh_baitoan_dang;
create policy hinh_baitoan_dang_member_all on hinh_baitoan_dang for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists hinh_baitoan_bo_de_member_all on hinh_baitoan_bo_de;
create policy hinh_baitoan_bo_de_member_all on hinh_baitoan_bo_de for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists hinh_baitoan_do_kho_member_all on hinh_baitoan_do_kho;
create policy hinh_baitoan_do_kho_member_all on hinh_baitoan_do_kho for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
grant select, insert, update, delete on hinh_baitoan_dang, hinh_baitoan_bo_de, hinh_baitoan_do_kho to authenticated;

-- ── RPC ghi ──────────────────────────────────────────────────────────────────────────────────
-- Dán / gỡ 1 nhãn Dạng bài hoặc Bổ đề trên 1 bài mô hình
create or replace function fn_hl_bai_nhan_dat(p_bai uuid, p_loai text, p_nhan uuid, p_bat boolean) returns void language plpgsql as $$
begin
  if not exists (select 1 from hinh_baitoan where id = p_bai) then raise exception 'Bài không tồn tại'; end if;
  if p_loai = 'dang' then
    if p_bat then insert into hinh_baitoan_dang (baitoan_id, dang_id, nguon) values (p_bai, p_nhan, 'nguoi') on conflict (baitoan_id, dang_id) do nothing;
    else delete from hinh_baitoan_dang where baitoan_id = p_bai and dang_id = p_nhan; end if;
  elsif p_loai = 'bo_de' then
    if p_bat then insert into hinh_baitoan_bo_de (baitoan_id, bo_de_id, nguon) values (p_bai, p_nhan, 'nguoi') on conflict (baitoan_id, bo_de_id) do nothing;
    else delete from hinh_baitoan_bo_de where baitoan_id = p_bai and bo_de_id = p_nhan; end if;
  else raise exception 'Loại nhãn không hợp lệ: %', p_loai; end if;
  update hinh_baitoan set updated_at = now() where id = p_bai;
end $$;

-- Đặt độ khó 1–5; p_do_kho NULL ⇒ gỡ (về "chưa đánh" = không có dòng)
create or replace function fn_hl_bai_do_kho_dat(p_bai uuid, p_do_kho smallint) returns void language plpgsql as $$
begin
  if not exists (select 1 from hinh_baitoan where id = p_bai) then raise exception 'Bài không tồn tại'; end if;
  if p_do_kho is null then delete from hinh_baitoan_do_kho where baitoan_id = p_bai;
  else
    insert into hinh_baitoan_do_kho (baitoan_id, do_kho) values (p_bai, p_do_kho)
      on conflict (baitoan_id) do update set do_kho = excluded.do_kho, actor = jwt_uid(), at = now()
      where hinh_baitoan_do_kho.do_kho is distinct from excluded.do_kho;
  end if;
  update hinh_baitoan set updated_at = now() where id = p_bai;
end $$;

-- Nhãn riêng của ý: chặn khi ý đã gán bài (nhãn kế thừa từ bài, sửa ở bài). Còn lại giữ nguyên bản 19/10.
create or replace function fn_hl_y_nhan_dat(p_y uuid, p_loai text, p_nhan uuid, p_bat boolean) returns void language plpgsql as $$
begin
  if p_bat and exists (select 1 from hinh_y where id = p_y and baitoan_id is not null) then
    raise exception 'Ý này đã gán bài mô hình — nhãn kế thừa từ bài, hãy sửa nhãn ở bài trong mô hình';
  end if;
  if p_loai = 'dang' then
    if p_bat then insert into hinh_y_dang (y_id, dang_id, nguon) values (p_y, p_nhan, 'nguoi') on conflict (y_id, dang_id) do nothing;
    else delete from hinh_y_dang where y_id = p_y and dang_id = p_nhan; end if;
  elsif p_loai = 'bo_de' then
    if p_bat then insert into hinh_y_bo_de (y_id, bo_de_id, nguon) values (p_y, p_nhan, 'nguoi') on conflict (y_id, bo_de_id) do nothing;
    else delete from hinh_y_bo_de where y_id = p_y and bo_de_id = p_nhan; end if;
  else raise exception 'Loại nhãn không hợp lệ: %', p_loai; end if;
  delete from hinh_y_nhan_de_xuat where y_id = p_y and loai = p_loai and nhan_id = p_nhan;   -- người đã quyết ⇒ đề xuất hết hiệu lực
  update hinh_y set updated_at = now() where id = p_y;
end $$;

-- ── RPC đọc ──────────────────────────────────────────────────────────────────────────────────
-- Nhãn của mọi bài trong cây mô hình (gốc + mọi giả thiết con). Một dòng / nhãn; loai 'do_kho' mang gia_tri.
create or replace function fn_hl_bai_nhan_cay(p_goc uuid)
returns table (baitoan_id uuid, loai text, nhan_id uuid, gia_tri smallint, nguon text) language sql stable as $$
  with bai as (select b.id from hinh_baitoan b where fn_hl_goc_mo_hinh(b.mo_hinh_id) = p_goc)
  select d.baitoan_id, 'dang', d.dang_id, null::smallint, d.nguon from hinh_baitoan_dang d join bai on bai.id = d.baitoan_id
  union all
  select o.baitoan_id, 'bo_de', o.bo_de_id, null::smallint, o.nguon from hinh_baitoan_bo_de o join bai on bai.id = o.baitoan_id
  union all
  select k.baitoan_id, 'do_kho', null::uuid, k.do_kho, 'nguoi' from hinh_baitoan_do_kho k join bai on bai.id = k.baitoan_id
$$;

-- Nhãn HIỆU LỰC của các ý: ý đã gán bài ⇒ nhãn của bài (nguon 'bai', tu_bai = bài) · chưa gán ⇒ nhãn riêng của ý.
create or replace function fn_hl_y_nhan_hieu_luc(p_y uuid[])
returns table (y_id uuid, loai text, nhan_id uuid, gia_tri smallint, nguon text, tu_bai uuid) language sql stable as $$
  with y as (select h.id, h.baitoan_id from hinh_y h where h.id = any(p_y))
  select y.id, 'dang', d.dang_id, null::smallint, 'bai', y.baitoan_id from y join hinh_baitoan_dang d on d.baitoan_id = y.baitoan_id
  union all
  select y.id, 'bo_de', o.bo_de_id, null::smallint, 'bai', y.baitoan_id from y join hinh_baitoan_bo_de o on o.baitoan_id = y.baitoan_id
  union all
  select y.id, 'do_kho', null::uuid, k.do_kho, 'bai', y.baitoan_id from y join hinh_baitoan_do_kho k on k.baitoan_id = y.baitoan_id
  union all
  select y.id, 'dang', d.dang_id, null::smallint, d.nguon, null::uuid from y join hinh_y_dang d on d.y_id = y.id where y.baitoan_id is null
  union all
  select y.id, 'bo_de', o.bo_de_id, null::smallint, o.nguon, null::uuid from y join hinh_y_bo_de o on o.y_id = y.id where y.baitoan_id is null
$$;

revoke execute on function fn_hl_bai_nhan_dat(uuid, text, uuid, boolean) from public, anon;
revoke execute on function fn_hl_bai_do_kho_dat(uuid, smallint) from public, anon;
revoke execute on function fn_hl_y_nhan_dat(uuid, text, uuid, boolean) from public, anon;
revoke execute on function fn_hl_bai_nhan_cay(uuid) from public, anon;
revoke execute on function fn_hl_y_nhan_hieu_luc(uuid[]) from public, anon;
grant execute on function fn_hl_bai_nhan_dat(uuid, text, uuid, boolean) to authenticated;
grant execute on function fn_hl_bai_do_kho_dat(uuid, smallint) to authenticated;
grant execute on function fn_hl_y_nhan_dat(uuid, text, uuid, boolean) to authenticated;
grant execute on function fn_hl_bai_nhan_cay(uuid) to authenticated;
grant execute on function fn_hl_y_nhan_hieu_luc(uuid[]) to authenticated;
