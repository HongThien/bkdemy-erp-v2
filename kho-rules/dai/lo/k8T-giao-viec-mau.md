# Mẫu lời giao việc cho một agent chép–soạn (khối 8T) — điền 6 chỗ trong ngoặc nhọn

Đọc tệp brief này TRƯỚC và làm đúng theo nó (khuôn tệp ở §5 là bắt buộc, máy sẽ đọc): C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\k8T-brief-chep-soan.md
Tệp mẫu của một lô đã qua mọi cổng (xem 2–3 khối đầu để thấy khuôn + nhịp viết, không cần đọc hết): C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\k8T\NDT-D1-s5.cs.md

Đoạn sách của bạn:
- Sách: <tên sách>. <phần / chương / §> — khoảng bài <a> đến bài <b> (theo tiêu đề mục trên trang, không theo số tôi ước).
- Ảnh trang (150 dpi): <thư mục>\p-0NN.png … (tìm tiêu đề mục ở trang đầu; dừng khi gặp tiêu đề mục kế). Trang PDF = số trong tên tệp.
- Khu: `<khu>` ⇒ mã câu dạng `<khu>.<số bài><ý>@p<trang PDF nơi ĐỀ bắt đầu>` (số trang không thêm số 0 ở đầu).
- Tệp phải viết: C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\k8T\<tên>.cs.md

Lưu ý chung:
1. Sách ghi lời giải ngay sau từng bài dưới nhãn "Giải"; bài cơ bản thường chỉ ghi kết quả — soạn lời giải đủ 2 phần cho TỪNG câu. Không bỏ sót ý nào (đếm lại số ý từng bài trước khi kết thúc).
2. Ghi đúng `tang` theo tiêu đề tầng in trong sách: "Bài tập cơ bản" ⇒ co_ban · "Bài tập nâng cao" ⇒ nang_cao · "Bài thi chọn học sinh giỏi toán" ⇒ hsg · "Ôn tập" ⇒ on_tap.
3. Trong `dap_an` và trong dòng `kiem`, phân số viết ĐỦ ngoặc nhọn: `\dfrac{5}{2}`.
4. Đề sách có vẻ thiếu điều kiện / sai ⇒ vẫn chép đúng như in và ghi `ghi_chu_nghi` thật cụ thể (kèm phản ví dụ nếu có); đừng tự thêm điều kiện vào đề. Kết quả sách sai ⇒ `ket_qua_sach` chép đúng cái sách in, `dap_an` ghi kết quả đúng.
5. (lô 3) **Không tự đặt lại lời đề.** Đề hỏi gộp cho nhiều biểu thức ("biểu thức nào trong các biểu thức sau…", "so sánh…") là MỘT câu — giữ nguyên, không tách rồi viết lời đề mới cho từng ý.
6. (lô 3) Tách ý xong, đọc lại lời giải TỪNG ý: không được còn "theo câu a)", "tương tự ý trên" trỏ sang một ý đã thành câu khác — mỗi câu phải tự đủ. Ý sau thật sự cần kết quả ý trước ⇒ giữ cả bài thành một câu.
7. (lô 3) Sách ghi "Tương tự a)" / "HD: …" vẫn là CÓ lời giải ⇒ `muc_loi_giai_sach: tat` (không phải `khong` — `khong` làm cổng bỏ câu).
8. (lô 3) Trong công thức không dùng `\text{…}` chứa chữ tiếng Việt có dấu (KaTeX của cổng từ chối) — viết lời ra ngoài dấu `$`.
9. (lô 4) Mục **Chú ý** là lời dặn cho HỌC SINH (bẫy hay gặp, điều kiện dễ quên) — không viết nhận xét về sách ("sách in sai…", "sách giải theo…") vào lời giải; chuyện của sách ghi ở `ghi_chu_nghi`.
10. (lô 4) Số liệu đề làm bài không có đáp số (lời giải của sách chỉ đúng với số liệu khác) ⇒ vẫn chép đề đúng như in, `ghi_chu_nghi` nêu rõ số liệu nào thì khớp lời giải sách; ĐỪNG soạn lời giải kiểu "bài toán không có đáp số" — người soát sẽ đưa CEO quyết.
11. (lô 5) Đề có lời dẫn chung + nhiều ý mà giữ thành MỘT câu ⇒ mỗi ý xuống một đoạn riêng (dòng trống giữa các ý), không viết liền "a) …; b) …; c) …" trên một dòng.
12. (lô 5) Đề gốc là HÌNH (trục số, sơ đồ) ⇒ mô tả hình bằng lời thật chính xác trong đề và ghi `ghi_chu_nghi: đề gốc là hình …` để người soát biết câu này chưa có hình.
13. (lô 6) Số trang trong mã câu (`@pNNN`), ở dòng `trang:` và trong mọi ghi chú là **trang PDF** (số của tệp ảnh `p-NNN.png`), không phải số in ở chân trang sách (lệch nhau 1 ở quyển NĐT).
14. (lô 6) Bài cuối của khu được giao mà lời giải (hoặc các ý còn lại) tràn sang trang không có ảnh ⇒ KHÔNG tự soạn rồi để `muc_loi_giai_sach: khong`; báo ngay trong báo cáo "thiếu ảnh trang N" để người giao dựng thêm trang. (Người giao: trước khi giao, dựng dư một trang sau trang cuối của khu.)
15. (lô 7) Phần "đề rèn luyện / đề thi" của một quyển: chỉ chép bài của nhánh được giao (Đại hay Hình); ý nào trùng đề đã có trong tệp `<lô trước>.de.json` thì không chép và ghi cặp mã trùng vào báo cáo. Bài gộp hai ý mà MỘT ý trùng ⇒ vẫn chép cả bài, ghi `ghi_chu_nghi` — người soát cắt ý trùng.
16. (lô 7) Trạm chép KHÔNG tự sửa đề theo lời giải rồi im lặng: sửa thì `ghi_chu_nghi` phải nêu nguyên văn chỗ sách in và lí do (người soát sẽ mở ảnh — lô 7 phát hiện thêm một chỗ trạm không báo: Đề 2 bài 2a, dấu "=" in nhầm cho dấu "+").

## Riêng quyển TVA (Bồi dưỡng HSG Toán Đại số 8 — Trần Thị Vân Anh) — quy ước đặt ở lô 8 (10/10)

Sách chia 10 chuyên đề "§"; mỗi § gồm **Các ví dụ minh họa** (có lời giải đủ, thường chia theo "Dạng k", số ví dụ đánh LẠI từ 1 trong mỗi dạng) → **Bài tập vận dụng** (đánh số liên tục trong §) → **Hướng dẫn và đáp số** ở cuối § (đánh theo số bài tập). Tên sách ghi vào kho: `BD HSG Toán 8 Đại số – Trần Thị Vân Anh`. Ảnh: `C:\Users\WBPC\bk-kho-lam-viec\sach\8T\TVA\trang\p-NNN.png` (150 dpi).

- **Khu và mã câu** (khoá tự nhiên — số ví dụ lặp lại giữa các dạng nên dạng phải nằm trong khu):
  - bài tập vận dụng của §n: khu `T<n>B` ⇒ `T1B.5a@p12`;
  - ví dụ của § không chia dạng: khu `T<n>V` ⇒ `T1V.3@p7`; ví dụ của Dạng k: khu `T<n>V<k>` ⇒ `T2V3.1a@p19`; dạng chia nhóm a./b./c. mà mỗi nhóm đánh lại số ví dụ: `T2V4b.1@p21`;
  - ý đánh bằng SỐ (1., 2., 3.…) thay cho chữ ⇒ viết `n<số>` sau số bài: `T1B.1n3@p12` (dòng `y: 3`); ý chữ trong ý chữ như cũ (`a1`, `b2`).
  - `@p` = trang PDF nơi ĐỀ được in (với bài tập: trang của phần "Bài tập vận dụng", không phải trang hướng dẫn).
- **Tầng:** sách không có tầng "cơ bản" ⇒ mọi câu ghi `tang: nang_cao`; nhóm do hai lượt gán quyết định.
- **Ví dụ là câu:** mỗi ví dụ (mỗi ý độc lập của ví dụ) là một câu như bài tập; `## SACH` chép lời giải của ví dụ — có nhiều "Cách" thì chép đủ. Lời "Nhận xét" của sách sau ví dụ: chép vào cuối `## SACH` sau dòng `Nhận xét:`.
- **Bài tập:** `## SACH` chép từ "Hướng dẫn và đáp số". Chỉ có đáp số ⇒ `muc_loi_giai_sach: dap_so`; "Tương tự bài …" / một dòng gợi ý ⇒ `tat`; giải từng bước ⇒ `du`. Bài KHÔNG có trong phần hướng dẫn (và các "bài tập tự giải" không đáp số ở §5, §10) ⇒ KHÔNG chép, ghi vào báo cáo.
- **Mép trái trang bị mất 1–2 chữ cái** (và logo che góc dưới trái): chữ thường thì tự bù theo ngữ cảnh; nếu chỗ mất là một phần CÔNG THỨC (vd ý "a) x − 2" chỉ còn ": − 2") thì dựng lại theo lời giải / hướng dẫn và ghi `ghi_chu_nghi: mép trang mất …, dựng lại theo …`. Không dựng lại được ⇒ không chép câu đó, báo.
- **Thiếu trang sách 32–33** (trong §2): bài mất đề hoặc mất lời giải ⇒ không chép, báo.
- **Trùng với quyển NĐT đã nhập:** không cần tự dò — máy lọc trùng và người soát sẽ làm; cứ chép đủ.
