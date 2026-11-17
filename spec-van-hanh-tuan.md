# VẬN HÀNH HÀNG TUẦN — spec

> **Đọc file này TRƯỚC khi build/sửa bất kỳ việc nào chạy theo nhịp TUẦN**: Giáo trình tuần · Mục tiêu tuần · Báo cáo tuần ·
> chụp số đầu tuần · chốt tuần bổ trợ / KPI dạng yếu · Tổng kết tuần.
> **Thùy chốt 16/11/2026: "ghi chung vào 1 spec — Vận hành hàng tuần".** Luật vận hành tuần MỚI chỉ ghi vào file này.
> Gộp từ: `spec-giao-trinh-tuan.md` (chuyển trọn — §3) · `spec-bao-cao-tuan.md` (chuyển trọn — §5) · `spec-muc-tieu-tuan.md` (luật nghiệp vụ — §4;
> chi tiết kỹ thuật + nhật ký build Mục tiêu tuần ĐÃ GỘP HẲN 17/11 vào §4.7; file cũ ở `_luu-tru/`).
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
| **Chiều T2** | Trưởng khối | (1) Soi Dashboard học tập, **chốt bổ trợ** tuần (Phần 2 Mục tiêu tuần + ca test sau giờ) · (2) bấm **Công bố mục tiêu tuần** theo lớp · (3) **Nộp Báo cáo tuần** tuần trước (snap) | Phòng trưởng khối › Chất lượng (bổ trợ) · **🎯 Mục tiêu tuần** (lịch thứ 2 cột trái phòng) · 📝 Báo cáo tuần | `mtt_lop_chot` · `bao_cao_tuan_khoi` |
| **T2** | Trang | **Chốt tuần** bổ trợ (đóng băng KPI dạng yếu — `spec-truong-khoi` §4.1) | Như cũ | `chat_luong_tuan_hs` |
| **T2 – T3** | Trưởng bộ môn | Duyệt / trả lại báo cáo từng khối → **chốt Báo cáo Chuyên môn tuần** → **chiếu TV** cho CEO | Phòng trưởng bộ môn › 📝 | `bao_cao_chuyen_mon_tuan` |
| **Trong tuần** | GV / TA | Gán buổi ngày dạy (hệ chọn sẵn buổi kế hoạch — §3.4) · ET · BTVN · chấm · bổ trợ | Builder › Gán lớp · màn buổi | Lần đo ⇒ mastery ⇒ tờ tuần cập nhật |
| **Liên tục** | HS · PH | Xem tờ tuần (Phần 1 kiến thức mới · Phần 2 ôn tập · Việc của con · hạng) | App HS · app PH | — |

**Hai chu kỳ lệch nhau một buổi** (Thùy chốt lại tối 17/11, thay luật sáng 17/11): lịch dạy (Giáo trình tuần) = các buổi diễn ra trong tuần; mục tiêu học sinh = các buổi có **buổi kế** rơi vào tuần (BTVN chấm xong trong tuần) — ET và BTVN của buổi đi cùng buổi (§4.2).

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

- `_mtt_tinh` thấy **ca chiếu từ TKB** (`_gtt_ca`, từ hôm nay — buổi tương lai chưa có dòng `buoi_hoc`) ⇒ thấy đủ buổi của tuần ngay thứ Hai (mig `1754`). Buổi thuộc tuần theo luật §4.2 (buổi kế rơi vào tuần — mig `1800`, tối 17/11); ca chiếu thuộc tuần cũng thành việc "sắp tới".
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

> Chi tiết kỹ thuật, quyết định build, nhật ký: **§4.7 bên dưới** (gộp từ `spec-muc-tieu-tuan.md` 17/11). Mockup đã duyệt: canvas "Mục tiêu tuần — mockup".
> Trạng thái: **đã build + chạy** (mig `202611131000`, ERP · app HS · app PH); 16/11 thêm khoá kế hoạch / nháp · công bố / dạng (mig `1713` · `1844`).

### 4.1 Đích & khái niệm
- Công khai mục tiêu ngầm của GV thành **neo chung** cho HS · PH · GV · TA · hệ: **con cần làm gì · con đã làm gì**. Màn = dashboard của học sinh (xoay dữ liệu từ trục hoạt động sang trục HS).
- **Tờ mục tiêu** = (HS × môn × tuần). **Đơn vị đánh giá = nhóm bài** (`mastery_luu_san.cap = 'nhom'`); **đơn vị dạy = dạng bài**; quy dạng → nhóm bằng đúng hàm đang chạy.
- **Phần 1 · Kiến thức mới** = nhóm của bài học DIỄN RA TRONG TUẦN (bài CHƯA học; Thùy 17/11) · **Phần 2 · Ôn tập** = nhóm nợ do lượt chốt bổ trợ tuần đưa vào · **Việc của con** = hoạt động có thật (ET · BTVN · test sau giờ · ca bổ trợ).
- Ba người xem **cùng dữ liệu, một bộ hàm**: app HS · app PH · **Phòng làm việc › 🎯 Mục tiêu tuần** (Thùy 17/11 tối: đồ vật riêng, KHÔNG còn là tab trong Dashboard học tập; trưởng khối · trưởng bộ môn · giám đốc xem được đủ view của em). Cột trái phòng = 3 tấm lịch theo nhịp tuần: 📅 Giáo trình tuần → 🎯 Mục tiêu tuần → 📝 Báo cáo tuần (bỏ cửa sổ trái).

### 4.2 Cửa sổ & mốc
- **⭐⭐ LUẬT CỬA SỔ (Thùy chốt tối 17/11, mig `202611171800` — thay luật sáng 17/11):** đơn vị Phần 1 là **BUỔI HỌC**. Buổi thuộc tuần chứa **buổi kế** của lớp
  (BTVN được chấm xong trước buổi kế — "lùi một buổi"). **ET và BTVN của buổi đi CÙNG buổi** vào tuần đó: Phần 1 = nhóm của các buổi đó, mỗi buổi 2 lần đo dự kiến;
  Việc của con = ET + BTVN của các buổi đó. **Chỉ bổ trợ (ôn kiến thức đã học — Phần 2) đi theo ngày diễn ra ca.** Lớp 2 buổi/tuần ⇒ mỗi tuần 2 buổi.
  Vd 6S1 (T3 · T6): tuần 16–22/11 = buổi T6 13/11 + T3 17/11 (ET + BTVN của 2 buổi này); buổi T6 20/11 (ET + BTVN) thuộc tuần 23–29/11.
  Màn: tên **"Phần 1 · Bài trên lớp"**, mỗi nhóm ghi "học T6 13/11"; buổi trong tuần mà buổi kế sang tuần sau ⇒ dòng "Bài T6 20/11: tính vào tuần sau".
  **Khởi điểm** của nhóm = mastery TRƯỚC buổi sớm nhất của nhóm trong tuần (ET đã làm trước thứ Hai vẫn là phần tăng của tuần); **mục tiêu** = mastery nếu các lần đo của tuần đều Tốt.
- ~~SỬA 17/11 sáng: "Kiến thức mới = bài chưa học, Phần 1 = buổi diễn ra trong tuần" (mig 1216 · 1222)~~ — **BỎ tối 17/11**: trộn 2 đồng hồ (bài theo ngày dạy, lần đo theo ngày chấm) ⇒ BTVN buổi cuối tuần rơi vào khe, không thuộc tuần nào.
- **Lần đo thuộc tuần mà nó được CHẤM XONG** (không theo giờ nộp). "Đã nộp / đúng hạn" theo giờ nộp; "kết quả" theo giờ chấm; đã nộp chưa chấm = "chờ chấm" (việc tồn TA, không tính cho con).
- Hạn chấm BTVN = hạn đang chạy (lớp từ 18:00 ⇒ xong 2 tiếng trước buổi kế; lớp T7/CN ⇒ trước buổi kế một ngày). Buổi huỷ ⇒ hạn trôi.
- **00:00 thứ Hai máy chụp** (sổ tuần cũ bất biến · số đầu tuần · nợ). **Chiều thứ Hai người chốt** ở buổi họp sẵn có (bổ trợ) rồi **Công bố** theo lớp. **Không có màn chốt từng em.**
- Bản đã công bố **khoá** nhóm / mục tiêu / số lần đo (`mtt_ke_hoach`); thêm sau chốt hiện riêng (`them_sau_chot`). Bài chấm sau mốc vẫn tính mastery, hiện ở tuần sau.

### 4.3 Đo & đánh giá
- **% nhóm = mastery đang chạy** (Đ/C/S = 1 / 0,5 / 0, TB ≤ 5 lần gần nhất trong 30 ngày; Hình–Học 3 lần), đọc có BTVN. Nhóm chưa đo = "chưa đo", không gộp vào 0.
- **Mục tiêu tuần** = min(80 %, mastery của nhóm nếu mọi lần đo trong tuần đều Tốt), tính lúc chụp thứ Hai (biết trước số lần đo). Nhóm mới ⇒ 80 %. 80 % vẫn hiện là đích dài hạn.
- Tăng / giảm so với số chụp 00:00 thứ Hai (không ngưỡng). ~~**Tiến độ tổng** = TB min(% / mục tiêu tuần, 1) trên nhóm đã đo và có mục tiêu tuần.~~ **Tiến độ (Thùy 17/11 khuya, mig `202611172340`) = số nhóm ĐẠT ÷ MỌI nhóm trên tờ** (Bài trên lớp + Ôn tập kiến thức, kể cả chưa đo). Đạt = % hiện tại ≥ mục tiêu tuần; nhóm không có mục tiêu tuần ⇒ so với đích 80; chưa đo = chưa đạt. Đầu tuần đếm trên % lúc 00:00 thứ Hai. Lý do bỏ công thức cũ: nó đo mức hiện tại (em khá nào cũng 92–99% dù chưa làm việc nào). **Tính sẵn** ở bộ điều phối, màn chỉ đọc; sổ tuần đã chốt giữ số cũ. **Nhãn trên thẻ nhóm = Đạt / Chưa đạt THEO MỤC TIÊU TUẦN** (Thùy 17/11 khuya: "đạt – chưa đạt là theo mục tiêu tuần chứ không phải 80%"; thay nhãn Đạt/Chưa đạt/Yếu theo mức 80/50 của 17/11 tối) — cờ `dat_mt` tính sẵn cùng điều kiện với tiến độ (mig `202611180010`) ⇒ đếm nhãn Đạt ÷ số thẻ = % tiến độ, ở cả ERP · app HS · app PH.
- **Xếp hạng tiến độ** toàn trung tâm, mỗi môn một bảng, chung mọi khối (đo thái độ); màn hiện hạng mình + lên/xuống, bấm ⇒ top 20. Chỉ lấy tờ đã công bố. **Bằng % thì xét (Thùy 17/11 khuya, mig `202611180040`):** số việc đã làm ↓ → tổng điểm tăng của các nhóm trong tuần ↓ → vẫn bằng ⇒ cùng hạng. **Tính mỗi ngày một lần** (lượt điều phối đầu tiên từ 05:00), không realtime; lớp công bố trong ngày có hạng từ sáng hôm sau.
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
- **Công bố** (nút theo lớp) = khoá **Phần 1 (bài trên lớp)** + đưa lên app HS / PH. Lớp còn đề xuất bổ trợ chưa duyệt ⇒ hệ hỏi lại trước khi công bố.
- **Phần 2 + ca bổ trợ LUÔN đồng bộ tự động** (Thùy 17/11 tối "cần đồng bộ khi chốt bổ trợ thay đổi — tự động hoặc manual đều được"; mig `202611171937`): không khoá, luôn theo lượt chốt bổ trợ mới nhất của tuần; em có đề xuất bổ trợ vừa duyệt ⇒ tờ tính lại ở lượt điều phối kế (≤ 5 phút). Không có nút — không cần mở khoá hay xoá bản khoá.
- **Mỗi nhóm kèm DẠNG của tuần** (cùng nguồn câu với nhóm: buổi kế hoạch / bản chép / ET · BTVN trên app / case bổ trợ yếu). App HS bấm nhóm ⇒ danh sách dạng ⇒ bấm dạng ⇒
  **màn dạng có sẵn của Học từ đầu** (Đọc lý thuyết · Luyện tập · Làm bài Test) — dẫn tới màn sẵn có, không dựng màn mới. App PH hiện tên dạng.
- **Dạng lớp CHƯA học tới thì chưa luyện được** (luật 14/10 `_dang_da_hoc_ok`, Thùy giữ 16/11: muốn luyện trước thì vào tính năng riêng); lý thuyết vẫn đọc được.

---

### 4.7 Phụ lục kỹ thuật Mục tiêu tuần (gộp từ `spec-muc-tieu-tuan.md` 17/11 — Thùy "Làm đi")

> Chép NGUYÊN VĂN các mục kỹ thuật của file cũ (file cũ đã chuyển `_luu-tru/spec-muc-tieu-tuan.md`, lịch sử git giữ qua `git mv`).
> Nhãn "(cũ §x)" = số mục trong file cũ — code / DEVLOG trỏ "spec-muc-tieu-tuan §x" thì tìm nhãn đó ở đây.
> Mục KHÔNG chép (đã có ở §4.1–§4.6 hoặc §1): mục đích · khái niệm · hai chu kỳ / mốc thứ Hai · nguồn của tờ · mức thành thạo · vòng nợ · thứ tự build.
> **Khi luật ở §4.1–§4.6 khác chữ trong phụ lục này ⇒ §4.1–§4.6 đúng** (phụ lục là bản ghi kỹ thuật, có đoạn đã cũ — vd đoạn "SỬA 17/11 sáng: Phần 1 = bài học trong tuần" ĐÃ BỎ tối 17/11, luật hiện hành là §4.2).

#### (cũ §0) Phiếu 10 câu (spec-kien-truc.md §9 — soát 16/11 sau khi Thùy sửa kiến trúc 13–15/11)

| # | Câu | Trả lời | Nợ còn lại |
|---|---|---|---|
| 1 | Miền, bảng | Miền **Đo / Mô hình đọc**. Sổ gốc bất biến: `mtt_lop_chot` (lớp chốt) · `mtt_dau` (số đầu tuần) · `mtt_ke_hoach` (mục tiêu đã khoá) · `mtt_chot` (sổ kết quả tuần). Bảng tính sẵn (bản chiếu, xoá đi dựng lại được): `mtt_luu` · `mtt_top`. Chỉ hàm `_mtt_*` ghi | tiền tố `mtt_` chưa theo tên miền (§2) |
| 2 | Mã gốc | khoá tự nhiên (tuần, môn, HS); nhóm theo **mã nhóm**, việc theo **`buoi_id`** — không theo số thứ tự hiển thị | — |
| 3 | Nhãn `mon` | có ở `mtt_luu` · `mtt_chot` · `mtt_top` · `mtt_ke_hoach`; `mtt_lop_chot` qua `lop.mon` | **`mtt_dau` thiếu cột `mon`** (một dòng / HS / tuần, jsonb theo mã nhóm của mọi môn — chạy đúng vì mã nhóm không trùng giữa môn, nhưng sai §1.6). Sửa = đổi khoá chính bảng đã có dữ liệu ⇒ chờ Thùy gật |
| 4 | Quyền | RLS bật mọi bảng, không policy cho `authenticated` ⇒ chỉ đọc qua hàm security definer có cổng (`my_hoc_sinh_id` · `la_thanh_vien` · `fn_pham_vi_cua_toi` cho nút chốt). App PH: role `fdw_bkdemy_web` + policy theo cột (không gọi hàm — K27). `anon` không gọi được hàm nào | — |
| 5 | RPC lúc mở | ERP tab: `fn_mtt_trung_tam` (1). App HS: `fn_mtt_cua_toi` (1). Bấm mới gọi: `fn_mtt_ds_lop` (lớp) · `fn_mtt_hs` (em) · `fn_mtt_cac_tuan` · `fn_mtt_top` | — |
| 6 | Lớp chi phí | `fn_mtt_cua_toi` / `fn_mtt_hs` C2 (đọc 1 dòng đệm; thiếu ⇒ tính 1 em) · `fn_mtt_ds_lop` C2 · `fn_mtt_cac_tuan` C2 · `fn_mtt_top` C1 · `fn_mtt_chot_lop` C1 (chỉ ghi dòng chốt, từ 16/11) · `fn_mtt_trung_tam` gom dòng đệm của 1 khối (không tính lại từ lịch sử đo) | **CHƯA ĐO ms trên DB thật** (K10) — phiên cloud không có kết nối DB |
| 7 | Tính sẵn | `mtt_luu` đơn vị = (HS × môn × tuần), làm mới bởi bộ điều phối `_tinh_san_chay` → sổ `muc_tieu_tuan` (`_mtt_lam_moi(40)`, 5 phút — đợt 3 đã chuyển, không còn cron riêng). Em thiếu tờ trước, rồi em có cache mastery mới hơn tờ | còn mốc 20 phút làm lưới an toàn (bắt việc đổi mà mastery không đổi) — chưa dùng `tinh_san_ban` |
| 8 | Index | khoá chính theo (tuần, môn, HS) · `mtt_luu_xep_idx` (xếp hạng) · `mtt_ke_hoach_hs_idx` | khoá ngoại `hoc_sinh_id` của `mtt_dau` / `mtt_luu` / `mtt_chot`, `lop_id` / `chot_boi` của `mtt_lop_chot` chưa có index riêng (chỉ dùng khi xoá HS/lớp) |
| 9 | Polling | không — chỉ tải khi mở, nút ↻ ép đọc lại | — |
| 10 | Dữ liệu lớn theo | HS × môn × tuần (10.000 HS ⇒ ~2 triệu dòng / năm, payload vài KB) | **chưa khai hạn giữ (K17)**: `mtt_luu` chỉ cần tuần đang chạy + tuần trước (tuần cũ đã có `mtt_chot`) — đề xuất dọn dòng đệm > 2 tuần, cần Thùy gật (Luật xoá) |

#### (cũ §3.2) Luật cắt cửa sổ

> ⛔ **ĐOẠN DƯỚI ĐÃ BỎ tối 17/11** (Thùy chốt lại "lùi một buổi", ET + BTVN đi cùng buổi — mig `202611171800`, luật ở §4.2). Giữ để truy lịch sử.
> ~~⭐ **SỬA 17/11 (Thùy chốt, mig 202611171216) — PHẦN 1 = BÀI HỌC TRONG TUẦN.**~~ "Kiến thức mới phải là bài CHƯA học, và tuần tới là tuần học." Phần 1 chỉ gồm nhóm của các buổi diễn ra
> trong tuần (thứ Hai–CN). Bài của buổi cuối tuần trước đã học xong ⇒ KHÔNG vào Phần 1 (BTVN của buổi đó vẫn là việc của con nếu hạn nộp rơi trong tuần). Dòng "sẽ học thêm (tính vào tuần sau)" bỏ.
> Số lần đo k giữ công thức (ET buổi trong tuần + BTVN của buổi mà buổi kế còn trong tuần). Bảng "cửa sổ" bên dưới là luật CŨ 13/11 — chỉ còn đúng cho phần **chấm BTVN**, không còn quyết định nhóm Phần 1.
> Lớp đã Công bố giữ bản khoá cũ (mtt_ke_hoach) — đổi phải mở khoá.

**Một lần đo thuộc tuần mà nó ĐƯỢC CHẤM XONG**, không theo lúc HS nộp (lần đo chỉ tồn tại khi có kết quả chấm — CLAUDE §1.5).
BTVN buổi N nộp trước buổi N+1 ⇒ với lớp 2 buổi/tuần, mục tiêu tuần = **buổi cuối tuần trước + buổi đầu tuần này**:

| Lớp | Buổi thuộc mục tiêu tuần này | BTVN chấm xong |
|---|---|---|
| Thứ Năm – Chủ nhật | Chủ nhật trước · thứ Năm này | trước thứ Năm · trước Chủ nhật |
| Thứ Ba – thứ Sáu | thứ Sáu trước · thứ Ba này | trước thứ Ba · trước thứ Sáu |
| Thứ Hai – thứ Sáu | thứ Sáu trước · thứ Hai này | thứ Hai (bài nộp tối CN) · trước thứ Sáu |

Hệ quả: mọi nhóm của tuần đều đủ vòng đo (ET + BTVN) trước thứ Hai kế tiếp. Lớp 1 hay 3 buổi/tuần chạy cùng luật.

- **Tách hai thứ:** "đã nộp / đúng hạn chưa" theo GIỜ NỘP (biết ngay) · "kết quả" theo GIỜ CHẤM.
- Bài đã nộp mà chưa chấm = **"chờ chấm"** — việc tồn của trung tâm (TA), không tính cho con.
- **Hạn chấm BTVN = hạn đang chạy thực tế** (không đặt hạn mới): lớp học từ 18:00 ⇒ chấm xong **2 tiếng trước buổi học kế**;
  lớp học thứ Bảy / Chủ nhật (cả ngày) ⇒ chấm xong **trước buổi kế một ngày**.
- Buổi huỷ / tuần nghỉ ⇒ hạn trôi, lần đo đi theo hạn.
- Buổi trong tuần mà buổi kế sang tuần sau ⇒ dòng "Bài T6 20/11: tính vào tuần sau" (bỏ sáng 17/11, **khôi phục tối 17/11** cùng luật §4.2; app HS · PH · ERP).

#### (cũ §5.2b) Mục tiêu tuần tính được (Thùy CHỐT 13/11)
- Mastery đo **theo lần** (mỗi lần = TB câu của lần đó, mastery = TB ≤ 5 lần gần nhất trong 30 ngày; Hình–Học 3 lần) ⇒ thứ Hai hệ biết
  trước **tuần này nhóm đó có bao nhiêu lần đo** (ET + các lần BTVN có nhóm + test sau giờ đã chốt) ⇒ tính được mục tiêu tuần:
  **mục tiêu tuần = min(80%, mastery của nhóm nếu mọi lần đo trong tuần đều Tốt (80%))**, có tính cả lần cũ sẽ rơi khỏi cửa sổ 5 lần / 30 ngày.
  Ví dụ: 4 lần cũ 0 · 50 · 0 · 50, tuần này 2 lần ⇒ cửa sổ còn 50 · 0 · 50 · 80 · 80 ⇒ mục tiêu tuần **52%** (đích dài hạn vẫn 80%).
- Chụp cùng sổ chốt thứ Hai, không đổi trong tuần. Nhóm tuần này không có lần đo nào ⇒ không có mục tiêu tuần, không tính vào tiến độ.
- Nhóm mới (chưa có lần cũ) ⇒ mục tiêu tuần = 80%. Thực tế Phần 1 hầu hết là 80%, Phần 2 thấp hơn.
- **Chốt:** cờ trên thanh = **mục tiêu tuần** (số ghi dưới cờ; tiến độ tổng + xếp hạng tính theo nó); **80% vẫn hiện là đích dài hạn**
  (vạch mờ "đích 80%", ẩn khi mục tiêu tuần đã là 80%). Mở dòng nhóm ghi rõ "tuần này có N lần đo, làm Tốt cả N lần thì nhóm lên X%".
  Lý do: xếp hạng đo thái độ nên mục tiêu phải với tới được trong tuần; để 80% thì em yếu làm tốt hết vẫn không bao giờ đầy thanh.

#### (cũ §6) Việc của con tuần này

Khu vực **riêng**, liệt kê theo **HOẠT ĐỘNG** (không gắn vào từng nhóm bài):

```
ĐÃ LÀM
  Bài trên lớp (ET) · CN 15/11          75%   Tạm ổn
  Bài về nhà · buổi 15/11               90%   Tạm ổn
      Ghi chú: thiếu nghiêm túc (hạ 1 mức)
  Test sau giờ · T5 12/11              100%   Tốt
SẮP TỚI
  Bài trên lớp (ET) · T5 19/11
  Test sau giờ · T5 19/11 · Rút gọn căn, Căn bậc ba
  Bổ trợ yếu · T7 21/11 · ca 9:00, phòng 204
  Bài về nhà · buổi 19/11 · hạn tối CN 22/11
TỰ LUYỆN TRÊN APP · KHÔNG BẮT BUỘC
  14 câu · 3 lượt · đúng 71% · Rút gọn căn, Căn bậc ba
```

- **Danh sách do HỆ suy ra** từ lịch buổi + giáo trình + lượt chốt bổ trợ (pure-derive, CLAUDE §4). Không ai giao tay, không nút tự đánh dấu.
- Hai khối **Đã làm · Sắp tới** (có ngày, hạn; quá hạn mà chưa nộp ghi rõ "chưa nộp"). Đầu màn có ô tổng **"x/y việc đã xong"**.
- **Nhãn đánh giá 3 mức — Tốt · Tạm ổn · Chưa tốt**, cùng ngưỡng cho mọi hoạt động (trùng ngưỡng mastery):
  **≥ 80% Tốt · 50–79% Tạm ổn · < 50% Chưa tốt**, % tính như Đ/C/S.
  - **ET, test sau giờ:** chỉ theo %.
  - **CHỈ BTVN xét thái độ** (Thùy: "ở trung tâm thì ai cũng ngoan cả"): ô `btvn_ket_qua.thai_do` khác "nghiêm túc" ⇒ **hạ 1 mức**
    (Tốt → Tạm ổn, Tạm ổn → Chưa tốt; Chưa tốt giữ nguyên) + **ghi chú ngay dưới dòng**. Không thêm ô thái độ cho hoạt động nào khác.
  - HS + phụ huynh **không thấy chữ "thái độ"** và không có "thái độ tuần". Màn trung tâm thấy đủ 4 mức thái độ gốc.
  - Nhãn tính ở DB (một hàm `fn_*`), không tính ở app (CLAUDE §2.0).
- **Tự luyện trên app:** không bắt buộc, **luôn có dòng thống kê** kể cả tuần không luyện ("chưa luyện câu nào"): số câu · số lượt · % đúng ·
  nhóm đã luyện. **Không tính vào x/y việc.** Nguồn `tu_luyen_*`.

#### (cũ §8) Thay đổi đi kèm ở hệ thống đang chạy

##### 8.1 BTVN xếp chồng 3 buổi (Thùy 12/11 · chốt lại cách làm 13/11 chiều — ĐÃ BUILD; mig `202611131635` + `202611131755` + `202611131807` ĐÃ ÁP 13/11)
- **Trước:** BTVN buổi N = toàn bộ câu BTVN của buổi N ⇒ mỗi nhóm đo ở nhà MỘT lần, làm rất nhiều câu một lúc.
  **Sau:** phiếu BTVN buổi N có **3 phần — ① bài của buổi này · ② luyện lại buổi trước · ③ luyện lại buổi trước nữa.**
- **Soạn NGAY TRONG BUILDER giáo trình** (Thùy 13/11: "đây là phải gán mới thấy à … builder BTVN phải có 3 phần, mỗi buổi có sẵn dạng luôn để giáo viên chọn").
  Builder có công tắc **📘 Trên lớp / 📝 BTVN**; ở chế độ BTVN mỗi buổi hiện đủ 3 phần. Phần ② ③ **bày sẵn nhóm + dạng bài** của buổi đó,
  GV bấm ↻ Gợi ý / ✎ Chọn câu / ✕ như mọi khối câu khác. Nút "⚡ Gợi ý cả phần luyện lại" điền một lượt mọi ô còn trống.
- **5–3–2 là TƯƠNG ĐỐI, không tuyệt đối:** chỉ là số câu mặc định của nút Gợi ý cho mỗi nhóm — buổi này 5 · buổi trước 3 · buổi trước nữa 2.
  GV đổi số từng loại câu rồi Gợi ý lại, hoặc chọn tay; hệ không ép tỉ lệ.
- **"Buổi trước"** = 2 buổi CÓ NHÓM đứng ngay trước trong chính giáo trình đó (buổi không có nhóm thì bỏ qua).
  **Thiếu thì lấy tiếp các buổi LỚP của giáo trình đã được gán gần nhất từ giáo trình KHÁC** (mig `…1807`) — đo 13/11: giáo trình làm theo lớp,
  trung vị 2 buổi, nhiều cái 1 buổi, 11/39 lớp dùng ≥ 2 giáo trình trong 3 tuần ⇒ không có luật này thì buổi 1 của giáo trình mới không có gì để luyện lại.
- **Câu luyện lại là câu MỚI từ kho** theo dạng bài của buổi đó, và **không được có ở bất cứ chỗ nào khác trong giáo trình** ⇒ HS không gặp một câu 2 lần.
- **Gán lớp chỉ CHÉP** đúng 3 phần đã soạn (màn BTVN + Ôn tập: GV soát, ✕ bỏ câu nếu cần, có thể tick thêm ôn tập nhóm cũ hơn như trước). Không tự chia.
  Giáo trình chưa soạn phần luyện lại ⇒ phiếu như cũ (chỉ bài của buổi).
- Đổi thứ tự / xoá buổi / bỏ nhóm làm phần luyện lại không còn khớp ⇒ **không tự xoá**; builder nêu khối đỏ "không còn khớp buổi trước", GV bấm bỏ.
  Copy buổi sang giáo trình khác không chép phần luyện lại.
- Được: mỗi nhóm ET + 3 lần BTVN = 4 lần đo trong ~1,5 tuần · luyện giãn cách · em vắng buổi 9 vẫn gặp bài buổi 9.
- Chấm · nộp · thái độ · dòng "Bài về nhà" ở Việc của con: không đổi (vẫn một phiếu mỗi buổi, % tính trên cả phiếu). Mastery theo lần không đổi công thức.
- **Mục tiêu tuần:** "nhóm của buổi" = kiến thức DẠY buổi đó (bỏ phần ôn / luyện lại trong phiếu); nhóm luyện lại trong phiếu của buổi thuộc cửa sổ
  được **+1 lần đo dự kiến** và **ở lại Phần 1** tuần đó. Phiếu chưa tạo ⇒ dự kiến theo phần luyện lại đã soạn trong giáo trình gốc.
- Lưu: phần luyện lại = `tai_lieu_phan.loai_phan 'ontap_nhom'` + `lui_bac` (1/2) + `lui_buoi` (mốc buổi được luyện lại), cha = mốc buổi N — cùng một khuôn ở giáo trình gốc
  và ở phiếu của lớp ⇒ nội dung, bản in ("LUYỆN LẠI BÀI BUỔI TRƯỚC"), chấm, test online đọc sẵn.
  Hàm (mig `…1755`): `fn_tl_bdm_btvn_khung` · `fn_tl_bdm_dat_cau_lui` · `fn_tl_bdm_lui_goi_y` · `fn_tl_bdm_lui_goi_y_buoi` · `fn_tl_bdm_bo_phan_lui`; ghi phiếu lớp `fn_tl_bdm_trich_btvn`.
  Kiểm: `scripts/_test_btvn_3_phan.mjs` (25/25, ROLLBACK).
- **Bản đầu trong ngày (đã thay):** máy tự cắt câu BTVN đã soạn theo 5–3–2 lúc gán lớp (`_tl_bdm_btvn_chia` · `_tl_bdm_btvn_lui` · `fn_tl_bdm_btvn_xep_chong`).
  Ba hàm còn trên DB, client thôi gọi; gỡ là việc riêng (Luật xoá).
- **Chưa làm:** giáo trình **Hình** (builder riêng `ChuyenDeHinhBuilder`, phiếu chỉ 3–6 câu) · builder cũ (còn ~3 phiếu/tuần, đang tắt dần).

##### 8.2 BTVN tính vào mastery
- Đổi luật toàn hệ: dạng yếu, đề xuất bổ trợ, trend báo cáo tuần, KPI trưởng khối đều đọc mastery ⇒ chuỗi số gãy tại ngày đổi.
- **Trước khi áp: so cũ–mới** (bao nhiêu em đổi mức, dạng yếu mất/mới) và ghi ngày đổi lên các màn có trend.
- Hiện đã có 2 bản cache: `btvn=false` (ET+MT, mặc định) · `btvn=true` (mọi nguồn, bổ trợ dùng).
- Bài ở nhà không kiểm soát được ⇒ hệ **tự nêu cờ** khi BTVN và ET/MT của cùng nhóm lệch nhiều (triangulation, CLAUDE §5).

#### (cũ §9) Màn hình

##### 9.1 Mục tiêu tuần này — app HS **và** app phụ huynh (mockup màn 1)
- Đầu màn: tên tuần · lớp · chọn môn · nút "Các tuần trước".
- Ba ô: **Tiến độ mục tiêu tuần** (% + vạch đầu tuần + ▲/▼ + cờ đích) · **Việc của con x/y** · **Xếp hạng tiến độ** (bấm ⇒ top 20).
- Lối vào app HS: **ô "Mục tiêu tuần" ở Home** (Thùy 13/11), ngay sau ô Học tập.
- Cột trái: **Phần 1 · Kiến thức mới** + **Phần 2 · Ôn tập kiến thức**. Mỗi dòng nhóm bài GỌN: tên · ▲/▼ · % · thanh có **lá cờ ở mốc mục tiêu TUẦN,
  số ghi dưới cờ** (§5.2b) + vạch mờ "đích 80%" khi mục tiêu tuần < 80% (không ghi chữ "Mục tiêu"). **Bấm vào** mới mở: một dòng mô tả (đã học x/y dạng · tuần này N lần đo, làm Tốt cả N lần thì lên X%) +
  nút **Xem lại bài trên lớp (khu giáo trình) · Luyện tập** (Thùy 13/11: bỏ "Xem lại lý thuyết").
- Cột phải: **Việc của con tuần này** (§6). Việc BTVN chỉ của buổi trong tuần (17/11: BTVN buổi cuối tuần trước KHÔNG hiện ở tuần mới).
- **Quy tắc chữ + dạng bài (Thùy 17/11, áp HS · PH · nhân sự):** không ghi những câu kỹ thuật vô nghĩa với HS/PH (cấm "Cờ = mục tiêu tuần…"); dòng nhóm chỉ ghi số + một câu giải thích đời thường ("làm Tốt cả N lần thì nhóm lên X%").
  **Dạng bài ẨN mặc định**, bấm "Chi tiết" của nhóm mới hiện; **mỗi dạng MỘT dòng** (tên + tình trạng, không xuống dòng dài). Tình trạng dạng: app HS = lộ trình Học từ đầu của chính em (Đã xong · Đang luyện · Chưa mở · Chưa học);
  màn nhân sự = % mastery của dạng (mig `202611171118` + `1129` + `1140`: `fn_mtt_dang_tinh_trang`, gọi khi bấm Chi tiết; Hình–Học: bài = nhóm); nhãn 80/50 theo màu.
- **Màn nhân sự (tab Mục tiêu tuần · Phòng trưởng khối/bộ môn/giám đốc)**: bấm lớp ⇒ KHÔNG popup, chuyển màn chia đôi — **trái: danh sách HS của lớp, phải: tờ mục tiêu của em đang chọn** (Thùy 17/11); đây là màn quan sát CHÍNH của trưởng khối. Trưởng bộ môn / giám đốc có đủ 4 mục như trưởng khối (Dashboard học tập · Tình hình chung · Hồ sơ học tập · Danh sách bổ trợ), phạm vi mọi khối của môn.
- **App phụ huynh:** màn Mục tiêu tuần ở app PH (repo `bkdemy-ph-app`) CHƯA xây (kiểm 17/11 — chưa có `fn_mtt_*` trong repo). Khi xây phải theo ĐÚNG các luật trên (Phần 1 = bài học trong tuần, không có dòng "sẽ học thêm", quy tắc chữ + dạng bài); dữ liệu đọc cùng hàm DB nên đã đúng luật mới.
- **App phụ huynh: cùng nội dung, cập nhật liên tục** (Cổng Phụ huynh — project riêng `bkdemy-ph`, đọc ERP qua FDW `erp_live`), chữ formal.
  Thay hẳn phương án chụp ảnh gửi.
- App HS dựng bằng khung style (`design/STYLE-HS.md`, `skin/KhungHS.tsx`), màn ngang trước (`spec-v1-app-hs.md`). Chữ theo `useLoi()`.
- **NỀN TRẮNG ở mọi style** (Thùy 13/11: "để nền trắng cho dễ nhìn, đừng để nền tối"): màn này là màn ĐỌC ⇒ dùng bảng màu đọc nền sáng `--sk-doc-*` + màu nhấn theo môn `mauDocMon` (đè biến `--sk-*` trong phạm vi màn, không gõ màu tay). Ô ở Home vẫn theo style.

##### 9.2 Các tuần đã chốt — HS + phụ huynh (mockup màn 2)
- Sau mỗi lần chốt thứ Hai. Đọc **sổ chốt tuần**, không tính lại.
- Ba ô của tuần vừa chốt (tiến độ · việc đã làm · hạng, kèm chênh so với tuần trước) · biểu đồ cột 8 tuần: tiến độ tuần, việc đã làm
  (hai biểu đồ riêng, không trục kép) · lưới **nhóm bài × tuần** (%, ô "chưa học" để trống riêng).

##### 9.3 Tab "Mục tiêu tuần" — trung tâm (mockup màn 3)
- **Một tab trong Dashboard học tập**, đồng thời có mặt trong **Phòng làm việc trưởng khối** — cùng một màn, phòng là lối đi tắt (`spec-phong-truong-khoi.md`).
- Lọc môn · khối · tuần (tuần đang chạy hoặc tuần đã chốt).
- Bốn ô: tiến độ trung bình (▲/▼ đầu tuần) · tỉ lệ việc đã xong / việc đến hạn · BTVN Tốt · Tạm ổn · Chưa tốt · số em chưa làm việc nào.
- Bảng theo lớp: sĩ số · tiến độ TB · việc xong · BTVN theo 3 mức · số em chưa làm gì.
- **Em cần để ý** (kèm lý do: chưa làm việc nào · tụt nhiều tuần · BTVN chưa nghiêm túc / chống đối · vắng test sau giờ · nộp muộn liền) —
  bấm tên ⇒ mở màn 9.1 của em đó. Ở đây thấy đủ 4 mức thái độ BTVN.
- Theo phạm vi phân công (`fn_pham_vi_cua_toi`, `spec-truong-khoi.md`).
- **Xem tờ của TỪNG em (Thùy 16/11):** bấm tên lớp trong bảng "Theo lớp" ⇒ danh sách cả lớp (tiến độ · ▲/▼ đầu tuần · việc · nhóm/nợ · hạng; `fn_mtt_ds_lop`, mig 202611161713 — chỉ đọc bảng đệm/sổ của 1 lớp) ⇒ bấm em ⇒ tờ của em. Dưới bảng có chú thích nghĩa của "Chốt mục tiêu tuần" và "Tiến độ".
- **Trưởng khối xem được ĐỦ các view của HS/PH** (Thùy 13/11): bấm tên em ⇒ tờ tuần của em (thanh + cờ mục tiêu tuần + vạch đầu tuần, Phần 1/2, xếp hàng, sắp học, việc của em kèm thái độ 4 mức) · tab "Các tuần đã chốt" của em (tiến độ · việc · hạng · nhóm × tuần) · nút "🏆 Top 20 toàn trung tâm" (đúng bảng HS/PH thấy). Xem được cả khi lớp CHƯA chốt (HS/PH chưa thấy).

##### 9.4 Đã loại
- Màn chốt mục tiêu theo từng học sinh (quá vất vả — §4).
- Ảnh kết quả tuần gửi phụ huynh / nút "Ảnh gửi bố mẹ" (thay bằng app phụ huynh + 9.2).
- Gắn danh sách việc vào từng dòng nhóm bài (thay bằng khu vực riêng §6).

#### (cũ §10) Dữ liệu & kiến trúc

- **Mọi tính toán ở Postgres** (`fn_muc_tieu_tuan_*`, CLAUDE §2.0): cửa sổ tuần · gom dạng → nhóm · tiến độ · nhãn 3 mức · danh sách việc · hạng.
  App chỉ gọi hàm và hiển thị.
- **Không tính lại cả hệ khi mở màn:** số suy từ lịch sử đo đọc **cache mastery** (`mastery_luu_san`, cap `nhom`) — cấm quét lại
  `gami_grades` / `bai_lam_cau` / `bt_grades` mỗi lượt gọi. Hạng toàn trung tâm = **bảng tính sẵn**, làm mới theo nhịp cache mastery.
  "Cập nhật liên tục" = trễ vài phút sau khi chấm (theo nhịp làm mới cache), không polling ngắn. App phụ huynh qua FDW càng phải đọc bảng tính sẵn.
- **Sổ chốt tuần — bất biến**, chụp bởi bộ điều phối ở lượt đầu sau 00:00 thứ Hai; chỉ tạo dòng khi có kết quả thật (CLAUDE §1.5):
  kết luận từng (HS × môn × nhóm) · việc của tuần và kết quả · tiến độ · hạng · số đầu tuần của tuần mới. Nợ tuần sau và trend đọc từ đây
  (mastery chỉ nhìn 30 ngày ⇒ nợ không ai đo lại sẽ tự thành "chưa đo" nếu đọc mastery hiện tại).
- **Mọi bảng/hàm mang `mon`** và chạy y hệt mọi môn (symmetry test, CLAUDE §1.6).
- **Mã gốc:** nhóm/dạng tham chiếu bằng mã gốc, không bằng số thứ tự hiển thị (CLAUDE §2).
- **Hiện trạng dữ liệu** (đọc từ `schema.md` + migration 12/11, chưa query DB thật):

| Cần | Đã có | Ghi chú |
|---|---|---|
| Buổi của lớp | `buoi_hoc` (`lop_id`, `ngay`, `loai`, `trang_thai`) | buổi không có cột dạng |
| Dạng của buổi | `tai_lieu` (`giao_trinh_buoi` / `btvn` / `et` / `mt_buoi`, khoá `lop_id` + `ngay`) → `tai_lieu_phan` → `tai_lieu_cau.ma_cau` | suy được TRƯỚC khi dạy nếu tài liệu đã lên hệ |
| Mastery theo nhóm | `mastery_luu_san` (`btvn`, `cap`, `nut`, `score`, `n`, `muc`, `tin`) | ngưỡng 0,8 / 0,5 |
| BTVN | `btvn_nop` (`nop_at`) · `btvn_ket_qua` (`ti_le_dung`, `trang_thai_nop`, `thai_do`) | thái độ 4 mức có sẵn |
| Dạng yếu đầu tuần | `dang_yeu_dau_tuan` | cùng mốc 00:00 thứ Hai |
| Ca sau giờ / bổ trợ | luồng bổ trợ sau giờ (`ca_bo_tro_nhe`, `fn_btnhe_*`) · bổ trợ yếu (`ca_bo_tro`) | |
| Tự luyện | `tu_luyen_dang_lan` · `tu_luyen_so_cau` | |
| App phụ huynh | Cổng Phụ huynh (`bkdemy-ph`, FDW `erp_live`, `admin_parent_usage`) | đã chạy, có màn theo dõi đăng nhập |

#### (cũ §12) Quyết định cuối (Thùy 13/11) — hết câu treo

| # | Câu | Chốt |
|---|---|---|
| 1 | Cờ = mục tiêu tuần hay 80% | Cờ = mục tiêu tuần, 80% = đích dài hạn (§5.2b) |
| 2 | Ngưỡng chênh tăng/giảm | Không có ngưỡng — mọi chênh khác 0 (§5.3) |
| 3 | Hết vòng 3 buổi ở mức 50–79% | Tạm thời KHÔNG thành nợ |
| 4 | Lớp chưa chốt xong tới giờ phát | **Chưa chốt thì chưa hiện** tờ tuần mới (màn ghi "đang chốt mục tiêu tuần"); không phát bản dở |
| 5 | Lớp học thứ Bảy + Chủ nhật liền nhau | Không có lớp nào như vậy — bỏ |
| 6 | Quan hệ với "Nhiệm vụ" app HS | **Nhiệm vụ = chơi, mục tiêu tuần = học — tách riêng.** Sau này có thể gộp và bỏ nhiệm vụ cũ, nhưng KHÔNG làm trong đợt này |
| 7 | Em vắng | Việc của buổi vắng tính **chưa hoàn thành** (vắng thì phải học bù — đường đi là buổi bù, R-BU) |
| 7b | Em mới vào lớp | Phần trước ngày vào: **chưa có dữ liệu** (không tính nợ, không tính chưa hoàn thành) — đúng §1.5 "thiếu data = không có dòng" |
| 8 | Em học nhiều môn | **Mỗi môn một màn riêng**, không có màn gộp |
| 9 | HS tự cam kết mục tiêu | Để sau |

#### (cũ §13) Rủi ro đã soát

| # | Rủi ro | Trạng thái |
|---|---|---|
| 1 | Mastery không nhúc nhích trong 1 tuần | Gỡ bằng hai tầng (§5.2) + BTVN tính mastery + xếp chồng (§8) |
| 2 | Đường "hết yếu" không kết thúc bằng lần đo được tính; trùng bổ trợ | Gỡ bằng vòng nợ đo sau giờ (§7), một danh sách với bổ trợ |
| 3 | Tài liệu không lên hệ trước buổi họp ⇒ Phần 1 trống | Quy định bắt buộc (§4) + invariant việc tồn (§11.8) |
| 4 | Chấm trễ đẩy lần đo sang tuần khác | Hạn chấm đang chạy + "chờ chấm" là việc tồn của TA (§3.2) |
| 5 | Công khai số đổi hành vi (Goodhart): chép BTVN, cày câu dễ | Tầng tuần đòi TĂNG, không đòi đạt · cờ lệch BTVN–ET (§8.2) · theo dõi sau khi chạy |
| 6 | Nợ tự biến mất sau 30 ngày không đo | Nợ đọc từ sổ chốt tuần (§10) |
| 7 | Đổi luật mastery làm gãy trend toàn hệ | So cũ–mới trước khi áp, ghi ngày đổi lên màn trend (§8.2) |
| 8 | Màn chậm / chạm trần 8 s khi phụ huynh mở qua FDW hoặc khi tính hạng toàn trung tâm | Bảng tính sẵn + cache mastery (§10) |
| 9 | Tải: em nhiều môn, sức chứa ca sau giờ, em vắng / em mới | Gỡ: mỗi môn màn riêng · số nhóm nợ = sức chứa ca (§7) · vắng = chưa hoàn thành, mới vào = chưa có dữ liệu (§12) |

#### (cũ §14) Hiện trạng build (13/11, phiên cloud — CHƯA áp DB, CHƯA deploy)

**Đã viết + kiểm:**
| Phần | File | Kiểm |
|---|---|---|
| DB | `supabase/migrations/202611131000_muc_tieu_tuan.sql` (bảng `mtt_lop_chot` · `mtt_dau` · `mtt_luu` · `mtt_chot` · `mtt_top`; hàm `_mtt_tinh` + `fn_mtt_*`; quyền + FDW cho app PH) · `202611131001_muc_tieu_tuan_cron_sql_editor.sql` (cron 5 phút) | Chạy trên Postgres 16 tạm với bảng giả lập theo `schema.md` + dữ liệu mẫu: tờ tuần, mục tiêu tuần (vd nhóm nợ 25% → mục tiêu 36%), việc của con, chốt lớp, cron, xếp hạng, top 20, sổ chốt bất biến, tab trung tâm, HS lớp chưa chốt ⇒ `chua_chot` |
| ERP | `src/screens/danhgia/MucTieuTuanTab.tsx` + tab "🎯 Mục tiêu tuần" trong `DashboardHocTapScreen.tsx` (Phòng trưởng khối dùng chung màn này ⇒ tự có) · `src/lib/mucTieuTuan.ts` | `tsc` · `npm run build` |
| App HS | `src/screens/hocsinh/MucTieuTuanHS.tsx` — **ô "Mục tiêu tuần" ở Home** (Thùy 13/11), ngay sau ô Học tập, theo môn đang chọn. Icon mỗi style DÙNG LẠI 1 hình không hiện ở Home (RPG `o_rank` · Tối giản `o_bai_tap_giao` · Khối/Lo-fi/Đáng yêu/Halloween `o_luyen_yeu`) — Thùy: "không trùng ở Home là được" | `tsc` · `npm run build:hs` · `check:style-hs` (file mới 0 màu gõ tay) |
| App PH | repo `bkdemy-ph-app`: `migrations/0038_muc_tieu_tuan_fdw.sql` · `app/actions/muc-tieu.ts` · `components/ph/MucTieuTuanScreen.tsx` · ô "🎯 Mục tiêu tuần" ở Home | `tsc` · `npm run build` |

**Quyết định CTO khi build (Thùy xem lại được):**
1. **"Chưa chốt thì chưa hiện" cần một tín hiệu rõ** ⇒ tab trung tâm có nút **"Chốt mục tiêu tuần" theo LỚP** (không theo từng em), bấm sau buổi họp thứ Hai khi đã chốt giáo trình + bổ trợ. Cột cạnh nút cho thấy lớp đã có tài liệu cho bao nhiêu buổi và còn bao nhiêu đề xuất bổ trợ chờ duyệt. Chỉ người có phạm vi (môn × khối) của lớp mới chốt được. Dòng chốt append-only.
2. **% nhóm đọc mastery CÓ BTVN** (`p_include_btvn = true`, y như Dashboard học tập và bổ trợ đang đọc). Việc đổi luật mastery mặc định toàn hệ (§8.2) KHÔNG làm ở đây — còn phải so cũ–mới trên DB thật.
3. **Phần 2 (nợ)** = nhóm trong đề xuất bổ trợ MỚI NHẤT đã duyệt từ thứ Hai tuần trước trở đi + dạng của case bổ trợ yếu còn mở (quy về nhóm). Số lần đo dự kiến của nhóm nợ = số ca test sau giờ / bổ trợ yếu của em trong tuần.
4. **Bấm 1 nhóm chỉ còn 2 nút: Xem lại bài trên lớp (mở khu giáo trình — có đủ bài trên lớp) · Luyện tập (Tự luyện).** Bỏ "Xem lại lý thuyết" (Thùy 13/11: không cần). App PH chỉ ghi lời nhắc, vì phụ huynh không làm bài.
5. **Xếp hạng "lên/xuống bậc"** so với hạng của hôm trước (chụp mỗi ngày lần đầu cron chạy).
6. **Sổ chốt** = tính lại tờ tuần TẠI MỐC 00:00 thứ Hai (bài chấm sau mốc không vào bản chốt); hạng trong sổ = hạng cuối của bảng đệm.
7. **(16/11) Khoá mục tiêu lúc chốt lớp** — mig `202611161844_muc_tieu_tuan_khoa_ke_hoach.sql`: bảng `mtt_ke_hoach` (append-only, trigger bất biến); `_mtt_ghi` ghi kế hoạch
   lần đầu thấy lớp đã chốt; `_mtt_tinh` đọc nhóm/mục tiêu/k từ kế hoạch, số đo vẫn tính sống; payload thêm `ke_hoach_at`, `them_sau_chot`, `viec[].them_sau`.
   Kiểm trên Postgres tạm: chốt xong thêm dạng mới vào giáo trình + một ca bổ trợ yếu ⇒ nhóm giữ nguyên, nhóm mới vào `them_sau_chot`, ca mới `them_sau = true`, tiến độ không đổi; UPDATE kế hoạch bị chặn.
   **Sửa theo spec-kien-truc (16/11):** `fn_mtt_chot_lop` CHỈ ghi dòng chốt (bỏ vòng tính cả lớp ≤ 4 s trong lượt bấm — §5 ghi ≤ 500 ms, §12 mẫu 1); tờ + bản khoá do bộ điều phối ở lượt kế (≤ 5 phút),
   HS mở app trong lúc chờ ⇒ tính trực tiếp 1 em. Thử tạm: bấm chốt 1,5 ms; lượt điều phối kế ghi bản khoá cho 3/3 em. **Phần 2 chỉ lấy lượt chốt bổ trợ duyệt trong tuần của tờ** (khớp mig 202611161614).
9. **(16/11, Thùy mô tả lại luồng) Nháp · Công bố · Dạng** — cùng mig `202611161844`: bộ điều phối dựng NHÁP cho mọi em đang học từ thứ Hai (trước đây chỉ lớp đã chốt ⇒ trưởng khối
   mở danh sách lớp chưa chốt thấy trống); xếp hạng + sổ kết quả tuần chỉ lấy tờ đã công bố; nút đổi tên "Công bố" (cảnh báo nếu lớp còn đề xuất bổ trợ chưa duyệt).
   **Mỗi nhóm kèm DẠNG của tuần** (`_mtt_dang_nhom`: câu ET / BTVN / giáo trình của buổi trong cửa sổ + dạng case bổ trợ yếu đang mở) — app HS bấm nhóm ⇒ danh sách dạng ⇒ bấm dạng
   ⇒ **màn dạng của Học từ đầu** (Đọc lý thuyết · Luyện tập · Làm bài Test — Thùy chọn 16/11: dẫn tới màn có sẵn, không dựng màn mới), Quay lại về tờ mục tiêu. Nhóm chưa thấy dạng
   (buổi chưa có tài liệu trên hệ) ⇒ nút chung như cũ. App PH hiện tên dạng. Lưu ý: Luyện tập bị chặn với dạng lớp CHƯA học tới (`_dang_da_hoc_ok`, luật 14/10) — lý thuyết vẫn đọc được.
10. **(16/11) SỬA LỖI quy câu → nhóm (có từ 13/11):** `_do_o_quy` trả **ô đo = mã DẠNG BÀI** (NDB…; Hình–Học: mã bài), không phải nhóm; mastery gom ô → nhóm
   qua `dai_bdm_dang_bai.nhom_id`. Tờ cũ dùng thẳng ô làm nhóm ở Phần 1 (buổi), nhóm từ case bổ trợ yếu và nhóm của lượt tự luyện ⇒ % nhóm không khớp ("Chưa đo"), tên hiện mã.
   Phần 2 từ đề xuất bổ trợ + số đầu tuần đã đúng. Sửa bằng `_mtt_nhom_cua_o` (cùng mig 202611161844). **Sổ kết quả tuần 09–15/11 (`mtt_chot`, chụp 00:00 16/11) mang lỗi này và
   bất biến** — muốn chụp lại phải xoá dòng sổ tuần đó (Luật xoá, chờ Thùy). Danh sách dạng đọc thẳng câu trong TÀI LIỆU đã chốt của buổi (+ câu ET/BTVN trên app, + dạng case yếu).
11. **(16/11) Đồng bộ Giáo trình tuần** — phiên khác áp mig 202611161754 (đọc ca chiếu TKB + buổi kế hoạch `gtt_ca`) dựng trên `_mtt_tinh` bản 13/11; mig khoá kế hoạch của tôi
   đổi tên → `202611161844` và DỰNG LẠI trên bản 1754 (không đè): nguồn câu của buổi tách thành MỘT chỗ `_mtt_o_buoi` / `_mtt_o_lui` (thân 1754) ⇒ nhóm và dạng cùng đọc;
   cột "Giáo trình x/y" của tab trung tâm đếm cả ca chiếu TKB + buổi kế hoạch (`_mtt_buoi_tuan`; vá đúng đoạn trên thân đang chạy, giữ cổng quyền môn mig 1701).
8. **(16/11) Danh sách cả lớp** — mig `202611161713_muc_tieu_tuan_ds_lop.sql` (`fn_mtt_ds_lop`): bấm tên lớp trong tab ⇒ bảng từng em, bấm em ⇒ tờ của em.

**Chưa làm (cần máy công ty / DB thật):**
1. ✅ mig `202611131000` đã áp (13/11). **`202611161713` + `202611161844` Thùy áp qua SQL Editor 16/11 tối** (kèm đoạn thu quyền `anon` + ghi sổ `_migrations`; Claude chưa tự kiểm được) — `npm run migrate` (role ghi, chuỗi kết nối truyền lúc gọi), rồi `npm run schema` + commit `schema.md`.
2. ~~Cron riêng~~ — đợt 3 kiến trúc (mig 202611140808) đã đưa `_mtt_lam_moi(40)` vào bộ điều phối (sổ `muc_tieu_tuan`, 5 phút), job `muc-tieu-tuan` đã gỡ. Không chạy lại file cron cũ.
3. Đo `fn_mtt_trung_tam` + `_mtt_ghi` bằng dữ liệu thật (khối đông nhất) — trần 8 s; `_mtt_tinh` gọi `_mastery_lan_d` (30 ngày) 1 lần/em/tuần khi chụp đầu tuần.
4. App PH: áp `migrations/0038_muc_tieu_tuan_fdw.sql` ở DB `bkdemy-ph` SAU khi ERP đã áp, rồi deploy (`npx vercel --prod --yes`).
5. Deploy ERP + app HS như thường lệ.
6. §8.1 BTVN xếp chồng + §8.2 đổi luật mastery toàn hệ: chưa đụng.

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
| 5 | ~~HS yếu = có ≥ 1 dạng yếu~~ → **HS yếu = có ≥ 1 NHÓM yếu** (Thùy 17/11, §5.5 dòng 4). "Khó giảm cũng phải giảm". |
| 6 | **Dữ liệu có thời gian ⇒ suy ngược được mọi khung thời gian** (dạng yếu tại mốc bất kỳ = chỉ dùng các lần đo trước mốc). |
| 7 | Ảnh dạng yếu **đầu tuần chụp tự động**. |
| 8 | Bổ trợ tính **Bổ trợ Yếu + Bổ trợ Nhẹ (sau giờ)**. Bù · đuổi · ôn thi chưa đưa vào. |
| 9 | **Nộp trễ ⇒ gậy.** |
| 10 | Phần **trưởng khối tự viết** theo khung Plans · Progress · Problems. |
| 11 | **Độ phủ đo** + tách **Ra có bằng chứng / Rớt cửa sổ** cạnh "dạng yếu giảm" (chống Goodhart; `spec-truong-khoi` §4.2). |
| 11b | **"Lần đo mới trong kỳ" (cho Ra có bằng chứng + Độ phủ đo) = MỌI lần đo mà mastery tính** — gồm chấm buổi (ET · MT · BTVN) **và bài TEST app / TA nhập** (test **bổ trợ sau giờ**, test bù, test học từ đầu, ET app), tính theo lúc chấm trong kỳ (Thùy 17/11, mig `202611171244`). Trước đó chỉ đếm chấm buổi ⇒ dạng hết yếu nhờ test sau giờ bị xếp "Rớt cửa sổ". Đo 17/11 tuần 09/11 Toán: Ra có bằng chứng K6 3→23, K7 8→14, K8 8→22, K9 26→31. |
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
| 3b | **Nhóm yếu** (Thùy 17/11) | Đầu · Cuối · Đã giảm · Tỉ lệ giảm | Nhóm mức Yếu theo mastery (`spec-mastery` §5), đầu = T2 00:00, cuối = CN 24:00. Toàn khối + từng lớp. |
| 3c | **HAI CHIỀU tách riêng** (Thùy 17/11, phien_ban 3) — cho cả NHÓM yếu (chính) và DẠNG yếu | ① Đầu tuần → còn yếu: Đầu |A| · Còn yếu |A∩B| · Hết yếu |A∖B| (+ tỉ lệ) · em thôi học · ② Phát sinh mới |B∖A| · Cuối |B| = còn yếu + phát sinh | A = ảnh đầu tuần (T2 00:00), B = ảnh đầu tuần sau — cùng `dang_yeu_dau_tuan` mà Tình hình chung đọc (một nguồn). KHÔNG gộp thành một số "đầu → cuối": vd 80 → còn 70 (bổ trợ có tác dụng) + phát sinh 20 = 90. Toàn khối + từng lớp + trend 4 tuần (2 dãy). `fn_bctk_so` khối `hai_chieu` (mig 202611171404; ảnh 09/11 chụp lại theo luật hiện hành). |
| 4 | **HS yếu** | Đầu · Cuối · Đã giảm · Tỉ lệ · **Danh sách HS còn yếu** | **HS yếu = em có ≥ 1 NHÓM yếu** (Thùy 17/11, thay "≥ 1 dạng yếu" của 03/11; báo cáo phien_ban 2). Danh sách: em · lớp · số nhóm yếu · số dạng yếu · **trạng thái xử lý** (ca Nhẹ / đang bổ trợ Yếu / đã đề xuất / chưa xử lý — "chưa xử lý" lên đầu). |
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
| **BTVN xếp chồng 3 buổi** (5 · 3 · 2: buổi này · buổi trước · buổi trước nữa — soạn trong builder chế độ BTVN) | Mỗi buổi | §4.7 (cũ §8.1) |
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
