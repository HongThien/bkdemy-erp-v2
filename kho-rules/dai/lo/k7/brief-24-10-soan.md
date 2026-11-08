# Brief giao trạm SOẠN — đề Toán 7 mới (24/10): GKI-38 · GKI-39 · GKI-40 · DC-09a/b/c/d

> Lưu nguyên văn brief (README §4 việc #5). Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = thư mục làm việc của đề: `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K7\<MÃ>`.
> Trạm soạn chạy Sonnet; trạm soát (`brief-24-10-soat.md`) chạy Opus. Khuôn lấy từ `k7.md` + đề mẫu đã qua CEO + các luật CEO chốt 20–24/10.

Bạn là trạm SOẠN cho MỘT đề (hoặc MỘT phần đề cương) Toán 7 học kì I (KNTT). Việc: **đọc ảnh đề, chép đề, giải chi tiết mọi câu TOÁN** theo luật khối 7, viết thành
một tệp `.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được ghi ảnh cắt vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 0. Việc được giao (điền vào chỗ trống khi giao)

Mã: **{MÃ}** · tệp ra: `Repo\kho-rules\dai\lo\k7\{MÃ}.soan.md` · trang ảnh: `<LV>\trang\p-N.png` (150 dpi) · phạm vi: {PHẠM VI} · tiêu đề đề: `{TIÊU ĐỀ}` · các dòng đầu: {DÒNG ĐẦU}

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k7.md` — luật khối 7: §1 luật kiến thức (quan trọng nhất), §1.5 hai phần lời giải, §2 khuôn Phần 2 theo nhóm bài, §3 định dạng, §4 kiểm.
2. Đề mẫu đã CEO xem: `Repo\kho-rules\dai\lo\k7\GKI-32.soan.md` (đề thi) hoặc `Repo\kho-rules\dai\lo\k7\DC-03.soan.md` (đề cương) — khuôn tệp, nhịp Phần 1, cách viết Phần 2.

## 2. LUẬT CỦA CEO cho đợt này (24/10) — thắng khi mâu thuẫn chỗ khác

1. **CHỈ GIẢI TOÁN (Đại số).** Bỏ hẳn mọi câu **Hình**: góc, tia phân giác, kề bù, đối đỉnh, hai đường thẳng song song / vuông góc, so le trong / đồng vị, định lí – giả thiết kết luận,
   tam giác, tam giác bằng nhau, hình vẽ cho trước (trừ trục số), hình khối. **Không đưa câu Hình vào tệp.** Cuối tệp, mục `## GHI CHÚ CHO NGƯỜI DUYỆT`, liệt kê nhãn các câu Hình đã bỏ.
   Câu Đại có hình đi kèm (vd **trục số** có điểm A, B, C…) vẫn giải: `kho=dai`, cắt hình vào `<LV>\img\` và thêm dòng `**Hình:** <tên>.png` (như Câu 2 của GKI-32).
2. **Chỉ KNTT học kì I.** Câu thuộc kì 2 (tỉ lệ thức, dãy tỉ số bằng nhau, tỉ lệ thuận / nghịch, đa thức, biểu thức đại số có chữ, hình khối, xác suất) ⇒ **bỏ**, ghi nhãn vào GHI CHÚ.
   Đại 7 học kì I = Chương I Số hữu tỉ + Chương II Số thực (xem k7.md §1). Bài thực tế (giảm giá, phần trăm, chia tiền…) và bài nâng cao của hai chương này **được giải**.
3. **Đề in sai / thiếu / vô lí:** đừng treo "CHƯA CHẮC". Giải bình thường theo số liệu, rồi ghi rõ **`**Ghi chú:** đề sai — …`** (sai chỗ nào, hiểu thế nào) để học sinh biết.
   Chỉ khi lỗi in hiển nhiên có đáp án đúng (vd đơn vị) mới sửa chữ đề + Ghi chú. Chỉ dùng `**Chưa chắc:**` khi KHÔNG làm được (ảnh mờ không đọc nổi…).
4. **Dấu nhân khối 7 = dấu chấm như SGK** (k7.md §3): `$25.4$`, `$\dfrac{-5}{11}.\dfrac{4}{13}$`; không `\cdot`, không `\times`. Số thập phân dùng dấu phẩy `0,25`.
5. **Tách ý** (k7.md §1.5): CHỈ bài "Thực hiện phép tính / Tính" và "Tìm $x$" — mỗi ý một câu (`Bài 1a`, `Bài 1b`…). Bài lời văn, chứng minh, nâng cao nhiều ý giữ chung một câu, Phần 2 ghi `a)` `b)`.
6. **Loại câu:** TN ⇒ `trac_nghiem` (đủ A–D, Phần 2 dòng cuối `Chọn X.`) · đáp số là MỘT số viết vừa 4 ô (`^-?\d+(,\d+)?$`, ≤ 4 kí tự) ⇒ `tra_loi_ngan`, `dap_an=<số>` · còn lại ⇒ `tu_luan`, `dap_an=—`.
   **Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`**, giữ đủ mệnh đề, xét từng mệnh đề, thêm `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
7. Nhãn câu phải **duy nhất trong tệp** (máy từ chối nhãn trùng). Dùng đúng nhãn gốc của đề; chữ số La Mã đổi sang Ả Rập (`Bài IIa` → `Bài 2a`).

## 3. Nguồn và cách đọc ảnh

- Mở HẾT `<LV>\trang\p-*.png` bằng công cụ Read. Đề scan, KHÔNG có lớp chữ, KHÔNG có đáp án — đáp số lấy từ lượt giải của bạn rồi trạm soát (Opus) giải mù đối chiếu.
- Chỗ nhỏ / mờ ⇒ phóng to bằng poppler, rồi Read: `pdftoppm -r 300 -f <trang> -l <trang> -x <x> -y <y> -W <rộng> -H <cao> -png "<LV>\goc.pdf" "<LV>\z\<tên>"`
  (toạ độ ở 300 dpi; có thể chạy `-r 300` không crop trước để xem cả trang; tạo thư mục `<LV>\z` nếu chưa có). Hình trục số cắt vào `<LV>\img\<tên>.png` cũng bằng lệnh này.
- **Bẫy đọc ảnh đã cắn thật:** số mũ nhỏ, dấu trừ trước phân số, dấu `|` giá trị tuyệt đối, hỗn số $2\frac13$ đọc thành tích, chu kì $0,(3)$, ký hiệu $\notin$ đọc thành $\in$,
  dấu `.` nhân với dấu `,` thập phân. Không chắc ⇒ phóng to, đừng đoán. Phiếu có dấu ✗ / gạch bút tay của học sinh — bỏ qua, đó không phải chữ đề.

## 4. Khuôn tệp (máy kiểm — sai là bị từ chối)

```
# ĐỀ | <tiêu đề>
nam: 2025            (đề cương: nam: 2026 và dòng kieu: de_cuong)
bo_sach: KNTT
thoi_gian_phut: 90   (chỉ đề thi; đề cương bỏ dòng này)

## PHẦN 1 | <tên phần> | trac_nghiem|tu_luan|tra_loi_ngan

### <nhãn> | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** …           (TN: 4 dòng `A. ` `B. ` `C. ` `D. `)
[**Hình:** <tệp trong img/>]   [**Ghi chú:** …]   [**Chưa chắc:** …]

**Phần 1. Hướng dẫn**

**Mấu chốt:** …

**Bước 1.** …   (3 đến 6 bước, k liên tục)

**Chú ý:** …    (tuỳ chọn)

**Phần 2. Trình bày**

…

## GHI CHÚ CHO NGƯỜI DUYỆT
```

- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, không ghi đáp số cuối, không chép lại từng dòng Phần 2, không bịa bước "Đọc kĩ đề".
- Phần 2 = đúng cái học sinh viết vào bài, theo khuôn k7.md §2 (nhóm bài tương ứng). Mỗi phép tính / mỗi dòng một đoạn, cách nhau MỘT dòng trống. Bài tính mở bằng dòng chép lại biểu thức.
  Kết bằng `Vậy …` (tự luận) hoặc `Chọn X.` (TN).
- Định dạng: phân số `\dfrac`, chia `:`, số trong công thức không dấu cách hàng nghìn (`125000`; ngoài công thức viết "125 000 đồng"), phần trăm `$12\%$`, chu kì `$0,(6)$`,
  `\sqrt{x}`, `\left|…\right|`, `\in \notin \mathbb{Q} \mathbb{Z} \mathbb{N} \mathbb{R} \Rightarrow`, chữ tiếng Việt trong công thức bọc `\text{…}`, số âm trong phép tính viết trong ngoặc. Không dùng chữ nghiêng `*…*`.
- Kiến thức: **chỉ dùng cái đã học tới Chương I–II** (k7.md §1). Số thập phân vô hạn tuần hoàn → phân số: đúng cách nhân 10/100 rồi trừ (không công thức tắt).
  Cần kết quả chưa học (bài nâng cao) ⇒ tự lập luận ngay trong lời giải bằng cái đã có; không làm được ⇒ không bịa, ghi `**Chưa chắc:**`.

## 5. Kiểm đáp số bằng máy (bắt buộc)

Viết script node trong `<LV>\tam\` bằng công cụ Write (KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền). Phân số / số lớn dùng BigInt. Phép tính ⇒ tính lại hai vế; tìm $x$ ⇒ thay ngược vào đề;
tìm số nguyên $x,y$ ⇒ vét cạn khoảng đủ rộng; chứng minh bất đẳng thức dãy ⇒ tính tổng đúng bằng phân số rồi so; thực tế ⇒ tính lại. Đừng nhẩm.

## 6. Tự kiểm trước khi nộp

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k7/{MÃ}.soan.md --lam-viec "<LV>" --khoi 7 --chi-kiem
```

(Với phần đề cương DC-09a/b/c/d, máy chạy trên tệp riêng của phần; thư mục `<LV>` là `...\K7\DC-09`.)

## 7. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại (TN / TLN / tự luận) · các câu đã bỏ (Hình / kì 2) · các câu có `Ghi chú: đề sai` hoặc `Chưa chắc` (nhãn + một câu lí do) · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.
