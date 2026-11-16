# Spec — GIÁO TRÌNH TUẦN (kế hoạch dạy tuần tới của từng ca học)

> **Trạng thái: Thùy DUYỆT 16/11/2026.** Bước 1 (DB) ĐÃ ÁP: mig `202611161716_giao_trinh_tuan` + `202611161722_giao_trinh_tuan_mot_cong`. Chưa có màn (bước 2).
> Nguồn: Thùy trả lời 12 câu (phiên 16/11) · đọc `spec-kien-truc.md` (§0b, §9, §12) · `spec-muc-tieu-tuan.md` · dữ liệu thật ngày 16/11.

---

## 0. Phiếu 10 câu (spec-kien-truc §9)

| # | Câu | Trả lời |
|---|---|---|
| 1 | Miền · bảng | **Vận hành lớp.** Bảng mới `gtt_ca` (ca ↔ buổi builder), `gtt_ca_log` (vết), `gtt_duyet` (sổ duyệt, chỉ thêm). Khung dạng **không** có bảng mới: nó nằm trong builder (`tai_lieu_phan`) |
| 2 | Mã gốc | Ca = khoá tự nhiên `(lop_id, ngay)` (TKB: mỗi lớp tối đa 1 ca/ngày, đo 16/11 có 0 trùng). Buổi = `tai_lieu_phan.id` của nút `buoi` (bất biến). Số "Buổi 7" chỉ để hiển thị |
| 3 | Nhãn `mon` | `gtt_ca.mon`, `gtt_duyet.mon`, kiểm khớp `lop.mon` bằng trigger. Toán (Đại · HGT · Hình) và KHTN chạy cùng một bộ hàm, không có `if mon` |
| 4 | Quyền | RLS bật; đọc: thành viên có phạm vi (`fn_pham_vi_cua_toi`); **ghi chỉ qua RPC** `security definer` có cổng ở đầu thân: trưởng khối trong phạm vi (môn × khối) chọn và gửi; trưởng bộ môn của môn duyệt hoặc trả lại. Policy viết `(select fn())` (K27). Không cấp cho `anon` |
| 5 | Số lượt gọi lúc mở màn | **1**: `fn_gtt_man_tuan(mon, khoi, tuan)`. Bấm vào ô mới gọi chi tiết buổi (dùng lại hàm builder) |
| 6 | Chi phí | Theo MỘT khối × MỘT tuần (≈ 10 lớp × 2–3 ca). Không đụng lịch sử đo. Ngân sách < 300 ms, đo bằng tài khoản Trang/Thùy trước khi đưa lên màn |
| 7 | Số tính sẵn | Không cần (đọc trực tiếp, rẻ) ⇒ không thêm job vào `tinh_san_dang_ky` |
| 8 | Index | `gtt_ca` PK `(lop_id, ngay)` + unique `(buoi_id)`; `gtt_duyet (mon, khoi, tuan, at desc)`. Không có bảng dòng rộng |
| 9 | Polling | Không. Vá tại chỗ sau mỗi lần chọn/duyệt (CLAUDE §2 React); màn nhớ `NHO` (tuần, khối, ô đang mở) |
| 10 | Tăng trưởng | ~50 lớp × 3 ca × 52 tuần ≈ 8.000 dòng/năm. Giữ vĩnh viễn (là dữ liệu gốc) |

---

## 1. Story & đích

- **Hiện trạng:** thứ Sáu đội GV họp, chốt nội dung tuần sau **trên Google Sheet**. Trên hệ, buổi giáo trình được gán cho lớp **đúng ngày dạy**
  (đo 16/11: trong 30 ngày có 225/261 lượt gán, tức 86%, tạo đúng ngày học) ⇒ trước ngày dạy hệ **không biết** tuần tới học dạng gì.
- **Đích:** thay đúng cái Sheet đó. Họp thứ Sáu, **trưởng khối** điền cho **từng ca học trong thời khoá biểu** của tuần sau (T2 → CN):
  ca đó học **nhóm bài nào, dạng bài nào**. Đây CHỈ là chọn khung; chọn câu thì GV làm sau trong builder như hiện nay. **Trưởng bộ môn duyệt.**
- **Mục tiêu chính:** biết tuần này học dạng gì. Các thứ khác (mục tiêu tuần của HS, BTVN, ET…) chạy theo cái này.
- Vào màn từ **Phòng làm việc trưởng khối**.

## 2. Mô hình — một sự thật, hai cửa sổ

```
Thời khoá biểu (thoi_khoa_bieu)  ──suy ra──▶  CA tuần sau (lop, ngay, giờ)       [không lưu, pure-derive]
                                                  │
                                         gtt_ca (lop, ngay) ⇄ buoi_id            [MỘT dòng = MỘT liên kết 1-1]
                                                  │
Builder giáo trình của lớp ─────────────▶  nút buổi (tai_lieu_phan 'buoi')
                                             └─ nhóm (ref_ma) └─ dạng bài (ref_ma) └─ câu (GV chọn sau)
```

- **Khung dạng chỉ lưu MỘT chỗ: dưới nút buổi trong builder.** Màn Giáo trình tuần và builder là hai cửa sổ nhìn vào cùng các dòng đó ⇒
  sửa bên này thì bên kia đổi theo, không cần đồng bộ (không có bản sao để lệch).
- `gtt_ca` chỉ giữ **liên kết**: ca `(lop_id, ngay)` ↔ buổi `buoi_id`. Unique cả hai phía ⇒ đúng 1-1. Builder đọc bảng này để hiện nhãn
  "📅 T3 24/11" trên buổi; màn tuần đọc nó để biết ô nào ứng với buổi nào.
- **Mỗi giáo trình chỉ cho 1 lớp** (Thùy). Đo 16/11: trong 14 ngày chỉ 4/165 lượt gán dùng giáo trình chưa gắn lớp ⇒ màn chỉ cho chọn buổi
  của giáo trình có `lop_id` = lớp đó. Lớp chưa có giáo trình thì màn tạo giáo trình của lớp ngay tại chỗ.
- Chỉ **ca thường** từ TKB (`buoi_hoc.loai = 'thuong'`). Buổi bù, bổ trợ, MT không nằm trong màn này.

## 3. Luồng

1. **Thứ Sáu, trong buổi họp — trưởng khối** mở *Phòng trưởng khối → Giáo trình tuần*, mặc định **tuần sau**, khối của mình.
   Lưới: hàng = lớp · cột = T2 … CN · ô = ca (giờ, phòng) + khung đã chọn (nhóm › dạng).
2. Bấm một ô ⇒ khung bên phải:
   - chọn **buổi có sẵn** trong giáo trình của lớp (mặc định gợi ý buổi kế tiếp chưa dạy), hoặc **buổi mới** (thêm vào cuối giáo trình);
   - chọn nhóm và dạng bằng **đúng bộ chọn của builder** (cây bản đồ theo khối/nhánh; dùng lại module, không viết bộ chọn mới);
   - nút "Mở trong builder" để GV chọn câu sau.
3. Đủ các ca ⇒ **Gửi duyệt** (theo khối × môn × tuần). Ca chưa có khung thì nút vẫn bấm được, màn ghi rõ "còn N ca trống".
4. **Trưởng bộ môn** mở cùng màn ⇒ **Duyệt** hoặc **Trả lại** (kèm ghi chú). Lúc duyệt, máy **chụp khung của mọi ca** vào `gtt_duyet.khung`
   (bản bất biến để so "dạy đúng giáo trình đã chốt").
5. **Sau khi duyệt vẫn sửa được** (Thùy): sửa ở màn tuần hay ở builder đều được, không phải duyệt lại. Ô nào khác bản chụp thì có dấu
   "sửa sau duyệt"; trưởng bộ môn thấy, và `gtt_ca_log` + log builder giữ vết.
6. **Ngày dạy:** lúc gán buổi cho lớp (luồng gán hiện tại), hệ **tự chọn sẵn** buổi đã liên kết với ca đó. GV gán một buổi khác ⇒ trong
   cùng giao dịch, liên kết của ca chuyển sang buổi đó (vẫn 1-1). Bản chép của lớp (`giao_trinh_buoi`) giữ nguyên cách làm hiện nay.
7. **Ca huỷ, dời, nghỉ** (Thùy: OK): liên kết đi theo ca thật. TKB đổi làm ca không còn tồn tại ⇒ ô hiện cờ "ca không còn trong TKB, chọn lại ngày",
   **không tự xoá** (§2 "thà bỏ trống còn hơn đánh sai").

## 4. Bảng (nháp)

```sql
gtt_ca (
  lop_id uuid references lop, ngay date,             -- ca = khoá tự nhiên
  buoi_id uuid not null unique references tai_lieu_phan on delete cascade,
  mon text not null,                                 -- khớp lop.mon (trigger)
  sua_boi uuid references nhan_su, sua_at timestamptz default now(),
  primary key (lop_id, ngay))
-- trigger: buoi_id phải là nút 'buoi' của tai_lieu loai 'giao_trinh' có lop_id = gtt_ca.lop_id
-- trigger ghi vết → gtt_ca_log (cũ/mới, người, lúc) — app không tự ghi log (CLAUDE §4)

gtt_duyet (                                          -- chỉ thêm; trạng thái = dòng mới nhất
  id, mon, khoi, tuan date,                          -- tuan = thứ Hai
  hanh_dong text check (in ('gui','duyet','tra_lai')),
  ghi_chu text, khung jsonb,                         -- khung chỉ có ở 'duyet': {lop:{ngay:[{nhom,dang[]}]}}
  nhan_su_id, at)
```

Xoá buổi trong builder ⇒ liên kết mất theo (cascade), ô trở về "chưa có khung". Đây là đúng ý: ca đó không còn buổi.

## 5. Hàm

| Hàm | Việc |
|---|---|
| `fn_gtt_man_tuan(mon, khoi, tuan)` | MỘT lượt gọi cho cả lưới (jsonb): lớp · giáo trình của lớp · ca · buổi đã gắn (tiêu đề, số thứ tự, khung nhóm › dạng) · đã gán ngày dạy chưa / khớp không · trạng thái duyệt + 10 dòng sổ · cờ `sua_sau_duyet` · `mo_coi`. Ca suy bằng `_gtt_ca(lớp[], từ, đến)` — cùng luật phần 1–2 của `fn_phong_lich` nhưng chỉ cho các lớp được hỏi (K2; `fn_phong_lich` tính cả trung tâm) |
| `fn_gtt_chon_buoi(lop, ngay, buoi_id \| null)` | gắn ca với buổi CÓ SẴN của giáo trình lớp; `null` = bỏ gắn. Buổi đã gắn ca khác ⇒ báo lỗi (1-1) |
| `fn_gtt_dat_khung(lop, ngay, chon, tai_lieu?)` | đặt khung. Ca chưa gắn buổi ⇒ tạo buổi mới cuối giáo trình `tai_lieu` rồi gắn, cùng giao dịch (không đẻ buổi rỗng). Ghi bằng **đúng hàm builder `fn_tl_bdm_dat_buoi`** (cùng luật kiểm, cùng gợi ý câu như khi GV chọn nhóm trong builder — giữ nguyên để hai cửa sổ hành xử y hệt). Giáo trình Hình ⇒ báo "mở builder Hình" (bước 3) |
| `fn_gtt_chuyen(mon, khoi, tuan, 'gui' \| 'duyet' \| 'tra_lai', ghi_chu?)` | ghi `gtt_duyet`; `duyet` chụp khung trong cùng giao dịch; trả lại phải có lý do; trả cả màn tuần |
| luồng gán ngày dạy | (bước 5) đọc `gtt_ca` để chọn sẵn; gán khác ⇒ cập nhật `gtt_ca` trong cùng giao dịch |

Cổng: `_gtt_kiem_pham_vi` (= `_trong_pham_vi`: trưởng/phó khối · trưởng bộ môn · QLCL toàn hệ) cho mọi hàm; duyệt / trả lại thêm `_gtt_la_tbm` (trưởng bộ môn của môn · QLCL toàn hệ).
Hàm nội bộ `_gtt_*` không cấp cho client. Đo 16/11 (vai Tạ Quốc Cường / Đào Xuân Thùy, giao dịch rollback): đọc cả khối 9 (6 lớp) ~65 ms gồm ~47 ms đường truyền; đặt khung tạo buổi mới ~280 ms (gợi ý câu của builder).

## 6. Nối với Mục tiêu tuần

- **Phần 1 · Kiến thức mới** hiện chỉ biết dạng của buổi **sau khi** buổi đã được gán cho lớp (`_mtt_nhom_buoi` đọc `tai_lieu` theo `lop_id + ngay`)
  ⇒ đó là lý do trước giờ phần này trống tới sát ngày dạy.
- Sửa: `_mtt_nhom_buoi` lấy dạng từ bản chép của lớp nếu đã có (như cũ); **chưa có thì lấy khung của buổi liên kết trong `gtt_ca`**. Cùng một chữ ký hàm.
- **Không gộp hai lượt chốt** (câu 9, CTO quyết theo kiến trúc): duyệt giáo trình tuần (thứ Sáu, trưởng bộ môn) và chốt mục tiêu tuần theo lớp
  (`mtt_lop_chot`, thứ Hai sau khi chốt bổ trợ) là hai người, hai ngày, hai việc. Cột "lớp đã có tài liệu cho bao nhiêu buổi" cạnh nút chốt mục tiêu tuần
  chuyển sang đọc **"giáo trình tuần đã duyệt chưa"**. Phần 2 (nợ, bổ trợ) giữ nguyên.
- Sau này: chỉ số "tỉ lệ dạy đúng giáo trình đã chốt" (spec mục tiêu tuần §5.6) = so `gtt_duyet.khung` với bản chép của lớp ngày dạy. Có sẵn dữ liệu, làm ở đợt sau.

## 7. Việc tồn (pure-derive, không bảng tasks)

- ∀ ca thường của tuần sau trong phạm vi trưởng khối ⇒ ∃ `gtt_ca` có ≥ 1 nhóm, trước **hạn H1** ⇒ thiếu là việc tồn của **trưởng khối**.
- ∀ (môn × khối × tuần) đã `gui` ⇒ ∃ `duyet` trước **hạn H2** ⇒ thiếu là việc tồn của **trưởng bộ môn**.
- Hiện ở Phòng trưởng khối; nối vào Gậy để sau, khi Thùy chốt hạn.

## 8. Thứ tự build

1. Migration `gtt_*` + hàm + thử qua REST (CLAUDE §1.6) · `npm run check:kien-truc` ✔.
2. Màn lưới + khung bên phải (Toán Đại/HGT, KHTN) trong Phòng trưởng khối; builder hiện nhãn ngày trên buổi.
3. Hình (builder Hình, khung = mô hình/dạng của Hình).
4. Duyệt của trưởng bộ môn + bản chụp.
5. Luồng gán ngày dạy chọn sẵn buổi đã liên kết.
6. `_mtt_nhom_buoi` đọc khung kế hoạch (so cũ–mới từng dòng trước khi áp, K18).

## 9. Chờ Thùy quyết

1. **Hạn H1** (trưởng khối điền xong) và **H2** (trưởng bộ môn duyệt xong). Đề xuất: H1 = 23:59 thứ Sáu · H2 = 12:00 thứ Bảy.
2. Trễ hạn có tính **gậy** không, hay chỉ hiện việc tồn?
