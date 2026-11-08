# Biên bản SOÁT (nhân chứng thứ hai) — HH00143 Đường trung bình của Tam giác — 16 câu

Bản nháp đã soát và sửa thẳng: `draft_HH00143_G4.md` (TL1–TL5), `G5` (TL6–TL9), `G6` (VN1–VN4), `G7` (VN5–VN7).
Bản trước khi soát còn giữ ở `drafts\_truoc_soat\` (để đối chiếu diff).
Cách làm: Pha 1 = tự giải mù cả 16 câu trong whitelist (lý thuyết đường trung bình + Thalès + chương Tứ giác + lớp 6–7), rồi mới mở bản nháp.
Đã đối chiếu đề với ảnh t-10…t-14 (khớp `de-nguon.md`; 4 chỗ sửa lỗi in TL3 FM, VN3 AI, VN6 ∥AB, TL9 nhãn c,d → a,b đều đúng).
Đã chạy lại verify của người soạn: G4 148/148 · G5 210/210 · G6 336/336 · G7 96/96 PASS, 0 FAIL.
Script soát: `soat_dodai_HH00143.mjs` (đo độ dài dòng hiển thị), `soat_sua_HH00143.mjs` (thống nhất tên lý do + tách dòng), `ve_G6_soat.mjs`, `ve_G7_soat.mjs` (vẽ lại hình).

## Sửa chung cho cả 4 bản (trình bày)
- **Thống nhất tên lý do** (trước đây 4 nhóm dùng 5 cách gọi khác nhau cho cùng một kiến thức):
  - "Chú ý" của bài ⇒ `(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)` (thay cho bản 100 ký tự của G4, "(chú ý đường trung bình, xét △…)" của G7, "(qua trung điểm…)" của G5/G6).
  - Bước nhận ra đường trung bình ⇒ `(định nghĩa đường trung bình)` (thay "(đường trung bình của tam giác)", "(… của tam giác)", và "(định nghĩa)" trống tên).
  - `(tính chất đường trung bình)`, `(định nghĩa trung điểm)` (thay "(trung điểm)"), `(dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau)`.
- **Dòng dài > 68 ký tự hiển thị** dạng "nên … (lý do dài)." ⇒ lý do xuống dòng riêng (11 chỗ).
- **Khuôn "Xét … có:"** G6/G7 viết "(gt).↵Nên …" ⇒ "(gt)↵nên …" như ví dụ k8 (14 chỗ).
- Còn lại các dòng 67 ký tự dạng "nên $XY$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình)." — hơi quá mốc 60, để nguyên (tách thì mọi khối "Xét" dài gấp đôi).
- Dòng trống: kiểm máy — chỉ còn trước `b) c)` và trước `**Phần 2. Trình bày**`; đề không có dòng trống.

## Bảng từng câu
| nhãn | khớp Pha 1? | sửa gì (toán / trình bày / hình) |
|---|---|---|
| TL1 | Khớp (DE∥BF, EF∥BD) | Trình bày: tách dòng lý do hình bình hành. Hình đúng. |
| TL2 | Khớp (MN, PQ cùng ∥ và = ½AC) | Trình bày: tách dòng. Hình đề + `_lg` (AC nét đứt) đúng. |
| TL3 | Khớp (FM ĐTB △BEC; IE ĐTB △AFM ⇒ IE = ½FM = ¼BE) | Trình bày: lý do "(F nằm giữa … cách đều hai đầu)" ⇒ `(định nghĩa trung điểm)` ở Phần 1 (2 chỗ); thêm chú thích còn thiếu cho 2 dòng "là trung điểm" ở Phần 2. FM thay FN: đúng. Hình đúng. |
| TL4 | Khớp (DE, MN cùng ∥ và = ½BC) | Trình bày: tách dòng. Hình đúng, nhãn G không đè nét. |
| TL5 | Khớp (E rồi F trung điểm ⇒ DF ĐTB) | Trình bày: tên lý do 100 → 60 ký tự. Hình đúng (E, F dựng bằng giao điểm, không gạch). |
| TL6 | Khớp (IE ĐTB △BDC; Chú ý trong △AIE) | Trình bày: tên lý do, tách dòng. Hình đúng, không gạch AF = FI. |
| TL7 | Khớp cả 3 ý; ý c chặt chẽ (I nằm giữa H, K vì H, K khác phía AC) | Trình bày: Phần 1 ý c thêm `$I\in AC$ ✓` (thiếu điều kiện để suy "I nằm giữa"). Hình đúng. |
| TL8 | Kết luận khớp, **khác cách**: bản nháp dùng Thalès (AE/AC = AD/AB = ½); Pha 1 dùng E′ trung điểm AC + tiên đề Ơ-clit. Cả hai trong whitelist | **Toán (lý do sai chiều)**: Phần 1 "(chia hai vế cho $AC$)" ⇒ `(nhân hai vế với $AC$)` (từ AE/AC = ½ suy AE = ½AC). Hình đúng. |
| TL9 | Khớp (O trung điểm AC, Chú ý ⇒ F trung điểm CE; E trung điểm DF, Chú ý trong △DOF) | Trình bày: tách 3 dòng dài, tên lý do. Hình đúng. |
| VN1 | Khớp. "Cân tại B" không dùng — vô hại (cả hai ý đúng mọi tam giác). Hệ thức CH·CB = CM·CA suy thẳng từ CH = ½CA, CM = ½CB — đúng, trong whitelist (không đồng dạng). Ý b dùng HK ∥ AB, HK = 2HM = AB — đúng | **Hình**: bản đầu đánh × trên BA và × trên đoạn BM (BC có điểm M) ⇒ ngụ ý sai BM = BA, BM lại mang cả × lẫn ‖ ⇒ thay bằng cung đánh dấu 2 góc đáy Â = Ĉ (`ve_G6_soat.mjs`). Trình bày: "Nên"→"nên", "(định nghĩa)" đủ tên, tên dấu hiệu rút gọn. |
| VN2 | Khớp (4 cạnh = ½AB = ½CD ⇒ hình thoi; gọn hơn cách hbh + 2 cạnh kề của Pha 1) | **Đề**: thêm "và $AB$ không song song với $CD$" — nếu AB ∥ CD thì (AB = CD) ABCD là hbh, E ≡ F, EGFH suy biến; ghi chú nghi vấn đã cập nhật. Trình bày: tên lý do. Hình đúng (AB không ∥ CD). |
| VN3 | Khớp (K trên AC với IK ∥ BF ⇒ K trung điểm CF, IK = ½BF; F trung điểm AK, EF = ½IK). E trung điểm AI (sửa từ "AD") — hợp lý | Trình bày: thêm chú thích `$K$ thuộc đường thẳng $CF$ (cách vẽ)`, `$F$ thuộc đường thẳng $AK$ (vì $F$, $K$ thuộc $AC$)`; Phần 1 tách dòng 72 ký tự. Hình đề + `_lg` (IK nét đứt) đúng. |
| VN4 | Khớp | Trình bày: thêm `(định nghĩa đường trung tuyến)` và `(cmt)` cho 2 dòng thiếu chú thích. Hình đúng. |
| VN5 | Khớp (AM ⊥ BC ⇒ DI ∥ MC ⇒ I trung điểm AM). Bản nháp chứng minh AM ⊥ BC bằng △ABM = △ACM (c.c.c) + kề bù — đúng, lớp 7 | **Hình**: gạch "AB = AC" đặt trên đoạn AD (AC có điểm D) ⇒ ngụ ý sai AD = AB ⇒ thay bằng cung 2 góc đáy (`ve_G7_soat.mjs`). Trình bày: tên lý do, "nên". |
| VN6 | Khớp (sửa ∥BC → ∥AB đúng) | Trình bày: rút dòng "NP ∥ AB (N, P nằm trên … gt)" ⇒ `$NP\parallel AB$ (gt)`; tên lý do. Hình đúng. |
| VN7 | Khớp (N trung điểm AC, MN ∥ AB ∥ EF, Chú ý trong △CMN; Pha 1 cũng thấy Thalès CF/CA = CE/CB = ¼). "Cân tại A" không dùng — vô hại | **Hình** (đề + `_lg`): gạch AC rơi lên đoạn AF (lg: AN) ⇒ ngụ ý AF = AB; gạch MC rơi lên đoạn ME ⇒ ngụ ý ME = BM — cả hai sai ⇒ bỏ gạch AB/AC/BM/MC, đánh cung 2 góc đáy, giữ gạch AI = IM. Trình bày: `(định nghĩa trung điểm)` thay "(trung điểm)", tên lý do. |

**Tổng:** 16/16 câu kết luận khớp Pha 1 (15 cùng cách, TL8 khác cách nhưng hợp whitelist). Không câu nào dùng công cụ ngoài whitelist.
Sửa theo loại: **toán 1** (TL8 lý do sai chiều) · **đề 1** (VN2 thêm điều kiện) · **hình 3 câu / 4 ảnh** (VN1, VN5, VN7, VN7_lg) · **trình bày 16/16** (thống nhất tên lý do; thêm chú thích thiếu ở TL3, TL7, VN3, VN4; tách dòng).

## Nghi vấn cần Thùy
1. **VN2** — đã thêm vào đề "và $AB$ không song song với $CD$" (bản in không có; thiếu thì mệnh đề sai trong trường hợp ABCD là hình bình hành). Đồng ý giữ hay bỏ?
2. **TL8** — bài thuộc Buổi 2 "Chứng minh trung điểm bằng tính chất Đường trung bình", và chính là "Chú ý" của lý thuyết. Bản nháp chứng minh bằng **Thalès** (đúng, trong whitelist). Nếu muốn đúng chủ đề buổi thì đổi sang: gọi $E'$ trung điểm $AC$ ⇒ $DE'$ là đường trung bình ⇒ $DE'\parallel BC$ ⇒ $E'\equiv E$ (tiên đề Ơ-clit). Chọn cách nào?
3. **VN5** — AM ⊥ BC đang chứng minh lại bằng c.c.c + kề bù (2 tầng sơ đồ). Whitelist có tam giác cân lớp 7 ⇒ có thể rút thành một bước "(trong tam giác cân, đường trung tuyến ứng với cạnh đáy cũng là đường cao)". Có rút không?
4. **VN1, VN7** — giả thiết "cân" không dùng trong lời giải; giữ nguyên đề như bản in.
5. **Tên lý do của "Chú ý"** đã thống nhất là `(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)`. Nếu Thùy muốn một tên ngắn chuẩn khác thì thay một lượt.
6. Các dòng "nên $XY$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình)." dài ~67 ký tự (mốc ≲60) — để nguyên; báo nếu cần tách.
