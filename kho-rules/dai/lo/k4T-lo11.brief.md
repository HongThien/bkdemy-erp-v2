# Brief giao Sonnet soạn — 4T lô 11 (bài có HÌNH trong đề), 08/10

> Lưu lại nguyên văn brief đã giao (kho-rules/README.md §4 việc #5: brief soạn phải nằm trong repo để lô sau dùng lại).
> `<NHÓM>` = A / B / C; `<IN>` = tệp đầu vào của nhóm; `<RA>` = tệp kết quả.

---

Bạn là trạm SOẠN lời giải cho kho Toán lớp 4 (sách "Toán arc 4 quyển 1"). Bạn chỉ soạn ra MỘT tệp JSON; KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo.

**Đọc trước (bắt buộc):** `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\k4T.md` mục §0, §1, §1.5, §2, §3, §4 (luật trình bày khối 4T, bản v1 CEO đã duyệt). Mục §5 (gán dạng) KHÔNG cần.

**Đầu vào:** `<IN>` — mỗi phần tử là một bài: `ma_bai`, `hinh_de` (đường dẫn PNG — **HÌNH CỦA ĐỀ, phải mở xem bằng Read**), `de_ca_bai`, `cau_can_soan` (danh sách câu bạn phải soạn: `ma_nguon` + `de`), có thể có `loi_giai_sach` (lời giải mẫu của sách — dùng làm chuẩn).

**Điểm khác các lô trước: dữ kiện nằm trong HÌNH.** Đề chữ không đủ — học sinh nhìn hình mới làm được.
1. Mở `hinh_de` của từng bài, đọc kỹ: đếm số ô / số biểu tượng / số đo / chiều cao cột (đếm số khoảng kẻ) / vị trí điểm trên lưới / hình có mấy góc, mấy cạnh…
2. **Phần 2 phải ghi ra các số đọc từ hình** trước khi tính (vd "Quan sát biểu đồ, số quyển vở của các lớp 4A, 4B, 4C, 4D, 4E, 4F lần lượt là: …"; "Hàng … có … hình tròn"). Người đọc lời giải không cần nhìn hình vẫn theo được.
3. Phần 1 nói **cách đọc hình** (đếm gì, nhìn vào đâu, bẫy khi đọc hình) + mấu chốt.
4. Hình mờ / không chắc đọc đúng ⇒ vẫn soạn theo cách đọc của bạn nhưng ghi rõ vào `ghi_chu_nghi` (đọc thế nào, chỗ nào không chắc). Đề hiểu được nhiều cách ⇒ chọn một cách, ghi `ghi_chu_nghi`. KHÔNG im lặng chọn.

**Kiến thức lớp 4 thôi** (k4T.md §1). Riêng lô này hay vấp:
- Diện tích hình tam giác (công thức lớp 5) ⇒ KHÔNG dùng. Phần tam giác vuông trên lưới = **một nửa hình chữ nhật (một nửa ô vuông)** chia theo đường chéo; hình ghép ⇒ chia thành các hình chữ nhật / lấy hình lớn trừ phần bỏ đi.
- Vận tốc (lớp 5) ⇒ KHÔNG dùng công thức $v=s:t$; lập luận "trong $1$ giờ đi được…" hoặc "trong $\dfrac{1}{10}$ giờ, nếu chạy đúng tốc độ tối đa thì đi được…".
- Hình học lớp 4 được dùng: góc nhọn / vuông / tù / bẹt, đo góc bằng thước đo góc (độ), hai đường thẳng vuông góc / song song, hình bình hành, hình thoi (4 cạnh bằng nhau), khối hộp chữ nhật / lập phương.
- Không dùng `⇒ ⇔ ∈ ≤ ≥` trong lời giải, không đặt ẩn $x$ chuyển vế, không "ước/bội".

**Khuôn lời giải** (giống hệt các lô trước):
```
**Phần 1. Hướng dẫn**

Mấu chốt: …

…

**Phần 2. Trình bày**

Bài giải

<câu lời giải>: <phép tính> (<đơn vị>)

…

Đáp số: …
```
- Mỗi câu lời giải / mỗi phép tính MỘT dòng, các dòng cách nhau bằng một dòng trống. Công thức trong `$…$`, nhân `\times`, chia `:`, phân số `\dfrac{a}{b}`, đơn vị diện tích `($cm^2$)`.
- Bài trắc nghiệm của phiếu cuối tuần (PCT … I.x) vẫn đủ 2 phần như bài tự luận.
- Bài lập luận / đọc hình (đếm góc, gọi tên cạnh): Phần 2 = lập luận ngắn + kết luận ("Vậy …").
- Câu tách theo ý (vd `LT 15.5a`): đề là câu dẫn + đúng ý đó; mỗi câu một lời giải đủ 2 phần, không nhắc "ý a/ý b".

**Định dạng `dap_an`** (máy so đáp số — ghi gọn, đúng câu hỏi, có đơn vị nếu có):
- số kèm đơn vị: `$350$ g`, `$117$ $cm^2$`, `$27$ quả`; nhiều đại lượng: `Chu vi: $…$ cm; Diện tích: $…$ $cm^2$`; nhiều ý gộp: `a) …; b) …; c) …`
  *(ví dụ số ở đây KHÔNG phải đáp số của lô này — tự giải)*
- câu hỏi Có/Không: bắt đầu bằng `Có` hoặc `Không` rồi lý do ngắn
- câu hỏi "loại nào": tên loại, nếu tính được số lượng thì ghi số trong ngoặc, vd `Xe … ($… chiếc)`
- điền số vào hình: liệt kê số ở các ô đỉnh theo thứ tự tăng dần cách nhau `; ` rồi số ở các ô giữa cạnh
- gọi tên cạnh: dùng tên cạnh theo đúng thứ tự chữ cái đi vòng quanh hình như trên hình (vd hình EGHI thì các cạnh là EG, GH, HI, IE)
- câu hỏi "bao nhiêu cạnh, bao nhiêu góc": `… cạnh; … góc`

**Đầu ra:** ghi tệp `<RA>` = mảng JSON `[{ "ma_nguon": "...", "dap_an": "...", "loi_giai": "...", "ghi_chu_nghi": "..." (nếu có) }]`, đủ mọi `ma_nguon` trong `cau_can_soan`, đúng thứ tự. Dùng JSON hợp lệ (xuống dòng trong chuỗi là `\n`). Không cần sơ đồ đoạn thẳng cho lô này.

**Tự kiểm trước khi xong:** thay ngược đáp số vào đề + đối chiếu lại với hình (đếm lại lần hai). Báo cáo cuối: số câu đã soạn, câu nào có `ghi_chu_nghi`.
