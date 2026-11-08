# Brief: gán dạng bài (MÙ) cho các câu của chuyên đề "Hệ thức lượng trong tam giác" — Toán 10, bản đồ mới (19/10/2026)

> Thùy 19/10: *"Chuyên đề Hệ thức lượng trong tam giác — dạng mới: (1) Tính bán kính đường tròn ngoại tiếp tam giác; (2) Tính và sử dụng diện tích tam giác để tìm 1 số yếu tố khác. Dạng cũ sửa mô tả: Bài toán thực tế tính diện tích tam giác, đa giác. Duyệt lại các bài chưa chắc dạng và các bài chưa có dạng."*
> Người làm: trạm Sonnet. **Gán MÙ**: bạn không được xem dạng mà hệ thống đang đề xuất cho từng câu; tự đọc đề + lời giải + hình rồi chọn. KHÔNG ghi DB. KHÔNG sửa tệp nào ngoài tệp kết quả của bạn.

Gốc repo: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2` · thư mục việc: `kho-rules\dai\lo\k10-htl\`

## 1. Vào / ra

- **Các dạng được chọn** (13 dạng, 3 nhóm): `kho-rules\dai\lo\k10-htl\dang.json` — mỗi dạng có `dang_id`, `nhom`, `dang`, `mo_ta`, `ly_thuyet`, `vi_du`. **Đọc kỹ `mo_ta` + ví dụ của TỪNG dạng trước khi gán** — nhất là 5 dạng: NDB01034 (mới), NDB01035 (mới), NDB00773 (mô tả vừa sửa), NDB00769, NDB00772, NDB00764 (dễ nhầm với nhau).
- **Câu cần gán:** tệp vào do điều phối chỉ định (vd `in-P1A.json`): mảng `{ ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de_file, anh_dap_an_file }`. `anh_de_file` = đường dẫn ảnh hình vẽ của ĐỀ (nếu có) — **phải mở ảnh bằng công cụ Read** khi đề nói "như hình vẽ"/thiếu số liệu; `anh_dap_an_file` = hình của lời giải.
- **Kết quả:** ghi `kho-rules\dai\lo\k10-htl\<tên-tệp-ra>` (điều phối chỉ tên) dạng mảng:
```
[ { "ma_cau": "…", "dang_id": "NDB01034" | "NGOAI" | "KHONG_KHOP", "chac": "cao" | "vua", "ly_do": "≤ 30 từ: yêu cầu của đề + vì sao dạng đó" } ]
```
  - `NGOAI` = câu thuộc chuyên đề/chủ đề khác (giá trị lượng giác của một góc, mệnh đề, tập hợp, bất phương trình, véc tơ… — không phải định lí cos/sin/diện tích).
  - `KHONG_KHOP` = đúng chuyên đề Hệ thức lượng nhưng **không dạng nào trong 13 dạng** mô tả đúng (ghi rõ vì sao ở `ly_do`).
  - Mỗi câu **đúng một** dòng, đủ mọi câu của tệp vào.

## 2. LUẬT gán

1. **Đọc YÊU CẦU CUỐI của đề (đề hỏi gì) trước**, rồi mới nhìn cách giải. Dạng theo mô tả của dạng (CEO viết), không theo cảm tính.
2. **Tự giải trong đầu / `node -e` khi cần** để biết câu thực sự dùng định lí nào (cos, sin, công thức diện tích) và đại lượng nào cần tìm — đừng gán theo từ khoá nổi ("định lí sin") nếu đề hỏi thứ khác.
3. **Thực tế vs không thực tế:** "bài toán thực tế" = đề có bối cảnh đời sống (cây, sông, tháp, tàu, tam giác đất, mảnh vườn…). Câu thực tế dùng cos/sin → dạng thực tế tương ứng; câu thực tế tính diện tích → dạng thực tế diện tích (xem mô tả NDB00773 vừa sửa: bài phải giải tam giác trước rồi mới tính diện tích đa giác cũng vào đó).
4. **Chỉ 1 dạng.** Câu cần cả hai ý (vd tính cạnh bằng cos rồi tính diện tích): chọn theo **đại lượng cuối cùng đề yêu cầu** và theo mô tả dạng; nếu mô tả hai dạng đều có thể áp dụng ⇒ `chac: "vua"` và nói rõ hai ứng viên trong `ly_do`.
5. **Không chắc ⇒ `chac: "vua"`** (không đoán bừa). `chac: "cao"` chỉ khi đọc mô tả dạng + đề + lời giải thấy khớp rõ và loại được dạng bên cạnh.
6. Đề có đáp án/lời giải sai hoặc đề thiếu dữ kiện (không đủ để biết đề hỏi gì) ⇒ `KHONG_KHOP`, `ly_do` nêu rõ.

## 3. Tự kiểm trước khi nộp

- JSON hợp lệ; số dòng = số câu của tệp vào; mọi `dang_id` thuộc 13 dạng hoặc `NGOAI`/`KHONG_KHOP`.
- Với mỗi câu có `anh_de_file` mà bạn gán `cao`: xác nhận đã mở ảnh.

## 4. Trả lời cuối (≤ 120 từ)

Số câu theo từng dạng · số `NGOAI` · số `KHONG_KHOP` · số `vua` · chỗ mô tả hai dạng chồng nhau gây khó gán (nêu tên dạng).
