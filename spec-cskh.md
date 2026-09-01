# Chăm sóc Phụ huynh & Referral — Feature Spec · BKdemy ERP

> **Trục chính = LEVEL của phụ huynh** (thành tựu tích luỹ, chỉ đi lên) + **CỜ** (trạng thái hiện tại). Không phải ca.
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
5a. ⭐⭐ **THANG ĐO "ĐỘ BỘC LỘ", KHÔNG đo lòng trung thành, KHÔNG đo hài lòng.**
   Mọi bậc phải chạy theo **diễn biến tâm lý và hành động thật của phụ huynh** — không theo cái gì BK dễ đo hay dễ làm.
   Nền lý thuyết: **Social Penetration Theory** (Altman & Taylor, 1973) — quan hệ phát triển qua **tự bộc lộ tăng dần** (orientation → exploratory affective → affective → stable), và **depenetration** = rút lui khi **chi phí cảm nhận vượt lợi ích cảm nhận** (= chính cửa sổ phân rã §2.1b).
   ⇒ **Hệ quả phải chấp nhận:** PH ít nói mà cực trung thành (con thứ 2 đang học, 4 năm, chưa từng phản hồi) sẽ nằm ở **L2** — và đó **ĐÚNG**, vì họ thật sự chưa bộc lộ gì. Lòng trung thành của họ nằm ở **cờ xanh "đã trả giá"**, và chính cờ đó đẩy họ lên đầu ưu tiên. **Đừng sửa thang vì ca này.**
   ⇒ **Bộc lộ là CÓ ĐI CÓ LẠI** (norm of reciprocity): PH chỉ kể chuyện con mình khi **BK kể trước**. "Tin vui về con" không phải chiêu chăm sóc — nó là **mồi bộc lộ**.
5. ⭐ **LEVEL = SUY ĐỘNG trên CỬA SỔ TRƯỢT, không lưu** (đúng §1: *mastery không lưu, suy động*). Level phản ánh **hiện tại**; **lịch sử nằm ở `level_ph_log` + `level_cao_nhat_tung_dat`**, không mất. Không hài lòng vẫn là **cờ/điểm nóng**, không phải tụt bậc — tụt bậc chỉ do **im lặng/không hoạt động**.
6. ⭐ **KHÔNG CÓ THANG ĐO KHÁCH QUAN** (khác bổ trợ yếu — HS có mastery). Mọi tín hiệu là **proxy** ⇒ (a) **chưa chạm bao giờ trong cửa sổ ⇒ level "chưa đo"**, không phải bậc thấp · (b) **cờ xanh luôn kèm ĐỘ PHỦ**; độ phủ < 50% ⇒ không dùng cờ xanh để xếp thứ tự, việc là **đi điền**.
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
  ĐIỂM NÓNG (sự cố)│                  │ CỜ (đỏ / xanh / vận hành)
  mở → xử → ĐÓNG   │                  │ trạng thái KÉO DÀI, bật/tắt
  bệnh gắn ở đây   │   ── leo thang ──►│ KHÔNG vào level
                    ▼                  ▼
        ┌──────────────────────────────────────────┐
        │  LẦN CHẠM  (hoạt động)                    │
        └──────────────────┬───────────────────────┘
                           ▼
        ┌──────────────────────────────────────────┐
        │  CASE LOG — mọi thứ ghi vào              │
        │  level trước → bệnh → playbook →         │
        │  đề xuất AI → NGƯỜI SỬA GÌ + LÝ DO →     │
        │  can thiệp → NGUYÊN VĂN → level sau      │
        └──────────────────────────────────────────┘
```

- **LEVEL** = bậc cao nhất PH đạt **trong cửa sổ thời gian gần đây** (§2.1b). **Suy động, không lưu.** Tụt tự nhiên khi không có hoạt động mới — nhưng **lịch sử không mất** (`level_cao_nhat_tung_dat`).
- **ĐIỂM NÓNG** = **một sự cố cụ thể** (bực vì đổi GV buổi thứ 3, phàn nàn bài nhiều, hỏi bảo lưu). **Mở → xử → ĐÓNG.** Bệnh (§3.2) gắn ở đây.
- **CỜ** = trạng thái **kéo dài**, bật/tắt theo tín hiệu nguồn. Đỏ (xấu) · xanh (lợi thế) · vận hành (chặn).
- **LẦN CHẠM** = hoạt động cụ thể của BK.

> ⭐ **Luật phân biệt ĐIỂM NÓNG với CỜ:**
> **Cái gì ĐÓNG được bằng một hành động của BK ⇒ ĐIỂM NÓNG. Cái gì chỉ tắt khi tín hiệu nguồn tự đổi ⇒ CỜ.**
> PH L5 bực về một buổi học **không phải "PH không hài lòng"** — đó là **một việc cần xử**. Gắn nhãn xấu lên *con người* thay vì lên *sự việc* là đúng rủi ro §0.13, và làm OPS đọc sai: *"Chị Lan — cờ đỏ"* ⇒ nghĩ *chị Lan là ca có vấn đề*; *"Chị Lan L5 — điểm nóng: bực vì đổi GV"* ⇒ biết ngay **phải làm gì**.

> ⭐ **Leo thang:** điểm nóng **quá SLA (mặc định 24h) chưa đóng**, hoặc **≥2 điểm nóng trong một quý** ⇒ **bật CỜ ĐỎ**.
> ⚠️ **Hệ quả của SLA 24h:** lúc đầu **rất nhiều** điểm nóng sẽ quá hạn và bật cờ đỏ. Không sao — miễn cờ đỏ được đọc là **hàng đợi việc**, không phải **chuông báo động**. Đọc là báo động thì tuần thứ hai đội sẽ bắt đầu lờ nó.
> Một sự cố là chuyện bình thường của quan hệ dài. **Sự cố không được xử, hoặc lặp lại, mới là vấn đề quan hệ.**

> ⚠️ Bổ trợ yếu là **CA** (ngắn, mở-đóng, đo được). CSKH là **TRẠNG THÁI** (dài, không đóng). Đây là khác biệt mô hình lớn nhất — clone sai chỗ này là hỏng cả hệ.

---

## 2. VIỆC 1 — BỘ LEVEL (bệnh án)

### 2.1 Thang LEVEL

Mỗi bậc là một **sự thật đã xảy ra**. Level hiện tại = **bậc cao nhất đạt được trong cửa sổ gần đây** (§2.1b) ⇒ **tụt tự nhiên khi im lặng**, nhưng **không mất lịch sử**.

| Level | Nghĩa | **PH ĐANG NGHĨ GÌ** | **Điều kiện chính xác — HÀNH ĐỘNG CỦA PH** | Ai bắt |
|---|---|---|---|---|
| **chưa đo** | *(dưới sàn — không phải bậc)* | *(BK không biết)* | **chưa có lần chạm nào được ghi trong cửa sổ** ⇒ việc = **ĐI KHÁM** | 🤖 |
| **L1** | PH mới | *"Chỗ này ra sao? Con mình có hợp không?"* — thăm dò, cảnh giác | có ≥1 con `trang_thai='dang_hoc'` | 🤖 |
| **L2** | Đã hiểu quy trình | *"À, vận hành thế này. Đỡ bỡ ngỡ."* — yên tâm về thủ tục | xác nhận **đã đọc bản quy trình** trong app PH. ⚠️ **tín hiệu YẾU** (tick để đóng popup) — bậc thủ tục. **Chưa build ⇒ tạm gộp L1+L2** | 🤖 *(cần build)* |
| **L3** | **Kênh đã mở** | *"Nói ra thì họ có nghe không?"* — thử mở lời | PH gửi ≥1 phản hồi **CÓ NỘI DUNG** — không tính *"vâng"/"ok"*/emoji. Tích cực hay tiêu cực đều tính: cái chung là **PH chịu mở miệng**. *(Nội dung tiêu cực ⇒ mở điểm nóng, KHÔNG kéo level xuống.)* | 👤 |
| **L4** | Nói tốt về **BK** | *"Chỗ này được đấy."* — đánh giá **dịch vụ** tích cực | có **NGUYÊN VĂN** tích cực, **chủ ngữ là BK**: *"trung tâm dạy tốt"* · *"em hài lòng"* · *"cô nhiệt tình"*. Không nguyên văn ⇒ không lên L4 | 👤 |
| **L5** | Kể chuyện về **CON MÌNH** | *"Con mình dạo này khác thật."* — chuyển từ **đánh giá dịch vụ** sang **tự hào về con** | ⭐ có **NGUYÊN VĂN**, **chủ ngữ là ĐỨA TRẺ**: *"dạo này con tự giác hơn"* · *"hôm qua nó khoe làm được bài khó"*. **Gợi chuyện hay tự nói đều tính** — tự nói thì **thêm cờ xanh**. Xem §2.1c | 👤 |
| **L6** | Xin contact để giới thiệu | *"Có ai hỏi thì mình nói được."* — sẵn sàng nhắc đến với người ngoài | PH hỏi xin thông tin / suất để đưa cho người khác — **nhóm ở ngưỡng cửa** | 👤 |
| **L7** | Đã giới thiệu 1 HS | *"Mình đứng ra bảo lãnh."* — **đặt uy tín cá nhân** lên bàn | có `hoc_sinh` mới với `nguoi_gioi_thieu_ph_id` = PH này **và người đó đã LIÊN HỆ BK**. Lời hứa KHÔNG tính | 🤖 |
| **L8** | Giới thiệu 2+ HS | *"Đây là chỗ của mình."* — thành thói quen, thành bản sắc | như trên, ≥2 | 🤖 |

> ⚠️ **RỦI RO SỐ MỘT của việc 1: bốn bậc giữa (L3–L6) phụ thuộc hoàn toàn vào OPS có ghi hay không.**
> Không có kỷ luật ghi chép thì thang chết — và chết **âm thầm**: PH thật sự ở L5 sẽ hiện ra L2, không ai biết.
> ⇒ **§5.2 (nhập liệu phải dễ) không phải chuyện phụ — nó là ĐIỀU KIỆN SỐNG của việc 1.**

### 2.1c ⭐ Ranh giới L4 / L5 — CHỦ THỂ CỦA CÂU NÓI, không phải ai mở lời

| | PH nói về | Ví dụ nguyên văn |
|---|---|---|
| **L4** | **BK** | *"Trung tâm dạy tốt"* · *"Em hài lòng"* · *"Cô giáo nhiệt tình"* |
| **L5** | **CON MÌNH** | *"Dạo này con tự giác hơn hẳn"* · *"Hôm qua nó khoe làm được bài khó"* · *"Con bớt sợ môn Toán rồi"* |

**Vì sao đây mới là cái dự đoán referral:** không ai đi kể với hàng xóm rằng *"trung tâm X dạy tốt"* — nghe như quảng cáo hộ. Người ta kể *"con tôi dạo này khác hẳn"*. Câu thứ hai lan truyền được vì nó là **social currency của chính họ** — làm **họ** trông tốt (con tôi tiến bộ), không phải làm **BK** trông tốt.
⇒ L5 gần giới thiệu hơn L4 **không phải vì "chủ động"**, mà vì PH đã chuyển từ **đánh giá dịch vụ** sang **kể chuyện con mình** — và chính câu đó sẽ được lặp lại ở ngoài, gần như nguyên văn.

**Phép thử cho OPS:** nghe lại nguyên văn, hỏi *"câu này chủ ngữ là ai?"* — **BK** ⇒ L4 · **con họ** ⇒ L5.

**Gợi chuyện được, và nên gợi.** Không có luật "ngừng hỏi": một bậc mà BK không tác động được là bậc chết trong vận hành.
⚠️ **Nhưng có rủi ro thật:** nếu chỉ đo *"có kể khi được gợi"* thì L5 đo **kỹ năng gợi chuyện của nhân viên** nhiều hơn đo trạng thái PH — OPS khéo sẽ nâng cả lớp lên L5 và thang lạm phát.
⇒ Chặn bằng hai thứ: **(a)** bắt buộc nguyên văn (kiểm được chủ ngữ) · **(b)** ghi lại **đường đạt**: *được gợi* hay *tự nói*. **Tự nói ⇒ thêm CỜ XANH** (mạnh hơn, nhưng không lên bậc — nó chỉ xếp thứ tự trong cùng bậc).

> ⭐ **"CHƯA ĐO" ≠ "L2".** PH chưa ai chạm bao giờ trong cửa sổ mà hiện ra L2 là **thiếu dữ liệu bị đọc thành level thấp** — đúng thứ §5 CLAUDE.md cấm. Phải phân biệt được trên màn hình:
> · *chưa chạm bao giờ* ⇒ **"chưa đo"** ⇒ việc là **đi khám**
> · *đã chạm mà không sinh tín hiệu nào* ⇒ thật sự **L2**

### 2.1b ⭐ CỬA SỔ PHÂN RÃ — level tụt tự nhiên, lịch sử vẫn còn

**Không phải bậc nào cũng phân rã.** L1–L2 là **SÀN**: hiểu quy trình rồi thì không "hết hiểu" — không bao giờ tụt dưới L2.

Cửa sổ theo **nhóm hành động** (§2.2b), không dùng chung một số — một cửa sổ 6 tháng cho tất cả sẽ **quá dài cho L3** (kênh nguội 5 tháng vẫn tính là mở) và **quá ngắn cho L7** (không ai giới thiệu người mỗi nửa năm):

| Nhóm | Cửa sổ | Vì sao |
|---|---|---|
| **MỞ** (L1–L3) | **3 tháng** | tương tác là hành vi tần suất cao |
| **NUÔI** (L4–L5) | **6 tháng** | khen / chia sẻ thưa hơn |
| **NHỜ** (L6–L8) | **12 tháng** | giới thiệu là sự kiện hiếm |

> PH im lặng cả năm ⇒ rơi về **L2 (sàn)** — đọc ra đúng: *"đã biết quy trình, nhưng không có gì gần đây"*.
> ⭐ **Phân rã = "depenetration"** trong Social Penetration Theory: người ta thu hẹp bộc lộ khi **chi phí cảm nhận vượt lợi ích cảm nhận**.
> ⇒ Thấy PH tụt bậc, **câu chẩn đoán đúng KHÔNG phải *"họ bận à?"*** mà là: **"chi phí gì đang vượt lợi ích gì?"** — mất thời gian đọc? phiền vì bị nhắn nhiều? thấy nói cũng chẳng đổi được gì?
> Ba con số trên là **phỏng đoán khởi đầu** — §6 sẽ nói chúng đúng hay sai.

**PH nhiều con:** level tính **trên PH, gộp mọi sự kiện từ MỌI con** — PH khen về con A thì họ *đã nói hài lòng*, xong. Nhất quán với cờ đỏ (lấy con xấu nhất): **sự kiện tốt lấy cao nhất · sự kiện xấu lấy xấu nhất**, đều là *"bất kỳ con nào"*.

**PH mới:** ở L1 là đúng, không cần ân hạn. Nhưng **không tính cờ đỏ "vắng tăng" / "band tụt" trong 2 tháng đầu** — chưa có nền so sánh với chính họ.

**Lịch sử KHÔNG mất** (bắt buộc lưu, và bắt buộc hiển thị cùng level):
- `level_cao_nhat_tung_dat` + `dat_luc`
- **số HS đã giới thiệu TRỌN ĐỜI** (khác với "trong cửa sổ")
- `level_ph_log` — mọi lần đổi

> ⚠️ **Thiếu vế lịch sử thì một đại sứ cũ đang nguội trông y hệt một người chưa bao giờ giới thiệu** — mà cách tiếp cận hai người đó phải khác hẳn nhau.

### 2.2 CỜ — trạng thái hiện tại, cắt ngang mọi level

> ⭐ **Không hài lòng là CỜ, KHÔNG phải level.** Lý do kỹ thuật: nếu nó làm tụt level thì PH L7 gặp trục trặc rồi hồi phục sẽ hiện ra là *"leo lại từ L0 lên L7"* — **tiến bộ giả**, làm bẩn ma trận dịch chuyển (§5.5), tức chỉ số sức khoẻ chính của cả hệ. Là cờ thì level giữ nguyên 7, cờ bật rồi tắt, **lịch sử không bị xoá**.

| Nhóm cờ | Gồm | Dùng để |
|---|---|---|
| **CỜ ĐỎ** *(trạng thái kéo dài — không đóng được bằng 1 hành động, và **không suy ra được từ level**)* | con tụt band 2 tháng liên tiếp · vắng tăng so với chính mình · ngừng trả lời tin nhắn · **điểm nóng quá SLA chưa đóng** · **≥2 điểm nóng trong 1 quý** | ⇒ **playbook CỨU, bất kể level** |
| **CỜ XANH** | **đã TRẢ GIÁ** (thêm môn · con thứ 2 vào · ở lại qua tăng phí · theo qua chuyển cấp) · **cơ hội cao** (toà/khu · mạng lưới · vị thế cộng đồng) · **TỰ NÓI** (đạt L4/L5 mà không cần gợi) | xếp **thứ tự** hành động |
| **CỜ VẬN HÀNH** | chỉ Thùy gọi · **đừng hỏi giới thiệu** (đã từ chối 2 lần) | chặn hành động sai |

**Ưu tiên hành động = hàm của (điểm nóng đang mở → cờ đỏ → level → cờ xanh), xét đúng thứ tự đó.**

**Những thứ KHÔNG phải cờ — chúng là ĐIỂM NÓNG (§1), vì đóng được bằng một hành động:**
PH phàn nàn về một chuyện · **hỏi về bảo lưu** · **chậm phí** (đóng khi trả) · bực vì đổi GV hoặc một buổi cụ thể · con không muốn đi học.

> ⚠️ **"Đã trả giá" KHÔNG lên thang** dù nó là tín hiệu mạnh nhất sau giới thiệu. Vì trục này đo **sẵn sàng giới thiệu**; trả giá chứng minh **độ bền của quan hệ**, không chứng minh sẵn sàng giới thiệu — một PH có thể gắn bó sâu mà ít nói cả đời. Nhét vào thang là trộn hai trục.

> ⭐ **BỎ cờ "nguội > 90 ngày"** — nó **trùng với cửa sổ phân rã**. Cửa sổ nhóm MỞ là 3 tháng, nên PH im lặng 4 tháng **tự tụt về L2**; level đã nói điều đó rồi. Giữ cả hai = đếm hai lần cùng một sự thật, và OPS thấy vừa "L2" vừa "cờ nguội" thì thừa.
> ⇒ Cờ đỏ còn lại đúng loại **không suy ra được từ level**.

### 2.2b Bốn NHÓM HÀNH ĐỘNG — mịn để ĐO, thô để LÀM

8 bậc quá mịn để vận hành: L1→L3 cách nhau vài tuần, L6→L7 có thể cách nhau một năm; và playbook cho L3 với L4 gần như giống nhau. Đội non chỉ cần nhớ 4 nhóm:

| Nhóm | Bậc | Việc | CẤM |
|---|---|---|---|
| **XỬ ĐIỂM NÓNG** | có điểm nóng đang mở (bất kể level) | Xử **sự việc cụ thể** trong SLA rồi **đóng**. Không gắn nhãn lên PH | **Cấm mọi lời liên quan giới thiệu** cho tới khi đóng |
| **CỨU** | cờ đỏ bật (bất kể level) | Chặn nghỉ. **24h**, người cứng nhất | **Cấm mọi lời liên quan giới thiệu** |
| **MỞ** | L1–L3 | Làm cho họ chịu nói. Mục tiêu: **1 phản hồi có nội dung** | Không xin gì |
| **NUÔI** | L4–L5 | Cho họ **chuyện để kể** — tin vui về con, đều đặn | Chưa nhờ giới thiệu |
| **NHỜ** | L6–L8 | Tạo dịp · cho **thứ để ĐƯA** · công nhận | Không nhờ chung chung |

### 2.2c Luật vận hành level
- **Chưa có lần chạm nào trong cửa sổ ⇒ level "chưa đo"**, việc là **đi khám** (§3). Không phải L2.
- **ĐỘ PHỦ áp cho CỜ XANH** (cơ hội, đã trả giá — thứ phải điền tay), **không áp cho level** (level suy từ sự kiện, có thì có).
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

### 3.1 ⭐ Câu hỏi KHÔNG đo level — câu hỏi TẠO RA sự kiện

Level suy từ **sự kiện quan sát được** (có phản hồi có nội dung ⇒ L3, có nguyên văn tích cực ⇒ L4…). Nên **câu hỏi không phải công cụ ĐO — nó là công cụ TẠO BẰNG CHỨNG.**

⇒ **Câu hỏi phải khác nhau theo level**, vì mỗi bậc cần **một loại sự kiện khác nhau** để lên. Một bộ câu hỏi cố định chỉ hợp bậc thấp.

**Tầng QUÉT — câu hỏi theo level (mục tiêu: tạo sự kiện lên bậc kế tiếp)**

| PH đang ở | Cần sự kiện gì | Hỏi thế nào |
|---|---|---|
| **chưa đo / L1–L2** | một **phản hồi CÓ NỘI DUNG** | Hỏi **mở**, không thể trả lời bằng "vâng". ⚠️ *"Con học ổn không ạ?"* → nhận *"ổn em ạ"* ⇒ **KHÔNG tạo được L3**. Dùng: *"Nếu được đổi MỘT thứ ở BK, anh/chị đổi gì?"* · *"Có gì BK cần sắp xếp lại cho nhà mình không?"* |
| **L3** (đã nói chuyện, chưa khen) | một câu **khen có NGUYÊN VĂN** | Khơi ra đánh giá: *"So với hồi mới vào, chị thấy con khác gì?"* · *"Chị có đủ thông tin về việc học của con không?"* |
| **L4** (đã nói tốt về BK) | một câu **chủ ngữ là CON** | Chuyển đề tài từ *trung tâm* sang *đứa trẻ*: *"Ở nhà con có gì khác so với trước không?"* · *"Con có hay kể gì về buổi học không?"* — kèm gửi tin vui để có cớ |
| **L5** (đã kể chuyện con) | PH **nghĩ đến chuyện giới thiệu** | Mở cửa, **không xin**: *"Chị có ai quanh khu đang tìm chỗ cho con không? Lớp [X] tháng này em còn 2 chỗ."* |
| **L6** (đã xin contact) | người kia **LIÊN HỆ BK** | Không hỏi nữa — **đưa thứ để đưa** (suất chẩn đoán) + theo dõi |
| **L7–L8** | mở rộng vòng | Nhờ **hành động cụ thể** + **báo lại kết quả người họ đã giới thiệu** |

> ⭐ **L4→L5 là chuyển ĐỀ TÀI, không phải chờ tự phát.** Việc của OPS là **kéo câu chuyện từ "trung tâm thế nào" sang "con dạo này thế nào"**. Gợi chuyện là hợp lệ và nên làm — chỉ cần nguyên văn ghi lại có **chủ ngữ là đứa trẻ** (§2.1c).
> Nếu PH **tự nói mà không cần gợi** ⇒ vẫn L5, **kèm cờ xanh**.

**Tầng ĐÀO — câu hỏi chẩn đoán bệnh**

| | Tầng QUÉT | Tầng ĐÀO |
|---|---|---|
| Trả lời câu | *"Làm sao để họ đi tiếp?"* | *"Vì sao họ đang mắc?"* |
| Dùng khi | thường xuyên, theo level | **có điểm nóng**, hoặc **kẹt một bậc > 2 quý** |
| Thời lượng | 3–5 phút | 20 phút+ |
| Ai hỏi | OPS/CSKH ai cũng làm được | CSKH nền tâm lý / CEO |

**Bắt buộc ở cả hai tầng: ghi NGUYÊN VĂN 1–2 câu PH nói.** Không có nguyên văn ⇒ cuộc gọi **không tính là đã chạm**, level không đổi.

### 3.2 Danh mục BỆNH (v1 — thô, ít; Cách 1 trước)

**Bệnh giải thích vì sao PH đang ở level đó** — chia hai loại theo vị trí trên thang:

**Bệnh của ĐIỂM NÓNG (gắn với SỰ VIỆC, không gắn với con người):**

| Mã | Bệnh | Triệu chứng | Câu đào (tầng 2) |
|---|---|---|---|
| B1 | Thất vọng về kết quả con | band tụt · cảnh báo yếu | *"Chị kỳ vọng con đạt mức nào? Hiện cách chỗ đó bao xa?"* |
| B2 | Thấy không được quan tâm | im lặng · từng nhắn mà không ai trả lời | *"Lần gần nhất BK chủ động báo tin về con là khi nào?"* |
| B3 | Vấn đề tiền | **chậm phí lần đầu** (đổi hành vi) | *"Kỳ này nhà mình có gì cần em sắp xếp không?"* |
| B4 | Vấn đề lịch / đi lại | vắng tăng · xin đổi ca · vắng đúng khung giờ | *"Giờ học hiện tại có hợp lịch nhà mình không?"* |
| B5 | Mất niềm tin vào một GV | tụt sau đổi GV · cả lớp đó cùng tụt | *"Con có hay kể gì về buổi học không?"* |
| B6 | Con không muốn đi học | vắng + GV báo đổi thái độ | *"Con nói gì khi đến giờ đi học?"* |

**Bệnh CHẶN ĐƯỜNG LÊN (gắn với NGƯỜI — vì sao kẹt level; PH không hề khó chịu):**

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

**Hai HỌ playbook, đừng trộn** — vì bệnh gắn hai chỗ khác nhau (§3.2):
- **Playbook XỬ** = theo **bệnh của điểm nóng** (B1–B6). Mục tiêu: **đóng sự việc**.
- **Playbook ĐẨY LEVEL** = theo **(nhóm × bệnh chặn đường B7–B8, hoặc không bệnh)**. Mục tiêu: **lên bậc kế tiếp**.

1 period = 1 chính sách; mỗi ô trong hai họ trên đúng **1 playbook**; **KHÔNG A/B song song** (2 PH giống nhau xử khác nhau = loạn vận hành + chẻ mẫu). So sánh **theo THỜI GIAN**.

| Nhóm | Đang ở | **Mục tiêu = lên bậc nào** | Làm gì | **CẤM** |
|---|---|---|---|---|
| **XỬ ĐIỂM NÓNG** | có điểm nóng mở | đóng sự việc trong **24h** | Xử **sự việc cụ thể**, không gắn nhãn lên PH | **Cấm mọi lời về giới thiệu tới khi đóng** |
| **CỨU** | cờ đỏ bật | tắt cờ | Chạm **24h**, người cứng nhất. Nếu cờ là **phân rã** ⇒ hỏi *"chi phí gì đang vượt lợi ích gì?"* (depenetration §2.1b), **không hỏi "bận à?"** | **Cấm mọi lời về giới thiệu** |
| **KHÁM** | **chưa đo** | có 1 lần chạm được ghi | Câu hỏi tầng QUÉT. Mục tiêu duy nhất: **biết họ ở đâu** | Không xin gì, không kết luận gì |
| **MỞ** | L1–L3 | → **L4** | Một sự thật cụ thể về con + câu hỏi **mở** (không thể trả lời bằng "vâng"). Giúp vào app nếu chưa | Không xin gì |
| **NUÔI-a** | **L4** | → **L5** | ⭐ **CHUYỂN ĐỀ TÀI** từ *trung tâm* sang *đứa trẻ*. Gửi tin vui về con làm cớ, rồi hỏi *"ở nhà con có gì khác không?"* | Chưa nhờ giới thiệu |
| **NUÔI-b** | **L5** | → **L6** | Mở cửa, **không xin**: *"Chị có ai quanh khu đang tìm chỗ cho con không? Lớp [X] còn 2 chỗ"* | Không thúc, không nhắc lại quá 1 lần/quý |
| **NHỜ** | L6–L8 | → **L7/L8** | **Đưa thứ để đưa** (suất chẩn đoán) · nhờ **hành động cụ thể** · công nhận · **báo lại kết quả người họ đã giới thiệu** | Không nhờ chung chung. **L8 không coi là nguồn khai thác** |

### 4.1 Catalog can thiệp (chưa có, phải dựng)

| Mã | Can thiệp | Chi phí | Ai |
|---|---|---|---|
| C1 | Nhắn tin **có nội dung cụ thể** về con | thấp | OPS/CSKH |
| C2 | Gọi ngắn (5–10') | vừa | CSKH |
| C3 | Gọi sâu / tâm sự (20'+) | cao | CSKH nền tâm lý |
| C4 | **Thùy gọi** | rất cao | CEO — ca nặng/nhạy cảm |
| C5 | Mời dự giờ | vừa | OPS |
| C6 | **Tặng suất chẩn đoán để PH ĐƯA cho người khác** | thấp | dùng ở **L5→L6**: cho *thứ để ĐƯA* thay vì *lời để bảo lãnh* — giảm rủi ro uy tín của người giới thiệu |
| C7 | Gặp trực tiếp | cao | CEO/CSKH |
| C8 | Điều chỉnh vận hành (đổi ca/GV/xếp bổ trợ) | tuỳ | OPS |
| C9 | Gửi **tin vui về con** (level up · Elo · ca bổ trợ đóng · delta band) | rất thấp | máy, người duyệt nội dung |

### 4.2 Bốn luật phiên dịch (áp cho MỌI can thiệp)
1. ⭐ **Tin xấu KHÔNG BAO GIỜ để máy nói.** Tin tốt máy gửi được; tin xấu qua người. **Chặn ở tầng code**, không dựa lời hứa.
2. **Hành động trước, chẩn đoán sau.** *"Con yếu → xếp bổ trợ"* = phán xét. *"Em xếp cho con buổi kèm thứ 5, con đang vướng dạng X"* = BK đang làm gì đó cho con.
3. **ẤM = CỤ THỂ**, không phải emoji hay nhiều chữ. *"Con học tốt lắm ❤️"* = lạnh (rỗng).
4. ⭐ **CHỦ NGỮ LÀ ĐỨA TRẺ, không phải BK.** *"BK đã xếp buổi bổ trợ cho con"* → chủ ngữ BK. *"Con đang vướng dạng phương trình chứa tham số, em xếp buổi thứ 5 để xử sớm"* → chủ ngữ con.
   **Vì sao đây là luật, không phải gu văn phong:** bộc lộ là **có đi có lại** — những gì BK nói với PH chính là những gì PH sẽ nói lại. BK toàn nói về mình ⇒ PH cũng chỉ có chữ để nói về BK ⇒ **mắc mãi ở L4**. Muốn nhiều PH lên L5 thì phải sửa từ **đầu nguồn**.

### 4.3 Trần & dừng
- **Một PH = MỘT người phụ trách duy nhất.** Mọi playbook đi qua người đó.
- Trần tần suất **không để giảm tổng số chạm** (ở VN **nhiều chạm là TÍNH NĂNG**) — mà để **tránh chạm trùng lặp từ nhiều người**.
- **Ngưỡng DỪNG:** PH từ chối lời mời giới thiệu 2 lần ⇒ **thôi, không hỏi nữa**. Ghi cờ vĩnh viễn.
- **Cờ "chỉ Thùy gọi"** cho ca nhạy cảm.
- **Nhịp chạm theo nhóm** (khởi đầu, chỉnh được): XỬ ĐIỂM NÓNG / CỨU **ngay** · KHÁM **1 lần rồi phân loại lại** · MỞ **2–4 tuần/lần** · NUÔI **1 tháng/lần** · NHỜ **1 quý/lần**.
  ⚠️ Nhịp phải **thưa dần khi lên bậc** — bậc cao là người đã tin, chạm dày ở đó dễ thành phiền; bậc thấp mới cần dày để mở kênh.

---

## 5. VIỆC 4 — GHI KẾT QUẢ & REVIEW (dài hạn)

> ⚠️ Khác bổ trợ yếu: **không phải ca ngắn mở-đóng, mà là quãng dài.** Hệ phải làm **nhập liệu dễ** và **đọc dữ liệu dễ** — nếu không, sau 3 tháng không ai ghi nữa.

### 5.1 ⭐ Luật vàng: mọi PH luôn có BƯỚC TIẾP THEO + NGÀY
- Kết thúc mỗi lần chạm, **bắt buộc** đặt bước tiếp theo và ngày. Không đặt ⇒ **hệ nêu cờ**.
- *"Follow up"* / *"theo dõi tiếp"* **KHÔNG tính**. Phải nói rõ **ai làm gì, khi nào**.
- Đình trệ = không hoạt động **14+ ngày** *và* không có bước tiếp theo ⇒ vào hàng đợi.
- Đây là vế **người tự đặt**, khác với invariant máy tự sinh (cờ đỏ). **Cần cả hai** — thiếu vế này thì quan hệ dài hạn trôi.

### 5.2 Nhập liệu phải dễ (nếu không, hệ chết)
- Form ghi chạm **ngắn** — ghi **SỰ KIỆN**, không ghi kết luận:
  bước tiếp theo + ngày · **nguyên văn 1–2 câu (bắt buộc)** · **chủ ngữ của nguyên văn** (BK / con) · **đường đạt** (được gợi / tự nói) · có mở điểm nóng không.
- ⭐ **Người ghi KHÔNG chọn level.** Level là **suy động** (§0.5) — `fn_ph_level` tự tính từ sự kiện. Cho người chọn level là phá luôn nguyên tắc suy động, và mở đường cho lạm phát bậc.
- **Hiện lại nguyên văn lần trước** ngay trên form — người ta ghi tử tế khi thấy cái mình ghi được dùng thật.
- Hỏi **câu cụ thể**, không để ô trống "ghi chú". Ô trống ⇒ nhận về *"PH ok"*.
- Nhập được **ngay trên điện thoại**, ngay sau cuộc gọi. Về bàn mới ghi = không bao giờ ghi.

### 5.3 Đọc dữ liệu phải dễ
- **Hồ sơ 1 PH = một DÒNG THỜI GIAN**, không phải bảng rời rạc: mọi sự kiện + mọi lần chạm + mọi lần đổi level, xếp theo ngày, đọc từ trên xuống là hiểu cả quá trình.
- Hiện rõ: **level hiện tại · từng đạt bậc nào (khi nào) · số HS đã giới thiệu TRỌN ĐỜI · cờ (đỏ/xanh/vận hành) · số điểm nóng đang mở · bước tiếp theo · lần chạm gần nhất · bao lâu chưa dịch chuyển**.

### 5.4 Review — theo CHU KỲ, không theo ca
- **Hàng tháng:** đối chiếu **dự đoán ↔ kết quả**. Dự đoán phải ghi thành chữ, dạng: *"áp playbook NUÔI-a cho PH này ở L4 ⇒ kỳ vọng lên L5 trong 30 ngày"*. Sau 30 ngày so. Không ghi dự đoán ⇒ nhìn lại chỉ là **hindsight**, không phải học.
- **Hàng quý:** cập nhật luật. Chỉ sửa khi có **≥5–10 ca cùng kiểu sai**. ⭐ Phải **tách LUẬT SAI khỏi THỰC THI SAI** — không tách thì sẽ sửa luật để chữa một vấn đề của người gọi, càng sửa càng hỏng.
- Luật có **version + ngày hiệu lực**, và **mang theo vết sẹo**: mỗi luật ghi *vì sao tồn tại, ca nào đẻ ra nó*.

### 5.5 Đo — bốn con số
| Chỉ số | Ý nghĩa |
|---|---|
| ⭐ **Ma trận dịch chuyển level** — **tách LÊN (hoạt động mới) khỏi TỤT (phân rã do im lặng)** | **chỉ số sức khoẻ thật của cả hệ.** Gộp một số thì 10 lên + 10 tụt trông như "đứng yên", trong khi thực tế là 20 chuyển động |
| ⭐ **% PH ở trạng thái "chưa đo"** | **cảnh báo sớm nhất về kỷ luật ghi chép.** Số này tăng = hệ đang mù dần, và mù trước khi hỏng |
| % PH có bước tiếp theo hợp lệ | kỷ luật vận hành — biết ngay tuần này |
| Điểm nóng: mở / đóng / **quá SLA 24h** | vận hành có theo kịp không |
| Độ phủ **cờ xanh** trung bình | < 50% ⇒ không dùng cờ xanh để xếp thứ tự (§0.6). **Không liên quan tới level** |
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
- **Phase B:** khi case log chứng minh đề xuất AI khớp người + kết quả tốt trên đủ ca → AI tự chạy nhóm MỞ; **ca có cờ đỏ vẫn người ký**.
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

- `level_ph` (**TRUNG TÂM**): `phu_huynh_id` PK · **`level_cao_nhat_tung_dat` + `dat_luc`** (lịch sử, KHÔNG mất) · `so_hs_da_gioi_thieu_tron_doi` · `co` jsonb (đỏ/xanh/vận hành) · `do_phu`
  ⚠️ **`level` hiện tại KHÔNG phải cột** — suy động qua `fn_ph_level(phu_huynh_id)` trên **cửa sổ trượt** (§2.1b), cùng nguyên tắc mastery không lưu (§1). · `ly_do_level` · `tu_ngay` · `buoc_tiep_theo` · `ngay_buoc_tiep` · `nguoi_phu_trach` · cờ (`chi_ceo_goi`, `dung_hoi_gioi_thieu`).
- `level_ph_log`: mọi lần đổi level **và mọi lần bật/tắt cờ** — `tu_level`, `den_level`, `co_bat`, `co_tat`, `ly_do`, `bang_chung` (nguyên văn / sự kiện), `at`, `boi`. **Trigger DB tự đẻ, app không tự nhớ ghi** (§4).
- `ho_so_ph` (**chỉ tín hiệu ĐIỀN TAY**): `loai` · `gia_tri` · `nguoi_ghi` · `ngay_ghi` · `ngay_het_han`. Append-only.
- **Tín hiệu MÁY: KHÔNG có bảng.** `fn_ph_tin_hieu(phu_huynh_id)` đọc thẳng bảng gốc (§2.0).
- `diem_nong_ph` (**sự cố cụ thể — mở/đóng**): `phu_huynh_id` · `hoc_sinh_id` (nullable) · `loai_benh` (B1–B6) · `muc` · `tin_hieu` jsonb (snapshot lúc phát hiện) · `phan_khuc` · `mo_at` · **`sla_den`** (mặc định **+24h** từ `mo_at`) · `dong_at` · `ket_qua` · `nguyen_van`. **Chỉ tạo dòng khi có sự cố THẬT** (§1.5).
- `cham_ph`: mỗi lần chạm **đã xảy ra** — `nguoi_cham` · `kenh` · `can_thiep` (ref catalog) · **`nguyen_van` NOT NULL** · `ket_qua` · `level_sau` · `buoc_tiep_theo` · `ngay_buoc_tiep` · `at`.
- `case_ph` (**CASE LOG**): `diem_nong_id` (nullable — ca có thể là *đẩy level*, không phải *xử sự cố*) · `playbook_id` · `de_xuat_ai` jsonb (**kèm `tin_hieu_can_cu` + `do_phu`**) · `nguoi_duyet` · `delta` jsonb · `ly_do` · `du_doan` (level kỳ vọng + mốc) · `ket_qua` · `case_truoc_id`.
- `playbook_ph` · `catalog_can_thiep_ph` · `benchmark_ph` (per `phan_khuc` × `period`).
- Bổ sung: `hoc_sinh.nguon_biet_den` · `hoc_sinh.nguoi_gioi_thieu_ph_id`.
- **Reuse (KHÔNG tạo lại):** `bao_cao_ph` · `canh_bao_yeu` · `bo_tro_yeu` · `hoa_don`/`thanh_toan` · `buoi_hoc_hs` · `hoc_sinh` · `phu_huynh` · Cổng PH (`fetchPhLogins`).

> **§1.6:** không bảng nào ở trên mang `mon`. Môn chỉ ở bảng gốc; nếu ca cần nói rõ môn thì nằm trong **nguyên văn/snapshot** — chữ mô tả, không phải chiều dữ liệu.
> Verify `information_schema` + `pg_tables.rowsecurity` trước migration. Grep repo trước khi đổi.

---

## 10. Các bước build

1. Đọc `CSKH-HANDOFF.md` · `HANDOFF.md` · `CLAUDE.md` · `BKDEMY_CANHBAO_BOTRO_SPEC.md` · spec này. Audit nguồn tín hiệu.
2. **`level_ph` + `level_ph_log` + `case_ph` trước** — trục và xương sống. **Không dựng bảng tín hiệu máy**; viết `fn_ph_tin_hieu`.
3. `fn_ph_level` — suy động trên **cửa sổ trượt theo nhóm** (3/6/12 tháng, chỉnh được) · **sàn L2** · trạng thái **"chưa đo"** khi chưa có lần chạm nào trong cửa sổ. Luật bật/tắt cờ. Quy tắc gộp nhiều con. **Không lưu cột level.**
   3b. Trang **"Quy trình học tại BK"** + nút xác nhận trong app PH (cho L2). Chưa có ⇒ `fn_ph_level` **gộp L1+L2**.
4. `ho_so_ph` + form điền tay (gồm **cờ xanh**: đã trả giá · cơ hội — tách khỏi level).
5. **§6 phép kiểm bộ level trên dữ liệu lịch sử** — chạy TRƯỚC khi dùng. Sai thì sửa thang.
6. Bộ câu hỏi 2 tầng + `diem_nong_ph` (mở/đóng + SLA + leo thang bật cờ) + AI đề xuất **kèm căn cứ + độ phủ** → UI duyệt **bắt delta + lý do**.
7. `playbook_ph` + `catalog_can_thiep_ph` + seed Cách-1.
8. `cham_ph` + **luật bước-tiếp-theo** + form ghi chạm (mobile, nguyên văn bắt buộc, hiện lại lần trước).
9. 3 màn hình + dòng thời gian + ma trận dịch chuyển level + trường "biết BK qua ai".
10. RLS chuẩn. `tsc` sạch. Test 1 PH end-to-end.

---

## 11. Definition of Done

- 1 PH end-to-end: tín hiệu → xếp **level + độ phủ** → khám tầng 1 (**có nguyên văn**) → AI đề xuất bệnh+playbook **kèm căn cứ + độ phủ** → **người duyệt CÓ ghi delta + lý do** → can thiệp → ghi chạm **có nguyên văn + bước tiếp theo** → đổi level **có log + bằng chứng**.
- **Mọi tiêu chí lên level là HÀNH ĐỘNG CỦA PH.** Không tiêu chí nào là hoạt động của BK.
- **L4 không lên được nếu thiếu nguyên văn.** **L7 không lên được nếu chỉ có lời hứa.**
- ⭐ **LEVEL là SUY ĐỘNG, không có cột lưu.** Tính trên **cửa sổ trượt theo nhóm** (3/6/12 tháng), **sàn L2**. Không hài lòng ⇒ **điểm nóng / cờ**, KHÔNG hạ level; level chỉ tụt do **im lặng**.
- **Lịch sử không mất:** `level_cao_nhat_tung_dat` + `dat_luc` + số HS đã giới thiệu **trọn đời**, và **luôn hiển thị cùng level hiện tại**.
- ⭐ **ĐIỂM NÓNG tách khỏi CỜ:** cái đóng được bằng 1 hành động của BK là **điểm nóng** (có `dong_at`); cái chỉ tắt khi tín hiệu nguồn đổi là **cờ**. Phàn nàn / hỏi bảo lưu / chậm phí ⇒ **điểm nóng, KHÔNG phải cờ**.
- **Leo thang tự động:** điểm nóng quá SLA chưa đóng, hoặc ≥2 điểm nóng trong 1 quý ⇒ **bật cờ đỏ**.
- **Bệnh B1–B6 gắn vào ĐIỂM NÓNG (sự việc); B7–B8 gắn vào NGƯỜI** (vì sao kẹt level).
- **Cờ đỏ ⇒ playbook CỨU bất kể level.** Ưu tiên xét đúng thứ tự (**điểm nóng → cờ đỏ → level → cờ xanh**).
- ⭐ **"Chưa đo" phân biệt được với L2** trên màn hình: chưa chạm bao giờ ⇒ *chưa đo* + việc **đi khám**; đã chạm mà không có tín hiệu ⇒ thật sự **L2**.
- **L3–L6 có đường cho người ghi**, và form ghi làm cho việc đó **dễ hơn không ghi** (§5.2).
- ⭐ **Câu hỏi tầng QUÉT gợi ý theo LEVEL hiện tại**, không phải một bộ cố định — hệ hiện đúng câu cần hỏi cho bậc đó.
- ⭐ **Thang đo ĐỘ BỘC LỘ**, không đo trung thành. PH ít nói mà trung thành ở L2 là **đúng** — trung thành nằm ở cờ xanh. Bảng thang hiển thị cột **"PH đang nghĩ gì"** để đội hiểu vì sao có bậc đó.
- **Mọi template gửi PH có CHỦ NGỮ LÀ ĐỨA TRẺ**, không phải BK (§4.2 luật 4).
- ⭐ **Ranh giới L4/L5 là CHỦ NGỮ của nguyên văn** (BK ⇒ L4 · con họ ⇒ L5), không phải "ai mở lời". Hệ hiện nguyên văn để kiểm được.
- **Ghi ĐƯỜNG ĐẠT L4/L5**: *được gợi* hay *tự nói*. Tự nói ⇒ **cờ xanh** (không lên bậc).
- ⭐ **Form ghi chạm KHÔNG có ô chọn level** — chỉ ghi sự kiện; level do `fn_ph_level` suy ra.
- **Hai họ playbook tách bạch:** playbook XỬ (theo bệnh điểm nóng, mục tiêu đóng sự việc) vs playbook ĐẨY LEVEL (theo nhóm, mục tiêu lên bậc).
- **Nhịp chạm thưa dần khi lên bậc** — không chạm dày ở bậc cao.
- **SLA điểm nóng mặc định 24h**; quá hạn hoặc ≥2 điểm nóng/quý ⇒ bật cờ đỏ.
- **Cơ hội và "đã trả giá" KHÔNG nằm trong công thức level** — là cờ xanh, chỉ dùng xếp thứ tự; **độ phủ áp cho cờ xanh, không áp cho level**.
- **Level gộp mọi con** (tốt lấy cao nhất, xấu lấy xấu nhất). **PH mới miễn cờ "vắng tăng"/"band tụt" 2 tháng đầu.**
- Màn hình hiện: **level hiện tại · từng đạt bậc nào (khi nào) · số HS đã giới thiệu trọn đời · cờ · số điểm nóng đang mở**. Không hiện level trơ.
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
- **LEVEL là trục (chỉ đi lên) · ĐIỂM NÓNG là sự cố (mở-đóng) · CỜ là trạng thái kéo dài · LẦN CHẠM là hoạt động.** Đừng lấy ca làm trung tâm (mô hình bổ trợ yếu — sai ở đây). **LEVEL suy động trên cửa sổ trượt, KHÔNG lưu cột. Không hài lòng KHÔNG hạ level (chỉ im lặng mới hạ). Đừng biến sự cố thành nhãn dán lên con người.**
- **KHÔNG đẩy PH lên level. KHÔNG ép. KHÔNG động chuyện giới thiệu khi PH chưa hài lòng.**
- Tiêu chí lên level = **hành động của PH**, không phải hoạt động của BK.
- **KHÔNG lưu điểm. KHÔNG lưu tín hiệu máy** (suy động từ bảng gốc). **KHÔNG chỉ lưu nhãn — luôn kèm nguyên văn.** **KHÔNG bảng nào mang `mon`.**
- Việc = **suy ra** (§4 invariant). KHÔNG bảng `tasks`, KHÔNG row chờ.
- **KHÔNG A/B song song. KHÔNG quy kết nhân quả.** Mọi hành động chạm PH qua người duyệt.
- Verify schema TRƯỚC mọi migration. Grep repo trước khi đổi. RLS: data DISABLE / staffs ENABLE. Staff-only.

**VÒNG LÀM:** implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → bước tiếp.

**DỪNG & HỎI khi:** fork spec không cover · cần xoá/drop/migration phá dữ liệu · đụng dữ liệu PH thật gây rủi ro. Chưa chắc thì hỏi, đừng đoán.
