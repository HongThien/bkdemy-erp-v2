-- HÌNH–LUYỆN: thêm tầng NHÓM MÔ HÌNH giữa Chủ đề và Mô hình (Thùy 18/10)
--   "Dàn ra tầng mô hình thì nhiều quá khó theo dõi" ⇒ Chủ đề → NHÓM MÔ HÌNH → Mô hình → Nhánh → Bài.
--   Chốt: nhóm nằm TRONG 1 chủ đề · mô hình gốc (phan='luyen') BẮT BUỘC thuộc 1 nhóm (mô hình cũ ở "⚠ Chưa xếp nhóm" tới khi
--   Thùy kéo vào) · nhóm có MÔ TẢ NHẬN BIẾT (dấu hiệu chung của các mô hình — sau này máy xếp mô hình/bài mới theo đó).
--   Nhóm CHỈ GOM: không kế thừa giả thiết (khác "mô hình con"), không đổi số bài, không đo riêng (rollup = tập baitoan_id).
--   Mã gốc bất biến (CLAUDE.md §2): id 'NMH…' cấp lúc INSERT; số thứ tự trên màn chỉ là hiển thị.

create sequence if not exists hinh_nhom_mo_hinh_seq;
create table if not exists hinh_nhom_mo_hinh (
  id          text primary key default ('NMH' || lpad(nextval('hinh_nhom_mo_hinh_seq')::text, 5, '0')),
  chu_de_id   text not null references dai_bdm_chu_de(id),
  ten         text not null check (btrim(ten) <> ''),
  mo_ta       text not null default '',
  thu_tu      integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists hinh_nhom_mo_hinh_cd_idx on hinh_nhom_mo_hinh (chu_de_id, thu_tu);

-- Mô hình GỐC luyện thuộc nhóm. NULL = không áp dụng (nhánh, mô hình cũ phan IS NULL) hoặc mô hình gốc cũ CHƯA được xếp (UI cảnh báo).
alter table hinh_mo_hinh add column if not exists nhom_mh_id text references hinh_nhom_mo_hinh(id);
create index if not exists hinh_mo_hinh_nhom_mh_idx on hinh_mo_hinh (nhom_mh_id);

-- Thứ tự nhóm khi thêm: cuối chủ đề (chỉ ở INSERT — sắp lại qua RPC)
create or replace function _hl_nhom_mh_thu_tu() returns trigger language plpgsql as $$
begin
  if coalesce(new.thu_tu, 0) = 0 then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from hinh_nhom_mo_hinh where chu_de_id = new.chu_de_id;
  end if;
  return new;
end $$;
drop trigger if exists trg_hl_nhom_mh_thu_tu on hinh_nhom_mo_hinh;
create trigger trg_hl_nhom_mh_thu_tu before insert on hinh_nhom_mo_hinh for each row execute function _hl_nhom_mh_thu_tu();

-- Nhóm và chủ đề của mô hình luôn KHỚP: vào nhóm ⇒ chủ đề theo nhóm; đổi chủ đề sang chủ đề khác nhóm ⇒ rời nhóm.
create or replace function _hl_mo_hinh_khop_nhom() returns trigger language plpgsql as $$
declare v_cd text;
begin
  if new.nhom_mh_id is not null and (tg_op = 'INSERT' or new.nhom_mh_id is distinct from old.nhom_mh_id) then
    select chu_de_id into v_cd from hinh_nhom_mo_hinh where id = new.nhom_mh_id;
    new.chu_de_id := v_cd;
  elsif new.nhom_mh_id is not null and tg_op = 'UPDATE' and new.chu_de_id is distinct from old.chu_de_id then
    if not exists (select 1 from hinh_nhom_mo_hinh where id = new.nhom_mh_id and chu_de_id is not distinct from new.chu_de_id) then
      new.nhom_mh_id := null;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_hl_mo_hinh_khop_nhom on hinh_mo_hinh;
create trigger trg_hl_mo_hinh_khop_nhom before insert or update of nhom_mh_id, chu_de_id on hinh_mo_hinh
  for each row execute function _hl_mo_hinh_khop_nhom();

-- Nhật ký: dùng chung dai_bdm_log của bản đồ mới (bảng · khoá · cũ/mới · actor) — mọi đổi nhóm đều có vết
drop trigger if exists trg_hl_nhom_mh_log on hinh_nhom_mo_hinh;
create trigger trg_hl_nhom_mh_log after insert or update or delete on hinh_nhom_mo_hinh for each row execute function _bdm_ghi_log();

alter table hinh_nhom_mo_hinh enable row level security;
drop policy if exists hinh_nhom_mo_hinh_member_all on hinh_nhom_mo_hinh;
create policy hinh_nhom_mo_hinh_member_all on hinh_nhom_mo_hinh for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
grant select, insert, update, delete on hinh_nhom_mo_hinh to authenticated;
grant usage on sequence hinh_nhom_mo_hinh_seq to authenticated;

-- ── RPC ─────────────────────────────────────────────────────────────────────────────────
-- Sắp lại thứ tự nhóm của 1 chủ đề theo danh sách id
create or replace function fn_hl_nhom_mh_sap(p_ids text[]) returns void language plpgsql as $$
begin
  update hinh_nhom_mo_hinh n set thu_tu = x.i, updated_at = now()
    from unnest(p_ids) with ordinality as x(id, i) where n.id = x.id and n.thu_tu is distinct from x.i;
end $$;

-- Xoá nhóm: CHỈ khi nhóm rỗng (không mô hình nào) — người bấm ở màn, có hỏi lại
create or replace function fn_hl_nhom_mh_xoa(p_id text) returns void language plpgsql as $$
begin
  if exists (select 1 from hinh_mo_hinh where nhom_mh_id = p_id) then
    raise exception 'Nhóm còn mô hình — chuyển hết mô hình sang nhóm khác rồi mới xoá được';
  end if;
  delete from hinh_nhom_mo_hinh where id = p_id;
end $$;

-- Tạo mô hình luyện NGAY TRONG nhóm (1 transaction): khối + chủ đề lấy theo nhóm
create or replace function fn_hl_tao_mo_hinh_trong_nhom(p_nhom text, p_ten text, p_gia_thiet text, p_anh text)
returns text language plpgsql as $$
declare v_khoi text; v_id uuid;
begin
  select cd.khoi into v_khoi from hinh_nhom_mo_hinh n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_nhom;
  if v_khoi is null then raise exception 'Không thấy nhóm mô hình %', p_nhom; end if;
  v_id := fn_hl_tao_mo_hinh(v_khoi, p_ten, p_gia_thiet, p_anh)::uuid;
  update hinh_mo_hinh set nhom_mh_id = p_nhom, updated_at = now() where id = v_id;   -- trigger tự đặt chu_de_id
  return v_id::text;
end $$;

revoke execute on function fn_hl_nhom_mh_sap(text[]) from public, anon;
revoke execute on function fn_hl_nhom_mh_xoa(text) from public, anon;
revoke execute on function fn_hl_tao_mo_hinh_trong_nhom(text, text, text, text) from public, anon;
grant execute on function fn_hl_nhom_mh_sap(text[]) to authenticated;
grant execute on function fn_hl_nhom_mh_xoa(text) to authenticated;
grant execute on function fn_hl_tao_mo_hinh_trong_nhom(text, text, text, text) to authenticated;
