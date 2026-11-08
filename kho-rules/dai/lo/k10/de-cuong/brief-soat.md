# Brief trạm SOÁT — ĐỀ CƯƠNG Toán 10 (25/10)

> Cặp với `brief-soan.md` (cùng thư mục). `<MA>` = `VD-GKI-2026` · `HVT-GKI-2026` · `YH-HKI-2026` · `TP-GKI-2026`; `<P>` = số tệp khúc; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K10\<MA>`; Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Trạm soạn đã VỪA GÕ đề từ ảnh VỪA giải ⇒ soát phải kiểm CẢ HAI.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT khúc của đề cương Toán 10 đã được trạm khác gõ + soạn lời giải. Đề cương KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả.
Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi khúc của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k10\de-cuong\brief-soan.md` (phạm vi kiến thức K10, nguồn ảnh, khuôn tệp, hình, khuôn lời giải, bẫy).
2. Mở ảnh các trang của khúc bạn (điều phối nói: trang nào, từ câu nào đến câu nào) `<LV>\trang\p-N.png` bằng công cụ Read; chỗ không chắc phóng to bằng `pdftoppm` như brief soạn §2. **Chưa mở** tệp `kho-rules\dai\lo\k10\de-cuong\<MA>.p<P>.soan.md`.
3. Lấy danh sách nhãn câu của tệp (CHỈ lệnh này, chạy từ Repo — nó in tiêu đề PHẦN, loại câu, và các dòng Ghi chú / Chưa chắc, KHÔNG in đề / lời giải):
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k10/de-cuong/<MA>.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ').slice(0,3).join(' | '):l).join('\n'))"`
4. Tự giải mọi câu có nhãn trong danh sách (đọc đề từ ẢNH). Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc, không `node -e` chứa `\` hay dấu huyền): trắc nghiệm thay từng phương án / quét lưới; tập hợp dựng bằng mảng số; mệnh đề chứa biến quét ≥ 2000 giá trị;
   BPT hai ẩn quét lưới điểm; **bài tối ưu: liệt kê đỉnh + quét lưới nguyên toàn miền**; hệ thức lượng dùng `Math.cos(x*Math.PI/180)` và dựng toạ độ số cho tam giác; vectơ gán toạ độ số kiểm đẳng thức nhiều bộ điểm; số đặc trưng tính bằng script (tứ phân vị theo cách KNTT). Không nhẩm.
5. Ghi `Repo\kho-rules\dai\lo\k10\de-cuong\<MA>.p<P>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

6. Mở `kho-rules\dai\lo\k10\de-cuong\<MA>.p<P>.soan.md`, soát TỪNG câu:
   - **Đề gõ** đúng ảnh chưa: đủ câu (không bỏ / không thừa), số, số mũ, chỉ số, dấu, kí hiệu tập hợp / lượng từ / vectơ, phân số, ngoặc `(`/`[`, tên điểm, đủ ý a) b) c) d), 4 phương án A–D đúng chữ. Lệch ⇒ sửa theo ẢNH.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng. Đề in sẵn đáp số mà khác kết quả ⇒ có dòng Ghi chú của trạm soạn chưa.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức K10** (brief soạn §1: không dùng kiến thức sau chương đề cương nêu, kể cả dùng NGẦM; đề cương chỉ tới C1–C2 thì không sin / côsin / vectơ) · mệnh đề phủ định / đảo / tương đương đúng · tập hợp: đủ phần tử, đúng ngoặc khoảng – đoạn · BPT hai ẩn: điểm thử không nằm trên biên, đủ MỌI bất phương trình, bài tối ưu kiểm đủ đỉnh + điều kiện nguyên ·
     hệ thức lượng: tam giác đặt đúng, định lí nêu rõ, góc tù / nhọn đúng dấu, làm tròn đúng yêu cầu, không tính tiếp từ số đã làm tròn · vectơ: đúng chiều $\overrightarrow{AB}$, mỗi dòng một phép biến đổi · số đặc trưng: sắp xếp trước rồi mới lấy trung vị / tứ phân vị.
     Phần 2 đúng khuôn vở, mỗi phép biến đổi một dòng, kết bằng "Vậy …" · dấu nhân `\cdot` (không `\times`, không dấu chấm) · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Trắc nghiệm: xét ĐỦ 4 phương án; dòng cuối `Chọn X.` khớp `dap_an`. Đ/S: 4 ý, `dap_an` 4 chữ D/S khớp lời giải từng ý.
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`); còn lại `tu_luan` (`dap_an=—`). **`kho=hgt` chỉ cho câu Vectơ** (khái niệm, tổng – hiệu – tích với số, tích vô hướng, toạ độ vectơ, ứng dụng lực – vận tốc); mọi câu khác (mệnh đề – tập hợp, BPT hai ẩn, **hệ thức lượng trong tam giác**, số đặc trưng) là `kho=dai`. Không tách / gộp / đổi nhãn câu.
   - **Hình**: mở từng tệp `<LV>\img\…` ứng với `**Hình:**` (hình đề — đúng câu, cắt đủ, rõ nhãn / số liệu) và `**Hình giải:**` (vẽ bằng code — đúng dữ kiện, đủ điểm của lời giải, nhãn không đè / cụt). Sai ⇒ sửa script `<LV>\tam\ve_p<P>.mjs` rồi vẽ lại (`node` từ Repo) hoặc cắt lại hình đề.
     Câu tự luận hình / hệ thức lượng thực tế / vectơ mà lời giải cần hình mà thiếu `**Hình giải:**` ⇒ bạn vẽ thêm (cách vẽ trong brief soạn §4).
   - **Đề sai (Thùy 24/10):** giải bình thường + ghi "đề sai" ở Ghi chú + dòng "Lưu ý" đầu Phần 2; chỉ `Chưa chắc` khi hai cách hiểu cho hai đáp số khác nhau không phân xử được. Đừng ghi tràn lan; dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc ⇒ xoá, ghi vào biên bản.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.p<P>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.p<P>.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc ⇒ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k10/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k10\de-cuong\<MA>.p<P>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` hoặc "đề sai" (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc` / đề sai.
