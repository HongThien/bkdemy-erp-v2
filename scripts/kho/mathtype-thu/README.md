# mathtype-thu — đọc thẳng công thức MathType trong file Word

**Trạng thái (28/09 chiều, máy công ty): 2 lỗ chặn ĐÃ VÁ, qua BÀI THI 10/10 file.** Chưa nối vào dây chuyền.

Đọc công thức MathType nhúng trong `.docx` ra LaTeX bằng code: không OCR, không gọi AI, ~0,2–0,3 giây/file.
Dựng lại nhãn đánh số tự động của Word ("Câu 1.", "» Câu 2.", "a)") và giữ định dạng chữ đánh dấu đáp án.

```
node scripts/kho/mathtype-thu/doc-docx.mjs "<file.docx>" --ra <thư mục>
node scripts/kho/mathtype-thu/bai-thi.mjs          # thi lại sau MỖI lần sửa bộ đọc (§9.6 spec-luong-kho.md)
```

## Bài thi (dựng 28/09 — thi trước, sửa sau)

10 file K12 có **bản PDF cùng tên tác giả để lại cạnh file Word** (nhân chứng độc lập, không do bộ đọc sinh ra):
3 Từ Tâm · 3 NBV · 3 PNL · 1 đề ôn chương NBV. Danh sách gốc: `bai-thi-nguon.txt`; bản chép nằm ở
`<KHO_LAM_VIEC>/bai-thi-mathtype/` (không commit — 47 MB, dựng lại được từ danh sách).

| Tiêu chí | Đo thế nào | Kết quả 28/09 |
|---|---|---|
| Số câu | nhãn "Câu N" bộ đọc dựng lại **=** nhãn "Câu N" trong chữ PDF (`pdftotext`) | **9/9** file có PDF chữ khớp đúng (TT1: PDF chỉ 2 trang, không dùng được) |
| Liên tục | trong mỗi danh sách (`numId`) số chạy 1,2,3… | 10/10 |
| Đáp án | mỗi câu TN có đúng 1 phương án gạch chân, hoặc lời giải ghi "Chọn X"; có cả hai thì phải trùng | 245/253 câu TN rõ · 4 câu **mâu thuẫn trong file gốc** · TT1 là bản HS không có đáp án |

Trước khi vá: 9/10 file **0 nhãn "Câu N"** (chỉ DE1 gõ tay là còn) và 0 dấu gạch chân ⇒ mất số câu + mất đáp án.

**Mâu thuẫn nguồn đã soi tay (bộ đọc ĐÚNG, tác giả sai):** NBV1 câu 17 gạch B, ghi "Chọn A", lời giải tính ra 3 = B ·
TT2 câu 7 gạch B (y = 5), ghi "Chọn D" · TT3 câu 19 gạch D (R² = 25), ghi "Chọn A" · TT3 câu 20 gạch D, ghi "Chọn C".
⇒ Chữ "Chọn X" của Từ Tâm/NBV **không tin được một mình**; dây chuyền phải coi lệch gạch chân ↔ "Chọn X" là làn 🔴.

**Hồi quy công thức:** tổng công thức đổi được / hỏng trên 10 file không đổi giữa bản trước và sau khi vá (in ở DEVLOG 28/09).

## Định dạng đầu ra

- Nhãn số tự động đứng đầu đoạn, đúng chữ Word hiển thị: `Câu 1:` · `» Câu 2.` · `a)` · bullet = `•`.
  `[[#]]` chỉ còn khi `numId` không tra được trong `numbering.xml` (đếm ở `autoNumberedUnresolved`).
- Định dạng chữ: `[[u]]…[[/u]]` gạch chân · `[[b]]…[[/b]]` đậm · `[[mau:RRGGBB]]…[[/mau]]` · `[[nen:yellow]]…[[/nen]]`.
  Thứ tự lồng cố định u → b → mau → nen; run liền nhau cùng định dạng được gộp; chữ ẩn (`w:vanish`) bị bỏ, chỉ đếm.
  Đáp án đúng trong PNL/NBV: `[[u]][[b]]A[[/b]][[/u]][[b]]. [[/b]]$…$`.
- Chữ trắng (`FFFFFF`) đếm riêng (`runsWhiteText`) — trong 10 file mẫu chỉ là tiêu đề trang trí trên nền màu, không phải giấu đáp án.
- Luật đếm số đã cài (`so-thu-tu.mjs`, có test): num cùng `abstractNum` không `lvlOverride` ⇒ **đếm nối** (bẫy Word);
  có `startOverride` ⇒ đếm riêng; tăng cấp cha ⇒ cấp con về đầu. `numPr` trong `w:pPrChange` (track changes) bị bỏ qua.
  `numPr` khai trong **styles.xml** CHƯA đọc — 10 file mẫu không dùng; gặp thì `autoNumberedParagraphs = 0` mà PDF vẫn có "Câu N".

| File | Việc |
|---|---|
| `cfb.mjs` | Đọc file OLE (`word/embeddings/oleObjectN.bin`), lấy luồng "Equation Native" |
| `mtef-parse.mjs` | Dữ liệu nhị phân MTEF bản 5 → cây bản ghi |
| `mtef.mjs` | Cây bản ghi → LaTeX |
| `doc.mjs` | Đi qua `document.xml` theo thứ tự, thay từng công thức bằng `$latex$` |
| `texcompare.mjs` | So cấu trúc 2 công thức LaTeX (dùng để đối chiếu với TeX gốc tác giả để lại trong file) |
| `so-thu-tu.mjs` | Đọc `numbering.xml`, dựng lại nhãn đánh số tự động theo luật đếm của Word |
| `doc-docx.mjs` | Lệnh chạy 1 file |
| `bai-thi.mjs` · `bai-thi-nguon.txt` | Bài thi 10 file + danh sách nguồn để dựng lại |

## Đã đo (28/09)

| Tập | File | Công thức | Đổi được | Hỏng (có báo lý do) | KaTeX render |
|---|---|---|---|---|---|
| 3 file mẫu lúc viết (NBV · PNL · Từ Tâm, K12 hàm số) | 3 | 2.177 | 2.174 | 3 | 100% số đổi được |
| File đối chứng có bản PDF (PNL, toạ độ không gian) | 1 | 2.056 | 2.056 | 0 | 100% |
| **6 file CHƯA TỪNG THẤY** (K12 nguyên hàm, tích phân, xác suất · K11 lượng giác · K10 tam thức) | 6 | **4.225** | **4.212 (99,69%)** | 13 | 100% số đổi được |

Hỏng trên tập chưa từng thấy, chỉ 2 lý do: ký tự tab nằm trong công thức (6) · ký hiệu `↷` chưa có trong bảng (7).

**Nhân chứng độc lập đã dùng:**
1. So bằng mắt với bản PDF cùng tên: 15 công thức liên tiếp — 13 khớp, 1 khớp trừ ký hiệu ℝ (PDF render ra ô trống nên không xác nhận được), 1 lệch nghĩa (dấu gạch en, xem dưới).
2. 383 công thức còn giữ TeX gốc của tác giả trong file: 381 cùng cấu trúc, 2 khác — cả 2 là do TeX gốc đã cũ (công thức bị tách sau đó).
   Nhân chứng này bắt được 1 lỗi thật của bản đầu (dấu phẩy trên bị nâng 2 lần), đã sửa.
3. Cận tích phân ở file chưa từng thấy đọc ra đúng thứ tự dưới/trên (−2→1, 1→3, a→b; tổng các đoạn khớp nhau).

**KaTeX render được chỉ chứng minh ĐÚNG CÚ PHÁP, không chứng minh ĐÚNG NỘI DUNG.**

## Chưa làm được — phải xử lý trước khi dùng thật

| # | Lỗ | Hậu quả | Mức |
|---|---|---|---|
| ~~1~~ | ~~Số thứ tự tự động của Word bị mất~~ | **ĐÃ VÁ 28/09** — `so-thu-tu.mjs`, qua bài thi 9/9 file khớp PDF | — |
| ~~2~~ | ~~Định dạng chữ bị bỏ~~ | **ĐÃ VÁ 28/09** — thẻ `[[u]]/[[b]]/[[mau]]/[[nen]]`, đáp án gạch chân đọc ra 100% ở PNL/NBV | — |
| 3 | Ký hiệu chèn kiểu `w:sym` ra `[[sym:…]]` | 2–59 chỗ mỗi file (Từ Tâm: `Wingdings:F040` trước "Lời giải") | Cần sửa |
| 4 | Tác giả gõ **gạch en `–` thay dấu trừ** trong công thức | Nhìn giống nhưng không phải phép trừ; máy tính lại đáp số sẽ sai | Cần luật chuẩn hoá |
| 5 | Ký tự riêng của font MathType chưa có trong bảng (`U+F700`, `↷`, tab) | Công thức đó bị đánh dấu hỏng | Bổ sung dần |
| 6 | Bảng bị dàn thành đoạn; hộp chữ in ra trước đoạn neo | Thứ tự đọc có thể lệch ở file nhiều hộp chữ | Cần sửa |
| 7 | Dấu phẩy thập phân `20,2` render có khe nhỏ sau dấu phẩy | Thẩm mỹ | Nhẹ |
| 8 | Hình (ảnh thường) chỉ ra tên file `[[img:…]]` | Chưa cắt/lưu hình | Việc của trạm hình |

## Viết theo trí nhớ về định dạng, CHƯA gặp trong dữ liệu thật

Tổng `∑`, tích `∏`, hợp/giao lớn · ngoặc nhọn, sàn, trần · ngoặc ôm ngang · phân số kiểu xiên · mũi tên có chữ dưới ·
chỉ số đặt trước · vạch chia ma trận. Gặp lần đầu phải đối chiếu bằng mắt.

Không hỗ trợ: MTEF khác bản 5 (tức công thức kiểu Equation 3.0 cũ) · chia dài · bra-ket.

## Lỗi nằm trong FILE GỐC (không phải lỗi đọc)

Một công thức của NBV chứa `\text{ v?i }` — chính file gốc đã lưu dấu `?` ở chỗ chữ "ớ". Bộ đọc giữ nguyên, không đoán.
