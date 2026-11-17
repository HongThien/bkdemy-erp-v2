# Giao việc & Đánh giá hiệu suất — Feature Spec · BKdemy ERP

Hệ đánh giá nhân sự: đo **2 loại việc — Vận hành & Phát triển** cho MỌI người, ra hiệu suất → lương, và feed điều kiện lên cấp. Khác vận hành thuần (pure-derive): việc phát triển là **task có người giao**, cần thống kê + nghiệm thu.

> **ĐỌC TRƯỚC KHI CODE:** `HANDOFF.md` + `CLAUDE.md`. Đây là hệ MỞ RỘNG trên xương sống nhân sự đã có (`nhan_su`, `vi_tri` cây, gami EXP/lương, ops derive buổi). **Verify schema trước** (`information_schema.columns` + `pg_tables.rowsecurity`), **reuse > đẻ mới**. Wording UI: **"vị trí"** (cấm "ghế"). RLS convention: data DISABLE / staffs ENABLE. Đây là dữ liệu **org-wide (phi-học-tập)** → KHÔNG chia theo môn.

---

## 0. Nguyên tắc nền (ngấm vào toàn bộ thiết kế)

Dựa trên **Differentiated Workforce** (Huselid/Beatty/Becker): quản trị lực lượng như danh mục — đầu tư bất cân xứng theo giá trị vị trí, KHÔNG dàn đều. Nhưng áp vào BK theo cách **không đóng hộp con người**:

1. **KHÔNG phân loại NGƯỜI thành hộp cứng (C / TA cao cấp / leader).** Thay vào đó **đo 2 việc cho mọi người**; **tỉ trọng vận-hành : phát-triển** rơi ra từ việc thực làm → tự sinh ra 3 "kiểu" đó như *hệ quả*, không phải nhãn gán. Ai không làm phát triển → phần đó = 0 → tự là "loại C". Ai làm phát triển nhiều dần → tỉ trọng trôi → tự thành leader. **Thăng tiến = tỉ trọng phát triển tăng dần, mượt, không nhảy hộp.**
2. **Partime/Fulltime = thuộc tính HỢP ĐỒNG, KHÔNG phải trục năng lực.** GV chỉ dạy vẫn có thể thu nhập 20–30tr. Nó ảnh hưởng lương-cứng/phúc-lợi/cam-kết, **KHÔNG ảnh hưởng cách chấm**. Đừng để nó thành trục phân loại.
3. **System over star:** hệ càng số-hoá thêm việc → càng nhiều skill chuyển từ "người chấm" sang "đo tự động" → đánh giá càng khách quan, càng bớt phụ thuộc founder tự chấm. Đây là chỉ số sức khỏe của hệ.

---

## 1. Mô hình lõi — MỘT ỐNG, hai phương thức chấm

```
mỗi VIỆC ─► % chất lượng hoàn thành (0–100)        ← 1 thang đo duy nhất
   │            ▲ cách sinh % tùy PHƯƠNG THỨC CHẤM của loại việc:
   │       ┌────┴───────────────────────────────────────────┐
   │       │ FRONTLINE (vận hành, task rời):                 │
   │       │   máy đo TIẾN ĐỘ + leader confirm CHẤT LƯỢNG    │
   │       │ PHÁT TRIỂN (task giao):                          │
   │       │   leader chốt TIẾN ĐỘ + CHẤT LƯỢNG + bằng chứng │
   │       └────────────────────────────────────────────────┘
   ▼
mỗi việc có KHỐI LƯỢNG/trọng số (bảng định lượng, chốt lúc giao)
   ▼
Hiệu suất tháng = Σ(khối lượng × %) / Σ(khối lượng)   ← rate chuẩn hoá, gộp MỌI việc
   │                                                    (20 việc hay 5 việc đều ra %)
   ├─► Sản lượng = Σ khối lượng đã hoàn thành           ← giữ SONG SONG (ai đang gánh)
   ▼
Lương = MAX(theo cấp bậc) × Hiệu suất                   ← model hiện tại BK (verify & hoà)
```

**Giữ 2 số song song, đừng gộp mất thông tin:** *Hiệu suất* (rate — làm có tốt không) và *Sản lượng* (Σ khối lượng — làm được bao nhiêu). Rate không phạt/thưởng số lượng (nhiều/ít việc là kỹ năng giao của leader, không phải hệ thống), nhưng leader phải **nhìn thấy cả hai** khi phân bổ.

**Cũng đừng gộp tiến-độ với chất-lượng thành 1 số mù:** lưu **2 trục riêng** (tiến độ, chất lượng), % cuối = công thức gộp minh bạch, NHƯNG giữ cả hai để phân biệt *chậm-mà-giỏi* vs *nhanh-mà-ẩu*.

---

## 2. Hai luồng việc

### 2.1 Vận hành (pure-derive — đã có xương)
- Máy đo **TIẾN ĐỘ** (từ trạng thái buổi/task đã có: điểm danh/chấm/ET/BTVN đóng chưa, đúng hạn không), leader chỉ confirm **CHẤT LƯỢNG**. → *máy lo tiến độ, người lo chất lượng.*
- Nguồn: hệ ops derive + Elo/Đ-C-S đã build. **Không dựng lại**, chỉ nối vào ống hiệu suất.
- **Cần thêm: dashboard hiển thị FULL kết quả làm việc của từng nhân sự** (xem §7).

### 2.2 Phát triển (task giao — phần mới, khó hơn)
- Máy **KHÔNG biết tiến độ** (task rời, không có buổi để suy) → leader chốt **CẢ tiến độ LẪN chất lượng**.
- **Luồng chuẩn (một luồng phủ mọi loại task):**
  `Giao → Đang làm → (nhân sự) Bấm hoàn thành → (leader) Nghiệm thu: chốt tiến độ + chất lượng + UPLOAD BẰNG CHỨNG → Đạt (%) | Trả lại`
- **Bằng chứng BẮT BUỘC** với task phát triển (file **hoặc** link tới thứ hệ thống đã hiện — vd badge % bản đồ kiến thức đã có, tài liệu đạt chuẩn…). Không bằng chứng → không chốt được. **Ngoại lệ: loại "task nhỏ" được miễn** (cờ trên loại task) để khỏi phiền việc vặt.
- **Mốc tính = ngày nghiệm thu.** Task cắn 2 tháng (giao 25/6, nghiệm thu 5/7) → tính trọn **tháng 7**.
- **Hạn nghiệm thu cho NGƯỜI GIAO** (chống lỗ đen: làm xong mà leader không duyệt → 0 điểm oan). Nghiệm thu là deadline của *sếp*, có nhắc.

---

## 3. Giao việc (assignment)

- **Theo cây tổ chức** (`vi_tri`, span-of-control): ai có người dưới trong cây → giao xuống được. Vị trí lá (không ai dưới) tự khắc không giao ai → **khỏi khai quyền riêng**. Đa-mũ tự xử (Trang giữ 2 vị trí → giao được cả 2 nhánh = hợp sub-tree, không phải "xuyên nhánh"). **KHÔNG cần lớp RBAC-per-loại.**
- Nhánh nào lo task phát triển của nhánh đó (không có nhu cầu xuyên nhánh thật).
- **Task giao cho 1 hoặc nhiều người** → junction 1-N (`viec_nguoi_lam`); 1 người chỉ là N=1.
- **Tự nhận việc** = tự-giao cho mình (N=1). **Giao ngược lên sếp = không** (giữ chiều xuống).

---

## 4. Khối lượng (bảng định lượng)

- Định theo **tiêu chí khách quan** (loại × cỡ/độ khó/giờ ước tính) — **không để người giao bốc số cảm tính** (cùng việc, sếp A cho 10 sếp B cho 3 = loạn).
- **Chốt lúc GIAO** (trước khi làm).
- **Review cuối kỳ = hiệu chỉnh khi ước lượng lệch thực tế:** task dự lvl1 (2 tiếng) mà phát sinh làm 2 ngày → thực chất lvl3, phải nâng kẻo người làm thiệt. Nâng phải **neo vào bằng chứng khách quan** (giờ thực / phát sinh có thật), **KHÔNG nống tuỳ ý sau khi đã biết điểm** (đó là lỗ gian lận). Review sửa **cái BẢNG cho kỳ sau** là chính, không sửa lịch sử để làm đẹp.
- **Trách nhiệm thường trực** (vd "phụ trách học thuật" — không phải task) mang **trọng số vai trò** (một số gán cho việc-thường-trực), đứng cùng hàng với khối-lượng-task trong cùng phép Σ. Cùng là "trọng số", khác nguồn.
- **Ngân sách khối lượng/kỳ ≈ hằng số** (thời gian hữu hạn): ai cũng xoay quanh một trần (18 task lvl1 ≈ 4 task lvl3, không ai ôm nổi 18 task lvl3). → **vượt trần bền vững (overband) = tín hiệu lên trình** (dùng ở §6). Overband phải đến từ *làm được nhiều hơn*, KHÔNG từ *được gán band cao hơn* (nhờ neo bằng chứng ở trên).

---

## 5. Xương sống chung: Cấp bậc + Lương

- **Cấp bậc = 1 thang duy nhất** (trạng thái), **lấy data từ 2 track** (vận hành + chuyên gia/quản lý — two-track ladder đã có). Cấp bậc → đặt **MAX (trần lương)**.
- **Lương = MAX(cấp bậc) × Hiệu suất.** Đây là model BK hiện tại — **verify cách lương đang tính** (`luong_bac` / EXP→Xu trong gami hiện có) và **hoà vào**, đừng dựng song song. (Model có thể đổi sau nếu chưa hợp lý → để công thức lương **cấu hình được**, đừng hardcode.)
- **Rơi ra tự nhiên (không special-case):** việc vận hành chấm theo tháng → hiệu suất partime **nhấp nhô** theo sản lượng; việc năng-lực giữ **standing %** giữa 2 kỳ review → hiệu suất fulltime key **ổn định**. Cùng một công thức, hai nhịp chấm khác nhau → partime linh hoạt, key ổn định. Đúng "đừng để A-position churn theo throughput".

---

## 6. Lên cấp: 2 điều kiện + Promotion Gate

**Vào gate cần ĐỦ 2 điều kiện:**
1. **Chỉ số tốt = sliding-window 3/4 kỳ gần nhất** (TRẠNG THÁI, không phải 1 kỳ đỉnh điểm) → chứng minh *làm tốt lvl hiện tại*.
2. **Skill tăng đạt ngưỡng lvl sau** (ma trận năng lực §8) → *sẵn sàng lvl tiếp*.

**Promotion Gate = làm việc của lvl tiếp theo trong một khoảng thời gian:**
- **Hai kiểu gate theo tỉ trọng việc** (không một khuôn):
  - *Tầng vận hành:* lvl trên thường là **cùng việc, scope/độ-khó cao hơn** → gate = giao việc **overband** (vượt trần khối lượng §4) và xem có **giữ chất lượng** không.
  - *Tầng phát triển:* gate = giao **task của lvl trên** để thử.
- **Lương trong gate — mặc định PHỤ CẤP GATE** (cấu hình được):
  - *(Mặc định)* hưởng **phụ cấp gate**; lương nền **vẫn lvl cũ** suốt gate; **pass** mới chính thức lên bậc; **fail → mất phụ cấp, KHÔNG tụt bậc, KHÔNG hồi tố lương**. Tránh loss-aversion (sợ vào gate) + kế toán sạch (không đòi lại lương đã trả).
  - *(Tùy chọn khác — setting)* ăn **lương lvl mới** ngay trong gate; fail → về lvl cũ. Để làm chế độ chọn được, phòng khi sau muốn đổi.
- **Fail phải nhả CHẨN ĐOÁN:** fail vì *chỉ số tụt* (lo việc mới bỏ việc cũ) hay vì *skill lvl mới chưa đủ*? → lần review sau biết vá đâu, retry có hướng. Không chỉ "về, chờ".

---

## 7. Skill / Ma trận năng lực

- Mỗi **skill** = 1 dòng dữ liệu **NGƯỜI DÙNG TỰ NHẬP** (thêm/sửa/xoá): tên, track, mô tả, **4 mức** (mức 4 = **kèm được người khác**). *Nội dung skill Thùy điền sau — v1 chỉ cần STRUCTURE + luồng.*
- Mỗi skill có **`nguon ∈ {derive, nguoi_cham}`** — phân theo câu hỏi DUY NHẤT: *"có dấu vết khách quan trong hệ thống không?"* (KHÔNG theo cái nào tiện):
  - **`nguoi_cham`** (giảng dạy, thái độ, phối hợp…): thuần data, tự nhập, **zero code**. Chấm phải **kèm bằng chứng/lý do** (không cho số trơn) + **lưu ai-chấm** (soi người ghìm) + **mức-4 phải có bằng chứng đã kèm ai lên** (không tự phong).
  - **`derive`** (học thuật, dùng hệ thống, đánh giá HS…): trỏ tới một **probe** (đầu đo — §8). Probe ra một **SỐ**; **ngưỡng số→mức Thùy nhập per-skill** (cùng probe "đếm tài liệu" xài nhiều skill với ngưỡng khác nhau).
- **Derive đo trên việc ĐÃ ĐẠT CHUẨN (qua nghiệm thu), KHÔNG đếm thô** — 100 tài liệu rác ≠ giỏi hơn 20 tài liệu chuẩn. "Số tài liệu **đạt chuẩn**", chất lượng đã nằm ở cửa nghiệm thu.

---

## 8. Probe (đầu đo) — v1 CHỈ CHỪA KHE, KHÔNG code cái nào

- **Probe = mẩu code đọc dữ liệu thật** để ra số cho skill derive. **KHÔNG cho user tự viết logic** — chỉ **chọn** probe từ menu.
- **⚠ v1: KHÔNG code probe nào — KỂ CẢ bản đồ kiến thức.** Chỉ dựng **khe cắm** trong schema (`skill.probe_key` nullable + registry probe rỗng). Đo tự động = **pha 2**, thêm dần cho task đáng giá.
- Lý do: nếu v1 cố code probe riêng từng task quan trọng → không bao giờ ship. Nghiệm thu task (kể cả "hoàn thành bản đồ kiến thức") ở v1 chỉ cần **leader nhìn bằng chứng có sẵn** (badge % bản đồ ĐÃ build) rồi chốt tay — không cần probe.
- **Ứng viên pha 2 số 1: bản đồ kiến thức** (siêu quan trọng, đáng code probe riêng — ghi nhận, để pha 2). Chừa khe sẵn để lắp không phải đập.
- Chỉ số sức khỏe: **tỉ lệ skill derive : người-chấm**. Càng nhiều derive càng sạch. Mỗi lần số-hoá thêm việc → chuyển 1 skill từ người-chấm sang derive.

---

## 9. Dashboard / Thống kê (Thùy nhấn mạnh "hiển thị thống kê")

Ba tầng view:
- **Cá nhân** ("Việc của tôi" mở rộng): việc vận hành (derive) + việc phát triển (task) một chỗ; hiệu suất tháng, sản lượng, tỉ trọng vận-hành:phát-triển, tình trạng skill, tình trạng gate. **Full kết quả làm việc của mình.**
- **Leader/người giao:** task mình đã giao + trạng thái; **ai quá hạn, ai đang gánh nhiều** (sản lượng), hiệu suất từng người dưới quyền — để phân bổ việc (leader nhìn số hệ thống mà giao, không cày cảm tính).
- **Lãnh đạo/tổng:** throughput, backlog, tỉ lệ quá hạn, phân bố hiệu suất, ai đang trong gate. Lọc theo nhánh/track.

---

## 10. Phạm vi v1

**IN:**
- Registry **`loai_viec`** (`phuong_thuc_cham ∈ {frontline, phat_trien}`, cờ `task_nho` miễn-bằng-chứng, cách tính trọng số).
- **Task phát triển:** giao (theo cây, 1-N người) → hoàn thành → nghiệm thu (tiến độ + chất lượng + bằng chứng bắt buộc) → % ; hạn nghiệm thu cho người giao.
- **Nối vận hành derive** vào ống hiệu suất (reuse, thêm confirm chất lượng nếu chưa có).
- **Khối lượng:** bảng định lượng + chốt-lúc-giao + review-hiệu-chỉnh-neo-bằng-chứng; trọng số vai trò cho trách nhiệm thường trực.
- **Hiệu suất** (Σ(kl×%)/Σkl, 2 trục tiến-độ/chất-lượng, sản lượng song song) → **lương = max × hiệu suất** (hoà vào lương hiện có).
- **Cấp bậc 1 thang** + **2 điều kiện lên** (3/4 + skill) + **Promotion Gate** (2 kiểu, chính sách lương cấu hình, nhả chẩn đoán).
- **Ma trận skill** (structure + người-chấm flow + khe derive rỗng). Nội dung skill Thùy nhập sau.
- **3 dashboard** (cá nhân/leader/tổng).

**OUT (pha sau / chờ trigger):**
- **Probe tự động** (đo derive) — kể cả bản đồ kiến thức. Chỉ chừa khe.
- OKR/mục tiêu định tính chi tiết cho track chiến lược (v1 dùng việc-thường-trực + review; OKR đầy đủ sau).
- Đa cơ sở.

---

## 11. Data model (reuse — verify trước)

- `nhan_su`, `vi_tri` (cây) — **giữ**. Vị trí chỉ lo **quyền giao** (span-of-control), KHÔNG mang cờ đo.
- `loai_viec` (registry): `ten`, `phuong_thuc_cham`, `task_nho` bool, `cach_tinh_trong_so`.
- `viec` (instance): `loai_viec_id`, `nguoi_giao`, `khoi_luong` (chốt lúc giao), `trang_thai` (giao/dang_lam/cho_nghiem_thu/dat/tra_lai), `tien_do` %, `chat_luong` %, `phan_tram` % (gộp), `bang_chung` (url/file, bắt buộc trừ task_nho), `ky_tinh` (= tháng nghiệm thu), `han_nghiem_thu`.
- `viec_nguoi_lam` (junction 1-N): `viec_id`, `nhan_su_id`.
- `hieu_suat_ky` (derive/materialize): `nhan_su_id`, `ky`, `hieu_suat`, `san_luong`, tỉ trọng.
- `skill` (user-nhập): `ten`, `track`, `mo_ta`, `muc_1..4` (mô tả), `nguon`, `probe_key?` (nullable), `nguong_json` (số→mức).
- `nhan_su_skill`: `nhan_su_id`, `skill_id`, `muc` (1-4), `nguon_cham` (ai chấm, nếu người-chấm), `bang_chung?`.
- `cap_bac` (1 thang, trạng thái) + `luong` (verify/hoà với `luong_bac`/EXP→Xu hiện có).
- `promotion_gate`: `nhan_su_id`, `tu_cap`, `den_cap`, `kieu` (overband/task_lvl_tren), `bat_dau`, `han`, `ket_qua` (dang/pass/fail), `chan_doan` (fail vì gì), `chinh_sach_luong`.

> Verify tên bảng/cột thật (`information_schema`) + `pg_tables.rowsecurity` trước mọi migration. RLS: data DISABLE / `staffs` ENABLE. HS-realm KHÔNG đụng hệ này (staff-only).

---

## 12. Các bước build (cho Claude Code)

1. Đọc `HANDOFF.md`+`CLAUDE.md`. Audit: `nhan_su`/`vi_tri`, cách lương hiện tính (`luong_bac`/EXP→Xu), ops derive + Elo/Đ-C-S, badge % bản đồ (dùng làm bằng chứng).
2. Registry `loai_viec` + `viec`/`viec_nguoi_lam` + luồng giao→hoàn thành→nghiệm thu (bằng chứng bắt buộc, task_nho miễn). Giao theo cây (span-of-control).
3. Khối lượng: bảng định lượng + chốt-lúc-giao + review-hiệu-chỉnh (neo bằng chứng). Trọng số vai trò.
4. Nối vận hành derive vào ống; tính `hieu_suat_ky` (Σ(kl×%)/Σkl + sản lượng + 2 trục).
5. Lương = max(cấp bậc) × hiệu suất — **hoà vào cơ chế lương hiện có**, cấu hình được.
6. Cấp bậc 1 thang + 2 điều kiện lên (sliding-window 3/4 + skill ngưỡng) + Promotion Gate (2 kiểu, chính sách lương setting, chẩn đoán fail).
7. Ma trận skill: CRUD skill (user nhập) + `nhan_su_skill` + luồng người-chấm (bằng chứng + lưu ai-chấm + mức-4 gate). Khe `probe_key` để **rỗng** (registry probe rỗng, chừa chỗ).
8. 3 dashboard (cá nhân/leader/tổng). RLS theo convention. `tsc` sạch + test luồng thật 1 task phát triển end-to-end (giao→làm→nghiệm thu+bằng chứng→vào hiệu suất→lương).

---

## 13. Definition of Done

- Giao 1 task phát triển end-to-end: giao (theo cây, ≥1 người) → nhân sự bấm xong → **leader nghiệm thu chốt tiến độ+chất lượng + BẮT BUỘC bằng chứng** → ra % → vào hiệu suất tháng → phản ánh lương. Task_nho miễn bằng chứng.
- Vận hành derive: máy đo tiến độ, leader confirm chất lượng, cùng vào ống hiệu suất.
- Hiệu suất = Σ(kl×%)/Σkl **chuẩn hoá** (20 vs 5 việc không phồng); **sản lượng + 2 trục tiến-độ/chất-lượng lưu riêng**.
- Lương = max(cấp bậc) × hiệu suất, hoà vào cơ chế hiện có, KHÔNG dựng song song.
- Lên cấp cần **cả** 3/4-sliding-window **và** skill-ngưỡng; Gate chạy 2 kiểu; fail nhả chẩn đoán + chính sách lương đúng setting.
- Skill user tự thêm được (người-chấm) không cần code; skill derive để khe `probe_key` rỗng. **KHÔNG có probe nào ở v1.**
- 3 dashboard hiển thị đúng; leader thấy quá-hạn + tải từng người.
- **KHÔNG** đóng hộp người thành 3 loại cứng; tỉ trọng vận-hành:phát-triển là derive. Partime/fulltime chỉ là thuộc tính hợp đồng, không đụng cách chấm.
- Đúng convention: verify schema trước, reuse vị-trí/lương/derive, RLS chuẩn, "vị trí" không "ghế", `tsc` sạch.

---

## Goal / Kickoff

> Kick bằng 1 câu trong phiên Claude Code (auto mode): *"Đọc BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build feature Giao việc & Đánh giá hiệu suất theo spec này, tới khi đạt HẾT "Definition of Done".

**ĐỌC TRƯỚC (bắt buộc):** HANDOFF.md + CLAUDE.md + toàn bộ spec này. Không code trước khi đọc xong.

**KỶ LUẬT:**
- Verify schema TRƯỚC mọi migration: `information_schema.columns` + `pg_tables.rowsecurity`.
- Reuse > đẻ mới: `nhan_su`/`vi_tri`(cây)/cơ chế lương hiện có (`luong_bac`/EXP→Xu)/ops derive/badge % bản đồ. Grep repo TRƯỚC khi đổi.
- Lương = max(cấp bậc) × hiệu suất phải HOÀ vào cơ chế lương hiện có, KHÔNG dựng song song, để cấu hình được.
- Wording UI "vị trí" (cấm "ghế"). Dữ liệu org-wide, KHÔNG chia theo môn. RLS: data DISABLE / `staffs` ENABLE.
- v1 KHÔNG code probe nào (kể cả bản đồ kiến thức) — chỉ chừa khe `probe_key` rỗng.
- KHÔNG đóng hộp người thành 3 loại cứng — tỉ trọng vận-hành:phát-triển là derive.
- Promotion Gate: mặc định **phụ cấp gate** (fail = mất phụ cấp, không tụt bậc, không hồi tố lương).

**VÒNG LÀM** (theo mục "Các bước build", từng bước, tự lặp tới hết): implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → bước tiếp.

**DỪNG & HỎI khi:** fork kiến trúc spec không cover · cần xoá/drop/migration phá dữ liệu (giải thích trước, chờ tao gật) · spec đụng cơ chế lương/nhân sự thật gây rủi ro. Chưa chắc thì hỏi, đừng đoán.

**XONG khi:** mọi Definition of Done đạt + `tsc` sạch + luồng thật 1 task phát triển chạy end-to-end (giao→làm→nghiệm thu+bằng chứng→hiệu suất→lương). Báo tao khi xong hoặc kẹt.
