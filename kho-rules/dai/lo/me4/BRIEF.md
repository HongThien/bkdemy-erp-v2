# BRIEF — nhập sách "250 bài toán chọn lọc lớp 4" (ME, TKBooks) vào kho 4T

Việc của MỘT trạm = MỘT hoặc nhiều chuyên đề (CĐ) của sách. Làm TUẦN TỰ từng CĐ, xong CĐ nào ghi đủ tệp của CĐ đó rồi mới sang CĐ kế.
**Không đụng DB, không git commit, không sửa tệp ngoài thư mục `kho-rules/dai/lo/me4/`** (và thư mục tạm của bạn). Chỉ ĐỌC repo.

## 0. Nguồn và luật
- PDF ảnh quét (không có lớp chữ): `E:\BK ACADEMY\Tài liệu tham khảo\4T\Sách lớp 4 ME.pdf` (220 trang). **Số trang PDF = số trang in − 2** (trang in 7 = PDF 5). Phần ĐỀ = PDF 5–94 (mỗi CĐ: A. Lý thuyết + Ví dụ, rồi **B. Bài tập vận dụng** ở 2–4 trang cuối CĐ). Phần HƯỚNG DẪN GIẢI CHI TIẾT = PDF 96–220, cùng thứ tự CĐ, cùng số bài.
- Ảnh tham khảo đã dựng sẵn để bạn tìm trang: `C:\Users\WBPC\AppData\Local\Temp\claude\ad0c1492ee4a551d\80a92663-bb93-431f-881d-f13159a51e51\scratchpad\sheet0*.png` (trang đề, 12 trang/ảnh, bắt đầu PDF 5) và `...\scratchpad\dasheet0*.png` (trang hướng dẫn, 15 trang/ảnh, bắt đầu PDF 91). Trang in đề CĐ bắt đầu: CĐ1 tr.7 · CĐ2 11 · CĐ3 17 · CĐ4 20 · CĐ5 25 · CĐ6 30 · CĐ7 35 · CĐ8 41 · CĐ9 45 · CĐ10 51 · CĐ11 66 · CĐ12 73 · CĐ13 78 · CĐ14 81 · CĐ15 86. Trang hướng dẫn: tự tìm (mở các ảnh `dasheet*` rồi phóng to).
- Dựng trang để ĐỌC: `pdftoppm -f <p> -l <p> -r 100 -png "<pdf>" <tạm>/p` rồi Read ảnh. Chữ nhỏ / chồng nét ⇒ `-r 160` hoặc cắt vùng (`-x -y -W -H`). **Ảnh là nguồn chính (spec §A11)**; không đoán chữ bị che / rách — xem §5.
- Luật chung: đọc `spec-giai-bai.md` các mục **A5, A7, A8, A11, A14, A18** và toàn bộ mục **"Khối 4T"** (dòng ~556–685) MỘT lần trước khi viết. Bản cắt sẵn (cùng nội dung, 114 KB): `…\scratchpad\luat4T.md`. Danh sách dạng của bản đồ 4T: `kho-rules/dai/lo/me4/ban-do-4t.txt`.
- Mẫu tham khảo (cùng khuôn đầu ra): `kho-rules/dai/lo/k4T-lo6A.soan.json` (soạn) và `k4T-lo6A.json` (lô), bộ kiểm `kho-rules/dai/lo/k4T-kiem.mjs`.

## 1. Thùy đã chốt 21/11 (ĐÂY LÀ LUẬT)
1. **GHÉP, KHÔNG GIẢI LẠI.** Mỗi `Bài n` ở phần B ghép với lời giải `Bài n` ở phần Hướng dẫn. `dap_an` lấy từ sách. Phần 2 = lời giải của sách chuẩn hoá về khuôn kho, **không đổi phép tính, không đổi đáp số**. Phần 1 (card) viết từ chính ý tưởng trong lời giải sách / khung "Phân tích", không thêm phương pháp mới.
2. **MỘT cách**: sách có "Cách 1 / Cách 2" ⇒ Phần 2 chỉ ghi cách NGẮN hơn (dùng công cụ lớp 4). Không viết "(sách còn cách khác)".
3. **Cấm dấu "→"** (và `⇒ ⇔ ∈ ≤ ≥ ↪ ➤ ▶ ▸` làm ký hiệu lập luận): viết chữ "nên", "suy ra", "số còn lại là". Mỗi ý một dòng. Bài tìm số / lập luận kết bằng "Vậy …", bài lời văn kết bằng "Đáp số: …".
4. **Công việc chung (CĐ15)**: quy về SỐ PHẦN BẰNG NHAU (mốc = bội chung nhỏ nhất các thời gian), KHÔNG chia cho phân số. Phần 1 được nhắc "trong 1 giờ làm được 1/4 công việc" để giải thích.
5. **Đáp số xoá chữ số**: bỏ số 0 đứng đầu (sách ghi "01111111 hay 1111111" ⇒ `dap_an` = `$1111111$`, thêm một câu ở Phần 1 `**Chú ý:**` nói nếu giữ 0 ở đầu thì viết 01111111 nhưng đó không phải cách viết số tự nhiên). Lời giải xoá chữ số trong sách dùng GẠCH CHÉO ⇒ viết bằng chữ: "Xoá các chữ số 2; 4; 6. Số còn lại là 682022."
6. Bảng CẤM tiểu học của 4T (mục Khối 4T): không tự đặt ẩn x rồi chuyển vế (ngoại lệ: ẩn là chữ số a, b, c; và bài "tìm x" mà ĐỀ có chữ x); không số thập phân / âm / công thức tổ hợp…

## 2. Đầu ra mỗi CĐ (đặt trong `kho-rules/dai/lo/me4/`, `NN` = 01…15)
Viết tệp có LaTeX bằng công cụ **Write** (không heredoc, không `node -e`, không chuỗi JS — spec §A5).

1. `ME4-CDNN.bai.json` — ĐỀ (cùng khuôn `tach-bai.mjs`): mảng
   `{ "ma": "CĐ2 · B8a", "khu": "CĐ2", "so": 8, "y": "a" | null, "de_chung": "<câu dẫn nếu bài nhiều ý>" | "", "noi_dung": "<đề đủ để đứng một mình>", "anh": [] }`
   - Mã bài **đúng ký tự**: `CĐ<n> · B<m>` hoặc `CĐ<n> · B<m><ý>` (dấu chấm giữa "·" có khoảng trắng hai bên).
   - Bài nhiều ý: ghi MỘT bản ghi cả bài (`y: null`, `noi_dung` = cả đề) + MỘT bản ghi mỗi ý (`noi_dung` = câu dẫn + ý).
   - Chép nguyên văn từng chữ/số/ký hiệu của ảnh. Công thức bọc `$…$`; số viết bằng chữ `$\overline{abc}$`; phân số `\dfrac{a}{b}`; nhân `\times`; chia `:`. Ô trống `…`.
   - Bài có HÌNH trong ĐỀ (sơ đồ, bảng ô, lưới, hình vẽ): ghi `"anh": ["<mô tả ngắn>"]` và KHÔNG đưa vào soạn (xem §5 — hoãn). Bảng số thuần chữ (vd 4 cột) mà chép được thành chữ thì không tính là hình.
2. `ME4-CDNN.soan.json` — mảng theo khuôn `lo-tu-soan.mjs`:
   `{ "ma_nguon": "CĐ2 · B8a", "gop_y": false, "dap_an": "$24$ số", "loi_giai": "**Phần 1. Hướng dẫn**\n\n…\n\n**Phần 2. Trình bày**\n\n…", "so_do_mo_ta": null, "ghi_chu_nghi": null }`
   - **Tách ý theo §A7**: ý độc lập ⇒ mỗi ý một câu (`ma_nguon` = mã ý); ý phụ thuộc kết quả ý trước ⇒ một câu chung (`ma_nguon` = mã bài, `gop_y: true`, Phần 2 ghi a) b) …).
   - `dap_an`: một số / một biểu thức bọc `$…$`, kèm đơn vị nếu sách có ("$24$ số", "$12$ giờ"); nhiều số ngăn bằng ` ; ` ("$45$ học sinh nam ; $27$ học sinh nữ"). Bài lập luận không có một kết quả gọn: `dap_an` ghi kết luận ngắn ("Không") — nếu thật không có thì KHÔNG đưa vào soạn, ghi hoãn.
   - `loi_giai`: đúng khuôn A5/A18: **Phần 1 dạng card** (`**Mấu chốt:**` một câu · 3–6 `**Bước k.**` mỗi bước một ý trọn có động từ · `**Chú ý:**` nếu có; KHÔNG lộ đáp số cuối ở bất kỳ đoạn nào) rồi **Phần 2 Trình bày** (bài lời văn mở bằng `Bài giải`; bài tính / tìm số mở bằng dòng chép lại đề; các đoạn cách nhau MỘT dòng trống). Không emoji, không bảng Markdown, không in nghiêng `*…*`.
   - `so_do_mo_ta`: bài tổng–hiệu / tổng–tỉ / hiệu–tỉ / tuổi / hai hiệu số… mà sách có sơ đồ đoạn thẳng ⇒ nếu mô tả được bằng lược đồ của `scripts/kho/so-do-doan-thang.mjs` (đọc phần đầu tệp) thì điền `so_do_mo_ta` và Phần 2 có dòng `Ta có sơ đồ:`; **tự thử** `import { veSoDo } from '../../../../scripts/kho/so-do-doan-thang.mjs'` (máy từ chối khi số lệch thì sửa mô tả, không ép). Không mô tả được ⇒ `so_do_mo_ta: null` và thêm trường `"thieu_so_do": true` (lời giải không được nhắc tới sơ đồ).
   - `ghi_chu_nghi`: chỉ khi CÓ nghi ngờ thật (đọc không chắc, sách có vẻ in sai). Chuỗi mô tả. Câu có chữ "**Chưa chắc:**" cũng thuộc loại này. Nghi ⇒ câu về hàng duyệt trưởng khối, nên đừng lạm dụng; đọc chắc thì để `null`.
3. `me4-kiem-cdNN.mjs` — **MÁY KIỂM ĐÁP SỐ BẰNG CODE**: `export const KIEM_CDNN = { 'CĐ2 · B8a': () => [<giá trị đáp số máy TỰ TÍNH TỪ ĐỀ>], … }` (vét cạn / thay ngược / mô phỏng; **KHÔNG chép các bước lời giải sách, không chép đáp án sách**). Trả mảng giá trị phải có mặt trong `dap_an` (so sau chuẩn hoá: bỏ `$`, khoảng trắng; `\dfrac{a}{b}` → a/b — xem `chuanDapAn` cuối `k4T-kiem.mjs`; mảng nhiều số khi đáp án nhiều số). Tự định nghĩa hàm phụ trong tệp (tìm, ước chung, đếm…). Bài chứng minh / giải thích không có kết quả số ⇒ không viết hàm, ghi trong ghi-chú "không kiểm bằng máy được".
4. `ME4-CDNN.dang.json` — `{ "CĐ2 · B8a": { "dang": "NDBxxxxx", "chac": "cao" | "vua", "ly_do": "<một dòng>" }, … }` cho MỌI câu trong soạn. Chọn dạng từ `ban-do-4t.txt` (có 177 dạng, trong đó 74 dạng mới thêm 21/11 chuẩn bị cho chính sách này: xem tên + mô tả). Đề xuất dạng nào đúng nhất; không có dạng nào khớp ⇒ `"dang": "—"` và nói rõ trong ghi-chú. `cao` chỉ khi chắc dạng đó là dạng DUY NHẤT hợp lý.
5. `ME4-CDNN.ghi-chu.md` — gồm: (a) số bài / số câu soạn; (b) **HOÃN** (bài/ý không đưa vào soạn) mỗi dòng kèm lý do: có hình đề · trang rách/che không đọc được đáp án · đáp án sách không đọc được · bài không có đáp số gọn; (c) chỗ sách có vẻ in sai / đề–đáp án lệch nhau (nguyên văn + vì sao); (d) bài đã dùng `thieu_so_do`; (e) bài không có hàm kiểm máy; (f) kết quả chạy kiểm + lô (xem §3).

## 3. Chạy kiểm (tại thư mục gốc repo `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`)
1. Dựng lô (kiểm khuôn 2 phần, KaTeX, sơ đồ):
   `node scripts/kho/sach/lo-tu-soan.mjs kho-rules/dai/lo/me4/ME4-CDNN.soan.json kho-rules/dai/lo/me4/ME4-CDNN.bai.json --khoi 4T --lo 12 --ra kho-rules/dai/lo/me4/ME4-CDNN.lo.json --so-do-dir <thư mục tạm của bạn>`
   Lỗi báo từng câu ⇒ sửa tệp soạn / đề rồi chạy lại cho tới khi sạch (câu bị báo lỗi sẽ không có trong lô).
2. Chạy máy kiểm lên lô:
   `node -e "import('./kho-rules/dai/lo/me4/me4-kiem.mjs').then(async m=>{const lo=JSON.parse((await import('node:fs')).readFileSync('kho-rules/dai/lo/me4/ME4-CDNN.lo.json','utf8'));for(const c of lo){const r=m.kiemDapSo(c.ma_nguon,c.dap_an);if(r.ket_qua!=='dat')console.log(c.ma_nguon,r.ket_qua,r.ghi_chu)}})"`
   (`khong_kiem_duoc` là bình thường với bài không có hàm; **`khong_dat` phải xử lý**).
3. `khong_dat` ⇒ KHÔNG sửa im lặng đáp án cho khớp máy, cũng không sửa hàm cho khớp sách. Làm lần lượt: đọc lại ảnh đề (có đọc sai số không?) → đọc lại ảnh đáp án → xem hàm kiểm có hiểu sai đề không. Sau khi rà mà vẫn lệch ⇒ để nguyên `dap_an` theo sách, đặt `ghi_chu_nghi` ("máy tính ra …, sách ghi …"), ghi vào ghi-chu mục (c). Sách in sai thật thì cũng ghi nguyên văn.
4. Chạy lại bước 1–2 cuối cùng và dán kết quả vào ghi-chu (f).

## 4. Bẫy đã biết
- Ảnh quét: trang nghiêng, nhàu, rách (vd hướng dẫn CĐ1 Bài 9–10, PDF 101–102: chữ bị che). Đáp án chỉ đọc được từng phần ⇒ xem §5.
- CĐ1 B9–B10 đáp án "01111111 hay 1111111"; lời giải xoá chữ số dùng gạch chéo (xem §1.5).
- Đề và hướng dẫn tách xa nhau: dò theo SỐ BÀI + CĐ, không theo vị trí trang. Có bài nhiều ý mà ý c, d chỉ nằm ở hướng dẫn — đếm ý theo ĐỀ.
- Ví dụ trong phần Lý thuyết (có "Phân tích" / "Hướng dẫn") KHÔNG phải bài tập, không tạo câu.
- Có bài trích đề thi (vd CĐ15 B6 "THCS Amsterdam 2013"): giữ câu, bỏ tên trường khỏi nội dung câu.
- Hình ngay trong lời giải (sơ đồ minh hoạ của sách) không chép; viết lời giải bằng chữ + phép tính.

## 5. Thà bỏ trống còn hơn đánh sai (CLAUDE.md §1.5)
Trang quét rách / chữ không đọc chắc / đáp án sách không đọc được ⇒ KHÔNG ghi bài đó (hoặc ý đó) vào soạn; liệt kê vào ghi-chu (b) HOÃN kèm trang PDF. Không bịa lời giải thay phần mất. Bài có hình trong ĐỀ ⇒ HOÃN (hình đề đi đường riêng).

## 6. Báo cáo cuối của bạn (trả cho điều phối, ≤ 25 dòng)
Mỗi CĐ: số bài tập thấy trong đề · số câu đưa vào lô (sau tách ý) · số HOÃN (+ lý do chính) · số câu `khong_dat` còn lại (ghi mã) · số câu `khong_kiem_duoc` · số `ghi_chu_nghi` · số `thieu_so_do`. Kèm các chỗ sách in sai. KHÔNG dán lại nội dung tệp.
