# BKdemy Gamification — Spec module LEVEL (cho Claude Code)

> Module bổ sung cho spec chính `bkdemy_gami_spec_v1_claudecode.md`. Logic đầy đủ ở `bkdemy_gamification_tong_ket.md` mục 4b.

---

## 0. SCOPE & VỊ TRÍ (đọc kỹ — đừng code nhầm thời điểm)

**Level là module TÍNH THEO MÙA, KHÔNG phải realtime buổi học.** Nó là lớp tính định kỳ (cuối tháng + cuối kỳ thi), tách hẳn engine buổi học V1.

**CODE SAU, không cùng V1.** Lý do (dependency cứng):
1. EXP engine phải chạy xong (level đọc EXP tháng).
2. **"95% EXP max" — MAX chỉ biết sau ≥1 MÙA EXP thật.** Đặt 95% của số chưa đo = đoán mò. Phải pilot 1 mùa để calibrate.
3. Thi trường + khảo sát cần UI nhập (chưa có).

**Được phép code TRƯỚC (testable bằng số giả), nhưng CHƯA BẬT cho HS tới khi có data mùa:**
- Engine map điểm→level (pure, test được ngay).
- Schema bảng level.
- KHÔNG bật tính tự động / hiển thị cho HS tới khi calibrate xong "EXP max".

---

## 1. DEPENDENCY & ĐIỀU KIỆN TIÊN QUYẾT

| Cần | Trạng thái |
|---|---|
| EXP engine + `gami_exp_ledger` chạy | từ spec V1 |
| ≥1 mùa EXP thật để chốt `EXP_MAX_MONTH` | CHỜ pilot |
| UI nhập thi trường / khảo sát (đạt/gần/không mỗi kỳ mỗi HS) | build trong module này |
| Định nghĩa "mùa" (năm học: 9 tháng EXP + 4 kỳ thi trường) | xem mục 3 |

---

## 2. DATA MODEL (bảng MỚI)

### 2.1 `gami_level_marks` — điểm-level từng mốc (nguồn)
> Mỗi HS mỗi mùa có 13 mốc: 9 tháng EXP + 4 kỳ thi trường. Mỗi mốc cho 0/1/2 điểm.
```
id          uuid pk
student_id  uuid fk → students(id)
season      text not null        -- vd '2026-2027'
mark_type   text not null        -- 'exp_month' | 'school_exam'
mark_key    text not null        -- 'month_1'..'month_9' | 'exam_1'..'exam_4'
weight      int  not null        -- hệ số: 1 (tháng thường) | 2 (tháng có khảo sát / thi trường)
score       int  not null        -- điểm-level mốc này: 0 | 1(châm chước) | 2(đạt hẳn), CAP ≤ weight
source_note text null
created_at  timestamptz default now()
unique(student_id, season, mark_key)
```
> CAP: score ≤ weight. Mốc weight=1 chỉ 0 hoặc 1 (không châm chước). Mốc weight=2 thì 0/1/2.

### 2.2 `gami_level_season` — level mùa hiện tại mỗi HS
```
id          uuid pk
student_id  uuid fk → students(id)
season      text not null
total_points int not null default 0   -- Σ score các mark, max 21
level       int not null default 0     -- map từ total_points (mục 4)
updated_at  timestamptz default now()
unique(student_id, season)
```

### 2.3 `gami_level_lifetime` — bảng vĩnh viễn (đóng dấu cuối mùa, KHÔNG reset)
```
id          uuid pk
student_id  uuid fk → students(id)
season      text not null
peak_level  int  not null        -- level cao nhất mùa đó
points      int  not null        -- total_points cuối mùa
ceremony    text null            -- 'medal_L5' | 'ceremony_L7' | ...
badge       text null            -- danh hiệu lifetime nếu có (vd '4_mua_cao_thu')
created_at  timestamptz default now()
unique(student_id, season)
```

---

## 3. NGUỒN ĐIỂM-LEVEL (cách tính mỗi mốc → 0/1/2)

**MAX mùa = 21:**
```
5 tháng EXP thường (weight 1)        = 5 × 1 = 5
4 tháng EXP + khảo sát (weight 2)    = 4 × 2 = 8
4 kỳ thi trường (weight 2)           = 4 × 2 = 8
                                       ─────── = 21
```
(Năm 10 tháng, tháng cuối thi phân lớp → bỏ, tính 9 tháng EXP.)

### 3.1 Mốc EXP tháng thường (weight 1) → 0 hoặc 1
```
score = 1 nếu EXP_tháng ≥ 0.95 × EXP_MAX_MONTH(tháng đó)
        0 nếu không
```
> `EXP_MAX_MONTH` = trần lý thuyết EXP một tháng (full nửa năng lực + full nửa nỗ lực), tính theo số buổi thực tế tháng đó. **CHƯA CHỐT — cần 1 mùa data.** Xem mục 7.

### 3.2 Mốc EXP + khảo sát (weight 2) → 0/1/2
```
score = 2 nếu (EXP_tháng ≥ 95% max) VÀ (khảo sát BK đạt chuẩn)
        1 nếu đạt MỘT trong hai (châm chước)
        0 nếu không đạt cả hai
```
> Điều kiện "khảo sát đạt chuẩn" — CHƯA CHỐT (khảo sát là gì, ngưỡng nào). Mục 7.

### 3.3 Mốc thi trường (weight 2) → 0/1/2
```
score = 2 nếu điểm thi trường ≥ chuẩn-cá-nhân-theo-trường (đạt hẳn)
        1 nếu gần đạt (châm chước)
        0 nếu không đạt
```
> "Chuẩn cá nhân theo trường" = mỗi HS một ngưỡng (trường khác nhau → fair). Admin/GV NHẬP đạt/gần/không qua UI (mục 6). Data thi trường: BK có thu.

### 3.4 Bonus (KHÔNG vào 21 điểm — ngoài thang)
- Giải HSG... (~1/năm): KHÔNG làm gate. Ghi thành `badge` lifetime riêng / hoặc +điểm thẳng nếu muốn (chốt sau). Đa số HS không thi → không đưa vào điều kiện bắt buộc.

---

## 4. ENGINE: điểm → level (`src/gami/level.js` — PURE, có test)

### Thang (đường cong: dưới giãn, đỉnh nén — CỐ Ý, đừng "sửa cho đều")
```js
// total_points (0..21) → level (0..10)
const LEVEL_THRESHOLD = [
  // [minPoints, level]
  [21, 10], [20, 9], [18, 8], [17, 7], [14, 6],
  [11, 5], [8, 4], [5, 3], [3, 2], [1, 1], [0, 0],
];
function pointsToLevel(points) {
  for (const [min, lv] of LEVEL_THRESHOLD) if (points >= min) return lv;
  return 0;
}
```
| Level | minPoints | khoảng cách | ý nghĩa |
|---|---|---|---|
| L1 | 1 | — | |
| L2 | 3 | +2 | dưới: giãn (cố gắng leo được) |
| L3 | 5 | +2 | |
| L4 | 8 | +3 | |
| L5 | 11 | +3 | → HUÂN CHƯƠNG |
| L6 | 14 | +3 | |
| L7 | 17 | +3 | vinh dự tối cao thực tế (~10-20 HS/năm) → LỄ |
| L8 | 18 | +1 | đỉnh nén: chỉ "tới sớm còn lượt" mới +1 (~5-7/năm) |
| L9 | 20 | +2 | huyền thoại |
| L10 | 21 | +1 | hoàn hảo tuyệt đối (CÓ người đạt — hiếm) |

> **KHÔNG giãn đỉnh.** Nén +1 ở L7→L8→L10 là bộ lọc bằng THỜI GIAN-tới-đỉnh (lên L7 đã tốn gần hết lượt; còn lượt +1 = đã hoàn hảo từ sớm). Giãn ra sẽ làm L7 dễ → phá "L7 = đỉnh". Đây là thiết kế, không phải lỗi.

### Test (BẮT BUỘC)
```
pointsToLevel(0)→0, (1)→1, (3)→2, (5)→3, (8)→4, (11)→5,
(14)→6, (17)→7, (18)→8, (19)→8, (20)→9, (21)→10
verify đơn điệu: points tăng → level không giảm.
```

---

## 5. VÒNG ĐỜI MÙA

### 5.1 Cập nhật trong mùa (leo realtime, CHỈ LÊN)
```
Khi một mốc được chốt (cuối tháng EXP / sau nhập thi trường):
  1. tính score mốc → upsert gami_level_marks
  2. recompute total_points = Σ score mùa đó
  3. level mới = pointsToLevel(total_points)
  4. CHỈ LÊN: gami_level_season.level = max(level cũ, level mới)  // không tụt giữa mùa
  5. nếu lên L5 / L7+ → tạo sự kiện nghi lễ (mục 6, admin xử)
```
> Trần tự nhiên theo thời gian: đầu mùa chưa đủ mốc → total_points thấp → chưa thể level cao. ĐÚNG (chưa chứng minh đủ kỳ).

### 5.2 Đóng mùa (cuối năm)
```
1. chốt gami_level_season → INSERT gami_level_lifetime (peak_level, points, ceremony, badge)
2. tính danh hiệu lifetime (vd 'cao_thu_4_mua' nếu peak_level≥7 bốn mùa liên tiếp — query lifetime)
3. RESET: mùa mới tạo gami_level_season mới (level 0). gami_level_marks mùa mới rỗng.
   → lifetime KHÔNG đụng (chỉ lớn lên).
```

---

## 6. UI cần build

### 6.1 Nhập thi trường / khảo sát (admin/GV)
- Form: chọn mùa + kỳ (exam_1..4 / month có khảo sát) + lớp → list HS → mỗi HS chọn **Đạt hẳn / Gần đạt / Không đạt** → lưu vào `gami_level_marks`.
- Ngưỡng "chuẩn cá nhân theo trường" do người đánh giá (không auto V1) — chỉ nhập kết quả 3 mức.

### 6.2 Hồ sơ level HS (xem)
- Level mùa hiện tại + thanh tiến độ (total_points / 21).
- Bảng vĩnh viễn: chuỗi peak các mùa + huân chương/lễ + danh hiệu lifetime.

### 6.3 KHÔNG code (phần NGƯỜI):
- Nghi lễ thật (huân chương L5, lễ L7+) — sự kiện ngoài đời, hệ chỉ TẠO CỜ "đủ điều kiện lễ" để admin tổ chức.
- Quyền lợi (vai trò mentor/đệ tử, chọn chỗ, cosmetic tier) — admin gán tay / hệ khác.

---

## 7. CHƯA CHỐT (cần Thùy / data — đừng tự quyết)

1. **`EXP_MAX_MONTH`** = trần lý thuyết EXP tháng (full năng lực + full nỗ lực) tính theo số buổi tháng đó, HAY benchmark cố định? Cần ≥1 mùa data để calibrate. **Đây là chốt chặn — không có nó, mốc EXP không tính được.**
2. **Điều kiện "khảo sát BK đạt chuẩn"** — khảo sát là đề gì, ngưỡng nào, khác MT thế nào.
3. **"Chuẩn cá nhân theo trường"** cho thi trường — ai đặt, đặt thế nào (đầu mùa GV set mỗi HS một ngưỡng?).
4. **HSG/bonus** — +điểm thẳng vào 21 hay chỉ badge lifetime riêng?
5. **Tên tier** cho L1-L10 (Tân Binh → ... → Tông Sư?) — bản sắc, chưa đặt.

---

## 8. BUILD ORDER

```
B1. level.js (pure) + test pointsToLevel khớp mục 4. PASS trước.
B2. Migration 3 bảng gami_level_* (DISABLE RLS).
B3. Hàm tính score mốc (3.1-3.3) — phần EXP để HÀM RỖNG/STUB nếu chưa chốt EXP_MAX_MONTH.
B4. Service: recompute total_points + update season (chỉ-lên).
B5. UI nhập thi trường/khảo sát (6.1).
B6. UI hồ sơ level + bảng vĩnh viễn (6.2).
B7. Cron/đóng mùa (5.2) — chạy tay được, không cần auto V1.
B8. CLAUDE.md: schema level + thang + công thức + ghi rõ "CHƯA BẬT tới khi chốt EXP_MAX_MONTH".
```

> Engine + schema làm trước được (testable). Nhưng KHÔNG bật cho HS tới khi có 1 mùa EXP để chốt `EXP_MAX_MONTH` (mục 7.1).
