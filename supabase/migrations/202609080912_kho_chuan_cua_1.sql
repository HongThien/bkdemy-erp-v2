-- ============================================================================
-- 202609080912 — kho_chuan_cua_1
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-kho-chuan.md §1 + §4 bước 1 — CEO chốt: "từ giờ câu mới phải qua duyệt mới được dùng"):
--   Cờ `da_duyet` có 60/17.743 câu ký và KHÔNG chỗ chọn câu nào lọc theo nó — cửa duyệt là cờ trang trí.
--   "Vào kho chuẩn" giờ định nghĩa bằng MỘT hàm SQL `_kho_cau_chuan` (không phải bằng cờ rời rạc):
--     · câu MỚI (created_at ≥ NGÀY BẬT)  → chỉ dùng khi da_duyet = true, không ngoại lệ, không phân biệt đường vào;
--     · câu CŨ                            → tạm dùng tới khi được quét; máy/AI NGHI đáp số ⇒ rút khỏi HS ngay.
--   Hàm được vật hoá thành cột generated `kho_chuan` trên từng bảng câu để (a) PostgREST lọc được `.eq('kho_chuan', true)`
--   (client không gọi được hàm trong filter) và (b) mọi function chọn câu dùng chung 1 nguồn `c.kho_chuan`.
--   ⚠ Cột generated STORED không tự tính lại khi ĐỔI THÂN HÀM (bước 6 spec: bỏ vế "câu cũ tạm dùng") — migration
--   bước 6 phải DROP rồi ADD lại cột `kho_chuan` trên 3 bảng, không chỉ `create or replace function`.
--   Cột `kiem_may*` = kết quả máy/AI kiểm đáp số (mức A/B spec §2); `duyet_nguon` = ai ký da_duyet (người/máy/AI) —
--   suy bằng TRIGGER khi da_duyet đổi (CLAUDE.md §4: app không tự nhớ ghi), nên mọi đường duyệt cũ (DangHub, DungSaiBank,
--   Duyệt lời giải AI, promote clone) tự có 'nguoi' mà không sửa client.
--   Cắm vào chỗ chọn câu phía DB: `_kho_dk_online_sql` (điều kiện ứng viên chung của tu_luyen_sinh + _btyeu_chon_cau =
--   tự luyện · bổ trợ yếu · retest) — thêm `c.kho_chuan and`. Phía client: listCauByDang (soạn ET/BTVN/giáo trình/mã đề)
--   lọc `kho_chuan` mặc định; DangHub (màn kho) xem tất cả.
--   NGÀY BẬT = lúc áp migration này (VN): 2026-09-08 09:12+07.
--
-- MẤT GÌ: không — chỉ thêm cột/hàm/trigger/index; `_kho_dk_online_sql` SIẾT thêm điều kiện (câu chưa chuẩn không còn
--   được chọn cho HS — đúng chủ đích).
-- ============================================================================

-- ── 1) Cột §1 trên 3 bảng câu (đối xứng môn — CLAUDE.md §1.6) ──────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi'] loop
    execute format($q$
      alter table %1$I
        add column if not exists kiem_may     text check (kiem_may in ('khop', 'nghi', 'khong_kiem_duoc')),
        add column if not exists kiem_may_at  timestamptz,
        add column if not exists kiem_may_boi text check (kiem_may_boi in ('mcq-auto', 'claude_code', 'nguoi')),
        add column if not exists kiem_may_ghi text,
        add column if not exists duyet_nguon  text check (duyet_nguon in ('nguoi', 'may', 'ai'))
    $q$, t);
  end loop;
end $$;

comment on column dai_cau_hoi.kiem_may     is 'Kết quả máy/AI kiểm ĐÁP SỐ: khop | nghi (rút khỏi HS) | khong_kiem_duoc. NULL = chưa kiểm.';
comment on column dai_cau_hoi.kiem_may_boi is 'mcq-auto (bộ tính máy) | claude_code (Claude giải lại) | nguoi';
comment on column dai_cau_hoi.kiem_may_ghi is 'vd "máy 37/24 ≠ kho 13/16" — chỉ báo, KHÔNG sửa đáp số kho (spec-kho-chuan §2)';
comment on column dai_cau_hoi.duyet_nguon  is 'Ai ký da_duyet: nguoi | may | ai. Trigger tự điền nguoi khi thiếu; NULL khi da_duyet=false.';

-- ── 2) Định nghĩa "vào kho chuẩn" — 1 hàm, immutable (để làm generated column) ──────────────────────────────
-- NGÀY BẬT nằm thẳng trong thân hàm (literal có múi giờ ⇒ không phụ thuộc session TZ). Bước 6 đổi thân hàm ⇒ DROP/ADD lại kho_chuan.
create or replace function public._kho_cau_chuan(p_da_duyet boolean, p_kiem_may text, p_created_at timestamptz)
returns boolean language sql immutable as $$
  select coalesce(p_da_duyet, false)
      or (p_kiem_may is distinct from 'nghi' and p_created_at < '2026-09-08 09:12:00+07'::timestamptz)
$$;
comment on function public._kho_cau_chuan(boolean, text, timestamptz) is
  'Kho chuẩn (spec-kho-chuan §1): câu mới (≥ NGÀY BẬT 2026-09-08 09:12+07) cần da_duyet; câu cũ tạm dùng trừ khi máy/AI NGHI. Vật hoá = cột kho_chuan.';

do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi'] loop
    execute format($q$
      alter table %1$I add column if not exists kho_chuan boolean
        generated always as (public._kho_cau_chuan(da_duyet, kiem_may, created_at)) stored
    $q$, t);
    -- Chỗ chọn câu luôn lọc (dang_chinh, kho_chuan, xoa_at is null) → index partial cho đúng ca đó.
    execute format('create index if not exists %1$s_kho_chuan_dang on %1$I (dang_chinh) where kho_chuan and xoa_at is null', t);
  end loop;
end $$;

-- ── 3) duyet_nguon suy bằng trigger — không đường duyệt nào quên được ─────────────────────────────────────────
create or replace function public._kho_cau_duyet_nguon() returns trigger
language plpgsql as $$
begin
  if new.da_duyet then
    if new.duyet_nguon is null then new.duyet_nguon := 'nguoi'; end if;   -- script máy/AI PHẢI set 'may'/'ai' tường minh
    if new.duyet_at is null then new.duyet_at := now(); end if;
  else
    new.duyet_nguon := null;                                             -- bỏ duyệt = về "chưa duyệt", không giữ nguồn cũ
  end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi'] loop
    execute format('drop trigger if exists trg_kho_cau_duyet_nguon on %I', t);
    execute format($q$
      create trigger trg_kho_cau_duyet_nguon before insert or update of da_duyet, duyet_nguon on %1$I
        for each row execute function public._kho_cau_duyet_nguon()
    $q$, t);
    -- Backfill 60 câu người đã ký trước migration (trigger chỉ chạy từ giờ).
    execute format('update %I set duyet_nguon = ''nguoi'' where da_duyet and duyet_nguon is null', t);
  end loop;
end $$;

-- ── 4) Cắm vào chỗ chọn câu phía DB: điều kiện ứng viên chung (tự luyện · bổ trợ yếu · retest) ──────────────
-- Giữ nguyên phần "chấm online được" của mig 202609080259; thêm `c.kho_chuan and` bọc ngoài.
-- Alias bảng câu = c (như trước). Hàm này là chuỗi SQL nhúng vào format() của tu_luyen_sinh / _btyeu_chon_cau.
create or replace function public._kho_dk_online_sql(p_cautbl text) returns text
language sql stable as $$
  select '(c.kho_chuan and ((c.loai_cau in (''trac_nghiem'',''tra_loi_ngan'') and c.dap_an is not null)'
      || ' or (c.loai_cau = ''dung_sai'' and jsonb_array_length(coalesce(c.menh_de,''[]''::jsonb)) >= 2)'
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || '))'
$$;
comment on function public._kho_dk_online_sql(text) is
  'Điều kiện ỨNG VIÊN chọn câu cho HS (alias c): KHO CHUẨN (kho_chuan) và chấm online được (TN/TLN có đáp án · ĐS ≥2 mệnh đề · có form TN đã duyệt).';
