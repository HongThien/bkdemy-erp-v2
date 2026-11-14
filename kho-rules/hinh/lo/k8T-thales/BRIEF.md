# BRIEF — lô Hình–Học 8T đầu tiên: chuyên đề "Định lí Thalès" (Thalès · đường trung bình · …) từ sách HSG (Thùy 14/11)

Mày là một trong 9 trạm (G1…G9). Nhóm + danh sách bài của mày ở cuối lời giao việc.
Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<TH>` = `C:\Users\WBPC\AppData\Local\Temp\claude\0ce3df5438caf103\cf0b21d3-a89a-437b-ae80-9b607bdf58bb\scratchpad\h8t`.
**KHÔNG ghi DB, KHÔNG sửa file nào trong repo** — chỉ ghi file nháp + ảnh dưới `<TH>`. Một khẳng định sai trong lời giải là lỗi nặng; không chắc ⇒ ghi `**nghi_van:**`, KHÔNG bịa.

Thùy giao (nguyên văn): *"Chia dạng · Giải bài hoặc khớp bài giải nếu có sẵn, nhưng cần giải xịn · Vẽ lại hình 100% vì các bài này bị lởm · Ưu tiên chủ đề Thalès, đường trung bình trước vì hôm nay học."*

## 1. Nguồn = ảnh trang sách scan (150 dpi). Dùng Read tool xem ảnh.
- NĐT (`CĐ BD HSG Toán 8 – Nguyễn Đức Tấn`): `C:\Users\WBPC\bk-kho-lam-viec\sach\8T\NDT\trang\p-NNN.png` (NNN = số trang PDF, 3 chữ số). Lời giải nằm NGAY SAU từng bài, đủ bước. Sách chia 3 tầng "Bài tập cơ bản / nâng cao / thi HSG" — ghi lại tầng.
- TCHH (`Tuyển chọn các chuyên đề BD HSG Toán 8 – Hình học – Trần Quang Hùng`): `C:\Users\WBPC\bk-kho-lam-viec\sach\8T\TCHH\trang\p-NNN.png` (PDF 190–204 = chuyên đề 5 "Định lí Thales và các bài toán về tam giác đồng dạng"; Bài 1–17 có "Giải"; 10 bài tự luyện trang 204 KHÔNG có lời giải ⇒ KHÔNG làm).
- Trang ghi trong lời giao là ƯỚC — tìm đúng bài theo nhãn số trên ảnh, xem cả trang trước/sau (lời giải có thể vắt trang).
- Hình trong sách CHỈ để hiểu cấu hình. **Mọi hình đều vẽ lại bằng code** (Thùy: hình sách "lởm").

## 2. ⭐ CHIA DẠNG — bài nào vào đâu (bản đồ Hình–Học 8T vừa chốt, thứ tự học)
Chuyên đề **Định lí Thalès** (tất cả kiến thức TRƯỚC đồng dạng), theo thứ tự học:
1. `HH00127` **Định lí Thalès (thuận, đảo, hệ quả)**
2. `HH00161` **Đường trung bình của tam giác, của hình thang**
3. `HH00128` **Tính chất đường phân giác**
4. `HH00162` **Bổ đề hình thang**
5. `HH00131` **Định lí Mê-nê-la-uýt, định lí Xê-va**
Sau đó mới tới chuyên đề Tam giác đồng dạng (`HH00129` ba trường hợp · `HH00163` tam giác vuông, hệ thức lượng · `HH00164` tỉ số đường cao/diện tích), rồi Đa giác và diện tích (`HH00165` đa giác · `HH00132` công thức diện tích · `HH00166` phương pháp diện tích), rồi Cực trị/quỹ tích/dựng hình (`HH00134/135/136`). Tứ giác (`HH00089`–`HH00094`) học TRƯỚC Thalès.

**Luật chia (CEO chốt):**
- Bài vào **bài (mã HH) của kiến thức đứng SAU CÙNG mà lời giải thật sự cần** ("dạng sau thắng"). Vd lời giải dùng Thalès + đường trung bình ⇒ `HH00161`; dùng phân giác ⇒ `HH00128`.
- **Chưa học đồng dạng và đã học đồng dạng là hai cách giải khác hẳn nhau.** Lời giải cho các bài 1–5 ở trên **CẤM dùng tam giác đồng dạng, hệ thức lượng, phương pháp diện tích** (chúng học sau). Lời giải cho `HH00127` còn CẤM đường trung bình, phân giác, Mê-nê-la-uýt; `HH00161` cấm phân giác, Mê-nê-la-uýt; … (cấm mọi thứ đứng sau bài đó).
- Được dùng tự do: mọi kiến thức Tứ giác (hình thang, hình thang cân, hình bình hành, chữ nhật, thoi, vuông, đối xứng), tam giác bằng nhau, tam giác cân/đều/vuông, Pythagore, tỉ lệ thức – dãy tỉ số bằng nhau, biến đổi đại số.
- **Giải xịn:** sách dùng đồng dạng mà có lời giải gọn, tự nhiên chỉ bằng Thalès (kẻ đường song song) ⇒ viết lời giải Thalès, bài ở lại chuyên đề này. Nếu lời giải không-đồng-dạng dài/gượng hơn hẳn ⇒ KHÔNG cố: đánh dấu `→ DE_SAU (HH00129…)` (chỉ chép đề + một dòng lý do, không giải) — lô sau làm.
- Bài nhiều ý: cả bài vào bài của ý cần kiến thức muộn nhất. Ý nào cần đồng dạng/diện tích (không né được) ⇒ cả bài `DE_SAU`.

## 3. Đọc trước (bắt buộc)
1. `<Repo>\kho-rules\dai\k8T.md` §0, §1 (luật kiến thức 8T — gọi tên công cụ + đủ điều kiện), §2 (lời giải 2 phần, **nhịp HSG**: gộp bước hiển nhiên, không chép quy tắc cơ bản, nhưng HS giỏi đọc không phải nháp thêm; Phần 1 phải trả lời "vì sao nghĩ ra", Bước 1 = đường phụ kẻ gì + vì dấu hiệu nào). Bỏ qua dòng "Hình không tách ý" (đã thay — xem §4 dưới).
2. `<Repo>\kho-rules\dai\k8.md` §1.6 (khuôn Hình 8: chứng minh ⇒ Phần 1 = SƠ ĐỒ PHÂN TÍCH ĐI LÊN; tính ⇒ Phần 1 lời) và mục "LUẬT TRÌNH BÀY HÌNH 7·8·9" ở cuối `<Repo>\docs\mau-brief-soan-hinh-hoc.md` (dòng ngắn ≈ nửa bề ngang; mọi bước có ngoặc `(gt)` / `(cmt)` / tên định lí đúng; KHÔNG dòng trống giữa các bước).
3. MẪU lời giải 2 phần đã duyệt cho bài nhiều ý: `<Repo>\kho-rules\hinh\lo\k8-thales\bai-nhieu-y\nhap_bai_y.mjs` (các mảng `loi_giai` của bài Varignon — chép nhịp, ký hiệu, cách ghi lý do).
4. `<Repo>\docs\log-giai-hinh-hoc-bai.md` (R1 sau dấu chấm xuống dòng; R2 xuống dòng đơn) và `<Repo>\spec-giai-bai-ai.md` (ý sau dùng lại kết quả ý trước; verify trước khi chốt).
5. Vẽ hình: `<Repo>\docs\mau-brief-ve-lai-hinh.md` (khung ≤ 520×400, ẩn số dùng `bien`/`angleBien`, tam giác vuông tại A ⇒ AB đứng, AC ngang) + `<Repo>\scripts\anh\ve_hinh_lib.mjs` + mẫu `<Repo>\scripts\anh\ve_hinh_hh101_102.mjs`.

## 4. Khuôn câu
- **Bài một yêu cầu** ⇒ một câu (`**loai:** don`).
- **Bài nhiều ý a), b), c)** ⇒ mô hình BÀI–Ý (Thùy 09/11): một **lời dẫn chung** (giả thiết + hình chung) + **mỗi ý là một câu riêng** có lời giải 2 phần RIÊNG. Ý sau cần kết quả ý trước ⇒ ghi `**da_biet:**` (vd `Biết $MNPQ$ là hình bình hành (ý a).`) và lời giải ý sau được dùng nó như giả thiết, ghi `(ý a)`. Điểm mới mà ý sau mới đặt ra (vd "Gọi $I$ là …" chỉ có ở ý c) thì nằm trong `cau_hoi` của ý đó. Hình đề vẽ ở mức BÀI (một hình chung); ý cần đường phụ riêng ⇒ `**hinh_lg:**` của ý đó.
- Câu **chứng minh**: `**Phần 1. Hướng dẫn**` = sơ đồ phân tích đi lên (dòng trên cùng = điều phải chứng minh; `$\Uparrow$ (lý do)`; điều có sẵn đánh ✓; `**Nhánh ①:**`…), `**Phần 2. Trình bày**` = theo sơ đồ chiều ngược lại, mỗi mũi tên một bước, cùng lý do. Có đường phụ ⇒ dòng đầu Phần 1 nói kẻ gì và vì sao.
- Câu **tính** (độ dài, tỉ số, góc): `loai_cau: tra_loi_ngan` + `dap_an`; Phần 1 = `**Mấu chốt:**` + 3–6 đoạn `**Bước k.**` + `**Chú ý:**`; Phần 2 = các dòng tính, mỗi dòng kèm lý do trong ngoặc, kết "Vậy …".
- Đề TỰ ĐỦ, không cần nhìn hình (mọi số đo ghi bằng chữ). Bỏ "(h.19)", "như hình vẽ". Dòng nguồn đề thi (vd "(Đề thi HSG Quận 1, 2001–2002)") GIỮ ở cuối đề. Sách in sai rõ ràng (lời giải sách và hình cùng chỉ ra bản đúng) ⇒ sửa và ghi `nghi_van`; mơ hồ ⇒ giữ, ghi `nghi_van`.
- Không viện dẫn sách ("bài 212", "ví dụ 3") — kết quả cần dùng phải chứng minh lại tại chỗ hoặc là định lí gọi được tên.
- Tên: "định lí Thalès", "định lí Thalès đảo", "hệ quả của định lí Thalès", "đường trung bình của tam giác/hình thang", "tính chất đường trung bình", "tính chất đường phân giác", "định lí Pythagore". Dấu nhân `\cdot`, phân số `\dfrac`, thập phân `3{,}5`, song song `\parallel`, góc `\widehat{ABC}`.

## 5. VẼ HÌNH (bắt buộc MỌI bài, kể cả bài chỉ có lời)
- Script `<TH>\ve_<G>.mjs` (tên chứa nhóm của mày), import `file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs`; chạy `node` từ `<TH>`; ra `<TH>\hinh_<G>\`. Tên file = nhãn bài, dấu chấm → gạch ngang: `NDT-H1-19.png`, `TCHH-5-12.png`; hình lời giải riêng `…_lg.png` / `…_b_lg.png`.
- Dựng ĐÚNG dữ kiện bằng toạ độ (trung điểm, song song, tỉ lệ cho trước…), tam giác LỆCH hẳn (không cân/gần cân trừ khi đề cho). KHÔNG vẽ sẵn đáp án / điều phải chứng minh (vd không gạch trung điểm cần chứng minh). Số đo cần tìm ghi `x`. Cao ≲ 450px, chừa ≥ 35px dưới nhãn đáy, nhãn không đè nét.
- Soát: `node C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\scripts\anh\bang_hinh.mjs <TH>\hinh_<G> <TH>\hinh_<G>\_bang.png` rồi Read `_bang.png`; sửa rồi vẽ lại.

## 6. VERIFY (không verify = chưa xong)
`<TH>\kiem_<G>.mjs` (viết bằng Write tool — không heredoc nội dung có LaTeX): dựng toạ độ số cho từng bài; kiểm TỪNG khẳng định của lời giải (song song, trung điểm, tỉ số, bằng nhau, thẳng hàng, đáp số). Điểm "bất kì" thử ≥ 2 bộ toạ độ. Đáp số tính lại từ toạ độ dựng đúng dữ kiện và so với `dap_an`.

## 7. ĐẦU RA — `<TH>\drafts\draft_<G>.md`, mỗi bài một khối, đúng thứ tự sách
```
### NDT-H1.19 → HH00161
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H1.19@p113 · tầng cơ bản
**sach:** <1–3 dòng: sách giải bằng gì (công cụ chính), có đường phụ gì>
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
<đề>
**loi_giai:**
<lời giải 2 phần>
**hinh:** NDT-H1-19.png
**nghi_van:** <trống nếu không có>
```
Bài nhiều ý:
```
### TCHH-5.13 → HH00161
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 13@p202
**sach:** …
**loai:** nhieu_y
**loi_dan:**
<giả thiết chung — KHÔNG chứa câu hỏi>
**hinh:** TCHH-5-13.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh …
**da_biet:**
**loi_giai:**
…
#### y b
**loai_cau:** tra_loi_ngan
**dap_an:** 6
**cau_hoi:** Tính …
**da_biet:** Biết … (ý a).
**loi_giai:**
…
**hinh_lg:** TCHH-5-13_b_lg.png
**nghi_van:** …
```
Bài để sau:
```
### TCHH-5.5 → DE_SAU (HH00163)
**nguon:** …
**noi_dung:** <đề>
**ly_do:** lời giải cần hai tam giác vuông đồng dạng; cách Thalès phải kẻ 3 đường phụ, dài hơn hẳn.
```
Cuối cùng báo ≤ 200 từ: bài xong (mỗi bài vào mã nào), bài `DE_SAU`, nghi vấn; đã chạy verify chưa (số phép kiểm, FAIL bao nhiêu), đã mở bảng hình chưa.
