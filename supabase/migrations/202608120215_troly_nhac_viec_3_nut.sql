-- ============================================================================
-- 202608120215 — troly_nhac_viec_3_nut
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   ĐỔI HƯỚNG (CEO 12/08): thứ cần dựng là **trợ lý NHẮC VIỆC HÀNG NGÀY**, không phải công
--   cụ kiểm toán dữ liệu. Nguyên văn: *"khi nó nhắc việc thì t sẽ nhận ra được cái gì cần
--   phải làm, cái gì cần hủy, cái gì cần gác lại"*.
--
--   ⭐ BA NÚT ĐÓ GỠ LUÔN CHỖ BẾ TẮC CỦA BẢN TRƯỚC. Cả tối 12/08 kẹt ở: "hệ không biết lớp nào
--   bắt buộc làm khâu nào (must-exist) nên không dám nhắc". Nhưng nhắc sai thì người bấm HUỶ —
--   xong. **Không cần biết luật trước; luật LỘ RA từ chính các lần bấm.** Đây mới đúng vòng lặp
--   doc §11 (phase 2 lộ lỗ hổng phase 1), bản cũ làm ngược: cố vá đủ dữ liệu rồi mới dám nhắc.
--
--   Đổi từ bộ nhãn CHẨN ĐOÁN (thieu_that/lop_khong_lam/lam_ngoai_he — mô tả dữ liệu) sang bộ
--   QUYẾT ĐỊNH (lam/huy/gac — sinh ra hành động). Chẩn đoán vẫn suy được từ quyết định, nhưng
--   không chiều ngược lại: 100 dòng "lop_khong_lam" không tự nói phải làm gì tiếp.
--
--   `gac` + `gac_den` là thứ biến cái này thành công cụ HÀNG NGÀY thay vì bản kiểm kê một lần:
--   việc gác sẽ QUAY LẠI đúng ngày hẹn. Thiếu nó thì mỗi mục chỉ quyết được một lần duy nhất.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   · KHÔNG mất dòng nào. 29 phán quyết đã có được ÁNH XẠ, không xoá:
--       thieu_that    → 'lam'  (việc thật, cần làm)
--       lop_khong_lam → 'huy'  (khâu này lớp đó không làm ⇒ đừng nhắc nữa)
--       lam_ngoai_he  → 'huy'  (đã làm rồi, chỉ không ghi ⇒ cũng đừng nhắc nữa)
--     Bản gốc giữ nguyên ở cột mới `ket_luan_goc` để truy lại chẩn đoán ban đầu.
--   · CHECK cũ bị thay (nới thêm giá trị + nới `tab` cho đủ mọi khâu). Không thu hẹp gì.
-- ============================================================================

-- Giữ lại chẩn đoán gốc TRƯỚC khi ánh xạ — mất nó là mất kết quả lượt rà 12/08.
alter table troly_ra_soat add column if not exists ket_luan_goc text;
update troly_ra_soat set ket_luan_goc = ket_luan where ket_luan_goc is null;

-- Gác tới ngày nào (NULL = không gác). Chỉ có nghĩa khi ket_luan='gac'.
alter table troly_ra_soat add column if not exists gac_den date;

-- Nới CHECK trước khi ánh xạ, nếu không update sẽ vi phạm ràng buộc cũ.
alter table troly_ra_soat drop constraint if exists troly_ra_soat_ket_luan_ck;
alter table troly_ra_soat add constraint troly_ra_soat_ket_luan_ck
  check (ket_luan = any (array['lam', 'huy', 'gac', 'thieu_that', 'lop_khong_lam', 'lam_ngoai_he']));

update troly_ra_soat set ket_luan = 'lam' where ket_luan = 'thieu_that';
update troly_ra_soat set ket_luan = 'huy' where ket_luan in ('lop_khong_lam', 'lam_ngoai_he');

-- Siết lại: từ nay CHỈ nhận bộ quyết định. (Chạy sau update nên không dòng nào vi phạm.)
alter table troly_ra_soat drop constraint if exists troly_ra_soat_ket_luan_ck;
alter table troly_ra_soat add constraint troly_ra_soat_ket_luan_ck
  check (ket_luan = any (array['lam', 'huy', 'gac']));

-- `gac` mà không có ngày quay lại = việc biến mất vĩnh viễn, đúng thứ cần tránh nhất.
alter table troly_ra_soat drop constraint if exists troly_ra_soat_gac_ck;
alter table troly_ra_soat add constraint troly_ra_soat_gac_ck
  check ((ket_luan = 'gac') = (gac_den is not null));

-- Nới `tab`: lượt 1 chỉ 2 khâu vì sợ nhiễu. Giờ mở hết — nhiễu đã có nút HUỶ xử lý,
-- và chỉ khi mở hết thì trợ lý mới thành "nhắc việc hàng ngày" thay vì soi 2 khâu.
alter table troly_ra_soat drop constraint if exists troly_ra_soat_tab_ck;
alter table troly_ra_soat add constraint troly_ra_soat_tab_ck
  check (tab = any (array['diemdanh', 'ingame', 'danhgia', 'et', 'btvn', 'mt', 'viec']));

comment on column troly_ra_soat.ket_luan is
  'Quyết định của NGƯỜI khi trợ lý nhắc: lam = cần làm, giữ nhắc · huy = không cần, đừng nhắc nữa · gac = hoãn tới gac_den rồi nhắc lại.';
comment on column troly_ra_soat.ket_luan_goc is
  'Chẩn đoán gốc của lượt rà 12/08 (thieu_that/lop_khong_lam/lam_ngoai_he) trước khi ánh xạ sang bộ 3 nút. Chỉ để truy lại.';

-- ── TẦNG 2: NHẬN ĐỊNH CẤP HỆ ────────────────────────────────────────────────
-- CEO 12/08: *"những cái m vừa nói, chính là những thứ trợ lý nói. Nhưng ko phải ở khung chat
-- này mà phải ở trên ERP để test. Cả test trợ lý lẫn fix dữ liệu erp"*.
--
-- Tầng 1 (`troly_ra_soat`) khoá theo BUỔI × KHÂU — hợp cho việc lẻ. Nhận định cấp hệ thì không
-- gắn với buổi nào ("20 cảnh báo yếu ghi từ 20/07 nhưng chưa có nơi nhận"), nên khoá theo MÃ
-- nhận định. Cùng bộ 3 nút, nhưng ở đây `lam` nghĩa là "ừ, cần sửa" chứ không phải "tôi sẽ làm
-- buổi này".
--
-- ⚠ CỐ Ý KHÔNG lưu nội dung nhận định vào DB — nội dung do code sinh lại mỗi lần đọc, kèm SỐ
--   LIỆU SỐNG. Lưu text = ảnh chụp chết, đọc lại 2 tuần sau là sai số mà không ai biết.
--   Bảng này chỉ giữ QUYẾT ĐỊNH của người.
create table if not exists troly_nhan_dinh (
  ma          text primary key,          -- mã ổn định do code đặt (vd 'canh_bao_yeu_khong_noi_dau')
  quyet_dinh  text not null,
  gac_den     date,
  ghi_chu     text,
  nguoi       uuid,
  updated_at  timestamptz not null default now()
);

alter table troly_nhan_dinh drop constraint if exists troly_nhan_dinh_qd_ck;
alter table troly_nhan_dinh add constraint troly_nhan_dinh_qd_ck
  check (quyet_dinh = any (array['lam', 'huy', 'gac']));

alter table troly_nhan_dinh drop constraint if exists troly_nhan_dinh_gac_ck;
alter table troly_nhan_dinh add constraint troly_nhan_dinh_gac_ck
  check ((quyet_dinh = 'gac') = (gac_den is not null));

comment on table troly_nhan_dinh is
  'Quyết định của người cho từng NHẬN ĐỊNH cấp hệ của trợ lý. lam = công nhận cần sửa · huy = không phải vấn đề, đừng nêu nữa · gac = hoãn tới gac_den. Nội dung nhận định KHÔNG lưu ở đây — code sinh lại kèm số liệu sống mỗi lần đọc.';

alter table troly_nhan_dinh enable row level security;
drop policy if exists troly_nhan_dinh_member_all on troly_nhan_dinh;
create policy troly_nhan_dinh_member_all on troly_nhan_dinh for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on troly_nhan_dinh to authenticated;
