# PLAN — Đánh giá kết quả học tập, theo `spec-danhgia-hoctap.md`

> **PHA 0 XONG.** Đã đọc spec + `ket-qua-hoc-tap-tong-quan.md` + `CLAUDE.md` + `HANDOFF.md`;
> đã chạy verify §8 trên DB thật (`scripts/verify_danhgia_hoctap.mjs`, role `claude_ro`, chỉ SELECT)
> → kết quả đầy đủ ở `docs/verify-danhgia-hoctap.md`; đã đọc thật `src/gami/mastery.js`,
> `src/lib/mastery.ts`, `src/lib/botro_duoi.ts`, `src/lib/botro.ts`.
> Bản này để **Thùy duyệt trước khi code + chạy migration** (Claude chỉ có `claude_ro`, không tự chạy được).

---

## 0. Bốn quyết định Thùy đã chốt (07-22)

| Câu | Chốt | Ảnh hưởng |
|---|---|---|
| Ngưỡng vào diện | **Giữ spec: dạng < 0.5 = yếu là phải bổ trợ, 1 dạng yếu đủ xuống L1** — với điều kiện **"đủ số lần đánh giá"** | Gate = ĐỘ TIN (số lần đo), KHÔNG phải số lượng dạng yếu. Xem §1.C. |
| Dài hạn §2.B | **Build luôn, hiện "chưa đủ dữ liệu"** | Đường A + B code ngay, data tự lấp. |
| Trọng số BTVN | **Giữ nguyên spec** (không cap) | BTVN gánh ~43% trend chuyên đề — chấp nhận có chủ đích. |
| Min-n `k` | **Bỏ guard cứng** — vẫn tính, nhưng **hiện cảnh báo dạng/chuyên đề thiếu lần đo** | Lý do Thùy: dạng thiếu lần đo thường là dạng dễ nên ít luyện. Xem §1.C. |

---

## 1. PHẢN BIỆN — chỗ spec lệch hệ thật (phải chốt trước khi code)

### A. ⛔ `bo_tro_duoi` KHÔNG phải đường của HS yếu — spec đang trỏ nhầm bảng

Spec §4.1 ghi *"L2 → tổ chức học bổ trợ riêng (`bo_tro_duoi`)"*, §5 neo outcome vào
`bo_tro_duoi_dang.day_at`, §6 ghi *"`bo_tro_duoi` (nguon='ai_de_xuat')"*.

**Hệ thật:** `bo_tro_duoi` = **bổ trợ ĐUỔI** — HS *mới / vào lớp giữa chừng* học chậm hơn
chương trình lớp (verify: `nguon` chỉ có `thu_cong` + `tuyen_sinh`; `ly_do` thật = *"Vào lớp
giữa chừng"*). Vòng đời của nó: chốt scope dạng + **số buổi dự kiến** → xếp batch cả đợt →
học đủ N buổi có mặt → đóng. **Không liên quan mastery** (spec §0 cũng tự nói vậy).

Bổ trợ **YẾU** là đường khác và **CHƯA BUILD**: `buoi_hoc.loai` có sẵn giá trị `'bo_tro_yeu'`
nhưng **0 buổi**, không có bảng case, `grep` toàn repo chỉ thấy nó trong 1 type union + 1 nhãn UI.

**Hậu quả nếu ghi HS yếu vào `bo_tro_duoi`:** trộn 2 loại case khác bản chất vào 1 bảng →
màn "Bổ trợ đuổi" hiện có đếm sai ngay (`demTabDuoi`, chỉ số *"Xếp x/N · Học y/N"*, luồng
duyệt của team học thuật), và unique partial (HS × lớp, đang-đuổi) chặn HS có nhiều đợt yếu.

**Đề xuất (CTO):** bảng **riêng, đối xứng hình dáng** — `bo_tro_yeu` + `bo_tro_yeu_dang`
(copy đúng cơ chế `day_at`/`day_buoi_id` vì verify cho thấy cơ chế tick "đã dạy dạng" đang
chạy thật, 75% populate). Buổi dùng `buoi_hoc.loai='bo_tro_yeu'` (đã có sẵn trong CHECK).
Đổi lại: `setDangDay`/`listDotDuoi` viết lại 1 bản cho yếu, ~60% code giống — chấp nhận,
vì đây là 2 domain độc lập (§1.6 symmetry test).

> ⚠ **CHỜ THÙY CHỐT.** Không tự đổi bảng trong spec đã chốt.

### B. ✅ CHỐT (Thùy 07-22): theo `spec-danhgia-hoctap` — **máy level CHÍNH LÀ case log**

`BKDEMY_CANHBAO_BOTRO_SPEC.md` (05-07) **chưa build dòng nào** — DB không có `van_de`,
`playbook`, `case`, `catalog_can_thiep`, `benchmark`. Thay không mất gì.

**Thùy chốt:** *"Bản chất việc L1 L2 L3 chính là case log rồi đấy"* → không dựng entity
`case` riêng. Mỗi lần HS chuyển level = 1 dòng lịch sử = 1 mắt xích của vòng.

**BỎ khỏi spec cũ:** `playbook` · `catalog_can_thiep` · `benchmark`/`period` · `van_de`
(máy level §4 thay vai). Lý do: với log rỗng + 5 tuần data, benchmark tự rơi vào gate
"chưa đủ mẫu → miễn đánh giá" của chính spec cũ, build xong sẽ nằm im rất lâu.

**GIỮ (2 thứ spec cũ đúng, spec mới thiếu):**
- **Bắt DELTA khi duyệt** → §1.F đã nuốt luôn, thành **tự động**.
- **Đợi đủ lần đo mới trước khi kết luận outcome** (spec cũ §5: mastery = TB 5 lần gần nhất,
  đo ngay sau bổ trợ = 1 điểm mới trộn 4 điểm cũ ⇒ số đẹp giả). Spec mới §4.1 nói "retest
  > 0.5 thì đóng dạng" mà không nói mấy lần. → xem §1.F cách xử.

### F. ✅ CHỐT (Thùy 07-22): máy level chỉ ĐỀ XUẤT — **người duyệt mới đóng**

*"Đóng L1 vẫn để người đóng. Hệ thống chỉ đề xuất thôi còn người duyệt. Ghi lại log của
toàn bộ duyệt để sau này analys."*

⇒ Sửa §4.1/§4.2 của spec: máy **KHÔNG tự** lên/xuống level. Máy tính ra **đề xuất + lý do +
bằng chứng**; người bấm mới đổi thật.

**Thiết kế log (thoả cả §1.5 chống-NULL lẫn §4 pure-derive):**
- **Đề xuất = PURE-DERIVE, KHÔNG đẻ dòng chờ.** Đúng luật "không có bảng `tasks`, không đẻ
  row placeholder" — đề xuất là query, không phải bản ghi.
- **Chỉ khi người bấm duyệt mới INSERT 1 dòng** `hs_level_log`, ghi **cả hai vế**:
  `level_cu · level_may_de_xuat · ly_do_may (jsonb: snapshot tín hiệu lúc đề xuất)`
  · `level_chot · ly_do_nguoi · actor · ts`.
- **Delta bắt được TỰ ĐỘNG:** `level_chot ≠ level_may_de_xuat` là lộ ngay — không cần người
  tự khai "tôi đã sửa gì". Đây chính là thứ spec cũ phải bắt thủ công.
- Bảng `hs_level` chỉ giữ **trạng thái hiện tại** (đọc nhanh); lịch sử nằm ở log. Đúng luật
  "1 cột trạng thái hiện tại + dòng lịch sử".

**Về "đợi đủ lần đo" (§1.B):** vì người quyết chứ không phải máy, **KHÔNG gate cứng**. Máy
hiện thẳng bằng chứng để người tự cân: *"đã có N lần đo giám sát (ET/MT) kể từ `day_at`"* +
cờ **"lên rồi rớt"** (ngay sau bổ trợ thì lên, các lần sau tụt = buổi đó nhồi chứ không dạy
hiểu). Người nhìn N=1 thì tự biết chưa nên đóng — không cần luật chặn.

### C. ⚠ "Đủ số lần đánh giá" — đề xuất chốt `n ≥ 3`, và cảnh báo ăn theo

Đo thật trên roster Toán (246 HS), gate = tổng số lần đo của dạng:

| gate | HS có ≥1 dạng yếu | % roster | số ô yếu |
|---|---|---|---|
| n≥1 (không gate) | 189 | 76,8% | 609 |
| **n≥3** | **119** | **48,4%** | **276** |
| n≥5 | 96 | 39,0% | 196 |

**210/609 ô yếu (35%) chỉ có ĐÚNG 1 lần đo** — tức "1 câu sai → dán nhãn yếu → gọi bổ trợ".
Đề xuất `n ≥ 3` vì **không phải số mới**: engine mastery hiện có đã định nghĩa `TIN_TB = 3`
(n≤2 = độ tin **thấp**). Gate = "độ tin không-thấp", nhất quán toàn hệ, không thêm hằng số.

Đây cũng chính là chỗ **cảnh báo thiếu lần đo** mà chị muốn: dạng/chuyên đề `n ≤ 2` vẫn hiện
số + hiện **cờ "ít lần đo"**, nhưng **không tự đẩy vào diện bổ trợ** cho tới khi đủ 3 lần.

### D. ✅ CHỐT (Thùy 07-22): giữ 2 ô — và cặp 2 số thành TÍN HIỆU, không chỉ để nhìn

Màn "Kết quả học tập" **giữ nguyên 2 ô** như hiện có: ① chỉ ET+MT · ② gộp tất cả
(BTVN + Bổ trợ). Không đụng gì.

**Máy level dùng bản GỘP** (đúng trọng số spec §9 ET2/MT3/BTVN1).
Lý do đo được, không phải chọn bừa:

| | chỉ ET+MT | gộp BTVN |
|---|---|---|
| HS có ≥1 dạng yếu (gate n≥3) | 86 | **121** |
| ô yếu | 199 | **278** |

Nghịch lý đáng ghi: **BTVN dễ hơn thật** (tỉ lệ đúng TB: BTVN **0,854** · ET 0,799 · MT 0,647)
nên nó **kéo điểm LÊN** — trong các ô có ở cả 2 cách tính: **235 ô "yếu → hết yếu"** nhờ BTVN,
chỉ **46 ô** đi ngược lại. Nhưng tổng diện vẫn RỘNG hơn khi gộp, vì BTVN đẩy thêm nhiều ô
vượt gate độ tin n≥3, và phần lớn ô mới đó yếu thật.

⇒ **Cờ "BTVN che"**: ô **yếu theo ET+MT** nhưng **hết yếu khi gộp** (235 ô) = đáng nghi nhất —
kém ở bài có giám sát, ổn ở bài tự làm ở nhà. Đây là ý 2-ô của Thùy dùng làm **tín hiệu chẩn
đoán trong máy level**, không chỉ là 2 con số để nhìn. Vá luôn điểm mù false-negative mà
spec §5 tự nhận "chưa build v1".

### E. Ghi nhận (không chặn, em tự xử)

- **`ma_dang` trùng số 30 mã** giữa `dai_ban_do`/`khtn_ban_do` (07-14 ghi 17 → đang tăng).
  Mọi query của module **suy `mon` TRƯỚC rồi mới tra 1 bảng** (`khoCuaMon`), cấm union-rồi-join.
- **Buổi bù `lop_id` NULL** → mất nhãn môn (134 lần đo). Fallback: `buoi_hoc_hs.bu_cho_buoi_id`
  → buổi gốc → `lop.mon`. Đã verify phục hồi 100%.
- **`bt_grades` rỗng · test online ~20 dòng** → 2 nguồn coi như chưa tồn tại, không thiết kế phụ thuộc.
- **`tien_quyet` chưa có bảng** → kênh ④ chạy chế độ "GV tự chọn dạng nền", `// TODO(tienquyet)`.
- **11/32 lớp Toán < 8 HS** (min 1) → nhánh "lùi lên khối" là ca THƯỜNG, phải test kỹ, không phải edge case.

---

## 2. Reuse map (đã verify code + DB thật)

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| `masteryOfDang` (`src/gami/mastery.js`) | ✅ Dùng thẳng | Đúng công thức spec §1 tầng DẠNG: 5 gần nhất, weighted, ngưỡng 0.8/0.5. `MASTERY_CONFIG.WEIGHT` đã có et2/mt3/btvn1. **Không viết engine mới.** |
| `MASTERY_CONFIG.TIN_TB = 3` | ✅ Dùng thẳng | Làm gate "đủ số lần đánh giá" (§1.C) — khỏi đẻ hằng số mới. |
| `getMasteryHS(hsId, mon, {includeBTVN:true})` | ✅ Dùng thẳng | Ra diện dạng yếu per-HS. Đã scope môn qua `khoCuaMon`, đã lọc dạng mồ côi. |
| `loadMasteryCells` / `getMasteryByDang` | ⚠ Private, cần export 1 hàm | `loadMasteryCells` (mastery.ts:329) nạp BULK cả lớp ~4 query — đúng thứ cần cho chuẩn-hoá-lớp (§2.B). Export thêm 1 hàm mỏng, KHÔNG sửa logic. |
| `RESULT_VALUE` | ✅ Dùng thẳng | DCS encoding chung (§0). |
| `bucketMucDo` | ✅ Dùng thẳng | Nếu cần tách cơ bản/nâng cao trong stat sheet. |
| Cơ chế `setDangDay` (`botro_duoi.ts:145`) | ✅ Copy pattern | Neo outcome §5 — verify: `day_at` populate 9/12. Bảng yếu copy y hệt. |
| `canh_bao_yeu` | ✅ Dùng thẳng cho ③ | ĐÃ persist (nguon='btvn', đủ ma_dang+buoi+ghi_chu). Kênh ④ = thêm giá trị `nguon` mới, không đụng dòng cũ. |
| `btvn_ket_qua.thai_do` | ✅ Dùng thẳng cho ② | Enum thật đúng 4 bậc spec. Phủ 73,6%. |
| `khoCuaMon(mon)` (`tailieu.ts`) | ✅ Bắt buộc dùng | Dispatch bản đồ theo môn — chống bẫy §1.E. |
| `tuan.ts` | ✅ Dùng thẳng | Util tuần BK + giờ VN — cho digest theo tuần (§6) + trần "kẹt 1 tuần" (§4.1). |
| Bảng case bổ trợ YẾU | ❌ **Chưa có** | Xem §1.A — chờ chốt. |
| Bảng level HS (kiến thức + thái độ) | ❌ **Chưa có** | Migration mới, xem §3. |
| `tien_quyet` (DAG) | ❌ Chưa có | Bỏ, `// TODO(tienquyet)`. |

---

## 3. Migration cần (chờ duyệt — Claude không tự chạy được)

Đặt tên timestamp (`npm run new-migration`), verify schema sau bằng `npm run schema`.
RLS: **ENABLE + policy `la_thanh_vien()`** giống các bảng data khác (KHÔNG disable — bài học `tai_lieu_*`).

1. **`hs_level`** — trạng thái HIỆN TẠI. 1 dòng = (HS × môn × loại-thanh). Đúng §4: "một HS =
   một thanh level kiến thức + một thanh level thái độ", tách hẳn nhau.
   `hoc_sinh_id · mon · loai ('kien_thuc'|'thai_do') · level (0..3) · updated_at`
   ⚠ Theo §1.5 (chống NULL): **chỉ tạo dòng khi HS thật sự rời L0**, không seed sẵn cả roster ở L0.
2. **`hs_level_log`** — **= CASE LOG** (§1.B/§1.F). 1 dòng = 1 lượt DUYỆT, ghi cả 2 vế:
   `hoc_sinh_id · mon · loai · level_cu · level_may_de_xuat · ly_do_may (jsonb snapshot tín
   hiệu) · level_chot · ly_do_nguoi · actor · created_at`.
   Ghi **từ app lúc duyệt** (không phải trigger) — vì trigger chỉ thấy cũ/mới, không biết máy
   đã đề xuất gì. Kèm trigger phòng thủ trên `hs_level` để không đổi chui được.
3. **`bo_tro_yeu` + `bo_tro_yeu_dang`** (Thùy chốt §1.A: bảng riêng). Shape đối xứng
   `bo_tro_duoi(_dang)`, có `day_at`/`day_buoi_id`, `nguon` nhận `'ai_de_xuat'`.
4. **`canh_bao_yeu.nguon`** — thêm giá trị cho kênh ④ (vd `'gv_tien_quyet'`). Verify: cột `text`
   **không có CHECK** → không cần migration nới, nhưng phải cập nhật union type TS + doc.

---

## 4. Code — thứ tự làm

**Pha 1 — Engine thuần (JS, test bằng `node scripts/verify_*.mjs`, không vitest)**
`src/gami/danhgia.js`: cửa sổ 14 ngày mốc-fix (`YYYY-MM-A|B`, giờ VN) · điểm chuyên đề
weighted (§2.A①) · pha 1 so-lớp / pha 2 so-chính-mình · 2 máy level (§4.1/§4.2) · MA-3 phẳng.
**Pure, không đụng DB** → test fixture khớp tuyệt đối như `verify_gami.mjs`.

**Pha 2 — Data layer** `src/lib/danhgia.ts`: nạp lần đo (scope môn, fallback buổi bù) → gọi
engine → **stat sheet sạch** cho 1 HS / 1 lớp. Nguyên tắc §0: *code tính số, Claude phán* —
tầng này chỉ ra bảng số, không phán.

**Pha 3 — 4 kênh phát hiện** ① trend chuyên đề · ② thái độ · ③④ đọc `canh_bao_yeu`.
Ra danh sách candidate + lý do (dạng đổi bucket xấu).

**Pha 4 — Máy level + pipeline bổ trợ yếu** (phụ thuộc §1.A) + neo outcome retest.

**Pha 5 — UI + digest tuần.** Màn nào / gắn vào `KetQuaScreen` hay tách lá mới — **chưa chốt**,
sẽ hỏi khi tới. Theo memory: mockup duyệt trước, Apple-clean, KHÔNG sci-fi.

---

## 5. Chưa quyết

**Đã chốt hết phần chặn (Thùy 07-22):**
- ✅ §1.A — bảng **riêng** `bo_tro_yeu(_dang)`.
- ✅ §1.B — theo **spec mới**; L1/L2/L3 chính là case log; bỏ playbook/benchmark/`van_de`.
- ✅ §1.C — gate **n ≥ 3**.
- ✅ §1.D — giữ 2 ô ở màn Kết quả học tập; máy level dùng bản gộp + cờ "BTVN che".
- ✅ §1.F — máy **đề xuất**, người **duyệt**; log ghi cả 2 vế → delta tự lộ.

**Còn treo (tới Pha 5 mới cần):** module này nằm ở màn nào — thêm tab trong `KetQuaScreen`
hay lá nav riêng. Theo memory: mockup duyệt trước, Apple-clean, KHÔNG sci-fi.
