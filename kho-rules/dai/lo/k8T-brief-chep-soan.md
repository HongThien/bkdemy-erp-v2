# BRIEF trạm CHÉP + SOẠN — khối 8T (Toán 8 nâng cao), nhánh Đại · Số học · Tổ hợp

> Bản giao việc cho model soạn (Sonnet). Luật gốc: `kho-rules/dai/k8T.md` §1–§3 + `kho-rules/README.md` §3. File này chép đủ những gì cần — không phải mở file khác.
> Viết 10/10/2026, sau khi CEO chốt: 8T học nâng cao là chính · dùng trọn công cụ của sách · lời giải "giải hẳn hoi" nhưng nhịp nhanh, không chi li như lớp thường.

## 0. Việc của bạn

Bạn nhận **một đoạn sách scan** (ảnh trang PNG) của một quyển bồi dưỡng HSG Toán 8. Với **từng bài, từng ý** trong đoạn đó bạn làm 2 việc và ghi vào **một tệp `.cs.md`**:

1. **CHÉP** nguyên văn đề + lời giải của sách (đọc từ ảnh — không sửa, không đoán).
2. **SOẠN** lời giải kho: 2 phần (Hướng dẫn / Trình bày), đi **theo hướng giải của sách**, viết lại cho đủ bước.

Không sửa tệp nào khác trong repo. Không đụng DB. Đọc ảnh bằng công cụ Read (mỗi lượt nhiều ảnh song song được).
Ghi tệp **sau mỗi 4–6 bài** (ngữ cảnh có thể bị nén — cái gì chưa ghi ra tệp là mất).

## 1. Luật chép

- **Mỗi Ý là một câu** khi bài thuộc loại *Phân tích thành nhân tử / Tính / Rút gọn / Tìm $x$ (giải phương trình)* và các ý độc lập nhau (a, b, c… mỗi ý một biểu thức).
  Bài **chứng minh**, bài **lời văn**, bài có ý sau dùng kết quả ý trước ⇒ **giữ cả bài là một câu** (đề ghi đủ a) b) c)).
- Đề của một ý phải **tự đủ nghĩa**: ghép câu lệnh đầu bài với biểu thức của ý. Ví dụ bài 27 ý a ⇒ `Phân tích đa thức thành nhân tử: $15x^2+10xy$.`
- **Chép đúng từng kí hiệu**: số mũ, chỉ số, dấu trừ, hệ số. Chỗ ảnh không đọc chắc ⇒ ghi `- khong_doc_duoc: <mô tả>` và **không đoán**.
- Sách in sai thấy rõ (đề và lời giải của chính sách mâu thuẫn) ⇒ vẫn chép đúng cái sách in, ghi `- ghi_chu_nghi: …`.
- Dòng nguồn in nghiêng dưới đề (vd *"Đề thi HSG Quận 1, TP.HCM, 2003–2004"*) ⇒ ghi vào `nguon_de`, và đặt trong ngoặc ở **đầu** đề: `(Đề thi HSG Quận 1, TP.HCM, 2003 – 2004) Phân tích…`.
- Bỏ mọi viện dẫn số bài của sách ("xem bài 38c", "tương tự bài 12") — câu trong kho phải đứng một mình.

## 2. Định dạng công thức (áp cho cả đề lẫn lời giải)

- Mỗi công thức một cặp `$…$`. Phân số `\dfrac{a}{b}`. Không dùng `\left` `\right` trừ khi ngoặc bao phân số.
- **Dấu nhân:** sách in dấu chấm ($7^{19}.57$, $AB.AC$) ⇒ đổi: giữa **hai số** dùng `\cdot` ($7^{19}\cdot 57$); số–chữ, chữ–chữ, ngoặc–ngoặc **viết liền** ($5x(3x+2y)$, $(x+1)(x-3)$). Không dùng `\times`, không dùng dấu chấm làm dấu nhân.
- Chia hết `\vdots` · không chia hết `\not\vdots` · đồng dư `a\equiv b \pmod{m}` · giá trị tuyệt đối `\lvert x\rvert` · suy ra `\Rightarrow` · tương đương `\Leftrightarrow`.
- Tập nghiệm `$S=\{1;-2\}$` (ngăn bằng `;`). Số thập phân dùng dấu phẩy. Luỹ thừa của số âm có ngoặc: `(-2)^4`.
- Trong tệp `.cs.md` viết LaTeX **bình thường, một dấu `\`** (đây là markdown, không phải JSON).

## 3. Luật soạn lời giải

**Chuẩn kiến thức = chính quyển sách.** Sách dùng công cụ gì (hằng đẳng thức mở rộng, Bê-du, Hoóc-ne, đồng dư, Cô-si, Đi-rích-lê…) thì được dùng thẳng, **gọi đúng tên, nêu đủ điều kiện**.
Không dùng thứ sách không có (đạo hàm, toạ độ, lượng giác, công thức nghiệm $\Delta$…). **Đi theo hướng giải của sách**; sách sai / hổng thì giải đúng và ghi `ghi_chu_nghi`.

**Nhịp viết (CEO 10/10):** *"Bài nào tắt quá thì cần giải chi tiết hơn. Đáp án cho học sinh nâng cao không cần trình bày quá chi li như thường, được sử dụng nhiều công cụ hơn và nhịp độ làm bài nhanh hơn. Nhưng vẫn muốn có giải hẳn hoi."*
- Sách chỉ ghi kết quả / "Tương tự a)" / "Dễ thấy" ⇒ **viết đủ lời giải**.
- Nhưng **không** viết kiểu lớp thường: được gộp hai phép biến đổi hiển nhiên vào một dòng, không chép lại quy tắc cơ bản, không tách "bước đặt nhân tử chung trong ngoặc vuông" nếu nhìn là thấy.
  Mốc: một học sinh giỏi đọc từng dòng của Phần 2 **không phải tự nháp thêm** để hiểu vì sao dòng dưới suy ra từ dòng trên.

**Khuôn bắt buộc** (máy đọc — sai khuôn là lô bị từ chối):

```
**Phần 1. Hướng dẫn**

**Mấu chốt:** <một câu: điều phải nhận ra thì mới giải được — dấu hiệu nào trong đề gợi ra cách này>

**Bước 1.** <việc làm + vì sao>

**Bước 2.** <…>

**Bước 3.** <…>

**Chú ý:** <bẫy hay mắc / cách khác đáng biết — có thì ghi, không thì bỏ dòng này>

**Phần 2. Trình bày**

<đúng cái học sinh viết vào bài thi; MỖI DÒNG BIẾN ĐỔI MỘT DÒNG, các dòng cách nhau một dòng trống>
```

- Phần 1: **3 đến 6** bước, mỗi bước một đoạn riêng mở bằng `**Bước k.**`, là **một câu có động từ, ≥ 5 chữ ngoài công thức**, nói *làm gì và vì sao* — không phải công thức trần, không chép lại dòng tính của Phần 2,
  **không lộ kết quả cuối**. Bài rất ngắn vẫn 3 bước, tách đúng thao tác thật (vd: tìm nhân tử chung của hệ số → của phần biến → viết mỗi hạng tử thành tích rồi đặt ra ngoài); không bịa bước "Đọc kĩ đề".
- Phần 2 bài biến đổi: dòng đầu **chép lại biểu thức của đề**, các dòng sau bắt đầu bằng `$=…$`. Bài chứng minh: lập luận từng dòng, kết bằng "Vậy …". Bài tìm $x$: mỗi phép biến đổi một dòng, kết bằng "Vậy $x=…$" hoặc "Vậy $S=\{…\}$".
- Phân tích thành nhân tử: kết quả phải là tích các nhân tử **không phân tích tiếp được**; nhân tử bậc hai còn lại mà không tách được nữa thì thêm một dòng lí do (vd "$x^2+x+1=\left(x+\dfrac12\right)^2+\dfrac34>0$ nên không phân tích tiếp được") **chỉ khi sách có nêu hoặc bài yêu cầu chứng tỏ**; bình thường không cần.
- Không viết "(như ví dụ … của sách)", "theo bài …".

**Mẫu** (bài bậc ba nhẩm nghiệm — để thấy nhịp viết):

```
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba không có nhân tử chung, không là hằng đẳng thức ⇒ nhẩm một nghiệm để biết trước một nhân tử, rồi tách hạng tử cho nhân tử đó xuất hiện.

**Bước 1.** Nhẩm nghiệm trong các ước của hệ số tự do $-6$: thay $x=-1$ được $-1+7-6=0$, vậy đa thức có nhân tử $x+1$.

**Bước 2.** Tách các hạng tử thành từng cặp sao cho cặp nào cũng chứa $x+1$, rồi đặt $x+1$ làm nhân tử chung.

**Bước 3.** Phân tích tiếp tam thức bậc hai còn lại bằng cách tách hạng tử bậc nhất.

**Chú ý:** Chưa được dừng khi còn tam thức bậc hai có nghiệm — phải phân tích đến khi không tách được nữa.

**Phần 2. Trình bày**

$x^3-7x-6=x^3+x^2-x^2-x-6x-6$

$=x^2(x+1)-x(x+1)-6(x+1)$

$=(x+1)(x^2-x-6)$

$=(x+1)(x+2)(x-3)$
```

## 4. Xếp nhóm bài (`nhom`) — bản đồ 8T (CEO duyệt 10/10)

Xếp theo **MỤC TIÊU của đề** trước: đề bảo giải phương trình / tìm $x$ ⇒ nhóm phương trình; bảo chứng minh chia hết ⇒ nhóm chia hết; tìm GTLN / GTNN ⇒ nhóm cực trị — **dù** công cụ là phân tích nhân tử.
Đề thuần "phân tích thành nhân tử" ⇒ xếp theo **phương pháp khó nhất phải dùng**. Không chắc ⇒ `T18T000000` (dạng chờ), **không ép**.

Ranh giới đã chốt qua các lô (lô 1, 10/10 — hai lượt gán lệch nhau ở đây):
- **Phương trình bậc ≥ 3** (kể cả khi chỉ cần nhóm hạng tử đưa về tích) ⇒ `T18T020102` *bậc cao*. `T18T020101` chỉ cho phương trình bậc 1–2 và phương trình chứa ẩn ở mẫu.
  (Sách Trần Thị Vân Anh cũng xếp "đưa về dạng tích" là cách thứ nhất của dạng *Phương trình bậc cao*.)

| Mã | Chuyên đề › Nhóm bài |
|---|---|
| `T18T010101` | Hằng đẳng thức › Ứng dụng hằng đẳng thức: tính, rút gọn, chứng minh đẳng thức |
| `T18T010102` | Hằng đẳng thức › Đưa về tổng các bình phương (tìm $x,y$; chứng minh biểu thức luôn dương) |
| `T18T010201` | Phân tích nhân tử › Các phương pháp cơ bản (đặt nhân tử chung · nhóm hạng tử · dùng hằng đẳng thức · phối hợp ba cách đó) — kể cả tính nhanh / tính giá trị bằng các cách này |
| `T18T010202` | Phân tích nhân tử › Tách hạng tử, thêm bớt hạng tử |
| `T18T010203` | Phân tích nhân tử › Đổi biến (đặt ẩn phụ), hệ số bất định, nhẩm nghiệm |
| `T18T010204` | Phân tích nhân tử › Đa thức nhiều biến: hoán vị vòng, đa thức đặc biệt ($a^3+b^3+c^3-3abc$, $(a+b+c)^3-a^3-b^3-c^3$…) |
| `T18T010401` | Đa thức và phép chia › Tìm dư: định lí Bê-du, sơ đồ Hoóc-ne |
| `T18T010402` | Đa thức và phép chia › Tìm hệ số để chia hết; chứng minh đa thức chia hết cho đa thức |
| `T18T010501` | Phân thức › Rút gọn phân thức và các câu hỏi kèm theo |
| `T18T010502` | Phân thức › Tổng, tích có quy luật |
| `T18T010301` | Biểu thức đặc biệt › Tính giá trị biểu thức có điều kiện |
| `T18T010302` | Biểu thức đặc biệt › Chứng minh đẳng thức có điều kiện |
| `T18T020101` | Phương trình › Đưa về bậc nhất, phương trình tích, chứa ẩn ở mẫu |
| `T18T020102` | Phương trình › Bậc cao |
| `T18T020103` | Phương trình › Có tham số |
| `T18T020104` | Phương trình › Chứa dấu giá trị tuyệt đối |
| `T18T020201` | Lập phương trình › Toán chuyển động |
| `T18T020202` | Lập phương trình › Năng suất – công việc và các loại khác |
| `T18T020301` | Bất phương trình › Bậc nhất, có tham số |
| `T18T020302` | Bất phương trình › Tích, thương, chứa dấu giá trị tuyệt đối |
| `T18T030101` | Bất đẳng thức › Xét hiệu, biến đổi tương đương |
| `T18T030102` | Bất đẳng thức › Dùng bất đẳng thức quen thuộc (Cô-si, Bu-nhi-a-cốp-xki) |
| `T18T030103` | Bất đẳng thức › Làm trội, phản chứng và các kỹ thuật khác |
| `T18T030201` | Cực trị › Của đa thức |
| `T18T030202` | Cực trị › Của phân thức, biểu thức chứa dấu giá trị tuyệt đối |
| `T18T030203` | Cực trị › Có điều kiện ràng buộc |
| `T18T040101` | Chia hết › Chứng minh chia hết |
| `T18T040102` | Chia hết › Số dư, chữ số tận cùng, đồng dư |
| `T18T040103` | Chia hết › Tìm số, tìm điều kiện để chia hết |
| `T18T040201` | Số nguyên tố, số chính phương › Số nguyên tố, hợp số |
| `T18T040202` | Số nguyên tố, số chính phương › Chứng minh một số là (không là) số chính phương |
| `T18T040203` | Số nguyên tố, số chính phương › Tìm số để biểu thức là số chính phương |
| `T18T040301` | Nghiệm nguyên › Đưa về tích, dùng tính chia hết |
| `T18T040302` | Nghiệm nguyên › Dùng bất đẳng thức, xét số dư |
| `T18T040303` | Nghiệm nguyên › Dùng tính chất số chính phương |
| `T18T050101` | Đi-rích-lê, cực hạn › Trong số học và suy luận |
| `T18T050102` | Đi-rích-lê, cực hạn › Trong hình học tổ hợp |

## 5. Khuôn tệp `.cs.md` — mỗi câu một khối, đúng thứ tự các dòng

````
=== <MÃ>
- bai: <số bài trong sách> · y: <a|b|…|-> · trang: <trang PDF> · tang: <co_ban|nang_cao|hsg|on_tap>
- nguon_de: <dòng nguồn in dưới đề, hoặc để trống>
- muc_loi_giai_sach: <du|tat|dap_so|khong>
- nhom: <mã nhóm §4>
- cong_cu: <các công cụ bồi dưỡng đã dùng, cách nhau bằng " · "; chỉ biến đổi thường thì để trống>
- kiem: <xem dưới>
- ket_qua_sach: <kết quả cuối cùng của SÁCH, LaTeX không có $; sách không có thì để trống>
- dap_an: <đáp án của lời giải bạn soạn, có $…$>
- ghi_chu_nghi: <để trống nếu không có>
## DE
<đề, tự đủ nghĩa>
## SACH
<nguyên văn lời giải của sách cho câu này; sách chỉ ghi "Tương tự a)" thì chép đúng thế>
## GIAI
**Phần 1. Hướng dẫn**
…
**Phần 2. Trình bày**
…
````

**`<MÃ>`** = `<khu>.<số bài><ý>@p<trang PDF>` — khu do người giao việc cho (vd `D1` = Đại số chương I). Ví dụ `D1.27a@p12`, bài không tách ý: `D1.30@p12`.

**Dòng `kiem`** = cho MÁY tự kiểm đáp số **từ đề** (viết từ đề, không nhìn lời giải). Chọn đúng một kiểu:
- `bang | <biểu thức của đề>` — đáp án phải **bằng** biểu thức này với mọi giá trị của biến (phân tích nhân tử, rút gọn, thực hiện phép tính). Vd: `bang | 15x^2+10xy`
- `gia_tri | <biểu thức> | x=3009; y=1991` — tính giá trị biểu thức tại các giá trị cho trước; đáp án là một số.
- `nghiem | <vế trái> = <vế phải> | x` — tìm $x$; đáp án là các nghiệm, máy thay vào kiểm. Vd: `nghiem | x^3-4x = 0 | x`
- `khong` — bài chứng minh / bài máy không kiểm bằng ba kiểu trên.

Biểu thức trong `kiem` và `ket_qua_sach`: LaTeX **không có `$`**, chỉ gồm số, chữ một kí tự, `+ - \cdot : ^ ( ) [ ] \dfrac{}{}`. `ket_qua_sach` của bài tìm $x$: các nghiệm cách nhau `;` (vd `0; 2; -2`).

**`dap_an`**: phân tích nhân tử / rút gọn ⇒ đúng tích / biểu thức cuối, vd `$5x(3x+2y)$` · tính giá trị ⇒ một số `$5000000$` · tìm $x$ ⇒ `$S=\{0;2;-2\}$` · chứng minh ⇒ `Chứng minh` (kho không có đáp án ngắn cho bài chứng minh).

## 6. Trả lời cuối cùng (≤ 12 dòng)

Số bài · số câu đã ghi · bài nào không đọc chắc / sách in nghi sai / chưa xếp được nhóm · đường dẫn tệp. Không chép lại nội dung.
