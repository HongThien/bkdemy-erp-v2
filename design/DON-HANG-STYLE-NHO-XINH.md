# Đơn đặt hàng ChatGPT — Style "Đáng yêu" (cảm hứng Chiikawa; tên làm việc lúc soạn: "Nhỏ xinh") cho app HS

> ✅ **Thùy chốt 11/10 (đêm): tên trong app = "Đáng yêu"** (id code `dang_yeu`) · **làm SONG SONG với style Thị trấn** (không thay).
> Chữ "Nhỏ xinh" còn lại trong file này (các khối đơn dán cho ChatGPT, tên file `DON-HANG-STYLE-NHO-XINH.md`, thư mục ảnh gốc `bk-ui-src/nho-xinh/`,
> tiền tố `nx_`) là TÊN LÀM VIỆC — giữ nguyên vì context ChatGPT đã vẽ theo tên đó và 150 hình đã đặt tên; không ảnh hưởng app.

> **Soạn 11/10/2026** theo yêu cầu Thùy: *"tương tự hãy làm thêm 1 file md tương tự LOFI để làm giao diện phong cách chiikawa"* + ảnh không khí
> đính kèm (3 bé tròn nằm lăn trên bãi cỏ hoa, nét viền nâu dày, màu pastel, má hồng).
> - **Khuôn = y như Khối vuông / Lo-fi chill** (`DON-HANG-STYLE-KHOI.md` · `DON-HANG-STYLE-LOFI.md`): ảnh toàn cảnh duyệt trước → DỪNG chờ Thùy →
>   từng hình riêng, mỗi lượt đúng 1 hình.
> - Luật 1 style gồm gì / thêm style thế nào: `design/STYLE-HS.md` · hợp đồng code: `src/screens/hocsinh/skin/kieu.ts`.
> - Ảnh không khí (đã lưu): `design/handoff/hs-skin-nho-xinh-v1/reference/khong_khi_chiikawa.webp`.
>
> | Đơn | Nội dung | Số lượt vẽ | Khi nào gửi |
> |---|---|---|---|
> | **N1** | Màn chính + bộ hình style: 3 nền × 2 khổ · 2 linh vật · 18 icon ô · 2 banner · 2 trang trí · 2 khung viền tay | 4 ảnh toàn cảnh + 32 hình | Gửi được ngay |
> | **N2** | **Hoạt họa linh vật** — 9 tư thế × 2 linh vật · 6 vật hiệu ứng | 24 hình | Sau khi N1 nhóm C (2 linh vật) được duyệt, trong ĐÚNG context N1 |
> | **N3** | Khu HỌC TẬP: 5 icon · cổng 5 gò cỏ nổi · Chinh phục BK (9 tháp) · sân Đấu trường | 2 ảnh toàn cảnh + 26 hình | Sau khi N1 #01 được duyệt |
> | **N4** | Bản đồ phiêu lưu (10 vùng) + 16 quái tròn + 4 boss (cùng mã với K2 / Đơn 6) | 1 ảnh toàn cảnh + 61 hình | Sau khi N1 #01 được duyệt |
>
> Không đặt (giống Khối vuông / Lo-fi): bộ khung màn trong (Bảng xếp hạng · Nhiệm vụ · Thành tựu — Đơn 15–18 của RPG), boss riêng giáo viên, 6 nhân vật
> chính chạy/đánh (vẫn dùng bộ anime chung). Thiếu thì app tự vẽ bằng code / rơi về hình chung, không vỡ.

---

## ✅ KIỂM HÀNG 11/10 (tối) — về 150 file = 149 hình + 1 file trùng; **130 dùng được · 19 phải vẽ lại · 1 hình THIẾU**

Hình về tên mặc định ở GỐC `bk-ui-src/` ⇒ Claude nhận diện bằng mắt (tấm ghép) + đổi tên, chuyển vào `design/bk-ui-src/nho-xinh/` (N1) ·
`nho-xinh/hoat-hoa/` (N2) · `nho-xinh/hoc-tap/` (N3) · `nho-xinh/phieu-luu/` (N4) — sổ `nho-xinh/_doi_ten.log.txt` (hoàn tác được). 183 MB, đã thêm
vào `.gitignore` ⇒ **Thùy cất bản gốc lên Drive** (thư mục `nho-xinh/`) rồi gửi link ghi vào đây.

| Đơn | Dùng được ngay | Phải bổ sung | Ghi chú |
|---|---|---|---|
| **N1** | ✅ **36/36** | — | Đúng nét: viền nâu dày, tô phẳng pastel, má hồng. Cánh cụt + cừu KHÔNG giống nhân vật Chiikawa nào. 18 icon + banner + trang trí + 2 khung viền tay đều trong suốt thật. File trùng: nền phố nhỏ ngang tải 2 lần (md5 giống hệt) ⇒ bản thừa cất `nho-xinh/_thua/`, không xoá. Lệch nhận được: nền NGANG 1505×1045 (tỉ lệ iPad, màn 16:9 bị xén ~19% chiều dọc — nền ít chi tiết nên không sao) · 2 linh vật gần đúng cỡ đơn · `nx_tt_goc` là bụi cây đứng (không ôm góc) ⇒ code đặt ở góc DƯỚI thẻ |
| **N2** | **23/24** | **THIẾU 1** — `nx_nam_chop_mat` | Cánh cụt về 8 tư thế (vẫy 1 · vẫy 2 · vui · mừng khóc · lo · ngủ · ăn 1 · ăn 2), thiếu **chớp mắt**. Cừu đủ 9. 6 vật hiệu ứng đủ. Mọi tư thế cùng khung 1122×1402, không vẽ cỏ dưới chân — đúng đơn |
| **N3** | ✅ **28/28** | — | Tất cả trong suốt thật, đúng cỡ: 5 icon · 5 gò cỏ nổi · tháp tổng + 8 tháp chủ đề (gạch kem · gỗ · đá cuội · nấm · bánh quy · kẹo dẻo · đá bào · mây bông) · 2 đế · cầu · sân đấu 2092×752 (mặt cỏ từ ~60%) |
| **N4** | **43/62** — toàn cảnh · nền thế giới · 10 đảo · 10 nền vùng · 8 quái đầu · rồng con + golem · `nen_dang_rung` · 6 mốc · 4 vật nhỏ | **19** | ① **8 quái mở rộng + phượng hoàng + bạch tuộc (10 hình)**: nền KEM đặc + có bãi cỏ dưới chân (không trong suốt), nét KHÁC 8 quái đầu (viền mảnh, màu nước loang, con vật nhỏ trong khung) · ② **9 nền dạng** (`bang` → `dong_gio`): vẽ thành BẢN ĐỒ nhìn chéo có đường ngoằn ngoèo + phiến đá đặt sẵn + biển gỗ, không phải màn đi ngang có mặt đường ở 72–76%; nét cũng chi tiết / đậm hơn hẳn 10 nền vùng |

**Điểm rất tốt:** 10 nền vùng đúng y đơn (phẳng, trống ở giữa, vật dồn ra mép) — đặt điểm màn đấu bằng bố cục chung được, không phải đặt tay như Lo-fi.
8 quái đầu + 2 boss đầu đúng dáng cơ thể, mặt "dỗi" đúng ý.

**Đơn bổ sung 20 hình: `design/DON-HANG-NHO-XINH-BO-SUNG.md`** (mã NB01–NB20, kèm đường dẫn hình cũ / hình mẫu phải đính kèm).

**Mục 0 đã chốt hết 11/10:** tên trong app = **"Đáng yêu"** (`dang_yeu`) · làm **song song** với Thị trấn · giữ "đánh quái" · linh vật cánh cụt + cừu.

---

## 0. Quyết định thiết kế (Claude đề xuất 11/10 — ✅ Thùy chốt 11/10: #1 tên "Đáng yêu" · #3 song song với Thị trấn · #6, #7 theo hình đã vẽ)

| # | Vấn đề | Chọn | Vì sao |
|---|---|---|---|
| 1 | Tên style trong app | ✅ **"Đáng yêu"** (id `dang_yeu`) — Thùy chốt 11/10, thay đề xuất "Nhỏ xinh". Mô tả "Các bé tròn trên đồng cỏ hoa", dòng phụ "giống: Chiikawa · Sumikko" | "Chiikawa" là tên tác phẩm có bản quyền (tác giả Nagano) — app chỉ nêu để so sánh, như RPG ghi "Genshin", Khối ghi "Minecraft" |
| 2 | Học sinh nào chọn | Em **thích dễ thương, nhẹ nhàng** — chuẩn thiết kế lớp 3–7 nhưng mọi khối chọn được. Không đặt làm mặc định cho khối nào | Style "chọn vào" |
| 3 | Quan hệ với style "Thị trấn" (linh vật dễ thương, sáng — hình về 27/34 từ 29/09, chưa dựng code; `spec-giao-dien-hs.md` §9) | ✅ **Làm SONG SONG cả hai** — Thùy chốt 11/10 (Claude từng đề xuất thay Thị trấn; bị bác) | Hai style khác nét (Thị trấn = minh hoạ 3D mềm · Đáng yêu = vẽ tay phẳng viền nâu) ⇒ em có 2 lựa chọn dễ thương. Lưu ý khi dựng: tên + ảnh xem trước trong màn chọn style phải khác nhau rõ; Thị trấn còn nợ 7 hình (#28–#34) |
| 4 | Mức "giống Chiikawa" | Giống tối đa về **CÁCH VẼ**: thân tròn như bánh mochi, tay chân tí hon, **nét viền nâu dày hơi run tay**, màu phẳng pastel, má hồng bầu dục, mắt chấm, các vạch "rung rung" quanh người, nền màu nước nhạt rải cỏ + hoa. KHÔNG chép **TỪNG NHÂN VẬT** | Cách vẽ không ai giữ bản quyền (Sumikko, Molang, Mofusand… đều thân tròn viền dày). Cái bị bảo vệ là từng nhân vật cụ thể — danh sách CẤM ở PHONG CÁCH CHUNG |
| 5 | Sáng hay tối | **Chỉ SÁNG** (`cheDo: ['sang']`), 3 nền đều sáng (có 1 nền hoàng hôn) | Pastel trên nền tối mất hết chất. Một chế độ ⇒ không đụng lỗ hợp đồng `theTiep`/`nenTen` như Lo-fi |
| 6 | Lớp game "đánh quái" | **GIỮ NGUYÊN, giọng game** — bé nhỏ xíu đi đánh quái to tròn. Dùng `LOI_GAME` + đè vài câu cho dễ thương (mục 5) | Trái với Lo-fi (đổi sang "gỡ rối"): truyện gốc vốn là các bé nhỏ đi diệt quái kiếm thưởng, nên "bé tí mà dũng cảm" đúng chất và buồn cười. Quái vẽ **to, tròn, ngố** — không đáng sợ |
| 7 | Linh vật | **2 linh vật tự thiết kế**, loài KHÁC hẳn dàn nhân vật Chiikawa (gấu trắng · mèo mái xanh · thỏ vàng · sóc bay · rái cá · sư tử đá…): **bé CÁNH CỤT con** (`nam`) + **bé CỪU bông** (`nu`). Đứng nửa trái Home + bong bóng thoại như RPG/Khối | Chỗ `nhanVat {nam, nu}` của hợp đồng giữ nguyên ⇒ Home không sửa bố cục |
| 8 | Hoạt họa | 3 tầng, rẻ → đắt: ① **đường viền "sôi"** (*line boil* — kỹ thuật hoạt hình vẽ tay: nét rung nhẹ 6 hình/giây) làm **bằng code** (bộ lọc SVG, 0 hình mới), áp cho linh vật · ② **nhún – dẹt – giãn** (*squash & stretch*) bằng code khi đổi tư thế · ③ **9 tư thế vẽ riêng** mỗi linh vật (N2), đổi tư thế kèm 1 nhịp nhún nên không cần khung trung gian | Linh vật đơn giản nên đổi cả tư thế vẫn nhất quán — không cần ghép vùng như Lo-fi. Nét run tự nhiên che luôn sai khác nhỏ giữa các hình |
| 9 | Font | Tiêu đề **Mali** 700 (tròn, hơi vẽ tay — gần chữ logo trong ảnh) · thân **Baloo 2** (đã nạp sẵn). Mali mất dấu tiếng Việt lúc chụp thử ⇒ lùi về Baloo 2 800 cho cả tiêu đề | Chữ viết tay chỉ ở TIÊU ĐỀ; đề bài, đoạn văn vẫn chữ dễ đọc |
| 10 | Thẻ / nút | **Kiểu TRANH VẼ TAY**: thẻ trắng kem, **viền nâu dày 2,5px** bo 22px, bóng cứng lệch xuống (không bóng mờ) · nút chính hồng dâu đậm chữ trắng, bấm lún · thanh tiến độ viền nâu, ruột hồng · badge tròn đỏ dâu. Thẻ "Việc tiếp theo" = tấm vàng bơ viền nâu | Viền nâu dày là dấu nhận ra mạnh nhất của nét vẽ này. Viền bằng CSS trước; khung viền TAY (N1 mục G) để nâng cấp sau |
| 11 | Bản đồ + quái | **CÙNG mã biome + mã loài với K2 / Đơn 6**, giữ **dáng cơ thể** từng loài | DB gán cố định; hoạt ảnh quái đọc theo dáng (`skin/the3d/loai.ts`) |

**Đã chốt hết** (11/10): #1 tên "Đáng yêu" · #3 song song với Thị trấn · #6 giữ "đánh quái" + #7 cánh cụt & cừu (theo 150 hình đã vẽ). Còn lại là cách đi —
#7 (2 linh vật: cánh cụt + cừu). Còn lại là cách đi — Thùy không bác thì Claude theo.

---

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` → dán khối **PHONG CÁCH CHUNG — NHỎ XINH** (ngay dưới) → dán nguyên khối **ĐƠN ĐẶT HÀNG** của đơn đó.
2. Đính kèm:
   - `design/handoff/hs-skin-nho-xinh-v1/reference/khong_khi_chiikawa.webp` — **KHÔNG KHÍ** Thùy chọn 11/10: lấy nét viền, bảng màu, độ đơn giản,
     nền cỏ hoa. Ghi rõ với ChatGPT: **không vẽ lại 3 nhân vật trong ảnh, không vẽ chữ "chiikawa"**.
   - `design/handoff/hs-skin-khoi-v1/reference/bo_cuc_home_ipad.jpg` · `bo_cuc_home_dt.jpg` · `bo_cuc_nhiem_vu_ipad.jpg` — **BỐ CỤC + NỘI DUNG**
     màn chính / Nhiệm vụ (chụp từ code, style RPG). Chỉ lấy bố cục.
   - `design/bk-ui-src/khoi-20261009T113603Z-1-001/khoi/khoi_man_chinh_ipad.png` — ảnh toàn cảnh Khối vuông đã duyệt, để ChatGPT thấy **mức hoàn thiện**
     cần đạt (không lấy phong cách).
   - Đơn N3 / N4: đính kèm thêm các hình N1 đã duyệt (#01 + 2 icon + 2 linh vật) làm mẫu nét.
3. ChatGPT vẽ **#01** rồi DỪNG ⇒ Thùy duyệt phong cách. Chưa ưng thì sửa #01; ưng rồi mới gõ "tiếp".
4. **Tải về theo ĐÚNG thứ tự #** vào `design/bk-ui-src/nho-xinh/` (N1) · `nho-xinh/hoat-hoa/` (N2) · `nho-xinh/hoc-tap/` (N3) · `nho-xinh/phieu-luu/` (N4).
   Không cần đổi tên — Claude nhận diện **bằng mắt**. Hình nào bắt vẽ lại thì ghi chú số # của hình đó.
5. Xong nhóm nào (B, C, D…) báo Claude kiểm nhóm đó, đừng đợi đủ cả đơn.
6. Ảnh gốc KHÔNG lên git (`design/README.md`) — cất bản chính lên Drive (thư mục mới `nho-xinh/` cạnh `khoi/`, `gami/`), gửi link để Claude ghi vào đây.
   Claude nén bản app dùng vào `public/bk-ui/hs/skin/dang_yeu/`.

---

## PHONG CÁCH CHUNG — NHỎ XINH (dán kèm MỌI đơn)

```
PHONG CÁCH CHUNG — style "Nhỏ xinh" của app học sinh BK Academy (trung tâm dạy thêm Toán, học sinh lớp 3–12)
MỤC TIÊU:    nhìn vào là thấy NGAY thế giới "các bé nhỏ tròn dễ thương" kiểu truyện tranh Nhật vẽ tay: mọi thứ tròn, mềm, đơn giản,
             pastel, hiền. Giống ở CÁCH VẼ — MỌI nhân vật, sinh vật, đồ vật ĐỀU TỰ THIẾT KẾ.
Nét vẽ:      vẽ tay 2D PHẲNG. NÉT VIỀN NÂU SẪM #4a342a DÀY, đều, HƠI RUN TAY (không thẳng tắp, không vector sắc lẹm), đầu nét tròn.
             Tô màu phẳng 1 lớp, gần như KHÔNG đổ bóng (tối đa 1 mảng bóng nhạt), không chuyển sắc bóng bẩy, không viền sáng.
             Chi tiết ÍT: mỗi vật chỉ vài nét. KHÔNG 3D, KHÔNG ảnh chụp, KHÔNG pixel, KHÔNG nét anime tỉ mỉ, KHÔNG bóng kính.
Sinh vật:    thân TRÒN như bánh mochi (đầu liền thân, không cổ), tay chân TÍ HON là các mẩu tròn, tai nhỏ, MẮT là 2 chấm đen nhỏ
             (hoặc 2 vạch cong khi cười / nhắm), miệng nhỏ xíu, MÁ HỒNG bầu dục 2 bên (có thể kèm 2–3 vạch chéo nhạt).
             Biểu cảm rõ bằng dáng người + vài nét: vui giơ tay, lo thì run + giọt mồ hôi, mừng thì mắt long lanh.
             Quanh người có thể có vài VẠCH NGẮN "rung rung" / cỏ lưa thưa.
Nền:         màu nước nhạt, hơi loang, hạt giấy nhẹ: đồng cỏ xanh non #cfe6b0 rải BỤI CỎ (3–4 vạch ngắn), hoa nhỏ 5 cánh trắng / hồng,
             bụi cây xanh đậm viền lượn sóng, bướm nhỏ; trời xanh nhạt, mây tròn. RẤT ÍT chi tiết, nhiều khoảng trống.
Bảng màu:    cỏ non #cfe6b0 · cỏ đậm #8fbf73 · kem #fff8ee · trắng sữa #fffdf8 · hồng má #ffb3c7 · hồng dâu #f07fa0 · hồng đậm #c93a6e
             · vàng bơ #ffe9a8 · vàng trứng #f6cf6b · xanh trời #bfe3f2 · xanh nơ #6c9bd1 · tím hoa #b9a6e0 · cam đào #f8b98a
             · NÉT VIỀN + CHỮ nâu sẫm #4a342a · chữ phụ #8a7468. Bão hoà THẤP, sáng, ngọt. KHÔNG đen tuyền, KHÔNG neon, KHÔNG màu tối.
Đồ vật:      đồ đời thường vẽ tròn mập: bút chì mập, vở, cặp chéo nhỏ, bánh, kẹo, cốc, mầm cây, hoa, cúp, đồng xu, đồng hồ báo thức…
             Đồ vật KHÔNG có mặt (không mắt miệng) — chỉ sinh vật mới có mặt.
ĐƯỢC giống:  cách vẽ (thân mochi, viền nâu dày run tay, màu phẳng pastel, má hồng, mắt chấm, vạch rung) · nền cỏ hoa màu nước ·
             không khí hiền, ngộ nghĩnh, hơi mít ướt.
CẤM (bản quyền — có 1 thứ là hỏng cả hình):
             · các nhân vật của Chiikawa: bé TRẮNG tai tròn nhỏ hay khóc (Chiikawa) · MÈO trắng có tóc mái / tai XANH DƯƠNG chẻ đôi
               (Hachiware) · THỎ VÀNG tai dài lòng tai hồng (Usagi) · sóc bay xám (Momonga) · bé nâu hạt dẻ (Kurimanju) · rái cá (Rakko)
               · sư tử đá cam (Shisa) · người mặc giáp · các con quái / chimera của truyện.
             · đồ đặc trưng của truyện: cây CHĨA HAI NHÁNH dùng đi diệt quái, túi đeo chéo hình mặt nhân vật, chữ "chiikawa" / "ちいかわ",
               kiểu chữ logo hồng viền trắng trong ảnh mẫu.
             · nhân vật dễ thương của hãng khác: Sumikko Gurashi, Rilakkuma, Sanrio (Hello Kitty, Cinnamoroll, Pompompurin…), Molang,
               Mofusand, Line Friends, Pokémon, Kirby, Pusheen, bồ hóng / Totoro.
             Học sinh nhìn ra là ĐÚNG nhân vật của ai đó thì coi như hỏng.
Thẻ:         kiểu TRANH VẼ TAY: tấm trắng sữa #fffdf8, VIỀN NÂU #4a342a dày ~2,5px hơi run tay, bo góc lớn 22px, bóng CỨNG nâu nhạt lệch
             xuống 4px (không bóng mờ). Ô con bên trong = mảng hồng má / vàng bơ nhạt bo tròn, không viền. Khung gần VUÔNG — KHÔNG thẻ dẹt.
             Thẻ "Việc tiếp theo" = tấm vàng bơ #ffe9a8 viền nâu.
Nút:         nút chính = viên bo tròn hồng đậm #c93a6e viền nâu, chữ trắng, bấm lún xuống · nút phụ = viên trắng viền nâu, chữ nâu.
             Thanh tiến độ = ống bo tròn viền nâu, ruột hồng dâu. Badge số = chấm tròn đỏ dâu #e8506e viền nâu, chữ trắng.
Chữ:         tiêu đề, tên ô, số to = chữ tròn hơi vẽ tay Mali đậm (đủ dấu tiếng Việt) · đề bài, đoạn văn, chữ nhỏ = Baloo 2 (phải dễ đọc).
             KHÔNG Pacifico, KHÔNG chữ thảo nối nét. Chữ chính ≥ 15px ở điện thoại, ≥ 16px ở iPad; tiếng Việt đúng dấu.
             Ảnh toàn cảnh có chữ + số mẫu; HÌNH RỜI (linh vật, vật phẩm, quái, nền) KHÔNG có chữ/số nào.
Thiết bị:    iPad NGANG 1180×820 (ảnh chính — làm khổ ngang trước) + điện thoại DỌC 430px. Màn được cuộn.
CẤM thêm:    khẩu hiệu động viên · chữ tiếng Anh / tiếng Nhật trang trí · trái tim / vương miện rải khắp màn · máu me, đáng sợ.

══ CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối / cắt từ ảnh toàn cảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#13 nx_o_tren_lop".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.
- Hình cùng họ (các icon, 2 linh vật và mọi tư thế của chúng, các quái, các vùng đất) PHẢI vẽ dựa trên hình đã duyệt trước đó trong context
  này: giữ ĐỘ DÀY NÉT VIỀN, màu viền, cách tô phẳng, bảng màu — chỉ đổi vật.
```

---

## Đơn N1 — Màn chính + bộ hình của style

Đính kèm: các ảnh ở "Cách gửi" bước 2.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            style-nho-xinh (màn chính + mọi hình của style "Nhỏ xinh")
Mô tả:          App học sinh trung tâm dạy thêm BK Academy. Thêm style "Nhỏ xinh" bên cạnh "Anime RPG", "Khối vuông", "Lo-fi chill": em chọn
                style nào thì TOÀN BỘ app đổi theo (màn chính, mọi màn bên trong, popup). Style này dành cho học sinh thích dễ thương,
                nhẹ nhàng. Bố cục giữ y như ảnh bo_cuc_* đính kèm (style RPG hiện tại) — CHỈ đổi phong cách theo PHONG CÁCH CHUNG.
                Chỗ "nhân vật" trong bố cục = LINH VẬT tròn (không có người).

MÀN CHÍNH khổ NGANG (iPad 1180×820) — đúng khối, đúng thứ tự như bo_cuc_home_ipad.jpg (chữ/số do code vẽ; ảnh toàn cảnh vẽ chữ mẫu đúng như dưới):
  - Góc trên trái: TẤM TÊN (thẻ viền nâu) = avatar tròn (2 chữ "MK") + "Nguyễn Minh Khang" + "HS0412 · 6A1 · Toán" + vạch ngăn + biểu tượng
    bậc rank nhỏ + "Captain" + 2 sao.
  - Góc trên phải: nút "Hình nền" (icon bảng màu + chữ) · nút Hòm thư (badge 3) · nút "⋯".
  - Cột TRÁI ≈ 32%: LINH VẬT đứng trên bãi cỏ (thân tròn to, cao ≈ 70% màn, chân chạm gần mép dưới, vài bụi cỏ + hoa dưới chân) +
    BONG BÓNG THOẠI viền nâu: "Hôm nay còn 2 nhiệm vụ đó!".
  - Cột PHẢI: "Chào Minh Khang!" chữ to 2 dòng →
      nhóm "HỌC TẬP": thanh chọn môn [Toán | KHTN] (Toán đang chọn) → thẻ ca bổ trợ (tấm vàng bơ) "THỨ 5 01/10 · 17:30" / "Bổ trợ yếu · Toán" /
      "Phòng 204 · Cô Lan" + icon lịch → LƯỚI Ô 4 cột, mỗi ô: icon đặt GIỮA + tên + 1 dòng trạng thái + badge tròn đỏ dâu:
        Học tập "Cùng BK chinh phục thế giới" · Nhiệm vụ "Hôm nay còn 2 nhiệm vụ" (badge 2) · Bảng xếp hạng "Captain ★★ · hạng 12/54" ·
        Thông tin học tập "Xem dạng đang yếu" · Sổ tay kiến thức "Tra lý thuyết & bài mẫu" · Làm đề thi thử "Sắp có" (ô KHOÁ, mờ) ·
        Bài tập trên lớp "2 bài chưa làm" (badge 2)
      → nhóm "GIẢI TRÍ": thẻ ngang "Thế giới BK" (icon + "Xem học sinh BK đang khoe gì nào!" + 2 dòng tin) → lưới ô: Thư viện BK ·
        Trò chơi · Thành tựu · May mắn "Có 1 lượt quay!" (badge 1) · Ví xu "1.240 xu".
MÀN CHÍNH khổ DỌC (điện thoại 430px) — như bo_cuc_home_dt.jpg: hàng đầu (avatar · huy hiệu bậc · Hình nền · Hòm thư · ⋯) → "Chào Minh
  Khang!" → linh vật thu nhỏ + bong bóng thoại → HỌC TẬP (môn · thẻ ca · lưới 4 cột ô nhỏ) → GIẢI TRÍ. Được cuộn.
MÀN CON 1 — Nhiệm vụ (iPad ngang) — như bo_cuc_nhiem_vu_ipad.jpg: 4 khối Chặng tháng · Hôm nay · Nhiệm vụ tuần (+ hàng 4 hộp quà) ·
  Nhiệm vụ tháng, đúng chữ + số trong ảnh. Mục đích: chốt dáng THẺ / NÚT / THANH TIẾN ĐỘ cho mọi màn bên trong.
  Màn trong dùng NỀN ĐƠN SẮC kem #fff8ee (không tranh nền).
MÀN CON 2 — Làm bài (iPad ngang): đầu trang "Câu 3/10" + thanh tiến độ ống hồng · thẻ đề "Tính: 3/4 + 5/6 − 1/2" ·
  4 đáp án A. 13/12  B. 7/6 (đang chọn)  C. 1  D. 5/4 · nút chính "Câu tiếp" + nút phụ "Câu trước". Bài thật của học sinh ⇒ nghiêm túc,
  gọn, dễ đọc, nền kem trơn — KHÔNG linh vật, KHÔNG hoa cỏ trong màn này.

Biến thể:
  3 TRANH NỀN em tự chọn (đều SÁNG, phải khác nhau rõ từ xa):
    dong_co   : ĐỒNG CỎ HOA nhìn THẲNG TỪ TRÊN XUỐNG (như ảnh mẫu) — cỏ xanh non, bụi cỏ lưa thưa, hoa nhỏ trắng/hồng, vài bụi cây
                xanh đậm ở góc, 1–2 con bướm. — MẶC ĐỊNH
    pho_nho   : CON PHỐ NHỎ nhìn ngang — dãy nhà thấp mái tròn màu kem / hồng / xanh nhạt (tiệm bánh, tiệm hoa — biển hiệu là hình vẽ,
                KHÔNG chữ), cột đèn, trời xanh nhạt mây tròn.
    hoang_hon : ĐỒI CỎ HOÀNG HÔN — đồi cỏ thoải, trời cam đào chuyển hồng tím nhạt, mặt trời tròn sắp lặn, vài ngôi sao đầu tiên.
  2 LINH VẬT em tự chọn (KHÔNG gán theo giới tính), cùng phong cách, cùng tư thế đứng, cùng cỡ:
    nam : bé CÁNH CỤT CON — thân mochi tròn màu XÁM XANH NHẠT, bụng + mặt trắng sữa, mỏ cam nhỏ, 2 cánh ngắn, chân cam tí hon, má hồng;
          đeo 1 chiếc CẶP CHÉO nhỏ màu xanh bạc hà, tay cầm 1 cây BÚT CHÌ mập to gần bằng người.
    nu  : bé CỪU BÔNG — thân mochi tròn, lông KEM xù thành các cụm mây tròn quanh đầu và thân, mặt + 4 chân màu cam đào nhạt, tai nhỏ cụp,
          má hồng; cổ thắt 1 chiếc NƠ đỏ dâu, 2 tay ôm 1 QUYỂN VỞ vàng bơ.
    Cả hai: mắt chấm đen, miệng nhỏ, đứng thẳng nhìn về phía người xem, vài vạch "rung rung" quanh người, 2–3 bụi cỏ + 1 bông hoa dưới chân.
    PHẢI khác hẳn các nhân vật trong danh sách CẤM (không gấu trắng, không mèo mái xanh, không thỏ vàng).

Phiên bản kit:  v3 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô, banner): vuông 1254×1254, nền TRONG SUỐT thật (không nền trắng, không ô caro giả), vật ở GIỮA chiếm ~80% khung,
  không chữ/số/badge, không khung ô phía sau, không mặt (mắt miệng). CẢ BỘ cùng ĐỘ DÀY NÉT VIỀN nâu, cùng cách tô phẳng, cùng cỡ vật —
  đặt cạnh nhau như 1 trang sticker.
- LINH VẬT: dọc 1122×1402, nền TRONG SUỐT, TOÀN THÂN, chân + bụi cỏ chạm mép dưới khung, thân chiếm ~80% bề ngang khung.
- NỀN NGANG: 1672×941, nền đặc, KHÔNG linh vật, KHÔNG chữ. Vật nổi bật (bụi cây, nhà, mặt trời) dồn sang TRÁI và 2 góc; 65% bên PHẢI là
  cỏ / trời SÁNG, ÍT chi tiết (để đặt thẻ lên, chữ nâu phải đọc được).
- NỀN DỌC: 941×1672 (9:16), nền đặc, KHÔNG linh vật. Vật nổi bật ở 35% TRÊN; 65% DƯỚI phẳng, sáng dịu, chỉ rải bụi cỏ + vài hoa nhỏ.
- TRANG TRÍ: góc 1254×1254 trong suốt (1 bụi cây xanh đậm viền lượn sóng ôm góc trên-trái + 2 bông hoa + 1 con bướm);
  gạch phân cách 1672×200 trong suốt (1 hàng bụi cỏ lưa thưa xen 3–4 bông hoa nhỏ, mảnh).
- KHUNG VIỀN TAY (để cắt 9 mảnh): nền TRONG SUỐT, chỉ có đường viền + nền trong khung; 4 góc bo giống hệt nhau, 4 cạnh THẲNG ĐỀU
  (nét run tay nhẹ nhưng không lồi lõm lớn) để kéo dãn được; không hoạ tiết, không chữ.

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục và phong cách — không cắt ra dùng):
   #01 nx_man_chinh_ipad — màn chính khổ NGANG, nền dong_co, linh vật cánh cụt   → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 nx_man_chinh_dt   — màn chính khổ DỌC, nền dong_co, linh vật cừu
   #03 nx_nhiem_vu_ipad  — màn Nhiệm vụ khổ ngang
   #04 nx_lam_bai_ipad   — màn Làm bài khổ ngang
B. Nền:
   #05 nx_bg_dong_co_ngang · #06 nx_bg_dong_co_doc · #07 nx_bg_pho_nho_ngang · #08 nx_bg_pho_nho_doc
   #09 nx_bg_hoang_hon_ngang · #10 nx_bg_hoang_hon_doc
C. Linh vật (vẽ đúng như trong #01 / #02 đã duyệt):
   #11 nx_nv_nam (cánh cụt) · #12 nx_nv_nu (cừu)
D. Vật phẩm cho ô chức năng (mỗi ô 1 ĐỒ VẬT KHÁC NHAU):
   #13 nx_o_tren_lop      — CẶP SÁCH đeo vai màu đỏ dâu, khoá tròn vàng
   #14 nx_o_et            — ĐỒNG HỒ BÁO THỨC tròn 2 chuông màu xanh bạc hà
   #15 nx_o_btvn          — NGÔI NHÀ nhỏ mái tròn màu cam đào + 1 quyển vở dựng cạnh
   #16 nx_o_tu_luyen      — BÚT CHÌ mập vàng + cục tẩy hồng (ô "Học tập")
   #17 nx_o_nhiem_vu      — TẤM BẢNG GỖ nhỏ cắm đất, ghim 1 tờ giấy có 3 ô tích (không chữ)
   #18 nx_o_rank          — HUY HIỆU ngôi sao vàng có 2 dải ruy băng xanh
   #19 nx_o_thong_tin     — KÍNH LÚP tròn tay cầm nâu soi lên 1 tờ giấy có 3 cột biểu đồ
   #20 nx_o_so_tay        — QUYỂN SỔ bìa tím hoa có dây đánh dấu
   #21 nx_o_thi_thu       — TỜ ĐỀ cuộn tròn + ổ khoá tròn — tông XÁM nhạt (ô đang khoá)
   #22 nx_o_bai_tap_giao  — PHONG THƯ kem dán 1 miếng dán hình bông hoa
   #23 nx_o_cup           — CÚP VÀNG tròn mập 2 quai (Thành tựu)
   #24 nx_o_xep_hang      — BỤC 3 BẬC màu pastel, 1 lá cờ tam giác nhỏ cắm bậc cao nhất (không số)
   #25 nx_o_may_man       — CỎ BỐN LÁ to + 2 ngôi sao nhỏ lấp lánh
   #26 nx_o_vi_xu         — VÍ VẢI miệng bấm màu hồng, 2 đồng xu vàng thò ra
   #27 nx_o_hoc_tu_dau    — MẦM CÂY 2 lá trong chậu đất nung nhỏ
   #28 nx_o_the_gioi      — MÁY ẢNH đồ chơi tròn màu xanh trời, ống kính to
   #29 nx_o_thu_vien      — CHỒNG 3 CUỐN SÁCH màu pastel xếp lệch
   #30 nx_o_tro_choi      — QUẢ BÓNG sọc 2 màu + 1 con quay gỗ
E. Vật phẩm cho banner:
   #31 nx_b_lich          — TỜ LỊCH XÉ tròn góc, 1 ngày khoanh tròn hồng (thẻ ca bổ trợ)
   #32 nx_b_kiem_tra_lai  — TỜ BÀI có dấu tích to + bút chì, viền ánh HỒNG nhạt (banner bài kiểm tra lại)
F. Trang trí:
   #33 nx_tt_goc          — bụi cây + hoa + bướm (góc)
   #34 nx_tt_gach         — hàng bụi cỏ + hoa nhỏ (gạch phân cách)
G. Khung viền tay (cắt 9 mảnh):
   #35 nx_khung_the       — khung THẺ: nền trắng sữa #fffdf8, viền nâu dày run tay, bo góc lớn. Ngang 1280×960.
   #36 nx_khung_nut       — khung NÚT: nền hồng đậm #c93a6e, viền nâu, hình viên thuốc dài. Ngang 1280×360.

LUẬT RIÊNG:
  - Giữ nguyên danh sách ô, tên, thứ tự, số như mô tả. Không thêm tính năng, không thêm chữ.
  - Câu duy nhất có "giọng" = bong bóng thoại của linh vật, phải có số thật.
  - Chữ đặt trên tranh nền phải đọc được (chữ nâu trên vùng sáng, hoặc đặt trong thẻ).
  - Mọi sinh vật / đồ vật TỰ THIẾT KẾ theo danh sách ĐƯỢC / CẤM ở PHONG CÁCH CHUNG — đặc biệt KHÔNG ra 3 nhân vật trong ảnh mẫu.

Bắt đầu với #01.
```

---

## Đơn N2 — Hoạt họa linh vật (gửi SAU khi N1 #11 + #12 được duyệt, trong ĐÚNG context đã vẽ N1)

> Hết context thì mở mới, đính kèm #11, #12 + 2 icon. Đường viền "sôi" và nhịp nhún do **code** làm (mục 6) — đơn này chỉ vẽ TƯ THẾ.

```
ĐƠN BỔ SUNG — TƯ THẾ LINH VẬT (vẫn luật cũ: ĐÚNG 1 HÌNH mỗi lượt, dòng đầu ghi số + tên file, chờ "tiếp")
Mục đích: linh vật ở màn chính cử động nhẹ — chớp mắt, vẫy tay, ăn bánh, ngủ gật, mừng. Tôi sẽ tự ghép các hình thành chuyển động.
MỌI hình: dọc 1122×1402, nền TRONG SUỐT, CÙNG linh vật đã duyệt (#11 / #12): cùng cỡ thân, cùng vị trí chân trong khung (chân ở đúng
chỗ cũ, sát mép dưới), cùng độ dày nét viền, cùng màu, cùng phụ kiện (cặp chéo / nơ). CHỈ đổi tư thế + biểu cảm nêu dưới.
KHÔNG vẽ bụi cỏ, hoa dưới chân trong các hình này (code đặt riêng). KHÔNG chữ.

A. Cánh cụt (#11):
   #01 nx_nam_chop_mat   — y hệt #11, chỉ 2 mắt thành 2 vạch cong nhắm lại
   #02 nx_nam_vay_1      — 1 cánh giơ cao vẫy (nghiêng trái)      #03 nx_nam_vay_2 — cánh vẫy nghiêng sang phải
   #04 nx_nam_vui        — nhảy cẫng: 2 cánh giơ lên trời, 2 chân rời mặt đất một chút, mắt cười, 3 vạch rung quanh người
   #05 nx_nam_mung_khoc  — đứng, 2 cánh áp lên má, mắt to long lanh rưng rưng vì mừng, 2 giọt nước nhỏ ở khoé mắt
   #06 nx_nam_lo         — hơi co người, run (vạch rung 2 bên), 1 giọt mồ hôi trên trán, miệng méo
   #07 nx_nam_ngu        — ngồi bệt, mắt nhắm, đầu gục nhẹ, 1 bong bóng mũi nhỏ
   #08 nx_nam_an_1       — 2 cánh cầm 1 chiếc bánh quy tròn to đưa lên miệng    #09 nx_nam_an_2 — bánh đã cắn 1 miếng, má phồng, mắt cười
B. Cừu (#12):
   #10 nx_nu_chop_mat · #11 nx_nu_vay_1 · #12 nx_nu_vay_2 · #13 nx_nu_vui · #14 nx_nu_mung_khoc · #15 nx_nu_lo · #16 nx_nu_ngu
   · #17 nx_nu_an_1 · #18 nx_nu_an_2      (đúng 9 tư thế như cánh cụt; quyển vở kẹp dưới tay khi cần rảnh tay)
C. VẬT NHỎ cho hiệu ứng (512×512, nền TRONG SUỐT, 1 vật ở giữa ~60% khung, cùng nét viền nâu):
   #19 nx_fx_hoa      — 1 bông hoa 5 cánh trắng nhụy vàng
   #20 nx_fx_sao      — 1 ngôi sao 4 cánh vàng bơ tròn mập
   #21 nx_fx_rung     — cụm 3 vạch ngắn song song màu nâu (dấu "rung rung")
   #22 nx_fx_mo_hoi   — 1 giọt mồ hôi xanh nhạt
   #23 nx_fx_bui      — 1 cụm bụi tròn "bụp" màu kem (3 cục mây nhỏ dính nhau)
   #24 nx_fx_co       — 1 bụi cỏ 4 vạch xanh đậm

Bắt đầu với #01.
```

---

## Đơn N3 — Khu HỌC TẬP (bản nhỏ xinh của K3) — gửi sau khi N1 #01 được duyệt

> Bố cục y như RPG / Khối (vị trí 5 "đảo" đặt bằng code, dùng chung mọi style). Đường nối giữa các gò do code vẽ.
> **Cách gửi:** context MỚI → kit → PHONG CÁCH CHUNG → khối dưới. Đính kèm: N1 #01 + 2 icon + 2 linh vật đã duyệt (mẫu NÉT) · bố cục:
> `design/bk-ui-src/AppHS/hs-hoc-tap-v2/reference/reference_hoc_tap.png` (cổng 5 đảo) · ảnh Chinh phục K3 #14 trong `bk-ui-src/khoi/hoc-tap/` ·
> `design/bk-ui-src/AppHS/Animation/chien_dau/nam/reference/reference_chien_dau_nam.png` (sân đấu) — ghi rõ "chỉ lấy bố cục, vẽ mới hoàn toàn".

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            hoc-tap-nho-xinh (khu HỌC TẬP của style "Nhỏ xinh": cổng 5 gò cỏ · Chinh phục BK · sân Đấu trường)
Mô tả:          Bấm "Học tập" ngoài màn chính ⇒ ra 5 chế độ học, mỗi chế độ là 1 GÒ CỎ TRÒN nổi trên trời (như cái bánh bao xanh lơ lửng,
                đáy đất nâu tròn), trên mỗi gò có 1 công trình nhỏ: Học theo chủ đề · Luyện dạng yếu · Đấu trường BK ·
                Chinh phục BK (leo tháp) · Giải Vô địch BK. Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — NHỎ XINH + hình đã duyệt đính kèm: viền nâu dày run tay, tô phẳng pastel, rất ít chi tiết.
                Trời xanh nhạt, mây tròn như kẹo bông. Tươi sáng, hiền.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô): như N1 — vuông 1254×1254, TRONG SUỐT, vật giữa ~80%, cùng nét với icon đã duyệt.
- NỀN: nền ĐẶC, KHÔNG linh vật, KHÔNG quái, KHÔNG chữ. Ngang 1672×941 · dọc 941×1672.
- GÒ / THÁP / ĐẾ / CẦU: nền TRONG SUỐT thật, đúng 1 vật, chừa lề trong suốt quanh vật, không bóng đổ ra nền.
- KHÔNG chữ, số, logo, khung trong MỌI hình (trừ 2 ảnh toàn cảnh #01, #14 được có chữ mẫu).

══ DANH SÁCH (đúng thứ tự ưu tiên — dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 nx_hoc_tap_ipad — ảnh toàn cảnh iPad NGANG 1672×941: trời xanh nhạt, mây tròn, 5 GÒ CỎ nổi (đúng 5 gò ở mục C),
       bố cục: (1) TO NHẤT ở giữa hơi cao · (3) trái-trên · (4) phải-trên · (2) trái-dưới · (5) phải-dưới; đường chấm chấm nâu nối 4 gò về gò giữa;
       dưới mỗi gò có tên + 1 dòng chú thích mẫu (chữ nâu); trên cùng thanh tiêu đề "Học tập". ≈12% trên cùng KHÔNG đặt gò.   → DỪNG, chờ Thùy duyệt
B. 5 icon ô (mỗi ô 1 ĐỒ VẬT KHÁC HẲN các icon N1)
   #02 nx_o_hoc_chu_de   — TẤM BẢN ĐỒ giấy cuộn mở, có đường chấm chấm và 1 dấu X hồng
   #03 nx_o_luyen_yeu    — BÌNH TƯỚI xanh bạc hà đang tưới 1 mầm cây
   #04 nx_o_dau_truong   — 2 LÁ CỜ tam giác bắt chéo (1 hồng dâu, 1 xanh trời)
   #05 nx_o_chinh_phuc   — NGỌN THÁP tròn mập 3 tầng màu kem, mái nón đỏ dâu, cờ nhỏ trên đỉnh
   #06 nx_o_giai_vo_dich — VƯƠNG MIỆN vàng tròn mập 3 chóp
C. Cổng Học tập (vẽ lại ĐÚNG như #01 đã duyệt)
   #07 nx_ht_nen_ngang — đúng cảnh #01 nhưng KHÔNG 5 gò, KHÔNG đường chấm, KHÔNG chữ. Vùng dưới mỗi vị trí gò SÁNG, ít chi tiết. 1672×941.
   #08 nx_ht_nen_doc   — như #07 khổ DỌC 941×1672 (1 gò giữa ở trên + 2 hàng đôi).
   #09 dao_hoc_chu_de   — gò TO NHẤT: 1 cây to tán tròn + tấm biển chỉ đường nhiều mũi tên (không chữ) + lối mòn chấm chấm
   #10 dao_luyen_yeu    — gò VƯỜN RAU nhỏ: 3 luống mầm cây, hàng rào gỗ thấp, bình tưới
   #11 dao_dau_truong   — gò SÂN ĐẤU: vòng tròn vẽ phấn trắng trên cỏ, 2 cột cờ hồng dâu + xanh trời 2 bên
   #12 dao_chinh_phuc   — gò có NGỌN THÁP tròn mập cao nhiều tầng, mái nón đỏ dâu, mây tròn vắt ngang thân tháp
   #13 dao_giai_vo_dich — gò có BỤC 3 BẬC + CÚP VÀNG to ở bậc giữa + dây cờ tam giác nhiều màu phía trên
       #09–#13: vuông 1024×1024 (cạnh ≥1024), gò nằm GIỮA ảnh, công trình chiếm phần lớn mặt gò — nhìn hình là biết chế độ gì.
D. Chinh phục BK (màn chọn tháp để leo)
   #14 nx_chinh_phuc_ipad — ảnh toàn cảnh iPad NGANG 1672×941: CHÍNH GIỮA 1 THÁP TỔNG tròn mập thật cao (nhiều tầng kem, mái nón đỏ dâu, cửa sổ
       tròn, mây tròn vắt ngang) trên 1 GÒ CỎ nổi; xung quanh vòng cung 2 bên, thấp và xa hơn: 8 THÁP CHỦ ĐỀ nhỏ, mỗi tháp trên 1 gò nhỏ,
       nối về giữa bằng CẦU VÁN cong. Dưới chân mỗi tháp tên + "Tầng 12" mẫu. ≈12% trên + ≈14% dưới không đặt tháp.     → DỪNG, chờ Thùy duyệt
   #15 nx_cp_nen     — đúng cảnh #14 CHỈ trời + mây: KHÔNG tháp, KHÔNG gò, KHÔNG cầu, KHÔNG chữ. 1672×941.
   #16 thap_tong     — tháp tổng vẽ lại đúng #14, KHÔNG gò dưới chân. 1024×1536 (đứng), chân tháp CHẠM ĐÁY ảnh.
   #17–#24 thap_cd_1 … thap_cd_8 — 8 tháp chủ đề, MỖI THÁP 1 CHẤT LIỆU khác nhau, cùng nét: 1 gạch kem · 2 gỗ ván · 3 đá cuội tròn ·
       4 nấm khổng lồ mũ đỏ chấm trắng · 5 bánh quy xếp tầng · 6 kẹo dẻo nhiều màu · 7 đá bào xanh nhạt · 8 mây bông.
       Mỗi tháp 1024×1536, chân chạm đáy, KHÔNG gò dưới chân.
   #25 de_tong — GÒ CỎ nổi LỚN dưới tháp tổng (mặt cỏ PHẲNG rộng, đáy đất nâu tròn). Ngang 1536×1024, mặt phẳng ở ~50% ngang · 35% cao.
   #26 de_cd   — GÒ nhỏ cùng kiểu #25. Vuông 1024×1024, mặt phẳng ở ~50% ngang · 40% cao.
   #27 cau     — CẦU VÁN GỖ cong nhẹ nhìn ngang, lan can dây thừng, 2 đầu cầu sát mép TRÁI và PHẢI ảnh, ngang 2048×1024.
E. Sân Đấu trường
   #28 nen_san_dau — ngang 2400×860, nền đặc, góc nhìn ngang nhẹ từ trên: BÃI CỎ phẳng chiếm dải dưới (mặt cỏ từ ≈62% chiều cao), 2 bên là
       hàng rào gỗ thấp + bụi cây + hoa, nền xa là đồi tròn + trời xanh nhạt mây tròn + dây cờ tam giác. Vùng GIỮA (25–75% ngang) THOÁNG.
       Chỗ đứng: bên TRÁI và bên PHẢI, cùng ở ≈78% chiều cao. KHÔNG linh vật, KHÔNG chữ.

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình (trừ #01, #14). KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## Đơn N4 — Bản đồ phiêu lưu + quái tròn (bản nhỏ xinh của K2) — gửi sau khi N1 #01 được duyệt

> Cây kiến thức → bản đồ (`spec-v1-app-hs.md` §4): chủ đề = lục địa · chuyên đề = khu vực · dạng = màn đấu · cụm = quái.
> **Cùng mã file với K2/K3** (DB gán cố định) — chỉ đổi nét vẽ. 10 biome giữ nguyên nghĩa: `rung` · `bang` · `nui_lua` · `bien_dao` · `anh_dao` ·
> `sa_mac` · `dam_lay` · `thanh_co` · `troi_sao` · `dong_gio`.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-nho-xinh (bản đồ phiêu lưu + quái vật, style "Nhỏ xinh")
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đánh quái vật". Mỗi chủ đề kiến thức là 1 vùng đất, mỗi dạng bài là
                1 màn đấu, mỗi nhóm bài là 1 con quái. Học sinh làm đúng câu hỏi = tung đòn đánh quái. Ở style này: bé linh vật NHỎ XÍU
                dũng cảm đi đánh những con quái TO TRÒN NGỐ. Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — NHỎ XINH + hình đã duyệt đính kèm. Vùng đất vẽ như tranh truyện thiếu nhi: mảng màu nước phẳng,
                viền nâu, đồi tròn, cây tròn, rất ít chi tiết. QUÁI = sinh vật thân mochi TO (gấp 3 linh vật), viền nâu dày, mắt chấm,
                má hồng, vẻ mặt HẬM HỰC / DỖI kiểu trẻ con (lông mày chéo, miệng mếu) — buồn cười, KHÔNG đáng sợ, không nanh vuốt nhọn,
                không máu me. Loài TỰ THIẾT KẾ: KHÔNG giống quái / chimera của Chiikawa, Pokémon, Kirby, slime Dragon Quest.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN ══
- NỀN VÙNG (nen_vung_*): ngang 1672×941, nền đặc, KHÔNG linh vật, KHÔNG quái, KHÔNG chữ, KHÔNG đường đi vẽ sẵn. Nhìn từ trên cao chéo
  (như bản đồ game), cảnh trải đều cả khung, NHIỀU khoảng đất bằng trống để đặt 6–10 điểm màn đấu.
- NỀN DẠNG (nen_dang_*): ngang 1672×941, nền đặc, nhìn NGANG như màn game đi ngang: trời + đồi xa nửa trên; 1 CON ĐƯỜNG ĐẤT màu kem THẲNG
  NGANG chạy hết bề ngang ảnh, mặt đường bằng phẳng, TÂM đường ở ≈74% chiều cao (dải ≈72–76%); dưới đường là cỏ; phía trên đường thoáng
  (không cây to che đường). KHÔNG linh vật, KHÔNG quái, KHÔNG chữ.
- ĐẢO (dao_*): 1024×1024, nền TRONG SUỐT, 1 gò đất tròn nổi nhìn chéo từ trên, đúng vùng đất tương ứng, đáy đất nâu tròn.
- QUÁI: 1024×1024, nền TRONG SUỐT, toàn thân, giữa khung ~75%, quay 3/4 về người xem, GIỮ ĐÚNG DÁNG CƠ THỂ ghi trong ngoặc
  (giọt / thú 4 chân / rùa / chim / cá / sao / nấm / người đá / côn trùng). Mỗi con 1 màu chủ đạo khác nhau, nhìn hình bóng là phân biệt.
- BOSS: như QUÁI nhưng to, oai hơn (vương miện nhỏ lệch / áo choàng / hào quang vạch tia), vẫn ngố.
- KHÔNG chữ, số, logo, khung, nền phía sau quái.

══ DANH SÁCH (đúng thứ tự ưu tiên — dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 Ảnh toàn cảnh iPad ngang: bản đồ vùng rừng nhìn chéo từ trên, 8 điểm màn đấu nối bằng đường chấm chấm, 3 điểm đã cắm cờ, 1 điểm đang
       sáng có 1 con quái to tròn đứng trên, phần cuối bản đồ phủ mây; góc trái là linh vật cánh cụt của N1.   → DỪNG, chờ duyệt.
B. Thế giới + 10 đảo
   #02 nen_the_gioi — trời xanh nhạt + biển mây tròn nhìn từ trên cao, trống để đặt các đảo (ngang 1672×941, nền đặc)
   #03 dao_rung (cây tròn, nấm) · #04 dao_bang (đồi tuyết tròn, người tuyết KHÔNG mặt) · #05 dao_nui_lua (núi lửa lùn phun khói tròn hồng cam)
   · #06 dao_bien_dao (bãi cát, cây dừa lùn, sóng lượn) · #07 dao_anh_dao (cây hoa hồng tròn như kẹo bông) · #08 dao_sa_mac (cồn cát kem,
   xương rồng tròn) · #09 dao_dam_lay (ao sen, lá súng tròn) · #10 dao_thanh_co (tường thành đá tròn mập, cổng vòm) · #11 dao_troi_sao (đồi tím
   nhạt, sao vàng mập cắm trên đất) · #12 dao_dong_gio (đồng lúa vàng, chong chóng giấy to)
C. 10 nền vùng
   #13 nen_vung_rung · #14 nen_vung_bang · #15 nen_vung_nui_lua · #16 nen_vung_bien_dao · #17 nen_vung_anh_dao · #18 nen_vung_sa_mac
   · #19 nen_vung_dam_lay · #20 nen_vung_thanh_co · #21 nen_vung_troi_sao · #22 nen_vung_dong_gio
D. 8 con quái đầu tiên (dáng cơ thể trong ngoặc — PHẢI giữ)
   #23 quai_slime_la  (giọt) cục thạch xanh lá, 1 chiếc lá mọc trên đầu     #24 quai_slime_lua (giọt) cục thạch cam, đốm lửa tròn trên đầu
   #25 quai_meo_bang  (thú)  mèo tròn xanh băng, đuôi là que kem              #26 quai_rua_da    (rùa)  rùa tròn mai đá cuội xám
   #27 quai_cu_dem    (chim) cú tròn tím, lông mày rậm                        #28 quai_ca_bong   (cá)   cá nóc tròn xanh biển, gai là các chấm tròn
   #29 quai_nam_ma    (nấm)  nấm lùn mũ tím chấm trắng, 2 chân ngắn           #30 quai_chim_set  (chim) chim tròn vàng, mào hình tia chớp
E. 2 boss
   #31 boss_rong_con     (giọt) rồng con tròn xanh ngọc, bụng kem, vương miện nhỏ đội lệch
   #32 boss_golem_pha_le (người đá) người đá cuội tròn, vài mảnh pha lê hồng mọc trên vai
F. Nền màn dạng bài
   #33 nen_dang_rung · #34 nen_dang_bang · #35 nen_dang_nui_lua · #36 nen_dang_bien_dao · #37 nen_dang_anh_dao · #38 nen_dang_sa_mac
   · #39 nen_dang_dam_lay · #40 nen_dang_thanh_co · #41 nen_dang_troi_sao · #42 nen_dang_dong_gio
G. Mốc + đồ vật nhỏ (512×512 trong suốt, nhìn chéo từ trên, giữa khung ~70%)
   #43 moc_thanh (lâu đài tròn mập mái nón) · #44 moc_thap (tháp canh gỗ lùn) · #45 moc_trai (lều tam giác + đống lửa nhỏ)
   · #46 moc_den (ngôi đền đá 4 cột tròn) · #47 moc_cau (cầu ván cong qua suối) · #48 moc_cong (cổng vòm gỗ có dây cờ)
   #49 be_da (phiến đá tròn dẹt viền cỏ — chỗ quái đứng) · #50 may_suong (1 đám mây tròn trắng kem, ngang 1024×512)
   #51 co_chinh_phuc (lá cờ tam giác hồng dâu cắm que gỗ) · #52 la_ban (la bàn tròn mập vỏ vàng)
H. Mở rộng (làm nếu còn thời gian)
   #53–#60 thêm 8 quái: quai_tho_gio (thú) thỏ tròn XÁM TRO tai CỤP ngắn, khăn bay — KHÔNG vàng, KHÔNG tai dài · quai_be_nham (người đá) cục
       đá tròn có khe nứt cam · quai_sao_bien (sao) sao biển mập hồng cam · quai_ech_doc (giọt) ếch tròn tím chấm vàng · quai_dom_dom (côn trùng)
       đom đóm tròn đuôi sáng vàng · quai_soi_bang (thú) sói tròn lông trắng xanh, lông mày chéo · quai_bo_giap (rùa) bọ tròn giáp đồng,
       1 sừng ngắn · quai_ma_lua (giọt) bóng ma tròn trắng kem, ngọn lửa xanh nhạt trên đầu
   #61 boss_phuong_hoang (chim) chim tròn đỏ cam, đuôi 3 lông dài cong · #62 boss_bach_tuoc (thú) bạch tuộc tròn tím, 8 xúc tu ngắn mập

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## 5. Lời chữ `LOI_DANG_YEU` (Claude viết vào `skin/loi.ts` khi dựng — Thùy sửa câu nào thì sửa ở đây trước)

= `LOI_GAME` + đè các khoá dưới (logic / số liệu y hệt). `layLoi` gộp nông ⇒ đè `yeu` thì phải khai đủ cả nhóm `yeu`.

| Khoá | Game (RPG/Khối) | **Nhỏ xinh** |
|---|---|---|
| `chieu` | Chiêu xịt — quái đánh trả, hồi 1 máu · Chiêu nhẹ · Chiêu mạnh · TUYỆT KỸ! | **Hụt mất rồi — quái đánh trả, hồi 1 máu · Bốp nhẹ · Bốp mạnh · SIÊU BỐP!** |
| `nhanCombo` | Chiêu | **Bốp** |
| `moMan` | X xuất hiện! | **X nhảy ra kìa!** |
| `huongDan` | Mỗi 3 câu tung 1 chiêu — đúng cả 3 là TUYỆT KỸ | **Mỗi 3 câu bốp 1 phát — đúng cả 3 là SIÊU BỐP** |
| `daXong` · `hetDoiHinh` | Đã bị hạ · Hạ hết đội hình! | **Đã chịu thua · Cả đám chịu thua rồi!** |
| `yeu.tieuDe` · `hoi` · `nut` | Rèn lại điểm yếu · …đối đầu quái vật điểm yếu chưa? · Vào trận! | **Rèn lại điểm yếu · Hơi run một chút… nhưng mình làm được, sẵn sàng chưa? · Xông lên!** |
| còn lại (`chieuChiTiet`, `doiHinh`, `nhanBoss`, `nhanThuong`, `con`, `yeu.dong*`, `ketQua`) | — | giữ nguyên `LOI_GAME` |

---

## 6. Hoạt họa — cách dựng (Claude làm, không đặt ChatGPT)

**Nguyên tắc:** nhún nhảy mềm, ngộ nghĩnh nhưng không gây xao nhãng; tắt hết khi máy bật `prefers-reduced-motion`; dừng đồng hồ khi tab ẩn; tính khung theo
**delta thời gian** (luật `Animation/ANIMATION.md`). Tải đủ 9 tư thế trước khi chạy. Màn làm bài: **không** linh vật, không hoạt họa nền.

| Tầng | Nguồn | Chuyển động |
|---|---|---|
| ① Đường viền "sôi" (*line boil*) | code — bộ lọc SVG `feTurbulence` + `feDisplacementMap`, đổi hạt giống 3 giá trị xoay vòng, **6 hình/giây**, độ lệch ≤ 1,5px | Áp cho linh vật Home (và quái trong màn đấu nếu máy đủ khoẻ). Không áp cho thẻ / chữ. Máy yếu ⇒ tự tắt (đo thời gian khung) |
| ② Nhún – dẹt – giãn (*squash & stretch*) | code — `scale` quanh điểm chân | Thở: dẹt 2% / 1,6 giây. Đổi tư thế: dẹt 8% → giãn 6% → về, 220 ms — che luôn bước nhảy giữa 2 hình |
| ③ Tư thế | N2 (9 hình / linh vật) | Kịch bản Home: mở màn ⇒ `vay_1 ↔ vay_2` × 3 rồi về đứng · chớp mắt 120 ms mỗi 3–6 giây · ngẫu nhiên 20–40 giây: `an_1 → an_2 → an_1` · để yên > 60 giây ⇒ `ngu` (chạm vào ⇒ giật mình `lo` rồi về đứng) · chạm vào linh vật ⇒ `vui` 1 nhịp |
| Hiệu ứng nền | N2 nhóm C + code | 2–3 bông hoa / bụi cỏ đung đưa rất chậm (xoay ±3°, 4 giây) · bướm bay ngang 1 lần / 30–50 giây |
| Màn đấu | N2 #20, #21, #23 | Trúng đòn: quái dẹt + cụm bụi "bụp" + sao mập văng ra · hụt: linh vật `lo` + giọt mồ hôi. `mung_khoc` dùng ở thẻ kết quả khi qua màn |

`vui` / `mung_khoc` / `lo` chỉ gắn vào **sự kiện đã có sẵn** của màn (mở màn, chạm, đúng / sai, qua màn) — không thêm logic, không thêm số liệu.
Hợp đồng cần thêm: `Skin.linhVatSong?` (9 tư thế + điểm chân + bật line boil) — style không khai ⇒ nhân vật tĩnh như cũ. Nếu Lo-fi dựng trước thì
gộp chung 1 trường với `homeSong` của Lo-fi (mục 6 đơn Lo-fi), không đẻ 2 cơ chế.

---

## 7. Token + kế hoạch dựng code (Claude làm khi hình về)

**Token đề xuất** (`skin/styles/dangYeu.ts` — chỉnh lại theo #01 được duyệt):

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `id` · `ten` · `giongGi` | `dang_yeu` · Đáng yêu · Chiikawa · Sumikko | |
| `font` · `fontHead` | `'Baloo 2'` · `'Mali', 'Baloo 2'` (700) | Mali chưa có trong `hs.html` — đo dấu tiếng Việt bằng chụp thử; hỏng ⇒ Baloo 2 800 |
| `headCase` · `headTrack` | `none` · `0.01em` | |
| `radius` · `radiusPill` · `cardClip` · `blur` | `22px` · `999px` · `none` · `none` | |
| `cheDo` | `['sang']` | |
| `sang.bg` · `nenTrong` | `#e4f1cf` · `#fff8ee` | cỏ non nhạt (nền dự phòng) · kem cho màn trong |
| `sang.surface` · `surface2` | `rgba(255,253,248,0.96)` · `rgba(255,179,199,0.28)` | trắng sữa · hồng má |
| `sang.ink` · `muted` · `line` | `#4a342a` · `#8a7468` · `rgba(74,52,42,0.25)` | nâu = màu nét viền |
| `sang.acc` · `accInk` | `#c93a6e` · `#ffffff` | hồng ĐẬM (≈4,6:1 với trắng — hồng dâu `#f07fa0` chỉ ~2,6:1, không đọc được) |
| `sang.badge` · `badgeInk` | `#e8506e` · `#ffffff` | |
| `sang.cardBorder` · `cardShadow` | `2.5px solid #4a342a` · `0 4px 0 rgba(74,52,42,0.18)` | viền nâu dày + bóng cứng |
| `theTiep` | nền `#ffe9a8`, chữ `#4a342a`, viền `2.5px solid #4a342a` | |
| `nenTen` | `rgba(255,253,248,0.92)` | style sáng ⇒ không bật bóng chữ tối |
| `hinhNen` | `dong_co` (mặc định) · `pho_nho` · `hoang_hon` — mỗi cái `sang` + `sangDoc` | phủ sương kem nhẹ ở 1/4 trên cho tiêu đề chữ nâu (như Khối) |
| `loi` · `dauThayIcon` | `LOI_DANG_YEU` (mục 5) · `✿` | |

**Thứ tự dựng:**
1. `skin/kieu.ts`: `SkinId` thêm `'dang_yeu'` · `skin/styles/dangYeu.ts` · `registry.ts` thêm vào `SKINS` · `hs.html` thêm `Mali:wght@500;700`.
2. **Migration nới CHECK** `hs_giao_dien.skin` thêm `'dang_yeu'` — GIỮ mọi giá trị đang có lúc viết (đọc từ DB: hiện `toi_gian · dau_truong · y2k · soft ·
   rpg · khoi`, có thể đã thêm `lofi`), khuôn như `202610030147_hs_giao_dien_skin_khoi.sql`. Thùy áp bằng chuỗi GHI → `npm run schema` → deploy.
3. Nén hình N1 theo bảng đổi tên (`public/bk-ui/hs/skin/dang_yeu/`) · `npm run check:style-hs` ✔.
4. Viền tay: bản đầu dùng viền CSS. Muốn viền run tay thật ⇒ thêm `Skin.khungThe?` / `khungNut?` (kiểu `Khung9` đã có trong `kieu.ts`) + `border-image`
   ở `TheHS` / `NutHS` — style không khai ⇒ viền CSS như cũ.
5. N2 hoạt họa (`linhVatSong`) · N3 `hocTap` + `chinhPhuc` + `sanDau` (`dangYeuHocTap.ts`) · N4 `banDo2d` + `quai2d` (`dangYeuBanDo2d.ts`) + bảng màu 3D
   `skin/the3d/bangMauDangYeu.ts` + `game`.
6. Soi bằng mắt: Home ngang + dọc × 3 nền · 1 màn danh sách · 1 màn làm bài · 1 màn rỗng · Học tập · bản đồ · màn gamification (hình chung RPG trên nền
   sáng phải còn đọc được). Xem không cần đăng nhập: `hs.html?xem=gami&skin=dang_yeu&man=home` (+ `&nen=pho_nho|hoang_hon`).

---

## Bảng đổi tên: file ChatGPT giao → file code (Claude làm, Thùy không cần làm)

| ChatGPT giao | Code dùng (`public/bk-ui/hs/skin/dang_yeu/`) | Nén |
|---|---|---|
| N1 #01–#04 ảnh toàn cảnh | `design/handoff/hs-skin-nho-xinh-v1/reference/*.jpg` (ảnh chuẩn, không vào app) | JPG q85 |
| `nx_bg_<nền>_ngang` · `nx_bg_<nền>_doc` | `bg_<nền>_ngang.jpg` · `bg_<nền>_doc.jpg` | JPG ~q80, ≤ 1672px |
| `nx_nv_nam` · `nx_nv_nu` | `nv_nam.png` · `nv_nu.png` | PNG 640×800 |
| `nx_o_<ô>` | `o_<ô>.png` — `o_tren_lop` · `o_et` · `o_btvn` · `o_tu_luyen` · `o_nhiem_vu` · `o_rank` · `o_thong_tin` · `o_so_tay` · `o_thi_thu` · `o_bai_tap_giao` · `o_cup` · `o_xep_hang` · `o_may_man` · `o_vi_xu` · `o_hoc_tu_dau` · `o_the_gioi` · `o_thu_vien` · `o_tro_choi` | PNG 160px |
| `nx_b_lich` · `nx_b_kiem_tra_lai` | `b_lich.png` · `b_kiem_tra_lai.png` | PNG 160px |
| `nx_tt_goc` · `nx_tt_gach` | `corner.png` · `divider.png` | PNG 192px · 768×96 |
| `nx_khung_the` · `nx_khung_nut` | `khung_the.png` · `khung_nut.png` (+ số đo cắt 9 mảnh trong style) | PNG 640×480 · 640×180 |
| N2 `nx_<nam\|nu>_<tư thế>` | `song/<nam\|nu>/<tư thế>.webp` | WebP 640×800 |
| N2 `nx_fx_*` | `song/fx_<tên>.webp` | WebP 128–256px |
| N3 #02–#06 `nx_o_*` | `o_hoc_chu_de.png` · `o_luyen_yeu.png` · `o_dau_truong.png` · `o_chinh_phuc.png` · `o_giai_vo_dich.png` | PNG 160px |
| N3 #07–#13 | `hoctap/nen_ngang.jpg` · `hoctap/nen_doc.jpg` · `hoctap/dao_<ô>.webp` | JPG q82 · WebP 768² |
| N3 #15–#27 | `chinhphuc/nen.jpg` · `thap_tong.webp` · `thap_cd_<i>.webp` · `de_tong.webp` · `de_cd.webp` · `cau_sang.webp` | như Khối |
| N3 #28 | `dau_truong/nen_san_dau.jpg` | JPG 1600×574 |
| N4 `nen_the_gioi` · `dao_*` · `nen_vung_*` · `nen_dang_*` · `moc_*` · `be_da` · `may_suong` · `co_chinh_phuc` · `la_ban` | `phieuluu2d/` cùng tên như `khoi/phieuluu2d/` | nền JPG q82 1672×941 · mốc WebP 256² |
| N4 `quai_*` · `boss_*` | `quai/<loài>.webp` (như `khoi/quai/`) | WebP 512² |

Ô → icon (khai `anhO` trong `skin/styles/dangYeu.ts`): `giao_trinh → o_tren_lop` · `thanh_tuu → o_cup` · `xep_hang → o_xep_hang` ·
`tu_luyen_rieng → o_tu_luyen` · `de_thi_thu → o_thi_thu` · còn lại cùng tên ô.
