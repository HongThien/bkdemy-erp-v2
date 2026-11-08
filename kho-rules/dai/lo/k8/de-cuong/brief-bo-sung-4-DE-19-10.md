# Phụ lục brief — bốn đề cương Hà Nội 2026–2027 gửi 19/10: Thành Công (TC) · Ngô Quyền (NQ) · Ngọc Thụy (NTH) · Giảng Võ 2 (GV2)

> Dùng CÙNG `brief-soan.md` / `brief-soat.md` của đề cương Ngôi Sao Hoàng Mai (đọc chúng TRƯỚC — khuôn lời giải 2 phần, định dạng `\cdot`, luật cấm, cách vẽ hình giải, cách tự kiểm), rồi
> `brief-bo-sung-LTV-DTD.md` §2 (bảng phạm vi). Phụ lục này **THAY** các chỗ riêng của NSHM bằng chỗ riêng của bốn đề cương mới và **THÊM** luật cho câu TRẮC NGHIỆM.
> Khi brief cũ nói `NSHM-GKI-2026` / `<LV>` / ảnh `anh\1.png…` / `crop.mjs` / phạm vi mục 3.4 ⇒ dùng bảng dưới.

## 1. Thay đường dẫn

| | TC | NQ | NTH | GV2 |
|---|---|---|---|---|
| `<MA>` | `TC-GKI-2026` | `NQ-GKI-2026` | `NTH-GKI-2026` | `GV2-GKI-2026` |
| `<LV>` | `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\TC-GKI-2026` | `…\NQ-GKI-2026` | `…\NTH-GKI-2026` | `…\GV2-GKI-2026` |
| Số trạm (`<P>`) | 1–13 | 1–4 | 1–5 | 1–7 |
| Tệp của bạn | `Repo\kho-rules\dai\lo\k8\de-cuong\<MA>.p<P>.soan.md` (đã có khung: tiêu đề + đề từng câu + dòng `**Ghi chú:**` / `**Chưa chắc:**` / `**Hình:**`) |

- **Nguồn đề:** `<LV>\goc.pdf` và ảnh trang 130 dpi `<LV>\anh\t-1.png … t-N.png` (NGUỒN CHÍNH — mở HẾT bằng công cụ Read; trang 1 của NQ là lịch kiểm tra, không có đề). PDF của TC / NTH / GV2 có lớp chữ nhưng
  **công thức trong lớp chữ hỏng** (mất số mũ, dấu trừ, phân số) ⇒ KHÔNG tin `pdftotext`; NQ là bản scan. Phóng to chỗ không chắc:
  `pdftoppm -r 260 -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> -png "<LV>\goc.pdf" "<LV>\z\<tên>"` (toạ độ ở 260 dpi = 2 × toạ độ ảnh `t-N.png`; tạo thư mục `z` nếu chưa có) rồi Read.
  KHÔNG dùng `crop.mjs` / thư mục `anh\1.png` (của NSHM).
- **Hình có sẵn trong đề** đã cắt vào `<LV>\img\de_bai*.png` và khai bằng dòng `**Hình:**` trong khung — giữ; mở xem đúng hình của câu. Dòng `**Ghi chú:** Đọc hình: …` là chỗ người gõ đề tóm tắt dữ kiện trên hình — **đối chiếu với hình, lệch thì hình đúng**.
- Bài hình KHÔNG có hình trong đề ⇒ vẽ **hình giải** (`**Hình giải:** giai_<nhãn-không-dấu>.png`, ví dụ `giai_hinh2.png` cho nhãn "Hình Bài 2"; một tệp / bài, đủ mọi điểm của mọi ý) — đặt tên script `<LV>\tam\ve_p<P>.mjs`. Bài hình tự luận
  KHÔNG tách ý. Câu trắc nghiệm về hình không cần hình giải (trừ khi cần để giải thích).
- **Lệnh cổng:** `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem` (chạy từ Repo).
- **Nhãn câu** giữ nguyên, kể cả tiền tố ("Đại Câu 3", "Hình Bài 2a", "Đề 1 Bài 3a", "Dạng 2 Câu 1" = Ví dụ, "ĐMH Bài 4a"…). Không tách / gộp / đổi nhãn.

## 2. Phạm vi kiến thức (thay mục 3.4 của brief cũ; luật chung k8.md §1)

Nền lớp 6–7 luôn được dùng (kể cả chia đa thức một biến cho đa thức một biến, tam giác bằng nhau / cân, trung tuyến — trọng tâm, tổng ba góc, đường vuông góc – xiên, tia phân giác…). **CẤM ở cả bốn đề cương:**
đường trung bình của tam giác / hình thang · Thalès · đồng dạng · Pythagore (thuận và đảo) · tỉ số lượng giác · phân thức đại số · "phương trình / tập nghiệm $S$" · công thức nghiệm · Vi-ét · "định lí Bézout / số dư" — kể cả dùng NGẦM không gọi tên.
Đặt thừa số chung theo tính chất phân phối thì LUÔN được dùng. "Trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền" (bài hình chữ nhật) được dùng.

| | **TC** | **NQ** | **NTH** | **GV2** |
|---|---|---|---|---|
| **Đại số** | **CHỈ Chương I** (đơn thức, đa thức, cộng trừ nhân chia đa thức). Hằng đẳng thức CHƯA học: $(a+b)^2$ viết $(a+b)(a+b)$ rồi nhân | Chương I **+ hằng đẳng thức hết bài 6** (hiệu hai bình phương, bình phương của một tổng / hiệu). Lập phương CHƯA học | **CHỈ Chương I** (đề ghi: Đa thức) | Chương I **+ hằng đẳng thức hết bài 6** (đề ghi: nhân đa thức, chia đa thức cho đơn thức, hiệu hai bình phương, bình phương của tổng / hiệu). Lập phương CHƯA học |
| **CẤM thêm** | mọi hằng đẳng thức · phân tích nhân tử (trừ đặt thừa số chung) | $A^3\pm B^3$, $(A\pm B)^3$ · các phương pháp phân tích nhân tử (trừ đặt thừa số chung; được viết hằng đẳng thức bậc hai theo cả hai chiều) | mọi hằng đẳng thức · phân tích nhân tử (trừ đặt thừa số chung) | như NQ |
| **Hình học** | Chương III: tứ giác → hình thang (cân) → hình bình hành → hình chữ nhật → **hình thoi** (hình vuông chỉ ở câu trắc nghiệm) | Chương III: đến hình thoi, hình vuông | Chương III đến hình vuông | **CHỈ hình bình hành và hình chữ nhật.** Hình thoi / hình vuông CHƯA học |

## 3. Câu TRẮC NGHIỆM (`loai=trac_nghiem`) — luật thêm (brief cũ NSHM không có trắc nghiệm)

- Mẫu khuôn: `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (`## PHẦN 1 | Trắc nghiệm | trac_nghiem`, `### Câu 1 | kho=… | loai=trac_nghiem | dap_an=B`, đề có 4 dòng `A.` `B.` `C.` `D.`). Điền `dap_an=` là MỘT CHỮ CÁI A–D (khung đang để `?`); Phần 1 = 3–6 bước nghĩ + Phần 2 = lời giải ngắn kết bằng "Chọn B."
  (xem GKI-01 để biết độ dài). Loại dần bốn phương án bằng LÍ DO, không chỉ thử đáp án. Câu "tìm khẳng định SAI" ⇒ nêu vì sao từng phương án đúng, phương án sai sai ở đâu.
- Đáp án phải **tự giải rồi kiểm bằng máy** (đại số: thay số; hình: dựng toạ độ số) — đề cương KHÔNG in đáp án. Nếu KHÔNG phương án nào đúng, hoặc có hai phương án đúng ⇒ đề in lỗi: chọn phương án gần nhất và thêm `**Chưa chắc:**`.
- Đề cương **Đề 2 · Câu 1–6 của TC ("Điền vào chỗ trống")** và **Đề 1 · Bài 1 (6 mục "Điền kết quả đúng")** KHÔNG có 4 phương án: nếu đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`) ⇒ `loai=tra_loi_ngan` + `dap_an=<số>`; còn lại `loai=tu_luan` + `dap_an=—`
  (khung đã để `tu_luan` — bạn tự đổi nếu thoả). Câu "điền chỗ trống" vẫn có Phần 1 + Phần 2 theo khuôn như câu tự luận.

## 4. Lưu ý riêng từng đề cương (đọc phần của bạn)

**TC (Thành Công)**
- Đại Câu 1: biểu thức thứ tư đọc là $\sqrt{2x}$ (căn cả $2x$ ⇒ không phải đơn thức) — đã đối chiếu ảnh phóng to. Đại Câu 3: "$2.4,5$" = $2\cdot 4{,}5$.
- Đại Bài 2c: đề in KHÔNG có ngoặc quanh $5x^2y^2+9x^3y^4$ — giải đúng như in (chia trước, cộng sau) và nêu rõ; dòng `Chưa chắc` đã có.
- Đại Bài 6f: $2x^3-50x=0$ ⇒ đặt $x$ ra ngoài, $x^2=25$ ⇒ $x=\pm 5$ (căn bậc hai lớp 7); KHÔNG dùng hằng đẳng thức hiệu hai bình phương.
- Đại Bài 8, Đề 1 Bài 6: "chia hết" / "chia dư" bằng cách thực hiện phép chia đa thức một biến (lớp 7) hoặc $f(x)=g(x)q(x)+r(x)$ rồi so sánh hệ số — KHÔNG gọi định lí số dư. Phải xét ĐỦ hai chiều.
- Đại Bài 9: $2n^3+n^2+2n+4=(2n+1)(n^2+1)+3$ ⇒ $2n+1\mid 3$; liệt kê ước, kiểm lại từng $n$.
- Hình Câu 8: $5^2+12^2=13^2$ — kết luận vuông tại $M$ cần **Pythagore đảo** (CẤM) ⇒ giải nêu rõ đây là điểm cần Pythagore đảo, chọn đáp án theo kết quả đúng và thêm `**Chưa chắc:** câu 8 cần định lí Pythagore đảo (ngoài phạm vi)`.
- **Hình Bài 1a–1h (tám hình riêng):** mỗi câu một hình đã cắt sẵn; dòng `**Ghi chú:** Đọc hình` là dữ kiện đã đọc. Mỗi câu hỏi "tứ giác … là hình gì, vì sao" — đáp bằng MỘT kết luận + lí do (dấu hiệu nhận biết). Câu 1d (không phải hình bình hành) và 1h đã có `Chưa chắc`.
- Hình Bài 4: nhớ $AB=2CD$ ⇒ chứng minh các hình bình hành bằng cách xét $M$ là trung điểm $AB$ (không dùng đường trung bình). Hình Bài 9b: $DM=MN=NB$ — chứng minh bằng hình bình hành $AECF$ + trung điểm; KHÔNG đường trung bình (nếu dữ kiện đúng là bài đường trung bình, thêm dòng `Chưa chắc` theo câu chuẩn).
- Hình Bài 10: xem `Ghi chú` (đề in $ABCD$, đúng là $ABDC$).
- Khác Bài 1, 2: có hình trong `img`. Khác Bài 4: "đi xuôi dòng từ $A$ đến $B$ rồi quay lại $A$" — chiều về là ngược dòng; giải theo tỉ lệ lít dầu theo km.
- Đề 1 Bài 1 (6 mục), Đề 2 Câu 1–6: xem mục 3. Đề 1 Bài 1c: $n$ là số tự nhiên — nhớ $n=0$ có thoả không.
- Đề 1 Bài 4: hình đã cắt, xem `Ghi chú` về dấu góc. Đề 2 Bài 3: hai hình riêng (3a, 3b), xem `Ghi chú`. Đề 2 Bài 5: tìm $x,y,z$ — đưa về tổng các bình phương **bằng cách nhân và nhóm hạng tử** (không cần hằng đẳng thức đặt tên; nếu phải dùng dạng $(a+b)^2$ thì viết rõ là nhân hai thừa số giống nhau) — đây là bài nâng cao, nếu bị kẹt phạm vi thì ghi `Chưa chắc`.

**NQ (Ngô Quyền)**
- Đề cương in cả TRẮC NGHIỆM (8 câu) lẫn tự luận; Bài 3d $D=(2x+3y)^2-(2x-3y)^2$ dùng hằng đẳng thức bình phương (được dùng) hoặc khai triển.
- Bài 6: hình ghi "(cm)" nhưng đề ghi $150\ \text{m}^2$ và $x$ (m) — xem `Ghi chú`; mảnh trồng rau $(x-15)(x-10)=150$ ⇒ nghiệm $x=25$ (loại $x=0$ vì $x>15$) — kiểm đủ.
- Bài 7 (hình): $AB<AC$, ba góc nhọn; ý d dựng $I$ đối xứng $H$ qua $BC$ ⇒ $BIKC$ hình thang cân (hai cạnh bên $BI=KC$ và hai đáy song song, không phải hình bình hành).

**NTH (Ngọc Thụy)**
- Đề cương IN SẴN lời giải mẫu cho các "Ví dụ" (khuôn SEE–THINK–WONDER). Đáp số các Ví dụ phải GIẢI ĐỘC LẬP; lời giải mẫu có lỗi in (xem `Ghi chú` ở Dạng 1 Câu 1). Các "Ví dụ" cũng là câu của kho (nhãn "Dạng n Câu k").
- Dạng 4 Bài 2: `Ghi chú` về tên điểm ($AH$ trung tuyến, $M$ đối xứng $H$ qua $E$). ĐMH Bài 4a: hình đã cắt, xem `Chưa chắc` (hình vuông góc hay chỉ hình bình hành).
- ĐMH Bài 5: $F(10)\cdot F(-3)$ — thay $b=-7a$, KHÔNG dùng Vi-ét.

**GV2 (Giảng Võ 2)**
- Hằng đẳng thức hết bài 6 ⇒ Bài 1d $(x-2)(x+2)(x^2+4)(x^4+16)$ nhân lần lượt bằng hiệu hai bình phương; Bài 3f $(x^2+4x)^2+8(x^2+4x)-65=0$ ⇒ cộng $81$: $(x^2+4x+4)^2=81$ (hoàn thành bình phương bằng $(A+B)^2$, rồi $A^2=81\Rightarrow A=\pm 9$ — căn bậc hai lớp 7); KHÔNG phân tích $(t+13)(t-5)$.
- Bài 6: hình đã cắt; kết luận là hằng đẳng thức $(a-b)^2=a^2-2ab+b^2$. Bài 7: điều kiện $0<x\le 1$ để thùng tồn tại (có kiểm tra $3-2x\ge 1$).
- Bài 11a, 11b: có biến ở mẫu ($\dfrac{2}{x}$, $\dfrac{9}{x^2}$) — đã có `Chưa chắc`; giải theo cách bình phương hai vế biểu thức $x+\dfrac{k}{x}$ (nhớ $x\neq 0$), không rút gọn phân thức.
- Bài 12: GTNN bằng hoàn thành bình phương ($\ge$ hằng số, dấu "=" khi nào); câu d) hai bình phương đồng thời. Bài 13 ($A=(n^2+5n+5)^2$), 14, 15: nâng cao — mỗi bước phải đúng với MỌI giá trị nguyên / thực được nêu; Bài 15.2 nhớ kiểm tồn tại $x,y,z$ để dấu "=" xảy ra.
- ĐMH Bài 4 (hình): ý 2) $AD=CE=BC$ và ý 3) $B,K,O$ thẳng hàng — chỉ hình bình hành / hình chữ nhật, KHÔNG đường trung bình; nếu bí thì ghi `Chưa chắc`.
- ĐMH Bài 5: $3x^2-4xy+2y^2=3$ ⇒ $x^2+2(x-y)^2=3$ rồi xét nghiệm nguyên dương.
