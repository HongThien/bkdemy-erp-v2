-- ============================================================================
-- 202609012230 — KHÔI PHỤC vào repo phần DB "giải thưởng" bị áp TAY mà không commit file.
--
-- BỐI CẢNH (đo 01/09): sổ `_migrations` có 4 dòng mà repo KHÔNG có file:
--   202608222140_giai_thuong_bang_goc.sql · 202608222140_giai_thuong_trigger_va_fdw.sql
--   202608222208_giai_thuong_lop_thang.sql · 202608222209_giai_thuong_lop_thang_rls.sql
-- `git log --all` không có dấu vết ⇒ SQL chạy thẳng trong Supabase SQL Editor 22/08, file
-- chưa từng nằm trong git. Hệ quả: dựng lại DB TỪ REPO sẽ THIẾU 2 bảng này — repo hết là
-- source of truth cho phần đó, và không ai thấy vì `migrate:status` cũ không soi chiều này
-- (đã vá cùng ngày: status giờ báo "có trong sổ nhưng không còn file").
--
-- File này = DDL ĐỌC NGƯỢC TỪ DB THẬT (pg_catalog), viết idempotent để áp lên DB đang
-- sống là no-op, còn trên DB trắng thì dựng lại đúng y hệt. KHÔNG phải thiết kế mới.
--
-- ⚠ CHỦ SỞ HỮU: trên DB thật 2 bảng này thuộc `postgres`, không thuộc `claude_build` (đúng
-- cảnh báo đầu `schema.md`). Role chạy migrate KHÔNG sửa nổi RLS/policy/trigger của bảng
-- người khác sở hữu ⇒ mọi phần đó nằm trong DO block CHỈ CHẠY KHI role hiện tại là chủ sở
-- hữu (DB thật: bỏ qua, vì đã có sẵn; DB dựng mới: chạy đủ, vì lúc đó chính nó tạo bảng).
--
-- ⚠ TRẠNG THÁI TÍNH NĂNG: cả 2 bảng đang RỖNG (0 dòng) và `grep giai_thuong` toàn bộ
-- `src/` + repo bkdemy-web = 0 hit ⇒ mặt DB dựng xong nhưng CHƯA CÓ CODE nào dùng.
-- Giữ lại vì xoá là quyết định của CEO (Luật xoá), không phải dọn kèm lúc chuẩn hoá.
--
-- MẤT GÌ (Luật xoá): không. Chỉ create-if-not-exists + dựng lại policy/trigger y hệt.
-- ============================================================================

-- ── Bảng gốc: mỗi (tháng, môn, HS) tối đa 1 giải ──────────────────────────────
create table if not exists public.giai_thuong (
  id          uuid primary key default gen_random_uuid(),
  thang       date not null,
  lop_id      uuid not null references lop(id),
  mon         text not null,
  hoc_sinh_id uuid not null references hoc_sinh(id),
  loai_giai   text not null check (loai_giai in ('xuat_sac', 'tien_bo', 'cham_chi')),
  duyet_boi   uuid not null references nhan_su(id),
  duyet_at    timestamptz not null default now(),
  cong_bo_at  timestamptz,
  unique (thang, mon, hoc_sinh_id)
);

-- ── Mốc "đã chốt giải tháng này cho lớp" ──────────────────────────────────────
create table if not exists public.giai_thuong_lop_thang (
  lop_id          uuid not null references lop(id),
  thang           date not null,
  hoan_thanh_at   timestamptz,
  hoan_thanh_boi  uuid references nhan_su(id),
  primary key (lop_id, thang)
);

do $do$
declare
  la_chu boolean;
begin
  select pg_get_userbyid(relowner) = current_user into la_chu
  from pg_class where oid = 'public.giai_thuong'::regclass;

  if not la_chu then
    raise notice 'Bỏ qua fn/trigger/RLS của giai_thuong: bảng thuộc chủ khác (%), role % không sửa được — DB thật đã có sẵn đúng những thứ này.',
      (select pg_get_userbyid(relowner) from pg_class where oid = 'public.giai_thuong'::regclass), current_user;
    return;
  end if;

  -- ── Trần slot mỗi lớp/tháng: xuất sắc 3 · tiến bộ 2 · chăm chỉ 1 ───────────
  execute $fn$
    create or replace function public.giai_thuong_check_slot()
    returns trigger language plpgsql as $body$
    declare
      max_slot int;
      hien_co int;
    begin
      max_slot := case new.loai_giai
        when 'xuat_sac' then 3
        when 'tien_bo' then 2
        when 'cham_chi' then 1
      end;
      select count(*) into hien_co
      from giai_thuong
      where thang = new.thang and lop_id = new.lop_id and loai_giai = new.loai_giai;
      if hien_co >= max_slot then
        raise exception 'Lớp % tháng % đã đủ % slot "%"', new.lop_id, new.thang, max_slot, new.loai_giai;
      end if;
      return new;
    end;
    $body$
  $fn$;

  execute 'drop trigger if exists trg_giai_thuong_check_slot on public.giai_thuong';
  execute 'create trigger trg_giai_thuong_check_slot before insert on public.giai_thuong
           for each row execute function giai_thuong_check_slot()';

  -- ── RLS: thành viên nội bộ toàn quyền ───────────────────────────────────────
  execute 'alter table public.giai_thuong           enable row level security';
  execute 'alter table public.giai_thuong_lop_thang enable row level security';

  execute 'drop policy if exists giai_thuong_member_all on public.giai_thuong';
  execute 'create policy giai_thuong_member_all on public.giai_thuong
           for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())';

  execute 'drop policy if exists giai_thuong_lop_thang_member_all on public.giai_thuong_lop_thang';
  execute 'create policy giai_thuong_lop_thang_member_all on public.giai_thuong_lop_thang
           for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())';

  -- ⚠ CHỈ policy, KHÔNG grant: DB thật đang là policy-CÓ / GRANT-KHÔNG ⇒ `fdw_bkdemy_web`
  -- thực tế đọc KHÔNG được bảng này (hai cổng độc lập — xem 202608151030). Chép đúng hiện
  -- trạng, không tự nới quyền trong lúc khôi phục.
  if exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    execute 'drop policy if exists fdw_bkdemy_web_read on public.giai_thuong';
    execute 'create policy fdw_bkdemy_web_read on public.giai_thuong for select to fdw_bkdemy_web using (true)';
  end if;
end
$do$;

do $do$
begin
  if exists (select 1 from pg_roles where rolname = 'claude_build') then
    execute 'grant select on public.giai_thuong, public.giai_thuong_lop_thang to claude_build';
  end if;
exception when insufficient_privilege then
  raise notice 'Không cấp được SELECT cho claude_build (không phải chủ bảng) — DB thật đã có sẵn.';
end
$do$;
