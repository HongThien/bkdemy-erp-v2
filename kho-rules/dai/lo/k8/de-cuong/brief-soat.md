# Brief giao trạm SOÁT — ĐỀ CƯƠNG Toán 8 Ngôi Sao Hoàng Mai (12/10)

> `<P>` = số phần (1–12). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\NSHM-GKI-2026`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Dựa trên `kho-rules/dai/lo/k8-brief-soat.md` và `lo/k6/de-cuong/brief-soat.md`.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT PHẦN của đề cương ôn tập giữa kì I Toán 8 đã được trạm khác soạn lời giải. Đề cương KHÔNG có đáp án,
nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi phần của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k8.md` (§1 luật kiến thức, §1.5–§1.6, §3, §10) và `Repo\kho-rules\dai\lo\k8\de-cuong\brief-soan.md` mục 3.4 (phạm vi kiến thức của đề cương này).
2. Mở HẾT ảnh `<LV>\anh\1.png`, `2.webp`, `3.webp`, `4.png`, `5.webp` bằng công cụ Read (ảnh nhỏ — chỗ không chắc phóng to bằng `node "<LV>\crop.mjs" <ảnh> <x> <y> <rộng> <cao> <hệ số> <ra.png>`).
   **Chưa mở** tệp `NSHM-GKI-2026.p<P>.soan.md`.
3. Tự giải các câu của phần bạn. Danh sách nhãn câu của phần: lấy bằng lệnh
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k8/de-cuong/NSHM-GKI-2026.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('### ')).map(l=>l.split(' | ')[0]).join('\n'))"`
   — chỉ lệnh này, KHÔNG đọc nội dung bản soạn. Đa thức / hằng đẳng thức / tìm $x$ / tìm nghiệm nguyên / số chính phương tính bằng script node (thay số, vét cạn BigInt), không nhẩm. Hình: dựng toạ độ số.
4. Ghi `Repo\kho-rules\dai\lo\k8\de-cuong\NSHM-GKI-2026.p<P>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

5. Đọc mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` và brief trạm soạn `Repo\kho-rules\dai\lo\k8\de-cuong\brief-soan.md` (luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\k8\de-cuong\NSHM-GKI-2026.p<P>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, dấu, tên điểm, đủ ý).
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (k8.md §1: KHÔNG đường trung bình, Thalès, đồng dạng, Pythagore, lượng giác, phân thức — kể cả dùng NGẦM không gọi tên;
     "tứ giác có ba góc vuông" không phải dấu hiệu; đặt thừa số chung theo tính chất phân phối luôn được dùng; hằng đẳng thức / phân tích nhân tử / hình chữ nhật … được dùng vì đề cương
     chạm tới) · Phần 2 đúng khuôn vở lớp 8, mỗi khẳng định hình có lí do · dấu nhân `\cdot` · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối,
     không chép lại Phần 2); bài hình chứng minh thì Phần 1 đi theo chiều phân tích đi lên ("muốn có …, cần …") và Phần 2 đi ngược lại, khớp từng mắt xích.
     Bài nâng cao: mỗi bước kẹp / chia hết / số dư phải đúng với MỌI giá trị biến được nêu (kiểm đủ khoảng, kể cả giá trị biên và số âm).
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`) theo đúng dạng đề hỏi; còn lại `tu_luan` (`dap_an=—`). Không tách / gộp / đổi nhãn câu; `kho` giữ nguyên.
   - **Hình** (Bài 13–22): mở từng tệp `<LV>\img\giai_bai<N>.png` ứng với dòng `**Hình giải:**` — đúng dữ kiện đề, đủ điểm của mọi ý, tên điểm đúng chỗ, không đánh dấu điều phải chứng minh,
     nhãn không đè / không cụt, độ dài đúng điều kiện ($AB>AC$…). Sai ⇒ sửa script `<LV>\tam\ve_p<P>.mjs` rồi vẽ lại (`node` từ thư mục Repo). Bài hình thiếu `**Hình giải:**` ⇒ bạn vẽ thêm.
   - **Ghi chú / Chưa chắc**: dòng của người gõ đề giữ. Dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản; chỗ đề cương in sai mà trạm soạn bỏ sót ⇒ thêm
     `**Chưa chắc:**` nói rõ đề sai ở đâu và đúng phải là gì (chứng minh bằng máy khi có thể). Đừng ghi tràn lan.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `NSHM-GKI-2026.p<P>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `…p<P>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ thêm / giữ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/de-cuong/NSHM-GKI-2026.p<P>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k8\de-cuong\NSHM-GKI-2026.p<P>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.

## Bẫy đã cắn thật

- Đề đúng là bài đường trung bình mà lời giải đi tắt qua đường trung bình (dù không gọi tên) ⇒ SAI luật, bắt buộc viết lại bằng hình bình hành / tam giác bằng nhau.
- Số mũ nhỏ / dấu trừ ở ảnh nhỏ: không chắc ⇒ nói ra, đừng đoán.
- Bài "nhiều nhất / ít nhất" cho số tự nhiên: kiểm điều kiện "đủ cả hai loại" (mỗi loại ≥ 1), "không vượt quá", khuyến mãi từ mức nào (≥ hay >).

### ⭐ LUẬT TRÌNH BÀY HÌNH 7·8·9 (CEO 27/10) — áp cho MỌI lời giải bài Hình, cả Học lẫn Luyện lẫn Kho đề thi

1. **Dòng ngắn — một dòng chỉ viết khoảng 50% bề ngang.** Bài Hình dày đặc ký hiệu nên dòng dài rất khó nhìn. Mỗi dòng một điều kiện / một mệnh đề / một lý do; khẳng định dài (nhiều điều nối bằng "và", "mà", dấu phẩy) phải **tách thành nhiều dòng**. Mốc tay: ≲ 60 ký tự hiển thị mỗi dòng (công thức tính theo chữ nó hiện ra). Khối "Xét … có:" vẫn mỗi điều kiện một dòng.
2. **Giãn dòng cho thoáng mắt = tăng khoảng cách dòng thêm 20% so với hiện tại — KHÔNG bằng dòng trống (cách một dòng trống là quá xa, CEO 27/10).** Đây là việc HIỂN THỊ (line-height khối lời giải bài Hình, làm ở app một chỗ), không phải việc của người soạn. Trong DỮ LIỆU giữ nguyên luật R2 cũ: các dòng nối bằng `\n` đơn, **không thêm dòng trống** giữa các bước; dòng trống chỉ trước ý b) c) d) và trước `**Phần 2. Trình bày**`.
3. **Mọi kiến thức dùng phải có chú thích trong ngoặc** ngay sau mệnh đề:
   - Dữ kiện đề cho → **(gt)** (giả thiết). Vd: `$AB=AC$ (gt)`.
   - Dùng định lý / tính chất / dấu hiệu → ghi **đúng tên** (theo whitelist của khối). Vd: `(định lý trung tuyến ứng với cạnh huyền)`, `(tính chất hai đường chéo hình chữ nhật)`, `(dấu hiệu nhận biết hình bình hành)`, `(trường hợp c.g.c)`.
   - Kết quả đã chứng minh ở bước trên (cùng ý hay ý trước) → **(cmt)** (chứng minh trên). Vd: `$AKCI$ là hình bình hành (cmt)`.
   - Thiếu chú thích = lời giải CHƯA đạt; trạm soát phải bắt. Không dùng lý do nào ngoài whitelist.

*Ví dụ đúng (các dòng liền nhau, không dòng trống):*
```
Vì $AB=AC$ (gt)
nên $\triangle ABC$ cân tại $A$ (định nghĩa tam giác cân).
Do đó $\widehat{B}=\widehat{C}$ (tính chất tam giác cân).
Xét $\triangle ABM$ và $\triangle ACM$ có:
$AB=AC$ (gt);
$\widehat{B}=\widehat{C}$ (cmt);
$BM=CM$ (gt)
nên $\triangle ABM=\triangle ACM$ (c.g.c).
```


**Trạm SOÁT:** lời giải bài Hình vi phạm 3 điều trên (dòng dài, không giãn dòng, thiếu (gt)/(cmt)/tên định lý) ⇒ sửa thẳng, ghi vào biên bản.
