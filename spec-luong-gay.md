# spec-luong-gay.md — TÍNH LƯƠNG · TÍNH GẬY (spec #11 của bộ 20 spec)

> **Trạng thái: NHÁP 17/11/2026 — chờ Thùy duyệt.** Chưa phải nguồn đúng. Tới khi Thùy chốt, `spec-cham-cong-ta.md` §7–§8 (công thức lương TA) vẫn là nguồn đang dùng.
> Đây là spec về **tiền của nhân sự**: chỗ nào nguồn mâu thuẫn / nguồn ≠ DB / số không có ngày chốt ⇒ **không tự chọn**, ghi §9.1. Việc code / DB chỉ làm khi Thùy ra lệnh.
> **Gộp từ:** `spec-cham-cong-ta.md` (§1 dòng 11–19, §7, §8 phần chốt kỳ, §9 — phần còn lại đã ở `spec-tro-giang.md` §7) ·
> **`SPEC-tai-chinh-luong-gv-ta.md` — đọc từ nhánh CHƯA MERGE `origin/docs/tai-chinh-luong-gv-ta` (commit `53b1d3f8`, 03/09, 253 dòng; không checkout, không merge)** — lấy §3 (lương GV), §4 (lương TA), ghi nhãn **[nhánh 03/09]** ·
> `_luu-tru/spec-hieu-suat-ta.md` (§1, §5b — gậy ↔ hiệu suất) · `_luu-tru/spec-bot-telegram-ta.md` (nối gậy) · `spec-truong-khoi.md` §3 (ai quyết gậy, hậu kiểm) · `spec-van-hanh-tuan.md` §3.8, §5.10 (gậy trễ nhịp tuần) ·
> `spec-kien-truc.md` §14 · HANDOFF (lương GV cấp 1 · chấm công + lương TA · miễn gậy) · DEVLOG 29/08 → 17/11 (quyết định có ngày, ghi `(Thùy dd/mm)`) · `_luu-tru/BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md` (chỉ lịch sử: "lương = trần × hiệu suất" **đã bỏ** 12/10).
> ⚠ **Hai đoạn nguồn KHÔNG còn file:** §3.1b (thang GV cấp 1 năm 2026, Thùy 09/10) và §3B (cơ chế 90/10 + thưởng GV, Thùy 18/09) được DEVLOG ghi là "đã viết vào `SPEC-tai-chinh-luong-gv-ta.md`", nhưng bản trên nhánh dừng ở 03/09 và không có bản nào khác trên máy / trong git. Spec này dựng lại hai đoạn đó từ **HANDOFF + DEVLOG** (ghi nhãn **[HANDOFF 09/10]**, **[DEVLOG 18/09]**).
> **Đối chiếu DB 17/11 ~22:00** (chỉ đọc: `pg_proc`, `pg_trigger`, `pg_constraint`, `pg_policies`, đếm dòng, gọi hàm đọc). Chỗ DB / code lệch nguồn ⇒ **không sửa**, ghi §9.
>
> **Ranh giới (chỉ trỏ):** khai công · duyệt công · danh mục việc · cờ ⇒ `spec-tro-giang.md` §7 · cách tính **điểm** hiệu suất TA ⇒ `spec-tro-giang.md` §8 (ở đây chỉ ghi nó chảy sang tiền thế nào — §5) ·
> học phí, thu chi ⇒ `spec-van-hanh-trung-tam.md` · **cơ cấu doanh thu – chi phí, tỉ lệ lương / doanh thu, lợi nhuận ⇒ #19** (§10) · ghế trưởng khối, KPI trưởng khối, hậu kiểm ⇒ #6 · việc và hạn theo nhịp tuần ⇒ `spec-van-hanh-tuan.md` · mức L1–L4 bổ trợ ⇒ `spec-bo-tro.md`.

---

## 0. Đích · nguyên tắc

- Một câu spec này phải trả lời được: **tháng X, người Y nhận bao nhiêu, vì những việc nào, bị trừ vì gậy nào — và ai đã duyệt từng dòng.**
- **Tiền chỉ tính ở Postgres** (CLAUDE §2.0 — đã có tiền lệ sai tiền thật vì client tính). App chỉ gọi hàm và vẽ. Một công thức = một hàm.
- **Một nguồn số** (Thùy 17/11): TA thấy **một bảng lương realtime** — đã làm gì · được duyệt · gậy · ra tiền. Không ba bộ số. Hiệu suất theo gậy là số của quản lý.
- **Lương không nhân hiệu suất** (Thùy 12/10). Sai thì **gậy**; gậy là kênh phạt duy nhất (Thùy 29/08).
- **Chỉ việc ĐÃ DUYỆT mới ra tiền.** Thiếu công = không có dòng, không phải dòng 0đ (CLAUDE §1.5).
- **Kỳ = tháng theo NGÀY VIỆC diễn ra** (giờ VN), không theo ngày khai / ngày duyệt.
- **Thông số tiền có lịch sử và hiệu lực theo ngày; kỳ đã chốt là bản chụp bất biến** — đổi thông số hôm nay không đổi quá khứ (Thùy 04/11).
- Máy **đề xuất**, người **quyết** (gậy, duyệt công, chốt kỳ). Máy không tự đánh gậy.
- Nói với nhân sự bằng **số tiền tuyệt đối / bảng thu nhập** (Thùy 18/09) — bảng gửi GV / TA không ghi tỉ lệ % lương / doanh thu.

## 1. Lương TA (Thùy 12–15/10, sửa 21/10 · 04/11 · 10/11) — ĐANG CHẠY trên ERP

> Áp cho **TA part-time theo package**. Full-time / core team: chưa có luật (§3). **GV kiêm TA không nhận lương TA, không chấm công** (Thùy 15/10; dạy lớp 1-1 không tính là GV — Thùy 21/10) ⇒ §2.4, §9.1 câu 3.

### 1.1 Công thức (một hàm: `_ta_luong_tinh(kỳ, nhân sự)`)

```
Tổng (gross) = Σ từng lớp [ mức lớp × (0,4 × tỉ lệ trợ giảng + 0,2 × tỉ lệ BTVN) ]
             + 0,4 × (giờ bổ trợ ÷ (8 giờ × số lớp)) × Σ mức các lớp đó
             + việc ngoài package (số lượng × đơn giá)
Thực nhận   = Tổng − tiền phạt gậy đã chốt của kỳ
```

Đọc bằng tiền, với một lớp mức **M** / tháng: trợ giảng đủ buổi = **0,4 M** · chấm BTVN đủ định mức = **0,2 M** · đủ 8 giờ bổ trợ cho lớp đó = **0,4 M**. Ví dụ lớp mức 1.200.000đ làm đủ cả ba = 480.000 + 240.000 + 480.000 = 1.200.000đ. **Không có trần** — làm hơn thì nhận hơn (Thùy 12/10).

### 1.2 Mức lớp (thay "bậc theo sĩ số" từ tháng 10 — Thùy 10/11 "bảng lương TA từng lớp")

- **`ta_luong_lop`** = (lớp × mức × tháng hiệu lực). **Đặt tay từng lớp**, mức không tự đổi theo sĩ số. Lớp chưa có mức ⇒ **0đ + cờ đỏ "thiếu mức"**, không đoán.
- Màn Lương trợ giảng › **Lương theo lớp** (mặc định mở **tháng trước** — tháng đang làm lương; bài học 10/11: mở tháng hiện tại làm mức bị áp lệch một tháng). Cột "bậc theo sĩ số" chỉ để so, tô cam khi khác.
- Hiện có 65 dòng: tháng 10 — 54 lớp (29 lớp 1.000.000 · 14 lớp 1.200.000 · 7 lớp 1.400.000 · 4 lớp 1.600.000); tháng 11 — 11 dòng đổi mức. 47 / 47 lớp đang học có TA đều có mức.
- **Bậc theo sĩ số** (`ta_don_gia.bac_luong`: ≤ 8 em 1.000.000 · 9–12: 1.200.000 · 13–15: 1.400.000 · 16–20: 1.600.000 · ≥ 21: 1.800.000; sĩ số = trung bình cả tháng theo ngày, làm tròn) **chỉ còn dùng cho tháng 9 trở về** và làm cột tham khảo.

### 1.3 Từng thành phần

| Thành phần | Cách tính (đang chạy) | Quyết định |
|---|---|---|
| **Lớp của TA** | Lớp được phân công vào **bất kỳ ngày nào trong kỳ** (theo `phan_cong_lop_log`; phân công sau kỳ không tính; bị rút giữa kỳ vẫn giữ lớp cho kỳ đó) **+** lớp TA có công trợ giảng trong kỳ (dạy hộ) | Thùy 12/10, 14/10 |
| **Tỉ lệ trợ giảng** | Số **ngày** TA có phiếu trợ giảng (hoặc trông thi lớp mình) **đã duyệt, thuộc ca có mặt đã duyệt** ÷ số buổi thường không huỷ của lớp **cả tháng**. TA vào giữa tháng vẫn chia cho cả tháng (đi 4 / 8 buổi = một nửa) | Thùy 12/10, 14/10 |
| **Tiền trợ giảng đi theo người thật sự dạy** từng buổi | Người dạy hộ có dòng lớp riêng, tính theo mức của **lớp được dạy**; lớp vẫn thuộc TA chủ (giữ BTVN + chỉ tiêu bổ trợ) | Thùy 12/10 |
| **Tỉ lệ BTVN** | Số buổi của lớp mà **chính TA đó** có chấm BTVN (theo người chấm ở dữ liệu chấm) ÷ định mức (lớp 8 buổi / tháng: **7**; lớp ≤ 5 buổi lịch: **3**). Buổi thi / MT không có BTVN ⇒ không tính. *"Trong hạn" đang hiểu là chấm trước hạn chót của kỳ (ngày 3 tháng sau) — §9.1 câu 11* | Thùy 12/10 |
| **Giờ bổ trợ** | Giờ các việc nhóm bổ trợ (định kì · bù · yếu · đuổi · sau giờ · chữa bài) đã duyệt. **Việc chồng giờ nhau chỉ tính một lần** (hợp các khoảng giờ theo TA × ngày) — áp từ tháng 10 | Thùy 04/11 |
| **Chỉ tiêu bổ trợ** | **8 giờ × số lớp chủ có hoạt động** trong kỳ (có công trợ giảng hoặc có chấm BTVN); chưa có lớp chủ nào ⇒ theo số lớp có trợ giảng. Giờ dùng chung, không gắn lớp. Vượt chỉ tiêu ⇒ nhân lên | Thùy 12/10 |
| **Việc ngoài package** | Trông thi **lớp khác** 50.000đ / giờ · bổ trợ đặc biệt (kèm riêng) 150.000đ / buổi · bổ trợ ôn thi 50.000đ / giờ · chấm thi 50.000đ / giờ (từ 01/10) · làm đề thi 50.000đ / giờ (từ 01/11). **Họp · Đào tạo: chưa có đơn giá ⇒ 0đ + cờ.** "Việc khác" đã tắt (Thùy 04/11) | Thùy 12/10; ba mức 50.000đ sau không thấy ngày chốt — §9.1 câu 10 |
| **Trông thi lớp mình** | Nằm trong công trợ giảng — cùng ngày chỉ tính một lần, không trả riêng | Thùy 12/10 |
| **Chấm ET** | Không đo riêng: 40 % "trợ giảng + ET" hiện chỉ theo số buổi trợ giảng | còn mở — §9.1 câu 11 |
| **Tiền phạt gậy** | `gay_chot_thang.tien_phat` của kỳ (§4.6). **Chưa chốt gậy tháng ⇒ 0đ** | Thùy 12/10 — §9.1 câu 1 |

### 1.4 Thông số (bảng `ta_don_gia` — có ngày hiệu lực, có lịch sử)
`he_so_tg` 0,4 · `he_so_btvn` 0,2 · `he_so_bo_tro` 0,4 · `chi_tieu_bo_tro_gio` 8 · `btvn_lop_8_buoi` 7 · `btvn_lop_4_buoi` 3 · `han_duyet_ngay` 3 · `bac_luong` (5 bậc) · `gia_<loại việc>`.
- Thêm / sửa / xoá trên màn (quyền ghi `ta_luong`): **không xoá cứng** (kho rác `xoa_at` + lý do) · không đổi mã / khoảng sĩ số · **dòng đang dùng cho tháng đã chốt thì khoá** · mọi thay đổi ghi `ta_cong_log` (Thùy 04/11).
- Loại việc + "tính vào đâu" (`ta_loai_viec.tinh_vao`) sửa ở tab **Loại việc & cơ chế**; đổi cơ chế chỉ ảnh hưởng tháng chưa chốt.

### 1.5 Số hiện tại (17/11, tạm tính — chưa kỳ nào chốt)
- **Tháng 10:** 17 TA · lớp 15.627.398đ + bổ trợ 12.318.889đ (201,4 giờ; 10,5 giờ chồng nhau đã loại) + ngoài package 5.850.000đ = **33.796.287đ** · phạt gậy 0đ (gậy tháng chưa chốt). 7 / 17 TA đủ chỉ tiêu bổ trợ. 1 TA có dòng lớp "thiếu mức", 2 TA có việc "chưa có đơn giá".
- **Tháng 11 (tới 17/11):** 15 TA · 23.611.468đ.
- Tháng 9: tính ngoài ERP (15 TA, 28.256.807đ theo bản V6) — **không chốt trên ERP** (hàm chặn tháng trước mốc chấm công 01/10).

### 1.6 [nhánh 03/09] Thang TA "gói / buổi theo băng sĩ số + level" — CHƯA ÁP
Bản tạm chốt 02–03/09 (trước khi có chấm công): gói / buổi 80.000–150.000đ theo băng sĩ số · bổ trợ 40.000đ / ca · level L1 ×1,0 · L2 ×1,1 · L3 trưởng khối ×1,15 + 1.500.000đ / tháng + giờ QC kho 45.000đ · quỹ thưởng = một phần mười ngân sách TA, chia cho người đạt cả ba KPI tháng. **Không có trong DB / code**; công thức §1.1 (12/10) là cái đang chạy ⇒ §9.1 câu 6.

## 2. Lương GV — CHƯA có trên ERP

> DB **không có** bảng / hàm lương GV (Thùy xác nhận 07/2026: lương nhân sự tính ngoài ERP, mỗi người có mức riêng ngoài hệ thống). Bảng lương GV tháng 7–9 làm bằng bộ sinh PDF, số buổi / sĩ số chép tay từ DB.

### 2.1 Thang đang áp — GV **cấp 1**, năm 2026 [HANDOFF 09/10 — Thùy chốt sau 4 lần đổi trong ngày]

`Lương một lớp một tháng = Mức × Số buổi thực dạy × Hệ số giờ` — tính riêng từng tháng, từng lớp, rồi cộng.

| Sĩ số trung bình tháng của lớp | Mức / buổi 1,5 giờ |
|---|---|
| 3–4 em | 350.000đ |
| 5–7 em | 450.000đ |
| 8–10 em | 550.000đ |
| 11–13 em | 650.000đ |
| **từ 14 em** | **chưa có mức — gặp thì DỪNG, hỏi Thùy** |

- **Sĩ số một buổi** = số em có tên trong lớp ở buổi đó, **kể cả em vắng** (số dòng `buoi_hoc_hs`); trung bình qua các buổi tính lương, **làm tròn thường** rồi mới so thang (7,57 → 8 → 550.000đ).
- **Số buổi thực dạy** = buổi thường của lớp mà người dạy là GV đó; **không tính buổi MT** (không lương) và buổi huỷ. Buổi chưa đóng nhưng đã điểm danh vẫn tính.
  ⚠ Buổi MT **không** có `loai = 'mt'` — là buổi thường có câu khâu `mt` (đã lọc sai một lần 09/10).
- **Hệ số giờ** = số giờ / buổi ÷ 1,5 (1,5 giờ = 1 · 2 giờ = 4/3 · 2,5 giờ = 5/3). Nhân cả tháng rồi mới làm tròn đồng.
- Ví dụ: lớp 9 em, 1,5 giờ, tháng có 7 buổi thực dạy ⇒ 550.000 × 7 = 3.850.000đ.
- **Mẫu bảng lương đã duyệt:** mỗi tháng một khối, mỗi lớp liệt kê từng buổi (ngày · thứ · sĩ số lớp · sĩ số thực tế · ghi chú; buổi MT / huỷ in xám "không tính") → sĩ số trung bình · mức · số buổi · hệ số · lương → tổng tháng → phụ lục thang 4 dòng. Không đưa doanh thu / tỉ lệ vào bảng gửi GV.
- **Soát trước khi tính** (đã gặp thật): buổi trống người dạy · buổi hoàn tất mà 0 em · buổi "huỷ — GV vắng" nhưng điểm danh đủ · em có tên nhưng vắng cả tháng làm sĩ số cao lên. Tính theo luật, ghi chú trong bảng, **nêu cho Thùy**.

### 2.2 Chưa có luật (không tự đoán) ⇒ §9.1 câu 4, câu 5
GV **cấp 2 / cấp 3** dùng thang nào · lớp từ 14 em · buổi **bù** có trả không · buổi MT không lương có áp cấp 2 / 3 không · level L2 / L3 · cơ chế 90 / 10.

### 2.3 Đích dài hạn — CHƯA ÁP
- **[nhánh 03/09]** thang chung theo băng sĩ số (5–7 em 300.000đ · 8–10: 350.000 · 11–14: 400.000 · 15–19: 500.000 · 20–24: 650.000 · từ 25: 750.000 / buổi 2 giờ) · level L2 +50.000đ, L3 +100.000đ / buổi · sàn 350.000đ ba tháng đầu · thưởng ba khoản (chưa chốt chi tiết). Thang 2026 ở §2.1 cao hơn đích này ở sĩ số 8–12 — quyết định của Thùy 09/10, đích vẫn giữ.
- **[DEVLOG 18/09]** cơ chế GV cấp 1: lương = **90 phần "lương buổi"** (có mặt là trả) **+ 10 phần "phụ cấp chất lượng"** (đạt đủ bốn nhóm tiêu chí tháng: chuyên cần · chất lượng buổi · nhận xét & report · báo lên đúng lúc; đạt hết mới có) — là phụ cấp lương, không phải thưởng · **không trừ lương buổi, không hồi tố** (mọi tác động là tương lai: mất phụ cấp, hạ level, cắt lớp) · thưởng theo kỳ (2 lần / năm) ba loại · tháng 13 khi ≥ 8 / 12 tháng đạt phụ cấp · 13 câu còn treo. **Văn bản gốc §3B không còn file** (đầu spec).

### 2.4 Công dạy ca bổ trợ của giáo viên và của GV kiêm TA (Thùy 17/11 giao spec này ghi) — CHƯA CÓ LUẬT TIỀN
- **Luật người dạy** (Thùy 17/11): L1 sau giờ, L2 ca khối = TA **hoặc GV kiêm TA** · **L3, L4 bắt buộc giáo viên**.
- **Hiện trạng:** GV kiêm TA không chấm công, không lương TA; GV thuần không có lương trên ERP ⇒ **mọi ca bổ trợ do hai nhóm này đứng không có công ở đâu cả.** 01/10 → 16/11 (buổi không huỷ, người đứng ca = `nguoi_day_tg`, thiếu thì `nguoi_day`): **GV kiêm TA 151 buổi ≈ 140 giờ · GV thuần 96 buổi ≈ 54 giờ** (bù 83 · sau giờ 88 · yếu 55 · ôn thi 12 · đuổi 9). TA thuần cùng kỳ: 206 buổi ≈ 233 giờ (có công).
- Trả theo gì, bao nhiêu, ai duyệt ⇒ **§9.1 câu 3**. Dù chọn cách nào: công sinh từ **buổi bổ trợ đã hoàn tất** trên ERP (không bắt GV bấm Checkin), trưởng khối duyệt như công TA, tính ở DB.

## 3. Nhân sự khác (OPS · trưởng khối · core team · full-time)

- **Không có nguồn nào ghi cách tính lương** OPS, trưởng khối, Phó khối, Quản lý trợ giảng, core team; DB không có bảng lương nào ngoài của TA. `spec-cham-cong-ta.md` §11 ghi rõ "full-time / core team làm sau". ⇒ Spec này **không viết luật** cho các nhóm đó.
- Thứ duy nhất có: **[nhánh 03/09]** L3 trưởng khối TA +1.500.000đ / tháng + giờ QC kho 45.000đ (chưa áp — §9.1 câu 6).
- Các nhóm này **vẫn nhận gậy** (§4) ⇒ gậy của họ ra tiền thế nào: §9.1 câu 2.
- Điểm tích luỹ → Shopping của nhân sự (`ta_dinh_muc.diem_moi_ngay` 100 điểm / ngày đạt, `tich_luy_chot_thang`) là phần thưởng phi tiền, **không phải lương** — thuộc `spec-tro-giang.md` §8.7. Chưa tháng nào được chốt (0 dòng).

## 4. GẬY (Thùy 29/08; sửa 05/09 · 24/09 · 08/10 · 14/10 · 29/10 · 04–05/11 · 15–16/11)

### 4.1 Gậy là gì
- **Gậy = đơn vị phạt nhân sự**, đi theo **người × tháng**; **bảng gậy công khai toàn công ty**. Hiệu suất dùng để **đánh giá**, gậy là kênh **phạt** duy nhất.
- **Sổ gậy `gay_ledger`** chỉ thêm dòng: số dương = đánh, số âm = gỡ. Sai thì **thu hồi mềm** (dòng còn nguyên làm vết, bị loại khỏi mọi tổng) — không sửa số, không xoá.
- **Tháng mới bắt đầu lại từ 0.** Số gậy của tháng = tổng sổ theo kỳ, sàn 0 (gỡ dư không để dành).
- **Gậy đi theo việc** (Thùy 05/09: "việc nào có gậy = không đạt chuẩn"): gậy gắn `ref_key` của việc — cùng khoá với Việc của tôi · hiệu suất · bản tin (`vh:<buổi>|<khâu>|<người>`).
- **Một gậy có HAI hệ quả — đừng lẫn** (đây là *một* hệ gậy, không phải hai):

  | Hệ quả | Mức | Ở đâu | Áp cho |
  |---|---|---|---|
  | **Tiền phạt** | **20.000đ / gậy** (Thùy 29/08) | `fn_gay_bang` → chốt tháng → trừ vào lương | Hiện chỉ trừ được vào lương TA (§5) |
  | **Điểm hiệu suất** | **−50 điểm / gậy** trên việc bị gậy, sàn 0 (Thùy 05/11, thay −15 và thang −10…−40) | `_hsta_tru_moi_gay()` | Hiệu suất TA (số của quản lý) |

### 4.2 Loại gậy
- Theo cách sinh (`gay_ledger.loai`): `tu_dong` (từ đề xuất của máy, người quyết) · `thu_cong` (người đánh tay, gắn việc hoặc lỗi ngoài ERP) · `go` (gỡ).
- Danh mục lỗi (`gay_loi`, sửa trên màn, mặc định 1 gậy / lỗi): **Chậm deadline trên ERP** (`cham_deadline`) · **Task không đạt chuẩn** (`khong_dat_chuan` — mặc định khi đánh theo việc) · Sai quy trình · Quên việc được giao (ngoài ERP).
- Danh mục hoạt động gỡ gậy (`gay_hoat_dong`): Chạy bộ · Dọn vệ sinh · Chống đẩy · Đánh nhầm gậy (số gậy gỡ điền tay).

### 4.3 Ai đề xuất — nguồn gậy

| Nguồn | Sinh khi | Người chịu | Chạy ở đâu |
|---|---|---|---|
| **Việc buổi thường trễ** (ET · BTVN · MT · đánh giá) | **Lần đóng ĐẦU TIÊN** sau hạn, hoặc quá hạn chưa đóng (Thùy 08/10). "Trễ 1 phút cũng tính", không ân hạn (Thùy 29/08) | **Người phụ trách LÚC HẠN** (bản chụp bất biến `viec_phu_trach_snap`, Thùy 04/11); một việc = một người; không xác định được chính chủ ⇒ **bỏ trống, không đánh bừa** | Máy quét chạy **khi có người mở màn Gậy** (§9.2 mục 3) |
| **Việc OPS gộp theo ca** (report · báo tan · điểm danh · prep · coi test) | Nhóm việc của ca "không đạt" (< 90 % mục đạt — Thùy 07/09). *Việc OPS chưa duyệt tự đạt sau 7 ngày (Thùy 17/11, chưa build)* | Người phụ trách nhóm việc | như trên |
| **Giáo trình tuần trễ** H1 23:59 thứ Sáu · H2 12:00 thứ Bảy (Thùy 16/11) | Quá hạn chưa gửi / chưa duyệt | Trưởng khối của ô · trưởng bộ môn | DB, bộ điều phối, mỗi 60 phút |
| **Nộp Báo cáo tuần trễ** (từ kỳ 02/11) | Quá hạn chưa nộp | Trưởng khối · trưởng bộ môn báo thay | DB |
| **Duyệt công TA quá 48 giờ** (Thùy 17/11) | Trưởng khối chưa duyệt sau 48 giờ ⇒ về khay Trang + đề xuất gậy | Trưởng khối | **chưa build** |
| **Việc phát triển trễ** (task giao tay) | **Không qua đề xuất**: tới hạn, cấp trên đánh giá và tự quyết "cờ trễ" = 1 gậy vào thẳng sổ (14/10) | Người nhận việc | DB (`_task_danh_co_tre`) |
| **Đánh tay** | Người có quyền chọn người → chọn việc (hoặc lỗi ngoài ERP) → số gậy + lý do | — | màn Gậy |
| **Bot Telegram tổng kết 24:00** | Thiết kế 14/10: máy đề xuất `danh · bo_qua · chua_den_luc`, người duyệt, quyết định đi **đúng đường quyết định gậy đang có** | — | **chưa xây; để sau** (Thùy 17/11) |

- Mỗi việc trễ chỉ đề xuất **một lần mãi mãi** (`gay_de_xuat.ref_key` duy nhất) — quét lại không đè quyết định của người.
- **Máy tự rút** đề xuất đang chờ khi đo lại thấy lần đóng đầu đúng hạn (lý do ghi rõ, người quyết để trống = máy). Gậy đã vào sổ thì máy không đụng.
- **Miễn gậy tự động** (`nhan_su.mien_gay`, hiện 2 / 55 người): máy quét bỏ qua, gậy tay vẫn đánh được. **Chỉ từ trưởng khối trở lên được đổi cờ này** (Thùy 15/11; `fn_gay_duoc_doi_mien`; Phó khối không).
- **Mốc ân xá:** việc có hạn trước **22/09/2026** không xét gậy (Thùy 24/09 — ân xá lần 2; đề xuất + sổ cũ đã xoá). Bảng việc tháng của TA / GV / OPS giữ mốc 01/09 (tách riêng có chủ ý).

### 4.4 Ai quyết · gỡ · thu hồi · hậu kiểm

| Việc | Ai | Ghi chú |
|---|---|---|
| Đánh / bỏ qua **gậy TA, GV** từ đề xuất | **Trưởng khối** trong phạm vi môn × khối (đề xuất gắn lớp nào thì về khối đó) — quyết có hiệu lực ngay | Bỏ qua **bắt buộc lý do**; sửa được số gậy + lỗi lúc quyết |
| **Gậy của trưởng khối** | **Trang** | Thùy 29/10 |
| Gậy của ô do trưởng bộ môn làm thay / duyệt | **CEO** | Thùy 16/11 |
| Gậy OPS | Trưởng Vận hành theo cây ghế | Thùy 29/08 "theo cây, không gõ cứng tên" |
| **Hậu kiểm** mọi quyết định gậy của trưởng khối | Trang (người có phạm vi toàn hệ): ✓ Đồng ý · ↩ Thu hồi gậy · ↺ Mở lại đề xuất đã bỏ qua | Bảng `hau_kiem`, từ 29/10; không có dòng = chưa xem. Đã xem 27 quyết định, đồng ý cả 27 |
| **Gỡ gậy** | Người có quyền, chọn hoạt động + số gậy | Không tự gỡ cho mình |
| **Thu hồi** | Người quyết hoặc cấp trên, bắt buộc lý do | Gậy chốt trước 08/10 theo cách đo cũ ⇒ màn gắn cờ "lần đóng đầu ĐÚNG HẠN", người quyết tự thu hồi |
| Phó khối | Không duyệt gậy | |

- Người bị gậy thấy ngay: hòm thư ("Bạn bị ghi N gậy" / "được gỡ" / "được thu hồi" — trigger `hom_thu_gay_trg`) + khối **Gậy của tôi** (gậy đã vào sổ + đề xuất đang chờ, để giải trình sớm).
- Mỗi dòng đề xuất / gậy gắn việc hiện **lịch sử đóng**: hạn · đóng lần đầu (trễ / đúng hạn) · mở lại N lần · đóng cuối.
- Mọi thay đổi ở `gay_de_xuat`, `gay_ledger` tự ghi `gay_log` (trigger — CLAUDE §4).
- **Hạn quyết một đề xuất: chưa có** ⇒ §9.1 câu 8.

### 4.5 Số hiện tại (17/11)

| | Tháng 9 | Tháng 10 | Tháng 11 |
|---|---|---|---|
| Gậy còn hiệu lực (sổ, theo kỳ) | 8 gậy / 6 người | **33 gậy / 9 người** | **56 gậy / 11 người** |
| — Chậm deadline · Không đạt chuẩn · khác | 8 · 0 · 0 | 15 · 17 · 1 | 43 · 13 · 0 |
| Đã thu hồi | 16 dòng | 2 dòng | 1 dòng |
| Đề xuất theo tháng của HẠN: đã đánh · bỏ qua · **đang chờ** | 20 · 72 · **30** | 41 · 222 · **190** | 20 · 70 · **94** |

- **314 đề xuất đang chờ** / 17 người = 302 việc buổi học + 12 báo cáo tuần; **147 cái có hạn đã quá 30 ngày** (cũ nhất 21/09). Trong 364 đề xuất đã bỏ qua, 117 do máy tự rút.
- Người bị gậy (gậy còn hiệu lực, tháng 11): **GV kiêm TA 34 gậy / 4 người** · GV 13 / 2 · TA thuần 6 / 4 · khác 3 / 1.
- Trung vị từ hạn tới lúc quyết đánh: 3,3 ngày. Số người đã đánh gậy: 2 → 4 → 5 (tháng 9 → 11).

### 4.6 Chốt tháng gậy (`fn_gay_chot_thang(kỳ)` → `gay_chot_thang`)
- Chụp cho từng người có gậy trong kỳ: số đánh · số gỡ · **số chốt** (sàn 0) · **đơn giá lúc chốt** · **tiền phạt** = số chốt × 20.000đ · bản chụp mọi dòng sổ · người chốt · giờ chốt.
- **Chốt lại = ghi đè** dòng cũ. Màn Gậy › tab Chốt tháng (xem trước rồi chốt).
- Gậy thuộc kỳ nào = **tháng ĐÁNH gậy** (`gay_ledger.ky` mặc định là tháng lúc ghi), **không phải tháng của việc bị trễ** — việc trễ tháng 10 mà quyết tháng 11 thì nằm kỳ 11 (đề xuất hạn tháng 10 đã đánh 41, nhưng sổ kỳ 10 chỉ có 15 dòng tự động). ⇒ §9.1 câu 8.
- **Hiện trạng: chưa tháng nào được chốt** (`gay_chot_thang` 0 dòng). Nếu chốt bây giờ: tháng 9 = 160.000đ · tháng 10 = 660.000đ · tháng 11 (đang chạy) = 1.120.000đ.

## 5. Gậy · hiệu suất → tiền

- **Đường duy nhất gậy thành tiền đang có:** sổ gậy → **chốt tháng gậy** → `gay_chot_thang.tien_phat` → `_ta_luong_tinh` trừ vào **thực nhận** của TA kỳ đó. Không trần phạt (Thùy 12/10).
- **Chưa chốt gậy tháng ⇒ bảng lương trừ 0đ** — kể cả khi sổ đã có gậy. Hệ không bắt thứ tự "chốt gậy rồi mới chốt lương" (§7).
- **Người không có lương trên ERP** (GV, GV kiêm TA, OPS, trưởng khối) ⇒ tiền phạt gậy **không trừ vào đâu cả**. Tháng 10: 33 gậy còn hiệu lực, chỉ **23 gậy / 5 người** rơi vào người có trong bảng lương TA; 10 gậy / 4 người còn lại không có chỗ trừ. ⇒ §9.1 câu 2.
- **Hiệu suất KHÔNG vào công thức lương** (Thùy 12/10). Điểm −50 / gậy chỉ làm đổi điểm hiệu suất — số để quản lý đánh giá, xếp lớp, và hiện ở Phòng trưởng khối. Chưa có luật nào đổi điểm hiệu suất ra tiền / thưởng.
- **Phần Bổ trợ 35 điểm của hiệu suất TA** — tự tính hay quản lý chốt tay: **còn treo** ⇒ §9.1 câu 7. (Lương đã tự tính phần bổ trợ theo giờ đã duyệt ÷ (8 × số lớp); hiệu suất đang ghi chỉ tiêu 8 giờ / tháng không nhân số lớp, và `hsta_chot` 0 dòng — chưa ai chốt lần nào.)
- Gậy còn hiệu lực cũng là điều kiện của việc "không đạt" ở bảng việc tháng của OPS / TA / GV (`fn_gay_dang_hieu_luc`) ⇒ thu hồi gậy thì việc hết "không đạt".

## 6. Bảng lương REALTIME của TA (Thùy 17/11) — đích; hiện có một phần

> *"TA về nguyên tắc sẽ thấy bảng lương realtime của mình: đã làm gì – được duyệt – gậy…"* ⇒ **một bảng**, thay ba bộ số (hiệu suất theo gậy · "Tiến trình" theo chuẩn 7 lần / tháng · tỉ lệ trợ giảng / BTVN của lương).

**Đang có** (app TA › Chấm công › tab **Lương** — `ta/CongTA.tsx`, đọc `fn_ta_luong_ky(kỳ, mình)`; TA chỉ xem được của mình): chọn tháng · "Tạm tính" / "Phiếu lương chính thức" · từng lớp (mức · trợ giảng x / y buổi · BTVN x / y lần · tiền) · bổ trợ (giờ / chỉ tiêu, giờ chồng nhau) · từng việc ngoài package · dòng "Phạt (gậy đã chốt)" · thực nhận.

**Đích — mỗi dòng trả lời đủ bốn câu "đã làm · đã duyệt · gậy · ra tiền":**

| Khối | Đã làm (ERP ghi nhận) | Được duyệt | Ra tiền | Thiếu hôm nay |
|---|---|---|---|---|
| Từng lớp — Trợ giảng | số buổi đã ghi công / số buổi lớp đã diễn ra / số buổi cả tháng | số buổi đã duyệt · chờ duyệt · bị từ chối (kèm lý do) · **thiếu công** | tiền theo phần đã duyệt | cột chờ duyệt / thiếu công chưa nằm cùng bảng lương |
| Từng lớp — BTVN | số buổi đã chấm / định mức | (lấy thẳng từ dữ liệu chấm, không qua duyệt) | tiền | — |
| Bổ trợ | giờ đã khai (đã loại chồng giờ) / chỉ tiêu | giờ đã duyệt · chờ duyệt | tiền | giờ chờ duyệt chưa hiện |
| Ngoài package | từng việc | trạng thái duyệt | số lượng × đơn giá (hoặc "chưa có đơn giá") | — |
| **Gậy** | **từng gậy của tháng**: việc nào · lý do · ai đánh · còn hiệu lực / đã thu hồi; **đề xuất đang chờ** để riêng (chưa trừ) | — | số gậy còn hiệu lực × 20.000đ = **tạm trừ**; sau chốt tháng = số chính thức | hiện chỉ thấy sau khi gậy tháng đã chốt |
| **Thực nhận tạm tính** | | | tổng − gậy | |

- Luật của bảng: **cùng một hàm với bảng lương quản lý xem** (`_ta_luong_tinh`), không công thức thứ hai · số chưa duyệt **hiện nhưng không cộng** vào tiền · tháng đã chốt ⇒ đọc bản chốt · "realtime" = tính lúc mở (0,2 giây / cả bảng; một TA nhẹ hơn), không polling.
- Màn "Tiến trình" (`fn_ta_tien_trinh`, chuẩn ở `ta_dinh_muc`) và điểm hiệu suất theo gậy **rút khỏi màn của TA** khi bảng này đủ; hiệu suất ở lại màn quản lý + Phòng trưởng khối.
- Cách hiện gậy khi tháng chưa chốt phụ thuộc §9.1 câu 1.

## 7. Chốt kỳ lương TA (Thùy 14/10, 04/11, 17/11)

- **Điều kiện** (`_ta_ky_tinh_trang`): đã qua **hạn duyệt / sửa = hết ngày 3 tháng sau** (hoặc hạn đợt khai lùi nếu muộn hơn) · **0 ca + 0 việc chờ duyệt** · **0 ca quên checkout** · tháng không nằm trước mốc chấm công (01/10/2026).
- **Thiếu công không chặn chốt.** Luật 17/11: trưởng khối duyệt công trong 48 giờ; thiếu công quá 24 giờ ⇒ trưởng khối nhập hộ hoặc ghi "không có công"; **sau ngày 3 tháng sau, phần còn thiếu coi như không có công** để chốt kỳ.
- **Chốt** (`fn_ta_chot_ky`, quyền ghi `ta_luong` — vai Core team: Thùy, Trang, Lộc; khoá chống hai người bấm cùng lúc): ghi một dòng `ta_luong_ky` (lần chốt · người · số TA · tổng thực nhận · **bản chụp toàn bộ thông số**: đơn giá, loại việc, mức lớp) + mỗi TA một dòng `ta_luong_ky_dong` (lớp · bổ trợ · ngoài package · tổng · phạt · thực nhận · chi tiết). **Bản chốt bất biến** (trigger).
- **Sau chốt:** khoá thêm / sửa / xoá ca + việc của tháng đó (`_ta_khoa_ky`) · khoá đơn giá + mức lớp đang dùng cho tháng đó · app TA hiện "Phiếu lương chính thức".
- **Sửa sau chốt** (đang chạy): **Mở lại kỳ** (`fn_ta_mo_lai_ky`, **bắt buộc lý do**, chỉ ghi một lần trên dòng chốt đó) → sửa → **chốt lần mới** (lần 2, 3…; lịch sử các lần giữ nguyên). ⇒ có nên cho mở lại kỳ đã trả tiền không: §9.1 câu 9.
- **Thứ tự với gậy:** hệ **chưa bắt** chốt gậy tháng trước khi chốt lương; chốt lương khi gậy chưa chốt ⇒ phạt 0đ được chụp vĩnh viễn vào bản chốt.
- **Hiện trạng: chưa kỳ nào chốt** (`ta_luong_ky` 0 dòng). **Tháng 10 đã đủ điều kiện chốt** từ 05/11 (0 chờ duyệt, 0 quên checkout) nhưng chưa ai bấm; còn **181 buổi / ca thiếu công** của tháng 10 (69 buổi lớp · 69 ca trực · 43 ca bổ trợ) và gậy tháng 10 chưa chốt. Tháng 11: 41 ca + 45 việc chờ duyệt, 9 ca quên checkout. ⇒ §9.1 câu 9.
- **Bộ kiểm** (chạy trong `BEGIN … ROLLBACK` trên DB thật, `scripts/luong-ta-t9/`): `test_chamcong` · `test_ngay_phan_cong` · `test_chot_ky` · `test_sua_cong` · `test_don_gia` · `test_loai_viec` · `test_luong_lop` · `test_bo_tro_trung_gio` · `test_chot_theo_viec` · `test_mo_lai_cong` · `kiemchuan` (tháng 9 so với sheet). Thêm migration lương / chấm công mới ⇒ thêm vào danh sách của `_mig.mjs`. **Sửa hàm lương ⇒ so tổng kỳ gần nhất trước – sau, khớp từng TA mới áp.**

## 8. Bảng · hàm · trigger (đối chiếu 17/11)

| Bảng | Vai trò | Giá trị hợp lệ / ghi chú |
|---|---|---|
| `ta_don_gia` | Thông số lương + đơn giá, có hiệu lực | xoá mềm; khoá khi tháng đã chốt |
| `ta_luong_lop` | Mức lương theo lớp × tháng hiệu lực | hiệu lực phải là ngày 1; xoá mềm |
| `ta_loai_viec` | Loại việc + cách tính | `nhom` package · ngoai_package · `tinh_vao` tg · bo_tro · bo_tro_dac_biet · trong_thi · cham_thi · khac |
| `ta_luong_ky` · `ta_luong_ky_dong` | Lần chốt · phiếu từng TA | bất biến; `mo_lai_at` ghi một lần |
| `ta_cham_cong` · `ta_cong_viec` · `ta_cong_log` | Ca · phiếu công · vết (⇒ #10 §7) | — |
| `gay_ledger` | Sổ gậy | `loai` tu_dong · thu_cong · go; đánh phải có lỗi, gỡ phải có hoạt động; thu hồi mềm |
| `gay_de_xuat` | Đề xuất của máy | `trang_thai` cho · da_danh · bo_qua; `nguon` vanhanh · giaoviec; `ref_key` duy nhất |
| `gay_loi` · `gay_hoat_dong` | Danh mục lỗi · hoạt động gỡ | — |
| `gay_chot_thang` | Chốt tháng (kỳ × người) | lưu đơn giá + tiền phạt + bản chụp |
| `gay_log` · `hau_kiem` | Vết · hậu kiểm | `hau_kiem.loai` gay_ledger · gay_bo_qua · viec_van_hanh · ca_nhe; `ket_qua` dong_y · da_sua |
| `hsta_chot` (+ `_log`) · `hsta_ghi_them` | Chốt hiệu suất (⇒ #10 §8) | 0 dòng |
| `nhan_su.mien_gay` | Miễn gậy tự động | 2 người |

**Hàm.** Lương TA: `_ta_luong_tinh` (công thức) · `_ta_luong_ky_core` · `fn_ta_luong_ky` (đã chốt ⇒ bản chốt; chưa ⇒ tạm tính) · `fn_ta_luong_ky_tong` · `fn_ta_luong_thang` · `_ta_ky_tinh_trang` · `fn_ta_ky_trang_thai` · `fn_ta_chot_ky` · `fn_ta_mo_lai_ky` · `fn_ta_ky_thong_so` · `_ta_thong_so_ky` · `fn_ta_don_gia_ds` · `fn_ta_dat_don_gia` · `fn_ta_sua_don_gia` · `fn_ta_xoa_don_gia` · `fn_ta_bang_don_gia` · `fn_ta_luong_lop_ds` · `fn_ta_luong_lop_dat` · `fn_ta_luong_lop_xoa` · `_ta_moc_cham_cong` · `_la_gv_kiem_ta` · `_ta_pc_khoang`.
Gậy: `fn_gay_bang(kỳ)` · `fn_gay_bang_khoang(từ, đến)` · `fn_gay_chot_thang` · `fn_gay_ung_vien_vh` · `fn_gay_de_xuat_tinh_lai` · `fn_gay_de_xuat_lop` · `fn_gay_pham_vi_khoi` · `fn_gay_theo_task` · `fn_gay_dang_hieu_luc` · `fn_gay_lich_su` · `fn_gay_duoc_doi_mien` · `fn_viec_tien_do` · `_viec_dong_dau` · `_gtt_gay_tre_chay` · `_bctk_de_xuat_tre` · `_task_danh_co_tre` · hậu kiểm `fn_hau_kiem_gay` · `fn_hau_kiem_ghi` · `fn_hau_kiem_mo_lai_de_xuat`.
Hiệu suất (tham số): `_hsta_tru_moi_gay()` = 50 · `_hsta_ti_trong()` = 50 / 15 / 35 · `_hsta_chi_tieu_gio_bo_tro()` = 8.

**Trigger (code ẩn).** `ta_luong_ky`, `ta_luong_ky_dong`: `_ta_luong_ky_bat_bien` · `ta_don_gia`: `_ta_don_gia_khoa_ky` + `_ta_don_gia_kiem_sua` + log · `ta_luong_lop`: `_ta_luong_lop_kiem` + log · `ta_cham_cong`, `ta_cong_viec`: `_ta_khoa_ky` (+ các trigger kiểm ở #10) · `gay_ledger`: `trg_log_gay_ledger` + `hom_thu_gay_trg` · `gay_de_xuat`: `trg_log_gay_de_xuat` · `hsta_chot`: `trg_hsta_chot_log`.

**Màn.** ERP: `tacong/LuongTaScreen.tsx` (Bảng lương · Loại việc & cơ chế · Đơn giá · Lương theo lớp; quyền `ta_luong`) · `gay/GayScreen.tsx` (Bảng gậy · Đề xuất · Đánh / Gỡ · Danh mục · Chốt tháng) + `gay/HauKiemTab.tsx` · seam `src/lib/tacong.ts`, `src/lib/gay.ts`, `src/lib/gaycuatoi.ts`. App TA: `ta/CongTA.tsx` tab Lương · khối Gậy của tôi. Phòng trưởng bộ môn hỏi lương qua `_phong_hoi_cc_luong` (chỉ phần bộ môn mình — Thùy 05/11).

**Theo lịch.** `gtt_gay_tre` (60 phút) trong bộ điều phối `tinh_san_dang_ky`. Máy quét việc buổi thường **không** có dòng điều phối (§9.2 mục 3).

## 9. Câu hỏi cho Thùy · lệch kỹ thuật

### 9.0 Thùy trả lời 17/11 (lượt 1 — thắng "đề xuất" ở 9.1; chỗ tôi CHƯA CHẮC hiểu đúng ghi rõ, chờ Thùy xác nhận)

| Câu | Thùy trả lời (nguyên văn) | Ghi vào spec | Còn phải hỏi |
|---|---|---|---|
| 1 | **"Không trừ tiền"** (17/11) | **GẬY KHÔNG TRỪ TIỀN LƯƠNG.** Gậy chỉ là điểm (−50 điểm hiệu suất / gậy) + đánh giá; gỡ bằng hoạt động như cũ. Bỏ luật 20.000đ / gậy (29/08) và vế "lương trừ tiền phạt gậy" (12/10). Chấm muộn ⇒ gậy, không cắt tiền (câu 11). **Code đang trái:** `fn_gay_bang` còn tính `tien_phat` 20.000đ, công thức lương còn trừ tiền phạt gậy đã chốt, màn Gậy còn hiện tiền — sửa khi có lệnh (chưa tháng nào chốt nên chưa ai bị trừ). | — |
| 2 | (hết cần — theo câu 1) | Không ai bị trừ tiền vì gậy, kể cả người không có lương trên ERP. Chốt tháng gậy (nếu giữ) chỉ để chốt điểm / đối chiếu. | — |
| 3 | "giáo viên full time có vai học thuật – trưởng khối ko có lương bổ trợ, ko có lương gì khác" | **Giáo viên full-time giữ vai học thuật / trưởng khối: KHÔNG có tiền dạy bổ trợ, không có khoản nào khác ngoài lương của họ.** 247 buổi bổ trợ do giáo viên đứng không sinh công / tiền. | Giáo viên KHÔNG full-time (nếu có người như vậy dạy bổ trợ) thì sao? |
| 4 | "GV có khung lương cứng" | **Giáo viên có khung lương CỨNG** — không tính theo thang buổi × sĩ số. Thang 03/09 (300–750 nghìn / buổi) bỏ. | Khung lương cứng lưu ở đâu — ngoài ERP (kế toán giữ) hay đưa số vào hệ? |
| 5 | "Giáo viên bình thường – có 3 gv tiểu học như m nói" | Tôi hiểu: **ngoài khung lương cứng, chỉ còn 3 giáo viên tiểu học tính theo thang buổi 09/10** (§2.1) như đang làm. | xác nhận cách hiểu; 5 ý nhỏ (buổi bù · MT · sĩ số em vắng · 90/10 · đưa vào ERP) chỉ còn áp cho 3 người này |
| 6 | "Bản 12/10 thay hẳn" | Thang TA gói / buổi theo sĩ số (03/09) là LỊCH SỬ; công thức 12/10 (mức lớp × 40 / 20 / 40) là luật. | — |
| 7 | "Ko hiểu" | — | hỏi lại bằng lời dễ hiểu |
| 8 | OK | 314 đề xuất gậy tồn: **ân xá phần có hạn trước 01/11**, làm lại từ tháng 11. Về sau: hạn quyết 7 ngày, quá hạn về khay Trang, quá 30 ngày máy tự bỏ qua; **gậy tính theo tháng của việc trễ**. | — |
| 9 | OK | Thứ tự mỗi tháng: ngày 1–3 trưởng khối xử lý thiếu công + quyết gậy → ngày 4 Trang chốt gậy → ngày 5 Trang chốt lương, Thùy xem tổng (hệ chặn chốt lương khi gậy tháng chưa chốt). Kỳ đã trả tiền không mở lại — chênh ghi dòng "điều chỉnh" kỳ sau. | — |
| 10 | "cái này setup trên app mà" | **Đơn giá việc ngoài gói do quản lý ĐẶT TRÊN APP** (bảng thông số có ngày hiệu lực) — spec không ghi cứng số. Việc chưa đặt giá (Họp, Đào tạo) = chưa trả cho tới khi có người đặt. | — |
| 11 | "ý là có deadline của BTVN mà" → làm rõ: **"Nếu TA chấm muộn thì bị phạt ở gậy, không trừ vào lương."** | **Chấm BTVN trễ hạn VẪN được tính tiền phần BTVN** (như code đang chạy: buổi có chấm trước ngày 3 tháng sau là tính). Trễ hạn chấm ⇒ **gậy**, không cắt phần tiền BTVN — không phạt hai lần. Chấm ET cũng vậy (trễ ⇒ gậy). | — |
| 12 | ok | Gậy đã vào sổ mà tháng chưa chốt hiện "tạm trừ" trong bảng lương realtime; bỏ màn "Tiến trình" + điểm hiệu suất khỏi app TA khi bảng xong (giữ Xếp hạng · Gậy của tôi · Shopping). | — |

### 9.1 Câu hỏi (xếp theo mức ảnh hưởng tới tiền người nhận)

1. **Gậy có trừ vào lương không, mỗi gậy bao nhiêu?**
   29/08: 1 gậy = 20.000đ, "chốt tháng chỉ để đối chiếu, không dính lương". 12/10: "sai thì gậy + phạt, không trần" — công thức lương trừ tiền phạt gậy đã chốt. 05/11: mỗi gậy −50 **điểm** hiệu suất (không phải tiền).
   Đang chạy: 20.000đ / gậy viết cứng trong hàm; lương có trừ, **nhưng chưa tháng nào chốt gậy nên thực tế chưa trừ đồng nào**. Nếu chốt tháng 10 bây giờ: 660.000đ / 9 người.
   (a) Trừ 20.000đ / gậy vào lương tháng đó. (b) Không trừ tiền — gậy chỉ hạ điểm hiệu suất + gỡ bằng hoạt động. (c) Trừ, mức khác (Thùy cho số).
   **Đề xuất: (a)** — đúng quyết định 12/10; −50 chỉ là điểm.

2. **Gậy của người KHÔNG có lương trên ERP (GV · GV kiêm TA · OPS · trưởng khối) thu thế nào?**
   Tháng 11: 34 / 56 gậy là của GV kiêm TA, 13 của GV. Tháng 10: 10 / 33 gậy không có bảng lương nào để trừ.
   (a) Chốt tháng gậy ra **một bảng cho mọi người**; người chưa có lương trên ERP thì kế toán trừ ngoài theo bảng đó. (b) Với các nhóm này gậy chỉ để đánh giá, không thu tiền.
   **Đề xuất: (a)** — cùng một lỗi không nên có người mất tiền người không.

3. **Công dạy ca bổ trợ của giáo viên (L3 / L4) và của GV kiêm TA (L1 / L2) — trả theo gì, bao nhiêu?**
   01/10 → 16/11 có 247 buổi ≈ 194 giờ do hai nhóm này đứng, **không có công ở đâu** (GV kiêm TA 151 buổi, GV thuần 96 buổi; buổi sau giờ chỉ ~20 phút).
   (a) Trả **theo giờ đứng ca**, một đơn giá giờ bổ trợ cho GV (Thùy cho số; TA đang là 50.000đ / giờ cho việc phát sinh). (b) Trả theo buổi theo thang GV × hệ số giờ. (c) Đã nằm trong lương GV, không trả thêm.
   Kèm: phần việc TA của GV kiêm TA (trợ giảng lớp, chấm BTVN lớp mình) hiện 0đ trên ERP — đã nằm trong lương GV của họ chưa?
   **Đề xuất: (a)**, công sinh tự động từ buổi bổ trợ đã hoàn tất, trưởng khối duyệt; cần Thùy cho đơn giá.

4. **Lương GV cấp 2 và cấp 3 tính theo thang nào?**
   Thang 09/10 (350.000 → 650.000đ / buổi 1,5 giờ) Thùy chốt **chỉ cho cấp 1**. Bản 03/09 có thang chung 300.000 → 750.000đ / buổi 2 giờ nhưng ghi "tạm chốt, chưa áp".
   (a) Cấp 2 / 3 dùng thang 09/10 + hệ số giờ. (b) Dùng thang 03/09. (c) Thang riêng (Thùy cho số). Và lớp **từ 14 em** là bao nhiêu?
   **Đề xuất: Thùy cho thang (c)**; tới lúc đó spec ghi "chưa có luật", không ai tự tính.

5. **Lương GV — các điểm treo từ 09/10 và 18/09** (trả lời từng ý, 1 chữ):
   (i) buổi **bù** GV dạy có trả không — đề xuất: có, theo §2.1 với sĩ số của ca bù · (ii) buổi MT không lương có áp cấp 2 / 3 — đề xuất: có · (iii) em có tên nhưng vắng cả tháng có tính vào sĩ số — đang tính, đề xuất giữ · (iv) cơ chế **90 / 10 + phụ cấp chất lượng** (18/09) năm 2026 đã áp chưa — bảng lương tháng 7–9 đang trả đủ theo buổi, đề xuất: **chưa áp**, ghi là đích · (v) có đưa lương GV vào ERP (hàm DB + màn, thay bộ sinh PDF chép tay) — đề xuất: có, sau khi câu 4 có số.

6. **Thang TA bản 03/09 (gói 80.000–150.000đ / buổi theo sĩ số, level L1–L3, trưởng khối +1.500.000đ / tháng, quỹ thưởng) còn là đích không?**
   Công thức 12/10 (mức lớp × 40 / 20 / 40) đang chạy và khác hẳn cách trả đó.
   (a) Bản 12/10 thay hẳn; bản 03/09 chỉ còn là lịch sử (phần cơ cấu sang #19). (b) Bản 03/09 vẫn là đích, 12/10 là tạm.
   **Đề xuất: (a).** Kèm: phụ cấp trưởng khối / lương OPS / core team — spec này để trống vì không có nguồn; Thùy có muốn ghi không?

7. **Phần Bổ trợ 35 điểm trong hiệu suất TA — tự tính hay quản lý chốt tay?** *(treo từ câu 5 của #10)*
   Đang chạy: quản lý chốt tay, **chưa ai chốt lần nào** ⇒ tổng hiệu suất luôn là "tạm". Lương thì đã tự tính: tháng 10 có 7 / 17 TA đủ chỉ tiêu.
   (a) Tự tính = giờ bổ trợ đã duyệt ÷ (8 giờ × số lớp), tối đa 100 — **cùng số với lương**; bỏ bước chốt tay. (b) Giữ chốt tay, giao rõ ai chốt, hạn nào.
   **Đề xuất: (a).**

8. **314 đề xuất gậy đang chờ — xử lý thế nào, và gậy tính vào tháng nào?**
   190 cái có hạn tháng 10, 30 cái tháng 9; 147 cái quá 30 ngày chưa ai quyết. Hiện gậy tính vào **tháng người quyết bấm đánh**, không phải tháng việc trễ ⇒ quyết dồn bây giờ thì toàn bộ rơi vào lương tháng 11.
   (a) Trưởng khối quyết hết phần tồn trong một tuần; gậy tính theo tháng của việc trễ. (b) Ân xá phần có hạn trước 01/11, làm lại từ tháng 11. (c) Giữ như đang chạy.
   Kèm luật về sau: **hạn quyết một đề xuất** — đề xuất 7 ngày từ lúc sinh; quá hạn ⇒ về khay Trang; quá 30 ngày không ai quyết ⇒ máy tự bỏ qua (không phạt muộn).
   **Đề xuất: (b) cho phần tồn** (thà không phạt còn hơn phạt muộn và lệch tháng) **+ luật 7 / 30 ngày + gậy tính theo tháng của việc trễ.**

9. **Chốt kỳ lương: ai bấm, lúc nào, theo thứ tự nào — và sau chốt sửa ra sao?**
   Tháng 10 đủ điều kiện từ 05/11 nhưng chưa ai chốt (tạm tính 17 TA, 33.796.287đ); còn 181 buổi / ca thiếu công tháng 10 (theo luật 17/11: coi như không có công) và gậy tháng 10 chưa chốt. Lương tháng 10 đã trả ngoài ERP chưa?
   **Đề xuất:** thứ tự cố định mỗi tháng — ngày 1–3: trưởng khối xử lý thiếu công + quyết gậy → **ngày 4: Trang chốt gậy tháng** → **ngày 5: Trang chốt lương, Thùy xem tổng** (hệ chặn chốt lương khi gậy tháng chưa chốt). Sau chốt: **kỳ chưa trả tiền** thì mở lại – sửa – chốt lần mới như đang chạy; **kỳ đã trả tiền** thì không mở lại, phần chênh ghi thành dòng "điều chỉnh" ở kỳ sau.

10. **Đơn giá việc ngoài package.** Đang chạy 50.000đ / giờ cho **chấm thi** (từ 01/10), **làm đề thi** (từ 01/11), **bổ trợ ôn thi** — không tìm thấy ngày Thùy chốt ba mức này; **Họp, Đào tạo chưa có giá** (đang trả 0đ; tháng 10 có 2 TA dính).
    **Đề xuất:** Thùy xác nhận ba mức 50.000đ; Họp + Đào tạo: cho số hoặc ghi rõ "không trả".

11. **Hai chữ còn mơ hồ trong công thức TA** (đổi tiền nhẹ):
    (i) BTVN "chấm trong hạn" — đang hiểu là chấm trước ngày 3 tháng sau (chấm trễ hai tuần vẫn được tính tiền, trễ thì đã có gậy). Giữ, hay chỉ tính buổi chấm đúng hạn BTVN? — đề xuất **giữ** (không phạt hai lần).
    (ii) Chấm ET nằm trong 40 % "trợ giảng + ET" nhưng không đo: TA không chấm ET vẫn đủ 40 %. Giữ, hay tách (vd 30 trợ giảng + 10 ET)? — đề xuất **giữ** (ET trễ đã có gậy).

12. **Bảng lương realtime của TA (§6) — xác nhận hai điểm:** (i) gậy **đã vào sổ nhưng tháng chưa chốt** hiện là "tạm trừ" ngay trong bảng — đề xuất có; (ii) bỏ hẳn màn "Tiến trình" + điểm hiệu suất khỏi app TA khi bảng này xong — đề xuất có (giữ Xếp hạng · Gậy của tôi · Shopping).

### 9.2 Lệch kỹ thuật (không cần Thùy quyết — CTO làm khi có lệnh)

1. **Sổ gậy mở cho mọi nhân sự ghi qua API.** Policy của `gay_ledger`, `gay_de_xuat`, `gay_chot_thang`, `gay_loi`, `gay_hoat_dong`, `gay_log` đều là "mọi thành viên — ALL". Đánh / gỡ / thu hồi / quyết đề xuất / sửa danh mục là **ghi thẳng bảng từ client**; phạm vi (trưởng khối chỉ khối mình) **chỉ kiểm ở client**. `fn_gay_chot_thang` không có cổng quyền, và còn cấp EXECUTE cho `fdw_bkdemy_web`, `ph_nop`, `web_lead_writer`. Vì tiền phạt chảy vào lương ⇒ một TA gọi API tự gỡ gậy / tự chốt tháng được. Cần: mọi lượt ghi gậy thành RPC có cổng (`fn_pham_vi_cua_toi`), policy chỉ đọc.
2. **Đơn giá gậy 20.000đ viết cứng ba nơi** (`fn_gay_bang`, `fn_gay_bang_khoang`, hằng `GAY_DON_GIA` ở client) — không nằm trong bảng thông số có hiệu lực như đơn giá lương.
3. **Máy quét gậy việc buổi học chạy ở client, chỉ khi có người mở màn Gậy** (`quetGayTuDong`: tải ứng viên, lọc bằng JS, upsert `gay_de_xuat`), và chỉ xét hạn rơi trong **tháng hiện tại** ⇒ việc trễ cuối tháng mà sang tháng mới mới có người mở màn thì **không bao giờ được đề xuất**. Mốc ân xá 22/09 cũng nằm ở client. Trái CLAUDE §2.0 + luật "việc theo lịch ⇒ bộ điều phối" (hai nguồn gậy nhịp tuần đã làm đúng ở DB).
4. **Chốt tháng gậy không bất biến** (chốt lại = ghi đè), không khoá sổ kỳ đã chốt (vẫn đánh / thu hồi được gậy kỳ cũ), và **không ràng buộc với chốt lương** — bản chốt lương chụp tiền phạt tại lúc chốt; gậy chốt lại sau đó thì hai nơi lệch nhau.
5. **Kỳ của gậy = tháng ghi dòng sổ**, kỳ của lương = tháng của việc (§4.6, câu 8).
6. **`_la_gv_kiem_ta` đọc phân công HIỆN TẠI** ⇒ kỳ chưa chốt bị tính lại theo phân công hôm nay: thêm một phân công GV trong tháng 11 làm người đó mất lương TA tháng 10 chưa chốt (đã dính 21/10 vì nhập nhầm). Nên đọc phân công trong kỳ như `lop_cua`.
7. **Ba nơi giữ thông số gần trùng nhau:** `ta_don_gia` (lương: 8 giờ × lớp, BTVN 7 / 3) · `ta_dinh_muc` (Tiến trình: bổ trợ 8 giờ / TA, BTVN 7, ET 7) · hàm `_hsta_*` (hiệu suất: 8 giờ / tháng). Chỉ tiêu bổ trợ đang có hai nghĩa.
8. **Lương GV không có gì ở DB**; bộ sinh PDF (`reports/luong/_gen/`, ngoài git, không thấy trên máy này) dùng số buổi / sĩ số **chép tay** từ DB — trái CLAUDE §2.0.
9. **Mất văn bản nguồn:** `SPEC-tai-chinh-luong-gv-ta.md` bản có §3.1b + §3B + §7 #14–15 không tồn tại ở nhánh nào / thư mục nào; HANDOFF vẫn trỏ "nguồn chuẩn: §3.1b". Khi spec này chốt, sửa dòng trỏ đó về §2.1.
10. **`spec-cham-cong-ta.md` lỗi thời ở 5 chỗ:** bậc theo sĩ số (đã thay bằng `ta_luong_lop` 10/11) · giờ bổ trợ cộng thẳng (đã gộp giờ chồng 04/11) · "Trang duyệt hằng ngày" (trưởng khối từ 09/11) · "đơn giá chỉ thêm dòng" (sửa / xoá mềm từ 04/11) · thiếu loại việc sau giờ, làm đề thi.
11. Tháng 10 tạm tính: 1 TA có dòng lớp **thiếu mức** (trả 0đ cho dòng đó) — cần đặt mức trước khi chốt.
12. `fn_tich_luy_chot_thang` không có cổng quyền, còn cấp EXECUTE cho ba role ngoài; `tich_luy_chot_thang` 0 dòng (chưa tháng nào chốt điểm tích luỹ).
13. `gay_de_xuat.nguon` chỉ có `vanhanh` · `giaoviec`: gậy giáo trình tuần và báo cáo tuần đều ghi `vanhanh`, phân biệt bằng tiền tố `ref_key` (`vh:` · `gtt_dien:` · `gtt_duyet:` · `bctk:` · `task:`).
14. Màn Chốt tháng gậy cộng tổng tiền phạt bằng `reduce` ở client (cộng các dòng đang hiện — sát ranh giới §2.0; bảng lương TA đã có `fn_ta_luong_ky_tong`).
15. `ta_vang` (0 dòng), `fn_ta_tien_trinh`, `fn_ta_buoi_thang` còn đọc phân công hiện tại — đã ghi ở `spec-tro-giang.md` §12.2 mục 8–9; gỡ cùng lúc với màn "Tiến trình" (câu 12).
16. Kiểm chuẩn tháng 9 trên ERP ra 28.079.307đ, bản đã trả 28.256.807đ (dữ liệu DB trôi sau 13/10, không do code) — tháng 9 không được chốt trên ERP.

## 10. Chuyển sang spec khác

**⇒ #19 `spec-tai-chinh.md` (chưa viết)** — từ `SPEC-tai-chinh-luong-gv-ta.md` [nhánh 03/09]: §1 thông số đầu vào (học phí, sĩ số, mặt bằng, quỹ) · §2 benchmark ngành + giá thị trường · §3.4 bảng lãi lớp theo sĩ số · §5 bảng chi phí GV + TA theo sĩ số và mốc "GV + TA ≤ 30 doanh thu" · §6 cơ cấu tài chính cơ sở ổn định, hai sổ P&L cơ sở / HQ · §7 việc treo số 1, 9–12 (số buổi / tháng, thuế, pháp nhân, phí HQ, sheet kịch bản) · bảng tỉ lệ lương / doanh thu của thang GV 2026. **Spec này không chép các số đó.**
**⇒ #6:** ghế + phạm vi trưởng khối, hậu kiểm (cơ chế chung), KPI trưởng khối, Phòng làm việc. **⇒ #10:** khai / duyệt công, điểm hiệu suất, Tiến trình, tích luỹ – Shopping. **⇒ #7:** hạn H1 / H2, hạn nộp Báo cáo tuần. **⇒ #8:** việc OPS, tự đạt sau 7 ngày, học phí.

## 11. Khi Thùy duyệt

- `spec-cham-cong-ta.md` → `_luu-tru/` (đã hết phần còn hiệu lực: §1–§6 ở #10, §7–§9 ở đây) · sửa dòng #11 + bảng B của `SPEC-INDEX.md` · CLAUDE.md §7 thêm dòng spec này · `spec-tro-giang.md` đầu file bỏ câu "giữ ở gốc tới khi #11…" · HANDOFF mục "Lương GV cấp 1" trỏ về §2.1.
- **Nhánh `docs/tai-chinh-luong-gv-ta`: không merge** (HANDOFF trên nhánh đã cũ 2,5 tháng). Khi viết #19: chép nguyên văn file bản 03/09 vào `_luu-tru/SPEC-tai-chinh-luong-gv-ta.md` bằng `git show`, ghi rõ "bản 03/09, thiếu §3.1b + §3B". Xoá nhánh = theo Luật xoá, chỉ khi Thùy gật.
- Thêm bảng "§9.0 THÙY CHỐT" từ câu trả lời §9.1 (như `spec-tro-giang.md` §12.0), rồi sửa thân spec cho khớp. Việc code / DB (§9.2, bảng lương realtime §6, công GV §2.4, thứ tự chốt §7) chờ lệnh riêng.
