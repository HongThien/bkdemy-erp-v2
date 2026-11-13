# ⚠️⚠️ BẢN ÁP DỤNG BATCH B017 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 7 TẢI TỪ TOANMATH (2 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief khối 7 đã chạy thật cho bộ đề GIỮA kì 1 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, khuôn lời giải, cổng, bẫy đọc ảnh: GIỮ NGUYÊN.
Bộ đề CUỐI kì 1 khối 7 (bộ scan `BỘ-ĐỀ-CKI-7`, 14/10, 13 đề đã ghi lên Kho đề thi — mẫu `Repo\kho-rules\dai\lo\k7\CKI-02.soan.md`, `CKI-11.soan.md`) đã chạy với
brief này + các điểm khác dưới đây. Chỉ khác những điểm sau:

- `<MA>` = `B017-NN` (01–02). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B017\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong `goc.pdf`), `hd` (trang HƯỚNG DẪN CHẤM).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B017\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
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
