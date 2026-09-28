# mathtype-thu — đọc thẳng công thức MathType trong file Word

**Trạng thái: BẢN THỬ (P0, 28/09).** Chứng minh được là làm được. Chưa qua bộ đề chấm, chưa nối vào dây chuyền.

Đọc công thức MathType nhúng trong `.docx` ra LaTeX bằng code: không OCR, không gọi AI, ~0,2–0,3 giây/file.

```
node scripts/kho/mathtype-thu/doc-docx.mjs "<file.docx>" --ra <thư mục>
```

| File | Việc |
|---|---|
| `cfb.mjs` | Đọc file OLE (`word/embeddings/oleObjectN.bin`), lấy luồng "Equation Native" |
| `mtef-parse.mjs` | Dữ liệu nhị phân MTEF bản 5 → cây bản ghi |
| `mtef.mjs` | Cây bản ghi → LaTeX |
| `doc.mjs` | Đi qua `document.xml` theo thứ tự, thay từng công thức bằng `$latex$` |
| `texcompare.mjs` | So cấu trúc 2 công thức LaTeX (dùng để đối chiếu với TeX gốc tác giả để lại trong file) |
| `doc-docx.mjs` | Lệnh chạy |

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
| 1 | **Số thứ tự tự động của Word bị mất** — đoạn đánh số tự động chỉ ra dấu `[[#]]` | File PNL và Từ Tâm **không còn chữ "Câu 1", "Câu 2"** (0 dòng "Câu N" trong kết quả). NBV gõ tay nên còn. | Chặn |
| 2 | **Định dạng chữ bị bỏ** (gạch chân, tô màu, in đậm) | Đề trắc nghiệm đánh dấu **đáp án đúng bằng gạch chân / màu** thì mất đáp án | Chặn |
| 3 | Ký hiệu chèn kiểu `w:sym` ra `[[sym:…]]` | 2–59 chỗ mỗi file | Cần sửa |
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
