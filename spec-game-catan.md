# Spec game "BK Catan" — NHÁP v0.3

> Trạng thái: **đang sparring**, chưa chốt. Mọi con số là **giá trị khởi điểm**, sẽ chỉnh bằng mô phỏng.
> Nguồn: trao đổi CEO (Thùy) × CTO 24/09/2026.
> Người chơi: **nhân viên BK**, game giải trí thuần (KHÔNG gắn học tập). Mỗi người 1 iPad (màn riêng, bài giấu kín) +
> 1 laptop nối TV (bản đồ chung, đổ xúc xắc, giao tranh, bảng xếp hạng).

---

## 1. Định vị

Catan lai **4X** (eXplore · eXpand · eXploit · eXterminate). Giữ khung Catan (lục giác, xúc xắc 2d6, nhà/đường,
cảng, thẻ phát triển), nhưng sửa 3 lỗi gốc và thay trục tương tác:

| Lỗi của Catan gốc | Cách sửa |
|---|---|
| Xúc xắc quyết định kết quả sau khi đã đặt nhà (output randomness) | Thêm **thu nhập bị động** tỉ lệ nghịch xác suất ô (§4) |
| Ngồi chờ lâu ngoài lượt mình (downtime) | **4 người thao tác cùng lúc** trong mỗi lượt (§3) |
| Trao đổi giữa người chơi dễ bị ghét-thích chi phối | Bỏ trao đổi tự do. Tương tác chuyển sang **giao tranh ở vùng chung** và **liên minh cố định** (§7, §8) |
| Số 7 phạt người chơi | Số 7 thành **thưởng ngẫu nhiên nhỏ** |

## 2. Chế độ chơi

- **4 người, mỗi người một phe.**
- **2 đấu 2.** Đội cố định từ đầu. Trong đội được chia tài nguyên cho nhau (§8).
  **KHÔNG tính điểm** (CEO chốt 24/09): **đếm ngược tới ngày Đại chiến**, đến ngày đó 2 đội đưa toàn bộ quân ra đánh nhau,
  đội thắng trận là thắng ván (§7.5). Toàn bộ ván là chuẩn bị cho trận đó.
- *(Để sau: 6 người, 3 phe × 2.)*
- Kết thúc: chơi đủ **N lượt** (CEO chốt 24/09: **N = 25**; 15 lượt thì không ai chạm tới nội dung cuối game). Chế độ 4 người: nhiều điểm nhất thắng. Chế độ 2 đấu 2: Đại chiến ở cuối lượt N (§7.5).
  Mục tiêu 40–45 phút (25 lượt × 75–90s + thời gian TV lật kết quả).

## 3. Nhịp chơi — mỗi lượt CẢ 4 NGƯỜI cùng đổ (CEO chốt 24/09, phương án B)

- **1 lượt = 1 nhịp duy nhất**, không còn khái niệm "vòng". Cả ván 25 lượt × 75–90s (đồng hồ chỉnh được khi tạo phòng).

```
LƯỢT
 ① CẢ 4 NGƯỜI đổ xúc xắc (TV lăn 4 cặp) → tính tài nguyên của cả 4 lần đổ + tài nguyên bị động của 1 lượt
    Mỗi lần ra số 7: người đổ lần đó nhận thưởng ngẫu nhiên nhỏ
    Người đi đầu lượt này được đổ lại 1 viên của mình nếu muốn (tuỳ chọn, giữ cảm giác "tới lượt tôi")
 ② CẢ 4 NGƯỜI thao tác cùng lúc, đồng hồ 75–90s, bấm "Kết thúc" (hết giờ thì tự kết thúc)
 ③ Hệ thống chốt lượt:
    - xét các đăng ký trên bản đồ theo thứ tự ưu tiên
    - vùng khám phá: đánh quái, chia chiến lợi phẩm, có thể nổ chiến tranh (§7) → quân tự về
    - trả lương quân · giảm thời gian hồi (kỹ năng, khiên, ô khám phá) · TV hiện bảng xếp hạng / đếm ngược Đại chiến
```

- 4 lần đổ gộp trong một lượt ⇒ may rủi **trung bình hoá** thêm một lớp (ngoài thu bị động).

**Xử lý tranh chấp khi 4 người thao tác cùng lúc** (để không thành cuộc đua bấm nhanh):
- **Việc riêng** (nâng nhà của mình, mua thẻ, đổi với ngân hàng, chia tài nguyên cho đồng đội) → có hiệu lực **ngay**.
- **Việc đụng bản đồ** (đặt nhà, đặt đường, đưa quân ra vùng chung) → chỉ là **đăng ký**, xét ở bước ③.
  Thứ tự ưu tiên **xoay vòng**: mỗi lượt đổi người đi đầu. Đăng ký bị trượt thì hoàn lại tài nguyên.
- Quân đưa ra vùng chung được **giấu** tới bước ③, TV lật cùng lúc.

## 4. Tài nguyên & nguồn thu

- 5 loại như Catan: **Gỗ · Gạch · Lúa · Cừu · Quặng**. Thêm **Vàng**: chỉ kiếm được ở vùng khám phá (và thẻ cấp 3),
  đổi được thành bất kỳ tài nguyên nào, là **điều kiện bắt buộc** để nâng nhà lên các cấp cao nhất.
- Đơn vị **mịn**: ×100 so với Catan (1 lá = 100).
- **Thu từ xúc xắc:** nhà cấp 1 nhận 100 mỗi lần ô ra số. Công trình cấp cao hơn và nhánh chuyên có hệ số nhân.
- **Thu bị động (mỗi lượt, mỗi ô kề nhà):** tỉ lệ nghịch với xác suất ra số của ô.
  Hai loại ô gần bằng nhau về kỳ vọng, khác nhau ở **độ dao động**: ô 6-8 thu theo đợt, dồn cục; ô 2-12 thu đều.
  Mỗi lượt có **4 lần đổ**, nên kỳ vọng từ xúc xắc = 4 × 100 × (số tổ hợp / 36).

| Số trên ô | Số tổ hợp xúc xắc (/36) | Xúc xắc TB mỗi lượt (4 lần đổ) | Bị động mỗi lượt | **Tổng TB** |
|---|---|---|---|---|
| 2, 12 | 1 | 11 | 48 | **59** |
| 3, 11 | 2 | 22 | 36 | **58** |
| 4, 10 | 3 | 33 | 24 | **57** |
| 5, 9 | 4 | 44 | 16 | **60** |
| 6, 8 | 5 | 56 | 8 | **64** |

  → Ô 6-8 nhỉnh hơn một chút về kỳ vọng nhưng dao động mạnh. Ô 2-12 gần bằng mà chắc chắn. Bảng này **phải mô phỏng lại**.
- **Bonus %:** các % **cùng loại thì cộng**, **khác loại thì nhân**. Quy tắc này giúp người chơi tự ước lượng được.
- **Số 7:** không có Kẻ Cướp, không phải bỏ bài. Người đổ nhận ngẫu nhiên một ít tài nguyên (khởi điểm 100–200 của 1–2 loại).
- Đổi với ngân hàng 4:1 và cảng 3:1 / 2:1: giữ như Catan.

## 5. Công trình

- **Đường**: giữ như Catan. Danh hiệu **Đường dài nhất** giữ lại (+200 điểm).
- **Nhà cấp 1**: ai cũng như nhau. Nâng cấp theo **nhánh** (cây công nghệ). Đề xuất **2 nhánh ở mỗi ngã rẽ** để tránh người chơi tê liệt vì quá nhiều lựa chọn:
  - **Nhánh chuyên** theo tài nguyên của 1 ô kề, ví dụ Xưởng gỗ (rừng), Lò gạch, Trang trại, Đồng cỏ, Mỏ quặng: tăng mạnh
    **cả thu từ xúc xắc lẫn thu bị động** của loại đó.
  - **Nhánh đô thị**: tăng đều mọi ô kề (giống thành phố của Catan).
- **5 cấp**, điểm khởi điểm: cấp 1 = 100 · cấp 2 = 200 · cấp 3 = 300 · cấp 4 = 450 · cấp 5 = 600. Cấp 4–5 **bắt buộc có Vàng**.
- *(Mở: có nhánh "Doanh trại" để giảm giá hoặc tăng sức lính không?)*

## 6. Thẻ phát triển — 3 cấp

| Cấp | Nội dung | Ghi chú |
|---|---|---|
| **1** | Như Catan: Làm đường, Được mùa, Độc quyền, **Điểm thưởng ẩn**, Hiệp sĩ | Hiệp sĩ = **nhận 1 lính miễn phí** (gộp vào hệ quân, bỏ danh hiệu Quân đội mạnh nhất) |
| **2** | Có xác suất ra **kỹ năng đặc biệt** (kể cả kỹ năng tấn công nhà đối thủ) hoặc **lính** | |
| **3** | Có xác suất ra **Vàng** và kỹ năng mạnh | |

- Điểm thưởng ẩn **lật trên TV ở cuối ván**, tạo kịch tính cho màn chốt.
- **Tấn công nhà đối thủ CHỈ bằng kỹ năng đặc biệt** (có được từ thẻ cấp 2–3 hoặc nhiệm vụ). Quân đội **không** đánh trực tiếp vào nhà.
  Kỹ năng **giảm sản lượng vài lượt**, không phá sập công trình. Bị trúng xong thì được **khiên** vài lượt.

## 7. Quân đội & vùng khám phá

### 7.1 Ba loại lính, khắc nhau theo vòng

```
Kỵ binh ──khắc──▶ Cung thủ ──khắc──▶ Bộ binh ──khắc──▶ Kỵ binh
```
(Tam giác khắc chế kinh điển: kỵ binh áp sát cung, cung bắn bộ binh, giáo của bộ binh chặn kỵ.)
Giá và lương khởi điểm: Bộ binh (Lúa + Quặng) · Cung thủ (Gỗ + Lúa) · Kỵ binh (Lúa + Cừu + Quặng). Lương 10 Lúa/lính/lượt.

- **Hệ số khắc = ±25%** (CEO 24/09: ±15% → thử ±25%), dùng chung cho đánh nhau và đánh quái: khắc ×1.25, bị khắc ×0.75.
- **Lính mới đắt hơn lính cũ** (CEO chốt 24/09): giá lính = giá gốc × (1 + 0.15 × số lính đang có). Lính chết thì giá hạ lại
  → tự có cơ chế đuổi kịp. Chặn vòng lặp "quân → Vàng → quân mạnh hơn" lăn cầu tuyết khi ván dài.
- **Giới hạn quân theo nhà** (CEO chốt 24/09, kiểu "supply" của StarCraft): nhà cấp 1/2/3/4/5 nuôi được 2/3/4/5/6 lính.
  Muốn quân đông thì phải có kinh tế.
- **Nâng cấp lính theo cấp nhà** (CEO chốt 24/09, kiểu Đế chế: nâng một lần, áp cho MỌI lính loại đó):

| Bậc lính | Sức mạnh (đánh nhau + khám phá) | Cần có nhà cấp | Giá nâng (mỗi loại lính) |
|---|---|---|---|
| 1 | ×1.0 | — | — |
| 2 | ×1.4 | 2 | 200 Lúa + 200 Quặng + 200 Gỗ |
| 3 | ×1.8 | 3 | 300 Lúa + 300 Quặng + 300 Gỗ + 100 Vàng |

### 7.2 Vùng khám phá — NHIỀU ô, 3 cấp

- Nằm **giữa bản đồ**. Khởi điểm bán kính 3 = 37 ô: **7 ô trung tâm** là vùng khám phá, 30 ô bên ngoài là đất thường.
  Nhiều ô cùng lúc để **phe yếu né được phe mạnh**. Đánh nhau thật chỉ xảy ra khi có ô đặc biệt hoặc cuối game dư lính.

| Cấp ô | Số ô (khởi điểm) | Vị trí | Quà |
|---|---|---|---|
| 1 | 4 | vòng ngoài của vùng | tài nguyên thường, ít điểm chiến công |
| 2 | 2 | vòng ngoài của vùng | tài nguyên nhiều hơn + một ít Vàng |
| 3 | 1 | **tâm bản đồ** | nhiều Vàng + điểm chiến công lớn → **điểm nóng** |

- Mỗi ô khám phá có:
  - **1 loại quái**. Mỗi loại quái **yếu với 1 loại lính**, cùng tam giác khắc chế.
  - **1 kho chiến lợi phẩm hữu hạn** theo cấp ô.
- **Giới hạn quân = trần MỖI NGƯỜI trên ô**, không có trần tổng (ô đông quân thì khám phá xong nhanh). Trần tăng theo cấp ô:
  cấp 1 = **5** · cấp 2 = **8** · cấp 3 = **12** lính/người (khởi điểm).
- **Phải có ĐƯỜNG tới ô mới được gửi quân** (CEO chốt 24/09): đường của mình phải chạm một đỉnh của ô khám phá đó.
  Được xây đường dọc các cạnh bên trong vùng khám phá, nên muốn vào ô cấp 3 ở tâm thì phải làm đường sâu vào trong.
  → Đường có giá trị chiến lược thật, không chỉ để tranh danh hiệu Đường dài nhất.
  ⚠️ Rủi ro: bị đối thủ chặn đường thì mất lối vào. Mô phỏng sẽ đo; nếu nặng thì thêm luật "đường trong vùng khám phá không chặn nhau".
- **Một chuyến = 1 lượt:** đăng ký quân ở bước ②, khai thác ở bước ③, rồi **quân tự về**.
  Quân đang đi thì không dùng được việc khác.
- Nhiều người cùng khai thác một ô thì kho **cạn nhanh hơn**. Cạn 100% thì ô vào **thời gian hồi** (khởi điểm 2 lượt),
  sau đó xuất hiện lại với **loại quái mới** (và có thể đổi cấp). Người chơi có thời gian sản xuất quân và tính nước đi tiếp.
- Vùng khám phá cũng là **chỗ tiêu tài nguyên cuối game**: Catan gốc cuối ván chỉ còn dồn tiền vào xây nhà.

### 7.3 Mô hình khám phá — điểm khám phá (CEO chốt 24/09)

**Bản chất:** mỗi ô có **tổng điểm khám phá E** và **kho chiến lợi phẩm K**. Mỗi lượt, quân của mỗi người góp một số
**điểm khám phá**. Góp được x% của E thì **nhận x% của K**. Ô đạt 100% thì hết, vào thời gian hồi.

1. **Hệ số khám phá của 1 lính** = **10** × bậc lính. Khắc quái: **+25%**. Bị quái khắc: **−25%**.
2. **Lợi ích giảm dần theo số lính** (tính theo từng người, trên từng ô), để khoảng cách giàu-nghèo không nới ra quá nhanh:

| Số lính | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9–12 |
|---|---|---|---|---|---|---|---|---|---|
| Hệ số nhân g(n) | 1.0 | 1.8 | 2.4 | 2.8 | 3.2 | 3.5 | 3.8 | 4.0 | +0.2 mỗi lính (12 lính = 4.8) |

3. **Điểm khám phá mỗi người** = hệ số TB của đoàn quân × g(số lính).
   Ví dụ gửi 5 lính khắc quái: 15 × 3.2 = **48**. Gửi 5 lính trung tính: 10 × 3.2 = **32**.
4. **Nhận** = (điểm của mình / E) × K. Nếu tổng điểm mọi người vượt phần còn lại của ô thì chia phần còn lại theo tỉ lệ điểm.

**Nhịp độ** (ván chỉ có ~15 lượt, nên mỗi ô phải xong trong khoảng 2–3 lượt khi có người khai thác, mới kịp hồi và xuất hiện lại):

| Cấp ô | E (khởi điểm) | Trần/người | 1 người gửi đủ quân (trung tính) | Bao lâu thì xong |
|---|---|---|---|---|
| 1 | **50** | 5 | 32 điểm = 64%/lượt | mô phỏng lần 3: **3.0 lượt có quân** (CEO: đích 2–3, cạn thì còn ô khác) |
| 2 | 200 | 8 | 40 điểm = 20%/lượt | mô phỏng lần 2: ~7–8 lượt |
| 3 | 400 | 12 | 48 điểm = 12%/lượt | mô phỏng lần 2: gần như không cạn |

Kho K (lần 4, 25 lượt): cấp 1 = 700 tài nguyên + **50 Vàng** + 100 chiến công · cấp 2 = 2000 + 300 Vàng + 500 · cấp 3 = 2000 + 800 Vàng + 1000.

> Ví dụ "E = 1000, 1 lính = 1%" chỉ minh hoạ cách tính. Với ~15 lượt thì E = 1000 là quá lớn: một ô cấp 1 có 4 người
> khai thác đủ quân cũng mất khoảng 8 lượt, gần như không bao giờ xong. E thật sẽ chốt bằng mô phỏng.

→ Mỗi lần đưa quân đi phải tính gửi **loại lính nào** và **bao nhiêu lính**.
- **Căng thẳng có chủ ý:** lợi ích giảm dần khuyến khích **chia nhỏ quân ra nhiều ô** (5 lính ở 1 ô = 320, chia 3+2 ra 2 ô = 420),
  nhưng quân chia nhỏ thì **dễ thua nếu nổ chiến tranh**. Chọn giữa tản quân để hiệu quả và dồn quân để an toàn.
- **Chiến tranh tính theo sức mạnh đã nhân hệ số khắc (so với quân đối phương)**, không theo số lính thô:
  ít quân mà khắc thì vẫn có thể thắng, thậm chí thắng chắc (CEO xác nhận 24/09).

### 7.4 Chiến tranh trong vùng khám phá

- Các phe **khác nhau** cùng ở một ô thì khi chốt lượt có **xác suất nổ chiến tranh** (khởi điểm 40%). Không ai chọn được.
  Đồng đội không đánh nhau.
- Máy tự tính và thông báo kết quả lên TV. Không có thao tác đánh tay.
- Sức mạnh S = Σ lính × hệ số khắc **so với thành phần quân của đối phương**.
- **Thắng thua theo tỉ lệ sức mạnh** r = S_mạnh / S_yếu (CEO chốt 24/09):
  - **r ≥ 2 (gấp đôi) → bên mạnh thắng 100%**, không lật kèo được.
  - 1 ≤ r < 2: `P(bên yếu thắng) = 0.5 × (2 − r)^1.5`. Càng sát nhau thì càng gần 50/50.

| Tương quan | 10–10 | 10–9 | 10–8 | 10–7 | 10–6 | 10–5.5 | 10–5 |
|---|---|---|---|---|---|---|---|
| r | 1.00 | 1.11 | 1.25 | 1.43 | 1.67 | 1.82 | 2.00 |
| Bên yếu thắng | 50% | 42% | 32% | 22% | **10%** | 4% | **0%** |

  Số mũ 1.5 là núm vặn: tăng lên thì cửa lật kèo hẹp lại.
- **Không bao giờ chết sạch.** Thiệt hại có trần:
  - Bên thua mất `min(50%, tỉ lệ theo chênh lệch sức mạnh)` quân.
  - Bên thắng mất khoảng `30% × (S bên thua / S bên thắng)`.
- **Thắng trận:** + **điểm chiến công** và + **10% chiến lợi phẩm** khai thác ở ô đó trong lượt.
- **3 phe trở lên cùng ở một ô → đánh TỪNG CẶP** (CEO chốt 24/09), rồi tổng hợp kết quả. Ví dụ A thua B và thua C thì A tính thua 2 trận.
  - Mọi cặp tính **cùng lúc** trên sức mạnh đầu trận (không phụ thuộc thứ tự đánh).
  - Thiệt hại các trận **cộng dồn**, nhưng tổng thiệt hại của một người trong một lượt có **trần 60%** quân gửi đi → vẫn không chết sạch.
  - Mỗi trận thắng được thưởng riêng (chiến công + 10% chiến lợi phẩm).

### 7.5 Đại chiến (chỉ chế độ 2 đấu 2) — CEO chốt 24/09

- Cả ván **chơi như bình thường**: nuôi quân, khám phá, đánh nhau ở vùng khám phá (đó cũng là cách làm hao quân đối phương).
  Không phát triển kinh tế đơn thuần được, vì không có quân thì không khám phá, không có Vàng.
- TV **đếm ngược** tới ngày Đại chiến = hết lượt cuối (cố định, biết trước). Đến ngày đó **toàn bộ quân** hai đội
  đánh **một trận**, xử theo luật chiến tranh §7.4 (sức mạnh có nhân hệ số khắc; gấp đôi là thắng chắc). Đội thắng trận là thắng ván.
- Người chơi phải **căn** sao cho tới ngày cuối có đội quân mạnh nhất, đúng loại để khắc quân địch.
- *(Mô phỏng sẽ kiểm tra: có chiến thuật "không luyện lính tới lượt cuối" nào thắng áp đảo không. Nếu có thì mới thêm luật chặn.)*

## 8. Liên minh (chế độ 2 đấu 2)

- Chia tài nguyên cho đồng đội, **có giới hạn** để việc chuyên hoá vẫn là một lựa chọn thật (lý thuyết lợi thế so sánh):
  khởi điểm **phí vận chuyển 20%** (gửi 100 thì đồng đội nhận 80) và/hoặc trần mỗi lượt.
- Đồng đội không đánh nhau ở vùng khám phá. Hai người cùng vào một ô thì cộng sức mạnh khi có chiến tranh.

## 9. Điểm thắng (mịn, ×100)

| Nguồn | Khởi điểm |
|---|---|
| Công trình theo cấp | 100 / 200 / 300 / 450 / 600 |
| Đường dài nhất | 200 |
| Thẻ điểm thưởng ẩn | 100 mỗi lá, lật cuối ván |
| Chiến công: thắng trận, khai thác vùng khám phá | theo trận / theo phần thu |

## 10. Kỹ thuật (theo mẫu các game BK)

- 1 file HTML trong `games-site/`, giống `co-ti-phu.html`. Supabase Realtime: kênh theo phòng, presence có vai TV và người chơi số mấy.
- **Máy TV (laptop) giữ trạng thái gốc**: tính toàn bộ, iPad chỉ gửi lệnh và nhận phần của mình.
- Lưu ý: kênh broadcast gửi tới mọi máy, nên bài "giấu" chỉ giấu ở giao diện. Nhân viên chơi với nhau thì chấp nhận được.
- Trước khi code: viết **bộ mô phỏng cân bằng** (bot chơi ngẫu nhiên hoặc tham lam, chạy vài nghìn ván) để chỉnh bảng §4, giá lính, kho chiến lợi phẩm.

## 11. Câu hỏi mở

*(Đã chốt 24/09: chiến tranh theo xác suất, đánh từng cặp · thắng trận = chiến công + 10% chiến lợi phẩm · đi 1 lượt rồi về, ô có thời gian hồi ·
nhiều ô, 3 cấp · lợi ích giảm dần theo số lính · cần đường tới ô khám phá · Đại chiến 1 trận cuối ván · nhịp B: mỗi lượt cả 4 cùng đổ ·
bỏ "lính đánh thuê" (chính là quân đội) · tên game: **BK Catan**.)*

Không còn câu mở về luật lõi. Bước tiếp: **bộ mô phỏng cân bằng** để chốt các con số khởi điểm.

## 12. Mô phỏng lần 1 (24/09) — `node scripts/sim-bk-catan.mjs 2000 7`

Bot tham lam, 2000 ván mỗi kịch bản. Chỉ để thấy **hướng**; người chơi thật khôn hơn bot. Chưa mô phỏng: cảng, thẻ cấp 2–3, khiên, đổ lại.

| Câu hỏi | Kết quả | Kết luận |
|---|---|---|
| Còn phải dồn ô 6-8 không? | Dồn 6-8 thắng 47%, dồn 2-12 thắng 53% (2 bot mỗi bên) | ✅ Đạt mục tiêu: chỗ đặt nhà không còn một đáp án duy nhất |
| Bị động có giảm may rủi không? | Độ lệch thu nhập 5 lượt đầu: Catan gốc 31% → có bị động 25% | ✅ Giảm nhưng vừa phải. Tổng kinh tế cũng tăng khoảng 65% → phải nâng giá công trình |
| Có lối chơi áp đảo (4 người)? | **Kinh tế không quân thắng 50%**, các lối có quân 15–18% | ❌ Khám phá thưởng quá ít so với xây nhà |
| Ô khám phá bao lâu cạn? | Cấp 1: 5.5 lượt · cấp 2: 8.6 · **cấp 3: không bao giờ** | ❌ Chậm hơn đích 2–3 lượt; quân TB chỉ ~3 lính → Vàng hiếm, cấp 4–5 gần như không ai lên |
| Chặn đường nặng không? | Bị chặn khỏi vùng khám phá: 0.1% | ✅ Không cần luật chống chặn |
| Thời gian thao tác | ~2–3 hành động/lượt | ✅ 90–120s dư; có thể hạ còn 60–75s |
| Chiến tranh | 2–4 trận/ván, lật kèo 17% | ✅ Hợp lý |
| 2 đấu 2: dồn quân phút chót? | Thua 80–92% | ✅ Bẫy KHÔNG xảy ra |
| 2 đấu 2: quân sớm? | Thắng 69–99% trước mọi lối khác; lối quân sớm gần như không xây nhà | ❌ Chế độ đội dễ thành "chỉ luyện lính" |
| Trận cuối có kịch tính? | Hai đội ngang nhau vẫn ~50% trận chênh ≥ 2 lần (thắng chắc) | ⚠️ Hệ số khắc 1.5/0.6 quá mạnh: 8 Kỵ chắc chắn thắng 10 Cung → trận cuối thành đoán oẳn tù tì |
| Thẻ phát triển | Bot gần như không mua | ⚠️ Một phần do bot; cần xem lại giá trị thẻ |

## 13. Mô phỏng lần 2 (24/09) — sau khi thêm giới hạn quân, khắc ±15%, nâng cấp lính, chỉnh thưởng khám phá

| Câu hỏi | Lần 1 | **Lần 2** | Kết luận |
|---|---|---|---|
| 4 người: tỉ lệ thắng 4 lối chơi | Kinh tế 50% · các lối khác 15–18% | **Cân bằng 22% · Kinh tế 27% · Quân sớm 30% · Né 22%** | ✅ Không còn lối áp đảo (dò: chiến công ô cấp 1 = 200 cân nhất; 150 → Kinh tế 40%, 250 → Quân sớm 39%) |
| 2 đấu 2: quân sớm vs kinh tế trước, quân từ lượt 6 | 69% | **58%** | ✅ Giới hạn quân có tác dụng: 97% ván lối quân sớm chạm trần, buộc phải xây nhà |
| 2 đấu 2: dồn quân phút chót | thua 80–92% | thua 75–80% | ✅ Vẫn không phải chiến thuật tốt |
| Chỗ đặt nhà 6-8 vs 2-12 | 47 / 53 | **48 / 52** | ✅ |
| Trận cuối: tỉ lệ trận "thắng chắc" (chênh ≥ 2 lần) khi hai đội giống hệt nhau | ~50% | **~49%** | ⚠️ Không còn do hệ số khắc (±15% chỉ tạo chênh tối đa 1.35 lần) mà do **quân số chênh** sau giữa ván: phe chơi tốt giữa ván thì trận cuối gần như đã định. Đây là hệ quả của luật "gấp đôi = thắng chắc" — đúng hay sai là quyết định thiết kế |
| Nâng cấp lính có được dùng? | — | **Gần như không** (bậc TB 1.03) | ❌ Lối quân không lên nổi nhà cấp 3. Hạ điều kiện (bậc 2 cần nhà cấp 2, bậc 3 cần cấp 3) → bậc TB của lối quân lên 1.26, tỉ lệ thắng không lệch |
| Ô cấp 3 và Vàng | không bao giờ cạn | **vẫn không cạn**, Vàng thu 130–380/ván | ❌ Cấp 4–5 và lính bậc 3 gần như không ai chạm tới. Cần ô cấp 3 nhỏ hơn hoặc Vàng rơi cả ở ô cấp 1 |
| Tốc độ cạn ô cấp 1 | 5.5 lượt | 4.5–6 lượt | ⚠️ Chậm hơn đích 2–3 lượt. Thử thu nhỏ ô → nhanh cạn hơn nhưng khám phá **kém lời** hơn (thời gian hồi là lượt chết) |

## 14. Mô phỏng lần 3 (24/09) — khắc ±25%, lính bậc 2/3 cần nhà cấp 2/3, ô cấp 1 nhỏ + rơi Vàng

| Câu hỏi | Lần 2 | **Lần 3** | Kết luận |
|---|---|---|---|
| Ô cấp 1 cạn sau bao nhiêu lượt có quân | ~5 | **3.0** | ✅ Đạt đích 2–3. Ô xuất hiện lại ~5 lần/ván |
| Vàng thu/ván | 130–380 | **180–790** | ✅ Tăng gấp ~1.5–2 lần |
| Nâng cấp lính có được dùng | bậc TB 1.03 | lối quân: **1.27** | ✅ Bắt đầu được dùng |
| 4 người: tỉ lệ thắng | 22 / 27 / 30 / 22 | Cân bằng **17** · Kinh tế **31** · Quân sớm **36** · Né **16** | ⚠️ Lối "nửa nọ nửa kia" thua cả hai lối chuyên. Chỉnh thưởng chỉ đổi qua lại giữa Kinh tế và Quân sớm, 2 lối lai vẫn ~16% — có thể do bot lai chơi dở (xây quân ít) |
| Trận cuối "thắng chắc" khi 2 đội giống hệt | 49% | **55%** | ⚠️ ±25% làm thành phần quân quyết định nhiều hơn (khắc hẳn = chênh 1.67 lần) → trận cuối BỚT cửa lật kèo |
| 2 đấu 2: quân sớm vs quân từ lượt 6 | 58% | 58% | ✅ Không đổi |
| Chiến tranh/ván · lật kèo | 4.0 · 12% | 3.2 · 15% | ✅ |
| Ô cấp 3 | không cạn | cạn 7 lần/2000 ván | ❌ Vẫn gần như không ai khai thác xong |

## 15. Mô phỏng lần 4 (24/09) — 25 lượt + lính mới đắt hơn (giá × (1 + 0.15 × số lính đang có))

**Độ dài ván** (trước khi có luật giá lính tăng dần) — tỉ lệ thắng của lối Quân sớm theo số lượt: 15 → 37% · 20 → 49% · 25 → 53% · 30 → 65% · 35 → 71%.
Ván càng dài thì vòng lặp "quân → khám phá → Vàng → lính mạnh hơn" càng lăn cầu tuyết. 15 lượt thì cấp nhà 4–5, lính bậc 3, ô cấp 3 gần như bỏ không; từ 25 lượt mới được chơi.

| Câu hỏi | Kết quả (25 lượt, 1500 ván) | Kết luận |
|---|---|---|
| Giá lính tăng dần có hãm lăn cầu tuyết? | Quân sớm 53% → **42%** (dò 0 / 0.1 / 0.2 / 0.3: 53 / 33 / 26 / 20%) | ✅ Có. Chọn 0.15 + chiến công ×1.25 |
| Lối lai thua do luật hay do bot? | Bot lai "nhà trước, giữ ~8 lính" thắng **45%** khi đấu Kinh tế 36%, Quân sớm 8% | ✅ **Do bot.** Lối lai chơi đúng là mạnh nhất |
| Có lối chơi nào thắng mọi bàn? | Bàn B: Quân sớm 42 ≈ Kinh tế 40. Bàn D: Lai 45, Quân sớm chỉ 8 | ✅ Không. Lối nào mạnh **tuỳ đối thủ trong bàn** (kiểu oẳn tù tì giữa các lối chơi) → không có công thức thắng cố định |
| Ô cấp 1 cạn | **2.1–2.6 lượt** có quân | ✅ Đạt đích 2–3 |
| Ô cấp 3 | cạn 0.5–1 lần/ván | ✅ Bắt đầu được khai thác |
| Hành động/lượt | 2–3 | ✅ Đồng hồ 75–90s đủ |
| Chiến tranh/ván | 8 (bàn B) – 35 (bàn D, 3 lối có quân) | ⚠️ Bàn nhiều người làm quân thì đánh nhau gần như mỗi lượt — xem có quá dày không khi chơi thật |
| 2 đấu 2: quân sớm vs quân từ lượt 6 | 54% | ✅ Cân |

## 16. Bàn cờ mới (CEO 24/09) + mô phỏng lần 5

- **Bàn "lục giác dẹt" cho TV:** 7 hàng, hàng giữa 9 ô, mỗi hàng lệch ra ngắn đi 1 ô → **51 ô** (44 đất + 7 khám phá), rộng 15.6 × cao 11.
  *(Bản đầu 65 ô — CEO: nhiều quá, giảm còn 51.)*
  Tài nguyên chia đều 5 loại; số = bộ 18 lá Catan lặp lại, không để 6/8 kề nhau (đổi chỗ tới khi hết kề). 10 cảng (5 riêng 2:1 + 5 chung 3:1).
- **7 ô khám phá rải khắp bản đồ:** ô tâm luôn cấp 3; 6 ô còn lại cách tâm 3 ô, mỗi lần xuất hiện ngẫu nhiên cấp 1 (65%) hoặc cấp 2 (35%).
- **Giữa các ô có sẵn khe đường + nút nhà** (2D lẫn 3D) để nhìn/chọn dễ.
- **TV:** bàn 3D (mô hình KayKit) là chính, nút/phím M đổi sang 2D để nhìn tổng thể; bảng người chơi (phím 1) và bảng xúc xắc/khám phá/tin (phím 2) nổi trên bàn, ẩn/hiện được.

**Mô phỏng lần 5 (bàn mới, 600–1000 ván):** đất gần như không hết → lối Kinh tế xây ~21 nhà (bàn cũ ~7) và thắng **66–74%**.

| Thử | 4 lối (Cân bằng / Kinh tế / Quân sớm / Né) | Bàn có bot lai khôn (Lai nhà trước / Kinh tế / Quân sớm) |
|---|---|---|
| Hiện tại | 16 / **74** / 0 / 10 | 33 / **66** / 0 |
| Chỉ tăng chiến công ×2 | 27 / **49** / 7 / 17 | 56 / 37 / 4 |
| Chỉ "nhà mới đắt hơn" +15%/nhà | 33 / **44** / 2 / 21 | 43 / 53 / 2 |
| **Nhà +15%/nhà + chiến công ×2** | **39 / 14 / 24 / 23** | **59 / 11 / 15** |

→ Đề xuất: thêm luật **nhà mới đắt hơn nhà cũ** (giá nhà × (1 + 0.15 × số nhà đang có), đối xứng với luật lính) + chiến công ô 1/2/3 = 200/1000/2000. *(chờ CEO chốt luật nhà)*

**Mô phỏng lần 6 (bàn 51 ô) — CEO đồng ý luật "nhà mới đắt hơn", CTO căn tỉ lệ.** Dò nhà +0 / 10 / 15 / 20% × chiến công ×1 / 1.5 / 2:
chọn **nhà +10%/nhà đang có** và **chiến công ô cấp 1/2/3 = 175 / 875 / 1750** (×1.75). Kết quả (1500 ván):

| Bàn | Kết quả |
|---|---|
| 4 lối | Cân bằng 55% · Kinh tế 9% · Quân sớm 11% · Né 25% |
| Có bot lai khôn | Lai (nhà trước, giữ ~8 lính) 69% · Kinh tế 14% · Quân sớm 8% · Lai (quân trước) 9% |
| 2 đấu 2 | quân sớm vs quân từ lượt 6: 52% · gương: 51% |

→ Không lối THUẦN nào áp đảo; người **cân cả nhà lẫn quân** mạnh nhất (đúng ý đồ). Ô cấp 1 cạn sau ~2.5 lượt có quân.
Đã đưa vào engine (`CFG.nhaTang = 0.1`, `CFG.kp[*].K.cc`) và iPad hiện giá nhà tăng dần.

## 17. Đổ xúc xắc lần lượt + màn iPad (CEO 24/09)

- **Đổ LẦN LƯỢT, xoay vòng:** lượt t người đổ đầu = (t−1) mod n (lượt 5: A→B→C→D, lượt 6: B→C→D→A). Người tới phiên bấm "🎲 ĐỔ" trên iPad; 10 giây không bấm thì TV đổ hộ.
  Người đổ đầu cũng là người ưu tiên khi tranh chỗ xây.
- **Lúc đang đổ, iPad mọi người chỉ còn màn đổ:** bảng thứ tự + kết quả từng lần (xúc xắc, ô trúng, ai *sẽ nhận* bao nhiêu). TV quay xúc xắc to giữa màn, ô trúng số sáng lên.
- **Tài nguyên cộng MỘT LẦN khi cả vòng đổ xong** (xúc xắc + số 7 + thu bị động), TV hiện bảng "Thu hoạch lượt" rồi mới mở giờ thao tác.
- **iPad: chạm vào bất cứ thứ gì trên bàn đều có bảng giải thích** — ô đất (xác suất ra số, thu TB/lượt, nhà nào đang ăn), ô khám phá (cấp, quái yếu/khắc, kho còn lại, cách tính %, trần lính, luật chiến tranh, mình có lối vào chưa + nút gửi quân), nhà (cấp, nhánh, sản lượng, nâng cấp), chỗ trống (đặt được không, vì sao), đường, cảng. Nút **❓ Luật** tóm tắt toàn bộ luật.
- ⚠️ Thời lượng: mỗi lượt thêm ~4 × (3–13s) cho phần đổ → ván 25 lượt dài thêm ~6–12 phút. Chơi thử rồi chỉnh `ROLLWAIT` (TV) nếu dài.
- **Đầu ván: đổ chọn thứ tự đặt nhà** (luật Catan gốc, CEO 24/09): mỗi người đổ **1 lần** (lần lượt, TV đổ hộ nếu quá 10s), điểm cao nhất chọn chỗ đặt nhà trước;
  **hoà thì máy bốc ngẫu nhiên** (không đổ lại — cho nhanh). Đặt 2 vòng kiểu rắn: 1→n rồi n→1, nhà thứ 2 nhận ngay tài nguyên ô kề.
