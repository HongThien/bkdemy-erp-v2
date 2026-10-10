# TOÁN DU HÀNH — bài học hình học dạng du hành (tài liệu tổng)

> **Đọc file này TRƯỚC khi sửa bài du hành Toán hoặc làm bài Toán mới dạng này.** Anh em với `spec-khtn-du-hanh.md`
> (cùng khuôn du hành: bay giữa các trạm, phim có lời dẫn, đúng mới mở đường). Tổng hợp quyết định CEO (Thùy) tới **10/10/2026**.
> Code: thư mục `toan-site/`. Cấu trúc: **Phần A** logic đã chốt · **Phần B** câu còn mở · **Phần C** detail bàn sau.

---

## 0. Tóm tắt một màn

- **Đích:** visual hoá bài giảng hình học thành chuỗi hoạt động tương tác để HS học tốt hơn. Mẫu cảm giác: bài KHTN *Liên kết hoá học*.
- **Bài đầu tiên:** **Tam giác bằng nhau** (Toán 7, KNTT — Bài 13: Hai tam giác bằng nhau + Trường hợp c.c.c; trong kho Hình là `HH00099`).
- **Đã build (bản thử 2, 10/10):** bài học **10 trạm** (4 trạm học + 5 trạm luyện, 19 câu luyện) + **mini game đội** TV–iPad (5 phiên × 10 câu).
- **Chưa đo, chưa đụng DB** — demo là đủ (Thùy 09/10).

## 1. Đích & bối cảnh (CEO chốt 09/10)

| Mục | Chốt |
|---|---|
| Style | **Du hành như KHTN.** 3D **chỉ ở đoạn bay**; mọi thao tác với tam giác diễn ra trên **mặt phẳng trước mặt người dùng** (tấm bảng lơ lửng trong không gian) |
| Thiết bị | Phần học + luyện: **cả lớp nhìn TV** — GV hỏi HS rồi GV thao tác, hoặc cho HS lên bảng thao tác. **iPad chỉ dùng lúc chơi mini game** |
| Đo | **Chưa đo.** Demo |
| Web | **Site riêng `toan.bkacademy.edu.vn`** (không gộp với KHTN) |
| Duyệt kiến thức | *chưa chốt — xem B4* |

---

## Phần A — LOGIC ĐÃ CHỐT

### A1. Thế giới = tấm bảng phẳng trong không gian
- Mỗi trạm là một **tấm bảng** lơ lửng; tàu bay giữa các tấm bảng (giữ nguyên nhịp KHTN: phim → giao việc → bay quan sát → trả lời,
  trạm mở lần lượt, ra khỏi vùng thì bị chặn).
- **Khi quan sát/trả lời, máy quay nhìn VUÔNG GÓC tấm bảng.** Lý do: mặt phẳng song song với màn hình chiếu ra là hình đồng dạng —
  không méo độ dài, góc. Nhìn xiên (phối cảnh) thì hai cạnh bằng nhau trông dài ngắn khác nhau ⇒ sai kiến thức.
- 3D chỉ phục vụ **đoạn bay** và **phép LẬT / GẤP** trong hoạt cảnh chồng hình (nhấc tấm lên, lật, đặt xuống; gấp quanh cạnh chung) — đó chính
  là cách chồng hình của Euclid, nên hiệu ứng mang kiến thức chứ không để đẹp.
- **Trạm xong thì tấm bảng bay lên, mở đường** (đường sang trạm sau đi xuyên qua chỗ tấm bảng đứng).

### A2. Tam giác phải LỆCH HẲN (Thùy 09/10)
- **Không dùng tam giác cân, đều, hay gần cân** — cân thì có nhiều cách ghép đỉnh cùng đúng, gần cân thì mắt không phân biệt được.
- Tiêu chí kỹ thuật (CTO tự đặt): **mọi cặp cạnh lệch ≥ 25%**, **mọi cặp góc lệch ≥ 15°**. Bộ cạnh đang dùng:
  16–22–30 · 14–24–32 · 18–25–33 · 15–21–28 · 16–23–31 · 12–22–31; riêng ca "tam giác cân có trung điểm" dùng nửa tam giác vuông 18,5–24–30,3.
- Áp cả cho hình "không bằng nhau": tấm thứ hai cũng phải lệch hẳn (đã dính: mở góc ra thì thành gần cân ⇒ đổi sang khép góc).

### A3. Ký hiệu: 3 mức (Thùy 09/10)
1. **Chỉ hình dạng** — không ký hiệu, HS nhìn dáng (tìm góc to nhất/nhỏ nhất…) rồi xoay hình trong đầu.
2. **+ ký hiệu cạnh** (gạch).
3. **+ ký hiệu góc** (cung).
- Trong một trạm luyện, ký hiệu **bớt dần qua từng câu** (đủ → chỉ cạnh → chỉ hình dạng). **GV đổi mức ngay trên màn** (nút "Ký hiệu");
  GV đã chọn thì **giữ mức đó cho các câu sau của trạm**. Gợi ý khi sai đổi theo mức đang hiện.
- Phần c.c.c: chỉ mức 1–2 (không có góc). Cạnh **không gạch** trong hình c.c.c = **cạnh chung**.

### A4. Ngôn ngữ hình
| Dấu hiệu | Nghĩa |
|---|---|
| Tấm **xanh** | tam giác gốc (△ABC…) |
| Tấm **vàng** | tam giác kia |
| **Cùng màu** (hồng · xanh lá · tím) ở chữ, cạnh, góc | một **cặp tương ứng** |
| **Nhấc → lật (nếu cần) → xoay → đặt xuống** | chồng hình hai tam giác rời nhau; khít = bằng nhau |
| **Gấp quanh cạnh chung** · **quay nửa vòng quanh trung điểm** · **gấp quanh trung trực** | chồng hình khi hai tam giác chung cạnh (kiểu diều · chung đường chéo · chồng lên nhau) |
| Cạnh tô **đỏ** sau khi chồng | cạnh thứ ba lệch ⇒ không bằng nhau |

### A5. Phần 1 — Hai tam giác bằng nhau: 3 kiểu hỏi (Thùy 09/10)
Lõi của phần 1 là **thứ tự đỉnh** (lỗi số 1 của HS lớp 7).
1. **Chọn tên:** hai tam giác bằng nhau đủ mọi tư thế (dời, xoay, lật, xoay + lật) → "△ABC bằng tam giác nào?", đáp án là các hoán vị đỉnh
   (luôn có cách đọc theo thứ tự chữ cái làm bẫy). Đúng ⇒ hoạt cảnh chồng khít + sáng lần lượt các cặp đỉnh.
2. **Cạnh/góc tương ứng:** "AB = ?" kéo ô cạnh của tam giác kia vào chỗ trống (1 ô, hoặc cả 3 cạnh một lúc); tương tự với góc.
3. **Gắn tên đỉnh:** cho △ABC = △DEF, tấm vàng không có tên đỉnh; kéo tên vào ô trống quanh các đỉnh.
- Định nghĩa dạy **theo sách**: *hai tam giác bằng nhau là hai tam giác có các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau*;
  "chồng khít được" là trực giác dẫn tới định nghĩa đó. Có câu hỏi riêng: **lật mặt vẫn tính là bằng nhau**.
- Không để câu sau lộ đáp án bằng loại trừ (đã dính: hỏi AB rồi hỏi góc C — tô màu A, B xong là C lộ ⇒ xoá màu trước câu sau).

### A6. Phần 2 — Trường hợp c.c.c (Thùy 09/10)
- Hoạt cảnh như phần 1 nhưng **không có góc**.
- Trạm **"vì sao 3 cạnh là đủ"**: dựng tam giác từ 3 đoạn cho trước bằng compa — hai cung tròn cắt nhau ở đúng 2 điểm A, A'; gấp △A'BC quanh BC
  trùng △ABC ⇒ ba cạnh chỉ ghép được một tam giác. **Bản lề** hai cạnh: góc mở đổi thì cạnh thứ ba đổi ⇒ hai cạnh chưa đủ.
- Có ca **cạnh chung** (kiểu diều, chung đường chéo, chồng lên nhau) và ca **không bằng nhau** (2 cặp cạnh bằng, cặp thứ 3 lệch).

### A7. Trình bày 5 dòng (theo luật lời giải Hình — `docs/log-giai-hinh-hoc-bai.md` R1/R2)
```
Xét △ABC và △DEF có:
AB = DE (giả thiết);
BC = EF (giả thiết);
AC = DF (giả thiết).
Do đó △ABC = △DEF (c.c.c).
```
- Bài tập kéo thả **cả 5 dòng** (Thùy 09/10). Ô nhiễu = lỗi hay gặp: ghép sai cặp cạnh, kết luận sai thứ tự đỉnh, ghi nhầm (c.g.c),
  cạnh chung ghi lý do "giả thiết", "Xét △ABC = △DEF có:".
- 3 dòng điều kiện **đúng ở thứ tự nào cũng được** — chấm theo NỘI DUNG ô, không theo vị trí (CLAUDE.md §2 "danh tính bám khoá tự nhiên").
- Cạnh chung viết "BD chung".

### A8. Luyện tập trên lớp = chuỗi câu trên cùng tấm bảng (Thùy 09/10: "nên có thêm các trường hợp… hiện trên tivi, GV hỏi rồi GV thao tác, hoặc cho HS lên bảng")
- Mỗi trạm luyện là **một chuỗi 3–5 câu ngay trên tấm bảng** — không bay giữa từng câu (trên lớp bay nhiều mất thời gian).
- Mỗi câu: hỏi → đúng (hoặc GV bấm **"Đáp án (GV)"** khi cả lớp bí) → hoạt cảnh chồng hình → kết quả, GV bấm "Câu tiếp".
- Kéo ô thả vào chỗ trống, **hoặc chạm ô rồi chạm chỗ trống** (bấm chuột/chạm trên TV cho nhanh). Chữ, ô đủ to để đọc từ cuối lớp.
- Phần bài giảng (phim có tô màu/sáng cặp tương ứng) giữ nguyên — luyện tập là phần thêm vào.

### A9. Mini game đội (TV + iPad) — Thùy 09/10
- Lớp chia đội, **mỗi đội 1 iPad**; TV chiếu mã phòng, bảng điểm trực tiếp, xếp hạng. Kết nối **giống hub game.bkacademy**: kênh Supabase
  Realtime theo **mã phòng**, **không ghi DB**.
- **1 phiên = 10 câu.** Mỗi câu: hình hai tam giác bằng nhau + bài trình bày đã có dòng "Xét…", còn trống **3 dòng điều kiện + dòng kết luận**;
  đội tìm trong **12 ô** để kéo đúng ô vào đúng chỗ.
- **Kéo sai ⇒ câu đó tính sai, qua câu tiếp luôn.** (Thả ô điều kiện vào chỗ kết luận hoặc ngược lại = thả nhầm chỗ, bật lại, không tính sai.)
- **Thời gian = tổng 10 câu.**
- **5 phiên × 10 câu**, phiên nào cũng đủ: hai tam giác rời (dời · xoay · lật · xoay + lật) · chung cạnh · chung đường chéo · chồng lên nhau ·
  tam giác cân có trung điểm cạnh đáy (lý do "M là trung điểm của BC").
- Có **chơi thử một mình** (không cần TV) để GV xem trước đề.

### A10. Phát hành
- Thư mục `toan-site/` (trang tĩnh, không build): `index.html` mục lục · `tam-giac-bang-nhau.html` bài học · `thi-doi.html` mini game ·
  `lib/` (thư viện kết nối) · `vercel.json` tắt tự deploy khi push.
- Project Vercel riêng, Root Directory `toan-site/`, tên miền **toan.bkacademy.edu.vn** — **Thùy dựng** project + tên miền rồi bấm Create Deployment.
- Chạy máy: `node scripts/serve-games.mjs 5281 toan-site` (launch config `toan`).

---

## Phần B — CÂU CÒN MỞ (đang chạy theo đề xuất CTO, chờ Thùy chốt)

- **B1. Xếp hạng mini game.** *Đang dùng:* đội đúng nhiều câu hơn xếp trên; bằng số câu đúng thì đội nhanh hơn xếp trên. (Luật do Thùy viết.)
- **B2. Các đội cùng đề?** *Đang dùng:* cùng phiên, cùng thứ tự câu; **vị trí 12 ô xáo khác nhau theo từng đội** (nhìn iPad đội bên không ăn thua).
- **B3. Số đội tối đa.** *Đang dùng:* 8.
- **B4. Ai duyệt đúng kiến thức + câu chữ Toán** (vai Ngọc bên KHTN).
- **B5. Engine chép từ bài KHTN** rồi mở rộng. Hai site là hai Root Directory Vercel riêng nên chưa dùng chung file được.
  *Đề xuất:* khi có bài thứ 3 thì tách `du-hanh-engine.js` + bước copy lúc deploy.

## Phần C — DETAIL BÀN SAU (chỉ tên việc)

- Câu chữ lời dẫn, câu hỏi, gợi ý · tốc độ hoạt cảnh · màu cặp tương ứng trên TV thật
- Âm thanh · giọng đọc · mã QR vào phòng trên màn TV · TV chiếu lại câu sai nhiều nhất sau mỗi phiên

---

## 3. Bài "Tam giác bằng nhau" — lộ trình trạm (bản thử 2)

| # | Trạm | Loại | Nội dung |
|---|---|---|---|
| 0 | Tập lái | tập lái | 3 điểm sáng |
| 1 | Chồng khít: hai tam giác bằng nhau | học | phim nhấc–lật–xoay–đặt ⇒ định nghĩa; đỉnh/cạnh/góc tương ứng; lật mặt vẫn bằng · 3 câu hỏi |
| 2 | Viết tên đúng thứ tự đỉnh | học | △ABC = △NPM; đọc tên ra cạnh/góc; đổi thứ tự hai bên y hệt vẫn đúng · 3 câu hỏi |
| 3 | Luyện 1: bằng tam giác nào? | luyện | 4 câu: dời · xoay · lật · xoay + lật |
| 4 | Luyện 2: cạnh nào, góc nào bằng nhau? | luyện | 4 câu: 1 cạnh · 1 góc · cả 3 cạnh · cả 3 góc |
| 5 | Luyện 3: gắn tên đỉnh | luyện | 3 câu: xoay · lật · xoay + lật |
| 6 | Cạnh – cạnh – cạnh: vì sao ba cạnh là đủ | học | dựng bằng compa, gấp △A'BC, bản lề · 3 câu hỏi |
| 7 | Luyện 4: trường hợp c.c.c | luyện | 5 câu: rời nhau · không bằng nhau · chung cạnh · chung đường chéo · chồng lên nhau |
| 8 | Trình bày: 5 dòng chứng minh | học | viết từng dòng, dòng nào sáng cặp cạnh đó · 3 câu hỏi |
| 9 | Luyện 5: trình bày c.c.c | luyện | 3 câu kéo đủ 5 dòng: rời nhau · chung cạnh · chung đường chéo |

**Đã soi (10/10):** bay thật trọn 10 trạm chỉ bằng phím W + bấm trả lời tới màn về đích, không kẹt, 0 lỗi console; kéo thả bằng chuột thật.
Mini game: soát tự động cả 50 câu (bằng nhau thật, không gần cân, đỉnh chung khớp, không ô nhiễu nào vô tình đúng); chơi thử trọn phiên;
nối thật TV ↔ iPad qua 2 tab (vào phòng → bắt đầu → bảng điểm trực tiếp → xếp hạng).
**Chưa soi:** TV và iPad thật; nhiều iPad cùng lúc; mạng yếu.

## 4. Bản đồ code

**`toan-site/tam-giac-bang-nhau.html`** — 1 file = cả bài (three.js r128 từ cdnjs, font Be Vietnam Pro). Khối dựng thêm so với KHTN:

| Hàm | Làm gì |
|---|---|
| `triFromSides(a,b,c)` | dựng tam giác từ 3 cạnh, trọng tâm ở gốc, đỉnh ngược chiều kim đồng hồ |
| `makeTri(P, names, 'a'/'b')` | tấm tam giác: nền, cạnh, tên đỉnh, ký hiệu gạch/cung, `edgeHi`, `angleFill`, `setName`, `setPose`, `world(k)` |
| `qOf(rot, flip)` · `moveTri` · `pivotTo` | tư thế = dời + quay + lật; hoạt cảnh nhấc → lật → xoay → đặt; gấp/quay quanh một trục đi qua một điểm |
| `superpose(h)` / `goHome(h)` | tấm vàng chồng lên tấm xanh (tự chọn kiểu theo `join` của câu) / về chỗ cũ |
| `placePose` · `joinPose` | đặt tấm xanh theo một cạnh; tư thế tấm vàng = ảnh đối xứng qua cạnh chung (`fold`) / trung trực (`bis`) / tâm (`spin`) |
| `triStation(i, cfg)` · `h.loadCase(cs)` | trạm có tấm bảng + 2 tam giác; nạp một câu (`sides, pose1/pose2 | place+join+edge, names1/2, show2, level, ticks, arcs, bend`) |
| `practiceStation(i, {cases})` · `caseSteps` | trạm luyện = chuỗi câu; loại câu `ten · canh · goc · gan · khong · tb` |
| `proofLines(N1, N2, ticks)` | 5 dòng trình bày c.c.c (cạnh không gạch = cạnh chung) |
| bước phim `frame` | `'board'` / `'tri'` / `'left'` / `{x,y,w,h}` — máy quay vuông góc, tự lùi cho vừa phần màn còn trống (trên khung lời dẫn, hoặc bên trái khi `side`) |
| bước phim `drag` | kéo thả: `rows` (chỗ trống trong dòng chữ; `ans` là 1 mã hoặc danh sách mã chấp nhận) hoặc `slots` (ô trống bám đỉnh 3D) |
| bước phim `proof: n` + trạm `side: true` | bảng chứng minh hiện dần n dòng; khung lời dẫn đứng bên phải |
| `openBoard(st)` · `setZone()` | trạm xong: tấm bảng bay lên; chặng mới bắt đầu trước mặt tấm bảng cũ |
| `^A` trong chữ | ký hiệu góc (mũ rộng, không dùng Â/Ê vì trùng chữ tiếng Việt) |

**Kiểm thử:** `window.__dbg` — `go(i)` · `approach()` · `skipFilm()` · `answer()` · `drop()` · `run(giây)` · `snap(tên)` · `state()` · `level(n)`.
⚠ `go()` nhảy cóc bỏ qua đoạn bay giữa các trạm — **phải có 1 lượt bay thật từ đầu tới cuối** (lỗi kẹt sau trạm 1 nằm đúng ở đoạn đó).

**`toan-site/thi-doi.html`** — mini game, 1 file, SVG phẳng (không three.js). `BANK` 5 phiên × 10 câu (bảng ngắn: loại, hình, tên, tư thế) ·
`buildQ(phiên, câu, đội)` dựng hình + 12 ô (xáo theo đội) · `drawQ` vẽ SVG · vai `tv` / `doi` (`?role=&slot=&room=`) · kênh `toan-thi:<mã phòng>`,
sự kiện `state` (TV → đội), `prog` (đội → TV), `hello`. Hook: `window.__bank` (soát đề), `window.__thi` (câu đang làm).
`toan-site/lib/ket-noi.js` = địa chỉ + khoá anon của kênh realtime, chép từ `games-site/index.html`.

## 5. Đứng trên vai ai (R7)

- **Euclid — chồng hình (superposition)**: hai hình trùng khít thì bằng nhau → hoạt cảnh nhấc–lật–đặt, gấp quanh cạnh chung.
- **Shepard & Metzler (1971) — xoay hình trong đầu**: câu ở mức "chỉ hình dạng" luyện đúng năng lực này.
- **van Hiele**: bậc nhận dạng bằng mắt (phần 1) → bậc suy luận (trình bày 5 dòng).
- **Lời giải mẫu khuyết dần (faded worked examples — Renkl; completion problems — van Merriënboer)** → ký hiệu bớt dần, kéo thả 5 dòng.
- **Team-Games-Tournament (Slavin)** → mini game đội.
