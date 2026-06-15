# BKdemy Gamification — SPEC MASTER (cho Claude Code)

> Spec kỹ thuật tổng hợp TOÀN BỘ hệ tích điểm. Logic/chiến lược đầy đủ ở `bkdemy_gamification_tong_ket.md`. File này = phần để CODE.
> ĐỌC HẾT mục 0-2 trước khi viết bất kỳ dòng nào.

---

## 0. PHÂN GIAI ĐOẠN (code gì trước — KHÔNG làm sai thứ tự)

| GĐ | Nội dung | Điều kiện | Trạng thái |
|---|---|---|---|
| **A — V1 lõi** | Elo + EXP + điểm bài + UI chấm + UI tivi cá nhân. Chạy 1 buổi end-to-end. | — | **CODE NGAY** |
| **B — base còn lại** | MT (phase=mt), Đội (random + Σ Δ Elo), Boss (1 tháng/lần) | sau A chạy ổn | code sau A |
| **C — kinh tế + level** | xu (EXP→xu), Level (% của MAX 21) | **xu**: cần quỹ; **level**: cần ≥1 mùa EXP để calibrate "EXP max" | CHỜ data |
| **D — cần thiết bị** | Event tự chấm (ô chữ/đua/boss realtime), Huy hiệu auto-track | mỗi HS 1 thiết bị | bàn sau |

> Nguyên tắc: GĐ A phải **chạy được 1 buổi hoàn chỉnh** (chấm → Elo → EXP → tivi) trước khi đụng B. Đừng code C/D khi chưa có data (sẽ đoán mò).

---

## 1. QUY TẮC THỰC THI (vi phạm = làm lại)

1. **KHÔNG guess schema.** Trước mọi SQL join/đọc bảng có sẵn (students, classes, sessions, enrollment, avatar...): `SELECT column_name FROM information_schema.columns WHERE table_name='...'` để xác minh tên bảng + cột THẬT. Tên trong spec là GIẢ ĐỊNH.
2. **RLS:** bảng `gami_*` DISABLE RLS; chỉ `staffs` ENABLE (theo convention v1).
3. **File hoàn chỉnh**, không patch snippet rời.
4. **Đọc pattern có sẵn trước khi viết mới** (AttendancePage, GradingPage... cho cách gọi Supabase, quản state, style). KHÔNG tự nghĩ cách mới.
5. **Engine = pure functions**, tách khỏi I/O (test được). DB access ở layer riêng.
6. **Sau mỗi GĐ: cập nhật CLAUDE.md** (schema + công thức + lessons).
7. **Stack:** React + Vite + Supabase + Tailwind, repo `HongThiet/bkdemy-erp`.

---

## 2. KIẾN TRÚC TỔNG — 4 thước đo, phân vai sạch

| Thước | Đo | Tính chất | Phần thưởng |
|---|---|---|---|
| **Elo** | Giỏi tương đối, LÚC NÀY | Lên/xuống | cosmetic (farm) |
| **EXP** | Giỏi + Nỗ lực, THÁNG | Chỉ tăng, reset/tháng ra lương | **xu (tiền)** |
| **xu** | (từ EXP) | Closed-loop | mua cosmetic + quà |
| **Level** | Giỏi+Chăm+Bền DÀI HẠN | % hoàn hảo, reset/mùa + lưu vĩnh viễn | **quyền lợi (vinh dự)** |

- **xu KHÔNG chảy ngược** về EXP/Elo. Một chiều: hành vi → EXP → xu → tiêu.
- 3 món số đông (Elo/xu/huy hiệu) + 1 món số ít (Level, ~5% chạm L7).

---

## 3. DATA MODEL (toàn bộ bảng gami_*)

> Verify bảng có sẵn trước khi FK. Giả định: `students(id)`, `classes(id)`, `sessions(id, class_id, date)`, bảng enrollment, bảng avatar.

### GĐ A — buổi học lõi

**`gami_elo`** — Elo hiện tại
```
id uuid pk · student_id uuid fk unique · elo int default 1000
sessions_played int default 0 · updated_at timestamptz
```
**`gami_session_problems`** — bài của buổi
```
id uuid pk · session_id uuid fk · phase text ('ingame'|'et'|'mt')
problem_no int · opened_at timestamptz · deadline_at timestamptz null · hidden bool default false
```
**`gami_grades`** — chấm từng bài
```
id uuid pk · session_id uuid fk · problem_id uuid fk · student_id uuid fk
result text ('correct'|'partial'|'wrong') · presentation text ('clean'|'ok'|'sloppy')
speed text ('fast'|'normal'|'slow') · points numeric · graded_by uuid · graded_at timestamptz
unique(problem_id, student_id)
```
**`gami_elo_history`** — log Elo
```
id uuid pk · student_id uuid fk · session_id uuid fk · phase text
elo_before int · expected numeric · actual numeric · delta int · elo_after int · created_at timestamptz
```
**`gami_exp_ledger`** — EXP (INSERT-only)
```
id uuid pk · student_id uuid fk · source text · amount int (≥0)
ref_session_id uuid null · note text null · created_at timestamptz
-- source: 'rank_ingame'|'rank_et'|'rank_mt'|'btvn'|'daily'|'streak'|'team'|'boss'
```

### GĐ B — đội
**`gami_teams`** — đội mỗi buổi (random)
```
id uuid pk · session_id uuid fk · team_no int · created_at timestamptz
```
**`gami_team_members`**
```
id uuid pk · team_id uuid fk · student_id uuid fk · unique(team_id, student_id)
```
> Điểm đội = Σ Δ Elo thành viên buổi đó (tính từ gami_elo_history, KHÔNG bảng riêng).

### GĐ C — level (3 bảng)
**`gami_level_marks`** (13 mốc/mùa, 0/1/2 điểm)
```
id uuid pk · student_id uuid fk · season text · mark_type text ('exp_month'|'school_exam')
mark_key text · weight int (1|2) · score int (0..weight) · created_at timestamptz
unique(student_id, season, mark_key)
```
**`gami_level_season`** (level mùa, chỉ-lên)
```
id uuid pk · student_id uuid fk · season text · total_points int default 0 · level int default 0
updated_at timestamptz · unique(student_id, season)
```
**`gami_level_lifetime`** (đóng dấu cuối mùa, KHÔNG reset)
```
id uuid pk · student_id uuid fk · season text · peak_level int · points int
ceremony text null · badge text null · created_at timestamptz · unique(student_id, season)
```

---

## 4. CONFIG (`src/gami/config.js`)

```js
export const ELO = {
  BASE_RATING: 1000, SCALE: 400,
  K_CALIBRATION: 48, CALIBRATION_SESSIONS: 4,
  K_NORMAL: 24, K_MT: 60, K_SMALL_CLASS: 18, SMALL_CLASS_SIZE: 8,
  DELTA_CAP: 60,
};
export const PROBLEM_SCORE = {
  result:       { correct: 1.0, partial: 0.5, wrong: 0 },
  presentation: { clean: 1.0, ok: 0.85, sloppy: 0.7 },
  speed:        { fast: 1.1, normal: 1.0, slow: 1.0 },
  BASE: 100,
};
export const RANK_EXP = {
  ingame: [400, 380, 360, 330, 290, 250],
  et:     [160, 150, 140, 130, 110, 100],
  mt:     [1700, 1620, 1500, 1320, 1150, 1050],
};
export const TEAM_EXP = { WIN: 150, LOSE: 100 };   // GĐ B, tunable
export const LEVEL = {                              // GĐ C
  MAX_POINTS: 21,
  THRESHOLD: [[21,10],[20,9],[18,8],[17,7],[14,6],[11,5],[8,4],[5,3],[3,2],[1,1],[0,0]],
  EXP_MAX_MONTH: null,   // TODO: chốt sau ≥1 mùa data (xem mục 8)
};
export const XU = { EXP_PER_XU: null };             // TODO: chờ quỹ
```

---

## 5. ELO ENGINE (`src/gami/elo.js` — PURE, có test) [GĐ A]

### Công thức
```
Với mỗi HS i trong 1 event (buổi / ET / MT):
  E_i      = Σ_(j≠i) 1 / (1 + 10^((R_j − R_i)/400))        // R = elo đầu event
  actual_i = #(điểm_i > điểm_j) + 0.5×#(hoà)
  K        = getK(...)
  Δ_i      = clamp(K × (actual_i − E_i), −60, +60)
  R_new    = round(R_i + Δ_i)
```
### Functions
```
expectedScore(ratingI, otherRatings) → number
actualScore(pointsI, otherPoints) → number
getK({ sessionsPlayed, isMT, classSize }) → number
computeEloUpdate(students[{studentId,elo,points,sessionsPlayed}], {isMT, classSize})
  → [{studentId, eloBefore, expected, actual, delta, eloAfter}]
```
### TEST FIXTURE (BẮT BUỘC pass — đã verify tay)
```
5 HS, K=24, không MT:
  elo:  An=1200 Bình=1100 Chi=1000 Dũng=900 Em=800
  điểm: An=7.0  Bình=8.5  Chi=8.0  Dũng=5.0  Em=6.5
  E:    An=3.16 Bình=2.61 Chi=2.00 Dũng=1.39 Em=0.84   (ΣE=10=C(5,2))
  Δ:    An=−28  Bình=+33  Chi=+24  Dũng=−33  Em=+4      (ΣΔ≈0)
  sau:  An=1172 Bình=1133 Chi=1024 Dũng=867  Em=804
(cho phép ±1 do làm tròn)
```
### Lưu ý
- Buổi có 2 event nối tiếp: `ingame` (điểm=Σ điểm bài trong giờ) trước → ghi elo mới → `et` (điểm=ET) dùng elo sau ingame. MT = session riêng, phase='mt', K=60.
- `sessions_played` tăng 1 lần/buổi (ở ingame, KHÔNG ở et).

---

## 6. EXP ENGINE (`src/gami/exp.js` — PURE, có test) [GĐ A]

```
problemPoints({result, presentation, speed}) → int
  = round(100 × result × presentation × speed); result==='wrong' → 0 (khỏi nhân)

expForRank(rank/*1..N*/, N, bands/*6 phần tử*/) → int
  N≤6:  return bands[rank-1]               // N=5 dùng 5 bậc đầu, không dùng sàn
  N>6:  rank==1→bands[0]; rank==2→bands[1]
        else: band = min(5, 2 + floor((rank-3)*4/(N-2))); return bands[band]
  ĐẢM BẢO đơn điệu: expForRank(r) ≥ expForRank(r+1). Viết test verify.

Xếp hạng buổi: theo điểm thô (Σ điểm bài phase) GIẢM DẦN (tầng1); hoà → Δ Elo lớn xếp trên (tầng2).
Ghi EXP 1 phase: rank → amount=expForRank(...) → INSERT gami_exp_ledger(source='rank_'+phase).
```
> Sàn (250/100/1050) = "làm đúng chuẩn, đa số đạt" → hạng bét vẫn nhận. Lỗi thái độ KHÔNG hạ EXP ở đây (→ hệ phạt riêng, defer).
> Nửa nỗ lực (BTVN/daily/streak) = cùng engine, khác nguồn nhập — làm sau buổi-học-lõi (vẫn GĐ A/B).

---

## 7. GRADING FLOW (`src/gami/gradingService.js`) [GĐ A]
```
gradeProblem({sessionId, problemId, studentId, result, presentation, speed}):
  points = problemPoints(...); upsert gami_grades

closePhase({sessionId, phase}):   // GV bấm kết thúc phase
  1. load grades phase → điểm thô mỗi HS
  2. load elo + sessions_played
  3. computeEloUpdate → ghi gami_elo_history, update gami_elo
  4. xếp hạng → ghi EXP
  5. return {hạng, +EXP, ΔElo} cho UI reveal
  IDEMPOTENT: gọi lại không double-ghi (check đã close).
```

---

## 8. LEVEL ENGINE (`src/gami/level.js` — PURE) [GĐ C — code sau, CHƯA BẬT tới khi có data]

### MAX = 21 (1 mùa = 9 tháng EXP + 4 kỳ thi trường)
```
5 tháng EXP thường (w1) =5 · 4 tháng EXP+khảo sát (w2)=8 · 4 kỳ thi trường (w2)=8  → 21
```
### Map điểm → level (đường cong: dưới giãn, ĐỈNH NÉN — cố ý)
```js
function pointsToLevel(points){
  for(const [min,lv] of LEVEL.THRESHOLD) if(points>=min) return lv;
  return 0;
}
// THRESHOLD: 21→10,20→9,18→8,17→7,14→6,11→5,8→4,5→3,3→2,1→1,0→0
```
| L1:1 L2:3 L3:5 L4:8 L5:11 L6:14 L7:17 | L8:18 L9:20 L10:21 |
|---|---|
| dưới giãn (+2/+3) — cố gắng leo tới L7 | đỉnh nén (+1) — chỉ "tới sớm còn lượt" mới đi tiếp |
> **KHÔNG giãn đỉnh** — nén +1 ở đỉnh là bộ lọc bằng THỜI GIAN-tới-đỉnh (lên L7 đã tốn gần hết lượt; còn lượt +1 = hoàn hảo từ sớm). Giãn ra → L7 dễ → phá. Đây là thiết kế, không phải lỗi cần "sửa cho đều".
> L9-10 = huyền thoại. L10=21=hoàn hảo tuyệt đối (CÓ người đạt thật).

### Điểm mỗi mốc → 0/1/2 (cap ≤ weight)
```
EXP tháng thường (w1):  1 nếu EXP_tháng ≥ 0.95×EXP_MAX_MONTH, else 0
EXP+khảo sát (w2):      2 nếu (EXP≥95%max VÀ khảo sát đạt); 1 nếu 1/2; 0 nếu không
Thi trường (w2):        2 đạt hẳn / 1 gần (châm chước) / 0 — theo chuẩn-cá-nhân-mỗi-trường (nhập tay)
Vùng đỉnh (L8-10 → mốc tính ≥18đ): BỎ châm chước (chỉ 2 hoặc 0).
```
### Vòng đời mùa
```
Trong mùa: mốc chốt → upsert marks → total=Σscore → level=max(cũ, pointsToLevel(total))  // CHỈ LÊN
Đóng mùa: INSERT lifetime(peak,points,ceremony,badge); tính danh hiệu (vd cao_thu_4_mua);
          RESET season mới (level 0); lifetime KHÔNG đụng.
Nghi lễ: L5→cờ 'medal'; L7+→cờ 'ceremony' (admin tổ chức ngoài đời, hệ chỉ TẠO CỜ).
```
### Test
```
pointsToLevel: 0→0,1→1,3→2,5→3,8→4,11→5,14→6,17→7,18→8,19→8,20→9,21→10. Đơn điệu.
```
### ⚠ CHƯA CHỐT (chốt chặn — không có thì level không tính được)
1. **`EXP_MAX_MONTH`** = trần lý thuyết tháng (full năng lực+nỗ lực, theo số buổi) hay benchmark? Cần ≥1 mùa data.
2. Điều kiện "khảo sát đạt chuẩn" (đề gì, ngưỡng).
3. "Chuẩn cá nhân theo trường" — ai/đặt thế nào.
4. HSG: +điểm thẳng hay chỉ badge lifetime.
5. Tên tier L1-L10.
> Phần EXP mốc để HÀM STUB tới khi chốt 8.1. Engine map + schema làm trước (test số giả). KHÔNG bật cho HS.

---

## 9. ĐỘI (`src/gami/teamService.js`) [GĐ B]
```
makeTeams(sessionId, students): random chia (≥9→3 đội, <9→2). Ghi gami_teams/_members.
closeTeamRound(sessionId):
  điểm đội = Σ Δ Elo thành viên (từ gami_elo_history buổi đó).
  đội thắng → INSERT gami_exp_ledger(source='team', amount=TEAM_EXP.WIN) mỗi thành viên; thua=LOSE.
  + danh hiệu/cosmetic đội tạm thời (cờ, COGS=0).
```
> Điểm đội = Σ Δ Elo (vượt-kỳ-vọng), KHÔNG tổng điểm thô → đứa rank thấp chăm = tài sản.

---

## 10. UI MÀN CHẤM (GV) — `src/gami/GradingMatrix.jsx` [GĐ A]
- Ma trận: hàng=HS (enrollment lớp), cột=bài (phase hiện tại). Hiện **3 bài/màn**, vuốt xem tiếp. Mobile: 1 bài.
- Ô NHỎ: chưa chấm→bút mờ (dashed); đã chấm→hiện `points` + viền màu (xanh correct / vàng partial / đỏ wrong).
- Bấm ô → **popup nhỏ bung tại ô** (không che màn): 3 nút Kết quả (Đúng/Đúng hướng/Sai cách) + 3 Trình bày (default chuẩn) + 3 Tốc độ (default vừa) → Lưu → `gradeProblem` → đóng, ô hiện điểm.
- Header cột: nút ẩn bài THỦ CÔNG (`hidden=true`).
- Nút "Kết thúc phase" → `closePhase` → reveal.
- **KHÔNG hiện Elo ở màn này** (chỉ điểm bài).
- Đọc pattern AttendancePage/GradingPage, copy cách load enrollment + upsert + style.

---

## 11. UI MÀN TIVI (HS xem) — `src/gami/RaceScreen.jsx` [GĐ A; chế độ đội GĐ B]

### Chế độ cá nhân (GĐ A)
- 15 (max) HS, mỗi đứa **1 làn dọc riêng**.
- **ĐỘ CAO = Elo realtime** (cao=vượt mục tiêu nhất). Animate mượt (CSS transition).
- **Linh vật = avatar + đôi cánh** (ảnh tròn avatar + 2 cánh, CSS float + flap). Avatar từ hệ có sẵn (verify bảng).
- **Mỗi bài làm = 1 sao**; độ sáng sao = chất lượng bài (correct+clean→sáng; wrong→tối). KHÔNG tính tốc độ.
- KHÔNG số hạng cứng, KHÔNG hiện điểm Elo (chỉ cao thấp).
- Realtime: Supabase subscription `gami_grades` (insert/update) + `gami_elo` (update) → mọc sao + trồi/chìm.
- Cuối buổi (sau closePhase): reveal hạng + EXP.
- Text giải thích Elo cho HS (đầu mùa, KHÔNG công thức): "Mỗi con có mục tiêu riêng theo phong độ gần đây. Làm tốt hơn mục tiêu → lên. Con giỏi mục tiêu cao phải cố hơn. Con yếu mục tiêu vừa sức, tiến bộ là lên ngay."

### Chế độ đội (GĐ B) — buổi chia đội
- TRÊN: 2-3 huy hiệu đội bay đua (cao = Σ Δ Elo đội).
- DƯỚI: nhân vật từng HS đứng theo đội, **KHÔNG xếp cao thấp cá nhân** (mờ so sánh). Sao đầy đủ (giữ cống hiến).
- Làm xong bài → luồng sáng từ nhân vật lên huy hiệu đội (Δ to → luồng mạnh → tôn vinh đứa rank thấp vượt mục tiêu).

> Asset cánh: CC0 (kenney.nl) hoặc SVG tự vẽ. KHÔNG dùng IP bản quyền.

---

## 12. BUILD ORDER TỔNG

```
=== GĐ A (V1 lõi) ===
A1. Verify schema có sẵn (students, sessions, enrollment, avatar). Ghi tên thật.
A2. Migration bảng GĐ A (gami_elo, _session_problems, _grades, _elo_history, _exp_ledger). DISABLE RLS.
A3. config.js
A4. elo.js + test khớp FIXTURE mục 5. PHẢI PASS trước khi đi tiếp.
A5. exp.js + test (expForRank đơn điệu, problemPoints).
A6. gradingService.js (closePhase idempotent).
A7. GradingMatrix.jsx — chấm end-to-end → DB.
A8. RaceScreen.jsx (cá nhân) + realtime.
A9. Chạy thử 1 buổi giả lập: tạo session+bài → chấm → closePhase → tivi reveal.
A10. CLAUDE.md.

=== GĐ B (sau A ổn) ===
B1. MT: phase='mt', K=60 (cùng engine, session riêng).
B2. teamService.js + bảng gami_teams/_members.
B3. RaceScreen chế độ đội.
B4. Boss: 1 tháng/lần, điều kiện cả lớp (cấu trúc sau).

=== GĐ C (CHỜ data) ===
C1. level.js + test pointsToLevel. Schema gami_level_*. (làm trước được)
C2. Mốc EXP để STUB tới khi chốt EXP_MAX_MONTH. UI nhập thi trường/khảo sát.
C3. xu: chờ quỹ → rate EXP→xu + shop.

=== GĐ D ===  event tự chấm + huy hiệu auto-track (cần thiết bị).
```
> Mỗi bước test xong mới qua. A4 (Elo) là tim — sai là cả hệ sai.

---

## 13. CÔNG THỨC TÓM TẮT (dán CLAUDE.md)
```
ELO:  E_i=Σ_(j≠i)1/(1+10^((Rj−Ri)/400)); actual=#(>)+0.5×#(=); Δ=clamp(K(actual−E),±60); R+=Δ
      K=48(calib<4)/60(MT)/18(lớp≤8)/24(thường)
ĐIỂM BÀI = 100×result(1/.5/0)×trình_bày(1/.85/.7)×tốc_độ(1.1/1/1); wrong→0
HẠNG→EXP: 6 bậc tách đỉnh gộp đáy. ingame[400,380,360,330,290,250] et[160..100] mt[1700..1050]
LEVEL = % của MAX 21. Thang: 1,3,5,8,11,14,17,18,20,21 (L1..L10). Đỉnh nén CỐ Ý. Reset mùa + lưu vĩnh viễn.
EXP chỉ INSERT. xu=chờ quỹ. Level=chờ EXP_MAX_MONTH (≥1 mùa data).
```

---

## 14. DEFER / CHƯA CHỐT
| Hạng mục | Chờ |
|---|---|
| rate EXP→xu, shop, redenominate | quỹ gami/tháng + sĩ số |
| EXP_MAX_MONTH (chốt chặn level) | ≥1 mùa EXP thật |
| Điều kiện khảo sát / chuẩn thi trường / HSG / tên tier | Thùy quyết |
| BTVN/Daily/Streak (nửa nỗ lực) | cùng exp.js, khác nguồn nhập |
| Hệ phạt (sổ riêng) | chưa chốt trừ vào đâu |
| Boss chi tiết, Huy hiệu (Lộc), Event tự chấm | GĐ B/D |
| Quyền lợi level (vai trò mentor/đệ tử), nghi lễ | phần NGƯỜI, admin gán |

> Schema lõi đã mở sẵn: `gami_exp_ledger.source` có enum team/boss/btvn/daily; Elo `phase` có 'mt'. Thêm GĐ B/C/D KHÔNG đổi schema lõi.
```
