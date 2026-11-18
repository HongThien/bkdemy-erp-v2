# spec-giai-bai.DE-XUAT.md — bản đề xuất sửa cho spec #5 (`spec-giai-bai.md`)

> Lập 18/11/2026 13:40 (giờ VN). **Chỉ là đề xuất — chưa sửa chữ nào trong `spec-giai-bai.md`.** Đối chiếu: file 2.309 dòng (bản commit `2953a3b8` 17/11) · `scripts/kho/cat-luat.mjs` · code `scripts/kho/*`, `kho-rules/dai/lo/toanmath/*` · DB (chỉ đọc, role `claude_build`, 18/11 13:26).
> "d.123" = dòng 123 của `spec-giai-bai.md`. Số đếm DB là câu chưa vào rác.

---

## 0. File này MÁY ĐỌC — điều phải giữ khi sửa

`cat-luat.mjs <khối>` cắt brief cho trạm giải, phụ thuộc đúng 4 thứ:

| Máy cần | Chi tiết |
|---|---|
| `# PHẦN A` · `# PHẦN B` · `# PHẦN C` | Tiêu đề **cấp 1**, mở đầu đúng chữ `# PHẦN ` + chữ cái. Mỗi phần kéo tới `# PHẦN ` kế tiếp. Thiếu ⇒ script dừng. |
| `## Khối <tên>` | Tiêu đề **cấp 2** trong Phần B, tên khối đứng ngay sau chữ "Khối " (4 · 4T · 5 · … · 12). Mọi `## ` trong B là ranh giới mục. |
| `## Hình — luật chung…` | Cấp 2 trong B, mở đầu đúng "Hình — luật chung". Luôn được ghép vào brief của MỌI khối. |
| Câu chữ "dùng luật (của) Khối X" trong thân mục khối | Máy lần theo để ghép thêm mục khối X (Khối 4 ⇒ ghép 5, 4T, 5T). Đổi câu chữ này là mất ghép. |

- Tiêu đề cấp 3 (`###`) máy không dùng. Dòng đầu file (d.1–18) và **Phần D không vào brief**.
- **Mã `luat:`** = băm của (Phần A + mục khối + mục khối được ghép + Hình chung + **TOÀN BỘ Phần C**). Hệ quả:
  - sửa một chữ ở Phần A / Hình chung / Phần C ⇒ **đổi mã của mọi khối**; sửa trong mục khối ⇒ đổi mã khối đó (và khối dùng lại nó);
  - xoá một dòng nợ ở §C10 cũng đổi mã ⇒ tệp soạn đang dở thành "soạn theo luật cũ" (đang dở: B044-07 chờ soát · B013-07 treo);
  - §C4 (d.2188) ghi mã băm "Phần A + mục khối" — **thiếu** Hình chung và Phần C.
- **Cách sửa đề xuất:** gom mọi sửa ở A / Hình chung / C / mục khối thành MỘT lượt, làm lúc không có tệp soạn dở, rồi chạy lại `ghep-brief.mjs`. Nội dung mới về DUYỆT đặt ở **`# PHẦN E` mới (sau Phần D)** ⇒ không vào brief trạm, không đổi mã.
- **Đề xuất đụng tiêu đề:** (1) THÊM `# PHẦN E` — mục 1; (2) THÊM `## Khối 3` — nếu Thùy chọn (câu hỏi 7). **Không đổi tên, không đổi cấp tiêu đề nào đang có.**

Chạy thử 18/11 (chỉ đọc): `cat-luat.mjs 4` ✔ (951 dòng, ghép 5 · 4T · 5T) · `6` ✔ · `9` ✔ · `12` ✔ · **`3` ✗** "Phần B không có mục Khối 3".

---

## 1. Gộp nốt nguồn

### 1.1 `spec-kho-chuan.md` (109 dòng)

| Đoạn | Tình trạng |
|---|---|
| §0 số đo 09/09 | Lỗi thời — số mới ở `spec-kho-cau-hoi` §1 |
| §1 định nghĩa "vào kho chuẩn" (cột kiểm, hàm) | Đã có: `spec-kho-cau-hoi` §1 (dòng Kiểm, Duyệt), §2 |
| §2 quét lại kho 3 mức (máy → Claude → người, mẫu 2 %) | **CÒN THIẾU** ở cả hai spec (`spec-kho-cau-hoi` §2 chỉ nhắc "quét", Q6) ⇒ chèn **E2** |
| §3 một hàng duyệt nhiều bộ lọc · sửa tại chỗ · không "duyệt tất cả" hàng nghi | **CÒN THIẾU** (`spec-giai-bai` §C1 chỉ có 1 dòng; `spec-kho-cau-hoi` §2 trỏ ngược về §C1, §C6) ⇒ chèn **E1** |
| §3 sửa đáp số ⇒ thu hồi form · từ chối = kho rác · đổi dạng không phá lịch sử | Đã có: `spec-kho-cau-hoi` §6 (+ Q3 đã chốt) |
| §3 "TA duyệt được hàng nghi" · `dang_ai_de_xuat` cạnh `dang_chinh` | Lỗi thời: người duyệt = trưởng khối (13–15/11); dạng nay gán ở bản đồ mới |
| §3 + §4 bước 5 bỏ bảng nháp clone | Đã có: `spec-kho-cau-hoi` §8 Q5 (chốt 17/11, chưa làm — còn 5.665 nháp) |
| §4 thứ tự 6 bước | Lịch sử: bước 1–3 xong · bước 4 dừng 14/09 · bước 5–6 chưa ⇒ ghi hiện trạng ở **E2** |
| §5 ngưỡng 98 % cho AI ký · khối nào quét trước | Chưa ai chốt; ngưỡng nay là "tỉ lệ lọt 2 %" §C5 ⇒ câu hỏi 8 |
| Bổ sung 09/09: lời giải Claude phải duyệt | Đã có: `spec-kho-cau-hoi` §2 (công thức), §9 |
| Bổ sung 09/09 — Hình: cách giải / biến thể Claude chưa duyệt ⇒ nhãn đỏ, không in, không làm mẫu | **CÒN THIẾU** ⇒ một gạch trong **E1** |

### 1.2 `PLAN-giaibai.md` (49 dòng)

**Toàn bộ lỗi thời.** App "Giải bài kho chung" (TA nhận bài giải) đã bị xoá 27/10 — commit `2d8e978d` "[Dọn ERP] … app Giải bài/Soạn/Khảo sát … Thùy duyệt 27/10". Trong DB còn sót: 22 hàm `fn_giaibai_*`, 3 view `v_giaibai_*`, các cột nhận bài trên bảng `*_yeu_cau_giai`; tổng 30 lượt nhận của 7 người, lượt cuối 14/09, **0 lượt được duyệt**, 11 dòng còn treo từ tháng 9. Phần còn sống là hàng đợi "Đặt Claude giải" — đã ở `spec-kho-cau-hoi` §10.1 đường E. ⇒ chỉ cần 1 dòng lịch sử ở **E3**.

### 1.3 Đoạn đề xuất CHÈN — nguyên văn

**Vị trí:** cuối file, sau bảng Phần D (sau d.2309). Thêm một dòng vào bảng đầu file sau d.14: `> | **E** | DUYỆT TRÊN ERP · quét lại kho cũ (không phát cho trạm giải) | Người duyệt, điều phối |`.

```
---

# PHẦN E — DUYỆT TRÊN ERP · QUÉT LẠI KHO (không phát cho trạm giải)

> Cho người duyệt và điều phối. Lệnh cắt luật không đưa phần này vào brief; sửa ở đây không đổi mã luật.
> "Câu vào kho" định nghĩa thế nào, cột dữ liệu, form trắc nghiệm, clone, báo sai: `spec-kho-cau-hoi.md` §1, §2, §5, §6. Ở đây chỉ có LUẬT DUYỆT.

## E1. Duyệt câu — một cửa, một hàng (Thùy 09/09; người duyệt theo 13–15/11)

- **Một trạng thái chờ duy nhất:** câu chờ duyệt là dòng thật trong bảng câu với `da_duyet = false`, dù vào bằng đường nào (dây chuyền giải bài · nhập trên ERP · clone · nhập từ tệp). Không có bảng nháp riêng cho từng đường.
- **Một màn:** "Duyệt lời giải AI". Các bộ lọc (không phải các hàng riêng): Câu mới · Lời giải mới từ Claude · Nghi sai · Không kiểm được · Tồn đọng · Chưa có dạng · Đúng/Sai.
- **Ai duyệt:** trưởng khối của (môn × khối) trở lên (§C1), trên màn hoặc qua phiên Claude của chính trưởng khối. Người soạn không duyệt câu của mình.
- **Duyệt = chuẩn hoá:** sửa được ngay tại chỗ đề · dạng (ô tìm, không dropdown) · cụm · đáp số · lời giải; lưu là câu vào kho. Hệ tự ghi người duyệt, giờ duyệt, nguồn duyệt.
- **Không có "duyệt tất cả" cho hàng Nghi sai và Không kiểm được** — hai hàng này mở từng câu. Duyệt theo lô chỉ cho câu không mang cờ nghi.
- **Sửa đáp số hoặc lời giải của câu đã có form trắc nghiệm / điền ô ⇒ form bị thu hồi để sinh lại** (`spec-kho-cau-hoi` §6).
- **Từ chối = vào kho rác**, không xoá cứng, mã không cấp lại (§C7).
- **Câu ở dạng chờ không duyệt được** cho tới khi có dạng (§C6).
- **Duyệt câu gốc ⇒ bản sao của nó đi theo.** Clone ghi `da_duyet = false`, đi chung hàng này; đáp số clone phải có nhân chứng máy hoặc Opus trước khi duyệt (Phần D 08/11; `spec-kho-cau-hoi` §8 Q5).
- **Hình — cách giải / biến thể do Claude ghi mà chưa duyệt:** kho hiện nhãn đỏ; KHÔNG in, KHÔNG làm đáp án tham chiếu, KHÔNG làm mẫu cho lượt giải khác (Thùy 09/09).
- **AI và máy không sửa đáp số của kho** — chỉ đánh dấu nghi kèm lý do; sửa là việc của người duyệt.
- **Câu bị báo sai:** trưởng khối xử lý trong 48 giờ; câu sai thật ⇒ sửa hoặc vào rác + một dòng Phần D (§C7).

## E2. Quét lại kho cũ — ba mức (Thùy 09/09)

- **Mức A — máy tính lại**, chỉ các dạng "đáp số = giá trị một biểu thức": khớp ⇒ ký duyệt nguồn `may`; lệch ⇒ nghi.
- **Mức B — Claude giải lại** theo lô 200–300 câu: khớp ⇒ ký duyệt nguồn `ai`; không khớp ⇒ nghi; không giải được / đề lỗi ⇒ không kiểm được. Ưu tiên câu học sinh đã làm.
- **Mức C — người:** hàng Nghi sai + Không kiểm được, cộng **mẫu 2 %** phần máy / AI đã ký để đo độ tin (máy và AI tách riêng). Độ tin thấp ⇒ mức B chỉ báo, không ký.
- **Hiện trạng 18/11:** mức A 1 lô 1.696 câu (08/09) · mức B 84 lô 16.131 câu (08–14/09: khớp 13.476 · nghi 803 · không kiểm được 1.852) rồi DỪNG · mẫu 2 % chưa làm · còn 353 câu Đại + 1 câu HGT cũ đang "tạm dùng" (`spec-kho-cau-hoi` §8 Q6).
- Quét tiếp hay không: chờ Thùy.

## E3. Lịch sử

| Ngày | Việc | Nay |
|---|---|---|
| 06/09 | Tool "Giải bài kho chung" cho trợ giảng nhận bài giải (`PLAN-giaibai`) | App đã xoá 27/10. Hàm và cột nhận bài còn trong DB, không ai gọi |
| 09/09 | Kho chuẩn: 2 cửa duyệt, quét 3 mức (`spec-kho-chuan`) | E1, E2 |
| 28/09 | Dừng luồng một phiên tự giải – tự kiểm – tự ghi | §C1 |
| 05/11 | Gán dạng mức cao ⇒ DB tự duyệt nếu đủ đáp án | §C6, §C10 mục 2 |
| 13–15/11 | Câu chưa chắc về trưởng khối · một file luật | §A1, §C6 |
| 17/11 | Ranh giới với `spec-kho-cau-hoi` (luật ở đây · quy trình, công cụ, dữ liệu ở đó) | đầu file |
```

**Kết luận lưu trữ:** `PLAN-giaibai.md` ⇒ lưu trữ được NGAY. `spec-kho-chuan.md` ⇒ lưu trữ được sau khi chèn Phần E (E1 + E2). Hai dòng của `SPEC-INDEX.md` bảng B cần thêm khi làm.

---

## 2. Mâu thuẫn với quyết định 17–18/11

**Không tìm thấy chỗ trái** (đã rà cả file): số thập phân dấu chấm (không dòng nào bảo dùng dấu chấm) · `(gt)` / `(cmt)` (d.75, d.329 đã đúng) · Hình–Học bài nhiều ý (d.288, d.342 đã là luật) · tầng nhóm mô hình Hình–Luyện (file không nhắc) · mastery (file không nhắc đo) · quản lý môn / trưởng bộ môn (file không dùng hai từ này) · điền ô Đại, Hình không MCQ, máy ký form TN (file không nhắc — thuộc `spec-kho-cau-hoi`) · phiên Claude (file không nhắc; d.247 "không xoá tệp" là luật của trạm soạn, không trái) · duyệt câu chưa chắc về trưởng khối (d.29, d.275, d.2157, d.2211 đã đúng).

**Chỗ cần sửa (14):**

| # | Dòng | Đang ghi | Vì sao | Câu sửa đề xuất | Đổi mã |
|---|---|---|---|---|---|
| S1 | d.81 (§A5) | "…đúng thẻ `##ĐL / ĐN / TC / CY / PP / VD` của `spec-format-noidung.md`" | File đã lưu trữ 17/11; chưa nói ví dụ để ở đâu | "**Lý thuyết / ví dụ ghi vào bản đồ** đúng thẻ của `spec-ban-do-toan.md`. Lý thuyết nhóm và dạng KHÔNG chứa ví dụ — ví dụ (`##VD`) chỉ ghi ở ô ví dụ của dạng." | mọi khối |
| S2 | d.1045 (Khối 7 › Hình) | "Ví dụ trong lý thuyết bài thiếu điều kiện vị trí… ⇒ bổ sung vào đề" | Ngầm coi lý thuyết bài có ví dụ | "Ví dụ của bài (ô ví dụ, không nằm trong lý thuyết) thiếu điều kiện vị trí…" | khối 7 |
| S3 | d.1099 (Khối 7 › bản đồ) | "Định dạng: `##TC` / `##PP` / `##CY`; ví dụ `##VD` + …" | Không nói ví dụ ở ô riêng | thêm cuối câu: "Ví dụ ghi ở ô ví dụ của dạng, không ghi trong lý thuyết." | khối 7 |
| S4 | d.176 (§A10) | "**Trả lời ngắn**: theo §A10 (dấu phẩy thập phân…)" | Trỏ vòng vào chính nó; luật dấu phẩy không có câu gốc | "**Trả lời ngắn**: một số, thập phân dùng DẤU PHẨY (mọi đường vào kho — Thùy 17/11), đếm cả dấu `-` `,`, tối đa 4 ô (§A7); …" | mọi khối |
| S5 | d.403 (Hình chung › Vẽ lại) | "Chưa có luật vẽ lại cho: khối 11 (hình không gian), `hgt_cau_hoi`." | Thực tế từ 08/11 đã có công cụ vẽ lại vectơ, 70 câu đang mang hình code | Chờ câu hỏi 6 | mọi khối |
| S6 | d.363 (Hình chung) | "MỌI câu vẽ được thì phải có hình…" [07/10] | Dễ hiểu là phải vẽ bù cả kho cũ — trái d.2292 "ảnh cũ chỉ xét khi có lệnh" | thêm: "Áp cho câu MỚI nhập; câu cũ thiếu hình chỉ vẽ khi có lệnh (§C12)." | mọi khối |
| S7 | sau d.2297 (§C12) | (chưa có) | Thùy chốt 17/11: mọi đường gắn hình đề lúc tạo câu phải ghi nhãn, mặc định `goc` | thêm gạch: "Mọi đường tạo câu có hình đề (đề thi · sách · bài học Hình · nhập trên ERP) ghi nhãn cùng lượt ghi; không khai thì là `goc` (Thùy 17/11)." | mọi khối |
| S8 | d.292 | "cây ở `spec-hinh-cay-nhanh.md`" | File đã lưu trữ | "cây ở `spec-ban-do-toan.md`" | mọi khối |
| S9 | d.142 (§A9) | "Cấu trúc đề: `spec-de-thi.md`" | File đã lưu trữ | "Cấu trúc đề: `spec-kho-cau-hoi.md` §11" | mọi khối |
| S10 | d.598 (Khối 4T) | "Bảng dấu hiệu theo mã bản đồ cũ `T14T…` (`k4T.md` §5) phải soát lại…" | `k4T.md` đã xoá 15/11; mọi khối đã chạy bản đồ mới | xoá dòng (hoặc: "Phân dạng theo bản đồ mới của khối; bảng dấu hiệu mã cũ không dùng.") | 4 · 4T · 5 · 5T |
| S11 | d.758 (Khối 5T) | "Bảng dấu hiệu chi tiết: `k5T.md` §8.1–8.3" | File đã xoá 15/11 | bỏ câu trỏ | 4 · 5 · 5T |
| S12 | d.2218 (§C7) | "ai thấy câu lỗi ⇒ báo sai / xoá…" | Chưa nói ai xử lý, hạn nào | thêm: "Câu bị báo sai do trưởng khối của khối đó xử lý trong 48 giờ (Phần E1)." | mọi khối |
| S13 | d.2261 (§C10) | "…câu ghi `da_duyet=false` như cũ (chưa có làn tự vào kho)" | Sai với thực tế: từ 05/11 DB tự duyệt ngay khi máy gán dạng (mục 3.2) | Chờ câu hỏi 1 | mọi khối |
| S14 | d.2188–2189 (§C4) | "băm nội dung Phần A + mục khối" · "Cổng từ chối tệp soạn có mã khác" | Mã băm cả Hình chung + Phần C; cổng CHƯA kiểm mã (d.149 tự nhận) | "…(băm Phần A + mục khối + Hình chung + Phần C)." · "Trạm kiểm đối chiếu mã bằng tay cho tới khi cổng kiểm được (§C10 mục 4)." | mọi khối |

**Lệch nằm ở code / DB, không ở file (luật trong file đã đúng):** nhãn câu đề thi (§C7 đúng, `ghi.mjs` dòng 127 vẫn gõ cứng `nguoi`) · dấu phẩy (prompt nhập trong ERP `api.ts` dòng 562 vẫn dặn "0.6") — xem mục 3 và "Lệch kỹ thuật".

---

## 3. §C10 "Code còn nợ" — kiểm từng dòng (18/11)

### 3.1 Mười hai dòng

| # | Việc | Kết luận | Bằng chứng |
|---|---|---|---|
| 1 | `ghi.mjs` ghi nhãn AI + model | **Còn nợ** | `scripts/kho/de-thi/ghi.mjs:127` `nguon_giai: 'nguoi'`; không ghi `giai_method`, `ai_model`. Chưa có batch đề thi nào ghi sau khi chốt 17/11 (lần cuối 15–16/11) ⇒ phải sửa TRƯỚC batch kế |
| 2 | Xếp làn 4 điều kiện | **Còn nợ** | Trigger chỉ xét: gán dạng nguồn AI + đủ đáp án + không nghi (mục 3.2) |
| 3 | Đề thi + bài học Hình qua cổng có biên bản + băm | **Còn nợ một nửa** — sửa chữ | `ghi-batch.sh` có chặn đề chưa "KẾT LUẬN: ĐẠT"; chưa băm nội dung, `ghi.mjs` không qua `cong-ghi.mjs`; đường bài học Hình chưa có gì |
| 4 | Cắt luật + mã + cổng kiểm mã | **Xong một nửa** — sửa chữ thành "Cổng chưa kiểm dòng `luat:`" | `cat-luat.mjs` + `ghep-brief.mjs` có từ 15/11; `dung-de-tu-soan.mjs` không đọc `luat:` |
| 5 | Máy rút mẫu 15 % | **Còn nợ** | Không script nào rút mẫu / tính tỉ lệ lọt |
| 6 | Trạm soạn phân dạng cùng lượt | **Gộp vào mục 11** (đề xuất xoá dòng 6) | §A10 đã có trường `dang=` / `chac=`; phần thiếu duy nhất là cổng đọc — đúng mục 11 |
| 7 | Lời giải Hình khoảng cách dòng +20 % | **Còn nợ** (tìm trong `src/` không thấy; độ chắc vừa) | — |
| 8 | Vá nhãn câu đề thi ghi sai `nguoi` | **Đã đếm** — sửa cột hiện trạng | 52.442 câu (Đại 41.355 · HGT 3.872 · Hình 7.215); từ 15/11: 1.728; repo có 889 tệp `.soan.md` làm nhân chứng |
| 9 | Cổng `--khoi 6`, `--khoi 12` nhận `hinh_hoc` | **Còn nợ** | `dung-de-tu-soan.mjs:45` chỉ 7 · 8 · 11 (+9) |
| 10 | `nhap_hh_tu_draft.mjs` hiểu bài–ý + sơ đồ | **Còn nợ** | file không có chữ `bai_y`, `so_do` |
| 11 | Cổng đọc `dang=` / `chac=` | **Còn nợ** | cổng không đọc hai trường; `ghi.mjs` đã nhận sẵn `dang_bai`, `dang_bai_chac` |
| 12 | Hai quy ước dòng (đề thi ↔ bài học Hình) | Chưa kiểm được ⇒ giữ | — |

Không dòng nào xoá hẳn được. **Nợ mới đề xuất thêm:**

| # | Việc | Bằng chứng |
|---|---|---|
| 13 | Ghi nhãn nguồn hình ở MỌI đường tạo câu, mặc định `goc` (Thùy 17/11) | Chỉ `gan_hinh.mjs` và `ghi.mjs` gọi; bảng nhãn vẫn 24 dòng; **178 câu** có hình đề tạo sau 15/11 22:55 không nhãn (Đại 111 · Hình 67) |
| 14 | Hàm duyệt câu kiểm đúng người | `fn_kho_duyet_cau` (+ `_ds`, `_menh_de`) chỉ kiểm "là nhân sự", nhận người duyệt từ tham số — chưa kiểm trưởng khối |
| 15 | Báo sai: giao về trưởng khối + hạn 48 giờ | Hàm xử lý đòi quyền `bdkt`, không theo khối; **88 câu đang chờ, 84 quá 48 giờ**, cũ nhất 14/10 |
| 16 | Khối 8T với điều kiện "dạng có lý thuyết" | 56/56 dạng bài 8T chưa có lý thuyết ⇒ theo §C6 không câu 8T nào tự vào kho được (câu hỏi 5) |
| 17 | Dọn DB của tool giải bài đã xoá | 22 hàm + 3 view + 11 dòng treo — chỉ làm khi Thùy gật (Luật xoá) |

### 3.2 §C6 (4 điều kiện) so với trigger `_bdm_tu_duyet_sau_gan` đang chạy

| §C6 đòi | Trigger đang xét |
|---|---|
| 1. Dạng mức cao **và dạng có lý thuyết** | Chỉ "dòng gán nguồn `ai`" — không xét lý thuyết |
| 2. Đáp số có **nhân chứng thứ hai** | Không xét. Chỉ "đủ đáp án" — riêng câu tự luận: chỉ cần CÓ lời giải |
| 3. Không cờ Chưa chắc, không đề sai, trạm kiểm không sửa đáp số | Chỉ loại câu mang cờ nghi (từ 13/11) |
| 4. Qua cổng khuôn | Không xét |
| Lô mẫu luôn chờ duyệt | Không biết lô mẫu |
| (không nói) | Áp cho MỌI câu chưa duyệt, kể cả câu kho cũ chưa ai kiểm |

**Đếm (câu được duyệt đúng giây phút máy gán dạng):** **6.609 câu** (Đại 6.216 · HGT 393; + 7 câu Đúng/Sai), từ 06/11 đến 17/11 — riêng 124 câu Đại rơi vào ngày 01/11, trước khi có trigger (05/11), tức đi đường khác cùng kiểu. Trong đó:
- **5.078 câu (77 %) không có dấu "đáp số đã được kiểm khớp" trong DB** (Đại 4.745 · HGT 333). Đây là số TRẦN: đáp án in kèm đề không được ghi vào DB nên một phần có thể đã có nhân chứng ngoài DB.
- 2.245 câu là tự luận (vào kho chỉ vì có lời giải); 111 câu thuộc dạng chưa có lý thuyết; 7 câu lời giải còn chữ "Chưa chắc".
- Theo nguồn (Đại): **câu kho cũ 2.868** (lời giải AI cũ, chưa qua kiểm) · đề thi 1.848 · tài liệu / sách 1.500 (1.471 có dấu khớp).
- Ngoài ra 1.122 câu đề thi Đại thành "đã duyệt nguồn AI" từ 05/11 bằng đường khác (giờ duyệt không trùng giờ gán) — **chưa dò ra đường nào**.

---

## 4. Sức khoẻ file

**Trùng lặp**
- §A2 ↔ §A15 (phạm vi) · §A5 ↔ §A18 (trình bày) · §A4 ↔ §A12 ↔ §A14: mục "bổ sung" tách rời mục gốc. Không sai; gộp thì phải đổi tiêu đề ⇒ **để nguyên**.
- "Bài nhiều ý: Phần 1 ghi Ý a, Ý b, tổng 3–6 bước" có ở §A18 d.266, lặp lại ở Khối 8 d.1154 và Khối 9 d.1525 ⇒ xoá 2 dòng khối (trái lời dặn d.274).
- §C10 mục 6 ↔ mục 11. Luật Haiku: d.2160 ↔ d.413.
- Luật nguồn hình ở 3 nơi (§A8 · Hình chung "Vẽ hình" · §C12) — đã trỏ nhau, chấp nhận.

**Tự mâu thuẫn**
- Trỏ vòng: d.176, d.1177, d.1562 "trả lời ngắn theo §A10" (luật thật ở §A7 d.117 và chính d.176) · d.231–232 §A14 trỏ "§A14" · d.1711 "làm tròn (cụ thể hoá §A14)" mà §A14 không có luật làm tròn. Dấu vết đánh số cũ.
- §C4 nói cổng đã chặn mã ↔ d.149 + §C10.4 nói chưa (S14).
- §C2 trạm 7–8 + §C6 tả làn tự vào kho như đã chạy ↔ d.2261 nói chưa có ↔ thực tế DB tự duyệt theo 2 điều kiện (S13).
- §C6.1 đòi dạng có lý thuyết ↔ Khối 8T (d.1447 "vào kho theo §C6") không có lý thuyết dạng nào.
- Số ví dụ mỗi dạng: Khối 6 "2 (hẹp: 1–2)" d.929 · Khối 7 "1–3" d.1099 · Khối 9 "2" d.1789.
- d.1447 lặp chữ "§C6 (§C6)". Dấu `---` trước §C12 (d.2282) làm §C12 trông như ngoài Phần C (máy vẫn cắt đúng).

**Trỏ tới file không còn:** `spec-format-noidung.md` d.81 · `spec-de-thi.md` d.142 · `spec-hinh-cay-nhanh.md` d.292 · `k4T.md` d.598 · `k5T.md` d.758.

**Tiêu đề máy cần:** đủ `# PHẦN A/B/C`, đủ `## Hình — luật chung`, 12 mục `## Khối` (4 · 4T · 5 · 5T · 6 · 7 · 8 · 8T · 9 · 10 · 11 · 12), đúng cấp. **Thiếu `## Khối 3`** — DB có khối 3 (2.866 câu Đại, 51 dạng bài, đã chạy bản đồ mới). DB không có khối 6T / 7T / 9T nên không thiếu.

**Chưa có luật riêng (file tự ghi "lô mẫu đầu tiên sẽ rút"):** Khối 3 (không có mục) · Khối 4 cuối kì I + kì II · Khối 5 giữa kì · Khối 6, 7, 8, 9, 10, 11 kì II · Khối 9 thi vào 10 · Khối 12 cuối kì II + thi tốt nghiệp · 8T đề thi · sách Khối 10 · trình bày trụ–nón–cầu Khối 9 · vẽ lại hình không gian 11 và hình giải tích · kho trên lớp cho Hình giải tích.

**Phần D (sổ sai lầm):** chỉ có **1 dòng, ngày 08/11**; từ khi lập file (15/11) chưa thêm dòng nào. Trong khi đó 24 câu báo sai đã được ghi "đã xử lý" (tháng 10) mà không có dòng tương ứng. Sổ thật đang nằm rải ở các mục "Sai lầm cần tránh" của Phần B (gần nhất 15/11).

**`TINH-TRANG.md` toanmath:** có, tự sinh **15/11 22:14**; lần ghi đề thi cuối vào DB là 15/11 (Đại, HGT) ⇒ khớp, không có việc toanmath nào sau đó. Số: 130 batch — 30 xong · 5 đang dở · 95 chưa chuẩn bị; 211/226 đề đã ghi; 10.133 câu.

**§C9:** Khối 12 giữa kì II còn ghi "⏳ lô mẫu B106, B108" — sổ toanmath ghi hai batch này đã ghi xong (5 đề, 110 câu) ⇒ cần xác nhận đã duyệt mẫu để đổi thành ✔.

---

## 5. Câu hỏi cho Thùy (8 câu, xếp theo mức quan trọng)

**1. Câu "tự vào kho" — từ nay cần thêm điều kiện gì?**
Ví dụ: ngày 14/11 có 1.917 câu tự thành "đã duyệt" trong một ngày, chỉ vì máy vừa gán dạng cho chúng và câu có đáp án. Không ai so lại đáp số.
- a) Giữ như đang chạy: máy gán dạng chắc + câu có đáp án ⇒ vào kho.
- b) Siết đúng như luật chị chốt 15/11: phải thêm "đáp số được một bên thứ hai xác nhận" (đáp án in trên đề, máy tính lại, hoặc Opus giải lại ra cùng kết quả). Thiếu thì chờ trưởng khối.
- Đang chạy: a. **Đề xuất CTO: b.**

**2. 6.609 câu đã tự vào kho từ 06/11 đến 17/11 — làm gì với chúng?**
Ví dụ: trong đó 2.868 câu là câu kho cũ, lời giải do AI cũ viết, chưa ai kiểm; 2.245 câu là tự luận (không có đáp số để so).
- a) Để nguyên, sai thì học sinh / giáo viên báo.
- b) Giữ trong kho nhưng cho máy tính lại đáp số dần (ngoài 17–22 giờ); câu nào lệch mới rút về hàng chờ trưởng khối.
- c) Rút hết khoảng 5.000 câu chưa có xác nhận về hàng chờ.
- Đang chạy: a. **Đề xuất CTO: b** (c làm học sinh thiếu câu luyện ở khối 3–6).

**3. Ai được bấm duyệt câu vào kho?**
Ví dụ: 14 ngày qua chị Hà Giang duyệt 233 câu, chị Dương 179 câu, chị 23 câu. Luật ghi "trưởng khối trở lên", nhưng hệ thống đang cho mọi nhân sự mở được màn duyệt bấm duyệt.
- a) Khoá ở hệ thống: chỉ trưởng khối đúng khối đó trở lên (kể cả duyệt lô mẫu đầu tiên của mỗi loại kì, thay chị).
- b) Giữ mở như bây giờ, tin vào phân công.
- **Đề xuất CTO: a.**

**4. Câu học sinh báo sai — ai xử lý, trong bao lâu?**
Ví dụ: đang có 88 câu học sinh báo sai chờ xử lý, 84 câu đã quá 48 giờ, câu cũ nhất từ 14/10; từ 17/10 chưa ai xử lý câu nào.
- a) Trưởng khối xử lý trong 48 giờ; quá hạn thì hiện ở màn của Trang.
- b) Claude xem trước từng câu (đề sai thật hay em làm sai), trưởng khối chỉ bấm chốt.
- Đang chạy: không ai được giao. **Đề xuất CTO: b, vẫn giữ hạn 48 giờ của a.**

**5. Khối 8T — câu vào kho thế nào?**
Ví dụ: bản đồ 8T có 56 dạng, chưa dạng nào có lý thuyết. Luật chung đòi "dạng phải có lý thuyết" ⇒ không câu 8T nào tự vào kho được. Ngày 10/10 chị từng cho "bài 8T auto duyệt".
- a) 8T được miễn điều kiện lý thuyết (sách nguồn là chuẩn), vẫn phải đủ các điều kiện còn lại.
- b) 8T về hết hàng chờ trưởng khối cho tới khi bản đồ 8T có lý thuyết.
- **Đề xuất CTO: a.**

**6. Hình của câu lượng giác / vectơ và hình không gian lớp 11 — có vẽ lại không?**
Ví dụ: 70 câu vectơ đã được vẽ lại bằng code từ 08/11, nhưng luật vẫn ghi "chưa có luật vẽ lại cho phần này".
- a) Áp luôn luật chung 15/11: ảnh gốc ổn thì giữ; có lỗi a–f hoặc có lệnh mới vẽ lại. Loại hình chưa có máy vẽ (đồ thị, đường tròn lượng giác, hình không gian) thì giữ ảnh gốc.
- b) Chưa cho vẽ lại phần này, giữ ảnh gốc hết.
- **Đề xuất CTO: a.**

**7. Khối 3 chưa có luật giải.**
Ví dụ: kho có 2.866 câu khối 3 và 51 dạng, nhưng gõ lệnh lấy luật khối 3 thì máy báo "không có mục Khối 3".
- a) Thêm mục "Khối 3" ngắn: dùng luật Khối 4 + bảng cấm tiểu học; tài liệu khối 3 đầu tiên là lô mẫu.
- b) Chưa nhận tài liệu khối 3; ghi rõ như vậy.
- **Đề xuất CTO: a.**

**8. Quét lại kho cũ (dừng từ 14/09) — có làm tiếp không?**
Ví dụ: kho Đại 78.948 câu; 54.785 câu chưa từng được kiểm lại đáp số, trong đó 29.841 câu đang "đã duyệt".
- a) Quét tiếp, khối 6–9 trước, câu học sinh đã làm trước.
- b) Không quét hàng loạt; chỉ kiểm khi có báo sai và khi câu sắp vào đề.
- Đang chạy: b (không ai quét). **Đề xuất CTO: b cho tới khi xong toanmath, rồi a.**

### Lệch kỹ thuật (CTO tự xử khi có lệnh, không cần Thùy quyết)

- `ghi.mjs` còn gõ cứng nhãn "người giải" — sửa trước batch đề thi kế tiếp (đã chốt 17/11).
- Cổng chưa kiểm dòng `luat:` · chưa đọc `dang=` / `chac=` · chưa nhận `hinh_hoc` cho khối 6, 12 · chưa có máy rút mẫu 15 %.
- Nhãn nguồn hình chưa ghi ở đường sách, bài học Hình, nhập trên ERP (178 câu mới không nhãn).
- Mã luật băm cả Phần C ⇒ mỗi lần xoá một dòng nợ §C10 là đổi mã mọi khối. Hướng gọn: lệnh cắt luật chỉ lấy §C1–§C7 (sửa 1 dòng script, không đổi tiêu đề).
- Brief của khối chỉ có kho Đại (4, 4T, 5, 5T) vẫn kèm ~170 dòng "Hình — luật chung".
- 1.122 câu đề thi được duyệt nguồn AI từ 05/11 bằng đường chưa rõ — cần dò `pg_proc` / script.
- 1.142 câu trả lời ngắn có đáp án dấu chấm thập phân (Đại 991 · HGT 131 · Hình 20; 4 câu HGT tạo từ 15/11); prompt nhập trong ERP còn dặn dấu chấm.
- Lý thuyết còn chứa `##VD`: 31/568 nhóm · 8/1.533 dạng bài (4T 3 · 9 5) — thuộc `spec-ban-do-toan`.
- `spec-kho-cau-hoi` §3.3 còn ghi "Cấp 1 (K3–5T, còn bản đồ cũ)" — DB: cả 13 khối đã chạy bản đồ mới.
- DB còn bảng `hinh_nhom_mo_hinh` (tầng nhóm mô hình đã bỏ) và đồ của tool giải bài — xoá cần Thùy gật.

---

## Phụ lục — SQL kiểm lại các số chính (chỉ đọc)

```sql
-- (1) Đại theo khối × duyệt × nguồn giải  → tổng 78.948 · đã duyệt 52.387 · chưa 26.561 · nghi đang chờ 531
select b.khoi, count(*) tong, count(*) filter (where c.da_duyet) da_duyet,
       count(*) filter (where c.nguon_giai='ai') giai_ai, count(*) filter (where c.nguon_giai='nguoi') giai_nguoi,
       count(*) filter (where c.da_duyet and c.duyet_nguon='ai') duyet_ai,
       count(*) filter (where not c.da_duyet and c.kiem_may='nghi') nghi_cho
from dai_cau_hoi c join dai_ban_do b on b.ma_dang=c.dang_chinh where c.xoa_at is null
group by grouping sets ((b.khoi),()) order by 1;
-- HGT: thay dai_ → hgt_ (6.572 · 5.171 · nghi 30). Hình: hinh_hoc_cau_hoi join hinh_hoc_bai on ma_bai=dang_chinh (9.140 · 5.082 · nghi 120)

-- (2) Câu tự duyệt bởi trigger (giờ duyệt = giờ gán dạng)  → Đại 6.216 (không dấu khớp 4.745 · tự luận 2.144 · dạng không lý thuyết 106); hgt_: 393 / 333 / 101 / 5
select count(*) tu_duyet, count(*) filter (where c.kiem_may is distinct from 'khop') khong_dau_khop,
       count(*) filter (where c.loai_cau='tu_luan') tu_luan, count(*) filter (where coalesce(btrim(d.ly_thuyet),'')='') dang_khong_lt
from dai_cau_hoi c join dai_bdm_gan_cau g on g.ma_cau=c.ma_cau and g.nguon='ai' join dai_bdm_dang_bai d on d.id=g.dang_bai_id
where c.xoa_at is null and c.da_duyet and c.duyet_nguon='ai' and c.duyet_at=g.at;

-- (3) Câu đề thi mang nhãn "người giải"  → Đại 41.355 · HGT 3.872 · Hình 7.215 (từ 15/11: 1.124 · 418 · 186)
select nguon_giai, giai_method, count(*), count(*) filter (where created_at >= '2026-11-15+07') tu_1511, max(created_at)
from dai_cau_hoi where xoa_at is null and nguon='de_thi' group by 1,2;

-- (4) Lời giải Claude đang chờ duyệt (Đại)  → 972 (4T 653 · 5T 207 · 8T 73 · 7 27 · 11 12)
select b.khoi, count(*) from dai_cau_hoi c join dai_ban_do b on b.ma_dang=c.dang_chinh
where c.xoa_at is null and not c.da_duyet and c.nguon_giai='ai' and c.giai_method='claude_code' group by 1;

-- (5) Báo sai  → mới 88 (quá 48 giờ: 84)
select trang_thai, count(*), count(*) filter (where created_at < now() - interval '48 hours') qua_48h, min(created_at) from bai_cau_bao_loi group by 1;

-- (6) Hình đề tạo sau 15/11 22:55 không nhãn nguồn  → Đại 111/111 · Hình 67/67; bảng nhãn 24 dòng
select count(*), count(*) filter (where not exists (select 1 from kho_hinh_nguon n where n.ma_cau=c.ma_cau and n.url=c.anh_de))
from dai_cau_hoi c where c.xoa_at is null and c.anh_de is not null and c.created_at >= '2026-11-15 22:55+07';

-- (7) Quét kho cũ  → mcq-auto 1 lô 1.696 câu · claude_code 84 lô 16.131 câu, lô cuối 14/09
select boi, count(*) lo, sum(so_cau), sum(so_khop), sum(so_nghi), sum(so_khong_kiem), max(tao_at) from kho_kiem_lo group by 1;

-- (8) Dạng bài chưa có lý thuyết theo khối  → 188/1.533 (8T 56/56 · 9 46 · 12 35)
select ch.khoi, count(*), count(*) filter (where coalesce(btrim(d.ly_thuyet),'')='') khong_lt
from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id left join dai_bdm_chu_de ch on ch.id=n.chu_de_id group by 1;
```

Batch toanmath: đọc `kho-rules/dai/lo/toanmath/TINH-TRANG.md` (tự sinh 15/11 22:14) — 130 batch: 30 xong · 5 dở · 95 chưa.
