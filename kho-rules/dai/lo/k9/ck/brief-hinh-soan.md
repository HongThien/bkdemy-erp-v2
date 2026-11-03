# Brief giao trạm SOẠN — ĐỀ CƯƠNG CUỐI KÌ I Toán 9 (kho tham khảo) · LƯỢT HÌNH (03/11/2026)

> Thùy 03/11: *"Làm Cuối kì trước đi. Ưu tiên bài Hình trước. T cần m giải, vẽ hình, đẩy vào kho Hình Luyện của khối 9 phần tiếp tuyến."*
> `<MA>` = mã đề cương (vd `CK-2526-thanh-cong`; danh sách + trang + đường dẫn: `Repo\kho-rules\dai\lo\k9\ck\ds.json`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\CK\<MA>`
> (đã có `goc.pdf`, `trang\p-N.png` 130 dpi — một số đề là ảnh SCAN không có lớp chữ —, `img\`, `tam\`, `z\`, `de.boc.json`, `thongtin.json` chứa tên trường / năm học).
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-hinh-soat.md`) chạy Opus.

---

Bạn là trạm SOẠN cho MỘT đề cương cuối học kì I Toán 9. Việc: **tìm MỌI bài HÌNH HỌC trong đề cương** (không làm phần Đại số), gõ lại đề cho đúng ảnh, **giải chi tiết (2 phần), VẼ HÌNH bằng code**, và phân loại xem bài có thuộc nhóm TIẾP TUYẾN không.
KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài các tệp nêu dưới. (Được ghi ảnh vào `<LV>\img\`, script vào `<LV>\tam\`.)

## 1. Bài nào là "Hình"

Mọi bài / ý có hình vẽ hoặc dựng hình: chứng minh hình (tam giác, tứ giác, đường tròn, tiếp tuyến), tính độ dài / góc / diện tích trên hình, hệ thức lượng và tỉ số lượng giác thực tế (tháp, thang, máy bay, bóng nắng, hồ nước…), hình tròn / quạt tròn / vành khuyên / độ dài cung. **Bài "tính giá trị biểu thức lượng giác" thuần số (không hình) cũng lấy** (đề cương xếp nó ở phần hình học). Bài Đại số thuần (phương trình, hệ, bất phương trình, căn thức, lập hệ, cực trị…) KHÔNG lấy.
Không có bài hình nào ⇒ không tạo tệp, trả lời cuối "không có bài hình".

## 2. Đọc trước (bắt buộc)

1. `Repo\kho-rules\dai\k9.md` §1.5–§3 (khuôn 2 phần, định dạng) và `Repo\kho-rules\hgt\k9.md` (được dùng / cấm, làm tròn mặc định, hình) và mục "LUẬT TRÌNH BÀY HÌNH 7·8·9" trong `Repo\kho-rules\hinh\k9.md`.
2. Hai tệp MẪU đã qua soát (khuôn tệp, nhịp Phần 1, cách viết Phần 2 cho bài Hình có đường tròn / tiếp tuyến): `Repo\kho-rules\dai\lo\k9\de-cuong\GV2-GKI-2026.p6.soan.md` và `…\TC-GKI-2026.p5.soan.md`; script vẽ mẫu: `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\GV2-GKI-2026\tam\ve_p6.mjs`.
3. `Repo\kho-rules\dai\lo\k9\de-cuong\brief-soan.md` — chỉ mục 4 (khuôn lời giải) và mục 5 (cổng); các mục khác của brief đó KHÔNG áp dụng (đề này bạn tự tìm bài, không có tệp khung).

## 3. Nguồn đề

- `<LV>\trang\p-1.png…` — ảnh từng trang, NGUỒN CHÍNH. Mở HẾT bằng công cụ Read. Chữ nhỏ / số mũ / dấu / tên điểm không chắc ⇒ phóng to, đừng đoán:
  `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ 260 dpi = 2 × toạ độ ảnh 130 dpi).
- Có lớp chữ (`pdftotext`) thì chỉ để đỡ gõ — công thức hay mất kí hiệu ⇒ **ảnh đúng**.
- Hình có sẵn trong đề: chỉ là THAM KHẢO để hiểu đề; **không cắt ảnh từ PDF** — vẽ lại bằng code (mục 5).

## 4. Tệp phải nộp

1. `Repo\kho-rules\dai\lo\k9\ck\<MA>.hinh.soan.md` — khuôn:

```
# ĐỀ | Đề cương ôn tập cuối học kì I Toán 9 — <tên trường trong thongtin.json> (Hà Nội) · phần Hình
nam: <năm đầu của năm học, vd 2025>
bo_sach: KNTT
kieu: de_cuong

## PHẦN 1 | <tên phần theo đề cương, vd "Hình học" / "Đề 1" …> | tu_luan

### Bài 3 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** …nguyên văn, ý a) b) c) xuống dòng…
**Hình:** de_P1B3.png
**Hình giải:** giai_P1B3.png
**Ghi chú:** …(chỉ khi đề in lỗi / hình thiếu / đề sai)

**Phần 1. Hướng dẫn**
**Mấu chốt:** …
**Bước 1.** …
**Phần 2. Trình bày**
…
```
   - Mỗi đề cương có nhiều phần / nhiều đề (Đề 1, Đề 2…) ⇒ mỗi phần một `## PHẦN n`; nhãn `### Bài k` đúng như in, **duy nhất trong một phần** (trùng ⇒ đánh lại + Ghi chú).
   - **Không tách ý** bài hình chung dữ kiện (a, b, c giữ trong một câu). Chỉ tách ý ĐỘC LẬP (vd "tính giá trị biểu thức": a) b) thành `Bài 5a`, `Bài 5b`).
   - `loai=tra_loi_ngan` CHỈ khi đáp số là MỘT số ≤ 4 kí tự theo đúng dạng đề hỏi (`dap_an=36`, `2,5`); còn lại `tu_luan`, `dap_an=—`. `kho=hinh_hoc` cho mọi câu.
2. `Repo\kho-rules\dai\lo\k9\ck\<MA>.hinh.phanloai.json` — `{ "P1 Bài 3": { "tt": "hai_tt", "ghi": "…" }, … }` cho MỌI câu. Giá trị `tt`:
   - `hai_tt`: có HAI tiếp tuyến cắt nhau tại một điểm (từ điểm ngoài đường tròn kẻ hai tiếp tuyến $MA$, $MB$; dùng $MA=MB$, $MO\perp AB$, $MO$ phân giác…).
   - `ba_tt`: có BA tiếp tuyến (hai tiếp tuyến tại hai đầu đường kính / hai điểm và tiếp tuyến thứ ba tại điểm trên cung, vd $CD=AC+BD$).
   - `tt_khac`: có tiếp tuyến nhưng không khớp hai mẫu trên (chứng minh một đường thẳng là tiếp tuyến, một tiếp tuyến + cát tuyến, tính độ dài tiếp tuyến…).
   - `khong_tt`: không có tiếp tuyến (hệ thức lượng, tỉ số lượng giác, hình tròn / quạt, đường tròn không tiếp tuyến…).

## 5. VẼ HÌNH (bắt buộc, mọi câu)

- **`**Hình:**` = HÌNH ĐỀ** — vẽ bằng code theo dữ kiện giả thiết của đề; **KHÔNG vẽ sẵn điều phải chứng minh / kết quả phải tìm**; đủ các điểm tên trong giả thiết; ghi số đo đề cho. Kể cả đề gốc đã có hình (vẽ lại, không cắt PDF).
  Bài lượng giác thực tế: hình tam giác vuông mô phỏng tình huống (tháp, thang, bóng nắng…), đủ điểm, số đo đề cho.
- **`**Hình giải:**` = hình đề + điểm / đoạn dựng thêm trong lời giải** (khi lời giải có dựng thêm điểm hay cần đánh dấu khác). Lời giải không dựng thêm gì ⇒ BỎ dòng `**Hình giải:**` (không chép hình đề lần hai).
- Tên tệp: `de_P<phần>B<nhãn>.png`, `giai_P<phần>B<nhãn>.png` (nhãn bỏ khoảng trắng, vd `de_P1B5a.png`), trong `<LV>\img\`.
- Cách vẽ: script `<LV>\tam\ve_hinh.mjs` (một script cho cả đề cương), `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`, chạy `node "<LV>/tam/ve_hinh.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', 'de_P1B3', w, h, svgDoc(w, h, T(dx, dy, body)))`. Mẫu dùng thư viện: `ve_p6.mjs` ở mục 2, `Repo\scripts\anh\ve_hinh_hh101_102.mjs`. Đường tròn: vẽ bằng cung / ellipse SVG theo thư viện (xem mẫu); tiếp tuyến vuông góc bán kính; tiếp điểm là chấm.
- Hình **dựng đúng dữ kiện bằng toạ độ** (đúng tỉ lệ cạnh, góc vuông, tiếp tuyến thật sự tiếp xúc, chân đường cao / giao điểm tính bằng phép tính), đủ điểm, nhãn không đè đường, canvas cao ≤ 450 px, chừa ≥ 35 px dưới nhãn đáy. Quy ước: tam giác vuông tại $A$ ⇒ $AB$ đứng, $AC$ ngang; thang / cột / tháp vuông góc mặt đất ⇒ dựng thẳng đứng.
- **Vẽ xong mở từng ảnh bằng Read để kiểm** (đúng đề, đủ điểm, không lộ kết quả, nhãn đọc được); sai ⇒ sửa script, vẽ lại. Thư viện sinh kèm tệp `.svg` — để nguyên.

## 6. Kiến thức — luật quan trọng nhất (cuối học kì I khối 9)

**Được dùng:** Chương IV (tỉ số lượng giác, hệ thức giữa cạnh và góc trong tam giác vuông, ứng dụng); Chương V đường tròn: định nghĩa, đường kính – dây, tâm đối xứng / trục đối xứng, **vị trí tương đối của đường thẳng và đường tròn, tiếp tuyến (dấu hiệu, tính chất), hai tiếp tuyến cắt nhau ($MA=MB$, $MO$ là tia phân giác của $\widehat{AMB}$ và của $\widehat{AOB}$, $MO\perp AB$), vị trí tương đối của hai đường tròn**; độ dài cung, diện tích hình quạt / hình tròn / vành khuyên khi đề hỏi (công thức $\dfrac{n}{360}$, "góc ở tâm = số đo cung" dùng được riêng cho các bài đó); lớp 6–8 là nền (Pythagore, đồng dạng, Thalès, phân giác, hình bình hành, hình chữ nhật…).
**"Chứng minh bốn điểm cùng thuộc một đường tròn"**: bằng định nghĩa (các điểm cách đều một điểm) hoặc "tam giác vuông ⇒ trung điểm cạnh huyền cách đều ba đỉnh".
**CẤM** (dù lời giải ngắn hơn): góc nội tiếp, tứ giác nội tiếp, góc tạo bởi tiếp tuyến và dây cung, định lí sin / côsin · **đường trung bình của tam giác (Thùy 20/10: chỉ Ngôi Sao Hoàng Mai được dùng — kể cả ngầm; cần "đoạn nối hai trung điểm" ⇒ chứng minh bằng tam giác đồng dạng c.g.c tỉ số $\dfrac{1}{2}$ hoặc hình bình hành)** · hệ thức đường cao $h^2=b'c'$, $b^2=ab'$, $\dfrac{1}{h^2}=\dfrac{1}{b^2}+\dfrac{1}{c^2}$ dùng thẳng (suy ra từ tam giác đồng dạng / tỉ số lượng giác; riêng bài ĐỀ BẮT chứng minh chính các hệ thức đó thì chứng minh từ đồng dạng) · Cô-si dùng thẳng · Δ / Viète · dấu `⇔` · "tập nghiệm $S$".
Bài chỉ làm được bằng công cụ ngoài phạm vi (rất hiếm): giải bằng cách ngắn nhất đúng toán + một dòng `**Ghi chú:**` nói đã dùng gì.

## 7. Quy tắc xử lí đề (Thùy 24/10 + 27/10)

- **Đề SAI nhưng giải được** (giả thiết vô lý / số liệu không thực tế / thiếu "tam giác nhọn" làm kết luận chỉ đúng một số vị trí): GIẢI BÌNH THƯỜNG theo số liệu, ghi rõ "đề sai" ở `**Ghi chú:**` và một dòng "Lưu ý: …" ở đầu Phần 2. Lỗi in hiển nhiên có đáp án rõ (chữ / đơn vị) ⇒ sửa chữ đề + Ghi chú. **Không treo `**Chưa chắc:**`** — chỉ dùng khi THỰC SỰ không giải được hoặc hai cách hiểu cho hai đáp số khác nhau.
- **Làm tròn:** theo ĐỀ khi đề nêu; không nêu ⇒ mặc định (`hgt\k9.md`: độ; độ dài 1 chữ số thập phân). **KHÔNG ghi `Chưa chắc` chỉ vì đề không nêu cách làm tròn.** Tính tiếp bằng giá trị ĐÚNG, chỉ làm tròn ở kết quả cuối từng đại lượng.
- **Trình bày Hình (Thùy 27/10):** dòng ngắn (~50% bề ngang, khẳng định dài tách nhiều dòng) · mỗi bước ghi căn cứ trong ngoặc: dữ kiện đề `(gt)`, định lí / tính chất / dấu hiệu ghi đúng tên, kết quả đã chứng minh ở ý trước `(cmt)` · dữ liệu `\n` đơn, dòng trống chỉ trước ý b/c/d và trước Phần 2.

## 8. Mọi đáp số / khẳng định phải thử bằng máy

Script node trong `<LV>\tam\` (công cụ Write; KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): hình ⇒ dựng toạ độ số (cả tam giác nhọn lẫn tù nếu đề không loại) rồi kiểm từng khẳng định cần chứng minh (≥ 1000 cấu hình ngẫu nhiên khi đề cho tham số); lượng giác bằng `Math.sin(x*Math.PI/180)`; thực tế thay đáp số vào từng dữ kiện. Đừng nhẩm.

## 9. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/ck/<MA>.hinh.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/CK/<MA>" --khoi 9 --chi-kiem
```

Định dạng: mỗi công thức một cặp `$…$` · dấu nhân tường minh `\cdot` (CẤM `\times`) · chia `:` · phân số `\dfrac` · số thập phân dấu phẩy `2{,}5` · độ `^\circ` · `\widehat{ABC}`, `\triangle ABC`, `\perp`, `\parallel`, `\backsim`, `\approx` · chữ Việt trong công thức bọc `\text{…}` · đơn vị `$10\ \text{cm}$` · số lớn ngoài công thức viết "12 600 000 đồng" · không `$$`, không bảng Markdown, không `*…*`.

## 10. Trả lời cuối (≤ 150 từ)

Số bài hình tìm được (liệt kê nhãn + một dòng mô tả) · mỗi bài thuộc `hai_tt` / `ba_tt` / `tt_khac` / `khong_tt` (đếm) · câu `tra_loi_ngan` · số hình đề + hình giải đã vẽ · đề sai (nếu có) · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.
