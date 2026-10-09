# TOÁN DU HÀNH — bài học hình học dạng du hành (tài liệu tổng)

> **Đọc file này TRƯỚC khi sửa bài du hành Toán hoặc làm bài Toán mới dạng này.** Anh em với `spec-khtn-du-hanh.md`
> (cùng khuôn du hành: bay giữa các trạm, phim có lời dẫn, đúng mới mở đường). Tổng hợp quyết định CEO (Thùy) tới **09/10/2026**.
> Code: thư mục `toan-site/`. Cấu trúc: **Phần A** logic đã chốt · **Phần B** câu còn mở · **Phần C** detail bàn sau.

---

## 0. Tóm tắt một màn

- **Đích:** visual hoá bài giảng hình học thành chuỗi hoạt động tương tác để HS học tốt hơn. Mẫu cảm giác: bài KHTN *Liên kết hoá học*.
- **Bài đầu tiên:** **Tam giác bằng nhau** (Toán 7, KNTT — Bài 13: Hai tam giác bằng nhau + Trường hợp c.c.c; trong kho Hình là `HH00099`).
- **Chưa đo, chưa đụng DB** — demo là đủ (Thùy 09/10).

## 1. Đích & bối cảnh (CEO chốt 09/10)

| Mục | Chốt |
|---|---|
| Style | **Du hành như KHTN.** 3D **chỉ ở đoạn bay**; mọi thao tác với tam giác diễn ra trên **mặt phẳng trước mặt người dùng** (tấm bảng lơ lửng trong không gian) |
| Thiết bị | Phần học: **cả lớp nhìn TV**, GV điều khiển. **iPad chỉ dùng lúc chơi mini game** |
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
- 3D chỉ phục vụ **đoạn bay** và **phép LẬT** trong hoạt cảnh chồng hình (nhấc tấm lên, lật, đặt xuống) — đó chính là cách chồng hình
  của Euclid, nên hiệu ứng mang kiến thức chứ không để đẹp.

### A2. Tam giác phải LỆCH HẲN (Thùy 09/10)
- **Không dùng tam giác cân, đều, hay gần cân** — cân thì có nhiều cách ghép đỉnh cùng đúng, gần cân thì mắt không phân biệt được.
- Tiêu chí kỹ thuật (CTO tự đặt): **mọi cặp cạnh lệch ≥ 25%**, **mọi cặp góc lệch ≥ 15°**. Bộ cạnh đang dùng: 16–22–30 · 14–24–32 · 18–25–33.

### A3. Ký hiệu: 3 mức (Thùy 09/10)
1. **Chỉ hình dạng** — không ký hiệu, HS nhìn dáng (tìm góc to nhất/nhỏ nhất…) rồi xoay hình trong đầu.
2. **+ ký hiệu cạnh** (gạch).
3. **+ ký hiệu góc** (cung).
- Mỗi trạm luyện tập có mức mặc định; **GV đổi mức ngay trên màn** (nút "Ký hiệu" trong khung lời dẫn). Gợi ý khi HS sai đổi theo mức đang hiện.
- Phần c.c.c: chỉ mức 1–2 (không có góc).

### A4. Ngôn ngữ hình
| Dấu hiệu | Nghĩa |
|---|---|
| Tấm **xanh** | △ABC (tam giác gốc, có tên đỉnh) |
| Tấm **vàng** | tam giác kia |
| **Cùng màu** (hồng · xanh lá · tím) ở chữ, cạnh, góc | một **cặp tương ứng** |
| Hoạt cảnh **nhấc → lật (nếu cần) → xoay → đặt xuống** | chồng hình; khít = bằng nhau |
| Tô quạt màu ở đỉnh | góc tương ứng |

### A5. Phần 1 — Hai tam giác bằng nhau: 3 kiểu hỏi (Thùy 09/10)
Lõi của phần 1 là **thứ tự đỉnh** (lỗi số 1 của HS lớp 7).
1. **Chọn tên:** hai tam giác bằng nhau đủ mọi tư thế (dời, quay, lật, quay + lật) → "△ABC bằng tam giác nào?", đáp án là các hoán vị đỉnh.
   Đúng ⇒ hoạt cảnh chồng khít + sáng lần lượt các cặp đỉnh.
2. **Cạnh/góc tương ứng:** "AB = ?" kéo 1 trong 3 ô cạnh của tam giác kia vào chỗ trống; tương tự với góc. Đúng ⇒ chồng khít + sáng cặp đó.
3. **Gắn tên đỉnh:** cho △ABC = △DEF, tấm vàng không có tên đỉnh; kéo D, E, F vào ô trống quanh các đỉnh. Đúng ⇒ chồng khít + sáng từng cặp cạnh.
- Định nghĩa dạy **theo sách**: *hai tam giác bằng nhau là hai tam giác có các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau*;
  "chồng khít được" là trực giác dẫn tới định nghĩa đó. Có câu hỏi riêng: **lật mặt vẫn tính là bằng nhau**.

### A6. Phần 2 — Trường hợp c.c.c (Thùy 09/10)
- Hoạt cảnh như phần 1 nhưng **không có góc**.
- Có trạm **"vì sao 3 cạnh là đủ"** (dựng tam giác từ 3 đoạn cho trước bằng compa: chỉ ráp được một hình, hình đối xứng lật lên là trùng).
- Có ca **cạnh chung** và ca **không bằng nhau** (2 cặp cạnh bằng, cặp thứ 3 lệch).

### A7. Trình bày 5 dòng (theo luật lời giải Hình — `docs/log-giai-hinh-hoc-bai.md` R1/R2)
```
Xét △ABC và △DEF có:
AB = DE (giả thiết);
BC = EF (giả thiết);
AC = DF (giả thiết).
Do đó △ABC = △DEF (c.c.c).
```
- Bài tập kéo thả **cả 5 dòng** (Thùy 09/10). Ô nhiễu = lỗi hay gặp: ghép sai cặp cạnh, kết luận sai thứ tự đỉnh, ghi nhầm (c.g.c),
  sai lý do, "Xét △ABC = △DEF có:".
- 3 dòng điều kiện **đúng ở thứ tự nào cũng được** — chấm theo NỘI DUNG ô, không theo vị trí (CLAUDE.md §2 "danh tính bám khoá tự nhiên").
- Cạnh chung viết "AC chung;" như mẫu lời giải.

### A8. Mini game đội (TV + iPad) — Thùy 09/10
- Lớp chia đội, **mỗi đội 1 iPad**; TV chiếu tiến độ + bảng xếp hạng. Kết nối **giống hub game.bkacademy**: kênh Supabase Realtime theo
  **mã phòng**, presence TV/iPad theo slot, **không ghi DB**.
- **1 phiên = 10 câu.** Mỗi câu: hình hai tam giác bằng nhau khác tư thế + lời văn trình bày còn trống điều kiện và kết luận; đội tìm trong
  rất nhiều ô để kéo đúng ô vào đúng chỗ.
- **Kéo sai ⇒ câu đó tính sai, qua câu tiếp luôn** (không cho thử lại — chặn luôn kiểu thử bừa).
- **Thời gian = tổng 10 câu.**
- Chuẩn bị **5 phiên × 10 câu**, phủ **đủ các trường hợp** của c.c.c (rời nhau đủ 4 tư thế · cạnh chung kiểu diều · cạnh chung là đường chéo ·
  tam giác cân với trung điểm · hai tam giác chồng lên nhau · cạnh cho bằng số đo…).

### A9. Phát hành
- Thư mục `toan-site/` (trang tĩnh, không build): `index.html` mục lục · `tam-giac-bang-nhau.html` bài học · `vercel.json` tắt tự deploy khi push.
- Project Vercel riêng, Root Directory `toan-site/`, tên miền **toan.bkacademy.edu.vn** — **Thùy dựng** project + tên miền rồi bấm Create Deployment.
- Chạy máy: `node scripts/serve-games.mjs 5281 toan-site` (launch config `toan`).

---

## Phần B — CÂU CÒN MỞ (có đề xuất CTO)

- **B1. Xếp hạng mini game** khi đội A đúng nhiều câu hơn nhưng chậm hơn đội B. *Đề xuất:* số câu đúng trước, bằng nhau thì ít thời gian hơn thắng. (Luật do Thùy viết.)
- **B2. Các đội cùng đề?** *Đề xuất:* cùng phiên, cùng thứ tự câu (so được với nhau); **xáo vị trí ô theo từng đội** để nhìn trộm iPad đội bên cạnh không ăn thua.
- **B3. Số đội tối đa.** Hub game đang có 8 slot iPad.
- **B4. Ai duyệt đúng kiến thức + câu chữ Toán** (vai Ngọc bên KHTN).
- **B5. Engine chép từ bài KHTN** (tàu, phim, vùng bay, câu hỏi) và mở rộng (tấm bảng, tam giác, kéo thả). Hai site là hai Root Directory
  Vercel riêng nên chưa dùng chung file được. *Đề xuất:* khi có bài thứ 3 thì tách `du-hanh-engine.js` + bước copy lúc deploy.

## Phần C — DETAIL BÀN SAU (chỉ tên việc)

- Câu chữ lời dẫn, câu hỏi, gợi ý · tốc độ hoạt cảnh chồng hình · màu cặp tương ứng trên TV thật
- Âm thanh · giọng đọc · ảnh đại diện bài trên trang mục lục

---

## 3. Bài "Tam giác bằng nhau" — lộ trình trạm

| # | Trạm | Loại | Nội dung | Trạng thái |
|---|---|---|---|---|
| 0 | Tập lái | tập lái | 3 điểm sáng | ✅ bản thử 1 |
| 1 | Chồng khít: hai tam giác bằng nhau | học | phim nhấc–lật–xoay–đặt ⇒ định nghĩa; đỉnh/cạnh/góc tương ứng; lật mặt vẫn bằng | ✅ bản thử 1 |
| 2 | Viết tên đúng thứ tự đỉnh | học | △ABC = △NPM; đọc tên ra cạnh/góc; đổi thứ tự hai bên y hệt vẫn đúng | ✅ bản thử 1 |
| 3 | Luyện 1: tam giác này bằng tam giác nào? | luyện | kiểu 1, lật + xoay, mặc định chỉ hình dạng | ✅ bản thử 1 |
| 4 | Luyện 2: cạnh nào, góc nào bằng nhau? | luyện | kiểu 2: AB = ? rồi góc C = ?, mặc định + cạnh | ✅ bản thử 1 |
| 5 | Luyện 3: gắn tên đỉnh | luyện | kiểu 3: kéo D, E, F vào đỉnh tấm vàng | ✅ bản thử 1 |
| 6+ | thêm luyện kiểu 1–3 (đủ dời / quay / lật / quay + lật) | luyện | | ⏳ |
| — | Vì sao 3 cạnh là đủ (c.c.c) | học | dựng bằng compa | ⏳ |
| — | Luyện c.c.c (không góc · cạnh chung · ca không bằng nhau) | luyện | | ⏳ |
| — | Trình bày 5 dòng | học | phim viết từng dòng, dòng nào sáng cặp cạnh đó | ⏳ |
| — | Luyện trình bày: kéo cả 5 dòng | luyện | | ⏳ |
| — | Mini game đội (trang riêng, TV + iPad) | game | 5 phiên × 10 câu | ⏳ |

## 4. Bản đồ code

`toan-site/tam-giac-bang-nhau.html` — 1 file = cả bài (three.js r128 từ cdnjs, font Be Vietnam Pro). Khối dựng thêm so với KHTN:

| Hàm | Làm gì |
|---|---|
| `triFromSides(a,b,c)` | dựng tam giác từ 3 cạnh (đỉnh P0 đối cạnh a…), đặt trọng tâm ở gốc, thứ tự đỉnh ngược chiều kim đồng hồ |
| `makeTri(P, names, 'a'/'b')` | tấm tam giác: nền, cạnh, tên đỉnh (sprite), ký hiệu gạch/cung, `edgeHi`, `angleFill`, `setName`, `setPose` |
| `qOf(rot, flip)` · `moveTri` | tư thế = dời + quay trong mặt phẳng + lật (quay 180° quanh trục nằm trong mặt phẳng); hoạt cảnh nhấc → lật → xoay → đặt |
| `superpose(h)` / `goHome(h)` | tấm vàng chồng lên tấm xanh / về chỗ cũ |
| `triStation(i, cfg)` | trạm có tấm bảng + 2 tam giác; `cfg.sides`, `pose1/pose2`, `names2`, `level`, `ticks`, `arcs` |
| bước phim `frame` | `'board'` / `'left'` / `{x,y,w,h}` — máy quay vuông góc, tự lùi cho vừa phần màn trên khung lời dẫn |
| bước phim `drag` | kéo thả: `rows` (chỗ trống trong dòng chữ) hoặc `slots` (ô trống bám đỉnh 3D); chạm ô rồi chạm chỗ trống cũng được |
| `^A` trong chữ | ký hiệu góc (mũ) |

**Kiểm thử:** `window.__dbg` — `go(i)` · `skipFilm()` · `answer()` · `drop()` (kéo đúng hết ô đang hỏi) · `run(giây)` · `state()` · `level(n)`.

## 5. Đứng trên vai ai (R7)

- **Euclid — chồng hình (superposition)**: hai hình trùng khít thì bằng nhau → hoạt cảnh nhấc–lật–đặt.
- **Shepard & Metzler (1971) — xoay hình trong đầu**: kiểu 1 ở mức "chỉ hình dạng" luyện đúng năng lực này.
- **van Hiele**: bậc nhận dạng bằng mắt (phần 1) → bậc suy luận (trình bày 5 dòng).
- **Lời giải mẫu khuyết dần (faded worked examples — Renkl; completion problems — van Merriënboer)** → kéo thả 5 dòng.
- **Team-Games-Tournament (Slavin)** → mini game đội.
