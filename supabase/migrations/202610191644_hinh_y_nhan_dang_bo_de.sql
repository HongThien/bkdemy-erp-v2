-- HÌNH–LUYỆN: nhãn DẠNG BÀI + BỔ ĐỀ dán cho TỪNG Ý (Thùy 19/10)
--   Mục đích: lọc + tạo tài liệu riêng theo dạng bài / bổ đề. KHÔNG đo (đơn vị đo Hình–Luyện vẫn là bài mô hình).
--   Chốt: dùng lại danh mục cũ hinh_dang / hinh_bo_de (chuyển sang kho mới; kho cũ thôi sửa) · nhãn có khối:
--   ý lớp 9 dùng được nhãn lớp 8, KHÔNG chiều ngược (nhãn.khoi ≤ khối của bài) · Claude GỢI Ý, người DUYỆT.
--   Một ý nhiều nhãn mỗi loại (faceted). Nhãn bám mã gốc (id), đổi tên nhãn không mất.
--   "Thiếu = không có dòng": đề xuất AI ở bảng riêng; người nhận ⇒ thành nhãn (nguon='ai'); người bác ⇒ ghi tu_choi (AI không gợi ý lại).

create table if not exists hinh_y_dang (
  id      bigint generated always as identity primary key,
  y_id    uuid not null references hinh_y(id),
  dang_id uuid not null references hinh_dang(id),
  nguon   text not null default 'nguoi' check (nguon in ('nguoi','ai')),
  actor   uuid default jwt_uid(),
  at      timestamptz not null default now(),
  unique (y_id, dang_id)
);
create table if not exists hinh_y_bo_de (
  id       bigint generated always as identity primary key,
  y_id     uuid not null references hinh_y(id),
  bo_de_id uuid not null references hinh_bo_de(id),
  nguon    text not null default 'nguoi' check (nguon in ('nguoi','ai')),
  actor    uuid default jwt_uid(),
  at       timestamptz not null default now(),
  unique (y_id, bo_de_id)
);
create table if not exists hinh_y_nhan_de_xuat (
  id      bigint generated always as identity primary key,
  y_id    uuid not null references hinh_y(id),
  loai    text not null check (loai in ('dang','bo_de')),
  nhan_id uuid not null,
  ly_do   text not null check (btrim(ly_do) <> ''),
  at      timestamptz not null default now(),
  unique (y_id, loai, nhan_id)
);
create table if not exists hinh_y_nhan_tu_choi (
  id      bigint generated always as identity primary key,
  y_id    uuid not null references hinh_y(id),
  loai    text not null check (loai in ('dang','bo_de')),
  nhan_id uuid not null,
  ly_do   text not null default '',
  actor   uuid default jwt_uid(),
  at      timestamptz not null default now()
);
create index if not exists hinh_y_dang_y_idx on hinh_y_dang (y_id);
create index if not exists hinh_y_dang_d_idx on hinh_y_dang (dang_id);
create index if not exists hinh_y_bo_de_y_idx on hinh_y_bo_de (y_id);
create index if not exists hinh_y_bo_de_b_idx on hinh_y_bo_de (bo_de_id);
create index if not exists hinh_y_nhan_de_xuat_y_idx on hinh_y_nhan_de_xuat (y_id);

-- ── Luật khối: nhãn.khoi ≤ khối của bài chứa ý (nhãn không khối = dùng mọi khối) ───────────────
create or replace function _hl_so_khoi(k text) returns int language sql immutable as $$
  select nullif(regexp_replace(coalesce(k, ''), '\D.*$', ''), '')::int
$$;
create or replace function _hl_nhan_hop_khoi(p_y uuid, p_loai text, p_nhan uuid) returns void language plpgsql as $$
declare v_kb int; v_kn int; v_ten text;
begin
  select _hl_so_khoi(b.khoi) into v_kb from hinh_y y join hinh_bai b on b.id = y.bai_id where y.id = p_y;
  if p_loai = 'dang' then select _hl_so_khoi(khoi), ten into v_kn, v_ten from hinh_dang where id = p_nhan;
  else select _hl_so_khoi(khoi), ten into v_kn, v_ten from hinh_bo_de where id = p_nhan; end if;
  if v_ten is null then raise exception 'Không thấy nhãn % %', p_loai, p_nhan; end if;
  if v_kn is not null and v_kb is not null and v_kn > v_kb then
    raise exception 'Nhãn «%» là của lớp % — ý lớp % không dùng được (chỉ dùng nhãn từ lớp mình trở xuống)', v_ten, v_kn, v_kb;
  end if;
end $$;
create or replace function _hl_trg_nhan_khoi() returns trigger language plpgsql as $$
begin
  -- mỗi bảng một nhánh: plpgsql báo lỗi nếu chạm cột không có trong bảng đó
  if tg_table_name = 'hinh_y_dang' then perform _hl_nhan_hop_khoi(new.y_id, 'dang', new.dang_id);
  elsif tg_table_name = 'hinh_y_bo_de' then perform _hl_nhan_hop_khoi(new.y_id, 'bo_de', new.bo_de_id);
  else perform _hl_nhan_hop_khoi(new.y_id, new.loai, new.nhan_id); end if;
  return new;
end $$;
drop trigger if exists trg_hl_y_dang_khoi on hinh_y_dang;
create trigger trg_hl_y_dang_khoi before insert or update on hinh_y_dang for each row execute function _hl_trg_nhan_khoi();
drop trigger if exists trg_hl_y_bo_de_khoi on hinh_y_bo_de;
create trigger trg_hl_y_bo_de_khoi before insert or update on hinh_y_bo_de for each row execute function _hl_trg_nhan_khoi();
drop trigger if exists trg_hl_y_nhan_dx_khoi on hinh_y_nhan_de_xuat;
create trigger trg_hl_y_nhan_dx_khoi before insert or update on hinh_y_nhan_de_xuat for each row execute function _hl_trg_nhan_khoi();

-- Ghi vết đổi nhãn (nhật ký chung dai_bdm_log, khoá = id dòng)
drop trigger if exists trg_hl_y_dang_log on hinh_y_dang;
create trigger trg_hl_y_dang_log after insert or update or delete on hinh_y_dang for each row execute function _bdm_ghi_log();
drop trigger if exists trg_hl_y_bo_de_log on hinh_y_bo_de;
create trigger trg_hl_y_bo_de_log after insert or update or delete on hinh_y_bo_de for each row execute function _bdm_ghi_log();

-- ── RLS ─────────────────────────────────────────────────────────────────────────────────────
alter table hinh_y_dang enable row level security;
alter table hinh_y_bo_de enable row level security;
alter table hinh_y_nhan_de_xuat enable row level security;
alter table hinh_y_nhan_tu_choi enable row level security;
drop policy if exists hinh_y_dang_member_all on hinh_y_dang;
create policy hinh_y_dang_member_all on hinh_y_dang for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists hinh_y_bo_de_member_all on hinh_y_bo_de;
create policy hinh_y_bo_de_member_all on hinh_y_bo_de for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists hinh_y_nhan_de_xuat_member_all on hinh_y_nhan_de_xuat;
create policy hinh_y_nhan_de_xuat_member_all on hinh_y_nhan_de_xuat for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists hinh_y_nhan_tu_choi_doc on hinh_y_nhan_tu_choi;
create policy hinh_y_nhan_tu_choi_doc on hinh_y_nhan_tu_choi for select to authenticated using (la_thanh_vien());
drop policy if exists hinh_y_nhan_tu_choi_ghi on hinh_y_nhan_tu_choi;
create policy hinh_y_nhan_tu_choi_ghi on hinh_y_nhan_tu_choi for insert to authenticated with check (la_thanh_vien());
grant select, insert, update, delete on hinh_y_dang, hinh_y_bo_de, hinh_y_nhan_de_xuat to authenticated;
grant select, insert on hinh_y_nhan_tu_choi to authenticated;
revoke update, delete, truncate on hinh_y_nhan_tu_choi from authenticated, anon, public;

-- ── RPC ─────────────────────────────────────────────────────────────────────────────────────
-- Người dán / gỡ 1 nhãn trên 1 ý
create or replace function fn_hl_y_nhan_dat(p_y uuid, p_loai text, p_nhan uuid, p_bat boolean) returns void language plpgsql as $$
begin
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

-- Người duyệt 1 đề xuất của Claude: nhận ⇒ thành nhãn (nguon='ai'); bác ⇒ ghi từ chối
create or replace function fn_hl_y_nhan_quyet(p_de_xuat bigint, p_nhan boolean, p_ly_do text default '') returns void language plpgsql as $$
declare d record;
begin
  select * into d from hinh_y_nhan_de_xuat where id = p_de_xuat;
  if d is null then raise exception 'Đề xuất % không còn', p_de_xuat; end if;
  if p_nhan then
    if d.loai = 'dang' then insert into hinh_y_dang (y_id, dang_id, nguon) values (d.y_id, d.nhan_id, 'ai') on conflict (y_id, dang_id) do nothing;
    else insert into hinh_y_bo_de (y_id, bo_de_id, nguon) values (d.y_id, d.nhan_id, 'ai') on conflict (y_id, bo_de_id) do nothing; end if;
  else
    insert into hinh_y_nhan_tu_choi (y_id, loai, nhan_id, ly_do) values (d.y_id, d.loai, d.nhan_id, coalesce(btrim(p_ly_do), ''));
  end if;
  delete from hinh_y_nhan_de_xuat where id = p_de_xuat;
  update hinh_y set updated_at = now() where id = d.y_id;
end $$;

revoke execute on function fn_hl_y_nhan_dat(uuid, text, uuid, boolean) from public, anon;
revoke execute on function fn_hl_y_nhan_quyet(bigint, boolean, text) from public, anon;
grant execute on function fn_hl_y_nhan_dat(uuid, text, uuid, boolean) to authenticated;
grant execute on function fn_hl_y_nhan_quyet(bigint, boolean, text) to authenticated;
