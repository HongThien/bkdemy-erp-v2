# Brief trạm SOẠN — lý thuyết + ví dụ cho chủ đề MỚI "Giới hạn. Hàm số liên tục" (K11, 19/10)

> CEO 19/10: *"Chốt bản đồ ver này. Tạo luôn trực tiếp trên bản đồ mới. Tự làm luôn bản đề xuất lý thuyết và ví dụ. Thùy sẽ view và sửa trên bản đồ mới luôn."*
> Bản đồ đã tạo trên DB (chủ đề `NCD00186`, 3 chuyên đề, 17 nhóm, 55 dạng — mã trong `<LV>\gh-ids.json`). Nhiệm vụ của bạn: soạn **lý thuyết + 2 ví dụ cho TỪNG dạng** và **lý thuyết CHO TỪNG NHÓM** của chuyên đề được giao.
> `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11` · `<LUOT>` = G1 / G2 / G3 · Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> KHÔNG ghi DB, KHÔNG sửa Repo. Chỉ ghi `<LV>\ra\<LUOT>.txt` (công cụ Write) và script thử trong `<LV>\tam\<LUOT>\`.

## 1. Đọc trước (theo thứ tự)
1. **Khuôn + luật chung của Thùy** — `Repo\kho-rules\dai\lo\k11\ban-do\brief-soan.md` §2 (khuôn tệp `=== NDB… / @ly_thuyet: / @vi_du:`), §4 (thử bằng máy) và **`brief-sua.md` §2 (luật chung)**: đầu dòng `##TC` dùng "• " (KHÔNG "- "), **mỗi công thức một dòng**, tiêu đề `##PP` KHÔNG chứa `$…$`, `##PP` 3–6 dòng không "Bước N", bảng công thức/xét dấu = một công thức mảng. Hình: `brief-sua.md` §3 (`[[HINH:{…}]]`) — **LOẠI MỚI cho chương này `do_thi_ham`** (đồ thị hàm số tuỳ ý, đọc đầu file `Repo\scripts\kho\hinh-luong-giac.mjs`, hàm `svgDoThiHam`).
2. **Hồ sơ từng dạng** `<LV>\<mã dạng>.md` (tên + mô tả nhận biết của Thùy = ĐÍCH; dạng mới nên không có lý thuyết cũ) và **hồ sơ nhóm** `<LV>\nhom-<mã nhóm>.md`. Danh sách mã theo lượt: `<LV>\gh-ids.json` (cây đầy đủ: chuyên đề → nhóm → dạng, kèm nguồn trong sách).
3. **Sách giáo khoa** (nguồn lý thuyết CHÍNH): `C:\Users\WBPC\Downloads\sach-giao-khoa-toan-11-tap-1-ket-noi-tri-thuc-voi-cuoc-song.pdf` — đọc bằng công cụ Read với `pages` (PDF = số trang in + 1): **Bài 15 = PDF 105–111 · Bài 16 = PDF 112–119 · Bài 17 = PDF 120–123 · Bài tập cuối chương V = PDF 124**. Lấy đúng định nghĩa / khung kiến thức / ví dụ mẫu của sách (viết lại theo khuôn `##`, không chép nguyên). Chỉ đọc các trang thuộc chuyên đề của bạn.
4. **Phân dạng + ví dụ có giải** (nguồn phụ, đã trích chữ + LaTeX): `<LV>\nguon-gh\*.txt` — `tt__C3-B1/B2/B3-…-P1` (Từ Tâm: lý thuyết + phương pháp từng dạng) · `…-P3-GHÉP_GV` (bài tập có lời giải) · `pnl-b1/b2/b3__…GV` (PNL: dạng + bài tự luận có lời giải + trắc nghiệm có đáp án). Dùng Grep tìm theo từ khoá của dạng. Công thức MathType đôi khi hỏng `[[EQ-FAILED…]]` — tự suy, đừng chép chữ hỏng.

## 2. Luật nội dung chương 5 (Toán 11, KNTT)
- **CẤM đạo hàm, quy tắc L'Hôpital, định lí kẹp dạng tổng quát chưa học** (chỉ dùng nguyên lí: $|u_n|\le v_n$, $v_n\to0\Rightarrow u_n\to0$ — có trong SGK tr.105), tích phân. Giới hạn hàm số được định nghĩa qua **dãy** (SGK): khi chứng minh bằng định nghĩa phải lấy dãy $x_n\ne x_0$, $x_n\to x_0$.
- **Công cụ được dùng** (theo SGK + các sách): thay trực tiếp; chia tử, mẫu cho luỹ thừa cao nhất; phân tích nhân tử (kể cả chia Horner); nhân liên hợp (căn bậc hai, căn bậc ba: $a^3-b^3$); rút luỹ thừa cao nhất; các quy tắc tổng/hiệu/tích/thương/căn; bảng quy tắc dấu giới hạn vô cực (SGK tr.117); $\lim\frac1{n^k}=0$, $q^n\to0$ ($|q|<1$), $n^k\to+\infty$, $q^n\to+\infty$ ($q>1$); $S=\dfrac{u_1}{1-q}$ ($|q|<1$); điều kiện liên tục $\lim_{x\to x_0}f(x)=f(x_0)$; nhận xét $f(a)f(b)<0$ ⇒ có nghiệm (SGK tr.122).
- **Kiến thức lớp dưới được dùng:** hằng đẳng thức, phân tích nhân tử, nghiệm phương trình bậc hai, dấu nhị thức bậc nhất / tam thức bậc hai, cấp số cộng cấp số nhân (công thức tổng), lượng giác tới hết chương I–II của Toán 11.
- **Kí hiệu:** `\lim\limits_{n\to+\infty}` (dãy; viết gọn `\lim` được khi rõ), `\lim\limits_{x\to x_0}`, `x_0^+`, `x_0^-`, `+\infty`, `-\infty`. Kết luận ghi "Vậy $\lim\ldots=\ldots$".
- **Điều kiện xác định / dấu:** luôn nêu khi chia cho biểu thức chứa $x$; khi $x\to-\infty$ nhớ $\sqrt{x^2}=|x|=-x$; khi xét $\dfrac L0$ phải xét dấu mẫu theo từng bên; liên hợp phải nêu biểu thức liên hợp khác 0.
- **Ví dụ** mỗi dạng 2: ví dụ 1 cơ bản (kiểu SGK), ví dụ 2 khó hơn một bậc (kiểu Từ Tâm/PNL nhưng vẫn đúng mô tả dạng); số liệu đẹp; **khác** ví dụ SGK đã chép trong lý thuyết; đáp số kiểm bằng máy (§4 brief-soan).
- **Dạng trắc nghiệm / nhận biết:** đề ghi 4 phương án A–D ngay trong đề (mỗi phương án một dòng), lời giải kiểm từng phương án, kết bằng "Chọn …".
- **HÌNH (Thùy: dạng đồ thị phải có hình trong đề):** dạng "Nhận biết hàm liên tục hoặc gián đoạn qua đồ thị" (NDB01194 hoặc theo `gh-ids.json`: nhóm 3.1 dạng 3) — mọi ví dụ có 1–2 hình `do_thi_ham` ở đề (hàm nhiều khúc: mỗi khúc một phần tử `ham` với `tu`/`den`, điểm đặc/rỗng bằng `diem` có `kieu`: `dac` | `rong`, đường thẳng đứng bằng `doc`). Dạng khác nếu thấy hình giúp hiểu (giới hạn một bên, giới hạn vô cực) được dùng hình, không bắt buộc. Đề phải KHỚP hình (toạ độ điểm, giá trị) và đủ dữ kiện để làm bài. Vẽ thử PNG rồi nhìn bằng Read: `node scripts/kho/hinh-luong-giac.mjs <mo-ta.json> <ra-khong-duoi>` (json có `"loai":"do_thi_ham"`).

## 3. Lý thuyết CẤP NHÓM (`=== NNB…`)
Với MỖI nhóm của chuyên đề, một khối riêng trong cùng tệp, khuôn:
```
=== NNB01576
@ly_thuyet:
##ĐN <tên>        (nếu có định nghĩa của nhóm)
…
##TC
• …
##PP <tên>        (tổng quan 3–5 dòng: khi nào dùng dạng nào)
…
##CY
• …
```
Lý thuyết nhóm = phần CHUNG của mọi dạng trong nhóm (định nghĩa, quy tắc, bảng dấu, các giới hạn đặc biệt trong SGK), KHÔNG chứa ví dụ, KHÔNG lặp chi tiết riêng từng dạng. Đọc `spec-format-noidung.md` ở Repo (các thẻ `##ĐL/ĐN/TC/CY/PP/VD`, dòng trống cắt khối; một khung KHÔNG có dòng trống bên trong).

## 4. Kiểm trước khi nộp
Chạy (từ Repo) tới **lỗi 0**: `node kho-rules/dai/lo/k11/ban-do/kiem.mjs "C:/Users/WBPC/bk-kho-lam-viec/bdm/k11/ra/<LUOT>.txt"`. Máy kiểm báo cả luật chung của Thùy (• đầu dòng, ≥3 công thức một dòng, tiêu đề ##PP có `$`, hình vẽ được). Mọi ví dụ tự thử bằng script số (quét $n$ lớn, thay $x$ gần $x_0$ hai phía, kiểm tham số bằng quét) — script ở `<LV>\tam\<LUOT>\`.

## 5. Cuối tệp
`## GHI CHÚ CHO CEO`: dạng nào mô tả hiểu theo cách bạn chọn / mơ hồ; chỗ ít chắc; chỗ sách và Từ Tâm / PNL khác nhau về cách làm. Không có ghi "Không".

## 6. Trả lời cuối (≤ 120 từ)
Số dạng / số nhóm đã soạn · số ví dụ · số hình đã vẽ và nhìn · máy kiểm lỗi 0 chưa · các điểm ít chắc.
