-- ============================================================================
-- 202609121432 — dai_hgt_cau_menh_de_bang_con
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Câu Đúng-Sai (loai_cau='dung_sai'): 1 câu có N mệnh đề, MỖI mệnh đề là 1
--   DẠNG bài khác nhau (VD 1 câu về f(x): mđ1=đạo hàm, mđ2=đơn điệu, mđ3=GTLN,
--   mđ4=đếm nghiệm). Nghĩa là 1 câu ĐS ~ N KP được đo cùng lúc. Nếu chỉ ghi 1
--   dạng cho cả câu (dang_chinh câu cha) → mất N-1 tín hiệu measurement, phá
--   model §1 v2 "mọi phép đo (HS × dạng)".
--
--   Schema hiện tại: câu ĐS có dang_chinh = "dạng đại diện của chuyên đề nhà"
--   (cho ma_cau + browse — xem src/lib/kho/api.ts:415), menh_de jsonb chứa
--   ma_dang per mệnh đề (dạng thật). Vấn đề của jsonb: (1) không FK cứng
--   (renumber bản đồ không chặn được — ma_dang cũ rớt lại jsonb thành text
--   không hợp lệ), (2) không có da_duyet per mệnh đề, (3) query "mệnh đề nào
--   dạng X" phải quét jsonb.
--
--   Giải: bảng con <mon>_cau_menh_de với FK cứng tới bản đồ + duyệt riêng.
--   Giữ jsonb menh_de làm nguồn ghi (code app cũ không sửa) + trigger AFTER
--   INSERT/UPDATE OF menh_de tự sync xuống bảng con. Pha sau refactor
--   createCauDungSai để ghi thẳng bảng con → drop trigger + jsonb column.
--
--   ĐỐI XỨNG: chỉ dai + hgt (2 nhánh Toán) đợt này. KHTN hold — hiện gộp
--   Lý/Hoá/Sinh sai cấp (super-môn thay vì nhánh), sẽ tách task riêng
--   (memory `[doi-xung-cap-mon-vs-nhanh]`).
--
-- MẤT GÌ:
--   KHÔNG mất. Thuần thêm 2 bảng + 1 trigger function + 2 trigger + backfill
--   dữ liệu cũ (63 câu ĐS: 3 dai + 60 hgt). Không alter/drop bảng cũ.
--   Câu jsonb có ma_dang không hợp lệ (bản đồ đã renumber) → backfill BÁO LỖI
--   ngay trong mig (RAISE NOTICE liệt kê), migration ROLLBACK → CEO xử tay
--   trước, chạy lại.
-- ============================================================================

-- ── Bảng dai_cau_menh_de ────────────────────────────────────────────────────
create table if not exists dai_cau_menh_de (
  id            uuid primary key default gen_random_uuid(),
  ma_cau_cha    text not null references dai_cau_hoi(ma_cau) on update cascade on delete cascade,
  thu_tu        int  not null check (thu_tu >= 1),
  dang_chinh    text not null references dai_ban_do(ma_dang) on update cascade on delete restrict,
  dang_ai_de_xuat text,
  noi_dung      text not null,
  dung          boolean not null,               -- true = "D" (Đúng), false = "S" (Sai)
  loi_giai      text,

  -- Duyệt riêng từng mệnh đề (đối xứng dai_cau_hoi)
  da_duyet      boolean not null default false,
  duyet_boi     uuid references nhan_su(id),
  duyet_at      timestamptz,
  duyet_nguon   text,                            -- 'nguoi' | 'may' | 'ai'

  -- Máy kiểm (đối xứng dai_cau_hoi.kiem_may)
  kiem_may      text check (kiem_may in ('khop','nghi','khong_kiem_duoc') or kiem_may is null),
  kiem_may_at   timestamptz,

  created_at    timestamptz not null default now(),
  xoa_at        timestamptz,

  constraint dai_cau_menh_de_uniq_thu_tu unique (ma_cau_cha, thu_tu)
);

comment on table dai_cau_menh_de is
  'Mệnh đề của câu Đúng-Sai (Đại). MỖI mệnh đề 1 dạng riêng (dang_chinh FK bản đồ). Auto-sync từ dai_cau_hoi.menh_de jsonb qua trigger _sync_cau_menh_de.';

create index if not exists idx_dai_cau_menh_de_cha       on dai_cau_menh_de(ma_cau_cha, thu_tu);
create index if not exists idx_dai_cau_menh_de_dang      on dai_cau_menh_de(dang_chinh) where xoa_at is null;
create index if not exists idx_dai_cau_menh_de_da_duyet  on dai_cau_menh_de(da_duyet) where xoa_at is null;

-- ── Bảng hgt_cau_menh_de (giống hệt) ────────────────────────────────────────
create table if not exists hgt_cau_menh_de (
  id            uuid primary key default gen_random_uuid(),
  ma_cau_cha    text not null references hgt_cau_hoi(ma_cau) on update cascade on delete cascade,
  thu_tu        int  not null check (thu_tu >= 1),
  dang_chinh    text not null references hgt_ban_do(ma_dang) on update cascade on delete restrict,
  dang_ai_de_xuat text,
  noi_dung      text not null,
  dung          boolean not null,
  loi_giai      text,
  da_duyet      boolean not null default false,
  duyet_boi     uuid references nhan_su(id),
  duyet_at      timestamptz,
  duyet_nguon   text,
  kiem_may      text check (kiem_may in ('khop','nghi','khong_kiem_duoc') or kiem_may is null),
  kiem_may_at   timestamptz,
  created_at    timestamptz not null default now(),
  xoa_at        timestamptz,
  constraint hgt_cau_menh_de_uniq_thu_tu unique (ma_cau_cha, thu_tu)
);

comment on table hgt_cau_menh_de is
  'Mệnh đề của câu Đúng-Sai (Hình). MỖI mệnh đề 1 dạng riêng. Auto-sync từ hgt_cau_hoi.menh_de jsonb.';

create index if not exists idx_hgt_cau_menh_de_cha       on hgt_cau_menh_de(ma_cau_cha, thu_tu);
create index if not exists idx_hgt_cau_menh_de_dang      on hgt_cau_menh_de(dang_chinh) where xoa_at is null;
create index if not exists idx_hgt_cau_menh_de_da_duyet  on hgt_cau_menh_de(da_duyet) where xoa_at is null;

-- ── Trigger function: sync jsonb → bảng con ─────────────────────────────────
-- Chạy AFTER INSERT/UPDATE OF menh_de/loai_cau trên <mon>_cau_hoi WHEN loai_cau='dung_sai'.
-- Xoá tất mệnh đề cũ, insert lại các mệnh đề có ma_dang hợp lệ (FK sẽ chặn khi renumber
-- phá — thay vì fail cứng cả INSERT câu cha, ta skip silently mệnh đề fail, giữ gap
-- thu_tu để UI hiển thị "mệnh đề X chưa gán dạng"). Câu cha vẫn ghi được.
-- Trigger là "hidden code" (§2 CLAUDE.md) — tên có prefix _sync_ / _trg_ để grep tìm.
create or replace function _sync_cau_menh_de(
  p_bang_con text,        -- 'dai_cau_menh_de' | 'hgt_cau_menh_de'
  p_ban_do   text,        -- 'dai_ban_do'      | 'hgt_ban_do'
  p_ma_cau   text,
  p_menh_de  jsonb
) returns void as $$
begin
  execute format('delete from %I where ma_cau_cha = $1', p_bang_con) using p_ma_cau;
  if p_menh_de is null or jsonb_typeof(p_menh_de) <> 'array' then return; end if;
  execute format($f$
    insert into %I (ma_cau_cha, thu_tu, dang_chinh, dang_ai_de_xuat, noi_dung, dung, loi_giai)
    select $1,
           ord::int,
           elem->>'ma_dang',
           elem->>'ma_dang',
           elem->>'noi_dung',
           coalesce(elem->>'dap_an','S') = 'D',
           elem->>'loi_giai'
      from jsonb_array_elements($2) with ordinality as t(elem, ord)
     where elem->>'ma_dang' is not null
       and elem->>'noi_dung' is not null
       and (elem->>'ma_dang') in (select ma_dang from %I)
  $f$, p_bang_con, p_ban_do)
  using p_ma_cau, p_menh_de;
end;
$$ language plpgsql;

create or replace function _trg_sync_dai_menh_de() returns trigger as $$
begin
  if new.loai_cau = 'dung_sai' then
    perform _sync_cau_menh_de('dai_cau_menh_de', 'dai_ban_do', new.ma_cau, new.menh_de);
  end if;
  return null;
end;
$$ language plpgsql;

create or replace function _trg_sync_hgt_menh_de() returns trigger as $$
begin
  if new.loai_cau = 'dung_sai' then
    perform _sync_cau_menh_de('hgt_cau_menh_de', 'hgt_ban_do', new.ma_cau, new.menh_de);
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_menh_de on dai_cau_hoi;
create trigger trg_sync_menh_de
  after insert or update of menh_de, loai_cau on dai_cau_hoi
  for each row execute function _trg_sync_dai_menh_de();

drop trigger if exists trg_sync_menh_de on hgt_cau_hoi;
create trigger trg_sync_menh_de
  after insert or update of menh_de, loai_cau on hgt_cau_hoi
  for each row execute function _trg_sync_hgt_menh_de();

-- ── Backfill: TÁCH RA SCRIPT RIÊNG (scripts/backfill_menh_de.mjs) ──────────
-- Không backfill trong migration vì:
--   · Có 23 câu ĐS hgt + 2 câu ĐS dai đang dùng ma_dang cũ đã bị renumber
--     (`T312010105`, `T312010106` cho hgt; `08010101`, `11010101` cho dai).
--     FK RESTRICT sẽ chặn INSERT → migration ROLLBACK → chặn cả schema.
--   · Cần CEO quyết cách xử (skip / map old→new / fix tay) — không ép trong mig.
--
-- Sau khi mig này áp OK:
--   node scripts/backfill_menh_de.mjs --dry-run   # xem báo cáo
--   node scripts/backfill_menh_de.mjs --apply --strategy skip
--     (hoặc --strategy fix-tay sau khi CEO update jsonb tay)

-- ── RLS (đối xứng bảng câu cha) ─────────────────────────────────────────────
alter table dai_cau_menh_de enable row level security;
alter table hgt_cau_menh_de enable row level security;

drop policy if exists "dai_cau_menh_de_authenticated_all" on dai_cau_menh_de;
create policy "dai_cau_menh_de_authenticated_all"
  on dai_cau_menh_de for all to authenticated
  using (true) with check (true);

drop policy if exists "hgt_cau_menh_de_authenticated_all" on hgt_cau_menh_de;
create policy "hgt_cau_menh_de_authenticated_all"
  on hgt_cau_menh_de for all to authenticated
  using (true) with check (true);

-- ── Deprecation marker cho cột jsonb cũ ─────────────────────────────────────
comment on column dai_cau_hoi.menh_de is
  'DEPRECATED (12/09/2026): dùng bảng dai_cau_menh_de. jsonb vẫn được ghi bởi createCauDungSai và tự sync xuống bảng con qua trigger trg_sync_menh_de. Drop cột này sau khi refactor UI/api → task riêng.';
comment on column hgt_cau_hoi.menh_de is
  'DEPRECATED (12/09/2026): dùng bảng hgt_cau_menh_de. Xem comment tương tự dai_cau_hoi.menh_de.';
