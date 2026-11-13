# Spec — MỤC TIÊU TUẦN của học sinh (bảng mục tiêu · nợ · đánh giá)

> Thùy chốt 12/11 (phiên Sparring). Trạng thái: **mới có quyết định thiết kế, CHƯA build gì.**
> File này = bản ghi quyết định + hiện trạng dữ liệu + việc cần làm. Chưa có migration, chưa có màn.

---

## 1. Vì sao làm

- Hiện tại mục tiêu tuần **đã tồn tại** (GV chọn dạy bài A, B ⇒ ngầm định HS phải thành thạo A, B) nhưng chỉ nằm
  trong đầu GV và trong giáo trình. HS học bị động ("cứ dạy, cứ làm bài, không biết mục tiêu là gì"); phụ huynh không biết gì.
- Việc mới = **công khai mục tiêu đó thành một cái neo chung** cho HS · phụ huynh · GV · TA · hệ thống.
  - HS: biết tuần này phải nắm gì, đang ở đâu, cần hỗ trợ gì ⇒ tự xếp thời gian.
  - Phụ huynh: biết con có bao nhiêu việc, từng việc thế nào, con có nghiêm túc không.
  - Trung tâm: đo được hoạt động của HS và hoạt động hỗ trợ của mình có hiệu quả không.
- Đứng trên vai: goal-setting (Locke & Latham) · self-regulated learning (Zimmerman) ·
  learning intentions + success criteria (Hattie) · nhịp check-in tuần kiểu OKR.

---

## 2. Quyết định đã chốt (Thùy 12/11)

| # | Quyết định |
|---|---|
| Q1 | **Người đọc = học sinh VÀ phụ huynh**, cùng một bảng. GV/TA cũng xem bảng đó. |
| Q2 | **Hệ làm SỐ LIỆU và đưa sẵn toàn bộ danh sách; người CHỐT.** "GV không phải làm gì" = không phải làm số liệu/ngồi chọn tay, chứ vẫn duyệt ở buổi chốt thứ Hai (§3b). |
| Q3 | **Một ngày chốt duy nhất = thứ Hai**: vừa chốt kết quả tuần trước, vừa phát mục tiêu tuần này. |
| Q4 | **Cửa sổ mục tiêu tính theo HẠN BTVN, không theo ngày dạy** (xem §3). |
| Q5 | **Ngưỡng đạt = đúng mastery đang chạy**, không đặt định nghĩa "đạt" thứ hai. |
| Q6 | **Kênh = app học sinh là chính** (đẩy hằng tuần) + app GV. Phụ huynh: tạm thời chụp ảnh bảng gửi qua. |
| Q7 | **Hai tầng mục tiêu** (§5): TUẦN = có lần đo mới và số phải TĂNG; CHIẾN DỊCH (2–3 tuần) = tới mức đạt. Một tuần không đòi "đạt". |
| Q8 | **BTVN tính vào mastery** (không chỉ ET/MT như mặc định hiện nay) — đổi luật TOÀN HỆ, xem §5b. |
| Q9 | **BTVN xếp chồng 3 buổi** (§5b): BTVN buổi N gồm dạng của buổi N, N-1, N-2; tổng số bài mỗi dạng không đổi. |
| Q10 | **Dạng nợ đo lại TẠI TRUNG TÂM, sau giờ**, ngày kiểm tra báo trước trên bảng thứ Hai (§5c). Làm ở nhà = ôn, không tính điểm. |
| Q12 | **Đơn vị ĐÁNH GIÁ = nhóm bài; đơn vị DẠY = dạng bài.** Mastery, tăng/giảm, nợ, kiểm tra sau giờ tính theo nhóm (`mastery_luu_san.cap = 'nhom'`); giáo trình và BTVN xếp chồng nói theo dạng. |
| Q11 | Kiểm tra sau giờ rơi vào buổi nào của tuần: **chốt từng trường hợp theo lịch phòng**, không đặt luật cứng — và **chốt ngay trong ngày thứ Hai**, cùng lượt chốt lịch học + chốt bổ trợ (thứ Hai = ngày chốt mọi thứ). |

Bảng này về bản chất là **dashboard của học sinh**: dữ liệu hiện nằm theo trục hành động (lớp làm ET, lớp nộp BTVN…),
bảng xoay cùng dữ liệu đó sang trục học sinh. Một hàm, ba người xem (HS · phụ huynh · GV/TA) — không dựng bản sao thứ ba.

---

## 3. Luật timeline (phần quan trọng nhất)

**Hai chu kỳ độc lập, chạy trên cùng dữ liệu:**

| Chu kỳ | Của ai | Phạm vi mỗi thứ Hai |
|---|---|---|
| Lịch dạy tuần | GV bàn với nhau | các buổi của tuần NÀY (vd thứ Năm + Chủ nhật tới) |
| Mục tiêu học sinh | HS + phụ huynh | **lùi một buổi** (vd Chủ nhật vừa qua + thứ Năm tới) |

**Luật cắt cửa sổ (sửa 12/11 tối — Thùy):** *một lần đo thuộc tuần mà nó ĐƯỢC CHẤM XONG (thứ Hai → Chủ nhật), không theo lúc HS nộp.*
Lý do: lần đo chỉ tồn tại khi có kết quả chấm (CLAUDE §1.5 — chỉ có dòng khi có kết quả thật). BTVN nộp tối hôm trước buổi kế
(lớp thứ Hai – thứ Sáu: nộp thứ Năm và Chủ nhật); bài nộp Chủ nhật thì **thứ Hai mới chấm ⇒ vào tuần MỚI**.
Với lớp 2 buổi/tuần vẫn ra cặp **buổi cuối tuần trước + buổi đầu tuần này** — bảng dưới không đổi, chỉ đổi mốc tính từ "hạn nộp" sang "lúc chấm xong".
- **Tách hai thứ:** "con đã nộp / đúng hạn chưa" tính theo GIỜ NỘP (biết ngay) · "kết quả" tính theo GIỜ CHẤM.
- Bài đã nộp mà chưa chấm = **"chờ chấm"** — nợ của trung tâm, không ghi "không có lần đo mới" cho con.
- Mốc theo giờ chấm ⇒ **chấm trễ là đẩy lần đo sang tuần khác**. Hạn chấm THỰC TẾ đang chạy (Thùy 12/11): lớp học từ 18:00 ⇒ TA chấm BTVN xong
  **2 tiếng trước buổi học kế** (tức trong ngày của buổi kế). Dùng luôn hạn này; quá hạn ⇒ "chờ chấm" hiện thành việc tồn của TA. Lớp học thứ Bảy / Chủ nhật (học cả ngày) ⇒ chấm xong **trước buổi kế MỘT NGÀY**.
  *Chưa rõ: lớp học CẢ thứ Bảy lẫn Chủ nhật liền nhau thì BTVN buổi thứ Bảy chấm lúc nào (không thể "trước một ngày").*

| Lớp | Buổi thuộc mục tiêu tuần này | Hạn BTVN |
|---|---|---|
| Thứ Năm – Chủ nhật | Chủ nhật trước · thứ Năm này | trước thứ Năm · trước Chủ nhật |
| Thứ Ba – thứ Sáu | thứ Sáu trước · thứ Ba này | trước thứ Ba · trước thứ Sáu |
| Thứ Hai – thứ Năm | thứ Năm trước · thứ Hai này | trước thứ Hai · trước thứ Năm |

Hệ quả: mọi dạng của tuần đều **đủ vòng đo (ET trên lớp + BTVN) trước thứ Hai kế tiếp** ⇒ thứ Hai chốt nợ trọn vẹn,
không cần khối "chờ kết quả", không cần ngày chốt sổ thứ hai. Lớp 1 hay 3 buổi/tuần chạy cùng luật, không ngoại lệ.

**Quy ước đi kèm:**
1. Giờ chốt = **đầu ngày thứ Hai (giờ VN)**. Mọi kết quả chấm từ thứ Hai trở đi tính vào tuần mới.
2. **Bản đã chốt không sửa.** Bài chấm sau giờ chốt vẫn tính vào mastery và hiện ở kỳ sau.
3. Buổi huỷ / tuần nghỉ ⇒ hạn BTVN trôi; dạng đi theo hạn.
4. Buổi thứ hai của tuần (chưa thuộc cửa sổ) hiện **một dòng thông tin** "cuối tuần này con sẽ học thêm: …
   (tính vào mục tiêu tuần sau)". Không tính điểm. Có sẵn vì GV đã chốt lịch dạy cả tuần từ thứ Hai.

Các phương án đã cân và bỏ: (a) cắt theo tuần lịch ngày dạy — dạng dạy cuối tuần luôn "chưa đo" lúc đánh giá;
(b) đánh giá theo hạn đóng riêng từng dạng — đúng nhưng không có nhịp chung; (c) thứ Hai chốt kế hoạch + thứ Năm chốt sổ —
nợ trễ gần 2 tuần hoặc phải thêm khối "chờ kết quả".

---

## 3b. Thứ Hai: KHÔNG có màn chốt mới — hệ tự ghép từ hai lượt chốt sẵn có (Thùy 12/11, sửa lần 2)

**Mục tiêu tuần không có bước duyệt riêng và không ai chốt từng học sinh** ("chốt từng học sinh quá vất vả").
Bảng của mỗi em là ĐẦU RA tự động của hai việc thứ Hai mọi người vốn đang làm:

| Lượt chốt đang có | Làm ở đâu | Cho bảng mục tiêu tuần cái gì |
|---|---|---|
| 1. Chốt giáo trình, tài liệu của tuần | luồng soạn tài liệu hiện tại | khối "Đang học" (dạng → nhóm bài của từng buổi) |
| 2. Soi Dashboard học tập cả lớp, chốt bổ trợ | **Phòng làm việc trưởng khối hiện tại** | khối "Nợ cần trả" + ngày kiểm tra sau giờ |

- Chốt xong bổ trợ ⇒ **hệ tự ghép** phần bổ trợ của từng em vào bảng mục tiêu tuần của em đó. GV không chốt thêm lần nào.
- Nợ nào không được chọn trong lượt chốt bổ trợ tuần này ⇒ bảng ghi "đang xếp hàng".
- Hệ quả thiết kế: **không dựng màn chốt mới, không thêm đường duyệt.** Việc cần làm ở phía nhân sự chỉ là nối đầu ra của hai lượt chốt trên vào hàm ghép bảng.
- Bảng HS phát **sau** khi lớp đó đã chốt xong cả hai lượt (§5c).

*(Bản trước của mục này vẽ một màn chốt riêng theo từng học sinh — SAI ý, đã bỏ. Mockup màn 3 tương ứng cũng bỏ.)*

---

## 4a. Bố cục màn học sinh (Thùy 13/11 — sau mockup bản 1 lệch ý)

1. **Phần 1 · Kiến thức mới** — danh sách nhóm bài; mỗi dòng: tên nhóm · **% hiện tại** · thanh tiến độ có **lá cờ đích ở mốc mục tiêu (mặc định 80%), số 80% ghi dưới cờ** (Thùy 13/11: không ghi chữ "Mục tiêu 80%" riêng).
2. **Phần 2 · Ôn tập kiến thức** — cùng khuôn với Phần 1 (các nhóm bài nợ, do lượt chốt bổ trợ đưa vào).
3. **Dòng chỉ hiện gọn; BẤM VÀO mới mở hướng dẫn chi tiết:** xem lại lý thuyết · xem lại bài trên lớp · luyện tập
   (Phần 2 thêm ngày kiểm tra lại sau giờ). Không bày nút và chữ giải thích sẵn trên mọi dòng.
4. **Thanh tiến độ tổng mục tiêu của tuần** ở đầu màn.
5. **Xếp hạng tiến độ — đo TOÀN TRUNG TÂM** (Thùy 13/11), màn chỉ hiện **hạng của bản thân**; bấm vào mới mở **bảng top 20** (em ngoài top 20 thấy dòng của mình ở cuối bảng).
   - **Mỗi môn một bảng** (một tờ mục tiêu = một môn = một bảng xếp hạng).
   - **Chung mọi khối** trong cùng bảng.
   - **Xếp theo TIẾN ĐỘ TỔNG của tuần** (Thùy 13/11). Lý do so được giữa em giỏi và em yếu: mục tiêu của mỗi em đã theo chương trình
     và yêu cầu riêng (em yếu yêu cầu dễ hơn), nên tiến độ là % đi tới mục tiêu CỦA MÌNH. Bảng này đo **thái độ** là chính, không đo năng lực.

6. **Mỗi dòng nhóm bài hiện TĂNG/GIẢM so với ĐẦU TUẦN** (Thùy 13/11): số đầu tuần lấy từ bản chụp 00:00 thứ Hai, hiện vạch đứt trên thanh + chip ▲/▼.
   Nhóm mới có lần đo đầu tiên trong tuần ghi "mới đo". Thanh tiến độ tổng cũng có vạch đầu tuần.
7. **"VIỆC CỦA CON TUẦN NÀY" = KHU VỰC RIÊNG, liệt kê theo HOẠT ĐỘNG, không theo nhóm bài** (Thùy 13/11, sửa bản gắn việc vào từng nhóm):
   ```
   ET buổi 15/11            75%   Tốt
   BTVN buổi 15/11          80%   Tốt
   Test sau giờ 12/11      100%
   Bổ trợ yếu T7 21/11     (sắp tới)
   ```
   - Mỗi dòng = một hoạt động có thật trong tuần: ET từng buổi · BTVN từng buổi · test sau giờ · ca bổ trợ (yếu / nhẹ / bù…).
     Kết quả (% đúng) + **thái độ** khi hoạt động đó có chấm thái độ (`btvn_ket_qua.thai_do`: nghiêm túc / chưa hết sức / chưa nghiêm túc / chống đối).
   - **Nhãn đánh giá = "Tốt" / "Chưa tốt"** (Thùy 13/11), **không còn khái niệm "thái độ" trên màn** và không gộp "thái độ tuần".
     *Chưa rõ — đã hỏi Thùy:* "Tốt / Chưa tốt" quyết từ đâu (đánh giá của TA như ô `thai_do` BTVN hiện nay, hay so kết quả với một ngưỡng)
     và hoạt động nào có nhãn này.
   - **Tự luyện trên app = KHÔNG bắt buộc, nhưng luôn có dòng thống kê** (Thùy 13/11), kể cả tuần không luyện (ghi "chưa luyện câu nào"):
     số câu · số lượt · % đúng · nhóm bài đã luyện. Nằm khối riêng "Tự luyện · không bắt buộc", **không tính vào x/y việc**. Nguồn: `tu_luyen_*`.
   - Hai khối: **Đã làm** · **Sắp tới** (có ngày, hạn; BTVN chưa nộp quá hạn ghi rõ "chưa nộp"). Đầu màn có ô tổng "x/y việc đã xong".
   - Danh sách do HỆ suy từ lịch buổi + giáo trình + lượt chốt bổ trợ (pure-derive, CLAUDE §4), không ai giao tay, không nút tự đánh dấu.
   - Dòng nhóm bài ở Phần 1/2 trở lại gọn (tên · ▲/▼ · % · cờ 80%); bấm vào mới có lý thuyết / bài trên lớp / luyện tập.
   - **Ba tầng xem cùng dữ liệu:** học sinh · phụ huynh · **trung tâm** (tổng theo lớp/khối: tỉ lệ việc đã xong, thái độ, em chưa làm gì). *Màn trung tâm: chưa vẽ.*

**Kênh phụ huynh (Thùy 13/11, thay "chụp ảnh gửi"):** màn này hiện **REALTIME trên app phụ huynh** (Cổng Phụ huynh — project riêng `bkdemy-ph`,
đọc ERP qua FDW `erp_live`), cùng nội dung màn HS, chữ formal. ⇒ Hàm đọc phải đọc **bảng tính sẵn** (§2.0), không tính lại qua FDW mỗi lượt mở.

**Dashboard các tuần đã chốt** (Thùy 13/11): sau mỗi lần chốt thứ Hai, HS và phụ huynh xem trend theo tuần: tiến độ tuần · việc đã làm · hạng ·
lưới nhóm bài × tuần. Đọc từ sổ chốt tuần (immutable), không tính lại. Mockup: màn 2 "Các tuần đã chốt".
Màn "ảnh kết quả gửi phụ huynh" riêng và "nút ảnh gửi bố mẹ": BỎ (thay bằng app phụ huynh realtime + dashboard tuần).

**Tiến độ tổng (Thùy 13/11):** trung bình của min(% hiện tại / mục tiêu, 1) trên các nhóm bài **ĐÃ CÓ lần đo**; nhóm chưa đo **không tính** (em không tụt hạng vì trung tâm chưa dạy tới).
*Chưa chốt:*

mục tiêu của nhóm ôn tập có luôn 80% không (§5: một tuần thường không lật được từ yếu lên đạt).
Mockup: canvas "Mục tiêu tuần — mockup", màn 1 bản 2.

---

## 4. Bảng mục tiêu tuần (theo HS × môn)

Mọi dòng mang nhãn `mon` (§1.6 CLAUDE.md). Một HS học nhiều môn ⇒ mỗi môn một bảng.

**Khối A — Đang học:** các dạng đang trong vòng luyện = dạng của 3 buổi gần nhất tính theo cửa sổ §3 (khoảng 6 dạng),
mỗi dạng ghi đang ở lần BTVN thứ mấy trên 3 (hệ quả của BTVN xếp chồng, §5b).
**Khối B — Nợ:** dạng đã hết vòng luyện mà chưa đạt, kèm **ngày kiểm tra lại sau giờ** (§5c).
Nợ đọc từ SỔ CHỐT TUẦN, không đọc từ mastery hiện tại (mastery chỉ nhìn 30 ngày ⇒ nợ không ai đo lại sẽ tự thành "chưa đo").
**Dòng thông tin:** "sắp học" (quy ước 4).

**Dòng của bảng = NHÓM bài** (Q12); bên trong ghi các dạng của nhóm đó được dạy tuần này. Hệ quả:
- 4 dạng của 2 buổi thường gom về ít nhóm hơn ⇒ bảng ngắn hơn.
- Một nhóm có dạng dạy ở nhiều tuần ⇒ nhóm đó ở khối "Đang học" qua nhiều tuần; số của nhóm gồm cả lần đo các dạng dạy trước.
- Nợ = nhóm chưa đạt; đề kiểm tra sau giờ lấy câu trong nhóm, ưu tiên dạng con đã sai.
- Quy dạng → nhóm dùng đúng hàm đang chạy (`_do_o` / `_do_nhom_cua_o`), không viết bản thứ hai.

Mỗi dòng hiện:
- **Tên dạng bằng lời thường** (không phải mã) — "con làm được bài kiểu nào".
- **Mức hiện tại** theo mastery đang chạy, kèm **số câu đã đo** (mới 3–4 câu thì % nhảy mạnh; không hiện số trần cho phụ huynh).
  Dạng chưa có lần đo nào = **"chưa đo"**, KHÔNG gộp vào yếu/0 (§5 CLAUDE.md).
- **Việc con đã làm** (đã nộp BTVN chưa, đã xem lý thuyết, đã luyện bao nhiêu câu) — để phân biệt "con lười" với "con đã cố mà chưa hiểu".
- **Lối hỗ trợ bấm được ngay, gắn đúng dạng đó:** xem lý thuyết dạng · xem lại bài giảng/video · tự luyện dạng · đến trung tâm.
  Dạng chưa có nội dung hỗ trợ ⇒ lộ ra chỗ kho hỗ trợ còn thủng.

**Giới hạn nợ = sức chứa ca sau giờ:** mỗi tuần chỉ hiện số dạng kiểm tra kịp trong một ca (ca ~20 phút, mỗi dạng 3–4 câu ⇒ 2–3 dạng),
phần còn lại xếp hàng (tránh bức tường "tuần nào cũng trượt"). *Luật ưu tiên dạng nào trước: CHƯA chốt — xem §8.*

---

## 5. Đánh giá — hai tầng (chốt thứ Hai)

Lý do: mastery = trung bình ≤ 5 lần đo gần nhất trong 30 ngày ⇒ một tuần **không thể** lật ô từ yếu sang đạt
(2 lần cũ 40% + 50%, thêm 1 lần 100% mới lên 63%). Đòi "đạt trong tuần" là đòi điều bất khả thi về số học.

| Tầng | Câu hỏi | Kết luận |
|---|---|---|
| **Tuần** | Con có lần đo mới không, số có lên không? | tăng · giữ đạt · đi ngang · giảm · không có lần đo mới |
| **Chiến dịch** — hết vòng 3 buổi (dạng mới) · 2–3 tuần (dạng nợ) | Con đã tới mức đạt chưa? | đạt · chưa đạt (⇒ thành nợ / nợ kéo dài) |

- "Giữ đạt" là kết quả TỐT (em 90% không tăng được nữa).
- "Không có lần đo mới" ≠ "đi ngang": con không làm bài / vắng buổi kiểm tra, không phải con không tiến bộ.
- "Chưa đo" do trung tâm (không giao bài, chấm chưa xong) ghi riêng, không tính cho con.
- Mỗi lần chỉ 3–4 câu một dạng ⇒ điểm từng lần thô (0/33/67/100%) ⇒ chỉ gọi tăng/giảm khi chênh qua một ngưỡng tối thiểu
  (*con số ngưỡng: chưa chốt*), còn lại là đi ngang.
- Ví dụ đích của Thùy: em 50% → 70% · em 20% → 40–50% trong tuần; em 20% cần 2–3 tuần mới tới đạt.

Tách 3 lớp để trả lời "ai chưa hiệu quả":
1. **Trung tâm có làm phần mình không** — dạy đúng dạng đã lên lịch · giao BTVN · chấm kịp · có nội dung ôn · xếp ca sau giờ.
2. **Con có làm phần con không** — nộp BTVN · ôn ở nhà · có mặt buổi kiểm tra.
3. **Kết quả đo.**

Mình đủ + con đủ mà vẫn không tăng ⇒ phương pháp. Con không làm ⇒ động lực/gia đình. Mình không làm ⇒ vận hành.
Số mới cho quản lý: **tỉ lệ dạy đúng kế hoạch** (dạng thực dạy so với dạng đã chốt thứ Hai).

---

## 5b. BTVN xếp chồng 3 buổi + tính vào mastery (Thùy 12/11 — thay đổi SẮP TỚI, chưa làm)

- **Trước:** BTVN buổi dạy dạng X = toàn dạng X. **Sau:** BTVN buổi N gồm dạng của buổi N, N-1, N-2
  (BTVN buổi 10 có kiến thức buổi 9 và 8). Một dạng vẫn ~10 bài, nhưng rải qua 3 lần BTVN.
  Tỉ lệ chia: **5–3–2 hoặc 4–3–3, chưa cần chốt** — để thành tham số, mặc định 5–3–2 (nhiều nhất ngay sau buổi học).
- **Được gì:** mỗi dạng có ET + 3 lần BTVN = 4 lần đo trong ~1,5 tuần (đủ độ tin theo luật mastery "theo lần") ·
  kéo dài thời gian luyện một dạng · không tăng khối lượng bài · em vắng buổi 9 vẫn gặp dạng buổi 9 ở BTVN 10, 11.
  Đứng trên vai: luyện tập giãn cách + xen kẽ (spaced practice, interleaving — Rohrer & Taylor trên môn Toán).
- **Hệ tự ghép BTVN**, GV chỉ duyệt: hệ biết dạng của N-1, N-2 và câu đã dùng. Để GV ghép tay = trái mục tiêu "GV không phải làm gì".
- **Tính BTVN vào mastery là đổi luật TOÀN HỆ:** số dạng yếu, đề xuất bổ trợ, trend báo cáo tuần, KPI trưởng khối đều đọc mastery
  ⇒ chuỗi số gãy tại ngày đổi. Trước khi áp phải so cũ–mới (bao nhiêu em đổi mức, bao nhiêu dạng yếu mất/mới).
  Hiện có sẵn 2 bản: `btvn=false` (ET+MT, mặc định) và `btvn=true` (mọi nguồn, bổ trợ dùng).
- **Bài ở nhà không kiểm soát được** ⇒ hệ tự nêu cờ khi BTVN và ET/MT của cùng dạng lệch nhau nhiều (triangulation, CLAUDE §5), không tin mù số trung bình.

---

## 5c. Vòng nợ — ôn ở nhà, đo ở trung tâm sau giờ

| Ở đâu | Làm gì | Tính vào mastery |
|---|---|---|
| Ở nhà | Ôn dạng nợ: lý thuyết · bài mẫu · tập bài luyện thêm | KHÔNG — chỉ hiện "việc con đã làm" |
| Trung tâm, sau giờ | Kiểm tra lại dạng đó (luồng bổ trợ sau giờ đang thử từ tuần 09/11) | CÓ — lần đo chính thức |

1. **Thứ Hai:** bảng ghi "con nợ dạng X, đang 40%, [ngày] ở lại kiểm tra sau giờ" + tài liệu ôn gắn đúng dạng X.
2. **Trong tuần:** con ôn ở nhà, hỏi GV/TA.
3. **Buổi kiểm tra sau giờ:** thêm một lần đo.
4. **Thứ Hai sau:** đạt ⇒ hết nợ · tăng chưa đạt ⇒ tiếp tục · vắng/về sớm ⇒ "không có lần đo mới", nợ chuyển tuần sau.
5. **2–3 tuần không tăng:** hệ đề xuất trưởng khối chuyển lên bổ trợ yếu (ca riêng, có dạy lại) — dùng nút đổi mức L1 → L2/L3/L4 sẵn có.

- Nợ trên bảng và case bổ trợ là **MỘT danh sách** — không để con nhận hai chỉ dẫn khác nhau cho cùng một dạng.
- **Ngày kiểm tra: chốt từng trường hợp theo lịch phòng, trong ngày thứ Hai** (Q11) — cùng lượt chốt lịch học và chốt bổ trợ.
  ⇒ Thứ Hai có HAI mốc: **00:00 máy chụp số** (kết quả tuần trước, danh sách nợ) → **trong ngày người chốt** lịch dạy + bổ trợ + ca sau giờ
  → **bảng phát cho HS sau khi chốt xong**, đã có đủ ngày kiểm tra. Bảng KHÔNG phát lúc 00:00.
  Lớp học đúng thứ Hai: buổi hôm đó không thể là buổi kiểm tra được báo trước ⇒ ca sau giờ của lớp này rơi vào buổi sau.
- Câu kiểm tra **khác** câu đã ôn (cùng dạng, không trùng) ⇒ dạng thiếu câu trong kho thì không có đề (đã thấy ở vài dạng K5–K7, DEVLOG 12/11).
- Trên bảng gọi là lượt trả nợ / cơ hội, không phải án phạt; em đạt được ghi nhận rõ.
- Làm đánh giá ở nhà (nhẹ hơn cho trung tâm): **để sau, chưa nghĩ sâu.**

---

## 6. Hiện trạng dữ liệu (đọc từ `schema.md` + migration, 12/11 — chưa query DB thật)

| Cần | Đã có | Ghi chú |
|---|---|---|
| Buổi của lớp theo ngày | `buoi_hoc` (`lop_id`, `ngay`, `loai`, `trang_thai`) | buổi KHÔNG có cột dạng; `noi_dung_buoi` là chữ tự do |
| Dạng của một buổi | `tai_lieu` (`loai` `giao_trinh_buoi` / `btvn` / `et` / `mt_buoi`, khoá `lop_id` + `ngay`) → `tai_lieu_phan` → `tai_lieu_cau.ma_cau` → dạng | ⇒ suy được dạng TRƯỚC khi dạy **nếu tài liệu đã soạn trên hệ**. Chưa kiểm tỉ lệ buổi có tài liệu trước ngày dạy |
| Mức thành thạo | `mastery_luu_san` (`cap` dang/nhom/…, `score`, `n`, `muc`, `tin`) | mức: đạt ≥ 0,8 · cần luyện 0,5–0,8 · yếu < 0,5 (mig 202611101756). Đơn vị đo thực tế nhiều chỗ là **nhóm** (dạng quy về nhóm) — phải chọn `cap` cho bảng mục tiêu |
| BTVN nộp / kết quả | `btvn_nop` (`nop_at`) · `btvn_ket_qua` (`trang_thai_nop`: nop_dung_han / nop_muon / xin_phep / khong_lam) | hạn BTVN = buổi kế của lớp — chưa thấy cột hạn lưu sẵn |
| Dạng yếu chụp đầu tuần | `dang_yeu_dau_tuan` (tuần × môn × HS) | chụp thứ Hai 00:00, cùng mốc với bảng này |
| Lý thuyết theo dạng | `*_dang_ly_thuyet` từng môn | video / bài giảng xem lại gắn theo dạng: CHƯA kiểm |
| Lối vào của phụ huynh | `btvn_nop.nguon = 'ph_app'` cho thấy có luồng phụ huynh nộp bài | chưa kiểm phụ huynh có tài khoản/màn riêng hay dùng chung app HS |

---

## 7. Việc cần làm khi build (chưa làm — thứ tự đề xuất)

1. **Đo hiện trạng trước:** với 4 tuần gần nhất, bao nhiêu % buổi có tài liệu (giáo trình/BTVN) trên hệ **trước** thứ Hai của tuần đó?
   Đây là điều kiện sống còn của cả ý tưởng. Thấp ⇒ thay đổi thói quen soạn bài là việc số 1, trước mọi code.
2. Hàm DB `fn_muc_tieu_tuan_*` (mọi tính toán ở Postgres, §2.0): cắt cửa sổ theo hạn BTVN · gom dạng · đọc `mastery_luu_san` (không quét lại lịch sử đo).
3. **Bảng chốt tuần** (immutable, ghi lúc chốt thứ Hai, chỉ tạo dòng khi có kết luận thật — §1.5): mục tiêu đã phát + kết luận từng dạng.
   Cron đầu thứ Hai, cùng nhịp `dang_yeu_dau_tuan`. Nợ tuần sau đọc từ bảng này.
4. Nghĩa vụ soạn bài thành invariant: ∀ buổi đầu tuần tới ⇒ ∃ tài liệu đã soạn trước hạn; thiếu ⇒ việc tồn của GV, trưởng khối thấy (pure-derive, không bảng tasks).
5. Màn app HS (theo `design/STYLE-HS.md`, `spec-v1-app-hs.md`) + màn GV/TA xem theo lớp. Quan hệ với "nhiệm vụ" sẵn có của app HS: cần quyết gộp hay tách.
6. Bản xuất ảnh để gửi phụ huynh.

**Thử nghiệm đề xuất:** 1 khối · môn Toán · 4 tuần · có lớp đối chứng. Đo: tỉ lệ nợ được đóng · lượng tự luyện ở nhà · tỉ lệ nộp BTVN đúng hạn.

---

## 8. Còn treo — cần Thùy quyết

1. Em nợ nhiều nhóm hơn phần bổ trợ được chốt tuần này: phần còn lại hiện "đang xếp hàng" — thứ tự do lượt chốt bổ trợ ở phòng trưởng khối quyết, bảng không tự chọn.
1b. Khối nào tới giờ phát mà CHƯA chốt: phát bản hệ đề xuất, hay giữ lại chờ duyệt?
3. Ngưỡng chênh tối thiểu để gọi là "tăng"/"giảm" (§5).
4. Hết vòng 3 buổi mà ở mức `can_luyen` (0,5–0,8): thành nợ, hay chỉ `yeu` (< 0,5) mới thành nợ?
5. Tự luyện trên app có tính vào mastery không (hiện trạng chưa kiểm; quyết định "ôn ở nhà không tính" đang nghiêng về không).
6. HS có được tự cam kết / chọn thêm mục tiêu không, hay 100% hệ đặt.
7. Phụ huynh về lâu dài: màn riêng, hay giữ cách chụp ảnh.
8. Thử nghiệm trước hay làm toàn hệ; nếu thử thì khối nào.
9. Báo cáo tuần trưởng khối (`spec-bao-cao-tuan.md`) có thêm khối "mục tiêu tuần của lớp" không.

---

## 9. Rủi ro đã soát (12/11) — đọc trước khi build

| # | Rủi ro | Trạng thái |
|---|---|---|
| 1 | Mastery không nhúc nhích trong 1 tuần; mặc định không tính BTVN | **Đã gỡ bằng thiết kế:** hai tầng (§5) + BTVN xếp chồng tính vào mastery (§5b) |
| 2 | Đường "hết yếu" không kết thúc bằng lần đo được tính; trùng với luồng bổ trợ | **Đã gỡ bằng thiết kế:** vòng nợ sau giờ (§5c), một danh sách với bổ trợ |
| 3 | "GV không phải làm gì" hỏng ở: buổi ôn tập/luyện đề chạm 10–15 dạng (cần luật dạng trọng tâm) · tài liệu chưa lên hệ trước thứ Hai · chấm BTVN không kịp trước giờ chốt | **Giảm:** giáo trình và bổ trợ do người chốt ở hai lượt sẵn có (§3b), hệ chỉ ghép. Tài liệu: Thùy chốt BẮT BUỘC làm xong ở buổi họp. Chấm BTVN: mốc tính theo giờ chấm (§3) nên không còn "kịp trước 00:00", nhưng cần hạn chấm để lần đo không trôi tuần |
| 4 | Công khai số ⇒ đổi hành vi (Goodhart): chép BTVN, cày câu dễ; phụ huynh thấy toàn "chưa đạt"; bảng phơi lỗi của trung tâm | **Giảm một phần** (tầng tuần đòi TĂNG chứ không đòi đạt; cờ lệch BTVN–ET). Vẫn cần đo phân bố thật trước khi phát cho phụ huynh |
| 5 | Nợ tự biến mất sau 30 ngày không đo | **Đã gỡ:** nợ đọc từ sổ chốt tuần (§4) |
| 6 | Tải: em 3 môn ~20 dòng/tuần (cần màn gộp có ưu tiên) · sức chứa ca sau giờ · em vắng (mục tiêu giữ, đường đi = buổi bù) · em mới vào lớp (không gánh nợ trước ngày vào) | **MỞ** |
| 7 | Ngày kiểm tra chốt từng trường hợp ⇒ có tuần bảng thứ Hai chưa có ngày | **Đã gỡ:** ca sau giờ chốt trong ngày thứ Hai cùng lịch học + bổ trợ; bảng phát SAU lượt chốt đó (§5c). Còn lại: giờ phát cụ thể chưa định |
