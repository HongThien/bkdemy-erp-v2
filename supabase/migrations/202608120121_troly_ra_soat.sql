-- ============================================================================
-- 202608120121 — troly_ra_soat
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Lượt 1 của Trợ lý AI KHÔNG sinh ra để máy đúng, mà để MOI LUẬT RA THÀNH DỮ LIỆU.
--   Hệ hiện không biết lớp nào bắt buộc làm "đánh giá sau buổi" / "chấm bài trên lớp"
--   (CEO 12/08: "không bắt buộc, do quản lý chưa chặt vì ERP đang test liên tục").
--   ⇒ Với một buổi có `danh_gia_xong_at IS NULL`, hệ KHÔNG phân biệt nổi ba khả năng:
--        ① việc thật, chưa làm        ② lớp này vốn không làm khâu đó
--        ③ đã làm nhưng không ghi vào ERP
--   Không phân biệt được thì mọi con số tồn đọng đều vô nghĩa, và AI đọc vào chỉ có thể
--   nói "tôi không biết" (đúng doc §4, nhưng vô dụng).
--
--   Bảng này là chỗ NGƯỜI phân xử từng mục, và phán quyết đó CHÍNH LÀ dữ liệu đang thiếu:
--     · gom `lop_khong_lam` theo lớp  → nguồn dựng cờ must-exist theo lớp (việc kế tiếp)
--     · đếm `lam_ngoai_he`            → đo lỗ hổng GHI NHẬN (khác hẳn lỗ hổng THỰC THI)
--     · `thieu_that`                  → tồn đọng thật, mới là thứ đáng nhắc
--   Đây mới đúng nghĩa doc §10 "dò lỗ hổng dữ liệu ERP": không phải phát hiện ra thiếu
--   (đã biết rồi), mà là THU ĐƯỢC cái thiếu.
--
--   Khoá theo (buổi × khâu) chứ không theo lớp: phán quyết có thể khác nhau giữa hai buổi
--   cùng lớp (vd nghỉ lễ, dạy thay). Quy luật theo lớp là thứ SUY RA SAU từ nhiều dòng,
--   không phải thứ giả định trước — giả định trước là quay lại đúng lỗi must-exist đóng cứng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Bảng mới hoàn toàn, không đụng bảng nào đang có.
--   `drop policy if exists` chỉ để idempotent (migrate chạy lại file này an toàn).
-- ============================================================================

create table if not exists troly_ra_soat (
  id          uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  tab         text not null,
  ket_luan    text not null,
  ghi_chu     text,
  nguoi       uuid,
  created_at  timestamptz not null default now()
);

-- 1 phán quyết cho mỗi (buổi × khâu) — rà lại thì ĐÈ, không đẻ dòng thứ hai.
-- (Cột `onConflict` mà lib/troly.ts dùng khi upsert.)
create unique index if not exists troly_ra_soat_buoi_tab_uq on troly_ra_soat (buoi_hoc_id, tab);

-- CHECK: cột text KHÔNG tự nói tập giá trị hợp lệ (CLAUDE §2.1 — đã dính 2 lần).
-- Thêm giá trị mới vào union type TS thì PHẢI có migration nới CHECK đi kèm.
alter table troly_ra_soat drop constraint if exists troly_ra_soat_tab_ck;
alter table troly_ra_soat add constraint troly_ra_soat_tab_ck
  check (tab = any (array['danhgia', 'ingame']));

alter table troly_ra_soat drop constraint if exists troly_ra_soat_ket_luan_ck;
alter table troly_ra_soat add constraint troly_ra_soat_ket_luan_ck
  check (ket_luan = any (array['thieu_that', 'lop_khong_lam', 'lam_ngoai_he']));

comment on table troly_ra_soat is
  'Phán quyết của NGƯỜI cho từng (buổi × khâu) khi rà soát tồn đọng — lượt hiệu chuẩn Trợ lý AI. thieu_that = việc thật chưa làm · lop_khong_lam = lớp này vốn không làm khâu đó (nguồn dựng cờ must-exist theo lớp) · lam_ngoai_he = đã làm nhưng không ghi vào ERP (lỗ hổng ghi nhận).';

-- RLS: gate thành viên, khớp khuôn 116 bảng còn lại (`la_thanh_vien()`).
-- ⚠ Đây KHÔNG phải rào theo vai — mọi nhân sự đọc/ghi được. Lượt 1 chỉ 1 người dùng nên
--   chấp nhận được; mở rộng thì phải siết ở tầng dựng context, xem CLAUDE.md §2.1.
alter table troly_ra_soat enable row level security;
drop policy if exists troly_ra_soat_member_all on troly_ra_soat;
create policy troly_ra_soat_member_all on troly_ra_soat for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());

grant select, insert, update, delete on troly_ra_soat to authenticated;
