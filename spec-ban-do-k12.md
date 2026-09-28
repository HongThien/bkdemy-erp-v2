# spec-ban-do-k12.md — P1 LUỒNG KHO: BẢN ĐỒ KHỐI 12 (khung chuyên đề + thứ tự + dạng)

> **Trạng thái: ĐỀ XUẤT v2 của CTO (28/09 tối) — CEO đã trả lời vòng 1 (§6): khung "gần SGK, không 100%" · xoá rác: gật ·
> dạng seed nháp CTO: gật · 673 câu thực tế: "bỏ qua cái đã phân, đề xuất theo góc nhìn của CTO" ⇒ §2b + §3b. Chờ CEO chốt vòng 2.**
> Số liệu đo trên DB live 28/09 (phiên read-only).
> Là pha **P1** của `spec-luong-kho.md` §7. Đích P1: *học thuật chốt bản đồ K12; 1.516 câu đang nằm dạng chờ có chỗ để về;
> thứ tự chủ đề tường minh (cho luật phạm vi C8); hồ sơ dạng bắt đầu có.* Chưa build gì cho tới khi §6 được trả lời.

## 1. Hiện trạng bản đồ K12 (DB 28/09)

| Số đo | Giá trị |
|---|---|
| Chủ đề / chuyên đề / dạng | **8 / 20 / 77** (+1 dạng chờ `T112000000`) |
| Câu K12 chưa xoá / đã duyệt | 6.056 / 589 |
| **Câu ở dạng chờ** | **1.516** = TN 672 · Đ/S 581 · TLN 260 · tự luận 3. Nguồn chính: đề thi thử TN THPT **2026** (Cần Thơ, Hưng Yên, Lào Cai, Đồng Nai, Ninh Bình…) — đề trải **cả 6 chương** |
| Dạng có lý thuyết | 46/77 |
| Dạng 0 câu | 10 (trong đó `T112070106` tên là **"."**, `T112060201` "Kĩ năng bó" — rác) |
| `mo_ta_ngan` | 0/77 — gán dạng hiện chỉ dựa vào TÊN dạng |

### Phủ theo 6 chương SGK Kết nối tri thức (B7)

| Chương SGK | Bản đồ BK đang có | Dạng · câu | Nhận xét |
|---|---|---|---|
| **I. Ứng dụng đạo hàm để KSHS** (bài 1–5) | `T11201` "Các đặc điểm chung của hàm số" (4 chuyên đề) + `T11202` "Các hàm số tiêu biểu" (4 chuyên đề) | 30 · 3.108 | Cắt theo *tính chất / loại hàm* (khác SGK cắt theo *bài*). Bài 5 "thực tế" = **2 dạng gom 673 câu, 0 duyệt** — là thùng, không phải dạng |
| **II. Vectơ và hệ trục toạ độ trong KG** (bài 6–8) | `T11207` (3 chuyên đề) | 22 · 1.179 | Khớp SGK 1:1. Có 1 dạng tên "." |
| **III. Số đặc trưng đo độ phân tán — mẫu ghép nhóm** (bài 9–10) | **KHÔNG CÓ** | 0 | Từ khoá ước ~109 câu chờ thuộc chương này |
| **IV. Nguyên hàm và tích phân** (bài 11–13) | `T11204` Nguyên hàm (2 chuyên đề) + `T11205` Tích phân (3 chuyên đề) | 21 · 532 | 1 chương SGK bị tách 2 chủ đề |
| **V. Phương pháp toạ độ trong KG** (bài 14–17: mp · đt · góc · mặt cầu) | **KHÔNG CÓ** | 0 | Dù NBV / PNL / Từ Tâm đều có bộ đầy đủ; đề 2026 chương này ~4–5 câu/đề |
| **VI. Xác suất có điều kiện** (bài 18–19) | `T11208` (2 chuyên đề, 4 dạng, 6 câu) + `T11206` "Xác suất cổ điển" (rỗng) | 4 · 6 | Mới là khung, chưa có câu; `T11206` là rác |

Ước lượng câu chờ theo chương bằng **từ khoá trong đề** (chỉ để đo cỡ lỗ, KHÔNG phải gán dạng): C1 ~359 · C4 ~239 · C3 ~109 ·
C5 ~52 · C2 ~46 · C6 ~13 · **698 không nhận ra bằng từ khoá** (nhiều câu thực tế / xác suất viết bằng lời).

**Kết luận hiện trạng:** câu dồn vào dạng chờ **không phải vì AI gán kém**, mà vì **bản đồ thiếu 2 chương + 1 chương mới chỉ là khung**.
Nguồn K12 sắp nhập (171 đề có đáp án + NBV/PNL/Từ Tâm) đều theo cấu trúc SGK ⇒ khung phải có trước khi chạy T2 (đúng `spec-luong-kho.md` §7 + `spec-de-thi.md` quyết định #10).

## 2. Khung đề xuất: CHỦ ĐỀ = CHƯƠNG SGK · CHUYÊN ĐỀ = BÀI SGK · thứ tự = thứ tự SGK

**Vì sao cắt theo SGK chứ không giữ cắt BK cũ ("đặc điểm chung / hàm tiêu biểu"):**
1. Luật phạm vi C8 ("chỉ dùng kiến thức chủ đề đó và phía trước") cần một **thứ tự học** — thứ tự SGK là thứ tự duy nhất mọi trường dạy theo.
2. Cả 3 bộ tài liệu nguồn (NBV, PNL, Từ Tâm) lẫn đề thi 2026 đều cắt theo bài SGK ⇒ gán **chuyên đề** gần như máy làm được
   (đo 28/09: 84/84 câu gán sai dạng vẫn **đúng chuyên đề**). Cắt BK cũ thì máy phải suy thêm một lớp.
3. Cắt "đặc điểm chung / hàm tiêu biểu" là di sản chương trình cũ (hàm bậc 4 trùng phương, mũ–log…). Chương trình 2018 không còn.

**Cái GIỮ NGUYÊN:** mã dạng (`ma_dang`, là FK-target duy nhất ổn định). Dạng chỉ **dời** sang chuyên đề mới (đổi `ma_chuyen_de`/`ma_chu_de` là cột denormalize).
Chuyên đề cũ khớp 1:1 với bài SGK **giữ mã, đổi tên** (vì `dai_chuyen_de_ly_thuyet` khoá theo `ma_chuyen_de`). Chuyên đề mới cấp mã mới.

| TT | Chủ đề (chương) | Chuyên đề (bài SGK KNTT) | BK hiện có → xử lý | Dạng ứng viên từ nguồn |
|---|---|---|---|---|
| 1 | **I. Ứng dụng đạo hàm KSHS** | B1 Tính đơn điệu và cực trị | `T1120101` Đơn điệu (4 dạng) + `T1120102` Cực trị (2) → **gộp** thành 1 chuyên đề, giữ 6 dạng | PNL: 4 dạng (lý thuyết cho trước · tham số m đơn điệu · tham số m cực trị · thực tế nâng cao) |
| 2 | | B2 GTLN – GTNN | `T1120104` (3 dạng) → giữ mã, khớp 1:1 | PNL: 4 (trên miền · có tham số · tối ưu thực tế · nâng cao) |
| 3 | | B3 Đường tiệm cận | `T1120103` (7 dạng) → giữ mã | PNL: 4 (TCĐ+TCN · TCX · tham số · hình học/thực tế) |
| 4 | | B4 Khảo sát và vẽ ĐTHS | `T1120201` bậc 3 (3) + `T1120202` b1/b1 (3) + `T1120203` b2/b1 (5) → **11 dạng dời về đây**, giữ mã dạng | PNL: 4 (bậc ba · b1/b1 · b2/b1 · thực tế) |
| 5 | | B5 Ứng dụng đạo hàm giải bài toán thực tiễn | `T1120204` (2 dạng, **673 câu**) → giữ mã; **tách dạng ở lô đầu** (§3) | PNL: 5 (tốc độ thay đổi · tối ưu đơn giản · tăng trưởng · kinh tế/sản xuất · tốc độ thay đổi các đại lượng) |
| 6 | **II. Vectơ và hệ trục toạ độ trong KG** | B6 Vectơ trong không gian | `T1120701` (8 dạng) → giữ; **xoá** `T112070106` "." (0 câu) | PNL: 2 |
| 7 | | B7 Hệ trục toạ độ trong không gian | `T1120702` (3) → giữ | PNL: 2 |
| 8 | | B8 Biểu thức toạ độ của các phép toán vectơ | `T1120703` (11) → giữ | PNL: 2 |
| 9 | **III. Số đặc trưng đo độ phân tán (mẫu ghép nhóm)** | B9 Khoảng biến thiên và khoảng tứ phân vị | **TẠO MỚI** | nháp §3 |
| 10 | | B10 Phương sai và độ lệch chuẩn | **TẠO MỚI** | nháp §3 |
| 11 | **IV. Nguyên hàm và tích phân** | B11 Nguyên hàm | `T1120401` (6) + `T1120402` thực tế (2) → dời về, giữ mã dạng | NBV/Từ Tâm theo bài |
| 12 | | B12 Tích phân | `T1120502` tính TP (4) + `T1120503` thực tế (3) → dời về | |
| 13 | | B13 Ứng dụng hình học của tích phân | `T1120501` (6) → giữ mã, khớp 1:1 | |
| 14 | **V. Phương pháp toạ độ trong KG** | B14 Phương trình mặt phẳng | **TẠO MỚI** | PNL: 2 (viết PT mp · khoảng cách) — hạt thô, tách theo §3 |
| 15 | | B15 Phương trình đường thẳng trong KG | **TẠO MỚI** | PNL: 4 (yếu tố · viết PT · góc & khoảng cách · toạ độ hoá/thực tế) |
| 16 | | B16 Công thức tính góc trong KG | **TẠO MỚI** | PNL gộp vào B15 dạng 3 — BK tách riêng theo SGK |
| 17 | | B17 Phương trình mặt cầu | **TẠO MỚI** | PNL: 3 (yếu tố · viết PT · vị trí tương đối/thực tế) |
| 18 | **VI. Xác suất có điều kiện** | B18 Xác suất có điều kiện | `T1120801` (1 dạng, 0 câu) → giữ, bổ sung dạng | nháp §3 |
| 19 | | B19 Công thức XS toàn phần và Bayes | `T1120802` (3 dạng, 6 câu) → giữ | nháp §3 |
| — | *(rác)* | | **Xoá** `T11206`/`T1120602`/`T112060201` "Xác suất cổ điển / Kĩ năng bó" (0 câu) · `T1120301` chuyên đề rỗng còn sót của chủ đề đã xoá | |

- **Không tạo chủ đề-thùng "Ôn tập / Đề thi"** cho K12: đề thi đã lưu cấu trúc ở `tai_lieu` (F15), câu đề thi vào đúng chuyên đề của nó. (K9 có thùng vì lịch sử; không lặp lại.)

### 2b. "Gần SGK, không 100%" — 4 chỗ CTO đề xuất LỆCH có chủ đích (CEO 28/09: khung theo SGK nhưng không sao chép)

Nguyên tắc để quyết lệch hay không: **SGK cắt theo BÀI HỌC (để dạy); bản đồ BK cắt theo KIẾN THỨC ĐO ĐƯỢC (HS × KP).** Chỗ nào hai cách cắt
cho cùng kết quả thì theo SGK (được thứ tự + khớp tài liệu nguồn miễn phí); chỗ nào bài học gom nhiều họ KP, hoặc gom theo *bối cảnh* chứ không
theo *kiến thức*, thì cắt theo KP.

| # | SGK | BK đề xuất | Vì sao |
|---|---|---|---|
| L1 | B5 "Ứng dụng đạo hàm giải bài toán thực tiễn" (1 bài, gom mọi bài toán có lời văn) | **Không có chuyên đề "thực tế".** Thay bằng chuyên đề KP thật **"Tốc độ thay đổi và đạo hàm"** (chuyển động · tốc độ thay đổi đại lượng); còn bài tối ưu thực tế ⇒ về **B2 GTLN–GTNN**, tiệm cận trong mô hình ⇒ về **B3**, đơn điệu/cực trị của mô hình ⇒ về **B1**. Mỗi dạng "có lời văn" mang **thuộc tính `thuc_te`** (`dai_dang_thuoc_tinh`, danh mục hiện rỗng ⇒ tạo) | "Thực tế" là **vỏ bối cảnh**, không phải kiến thức. Đo mastery theo (HS × KP): em làm sai bài "tối ưu doanh thu" là yếu **GTLN–GTNN** (hoặc yếu **lập hàm từ tình huống**), không phải yếu một KP tên "thực tế". Gom theo vỏ thì ô đo vô nghĩa và trùng KP với B1–B3. Chi tiết trên 673 câu: §3b |
| L2 | B9 Khoảng biến thiên & tứ phân vị · B10 Phương sai & độ lệch chuẩn (2 bài) | **Gộp 1 chuyên đề** "Số đặc trưng đo độ phân tán của mẫu ghép nhóm" (6–7 dạng) | Cùng một họ KP (đọc bảng ghép nhóm → tính một số đặc trưng → so sánh); đề thi 1–2 câu/đề; 2 chuyên đề mỏng làm % phủ và LT chuyên đề rời rạc |
| L3 | B1 Tính đơn điệu và cực trị (1 bài) | **Giữ 2 chuyên đề** như BK đang có (Đơn điệu · Cực trị) | Hai họ KP độc lập, mỗi họ đã có LT chuyên đề riêng và 4+2 dạng; gộp không được gì |
| L4 | B14 mp · B15 đt · B16 góc · B17 mặt cầu (4 bài) | Theo SGK **4 chuyên đề** — nhưng **B16 "Công thức tính góc" là chuyên đề công cụ**: đề thường hỏi góc *kèm* mp/đt. Dạng "góc" đặt ở B16, dạng ở B14/B15 chỉ hỏi góc thì gán về B16 | Giữ đúng 1 KP = 1 chỗ; tránh "khoảng cách/góc" xuất hiện ở cả 3 chuyên đề (PNL đang bị vậy) |

Sau khung v2: **6 chủ đề · 19 chuyên đề** (I: Đơn điệu · Cực trị · GTLN–GTNN · Tiệm cận · Khảo sát & vẽ · Tốc độ thay đổi = 6 ·
II: 3 · III: 1 · IV: 3 · V: 4 · VI: 2) · ~77 dạng cũ dời chỗ + dạng mới cho 8 chuyên đề mới/khuyết.

## 3. Dạng — độ hạt, nguồn seed, và các chuyên đề mới

- **Độ hạt giữ của BK** (77 dạng so với 38 "dạng" của PNL): dạng = *kiến thức + kĩ năng + phương pháp* (luật §2 `spec-luong-kho.md`);
  "dạng" của PNL là nhóm bài học, thô hơn. Mục lục PNL/NBV chỉ làm **khung chuyên đề**, dạng phải rút từ câu.
- **Dạng cho chuyên đề mới — CTO nháp theo luật §2, học thuật duyệt; lô đầu chạy làn 🟡 sẽ sửa:**

| Chuyên đề | Dạng nháp |
|---|---|
| B9 Khoảng biến thiên & tứ phân vị | Tính khoảng biến thiên của mẫu ghép nhóm · Tính tứ phân vị / khoảng tứ phân vị của mẫu ghép nhóm · So sánh độ phân tán hai mẫu bằng R hoặc ΔQ · Phát hiện giá trị bất thường |
| B10 Phương sai & độ lệch chuẩn | Tính phương sai / độ lệch chuẩn mẫu ghép nhóm · So sánh độ phân tán hai mẫu bằng s · Bài toán thực tế chọn phương án ổn định hơn |
| B14 PT mặt phẳng | Xác định VTPT, điểm thuộc mp · Viết PT mp qua điểm biết VTPT · Viết PT mp qua 3 điểm / chứa đường, song song mp (dùng tích có hướng) · Vị trí tương đối hai mp · Khoảng cách điểm–mp, hai mp song song · Bài toán thực tế về mặt phẳng |
| B15 PT đường thẳng | Xác định VTCP, điểm thuộc đt · Viết PT tham số / chính tắc (qua 2 điểm, qua điểm ⊥ mp, giao 2 mp) · Vị trí tương đối đt–đt, đt–mp · Hình chiếu, điểm đối xứng qua đt/mp · Bài toán thực tế về đường thẳng |
| B16 Công thức góc | Góc giữa hai đt · Góc giữa đt và mp · Góc giữa hai mp · Ứng dụng thực tế về góc |
| B17 PT mặt cầu | Xác định tâm, bán kính từ PT · Viết PT mặt cầu · Vị trí tương đối mặt cầu với điểm / mp / đt · Bài toán thực tế về mặt cầu |
| B18 XS có điều kiện | Tính P(A\|B) từ bảng số liệu / dữ kiện đếm · Công thức nhân xác suất · Dùng sơ đồ hình cây · Kiểm tra hai biến cố độc lập |
| B19 Toàn phần & Bayes | Tính xác suất bằng công thức toàn phần · Tính xác suất hậu nghiệm bằng Bayes · Bài toán thực tiễn (xét nghiệm, sản xuất, lỗi sản phẩm) — *3 dạng đang có giữ nguyên* |
| ~~B5 Thực tế (673 câu)~~ | → §3b (CEO: bỏ qua cách đã phân, CTO đề xuất theo góc nhìn riêng) |

- Mỗi dạng của chuyên đề mới cần **`mo_ta_ngan`** (dấu hiệu nhận biết 1–2 câu) ngay lúc tạo — đây là thứ 84/84 lỗi gán dạng ở đợt trước đòi hỏi (đòn bẩy 1).

### 3b. 673 câu "ứng dụng thực tế" — đọc lại từ đầu (mẫu ngẫu nhiên 70 câu, 28/09)

Hai dạng hiện có chia theo **đề cho gì** ("có sẵn mô hình" 383 câu / "có sẵn biểu thức" 290 câu). Đó là cắt theo *bề mặt đề bài*.
Đọc 70 câu theo **phương pháp giải** (cấu trúc sâu, luật §2 `spec-luong-kho.md`) thì chúng rơi vào **4 họ KP, đều đã có chỗ trong B1–B3 + 1 KP chưa có chỗ**:

| Họ KP (phương pháp thật) | Dấu hiệu | Mẫu / 70 | Về chuyên đề | Dạng đề xuất (mỗi dạng = 1 cách LẬP HÀM khác nhau; bước sau — tìm max/min — giống nhau) |
|---|---|---|---|---|
| **Tối ưu = GTLN–GTNN** | "lớn nhất / nhỏ nhất / tiết kiệm nhất / tối đa" | **~38** | **B2 GTLN–GTNN** | ① hàm **cho sẵn** (chi phí trung bình, lợi nhuận P(x)) — thực chất là dạng B2 có vỏ · ② phải **lập hàm từ hình học** (hộp, máng tôn, thang, dây uốn, cửa sổ, chóp) · ③ phải **lập hàm từ kinh tế** (giảm giá ↔ thêm khách, doanh thu − chi phí, chia đợt hàng, trạm/ống) · ④ **quãng đường – thời gian** (bơi + đi bộ, hai xã bờ sông, sa mạc; hàm có căn) |
| **Đạo hàm = tốc độ thay đổi** | s(t), v, a; "tốc độ tăng/lây lan/thay đổi"; "lúc nào tăng nhanh nhất" | **~16** | **"Tốc độ thay đổi và đạo hàm"** (chuyên đề KP thay cho B5 — L1) | ⑤ chuyển động: s → v → a, tính tại thời điểm / khi nào v, a đạt cực trị · ⑥ tốc độ thay đổi của đại lượng bất kỳ (dân số, thuốc, dịch, thể tích nón): ý nghĩa f′, dấu f′, max f′ · ⑦ tốc độ liên quan (thể tích ↔ chiều cao; ít, để làn 🟡) |
| **Tiệm cận trong mô hình** | "không bao giờ vượt / đạt đến", logistic, C(x)=300x/(100−x) | **~4** | **B3 Tiệm cận** | ⑧ tiệm cận ngang/đứng của hàm mô hình (giới hạn dài hạn, ngưỡng không đạt) |
| **Khảo sát toàn diện mô hình** (Đ/S 4 mệnh đề) | Đ/S: mỗi mệnh đề hỏi 1 KP khác (đơn điệu · cực trị · giới hạn · giá trị) | **~10** (Đ/S = 127/673) | **mỗi mệnh đề 1 dạng** (model Đ/S v2 đã có: `menh_de[].ma_dang`) | không đẻ dạng mới — mệnh đề về B1/B2/B3/⑤⑥ |
| Đọc đồ thị/biểu đồ thực nghiệm | biểu đồ mực nước biển | 1 | B1 (đọc đồ thị) | — |

- **Kết luận CTO:** 673 câu không cần chuyên đề riêng. Cần **8 dạng** (①–⑧) đặt vào B2 · B3 · chuyên đề "Tốc độ thay đổi"; dạng ②③④ mang thuộc tính
  `thuc_te` (phải mô hình hoá — đây mới là kĩ năng riêng, và là kĩ năng đề 2025+ nhắm tới). Dạng ① không cần thuộc tính (vỏ mỏng, phương pháp = B2 thuần).
- **Hai dạng cũ `T112020401/402` giữ mã, đổi tên** thành ② và ⑥? — KHÔNG: tên cũ cắt theo bề mặt, câu bên trong trộn cả 4 họ. Cách sạch: tạo 8 dạng mới,
  **chạy 673 câu như LÔ ĐẦU của dây chuyền** (agent gán lại vào ①–⑧ + làn 🟡/🔴, người duyệt), xong thì 2 dạng cũ về 0 câu ⇒ xoá theo Luật xoá. Đây cũng là
  bộ đề chấm tự nhiên cho skill ③ gán dạng: 673 câu, 8 dạng, ranh giới rõ.
- Số ước lượng từ mẫu 70 — con số thật có sau lô đầu.

## 4. Thứ tự chủ đề & luật phạm vi (C8) — cách lưu

- **Không nhét thứ tự vào mã.** Mã là danh tính, vị trí chỉ để hiển thị (CLAUDE.md §2). Mã chuyên đề cũ giữ nguyên nên không thể dựa vào thứ tự chữ số.
- Bảng mới nhỏ **`dai_chuyen_de_thu_tu (ma_chuyen_de PK, khoi, thu_tu smallint, la_thung boolean)`** — 1 dòng / chuyên đề, học thuật xếp 1 lần / khối.
  Phạm vi của chuyên đề `i` = mọi chuyên đề `thu_tu ≤ i` cùng khối **+ toàn bộ khối dưới** (V3-2), không gồm nhánh Hình. Chuyên đề `la_thung` ⇒ phạm vi = cả khối.
- Hàm đọc `fn_kho_pham_vi(ma_chuyen_de) → setof ma_chuyen_de` để T2/T3 hỏi "được dùng kiến thức nào" — công thức ở Postgres (§2.0).
- Khối khác (K9 có thùng "Ôn tập 8", "Đề thi đầu vào") xếp sau, cùng cơ chế.

## 5. Hồ sơ dạng (V3-3) — dùng cột/bảng đang có, không đẻ bảng mới

| Phần hồ sơ | Nằm ở đâu | Hiện trạng K12 | Ai điền |
|---|---|---|---|
| Dấu hiệu nhận biết (1–2 câu) | `dai_ban_do.mo_ta_ngan` | 0/77 | Claude nháp từ tên + LT + câu đã duyệt → học thuật sửa/gật |
| Kiến thức · phương pháp chuẩn | `dai_dang_ly_thuyet` | 46/77 | như trên |
| 2 câu mẫu | câu `da_duyet` của dạng (query, không lưu) | 46 dạng có ≥1 câu duyệt | tự động |
| Dạng hay nhầm | rút từ `kho_doi_dang_log` (ma trận nhầm) — chưa cần lưu | — | tự động, cập nhật cuối lô |
| Cụm bài | `dai_cum_bai` | K12 chưa có cụm | để sau lô đầu (CEO hoãn) |

Thứ tự điền: chuyên đề có nhiều câu chờ trước (C1 B5 · C4 · C3 · C5).

## 6. CEO / học thuật quyết

**Vòng 1 (CEO 28/09):** khung theo SGK — *"gần giống, không 100%"* ⇒ §2b · 673 câu — *"bỏ qua cái đã phân, đề xuất theo góc nhìn của CTO"* ⇒ §3b ·
**xoá 3 thứ rác: GẬT** (`T112070106` "." · `T11206`/`T1120602`/`T112060201` · `T1120301`) · **dạng seed nháp CTO: GẬT**.

**Vòng 2 (CEO 28/09):** **L2 · L3 · L4: GẬT** · **L1 KHÔNG gật** ⇒ giữ chuyên đề "Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn"
(B5 SGK), 8 dạng ①–⑧ nằm trong đó (không rải về B2/B3, không thuộc tính `thuc_te`) · **673 câu chạy như lô đầu: GẬT**.

**Còn chờ:** ai là "học thuật" duyệt bản đồ K12 (B6) — cần tên để đặt quyền màn đề xuất dạng/cụm.

## 6b. Khung đã chốt — bản build (migration `202609281833_khung_ban_do_k12.sql`, dry-run ROLLBACK 28/09 qua)

| TT | Chủ đề (mã) | Chuyên đề (mã) | Dạng | Ghi chú |
|---|---|---|---|---|
| 1–6 | I. Ứng dụng đạo hàm để KSHS (`T11201`) | Đơn điệu `T1120101` · Cực trị `T1120102` · GTLN–GTNN `T1120104` · Tiệm cận `T1120103` · **Khảo sát & vẽ `T1120105`** (11 dạng dời từ T11202 bậc 3 / b1/b1 / b2/b1, LT 3 chuyên đề nối lại) · **Thực tiễn `T1120106`** (2 dạng cũ 673 câu "đang phân lại" + 8 dạng mới ①–⑧) | 4·2·3·7·11·10 | `T11202` biến mất |
| 7–9 | II. Vectơ & hệ trục (`T11207`) | `T1120701` · `T1120702` · `T1120703` | 7·3·11 | xoá dạng "." |
| 10 | **III. Số đặc trưng độ phân tán (`T11209`)** | `T1120901` (L2 gộp B9+B10) | 7 mới | |
| 11–13 | IV. Nguyên hàm & tích phân (`T11204`) | Nguyên hàm `T1120401` (+2 dạng thực tế) · **Tích phân `T1120403`** (4 + 3 thực tế) · **ƯD hình học `T1120404`** | 8·7·6 | `T11205` biến mất; mã `T1120402` nghỉ |
| 14–17 | **V. PP toạ độ (`T11210`)** | mp `T1121001` · đt `T1121002` · góc `T1121003` (L4) · mặt cầu `T1121004` | 6·5·4·4 mới | |
| 18–19 | VI. XS có điều kiện (`T11208`) | `T1120801` (+3 dạng) · `T1120802` | 4·3 | xoá `T11206` |

Tổng sau migration: **6 chủ đề · 19 chuyên đề · 112 dạng** (77 − 2 rác + 37 mới). Thứ tự ở bảng `dai_chuyen_de_thu_tu`; UI Bản đồ sắp theo đó (`listDaiDang`).
Phạm vi C8: `fn_kho_pham_vi(ma_chuyen_de)`. 19 câu rác (đã xoá mềm) trỏ 2 dạng rác được dời về dạng chờ để FK cho xoá.

## 7. Sau khi chốt — việc build P1 (theo thứ tự)

| # | Việc | Ra cái gì |
|---|---|---|
| 1 | ✅ **Viết xong, dry-run qua, CHỜ ÁP:** `202609281833_khung_ban_do_k12.sql` — bảng `dai_chuyen_de_thu_tu` + `fn_kho_pham_vi` · 6 chuyên đề mới + 37 dạng seed kèm `mo_ta_ngan` · dời dạng bằng RPC `fn_dai_chuyen_chuyen_de`/`fn_dai_chuyen_dang` (**đổi mã** — quy tắc kho: mã dạng phải bắt đầu bằng mã chuyên đề; bảng đối chiếu cũ→mới ở đầu file) · xoá rác đã gật. Áp bằng `node scripts/migrate.mjs --only 202609281833_khung_ban_do_k12.sql` (sổ đang treo 13 file của phiên khác — KHÔNG `npm run migrate` trần). Công cụ mới `scripts/thu-migration.mjs` = chạy thử trong transaction rồi ROLLBACK. | Bản đồ K12 6/19/112 |
| 2 | ✅ **Viết xong, dry-run qua, CHỜ ÁP:** `202609282236_dai_de_xuat_dang_cum.sql` — 3 bảng theo mô hình invariant (`dai_de_xuat` = đề xuất · `dai_de_xuat_cau` = câu làm chứng · `dai_de_xuat_quyet_dinh` = quyết định của người, **chỉ ra đời khi đã quyết**; "đang chờ" = chưa có quyết định, không cột trạng thái) · RPC `fn_dai_de_xuat_ds` (đọc) · `fn_dai_de_xuat_quyet` (nhận / nhận có sửa / gộp / bác / trả lời — tạo dạng-cụm + dời câu trong cùng transaction, cần quyền ghi `bdkt`, câu đã duyệt không tự dời) · `fn_dai_de_xuat_tk` (đo skill ② theo lô). Màn: nút **💡 Đề xuất** (badge số chờ) trên Bản đồ kiến thức nhánh Đại → `DeXuatPanel.tsx`. | Chỗ cho làn 🟡 🔴 |
| 3 | Skill `kho-ban-do` (tương tác): lấy lô câu chờ theo chuyên đề → phép thử §2 → 3 làn; nháp `mo_ta_ngan` cho dạng thiếu | Lô đầu: C5 + C3 (chuyên đề mới, câu chờ rõ nhất) |
| 4 | Đo sau lô đầu: câu chờ K12 còn lại · tỉ lệ đề xuất nhận nguyên / sửa / bác · số câu phải hỏi người | Con số đầu tiên của skill ② |

Ngoài phạm vi P1: cụm bài K12 · hồ sơ dạng đầy đủ cho 77 dạng cũ (làm dần theo lô) · khối khác.
