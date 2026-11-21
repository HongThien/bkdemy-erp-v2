# 5T — đối chiếu hai bản đề xuất bản đồ + cái đã ghi DB (21/11, 09:40)

Hai trang đề xuất chạy song song cho cùng một việc:
- **Bản gọn** `docs/de-xuat-5T-ban-do.html` (phiên này, 08:56–09:04): 14 dạng mới, suy luận = chuyên đề mới **trong chủ đề Cấu tạo số**.
- **Bản chi tiết** `docs/de-xuat-5T-ban-do-chi-tiet.html` (phiên khác, 09:11): 28 dạng mới (P01–P28), 18 dòng nới mô tả (W), 10 chỗ đặt cấu trúc (H1–H10), lý thuyết nháp; suy luận = **chủ đề thứ 6 riêng** (ghi "Thùy 21/11 đề nghị").

**Trạng thái DB (đo 09:40):** chỉ có phần của bản gọn — 1 chuyên đề + 7 nhóm + 14 dạng (`NDB03357`–`NDB03370`, ghi 09:09) + 2 sửa chính tả. Bản chi tiết **chưa ghi gì**. 14 dạng mới có **0 câu gán**, 0 lý thuyết, 0 ví dụ.

## Vấn đề

| # | Vấn đề | Mức |
|---|---|---|
| V1 | **Hai bản mâu thuẫn về cấu trúc**: gọn "không đổi chủ đề" (Thùy nói 21/11 sau khi xem bản gọn) ↔ chi tiết "chủ đề 6 riêng" (Thùy đề nghị). DB đang theo bản gọn. Chưa rõ quyết định cuối. | Chặn |
| V2 | **Trùng nếu ghi bản chi tiết chồng lên**: Tổng–hiệu (Đ1,Đ2 ↔ P06–P08), Tỉ lệ bản đồ (Đ3 ↔ P09–P10), Chuyển động đổi vận tốc (Đ4,Đ5 ↔ P16–P18), Hình thang hai đường chéo (Đ6 ↔ P22), Phân số xếp tầng (Đ8 ↔ P03), Dirichlet / lô-gic / bất biến (Đ9–Đ11 ↔ P23–P27). Sẽ ra hai nhóm cùng nghĩa ở hai chỗ. | Cao |
| V3 | **Khác chỗ đặt**: nhóm Tổng–hiệu — gọn: trong chuyên đề "Các bài toán về tỉ số"; chi tiết: chuyên đề mới "Tổng – hiệu" (H1). Tỉ lệ bản đồ — gọn: 1 dạng trong nhóm Tỉ lệ thuận–nghịch; chi tiết: nhóm riêng 2 dạng (H2). Lịch — gọn: nhóm riêng; chi tiết: trong "Dãy tuần hoàn" (P02). | Trung |
| V4 | **Dạng "rổ chung" của bản gọn**: Đ14 (cực trị–xếp ghép: que diêm, bìa vuông, chia chai…), Đ13 (thống kê + Venn), Đ11 (bất biến + bốc vật + vòng loại) gom kiểu bài khác cách giải. Bản chi tiết đo từng bài và để các cụm này ở "giữ chỗ" (1–3 bài/cụm). Dạng gom lẫn khó viết lý thuyết một mạch và khó clone. | Trung |
| V5 | Bản gọn có 2 dòng bản chi tiết không có: **Đ7 tìm số khi biết tích** (4 bài; chi tiết xếp "1 bài ở giữ chỗ") và **Đ14**. Chi tiết có 14+ dòng bản gọn không có (P01, P04, P05, P11–P14, P19–P21, P28 + 18 dòng nới mô tả W). Hai bản không bao phủ nhau. | Trung |
| V6 | 14 dạng đã ghi **thiếu lý thuyết + ví dụ** (160 dạng cũ đủ cả hai) ⇒ câu gán vào chưa được coi "chắc" (§C6). Bản chi tiết có lý thuyết nháp. | Trung |
| V7 | Chuyên đề "Tỉ số phầm trăm" còn sai chính tả (bản gọn chỉ sửa nhóm + dạng). Chi tiết có mục dọn chính tả. | Thấp |
| V8 | `ME-gan-dang-so-bo.json` (gọn) gán 81 mục theo 14 dạng của bản gọn; bản chi tiết gán theo cách giải (193 chắc / 117 gần / 18 không). **Hai bản gán khác nhau**, khi nhập sách chỉ được dùng MỘT. | Thấp (chặn lúc nhập ME) |
| V9 | Số "17 → 18 chuyên đề" ở báo cáo trước tính theo chuyên đề có nhóm; thực tế trước đó đã có 1 chuyên đề rỗng (chi tiết: "18 chuyên đề · 17 có nhóm") — hiểu nhầm nhỏ, không sai dữ liệu. | Thấp |

## Đề xuất chốt (chờ Thùy gật)

1. **Một bản duy nhất: bản chi tiết** (đo từng bài, có lý thuyết nháp, có chủ đề 6). Bản gọn đánh dấu "đã thay bởi bản chi tiết", chỉ giữ làm bằng chứng.
2. Thùy **dán kết quả "Sao chép kết quả" của bản chi tiết** (Duyệt / Sửa / Bỏ từng dòng) — em chưa thấy quyết định nào trong repo.
3. Với 14 dạng đã ghi (0 câu, chưa ai tham chiếu), **không xoá**: sau khi có quyết định, **chuyển + đổi tên** về đúng chỗ bản chi tiết (đổi `nhom_id` / `chuyen_de_id` / tên, mã giữ nguyên), dòng nào bản chi tiết không có (Đ7, Đ14…) hỏi Thùy giữ hay bỏ — bỏ = xoá thật ⇒ Luật xoá, chờ gật riêng.
4. Ghi phần còn lại của bản chi tiết theo quyết định (thử ROLLBACK, `--only`), rồi mới nhập ME / gán CLC theo MỘT bảng gán.

## Đã chốt và ghi (21/11, sau khi Thùy chọn bản chi tiết là chuẩn)

`scripts/kho/5t-ghi-ban-do-chi-tiet.mjs --ghi`: chủ đề 6 «Suy luận và toán điển hình» · chuyển chuyên đề «Các bài toán logic thường gặp» về đó và đổi tên «Tỉ lệ và công việc» (H7, H9) · 3 nhóm → «Phương pháp giải toán điển hình» (H8) · +5 chuyên đề, +1 nhóm · **27 dạng** (13 mới + 14 dòng của bản gọn dùng lại, không xoá gì) có mô tả + lý thuyết + ví dụ · 18 dòng nới mô tả (W01–W18, chỉ nối cuối) · chính tả chuyên đề «phần». Số câu gán không đổi (2337). 5T: 6 chủ đề · 23 chuyên đề · 63 nhóm · 187 dạng.
Chưa làm (chờ Thùy): P25, S01, S02, S04 (xoá chuyên đề rỗng NCH00546), S05, S06, S07, S08, H10. Dữ liệu nguồn: `kho-rules/dai/lo/me5-250/5T-dang-moi-chi-tiet.json`.
