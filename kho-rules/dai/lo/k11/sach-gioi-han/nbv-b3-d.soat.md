KẾT LUẬN: ĐẠT

# Soát nbv-b3-d — NBV Hàm số liên tục, phần D (Đúng/Sai)

- Số câu: **42** (48 câu nguồn − 6 câu bỏ) · tất cả `luyen`, `dung_sai`, `dang_bai: null` · 168 mệnh đề.
- Lệch Pha 1 (giải mù `nbv-b3-d.kiem.md`, máy `scratchpad/blind-b3d.mjs`) với bản soạn: **trước 0 / sau 0** (168/168 mệnh đề trùng).
- `kiem.mjs` (kể cả bộ quét LaTeX hỏng): ✔ đạt trước và sau khi sửa. Bản gốc: `nbv-b3-d.goc.json`.

## Đối chiếu các điểm trạm soạn nêu (đã xem nguồn `.txt` + tính bằng máy)
- **Câu bỏ** — xác nhận đúng: 10 ([0137] `EQ-FAILED`, mất hàm số), 14 ([0208] `EQ-FAILED`), 23 ([0323] mất $f_3$, $f_4$), 40 ([0579] toàn bộ `omml-equation-not-converted`), 27 ([0388] `[[img]]`, đọc đồ thị), 38 ([0546] `[[img]]`, đọc đồ thị).
- **26 c)** — LỆCH SÁCH đúng: sách ghi "c) Đúng" ([0384]) nhưng chính lời giải sách kết luận "không liên tục tại $x=4$"; máy: trái $120\,000$, phải $140\,000$ ⇒ **Sai**. Ý d) Đúng (liên tục phải tại 4). Đồng ý.
- **5 d)** — sách tính $f(2)/g(2)=2{,}5$; đúng là $4{,}5/2=2{,}25$, lim thương $=2$ ⇒ vẫn Sai. Đồng ý.
- **43 b)** — sách ghi $20000+14000\cdot14=396000$ ([0632]); đúng $216\,000$; đề nêu $369\,000$ ⇒ vẫn Sai. Đồng ý.
- **44 a)** — sách ghi lim $=6=f(2)$ ([0646]); đúng là $7$; kết luận Đúng không đổi. Đồng ý.
- **2** — dòng trung gian "90=2m+45" in lỗi; đáp số $m=43$ ⇒ d) Sai. Đồng ý.
- **35 d)** — sách đúng kết luận Đúng, chỉ viết nhầm ký hiệu $f$ thay $h$. Máy: $h(x)=x(x^3-8x^2-10x+8)$, $h(\tfrac12)=\tfrac9{16}>0$, $h(\tfrac34)<0$. Đồng ý.
- **Trùng đề** 6=1, 13=5, 39=33, 45=2, 46=25 — xác nhận nguồn in lặp (lời dẫn khác chữ, 4 ý y hệt). Bản soạn giữ cả hai, ghi `ghi_chu`.
- **22 c)** đề sách viết $\lim_{x\to5^+}f(t)$ — chuẩn hoá thành $t\to5^+$ (lỗi in hiển nhiên). Đồng ý.

## Bảng lỗi đã sửa
| id | lỗi | sửa gì |
|---|---|---|
| nbv-b3-d-9 | lời giải — Phần 1 Bước 4 lộ đáp án ý c ("bác bỏ mệnh đề nói đúng với mọi $a$") | viết lại trung tính: lập điều kiện của $a$ rồi đối chiếu |
| nbv-b3-d-35 | lời giải — Phần 1 Bước 3 lộ ý c ("hàm gián đoạn ở đó") | → "xét những điểm làm mẫu bằng 0 để kết luận về tính liên tục" |
| nbv-b3-d-18 | lời giải — Mấu chốt lộ ý c, d ("hai giới hạn một bên khác nhau") | → "mỗi giới hạn một bên đọc ngay từ nhánh tương ứng" |
| nbv-b3-d-47 | lời giải — Mấu chốt lộ ý b ("hàm nhiều công thức liên tục"); Phần 2 ý d thiếu xét đoạn $(0;\frac12]$ khi khẳng định "đúng hai giá trị" | Mấu chốt trung tính; thêm "trên $(0;\dfrac12]$, $h=2\,000\ne0$" |
| nbv-b3-d-33 | lời giải — ý c khẳng định (2) có 3 nghiệm trong 3 khoảng mà không đưa giá trị | thêm $g(-2),g(-1),g(0),g(1),g(2)$ + "bậc ba tối đa 3 nghiệm" |
| nbv-b3-d-16, 47, 48 | định dạng — `\frac` (21 chỗ, trong đề ý a câu 47 và lời giải) | → `\dfrac` theo brief |

Không có lỗi đáp số / đề / tách ý / dạng / phạm vi kiểu L'Hôpital–đạo hàm.

## Soát thêm (không cần sửa)
- (b) Đ/S đều `luyen`, `dang_bai: null` đúng luật Thùy 26/10. Không tách ý (Đ/S giữ 4 ý).
- (d) Phần 2 mỗi ý một đoạn "Ý x) Đúng/Sai vì …", dòng cuối nêu cả bốn; `\cdot`, không `\left`/`\right`/`\times`.
- (g) `kiem` dựng lại hàm từ đề, tính giới hạn hai phía ở $x_0\pm10^{-6}$, đếm đổi dấu, quét tham số / lưới $(a,b)$ (câu 48) — không tautology.

## Câu CÒN nghi cần CEO
1. **Trùng đề 6/1, 13/5, 39/33, 45/2, 46/25** — sách in lặp; nhập cả hai thì kho có 5 cặp câu y hệt. Đề xuất: chỉ nhập một bản mỗi cặp (bỏ 6, 13, 39, 45, 46 ⇒ còn 37 câu). Chờ Thùy chọn.
2. **Kiến thức lượng giác chương I K11** trong 8 d) (nghiệm dương nhỏ nhất của $\sin x=1$), 11 d) (GTLN $m\sin x+n\cos x=\sqrt{m^2+n^2}$), 24 ($g=\sin\frac{\pi x}{4}$), 30 d) (đếm nghiệm $\sin x=0$ trên đoạn). Đều học trước chương V nên không thuộc danh mục CẤM; riêng 11 d) dùng công thức $\max(a\sin x+b\cos x)$ — nếu Thùy coi ngoài whitelist thì bỏ ý / thay ý.
3. **Câu 10 có thể khôi phục**: lời giải sách ([0145]–[0152]) cho thấy hàm là $-x^2+m$ khi $x\le1$, $\dfrac{\sqrt{x+3}-2}{x-1}$ khi $x>1$ (đáp án Đ, Đ, S, S; $m=\frac54$). Không tự khôi phục vì đề gốc mất (thà bỏ trống); nếu Thùy có bản sách gốc thì nhập bổ sung được.
