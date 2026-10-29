KẾT LUẬN: ĐẠT

# Soát tt-b3-p1 (Từ Tâm C3-B3 Hàm số liên tục, phần 1/2)

- Số câu: 41 (21 `giang` = Ví dụ 1.1–3.8 · 20 `luyen` = trắc nghiệm C1–C8, C11–C14, C16–C23) · Đ/S 0 · `kiem.mjs` ✔ đạt.
- Lệch Pha 1 (giải mù, `tt-b3-p1.kiem.md`): **trước 0 / sau 0**. Mọi kết luận / chữ cái trùng bản giải mù.
- KHÔNG sửa câu nào ⇒ không tạo `tt-b3-p1.goc.json`.

## Đã kiểm
- Đề: đối chiếu nguồn `.txt` cho mọi câu có ghi chú. C1 «liên tục trên cm» → «liên tục trên khoảng $(a;b)$» là lỗi chuyển đổi hiển nhiên (phương án chỉ có nghĩa với giả thiết này) — đồng ý.
- Lời giải: soát từng dòng VD2.6 (Horner $4x^6+4x-8=4(x-1)(x^5+\dots+2)$ ✓), VD2.8 (tách $\tfrac12-\tfrac13$ ✓, không dùng giới hạn cấm), VD3.5 (quy đồng + $x^4-2x^3+x^2-x-2=(x-2)(x^3+x+1)$ ✓, chia ca $m$ ✓, nghiệm khác $0;-3$ ✓), VD3.7 và VD3.8 (bốn giá trị tại $0,\tfrac\pi2,\pi,\tfrac{3\pi}2$ tính lại tay, tổng $=0$ ✓). Không L'Hôpital / đạo hàm / $\tfrac{\sin x}{x}$.
- Phần 1: không câu nào lộ đáp số cuối hay loại trừ phương án.
- `kiem`: đều tính lại từ đề (hai phía điểm, quét tham số, bisection cho bài có nghiệm), không tautology. C1 (lý thuyết) chỉ kiểm ví dụ số — chấp nhận được.
- Dạng: khớp `dich.md` cho 39/41 câu (NDB01187 · 01188 · 01191 · 01193 · 01194 · 01199 · 01200 · 01201); VD3.8 có khoảng cho sẵn nhưng chứa tham số ⇒ 01201 đúng luật dạng sau thắng.

## Bảng lỗi
| id | lỗi | sửa gì |
|---|---|---|
| — | không có lỗi cần sửa | — |

## Xác nhận các điểm trạm soạn nêu
| điểm | xác nhận |
|---|---|
| C2 sách «Chọn D» | Đúng là C. Nguồn: lời giải sách lập luận cho «liên tục, tăng, $f(a)f(b)>0$» (= phương án C) rồi in «Chọn D». D sai (hàm dấu có nghiệm $x=0$ mà gián đoạn). Giữ C, ghi LỆCH SÁCH. |
| VD2.3 đề $m^2+5m$ vs lời giải $2m+3$ | Đúng như nêu. Giải theo đề in: gián đoạn ⇔ $m\ne\dfrac{-15\pm\sqrt{237}}{6}$ (máy kiểm). Có dòng «Lưu ý» đầu Phần 2 + ghi_chu. |
| VD3.2 đề $2x^2$ vs lời giải $3x^2$ | Đúng. Với đề in: $f(-3)=-41,f(0)=10,f(1)=-13,f(2)=4$ — vẫn đúng ba nghiệm; sách còn ghi nhầm khoảng $(1;2)$ cho cặp $f(0)f(1)$. |
| C1, C2 để trống dạng | Hợp lý: hai câu lý thuyết (định nghĩa liên tục trên đoạn; mệnh đề về định lí giá trị trung gian), bản đồ không có dạng «nhận biết lý thuyết». |
| C9 bỏ | Hợp lý: cần TXĐ của $\log_3x$ — mũ–logarit nằm ngoài phạm vi CẤM. |
| C10 bỏ | Hợp lý: cần $\lim\limits_{x\to0}\dfrac{1-\cos x}{x^2}=\dfrac12$ (giới hạn lượng giác đặc biệt, CẤM); phương án A còn hỏi đạo hàm. |
| C15 bỏ | Hợp lý: công thức hàm mất (`EQ-FAILED`). Lời giải sách cho thấy nhánh $\dfrac{x^2-3x+2}{x-1}$ và $f(1)=m^2+m-1$ (đáp D: một số tự nhiên $m=0$) nhưng điều kiện nhánh không chắc ⇒ không dựng lại (thà bỏ trống). Có thể khôi phục nếu xem bản Word/PDF gốc. |
| C23 phương án lấy từ đầu tt-b3-p2 | Đúng: 4 phương án + «Chọn A» nằm ở 3 dòng đầu `tt-b3-p2.txt`; `tt-b3-p2.json` không có C23 (bắt đầu từ p2-24) ⇒ không trùng. Máy kiểm $m\in\{1;-\tfrac32\}$. |

## Câu còn nghi cần CEO
- **VD2.3** — sách: $f(1)=2m+3$ ⇒ $m\ne-\tfrac43$; bản soạn (theo đề in $m^2+5m$): $m\ne\tfrac{-15\pm\sqrt{237}}{6}$. Đề in gần như chắc chép nhầm từ VD2.2 ($m^2+5m$ y hệt), đáp số xấu cho một ví dụ giảng. Thùy chọn: giữ đề in, hay sửa đề thành $2m+3$ (đáp số $m\ne-\tfrac43$, khớp lời giải sách).
- **VD3.2** — đề $2x^2$ (bản soạn) vs lời giải sách $3x^2$; cả hai đều đúng ba nghiệm, chỉ khác số. Không cần quyết trừ khi muốn khớp sách.
- **C1, C2** — cần dạng «lý thuyết liên tục / định lí giá trị trung gian» nếu muốn đưa vào kho dạng (C2 gần nhất là NDB01199 nhưng không phải bài chứng minh).
