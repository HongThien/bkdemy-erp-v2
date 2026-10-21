# Brief trạm SOẠN — lý thuyết nhóm + lý thuyết dạng + ví dụ cho bản đồ đề xuất K12 Hàm số (21/10)

> Thùy 21/10: *"làm thành 4 tầng giống lớp 11 (Giới hạn) … làm chi tiết 4 tầng ra thành file HTML để review."*
> Khuôn giống phần Giới hạn lớp 11 đã làm: **mỗi NHÓM có lý thuyết chung; mỗi DẠNG có mô tả + lý thuyết riêng + 2 ví dụ có lời giải**; ví dụ cần hình thì có hình.
> Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus. `<DIR>` = `kho-rules/dai/lo/k12-hs` (trong Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`) · `<JOB>` = mã lượt giao (J1…J10).
> Chạy mọi lệnh từ thư mục Repo.

Bạn soạn nội dung cho một số **nhóm bài** và **dạng bài** của bản đồ kiến thức mới K12 chủ đề "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số". Cần:
- **Lý thuyết NHÓM** (mỗi nhóm được giao): kiến thức, phương pháp, chú ý CHUNG cho cả nhóm.
- **Lý thuyết DẠNG** (mỗi dạng): kiến thức, phương pháp, chú ý RIÊNG của dạng (không chép lại lý thuyết nhóm).
- **Ví dụ** (mỗi dạng): **2 ví dụ có lời giải** — ví dụ 1 cơ bản đúng dạng, ví dụ 2 khó hơn một bậc (vẫn đúng dạng).

KHÔNG ghi DB, KHÔNG sửa tệp nào ngoài `<DIR>\ra\<JOB>.txt` và thư mục nháp `<DIR>\tam\<JOB>\`. Ghi tệp bằng công cụ Write (không heredoc).

## 1. Đọc trước

1. **Giao việc:** danh sách nhóm + dạng của lượt, lấy từ `<DIR>\cau-truc.mjs` (tên, **mô tả nhận biết** = ĐÍCH, loại hình cần). Đọc đúng các nhóm/dạng được giao; lý thuyết và ví dụ phải đúng dạng mô tả nói.
2. **Mẫu đã duyệt** (khuôn và độ dài): `<DIR>\mau.txt` — một khối NHÓM và hai khối DẠNG của phần Giới hạn lớp 11 + một ví dụ K12 có hình. **Bắt chước đúng khuôn và mức chi tiết.**
3. **Hồ sơ nguồn** (3 tác giả + đề thi, đã đếm sẵn): `<DIR>\ho-so\` — `hoso-tutam.md` (Từ Tâm) · `hoso-nbv-1-2.md` (đơn điệu, cực trị) · `hoso-nbv-3-4.md` (GTLN-GTNN, tiệm cận) · `hoso-nbv-5-6-7.md` (hàm bậc ba, hữu tỉ, ôn chương) · `hoso-pnl-1-2.md` · `hoso-pnl-3-5.md` (PNL) · `de-nbv-gk-hk.md` + `de-erp-theo-nhom-cu.txt` (đề thi) · `oldmap.md` (bản đồ cũ). Mỗi hồ sơ có bảng "kiểu câu" thật kèm dấu hiệu, cách giải và ví dụ trích (tên file + số câu) → dùng để biết dạng bài thật trông thế nào.
4. **Sách gốc dạng chữ** (tìm ý ví dụ, cách trình bày lý thuyết; Grep trong đó):
   `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\txt\` — `tutam\` (Từ Tâm) · `nbv\12-1` … `nbv\12-7` (NBV; file `A. LY THUYET` là lý thuyết SGK) · `pnl\BAI n…\` (PNL; chỉ đọc bản `_GV`). Quy ước file: công thức LaTeX trong `$…$`, `[[b]]` đậm, `[[img:…]]` = có hình (không xem được).
5. Luật định dạng nội dung: `spec-format-noidung.md` (đầu file) — các khung `##TC ##PP ##CY ##DN ##DL ##NX ##VD`.

## 2. Khuôn tệp ra `<DIR>\ra\<JOB>.txt`

```
=== N H1.1
@ly_thuyet:
##TC <tên khung — tuỳ chọn>
- …
##PP <tên phương pháp>
<bước 1 — mỗi dòng một bước, KHÔNG ghi "Bước 1">
…
##CY
- <bẫy thật>

=== H1.1.1
@ly_thuyet:
##TC …
##PP …
##CY …

@vi_du:
##VD
<đề ví dụ 1 — có thể kèm một dòng [[HINH {…}]]>

Bài giải:
<dòng 1>
…
Vậy …

##VD
<đề ví dụ 2>

Bài giải:
…
Vậy …
```

- Khối theo đúng thứ tự giao: **khối NHÓM (`=== N H1.1`, chỉ `@ly_thuyet:`) đứng ngay trước các dạng của nhóm đó**. Khối dạng có CẢ `@ly_thuyet:` và `@vi_du:`.
- **Lý thuyết** gồm các khung (mỗi khung một đoạn; các khung cách nhau MỘT dòng trống; trong khung không có dòng trống): `##TC` (kiến thức cần nhớ: định nghĩa / công thức / tính chất; mỗi ý một dòng, mở bằng "• " hoặc "- ") · `##PP <tên>` (BẮT BUỘC; 3–6 bước, mỗi dòng một bước trọn ý, KHÔNG ghi "Bước N") · `##CY` (bẫy hay sai thật). Thêm `##DN` / `##DL` / `##NX` khi thật cần. KHÔNG để ví dụ hay hình trong lý thuyết.
- **Ví dụ**: đoạn `##VD` = dòng `##VD` + đề (nhiều dòng, không dòng trống); MỘT dòng trống; đoạn `Bài giải:` (xuống dòng rồi lời giải **liền dòng**, mỗi phép biến đổi/mỗi câu một dòng, KHÔNG dòng trống bên trong), kết bằng `Vậy …`.
  Lời giải như học sinh viết vào vở: tập xác định, y′, giải y′=0, bảng xét dấu (nói bằng chữ hoặc dùng hình BBT), kết luận bằng lời.
  Hai ví dụ **khác hẳn nhau** về hàm số và số liệu; số liệu cho kết quả đẹp. Lấy ý từ sách thì được, nhưng phải tự giải lại đầy đủ.
- Ví dụ là **tự luận** (không đưa bốn phương án), trừ các dạng "chọn công thức/mệnh đề đúng" thì có thể viết a), b)… hỏi từng ý.
- **Định dạng:** công thức trong `$…$` (KHÔNG `$$`, KHÔNG `\(`) · dấu nhân `\cdot` (không `\times`) · phân số `\dfrac` · thập phân `2{,}5` · khoảng viết `(-\infty;1)` (dấu chấm phẩy) · tập số `\mathbb{R}` · đạo hàm `y'` hoặc `f'(x)` · hệ `$\begin{cases} … \\ … \end{cases}$` (một dòng) · chữ Việt trong công thức bọc `\text{…}` · chỉ **đậm**, không chữ nghiêng `*…*` · không emoji.

## 3. HÌNH trong ví dụ (đồ thị, bảng biến thiên, bảng xét dấu)

Hình **chỉ nằm trong ĐỀ** của ví dụ, viết thành MỘT dòng riêng: `[[HINH {json}]]`. Máy dựng hình (`<DIR>\ve.mjs`, đọc đầu tệp để biết cú pháp). Dạng cần hình (cột hình trong `cau-truc.mjs`: `bbt` · `dothi` · `ca-hai`) thì **ít nhất một ví dụ có hình**; dạng `ca-hai` nên có cả hình đồ thị lẫn bảng.
- **Đồ thị**: `{"loai":"dothi","x":[-3,3],"y":[-4,4],"f":[{"e":"x^3-3*x","ten":"y=f(x)"}],"diem":[…],"duong":[…]}` — đường cong **vẽ từ công thức** (`e`) nên luôn khớp. Đề chỉ nói "đồ thị như hình" thì **chọn một hàm cụ thể có cực trị/điểm đặc biệt là số nguyên** để đọc được trên lưới rồi lời giải đọc các số đó; không viết công thức hàm trong đề. Đồ thị của f′ thì vẽ công thức của f′ (đặt `ten":"y=f'(x)"`).
- **Bảng biến thiên / bảng xét dấu**: `{"loai":"bbt","x":["-∞","-1","1","+∞"],"dau":["+","-","+"],"y":["-∞","3","-1","+∞"]}` — cột gián đoạn dùng `"kd":{"2":"||"}` và cặp giá trị `["-∞","+∞"]`; `"hang":"dau"` = chỉ bảng xét dấu (đặt `"ten_dao":"f'(x)"`). Bảng biến thiên của hàm trừu tượng f (không cho công thức) là bình thường.
- Mỗi hình phải **khớp** hàm/giả thiết của ví dụ (máy kiểm vẽ thử; trạm soát đối chiếu). Không dùng hình khi đề không cần.
- Dùng `ten_dao`, `ten_ham` để đổi nhãn khi hàm tên khác y.

## 4. Kiến thức — đúng phạm vi

- Chương trình Toán 12 (CT 2018): đạo hàm, đơn điệu, cực trị, GTLN–GTNN, tiệm cận, khảo sát và vẽ đồ thị (bậc ba, bậc nhất/bậc nhất, bậc hai/bậc nhất). Không dùng tích phân, không dùng kiến thức sau chương. **Được dùng** bất đẳng thức Cô-si khi mô tả dạng nói rõ (vd tổng khoảng cách nhỏ nhất).
- Dạng mô tả mơ hồ ⇒ làm theo cách hiểu hợp lí nhất và GHI vào mục cuối tệp (mục 6), đừng tự đổi đích.
- Bài thực tế: gọi ẩn – đơn vị – điều kiện → lập hàm → khảo sát → đối chiếu miền thực tế → trả lời bằng ngữ cảnh.
- Quy tắc nhận diện dạng trong sách đôi khi sai/lặp (hồ sơ có ghi lỗi của tác giả): **đừng chép lỗi**.

## 5. Thử lại bằng máy (bắt buộc — Toán phải đúng)

Môi trường KHÔNG có Python; dùng **node**. Mọi ví dụ: viết script `<DIR>\tam\<JOB>\thu.mjs` kiểm bằng số: tính đạo hàm bằng sai phân (hoặc công thức bạn rút ra), quét lưới tìm nghiệm/cực trị sót, tính giới hạn bằng số, kiểm GTLN/GTNN bằng quét số, kiểm điều kiện của tham số bằng quét m (vd quét m trong [−10;10] bước nhỏ), đối chiếu đáp số với đề, kiểm các giá trị bạn ĐỌC từ hình bằng công thức vẽ hình. Rồi chạy máy kiểm khuôn tới lỗi 0:

```
node kho-rules/dai/lo/k12-hs/kiem.mjs kho-rules/dai/lo/k12-hs/ra/<JOB>.txt <danh sách mã (nhóm và dạng), cách nhau dấu phẩy, nhóm viết "H1.1" dạng viết "H1.1.1">
```
Mã nhóm trong danh sách kiểm dùng dạng `H1.1` (không có chữ N). Cảnh báo ⚠ (dạng cần hình mà không có hình) phải giải quyết hoặc giải thích trong mục 6.

## 6. Cuối tệp

Thêm mục `## GHI CHÚ CHO CEO` (sau khối cuối): dạng nào mô tả lệch tên / mơ hồ / bạn phải tự hiểu; dạng nào nguồn có lỗi (ghi rõ chỗ sai); dạng nào bạn ít chắc. Không có thì ghi "Không".

## 7. Trả lời cuối (≤ 120 từ)

Số nhóm · số dạng · số ví dụ · số hình · máy kiểm lỗi 0 chưa · đã chạy thử bằng số chưa · các điểm trong GHI CHÚ CHO CEO (mỗi điểm một dòng ngắn).
