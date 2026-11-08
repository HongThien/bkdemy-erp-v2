-- ============================================================================
-- 202610261852 — kho_cau_khuon_dap_so          ⚠ BẢN NHÁP — CHƯA ÁP, CHỜ THÙY DUYỆT
-- ----------------------------------------------------------------------------
-- File cố ý nằm ở supabase/migrations-nhap/ (KHÔNG phải supabase/migrations/) để `npm run migrate` của phiên khác
-- không tự áp. Thùy duyệt xong: `git mv` sang supabase/migrations/ (giữ tên) → `node scripts/migrate.mjs --status`
-- → `node scripts/migrate.mjs --only 202610261852_kho_cau_khuon_dap_so.sql` → `npm run schema`.
--
-- VÌ SAO:
--   Pipeline MCQ (mcq-sinh / mcq-auto / kho-quet-dapso) chọn bộ đọc đáp số + bộ sinh nhiễu theo MÃ DẠNG CŨ của câu.
--   Từ 26/10 đơn vị là dạng bài bản đồ mới (NDB); mã dạng cũ chỉ còn là "khuôn đáp số" của câu. Hiện script đọc khuôn
--   từ cột lưu trữ `dang_chinh` (scripts/lib/khuon-dap-so.mjs) — vẫn còn dính cột của bản đồ cũ: cột đó còn đổi được
--   (trg_log_doi_dang ghi vết đổi dạng ⇒ có đường ghi đè), cấp 1 vẫn sống trên bản đồ cũ, và sau này dọn bản đồ cũ là
--   mất luôn khuôn. Bảng này CHÉP MỘT LẦN khuôn ra thành thuộc tính riêng của câu ⇒ đổi/xoá bản đồ cũ không còn ảnh
--   hưởng máy sinh MCQ. Có bảng ⇒ script tự đọc bảng (to_regclass), không cần sửa script.
--
--   §1.5: câu chưa có khuôn = KHÔNG có dòng (không cột NULL trên *_cau_hoi). §1.6: bảng riêng theo nhánh (dai / hgt)
--   như *_cau_form_tn. Khuôn = mã chép nguyên từ mã dạng cũ (mã khuôn đóng băng; đổi tên khuôn = đổi hành vi máy).
--   Câu mã chờ (…000000) KHÔNG chép — đó là "chưa xếp", không phải khuôn ⇒ đi khuôn chung (+ --theo-dap-so).
--   Đổi khuôn về sau: chỉ bằng UPDATE có chủ đích (nguon='nguoi' | 'may'), trigger ghi vết cũ/mới.
--
-- ĐÃ CHẠY THỬ 26/10 trong 1 transaction rồi ROLLBACK (không để lại gì): áp OK ~3,5 s · dai_cau_khuon 30 655 dòng (610 khuôn)
--   · hgt_cau_khuon 2 057 dòng (49 khuôn) · câu không có khuôn: dai 10 441 (5 171 đã gán NDB — mã chờ), hgt 1 988 (1 423)
--   · khuôn đọc từ BẢNG ≡ khuôn đọc từ CỘT lưu trữ trên 41 096 + 4 045 câu (0 lệch) ⇒ áp xong pipeline ra y hệt hôm nay
--   · trigger log đổi khuôn chạy đúng (cũ/mới/nguồn). Log nhận 32 712 dòng 'chép' lúc áp (vết nguồn gốc).
--
-- MẤT GÌ: không mất gì. Không drop/alter thu hẹp; chỉ tạo bảng mới + chép dữ liệu + comment cột ap_dung.
-- ============================================================================

-- ── Bảng khuôn theo nhánh ───────────────────────────────────────────────────────────────────────────────────────
create table if not exists dai_cau_khuon (
  ma_cau     text primary key references dai_cau_hoi(ma_cau),
  khuon      text not null check (khuon ~ '^[A-Za-z0-9_]{2,40}$'),
  nguon      text not null check (nguon in ('chep_ma_cu', 'may', 'nguoi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists hgt_cau_khuon (
  ma_cau     text primary key references hgt_cau_hoi(ma_cau),
  khuon      text not null check (khuon ~ '^[A-Za-z0-9_]{2,40}$'),
  nguon      text not null check (nguon in ('chep_ma_cu', 'may', 'nguoi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists dai_cau_khuon_khuon_idx on dai_cau_khuon (khuon);
create index if not exists hgt_cau_khuon_khuon_idx on hgt_cau_khuon (khuon);

comment on table dai_cau_khuon is 'Khuôn đáp số của câu Đại (bộ đọc đáp số + sinh nhiễu MCQ + thứ tự rule, scripts/lib/khuon-dap-so.mjs). Thuộc tính của CÂU, tách khỏi bản đồ. Không có dòng = khuôn chung.';
comment on table hgt_cau_khuon is 'Khuôn đáp số của câu HGT — như dai_cau_khuon.';
comment on column dai_cau_khuon.khuon is 'Mã khuôn. Khuôn chép 26/10 = nguyên mã dạng cũ lúc chép (đóng băng, không còn nghĩa bản đồ).';
comment on column dai_cau_khuon.nguon is 'chep_ma_cu = chép 1 lần từ dang_chinh (26/10) · may = máy gán theo đáp số · nguoi = người gán';

-- ── Ghi vết đổi khuôn (CLAUDE.md §4: mọi đổi state có trigger đẻ dòng lịch sử) ─────────────────────────────────
create table if not exists kho_cau_khuon_log (
  id         bigint generated always as identity primary key,
  kho        text not null check (kho in ('dai', 'hgt')),
  ma_cau     text not null,
  khuon_cu   text,            -- NULL = trước đó KHÔNG có dòng (thêm mới) — "không áp dụng", không phải "chưa đo"
  khuon_moi  text,            -- NULL = dòng bị xoá
  nguon      text,
  actor      text not null default current_user,
  at         timestamptz not null default now()
);
create or replace function _trg_kho_cau_khuon_log() returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' then
    if new.khuon is not distinct from old.khuon and new.nguon is not distinct from old.nguon then return new; end if;
    new.updated_at := now();
  end if;
  insert into kho_cau_khuon_log (kho, ma_cau, khuon_cu, khuon_moi, nguon)
  values (tg_argv[0], coalesce(new.ma_cau, old.ma_cau),
          case when tg_op = 'INSERT' then null else old.khuon end,
          case when tg_op = 'DELETE' then null else new.khuon end,
          case when tg_op = 'DELETE' then old.nguon else new.nguon end);
  return case when tg_op = 'DELETE' then old else new end;
end $$;
drop trigger if exists trg_dai_cau_khuon_log on dai_cau_khuon;
create trigger trg_dai_cau_khuon_log before insert or update or delete on dai_cau_khuon
  for each row execute function _trg_kho_cau_khuon_log('dai');
drop trigger if exists trg_hgt_cau_khuon_log on hgt_cau_khuon;
create trigger trg_hgt_cau_khuon_log before insert or update or delete on hgt_cau_khuon
  for each row execute function _trg_kho_cau_khuon_log('hgt');

-- ── Quyền (cùng mẫu dai_cau_form_tn / dai_mcq_rule) ────────────────────────────────────────────────────────────
alter table dai_cau_khuon enable row level security;
alter table hgt_cau_khuon enable row level security;
alter table kho_cau_khuon_log enable row level security;
drop policy if exists dai_cau_khuon_member_all on dai_cau_khuon;
create policy dai_cau_khuon_member_all on dai_cau_khuon
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
drop policy if exists hgt_cau_khuon_member_all on hgt_cau_khuon;
create policy hgt_cau_khuon_member_all on hgt_cau_khuon
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
drop policy if exists kho_cau_khuon_log_member_read on kho_cau_khuon_log;
create policy kho_cau_khuon_log_member_read on kho_cau_khuon_log
  for select to authenticated using (public.la_thanh_vien());
grant select, insert, update, delete on dai_cau_khuon, hgt_cau_khuon to authenticated;
grant select on kho_cau_khuon_log to authenticated;
revoke all on dai_cau_khuon, hgt_cau_khuon, kho_cau_khuon_log from anon;
revoke execute on function _trg_kho_cau_khuon_log() from public, anon;

-- ── Chép MỘT LẦN từ mã dạng cũ (cột lưu trữ dang_chinh), bỏ mã chờ …000000 và câu đã vào kho rác ──────────────
insert into dai_cau_khuon (ma_cau, khuon, nguon)
select q.ma_cau, q.dang_chinh, 'chep_ma_cu' from dai_cau_hoi q
where q.dang_chinh is not null and q.dang_chinh !~ '0{6}$' and q.dang_chinh ~ '^[A-Za-z0-9_]{2,40}$'
on conflict (ma_cau) do nothing;
insert into hgt_cau_khuon (ma_cau, khuon, nguon)
select q.ma_cau, q.dang_chinh, 'chep_ma_cu' from hgt_cau_hoi q
where q.dang_chinh is not null and q.dang_chinh !~ '0{6}$' and q.dang_chinh ~ '^[A-Za-z0-9_]{2,40}$'
on conflict (ma_cau) do nothing;

-- ── Luật nhiễu: ap_dung giờ là danh sách KHUÔN (không đổi dữ liệu — mã khuôn = mã dạng cũ đã chép) ─────────────
comment on column dai_mcq_rule.ap_dung is 'Khuôn đáp số GỢI Ý dùng rule này (mã khuôn, xem dai_cau_khuon.khuon) — không ràng buộc cứng; máy chọn rule theo UU_TIEN[khuôn] ở mcq-auto.mjs.';
comment on column hgt_mcq_rule.ap_dung is 'Khuôn đáp số GỢI Ý dùng rule này (mã khuôn, xem hgt_cau_khuon.khuon) — như dai_mcq_rule.ap_dung.';
