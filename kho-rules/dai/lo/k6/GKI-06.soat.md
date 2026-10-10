KẾT LUẬN: ĐẠT

# GKI-06 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Vạn Phúc, huyện Thanh Trì — giữa học kì 1 Toán 6, 2024–2025 (2 trang, 90 phút, không có phần tiếng Anh).
> Pha 1 giải mù: `GKI-06.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-06.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (19 câu: 8 TN · 7 TLN · 4 tự luận · HGT 4 · hình 2 · chưa chắc 1).

## Số liệu

- Số câu: **19** (Câu 1–8; Bài 1a–1d; Bài 2a–2d; Bài 3; Câu 4 phần tự luận; Bài 5). Không sót, không thừa câu; không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **19 / 19** (15 câu có `dap_an` trùng từng chữ / từng số; 4 câu tự luận — Bài 2c tập $\{6;12\}$, Bài 3 "đủ tiền, thừa 50000 đồng", Câu 4 tự luận 192 m$^2$ và 25200000 đồng, Bài 5 chứng minh — trùng kết quả).
- Số câu phải sửa: **3 / 19** (Câu 4 trắc nghiệm, Bài 1c, Bài 5). Không câu nào đổi đáp số, không câu nào đổi đề.
  Theo loại lỗi: kiến thức 1 (Bài 5) · định dạng 2 (dòng `Chưa chắc` của Câu 4 trắc nghiệm, dòng `Ghi chú` của Bài 1c) · chép đề 0 · đáp số 0 · phân loại 0 · hình 0.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 5 | kiến thức | Phần 2, bước cuối: bỏ câu "mà $\text{ƯCLN}(8,3)=1$ nên tích chia hết cho $8.3$", thay bằng lập luận trực tiếp: tích $=8.a$; $8.a\vdots 3$ và $8.a+a=9.a\vdots 3$ nên $a\vdots 3$; đặt $a=3.b$ thì tích $=24.b$. Phần 1: sửa Mấu chốt và Bước 4 cho khớp | Tính chất "chia hết cho hai số nguyên tố cùng nhau thì chia hết cho tích" **không có** trong lý thuyết bản đồ K6 (đã dump bằng `bdm-ly-thuyet.mjs` và tìm: nhóm nguyên tố cùng nhau NNB00916–918 chỉ dạy chứng minh ƯCLN bằng 1). `k6.md` §1 luật 1–2: chưa có thì không trích như quy tắc, phải tự lập luận bằng cái đã có. Lập luận mới chỉ dùng chú ý của nhóm NNB00905 ("nếu $a\vdots m$, $(a+b)\vdots m$ thì $b\vdots m$"). Máy kiểm chuỗi suy luận với mọi số nguyên tố $5\le p<20000$: đúng |
| Bài 5 | lập luận | Thêm điều kiện $m\in\mathbb{N}^*$ cho $p=3m+1$, $p=3m+2$; dòng "$(p-1).(p+1)\vdots 4.2$" viết lại thành "$4.k.(k+1)\vdots 8$"; viết lại câu Chú ý của Phần 1 (bản cũ: "hai số chia hết cho 2 và chia hết cho 3 chưa đủ để kết luận… nếu không có chia hết cho 8" — tối nghĩa) | Chữ $m$ dùng mà chưa nói là số gì; "$\vdots 4.2$" dễ đọc nhầm; câu Chú ý cũ không rõ chủ ngữ |
| Bài 5 | định dạng (dòng `Chưa chắc`) | Viết lại dòng `**Chưa chắc:**`: bỏ ý (1), giữ ý (2) dưới dạng câu hỏi về cách trình bày | Ý (1) đã kiểm chắc chắn: dạng $p=2k+1$, $p=3m+1$, $p=3m+2$ chính là $a=bq+r$ của mục "Phép chia hết và phép chia có dư" trên bản đồ (nhóm phép tính số tự nhiên). Ý (2): xem mục cuối biên bản |
| Câu 4 (trắc nghiệm) | định dạng (dòng `Chưa chắc`) | Xoá dòng `**Chưa chắc:**`, chuyển nội dung thành `**Ghi chú:**` | Đã kiểm chắc chắn: đề hỏi các số chia hết cho 2 **trong bốn số đã cho**, tập đúng là $\{452;354\}$; phương án B chỉ nêu một trong hai số nên chưa đủ, chỉ C đúng trọn. Pha 1 giải mù cũng ra C. Đây không phải đề in lỗi mà là phương án nhiễu "đúng một nửa" — người duyệt cần biết nên giữ dạng ghi chú |
| Bài 1c | định dạng (dòng `Ghi chú`) | Xoá dòng `**Ghi chú:** Bản máy gõ nhầm thành $7^7:7^7$…` | `Ghi chú` chỉ dành cho lỗi của đề gốc; đây là lỗi công cụ bóc. Đề trên ảnh đúng là $7^9:7^7$, bản soạn đã chép đúng |
| (cuối tệp) | định dạng | Mục "GHI CHÚ CHO NGƯỜI DUYỆT": bỏ dòng về lỗi máy gõ, sửa hai dòng về Câu 4 và Bài 5 cho khớp, thêm ý Câu 1 gõ "N" thành $\mathbb{N}$ | Khớp với các chỗ sửa trên (mục này không thuộc đề, không tính là câu sửa) |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 19 câu đối chiếu ảnh — đúng số, số mũ ($2018^0$, $7^9:7^7$, $(5-1)^2$, $2^4.5$, $3.x^2$), đủ ba tầng ngoặc ở Bài 1d, đủ 4 phương án ở 8 câu trắc nghiệm, đủ ý a) b) ở Câu 4 tự luận. Ba chỗ chuẩn hoá nhỏ không đổi nghĩa: Câu 1 đề in chữ thường "N, N*, Z, {N}" ⇒ gõ kí hiệu tập hợp; Bài 3 "8 000đ" ⇒ "8 000 đồng"; Bài 1 lời dẫn in "hợp lý" ⇒ bản soạn gõ "hợp lí".
- **Lỗi bản máy gõ** (trạm soạn đã sửa theo ảnh, báo ở đây thay cho `Ghi chú`): Bài 1c máy gõ $7^7:7^7$ (ảnh: $7^9:7^7$); Bài 1d máy gõ mất số mũ 2 và dấu ngoặc nhọn.
- **Nhãn "Câu 4" ở phần tự luận**: đề gốc in vậy (các bài khác ghi "Bài"). Bản soạn giữ nhãn gốc, có `Ghi chú`. Cổng không báo trùng với Câu 4 trắc nghiệm vì nhãn tính theo phần (P1 Câu 4 / P2 Câu 4).
- **Kiến thức**: không chuyển vế (Bài 2a, 2b, 2d tìm thành phần chưa biết), không luỹ thừa của luỹ thừa, chỉ dùng dấu hiệu chia hết cho 2 và 9; Bài 2d đúng khuôn NNB00899 ($x^2=3^2$ ⇒ $x=3$); Bài 1d đúng khuôn NNB00900 (mỗi dòng phá một tầng ngoặc); Câu 4 tự luận đổi $160$ dm $=16$ m trước khi tính.
- **Phân loại**: `kho=hgt` cho Câu 6, 7, 8 và Câu 4 tự luận; còn lại `dai`. Bài 2c đáp số là tập 2 số ⇒ `tu_luan`; Bài 3 đáp số có lời + số 5 chữ số ⇒ `tu_luan`. Chỉ Bài 1 (Tính) và Bài 2 (Tìm $x$) được tách ý.
- **Hình**: `p1c7_chung.png` (đủ 4 hình A–D kèm nhãn, không cụt) cho Câu 7; `p1c8_chung.png` (đủ 4 tam giác kèm nhãn HÌNH 1–4, thấy rõ ba dấu trên ba cạnh của Hình 1 và dấu góc vuông của Hình 2) cho Câu 8.
- **Phần 1**: mọi câu 3–4 bước, không lộ đáp số cuối, không chép Phần 2. Bài 2a Bước 3 ("Thực hiện phép cộng để ra giá trị của $x$") hơi mỏng nhưng là thao tác thật — để nguyên.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 5** — không nghi ngờ tính đúng của chứng minh, mà là **chọn cách trình bày bước cuối**: tính chất "chia hết cho 8 và cho 3, mà 8 và 3 nguyên tố cùng nhau ⇒ chia hết cho 24" không có trong lý thuyết bản đồ K6, nên trạm soát đã thay bằng lập luận trực tiếp (dài hơn 3 dòng). Đáp án của các trường thường viết gọn bằng tính chất đó. CEO chọn: giữ cách lập luận trực tiếp, hay cho phép dùng tính chất (khi đó nên bổ sung vào lý thuyết nhóm nguyên tố cùng nhau trên bản đồ).
