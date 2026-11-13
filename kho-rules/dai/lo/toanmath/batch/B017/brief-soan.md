# ⚠️⚠️ BẢN ÁP DỤNG BATCH B017 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 7 TẢI TỪ TOANMATH (2 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief khối 7 đã chạy thật cho bộ đề GIỮA kì 1 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, khuôn lời giải, cổng, bẫy đọc ảnh: GIỮ NGUYÊN.
Bộ đề CUỐI kì 1 khối 7 (bộ scan `BỘ-ĐỀ-CKI-7`, 14/10, 13 đề đã ghi lên Kho đề thi — mẫu `Repo\kho-rules\dai\lo\k7\CKI-02.soan.md`, `CKI-11.soan.md`) đã chạy với
brief này + các điểm khác dưới đây. Chỉ khác những điểm sau:

- `<MA>` = `B017-NN` (01–02). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B017\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong `goc.pdf`), `hd` (trang HƯỚNG DẪN CHẤM).
- `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B017\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
  Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B017\<MA>.soan.md`; tệp kiểm (trạm soát): `…\B017\<MA>.kiem.md`.
- **Chỉ trang ĐỀ (`de`) là đề.** `goc.pdf` là NGUYÊN file tải về: có thể có trang ma trận / bản đặc tả đứng trước, trang hướng dẫn chấm (`hd`) và trang quảng cáo
  cuối ("Xem thêm …toanmath.com") — bỏ qua ma trận và quảng cáo, KHÔNG chép vào đề. Mở đúng ảnh `trang\p-<số trang>.png` theo `de`.
  - **B017-01 Hát Môn:** 14 trang (ảnh đánh số 2 chữ số `p-01.png`…`p-14.png`) — p1–7 ma trận + đặc tả · **p8–10 ĐỀ (`p-08`, `p-09`, `p-10`)** · p11–13 hướng dẫn chấm · p14 quảng cáo.
  - **B017-02 Phan Đình Giót:** 5 trang (`p-1.png`…`p-5.png`) — **p1 ĐỀ** (1 trang, 5 bài tự luận) · p2–5 hướng dẫn chấm.
- **Hai file có lớp chữ nhưng PHÔNG HỎNG** (`pdftotext` ra chữ mất dấu, phân số vỡ) ⇒ **đọc từ ẢNH trang**, không dùng chữ máy trích. Chữ nhỏ thì phóng 300–400 dpi, không đoán.
- **⭐ Hướng dẫn chấm CHỈ để tham khảo. Mục tiêu vẫn là lời giải CHI TIẾT đầy đủ** (đúng khuôn 2 phần của brief), không viết bản sơ lược, KHÔNG chép nguyên văn hướng dẫn chấm.
  Trạm soạn và trạm soát đều **tự giải trước**, chỉ SAU ĐÓ mới mở trang `hd` để đối chiếu. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; hướng dẫn chấm sai thì giữ đáp án đúng +
  `**Ghi chú:** hướng dẫn chấm ghi … , đúng là …`. Trả lời cuối của trạm nói rõ: có hướng dẫn chấm không, khớp bao nhiêu câu.
  Mọi đáp số thử lại bằng máy (`node -e`); chỗ nào chưa tự kiểm chứng được bằng máy ⇒ `**Chưa chắc:**`.
- **⚠️ Đã biết trước — B017-01 Hát Môn Bài 4** ("Cho $A=5+5^2+5^3+…+5^{2022}$. Chứng tỏ rằng $A$ chia hết cho 806"): **mệnh đề SAI** — máy tính thẳng (BigInt): $A$ chia
  hết cho 31 nhưng $A \bmod 26 = 4$, $A \bmod 806 = 186$. Hướng dẫn chấm nhóm $(5+5^3)+(5^2+5^4)+…$ thành bội của 26, nhưng 2022 số hạng không chia hết thành các
  nhóm 4 số liên tiếp (2022 = 4.505 + 2) nên lập luận đó sai. ⇒ KHÔNG chứng minh điều sai: giữ đề nguyên văn, lời giải chứng minh phần đúng ($A\ \vdots\ 31$) và chỉ ra
  vì sao không chia hết cho 26, thêm `**Ghi chú:** đề in sai — A không chia hết cho 806 (A chia 806 dư 186); hướng dẫn chấm ghép nhóm sai` + `**Chưa chắc:** đề sai, chờ Thùy
  quyết giữ/sửa/bỏ câu`. Trạm soát kiểm lại bằng máy.
- **Tên đề (dòng `# ĐỀ |`):** `Đề kiểm tra cuối học kì 1 Toán 7 năm <năm học> — <don_vi> (<mã đề / "đề chính thức" nếu có>)`. `nam:` lấy từ `ds-de.json`. Đối chiếu tiêu đề trên ảnh;
  lệch thì theo ảnh + `## GHI CHÚ CHO NGƯỜI DUYỆT`. Hai đề đều in "ĐỀ CHÍNH THỨC", 90 phút. (Mọi chỗ "giữa học kì 1" trong brief bên dưới đọc thành "cuối học kì 1".)
- `bo_sach: KNTT` — 2 đề đã qua bước phân loại bộ sách ở trạm chuẩn bị (không hình khối, không tỉ lệ thức; xem `batch\B017\bo.md`). Vẫn thấy câu kì 2 ⇒ DỪNG, báo ở trả lời cuối.
- **⭐ PHẠM VI KIẾN THỨC — cuối học kì 1 KNTT (thay mục whitelist "phạm vi GKI" của `k7.md` §1 luật 1 và mục Kiến thức của brief bên dưới; chép đúng phạm vi đã dùng
  cho 13 đề CKI 14/10 — "Mọi câu nằm trong phạm vi cuối học kì 1 (Chương I–V)", GHI CHÚ của `CKI-11.soan.md`):** KNTT Toán 7 **Tập 1** =
  - **Chương I Số hữu tỉ · Chương II Số thực** — như bản giữa kì (`k7.md` §1–§2, khuôn Phần 2 theo nhóm bài).
  - **Chương III Góc và đường thẳng song song** — góc kề bù, đối đỉnh, tia phân giác, hai đường thẳng song song và dấu hiệu nhận biết, tiên đề Euclid, tính chất,
    định lí – giả thiết – kết luận – chứng minh định lí (whitelist `k7-ly-thuyet-hinh7.md`: HH00020–28, HH00112).
  - **Chương IV Tam giác bằng nhau** — tổng ba góc của tam giác (HH00001), hai tam giác bằng nhau, các trường hợp c.c.c · c.g.c · g.c.g, các trường hợp bằng nhau của tam giác
    vuông, **tam giác cân, đường trung trực của đoạn thẳng** (HH00099–104; mẫu lập luận: `CKI-02`, `CKI-11`, `CKI-19` trong `Repo\kho-rules\dai\lo\k7\`).
  - **Chương V Thu thập và biểu diễn dữ liệu** — phân loại dữ liệu (là số / không là số), bảng thống kê, biểu đồ đoạn thẳng, biểu đồ hình quạt tròn (đọc %, tính số lượng
    từ %). Câu thống kê ⇒ `kho=dai`. Bài "vẽ biểu đồ" ⇒ lời giải lập bảng + tả cách vẽ, `**Ghi chú:** lời giải chưa có hình vẽ` (như `CKI-11` Bài 3).
  - **CẤM (kiến thức tập 2 / lớp trên):** tỉ lệ thức, dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận/nghịch (Ch. VI) · biểu thức đại số, đa thức (Ch. VII) · xác suất (Ch. VIII) ·
    quan hệ góc–cạnh đối diện, bất đẳng thức tam giác, đường xiên – đường vuông góc, các đường đồng quy (Ch. IX) · hình khối (Ch. X) · hằng đẳng thức, Pytago, đồng dạng,
    đường trung bình (lớp 8+). Bài cần một kết quả ngoài phạm vi ⇒ tự lập luận bằng cái đã học; không làm được ⇒ `**Chưa chắc:**`.
    Vd B017-02 Bài 5 ($A=(2x-5)^2-(15-6x)^2-\left|x-y-1\right|+2024$): viết $15-6x=(-3).(2x-5)$ rồi dùng luỹ thừa của một tích — KHÔNG hằng đẳng thức.
  - Kiến thức lớp 6 (chia hết, ước – bội, số nguyên tố) vẫn dùng được cho bài nâng cao.
- **⭐ Phân kho (đè mục 3.4 của brief bên dưới):** mọi câu hình học (góc, song song, tam giác, chứng minh hình, tính góc trên hình) là **`kho=hinh_hoc`** (dạng chờ `HH07000000`,
  `k7.md` §7 Q2) — KHÔNG dùng `kho=hgt` (cổng khối 7 chỉ nhận `dai` / `hinh_hoc`). Còn lại `kho=dai` (số, thống kê, bài thực tế về số).
- **Đúng/Sai nhiều mệnh đề** (Hát Môn Phần II Câu 13): phần ghi `## PHẦN <n> | Trắc nghiệm đúng sai | tu_luan`, câu `loai=tu_luan` `dap_an=—`, xét từng mệnh đề +
  `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận` (như `CKI-02` Câu 7). Trả lời ngắn (Hát Môn Câu 14, 15): `tra_loi_ngan` chỉ khi đáp số là MỘT số vừa 4 ô; Câu 14 hỏi hai số $x$, $y$ ⇒ `tu_luan`.
- **⭐ Mã chạy cổng (đè mục 5 của brief soạn và bước 8 của brief soát — PHẢI có `--khoi 7`, thiếu là cổng chạy luật khối 6 và chặn `hinh_hoc`):**
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B017/<MA>.soan.md --lam-viec "C:/Users/Admin/bk-kho-lam-viec/de-thi/toanmath/B017/<MA>" --khoi 7 --chi-kiem`
- **Trạm soát — ảnh cho CEO:** lưu vào `Repo\kho-rules\dai\lo\toanmath\batch\B017\can-xem\<MA>_<nhãn>.png`; cột "Trang trong PDF gốc" = số trang trong `goc.pdf` của đề
  (không phải `BỘ-ĐỀ-GKI-7`). Mọi chỗ "kiểm tra giữa kì" trong brief soát đọc thành "cuối kì 1" với phạm vi kiến thức ở trên.
- Năm học 2024–2025 hay 2025–2026 đều theo **cùng phạm vi kiến thức cuối học kì 1** như trên.

---

# Brief giao trạm SOẠN — khối 7, bộ đề GKI (bước 1–2, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B017\<MA>`.
> Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k7-brief-soat.md`) chạy Opus.
> Dựng từ `k6-brief-soan.md` (đã qua CEO duyệt khuôn). Chỗ khác K6: không có phần tiếng Anh · không có máy gõ (`de.boc.json` chỉ có 2 trường) ·
> đề trộn bộ sách · có Hình (§3 mục 4).

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra giữa kì 1 Toán 7: **đọc đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\toanmath\batch\B017\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh cắt vào `<LV>\img\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k7.md` — luật giải + trình bày khối 7 (kiến thức được dùng §1, khuôn Phần 2 theo nhóm bài §2, định dạng §3).
2. `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` — **mẫu KHUÔN TỆP đã CEO duyệt (khối 6)**. Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2.
   Nội dung toán là khối 7 — chỉ lấy hình thức.
3. Câu có Hình (góc, song song, tam giác): xem mẫu lập luận `Repo\docs\log-giai-hinh-hoc-bai.md` (đọc mục R1, R2 và "đề tự đủ dữ kiện").
   Lý thuyết Hình 7 trên ERP (whitelist kiến thức hình): `Repo\kho-rules\dai\lo\k7-ly-thuyet-hinh7.md` (dump từ DB 10/10).

## 2. Nguồn của đề

- `<LV>\trang\p-1.png`, `p-2.png`… — **ảnh từng trang, NGUỒN DUY NHẤT** (scan 150 dpi, không có lớp chữ). Mở HẾT mọi trang bằng công cụ Read.
- `<LV>\goc.pdf` — để cắt hình / phóng to (lệnh ở mục 3.8).
- `<LV>\de.boc.json` chỉ có `file` + `sha256` — **không có nội dung**, đừng tìm.
- `<LV>\img\` — thư mục TRỐNG lúc đầu; hình tự cắt (mục 3.8).

## 3. Việc phải làm

1. **Chép đề** từng câu từ ảnh: chữ, số, công thức, đủ 4 phương án, đủ các ý, không sót, không thừa. Đề có "ĐỀ 1 / ĐỀ 2" khác nhau trên cùng file ⇒ chỉ làm
   đề đầu tiên và ghi vào `## GHI CHÚ CHO NGƯỜI DUYỆT`.
2. **Lỗi in của đề** (sai chính tả, lệch số câu, thiếu dấu) ⇒ sửa tối thiểu cho đề đúng nghĩa + dòng `**Ghi chú:** …` nói đã sửa gì.
   `Ghi chú` chỉ dành cho lỗi của ĐỀ GỐC và điều người duyệt cần biết về câu.
3. **Bỏ** ô họ tên, khung điểm, hướng dẫn chấm, ma trận / bảng đặc tả (nếu kèm), trang trắng.
4. **Phân kho** từng câu: `kho=hgt` = hình học (góc kề bù / đối đỉnh / phân giác / song song, tam giác, hình hộp chữ nhật, lăng trụ đứng, lập phương,
   thể tích, diện tích xung quanh, vẽ hình); `kho=dai` = còn lại (số hữu tỉ, luỹ thừa, số thực, căn bậc hai, giá trị tuyệt đối, làm tròn, toán thực tế về số).
   Câu thực tế có hình khối (bể nước, phòng học…) ⇒ `hgt` nếu đáp số đòi tính thể tích / diện tích hình khối, `dai` nếu chỉ là %, tiền.
5. **Tách ý — CHỈ bài "Thực hiện phép tính / Tính" và "Tìm $x$"**: mỗi ý một câu, nhãn `Bài 1a`, `Bài 1b`…; đề của câu = lời dẫn của bài + biểu thức của ý
   (vd `Thực hiện phép tính (tính hợp lí nếu có thể): $…$`, `Tìm $x$, biết: $…$`). **Mọi bài khác GIỮ CHUNG một câu** (lời văn, hình, chứng minh, thực tế —
   kể cả khi có ý a) b)); Phần 2 ghi `a)` `b)`. **Ngoại lệ:** "Bài" chỉ là vỏ gom 2 BÀI TOÁN KHÁC HẲN NHAU (đánh số 1) 2), mỗi bài một bộ dữ kiện) ⇒ mỗi bài toán
   MỘT câu, nhãn `Bài 5.1`, `Bài 5.2`, `kho` theo từng bài toán. Ý a) b) c) của CÙNG một bài toán vẫn giữ chung.
6. **Loại câu:** `trac_nghiem` (đủ 4 dòng `A. ` `B. ` `C. ` `D. `) · `tra_loi_ngan` CHỈ khi đáp số là MỘT số viết được trong 4 ô (chữ số, dấu `-` đầu,
   dấu `,` thập phân; vd `3000`, `-12`, `2,5`; 5 chữ số trở lên thì KHÔNG; phải đổi đơn vị mới vừa 4 ô thì KHÔNG; phân số `\dfrac{a}{b}` thì KHÔNG) ·
   còn lại `tu_luan` (`dap_an=—`). **Câu Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`**, đề giữ đủ các mệnh đề a) b) c) d), lời giải xét từng mệnh đề, thêm
   `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`. Câu "điền vào chỗ trống" có đáp số một số ⇒ `tra_loi_ngan` nếu vừa 4 ô, ngược lại `tu_luan`.
7. **Giải** mọi câu theo `k7.md`, lời giải 2 phần (mục 4). **Mọi đáp số phải thử lại** (thay ngược vào đề / tính lại bằng cách khác; số lớn thì `node -e`).
8. **Hình:** câu nào đề có hình thì thêm dòng `**Hình:** <tên tệp trong img>` (một tệp; nhiều hình nhỏ của cùng một câu ⇒ một ảnh chung).
   Tự cắt từ PDF (toạ độ pixel đo trên ảnh trang 150 dpi):
   `pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/img/<tên-không-đuôi>"`
   rồi MỞ ảnh vừa cắt kiểm: đúng hình của câu, không cụt, không dính chữ câu khác. Tên kiểu `p1c5` (trang 1, câu 5). Bài yêu cầu VẼ hình ⇒ vẫn nhập,
   lời giải tả từng bước vẽ, thêm `**Ghi chú:** lời giải chưa có hình vẽ`.
   **Đề bằng chữ nhưng hình là một phần dữ kiện** (số đo góc, kích thước ghi trên hình) ⇒ BẮT BUỘC có `**Hình:**` và số liệu phải chép cả vào phần Đề
   (đề tự đủ dữ kiện, như bài HH00112).
9. **Không chắc 100% thì NÓI RA** — thêm dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu. CEO xem kĩ đúng những câu này, đừng giấu và đừng ghi tràn lan.
   Ghi khi: ảnh mờ không đọc chắc một số / kí hiệu · đề có hai cách hiểu · đề in lỗi làm không có / có hai phương án đúng · phải dùng kiến thức ngoài SGK 7 ·
   hình trong đề mâu thuẫn dữ kiện chữ (ưu tiên hình, nói rõ) · lời giải theo một quy ước bạn đoán.
10. Cuối tệp mục `## GHI CHÚ CHO NGƯỜI DUYỆT`: câu đã bỏ (vì sao), bộ sách của đề (KNTT / Chân trời / Cánh Diều — đoán theo nội dung nếu đề không ghi), nhận xét
    chung. Không có gì thì ghi "Không".

## 4. Khuôn tệp và khuôn lời giải (máy kiểm — sai là bị từ chối)

Đầu tệp:

```
# ĐỀ | Đề kiểm tra giữa học kì 1 Toán 7 năm 2025-2026 — THCS <tên trường>, <quận / phường / xã> (mã đề …)
nam: 2025
bo_sach: KNTT
thoi_gian_phut: 90

## PHẦN 1 | Trắc nghiệm | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** …
A. …
B. …
C. …
D. …
**Hình:** p1c5.png
**Ghi chú:** …
**Chưa chắc:** …

**Phần 1. Hướng dẫn**

**Mấu chốt:** …

**Bước 1.** …

**Bước 2.** …

**Bước 3.** …

**Chú ý:** …

**Phần 2. Trình bày**

…

Chọn A.
```

- `nam` = năm đầu của năm học. `bo_sach` = luôn `KNTT` (CEO 10/10: **chỉ dùng sách Kết nối tri thức**; đề thuộc bộ sách khác đã bị loại ở bước phân loại, không tới đây — nếu bạn thấy đề này rõ ràng KHÔNG phải KNTT, DỪNG và báo ở trả lời cuối, đừng soạn). `thoi_gian_phut` = số phút ghi trên đề (không ghi ⇒ 90).
  Tên đề: "giữa học kì 1".
- `## PHẦN <n> | <tên> | <trac_nghiem|tu_luan|tra_loi_ngan>` — theo các phần của đề, đánh số từ 1. Phần Đúng/Sai ⇒ `tu_luan` (mục 3.6).
- `### <nhãn gốc của đề: Câu 3 / Bài 2a> | kho=… | loai=… | dap_an=…`. Các dòng `**Hình:**`, `**Ghi chú:**`, `**Chưa chắc:**` là tuỳ chọn, mỗi loại một dòng,
  đứng SAU đề và phương án, TRƯỚC `**Phần 1. Hướng dẫn**`.
- **Đề** chép nguyên văn (đã sửa lỗi in), mọi công thức trong `$…$`. Đề nhiều dòng thì xuống dòng đơn. Ký hiệu góc `\widehat{xOy}`; song song `\parallel`;
  vuông góc `\perp`; độ `^\circ`; chu kì `0,(3)`; hỗn số `2\dfrac{1}{3}`; giá trị tuyệt đối `\left|x\right|`.
- **Phần 1 — khuôn CARD, bắt buộc đúng từng chữ:** đoạn `**Phần 1. Hướng dẫn**` → đoạn `**Mấu chốt:** …` (một câu: điều phải nhận ra) →
  **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn đoạn `**Chú ý:** …` và / hoặc `Thử lại: …`. Các đoạn cách nhau MỘT dòng trống;
  trong một bước không có dòng trống. Mỗi bước là một **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ít nhất 5 chữ ngoài công thức, **không ghi đáp số cuối**,
  không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài ngắn ⇒ tách đúng thao tác thật thành 3 bước.
- **Phần 2** = đúng cái học sinh viết vào bài kiểm tra, theo khuôn nhóm bài ở `k7.md` §2. Mỗi dòng viết / mỗi phép tính một đoạn (cách nhau dòng trống).
  Bài tính mở bằng dòng chép lại biểu thức. Tìm $x$ theo cột. Câu trắc nghiệm: dòng cuối cùng phải đúng là `Chọn X.` (X trùng `dap_an`).
  **Hình:** mỗi khẳng định kèm lý do trong ngoặc `(hai góc kề bù)`, `(hai góc so le trong)`, `(giả thiết)`…; kết ý bằng `Vậy …`; nêu rõ vì sao tia nằm giữa
  trước khi cộng góc.
- **Định dạng:** dấu nhân là dấu chấm như SGK (`$25.4$`, `$\dfrac{-5}{11}.\dfrac{4}{13}$`, `$2.\left(x+\dfrac12\right)$`) — CẤM `\cdot`, `\times` · chia `:` ·
  phân số `\dfrac` · số trong công thức viết liền (`125000`) · số thập phân dùng dấu phẩy `0,25` · chữ tiếng Việt trong công thức bọc `\text{…}` ·
  đơn vị `$cm^2$`, `$cm^3$`, `(m)` · số âm trong phép tính để trong ngoặc `$(-4)$`.
- **Kiến thức:** theo `k7.md` §1. Quy tắc chuyển vế ĐƯỢC DÙNG. Không dùng kiến thức lớp 8+ (hằng đẳng thức, Pytago, đồng dạng, lượng giác, đa thức).

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B017/<MA>.soan.md --lam-viec "<LV>" --chi-kiem
```

## 6. Trả lời cuối

Vài dòng: số câu theo loại · các câu có `Chưa chắc` (nhãn + một câu lí do) · câu đã bỏ · bộ sách đoán · cổng đã đạt chưa.

## 7. Bẫy đọc ảnh đã cắn thật (đọc kĩ)

- **Kí hiệu "không chia hết"** ở ảnh 150 dpi rất dễ đọc nhầm thành "chia hết" (GKI-21 khối 6 lật ngược đáp án Đúng/Sai) — gặp ⇒ cắt phóng to 400 dpi.
- **K7 thêm:** dấu trừ trước phân số / số mũ nhỏ ($(-2)^3$ ↔ $-2^3$) · dấu gạch trên chu kì · hỗn số hay bị đọc thành phép nhân · dấu `|…|` · căn $\sqrt{\ }$
  dài ngắn · chỉ số của góc ($\widehat{A_1}$) · hình lăng trụ: số đo ghi trên hình khối thường nhỏ, phóng to trước khi chép.
- Không chắc ⇒ phóng to từ `goc.pdf` (`pdftoppm -r 400 …`), không đoán.
