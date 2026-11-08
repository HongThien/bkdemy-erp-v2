# Hình K11 Giới hạn–Liên tục + K12 Nguyên hàm–Tích phân (07/11/2026)

Yêu cầu Thùy: kiểm bản đồ hai chương, vẽ lại hình, **ưu tiên lý thuyết → ví dụ → bài tập**; hình đẹp giữ, hình yếu vẽ lại.

## 1. Kiểm bản đồ (DB live)
| | K11 Giới hạn (NCD00186) | K12 Nguyên hàm–TP (NCD00095) |
|---|---|---|
| Cấu trúc | 3 chuyên đề · 17 nhóm · 57 dạng | 3 chuyên đề · 11 nhóm · 41 dạng |
| Mô tả dạng | 57/57 | 41/41 |
| Lý thuyết dạng | 57/57 | **6/41** (35 dạng chỉ có lý thuyết NHÓM — nhóm đủ 11/11) |
| Ví dụ ≥2 / dạng | 57/57 | **28/41** — 13 dạng chỉ 1 ví dụ (NDB00631, 632, 756, 757, 759, 760, 761, 777, 778, 782, 779, 786, 780…) |
| Câu gắn | 1.647 câu | 3.495 câu |

Cần Thùy quyết:
- **K11:** NDB01202 (thực tế dùng giá trị trung gian) **0 câu**; 14 dạng < 15 câu (NDB01155: 2, 01165: 3, 01168: 4, 01862: 4, 01175: 1, 01189: 3, 01160: 7, 01184: 7…); nhóm NNB01819 (truy hồi) và NNB02043 (dạng khác) **trống lý thuyết nhóm**.
- **K12:** mô tả NDB00751 / NDB00752 đảo so với tên + ví dụ (đã ghi từ trước); NDB00761 (2 câu), NDB00639 (2 câu), NDB00786 (4 câu) rất ít câu; không có dạng **đổi biến / từng phần / hàm ẩn** (CT 2018 không bắt buộc — Thùy xác nhận bỏ); NDB00780 ví dụ không có khung `##VD` đếm được (kiểm lại định dạng).
- Dạng `NDB00755` "đồ thị cho sẵn" chỉ 13 câu so với 89 câu ở NDB00777 → xem lại ranh giới hai dạng.

## 2. Máy vẽ mới
`scripts/kho/hinh-giai-tich.mjs` (loai `giai_tich`, đã nối vào `veHinh`): đồ thị nhiều hàm · **miền tô giữa hai đường / dưới đồ thị** · cận có đường dóng · tiệm cận · điểm đặc/rỗng (máy kiểm điểm nằm trên đường) · **phác khối tròn xoay quanh Ox / Oy** · vật thể thiết diện không đổi · tên trục tuỳ ý (t, v).
`scripts/kho/ghi-hinh-bdm.mjs <spec> <EXPORT> [--ghi]`: chèn / thay hình vào lý thuyết hoặc ví dụ (chạy thử mặc định, sao lưu giá trị cũ ra `reports/sao-luu-hinh-bdm-*.json`, trigger `dai_bdm_log` lưu cũ/mới). Spec: `kho-rules/dai/lo/k12-de/hinh-tich-phan/{vi-du,ly-thuyet,k11-vi-du}.mjs`.

## 3. Đã ghi DB
- **Ví dụ K12: 20 hình** (13 dạng) — đồ thị cho sẵn, v(t), diện tích (dưới đồ thị, giữa hai đồ thị, đối xứng), tròn xoay quanh Ox/Oy, thiết diện không đổi.
- **Lý thuyết nhóm: 9 hình** — K12: ý nghĩa hình học tích phân (NNB01217), diện tích giữa hai đồ thị (01415), parabol–dây cung (01499), thể tích tròn xoay 1 hàm / 2 hàm (01227), s = ∫v dt (01221); K11: giới hạn một bên (01585), tiệm cận đứng (01587), gián đoạn/điểm rỗng (01589), giá trị trung gian (01592).
- **Vẽ lại 6 hình ví dụ K11 đã có** (NDB01175, 01177, 01182, 01189×3) cho đồng nét; hình cũ vẫn nằm trên bucket.
- **Giữ nguyên (đã tốt):** NDB02592 (SVG máy vẽ), NDB00786 (2 hình), NDB00780 hình 2 (đường nét), NNB01226 (hình SGK).
- **Chất lượng thấp, chưa đụng:** NDB00779 (ảnh cắt có chữ tràn), NDB00780 hình 1 (ảnh scan có chữ + tô tím) — cần hình 3D, Thùy cho gỡ/vẽ lại hay không.

## 4. Bài tập (chưa làm — cần quyết)
535 câu có ảnh đề (K12 ≈ 437, K11 ≈ 8 + 9 câu nhắc "hình vẽ" mà không ảnh): NDB00777 89 · 00787 55 · 00631 48 · 00775 46 · 00780 38 · 00781 32 · 00636 30 · 00788 24 · 00778 23 · 00774 18 · 00750 15 · 00779 14 · 00755 13 …
Ảnh là hình cắt từ sách/đề (chỉ phần hình, chữ nằm ở `noi_dung`). Mẫu 13 ảnh NDB00755: ~4/13 yếu (nền bẩn, quá nhỏ, thấy viền ảnh), còn lại đọc được. **Không thể vẽ lại tự động đáng tin:** nhiều hình là đường cong tự do (đề chỉ cho diện tích S₁, S₂), phải bịa hàm khớp số liệu — nên mỗi câu phải có biên bản kiểm (cận, diện tích, giao điểm) và HTML so ảnh cũ/mới cho Thùy duyệt trước khi ghi đè `anh_de` của câu đã duyệt.
Đề xuất: làm theo dạng, ưu tiên NDB00777 → 00775 → 00787 → 00631, mỗi lô một HTML trước/sau; câu hình tự do không có công thức ⇒ giữ ảnh gốc.
