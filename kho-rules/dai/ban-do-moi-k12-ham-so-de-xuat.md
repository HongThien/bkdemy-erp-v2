# Đề xuất bản đồ mới 4 tầng — K12 chủ đề "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số" (chương Hàm số)

> **Trạng thái:** ĐỀ XUẤT của CTO (21/10/2026) để Thùy duyệt/sửa. **Chưa ghi gì vào DB** — bản đồ là việc của CEO (`kho-rules/README.md` §0), Claude chỉ đưa tư liệu + đề xuất.
> Chủ đề giữ nguyên `NCD00094` (tên chương). Phần dưới là **chuyên đề → nhóm bài → dạng bài** (+ mô tả nhận biết, paste-ready).
> `[bắt buộc]` = nhóm cốt lõi; `[nâng cao]` = đề xuất `bat_buoc = false` (không chặn "xong chuyên đề").

## 0. Cơ sở (đã đối chiếu 4 nguồn độc lập)

| Nguồn | Phạm vi đọc | Đếm |
|---|---|---|
| **Từ Tâm** (Chương 1) | 4 bài P1 lý thuyết+ví dụ, P2 luyện | 25 dạng tác giả · 71 ví dụ · 216 câu |
| **NBV** (12-1…12-7) | A lý thuyết, B tự luận, C TN, D Đ/S, E TLN, F nâng cao | 12-1: 166 · 12-2: 204 · 12-3: 172 · 12-4: 185 · 12-5: 162 · 12-6: 208 · 12-7: 2 đề × 22 |
| **PNL** (Chương 1, 5 bài) | 20 file "Dạng" + 5 đề + đề khảo sát | B1: 178 · B2: 136 · B3: 144 · B4: 153 · B5: 170 · đề: 110 |
| **Đề thi trên ERP** | 117 đề giữa kì I K12 (tab Kho đề thi) | **1.698 câu Hàm số**, đếm theo nhóm cũ; thêm 327 câu/ý Hàm số từ 25 đề GK1+HK1 của NBV |

Hạn chế (nói thẳng): hình BBT/đồ thị không xem được (phân loại theo lời dẫn); phân loại câu của sách là của từng agent đọc, có sai lệch ±1–2/nhóm; **bộ `BO DE PNL 12 - NEW.rar` không giải nén được** (tên file trong rar hỏng) nên chưa đọc; vài đề trường chỉ có `.doc` chưa đọc (nhưng đề trường đã có trên ERP nên không thiếu bằng chứng). Số "đề có kiểu này" ở §0.2 đếm theo **nhóm cũ** của ERP — nhóm cũ vốn lẫn nhiều kiểu nên chỉ đọc là xu hướng.

### 0.1 Ba tác giả chia chương theo ba trục khác nhau
- **Từ Tâm**: theo *nguồn dữ liệu của đề* (công thức / BBT-đồ thị) rồi tham số, hàm hợp, thực tế rải cuối mỗi bài.
- **NBV**: sách chỉ chia 2 dạng thô ("thuần" / "ứng dụng") + dạng nâng cao theo *phương pháp*; phần trắc nghiệm/Đ-S/TLN **không chia dạng** (kiểu câu phải tự rút).
- **PNL**: theo *loại bài* (đơn điệu+cực trị chung, tiệm cận, khảo sát theo loại hàm, thực tế 5 dạng); mỗi "Dạng" thực chất gom 4–9 kiểu.
- Cả ba **đều dùng chung bộ xương 5 bài SGK**: Đơn điệu–Cực trị · GTLN–GTNN · Tiệm cận · Khảo sát · Ứng dụng thực tế ⇒ bộ xương chuyên đề đề xuất bám đó.

### 0.2 Tín hiệu từ 117 đề giữa kì (ERP) — phân bố theo chuyên đề đề xuất
| Mảng | Câu | % trong 1.698 | Nhóm cũ nổi nhất (số đề có mặt/117) |
|---|---|---|---|
| Ứng dụng thực tiễn | 431 | 25,4% | "mô hình có sẵn" 107 đề · "thực tế có biểu thức" 99 đề |
| Đơn điệu | 333 | 19,6% | công thức 85 đề · BBT/đồ thị 103 đề · f' đồ thị/BBT 36 đề |
| GTLN–GTNN | 272 | 16,0% | khi biết hàm 102 đề · BBT/đồ thị 93 đề |
| Cực trị | 253 | 14,9% | qua BBT/đồ thị 100 đề · cho trước 75 đề |
| Khảo sát/đồ thị | 221 | 13,0% | đồ thị bậc 3 59 đề · 2/1 36 · 1/1 43 |
| Tiệm cận | 188 | 11,1% | TCX 72 đề · TCN 46 · TCĐ 41 · định nghĩa 10 |
⇒ **Xương sống đề giữa kì** = {đọc BBT/đồ thị, tính trên hàm cho sẵn, nhận dạng đồ thị, mô hình thực tế}. Thực tế chiếm ¼ đề — chuyên đề này phải đủ nhóm để đo được.
NBV GK1+HK1 (10 + 15 đề, 327 câu/ý Hàm số, đếm bằng script): thực tế 90 (27%), đồ thị–BBT 65, GTLN 44, tiệm cận 43, đơn điệu 42, cực trị 31 — cùng xu hướng. **Giữa kì ≠ cuối kì:** giữa kì thiên về hàm cho bằng công thức (xét đơn điệu bằng công thức: 6/10 đề GK1 nhưng 1/15 đề HK1; TCX bậc 2/bậc 1 chỉ có ở GK1); cuối kì thiên về đọc BBT/đồ thị và thực tế (thực tế 35% dòng HK1, 21% dòng GK1). Phần trả lời ngắn gần như toàn thực tế mức vận dụng (52/56 dòng); VD+VDC là 101 dòng, 73 dòng là thực tế ⇒ nhóm N7.x là nơi phân hoá điểm cao.

### 0.3 Luật tôi dùng để cắt tầng (khớp mẫu NH–TP Thùy đã chuẩn `NCD00095`)
1. **Nhóm bài** = một "việc chung" HS làm được/không như một khối, **có lý thuyết chung**, đủ câu để đo (kho cũ: 100–250 câu/nhóm lớn).
2. **Dạng bài** = *dấu hiệu đề* hoặc *phương pháp* khác nhau trong nhóm — **không** chia theo số liệu hay độ khó.
3. Nhóm chia theo **việc phải làm** (đọc hình / tính trên công thức / tìm tham số / hàm hợp / mô hình), không chia theo loại hàm; loại hàm xuống tầng dạng bài. Riêng Khảo sát (§CĐ5) chia theo *kỹ năng* vì kỹ năng là cái đo được xuyên loại hàm.
4. **Hàm hợp / tham số m rải trong từng chuyên đề** (không lập chuyên đề riêng) — 3 tác giả đều dạy hàm hợp và tham số *ngay trong bài đang học*, và HS yếu thường yếu đúng ở nhóm ấy ⇒ bổ trợ cần chỉ đúng chỗ.
5. Kiểu có ≥2/3 tác giả (hoặc có trong đề ERP nhiều đề) mới thành dạng bài; kiểu chỉ 1 nguồn, vài câu → **không** lập dạng (ghi ở §3).

Nhãn nhân chứng: **T** Từ Tâm · **N** NBV · **P** PNL · **Đ** đề thi ERP/NBV. Dạng nào chỉ có 1 nhân chứng đánh dấu ⚠.

---

## 1. Cây đề xuất (7 chuyên đề · 37 nhóm · ~105 dạng bài)

### CĐ1. Tính đơn điệu của hàm số
**N1.1 Xét tính đơn điệu khi biết hàm số** `[bắt buộc]` — *cho công thức y=f(x), tìm khoảng đồng biến/nghịch biến; quy trình TXĐ→y'→BBT*
- D1.1.1 Hàm đa thức, phân thức — *y' là đa thức/phân thức, lập BBT* (T N P Đ)
- D1.1.2 Hàm chứa căn, mũ, log, trị tuyệt đối, lượng giác — *phải tìm TXĐ/bỏ GTTĐ trước khi xét dấu y'; chọn hàm đồng biến trên ℝ trong 4 hàm* (N P)

**N1.2 Đọc tính đơn điệu từ bảng biến thiên, đồ thị của f** `[bắt buộc]` — *đề cho hình, chỉ đọc*
- D1.2.1 Từ bảng biến thiên (T N P Đ)
- D1.2.2 Từ đồ thị của f — *đồ thị đi lên/xuống* (T N P Đ)

**N1.3 Đơn điệu của f khi biết f′** `[bắt buộc]` — *đề cho dữ kiện về đạo hàm, hỏi tính chất của f*
- D1.3.1 Bảng xét dấu / đồ thị của f′ — *f′ nằm trên/dưới Ox* (N P Đ; T)
- D1.3.2 f′ cho bằng biểu thức tích nhân tử — *chú ý nghiệm bội chẵn không đổi dấu* (N P)

**N1.4 Đơn điệu của hàm hợp g=f(u(x)) khi biết f′** `[nâng cao ✱]` — *g′=u′·f′(u)*
- D1.4.1 g=f(u(x)) từ đồ thị/bảng xét dấu f′, không tham số (T N)
- D1.4.2 g=f(u(x))+v(x) (thêm hàm phụ) (N)

**N1.5 Tìm m để hàm số đơn điệu** `[bắt buộc]`
- D1.5.1 Hàm bậc 3 đơn điệu trên ℝ — *y′≥0 ∀x ⇔ a>0, Δ′≤0; xét a=0 khi a chứa m* (T N P)
- D1.5.2 Hàm nhất biến đơn điệu trên từng khoảng xác định — *ad−bc>0* (T N P)
- D1.5.3 Hàm nhất biến / bậc 3 đơn điệu trên một khoảng cho trước — *thêm điều kiện −d/c ∉ khoảng; cô lập m* (T N P)
- D1.5.4 Hàm phân thức bậc 2/bậc 1 đơn điệu (N P)
- D1.5.5 Hàm lượng giác/log/căn/mũ — *đặt t=u(x), đổi miền* (T N P)
- D1.5.6 Hàm chứa trị tuyệt đối ⚠(N)
- D1.5.7 Hàm ẩn/hợp có tham số trong biến, vd f(x+m), f(x²+mx) (N P)

### CĐ2. Cực trị của hàm số
**N2.1 Tìm cực trị khi biết hàm số** `[bắt buộc]`
- D2.1.1 Hàm bậc 3 (T N P Đ)
- D2.1.2 Hàm trùng phương/bậc 4 (N P)
- D2.1.3 Hàm phân thức (T N P)
- D2.1.4 Hàm mũ, log, căn, lượng giác, x·eˣ… (N P)
- D2.1.5 Hàm không có đạo hàm tại điểm cực trị / hàm chia khúc ⚠(N)

**N2.2 Đọc cực trị từ bảng biến thiên, đồ thị của f** `[bắt buộc]` — *phân biệt điểm cực trị (x) · giá trị cực trị (y) · điểm cực trị của đồ thị (x;y)*
- D2.2.1 Từ bảng biến thiên (T N P Đ)
- D2.2.2 Từ đồ thị của f (T N P Đ)

**N2.3 Cực trị khi biết f′** `[bắt buộc]`
- D2.3.1 Bảng xét dấu / đồ thị của f′ (N P Đ)
- D2.3.2 f′ cho bằng biểu thức nhân tử — *chỉ đếm nghiệm bội lẻ* (N P)
- D2.3.3 Số cực trị của g=f(x)+ax khi biết đồ thị f′ — *đếm giao điểm đồ thị f′ với y=−a* (N)

**N2.4 Tìm m / hệ số liên quan đến cực trị** `[bắt buộc]`
- D2.4.1 Điều kiện có/không có/có đúng 2 cực trị — *Δ′ của y′; xét a=0* (N P)
- D2.4.2 Đạt cực trị tại điểm cho trước; tìm hệ số từ điểm cực trị (N P Đ)
- D2.4.3 Hệ thức Viète giữa x₁, x₂ (N P)
- D2.4.4 Vị trí hai điểm cực trị: so với trục, cùng/khác phía, đối xứng, cách đều (N P)
- D2.4.5 Hàm trùng phương: ba cực trị tạo tam giác đặc biệt (N P)
- D2.4.6 Hàm bậc 2/bậc 1 có cực đại & cực tiểu (N P)

**N2.5 Đường thẳng qua hai điểm cực trị và hình học các điểm cực trị** `[bắt buộc]` *(kế thừa nhóm cũ T112010511, 20 câu/15 duyệt)*
- D2.5.1 Phương trình đường thẳng qua hai điểm cực trị — *chia y cho y′ lấy phần dư* (N P)
- D2.5.2 Độ dài AB, khoảng cách từ O tới AB, diện tích tam giác OAB (N P)
- D2.5.3 Quan hệ của AB với đường/điểm khác: song song, vuông góc, đối xứng (N P)

**N2.6 Số cực trị của hàm hợp và hàm chứa trị tuyệt đối** `[nâng cao]` *(~30 câu NBV 12-2/F)*
- D2.6.1 |f(x)| hoặc f(|x|) — *số cực trị = nghiệm bội lẻ + cực trị còn lại* (N)
- D2.6.2 Hàm hợp f(u(x)) không GTTĐ, đếm cực trị (N T)
- D2.6.3 Hàm hợp có GTTĐ (N)
- D2.6.4 Tìm m để f(u(x,m)) có số cực trị cho trước (N)

### CĐ3. Giá trị lớn nhất – giá trị nhỏ nhất
**N3.1 Đọc GTLN–GTNN từ bảng biến thiên, đồ thị** `[bắt buộc]`
- D3.1.1 Từ đồ thị của f — *điểm cao/thấp nhất trong đoạn; tính M±m, 2M−m* (T N P Đ)
- D3.1.2 Từ bảng biến thiên / bảng xét dấu f′ — *chú ý khoảng mở, giá trị giới hạn* (T N P Đ)
- D3.1.3 Từ đồ thị f′ kèm giả thiết nối f(a), f(b)… (N)

**N3.2 GTLN–GTNN khi biết hàm số** `[bắt buộc]`
- D3.2.1 Hàm đa thức trên đoạn — *3 bước: nghiệm y′, f ở nghiệm và 2 mút* (T N P Đ)
- D3.2.2 Hàm phân thức trên đoạn (T N P)
- D3.2.3 Hàm căn thức (N P)
- D3.2.4 Hàm lượng giác, mũ, log (N P)
- D3.2.5 Trên khoảng/nửa khoảng/ℝ — *lập BBT có giới hạn đầu mở, có thể không tồn tại* (T N P)

**N3.3 GTLN–GTNN có tham số m** `[bắt buộc]`
- D3.3.1 Cho GTLN (GTNN) = k, tìm m (T N P)
- D3.3.2 Hàm y=|f(x)+m|: max/min bằng a, không vượt quá M, đạt nhỏ nhất, tổng/tích max+min (T N P — NBV F có 8 phương pháp)
- D3.3.3 PT/BPT chứa m dùng max–min: m ≥ f(x) nghiệm đúng, có nghiệm (T N)

**N3.4 GTLN–GTNN nâng cao** `[nâng cao]`
- D3.4.1 Hàm hợp f(u(x)) với f cho bởi BBT/đồ thị f′ (N)
- D3.4.2 Biểu thức nhiều biến có ràng buộc → đưa về 1 biến; đánh giá Cô-si/Bunhiacopxki (T N)

### CĐ4. Đường tiệm cận của đồ thị hàm số
**N4.1 Tìm tiệm cận đứng và tiệm cận ngang khi biết hàm số** `[bắt buộc]`
- D4.1.1 Hàm bậc nhất/bậc nhất — *TCĐ x=−d/c, TCN y=a/c* (T N P Đ)
- D4.1.2 Đếm tiệm cận của phân thức hữu tỉ — *rút gọn nghiệm trùng tử–mẫu* (T N P Đ)
- D4.1.3 Hàm chứa căn, trị tuyệt đối — *hai giá trị TCN khi x→±∞* (T N P)

**N4.2 Tìm tiệm cận xiên khi biết hàm số** `[bắt buộc]`
- D4.2.1 Hàm bậc 2/bậc 1 — *chia đa thức* (T N P Đ)
- D4.2.2 Hàm đã tách phần nguyên y=ax+b+r/(x+d) (N)
- D4.2.3 Hàm chứa căn: a=lim f/x, b=lim(f−ax) (N P)

**N4.3 Đọc tiệm cận từ bảng biến thiên, đồ thị, giới hạn** `[bắt buộc]`
- D4.3.1 Từ đồ thị (đứng/ngang/xiên) (T N P Đ)
- D4.3.2 Từ bảng biến thiên, đếm TCĐ+TCN (T N P Đ)
- D4.3.3 Từ giới hạn cho trước / theo định nghĩa (N; T 1 câu) ⚠ *nhóm cũ có 32 câu nhưng chỉ N nêu rõ*
- D4.3.4 Hàm hợp g=1/(f(x)+m), 1/(2f(x)−1) — *số TCĐ = số nghiệm f=−m* (T N P) `[nâng cao]`

**N4.4 Tiệm cận có tham số m** `[bắt buộc]`
- D4.4.1 Tìm m để có/không có/có đúng k tiệm cận (N P Đ)
- D4.4.2 Tiệm cận cho trước ⇒ tìm hệ số a, b, m (T N P)

**N4.5 Hình học của tiệm cận** `[bắt buộc]`
- D4.5.1 Giao hai tiệm cận, tâm đối xứng (N P)
- D4.5.2 Khoảng cách từ M∈(C) tới hai tiệm cận: tích hằng số, tổng nhỏ nhất (T N P)
- D4.5.3 Diện tích hình tạo bởi tiệm cận và trục tọa độ; tiệm cận xiên cắt trục (N P)
- D4.5.4 Góc giữa hai tiệm cận / giữa đường thẳng và tiệm cận ⚠ *nhóm cũ T112010309 (10 câu, 2 duyệt); nguồn gần như không có* — giữ chờ Thùy quyết

### CĐ5. Khảo sát và nhận dạng đồ thị hàm số (bậc ba · bậc nhất/bậc nhất · bậc hai/bậc nhất)
> Chia theo **kỹ năng**; loại hàm xuống dạng bài. (Bản cũ: 11 nhóm theo loại hàm × hệ số/đồ thị/cực trị.)

**N5.1 Khảo sát sự biến thiên và vẽ đồ thị** `[bắt buộc]` — *tự luận, sơ đồ 7 bước*
- D5.1.1 Hàm bậc 3 (T N P)
- D5.1.2 Hàm bậc nhất/bậc nhất (T N P)
- D5.1.3 Hàm bậc 2/bậc nhất (viết dạng tách) (T N P)

**N5.2 Nhận dạng hàm số ↔ đồ thị ↔ bảng biến thiên** `[bắt buộc]` — *cho hình chọn công thức, hoặc ngược lại*
- D5.2.1 Hàm bậc 3 (T N P Đ)
- D5.2.2 Hàm bậc nhất/bậc nhất (T N P Đ)
- D5.2.3 Hàm bậc 2/bậc nhất (T N P Đ)

**N5.3 Xác định dấu và giá trị các hệ số** `[bắt buộc]` *(thay 3 nhóm "hệ số" cũ 503/506/509)*
- D5.3.1 Dấu a, b, c, d từ đồ thị/BBT hàm bậc 3 — *a: hướng; d: cắt Oy; b,c: tổng/tích nghiệm y′* (T N P Đ)
- D5.3.2 Hệ số của hàm bậc nhất/bậc nhất — *TCĐ, TCN, giao trục* (T N P Đ)
- D5.3.3 Hệ số của hàm bậc 2/bậc nhất, y=ax+b+c/(x+d) (T N P)
- D5.3.4 Lập công thức hàm số từ điều kiện (điểm đi qua, cực trị cho trước) (N P)

**N5.4 Đọc tính chất của đồ thị cho sẵn; số nghiệm f(x)=m** `[bắt buộc]`
- D5.4.1 Đọc đơn điệu, cực trị, GTLN, giao trục từ đồ thị cho sẵn (N P Đ)
- D5.4.2 Số nghiệm f(x)=m, f(x)=k bằng đồ thị/BBT (T N P Đ)
- D5.4.3 Tâm đối xứng của đồ thị: tìm và chứng minh (N P)

### CĐ6. Các bài toán liên quan đến đồ thị `[nâng cao ✱ — Thùy quyết có giữ trong chương không]`
**N6.1 Tương giao của đồ thị với đường thẳng/trục**
- D6.1.1 Số giao điểm theo m (m nguyên) — *PT hoành độ, cô lập m + BBT* (N P T)
- D6.1.2 Hoành độ giao điểm thỏa hệ thức: Viète, cấp số cộng/nhân (N P)
- D6.1.3 Hình học trên giao điểm: AB=, trung điểm, trọng tâm, diện tích (N P)

**N6.2 Tiếp tuyến của đồ thị** *(kế thừa nhóm cũ T112010512, 20 câu)*
- D6.2.1 Tiếp tuyến tại điểm cho trước / tại tâm đối xứng (N P)
- D6.2.2 Tiếp tuyến song song/vuông góc đường cho trước (N P)
- D6.2.3 Tiếp tuyến cắt hai tiệm cận (hàm 1/1): diện tích, AB nhỏ nhất (N P)

**N6.3 Điểm di động trên đồ thị** — khoảng cách nhỏ nhất đến điểm/đường; hai điểm ở hai nhánh; cặp điểm đối xứng qua tâm; điểm tọa độ nguyên (N P)

**N6.4 Phương trình hợp và hàm hợp từ đồ thị bậc 3** — f(f(x))=m, f(x³−3x)=m, |f(…)|=m; đếm nghiệm qua đồ thị/BBT từng lớp (N 20 câu ⚠ chỉ NBV)

### CĐ7. Ứng dụng đạo hàm giải quyết vấn đề thực tiễn
> Nay 2 "thùng" cũ (T601 348 câu + T602 266 câu, "đang phân lại") — tách theo **loại mô hình** vì mỗi mô hình có cách lập hàm riêng.

**N7.1 Tối ưu khi hàm mô hình đã cho sẵn** `[bắt buộc]` *(kế thừa T603)* — *đề cho P(t), C(x)… hỏi lớn nhất/nhỏ nhất, khi nào*
- D7.1.1 Tìm GTLN/GTNN trên miền thực tế của hàm đã cho (lợi nhuận, nồng độ, nhiệt độ, công suất) (T N P Đ)
- D7.1.2 Tìm tham số của mô hình (a, b, c) từ điều kiện cực trị/điều kiện đầu (N P)
- D7.1.3 Hàm mô hình + hỏi khoảng tăng–giảm, ý nghĩa thực tiễn (N P T)

**N7.2 Tối ưu phải lập hàm từ hình học** `[bắt buộc]` *(kế thừa T604)*
- D7.2.1 Hộp, bể, lon: thể tích/diện tích cố định, vật liệu/chi phí nhỏ nhất (cắt góc, gập tấm) (T N P Đ)
- D7.2.2 Diện tích/chu vi hình phẳng lớn nhất: khung cửa, hcn nội tiếp, hàng rào (N P)
- D7.2.3 Cắt/uốn dây thành hai hình (N P)
- D7.2.4 Parabol, đồ thị bậc 3 đặt trong hệ tọa độ (cổng, cầu, đường): lập hàm, tìm hệ số (N P)

**N7.3 Tối ưu khoảng cách, đường đi, góc** `[bắt buộc]` *(kế thừa T606)*
- D7.3.1 Đường đi qua hai môi trường (bơi–chạy, ống dưới sông, hai vận tốc/đơn giá) (N P)
- D7.3.2 Khoảng cách ngắn nhất: điểm–đồ thị/đường, cầu, hai vật chuyển động (N P)
- D7.3.3 Thang/sào/ống qua góc hành lang chữ L (N P) `VDC`
- D7.3.4 Góc nhìn/góc chiếu lớn nhất (N P) `VDC`

**N7.4 Tối ưu kinh tế** `[bắt buộc]` *(kế thừa T605)*
- D7.4.1 Giá–cầu tuyến tính ("giảm giá a thì bán thêm b"): doanh thu/lợi nhuận lớn nhất (N P Đ)
- D7.4.2 Lợi nhuận = doanh thu − chi phí cho sẵn (có thuế, ràng buộc sản lượng) (N P)
- D7.4.3 Chi phí trung bình nhỏ nhất (N P)
- D7.4.4 Số máy, lô hàng tối ưu (chi phí thiết lập + vận hành/lưu kho) (P N)

**N7.5 Chuyển động: quãng đường – vận tốc – gia tốc** `[bắt buộc]` *(kế thừa T607)*
- D7.5.1 Cho s(t): tính v, a tại thời điểm; chiều chuyển động; tăng/giảm tốc (T N P)
- D7.5.2 Vận tốc/gia tốc lớn nhất (GTLN của đạo hàm) (T N P)

**N7.6 Tốc độ thay đổi của một đại lượng** `[bắt buộc]` *(kế thừa T608)*
- D7.6.1 Ý nghĩa của đạo hàm: tốc độ tăng dân số, truyền bệnh, phản ứng; chi phí biên (N P)
- D7.6.2 Mô hình tăng trưởng (logistic, bậc 3): thời điểm tốc độ lớn nhất (N P)

**N7.7 Tốc độ liên quan giữa hai đại lượng** `[nâng cao]` *(kế thừa T609 — hiện 0 câu; 15 câu PNL B5-D5, 0 ở NBV/Từ Tâm ⚠)*
- D7.7.1 Quan hệ hình học đạo hàm theo t: thang trượt, khoảng cách ra-đa, dây–ròng rọc (P)
- D7.7.2 Thể tích nước dâng, diện tích thay đổi theo thời gian (P)

**N7.8 Tiệm cận và giới hạn dài hạn trong mô hình** `[bắt buộc]` *(kế thừa T610, 1 câu; nguồn có ~46 câu NBV 12-4 + PNL B3-D4)*
- D7.8.1 Mô hình bão hòa cho sẵn: nồng độ/dân số "không vượt quá", TCN là giá trị ngưỡng (N P T)
- D7.8.2 Tự lập hàm nồng độ/chi phí trung bình rồi tìm TCN/TCX (N P)
- D7.8.3 TCĐ trong chi phí làm sạch C=kp/(100−p): "không thể đạt 100%" (N P)

---

## 2. Bảng đối chiếu nhóm cũ → nhóm mới (để xếp lại câu, B3)

| Nhóm cũ | → Nhóm mới | Ghi chú |
|---|---|---|
| T112010101 (đơn điệu BBT/đồ thị) | N1.2 | |
| T112010102 (đơn điệu khi biết hàm) | N1.1; **một phần là tham số** → N1.5 | cần đọc từng câu |
| T112010103 / 104 (hàm phức tạp theo f′) | N1.3 (f′ thường) · N1.4 (hàm hợp) | |
| T112010201 (cực trị cho trước) | N2.1 (+ N2.4 phần tham số) | |
| T112010202 (cực trị BBT/đồ thị) | N2.2 · N2.3 | tách f vs f′ |
| T112010301 / 303 (TCN / TCĐ) | N4.1 | gộp |
| T112010305 (TCX) | N4.2 | |
| T112010306 (TCX BBT/đồ thị) | N4.3 | |
| T112010307 (tiệm cận hàm căn) | D4.1.3 / D4.2.3 | thành dạng bài |
| T112010308 (tiệm cận bằng định nghĩa) | D4.3.3 | |
| T112010309 (góc đường thẳng–tiệm cận) | D4.5.4 ⚠ | hỏi Thùy |
| T112010401 / 402 (GTLN BBT / hàm) | N3.1 / N3.2 | |
| T112010403 (ứng dụng GTLN) | N7.x theo mô hình | chuyển sang CĐ7 |
| T112010503 / 506 / 509 (hệ số 3 loại hàm) | N5.3 | gộp |
| T112010504 / 507 / 510 (đồ thị 3 loại hàm) | N5.2 · N5.4 | tách nhận dạng vs đọc tính chất |
| T112010505 (cực trị bậc 3) | N2.4 | chuyển chuyên đề |
| T112010508 / 513 (khoảng cách tới tiệm cận) | N4.5 (D4.5.2) | |
| T112010511 (đường thẳng qua 2 cực trị) | N2.5 | chuyển chuyên đề |
| T112010512 (tiếp tuyến cơ bản) | N6.2 | |
| T112010601 / 602 (2 thùng thực tế) | N7.1–N7.8 | **cần B3 đọc lại từng câu** (777 câu trong kho) |
| T112010603–610 | N7.1–N7.8 (kế thừa mô tả Thùy đã viết) | |

## 3. Đề xuất KHÔNG lập dạng riêng (quá ít/chỉ 1 nguồn) — ghi để khỏi mất
- Chứng minh bất đẳng thức bằng đơn điệu (N: 1 câu) · mệnh đề lý thuyết về đơn điệu/phép toán hàm (N: ~3) · biện luận nghiệm PT bằng cực trị (N: 3 ý) → xếp vào nhóm gần nhất khi B3.
- "Mệnh đề Đúng–Sai 4 ý về một hàm cụ thể" (NBV 9+36 câu): đây là **hình thức câu hỏi**, không phải dạng bài; mỗi ý thuộc dạng riêng → để kỹ thuật quyết cách đo (từng ý) chứ không lập nhóm.
- Ghép hai hàm (giao TCĐ của f với TCX của g), hàm 2 tham số lạ (N/T: < 5 câu mỗi loại).

## 4. Việc cần Thùy quyết (R1: đây là *đích* hay *hiện tại*?)
1. **CĐ7 tách 8 nhóm theo mô hình** (bản cũ 10 nhóm, trong đó 2 thùng 777 câu "đang phân lại") — đồng ý cách cắt theo *loại mô hình*? Nhóm N7.7 (tốc độ liên quan) chỉ 1 nguồn, 0 câu trong kho: giữ `[nâng cao]` hay bỏ?
2. **CĐ6** (tương giao, tiếp tuyến, điểm di động, phương trình hợp) — sách rất nhiều (≈100 câu nâng cao) nhưng **bản cũ không có chuyên đề này** và CT chương 1 SGK không đòi. Giữ trong chương Hàm số, hay để thành chủ đề riêng/bỏ?
3. **Tham số m + hàm hợp rải trong từng chuyên đề** (đề xuất) hay gom thành chuyên đề "Bài toán tham số" riêng?
4. **Khảo sát chia theo kỹ năng** (nhận dạng · hệ số · đọc tính chất · vẽ) thay vì theo loại hàm như bản cũ/Từ Tâm/PNL.
5. **Tiệm cận tách TCĐ-TCN / TCX / đọc hình** (3 nhóm theo cách làm) thay vì 7 nhóm cũ hoặc 1 nhóm (như cả 3 tác giả).
6. Nhóm `[nâng cao]` đặt `bat_buoc=false`: N1.4, N2.6, N3.4, CĐ6, N7.7 — ổn?
7. **Bản nháp hiện tại trong ERP** (chuyên đề "Các đặc trưng của hàm số" gom đơn điệu/GTLN/tiệm cận/cực trị vào một chuyên đề) — đề xuất này *tách* thành 4 chuyên đề; Thùy có ý định khác thì nói.

## 5. Chưa làm / bước kế
- Chưa ghi gì vào `dai_bdm_*`. Khi Thùy chốt cấu trúc: dựng nhóm/dạng bài + **mô tả nhận biết** (đã có sẵn dòng in nghiêng ở trên), rồi điền lý thuyết/ví dụ (dây chuyền Sonnet soạn → Opus soát như K9, `ban-do-moi-k9-ghi-chu.md`), sau đó B3 xếp câu (cao ⇒ ghi, chưa chắc ⇒ hàng duyệt).
- Hồ sơ nguồn chi tiết (bảng kiểu câu + số câu + trích dẫn file/câu): thư mục tạm của phiên (`hoso-tutam.md`, `hoso-nbv-1-2.md`, `hoso-nbv-3-4.md`, `hoso-nbv-5-6-7.md`, `hoso-pnl-1-2.md`, `hoso-pnl-3-5.md`) — **chưa lưu vào repo**; muốn giữ thì nói, tôi chép vào `kho-rules/dai/lo/k12/ho-so/`.
- Câu trùng lặp trong sách (NBV nhiều cặp trùng nguyên văn; PNL bể muối ≥4 lần, dân số ≥8 lần) → khi nhập kho phải khử trùng, số câu ở bảng trên là số đếm thô.
