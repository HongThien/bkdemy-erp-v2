# Spec — Giao diện app HS: skin theo 3 nhóm khối + Home mới (chi tiết nhất cho lớp 9–12)

> Nguồn: phiên 28/09/2026 (Thùy + Claude). Trang đề xuất có mockup chạy được:
> https://claude.ai/artifact/LZF11536BxanSuLQcnbWiR · DEVLOG 28/09 (6)(7)(8).
> Trạng thái: **P1 lớp 9–12 ĐÃ BUILD 28/09** — mig `202609281346_hs_giao_dien_skin` · `src/screens/hocsinh/skin/registry.ts`
> (5 skin: Tối giản · Đấu trường · Y2K · Soft Hàn · Anime RPG) · `HomeHS912.tsx` (Home mới + nút **Hình nền** + tấm chọn + hướng
> dẫn lần đầu) · `src/lib/giaodien_hs.ts`. Còn: Lo-fi (chờ Đơn 3) · nhập ngày thi vào `lich_thi_lon` · lớp 3–5 / 6–8 (chờ Đơn 1–2) ·
> tầng 2 (màu nhấn, widget) · reskin các màn con (mới chỉ bỏ màu theo giới tính).
>
> **⭐ CẬP NHẬT 29/09 (đè phần trên chỗ nào mâu thuẫn):**
> - **Chỉ còn 1 style dùng thật: Anime RPG** — 4 skin code-dựng (Tối giản · Đấu trường · Y2K · Soft Hàn) ĐÃ XOÁ (Thùy gật); 12 em đang lưu skin cũ
>   ⇒ `laySkin()` tự ra RPG, DB giữ nguyên. Style áp cho TOÀN BỘ màn HS (không chỉ Home), mặc định RPG cho mọi em.
> - **Luật style = `design/STYLE-HS.md`** (1 style gồm gì · màn mới dựng thế nào · thêm style thế nào) · hợp đồng `skin/kieu.ts` · gói `skin/styles/<id>.ts`
>   · `npm run check:style-hs` chạy trước mọi commit đụng app HS (màu gõ tay chỉ được giảm · mọi ô có icon ở mọi style · mọi file hình tồn tại).
> - **Style 2 = Thị trấn (Town)** — hình đã về 29/09, kiểm hàng + kế hoạch build ở **§9**.
> - Hình gamification (huy hiệu, bậc rank) là 1 bộ CHUNG mọi style — xem `spec-thanh-tuu-nhiem-vu.md` §0.8 C11.

---

## 1. Phạm vi — 3 nhóm khối, mỗi nhóm 1 bộ skin riêng (Thùy chốt 28/09)

| Nhóm | Thiết bị | Skin gốc | HS chọn |
|---|---|---|---|
| Lớp 3–5 | iPad/laptop, máy dùng chung | Thị trấn (Play Together) | 3 làng + 3 linh vật |
| Lớp 6–8 | iPad/laptop hoặc máy bố mẹ, không có máy riêng | Khối vuông (Minecraft/Roblox) | 3 vùng đất (1 vùng tối) + 3 bạn đồng hành |
| **Lớp 9–12 (phần lớn spec này)** | **Có điện thoại riêng** | Tối giản | 6 skin × sáng/tối |

- Nhóm có máy riêng: đăng nhập giữ lâu, dùng buổi tối ⇒ nền tối, nhận nhắc việc, chia sẻ MXH. Nhóm máy chung: phiên ngắn,
  **skin đi theo TÀI KHOẢN chứ không theo máy**, không nhắc việc.
- Ranh giới nhóm = khối lấy từ lớp đang học. ⚠ Code hiện chia khác: `laCap1HS` (cấp 1) · `laCap2HS` (khối 6–9 dùng HomeHS + KHU_CAP2)
  · khối 10–12 dùng KHU cũ. **Khối 9 phải chuyển sang nhóm 9–12** khi build.
- Registry skin gắn nhãn nhóm; mỗi nhóm thấy danh sách skin riêng, cùng 1 cơ chế, cùng bảng `hs_giao_dien`.

## 2. Quyết định CEO (28/09)

| # | Câu | Chốt |
|---|---|---|
| 1 | Nhóm | 3 nhóm: lớp 3–5 · 6–8 · 9–12 (9–12 có điện thoại riêng), mỗi nhóm bộ skin riêng |
| 2 | Cho HS bầu trước? | **Không.** Làm trước rồi đo xem HS chọn gì ⇒ lựa chọn skin phải ghi vết để đếm (§5) |
| 3 | Ngày thi cho widget đếm ngược | **Trung tâm nhập sẵn**, HS không nhập |
| 4 | Điểm công khai hay riêng? | **Điểm của ai người đó thấy.** Không có nút tuỳ chọn. (Rank/Elo trên bảng xếp hạng vẫn theo `spec-thanh-tuu-nhiem-vu.md` v2 — công khai vì là game) |
| 5 | Ai design | Claude design bằng code; phần cần vẽ hình thì Claude viết prompt, Thùy đưa ChatGPT (§6) |
| 6 | Chia sẻ thẻ thành tích lên MXH cần PH đồng ý? | Không cần |
| 7 | Skin có khoá theo nhóm tuổi? | **Không** (28/09 tối). Mọi skin mở cho mọi em — "lớp 6 vẫn thích anime". Nhóm tuổi chỉ là chuẩn để THIẾT KẾ skin. Đã mở Home mới cho khối 6–12 (`KHOI_CHON_SKIN`); cấp 1 còn HomeCap1 iPad, chưa chuyển |

## 3. Chẩn đoán (vì sao HS chê Home v4)

Home v4 coi HS như trẻ con: khẩu hiệu động viên viết tay ở mọi ô · pastel/trái tim/chibi · màu + nhân vật gán theo `gioi_tinh` ·
hero 1/3 màn dành cho hình trang trí · không nền tối · chữ Pacifico 10–11px. (NN/g Teen UX: teen ghét giọng kẻ cả và thiết kế con nít.)

## 4. Home mới (1 bố cục cho mọi skin)

Từ trên xuống: **tên + lớp + rank** → **Việc tiếp theo** (ca/bài gần nhất: gì · mấy giờ · phòng · hạn) → **2 widget** (mặc định: đếm
ngược kỳ thi · rank mùa) → **4 ô việc** (Bài trên lớp · BTVN · Tự luyện · Thi thử; badge = việc còn làm được) → **thanh điều hướng**.

- Bỏ: câu chào viết tay, nhân vật, khẩu hiệu, doodle, decor sách/cốc, `THEME = {nam, nu}`.
- Chữ chính ≥ 15px, không font viết tay ở chỗ có thông tin.
- "Việc tiếp theo", badge, đếm ngược = **hàm Postgres** `fn_hs_home_*` (§2.0 CLAUDE.md); client chỉ vẽ.

## 5. Skin

6 skin × (sáng | tối). Mặc định = **Tối giản**, chế độ theo cài đặt điện thoại.

| Skin | Tham chiếu | Font | Cần hình? |
|---|---|---|---|
| Tối giản | iOS, Notion | Lexend | Không |
| Đấu trường | Valorant, Liên Quân | Chakra Petch | Không |
| Y2K | Poster Gen Z | Unbounded + Be Vietnam Pro | Không |
| Soft Hàn | Locket (= Home v4 bỏ sến) | Be Vietnam Pro | Không (nền gradient CSS) |
| Lo-fi đêm | Lofi Girl, study with me | Nunito | **Có** — tranh nền (§6.1) |
| Anime RPG | Genshin, Star Rail | Philosopher | **Có** — tranh nền + hoa văn + 4 icon (§6.2) |

Token màu của từng skin: xem CSS trong trang đề xuất (class `.t-clean` … `.t-soft`) — đó là bản gốc để chuyển sang registry.

**Kỹ thuật:**
- Registry skin (1 file): mỗi skin = bộ biến CSS sáng + tối, font, danh sách hình, nhãn nhóm. Component chỉ đọc biến.
  **Cấm `if (skin === …)` trong component** (cùng luật đối xứng môn §1.6).
- Kiểm tương phản chữ mọi skin × 2 chế độ trong `design-check`.
- **Dữ liệu:** bảng `hs_giao_dien` (1 dòng / HS, chỉ có dòng khi HS đã chọn — chưa có = mặc định, §1.5): `skin`, `che_do`
  (`sang|toi|he_thong`), `mau_nhan`, `widgets text[]`, `hinh_nen`. Skin là dữ liệu **không-học-tập** ⇒ không nhãn môn.
  **Trigger ghi vết** mọi lần đổi (actor + ts + cũ/mới) ⇒ đây chính là "phiếu bầu" thay cho vòng hỏi HS (quyết định #2):
  đếm skin đang dùng, skin bị bỏ sau 1 tuần, theo khối.
- Bảng `ky_thi` (trung tâm nhập): tên, ngày, khối áp dụng. Widget đếm ngược đọc qua hàm, không tính ở client.

## 6. Tự chỉnh (3 tầng)

1. **Chọn skin + sáng/tối** — miễn phí, ai cũng có. *(P1)*
2. **Trong skin:** màu nhấn (5–6 màu có sẵn) · hình nền (bộ có sẵn của skin; ảnh riêng để P3) · bật/tắt + sắp widget trong bộ có sẵn
   (đếm ngược · rank mùa · giờ học tuần · dạng yếu) · khung avatar + danh hiệu (chỉ qua rank/thành tựu, không mua). *(P2)*
3. Tự thiết kế giao diện tự do — **không làm.**

Tính năng đi kèm: thẻ thành tích dọc 9:16 để đăng story (có logo BK) · tổng kết tháng kiểu Spotify Wrapped · hẹn giờ tập trung. *(P2)*

## 7. Lộ trình

- **P1:** Home mới + registry skin + `hs_giao_dien` (+ trigger log) + `ky_thi` + màn chọn skin · ra mắt 4 skin chỉ-code
  (Tối giản, Đấu trường, Y2K, Soft Hàn). Đo 2 tuần: tỉ lệ đổi skin, skin nào giữ, số lần mở app/tuần trước–sau.
- **P2:** Lo-fi + Anime RPG khi có hình · tầng 2 · thẻ story · tổng kết tháng · hẹn giờ.
- **P3:** hình nền ảnh riêng · skin theo mùa · bỏ skin không ai dùng.

## 8. Đơn đặt hàng ChatGPT

Toàn bộ đơn (4 đơn: lớp 3–5 Thị trấn · lớp 6–8 Khối vuông · lớp 9–12 Lo-fi · lớp 9–12 Anime RPG) nằm ở
`design/DON-HANG-SKIN-HS.md` — 1 nguồn duy nhất, không chép lại ở đây.

## 9. Style 2 — Thị trấn (Town) · kiểm hàng + kế hoạch build (29/09)

**Hình:** `design/bk-ui-src/Style_Town/Town_01…27.png` (Đơn 1 v2, giao từng hình). Bảng kiểm từng file + đơn bổ sung + bảng đổi tên:
`design/DON-HANG-SKIN-HS.md` mục "Đơn 1 v2 — KIỂM HÀNG 29/09".
- **Đủ:** 2 ảnh toàn cảnh (iPad #01 · điện thoại #02 — chuẩn để dựng) · nền làng biển + làng nấm (ngang + dọc) · 3 linh vật (mèo · cún · rồng) ·
  7 icon ô (tự luyện · thông tin · sổ tay · thi thử khoá · bài tập giao · cúp · may mắn) · banner kiểm tra lại · lịch.
- **Thiếu 7 hình** (từ #19 ChatGPT vẽ lệch danh sách): 5 icon ô **bài trên lớp · BTVN · ET · ví xu (heo đất) · học từ đầu** + 2 nền **làng kẹo**
  (bản dọc sai tỉ lệ 2:3, cả 2 kín chi tiết). Đơn bổ sung #28–#34 đã soạn, dán vào đúng context đang vẽ.

**Khác RPG:** Town là style **SÁNG** (chữ tối trên nền sáng, `cheDo: ['sang']`), font **Baloo 2**, ô kiểu "thạch" (nền kem, viền dưới đậm cùng tông),
và dùng **LINH VẬT** thay nhân vật người.

**Kế hoạch build (thứ tự):**
1. **Gói style** `skin/styles/town.ts` theo hợp đồng `kieu.ts`: bảng màu sáng lấy từ ảnh #01/#02 · `hinhNen` = lang_bien · lang_nam (lang_keo thêm khi
   #33/#34 về — thiếu 1 nền không chặn ra mắt) · `anhO` 13 ô · `anhBanner` (lịch · kiểm tra lại) · không `trangTri` (ảnh gốc không có).
   Font Baloo 2 vào `hs.html`. Hình nén vào `public/bk-ui/hs/skin/town/` (nền JPG ~q80, icon PNG 160–192px), ảnh #01/#02 vào
   `design/handoff/hs-skin-town-v1/reference/`.
   5 ô thiếu icon: **tạm** dùng hình thừa gần nghĩa nhất (ET ← bia bắn cung #26 · học từ đầu ← bản đồ đường đi #24 · ví xu ← rương xu #19 ·
   bài trên lớp / BTVN ← chưa có hình gần nghĩa ⇒ `dauThayIcon`) và ghi rõ là tạm; #28–#32 về thì thay. (`check:style-hs` đòi mọi ô có icon ⇒
   2 ô dùng dấu thay phải được script chấp nhận có ghi chú, không nới luật im lặng.)
2. **Migration nới CHECK `hs_giao_dien.skin`** thêm `'town'` (hiện: toi_gian · dau_truong · y2k · soft · rpg — GIỮ 4 giá trị cũ vì 12 em còn lưu).
   Thiếu bước này ⇒ DB chặn đúng lúc em bấm Lưu (CLAUDE.md §2.1).
3. **Nhân vật / linh vật lên Home** — việc chung mọi style (RPG cũng đang treo mục này): hợp đồng thêm `nhanVat?: { id, ten, anh }[]` ·
   cột MỚI `hs_giao_dien.nhan_vat` (chỉ có giá trị khi em chọn; chưa chọn = con đầu danh sách) · tấm chọn trong nút Hình nền · HomeHS912 có chỗ
   đặt nhân vật theo "BỐ CỤC CHUNG" — style không khai `nhanVat` thì không hiện (dữ liệu quyết định, không `if skin`).
4. **Lời chào + thanh Cấp/XP/xu + bong bóng thoại có số thật** (ảnh #01: "Chào Minh Khang!" · "Cấp 12 · 640/1000" · "1.240 xu" · "Còn 3 câu nữa
   là đủ 10 câu hôm nay!") — cũng là việc chung mọi style. Số phải từ DB: thêm vào `fn_hs_home_912` (cấp, XP trong cấp, xu, câu thoại).
   **Chặn trước:** công thức cấp/XP đang ở client `src/gami/level.js` ⇒ phải chuyển sang hàm Postgres trước (CLAUDE.md §2.0).
5. Soi bằng mắt: Home 2 khổ × 2 nền · 1 màn danh sách · 1 màn làm bài · 1 màn rỗng · màn gamification (hình chung RPG trên nền sáng phải còn đọc được).
