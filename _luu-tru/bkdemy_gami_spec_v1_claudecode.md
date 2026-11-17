# BKdemy Gamification — Spec triển khai V1 (cho Claude Code)

> Đây là spec để Claude Code triển khai. ĐỌC HẾT trước khi viết code. Logic đầy đủ ở file `bkdemy_gamification_tong_ket.md` — file này là phần kỹ thuật rút gọn để code.

---

## 0. SCOPE V1 (làm gì / KHÔNG làm gì)

**LÀM (V1 lõi — buổi học):**
- Elo engine (cờ vua đa người) — pure functions, testable.
- EXP engine (hạng buổi → EXP, 50/50 năng lực/nỗ lực) — pure functions.
- Schema + service cho: buổi học, bài, chấm bài, cập nhật Elo, ghi EXP.
- UI màn chấm (ma trận ô nhỏ, popup nhập).
- UI màn tivi (đường đua, linh vật avatar+cánh, sao).

**KHÔNG làm V1 (defer — mục 11):**
- xu (chờ quỹ gami + sĩ số để chốt rate EXP→xu). Chỉ ghi EXP, chưa convert.
- Đội, boss fight, hệ huy hiệu, level/quyền lợi, hệ phạt.
- BTVN/daily/MT có thể làm sau buổi-học-lõi (cùng EXP engine, khác nguồn nhập).

→ V1 phải **chạy được 1 buổi học hoàn chỉnh**: GV chấm → Elo cập nhật → EXP ghi → tivi hiển thị. Đủ để pilot 1 lớp.

---

## 1. BỐI CẢNH KỸ THUẬT & QUY TẮC THỰC THI

**Stack:** React + Vite + Supabase + Tailwind (theo repo `HongThiet/bkdemy-erp`, BKdemy ERP v2).

**Quy tắc BẮT BUỘC (vi phạm = làm lại):**
1. **KHÔNG guess schema.** Trước khi viết bất kỳ SQL nào join/đọc bảng có sẵn (students, classes, sessions, enrollments...), `SELECT column_name FROM information_schema.columns WHERE table_name = '...'` để xác minh tên bảng + cột thật. Tên bảng có sẵn trong spec này là GIẢ ĐỊNH — phải verify.
2. **RLS convention:** bảng dữ liệu (gami_*) DISABLE RLS; chỉ bảng staffs ENABLE. Theo đúng convention v1.
3. **File hoàn chỉnh, không patch snippet.** Mỗi file viết trọn vẹn.
4. **Đọc pattern có sẵn trước khi viết mới.** Tìm component/service tương tự trong codebase, copy pattern (cách gọi Supabase, cách quản state, cách style), không tự nghĩ cách mới.
5. **Engine = pure functions, tách khỏi I/O.** Elo/EXP logic phải là hàm thuần (input → output, không gọi DB), để test được. DB access ở layer riêng.
6. **Sau khi xong: cập nhật CLAUDE.md** với schema mới + lessons.

---

## 2. DATA MODEL (bảng MỚI cho gami)

> Verify bảng có sẵn trước khi FK. Giả định có: `students(id)`, `classes(id)`, `sessions(id, class_id, date)`. NẾU tên/cột khác → dùng tên thật.

### 2.1 `gami_elo` — Elo hiện tại mỗi học sinh
```
id              uuid pk default gen_random_uuid()
student_id      uuid fk → students(id), unique
elo             int  not null default 1000
sessions_played int  not null default 0   -- để biết còn calibration (<4) không
updated_at      timestamptz default now()
```

### 2.2 `gami_session_problems` — các bài của một buổi
```
id          uuid pk
session_id  uuid fk → sessions(id)
phase       text not null   -- 'ingame' (bài trong giờ) | 'et' (test cuối giờ)
problem_no  int  not null
opened_at   timestamptz default now()
deadline_at timestamptz null
hidden      bool default false   -- GV ẩn thủ công khi hết giờ
```

### 2.3 `gami_grades` — kết quả chấm từng bài từng HS
```
id            uuid pk
session_id    uuid fk → sessions(id)
problem_id    uuid fk → gami_session_problems(id)
student_id    uuid fk → students(id)
result        text not null    -- 'correct'(1.0) | 'partial'(0.5) | 'wrong'(0)
presentation  text not null    -- 'clean'(1.0) | 'ok'(0.85) | 'sloppy'(0.7)
speed         text not null    -- 'fast'(1.1) | 'normal'(1.0) | 'slow'(1.0)
points        numeric not null -- computed = 100 × result × presentation × speed (wrong→0)
graded_by     uuid null
graded_at     timestamptz default now()
unique(problem_id, student_id)
```

### 2.4 `gami_elo_history` — log mỗi lần Elo đổi
```
id          uuid pk
student_id  uuid fk → students(id)
session_id  uuid fk → sessions(id)
phase       text not null      -- 'ingame' | 'et' | 'mt'
elo_before  int  not null
expected    numeric not null   -- E_i
actual      numeric not null   -- thực_i
delta       int  not null      -- Δ (đã clamp)
elo_after   int  not null
created_at  timestamptz default now()
```

### 2.5 `gami_exp_ledger` — EXP cộng dồn (chỉ INSERT, không UPDATE/DELETE)
```
id          uuid pk
student_id  uuid fk → students(id)
source      text not null      -- 'rank_ingame' | 'rank_et' | 'rank_mt' | 'btvn' | 'daily' | 'streak' | 'team' | 'boss'
amount      int  not null      -- luôn ≥ 0 (EXP chỉ tăng)
ref_session_id uuid null
note        text null
created_at  timestamptz default now()
```
> Tổng EXP/tháng của HS = `SUM(amount) WHERE student_id=? AND created_at trong tháng`. Tổng all-time = SUM toàn bộ.

---

## 3. CONFIG (tunable — tách ra `src/gami/config.js`)

```js
export const ELO = {
  BASE_RATING: 1000,
  SCALE: 400,
  K_CALIBRATION: 48,   // 4 buổi đầu mỗi HS
  CALIBRATION_SESSIONS: 4,
  K_NORMAL: 24,
  K_MT: 60,            // Grand Slam
  K_SMALL_CLASS: 18,   // lớp ≤ 8
  SMALL_CLASS_SIZE: 8,
  DELTA_CAP: 60,       // |Δ| tối đa mỗi event
};

export const PROBLEM_SCORE = {
  result:       { correct: 1.0, partial: 0.5, wrong: 0 },
  presentation: { clean: 1.0, ok: 0.85, sloppy: 0.7 },
  speed:        { fast: 1.1, normal: 1.0, slow: 1.0 },
  BASE: 100,
};

// Bảng thưởng EXP theo hạng (6 bậc, tách đỉnh gộp đáy). Tunable.
export const RANK_EXP = {
  ingame: [400, 380, 360, 330, 290, 250],
  et:     [160, 150, 140, 130, 110, 100],
  mt:     [1700, 1620, 1500, 1320, 1150, 1050],
};

// V1: xu chưa convert (chờ quỹ). Placeholder.
export const XU = { EXP_PER_XU: null }; // TODO sau khi có quỹ
```

---

## 4. ELO ENGINE (`src/gami/elo.js` — PURE, có test)

### Công thức (chính xác)
```
Với mỗi học sinh i trong một event (= buổi học, hoặc ET, hoặc MT):

E_i (kỳ vọng) = Σ_(j≠i)  1 / (1 + 10^((R_j − R_i) / SCALE))      // R = elo đầu event
actual_i      = (số j có points_i > points_j) + 0.5×(số j hoà)   // hoà = điểm bằng nhau
K             = chọn theo: calibration? MT? small class? (xem getK)
Δ_i           = clamp(K × (actual_i − E_i), −DELTA_CAP, +DELTA_CAP)
R_i_new       = round(R_i + Δ_i)
```

### Functions cần viết
```js
// kỳ vọng số bạn vượt
expectedScore(ratingI, otherRatings) -> number   // Σ 1/(1+10^((Rj-Ri)/400))

// thực tế số bạn vượt theo điểm buổi
actualScore(pointsI, otherPoints) -> number       // count > + 0.5×count ==

// chọn K
getK({ sessionsPlayed, isMT, classSize }) -> number

// tính Δ cho 1 HS
computeDelta({ ratingI, otherRatings, pointsI, otherPoints, k }) -> { expected, actual, delta }

// tính cả event cho cả lớp → trả mảng { studentId, eloBefore, expected, actual, delta, eloAfter }
computeEloUpdate(students /* [{studentId, elo, points, sessionsPlayed}] */, { isMT, classSize }) -> [...]
```

### TEST FIXTURE (BẮT BUỘC pass — đây là worked example đã verify tay)
Lớp 5 HS, K=24 (đã qua calibration), không MT, không small-class-override (giả sử classSize cho K=24):
```
Input elo:    An=1200, Bình=1100, Chi=1000, Dũng=900, Em=800
Input điểm buổi: An=7.0, Bình=8.5, Chi=8.0, Dũng=5.0, Em=6.5

Kỳ vọng E (làm tròn 2 số): An=3.16, Bình=2.61, Chi=2.00, Dũng=1.39, Em=0.84
  (sanity: ΣE = 10.0 = C(5,2))
Thực tế (số bạn vượt): Bình=4, Chi=3, An=2, Em=1, Dũng=0
Δ (K=24, làm tròn int): An=−28, Bình=+33, Chi=+24, Dũng=−33, Em=+4
  (sanity: ΣΔ ≈ 0)
Elo sau: An=1172, Bình=1133, Chi=1024, Dũng=867, Em=804
```
Viết unit test khớp đúng các số này (cho phép sai số làm tròn ±1 ở Δ).

### Lưu ý
- Một buổi có **2 event Elo nối tiếp**: phase `ingame` (điểm = Σ điểm bài trong giờ) chạy trước, ghi elo mới; rồi phase `et` (điểm = điểm ET) dùng elo SAU ingame làm mốc. MT là session riêng, phase `mt`, K=60.
- Mỗi event: ghi `gami_elo_history` + update `gami_elo.elo` + tăng `sessions_played` (chỉ tăng 1 lần/buổi, ở phase ingame — KHÔNG tăng ở et để không kết thúc calibration quá nhanh; verify lại logic này khi code).

---

## 5. EXP ENGINE (`src/gami/exp.js` — PURE, có test)

### 5.1 Điểm bài
```js
problemPoints({ result, presentation, speed }) -> number
// = 100 × result × presentation × speed; nếu result==='wrong' → 0 (khỏi nhân)
// round về int
```

### 5.2 Hạng buổi → EXP (thuật toán tách đỉnh gộp đáy, mọi N)
```js
// BANDS = RANK_EXP[phase]  (6 phần tử)
expForRank(rank /*1..N*/, N, bands) -> int
// Thuật toán:
//   nếu N <= 6:  return bands[rank-1]   (N=5 dùng 5 bậc đầu, KHÔNG dùng bậc sàn)
//   nếu N > 6:
//     rank==1 → bands[0]; rank==2 → bands[1]
//     còn lại (rank 3..N, gồm N-2 đứa) chia đều vào 4 bậc cuối (index 2..5):
//       pos = rank - 3
//       band = min(5, 2 + floor(pos * 4 / (N-2)))
//       return bands[band]
// ĐẢM BẢO đơn điệu: expForRank(r) >= expForRank(r+1) luôn đúng. Viết test verify.
```

### 5.3 Xếp hạng buổi
```
hạng = xếp theo điểm thô buổi (Σ điểm bài phase đó) GIẢM DẦN.   // tầng 1
hoà điểm → phá hoà bằng Δ Elo lớn hơn xếp trên.                 // tầng 2
```

### 5.4 Quy trình ghi EXP một phase
```
1. tính điểm thô mỗi HS (Σ điểm bài của phase)
2. xếp hạng (tầng 1 + 2)
3. mỗi HS: amount = expForRank(hạng, N, RANK_EXP[phase])
4. INSERT gami_exp_ledger (source='rank_'+phase, amount, ref_session_id)
```

### 5.5 Sàn năng lực
- Bậc sàn (250/100/1050) đã là "làm đúng chuẩn, đa số đạt" → đứa hạng bét vẫn nhận. KHÔNG hạ EXP vì lỗi thái độ ở đây (lỗi → hệ phạt riêng, defer).
- HS có mặt + có chấm = vào bảng hạng. HS không nộp bài nào / không chấm = không có điểm → xếp cuối (điểm 0). (Cổng "đạt chuẩn để được sàn" — defer logic chi tiết, V1 cứ ai có điểm thì xếp.)

---

## 6. GRADING FLOW (service layer `src/gami/gradingService.js`)

```
gradeProblem({ sessionId, problemId, studentId, result, presentation, speed }):
  points = problemPoints(...)
  upsert gami_grades (unique problem_id+student_id)

closePhase({ sessionId, phase }):   // GV bấm "kết thúc phase" (ingame cuối buổi / et sau chấm)
  1. load mọi grade của phase → tính điểm thô mỗi HS
  2. load elo hiện tại + sessions_played mỗi HS
  3. computeEloUpdate(...) → ghi gami_elo_history, update gami_elo
  4. xếp hạng + ghi EXP (5.4)
  5. return kết quả để UI reveal (hạng, +EXP, Δ Elo mỗi HS)
```
> Idempotent: gọi lại closePhase không được double-ghi (check đã close chưa, vd cờ trên session hoặc check history tồn tại).

---

## 7. UI MÀN CHẤM (GV) — `src/gami/GradingMatrix.jsx`

**Layout:** ma trận. Hàng = học sinh (load từ enrollment lớp). Cột = bài (`gami_session_problems` phase hiện tại). Hiện **3 bài/màn**, vuốt/nút xem bài tiếp. Mobile: 1 bài, vuốt.

**Ô (cell):** nhỏ.
- chưa chấm → icon bút mờ (`ti-pencil`), bg dashed border.
- đã chấm → hiện `points` (vd "360"), bg + viền màu: xanh (correct), vàng (partial), đỏ (wrong).

**Bấm ô chưa chấm → popup nhỏ bung tại chỗ** (KHÔNG che cả màn):
- 3 nút Kết quả: Đúng / Đúng hướng / Sai cách
- 3 nút Trình bày: chuẩn / khá / ẩu (default chuẩn)
- 3 nút Tốc độ: nhanh / vừa / chậm (default vừa)
- nút Lưu → gọi `gradeProblem`, đóng popup, ô hiện điểm.

**Header cột:** nút "ẩn bài" (`ti-eye-off`) thủ công → set `hidden=true`.

**Nút "Kết thúc phase"** → gọi `closePhase` → chuyển sang màn reveal/tivi.

**KHÔNG hiện Elo ở màn này.** Chỉ điểm bài.

**Đọc pattern:** tìm component bảng/grid có sẵn trong ERP (vd AttendancePage, GradingPage) → copy cách load enrollment, cách upsert Supabase, cách style. KHÔNG tự nghĩ.

---

## 8. UI MÀN TIVI (học sinh xem) — `src/gami/RaceScreen.jsx`

**Mục đích:** chiếu lên tivi chung. Hiển thị, không thao tác.

**Trong buổi:**
- 15 (tối đa) học sinh, mỗi đứa **một làn dọc riêng** (flex ngang, mỗi làn 1 cột).
- **ĐỘ CAO nhân vật = Elo realtime** (cao nhất = vượt mục tiêu nhất). Animate vị trí mượt (CSS transition) khi Elo đổi.
- **Linh vật = avatar HS + đôi cánh** (V1: ảnh tròn avatar + 2 icon cánh, CSS animation float + flap). Avatar load từ hệ avatar có sẵn (verify bảng avatar).
- **Mỗi bài đã làm = 1 ngôi sao** trên đầu; độ sáng từng sao = chất lượng bài đó (correct+clean → sáng; wrong → tối). KHÔNG tính tốc độ vào độ sáng.
- KHÔNG đánh số hạng cứng. KHÔNG hiện điểm Elo (chỉ vị trí cao thấp).

**Khi GV chấm xong 1 bài** (realtime qua Supabase subscription): nhân vật đó mọc thêm sao + (nếu phase đã close) trồi/chìm theo Elo mới.

**Cuối buổi (sau closePhase):** reveal hạng đầy đủ + EXP mỗi đứa.

**Giải thích Elo cho HS** (text tĩnh, hiển thị đầu mùa, KHÔNG công thức): "Mỗi con có mục tiêu riêng theo phong độ gần đây. Làm tốt hơn mục tiêu → lên. Con giỏi mục tiêu cao phải cố hơn. Con yếu mục tiêu vừa sức, tiến bộ là lên ngay."

**Realtime:** dùng Supabase realtime subscription trên `gami_grades` (insert/update) + `gami_elo` (update). Verify cách ERP đã setup realtime ở chỗ khác, copy pattern.

**Demo style tham khảo:** đã có mockup HTML trong chat (đường bay riêng, avatar+cánh float, sao). Asset cánh V1: CC0 (kenney.nl) hoặc SVG tự vẽ. KHÔNG dùng IP có bản quyền.

---

## 9. THỨ TỰ BUILD (cho Claude Code, từng bước)

```
B1. Verify schema có sẵn (students, classes, sessions, enrollment, avatar). Ghi lại tên thật.
B2. Migration: tạo 5 bảng gami_* (mục 2). DISABLE RLS. Test insert/select.
B3. config.js (mục 3).
B4. elo.js (pure) + test khớp FIXTURE mục 4. PHẢI PASS trước khi đi tiếp.
B5. exp.js (pure) + test expForRank đơn điệu + điểm bài.
B6. gradingService.js (mục 6). Test closePhase idempotent.
B7. GradingMatrix.jsx (màn chấm). Chấm tay chạy được end-to-end → ghi DB.
B8. RaceScreen.jsx (tivi) + realtime subscription.
B9. Chạy thử 1 buổi giả lập: tạo session + bài → chấm → closePhase → xem tivi reveal.
B10. Cập nhật CLAUDE.md: schema gami_*, công thức Elo/EXP, lessons.
```

> Mỗi bước test xong mới qua bước sau. B4 (Elo) là tim — sai là cả hệ sai.

---

## 10. CÔNG THỨC TÓM TẮT (dán vào CLAUDE.md)

```
ELO:  E_i = Σ_(j≠i) 1/(1+10^((R_j−R_i)/400))
      actual_i = #(điểm_i > điểm_j) + 0.5×#(hoà)
      Δ_i = clamp(K×(actual_i − E_i), ±60);  R_new = R + Δ
      K = 48 (calib <4 buổi) / 60 (MT) / 18 (lớp≤8) / 24 (thường)

ĐIỂM BÀI = 100 × result(1/.5/0) × trình_bày(1/.85/.7) × tốc_độ(1.1/1/1); wrong→0

HẠNG→EXP: 6 bậc tách đỉnh gộp đáy.
  ingame [400,380,360,330,290,250] · et [160,150,140,130,110,100] · mt [1700,1620,1500,1320,1150,1050]
  xếp hạng theo điểm thô buổi (tầng1), phá hoà bằng Δ Elo (tầng2)

EXP chỉ INSERT (cộng dồn, không sửa/xóa). xu = chờ quỹ (chưa convert V1).
```

---

## 11. DEFER (KHÔNG code V1 — spec riêng sau)

| Hạng mục | Chờ gì |
|---|---|
| **xu** (rate EXP→xu, shop, redenominate) | quỹ gami/tháng/cơ sở + sĩ số TB |
| **BTVN / Daily / Streak** (nửa nỗ lực) | cùng exp.js engine, khác nguồn nhập — làm sau buổi-học-lõi |
| **MT** (Grand Slam) | cùng Elo/EXP engine, phase='mt', K=60 — gắn sau |
| **Đội** (random, Σ Δ Elo, màn tivi đội) | sau khi buổi cá nhân chạy ổn |
| **Boss fight** (văn hóa, 1 tháng/lần) | base, làm sớm nhưng sau lõi |
| **Hệ huy hiệu** (Lộc xây, độc lập Elo/EXP) | season content, hệ riêng |
| **Hệ phạt** (sổ riêng, trừ) | chưa chốt trừ vào đâu |
| **Level/quyền lợi** (stock loop) | perk định tính |

> Cấu trúc V1 phải mở để gắn mấy cái này: `gami_exp_ledger.source` đã có enum cho team/boss/btvn/daily; Elo `phase` đã có 'mt'. Không cần đổi schema lõi khi thêm.
