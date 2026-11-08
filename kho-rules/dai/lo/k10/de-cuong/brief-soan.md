# Brief trạm GÕ + GIẢI — ĐỀ CƯƠNG Toán 10 (25/10)

> Dùng cho 4 đề cương giữa/học kì I K10 (Thùy đưa 25/10): `VD-GKI-2026` Việt Đức · `HVT-GKI-2026` Hoàng Văn Thụ · `YH-HKI-2026` Yên Hòa · `TP-GKI-2026` Trần Phú.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K10\<MA>` (có `goc.pdf`, `lop-chu.txt`, `trang\p-N.png` 130 dpi, `img\`, `tam\`, `z\`).
> Cùng dây chuyền đề cương K11 (`kho-rules/dai/lo/k11/de-cuong/brief-soan.md` — cùng 4 trường): **một trạm vừa GÕ câu từ ảnh vừa GIẢI**, ghi thẳng `kho-rules\dai\lo\k10\de-cuong\<MA>.p<P>.soan.md` (tệp chưa tồn tại — bạn tạo).
> Trạm soát (Opus, `brief-soat.md`) giải mù lại + đối chiếu ảnh. Người làm ≠ người kiểm.

Việc: với **khúc đề cương được giao** (điều phối nói rõ: trang ảnh nào, từ câu nào đến câu nào, các PHẦN số mấy và tên), **gõ lại đúng đề** rồi **giải chi tiết** mọi câu. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit.
(Được ghi ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc)

1. **Phạm vi kiến thức K10 (luật của lô này — CEO chưa có `k10.md`, đây là luật tạm):**
   - Whitelist = chương trình **KNTT Toán 10 tập 1**: C1 Mệnh đề và tập hợp · C2 Bất phương trình và hệ bất phương trình bậc nhất hai ẩn · C3 Hệ thức lượng trong tam giác (giá trị lượng giác của góc từ $0^\circ$ đến $180^\circ$, định lí côsin, định lí sin, công thức diện tích, giải tam giác) ·
     C4 Vectơ (khái niệm, tổng – hiệu, tích với một số, tích vô hướng; toạ độ của vectơ nếu đề cương nêu) · C5 Các số đặc trưng của mẫu số liệu không ghép nhóm (số gần đúng – sai số, trung bình, trung vị, tứ phân vị, mốt, khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn, giá trị ngoại lệ),
     **chỉ tới hết chương mà chính đề cương ghi trong "giới hạn chương trình"**, + toàn bộ lớp ≤ 9 (hằng đẳng thức, phân tích nhân tử, công thức nghiệm / $\Delta$ / Viète, hệ phương trình, hàm số bậc nhất – bậc hai lớp 9, tỉ số lượng giác góc nhọn, hệ thức lượng trong tam giác vuông, tam giác đồng dạng, đường tròn…).
   - **CẤM** (kiến thức sau chương đề cương nêu / ngoài chương trình): đạo hàm, giới hạn, mũ – lôgarit, tích phân, xác suất – tổ hợp lớp 10 chương sau, hàm số bậc hai KNTT 10 chương VI nếu đề cương không nêu · công thức chưa học (hạ bậc, tích → tổng…). Đề cương chỉ tới C1–C2 thì KHÔNG dùng định lí sin / côsin, vectơ.
   - Quy ước K10: kí hiệu `\forall`, `\exists`, `\in`, `\notin`, `\subset`, `\cap`, `\cup`, `\setminus`, `\Rightarrow`, `\Leftrightarrow`; khoảng – đoạn `(a;b)`, `[a;b]`, `(a;+\infty)`; mệnh đề phủ định viết đầy đủ lượng từ. BPT bậc nhất hai ẩn: vẽ / xét miền nghiệm bằng điểm thử; **bài tối ưu: giá trị lớn nhất / nhỏ nhất đạt tại một đỉnh của miền nghiệm** — lập hệ, tìm các đỉnh, tính $F$ ở từng đỉnh, đối chiếu điều kiện nguyên nếu đề đòi.
     Hệ thức lượng: viết định lí đúng dạng ($a^2=b^2+c^2-2bc\cos A$; $\dfrac{a}{\sin A}=2R$; $S=\dfrac12 bc\sin A$…); đổi độ ↔ phút; làm tròn theo đúng yêu cầu của đề (đề không nêu ⇒ làm tròn hợp lí theo ngữ cảnh + `**Ghi chú:**`), không tính tiếp từ số đã làm tròn.
     Vectơ: `\overrightarrow{AB}`, `\vec{a}`, `|\overrightarrow{AB}|`, `\vec{a}\cdot\vec{b}`, `\left(\overrightarrow{a},\overrightarrow{b}\right)`; quy tắc ba điểm, hình bình hành, trung điểm, trọng tâm; chứng minh đẳng thức vectơ: mỗi dòng một phép biến đổi. Số đặc trưng: viết rõ cách sắp xếp mẫu số liệu trước khi lấy trung vị / tứ phân vị (theo cách của KNTT: $Q_2$ là trung vị, $Q_1$, $Q_3$ là trung vị của nửa dưới / nửa trên không chứa $Q_2$).
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **khuôn TỆP** (đặt dòng `### …`, `**Đề:**`, `**Phần 1. Hướng dẫn**`, `**Mấu chốt:**`, `**Bước k.**`, `**Phần 2. Trình bày**`). Chỉ lấy khuôn tệp; kiến thức theo K10.
3. Mẫu tệp khúc đã chạy (có cả TN, Đ/S, TLN): `Repo\kho-rules\dai\lo\k11\de-cuong\HVT-GKI-2026.p1.soan.md` (đọc 2–3 câu mỗi loại để thấy nhịp), và `Repo\kho-rules\dai\lo\k9\de-cuong\AK-GKI-2026.p1.soan.md` (câu hình).

## 2. Nguồn — ĐỌC TỪ ẢNH

- `<LV>\trang\p-1.png …` (130 dpi; `YH-HKI-2026` đặt tên `p-01.png …`) là NGUỒN CHÍNH. Mở bằng công cụ Read. `<LV>\lop-chu.txt` (lớp chữ PDF) chỉ để **đối chiếu nhanh** — công thức trong đó MẤT KÍ HIỆU (∀, ∈, ⊂, ≤, √, dấu vectơ…) ⇒ **không dùng nó để gõ đề**, chỉ đọc ảnh.
  Chỗ không chắc (mũ, dấu, chỉ số, kí hiệu tập hợp / vectơ, phân số, dấu ngoặc `(` `[`) ⇒ phóng to: `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ ở 260 dpi = 2 × toạ độ trên `p-N.png`) rồi Read. Đừng đoán — nhất là `(a;b]` / `[a;b)`, `\le` / `<`.
- Đề cương KHÔNG có đáp án (trừ khi ảnh in sẵn đáp án — khi đó vẫn tự giải và đối chiếu; lệch ⇒ ghi `**Ghi chú:**`).
- **Chỉ gõ câu của khúc được giao.** Đúng thứ tự in. Bỏ qua trang bìa / bảng ma trận / phần lý thuyết tóm tắt (chỉ lấy ĐỀ BÀI cần làm). Khúc có thể bắt đầu / kết thúc GIỮA một trang — điều phối ghi rõ câu đầu và câu cuối.
- **Nhãn câu** = nhãn in trên đề ("Câu 7", "Bài 2a", "Câu 3b"…). Nhãn phải **duy nhất trong cùng một PHẦN**; đề in trùng / sai số ⇒ đánh lại theo thứ tự trong PHẦN và ghi `**Ghi chú:**`. Cùng một đề cương có nhiều đề / nhiều phần ⇒ mỗi phần là một PHẦN riêng (điều phối đã đánh số PHẦN cho bạn — dùng ĐÚNG số và tên đó).
  Bài tự luận nhiều ý có **dữ kiện chung** (cùng hình, cùng giả thiết, ý sau dùng ý trước) ⇒ GIỮ MỘT câu (a, b, c trong cùng `**Đề:**`). Chỉ tách thành các câu riêng khi mỗi ý có dữ kiện / đề riêng hoàn toàn độc lập (vd "Bài 1. Cho $A=…$, $B=…$. Tìm a) $A\cap B$ b) $A\cup B$ c) $A\setminus B$" thì ĐÃ chung dữ kiện ⇒ GIỮ MỘT câu;
  "Bài 1. Giải các bất phương trình: a) … b) …" độc lập ⇒ nhãn `Bài 1a`, `Bài 1b`).

## 3. Khuôn TỆP bạn tạo

```
# ĐỀ | <tên đề cương>
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN <n> | <tên phần> | trac_nghiem|dung_sai|tra_loi_ngan|tu_luan
### <nhãn> | kho=dai|hgt | loai=trac_nghiem|dung_sai|tra_loi_ngan|tu_luan | dap_an=<…>
**Đề:** …
[**Hình:** <tệp trong img/>]  [**Hình giải:** <tệp trong img/>]  [**Ghi chú:** …]  [**Chưa chắc:** …]

**Phần 1. Hướng dẫn**
**Mấu chốt:** …
**Bước 1.** … (3–6 bước)
[**Chú ý:** …]

**Phần 2. Trình bày**
…
```

- `## PHẦN n | …`: dùng ĐÚNG số n, tên, dạng thức điều phối giao (cùng số PHẦN ở nhiều tệp phải khớp tên). Câu thuộc PHẦN có `dang_thuc` nào thì `loai=` giống vậy (PHẦN TN ⇒ câu TN…). **Chỉ khai các PHẦN mà khúc của bạn thật sự có câu** (khúc nằm trong một PHẦN thì chỉ một dòng `## PHẦN`).
- **Trắc nghiệm** (`loai=trac_nghiem`, `dap_an=A|B|C|D`): dòng `**Đề:**` là đề, rồi 4 dòng `A. ` `B. ` `C. ` `D. ` (mỗi phương án một dòng, KHÔNG gộp hai phương án một dòng). Dòng cuối Phần 2 đúng chữ `Chọn X.`
  Phương án là hình / bảng ⇒ vẫn đủ 4 dòng A–D (mô tả bằng chữ, hình đề khai bằng `**Hình:**`).
- **Đúng/Sai** (`loai=dung_sai`, `dap_an=DSSD` — 4 chữ D/S theo thứ tự a b c d): `**Đề:**` là dữ kiện chung; rồi đúng 4 dòng `a) …` `b) …` `c) …` `d) …` (mỗi ý một dòng, được dài; KHÔNG bắt đầu dòng khác bằng `a)` trừ khi là ý). Phần 2 xét từng ý: "Ý a) … Đúng/Sai vì …".
  Đề chỉ có 2–3 ý ⇒ ghi `**Chưa chắc:**` nói rõ (cổng cần đủ 4).
- **Trả lời ngắn** (`loai=tra_loi_ngan`, `dap_an=<số>`): CHỈ khi đáp số là MỘT số nguyên / thập phân tô được trên 4 ô (chữ số, dấu `-` đầu, dấu `,`; ≤ 4 kí tự: `13`, `-1`, `2,5`). Không thì `loai=tu_luan`, `dap_an=—`. Đáp án TLN chỉ ghi số.
- **Tự luận**: `loai=tu_luan`, `dap_an=—`. Dòng `### …` luôn đủ 4 mục `| kho=… | loai=… | dap_an=…`.
- **`kho`:** `kho=hgt` cho câu **Vectơ** (khái niệm vectơ, tổng – hiệu – tích với số, tích vô hướng, toạ độ vectơ, chứng minh đẳng thức vectơ, tìm điểm / quỹ tích vectơ, ứng dụng lực – vận tốc). `kho=dai` cho MỌI câu còn lại: mệnh đề – tập hợp, BPT – hệ BPT bậc nhất hai ẩn (kể cả bài tối ưu thực tế), **hệ thức lượng trong tam giác** (giá trị lượng giác góc $0^\circ$–$180^\circ$, sin, côsin, diện tích, giải tam giác, bài thực tế đo đạc), số đặc trưng mẫu số liệu.
  Câu nhập nhằng ⇒ chọn theo bản chất, nói ở `**Ghi chú:**`. (Kho `hinh_hoc` KHÔNG dùng ở khối 10.)

## 4. Hình

- **Hình đề** (đề in sẵn hình — biểu đồ Ven, miền nghiệm, tam giác, bảng, biểu đồ, hình thực tế đo đạc): cắt từ trang PDF bằng `pdftoppm -r 200 -png -singlefile -f <trang> -l <trang> -x … -y … -W … -H … "<LV>/goc.pdf" "<LV>/img/de_<PHẦN><NHÃN>"` (vd `de_P1C6.png`; chỉ chữ + số, không dấu cách / dấu Việt), chừa biên trắng nhỏ, **Read kiểm** hình đúng và đủ nhãn điểm / số liệu. Khai `**Hình:** de_P1C6.png`.
  Chỉ khai MỘT hình / câu (ERP chỉ giữ hình đầu — đề có 2 hình ⇒ cắt chung vào MỘT ảnh). Hình là một biểu đồ / đồ thị / bảng số liệu / miền nghiệm có ý nghĩa với đề ⇒ phải cắt; không chắc thì cắt. Phương án A–D là các hình ⇒ cắt cả 4 hình chung một ảnh và ghi chữ mô tả vào từng phương án.
- **Hình giải** (câu **tự luận** — hoặc Đ/S, TLN có hình — mà lời giải cần hình: bài hệ thức lượng thực tế, bài vectơ chứng minh, bài miền nghiệm): vẽ BẰNG CODE, khai `**Hình giải:** giai_<PHẦN><NHÃN>.png` (vd `giai_P4C3.png`). **Không bắt buộc** cho câu TN / Đ/S khái niệm ngắn.
  Cách vẽ: viết `<LV>\tam\ve_p<P>.mjs` (tạo bằng công cụ Write, KHÔNG heredoc), import
  `import { P, seg, segDash, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`, chạy `node "<LV>/tam/ve_p<P>.mjs"` với thư mục hiện hành là Repo;
  mỗi hình `await luu('<LV>/img', 'giai_P4C3', w, h, svgDoc(w, h, T(dx, dy, body)))`. Mẫu dùng thư viện: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`. Hình **dựng đúng dữ kiện bằng toạ độ** (độ dài cạnh, góc, trung điểm, trọng tâm… tính bằng phép tính), đủ mọi điểm có tên trong lời giải, ghi số đo ĐỀ CHO, **không ghi kết quả phải tìm**.
  Miền nghiệm của hệ BPT (nếu bài đòi VẼ): vẽ các đường biên + tô miền (kí hiệu đầu mút), toạ độ các đỉnh bằng phép tính, trục `x`,`y` có nhãn. Biểu đồ Ven: vẽ các vòng + số phần tử từng miền.
  Canvas cao ≤ 450 px, nhãn không đè đường, chừa ≥ 35 px dưới nhãn đáy. **Vẽ xong mở ảnh bằng Read để kiểm**; sai thì sửa. Một ảnh / câu.
- Đề tự luận hình KHÔNG có hình đề (HS tự vẽ) ⇒ không đặt `**Hình:**`, chỉ `**Hình giải:**`.

## 5. Việc phải làm cho mỗi câu

1. **Gõ đề đúng ảnh** (LaTeX `$…$`): chữ, số, dấu, chỉ số, số mũ, đơn vị, kí hiệu tập hợp / lượng từ / vectơ. Công thức một cặp `$…$` (không `$$`, không `\(`). Đề dùng độ `60^0` ⇒ `$60^\circ$`.
2. **Giải bằng lập luận + THỬ LẠI BẰNG MÁY** — viết script node trong `<LV>\tam\` (tạo bằng Write, KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): trắc nghiệm ⇒ thay từng phương án / quét lưới; tập hợp ⇒ dựng bằng mảng số rồi tính giao / hợp / hiệu; mệnh đề chứa biến ⇒ quét ≥ 2000 giá trị;
   BPT hai ẩn ⇒ quét lưới điểm kiểm tra nghiệm; **bài tối ưu ⇒ liệt kê đỉnh miền nghiệm + quét lưới nguyên toàn miền, so với đáp số**; hệ thức lượng ⇒ `Math.cos(x*Math.PI/180)`, dựng toạ độ số cho tam giác; vectơ ⇒ gán toạ độ số, kiểm đẳng thức nhiều bộ điểm; số đặc trưng ⇒ tính bằng script (sắp xếp, tứ phân vị theo cách KNTT).
   Đừng nhẩm; **đừng tin đáp án in sẵn** — đối chiếu.
3. Điền `loai=` và `dap_an=` ở dòng `###`; viết lời giải 2 phần theo khuôn §6 ngay sau các dòng `**Đề:**` / phương án / `**Hình:**` / `**Hình giải:**` / `**Ghi chú:**` / `**Chưa chắc:**`.
4. **Đề SAI / thiếu dữ kiện nhưng giải được (Thùy 24/10):** GIẢI BÌNH THƯỜNG theo số liệu đề cho (hoặc theo cách hiểu hợp lí nhất), ghi rõ **"đề sai"** ở dòng `**Ghi chú:**` và một dòng "Lưu ý: …" ở đầu Phần 2. Chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ (vd phương án in sai đơn vị) + Ghi chú.
   Đề nhập nhằng cho hai đáp số khác nhau mà không chọn được ⇒ mới dùng `**Chưa chắc:**` (nêu cả hai). `**Chưa chắc:**` còn dùng khi ảnh mờ không đọc chắc. Không ghi tràn lan; không tự sửa dữ kiện để ra số đẹp.
   Đề thiếu cách làm tròn ⇒ làm tròn hợp lí theo ngữ cảnh (đo đạc: 1 chữ số thập phân; độ: đến phút / đến độ) + `**Ghi chú:**`, không treo cờ.
   Đề tự có đáp số in sẵn và tự giải ra khác ⇒ GIỮ lời giải của mình, ghi `**Ghi chú:** đề cương in đáp số … lệch kết quả tính (…)` rồi nói lý do.
5. Câu **trùng nguyên văn** nhau trong đề cương: vẫn giữ nguyên số câu, giải bình thường (máy gom khi ghi).
6. Cuối tệp thêm `## GHI CHÚ CHO NGƯỜI DUYỆT` (câu cần CEO xem + nhận xét chung). Không có gì thì ghi "Không".

## 6. Khuôn lời giải (máy kiểm — sai là bị từ chối)

- Mỗi câu: `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn `**Chú ý:** …` → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; trong một bước không có dòng trống.
- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, **không ghi đáp số cuối** (kể cả ở Chú ý), không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài nhiều ý: các bước ghi rõ "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước ⇒ gộp ý ngắn lại.
- Phần 2 = đúng cái học sinh viết vào bài kiểm tra. Mỗi dòng biến đổi / mỗi câu một đoạn riêng (cách nhau một dòng trống). Kết bằng một câu "Vậy …" (trắc nghiệm: "Chọn X." là dòng cuối cùng).
  Dấu $\Leftrightarrow$ dùng cho biến đổi tương đương / mệnh đề tương đương — **mỗi dòng một bước**, không nối quá 2 phép.
- **Định dạng:** mỗi công thức một cặp `$…$` · dấu nhân tường minh là **`\cdot`** — **CẤM `\times` và CẤM dấu chấm làm dấu nhân** (cả `2.3`, `a.b`; số thập phân dùng `2{,}5`) · phân số `\dfrac` · hệ `$\begin{cases} … \\ … \end{cases}$` (cả hệ MỘT dòng) · độ `^\circ` · `\widehat{ABC}`, `\triangle ABC`, `\perp`, `\parallel`, `\approx`, `\ge`, `\le` ·
  chữ tiếng Việt trong công thức bọc `\text{…}` · số lớn ngoài công thức viết "12 600 000 đồng" · chỉ dùng `**đậm**` cho các nhãn quy định (không `*nghiêng*`, không bảng Markdown, không emoji).
  Số thập phân trong công thức: `2{,}5`. Tập nghiệm bất phương trình / tập hợp: dùng `\{…\}`, `(a;b)`.

## 7. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng" (cổng đòi mọi `## PHẦN` có câu; tệp của bạn chỉ khai PHẦN bạn có):

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k10/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem
```

(Cổng cần `<LV>\de.boc.json` — điều phối đã tạo sẵn.)

## 8. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại (TN / Đ/S / TLN / tự luận) · các câu có `Chưa chắc` hoặc "đề sai" (nhãn + một câu lí do) · hình đề cắt / hình giải vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 9. Bẫy đã cắn thật (rút từ đề cương K8/K9/K11)

- Bẫy đọc ảnh: số mũ nhỏ, dấu trừ, dấu ngoặc, phân số, chỉ số dưới, kí hiệu `\in \notin \subset \cap \cup \setminus`, `(a;b]` ≠ `[a;b)` — không chắc ⇒ phóng to. Lớp chữ PDF làm mất kí hiệu ⇒ đừng gõ theo nó.
- Phần 1 lộ đáp số ở dòng Chú ý ("phương trình vô nghiệm", "loại $x=2$") — trạm soát bắt lại nhiều lần.
- Dồn 3–4 phép biến đổi vào một dòng nối "suy ra" — mỗi phép một dòng.
- Mệnh đề: phủ định có lượng từ phải đổi $\forall\leftrightarrow\exists$ và đảo bất đẳng thức; mệnh đề đảo ≠ phủ định ≠ phản đảo; "điều kiện cần / đủ" dễ nhầm chiều; mệnh đề chứa biến chưa phải mệnh đề cho đến khi gán giá trị / lượng từ.
- Tập hợp: đếm số tập con $2^n$, tập con có $k$ phần tử $\binom{n}{k}$ (viết `C_n^k`), biểu đồ Ven 3 tập (bao hàm – loại trừ), $[a;b)$ trên $\mathbb{R}$ vs $\mathbb{Z}$.
- BPT hai ẩn: miền nghiệm có / không chứa biên; điểm thử $(0;0)$ chỉ khi không nằm trên đường biên; bài tối ưu quên điều kiện $x,y\ge0$ hoặc điều kiện nguyên; kết luận cặp $(x;y)$ thuộc miền phải kiểm đủ MỌI bất phương trình.
- Hệ thức lượng: góc tù ⇒ $\cos<0$; định lí côsin tìm góc cần kiểm $\cos\in[-1;1]$; bài đo đạc (hai điểm quan sát) đặt đúng tam giác, nêu tam giác nào dùng định lí nào; làm tròn ở kết quả cuối, không tính tiếp từ số đã làm tròn.
- Vectơ: nhầm $\overrightarrow{AB}$ với $\overrightarrow{BA}$; $\vec a\cdot\vec b=|\vec a||\vec b|\cos(\vec a,\vec b)$ với góc giữa hai vectơ chung gốc; bài tìm điểm theo đẳng thức vectơ phải kiểm bằng toạ độ số.
- Trắc nghiệm "mệnh đề đúng / sai": xét ĐỦ 4 phương án rồi mới kết luận, không dừng ở phương án đầu thấy đúng.
