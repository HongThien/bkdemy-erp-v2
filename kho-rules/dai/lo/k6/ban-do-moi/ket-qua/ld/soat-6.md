KẾT LUẬN: ĐẠT

# Biên bản soát gói 6 — Nâng cao số nguyên tố (lý thuyết cấp dạng bài)

- Trạm soát: Opus · 14/10 · bản gốc trạm soạn giữ ở `out-6.goc.json`.
- Số dạng đã soát: **12/12** (NDB00388–00399). Cổng `kiem-goi.mjs`: **✔ đạt cổng** (lý thuyết dạng 12 · ghi chú 7).
- Phải sửa: **6 dạng** — toán 2 (NDB00390, NDB00398) · thiếu điều kiện 3 (NDB00392, NDB00394, NDB00395) · định dạng 1 (NDB00393); NDB00399 sửa lời một câu (không phải lỗi toán).
- Không sửa: NDB00388, 00389, 00391, 00396, 00397 — đúng, khớp ví dụ, có dấu hiệu riêng, trong phạm vi lớp 6.

## Kiểm bằng máy (`node`, vét cạn)

- Ví dụ hiện có: 393 → chỉ $p=2$; 394 → chỉ $p=3$; 395, 396 → chỉ $p=5$ (cả 2 ví dụ mỗi dạng, $p<3000$).
- $4n+3$, $6n+5$ dùng tích 24: hiệu bằng 2 (không phải 1).
- $2a+3b$, $4a+7b$: $a=1$, $b=2$ ⇒ 8 và 18, ƯCLN = 2.
- $\dfrac{2n+1}{2n+2}$ tối giản với mọi $n$ (hiệu = 1) dù $2n+2$ có hệ số và hằng số cùng chia hết cho 2.
- $p+2$, $p+6$ (dư 2 và 0 khi chia 3): $p=5, 11, 17, 41…$ đều thỏa ⇒ "hằng số khác dư" không đủ.
- $p+6$, $p+10$, $p+12$, $p+18$ (dư 1; 0; 2; 3 khi chia 5): $p=61$ thỏa ⇒ "số dư khác nhau" không đủ.
- 230 bộ $\dfrac{an+b}{cn+m}$ ($a,c<8$; $b,m<12$) tối giản với mọi $n$ mà hiệu > 1: mọi ước nguyên tố của hiệu đều có một biểu thức mà hệ số chia hết còn hằng số không (0 ngoại lệ). $\dfrac{2n+1}{2n+5}$: hiệu 4, ước $d=4$ không có hệ số nào chia hết cho 4.

## Bảng sửa

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00390 | toán | `##CY` "dùng tích 24 vẫn đúng nhưng số lớn dễ sai" ⇒ "Phải dùng BCNN … dùng 24 thì hiệu là 2, chưa suy ra được $d=1$" + thêm dòng "Hiệu không bằng 1 thì chưa kết luận được $d=1$" | Nhân theo tích thì hiệu bị nhân lên (4n+3, 6n+5: hiệu 2), phương pháp không kết thúc được ở $1\vdots d$ — câu cũ dạy sai |
| NDB00398 | toán | `##PP` bước 3: bỏ nhánh "nếu không có hệ số 1 thì khử $b$ bằng nhân chéo"; viết lại: biểu thức hệ số bé là $a+m.b$, lấy $(a+m.b)-m.b$ được $a\vdots d$. `##CY` thêm: hệ số bé của $a$ phải bằng 1, kèm phản ví dụ $2a+3b$, $4a+7b$ | Khi hệ số của $a$ là bội của nhau, "định thức" = hệ số bé × (±1) ⇒ đề đúng thì hệ số bé bắt buộc bằng 1; nhánh cũ ứng với đề sai (chỉ ra $2a\vdots d$) |
| NDB00392 | thiếu điều kiện | `##CY` dấu hiệu "tử/mẫu có hệ số của $n$ cùng ước với hằng số (vd $4n+8$)" ⇒ "sau khi khử $n$ (đã nhân theo BCNN) hiệu là một số lớn hơn 1"; thêm dòng loại ước hợp số ($d=4$ loại nhờ $d=2$) | Dấu hiệu cũ sai ($\dfrac{2n+1}{2n+2}$ hiệu = 1, là dạng cơ bản); bước 3 "chọn biểu thức có hệ số chia hết cho $d$" không làm được với $d$ hợp số như $d=4$ |
| NDB00394 | thiếu điều kiện | Dấu hiệu "hằng số khác nhau về số dư khi chia cho 3" ⇒ "có một hằng số chia 3 dư 1 và một hằng số chia 3 dư 2"; TH2 ghi rõ "$p\neq 3$ (kể cả $p=2$)" | "Khác dư" không đủ ($p+2$, $p+6$ có vô số $p$); $p=2$ phải được thấy là nằm trong $3k+2$ với $k=0$ (khớp ví dụ: dư 2 dùng $k\in\mathbb{N}$) |
| NDB00395 | thiếu điều kiện | Dấu hiệu "hằng số có số dư khác nhau khi chia cho 5" ⇒ "chia 5 có đủ các số dư 1, 2, 3, 4" | Khác dư mà có dư 0 thì một dư của $p$ không bị loại ($p+6$, $p+10$, $p+12$, $p+18$: $p=61$ thỏa) |
| NDB00393 | định dạng | Dấu hiệu "$k.p+m$ với $k$, $m$ lẻ" ⇒ "$a.p+b$ với $a$, $b$ lẻ" | Chữ $k$ trùng với $k$ trong $p=2k+1$ ngay bước sau |
| NDB00399 | (lời) | `##TC` "Muốn hai hệ số không là bội của nhau bằng nhau…" ⇒ "Hai hệ số không là bội của nhau: muốn chúng bằng nhau thì…" | Câu cũ khó đọc; toán không đổi |

## Đã soát, giữ nguyên (theo yêu cầu riêng của gói)

- **Điều kiện phương pháp:** dạng 1 ẩn (388–391) đều có "hiệu bằng 1 thì $d=1$ / hiệu không bằng 1 chưa kết luận"; dạng 2 ẩn 397 có "hệ số của $b$ hơn kém nhau đúng 1", 399 có "mỗi lần hiệu phải ra đúng $a$ / $b$" (tương đương định thức ±1; khi đó hai hệ số nguyên tố cùng nhau nên BCNN = tích, khớp "nhân chéo" của lý thuyết nhóm).
- **Xét dư cho 3 / 5 đủ trường hợp $p=2,3,5$:** 394 — $p=3$ riêng, $p=2$ trong $3k+2$ ($k\in\mathbb{N}$), $3k+1$ dùng $k\in\mathbb{N}^*$, `##CY` nhắc biểu thức phải > 3 (vd $p=2$, $p+1=3$). 395, 396 — thay riêng $p=2$, $p=3$, $p=5$; $p>5$ xét đủ 4 dư với $k\in\mathbb{N}^*$, mọi biểu thức > 5. Khớp 4 ví dụ.
- 396: công thức $a.p+b=5.a.k+(a.r+b)$ đúng; điều kiện chia hết cho 5 là $(a.r+b)\vdots 5$ — đúng hai chiều.
- Kiến thức: chỉ dùng tính chất chia hết của tổng/hiệu/tích, số chẵn/lẻ, số dư, ƯCLN/BCNN — không đồng dư, không định thức, không chuyển vế.

## Điểm còn nghi gửi CEO

1. **NDB00397** (mô tả "a+xb và a+yb"): chỉ đúng khi hệ số của $b$ hơn kém nhau đúng 1 ($a+2b$, $a+5b$ với $a=b=1$ ra 3 và 6). Đề nghị thêm điều kiện vào mô tả dạng (đã có trong `ghi_chu`).
2. **NNB00917**: mô tả nhóm rỗng, lý thuyết nhóm hiện có là bản chép của nhóm "nguyên tố cùng nhau" — lệch tên nhóm "Tìm số nguyên tố $x$ để … đều là số nguyên tố". Cần lý thuyết nhóm riêng (số chẵn duy nhất là 2; xét dư cho 2, 3, 5).
3. **NDB00391 / NDB00392** đang chung cụm cũ với 388–390 / 391; **NDB00394–00396** chung cụm cũ DCUM01582 tên "=2" — tên cụm cũ lệch dạng (không sửa ở trạm này).
4. **NDB00395 vs NDB00396**: ranh giới "4 biểu thức" / "nhiều hơn 4" mỏng; khác biệt thật là 396 có biểu thức $a.p+b$ (hệ số của $p$ khác 1) — đã nêu ở dấu hiệu, CEO cân nhắc đổi tên/mô tả theo tiêu chí này.
5. **NDB00398**: mô tả "nhân 1 trong hai hệ số x hoặc z" — đề đúng của dạng này luôn có hệ số bé bằng 1; nếu CEO muốn gồm cả ca nhân theo hệ số của $b$ thì lý thuyết cần thêm một dòng "đổi vai $a$, $b$".
