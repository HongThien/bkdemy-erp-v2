# Brief GIẢI — câu Nguyên hàm · Tích phân · Ứng dụng tích phân (Toán 12, đề thi/đề cương trong folder tham khảo)

Bạn là người GIẢI câu hỏi Toán 12 (chương trình 2018). Thư mục lô: `kho-rules/dai/lo/k12-de/nhtp-word/`.
Với mỗi `lo-NN.json` (mảng câu) bạn ghi `lo-NN.<TÊN>.out.json` (TÊN do điều phối nêu trong prompt) — **đúng số phần tử, đúng thứ tự, mỗi câu 1 phần tử**, bằng công cụ Write (JSON hợp lệ).

## Đầu vào mỗi câu
`id` · `loai` (`trac_nghiem` 4 phương án A–D theo thứ tự trong `lua_chon` | `dung_sai` 4 mệnh đề a–d trong `menh_de` | `tra_loi_ngan` đáp số) · `de` · có thể có `dap_an_nguon_file` / `loi_giai_file` (đáp án đọc từ file nguồn — chỉ THAM KHẢO, vẫn phải tự giải rồi so; lệch ⇒ ghi `ghi`).
Không thấy hình: nếu đề nói "như hình vẽ"/"cho đồ thị" mà không đủ dữ kiện bằng chữ ⇒ `dap_an: null`, `ghi: "cần hình"`.

## Cách giải (bắt buộc)
1. Tự giải từng câu; **kiểm bằng máy khi tính được**: viết script `node` (không có Python) tính số (Simpson/đạo hàm số/thử phương án) rồi so với đáp số của bạn. Đặt script tạm trong thư mục `tam-<TÊN>/` (tự tạo). Không dùng thư mục chung `/tmp`.
2. Trắc nghiệm: `dap_an` = một chữ `"A"|"B"|"C"|"D"` ứng với thứ tự phương án trong `lua_chon`. Nhiều phương án cùng đúng/không phương án đúng ⇒ chọn phương án gần đúng nhất nếu đề lỗi in hiển nhiên, và ghi `de_sai:true` + `ghi`; không chắc ⇒ `null`.
3. Đúng/Sai: `dap_an` = mảng 4 phần tử `"Đ"`/`"S"` theo a,b,c,d (null cho ý không xét được).
4. Trả lời ngắn: `dap_an` = chuỗi số (dấu chấm thập phân, không đơn vị; làm tròn đúng yêu cầu đề — "làm tròn đến hàng phần trăm" ⇒ 2 chữ số sau dấu chấm). Đề không nói làm tròn mà kết quả không đẹp ⇒ ghi `ghi`.
5. **Thà `null` còn hơn đoán.** Câu có số liệu vô lý / đề sai ⇒ giải bình thường theo ý đề, ghi `de_sai:true` và lý do.
6. Không sửa file khác, không ghi DB, **không xoá gì kể cả nháp**.

## Đầu ra mỗi phần tử
```json
{"id":"W0001","dap_an":"C","do_chac":"cao|vua","de_sai":false,"ghi":"≤ 25 từ: cách giải/điều bất thường"}
```
`do_chac`: `cao` nếu đã kiểm bằng máy hoặc giải hai cách khớp; `vua` nếu chỉ giải tay một lần.
Cuối cùng trả lời ≤ 50 từ: số câu cao/vua/null.
