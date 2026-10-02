# spec-dau-tu-vung.md — GAME ĐẤU TỪ VỰNG (PvP realtime) cho app HS

> Khởi nguồn: Thùy 02/10 gửi https://bufopia.pages.dev ("làm lại game này cho HS BK"). CTO phân tích bản gốc (đọc mã nguồn) → Thùy chốt 5 điểm.
> File này: **Phần A = logic** (chốt trước) · **Phần B = chi tiết bàn sau** (số, tên, quà) — theo luật "chốt logic trước, detail sau".
> Đọc kèm: `spec-v1-app-hs.md` (hạng mục 9) · `design/STYLE-HS.md` · `spec-anh-ban-do-k9.md` §3.3 · `spec-luong-kho.md` (cổng ghi).

---

## 0. Thùy chốt 02/10

1. **Mục đích:** ôn từ vựng **và** học thêm từ mới. Hình thức = **PvP realtime**.
2. **Không thưởng xu theo trận.** Trận cho **điểm xếp hạng season**; **hết season mới trao quà**.
3. **Lớp 3 → 9.**
4. **Đấu bot + đấu online — online là chính.**
5. **Nằm trong app HS, vào V1.0** (độc lập, ít đụng luồng khác).
6. **Kho từ v1 do Claude làm:** quét từ vựng trong sách HS đang dùng + đề xuất từ mới hợp độ tuổi theo nghiên cứu. GV chỉnh sau.

---

# PHẦN A — LOGIC

## 1. Bản gốc Bufopia: lấy gì, bỏ gì

Đọc từ mã nguồn bản đang chạy (02/10), nên luật dưới đây là luật thật, không đoán.

**LẤY — lõi trận đấu:**
- Trận **15 từ**, mỗi từ **12 giây**, 4 đáp án.
- **Hai bên trả lời cùng lúc. Ai đúng trước thì ăn từ đó.**
  - Bấm sai thì đáp án đó bị khoá với mình, mình vẫn bấm tiếp được.
  - Bên chậm hơn thấy "Chậm hơn một chút!".
- Điểm mỗi từ: đúng < 2 giây = 100 · < 4 giây = 70 · còn lại = 50. Cứ 3 câu đúng liền thì +30. Hết trận, ai nhiều điểm hơn thì thắng.
- **Bot 3 mức:** mỗi mức có khoảng thời gian trả lời và tỉ lệ sai lần đầu riêng (bản gốc: 2,4–4,2 giây · 1,6–2,7 giây · 0,9–1,65 giây; sai lần đầu 40% · 24% · 7%). Từ càng dài bot càng chậm.
- **Màn ôn từ yếu.** Bản gốc dùng hộp Leitner: đúng nhanh 3 lần liền thì ôn lại sau 3 ngày, 5 lần thì sau 7 ngày; sai thì về "cần ôn".

**BỎ / LÀM KHÁC:**

| Bufopia | BK | Vì sao |
|---|---|---|
| Đấu bot và 2 người 1 máy: điểm do máy HS tự tính | **Server chấm mọi chế độ.** Server chọn đề, ghi giờ trả lời theo đồng hồ server, quyết người ăn từ | CLAUDE §2.0. Có điểm season, có quà ⇒ client tự chấm là bị hack ngay |
| Nhớ từ lưu trong trình duyệt (đổi máy là mất) | Lưu **nhật ký trả lời** (append-only) ở DB. Mức nhớ từng từ **tính lại** từ nhật ký bằng `fn_*` | CLAUDE §1: mastery không lưu, suy động |
| Đáp án sai lấy ngẫu nhiên trong cùng chủ đề | Đáp án sai **cùng loại từ, cùng cấp**, và **nghĩa không chồng** lên đáp án đúng | Khác loại từ thì HS đoán ra. Nghĩa chồng thì thành "2 đáp án cùng đúng" (lỗi số 1 của câu Anh) |
| 900 từ theo chủ đề chung (IELTS, TOEIC…) | Kho theo **sách HS đang học**, từng khối · từng unit, cộng lớp từ mới theo khung quốc tế | Mục đích = ôn đúng bài trên lớp + học thêm |
| Hình thỏ Bunny / Pip | Hình theo **style app HS** (`skin/KhungHS`) | Không dùng hình của người ta. App HS theo style (CLAUDE §6) |
| 2 người 1 máy | **Không làm ở V1** | Thùy chọn bot + online |

## 2. ⚠ Sự thật về số người: online thuần sẽ hiếm khi ghép được trận

Đo 30 ngày qua (tự luyện, mọi môn, đọc DB 02/10):
- **179 HS** có dùng app.
- Số HS cùng hoạt động trong 1 khung 15 phút:
  - phần lớn là **1–2 em**;
  - đỉnh **7 em**, chỉ 3 lần trong cả tháng.
- **Giờ đông nhất: 19h–22h** (21h: 75 em khác nhau trong tháng).

Lớp 3–9 lại phải ghép đúng trình độ. Nếu chỉ có "bấm Tìm trận rồi chờ người lạ" như Bufopia, **phần lớn lần bấm sẽ không có ai**: em chờ, chán, thoát.
Đây là bài toán quen thuộc của game ít người chơi (cold-start / low-liquidity matchmaking). Các game giải bằng **4 lớp chồng lên nhau**, BK làm đủ cả 4:

1. **Thách đấu bạn (trực tiếp).**
   - Gửi lời mời cho một em cụ thể (bạn cùng lớp, bạn trên Thế giới BK). Lời mời hiện trong app.
   - Đây là kênh mạnh nhất với số người nhỏ: em rủ bạn **đang ngồi cạnh** hoặc nhắn rủ nhau vào.
2. **Hàng chờ ngẫu nhiên.**
   - Ghép theo trình độ, **nới dần**: chờ càng lâu thì chấp nhận đối thủ lệch càng xa.
   - Quá N giây không có ai ⇒ mời em chọn: đấu **bóng ma** hoặc đấu **bot**.
3. **Đấu bóng ma (bất đồng bộ).**
   - Em đấu lại **bản ghi một trận thật** của một em khác cùng trình độ: cùng bộ từ, cùng thời điểm bấm của em đó.
   - **Ghi rõ "Bóng ma của <tên>"**, không giả làm người đang online.
   - Có điểm season, nhưng thấp hơn trận người thật (Phần B).
   - Kỹ thuật này có tên: ghost racing (Mario Kart Time Trial) / asynchronous multiplayer (Trivia Crack, Words With Friends).
   - **Mỗi trận online thật sinh ra 2 bóng ma** ⇒ kho bóng ma tự đầy theo thời gian.
4. **Giờ vàng.**
   - Một khung giờ cố định buổi tối (đề xuất 20h–21h30, đúng giờ đông), hàng chờ được ưu tiên trên Home.
   - Có thể cộng thêm điểm season trong khung đó.
   - Mục đích: **dồn người vào cùng một lúc**.

⇒ "Online là chính" vẫn giữ: người thật luôn được ưu tiên. Bóng ma và bot là lưới đỡ, để không em nào bấm vào mà phải ngồi chờ không.

## 3. Trận đấu

- **Bộ từ do server chọn lúc mở trận**, lưu luôn trong dòng trận (dữ liệu thật lúc tạo, không phải ô chờ điền — §1.5).
- **Hướng hỏi:** Anh → Việt là chính, trộn một phần Việt → Anh (đo từ "chủ động"; Nation: receptive ≠ productive). Có nút nghe phát âm.
- **Thành phần bộ 15 từ** (số chính xác ở Phần B):
  - phần lớn là từ **trong phạm vi khối của em**;
  - **từ em đang yếu / đến hạn ôn** được ưu tiên;
  - **vài từ mới** (lớp "học thêm", §5);
  - khi 2 em lệch khối thì lấy phạm vi của **em khối thấp hơn**, cộng từ mới chung.
- **Server có quyền phán quyết:**
  - Mỗi lần bấm gọi RPC `fn_dtv_tra_loi`. Server ghi `now()`, tự chấm đúng/sai, tự tính điểm, tự quyết ai ăn từ, rồi phát cho cả 2 bên.
  - Không tin đồng hồ của máy HS.
  - Lệch mạng vài chục ms là chấp nhận được. Server ở Singapore thì 2 em ở Hà Nội lệch nhau rất ít.
- **Bot cũng chạy ở server.**
  - Lúc mở mỗi vòng, server bốc trước "giây bot sẽ bấm" và "bot đúng hay sai" theo mức bot, lưu lại.
  - Em bấm thì server so với thời điểm đó.
  - ⇒ Không ai sửa được bot ở máy mình để ăn điểm.
- **Bóng ma:** thời điểm bấm của bóng ma = thời điểm thật trong bản ghi.
- **Thoát giữa trận** = thua (người thật). Mất mạng thì có thời gian ân hạn ngắn.

## 4. Season và điểm xếp hạng

R7 — cách LoL/Liên Quân làm: **2 con số tách nhau.**
- **MMR (ẩn):**
  - dùng để ghép trận và tính điểm cộng/trừ;
  - kiểu Elo/Glicko;
  - **riêng cho đấu từ**, không đụng `gami_elo` của buổi học.
- **Điểm season (hiện ra):**
  - thắng +, thua − ít hơn;
  - có sàn theo bậc, để thua không tụt khỏi bậc đã đạt;
  - xếp **bậc** (Đồng → … ; tên ở Phần B).

Luật:
- **Không có ví xu theo trận.** Quà chỉ trao lúc **chốt season**: theo bậc đạt được, và top theo khối.
- **Điểm là sổ append-only.** Mỗi trận để lại 1 dòng biến động. Tổng và bậc tính bằng `fn_*` (CLAUDE §2.0, §4).
- **Chống cày:**
  - chỉ N trận đầu mỗi ngày tính điểm đầy đủ;
  - cùng một cặp đối thủ đấu lặp lại thì điểm giảm dần;
  - thắng bot hoặc bóng ma cho ít điểm hơn thắng người thật.
- **Hết season:**
  - chốt bảng;
  - trao quà (GV/OPS phát, hoặc ghi vào ví xu tổng bằng 1 dòng `qlht_xu_ledger` loại riêng — Phần B);
  - **reset mềm**: MMR kéo về gần giữa, điểm season về mốc đầu.
- **Bảng xếp hạng** chia theo khối (hoặc nhóm khối), vì lớp 3 không đua được với lớp 9. Chỉ hiện top + vị trí của em, **không hiện người đứng cuối** (cùng tinh thần `spec-v1-app-hs.md` §10).
- **Liên hệ với Rank chung, lượt học thật, chuỗi:** V1 **không tính** trận đấu từ vào các thứ này. Luật 6 giây/câu của lượt học thật mâu thuẫn trực tiếp với game tốc độ. Nối sau nếu Thùy muốn (Phần B).

## 5. Học từ mới và nhớ từ

- **Mỗi lần trả lời ⇒ 1 dòng nhật ký (HS × từ)**: đúng/sai, số giây, trận nào.
- **Mức nhớ một từ** (chưa gặp · cần ôn · đang nhớ · đã quen · thành thạo) và **hạn ôn tiếp** đều **tính lại** từ nhật ký bằng `fn_dtv_muc_nho`.
  - V1 dùng luật kiểu Leitner như bản gốc. Về sau có thể thay bằng Half-Life Regression (Settles & Meeder 2016), đã ghi trong `nghien-cuu-mon-anh.md`.
  - "Chưa gặp" ≠ "cần ôn" (CLAUDE §5).
- **Từ mới xuất hiện trong trận** (em chưa từng gặp). Sau trận, màn kết quả có khối **"Từ mới trận này"**: nghĩa, loại từ, phiên âm, nghe, câu ví dụ.
  Từ mới này **quay lại ở các trận sau** theo lịch ôn.
- **Màn "Ôn từ yếu"** (đấu bot nhẹ, không áp lực thời gian): ôn đúng các từ đang "cần ôn".
- **Phát âm:** V1 dùng giọng đọc của trình duyệt (`speechSynthesis`, iPad Safari có sẵn), 0 đồng. File ghi âm thật thì để sau.

## 6. Kho từ v1 (Claude làm, GV chỉnh sau)

**Hai lớp từ:**

| Lớp | Nguồn | Vai trò trong trận |
|---|---|---|
| **Từ trong sách** | Danh sách từ vựng **từng unit** của bộ sách HS đang học. Từ 2026–27 cả nước dùng 1 bộ: **Global Success 3–9**. Thêm sách tăng cường / tham khảo nếu Thùy xác nhận (câu hỏi §8) | Phần chính: ôn đúng bài trên lớp |
| **Từ mới theo độ tuổi** | Danh sách từ chính thức, miễn phí: **Cambridge YLE** (Starters ≈ lớp 3 · Movers ≈ lớp 4–5 · Flyers ≈ lớp 5–6), **A2 Key / B1 Preliminary for Schools** (≈ lớp 7–9), đối chiếu cấp độ bằng **CEFR-J Wordlist** và **Oxford 3000/5000** | "Học thêm": từ hợp cấp độ mà sách chưa có, ưu tiên từ dùng nhiều |

**Mỗi từ gồm:**
- từ / cụm, loại từ, phiên âm IPA;
- **nghĩa Việt ngắn theo đúng ngữ cảnh sách**;
- câu ví dụ;
- khối, nguồn (sách + unit, hoặc danh sách nào), cấp CEFR, chủ đề;
- nhóm nghĩa (dùng để chặn đáp án sai trùng nghĩa).

**Cổng ghi** (`spec-luong-kho.md`: không có biên bản kiểm thì không ghi):
- Nghĩa và loại từ do máy soạn phải được **một nhân chứng thứ hai độc lập** kiểm. Ví dụ: một lượt soạn khác không nhìn bản đầu, cộng đối chiếu từ điển.
- Hai bên khớp ⇒ vào kho, trạng thái **"máy duyệt"**.
- Lệch ⇒ **chờ GV**, không vào trận.
- GV Anh sửa trên màn Kho (chỉ thấy môn Anh — `useMonScope`). GV sửa thì trạng thái thành "GV duyệt".

**Không nhập:** file sách lậu (Word/PDF sách giáo khoa lan trên mạng). Chỉ lấy **danh sách từ** từ trang công khai và các list chính thức miễn phí. Từ ngữ không phải nội dung có bản quyền; nghĩa và ví dụ do BK tự soạn.

**Quy mô ước:**
- Global Success 3–9: khoảng 2.500–3.500 từ/cụm không trùng (khối 9 riêng tài liệu GV đã có 472 từ + 127 cụm).
- Lớp từ mới: khoảng 1.000–1.500 từ.

**Gắn bản đồ kiến thức:** từ thuộc unit nào thì trỏ KP từ vựng của unit đó, nếu bản đồ khối đó đã có (hiện mới có K9: TV-01…). V1 **không** đổ kết quả đấu từ vào mastery KP. Đo theo từng từ là tầng mịn hơn, nối lên KP để sau.

## 7. Dữ liệu và kỹ thuật

- **Môn:** game đấu từ là nội dung **môn Anh**. Mọi bảng học tập có nhãn môn (CLAUDE §1.6).
  Phần "động cơ trận đấu" (ghép trận, vòng, chấm nhanh-đúng, bot, bóng ma, season) viết **không dính môn**: nó nhận 1 "bộ câu 4 đáp án" từ registry môn.
  ⇒ Sau này "đấu tính nhẩm Toán" chỉ cần thêm 1 nguồn câu (symmetry test).
- **Bảng** (tên tạm):
  - `anh_tu_vung` (kho);
  - `dtv_tran` (trận, bộ từ chụp lúc mở);
  - `dtv_tra_loi` (nhật ký, append-only);
  - `dtv_hang_cho` (đang chờ ghép — dòng chỉ tồn tại khi em thật sự đang chờ);
  - `dtv_season` · `dtv_diem_season` (sổ biến động).
  - Không có bảng "task", không có dòng chờ điền.
- **Realtime:** Supabase Realtime, kênh `dtv:<tran>` (broadcast + presence), cùng mẫu `bk-hub` đã chạy ở games-site và `SuKienScreen`. Không cần Cloudflare/Firebase như bản gốc.
  **Mọi thay đổi trạng thái đi qua RPC.** Kênh realtime chỉ để báo "có thay đổi, đọc lại".
- **Màn:** dựng bằng `skin/KhungHS.tsx`, khổ ngang trước (iPad 1180×820). `npm run check:style-hs` phải ✔. Ô "Đấu từ" trên Home phải có icon cho mọi style.
- **Ai chơi:** mặc định mọi HS đang học khối 3–9 (từ vựng không phụ thuộc em có học Anh ở BK hay không). Câu hỏi §8.

## 8. Còn chờ Thùy (chặn việc)

1. **Ở trường các em dùng sách gì ngoài Global Success?** Sách tăng cường (i-Learn Smart Start, Family and Friends, Tiếng Anh 10 năm…) hay sách tham khảo nào? Cần biết để quét đúng bộ.
2. **V1.0 (06/10) cắt tới đâu.** CTO đề xuất:
   - **Kịp 06/10:**
     - kho từ trong sách Global Success 3–9;
     - đấu online (thách đấu bạn + hàng chờ);
     - bóng ma + bot;
     - điểm season + bảng xếp hạng;
     - màn ôn từ yếu.
   - **Sau 06/10:**
     - lớp từ mới theo Cambridge/CEFR (nếu kịp thì thêm);
     - trao quà chốt season (season đầu chưa hết thì chưa cần).
   - Đây là **luồng thứ 4** chạy song song 3 luồng ở `spec-v1-app-hs.md` §13 (làm trong worktree riêng).
3. **Ai được chơi:** mọi HS khối 3–9, hay chỉ em có lớp Anh ở BK?

---

# PHẦN B — CHI TIẾT BÀN SAU (CTO điền mặc định, Thùy sửa)

| # | Việc | Mặc định đề xuất |
|---|---|---|
| B1 | Độ dài season | 1 tháng, chốt cùng nhịp Rank (đầu tháng) |
| B2 | Tên game, tên các bậc season | — |
| B3 | Quà cuối season (theo bậc / top khối) | — |
| B4 | Điểm thắng/thua theo loại đối thủ | người thật > bóng ma > bot; thua người thật −ít, thua bot 0 |
| B5 | Trần trận tính điểm / ngày | 10 trận |
| B6 | Giờ vàng: khung giờ, thưởng thêm | 20h–21h30, ×1,5 điểm |
| B7 | Chờ bao lâu thì mời bóng ma / bot | 15 giây |
| B8 | Thành phần bộ 15 từ | 9 trong khối · 4 cần ôn · 2 mới |
| B9 | Tỉ lệ Việt → Anh | 1/3 |
| B10 | Nhóm khối cho bảng xếp hạng | 3 · 4–5 · 6–7 · 8–9 |
| B11 | Lớp 3: thêm chế độ hình → từ? | để V1.1 |
| B12 | Trận đấu từ có tính vào chuỗi / nhiệm vụ / Rank chung không | V1 không |
| B13 | Báo cho GV: em yếu từ nào (theo unit) | để sau, khi kho đã có GV duyệt |

---

## Phụ lục — BẢN DEMO 03/10 (Thùy 02/10 đêm: "làm demo ra thẳng game, deploy web + app test; khớp HS BK tính sau")

**Đã có (chơi được, đã thử 2 tab thật):** app riêng `dautu.html` → `dist-dautu/` (PWA cài lên iPad/điện thoại).
- Đấu từ vựng: 16 chủ đề × 60 từ (960 mục, 3 cấp lớp 3–5 / 6–7 / 8–9), luật y bản gốc (12s, ai đúng trước ăn, 100/70/50, chuỗi 3 +30), Anh→Việt + Việt→Anh.
- 5 chế độ: luyện với bot (3 mức) · đấu online ghép ngẫu nhiên · thách đấu (mã 6 số / link / mời bạn đang online) · **giải 8 người** (loại trực tiếp, thắng chờ người thắng cặp bên cạnh, thiếu người thì bot, xem trực tiếp trận khác, hoà ⇒ ai đúng nhiều hơn rồi ai nhanh hơn) · 2 người 1 máy.
- Nối từ: tự do · đấu bot · phòng online 2–6 người; kiểm từ bằng kho + Wiktionary.
- Góc luyện tập: ôn từ yếu (Leitner), thẻ ghi nhớ, tiến độ, góp từ (≤ 10/ngày, chờ duyệt). Hồ sơ/nhân vật, XP/cấp, chuỗi ngày, chuỗi thắng, BXH 3 tiêu chí, cài đặt (âm thanh, giọng đọc, đồ hoạ Đẹp 3D / Nhẹ 2D), góp ý.
- Hình: nhân vật + chuyển động KayKit (CC0) dựng 3D bằng three.js; nền + icon lấy từ skin RPG.

**Nợ có chủ đích — PHẢI trả khi khớp HS BK (đi ngược Phần A ở chỗ nào):**
1. Người chơi = THIẾT BỊ (uid ngẫu nhiên ở máy), không phải tài khoản HS.
2. Trọng tài = máy chủ phòng/chủ giải (tin client). Phần A §3 yêu cầu server chấm — làm khi có điểm season + quà.
3. Sổ nhớ từ nằm ở localStorage; XP/chuỗi/BXH đã ở DB (`fn_dtv_*`). Phần A §5 yêu cầu nhật ký trả lời ở DB.
4. Chưa có season / điểm season / MMR / bóng ma / giờ vàng (Phần A §2, §4). Kho từ chưa theo sách (Phần A §6).
