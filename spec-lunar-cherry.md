# spec-lunar-cherry.md — Lunar Cherry học toán · học Tiếng Anh

> Game gia đình cho 2 con gái Thùy (Lunar, Cherry; 6 tuổi, chuẩn bị lớp 1). Project RIÊNG, không dính ERP.
> Code: `C:\Users\WBPC\Desktop\BKERP\BKGame\LunarCherry` · repo riêng tư `HongThien/lunar-cherry` · deploy Vercel project `bkdemy-erp-v2-hmxy`
> (tên Vercel tự đặt) → https://bkdemy-erp-v2-hmxy-hongthiens-projects-be2657fd.vercel.app (đã tắt Vercel Authentication 09/10).
> Quyết định ở đây là của CEO (Thùy), ghi theo ngày. Code lệch spec ⇒ sửa code. Nhật ký thô: `DEVLOG.md` 08–10/10/2026.

## 0. Mục tiêu & nguyên tắc

- **Học qua đánh boss**: màn hình hiện câu hỏi, boss đi lại gần nhân vật; trả lời đúng ⇒ nhân vật tung 1 chiêu; đủ số chiêu boss chết ⇒ qua màn.
- **Sao**: không sai câu nào = 3 · sai 1–2 câu = 2 · hơn = 1. "Sai" tính theo CÂU (chọn sai ít nhất 1 lần, hoặc để boss chạm tới) — 1 câu chỉ trừ 1 lần. Bé **không bao giờ thua**: sai vẫn được làm lại tới khi đúng; boss chạm thì máy chỉ đáp án đúng.
- **Không chữ** (Khan Kids): bé chưa biết đọc; mọi lệnh bằng hình + giọng; chữ chỉ hiện phụ cho bố mẹ (trừ đảo Phonics).
- **Không phạt**: không trừ tim, không bảng xếp hạng, không chuỗi ngày ép, quên chăm Thỏ không mất gì (Studycat).
- Đứng trên vai: Lingokids (playlearning, sticker), Duolingo ABC (dạng bài nghe–chạm, truyện tô sáng chữ), Buddy.ai (nhân vật hỏi – bé đáp bằng giọng), Monkey Junior (nghe→nói→khen, ôn từ sai), Reading Eggs (bản đồ mở dần, quà trang trí), Talking Tom (nuôi thú nhại giọng).

## 1. Khung chung (cả 2 môn)

- **Màn bìa**: ảnh bìa vẽ sẵn (`assets/bia.webp`), 2 nút **Học Toán** / **Học Tiếng Anh** (CEO 09/10: chọn môn ở màn bìa), Nhân vật, Trang phục, Cài đặt.
- **Nhân vật**: Lunar & Cherry = 1 nhân vật đôi, **2 bé luôn đi cặp trong mọi ô** (CEO 08/10), vẽ từ atlas 4×2 tư thế (chờ · chạy · tụ phép · ném · bắn · triệu hồi · ăn mừng · ô 7 riêng từng bộ). **4 trang phục**, mỗi bộ một bộ chiêu: Thỏ Phép Thuật (mặc định) · Tiên Trăng Anh Đào · Tiên Nước (phao, dép) · Tiên Ánh Nắng. + 6 nhân vật chibi vẽ bằng code (Mèo, Thỏ, Gấu Trúc, Khủng Long, Robot, Kỳ Lân).
  Thêm bộ mới = 1 atlas 4×2 cùng khuôn + 1 dòng `LC.SKINS` (`tools/xu-ly-anh.html?skin` cắt + căn chân/đầu tự động).
- **Boss**: 12 boss chibi vẽ bằng SVG (Thạch Nhầy → Rồng Lửa Chúa).
- **Nền trận**: nền màn dạng nhìn ngang của app HS (`public/bk-ui/hs/skin/rpg/phieuluu2d/nen_dang_*.jpg`) + sân đấu lâu đài (CEO 08/10: "battle của dạng bài trên app, không phải bản đồ con đường"). Nhân vật/boss đứng trên con đường đá.
- **Chiêu**: 20+ loại vẽ canvas (`js/fx.js`); câu cuối hạ boss luôn ra tuyệt chiêu; đúng 3 câu liền = combo.
- **Cài đặt**: độ khó = thời gian boss đi tới nơi (preset 20/13/8/5 giây, thanh kéo 3–40) · số chiêu hạ boss 5/7/10 · âm thanh/nhạc/đọc câu hỏi · mở hết màn.
- Tiến độ lưu `localStorage` theo máy (sao theo nhân vật; Tiếng Anh: `lc_anh`).

## 2. Môn Toán

- Mặc định **cộng trong phạm vi 20** (CEO 08/10). Tuỳ chọn: cộng/trừ/cả hai · phạm vi 5/10/20/50/100 (50, 100 chỉ phép không nhớ) · chọn đáp án hoặc bấm số · hình minh hoạ để đếm (≤10) · câu tìm số còn thiếu.
- 12 màn = 12 boss; mở lần lượt. Máy đọc đề bằng tiếng Việt (giọng máy, nếu có).

## 3. Môn Tiếng Anh (CEO chốt 09/10 sau đề xuất nghiên cứu 10 app)

### 3.1 Nội dung
- Bộ từ **Cambridge Pre-A1 Starters**. **12 đảo** (chủ đề) + đảo **Phonics**, mỗi đảo 7–10 từ, mỗi từ = hình 3D + giọng Anh-Mỹ + mẫu câu:
  Màu sắc · Số đếm 1–10 · Con vật · Đồ ăn · Cơ thể · Gia đình · Quần áo · Đồ chơi · Trong nhà · Lớp học · Thời tiết · Hành động (≈100 từ) · Phonics 21 chữ (a b c d e f h i j k l m n o p r s t u w + y).
- Hình vẽ bằng **three.js** low-poly (CEO 09/10: "vẽ bằng three.js cho V1"), render PNG 320px cache; cụm số đếm dùng máy ảnh trực giao bó sát khung để quả to, dễ đếm (CEO 09/10). Người chibi tham số `nguoi()` cho Cơ thể (mặt ⇒ chỉ hiện đầu, vòng sáng quanh bộ phận), Gia đình (giữ tỉ lệ thật: bố cao, em bé nhỏ), Hành động (8 tư thế).
- Mẫu câu có ngữ pháp tự động: a/an, số nhiều, danh từ không đếm được (milk, rice), danh từ luôn số nhiều (eyes, shoes → "These are my…").
- Giọng đọc: `speechSynthesis` en-US (iPad: Samantha; chọn Anh-Mỹ vì iPad có sẵn, chạy offline). Bước sau: ghi âm giọng bản xứ thay giọng máy.

### 3.2 Luồng một đảo
1. **Ngắm đảo** (dạy trước, chơi sau): lật thẻ từ, chạm = nghe, nút rùa = nghe chậm; nút 📖 Truyện.
2. Chọn **chế độ** (CEO 09/10: "để thành chế độ chơi riêng ứng với các kỹ năng cho chủ động"), mỗi chế độ = 1 trận, **sao riêng**:

| Chế độ | Nguyên tắc (CEO 09/10) | Dạng bài |
|---|---|---|
| 👂 Nghe 1 từ | **Nghe = chỉ bấm.** Vào câu máy đọc NGAY; bé im 3 giây ⇒ đọc lại, lặp tới khi bé làm; bé chạm gì cũng tính lại 3 giây | nghe → chạm 1/3 hình · ghép cặp (máy đọc từng từ theo lượt, bé chạm) · nghe câu → chọn hình |
| 👂👂 Nghe 2 từ | độ khó = số từ (CEO: "cao hơn là 2 từ, cao nữa mới 3 từ") | nghe 2 từ → chạm 2 hình theo thứ tự (4 hình) |
| 👂👂👂 Nghe 3 từ | | nghe 3 từ → chạm theo thứ tự (5 hình); sai ⇒ làm lại, máy đọc lại chuỗi |
| 🗣️ Nói | máy nghe bé nói (tầng 2, CEO: "có đủ mạng") | nói theo · Thỏ hỏi – bé đáp ("What's this? / What colour is it? / How many? / What can you do?") |
| ✋ Kéo thả | **Nhìn rồi kéo, không dựa vào nghe** (CEO: "game kéo thả thì nhìn và kéo thả; nghe rồi kéo thả không ổn"); máy chỉ đọc tên khi thả đúng | ghép hình vào bóng đen · lọc đúng loại vào giỏ (2 của đảo + 2 đồ lạ từ đảo khác) · Số: nhìn số kéo đủ lên đĩa · Màu: nhìn mẫu kéo hũ sơn cùng màu lên đồ vật trắng · Phonics: kéo chữ vào ô "_at" |
| 🎲 Trộn | | tất cả |

   Đảo Phonics: 👂 Nghe (nghe từ → chọn chữ đầu; nghe → chạm hình) · ✋ Kéo chữ · 🎲 Trộn.
3. Thắng ⇒ sao cho `đảo:chế độ`, **sticker** các từ đã trả lời đúng, **cà rốt** cho Thỏ (= số sao). Đảo mở lần lượt theo sao đảo trước (hoặc "Mở hết các màn").

### 3.3 Nói — chấm bằng máy nghe
- `webkitSpeechRecognition` en-US (iPad Safari ≥14.5, cần mạng, HTTPS). Mic phải do bé bấm (iOS). Boss đứng chờ khi mic đang nghe.
- **Chấm rộng** (`LC.giong.khop`): trùng từ đích, hoặc gần giống ≥60% (Levenshtein), hoặc bắt đầu bằng từ đích ("jumping" ~ "jump"); số đếm nhận cả "3". Bỏ qua a/an/the/it's/I/like…
- Sai: máy đọc lại mẫu, "Try again"; lần sai đầu tính 1 miss; **lần 3 cho qua** ("Good try!"). Lý do: nhận giọng trẻ mẫu giáo sai tới 35%, chấm oan làm bé mất tự tin.
- Máy không có nhận giọng ⇒ chế độ Nói bị mờ, bài nói trong Trộn bị bỏ.

### 3.4 Ôn từ sai (Monkey)
- Thống kê `S.anh.sai[từ]` (miss) / `S.anh.dung[từ]` (đúng ngay). Chọn từ có trọng số `max(0,3; 1 + 2·sai − 0,25·đúng)` ⇒ từ sai ra gấp đôi, từ thuộc ra thưa dần. Áp mọi dạng bài có từ đích.

### 3.5 Sổ sticker (CEO 09/10: "quà trang trí 2D dạng sticker, con rất thích dán sticker"; 10/10: "có sẵn ô trống tối màu, kéo sticker vào đúng ô thì sáng lên như xếp hình; sticker phải là loại bán ngoài hàng, phải đẹp")
- **Sổ 8 tờ** (`sticker.js` → `TO`): mỗi tờ là 1 chủ đề (màu, số, con vật, đồ ăn, gia đình, đồ chơi, nhà, thời tiết), mỗi ô = 1 sticker đúng vị trí `[id, x%, y%, w%]`. Ô chưa có = **bóng tối màu** (silhouette) ngay chỗ đó.
- Có sticker khi **từ đã học** (`S.anh.hoc`) hoặc nhận **sticker quà** (`QUA`, mở 1 món mỗi 3 sao). Khay dưới liệt kê sticker đang có mà chưa dán.
- Kéo từ khay lên tờ: **đúng ô ⇒ hít vào, sáng lên + pháo giấy** (`stkSang`); sai ô ⇒ bật về khay. Đã dán thì dính, lưu `S.anh.dan`. Không có giỏ/kéo tự do nữa (bản 09/10 đã bỏ).
- Hình sticker: tạm là hình 3D vẽ bằng code; **bản thật đặt ChatGPT** theo `docs/dat-hang-sticker.md` (prompt phong cách + 60 tên file), thả vào `assets/sticker/<id>.png` là app tự dùng (`LC.STICKER_SRC`).

### 3.6 Truyện ngắn (Duolingo ABC / Monkey Stories)
- Mỗi đảo 1 truyện **4 trang**: hình + 1 câu bằng từ đã học. Máy đọc, **tô sáng từng chữ** (sự kiện boundary của speechSynthesis; máy không bắn thì ước lượng theo độ dài chữ). Chạm chữ = nghe chữ. Hết truyện: pháo giấy.

### 3.7 Chăm thú cưng (CEO 09/10: "giống trò nuôi mèo Talking Tom"; 10/10: "con mèo Tom xấu — lấy luôn model mấy con bên Bắt Thú, cute hơn, có sẵn động tác")
- Thú = **model 3D SỐNG của engine Bắt Thú** (không vẽ lại, không ảnh tĩnh): `BatThu/src/thu/thu-cung.ts` gói `Thu4` + bộ ~25 động tác thành 1 ES module `assets/thu-cung.js` (~1 MB, `window.ThuCung.gan(canvas, loai)` → `lam/nen/doi`). Build lại khi Bắt Thú đổi model: `npx vite build -c vite.lib.config.ts` rồi chép sang.
- Bé **chọn 1 trong 11 loài** (Cáo Lửa mặc định, Cừu Mây, Khỉ Lá, Sói Nguyệt, Nhím Điện, Cánh Cụt Nước, Gà Lửa, Bò Tuyết, Sư Tử Lửa, Voi Rừng, Mèo Bông), lưu `S.anh.tho.loai`. Bỏ 2 khuôn ngựa/sói to.
- **Vào từ màn BÌA**: nút 🐾 Nuôi thú đứng cạnh Học Toán / Học Tiếng Anh (CEO 10/10: "đưa ra màn hình chính"); bản đồ Tiếng Anh vẫn có lối vào. Nút quay lại về đúng nơi đã vào.
- **Vòng chăm sóc = My Talking Tom** (CEO 10/10: "cần thêm hoạt động tương tác như Talking Tom: cho ăn, đi chơi, tắm…"). 4 nhu cầu 🍎 đói · 🫧 sạch · 😊 vui · 💤 khoẻ (0–100, lưu `{gt, luc}`, tụt theo GIỜ THẬT: 12 · 7 · 10 · 8 mỗi giờ; ngủ thì khoẻ +40/giờ). **Không phạt** (Talking Tom cũng không chết): dưới 35 thanh đỏ nhấp nháy, thú làm nũng kêu bằng tiếng Anh ("I'm hungry!" / "I'm dirty!" / "Play with me!" / "I'm sleepy…"). Mặt ở tiêu đề 😄 🙂 😢 theo nhu cầu thấp nhất.
- **5 phòng** (nav dưới, phòng vẽ bằng CSS, không ảnh):
  - 🍳 **Bếp**: khay 10 món = từ đảo Đồ ăn (hình 3D sẵn) + 🐟 cá (quà đặc biệt, trừ 1 cá). Chạm món ⇒ bay vào mồm; kéo thả vào thú cũng được. Món mê (banana, cake, ice cream) ⇒ ăn mừng; món ghét (carrot) ⇒ "Yuck!" làm nũng. Đói ≥ 92 ⇒ "I'm full!" từ chối. Ăn 2 món ⇒ hiện 🚽.
  - 🛁 **Phòng tắm**: xoa tay lên thú ⇒ bọt xà phòng mọc ngay chỗ chạm (sạch tính theo lượng bọt); 🚿 dội nước (giọt rơi, bọt tan, "Splash! So clean!"), chưa đủ bọt thì "More soap first!"; 🪥 đánh răng (+12 sạch); 🚽 đi vệ sinh (ngồi 2 giây, xả nước, "Phew!").
  - 🛏 **Phòng ngủ**: tắt đèn ⇒ nền `ngu` (nhắm mắt, Zzz, "Good night!"), sang phòng khác tự bật đèn; bật đèn ⇒ ngáp "Good morning!".
  - 🎮 **Sân chơi**: chạm ĐẦU = vuốt (Purr~) · BỤNG = cù (cười) · CHÂN = hù (giật mình) — như Talking Tom chọc/vuốt; 🎾 ném bóng (bóng bay vòng cung, thú nhảy bắt); 🎈 **mini game "Pop the red balloon!"**: 3 bóng màu, máy đọc tên màu, chạm đúng ⇒ nổ + ăn mừng, 5 lượt đúng ≥ 4 ⇒ +1 🐟 (học màu đảo 1).
  - 🚶 **Đi dạo**: thú đi (`di`) qua 8 cảnh nền trận (2,6 giây/cảnh, nói tên vùng đất), cuối đường pháo giấy + 🎁 +2 🐟, vui +25, khoẻ −8.
- 🎤 **Nhại giọng** (phòng ngủ + sân chơi): ghi âm 3 giây (MediaRecorder) → phát nhanh 1,5× (giọng the thé), thú gầm theo, xong ăn mừng "Hee hee!".
- 🐟 Cá = tiền: thắng boss (số sao) · mini game bóng bay · đi dạo. Dùng cho món cá đặc biệt (sau này: đồ trang trí/áo).
- Mọi hành động thú NÓI 1 câu tiếng Anh (giọng pitch 1,5); món ăn nói tên tiếng Anh của món ⇒ chăm thú cũng là ôn từ.
- Máy không tải được module/WebGL ⇒ về ảnh tĩnh mèo (`assets/pet/meo_*.webp`, xuất từ `BatThu/thu-xuat.html`).
- Chưa làm (Talking Tom có): tủ quần áo / trang trí nhà bằng cá · nhiều mini game hơn · cấp độ lớn lên theo ngày.

## 4. Kỹ thuật & vận hành

- Web tĩnh, không build: `index.html` (viết theo khuôn Artifact: không html/head/body; `serve.mjs` bọc khi chạy local) + `js/*.js` + `js/anh/*.js` + `assets/` (WebP). three.js từ jsdelivr (importmap). Đóng gói 1 file ≈6 MB: `node tools/dong-goi.mjs` → `dist/web/index.html`; Vercel tự chạy lệnh này (`vercel.json`).
- **Commit phải dùng email `daothuybk@gmail.com`** (tài khoản GitHub gắn Vercel) — email khác bị Vercel chặn "couldn't find a Git account for the commit author".
- Kiểm tự động: `tools/kiem-anh.js` (fetch + eval trong trang; giả lập kéo bằng PointerEvent, giả lập mic) — Browser pane ẩn thì phải `resize_window` trước (viewport 0×0 ⇒ elementsFromPoint rỗng). `tools/kiem-lap.js` kiểm vòng đọc lại 3 giây.
- Thêm từ/đảo: 1 dòng ở `js/anh/tu.js` + 1 hàm vẽ ở `js/anh/hinh3d-2.js` (`LC.hinh3d.dangKy`). Thêm chữ phonics: 1 dòng `chu` (phải có hình). Thêm truyện: `TRUYEN` trong `truyen.js`.
- Bản đồ code: xem `README.md` của repo game.

## 5. Chưa làm / chờ CEO

- Chưa thử trên iPad thật: mic nhận giọng bé, ghi âm nhại giọng, cảm ứng kéo thả, giọng Samantha. Cần Thùy cho bé thử và báo.
- Giọng bản xứ ghi sẵn thay giọng máy; bài hát/chant; tô chữ cái bằng ngón tay; báo cáo cho bố mẹ; mini-game thuần chơi (đập chuột theo từ, lật thẻ nhớ) — CEO chưa chọn.
- Hình three.js là bản code; nếu Thùy tạo bộ hình riêng thì thay từng hình được (cùng id).
