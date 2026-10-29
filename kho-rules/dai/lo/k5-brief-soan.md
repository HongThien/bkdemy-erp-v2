# Brief giao trạm SOẠN — khối 5, sách "Đề kiểm tra Toán 5" (Qbooks, KNTT) HK1 + HK2 — 40 đề (Thùy 28/10)

> Chép khuôn K6 (`k6-brief-soan.md`). `<MA>` = mã đề (vd `HK1-GK01`, `HK2-CK15`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K5-sach-de\<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`k5-brief-soat.md`) chạy Opus.
> Nguồn: `E:\BK ACADEMY\Tài liệu tham khảo\K5\Sách đề lớp 5A.pdf` (2 cuốn HK1 + HK2, mỗi cuốn 5 đề giữa kì + 15 đề cuối kì, **không in lời giải**),
> tách thành 40 PDF (mỗi đề 3 trang, đã xoay thẳng). SGK tham chiếu: `E:\BK ACADEMY\Tài liệu tham khảo\K5\SGK - Toán 5 - Tập 1 - Chương trình mới.pdf` (Kết nối tri thức).

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra Toán 5: **soát lại đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\k5\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được ghi thêm ảnh cắt lại vào `<LV>\img\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k5T.md` §0, §1, §1.5, §2b, §3 — luật GIẢI + TRÌNH BÀY tiểu học (cấm gọi ẩn / chuyển vế / ⇒; Phần 1 card; Phần 2 như vở; định dạng).
   Bỏ qua các mục về sơ đồ vẽ bằng máy (xem mục 4 dưới) và về bản đồ 5T.
2. `Repo\kho-rules\dai\lo\k5\HK1-GK01.soan.md` — **đề mẫu đã duyệt**. Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2.
   (Mẫu đơn giản hơn: `Repo\kho-rules\dai\lo\k5-on-gki\DE4.soan.md`.)

## 2. Nguồn của đề

- `<LV>\trang\p-1.png`, `p-2.png`, `p-3.png` — **ảnh từng trang, NGUỒN CHÍNH**. Mở HẾT bằng công cụ Read.
- `<LV>\de.json` — bản Gemini gõ lại, CHỈ để đỡ công gõ. Hay sai: phân số, hỗn số, số mũ $m^2$, dấu phẩy thập phân, ô trống, sót ý. **Lệch nhau thì ảnh đúng.**
- `<LV>\img\*.png` — hình máy đã cắt. Mở xem TỪNG hình. Ảnh trang mờ chỗ nào ⇒ cắt phóng to 300 dpi (lệnh ở mục 3.8) rồi mới chép.

## 3. Việc phải làm

1. **Soát đề** từng câu so với ảnh: chữ, số, phân số, đơn vị, đủ 4 phương án, đủ các ý, không sót không thừa câu. Bỏ phần "(0,5 điểm)", "(1 điểm)" khỏi đề.
2. **Lỗi in của đề** ⇒ sửa tối thiểu cho đúng nghĩa + dòng `**Ghi chú:** …`. Đề sai số liệu thật (không ra đáp án) ⇒ giải bình thường theo cách hiểu hợp lí nhất, ghi rõ
   "Đề sai: …" trong `**Ghi chú:**` (không treo `Chưa chắc` chỉ vì đề in lỗi hiển nhiên).
3. **Kho:** mọi câu `kho=dai` (khối 5 chưa tách kho hình).
4. **Tách ý — CHỈ các bài "Đặt tính rồi tính", "Tính", "Tính giá trị biểu thức", "Tính bằng cách thuận tiện", "Tìm $y$/$x$"**: mỗi phép tính / biểu thức một câu,
   nhãn `Bài 2a`, `Bài 2b`… theo thứ tự đọc (trái → phải, trên → dưới; đề không ghi a b thì tự đánh a b c d theo thứ tự đó); đề của câu = lời dẫn + phép tính
   của ý (vd `Đặt tính rồi tính: $509\times 37$`). **Mọi bài khác GIỮ CHUNG một câu** (điền số / đổi đơn vị "Số?", so sánh >;<;=, đọc viết số, sắp xếp,
   hoàn thành bảng, lời văn — kể cả có ý a) b)); Phần 2 ghi `a)` `b)`.
5. **Loại câu:** phần trắc nghiệm `trac_nghiem` (đủ 4 dòng `A. ` `B. ` `C. ` `D. `) · phần tự luận `tu_luan` với `dap_an=—`
   (bài lời văn có MỘT đáp số là một số thì được ghi số đó, vd `dap_an=600`).
   Câu trắc nghiệm "Đúng ghi Đ, sai ghi S" ⇒ `tu_luan`, đề giữ đủ các mệnh đề, lời giải xét từng mệnh đề, thêm `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
6. **Giải** mọi câu, lời giải 2 phần (mục 4). **Mọi đáp số phải thử lại** — tính bằng `node -e` (từ thư mục Repo), đừng nhẩm; đặc biệt phép chia số thập phân,
   đổi đơn vị, phân số. Kiến thức: đúng chương trình Toán 5 Kết nối tri thức (HK1: số thập phân, phép tính STP, đơn vị đo, hình tam giác / hình thang / hình tròn;
   HK2: tỉ số, tỉ số phần trăm, thể tích, hình hộp – hình lập phương, số đo thời gian, vận tốc, biểu đồ hình quạt…) + kiến thức lớp 4 (tổng – hiệu, tổng – tỉ…).
   Thuật ngữ, cách gọi theo SGK KNTT 5 (vd "làm tròn số thập phân", "tỉ lệ bản đồ", "đề-xi-mét khối"). Không dùng kiến thức lớp 6 trở lên.
7. **Hình / bảng / biểu đồ:** câu có hình, bảng số liệu, biểu đồ, bảng cần hoàn thành ⇒ thêm `**Hình:** <tên tệp trong img>` (một tệp). Đề vẫn viết bằng chữ
   phần lời; bảng thì chép thêm thành chữ nếu ngắn ("Bảng: Cam 3,1 kg; Nho 1 kg 900 g; …"). Hình máy cắt hỏng / thiếu ⇒ tự cắt lại từ PDF
   (toạ độ pixel đo trên ảnh trang 150 dpi):
   `pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/img/<tên-không-đuôi>"`
   rồi mở ảnh vừa cắt để kiểm. Đặt tên mới kiểu `p1c4_lai` (đừng đè tệp cũ). Hình phải chứa ĐỦ hình, KHÔNG dính chữ câu khác, KHÔNG dính hình trang trí.
   **Hình trang trí** (con vật, nhân vật, đồ vật minh hoạ không mang dữ kiện) ⇒ KHÔNG đưa vào.
   Bài yêu cầu VẼ ⇒ vẫn nhập, lời giải tả từng bước vẽ, thêm `**Ghi chú:** lời giải chưa có hình vẽ`.
8. **Không chắc 100% thì NÓI RA** — dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu. Ghi khi: ảnh mờ không đọc chắc · đề hai cách hiểu · không có / có hai
   phương án đúng (vẫn chọn hợp lí nhất, nói rõ) · lời giải theo một quy ước bạn đoán. Đừng ghi tràn lan.
9. Cuối tệp `## GHI CHÚ CHO NGƯỜI DUYỆT`: câu bỏ (vì sao), nhận xét chung. Không có gì thì ghi "Không".

## 4. Khuôn tệp và khuôn lời giải (máy kiểm — sai là bị từ chối)

Đầu tệp (tên đề ĐÚNG khuôn này — `<n>` là số đề, `<k>` là học kì 1/2):

```
# ĐỀ | Đề kiểm tra giữa kì số <n> — Toán 5 học kì <k> (sách Đề kiểm tra Toán 5, Qbooks)
bo_sach: KNTT
thoi_gian_phut: 40

## PHẦN 1 | Trắc nghiệm | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** …
A. …
B. …
C. …
D. …
**Hình:** p1c4_1.png
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

Chọn C.

## PHẦN 2 | Tự luận | tu_luan

### Bài 1 | kho=dai | loai=tu_luan | dap_an=—
…
```

(đề cuối kì: `Đề kiểm tra cuối kì số <n> — …`)

- `### <nhãn gốc: Câu 3 / Bài 2a> | kho=dai | loai=… | dap_an=…`. Các dòng `**Hình:**`, `**Ghi chú:**`, `**Chưa chắc:**` tuỳ chọn, mỗi loại một dòng,
  SAU đề và phương án, TRƯỚC `**Phần 1. Hướng dẫn**`.
- **Đề** chép nguyên văn (đã sửa lỗi in), mọi công thức / phân số / hỗn số / đơn vị có mũ trong `$…$`. Đề nhiều dòng xuống dòng đơn. Ô trống trong đề viết `…`.
- **Phần 1 — khuôn CARD, đúng từng chữ:** `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) →
  tuỳ chọn `**Chú ý:** …`. Các đoạn cách nhau MỘT dòng trống; trong một đoạn không có dòng trống. Mỗi bước là một bước nghĩ trọn vẹn (làm gì + dựa vào đâu),
  ≥ 5 chữ ngoài công thức, không ghi đáp số cuối, không chép lại từng dòng tính của Phần 2.
- **Phần 2** = đúng cái học sinh viết vào bài kiểm tra (k5T.md §1.5): bài tính mở bằng dòng chép lại biểu thức rồi mỗi dòng biến đổi một đoạn; bài lời văn
  mở bằng `Bài giải`, mỗi bước = 1 câu lời giải + 1 phép tính + đơn vị trong ngoặc, kết `Đáp số: …`; đổi đơn vị một dòng riêng `Đổi: …`.
  **Lô này KHÔNG vẽ sơ đồ** — không viết dòng `Ta có sơ đồ:`; bài tổng – tỉ / hiệu – tỉ giải theo "tổng số phần bằng nhau", mô tả số phần bằng lời
  (`Số bé: 2 phần; số lớn: 3 phần.`). Đặt tính: phép nhân viết dạng cột `\begin{array}{r}…\end{array}` như mẫu; phép chia ghi các lượt chia
  (`$88:63=1$ (dư 25), hạ 2 được $252$…`) rồi dòng kết quả. Câu trắc nghiệm: dòng cuối lời giải đúng là `Chọn X.`
- **Định dạng (máy chặn):** dấu nhân `\times` (CẤM `\cdot`, dấu chấm) · chia `:` · phân số `\dfrac` · hỗn số `$3\dfrac{4}{100}$` · dấu phẩy thập phân `,` ·
  số trong công thức viết liền (`125000`) · đơn vị có mũ `$m^2$`, `$dm^3$` · chữ tiếng Việt trong công thức bọc `\text{…}` · phần trăm `$25\%$`.
  Cấm `⇒`, `⇔`, `∈`, `≤`, `≥` trong lập luận (viết chữ "nên", "vậy"). Góc viết như SGK 5: "góc đỉnh A, cạnh AB, AC" — CẤM `\widehat`, `\angle` (lớp 6+).
- **Sửa tệp có LaTeX bằng công cụ Edit/Write**, KHÔNG bằng `sed` / `node -e` trong shell (shell nuốt dấu `\`).

## 5. Tự kiểm trước khi nộp (bắt buộc)

Từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k5/<MA>.soan.md --lam-viec "<LV>" --khoi 5 --chi-kiem
```

## 5b. Bẫy đọc ảnh đã cắn thật (đọc kĩ)

- **HỖN SỐ bị đọc sai** (2 đề / 5 đề đầu): $2\dfrac{8}{9}$ chép thành $2-\dfrac{8}{9}$, $2\dfrac{3}{4}$ chép thành $\dfrac{2}{4}$ ⇒ sai luôn đáp số. Ảnh 150 dpi phần nguyên
  nhỏ, sát phân số. **MỌI biểu thức có phân số / hỗn số ở phần tự luận: cắt phóng to 300 dpi** (`pdftoppm -r 300 … -x -y -W -H`, toạ độ ×2) rồi mới chép.
  `de.json` của Gemini cũng hay sai đúng chỗ này — không dùng để đối chiếu.
- **Đơn vị chép ĐÚNG như sách in** (sách in `km/h` thì đề và lời giải đều viết `km/h`, không tự đổi sang `km/giờ`).
- **Thứ tự ý** khi đề in 2 cột: đánh a b c d theo HÀNG (trái → phải rồi xuống), không theo cột.

## 6. Trả lời cuối

Vài dòng: số câu theo loại · các câu `Chưa chắc` (nhãn + một câu lí do) · câu đã bỏ · lỗi máy gõ đáng kể đã sửa · cổng đã đạt chưa.
