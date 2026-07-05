# Cảnh báo sớm & Bổ trợ (playbook) — Feature Spec · BKdemy ERP

Phát hiện HS rủi ro sớm → quyết định phương án (playbook) → chạy bổ trợ → đo hiệu quả → **học từ case để playbook tiến hoá**. Đây là *lý do tồn tại* của toàn bộ data mastery. Bản chất = một **vòng khép kín có case log làm xương sống**.

> **ĐỌC TRƯỚC KHI CODE:** `HANDOFF.md` + `CLAUDE.md`. Đây là tầng **THÔNG MINH/ĐIỀU PHỐI** trên các hệ đã có (mastery, Bổ trợ, tài liệu, TKB, `canh_bao_yeu`, DAG tiền quyết) — **KHÔNG phải 4 hệ mới**. Verify schema trước. Reuse tối đa. RLS: data DISABLE / staffs ENABLE. Staff-only (HS-realm không đụng). Org-wide, không chia môn ở tầng vòng (nhưng vấn đề/dạng thì bám môn).

---

## 0. Nguyên tắc nền

1. **Case log là xương sống — dựng TRƯỚC, mọi mắt xích ghi vào.** Bỏ nó thì cả mảng thành đồ chơi: không đo được hiệu quả, không học được, không kiếm được quyền tự động. Mọi thứ khác bám quanh nó.
2. **Không quy kết nhân quả.** "Sau bổ trợ HS có khá lên không" — tăng thì tính là có hiệu quả, đủ nhiều ca thì kết luận về *loại/playbook* tự chắc. KHÔNG cố tách "khá lên nhờ cái gì" (bất khả thi + không cần).
3. **Tự động hoá là PHẦN THƯỞNG KIẾM ĐƯỢC, không phải nút bật.** Lộ trình người → AI đề xuất/người duyệt → AI tự chạy/người review: mỗi nấc chỉ mở khi case log + #4 chứng minh đủ tốt. v1 = **AI đề xuất, người duyệt (bắt DELTA)**.
4. **Wellbeing:** gắn nhãn rủi ro lên trẻ vị thành niên + động tới HS/PH → mọi hành động qua **người duyệt** ở phase đầu; mức nặng phải ký chắc. Báo nhầm cũng gây hại.

---

## 1. Vòng lõi (4 mắt xích + case log)

```
Phát hiện ─► Quyết định ─► Chạy bổ trợ ─► Đánh giá
   │             │             │            │
   └──────┬──────┴──────┬──────┴─────┬──────┘   (mọi mắt xích GHI vào)
          ▼             ▼            ▼
   ┌────────────────────────────────────────┐
   │ CASE LOG (xương sống)                    │
   │ tín hiệu+mức → playbook → đề xuất AI →   │
   │ NGƯỜI SỬA GÌ+LÝ DO → plan → pre/post     │
   └────────────────────────────────────────┘
          ↻ nuôi lại "Quyết định" (playbook học/tiến hoá) + là thước autonomy
```

---

## 2. Mắt xích #1 — Phát hiện (deterministic, KHÔNG phải AI)

- **v1 chỉ rủi ro KIẾN THỨC** (mastery). Động lực/thái độ = phase sau.
- **Bắt SỚM, không đợi mức sàn** — dùng leading indicators có sẵn:
  - **Mastery đang TỤT** (5 lần gần nhất đi xuống) — bắt lúc đang rơi.
  - **Thủng TIỀN QUYẾT** — DAG tiền quyết + queue-fail đã có: fail dạng nền → *sắp* fail chuỗi sau.
  - (mastery tuyệt đối thấp vẫn dùng, nhưng đó là muộn).
- **Output = MỨC (triage), không phải cờ có/không.** Hai băng:
  - **Cảnh báo** (quét RỘNG, rẻ, chấp nhận báo nhầm — chỉ là cờ theo dõi).
  - **Xử lý** (bar CAO, vì tốn người/phòng/lịch thật) — chia **nhẹ / nặng**.
  - Mức → **cường độ can thiệp** (nhẹ = nhắc BTVN/định kỳ; nặng = bổ trợ đuổi/KHHT).
- Reuse: mastery engine (`getMasteryHS`), `canh_bao_yeu` (mầm sẵn), DAG/queue tiền quyết. Deterministic bằng rule + ngưỡng (chỉnh được).

---

## 3. Mắt xích #2 — Quyết định = PLAYBOOK (chỗ AI vào)

**Playbook = chính sách quyết định viết thành DATA** (không nằm trong đầu người). Cùng một kết quả nhưng HS khác vấn đề → xử khác → mỗi cái một playbook.

- **Playbook = entity:** *điều kiện áp* (loại vấn đề + mức + đặc điểm HS/phân khúc) → *chuỗi hành động* (loại bổ trợ, tài liệu, nhịp) — hành động lắp từ **catalog** (thư viện can thiệp = 5 loại bổ trợ có sẵn + tài liệu).
- **Chính sách bổ trợ = tập playbook đang hiệu lực** tại một thời điểm = đường lối chung. **Đổi CHẬM (vài tháng/period).**
- **1 period = 1 chính sách chung. Mỗi loại vấn đề đúng 1 playbook. KHÔNG phân thân, KHÔNG A/B song song** (2 HS giống nhau xử khác nhau = loạn vận hành + chẻ mẫu). So sánh **theo THỜI GIAN, không theo không gian** (§6).
- **AI ở đây (v1):** cho một ca (vấn đề + mức), AI **chọn/áp playbook khớp** + diễn giải, có thể **gắn cờ ca đặc biệt** (không khớp playbook nào). **v1 = luật/playbook-based** (rule + mastery + catalog + LLM diễn giải), CHƯA "học". Học bồi sau từ case log.
- **Người duyệt — BẮT DELTA (sống-chết):** không cho approve trơn. Hệ ghi **người sửa gì so với đề xuất AI + LÝ DO**. Approve mù = data rác + rubber-stamp lọt lỗi. Tín hiệu học nằm ở *delta*, không ở *approve*.

---

## 4. Mắt xích #3 — Chạy bổ trợ (gần như KHÔNG code mới)

- Nối vào hệ **Bổ trợ + tài liệu + TKB đã có** (bù/yếu/đuổi/định-kỳ/ôn-thi; `buoi_hoc loai='bu'/'bo_tro_duoi'`; xếp người/phòng/lịch; làm tài liệu). **KHÔNG dựng scheduling mới.**
- Từ playbook đã duyệt → **châm ngòi** các hành động: tạo case bổ trợ, gợi ý người/phòng/lịch, gắn tài liệu. Xếp cụ thể **người hỗ trợ** ở v1 (system gợi ý, người đặt) — đúng nhịp autonomy phase đầu.
- Đây là mắt xích nhẹ nhất. Việc mới = *orchestration + link*, không phải subsystem.

---

## 5. Mắt xích #4 — Đánh giá (đo TRỰC TIẾP HS được bổ trợ)

- **Per-CA, 2 mốc** (mỗi mốc bắt một thứ khác nhau):
  - **post-1 = cuối buổi bổ trợ** → *tiếp thu tức thì* (buổi có "vào đầu" không).
  - **post-2 = sau đủ 5 lần chạm dạng đó** → *giữ được không* (đọng lại hay bốc hơi). ⚠ Vì mastery = TB 5 lần gần nhất → post phải đợi **đủ số lần đo mới**, đo ngay = số đẹp giả.
  - **Tín hiệu quý: "lên rồi rớt"** (post-1 cao, post-2 tụt) = buổi *nhồi* chứ không *dạy hiểu* → data để playbook học đổi cách. Một mốc thì mù chuyện này.
- **So pre → post trên đúng dạng đã bổ trợ.** Tăng = tính là có hiệu quả (không quy kết nhân quả). Regression-to-mean tự loãng khi **đủ ca**.
- **Per-LOẠI/PLAYBOOK = gộp nhiều ca** → nuôi benchmark + autonomy + học (§6).

---

## 6. Playbook quality + Benchmark (cơ chế tiến hoá — LÕI)

> ⚠ **Đo quality PLAYBOOK ≠ đo hiệu quả CA.** Hiệu quả ca (#5) = HS có lên không. Quality playbook = playbook có tốt hơn **mặt bằng trên cùng phân khúc** không → quyết nhân rộng / giết.

Vòng benchmark (so theo THỜI GIAN, không chẻ mẫu):
1. Trong một **period**: cả trung tâm chạy **một chính sách chung**; mỗi loại vấn đề 1 playbook.
2. Mỗi playbook tích ca → ra **con số hiệu quả**.
3. **Benchmark THEO PHÂN KHÚC (chuẩn hoá độ khó):** playbook xử ca nặng so với *mặt bằng ca nặng*, KHÔNG so một con số chung (kẻo giết oan playbook xử ca khó).
4. **Gate CỨNG "đủ mẫu + đủ thời gian":** chưa đủ N ca / T thời gian → playbook ở trạng thái **"đang thử", MIỄN đánh giá** (không cho benchmark đụng → khỏi giết vì xui 8 ca đen).
5. Cuối period: **trên benchmark → giữ; dưới → THAY bằng ứng viên mới.** Nguồn ứng viên: người rút từ case log / AI đề xuất biến thể từ ca thành công. **Loại tệ + NẠP ứng viên = một vòng, không chỉ cắt** (cắt mà không đắp = lỗ hổng).
6. Lặp period → playbook tệ rụng dần, mặt bằng đi lên. **Ít rủi ro vì đổi chậm + không chẻ mẫu.**

**Cách XÂY playbook = 2 giai đoạn của 1 vòng, KHÔNG phải 2 lựa chọn:**
- **Cách 1 (nền):** vài playbook chung THÔ trước — để mọi ca xử theo *một khung nhất quán*.
- **Cách 2 (tiến hoá):** chạy N ca theo khung đó → review case log → rút playbook phổ biến / tách ca đặc biệt / giết cái tệ.
- Cách 2 **ăn trên đầu ra Cách 1** (không có khung chung thì 200 ca = 200 quyết định ngẫu hứng, review không ra pattern). → **bắt buộc Cách 1 trước.**

---

## 7. Lộ trình tự-động-hoá & Học (kiếm được, không bật)

- **Phase A (v1):** người quyết là chính; **AI đề xuất playbook, người duyệt + bắt delta**. Mọi hành động chạm HS/PH qua người.
- **Phase B:** khi case log chứng minh đề xuất AI **khớp người + kết quả tốt** trên đủ ca → AI tự chạy mức nhẹ, người chỉ review; mức nặng vẫn người ký.
- **Cơ chế học (KHÔNG fine-tune model)** — dạng *case-based / eval-driven* (~reinforcement learning nhưng thực dụng): case log (đề xuất + **delta người sửa** + outcome) → tiền lệ/rule/biến thể playbook. **Chỉ học được nếu mọi delta + mọi outcome được ghi có cấu trúc.** Không capture = không học.

---

## 8. Phạm vi v1

**IN:**
- **Phát hiện** deterministic: mastery + trend + tiền quyết → **mức** (Cảnh báo/Xử lý nhẹ-nặng).
- **Playbook** entity + catalog (map 5 loại bổ trợ có sẵn) + **Cách 1** (vài playbook chung thô, người thiết kế).
- **Quyết định:** AI đề xuất playbook khớp → **người duyệt, hệ BẮT DELTA + lý do**.
- **Chạy:** orchestration nối hệ Bổ trợ/tài liệu/TKB (không code scheduling mới).
- **Đánh giá:** pre → post-1 (cuối buổi) → post-2 (sau 5 lần), per-ca; gộp per-playbook.
- **CASE LOG** (central, dựng sớm): ghi trọn vòng.
- **Benchmark/period** (§6): benchmark theo phân khúc + gate đủ-mẫu + giữ/thay + nguồn ứng viên. (Cơ chế build v1, chỉ *bite* khi đủ data.)

**OUT (phase sau):**
- Rủi ro động lực/thái độ. AI *học* nâng cao (case-based improve) + tự-chạy mức nhẹ. Probe tự động. A/B (đã bác — không làm).

---

## 9. Data model (reuse — verify trước)

- `van_de` (risk case): `hoc_sinh_id`, `loai_van_de` (v1: dạng/kiến thức, bám môn), `muc` (canh_bao/xu_ly_nhe/xu_ly_nang), `tin_hieu` jsonb (snapshot mastery/trend/tiền-quyết lúc phát hiện), `phan_khuc` (độ khó), `trang_thai`.
- `playbook`: `dieu_kien_ap` (loại vấn đề + mức + phân khúc), `chuoi_hanh_dong` (ref catalog), `trang_thai` (dang_thu/hieu_luc/loai), `period`, số liệu hiệu quả tổng hợp.
- `catalog_can_thiep`: bước can thiệp (loại bổ trợ [ref hệ Bổ trợ], tài liệu, nhịp).
- `case` (**CASE LOG** — trung tâm): `van_de_id`, `playbook_id` áp, `de_xuat_ai` jsonb, `nguoi_duyet`, `delta` jsonb (**sửa gì**), `ly_do`, `plan` (link `buoi_hoc` bổ trợ), `pre`, `post1`, `post2`, `ket_qua`.
- `benchmark`: per `phan_khuc` × `period`.
- Reuse (KHÔNG tạo lại): mastery, `canh_bao_yeu`, `buoi_hoc(loai='bu'/'bo_tro_duoi')`, DAG/queue tiền quyết, tài liệu, TKB.

> Verify `information_schema` + `pg_tables.rowsecurity` trước migration. Grep chỗ dùng cũ trước khi đổi.

---

## 10. Các bước build (cho Claude Code)

1. Đọc HANDOFF+CLAUDE. Audit: mastery engine, `canh_bao_yeu`, DAG/queue tiền quyết, hệ Bổ trợ, tài liệu, TKB.
2. **CASE LOG trước** (`case`) + `van_de` — xương sống, mọi thứ ghi vào.
3. Phát hiện: rule mastery+trend+tiền-quyết → `van_de` với `muc`+`phan_khuc`. Ngưỡng chỉnh được.
4. `playbook` + `catalog_can_thiep` (map 5 loại bổ trợ) + seed vài playbook Cách-1.
5. Quyết định: AI đề xuất playbook khớp (rule+LLM) → UI người duyệt **bắt delta+lý do** (không approve trơn).
6. Chạy: orchestration châm ngòi Bổ trợ/tài liệu có sẵn (gợi ý người/phòng/lịch, người đặt).
7. Đánh giá: pre/post-1/post-2 (đợi đủ 5 lần cho post-2) → ghi vào case; gộp per-playbook.
8. Benchmark/period: benchmark theo phân khúc + gate đủ-mẫu (trạng thái "đang thử") + review giữ/thay + nguồn ứng viên.
9. RLS chuẩn. `tsc` sạch. Test 1 ca end-to-end (phát hiện→playbook→duyệt+delta→chạy→pre/post→ghi case).

---

## 11. Definition of Done

- 1 ca end-to-end: HS bị mastery tụt/thủng tiền quyết → tạo `van_de` đúng **mức** → AI đề xuất playbook → **người duyệt CÓ ghi delta+lý do** → châm ngòi bổ trợ có sẵn → pre/post-1/post-2 → **case log ghi trọn vòng**.
- Phát hiện là deterministic (không AI), output là **mức** (không cờ có/không), bắt được **tụt + tiền quyết** (không chỉ mức sàn).
- Playbook là **data** (điều kiện→hành động); 1 period 1 chính sách, mỗi vấn đề 1 playbook; **không A/B song song**.
- Approve trơn bị chặn — **buộc ghi delta** khi người sửa khác đề xuất AI.
- Đánh giá đo **trực tiếp** HS được bổ trợ, 2 mốc, post-2 đợi đủ 5 lần; bắt được "lên rồi rớt".
- Benchmark **theo phân khúc**; playbook chưa đủ mẫu = "đang thử" **miễn đánh giá**; dưới benchmark → thay **kèm nguồn ứng viên** (không cắt trơ).
- Chạy = **reuse** Bổ trợ/tài liệu/TKB, không scheduling mới.
- Case log ghi đủ để (a) đo hiệu quả, (b) đo quality playbook, (c) có delta+outcome cho học sau. Verify schema, RLS chuẩn, `tsc` sạch.

---

## Goal / Kickoff

> Kick 1 câu (auto mode): *"Đọc BKDEMY_CANHBAO_BOTRO_SPEC.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build hệ Cảnh báo sớm & Bổ trợ theo spec này, tới khi đạt HẾT "Definition of Done".

**ĐỌC TRƯỚC (bắt buộc):** HANDOFF.md + CLAUDE.md + toàn bộ spec này.

**KỶ LUẬT:**
- Verify schema TRƯỚC mọi migration (`information_schema.columns` + `pg_tables.rowsecurity`). Grep repo trước khi đổi.
- Reuse > đẻ mới: mastery/`canh_bao_yeu`/DAG tiền quyết/hệ Bổ trợ/tài liệu/TKB. KHÔNG dựng scheduling mới, KHÔNG dựng lại mastery.
- **CASE LOG dựng trước** — mọi mắt xích ghi vào nó.
- Phát hiện deterministic (không AI); AI chỉ ở "Quyết định" (đề xuất playbook, người duyệt bắt delta).
- KHÔNG A/B song song. KHÔNG quy kết nhân quả. Mọi hành động chạm HS/PH qua người duyệt.
- RLS: data DISABLE / staffs ENABLE. Staff-only.

**VÒNG LÀM** (theo "Các bước build", từng bước, tự lặp tới hết): implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → bước tiếp.

**DỪNG & HỎI khi:** fork spec không cover · cần xoá/drop/migration phá dữ liệu (giải thích trước, chờ tao gật) · đụng mastery/bổ trợ/HS thật gây rủi ro. Chưa chắc thì hỏi, đừng đoán.

**XONG khi:** mọi Definition of Done đạt + `tsc` sạch + 1 ca chạy end-to-end (phát hiện→playbook→duyệt+delta→bổ trợ→pre/post→case log). Báo tao khi xong hoặc kẹt.
