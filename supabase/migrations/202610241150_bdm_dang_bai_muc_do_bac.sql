-- ============================================================================
-- 202610241150 — bdm_dang_bai_muc_do_bac
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Dạng bài bản đồ mới (dai_bdm_dang_bai, NDB…) chưa có ĐỘ KHÓ (muc_do 1–5; 1–3 cơ bản, 4–5 nâng cao) và
--   HỆ thấp nhất được học (bac_toi_thieu S/A/B/C/D) như dạng bản đồ cũ (dai_ban_do / hgt_ban_do) ⇒ Report PH +
--   Tổng quan KQHT (tách %Cơ bản/%Nâng cao) phải giữ bản đồ cũ, lọc Cơ bản/Nâng cao ở KQHT rỗng với NDB
--   (PLAN-mastery-ban-do-moi.md). Thêm 2 thuộc tính — KHÔNG đổi cây (tên/thứ tự/cha do CEO).
--   NULL = CHƯA GÁN (bảng định nghĩa, không phải "chưa đo"). Giá trị điền bằng
--   kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs: chỉ ghi dạng bài mà MỌI câu đều thừa hưởng cùng một giá trị cũ;
--   còn lại chờ Thùy duyệt (HTML cùng thư mục).
--   Lịch sử: trigger trg_bdm_dang_bai_log (_bdm_ghi_log, to_jsonb cả dòng) tự ghi cũ/mới vào dai_bdm_log — không cần trigger mới.
--   View bdm_ban_do: giữ nguyên mọi cột + thứ tự + kiểu, chỉ thay NULL::smallint / NULL::text bằng 2 cột thật.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 2 cột (NULL), thay thân view (cùng cột, cùng kiểu).
-- ============================================================================

alter table public.dai_bdm_dang_bai
  add column if not exists muc_do smallint,
  add column if not exists bac_toi_thieu text;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'dai_bdm_dang_bai_muc_do_check') then
    alter table public.dai_bdm_dang_bai add constraint dai_bdm_dang_bai_muc_do_check check (muc_do between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'dai_bdm_dang_bai_bac_toi_thieu_check') then
    alter table public.dai_bdm_dang_bai add constraint dai_bdm_dang_bai_bac_toi_thieu_check
      check (bac_toi_thieu in ('S','A','B','C','D'));
  end if;
end $$;

comment on column public.dai_bdm_dang_bai.muc_do is
  'Độ khó 1–5 (1–3 cơ bản, 4–5 nâng cao) như dai_ban_do.muc_do. NULL = chưa gán. Suy từ bản đồ cũ: kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs';
comment on column public.dai_bdm_dang_bai.bac_toi_thieu is
  'Hệ thấp nhất được học dạng bài (S/A/B/C/D) như dai_ban_do.bac_toi_thieu. NULL = chưa gán.';

create or replace view public.bdm_ban_do as
 SELECT db.id AS ma_dang,
    cd.khoi,
    cd.id AS ma_chu_de,
    cd.ten AS ten_chu_de,
    ch.id AS ma_chuyen_de,
    ch.ten AS ten_chuyen_de,
    db.ten AS ten_dang,
    db.muc_do AS muc_do,
    db.created_at,
    db.bac_toi_thieu AS bac_toi_thieu,
    db.mo_ta AS mo_ta_ngan,
    NULL::timestamp with time zone AS xoa_at,
    NULL::text AS gop_vao,
    n.id AS ma_nhom,
    n.ten AS ten_nhom,
    cd.thu_tu AS thu_tu_chu_de,
    o.thu_tu AS thu_tu_chuyen_de,
    n.thu_tu AS thu_tu_nhom,
    db.thu_tu AS thu_tu_dang,
    cd.nhanh AS nhanh_bdm
   FROM dai_bdm_dang_bai db
     JOIN dai_bdm_nhom n ON n.id = db.nhom_id
     JOIN dai_bdm_chu_de cd ON cd.id = n.chu_de_id
     LEFT JOIN dai_bdm_chuyen_de ch ON ch.id = n.chuyen_de_id
     LEFT JOIN dai_bdm_o o ON o.chu_de_id = n.chu_de_id AND o.chuyen_de_id = n.chuyen_de_id
  WHERE cd.nhanh = ANY (ARRAY['toan'::text, 'hgt'::text]);
