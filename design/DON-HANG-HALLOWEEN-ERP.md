# Đơn đặt hàng — Halloween bản ERP: tranh nền "nhà ma" kiểu video (đơn E)

> **30/10/2026** — Thùy gửi video Gemini (`C:\Users\Admin\Videos\gemini_generated_video_5286c710.mp4`, 10 giây, 1280×720: nhà ma trên đồi, trăng tròn, cây chết,
> nghĩa địa, bí ngô sáng khắp nơi, dơi, ma trắng trồi từ mộ bay lượn) — *"tao muốn erp kiểu như này"* — chọn **cách 2**: dựng lại bằng TRANH TĨNH + CODE
> (không dùng thẳng video: chỗ nối vòng lặp giật mạnh — khung đầu và cuối khác nhau trung bình 26/255, ma biến mất đột ngột, máy quay nhảy; video 720p kéo giãn mờ;
> phần hay nhất — ma ở giữa khung — bị thẻ ERP che).
> **Thay cho bản đơn "kinh dị 26 hình" soạn trước đó cùng ngày** (chưa gửi đi) — giờ chuyển động đã do code làm, chỉ cần vẽ TRANH NỀN.

## ✅ ĐÃ DỰNG TRANH THẬT 30/10 (Thùy: "check đi — không cần #03, #04, thêm sau — chạy code, commit, push main")

- Về 2 tranh: **#01 ngang 1672×941** · **#02 dọc 941×1672** — sạch (không ma / dơi / dấu ✦), bố cục bản ngang gần trùng video. Gốc: `design/bk-ui-src/halloween-erp/ek_nha_ma(_doc).png`
  (sổ `_doi_ten.log.txt`, thư mục trong `.gitignore`) · nén: `public/bk-ui/erp/halloween/nha_ma_ngang.jpg` · `nha_ma_doc.jpg`.
- **Đo lại trên tranh thật:** ngang 15 bí ngô · 10 ô cửa sổ / cửa · trăng · 8 bia mộ (ma trồi) · dọc 13 bí ngô · 10 ô cửa · trăng · 6 bia mộ. Khổ dọc giờ CÓ hoạt cảnh
  (khoá `nha_ma:doc` — `HoatCanhNen` đọc `<id>:doc` khi màn dọc). Soi bằng cách tắt chuyển động + kẻ viền từng quầng: khớp đúng vật ở 1600×860 và 375×812.
- **#03 rừng chết · #04 làng bỏ hoang: để sau** (Thùy). **Cùng ngày Thùy duyệt "đẹp rồi" ⇒ Halloween ERP mở cho MỌI nhân sự** (`STYLE_RIENG_CHO = {}`).
- File tạm `public/bk-ui/erp/halloween/nha_ma.jpg` (khung đầu video) KHÔNG commit, không còn được gọi.

## Đã làm (bản thử, 30/10) — nhánh `claude/erp-halloween` trong BK_V2_1, CHƯA commit

- **Tranh tạm** = khung đầu video (chưa có ma): `public/bk-ui/erp/halloween/nha_ma.jpg` (1280×720, còn dấu sao ✦ của Gemini ở góc phải dưới).
- **Bản Halloween riêng cho ERP** `lib/erpHalloween.ts` (`BAN_ERP` trong `lib/erpSkin.ts`, cùng id `halloween` ⇒ ai đã chọn vẫn giữ; app HS vẫn bản đáng yêu; vẫn chỉ NS008 thấy):
  hình nền **Nhà ma** (mặc định) + 3 tranh cũ.
- **Chuyển động bằng code** (`skin/HoatCanhNen.tsx`, vẫn CHỈ transform + opacity — 79 chuyển động, kiểm bằng `document.getAnimations()`):
  **7 ma vải trồi từ 7 bia mộ** → lượn zíc zắc lên trời → tan → trồi lại (lặp mãi, không có chỗ nối; ma vẽ SVG nên nét ở mọi cỡ màn) ·
  **15 quả bí ngô** sáng → tắt → sáng lệch pha · **7 ô cửa sổ** nhà ma chập chờn · trăng thở · **8 con dơi** · **sương mù sát đất** 2 lớp trôi ngược chiều ·
  bé ma chính bồng bềnh. Tranh phủ khung kiểu `center` (giữ cả trăng lẫn hàng bí ngô khi màn rộng xén chiều dọc).
- Soi: trang `/xem-thu-erp.html?skin=halloween&ma=NS008` (file tạm, không commit) ở 1600×860 và 1280×760. Ảnh chụp: `design/handoff/erp-halloween-v1/reference/erp_ban_thu_nha_ma.jpg`.

## Việc của đơn: vẽ lại TRANH NỀN sắc nét, sạch

Khung đầu video chỉ 1280×720 (kéo ra màn 1600–1900 px bị mềm) và có dấu ✦ của Gemini ⇒ đặt vẽ lại **đúng cảnh đó** ở khổ lớn, sạch.

**Cách gửi:** ChatGPT (hoặc Gemini — cùng nơi đã làm video) · 1 context mới · dán khối dưới · đính kèm `design/handoff/erp-halloween-v1/reference/video_khung_dau.png`
(+ `erp_ban_thu_nha_ma.jpg` để thấy thẻ phủ chỗ nào). Mỗi lượt 1 hình, vẽ #01 xong dừng cho Thùy duyệt. Tải về `design/bk-ui-src/halloween-erp/` — báo Claude.

```
Tôi cần TRANH NỀN cho trang chính một phần mềm nội bộ, chủ đề Halloween. Ảnh đính kèm "video_khung_dau" là cảnh tôi muốn.
MỖI LƯỢT ĐÚNG 1 HÌNH, dòng đầu ghi số + tên. Vẽ xong DỪNG chờ tôi gõ "tiếp".

LUẬT CHUNG (mọi hình):
- Khổ NGANG 16:9, độ phân giải LỚN NHẤT bạn vẽ được (tối thiểu 1920×1080). Ảnh đặc (không trong suốt).
- Nét vẽ + bảng màu + ánh sáng GIỐNG ảnh đính kèm: trời tím đêm, trăng tròn trắng sáng, nhà ma cửa sổ vàng cam, cây chết trơ cành, nghĩa địa, bí ngô khoét mặt sáng cam.
- KHÔNG vẽ ma, KHÔNG vẽ dơi, KHÔNG vẽ sương bay lơ lửng (tôi tự cho chúng chuyển động bằng code — vẽ sẵn sẽ bị trùng).
- KHÔNG chữ, KHÔNG logo, KHÔNG dấu bản quyền / watermark / ngôi sao lấp lánh ở góc ảnh.
- GIỮ chỗ trống: dải giữa ảnh (25–75% bề ngang, 30–80% chiều cao) sẽ bị các ô nội dung che — chi tiết đẹp nhất nên ở TRÊN (trăng, mái nhà, cành cây) và ở
  HAI MÉP + DẢI DƯỚI (bia mộ, bí ngô). Bia mộ đặt rõ ràng, tách nhau, chân bia nhìn thấy được (code sẽ cho ma trồi lên từ chân bia).

#01 ek_nha_ma — VẼ LẠI đúng cảnh ảnh đính kèm, giữ nguyên bố cục: trăng tròn to góc trái trên · nhà ma 2 tầng mái nhọn trên đồi ở giữa, đường đá dẫn lên ·
    cây chết 2 bên · hàng rào sắt · khoảng 7–9 bia mộ rải 2 bên sườn đồi · khoảng 12–15 quả bí ngô khoét mặt sáng cam, quả to ở 2 góc dưới.   → DỪNG, chờ duyệt
#02 ek_nha_ma_doc — y hệt #01 nhưng khổ DỌC 9:16 (cho điện thoại): trăng + nhà ma ở nửa trên, bia mộ + bí ngô nửa dưới.
#03 ek_rung_chet — cùng nét, cảnh khác: rừng cây chết cao gầy cành xoắn, lối mòn vào rừng, trăng khuyết, vài bia mộ cũ giữa rễ cây, bí ngô sáng rải dưới gốc cây.
#04 ek_lang_bo_hoang — cùng nét: dãy nhà gỗ xiêu vẹo mái nhọn, cửa sổ vàng cam, bù nhìn rách, giếng đá, bia mộ ở sân sau, bí ngô sáng trước hiên, trăng to hơi cam.
```

## Khi tranh về (Claude làm)

- Nhận diện + đổi tên vào `design/bk-ui-src/halloween-erp/`, nén vào `public/bk-ui/erp/halloween/` (`nha_ma.jpg` thay file tạm — tên MỚI nếu đã deploy, xem luật PWA
  `design/STYLE-HS.md` §2: không xoá / đổi tên ảnh bản đang chạy còn gọi).
- **ĐO LẠI** trên tranh mới: tâm từng quả bí ngô · ô cửa sổ · trăng · chân từng bia mộ (lưới %) ⇒ sửa số trong `lib/erpHalloween.ts`. Soi 1280 / 1600 / 1920 px.
- #02 dọc ⇒ `toiDoc` của Nhà ma (+ đo điểm khổ dọc nếu muốn hoạt cảnh trên điện thoại). #03 / #04 ⇒ thêm 2 hình nền + điểm đo.
