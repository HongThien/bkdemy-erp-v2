# Đánh giá cuối cấp — đo theo LẦN, xu hướng mềm

> Trạng thái: Thùy duyệt 23/10/2026. **Hàm DB đã áp** (mig `202610231549_danh_gia_cuoi_cap`). **Màn đã có** (leaf `db_cuoicap`, Quản lý chất lượng).
> Là **một màn nhìn THÊM** — mastery hiện tại (`fn_mastery_cells`, đạt/yếu theo câu) giữ nguyên, bổ trợ vẫn chạy trên mastery cũ.

---

## 1. Đích

Lớp cuối cấp cần thấy **em đang lên hay xuống** ở từng mảng kiến thức qua thời gian dài, không bị một bài nhiều câu
lấn át. Đơn vị đo = **một LẦN làm bài**, không phải một câu.

**Phạm vi HS:** lớp **5T**, khối **9**, khối **12** (môn Toán — xem §6 câu hỏi về Hình).
**Phạm vi thời gian:** chỉ năm học này — lần có ngày **≥ 15/06/2026**.

---

## 2. Luật đã chốt

| # | Luật | Chốt |
|---|---|---|
| L1 | **Một lần = một bài làm**: 1 BTVN / 1 ET / 1 MT / 1 khảo sát / 1 test bổ trợ. Cùng ngày làm BTVN + ET ⇒ 2 lần. | Thùy 23/10 |
| L2 | **Mỗi tầng tự gộp lần của mình.** 1 BTVN rải câu vào 3 chuyên đề cùng chủ đề ⇒ tầng chủ đề 1 lần (gộp mọi câu), tầng chuyên đề 3 lần. Tầng càng cao tích lũy lần chậm hơn nhưng trải thời gian dài hơn. | Thùy 23/10 |
| L3 | **% của một lần** = số câu đúng / số câu của lần đó **thuộc nút đang xét**. **Không trọng số**: mọi lần ngang nhau (1 câu hay 10 câu), không trọng số theo nguồn (MT = ET = BTVN). | Thùy 23/10 |
| L4 | **Lần 1 câu vẫn tính** (ra 0% hoặc 100%), không đặt số câu tối thiểu. | Thùy 23/10 |
| L5 | **Nguồn = bài chính quy:** ET · MT · khảo sát · BTVN · test bổ trợ. **KHÔNG** tính: tự luyện app, game, phần luyện của bổ trợ, **retest** (đã bỏ hẳn). | Thùy 23/10 |
| L6 | **Cửa sổ theo tầng** (tạm, xem rồi sửa): Chủ đề **5/10** · Chuyên đề **5/10** · Nhóm bài **3/5**. | Thùy 23/10 |

---

## 3. Xu hướng (dual moving average — trung bình ngắn so với trung bình dài)

- **TB ngắn** = trung bình % của *ngắn* lần gần nhất; **TB dài** = trung bình % của *dài* lần gần nhất.
  Cửa sổ ngắn **nằm trong** cửa sổ dài (chồng lấn) — cố ý cho mềm, chống nhiễu, giống đường MA trên biểu đồ tài chính.
- **Chênh = TB ngắn − TB dài** (điểm %):

  | Chênh | Nhãn |
  |---|---|
  | > +10 | ↑↑ tăng rõ |
  | +3 … +10 | ↑ tăng nhẹ |
  | −3 … +3 | → đi ngang |
  | −10 … −3 | ↓ giảm nhẹ |
  | < −10 | ↓↓ giảm rõ |

- **Chưa đủ lần:**
  - số lần **≤ cửa sổ ngắn** ⇒ **không hiện xu hướng**, ghi "chưa đủ lần" (TB ngắn trùng TB dài ⇒ "đi ngang" giả).
  - cửa sổ ngắn < số lần < cửa sổ dài ⇒ TB dài lấy **hết số lần đang có** (vd 7 lần, cửa sổ 5/10 ⇒ so TB5 với TB7).
- Màn luôn hiện kèm **số lần** (độ phủ) cạnh TB — ít lần ≠ yếu (CLAUDE.md §5).

---

## 4. Hiện thực kỹ thuật (CTO tự quyết — R2)

**Tầng bản đồ** (bản đồ mới): Chủ đề `dai_bdm_chu_de` (NCD) → Chuyên đề `dai_bdm_chuyen_de` (NCH, nối qua `dai_bdm_o`)
→ Nhóm bài `dai_bdm_nhom` (NNB) → Dạng bài `dai_bdm_dang_bai` (NDB).
Mỗi câu quy về **dạng bài** bằng `_do_o_bdm` (cùng hàm mastery bản đồ mới đang dùng) rồi **cuộn lên** nhóm → chuyên đề → chủ đề.
Câu chưa quy được ⇒ bỏ khỏi lần đó (không đoán — §1.5). Lần mà không còn câu nào thuộc nút ⇒ không thành lần ở nút đó.

**Nguồn & khoá của một lần:**

| Nguồn | Bảng | Khoá "một lần" | Ngày của lần |
|---|---|---|---|
| ET · MT · BTVN chấm tay (kể cả buổi bù) | `gami_grades` ⨝ `gami_session_problems` (phase `et`/`mt`/`btvn`) | (HS, `buoi_hoc_id`, phase) | `buoi_hoc.ngay` |
| Khảo sát | như trên, `buoi_hoc.loai = 'khao_sat'` | (HS, `buoi_hoc_id`, phase) | `buoi_hoc.ngay` |
| ET / BTVN online | `bai_lam_cau` ⨝ `bai_lam` ⨝ `bai_test` (`loai` `et`/`btvn`) | `bai_lam.id` | ngày buổi, không có thì `cham_at` (giờ VN) |
| Test bổ trợ | `bai_test.loai` `bo_tro_test` · `bu_test` · `htd_test` | `bai_lam.id` | `cham_at` (giờ VN) |

- Đúng = 1, `partial` = 0,5, sai = 0 (cùng thang mastery hiện tại).
- ET online chỉ tính bài đã nộp (`da_nop`), như mastery.
- Phase `ingame`, `bai_test.loai` `tu_luyen` / `bo_tro` / `bu_luyen` / `htd_luyen` / `retest` / `giao_trinh` / `on_thi_luyen` ⇒ loại.
- Thứ tự "gần nhất" theo ngày của lần, cùng ngày thì theo thời điểm chấm.

**Hàm (mọi tính toán ở Postgres — §2.0):**
- `_dgcc_lan(p_hs uuid[])` — mỗi dòng = (HS, tầng, mã nút, khoá lần, ngày, nguồn, số câu, số đúng, %). Không lưu bảng; suy động.
- `fn_dgcc_hs(p_hs uuid)` — trả mỗi nút: số lần, TB ngắn, TB dài, chênh, nhãn xu hướng, ngày lần gần nhất.
- `fn_dgcc_lop(p_lop uuid, p_tang text)` — lưới HS × nút cho một lớp ở một tầng.
- Cửa sổ L6 + ngưỡng §3 nằm trong **một hàm hằng** `_dgcc_tham_so()` — sửa con số = sửa một chỗ.
- Công thức chạy y hệt mọi môn (scope theo `mon`, §1.6); không `if khối = …` đặc biệt.

**Màn:** một màn mới trong khu Đánh giá — chọn lớp → tầng (Chủ đề / Chuyên đề / Nhóm bài) → lưới HS × nút
(ô = TB dài + mũi tên xu hướng + số lần); bấm ô ⇒ danh sách các lần (ngày · nguồn · đúng x/y · %).

---

## 5. Lộ trình

1. Thùy duyệt spec này + trả lời §6.
2. Migration hàm `_dgcc_*` / `fn_dgcc_*` + kiểm số trên 2–3 HS thật (đối chiếu bằng tay).
3. Màn xem. Xem dữ liệu thật rồi chỉnh cửa sổ / ngưỡng (L6 "tạm").

---

## 6. Đã chốt thêm (Thùy 23/10)

1. **5T tạm dùng bản đồ CŨ** (`dai_ban_do`: Chủ đề → Chuyên đề → Dạng) ⇒ 5T chỉ có tầng Chủ đề + Chuyên đề, **không có tầng Nhóm bài**.
2. **Khối 9 Hình: tạm chỉ tầng Chủ đề.** Chuyên đề / Nhóm bài của Hình để sau.
3. **Trên app không tính gì** ⇒ thi thử loại. *(Phạm vi câu này — xem §7.)*

## 7. Đã chốt (Thùy 23/10, lượt sau)

- "Trên app không tính" CHỈ là **thi thử**. ET / BTVN online và test bổ trợ (`bo_tro_test` · `bu_test` · `htd_test`) VẪN tính.
- `htd_test` = bài test cuối mỗi dạng của "Học từ đầu" (bổ trợ đuổi).

## 8. Hiện trạng dữ liệu (đo 23/10)

- K9 toàn khối (67 HS có dữ liệu): 241 ô chủ đề, 3.967 lần; chạy ~5 s cả khối, ~1 s một lớp.
- **Hình K9 gần như chưa lên** tầng chủ đề: mô hình K9 (Hình luyện) **0/3** gắn chủ đề, bài Hình học K9 **1/12** gắn chủ đề
  ⇒ lượt Hình không quy được thì bỏ (§1.5), tự lấp khi bản đồ Hình gắn chủ đề (việc của CEO).
- Nguồn câu đang chép luật của `_dbht_cau` (Dashboard học tập) — **nợ**: gộp thành MỘT hàm nguồn chung khi phiên Dashboard rảnh
  (khác biệt có chủ ý: dgcc có khảo sát, không retest). Ghi chú thêm: `_dbht_cau` đang `join lop` nên buổi KHẢO SÁT (không có `lop_id`) bị rơi.
