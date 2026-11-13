KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2526-thanh-cong · lượt Đại số (trạm soát Opus, 13/11/2026)

- **Số câu:** 76 (2 phần: tự luận 71 · trả lời ngắn 5 — Bài 9, 10, 11, 12, 13). Pha 0: Phần I Đại số Bài 1–28 = 71 đơn vị (Bài 1: 10 ý · 2: 10 · 3: 8 · 4: 6 · 14: 8 · 15: 7 tách ý; Bài 27 tách 6 mục lớn) — **đủ, không sót**.
- **Khớp Pha 1 ngay từ đầu:** 76/76 đáp số khớp giải mù (`.dai.kiem.md`, thử máy `<LV>/tam/soat_dai_mu.mjs`).
- **Số câu phải sửa:** 3 (không đổi đáp số nào).
- **Bài sót:** không. **Bài nhập nhầm Hình / trùng lượt Hình:** không (lượt Hình chỉ có Phần II Bài 1–30; Bài 4 Phần II lượng giác thuần số đã ở lượt Hình).
- **Định dạng:** không TAB/FF/ký tự điều khiển; không `\notin`/`\neq` vỡ dòng; không `\times`, `\Leftrightarrow`, Δ, Viète, Cô-si thẳng, "tập nghiệm", kí hiệu khoảng (kiểm bằng `<LV>/tam/soat_dai_dinhdang.mjs`). Cổng `--khoi 9 --chi-kiem`: **✔ đạt cổng** (chỉ một cảnh báo KaTeX "No character metrics for 'ể'" từ `\text{Điểm}` trong bảng Bài 10 — vô hại, chữ vẫn hiện).
- Bản gốc trước khi sửa: `CK-2526-thanh-cong.dai.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 21 | chép đề | Trả điều kiện trong đề về đúng chữ in "$x\ne\pm4$" (trạm soạn đã đổi thành "$x\ne4$"); viết lại Ghi chú | Ảnh phóng to (`z/soat_dai_b21.png`) in đúng "$x\ne\pm4$"; không phải lỗi in hiển nhiên (vô hại vì $x>0$) ⇒ giữ chữ in |
| Bài 27.2 | định dạng | Ý d "(tìm số tự nhiên $x$) $A<0$" ⇒ "$A<0$, với $x$ là số tự nhiên" | Câu dẫn lủng củng |
| Bài 2d | lập luận (Phần 1) | Chú ý "…phương trình khi đó vô nghiệm" ⇒ "giá trị nào làm mẫu bằng 0 thì bị loại" | Phần 1 không được lộ kết luận cuối |

## Nhận xét (không sửa)

- Phân loại: các câu tách ý có đáp số là một số nguyên (14c = 4, 14g = 1, 14h = 2, 15a, 15f, Bài 1–4 một nghiệm…) để `tu_luan`, `dap_an=—` — hợp brief (`tra_loi_ngan` "chỉ khi", không bắt buộc); cùng vấn đề phân loại chung đang chờ Thùy chốt (k9.md §10).
- Bài 27 tách 6 câu `27.1`–`27.6` (cùng biểu thức $A$, các mục độc lập; trong mục 2 ý d dùng kết quả ý c nên giữ chung) — hợp luật tách ý.
- Bài 26 Ghi chú cách hiểu ý c (x nguyên, P nguyên, P lớn nhất ⇒ $x=4$, $P=6$) — đúng, cách hiểu duy nhất hợp lí.
- Lỗi in đã ghi chú đúng: Bài 5 "đấu tư" · Bài 13 lặp "Mỗi ngày" · Bài 18 "Rút gọi" · Bài 28 "thoả mãu".
- Bài 14d: phóng to (`z/soat_dai_b14d.png`) xác nhận căn phủ cả $5-2\sqrt5+1$ — trạm soạn chép đúng.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 28h** — "Tìm $m$ để $x$ thoả mãn bất phương trình $-\sqrt{x}\cdot C>\sqrt{x}+m-3$": hiểu "có $x$ thoả mãn" ⇒ $m<1$ (sup của $1-x-\sqrt x$ trên $x>0$ là $1$, không đạt — máy quét xác nhận); hiểu "mọi $x$" ⇒ không có $m$. Hai cách hiểu cho hai đáp số ⇒ giữ cờ.
