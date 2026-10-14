# Brief trạm SOẠN — lý thuyết + ví dụ cho bản đồ mới khối 9 (14/10)

> CEO 14/10: *"bản đồ lớp 9 mới đã xong dạng bài và mô tả. M điền lý thuyết và ví dụ nhé. Tham khảo từ bản đồ cũ và các quyển sách mà t gửi"*.
> Cùng cách đã làm cho bản đồ mới khối 8 hôm nay (`kho-rules/dai/ban-do-moi-k8-ghi-chu.md`). Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\bdm\k9` · `<NHOM>` = mã lượt giao (A1…A8) · Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.

---

Bạn soạn nội dung cho một số **dạng bài** của bản đồ kiến thức mới khối 9 (kho Toán của BKdemy). Mỗi dạng cần:
- **Lý thuyết** (`ly_thuyet`) — CHỈ khi hồ sơ ghi "Lý thuyết dạng: TRỐNG". Dạng đã có lý thuyết thì KHÔNG viết lại.
- **Ví dụ** (`vi_du`) — mọi dạng được giao: **2 ví dụ có lời giải**, ví dụ 1 cơ bản đúng dạng, ví dụ 2 khó hơn một bậc (vẫn đúng dạng).

KHÔNG ghi DB, KHÔNG sửa tệp nào trong Repo. Bạn chỉ ghi `<LV>\ra\<NHOM>.txt` và script nháp trong `<LV>\tam\<NHOM>\`. Ghi tệp bằng công cụ Write (không heredoc).

## 1. Đọc trước

1. Hồ sơ từng dạng: `<LV>\<mã dạng>.md` — mô tả của CEO (ĐÍCH: lý thuyết và ví dụ phải đúng dạng mô tả này), lý thuyết dạng đang có (nếu có),
   dạng tương ứng ở **bản đồ cũ** (lý thuyết cũ + câu mẫu trong kho). Lý thuyết của NHÓM (đã có, không sửa): `<LV>\nhom-<mã nhóm>.md` nếu có tệp.
   Toàn bộ lý thuyết bản đồ cũ khối 9: `<LV>\lt-cu-k9.md`.
2. Sách CEO gửi (tham khảo cách trình bày và lấy ý ví dụ): `E:\BK ACADEMY\Tài liệu tham khảo\K9\` — `ly-thuyet-va-phan-dang-bai-tap-toan-9-hoc-ki-1-ngo-duc-tai.pdf`
   (lý thuyết + phân dạng HK1), `tai-lieu-hoc-tap-mon-toan-9-hoc-ki-1-nam-hoc-2025-2026.pdf`, `tu-luan-va-trac-nghiem-he-thuc-luong…pdf` (thực ra là sách HK2).
   Bản chữ đã trích + bài đã giải sẵn theo nhóm (LaTeX đúng, dễ tìm hơn PDF):
   `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\0b0aaccd-e68b-45b5-96e4-b914b4d1311c\scratchpad\k9c\out\*.md` (`ndt-*` = Ngô Đức Tài, `nt-*` = Tài liệu học tập, `tc-*` = sách HK2)
   và `…\k9c\txt\ndt.txt` (chữ trích của quyển Ngô Đức Tài — phần lý thuyết từng bài). Dùng Grep để tìm.
3. Luật trình bày khối 9: `Repo\kho-rules\dai\k9.md` §1 (kiến thức theo thứ tự bài), §2 (khuôn trình bày từng dạng), §3 (định dạng).

## 2. Khuôn tệp ra `<LV>\ra\<NHOM>.txt`

```
=== NDB00701
@ly_thuyet:
##TC
- …
- …

##PP <tên phương pháp>
<bước 1 — mỗi dòng một bước, KHÔNG ghi "Bước 1">
<bước 2>
<bước 3>

##CY
<bẫy / lưu ý thật>

@vi_du:
##VD
<đề ví dụ 1>

Bài giải:
<dòng 1>
<dòng 2>
…
Vậy …

##VD
<đề ví dụ 2>

Bài giải:
…
Vậy …
```

- Khối theo đúng thứ tự giao. Dạng đã có lý thuyết: bỏ hẳn phần `@ly_thuyet:`.
- **Lý thuyết** gồm các khung (mỗi khung một đoạn, các khung cách nhau MỘT dòng trống, trong khung không có dòng trống):
  `##TC` (kiến thức cần nhớ: định nghĩa / công thức / tính chất dùng cho dạng, mỗi ý một dòng "- ") ·
  `##PP <tên>` (BẮT BUỘC — phương pháp giải dạng này, 3–6 bước, mỗi dòng một bước trọn ý, KHÔNG ghi "Bước N") ·
  `##CY` (tuỳ chọn — bẫy hay sai thật của dạng). Có thể thêm `##DN` (định nghĩa) / `##DL` (định lý) / `##NX` khi thật cần. KHÔNG để ví dụ trong lý thuyết.
  Lý thuyết là **của dạng** (cụ thể cho dạng), không chép lại lý thuyết chung của nhóm — đọc tệp nhóm để khỏi lặp.
- **Ví dụ**: đoạn `##VD` = dòng `##VD` + đề (đề có thể nhiều dòng, không dòng trống); MỘT dòng trống; đoạn lời giải mở bằng dòng `Bài giải:`,
  rồi lời giải **liền dòng** (mỗi phép biến đổi / mỗi câu một dòng, KHÔNG có dòng trống bên trong — CEO 09/10), kết bằng câu `Vậy …`.
  Lời giải trình bày như học sinh viết vào vở (khuôn `k9.md` §2): điều kiện xác định, mỗi phép biến đổi một dòng, đối chiếu điều kiện, kết luận bằng lời.
  Hai ví dụ phải **khác** các ví dụ đã có trong lý thuyết dạng / nhóm (đừng chép lại), số liệu ra kết quả đẹp. Lấy ý từ sách / kho thì được, nhưng phải giải lại đầy đủ.
- **Định dạng:** công thức trong `$…$` (KHÔNG `$$`, KHÔNG `\(`) · dấu nhân `\cdot` (không `\times`) · phân số `\dfrac` · thập phân `2{,}5` · hệ `$\begin{cases} … \\ … \end{cases}$` (một dòng) ·
  chữ Việt trong công thức bọc `\text{…}` · chỉ dùng `**đậm**`, không chữ nghiêng `*…*` · không emoji.

## 3. Kiến thức — đúng phạm vi của dạng

- Bám **mô tả của CEO**: ví dụ phải đúng loại bài mô tả nói (vd "tử là hằng số", "có giá trị tuyệt đối", "tổng – hiệu thời gian"…). Mô tả và tên dạng lệch nhau, hay mô tả mơ hồ ⇒ làm theo cách hiểu hợp lí nhất
  và GHI vào mục cuối tệp (mục 5), đừng tự đổi đích.
- Phạm vi: chương của dạng trong chương trình lớp 9 (KNTT). Phương trình / hệ / bất phương trình bậc nhất và căn thức: **không dùng Δ / công thức nghiệm / Viète** — phương trình bậc hai
  (nếu buộc phải có) chọn số để phân tích được thành nhân tử. Nhóm **"ứng dụng Côsi"** do CEO đặt ⇒ được dùng bất đẳng thức Cô-si (nêu rõ điều kiện các số không âm và dấu "=").
  Dạng khác không dùng Cô-si thẳng.
- Bài lời văn (lập phương trình / hệ / bất phương trình): khuôn gọi ẩn – đơn vị – điều kiện → biểu diễn → lập → giải → đối chiếu → trả lời đủ mọi đại lượng đề hỏi.

## 4. Thử lại bằng máy (bắt buộc)

Mọi ví dụ: viết script node `<LV>\tam\<NHOM>\thu.mjs` thay đáp số vào ĐỀ (phân số chính xác hoặc sai số $10^{-9}$), thử từng dòng biến đổi bằng ≥ 3 giá trị của biến (biểu thức chứa căn: $x$ thoả điều kiện),
quét lưới tìm nghiệm sót (phương trình, bất phương trình, "tìm $x$ nguyên"), kiểm GTLN/GTNN bằng quét số. Rồi chạy máy kiểm khuôn (từ thư mục Repo) tới khi lỗi 0:

```
node kho-rules/dai/lo/k9/ban-do/kiem.mjs "C:/Users/WBPC/bk-kho-lam-viec/bdm/k9/ra/<NHOM>.txt" <danh sách mã dạng, cách nhau dấu phẩy>
```

## 5. Cuối tệp

Thêm mục `## GHI CHÚ CHO CEO` (sau khối cuối): dạng nào mô tả lệch tên / mơ hồ / bạn phải tự hiểu; dạng nào lý thuyết bản đồ cũ có lỗi (ghi rõ chỗ sai); dạng nào bạn ít chắc. Không có thì ghi "Không".

## 6. Trả lời cuối (≤ 120 từ)

Số dạng · số lý thuyết đã soạn · số ví dụ · máy kiểm lỗi 0 chưa · đã chạy thử lại bằng máy chưa · các điểm trong GHI CHÚ CHO CEO (mỗi điểm một dòng ngắn).
