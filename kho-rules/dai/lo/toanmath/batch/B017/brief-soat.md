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

# Brief giao trạm SOÁT — khối 7, bộ đề GKI (10/10)

> `<MA>` = mã đề. `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B017\<MA>`. Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Dựng từ `k6-brief-soat.md`.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra giữa kì Toán 7 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k7.md` (luật khối 7) và, nếu đề có hình: `Repo\kho-rules\dai\lo\k7-ly-thuyet-hinh7.md`.
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`. (Đề là ảnh scan, không có lớp chữ.)
3. Tự chép đề rồi giải mọi câu. Số lớn tính bằng `node -e`, không nhẩm. Gặp số mũ / dấu trừ / chu kì / hỗn số / `|…|` chưa rõ ⇒ cắt phóng to 400 dpi từ
   `<LV>\goc.pdf` (`pdftoppm -r 400 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <w> -H <h> goc.pdf <ra>`) trước khi giải.
4. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B017\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc mẫu khuôn tệp `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\toanmath\batch\B017\brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\toanmath\batch\B017\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, dấu âm, ngoặc, gạch ngang, phương án, đủ ý, không sót câu). Chữ khung họ tên / điểm phải bị bỏ.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · đúng kiến thức lớp 7 tại thời điểm kiểm tra giữa kì (`k7.md` §1: không hằng đẳng thức, Pytago, đồng dạng…; chuyển vế được dùng) ·
     Phần 2 đúng khuôn nhóm bài `k7.md` §2 · dấu nhân là dấu chấm · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối,
     không chép lại Phần 2) · câu Hình: mỗi khẳng định có lý do trong ngoặc, tia nằm giữa được nêu trước khi cộng góc, đề tự đủ dữ kiện.
   - **Phân loại**: `kho` (hgt = hình: góc, song song, tam giác, hình khối) · `loai` (trả lời ngắn chỉ khi đáp số là một số ≤ 4 ô theo ĐÚNG đơn vị đề hỏi, không phải
     phân số; Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`) · tách ý đúng luật (chỉ bài Tính và Tìm $x$; ngoại lệ "Bài" gom 2 bài toán khác hẳn nhau ⇒ `Bài 5.1`, `Bài 5.2`;
     bản soạn chưa tách thì bạn tách; các ý a) b) của cùng một bài toán vẫn giữ chung).
   - **Ghi chú**: dòng `**Ghi chú:**` chỉ dành cho lỗi của ĐỀ GỐC / điều người duyệt cần biết; ghi chú kiểu "bản máy gõ nhầm…" thì xoá.
   - **Hình**: mở tệp trong `<LV>\img\` ứng với dòng `**Hình:**` — đúng hình của câu, không cụt, không dính chữ câu khác. Câu cần hình mà thiếu ⇒ cắt lại
     theo lệnh `pdftoppm` trong brief soạn. Số đo / kích thước ghi trên hình phải có trong phần Đề.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ bạn không chắc (đề mơ hồ, hai cách hiểu, ảnh mờ, hai bên lệch mà không phân xử được) ⇒ thêm / giữ dòng `**Chưa chắc:** …` trong câu đó (đặt sau đề, trước
   `**Phần 1. Hướng dẫn**`) — CEO xem kĩ các câu này. Dòng `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn đúng ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B017/<MA>.soan.md --lam-viec "<LV>" --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B017\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Ảnh cho CEO (CEO 10/10: "các câu có vấn đề chụp ảnh câu đấy để t sửa, viết thế kia t khó tìm")

Với MỖI câu còn `**Chưa chắc:**` sau khi soát, và MỖI câu có `**Ghi chú:**` báo lỗi / thiếu dữ kiện của ĐỀ GỐC: cắt ảnh **NGUYÊN câu đó từ đề gốc** (đủ lời đề, hình, các phương án — cả khối câu, không cắt vụn)
vào `Repokho-rulesdailok7can-xem<MA>_<nhãn>.png` (nhãn bỏ khoảng trắng: `GKI-09_Cau8.png`, `GKI-01_Bai3.1b.png`). Lệnh cắt như brief soạn mục 3.8
(`pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x … -y … -W … -H … "<LV>/goc.pdf" "<ra không đuôi>"`; câu vắt qua 2 trang thì cắt 2 ảnh `…_a.png`, `…_b.png`).
MỞ ảnh vừa cắt kiểm: thấy trọn câu, không cụt, không dính câu khác. Cuối biên bản `<MA>.soat.md` thêm mục `## ẢNH CHO CEO`, mỗi câu một dòng:
`| Câu | Ảnh (tên tệp) | Trang trong PDF gốc BỘ-ĐỀ-GKI-7 | Vấn đề (MỘT câu, nói thẳng chỗ CEO cần sửa/quyết) |`
— **Trang trong PDF gốc** = số trang của `BỘ-ĐỀ-GKI-7.pdf` (trang đầu của đề này là trang <trang bắt đầu> của file gốc, xem bảng `k7.md` §5), để CEO mở đúng chỗ.
Không có câu nào cần CEO xem ⇒ ghi "Không".

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
