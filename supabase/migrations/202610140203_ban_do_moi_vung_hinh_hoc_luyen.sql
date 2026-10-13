-- ============================================================================
-- 202610140203 — ban_do_moi_vung_hinh_hoc_luyen   (spec-hinh-cay-nhanh.md §10)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "chọn Chủ đề Hình và chọn Hình — chưa có phân biệt hình học và hình luyện; chọn hình luyện
--   giao diện không đổi theo mà vẫn giống đại số". Vùng của chủ đề (dai_bdm_chu_de.nhanh) chỉ có MỘT chữ
--   'hinh'. Tách thành 'hinh_hoc' · 'hinh_luyen' để Bản đồ mới biết phải mở KHUÔN nào (3 khuôn — §10).
--   'hinh' GIỮ LẠI làm giá trị cũ: đang có 2 chủ đề (K7 "Đường thẳng song song", K8 "Hình chữ nhật trong
--   tam giác vuông") — KHÔNG tự đoán chúng là Học hay Luyện (§1.5 thà bỏ trống còn hơn đánh sai); màn hỏi người chọn.
--   Hình–Học 3 tầng: chủ đề (chương) → bài học → bài tập ⇒ bài học cần biết mình thuộc chủ đề nào:
--   thêm hinh_hoc_bai.chu_de_id (NULL = chưa xếp chủ đề; không phải "chưa đo").
--
-- MẤT GÌ: không. CHECK được NỚI (thêm 2 giá trị), không dòng nào bị đổi.
-- ============================================================================
alter table public.dai_bdm_chu_de drop constraint if exists dai_bdm_chu_de_nhanh_check;
alter table public.dai_bdm_chu_de
  add constraint dai_bdm_chu_de_nhanh_check check (nhanh in ('toan', 'hgt', 'hinh', 'hinh_hoc', 'hinh_luyen'));
comment on column public.dai_bdm_chu_de.nhanh is
  'Vùng kiến thức ⇒ KHUÔN màn của Bản đồ mới: toan/hgt = 4 tầng (chuyên đề·nhóm·dạng) · hinh_hoc = bài học → bài tập (hinh_hoc_*) · hinh_luyen = cây nhánh mô hình (hinh_mo_hinh…). ''hinh'' = giá trị CŨ, chưa chọn Học/Luyện.';

alter table public.hinh_hoc_bai
  add column if not exists chu_de_id text references public.dai_bdm_chu_de(id) on delete set null;
comment on column public.hinh_hoc_bai.chu_de_id is 'Chủ đề (chương) của bài học trong Bản đồ mới — vùng hinh_hoc. NULL = chưa xếp chủ đề.';
create index if not exists hinh_hoc_bai_chu_de_idx on public.hinh_hoc_bai(chu_de_id) where chu_de_id is not null;
