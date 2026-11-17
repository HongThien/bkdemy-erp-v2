# Kết quả học tập — Tổng kết trạng thái hiện tại

> Viết 07-16 để Thùy mang đi brainstorm (Claude web). Đây là bản chụp **những gì hệ thống ĐÃ CÓ**
> tính tới thời điểm này — không phải đề xuất, không phải kế hoạch. Nguồn: code thật trong repo
> (`src/lib/mastery.ts`, `src/lib/thanhtich.ts`, `src/screens/ketqua/KetQuaScreen.tsx`).

---

## 1. Mô hình lõi (nhắc lại, xem CLAUDE.md §1/§5 để đầy đủ)

- Đơn vị chân lý = **(Học sinh × Dạng)**. Dạng = Knowledge Point, sống trong bản đồ kiến thức
  (`dai_ban_do`/`khtn_ban_do`…).
- **Mastery KHÔNG lưu — suy động** mỗi lần gọi, từ mọi lần đo của dạng đó (không gắn theo 1 buổi cụ thể).
- Mỗi ô (HS × dạng) có 3 trạng thái: **đạt / cần luyện / yếu**, hoặc **chưa-đo** (không có dòng nào — không
  bao giờ gộp "chưa-đo" vào "yếu").
- Mọi dữ liệu học tập mang nhãn **môn** (Toán/KHTN hiện có kho; Văn/Anh chưa).

---

## 2. Các nguồn dữ liệu / tín hiệu đo hiện có

| Nguồn | Bảng DB | Cách chấm | Có vào công thức mastery? | Trọng số | Ghi chú |
|---|---|---|---|---|---|
| **ET** (kiểm tra cuối giờ) | `gami_grades` (phase='et') + `bai_lam_cau` (test online loại et/de_thi) | Đ/C/S per câu, có giám sát | ✅ Luôn | 2 | Chuẩn nhất sau MT |
| **MT** (kiểm tra tháng — nội dung/câu hỏi) | `gami_grades` (phase='mt') | Đ/C/S per câu, có giám sát, soạn ở "Làm tài liệu → MT" | ✅ Luôn | 3 | Điểm-số MT (khác khái niệm, xem §5.3) tách biệt hoàn toàn khỏi kênh Đ/C/S này |
| **BTVN** (bài tập về nhà) | `gami_grades` (phase='btvn') + `bai_lam_cau` (test online, giáo trình) | Đ/C/S per câu, KHÔNG giám sát (tự làm ở nhà) | ⚙️ Tuỳ chọn (toggle "Gộp BTVN") | 1 | Tự luyện — coi là tham khảo |
| **Bổ trợ (BT)** | `bt_grades` (mig 0094) | Đ/C/S per câu, tự luyện, không gắn buổi/session | ⚙️ Cùng toggle với BTVN | 1 | Trước đây LUÔN vào, nay gate chung 1 toggle với BTVN (đổi 07-15) |
| **Chấm bài trên lớp (ingame)** | `gami_grades` (phase='ingame') | Đ/C/S per câu, tại lớp | ❌ Đã loại (07-15) | — | Trước có trọng số 2, nay bỏ hẳn khỏi mastery |
| **Đánh giá GV (đg)** | `buoi_danh_gia_dang` | GV tự chấm điểm 0/0.5/1 theo dạng, KHÔNG per-câu | ❌ Đã loại (07-15) | — | Lý do loại: "phụ thuộc cảm giác", không phải đo khách quan per-câu như các nguồn còn lại |

**Công thức mastery 1 dạng** (engine thuần `src/gami/mastery.js`, hàm `masteryOfDang`):
- Lấy **5 lần đo gần nhất theo thời gian** (không phân biệt nguồn khi chọn — chỉ chọn theo thời gian).
- Điểm = **trung bình có trọng số** của 5 lần đó: `Σ(giá_trị × trọng_số_nguồn) / Σ(trọng_số_nguồn)`.
  Giá trị mỗi lần đo: Đúng=1 · Chưa đạt(nửa)=0.5 · Sai=0.
- Ngưỡng: **score ≥ 0.8 → Đạt** · **0.5 ≤ score < 0.8 → Cần luyện** · **score < 0.5 → Yếu**.
- **Độ tin cậy** (khác mastery thấp): dựa vào **tổng số lần đo** (n), không phải 5 lần dùng để tính điểm.
  n≥5 → tin cao · n=3-4 → tin TB · n≤2 → tin thấp.
- Dạng không có lần đo nào → **không tính** (không suy ra 0), hiển thị "chưa-đo".

---

## 3. Cấu trúc màn "Kết quả học tập" hiện tại

5 tab cấp cao nhất: **Từng học sinh · Theo buổi (raw) · Lớp / Khối · Theo dạng · Điểm thi**

### 3.1 Tab "Từng học sinh" — 3 sub-tab

**a) Tổng quan** — 3 vùng tách bạch:

- **① Hoàn thành bản đồ kiến thức** — mỗi card có **2 nửa bình đẳng** cùng cỡ chữ, có gạch ngang phân
  tách, cả 2 đều hiện đủ đạt/cần luyện/yếu:
  - Nửa trên = **chỉ ET + MT** (2 nguồn có giám sát).
  - Nửa dưới = trên + **BTVN + Bổ trợ** (nhãn "(+BTVN/Bổ trợ)") — mục đích: so 2 số cạnh nhau để soi
    **độ đáng tin của BTVN** (dạng chỉ có BTVN, không có ET/MT → nửa trên trống, nửa dưới có → lộ rõ
    "dạng chỉ tự-báo-cáo, chưa được kiểm chứng").
  - 5 card: **Toàn bộ · Đại số Cơ bản (độ khó 1-3) · Đại số Nâng cao (4-5) · Hình học Cơ bản · Hình học
    Nâng cao**. 2 card Hình hiện placeholder tĩnh "chưa có dữ liệu đo" (xem §4).
  - Trend (mũi tên ↑↓) chỉ tính cho card "Toàn bộ", so 30 ngày gần nhất vs 30 ngày trước đó.

- **② Chỉ số hoạt động** — 6 card gọn xếp 1 dòng ngang: **% đúng ET, BTVN, MT** × **Cơ bản, Nâng cao**
  (bucket theo độ khó của DẠNG chứa câu, KHÔNG phân biệt Đại/Hình trong 1 mức — gộp chung). Đây là
  **% ĐÚNG CÂU** (Đ+½C)/tổng câu, khác hẳn khái niệm điểm số ở vùng ③.

- **③ Chỉ số điểm** — 3 card:
  - **Điểm năng lực (kỳ vọng)** — placeholder, CHƯA có công thức (cần cấu trúc đề + đủ dạng đo gồm Hình).
  - **Điểm MT trung bình** — điểm SỐ (không phải %) nhập tay ở tab MT trong buổi học, xem §5.
  - **Điểm thi trường trung bình** — điểm SỐ nhập thủ công, xem §5.

**b) Dạng bài** — bảng chi tiết per-dạng (mức/điểm/độ tin/lịch sử 10 lần gần nhất), có toggle
"Cửa sổ" (Tất cả/30/60/90 ngày) + checkbox "Gộp BTVN". Nguồn dùng **giống hệt vùng ①** (chỉ ET+MT mặc
định, +BTVN/Bổ trợ khi bật toggle) — đã đồng bộ để khớp số với Tổng quan (trước 07-15 dùng công thức
khác, gây lệch số, đã sửa).
Khi ở môn Toán, có thêm khu "Theo nhánh × độ khó": Đại Cơ bản/Nâng cao (số thật) + Hình Cơ bản/Nâng cao
(placeholder).

**c) Lịch sử hoạt động** — nhật ký RAW theo buổi, tách thẻ theo loại hoạt động (Chấm bài/ET/Đánh giá/
BTVN/MT), không qua công thức mastery — chỉ để xem lại buổi nào đã làm gì.

### 3.2 Tab "Theo buổi (raw)"
Giống "Lịch sử hoạt động" nhưng scope theo LỚP thay vì 1 học sinh.

### 3.3 Tab "Lớp / Khối"
Rollup: mỗi HS 1 thanh 100% (kiểu "bộ nhớ iPhone") — bao nhiêu dạng đạt/cần luyện/yếu, lọc theo lớp/
khối/hệ (S/A/B/C). Dùng công thức mastery đối xứng với "Dạng bài" (đã đồng bộ 07-15).

### 3.4 Tab "Theo dạng"
Pivot: mỗi dạng (hoặc mỗi chuyên đề, gộp dạng) → bao nhiêu HS đạt/cần luyện/yếu trong 1 lớp/khối — trả
lời "dạng nào cả lớp đang yếu nhất". Có toggle **Tất cả/Cơ bản/Nâng cao** lọc theo độ khó (thêm 07-15).

### 3.5 Tab "Điểm thi" (mới, 07-15) — 2 sub-tab
- **Điểm thi trên trường** — bảng: Tên HS · Mã HS · Lớp · Trường · Giữa kì I · Cuối kì I · Giữa kì II ·
  Cuối kì II, filter lớp/khối + sort. Chỉ đọc.
- **Nhập điểm** — nơi nhập kì thi + điểm/verdict/vượt-band cho từng HS (chuyển từ "Quản lý Level" sang
  đây 07-15; "Quản lý Level" giờ chỉ xem, không nhập nữa).

---

## 4. Bản đồ kiến thức theo nhánh — hiện trạng Đại/Hình

- Toán có 2 nhánh: **Đại số** (`dai_ban_do`/`dai_cau_hoi` — có `muc_do` 1-5, có câu hỏi, gắn đủ ET/MT/
  BTVN) và **Hình học** (`hinh_ban_do` — **KHÔNG có cột `muc_do`, KHÔNG có bảng câu hỏi riêng**, chưa
  gắn vào bất kỳ pipeline ET/MT/BTVN/mastery nào).
- Hệ quả: mọi mastery/% hiện tại của môn "Toán" trên thực tế **chỉ phản ánh nhánh Đại số**. Hình học
  hoàn toàn vắng mặt trong số liệu (không phải bằng 0 — đơn giản là chưa được đo, UI hiện placeholder
  rõ ràng thay vì giả vờ có số).
- Đây là gap đã biết từ trước (ghi trong `ADR-mon.md` §5), không phải phát hiện mới trong đợt build này.

---

## 5. "Điểm" — khác với "% mastery/% đúng câu"

Có **2 khái niệm dễ nhầm cùng tên "MT"**:

1. **MT nội dung** (soạn ở "Làm tài liệu → MT", gán vào buổi, chấm Đ/C/S per câu) → nuôi mastery + %MT
   ở vùng ②. Không có điểm số tổng.
2. **Điểm MT** (§5.1) → 1 con số (ví dụ /10) nhập tay, tách biệt hoàn toàn khỏi (1), lưu vào hạ tầng
   `ky_thi`/`diem_thi` sẵn có (dùng chung với "sát hạch").

### 5.1 Điểm MT
- Nhập ngay trong tab MT của buổi học (nút "🔢 Điểm MT", cạnh chỗ chấm Đ/C/S) — độc lập hoàn toàn với
  việc chấm từng câu.
- Lưu vào bảng `diem_thi` (khoá theo `ky_thi_id` + `hoc_sinh_id`), với 1 `ky_thi` tự tạo
  `loai='mt_sat_hach'`, gắn `buoi_hoc_id` = buổi đó (để tab MT tự tìm lại đúng kỳ thi của mình).
- Vẫn cần nhập `verdict` (Đạt/Gần/Không) vì cột NOT NULL trong `diem_thi` — không dùng "vượt band"
  (khái niệm riêng của sát hạch xếp lớp).

### 5.2 Điểm thi trường
- Nhập thủ công qua tab "Điểm thi → Nhập điểm", `ky_thi.loai='truong'`, có `dot` ∈ {giữa kì I, cuối kì
  I, giữa kì II, cuối kì II} và `mua` (niên khoá).
- Xem tổng hợp ở tab "Điểm thi → Điểm thi trên trường" (view pivot theo đợt) HOẶC ở Tổng quan 1 HS
  (card "Điểm thi trường trung bình", TB tất cả các đợt).

### 5.3 Điểm năng lực (kỳ vọng)
- **Chưa xây** — placeholder tĩnh trong UI. Lý do treo: cần cấu trúc đề chuẩn hoá + đủ dữ liệu đo
  (gồm cả Hình học, hiện chưa có).

### 5.4 Hạ tầng liên quan khác (đã có, KHÔNG hiện trong "Kết quả học tập")
- **Level/Xu** (gamification) — `getLevelXu` trong `thanhtich.ts`, tính từ `diem_thi` (Σ điểm theo
  verdict×hệ số, windowed theo mùa) + `gami_exp_ledger`. Hiển thị ở màn "Quản lý Level" (view-only) và
  "Điểm số (Elo/EXP)" — KHÔNG xuất hiện trong màn Kết quả học tập.
- **Elo** — theo môn, cập nhật khi đóng phase MT (K=60) — chưa thấy hiển thị lại trong Kết quả học tập.

---

## 6. Bảng DB liên quan (tra nhanh)

| Bảng | Vai trò |
|---|---|
| `gami_grades` | Chấm Đ/C/S per câu (mọi phase: ingame/et/mt/btvn) |
| `buoi_danh_gia_dang` | Đánh giá GV theo dạng (đã loại khỏi mastery) |
| `bt_grades` | Chấm Bổ trợ tự luyện |
| `bai_lam_cau` / `bai_test_cau` | Test online (ET/BTVN/đề thi) |
| `dai_ban_do` / `khtn_ban_do` | Bản đồ kiến thức Đại số/KHTN (có `muc_do`) |
| `hinh_ban_do` | Bản đồ kiến thức Hình học (KHÔNG có `muc_do`, không có câu hỏi) |
| `ky_thi` / `diem_thi` | Điểm số nhập tay (MT sát hạch, thi trường, khảo sát tháng) + Level |
| `buoi_hoc` / `buoi_hoc_hs` | Buổi học, điểm danh, cờ đóng từng phase |

---

## 7. Khoảng trống / điểm chưa rõ đã biết (không kèm đề xuất — để brainstorm)

- Hình học không có dữ liệu đo → mọi số "Toán" hiện tại là số của riêng Đại số. Chưa quyết định: xây
  Hình đến mức nào, theo lộ trình gì.
- "Điểm năng lực" chưa có công thức — chưa rõ nó nên tổng hợp từ đâu (mastery? điểm MT? điểm trường?
  hay 1 con số hoàn toàn mới).
- 2 khái niệm "MT" (nội dung câu hỏi vs điểm số sát hạch) dùng chung chữ viết tắt — dễ gây nhầm khi
  giải thích cho người ngoài team hoặc phụ huynh.
- BTVN/Bổ trợ hiện đã tách khỏi mastery mặc định (chỉ vào khi bật toggle) — chưa có nơi nào hiển thị
  RÕ để phụ huynh/HS tự nhìn thấy phần "so sánh 2 số" này ngoài card ①.
- "Điểm thi trường" hiện chỉ có 4 mốc/năm (GK1/CK1/GK2/CK2) — không có cơ chế nào liên kết ngược lại
  với mastery theo dạng (không biết bài thi trường đó khảo sát dạng gì).
- KHTN có `muc_do` giống Đại số nhưng chưa từng được nhắc trong toàn bộ đợt build "Kết quả học tập"
  này — chưa rõ có cần đối xứng hoá UI (bảng theo nhánh Lý/Hoá/Sinh) như đã làm cho Toán hay không.
