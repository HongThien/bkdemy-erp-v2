# Đơn đặt hàng — NỀN ẢNH VINH DANH HỌC SINH THÁNG (đăng Facebook)

> **11/11/2026** — Thùy giao: mỗi tháng làm ảnh vinh danh HS theo 3 loại **Xuất sắc · Tiến bộ · Học sinh tiêu biểu**.
> Mỗi ảnh: ảnh HS · tên · lớp · tên kì thi · **xếp hạng lớp · xếp hạng khối** · kết quả học tập = **% mastery các dạng được đo trong 30 ngày**
> (luật mastery hiện hành) + **điểm test tháng**. Ảnh cuối đăng Facebook.
> Cách làm: **ChatGPT vẽ NỀN** (nhiều bộ để thay đổi theo tháng) → **Claude ghép** ảnh HS + chữ + số bằng code từ dữ liệu ERP → xuất PNG.
> Đơn soạn theo `design/CHATGPT-UI-KIT.md` (ChatGPT tạo ảnh phẳng, mọi CHỮ/SỐ là code) — riêng đơn này là **poster cố định khổ**, không phải màn app,
> nên nền ĐƯỢC chứa sẵn khung ảnh + băng tên trống (code không vẽ đẹp được khung trang trí), miễn **không có một chữ / một số nào**.

## ✅ ĐÃ DỰNG 11/11
- 9 nền về đủ (zip `BK_Academy_9_tranh_nen.zip`, 1120×1400): gốc `design/bk-ui-src/vinh-danh/goc-9-tranh/` (không lên git) · nén `public/bk-ui/vinhdanh/vd_<phong cách>_<loại>.jpg` 1080×1350.
- Số liệu: `fn_vinh_danh_hs` (mig 202611111437, đã áp). Khung ghép: `src/screens/traogiai/vinhDanhFB.ts` (khoá xanh flood-fill từ tâm lỗ, tên trên băng, thẻ 4 ô).
- Màn Trao giải › tab Đã chốt giải: chọn "Nền ảnh FB" + nút **🏅 Làm ảnh** từng dòng ⇒ xem + tải PNG. Chăm chỉ chưa có nền; Tiêu biểu chưa có bảng chọn.
- 11/11 chiều: thêm 6 mẫu **Thanh lịch** (zip `BK_Academy_Thanh_lich_6_mau.zip`, gốc `goc-thanh-lich/`) — 1 tranh dùng cho MỌI loại giải (`vd_tl_<tên>.jpg`), màu loại giải chỉ ở thẻ kết quả. Thêm mẫu = 1 dòng trong `BO_NEN` (vinhDanhFB.ts).
- Ảnh HS: ô 📷 ở cột Ảnh FB tải ảnh chân dung lên (bucket avatars/chan-dung, bảng `hoc_sinh_anh_chan_dung` — mig 202611111622 đã áp). KHÔNG đè `hoc_sinh.anh_url` (avatar app em tự chọn). Ghép ưu tiên chân dung, không có mới dùng avatar app.
- **Học sinh xuất sắc nhất khối** (= "Tiêu biểu" cũ): subtab "XS nhất khối" ở Trao giải — mỗi môn × khối chọn tay 1 em trong số giải Xuất sắc của các lớp trong khối; bảng `giai_thuong_xs_khoi` + log, hàm `fn_traogiai_xs_khoi`/`_chon`/`_bo` (mig 202611111630 đã áp; không đặt FK tới giai_thuong vì thiếu quyền REFERENCES ⇒ hàm đọc chỉ nhận lượt chọn còn trỏ tới giải Xuất sắc đang tồn tại). Ảnh FB dùng nền loại tieu_bieu, tiêu đề "HỌC SINH XUẤT SẮC NHẤT KHỐI <khối>".
- Tiêu đề loại giải đặt TRONG thẻ kết quả (đầu ảnh vướng vương miện/ngôi sao/pha lê của nền).

---

## 1. Hợp đồng bố cục (mọi nền đều theo — để 1 template code dùng được cho mọi nền)

Khổ **dọc 4:5** (Facebook feed hiển thị trọn, không bị cắt). Ảnh xuất **1080×1350** (bản nét 2160×2700).
Toạ độ theo % bề ngang (W) / chiều cao (H):

| Vùng | Vị trí | Nền vẽ gì | Code đè gì |
|---|---|---|---|
| A. Đầu | 0–17% H | thoáng, chỉ trang trí nhẹ 2 góc | logo BK Academy · tiêu đề "VINH DANH HỌC SINH XUẤT SẮC" · "Tháng 10/2026 · Toán" |
| B. Khung ảnh | tâm 50% W · 38% H; lỗ rộng ≈40% W, cao ≈36% H (đứng, vòm/oval) | **khung trang trí + LỖ tô phẳng xanh lá `#00FF00`** | ảnh HS hiện qua lỗ (code khoá màu xanh ⇒ ảnh khớp đúng hình lỗ, nền nào cũng được) |
| C. Băng tên | ngay dưới khung, 56–65% H, rộng ≈72% W | ruy băng / tấm biển **trống chữ** | tên HS (to) · lớp |
| D. Bảng kết quả | 67–92% H, rộng ≈86% W | **vùng dịu, sáng, ít chi tiết** (không vẽ bảng) | thẻ kính mờ 4 ô: Hạng lớp · Hạng khối · Mastery % · Điểm test + tên kì thi |
| E. Chân | 93–100% H | trang trí nhẹ | câu chốt / hotline |

Claude đo lại từng nền sau khi về (lỗ xanh đo tự động; băng tên đo bằng mắt) và ghi vào bảng cấu hình nền — nên ChatGPT lệch vài % vẫn dùng được.

## 2. Danh mục nền — đợt 1: 3 phong cách × 3 loại = 9 nền

Màu + biểu tượng theo **loại** (giữ xuyên suốt mọi phong cách để PH nhìn màu là biết giải):

| Loại | Màu chủ | Biểu tượng |
|---|---|---|
| Xuất sắc | vàng gold + xanh navy | vương miện, cúp, nguyệt quế, tia sáng |
| Tiến bộ | xanh ngọc + xanh dương | mũi tên đi lên, bậc thang, tên lửa nhỏ, cầu vồng |
| Học sinh tiêu biểu | đỏ ruby + hồng tím | ngôi sao lớn, huy chương, pháo giấy |

| # | Tên file | Phong cách | Loại |
|---|---|---|---|
| 01 | `vd_hoanggia_xuatsac` | **Hoàng gia** — nhũ vàng, nền ngà/navy, nguyệt quế, ánh sáng toả | Xuất sắc |
| 02 | `vd_hoanggia_tienbo` | Hoàng gia | Tiến bộ |
| 03 | `vd_hoanggia_tieubieu` | Hoàng gia | Tiêu biểu |
| 04 | `vd_pastel_xuatsac` | **Pastel 3D tươi** — mây 3D, bóng bay, sao, sách, pháo giấy | Xuất sắc |
| 05 | `vd_pastel_tienbo` | Pastel 3D | Tiến bộ |
| 06 | `vd_pastel_tieubieu` | Pastel 3D | Tiêu biểu |
| 07 | `vd_phieuluu_xuatsac` | **Phiêu lưu anime** (cùng thế giới app HS "Giải cứu thế giới") — vòng phép, pha lê, lâu đài xa | Xuất sắc |
| 08 | `vd_phieuluu_tienbo` | Phiêu lưu anime | Tiến bộ |
| 09 | `vd_phieuluu_tieubieu` | Phiêu lưu anime | Tiêu biểu |

**Đợt 2 (theo mùa, đặt sau khi đợt 1 chạy):** 20/11 Nhà giáo · Noel · Tết · Hè — mỗi mùa 3 nền (3 loại), cùng hợp đồng bố cục.

---

## 3. CÁCH GỬI (Thùy)

ChatGPT · **1 context mới** · dán nguyên khối dưới · đính kèm `public/Logo.png` (để nó biết tông màu thương hiệu, KHÔNG vẽ logo vào nền).
Mỗi lượt 1 hình. **#01 có thêm 1 ảnh mẫu có chữ (01-mau) để duyệt hình dung** — duyệt xong mới vẽ tiếp.
Tải về để vào `design/bk-ui-src/vinh-danh/` (đừng để vào `public/`) — báo Claude.

```
Tôi cần bộ TRANH NỀN cho ảnh "Vinh danh học sinh của tháng" của một trung tâm dạy học ở Việt Nam (BK Academy),
ảnh sẽ đăng Facebook. Ảnh học sinh, tên, số liệu sẽ được lập trình viên ghép lên SAU bằng code — bạn CHỈ vẽ NỀN.
MỖI LƯỢT ĐÚNG 1 HÌNH, dòng đầu ghi số + tên file. Vẽ xong DỪNG chờ tôi gõ "tiếp".

LUẬT CHUNG (mọi hình):
- Khổ DỌC 4:5, độ phân giải LỚN NHẤT bạn vẽ được. Nếu công cụ chỉ ra được 2:3 thì vẽ 2:3 nhưng giữ mọi chi tiết quan trọng
  trong khung 4:5 ở giữa (cắt đều trên-dưới mỗi bên ~8%). Ảnh đặc, không trong suốt.
- TUYỆT ĐỐI KHÔNG CÓ CHỮ, SỐ, LOGO, CHỮ KÝ, WATERMARK, ngôi sao lấp lánh dấu bản quyền ở góc. Cả trên ruy băng, cúp, huy chương
  cũng KHÔNG có chữ/số. Thấy 1 chữ cái là hình hỏng.
- KHÔNG vẽ người, không vẽ học sinh, không vẽ khuôn mặt.
- BỐ CỤC CỐ ĐỊNH (theo % chiều ngang W, chiều cao H của ảnh):
  · 0–17% H (đầu ảnh): để THOÁNG, chỉ trang trí nhẹ ở 2 góc — chỗ này sẽ đặt tiêu đề lớn.
  · KHUNG ẢNH: tâm ở giữa ngang, cao 38% H. Khung trang trí đẹp (vòm hoặc oval ĐỨNG) bao quanh một LỖ rộng ~40% W, cao ~36% H.
    LỖ PHẢI TÔ PHẲNG MỘT MÀU XANH LÁ #00FF00 tuyệt đối đồng nhất (không bóng, không vân, không phản chiếu) — ảnh học sinh sẽ
    hiện qua lỗ này. Trang trí (lá nguyệt quế, ruy băng, ngôi sao…) được phép đè lên viền khung nhưng KHÔNG lấn vào lỗ.
  · BĂNG TÊN: ngay dưới khung, 56–65% H, rộng ~72% W — một ruy băng hoặc tấm biển nằm ngang, mặt TRỐNG, màu đủ đậm hoặc đủ sáng
    để chữ đặt lên đọc rõ.
  · 67–92% H: vùng DỊU, sáng, ít chi tiết (nền mờ/nhạt dần) — chỗ này sẽ đặt bảng kết quả. KHÔNG vẽ bảng, ô hay khung ở đây.
  · 93–100% H: trang trí nhẹ ở chân.
  · Chi tiết đẹp nhất dồn vào: quanh khung ảnh, 2 mép trái-phải, 2 góc trên.
- Màu theo LOẠI GIẢI (giữ đúng ở mọi phong cách):
  · XUẤT SẮC = vàng gold + xanh navy; biểu tượng vương miện, cúp, nguyệt quế, tia sáng.
  · TIẾN BỘ = xanh ngọc + xanh dương; biểu tượng mũi tên đi lên, bậc thang, tên lửa nhỏ, cầu vồng.
  · HỌC SINH TIÊU BIỂU = đỏ ruby + hồng tím; biểu tượng ngôi sao lớn, huy chương, pháo giấy.
- Cùng một PHONG CÁCH thì 3 loại giải phải cùng bố cục, cùng nét vẽ — chỉ đổi màu và biểu tượng.

#01-mau — (CHỈ để tôi duyệt hình dung, không dùng thật) phong cách HOÀNG GIA, loại XUẤT SẮC, có ghép thử nội dung mẫu:
    tiêu đề "VINH DANH HỌC SINH XUẤT SẮC" + "Tháng 10/2026 · Toán" ở đầu; trong lỗ khung là bóng người mờ; băng tên ghi
    "Nguyễn Minh Anh · Lớp 7A1"; vùng dưới có bảng 4 ô: "Hạng lớp #1/18", "Hạng khối #3/96", "Mastery 92%", "Test tháng 9.5".
    Chữ tiếng Việt đúng dấu.                                                                        → DỪNG, chờ duyệt
#01 vd_hoanggia_xuatsac — y hệt #01-mau nhưng SẠCH: không chữ, không bảng, lỗ khung tô #00FF00.
    Phong cách HOÀNG GIA: nền ngà ấm chuyển navy ở 2 mép, hoạ tiết nhũ vàng kim loại sang trọng, vòng nguyệt quế vàng ôm khung,
    vương miện nhỏ trên đỉnh khung, tia sáng toả từ sau khung, vài hạt kim tuyến.               → DỪNG, chờ duyệt
#02 vd_hoanggia_tienbo — y hệt bố cục #01, đổi sang bảng màu + biểu tượng TIẾN BỘ (vẫn nhũ kim loại sang trọng, nhưng bạc-xanh ngọc).
#03 vd_hoanggia_tieubieu — y hệt bố cục #01, bảng màu + biểu tượng HỌC SINH TIÊU BIỂU (nhũ vàng hồng + đỏ ruby).
#04 vd_pastel_xuatsac — phong cách PASTEL 3D TƯƠI: khối 3D mềm như đất sét, mây bông, bóng bay, sao, sách mở, pháo giấy,
    ánh sáng dịu; khung ảnh như khung tranh 3D bo tròn. Màu XUẤT SẮC (vàng bơ + navy dịu).
#05 vd_pastel_tienbo — bố cục #04, màu + biểu tượng TIẾN BỘ.
#06 vd_pastel_tieubieu — bố cục #04, màu + biểu tượng HỌC SINH TIÊU BIỂU.
#07 vd_phieuluu_xuatsac — phong cách PHIÊU LƯU ANIME (thế giới game "giải cứu thế giới"): bầu trời fantasy, lâu đài nhỏ phía xa,
    đảo nổi, pha lê phát sáng; khung ảnh là VÒNG PHÉP / cổng phép đứng có ký hiệu hình học (KHÔNG chữ). Màu XUẤT SẮC.
#08 vd_phieuluu_tienbo — bố cục #07, màu + biểu tượng TIẾN BỘ.
#09 vd_phieuluu_tieubieu — bố cục #07, màu + biểu tượng HỌC SINH TIÊU BIỂU.

TỰ KIỂM trước khi gửi mỗi hình: (1) có chữ/số/logo nào không? (2) lỗ khung có đúng 1 màu #00FF00 phẳng, không bị trang trí lấn vào?
(3) băng tên có trống không? (4) vùng 67–92% H có dịu và trống không? Sai câu nào thì vẽ lại trước khi gửi.
```

**Khi bị trả** (Thùy dán):
```
#<số> <tên> bị trả lại: [lý do — vd có chữ trên ruy băng / lỗ xanh có bóng / vùng dưới quá rối].
Vẽ lại ĐÚNG hình đó, giữ bố cục và phong cách, sửa đúng lỗi trên.
```

---

## 4. Khi nền về (Claude làm)

1. Đổi tên + soi từng hình (md5 lọc trùng, mở ảnh xem — không đổi tên theo số thứ tự mù, bài học Đơn Nhiệm vụ 29/09).
2. Kiểm: không chữ · lỗ `#00FF00` đo được (tìm vùng xanh liên thông lớn nhất, ghi bbox) · khoá xanh có tolerance + khử viền xanh.
3. Cắt về 4:5 nếu ChatGPT giao 2:3 · nén JPG q88 vào `public/bk-ui/vinhdanh/` (bản gốc ở `design/bk-ui-src/vinh-danh/`, ngoài git nếu nặng).
4. Ghi bảng cấu hình nền `src/screens/traogiai/nenVinhDanh.ts`: `{ id, loai, phongCach, file, lo: {x,y,w,h}, bangTen: {x,y,w,h}, mauChu }`.
5. Template `VinhDanhFB` (khổ 1080×1350) dùng chung mọi nền: vẽ ảnh HS (căn mặt như bản 13/10) → nền đã khoá xanh → chữ/số.

## 5. Nối dữ liệu (một hàm DB, chưa build — chờ Thùy gật)

**Học sinh tiêu biểu (Thùy chốt 11/11): chọn THEO KHỐI, từ các HS đã được giải Xuất sắc của khối đó trong tháng — 1 suất, người chọn tay.**
Không phải giải cấp lớp ⇒ KHÔNG đụng slot/ngân sách lớp, không thêm `loai_giai`. Lưu riêng: bảng `giai_thuong_tieu_bieu`
(khoá `thang × mon × khoi`, trỏ `giai_thuong_id` của một giải `xuat_sac` cùng tháng–môn–khối; người chọn + lúc chọn), ô chọn trên màn Trao giải
chỉ liệt kê HS Xuất sắc đã chốt của khối. Ảnh vinh danh của em đó dùng nền "Tiêu biểu". Đơn nền đợt 1 vẽ 3 loại (Xuất sắc · Tiến bộ · Tiêu biểu);
Chăm chỉ dùng nền xanh lá nếu cần sau.

Mọi số tính ở Postgres (CLAUDE.md §2.0). Đề xuất **một hàm** `fn_vinh_danh_hs(p_hs, p_mon, p_ym) → jsonb`, ghép từ hàm đang chạy:

| Trường trên ảnh | Nguồn |
|---|---|
| Tên HS · ảnh (`anh_url`) · lớp | `hoc_sinh` + `hoc_sinh_lop` (lớp đang học của môn) |
| Loại giải | `giai_thuong` đã chốt tháng (màn Trao giải) |
| Tên kì thi | `ky_thi.ten` loại `khao_sat_thang` của môn trong tháng (qua `buoi_hoc.ngay`) |
| Điểm test tháng | `fn_ks_diem_thang(...)->'tb'` |
| Xếp hạng lớp | `fn_rank_diem_mt_lop` / `fn_rank_diem_mt` (điểm MT trong lớp) |
| Xếp hạng khối | `fn_bxh_diem_ks_khoi` (đã có trong `fn_ks_diem_thang` → `rank_now/rank_total`) |
| % mastery 30 ngày | `_mastery_lan_cap_nhanh(..., p_since = mốc − 30 ngày, p_den = mốc, caps={dang})`: **số dạng đạt / số dạng đã đo** trong 30 ngày, lọc dạng của môn. Mốc = hết ngày 10/(M+1) (đóng cửa sổ test tháng), chưa tới thì = lúc xuất ⇒ xuất lại vẫn ra đúng số. Kèm `n` dạng để ghi "23/25 dạng". |

Xuất hàng loạt: nút trong `TraoGiaiScreen` — chọn tháng + bộ nền → mỗi giải đã chốt một PNG, tải zip. Nền xoay vòng theo tháng (tháng 10 Hoàng gia, 11 Pastel…) hoặc chọn tay.
