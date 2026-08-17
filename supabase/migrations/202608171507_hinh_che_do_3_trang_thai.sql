-- ============================================================================
-- 202608171507 — HÌNH VẼ: 2 trạng thái → 3 trạng thái (builder giáo trình Hình)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 17/08): "ko phải là có hình hay ko mà là 3 trạng thái: hiện hình vẽ, ko hiện hình vẽ
--   nhưng có ô trống vẽ hình, và cuối cùng là không có hình vẽ."
--   Hiện tại chỉ có cờ `an_de` (boolean) ⇒ diễn đạt được 2 ý, và ý thứ 3 KHÔNG nói ra được: bài có
--   hình trong kho nhưng người soạn muốn in mà KHÔNG hình, KHÔNG ô vẽ (vd đề đã tự mô tả đủ, hoặc
--   tiết kiệm giấy). Tệ hơn: `SoanTaiLieu` đang suy `anDe: anDe || !anhDe` ⇒ bài KHÔNG có hình bị TỰ
--   ĐỘNG hiểu là "chừa ô vẽ", không có đường nào để nói "thôi khỏi".
--
-- 3 trạng thái (cột mới `hinh_che_do`):
--   'hien'    — in hình vẽ (như an_de = false + có ảnh)
--   'o_trong' — không in hình, chừa KHUNG TRỐNG cho HS tự vẽ (như an_de = true)
--   'khong'   — không hình, không khung. MỚI, trước đây không diễn đạt được.
--
-- ⭐ GIỮ NGUYÊN cột `an_de`, không xoá (luật xoá + phiên khác có thể đang đọc). App ghi CẢ HAI:
--   `an_de = (hinh_che_do <> 'hien')` — nên mọi đường code cũ còn chạy đúng như trước.
--   Khi nào chắc không còn ai đọc `an_de` thì mới bàn chuyện xoá.
--
-- Backfill: an_de=true → 'o_trong' · an_de=false → 'hien'.
-- ⚠ 'hien' mà bài KHÔNG có ảnh thì lúc IN vẫn phải rơi về khung trống (giữ đúng hành vi hôm nay —
--   hình học vốn hay bắt HS tự vẽ). Quy tắc đó nằm ở tầng in, KHÔNG nằm ở dữ liệu: chỉ 'khong' mới
--   là "dứt khoát không vẽ gì".
--
-- MẤT GÌ: không. Thêm 1 cột + 1 CHECK. Không xoá/sửa cột nào đang có.
-- ============================================================================

alter table hinh_gt_bai add column if not exists hinh_che_do text;

update hinh_gt_bai
   set hinh_che_do = case when an_de then 'o_trong' else 'hien' end
 where hinh_che_do is null;

alter table hinh_gt_bai alter column hinh_che_do set default 'hien';
alter table hinh_gt_bai alter column hinh_che_do set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'hinh_gt_bai_hinh_che_do_ck') then
    alter table hinh_gt_bai add constraint hinh_gt_bai_hinh_che_do_ck
      check (hinh_che_do in ('hien', 'o_trong', 'khong'));
  end if;
end $$;

-- KIỂM: backfill khớp cờ cũ, không dòng nào lệch.
do $$
declare n_lech int; n int;
begin
  select count(*) into n_lech from hinh_gt_bai
   where hinh_che_do <> (case when an_de then 'o_trong' else 'hien' end);
  if n_lech > 0 then
    raise exception 'BACKFILL LỆCH: % dòng có hinh_che_do không khớp an_de. Rollback.', n_lech;
  end if;
  select count(*) into n from hinh_gt_bai;
  raise notice 'hinh_gt_bai: % dòng, hinh_che_do khớp an_de 100%% ✓', n;
end $$;
