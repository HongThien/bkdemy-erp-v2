# ⚠️⚠️ BẢN ÁP DỤNG BATCH B046 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 10 CỦA TRƯỜNG, TẢI TỪ TOANMATH (9 đề cương, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 10 (25/10), đã đổi sẵn đường dẫn. Luật kiến thức K10, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B046-NN`. Danh sách đề cương: `Repo\kho-rules\dai\lo\toanmath\batch\B046\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach`, `bo_sach_can_cu`,
  `de` (trang có bài tập **trong file PDF gốc**), `hd` (trang đáp án nếu có), `uoc_cau` (ước số câu — chỉ để chia khúc), `ghi_chu`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B046\<MA>` (có `goc.pdf` = NGUYÊN file, `trang\p-N.png` **150 dpi** đánh số theo trang file gốc, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`. Bỏ qua trang bìa / mục lục / ma trận / đặc tả / lý thuyết chỉ chữ / quảng cáo "Xem thêm … toanmath.com".
- **MỘT ĐỀ CƯƠNG = MỘT MỤC (một tệp soạn)** — tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B046\<MA>.soan.md`. Đề cương dài (ước > ~120 câu) vẫn là một mục; **người điều phối tự chia khúc khi soạn**
  (khi đó hậu tố `.p<P>` do điều phối quy định). **BỎ bước `ghep-k10.mjs`/ghép khúc ở §7 bên dưới nếu điều phối giao cả mục một lượt.** Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B046/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- **Đầu tệp (thay khuôn §3 bên dưới):**
  ```
  # ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 10 năm <năm học> — <don_vi>
  kieu: de_cuong
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  ```
  Năm học viết `2024–2025` / `2025–2026` / `2026–2027` theo đúng ảnh tiêu đề (tên tệp có thể lệch); lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG cách đề cương chia** (TN · Đ/S đủ 4 ý a–d · TLN · tự luận); đề cương nhiều "ĐỀ SỐ" / nhiều phần ⇒ mỗi đề/phần một PHẦN riêng, đúng như in. Nhãn câu giữ như in (đề cương đánh số lại từ Câu 1 ở mỗi PHẦN thì giữ + nhãn duy nhất trong PHẦN).
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 10** (bộ sách ghi ở `bo_sach`; dấu "?" = suy đoán — đề cương không ghi, đọc lại tiêu đề / tên chương trên ảnh):
  - Luật gốc `k10/de-cuong/brief-soan.md` §1: whitelist = **KNTT Toán 10 tập 1** — C1 Mệnh đề và tập hợp · C2 BPT và hệ BPT bậc nhất hai ẩn · C3 Hệ thức lượng trong tam giác ·
    C4 Vectơ (kể cả toạ độ, tích vô hướng) · C5 Các số đặc trưng mẫu số liệu **không ghép nhóm** (số gần đúng – sai số, trung bình, trung vị, tứ phân vị, mốt, khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn, giá trị ngoại lệ) + toàn bộ lớp ≤ 9.
  - **Hàm số, đồ thị, hàm số bậc hai, dấu tam thức bậc hai** (KNTT chương VI — tập 2) **CHỈ được dùng khi chính đề cương nêu** (nhiều đề cương Hà Nội xếp vào HK1: Trần Phú, Cầu Giấy, Bắc Thăng Long, Phúc Thọ, Linh Trung, Hoàng Văn Thụ 2024-2025, Sơn Động 3…).
    Đề cương không nêu thì **CẤM**. Đề cương theo **Cánh Diều / CTST** (xem `bo_sach`) ⇒ giải đúng kiến thức đề cương đó kiểm tra, ghi `bo_sach` đúng.
  - Có đề cương **chỉ một phần** chương trình (vd Xuân Đỉnh, Đại Mỗ: chỉ Vectơ + Số đặc trưng; Đức Trọng: chương III–V; Trần Phú: phần sau giữa kì): giải đúng phần đề in, không bổ sung.
  - **CẤM** như brief gốc: đạo hàm · giới hạn · mũ–logarit · tích phân · tổ hợp–xác suất lớp 10 chương sau · công thức chưa học (hạ bậc, tích → tổng…) · định lí ngoài SGK (tự chứng minh bằng kiến thức đã học).
    Tiêu đề ghi "mẫu số liệu ghép nhóm" ở chương V (Yên Hòa 2025-2026): đọc ảnh — nếu thật là ghép nhóm thì ghi `**Chưa chắc:**`, không tự quyết.
- **Phân kho:** `kho=hgt` cho Vectơ (khái niệm, tổng–hiệu–tích với số, tích vô hướng, toạ độ vectơ, chứng minh đẳng thức vectơ, lực – vận tốc); còn lại `kho=dai` (kể cả hệ thức lượng tam giác, BPT, mệnh đề–tập hợp, số đặc trưng, hàm số). Kho `hinh_hoc` KHÔNG dùng ở khối 10.
- **Đáp án / hướng dẫn chấm = NHÂN CHỨNG, TỰ GIẢI TRƯỚC.** Đề cương có đáp án (cột "Đáp án" bên dưới; Nguyễn Trãi Đà Nẵng có bảng đáp án các đề tham khảo; Nguyễn Công Trứ in "Đáp án:/Đáp số:" sau một số câu) ⇒ giải xong rồi mới đối chiếu;
  lệch ⇒ tính lại bằng máy; đáp án của trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`. Không có đáp án ⇒ tự giải toàn bộ, chỗ không kiểm chứng được ⇒ `**Chưa chắc:**`.
  Lời giải theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Luật chung đã chốt:** đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); mọi đáp số thử lại bằng máy; **KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (dùng Write/Edit)**.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B046` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.
- Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).

## Ghi chú riêng từng đề cương B046

| MA | Trường · năm học | Bộ sách | Trang có bài tập (`trang\p-N.png`) | Đáp án | Lớp chữ | ~câu | Lưu ý |
|---|---|---|---|---|---|---|---|
| B046-01 | THPT Yên Hòa, Hà Nội · 2024–2025 | KNTT? | 2-25 | **KHÔNG có** | chữ | ~181 | p1 cấu trúc (bỏ), p26 quảng cáo; kho có YH 2026-2027: 0 câu trùng ⇒ giữ |
| B046-02 | THPT Đại Mỗ, Hà Nội · 2025–2026 | KNTT? | 1-8 | **KHÔNG có** | chữ | ~79 | CHỈ Vectơ + Số đặc trưng; TN + tự luận; không đáp án |
| B046-03 | THPT Yên Hòa, Hà Nội · 2025–2026 | KNTT? | 2-33 | **KHÔNG có** | chữ | ~261 | Đề cương dài; kho có YH 2026-2027 (274 câu): 78/262 câu của bản này (≈30%) trùng ⇒ giữ nhưng nhiều khả năng là bản gốc của đề cương kho (xem điểm cần Thùy quyết) |
| B046-04 | THPT Linh Trung, TP Hồ Chí Minh · 2025–2026 | KNTT? | 1-30 | **KHÔNG có** | chữ | ~206 | Nhiều "ĐỀ ÔN TẬP SỐ"; p30 phiếu trống; không đáp án |
| B046-05 | THPT Nguyễn Công Trứ, TP Hồ Chí Minh · 2026–2027 | KNTT | 3-136 | rải rác "Đáp án:/Đáp số:" sau một số câu | chữ | ~984 | SÁCH 136 TRANG theo bài (TN + Đ/S + TLN), rất dài ⇒ điều phối chia khúc; có "Đáp án:/Đáp số:" in ngay sau một số câu (nhân chứng, tự giải trước); p1 mục lục, p2 bìa (bỏ) |
| B046-06 | THPT Cầu Giấy, Hà Nội · 2025–2026 | Cánh Diều? | 1-15 | **KHÔNG có** | **SCAN** | ~170 | SCAN (không lớp chữ) — 15 trang gõ từ ảnh; cùng khung Trần Phú 2025-26 nhưng câu khác; không đáp án |
| B046-07 | THPT Trần Phú (Hoàn Kiếm), Hà Nội · 2025–2026 | Cánh Diều? | 1-25 | **KHÔNG có** | chữ | ~190 | CHỈ phần sau giữa kì (hàm số, hệ thức lượng, vectơ); không đáp án; kho có TP giữa kì 2026-2027 khác nội dung (≤4/21 câu) ⇒ giữ |
| B046-08 | THPT Nguyễn Trãi, Đà Nẵng · 2024–2025 | KNTT | 3-11 | trang 5,8,11 | chữ | ~75 | 3 đề (p3-4, p6-7, p9-10) + CÓ đáp án (p5, p8, p11); p1–2 nội dung kiến thức |
| B046-09 | THPT Trần Phú (Hoàn Kiếm), Hà Nội · 2024–2025 | Cánh Diều? | 1-16 | **KHÔNG có** | chữ | ~131 | Hàm số… ; TN + tự luận; không đáp án |

---

# Brief trạm SOÁT — ĐỀ CƯƠNG Toán 10 (25/10)

> Cặp với `brief-soan.md` (cùng thư mục). `<MA>` = `VD-GKI-2026` · `HVT-GKI-2026` · `YH-HKI-2026` · `TP-GKI-2026`; `<P>` = số tệp khúc; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B046\<MA>`; Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Trạm soạn đã VỪA GÕ đề từ ảnh VỪA giải ⇒ soát phải kiểm CẢ HAI.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT khúc của đề cương Toán 10 đã được trạm khác gõ + soạn lời giải. Đề cương KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả.
Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi khúc của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k10\de-cuong\brief-soan.md` (phạm vi kiến thức K10, nguồn ảnh, khuôn tệp, hình, khuôn lời giải, bẫy).
2. Mở ảnh các trang của khúc bạn (điều phối nói: trang nào, từ câu nào đến câu nào) `<LV>\trang\p-N.png` bằng công cụ Read; chỗ không chắc phóng to bằng `pdftoppm` như brief soạn §2. **Chưa mở** tệp `kho-rules\dai\lo\toanmath\batch\B046\<MA>.soan.md`.
3. Lấy danh sách nhãn câu của tệp (CHỈ lệnh này, chạy từ Repo — nó in tiêu đề PHẦN, loại câu, và các dòng Ghi chú / Chưa chắc, KHÔNG in đề / lời giải):
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/toanmath/batch/B046/<MA>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ').slice(0,3).join(' | '):l).join('\n'))"`
4. Tự giải mọi câu có nhãn trong danh sách (đọc đề từ ẢNH). Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc, không `node -e` chứa `\` hay dấu huyền): trắc nghiệm thay từng phương án / quét lưới; tập hợp dựng bằng mảng số; mệnh đề chứa biến quét ≥ 2000 giá trị;
   BPT hai ẩn quét lưới điểm; **bài tối ưu: liệt kê đỉnh + quét lưới nguyên toàn miền**; hệ thức lượng dùng `Math.cos(x*Math.PI/180)` và dựng toạ độ số cho tam giác; vectơ gán toạ độ số kiểm đẳng thức nhiều bộ điểm; số đặc trưng tính bằng script (tứ phân vị theo cách KNTT). Không nhẩm.
5. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B046\<MA>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

6. Mở `kho-rules\dai\lo\toanmath\batch\B046\<MA>.soan.md`, soát TỪNG câu:
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
8. Chạy cổng tới khi "✔ đạt cổng" (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B046/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B046\<MA>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` hoặc "đề sai" (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc` / đề sai.
