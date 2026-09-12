# Quy trình kỹ thuật — Sinh câu TRẮC NGHIỆM (MCQ) cho câu tự luận trong kho

> Tài liệu này KHÁC `spec-mcq-form.md` (đó là quyết định PHẠM VI/Ý ĐỊNH của CEO cho Pool 1 gốc — 08/09).
> Đây là **QUY TRÌNH KỸ THUẬT** đúc kết từ thực chiến (08/09 → 12/09), dùng CHUNG cho MỌI khối/luồng
> làm tiếp việc này sau này. Đọc file này TRƯỚC khi thêm 1 dạng mới vào pipeline `mcq-auto.mjs`/`mcq-sinh.mjs`.

---

## 0. Bối cảnh: 2 LUỒNG SONG SONG (Thùy chốt 12/09)

- **Luồng A — khối 8-9**: lãnh thổ MỚI hoàn toàn, chưa khảo sát. Nội dung là đại số đa thức/phân thức —
  khác hẳn số học (Rat/BigInt) mà engine hiện tại (`mcq-auto.mjs`) được xây cho. **Việc đầu tiên của luồng
  này KHÔNG PHẢI code ngay** — phải khảo sát xem engine AST hiện có (parser LaTeX → cây biểu thức số) có
  áp dụng được cho đa thức không, hay cần kiến trúc riêng (rất có thể cần, vì Rat chỉ biểu diễn được SỐ,
  không biểu diễn được biến/đa thức tổng quát).
- **Luồng B — khối 6-7 phần còn lại**: tiếp tục đúng pattern đã chứng minh chạy tốt (xem DEVLOG 08/09→12/09).
- **2 luồng dùng CHUNG hạ tầng** — `dai_mcq_rule` (bảng rule), `scripts/mcq-auto.mjs`, `scripts/mcq-sinh.mjs`,
  `scripts/lib/mini-dang.mjs`. **Trước khi thêm rule mới, chạy `select max(ma) from dai_mcq_rule`** để biết mã
  kế tiếp — 2 luồng cùng lúc chọn trùng mã (vd cả 2 cùng đặt `R89`) sẽ đụng độ khi merge nhánh. Cùng lý do,
  đọc kỹ diff trước khi merge 3 file dùng chung này, đừng để 2 luồng ghi đè nhau.
- Trạng thái CHI TIẾT "dạng nào đã làm, dạng nào còn" luôn nằm ở `DEVLOG.md`/`HANDOFF.md` (không lặp lại ở
  đây — tài liệu này là QUY TRÌNH, không phải TRẠNG THÁI, để khỏi lệch nhau khi 2 bên cùng cập nhật).

---

## 1. Quy trình bắt buộc cho MỖI dạng mới

1. **Đọc `loi_giai` THẬT của vài câu mẫu trong kho trước.** Không suy đoán rule lỗi từ cấu trúc AST trong
   đầu — kho thường tự trình bày đúng khuôn TH1/TH2/các bước, đọc ra ngay chỗ HS hay trượt.
2. **Khảo sát HẾT các sub-shape văn bản của dạng** trước khi thiết kế: `select distinct regexp_replace(
   noi_dung, '[0-9]+', '#', 'g') as mau, count(*) from dai_cau_hoi where dang_chinh='...' group by mau`.
   1 `dang_chinh` thường KHÔNG chỉ có 1 hình dạng câu chữ — bỏ sót 1 sub-shape là bỏ sót rule cần thiết.
3. **Từ lời giải, liệt kê các ĐIỂM RẼ có thể sai** — đối chiếu `dai_mcq_rule` xem trùng/thiếu/**đã có nhưng
   SAI NGỮ CẢNH** (1 rule đúng cho dạng này có thể vô nghĩa hoặc cần đảo ngược ở dạng khác — đừng gán rule
   cũ vào ngữ cảnh mới chỉ vì tên nghe giống).
4. **Phân loại RÕ RÀNG (tự quyết) vs MƠ HỒ (phải hỏi CEO)** — xem tiêu chí ở mục 2.
   - RÕ RÀNG → tự thiết kế bảng rule → viết migration → code → verify → ghi.
   - MƠ HỒ → trình bày NGẮN GỌN cho CEO (hình dạng câu hỏi là gì, vì sao chưa rõ, có phương án nào) → CHỈ
     code sau khi CEO chốt. Đây là quyết định SẢN PHẨM (ảnh hưởng chất lượng chẩn đoán lỗi HS thật), không
     phải chi tiết kỹ thuật tự quyết được.
5. **Không bao giờ ghi form vào DB trước khi verify sạch (0 FAIL).**
6. **Kiểm `lua_chon`/`menh_de` có NULL không TRƯỚC khi khảo sát sâu** — nhiều lần dạng "tưởng cần convert"
   hoá ra ĐÃ LÀ trắc nghiệm gốc trong kho (`lua_chon` có sẵn), ngoài phạm vi pipeline này (pipeline chỉ nhận
   câu `q.lua_chon is null and q.menh_de is null`).

---

## 2. Tiêu chí RÕ RÀNG vs MƠ HỒ (quyết định nhanh)

| Hình dạng đáp số | Phân loại | Ghi chú |
|---|---|---|
| 1 GIÁ TRỊ hữu tỉ đơn | RÕ | Khuôn cũ: `SPECIAL_DANG`/`parseHuuTi` hoặc AST thường |
| TẬP hữu hạn/vô hạn liệt kê rõ (ước, bội, khoảng nghiệm) | RÕ | `TEXT_DANG` |
| BIỂU THỨC/CÔNG THỨC đóng, 1 khuôn cố định (có thể tham số hoá) | RÕ *nhưng* phải khảo sát hết sub-shape trước — dễ trộn nhiều khuôn công thức khác nhau (vd DẠNG "dãy luỹ thừa" từng gặp trộn cả tổng hình học + tổng đan dấu + giải-ngược-số-mũ trong 1 `dang_chinh` → MƠ HỒ) | |
| ≤3 kết luận rời rạc cố định (vd "so sánh A,B → chỉ có thể A<B/A>B/A=B") | **MƠ HỒ** | Không đủ không gian cho 4 phương án phân biệt thật — đừng cố ép |
| "Có/Không" kiểu chứng minh Đúng-Sai | **MƠ HỒ** | Khuôn "4 đáp án tính toán" không hợp; có thể cần hình thức khác (4 mệnh đề Đúng/Sai, 4 lý do lập luận) — hỏi trước |
| Nhiều bước lập luận nối tiếp (chứng minh, toán thực tế nhiều bước, tìm 2 số biết ƯCLN+tổng, GTLN-GTNN...) | **NGOÀI PHẠM VI hiện tại** | Thuộc nhóm "TRẮC NGHIỆM TỪNG PHẦN" — kiến trúc CHƯA THIẾT KẾ (xem mục 6). Đừng nhét vào khuôn "1 câu 4 đáp án nguyên câu" |

---

## 3. Kiến trúc kỹ thuật hiện có (đọc trước khi sửa)

- **`scripts/lib/mini-dang.mjs`** — mini-solver cho dạng KHÔNG khớp khuôn "biểu thức LaTeX → AST" chung
  (câu hỏi bằng văn xuôi, không phải 1 phép tính). Mỗi DẠNG đánh số theo comment trong file (DẠNG 1, 2, 3…),
  1 hàm riêng. Dùng chung kiểu `Rat {p,q}` BigInt **tự copy lại** ở đầu file (KHÔNG import từ `mcq-auto.mjs`
  — tránh vòng import; 2 file giữ chung quy ước `texR`/`fmtV` để format số nhất quán).
- **`scripts/mcq-auto.mjs`** — engine chính: parser LaTeX → AST cho biểu thức số học thường (Rat/BigInt) +
  2 bảng dispatch phụ:
  - **`SPECIAL_DANG[dang]`** — hàm `(noiDung, rule) → {value:Rat, text?, ds?} | null`. Dùng khi đáp số LÀ
    1 GIÁ TRỊ HỮU TỈ nhưng câu hỏi KHÔNG khớp khuôn AST (vd "Tìm UCLN của 20 và 30" — văn xuôi, không phải
    "20+30=?").
  - **`TEXT_DANG[dang]` + `TEXT_FN[dang]={canon, val}`** — dùng khi đáp số KHÔNG PHẢI 1 giá trị hữu tỉ đơn
    (biểu thức luỹ thừa, tập số, chuỗi bất đẳng thức giữ thứ tự…). **Mỗi dạng 1 cặp `{canon,val}` RIÊNG** —
    KHÔNG dùng chung 1 cặp cho mọi dạng vì cú pháp đáp số khác hẳn nhau (vd `\cdot` của biểu thức nguyên tố
    vs `"; "` của tập số vs `" < "` của chuỗi thứ tự).
- **`scripts/mcq-sinh.mjs`** — CLI pipeline `--list [--dang X] [--n N] [--out f.json]` / `--verify f.json`
  / `--ghi f.json`. Có `TEXT_DANG` Set + `TEXT_FN` **RIÊNG, đồng bộ TAY** với `mcq-auto.mjs` (2 nơi định
  nghĩa lặp lại — sửa 1 nơi mà quên nơi kia là bug âm thầm, luôn sửa CẢ HAI khi thêm dạng mới).

---

## 4. Dạng TRỘN nhiều sub-shape trong CÙNG `dang_chinh`

Ca thật đã gặp: `T107010103` (vừa "tìm x,y nguyên" vừa "sắp xếp tăng dần"), `T106040104`/`T106040204`
(vừa "1 giá trị" vừa "tập theo khoảng"). 1 `dang_chinh` mặc định chỉ dispatch qua ĐÚNG 1 trong 2 nhánh
(`TEXT_DANG` hoặc `SPECIAL_DANG`) — nếu 2 sub-shape cần 2 nhánh khác nhau:

- **`mcq-auto.mjs`**: khi `textFn(noiDung, null)` trả `null` (câu không khớp sub-shape của `textFn`), **KHÔNG
  bỏ ngay** — để nó rơi xuống thử nhánh `parseHuuTi`/`SPECIAL_DANG`/AST bình thường bên dưới (bản hiện tại
  đã sửa sẵn theo cách này, xem comment "câu này không khớp sub-shape TEXT_DANG" trong vòng lặp chính).
- **`mcq-sinh.mjs`**: phân biệt sub-shape bằng **1 CHỮ KÝ trong CHÍNH đáp số kho** (vd có ký tự `<` hay
  không — xem hàm `laHinhThucText`), **không suy từ nội dung câu hỏi**. Áp cho cả `list()`, `kiemCau()`, `ghi()`.

---

## 5. Thiết kế rule (`dai_mcq_rule`)

- Mã `R01, R02, …` **TĂNG DẦN, không trùng** — `select max(ma)` trước khi đặt mã mới (đặc biệt khi 2 luồng
  chạy song song, xem mục 0).
- Mỗi câu cần **tối thiểu 3 rule khả dụng** (4 đáp án − 1 đúng). Chạy thật mà tỉ lệ "chỉ tìm được N<3
  distractor" cao (>20-30%) → **không cố ép** — debug 1 câu bỏ cụ thể xem THIẾU CƠ CHẾ GÌ (thường là số liệu
  quá đặc thù khiến 1 vài rule luôn trả `null`), thêm 1-2 **rule dự phòng** (luôn tính được, không phụ thuộc
  đặc điểm số cụ thể của câu) qua **MIGRATION MỚI** (không sửa migration rule cũ đã áp — lịch sử migration
  bất biến, xem `CLAUDE.md` §2.1).
- `du_phong=true` tối đa **1 rule/câu** (DB trigger + code check `kiemCau`). Nếu 1 dạng có ≥2 rule đều đánh
  `du_phong=true` VÀ có thể CÙNG xuất hiện trong 1 câu → verify sẽ FAIL "quá 1 rule dự phòng". Chỉ đánh
  `du_phong` cho rule thật sự mang tính "cứu vãn/dự phòng", không đánh cho rule chính đáng đứng một mình được.
- **2 rule tưởng khác nhau có thể LUÔN ra cùng công thức đại số** (đã dính: `dung+K` và `K(K+1)/2` — về mặt
  đại số luôn bằng nhau) — thử vài giá trị cụ thể trước khi đăng ký 1 rule "mới", đừng chỉ nhìn "tên nghe khác".

---

## 6. Chạy pipeline (không đổi từ Pool 1)

```
node scripts/mcq-sinh.mjs --list --dang <ma_dang> --n 100 --out pool.json
node scripts/mcq-auto.mjs pool.json --out kq.json           # thêm --debug <ma_cau> để soi 1 câu mẫu trước
node scripts/mcq-sinh.mjs --verify kq.json                   # phải 0 FAIL mới sang bước ghi
node scripts/mcq-sinh.mjs --ghi kq.json
```

Migration (rule mới) phải **áp TRƯỚC** khi chạy `mcq-auto.mjs`/`--verify` — rule phải tồn tại trong DB thì
verify mới nhận (`ruleMap.has(r)`). Sau khi ghi xong: dọn file `pool.json`/`kq.json` tạm, `npm run schema`,
ghi 1 mục `DEVLOG.md`.

---

## 7. Bẫy kỹ thuật hay gặp (đúc kết thực chiến, đọc để khỏi tái phạm)

- **Kho bọc `$…$` quanh TỪNG CỤM so sánh/biểu thức, KHÔNG bọc quanh cả câu** (vd `"...biết rằng $36 \vdots n$
  và $n<15$."` — dấu `$` xen giữa các cụm điều kiện). Regex nối 2 cụm bằng `\s*và\s*` mà không cho phép
  `\$?` ở ranh giới sẽ FAIL SILENT (trả `null`, không lỗi) — **luôn test regex bằng `.match()` trên CHUỖI
  THẬT lấy từ DB trước khi tin**, đừng suy từ cách kho hiển thị trong đầu.
- **`neverZero()` (tích bằng 0, `mcq-auto.mjs`) chỉ nhận diện luỹ thừa chẵn TRẦN (`x²`)**, không tự nhận
  hạng tử có hệ số (`4x²`) — đã vá (12/09), nhưng nhắc để không tái phát nếu viết solver tương tự cần
  "chứng minh 1 biểu thức luôn dương/luôn khác 0".
- **Regex mismatch trả `null` ÂM THẦM, không lỗi** — code sẽ chỉ báo "không tính được"/"chỉ tìm được N<3
  distractor" chứ không chỉ thẳng ra lỗi ở đâu; luôn debug bằng cách gọi hàm trực tiếp trên 1 chuỗi thật.
- **`parseHuuTi` (huuti.mjs) là gate chung** cho mọi dạng KHÔNG nằm trong `TEXT_DANG` — nếu đáp số kho không
  phải 1 giá trị hữu tỉ (chuỗi, tập, công thức, câu chữ), câu sẽ bị loại NGAY TỪ ĐẦU với lý do "đáp số kho
  không parse" trước khi chạm tới `SPECIAL_DANG`. Đây là tín hiệu đáng tin để phát hiện dạng cần `TEXT_DANG`.

---

## 8. Ngoài phạm vi hiện tại — nhóm "TRẮC NGHIỆM TỪNG PHẦN"

Thùy chốt 12/09: các dạng sau **KHÔNG cố nhét vào khuôn "1 câu → 4 đáp án nguyên câu" hiện tại**.

**⭐ ĐÍNH CHÍNH (12/09, sau khi đọc lại `spec-dien-o.md`): kiến trúc cho nhóm này ĐÃ ĐƯỢC CEO CHỐT SẴN, KHÔNG
phải "chưa thiết kế" như bản đầu tài liệu này viết.** `spec-dien-o.md` §1/§3/§4 (phase 2 — "câu tính toán")
chính là "trắc nghiệm từng phần": lời giải tách bước theo dấu `=`, mỗi bước có **ô** là 1 phép tính con, mỗi
ô 4 phương án sinh bằng RULE LỖI CÓ SẴN (R01–R84, dùng chung bảng `dai_mcq_rule` với pipeline TN) — **100%
máy, không cần AI** cho loại ô "Giá trị"/"Biểu thức sau chuyển vế". Vấn đề duy nhất: **spec này ĐÃ CHỐT 09/09
nhưng CHƯA XÂY cho Đại** — `scripts/mcq-dien.mjs` (D1) và bảng `dai_cau_form_dien` (D2) chưa tồn tại; chỉ có
nhánh HÌNH chứng minh (`scripts/hinh-dien.mjs` + `hinh_form_dien`, đã pilot 23 form khối 7) được build, vì
đó là Phase 1 của cùng spec (§0b). Xem `spec-mcq-tung-phan.md` (file riêng, viết 12/09) — cầu nối cụ thể giữa
`spec-dien-o.md` và hàng đợi dạng đang chờ.

- GTLN-GTNN / bài toán nâng cao (khối 7, và tương tự ở khối khác nếu gặp).
- Toán thực tế (mọi khối — bản chất nhiều bước lập luận theo ngữ cảnh, không phải 1 phép tính).
- Đáp số "Có/Không" kiểu chứng minh Đúng-Sai (vd "chia hết của tổng/hiệu/tích", "chia hết dãy tổng luỹ thừa").
- Đại số nhiều bước biến đổi (vd "Tìm n để an+b chia hết cho cn+d" với hệ số a,c≠1 — cần nhân chéo/quy về
  dạng chuẩn TRƯỚC khi giải, rủi ro bug đại số cao nếu ép vào khuôn 1-bước hiện tại).
- Dãy tính toán trộn nhiều kiểu đáp số khác hẳn nhau trong cùng 1 `dang_chinh` (đã gặp: tổng hình học đóng +
  tổng đan dấu + giải ngược ra số mũ — 3 hình dạng đáp số khác nhau, không đủ dữ liệu/mẫu để thiết kế chắc).

Danh sách CỤ THỂ (mã dạng, số câu) đang chờ nhóm này nằm ở `DEVLOG.md` (mục "trắc nghiệm từng phần", cập
nhật 12/09) — không lặp lại ở đây vì danh sách này sẽ còn tăng khi khảo sát thêm. Gặp 1 dạng rơi vào các mô
tả trên → không cần khảo sát lại từ đầu, thêm vào danh sách đó và báo CEO nếu cần bàn kiến trúc mới.

---

## 9. Tham chiếu

- `spec-mcq-form.md` — quyết định phạm vi/ý định gốc (Pool 1, CEO chốt 08/09). Đọc trước tài liệu này.
- `spec-kho-chuan.md` — Cửa 1 (duyệt câu gốc); pipeline này chỉ nhận câu đã qua Cửa 1 (`q.da_duyet`).
- `CLAUDE.md` §1.5 (chống NULL), §1.6 (nhãn môn), §2.0 (tính ở Postgres), §2.1 (migration) — nguyên tắc nền,
  áp dụng cho MỌI migration/code trong luồng này.
- `DEVLOG.md`/`HANDOFF.md` — trạng thái CHI TIẾT theo ngày (dạng nào đã làm, kết quả bao nhiêu %, danh sách
  "trắc nghiệm từng phần" đang chờ). Tài liệu này (`spec-mcq-quy-trinh-sinh.md`) là QUY TRÌNH, đọc 1 lần,
  ít đổi; DEVLOG/HANDOFF là TRẠNG THÁI, đọc mỗi phiên.
