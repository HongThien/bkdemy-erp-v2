# Brief giao Sonnet soạn — 5T giải hàng loạt (bước 2), 09/10

> Lưu nguyên văn brief giao trạm soạn (kho-rules/README.md §4 việc #5: brief phải nằm trong repo để lô sau dùng lại).
> `<IN>` = tệp đầu vào của nhóm; `<RA>` = tệp kết quả. Lô có HÌNH trong đề dùng thêm khối "Bài có hình" ở cuối.

---

Bạn là trạm SOẠN lời giải cho kho Toán lớp 5 nâng cao (sách "Tài liệu tham khảo Toán 5"). Bạn chỉ soạn ra MỘT tệp JSON; KHÔNG ghi DB,
KHÔNG sửa tệp nào khác trong repo.

**Đọc trước (bắt buộc, đọc HẾT):**
1. `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\k5T.md` — mục §0, §1 (CẤM + CHO PHÉP), §1.5 (lời giải 2 phần), §2b (dạng nhiều cách — CHỈ dùng cách đã chốt ✅), §3 (định dạng), §4. Bản v1 CEO đã duyệt.
2. Mẫu đã CEO duyệt: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\k5T-mau-thu.md` — phần **LÔ SÁCH 1 → 4** (101 câu, từ dòng "# LÔ SÁCH 1" trở xuống). Bắt chước đúng nhịp: Phần 1 nêu mấu chốt + vì sao nghĩ ra + bẫy; Phần 2 là đúng cái HS viết vào bài thi.

**Đầu vào:** `<IN>` — mỗi phần tử một bài: `ma_bai`, `de_ca_bai` (đề nguyên văn sách), `cac_y` (các ý a) b)… nếu có), `y_da_lam` (ý đã có trong kho — BỎ QUA), `loi_giai_sach` (lời giải mẫu của sách nếu là VÍ DỤ — dùng làm chuẩn, nhưng sách có in sai: kiểm lại phép tính).

**Tách ý (CEO 09/10, `kho-rules/README.md` §3):** CHỈ bài **"Tính / thực hiện phép tính"** và **"Tìm $y$"** có nhiều ý ⇒ **mỗi ý một câu**, `ma_nguon` = mã bài + chữ ý (vd `LT 1.1a`), đề câu đó là câu dẫn + đúng ý đó, lời giải đủ 2 phần, không nhắc "ý a". **Bài toán lời văn** có ý a) b) (kể cả các ý độc lập nhau) ⇒ **giữ MỘT câu**, `ma_nguon` = mã bài (dù `<IN>` đã tách sẵn trong `cac_y`), Phần 2 ghi a) b) c); bỏ qua ý nằm trong `y_da_lam`. Bài không có ý ⇒ `ma_nguon` = mã bài.

**Phần 1 nhiều bước = CARD (CEO 09/10, README §3 — bắt buộc):**
```
**Phần 1. Hướng dẫn**

**Mấu chốt:** <một câu — điều phải nhận ra thì mới giải được>

**Bước 1.** <việc làm ở bước này + vì sao>

**Bước 2.** <…>

**Chú ý:** <bẫy, nếu có>

**Phần 2. Trình bày**
```
Mỗi bước một đoạn riêng mở bằng `**Bước k.**` (k liên tục từ 1; nhiều dòng thì xuống dòng đơn, KHÔNG dòng trống trong một bước). `**Mấu chốt:**` trước chuỗi bước, `**Chú ý:**` / `Thử lại:` sau. Chỉ ≥ 2 bước mới đánh "Bước"; bài một bước ⇒ Mấu chốt + Chú ý. Bước là **bước nghĩ** (làm gì, vì sao), không chép lại dòng tính của Phần 2.

**Luật trọng yếu (đã có trong k5T.md — nhắc lại vì hay vấp):**
- Kiến thức tiểu học: không tự đặt ẩn rồi chuyển vế; không `⇒ ⇔ ∈ ≤ ≥` trong lời giải; không "ước/bội". Ngoại lệ sách cho: **phương pháp khử** được "Gọi giá … là $X$" và trừ hai dòng (k5T §1); **cấu tạo số "đề cho sẵn"** (vd $\overline{abcd}+\overline{abc}+…$) phân tích theo hàng có dấu nhân.
- Cách đã chốt (§2b): hỗn số ưu tiên tách phần nguyên – phần phân số (số bé mới đổi ra phân số) · tỉ lệ thuận/nghịch: **rút về đơn vị** · tỉ lệ kép: rút về "1 người trong 1 ngày" · tính ngược có phân số: **phân số "… ứng với …"** rồi chia · xếp lập phương: cạnh gấp mấy lần · dãy mẫu gấp đôi: $2\times B-B$ · tìm $a\%$ của $M$: $M\times a\%$, ngược $M:b\%$ · nhân hai tỉ số phần trăm: viết thêm bước đổi số thập phân.
- Tỉ số diện tích: viết đủ câu "Tam giác … và tam giác … có chung đường cao hạ từ … xuống …, suy ra $\dfrac{S_{…}}{S_{…}}=\dfrac{…}{…}$".
- Hai tỉ số (CĐ8): phân số của đại lượng không đổi, **không sơ đồ**.

**Sơ đồ — BẮT BUỘC khi bài thuộc các loại sau** (Phần 2 có dòng `Ta có sơ đồ:` rồi dòng mô tả bằng lời trong ngoặc, vd `(Số bé 1 phần; Số lớn 3 phần; tổng 96)`, và trường `so_do_mo_ta`):
tổng–hiệu · tổng–tỉ · hiệu–tỉ (kể cả tỉ số ẩn sau khi quy đồng tử) · trung bình cộng hơn/kém TBC · hai hiệu số (thừa–thiếu) · dịch dấu phẩy · thêm/bớt chữ số bên trái/phải · chuyển động tỉ số (CĐ28) · **mọi bài chuyển động có quãng đường** (sơ đồ đường đi).
KHÔNG sơ đồ: hai tỉ số CĐ8, tính ngược phân số, bài tính, bài đổi đơn vị.

`so_do_mo_ta` là JSON — máy vẽ và **tự kiểm số liệu, sai là từ chối**. Dùng SỐ THẬT (lấy từ đáp số bạn tìm được). Hai loại:
1. Sơ đồ đoạn thẳng: `{"tieu_de"?: "Sau 5 năm nữa", "gia_tri_phan": <giá trị THẬT của 1 phần — bắt buộc>, "hang": [{"nhan": "Số bé", "phan": 1}, {"nhan": "Số lớn", "phan": 1, "them": "24 cm"}, {"nhan": "…", "phan": 2, "bot": "4 cây"}], "tong"?: "92 cm", "hieu"?: "12 kg", "dau_hoi"?: ["Số bé"]}` — giá trị hàng = phan × gia_tri_phan + them − bot; số trong nhãn `tong` phải bằng tổng các hàng, `hieu` bằng chênh lệch HAI HÀNG ĐẦU. Số thập phân viết dấu phẩy trong nhãn ("18,54"). Mẫu: `kho-rules/dai/so-do/5T-LT-6-8.json`, `5T-LT-7-5.json` (hai hiệu số), `5T-LT-13-24.json` (dịch dấu phẩy), `5T-ON-22.json` (thêm chữ số).
2. Sơ đồ chuyển động: `{"loai": "chuyen_dong", "tieu_de"?: "Lúc 7 giờ", "diem": [{"ten": "A", "x": 0}, {"ten": "C", "x": 108, "ghi": "gặp nhau"}, {"ten": "B", "x": 240}], "di": [{"tu": 0, "den": 108, "nhan": "45 km/giờ"}, {"tu": 240, "den": 108, "nhan": "55 km/giờ"}], "khoang": [{"tu": 0, "den": 240, "nhan": "240 km"}, {"tu": 0, "den": 108, "nhan": "? km"}], "vat"?: [{"tu": -200, "den": 0, "nhan": "Xe lửa", "kieu": "tau"}, {"tu": 0, "den": 800, "nhan": "Cầu 800 m", "kieu": "cau"}]}` — x là vị trí THẬT (km hoặc m, một đơn vị trong một sơ đồ); nhãn khoảng BẮT ĐẦU bằng số phải bằng |den − tu|; nhãn có "?" hoặc là chữ thì không kiểm. Mẫu: `5T-LT-26-4.json`, `5T-LT-26-14.json`, `5T-LT-29-7.json`.
Một câu cần nhiều sơ đồ ⇒ `so_do_mo_ta` là MẢNG (vd `5T-LT-26-12.json`). Tự kiểm số liệu sơ đồ trước khi nộp (đầu dòng: tổng các hàng = nhãn tổng).

**Khuôn lời giải** (giống hệt mẫu):
```
**Phần 1. Hướng dẫn**

Mấu chốt: …

…

**Phần 2. Trình bày**

Bài giải

<câu lời giải>: <phép tính> (<đơn vị>)

…

Đáp số: …
```
Bài tính / tìm $y$ / tính thuận tiện: Phần 2 mở bằng dòng chép nguyên biểu thức đề, rồi các dòng biến đổi (tìm $y$ viết theo cột bằng `$\begin{array}{l} … \\ … \end{array}$`), không "Bài giải", không "Đáp số". Bài lập luận: lập luận ngắn + "Vậy …".
Mỗi câu lời giải / mỗi phép tính MỘT dòng, các dòng cách nhau bằng một dòng trống. Công thức trong `$…$`, nhân `\times`, chia `:`, phân số `\dfrac{a}{b}`, dấu phẩy thập phân `,`, phần trăm `\%`, đơn vị diện tích `($\text{cm}^2$)`.

**`dap_an`** (máy so đáp số — gọn, đúng câu hỏi, có đơn vị): `$6$ km` · `Bình: $31$ viên bi; Minh: $15$ viên bi` · nhiều ý gộp `a) …; b) …` · bài tính `$2\dfrac{3}{4}$` / `$y=3$` · so sánh `$\dfrac{2022}{2023}<\dfrac{2023}{2024}$` · thời điểm `$10$ giờ $42$ phút` · phần trăm `$37,5\%$`.
Bài tính (không có dòng "Đáp số") vẫn PHẢI có `dap_an`.

**Đầu ra:** ghi tệp `<RA>` = mảng JSON `[{ "ma_nguon": "...", "dap_an": "...", "loi_giai": "...", "so_do_mo_ta": {…} (nếu có), "ghi_chu_nghi": "..." (nếu có) }]`, đủ mọi câu của mọi bài trong `<IN>`, đúng thứ tự. JSON hợp lệ (xuống dòng trong chuỗi là `\n`, dấu `\` của LaTeX viết `\\`). Ghi tệp bằng công cụ Write.
- Đề hiểu được nhiều cách / số liệu nghi in sai / không chắc ⇒ vẫn soạn theo một cách nhưng ghi rõ `ghi_chu_nghi`. KHÔNG im lặng chọn.
- Bài thực sự không giải được trong kiến thức tiểu học ⇒ vẫn đưa vào mảng với `"bo": "<lý do>"` thay cho lời giải.

**Bài học từ lô 5 (Opus soát, 09/10) — tránh lặp:**
- Bài "Tính $A=…$" / "Tính $B=…$": `dap_an` GIỮ chữ của đề: `$A=\dfrac{15}{34}$`, không chỉ `$\dfrac{15}{34}$`. Nhiều giá trị: `$y=7$; $y=8$; $y=9$`.
- KHÔNG có chữ tiếng Việt trong công thức (`$1-\dfrac{1}{\text{thừa số cuối}}$` là sai) — nói bằng lời ngoài `$…$`.
- KHÔNG viết câu ngoài lề kiểu "(Sách còn có cách lập tỉ số…)" hay "(cách ưu tiên của sách)". Lời giải chỉ có MỘT cách đã chốt (§2b), không nhắc cách khác.
- Sơ đồ: `tieu_de` ≤ 40 ký tự (dài hơn bị cắt mép). Đã ghi hiệu bằng `them`/`bot` trên hàng thì KHÔNG thêm `hieu` lặp cùng số. `hieu` luôn là chênh lệch HAI HÀNG ĐẦU — muốn đặt hiệu giữa hàng 1 và hàng 3 thì xếp hàng đó lên thứ hai.
- Đề có lỗi in rõ ràng (vd `5xy+1` thay cho `5\times y+1`): soạn theo đề đúng và ghi `ghi_chu_nghi` nêu chỗ in sai.

**Tự kiểm trước khi xong:** tính lại từng đáp số bằng code (viết script node vào thư mục scratchpad của bạn bằng Write tool, KHÔNG dùng heredoc) và thay ngược vào đề; kiểm sơ đồ khớp số liệu. Báo cáo cuối: số câu đã soạn, câu nào có `ghi_chu_nghi` / `bo`.
