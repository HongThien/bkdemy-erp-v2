# BỔ TRỢ — tài liệu tổng (hiện trạng 13/11/2026)

> **Đọc file này TRƯỚC khi sửa bất cứ gì thuộc luồng bổ trợ.** Đây là bản HIỆN TRẠNG — chỉ ghi luật đang có hiệu lực.
> Viết lại sạch ngày 13/11 theo lệnh Thùy ("cái nào outdate rồi bỏ đi"): mọi mục cũ đã bị thay (MCQ tuyệt đối, Duyệt 2 vòng + Chốt tuần,
> danh sách Theo dõi, thang L1–L3 cũ, luật dạng yếu 2 cửa sổ, cụm bài, retest tầng 2…) đã bị BỎ khỏi file. Lịch sử từng quyết định:
> `DEVLOG.md` theo ngày + bản cũ của file này trong git (`git log -p spec-bo-tro.md`). Code/DB là chân lý runtime; file này là bản đồ.

---

## 0. Các loại bổ trợ

| Loại | Kích hoạt | `buoi_hoc.loai` | Ai đứng | Màn ERP (Bổ trợ › …) |
|---|---|---|---|---|
| **Yếu — ca khối** (L2 · L3) | Trưởng khối chốt → trưởng bộ môn duyệt | `bo_tro_yeu` | TA trực ca khối | Yếu · Lịch phòng |
| **Sau giờ** (L1) | như trên, mức L1 | `bo_tro_nhe` | GV/OPS mở + in, TA nhập | Sau giờ |
| **Riêng với GV** (L4) | như trên, mức L4 | — (xếp tay, ngoài khối) | GV | — |
| **Bù** | HS nghỉ buổi thường | `bu` | TA | Bù · Lịch phòng |
| **Đuổi** | HS vào lớp giữa chừng | `bo_tro_duoi` | TA | Đuổi · Lịch phòng |
| **Hình** | Trang/Lộc mở tay | `bo_tro_hinh` | TA/GV | Hình · Lịch phòng |
| **Ôn thi** | Đợt ôn mỗi kỳ thi | `bo_tro_on_thi` | TA | Ôn thi |

- Hub **Bổ trợ** (Vận hành, quyền `botro`): Dashboard · Đuổi · Bù · Sau giờ · Yếu · Hình · Ôn thi · Lịch phòng · Lịch khối.
- App HS: box "Bổ trợ" = lịch sắp tới mọi loại (`fn_hs_lich_bo_tro`). App TA: mỗi loại 1 ô ca, 1 hàm nguồn (§9).

---

## 1. MỘT LUẬT ĐO — dạng yếu / nhóm yếu (Thùy 13/11)

- **Nguồn duy nhất = mastery theo LẦN** (`_mastery_lan_cap_nhanh`, đọc bảng chụp `mastery_luu_san`): 1 lần = 1 bài làm, TB % 5 lần gần nhất,
  mức `yeu` / `can_luyen` / `dat` ở cả 2 cấp **nhóm bài** (chính) và **dạng** (phụ). Công tắc `mastery_theo_lan` đang BẬT.
- **Dạng yếu = dạng có mức `yeu`.** Nhóm yếu = nhóm có mức `yeu`. Hai số đếm độc lập trên cùng một nguồn — nhóm yếu không suy ra từ dạng yếu
  và ngược lại (nhóm gộp mọi lần của các dạng trong nhóm). **ĐÃ BỎ luật "2 cửa sổ"** (dạng chưa đạt trong nhóm yếu + có đo trong 2 nửa tháng
  gần nhất) — mig `202611131539`.
- Mọi chỗ đếm "dạng yếu" đi qua `_btyeu_dang_theo_nhom` (giữ tên + chữ ký cũ, thân = luật trên): Dashboard học tập, QLCL (`dang_yeu_hien_tai`,
  làm mới nền `_qlcl_lam_moi_nen`), chụp KPI báo cáo tuần (`_dang_yeu_tai_lo`), đổ dạng vào case yếu, "+N dạng yếu mới", popup chốt.
  Số đã chụp/đóng băng trước 13/11 giữ nguyên (lịch sử).
- "Đo đi theo câu": số đo quy về dạng HIỆN TẠI của câu (`_do_o_bdm`). Câu thiếu hình không vào bài nào (`_kho_dk_du_hinh_sql`).
- Bản đồ mới 4 tầng **không có cụm** — mọi đường bổ trợ của bản đồ mới luyện "cả dạng".

## 2. Quyết định bổ trợ — Phòng làm việc (trưởng khối → trưởng bộ môn)

- **Trưởng khối** (Phòng làm việc › Chất lượng): Dashboard học tập (ô = TB 5 lần gần nhất; cột **Nhóm yếu · x dạng**; 🚨 báo động GV/TA 30 ngày;
  cột **Bổ trợ**) → bấm **Bổ trợ** ⇒ popup `BoTroPopup`:
  - 5 nhóm % thấp nhất (mở rộng được ra mọi nhóm đã đo), nhóm YẾU tick sẵn; mỗi nhóm có nút **"dạng ▾"** xổ từng dạng: Yếu / Cần luyện / Đạt /
    Chưa đo + % + số lần đo (`fn_btk_dang_nhom`). Dòng đầu: "N nhóm yếu · M dạng yếu (K trong nhóm yếu)" — cùng luật §1 (`fn_btk_goi_y`).
  - chọn **mức L1–L4** (§3) + ưu tiên Cao/Thường/Thấp + ghi chú ⇒ Lưu = dòng **nháp** `bo_tro_de_xuat` (1 em × 1 môn 1 dòng sống).
- **Danh sách bổ trợ:** trưởng khối **Chốt & gửi** cả khối ⇒ chờ duyệt. **Trưởng bộ môn** Duyệt / Trả lại (bắt buộc lý do). Log `bo_tro_de_xuat_log` (trigger).
- **Duyệt** (`fn_btk_duyet` = kiểm quyền TBM + `_btk_duyet_chay`): ghi `hs_level` + `hs_level_log`; L1 ⇒ vào hàng chờ Sau giờ (không mở case khối,
  không kiểm trần); L2–L4 ⇒ kiểm trần 70 em / 20 Cao (`fn_btyeu_kiem_suc_chua`) rồi mở/gộp case `bo_tro_yeu` + đổ dạng ("nhóm quyết, dạng thực
  thi": mọi dạng đã đo chưa đạt của các nhóm tick; nhóm mà mọi dạng đạt ⇒ dạng thấp nhất).
- Quyền: trưởng khối = `_trong_pham_vi(môn, khối)` (`_btk_la_tk`); trưởng bộ môn = `fn_phong_che_do()='tbm'` + phạm vi (`_btk_la_tbm`).

## 3. Thang mức L1–L4

| Mức | Nghĩa | Ca bổ trợ khối | Đơn vị / ca (`_ca_bo_tro_don_vi`) | Trần tuần |
|---|---|---|---|---|
| L0 | dừng bổ trợ (không có dòng `hs_level`) | — | — | — |
| **L1** | **Sau giờ** (§5) | KHÔNG | 1 (chỉ khi lỡ gắn ca) | 1 ca sau giờ / tuần |
| **L2** | ca khối 2 đơn vị | CÓ | **2** | **2 đơn vị / tuần** |
| **L3** | ca khối 4 đơn vị | CÓ | **4** | **4 đơn vị / tuần** |
| **L4** | riêng với GV, ngoài khối | KHÔNG | 4 (chỉ khi lỡ gắn ca) | — |

- **Hiện tại mọi ca bổ trợ khối tính L2** (Thùy 13/11): 14 em L3 đã chuyển về L2 (mig `202611121850`, log nguồn `thang_l2_hien_tai_12_11`).
- Trần tuần (mig `202611121846`, `_btyeu_dv_tuan`): tuần = thứ Hai–CN theo ngày ca; đếm buổi `bo_tro_yeu` gắn ca khối, không huỷ, em không vắng.
  Đủ trần ⇒ không hiện ứng viên, `fn_ca_bo_tro_xep` chặn. Bù/đuổi không đếm. CHECK `buoi_hoc_hs.don_vi` ∈ (1, 2, 4).
- **Đổi mức:** ở card Xếp / Trạng thái ca: `fn_btyeu_doi_level` (0–4; L0 = đóng case `ket_qua 'bo'`). Ở Sau giờ: **Đổi mức → L2/L3/L4**
  (`fn_btnhe_doi_muc`, §5) đi đúng đường chốt (đề xuất + duyệt, log). Log `hs_level_log` trước 11/11 dùng số CŨ (2 = buổi riêng TA, 3 = buổi riêng GV).

## 4. Bổ trợ yếu — ca khối (L2 · L3)

- **Case** `bo_tro_yeu` (`dang_xu` → `hoan_thanh`), dạng `bo_tro_yeu_dang` (nguồn duyet · tay · may · bao_dong). 1 case tối đa 1 buổi chờ học (trigger).
- **Báo động** chuông GV/TA khi em đang có case cùng môn ⇒ add thẳng dạng vào case (`trg_btyeu_bao_dong_vao_case`).
- **Xếp lịch (Lộc)** ở Lịch phòng theo ca trực khối (`lich_truc_bo_tro`: môn × khối × bậc × thứ × giờ × người trực). Ca đầy khi hết **suất**
  (3 suất/TA; S = 0,5 · A = 0,75 · B/C = 1) HOẶC hết **đơn vị** (30′ × 1 TA = 3). Ứng viên `fn_ca_bo_tro_ung_vien` chỉ case L2 · L3. "+ Xếp" = đã chốt PH.
- **Capacity khối** (`fn_btyeu_capacity_khoi`) = 0,4 × Σ đơn vị lịch trực của khối; đã dùng = case L2 · L3 đang mở. Chỉ hiển thị, không chặn.
- **Ca diễn ra** (app TA `CaBoTroTA`): 📱 app hoặc 📄 giấy. Luyện ≠ test cuối ca (khác mã + khác đề). **Chọn câu:** MCQ trước; dạng 0 MCQ ⇒ câu trả lời
  ngắn có đáp án (`_btyeu_chon_cau`, `_kho_dk_mcq_sql`). Test cuối ca (`bo_tro_test`) tính mastery kênh ET; luyện không tính.
- **Kết thúc:** TA **Hoàn tất ca** ⇒ case `day_xong` ngay (1 tuần bổ trợ 1 lần, kể cả còn dạng chưa dạy — tuần sau trưởng khối chốt lại).
  Case sống tối đa 14 ngày (`fn_btyeu_het_han_xu_ly`, `ket_qua 'het_han'`). Ca đã xếp mà không diễn ra ⇒ tự huỷ buổi, case về Cần xếp.

## 5. Bổ trợ sau giờ (L1) — `BoTroNheScreen`

- **Hàng chờ:** em có đề xuất MỚI NHẤT = L1 đã duyệt, chưa có ca sau giờ tuần này (`fn_btnhe_cho`). Subtab **Chờ khởi tạo** (theo lớp) ·
  **Đã khởi tạo**. **1 lần / em / tuần**; lớp đã khởi tạo tuần này rời danh sách. Vắng không bù, không suất, không qua Lộc.
- **Khởi tạo** (`fn_btnhe_tao`): chọn lớp → em đã duyệt → buổi học 14 ngày tới (ca bắt đầu lúc buổi tan, cùng phòng, 20/25′) → TA cùng làm.
  Xong mở **ảnh thông báo PH** (mỗi em 1 dòng). Huỷ ca được; ca huỷ ẩn (nút "xem ca đã huỷ").
- **Dạng của em = dạng YẾU trong đúng các nhóm GV đã chốt** (lượt chốt mới nhất; nhóm chốt không có dạng yếu ⇒ 1 dạng chưa đạt điểm thấp nhất
  của nhóm; không có lượt chốt ⇒ không có dạng) — `_btnhe_dang_chot` (mig `202611131528`), đổ vào case `nguon='nhe'` (`fn_btnhe_fill_dang`).
- **Tài liệu — 3 thứ IN RIÊNG**, người in chọn (nút 📘 ✏️ 📝 trên từng em + 🖨 **In cả lớp · bài test**):
  📘 lý thuyết + ví dụ từng dạng · ✏️ bài luyện · 📝 bài test (1 câu/dạng, **tối đa 10 câu**).
  - **Builder** (`SoanBaiSauGio`, dùng `KhoiCau` + `ChonCauBdm` của builder giáo trình: dòng · cột · chế độ hình · cỡ ảnh): **TỰ LƯU** 1,2 s sau
    mỗi lần chỉnh ("✓ Đã lưu HH:MM"); 🖨 In = in bản đã lưu. Mỗi buổi **1 bài luyện + 1 bài test**, sửa được tới khi có kết quả.
    In cả lớp in đúng bản đã lưu của từng em (em chưa soạn ⇒ DB sinh theo dạng §5).
  - **Bản in = khuôn ET** (`InSauGioET` → `ETPrintView` `deRieng`): header ET, "Câu 1, Câu 2…", bản HS / bản GV (GV có tên em + đáp án + lời giải).
    Câu trả lời ngắn: mặc định bảng ô điền; đặt số dòng > 0 ⇒ in dòng kẻ như tự luận.
- **Chọn câu:** cấp 1–2 (khối 3–9): tự luận + trả lời ngắn NGANG HÀNG, hết mới trắc nghiệm; **không hiện form trắc nghiệm** của câu TL/TLN
  (cờ giao dịch `bk.snap_khong_form`). Cấp 3 (10–12): trắc nghiệm trước. Hàm `_btnhe_chon_cau` / `_btnhe_chon_loai`.
- **Nhập kết quả:** TA (app TA ô **Bổ trợ sau giờ**, `SauGioNhapTA`) nhập **Đ / C / S** từng câu (`fn_btnhe_nhap_dcs`), không cần mở ca.
  Nộp ⇒ em có mặt + ca xong (`nhe_xong / day_xong`); test = mastery kênh ET.
- **Đổi mức** L1 → L2/L3/L4 ngay trên hàng chờ / thẻ ca (`fn_btnhe_doi_muc`); ca đã tạo không tự huỷ, thẻ hiện "Đã chuyển Lx".
- **Chấm công TA:** ca sau giờ = đầu việc mặc định của TA phụ trách ca (loại việc `bo_tro_sau_gio`, tính vào giờ bổ trợ) — gợi ý `fn_ta_hom_nay`,
  thiếu công `_ta_buoi_thieu_cong`, đối chiếu `_ta_doi_chieu`.
- **Dashboard / chi tiết** riêng như Yếu (`BoTroDashboardScreen` dòng Sau giờ, `KetQuaBoTroTuan`).

## 6. Bù · Đuổi · Hình · Ôn thi (tóm)

- **Bù:** HS nghỉ buổi thường ⇒ xếp ca bù ở Lịch phòng (4 đơn vị/em khi xếp; bảng Lấp đầy tính theo nhóm cùng bài 1 em = 4, ≥2 em = 6).
  Chọn câu luyện/test bù: MCQ trước, 0 MCQ ⇒ trả lời ngắn (`tu_luyen_chu_de_sinh` loại `bu_luyen`/`bu_test`). Đóng ET buổi bù KHÔNG đổi `trang_thai`.
- **Đuổi:** mục tiêu = dạng GV chọn (`bo_tro_duoi_dang`); HS tự học ở nhà (lý thuyết → luyện → test, ≥50% xong dạng), TA làm cùng phần dở;
  1 nguồn tiến trình `fn_duoi_tien_trinh`; khoá tuần tự theo bản đồ mới (K6–12).
- **Hình** (`bo_tro_hinh`): case HS × đợt, Trang/Lộc mở tay; xếp như ca khối (thang đơn vị riêng của Hình); tài liệu gắn theo buổi; không test;
  hoàn tất 1 buổi là xong. Trần 70/20 tính gộp Yếu + Hình.
- **Ôn thi:** đợt ôn mỗi kỳ, Trang thêm em tay, ngoài hệ case, không đo; TA điểm danh + báo động; công TA ngoài gói (chờ đơn giá).

## 7. Dashboard bổ trợ (3 subtab)

- **Tiến độ** (`fn_bo_tro_dashboard_tuan`): mỗi tuần × loại: đã chạy / chốt + **📊 Kết quả** (`fn_botro_ket_qua_tuan`: "Giảm" = dạng Yếu trước ca
  (00:00 ngày ca) mà sau ca (hết ngày ca) không còn Yếu).
- **Lấp đầy ca** (`fn_botro_lap_day_ca`): % theo HS và % theo đơn vị. **Chi tiết** (`fn_botro_chi_tiet`): 1 buổi = 1 dòng, lọc + tìm không dấu.

## 8. Quy ước bắt buộc

- Mọi số + luật ở DB (`fn_*`), màn chỉ vẽ (CLAUDE.md §2.0). Sau mutation **vá tại chỗ**, không tải lại danh sách; màn hàng đợi nhớ trạng thái
  ở module-level (`NHO`). Ô ca trên app TA: hôm nay trước, không cắt ca hôm nay, lỗi tải hiện banner đỏ (không nuốt).
- Tự kiểm hiển thị: `fn_bo_tro_tu_kiem` (TA/HS có thấy ca) + `fn_btyeu_kiem_ca_hs` (ca HS dựng được) — dải đỏ ở Lịch phòng.

## 9. Bản đồ code / DB

- **Lib:** `boTroTk.ts` (đề xuất/duyệt/popup) · `botro_yeu.ts` / `botro_yeu_ca.ts` (case, ca, in giấy) · `botro_nhe.ts` (sau giờ) · `botro_dashboard.ts`.
- **Màn:** `phongtk/BoTroPopup.tsx`, `phongtk/ChatLuongPhong.tsx` · `botro/` (BoTroNheScreen, SoanBaiSauGio, NutInSauGio, InSauGioET,
  ThongBaoSauGioAnh, LichPhongScreen, BoTroDashboardScreen, KetQuaBoTroTuan, ChiTietBoTro, MucUuTienCase) · `danhgia/XepLichBoTroYeuScreen`,
  `TrangThaiCaBoTroScreen` · app TA `ta/CaBoTroTA.tsx`, `SauGioCa.tsx`, `SauGioNhapTA.tsx`, `PhieuGiayYeuTA.tsx` · app HS `hocsinh/CaBoTroHS.tsx`.
- **Bảng:** `bo_tro_de_xuat`(+log) · `bo_tro_yeu` · `bo_tro_yeu_dang` · `hs_level` / `hs_level_log` · `lich_truc_bo_tro` · `ca_bo_tro` · `ca_bo_tro_nhe` ·
  `buoi_hoc` / `buoi_hoc_hs` (`don_vi`, `btyeu_che_do`) · `bai_test` (`cau_hinh_in`, `in_giay_at`) / `bai_test_cau` / `bai_lam` / `bai_lam_cau` ·
  `mastery_luu_san` · `dang_yeu_hien_tai`.

## 10. Logic cũ còn trong code, MÂU THUẪN với hiện trạng — chờ Thùy gật để gỡ (Luật xoá)

Thùy 13/11: "Bỏ hết những logic trước đây mâu thuẫn với hiện tại". Danh sách dưới đây còn CHẠY hoặc còn nằm trong code; gỡ cần gật từng mục:

1. ✅ **ĐÃ BỎ 13/11 — danh sách "Theo dõi" + Duyệt 2 vòng** (mig `202611131554`): hoàn tất ca / hết hạn 14 ngày thôi ghi `bo_tro_theo_doi`
   (`_btyeu_vao_theo_doi_sau_case` = no-op); 30 em đang theo dõi kết thúc `go`. Bảng + màn `DuyetBoTroYeuScreen` (ẩn; `WidgetDangYeu` còn mượn khối
   ET/BTVN) + `fn_botro_chot_tuan` / `danh_sach_tuan` / `theo_doi_*` giữ làm lịch sử, không còn đường nào ghi.
2. ✅ **ĐÃ BỎ 13/11 — retest tầng 2**: công tắc `_btyeu_retest_bat()` / `RETEST_BAT` giữ `false` vĩnh viễn (mọi nhánh retest trong DB + app tắt theo nó);
   25 bài retest treo đã đóng `dong`. Muốn có lại retest = thiết kế mới, không bật công tắc cũ.
3. **Hình theo mô hình** (§20–21 cũ, ẩn từ 17/10): `fn_hinh_yeu_theo_mo_hinh`, `HinhYeuTA`, tab "Hình yếu".
4. **Màn Nội dung bổ trợ yếu / Đánh giá ca bổ trợ** (bước ③ ⑦ cũ — dạng nay đổ lúc duyệt, đánh giá là việc học thuật).
5. ✅ **ĐÃ SỬA 13/11 — đếm dạng sau giờ** (mig `202611131609`): hàng chờ · form khởi tạo · tô em · số dạng lúc duyệt L1 đều đếm từ `_btnhe_dang_chot`
   (cùng nguồn bài in). `_sau_gio_dang` không còn ai gọi (giữ hàm).
6. **Luật trần 70 em / 20 Cao** vẫn đếm mọi case kể cả L1/L4 — chờ Thùy: L1 sau giờ / L4 riêng GV có tính vào trần không.
7. **Bù theo nhóm cùng bài** chỉ áp ở bảng Lấp đầy; xếp ở Lịch phòng vẫn 4/em — chờ Thùy quyết có đổi luật xếp không.

## 41. Cập nhật 14/11 — LUẬT ĐƠN VỊ BÙ THEO NHÓM ĐÃ VÀO LỊCH PHÒNG (đóng "chưa đổi" của §40)

- **Thùy 14/11 (ảnh Lịch phòng "8/6 · LỐ": 2 em 7B1 cùng nghỉ 08/11 xếp chung 1 ca):** "học bù cùng lớp cùng buổi thì giảm đơn vị — 1 người 4, 2 người 3 (mỗi người), 3 người 2 (mỗi người)". Tổng nhóm: 4 · 6 · 6. Nhóm = cùng ca + cùng buổi gốc (`buoi_hoc_hs.bu_cho_buoi_id`). 4 em trở lên chưa có luật — tạm 2/em.
- **Làm (mig `202611140851_bu_nhom_don_vi_luat_xep` + `202611140855_bu_nhom_thu_quyen_ham_noi_bo`):** (1) nới CHECK `buoi_hoc_hs.don_vi` thêm giá trị 3; (2) hàm `_ca_bo_tro_dv_bu_moi_em/_nhom/_n_bu/_dv_them_bu` + `_ca_bo_tro_cap_nhat_dv_bu(ca)`; (3) **trigger tính lại đơn vị LƯU của cả nhóm** khi nhóm đổi: em vào (insert) · gỡ (delete) · điểm danh vắng/khôi phục · buổi huỷ hoặc đổi ca — em **vắng không tính vào nhóm** (cùng cách `_ca_bo_tro_tinh` vốn loại vắng); (4) `fn_ca_bo_tro_xep` chặn theo **PHẦN TĂNG THÊM** của ca (em thứ 2 cùng bài +2, em thứ 3 +0) và ghi đơn vị đúng cỡ nhóm; (5) `fn_ca_bo_tro_ung_vien`: ứng viên bù hiện `don_vi` theo nhóm + `them_dv` (phần tăng), `vua` theo phần tăng; (6) làm lại đơn vị đã lưu: 5 nhóm 2 em (10 dòng) 4 → 3, **bản cũ trong `bu_dv_cu_20261114`** (hoàn lại: `update buoi_hoc_hs h set don_vi = c.don_vi_cu from bu_dv_cu_20261114 c where c.hh_id = h.id`).
- **Quyền:** các hàm nội bộ KHÔNG mở cho `authenticated` (K1/K14, `check:kien-truc` ✔); chỉ chạy từ bên trong `fn_ca_bo_tro_xep/ung_vien/go` (secdef có cổng) hoặc trigger (secdef).
- **Kiểm (dry-run ROLLBACK, ca K8 trống ngày 16/11, 3 em cùng lớp cùng buổi nghỉ):** xếp em 1 → 4 (ca 4/6) · em 2 → 3+3 (6/6, KHÔNG lố) · ứng viên em 3: `don_vi 2 · them_dv 0 · vua` · em 3 → 2+2+2 (6/6) · em 3 vắng → 3+3 · hết vắng → 2+2+2 · gỡ em 3 → 3+3 · gỡ em 2 → em 1 về 4. Ca trong ảnh Thùy (K7 14/11 16:00: Nam Sơn + Bảo Nhi) giờ 3+3 = 6/6.
- **Còn lệch nhỏ:** bảng Lấp đầy ca (§40) tính nhóm ≥2 em = 6 cố định, còn engine = 2×n cho n ≥ 3 (n=4 → 8). Khi Thùy chốt luật cho nhóm 4+ em thì sửa cả hai. Dashboard "Đã xếp" cộng cả buổi vắng, Lịch phòng loại vắng khỏi đơn vị đã dùng.
