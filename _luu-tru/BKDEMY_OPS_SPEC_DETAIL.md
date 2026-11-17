# Hệ Vận hành Ops — Spec CHI TIẾT (thay thế bản tổng quan)

Bản này bóc từng story thành **luồng + màn hình + done-when + ngoại lệ + chạm-dữ-liệu (mô tả nghiệp vụ, KHÔNG phải tên cột)**. Thay thế `BKDEMY_OPS_SPEC.md` (bản tổng quan) — giữ bản kia làm ngữ cảnh kiến trúc.

> **ĐỌC TRƯỚC:** `HANDOFF.md` + `CLAUDE.md`. Verify schema thật trước khi code (đừng tin tên cột trong spec — mô tả nghiệp vụ, Claude Code tự map). Reuse: TKB, điểm danh, ETPrintView, mastery, engine hiệu suất (`BKDEMY_GIAOVIEC_HIEUSUAT_SPEC`), storage. RLS: data DISABLE / staffs ENABLE. "vị trí" không "ghế".

---

## A. Nguyên tắc chung (áp cho cả 4 story)

1. **Off-ERP → evidence + duyệt.** Hệ không thấy việc làm ngoài ERP (gửi Zalo, dọn phòng, scan giấy) → phải có evidence, leader/GV duyệt. Evidence còn để **rèn thói quen "làm xong để lại dấu"** — bắt cả việc dễ nhất.
2. **Tiến độ đo tại MỐC HỆ THẤY ĐƯỢC** (lúc đóng task / lúc upload), KHÔNG phải lúc hành động ngoài ERP xảy ra. Công thức chung: **so mốc-chuẩn (từ TKB) ± biên**; trong biên = đúng hạn, sau = trễ. Mỗi story có biên riêng.
3. **Chất lượng = điểm nền − lỗi (KHÔNG nhân)** — theo engine hiệu suất. Việc nội dung-do-hệ-gen (report/tan) mặc định 100% auto-pass; việc có biến thiên thật (prep) mới chấm.
4. **Credit theo NGƯỜI THỰC LÀM** (khớp bảng phân công §B). Người chịu mỗi task lấy từ phân công Ops.

---

## B. Bảng phân công (SPINE — dựng trước, mọi task treo vào)

- **Mẫu gốc** (`phân công gốc`) = pattern trực Ops mặc định, **sống, đổi hiếm**. Đơn vị = **ca/slot** (ngày×giờ×phòng/lớp) → 1 Ops chịu, gánh cả checklist việc của ca.
- **Kế hoạch tuần** = **sinh từ gốc + điều chỉnh riêng tuần → ĐÓNG BĂNG** thành bản ghi tuần. Thay đổi **vĩnh viễn → sửa gốc**; **một lần → exception tuần**. KHÔNG clone-nguyên-rồi-sửa (gốc mục).
- **Swap giữa tuần** → bản ghi tuần cập nhật **người thực làm**; credit/đánh giá theo người thực làm.
- **Ca trống** (không ai phụ trách) → **cờ đỏ**.
- **Nguồn nội dung vs người chịu:** report/báo-tan lấy **nội dung/mốc từ TKB** (lịch học ổn định), lấy **người-chịu từ phân công Ops**. Prep/scan theo lịch phòng/ca + phân công.
- **A nghỉ nhờ B (share tài khoản):** trách nhiệm/đánh giá quy về **A** (A tự chịu bảo mật tài khoản). **v1 KHÔNG làm cơ chế "làm hộ"** — nợ kỹ thuật CÓ CHỦ ĐÍCH (chỉ cần khi share thành thường xuyên).

---

## STORY 1 — Report trước buổi

**Actor:** Ops trực · **Duyệt:** Leader
**Tiền đề:** buổi có trong TKB; nhóm Zalo lớp tồn tại.

**Luồng chính:**
1. Ops mở "Việc của tôi" → thấy **task report** (mỗi **ca = 1 task**, 10-15 task/ngày).
2. Click task → thấy **ô message** (render ĐỘNG lúc click, đọc TKB hiện tại — không phải văn bản lưu chết). VD: *"Ngày mai Thứ 2, 06/07 các con có lịch học 9h–11h, bố mẹ nhắc con đi học đúng giờ, mang đủ đồ dùng."*
3. Ops **copy** → dán vào nhóm Zalo lớp.
4. Ops **chụp ảnh tin đã gửi → upload evidence** vào task.
5. **Chỉ khi có evidence** → nút "Đóng task" mới bật. Ops đóng → card xuống "Đã hoàn thành".
6. Task chuyển leader. **Hệ đề xuất tiến độ; chất lượng auto-pass 100%.**

**Done-when:** task đóng + có evidence.
**Tiến độ:** đo tại **mốc ĐÓNG task**; deadline = trước giờ học (biên chỉnh được, vd trước 20h hôm trước). Đóng trong hạn = đúng; sau = trễ.
**Chất lượng:** mặc định **100%** (nội dung hệ gen). **Auto-pass.** Leader chỉ nhảy vào khi **gửi sai nhóm** → trừ theo hậu quả.

**Ngoại lệ:**
- Lịch đổi *sau khi* report đã gửi → cờ **"cần nhắn bù"** trên ca đó.
- Ops nghỉ đột xuất → **A chịu** (nhờ B, share tài khoản = việc của A).

**Màn hình cần:** Việc-của-tôi (list card) · Task detail (ô copy message + upload evidence + nút đóng, chặn đóng khi chưa evidence) · Leader duyệt (list, auto-pass, mở ngoại lệ).
**Chạm dữ liệu (nghiệp vụ):** đọc TKB (ca/giờ/lớp) render message; ghi evidence + mốc đóng + trạng thái; người chịu = từ phân công Ops.

---

## STORY 2 — Báo tan cuối buổi

**Actor:** Ops trực · **Duyệt:** Leader
**Tiền đề:** ca có trong TKB (có **giờ tan gốc**).

**Luồng chính:**
1. Ops mở **task báo-tan** (theo ca).
2. Nhắn *"Lớp đã tan ạ"* vào Zalo (**Ops tự soạn, KHÔNG cần gen** — tin cố định).
3. **Upload ảnh evidence** (rèn thói quen, kể cả việc dễ).
4. Đóng task.

**Done-when:** đóng + evidence.
**Tiến độ:** đóng trong **giờ tan gốc (TKB) + 15'** = đúng hạn; sau = trễ. (Dùng chung khuôn "mốc TKB ± biên" với Story 1, khác tham số biên.)
**Chất lượng:** auto-pass; leader review ngoại lệ.

**Ngoại lệ:** lớp tan sớm/muộn bất thường → **leader duyệt ngoại lệ** (Ops ghi lý do). Không nhắn từng HS (bé xé to) — 1 tin, PH tự đón.

**Màn hình cần:** như Story 1 trừ ô copy message.
**Chạm dữ liệu:** đọc giờ tan gốc TKB; ghi evidence + mốc đóng.

---

## STORY 3 — Chuẩn bị buổi (Prep)

**Actor:** Ops (dọn) · **Đóng góp đánh giá:** GV dùng phòng · **Duyệt cuối:** Leader
**Tiền đề:** phòng có lượt học. **Đơn vị = "lượt prep"** = phòng × lượt-mở-cần-chuẩn-bị (tối thường **1 lượt**; **T7/CN 2 lượt: sáng + chiều**). Ca liền sau trong cùng lượt (không timeout) **KHÔNG prep riêng** — bút chuẩn bị đủ cho 2 ca, xoá bảng GV/TA tự xử.

**Luồng chính:**
1. Task prep hiện (có thể **mở sẵn từ hôm trước** nếu sáng hôm sau có ca).
2. Ops dọn: **vệ sinh** (lau bảng, kê bàn ghế) + **chuẩn bị KIT** (bút, khăn).
3. Ops **tích checklist**: ☑ Đã dọn phòng · ☑ Đã chuẩn bị KIT. *(Checklist = evidence có cấu trúc "đã làm", KHÔNG phải điểm chất lượng.)*
4. **Chụp ảnh TẠI THỜI ĐIỂM ĐÓNG** (không dùng ảnh cũ) → upload.
5. Đóng task — **chỉ được đóng trong CỬA thời gian** (dưới).
6. **GV dùng phòng đóng góp đánh giá chất lượng** (biết rõ nhất) → **Leader duyệt cuối** (giữ luồng; nếu GV bận quên, leader vẫn chốt được).

**Done-when:** đóng trong cửa + checklist đủ + ảnh chụp-tại-thời-điểm-đóng.
**Cửa đóng task = [giờ học − 60', giờ học − 30']** cho ca đầu của lượt (ca thường 18h → cửa **17h00–17h30**). **Đóng sớm hơn cửa dưới = CHẶN** (prep xong quá sớm thì phòng bẩn lại, mất ý nghĩa). Sau cửa trên = **trễ**. **T7/CN biên 15'** trước ca đầu mỗi lượt. Dọn lúc nào cũng được, nhưng **đóng task + ảnh phải trong cửa**.
**Chất lượng:** GV đóng góp → **điểm nền − lỗi** (thiếu đồ −x, chưa vệ sinh −y) → leader chốt.

**Ngoại lệ:** prep xong bị làm bẩn lại bởi yếu tố ngoài (lớp khác tràn vào) → **xử tay**, nghiêm trọng **xem camera**. Evidence-có-mốc **bảo vệ Ops khỏi đổ oan** (chứng minh đã prep đúng lúc).

**Màn hình cần:** Task prep (checklist + upload + nút đóng có kiểm cửa thời gian) · GV đánh giá phòng (nhận xét + điểm) · Leader duyệt.
**Chạm dữ liệu:** đọc lịch phòng/lượt (xác định lượt prep + giờ ca đầu); ghi checklist + ảnh + mốc đóng; GV ghi nhận xét/điểm; leader chốt.

---

## STORY 4 — Scan ET (con to nhất)

**Actor:** Ops (scan+upload) · TA (chấm giấy TRƯỚC + duyệt SAU) · Leader (luồng)
**⚠ PREREQUISITE:** hạ tầng **lưu trữ file + trỏ tài liệu trong ERP** (Supabase storage + gắn file vào ET/buổi) — **CHƯA CÓ, phải làm trước/cùng**, không thì story này treo. Scan ET là khách hàng đầu tiên của nền này.
**Tiền đề cứng:**
- ET **in TỪ ERP** (có **QR** mã hoá buổi/HS/đề trên mỗi tờ) + **fiducial markers** góc tờ + lưới **Đ/C/S in sẵn, GV khoanh 1**. → ETPrintView phải bổ sung QR + markers + lưới khoanh + tự bẻ hàng (≤6 câu 1 hàng, >6 hai hàng).
- **TA chấm (khoanh Đ/C/S) XONG trên giấy → RỒI Ops mới scan.** Scan phải là bản đã có khoanh. **TA KHÔNG nhập liệu nữa — TA DUYỆT.**

**Luồng Ops (scan):**
1. TA chấm xong đưa Ops → Ops scan cả lớp thành **1 PDF**.
2. **Upload thẳng ERP** (bỏ folder Drive). **File hợp lệ = evidence** (không cần chụp ảnh riêng). Hệ **đóng dấu mốc upload** (server-side, tin được — KHÔNG dùng giờ trong file).

**Luồng hệ (tự động, chạy được trong đêm — gỡ nút "TA về muộn"):**
3. Tách PDF → từng trang → **đọc QR** mỗi trang → gán đúng HS/buổi.
4. Nắn trang theo **fiducial markers** (chống lệch/xoay/co).
5. **OMR**: với mỗi câu, đo **mật độ mực** 3 ô Đ/C/S → chọn ô đậm nhất.
6. **Confidence gate:** ô rõ (cách biệt lớn) → **auto-điền**. Ô lưỡng lự (sát điểm / cả 3 nhạt / khoanh 2 chỗ / dập xoá) → **AI vision đọc** (chỉ ô này, chi phí nhỏ). AI vẫn không chắc → **để trống + flag**.
7. Điền vào ET ở **trạng thái MỞ (chưa vào mastery)**.
8. **Kiểm đủ trang** theo sĩ số buổi → **báo thiếu HS nào** không có tờ scan.

**Luồng TA (duyệt, hôm sau):**
9. Mở ET → thấy **số hệ điền sẵn** → **DÒ bản gốc** đối chiếu (quy mô nhỏ, người tin được, cầm giấy gốc = trọng tài luôn).
10. Lệch → **sửa tại chỗ**. Hệ **âm thầm LOG mỗi lần sửa** (ô này hệ đọc X → người sửa Y).
11. TA **ĐÓNG ET** → **LÚC ĐÓNG mới feed mastery** (Đ/C/S → 1/0.5/0). Trước khi đóng, số auto chỉ là **nháp**, không chạm mastery/cảnh báo/bổ trợ.

**Done-when:** (Ops) file upload hợp lệ (QR đọc được, đủ trang). (TA) ET đóng.
**Tiến độ Ops-scan:** mốc = **giờ UPLOAD lên ERP** (KHÔNG phải giờ trong file); trong X giờ sau tan = đúng hạn.
**Chất lượng scan:** file đủ trang + QR đọc được. Thiếu bài → báo thiếu.

**Đo accuracy (để tiến tới bỏ người):**
- Công thức: **(số ô KHÔNG bị sửa) / (tổng ô hệ điền)** — theo **Ô**, không theo tờ.
- **ĐO TÁCH theo tầng confidence:** accuracy riêng cho **"ô hệ tự tin"** vs **"ô hệ flag"**. Số ra quyết định bỏ người = **số của tầng tự tin** (số tổng chỉ để nhìn).
- **v1 đo THÔ** (mọi lần sửa = hệ sai; chấp nhận hơi khắt khe/an toàn). Chấp nhận sai số (~98% ±1%).
- **Ngưỡng bật auto** cho tầng tự tin (vd ≥98% qua ≥N ô liên tục) = **tham số chỉnh được** → "bỏ người" là sự kiện có điều kiện rõ, không cảm tính.

**Kỷ luật đầu vào (diệt NGUỒN ô xấu — rẻ hơn cải tiến AI):**
- **Sửa SẠCH** (gạch chéo cả câu, khoanh lại ô mới rõ) = **không phạt** (GV vẫn được sửa khi chấm sai).
- **Dập xoá BẨN** (tẩy chồng, khoanh đè, để 2 ô cùng dấu) = **phạt** người chấm ET. → giảm ô lưỡng lự → accuracy tầng tự tin tự tăng → bỏ người nhanh hơn.

**Ngoại lệ:** QR 1 trang không đọc được → flag trang đó nhập tay; thiếu bài → báo thiếu HS.

**Màn hình cần:** Ops upload ET (kéo-thả PDF, hiện kết quả kiểm QR + đủ trang) · Trạng thái xử lý (đang đọc/đã đọc/cần duyệt) · **TA duyệt ET** (số điền sẵn + đánh dấu ô flag + sửa + nút Đóng ET) · Dashboard accuracy (theo tầng confidence).
**Chạm dữ liệu:** đọc QR→buổi/HS/đề; lưu file (storage ERP); ghi kết quả Đ/C/S per ô + nguồn đọc (OMR/AI/người) + log mỗi lần sửa; **feed mastery CHỈ khi đóng ET**; tính accuracy per tầng.

---

## C. Phạm vi v1 / OUT

**IN:** bảng phân công §B · 4 story trên · luồng evidence + duyệt · nối engine hiệu suất (điểm nền − lỗi) · ETPrintView + QR/markers/lưới-khoanh · pipeline đọc ET (OMR→AI→người) · hạ tầng storage/trỏ-tài-liệu ERP (prerequisite) · dashboard accuracy.
**OUT (pha sau):** auto-send Zalo (chờ app) · cơ chế "làm hộ" (share tài khoản) · lý-do-sửa để đo accuracy tinh · full bỏ người ET (sau khi ngưỡng đạt).

---

## Goal / Kickoff

> Kick 1 câu (auto mode): *"Đọc BKDEMY_OPS_SPEC_DETAIL.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build hệ Vận hành Ops theo spec chi tiết này, tới khi đạt HẾT "Done-when" của cả 4 story.

**ĐỌC TRƯỚC:** HANDOFF.md + CLAUDE.md + toàn bộ spec này.

**PHA 0 — KHẢO SÁT & PLAN (bắt buộc, TRƯỚC khi code):**
1. Grep repo: TKB, điểm danh, ETPrintView, mastery feed, storage/trỏ-file (có chưa?), engine hiệu suất, phân công.
2. Viết `PLAN.md`: schema đề xuất (cột THẬT sau khi verify) cho từng story, danh sách file sẽ tạo/sửa, luồng màn hình, **liệt kê chỗ spec chưa rõ → câu hỏi cho tao**.
3. **DỪNG, chờ tao duyệt PLAN.** Duyệt xong mới code.

**KỶ LUẬT:**
- Verify schema TRƯỚC migration (`information_schema.columns` + `pg_tables.rowsecurity`). Grep trước khi đổi.
- Reuse > đẻ mới. **Bảng phân công (§B) + hạ tầng storage (prereq Story 4) dựng trước.**
- Off-ERP task bắt evidence. Hiệu suất = điểm nền − lỗi (KHÔNG nhân). Tiến độ đo tại mốc đóng/upload.
- ET: QR danh tính (không đọc tên tay) · OMR trước → AI cho ô flag → người dò · feed mastery CHỈ khi TA đóng ET · log mọi lần sửa.
- RLS: data DISABLE / staffs ENABLE.

**VÒNG LÀM** (sau khi PLAN duyệt; từng story một): implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → story tiếp.

**DỪNG & HỎI khi:** fork spec không cover · cần xoá/drop/migration phá dữ liệu (giải thích trước, chờ tao gật) · đụng ETPrintView/mastery/điểm danh thật gây rủi ro. Chưa chắc thì hỏi.

**XONG khi:** 4 story đạt Done-when + `tsc` sạch + luồng thật end-to-end (phân công tuần → report → prep → báo tan → scan ET đọc 3 tầng → TA đóng ET → feed mastery). Báo tao khi xong hoặc kẹt.
