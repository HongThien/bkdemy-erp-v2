# Chăm sóc Phụ huynh & Referral — Feature Spec · BKdemy ERP

> **Trục chính = LEVEL của phụ huynh** (trạng thái thường trực), không phải ca.
> Mô hình tham chiếu: **Loyalty Ladder** (Prospect→Customer→Client→**Advocate**) + **sales pipeline stage-gate**.
> Vay từ `BKDEMY_CANHBAO_BOTRO_SPEC.md`: case log · bắt delta · benchmark theo phân khúc · tự-động-hoá là phần thưởng kiếm được.
> Nền: `CSKH-HANDOFF.md` (đọc trước). Ngày: 01/09/2026. Cấu trúc theo **4 việc** CEO chốt.

---

## 0. Nguyên tắc nền

1. ⭐ **KHÔNG ĐẨY PHỤ HUYNH LÊN LEVEL.** Ta **tạo điều kiện**, PH tự lên. Đây là chỗ khác sale căn bản — sale có người chủ động đẩy deal; ở đây **cấm**. Đội đọc mô hình sale rất dễ hành xử như sale: viết luật này ra để chặn.
2. ⭐ **KHÔNG động tới chuyện giới thiệu khi PH chưa hài lòng.** Không cố chuyển hoá người chưa hài lòng — quá khó, việc của chuyên gia. Logic BK: *làm PH hài lòng → họ sẵn sàng, chỉ thiếu dịp hoặc chưa nghĩ đến*.
3. ⭐ **Tiêu chí lên level = HÀNH ĐỘNG CỦA PHỤ HUYNH, không phải hoạt động của BK.**
   *"Đã gọi", "đã gửi báo cáo"* = hoạt động của ta ⇒ **KHÔNG tính**. *"PH phản hồi", "PH thêm môn", "người được giới thiệu gọi đến"* = hành động của họ ⇒ **tính**.
   *(Sale: exit criteria dự đoán tốt hơn entry criteria vì nó đòi hành động của người mua, không phải phán đoán của nhân viên.)*
4. **Một stage không có tiêu chí là một cái NHÃN. Có tiêu chí mới là một cái CỔNG.**
5. ⭐ **LEVEL chỉ đi LÊN (thành tựu tích luỹ). TRẠNG THÁI HIỆN TẠI nằm ở CỜ.** Không hài lòng / nguội = **cờ**, không phải tụt bậc. Sale có đích kết thúc (closed won); CSKH thì không — quan hệ còn mãi, nên tách *đã đi xa đến đâu* khỏi *hiện giờ thế nào*.
6. ⭐ **KHÔNG CÓ THANG ĐO KHÁCH QUAN** (khác bổ trợ yếu — HS có mastery). Mọi tín hiệu là **proxy** ⇒ (a) mọi level **luôn kèm ĐỘ PHỦ** · (b) độ phủ < 50% ⇒ **không xếp level**, việc lúc đó là **đi khám**.
7. **Chưa đo ≠ thấp** (§5 CLAUDE.md). Mục chưa điền không phải 0 — tính **tỷ lệ trên các mục đã điền**.
8. **KHÔNG lưu điểm. KHÔNG lưu tín hiệu máy** — suy động từ bảng gốc (§1: *mastery không lưu*). Chỉ lưu cái không suy được: **điền tay · lần chạm đã xảy ra · snapshot lúc chẩn đoán**.
9. **KHÔNG chỉ lưu nhãn — luôn kèm NGUYÊN VĂN.** Nhãn suy được từ nguyên văn; ngược lại thì không.
10. **KHÔNG bảng nào mang nhãn `mon`.** Quan hệ với PH không phải dữ liệu học tập (§1.6). Môn chỉ sống ở bảng gốc.
11. **Không quy kết nhân quả.** Ấm lên = tính là có hiệu quả; đủ ca thì kết luận về *playbook* tự chắc.
12. **Đo NGƯỜI THỰC HIỆN bằng chất lượng chạm, KHÔNG bằng số lời giới thiệu.** Treo chỉ số referral lên đầu cá nhân là đẻ ra hành vi ép. Referral chỉ đo ở **cấp hệ thống**.
13. **Báo nhầm cũng gây hại.** Gắn nhãn "nguy cơ" lên một PH nhạy cảm không kém gắn lên một đứa trẻ. Mọi hành động chạm PH qua **người duyệt** ở phase đầu.
14. **Tự động hoá là PHẦN THƯỞNG KIẾM ĐƯỢC, không phải nút bật.** v1 = AI đề xuất, người duyệt **bắt DELTA**.

---

## 1. Mô hình lõi — bốn khái niệm, đừng lẫn

```
        ┌──────────────────────────────────────────┐
        │  LEVEL  (thành tựu tích luỹ, chỉ ĐI LÊN) │  ← TRỤC CHÍNH
        │  L1 …………………………………………………… L8           │     + CỜ = trạng thái hiện tại
        └───────────┬──────────────────┬───────────┘
                    │                  │
   BỆNH (chẩn đoán) │                  │ CỜ (đỏ / xanh / vận hành)
   vì sao đang ở đây│                  │ trạng thái HIỆN TẠI + thứ tự
   / vì sao chưa lên│                  │ KHÔNG vào level
                    ▼                  ▼
        ┌──────────────────────────────────────────┐
        │  CA / LẦN CHẠM  (hoạt động, có mở-đóng)  │
        └──────────────────┬───────────────────────┘
                           ▼
        ┌──────────────────────────────────────────┐
        │  CASE LOG — mọi thứ ghi vào              │
        │  level trước → bệnh → playbook →         │
        │  đề xuất AI → NGƯỜI SỬA GÌ + LÝ DO →     │
        │  can thiệp → NGUYÊN VĂN → level sau      │
        └──────────────────────────────────────────┘
```

- **LEVEL** = trạng thái quan hệ. Luôn tồn tại. Chỉ dịch chuyển, không đóng.
- **BỆNH** = chẩn đoán tại một thời điểm: *vì sao đang ở level này*, hoặc *vì sao chưa lên được*.
- **CA / LẦN CHẠM** = hoạt động, có mở-đóng. **Xoay quanh level, không phải ngược lại.**
- **CỜ** = trạng thái hiện tại (đỏ), lợi thế (xanh), chặn (vận hành). **Tuyệt đối không nhét vào level** — xem §2.2, §2.3.

> ⚠️ Bổ trợ yếu là **CA** (ngắn, mở-đóng, đo được). CSKH là **TRẠNG THÁI** (dài, không đóng). Đây là khác biệt mô hình lớn nhất — clone sai chỗ này là hỏng cả hệ.

---

## 2. VIỆC 1 — BỘ LEVEL (bệnh án)

### 2.1 Thang LEVEL — chỉ ĐI LÊN, là sự thật đã xảy ra

Mọi bậc là **sự thật đã xảy ra** (*đã hiểu quy trình · đã có tương tác · đã nói hài lòng · đã giới thiệu*) — những cái đó **không thể trở thành chưa từng**. ⇒ **Level KHÔNG BAO GIỜ TỤT.**

| Level | Nghĩa | **Tiêu chí — HÀNH ĐỘNG CỦA PH** |
|---|---|---|
| **L1** | PH mới | vào học |
| **L2** | Đã hiểu quy trình | xác nhận đã đọc đầy đủ. ⚠️ **tín hiệu YẾU** (tick để đóng popup) — bậc thủ tục, đừng kỳ vọng nó dự đoán gì |
| **L3** | **Kênh đã mở** | có **tương tác hai chiều**, bất kể nội dung tích cực hay tiêu cực. Cái chung của cả hai là **PH chịu mở miệng** — bước tiến thật so với PH im lặng. *(Nội dung tiêu cực xử riêng bằng cờ đỏ, không kéo level xuống.)* |
| **L4** | Đã nói hài lòng | PH chủ động nói ra — **bắt buộc ghi NGUYÊN VĂN làm bằng chứng**. Không có nguyên văn ⇒ không lên L4 |
| **L5** | **Chủ động chia sẻ sự kiện của con** | ⭐ khoảnh khắc PH chuyển từ *người nhận thông tin* sang **người kể chuyện** — tiền đề trực tiếp của giới thiệu |
| **L6** | Xin contact để giới thiệu | ý định đã thành hành động cụ thể, chưa ra kết quả — **nhóm ở ngưỡng cửa** |
| **L7** | Đã giới thiệu 1 HS đến học | **người được giới thiệu LIÊN HỆ BK.** Lời hứa KHÔNG tính |
| **L8** | Giới thiệu 2+ HS | |

### 2.2 CỜ — trạng thái hiện tại, cắt ngang mọi level

> ⭐ **Không hài lòng là CỜ, KHÔNG phải level.** Lý do kỹ thuật: nếu nó làm tụt level thì PH L7 gặp trục trặc rồi hồi phục sẽ hiện ra là *"leo lại từ L0 lên L7"* — **tiến bộ giả**, làm bẩn ma trận dịch chuyển (§5.5), tức chỉ số sức khoẻ chính của cả hệ. Là cờ thì level giữ nguyên 7, cờ bật rồi tắt, **lịch sử không bị xoá**.

| Nhóm cờ | Gồm | Dùng để |
|---|---|---|
| **CỜ ĐỎ** | không hài lòng · con tụt band 2 tháng liên tiếp · vắng tăng so với chính mình · **chậm phí lần đầu** (đổi hành vi) · hỏi về bảo lưu · ngừng trả lời tin nhắn · **nguội > 90 ngày** | ⇒ **playbook CỨU, bất kể level** |
| **CỜ XANH** | **đã TRẢ GIÁ** (thêm môn · con thứ 2 vào · ở lại qua tăng phí · theo qua chuyển cấp) · **cơ hội cao** (toà/khu · mạng lưới · vị thế cộng đồng) | xếp **thứ tự** hành động |
| **CỜ VẬN HÀNH** | chỉ Thùy gọi · **đừng hỏi giới thiệu** (đã từ chối 2 lần) | chặn hành động sai |

**Ưu tiên hành động = hàm của (cờ đỏ → level → cờ xanh), xét đúng thứ tự đó.**

> ⚠️ **"Đã trả giá" KHÔNG lên thang** dù nó là tín hiệu mạnh nhất sau giới thiệu. Vì trục này đo **sẵn sàng giới thiệu**; trả giá chứng minh **độ bền của quan hệ**, không chứng minh sẵn sàng giới thiệu — một PH có thể gắn bó sâu mà ít nói cả đời. Nhét vào thang là trộn hai trục.

> ⚠️ **Rủi ro: level lạm phát** (ai cũng cao dần, không phản ánh hiện tại). Chặn bằng chính cờ: **level nói họ đã từng đi xa đến đâu · cờ nói hiện giờ thế nào.** Hiển thị luôn cặp đôi: *"L7 + cờ nguội 4 tháng"* — đầy đủ hơn hẳn *"đã tụt xuống L5"*.

### 2.2b Bốn NHÓM HÀNH ĐỘNG — mịn để ĐO, thô để LÀM

8 bậc quá mịn để vận hành: L1→L3 cách nhau vài tuần, L6→L7 có thể cách nhau một năm; và playbook cho L3 với L4 gần như giống nhau. Đội non chỉ cần nhớ 4 nhóm:

| Nhóm | Bậc | Việc | CẤM |
|---|---|---|---|
| **CỨU** | cờ đỏ bật (bất kể level) | Chặn nghỉ. **48h**, người cứng nhất | **Cấm mọi lời liên quan giới thiệu** |
| **MỞ** | L1–L3 | Làm cho họ chịu nói. Mục tiêu: **1 phản hồi có nội dung** | Không xin gì |
| **NUÔI** | L4–L5 | Cho họ **chuyện để kể** — tin vui về con, đều đặn | Chưa nhờ giới thiệu |
| **NHỜ** | L6–L8 | Tạo dịp · cho **thứ để ĐƯA** · công nhận | Không nhờ chung chung |

### 2.2c Luật vận hành level
- **Mọi level đi kèm ĐỘ PHỦ.** Độ phủ < 50% ⇒ **"chưa xếp"**, việc là **đi khám** (§3).
- **PH nhiều con: cờ đỏ của MỘT con bật cờ cho cả PH.** Bố mẹ không tách bạch — họ chỉ nhớ *"BK đang có vấn đề với con tôi"*.
- **Chuẩn hoá theo lớp** khi so PH với nhau: so với **trung vị lớp của con**. Lớp có GV được yêu thích thì cả lớp cao — biến của **GV**, không phải của PH.
- **Ở yên quá lâu là tín hiệu.** L1–L5 không nhúc nhích > 2 quý ⇒ nêu cờ xem lại (deal aging).

### 2.3 ⭐ CƠ HỘI — tách riêng, KHÔNG vào level

Khoảng từ *hài lòng* lên *đã giới thiệu* **không do hài lòng quyết định** — nó do **có ai để giới thiệu không**.

Nhét cơ hội vào level ⇒ PH cực hài lòng mà không quen ai sẽ **mãi mãi bị coi là "chưa đạt"**, và đội sẽ đi thúc họ. Đúng thứ §0.1 và §0.2 cấm. *(Cơ hội = cờ xanh, xem §2.2.)*

**Cơ hội = thuộc tính riêng**, dùng để **xếp thứ tự hành động**, không phải để đánh giá PH:

| Yếu tố | Nguồn |
|---|---|
| Vị thế trong cộng đồng (admin group cư dân, giáo viên, người hay được hỏi) | **điền tay** — mạnh nhất |
| Mạng lưới quen có con cùng tuổi | điền tay |
| Toà / khu ở (Gemek 1–2, Golden, Geleximco) | điền tay |
| Trường + lớp con đang học | `hoc_sinh.truong_hoc` |
| Ai đưa họ vào BK | `nguoi_gioi_thieu_ph_id` |
| Khối lớp con | `hoc_sinh.khoi` |

> Hai PH cùng L5, người ở Gemek 1 **gọi trước** — nhưng cả hai **đều là L5**, không ai "kém" hơn ai.

---

## 3. VIỆC 2 — BẮT BỆNH (chẩn đoán level)

### 3.1 Hai tầng câu hỏi — không phải một bộ

*(Sale không chọn giữa BANT và MEDDIC — họ dùng cả hai theo stage: BANT nhanh để triage rộng, MEDDIC sâu cho ca đã lọc.)*

| | **Tầng 1 — QUÉT** | **Tầng 2 — ĐÀO** |
|---|---|---|
| Dùng cho | **tất cả 300 PH** | ca đáng đầu tư (cờ đỏ, hoặc L4–L5 + cờ xanh cơ hội cao) |
| Thời lượng | 3–5 phút | 20 phút+ |
| Ai hỏi | OPS/CSKH ai cũng làm được | CSKH nền tâm lý / CEO |
| Mục tiêu | **xếp được level + độ phủ**, bật/tắt cờ | **tìm BỆNH cụ thể** |

**Tầng 1 — bốn câu, hỏi đúng thứ tự này:**
1. *"Con học ở BK dạo này thế nào ạ?"* → mở, để họ tự nói trước
2. *"Anh/chị có đủ thông tin về việc học của con không?"* → bắt **B7 mù thông tin**
3. *"Có gì BK cần sắp xếp lại cho nhà mình không?"* → bắt **B3 tiền / B4 lịch**
4. *"Nếu được đổi MỘT thứ ở BK, anh/chị đổi gì?"* → câu gỡ hay nhất; hỏi thẳng *"chưa hài lòng chỗ nào"* thì 80% nhận về *"không có gì đâu em"*

**Bắt buộc: ghi NGUYÊN VĂN 1–2 câu PH nói.** Không có nguyên văn ⇒ cuộc gọi **không tính là đã khám**, độ phủ không tăng.

### 3.2 Danh mục BỆNH (v1 — thô, ít; Cách 1 trước)

**Bệnh giải thích vì sao PH đang ở level đó** — chia hai loại theo vị trí trên thang:

**Bệnh gây CỜ ĐỎ (PH đang khó chịu):**

| Mã | Bệnh | Triệu chứng | Câu đào (tầng 2) |
|---|---|---|---|
| B1 | Thất vọng về kết quả con | band tụt · cảnh báo yếu | *"Chị kỳ vọng con đạt mức nào? Hiện cách chỗ đó bao xa?"* |
| B2 | Thấy không được quan tâm | im lặng · từng nhắn mà không ai trả lời | *"Lần gần nhất BK chủ động báo tin về con là khi nào?"* |
| B3 | Vấn đề tiền | **chậm phí lần đầu** (đổi hành vi) | *"Kỳ này nhà mình có gì cần em sắp xếp không?"* |
| B4 | Vấn đề lịch / đi lại | vắng tăng · xin đổi ca · vắng đúng khung giờ | *"Giờ học hiện tại có hợp lịch nhà mình không?"* |
| B5 | Mất niềm tin vào một GV | tụt sau đổi GV · cả lớp đó cùng tụt | *"Con có hay kể gì về buổi học không?"* |
| B6 | Con không muốn đi học | vắng + GV báo đổi thái độ | *"Con nói gì khi đến giờ đi học?"* |

**Bệnh CHẶN ĐƯỜNG LÊN (PH không hề khó chịu — kẹt ở L3–L5):**

| Mã | Bệnh | Triệu chứng | Câu đào |
|---|---|---|---|
| B7 | **Mù thông tin** — không biết con đang học gì | chưa vào app · hỏi lại thứ đã báo | *"Chị có xem báo cáo tháng không? Chỗ nào khó hiểu?"* |
| B8 | ⭐ **Hài lòng nhưng VÔ HÌNH** | học ≥4 năm · không cờ xấu · không tương tác · chưa từng giới thiệu | *"Hồi đầu con thế nào, giờ chị thấy khác gì?"* → **khơi lại lý do** |

> **B8 là bệnh không có triệu chứng khó chịu** — đúng "chữ U ngược" của thâm niên (năm 1 chưa đủ tin · năm 2–3 vùng vàng · năm 4+ quen quá hoá vô hình). Không cố ý tìm thì không hệ nào bắt được, và đây có thể là nhóm đông nhất.

**B0 = chưa rõ** (độ phủ < 50%) ⇒ playbook = **đi khám**, không đoán.

### 3.3 AI ở đây
- AI **đề xuất level + bệnh + playbook** khớp, có thể **gắn cờ ca đặc biệt** (không khớp bệnh nào). v1 = **luật/playbook-based**, chưa "học".
- ⭐ **Mỗi đề xuất PHẢI hiển thị "dựa trên tín hiệu nào" + "độ phủ bao nhiêu".** Rule engine thiếu data thì báo *"không xếp được"*; AI thì dựng một đề xuất **trôi chảy từ không khí** — không ai nghi. Đây là rào chắn bắt buộc.
- ⭐ **Người duyệt — BẮT DELTA:** chặn approve trơn. Ghi **người sửa gì so với đề xuất AI + LÝ DO**. *Tín hiệu học nằm ở delta, không ở approve.*

---

## 4. VIỆC 3 — PLAYBOOK THEO LEVEL

**Logic chung theo NHÓM (§2.2b); chi tiết riêng theo bệnh.** 1 period = 1 chính sách; mỗi (nhóm × bệnh) đúng 1 playbook; **KHÔNG A/B song song** (2 PH giống nhau xử khác nhau = loạn vận hành + chẻ mẫu). So sánh **theo THỜI GIAN**.

| Nhóm | Mục tiêu | Làm gì | **CẤM** |
|---|---|---|---|
| **CỨU** (cờ đỏ, bất kể level) | Chặn nghỉ | Chạm trong **48h**, người cứng nhất. Nói thẳng vấn đề + kế hoạch cụ thể | **Cấm mọi lời liên quan giới thiệu** |
| **MỞ** (L1–L3) | Lấy được **1 phản hồi có nội dung** | Một sự thật cụ thể về con + một câu hỏi mở. Giúp vào app nếu chưa | Không xin gì |
| **NUÔI** (L4–L5) | Cho họ **chuyện để kể** | **Tin vui về con** đều đặn · giữ nhịp chạm · khơi lại lý do (với PH lâu năm) | Chưa nhờ giới thiệu |
| **NHỜ** (L6–L8) | Tạo dịp + cho thứ để ĐƯA | Suất chẩn đoán để tặng · nhờ **hành động cụ thể** (dẫn 1 người đến dự giờ) · công nhận · **báo lại kết quả người họ đã giới thiệu** | Không nhờ chung chung. **L8 không coi là nguồn khai thác** |

### 4.1 Catalog can thiệp (chưa có, phải dựng)

| Mã | Can thiệp | Chi phí | Ai |
|---|---|---|---|
| C1 | Nhắn tin **có nội dung cụ thể** về con | thấp | OPS/CSKH |
| C2 | Gọi ngắn (5–10') | vừa | CSKH |
| C3 | Gọi sâu / tâm sự (20'+) | cao | CSKH nền tâm lý |
| C4 | **Thùy gọi** | rất cao | CEO — ca nặng/nhạy cảm |
| C5 | Mời dự giờ | vừa | OPS |
| C6 | **Tặng suất chẩn đoán để PH ĐƯA cho người khác** | thấp | mở cửa DÁM + NÓI ĐƯỢC |
| C7 | Gặp trực tiếp | cao | CEO/CSKH |
| C8 | Điều chỉnh vận hành (đổi ca/GV/xếp bổ trợ) | tuỳ | OPS |
| C9 | Gửi **tin vui về con** (level up · Elo · ca bổ trợ đóng · delta band) | rất thấp | máy, người duyệt nội dung |

### 4.2 Ba luật phiên dịch (áp cho mọi can thiệp)
1. ⭐ **Tin xấu KHÔNG BAO GIỜ để máy nói.** Tin tốt máy gửi được; tin xấu qua người. **Chặn ở tầng code**, không dựa lời hứa.
2. **Hành động trước, chẩn đoán sau.** *"Con yếu → xếp bổ trợ"* = phán xét. *"Em xếp cho con buổi kèm thứ 5, con đang vướng dạng X"* = BK đang làm gì đó cho con.
3. **ẤM = CỤ THỂ**, không phải emoji hay nhiều chữ. *"Con học tốt lắm ❤️"* = lạnh (rỗng).

### 4.3 Trần & dừng
- **Một PH = MỘT người phụ trách duy nhất.** Mọi playbook đi qua người đó.
- Trần tần suất **không để giảm tổng số chạm** (ở VN **nhiều chạm là TÍNH NĂNG**) — mà để **tránh chạm trùng lặp từ nhiều người**.
- **Ngưỡng DỪNG:** PH từ chối lời mời giới thiệu 2 lần ⇒ **thôi, không hỏi nữa**. Ghi cờ vĩnh viễn.
- **Cờ "chỉ Thùy gọi"** cho ca nhạy cảm.

---

## 5. VIỆC 4 — GHI KẾT QUẢ & REVIEW (dài hạn)

> ⚠️ Khác bổ trợ yếu: **không phải ca ngắn mở-đóng, mà là quãng dài.** Hệ phải làm **nhập liệu dễ** và **đọc dữ liệu dễ** — nếu không, sau 3 tháng không ai ghi nữa.

### 5.1 ⭐ Luật vàng: mọi PH luôn có BƯỚC TIẾP THEO + NGÀY
- Kết thúc mỗi lần chạm, **bắt buộc** đặt bước tiếp theo và ngày. Không đặt ⇒ **hệ nêu cờ**.
- *"Follow up"* / *"theo dõi tiếp"* **KHÔNG tính**. Phải nói rõ **ai làm gì, khi nào**.
- Đình trệ = không hoạt động **14+ ngày** *và* không có bước tiếp theo ⇒ vào hàng đợi.
- Đây là vế **người tự đặt**, khác với invariant máy tự sinh (cờ đỏ). **Cần cả hai** — thiếu vế này thì quan hệ dài hạn trôi.

### 5.2 Nhập liệu phải dễ (nếu không, hệ chết)
- Form ghi chạm **ngắn**: bước tiếp theo + ngày · **nguyên văn 1–2 câu** (bắt buộc) · level sau · 1 nhãn bệnh.
- **Hiện lại nguyên văn lần trước** ngay trên form — người ta ghi tử tế khi thấy cái mình ghi được dùng thật.
- Hỏi **câu cụ thể**, không để ô trống "ghi chú". Ô trống ⇒ nhận về *"PH ok"*.
- Nhập được **ngay trên điện thoại**, ngay sau cuộc gọi. Về bàn mới ghi = không bao giờ ghi.

### 5.3 Đọc dữ liệu phải dễ
- **Hồ sơ 1 PH = một DÒNG THỜI GIAN**, không phải bảng rời rạc: mọi sự kiện + mọi lần chạm + mọi lần đổi level, xếp theo ngày, đọc từ trên xuống là hiểu cả quá trình.
- Hiện rõ: **level hiện tại · độ phủ · bước tiếp theo · lần chạm gần nhất · bao lâu chưa dịch chuyển**.

### 5.4 Review — theo CHU KỲ, không theo ca
- **Hàng tháng:** đối chiếu **dự đoán ↔ kết quả**. Khi hệ xếp PH vào level X và chỉ định playbook, đó là một **dự đoán ngầm** — phải ghi ra và so sau.
- **Hàng quý:** cập nhật luật. Chỉ sửa khi có **≥5–10 ca cùng kiểu sai**. ⭐ Phải **tách LUẬT SAI khỏi THỰC THI SAI** — không tách thì sẽ sửa luật để chữa một vấn đề của người gọi, càng sửa càng hỏng.
- Luật có **version + ngày hiệu lực**, và **mang theo vết sẹo**: mỗi luật ghi *vì sao tồn tại, ca nào đẻ ra nó*.

### 5.5 Đo — bốn con số
| Chỉ số | Ý nghĩa |
|---|---|
| ⭐ **Ma trận dịch chuyển level** (bao nhiêu PH lên/xuống mỗi quý) | **chỉ số sức khoẻ thật của cả hệ** |
| % PH có bước tiếp theo hợp lệ | kỷ luật vận hành — biết ngay tuần này |
| Độ phủ trung bình | < 50% thì mọi xếp hạng là tự lừa mình |
| Số **lời giới thiệu thật** / tháng (cấp hệ thống) | đích cuối. **Không gán cho cá nhân** (§0.12) |

---

## 6. Kiểm tra BỘ LEVEL bằng dữ liệu lịch sử — làm TRƯỚC khi tin nó

*(Sale validate stage bằng cách kéo deal 12 tháng và xem tỉ lệ thắng có tăng dần theo stage không.)*

**Phép kiểm:** lấy PH **đã từng giới thiệu** và PH **chưa bao giờ**, chấm ngược level của họ **tại thời điểm trước đó** (từ dữ liệu lịch sử).
- Level cao hơn ⇒ tỉ lệ đã giới thiệu cao hơn, **tăng dần đều** ⇒ bộ level **có nghĩa**.
- Phẳng, hoặc nhảy lung tung ⇒ **bộ level sai** ⇒ sửa trước khi dùng.
- ⚠️ **Dự kiến thiếu mẫu ở bậc cao**: phần lớn 300 PH sẽ dồn vào L3–L5, L6–L8 rất thưa. Nếu hai bậc liền kề cho tỉ lệ gần bằng nhau ⇒ **gộp lại**.

Thang L1–L8 là **phỏng đoán khởi đầu**. Xếp xong 300 PH thì nhìn phân bố thật rồi kéo lại — mục tiêu: nhóm "cần làm gì đó ngay" khoảng **30–50 người**, đủ xử trong 2–3 tuần.

---

## 7. Tiến hoá & tự động hoá

- **Phase A (v1):** người quyết; AI đề xuất level+bệnh+playbook, **người duyệt bắt delta**. Mọi hành động chạm PH qua người.
- **Phase B:** khi case log chứng minh đề xuất AI khớp người + kết quả tốt trên đủ ca → AI tự chạy mức nhẹ; ca L0 vẫn người ký.
- **Benchmark playbook** (§6 spec bổ trợ): benchmark **theo phân khúc** · **gate đủ mẫu** (chưa đủ = *"đang thử"*, **miễn đánh giá**) · dưới benchmark → **thay kèm nguồn ứng viên** (*cắt mà không đắp = lỗ hổng*).
- ⚠️ **Tốc độ tích mẫu chậm hơn bổ trợ yếu hàng bậc** (300 PH, mỗi người ít ca) ⇒ **period 6 tháng**, phân khúc **gộp thô**. Chẻ nhỏ = không bao giờ đủ mẫu.
- ⭐ **Chống buồng vọng:** tách rõ nguồn mỗi trường — *máy sinh* / *người ghi* / *AI đề xuất*. Người copy đề xuất AI vào ô ghi chú ⇒ vòng sau AI đọc lại lời mình và **tự khẳng định**.
- ⭐ **AI đề xuất giống nhau 3 vòng liên tiếp cho cùng loại tình huống ⇒ luật đã lộ ra ⇒ mã hoá thành rule cứng.** Vòng lặp là cách **khám phá luật**, không phải trạng thái cuối.

---

## 8. Phạm vi v1

**IN:** thang level L1–L8 (chỉ đi lên) + **3 nhóm cờ** (đỏ/xanh/vận hành) + **4 nhóm hành động** · hồ sơ điền tay (`ngay_ghi`; quá 12 tháng ⇒ hạ trọng số) · bộ câu hỏi 2 tầng · danh mục bệnh B0–B8 · catalog C1–C9 · seed 1 playbook / (level × bệnh) · AI đề xuất **kèm căn cứ + độ phủ** → người duyệt **bắt delta** · **luật bước-tiếp-theo** · form ghi chạm (nguyên văn bắt buộc, dùng được trên điện thoại) · dòng thời gian hồ sơ PH · ma trận dịch chuyển level · **trường "biết BK qua ai"** ở luồng tuyển sinh inbound · §6 phép kiểm bộ level.
**3 màn hình:** Danh sách PH · Hồ sơ 1 PH (dòng thời gian) · Hàng đợi hôm nay.

**OUT (phase sau):** AI tự chạy · **A/B song song (đã bác)** · hút Zalo tự động (⏳ chờ khảo sát 3 câu — `CSKH-HANDOFF.md`; tới đó tín hiệu Zalo vào bằng **người chép nguyên văn**).

---

## 9. Data model (reuse — verify trước)

- `level_ph` (**TRUNG TÂM**): `phu_huynh_id` PK · `level` (L1–L8 / `chua_xep`) · `co` jsonb (đỏ/xanh/vận hành) · `do_phu` · `ly_do_level` · `tu_ngay` · `buoc_tiep_theo` · `ngay_buoc_tiep` · `nguoi_phu_trach` · cờ (`chi_ceo_goi`, `dung_hoi_gioi_thieu`).
- `level_ph_log`: mọi lần đổi level **và mọi lần bật/tắt cờ** — `tu_level`, `den_level`, `co_bat`, `co_tat`, `ly_do`, `bang_chung` (nguyên văn / sự kiện), `at`, `boi`. **Trigger DB tự đẻ, app không tự nhớ ghi** (§4).
- `ho_so_ph` (**chỉ tín hiệu ĐIỀN TAY**): `loai` · `gia_tri` · `nguoi_ghi` · `ngay_ghi` · `ngay_het_han`. Append-only.
- **Tín hiệu MÁY: KHÔNG có bảng.** `fn_ph_tin_hieu(phu_huynh_id)` đọc thẳng bảng gốc (§2.0).
- `van_de_ph`: `phu_huynh_id` · `loai_benh` (B0–B8) · `muc` · `tin_hieu` jsonb (snapshot lúc chẩn đoán) · `phan_khuc` · `trang_thai`.
- `cham_ph`: mỗi lần chạm **đã xảy ra** — `nguoi_cham` · `kenh` · `can_thiep` (ref catalog) · **`nguyen_van` NOT NULL** · `ket_qua` · `level_sau` · `buoc_tiep_theo` · `ngay_buoc_tiep` · `at`.
- `case_ph` (**CASE LOG**): `van_de_id` · `playbook_id` · `de_xuat_ai` jsonb (**kèm `tin_hieu_can_cu` + `do_phu`**) · `nguoi_duyet` · `delta` jsonb · `ly_do` · `du_doan` (level kỳ vọng + mốc) · `ket_qua` · `case_truoc_id`.
- `playbook_ph` · `catalog_can_thiep_ph` · `benchmark_ph` (per `phan_khuc` × `period`).
- Bổ sung: `hoc_sinh.nguon_biet_den` · `hoc_sinh.nguoi_gioi_thieu_ph_id`.
- **Reuse (KHÔNG tạo lại):** `bao_cao_ph` · `canh_bao_yeu` · `bo_tro_yeu` · `hoa_don`/`thanh_toan` · `buoi_hoc_hs` · `hoc_sinh` · `phu_huynh` · Cổng PH (`fetchPhLogins`).

> **§1.6:** không bảng nào ở trên mang `mon`. Môn chỉ ở bảng gốc; nếu ca cần nói rõ môn thì nằm trong **nguyên văn/snapshot** — chữ mô tả, không phải chiều dữ liệu.
> Verify `information_schema` + `pg_tables.rowsecurity` trước migration. Grep repo trước khi đổi.

---

## 10. Các bước build

1. Đọc `CSKH-HANDOFF.md` · `HANDOFF.md` · `CLAUDE.md` · `BKDEMY_CANHBAO_BOTRO_SPEC.md` · spec này. Audit nguồn tín hiệu.
2. **`level_ph` + `level_ph_log` + `case_ph` trước** — trục và xương sống. **Không dựng bảng tín hiệu máy**; viết `fn_ph_tin_hieu`.
3. Tiêu chí lên level + luật bật/tắt cờ thành rule (deterministic, ngưỡng chỉnh được). Quy tắc nhiều con. **Không viết đường hạ level.**
4. `ho_so_ph` + form điền tay (gồm **cờ xanh**: đã trả giá · cơ hội — tách khỏi level).
5. **§6 phép kiểm bộ level trên dữ liệu lịch sử** — chạy TRƯỚC khi dùng. Sai thì sửa thang.
6. Bộ câu hỏi 2 tầng + `van_de_ph` (bệnh) + AI đề xuất **kèm căn cứ + độ phủ** → UI duyệt **bắt delta + lý do**.
7. `playbook_ph` + `catalog_can_thiep_ph` + seed Cách-1.
8. `cham_ph` + **luật bước-tiếp-theo** + form ghi chạm (mobile, nguyên văn bắt buộc, hiện lại lần trước).
9. 3 màn hình + dòng thời gian + ma trận dịch chuyển level + trường "biết BK qua ai".
10. RLS chuẩn. `tsc` sạch. Test 1 PH end-to-end.

---

## 11. Definition of Done

- 1 PH end-to-end: tín hiệu → xếp **level + độ phủ** → khám tầng 1 (**có nguyên văn**) → AI đề xuất bệnh+playbook **kèm căn cứ + độ phủ** → **người duyệt CÓ ghi delta + lý do** → can thiệp → ghi chạm **có nguyên văn + bước tiếp theo** → đổi level **có log + bằng chứng**.
- **Mọi tiêu chí lên level là HÀNH ĐỘNG CỦA PH.** Không tiêu chí nào là hoạt động của BK.
- **L4 không lên được nếu thiếu nguyên văn.** **L7 không lên được nếu chỉ có lời hứa.**
- ⭐ **LEVEL KHÔNG BAO GIỜ TỤT** — code không có đường hạ level. Không hài lòng/nguội ⇒ **bật cờ đỏ**.
- **Cờ đỏ ⇒ playbook CỨU bất kể level.** Ưu tiên xét đúng thứ tự (cờ đỏ → level → cờ xanh).
- **Độ phủ < 50% ⇒ "chưa xếp" + việc "đi khám"**, không xếp bừa.
- **Cơ hội và "đã trả giá" KHÔNG nằm trong công thức level** — là cờ xanh, chỉ dùng xếp thứ tự.
- Màn hình hiện **cặp (level + cờ)**, không hiện level trơ.
- **Mọi PH đang mở có bước tiếp theo + ngày**; *"follow up"* bị chặn; đình trệ 14 ngày vào hàng đợi.
- **Approve trơn bị chặn** — buộc ghi delta.
- **Tin xấu không có đường gửi tự động** — chặn ở tầng code.
- `cham_ph` chỉ có dòng khi **đã chạm thật** (§1.5). `nguyen_van` NOT NULL.
- **Không bảng tín hiệu máy. Không bảng nào có cột `mon`.** Nguồn mỗi trường phân biệt được (máy/người/AI).
- **§6 phép kiểm bộ level đã chạy** và cho tỉ lệ tăng dần theo level.
- Đổi level ghi vết bằng **trigger DB**, không dựa app nhớ.
- Form ghi chạm **dùng được trên điện thoại**; hồ sơ PH đọc được như **một dòng thời gian**.
- Verify schema, RLS chuẩn, `tsc` sạch.

---

## Goal / Kickoff

> Kick 1 câu: *"Đọc spec-cskh.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build hệ Chăm sóc Phụ huynh & Referral theo spec này, tới khi đạt HẾT "Definition of Done".

**ĐỌC TRƯỚC (bắt buộc):** `CSKH-HANDOFF.md` · `HANDOFF.md` · `CLAUDE.md` · `BKDEMY_CANHBAO_BOTRO_SPEC.md` · toàn bộ spec này.

**KỶ LUẬT:**
- **LEVEL là trục (chỉ đi lên), CỜ là trạng thái hiện tại, CA chỉ là hoạt động.** Đừng lấy ca làm trung tâm (mô hình bổ trợ yếu — sai ở đây). **Đừng hạ level.**
- **KHÔNG đẩy PH lên level. KHÔNG ép. KHÔNG động chuyện giới thiệu khi PH chưa hài lòng.**
- Tiêu chí lên level = **hành động của PH**, không phải hoạt động của BK.
- **KHÔNG lưu điểm. KHÔNG lưu tín hiệu máy** (suy động từ bảng gốc). **KHÔNG chỉ lưu nhãn — luôn kèm nguyên văn.** **KHÔNG bảng nào mang `mon`.**
- Việc = **suy ra** (§4 invariant). KHÔNG bảng `tasks`, KHÔNG row chờ.
- **KHÔNG A/B song song. KHÔNG quy kết nhân quả.** Mọi hành động chạm PH qua người duyệt.
- Verify schema TRƯỚC mọi migration. Grep repo trước khi đổi. RLS: data DISABLE / staffs ENABLE. Staff-only.

**VÒNG LÀM:** implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → bước tiếp.

**DỪNG & HỎI khi:** fork spec không cover · cần xoá/drop/migration phá dữ liệu · đụng dữ liệu PH thật gây rủi ro. Chưa chắc thì hỏi, đừng đoán.
