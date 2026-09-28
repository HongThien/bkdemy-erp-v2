# Spec — Giao diện app HS khối 9–12: skin tự chọn + Home mới

> Nguồn: phiên 28/09/2026 (Thùy + Claude). Trang đề xuất có mockup chạy được:
> https://claude.ai/artifact/LZF11536BxanSuLQcnbWiR · DEVLOG 28/09 (6)(7)(8).
> Trạng thái: **ĐÃ CHỐT HƯỚNG, CHƯA CODE.**

---

## 1. Phạm vi — chia nhóm theo ĐIỆN THOẠI, không theo tuổi

| Nhóm | Khối | Thiết bị | Hệ quả thiết kế |
|---|---|---|---|
| **A (spec này)** | **9–12** | **Có điện thoại riêng** | Đăng nhập giữ lâu · dùng buổi tối ở nhà ⇒ nền tối · nhận nhắc việc · tự chỉnh "của mình" · chia sẻ lên MXH |
| B (làm sau) | ≤ 8 | Không có máy riêng: máy trung tâm / iPad / máy bố mẹ | Máy dùng chung ⇒ phiên ngắn, đăng nhập lại mỗi lần, không nhắc việc, skin phải đi theo TÀI KHOẢN chứ không theo máy. Nháp: https://claude.ai/artifact/M2w9GCJzYAaa1hB1NULg6x (viết cho 9–12 tuổi, phải xem lại) |

Ranh giới nhóm = **khối**, lấy từ lớp đang học. Registry skin gắn nhãn nhóm; mỗi nhóm thấy danh sách skin riêng, cùng 1 cơ chế.

## 2. Quyết định CEO (28/09)

| # | Câu | Chốt |
|---|---|---|
| 1 | Nhóm | Khối 9–12 (có điện thoại riêng) tách khỏi khối dưới |
| 2 | Cho HS bầu trước? | **Không.** Làm trước rồi đo xem HS chọn gì ⇒ lựa chọn skin phải ghi vết để đếm (§5) |
| 3 | Ngày thi cho widget đếm ngược | **Trung tâm nhập sẵn**, HS không nhập |
| 4 | Điểm công khai hay riêng? | **Điểm của ai người đó thấy.** Không có nút tuỳ chọn. (Rank/Elo trên bảng xếp hạng vẫn theo `spec-thanh-tuu-nhiem-vu.md` v2 — công khai vì là game) |
| 5 | Ai design | Claude design bằng code; phần cần vẽ hình thì Claude viết prompt, Thùy đưa ChatGPT (§6) |
| 6 | Chia sẻ thẻ thành tích lên MXH cần PH đồng ý? | Không cần |

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

## 8. Prompt ChatGPT (dán nguyên, kèm `design/CHATGPT-UI-KIT.md` như mọi lần)

> Lưu ý chung cho 2 đơn: bố cục + chữ + khung **đã do code dựng**, ChatGPT **chỉ sinh asset** (bỏ Pha B/C của kit, vào thẳng Pha D).
> Ghi đè §1 "Nền tảng chung" của kit: **không** dùng Baloo 2/Pacifico cho skin này; màn **có** thanh điều hướng dưới.
> Gửi kèm ảnh chụp mockup skin đó từ trang đề xuất làm tham chiếu màu.

### 8.1 Đơn — skin Lo-fi đêm

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            skin-lofi
Mô tả màn:      Bộ hình nền cho skin "Lo-fi đêm" của màn Home app học sinh cấp 3 (khối 9–12, 14–18 tuổi), điện thoại dọc 430px.
                Bố cục, chữ, thẻ, nút ĐÃ DỰNG BẰNG CODE (xem ảnh tham chiếu đính kèm). Bạn CHỈ sinh tranh nền.
Phần tử ĐỘNG:   không có trong asset (toàn bộ chữ/số do code vẽ).
Trạng thái:     không.
Biến thể:       2 tranh nền để HS tự chọn: "cửa sổ đêm thành phố" và "cửa sổ mưa".
Phong cách:     lo-fi study aesthetic, anime background painting (kiểu tranh nền Lofi Girl / Makoto Shinkai nhưng TỰ VẼ, không chép),
                tông chàm #1d1b3a → tím mận #3b2b52, một nguồn sáng ấm đèn bàn cam #ffb066 ở góc trên phải.
Giữ nguyên:     không vẽ thẻ/chữ/nhân vật. Code sẽ đặt các thẻ bán trong suốt lên 75% phía dưới.
Phiên bản kit:  v1
Bỏ Pha B và C. Vào thẳng Pha D: sinh 2 file dưới, viết DESIGN.md ngắn (bảng 2 dòng loại BACKDROP), đóng zip hs-skin-lofi-v1.zip.
```

```
BACKDROP 1: Generate backdrop_lofi_city.png, 1080×1920 portrait. Cozy teenager's study corner at night seen from inside:
a large window in the upper third showing a distant Vietnamese city skyline with soft bokeh lights, a warm desk lamp glow
entering from the top-right corner, a few plants and a stack of books silhouetted on the windowsill. Lo-fi anime background
painting, soft grain, deep indigo #1d1b3a to plum #3b2b52 palette, warm orange #ffb066 accent light only near the lamp.
The lower 75% must be calm, dark and low-detail (just a softly lit wall/desk surface) so translucent cards on top stay readable.
ABSOLUTELY NO text, NO people, NO characters, NO animals, NO UI, NO frames, NO logos.

BACKDROP 2: Generate backdrop_lofi_rain.png, same size, same palette and same composition rules as backdrop_lofi_city.png,
but the window shows rain: raindrops and streaks on the glass, blurred street lights behind, slightly cooler blue in the window.
Lower 75% calm and dark. ABSOLUTELY NO text, NO people, NO characters, NO animals, NO UI, NO frames, NO logos.
```

### 8.2 Đơn — skin Anime RPG

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            skin-rpg
Mô tả màn:      Bộ asset cho skin "Anime RPG" của màn Home app học sinh cấp 3 (khối 9–12), điện thoại dọc 430px.
                Bố cục, chữ, thẻ, nút ĐÃ DỰNG BẰNG CODE (xem ảnh tham chiếu). Bạn CHỈ sinh: 1 tranh nền, 2 hoa văn, 4 icon ô chức năng.
Phần tử ĐỘNG:   không có trong asset.
Trạng thái:     không.
Biến thể:       không.
Phong cách:     giao diện game anime fantasy cao cấp (cảm hứng Genshin Impact / Honkai: Star Rail) nhưng THIẾT KẾ GỐC — không dùng
                nhân vật, biểu tượng, logo hay hoa văn nhận ra được của game nào. Xanh đêm #141a33 / #2c3a66 + vàng cổ #e9c77b / #f4d98f.
Giữ nguyên:     chữ tiếng Việt do code vẽ bằng font Philosopher, không đưa chữ vào asset.
Phiên bản kit:  v1
Bỏ Pha B và C. Vào thẳng Pha D: sinh 7 file dưới, viết DESIGN.md (bảng 7 dòng), đóng zip hs-skin-rpg-v1.zip.
```

```
BACKDROP: Generate backdrop_rpg_sky.png, 1080×1920 portrait. Fantasy night sky: deep navy #141a33 fading to #2c3a66 at the top,
faint constellations, a few small floating islands with tiny glowing ruins in the upper quarter only, thin gold light rays.
Painterly anime-game style, high polish. The lower 75% must be calm, dark, nearly empty (only faint stars) so cards stay readable.
ABSOLUTELY NO text, NO characters, NO UI panels, NO frames, NO logos.

DECOR 1: Generate decor_rpg_corner.png, 512×512, TRANSPARENT background. One ornate antique-gold filigree corner ornament
(top-left orientation, the two arms run along the top and left edges), fine engraved lines, subtle metallic shading, gold #e9c77b
to #f4d98f with dark bronze #6b5a33 edges. Will be rotated in code for the other 3 corners. Nothing else in the image.

DECOR 2: Generate decor_rpg_divider.png, 1024×128, TRANSPARENT background. A horizontal ornamental divider: thin gold line
with a small four-point star gem in the center and tapered flourishes to both ends, same gold palette as decor_rpg_corner.png.
Nothing else in the image.

ILLUST (×4, each 512×512, TRANSPARENT background, same lighting, same gold+navy+one accent colour, game item icon style,
centered with ~8% margin, no frame, no text):
  ill_rpg_lop.png      — a quill resting on an open parchment scroll with a faint blue glow (lớp học / bài trên lớp)
  ill_rpg_btvn.png     — a sealed letter with a gold wax seal and a small ribbon (bài tập về nhà)
  ill_rpg_luyen.png    — a floating faceted crystal, cyan core, gold cage (tự luyện)
  ill_rpg_thithu.png   — an ornate closed treasure chest with gold trim and a keyhole glow (thi thử)
If you cannot produce real transparency, say so and use a flat #00FF00 background instead. Never erase white by colour-keying.
```
