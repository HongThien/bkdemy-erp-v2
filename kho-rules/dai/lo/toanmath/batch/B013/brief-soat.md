# ⚠️⚠️ BẢN ÁP DỤNG BATCH B013 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 8 TẢI TỪ TOANMATH (8 đề cương, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief đã chạy thật cho bộ 40 đề **giữa** kì 1 Toán 8 (10/10), đã đổi sẵn đường dẫn. Khuôn lời giải 2 phần, định dạng (`\cdot`), cổng, bẫy: GIỮ NGUYÊN.
**KHÁC hai điều lớn: (1) đây là ĐỀ CƯƠNG ôn tập (không phải đề kiểm tra) — khuôn ĐẦU TỆP và cách chia PHẦN dưới đây THAY mục 4 "Đầu tệp" của brief gốc;
(2) PHẠM VI KIẾN THỨC là CUỐI học kì 1** — mục "Phạm vi kiến thức" dưới đây THAY mọi chỗ bên dưới nói "tới giữa học kì 1". Chỉ khác những điểm sau:

- `<MA>` = `B013-NN` (01–08). Danh sách: `Repo\kho-rules\dai\lo\toanmath\batch\B013\ds-de.json` — mỗi mục có `don_vi` (trường), `nam` (năm đầu năm học),
  `de` (các trang có BÀI TẬP trong `goc.pdf`), `hd` (trang lời giải / đáp án — **cả 8 đề cương đều KHÔNG có**, `hd` rỗng).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B013\<MA>` (đã có `goc.pdf` = NGUYÊN file, `trang\p-N.png` 150 dpi, `img\` (TRỐNG — tự cắt hình), `tam\`, `de.boc.json`).
  Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B013\<MA>.soan.md` — **MỘT đề cương = MỘT tệp**, kể cả đề cương rất dài (B013-08 Archimedes ~280 câu sau tách ý):
  trạm soạn làm HẾT, không bỏ dở, không tách tệp. Tệp kiểm (trạm soát): `…\B013\<MA>.kiem.md`.
  **Không có `<LV>\de.json`** — gõ đề từ ảnh trang (đề cương có lớp chữ thì `pdftotext -layout` từ `goc.pdf` để đỡ gõ; lệch thì ảnh đúng).
  Đề mẫu khuôn lời giải vẫn là `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (chỉ học KHUÔN câu + lời giải, không học phạm vi kiến thức, không học dòng đầu tệp).

## ĐẦU TỆP + PHẦN cho ĐỀ CƯƠNG (thay khuôn đầu tệp của brief gốc)

```
# ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 8 năm <năm học, vd 2025-2026> — <don_vi>
nam: <nam trong ds-de.json>
bo_sach: <KNTT | Cánh Diều | CTST — theo bảng dưới>
kieu: de_cuong

## PHẦN 1 | <tên phần đúng như đề cương in, vd "A. Bài tập trắc nghiệm" / "Dạng 1. Phân tích đa thức thành nhân tử" / "Đề luyện số 1"> | <trac_nghiem|tu_luan|tra_loi_ngan>
```

- Dòng **`kieu: de_cuong` BẮT BUỘC** (vào tab Đề cương của Kho đề thi; không có thời gian làm bài). Tên in trên đề cương khác ("Hướng dẫn ôn tập", "Nội dung ôn tập", "Ôn tập học kì I")
  ⇒ vẫn dùng khuôn tên trên, ghi tên in gốc vào `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo đúng cách đề cương chia** (I. Trắc nghiệm / II. Tự luận / Phần Đại số – Hình học / Dạng 1, Dạng 2… / Đề luyện số 1, 2…), mỗi mục chia một `## PHẦN n | <tên> | <dạng thức>`;
  phần có cả câu trắc nghiệm lẫn tự luận ⇒ dạng thức `tu_luan` (loại từng câu vẫn ghi đúng ở `###`). Đề cương đánh số lại "Bài 1" ở mỗi Dạng ⇒ mỗi Dạng một PHẦN
  để nhãn **duy nhất trong PHẦN**. Nhãn câu giữ như in.
- **Tách ý** theo luật brief gốc (§3 mục 4: chỉ bài Tính / Rút gọn / Tính giá trị / Phân tích nhân tử / Tìm $x$). Ý đánh chữ ⇒ `Bài 2c`; ý đánh số `1) 2) …` ⇒ `Bài 2.3`
  (ý số 3); bài đánh số kiểu `Bài 1.1` có ý a) b) ⇒ `Bài 1.1a`. Bài hình, bài lời văn, bài cho sẵn biểu thức rồi hỏi nhiều ý: GIỮ CHUNG một câu.
- **Phần LÝ THUYẾT chỉ chữ** (tóm tắt kiến thức, "phát biểu quy tắc…", "nêu định nghĩa…") KHÔNG phải bài tập ⇒ KHÔNG đưa vào. Bìa, chữ ký, quảng cáo: bỏ.
- **Không có lời giải / đáp án in kèm** ở cả 8 đề cương ⇒ tự giải toàn bộ, lời giải CHI TIẾT đủ 2 phần, mọi đáp số thử lại bằng máy; chỗ chưa tự kiểm chứng bằng máy ⇒ `**Chưa chắc:**`.
- Phân kho: hình học (tứ giác, Thalès, đường trung bình, phân giác, Pythagore, hình chóp, bài hình có vẽ / chứng minh) ⇒ `kho=hinh_hoc`; còn lại (đa thức, HĐT, phân tích,
  phân thức, hàm số, **dữ liệu – biểu đồ**, bài thực tế đại số) ⇒ `kho=dai`.
- **Hình:** `img\` đang TRỐNG — câu có hình in sẵn ⇒ tự cắt từ `goc.pdf` (lệnh `pdftoppm -r 150 … -x -y -W -H` ở brief gốc §2/§3 mục 7), đặt tên `p<trang>c<số>.png`,
  mở ảnh vừa cắt để kiểm, thêm dòng `**Hình:**`. Bài **vẽ biểu đồ** / **vẽ đồ thị hàm số** / bài hình không cho hình ⇒ vẽ bằng code như `**Hình giải:**` (brief gốc §3 mục 8;
  cột / đoạn thẳng / quạt tròn tự dựng bằng phần tử SVG trong `svgDoc`, số liệu đúng tỉ lệ). Cắt / vẽ xong, trạm soát duyệt xong ⇒ người điều phối chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B013` (hình sống trên kho) — trạm KHÔNG chạy lệnh này.
- **Cảnh báo:** KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq`, `\times` qua chuỗi JS / node (`"\t"`, `"\f"`, `"\n"` biến thành ký tự thật) — viết / sửa tệp soạn bằng công cụ Write / Edit trực tiếp.

## Ghi chú từng đề cương

| `ma` | Trường | Trang `de` | Chữ / scan | Ghi chú |
|---|---|---|---|---|
| B013-01 | Thanh Am 2025-26 | 1–4 | chữ | tên in "Hướng dẫn ôn tập học kì I"; có phân thức, hàm số (cước cuộc gọi), hình chóp, Pythagore |
| B013-02 | Thọ Lộc 2025-26 | 1–6 | **scan** | 12 TN + Đại 8 bài + Hình 8 bài + Dữ liệu 5 bài; chữ ký "Phúc Thọ, 25/11/2025" |
| B013-03 | Nguyễn Bỉnh Khiêm 2024-25 | 1–5 | chữ | 34 câu TN + 9 câu tự luận; trang 6 chữ ký, 7 quảng cáo |
| B013-04 | Thành Công 2025-26 | 1–4 | chữ | Phần 1 Đại · Phần 2 Hình · Phần 3 Nâng cao; nhiều bài trùng đề cương Thành Công 2024 (B015-03) — chép đúng đề của mình |
| B013-05 | Nghĩa Tân 2024-25 | 1–5 | chữ | Dạng 1–6; phạm vi in: "Đại số hết chương 2, Hình tới hết bài Đường trung bình của tam giác" |
| B013-06 | Thăng Long 2024-25 | 1–4 | chữ | "lý thuyết chương 1 đến 4"; Phần Đại số (có biểu đồ) + Phần Hình học (Thalès, phân giác) |
| B013-07 | Thọ Lộc 2024-25 | 1–5 | **scan** | ≈ tập con của B013-02 (không có trắc nghiệm; khác Đại Bài 7, Hình Bài 8); trang 6 trắng |
| B013-08 | Archimedes 2025-26 | 1–11 | **scan** | phạm vi in: "Đại số hết Dữ liệu và biểu đồ, Hình học hết chương Định lý Thales"; II. Bài tập (Bài 1–48, rất nhiều ý) + III. 6 Đề luyện; ~280 câu |

Đề scan: chữ nhỏ ⇒ phóng 300 dpi, không đoán (brief gốc §2).

## ⭐ PHẠM VI KIẾN THỨC — CUỐI HỌC KÌ 1 KHỐI 8 (THAY mục "Kiến thức" của brief gốc và luật "tới giữa học kì 1" của `k8.md` §10)

Áp luật `k8.md` §10 đổi mốc: **whitelist = những gì ĐỀ CƯƠNG ĐÓ kiểm tra tới, theo bộ sách của trường, tính tới HẾT học kì 1.** Nhân chứng mạnh nhất là mục
"Nội dung ôn tập / Phạm vi kiến thức" in ngay đầu đề cương; nhìn TOÀN BỘ bài tập để xác nhận. Kiến thức một chương chỉ dùng ở đề cương CÓ bài kiểm tra chương đó.

| Nhóm | Đề cương | Kiến thức đề cương kiểm tra tới (ngoài Ch I đa thức + Ch II HĐT / phân tích nhân tử + Ch III tứ giác tới hình vuông) | `bo_sach` |
|---|---|---|---|
| KNTT Tập 1 trọn | 02 Thọ Lộc 2025 · 04 Thành Công · 05 Nghĩa Tân · 06 Thăng Long · 07 Thọ Lộc 2024 · 08 Archimedes | **Ch IV:** định lí Thalès (thuận, đảo) · **đường trung bình tam giác** · tính chất đường phân giác (Nghĩa Tân: phạm vi in dừng ở "Đường trung bình" — tính chất phân giác chỉ dùng nếu có bài hỏi tới) · **Ch V:** thu thập, phân loại dữ liệu, bảng, biểu đồ (tranh, cột, cột kép, đoạn thẳng, quạt tròn) | KNTT |
| Phân thức / hình chóp / Pythagore | 01 Thanh Am (có **hàm số**) · 03 Nguyễn Bỉnh Khiêm 2024 | **Phân thức đại số:** khái niệm, điều kiện xác định, tính chất cơ bản, rút gọn, quy đồng, cộng trừ nhân chia, phân thức biểu thị đại lượng thực tế · **hàm số** (chỉ Thanh Am): giá trị, "có là hàm số không" · **hình chóp tam giác đều, tứ giác đều**: trung đoạn, diện tích xung quanh, thể tích · **định lí Pythagore** thuận + đảo | Đoán: 01 `Cánh Diều` (có hàm số); 03 `CTST`. Ghi rõ "đoán" trong GHI CHÚ |

**Dùng được ở MỌI đề cương:** nền lớp 6–7 (bảng `k8.md` §1.2 dòng "Nền đã học trước lớp 8": tam giác bằng nhau, tam giác cân, **trọng tâm & tỉ số $\tfrac23$**, đường vuông góc–đường xiên…;
hình hộp chữ nhật, hình lập phương lớp 7) · toàn bộ Ch I–III KNTT (đơn thức → hình vuông, gồm trung tuyến ứng cạnh huyền khi đề cương có hình chữ nhật trở lên)
· hằng đẳng thức + phân tích nhân tử (đặt nhân tử chung, hằng đẳng thức, nhóm, tách hạng tử) · $A\cdot B=0\Rightarrow A=0$ hoặc $B=0$ · GTLN/GTNN bằng hoàn thành bình phương.

**CẤM ở MỌI đề cương (học kì 2 của mọi bộ sách):** tam giác đồng dạng, hình đồng dạng · tỉ số lượng giác · xác suất · tên gọi "phương trình bậc nhất", "tập nghiệm $S=\{…\}$",
"giải bài toán bằng cách lập phương trình" — tìm $x$ vẫn biến đổi từng dòng bằng quy tắc chuyển vế; ẩn ở mẫu thì nêu điều kiện xác định, nhân chéo theo tỉ lệ thức (lớp 7), đối chiếu điều kiện
· bất đẳng thức Cô-si (AM–GM) — GTLN/GTNN dùng $(a-b)^2\ge 0$. Bài nâng cao mà cách giải duy nhất cần kiến thức cấm (vd chứng minh tỉ số bằng đồng dạng) ⇒ tự chứng minh bằng
Thalès / hình bình hành; không được ⇒ `**Chưa chắc:**` nói rõ, KHÔNG dùng công cụ cấm.

**Chỉ dùng khi chính đề cương đó kiểm tra tới (không thì CẤM, cần thì tự chứng minh trong lời giải — `k8.md` §1.1 luật 3):**
- **Định lí Thalès, tính chất đường phân giác** — nhóm KNTT. **Hệ quả Thalès** $\dfrac{DE}{BC}=\dfrac{AD}{AB}$ không có trong lý thuyết `k8.md` §1.2 ⇒ tự chứng minh
  (kẻ song song, hình bình hành — mẫu HDG C4 B1 6A/6B) rồi mới dùng.
- **Đường trung bình của tam giác — ĐƯỢC DÙNG ở đề cương cuối kì 1 K8 có kiểm tra tới (Thùy 13/11)** = cả nhóm KNTT ở bảng trên: dùng thẳng, gọi tên, KHÔNG cần `**Chưa chắc:**`.
  Đề cương nhóm phân thức (01, 03) không có bài Thalès / đường trung bình ⇒ vẫn tự chứng minh bằng hình bình hành / tam giác bằng nhau / trọng tâm (brief gốc §7 "Bẫy đã cắn thật").
  **Đường trung bình của HÌNH THANG** (KNTT 8 không có) ⇒ cấm ở mọi đề cương, tự chứng minh.
- **Định lí Pythagore, phân thức, hàm số, hình chóp** — chỉ ở đề cương có (bảng trên). Đề cương nhóm KNTT gặp biểu thức có biến ở mẫu ⇒ xử lí như chia cho số khác 0, nêu điều kiện.

Kiến thức nào đề cương cần mà bảng trên và `k8.md` không nói rõ ⇒ giải bằng cách gần nền nhất, thêm `**Chưa chắc:**` nói rõ đã dùng gì — KHÔNG tự quyết thay Thùy.
Năm học 2024–2025 hay 2025–2026 đều theo cùng phạm vi này.

---

# Brief giao trạm SOÁT — khối 8, bộ đề giữa kì 1 (40 đề, 10/10)

> Khuôn chép từ `k6-brief-soat.md`. `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B013\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra giữa học kì 1 Toán 8 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k8.md` (§1 luật kiến thức, §1.5–§1.6, §3, §10).
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`. Đề scan chữ nhỏ ⇒ cắt phóng to 300 dpi từ `<LV>\goc.pdf`
   (`pdftoppm -r 300 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/tam/<tên>"`) trước khi giải.
3. Tự giải mọi câu của đề. Đa thức / hằng đẳng thức / tìm $x$ tính bằng script node (thay số kiểm hai vế), không nhẩm.
   Đề có IN SẴN bảng đáp án / hướng dẫn chấm ⇒ vẫn tự giải mù trước, SAU ĐÓ mới đọc bảng in và ghi thêm cột "đáp án in trong đề"; Pha 2 đối chiếu cả ba nguồn.
4. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B013\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc đề mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\toanmath\batch\B013\brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\toanmath\batch\B013\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, dấu, ngoặc, tên điểm, phương án, đủ ý, không sót câu); câu nào bị bỏ thì có lí do chưa.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (chỉ dùng cái học tới giữa kì 1 theo bộ sách của chính đề; KHÔNG đường trung bình, Thalès,
     đồng dạng, lượng giác; Pythagore / hằng đẳng thức / phân tích nhân tử / hình chữ nhật trở lên chỉ khi đề có chạm tới — kể cả dùng **ngầm** không gọi tên;
     "tứ giác có ba góc vuông" không phải dấu hiệu; **đặt thừa số chung theo tính chất phân phối $ab+ac=a(b+c)$ là kiến thức lớp 6–7, KHÔNG phải vi phạm** —
     đừng sửa những chỗ đó; cái cấm là các phương pháp phân tích nhân tử của Chương II: dùng hằng đẳng thức, nhóm, tách hạng tử) · Phần 2 đúng khuôn vở lớp 8, mỗi khẳng định hình có lí do · dấu nhân `\cdot` · Phần 1 có 3–6 bước là
     **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối, không chép lại Phần 2); bài hình chứng minh thì Phần 1 đi theo chiều phân tích đi lên
     ("muốn có …, cần …") và Phần 2 đi ngược lại, khớp từng mắt xích.
   - **Phân loại**: `kho` (`hinh_hoc` = hình; `dai` = còn lại) · `loai` (trả lời ngắn chỉ khi đáp số là một số nguyên / thập phân ≤ 4 ô theo ĐÚNG dạng đề hỏi;
     biểu thức, phân số, nhiều giá trị ⇒ `tu_luan`) · tách ý đúng luật (chỉ bài Tính / Rút gọn / Phân tích nhân tử / Tìm $x$ có các ý độc lập; bài hình và bài
     chung dữ kiện KHÔNG tách).
   - **Ghi chú**: dòng `**Ghi chú:**` chỉ dành cho lỗi của ĐỀ GỐC / điều người duyệt cần biết; ghi chú kiểu "bản máy gõ nhầm…" thì xoá.
   - **Hình**: mở tệp trong `<LV>\img\` ứng với dòng `**Hình:**` (đúng hình của câu, không cụt) và dòng `**Hình giải:**` (hình vẽ bằng code: đúng dữ kiện đề,
     đủ điểm, tên điểm đúng chỗ, không đánh dấu điều phải chứng minh, nhãn không đè / không cụt). Hình giải sai ⇒ sửa `<LV>\tam\ve.mjs` rồi vẽ lại
     (`node "<LV>/tam/ve.mjs"` từ thư mục Repo). Bài hình tự luận đề không cho hình mà bản soạn chưa có `**Hình giải:**` ⇒ bạn vẽ thêm (cách vẽ trong brief soạn mục 3.8).
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn
   **chắc chắn**. Chỗ bạn không chắc (đề mơ hồ, hai cách hiểu, ảnh mờ, hai bên lệch mà không phân xử được) ⇒ thêm / giữ dòng `**Chưa chắc:** …`
   trong câu đó (đặt sau đề, trước `**Phần 1. Hướng dẫn**`) — CEO sẽ xem kĩ các câu này. Dòng `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn đúng ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B013/<MA>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B013\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 120 từ): kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
