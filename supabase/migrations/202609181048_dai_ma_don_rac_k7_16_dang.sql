-- ============================================================================
-- 202609181048 — dai_ma_don_rac_k7_16_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09/2026 — bước 3 chiến dịch chuẩn hoá mã bản đồ Đại):
-- fn_dai_kiem_ma() báo 16 dạng K7 lệch chuẩn (11 dòng chưa có tiền tố T1 sinh
-- SAU migration 202608141259 + 5 dòng nối chuỗi do bug `maxOrd` nuốt cả phần vị
-- trí — đã fix ở `src/lib/kho/api.ts` bước 2). Sau bước 2 nguồn bug bị chặn, nay
-- dọn 16 dòng rác hiện có để kho về đúng bất biến §1.6 + §2.0.
--
-- MAPPING 27 dòng (dump bằng `scripts/_dump_rac_k7_va_map.mjs` 18/09):
--   2 chủ đề:
--     07702           → T10702     (Số thực)                  — K7 tiếp T10700, T10701
--     T107703         → T10703     (Đề thi đầu vào M9)
--   9 chuyên đề (STT theo thứ tự hiện có trong chủ đề đích):
--     0770201         → T1070201   (Số thập phân vô hạn tuần hoàn)
--     07702202        → T1070202   (Số vô tỉ. Căn bậc hai số học)
--     077022203       → T1070203   (Tập hợp số thực. Giá trị tuyệt đối)
--     0770222204      → T1070204   (GTLN-GTNN của biểu thức)
--     T10770301       → T1070301   (Tính chất của Số hữu tỉ)
--     T107703302      → T1070302   (Các phép toán với Số hữu tỉ)
--     T1077033303     → T1070303   (Luỹ thừa của Số hữu tỉ)
--     T10770333304    → T1070304   (Hình học)
--     T107703333305   → T1070305   (Nâng cao)
--   16 dạng: xem bảng _rac_map.dang bên dưới.
--
-- CASCADE (7 FK on update cascade — kiểm bằng `_check_fk_va_textref_madang.mjs`):
--   dai_cau_hoi.dang_chinh (~600 rows), dai_cau_menh_de.dang_chinh, dai_cum_bai.ma_dang,
--   dai_dang_ly_thuyet.ma_dang, dai_dang_thuoc_tinh.ma_dang, dai_dang_tien_de (2 cột).
--
-- TEXT-REF không FK (update thủ công, cùng mapping):
--   dai_chuyen_de_ly_thuyet (4 rows), gami_session_problems (290), ca_test_cau (196),
--   bai_test_cau (13), tu_luyen_dang_lan (13), buoi_danh_gia_dang (5), bo_tro_duoi_dang (3),
--   canh_bao_yeu (1). Views (v_*) tự update theo underlying.
--
-- TRIGGER `trg_log_doi_dang` on dai_cau_hoi/dai_cau_menh_de: sẽ fire ~600 lần khi
-- cascade → sinh log "backfill" GIẢ (đây là RENAME, không phải chuyển câu sang dạng
-- khác). DISABLE trong scope migration, ENABLE lại cuối. Migrate.mjs wrap 1 transaction
-- ⇒ nếu migration fail, ROLLBACK trả nguyên trigger.
--
-- MẤT GÌ: KHÔNG xoá gì. Đổi giá trị mã của 16 dạng + 9 chuyên đề + 2 chủ đề trong
-- dai_ban_do (cascade tự chạy) + update text-ref. Migration idempotent chỉ khi CHƯA
-- ÁP — chạy lại sau khi áp thành công sẽ raise vì mã cũ đã biến mất.
-- ============================================================================

-- ── 0. Bảng mapping tạm (temp local trong transaction) ──────────────────────
create temp table _rac_map (loai text, ma_cu text, ma_moi text, primary key (loai, ma_cu)) on commit drop;

insert into _rac_map values
  -- chủ đề
  ('chu_de',   '07702',         'T10702'),
  ('chu_de',   'T107703',       'T10703'),
  -- chuyên đề
  ('chuyen_de','0770201',       'T1070201'),
  ('chuyen_de','07702202',      'T1070202'),
  ('chuyen_de','077022203',     'T1070203'),
  ('chuyen_de','0770222204',    'T1070204'),
  ('chuyen_de','T10770301',     'T1070301'),
  ('chuyen_de','T107703302',    'T1070302'),
  ('chuyen_de','T1077033303',   'T1070303'),
  ('chuyen_de','T10770333304',  'T1070304'),
  ('chuyen_de','T107703333305', 'T1070305'),
  -- dạng
  ('dang','077020101',           'T107020101'),
  ('dang','0770201102',          'T107020102'),
  ('dang','07702011103',         'T107020103'),
  ('dang','0770220201',          'T107020201'),
  ('dang','07702202202',         'T107020202'),
  ('dang','077022022203',        'T107020203'),
  ('dang','07702220301',         'T107020301'),
  ('dang','07702220320302',      'T107020302'),
  ('dang','07702220320320303',   'T107020303'),
  ('dang','077022220401',        'T107020401'),
  ('dang','0770222204220402',    'T107020402'),
  ('dang','T1077030101',         'T107030101'),
  ('dang','T10770330201',        'T107030201'),
  ('dang','T107703330301',       'T107030301'),
  ('dang','T1077033330401',      'T107030401'),
  ('dang','T10770333330501',     'T107030501');

-- ── 1. Kiểm ma_moi CHƯA tồn tại (không đè lên dạng đúng chuẩn đang có) ──────
do $$
declare n int; sample text;
begin
  select count(*), string_agg(m.ma_moi, ', ') into n, sample
    from _rac_map m
   where m.loai = 'dang' and exists (select 1 from dai_ban_do b where b.ma_dang = m.ma_moi);
  if n > 0 then raise exception 'ma_moi dạng đã tồn tại (%): %', n, sample; end if;

  select count(*), string_agg(m.ma_moi, ', ') into n, sample
    from _rac_map m
   where m.loai = 'chuyen_de' and exists (select 1 from dai_ban_do b where b.ma_chuyen_de = m.ma_moi);
  if n > 0 then raise exception 'ma_moi chuyên đề đã tồn tại (%): %', n, sample; end if;

  select count(*), string_agg(m.ma_moi, ', ') into n, sample
    from _rac_map m
   where m.loai = 'chu_de' and exists (select 1 from dai_ban_do b where b.ma_chu_de = m.ma_moi);
  if n > 0 then raise exception 'ma_moi chủ đề đã tồn tại (%): %', n, sample; end if;
end $$;

-- ── 2. DISABLE trigger log-đổi-dạng — cascade ~600 rows KHÔNG phải rename câu → dạng ──
alter table public.dai_cau_hoi     disable trigger trg_log_doi_dang;
alter table public.dai_cau_menh_de disable trigger trg_log_doi_dang;

-- ── 3. Update dai_ban_do: dạng + chuyên đề + chủ đề (FK cascade tự update bảng con) ──
-- Postgres UPDATE FROM không cho JOIN dùng target-alias trong ON — dùng 3 join
-- trong FROM và where-clause ref chính bảng target (không alias).
update public.dai_ban_do set
  ma_dang      = md.ma_moi,
  ma_chuyen_de = mcd.ma_moi,
  ma_chu_de    = mccd.ma_moi
from _rac_map md, _rac_map mcd, _rac_map mccd
where md.loai   = 'dang'      and md.ma_cu   = public.dai_ban_do.ma_dang
  and mcd.loai  = 'chuyen_de' and mcd.ma_cu  = public.dai_ban_do.ma_chuyen_de
  and mccd.loai = 'chu_de'    and mccd.ma_cu = public.dai_ban_do.ma_chu_de;

-- Kiểm đủ 16 dòng dạng đã update
do $$
declare n int;
begin
  select count(*) into n from dai_ban_do where ma_dang like 'T1070%01' or ma_dang like 'T1070%02' or ma_dang like 'T1070%03' or ma_dang like 'T1070%04' or ma_dang like 'T1070%05';
  raise notice 'Sau update dai_ban_do: đếm sơ bộ K7 chủ đề 02/03 = % (kỳ vọng ≥ 16)', n;
end $$;

-- ── 4. Update text-ref: dai_chuyen_de_ly_thuyet (PK text, không FK cascade) ──
update public.dai_chuyen_de_ly_thuyet lt set ma_chuyen_de = m.ma_moi
from _rac_map m where m.loai = 'chuyen_de' and m.ma_cu = lt.ma_chuyen_de;

-- ── 5. Update text-ref bảng đo/luyện (cột ma_dang, không FK) ────────────────
-- Chỉ đụng dòng có ma_dang thuộc mapping — an toàn cho bảng lớn.
do $$
declare r record; n int;
begin
  for r in select * from (values
      ('gami_session_problems'), ('ca_test_cau'), ('bai_test_cau'),
      ('tu_luyen_dang_lan'), ('buoi_danh_gia_dang'),
      ('bo_tro_duoi_dang'), ('canh_bao_yeu')
    ) v(tbl) loop
    execute format(
      'update public.%I t set ma_dang = m.ma_moi from _rac_map m where m.loai = ''dang'' and m.ma_cu = t.ma_dang',
      r.tbl
    );
    get diagnostics n = row_count;
    raise notice '  %-25s → % row đã update', r.tbl, n;
  end loop;
end $$;

-- ── 6. ENABLE lại trigger log ───────────────────────────────────────────────
alter table public.dai_cau_hoi     enable trigger trg_log_doi_dang;
alter table public.dai_cau_menh_de enable trigger trg_log_doi_dang;

-- ── 7. VERIFY cuối: fn_dai_kiem_ma() phải trả 0 dòng lệch ───────────────────
do $$
declare n int; sample text;
begin
  select count(*), string_agg(distinct ma_dang, ', ') into n, sample from fn_dai_kiem_ma();
  if n > 0 then raise exception 'Sau migration vẫn còn % dòng lệch fn_dai_kiem_ma(): %', n, sample; end if;
  raise notice '✓ fn_dai_kiem_ma() = 0 dòng lệch. Kho Đại đã sạch.';
end $$;
