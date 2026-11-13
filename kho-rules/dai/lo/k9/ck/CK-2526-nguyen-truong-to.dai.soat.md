KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2526-nguyen-truong-to · lượt ĐẠI SỐ (trạm soát Opus, 13/11)

## Lượt 2 (13/11) — soát 9 câu bổ sung PHẦN 4 Bài tập nâng cao (thay kết luận lượt 1)

- **Tổng sau bổ sung:** 56 câu, 4 phần (5 trả lời ngắn + 51 tự luận). Không còn sót: đủ Bài 1–20 và 30–34 theo ảnh; Bài 21–29 thuộc lượt Hình.
- **Giải mù trước** (`.dai.kiem.md` mục "Bổ sung", máy `<LV>/tam/dai_soat_mu_nc.mjs`): khớp 9/9 đáp số.
  - 30a: $x=4+7t$, $y=1-4t$ — cùng họ với $(4-7t;\,4t+1)$ của tôi.
  - 30b: không có nghiệm nguyên.
  - 30c: $(\pm1;\pm6)$, $(\pm6;\pm1)$ cùng dấu.
  - 30d: $(1;1)$, $(-1;-1)$.
  - 31: chứng minh, dấu bằng khi $x=y=z$.
  - 32: GTNN $6$ tại $x=y=z=4$.
  - 33: GTLN $\sqrt2-1$ tại $a=b=\sqrt2$.
  - 34a: $x=1$ và hai nghiệm của $x^3+3x^2-x-4=0$. Lượt quét số đầu của tôi bỏ sót $x=1$; khi đối chiếu, thay tay thấy $x=1$ đúng, nên bản soạn đúng.
  - 34b: $x=3$.
- **Điều cấm K9 CKI:** không có $\Delta$, Viète, `⇔` hay kí hiệu `\times`. Không dùng thẳng Cô-si.
  - $\frac mn+\frac nm\ge2$ được chứng minh từ $(m-n)^2\ge0$ (Bài 31, 32).
  - $\sqrt m\le\frac{m+4}{4}$ được chứng minh từ $(\sqrt m-2)^2\ge0$ (Bài 32).
  - Bài 33 dùng $(a-b)^2\ge0$.
  - Bậc hai đều giải bằng phân tích nhân tử.
- **Bài 34a — kiểm ảnh:** phóng to 260 dpi (`<LV>/z/p5_nangcao.png`), ảnh in RÕ $(2x+1)^2$.
  - Theo đúng chữ in: ra phương trình bậc bốn $=(x-1)(\text{bậc ba})$, hai nghiệm vô tỉ chỉ chặn được bằng xét dấu. Cách này ngoài khuôn K9 nhưng vẫn đúng.
  - Nếu là $(2x-1)^2$: đặt $t=\sqrt{x^2-x}$ được $t=2$, $x=\frac{1\pm\sqrt{17}}2$, đúng dạng đặt ẩn phụ.
  - Không phải lỗi in hiển nhiên (ảnh rõ, cả hai bản đều có nghiệm vô tỉ), nên GIỮ chữ in và GIỮ `Chưa chắc` để CEO quyết. Đã ghi thêm vào dòng `Chưa chắc` rằng ảnh in rõ dấu "+".
- **Sửa ở lượt 2** (bản trước khi sửa: `CK-2526-nguyen-truong-to.dai.soan.goc2.md`):

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 32 | lập luận (Phần 1 lộ đáp số) | Bước 3 bỏ "suy ra $P\ge6$", thay bằng "chặn dưới $P$" | Phần 1 không được nêu giá trị nhỏ nhất |
| Bài 32 | lập luận (tham chiếu ngoài câu) | Phần 2 bỏ "Theo Bài 31", chứng minh lại ngay trong câu $\sum\frac{x}{y+z}\ge\frac32$ (đặt $a,b,c$; $\frac mn+\frac nm\ge2$ từ $(m-n)^2\ge0$); Mấu chốt sửa theo | Mỗi câu vào kho đứng riêng, HS có thể không gặp Bài 31 |
| Bài 34a | kiến thức (kí hiệu khoảng) | "$(-3;-2)$", "$(1;2)$", "$(-2;-1)$" ⇒ "$-3<x<-2$"… | Brief mục 5 cấm kí hiệu khoảng |
| Bài 34a | ghi chú | Dòng `Chưa chắc` thêm: ảnh 260 dpi in rõ "+" | Để CEO biết đây không phải lỗi đọc ảnh |

- **Tệp:** `soat_ctrl.mjs` báo 0 lỗi (không TAB/FF, không `\notin`/`\neq` vỡ dòng, số `$` chẵn). Cổng `--khoi 9 --chi-kiem`: ✔ đạt cổng (56 câu, chưa chắc 1).
- **Còn `Chưa chắc` (gửi CEO):** Bài 34a — giữ $(2x+1)^2$ như ảnh (nghiệm $x=1$ và hai nghiệm vô tỉ) hay sửa thành $(2x-1)^2$ (nghiệm $x=\frac{1\pm\sqrt{17}}{2}$).

---

## Lượt 1 (giữ nguyên làm vết) — KẾT LUẬN lúc đó: CHƯA ĐẠT — sót 9 ý Bài 30–34

- **Số câu bản soạn:** 47 (5 trả lời ngắn + 42 tự luận; 0 trắc nghiệm), 3 phần (Dạng 1 · Dạng 2 · Dạng 3).
- **Khớp Pha 1 (giải mù `CK-2526-nguyen-truong-to.dai.kiem.md`, thử máy `<LV>/tam/dai_soat_mu.mjs`) ngay từ đầu:** 47/47 đáp số. Không đổi đáp số nào. Đề chép đúng ảnh cả 47 câu.
- **Số câu phải sửa:** 7 (2c, 3c, 5c, 7, 8, 11, 18) — chỉ lỗi Phần 1 lộ kết luận và định dạng; không lỗi đáp số / kiến thức (không Δ / Viète / Cô-si / `⇔` / "tập nghiệm" / `\times`).
- **Sót bài:** CÓ — trang 5 mục "BÀI TẬP NÂNG CAO" (sau Phần II Hình học) có 5 bài không-hình mà bản soạn bỏ hẳn, cũng không nêu ở `## GHI CHÚ CHO NGƯỜI DUYỆT` (ghi chú soạn nói đề cương chỉ có Bài 01–29):
  - Bài 30 a) $4x+7y=23$ · b) $2x^2-xy+x-y-y^2=5$ · c) $x^2-xy+y^2=x^2y^2-5$ · d) $(x+y+1)(xy+x+y)=5+2(x+y)$ — tìm nghiệm nguyên;
  - Bài 31 chứng minh $\frac{x}{y+z}+\frac{y}{z+x}+\frac{z}{x+y}\ge\frac32$ ($x,y,z>0$);
  - Bài 32 GTNN $P=\frac{x}{\sqrt{y+z-4}}+\frac{y}{\sqrt{z+x-4}}+\frac{z}{\sqrt{x+y-4}}$ ($x,y,z>2$);
  - Bài 33 GTLN $P=\frac{ab}{a+b+2}$ với $a,b\ge0$, $a^2+b^2=4$;
  - Bài 34 a) $(2x+1)^2-9=4\sqrt{x^2-x}$ · b) $\sqrt{6x-x^2}+2x^2-12x+15=0$.
  Sót 9 ý (> 5) ⇒ theo brief không tự soạn bổ sung; cần trả về trạm soạn làm tiếp (đã thêm một dòng vào `## GHI CHÚ CHO NGƯỜI DUYỆT` của tệp soạn).
- **Bài nhập nhầm / trùng lượt Hình:** không (Bài 21–29 chỉ ở `.hinh.soan.md`).
- **Lỗi in trạm soạn đã sửa — kiểm với ảnh, GIỮ cả hai:**
  - Bài 3b: ảnh in "$-10x+1{,}4=2$". Ba hệ số $-10$, $1{,}4$, $2$ đúng bằng $-2$ lần $5$, $-0{,}7$, $-1$ của phương trình đầu ⇒ bài dựng sẵn cho trường hợp vô số nghiệm, thiếu $y$ là lỗi in hiển nhiên; sửa thành $1{,}4y$ đúng. (Nếu giữ đúng chữ in thì $x=-0{,}06$, $y=1$; ghi ở đây để người duyệt biết, không treo cờ.)
  - Bài 7: ảnh in "Cho $P=\dots$ và $P=\dots$", ý b) "Chứng minh $Q=\dfrac{3\sqrt x}{\sqrt x+3}$" và máy xác nhận biểu thức thứ hai rút gọn đúng bằng $\dfrac{3\sqrt x}{\sqrt x+3}$ ⇒ chữ $P$ thứ hai là $Q$, lỗi in hiển nhiên; giữ.
  - Bài 10 (dấu `\` thừa), Bài 12 ("gọi" → "gọn"), Bài 4a ("3.(x+4)" → $3(x+4)$): đúng.
- **Tệp:** không ký tự điều khiển (TAB/FF…), không `\notin` / `\neq` vỡ dòng, số `$` chẵn mọi dòng (kiểm `<LV>/tam/soat_ctrl.mjs`: 0 lỗi). Bản gốc trước sửa: `CK-2526-nguyen-truong-to.dai.soan.goc.md`. Cổng `--chi-kiem`: ✔ đạt cổng (47 câu, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 2c | lập luận (Phần 1 lộ đáp số) | Mấu chốt bỏ "không có nghiệm thực"; Bước 4 "Kết luận phương trình vô nghiệm" ⇒ "So sánh vế trái với $0$ … rồi kết luận" | Phần 1 không được nêu kết luận cuối |
| Bài 3c | lập luận (Phần 1 lộ đáp số) | Mấu chốt bỏ "cho biết hệ có vô số nghiệm" ⇒ "đẳng thức thu được cho biết số nghiệm của hệ" | Như trên |
| Bài 5c | định dạng | Tách dòng trục căn (4 dấu "=") thành 3 dòng | Mỗi phép biến đổi một dòng |
| Bài 7 | định dạng | Ý c: tách chuỗi 4 dấu "=" của $A=P\cdot Q$ thành 4 dòng | Như trên |
| Bài 8 | định dạng | Ý a: tách chuỗi 5 dấu "=" tính $A$ thành 5 dòng | Như trên |
| Bài 11 | định dạng | Ý b: tách quy đồng $A$ (3 dấu "="); ý c: tách $S-\frac13$ (4 dấu "=") | Như trên |
| Bài 18 | định dạng | Tách dòng thế (3) vào (2) (3 dấu "=") thành 3 dòng | Như trên |

Phân loại giữ nguyên: `tra_loi_ngan` 1g (5), 2a (45), 2b (−5), 2f (3), 5f (−2); còn lại `tu_luan` (nghiệm phân số / nhiều nghiệm / căn / bài nhiều ý / có đơn vị).

## Còn `Chưa chắc`

Không câu nào trong 47 câu đã soạn. Điều người duyệt nên xem (đã có `Ghi chú`): Bài 3b sửa đề (xem trên) · Bài 7c hiểu "giá trị nguyên nhỏ nhất" là số nguyên nhỏ nhất $A$ nhận được ($A=-2$ tại $x=\frac1{16}$) · Bài 17 "hai lần dài kém năm lần rộng 28 m" = $5y-2x=28$ · Bài 2c, 2h vô nghiệm theo đề in.
**Việc còn treo: soạn 9 ý Bài 30–34 (nâng cao) rồi soát lại.**
