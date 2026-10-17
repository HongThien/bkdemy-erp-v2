# SPEC (NHÁP, chờ CEO duyệt) — Builder giáo trình theo BẢN ĐỒ MỚI 4 tầng

> **Trạng thái 17/10:** đề xuất của CTO, CHƯA build. Phần A = logic cần CEO chốt. Phần B = kỹ thuật (CTO tự quyết theo R2).
> Đọc kèm: `spec-ban-do-4-tang.md` (bản đồ mới) · builder cũ `src/screens/tailieu/TaiLieuBuilder.tsx` + `src/lib/tailieu.ts`.
> Số liệu đo DB live 17/10 (chỉ đọc).

---

## 0. Hiện trạng (đọc xong 2 phía)

### Builder cũ (đang chạy, 87 giáo trình, 61 cái sửa trong 30 ngày)
- Giáo trình = danh sách **Buổi**. Mỗi buổi chọn N **dạng** (bản đồ cũ `dai_ban_do.ma_dang`), phẳng, theo thứ tự bấm.
- Mỗi dạng = 2 khối: **Bài luyện** (trên lớp) + **BTVN** (về nhà), câu gợi ý theo số lượng mỗi loại (TN/TLN/TL), né câu trùng trong buổi.
- Lưu: `tai_lieu_phan` (`buoi` → `dang`/`btvn`, `ref_ma = ma_dang`) + `tai_lieu_cau` (mã câu). Cấu hình in (cột, số dòng, cỡ ảnh, chế độ hình) theo `ma_cau` trong `cau_hinh`.
- In: LT chuyên đề (suy từ dạng) → LT dạng → câu luyện; BTVN tách phiếu riêng.
- Sau builder: **Trích xuất/Gán lớp** → `giao_trinh_buoi` + `btvn` theo ngày → Ôn tập (`ontap.ts`) → app GV live / đánh giá (`gami.ts`) / test online.
- Bộ chọn dạng `DangPicker` hiện 2 tầng (chuyên đề → dạng) — **không có chỗ cho tầng 4**.

### Bản đồ mới (`dai_bdm_*`, nhánh Đại + HGT)
- **Chủ đề** (theo khối) → **Chuyên đề** (dùng chung, qua ô `dai_bdm_o`) → **Nhóm bài** (KP, có `ly_thuyet`, `mo_ta`) → **Dạng bài** (có `ly_thuyet` + `vi_du`, `mo_ta`).
- Chuyên đề chỉ có `mo_ta`, **không có ô lý thuyết**.
- Câu ↔ dạng bài: nguồn duy nhất `_bdm_cau_giai` (gán câu > gán cụm cũ > đối ứng ①) — **hiện chỉ đọc `dai_cau_hoi` (Đại)**. 6.388 câu gốc đã gán (AI, 17/10), còn hàng ✅ Duyệt kho.
- **Chưa B5 (Chuyển):** câu vẫn mang `dang_chinh` của bản đồ cũ, mastery vẫn đo theo nhóm cũ (đi theo câu, §10).
- Độ đầy theo khối (nhánh Đại):

| Khối | Nhóm | Dạng bài | Nhóm có LT | Dạng bài có ví dụ |
|---|---|---|---|---|
| 6 · 7 · 9 · 10 · 11 | 44 · 24 · 42 · 19 · 30 | 85 · 49 · 78 · 62 · 100 | 44 · 17 · 25 · 19 · 30 | 85 · 49 · 75 · 62 · 100 |
| 8 | 26 | 61 | 9 | 56 |
| 12 (chỉ NH-TP chuẩn) | 79 | 57 | 36 | 40 |
| 3 · 4 · 5 · 4T · 5T · 8T | 23–82 | **0 hoặc ≈10** | một phần | 0 |

---

## A. LOGIC — CEO chốt

### A1. Đơn vị chọn vào buổi = NHÓM BÀI, bên trong tick DẠNG BÀI
- Buổi chọn N **nhóm bài** (như chọn "dạng" cũ — nhóm chính là KP). Chọn nhóm ⇒ mặc định **mọi dạng bài** của nhóm theo `thu_tu` bản đồ; GV bỏ tick dạng bài không dạy hôm nay.
- Lý do: KP đo ở nhóm (Q2) nên buổi phải bám nhóm; dạng bài là "ví dụ + bài luyện theo kiểu" bên trong (Q3).
- Nhóm chưa có dạng bài (K3–5, 8T…) vẫn chọn được, chạy như builder cũ (câu lấy cả nhóm).

### A2. Bài luyện theo DẠNG BÀI, BTVN theo NHÓM
- **Bài luyện:** mỗi dạng bài một khối câu (mặc định 2 câu/dạng bài, chỉnh được) — học theo đúng nhịp ví dụ → luyện.
- **BTVN:** một khối/nhóm, máy rải câu đều qua các dạng bài đã tick, né câu đã luyện cùng buổi.
- Câu **chưa phân dạng bài** của nhóm: không tự vào bài luyện; chọn tay được (nhãn "chưa phân").

### A3. Bản in một buổi
```
Tên chuyên đề (chỉ tiêu đề — bản đồ mới không có lý thuyết chuyên đề)
  Nhóm bài: LÝ THUYẾT nhóm
    Dạng bài 1: lý thuyết dạng bài → VÍ DỤ → Bài luyện
    Dạng bài 2: …
BTVN (phiếu riêng như cũ): theo nhóm, câu xếp theo dạng bài
```
- Bật/tắt in: lý thuyết nhóm · lý thuyết dạng bài · ví dụ — từng mục (như ô "Lý thuyết" cũ).
- Số hiển thị (Nhóm 2, Dạng bài 2.3, Câu 5) suy lúc in, không lưu (luật mã gốc).

### A4. Giáo trình cũ giữ nguyên, builder mới cho giáo trình TẠO MỚI
- 87 giáo trình cũ mở bằng builder cũ (không chuyển — tham chiếu nhóm cũ, chuyển là đoán).
- Tạo giáo trình mới ⇒ chọn "theo bản đồ mới" (mặc định khi khối/chủ đề đã chuẩn). Một giáo trình chỉ theo **một** bản đồ, không trộn.
- Builder cũ không thêm tính năng; gỡ khi không còn giáo trình cũ đang dạy (Luật xoá — hỏi lúc đó).

### A5. Phạm vi mở
- Mở cho chủ đề có dạng bài: **K6 · K7 · K8 · K9 · K10 · K11 + K12 chủ đề NH-TP**. Khối khác chọn được tới nhóm bài.
- HGT (K10, K12) mở ở đợt 2 — câu HGT chưa nối được vào bản đồ mới. Hình–Học / Hình–Luyện giữ builder Hình riêng.

### Câu hỏi CEO (đích, không phải kỹ thuật)
1. A1 — chọn **nhóm** rồi tick dạng bài, hay chọn thẳng **dạng bài** lẻ từ nhiều nhóm?
2. A2 — BTVN theo nhóm (đề xuất) hay theo từng dạng bài?
3. A3 — chuyên đề in **tên** thôi, hay CEO muốn thêm ô lý thuyết chuyên đề vào bản đồ mới?
4. A4 — đồng ý giáo trình cũ để nguyên, không chuyển?

---

## B. KỸ THUẬT — CTO tự quyết (R2)

### B1. Lưu trữ: thêm 2 loại phần, KHÔNG đổi nghĩa `ref_ma` cũ
| `loai_phan` | `ref_ma` | Câu |
|---|---|---|
| `buoi` | — | — (như cũ) |
| `nhom` *(mới)* | id nhóm bản đồ mới (`NNB…`) | không |
| `dang_bai` *(mới)* | id dạng bài (`NDB…`) | câu luyện |
| `btvn_nhom` *(mới)* | id nhóm | câu BTVN |
- Cột mới `tai_lieu.ban_do text not null default 'cu' check (ban_do in ('cu','moi'))` — kèm migration nới CHECK, dispatch builder theo cột này. Trích xuất chép cột sang `giao_trinh_buoi`/`btvn`.
- `loai_phan` không có CHECK (đã kiểm) ⇒ không cần migration cho giá trị mới; **phải sửa mọi chỗ lọc `'dang'`/`'btvn'`** (B4).
- Cấu hình in theo `ma_cau` (cột, dòng, cỡ ảnh, chế độ hình) **dùng lại nguyên**.

### B2. ⚠ Ràng buộc với B5 — id bản đồ mới phải BẤT BIẾN
- Spec bản đồ §0 ghi B5 "nhóm mới **nhận lại mã nhóm cũ**" ⇒ đổi id ⇒ giáo trình mới trỏ vào id mồ côi. Trái luật mã gốc (CEO 14/10).
- Đề xuất: B5 **giữ id `NNB`/`NDB`**, ghi đối ứng KP sang cột riêng (vd `dai_bdm_nhom.ma_dang_kp`), không đổi khoá. Cần sửa `spec-ban-do-4-tang.md` §0/§11 trước khi build B1 này.

### B3. Hàm DB (CLAUDE.md §2.0 — client chỉ gọi)
| Hàm | Việc |
|---|---|
| `fn_tl_bdm_cay_chon(khoi, nhanh)` | cây chọn: chủ đề → ô → nhóm → dạng bài, kèm số câu dùng được/dạng bài, có LT/ví dụ (tái dùng `fn_bdm_cay`) |
| `fn_tl_bdm_cau(dang_bai_ids, nhom_id)` | kho câu theo dạng bài (qua `_bdm_cau_giai`) + "chưa phân" của nhóm, kèm số lần dùng; cùng bộ lọc kho chuẩn như `listCauByDang` hiện nay (kiểm lúc build) |
| `fn_tl_bdm_goi_y(tai_lieu, buoi, ...)` | gợi ý câu luyện/BTVN: ít dùng nhất, ưu tiên câu gốc, rải nguồn, né câu cùng buổi — **chuyển xếp hạng từ JS xuống DB** (builder cũ tính ở client, vi phạm §2.0) |
| `fn_tl_bdm_dat_nhom(buoi, nhom_ids[], dang_bai_tick)` | RPC 1 transaction: thêm/bỏ nhóm, sinh phần + gợi ý câu, sắp thứ tự (thay `setDangOfBuoi` nhiều lượt gọi) |
| `fn_tl_bdm_noi_dung(tai_lieu, buoi?)` | resolver cho in/preview: LT nhóm, LT + ví dụ dạng bài, câu |

### B4. Bên dùng phải sửa (KP suy từ CÂU, theo §10 "đi theo câu")
- `tailieu.ts`: `getTaiLieuFull`, `trichXuatBuoi`, `layCauTheoThuTu`, `getGiaoTrinhBuoiCaus`.
- `PrintView.tsx` (nhánh in mới theo A3) · `ontap.ts` (dạng đã học = nhóm cũ suy từ `dang_chinh` của câu) · `gami.ts:825` (đánh giá đọc phần `'dang'`) · `testonline.ts`.
- Grep bắt buộc trước khi build: `loai_phan` trong `src/` + `pg_proc.prosrc` có `tai_lieu_phan`.

### B5. Màn
- Khung giữ như cũ: thanh trên · cây trái (Buổi → Nhóm → Dạng bài) · thẻ buổi phải · tự lưu · Trích xuất/Gán lớp · Xem/Xuất PDF.
- **Bộ chọn nhóm** thay `DangPicker`: popup gần full màn — chủ đề (ô tìm-chọn, không dropdown) → cột chuyên đề → hộp nhóm có chip dạng bài (số câu, ✓LT/✓VD), tick nhóm = tick mọi dạng bài. Dùng lại cách vẽ của `BanDoMoi.tsx`.
- **Thẻ nhóm** trong buổi: LT nhóm (bật/tắt) → danh sách dạng bài (tick, ▲▼, LT/VD bật/tắt, khối Bài luyện + ↻ Gợi ý / ✎ Chọn câu) → khối BTVN nhóm.
- Sau mỗi thao tác **vá đúng thẻ**, không tải lại cả buổi (CLAUDE.md §2 React). Nhớ buổi đang mở + vị trí cuộn khi rời màn.

### B6. Thứ tự làm
| Bước | Việc | Xong khi |
|---|---|---|
| 0 | CEO chốt A1–A4 + sửa B5 bản đồ (B2) | spec này hết chữ NHÁP |
| 1 | Migration: cột `ban_do` + 5 hàm B3 + test ROLLBACK | `npm run schema` sạch, test đủ |
| 2 | Bộ chọn nhóm + thẻ nhóm/dạng bài + tự lưu | soạn 1 buổi K7 thật trên app local |
| 3 | In/preview A3 | PDF buổi K7 đúng thứ tự LT → ví dụ → luyện |
| 4 | Trích xuất + ôn tập + đánh giá + test online (B4) | gán 1 lớp thử, app GV hiện đủ câu, ôn tập ra đúng nhóm |
| 5 | Mở HGT qua registry | câu HGT có trong `_bdm_cau_giai` bản HGT |

---

## Đứng trên vai (R7)
- **Worked-example → faded practice** (Sweller, Renkl): in theo nhịp ví dụ dạng bài → luyện cùng kiểu là đúng hiệu ứng ví dụ mẫu.
- **Interleaving** (Rohrer): BTVN theo nhóm, trộn các dạng bài — chống làm theo khuôn.
- **Expand–contract** (Fowler): builder mới chạy song song, builder cũ gỡ sau.
