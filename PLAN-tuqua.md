# PLAN — Tủ quà (đổi quà bằng xu) · app OPS

> Thùy chốt 30/08: màn ở **app OPS (tab mới "Quà")** · 2 story: **đổi TẠI TỦ giao ngay** và
> **HS ĐẶT quà trước → duyệt → quà về → ra tủ nhận** · **Hải DỪNG** — ERP/app OPS là đầu ghi duy nhất
> · scope đợt 1 = **full**: đổi quà + đơn đặt + catalog + nhập kho.
> Nền: DB layer qlht_* của Hải (audit `spec-qlht-hien-trang.md`), viết lại theo style ERP
> (quyết định 29/08). Ví xu = **wallet tổng, KHÔNG nhãn môn** (đúng CLAUDE §1.6 — xu là ngoại lệ chung).

## 1. Mô hình

- **Tiền tệ = xu**, sổ duy nhất `qlht_xu_ledger` (append-only; cũng là sổ màn Chốt xu tháng ghi vào).
  **Số dư = Σ amount toàn sổ** — công thức 1 nguồn tại `fn_tuqua_so_du`, view đứng cùng logic.
- **Tồn quà = Σ nhập đã-vào-kho − Σ đổi không-hủy** (`fn_tuqua_ton` / view `qlht_v_ton_qua`).
  Hủy lượt đổi ⇒ quà tự quay về tồn (công thức loại trừ `huy`), không phải cộng tay.
- 2 luồng tiêu xu:
  1. **Đổi tại tủ** (`qlht_doi_qua`): chọn HS → quà trong catalog → trừ xu + `da_giao` ngay
     (1 chạm; vẫn có "đổi trước — giao sau" = `cho_giao` cho ca đặc biệt). Hủy = hoàn xu, bắt buộc lý do.
  2. **Đơn đặt theo yêu cầu** (`qlht_qua_order`): tạo đơn (chưa trừ xu) → **duyệt = chốt giá + TRỪ XU
     NGAY** (giữ nguyên nghiệp vụ Hải đã chọn) → `da_ve` khi hàng về → `da_giao` khi HS ra tủ nhận.
     Từ chối (chưa trừ → không hoàn) / Hủy (đã trừ → hoàn đủ), đều bắt buộc lý do.
- Nhập kho: phiếu dương = **chờ vào kho → xác nhận số THỰC** mới cộng tồn; phiếu âm (xuất/hao hụt)
  = trừ tồn ngay, bắt buộc ghi chú lý do.

## 2. DB (mig `202608300908_tu_qua_v1.sql`) — sửa gì so với bản Hải

- **Vá 2 race** audit đã nêu: mọi fn đụng ví/tồn khoá dòng theo thứ tự cố định
  `hoc_sinh → qlht_qua → phiếu/đơn` rồi mới check số dư/tồn.
- **Đủ đường trạng thái** (trước đây `da_giao`/hoàn xu không có đường tới): bộ RPC
  `fn_tuqua_*` (đổi/giao/hủy · order tạo/duyệt/từ-chối/về/giao/hủy · catalog thêm/sửa/ngừng bán ·
  nhập tạo/xác nhận/hủy).
- **Actor chuẩn ERP**: `tai_khoan.id = jwt_uid() → nhan_su` — KHÔNG map qua email như
  `current_nhan_su_id()` của Hải (email lệch = từ chối im lặng).
- **Vết bắt buộc (§4)**: bảng `qlht_log` + 1 trigger chung trên 4 bảng trạng thái.
- **Đọc**: policy member-gate (`la_thanh_vien()`) bổ sung + 2 view gate lại (bỏ gate email),
  view số dư thêm `ma_hs/khoi/anh_url/trang_thai` (cột cũ giữ nguyên — hợp đồng không vỡ).
- **Ghi**: KHÔNG mở policy ghi bảng — sổ xu/kho chỉ ghi qua fn security definer (giữ hard-guarantee
  của Hải: client không tự chế dòng ledger). Ngoại lệ giữ nguyên: policy INSERT dòng chốt xu tháng.
- Cột mới (NULL = không áp dụng): `doi_qua.{giao_luc, nguoi_giao, ly_do_huy}` ·
  `order.{ve_luc, giao_luc, nguoi_giao, ly_do_huy}` · `nhap.ly_do_huy`.
- 15 hàm `qlht_*` cũ của Hải **giữ nguyên làm tham chiếu** — client không gọi nữa.

## 3. Client

- `src/lib/tuqua.ts` — seam mỏng: rpc `fn_tuqua_*` + list thô (view/PostgREST embed). Không tính
  số nghiệp vụ ở client (§2.0).
- `src/screens/ops/TuQuaScreen.tsx` — tab **Quà** (hồng rose), 3 mục:
  - **Đổi quà**: SearchSelect HS (kèm số dư trong dòng gợi ý) → card số dư → grid quà (ảnh/giá/tồn)
    → modal stepper số lượng → "Đổi & giao ngay" / "Đổi trước — giao sau". Dưới: lượt đổi gần đây
    (giao/hủy) + sổ xu gần đây.
  - **Đơn đặt**: + Đặt quà (SearchSelect HS + mô tả + link) · hàng đợi theo trạng thái
    (chờ duyệt → duyệt nhập giá/từ chối · chờ hàng → "quà đã về" · đã về → "giao") · kèm mục
    "đổi tại tủ chờ giao" · lịch sử collapsed.
  - **Kho**: + quà mới (ảnh upload storage) · list quà (sửa/toggle bán/nhập-xuất) · phiếu chờ
    xác nhận số thực.
- Leaf quyền mới **`tu_qua`** (fixtures — "Tủ quà (đổi xu)"): app ẩn tab nếu không có leaf.
  ⚠ Nhớ CẤP leaf cho role OPS ở màn Phân quyền (precedent quên cấp: tuyensinh/botro).

## 4. Thứ tự áp (máy có DB — phiên remote không có .env)

1. Chạy tay `scripts/sql_tuqua_chuyen_chu.sql` trong Supabase SQL Editor (role postgres) —
   chuyển owner cụm `qlht_*` về `claude_build` (Hải dừng; đưa cụm này vào luồng migration + hết
   điểm mù "CLI đọc 0 dòng"). Không xoá/đổi gì khác.
2. `npm run migrate` (file `202608300908_tu_qua_v1.sql` có guard: chưa chuyển owner là chặn ngay).
3. `npm run schema` + commit schema.md.
4. Smoke trên data thật (2 quà + 3 dòng sổ thử nghiệm của Hải): đổi 1 quà → check sổ/tồn → hủy →
   check hoàn; tạo order → duyệt → về → giao; nhập kho dương/âm. (Transaction rollback nếu muốn khô.)
5. Cấp leaf `tu_qua` cho role OPS (+ ai duyệt đơn) ở màn Phân quyền.
6. Deploy `build:ops` như thường (Vercel đã xong).

## 5. Ngoài scope đợt này (bàn sau)

- HS tự đặt/tự xem tủ quà trên **app HS** (hiện OPS thao tác hộ tại tủ).
- Quyền duyệt đơn tách riêng leader (hiện: ai có leaf `tu_qua` đều duyệt được — team nhỏ + vết đầy đủ).
- Báo cáo tồn/kiểm kê định kỳ, cảnh báo tồn thấp.
- Màn quản trị trên ERP desktop (nếu cần sau khi app chạy).
