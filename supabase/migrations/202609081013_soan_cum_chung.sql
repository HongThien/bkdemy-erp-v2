-- ============================================================================
-- 202609081013 — soan_cum_chung
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 08/09 (tool soạn thảo công thức): "gõ tắt hay hơn phím tắt… theo t dùng BỘ CHUNG của trung tâm trước
--   đi, ưu tiên NGÔN NGỮ CHUNG trước." Cụm (công thức/đoạn bổ đề dùng lại) + thư mục + tên tab đang nằm localStorage
--   từng máy (spike 05/09 — src/soan/cum.ts ghi rõ phải lên DB khi chốt). Từ nay: MỘT bộ chung, mọi nhân sự đăng nhập
--   đọc + thêm/sửa; gõ tắt là ngôn ngữ chung nên `go_tat` KHÔNG trùng trong bộ (unique, không phân biệt hoa/thường).
-- LUẬT: xoá mềm `xoa_at` (tham chiếu từ bài đã soạn không có FK — §2 "kho rác trong bảng gốc") · mọi sửa/xoá có VẾT
--   (trigger → soan_cum_lich_su, §4) · nhãn `mon`/`nhanh` theo §1.6 (không nhánh riêng cho môn nào trong code).
-- MẤT GÌ (Luật xoá): không mất gì — chỉ THÊM 4 bảng + 2 hàm + trigger. Dữ liệu localStorage vẫn ở máy, app có nút
--   "Đưa cụm trên máy này lên bộ chung" để nhập.
-- ============================================================================

-- ── 1) Thư mục = chương của khối ("Hình 8 · Tứ giác") ────────────────────────────────────────────
create table if not exists soan_thu_muc (
  id          uuid primary key default gen_random_uuid(),
  ten         text not null,
  mon         text not null,                 -- 'Toán' | 'Văn' | 'Anh' | 'KHTN'
  nhanh       text,                          -- Toán: 'dai' | 'hinh' (null = chung)
  khoi        smallint,                      -- 6..12
  tab_ten     jsonb not null default '{}'::jsonb,   -- {"1":"Cơ bản"} tên đặt cho tab; tab không tên hiện số
  thu_tu      integer,
  tao_boi     uuid references nhan_su(id),
  sua_boi     uuid references nhan_su(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  xoa_at      timestamptz
);
alter table soan_thu_muc enable row level security;
drop policy if exists soan_thu_muc_member_all on soan_thu_muc;
create policy soan_thu_muc_member_all on soan_thu_muc for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── 2) Cụm: công thức (LaTeX, có thể có ô trống `#?`) hoặc đoạn (chuỗi kho text + $…$) ───────────
create table if not exists soan_cum (
  id          uuid primary key default gen_random_uuid(),
  ten         text not null,
  loai        text not null check (loai in ('cong_thuc','doan')),
  noi_dung    text not null,
  go_tat      text,                          -- gõ chữ này rồi Space; có tham số: goc_ABC (xem MathDoc.resolveGoTat)
  phim        text,                          -- tổ hợp 'Ctrl+Alt+F'
  mon         text not null,
  nhanh       text,
  thu_muc_id  uuid references soan_thu_muc(id),   -- null = "Chung"
  tab         smallint not null default 1,   -- ô trên thanh tab 1..10 (0 = ẩn khỏi thanh)
  thu_tu      integer,
  tao_boi     uuid references nhan_su(id),
  sua_boi     uuid references nhan_su(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  xoa_at      timestamptz
);
-- Gõ tắt = ngôn ngữ chung → 1 gõ tắt = 1 cụm (trong số cụm còn sống).
create unique index if not exists soan_cum_go_tat_uniq on soan_cum (lower(go_tat)) where xoa_at is null and go_tat is not null and go_tat <> '';
create index if not exists soan_cum_thu_muc_idx on soan_cum (thu_muc_id) where xoa_at is null;
alter table soan_cum enable row level security;
drop policy if exists soan_cum_member_all on soan_cum;
create policy soan_cum_member_all on soan_cum for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── 3) Tên tab của nhóm "Chung" (không có thư mục để chứa) ───────────────────────────────────────
create table if not exists soan_tab_chung (
  tab         smallint primary key,
  ten         text not null,
  updated_at  timestamptz not null default now()
);
alter table soan_tab_chung enable row level security;
drop policy if exists soan_tab_chung_member_all on soan_tab_chung;
create policy soan_tab_chung_member_all on soan_tab_chung for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── 4) Vết sửa/xoá cụm (§4: app KHÔNG tự nhớ ghi log — trigger làm) ──────────────────────────────
create table if not exists soan_cum_lich_su (
  id          bigint generated always as identity primary key,
  cum_id      uuid not null,
  truoc       jsonb,                         -- to_jsonb(old); null khi tạo
  sau         jsonb,                         -- to_jsonb(new); null khi xoá cứng (không dùng — xoá mềm là update)
  boi         uuid,                          -- sua_boi/tao_boi do app điền (nhan_su.id)
  luc         timestamptz not null default now()
);
alter table soan_cum_lich_su enable row level security;
drop policy if exists soan_cum_lich_su_member_read on soan_cum_lich_su;
create policy soan_cum_lich_su_member_read on soan_cum_lich_su for select to authenticated using (public.la_thanh_vien());

create or replace function public.fn_soan_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_soan_thu_muc_touch on soan_thu_muc;
create trigger trg_soan_thu_muc_touch before update on soan_thu_muc for each row execute function public.fn_soan_touch();
drop trigger if exists trg_soan_cum_touch on soan_cum;
create trigger trg_soan_cum_touch before update on soan_cum for each row execute function public.fn_soan_touch();

create or replace function public.fn_soan_cum_log() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into soan_cum_lich_su (cum_id, truoc, sau, boi) values (new.id, null, to_jsonb(new), new.tao_boi);
  elsif tg_op = 'UPDATE' then
    if to_jsonb(old) - 'updated_at' is distinct from to_jsonb(new) - 'updated_at' then
      insert into soan_cum_lich_su (cum_id, truoc, sau, boi) values (new.id, to_jsonb(old), to_jsonb(new), new.sua_boi);
    end if;
  elsif tg_op = 'DELETE' then
    insert into soan_cum_lich_su (cum_id, truoc, sau, boi) values (old.id, to_jsonb(old), null, old.sua_boi);
  end if;
  return coalesce(new, old);
end $$;
drop trigger if exists trg_soan_cum_log on soan_cum;
create trigger trg_soan_cum_log after insert or update or delete on soan_cum for each row execute function public.fn_soan_cum_log();
