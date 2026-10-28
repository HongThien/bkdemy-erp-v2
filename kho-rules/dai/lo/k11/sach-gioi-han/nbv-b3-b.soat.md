KẾT LUẬN: ĐẠT

# Soát nbv-b3-b (NBV — Hàm số liên tục — phần B, tự luận)

- Số câu: 57 (từ 46 câu nguồn, đã tách ý), đều `luyen`, `tu_luan`, `dap_an "—"`. Đủ dạng, 0 câu chưa dạng.
- Lệch Pha 1 (giải mù bằng máy, `nbv-b3-b.kiem.md`): **trước 0 / sau 0**. Cả 57 câu trùng bản soạn. Hai câu tôi ghi MƠ HỒ ở Pha 1 (37, 45) thì bản soạn chọn đúng cách hiểu của lời giải sách (37 tính theo bậc thang, 45 tính theo tỉ lệ).
- `kiem.mjs` (đã có bộ quét LaTeX hỏng) ✔ đạt cả trước và sau khi sửa. Tôi quét thêm: không có ký tự CR, không lệnh nào mất `\` (lim, to, le, ge, ne, pi, alpha, begin, cases, sin, cos, tan, cdot…), không `\times`/`\left`/`\right`/`\frac`. Bản trước khi sửa: `nbv-b3-b.goc.json`.
- Đề chuẩn hoá: đối chiếu từng câu với nguồn `.txt` — giữ nghĩa (số, dấu, mũ, căn, |·|, một bên ±). Câu 35 chuyển bảng giá thành câu chữ, đúng số liệu.
- Tách ý: các câu 5, 6, 8, 9, 10, 11, 12, 13, 20, 36, 38, 44 (mỗi ý một hàm / một phương trình riêng) tách đúng. Giữ nguyên câu 3, 14, 15, 23, 29, 34, 35, 41, 46 (các ý cùng dữ kiện) — đúng.
- Dạng: đối chiếu `dich.md`, theo luật dạng sau thắng — không sai. (22, 24: 01197 sau 01191 ✓; 28, 31: 01197 sau 01193 ✓; 3: 01196 ✓; 35: 01198 ✓.)

## Câu BỎ — đã xác nhận trong nguồn
| câu | lý do |
|---|---|
| 1 | đọc $f(0)$, $\lim f$ từ hai đồ thị (`image4`, `image5`) — không có chữ |
| 4 | đọc tính liên tục từ đồ thị (`image35`) |
| 33 | ý a tìm $a,b$ "dựa vào đồ thị" (`image354`), ý b, c dùng kết quả ý a |
| 21 | $f(x)=\dfrac{\sqrt{x-1}-\sqrt{1-x}}{x}$ chỉ xác định tại $x=1$, không xác định quanh $x=0$ ⇒ đề hỏng. Đáp số sách $2$ cũng không khớp cách sửa tự nhiên ($\dfrac{\sqrt{1+x}-\sqrt{1-x}}{x}\to1$) ⇒ không phải lỗi in hiển nhiên, bỏ đúng |

## Phân xử bằng máy các điểm trạm soạn nêu
| id | sách | máy | kết luận |
|---|---|---|---|
| 29 a | $6-(-6)=12$ | phải $\to-6$, trái $\to6$ ⇒ phải − trái $=-12$ | sách lấy trái − phải ⇒ giữ $-12$, `LỆCH SÁCH` đúng |
| 36-a | $f(0)\cdot f(-1)=(-1)\cdot3$ | $f(-1)=-5$, $f(1)=3$ ⇒ $f(0)\cdot f(1)=-3$ | sách in nhầm $f(-1)$ thay $f(1)$; kết luận không đổi |
| 44-a | $f(2)=4-\sqrt2$ | $f(2)=4-\sqrt3\approx2{,}268$ | sách in nhầm; kết luận không đổi |
| 34 | đề sách có ý a "Vẽ đồ thị" | — | bỏ ý a, đánh lại a, b; lời giải tự lập $C(t)$ — đúng |
| 41 c | $\alpha\to\frac{\pi^{+}}{2}$ (lời giải sách cũng $+$) | $\alpha<\frac{\pi}{2}$ nên chỉ có giới hạn trái; $10(\alpha+\cos\alpha)\to5\pi$ | đã sửa chữ đề thành $(\frac{\pi}{2})^{-}$, ghi ở `ghi_chu` |
| 45 | $f=30$ ($0<x\le1$), $10+20x$ ($x>1$), liên tục trên $(0;+\infty)$ | thay lại: hai bên $x=1$ đều $30$ | trùng sách; có dòng "Lưu ý" đầu Phần 2 |
| 39, 40 | — | Q gián đoạn tại 0, 2; $S=\sin2\alpha$, hai giới hạn $0$ (dựng toạ độ thật trên đường tròn) | trùng; dạng 01198 `vua` hợp lý |
| 46 | — | — | dạng 01199 `vua` hợp lý |

Phần 2 do soạn tự viết (sách chỉ in đáp số: 9, 10, 11, 12, 13-b, 14, 15, 20): đọc từng dòng — ĐKXĐ đủ (12-d nửa khoảng đóng, 13-a $(-1;1)\subset(-\frac{\pi}{2};\frac{\pi}{2})$, 14-c $f+g=(x-1)^2$ phải $>0$), giới hạn một bên đúng dấu, không L'Hôpital / đạo hàm.

## Lỗi đã sửa
| id | lỗi | sửa gì |
|---|---|---|
| nbv-b3-b-46 | lời giải: Mấu chốt nêu thẳng kết luận ý c ("mâu thuẫn với ý b nên hàm không liên tục"); Bước 4 nói trước "mâu thuẫn" | Mấu chốt = phát biểu định lí giá trị trung gian + "đối chiếu với hai ý đầu"; Bước 3–4 viết lại không lộ kết luận |
| nbv-b3-b-34 | lời giải: Mấu chốt "nhảy tại các mốc giờ" = lộ kết luận ý a | Mấu chốt nêu hàm hằng trên từng khoảng giờ, "tại mỗi mốc giờ so hai giới hạn một bên" |
| nbv-b3-b-37 | lời giải: Mấu chốt "gián đoạn tại các mốc giờ" = lộ đáp số | viết lại như câu 34 |
| nbv-b3-b-37 | `ghi_chu` sai sự thật ("hình không cần để giải") — thực ra đề sách có yêu cầu "vẽ đồ thị hàm số" đã bị bỏ im lặng | `ghi_chu` ghi rõ đã bỏ yêu cầu vẽ đồ thị |

Ghi nhận, không sửa: Phần 1 của nhóm câu 01195 dùng chung một khuôn 4 bước tổng quát (đúng nhưng chung chung, có câu nhắc "căn thức" khi đề không có căn). `kiem` của 8-a, 12-b, 18, 20 chỉ kiểm nghiệm mẫu (đủ cho đáp số "khoảng liên tục").

## Còn cần CEO
- **nbv-b3-b-45**: đề "thu thêm 20 nghìn cho mỗi giờ tiếp theo" — sách giải theo tỉ lệ thời gian (liên tục), trong khi câu 34, 37 cùng phần giải bậc thang (gián đoạn). Bản này theo sách + "Lưu ý". Giữ, hay sửa đề cho rõ "tính theo phút"?
- **nbv-b3-b-41**: sửa thẳng chữ đề $\frac{\pi^{+}}{2}\to(\frac{\pi}{2})^{-}$. Ở `nbv-b2-d-14` (cùng bài bể bơi), soát trước giữ chữ đề sách + "Lưu ý". Hai tệp đang xử lý KHÁC nhau — Thùy chọn một cách cho cả hai.
- **nbv-b3-b-21** (bỏ): nếu muốn giữ, cần Thùy chọn đề đúng (ví dụ $\sqrt{1+x}-\sqrt{1-x}$ ⇒ đáp số $1$, không phải $2$ như sách).
