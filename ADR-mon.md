# ADR — Kiến trúc theo MÔN: mỗi môn là một TRUNG TÂM riêng

> Trạng thái: **ĐỀ XUẤT** (Thùy định hướng 06-29). Paste lên Notion (con của *ADR Chiều Môn*).
> **Thay thế** bản "hợp nhất 1 bảng chung" — đã BÁC BỎ (ép content khác môn vào 1 bảng = rủi ro, không lợi).

---

## 1. Nguyên tắc gốc

**1 môn = 1 TRUNG TÂM riêng (bounded context).**
- 4 môn (Toán, KHTN, Văn, Anh) = **4 trung tâm độc lập, BẢN CHẤT NHƯ NHAU (đối xứng)**.
- Chúng chỉ **chung một số HỌC SINH + một phần QUY TRÌNH VẬN HÀNH**. **KHÔNG chung content (kho tri thức).**
- Các môn **được phép khác cấu trúc** — không có gì đảm bảo giống nhau. Ép giống = sai lệch 1 tý là phiền, rủi ro > lợi.
- Thêm môn = **mở chiều RỘNG** (thêm 1 trung tâm), KHÔNG nhồi sâu vào 1 schema chung.

---

## 2. Hai tầng tách bạch + LUẬT NHÃN MÔN

**⭐ LUẬT (Thùy chốt): MỌI dữ liệu HỌC TẬP phải mang nhãn `mon`.** Việc học gắn với từng môn — không có "đo/điểm/Elo chung chung", chỉ có "của môn X". **Chỉ dữ liệu KHÔNG-học-tập mới chung** (không nhãn môn): thông tin cá nhân HS, phụ huynh, ví xu, tài khoản…

| Tầng | Phạm vi | `mon` |
|---|---|---|
| **CONTENT (kho)** — cây dạng · câu · lý thuyết | **RIÊNG từng môn/nhánh** (bảng riêng, tự cấu trúc) | Khoá định danh trung tâm |
| **HỌC TẬP dùng-chung-thực-thể** — buổi · điểm danh · chấm · ET · BTVN · đo/mastery · Elo · EXP · sát hạch/Level | Thực thể chung NHƯNG **mỗi DÒNG có nhãn `mon`** | **Bắt buộc có `mon`** |
| **PHI-HỌC-TẬP** — HS (cá nhân) · PH · ví xu · tài khoản | **CHUNG, KHÔNG nhãn môn** | — |

- **Cầu nối:** dữ liệu học tập tham chiếu content bằng **(mã `ma_dang`/`ma_cau` + `mon`)** — mã là con trỏ; `mon` cho biết tra ở trung tâm nào. Mã giữ ổn định, không đụng khi thêm môn.
- **Hệ quả phải sửa:** ref vận hành đang lưu **mã trần không kèm môn** (`gami_session_problems.ma_dang`, `canh_bao_yeu.ma_dang`, `tai_lieu_cau.ma_cau`…) → **bổ sung `mon`** để khỏi đoán/union khi tra.

---

## 3. Nhãn 2 tầng: (môn, nhánh)

- Mỗi trung tâm môn có **≥2 nhánh**: **Toán** {Đại, Hình} · **KHTN** {Lý, Hóa, Sinh} · Văn {…} · Anh {…}.
- `nhanh` = tầng phân loại **CAO NHẤT** trong cây dạng của môn. Catalog 1 môn = **nhánh → chủ đề → chuyên đề → dạng**.

---

## 4. Hệ quả thiết kế

- Mỗi môn: **bộ bảng content riêng** (catalog dạng + câu + lý thuyết), gắn nhãn `mon` + `nhanh`. ~4 bảng/môn × 4 môn = ~16 bảng → **bình thường** (đó là 4 trung tâm, không phải "phình").
- **⭐ ĐỐI XỨNG TUYỆT ĐỐI = tiêu chí đúng (symmetry test):** mọi thao tác/màn chạy trên Toán phải chạy **y hệt** trên KHTN/Văn/Anh. **KHÔNG hardcode 1 môn.** Code thấy `if mon === 'Toán'` đặc biệt = sai.
- **Dispatch "môn → bộ bảng của môn nó" = 1 REGISTRY DUY NHẤT** (1 nguồn), không rải rác. Thêm môn = thêm 1 entry registry + tạo bộ bảng. Vận hành/đo lường KHÔNG đổi.

---

## 5. Hiện trạng vs nguyên tắc (audit 06-29)

- ✅ **Đúng sẵn:** kho per-môn (dai_/khtn_ tách bảng); `mon` chuẩn hoá nhãn 'Toán'/'KHTN' ở vận hành (mig 0058); Elo/đo per-môn (0041).
- ⚠ **Lệch 1 — Toán đang "đặc biệt":** Đại & Hình bị tách thành **2 họ bảng** (`dai_*` vs `hinh_*`) **như thể 2 môn** — nhưng chúng là **2 NHÁNH của 1 trung tâm Toán**. Vi phạm đối xứng (Toán 2 họ bảng, KHTN 1). → quy về: 1 trung tâm Toán, nhánh = nhãn.
- ⚠ **Lệch 2 — dispatch rải rác:** mapping môn→bảng lặp ở ≥4 nơi / 13 file (`branches.ts`, `tailieu.khoCuaMon`, `KhoScreen.MON_TABS`, `DangPickerOne`). → gom **1 registry**.
- 🔓 **Mở (giải khi build):** **độ sâu Đại vs Hình** — Đại đơn vị **Câu**, Hình đơn vị **Bài/Ý**. Cần chốt: đây là 2 content-type khác nhau TRONG cùng trung tâm Toán (mỗi nhánh có thể có schema nội dung riêng) hay chỉ là di sản lịch sử. (Thùy 06-29: "trông giống nhau, bản chất 4 môn như nhau" → nghiêng quy về 1 trung tâm Toán có nhánh.)

---

## 6. KHÔNG làm
- ❌ KHÔNG gộp `dai_*` + `khtn_*` vào 1 bảng chung scope `mon`. (Bác bỏ.)
- ❌ KHÔNG hardcode môn nào trong code dùng chung — luôn qua registry + `(mon, nhanh)`.
