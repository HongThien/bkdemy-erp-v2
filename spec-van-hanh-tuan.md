# VẬN HÀNH HÀNG TUẦN — spec

> **Đọc file này TRƯỚC khi build/sửa bất kỳ việc nào chạy theo nhịp TUẦN**: Giáo trình tuần · Mục tiêu tuần · Báo cáo tuần ·
> chụp số đầu tuần · chốt tuần bổ trợ / KPI dạng yếu · Tổng kết tuần.
> **Thùy chốt 16/11/2026: "ghi chung vào 1 spec — Vận hành hàng tuần".** Luật vận hành tuần MỚI chỉ ghi vào file này.
> Gộp từ: `spec-giao-trinh-tuan.md` (chuyển trọn — §3) · `spec-bao-cao-tuan.md` (chuyển trọn — §5) · `spec-muc-tieu-tuan.md` (luật nghiệp vụ — §4;
> chi tiết kỹ thuật + nhật ký build Mục tiêu tuần vẫn ở file đó vì đang có phiên sửa dở, gộp hẳn khi phiên đó xong).
> Liên quan (không gộp — không phải việc theo tuần): `spec-truong-khoi.md` (phạm vi · hai tầng · KPI §4) · `spec-bo-tro.md` (luồng bổ trợ) ·
> `SPEC-troly-nhansu.md` (Tổng kết tuần, trình chiếu) · `spec-phong-truong-khoi.md` (phòng làm việc) · `spec-kien-truc.md` (luật kiến trúc).

---

## 0. Đích

Mỗi tuần trung tâm chạy **một vòng**: chốt **dạy gì** (Giáo trình tuần) → học sinh / phụ huynh thấy **phải nắm gì, đã làm gì** (Mục tiêu tuần) →
đo · chấm · bổ trợ trong tuần → máy **chụp sổ** đầu tuần sau → trưởng khối **báo cáo** tuần vừa qua → trưởng bộ môn ghép **Báo cáo Chuyên môn tuần** → chiếu TV cho CEO.
Mọi bước đọc chung **một bộ dữ liệu** (ca TKB · buổi giáo trình · lần đo · bổ trợ), không ai nhập lại số.

## 1. Nhịp tuần (giờ VN; tuần = thứ Hai → Chủ nhật)

| Lúc | Ai | Việc | Ở đâu | Ra gì |
|---|---|---|---|---|
| **Thứ Sáu, buổi họp** | Trưởng khối (cả đội GV cùng soạn) | Điền **Giáo trình tuần sau**: mỗi ca TKB T2→CN học buổi nào, nhóm › dạng nào (Hình: bài học + mô hình). Bấm **Gửi duyệt** | Phòng trưởng khối › 📅 Giáo trình tuần (§3) | `gtt_ca` · `gtt_duyet(gui)` |
| **23:59 thứ Sáu (H1)** | Trưởng khối | Đã bấm **Gửi duyệt** giáo trình tuần sau | — | Trễ ⇒ đề xuất gậy (§3.8) |
| **Sau họp → 12:00 thứ Bảy (H2)** | Trưởng bộ môn | **Duyệt** / **Trả lại** (có lý do) giáo trình tuần từng khối | Phòng trưởng bộ môn › 📅 Giáo trình tuần | `gtt_duyet(duyet)` + **bản chụp khung** |
| **CN 24:00 (= T2 00:00)** | Máy | Chụp **dạng yếu đầu tuần** mọi HS × môn (`_tu_dong_sang_t2`) · chốt **sổ Mục tiêu tuần** tuần cũ (`mtt_chot`, bất biến) · chụp số **đầu tuần** tuần mới (`mtt_dau`) | Bộ điều phối `_tinh_san_chay` | Sổ bất biến (§2.3) |
| **T2 sáng** | Máy | Báo cáo tuần trước MỞ (nháp, số tính sẵn) · tờ Mục tiêu tuần NHÁP dựng cho mọi em | — | — |
| **Chiều T2** | Trưởng khối | (1) Soi Dashboard học tập, **chốt bổ trợ** tuần (Phần 2 Mục tiêu tuần + ca test sau giờ) · (2) bấm **Công bố mục tiêu tuần** theo lớp · (3) **Nộp Báo cáo tuần** tuần trước (snap) | Phòng trưởng khối › Chất lượng · Dashboard học tập › 🎯 · 📝 Báo cáo tuần | `mtt_lop_chot` · `bao_cao_tuan_khoi` |
| **T2** | Trang | **Chốt tuần** bổ trợ (đóng băng KPI dạng yếu — `spec-truong-khoi` §4.1) | Như cũ | `chat_luong_tuan_hs` |
| **T2 – T3** | Trưởng bộ môn | Duyệt / trả lại báo cáo từng khối → **chốt Báo cáo Chuyên môn tuần** → **chiếu TV** cho CEO | Phòng trưởng bộ môn › 📝 | `bao_cao_chuyen_mon_tuan` |
| **Trong tuần** | GV / TA | Gán buổi ngày dạy (hệ chọn sẵn buổi kế hoạch — §3.4) · ET · BTVN · chấm · bổ trợ | Builder › Gán lớp · màn buổi | Lần đo ⇒ mastery ⇒ tờ tuần cập nhật |
| **Liên tục** | HS · PH | Xem tờ tuần (Phần 1 kiến thức mới · Phần 2 ôn tập · Việc của con · hạng) | App HS · app PH | — |

Hai chu kỳ **lệch nhau một buổi** trên cùng dữ liệu: **lịch dạy** (Giáo trình tuần — các buổi của tuần đó) và **mục tiêu học sinh** (lùi một buổi — §4.2). GV không phải nghĩ về độ lệch này.

## 2. Luật chung của mọi việc theo tuần

1. **Mọi dữ liệu mang nhãn `mon`** (CLAUDE §1.6). Thao tác trên Toán chạy y hệt mọi môn; khác nhau theo **khuôn** (nhóm › dạng bài · mô hình–bài–ý), không theo tên môn.
2. **Phạm vi = phân công (môn × khối)** — một nguồn `fn_pham_vi_cua_toi` / `_trong_pham_vi` (`spec-truong-khoi` §2). Trưởng / phó khối sửa khối mình; trưởng bộ môn + QLCL toàn hệ duyệt.
3. **Kỳ đã đóng = sổ bất biến** (K6): bản chụp duyệt giáo trình tuần · sổ Mục tiêu tuần 00:00 T2 · báo cáo đã nộp (snap) · KPI chốt tuần. Tính một lần, sau đó chỉ đọc. Muốn số mới = thao tác riêng có lý do + vết.
4. **Việc tồn = invariant, không bảng tasks** (CLAUDE §4): ∀ (điều kiện) ⇒ ∃ (bằng chứng); thiếu = việc của người phụ trách.
5. **Mọi đổi trạng thái** = cột hiện tại + trigger ghi lịch sử (actor · ts · cũ → mới). Sổ duyệt / gửi là bảng chỉ thêm.
6. **Số tính ở DB**, màn chỉ đọc; số cả khối / cả hệ là **bảng tính sẵn** qua bộ điều phối (`tinh_san_dang_ky`, K4) — không cron riêng.
7. **Nộp / duyệt trễ ⇒ đề xuất gậy** qua `gay_de_xuat` (người quyết theo `spec-truong-khoi` §3: gậy trưởng khối — Trang; ô do trưởng bộ môn làm thay — CEO).
8. **Tên giáo trình thống nhất** (Thùy 16/11): `Giáo trình <tên lớp>` (+ ` · <mô tả>` khi lớp có nhiều giáo trình cùng nhánh, vd KHTN theo chủ đề).
   Nhánh (Đại · Hình · HGT) **không vào tên** — màn hiện thành thẻ (`theNhanh`, registry `lib/mon.ts`). Màn tạo giáo trình khoá tên theo mẫu.
9. **Một giáo trình = một lớp** (Thùy 16/11; 16/11 mọi lớp đã có giáo trình riêng — 4A1 gắn lại, 5A1 clone từ 5A2). Lớp có Đại + Hình = 2 giáo trình.

---

## 3. GIÁO TRÌNH TUẦN (kế hoạch dạy từng ca)

> Trạng thái: **Thùy duyệt + build xong 16/11/2026** (bước 1–6). Mig: `202611161716` · `1722` · `1726` · `1727` · `1740` · `1747` · `1754` · `1843` · `1850` · `1902` · `1907` · `1916` · `1920` · `1926`.
> Code: `src/screens/phongtk/GiaoTrinhTuan.tsx` (đồ vật 📅 trong Phòng) · `src/lib/giaoTrinhTuan.ts` · nhãn ngày trong `BuilderBanDoMoi` / `ChuyenDeHinhBuilder` · ngày mặc định trong `GanLopBdm`.

### 3.0 Phiếu 10 câu (spec-kien-truc §9)

| # | Câu | Trả lời |
|---|---|---|
| 1 | Miền · bảng | **Vận hành lớp.** `gtt_ca` (ca ↔ buổi builder) · `gtt_ca_log` (vết, trigger) · `gtt_duyet` (sổ gửi / duyệt / trả lại, chỉ thêm). Khung dạng **không** có bảng mới — nằm trong builder (`tai_lieu_phan`) |
| 2 | Mã gốc | Ca = khoá tự nhiên `(lop_id, ngay)` (TKB: mỗi lớp ≤ 1 ca/ngày, đo 16/11 có 0 trùng). Buổi = `tai_lieu_phan.id` nút `buoi` (bất biến). "Buổi 7" chỉ hiển thị (`tenBuoi`, số suy ra) |
| 3 | Nhãn `mon` | `gtt_ca.mon` · `gtt_duyet.mon`, trigger lấy từ `lop.mon`. Đại · HGT · Hình · KHTN cùng một bộ hàm, dispatch theo khuôn |
| 4 | Quyền | RLS bật, đọc: nhân sự; **ghi chỉ qua RPC** secdef có cổng `_gtt_kiem_pham_vi` (+ `_gtt_la_tbm` khi duyệt / trả lại). Không cấp `anon`. Hàm `_gtt_*` không cấp client |
| 5 | Lượt gọi lúc mở | **1**: `fn_gtt_man_tuan(mon, khoi, tuan)`. Bấm ca mới gọi chi tiết (danh sách buổi = hàm builder) |
| 6 | Chi phí | Theo MỘT khối × MỘT tuần. Đo 16/11: 55–96 ms / khối (≈ 47 ms là đường truyền). Không đụng lịch sử đo |
| 7 | Số tính sẵn | Không cần (đọc trực tiếp, rẻ) |
| 8 | Index | `gtt_ca` PK `(lop_id, ngay)` + unique `(buoi_id)`; `gtt_duyet (mon, khoi, tuan, so desc)`; `tai_lieu (lop_id) where loai='giao_trinh'` |
| 9 | Polling | Không. Vá tại chỗ; sau khi gắn 1 ca đọc lại nền (buổi kế tiếp dịch); màn nhớ `NHO` |
| 10 | Tăng trưởng | ~50 lớp × 3 ca × 52 tuần ≈ 8.000 dòng/năm, giữ vĩnh viễn (dữ liệu gốc) |

### 3.1 Story & đích

- **Trước:** thứ Sáu đội GV họp, chốt nội dung tuần sau **trên Google Sheet**; buổi giáo trình chỉ được gán cho lớp **đúng ngày dạy** (30 ngày tới 16/11: 225/261 lượt gán tạo đúng ngày học) ⇒ trước ngày dạy hệ **không biết** tuần tới học dạng gì.
- **Đích:** thay đúng cái Sheet đó. Trưởng khối điền cho **từng ca TKB** tuần sau: ca đó học **buổi nào · nhóm › dạng nào** (chỉ khung; câu GV chọn sau trong builder). Trưởng bộ môn duyệt.
- **Mục tiêu chính:** biết tuần này học dạng gì. Mục tiêu tuần HS, BTVN, ET… chạy theo cái này.

### 3.2 Mô hình — một sự thật, hai cửa sổ

```
Thời khoá biểu (thoi_khoa_bieu) + buổi thường đã mở ──suy ra──▶ CA (lop, ngay, giờ)      [không lưu — _gtt_ca(lớp[], từ, đến)]
                                                                   │
                                                          gtt_ca (lop, ngay) ⇄ buoi_id       [1 dòng = 1 liên kết 1-1]
                                                                   │
Builder giáo trình CỦA LỚP ──────────────────────────────▶ nút buổi (tai_lieu_phan 'buoi')
     khuôn nhóm (Đại · HGT · KHTN):  └─ nhóm └─ dạng bài └─ câu
     khuôn mô hình (Hình):           └─ bài học 'dang' (HỌC) · mô hình 'hl_mo_hinh' (LUYỆN) └─ câu / bài
```

- **Khung chỉ lưu MỘT chỗ — dưới nút buổi trong builder.** Màn tuần và builder là hai cửa sổ nhìn cùng dòng ⇒ sửa bên này bên kia đổi theo, không có bản sao.
- `gtt_ca` chỉ giữ liên kết, unique cả hai phía ⇒ đúng 1-1. Trigger `_gtt_ca_kiem`: buổi phải thuộc giáo trình CỦA ĐÚNG LỚP, nhãn môn lấy từ lớp.
- Chỉ **ca thường** (TKB + `buoi_hoc.loai = 'thuong'`). Buổi bù, bổ trợ, MT không nằm ở đây. Ca huỷ hiện gạch; ca hôm qua trở về trước không sửa được.

### 3.3 Luồng trên màn

1. **Thứ Sáu — trưởng khối** mở *Phòng › 📅 Giáo trình tuần*, mặc định **tuần sau**, ô (môn × khối) trong phạm vi (xếp theo `thuTuMon`, khối theo số).
   Lưới: hàng = lớp · cột = T2…CN · ô = ca (giờ · phòng · Buổi N · ≤ 4 dòng khung + "+N khác" · cờ "sửa sau duyệt" / "✓ đã gán ngày dạy" / "⚠ ngày dạy gán buổi khác").
2. **Bấm một ca ⇒ khung bên phải.** Mỗi giáo trình của lớp một khối, có thẻ **Đại / Hình / HGT** (Đại trước):
   - **"✓ Dùng buổi kế tiếp — Buổi N · …"** (Thùy 16/11: *"khi giáo viên chọn thì hệ thống tự đề xuất — mỗi lớp 2 giáo trình nên hệ thống chọn được đâu"*):
     hệ **không đoán giáo trình cho ca**; người chọn giáo trình, hệ đề xuất **buổi kế tiếp chưa gán** của giáo trình đó (§3.5). Hết buổi soạn sẵn ⇒ nhắc "+ Buổi mới".
   - **+ Buổi mới** — khuôn nhóm: `BoChonNhom` của builder; khuôn Hình: `ChonBaiHoc` của builder Hình. Tạo buổi cuối giáo trình + gắn ca + đặt khung trong **một** giao dịch.
   - **Chọn buổi có sẵn** — danh sách buổi (hàm builder `fn_tl_bdm_noi_dung`); buổi đã gắn ca khác hiện ngày, không chọn được.
   - Ca đã có buổi: **✏️ Sửa khung** (nhóm) / **✏️ Bài học** · **✏️ Mô hình** (Hình) · **📖 Mở trong builder** · **🔁 Đổi buổi** · **Bỏ gắn**.
3. **Gửi duyệt** theo (môn × khối × tuần); ca trống vẫn gửi được, thanh trên ghi "còn x/y ca chưa có khung".
4. **Trưởng bộ môn** mở cùng màn ⇒ **Duyệt** (máy chụp khung mọi ca vào `gtt_duyet.khung`) hoặc **Trả lại** (bắt buộc lý do, hiện đầu màn).
5. **Sau duyệt vẫn sửa được** (Thùy), không phải duyệt lại; ô khác bản chụp có cờ **"sửa sau duyệt"**; vết ở `gtt_ca_log` + log builder. Gửi lại được sau duyệt.
6. Builder hiện nhãn **"📅 T5 26/11"** trên buổi đã lên kế hoạch (Đại · HGT · KHTN · Hình).

### 3.4 Ngày dạy (gán buổi cho lớp)

- Hộp **Gán lớp** (`GanLopBdm`) mặc định gán buổi vào **đúng ngày kế hoạch** (nhãn "📅 Kế hoạch T5 · 26/11"); ngày đã dành cho buổi khác không làm mặc định.
- Trigger `trg_gtt_theo_ngay_day` trên dòng gán `tai_lieu` (`giao_trinh_buoi`) — **cùng giao dịch** với lượt gán: gán buổi khác kế hoạch ⇒ liên kết chuyển theo buổi thật được dạy
  (ca cũ trở về trống); gán ngày chưa có kế hoạch ⇒ đẻ liên kết luôn. Buổi giáo trình chung / bản đồ cũ / `nguon_buoi` rỗng ⇒ bỏ qua, **không chặn gán**. Xoá dòng gán không đụng kế hoạch.
  K28 đo 16/11: lệnh gán thêm 0,05–2,2 ms. Lượt gán trước khi có trigger (từ 16/11) đã bù bằng mig `1907` (28 liên kết).
- Bản chép của lớp (`giao_trinh_buoi`) giữ cách làm hiện nay — sửa khung sau khi đã gán **không** đổi bản đã gán.

### 3.5 Buổi kế tiếp (đề xuất khi người chọn giáo trình)

- `_gtt_ke_tiep(giáo trình)` = buổi đầu tiên đứng **sau buổi đã dùng cuối cùng** (đã gán ngày dạy cho lớp hoặc đã gắn ca). Buổi bị bỏ qua giữa chừng coi là GV chủ ý bỏ ⇒ không đề xuất lại
  (đo 16/11: 23 buổi soạn trước chưa gán đứng sau buổi cuối · 9 buổi bị bỏ giữa chừng). Gắn xong một ca ⇒ buổi kế tiếp tự dịch.
- **Đã thử và BỎ (Thùy 16/11):** tự đoán giáo trình cho từng ca theo thứ trong tuần + nút "Nhận N đề xuất" (mig `1902`, hàm đã drop ở `1920`) — lớp Đại + Hình thì chỉ người biết ca đó dạy gì.

### 3.6 Bảng & hàm

| | |
|---|---|
| `gtt_ca` | `lop_id · ngay` (PK) · `buoi_id` (unique, FK `tai_lieu_phan` on delete cascade — xoá buổi trong builder ⇒ ca trở về trống) · `mon` · `sua_boi · sua_at` |
| `gtt_ca_log` | vết đổi liên kết (cũ / mới / người / lúc), trigger ghi |
| `gtt_duyet` | `so` (identity — thứ tự ghi) · `mon · khoi · tuan` (thứ Hai) · `hanh_dong` gui / duyet / tra_lai · `ghi_chu` · `khung` (chỉ khi duyệt: `{lop|ngay: {buoi, k[]}}`) · `nhan_su_id · at` |
| `fn_gtt_man_tuan(mon, khoi, tuan)` | cả lưới: lớp · giáo trình (+ `ke_tiep`) · ca (buổi · khung · `da_gan` · `sua_sau_duyet`) · trạng thái + 10 dòng sổ · `mo_coi` (liên kết của ngày không còn ca) |
| `fn_gtt_chon_buoi(lop, ngay, buoi \| null)` | gắn buổi có sẵn / bỏ gắn; buổi đã gắn ca khác ⇒ lỗi (1-1) |
| `fn_gtt_dat_khung(lop, ngay, chon, tai_lieu?)` | đặt khung; ca chưa gắn ⇒ tạo buổi mới ở `tai_lieu`. `chon` mảng `[{nhom, dang_bai[]}]` ⇒ `fn_tl_bdm_dat_buoi` (BTVN 5 câu/nhóm như builder); đối tượng `{bai?, mo_hinh?}` (Hình) ⇒ `fn_tl_hh_dat_bai` / `fn_tl_hl_dat_mo_hinh`. Sai khuôn ⇒ lỗi |
| `fn_gtt_chuyen(mon, khoi, tuan, hd, ghi_chu?)` | gửi / duyệt (chụp khung cùng giao dịch) / trả lại (bắt buộc lý do); khoá advisory theo tuần |
| `fn_gtt_ngay_buoi(tai_lieu)` | buổi nào đã gắn ca nào — nhãn ngày trong builder, hộp Gán lớp |
| `_gtt_ca` · `_gtt_khung` · `_gtt_khung_khoa` · `_gtt_ca_json` · `_gtt_snap` · `_gtt_ke_tiep` · `_gtt_kiem_ca` · `_gtt_kiem_pham_vi` · `_gtt_la_tbm` · `_gtt_trang_thai` · `_gtt_snap_duyet` | nội bộ |
| Trigger | `gtt_ca_kiem_trg` · `gtt_ca_ghi_vet_trg` · `trg_gtt_theo_ngay_day` (trên `tai_lieu`) |

### 3.7 Nối với Mục tiêu tuần

- `_mtt_tinh` thấy **ca chiếu từ TKB** (`_gtt_ca`, từ hôm nay — buổi tương lai chưa có dòng `buoi_hoc`) ⇒ cửa sổ "lùi một buổi" đủ ngay thứ Hai (mig `1754`).
- Nhóm của buổi: lớp đã có bản chép ngày đó ⇒ đọc bản chép (như cũ); chưa có ⇒ câu của **buổi kế hoạch** (`gtt_ca` → builder), quy nhóm bằng đúng `_do_o_quy`. Phiên Mục tiêu tuần gom nguồn câu về `_mtt_o_buoi` / `_mtt_o_lui` (mig `1844`).
- **Không gộp hai lượt chốt**: duyệt giáo trình tuần (thứ Sáu, trưởng bộ môn) ≠ công bố mục tiêu tuần (thứ Hai, trưởng khối sau khi chốt bổ trợ). Cột "Giáo trình x/y" của tab trung tâm Mục tiêu tuần đếm ca TKB + buổi kế hoạch.
- Sau này: chỉ số **"tỉ lệ dạy đúng giáo trình đã chốt"** = so `gtt_duyet.khung` với bản chép ngày dạy (dữ liệu đã có).

### 3.8 Hạn · việc tồn · gậy (Thùy chốt 16/11 "như đề xuất"; mig `202611161949`)

- **H1 = 23:59 thứ Sáu** trước tuần: trưởng khối đã **Gửi duyệt** (mốc "điền xong" = bấm Gửi; ca trống vẫn gửi được, màn đếm "còn x/y ca chưa có khung").
- **H2 = 12:00 thứ Bảy** trước tuần: trưởng bộ môn đã **Duyệt hoặc Trả lại** bản gửi trước H2.
- Việc tồn = invariant, không bảng: `_gtt_han_json(môn, khối, tuần)` (một chỗ định nghĩa "trễ") — màn tuần hiện "Hạn gửi … · hạn duyệt …", đỏ khi trễ.
- **Trễ ⇒ đề xuất gậy** (`gay_de_xuat`, nguon `vanhanh`, ref `gtt_dien:<môn>|<khối>|<tuần>|<người>` / `gtt_duyet:…`, chạy lại không trùng):
  H1 → trưởng khối của ô (Trang quyết) · H2 → người giữ ghế trưởng bộ môn của môn (CEO quyết). Ô không có trưởng khối ⇒ không gậy H1.
  Chỉ xét ô có lớp đã có giáo trình bản đồ mới (môn chưa dùng thì chưa có gì để điền). Kỳ đầu = tuần 23/11 (hạn 20/11 · 21/11).
- Chạy: dòng `gtt_gay_tre` trong `tinh_san_dang_ky` (mỗi 60 phút, xét tuần này + tuần sau) → `_gtt_gay_tre_chay()` → `_gtt_de_xuat_tre(tuần)`.
  Thử 16/11 (rollback, hạ mốc kỳ đầu về tuần 16/11): 16 đề xuất H1 + 1 đề xuất H2 đúng người, chạy lần 2 = 0.
- Chưa có: nhắc ở Việc của tôi / huy hiệu trên đồ vật 📅 ngoài cảnh phòng (hiện chỉ thấy khi mở màn tuần).

### 3.9 Còn thiếu

- Lớp chưa có giáo trình ⇒ màn chỉ nhắc đi tạo, chưa tạo tại chỗ (16/11 mọi lớp đã có).
- Builder vẫn cho đổi tên giáo trình tự do (màn tạo đã khoá theo mẫu §2.8).

---

## 4. MỤC TIÊU TUẦN của học sinh (luật nghiệp vụ)

> Chi tiết kỹ thuật, quyết định build, nhật ký: `spec-muc-tieu-tuan.md` (§10–§14). Mockup đã duyệt: canvas "Mục tiêu tuần — mockup".
> Trạng thái: **đã build + chạy** (mig `202611131000`, ERP · app HS · app PH); 16/11 thêm khoá kế hoạch / nháp · công bố / dạng (mig `1713` · `1844`).

### 4.1 Đích & khái niệm
- Công khai mục tiêu ngầm của GV thành **neo chung** cho HS · PH · GV · TA · hệ: **con cần làm gì · con đã làm gì**. Màn = dashboard của học sinh (xoay dữ liệu từ trục hoạt động sang trục HS).
- **Tờ mục tiêu** = (HS × môn × tuần). **Đơn vị đánh giá = nhóm bài** (`mastery_luu_san.cap = 'nhom'`); **đơn vị dạy = dạng bài**; quy dạng → nhóm bằng đúng hàm đang chạy.
- **Phần 1 · Kiến thức mới** = nhóm có dạng dạy trong cửa sổ tuần · **Phần 2 · Ôn tập** = nhóm nợ do lượt chốt bổ trợ tuần đưa vào · **Việc của con** = hoạt động có thật (ET · BTVN · test sau giờ · ca bổ trợ).
- Ba người xem **cùng dữ liệu, một bộ hàm**: app HS · app PH · tab trung tâm (Dashboard học tập / Phòng trưởng khối; trưởng khối xem được đủ view của em).

### 4.2 Cửa sổ & mốc
- **Lùi một buổi** so với lịch dạy: lớp 2 buổi/tuần ⇒ mục tiêu tuần = buổi cuối tuần trước + buổi đầu tuần này (mọi nhóm đủ vòng ET + BTVN trước thứ Hai kế).
- **Lần đo thuộc tuần mà nó được CHẤM XONG** (không theo giờ nộp). "Đã nộp / đúng hạn" theo giờ nộp; "kết quả" theo giờ chấm; đã nộp chưa chấm = "chờ chấm" (việc tồn TA, không tính cho con).
- Hạn chấm BTVN = hạn đang chạy (lớp từ 18:00 ⇒ xong 2 tiếng trước buổi kế; lớp T7/CN ⇒ trước buổi kế một ngày). Buổi huỷ ⇒ hạn trôi.
- **00:00 thứ Hai máy chụp** (sổ tuần cũ bất biến · số đầu tuần · nợ). **Chiều thứ Hai người chốt** ở buổi họp sẵn có (bổ trợ) rồi **Công bố** theo lớp. **Không có màn chốt từng em.**
- Bản đã công bố **khoá** nhóm / mục tiêu / số lần đo (`mtt_ke_hoach`); thêm sau chốt hiện riêng (`them_sau_chot`). Bài chấm sau mốc vẫn tính mastery, hiện ở tuần sau.

### 4.3 Đo & đánh giá
- **% nhóm = mastery đang chạy** (Đ/C/S = 1 / 0,5 / 0, TB ≤ 5 lần gần nhất trong 30 ngày; Hình–Học 3 lần), đọc có BTVN. Nhóm chưa đo = "chưa đo", không gộp vào 0.
- **Mục tiêu tuần** = min(80 %, mastery của nhóm nếu mọi lần đo trong tuần đều Tốt), tính lúc chụp thứ Hai (biết trước số lần đo). Nhóm mới ⇒ 80 %. 80 % vẫn hiện là đích dài hạn.
- Tăng / giảm so với số chụp 00:00 thứ Hai (không ngưỡng). **Tiến độ tổng** = TB min(% / mục tiêu tuần, 1) trên nhóm đã đo và có mục tiêu tuần.
- **Xếp hạng tiến độ** toàn trung tâm, mỗi môn một bảng, chung mọi khối (đo thái độ); màn hiện hạng mình + lên/xuống, bấm ⇒ top 20. Chỉ lấy tờ đã công bố.
- **Không tăng** ⇒ soi theo thứ tự: trung tâm làm phần mình chưa (dạy đúng giáo trình đã chốt · giao BTVN · chấm kịp · xếp ca) → con làm phần con chưa → kết quả đo.

### 4.4 Việc của con
- Hệ **suy ra** từ lịch buổi + giáo trình + lượt chốt bổ trợ (không giao tay). Khối **Đã làm · Sắp tới** + ô "x/y việc đã xong"; tự luyện là dòng thống kê riêng, không tính x/y.
- Nhãn **Tốt ≥ 80 % · Tạm ổn 50–79 % · Chưa tốt < 50 %** cho mọi hoạt động; **chỉ BTVN xét thái độ** (khác "nghiêm túc" ⇒ hạ 1 mức + ghi chú). HS/PH không thấy chữ "thái độ".
- Em vắng ⇒ việc buổi vắng = chưa hoàn thành (đường đi là buổi bù — R-BU).

### 4.5 Vòng nợ
- Ở nhà ôn (không tính mastery) → **test sau giờ ở trung tâm** (lần đo chính thức). Nợ trên tờ và case bổ trợ là **một danh sách**; nợ chưa được chọn ⇒ "đang xếp hàng". Câu test khác câu đã ôn.
- **Phần 2 chỉ lấy lượt chốt bổ trợ duyệt TRONG tuần của tờ** (cùng luật sau giờ, mig `1614`): thứ Hai trước buổi chốt, Phần 2 rỗng — không kéo nợ tuần cũ.

### 4.6 Nháp · Công bố · học theo dạng (Thùy 16/11)
- **Thứ Hai hệ dựng NHÁP cho mọi lớp** (đọc Giáo trình tuần + bổ trợ, tự cập nhật khi sửa). Nháp chỉ nhân sự thấy, không xếp hạng, không vào sổ. **Trưởng khối trở lên xem theo từng lớp** (tên lớp ⇒ cả lớp ⇒ tờ từng em).
- **Công bố** (nút theo lớp) = khoá mục tiêu + đưa lên app HS / PH. Lớp còn đề xuất bổ trợ chưa duyệt ⇒ hệ hỏi lại trước khi công bố.
- **Mỗi nhóm kèm DẠNG của tuần** (cùng nguồn câu với nhóm: buổi kế hoạch / bản chép / ET · BTVN trên app / case bổ trợ yếu). App HS bấm nhóm ⇒ danh sách dạng ⇒ bấm dạng ⇒
  **màn dạng có sẵn của Học từ đầu** (Đọc lý thuyết · Luyện tập · Làm bài Test) — dẫn tới màn sẵn có, không dựng màn mới. App PH hiện tên dạng.
- **Dạng lớp CHƯA học tới thì chưa luyện được** (luật 14/10 `_dang_da_hoc_ok`, Thùy giữ 16/11: muốn luyện trước thì vào tính năng riêng); lý thuyết vẫn đọc được.

---

## 5. BÁO CÁO TUẦN — Trưởng khối → Trưởng bộ môn → CEO

> Thùy chốt qua Sparring 03/11/2026. **Đã build P1–P4** (mig `202611031346` · `1351` · `1407`; màn `BaoCaoTuanTK` · `BaoCaoTuanTBM` · `ChieuBaoCaoMon`).

### 5.0 Đích
**Báo cáo tuần trực tiếp cho CEO để nắm tình hình học tập đang diễn ra tại BK.** Mỗi chiều thứ 2, mỗi trưởng khối nộp báo cáo tuần trước (cá nhân + khối mình quản) →
trưởng bộ môn đọc, duyệt / trả lại → ghép **Báo cáo Chuyên môn tuần** của môn → **chiếu TV** báo cáo CEO.

### 5.1 Đã chốt (Thùy 03/11)

| # | Chốt |
|---|---|
| 1 | Kỳ báo cáo = **thứ 2 → hết Chủ nhật tuần trước** (giờ VN). Nộp **chiều thứ 2**. |
| 2 | **Báo cáo cứng**: bấm Nộp là **snap** toàn bộ phần số, **không bao giờ tính lại**. |
| 3 | Phần **cá nhân** = task phát triển của trưởng khối. Task **đã được người giao duyệt** ⇒ tự điền. Nhân sự chủ yếu điền task chưa xong. |
| 4 | Phần **quản lý** = hệ tự tổng hợp: ET · BTVN · dạng yếu · HS yếu · bổ trợ · trend 4 tuần — **toàn khối và từng lớp**. |
| 5 | **HS yếu = có ≥ 1 dạng yếu.** "Khó giảm cũng phải giảm", giữ định nghĩa. |
| 6 | **Dữ liệu có thời gian ⇒ suy ngược được mọi khung thời gian** (dạng yếu tại mốc bất kỳ = chỉ dùng các lần đo trước mốc). |
| 7 | Ảnh dạng yếu **đầu tuần chụp tự động**. |
| 8 | Bổ trợ tính **Bổ trợ Yếu + Bổ trợ Nhẹ (sau giờ)**. Bù · đuổi · ôn thi chưa đưa vào. |
| 9 | **Nộp trễ ⇒ gậy.** |
| 10 | Phần **trưởng khối tự viết** theo khung Plans · Progress · Problems. |
| 11 | **Độ phủ đo** + tách **Ra có bằng chứng / Rớt cửa sổ** cạnh "dạng yếu giảm" (chống Goodhart; `spec-truong-khoi` §4.2). |
| 12 | Điểm TB toàn khối = trung bình **trên lượt làm** (tránh nghịch lý Simpson). |
| 13 | Bổ trợ báo **cả kết quả**: độ phủ (HS yếu đã được bổ trợ / HS yếu) + số em hết yếu sau ca. |
| 14 | Vòng trạng thái: Nháp → Đã nộp (snap) → Trả lại → Đã nộp → Đã duyệt. Trả lại chỉ sửa **phần chữ**, số giữ bản snap. |
| 15 | **Ô chưa có trưởng khối** ⇒ **trưởng bộ môn** báo cáo thay. |
| 16 | **Báo cáo Chuyên môn tuần theo MÔN** (Trang = Toán, anh Ngọc = KHTN…); CEO xem gộp mọi môn. |
| 17 | Chiếu TV: khuôn trình chiếu Tổng kết tuần — mỗi khối một màn, màn đầu là tổng môn. |
| 18 | Task "đã duyệt ⇒ tự điền" theo **người giao duyệt** (không chỉ Thùy). |

### 5.2 Ai báo cáo cái gì
- Mỗi **trưởng khối** = **1 báo cáo / tuần**, gồm mọi ô (môn × khối) người đó là **trưởng** (`phan_cong_quan_ly_khoi`, vai `truong`). Phó khối không báo cáo.
- **Ô chưa có trưởng khối** ⇒ gộp vào báo cáo của **trưởng bộ môn** môn đó. "Từng lớp" = các lớp đang học của các ô đó.

### 5.3 Snap — "báo cáo cứng"
- Lúc **Nộp**: tính toàn bộ phần số **trong cùng transaction** với đổi trạng thái → ghi jsonb kèm **phiên bản công thức**; sau đó mọi màn đọc **bản đã ghi**.
- Nháp: số tính **trực tiếp** (cùng hàm), có thể nhích nếu dữ liệu tuần trước còn được sửa.
- **Trả lại** không mở lại phần số. Muốn số mới ⇒ trưởng bộ môn bấm **"Snap lại số"** có lý do (vết lịch sử). Mọi đổi trạng thái có trigger ghi lịch sử.

### 5.4 Phần CÁ NHÂN — task phát triển
- Task `task_phat_trien` người làm = trưởng khối còn sống trong tuần (đang làm / chờ duyệt / **đã duyệt trong tuần**; không lấy huỷ).
- **Đã duyệt** ⇒ tự điền + khoá ("Hoàn thành", % và nhận xét người giao). **Chưa xong** ⇒ trưởng khối điền trạng thái · mô tả · %. Hệ hiện hạn / gia hạn / trễ. Snap cùng lúc Nộp.

### 5.5 Phần QUẢN LÝ — hệ tự tổng hợp (toàn khối + từng lớp)

Mọi chỉ số tính ở **một hàm DB** theo `(ô, khoảng ngày)` — dùng cho báo cáo, trend, tổng môn. Không công thức thứ hai.

| # | Nhóm | Chỉ số | Định nghĩa |
|---|---|---|---|
| 1 | **ET** | Tỉ lệ chấm ET đúng hạn · Điểm ET TB | Việc chấm ET của buổi trong kỳ (trừ ET online); **đúng hạn = lần đóng đầu ≤ hạn**. Điểm TB trên lượt. |
| 2 | **BTVN** | Tỉ lệ nộp · Điểm BTVN TB | Trên kết quả BTVN của buổi trong kỳ, **không tính xin phép**; tách đúng hạn / muộn. |
| 3 | **Dạng yếu** | Đầu · Cuối · Đã giảm · Tỉ lệ giảm · **Vào · Ra có bằng chứng · Rớt cửa sổ · Độ phủ đo** | Đầu = tại **T2 00:00**; cuối = tại **CN 24:00**. Vào / Ra / Độ phủ theo `spec-truong-khoi` §4.2. |
| 4 | **HS yếu** | Đầu · Cuối · Đã giảm · Tỉ lệ · **Danh sách HS còn yếu** | Em · lớp · số dạng yếu · **trạng thái xử lý** (ca Nhẹ / đang bổ trợ Yếu / đã đề xuất / chưa xử lý — "chưa xử lý" lên đầu). |
| 5 | **Bổ trợ** | Số ca (Yếu · Nhẹ) · lượt HS · **Độ phủ** · **Hết yếu sau ca** | Ca không huỷ, ≥ 1 em có mặt. Độ phủ = HS yếu đầu tuần đã được ≥ 1 ca / HS yếu đầu tuần. |
| 6 | **Trend** | Mỗi chỉ số, theo khối, **4 tuần gần nhất** | Tuần đã nộp ⇒ số snap; chưa ⇒ tính ngược bằng chính hàm trên. Mũi tên so TB 3 tuần trước. |

### 5.6 Dạng yếu tại một mốc — nguồn DUY NHẤT
- **"Dạng yếu của HS × môn tại mốc D"** = đúng định nghĩa hiện hành nhưng **chỉ dùng lần đo ≤ D** (`_dang_yeu_tai_lo`; đối chiếu 03/11 khớp 100 % hàm đang chạy).
- **Chụp tự động T2 00:00** (`_dang_yeu_chup_tuan` → `dang_yeu_dau_tuan`) — ảnh là bộ đệm, lệch thì tính lại từ hàm. **Không** chụp từ `dang_yeu_hien_tai` (làm mới lười).
- Sửa điểm cũ ⇒ số tính ngược quá khứ đổi theo ⇒ vì vậy báo cáo **snap lúc nộp**.

### 5.7 Phần TỰ VIẾT — Plans · Progress · Problems
Nhận định tình hình khối · 3 việc ưu tiên tuần tới · cần hỗ trợ gì. Bắt buộc trước khi Nộp (nút chỉ disable khi **thiếu data**).

### 5.8 Trưởng bộ môn: duyệt · trả lại · ghép
- Hàng báo cáo các khối (chưa nộp / đã nộp / trễ / trả lại / đã duyệt) · **Duyệt** / **Trả lại** (bắt buộc lý do); không tự duyệt mình.
- **Báo cáo Chuyên môn tuần** (1 / môn / tuần) = **tổng môn** (cùng hàm, gộp mọi ô) + báo cáo khối **đã duyệt** + **nhận xét trưởng bộ môn**. Chốt ⇒ snap tổng môn; khối thiếu ghi rõ.

### 5.9 Chiếu TV
**Tổng môn** → **Từng lớp** → **mỗi khối** (số + tự viết) → **HS yếu chưa xử lý** → **nhận xét trưởng bộ môn**. ← → / bút trình chiếu · Home/End · Esc · mục lục; mỗi trang vừa khít màn (`VuaMan`). Kiểm 1920×1080.

### 5.10 Nộp trễ ⇒ gậy
Quá hạn chưa nộp ⇒ **đề xuất gậy** "Nộp báo cáo tuần trễ" (`_bctk_de_xuat_tre` → `gay_de_xuat`, ref `bctk:<tuần>|<người>`, từ kỳ 02/11–08/11). Trang quyết; ô do trưởng bộ môn báo thay ⇒ CEO.

### 5.11 Bảng & hàm (đã build)
- `bao_cao_tuan_khoi` (1 dòng / người × tuần, chỉ ra đời khi có thật: trạng thái · `so` snap · `ca_nhan` · `tu_viet` · phiên bản công thức) + log ·
  `bao_cao_chuyen_mon_tuan` (1 / môn × tuần) + log.
- `_dang_yeu_tai_lo` · `_dang_yeu_chup_tuan` · `_tu_dong_sang_t2` (chụp + cập nhật Tổng kết tuần) · `fn_bctk_so` · `fn_bctk_trend` · `fn_bctk_lay / _luu_nhap / _nop` ·
  `fn_bctk_hang` · `fn_bctk_xem` · `fn_bctk_xu_ly` · `fn_bcmt_lay / _luu / _chot` · `_bctk_de_xuat_tre`.
- Đo 03/11: báo cáo khối 0,48–0,8 s · hàng trưởng bộ môn 0,1 s · báo cáo môn Toán 41 lớp 1,1 s.

---

## 6. Việc theo tuần khác (không gộp — chỉ ghi nhịp)

| Việc | Lúc | Nguồn |
|---|---|---|
| **Chốt tuần bổ trợ + KPI dạng yếu** (đóng băng `chat_luong_tuan_hs`: HS có dạng yếu · Vào · Ra có bằng chứng · Rớt cửa sổ · Độ phủ đo) | Trang bấm, thứ Hai | `spec-truong-khoi` §4 |
| **Tổng kết tuần** (dashboard theo bảng, ngưỡng "thường đạt" 8 tuần; trình chiếu) | Cập nhật bởi `_tu_dong_sang_t2` sáng T2 | `SPEC-troly-nhansu` §6–§7 |
| **BTVN xếp chồng 3 buổi** (5 · 3 · 2: buổi này · buổi trước · buổi trước nữa — soạn trong builder chế độ BTVN) | Mỗi buổi | `spec-muc-tieu-tuan` §8.1 |
| **Lịch trực bổ trợ khối + bậc** (ca ≤ 3 em, Lộc xếp) | Hằng tuần | `spec-bo-tro` |
| **Bản tin TA 08:00 · tổng kết 24:00** | Hằng ngày | `spec-bot-telegram-ta` |

## 7. Bản đồ code

| Phần | DB | Màn |
|---|---|---|
| Giáo trình tuần | `gtt_*` · `fn_gtt_*` · trigger trên `tai_lieu` | `phongtk/GiaoTrinhTuan.tsx` · `lib/giaoTrinhTuan.ts` · builder (nhãn ngày) · `GanLopBdm` |
| Mục tiêu tuần | `mtt_*` · `_mtt_*` · `fn_mtt_*` | `danhgia/MucTieuTuanTab.tsx` · `hocsinh/MucTieuTuanHS.tsx` · repo `bkdemy-ph-app` |
| Báo cáo tuần | `bao_cao_*` · `fn_bctk_*` · `fn_bcmt_*` | `phongtk/BaoCaoTuanTK.tsx` · `BaoCaoTuanTBM.tsx` · `ChieuBaoCaoMon.tsx` |
| Chụp đầu tuần | `_tu_dong_sang_t2` · `_dang_yeu_chup_tuan` · sổ `mtt_chot` / `mtt_dau` | — (bộ điều phối) |

## 8. Chờ Thùy quyết

1. ~~Giáo trình tuần — hạn H1 / H2, có gậy không~~ — ✅ Thùy chốt 16/11: H1 = 23:59 T6 · H2 = 12:00 T7 · trễ ⇒ đề xuất gậy (§3.8, đã build).
2. **Báo cáo tuần** (bàn sau 03/11): giờ hạn nộp (đề xuất 17:00 T2) · mức gậy trễ · BTVN "nộp" tính cả muộn hay chỉ đúng hạn · ngưỡng màu chỉ số · % trưởng khối điền có ghi ngược vào `task_phat_trien` không.
   `gay_de_xuat.nguon` CHECK chỉ có `vanhanh · giaoviec` ⇒ đề xuất báo cáo trễ tạm dùng `vanhanh` (muốn `bao_cao` riêng phải alter — Luật xoá).
3. **Mục tiêu tuần**: sổ kết quả tuần 09–15/11 (`mtt_chot`) mang lỗi quy câu → nhóm, bất biến — muốn chụp lại phải xoá dòng sổ tuần đó (Luật xoá). Mig `1713` + `1844` Thùy áp qua SQL Editor 16/11 tối (Claude chưa tự kiểm được — đối chiếu `schema.md` sau `npm run schema`).
