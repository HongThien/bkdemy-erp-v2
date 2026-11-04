# spec-bao-cao-ky — Báo cáo HỌC KÌ gửi phụ huynh

> Thùy chốt 04/11. **Khác hẳn report tháng** (`ReportPHScreen`): không bảng từng buổi, không ET/BTVN, không 7 chỉ số, không thang 5 kiến thức/thái độ.
> Dùng chung với report tháng chỉ: chọn Môn → Lớp → HS, ảnh gửi PH, chốt cả lớp.
> Phần A = LOGIC (đã chốt). Phần B = "bàn sau" (số/tên/catalog chưa chốt).

## A. LOGIC

### A1. Kì là một ĐỐI TƯỢNG
- Bảng `ky_hoc`: tên (vd "HK1 2026–27"), `tu_thang`, `den_thang` (text `YYYY-MM`). Khoảng tháng **không cố định**, người có quyền tự tạo/sửa.
- **Người tạo kì = Thùy** (CEO). Các quyền khác (nhập, công bố) còn ở mục B.
- Mã gốc = `id` uuid, cấp lúc INSERT, bất biến. Báo cáo bám `ky_hoc.id`, không bám tên/tháng.
- Đổi `tu_thang`/`den_thang` sau khi đã có báo cáo công bố ⇒ báo cáo cũ KHÔNG đổi (xem A7).
- Kì đầu tiên: **chưa có kì trước ⇒ không so sánh**.

### A2. Nội dung báo cáo (đúng 6 khối)
1. **Tỉ lệ hoàn thành chủ đề – chuyên đề** (A3).
2. **Thứ hạng tại trung tâm** qua từng lần thi + hạng cả kì (A4).
3. **Điểm năng lực = điểm dự đoán ± sai số** — giáo viên NHẬP TAY (A5).
4. **Nhận xét giáo viên** (văn bản).
5. **Chuyên cần**: số buổi nghỉ trong kì (A6).
6. **Đường xu hướng** theo tháng + **Phụ lục** bảng điểm chi tiết các lần thi.

**Nguồn số liệu thi CHỈ gồm: MT (`ky_thi.loai='mt_sat_hach'`) và Khảo sát (`'khao_sat_thang'`)** — bảng `ky_thi` + `diem_thi`. Không đụng ET/BTVN.

### A3. Tỉ lệ hoàn thành chủ đề – chuyên đề
- Đơn vị: mỗi **chủ đề** lấy **20** lần đánh giá gần nhất; mỗi **chuyên đề** lấy **10** lần gần nhất.
- Chỉ tính lần đánh giá trong **45 ngày gần nhất** (tính lùi từ ngày cuối kì). Chưa đủ số lần ⇒ lấy số lần có (8 lần thì đánh giá theo 8).
- Cửa sổ cắt theo TỪNG chủ đề/chuyên đề, không cắt chung cả môn.
- **Hiển thị: HIỆN HẾT** mọi chủ đề và chuyên đề (Thùy chốt 04/11) — **Thùy xác nhận lại 04/11 sau khi biết số đúng (K9 ≈ 38 thanh)** ⇒ PDF không cố 2 trang: phần Hoàn thành được phép dài nhiều trang, phụ lục sang trang riêng. Số đo 04/11 (T7–T10, bản đồ mới, mọi khối đã nối): số chủ đề / chuyên đề CÓ LƯỢT ĐO theo lớp: cấp 1 1–6 / 3–17 · K6 5–6 / 12–16 · K7 7 / 20–21 (7S1: 2 / 9) · K8 6 / 21–23 · K9 10–11 / 23–27 · K10 4 / 7 · K11 2 / 7 · K12 3–4 / 7–8 · KHTN K7 7 / 21, K8 6 / 23, K9 11 / 27. ⇒ K9 ≈ 38 thanh/báo cáo (cả kì còn nhiều hơn). Lượt đo = câu được chấm, chưa tách theo buổi.
- Thiếu data = ít lần đo ⇒ **độ tin thấp**, KHÁC yếu (CLAUDE.md §5). Đơn vị 0 lần đo hiển thị "chưa đo", không phải 0%.
- Tính ở Postgres (`fn_bc_ky_*`), tái dùng engine mastery hiện có; nguồn công thức duy nhất = hàm DB (CLAUDE.md §2.0).

### A4. Thứ hạng
- Hạng từng lần thi: lấy theo hạng của lần thi đó (khối / trung tâm như `fn_rank_diem_mt`, `fn_bxh_diem_ks_khoi`).
- **Hạng cả kì** = xếp theo **điểm trung bình các lần thi MÀ EM ĐÃ THI**. **Không thi ⇒ không tính** (KHÔNG cộng 0 điểm — khác luật MT hạng tháng).
- Số lần thi quá ít ⇒ ghi kèm "dựa trên n lần thi".

### A5. Điểm năng lực
- `diem_du_doan` + `sai_so`: **GV nhập tay**. Lý do: mẫu 4–5 lần thi quá nhỏ, công thức suy ra không đúng.
- Ý nghĩa hiển thị cho PH: điểm cao = học tốt; sai số nhỏ = cẩn thận, sai số lớn = ẩu.
- Cột đã có ở `bao_cao_ph` (`nl_diem`, `nl_sai_so`) nhưng bảng tháng — bảng kì có cột riêng, không dùng chung.

### A6. Chuyên cần
- Hiện **số buổi nghỉ** trong kì (vắng + vắng phép) để PH thấy. Tính ở DB.

### A6b. Đường xu hướng (Thùy chốt 04/11)
- Vẽ **2 đường trên cùng trục**: điểm của em theo từng lần thi **và** điểm TRUNG BÌNH của chính lần thi đó (mọi em đã thi đề đó).
- Lý do: đề mỗi lần khó/dễ khác nhau — điểm em tụt mà trung bình cũng tụt thì là đề khó, không phải em yếu đi. PH phải đọc được khoảng cách em so với mặt bằng, không chỉ độ cao tuyệt đối.
- Trung bình mỗi lần thi tính **chỉ trên em đã thi** (không thi thì không vào mẫu, cùng luật A4). Ghi kèm sĩ số mẫu n.
- Tính ở Postgres cùng hàm với phần hạng; snapshot lúc công bố (A7).
- Phụ lục thêm cột "TB lần thi" cạnh điểm của em.

### A7. Lưu & đóng băng
- Bảng `bao_cao_ph_ky`, khóa (`hoc_sinh_id`, `mon`, `ky_id`). Lưu phần GV nhập: điểm dự đoán, sai số, nhận xét.
- **Bấm Công bố = chụp snapshot jsonb** toàn bộ số liệu (hoàn thành, hạng, chuyên cần, xu hướng, phụ lục) + ảnh. Mở lại báo cáo đã công bố đọc snapshot, **không tính lại** (khác report tháng, số có thể đổi sau khi đã gửi PH).
- Chưa công bố ⇒ xem trước bằng số tính động.
- Chốt cả lớp: công bố hàng loạt = chụp snapshot từng HS ở DB (HS chưa nhập nhận xét/điểm năng lực tự bỏ qua). Không còn bước chụp ảnh trong trình duyệt như `bulkCongBoLop` của report tháng ⇒ nên làm bằng 1 RPC transactional ở DB.

### A8. Hai đầu ra (Thùy chốt 04/11)
- **Trong app PH:** trang HTML **kéo dọc**, dựng từ snapshot jsonb (A7) — biểu đồ SVG, chữ co theo màn hình. App PH (`bkdemy-ph-app`, `lib/parent-data.ts`) đã đọc `bao_cao_ph` trực tiếp từ Supabase nên đọc được snapshot; cần thêm màn + quyền đọc bảng kì.
- **Gửi PH (Zalo):** **1 file PDF** (Thùy 04/11: PH bấm tải 1 lần, ảnh thì 2 lần). A4 dọc, nhiều trang (số trang theo số chủ đề/chuyên đề): (1) tóm tắt — điểm năng lực · hoàn thành · xu hướng · hạng · chuyên cần · nhận xét; (2) phụ lục bảng điểm. Chữ đủ lớn đọc trên điện thoại (dàn như thẻ mockup, không thu nhỏ bảng).
- **⭐ ERP KHÔNG tạo PDF** (Thùy 04/11: tải PDF trên ERP mất công). **ERP chỉ NHẬP + TÍNH + CHỤP SNAPSHOT**; PDF do **Claude dựng ngoài ERP** từ snapshot jsonb (đọc từ DB). Hệ quả thiết kế: snapshot phải **tự đủ** — chứa mọi số, nhãn, tên HS/lớp/kì/GV, nhận xét — để dựng PDF không phải query thêm. Không cần `jspdf`/`html2canvas`/upload PDF, không cột `pdf_url` bắt buộc.
- Cả hai cùng dựng từ MỘT snapshot ⇒ không lệch số giữa app và ảnh.

## B. BÀN SAU (chưa chốt — đừng tự quyết trong code)
- Tên cột/hàm/bảng cụ thể, quyền (ai tạo kì, ai nhập, ai công bố), vị trí leaf trong menu.
- Thang màu/bố cục thẻ ảnh, kiểu đường xu hướng (trục theo lần thi hay theo tháng).
- ~~Phạm vi "trung bình lần thi"~~ — **CHỐT 04/11: tính theo KHỐI** (cùng kỳ thi, cùng môn, cùng khối).
- Quy tắc "45 ngày" khi kì kết thúc nhưng báo cáo công bố muộn (đang hiểu: lùi từ `den_thang` cuối kì).
- Phân biệt MT vs Khảo sát trong phụ lục (gộp 1 bảng hay 2 bảng).
- Có cần hạng theo hệ (bac) như report tháng không.

## C. HIỆN TRẠNG BUILD (04/11, đợt P1 — mig `202611041652` + `202611041657` ĐÃ ÁP)
- **DB:** `ky_hoc` (tạo/sửa = admin hệ thống qua RLS) · `bao_cao_ph_ky` (PK hs × môn × kì; điểm dự đoán · sai số · nhận xét · snapshot · cong_bo_at) · `bao_cao_ph_ky_log` (trigger, §4) · trigger chặn sửa khi đã công bố. Hàm: `fn_bc_ky_tinh` (jsonb tự đủ = khuôn snapshot) · `fn_bc_ky_xem` (đã công bố ⇒ snapshot) · `fn_bc_ky_cong_bo` / `fn_bc_ky_mo_lai` / `fn_bc_ky_cong_bo_lop` (chỉ em nhập đủ 3 ô).
- **ERP:** màn Report phụ huynh có công tắc **Tháng | Học kì** (`src/screens/report/BaoCaoKy.tsx`, `src/lib/baoCaoKy.ts`): chọn kì / ＋ Kì · cột trái chấm xanh = đã công bố, vàng = đang nhập · bản xem trước theo mockup · ô nhập tự lưu · Chốt & công bố / Mở lại · Công bố cả lớp.
- **Quyết định kỹ thuật tự chốt — Thùy soát (thuộc mục B):** (1) Hoàn thành tái dùng nguồn câu Dashboard học tập `_dbht_cau` (mọi kênh ET · MT · BTVN · bài app, mỗi câu nặng như nhau), đã thêm nhánh KHTN; đơn vị liệt kê = chủ đề/chuyên đề em có câu trong kì; "độ tin còn thấp" khi < ½ số lần (dưới 10 / dưới 5). (2) Lần thi = (MT | KS, tháng thi, khối, môn) gom ky_thi các lớp; MT thi ngày 1–10 tính tháng trước. (3) Hạng + TB từng lần trong các em đã thi cùng khối; hạng kì theo TB các lần em đã thi. (4) Chuyên cần = buổi thường không huỷ. (5) Nhập + công bố = mọi nhân sự (như report tháng).
- **App PH (04/11, repo `bkdemy-ph-app` 77c725e, mig PH 0037 + ERP 202611041707 ĐÃ ÁP):** FDW đọc `bao_cao_ph_ky` CHỈ dòng đã công bố · ô "Báo cáo học kì" trong Kết quả học tập → danh sách kì → trang kéo dọc dựng từ snapshot.
- **Chưa làm:** dựng PDF từ snapshot · Hình–Học chưa gắn chủ đề hiện chung một dòng "Hình".
- **Thùy chốt 04/11 (sau khi xem bản dev 5 phần):** bố cục 5 PHẦN (đánh giá chủ đề→chuyên đề · kết quả thi + đồ thị 2 đường · thái độ học tập · nhận xét + kế hoạch cải thiện + điểm năng lực · phụ lục điểm thi toàn khối) — mig `202611041727`. **Hạng cả kì = xếp theo HẠNG TRUNG BÌNH các lần đã thi, GIỮ** (đã biết hệ quả: em bỏ 1 lần thi khó không bị phạt).
- **Thùy chốt 04/11: 1 CỘT cho mọi đầu ra** (app PH lẫn PDF) — "đa số PH dùng điện thoại". Khung rộng tối đa ~480px; đồ thị vẽ theo khung điện thoại (chữ không bị thu nhỏ); chuyên đề: tên + số lần đánh giá (chữ nhỏ dưới tên) · thanh ngắn · % cùng dòng; phụ lục cuộn ngang/dọc. (Sửa lại chỗ A8 cũ "A4 2 cột".)
- **Thùy chốt 04/11:** Phần 1 trên app CHỈ hiện card CHỦ ĐỀ (tên · % · thanh · số lần đánh giá); nút **"Xem chi tiết (n)"** mới mở danh sách chuyên đề.
- **Thùy 04/11:** nhãn lần thi bỏ chữ "MT" (PH không hiểu) ⇒ MT = "T8"; khảo sát = "Khảo sát 1, 2…" theo thứ tự trong kì (Thùy 04/11, mig `202611041809`). BTVN thêm **"Lần nộp BTVN đạt chuẩn" x/tổng** — đạt chuẩn = nộp đúng hạn VÀ thái độ không bị ghi chưa nghiêm túc / chống đối (tự chốt định nghĩa, Thùy soát). Mig `202611041806`.
- **Thùy 04/11 (xem PDF mẫu):** khảo sát viết tắt **"KS1, KS2…"** (thay "Khảo sát 1"); header tách dòng (môn·lớp / kì / giáo viên); bỏ chú thích "45 ngày" ở phần Đánh giá; chuyên đề **Đại số** có tag **Cơ bản / Nâng cao** (viên bo tròn màu, chữ trắng, dưới tên, ngang dòng số lần đánh giá) — tag = phía ĐA SỐ độ khó các dạng bài của chuyên đề (≤3 / ≥4), hoà ⇒ nâng cao, không dạng nào có độ khó ⇒ không tag (tự chốt luật, Thùy soát). Mig `202611041845`.
- **⭐ LUẬT ĐÁNH GIÁ MỚI (Thùy chốt 04/11, THAY A3 "20/10 câu, 45 ngày"):** đếm theo **LẦN đánh giá** (1 buổi ET/BTVN/MT hay 1 bài app = 1 lần; điểm lần = TB các câu của đơn vị trong lần) · **chủ đề 10 lần** gần nhất, trọng số **6-6-4-4-4-4-3-3-3-3** · **chuyên đề 5 lần**, trọng số **6-4-4-3-3** (lần gần nhất nặng nhất) · cửa sổ **60 ngày** cuối kì. Cơ sở (đo dự báo K9 Toán, 74 em ~30k câu, tính đến 15/10 so với kết quả thật sau đó): lệch TB chuyên đề 21,4 (theo câu) → 20,8; chủ đề 18,3 → 17,6; Fibonacci 8-5-3-2-1 kém hơn (21,3 / 18,2). Thêm **hạng trong khối** mỗi chủ đề / chuyên đề (trong các em cùng khối × môn có lần đánh giá ở đơn vị đó) — viên "Hạng x/y" cạnh tag. Mig `202611041900`.
- **Thùy 04/11:** BTVN hiện theo **nhóm KHÔNG TRÙNG**, cộng các ô = tổng buổi: Đạt chuẩn (đúng hạn, nghiêm túc) · Đúng hạn nhưng chưa nghiêm túc · Nộp muộn · Không làm · (Xin phép / Chưa ghi trạng thái — chỉ hiện khi có). "Không nghiêm túc" chuyển thành dòng ghi chú "Trong đó n lần bị ghi chưa nghiêm túc". Mig `202611041924`.
- **PDF (Thùy 04/11):** khổ hẹp cỡ điện thoại (125 × 220 mm), 1 cột; **mỗi phần 2–5 bắt đầu trang mới** (phần 1 nằm dưới header); chuyên đề mở sẵn (PDF không bấm được); phụ lục in đủ dòng, không cuộn; giữ trọn mỗi card/dòng bảng trong 1 trang. Bản mẫu đang dựng bằng script ngoài repo (HTML → Edge headless) — khi làm công cụ PDF thật thì áp đúng các luật này.
