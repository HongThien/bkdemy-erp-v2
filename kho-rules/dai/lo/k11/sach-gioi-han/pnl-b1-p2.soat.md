KẾT LUẬN: ĐẠT

# pnl-b1-p2 — biên bản soát (nhân chứng thứ hai)

- Số câu: bản soạn **67** → sau soát **69** (+ `TN49` dựng mới theo việc giao thêm, + `C55` trạm soạn bỏ sót). Gồm 33 trắc nghiệm (TN49, Câu 50–81) · 11 Đ/S (Phần II Câu 1–11) · 22 trả lời ngắn + 3 tự luận (Phần III Câu 1–26, bỏ Câu 25). 0 giảng. `kiem.mjs`: ✔ đạt trước và sau sửa; tự `eval` lại toàn bộ `kiem`: 69/69 `true`.
- Lệch đáp số Pha 1 (giải mù, `pnl-b1-p2.kiem.md`) so với bản soạn: **trước 0 / sau 0** (kể cả từng ý Đ/S). TN49: bản mù $a=\sqrt2$ khớp trạm trước và lời giải sách (B).
- Đề chuẩn hoá đối chiếu nguồn `don-vi/pnl-b1-p2.txt`: số / dấu / mũ / chỉ số giữ đúng. Sửa chữ đề của trạm soạn đều hợp lệ: Câu 76 khôi phục đề từ lời giải sách (đề in lẫn $\frac{r_1}{r_2}=\frac13$), Câu 78 $C_5^4\to C_5^3$, Phần III Câu 21 thêm ngoặc $(2n-1)$, Phần II Câu 11 ý c) thêm định nghĩa $u_n$ theo lời giải sách.
- Câu BỎ vì hình: Phần III Câu 25 — đúng (đề "nối các điểm chia một cách thích hợp (hình vẽ)": tỉ số diện tích phụ thuộc cách nối, không suy ra được từ chữ). Câu 24, 26 hình chỉ minh hoạ — giữ đúng.
- Phạm vi: không L'Hôpital / đạo hàm / `\times` / `\left` `\right` / `$$`. Kẹp chỉ dùng dạng $|u_n-L|\le v_n\to0$ (SGK). `kiem` tính lại từ đề, không hằng đúng (trừ DS9 ý d — đã sửa).

## Sửa

| id | lỗi | sửa gì |
|---|---|---|
| C55 | đủ câu (bỏ sót) | Trạm soạn bỏ mất Câu 55 ($a=3{,}1313\dots=\frac{x}{y}$, đủ chữ, không hình). Dựng: vai luyen, NDB01164 cao, đáp số $\frac{310}{99}$ ⇒ $x+y=409$ ⇒ **B** (khớp sách); `kiem` tính tổng CSN rồi tìm phân số tối giản bằng máy. |
| TN49 | đủ câu (việc giao thêm) | Dựng Câu 49 PNL Bài 1 (đề cuối `pnl-b1-p1.txt`, phương án đầu `pnl-b1-p2.txt`): vai luyen, trắc nghiệm, NDB01158 cao (cùng kiểu Câu 79), $\lim(\sqrt{n^2+an}-n)=\frac a2=\frac{\sqrt2}2$ ⇒ $a=\sqrt2\in(1;2)$ ⇒ **B** (khớp sách). `kiem` giải $a$ bằng chia đôi ở $n=10^7$ rồi xét cả 4 khoảng. |
| C64 · C65 · C66 | lời giải (Phần 1 lộ đáp số) | Mấu chốt / Bước nói thẳng "dần về $0$", "giới hạn của hiệu chính là hằng số $5$" ⇒ viết lại thành bước nghĩ "chặn rồi tìm giới hạn của dãy chặn". |
| C63 · C64 · C65 · C66 | dạng | null → **NDB01148** (vừa): chặn $\lvert u_n-L\rvert$ bởi dãy → 0 là định nghĩa "giới hạn 0 / hữu hạn" của 01148; nhất quán với soát `pnl-b1-p1` (D1BT2e, chặn $\lvert\sin3n\rvert\le1$, giữ 01148). |
| DS9 | kiem (hằng đúng) | Ý d) cũ `ok(4/1,16/4)`; nay giải $a$ bằng máy (chia đôi) và kiểm $\frac ba=\frac{16}b$. |

Đã xét, giữ nguyên: C61 ở NDB01161 (rút $n$ + quy tắc tích; liên hợp bậc ba không dùng được vì giới hạn vô cực ⇒ không thuộc 01159); C67 / TL1 ở 01157, TL6 ở 01152 (vừa); C80 ở 01167; TL21 / TL9 / TL10 để `tu_luan` (đáp số phân số, đề không đòi số thập phân — theo luật brief).

## Phân xử bằng máy các điểm trạm soạn nêu

- **Phần II Câu 6 ý c — LỆCH SÁCH, bản soạn đúng.** $I=\frac{a^2-a-2}{2}$; $I=0\Leftrightarrow a\in\{-1;2\}$ (quét $a\in[-20;20]$ ở $n=10^7$ ra đúng 2 giá trị), tổng $=1$ ⇒ **Đúng**. Sách ghi Sai với lí do "$-1+2=1\ne0$" — tự mâu thuẫn. Ý a) cả sách và soạn: Sai (biểu thức ý a không ứng với $a$ nào).
- **Phần III Câu 19 — đề thiếu thừa số 2, đáp số 3 đúng.** Máy: vế trái → $\frac43$, vế phải với $a=2,b=1$ → $\frac23$, tỉ số đúng bằng 2 ở $n=10^5$; $a,b$ chỉ xác định từ mẫu ⇒ $S=3$.
- **Câu 78** $C_5^4\to C_5^3$: tổng $\sum_{k=3}^{10^6}\frac{1}{C_k^3}=1{,}4999\dots$ ⇒ B; lỗi in hiển nhiên, sửa đúng.
- **Câu 76** khôi phục đề: $\sum_{k\le10^7}\frac{1}{k\sqrt{k+1}+(k+1)\sqrt k}\to1$ ⇒ C, khớp sách.
- **Câu 80**: chiều cao $h_n=2(1-2^{-n})<2$ với mọi $n$, $\sup=2$ không đạt ⇒ "dưới 2 mét" (C) đúng; "tối đa là 2 mét" (B) sai nghĩa chặt (không có giá trị lớn nhất). Giữ C.
- **Trùng đề trong sách** (đã đối chiếu từng chữ): C56 ≡ C53, C59 ≡ C54, C68 ≡ C57 (y hệt cả phương án); C69 ≡ C52 (đổi thứ tự phương án); Phần III Câu 10 ≡ Câu 2 (Câu 2 đòi số thập phân). Giữ trong JSON (không xoá), cần CEO quyết lúc ghi.

## Còn nghi — cần CEO

1. **Trùng đề** C56/C59/C68 (y hệt C53/C54/C57), C69 (≈ C52), TL10 (≈ TL2). Soát `pnl-b1-p1` đã nhập bản lặp y hệt **một lần**. Đề xuất: lúc ghi DB bỏ C56, C59, C68 (và C69, TL10 nếu coi đổi thứ tự / đổi khuôn đáp án là trùng). Thùy chọn.
2. **Phần II Câu 6 ý c**: bản hiện tại **Đúng** (sách Sai). Máy xác nhận tổng hai nghiệm $=1$.
3. **Câu 80 phương án B** "tối đa là 2 mét": giữ C theo sách; nếu Thùy thấy B gây tranh cãi, có thể sửa chữ B thành "Chiều cao của mô hình bằng $2$ mét".
4. **Dạng — bản đồ thiếu** (11 câu trắc nghiệm / trả lời ngắn / tự luận còn trống): *tổng teleskop* (C71, C72, C73, C75, C76, C78, TL9) · *tích teleskop* (C77) · *dãy truy hồi → dãy phụ cấp số nhân* (C62, TL14) · *rút gọn thừa số chung chứa luỹ thừa* (TL22). Lưu ý không nhất quán với soát `pnl-b1-p1`: ở đó TN09/TN10 (tổng đặc biệt) được để **tạm** ở NDB01156 (vừa); ở đây để trống. Nếu Thùy muốn "tạm 01156" cho cả hai đơn vị thì 7 câu teleskop đổi theo.
5. **Kẹp** (C63–C66) tôi xếp NDB01148 (vừa). C63 là kẹp giới hạn $1$ (không phải $0$), xa ví dụ 01148 hơn — nếu bản đồ thêm dạng "nguyên lí kẹp / dãy bị chặn" thì cả 4 câu chuyển sang đó (`.goc.json` còn bản để trống).
