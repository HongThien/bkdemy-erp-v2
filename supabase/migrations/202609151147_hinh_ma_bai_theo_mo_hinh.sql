-- Đổi format mã bài Hình: BT.<seq toàn cầu> -> BT.<khoi>.<mh_num>.<stt trong mô hình>
-- Lý do: mã cũ không cho biết bài thuộc mô hình nào -> khó tra. Sau đổi, group theo mã tự thấy mô hình.
-- Phạm vi: mọi khối (6/7/8/9/12) và mọi mô hình có ma dạng MH.<số>.
-- Policy 1a (CEO chốt): bài chuyển mô hình -> mã sinh lại theo mô hình mới. STT không compact khi bài rời đi.
-- Snapshot: bai_test_cau.ma_cau (15 dòng) GIỮ NGUYÊN — snapshot đề đã in là lịch sử, không rewrite.

-- ============================================================
-- 1) Function sinh mã: chạy cả INSERT (mới) và UPDATE mo_hinh_id (chuyển mô hình)
-- ============================================================
CREATE OR REPLACE FUNCTION hinh_baitoan_gen_ma() RETURNS trigger AS $$
DECLARE
  v_khoi text;
  v_mh_num text;
  v_stt int;
  v_should_regen boolean := false;
BEGIN
  -- INSERT: sinh khi ma NULL (cho phép override tay nếu cần)
  IF TG_OP = 'INSERT' THEN
    IF NEW.ma IS NULL THEN v_should_regen := true; END IF;
  -- UPDATE: chỉ sinh lại khi bài chuyển mô hình (policy 1a)
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.mo_hinh_id IS DISTINCT FROM OLD.mo_hinh_id THEN v_should_regen := true; END IF;
  END IF;

  IF NOT v_should_regen THEN RETURN NEW; END IF;

  SELECT mh.khoi, substring(mh.ma FROM 'MH\.(\d+)')
    INTO v_khoi, v_mh_num
  FROM hinh_mo_hinh mh WHERE mh.id = NEW.mo_hinh_id;

  IF v_khoi IS NULL THEN
    RAISE EXCEPTION 'Mô hình (id=%) chưa gán khối — gán khối trước khi tạo/di chuyển bài.', NEW.mo_hinh_id;
  END IF;
  IF v_mh_num IS NULL THEN
    RAISE EXCEPTION 'Mô hình (id=%) có mã "% " không đúng dạng "MH.<số>" — chuẩn hoá mã mô hình trước.', NEW.mo_hinh_id, (SELECT ma FROM hinh_mo_hinh WHERE id=NEW.mo_hinh_id);
  END IF;

  -- STT = max STT trong mô hình đó + 1 (bỏ qua chính dòng đang update)
  SELECT COALESCE(MAX(CAST(substring(bt.ma FROM '^BT\.\d+\.\d+\.(\d+)$') AS int)), 0) + 1
    INTO v_stt
  FROM hinh_baitoan bt
  WHERE bt.mo_hinh_id = NEW.mo_hinh_id
    AND bt.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND bt.ma ~ '^BT\.\d+\.\d+\.\d+$';

  NEW.ma := 'BT.' || lpad(v_khoi, 2, '0') || '.' || v_mh_num || '.' || lpad(v_stt::text, 2, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: mở rộng cho cả UPDATE OF mo_hinh_id
DROP TRIGGER IF EXISTS hinh_baitoan_gen_ma_trg ON hinh_baitoan;
CREATE TRIGGER hinh_baitoan_gen_ma_trg
  BEFORE INSERT OR UPDATE OF mo_hinh_id ON hinh_baitoan
  FOR EACH ROW EXECUTE FUNCTION hinh_baitoan_gen_ma();

-- ============================================================
-- 2) Backfill mã cho toàn bộ bài hiện có
--    Thứ tự STT trong mỗi mô hình: theo `ma` cũ (BT.xx.036 < BT.xx.037 …) — stable, gần với thứ tự tạo.
-- ============================================================
WITH ranked AS (
  SELECT bt.id,
         mh.khoi,
         substring(mh.ma FROM 'MH\.(\d+)') AS mh_num,
         row_number() OVER (
           PARTITION BY bt.mo_hinh_id
           ORDER BY bt.ma NULLS LAST, bt.created_at, bt.id
         ) AS stt
  FROM hinh_baitoan bt
  JOIN hinh_mo_hinh mh ON mh.id = bt.mo_hinh_id
  WHERE mh.khoi IS NOT NULL
    AND mh.ma ~ '^MH\.\d+$'
)
UPDATE hinh_baitoan bt
SET ma = 'BT.' || lpad(r.khoi, 2, '0') || '.' || r.mh_num || '.' || lpad(r.stt::text, 2, '0'),
    updated_at = now()
FROM ranked r
WHERE bt.id = r.id;

-- ============================================================
-- 3) Sanity check: mọi bài của mô hình có khoi + ma đúng dạng phải có ma mới đúng dạng
-- ============================================================
DO $$
DECLARE v_bad int;
BEGIN
  SELECT count(*) INTO v_bad
  FROM hinh_baitoan bt
  JOIN hinh_mo_hinh mh ON mh.id = bt.mo_hinh_id
  WHERE mh.khoi IS NOT NULL
    AND mh.ma ~ '^MH\.\d+$'
    AND bt.ma !~ '^BT\.\d+\.\d+\.\d+$';
  IF v_bad > 0 THEN
    RAISE EXCEPTION 'Backfill để sót % bài chưa đúng dạng BT.xx.xxx.xx — huỷ transaction.', v_bad;
  END IF;
END $$;

-- ============================================================
-- 4) Sequence hinh_baitoan_seq — KHÔNG drop (giữ để rollback nhanh nếu cần).
--    Trigger mới không dùng nó, sẽ orphan lành.
-- ============================================================
COMMENT ON SEQUENCE hinh_baitoan_seq IS 'DEPRECATED sau mig 202609151147 — trigger sinh mã bằng MAX+1 trong mô hình, không dùng seq này nữa. Giữ để có thể rollback.';
