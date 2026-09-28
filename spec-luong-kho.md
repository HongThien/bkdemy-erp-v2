# spec-luong-kho.md — LUỒNG KHO: tài liệu vào → bản đồ + câu đạt chuẩn

> **Trạng thái: NHÁP — đang hỏi CEO (mở 28/09).** Chưa build gì. File này giữ (1) quyết định CEO đã chốt,
> (2) số đo hiện trạng, (3) câu còn mở. Khi chốt xong ⇒ chép intent lên Notion, file này thành spec build.

## 0. Đích (CEO 28/09)

Đưa tài liệu (PDF/Word) vào ⇒ hệ tự: đọc · đề xuất cập nhật bản đồ nếu có dạng mới · gán dạng/cụm từng câu ·
giải bài đúng phạm vi · vẽ hình · chuyển form (chủ yếu MCQ) ⇒ **câu vào kho đạt chuẩn**; tài liệu gốc được
**lưu có cấu trúc** để tái dùng (đề thi ⇒ đề online cho HS thi thử).

6 skill: ① đọc tài liệu · ② tư duy bản đồ (**làm CÙNG CEO, không solo**) · ③ gán nhãn · ④ giải bài đúng phạm vi ·
⑤ vẽ hình · ⑥ chuyển form.

## 1. Quyết định đã chốt

| # | Quyết định (CEO 28/09) | Hệ quả thiết kế |
|---|---|---|
| A1 | Mỗi môn/nhánh có logic riêng. **Làm TOÁN ĐẠI trước** (dễ nhất, rộng nhất). | Khung chung + skill theo nhánh; Hình/HGT/KHTN cắm sau qua registry (§1.6 CLAUDE.md). Vẽ hình lùi sang đợt Hình. |
| A2 | **Chạy trên máy CEO là đủ.** Vài trăm PDF, mấy chục nghìn câu. Không cần xong trong 1–2 ngày — cần **liên tục + ổn định**. | Không dựng server/API. Hàng đợi bền + scheduler gọi Claude headless; mọi bước idempotent, đứt giữa chừng chạy lại không nhân đôi. |
| A3 | Đầu vào cả 3 loại (PDF chữ · PDF scan · Word). **~50% có đáp án.** | Skill ④ (giải) là đường CHÍNH, không phải ngoại lệ. Word MathType phải qua PDF. |
| B1 | Luật phân tầng — xem §2. | |

## 2. Luật phân tầng Dạng / Cụm / Biến thể (CEO 28/09)

- **DẠNG** = các bài có **kiến thức + kĩ năng + phương pháp làm** giống nhau cực nhiều.
- **DẠNG "CƠ BẢN"** = các bài **quá dễ / đơn giản** của một phần ⇒ gộp chung 1 dạng "Tính chất cơ bản / dạng cơ bản" của phần đó.
- **CỤM BÀI** = các **hình thái** của cùng một dạng: cùng kiến thức–kĩ năng–phương pháp, nhưng **hình dạng đề cho khác nhau**.
  Vd: tìm x với tổng = 1 cụm · với hiệu = 1 cụm · với tích = 1 cụm.
- **BIẾN THỂ ĐỔI SỐ** ≠ cụm mới. Đổi số = vẫn cùng cụm.

Đứng trên vai (R7): *deep structure vs surface structure* (Chi, Feltovich & Glaser 1981 — chuyên gia xếp bài theo
nguyên lý giải, người mới xếp theo bề mặt) · *Knowledge Component* (Koedinger, KLI framework) = dạng ·
*item model / item family* (Automatic Item Generation — Gierl & Haladyna) = cụm, *isomorph* = biến thể đổi số.

### Phép thử vận hành cho agent (ĐỀ XUẤT của CTO — chờ CEO xác nhận)

1. **Dạng:** lời giải chuẩn của câu dùng kiến thức/kĩ năng/phương pháp nào? Trùng dạng có sẵn trong chuyên đề ⇒ cùng dạng.
2. **Cụm:** thay số vào KHUÔN ĐỀ của một cụm có sẵn mà ra được câu này ⇒ cùng cụm. Không ⇒ đề xuất cụm mới.
3. **Không dạng nào khớp phương pháp:** bài dễ (≤2 bước, áp thẳng 1 định nghĩa/tính chất) ⇒ dạng "cơ bản" của chuyên đề;
   còn lại ⇒ **đề xuất DẠNG MỚI** kèm câu làm chứng + dạng gần nhất + vì sao không gộp được. Ghi khi CEO duyệt.

### Hệ quả kiến trúc: GIẢI là nhân chứng thứ hai của GÁN DẠNG

Dạng định nghĩa bằng *phương pháp*, mà phương pháp chỉ lộ ra trong *lời giải* ⇒ nhìn đề đoán dạng là chưa đủ.
Vòng: đề ⇒ **top-k dạng ứng viên** ⇒ giải theo phương pháp chuẩn của dạng ứng viên ⇒ giải được bằng đúng phương pháp đó
= dạng được xác nhận; không ⇒ thử ứng viên kế / rơi về "đề xuất dạng mới". (Đúng luật CLAUDE.md §2: map quan hệ phải có
nhân chứng thứ hai độc lập.) Cùng lúc giải quyết luôn "giải đúng phạm vi": lời giải sinh ra đã bám phương pháp của dạng.

## 3. Số đo hiện trạng — kho ĐẠI (đo DB live 28/09, phiên read-only)

| Hạng mục | Số |
|---|---|
| Dạng (trừ dạng chờ) | **685** trên 13 khối (3 → 12, kèm 4T/5T/8T) |
| Câu chưa xoá | **26.760** (TLN 14.612 · TN 7.960 · tự luận 3.148 · Đ/S 1.040) |
| Dạng **0 câu** | 160 |
| Dạng có `mo_ta_ngan` | **~0** (mỗi khối 1 dòng) ⇒ agent gán dạng hiện chỉ dựa vào TÊN dạng |
| Dạng có lý thuyết | 365 / 685 (53%) |
| Cụm bài | 288 cụm trên **106 / 685 dạng**; **5.130 / 26.760 câu (19%)** có cụm. Khối 3·4·5 = 0 cụm |
| Dạng ≥50 câu mà chưa có cụm nào | **176** |
| Câu nằm ở dạng chờ | 1.836 (K12 1.516 · K11 307 · 5T 13) |
| Câu thiếu đáp án / thiếu lời giải | 1.394 / 1.796 (dồn ở K11–K12) |
| K12 | 6.056 câu, chỉ 589 đã duyệt, 1.382 kho chuẩn ⇒ ổ nợ lớn nhất |
| Form MCQ | TLN có form đã duyệt 9.613 / 14.612 · tự luận 1.102 / 3.148 |
| Đề thi đã lưu (đường A `tai_lieu`) | 345 |

Cảnh báo đọc số: `dang_ai_de_xuat` khớp `dang_chinh` 6.226 / 6.316 **KHÔNG phải độ chính xác 98,6%** — cột này được ghi
bằng chính `dang_chinh` lúc insert; chỉ có nghĩa trên câu người đã xem lại. Chưa có thước đo gán dạng đáng tin.

## 4. Hiện trạng 6 skill (tóm tắt — chi tiết ở HANDOFF)

| Skill | Đã có | Lỗ |
|---|---|---|
| ① Đọc | 4 đường nhập song song (`/nhap-kho` Claude · NhapKhoScreen Gemini · DeThiScreen Gemini · Noctorium DOCX) | Quy ước lệch nhau; Word MathType không đọc được |
| ② Bản đồ | Cây + mã chuẩn hoá Đại, UI chuyển/gộp/xoá | Không có luồng "đề xuất dạng/cụm mới → chờ duyệt"; không có hồ sơ dạng |
| ③ Gán nhãn | Gemini confidence + ngưỡng 0,7; `kho_tag_log`, `kho_doi_dang_log` | 2 kênh log không thống nhất; chưa gán CỤM |
| ④ Giải | `spec-giai-bai-ai.md`, `hangdoi-giai.mjs`, scheduler `claude -p` | Không kiểm soát phạm vi kiến thức; verify chỉ là lời dặn, script không ép |
| ⑤ Vẽ hình | Cắt ảnh từ nguồn | 0 công cụ vẽ (chờ quyết định CEO từ 05/09) |
| ⑥ Form | `mcq-auto/sinh/dien`, điền ô Hình + 4 dạng Đại | Phủ theo từng dạng; 25 dạng chưa có MCQ |
| Lưu tài liệu | Đường A + thi online trên lớp (27/09) | `/nhap-de-thi` còn ghi đường B (`toan_de_thi`, đã ngừng); P4 tự luyện chưa làm |

## 5. Khung đề xuất (CTO — chưa chốt)

- **Trạng thái pure-derive, không bảng job:** `fn_tai_lieu_thieu(id)` trả từng câu thiếu gì (dạng · cụm · đáp án · lời giải ·
  hình · form). Việc = must-exist − does-exist. Mẫu đã có: `fn_de_thi_thieu`.
- **Tài liệu MỚI và NỢ CŨ là cùng một hàng đợi** — cùng skill lấp cùng loại lỗ (1.836 câu chờ dạng, 176 dạng chưa chia cụm…).
- **1 cửa vào** thay 4 đường. Mỗi skill lấp 1 loại lỗ, chạy lại được.
- **Hồ sơ dạng** (tiền đề của ③ và ④): mỗi dạng có kiến thức · kĩ năng · phương pháp chuẩn · dấu hiệu nhận biết · câu mẫu ·
  dạng hay nhầm. Agent nháp từ câu đã duyệt + lý thuyết, CEO duyệt.
- **Máy làm → máy khác kiểm → người chỉ xem cái máy nghi** (maker–checker, generate-then-verify).
- **Đề vàng** để đo agent tốt lên hay tệ đi sau mỗi lần sửa skill.

## 6. Câu còn mở

⛔ = chặn kiến trúc.

1. ⛔ **Phép thử §2 đúng ý chưa?** Nhất là ranh "quá dễ" = ≤2 bước, áp thẳng 1 định nghĩa/tính chất.
2. ⛔ **Bài nhiều ý / bài tổng hợp dùng 2 phương pháp** (rút gọn rồi tìm x): mỗi ý 1 dạng, hay 1 dạng chính cho cả bài?
3. ⛔ **Chia cụm cho dạng CŨ** (176 dạng ≥50 câu chưa có cụm): agent đề xuất luôn, hay chỉ làm với tài liệu mới?
4. ⛔ **"Đúng phạm vi kiến thức"**: (a) theo khối · (b) theo thứ tự bài giáo trình BK · (c) theo phương pháp chuẩn của dạng.
5. ⛔ **Tự duyệt khi máy kiểm độc lập khớp** — có chấp nhận không, cho loại câu nào?
6. ⛔ **Cửa vào:** thả folder + scheduler (ERP chỉ để duyệt) hay upload trong ERP?
7. ⛔ **Đề vàng:** có 3–5 tài liệu Đại đã nhập tay chuẩn 100% chưa?
8. Ai duyệt ngoài CEO, mỗi ngày bao nhiêu phút? Ai được duyệt dạng mới?
9. SGK bộ nào; có nhập SGK làm thước phạm vi không?
10. "Đạt chuẩn" có gồm MCQ không (đề xuất tách *chuẩn kho* / *chuẩn online*)?
11. Câu gần giống từ 2 nguồn = câu mới hay biến thể? Tài liệu nào không được phát nguyên văn?
12. Gemini hay Claude (đề xuất gộp 1); trần chi phí?
13. *(Lùi sang đợt Hình)* vẽ hình: AI sinh → người duyệt hay GV dựng tay; ảnh cắt có tính đạt chuẩn; hình không gian.
