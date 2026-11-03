# Brief: đề xuất DẠNG BÀI cho nhóm chưa có dạng — bản đồ mới KHTN (03/11/2026)

> Thùy 03/11: *"Cần check lại bản đồ KHTN — viết lý thuyết, mô tả, ví dụ; phân lại các câu hỏi vào các dạng."*
> Các nhóm trong lô này CHƯA có dạng bài nào nên câu của chúng không xếp được. Bạn dựng nháp các dạng bài cho từng nhóm
> (trưởng khối sẽ duyệt/sửa trên màn bản đồ). Người làm: trạm Sonnet. KHÔNG ghi DB, KHÔNG sửa tệp nào ngoài tệp kết quả.

Gốc repo: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2` · thư mục lô: `kho-rules\khtn\bdm-0311\lo\`
**Đọc trước `kho-rules\khtn\bdm-0311\brief-dien.md` §2 (luật nội dung mô tả / lý thuyết / ví dụ) — áp y nguyên.**

## 1. Việc

Đầu vào `<LO>.in.json`: `{ "nhom": [ { nhom_id, khoi, chu_de, chuyen_de, nhom, nhom_mo_ta, nhom_ly_thuyet_hien_co, can_dien_ly_thuyet_nhom, cau: [ {ma_cau, loai, de, lua_chon?, dap_an?, loi_giai, co_hinh?} ] } ] }`

Với MỖI nhóm:
1. Đọc HẾT câu của nhóm. Gom câu theo **KIỂU BÀI** (đề cho gì, hỏi gì, giải bằng cách nào) — không theo từ khoá bề mặt.
2. Đề xuất **2–8 dạng bài** (nhóm rất ít câu / rất thuần thì có thể 1). Mỗi dạng phải có ≥ 3 câu thật, trừ khi là kiểu bài rõ ràng của chương trình mà kho đang ít câu.
   Hai dạng phải phân biệt được bằng cách làm, không chỉ bằng số liệu. Đừng chẻ quá vụn (mỗi dạng ≈ một kĩ năng HS phải luyện riêng).
3. Xếp dạng theo thứ tự học: nhận biết/khái niệm → hiểu/giải thích → tính toán/vận dụng → tổng hợp.
4. Tên dạng: ngắn (≤ 12 từ), nói KIỂU BÀI (vd "Tính áp suất khi biết áp lực và diện tích bị ép"), viết hoa chữ cái đầu như câu thường.
5. Mỗi dạng soạn `mo_ta`, `ly_thuyet`, `vi_du` theo brief-dien §2 (ví dụ lấy từ câu của chính cụm đó).
6. `cau`: danh sách `ma_cau` bạn gom vào dạng đó (đây chỉ là GỢI Ý — một trạm khác sẽ xếp lại độc lập để đối chiếu).
   Câu không hợp nhóm (lạc chủ đề) hoặc không phải câu hỏi ⇒ đưa vào `khong_hop` kèm lý do ngắn.
7. Nhóm có `can_dien_ly_thuyet_nhom` = true ⇒ soạn lý thuyết nhóm (brief-dien §2.6).

Ghi `<LO>.out.json`:
```
{ "nhom": [ { "nhom_id": "KNB…", "ly_thuyet": "…|''",
              "dang_bai": [ { "ten": "…", "mo_ta": "…", "ly_thuyet": "…", "vi_du": "…", "nguon_vi_du": "KC…", "cau": ["KC…", …] } ],
              "khong_hop": [ { "ma_cau": "KC…", "ly_do": "…" } ],
              "ghi_chu": "…" } ] }
```
Mỗi câu đầu vào xuất hiện ĐÚNG MỘT lần (trong một `cau` hoặc trong `khong_hop`).

## 2. Tự kiểm
- JSON hợp lệ; mọi `nhom_id` có mặt; mỗi `ma_cau` đầu vào đúng 1 lần, không mã lạ.
- Kiểm định dạng + KaTeX như brief-dien §3.

## 3. Trả lời cuối (≤ 100 từ)
Mỗi nhóm: số dạng đề xuất · số câu không hợp. Điểm nào bạn thấy bất thường (nhóm đặt sai chủ đề, câu lệch nhóm hàng loạt).
