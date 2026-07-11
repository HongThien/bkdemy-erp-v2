-- 0094 — bt_grades: chấm bài BT (bổ trợ tự luyện), 1 HS × N câu (không có buổi/session).
-- Không tái dùng gami_session_problems/gami_grades (buộc buoi_hoc_id NOT NULL, thiết kế cho N HS ×
-- N câu / 1 buổi). BT luôn đúng 1 HS × N câu (1 tai_lieu) → 1 bảng đơn giản đủ dùng.
-- ma_dang DENORMALIZE lúc chấm (từ tai_lieu_phan.ref_ma của phan chứa câu đó) — mastery đọc thẳng,
-- không phải join lại tai_lieu_phan/tai_lieu_cau mỗi lần suy động.
-- result dùng CHUNG vocabulary với gami_grades (0031_buoi_hoc_va_gami.sql: correct/partial/wrong).
-- ma_cau KHÔNG FK — câu tách bảng theo môn (dai_cau_hoi/khtn_cau_hoi…), giống tai_lieu_cau.ma_cau
-- (xem 0050_khtn_kho.sql đã bỏ FK này với đúng lý do).
create table if not exists bt_grades (
  id uuid primary key default gen_random_uuid(),
  tai_lieu_id uuid not null references tai_lieu(id) on delete cascade,
  ma_cau text not null,
  ma_dang text not null,
  result text not null check (result in ('correct','partial','wrong')),
  graded_by uuid,
  graded_at timestamptz not null default now(),
  unique (tai_lieu_id, ma_cau)
);
alter table bt_grades enable row level security;
create policy bt_grades_member_all on bt_grades for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on bt_grades to authenticated;
