# SPEC — TEST ONLINE (ET + BTVN trắc nghiệm) · BKdemy ERP v2

> Cho Claude Code. **Đọc CLAUDE.md + HANDOFF.md trước.** Spec này = intent đã chốt giữa Thùy & CTO.
> Tinh thần: 80%, build-to-win. Logic chốt trước, skin game (HS-facing = Fredoka/mascot/gradient) sau.

---

## 0. MỤC TIÊU (1 đoạn)
HS cấp 3 cầm điện thoại/iPad **điền đáp án trắc nghiệm** cho ET (trên lớp, có giám sát) và BTVN (ở nhà). Hệ **đọc doc ET/BTVN đã soạn từ kho** → render test online → HS nộp → **auto-chấm** → ET-kết-quả vào đo lường, BTVN tham khảo. Giấy vẫn phát (màn nhỏ khó đọc đề); điện thoại chỉ để **điền + chấm + xem đáp án**.

---

## 1. ⭐ QUYẾT ĐỊNH ĐÃ CHỐT (đừng tự đổi)
1. **Chỉ trắc nghiệm**, 3 loại: `4_dap_an` · `dung_sai` (4 mệnh đề, mỗi ý Đ/S, partial) · `tra_loi_ngan` (HS ghi SỐ). Tự luận + Elo cấp 3 = NGOÀI scope (làm sau).
2. **Snapshot ĐỀ + KEY lúc phát hành**, KHÔNG liveref. Sửa kho sau KHÔNG đụng bài đã phát. (Lý do: phép-đo-bất-biến + chống `.update()` ngầm lật điểm đã chốt — xem ② HANDOFF "Supabase `.update()` resolve im lặng".)
3. **Chấm lại = MANUAL** (nút "Chấm lại bài X / lớp Y" + xác nhận + log), KHÔNG re-chấm ngầm khi sửa kho. Sửa key sai → đi qua đường này, có vết.
4. **Gán HS = LIVE-DERIVE** (ghi danh `hoc_sinh_lop` hiệu lực tại thời điểm), KHÔNG snapshot roster. (Bài học sĩ số: snapshot → HS vào-sau sót, HS `da_roi` vẫn dính.)
5. **Auto-chấm theo loại**:
   - `4_dap_an` + `dung_sai`: **so khớp TUYỆT ĐỐI**, deterministic, 100% — auto thẳng từ ngày 1, KHÔNG AI, KHÔNG cần người gác.
   - `tra_loi_ngan`: `smartNormalize` + cache `accepted_answers` (V1). Không khớp → để **`wrong` + cho HS REPORT** → người duyệt → backfill cache. (Thùy chốt: đẩy sang report, không TA gác trước. AI-chấm chỉ thêm sau nếu cần — mặc định KHÔNG gọi AI ở v1.)
6. **HS nộp KHÔNG ghi thẳng `gami_grades`** → bảng submission HS-facing RIÊNG (RLS HS) → auto-chấm ở đó → **sync verdict** sang đo lường staff-side.
7. **Reveal**: ET = lộ đáp án **sau khi HS bấm nộp** (cả bài). BTVN = lộ **ngay mỗi câu**. (Cờ tùy chọn `khoa_reveal` cho ET — mặc định OFF; Thùy đã chốt "có người trông thi", không cần chống-mách phức tạp.)
8. **ET → mastery** (supervised trên lớp): sync vào `gami_grades(phase='et')` → mastery engine + màn Điểm số + reveal chạy NGUYÊN, KHÔNG sửa. **BTVN → tham khảo** (`btvn_ket_qua`, KHÔNG mastery/Elo — đúng chính sách hiện có).
9. **ET online auto-grade ⇒ XÓA task "Chấm ET" của TG** trong `getMyTasks`. Thay bằng task "Duyệt báo sai" chỉ hiện khi có report.

---

## 2. ⚠ BƯỚC 0 — VERIFY TRƯỚC KHI VIẾT CODE (đừng đoán, theo rule SQL của repo)
Chạy `claude_ro`/`information_schema` xác nhận, ghi kết quả vào DEVLOG rồi mới build:

1. **Login HS** (load-bearing cho RLS submission): hiện `tai_khoan.id = auth.uid → nhan_su` (STAFF). HS đăng nhập bằng gì? auth.uid của HS map sang `hoc_sinh.id` qua bảng nào? → cần 1 RPC `my_hoc_sinh_id()` (security-definer) tương tự `my_quyen()`. **Nếu HS chưa có kênh login → đây là việc net-new phải làm TRƯỚC** (Thùy nói "đã có / rất dễ" — verify thật).
2. **Loại `dung_sai` (4 ý)**: Thùy đang làm, CHƯA vào HANDOFF. Xác định: lưu đáp án 4-bool ở đâu (`lua_chon`? cột mới?) + **thang điểm partial** (vd 1ý=0.1 · 2ý=0.25 · 3ý=0.5 · 4ý=1.0). → quyết **map về `gami_grades.result {correct/partial/wrong}`** thế nào (ngưỡng nào ra `correct`/`partial`/`wrong`). KHÔNG build `dung_sai` tới khi chốt cái này.
3. **`dap_an` câu `tra_loi_ngan` trong kho** đã là SỐ chuẩn máy-so-được chưa, hay đang text/lời giải? Grep câu `tra_loi_ngan` cấp-3 thật. Nếu bẩn → cần bước chuẩn hóa khi snapshot (hoặc cảnh báo người soạn).
4. **`loai_cau` enum hiện có gì** (`dai_cau_hoi.loai_cau`) — `4_dap_an`/`tra_loi_ngan` đã có; `dung_sai` thêm mới thì **nới CHECK/enum cùng migration** (bài học 0045: thêm giá trị cho cột có CHECK = phải nới constraint cùng lúc, không là insert 400).
5. **RLS convention vs HS-facing**: repo quy ước "data tables DISABLE RLS, chỉ staff ENABLE". **Submission HS-facing là NGOẠI LỆ** — BẮT BUỘC ENABLE RLS, scope theo HS (xem §4). Verify `pg_tables.rowsecurity` trước khi viết policy.

---

## 3. KIẾN TRÚC (3 tầng — đừng trộn)
```
KHO (soạn)            tai_lieu + tai_lieu_cau → ma_cau (dai_cau_hoi / theo môn)
   │  Phát hành (snapshot đề+key 1 lần)
   ▼
TEST đông cứng         bai_test + bai_test_cau     [staff tạo, HS read-only]
   │  HS làm
   ▼
SUBMISSION HS-facing   bai_lam + bai_lam_cau       [RLS: HS chỉ ghi/đọc của mình]
   │  auto-chấm tại đây
   ▼
ĐO LƯỜNG staff-side    gami_grades(phase='et')  /  btvn_ket_qua   [sync verdict]
```
- **Snapshot 1 chiều**: kho → bai_test (lúc phát hành). Sau đó test SỐNG ĐỘC LẬP với kho. `bai_test_cau.ma_cau` giữ lại CHỈ để truy nguồn (report→backfill), KHÔNG để chấm.
- **Đừng hardcode `dai_cau_hoi`**: resolve câu theo `tai_lieu.mon` (seam như `branches.ts cauTbl`) — KP≡ma_dang mon-unique, để đa môn không phải sửa lại.

---

## 4. DATA MODEL (bảng mới — migration kế tiếp)
> Verify `information_schema.columns` cho mọi bảng JOIN trước khi viết SQL (rule repo).

### `bai_test` — 1 lần phát hành 1 doc cho 1 lớp (instance đông cứng)
- `id` · `nguon_tai_lieu_id`→tai_lieu · `lop_id` · `ngay` · `loai` ∈ {`et`,`btvn`} · `mon`
- `trang_thai` ∈ {`mo`,`dong`} · `mo_at` · `dong_at` · `deadline` (từ `tuan.ts`: ET=12h hôm sau · BTVN=2h trước ca kế)
- `khoa_reveal` bool default false (ET tùy chọn giữ đáp án tới khi đóng)
- `created_by`
- Gắn buổi qua (lop_id+ngay) như ET hiện tại — KHÔNG FK buoi_hoc.id.

### `bai_test_cau` — câu ĐÔNG CỨNG (snapshot)
- `id` · `bai_test_id` · `thu_tu` · `ma_cau`(nguồn, truy vết) · `loai_cau`
- `noi_dung`(snapshot đề) · `lua_chon`(jsonb snapshot) · **`dap_an_key`**(jsonb snapshot = KEY để chấm) · `diem`(trọng số, default 1)
- Đây là nguồn chấm. KHÔNG đọc kho lúc chấm.

### `bai_lam` — bài làm của 1 HS cho 1 test (HS-facing) — **ENABLE RLS**
- `id` · `bai_test_id` · `hoc_sinh_id` · `trang_thai` ∈ {`dang_lam`,`da_nop`} · `bat_dau_at` · `nop_at`
- Tạo SLOT lúc HS mở lần đầu (như roster). 1 HS / 1 test (ET=nộp 1 lần khóa; BTVN=sửa được tới deadline).
- **RLS**: `hoc_sinh_id = my_hoc_sinh_id()` cho select/insert/update của HS · staff (my_quyen) đọc cả lớp.

### `bai_lam_cau` — đáp án HS + verdict = **PHÉP ĐO** (anti-NULL §1.5: chỉ sinh khi HS trả lời) — **ENABLE RLS**
- `id` · `bai_lam_id` · `bai_test_cau_id` · `dap_an_hs`(jsonb) · `verdict` ∈ {`correct`,`partial`,`wrong`} · `diem` · `cham_boi` ∈ {`exact`,`cache`,`manual`} · `cham_at`
- Bất biến sau nộp (ET). Re-chấm manual = ghi đè CÓ LOG (xem §7).

### Tái dùng (KHÔNG tạo lại)
- `accepted_answers` (V1 — cache đáp-án-chuẩn-hoá cho `tra_loi_ngan`). Verify còn ở v2 chưa; chưa thì port.
- `gami_grades(phase='et')` + `gami_session_problems(phase='et')` — ET sync vào đây (xem §6).
- `btvn_ket_qua` — BTVN sync vào đây.

---

## 5. LUỒNG
### 5.1 Phát hành (staff)
Trên doc ET/BTVN đã bám (lớp+ngày): nút **"Phát hành test online"** → tạo `bai_test` + copy từng câu (`tai_lieu_cau`→resolve kho→`bai_test_cau` snapshot đề+key). Idempotent (1 doc×lớp×ngày = 1 bai_test; phát lại = cảnh báo).

### 5.2 HS làm (mobile-first)
- HS login → list `bai_test` của các lớp mình ĐANG ghi danh (live-derive) × trạng thái (chưa làm / đã nộp) + deadline + đếm ngược.
- Mở bài → tạo `bai_lam` slot → render câu theo `loai_cau` (UI điền đáp án, đề đọc trên giấy). Mỗi câu trả lời → upsert `bai_lam_cau` + **auto-chấm tức thì** (§6).
- **BTVN**: lộ verdict + đáp án NGAY mỗi câu. Sửa lại được tới deadline.
- **ET**: KHÔNG lộ gì khi đang làm. Bấm **Nộp** → khóa `bai_lam` (`da_nop`) → lộ verdict + đáp án cả bài (trừ khi `khoa_reveal`).

### 5.3 Vào đo / report (§6, §7)

---

## 6. AUTO-CHẤM (per loại câu)
| loại | cách chấm | kết quả | AI? |
|---|---|---|---|
| `4_dap_an` | `dap_an_hs == dap_an_key` | correct / wrong | KHÔNG |
| `dung_sai` | so 4 ý exact → đếm đúng → thang partial (Bước 0.2) | correct/partial/wrong + điểm thô lưu cho HS xem | KHÔNG |
| `tra_loi_ngan` | `smartNormalize(hs)`==`normalize(key)` → check `accepted_answers` | correct / **wrong→cho report** | KHÔNG (v1) |

- `cham_boi`: exact (match key) / cache (match accepted_answers) / manual (người duyệt sau report).
- **Sync sang đo lường** khi: ET = lúc HS **nộp** (đẩy verdict mọi câu vào `gami_grades` phase='et', map câu↔`gami_session_problems(problem_no)` theo thứ tự; reuse `gradeET`/closePhase NGUYÊN). BTVN = ghi `btvn_ket_qua` (tham khảo), KHÔNG mastery/Elo.
- **Ghi `nop_at`/`bat_dau_at`** ngay từ v1 (rẻ, append-only) để **Elo cấp 3 dùng tốc-độ sau** — nhưng KHÔNG tính Elo bây giờ.

---

## 7. CHẤM LẠI + BÁO SAI (đúng pattern V1 báo-sai→duyệt→backfill)
- **HS report** (chủ yếu `tra_loi_ngan` `wrong` mà HS tin mình đúng): nút "Báo sai" cạnh verdict → tạo report (bai_lam_cau_id + ý kiến HS).
- **Người duyệt** (staff): xem report → nếu HS đúng → thêm đáp án vào `accepted_answers` (backfill, lần sau auto đúng) + sửa `bai_lam_cau` HS đó.
- **Sửa KEY sai (cả lớp)**: KHÔNG liveref, KHÔNG re-chấm ngầm. Sửa `dap_an_key` trên `bai_test_cau` (hoặc kho cho lần sau) → nút **"Chấm lại câu N / lớp Y"** → xác nhận → re-chấm scope CỨNG theo bai_test + câu → **in before/after + log** (vd "5 HS Sai→Đúng"). Đồng bộ lại `gami_grades` tương ứng.
- Task "Duyệt báo sai" hiện trong `getMyTasks` CHỈ khi có report (thay cho task "Chấm ET" cũ).

---

## 8. PHÂN MÔN / TÁI DÙNG
- Resolve câu theo `tai_lieu.mon` (đừng hardcode `dai_cau_hoi`); snapshot xong thì môn không còn liên quan (đã đông cứng).
- Tái dùng V1: `smartNormalize`, `accepted_answers`, report→duyệt→backfill, streak (nếu gắn gamification sau).
- UI HS-facing = **GAME** (Fredoka/mascot/gradient), KHÁC staff Apple-clean. Dựng **mockup (visualize) duyệt hướng TRƯỚC** khi code thật.

---

## 9. NGOÀI SCOPE / ĐỂ MỞ
- **Elo cấp 3** (logic tốc-độ, khác cấp 2) — tính sau; v1 chỉ GHI `nop_at` để sẵn data.
- **Tự luận online** — không làm (không auto-chấm được).
- **AI-chấm `tra_loi_ngan`** — mặc định không; thêm khi cache chưa đủ và report quá tải.
- **Cổng "≥95% auto"** — với trắc nghiệm exact thì luôn 100%, không cần; chỉ là khái niệm cho `tra_loi_ngan` nếu sau này bật AI. Đo = (auto khớp người-duyệt)/(tổng đã duyệt).
- **Auto-phát-hành khi mở buổi** — v1 phát hành tay; nối buổi sau.
- **Per-câu timing** — v1 chỉ bài-level (bat_dau/nop); chi tiết hơn để sau.

---

## 10. BÀI HỌC PHẢI TUÂN (đừng đạp lại — trích HANDOFF ②)
- Roster/gán = **live-derive**, đừng snapshot lúc tạo.
- List update-tại-chỗ phải có **thứ tự tường minh** (`.order()`/sort client).
- "1 lần/đối tượng" (nộp, chấm lại) phải **claim atomic** (`update … where … is null`), đừng guard-đọc-rồi-ghi.
- Thêm giá trị enum/CHECK (`loai_cau` dung_sai, `phase`…) → **nới constraint CÙNG migration** + grep code dùng giá trị mới.
- `catch{}` đừng nuốt lỗi map về 1 trạng-thái-rỗng (vụ "Chưa có BTVN" giả).
- `ensure*` slot → **unique + upsert ignoreDuplicates** (StrictMode chạy effect 2 lần).
- Migration áp LẺ từng file (`_apply_one.mjs <file.sql>`), xong `npm run schema`. Verify `information_schema`/`pg_tables.rowsecurity` TRƯỚC khi viết SQL.

---

## 11. THỨ TỰ BUILD ĐỀ XUẤT
1. **Bước 0 verify** (§2) → ghi DEVLOG.
2. **BTVN online trước** (rủi ro thấp: tham khảo, reveal ngay, làm lại OK, gian lận vô hại) — chỉ `4_dap_an` + `tra_loi_ngan`.
3. Migration bảng mới (§4) + RLS HS + RPC `my_hoc_sinh_id()`.
4. Phát hành + render mobile + auto-chấm exact + report→backfill.
5. **Thêm `dung_sai`** sau khi Bước 0.2 chốt thang partial.
6. **ET online** (snapshot + nộp-1-lần + reveal-sau-nộp + sync `gami_grades` + xóa task chấm ET TG + chấm-lại-manual).
7. Skin game HS-facing (mockup duyệt trước).
