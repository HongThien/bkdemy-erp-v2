# Brief trạm SOẠN — lý thuyết + ví dụ cho bản đồ mới khối 11 (14/10)

> CEO 14/10: *"khối 11 xong bản đồ mới — m fill lý thuyết và ví dụ tương ứng với các dạng bài. Đọc bản đồ cũ và các tài liệu trong folder t gửi"*.
> Cùng cách đã làm cho khối 8 / 9. Spec: `Repo\kho-rules\dai\k11.md`. Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11` · `<LUOT>` = B1…B6 · Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.

Bạn soạn nội dung cho một số **dạng bài** của bản đồ kiến thức mới khối 11 (Toán). Mỗi dạng cần:
- **Lý thuyết** (`ly_thuyet`) — CHỈ khi hồ sơ ghi "Lý thuyết dạng: TRỐNG". Dạng đã có lý thuyết thì KHÔNG viết lại.
- **Ví dụ** (`vi_du`) — mọi dạng được giao: **2 ví dụ có lời giải**: ví dụ 1 cơ bản đúng dạng, ví dụ 2 khó hơn một bậc (vẫn đúng dạng).

KHÔNG ghi DB, KHÔNG sửa tệp nào trong Repo. Bạn chỉ ghi `<LV>\ra\<LUOT>.txt` và script nháp trong `<LV>\tam\<LUOT>\`. Ghi tệp bằng công cụ Write (không heredoc).

## 1. Đọc trước

1. Hồ sơ từng dạng: `<LV>\<mã dạng>.md` — mô tả của CEO (ĐÍCH: lý thuyết và ví dụ phải đúng dạng mô tả này), lý thuyết dạng đang có, dạng cũ đối ứng + lý thuyết cũ.
   Lý thuyết của NHÓM (đã có, không sửa, đừng lặp): `<LV>\nhom-<mã nhóm>.md`. Toàn bộ lý thuyết bản đồ cũ khối 11: `<LV>\lt-cu-k11.md` (tìm theo tên dạng bằng Grep).
2. Nguồn sách đã trích chữ + LaTeX: `<LV>\nguon\*.txt` — `pnl__*` (PNL 2026, bản GV có lời giải, đủ lý thuyết + bài mẫu theo dạng) · `tt__*` (Từ Tâm: P1 lý thuyết, P2 bài tập, P3 ghép GV có lời giải) ·
   `nbv__*` (NBV: A lý thuyết, B tự luận ĐA, C trắc nghiệm ĐA, E trả lời ngắn ĐA, F nâng cao ĐA; thư mục chứa tên chuyên đề). Dùng Grep tìm theo từ khoá của dạng, đọc đúng đoạn cần.
   ⚠ Công thức MathType đôi khi hỏng `[[EQ-FAILED…]]` (chủ yếu ký hiệu max/min/lim) — tự suy từ ngữ cảnh, KHÔNG chép nguyên chữ hỏng.
3. Luật khối 11: `Repo\kho-rules\dai\k11.md` §3 (luật nội dung) và §4 (khuôn).

## 2. Khuôn tệp ra `<LV>\ra\<LUOT>.txt`

```
=== NDB00564
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
Vậy …

##VD
<đề ví dụ 2>

Bài giải:
…
Vậy …
```

- Khối theo đúng thứ tự giao. Dạng đã có lý thuyết: bỏ hẳn phần `@ly_thuyet:`.
- **Lý thuyết** gồm các khung, cách nhau MỘT dòng trống, trong khung không có dòng trống: `##TC` (kiến thức cần nhớ: công thức / định nghĩa / tính chất dùng cho dạng, mỗi ý một dòng "- ") ·
  `##PP <tên>` (BẮT BUỘC — phương pháp giải, 3–6 bước, mỗi dòng một bước trọn ý, KHÔNG "Bước N") · `##CY` (tuỳ chọn — bẫy hay sai thật). Có thể thêm `##DN` / `##DL` / `##NX` khi thật cần.
  KHÔNG đặt ví dụ trong lý thuyết. Lý thuyết là **của dạng**: nhóm đã có công thức chung rồi thì đừng chép lại; nếu nhóm TRỐNG lý thuyết (hồ sơ nhóm ghi "TRỐNG") mà dạng cần công thức nền thì ghi vào `##TC` của dạng.
- **Ví dụ**: đoạn `##VD` = dòng `##VD` + đề (nhiều dòng không dòng trống); MỘT dòng trống; đoạn `Bài giải:` rồi lời giải **liền dòng** (mỗi phép biến đổi một dòng, KHÔNG dòng trống bên trong), kết bằng câu `Vậy …`.
  Hai ví dụ phải **khác** các ví dụ đã nằm trong lý thuyết dạng / nhóm; số liệu ra kết quả đẹp. Lấy ý từ sách / kho được nhưng phải giải lại đầy đủ.
- **Định dạng:** công thức `$…$` (KHÔNG `$$`, `\(`) · dấu nhân `\cdot` (không `\times`) · phân số `\dfrac` · thập phân `2{,}5` · hệ `$\begin{cases} … \\ … \end{cases}$` (một dòng) ·
  chữ Việt trong công thức bọc `\text{…}` · chỉ `**đậm**`, không `*nghiêng*` · không emoji · hàm LG viết `\sin x`, `\cos x`, `\tan x`, `\cot x`; số $\pi$ dùng `\pi`; tập $\mathbb{Z}$ dùng `\mathbb{Z}`.
  Họ nghiệm có $k\in\mathbb{Z}$ (hoặc $m,n\in\mathbb{Z}$).

## 3. Kiến thức — đúng phạm vi của dạng

- Bám **mô tả của CEO**: ví dụ phải đúng loại bài mô tả nói. Mô tả và tên lệch / mơ hồ ⇒ làm theo cách hiểu hợp lí nhất (ưu tiên nhóm chứa dạng) và GHI vào mục cuối tệp, đừng tự đổi đích.
- Chương trình 2018 SGK Kết nối tri thức Toán 11 tập 1 (C1 Lượng giác, C2 Dãy số – CSC – CSN). **CẤM đạo hàm và giới hạn** — chưa học: min–max dùng bất đẳng thức bị chặn
  ($|\sin x|\le1$…), đặt ẩn phụ rồi xét hàm bậc hai bằng đỉnh parabol / khoảng giá trị của $t$, hoặc biến đổi $a\sin x+b\cos x=\sqrt{a^2+b^2}\sin(x+\varphi)$. Tính đơn điệu / bị chặn của dãy:
  xét hiệu $u_{n+1}-u_n$ (hoặc thương khi $u_n>0$), không đạo hàm. Không số phức, không công thức chưa học.
- Được dùng: toàn bộ lớp ≤ 10, công thức lượng giác của bài trong SGK 11 (cộng, nhân đôi, hạ bậc, tích↔tổng). Kí hiệu $\Leftrightarrow$ được dùng cho biến đổi tương đương, mỗi dòng một bước.
- Nghiệm PTLG: viết đủ họ nghiệm theo $k\in\mathbb{Z}$, đơn vị radian; nghiệm trên khoảng / đoạn: giải bất phương trình theo $k$ rồi liệt kê / đếm $k$ nguyên.
- Bài thực tế: đặt đại lượng — đơn vị — điều kiện → lập → giải → đối chiếu → trả lời có đơn vị. Không bịa dữ kiện thiếu.
- **Không có hình:** bài cần đồ thị / đường tròn lượng giác thì mô tả bằng lời + bảng giá trị; đề phải tự đủ dữ kiện bằng chữ (không "cho đồ thị như hình vẽ").

## 4. Thử lại bằng máy (bắt buộc)

Mọi ví dụ: viết script node `<LV>\tam\<LUOT>\thu.mjs` thử bằng số: thay đáp số vào ĐỀ, kiểm từng dòng biến đổi với ≥ 3 giá trị của biến (thoả điều kiện), quét lưới tìm nghiệm sót (PTLG: quét $x$ trên đoạn đề cho),
kiểm min–max bằng quét số, dãy số / CSC / CSN: tính trực tiếp vài số hạng và so với công thức. Rồi chạy máy kiểm khuôn (từ thư mục Repo) tới khi lỗi 0:

```
node kho-rules/dai/lo/k11/ban-do/kiem.mjs "C:/Users/WBPC/bk-kho-lam-viec/bdm/k11/ra/<LUOT>.txt" <danh sách mã dạng, cách nhau dấu phẩy>
```

## 5. Cuối tệp

Thêm mục `## GHI CHÚ CHO CEO`: dạng nào mô tả lệch tên / mơ hồ / phải tự hiểu; dạng nào lý thuyết bản đồ cũ có lỗi (ghi rõ chỗ sai); dạng nào bạn ít chắc. Không có thì ghi "Không".

## 6. Trả lời cuối (≤ 120 từ)

Số dạng · số lý thuyết đã soạn · số ví dụ · máy kiểm lỗi 0 chưa · đã chạy thử lại bằng máy chưa · các điểm trong GHI CHÚ CHO CEO (mỗi điểm một dòng ngắn).
