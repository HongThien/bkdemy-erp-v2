# YÊU CẦU KỸ THUẬT — TRANH TRANG CHÍNH ERP BKdemy (bản 2: TRANH LIỀN + Ô TRỐNG)

> **Dán nguyên mục A cho ChatGPT khi đặt một tranh mới.** Phiên bản 14/10/2026 tối — thay khuôn "ghép lớp" (phụ lục B).
> Lý do đổi (Thùy 14/10): tách đồ vật khỏi nền rồi ghép lại làm mất bóng đổ và ánh sáng tương tác — tranh trông giả.
> Cách mới: **giữ nguyên MỘT bức tranh**, trong tranh vẽ sẵn các **ô trống** (bảng trống, thẻ trống, biển trống); app chỉ in
> chữ / số / nút thật lên đúng các ô đó. Không có file đồ vật rời.

---

## A. ĐẶT VẼ (gửi ChatGPT)

### A1. Cần vẽ gì

Vẽ **một bức tranh hoàn chỉnh** cho màn hình chính của phần mềm quản lý trung tâm học thêm (người dùng là giáo viên,
trợ giảng, vận hành). Tranh là một không gian làm việc ấm áp (phòng học, góc làm việc, bảng ghim…), cùng phong cách,
ánh sáng, bóng đổ liền một mạch. Trong tranh có **các ô TRỐNG** dưới đây để phần mềm in chữ lên. **Tranh không được có
bất kỳ chữ, số, ký hiệu, chữ giả nào** — kể cả trên giấy, bìa sách, biển hiệu.

| # | Ô trống phải có | Hình dạng gợi ý | Phần mềm sẽ in lên | Cỡ tối thiểu (trên khổ 1672×941) |
|---|---|---|---|---|
| 1 | **Bảng Notice Board** (trước gọi "Việc hôm nay") — bảng NỔI BẬT nhất tranh | bảng gỗ / bảng ghim / tờ giấy lớn ghim tường | 1 tiêu đề + hàng tab nhỏ + 5 dòng (ô tick · tên · hạn) | 400 × 300 |
| 2 | **Bảng "Việc phát triển"** | bảng / tờ giấy ngang | 1 tiêu đề + 3 dòng có thanh % | 480 × 180 |
| 3 | **Bảng Order** | bảng nhỏ / sổ mở / tấm bìa | 1 tiêu đề + 3 dòng | 380 × 240 |
| 4 | **Thẻ hồ sơ** | thẻ / khung ảnh / bảng tên | ảnh đại diện tròn Ø60 bên trái + "Chào <tên>!" + ngày + biểu tượng thư nhỏ | 340 × 130 |
| 5 | **8 ô Yêu thích** | 8 thẻ treo / ngăn kéo / hộp hồ sơ **cùng một họ** | tên một màn (≤ 24 ký tự, 2 dòng) + ★ nhỏ ở góc trên phải | mỗi ô 200 × 120 |
| 6 | **4 ô nhóm** (có thể 6) | 4 ô **GIỐNG NHAU** (hộp, ngăn, khung) — **không gợi ý nội dung riêng của ô nào** | 1 icon phẳng ở giữa-trên + tên nhóm ở dưới + "n mục" ở góc | mỗi ô 200 × 130 |
| 7 | **2 nút nhỏ** | 2 thẻ treo / nhãn nhỏ cạnh nhau | "Tuỳ chỉnh" · "Giao diện" | mỗi nút 110 × 44 |
| 8 | *(tuỳ chọn)* biển "Yêu thích" | một biển nhỏ trên cụm 8 ô | "★ Yêu thích" | 200 × 40 |

- **Ô yêu thích phải "đẹp khi trống"**: người mới dùng chưa ghim gì thì 8 ô vẫn nằm đó — trông phải tự nhiên (móc treo
  có thẻ trắng, ngăn kéo có nhãn trống…), không như chỗ bị thiếu đồ.
- **Ô nhóm là ô CHUNG**: người dùng tự chọn nhóm nào nằm ô nào (Vận hành, Học thuật, Dashboard…), nên ô không được vẽ
  cúp, sách, máy tính… gợi ý một nhóm cụ thể. Phần mềm tự in icon phẳng lên.
- Nhân vật, thú cưng, cây, đèn, đồ trang trí: **vẽ thẳng vào tranh** (không cần tách lớp), đặt ở chỗ không đè lên ô nào.

### A2. Quy tắc để chữ in lên đọc được

1. **Mặt ô phẳng, nhìn gần chính diện** (không nghiêng phối cảnh quá 10°) — chữ in là chữ thẳng, ô nghiêng nhiều thì chữ trông lệch.
2. **Mặt ô một màu đều**, không vân rối, không hoạ tiết dưới vùng chữ. Ô sáng → chữ đậm; ô tối → chữ sáng. Tương phản ≥ 4.5 : 1.
3. **Không vật gì đè lên mặt ô** (lá cây, dây leo, tay nhân vật, đèn…). Viền ô có thể có lá rủ, mặt ô thì sạch.
4. **Ô gần hình chữ nhật**, lề trong ≥ 12 px giữa mép ô và vùng để chữ.
5. Mọi ô nằm trong vùng an toàn cách mép tranh ≥ 40 px (màn khác tỉ lệ sẽ cắt bớt mép).
6. Ánh sáng, độ bão hoà đồng nhất cả tranh; ô không bị chói sáng/đổ bóng đậm đúng chỗ in chữ.

### A3. Gửi lại những file nào

```
<ten-tranh>/                 chữ thường, gạch ngang, không dấu — vd phong-hoc-nang-chieu
├── scene.jpg                tranh 1672 × 941 px (16:9), JPEG chất lượng ≈ 82, ≤ 450 KB, KHÔNG có chữ
├── scene-4x3.jpg            (khuyến nghị) cùng tranh khổ 1440 × 1080 cho màn vuông / iPad ngang
├── preview-demo.jpg         CÙNG tranh + chữ mẫu tiếng Việt đặt vào các ô — chỉ để duyệt bằng mắt
└── ghi-chu.md               (tuỳ chọn) ô nào ở đâu, màu chữ nên dùng (đậm/sáng), font gợi ý có tiếng Việt
```

Không cần gửi toạ độ chính xác — BKdemy tự khoanh ô trên ảnh (mục C). Nếu gửi kèm toạ độ ước lượng thì càng tốt.

---

## C. Phía BKdemy: từ tranh → Trang chính (làm trong ~10 phút)

1. Chép `scene.jpg` vào `public/bk-ui/erp/canh/<ten-tranh>/`.
2. Mở trang dev **`/xem-thu-canh.html?anh=/bk-ui/erp/canh/<ten-tranh>/scene.jpg`** (`src/_xem_canh.tsx`): chọn ô ở cột trái →
   kéo chuột khoanh trên tranh (★ và "n mục" thì bấm 1 điểm) → tự sang ô kế → **👁 Xem thử** để thấy chữ thật trên tranh →
   chỉnh màu chữ / font trong JSON (`tokens`) → **⬇ Tải manifest.json** bỏ cạnh ảnh.
3. Thêm 1 dòng vào `CANH_ERP` (`src/lib/canhErp.ts`) — cảnh hiện trong 🎨 Giao diện của mọi người.
4. Soi bằng mắt ở 3 khổ (16:9 · 16:10 · 4:3) với tên dài tiếng Việt; chữ tràn thì luật R1–R4 trong `HomeScene` tự co,
   vẫn không vừa thì khoanh lại ô rộng hơn hoặc thêm `inset`.

**Khuôn `manifest.json` của tranh liền** (trang đánh dấu ô sinh ra; toạ độ = px trên ảnh gốc):

```json
{
  "kieu": "lien",
  "style_id": "phong-hoc-nang-chieu", "ten": "Phòng học nắng chiều",
  "canvas": { "width": 1672, "height": 941 }, "tone": "sang",
  "background": { "file": "scene.jpg" },
  "tokens": { "ink": "#3b2a1e", "muted": "#7a6450", "acc": "#c2410c", "acc_ink": "#ffffff", "surface": "#fffaf2",
              "surface2": "#f6ead8", "line": "#e2cfb2", "radius": 14, "font_head": "Baloo 2", "font_body": "Be Vietnam Pro" },
  "zones": {
    "today": [640, 590, 430, 300],
    "development": { "box": [1090, 30, 520, 190], "inset": [16, 12, 16, 12], "ink": "#2b1d12" },
    "order": [ … ], "greeting": [ … ], "favorites_title": [ … ], "toolbar_primary": [ … ], "toolbar_secondary": [ … ]
  },
  "favorite_slots": [ { "box": [640, 262, 214, 128], "label": [648, 332, 198, 50], "star": [836, 280] } ],
  "group_slots":    [ { "box": [1100, 600, 225, 130], "label": [1110, 682, 205, 40], "icon": [1180, 610, 65, 65], "badge": [1290, 616] } ]
}
```

- `zones.*`: `[x, y, w, h]` hoặc `{ box, inset?, ink? }` — `inset` = lề trong [trái, trên, phải, dưới], `ink` = màu chữ riêng ô đó.
- `favorite_slots`: tối đa 8, theo thứ tự yêu thích 1 → 8. `group_slots`: 4 hoặc 6 — số ô nhóm Trang chính hiện = số ô ở đây.
- Thiếu `label`/`icon` thì app tự lấy phần dưới / giữa-trên của ô. Ô yêu thích chưa ghim: app không in gì, tranh tự đứng.
- Code đọc: `canhLien()` trong `src/lib/canhErp.ts` → `HomeScene` (luật chữ R1–R4 dùng chung với khuôn cũ).

---

# PHỤ LỤC B — Khuôn CŨ "ghép lớp" (nền + đồ vật PNG rời + toạ độ) — ĐÃ BỎ cho tranh mới từ 14/10

> Giữ nguyên văn để tham khảo: 3 cảnh đang chạy (`ke-hoc-thuat`, `pegboard`, `lang-bk`) vẫn theo khuôn này và code đọc
> nó (`tai()` trong `canhErp.ts`) chưa gỡ. **Không đặt tranh MỚI theo khuôn này.** Các số mục bên dưới là của bản cũ.

> Dán nguyên file này cho ChatGPT khi đặt một style mới. Mục tiêu: ChatGPT trả về **một bộ file đủ để code ghép cảnh tự động**
> (nền + đồ vật đặt đúng toạ độ + chữ thật do HTML vẽ) mà không phải đoán gì. Thiếu `manifest.json` đúng khuôn = bộ ảnh CHƯA đạt.
> Phiên bản 14/10/2026. Bộ mẫu đã làm: `design/bk-ui-src/AppHS/bk-erp-home-objects-v1/` (3 hướng) — **thiếu toạ độ `place`**, xem §3.

---

## 0. Cách app dùng bộ ảnh (để hiểu vì sao có từng yêu cầu)

App dựng Trang chính theo 4 lớp, từ dưới lên:

1. **Nền** (`background`) — ảnh phòng/cảnh, KHÔNG có bảng, chữ, nút.
2. **Đồ vật** (`objects`) — PNG trong suốt, đặt lên nền đúng `place` trong manifest, theo `z`.
3. **Nhân vật / thú cưng** (`characters`) — PNG riêng, đặt theo `place`. Người dùng có thể **ẩn** (chọn ảnh cá nhân) nên phải tách rời khỏi nền.
4. **Chữ + số + nút + thanh tiến độ + checkbox** — do HTML/CSS vẽ đè lên `text_box` của từng đồ vật. **KHÔNG BAO GIỜ vẽ cứng vào ảnh.**

Ảnh chỉ là "vỏ". Mọi nội dung (tên người, số việc, hạn, %…) là dữ liệu thật, thay đổi theo từng người.

---

## 1. Bố cục chung (mọi style PHẢI theo cùng khuôn)

Canvas chuẩn **1672 × 941 px** (16:9). Mọi style giữ **cùng 6 vùng**, chỉ khác hình vẽ. Toạ độ dưới đây là mốc chuẩn
(sai lệch ±60 px được phép — nhưng toạ độ THẬT phải ghi vào manifest):

| Vùng | Mốc chuẩn (x, y, w, h) | Chứa | Giới hạn nội dung |
|---|---|---|---|
| `today` — Việc hôm nay | 150, 40, 410, 460 | bảng nhỏ góc trái trên: tiêu đề + 2 tab + **5 dòng** (checkbox · tên · "n quá hạn" · x/y) + nút "Hiện tất cả" | 5 dòng, tên ≤ 28 ký tự/1 dòng |
| `greeting` — Lời chào | 575, 25, 285, 170 | avatar tròn Ø56 + "Chào <tên>!" + ngày | tên ≤ 18 ký tự |
| `development` — Việc phát triển | 880, 35, 530, 185 | tiêu đề + **3 dòng** (⚠/● · tên task · thanh % · số %) | tên task ≤ 40 ký tự |
| `toolbar` — 2 nút | 1420, 12, 230, 54 | nút "Tuỳ chỉnh", nút "Giao diện" | — |
| `mail` — Hòm thư | ngay DƯỚI `greeting` (~ 150×56) | **icon phong thư + số chưa đọc màu đỏ** | số tới 99+ |
| `favorites` — Yêu thích | 590, 225, 1000, 365 | **TỐI ĐA 8 ô**, 2 hàng × 4 cột, mỗi ô ≈ 235×165, kèm biển tiêu đề "Yêu thích" | nhãn ≤ 24 ký tự, 2 dòng |
| `order` — Bảng Order | 600, 595, 430, 295 | tiêu đề + 2 tab + nút "Đặt order" + danh sách 3 dòng | — |
| `groups` — Box nhóm | 1035, 595, 610, 295 | **TỐI ĐA 4 box**, 2×2, mỗi box ≈ 200×140, kèm số "n mục" ở góc | nhãn ≤ 20 ký tự |
| `character` — Nhân vật | 0, 430, 600, 511 | nhân vật + thú cưng + bàn học (phần KHÔNG bị UI che) | — |

**Hai quy tắc cứng của thiết kế chung (Thùy chốt 14/10):**
- **Yêu thích: tối đa 8 ô.** Ô nào chưa có mục thì để ô trống/ghim đẹp (xem `favorite-empty` ở §4).
- **Góc dưới: tối đa 4 box nhóm.** Nhưng có **7 nhóm** để người dùng chọn 4 — nên phải vẽ đủ 7 hình nhóm (§4), app chỉ ghép 4.

Vùng nội dung KHÔNG được đè lên nhau; mọi vùng chừa **lề trống ≥ 16 px** để đồ vật không dính mép.

---

## 2. Danh sách file phải trả về (cho MỖI style)

```
<style-id>/                        ví dụ: pastel-hong-lavender  (chữ thường, gạch ngang)
├── manifest.json                  ← BẮT BUỘC, đúng khuôn §3
├── background.jpg                 nền sạch 1672×941, JPEG q≈82, ≤ 400 KB
├── background-4x3.jpg             (khuyến nghị) nền 1440×1080 cùng cảnh, cho màn vuông/iPad ngang
├── objects/                       PNG-24 có alpha, mỗi đồ vật 1 file, đệm trong suốt 12 px quanh viền
│   ├── panel-today.png … (đủ danh sách §4)
├── characters/
│   ├── character.png              nhân vật, nền trong suốt
│   └── pet.png                    thú cưng (nếu có), nền trong suốt
├── atlas.png                      (tuỳ chọn) gộp objects để xem nhanh
├── preview-clean.jpg              nền + MỌI đồ vật + nhân vật ghép đúng `place`, KHÔNG có chữ
├── preview-demo.jpg               như trên + chữ mẫu tiếng Việt để duyệt mắt
└── qa.json                        kết quả tự kiểm §8
```

Ngoài thư mục style, **1 file `STYLE-TOKENS.md`** nếu muốn mô tả ý đồ (không bắt buộc).

---

## 3. `manifest.json` — khuôn bắt buộc

Toạ độ `place` và mọi `*_box` dùng **hệ toạ độ canvas 1672×941** (gốc ở góc trên trái, đơn vị px, số nguyên).
`*_box` bên trong một đồ vật dùng **toạ độ cục bộ của file PNG đó** (gốc ở góc trên trái của chính PNG).

```json
{
  "style_id": "pastel-hong-lavender",
  "ten": "Pastel hồng lavender",
  "canvas": { "width": 1672, "height": 941 },
  "tone": "sang",                          // "sang" = nền sáng (chữ đậm) | "toi" = nền tối (chữ sáng)
  "background": {
    "file": "background.jpg", "width": 1672, "height": 941,
    "an_toan": [150, 25, 1500, 880],       // hình chữ nhật chứa MỌI thứ quan trọng; ngoài vùng này có thể bị cắt khi đổi tỉ lệ
    "tam": [836, 470]                      // điểm giữ khi cắt (cover)
  },
  "background_4x3": { "file": "background-4x3.jpg", "width": 1440, "height": 1080 },
  "tokens": {
    "ink": "#3b2a35", "muted": "#8a7080", "acc": "#e0507a", "acc_ink": "#ffffff",
    "surface": "#fff7fa", "surface2": "#fde8ef", "line": "#f3c5d3", "radius": 16,
    "font_head": "Baloo 2", "font_body": "Be Vietnam Pro"     // font Google Fonts CÓ tiếng Việt
  },
  "regions": {                              // 9 vùng §1 — toạ độ THẬT của style này
    "today": [150, 40, 410, 460], "greeting": [575, 25, 285, 170], "development": [880, 35, 530, 185],
    "toolbar": [1420, 12, 230, 54], "mail": [575, 200, 150, 56], "favorites": [590, 225, 1000, 365],
    "order": [600, 595, 430, 295], "groups": [1035, 595, 610, 295], "character": [0, 430, 600, 511]
  },
  "objects": [
    {
      "id": "panel-today",
      "file": "objects/panel-today.png", "width": 434, "height": 484,
      "place": [138, 28, 434, 484],         // [x, y, w, h] trên canvas — BẮT BUỘC
      "z": 20,                              // thứ tự chồng, số lớn nằm trên
      "text_box": [38, 40, 360, 400],       // vùng viết chữ/nội dung, toạ độ CỤC BỘ trong PNG
      "ink": "#3b2a35",                     // màu chữ nên dùng trong text_box (nếu khác tokens.ink)
      "badge_anchor": null,                 // [x, y] cục bộ nơi đặt số đếm; null nếu không có
      "interactive": false
    },
    {
      "id": "group-van-hanh",
      "file": "objects/group-van-hanh.png", "width": 280, "height": 250,
      "place": [1040, 600, 280, 250], "z": 30,
      "label_box": [24, 190, 232, 44],      // nơi đặt TÊN nhóm (chữ HTML)
      "badge_anchor": [236, 20],            // nơi gắn "13 mục"
      "hit_box": [0, 0, 280, 250],          // vùng bấm
      "interactive": true
    }
  ],
  "characters": [
    { "id": "character", "file": "characters/character.png", "width": 520, "height": 640, "place": [20, 300, 520, 640], "z": 10 }
  ]
}
```

**Quy ước bắt buộc của manifest**
- Mọi đồ vật trong §4 đều phải có mặt, **kể cả đồ vật ChatGPT thấy "không cần"** — thiếu id = báo lỗi.
- `place` phải khớp **đúng** với `preview-clean.jpg`: ghép tự động `background` + `objects` theo `place`/`z` phải ra
  hình giống `preview-clean.jpg` (sai lệch ≤ 2 px). Đây là điều kiện nghiệm thu.
- `text_box`/`label_box` phải đủ chỗ cho **chữ thật** (xem giới hạn §1): ít nhất cao 1,25 × cỡ chữ, rộng đủ cho số ký tự tối đa.
- Không để toạ độ âm, không để `place` vượt canvas > 8 px (cho phép cây/dây leo tràn mép).

---

## 4. Danh sách đồ vật (id CỐ ĐỊNH — code map thẳng theo id)

**A. Bảng chức năng (4)** — mỗi bảng có vùng nội dung rộng, có `text_box`
| id | Nội dung code vẽ lên |
|---|---|
| `panel-today` | Việc hôm nay: 2 tab, 5 dòng checkbox, nút "Hiện tất cả" |
| `panel-greeting` | avatar tròn + "Chào …!" + ngày (`text_box` chừa chỗ avatar Ø56 bên trái) |
| `panel-development` | Việc phát triển: 3 dòng + thanh % |
| `panel-order` | Bảng Order: 2 tab, nút, danh sách |

**B. Yêu thích (tối đa 8 ô)**
| id | Ghi chú |
|---|---|
| `favorite-slot-1` … `favorite-slot-8` | 8 ô **chung, KHÔNG gắn một màn cụ thể** (kẹp giấy, bản đồ, chồng sách, hộp hồ sơ… mỗi ô một đồ khác nhau cho sinh động). Người dùng ghim BẤT KỲ màn nào nên hình không được ngụ ý một màn. Có `label_box` (biển tên), `badge_anchor` (sao ★). |
| `favorite-empty` | ô trống / chưa có mục: móc treo trống hoặc khung mờ, dùng cho các slot chưa dùng |
| *(thưởng, không bắt buộc)* `favorite-et`, `favorite-knowledge-map`, `favorite-textbook`, `favorite-documents`, `favorite-new-map`, `favorite-exams`, `favorite-review` | nếu có: app dùng hình riêng khi người dùng ghim đúng màn đó |

**C. Box nhóm — vẽ đủ 7, app chỉ ghép 4**
`group-viec-cua-toi` · `group-van-hanh` · `group-gamification` · `group-hoc-thuat` · `group-quan-ly-chat-luong` · `group-core-team` · `group-dashboard`
— mỗi cái có `label_box` (tên nhóm, ≤ 20 ký tự), `badge_anchor` ("n mục"), `hit_box`.

**D. Điều khiển (code bấm được)**
| id | Ghi chú |
|---|---|
| `mail-empty`, `mail-unread` | **phong thư** — 2 trạng thái: không có thư / có thư (mở nắp hoặc có dấu). Có `badge_anchor` đặt **số đỏ**. Không vẽ số vào ảnh |
| `btn-primary`, `btn-secondary` | nút bo tròn **9-slice**: kèm `slice: [trái, trên, phải, dưới]` để co giãn không méo |
| `avatar-frame` | khung tròn Ø56–64 viền trang trí; `avatar_circle: [x, y, d]` = vòng trong để chèn ảnh |
| `checkbox-off`, `checkbox-on` | ô tick 24×24 (nếu muốn vẽ riêng; không có thì code dùng CSS) |
| `progress-track`, `progress-fill` | rãnh + phần đầy, **9-slice**, cao 10–14 px |
| `popup-frame` | khung popup lớn **9-slice** (nền popup bảng task / chi tiết), kèm `slice` + `content_box` |
| `tab-on`, `tab-off` | nút chuyển tab (Vận hành / Nhắc việc, Gửi tôi / Tôi đặt) 9-slice |

**E. Trang trí (không bấm được)**: tuỳ ý, ≤ 8 món (`decoration-*`), mỗi món có `place`, `z`, `interactive:false`.

---

## 5. Quy tắc vẽ (bắt buộc)

1. **Không có chữ, số, logo, dấu ✓, thanh tiến độ có giá trị** trong ảnh nền và đồ vật. Kể cả chữ giả, chữ ký, dòng kẻ giấy có chữ.
2. **Nền sạch:** `background` không chứa bảng chức năng, kệ có hàng hoá cố định, nhân vật, thú cưng. Kệ/pegboard TRỐNG được giữ làm mặt nền; **không ghép thêm đồ vật kệ vào đúng chỗ nền đã có kệ** (tránh kệ chồng kệ).
3. **Nhân vật và thú cưng là layer riêng**, không dính nền, không dính bàn/ghế (bàn ghế thuộc nền).
4. **Đồ vật tách sạch:** viền anti-alias sạch, **không quầng trắng/đen**, alpha mượt, không còn mảng nền cũ dính theo.
5. **Hướng sáng và độ bão hoà đồng nhất** giữa nền và đồ vật (cùng một cảnh).
6. **Bóng đổ:** bóng của đồ vật nằm TRONG PNG của nó (trong phần đệm 12 px) hoặc là file `*-shadow.png` riêng; không để bóng làm bẩn nền.
7. **Độ tương phản chữ:** vùng `text_box` phải đủ sáng/tối đều để chữ `ink` đọc rõ ở cỡ 12–14 px; không hoạ tiết rối sau chữ. Đo: tỉ lệ tương phản ≥ 4.5:1 giữa `ink` và màu nền trung bình của `text_box`.
8. **Tỉ lệ & cắt:** mọi thứ quan trọng nằm trong `background.an_toan`. Nền kéo dư 8–10 % mỗi bên để `cover` không cắt vào đồ vật.
9. **Tiếng Việt:** ảnh không chứa chữ nên không lo dấu; nhưng `tokens.font_*` phải là font hỗ trợ đủ dấu tiếng Việt.
10. **Dung lượng:** nền ≤ 400 KB; mỗi đồ vật ≤ 250 KB; tổng style ≤ 3 MB. PNG dùng bảng màu hợp lý, không để 32-bit thừa.
11. **Đặt tên file:** đúng id §4, chữ thường, gạch ngang, không dấu, không khoảng trắng.

---

## 6. Hành vi để ChatGPT vẽ cho đúng (không phải làm thêm file)

- Hover: code tự nâng nhẹ + sáng hơn (CSS) — không cần vẽ trạng thái hover.
- Thẻ "Yêu thích": ô chưa dùng → `favorite-empty`; ô đã dùng → `favorite-slot-N` + nhãn người dùng ghim.
- Box nhóm: người dùng chọn 4 trong 7 và kéo đổi chỗ → 4 vị trí `groups` phải **tráo đổi được** (mỗi vị trí chứa được bất kỳ hình nhóm nào, kích thước các hình nhóm xấp xỉ nhau ±10 %).
- Số đếm đỏ trên phong thư: code vẽ, ảnh chỉ chừa `badge_anchor`.

---

## 7. Style tối (nếu có) — tuỳ chọn

Muốn có cả bản tối: trả thêm thư mục `<style-id>-toi/` cùng khuôn, `tone: "toi"`. Không bắt buộc.

---

## 8. `qa.json` — ChatGPT TỰ KIỂM và ghi lại (không đạt thì sửa rồi mới giao)

```json
{
  "style_id": "…",
  "objects_dem": 36,
  "thieu_id": [],                      // id §4 còn thiếu — phải rỗng
  "co_chu_trong_anh": false,           // ảnh nền/đồ vật có chữ không — phải false
  "vien_sach": true,                   // không quầng trắng/đen
  "ghep_khop_preview": true,           // ghép theo manifest == preview-clean.jpg (≤ 2 px)
  "tuong_phan_text_box": [{ "id": "panel-today", "ti_le": 6.1 }],   // ≥ 4.5
  "dung_luong_kb": { "background": 238, "tong": 2410 },
  "ghi_chu": "…"
}
```

## 9. Nghiệm thu phía code (BKdemy sẽ chạy)

1. `manifest.json` parse được; đủ id §4; toạ độ trong canvas; file tồn tại; kích thước PNG khớp `width/height`.
2. Ghép tự động nền + objects + characters theo manifest, so với `preview-clean.jpg` (sai lệch ≤ 2 px).
3. Quét ảnh bằng OCR: **không** phát hiện chữ.
4. Đo tương phản `ink`/`text_box`.
5. Dựng thử Trang chính với dữ liệu thật (8 yêu thích + 4 nhóm + tên dài tiếng Việt) và 3 tỉ lệ màn (16:9, 16:10, 4:3): không đè chữ, không cắt đồ vật.

Bộ nào chưa qua 5 mục trên sẽ được trả lại kèm danh sách lỗi.
