# Nguồn model 3D cho BOSS + PET/QUÁI — game bắt thú web (three.js, glTF/GLB)

*Khảo sát 01/10/2026. Chỉ nghiên cứu: không mua, không đăng ký, không tải gì.*

Cách đọc độ tin cậy: **[XÁC MINH]** là đã đọc được trang của nhà bán hoặc API Sketchfab. **[GIÁN TIẾP]** là lấy từ trang tổng hợp giá (gameassetdeals, gamecontentshopper, assetsale) hoặc từ đoạn trích của kết quả tìm kiếm. **[CHƯA XÁC MINH]** là trang trả 403 hoặc không có số liệu, cần mở tay kiểm lại trước khi mua.

Mục tiêu hiệu năng (iPad Gen 7): boss ≤ 15k tam giác, quái nhỏ ≤ 6k, ít material, texture ≤ 1024.

---

## 0. TÓM TẮT

1. **Không có nhà bán nào phủ đủ cả "boss oai" lẫn "pet đẹp kiểu Pokémon" trong cùng một style.** Bốn ứng viên gần nhất:
   - **Meshtint Cute Series**: pet số 1 (chuỗi tiến hoá 3 dạng, rồng theo nguyên tố). Không có hổ, đại bàng, cá voi, T-rex.
   - **N-hance Studio**: phủ boss rộng nhất trong một style vẽ tay (rồng tiến hoá Whelp → Elder, hổ, đại bàng, sói, gấu, rắn, bạch tuộc khổng lồ, rắn biển, khủng long fantasy). Không có cá voi, phượng hoàng. Model nặng hơn (PBR nhiều map).
   - **polyperfect**: phủ nhiều loài nhất (rồng, gryphon, T-rex, hổ, sư tử, sói, gấu, đại bàng, voi ma mút…) nhưng style low-poly mặt phẳng, không "ngầu" mà cũng không "đẹp kiểu pal".
   - **Omabuarts Quirky**: nhiều loài nhưng style ngớ ngẩn, trái yêu cầu của CEO.
2. **Khuyến nghị mua trước**: Meshtint (pet + boss biển) + N-hance (boss thú), cộng hai món gần như miễn phí (Dungeon Mason, FSaur). Tổng khoảng **$465**, được 68 model gốc (chưa tính biến thể màu). Style hai bên khác nhau nên phải thống nhất bằng shader toon + outline + bảng màu chung trong three.js. **Trước khi mua sỉ, mua 1 món mỗi bên để đặt cạnh nhau thử.**
3. **Phương án rẻ**: Quaternius (CC0, glTF sẵn, miễn phí) + Dungeon Mason (dragon miễn phí + bundle $30) + FSaur T-rex + Poly HP Eagle, tổng khoảng **$45**.
4. **Cá voi là lỗ hổng lớn nhất**: hầu như không có cá voi stylized có anim tấn công. Cần tự làm (AI tạo mesh rồi animator tự key) hoặc đổi thiết kế boss biển sang Octopus King / Shark Boss.
5. **AI 3D (Meshy, Tripo, Rodin)**: với thú 4 chân, chim, cá, hiện chỉ tự động có **đi bộ**. Tấn công, gầm, trúng đòn, chết đều phải animator key tay. Phù hợp cho 1–2 boss riêng lẻ, không phù hợp làm cả bộ đồng bộ.
6. **Rủi ro pháp lý riêng của game web**: file GLB gửi xuống trình duyệt thì người chơi tải được. Sketchfab Standard, TurboSquid và CGTrader đều có điều khoản yêu cầu "không cho trích xuất". Cách giảm rủi ro ở §1.

---

## 1. GIẤY PHÉP: nền tảng nào dùng được cho game web three.js

| Nền tảng / giấy phép | Dùng ngoài engine gốc? | Điểm cần chú ý cho game WEB | Nguồn |
|---|---|---|---|
| **Unity Asset Store: Standard EULA** | **Được.** EULA không giới hạn engine, cho phép nhúng vào "electronic application or digital media". Loại trừ: "Restricted Asset" có điều khoản riêng, và asset do chính Unity phát hành (Unity Companion License, chỉ dùng với Unity). | Phải "incorporate… together with substantial, original content". Cấm bán lại hoặc phân phối asset rời. **Cấm dùng asset để train AI/ML** (§2.2.1.1(g)). Cách lấy file: tải `.unitypackage` qua Unity Editor rồi lấy FBX ra (cần tài khoản Unity). **[XÁC MINH]** | [unity.com/legal/as-terms](https://unity.com/legal/as-terms) · [gamefromscratch](https://gamefromscratch.com/using-asset-store-assets-in-other-engines-is-it-legal/) · [Unity Discussions](https://discussions.unity.com/t/can-i-use-assets-from-the-asset-store-i-purchased-in-another-game-engine/929171) |
| **Fab (Epic): Standard License** | **Được**, dùng ở mọi engine, kể cả thương mại. | **Hai hạng**: Personal (doanh thu 12 tháng ≤ $100k) và **Professional (> $100k)**. Nếu BK Academy vượt $100k thì phải mua giá Professional, đắt hơn. Nhiều listing có mặt cả ở Unity Store thì mua ở Unity không bị chia hạng. Trang EULA fab.com trả **403**, điều khoản về trích xuất **[CHƯA XÁC MINH]**. | [Epic docs: Licenses and Pricing in Fab](https://dev.epicgames.com/documentation/fab/licenses-and-pricing-in-fab) · [CG Channel](https://www.cgchannel.com/2024/11/epic-games-to-share-new-free-assets-on-fab-every-two-weeks/) |
| **Sketchfab Store: Standard** | Được, thương mại, mọi loại media. | **Điều khoản cứng**: không được cung cấp model "in a way that allows third parties to… extract or access the Licensed Material as a stand-alone file". Website phải đăng ToS cấm người dùng tái sử dụng model. **Editorial** chỉ dùng cho tin tức, **cấm dùng thương mại** (nhiều model của Malbers trên Sketchfab là Editorial). **[XÁC MINH]** | [sketchfab.com/licenses](https://sketchfab.com/licenses) |
| **Sketchfab CC-BY / CC0** | Được. | CC-BY phải ghi công tác giả. CC-BY-NC **cấm dùng thương mại**. | như trên |
| **CGTrader: Royalty Free** | Được. | Chỉ được dùng như "Incorporated Product": model là thành phần của sản phẩm lớn hơn, người dùng không dễ trích xuất. **[GIÁN TIẾP]** | [CGTrader help](https://help.cgtrader.com/hc/en-us/articles/360015193418-What-is-the-difference-between-Royalty-Free-and-Editorial-licenses) · [CGTrader T&C](https://www.cgtrader.com/pages/terms-and-conditions) |
| **TurboSquid: Standard** | Hạn chế. | Game web chỉ được duyệt sẵn nếu chạy qua WebGL của **Unity, Unreal, Lumberyard**. Engine khác (**three.js**) thì "case-by-case", phải xin duyệt. Model phải ở định dạng không trích xuất được. Trang licensing trả **403**, nội dung lấy từ đoạn trích tìm kiếm **[CHƯA XÁC MINH]**. **Nên tránh TurboSquid** cho dự án này. | [turbosquid.com/licensing](https://www.turbosquid.com/licensing) (403) |
| **itch.io** | Tuỳ từng tác giả, itch không có giấy phép chuẩn chung. | Ví dụ FSaur ghi "free for commercial use in your games". Phải đọc từng trang. | [fsaur.itch.io](https://fsaur.itch.io/trex-set-animation-pack) |
| **Meshtint (shop riêng)** | Được. | Liệt kê rõ "Website and electronic device integration", game, video. Cấm phân phối file thô trừ "compiled application such as a video game". Cấm dùng để train AI. **[XÁC MINH]** | [meshtint.com/pages/terms-of-use-license](https://www.meshtint.com/pages/terms-of-use-license) |
| **Omabuarts** | Có hai gói Standard và Extended. | Chi tiết điều khoản **[CHƯA XÁC MINH]**, trang sản phẩm không nêu. | [omabuarts ULTIMATE](https://www.omabuarts.com/product/quirky-series-ultimate-pack/) |
| **CC0 (Quaternius)** | Không có ràng buộc nào. | An toàn nhất cho web. | [quaternius.com](https://quaternius.com/packs/ultimatemonsters.html) |

**Cách giảm rủi ro "trích xuất GLB" cho game web** (đây là đề xuất kỹ thuật, không phải ý kiến pháp lý):
- Không để URL `.glb` trần. Gói model vào file nhị phân riêng (nén meshopt/Draco, kèm lớp làm rối đơn giản), rồi giải mã trong app.
- Đăng ToS của game có điều khoản cấm tái sử dụng model.
- Với hai nhà bán chính (Meshtint, N-hance), **gửi email xin xác nhận bằng văn bản** là dùng trong game web three.js được phép. Việc này rẻ và xoá hết nghi ngờ.
- Không dùng TurboSquid, không dùng model Sketchfab loại Editorial.

---

## 2. SHORTLIST BOSS THEO LOÀI

> Ghi chú chung: hầu hết pack trên Unity Store chỉ giao FBX (rig Generic Mecanim). Cần một bước chuyển FBX → GLB (Blender hoặc FBX2glTF), và hạ texture 2048 xuống 1024 hoặc 512.

### 2.1 RỒNG

| # | Sản phẩm · tác giả | Giá | Tam giác | Animation | Style / ghi chú | Nguồn |
|---|---|---|---|---|---|---|
| A | **Dragon for Boss Monster: PBR** (tên cũ "Four Evil Dragons Pack PBR") · **Dungeon Mason** | **Miễn phí** (trước đây $10) | 3,864–4,686 mỗi con, 4 con (Usurper, Terror Bringer, Nightmare, Soul Eater) | "up to 18" anim, Mecanim Generic, danh sách chi tiết chỉ có trong video | Rồng chibi-boss, sừng to, mặt dữ nhưng không kinh dị. 4 bộ màu PBR + emission, texture 2048 cần hạ. Có bản vẽ tay **Dragon for Boss Monster: HP** (cũng miễn phí). Unity Standard EULA. **[XÁC MINH giá/EULA; GIÁN TIẾP số tam giác]** | [Unity PBR](https://assetstore.unity.com/packages/3d/characters/creatures/dragon-for-boss-monster-pbr-78923) · [gameassetdeals PBR](https://www.gameassetdeals.com/asset/78923/dragon-for-boss-monster-pbr) · [Unity HP](https://assetstore.unity.com/packages/3d/characters/creatures/four-evil-dragons-pack-hp-79398) · [gameassetdeals HP](https://www.gameassetdeals.com/asset/79398/four-evil-dragons-pack-hp) · Ảnh: `https://assetstorev1-prd-cdn.unity3d.com/package-screenshot/824d16f9-8f6a-490f-ba8b-b4db225541f1_scaled.jpg` |
| B | **Stylized Fantasy Dragons Pack** · **N-hance Studio** | **$84.99** (Unity) | Khoảng 15.7k (≈9.9k đỉnh), **[CHƯA XÁC MINH]**, lấy từ đoạn trích tìm kiếm | Khoảng 81 anim (có Dodge, Glide, Swim, Death) **[CHƯA XÁC MINH]** | **Chuỗi tiến hoá 4 dạng: Dragon Whelp → Drake → Dragon → Elder Dragon**, 6 màu da vẽ tay (hợp làm biến thể nguyên tố). Vẽ tay kiểu WoW, rất "ngầu". Nặng: 32 map PBR (16 diffuse, 4 normal, 4 emissive, 4 metal, 4 AO), nên giữ diffuse, bỏ metal/AO. Phát hành 27/11/2025, Standard EULA. **[XÁC MINH giá/ngày/EULA/danh sách rồng]** | [Unity (fallback)](https://assetstore-fallback.unity.com/packages/3d/characters/creatures/stylized-fantasy-dragons-pack-284093) · [gameassetdeals](https://www.gameassetdeals.com/asset/284093/stylized-fantasy-dragons-pack) |
| C | **Polygonal – Dragon** · **Meshtint** | **$23.90** | 3,114 | **36 anim**: đi, bay nhiều hướng, cắn, phun lửa, đạn, phép, trúng đòn, chết | Low-poly mặt phẳng, texture chỉ 32×32, rất nhẹ, 3 màu. Chỉ có FBX + PNG. **[XÁC MINH]** | [meshtint.com](https://www.meshtint.com/products/polygonal-dragon) |
| D | **Cartoon Dragons: 20 Stylized Dragons** · **3DDisco** | $499.99 (20 con) hoặc $99.99/con | 6,361–7,455 | 12 anim: Idle, Talk, Walk, TakeOff, Fly, Glide, Land, FireFlying, FireStanding, Defend, Sleep, Death, kèm blendshape mặt | Hoạt hình kiểu phim, **có sẵn GLB**. Không có cắn/cào, chỉ có phun lửa. Đắt: **$25/con** nếu mua bundle. **[XÁC MINH]** | [itch.io](https://3ddisco.itch.io/cartoon-dragons-20-stylized-dragons-3d-models-pack) · [Superhive](https://superhivemarket.com/products/cartoon-dragons-20-stylized-dragons-3d-models-pack) |

Thêm cho rồng: **Poly HP – Dragon** (Downrain DC, $7.99, 2,828 tam giác, 11 anim gồm 3 đòn tấn công) [gameassetdeals](https://www.gameassetdeals.com/asset/177623/poly-hp-dragon), style dark-fantasy. Và **Meshtint Cute** Dragon Inferno ở dạng tiến hoá 3 (xem §3).

### 2.2 KHỦNG LONG (T-rex…)

| # | Sản phẩm · tác giả | Giá | Tam giác | Animation | Ghi chú | Nguồn |
|---|---|---|---|---|---|---|
| A | **Low-Poly T.rex** · **FSaur** (itch; tên cũ F2026) | **$6.99**. Combo T-rex + Triceratops + Velociraptor **$14.99** | **1,420** | 7: Idle, Walk, **Roar, Bite/Attack**, Run, Smell, Drink | **Có sẵn GLB + FBX**. Low-poly PBR, style trung tính. Tác giả ghi "free for commercial use in your games". Rất nhẹ, nên phóng to làm boss. **[XÁC MINH]** | [fsaur.itch.io](https://fsaur.itch.io/trex-set-animation-pack) · Ảnh: `https://media.sketchfab.com/models/1d25706bf8ec42a58e2460ba4effc2e9/thumbnails/b7f56e0e8ca345c285ef1a0c3d43411e/72129b5edd8c4af39aaaaa4d7ca6305b.jpeg` |
| B | **Animated Dinosaur Pack** · **Quaternius** | **Miễn phí, CC0** | chưa rõ | Attack, Jump, Run, Walk… | 6 loài: T-Rex, Parasaurolophus, Velociraptor, Triceratops, Stegosaurus, Apatosaurus. Style đơn giản, dễ thương. **[GIÁN TIẾP]** | [quaternius.com](https://quaternius.com/packs/animateddinosaurs.html) · [poly.pizza](https://poly.pizza/bundle/Animated-Dinosaur-Bundle-SmoLdBLO2K) |
| C | **Stylized Dinosaurs Pack** · **N-hance** | **$114.99** | chưa rõ | chưa rõ | Khủng long **fantasy**: Two-Tailed Dinosaur, **Dinosaur Brute**, Dinosaur Mount, Pterodactyl, **Dinosaur Rhino**. Cùng style với 2.1-B. **[CHƯA XÁC MINH phần kỹ thuật]** | [Unity](https://assetstore.unity.com/packages/3d/characters/animals/stylized-dinosaurs-pack-310839) · [gameassetdeals](https://www.gameassetdeals.com/asset/310839/stylized-dinosaurs-pack) |
| D | **Low Poly Animated Dinosaurs** · **polyperfect** | **$20** | T-Rex_New ≈ 1,214 đỉnh | danh sách anim chỉ có trong tài liệu | 12 model. Low-poly mặt phẳng. **[GIÁN TIẾP]** | [gameassetdeals](https://www.gameassetdeals.com/asset/110313/low-poly-animated-dinosaurs) |

### 2.3 HỔ

| # | Sản phẩm | Giá | Tam giác | Animation | Ghi chú | Nguồn |
|---|---|---|---|---|---|---|
| A | **Tiger** trong **Stylized Fantasy Creatures Bundle** · **N-hance** | **$74.99** (giảm 50% từ $149.99) cho **21 con**, tức khoảng **$3.6/con** | ≈7.7k **[CHƯA XÁC MINH]** | Tổng khoảng 181 anim cho cả bundle **[CHƯA XÁC MINH]** | Vẽ tay, 3–5 màu da mỗi con. Bundle gồm: Bat, **Bear**, Boar, Cat, Chicken, Cow, **Crocodile**, **Eagle**, Goat, Hermit Crab, Pig, Sheep, **Small Dinosaur**, Snail, **Snake**, Spider, **Tiger**, Toad, **Turtle**, Wasp, **Wolf**. **[XÁC MINH danh sách/giá]** | [gameassetdeals](https://www.gameassetdeals.com/asset/184409/stylized-fantasy-creatures-bundle) · [Unity](https://assetstore.unity.com/packages/3d/characters/animals/stylized-fantasy-creatures-bundle-184409) · [Epic forum](https://forums.unrealengine.com/t/n-hance-studio-stylized-fantasy-creatures-bundle/2670173) |
| B | **Poly Art: Tiger** · **MalberS Animations** | $24.99–27.49 (tuỳ trang) | ≈2.5k theo Sketchfab (bản cũ) | **62 anim "AAA"**: locomotion, nhảy, rơi, **tấn công, trúng đòn theo hướng** | 4 style: Bengal, White, Albino, **Magic**. Poly-art đẹp, oai. Controller bán riêng (không cần cho three.js). **[GIÁN TIẾP]** | [gameassetdeals](https://www.gameassetdeals.com/asset/75638/poly-art-tiger) · [Sketchfab](https://sketchfab.com/3d-models/poly-art-tiger-6b39156df38d40f9bae4d3add55ed665) · Ảnh: `https://media.sketchfab.com/models/6b39156df38d40f9bae4d3add55ed665/thumbnails/05d790e9565441af9275811ab06074df/433526d807d342d2a8ec4ef486366f20.jpeg` |
| C | Tiger trong **Low Poly Animated Animals** · **polyperfect** | $50 (giảm từ $100) cho 57–80 con | ≈1,104 đỉnh | nhiều anim, Mecanim | Low-poly mặt phẳng. **[GIÁN TIẾP]** | [gameassetdeals](https://www.gameassetdeals.com/asset/93089/low-poly-animated-animals) |
| ✗ | Cartoon Tiger · 3DDisco | $99 | 11,454 | idle, walk, run, talk, sing, dance | **Loại**: đẹp nhưng không có anim chiến đấu. | [Sketchfab API](https://api.sketchfab.com/v3/models/9270dbd27eb7462aa43889bd2ab7a95b) |
| ✗ | Theo the Tiger – Wild Series · Omabuarts | $8.99 | 3,248 | 8 (chỉ walk/run) | **Loại**: không có anim tấn công. | [Sketchfab API](https://api.sketchfab.com/v3/models/6ba74fc2d5f044d19cb65bce55315168) |

### 2.4 CÁ VOI (lỗ hổng: không có lựa chọn tốt)

| # | Sản phẩm | Giá | Tam giác | Animation | Ghi chú | Nguồn |
|---|---|---|---|---|---|---|
| A | **Humpback Whale / Blue Whale / Killer Whale** · **Nestaeric** (Sketchfab Store) | chưa rõ (API không trả giá) | 15.5k–19.4k | 18–21 anim | Giấy phép **Standard**. Style **gần tả thực**, lệch yêu cầu "stylized". Chỉ hợp nếu dùng shader toon. **[XÁC MINH qua API]** | [Sketchfab API](https://api.sketchfab.com/v3/search?type=models&q=whale&user=Nestaeric&count=10) |
| B | Whale trong **Quirky Series – Sea** · **Omabuarts** | trong ULTIMATE $299, hoặc pack Sea lẻ | 40–9,000 (4 LOD) | 18: **Attack**, Death, Hit, Swim, Idle… | Có đủ anim nhưng **style ngớ ngẩn**. **[XÁC MINH]** | [omabuarts ULTIMATE](https://www.omabuarts.com/product/quirky-series-ultimate-pack/) |
| C | Tự làm: AI tạo mesh (Tripo, rig "aquatic") rồi animator key tay | xem §5 | tuỳ | tuỳ | Hợp nhất nếu muốn "cá voi thần" ngầu (cá voi bay trời, cá voi băng…). | §5 |
| – | Thay thế thiết kế | | | | Dùng boss biển có sẵn anim chiến đấu: **Octopus King** (Meshtint), **Shark Boss / Giant Octopus / Sea Serpent** (N-hance Sea bundle), xem 2.6. | |

polyperfect có thể có orca/cá voi trong Low Poly Animated Animals, **[CHƯA XÁC MINH]** vì trang sản phẩm không liệt kê rõ ([polyperfect.com](https://www.polyperfect.com/low-poly-animated-animals)).

### 2.5 ĐẠI BÀNG

| # | Sản phẩm | Giá | Tam giác | Animation | Ghi chú | Nguồn |
|---|---|---|---|---|---|---|
| A | **Eagle** trong **Stylized Fantasy Creatures Bundle** · **N-hance** | (nằm trong $74.99 / 21 con) | ≈3.6k **[CHƯA XÁC MINH]** | chưa rõ | Cùng style với hổ, sói, gấu của N-hance. | [gameassetdeals](https://www.gameassetdeals.com/asset/184409/stylized-fantasy-creatures-bundle) |
| B | **Poly HP – Eagle** · **Downrain DC** | **$7.99** | **2,064** | 10: Idle, bay đi/chạy, **3 đòn tấn công**, trúng đòn, choáng, chết, đứng dậy | 6 texture 2048. Vẽ tay. **[GIÁN TIẾP]** | [gameassetdeals](https://www.gameassetdeals.com/asset/180122/poly-hp-eagle) · [Unity](https://assetstore.unity.com/packages/3d/characters/creatures/poly-hp-eagle-180122) |
| C | Eagle · polyperfect Low Poly Animated Animals / Omabuarts Quirky Eagle | $50 cho pack / trong ULTIMATE | – | – | Dự phòng. | [Unity Quirky Eagle](https://assetstore.unity.com/packages/3d/characters/animals/birds/eagle-quirky-series-178505) |

### 2.6 THÚ HUYỀN THOẠI BỔ SUNG

**Phượng hoàng**
- **Low Poly Legend: Phoenix** · PULSAR BYTES: **$15** (giảm từ $19), 12 anim cả bay lẫn đi, 5 material. Số tam giác chưa rõ. **[GIÁN TIẾP]** [gameassetdeals](https://www.gameassetdeals.com/asset/204229/low-poly-legend-phoenix) · Ảnh: `https://assetstorev1-prd-cdn.unity3d.com/package-screenshot/2e5af64c-d9ac-4809-b03d-7f3a981dda36_scaled.jpg`
- **Lowpoly Stylized Phoenix Rigged and Animated** (Fab/TurboSquid): **4,871 tam giác**, có **GLB/glTF**, 5 anim (idle, fly, start_fly, end_fly, attack). Giá chưa rõ vì Fab trả 403. **[GIÁN TIẾP]** [fab.com](https://www.fab.com/listings/a52622df-7618-4142-a9a3-c3ab3c7e6c5d)

**Kraken / bạch tuộc khổng lồ**
- **Octopus King** (chuỗi Baby → Octopus → **King**) trong **Monsters Ultimate Pack 10 Cute Pro** · **Meshtint**: **$129.99** cho 12 model (Octopus, Turtle → **Titan Turtle**, Shark, Fish → Merman). Octopus King/Titan khoảng **4.2k tam giác**, 12–25 anim mỗi con (di chuyển, combo, phép, trúng đòn, chết). **[XÁC MINH]** [meshtint.com](https://www.meshtint.com/products/monsters-ultimate-pack-10-cute-series)
- **Giant Octopus / Sea Serpent / Shark Boss / Crab Boss** trong **Stylized Sea Animals Bundle** · **N-hance**: **$199.99** cho 21 con, ra ngày 16/02/2026. Số tam giác và anim **[CHƯA XÁC MINH]**. **Không có cá voi.** [gameassetdeals](https://www.gameassetdeals.com/asset/361960/stylized-sea-animals-bundle) · [Unity](https://assetstore-fallback.unity.com/packages/3d/characters/animals/fish/stylized-sea-animals-bundle-361960)
- Kraken · Ilyadem (Sketchfab): 19.8k tam giác, 3 anim. Vượt ngân sách, giấy phép chưa rõ. [Sketchfab](https://sketchfab.com/3d-models/kraken-477b6a189709453f928177e6189065d3)

**Rắn khổng lồ / Naga**
- **Snakelet → Snake → Snake Naga** (Meshtint Ultimate Pack 02, Naga có 20 anim, xem §3) · **Sea Serpent** (N-hance Sea) · **Desert Serpent** (N-hance Creatures Bundle #2, $149.99, [Epic forum](https://forums.unrealengine.com/t/n-hance-studio-stylized-fantasy-creatures-bundle-2/2670174)).

**Sói / Gấu / Sư tử**
- **Wolf Pup → Wolf → Werewolf** (Meshtint Ultimate Pack 02). Wolf và Bear trong N-hance Creatures Bundle (Wolf ≈3.1k **[CHƯA XÁC MINH]**).
- **Poly Art Bear** · Malbers: 13.4k tam giác, 6 kiểu (Polar, Grizzly, Panda…). Chú ý: bản trên Sketchfab là giấy phép **Editorial**, phải mua qua Unity. **Poly Art Wolf**: **25k tam giác**, vượt ngân sách. [Sketchfab API Malbers](https://api.sketchfab.com/v3/search?type=models&q=poly%20art&user=malbers.shark87&count=24)
- Sư tử: polyperfect Animals, hoặc 3DDisco Cartoon Lion ($99, nhưng không có anim đánh).

**Voi ma mút / Tê giác**
- **Low Poly Animated Prehistoric Animals** · polyperfect: **$30**. Gồm Columbian **mammoth**, Mastodon, **Sabertooth**, American lion, Direwolf, Short-faced bear… 335–906 đỉnh mỗi con, **100+ anim** (attack, death, roar, howl, trumpet). **[GIÁN TIẾP]** [gameassetdeals](https://www.gameassetdeals.com/asset/154363/low-poly-animated-prehistoric-animals)
- **Poly Art Rhino** · Malbers: 4,806 tam giác (Sketchfab), giá và anim chưa rõ. **Dinosaur Rhino** (N-hance Dinosaurs).

**Gryphon / Gargoyle Boss**
- **Low Poly Animated Fantasy Creatures** · polyperfect: **$50** (giảm từ $100). 44 model: Dragon (4,898 đỉnh), Gryphon, Hippogryph, Gargoyle Boss, Pegasus, Unicorn, Fantasy Bear, Stag… Tổng 224 anim. **[GIÁN TIẾP]** [gameassetdeals](https://www.gameassetdeals.com/asset/292803/low-poly-animated-fantasy-creatures)

---

## 3. PACK PET / QUÁI THƯỜNG

| Pack | Giá · giá/model | Nội dung | Kỹ thuật | Phù hợp? | Nguồn |
|---|---|---|---|---|---|
| **Meshtint Cute Series: Monsters Ultimate Pack 02** | **$159.90** / 24 = **$6.7/con** | 8 chuỗi × 3 dạng: Bud → Bloom → Blossom · **Dragon Spark → Dragon Fire → Dragon Inferno** · Shell → Spike → Hermit King · **Snakelet → Snake → Snake Naga** · **Wolf Pup → Wolf → Werewolf** · Bomb → Snow Bomb → Poison Bomb · Sun Blossom → Sunflower Fairy → Sunflora Pixie · Dummy ×3 | 48–2,938 tam giác · 13–26 anim/con (di chuyển in-place và root motion, nhiều kiểu tấn công, phép, trúng đòn, chết) · texture 2048 (hạ được 512) · 1 diffuse (+1 emission) · FBX | **Rất hợp.** Style chibi kiểu Pokémon, có tiến hoá và nguyên tố. | [meshtint.com](https://www.meshtint.com/products/monsters-ultimate-pack-02-cute-series) · [search](https://www.meshtint.com/collections/cute-series) |
| **Meshtint: Monsters Ultimate Pack 01** | $139.99 / 25 = $5.6/con | 9 + 8 + 8 dạng: dơi, nhện, ma, **chim**, cây… | 120–2,838 tam giác · 9–13 anim | Hợp. | [meshtint.com](https://www.meshtint.com/products/monsters-ultimate-pack-01-cute-series) |
| **Meshtint: Dragon evolution packs lẻ** | vd. **Dragon Darkness Evolution Pack $35.90** (Dusk → Nightfall → Darkness) | Các chuỗi rồng nguyên tố: Spark/Fire/Inferno, Water/Ice/Blizzard, Dusk/Nightfall/Darkness | 1,552 / 2,086 / 2,242 tam giác · **16 anim**: Underground, Spawn, Idle, Fly (in-place/root), Turn L/R, Bite, Bite low, **Blast**, **Wing attack**, Projectile ×2, **Cast spell**, Take damage, Die | **Mua món này đầu tiên để thử style.** | [meshtint.com](https://www.meshtint.com/products/dragon-darkness-evolution-pack-cute-series) · [Ice Water pack](https://www.meshtint.com/products/dragon-ice-water-evolution-pack-cute-series) |
| **Meshtint: Low Level Monsters Growing Pack** | ≈$29.99 (€27.59), cập nhật sau này miễn phí | 10 quái × 3 màu (v1.2, 04/09/2026) | 1–3k tam giác | Rẻ, để thử. **[GIÁN TIẾP]** | [Unity](https://assetstore.unity.com/packages/3d/characters/creatures/low-level-monsters-growing-pack-cute-series-391364) |
| **Meshtint: Ultimate Pack 10 Cute Pro** | $129.99 / 12 | Octopus, Turtle → Titan, Shark, Fish → Merman | 560–4.2k · 12–25 anim | Boss biển và pet biển. | [meshtint.com](https://www.meshtint.com/products/monsters-ultimate-pack-10-cute-series) |
| **Dungeon Mason: RPG Monster BUNDLE Polyart** (hoặc bản PBR) | **$30** (giá sale ghi nhận; niêm yết $60) / 30 = **$1–2/con** | 30 quái RPG (slime, nấm, beholder, rương quái…) | 1,273–7,523 tam giác · **16 anim in-place** · **1 material + texture 512 dùng chung cho cả 30 con**, rất nhẹ cho web | Đẹp và gọn, nhưng là "quái RPG" chứ không phải thú. Hợp làm quái phụ. | [gamecontentshopper](https://gamecontentshopper.com/asset/all-assets/rpg-monster-bundle-polyart/2023/07/23/) · [Unity](https://assetstore.unity.com/packages/3d/characters/creatures/rpg-monster-bundle-polyart-261480) · [publisher](https://assetstore-fallback.unity.com/publishers/23554) |
| **Quaternius: Ultimate Monsters** | **Miễn phí, CC0** / 45–50 | Có **dạng "Evolved"**: Dragon → Dragon Evolved, Mushnub, Armabee, Glub, Alpaking, Goleling (mỗi con đều có bản Evolved), cùng Yeti, Dino, Mushroom King, Demon… | **glTF/FBX/Blend có sẵn** · attack, death, run, walk… | **Phương án rẻ tốt nhất.** Style đơn giản, sạch, dễ thương. | [quaternius.com](https://quaternius.com/packs/ultimatemonsters.html) · [poly.pizza](https://poly.pizza/bundle/Ultimate-Monsters-Bundle-5oyGWAmOB6) |
| **Quaternius: Cute Animated Monsters** / **Ultimate Animated Animals** | Miễn phí, CC0 | 21 quái / 12 con thú (>12 anim: Attack, Death, Gallop…) | glTF có sẵn | Dự phòng. | [cutemonsters](https://quaternius.com/packs/cutemonsters.html) · [animals](https://quaternius.com/packs/ultimateanimatedanimals.html) |
| **Omabuarts Quirky Series** | ULTIMATE **$299** / 180 = $1.7/con · Mega Pack $80/45 · Dinosaurs Bundle $80 | 180 con thú: có **hổ, sư tử, sói, gấu, đại bàng, cá voi, orca, bạch tuộc, tê giác, trăn, rắn**. Rồng và Chinese Dragon **bán lẻ** ($5, 18 anim) | 18 anim (có Attack, Hit, Death, Fly, Swim) · 26–29 blendshape mặt · texture 16×4 px · 4 LOD 40–9k | **Style "silly" (tên series là "Silly 3D Animal Models")**, trái yêu cầu "không ngớ ngẩn". Chỉ nên dùng nếu CEO duyệt style. | [ULTIMATE](https://www.omabuarts.com/product/quirky-series-ultimate-pack/) · [itch](https://omabuarts.itch.io/quirky-series-animals-ultimate-pack) · [Chinese Dragon](https://www.omabuarts.com/product/quirky-series-chinese-dragon/) · [catalog](https://www.omabuarts.com/product-category/quirky-series/) |
| **NOTFUN: Monsters Pack 01** | $70 | 5 chiến binh-quái × 3 dạng tiến hoá, rig humanoid (dùng được Mixamo) | tam giác chưa rõ | Dáng người, không phải thú. | [gameassetdeals](https://www.gameassetdeals.com/asset/231660/monsters-pack-01) |
| **3DDisco: Cartoon Baby Dragons** | $119.99/con · bundle 6 con $199.99 | Rồng con hoạt hình, 12 màu | 12 anim + biểu cảm mặt, có GLB | Đẹp nhưng đắt. | [3ddisco.itch.io](https://3ddisco.itch.io/) |
| **SURIYUN: MEGA Tiny Dragon Pack** | $144 | 5 rồng con có phụ kiện modular (sừng, lưng) | Tiny Dragon lẻ: 3,534 poly, 23 anim | Pet rồng tuỳ biến. **[GIÁN TIẾP]** | [gameassetdeals](https://www.gameassetdeals.com/asset/263748/mega-tiny-dragon-pack) · [Unity Tiny Dragon](https://assetstore.unity.com/packages/3d/characters/animals/mammals/tiny-dragon-161097) |

---

## 4. CÓ NHÀ BÁN NÀO PHỦ CẢ BOSS LẪN PET TRONG MỘT STYLE?

| Nhà bán | Boss có sẵn | Pet đẹp? | Thiếu | Nhận xét |
|---|---|---|---|---|
| **Meshtint (Cute + Cute Pro)** | Dragon Inferno/Blizzard/Darkness, **Octopus King**, **Titan Turtle**, Snake Naga, Werewolf, Hermit King | ⭐⭐⭐ Tốt nhất (chuỗi tiến hoá 3 dạng) | hổ, đại bàng, cá voi, T-rex, sư tử | Boss ở đây là "dạng tiến hoá 3 phóng to", hơi dễ thương chứ chưa "oai". |
| **N-hance Studio** | Rồng (Whelp → Elder), hổ, đại bàng, sói, gấu, rắn, cá sấu, khủng long fantasy, Giant Octopus, Sea Serpent, Shark Boss, elementals | ⭐⭐ Whelp, Drake, thú nhỏ vẽ tay đẹp nhưng là "thú", chưa phải "pal" | cá voi, phượng hoàng, sư tử, voi ma mút | **Phủ boss rộng nhất, style đồng nhất, ngầu mà không kinh dị.** Model nặng hơn (PBR), số tam giác chưa xác minh hết. [publisher](https://assetstore-fallback.unity.com/publishers/41401) |
| **polyperfect** | Rồng, gryphon, gargoyle boss, T-rex, hổ, sư tử, sói, gấu, đại bàng, voi ma mút, sabertooth | ⭐ Thú low-poly, không phải pal | phượng hoàng, kraken | Phủ loài nhiều nhất, nhẹ nhất (dưới 1k đỉnh), nhưng **khó đạt cả "ngầu" lẫn "đẹp kiểu pal"**. |
| **Omabuarts Quirky** | Hổ, sư tử, sói, gấu, đại bàng, cá voi, bạch tuộc, tê giác, rắn, rồng lẻ, khủng long | ⭐ (dễ thương nhưng ngớ ngẩn) | phượng hoàng | **Loại vì style** (trừ khi CEO duyệt). |
| **3DDisco** | Rồng (20 con), hổ, sư tử, sói, khủng long | ⭐⭐ Baby dragons | Anim chiến đấu cho thú, đại bàng, cá voi | Đắt, $99/con. |

**Kết luận**: không nhà nào đạt cả hai tiêu chí. Cách thực tế nhất là **Meshtint cho pet + boss biển, N-hance cho boss thú**, rồi **thống nhất bằng render** trong three.js: một shader toon/cel (hoặc `MeshToonMaterial`) chung, outline, cùng bảng màu nguyên tố, cùng kiểu ánh sáng và hiệu ứng VFX. Đây là kỹ thuật **art-direction unification** mà các game gom asset từ nhiều nguồn thường làm: shader và palette chung sẽ che bớt khác biệt về cách vẽ texture.

Cần làm trước khi mua sỉ: mua **Meshtint Dragon Darkness Evolution Pack ($35.90)** và **một pack N-hance** (hoặc tải bản miễn phí **Dungeon Mason Dragon for Boss Monster**), chuyển sang GLB, đặt cạnh nhau dưới cùng shader, chụp màn hình cho CEO duyệt.

---

## 5. PHƯƠNG ÁN AI 3D CHO BOSS

| Công cụ | Rig cho thú? | Anim có sẵn cho thú / chim / cá | Giấy phép | Nguồn |
|---|---|---|---|---|
| **Meshy** | Humanoid, **Quadruped Dog**, **Smart Rig (Beta)** cho sinh vật lạ | Thư viện 631 anim **đều là humanoid**. Trích nguyên văn: "Quadruped characters can be auto-rigged and **currently support a walking animation**." | Free: **CC BY 4.0** (phải ghi công). Pro trở lên: dùng thương mại, sở hữu riêng. | [animation-library](https://www.meshy.ai/animation-library) · [docs animate](https://docs.meshy.ai/en/webapp/guides/animate) · [tutorial](https://www.meshy.ai/tutorials/character-auto-rigging-workflow) · [help](https://help.meshy.ai/en/articles/9992001-can-i-use-my-generated-assets-for-commercial-projects) |
| **Tripo** | Rig v2.5 (10/02/2026): biped, **quadruped, hexapod, octopod, avian, serpentine, aquatic** | Preset: quadruped **chỉ có `walk`**; serpentine và aquatic **chỉ có `march`**; **avian không có preset**. Biped có idle, walk, run, slash… | Free: model công khai, không dùng thương mại. Trả phí: dùng thương mại. **[GIÁN TIẾP]** | [Tripo rig](https://developers.tripo3d.ai/en/docs/animations-rig) · [retarget presets](https://developers.tripo3d.ai/en/docs/animations-retarget) · [license blog](https://www.tripo3d.ai/blog/commercial-use-ai-3d-models) |
| **Hyper3D Rodin** | **Không rig.** Chỉ xuất mesh tĩnh, T/A-pose với người | Không có | Trả phí từ khoảng $30/tháng | Ưu điểm: **topology quad sạch**, dễ rig tay. [befores&afters](https://beforesandafters.com/2026/01/27/everything-you-need-to-know-about-hyper3d-ai-and-its-rodin-3d-generative-ai-model/) · [makerstack](https://makerstack.co/reviews/hyper3d-rodin-review/) |
| **Anything World (Animate Anything)** | Quadruped, chim, cá, côn trùng, humanoid | Thú 4 chân: **idle, jump, walk, run**. Không có tấn công hay gầm. Model trên 20k đỉnh bị giảm lưới. | Credit: free 15–20 credit/tháng, **5 credit/model**. Gói từ $30/tháng. Xuất FBX/GLB. | [CG Channel](https://www.cgchannel.com/2023/10/animate-anything-uses-ai-to-rig-your-3d-characters/) · [docs](https://anything-world.gitbook.io/anything-world/quickstart/animate-anything-quickstart) |
| **Mixamo** | **Chỉ humanoid**, không hỗ trợ thú 4 chân | Không dùng được cho thú | – | [Meshy blog so sánh](https://www.meshy.ai/blog/best-ai-auto-rigging-tool) |

**Đánh giá thực tế**:
- AI (tính đến 10/2026) cho được **mesh + texture** khá đẹp và **rig tự động + anim đi bộ**. Toàn bộ **tấn công (cắn/cào/quất đuôi), gầm/tung chiêu, trúng đòn, chết, bay/bơi** phải có animator key tay trong Blender hoặc Cascadeur. Ước tính khoảng 1–3 ngày/con cho bộ 6–8 anim; đây là ước lượng, chưa đo.
- Mesh AI thường nhiều tam giác, cánh/răng/đuôi rối topology, ánh sáng dính vào texture, và **mỗi lần tạo ra một style khác nhau**. Khó giữ đồng bộ cho cả bộ 10+ boss.
- **Dùng hợp lý**: 1–2 boss "đặc sản" không mua được, như **cá voi thần**. Tripo rig "aquatic" cho sẵn xương. Hoặc Rodin tạo mesh quad sạch rồi rig tay.
- **Cẩn thận**: EULA Unity và giấy phép Meshtint **cấm đưa asset đã mua vào AI** (train hoặc tạo dataset). Đừng dùng ảnh chụp model đã mua làm prompt image-to-3D.

---

## 6. KHUYẾN NGHỊ

### 6.1 Bộ nên mua trước (chất lượng + đồng bộ tương đối)

| Vai trò | Sản phẩm | Giá |
|---|---|---|
| Pet + boss nguyên tố (rồng lửa, rắn naga, người sói) | Meshtint **Monsters Ultimate Pack 02** (24 model, 8 chuỗi tiến hoá) | $159.90 |
| Pet biển + boss biển (Octopus King = kraken, Titan Turtle) | Meshtint **Monsters Ultimate Pack 10 Cute Pro** (12 model) | $129.99 |
| Boss thú: hổ, đại bàng, sói, gấu, rắn, cá sấu, khủng long nhỏ | N-hance **Stylized Fantasy Creatures Bundle** (21 con) | $74.99 (giá sale) |
| Boss rồng (Whelp → Elder, 6 màu nguyên tố) | N-hance **Stylized Fantasy Dragons Pack** | $84.99 |
| Boss rồng dự phòng, nhẹ | Dungeon Mason **Dragon for Boss Monster PBR/HP** | $0 |
| Boss T-rex (+ Triceratops, Raptor) | FSaur **Complete Pack** (GLB có sẵn) | $14.99 |
| **Tổng** | **68 model gốc** (24+12+21+4+4+3), chưa tính biến thể màu | **≈ $464.86** (≈ $6.8/model) |

Tuỳ chọn thêm: polyperfect Prehistoric (**voi ma mút**, sabertooth) $30 · PULSAR BYTES Phoenix $15 · N-hance Sea Animals ($199.99, chỉ nên mua nếu cần Sea Serpent/Shark Boss). **Cá voi**: tự làm theo §5.

*Giá Unity Store dao động theo đợt sale. Giá của N-hance Creatures Bundle ($74.99) là giá đang giảm 50%, hết sale có thể về $149.99.*

### 6.2 Phương án rẻ (≈ $45)

| Sản phẩm | Giá |
|---|---|
| Quaternius Ultimate Monsters + Cute Monsters + Animated Dinosaurs + Ultimate Animated Animals (CC0, glTF có sẵn) | $0 |
| Dungeon Mason Dragon for Boss Monster (PBR hoặc HP) | $0 |
| Dungeon Mason RPG Monster BUNDLE Polyart | $30 (giá sale ghi nhận) |
| FSaur Low-Poly T.rex | $6.99 |
| Downrain DC Poly HP – Eagle | $7.99 |
| **Tổng** | **≈ $44.98** |

Đánh đổi: style không đồng nhất (Quaternius đơn giản, Dungeon Mason chibi-RPG, Poly HP vẽ tay tối màu). Boss sẽ kém "oai" hơn.

### 6.3 Việc cần làm tiếp (nằm ngoài phạm vi khảo sát này)
1. Mở tay các trang **[CHƯA XÁC MINH]** (N-hance: số tam giác và danh sách anim; Fab listing; TurboSquid licensing).
2. Email Meshtint (info@meshtint.com) và N-hance xin xác nhận **dùng trong game web three.js**.
3. Mua 2 món thử style (§4), chạy thử pipeline FBX → GLB, hạ texture xuống 1024, rồi đo FPS trên iPad Gen 7.
4. Nếu BK Academy có doanh thu trên $100k/năm: **mua qua Unity Store, không mua qua Fab** (tránh giá hạng Professional), hoặc tính giá Professional vào ngân sách.
