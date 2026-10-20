# Brief giao trạm SOẠN — năm đề cương Toán 6 GKI Hà Nội 2026–2027 (TC · CBQ · NQ · NTH · GV2, 20/10)

> `<MA>` ∈ `TC-GKI-2026` | `CBQ-GKI-2026` | `NQ-GKI-2026` | `NTH-GKI-2026` | `GV2-GKI-2026`. `<P>` = số trạm. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K6\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soạn chạy Sonnet; trạm soát (`brief-soat-dc.md`) chạy Opus. Brief này = `brief-soan.md` (NSHM K6, đọc TRƯỚC — khuôn lời giải, luật kiến thức, tự kiểm) + các chỗ riêng dưới đây.

Bạn là trạm SOẠN cho MỘT TRẠM (một phần) của đề cương ôn tập giữa kì I Toán 6. Việc: **giải chi tiết mọi câu của trạm** theo luật khối 6, viết thẳng vào tệp khung
`Repo\kho-rules\dai\lo\k6\de-cuong\<MA>.p<P>.soan.md` (đã có tiêu đề + đề từng câu + `**Hình:**` / `**Ghi chú:**` / `**Chưa chắc:**`). KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp khác (trừ hình giải trong `<LV>\img\` và script `<LV>\tam\ve_p<P>.mjs`), KHÔNG xoá gì.

## 1. Đọc trước (HẾT)

1. `Repo\kho-rules\dai\k6.md` — luật khối 6 (§1 kiến thức được dùng, §2 khuôn Phần 2 theo nhóm bài, §3 định dạng).
2. `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` — mẫu CEO đã duyệt (cả trắc nghiệm "Chọn B.", tự luận, bài hình có hình).
3. `Repo\kho-rules\dai\lo\k6\de-cuong\brief-soan.md` — mục 3–4, 7 (luật làm + khuôn lời giải). Mọi chỗ ghi `NSHM-GKI-2026` / `<LV>` / "ảnh `trang\p-N.png`" ⇒ thay bằng bảng dưới.

## 2. Thay đường dẫn / nguồn

- Nguồn đề (đối chiếu chữ, số, số mũ): ảnh trang `<LV>\anh\t-1.png … t-N.png` (130 dpi) — mở HẾT bằng Read; PDF `<LV>\goc.pdf` có lớp chữ nhưng **công thức hỏng** (mất số mũ, dấu trừ). Tệp khung do trạm gõ + trạm đối chiếu — **lệch ảnh thì ảnh đúng** ⇒ sửa dòng `**Đề:**` tối thiểu và ghi vào báo cáo cuối.
  Phóng to: `pdftoppm -r 260 -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> -png "<LV>\goc.pdf" "<LV>\z\<tên>"` (toạ độ 260 dpi = 2 × toạ độ ảnh `t-N.png`).
- **Hình có sẵn trong đề** đã cắt ở `<LV>\img\de_*.png`, khai bằng dòng `**Hình:**` — giữ; mở xem đúng hình của câu; dòng `**Ghi chú:** Đọc hình: …` là dữ kiện người gõ đã đọc — **đối chiếu với hình, lệch thì hình đúng**.
- **Lệnh cổng** (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 6 --chi-kiem` — sửa tới "✔ đạt cổng".

## 3. Luật thêm cho đề cương GKI này

1. **Phạm vi kiến thức:** Chương I–II SGK Kết nối tri thức 6 (k6.md §1) + phần hình trực quan Chương IV (tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi, hình bình hành, hình thang cân; chu vi, diện tích — công thức tiểu học và SGK Ch IV). Không số nguyên âm (Ch III) trừ khi đề cương ghi rõ; không phân số/số thập phân ngoài phần tiểu học. Bài NÂNG CAO: cần kết quả chưa có ⇒ **tự lập luận ngay trong lời giải** bằng cái đã có (phép nhân phân phối, ghép cặp, nhân hai vế rồi trừ, tính chất số chính phương chia 3 dư 0 hoặc 1, chia hết của tổng/hiệu, số dư khi chia cho 2/3…). Chứng minh chia hết cho tích hai số nguyên tố cùng nhau ⇒ **chia hết từng số rồi kết luận qua ƯCLN = 1**. Không chuyển vế · không hằng đẳng thức · không đồng dư · không $(a^m)^n$ như quy tắc · không công thức $\dfrac{n(n+1)}{2}$ dùng như đã biết (tự suy ra bằng ghép cặp rồi mới dùng). Không làm được trong phạm vi ⇒ **không bịa**, ghi `**Chưa chắc:**`.
2. **Trắc nghiệm** (`loai=trac_nghiem`): `dap_an=` là MỘT CHỮ CÁI A–D (khung đang để `?`); Phần 1 = 3–6 bước nghĩ + Phần 2 = lời giải ngắn kết bằng dòng **`Chọn B.`**; loại dần phương án bằng LÍ DO. Đáp án phải **tự giải rồi kiểm bằng máy** (số lớn / vét cạn bằng `node -e`; hình: dựng toạ độ số). Không phương án nào đúng, hoặc hai phương án đúng ⇒ đề in lỗi: chọn phương án gần nhất + `**Chưa chắc:**` nêu rõ. Câu "tìm khẳng định SAI" ⇒ nêu vì sao từng phương án đúng, phương án sai sai ở đâu.
3. **Trả lời ngắn / điền chỗ trống** (khung để `tu_luan`): nếu đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`) ⇒ `loai=tra_loi_ngan`, `dap_an=<số>` (chỉ số, không đơn vị); còn lại `tu_luan`, `dap_an=—`. Vẫn có Phần 1 + Phần 2.
4. **Câu ĐÚNG / SAI** (một câu có 4 mệnh đề a b c d, vd TC Câu 31–35): `tu_luan`, `dap_an=—`. Phần 1 nêu cách kiểm từng mệnh đề; Phần 2 ghi `a) Đúng.` / `b) Sai.` kèm lí do ngắn đúng-sai từng mệnh đề (tính ra số / nêu phản ví dụ). Đừng bỏ sót mệnh đề nào.
5. **Bài hình KHÔNG có hình sẵn mà cần hình để giải** (chứng minh, tính, "vẽ hình"): vẽ **hình giải** bằng code — `**Hình giải:** giai_<nhãn-không-dấu>.png` (một tệp / bài, đủ mọi điểm): viết `<LV>\tam\ve_p<P>.mjs`, `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`, chạy từ Repo `node "<LV>/tam/ve_p<P>.mjs"`; mỗi hình `await luu('<LV>/img', 'giai_bai13', w, h, svgDoc(w, h, T(dx, dy, body)))`. Mẫu: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`, `ve.mjs` của `lo/k6/GKI-*`. Hình **dựng đúng dữ kiện bằng toạ độ**, đánh dấu GIẢ THIẾT (gạch bằng nhau, góc vuông), không đánh dấu điều phải chứng minh; canvas cao ≤ 450 px, chừa ≥ 35 px dưới nhãn đáy; **vẽ xong mở ảnh bằng Read để kiểm**. Câu chỉ hỏi "tứ giác này là hình gì / diện tích / chu vi" với số đã cho (không cần điểm đặt tên) ⇒ không bắt buộc hình giải. Bài hình tự luận KHÔNG tách ý trong lời giải; Phần 2 ghi `a)` `b)`.
6. **Hình có sẵn trong đề mà `Đọc hình` lệch hình thật** ⇒ sửa dòng `**Ghi chú:** Đọc hình` cho đúng + ghi báo cáo.
7. **Đề cương có thể in lỗi** (số / số mũ / kết luận sai / thiếu dữ kiện / chữ cái biểu thức lệch với lệnh): giải theo cách hiểu hợp lí nhất, nêu cách hiểu đó và thêm/giữ `**Chưa chắc:** …` (chứng minh lỗi bằng máy khi có thể). **Giữ nguyên** mọi dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn; chỉ thêm khi cần. Đừng ghi tràn lan.
8. **Ví dụ in sẵn lời giải mẫu** (NTH, có thể CBQ): đáp số GIẢI ĐỘC LẬP, đừng chép lời giải mẫu; lỗi trong lời giải mẫu ⇒ `Chưa chắc` hoặc ghi chú.
9. **Không tách thêm câu, không gộp câu, không đổi nhãn.** Bài dùng ngầm hằng đẳng thức / chuyển vế để "ra đẹp" cũng không được.
10. **Dấu `.`** trong lời giải = dấu nhân (thập phân dùng `,`). Định dạng: `$25.4$`, `$2^2.3.5$`, `\text{Ư}`, `\text{ƯCLN}`, `\vdots`, số viết liền, KHÔNG `\cdot`/`\times`, chữ Việt trong công thức bọc `\text{}`.
11. Phần 2 theo khuôn k6.md §2 theo nhóm bài; bài thực tế ƯC/ƯCLN, BC/BCNN theo khuôn NNB00921 / 00925 (gọi ẩn + điều kiện → ƯC/BC → ƯCLN/BCNN → lọc → "Vậy …"). Bài tìm $x$: **tìm thành phần chưa biết, KHÔNG "chuyển vế"**.

## 4. Tự kiểm trước khi nộp (bắt buộc)

- Cổng ở mục 2 phải "✔ đạt cổng".
- Mọi đáp số tính lại bằng cách khác / `node -e`. Bài nhiều ý: thử lại từng ý.
- Mọi hình giải đã mở xem bằng Read.

## 5. Trả lời cuối

Vài dòng: số câu theo loại (TN / TLN / tự luận) · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · chỗ đề sai ảnh bạn đã sửa · cổng đạt chưa.
