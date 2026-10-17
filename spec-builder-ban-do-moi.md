# SPEC — Builder giáo trình theo BẢN ĐỒ MỚI 4 tầng

> **Trạng thái 17/10:** CEO đã chốt phần A (logic) + luật mã. CHƯA build. Phần B = kỹ thuật (CTO tự quyết theo R2).
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

### Bản đồ mới (`dai_bdm_*`, nhánh Đại + HGT)
- **Chủ đề** (theo khối) → **Chuyên đề** (dùng chung, qua ô `dai_bdm_o`) → **Nhóm bài** (KP, có `ly_thuyet`, `mo_ta`) → **Dạng bài** (có `ly_thuyet` + `vi_du`, `mo_ta`).
- Câu ↔ dạng bài: nguồn duy nhất `_bdm_cau_giai` (gán câu > gán cụm cũ > đối ứng ①) — **hiện chỉ đọc `dai_cau_hoi` (Đại)**. 6.388 câu gốc đã gán (AI, 17/10), còn hàng ✅ Duyệt kho.
- **Chưa B5 (Chuyển):** câu vẫn mang `dang_chinh` của bản đồ cũ.
- Độ đầy theo khối (nhánh Đại):

| Khối | Nhóm | Dạng bài | Nhóm có LT | Dạng bài có ví dụ |
|---|---|---|---|---|
| 6 · 7 · 9 · 10 · 11 | 44 · 24 · 42 · 19 · 30 | 85 · 49 · 78 · 62 · 100 | 44 · 17 · 25 · 19 · 30 | 85 · 49 · 75 · 62 · 100 |
| 8 | 26 | 61 | 9 | 56 |
| 12 (chỉ NH-TP chuẩn) | 79 | 57 | 36 | 40 |
| 3 · 4 · 5 · 4T · 5T · 8T | 23–82 | **0 hoặc ≈10** | một phần | 0 |

---

## A. LOGIC — CEO ĐÃ CHỐT 17/10

### A0. Luật mã (CEO 17/10)
> *"Logic không đổi mã là đi theo câu hỏi thôi, vì mọi dữ liệu đánh giá trỏ về câu hỏi. Mã chủ yếu để tạo ra sự duy nhất."*
- **Danh tính dữ liệu = CÂU.** Đo lường, mastery, đánh giá đều trỏ `ma_cau`; nhóm/dạng bài của một lần đo = nhóm/dạng bài **hiện tại** của câu (spec bản đồ §10).
- **Mã nhóm / dạng bài chỉ để duy nhất:** cấp 1 lần lúc sinh (`NNB…`/`NDB…`), không bao giờ đổi, không cấp lại, không "nhận lại mã cũ" lúc B5.
- Giáo trình lưu **câu** là chính; id nhóm/dạng bài trong giáo trình chỉ để dựng khung buổi và in.

### A1. Chọn vào buổi: NHÓM là chính, vẫn chọn được DẠNG BÀI lẻ
- Chọn **nhóm** ⇒ mặc định mọi dạng bài của nhóm theo `thu_tu` bản đồ; bỏ tick dạng bài không dạy.
- Chọn **dạng bài lẻ** (kể cả từ nhiều nhóm khác nhau trong cùng buổi) ⇒ nhóm của nó hiện trong buổi, chỉ với các dạng bài được chọn.
- Hai cách là một kiểu dữ liệu (B1): buổi = các nhóm, mỗi nhóm = tập dạng bài được chọn.
- Nhóm chưa có dạng bài (K3–5, 8T…) chọn được, chạy như builder cũ (câu lấy cả nhóm).

### A2. Bài luyện theo DẠNG BÀI, BTVN theo NHÓM BÀI
- **Bài luyện:** mỗi dạng bài một khối câu (mặc định 2 câu/dạng bài, chỉnh được).
- **BTVN:** mỗi nhóm một khối; máy rải câu đều qua các dạng bài đã chọn của nhóm, né câu đã luyện cùng buổi.
- Câu **chưa phân dạng bài** của nhóm: không tự vào bài luyện; chọn tay được (nhãn "chưa phân").

### A3. Bản in một buổi — KHÔNG còn chuyên đề
```
Nhóm bài: LÝ THUYẾT nhóm
  Dạng bài 1: LÝ THUYẾT dạng bài → VÍ DỤ → Bài luyện
  Dạng bài 2: …
Nhóm bài kế tiếp …
BTVN (phiếu riêng như cũ): theo nhóm, câu xếp theo dạng bài
```
- Chỉ còn **lý thuyết nhóm bài + lý thuyết/ví dụ dạng bài**. Không in tên, mô tả hay lý thuyết chuyên đề; builder cũng không hiện chuyên đề trong thẻ buổi.
- Chuyên đề chỉ còn trong **bộ chọn** (để tìm nhóm theo đúng chỗ trên bản đồ).
- Bật/tắt in: lý thuyết nhóm · lý thuyết dạng bài · ví dụ — từng mục.
- Số hiển thị (Nhóm 2, Dạng bài 2.3, Câu 5) suy lúc in, không lưu.

### A4. Giáo trình MỚI tạo bằng builder mới · giáo trình CŨ CHUYỂN QUA để lưu trữ
- Tạo mới: luôn theo bản đồ mới.
- **87 giáo trình cũ: chuyển sang khuôn mới làm bản LƯU TRỮ** — CEO: mastery đằng nào cũng làm lại theo câu, nên chuyển theo câu là đủ, không phải đoán nhóm.
- Bản lưu trữ: xem/in/nhân bản thành giáo trình mới được; không soạn tiếp trên nó.
- Giáo trình gốc cũ **giữ nguyên, không xoá** (Luật xoá — gỡ builder cũ và bản gốc là việc riêng, hỏi lúc đó).
- Tài liệu vận hành đã trích theo ngày (`giao_trinh_buoi` 710, `btvn` 719) **không chuyển** — đã gắn ngày dạy và kết quả chấm, đo vẫn đi theo câu.

### A5. Phạm vi mở
- Đầy đủ: **K6 · K7 · K8 · K9 · K10 · K11 + K12 chủ đề NH-TP**. Khối khác chọn được tới nhóm bài.
- HGT (K10, K12) đợt 2 — câu HGT chưa nối được vào bản đồ mới. Hình–Học / Hình–Luyện giữ builder Hình riêng.

---

## B. KỸ THUẬT — CTO tự quyết (R2)

### B1. Lưu trữ: thêm loại phần, KHÔNG đổi nghĩa `ref_ma` cũ
| `loai_phan` | `ref_ma` | Câu |
|---|---|---|
| `buoi` | — | — (như cũ) |
| `nhom` *(mới)* | id nhóm (`NNB…`) | không |
| `dang_bai` *(mới)* | id dạng bài (`NDB…`) | câu luyện |
| `nhom_chua_phan` *(mới)* | id nhóm | câu luyện chưa có dạng bài (chọn tay / từ chuyển đổi) |
| `btvn_nhom` *(mới)* | id nhóm | câu BTVN |
| `chua_khop` *(mới, chỉ bản chuyển đổi)* | — | câu cũ chưa ra được nhóm bản đồ mới |
- Cột mới trên `tai_lieu`: `ban_do text not null default 'cu' check (ban_do in ('cu','moi'))` · `luu_tru_tu uuid references tai_lieu(id)` (có = bản lưu trữ chuyển từ giáo trình cũ này; NULL = không áp dụng). Builder dispatch theo `ban_do`; trích xuất chép `ban_do` sang tài liệu vận hành.
- `loai_phan` không có CHECK (đã kiểm) ⇒ không cần migration cho giá trị mới; **phải sửa mọi chỗ lọc `'dang'`/`'btvn'`** (B4).
- Cấu hình in theo `ma_cau` (cột, dòng, cỡ ảnh, chế độ hình) **dùng lại nguyên**.
- Một câu không xuất hiện 2 lần trong cùng buổi (giữ luật cũ, kiểm ở RPC ghi).

### B2. Chuyển giáo trình cũ (A4) — theo câu
- Mỗi giáo trình cũ (nhánh Đại) ⇒ 1 bản mới `ban_do='moi'`, `luu_tru_tu = <id cũ>`, giữ tên + buổi + thứ tự buổi + `cau_hinh`.
- Trong mỗi buổi: mỗi câu luyện → dạng bài của câu (`_bdm_cau_giai`) → nhóm. Gom thành `nhom` → `dang_bai`; thứ tự nhóm = thứ tự xuất hiện đầu tiên của câu trong buổi cũ.
- Câu ra được nhóm nhưng chưa có dạng bài ⇒ `nhom_chua_phan`. Câu không ra nhóm ⇒ `chua_khop` (giữ nguyên, **không bỏ câu nào**, §1.5).
- Câu BTVN ⇒ `btvn_nhom` theo nhóm của câu (chưa khớp ⇒ `chua_khop`).
- Kiểm bắt buộc: **số câu mỗi buổi trước = sau**; báo cáo số câu `chua_khop` theo giáo trình. Chạy ROLLBACK trước, ghi khi CEO xem báo cáo.
- Giáo trình nhánh HGT / Hình học: chuyển ở đợt 2 (cùng lúc mở HGT).

### B3. Hàm DB (CLAUDE.md §2.0 — client chỉ gọi)
| Hàm | Việc |
|---|---|
| `fn_tl_bdm_cay_chon(khoi, nhanh)` | cây chọn: chủ đề → ô → nhóm → dạng bài, kèm số câu dùng được/dạng bài, có LT/ví dụ (tái dùng `fn_bdm_cay`) |
| `fn_tl_bdm_cau(dang_bai_ids, nhom_id)` | kho câu theo dạng bài (qua `_bdm_cau_giai`) + "chưa phân" của nhóm, kèm số lần dùng; cùng bộ lọc kho chuẩn như `listCauByDang` hiện nay (kiểm lúc build) |
| `fn_tl_bdm_goi_y(tai_lieu, buoi, …)` | gợi ý câu luyện/BTVN: ít dùng nhất, ưu tiên câu gốc, rải nguồn, né câu cùng buổi — **chuyển xếp hạng từ JS xuống DB** (builder cũ tính ở client, vi phạm §2.0) |
| `fn_tl_bdm_dat_buoi(buoi, chon jsonb)` | RPC 1 transaction: đặt tập nhóm + dạng bài của buổi (A1 cả 2 cách), sinh phần + gợi ý câu, sắp thứ tự |
| `fn_tl_bdm_noi_dung(tai_lieu, buoi?)` | resolver cho in/preview: LT nhóm, LT + ví dụ dạng bài, câu |
| `fn_tl_bdm_chuyen_luu_tru(tai_lieu_cu)` | B2, trả báo cáo trước/sau |

### B4. Bên dùng phải sửa (KP suy từ CÂU — A0)
- `tailieu.ts`: `getTaiLieuFull`, `trichXuatBuoi`, `layCauTheoThuTu`, `getGiaoTrinhBuoiCaus`.
- `PrintView.tsx` (nhánh in A3) · `ontap.ts` (dạng đã học suy từ câu) · `gami.ts:825` (đánh giá đọc phần `'dang'`) · `testonline.ts` · màn Kho tài liệu (lọc/nhãn bản lưu trữ).
- Grep bắt buộc trước khi build: `loai_phan` trong `src/` + `pg_proc.prosrc` có `tai_lieu_phan`.

### B5. Màn
- Khung giữ như cũ: thanh trên · cây trái (Buổi → Nhóm → Dạng bài) · thẻ buổi phải · tự lưu · Trích xuất/Gán lớp · Xem/Xuất PDF.
- **Bộ chọn** thay `DangPicker`: popup gần full màn — chủ đề (ô tìm-chọn, không dropdown) → cột chuyên đề → hộp nhóm có chip dạng bài (số câu, ✓LT/✓VD). Bấm hộp nhóm = chọn cả nhóm; bấm chip = chọn dạng bài lẻ. Ô tìm theo tên nhóm/dạng bài xuyên chủ đề. Dùng lại cách vẽ của `BanDoMoi.tsx`.
- **Thẻ nhóm** trong buổi: LT nhóm (bật/tắt) → dạng bài (tick, ▲▼, LT/VD bật/tắt, Bài luyện + ↻ Gợi ý / ✎ Chọn câu) → BTVN nhóm.
- Bản lưu trữ: mở chế độ chỉ xem, nút "Nhân bản thành giáo trình mới"; khối `chua_khop` tô vàng.
- Sau mỗi thao tác **vá đúng thẻ**, không tải lại cả buổi (CLAUDE.md §2 React). Nhớ buổi đang mở + vị trí cuộn khi rời màn.

### B6. Thứ tự làm
| Bước | Việc | Xong khi |
|---|---|---|
| 1 | Migration: 2 cột `tai_lieu` + hàm B3 (trừ chuyển đổi) + test ROLLBACK | `npm run schema` sạch, test đủ |
| 2 | Bộ chọn + thẻ nhóm/dạng bài + tự lưu | soạn 1 buổi K7 thật trên app local, có cả nhóm trọn và dạng bài lẻ từ 2 nhóm |
| 3 | In/preview A3 | PDF buổi K7 đúng LT nhóm → LT dạng bài → ví dụ → luyện, không có chuyên đề |
| 4 | Trích xuất + ôn tập + đánh giá + test online (B4) | gán 1 lớp thử, app GV hiện đủ câu, ôn tập ra đúng nhóm |
| 5 | Chuyển 87 giáo trình cũ (B2) | số câu trước = sau; báo cáo `chua_khop` gửi CEO |
| 6 | Mở HGT qua registry + chuyển giáo trình HGT | câu HGT có trong `_bdm_cau_giai` bản HGT |

---

## Đứng trên vai (R7)
- **Worked-example → faded practice** (Sweller, Renkl): in theo nhịp ví dụ dạng bài → luyện cùng kiểu.
- **Interleaving** (Rohrer): BTVN theo nhóm, trộn các dạng bài — chống làm theo khuôn.
- **Surrogate key** (khoá thay thế, Codd/Date): mã chỉ để duy nhất, không mang nghĩa; danh tính nghiệp vụ nằm ở câu.
- **Expand–contract** (Fowler): builder mới chạy song song, builder cũ gỡ sau.
