# Phụ lục brief — ba đề cương Toán 8 GKI 2026–2027 Thùy gửi 24/10: Thanh Xuân (TX) · Nam Từ Liêm (NTL) · tuyển tập không ghi trường (DTK8)

> Dùng CÙNG `brief-soan.md` / `brief-soat.md` của đề cương Ngôi Sao Hoàng Mai (đọc chúng TRƯỚC — khuôn lời giải 2 phần, định dạng `\cdot`, luật cấm, cách vẽ hình giải, cách tự kiểm) và
> `brief-bo-sung-4-DE-19-10.md` §3 (luật câu TRẮC NGHIỆM + câu "điền chỗ trống") — phụ lục này **THAY** đường dẫn / phạm vi / luật "đề sai". Khi brief cũ nói `NSHM-GKI-2026` / `<LV>` / ảnh `anh\1.png…` / `crop.mjs` / phạm vi mục 3.4 ⇒ dùng bảng dưới.

## 1. Thay đường dẫn

| | TX | NTL | DTK8 |
|---|---|---|---|
| `<MA>` | `TX-GKI-2026` | `NTL-GKI-2026` | `DTK8-GKI-2026` |
| `<LV>` | `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\TX-GKI-2026` | `…\NTL-GKI-2026` | `…\DTK8-GKI-2026` |
| Tệp của bạn | `Repo\kho-rules\dai\lo\k8\de-cuong\<MA>.p<P>.soan.md` (đã có khung: tiêu đề + đề từng câu + dòng `**Ghi chú:**` / `**Hình:**`) |

- **Nguồn đề:** ảnh trang 130 dpi `<LV>\anh\t-*.png` (NGUỒN CHÍNH — mở HẾT trang chứa câu của bạn bằng công cụ Read; liệt kê thư mục để biết tên tệp) và `<LV>\goc.pdf`. **Công thức trong lớp chữ PDF hỏng** ⇒ KHÔNG tin `pdftotext`.
  Phóng to chỗ không chắc: `pdftoppm -r 260 -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> -png "<LV>\goc.pdf" "<LV>\z\<tên>"` (toạ độ ở 260 dpi = 2 × toạ độ ảnh 130 dpi) rồi Read. KHÔNG dùng `crop.mjs`.
- Vết viết tay / khoanh đáp án của học sinh trên ảnh (NTL tr.1) **bỏ qua**; lề sách tối, bóng chữ mặt sau (DTK8, NTL tr.16) — bỏ qua.
- **Hình có sẵn trong đề** đã cắt vào `<LV>\img\de_*.png` và khai bằng dòng `**Hình:**` — giữ; **`**Ghi chú:** Đọc hình: …` là chỗ người gõ đề tóm tắt dữ kiện trên hình — đối chiếu với hình, lệch thì hình đúng.**
- Bài hình KHÔNG có hình trong đề ⇒ vẽ **hình giải** (`**Hình giải:** giai_<nhãn-không-dấu>.png`, một tệp / bài, đủ mọi điểm của mọi ý) bằng script `<LV>\tam\ve_p<P>.mjs` (xem brief cũ; mở ảnh bằng Read để kiểm nhãn không đè nét). Bài hình tự luận KHÔNG tách ý.
- **Lệnh cổng** (từ thư mục Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem`.
- **Nhãn câu** giữ nguyên, kể cả tiền tố ("Dạng 2 Bài 3a", "Hình Bài 2", "Tiết 19 VN Bài 1b", "Đề 3 Bài 4a", "Khác Bài 5"…). Không tách / gộp / đổi nhãn.
- Script tạm / tệp phụ đặt trong `<LV>\tam\` với tên RIÊNG của trạm (chứa `p<P>`); không dùng tên chung (nhiều trạm chạy song song).

## 2. LUẬT MỚI Thùy 24/10 — đề SAI: giải bình thường, GHI RÕ "đề sai", không treo CHƯA CHẮC

(Thay mọi chỗ brief cũ bảo "thêm `**Chưa chắc:**`" cho đề in sai.)
- Đề SAI nhưng giải được (giả thiết vô lý, số liệu không thực tế, thiếu / thừa dữ kiện nhưng còn làm được, in sai tên điểm, đáp số không tồn tại…) ⇒ **giải bình thường theo số liệu / hình**, và ghi rõ:
  (1) dòng `**Ghi chú:** Đề sai: …` (nói đề sai ở đâu, đúng phải là gì nếu biết) **thay** cho `**Chưa chắc:**`; (2) MỘT dòng `Lưu ý: …` ở **đầu Phần 2** để học sinh biết (cùng khuôn "Lưu ý" các câu cũ). KHÔNG để lại dòng `**Chưa chắc:**` cho loại này.
- Đáp án đúng rõ ràng, chỉ in sai đơn vị / chữ (vd "cm" thay "m") ⇒ **sửa chữ đề** ở dòng `**Đề:**` + `**Ghi chú:**` nói đã sửa.
- Thiếu số nhưng làm được bằng quy tắc ⇒ làm bằng quy tắc, nêu rõ.
- `**Chưa chắc:**` CHỈ còn dùng khi CHỮ TRONG ẢNH thật sự không đọc được (mờ, che) và hai cách đọc cho đáp số khác nhau — rất hiếm.
- Câu in "đáp số theo đề" mà máy kiểm ra khác (đề in lỗi) ⇒ giải đúng, nêu đáp số đúng.

## 3. Đường trung bình CẤM ở cả ba đề cương (Thùy 20/10: chỉ Ngôi Sao Hoàng Mai được dùng)

Bài có dữ kiện kiểu đường trung bình (hai trung điểm của hai cạnh) ⇒ tự chứng minh bằng hình bình hành / tam giác bằng nhau / trọng tâm (lớp 7) / đường trung tuyến ứng cạnh huyền; **không** gọi tên, **không** dùng ngầm "đoạn nối trung điểm song song và bằng nửa cạnh".
CẤM thêm ở cả ba: Thalès · đồng dạng · Pythagore (thuận / đảo) · tỉ số lượng giác · phân thức đại số · "phương trình / tập nghiệm" · công thức nghiệm (Δ) · Vi-ét. Nền lớp 6–7 luôn được dùng. Đặt thừa số chung (tính chất phân phối) luôn được dùng.

## 4. Phạm vi kiến thức từng đề cương (thay mục 3.4 của brief cũ; luật chung k8.md §1)

| | **TX (Thanh Xuân)** | **NTL (Nam Từ Liêm)** | **DTK8** |
|---|---|---|---|
| **Đại số** | Chương I + II đầy đủ: đơn thức, đa thức, 7 hằng đẳng thức, phân tích nhân tử (đặt nhân tử chung, nhóm hạng tử, hằng đẳng thức, đặt ẩn phụ), tìm $x$ bằng phân tích. Bài "nâng cao" cần hoàn thành bình phương (dùng $(a\pm b)^2$) | Chương I + II đầy đủ **kể cả tách hạng tử, nhẩm nghiệm (đề ghi "ứng dụng định lí Bézout" ⇒ ĐƯỢC dùng nhẩm nghiệm / $f(a)=0$ ⇒ chia hết cho $x-a$ ở các câu Tiết 20)**, $a^3+b^3+c^3-3abc$ (bài về nhà e*) | **Chỉ Chương I** (đơn thức nhiều biến, đa thức nhiều biến, các phép tính). Hằng đẳng thức CHƯA đặt tên: $(a\pm b)^2$ viết thành $(a\pm b)(a\pm b)$ rồi nhân; riêng **Dạng 5 (Bài 22–29, nâng cao)** được nhân trực tiếp / nhóm hạng tử / hoàn thành bình phương bằng cách nhân hai thừa số giống nhau; KHÔNG phân tích nhân tử đặt tên (trừ đặt thừa số chung) |
| **Hình học** | Chương III đến **hình vuông** (hình thang, thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông; trọng tâm lớp 7 được dùng) | Đề ghi **chỉ hình thang, hình thang cân, hình bình hành** ⇒ KHÔNG hình chữ nhật / thoi / vuông (nếu một bài đề in nhắc tới thì làm bằng hình bình hành + tam giác bằng nhau, nêu rõ) | Chương III đến **hình vuông** |

## 5. Lưu ý chung riêng từng đề cương

**TX** — Phần nâng cao Bài 1–5 là các bài hoàn thành bình phương (tổng bình phương $=0$, tìm GTNN hai biến / ba biến); mỗi bước đúng với MỌI giá trị thực, kiểm ĐỦ điều kiện dấu "=" (tồn tại $x,y,z$ để dấu "=" xảy ra); máy kiểm bằng lưới số / đồng nhất thức BigInt.
Dạng 1 Bài 5 (tìm số tự nhiên $n$ để phép chia là phép chia hết) xét ĐỦ hai chiều (đơn thức chia hết đơn thức ⇒ so sánh số mũ; $n\in\mathbb{N}$, kể cả $n=0$). Hình Bài 1c: $AK=3AD$ ⇒ $D$ là trọng tâm tam giác $AHC$ (hai trung tuyến $CO$ và $AI$), KHÔNG đường trung bình.

**NTL** — Tiết 19–21 là phiếu luyện tập "tại lớp / về nhà"; đề tự luyện 01–04 có phần trắc nghiệm (luật mục 3 của `brief-bo-sung-4-DE-19-10.md`). Có 2 câu viết **tiếng Anh** (Đề 2 Bài 6b, Đề 3 Bài 5b): giải bằng tiếng Việt, đề giữ nguyên tiếng Anh. Trắc nghiệm hình "khẳng định đúng/sai" (Hình Bài 2, 9 mệnh đề): một câu tự luận, đáp = bảng `Đúng/Sai` từng mệnh đề + lý do ngắn mỗi mệnh đề; giữ Phần 1 / Phần 2.
Nâng cao: Dạng 3 Bài 4, 5 (đề thi vào 10 chuyên ĐHSP) — giải đầy đủ, kiểm máy.

**DTK8** — Bài 1 (4 đơn thức): hệ số, phần biến, bậc từng đơn thức trước khi thu gọn. Bài 6–9 bài toán thực tế: viết biểu thức rồi thay số; Bài 8 hình vườn: kích thước trong hình. Bài 10–14 hình thực tế có hình sẵn (hình vuông, thang cân, chữ nhật, thoi, bình hành) — kết luận một đáp số với lí do tính chất. Bài 24–26 (số tự nhiên có chữ số, nâng cao): dùng biểu diễn $\overline{abc}=100a+10b+c$; vét cạn bằng máy rồi trình bày bằng lập luận.
