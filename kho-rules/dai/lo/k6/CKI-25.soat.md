KẾT LUẬN: ĐẠT

# CKI-25 — biên bản SOÁT (trạm soát, 10/10)

> Đề: Cụm chuyên môn số 14 — kiểm tra học kì 1 Toán 6, 2025–2026, bộ sách **Cánh Diều**, 90 phút (2 trang, bản in rõ, không có phần tiếng Anh).
> Pha 1 giải mù: `CKI-25.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `CKI-25.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (18 câu: 4 TN · 10 TLN · 4 tự luận · HGT 3 · hình 0 · chưa chắc 0).
> Số mũ, dấu âm đọc lại từ ảnh cắt 300 dpi (`pdftoppm` từ `goc.pdf`); đáp số tính lại bằng `node -e`.

## Số liệu

- Số câu: **18** (Câu 1–7; Bài 1a, 1b, 1c, 1d; Bài 2a, 2b, 2c, 2d; Bài 3; Bài 4; Bài 5). Không sót, không thừa; không bỏ câu nào (đề không có phần "Hệ T").
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **18 / 18** (14 câu có `dap_an` trùng từng chữ / từng số; 4 câu tự luận — Câu 5: S, Đ, Đ, S; Bài 3: 34 phần, mỗi phần 11 vở · 2 thước · 10 nhãn vở; Bài 4: 48 m$^2$ · 300 viên · 12000000 đồng; Bài 5: cùng cách chứng minh $7m+2n=8.(5m+3n)-11.(3m+2n)$).
- Số câu phải sửa: **2 / 18**, đều là chỗ nhỏ — **không đổi đáp số, không đổi lời giải Phần 2, không đổi phân loại** (Bài 1d: một dòng `Chú ý`; Bài 4: một chữ hoa trong đề).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1d | lập luận (Phần 1, dòng `Chú ý`) | "luỹ thừa $5^3$ chỉ nhân với 2, không nhân với 261" ⇒ "trong ngoặc vuông phải làm $5^3.2$ trước rồi mới lấy 261 trừ đi; lấy $261-5^3$ trước rồi mới nhân 2 là sai thứ tự thực hiện phép tính" | Câu cũ nêu một cái bẫy không có thật (không ai nhân $5^3$ với 261); bẫy thật của biểu thức $261-5^3.2$ là trừ trước, nhân sau |
| Bài 4 | chép đề | "(coi mạch nối …)" ⇒ "(Coi mạch nối …)" | Chép nguyên văn ảnh (chữ C hoa) |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Hình**: mở cả 2 ảnh trang — đề **không có hình nào** (chỉ có 4 ô vuông Đ/S ở Câu 5 và 2 ô "Kết quả" ở Câu 6, 7). Câu 4 (trục đối xứng), Câu 7 (hình bình hành), Bài 4 (nền nhà hình chữ nhật) chỉ tả hình bằng lời, đề không vẽ. Thư mục `img` rỗng là đúng, không câu nào bị sót hình.
- **Chép đề**: 18 câu đối chiếu ảnh — đúng số, dấu âm, số mũ, ngoặc, đủ 4 phương án, đủ ý. Bài 1d: $\{[261-(36-31)^3.2]-9\}.50$ (mũ 3 ngoài ngoặc tròn). Bài 2b: $7^5:7^3$. Bài 2d: $5^x-31=-6$. Câu 2 phương án D ảnh in "$2;\ 9;\ 0;\ -\,4;\ -\,15$" (có dấu cách sau dấu trừ) — chép thành $-4;-15$ là đúng.
- **Chuẩn hoá kí hiệu trong đề** (đã ghi ở mục "GHI CHÚ CHO NGƯỜI DUYỆT" của bản soạn): Câu 5b ảnh in $\{x\in Z\,/\,-3<x\le 3\}$ ⇒ chép $\{x\in\mathbb{Z}\mid -3<x\le 3\}$; Câu 6 ảnh in "-9⁰C", "4⁰C" ⇒ chép $-9^\circ C$, $4^\circ C$; lời dẫn Bài 1 "Thực hiện phép tính (Tính hợp lí nếu có thể)." chép chữ thường "tính hợp lí".
- **Kiến thức** (Cánh Diều 6 tập 1: số tự nhiên · số nguyên · hình học trực quan, đều thuộc học kì 1): tìm $x$ bằng thành phần chưa biết ở cả 4 ý Bài 2, không chuyển vế (2c: số bị trừ = hiệu + số trừ, $x=(-13)+4$; 2d: đưa về cùng cơ số 5); Bài 2b chia hai luỹ thừa cùng cơ số; Bài 3 đúng khuôn thực tế ƯCLN (gọi ẩn → ƯC → ƯCLN → phân tích từng số → các phép chia phụ → Vậy); Bài 5 đúng khuôn $ax+by\vdots m$ (nhân rồi trừ, tính chất chia hết của một hiệu) — không dùng "nguyên tố cùng nhau", không dùng đồng dư. Số âm trong phép tính đều để trong ngoặc.
- **Bài 5**: đẳng thức $8.(5m+3n)-11.(3m+2n)=7m+2n$ đã khai triển lại và thử máy với $0\le m,n<200$; mệnh đề đúng. Dòng `Chú ý` (điều kiện số bị trừ không nhỏ hơn số trừ) diễn đạt hơi vòng nhưng đúng — để nguyên.
- **Bài 4**: b) tính theo cm$^2$ ($480000:1600=300$), khớp cách chia theo cạnh ($800:40=20$, $600:40=15$) nên lát vừa khít, không phải cắt gạch; c) "mỗi mét vuông gạch" × 48 m$^2$ — chỉ một cách hiểu.
- **Phân loại**: `kho=hgt` cho Câu 4, Câu 7, Bài 4; còn lại `dai`. Trả lời ngắn: Câu 6 ($-5$), Câu 7 (60), Bài 1a ($-88$), 1b (100), 1c (4500), 1d (100), 2a (7), 2b (15), 2c ($-9$), 2d (2) — đều một số ≤ 4 ô theo đúng đơn vị của đề. Câu 5 (Đúng/Sai 4 mệnh đề) nhập `tu_luan` có `Ghi chú` đúng luật; Bài 3 (bốn đáp số), Bài 4 (ba đáp số, 12000000 quá 4 ô), Bài 5 (chứng minh) ⇒ `tu_luan`. Tách ý: chỉ Bài 1 và Bài 2; Bài 4 giữ chung a) b) c).
- **Ghi chú**: Câu 7 giữ dòng `Ghi chú` (đề bỏ lửng "Diện tích hình bình hành này là", ô kết quả không ghi đơn vị; đáp số 60 theo cm$^2$ — đơn vị tự nhiên vì cả hai số đo đều cho bằng cm). Không có ghi chú kiểu "bản máy gõ nhầm".
- **Phần 1**: mọi câu 3–4 bước, không bước nào ghi đáp số cuối. Bài 2a là bài một phép tính nên Bước 2 và Bước 3 gần nhau (nêu quy tắc · thực hiện) — chấp nhận theo luật "bài ngắn tách đúng thao tác thật thành 3 bước".

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
