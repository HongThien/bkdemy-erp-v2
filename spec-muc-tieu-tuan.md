# Spec — MỤC TIÊU TUẦN của học sinh

> **Trạng thái:** thiết kế đã chốt HẾT, không còn câu treo (Thùy, phiên Sparring 12–13/11/2026). **CHƯA build** — chưa có migration, chưa có màn.
> **Mockup đã duyệt:** canvas "Mục tiêu tuần — mockup" (https://claude.ai/artifact/Pcfd6y2dSTxwNCqBJKpQeG)
> — màn 1 Mục tiêu tuần này · màn 2 Các tuần đã chốt · màn 3 Tab trung tâm. Hai màn ghi "BỎ" trên canvas là phương án đã loại.
> Lịch sử từng bước quyết định: `DEVLOG.md` 12/11–13/11. File này là bản gộp sạch, thay mọi bản trước.

---

## 1. Mục đích

Mục tiêu tuần **vốn đã có**: GV chọn dạy dạng A, B thì ngầm định HS phải thành thạo A, B. Nhưng nó chỉ nằm trong đầu GV và trong
giáo trình — HS học bị động ("cứ dạy, cứ làm bài, không biết mục tiêu là gì"), phụ huynh không biết gì.

Việc mới = **công khai mục tiêu đó thành một cái neo chung** cho HS · phụ huynh · GV · TA · hệ thống, và gắn với nó hai câu hỏi
mà hiện chưa ai trả lời được trên một màn: **con cần làm gì · con đã làm gì**.

- **HS:** biết tuần này phải nắm gì, đang ở đâu, có những việc gì ⇒ tự xếp thời gian, biết cần hỗ trợ ở đâu.
- **Phụ huynh:** theo dõi sát tiến trình của con ⇒ hỗ trợ con ở nhà.
- **Trung tâm:** thấy được hoạt động của HS và hoạt động hỗ trợ của mình có hiệu quả không.

Bản chất màn này là **dashboard của học sinh**: dữ liệu hiện nằm theo trục HOẠT ĐỘNG (lớp làm ET, lớp nộp BTVN, ca sau giờ…),
màn này xoay cùng dữ liệu đó sang trục HỌC SINH.

Đứng trên vai: goal-setting (Locke & Latham) · self-regulated learning (Zimmerman) · learning intentions + success criteria (Hattie) ·
nhịp check-in tuần kiểu OKR · luyện tập giãn cách + xen kẽ (spaced practice, interleaving — Rohrer & Taylor, môn Toán).

---

## 2. Khái niệm

| Khái niệm | Định nghĩa |
|---|---|
| **Tờ mục tiêu** | một (học sinh × môn × tuần). Mỗi môn một tờ, mang nhãn `mon` (CLAUDE §1.6). Tuần = thứ Hai → Chủ nhật, giờ VN. |
| **Đơn vị ĐÁNH GIÁ** | **nhóm bài** (`mastery_luu_san.cap = 'nhom'`). Mọi %, tăng/giảm, nợ, test sau giờ tính theo nhóm. |
| **Đơn vị DẠY** | **dạng bài**. Giáo trình, BTVN xếp chồng nói theo dạng. Quy dạng → nhóm bằng đúng hàm đang chạy (`_do_o` / `_do_nhom_cua_o`), không viết bản thứ hai. |
| **Phần 1 · Kiến thức mới** | các nhóm bài có dạng được dạy trong cửa sổ mục tiêu tuần (§3). |
| **Phần 2 · Ôn tập kiến thức** | các nhóm bài nợ do lượt chốt bổ trợ tuần này đưa vào (§4). |
| **Việc của con** | danh sách HOẠT ĐỘNG có thật trong tuần (ET · BTVN · test sau giờ · ca bổ trợ), mỗi việc có kết quả + nhãn đánh giá (§6). |
| **Sổ chốt tuần** | bản chụp bất biến lúc chốt tuần; nguồn của trend, nợ tuần sau, số "đầu tuần". |

Ba người xem **cùng một dữ liệu, một bộ hàm**: học sinh (app HS) · phụ huynh (app phụ huynh) · trung tâm (tab trong Dashboard học tập /
Phòng làm việc trưởng khối). Không dựng bản sao.

---

## 3. Nhịp tuần & timeline

### 3.1 Hai chu kỳ độc lập trên cùng dữ liệu

| Chu kỳ | Của ai | Phạm vi mỗi thứ Hai |
|---|---|---|
| Lịch dạy tuần | GV chốt giáo trình | các buổi của tuần NÀY |
| Mục tiêu học sinh | HS + phụ huynh | **lùi một buổi** so với lịch dạy |

GV chỉ chốt lịch dạy + giáo trình như bình thường; hệ tự cắt cửa sổ mục tiêu lùi một buổi. GV không phải nghĩ về độ lệch này.

### 3.2 Luật cắt cửa sổ

**Một lần đo thuộc tuần mà nó ĐƯỢC CHẤM XONG**, không theo lúc HS nộp (lần đo chỉ tồn tại khi có kết quả chấm — CLAUDE §1.5).
BTVN buổi N nộp trước buổi N+1 ⇒ với lớp 2 buổi/tuần, mục tiêu tuần = **buổi cuối tuần trước + buổi đầu tuần này**:

| Lớp | Buổi thuộc mục tiêu tuần này | BTVN chấm xong |
|---|---|---|
| Thứ Năm – Chủ nhật | Chủ nhật trước · thứ Năm này | trước thứ Năm · trước Chủ nhật |
| Thứ Ba – thứ Sáu | thứ Sáu trước · thứ Ba này | trước thứ Ba · trước thứ Sáu |
| Thứ Hai – thứ Sáu | thứ Sáu trước · thứ Hai này | thứ Hai (bài nộp tối CN) · trước thứ Sáu |

Hệ quả: mọi nhóm của tuần đều đủ vòng đo (ET + BTVN) trước thứ Hai kế tiếp. Lớp 1 hay 3 buổi/tuần chạy cùng luật.

- **Tách hai thứ:** "đã nộp / đúng hạn chưa" theo GIỜ NỘP (biết ngay) · "kết quả" theo GIỜ CHẤM.
- Bài đã nộp mà chưa chấm = **"chờ chấm"** — việc tồn của trung tâm (TA), không tính cho con.
- **Hạn chấm BTVN = hạn đang chạy thực tế** (không đặt hạn mới): lớp học từ 18:00 ⇒ chấm xong **2 tiếng trước buổi học kế**;
  lớp học thứ Bảy / Chủ nhật (cả ngày) ⇒ chấm xong **trước buổi kế một ngày**.
- Buổi huỷ / tuần nghỉ ⇒ hạn trôi, lần đo đi theo hạn.
- Buổi thứ hai của tuần (chưa thuộc cửa sổ) hiện một dòng thông tin "cuối tuần này con sẽ học thêm: … (tính vào tuần sau)", không tính điểm.

### 3.3 Thứ Hai — hai mốc

1. **00:00 thứ Hai — máy chụp:** đóng sổ tuần trước (kết luận từng nhóm, việc đã làm, hạng) vào sổ chốt tuần; chụp số "đầu tuần" của tuần mới;
   chụp danh sách nợ làm đầu vào cho buổi chốt.
2. **Chiều thứ Hai — người chốt** ở buổi họp đang có (§4). Chốt xong ⇒ tờ mục tiêu tuần mới của từng em được ghép và hiện lên app.

- **Bản đã chốt không sửa.** Bài chấm sau giờ chốt vẫn tính vào mastery và hiện ở tuần sau.
- Lớp học đúng thứ Hai: buổi hôm đó không thể là buổi test sau giờ được báo trước ⇒ ca sau giờ của lớp này rơi vào buổi sau.

---

## 4. Nguồn của tờ mục tiêu — KHÔNG có màn chốt mới

**Không ai chốt từng học sinh** (Thùy: "chốt từng học sinh quá vất vả"). Tờ mục tiêu là ĐẦU RA tự động của hai việc thứ Hai vốn đang làm:

| Lượt chốt đang có | Ở đâu | Cho tờ mục tiêu |
|---|---|---|
| 1. Chốt giáo trình, tài liệu cả tuần | luồng soạn tài liệu hiện tại | **Phần 1** (dạng của từng buổi → nhóm bài) |
| 2. Soi Dashboard học tập cả lớp, chốt bổ trợ | **Phòng làm việc trưởng khối** hiện tại | **Phần 2** + ngày test sau giờ + ca bổ trợ |

- Chốt giáo trình cả tuần ở buổi họp thứ Hai là **quy định bắt buộc** (tài liệu phải nằm trên hệ; tài liệu soạn ngoài thì hệ không thấy dạng).
- Chốt bổ trợ xong ⇒ **hệ tự ghép** phần của từng em vào tờ của em. Không thêm màn, không thêm đường duyệt.
- Nợ không được chọn trong lượt chốt tuần này ⇒ ghi "đang xếp hàng". Thứ tự do lượt chốt bổ trợ quyết, tờ mục tiêu không tự chọn.
- Nợ trên tờ mục tiêu và case bổ trợ là **MỘT danh sách** — con không bao giờ nhận hai chỉ dẫn khác nhau cho cùng một nhóm.
- Ngày test sau giờ: chốt từng trường hợp theo lịch phòng, **trong lượt chốt thứ Hai**.

---

## 5. Đo & đánh giá

### 5.1 Mức thành thạo
- **% của nhóm = mastery đang chạy**, không đặt định nghĩa "đạt" thứ hai. Mastery: Đ/C/S mỗi lần = 1 / 0,5 / 0, trung bình ≤ 5 lần gần nhất trong 30 ngày.
- **BTVN TÍNH VÀO mastery** (Thùy chốt 12/11, xác nhận 13/11) — hiện mặc định chỉ ET + MT. Đây là **đổi luật TOÀN HỆ** (§8.2).
- **Mục tiêu mặc định 80%** (= mức đạt của mastery). Nhóm chưa có lần đo nào = **"chưa đo"**, không gộp vào 0 (CLAUDE §5).

### 5.2 Hai tầng mục tiêu
Một tuần **không thể** lật ô từ yếu lên đạt (2 lần cũ 40% + 50%, thêm 1 lần 100% mới lên 63%) ⇒ không đòi "đạt trong tuần".

| Tầng | Câu hỏi | Kết luận |
|---|---|---|
| **Tuần** | có lần đo mới không, số có lên không? | tăng · giữ đạt · đi ngang · giảm · không có lần đo mới |
| **Chiến dịch** — hết vòng 3 buổi (Phần 1) · 2–3 tuần (Phần 2) | đã tới mức đạt chưa? | đạt · chưa đạt (⇒ thành nợ / nợ kéo dài) |

- "Giữ đạt" là kết quả tốt (em 90% không tăng được nữa).
- "Không có lần đo mới" ≠ "đi ngang" (con không làm bài / vắng, không phải không tiến bộ). "Chờ chấm" do trung tâm, ghi riêng.
- Ví dụ đích: em 50% → 70%, em 20% → 40–50% trong tuần; em 20% cần 2–3 tuần mới tới đạt.

### 5.2b Mục tiêu tuần tính được (Thùy CHỐT 13/11)
- Mastery đo **theo lần** (mỗi lần = TB câu của lần đó, mastery = TB ≤ 5 lần gần nhất trong 30 ngày; Hình–Học 3 lần) ⇒ thứ Hai hệ biết
  trước **tuần này nhóm đó có bao nhiêu lần đo** (ET + các lần BTVN có nhóm + test sau giờ đã chốt) ⇒ tính được mục tiêu tuần:
  **mục tiêu tuần = min(80%, mastery của nhóm nếu mọi lần đo trong tuần đều Tốt (80%))**, có tính cả lần cũ sẽ rơi khỏi cửa sổ 5 lần / 30 ngày.
  Ví dụ: 4 lần cũ 0 · 50 · 0 · 50, tuần này 2 lần ⇒ cửa sổ còn 50 · 0 · 50 · 80 · 80 ⇒ mục tiêu tuần **52%** (đích dài hạn vẫn 80%).
- Chụp cùng sổ chốt thứ Hai, không đổi trong tuần. Nhóm tuần này không có lần đo nào ⇒ không có mục tiêu tuần, không tính vào tiến độ.
- Nhóm mới (chưa có lần cũ) ⇒ mục tiêu tuần = 80%. Thực tế Phần 1 hầu hết là 80%, Phần 2 thấp hơn.
- **Chốt:** cờ trên thanh = **mục tiêu tuần** (số ghi dưới cờ; tiến độ tổng + xếp hạng tính theo nó); **80% vẫn hiện là đích dài hạn**
  (vạch mờ "đích 80%", ẩn khi mục tiêu tuần đã là 80%). Mở dòng nhóm ghi rõ "tuần này có N lần đo, làm Tốt cả N lần thì nhóm lên X%".
  Lý do: xếp hạng đo thái độ nên mục tiêu phải với tới được trong tuần; để 80% thì em yếu làm tốt hết vẫn không bao giờ đầy thanh.

### 5.3 Tăng/giảm so với đầu tuần
Mỗi dòng nhóm bài + thanh tiến độ tổng hiện **chênh so với số chụp 00:00 thứ Hai** (vạch đứt trên thanh + chip ▲/▼).
Nhóm có lần đo đầu tiên trong tuần ghi "mới đo". **Mọi chênh khác 0 đều là tăng/giảm** — không đặt ngưỡng (Thùy 13/11: đo theo lần, không theo số câu).

### 5.4 Tiến độ tổng của tuần
**Trung bình của min(% hiện tại / mục tiêu TUẦN, 1) trên các nhóm bài ĐÃ CÓ lần đo và có mục tiêu tuần**; nhóm chưa đo không tính
(em không tụt vì trung tâm chưa dạy tới). Thanh tiến độ tổng có cờ đích ở cuối.

### 5.5 Xếp hạng tiến độ
- Đo **toàn trung tâm**, **mỗi môn một bảng**, **chung mọi khối**, xếp theo **tiến độ tổng của tuần** (§5.4).
- So được giữa em giỏi và em yếu vì mục tiêu đã theo chương trình/yêu cầu riêng (em yếu yêu cầu dễ hơn) ⇒ bảng đo **thái độ** là chính, không đo năng lực.
- Màn chỉ hiện **hạng của bản thân** (+ lên/xuống bao nhiêu bậc). Bấm vào ⇒ **top 20**; em ngoài top 20 thấy dòng của mình ở cuối bảng.

### 5.6 Phân trách nhiệm khi không tăng
1. **Trung tâm làm phần mình chưa** — dạy đúng giáo trình đã chốt · giao BTVN · chấm kịp · có nội dung ôn · xếp ca.
2. **Con làm phần con chưa** — Việc của con (§6).
3. **Kết quả đo.**

Mình đủ + con đủ mà không tăng ⇒ phương pháp · con không làm ⇒ động lực / gia đình · mình không làm ⇒ vận hành.
Số mới cho quản lý: **tỉ lệ dạy đúng giáo trình đã chốt**.

---

## 6. Việc của con tuần này

Khu vực **riêng**, liệt kê theo **HOẠT ĐỘNG** (không gắn vào từng nhóm bài):

```
ĐÃ LÀM
  Bài trên lớp (ET) · CN 15/11          75%   Tạm ổn
  Bài về nhà · buổi 15/11               90%   Tạm ổn
      Ghi chú: thiếu nghiêm túc (hạ 1 mức)
  Test sau giờ · T5 12/11              100%   Tốt
SẮP TỚI
  Bài trên lớp (ET) · T5 19/11
  Test sau giờ · T5 19/11 · Rút gọn căn, Căn bậc ba
  Bổ trợ yếu · T7 21/11 · ca 9:00, phòng 204
  Bài về nhà · buổi 19/11 · hạn tối CN 22/11
TỰ LUYỆN TRÊN APP · KHÔNG BẮT BUỘC
  14 câu · 3 lượt · đúng 71% · Rút gọn căn, Căn bậc ba
```

- **Danh sách do HỆ suy ra** từ lịch buổi + giáo trình + lượt chốt bổ trợ (pure-derive, CLAUDE §4). Không ai giao tay, không nút tự đánh dấu.
- Hai khối **Đã làm · Sắp tới** (có ngày, hạn; quá hạn mà chưa nộp ghi rõ "chưa nộp"). Đầu màn có ô tổng **"x/y việc đã xong"**.
- **Nhãn đánh giá 3 mức — Tốt · Tạm ổn · Chưa tốt**, cùng ngưỡng cho mọi hoạt động (trùng ngưỡng mastery):
  **≥ 80% Tốt · 50–79% Tạm ổn · < 50% Chưa tốt**, % tính như Đ/C/S.
  - **ET, test sau giờ:** chỉ theo %.
  - **CHỈ BTVN xét thái độ** (Thùy: "ở trung tâm thì ai cũng ngoan cả"): ô `btvn_ket_qua.thai_do` khác "nghiêm túc" ⇒ **hạ 1 mức**
    (Tốt → Tạm ổn, Tạm ổn → Chưa tốt; Chưa tốt giữ nguyên) + **ghi chú ngay dưới dòng**. Không thêm ô thái độ cho hoạt động nào khác.
  - HS + phụ huynh **không thấy chữ "thái độ"** và không có "thái độ tuần". Màn trung tâm thấy đủ 4 mức thái độ gốc.
  - Nhãn tính ở DB (một hàm `fn_*`), không tính ở app (CLAUDE §2.0).
- **Tự luyện trên app:** không bắt buộc, **luôn có dòng thống kê** kể cả tuần không luyện ("chưa luyện câu nào"): số câu · số lượt · % đúng ·
  nhóm đã luyện. **Không tính vào x/y việc.** Nguồn `tu_luyen_*`.

---

## 7. Vòng nợ — ôn ở nhà, đo ở trung tâm

| Ở đâu | Làm gì | Tính mastery |
|---|---|---|
| Ở nhà | ôn nhóm nợ: lý thuyết · bài trên lớp · tự luyện | KHÔNG |
| Trung tâm, sau giờ | test lại nhóm đó (luồng bổ trợ sau giờ, đang thử từ tuần 09/11) | CÓ — lần đo chính thức |

1. **Thứ Hai:** nhóm nợ hiện ở Phần 2, kèm ngày test sau giờ trong "Việc của con — Sắp tới".
2. **Trong tuần:** con ôn ở nhà, hỏi GV/TA.
3. **Test sau giờ:** thêm một lần đo.
4. **Thứ Hai sau:** đạt ⇒ hết nợ · tăng chưa đạt ⇒ tiếp tục · vắng ⇒ "không có lần đo mới", nợ chuyển tuần sau.
5. **2–3 tuần không tăng:** hệ đề xuất trưởng khối chuyển lên bổ trợ yếu — dùng nút đổi mức L1 → L2/L3/L4 sẵn có.

- **Số nhóm nợ mỗi tuần = sức chứa ca sau giờ** (ca ~20 phút, mỗi nhóm 3–4 câu ⇒ 2–3 nhóm); phần còn lại "đang xếp hàng".
- Câu test **khác** câu đã ôn (cùng nhóm, không trùng) ⇒ nhóm thiếu câu trong kho thì không ra được đề — lượt chốt phải thấy cờ này.
- Trên màn gọi là ôn tập / cơ hội, không phải án phạt; em đạt được ghi nhận rõ.
- Đánh giá ở nhà (nhẹ hơn cho trung tâm): **để sau.**

---

## 8. Thay đổi đi kèm ở hệ thống đang chạy

### 8.1 BTVN xếp chồng 3 buổi (Thùy 12/11 — sắp tới)
- **Trước:** BTVN buổi dạy dạng X = toàn dạng X. **Sau:** BTVN buổi N gồm dạng của buổi N, N-1, N-2. Một dạng vẫn ~10 bài, rải qua 3 lần.
- Tỉ lệ chia là **tham số**, mặc định **5–3–2** (4–3–3 cũng được).
- Được: mỗi dạng ET + 3 lần BTVN = 4 lần đo trong ~1,5 tuần · luyện giãn cách · không tăng khối lượng · em vắng buổi 9 vẫn gặp dạng buổi 9.
- **Hệ tự ghép BTVN, GV chỉ duyệt** (hệ biết dạng N-1, N-2 và câu đã dùng).
- Hệ quả trên màn: một nhóm có thể nằm ở Phần 1 qua nhiều tuần; dòng nhóm ghi "đã học x/y dạng".

### 8.2 BTVN tính vào mastery
- Đổi luật toàn hệ: dạng yếu, đề xuất bổ trợ, trend báo cáo tuần, KPI trưởng khối đều đọc mastery ⇒ chuỗi số gãy tại ngày đổi.
- **Trước khi áp: so cũ–mới** (bao nhiêu em đổi mức, dạng yếu mất/mới) và ghi ngày đổi lên các màn có trend.
- Hiện đã có 2 bản cache: `btvn=false` (ET+MT, mặc định) · `btvn=true` (mọi nguồn, bổ trợ dùng).
- Bài ở nhà không kiểm soát được ⇒ hệ **tự nêu cờ** khi BTVN và ET/MT của cùng nhóm lệch nhiều (triangulation, CLAUDE §5).

---

## 9. Màn hình

### 9.1 Mục tiêu tuần này — app HS **và** app phụ huynh (mockup màn 1)
- Đầu màn: tên tuần · lớp · chọn môn · nút "Các tuần trước".
- Ba ô: **Tiến độ mục tiêu tuần** (% + vạch đầu tuần + ▲/▼ + cờ đích) · **Việc của con x/y** · **Xếp hạng tiến độ** (bấm ⇒ top 20).
- Cột trái: **Phần 1 · Kiến thức mới** + **Phần 2 · Ôn tập kiến thức**. Mỗi dòng nhóm bài GỌN: tên · ▲/▼ · % · thanh có **lá cờ ở mốc mục tiêu TUẦN,
  số ghi dưới cờ** (§5.2b) + vạch mờ "đích 80%" khi mục tiêu tuần < 80% (không ghi chữ "Mục tiêu"). **Bấm vào** mới mở: một dòng mô tả (đã học x/y dạng · tuần này N lần đo, làm Tốt cả N lần thì lên X%) +
  nút **Xem lại lý thuyết · Xem lại bài trên lớp · Luyện tập**.
- Cột phải: **Việc của con tuần này** (§6).
- **App phụ huynh: cùng nội dung, cập nhật liên tục** (Cổng Phụ huynh — project riêng `bkdemy-ph`, đọc ERP qua FDW `erp_live`), chữ formal.
  Thay hẳn phương án chụp ảnh gửi.
- App HS dựng bằng khung style (`design/STYLE-HS.md`, `skin/KhungHS.tsx`), màn ngang trước (`spec-v1-app-hs.md`). Chữ theo `useLoi()`.

### 9.2 Các tuần đã chốt — HS + phụ huynh (mockup màn 2)
- Sau mỗi lần chốt thứ Hai. Đọc **sổ chốt tuần**, không tính lại.
- Ba ô của tuần vừa chốt (tiến độ · việc đã làm · hạng, kèm chênh so với tuần trước) · biểu đồ cột 8 tuần: tiến độ tuần, việc đã làm
  (hai biểu đồ riêng, không trục kép) · lưới **nhóm bài × tuần** (%, ô "chưa học" để trống riêng).

### 9.3 Tab "Mục tiêu tuần" — trung tâm (mockup màn 3)
- **Một tab trong Dashboard học tập**, đồng thời có mặt trong **Phòng làm việc trưởng khối** — cùng một màn, phòng là lối đi tắt (`spec-phong-truong-khoi.md`).
- Lọc môn · khối · tuần (tuần đang chạy hoặc tuần đã chốt).
- Bốn ô: tiến độ trung bình (▲/▼ đầu tuần) · tỉ lệ việc đã xong / việc đến hạn · BTVN Tốt · Tạm ổn · Chưa tốt · số em chưa làm việc nào.
- Bảng theo lớp: sĩ số · tiến độ TB · việc xong · BTVN theo 3 mức · số em chưa làm gì.
- **Em cần để ý** (kèm lý do: chưa làm việc nào · tụt nhiều tuần · BTVN chưa nghiêm túc / chống đối · vắng test sau giờ · nộp muộn liền) —
  bấm tên ⇒ mở màn 9.1 của em đó. Ở đây thấy đủ 4 mức thái độ BTVN.
- Theo phạm vi phân công (`fn_pham_vi_cua_toi`, `spec-truong-khoi.md`).

### 9.4 Đã loại
- Màn chốt mục tiêu theo từng học sinh (quá vất vả — §4).
- Ảnh kết quả tuần gửi phụ huynh / nút "Ảnh gửi bố mẹ" (thay bằng app phụ huynh + 9.2).
- Gắn danh sách việc vào từng dòng nhóm bài (thay bằng khu vực riêng §6).

---

## 10. Dữ liệu & kiến trúc

- **Mọi tính toán ở Postgres** (`fn_muc_tieu_tuan_*`, CLAUDE §2.0): cửa sổ tuần · gom dạng → nhóm · tiến độ · nhãn 3 mức · danh sách việc · hạng.
  App chỉ gọi hàm và hiển thị.
- **Không tính lại cả hệ khi mở màn:** số suy từ lịch sử đo đọc **cache mastery** (`mastery_luu_san`, cap `nhom`) — cấm quét lại
  `gami_grades` / `bai_lam_cau` / `bt_grades` mỗi lượt gọi. Hạng toàn trung tâm = **bảng tính sẵn**, làm mới theo nhịp cache mastery.
  "Cập nhật liên tục" = trễ vài phút sau khi chấm (theo nhịp làm mới cache), không polling ngắn. App phụ huynh qua FDW càng phải đọc bảng tính sẵn.
- **Sổ chốt tuần — bất biến**, chụp bởi cron 00:00 thứ Hai (cùng nhịp `dang_yeu_dau_tuan`); chỉ tạo dòng khi có kết quả thật (CLAUDE §1.5):
  kết luận từng (HS × môn × nhóm) · việc của tuần và kết quả · tiến độ · hạng · số đầu tuần của tuần mới. Nợ tuần sau và trend đọc từ đây
  (mastery chỉ nhìn 30 ngày ⇒ nợ không ai đo lại sẽ tự thành "chưa đo" nếu đọc mastery hiện tại).
- **Mọi bảng/hàm mang `mon`** và chạy y hệt mọi môn (symmetry test, CLAUDE §1.6).
- **Mã gốc:** nhóm/dạng tham chiếu bằng mã gốc, không bằng số thứ tự hiển thị (CLAUDE §2).
- **Hiện trạng dữ liệu** (đọc từ `schema.md` + migration 12/11, chưa query DB thật):

| Cần | Đã có | Ghi chú |
|---|---|---|
| Buổi của lớp | `buoi_hoc` (`lop_id`, `ngay`, `loai`, `trang_thai`) | buổi không có cột dạng |
| Dạng của buổi | `tai_lieu` (`giao_trinh_buoi` / `btvn` / `et` / `mt_buoi`, khoá `lop_id` + `ngay`) → `tai_lieu_phan` → `tai_lieu_cau.ma_cau` | suy được TRƯỚC khi dạy nếu tài liệu đã lên hệ |
| Mastery theo nhóm | `mastery_luu_san` (`btvn`, `cap`, `nut`, `score`, `n`, `muc`, `tin`) | ngưỡng 0,8 / 0,5 |
| BTVN | `btvn_nop` (`nop_at`) · `btvn_ket_qua` (`ti_le_dung`, `trang_thai_nop`, `thai_do`) | thái độ 4 mức có sẵn |
| Dạng yếu đầu tuần | `dang_yeu_dau_tuan` | cùng mốc 00:00 thứ Hai |
| Ca sau giờ / bổ trợ | luồng bổ trợ sau giờ (`ca_bo_tro_nhe`, `fn_btnhe_*`) · bổ trợ yếu (`ca_bo_tro`) | |
| Tự luyện | `tu_luyen_dang_lan` · `tu_luyen_so_cau` | |
| App phụ huynh | Cổng Phụ huynh (`bkdemy-ph`, FDW `erp_live`, `admin_parent_usage`) | đã chạy, có màn theo dõi đăng nhập |

---

## 11. Thứ tự build đề xuất

1. **Sổ chốt tuần + hàm cửa sổ tuần** (`fn_muc_tieu_tuan_*`): cắt cửa sổ theo giờ chấm, gom dạng → nhóm, đọc cache mastery. Cron 00:00 thứ Hai.
2. **Hàm "Việc của con"** + nhãn 3 mức (§6) — dữ liệu đã có đủ, không phụ thuộc thay đổi BTVN.
3. **Màn 9.1 trên app HS**, rồi **app phụ huynh** (cùng hàm).
4. **Tab trung tâm 9.3** (Dashboard học tập + Phòng trưởng khối).
5. **Màn 9.2 + xếp hạng** (cần ≥ 1 tuần sổ chốt).
6. **BTVN tính mastery** (§8.2) — so cũ–mới rồi mới áp.
7. **BTVN xếp chồng** (§8.1) — hệ tự ghép, GV duyệt.
8. Nghĩa vụ chốt giáo trình thành invariant: ∀ buổi tuần tới ⇒ ∃ tài liệu đã chốt trước buổi họp; thiếu ⇒ việc tồn của GV, trưởng khối thấy (không bảng tasks).

Không đo hiện trạng trước khi chạy (Thùy 13/11): trước đây không vận hành theo nhịp này nên số cũ không nói lên gì; chạy rồi mới có số.

---

## 12. Quyết định cuối (Thùy 13/11) — hết câu treo

| # | Câu | Chốt |
|---|---|---|
| 1 | Cờ = mục tiêu tuần hay 80% | Cờ = mục tiêu tuần, 80% = đích dài hạn (§5.2b) |
| 2 | Ngưỡng chênh tăng/giảm | Không có ngưỡng — mọi chênh khác 0 (§5.3) |
| 3 | Hết vòng 3 buổi ở mức 50–79% | Tạm thời KHÔNG thành nợ |
| 4 | Lớp chưa chốt xong tới giờ phát | **Chưa chốt thì chưa hiện** tờ tuần mới (màn ghi "đang chốt mục tiêu tuần"); không phát bản dở |
| 5 | Lớp học thứ Bảy + Chủ nhật liền nhau | Không có lớp nào như vậy — bỏ |
| 6 | Quan hệ với "Nhiệm vụ" app HS | **Nhiệm vụ = chơi, mục tiêu tuần = học — tách riêng.** Sau này có thể gộp và bỏ nhiệm vụ cũ, nhưng KHÔNG làm trong đợt này |
| 7 | Em vắng | Việc của buổi vắng tính **chưa hoàn thành** (vắng thì phải học bù — đường đi là buổi bù, R-BU) |
| 7b | Em mới vào lớp | Phần trước ngày vào: **chưa có dữ liệu** (không tính nợ, không tính chưa hoàn thành) — đúng §1.5 "thiếu data = không có dòng" |
| 8 | Em học nhiều môn | **Mỗi môn một màn riêng**, không có màn gộp |
| 9 | HS tự cam kết mục tiêu | Để sau |

---

## 13. Rủi ro đã soát

| # | Rủi ro | Trạng thái |
|---|---|---|
| 1 | Mastery không nhúc nhích trong 1 tuần | Gỡ bằng hai tầng (§5.2) + BTVN tính mastery + xếp chồng (§8) |
| 2 | Đường "hết yếu" không kết thúc bằng lần đo được tính; trùng bổ trợ | Gỡ bằng vòng nợ đo sau giờ (§7), một danh sách với bổ trợ |
| 3 | Tài liệu không lên hệ trước buổi họp ⇒ Phần 1 trống | Quy định bắt buộc (§4) + invariant việc tồn (§11.8) |
| 4 | Chấm trễ đẩy lần đo sang tuần khác | Hạn chấm đang chạy + "chờ chấm" là việc tồn của TA (§3.2) |
| 5 | Công khai số đổi hành vi (Goodhart): chép BTVN, cày câu dễ | Tầng tuần đòi TĂNG, không đòi đạt · cờ lệch BTVN–ET (§8.2) · theo dõi sau khi chạy |
| 6 | Nợ tự biến mất sau 30 ngày không đo | Nợ đọc từ sổ chốt tuần (§10) |
| 7 | Đổi luật mastery làm gãy trend toàn hệ | So cũ–mới trước khi áp, ghi ngày đổi lên màn trend (§8.2) |
| 8 | Màn chậm / chạm trần 8 s khi phụ huynh mở qua FDW hoặc khi tính hạng toàn trung tâm | Bảng tính sẵn + cache mastery (§10) |
| 9 | Tải: em nhiều môn, sức chứa ca sau giờ, em vắng / em mới | Gỡ: mỗi môn màn riêng · số nhóm nợ = sức chứa ca (§7) · vắng = chưa hoàn thành, mới vào = chưa có dữ liệu (§12) |

---

## 14. Hiện trạng build (13/11, phiên cloud — CHƯA áp DB, CHƯA deploy)

**Đã viết + kiểm:**
| Phần | File | Kiểm |
|---|---|---|
| DB | `supabase/migrations/202611131000_muc_tieu_tuan.sql` (bảng `mtt_lop_chot` · `mtt_dau` · `mtt_luu` · `mtt_chot` · `mtt_top`; hàm `_mtt_tinh` + `fn_mtt_*`; quyền + FDW cho app PH) · `202611131001_muc_tieu_tuan_cron_sql_editor.sql` (cron 5 phút) | Chạy trên Postgres 16 tạm với bảng giả lập theo `schema.md` + dữ liệu mẫu: tờ tuần, mục tiêu tuần (vd nhóm nợ 25% → mục tiêu 36%), việc của con, chốt lớp, cron, xếp hạng, top 20, sổ chốt bất biến, tab trung tâm, HS lớp chưa chốt ⇒ `chua_chot` |
| ERP | `src/screens/danhgia/MucTieuTuanTab.tsx` + tab "🎯 Mục tiêu tuần" trong `DashboardHocTapScreen.tsx` (Phòng trưởng khối dùng chung màn này ⇒ tự có) · `src/lib/mucTieuTuan.ts` | `tsc` · `npm run build` |
| App HS | `src/screens/hocsinh/MucTieuTuanHS.tsx` — **ô "Mục tiêu tuần" ở Home** (Thùy 13/11), ngay sau ô Học tập, theo môn đang chọn. Icon mỗi style DÙNG LẠI 1 hình không hiện ở Home (RPG `o_rank` · Tối giản `o_bai_tap_giao` · Khối/Lo-fi/Đáng yêu/Halloween `o_luyen_yeu`) — Thùy: "không trùng ở Home là được" | `tsc` · `npm run build:hs` · `check:style-hs` (file mới 0 màu gõ tay) |
| App PH | repo `bkdemy-ph-app`: `migrations/0038_muc_tieu_tuan_fdw.sql` · `app/actions/muc-tieu.ts` · `components/ph/MucTieuTuanScreen.tsx` · ô "🎯 Mục tiêu tuần" ở Home | `tsc` · `npm run build` |

**Quyết định CTO khi build (Thùy xem lại được):**
1. **"Chưa chốt thì chưa hiện" cần một tín hiệu rõ** ⇒ tab trung tâm có nút **"Chốt mục tiêu tuần" theo LỚP** (không theo từng em), bấm sau buổi họp thứ Hai khi đã chốt giáo trình + bổ trợ. Cột cạnh nút cho thấy lớp đã có tài liệu cho bao nhiêu buổi và còn bao nhiêu đề xuất bổ trợ chờ duyệt. Chỉ người có phạm vi (môn × khối) của lớp mới chốt được. Dòng chốt append-only.
2. **% nhóm đọc mastery CÓ BTVN** (`p_include_btvn = true`, y như Dashboard học tập và bổ trợ đang đọc). Việc đổi luật mastery mặc định toàn hệ (§8.2) KHÔNG làm ở đây — còn phải so cũ–mới trên DB thật.
3. **Phần 2 (nợ)** = nhóm trong đề xuất bổ trợ MỚI NHẤT đã duyệt từ thứ Hai tuần trước trở đi + dạng của case bổ trợ yếu còn mở (quy về nhóm). Số lần đo dự kiến của nhóm nợ = số ca test sau giờ / bổ trợ yếu của em trong tuần.
4. **Bấm 1 nhóm chỉ còn 2 nút: Xem lại bài trên lớp (mở khu giáo trình — có đủ bài trên lớp) · Luyện tập (Tự luyện).** Bỏ "Xem lại lý thuyết" (Thùy 13/11: không cần). App PH chỉ ghi lời nhắc, vì phụ huynh không làm bài.
5. **Xếp hạng "lên/xuống bậc"** so với hạng của hôm trước (chụp mỗi ngày lần đầu cron chạy).
6. **Sổ chốt** = tính lại tờ tuần TẠI MỐC 00:00 thứ Hai (bài chấm sau mốc không vào bản chốt); hạng trong sổ = hạng cuối của bảng đệm.

**Chưa làm (cần máy công ty / DB thật):**
1. Áp mig `202611131000` bằng `npm run migrate` (role ghi, chuỗi kết nối truyền lúc gọi), rồi `npm run schema` + commit `schema.md`.
2. Chạy `202611131001_muc_tieu_tuan_cron_sql_editor.sql` ở SQL Editor, rồi `node scripts/migrate.mjs --ghi-so <file>`.
3. Đo `fn_mtt_trung_tam` + `_mtt_ghi` bằng dữ liệu thật (khối đông nhất) — trần 8 s; `_mtt_tinh` gọi `_mastery_lan_d` (30 ngày) 1 lần/em/tuần khi chụp đầu tuần.
4. App PH: áp `migrations/0038_muc_tieu_tuan_fdw.sql` ở DB `bkdemy-ph` SAU khi ERP đã áp, rồi deploy (`npx vercel --prod --yes`).
5. Deploy ERP + app HS như thường lệ.
6. §8.1 BTVN xếp chồng + §8.2 đổi luật mastery toàn hệ: chưa đụng.
