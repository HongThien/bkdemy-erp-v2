KẾT LUẬN: ĐẠT

# NT-GKI-2026 · P3 — biên bản trạm SOÁT (Opus) · 21/10

Phạm vi: PHẦN 2 (dạng 1 — phương trình quy về bậc nhất), Bài 2 ý a–f (6 phương trình chứa ẩn ở mẫu, ảnh `trang/p-05.png`).
Pha 1 giải mù: `NT-GKI-2026.p3.kiem.md` (script `<LV>\tam\soat_p3.mjs`: thay nghiệm vào đề + quét lưới đổi dấu trên $[-20;20]$).

- **Số câu:** 6 (3 trả lời ngắn: 2c `4` · 2d `-4` · 2e `0`; 3 tự luận: 2a vô nghiệm · 2b $x=-\dfrac94$ · 2f $x=\dfrac1{13}$).
- **Khớp Pha 1 ngay từ đầu:** 6/6 (đáp số và phân loại).
- **Số câu phải sửa:** 0. Bản gốc vẫn lưu ở `NT-GKI-2026.p3.soan.goc.md` (trùng nội dung với bản soạn).
- **Cổng** `dung-de-tu-soan.mjs … --khoi 9 --chi-kiem`: ✔ đạt cổng (6 câu, 0 chưa chắc).

## Đã soát

- **Đề:** cả 6 phương trình khớp ảnh p-05 (dấu, số mũ, mẫu $4x-6$, $1-x^2$, $9-x^2$, $x^3-1$, $x^2+2x-3$).
- **Lời giải:** đúng toán từng dòng; có điều kiện xác định trước và đối chiếu sau ở cả 6 câu (2a loại $x=-1$, 2e loại $x=1$, 2e chứng minh $x^2+x+1>0$ bằng hoàn thành bình phương);
  không $\Delta$ / công thức nghiệm, không `⇔`, không "tập nghiệm $S$"; bậc hai ở 2e đưa về phương trình tích; dấu nhân `\cdot`; kết luận bằng lời.
- **Phần 1:** mỗi câu 4 bước nghĩ thật, không lộ đáp số (kể cả Chú ý ở 2a, 2e).

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| — | — | Không sửa | Không có lỗi chắc chắn |

## Nhận xét không sửa (để người ghép cân nhắc)

- Câu dẫn của mọi ý tách là "Giải các phương trình sau:" (số nhiều, do `NT-GKI-2026.build.mjs` sinh — chung cho P2, P3, P8) trong khi mỗi câu chỉ còn một phương trình; `k9.md` §1.5 nói đề tách ý viết lại cho số ít
  (tiền lệ NS: "Giải hệ phương trình:"). Không sửa riêng P3 để giữ đồng bộ với khung — nếu đổi thì đổi ở build cho cả ba phần.
- 2f dòng phân tích $x^2+2x-3=x^2-x+3x-3=x(x-1)+3(x-1)=(x-1)(x+3)$ viết chuỗi ba dấu "=" trên một dòng — chấp nhận được (một phép phân tích nhân tử), không phải lỗi.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
