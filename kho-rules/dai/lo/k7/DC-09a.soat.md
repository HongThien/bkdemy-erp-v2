KẾT LUẬN: ĐẠT

# DC-09a — biên bản soát (Opus soát bản Sonnet) · 24/10

Phạm vi: trang 1–3, Phiếu BSNC Toán 7 tuần 7 + 8 (THCS Nam Từ Liêm) — Tiết 19 (Số thập phân vô hạn tuần hoàn) + Tiết 20 (Số vô tỉ, căn bậc hai số học), bài tập trên lớp + về nhà. Tiết 21 (Hình) bỏ đúng luật.

- Bản soạn gốc: **36 câu** → sau soát **35 câu** (gộp T19 TL Bài 3a + 3b). Cổng: `✔ đạt cổng` — 7 TN · 5 TLN · 23 tự luận.
- Khớp Pha 1 (`DC-09a.kiem.md`) ngay từ đầu: **36/36** đáp số (giá trị). Mọi khai triển thập phân, chu kì, chữ số thứ 2023 / 105 / 221 kiểm bằng máy (`<LV>\tam\soat-a.mjs`, BigInt).
- Số câu phải sửa: **4** (1 định dạng chu kì · 1 chép đề + Chú ý · 1 tách/gộp ý · 1 kiến thức).
- Không có câu Hình / kì 2 lọt vào tệp. Không có câu Đại bị bỏ sót.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| T19 TL Bài 1c | định dạng (đáp số) | $\dfrac{230}{99900}$: `0,00(230)` → `0,0023023…=0,0(023)` + Bước 3 Phần 1 nói thêm "chu kì bắt đầu sớm nhất" | Giá trị đúng nhưng chu kì chưa viết gọn: chữ số thứ 2 đã bắt đầu lặp (máy: $0,0(023)$), cùng quy ước với $0,0(45)$, $0,41(6)$ ở Bài 1a/1b |
| T19 TL Bài 2b | chép đề | Lệnh đề trả về nguyên văn "Viết các số thập phân sau dưới dạng phân số tối giản" (soạn tự thêm "vô hạn tuần hoàn"); thêm **Chú ý** ở Phần 1 | Đề gốc dùng chung một lệnh cho a và b. Cách "nhân $0,(1)$, $0,(01)$, $0,(001)$" giữ nguyên (xem kết luận 2 bên dưới) |
| T19 TL Bài 3a + 3b → **T19 TL Bài 3** | phân loại (tách ý) | Gộp thành 1 câu `tu_luan`, Phần 2 ghi `a)` `b)`, Phần 1 gộp 4 bước | k7.md §1.5: chỉ tách bài Tính / Tìm $x$; a và b cùng một kiểu "chữ số thập phân thứ $n$", chỉ khác số ⇒ giữ chung (cùng cách xử lí Bài 2 so sánh của Tiết 20 trong chính tệp này và GKI-33 Bài 3) |
| T20 TL Bài 5 | kiến thức | Ý b: bỏ khai triển $(5k\pm1)^2=25k^2\pm10k+1$, $(5k\pm2)^2=\dots$; thay bằng xét chữ số tận cùng của $m$ và $m^2$ (dấu hiệu chia hết cho 5) + Bước 4 Phần 1 tương ứng | Khai triển bình phương một tổng là hằng đẳng thức lớp 8 (lớp 7 HK1 chưa có nhân đa thức) — k7.md §1 luật 5. Bảng chữ số tận cùng 1→1, 2→4, 3→9, 4→6, 6→6, 7→9, 8→4, 9→1 đã kiểm |

Ghi chú cho người duyệt trong tệp đã cập nhật theo các sửa trên.

## Kết luận 3 câu hỏi trạm soạn nêu

1. **Tách / gộp ý Tiết 19** (k7.md §1.5: tách chỉ cho Tính / Tìm $x$; ngoại lệ: "Bài" chỉ là vỏ gom các bài toán KHÁC HẲN nhau, mỗi bài một bộ dữ kiện):
   - TN Bài 1 (điền khuyết a, b): **gộp** — đúng như soạn.
   - TN Bài 2a, 2b: **tách** — hai câu trắc nghiệm, mỗi câu có bộ A–D riêng, không gộp được thành 1 câu TN.
   - TL Bài 1a/1b/1c: **tách** — "Bài 1." chỉ là vỏ, ba ý là ba bài khác kiểu (phân số → STP có nhận biết hữu hạn/vô hạn · thương phép chia số thập phân → STP vô hạn tuần hoàn · dùng $\frac19,\frac1{99},\frac1{999}$), mỗi ý một lệnh và bộ số riêng; ý b thực chất là thực hiện phép chia.
   - TL Bài 2a/2b: **tách** — hai dạng khác nhau (hữu hạn → phân số; vô hạn tuần hoàn → phân số theo ví dụ riêng của ý b).
   - TL Bài 3a/3b: **gộp** (đã sửa) — cùng một kiểu, chỉ khác số.
   - TL Bài 4: **gộp** — ý b (chứng tỏ) cùng dữ kiện "Biết $0,(1)=\frac19$" và nối với ý a.
   - BTVN Bài 1a/1b: **tách** — hai chiều đổi ngược nhau (STP hữu hạn → phân số; thương → STP vô hạn tuần hoàn).
   - Tiết 20 soạn đúng: Bài 1 (tính), Bài 3 (tìm $x$), BTVN 1, 3 tách; Bài 2, BTVN 2 (so sánh), Bài 5 (chứng minh) gộp.
2. **T19 TL Bài 2b — cách nhân $0,(1)$, $0,(01)$, $0,(001)$: CHẤP NHẬN.** Đề yêu cầu làm theo "Ví dụ: $0,(2)=0,(1).2=\frac19.2$", và chính phiếu đã cho $\frac19=0,(1)$; $\frac1{99}=0,(01)$; $\frac1{999}=0,(001)$ (Bài 1c) — không phải công thức tắt ngoài bài. Đã thêm **Chú ý** nói cách chung (đặt $A$, nhân 10/100/1000 rồi trừ — nhóm `NNB00964`) cho cùng kết quả. Các bài đổi vô hạn tuần hoàn → phân số KHÔNG có ví dụ chỉ định vẫn phải theo cách nhân rồi trừ.
3. **T20 TL Bài 5b — phản chứng chứng minh $\sqrt5$ vô tỉ: KHÔNG vượt phạm vi về ý tưởng** (bài có dấu *, đề yêu cầu chứng minh; phản chứng + phân số tối giản + chia hết cho 5 đều là lớp 6), **nhưng cách viết của trạm soạn có vượt**: khai triển $(5k\pm1)^2$, $(5k\pm2)^2$ là hằng đẳng thức lớp 8 ⇒ đã thay bằng lập luận chữ số tận cùng. Ý a (dùng "hiệu, thương hai số hữu tỉ là số hữu tỉ") đúng phạm vi.

## Câu còn `Chưa chắc` / `Ghi chú: đề sai`

Không có. (T20 TN Câu 1 có `**Ghi chú:**` về kí hiệu $I$ = tập số vô tỉ — chỉ chú thích, không phải đề sai.)
