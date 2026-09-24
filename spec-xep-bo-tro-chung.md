# XẾP BỔ TRỢ CHUNG (Đuổi · Bù · Yếu) theo ĐƠN VỊ — spec

> Kiến trúc CEO (Thùy) chốt **23–24/09/2026**. Trạng thái 24/09: **bước 1–3 (§10) ĐÃ CODE** — folder Bổ trợ 5 lá · DB `ca_bo_tro` + đơn vị · sub-tab Lịch phòng chạy thật (`src/screens/botro/LichPhongScreen.tsx`, `src/lib/ca_bo_tro.ts`, mig 202609240930 · 202609241100 · 202609241230). Bước 4 (gỡ form xếp tay 3 loại + tab Ca bổ trợ của Yếu) và 5 (KPI tải TA) **chờ CEO dùng thử Lịch phòng rồi mới làm**. Luồng từng loại bổ trợ
> (Đuổi `BoTroDuoiScreen` · Bù `BoTroScreen` · Yếu `spec-bo-tro.md`) GIỮ NGUYÊN — file này chỉ nói về việc **3 loại gặp nhau ở nguồn lực**:
> nhân sự (ca trực TA) và phòng. Đọc `spec-bo-tro.md` §0 trước để biết 3 loại là gì.

---

## 0. Vì sao (CEO 23/09)

3 loại bổ trợ xếp riêng nhau ⇒ confuse vì **cùng dùng phòng và cùng dùng trợ giảng**. Trước làm riêng vì không đủ thời gian; giờ từng luồng
xong rồi thì **thống nhất quy tắc xếp lịch**: 1 lá "Bổ trợ", 3 loại là 3 sub-tab, và 1 lịch chung theo **đơn vị bổ trợ** của ca trực.

## 1. ĐƠN VỊ bổ trợ (CEO chốt)

- **1 đơn vị = 30 phút × 1 trợ giảng.** Đơn vị là **TẢI của TA**, không phải thời gian thật của em (câu 1: "đúng rồi").
- Ca trực **60' × 1 TA = 6 đơn vị** · ca **30' = 3 đơn vị** · ca có **2 TA = 12 đơn vị**. Công thức: `đơn vị ca = 3 × (phút / 30) × số TA`.
- Giá **cố định theo loại** (không sửa từng ca):

| Loại | Đơn vị | Ghi chú |
|---|---|---|
| Bổ trợ **Đuổi** | **4** | phải bảo đảm **đủ 1 tiếng, không giảm** ⇒ chỉ vào ca ≥60' và ca còn ≥4 |
| **Bù** | **4** | |
| **Yếu L2** | **4** | |
| **Yếu L1** | **1** | L1 = 30' thật = 1 đơn vị (CEO sửa 24/09 tối; trước ghi 2). Ca 6 đv về lý thuyết chứa 6 L1 nhưng nắp **3 em/TA** chặn trước |
| Yếu L3 | — | GV cao cấp, **xếp riêng**, tạm chưa có ⇒ ngoài phạm vi |

- Nắp cứng kèm theo: **≤3 em / 1 TA / ca** (bất kể đơn vị). Ca 2 TA ⇒ ≤6 em.
- **Ca ĐẦY khi chạm 1 trong 2 ngưỡng** (CEO 24/09): (1) đủ người 3 em/TA · (2) đủ đơn vị. Màn báo "ĐẦY — đủ 3 em / đủ đơn vị". Cờ `day_nguoi`, `day_don_vi` ở `fn_ca_bo_tro_ngay`.
- Ca **30'** chỉ chứa được L1 (3 đơn vị: 1 L1, vì nắp 3 L1 nhưng chỉ 3 đơn vị ⇒ tối đa 1 L1… **giả định G1, xem §9**).

## 2. NGUỒN LỰC 1 — Ca trực trợ giảng

- Nguồn: **tab Lịch trực** (bảng `lich_truc_bo_tro` hiện có: môn · khối · thứ · giờ · phòng · người trực · hiệu lực). Không lấy từ Phân công
  ("phân công còn làm cái khác"). Lịch trực chuyển thành **sub-tab chung** của lá Bổ trợ, không nằm trong loại nào.
- 1 dòng lịch trực = 1 ca cố định hằng tuần. Thêm **số TA** (1 hoặc 2 ⇒ 6 hoặc 12 đơn vị). TA nghỉ 1 hôm ⇒ Lộc **huỷ ca hôm đó** ngay trên
  Lịch phòng (ca huỷ giữ dấu; em đã xếp vào ca đó về lại hàng chờ).
- **Bậc lớp (S/A/B/C) KHÔNG còn dùng để xếp** ("không phân biệt SABC"). Khối chỉ là gợi ý lọc danh sách ứng viên của ca.
- Người dạy mặc định (câu 6 — "logic chọn, đề xuất mặc định, vẫn đổi được"):
  - **Yếu** ⇒ người trực ca.
  - **Bù / Đuổi** ⇒ **TA của lớp em** (lớp nào TA lớp đó dạy) nếu TA đó đang trực ca này; không thì người trực, Lộc đổi tay được.
  - Đuổi do **giáo viên xếp** nội dung, nhưng chỗ/giờ vẫn qua Lịch phòng.

## 3. NGUỒN LỰC 2 — Phòng

- **1 phòng, cùng 1 khung giờ, tối đa 2 ca bổ trợ** (tạm thời). Chặn cứng ở DB khi tạo/đổi ca; UI hiện "P201 · 2/2 ca lúc 17:00 — đầy".
- Phòng hiện chỉ có tên (`buoi_hoc.phong` text; `Quản lý phòng học` có danh sách) — chưa cần sức chứa theo em.

## 4. LUỒNG XẾP (Lộc / core team)

```
Mở sub-tab LỊCH PHÒNG → chọn NGÀY (mặc định hôm nay; đi từng ngày tới)
  → thấy các CA TRỰC của ngày (từ lịch trực), mỗi ca: giờ · phòng · TA · thanh đơn vị đã dùng / tổng · em đã xếp
  → click 1 ca ⇒ POPUP ứng viên đúng khối của ca, 3 tab: ĐUỔI · BÙ · YẾU (mỗi tab xếp ưu tiên cao → thấp)
  → bấm "+ Xếp" 1 em ⇒ em vào ca ở trạng thái CHỜ PH (chưa trừ đơn vị, hiện mờ)
  → PH xác nhận ⇒ Lộc bấm "Xác nhận" ⇒ TRỪ ĐƠN VỊ, chiếm chỗ ("ai chốt trước chiếm chỗ")
  → ca kín đơn vị ⇒ xong ca; hết ca của ngày ⇒ sang ngày tiếp
```

- Thứ tự ưu tiên tổng: **ngày → loại (Đuổi → Bù → Yếu) → ưu tiên trong loại**.
- Hệ thống **chỉ chặn**, không tự xếp: không cho vượt tổng đơn vị, không cho >3 em/TA, Đuổi/Bù cần còn ≥4, L1 cần còn ≥2 (ca còn 2 ⇒ chỉ
  L1 vừa: nút "+ Xếp" của Đuổi/Bù/L2 mờ + chú "cần 4 · còn 2"; **không** giảm Đuổi xuống cho vừa — câu 11).
- Đơn vị "chờ PH" **không giữ chỗ**: hiện riêng "đang chờ PH: +N" để Lộc biết nếu tất cả xác nhận thì vượt hay không.
- Em **nghỉ / huỷ** ⇒ trả đơn vị, ca mở lại cho Lộc xếp tiếp, kể cả trong ngày (câu 14).
- **1 em: bù riêng, yếu riêng** — không gộp 2 loại vào 1 chỗ; cùng ngày có thể 2 ca khác nhau (câu 12).
- Mục 4 của CEO (dữ liệu "em đi được buổi nào" từ PH ⇒ máy gợi ý) — **sau**, không nằm trong đợt này.

## 5. ƯU TIÊN TRONG LOẠI

| Loại | Thứ tự |
|---|---|
| **Đuổi** | em **chưa được đuổi buổi nào** trước em đã đuổi; cùng trạng thái ⇒ **vào lớp sớm hơn trước** (chờ 10 ngày trên chờ 5 ngày). Đuổi ít, hiện list là đủ |
| **Bù** | *(CEO chưa nói — giả định G2)* buổi nghỉ **cũ hơn trước**; cùng buổi ⇒ em nghỉ nhiều buổi chưa bù hơn trước |
| **Yếu** | `uu_tien` Cao → Thường → Thấp, rồi case mở lâu hơn trước (như hiện nay). **Không xét bậc** |

## 6. MÀN HÌNH — ĐÚNG 1 lá "BỔ TRỢ" (menu Vận hành) → thanh toggle 5 nút phía trên (CEO 24/09: "không phải 5 lá con; 1 click là chuyển")

| Sub-tab | Là gì | Đổi gì so với nay |
|---|---|---|
| **Đuổi** | `BoTroDuoiScreen` | gom vào, **không đổi** |
| **Bù** | `BoTroScreen` | gom vào, **không đổi** |
| **Yếu** | `XepLichBoTroYeuScreen` (Cần xếp · Đã xếp · Chờ retest · Hoàn thành · Retest · Đang diễn ra) | gom vào; **bỏ 2 tab Ca bổ trợ + Lịch trực** (lên sub-tab chung); nút "Xếp" trên card ⇒ mở Lịch phòng với em đó được chọn sẵn |
| **Lịch phòng** ★ mới | ngày → ca trực → popup 3 tab → xếp theo đơn vị (§4) — mockup `mockups/xep-bo-tro-chung.html` | thay cho tab "Ca bổ trợ" + form xếp tay của cả 3 loại |
| **Lịch trực** | tab hiện có của Yếu, thêm cột số TA | lên chung |

Hub: `src/screens/botro/BoTroHubScreen.tsx` (thanh toggle, nhớ tab đang mở; nơi khác nhảy tới bằng `moBoTroTab('duoi'|'bu'|'yeu'|'lichphong'|'lichtruc')`). 1 quyền `botro` cho cả màn.
Giao diện: Apple-clean (nền xám, card trắng, pill mềm) như mọi màn staff — không sci-fi.

## 6b. Cập nhật 24/09 chiều (sau khi CEO dùng thử)

- **Yếu không còn logic xếp riêng** — tab "Ca bổ trợ" (tự ghép khối+bậc) và "Đang diễn ra" bỏ khỏi màn Yếu; đơn vị tính chung 3 loại.
- **Lịch phòng = "Đang diễn ra" của cả 3 loại**, 2 khu: 📅 **Lịch trực bổ trợ khối** (ca trực cố định trước/sau giờ học) · 🗂 **Lịch riêng** (ca tạo tay + buổi xếp riêng
  không khớp ca trực nào — nhúng TheoDoiCaBoTroTab). Mở ngày ⇒ DB gắn buổi đã xếp bằng form Bù/Đuổi/Yếu vào ca trực khớp NGƯỜI + GIỜ, tính đơn vị,
  coi như PH đã chốt (mig 202609241600). Ca lố đơn vị (xếp đường cũ) hiện đỏ "LỐ".
- Màu thẻ theo loại (nền nhạt): **Yếu đỏ · Đuổi xanh da trời · Bù cam**. Em yếu trong ca trực hiện luôn trạng thái sống (đang luyện / im lâu / chờ test · x/y câu).
- Chọn ngày: 3 ô (hôm qua · hôm nay · ngày mai quanh ngày chọn) + mũi tên + chọn thẳng.
- Bù · Đuổi · Yếu: chip khối + ô tìm tên/mã **góc trên bên phải**, cùng hàng tab.
- **Tab Yếu = TRỌN luồng bổ trợ yếu, toggle 5 nút: Duyệt bổ trợ · Nội dung · Xếp bổ trợ · Trạng thái ca · Đánh giá ca** (CEO 24/09) — CẢ folder
  "Bổ trợ yếu" rời Quản lý chất lượng vào đây (folder đó không còn trên menu). Link cũ `botroyeu:*` mở đúng toggle tương ứng.
- Lịch phòng: 2 khu **Lịch trực khối / Lịch riêng** là toggle 2 nút.

## 7. QUYỀN

Core team xếp / xác nhận / huỷ ca. Học thuật + TA xem. (Đuổi: GV chọn nội dung như cũ.)

## 8. HƯỚNG DB (phác — chốt khi code)

- `lich_truc_bo_tro` + `so_ta smallint default 1` (đơn vị = 3 × phút/30 × so_ta). Cột `bac` giữ nhưng không dùng xếp.
- Bảng mới **`ca_bo_tro`** = 1 ca trực **của 1 ngày** (sinh từ lịch trực khi Lộc mở ngày đó, hoặc tạo tay): `lich_truc_id`, `ngay`, giờ, `phong`,
  `don_vi_tong`, `trang_thai` (mo | huy + lý do), TA (`ca_bo_tro_nhan_su` n người). Chặn: cùng phòng cùng giờ ≤2 ca (trigger).
- Buổi của từng loại (`buoi_hoc` loai = bo_tro_duoi | bu | bo_tro_yeu) **gắn `ca_bo_tro_id`**; giờ/phòng/người dạy của buổi lấy từ ca.
  Yếu 1 buổi/1 em (như nay) · Bù 1 buổi nhiều em (như nay) · Đuổi 1 buổi/1 em.
- `buoi_hoc_hs` + `don_vi smallint` (2|4, ghi lúc xếp theo bảng §1) + `xac_nhan_ph_at` (PH đã xác nhận ⇒ mới tính vào tổng).
  Đơn vị đã dùng của ca = Σ `don_vi` của em có `xac_nhan_ph_at` và buổi còn `mo`. Trigger chặn vượt `don_vi_tong`, >3 em/TA, Đuổi vào ca <60'.
- KPI tải TA (câu 18): Σ `don_vi` của em **điểm danh có mặt** — ghi lúc ca diễn ra, không phải lúc xếp. View `v_ta_don_vi_tuan`.
- RPC 1 nguồn: `fn_ca_bo_tro_ngay(ngay)` (ca + đơn vị + em) · `fn_ca_bo_tro_ung_vien(ca_id)` (3 list đã sắp ưu tiên §5) ·
  `fn_ca_bo_tro_xep(ca_id, loai, hoc_sinh/case, ...)` · `fn_ca_bo_tro_xac_nhan(buoi_hoc_hs_id)` · `fn_ca_bo_tro_huy(ca_id, ly_do)`.
- Chuyển tiếp: buổi bổ trợ đã xếp trước ngày go-live **không** gắn ca (ca_bo_tro_id null) — vẫn hiện ở màn loại, không tính đơn vị.

## 9. GIẢ ĐỊNH CHỜ CEO CHỐT

- **G1** Ca 30' (3 đơn vị): chỉ nhận L1; nhận tối đa 1 L1 (vì 2 L1 = 4 > 3)? Hay cho 3 L1 vì "1 L1 = 30' thật" trùng đúng ca 30'? *T nghiêng: 1 L1/ca 30' theo đúng phép đơn vị.*
- **G2** Ưu tiên trong Bù (§5) — CEO chưa nói.
- **G3** 2 TA = **1 dòng lịch trực có 2 người** (12 đơn vị, cùng phòng) — không phải 2 dòng.
- **G4** Bù/Đuổi vào ca trực **khối** nào: theo khối của em (7K1 bù chung ca khối 7 với 7A) — bậc không xét.

## 10. THỨ TỰ LÀM (đề xuất, sau khi CEO duyệt mockup)

1. Menu gom 5 sub-tab (không đổi logic) + Lịch trực thêm số TA.
2. DB `ca_bo_tro` + đơn vị + PH xác nhận + chặn phòng/đơn vị (test trong transaction rollback trước).
3. Sub-tab **Lịch phòng**: ngày → ca → popup 3 tab — xếp **Yếu** trước (đã có ưu tiên + case), rồi Bù, rồi Đuổi.
4. Gỡ form xếp tay 3 loại (chỉ còn đường qua Lịch phòng) + gỡ tab "Ca bổ trợ" của Yếu.
5. KPI tải TA.
