# Quy tắc chấm bài Toán — bản đề xuất v0.1 (05/11/2026)

> **Trạng thái: NHÁP, chờ CEO chốt.** Gom từ `cham_bai/QUY-TAC-CHAM.md` (chấm BTVN 18/10–03/11),
> `cham_MT_T10/THANG-DIEM-VA-QUY-TAC-CHAM-MT-T10.md` (MT tháng 10) và các quyết định CEO trong đợt
> chấm MT 03–05/11. Mục có nhãn **⚠ CHỜ CHỐT** là chỗ các quy tắc cũ đang mâu thuẫn nhau — xem §D.
> Áp cho cả người chấm (TA) lẫn máy chấm (Claude). Mỗi lần chấm phải ghi lại đã dùng phiên bản rule nào.

Cấu trúc: **A. Phần chung** (mọi khối) → **B. Theo cấp** (Tiểu học · THCS · THPT) → **C. Theo khối**
(thang điểm + đặc thù) → **D. Mâu thuẫn cần chốt** → **E. Lịch sử phiên bản**.

---

## A. PHẦN CHUNG — áp cho mọi khối

### A1. Ba kết quả của một câu (hoặc một ý)

| Kết quả | Nghĩa | Điểm |
|---|---|---|
| **Đ** | Đúng: kết quả đúng, hướng làm đúng, lập luận đủ. Lỗi nhãn/ký hiệu nhỏ không làm sai lập luận vẫn là Đ (kèm nhận xét). | Trọn điểm |
| **C** | Chưa hoàn chỉnh: hướng làm đúng nhưng có lỗi thật — sai một bước tính, thiếu lý do then chốt, thiếu kết luận, làm dở. | Có điểm một phần (§A2) |
| **S** | Sai: sai phương pháp, sai từ đầu, không chứng minh được, bỏ trống câu có trên bài. | 0 |

- Trắc nghiệm, trả lời ngắn, điền đáp số: **chỉ Đ hoặc S** (không có C).
- **"Không có bài" ≠ S.** Câu không có trên ảnh/scan (thiếu trang, ảnh cắt mất) thì **để trống**, không ghi gì — thiếu data là không có dòng (luật §1.5 CLAUDE.md). Chỉ ghi S khi thấy rõ chỗ làm bài của câu đó mà em bỏ trống.

### A2. Tính điểm (máy/DB tính, người chấm chỉ chọn Đ/C/S và mức C)

1. **Mọi điểm là bội của 0,25.** Không có 0,125 · 0,19 · 0,13…
   ⚠ Ngoại lệ duy nhất đang có: câu Đúng/Sai 4 ý của THPT (thang 0,1 — xem §B3, chờ chốt).
2. **Câu 0,25 điểm mà C ⇒ 0 điểm** (vẫn ghi C để biết em làm gần đúng).
3. **Câu từ 0,5 điểm trở lên mà C ⇒ vẫn có điểm**, mức theo lỗi:
   - lỗi nhẹ (thiếu lý do then chốt, thiếu kết luận, chưa làm tròn đúng yêu cầu): **trừ khoảng 25%**;
   - sai một bước nhưng phương pháp đúng / làm được một nửa: **trừ khoảng 50%**;
   - sau đó **làm tròn xuống bội 0,25**. Câu 0,5 mà C thì thường là 0,25.
4. **Tổng điểm tối đa 10.** Chỉ được 10 khi **Đ tất cả các câu**; cộng lại ≥ 10 mà chưa Đ hết ⇒ ghi **9,75**.
5. Ý nhỏ cùng một ô (vd K9 câu 17 = ý 1 + ý 2, mỗi ý 0,75): chấm từng ý, ô = tổng hai ý; Đ khi đủ cả hai, S khi cả hai 0, còn lại C.

> Công thức trên phải nằm ở **một hàm Postgres** (`fn_*`), không viết lại ở prompt hay ở code app
> (luật §2.0). Người/máy chấm chỉ đưa ra: kết quả (Đ/C/S) + mức C (nhẹ / một bước) + loại lỗi.

### A3. Đọc bài — chỉ chấm cái nhìn thấy rõ

1. **Phóng to trước khi kết luận** mọi đáp số, chữ số, dấu (+/−, ≤/≥), số mũ, đơn vị.
2. **Chữ viết tay nhập nhằng không bị trừ** nếu kết quả cuối đúng và mọi cách đọc hợp lý đều khớp
   (H/N, C/O, M/N, P/B, 3/5, 6/8, 1/7, "(cm)" giống "6m"…). Chỉ trừ khi đọc rõ 100% là sai.
   - Nghi chép nhầm tên đỉnh: tên đó có **tồn tại trong hình/đề** không? Không tồn tại ⇒ đọc theo đỉnh hợp lý nhất, không trừ.
   - Không cách đọc nào khớp đáp án đúng ⇒ S (đừng mặc định Đ).
3. **Phần em đã gạch xoá = bỏ qua**, không chấm, không nhận xét. Chỉ chấm dòng còn hiệu lực.
4. **Nét gạch/chữ mờ không phải bằng chứng em đã sửa.** Thấy dấu sai rõ thì vẫn là sai.
5. Trắc nghiệm khoanh 2 vòng / tô 2 ô / tẩy xoá không rõ ⇒ **cần người xem**, không tự chọn.
6. Soát **từng dòng**, đừng dừng ở lỗi đầu tiên. Bất đẳng thức: kiểm chiều dấu mỗi lần nhân/chia/nghịch đảo.
7. Kiểm chỗ ghi ở lề (ĐKXĐ, đơn vị, kết luận hay viết ở lề/cạnh đề) trước khi nhận xét "thiếu".

### A4. Thiếu bài, thiếu trang

| Tình huống | Xử lý |
|---|---|
| Scan/ảnh thiếu trang chứa câu đó (MT, bài in) | **Để trống**, ghi "thiếu trang câu X", báo người xin bổ sung. Không ghi S. |
| Có trang, có chỗ làm câu đó, em bỏ trống | **S** + dòng "Con làm thiếu câu X" ở đầu trang 1 |
| Ảnh BTVN phụ huynh gửi thiếu trang (số trang phiếu nhảy cóc) | ⚠ CHỜ CHỐT (§D6) — đề xuất: đánh dấu "thiếu ảnh", TA xác nhận là em không làm (S) hay gửi thiếu (để trống) |
| Ảnh cắt mất một phần câu | Không kết luận, cần người xem |
| Nhiều bài trong một file (bài cả lớp) | Xác định đúng trang của từng em bằng họ tên + mã đề trên phiếu; không gán theo thứ tự |

### A5. Bảng lỗi chung (theo nhóm lỗi — sau này nối vào bộ `ma_loi` E01… của ERP)

| Nhóm lỗi | Ví dụ | Kết quả đề xuất |
|---|---|---|
| **Kết quả sai** | đáp số sai, thiếu nghiệm, thiếu trường hợp | S (tự luận: C nếu hướng đúng và chỉ sai bước cuối) |
| **Sai phương pháp** | dùng "ước" cho bài "tìm x để P nguyên" (x không nói nguyên) — đáp số trùng vẫn sai | S |
| **Biểu thức trung gian sai, cuối tự đúng lại** | viết −5/+5 rồi dòng sau mới ra 3; chép 234000 thay 23400; thiếu hệ số chung | ⚠ CHỜ CHỐT (§D5) — đề xuất C |
| **Sai một bước tính, phương pháp đúng** | lập đúng phương trình, tính sai một phép | C (trừ ~50%) |
| **Thiếu lý do** | thiếu "vì Ax là tiếp tuyến", thiếu "hai góc so le trong" | ⚠ CHỜ CHỐT (§D1) — đề xuất: lý do hiển nhiên ⇒ Đ + nhận xét; lý do then chốt ⇒ C |
| **Thiếu kết luận** | làm đúng hết nhưng "Vậy…" bỏ dở / không có câu trả lời | C |
| **Lỗi nhãn, ký hiệu** | ghi g.g thay c.g.c; gọi nhầm "so le trong" thay "đồng vị"; sai thứ tự đỉnh tam giác đồng dạng mà tỉ số vẫn đúng | ⚠ CHỜ CHỐT (§D2, §D3) — đề xuất Đ + nhận xét, nếu lập luận vẫn đúng |
| **Thêm giả thiết ngoài đề** | đề chỉ "vuông", em dùng "vuông cân" | S nếu lập luận dựa vào giả thiết đó |
| **Lập luận vòng / nhảy bước** | dùng chính điều cần chứng minh; "OA là trung trực" mà thiếu OB = OC | C hoặc S tuỳ bước nhảy có then chốt không |
| **Đơn vị** | m² thay cm³; "nghìn đồng" gán cho ẩn là số lần | ⚠ CHỜ CHỐT (§D4) |
| **Điều kiện (ĐKXĐ, điều kiện ẩn)** | không đặt ĐKXĐ / không đối chiếu điều kiện khi loại nghiệm | C |
| **Trình bày bài lời văn** | không gọi ẩn, không lập phương trình, chỉ tính số | C (lỗi trình bày) — chờ chốt §D8 |
| **Không phải lỗi** | viết tắt "(L)" thay "(loại)"; đặt ẩn phụ A = biểu thức trong ngoặc rồi xét A − k; dùng "[" và "{" lẫn nhau khi người chấm còn nghi | Không trừ, không nhận xét |

### A6. Theo loại câu (dùng chung mọi khối)

- **Trắc nghiệm A–D:** Đ/S theo đáp án Bản GV đúng mã đề. Câu có 2 đáp án khoanh ⇒ cần xem.
- **Trả lời ngắn / điền đáp số:** Đ/S. Chấp nhận dạng tương đương (2/4 = 0,5; viết thập phân/phân số) trừ khi đề yêu cầu dạng cụ thể (làm tròn đến…, phân số tối giản…).
- **Tự luận tính toán, giải phương trình/bất phương trình:** chấm theo từng dòng; dòng sai viết ra là lỗi (xem A5).
- **Chứng minh hình:** chấm theo **chuỗi lập luận**, không chỉ kết luận. Mỗi ý (a, b, c…) chấm riêng theo thang của ý đó. Ý sau được dùng kết quả ý trước (kể cả khi ý trước làm sai) — chỉ chấm phần lập luận của ý đang chấm.
- **Toán thực tế / bài lời văn:** cần gọi ẩn + điều kiện, lập phương trình/hệ, giải, đối chiếu điều kiện, trả lời có đơn vị. Đọc kỹ đại lượng: "lợi nhuận" ≠ "doanh thu", "mỗi xe" ≠ "cả đội", giờ ≠ phút.
- **Câu chỉ có đáp số (không có lời giải) ở câu tự luận:** ⚠ CHỜ CHỐT (§D7) — đề xuất C nếu đáp số đúng, S nếu sai.
- **Câu nâng cao 0,25 điểm:** chỉ Đ (0,25) hoặc 0 (C hoặc S).

### A7. Đáp án và kiến thức

1. **Tự giải câu quan trọng trước**, rồi đối chiếu Bản GV. Bản GV có thể sai (đã gặp: K6 Câu 2 ghi A trong khi đúng là D) ⇒ ghi "cần xem", không chấm theo đáp án sai.
2. **Cách làm khác đáp án nhưng đúng ⇒ Đ.**
3. **Giới hạn kiến thức theo thời điểm học:** chỉ dùng kiến thức em đã học tới thời điểm làm bài để giải mẫu và để hạ điểm. Em dùng cách ngoài chương trình mà đúng thì vẫn Đ (kèm nhận xét).
4. Chưa có đề gốc ⇒ không kết luận Đ cho câu có từ khoá dễ bẫy; chấm "chưa chắc" và xin đề.

### A8. Nhận xét và đánh dấu trên bài

- Câu đúng: chỉ chữ **Đ** đỏ cạnh cuối bài làm câu đó, không nhận xét.
- Câu sai/C: khoanh (khung chữ nhật cũng được) đúng chỗ sai + **một dòng nhận xét** ngay cạnh dòng sai, dạng **"<lỗi> vì: <lý do>. Đúng: <đáp án>"** — nói lỗi trước, lý do sau.
- Nhận xét phải đủ để học sinh hiểu ("Phải là A, không phải P"), không cụt kiểu "Sửa: A".
- Không đè/chạm chữ học sinh; cỡ chữ nhận xét ≈ cỡ chữ viết tay của em trên ảnh đó.
- Điểm ghi ở đầu mỗi câu: `Đ 0,5` · `C 0,25/0,5` · `S 0/0,5`; tổng ghi ở ô ĐIỂM trang 1 (bài MT).
- **BTVN: không ghi tổng Đ/C/S vào ô ĐIỂM** (CEO 07/11) — tạm thời CEO tự tính điểm; chỉ đánh dấu từng câu.
- Câu thiếu: một dòng ở đầu trang 1 "Con làm thiếu câu X".

### A9. Khi nào phải "cần người xem" (không tự quyết)

Chữ số/dấu quyết định kết quả mà không đọc chắc · trắc nghiệm khoanh 2 vòng · Bản GV nghi sai ·
đề mơ hồ · thiếu trang/ảnh cắt · bài không rõ của em nào · em làm cách lạ mà người chấm chưa chắc đúng.
Máy chấm phải **tô vàng** các ô này để TA xem trước khi xác nhận.

---

## B. THEO CẤP

### B1. Tiểu học (khối 3–5)
- Chưa có dữ liệu chấm thật của Claude (K3–5 chưa chấm đợt nào) — **mục này để trống, bổ sung sau đợt chấm đầu tiên**.
- Gợi ý cần chốt: có chấm trình bày/chữ viết không · có yêu cầu "đáp số" ở bài lời văn không · đề 4A và 4T khác nhau.

### B2. THCS (khối 6–9)
- Áp toàn bộ phần A.
- Bài hình nhiều ý: thang từng ý theo §C; ý sau dùng kết quả ý trước được.
- Đề MT có phần **Nâng cao** (các câu 0,25) cộng vào tổng nhưng tổng vẫn tối đa 10.

### B3. THPT (khối 10–12)
- K10, K11 (MT tháng 10): Phần I trắc nghiệm 28 câu × 0,25 · Phần II trả lời ngắn 6 câu × 0,5.
- K12 (mẫu đề tốt nghiệp): Phần I 12 câu × 0,25 · **Phần II Đúng/Sai 4 câu, mỗi câu 4 ý: đúng 1 ý 0,1 · 2 ý 0,25 · 3 ý 0,5 · 4 ý 1** · Phần III 6 câu × 0,5.
  ⚠ CHỜ CHỐT (§D9): mức 0,1 trái quy tắc "bội 0,25".
- Bài làm trên phiếu tô (OMR): đọc ô tô; ô mờ/tô 2 ô/tẩy ⇒ cần xem, không đoán.

---

## C. THEO KHỐI — thang điểm + đặc thù

Thang MT tháng 10 (nguồn ERP `tai_lieu.cau_hinh.diemByCau`; mã đề 2, 3 dùng chung điểm với mã đề 1 theo số thứ tự câu):

| Khối | Thang điểm theo câu | Đặc thù |
|---|---|---|
| 6 | 1–12: 0,25 · 13–21: 0,5 · 22, 23: 1 · 24–27: 0,25 (nâng cao) | — |
| 7 | 1–12: 0,25 · 13–19: 0,5 · Hình 20–23 = ý a 1 · b 0,75 · c 0,75 · d 0,5 · 24–27: 0,25 | Đề 7B không có phần nâng cao |
| 8 | 1–12: 0,25 · 13–19: 0,5 · Hình 20–24 = ý a 1 · b 0,75 · c 0,75 · d 0,25 · e 0,25 · 25–28: 0,25 | Ý d, e là câu 0,25 ⇒ C = 0 |
| 9 | 1–8: 0,25 · 9–12: 0,5 · 13, 14: 1 · 15: 0,5 · Hình 16 (a) 1 · 17 (b) 1,5 = 2 ý × 0,75 · 18 (c) 0,5 · 19–22: 0,25 | HK1: không dùng góc nội tiếp, tứ giác nội tiếp, Viète, PT bậc hai… |
| 10, 11 | 1–28: 0,25 · 29–34: 0,5 | Chỉ Đ/S |
| 12 | xem §B3 | Phiếu tô |

Mỗi khối cần bổ sung dần: danh sách kiến thức đã học theo tháng · dạng bài hay bẫy · ví dụ mẫu Đ/C/S (ảnh thật).

---

## D. MÂU THUẪN CẦN CEO CHỐT

| # | Vấn đề | Quy tắc cũ A | Quy tắc cũ B | Đề xuất |
|---|---|---|---|---|
| D1 | Thiếu lý do | BTVN 18/10: đúng nhưng thiếu lý do ⇒ **Đ** + nhận xét | MT 03/11: thiếu lý do ⇒ **C** trừ 25% | Lý do hiển nhiên ⇒ Đ + nhận xét · lý do then chốt (bước quyết định) ⇒ C |
| D2 | Chép sai tên đỉnh/ký hiệu | BTVN 26/10: biểu thức/ký hiệu sai viết ra ⇒ **không Đ** | Rà Hình MT 05/11: lỗi nhãn nhỏ, lập luận đúng ⇒ **Đ** | Lập luận vẫn đúng ⇒ Đ + nhận xét · nhãn sai làm lập luận sai ⇒ C/S |
| D3 | Sai thứ tự đỉnh tam giác đồng dạng | BTVN 28/10: chưa Đ | MT 05/11: Đ (Vân Trang) | Tỉ số dùng đúng ⇒ Đ + nhận xét |
| D4 | Sai đơn vị ở kết luận | BTVN: khoanh + vẫn Đ (chờ xác nhận) | — | Đơn vị đọc rõ sai ⇒ C; đơn vị viết tay nhập nhằng ⇒ không trừ |
| D5 | Dòng giữa sai, cuối tự đúng lại | BTVN 18/10: không Đ | — (chưa có Đ/C/S lúc đó) | C |
| D6 | Ảnh BTVN thiếu trang | BTVN 27/10: trang không có = em không làm | MT: thiếu trang ⇒ để trống | Máy đánh dấu "thiếu ảnh", TA chọn: em không làm (S) / gửi thiếu (để trống) |
| D7 | Câu tự luận chỉ có đáp số | — | MT: "cần xem" (Thắng Tùng 7A1) | Đáp số đúng ⇒ C · sai ⇒ S |
| D8 | Bài lời văn làm tắt, không gọi ẩn | BTVN 27/10: lỗi trình bày, phải nêu | — | C |
| D9 | Đúng/Sai THPT 0,1 điểm | Quy tắc bội 0,25 | Thang chuẩn Bộ GD 0,1/0,25/0,5/1 | Giữ thang Bộ cho riêng loại câu này |

---

## E. LỊCH SỬ PHIÊN BẢN

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v0.1 | 05/11/2026 | Bản nháp đầu: gom quy tắc BTVN 18/10–03/11 + MT tháng 10 + quyết định CEO 03–05/11 (C câu 0,25 = 0, bội 0,25, chữ khó đọc không trừ, lỗi nhãn nhỏ ⇒ Đ, thiếu trang ⇒ để trống) |
