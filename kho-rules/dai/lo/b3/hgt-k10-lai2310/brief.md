# Brief B3 — KHỚP LẠI câu Hình giải tích (Véc tơ) K10 vào dạng bài của bản đồ mới

Bạn xếp câu hỏi Véc tơ lớp 10 vào **dạng bài** của bản đồ. Mức `cao` được ghi thẳng vào kho (người chỉ hậu kiểm mẫu), nên **thà `vua`/trống còn hơn gán sai**.
Đây là lượt **khớp lại** theo luật mới của CEO (Thùy 23/10) — mỗi câu có trường `hien_tai` (chỗ đang xếp, chỉ để tham khảo, có thể sai theo luật mới).

## Đầu vào
- `bang-dich.md` (cùng thư mục): mọi dạng bài, **theo đúng thứ tự học trên bản đồ**, kèm `thứ tự` số, mô tả, ví dụ. Đọc HẾT trước khi làm.
- `lo-NN.json`: mảng câu (`ma_cau`, `de`, `lua_chon`, `dap_an`, `loi_giai` cắt ngắn, `co_hinh`, `goi_y_cu`, `hien_tai`).

## Luật của CEO (bắt buộc)
1. **DẠNG SAU THẮNG:** câu trông thuộc hai (hay nhiều) dạng khác nhau ⇒ luôn xếp vào dạng đứng **SAU** (số thứ tự lớn hơn) trong `bang-dich.md`; mức `cao`, không cần hạ xuống `vua` chỉ vì hai dạng cùng hợp.
2. **Câu "chọn mệnh đề/khẳng định đúng" (trắc nghiệm nhiều phương án)**: dạng quyết định bởi **phương án ĐÚNG** (đáp án) và cách kiểm tra nó, không bởi các phương án nhiễu. Vd tam giác đều, đáp án đúng là $|\overrightarrow{AB}|=|\overrightarrow{BC}|$ (các phương án nhiễu là véc tơ bằng nhau) ⇒ thuộc **độ dài véc tơ**, không phải "2 véc tơ bằng nhau".
3. **Nhiều cách giải**: chỉ cần MỘT cách giải hợp lệ thuộc một dạng thì câu được xếp vào dạng đó; nhiều dạng cùng hợp ⇒ luật 1.
4. Đọc kỹ dòng "Lưu ý" trong mô tả từng dạng (Thùy ghi ranh giới ở đó).
5. Xếp theo **KIỂU BÀI** (đề cho gì, hỏi gì, giải bằng gì), không theo từ khoá. Câu có hình (`co_hinh`) mà nội dung chỉ có trong hình ⇒ `vua`; hình đã đủ dữ kiện qua đề/đáp án thì xếp `cao`.

## Mức chắc
- `cao`: khớp rõ một dạng (sau khi áp luật 1–3).
- `vua`: còn băn khoăn thật (đề thiếu/lỗi, hình thiếu dữ kiện, ý rải ra các dạng khác hẳn mà không có dạng nào bao).
- trống (`dang_bai_id: null`, `chac: null`): không dạng nào khớp; `ly_do` ghi bản đồ THIẾU dạng gì (hoặc "thuộc Hình học: …" / "thuộc lượng giác: …" / "không phải câu hỏi: …").

## Đầu ra
Với mỗi `lo-NN.json` ghi `lo-NN.out.json` cùng thư mục: mảng JSON, **mỗi câu đầu vào đúng 1 phần tử, đủ số câu, đúng thứ tự**:
```json
[{"ma_cau": "T310...", "dang_bai_id": "NDB00901", "chac": "cao", "ly_do": "≤25 từ"}]
```
`dang_bai_id` phải là mã có trong `bang-dich.md`. Ghi bằng Write (JSON hợp lệ). Không ghi DB, không sửa file khác. Trả lời ngắn: số cao/vua/trống + vài câu đáng chú ý.
