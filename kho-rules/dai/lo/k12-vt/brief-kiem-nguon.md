# Brief — KIỂM cây đề xuất chương Vectơ K12: nguồn tạo dạng, độ khó, và độ PHỦ của cây (22/10)

Cây: `kho-rules/dai/lo/k12-vt/cau-truc.mjs` (3 chuyên đề · 15 nhóm · 47 dạng; mã dạng `P1.1.1`…). Nguồn & độ khó sơ bộ: `phan-loai-dang.mjs` (cùng thư mục). Bằng chứng: `ho-so/hoso-vt-tutam.md`, `hoso-vt-nbv.md`, `hoso-vt-pnl.md` (mỗi hồ sơ liệt kê các KIỂU đề thật + số câu + tác giả nào có) và `ho-so/de-erp-theo-nhom-cu.txt` (đề thi K12 trên ERP, theo dạng cũ T1120701–T1120703: số câu trong kho, số câu nằm trong đề thi).

Thùy cần cho MỖI dạng hai cột mới: **độ khó** (muc_do 1–5) và **nguồn quyết định tạo ra dạng** (vì "có dạng không có trong đề thi mà chỉ có ở sách tham khảo"). Việc của bạn — làm kỹ, chính xác hơn nhanh:

## A. Nguồn của từng dạng (sửa `NGUON` trong `phan-loai-dang.mjs`)
Với mỗi dạng, quyết định các nhân chứng: **T** Từ Tâm · **N** NBV · **P** PNL (có đề cùng kiểu trong tác giả đó — đối chiếu hồ sơ, kể cả kiểu do hồ sơ "tự rút") · **Đ** đề thi (dạng/ kiểu đó có câu nằm trong đề thi K12 trên ERP: dựa `de-erp-theo-nhom-cu.txt` — dạng cũ nào tương ứng với dạng mới và có "trong đề thi > 0" thì có Đ; dạng cũ có 0 câu trong đề thi thì KHÔNG Đ). Dạng cũ ↔ dạng mới tương ứng bạn tự ghép theo tên (vd T112070101 "Tổng hiệu giữa các vecto" ↔ P1.2.1–P1.2.3). Ghép được nhiều–một thì ghi rõ trong báo cáo. **Số câu trong đề thi thật nhỏ (1–2 câu) vẫn tính Đ nhưng ghi "yếu" trong báo cáo.** Chỗ không chắc: bỏ Đ (thà thiếu hơn sai) và ghi rõ.
Cập nhật trực tiếp map `NGUON` (giữ cú pháp tệp).

## B. Độ khó (muc_do 1–5)
Thang: 1 đọc/nhận biết trực tiếp · 2 một quy trình quen · 3 quy trình + biến đổi hoặc tham số đơn giản · 4 tham số khó, nhiều bước · 5 nâng cao (cực trị, kết hợp nhiều ý). Đối chiếu với nhận xét "mức khó" của hồ sơ (NB/TH/VD/VDC) và với độ khó ghi trong `cau-truc.mjs`. Dạng nào bạn thấy lệch ≥ 1 bậc ⇒ điền số mới vào `DO_KHO` của `phan-loai-dang.mjs` (mã dạng → số) kèm lý do 1 dòng trong báo cáo. Không lệch thì để trống.

## C. Độ PHỦ của cây (quan trọng nhất)
Đọc 3 hồ sơ và liệt kê **mọi KIỂU đề trong sách (mỗi hồ sơ có mục "kiểu")** chưa có dạng nào trong cây nhận: ghi kiểu + hồ sơ nào + số câu + gợi ý đặt vào dạng/nhóm nào (hoặc nên thêm dạng mới). Chỉ tính kiểu thuộc chương này (bỏ phần ngoài chương: thể tích, góc nhị diện, phương trình mặt phẳng, mặt cầu…). Ngược lại, liệt kê **dạng của cây không có kiểu nào trong sách** (nếu có).

## Ra
Ghi báo cáo `ho-so/bao-cao-kiem-nguon.md` (≤ 80 dòng): bảng 47 dạng (mã · nguồn cũ → mới · độ khó cũ → mới · ghi chú), mục C đầy đủ, mục "Cần Thùy quyết". Sửa `phan-loai-dang.mjs` (chỉ map NGUON và DO_KHO). KHÔNG sửa `cau-truc.mjs`; KHÔNG ghi DB. Trả lời cuối ≤ 100 từ.
