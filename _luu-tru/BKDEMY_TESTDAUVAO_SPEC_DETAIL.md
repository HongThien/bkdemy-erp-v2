# Test đầu vào (Tuyển sinh — Chấm & Trả kết quả) — Spec CHI TIẾT

Bản này bóc story tuyển sinh (từ lúc HS đến test → trả phiếu cho PH) thành **luồng + màn hình + done-when + ngoại lệ + chạm-dữ-liệu (mô tả nghiệp vụ, KHÔNG phải tên cột)**. Cùng khuôn với `BKDEMY_OPS_SPEC_DETAIL.md`.

> **ĐỌC TRƯỚC:** `HANDOFF.md` + `CLAUDE.md`. Verify schema THẬT trước khi code (đừng tin tên cột trong spec — mô tả nghiệp vụ, Claude Code tự map). Reuse: khung **task derive** (buổi học/card, `getMyScope`), kho câu/dạng + bản đồ kiến thức, cấu trúc **đề thi snapshot đề+key**, storage bucket + trỏ-file ERP, hạ tầng in phiếu (PhieuTestDauVao/print v2). RLS: data DISABLE / staffs ENABLE. "vị trí" không "ghế". Mọi data học tập mang nhãn **`mon`** (CLAUDE.md §1.6).

---

## 0. Một câu về module này

Một chuỗi **4 task derive nối tiếp**, mỗi task đóng lại **tự sinh** task kế (đúng pattern "task = must-exist − does-exist"):

```
Điểm danh test (Ops) → Chấm test (Học thuật) → Nhận xét (Học thuật) → Trả bài (Ops) → HẾT
```

Kết ở **gửi phiếu Zalo cho PH**. Chốt học/không diễn ra ở Zalo; chuyển level tuyển sinh sau đó = việc Ops **ngoài module**.

**KHÔNG feed mastery.** Thang Đ/C/S dùng ở đây chỉ để **thống nhất logic đánh giá + tính điểm + dựng biểu đồ**; điểm test đầu vào **chỉ sống trong phiếu**, chấm xong quên, không neo dạng, không tái dùng. (Thí sinh chưa phải `hoc_sinh` thật.)

**KHÔNG dùng pipeline OMR/ET.** Đây là luồng **chấm-trên-màn thủ công** của GV/học thuật, đứng độc lập, không liên quan gì scan-QR-OMR của Scan ET.

---

## A. Nguyên tắc chung

1. **Derive-only.** Không có task nào tạo tay. Task N đóng (đủ done-when) → tự sinh task N+1 cho đúng nhóm phụ trách. Hủy/nghỉ = **lật trạng thái** → chuỗi tự ngừng (task sau không sinh), KHÔNG xóa dữ liệu.
2. **Neo snapshot, không live-ref.** Bài test neo **bản chụp đề** (câu/điểm/đáp án/dạng đóng băng lúc gán buổi test). Đổi đề định kỳ KHÔNG được làm hỏng bài đã chấm. (Cùng nguyên tắc snapshot đề+key của test online.)
3. **Mỗi ý = 1 câu.** Không phân biệt tự luận/trắc nghiệm/đúng-sai. Câu đúng/sai 8 ý = **8 câu độc lập**, mỗi câu 1 Đ/C/S, mỗi câu **neo 1 dạng**. Đồng nhất toàn hệ.
4. **Điểm:** Đ = full điểm câu · C = 50% điểm câu · S = 0. **Điểm bài = tổng điểm các câu.** Hiển thị kèm **% quy đổi** (điểm/điểm tối đa) để chuẩn.
5. **`mon` xuyên suốt.** Thí sinh test **nhiều môn**. Roster + đề + bài chấm + nhận xét + phiếu đều mang nhãn `mon`. Card chấm/nhận xét **tách theo môn** (mỗi môn 1 luồng chấm riêng).
6. **Off-ERP → evidence.** Việc ngoài ERP (scan giấy, gửi Zalo) phải để lại dấu: file upload / ảnh chụp = evidence, chặn đóng task khi thiếu.
7. **Task kế thừa khung hiệu suất chung** (tiến độ đo tại mốc đóng, credit theo người thực làm). Biên thời gian + chấm chất lượng cụ thể cho 4 task này **CHƯA chốt** → xem §F. v1 cứ để mốc-đóng cơ bản, chưa gắn điểm hiệu suất nếu chưa có biên.

---

## B. Thực thể & ranh giới (dựng/verify TRƯỚC)

- **Thí sinh (lead tuyển sinh):** danh tính = tên HS · SĐT PH · khối (hiện tại) · (các) môn đăng ký test · **level tuyển sinh** (L5 đăng ký test / L6 đã test / L7 học thử / L8 đã đăng ký học). **KHÔNG phải `hoc_sinh` thật** (không có id HS, không ghi danh).
  - ⚠ **Grep trước:** có thể đã tồn tại thực thể lead/tuyển sinh (bkdemy-ph, hoặc bảng roster kiểu V1 `test_dau_vao_hs`). Nếu có → dùng lại, thêm nhãn `mon` + level nếu thiếu. Nếu chưa → module này tạo bản tối thiểu. **Nêu trong PLAN.**
  - **Level:** module này set **L5 → L6** khi đóng card điểm danh test (đã thi xong). L6→L7→L8 = Ops làm **ngoài module** (sau khi trao đổi Zalo). *(Xem §F nếu muốn khác.)*
- **Buổi test (lịch test):** **ĐÃ CHỐT RIÊNG — KHÔNG thuộc spec này.** Module bắt đầu từ **card điểm danh test** treo trên buổi test đã có. Chỉ đọc: buổi test nào, thí sinh nào, môn nào, đề nào gán. ⚠ **KHÔNG tái dùng bảng `buoi_hoc`** (buổi học buộc `lop_id` + derive TKB — test không có lớp/TKB). Buổi test là thực thể riêng.
- **Đề test:** xem §C.
- **Phân công:** Ops task (điểm danh, trả bài) → theo phân công Ops/ca. Học thuật task (chấm, nhận xét) → **derive cho CẢ team học thuật** (không owner cứng), ai mở thì làm (§scope engine `getMyScope`).

---

## C. Đề Test (cấu trúc — chuẩn bị TRƯỚC, Ops đổi định kỳ thủ công)

Một đề test gắn **khối + môn**, gồm danh sách **câu** (mỗi ý = 1 câu). Mỗi câu:
- **nhãn/thứ tự** (Câu 1, 2a, 2b…),
- **điểm tối đa**,
- **đáp án** (text/LaTeX — hiển thị cột GIỮA khi chấm; để người chấm đối chiếu),
- **dạng neo** (`ma_dang` → để dựng **biểu đồ tổng hợp chuyên đề** ở phase nhận xét),
- *(tùy)* phân loại **cơ bản / nâng cao** + **phần** (Hình/Đại) — nếu về sau muốn derive gợi ý cho 4 dòng kiến thức; v1 nhận xét nhập tay nên **không bắt buộc**.

**Đổi đề định kỳ:** Ops tạo đề mới thủ công; đề cũ **giữ lịch sử**. Bài đã chấm neo **snapshot đề tại thời điểm gán buổi test** (§A.2) → đổi đề không hỏng bài cũ.

⚠ **Reuse decision (nêu trong PLAN):** Đề test có cấu trúc gần **đề thi kho v2** (câu + điểm + đáp án + dạng) và gần **exam_items V1**. Grep xem tái dùng được cấu trúc đề thi v2 (thêm nhãn "đề test đầu vào") hay cần thực thể riêng. **Ưu tiên reuse.**

---

## STORY 1 — Điểm danh test + scan bài

**Actor:** Ops trực · **Tiền đề:** thí sinh L5 + có buổi test (đã chốt riêng) + đề đã gán.

**Luồng chính:**
1. Ops mở "Việc của tôi" → thấy **card điểm danh test** của buổi test (theo phân công Ops).
2. Ops **điểm danh** từng thí sinh đến + **điền/kiểm thông tin HS** (tên, SĐT PH, khối, môn test).
3. HS thi xong → Ops **scan bài làm → upload** vào card (1 file/HS/môn, hoặc gộp — theo cách scan; file = evidence, đóng dấu **mốc upload server-side**).
4. Ops **đóng card**. → **set L5 → L6** (đã test) cho các thí sinh đã thi. → **derive task Chấm test** cho từng (thí sinh × môn) đã có bài scan, đẩy vào pool **team học thuật**.

**Done-when:** card đóng + mỗi thí sinh-đã-đến có **≥1 file scan hợp lệ/môn** (đọc mở được).
**Ngoại lệ:**
- **No-show** (thí sinh không đến) → Ops đánh **"vắng/hủy"** → **KHÔNG derive** chuỗi chấm/nhận xét/trả bài cho thí sinh đó. (Lật trạng thái = task sau tự ngừng.)
- Thiếu/lỗi file scan 1 thí sinh → chặn đóng phần đó hoặc flag "thiếu bài".

**Màn hình cần:** Card điểm danh test (danh sách thí sinh của buổi · điểm danh · sửa thông tin · upload bài/HS · đánh vắng · nút đóng chặn khi thiếu scan).
**Chạm dữ liệu:** đọc buổi test → thí sinh/môn/đề; ghi điểm danh + thông tin + file scan (storage ERP) + mốc upload; set level L5→L6; derive task chấm per (thí sinh × môn).

---

## STORY 2 — Chấm test

**Actor:** Team học thuật (derive **cả team**, ai mở thì làm) · **Tiền đề:** có bài scan + đề snapshot.

> **Phân công mềm:** thường 1 người làm 1 lèo tới hết. Cho phép **tách người ở phase chấm vs nhận xét** (chấm nhiều người làm được, nhận xét ít hơn). v1 KHÔNG cần lock cứng; nếu rẻ thì hiện chỉ báo "đang chấm bởi X" để tránh chấm đè (nice-to-have, không phải done-when).

**Luồng chính:**
1. Người chấm mở **card chấm test** (theo thí sinh × môn). Card **3 cột**:
   - **Trái:** file scan bài làm HS — **kéo dọc độc lập** (xem toàn bài).
   - **Giữa:** **đáp án từng câu** (từ đề snapshot).
   - **Phải:** ô đánh giá **Đ / C / S per câu** — cuộn/kéo độc lập, hoặc **next/prev** từng câu (tùy tối ưu). 2 vùng (scan | dữ liệu) có **thanh kéo riêng**.
2. Người chấm chọn Đ/C/S cho **mỗi câu** (mỗi ý = 1 câu).
3. Hệ **tự tính điểm** theo cấu trúc: Đ→full · C→½ · S→0. **Điểm bài = tổng điểm câu** (hiện kèm % = điểm/điểm-tối-đa). Cập nhật realtime khi chọn.
4. Chấm xong → **bấm xác nhận (đóng chấm)**. → **derive task Nhận xét** cho thí sinh×môn đó (vào pool học thuật).

**Done-when:** mọi câu có Đ/C/S + card chấm đóng.
**Ngoại lệ:** thí sinh vắng (từ Story 1) → card này không sinh. Mở lại chấm = lật trạng thái (task nhận xét sau tự ngừng tới khi đóng lại).

**⛔ OUT v1 (phase sau):** **chấm-vẽ-trên-PDF** (khoanh tròn/elip chỗ sai, dấu tích chỗ đúng trực tiếp trên scan). v1 **chấm ngoài giấy trước / chỉ chọn Đ/C/S trên màn**; annotation là phase sau (đã làm ở V1, không gấp).

**Màn hình cần:** Card chấm 3 cột (scan kéo dọc | đáp án/câu | Đ/C/S per câu + next/prev) · thanh điểm+% realtime · nút xác nhận.
**Chạm dữ liệu:** đọc scan + đề snapshot (câu/điểm/đáp án); ghi Đ/C/S per câu + điểm bài; derive task nhận xét. **KHÔNG feed mastery.**

---

## STORY 3 — Nhận xét

**Actor:** Team học thuật (derive cả team; ít người hơn phase chấm) · **Tiền đề:** đã chấm xong.

**Luồng chính:**
1. Mở **card nhận xét** (thí sinh × môn). Bố cục:
   - **Trái:** file scan bài HS — **kéo dọc** để nhìn lại.
   - **Phải-trên:** **biểu đồ tổng hợp theo chuyên đề** — derive từ Đ/C/S per câu (gom theo dạng→chuyên đề). **Chỉ để trông xịn** (PH không hiểu dạng/chuyên đề); là tham chiếu cho người nhận xét, KHÔNG phải điểm.
   - **Phải-dưới:** **ô nhận xét NHẬP TAY**, chia mục:
     - **Kỹ năng:** *Trình bày* · *Tính toán – biến đổi* — mỗi mục 3 mức **Tốt / Ổn / Kém**.
     - **Kiến thức:** 4 dòng — *Hình cơ bản* · *Đại cơ bản* · *Hình nâng cao* · *Đại nâng cao* (nhập tay). *(Bộ trục này Toán-shaped — xem §F cho môn khác.)*
     - **Nhận xét khác:** ô tự do (tùy chọn).
   - *(Nên tái dùng thư viện câu mẫu nhận xét V1: gõ để tìm mẫu + lưu câu mới — nếu có sẵn.)*
2. **Chọn lớp đề xuất** cho thí sinh (đề xuất để gửi PH — **KHÔNG ghi danh thật**).
3. Bấm **kết thúc nhận xét**. → **derive task Trả bài**.

**Done-when:** đã nhập ≥1 mục nhận xét + đã chọn lớp đề xuất + card đóng.
**Chạm dữ liệu:** đọc scan + Đ/C/S per câu (dựng biểu đồ chuyên đề); ghi nhận xét (kỹ năng/kiến thức/khác) + lớp đề xuất; derive task trả bài. Nhận xét/lớp lưu ở **lead/roster** (nguồn cho phiếu).

---

## STORY 4 — Trả bài

**Actor:** Ops · **Tiền đề:** đã nhận xét + có lớp đề xuất.

**Luồng chính:**
1. Ops mở **card trả bài** → xem/xuất **phiếu kết quả** thí sinh (§D).
2. **Chụp/xuất ảnh phiếu → gửi Zalo PH** (off-ERP).
3. Trao đổi với PH xong → **đóng card**. → **HẾT story.**

**Done-when:** card đóng (+ evidence đã gửi nếu bật bắt-evidence).
**Ngoài scope (Ops làm sau, ngoài module):** PH đồng ý học → Ops chuyển level **L6 → L7/L8**. Kết quả trao đổi Zalo báo lại Ops xử lý. Ghi danh HS thật = module Nhân sự/Lớp/HS, **KHÔNG ở đây**.

**Màn hình cần:** Card trả bài (preview phiếu + nút copy ảnh/xuất + đóng).
**Chạm dữ liệu:** đọc dữ liệu phiếu (điểm/nhận xét/lớp/GV); ghi mốc đóng (+ evidence gửi nếu có).

---

## D. Phiếu kết quả (gửi PH)

**Reuse:** hạ tầng in phiếu V1 `PhieuTestDauVao` (A4, popup + html2canvas → PNG lẻ / zip batch) hoặc print v2 — grep, ưu tiên reuse.

**Nội dung phiếu (1 môn):** header BK · thí sinh (tên/khối) · **điểm bài + %** · **biểu đồ tổng hợp chuyên đề** (để đẹp) · **nhận xét** (Kỹ năng / Kiến thức 4 dòng / khác) · **lớp đề xuất** + GV phụ trách (nếu có).

⚠ **CHƯA CHỐT — đa môn:** thí sinh test nhiều môn → **1 phiếu ghép nhiều môn** hay **mỗi môn 1 phiếu riêng** (PH nhận 1 ảnh hay N ảnh)? → xem §F. **Chờ chốt trước khi dựng layout phiếu.**

---

## E. Phạm vi v1 / OUT

**IN:** 4 story trên (điểm danh+scan → chấm 3-cột Đ/C/S → nhận xét nhập tay + biểu đồ chuyên đề + lớp đề xuất → trả bài gửi Zalo) · đề test (cấu trúc + snapshot + đổi định kỳ) · nhãn `mon` xuyên suốt · derive chuỗi + hủy-khi-vắng · phiếu kết quả · set L5→L6.

**OUT (phase sau / ngoài module):**
- **Chấm-vẽ-trên-PDF** (annotation khoanh/tích) — v1 chấm ngoài giấy trước.
- **Feed mastery** — cố ý KHÔNG (thí sinh chưa phải HS; Đ/C/S chỉ để tính điểm/biểu đồ).
- **Pipeline OMR/QR** — không liên quan (đây là chấm-trên-màn thủ công).
- **Ghi danh HS thật + chuyển L6→L8** — Ops làm ngoài module.
- **Xếp hạng vs cohort HS BK** (feature V1) — story v2 không nhắc → mặc định OUT (§F nếu muốn).
- **Auto-send Zalo** — chờ app.
- **Buổi test / lịch test** — đã chốt riêng, không thuộc spec này.

---

## F. Chỗ CHƯA CHỐT → hỏi Thùy (nêu lại trong PLAN.md)

1. **Đa môn — 1 phiếu ghép hay N phiếu riêng?** (quyết layout phiếu + luồng gửi Zalo.)
2. **Trục nhận xét cho môn ≠ Toán.** "Hình/Đại cơ bản/nâng cao" là Toán-shaped. Môn KHTN/Văn/Anh: dùng bộ trục khác (config per môn) hay v1 chỉ Toán có 4 dòng, môn khác để nhận xét tự do?
3. **Thực thể lead/roster tuyển sinh** đã tồn tại chưa (grep) → dùng lại hay tạo mới? Level L5–L8 lưu ở đâu?
4. **Ai/khi nào set L5→L6?** (mặc định spec: đóng card điểm danh test. Xác nhận.)
5. **Đề test reuse đề-thi-kho v2 hay thực thể riêng?** (ưu tiên reuse — chốt sau grep.)
6. **Hiệu suất staff:** 4 task này có gắn tiến độ/chất lượng (engine hiệu suất) không, biên bao nhiêu? v1 để mốc-đóng trơn được không?
7. **Xếp hạng vs cohort** (V1 có) — bỏ hẳn hay giữ optional?

---

## Goal / Kickoff

> Kick 1 câu: *"Đọc BKDEMY_TESTDAUVAO_SPEC_DETAIL.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build module Test đầu vào (tuyển sinh — chấm & trả kết quả) theo spec này, tới khi đạt HẾT "Done-when" của cả 4 story.

**ĐỌC TRƯỚC:** HANDOFF.md + CLAUDE.md + toàn bộ spec này.

**PHA 0 — KHẢO SÁT & PLAN (bắt buộc, TRƯỚC khi code):**
1. Grep repo: khung task **derive** + card + `getMyScope` · **buổi test** (đã chốt riêng — tìm thực thể) · thực thể **lead/roster tuyển sinh** (có chưa? V1 `test_dau_vao_hs`?) · cấu trúc **đề thi kho v2 / exam_items** (đề test reuse được?) · **storage bucket + trỏ-file** · hạ tầng **in phiếu** (`PhieuTestDauVao`/print v2) · **bản đồ kiến thức** (dạng→chuyên đề, cho biểu đồ) · thư viện **câu mẫu nhận xét**.
2. Viết `PLAN.md`: schema đề xuất (cột THẬT sau verify) cho từng story, file sẽ tạo/sửa, luồng màn hình, **trả lời/hỏi lại 7 câu §F**.
3. **DỪNG, chờ Thùy duyệt PLAN.** Duyệt xong mới code.

**KỶ LUẬT:**
- Verify schema TRƯỚC migration (`information_schema.columns` + `pg_tables.rowsecurity`). `ls supabase/migrations | tail` check trùng số. Grep trước khi đổi.
- **Reuse > đẻ mới.** Đừng tái dùng bảng `buoi_hoc` cho buổi test. Ưu tiên reuse đề-thi-kho + print + derive framework.
- Mọi data học tập mang **`mon`**. Card chấm/nhận xét/phiếu tách theo môn.
- Derive-only: task = must-exist − does-exist; vắng/hủy = lật trạng thái → chuỗi tự ngừng, KHÔNG xóa.
- Snapshot đề (đóng băng câu/điểm/đáp án/dạng), KHÔNG live-ref.
- **KHÔNG feed mastery** (cố ý). Đ/C/S chỉ tính điểm + biểu đồ.
- Off-ERP (scan/gửi Zalo) bắt evidence + mốc đóng/upload server-side.
- Seam: UI KHÔNG gọi supabase trực tiếp — qua lib data-layer. RLS: data DISABLE / staffs ENABLE. Mã đề-xuất-sửa-được (max+1).

**VÒNG LÀM** (sau khi PLAN duyệt; từng story một): implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → story tiếp.

**DỪNG & HỎI khi:** đụng 1 trong 7 câu §F chưa chốt · cần drop/migration phá dữ liệu (giải thích trước, chờ gật) · đụng print/điểm-danh/kho thật gây rủi ro. Chưa chắc thì hỏi.

**XONG khi:** 4 story đạt Done-when + `tsc` sạch + luồng thật end-to-end (thí sinh L5 → điểm danh+scan → chấm Đ/C/S ra điểm → nhận xét+lớp đề xuất → phiếu → trả bài, và set L5→L6). Báo Thùy khi xong hoặc kẹt.
