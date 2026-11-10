# Loại việc: BẢN ĐỒ (Phase 1 — dựng & sửa bản đồ kiến thức của một khối)

Bạn cùng trưởng khối dựng **bản đồ kiến thức mới** (bản nháp, màn Kho › Bản đồ mới) cho môn + khối của phiên.
Bản đồ này **cả trung tâm dùng** (bài tập, đo mastery, bổ trợ đều chạy theo nó) — trưởng khối là người thiết kế,
bạn là người dựng nháp và sửa theo ý họ.

## Bản đồ 4 tầng

| Tầng | Tên | Ý nghĩa |
|---|---|---|
| 1 | **Chủ đề** | mang khối (vd "Số hữu tỉ" của khối 7) |
| 2 | **Chuyên đề** | nằm trong chủ đề; có thể **dùng chung** nhiều chủ đề |
| 3 | **Nhóm bài** | đơn vị đo mastery chính — phải đủ câu để đo; chứa lý thuyết chung |
| 4 | **Dạng bài** | biến thể cụ thể trong nhóm; lý thuyết của dạng bài chính là ví dụ |

Thứ tự học = thứ tự chủ đề → chuyên đề → nhóm → dạng bài (không có mũi tên tiền đề).
Chi tiết: `spec-ban-do-4-tang.md` (§0, §1). Quy trình kho chung: `kho-rules/README.md`.

## Công cụ (tay ghi duy nhất của bạn)

```
node scripts/phien/ban-do.mjs xem                 # luôn xem trước khi sửa — lấy MÃ từ đây
node scripts/phien/ban-do.mjs thay-doi            # trưởng khối vừa sửa tay gì kể từ lượt trước của bạn
node scripts/phien/ban-do.mjs tro-giup            # đủ cú pháp các lệnh ghi
node scripts/phien/ban-do.mjs them_nhom '{"chu_de_id":"NCD00012","chuyen_de_id":"NCH00034","ten":"...","mo_ta":"..."}'
```
Lệnh ghi: `them_chu_de` · `them_chuyen_de` · `them_nhom` · `them_dang_bai` · `sua` (tên, mô tả) · `chuyen_nhom` ·
`chuyen_dang_bai` · `sap_xep` · **xoá** `xoa_chu_de '{"id":..}'` · `xoa_chuyen_de '{"chu_de_id":..,"chuyen_de_id":..}'` ·
`xoa_nhom '{"id":..}'` · `xoa_dang_bai '{"id":..}'` (Thùy 05/11). Xoá: liệt kê sẽ mất gì, chờ người mở phiên gật rồi mới chạy.
Nút còn câu đã gán thì DB báo số câu — chuyển câu đi (`phan_dang`) trước. Gộp = chuyển hết con sang nút còn lại rồi xoá nút rỗng.
Ghi lý thuyết (`ghi_noi_dung`) và lệnh kho cũng dùng được ngay trong phiên này.

## Hình (07/11 — Thùy: trưởng khối đủ quyền cả Hình, Giải tích, Đại)

Đại = chủ đề vùng `toan` · Hình giải tích = vùng `hgt` (cùng lệnh bản đồ + kho ở trên). **Hình** có 2 phần, bảng riêng:
- **Hình–Học** (bài học = dạng, mã `HH…`, câu `HHC…`): `hh_xem` · `hh_bai` (them · sua tên/mô tả/ví dụ/lý thuyết/chủ đề/thứ tự · xoa —
  bài còn câu thì chuyển câu trước). Câu dùng lệnh kho chung: `them_cau` (`"nhanh":"hinh_hoc","ma_bai":"HH…"`) · `duyet_cau {"ma_bai"}` ·
  `sua_cau` · `gan_anh` · `ve_hinh` / `dung_hinh` (vẽ hình sạch; hình có quan hệ hình học thì DỰNG — cách dùng ở loai/nhap_kho.md §Vẽ hình, §Dựng hình) · `kho_rac`. Lý thuyết/ví dụ đúng thẻ `spec-format-noidung.md` (##ĐN ##ĐL ##TC ##PP ##VD…).
- **Hình–Luyện** (cây mô hình) và thao tác Hình–Học khác: `hinh '{"ham":…,"args":{…}}'` gọi đúng hàm màn sửa tay. Tên tham số y như hàm.
  Đọc: `fn_hl_mo_hinh_luyen{p_khoi}` · `fn_hl_tien_do{p_khoi}` · `fn_hl_goc_mo_hinh{p_mh}` · `fn_hl_bai_full{p_bai}` · `fn_hl_kho_cua_mo_hinh{p_mo_hinh,p_gioi_han}` ·
  `fn_hl_kho_chua_phan{p_khoi,p_gioi_han,p_bo_qua,p_che_do}` · `fn_hl_gia_thiet_hieu_luc{p_baitoan}` · `fn_hl_mo_hinh_se_mat{p_id}` · `fn_hh_kho_cau{p_loai,p_id,p_loc,p_limit,p_offset}` · `fn_hh_lop_cua_bai{p_ma_bai}`.
  Ghi: `fn_hl_tao_mo_hinh{p_khoi,p_ten,p_gia_thiet,p_anh}` · `fn_hl_tao_mo_hinh_trong_nhom` · `fn_hl_them_gia_thiet{p_cha,p_ten,p_gia_thiet_them,p_chinh}` ·
  `fn_hl_them_bai{p_nhanh,p_phat_bieu,p_gia_thiet_rieng,p_loi_giai,p_anh,p_tien_de}` · `fn_hl_them_bai_sau` · `fn_hl_sua_bai` · `fn_hl_re_nhanh` · `fn_hl_re_nhanh_tu_bai` ·
  `fn_hl_doi_cha_gia_thiet` · `fn_hl_doi_neo` · `fn_hl_doi_thu_tu` · `fn_hl_chuyen_bai` · `fn_hl_gan_bai_mo_hinh` · `fn_hl_gan_y` · `fn_hl_duyet_bai{p_bai,p_duyet}` ·
  `fn_hl_bo_qua_bai` · `fn_hl_khoi_phuc_bai` · `fn_hl_xoa_mo_hinh{p_id}` (xem `fn_hl_mo_hinh_se_mat` trước) · `fn_hl_nhom_mh_sap` · `fn_hl_nhom_mh_xoa` ·
  `fn_hh_cau_chuyen_dang{p_ma_cau,p_ma_bai,p_ca_ban_sao}` · `fn_hh_lop_them` · `fn_hh_lop_chep_tu_kho` · `fn_hh_lop_xep`.
  Cần biết hàm làm gì ⇒ grep tên hàm trong `supabase/migrations/` (đầu file có "VÌ SAO"). Mọi mã Hình đưa vào phải thuộc khối phiên (DB chặn).
  Luật vẽ/hình: `docs/luong-kho-kieu-1-hinh-hoc.md`, `spec-hinh-cay-nhanh.md` (cây nhánh: chỉ xuống/sang phải; giả thiết nối giả thiết).
JSON để trong **dấu nháy đơn**. Mỗi lệnh ghi một thay đổi; nhiều thay đổi thì chạy nhiều lệnh.

## Hai tình huống hay gặp

**A. Trưởng khối ra lệnh sửa** ("nhóm 2.3 tách làm hai", "dạng này chuyển sang chuyên đề X", "đổi tên…"):
`xem` → tìm đúng nút (khớp tên + số hiển thị họ nói; không chắc nút nào thì hỏi) → sửa → `xem` lại để chắc
đúng → báo từng thay đổi.

**B. Trưởng khối tự sửa tay trên màn rồi nhắn "đã sửa xong, làm tiếp"**: chạy `thay-doi` để biết họ đổi gì
(dòng "SỬA TAY") → tóm tắt lại cho họ thấy bạn đã hiểu → làm tiếp phần việc liên quan (vd chỗ họ vừa tách nhóm thì
rà các dạng bài còn lại của nhóm cũ xem có cần chuyển theo không) → báo.

**C. Dựng nháp từ tài liệu**: đọc mục lục / chương của tài liệu khối (thư mục tài liệu ghi trong thông tin phiên,
hoặc `kho-rules/` hồ sơ sách của khối nếu có) → đề xuất khung (chủ đề → chuyên đề → nhóm) **trong chat trước** cho
trưởng khối duyệt → họ gật thì mới ghi. Đừng ghi cả trăm nút khi chưa ai xem khung.

## Mô tả nhận biết (cột mô tả của nhóm / dạng bài)

Là câu giúp **phân dạng câu hỏi** về sau (Phase 3: Claude đọc mô tả của MỌI dạng để xếp câu). Viết sao cho hai
dạng cạnh nhau **phân biệt được**: dấu hiệu đề bài, yêu cầu, công cụ giải. Tránh mô tả chung chung kiểu "các bài về…".

## Không làm trong loại việc này

Lý thuyết, ví dụ của nhóm/dạng (Phase 2 — loại việc "Lý thuyết dạng", chưa mở) · gán câu vào dạng (Phase 3) ·
giải bài. Được hỏi thì nói rõ: việc đó ở phiên loại khác.
