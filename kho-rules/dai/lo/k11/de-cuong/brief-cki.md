# Bổ sung cho brief-soan.md — đề cương CUỐI KÌ I Toán 11 (28/10)

Đọc `brief-soan.md` và `brief-soat.md` (cùng thư mục) trước; tệp này CHỈ nêu phần khác. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K11\<MA>`; ảnh trang `<LV>\trang\p-NN.png` (số 0 đệm 2 chữ số nếu đề ≥ 10 trang), tệp chữ thô (thiếu chữ Hy Lạp / ký hiệu, chỉ để định vị) `<LV>\van-ban.txt`.

## Phạm vi kiến thức
SGK KNTT 11 tập 1 CHƯƠNG 1–5: C1 hàm số LG & PTLG · C2 dãy số, CSC, CSN · C3 số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm (trung bình, trung vị, tứ phân vị, mốt) · C4 đường thẳng và mặt phẳng trong không gian, quan hệ song song (câu hình học không gian ⇒ `kho=hinh_hoc`) · C5 giới hạn, hàm số liên tục.
Chương 5: dùng quy tắc giới hạn SGK; CẤM L'Hôpital, đạo hàm, giới hạn đặc biệt `\dfrac{\sin x}{x}`, `e`, mũ–logarit lớp 11 (câu nào cần các thứ này mà không có cách trong phạm vi ⇒ BỎ câu và nêu id trong báo cáo; có cách trong phạm vi ⇒ giải bằng cách đó + `**Ghi chú:**`). Câu hỏi khái niệm đạo hàm (học kì II): BỎ + báo.
Mẫu số liệu ghép nhóm: công thức SGK (trung bình `\bar x=\dfrac{\sum m_in_i}{n}`, trung vị, tứ phân vị, mốt nội suy); chép bảng số liệu thành chữ trong `**Đề:**` (hoặc cắt hình nếu phức tạp).

## Quy tắc đã chốt (từ các lô K11 trước)
- Công thức mất / ảnh mờ không đọc chắc ⇒ BỎ câu, nêu id. Không đoán đề.
- Đề SAI giải bình thường theo số liệu in + ghi "đề sai" (`**Ghi chú:**` + dòng "Lưu ý" đầu Phần 2); chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ. Đáp số đề cương in sẵn mà khác kết quả đúng ⇒ giữ kết quả đúng + Ghi chú.
- **Phần 1 (Hướng dẫn) KHÔNG lộ đáp số cuối** (kể cả qua loại trừ phương án / nêu số nghiệm, số khoảng) và phải là bước nghĩ riêng của TỪNG câu — cấm dùng khuôn chung theo dạng cho nhiều câu.
- Bài tự luận nhiều ý: ý độc lập ⇒ tách (`Bài 2a`, `Bài 2b`); dữ kiện chung / ý sau dùng ý trước ⇒ giữ một câu.
- Đúng/Sai: đúng 4 ý, `dap_an` 4 chữ D/S. Trả lời ngắn: số ≤ 4 ký tự; không tô được ⇒ `loai=tu_luan`.
- Dấu nhân `\cdot`; `S.ABCD` viết `S{.}ABCD` trong `$…$`; không `\times`, không `\left` `\right`.
- **LaTeX trong script sinh tệp:** tránh để `\n`, `\t` thành ký tự điều khiển (viết `\\to`, `\\text`, `\\neq`…); sau khi xong chạy `node kho-rules/dai/lo/k11/sach-gioi-han/quet-loi-latex.mjs <tệp soạn>` KHÔNG áp dụng cho `.soan.md` — thay vào đó đọc lại tệp `.md` và tìm `\t`/ký tự lạ bằng mắt (tệp `.md` viết bằng công cụ Write thì không gặp lỗi thoát).

## Đánh số PHẦN (chia khúc)
Đề cương chia thành các khúc theo trang cho nhiều trạm. Khúc `k` dùng số PHẦN trong dải `10k+1 … 10k+9` (khúc 1: 11–19; khúc 2: 21–29; …). Mỗi vùng in riêng trên đề (một mục Phần I / Phần II / một chương / một đề minh hoạ) = MỘT PHẦN riêng, **tên PHẦN ghi như đề in** (kèm tiền tố chương / đề nếu cần), `dạng thức` = trắc nghiệm | đúng sai | trả lời ngắn | tự luận theo mục đó. Câu loại khác dạng thức PHẦN vẫn cho phép (khai `loai=` đúng theo từng câu). Nhãn câu = nhãn in, duy nhất trong PHẦN; đề in trùng / sai số ⇒ đánh lại + Ghi chú.
Chỉ làm CÂU có số câu in BẮT ĐẦU trên các trang của khúc bạn (kể cả đuôi chảy sang trang kế — xem ảnh trang sau để lấy nốt); đầu trang đầu của bạn có thể là đuôi câu trang trước — BỎ qua.
Tệp bạn tạo: `Repo\kho-rules\dai\lo\k11\de-cuong\<MA>.p<k>.soan.md`; tên hình `de_P<phần>C<số>.png` / `giai_P<phần>C<số>.png` (vẽ bằng code theo brief §4 cho câu hình KG tự luận cần hình giải).
Tự kiểm: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k11/de-cuong/<MA>.p<k>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem` tới khi "✔ đạt". Dùng thư mục scratchpad RIÊNG (tên có `<MA>-p<k>`), vì scratchpad dùng chung.
