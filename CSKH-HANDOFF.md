# CSKH & Referral — HANDOFF

> **Đọc file này đầu phiên.** Bản distill, viết lại sạch. Không giữ lớp stale.
> Cập nhật: 01/09/2026 · Nguồn suy nghĩ: `MARKETING-01/02/03.md`
> Trạng thái: **đã chốt tầng logic, chưa viết spec build.**

---

## ① TRẠNG THÁI HIỆN TẠI

### Đích
300 HS → **600**. Để tự nhiên đạt ~450 ⇒ **cần tạo thêm ~150**.
Cửa chính: **Toán, cấp 2**. Địa bàn: Geleximco (BK ở lô A10 khu A) · Gemek 1–2 · Golden · nhà dân quanh Lê Trọng Tấn.

### Sự thật nền
- 300 HS hiện tại đến **gần như 100% từ referral tự phát** — BK **chưa từng làm marketing**, chưa từng nhờ ai giới thiệu.
- Đối thủ thật **không phải** MathExpress/MathX/CMath (họ ở mảng chuyên/bồi dưỡng, BK không đi mảng đó) — mà là **thầy cô và trung tâm địa phương** quanh khu.
- BK định vị **lớp nhỏ, học phí cao hơn một chút**. "Nhỏ" là **chủ ý**, không phải điểm yếu. ⇒ khan hiếm là **sự thật**, không phải chiêu.
- Học phí hiện **rẻ hơn MathExpress dù lớp nhỏ hơn**, chưa ai chê đắt mà bỏ ⇒ dấu hiệu **định giá dưới biên**. *(treo, chưa bàn)*

### Sản phẩm phải xây
**Một module trong ERP (app OPS), không phải tài liệu.** Ba màn hình:
1. **Danh sách PH** — mỗi dòng: PH · con/lớp · level · cờ · điểm A/B · độ phủ · chạm gần nhất · **việc cần làm**
2. **Hồ sơ 1 PH** — tín hiệu thô theo dòng thời gian · lịch sử chạm · lịch sử nhãn · việc treo
3. **Hàng đợi hôm nay** — của người đang đăng nhập

Nền dưới: bảng tín hiệu (thô, append-only) · bảng lần chạm (chỉ ghi khi đã chạm thật) · các `fn_*` chấm điểm/đánh cờ ở Postgres · chỗ điền tay cho tiêu chí không tự lấy được.

### Việc tiếp theo
**`spec-cskh.md`** — bảng/cột, `fn_*`, invariant, 3 màn hình, luật ghi sổ ca. Rồi mới migration + code.

---

## ② QUYẾT ĐỊNH ĐÃ CHỐT (còn hiệu lực)

### Nguyên tắc gốc
1. **Không ép phụ huynh.** Hệ thống là bộ lọc **tìm người sẵn sàng**, không phải bộ máy thúc người chưa sẵn sàng.
2. **Không cố chuyển hoá người chưa hài lòng** — quá khó, việc của chuyên gia. Logic BK: *làm PH hài lòng → họ sẵn sàng giới thiệu, chỉ là chưa có dịp hoặc chưa nghĩ đến*. **Chưa hài lòng thì không động.**
3. **CSKH không phải sản phẩm chính** — không đi hướng chuyên gia, không xây engine phức tạp.
4. ⭐ **Đo cá nhân bằng CHẤT LƯỢNG CHẠM, không bằng số lời giới thiệu.** Treo chỉ số referral lên đầu nhân viên là đẻ ra hành vi ép, dù CEO không muốn. Referral chỉ đo ở **cấp hệ thống**.
5. **Nếu tỉ lệ giới thiệu không lên nhưng độ hài lòng lên ⇒ hệ thống vẫn đang chạy đúng.**

### Kiến trúc quyết định
6. **Claude xây LUẬT CỨNG → suy luận bám luật → định kỳ phân tích dữ liệu để cập nhật luật.** Không thả tự do cho AI mỗi vòng.
7. ⭐ **CEO duyệt LUẬT, không duyệt từng đề xuất.** Duyệt 300 đề xuất/vòng thì chết ở vòng 3; duyệt bộ luật 20 dòng/quý thì làm được, và một lần duyệt phủ cả 300 ca.
8. **Vòng học = DEVLOG ↔ HANDOFF áp sang PH:** sổ ca thô append-only ↔ bộ luật distill có version. Cập nhật luật **theo quý hoặc sau ~100 ca đóng** — không hàng tuần.
9. Điều kiện để vòng học **thật sự học**: ghi **dự đoán trước, kết quả sau** · giữ ca đoán SAI · **tách LUẬT SAI khỏi THỰC THI SAI** · luật có version · chỉ sửa luật khi có ≥5–10 ca cùng kiểu.
10. **Bộ luật mang theo vết sẹo của nó** — mỗi luật ghi kèm *vì sao tồn tại, ca nào đẻ ra nó* (như CLAUDE.md §2).

### Luật dữ liệu
11. ⭐ **LƯU TÍN HIỆU THÔ, KHÔNG LƯU ĐIỂM.** Công thức chấm sẽ đổi 3–4 lần trong 6 tháng đầu; lưu điểm là mất sạch lịch sử. Cùng nguyên tắc §1 (mastery không lưu, suy động).
12. **Lưu cả CẤU TRÚC lẫn NGUYÊN VĂN.** Nhãn suy được từ nguyên văn; nguyên văn không suy được từ nhãn. **Không bao giờ chỉ lưu nhãn.**
13. **Việc = suy ra, không lưu** (§4 invariant). Không bảng `tasks`, không row chờ. Chạm xong việc tự biến mất.
14. **Chưa điền ≠ điểm 0.** Dùng **tỷ lệ trên các mục đã điền** + **độ phủ**. Độ phủ < 50% ⇒ **không hành động theo điểm** (§5: thiếu data = độ tin thấp, khác điểm thấp).
15. Tín hiệu điền tay phải có **ngày điền**; quá 12 tháng ⇒ hạ trọng số hoặc coi như chưa đo.
16. **Tách cột SỰ KIỆN (máy sinh, bất biến) khỏi cột DIỄN GIẢI (người ghi).** Và tách rõ **nguồn**: máy / người / AI đề xuất — nếu không, AI đọc lại lời mình và tự khẳng định (buồng vọng).

### Mô hình 7 cửa — referral phải qua hết
```
MUỐN × NHỚ × CÓ NGƯỜI × CÓ DỊP × DÁM × NÓI ĐƯỢC × BK ĐÓN ĐƯỢC
```
**Nhân, không cộng.** Một cửa bằng 0 thì tất cả bằng 0.

| Cửa | BK làm gì | Tình trạng |
|---|---|---|
| MUỐN | vận hành → tương tác → chăm sóc | 🟢 mạnh |
| NHỚ | chạm đều + tin vui về con | 🔴 trống |
| CÓ NGƯỜI | chọn đúng người mà nhờ (trục B) | 🟡 |
| CÓ DỊP | hỏi đúng lúc PH vừa vui | 🔴 trống |
| DÁM | cho **thứ để ĐƯA** thay vì lời để bảo lãnh | 🔴 trống |
| NÓI ĐƯỢC | cấp cho họ một câu — bằng chính tin BK nhắn | 🔴 trống |
| BK ĐÓN ĐƯỢC | tiếp inbound + ghi "biết qua ai" + báo lại người giới thiệu | 🔴 trống |

⭐ **BK đang dồn sức vào cửa ĐẮT NHẤT (MUỐN) và bỏ trống những cửa RẺ NHẤT.**
⭐ **Nâng cấp điểm chạm mở đồng thời 3 cửa** (NHỚ + DÁM + NÓI ĐƯỢC) — một việc, ba cửa.

### Phân loại phụ huynh
17. **Hai trục riêng, KHÔNG cộng thành một điểm.** (A cao/B thấp) và (A thấp/B cao) ra cùng điểm nhưng hành động ngược nhau.
18. **Xét theo thứ tự, gặp là dừng:** cờ đỏ → đã giới thiệu → còn lại. **Cờ đỏ ghi đè tất cả**, kể cả người đã từng giới thiệu.
19. **"Kết quả tốt" = XU HƯỚNG LÊN (delta), không phải mức cao.** Con giỏi sẵn đứng yên là **tín hiệu YẾU** — PH không quy công cho BK. Người nên nhờ là nhà có **con tiến bộ rõ**, không phải nhà có con điểm cao.
20. **Chuẩn hoá theo lớp** — so với trung vị lớp của con. Không thì đọc nhầm chất lượng GV thành thái độ PH.
21. **Cờ xanh B1 (vị thế PH trong cộng đồng) tách riêng, không cộng điểm.** Cộng vào thì bị pha loãng; thực tế nó đủ mạnh để tự đảo thứ tự gọi.
22. **Thâm niên là chữ U ngược**, không tuyến tính: năm 1 chưa đủ tin · **năm 2–3 vùng vàng** · năm 4+ quen quá hoá vô hình. PH lâu năm cần **khơi lại lý do**, không phải thuyết phục.
23. **Tín hiệu mạnh = hành động TỐN KÉM.** Đã giới thiệu > con thứ hai > thêm môn > ở lại qua tăng phí > ở xa vẫn đến > … > đăng nhập app (yếu nhất).

### Thang điểm
- **A1–A5** (hành động đã trả giá — đã giới thiệu · nghỉ rồi quay lại · con thứ hai · qua chuyển cấp · qua tăng học phí): thang **0 hoặc 4**
- **A6–A11** (trạng thái): thang **0/1/2**
- **B2–B7**: thang **0/1/2**. **B1 = cờ.**
- Ngưỡng khởi đầu: A ≥ 60% cao · 35–60% giữa · < 35% thấp. B ≥ 50% cao.
  **Đây là phỏng đoán** — điền xong 300 PH thì nhìn phân bố thật rồi kéo lại. Mục tiêu: ô "gọi trước tiên" có **30–50 người**.

### Playbook
P0 Cứu (48h) · P1 Kích hoạt · P2 Giữ ấm · **P3 Nuôi** · P4 Duy trì · P5 Chẩn đoán · P6 Đi điền.
⚠️ **P3 đã ĐỔI VAI:** mục tiêu là **làm PH hài lòng hơn**, KHÔNG phải chuyển hoá thành người giới thiệu (theo nguyên tắc 2).
Nhóm C (chưa biết) = **ô CHƯA ĐO**, việc của nó là **đo để rời khỏi C**, không phải chăm cho đủ.
D xử lý tốt **nhảy thẳng lên B** (*service recovery paradox*).

### Điểm chạm — 7 cái hiện có
Trước ca học · HS đến lớp · học bù · báo cáo sao/giờ mỗi buổi · học phí · bổ trợ yếu · lịch nghỉ lễ.

⭐ **PHÁT HIỆN: không cái nào mang TIN TỐT về đứa trẻ.** Toàn hành chính/thủ tục/số/tin xấu.
⇒ Đó là lý do "hài lòng mà không có chuyện để kể" — **không phải BK không tạo tiến bộ, mà không có kênh chở tiến bộ ra ngoài.**
⇒ **Cần THÊM điểm chạm #8: tin vui về con.** Nguyên liệu có sẵn (level up · Elo · ca bổ trợ đóng · delta band · thành tích ghim).

**Ba luật phiên dịch:**
24. **Tin xấu KHÔNG BAO GIỜ để máy nói.** Tin tốt máy gửi được; tin xấu phải qua người. Ranh giới cứng.
25. **Hành động trước, chẩn đoán sau.** *"Con yếu → xếp bổ trợ"* = phán xét. *"Em xếp cho con buổi kèm thứ 5, con đang vướng dạng X"* = BK đang làm gì đó cho con.
26. **Cụ thể mới là quan tâm.** *"Chị nhắc con làm bài"* = nhắc việc. *"Con còn thiếu bài dạng hệ phương trình tuần trước"* = quan tâm.

**Hai loại chạm, không trộn:**
- **Chạm NHỊP** (giục, nhắc): giá trị nằm ở **tần suất**. Máy làm được. **Ở VN nhiều là TÍNH NĂNG, không phải phiền.**
- **Chạm NỘI DUNG** (báo tin, tâm sự): phải người, phải có sự thật cụ thể.

27. **Trần tần suất** không để giảm tổng số chạm — mà để **tránh chạm trùng lặp từ nhiều người**. Một PH = **một người phụ trách duy nhất**.

### Giọng
28. **Giọng theo LOẠI TIN, không theo thương hiệu.** Formal không sai — **formal ĐỀU** mới sai.
   Hành chính/học phí/khẩn ⇒ formal. **Tin xấu và tin vui về con ⇒ ấm.** Chỉ **2 trong 8** cần ấm.
29. ⭐ **ẤM = CỤ THỂ**, không phải nhiều chữ hay emoji. *"Con học tốt lắm ❤️"* = lạnh (rỗng). *"Hôm nay con tự làm được dạng phương trình chứa tham số mà tuần trước còn bỏ trống"* = ấm.
   ⇒ **BK không cần tình cảm hơn. BK cần cụ thể hơn.** Và cụ thể là thứ chỉ BK làm được (đo theo dạng).
30. **Template phải ra khỏi code**, vào chỗ có version — để sửa câu chữ không cần deploy, và để vòng học áp được lên câu chữ.

### Luồng referral thực tế
31. **PH không cho số.** PH giới thiệu → **người mới TỰ GỌI đến BK**. Xử như tuyển sinh inbound.
   ⇒ Mắt xích sống còn: **hỏi & GHI "biết BK qua ai"** khi tiếp nhận. Không có nó thì không quy kết được, không cảm ơn được, không báo lại được.
   ⇒ Người tiếp máy **phải biết đây là ca referral** để nhắc tên người giới thiệu — lead này intent cao nhất có thể.
32. **Bảo vệ người giới thiệu khi ca hỏng**: ca được giới thiệu bỏ giữa chừng ⇒ **chủ động báo lại + cảm ơn dù không thành**. Không thì mất cả hai, vĩnh viễn.
33. **Ngưỡng DỪNG**: PH từ chối 2 lần ⇒ thôi, không hỏi nữa.
34. **Cờ "chỉ Thùy gọi"** cho ca nhạy cảm.

### Nguồn dữ liệu
| Nguồn | Trạng thái |
|---|---|
| **Ghi âm cuộc gọi** | ✅ Làm — cần **thông báo đầu cuộc** (NĐ 13/2023: âm thanh là dữ liệu cá nhân) |
| **App phụ huynh** | ✅ Có sẵn (project riêng `bkdemy-ph`; ERP có màn `PhDangNhapScreen` đo `has_account` / `last_sign_in_at` / `must_change_password`) |
| **Zalo — mỗi HS 1 nhóm riêng** | ⏳ **Đang treo** — xem dưới |

**Zalo — đã loại trừ:**
- **Export chính thức của Zalo PC**: có (Cài đặt → Lưu trữ → Xuất dữ liệu → .zip) nhưng **mã hoá, chỉ để restore** ⇒ vô dụng.
- **Bot chính thức**: chỉ nhận khi PH **reply tin của bot** hoặc **@mention**. ⚠️ **Bỏ sót CÓ HỆ THỐNG đúng loại tin quý nhất** (PH tự mở lời: hỏi, khen, phàn nàn) ⇒ **không đạt yêu cầu 100%**.
- **Bot im lặng thu được ~0** — không gửi gì thì không có gì để reply.

**⏳ ĐANG CHỜ: khảo sát phần mềm quản lý Zalo cá nhân** (Zework, Chốt Care…). Ba câu quyết định, thiếu một là loại:
1. ⭐ **Có API/webhook đẩy dữ liệu RA ngoài không?** (nhiều cái chỉ cho xem trong giao diện của họ ⇒ vô dụng với BK)
2. Có đồng bộ tin nhắn **NHÓM** không, hay chỉ 1-1?
3. Dữ liệu lưu ở đâu, hợp đồng xử lý dữ liệu thế nào? (NĐ 13 — chuyển dữ liệu cá nhân cho bên thứ ba)
+ hỏi thêm: tỉ lệ tài khoản bị khoá và cơ chế phòng.

Không cái nào có API ⇒ quay về tự viết `zca-js`, với **cách tách rủi ro: tài khoản trực ≠ chủ nhóm** (khoá thì nhóm vẫn sống, chỉ mời lại tài khoản trực mới).

**Cần thêm bảng ánh xạ: nhóm Zalo ↔ học sinh.** Chưa có. Không có thì dữ liệu thu về không gắn được vào hồ sơ PH.

### Năm rủi ro của hướng dùng AI — bắt buộc xử trong spec
35. ⭐ **Rác vào, AI làm rác trông như vàng.** Rule engine thiếu data thì báo "không xếp được"; AI thì dựng một đề xuất trôi chảy từ không khí. ⇒ **Mỗi đề xuất PHẢI kèm "dựa trên tín hiệu nào" + "độ phủ bao nhiêu".**
36. Nhân sự sẽ ghi cho xong ⇒ chặn bằng **thiết kế form** (hỏi câu cụ thể, không để ô trống "ghi chú"), và **hiện lại** phần họ ghi ở lần chạm sau.
37. Dữ liệu điền tay sẽ cũ ⇒ luật 15.
38. Không tách sự kiện/diễn giải ⇒ luật 16.
39. Buồng vọng ⇒ luật 16 (tách nguồn).

---

## ③ CÒN TREO — cần CEO quyết

| # | Câu hỏi | Chặn cái gì |
|---|---|---|
| 1 | **Thưởng referral ở giai đoạn nào** — nhập học / còn học sau 3 tháng / chia hai đợt? | Thưởng lúc nhập học khuyến khích giới thiệu bừa |
| 2 | **Gộp điểm khi PH có nhiều con** — trung bình hay lấy đứa tệ nhất? Cờ đỏ 1 con có kéo cả PH sang P0 không? *(đề xuất: CÓ)* | Công thức chấm |
| 3 | **Ai sở hữu playbook nào** | P0 cần người cứng nhất |
| 4 | **Hạn mức trao quyền cho người gọi** — tự quyết đến đâu không phải hỏi? | Trụ 4 của hệ response |
| 5 | **Ai chủ trì outer loop** hàng tháng (gom nguyên nhân, sửa gốc)? | Bỏ outer loop ⇒ chi phí CSKH tăng tuyến tính theo số HS |
| 6 | **Kết quả khảo sát 3 câu về phần mềm Zalo** | Kiến trúc nguồn dữ liệu |
| 7 | **Định giá** — treo từ `MARKETING-01`, chưa bàn | (tách riêng, không gộp vào CSKH) |

### Việc làm được NGAY, không chờ hệ thống
1. **Thêm điểm chạm tin vui về con** — mở 3 cửa cùng lúc, nguyên liệu đã có trong ERP
2. **Hỏi & ghi "biết BK qua ai"** khi tiếp nhận + báo lại người giới thiệu
3. **Sửa điểm chạm đang gây hại**: bổ trợ yếu (vi phạm cả 3 luật phiên dịch) · sao thấp ≥2 buổi liên tiếp ⇒ chặn máy gửi, đẩy thành việc cho người
4. **Thêm vế đối cho "HS đến lớp"**: báo khi con **CHƯA** đến — rẻ, và là thứ PH kể lại cho người khác
