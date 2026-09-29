# KHTN DU HÀNH — bài học dạng thế giới 3D (tài liệu tổng)

> **Đọc file này TRƯỚC khi sửa bài du hành hoặc làm bài KHTN mới dạng này.** Tổng hợp quyết định CEO (Thùy) + những gì ĐÃ BUILT,
> tính tới **29/09/2026** (bản thử 4). Lịch sử từng vòng sửa: `DEVLOG.md` ngày 29/09 (các mục "KHTN …").
> Code: thư mục `khtn-site/`. Đây là **bản thử** để chốt cách dạy — sau này phát triển thành **tính năng của môn KHTN**.
> Cấu trúc file theo luật "chốt logic trước, detail sau": **Phần A** logic đã chốt · **Phần B** câu logic còn mở (có đề xuất) ·
> **Phần C** detail bàn sau (chỉ tên việc).

---

## 0. Tóm tắt một màn

- **Đích:** dạy KHTN **trực quan nhất có thể** — mỗi bài học là một **thế giới 3D** (mẫu tham chiếu: tinh-do-thai-duong.vercel.app).
- **Hai kiểu bài:** **du hành** (tàu tí hon bay qua cấu trúc khổng lồ, ít tương tác — ADN, gen, nguyên tử…) và **tương tác**
  (nhiều thao tác — con lắc, nam châm, mạch điện…). Kiểu là **tính chất của từng bài**.
- **Bài đầu tiên đã build:** **Liên kết hoá học (KHTN 7)** — kiểu du hành, 12 trạm: 1 tập lái + 6 trạm học + 5 trạm luyện tập.
- **Chưa đo, chưa đụng DB.** Một file HTML tĩnh, chạy trên web công khai.

---

## 1. Đích & bối cảnh (CEO chốt 29/09)

| Mục | Chốt |
|---|---|
| Thứ tự mục đích | ① GV dạy trên lớp trực quan hơn › ② HS tự học/ôn › ③ quảng bá (trang công khai) |
| Khối · sách | KHTN **7 – 8 – 9**, bộ **KNTT** |
| Thiết bị | Hiện tại: **chiếu TV** trên lớp. Đích: **mỗi HS 1 iPad**, hoặc nhóm **2–3 em / 1 iPad** |
| Hình ảnh | **Khoa học thật** — "đây là học, không phải gami" |
| Làm hay mượn | **Tự build**; PhET chỉ để tham khảo cách làm |
| Đo | Đợt đầu **không đo**; mỗi bài/trạm sẽ gắn sẵn mã chuyên đề/dạng trong `khtn_ban_do` để sau cắm đo |
| Duyệt đúng kiến thức | **Thùy + Ngọc** (GV KHTN) |
| Bám sách | **Không bắt buộc bám SGK từng câu chữ.** CEO đặt mục tiêu học; CTO đề xuất các bậc/lộ trình phù hợp kiểu bài |

---

## Phần A — LOGIC ĐÃ CHỐT

### A1. Hai kiểu bài
- **Du hành:** cấu trúc là vật **khổng lồ**, HS **lái tàu tí hon** bay qua, rồi trả lời câu hỏi về chính vật đó.
- **Tương tác:** HS thao tác trực tiếp (kéo, nối, chỉnh) — *chưa build bài nào*.
- Kiểu là **tính chất của bài**, không phải chế độ HS tự chọn. (Thùy: mạch điện không có gì để khám phá nhưng có rất nhiều cách tương tác.)

### A2. Bài = chuỗi trạm, thứ tự CỐ ĐỊNH
- Trạm mở **lần lượt**. Giữa trạm trước và trạm đang làm là **vùng bay tự do có giới hạn** ("tự do trong khuôn khổ"):
  HS bay tuỳ ý trong vùng; ra khỏi vùng thì bị chặn lại (hiện lưới), kèm nhắc "hoàn thành trạm này để bay tiếp".
- **Trả lời đúng câu hỏi của trạm mới mở đường** sang trạm sau.
- Có 3 loại trạm: **tập lái** · **trạm học** · **trạm luyện tập**.

### A3. Nhịp của một TRẠM HỌC
1. **Cảnh phim có lời dẫn** — tự chạy khi tàu bay tới gần. Máy quay tự điều khiển, viền đen trên/dưới, phụ đề kể **sự kiện** từng
   bước (ví dụ: Na thừa 1, Cl thiếu 1 → lại gần → electron bay sang → cả hai hoàn hảo → hút nhau).
2. **Câu lời dẫn giao việc** — bước cuối của phim, dừng chờ bấm "Bắt đầu quan sát". Nói rõ **em cần quan sát gì**
   (mẫu Thùy: *"Giờ em hãy quan sát các lớp của Ne xem nó có bao nhiêu electron nhé"*). Câu này ghim ở đầu khung góc trái.
3. **Bay tự do quan sát** — quan sát **tổng thể**, không bắt bay sát. Khung "Điều cần quan sát" chỉ là gợi ý (không bắt tích đủ).
   Có các **điểm sáng**; tới gần thì **chú thích hiện ngay cạnh điểm đó**.
4. **Trả lời câu hỏi LÚC NÀO CŨNG ĐƯỢC** (nút luôn có). Sai → gợi ý, chọn lại ngay, hoặc đóng để bay xem tiếp (mở lại vẫn đúng câu đang làm).
5. Đúng hết → mở đường.

### A4. Nhịp của một TRẠM LUYỆN TẬP
- Hiện **mô hình 2 nguyên tử** với các lớp electron. Câu hỏi nằm ở **dải dưới**, mô hình vẫn thấy rõ phía trên.
- **Bộ 6 câu** (khuôn chung, Thùy chốt):
  1. A thừa hay thiếu bao nhiêu electron để hoàn hảo?
  2. Vậy A nên cho đi hay nhận thêm?
  3. B thừa hay thiếu bao nhiêu?
  4. Vậy B nên cho đi hay nhận thêm?
  5. A và B liên kết bằng cách nào: A cho B nhận (ion) / B cho A nhận / góp chung (cộng hoá trị)?
  6. Cho mấy electron / góp chung mấy cặp (hoặc câu riêng của trường hợp đó, vd "cần mấy Cl").
- Trả lời đúng câu nào → **nhãn lý luận** vàng hiện dần dưới nguyên tử ("Thừa 1 → cho đi").
- Xong cả bộ → **chiếu hoạt cảnh ĐÚNG theo đáp án** (electron bay sang chỗ trống, hoặc góp chung vào vùng chồng) → hiệu ứng liên kết.
- Cần **4–5 trạm luyện tập** với các **trường hợp khác nhau** để HS thấy rõ khi nào ion, khi nào cộng hoá trị.

### A5. KHÔNG LỘ ĐÁP ÁN trước khi HS trả lời
- Trong lúc HS bay quan sát / đang trả lời: **chú thích chỉ đưa dữ kiện + câu hỏi gợi mở** ("em đếm xem…"), **không nói kết luận**.
  Kết luận để dành cho phần **giải thích sau khi trả lời**.
- Cụ thể đã áp: không hiện sẵn "chỗ trống" trên nguyên tử nhận ở trạm luyện tập (chỉ hiện khi chiếu hoạt cảnh) · không ghi
  "kim loại / phi kim" trên nhãn trạm luyện tập · nhãn trạm học dùng "đầy ✓" thay vì con số trùng đáp án · không có tiêu đề phụ
  trùng đáp án · trả lời sai không bật đèn chỉ thẳng đáp án.
- **Cảnh phim vẫn giảng nội dung** (phim là bài giảng); câu hỏi kiểm tra sau.

### A6. Nguyên tử "luôn muốn đạt trạng thái hoàn hảo CỦA CHÍNH NÓ"
- Ý trung tâm của bài liên kết. Trước khi liên kết, dưới mỗi nguyên tử hiện **nhãn mục tiêu** vàng
  ("Muốn: bỏ 1 electron — để còn 8, hoàn hảo như Ne").
- Phải có **câu hỏi về ý này** (đã có ở trạm 1, 2, 4 — xem §3).

### A7. Ngôn ngữ hình (dùng thống nhất mọi bài)
| Dấu hiệu | Nghĩa |
|---|---|
| Vòng electron chuyển **vàng** + loé sáng + "đầy ✓" / "8e ✓" | nguyên tử đạt **trạng thái hoàn hảo** |
| Nhãn **vàng** dưới nguyên tử ("Muốn: …") | **mục tiêu** của nguyên tử |
| Quầng **cam** (+) / **xanh dương** (−) + **đường lực cam→xanh** có hạt chạy | **liên kết ion** — KHÔNG có gì nối 2 hạt nhân |
| Vùng chồng sáng **xanh ngọc** + **sợi** nối 2 hạt nhân (2 sợi = liên kết đôi) + cặp e xoay | **liên kết cộng hoá trị** (đúng nét "–", "=" trong công thức) |
| Electron **xanh nhạt** | electron đã chuyển từ nguyên tử khác sang |
| Màu nguyên tố | quy ước quốc tế **CPK** |

### A8. Nguyên tắc khoa học
- Vẽ **đúng mô hình của lớp đang học** (KHTN 7: mô hình **Bohr**, electron trên các lớp tròn). Không vẽ đám mây electron của lớp 10.
- Tỉ lệ bị nén để nhìn được (lớp electron phóng to) — **ghi chú cho HS** (như mẫu tham chiếu ghi "chế độ sơ đồ").
- Số liệu thật khi có thể: góc H₂O 104,5° · NaCl nóng chảy 801 °C · bán kính ion Cl⁻ ≈ 1,8 lần Na⁺ · NaCl là **mạng ion**, không có phân tử riêng.

### A9. Vai trò & công cụ cho GV
- **Thùy** đặt đích và mục tiêu học · **CTO (Claude)** đề lộ trình trạm, soạn kịch bản, build · **Ngọc** duyệt đúng kiến thức.
- Công cụ GV khi chiếu TV: **Qua trạm (GV)** · **Enter** = sang cảnh tiếp · **Dừng** phim · **Xem lại phim** · **Đầu chặng**.

### A10. Phát hành
- Web **công khai, riêng** cho KHTN: project Vercel, Root Directory `khtn-site/`, trang tĩnh (không build).
- **Tắt tự deploy khi push** (`khtn-site/vercel.json`) — repo ERP push liên tục; cập nhật web = Thùy bấm Create Deployment.
- **Không** đặt trong `games-site/` (học ≠ gami). **Chưa** nhúng vào app HS (chờ lúc bật đo).

---

## 3. Bài "Liên kết hoá học" — ĐÃ BUILD (bản thử 4, 29/09)

**Mục tiêu học (Thùy):** HS hiểu liên kết ion và cộng hoá trị, **phân biệt** được, **xác định** được chất nào là ion, chất nào là cộng hoá trị.

| # | Trạm | Loại | Diễn biến chính | Câu hỏi |
|---|---|---|---|---|
| 0 | Tập lái | tập lái | 3 điểm sáng dạy cách lái + đọc chú thích | — (đi đủ 3 điểm) |
| 1 | Khí hiếm: trạng thái hoàn hảo | học | Ne (2, 8), He (2) → vòng vàng; quy tắc bát tử; "hoàn hảo của chính nó" | lớp ngoài Ne mấy e · vì sao nguyên tử liên kết |
| 2 | Na gặp Cl: liên kết ion | học | nhãn mục tiêu → lại gần → e bay sang → Na⁺/Cl⁻ hoàn hảo → hút nhau (hiệu ứng ion) | vì sao Na chịu nhường · Na còn mấy e, mang điện gì · vì sao hút nhau |
| 3 | Bên trong hạt muối | học | ion rời rạc tự xếp thành mạng tinh thể 5×5×5 | mấy Cl⁻ sát Na⁺ ở tâm · hạt nào hút nhau |
| 4 | Hai H góp chung | học | cả hai thiếu 1 → góp chung 1 cặp (hiệu ứng cộng hoá trị) | H liên kết bằng cách nào · vì sao góp chung mà không cho |
| 5 | Phân tử nước | học | O thiếu 2, H thiếu 1 → 2 cặp dùng chung, góc 104,5° | có mấy cặp dùng chung |
| 6 | Cl gặp Cl | học | Cl₂ góp chung + cặp Na⁺Cl⁻ đặt dưới để so sánh → **luật nhận biết** | vì sao 2 Cl không tạo ion |
| 7 | Luyện tập 1: K và Cl | luyện tập | KCl — ion, cho 1 (K có 4 lớp; bẫy "thiếu 7") | bộ 6 câu |
| 8 | Luyện tập 2: H và Cl | luyện tập | HCl — cộng hoá trị, 1 cặp | bộ 6 câu |
| 9 | Luyện tập 3: Mg và O | luyện tập | MgO — ion, cho 2 → Mg²⁺ O²⁻ | bộ 6 câu |
| 10 | Luyện tập 4: C và O | luyện tập | CO₂ — cộng hoá trị, liên kết đôi O=C=O | bộ 6 câu |
| 11 | Luyện tập 5: Mg và Cl | luyện tập | MgCl₂ — ion, 1 Mg cho 2 ⇒ cần 2 Cl | bộ 6 câu |

**Luật nhận biết dạy ở trạm 6:** một bên muốn cho, một bên muốn nhận → ion; cả hai đều muốn nhận → góp chung (cộng hoá trị).
Thường gặp: kim loại + phi kim → ion; phi kim + phi kim → cộng hoá trị.

**Đã soi (29/09):** chạy trọn 12 trạm tới màn về đích; luồng sai → chọn lại/đóng → mở lại đúng câu; hoạt cảnh từng trạm luyện tập; 0 lỗi console.
**Chưa soi:** cảm ứng trên **iPad thật**; đọc chữ trên TV từ cuối lớp. **Chưa duyệt:** câu chữ lời dẫn và câu hỏi (chờ Ngọc).

**Mở ở đâu:**
- File: `khtn-site/lien-ket-hoa-hoc.html` (repo `HongThien/bkdemy-erp-v2`, nhánh `main`).
- Web: project Vercel riêng, Root Directory `khtn-site/` — trang chủ `index.html` là mục lục bài. Tên miền: Thùy đã dựng (29/09).
- Máy: `node scripts/serve-games.mjs 5270 khtn-site` → `http://localhost:5270/` (launch config `khtn`), hoặc bấm đúp file (cần mạng).
- Bản riêng tư để xem nhanh: https://claude.ai/artifact/Bx3nCocwpxRPLL15wtU2Ai

---

## 4. Bản đồ code & kỹ thuật (để làm tiếp)

**File:** `khtn-site/index.html` (mục lục) · `khtn-site/lien-ket-hoa-hoc.html` (1 file = cả bài) · `khtn-site/vercel.json` (tắt auto-deploy) ·
`scripts/serve-games.mjs` (server tĩnh, tham số thứ 2 = thư mục).
**Công nghệ:** HTML + three.js **r128** (cdnjs), font Be Vietnam Pro / Roboto Mono (Google Fonts). Không build, không DB.

**Khối dựng trong file bài (tái dùng được cho bài sau):**
| Hàm | Làm gì |
|---|---|
| `makeAtom(sym, shells, nucR)` | nguyên tử Bohr; mỗi lớp = số electron (xếp đều, quay) hoặc mảng góc (đứng yên, dùng khi cần điều khiển từng e). Lớp 1–4: bán kính `SHELL_R` |
| `makeMolecule({atoms, bonds})` | phân tử cộng hoá trị kiểu Bohr; `bonds: [i, j, bậc]`; `setForm(0→1)` = hai nguyên tử tiến lại, e dời vào vùng chồng; `perfectAll()` |
| `makeLattice(n, khoảng, A, B)` | mạng tinh thể ion; cạnh tô cam→xanh |
| `makeIonicFx(pa, pb, ra, rb)` / `makeCovalentFx(mol)` | hiệu ứng hai loại liên kết (A7) |
| `perfectRing` / `perfect` · `goalLabel` / `hideGoal` · `flyElectron` | vòng vàng hoàn hảo · nhãn mục tiêu · electron bay có vệt |

**Trạm (`defStation(i, {...})`):** `name` · `make(g) → h` (dựng nội dung; `h.solids` để va chạm, `h.update(dt,t)`) · `film(h, st) → [bước]` ·
`guide` (câu lời dẫn giao việc) · `points` `[{id, pos, title, text, r}]` (điểm sáng + chú thích) · `tasks` (điều cần quan sát) ·
`quiz` `[{q, opts, ans, explain, hint}]` · `practice` (trạm luyện tập) · `zoneR` / `filmDist`.
Trạm luyện tập dựng bằng `ionicPractice` / `covalentPractice` từ bảng `PRACTICE` (mỗi chất: A, B, câu 1 của từng bên, câu 6).

**Bước phim:** `{cam, look, move, text, on()}` — `cam`/`look` tính theo tâm trạm; bước không khai báo góc máy thì **đi tiếp tới đích của bước trước** ·
`{ask:{q, opts, ans, explain, hint, fixed?}, onRight()}` — câu hỏi ngay trong phụ đề, chờ trả lời · `{hold:true, next:'…'}` — chờ bấm.
`text` cho phép `<b>…</b>` để nhấn chữ. Phụ đề tự chạy theo độ dài câu (~12 ký tự/giây).

**Kiểm thử:** `window.__dbg` — `go(i)` nhảy trạm · `fly(x,y,z)` · `toPoint(id)` · `skipFilm()` · `answer()` (chọn đáp án đúng câu đang hỏi) ·
**`run(giây)`** chạy mô phỏng đồng bộ · `state()`.

**Bẫy đã gặp:**
- Browser pane **hoãn requestAnimationFrame** khi script đang chờ ⇒ ảnh chụp là khung cũ. Test theo thời gian phải dùng `__dbg.run()`;
  nghi ảnh cũ thì chụp lại lần 2.
- Animation `rotate` cộng dồn với `transform: translate` ⇒ vật bị lệch khỏi vị trí; tách phần xoay ra `::before`.
- Chú thích dựng bằng sprite 3D bị cắt ở mép màn ⇒ dùng thẻ HTML bám vị trí điểm, tự né mép.
- Máy quay trạm luyện tập phải chừa chỗ cho viền đen + dải câu hỏi, và lùi theo **tỉ lệ màn** (TV 16:9 ≠ iPad 4:3 ≠ điện thoại dọc).
- File có `<!doctype html>` để chạy chế độ chuẩn trên web (trước đó chạy quirks mode).
- Project Vercel có Root Directory con phải có `index.html` ở thư mục đó (không có ⇒ 404 ở link gốc). File `vercel.json` được đọc
  trong Root Directory của project đó.

---

## Phần B — CÂU LOGIC CÒN MỞ (có đề xuất CTO)

- **B1. "Thế giới" tách khỏi "bài".** *Đề xuất:* không gian dựng 1 lần, nhiều bài là nhiều lộ trình đi qua nó (như mẫu: 1 Hệ Mặt Trời,
  8 bài). Ví dụ thế giới **Tế bào** phục vụ cả K7 (quang hợp, hô hấp tế bào) lẫn K9 (ADN, NST, nguyên phân…).
- **B2. Tách engine khỏi kịch bản** khi có bài thứ 2. *Đề xuất:* 1 file engine dùng chung + mỗi bài = 1 file dữ liệu kịch bản (trạm,
  phim, câu hỏi). Thêm bài = viết kịch bản, không code lại.
- **B3. Khi bật ĐO.** Câu nào tính kết quả (câu trạm học / bộ luyện tập)? *Đề xuất:* ghi theo (HS × dạng KHTN) như mọi dữ liệu học tập —
  mang nhãn môn (CLAUDE.md §1.6), tính ở Postgres (§2.0), chỉ tạo dòng khi có kết quả thật (§1.5).
  **Vướng:** nhóm 2–3 em chung 1 iPad thì ghi kết quả cho ai.
- **B4. Tích hợp app HS.** Trang riêng (link/nhúng) hay màn trong app? Nếu vào app thì phần vỏ (nút, thẻ) theo STYLE-HS, còn thế giới 3D
  bên trong vẫn là khoa học thật.
- **B5. Bài kiểu TƯƠNG TÁC** (con lắc, nam châm, mạch điện). *Đề xuất:* khung **Dự đoán → Quan sát → Giải thích (POE)**; mô phỏng chạy
  đúng vật lý (vd con lắc T = 2π√(l/g)) để HS đo được số.
- **B6. Danh mục thế giới cho K7–9.** *Đề xuất (chưa chốt):* ~8 thế giới gom ~40 chuyên đề —
  Tế bào · Nguyên tử–Phân tử · Cơ thể người (du hành) · bàn Điện · Từ · Quang · Cơ · Âm (tương tác).
  Bài thiên tính toán/ghi nhớ (hoá trị & CTHH, PTHH, nồng độ…) chưa làm thế giới.
- **B7. Bài tiếp theo** chọn theo **lịch dạy thật** của lớp, để dùng ngay trên lớp và đo được hiệu quả.

---

## Phần C — DETAIL BÀN SAU (chỉ tên việc)

- Tốc độ phụ đề tự chạy · độ dài phim mỗi trạm · tốc độ/độ nhạy lái · bán kính hiện chú thích
- Câu chữ lời dẫn, câu hỏi, gợi ý, giải thích (Ngọc duyệt)
- Câu C "thiếu 4" (hiện không có phương án "thừa 4") — cách dạy của Ngọc
- Thêm/đổi chất ở trạm luyện tập
- Giọng đọc (tự đọc máy hay ghi âm GV) · âm thanh
- Ảnh đại diện / mô tả từng bài trên trang mục lục · tên miền con cho từng khối
- Chế độ GV (khoá bỏ qua, điều khiển từ xa…)

---

## 5. Việc còn treo

- Soi cảm ứng trên **iPad thật**; soi chữ trên **TV** từ cuối lớp.
- **Ngọc duyệt** nội dung bài Liên kết hoá học.
- Kiểm bản web sau khi Thùy deploy (link tên miền chưa gửi vào phiên 29/09).
- Bản đồ `khtn_ban_do`: **K7** dừng ở Trao đổi chất, **K8** chỉ có 3 chủ đề (thiếu Acid–base–muối, Moment lực, Điện, Nhiệt, Sinh vật &
  môi trường…) — cố ý hay chưa nhập? **K9** nhảy mã `K091102 → K091104` (thiếu 1 chuyên đề, có thể là Dịch mã). Cần khi làm B3.
- Gắn bài/trạm vào mã chuyên đề: Liên kết hoá học ↔ `K070202` (và `K070101`, `K070201` cho phần nguyên tử/phân tử).

---

## 6. Đứng trên vai ai (R7)

- **The Magic School Bus** (xe buýt thu nhỏ chui vào cơ thể) · **Powers of Ten** (Eames, 1977 — phóng to qua các bậc độ lớn) → kiểu du hành.
- **PhET Interactive Simulations** (ĐH Colorado) → kiểu tương tác. **POE — Predict–Observe–Explain** (White & Gunstone).
- **Kirschner–Sweller–Clark (2006):** khám phá thiếu dẫn dắt thì HS không học được → lý do có lời dẫn + nhiệm vụ quan sát + câu hỏi.
- **Mayer — seductive details:** cảnh đẹp không gắn kiến thức làm HS nhớ cảnh, quên bài → mọi hiệu ứng phải mang nghĩa (A7).
- **Gating / mastery learning** (Bloom, 1968; Super Mario 64 "cửa sao") → "tự do trong khuôn khổ", đúng mới mở đường.
- **Quy ước màu CPK** cho nguyên tố.
