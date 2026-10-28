# Biên bản ĐỐI CHIẾU ĐỀ — DTK8-GKI-2026 (24/10)

Trạm Opus đối chiếu `DTK8-GKI-2026.build.mjs` với ảnh `anh\t-1.png … t-5.png` (sách scan tr. 30–34, môn Toán; phần KHTN dưới Bài 29 bỏ đúng). Chỗ mờ phóng 400 dpi từ `goc.pdf` (`z\dc-*.png`).

- **Số câu:** trước 49 → sau **47** (gộp Bài 1a/1b/1c thành Bài 1). **Số trạm:** 7 (không đổi) — p1: 1, 2a–2g (7) · p2: 3a–4f (10) · p3: 5a–9 (10) · p4: 10–16 (7) · p5: 17–21 (5) · p6: 22–25 (4) · p7: 26–29 (4).
- Danh sách bài theo ảnh (ghi trước khi mở build): Bài 1 (a có 4 mục, b, c) · Bài 2 a,b,c,d,e,g (không có f) · Bài 3 a–d · Bài 4 a–f · Bài 5 a–f · Bài 6–9 thực tế · Bài 10–14 hình có hình sẵn · Bài 15–21 hình chứng minh · Bài 22–29 nâng cao. Khớp build.
- Chép số / ký hiệu / số mũ / dấu trừ / ngoặc: soát từng câu — **0 lỗi chép**. Dấu chấm nhân (Bài 1a mục 1, 2, 4) đã `\cdot`, có ghi chú. Nhãn 2a…2g (bỏ f) đúng như in, có ghi chú.
- Hình `img\de_bai8.png`, `de_bai10…14.png`: đủ khung, đúng bài, không dính chữ bài khác; các dòng `Đọc hình:` đúng.

| Câu | Lỗi | Sửa gì |
|---|---|---|
| Bài 1a/1b/1c | tách ý — 1b, 1c chỉ nói "đơn thức A", "đơn thức C" (định nghĩa nằm ở 1a) ⇒ ý sau dùng dữ kiện ý trước, không được tách (brief §3.3; tiền lệ TX-GKI-2026) | Gộp thành một câu `Bài 1` gồm a) 4 mục, b), c); ghi chú "Giữ cả bài". |
| Bài 1c | ghi chú — "y ≐ 2": chấm phía trên dấu "=" là bụi (trang có nhiều chấm bụi), không có dấu trừ trước 2 | Đọc $y=2$; hạ `CHƯA CHẮC` thành ghi chú thường. |
| Bài 3c | ghi chú — đề in đúng $(5-2x)+2(x-1)=13$ nhưng rút gọn $3=13$ ⇒ vô nghiệm (nghi in lỗi) | Thêm ghi chú: giải bình thường, kết luận vô nghiệm. |
| Bài 8 | hình — người gõ nghi mũi tên $y+1$ | Phóng 400 dpi: đoạn chia song song cạnh $2x$; mũi tên $y+1$ chạy dọc cạnh dài bên phải từ góc dưới phải tới đúng đoạn chia ⇒ khu hoa $2x$ và $y+1$, khu cỏ $2x$ và $(2y+12)-(y+1)=y+11$. Hạ `CHƯA CHẮC` thành ghi chú xác nhận. Hình cắt đủ, không cần cắt lại. |
| Bài 24 | ghi chú — $\overline{abc}-\overline{cba}=99(a-c)$ chính phương ⇔ $a=c$ (hiệu 0) | Thêm ghi chú cho trạm soạn (đề in đúng). |
| Bài 15 | — đề không nói M, N thuộc cạnh nào | Giữ ghi chú thường của người gõ ($M\in AB$, $N\in AC$ suy từ $DM\parallel AC$, $DN\parallel AB$). |
| Bài 21c | — đề in "AND = 90⁰" không mũ góc | Giữ $\widehat{AND}=90^\circ$ + ghi chú (đúng). |
| Bài 14 | — đề in "HEF = 50°", "góc FGH" không mũ góc | Giữ $\widehat{HEF}=50^\circ$ + ghi chú (đúng). |
| Bài 10–14 | hình — kiểm từng ảnh | Đúng: 10 hình vuông 2 đường chéo; 11 hình thang $DC$ đáy sau dài, $AB$ đáy trước ngắn; 12 HCN $MNPQ$ 5 luống; 13 $EFGH$ hai chéo cắt tại $M$; 14 $EFGH$ không đường chéo. Không số đo trên hình. Không sửa. |
| Bài 19 | — đề in "lấy diểm K" (lỗi chính tả) | Người gõ ghi "điểm" — chấp nhận (lỗi chính tả hiển nhiên). |

Kiểm nhanh tính giải được: Bài 3, 4, 5 (trừ 3c) đều có nghiệm; Bài 22 ($c>0$), 23 (tích ba hệ số $=\tfrac1{10}>0$), 25 (321), 27 ($P(5)-P(0)=30$), 28, 29 giải được.

## CHƯA CHẮC cuối cùng

Không còn.

## Nghi mà không quyết

- Bài 3c có thể in lỗi (ý định gốc có lẽ có nghiệm) — để trạm soạn giải đúng như in (vô nghiệm).
- Bài 24 đáp số "các số có $a=c$" nghe tầm thường — có thể bản gốc khác, nhưng đề in rõ; giữ.

## Tệp

Chạy lại in ✔ (47 câu, 6 hình đề). Số trạm vẫn 7 ⇒ không có tệp `.p<N>.soan.md` thừa. Không ghi DB, không commit.
