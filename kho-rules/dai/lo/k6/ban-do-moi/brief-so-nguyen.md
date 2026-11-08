# Brief — điền LÝ THUYẾT + VÍ DỤ cho chủ đề SỐ NGUYÊN (Toán 6, KNTT tập 1 Chương III)

Bản đồ 4 tầng đã dựng trong DB (khung: tên + mô tả). Việc của bạn: **soạn lý thuyết nhóm, lý thuyết dạng, ví dụ dạng** cho MỘT chuyên đề, ghi ra 1 file JSON. Bạn KHÔNG ghi DB, KHÔNG sửa file nào khác.

## Đọc trước (theo thứ tự)
1. `kho-rules/dai/lo/k6/ban-do-moi/de-xuat-so-nguyen.json` — cây đầy đủ (chuyên đề → nhóm → dạng; mỗi dạng `[tên, mô tả, số câu, [4 số cuối mã câu mẫu], nguồn]`). Bạn chỉ làm chuyên đề được giao (chỉ số `cd[i]`), theo ĐÚNG thứ tự nhóm, dạng trong file.
2. Câu mẫu thật trong kho: `C:\Users\WBPC\bk-kho-lam-viec\so-nguyen\cau-so-nguyen.json` (mã `T106000000` + số 3–4 chữ số, ví dụ `0028` → `T106000000028`). Xem để bắt đúng KIỂU đề học sinh gặp.
3. Sách Củng cố (cách trình bày + phương pháp giải từng dạng): `C:\Users\WBPC\bk-kho-lam-viec\so-nguyen\cungco\C3. Bài 1…5.txt` và `C3. Ôn tập chương III.txt` (mục "Phương pháp giải" + hướng dẫn giải).
4. Mẫu ĐÃ DUYỆT về giọng văn và định dạng: `kho-rules/dai/lo/k6/ban-do-moi/ghi-dang-moi-2010c.mjs` (xem `NHOM_LT`, `LT`, `VD`) và `spec-format-noidung.md`.

## Định dạng (BẮT BUỘC)
- **Lý thuyết NHÓM** (`nhom[j].ly_thuyet`) = kiến thức chung cả nhóm: các khối `##TC` (tính chất / quy tắc cần nhớ), `##PP` (phương pháp chung), `##CY` (chú ý, lỗi hay gặp). Khối cách nhau 1 dòng trống. Mỗi khối là các dòng ngắn, mỗi dòng một ý.
- **Lý thuyết DẠNG** (`dang[k].ly_thuyet`) = riêng dạng đó: chủ yếu `##PP` (các bước giải dạng này) + `##CY`; thêm `##TC` chỉ khi có công thức riêng. KHÔNG chép lại nguyên văn lý thuyết nhóm.
- **Ví dụ DẠNG** (`dang[k].vi_du`): **2 ví dụ** (dạng rất hẹp: 1 ví dụ cũng được; dạng hay gặp có nhiều kiểu: 2 ví dụ khác kiểu). Mỗi ví dụ:
  ```
  ##VD
  <đề bài; nhiều ý a), b) thì để LIỀN nhau, mỗi ý một dòng, KHÔNG dòng trống giữa các ý>
  **Hướng dẫn giải:**
  <bước 1>

  <bước 2>

  <kết luận: "Vậy …">
  ```
  Các bước giải cách nhau 1 dòng trống. Giữa 2 ví dụ cũng 1 dòng trống.
- Toán viết `$...$` (KaTeX). Ví dụ: `$(-12)+7=-5$`, `$\text{Ư}(6)=\{\pm1;\pm2;\pm3;\pm6\}$`.
- **Dấu nhân = dấu chấm** `.` (viết `$(-3).5$`), CẤM `\cdot`, `\times`. Phân số viết `\dfrac{..}{..}`. Dấu ngoặc số âm: `$5+(-3)$`.
- Mức tin: nếu nhóm/dạng trong cây có 0 câu trong kho thì tự soạn theo kiểu SGK / sách Củng cố (số nhỏ, tính tay được).

## Phạm vi kiến thức (CỨNG — học sinh lớp 6, sau Chương I–II + Chương III)
- ĐƯỢC dùng: số nguyên âm / dương, trục số, số đối, so sánh, cộng / trừ / nhân / chia hết số nguyên, quy tắc dấu ngoặc, tính chất giao hoán–kết hợp–phân phối, luỹ thừa số mũ tự nhiên (kể cả cơ số âm), thứ tự thực hiện phép tính, ước / bội của số nguyên, tìm thành phần chưa biết, tích bằng 0.
- CẤM: **giá trị tuyệt đối** (kí hiệu |x|) · **chuyển vế đổi dấu** (làm bằng tìm thành phần chưa biết, hoặc cộng/trừ hai vế cùng một số nếu thật cần) · phân số âm / số hữu tỉ (chưa học) · số đo góc · phương trình bậc hai, định lý Viète · quy tắc nhân luỹ thừa của luỹ thừa $(a^m)^n=a^{mn}$ làm quy tắc (nếu cần, viết "tích của $n$ thừa số").
- Tính $a^n$ với $a<0$: $(-a)^n$ — số mũ chẵn dương, số mũ lẻ âm; viết rõ dấu ngoặc.

## Kiểm số bằng máy
Mỗi ví dụ cần ít nhất một biểu thức JavaScript **tính lại đáp án cuối từ dữ kiện đề** (độc lập với lời giải), trả về `true`. Dùng `BigInt` nếu số lớn; tìm nghiệm bằng vét cạn nếu cần. Ghi vào mảng `kiem` của dạng (một chuỗi mỗi ví dụ), ví dụ:
`"(-12)+7 === -5"`  ·  `"[...Array(41).keys()].map(i=>i-20).filter(x=>(x+2)*(x-3)===0).join()==='-2,3'"`.
Ví dụ về ước: `"[1,2,3,6,-1,-2,-3,-6].every(d=>6%d===0)"`.

## Kết quả
Ghi file `kho-rules/dai/lo/k6/ban-do-moi/so-nguyen-nd/cd-<i>.json` (i = chỉ số chuyên đề, bắt đầu từ 1) đúng khung:
```json
{ "cd": 1,
  "nhom": [
    { "ten": "<tên nhóm trong cây>", "ly_thuyet": "##TC\n...\n\n##PP\n...\n\n##CY\n...",
      "dang": [
        { "ten": "<tên dạng trong cây>", "ly_thuyet": "##PP\n...\n\n##CY\n...", "vi_du": "##VD\n...\n**Hướng dẫn giải:**\n...", "kiem": ["...", "..."] }
      ] }
  ] }
```
Số nhóm, số dạng, thứ tự và `ten` phải khớp cây. Dạng chưa có mô tả đủ rõ vẫn phải điền đủ ba trường.

## Tự soát trước khi nộp
1. Mọi số liệu trong lời giải đúng (tính lại 2 lần); đáp án khớp `kiem`.
2. Không vi phạm phạm vi CẤM ở trên; không có `\cdot`/`\times`.
3. Mỗi `$` mở đều có `$` đóng; không để `\text{}` thiếu ngoặc.
4. Đề của ví dụ thuộc ĐÚNG dạng (đúng mô tả dạng), không lẫn sang dạng khác trong cùng nhóm.
Báo cáo cuối: 3 dòng — số nhóm / số dạng đã điền, những ví dụ em không chắc, điều gì ngoài phạm vi phải bỏ.
