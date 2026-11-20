# spec-tai-chinh.md — SỐ LIỆU TÀI CHÍNH: cơ cấu doanh thu – chi phí, thông số, số hệ đang ra (spec #19 của bộ 20 spec)

> **Trạng thái: ĐI LẠI TỪ ĐẦU (Thùy 20/11) — thứ tự mới: PHẦN I cơ cấu chi phí (mỗi khoản chiếm bao nhiêu phần doanh thu, đích lợi nhuận 25) TRƯỚC; chốt xong Phần I mới sắp lại thu chi theo đúng các dòng đó. Phần II bên dưới là bản nháp 19/11, giữ làm số đo, CHƯA sắp lại.** *(Dòng cũ:)* **NHÁP 19/11/2026 — chờ Thùy trả lời §10 (10 câu).** Chưa có gì trong file này là quyết định mới; mọi số "ĐÍCH" lấy nguyên từ nguồn, mọi số "HIỆN TẠI" là số đo.
> Đây là spec về **tiền của trung tâm**: chỗ nào nguồn mâu thuẫn / nguồn ≠ DB / số không có ngày chốt ⇒ **không tự chọn**, ghi §9 và §10. Việc code / DB chỉ làm khi Thùy ra lệnh (§9.3).
> **Gộp từ:** `SPEC-tai-chinh-luong-gv-ta.md` — đọc từ nhánh CHƯA MERGE `origin/docs/tai-chinh-luong-gv-ta` (bản 03/09, 253 dòng; không checkout, không merge): lấy **§1, §2, §3.4, §5, §6, §7 mục 1 và 9–12**, ghi nhãn **[nhánh 03/09]** ·
> `PLAN-thu-chi.md` (phần **số liệu / báo cáo**: kỳ chốt, bản chụp theo danh mục, quỹ, công nợ với Ngân — phần quy trình đã ở `spec-van-hanh-trung-tam.md` §6) ·
> HANDOFF dòng "thang GV 2026 ↔ doanh thu" · `spec-kien-truc.md` §0b, §14 · code `src/lib/hocphi.ts`, `src/lib/thuchi.ts`, `src/lib/tacong.ts`, `src/screens/hocphi/*`, `src/screens/thuchi/*`, `src/screens/chi/*`, `src/screens/tacong/LuongTaScreen.tsx`.
> **Đối chiếu DB 19/11 17:53** (chỉ đọc, `begin read only … rollback`, role `claude_build`): `pg_proc`, `pg_policies`, đếm và cộng tổng. **Chỉ số tổng — không tên người, không số tiền của từng người / từng phụ huynh.**
> Khi chốt: `PLAN-thu-chi.md` → `_luu-tru/`; nhánh `origin/docs/tai-chinh-luong-gv-ta` giữ nguyên (xoá chỉ khi Thùy gật).
>
> **Ranh giới (chỉ trỏ, không chép):** quy trình thu học phí, công thức phiếu, ba bước thông báo ⇒ `spec-van-hanh-trung-tam.md` §5 · quy trình hoàn ứng, chốt kỳ chi, quỹ Lộc – Ngân ⇒ `spec-van-hanh-trung-tam.md` §6 ·
> công thức lương TA, lương GV, gậy, sổ phạt, chốt kỳ lương ⇒ `spec-luong-gay.md` · học phí phụ huynh thấy gì trên app ⇒ `spec-app-ph.md` · ai có ghế nào ⇒ `spec-quan-ly-chat-luong.md`.
> **Quyết định 17–18/11 ở `spec-luong-gay.md` §9.0 THẮNG bản [nhánh 03/09]:** giáo viên có khung lương cứng (riêng 3 giáo viên tiểu học theo buổi, thang 09/10) · lương TA theo công thức 12/10 (mức lớp × 40 / 20 / 40) · gậy không trừ vào lương (sổ phạt riêng, 20.000đ / gậy) · giáo viên full-time / trưởng khối không có tiền bổ trợ.
> ⇒ Mọi bảng chi phí GV / TA trong bản 03/09 dựng trên **cơ chế lương đã bỏ** — spec này giữ làm lịch sử và đánh dấu "PHẢI TÍNH LẠI", **không tự đặt số mới**.

---

# PHẦN I — CƠ CẤU CHI PHÍ (tầng 1 — ĐỀ XUẤT 20/11, chờ Thùy sửa từng dòng)

> Thùy 20/11: *"Cơ cấu chi phí — bản chất là mỗi khoản chi chiếm bao nhiêu phần doanh thu. BK cần xây mô hình sao cho đạt 25 lợi nhuận. Phải có đủ hết các loại chi phí. Xong tầng này mới break xuống tầng dưới."*
> Cách đọc: doanh thu = học phí phát sinh của tháng (sau giảm phí) = 100. Mọi số trong bảng là **phần trăm của doanh thu**. Cột ĐÍCH là đề xuất của Claude — **chưa có dòng nào là quyết định**.
> Cột "BK tháng 10" = số đo 19/11 trên doanh thu phát sinh 514,4 triệu (chi tiết ở Phần II §3, §4). Cột "Ngành" lấy từ bảng tham chiếu Phần II §2 (Mathnasium, Kumon, trung tâm Anh ngữ VN, luyện thi Hà Nội).

## I.1 Bảng cơ cấu — 7 nhóm, 17 dòng, cộng 75 ⇒ lợi nhuận 25

| Nhóm | Khoản chi | ĐÍCH đề xuất | BK tháng 10 (đo) | Ngành | Ghi chú |
|---|---|---|---|---|---|
| **A. Người dạy — 33** | Giáo viên | 24 | **không có số** (lương ngoài hệ) | 20–22 mô hình giáo trình có sẵn · 40–60 mô hình "thầy là sản phẩm" | Dòng lớn nhất, quyết định cả mô hình |
| | Trợ giảng (lớp + BTVN + bổ trợ + việc ngoài gói) | 9 | 6,6 tạm tính · 11,7 nếu mọi lớp đủ công | 5–10 | BK dùng TA nhiều hơn ngành (bổ trợ là gói dịch vụ lõi) |
| **B. Học sinh — 5,5** | Quà, xu, giải thưởng, sự kiện cho học sinh | 4 | 3,2 | — | Bản tháng 9 đặt 5,5 |
| | Giáo trình, đề, in ấn | 1,5 | 1,2 | — | Phụ huynh đang đóng học liệu riêng 2,3 doanh thu |
| **C. Cơ sở — 14,5** | Vận hành: OPS, chăm sóc phụ huynh, hành chính, thu ngân | 5 | **không có số** | gộp 14 (TA + vận hành) | |
| | Nhà + điện nước | 6,5 | ~7,8 (theo mức 40 triệu, chưa đo) | 8–15 | Khoản cố định: doanh thu 615 triệu ⇒ 6,5 · 960 triệu ⇒ 4,2 |
| | Cơ sở vật chất: mua sắm, sửa chữa, cải tạo | 2 | 3,3 (tháng 9: 1,7) | — | |
| | Vệ sinh, tiêu hao, nước uống | 1 | ~0,7 (ước, chưa tách tháng) | — | |
| **D. Quản lý + sản phẩm — 10,5** | Core team: giám đốc, học thuật, trưởng khối, người làm sản phẩm | 9 | **không có số** | 7–12 (phí nhượng quyền / HQ) | Khi có cơ sở 2, đây là "phí HQ" |
| | Phần mềm, tài khoản AI, ERP | 1,5 | 1,4 | — | |
| **E. Phúc lợi nhân sự — 4** | Công đoàn, gắn kết (liên hoan, du lịch, hiếu hỉ) | 1,5 | 0,7 (tháng 9: 5,7) | — | Dòng mới — bản tháng 9 không có |
| | Thưởng, lương tháng 13 | 1,5 | không có số | 0,6 | |
| | Tuyển dụng, đào tạo (gồm Hackathon) | 1 | chưa tách tháng | 0,5 | |
| **F. Tăng trưởng — 3** | Marketing, tri ân phụ huynh, quà giới thiệu | 3 | 0 (tháng 9: 1,1) | 5–10 | BK thấp vì tăng nhờ giới thiệu |
| **G. Tài chính — 4,5** | Nợ không thu được + hoàn phí | 1 | chưa đo được (dư nợ 89,6 triệu phần lớn còn trong hạn) | — | |
| | Kế toán, pháp lý, bảo hiểm cháy nổ | 0,5 | không có số | 0,8 | |
| | Dự phòng + tái đầu tư | 3 | không có số | — | |
| **Tổng chi** | | **75** | | | |
| **Lợi nhuận trước thuế** | | **25** | **không tính được** | 15–30 | Thuế chưa trừ — cần hỏi kế toán |

Giảm học phí (giới thiệu 0,6 + hệ số anh chị em / học 2 môn ước 3,2) **đã trừ trước khi ra doanh thu**, nên không là một dòng chi.

## I.2 Điều rút ra từ số của BK

1. **Ba dòng lớn nhất đều chưa có số trong hệ:** giáo viên (24) + vận hành (5) + core team (9) = 38 trên 75 phần chi. Chừng nào chưa có ba con số TỔNG này mỗi tháng thì chưa ai nói được BK đang lãi bao nhiêu. Phần đã đo được (TA, quà, in, nhà, cơ sở vật chất, tài khoản, công đoàn) cộng lại chỉ khoảng 24 doanh thu tháng 10.
2. **Chỗ BK đang rộng hơn đích:** nhà + điện nước (~7,8 so với 6,5) và cơ sở vật chất (3,3 so với 2). Cả hai tự hẹp lại khi doanh thu tăng mà không thuê thêm chỗ.
3. **Chỗ BK đang hẹp hơn đích:** quà học sinh (3,2 so với 4), marketing (0 so với 3). Đây là "lợi nhuận tạm" — nếu muốn tăng trưởng thì hai dòng này sẽ phải tiêu.
4. **Trợ giảng là dòng dễ vượt nhất:** tạm tính 6,6 nhưng đủ công đã là 11,7, cao hơn đích 9. Mỗi lớp thêm một em thì dòng này hẹp lại (lương TA theo lớp, không theo em).
5. **Sĩ số là đòn bẩy của cả bảng:** giáo viên, TA, nhà đều là chi theo LỚP; doanh thu theo EM. Lớp trung bình 8,35 em; lên 10 em thì cùng số lớp doanh thu tăng khoảng một phần năm, ba dòng đó (cộng khoảng 40) tự rút còn khoảng 33.
6. **Khoản thất thường phải tính theo năm, không theo tháng:** công đoàn tháng 9 là 5,7 nhưng tháng 10 là 0,7; cơ sở vật chất 1,7 rồi 3,3. So với đích phải lấy trung bình 12 tháng.

## I.3 Thùy cần quyết để chốt tầng này

1. **Sửa cột ĐÍCH.** Mười bảy con số trên là đề xuất. Dòng nào Thùy thấy sai thì sửa; tổng phải giữ 75.
2. **Ba con số tổng của tháng 10** (không cần từng người): tổng lương giáo viên · tổng lương vận hành (OPS, chăm sóc phụ huynh, hành chính) · tổng lương core team. Có ba số này là điền kín cột "BK tháng 10" và biết lợi nhuận thật.
3. **Lương của Thùy và người sáng lập tính vào đâu?** Đề xuất: tính vào dòng core team theo mức thuê người ngoài làm việc đó, để 25 là lợi nhuận thật của mô hình chứ không phải tiền công của chủ.
4. **25 là đích cho quy mô nào?** Đề xuất: cho quy mô 500–600 em ở cơ sở hiện tại (doanh thu khoảng 700–850 triệu một tháng); quy mô 800 em thì các khoản cố định hẹp lại và lên được khoảng 30.

**Sau khi chốt Phần I** mới làm tầng dưới: tách từng dòng thành các khoản con, gán mỗi danh mục BK Chi / mỗi loại lương / mỗi loại dòng hoá đơn vào đúng MỘT dòng, và dựng màn so đích – thực tế hằng tháng.

---

# PHẦN II — BẢN NHÁP 19/11 (số đo, benchmark, quyền — CHƯA sắp lại theo Phần I)

## 0. Đích · nguyên tắc

- Spec này phải trả lời được: **tháng X trung tâm thu bao nhiêu, chi bao nhiêu vào đâu, mỗi nhóm chi chiếm bao nhiêu phần doanh thu — và số đó đang cách ĐÍCH bao xa.**
- **Mỗi số có nhãn ĐÍCH hoặc HIỆN TẠI** (CLAUDE §0 R1). ĐÍCH = Thùy muốn tới (có ngày nói). HIỆN TẠI = đo từ DB, có ngày đo. Số giả định chưa ai xác nhận ghi **[giả định]**.
- **Đích lớn** [nhánh 03/09]: nhân sự thấy đủ để gắn bó; trung tâm hội tụ về **lợi nhuận 30 phần doanh thu** để mở chuỗi. Định nghĩa "30" chưa được Thùy xác nhận ⇒ §10 câu 2.
- **Mọi số tiền tổng hợp tính ở Postgres** (CLAUDE §2.0; đã có tiền lệ sai tiền thật vì client tính — `spec-kien-truc.md` §14). Số của cả trung tâm theo tháng **không cần realtime** ⇒ khi làm màn tài chính thì là **sổ tính sẵn**, màn chỉ đọc (`spec-kien-truc.md` §4, K2, K6).
- Tiền gắn với việc học mang nhãn **môn** (CLAUDE §1.6): doanh thu học phí tách được theo môn (§3.2). Chi phí chung (nhà, quản lý) không có nhãn môn.
- Nói với nhân sự bằng **số tiền tuyệt đối**, không bằng tỉ lệ lương / doanh thu (Thùy 18/09). Các tỉ lệ trong spec này là số của quản lý.

## 1. Thông số đầu vào

> Cột giữa là bản [nhánh 03/09] ("BK, 09/2026"). Cột phải đo 19/11. Chỗ hai cột lệch nhau nhiều ⇒ §10 câu 1.

| Thông số | [nhánh 03/09] | HIỆN TẠI (đo DB 19/11) |
|---|---|---|
| Học phí trung bình một em một tháng | 1.200.000đ | Kỳ 10: **1.411.000đ** học chính / em (496,5 triệu ÷ 352 em); gồm cả học liệu, đuổi, phát sinh: 1.461.000đ. Kỳ 9: 1.220.000đ · kỳ 8: 1.229.000đ |
| Số buổi một tháng | 8 (2 buổi / tuần × 2 giờ) **[giả định, chưa xác nhận]** | Tháng 10: trung bình **7,1 buổi thường / lớp** (trung vị 8; 16 lớp có ≤ 5 buổi, 34 lớp có 6–9 buổi; 50 lớp). Tháng 9: 6,2 (trung vị 7). Buổi dài trung bình **1,78 giờ** |
| Doanh thu một em một buổi | 150.000đ (= 1.200.000 ÷ 8) | Giá niêm yết bình quân theo lượt ghi danh **175.000đ**; sau hệ số giảm (bình quân 0,968) ≈ **169.000đ** |
| Bảng giá buổi đang dùng | — | 150.000đ: 27 lớp, 219 lượt ghi danh · 180.000đ: 11 lớp, 107 · 200.000đ: 6 lớp, 54 · 250.000đ: 6 lớp, 45 · 400.000đ: 1 lớp, 1 |
| Số học sinh | ~400; trần 800 cùng cơ sở (ĐÍCH) | **364 em đang học** (304 phụ huynh) · 27 bảo lưu. 311 em học 1 lớp · 44 em 2 lớp · 7 em 3 lớp · 2 em 4 lớp |
| Sĩ số trung bình | 9 → **12 cuối 2026** → 15 (ĐÍCH; "mở lớp trước, dồn em sau") | **8,35** (trung vị 8; nhỏ nhất 1, lớn nhất 17) trên 51 lớp đang học không kể 2 lớp 1-1 |
| Phân bố lớp theo sĩ số | — | 1–4 em: 6 lớp · 5–7: 15 · 8–10: 15 · 11–14: 13 · 15–19: 2 · từ 20: 0 |
| Số lớp | 44 (dùng ở bảng lãi lớp §5.3) | **53 lớp đang học**: Toán 41 + 2 lớp 1-1 · KHTN 6 · Tiếng Anh 3 · Văn 1 |
| Mô hình lớp | 1 giáo viên + 1 TA, kể cả lớp 20–25 em | 47 / 47 lớp có TA đều có mức lương TA (`spec-luong-gay.md` §1.2) |
| Nhà + điện nước | 39–40 triệu / tháng (nhà 35 triệu) | **không có trong hệ** (không đi qua BK Chi) |
| Quỹ vận hành (tài liệu, cơ sở vật chất, tài khoản AI) | 10–20 triệu / tháng | Sổ chi hoàn ứng: tháng 9 **65,4 triệu** · tháng 10 **70,0 triệu** (gồm cả quà, công đoàn, hackathon — §4.1) |
| Gamification (tiền thật mua quà) | 5–6 phần doanh thu | Sổ chi: tháng 9 11,3 triệu (2,6) · tháng 10 16,3 triệu (3,2) |
| Marketing | chưa có; giới thiệu 2–3 triệu / tháng; trần 5 | Sổ chi: tháng 9 4,8 triệu · tháng 10: 0. Giảm giới thiệu trên hoá đơn kỳ 10: 3,2 triệu |
| Bảo hiểm xã hội | không bàn | — |

- **Core team** (học thuật do Thùy dẫn, vận hành) là đội ươm mầm, có cơ chế riêng, **không nằm trong các bảng tỉ lệ** dưới đây. Khi ổn định: cơ sở chỉ còn giáo viên + TA + quản lý cơ sở; core team thành HQ [nhánh 03/09].
- Sĩ số ở trên = số em **đang học** còn tên trong lớp hôm đo (`hoc_sinh_lop.ngay_roi` trống). Khác với sĩ số tính lương TA (trung bình cả tháng theo ngày) và sĩ số lương giáo viên tiểu học (số em có tên ở từng buổi) — `spec-luong-gay.md` §1.2, §2.1.

## 2. Benchmark đã tham chiếu [nhánh 03/09] — số ngoài, không đo lại

| Mô hình | Giáo viên / doanh thu | TA + vận hành | Lợi nhuận | Ghi chú |
|---|---|---|---|---|
| Luyện thi "thầy là sản phẩm" (Hà Nội, trường công) | 40–60 (trường công chia 70–80) | 5–10 | 10–20 | |
| Mathnasium (FDD 2025, 914 cơ sở) | 20,6 | gộp 14,1 | 30,4 sau phí nhượng quyền 12 | chủ tự làm giám đốc, chưa tính lương |
| Kumon | chủ = người dạy; trợ lý chấm bài | | ~30 | |
| Trung tâm Anh ngữ Việt Nam | nhân sự 30–40 | | 15–30 | |
| Trung tâm kèm học ở Mỹ | lương 40–60; trên 70 là báo động | | 15–30 | |

BK nằm giữa Mathnasium và Kumon (giáo viên dạy theo giáo trình có sẵn, TA gánh chấm / bổ trợ / vận hành lớp, hệ thống gánh phần còn lại) ⇒ nhóm biên cao nhất ngành, nên đích 30 hợp lý về cấu trúc.

**Giá thị trường Hà Nội 2026** (tin tuyển dụng, gia sư — *thiên về đáy thị trường*): giáo viên Toán trung tâm lớp thường 300.000–350.000đ / buổi 2 giờ · luyện thi chuyển cấp / cấp 3: 350.000–500.000đ (cấp 3 tới ~530.000đ) · giáo viên full-time có soạn bài 10–17 triệu / tháng · gia sư giáo viên cấp 1 tại nhà 200.000–350.000đ / buổi · TA part-time chấm bài 3–5 triệu / tháng (~31.000–50.000đ / giờ).
Nguồn tham chiếu: danh sách cuối file nhánh (Mathnasium FDD, Kumon, Tutorbase, báo Thanh Niên 04/03/2026, Dân Trí 16/03/2026, Thông tư 29/2024, các trang tuyển dụng).

## 3. Doanh thu — số hệ đang ra (HIỆN TẠI)

### 3.1 Theo kỳ học phí (kỳ = tháng; hoá đơn chốt đầu tháng sau)

| Kỳ | Số hoá đơn | Phát sinh trong kỳ (không kể nợ mang sang) | — học chính | — học liệu | — học đuổi | — phát sinh tay | — giảm giới thiệu | Nợ kỳ trước gộp vào | Tổng hoá đơn | Đã thu trên hoá đơn kỳ đó |
|---|---|---|---|---|---|---|---|---|---|---|
| 07 | 238 | **433,1** | 417,4 | 8,5 | 11,0 | −2,3 | −1,5 | 7,8 | 440,9 | 413,9 |
| 08 | 263 | **398,0** | 383,5 | 10,2 | 7,7 | −0,7 | −2,8 | 27,1 | 425,0 | 384,0 |
| 09 | 286 | **428,7** | 407,3 | 11,3 | 12,3 | −1,1 | −1,0 | 41,1 | 469,8 | 463,5 |
| 10 | 298 | **514,4** | 496,5 | 11,9 | 10,3 | −1,0 | −3,2 | 11,1 | 525,6 | 431,2 |

*(triệu đồng; đo 19/11. Kỳ 11 chưa chốt — chỉ có phiếu ảo. Chưa có hoá đơn nào trước kỳ 07.)*

- **Tiền thực thu theo tháng thu** (theo ngày ghi thu, không theo kỳ): tháng 8 — 381,9 triệu (203 lần thu) · tháng 9 — 393,8 (245) · tháng 10 — 474,2 (290) · tháng 11 tới 19/11 — 442,5 (251).
- **Hai cách đọc "doanh thu" cho ra hai số khác nhau** (tháng 10: phát sinh 514,4 ↔ thực thu 474,2) ⇒ §10 câu 6.
- ⚠ **Không đọc "tỉ lệ đã thu của kỳ" bằng trạng thái hoá đơn.** Nợ kỳ trước được gộp thành một dòng của hoá đơn kỳ sau và thu ở đó, còn hoá đơn kỳ cũ **vẫn giữ trạng thái "chưa thu"** (kỳ 08 còn 25 hoá đơn "chưa thu" 41,1 triệu = đúng 41,1 triệu "nợ kỳ trước" trên hoá đơn kỳ 09). Cộng "chưa thu + thu một phần" của mọi kỳ ra ~173,7 triệu, trong khi **nợ thật = 89,6 triệu** (§3.3). Số nợ đúng duy nhất = `fn_hocphi_no_theo_ph`.

### 3.2 Học chính kỳ 10 theo môn (nhãn môn — CLAUDE §1.6)

| Môn | Số em | Học chính | Phần trong tổng |
|---|---|---|---|
| Toán | 339 | 428,8 triệu | 86,4 |
| KHTN | 53 | 43,1 triệu | 8,7 |
| Tiếng Anh | 18 | 19,2 triệu | 3,9 |
| Văn | 6 | 5,4 triệu | 1,1 |

Mỗi dòng học chính (em × lớp) kỳ 10: bình quân 7,14 buổi × đơn giá 174.500đ × hệ số 0,968 — 425 dòng, 1.168.000đ / dòng.

### 3.3 Giảm phí · nợ

| Khoản | HIỆN TẠI | ĐÍCH [nhánh 03/09 §6] |
|---|---|---|
| Giảm giới thiệu (trừ trên hoá đơn) | Kỳ 10: 3,2 triệu (8 hoá đơn) = 0,6 doanh thu. Tổng tín dụng đã cấp: 24 dòng, 8,95 triệu | "Giảm phí giới thiệu, học bổng" **1,5** |
| Giảm theo hệ số (học ≥ 2 môn, có anh chị em) | Hệ số bình quân 0,968 ⇒ **ước ~16,4 triệu / kỳ 10 (~3,2)** — số ước từ hệ số bình quân, hệ chưa có hàm ra số này | **không có dòng nào trong cơ cấu đích** ⇒ §10 câu 7 |
| Dư nợ học phí | **53 phụ huynh, 89,6 triệu** (nợ dương 94,1 triệu; có ~4,5 triệu thu dư) — phần lớn là kỳ 10 mới chốt 03–14/11. Nợ khởi tạo: 0đ | "Nợ học phí + hoàn phí" **1,0** — chưa định nghĩa đo ở mốc nào ⇒ §10 câu 8 |
| Thu vượt hoá đơn | Kỳ 09: 4 hoá đơn thu nhiều hơn tổng, cộng 4,8 triệu | — (§9.1 mục 6) |

## 4. Chi phí — số hệ đang ra (HIỆN TẠI)

### 4.1 Sổ chi hoàn ứng (`chi_so` — chỉ những khoản nhân sự ứng tiền túi rồi Lộc hoàn)

- Từ lúc chạy (02/09): **138 dòng sổ, 143,0 triệu** · 9 kỳ đã chốt (gần nhất 02/11) · 11 dòng 7,6 triệu chưa chốt · 26 lần nhận tiền từ Ngân, 135,5 triệu · định mức quỹ 10 triệu · khoản chi: đã thanh toán 138 · từ chối 23 · huỷ 5 · chờ duyệt 5.
- Theo tháng (ngày chi): tháng 9 — 65,4 triệu (68 dòng) · tháng 10 — 70,0 triệu (59) · tháng 11 tới 19/11 — 7,6 triệu (11).

| Danh mục (Lộc tự đặt) | Tháng 9 | Tháng 10 | Từ 01/09 tới 19/11 | Dòng ứng với cơ cấu đích §6 |
|---|---|---|---|---|
| Gamification | 11,3 | 16,3 | 31,6 | Gamification (đích 5,5) |
| Công đoàn | 24,5 | 3,5 | 28,0 | **không có dòng** ⇒ §10 câu 9 |
| Cơ sở vật chất – sửa chữa | 7,3 | 17,1 | 25,2 | Khấu hao, cải tạo (1,5) + bảo trì (0,5) |
| Mua tài khoản | 8,3 | 7,2 | 15,5 | Phần mềm, AI (1,5) |
| Hackathon cho SP | | | 14,2 | **không có dòng** ⇒ §10 câu 9 |
| In giáo trình | 5,1 | 6,3 | 13,1 | Tài liệu, đề, in ấn (1,5) |
| Chi phí vệ sinh | | | 5,2 | Bảo trì, vệ sinh (0,5) |
| Marketing | 4,8 | 0 | 4,8 | Marketing (4, trần 5) |
| Chi phí tiêu hao · nước uống · học liệu | | | 3,9 · 1,2 · 0,4 | (chưa xếp) |

*(triệu đồng. Ô trống = chưa tách theo tháng.)* Ngày 02/09 có 5 kỳ chốt liền nhau, trong đó một kỳ 1 khoản **22.222.222đ** — số tròn lạ, cần Lộc xác nhận là khoản thật (§10 câu 9).

### 4.2 Quỹ lương TA (công thức ⇒ `spec-luong-gay.md` §1)

- **Tháng 10 tạm tính: 33,8 triệu / 17 TA** (lớp 15,6 + bổ trợ 12,3 + ngoài gói 5,9) · tháng 11 tới 17/11: 23,6 triệu / 15 TA — *số đo 17/11 của `spec-luong-gay.md` §1.5; hôm nay không đo lại được (hàm có cổng quyền, §11).* **Chưa kỳ lương nào được chốt** (`ta_luong_ky` 0 dòng); `gay_chot_thang` 0 dòng.
- So doanh thu phát sinh kỳ 10: 33,8 ÷ 514,4 = **6,6**. Con số này **thấp hơn thật** vì giáo viên kiêm TA không có lương TA trên hệ và tháng 10 còn 181 buổi / ca thiếu công.
- **Quỹ lương TA nếu mọi lớp đủ công** (tổng mức lớp đang hiệu lực tháng 11, 52 lớp): 27 lớp × 1,0 + 14 × 1,2 + 7 × 1,4 + 4 × 1,6 = **60,0 triệu / tháng** (= 11,7 doanh thu kỳ 10). Không phải trần — bổ trợ vượt chỉ tiêu thì nhận hơn.

### 4.3 Khoản KHÔNG có trong hệ (hệ không ra được số)

Lương giáo viên (khung cứng ngoài hệ; 3 giáo viên tiểu học tính bằng bộ sinh PDF chép tay) · lương core team, OPS, trưởng khối · tiền nhà, điện nước · thuế, kế toán, pháp lý · tiền phạt gậy đã thu (sổ phạt chưa chốt tháng nào) · mọi khoản chi không qua BK Chi (trả thẳng nhà cung cấp, Ngân chi trực tiếp).
⇒ **Hôm nay ERP chưa dựng được bảng lãi – lỗ của trung tâm**; mới có doanh thu học phí đầy đủ và hai mảnh chi phí (§4.1, §4.2). ⇒ §10 câu 3, câu 4.

## 5. Bảng chi phí giáo viên + TA theo sĩ số

### 5.1 Bản [nhánh 03/09] — LỊCH SỬ, dựng trên cơ chế lương ĐÃ BỎ

Giả định của bảng: 150.000đ / em / buổi · giáo viên trả theo buổi theo băng sĩ số (300.000–750.000đ / buổi 2 giờ) · TA trả gói / buổi theo băng sĩ số (80.000–150.000đ), bổ trợ tính riêng 40.000đ / ca.

| Sĩ số | Doanh thu / buổi | Giáo viên | Phần | TA | Phần | Giáo viên + TA | Còn lại |
|---|---|---|---|---|---|---|---|
| 9 | 1.350.000 | 350.000 | 25,9 | 85.000 | 6,3 | 32,2 | 67,8 |
| 12 | 1.800.000 | 400.000 | 22,2 | 90.000 | 5,0 | 27,2 | 72,8 |
| 14 | 2.100.000 | 400.000 | 19,0 | 90.000 | 4,3 | 23,3 | 76,7 |
| 15 | 2.250.000 | 500.000 | 22,2 | 95.000 | 4,2 | 26,4 | 73,6 |
| 20 | 3.000.000 | 650.000 | 21,7 | 130.000 | 4,3 | 26,0 | 74,0 |
| 25 | 3.750.000 | 750.000 | 20,0 | 150.000 | 4,0 | 24,0 | 76,0 |

TA tổng cấp trung tâm (gói lớp + bổ trợ 20 phần trăm số em × 2 ca / tháng **[giả định]** + thưởng + 3 trưởng khối): sĩ số 9 (400 em) ~9,3 · sĩ số 12 ~7,9 · sĩ số 15–25 (800 em) ~6,4–6,7.
Kết luận của bản 03/09: **giáo viên + TA hội tụ 27–29, trần ngân sách 30**; tỉ lệ này nghịch với sĩ số (~32–35 ở sĩ số 9 — giai đoạn đầu tư). Mốc cảnh báo định đặt trong ERP: trên 30 ⇒ lớp đang mỏng; TA dưới ~6 ⇒ thiếu bổ trợ.

### 5.2 Vì sao PHẢI TÍNH LẠI — và thiếu số gì để tính

| Cột của bảng 5.1 | Cơ chế nay (`spec-luong-gay.md` §9.0) | Hệ quả | Thiếu gì |
|---|---|---|---|
| Giáo viên theo buổi × băng sĩ số | **Khung lương cứng** (Thùy 17/11); thang 03/09 đã bỏ | Chi phí giáo viên không còn chạy theo sĩ số từng lớp — là khoản cố định theo người ⇒ phần giáo viên / doanh thu **giảm khi lớp đầy lên nhanh hơn bảng cũ**, và **nặng hơn bảng cũ khi lớp mỏng** | Tổng quỹ lương giáo viên một tháng — **không có trong hệ** (§10 câu 3) |
| (riêng 3 giáo viên tiểu học) | Theo buổi, thang 09/10: 3–4 em 350.000 · 5–7: 450.000 · 8–10: 550.000 · 11–13: 650.000đ / buổi 1,5 giờ | HANDOFF ghi: thang này ở sĩ số 8–12 trả **32–40 doanh thu lớp** (đích dài hạn vẫn 20–22). Bảng tỉ lệ gốc (§3.1b) **không còn file** | Lớp từ 14 em chưa có mức |
| TA gói / buổi + bổ trợ riêng | **Mức lớp / tháng đặt tay từng lớp**, chia 40 trợ giảng / 20 BTVN / 40 bổ trợ; bổ trợ nằm TRONG mức | Cột "TA" và dòng "TA tổng cấp trung tâm" của bảng cũ không còn nghĩa | Mức đặt tay nên không có bảng "theo sĩ số" chính thức |
| 150.000đ / em / buổi × 8 buổi | Đo thật: ~169.000đ sau giảm; 7,1 buổi / tháng (§1) | Cột doanh thu lệch ~+13 mỗi buổi, −11 số buổi | Thùy chốt số gốc (§10 câu 1) |
| Bổ trợ 20 phần trăm số em × 2 ca | Tháng 10 (số em có tên trong ca không huỷ): bổ trợ yếu 67 em (84 lượt) · học bù 74 em (104 lượt) · ôn thi 55 em · đuổi 23 em — trên 364 em | Giả định 20 gần đúng với riêng bổ trợ yếu (18), nhưng tiền TA không còn tính theo ca | — |

**Phép thử, KHÔNG phải bảng thay thế** (chỉ để thấy cỡ số; mức TA lấy từ bậc theo sĩ số nay chỉ còn là cột tham khảo, doanh thu lấy 8 buổi × 150.000đ như bảng cũ): TA làm đủ cả ba phần — sĩ số 9: 1,2 triệu ÷ 10,8 triệu = 11,1 · sĩ số 12: 1,2 ÷ 14,4 = 8,3 · sĩ số 15: 1,4 ÷ 18,0 = 7,8 · sĩ số 20: 1,6 ÷ 24,0 = 6,7 · sĩ số 25: 1,8 ÷ 30,0 = 6,0. Tức với cơ chế 12/10, **TA đủ công đã gồm bổ trợ rơi vào 6–11**, cao hơn dòng "TA tổng 6,4–9,3" của bản cũ ở lớp nhỏ. Mốc "giáo viên + TA ≤ 30" còn giữ không ⇒ §10 câu 5.

### 5.3 Bảng lãi một lớp theo sĩ số [nhánh 03/09 §3.4] — LỊCH SỬ, cùng cảnh báo

Phân bổ đủ chi phí cố định + core team về từng lớp (44 lớp), giáo viên theo thang 03/09: sĩ số 5 ⇒ lỗ 0,5 triệu / tháng · 7 ⇒ lãi 1,8 triệu (21) · 8–10 ⇒ 2,5 → 4,8 triệu · từ 11 ⇒ từ 5,5 triệu (42 trở lên).
Thông điệp với giáo viên (Thùy chốt 03/09): "mức ổn định là lớp từ 10 em; lớp 5–7 trung tâm trợ cấp; 8–10 vừa vừa; từ 11 ổn định" — và "ổn định" cần lớp ≥ 10 em **và** giáo viên có ≥ 3 lớp; chính sách xếp lớp: lấp đầy giáo viên hiện có trước khi tuyển mới.
Phần thông điệp và chính sách xếp lớp **còn dùng được**; các số lãi phải tính lại (nay 51 lớp, 21 lớp dưới 8 em, giáo viên khung cứng).

## 6. Cơ cấu tài chính một cơ sở ổn định — ĐÍCH (800 em, sĩ số 15, doanh thu 960 triệu / tháng) [nhánh 03/09]

| Nhóm | Khoản | ĐÍCH (phần doanh thu) | 960 triệu ra tiền | HIỆN TẠI đo được (tháng 10, doanh thu phát sinh 514,4 triệu) |
|---|---|---|---|---|
| Doanh thu | Giảm phí giới thiệu, học bổng | 1,5 | 14,4 | giới thiệu 0,6 + hệ số ước ~3,2 |
| | Nợ học phí + hoàn phí | 1,0 | 9,6 | dư nợ 89,6 triệu ở 19/11 (chưa phải nợ mất) |
| Giảng dạy | Giáo viên thuần dạy | ~22 | ~211 | **không có số** (khung lương ngoài hệ) |
| | TA tổng | ~6,5 | ~62 | 6,6 tạm tính (thiếu công + GV kiêm TA chưa tính); đủ công: 11,7 |
| | Gamification | 5,5 | 52,8 | 3,2 (sổ chi) |
| | Tài liệu, đề, in ấn | 1,5 | 14,4 | 1,2 (in giáo trình); phụ huynh đóng học liệu 11,9 triệu |
| Quản lý cơ sở | Giám đốc chi nhánh, trưởng học thuật cơ sở, chăm sóc khách hàng, hành chính (~4 người) | ~7 | ~67 | **không có số** |
| | Lương tháng 13 / quỹ thưởng | 0,6 | 5,8 | không có số |
| | Tuyển dụng, đào tạo | 0,5 | 4,8 | không có số |
| Mặt bằng, vận hành | Nhà + điện nước (40 triệu) | 4,2 | 40 | 7,8 nếu vẫn 40 triệu (thông số, không đo) |
| | Khấu hao cơ sở vật chất, cải tạo | 1,5 | 14,4 | 3,3 (sổ chi; tháng 9: 1,7) |
| | Bảo trì, vệ sinh | 0,5 | 4,8 | chưa tách tháng |
| | Phần mềm, AI, ERP | 1,5 | 14,4 | 1,4 (mua tài khoản) |
| | Bảo hiểm cháy nổ, pháp lý, kế toán | 0,8 | 7,7 | không có số |
| Tăng trưởng | Marketing + sự kiện, tri ân phụ huynh | 4 (trần 5) | 38,4 | 0 (tháng 9: 1,1) |
| HQ | Phí HQ: học thuật, giáo trình, AI, thương hiệu, đào tạo | 7–10 | 67–96 | không có số (hiện = core team trên sổ cơ sở) |
| Dự phòng | Rủi ro + tái đầu tư | 3 | 28,8 | không có số |
| **Lợi nhuận trước thuế** | | **~30–32** | **~288–307** | **không tính được** (§4.3) |
| Thuế | TNDN 20 (10 nếu ưu đãi giáo dục xã hội hoá); hộ kinh doanh: 2 TNCN / doanh thu; dạy học miễn VAT | 3–6 | | cần hỏi kế toán |

- **Định nghĩa đề xuất của bản 03/09 (Thùy CHƯA xác nhận):** 30 = sau lương quản lý cơ sở theo giá thị trường, sau phí HQ, trước thuế TNDN. (Mathnasium báo 30,4 nhưng chủ tự làm giám đốc không tính lương; nếu BK tính 30 trước lương giám đốc chi nhánh thì không mở chuỗi được.) ⇒ §10 câu 2.
- **Hai sổ:** lãi – lỗ cơ sở và lãi – lỗ HQ. Cơ sở 1 đang gánh toàn bộ HQ nên mới thấy 21–28; có cơ sở 2 thì mỗi bên gánh một nửa.
- **Lộ trình lợi nhuận (ước của bản 03/09, dựng trên cơ chế lương cũ — phải tính lại cùng §5):** sĩ số 9 ⇒ ~13–18 · sĩ số 12 ⇒ ~22–25 · sĩ số 15 ⇒ ~30–32. Từ 9 lên 12 là đòn bẩy lớn nhất (mỗi em thêm vào lớp = thêm trọn một suất học phí mỗi buổi).
- Sổ chi đang có hai danh mục **không có dòng trong cơ cấu này**: Công đoàn, Hackathon (§4.1).

## 7. Số nào ra từ đâu — màn → hàm → bảng

| Màn (quyền) | Hiện số gì | Hàm / bảng | Tính ở đâu |
|---|---|---|---|
| Học phí › HS theo môn (`hocphi`) | Mỗi em × lớp: buổi lớp / nghỉ / bù / đuổi, công thức, thành tiền; **tổng tiền các dòng đang lọc** | `hoc_phi_theo_mon_ky(kỳ)` | DB; tổng cuối bảng cộng ở client (§9.2) |
| Học phí › Danh sách | Mỗi phụ huynh: tạm tính / đã chốt, đã thu, còn lại, các lần thu | `fn_hocphi_chi_tiet_ky` · `fn_hocphi_tong_hop_ky` · `fn_hocphi_no_theo_ph` · `fn_hocphi_tin_dung_con_lai` · bảng `hoa_don`, `hoa_don_dong`, `thanh_toan` | DB + **ghép và tính tiếp ở client** (§9.2) |
| Học phí › Phiếu / Chốt kỳ | Phiếu ảo một phụ huynh; chốt thành hoá đơn | `fn_hocphi_phieu_ao` · `fn_hocphi_chot_ky` · trigger `fn_hoa_don_cap_nhat_trang_thai` | DB |
| Học phí › Nợ | Nợ khởi tạo + nợ hệ thống từng phụ huynh; **tổng nợ** | `fn_hocphi_no_theo_ph` · `phu_huynh.no_khoi_tao` | DB; hai tổng cộng ở client |
| Học phí › Học đuổi | Tiền đuổi từng phụ huynh; **tổng** | `fn_hocphi_tong_hop_ky` | DB; tổng cộng ở client |
| Học phí › Giới thiệu · Hệ số · Mức · Phát sinh | Đầu vào | `hoc_phi_tin_dung` · `hoc_sinh_he_so` · `fn_hocphi_he_so_goi_y` / `_hieu_luc` · `muc_hoc_phi` / `_duoi` / `_lieu` · `hoc_phi_phat_sinh` | ghi thẳng bảng |
| Thu chi › Duyệt chi · Sổ chi (`thuchi`) | Khoản chờ, sổ đã ghi | `fn_chi_khoan_duyet` · `fn_chi_so_list` · `fn_chi_thanh_toan_ghi_so` | DB |
| Thu chi › Chốt kỳ | Chưa chốt: số khoản + tổng theo danh mục; kỳ đã chốt: bản chụp; **phiếu quyết toán** (nợ cũ, chi kỳ này, Ngân cần chuyển) | `fn_chi_ky_xem_truoc` · `fn_chi_ky_chot` · `fn_chi_ky_list` · `fn_chi_ky_chi_tiet` · `chi_ky`, `chi_ky_danh_muc` | DB (màn ghi rõ "không cộng ở client") |
| Thu chi › Quỹ – công nợ Ngân | Định mức quỹ, đã chốt, đã nhận, Ngân còn phải chuyển, Lộc đang giữ | `fn_chi_cong_no` · `fn_chi_nhan_tien_list` · `chi_nhan_tien` · `chi_cau_hinh` | DB |
| Thu chi › huy hiệu | Số khoản chờ, số + tiền chưa chốt, kỳ gần nhất | `fn_chi_tong_quan` | DB |
| App BK Chi (mọi nhân sự) | Khoản của tôi; người có `thuchi` thêm tab Duyệt | `fn_chi_cua_toi` · `fn_chi_tao` / `_sua` / `_huy` | DB |
| Lương trợ giảng (`ta_luong`) | Bảng lương tháng từng TA + **dòng tổng** (số TA, lớp, bổ trợ, ngoài gói, tổng, sổ phạt) | `fn_ta_luong_ky` · `fn_ta_luong_ky_tong` · `fn_ta_luong_lop_ds` | DB |
| Gậy › Chốt tháng | Tiền phạt từng người + tổng | `fn_gay_bang` · `gay_chot_thang` | DB; tổng cộng ở client |
| App phụ huynh | Hoá đơn của mình, hạn, QR số còn lại | đọc `hoa_don`, `hoa_don_dong`, `hoc_sinh_he_so`, `muc_hoc_phi` qua role `fdw_bkdemy_web` | ⇒ `spec-app-ph.md` |
| Bot hỏi – đáp | "Hoá đơn chưa thu đủ" theo phụ huynh | công cụ `hoc_phi_no` (`scripts/hoidap/tools.mjs`) đọc `hoa_don.trang_thai` | **đọc sai nợ** (§9.1 mục 2) |

**Chưa có màn nào hiện số tài chính cấp trung tâm.** Quyền `db_taichinh` ("Dashboard tài chính") **đã cấp trong DB** cho vai Core team nhưng **không có màn, không có hàm**: không có hàm doanh thu theo tháng, không có báo cáo học phí tổng theo kỳ, không có tổng chi theo danh mục theo tháng (chỉ có theo kỳ chốt), không có số so với đích. Mọi số ở §1, §3, §4 của spec này là truy vấn tay ngày 19/11.

## 8. Ai xem / ghi được số nào (quyền THỰC TẾ trên DB, đo 19/11)

| Dữ liệu | Đọc | Ghi | Nhận xét |
|---|---|---|---|
| `hoa_don`, `hoa_don_dong`, `hoa_don_log`, `hoc_phi_cong_thuc`, `hoc_phi_phat_sinh`, `hoc_phi_tin_dung` | người có `hocphi` | người có quyền ghi `hocphi` | đúng. Hai bảng đầu thêm quyền đọc cho `fdw_bkdemy_web` (app phụ huynh) |
| **`thanh_toan`** (các lần thu) | **mọi nhân sự** | **mọi nhân sự — thêm / sửa / xoá** | ❌ lỗ: policy `thanh_toan_member_all`. Trạng thái hoá đơn suy từ bảng này ⇒ ai cũng đổi được "đã thu" |
| **`muc_hoc_phi`, `muc_hoc_duoi`, `muc_hoc_lieu`** (bảng giá) | mọi nhân sự | **mọi nhân sự** | ❌ lỗ: `*_member_all`. Đổi giá ⇒ đổi mọi phiếu ảo chưa chốt |
| **`hoc_sinh_he_so`** (hệ số giảm) | mọi nhân sự | **mọi nhân sự** | ❌ lỗ: `hoc_sinh_he_so_member_all` |
| `chi_so`, `chi_ky`, `chi_ky_danh_muc`, `chi_nhan_tien`, `chi_cau_hinh` | người có `thuchi` (dòng sổ của khoản mình thì chính chủ xem được) | quyền ghi `thuchi` | đúng |
| `chi_khoan` | chính chủ hoặc `thuchi` | chính chủ khi còn chờ; `thuchi` | đúng |
| `chi_danh_muc` | mọi nhân sự | quyền ghi `thuchi` | đúng |
| `ta_luong_ky` (dòng tổng mỗi lần chốt: số TA, tổng thực nhận) | **mọi nhân sự** | chỉ qua hàm chốt | ⚠ khi chốt kỳ đầu tiên, mọi nhân sự đọc được **tổng quỹ lương TA** qua API ⇒ §10 câu 3 (ai được xem số tổng) |
| `ta_luong_ky_dong` (phiếu từng TA) | chính chủ hoặc `ta_luong` | chỉ qua hàm | đúng |
| `ta_don_gia`, `ta_luong_lop` | `ta_luong` / chỉ qua hàm | chỉ qua hàm | đúng |
| `gay_chot_thang` (tiền phạt từng người) | mọi nhân sự | chỉ qua hàm có cổng | đúng chủ ý (bảng gậy công khai) |

- **Ai có quyền:** `hocphi`, `thuchi`, `ta_luong`, `db_taichinh` đều chỉ gắn vai **Core team — 3 người đang làm**; cộng 2 tài khoản quản trị hệ thống (bỏ qua mọi cổng). 46 nhân sự đang làm.
- **Hàm:** nhóm `fn_hocphi_chi_tiet_ky`, `_phieu_ao`, `_chot_ky`, `hoc_phi_theo_mon_ky`, `fn_ta_luong_*` chạy quyền chủ và **có cổng** trong thân; `fn_hocphi_tong_hop_ky` không có cổng riêng nhưng gọi qua `fn_hocphi_chi_tiet_ky` (có cổng) — ổn. Nhóm `fn_hocphi_no_theo_ph`, `_so_du_no`, `_tin_dung_con_lai`, `fn_chi_*` chạy quyền người gọi, dựa vào RLS của bảng — ổn.
- ⚠ **Cấp thừa:** 18 hàm `fn_chi_*`, 5 hàm `fn_hocphi_*` (gợi ý / hiệu lực hệ số, nợ, số dư nợ, tín dụng) và `fn_gay_bang` còn cấp quyền gọi cho ba role ngoài `fdw_bkdemy_web`, `ph_nop`, `web_lead_writer` (dấu vết quyền mặc định cũ). `fdw_bkdemy_web` đọc được `hoa_don` nhưng không đọc được `thanh_toan` ⇒ nếu gọi hàm nợ sẽ ra **số nợ sai (như chưa ai đóng đồng nào)**. Thu quyền phải **đo trên DB app phụ huynh trước** (`spec-app-ph.md` §1).
- Người chưa đăng nhập: các bảng trên còn quyền `select` cấp cho `anon` ở mức bảng nhưng **không có policy nào cho `anon`** ⇒ đọc ra 0 dòng. Không phải lỗ; là nợ dọn quyền.
- Kiểm phạm vi trên màn (`coGhi`) ở `ThuChiScreen`, `LuongTaScreen` chỉ để ẩn nút — rào thật là policy / cổng hàm ở trên.

## 9. Lệch · tính tiền ở client · việc chờ lệnh

### 9.1 Lệch giữa nguồn ↔ DB / code

1. **Ba thông số gốc của bản 03/09 lệch số đo:** học phí / buổi 150.000 ↔ ~169.000đ · 8 buổi ↔ 7,1 buổi · sĩ số 9 ↔ 8,35 (đích 12 cuối 2026 — còn 6 tuần). ⇒ §10 câu 1.
2. **"Chưa thu" theo trạng thái hoá đơn ≠ nợ thật** (173,7 ↔ 89,6 triệu — §3.1). Công cụ `hoc_phi_no` của bot hỏi – đáp đang đọc theo trạng thái ⇒ trả lời "còn nợ" cho cả hoá đơn kỳ cũ đã được gộp và thu ở kỳ sau; còn trả kèm tên + số điện thoại phụ huynh (chưa kiểm ai được hỏi công cụ này — §11).
3. **Bảng chi phí giáo viên + TA (§5.1), bảng lãi lớp (§5.3), lộ trình lợi nhuận (§6) dựng trên cơ chế lương đã bỏ** — chưa có bản thay.
4. **Giảm theo hệ số (~3,2 doanh thu) không có trong cơ cấu đích**; cơ cấu chỉ ghi "giới thiệu, học bổng 1,5".
5. **Hai danh mục chi thật không có dòng đích:** Công đoàn 28,0 triệu, Hackathon 14,2 triệu (từ 01/09).
6. **Kỳ 09 có 4 hoá đơn thu vượt tổng, cộng 4,8 triệu** — hệ vẫn để "đã thu", phần dư không thành dòng nào (hàm nợ ra số âm cho phụ huynh đó). Chưa có luật cho "thu dư / hoàn phí" dù cơ cấu đích có dòng "hoàn phí".
7. **Thông số "quỹ vận hành 10–20 triệu / tháng" ↔ sổ chi 65–70 triệu / tháng** — không so trực tiếp được vì sổ chi gồm cả quà, công đoàn, hackathon; trừ quà và công đoàn, tháng 10 còn ~50 triệu (Hackathon chưa tách được theo tháng).
8. **`db_taichinh` có quyền mà không có màn** (§7); `quyen.ts` còn nhắc tên lá này, danh sách lá của app không có.
9. **Tiền thật không có vết chốt:** chưa kỳ lương TA nào chốt, chưa tháng gậy nào chốt (đã ghi ở `spec-luong-gay.md` §7) ⇒ "quỹ lương TA tháng 10" trong mọi báo cáo vẫn là số tạm, tính lại mỗi lần mở.
10. **Văn bản nguồn mất:** bảng tỉ lệ lương / doanh thu của thang giáo viên 2026 (§3.1b) không còn file ở đâu — chỉ còn một dòng HANDOFF "32–40 ở sĩ số 8–12". `spec-hocphi.md` (05/07) cũng đã mất (ghi ở spec vận hành).
11. `PLAN-thu-chi.md` §2–§3 lỗi thời ở 3 chỗ so với DB: thêm bảng `chi_nhan_tien` (+ log), `chi_cau_hinh` và hàm `fn_chi_cong_no`, `fn_chi_nhan_tien_*` (quỹ – công nợ Ngân, 03/09) · hai view `v_chi_khoan_duyet`, `v_chi_so` đã thay bằng hàm `fn_chi_khoan_duyet`, `fn_chi_so_list` · thêm `fn_chi_ky_list`, `fn_chi_nhan_su_bank`.

### 9.2 Tính tiền ở client (trái CLAUDE §2.0) — file:dòng

| Chỗ | Làm gì | Mức |
|---|---|---|
| `src/lib/hocphi.ts:559–567` | Tính **giảm giới thiệu** = nhỏ hơn giữa (tín dụng còn lại, học chính + đuổi) và **tổng tạm tính** = chính + đuổi + nợ − giảm cho mọi phụ huynh chưa chốt — **công thức thứ hai** song song với `fn_hocphi_phieu_ao`. Chính file ghi "số cuối để thu vẫn lấy ở Phiếu" | **nặng** (nhóm 2 của §14: công thức tiền hai bản) |
| `src/lib/hocphi.ts:544–547` | Tải mọi lần thu của kỳ (`.in` ~300 mã hoá đơn, `limit` 2000) rồi **cộng "đã thu" theo phụ huynh bằng JS** | vừa — nên là một cột của hàm DB |
| `src/screens/hocphi/HocPhiScreen.tsx:391` | "Còn lại" = tổng − đã thu (từ số cộng ở trên) — con số đưa vào QR / nhắc phụ huynh | vừa |
| `src/screens/hocphi/HocPhiScreen.tsx:673–674` | Tổng nợ + tổng nợ khởi tạo cả trung tâm bằng `reduce` | vừa (số cấp trung tâm) |
| `src/screens/hocphi/HocPhiScreen.tsx:711` | Tổng tiền học đuổi cả kỳ bằng `reduce` | vừa |
| `src/screens/hocphi/HocPhiScreen.tsx:153` | Tổng tiền các dòng **đang lọc** của bảng HS theo môn | nhẹ (sát ranh giới: cộng theo bộ lọc trên màn) |
| `src/lib/hocphi.ts:292` | Lọc "đang nợ" bằng ngưỡng 0,5đ ở client | nhẹ |
| `src/screens/gay/GayScreen.tsx:733, 742` | Tổng tiền phạt gậy bằng `reduce` | nhẹ (đã ghi `spec-luong-gay.md` §9.2 mục 14) |
| `src/lib/hocphi.ts:354–358` | Huỷ chốt = xoá 4 bảng thẳng từ client, không transaction | đã ghi `spec-van-hanh-trung-tam.md` §11.2 mục 8 |

`ThuChiScreen.tsx`, `chi/*`, `LuongTaScreen.tsx`: **không** cộng tiền ở client (tổng lấy từ `fn_chi_*`, `fn_ta_luong_ky_tong`) — đúng luật.

### 9.3 Việc code / DB — CHỈ làm khi Thùy ra lệnh

| # | Việc | Từ |
|---|---|---|
| 1 | Đóng quyền ghi `thanh_toan`, `muc_hoc_phi` / `_duoi` / `_lieu`, `hoc_sinh_he_so` về người có quyền ghi `hocphi` (đọc bảng giá vẫn mở cho nhân sự); thử qua API trước khi áp | §8 |
| 2 | Thu quyền gọi hàm tiền của ba role ngoài — đo trên DB app phụ huynh trước | §8 |
| 3 | Đưa "đã thu · còn lại · giảm giới thiệu · tổng tạm tính" của Danh sách học phí về MỘT hàm DB cùng nguồn với phiếu ảo; bỏ công thức ở `hocphi.ts:559–567`; các dòng tổng lấy từ hàm | §9.2 |
| 4 | Sửa công cụ `hoc_phi_no` của bot đọc `fn_hocphi_no_theo_ph` thay cho trạng thái hoá đơn | §9.1 mục 2 |
| 5 | **Sổ tài chính tháng** (bảng tính sẵn, đăng ký bộ điều phối, chạy ngoài 17–22 giờ): doanh thu phát sinh theo kỳ × môn × loại dòng · thực thu theo tháng · dư nợ · giảm phí (giới thiệu + hệ số) · chi theo danh mục theo tháng · quỹ lương TA (tạm / đã chốt) + màn `db_taichinh` chỉ đọc, ghi "số tính lúc HH:MM" — **sau khi Thùy trả lời câu 3, 4, 6** | §7, §4.3 |
| 6 | Bảng "chi cố định tháng" (nhập số tổng theo nhóm: nhà, điện nước, quỹ lương giáo viên, core team…) nếu Thùy chọn đưa vào hệ | §10 câu 4 |
| 7 | Luật + chỗ ghi cho "thu dư / hoàn phí" | §9.1 mục 6 |
| 8 | Dựng lại bảng chi phí giáo viên + TA theo sĩ số và bảng lãi lớp trên cơ chế lương mới + sheet kịch bản (biến: buổi / tháng, sĩ số, số em, lương quản lý, phí HQ) — sau câu 1, 2, 5 | §5.2 · [nhánh 03/09 §7 mục 12] |

## 10. Câu hỏi chờ Thùy (10 câu — mỗi câu ghi rõ đang hỏi số ĐÍCH hay HIỆN TẠI)

1. **Ba con số gốc để tính mọi bảng — dùng số nào? (HIỆN TẠI)**
   Bản tháng 9 tính với: mỗi em 150.000đ một buổi, mỗi tháng 8 buổi, lớp trung bình 9 em. Đo trên hệ thì khác: giá bình quân sau giảm khoảng **169.000đ** một buổi, tháng 10 mỗi lớp học trung bình **7,1 buổi**, lớp trung bình **8,35 em**.
   Ví dụ một lớp 9 em: theo số cũ thu 1.350.000đ một buổi; theo số đo là khoảng 1.520.000đ một buổi nhưng một tháng chỉ ~7 buổi.
   **Đề xuất:** dùng số đo (169.000đ · 7 buổi · sĩ số thật từng tháng) cho mọi bảng "hiện tại"; giữ 150.000đ × 8 buổi làm kịch bản thận trọng. Và đích **"sĩ số 12 cuối 2026"** có giữ không khi hôm nay mới 8,35 (đây là số ĐÍCH — Thùy cho mốc mới nếu đổi)?

2. **"Lợi nhuận 30" là sau khi đã trừ những gì? (ĐÍCH)**
   Với cơ sở 800 em thu 960 triệu một tháng, 30 nghĩa là còn ~288 triệu. Bản tháng 9 đề xuất: 288 triệu đó là **sau khi đã trả lương quản lý cơ sở theo giá thị trường (~67 triệu) và phí về HQ (67–96 triệu), chưa trừ thuế** — Thùy chưa xác nhận.
   **Đề xuất:** xác nhận đúng định nghĩa đó (nếu tính 30 trước lương giám đốc chi nhánh thì cơ sở thứ hai sẽ không đạt).

3. **Có làm màn "Tài chính tháng" trên ERP không, và ai được xem? (HIỆN TẠI)**
   Hôm nay không màn nào cho Thùy thấy "tháng 10 phải thu 514 triệu, đã thu 474 triệu, còn nợ 90 triệu, chi hoàn ứng 70 triệu, lương TA 34 triệu" — các số trong file này tôi phải truy vấn tay. Quyền "Dashboard tài chính" đã cấp cho 3 người Core team nhưng chưa có màn.
   **Đề xuất:** làm một màn chỉ đọc, số tính sẵn mỗi đêm; chỉ Thùy + Core team xem. Kèm: tổng quỹ lương TA sau khi chốt hiện **mọi nhân sự đọc được** — đề xuất đóng lại, chỉ Core team.

4. **Những khoản không đi qua ERP — đưa vào hệ bằng cách nào? (HIỆN TẠI)**
   Tiền nhà (35 triệu), điện nước, lương giáo viên, lương core team / OPS, thuế hiện không có số nào trong hệ ⇒ ERP không tính được lãi – lỗ. Ví dụ: muốn biết "giáo viên chiếm bao nhiêu doanh thu" thì cần tổng quỹ lương giáo viên tháng 10; nếu là 150 triệu thì là 29 trên 514 triệu — nhưng tôi không có con số đó.
   **Đề xuất:** mỗi tháng Lộc (hoặc Trang) nhập **một con số tổng cho mỗi nhóm** (nhà · điện nước · quỹ lương giáo viên · quỹ lương core team + OPS · thuế – kế toán) vào một bảng nhỏ; **không nhập lương từng người**. Đủ để ra lãi – lỗ tháng mà không lộ lương cá nhân.

5. **Mốc "giáo viên + TA không quá 30 doanh thu" còn giữ không? (ĐÍCH)**
   Mốc này đặt khi giáo viên và TA đều trả theo buổi. Nay giáo viên lương cứng, TA theo mức lớp. Riêng TA tháng 10: tạm tính 33,8 triệu (6,6 doanh thu); nếu mọi lớp đủ công là 60 triệu (11,7) — cao hơn con số "TA ~6,5" của bảng đích.
   **Đề xuất:** giữ trần 30 cho **tổng** giáo viên + TA làm ĐÍCH; bỏ mốc phụ "TA dưới 6 là thiếu bổ trợ" (giờ bổ trợ đã đo bằng giờ thật); nâng dòng đích TA lên khoảng 8–9 hoặc Thùy cho số.

6. **"Doanh thu tháng" tính theo tiền phải thu hay tiền đã về? (HIỆN TẠI)**
   Tháng 10: học phí **phát sinh** 514,4 triệu, nhưng tiền **thực thu trong tháng 10** là 474,2 triệu (phần lớn là học phí tháng 9, vì hoá đơn chốt đầu tháng sau).
   **Đề xuất:** báo cả hai; mọi tỉ lệ chi phí chia cho **số phát sinh của đúng tháng đó** (lương tháng 10 so với học phí tháng 10).

7. **Giảm học phí: đích 1,5 có gồm giảm theo hệ số không? (ĐÍCH)**
   Cơ cấu đích ghi "giảm phí giới thiệu, học bổng: 1,5". Thực tế kỳ 10: giới thiệu 3,2 triệu (0,6), nhưng giảm theo hệ số (học 2 môn, có anh chị em — 146 em đang được giảm 5–10) ước **~16 triệu (3,2)**. Cộng lại ~3,8, gấp hơn hai lần đích.
   **Đề xuất:** tính cả hệ số vào dòng này và đặt đích 4 (lợi nhuận đích giảm tương ứng ~2,5 điểm), hoặc Thùy quyết siết hệ số.

8. **Nợ học phí: đo ở mốc nào thì mới so được với đích 1? (ĐÍCH)**
   Hôm nay 53 phụ huynh còn nợ tổng 89,6 triệu — nhưng phần lớn là hoá đơn tháng 10 vừa báo. Đích "nợ + hoàn phí 1" với doanh thu 514 triệu là khoảng 5 triệu một tháng.
   **Đề xuất:** "nợ" để so đích = tiền còn chưa thu **sau 30 ngày kể từ ngày báo lần 1**, cộng nợ của phụ huynh đã nghỉ; nợ trong hạn không tính.

9. **Tiền "Công đoàn" và "Hackathon" xếp vào dòng nào? (HIỆN TẠI)**
   Từ 01/09 sổ chi có Công đoàn 28,0 triệu và Hackathon 14,2 triệu — cơ cấu đích không có dòng nào cho hai khoản này. Trong đó có một khoản đúng **22.222.222đ** ngày 02/09 (số tròn lạ).
   **Đề xuất:** thêm dòng "Phúc lợi – gắn kết nhân sự" vào cơ cấu (Thùy cho đích, vd 1–2); Hackathon xếp vào "Tuyển dụng, đào tạo". Và Thùy / Lộc xác nhận khoản 22.222.222đ là thật hay khoản thử lúc mới chạy.

10. **Quà cho học sinh: đích 5,5 có còn đúng không? (ĐÍCH)**
    Đích 5,5 doanh thu ≈ 28 triệu một tháng ở mức thu hiện nay. Sổ chi ghi tháng 9: 11,3 triệu, tháng 10: 16,3 triệu (2,6–3,2).
    **Đề xuất:** nếu toàn bộ tiền quà đều đi qua BK Chi thì hạ đích về 3,5; nếu còn khoản quà mua không qua BK Chi thì Thùy cho biết để tôi ghi "số đo chưa đủ" thay vì hạ đích.

## 11. Chưa kiểm được

- **Quỹ lương TA hôm nay:** `fn_ta_luong_ky_tong` có cổng quyền, role chỉ đọc gọi ra "Không có quyền xem lương trợ giảng" ⇒ dùng số đo 17/11 của `spec-luong-gay.md`.
- **Lương giáo viên, lương core team / OPS, tiền nhà – điện nước thật:** không có trong DB.
- **Giảm theo hệ số (16,4 triệu):** số ước từ hệ số bình quân của dòng hoá đơn, không phải tổng chính xác từng dòng.
- **Ai được hỏi công cụ `hoc_phi_no` của bot** và role `fdw_bkdemy_web` có thật sự gọi hàm nợ ở app phụ huynh không: chưa đọc code bot / DB app phụ huynh.
- **Quyền qua API thật** (REST bằng tài khoản nhân sự thường): mới đọc `pg_policies` + ACL, chưa thử gọi.
- **Khoản chi không qua BK Chi** (Ngân chi trực tiếp, trả thẳng nhà cung cấp): không có dấu vết nào để ước.
- Notion (North Star, Strategic Pillars): chưa đọc được — đích 30 và trần 800 em lấy từ bản 03/09.

## 12. Việc treo từ bản 03/09 thuộc spec này (chưa ai trả lời)

| # (số gốc) | Việc | Ai | Trạng thái |
|---|---|---|---|
| 1 | Số buổi / tháng thực tế, độ dài buổi cấp 1, học phí cấp 1 | Thùy | đã có số đo (§1) — chờ Thùy chốt cách dùng (§10 câu 1) |
| 9 | Đơn giá nói với nhân sự là trước hay sau thuế (nếu khấu trừ 10 TNCN với cộng tác viên) | Thùy + kế toán | treo |
| 10 | Pháp nhân, ưu đãi TNDN 10 cho giáo dục xã hội hoá | kế toán | treo |
| 11 | Phí HQ theo phần doanh thu (kiểu Mathnasium) hay theo đầu em (kiểu Kumon); quà giữ 5,5 ở 800 em? | Thùy | treo (nửa sau ⇒ §10 câu 10) |
| 12 | Dựng sheet kịch bản | Claude, sau khi chốt câu 1, 2, 5 | §9.3 việc 8 |

Các mục 2–8, 13 của bảng gốc là về lương ⇒ đã xử lý ở `spec-luong-gay.md` §9.
