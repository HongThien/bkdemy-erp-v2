# ⚠️⚠️ BẢN ÁP DỤNG BATCH B041 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 10 CỦA SỞ / TRƯỜNG, TẢI TỪ TOANMATH (2 đề Hải Phòng, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 10 (25/10), đã đổi sẵn đường dẫn. Luật kiến thức K10, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B041-NN` (01–02). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B041\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B041\<MA>` (đã có `goc.pdf`, `trang\p-N.png` **150 dpi**, `hd\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B041\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước ghép khúc** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B041/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- **Đề nhiều mã ⇒ chỉ MỘT mã (mã đầu), đã chọn sẵn ở `tach`/`ma_de`.** Cả hai đề của batch này đều có `tach`: `goc.pdf` + `trang\` CHỈ chứa trang của mã đó (đánh số lại p-1…);
  trang hướng dẫn chấm của file gốc đã render riêng vào `<LV>\hd\p-N.png` (N = số trang trong file gốc, đúng như `hd`). Bỏ qua trang ma trận / đặc tả / quảng cáo "Xem thêm … toanmath.com".
- **Đầu tệp (thay khuôn đề cương §3 bên dưới):**
  ```
  # ĐỀ | Đề kiểm tra cuối học kì 1 Toán 10 năm <năm học> — <don_vi> (Mã đề <ma_de>)
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <theo đề, thường 90>
  ```
  **KHÔNG có dòng `kieu: de_cuong`.** Năm học viết `2024–2025`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG đề:** `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` ·
  (`## PHẦN 4 | Tự luận | tu_luan` nếu đề có). Số câu đúng như `cau_truc`; nhãn câu giữ như đề in (Phần II/III đánh lại từ "Câu 1"). Đ/S đủ 4 ý a–d.
  Câu TLN mà đáp số không tô được 4 ô ⇒ vẫn ở PHẦN 3 nhưng `loai=tu_luan` + `**Ghi chú:**` (luật §3 bên dưới).
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 10 THEO BỘ SÁCH CỦA ĐỀ** (đề KHÔNG ghi bộ sách ⇒ `bo_sach: KNTT` kèm "suy đoán" ở `bo_sach_can_cu`):
  - **KNTT (Tập 1):** C1 Mệnh đề và tập hợp · C2 BPT và hệ BPT bậc nhất hai ẩn · C3 Hệ thức lượng trong tam giác · C4 Vectơ (kể cả toạ độ của vectơ, tích vô hướng) ·
    C5 Các số đặc trưng của mẫu số liệu không ghép nhóm (số gần đúng – sai số, tứ phân vị, độ lệch chuẩn…) + toàn bộ lớp ≤ 9. Đề nào kiểm tra tới hàm số bậc hai / Tập 2 thì giải đúng cái đề hỏi + `**Chưa chắc:**`.
  - **CẤM** như brief gốc K10: đạo hàm · giới hạn · mũ–logarit · tích phân · tổ hợp/xác suất lớp 10 chương sau · công thức chưa học (hạ bậc, tích → tổng…) · định lí ngoài SGK. Câu đề tự đòi kiến thức ngoài phạm vi ⇒ giải bằng cái đã học nếu được, không thì `**Chưa chắc:**`.
  - Thấy ảnh ghi bộ sách khác `bo_sach` ⇒ sửa dòng `bo_sach:` theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC**: giải xong cả đề rồi mới mở trang `hd` (và/hoặc Word `dap_an_word` — đọc bằng node + `jszip`, đường dẫn có dấu nên không dùng poppler).
  Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`.
  Lời giải viết theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Phân kho (như brief gốc K10 §3):** `kho=hgt` cho câu **Vectơ** (khái niệm, tổng – hiệu, tích với số, tích vô hướng, toạ độ vectơ, chứng minh đẳng thức vectơ, lực – vận tốc);
  `kho=dai` cho mọi câu còn lại — kể cả **hệ thức lượng trong tam giác** (sin, côsin, diện tích, giải tam giác, đo đạc), mệnh đề – tập hợp, BPT – hệ BPT, số đặc trưng. Câu nhập nhằng ⇒ chọn theo bản chất + `**Ghi chú:**`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B041` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Luật chung đã chốt: đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (dùng Write/Edit).
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề B041

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B041-01 | Sở GD&ĐT Hải Phòng (THPT chuyên Trần Phú) · **Toán chuyên** · mã 101 | KNTT? | 1–4 → `trang\p-1…p-4` (`goc.pdf` chỉ chứa mã 101) | `hd\p-9.png` (bảng đáp án TN 4 mã, cột 101) + `hd\p-10.png` (đáp án + thang điểm tự luận); Word `dap_an_word` | Có lớp chữ nhưng vẫn gõ từ ảnh. 16 TN · 2 Đ/S · 4 TLN · tự luận 3 bài (Bài 1 1 đ · Bài 2 0,5 đ · Bài 3 0,5 đ — Bài 3 hai trung tuyến AM, BN vuông góc). Đề in "Đề thi có 04 trang". Tiêu đề KHÔNG ghi tên trường (chỉ Sở GD&ĐT Hải Phòng) — tên trường lấy từ tên file toanmath; ghi ở GHI CHÚ CHO NGƯỜI DUYỆT |
| B041-02 | Sở GD&ĐT Hải Phòng (THPT chuyên Trần Phú) · **Toán** (không chuyên) · mã 101 | KNTT? | 1–4 → `trang\p-1…p-4` | `hd\p-9.png`, `hd\p-10.png`; Word `dap_an_word` | 16 TN · 2 Đ/S · 4 TLN · tự luận 2 câu (Câu 1: Hê-rông tính đường cao hạ từ C với a=3, b=4, c=6; Câu 2 xem ảnh). **TRÙNG MỘT PHẦN với B041-01:** TN câu 1, 2, 10–15, Đ/S câu 2 (M, N, P trung điểm, G trọng tâm), TLN câu 1–3 gần như y hệt đề chuyên ⇒ soạn độc lập từng đề (đừng chép chéo), kho sẽ tự báo trùng câu ở bước ghi |

Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).

---

# Brief trạm SOÁT — ĐỀ CƯƠNG Toán 10 (25/10)

> Cặp với `brief-soan.md` (cùng thư mục). `<MA>` = `VD-GKI-2026` · `HVT-GKI-2026` · `YH-HKI-2026` · `TP-GKI-2026`; `<P>` = số tệp khúc; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B041\<MA>`; Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Trạm soạn đã VỪA GÕ đề từ ảnh VỪA giải ⇒ soát phải kiểm CẢ HAI.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT khúc của đề cương Toán 10 đã được trạm khác gõ + soạn lời giải. Đề cương KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả.
Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi khúc của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k10\de-cuong\brief-soan.md` (phạm vi kiến thức K10, nguồn ảnh, khuôn tệp, hình, khuôn lời giải, bẫy).
2. Mở ảnh các trang của khúc bạn (điều phối nói: trang nào, từ câu nào đến câu nào) `<LV>\trang\p-N.png` bằng công cụ Read; chỗ không chắc phóng to bằng `pdftoppm` như brief soạn §2. **Chưa mở** tệp `kho-rules\dai\lo\toanmath\batch\B041\<MA>.soan.md`.
3. Lấy danh sách nhãn câu của tệp (CHỈ lệnh này, chạy từ Repo — nó in tiêu đề PHẦN, loại câu, và các dòng Ghi chú / Chưa chắc, KHÔNG in đề / lời giải):
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/toanmath/batch/B041/<MA>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ').slice(0,3).join(' | '):l).join('\n'))"`
4. Tự giải mọi câu có nhãn trong danh sách (đọc đề từ ẢNH). Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc, không `node -e` chứa `\` hay dấu huyền): trắc nghiệm thay từng phương án / quét lưới; tập hợp dựng bằng mảng số; mệnh đề chứa biến quét ≥ 2000 giá trị;
   BPT hai ẩn quét lưới điểm; **bài tối ưu: liệt kê đỉnh + quét lưới nguyên toàn miền**; hệ thức lượng dùng `Math.cos(x*Math.PI/180)` và dựng toạ độ số cho tam giác; vectơ gán toạ độ số kiểm đẳng thức nhiều bộ điểm; số đặc trưng tính bằng script (tứ phân vị theo cách KNTT). Không nhẩm.
5. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B041\<MA>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

6. Mở `kho-rules\dai\lo\toanmath\batch\B041\<MA>.soan.md`, soát TỪNG câu:
   - **Đề gõ** đúng ảnh chưa: đủ câu (không bỏ / không thừa), số, số mũ, chỉ số, dấu, kí hiệu tập hợp / lượng từ / vectơ, phân số, ngoặc `(`/`[`, tên điểm, đủ ý a) b) c) d), 4 phương án A–D đúng chữ. Lệch ⇒ sửa theo ẢNH.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng. Đề in sẵn đáp số mà khác kết quả ⇒ có dòng Ghi chú của trạm soạn chưa.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức K10** (brief soạn §1: không dùng kiến thức sau chương đề cương nêu, kể cả dùng NGẦM; đề cương chỉ tới C1–C2 thì không sin / côsin / vectơ) · mệnh đề phủ định / đảo / tương đương đúng · tập hợp: đủ phần tử, đúng ngoặc khoảng – đoạn · BPT hai ẩn: điểm thử không nằm trên biên, đủ MỌI bất phương trình, bài tối ưu kiểm đủ đỉnh + điều kiện nguyên ·
     hệ thức lượng: tam giác đặt đúng, định lí nêu rõ, góc tù / nhọn đúng dấu, làm tròn đúng yêu cầu, không tính tiếp từ số đã làm tròn · vectơ: đúng chiều $\overrightarrow{AB}$, mỗi dòng một phép biến đổi · số đặc trưng: sắp xếp trước rồi mới lấy trung vị / tứ phân vị.
     Phần 2 đúng khuôn vở, mỗi phép biến đổi một dòng, kết bằng "Vậy …" · dấu nhân `\cdot` (không `\times`, không dấu chấm) · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Trắc nghiệm: xét ĐỦ 4 phương án; dòng cuối `Chọn X.` khớp `dap_an`. Đ/S: 4 ý, `dap_an` 4 chữ D/S khớp lời giải từng ý.
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`); còn lại `tu_luan` (`dap_an=—`). **`kho=hgt` chỉ cho câu Vectơ** (khái niệm, tổng – hiệu – tích với số, tích vô hướng, toạ độ vectơ, ứng dụng lực – vận tốc); mọi câu khác (mệnh đề – tập hợp, BPT hai ẩn, **hệ thức lượng trong tam giác**, số đặc trưng) là `kho=dai`. Không tách / gộp / đổi nhãn câu.
   - **Hình**: mở từng tệp `<LV>\img\…` ứng với `**Hình:**` (hình đề — đúng câu, cắt đủ, rõ nhãn / số liệu) và `**Hình giải:**` (vẽ bằng code — đúng dữ kiện, đủ điểm của lời giải, nhãn không đè / cụt). Sai ⇒ sửa script `<LV>\tam\ve.mjs` rồi vẽ lại (`node` từ Repo) hoặc cắt lại hình đề.
     Câu tự luận hình / hệ thức lượng thực tế / vectơ mà lời giải cần hình mà thiếu `**Hình giải:**` ⇒ bạn vẽ thêm (cách vẽ trong brief soạn §4).
   - **Đề sai (Thùy 24/10):** giải bình thường + ghi "đề sai" ở Ghi chú + dòng "Lưu ý" đầu Phần 2; chỉ `Chưa chắc` khi hai cách hiểu cho hai đáp số khác nhau không phân xử được. Đừng ghi tràn lan; dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc ⇒ xoá, ghi vào biên bản.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc ⇒ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B041/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B041\<MA>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` hoặc "đề sai" (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc` / đề sai.
