# ⚠️⚠️ BẢN ÁP DỤNG BATCH B037 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 11 CỦA TRƯỜNG, TẢI TỪ TOANMATH (K11 đề cương cuối kì 2/5, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 11 (24/10, kèm `brief-cki.md` 28/10), đã đổi sẵn đường dẫn. Luật kiến thức K11, khuôn câu (TN · Đ/S · TLN · tự luận), khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B037-NN`. Danh sách đề cương: `Repo\kho-rules\dai\lo\toanmath\batch\B037\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach` (+ `bo_sach_can_cu`), `cau_truc` (ước số câu / đề), `de` / `hd` (trang ĐỀ / trang ĐÁP ÁN **trong file PDF gốc**).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B037\<MA>` (đã có `goc.pdf` = NGUYÊN file PDF, `trang\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`). Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ CƯƠNG = MỘT TỆP** (đề cương dài hay nhiều đề vẫn một tệp — KHÔNG chia khúc `.p<P>`): tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B037\<MA>.soan.md`. Bạn soạn CẢ đề cương, làm hết, không bỏ dở. **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới và **BỎ mục "Đánh số PHẦN (chia khúc)" của `brief-cki.md`**. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B037/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
- **Đầu tệp (đề cương — thay khuôn §3 bên dưới):**
  ```
  # ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 11 năm <năm học> — <don_vi>
  nam: <nam>
  bo_sach: <KNTT | Cánh Diều | CTST — theo ds-de.json, sửa nếu ảnh cho thấy khác>
  kieu: de_cuong
  ```
  Năm học viết `2024–2025` / `2025–2026` / `2026–2027` đúng như trang bìa trên ảnh; lệch `ds-de.json` thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo đúng cách đề cương chia, đánh số 1, 2, 3… LIÊN TỤC trong tệp:** đề cương gồm nhiều đề (ĐỀ SỐ 1–5, ĐỀ ÔN TẬP…) ⇒ mỗi đề × mỗi mục in (Phần I TN · Phần II Đ/S · Phần III TLN · Phần IV tự luận) là MỘT `## PHẦN n | Đề số k — Phần I Trắc nghiệm | trac_nghiem` (tên PHẦN ghi như đề in, kèm tiền tố đề / chương); đề cương chia theo chương ⇒ tiền tố chương. Nhãn câu giữ như in, **duy nhất trong PHẦN**. Đ/S đủ 4 ý a–d. Phần LÝ THUYẾT, ma trận, bản đặc tả, bìa, quảng cáo "Xem thêm … toanmath.com" KHÔNG đưa vào.
  Đề in "Phần 1 TNKQ gồm cả Đ/S" (vd đề số 4 Linh Trung) ⇒ tách theo dạng thức thật của từng câu, ghi cách tách ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 11 THEO BỘ SÁCH CỦA ĐỀ CƯƠNG** (K11 theo `kho-rules/dai/lo/k11/de-cuong/brief-soan.md` §1 + `brief-cki.md`):
  - **KNTT:** C1 Hàm số LG & PTLG · C2 Dãy số, CSC, CSN · C3 Số đặc trưng mẫu ghép nhóm · C4 Quan hệ song song trong không gian · C5 Giới hạn, hàm số liên tục + toàn bộ lớp ≤ 10.
  - **Cánh Diều:** Ch I Hàm số LG & PTLG · Ch II Dãy số, CSC, CSN · Ch III Giới hạn, hàm số liên tục · Ch IV Quan hệ song song (cả lăng trụ, hình hộp, phép chiếu song song) — cùng chủ đề KNTT, thứ tự khác; thống kê mẫu ghép nhóm của Cánh Diều nằm học kì 2.
  - **CTST:** Ch1 LG · Ch2 Dãy số · Ch3 Giới hạn · Ch4 Quan hệ song song · Ch5 Mẫu ghép nhóm — cùng phạm vi KNTT.
  - `bo_sach` trong `ds-de.json` phần lớn là **suy đoán** (đề cương ít khi ghi) — đọc nội dung / thứ tự chương trên ảnh rồi chốt; `bo_sach: không rõ` (Linh Trung) ⇒ tự chốt theo nội dung và ghi căn cứ vào `## GHI CHÚ CHO NGƯỜI DUYỆT`. Đề cương chỉ gồm vài chương (vd Xuân Đỉnh: Chương 4–5) ⇒ giải đúng phạm vi đó.
  - **CẤM** như brief gốc: đạo hàm · mũ–logarit · xác suất lớp 11 · quan hệ vuông góc · L'Hôpital · định lí ngoài SGK (Menelaus, Ceva… — tự chứng minh bằng Thales / đường trung bình / tính chất song song). **Câu khái niệm đạo hàm (học kì II) ⇒ BỎ câu + nêu nhãn trong báo cáo** (B036-01, B037-08 đã biết có). Câu khác đòi kiến thức ngoài phạm vi ⇒ giải bằng cái đã học nếu được, không thì BỎ + báo.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC:** đề cương chỉ có đáp án ở những mục có cột "Đáp án" trong bảng dưới (không có Word đáp án). Giải xong cả đề cương rồi mới mở trang đáp án. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`. Lời giải theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn của trường. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai`** (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị; hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10). Câu **trùng nguyên văn** giữa các đề ⇒ giữ nguyên, giải bình thường.
- **Phân kho:** `kho=hinh_hoc` cho hình học không gian (quan hệ song song, giao tuyến, giao điểm, thiết diện, hình chóp / lăng trụ / hộp, phép chiếu song song); còn lại `kho=dai`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B037` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Lớp chữ của PDF mất ký hiệu (chữ Hy Lạp, mũ, căn) nên **gõ đề từ ẢNH** như §2 bên dưới; lớp chữ chỉ để định vị.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề cương B037

| MA | Trường · năm học | Bộ sách | Trang đề | Đáp án | Cấu trúc (ước) · lưu ý |
|---|---|---|---|---|---|
| B037-01 | THPT Thanh Khê, Đà Nẵng · 2024–2025 | KNTT | 3-8 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 2 đề: ĐỀ SỐ 1 (Phần I TN · Phần II tự luận) + ĐỀ SỐ 2 (Phần I 7 điểm TN · Phần II 3 điểm tự luận) (≈62 câu). trang 1 bìa, trang 2 danh sách chương, trang 9 trắng — BỎ |
| B037-02 | THPT Trưng Vương, Bình Định · 2024–2025 | Cánh Diều | 1-8 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | A. TRẮC NGHIỆM theo chương I–IV, chỉ trắc nghiệm 4 phương án (≈84 câu). đề có hình đồ thị ở Chương I |
| B037-03 | THPT Đức Trọng, Lâm Đồng · 2025–2026 | KNTT | 9-31 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | B. Bài tập luyện tập: PHẦN I TN · II Đ/S · III TLN · IV tự luận + PHẦN V Đề minh họa cuối kì I (I TN · II Đ/S · III TLN · IV tự luận) (≈154 câu). trang 1–8 là tóm tắt lý thuyết 5 chương (chỉ chữ) — BỎ |
| B037-04 | THPT Gia Bình số 1, Bắc Ninh · 2025–2026 | Cánh Diều | 1-21 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | Bài tập minh họa Phần 1 Đại số + Phần 2 Hình học; ĐỀ ÔN TẬP SỐ 1 và SỐ 2 (I TN · II Đ/S · III TLN · IV tự luận) (≈189 câu). có thêm bản .docx cùng bài — DÙNG PDF; trang 22 chỉ quảng cáo |
| B037-05 | THPT Thanh Khê, Đà Nẵng · 2025–2026 | KNTT | 4-8 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 2 đề tham khảo (ĐỀ SỐ 1 và đề thứ hai): Phần I 3 điểm TN · II 2 điểm Đ/S · III 2 điểm TLN · IV 3 điểm tự luận (≈42 câu). trang 1 bìa, 2–3 ma trận (BỎ), 9 quảng cáo; có thêm bản .docx cùng bài — DÙNG PDF |
| B037-06 | THPT Bắc Thăng Long, Hà Nội · 2024–2025 | KNTT | 1-22 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | chia theo chủ đề (1. Cấp số cộng …), mỗi nhóm PHẦN I TN · II Đ/S · III TLN (≈141 câu). khác đề cương 2025–2026 của cùng trường (B036-03) — đo nội dung: 2 tài liệu khác nhau |
| B037-07 | THPT Xuân Phương, Hà Nội · 2025–2026 | KNTT | 1-10 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | theo Chương 1–5: PHẦN I TN · II Đ/S · III TLN · IV tự luận (≈92 câu). trang 1 có mục A. KIẾN THỨC TRỌNG TÂM (chữ, bỏ) rồi vào bài tập |
| B037-08 | THPT Vân Nội, Hà Nội · 2026–2027 | KNTT | 1-36 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | theo Chương I–V: PHẦN 1 TN 4 phương án · PHẦN 2 Đ/S · PHẦN 3 tự luận (≈357 câu — đề cương lớn nhất batch). 2 câu khái niệm đạo hàm (liên tục / có đạo hàm, trang 34–35) ⇒ BỎ + báo; trang ghi năm học 2026–2027 (đề cương năm học này) |

Tất cả đều có lớp chữ (không phải scan) nhưng vẫn gõ từ ảnh.

---

# Brief trạm SOÁT — ĐỀ CƯƠNG Toán 11 (24/10)

> Cặp với `brief-soan.md` (cùng thư mục). `<MA>` = `VD-GKI-2026` · `HVT-GKI-2026` · `YH-HKI-2026` · `TP-GKI-2026`; `<P>` = số tệp khúc; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B037\<MA>`; Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Trạm soạn đã VỪA GÕ đề từ ảnh VỪA giải ⇒ soát phải kiểm CẢ HAI.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT khúc của đề cương Toán 11 đã được trạm khác gõ + soạn lời giải. Đề cương KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả.
Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi khúc của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k11\de-cuong\brief-soan.md` (nguồn ảnh, khuôn tệp, hình, khuôn lời giải) và luật nội dung `Repo\kho-rules\dai\k11.md` §3 (phạm vi kiến thức + điều cấm).
2. Mở ảnh các trang của khúc bạn (điều phối nói: trang nào) `<LV>\trang\p-N.png` bằng công cụ Read; chỗ không chắc phóng to bằng `pdftoppm` như brief soạn §2. **Chưa mở** tệp `kho-rules\dai\lo\toanmath\batch\B037\<MA>.soan.md`.
3. Lấy danh sách nhãn câu của tệp (CHỈ lệnh này, chạy từ Repo — nó in tiêu đề PHẦN, loại câu, và các dòng Ghi chú / Chưa chắc, KHÔNG in đề / lời giải):
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/toanmath/batch/B037/<MA>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ').slice(0,3).join(' | '):l).join('\n'))"`
4. Tự giải mọi câu có nhãn trong danh sách (đọc đề từ ẢNH). Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc, không `node -e` chứa `\` hay dấu huyền): trắc nghiệm thay từng phương án / quét lưới; PTLG thay nghiệm cho nhiều `k` + quét lưới tìm nghiệm sót;
   min–max quét ≥ 20000 giá trị; dãy số tính 20 số hạng đầu; giới hạn tính giá trị với n / x lớn; hình KG dựng toạ độ số kiểm song song / giao điểm / thiết diện. Không nhẩm.
5. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B037\<MA>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

6. Mở `kho-rules\dai\lo\toanmath\batch\B037\<MA>.soan.md`, soát TỪNG câu:
   - **Đề gõ** đúng ảnh chưa: đủ câu (không bỏ / không thừa), số, số mũ, chỉ số, dấu, `\alpha\beta\pi`, phân số, ngoặc, tên điểm, đủ ý a) b) c) d), 4 phương án A–D đúng chữ. Lệch ⇒ sửa theo ẢNH.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng. Đề in sẵn đáp số mà khác kết quả ⇒ có dòng Ghi chú của trạm soạn chưa.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (k11.md §3: không đạo hàm, không công thức chưa học, chương 1–2 không giới hạn…, kể cả dùng NGẦM) · ĐKXĐ + đối chiếu · PTLG đủ họ nghiệm, `k\in\mathbb{Z}`, rad / độ nhất quán, nghiệm trên đoạn đếm đủ biên ·
     Phần 2 đúng khuôn vở, mỗi phép biến đổi một dòng, kết bằng "Vậy …" · dấu nhân `\cdot` (không `\times`, không dấu chấm) · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Trắc nghiệm: xét ĐỦ 4 phương án; dòng cuối `Chọn X.` khớp `dap_an`. Đ/S: 4 ý, `dap_an` 4 chữ D/S khớp lời giải từng ý.
     Hình KG: căn cứ (giao tuyến, đường trung bình, định lí song song…) nêu rõ, không "nhìn hình".
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`); còn lại `tu_luan` (`dap_an=—`). `kho=hinh_hoc` đúng cho câu hình không gian, `kho=dai` còn lại. Không tách / gộp / đổi nhãn câu.
   - **Hình**: mở từng tệp `<LV>\img\…` ứng với `**Hình:**` (hình đề — đúng câu, cắt đủ, rõ nhãn) và `**Hình giải:**` (vẽ bằng code — đúng dữ kiện, nét khuất đúng, đủ điểm của lời giải, nhãn không đè / cụt). Sai ⇒ sửa script `<LV>\tam\ve.mjs` rồi vẽ lại (`node` từ Repo) hoặc cắt lại hình đề.
     Câu hình KG TỰ LUẬN mà lời giải cần hình mà thiếu `**Hình giải:**` ⇒ bạn vẽ thêm.
   - **Đề sai (Thùy 24/10):** giải bình thường + ghi "đề sai" ở Ghi chú + dòng "Lưu ý" đầu Phần 2; chỉ `Chưa chắc` khi hai cách hiểu cho hai đáp số khác nhau không phân xử được. Đừng ghi tràn lan; dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc ⇒ xoá, ghi vào biên bản.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc ⇒ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B037/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B037\<MA>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` hoặc "đề sai" (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc` / đề sai.
