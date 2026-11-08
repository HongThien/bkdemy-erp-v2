# Brief — nhập SÁCH THAM KHẢO K11 chương "Giới hạn. Hàm số liên tục" vào kho: soạn + xếp dạng (một đơn vị / một trạm)

Việc: biến MỘT đơn vị nguồn `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11\sach-gh\don-vi\<id>.txt` (cắt từ sách PNL / Từ Tâm / NBV, đã ra chữ + LaTeX) thành MỘT tệp JSON câu hỏi:
đề chuẩn hoá + lời giải khuôn K11 + dạng bài đề xuất. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài tệp JSON của bạn (và script tạm trong scratchpad).
`Repo = C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Kết quả: `Repo\kho-rules\dai\lo\k11\sach-gioi-han\<id>.json`.

## Đọc trước (hết)
1. `Repo\kho-rules\dai\k11.md` §3 (luật nội dung K11) · `Repo\kho-rules\dai\lo\k11\de-cuong\brief-soan.md` §6 (khuôn lời giải: Phần 1 card 3–6 bước, Phần 2 trình bày — ĐÚNG khuôn này) và mẫu một tệp đã chạy: `Repo\kho-rules\dai\lo\k11\de-cuong\TP-GKI-2026.p1.soan.md` (xem 2–3 câu).
2. `Repo\kho-rules\dai\lo\k11\sach-gioi-han\dich.md` — bảng đích: 51 DẠNG BÀI (mã `NDB…`) của chủ đề Giới hạn, theo thứ tự bản đồ, kèm mô tả + ví dụ.
3. Đơn vị nguồn của bạn (`.txt`). Dòng đầu cho biết sách + phần. Nếu phần bạn nhận là một khúc giữa (`phần k/n`): chỉ làm bài / câu có dòng mở BẮT ĐẦU trong khúc; đuôi đầu khúc là của khúc trước.

## Cấu trúc 3 sách (đọc thật kĩ trước khi làm)
- **PNL** (`pnl-*`): mỗi *Dạng k* gồm Phương pháp → `BÀI TẬP TỰ LUẬN` (Bài tập 1, 2… có `Lời giải` ngay sau, nhiều ý a, b, c…) → `BÀI TẬP TRẮC NGHIỆM` (Câu 1…, có đáp án / hướng dẫn cuối).
- **Từ Tâm** (`tt-*`, bản P3 GHÉP GV = ví dụ + bài tập đã ghép lời giải): *Dạng k* → `Ví dụ k.j` (CÓ lời giải) → các `Bài / Câu` bài tập (đáp án / lời giải ở cuối bài hoặc cuối phần).
- **NBV** (`nbv-*`): phần B tự luận · C trắc nghiệm · D đúng/sai · E trả lời ngắn · F nâng cao; đáp án / hướng dẫn nằm ngay sau từng câu hoặc ở cuối.
- Ký hiệu của bộ chuyển đổi: `[[b]]…[[/b]]` đậm · `[[mau:…]]`/`[[nen:…]]` màu (bỏ qua) · `[[img:…]]` = có hình ở chỗ đó (bạn KHÔNG nhìn được hình).

## Phân loại từng bài (`vai`)
- **`giang` (kho TRÊN LỚP)**: CHỈ các mục gọi là **"Ví dụ"** (Từ Tâm `Ví dụ k.j`; PNL / NBV nếu có mục "Ví dụ" hướng dẫn) — mỗi ví dụ là một bài giảng có lời giải mẫu. Bắt buộc có `dang_bai`.
- **`luyen` (kho VỀ NHÀ)**: mọi thứ còn lại — Bài tập, Câu trắc nghiệm, đúng/sai, trả lời ngắn, đề ôn tập. (Phần lý thuyết / ví dụ nhỏ nằm trong khung lý thuyết: KHÔNG nhập.)
- Mục tên "Bài tập" nhưng PNL có lời giải ngay sau ⇒ vẫn `luyen`.

## Tách ý (luật Đại, Thùy 21/09)
Bài nhiều ý a), b), c)… **chỉ tách** khi mỗi ý có dữ kiện RIÊNG, độc lập (tính từng giới hạn, từng dãy…) ⇒ mỗi ý một câu: `noi_dung = câu dẫn chung + ý`. **Giữ nguyên cả bài** khi các ý chung dữ kiện / ý sau dùng kết quả ý trước / bài thực tế nhiều ý / hình chung. `id` = `<đơn-vị>-<số bài>` (+ `-a`, `-b` khi tách ý).

## Dạng bài (`dang_bai`)
Chọn mã `NDB…` trong `dich.md` theo KIỂU BÀI (đề cho gì, hỏi gì, giải bằng cách nào), đối chiếu mô tả + ví dụ của dạng — không theo từ khoá. **DẠNG SAU THẮNG** (Thùy 23/10): câu hợp 2 dạng ⇒ lấy dạng đứng SAU trong `dich.md`. Câu có nhiều cách giải: chỉ cần MỘT cách thuộc dạng nào thì đưa vào dạng đó.
`dang_bai_chac`: `"cao"` (đúng một dạng rõ) | `"vua"` (còn nghi / hợp nhất nhưng còn dạng khác / đề phụ thuộc hình). Không dạng nào khớp ⇒ `"dang_bai": null` + `dang_bai_ly_do` ghi bản đồ THIẾU dạng gì (câu `giang` không có dạng ⇒ đổi thành `vai: "luyen"` và ghi lý do).
Câu **Đúng/Sai (loai_cau=dung_sai) KHÔNG gán dạng** (Thùy 26/10): `dang_bai: null`, không `dang_bai_chac`.

## Mỗi câu (JSON)
```json
{ "id": "pnl-b1-p1-BT1a", "vai": "giang|luyen", "dang_bai": "NDB01151", "dang_bai_chac": "cao",
  "dang_bai_ly_do": "ngắn ≤ 20 từ", "loai_cau": "tu_luan|trac_nghiem|tra_loi_ngan|dung_sai",
  "noi_dung": "…", "lua_chon": ["…","…","…","…"], "menh_de": [{"noi_dung":"…","dap_an":"D"}],
  "dap_an": "…", "loi_giai": "**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** …\n\n**Bước 1.** …\n\n**Phần 2. Trình bày**\n\n…",
  "kiem": ["biểu thức JS trả về true"], "sach_dap_so": "đáp số in trong sách", "ghi_chu": "" }
```
- `lua_chon`: chỉ trắc nghiệm — 4 chuỗi, KHÔNG kèm "A.", mỗi chuỗi một phương án, công thức bọc `$…$`. `menh_de`: chỉ Đúng/Sai — đúng 4 ý a–d, `dap_an` `"D"`|`"S"`; `dap_an` câu = `null`.
- `dap_an`: trắc nghiệm = MỘT chữ cái; trả lời ngắn = số ≤ 4 ký tự (`-8`, `0,5`; không bọc `$`; phân số / căn / vô cực ⇒ `tu_luan`); tự luận = `"—"`; Đúng/Sai = `null`.
- Trắc nghiệm: dòng cuối `loi_giai` = đúng chữ `Chọn X.` Đúng/Sai: Phần 2 xét từng ý "Ý a) … Đúng/Sai vì …" (dòng cuối nêu cả bốn: "Vậy các ý a), b), c), d) lần lượt là …").
- **Khuôn lời giải** (máy kiểm — `kiemP1`): `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` → 3–6 đoạn `**Bước k.** …` → (tuỳ chọn `**Chú ý:** …`) → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; mỗi bước Phần 1 là bước nghĩ trọn vẹn (≥ 5 chữ ngoài công thức), **KHÔNG nêu đáp số cuối** (kể cả ở Mấu chốt / Chú ý, kể cả qua loại trừ phương án). Phần 2 = cái học sinh viết vào bài; mỗi phép biến đổi một dòng; kết "Vậy …".
- Định dạng: công thức một cặp `$…$` (không `$$`, `\(`); dấu nhân tường minh **`\cdot`** (CẤM `\times`, CẤM dấu chấm làm dấu nhân, CẤM `\left` `\right` — viết ngoặc thường); `\dfrac`; thập phân `2{,}5`; chữ Việt trong công thức bọc `\text{…}`; giới hạn viết `\lim\limits_{n\to+\infty}` / `\lim\limits_{x\to a}`; chỉ `**đậm**` cho nhãn quy định.
- `kiem`: mảng chuỗi JavaScript tự tính lại đáp số cuối **từ dữ kiện đề** và trả `true` (giới hạn dãy: tính ở n rất lớn như 1e7 và so với đáp số, sai số 1e-4; giới hạn hàm: tính hai phía của điểm; liên tục / tham số: thay lại; trắc nghiệm: kiểm phương án đúng và mỗi phương án sai). Chứng minh / lý thuyết: kiểm ví dụ số.
- Đề sách in lỗi / thiếu: **giải bình thường theo số liệu in, ghi rõ "đề sai" ở `ghi_chu` và dòng "Lưu ý: …" đầu Phần 2** (Thùy 24/10); chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ. Đáp số của bạn LỆCH `sach_dap_so`: kiểm lại bằng máy; vẫn lệch ⇒ `ghi_chu: "LỆCH SÁCH — …"` và giữ kết quả đúng.
- **Câu cần hình** (có `[[img:…]]` trong thân đề và đề phụ thuộc hình để giải): BỎ câu đó, ghi vào `ghi_chu` của tệp báo cáo cuối (không đưa vào JSON). Hình chỉ trang trí đầu bài: bỏ qua.

## Phạm vi kiến thức (CỨNG) — SGK KNTT 11 tập 2 chương V + lớp ≤ 10
Giới hạn dãy số (định nghĩa, `1/n^k`, `q^n`, quy tắc tổng / hiệu / tích / thương, giới hạn vô cực, tổng cấp số nhân lùi vô hạn), giới hạn hàm số (định nghĩa bằng dãy, một bên, tại vô cực, vô cực, dạng `0/0` phân tích nhân tử / nhân liên hợp, `\infty-\infty`, `0\cdot\infty` đưa về phân thức), hàm số liên tục (tại điểm, trên khoảng / đoạn, tham số, định lí giá trị trung gian / nghiệm).
**CẤM** (dù ngắn hơn): quy tắc L'Hôpital · đạo hàm · giới hạn đặc biệt `\dfrac{\sin x}{x}`, `(1+1/n)^n`, `e` · khai triển Taylor · mũ–logarit lớp 11 · công thức chưa học. Mẫu `\dfrac00` dùng phân tích nhân tử (chia Horner được) hoặc nhân liên hợp.

## Tự kiểm trước khi nộp (bắt buộc)
Chạy từ Repo, sửa tới khi in "✔ đạt": `node kho-rules/dai/lo/k11/sach-gioi-han/kiem.mjs kho-rules/dai/lo/k11/sach-gioi-han/<id>.json`.
Sinh tệp JSON bằng một script Node nhỏ ở scratchpad (Write tool; KHÔNG gõ JSON tay trong heredoc — lỗi thoát `\`), tự đọc lại và chạy `kiem.mjs`.

## Báo cáo cuối (≤ 12 dòng)
Số bài (ví dụ / bài tập / đề) · số câu `giang` / `luyen` / Đ/S · bao nhiêu câu dạng cao / vừa / để trống (kèm bản đồ thiếu gì) · câu BỎ vì phụ thuộc hình (id) · `LỆCH SÁCH` / đề sai · điều bạn nghi.
