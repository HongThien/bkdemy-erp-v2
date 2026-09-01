# Hệ thống Quản trị Referral — Kiến trúc tầng logic

> **Trạng thái:** đề xuất kiến trúc, chưa phải spec build.
> **Ngày:** 01/09/2026 · Sparring/Planning · CEO (Thùy) chốt · CTO (Claude) đề cách đi.
> **Bối cảnh:** BK 300 HS, tăng trưởng ~100% từ referral tự phát, chưa từng có quy trình.
> Đích: 600 HS (tự nhiên ~450 ⇒ marketing tạo ~150).

---

## 0. Nhận định gốc

Cái BK cần **không phải một chương trình referral**, mà là **một hệ thống quản trị quan hệ phụ huynh có referral là đầu ra**.

Khác biệt: chương trình thì có ngày bắt đầu và ngày hết hơi. Hệ thống thì chạy liên tục, tự sinh việc, và **cải thiện chính nó bằng dữ liệu nó tạo ra**.

Và tin tốt: **bài toán này đã được giải triệt để ở ngành khác.** BK không cần phát minh, chỉ cần dịch sang bối cảnh giáo dục.

---

## 1. Ba mô hình thế giới — cái nào giải phần nào

### 1.1 Customer Health Score + Playbook (B2B SaaS Customer Success)
*Gainsight · Planhat · Totango · Velaris*

**Giải đúng phần "đo thông số + đánh cờ + ma trận hành động".** Cấu trúc chuẩn của ngành:

| Thành phần | Nội dung |
|---|---|
| **Health score** | Gộp nhiều tín hiệu (mức dùng sản phẩm · mức tương tác · lịch sử hỗ trợ · phản hồi · cảm xúc) thành điểm |
| **Risk bands** | Dải điểm → mức rủi ro. Rơi vào dải thấp ⇒ **can thiệp bắt buộc**, không phải tuỳ nghi |
| **Playbook** | Với mỗi tình huống: *sự kiện kích hoạt · mục tiêu đo được · danh sách bước có thứ tự · người chịu mỗi bước* |
| **CTA (Call To Action)** | Điểm rơi ngưỡng ⇒ **tự sinh việc có người chịu**, không phải cảnh báo trên dashboard rồi thôi |
| **Escalation** | Rủi ro cao ⇒ leo thang: review cấp trên · tìm gốc rễ · kế hoạch hồi phục có mốc |

> **Câu quan trọng nhất của ngành này:** *"biến health score từ một con số trên dashboard thành một hành động"*. Đây đúng chỗ 90% chương trình chăm sóc chết.

### 1.2 Net Promoter System — Closed Loop (Bain)
*Không phải "đo NPS", mà là hệ vận hành quanh nó*

**Giải đúng phần "hệ thống response".** Ba nhóm, ba cách đối xử **khác hẳn nhau**:

| Nhóm | Cách xử | SLA |
|---|---|---|
| **Promoter** | Kích hoạt: xin giới thiệu / đánh giá | không gấp |
| **Passive** | Hỏi đúng một câu: *"thiếu gì để thành 9–10?"* | vừa |
| **Detractor** | Gọi gấp, tìm **gốc rễ**, theo dõi hồi phục | **24h** |

Bốn trụ để nó chạy được: *thu tín hiệu real-time · định tuyến tự động · hiển thị tức thì · người thực thi được trao quyền hành động không cần xin phép*.

**⭐ Inner loop vs Outer loop** — chỗ 90% doanh nghiệp chỉ làm một nửa:
- **Inner loop** = xử từng ca. Gọi PH đang bực, giải quyết, đóng.
- **Outer loop** = **gom nguyên nhân của tất cả các ca lại, sửa gốc.** Nếu 8/20 PH phàn nàn cùng một chuyện thì đó không phải 8 ca chăm sóc, đó là **1 lỗi sản phẩm**.

Làm inner mà bỏ outer = mãi mãi chữa triệu chứng, chi phí chăm sóc tăng đều theo số HS.

### 1.3 Referral / Advocacy Platform
*Ambassador · impact.com/advocate · BrandChamp · Mention Me*

**Giải đúng phần "quy kết và đo".** Các khối chuẩn:

- **Onboarding người giới thiệu** — không mặc định ai cũng biết phải làm gì; phải trang bị
- **Cấp "tài sản" cho họ** — thứ để đưa, không phải lời để nói
- **Attribution nhiều giai đoạn** — theo dõi cả chuỗi *chia sẻ → biết đến → đăng ký → thành khách*, không chỉ đếm kết quả cuối
- **Tự động hoá phần thưởng** — trả đúng, đúng lúc, không tốn công vận hành
- **Chống gian lận**
- **Nhắc theo nhịp** — lời mời · xác nhận thưởng · nhắc lại khi nguội, đúng kênh đúng lúc

### 1.4 Các trung tâm Việt Nam đang ở đâu
*DotB · EasyEdu · CenterOnline · MISA EMIS*

Đã có: quản lý lead tuyển sinh · **đặt lịch chăm sóc + nhắc việc** · **SMS tự động khi kết quả học sụt** · 40+ mẫu báo cáo.

**Chưa có ở bất kỳ đâu tao tìm được:** health score của phụ huynh · ma trận hành động theo điểm · attribution referral nhiều giai đoạn.

→ Tức các trung tâm VN đang ở tầng **CRM + nhắc việc**, chưa lên tầng **hệ thống quản trị quan hệ**. Nếu BK làm được thì đây là khoảng cách thật, không phải khác biệt trên slide.

---

## 2. Kiến trúc đề xuất cho BK — 7 khối

```
M1 Sổ tín hiệu  →  M2 Bộ chấm & cờ  →  M3 Ma trận  →  M4 Hàng đợi việc
                          ↑                                    ↓
                    M7 Bộ đo  ←──── M6 Sổ giới thiệu ←── M5 Sổ tương tác
```

### M1 — SỔ TÍN HIỆU
Ghi tín hiệu **thô** về mỗi PH. Hai nguồn: tự động từ ERP · điền tay.

**⭐ Luật cốt lõi: LƯU TÍN HIỆU THÔ, KHÔNG LƯU ĐIỂM.**
Công thức chấm sẽ đổi ít nhất 3–4 lần trong 6 tháng đầu. Lưu điểm thì mỗi lần đổi công thức là **mất sạch lịch sử** — không so được tháng này với tháng trước. Lưu thô thì chấm lại toàn bộ quá khứ bằng công thức mới bất cứ lúc nào.

Đây đúng nguyên tắc §1 của BK: *mastery KHÔNG lưu — suy động từ mọi lần đo*. Áp y hệt.

Theo §1.5: chỉ ghi dòng khi có tín hiệu **thật**. Chưa hỏi ⇒ **không có dòng**, không phải dòng NULL.

### M2 — BỘ CHẤM & ĐÁNH CỜ
Suy động từ M1, **không lưu kết quả**. Theo §2.0: mọi phép tính nghiệp vụ nằm ở Postgres (`fn_*`), client chỉ gọi hàm.

Đầu ra mỗi PH:
- **Điểm A%** (hài lòng) · **Điểm B%** (cơ hội) — tính theo **tỷ lệ trên các mục ĐÃ điền**
- **Độ phủ %** — bao nhiêu mục đã có dữ liệu
- **Danh sách cờ** — đỏ (rủi ro) và xanh (vị thế cộng đồng)
- **Chuẩn hoá theo lớp** — so với trung vị lớp của con, không so toàn trung tâm

**Độ phủ < 50% ⇒ điểm KHÔNG dùng để hành động.** Thiếu data = độ tin thấp, khác điểm thấp (§5).

### M3 — MA TRẬN HÀNH ĐỘNG
Ánh xạ **(ô trong ma trận + cờ) → playbook**. Chi tiết ở §3.

### M4 — HÀNG ĐỢI VIỆC
**Việc = (playbook đang đòi) TRỪ (đã làm).** Thuần tính, đúng §4 — **không có bảng `tasks`, không đẻ row chờ**.

OPS mở màn hình thấy: hôm nay gọi ai · playbook nào · SLA còn bao lâu · lấy dữ liệu ở đâu · nói câu gì.

### M5 — SỔ TƯƠNG TÁC & ĐÓNG VÒNG
Ghi mỗi lần chạm **đã xảy ra**: ai · khi nào · kênh · nội dung · kết quả · nhãn mới.

**Mỗi playbook phải có điều kiện đóng rõ ràng.** Chạm xong không phải là đóng — đóng là khi **xác nhận được kết quả**: PH đã hài lòng lại, hoặc đã nhận lời giới thiệu, hoặc đã chuyển nhóm.

### M6 — SỔ GIỚI THIỆU & QUY KẾT
**Khối BK đang thiếu hoàn toàn.** Theo dõi cả chuỗi, không chỉ kết quả cuối:

```
lời mời được đưa ra
  → người được giới thiệu biết đến BK
    → đăng ký test chẩn đoán
      → đến test
        → nhập học
          → còn học sau 3 tháng
```

Mỗi HS mới phải trỏ về **người giới thiệu**. Không có mắt xích này thì mọi con số ở M7 đều là phỏng đoán.

**Quyết định quan trọng — thưởng ở giai đoạn nào:** thưởng lúc *nhập học* khuyến khích giới thiệu bừa; thưởng lúc *còn học sau 3 tháng* khuyến khích giới thiệu đúng người, nhưng phản hồi chậm nên động lực yếu. Có thể chia hai đợt.

### M7 — BỘ ĐO
Chi tiết ở §5.

---

## 3. Ma trận hành động

**Xét cờ trước, luôn luôn.** Cờ đỏ ghi đè mọi điểm số.

| | Cơ hội cao (B ≥ 50%) | Cơ hội thấp (B < 50%) |
|---|---|---|
| **Hài lòng cao** (A ≥ 60%) | **P1 — Kích hoạt** | **P2 — Giữ ấm** |
| **Hài lòng giữa** (35–60%) | **P3 — Nuôi** ⭐ | **P4 — Duy trì** |
| **Hài lòng thấp** (< 35%) | **P5 — Chẩn đoán** | **P5 — Chẩn đoán** |
| **Có cờ đỏ** | **P0 — Cứu** (ghi đè tất cả) | **P0 — Cứu** |
| **Có cờ xanh B1** | **nâng một bậc ưu tiên**, bất kể ô nào | |
| **Độ phủ < 50%** | **P6 — Đi điền** (chưa xếp được) | |

### Bảy playbook

| Mã | Tên | Kích hoạt | Mục tiêu | SLA | Điều kiện ĐÓNG |
|---|---|---|---|---|---|
| **P0** | Cứu | có cờ đỏ | chặn nghỉ | **48h** | PH xác nhận đã ổn **và** cờ đỏ tắt sau 30 ngày |
| **P1** | Kích hoạt | A cao + B cao | 1 hành động giới thiệu cụ thể | 2 tuần | có lời mời **được đưa ra thật**, ghi vào M6 |
| **P2** | Giữ ấm | A cao + B thấp | giữ quan hệ, không ép | 1 tháng | đã chạm có nội dung |
| **P3** | **Nuôi** | A giữa + B cao | **nâng A lên cao** | 1 tháng | A tăng ≥1 bậc, hoặc rõ lý do không tăng được |
| **P4** | Duy trì | A giữa + B thấp | không tụt | 2 tháng | đã chạm |
| **P5** | Chẩn đoán | A thấp | **hiểu vì sao** | 2 tuần | biết được nguyên nhân → chuyển P0 hoặc P3 |
| **P6** | Đi điền | độ phủ < 50% | có đủ dữ liệu | 2 tuần | độ phủ ≥ 50% |

**⭐ P3 là playbook quan trọng nhất và dễ bị bỏ quên nhất.** Đây là phụ huynh **ở đúng chỗ để giới thiệu nhưng chưa đủ lý do** — ở Gemek 1 cùng 20 nhà có con cùng tuổi, mà A mới 45%. Nâng A của họ lên có giá trị gấp nhiều lần nâng A của một người không quen ai. Nhìn bằng điểm tổng thì họ chìm nghỉm ở giữa bảng.

**Ánh xạ sang mô hình Bain:** P1 ≈ Promoter (kích hoạt) · P3/P4 ≈ Passive (*"thiếu gì để thành 9–10?"*) · P0 ≈ Detractor (24–48h, gốc rễ, theo dõi hồi phục).

---

## 4. Hệ thống response

### 4.1 Bốn trụ (từ Net Promoter System)
1. **Thu tín hiệu liên tục** — không phải khảo sát mỗi quý
2. **Định tuyến tự động** — tín hiệu tự rơi vào đúng playbook, không ai phải phân công
3. **Hiển thị tức thì** — OPS thấy việc của mình ngay, không phải hỏi
4. **Người thực thi được trao quyền** — có mẫu câu và **hạn mức xử lý sẵn** (miễn 1 buổi, tặng suất bổ trợ…) để không phải xin phép giữa cuộc gọi. Đây là chỗ chết phổ biến: PH đang bực, nhân viên phải "để em hỏi lại sếp" ⇒ mất luôn khoảnh khắc.

### 4.2 Luật đóng vòng
- Mỗi ca phải **đóng có kết quả**, không đóng bằng "đã gọi rồi"
- Sau khi đóng, **theo dõi 30 ngày** xem PH có chuyển nhóm không — đó mới là bằng chứng playbook có tác dụng
- Ca không đóng được trong 2× SLA ⇒ **leo thang lên CEO**

### 4.3 ⭐ Outer loop — phần không được bỏ
Mỗi tháng, gom **nguyên nhân** của tất cả ca P0 và P5 lại và xếp hạng.

Nếu 8/20 ca cùng một nguyên nhân thì đó **không phải 8 ca chăm sóc — đó là 1 lỗi sản phẩm**, và phải vào backlog kỹ thuật/vận hành, không phải backlog CSKH.

Bỏ outer loop thì chi phí chăm sóc tăng tuyến tính theo số HS, mãi mãi.

---

## 5. Bộ đo

### 5.1 Phễu referral (M6 — chỉ số chính)
| Tầng | Số | Ý nghĩa |
|---|---|---|
| Lời mời được đưa ra / tháng | | **biến thật của luồng này** — số miệng, không phải số mắt |
| → người được giới thiệu liên hệ | | chất lượng lời mời |
| → đến test chẩn đoán | | sức hút của vé vào cửa |
| → nhập học | | năng lực chốt |
| → còn học sau 3 tháng | | chất lượng người được giới thiệu |

### 5.2 Sức khoẻ hệ thống
| Chỉ số | Vì sao |
|---|---|
| **% PH có ≥1 lần chạm trong 30 ngày** | đo VIỆC — biết ngay tuần này, không phải chờ 3 tháng |
| **Độ phủ dữ liệu trung bình** | dưới 50% thì mọi xếp hạng là tự lừa mình |
| **Số PH chuyển ô mỗi tháng** (P3→P1) | **chỉ số sức khoẻ thật của chăm sóc** |
| % ca đóng đúng SLA | kỷ luật vận hành |
| Tỷ lệ PH đã từng giới thiệu (luỹ kế) | mục tiêu dài hạn: từ ~10–15% lên 40%+ |

### 5.3 Chỉ số BẮC ĐẨU
**Tỉ lệ phụ huynh giới thiệu ít nhất 1 người trong 12 tháng.** Ngành để tự nhiên nằm ở 5–15%; có hệ thống chủ động thì 40–60%. **Đây là con số duy nhất đáng treo lên tường.**

---

## 6. BK mạnh hơn / yếu hơn platform ở đâu

| | Platform referral (Ambassador, impact.com) | BK |
|---|---|---|
| Attribution, thưởng tự động, chống gian lận | ✅ trưởng thành | ❌ chưa có (M6) |
| **Biết khách có thật sự hài lòng không** | ❌ chỉ đoán từ hành vi mua | ✅ **có dữ liệu kết quả học thật** |
| Nội dung để người giới thiệu đưa đi | ⚠️ mã giảm giá, link | ✅ **báo cáo năng lực theo dạng** |

→ **Health score của BK mạnh hơn của mọi platform referral trên thị trường**, vì họ chỉ suy từ hành vi mua, còn BK đo được kết quả thật của đứa trẻ. Cái BK thiếu là **đường ống quy kết (M6)** — mà đó là phần dễ nhất trong cả kiến trúc.

---

## 7. CEO cần chốt

1. **Lưu tín hiệu thô hay lưu điểm?** (đề xuất: thô — xem M1)
2. **Thưởng referral ở giai đoạn nào** — nhập học, hay còn học sau 3 tháng, hay chia hai đợt?
3. **Ai sở hữu playbook nào?** P0 cần người cứng nhất; P6 ai cũng làm được
4. **Chu kỳ chấm lại: tuần hay tháng?**
5. **Hạn mức trao quyền cho người gọi** — được tự quyết đến đâu mà không phải hỏi? (trụ số 4 của hệ response)
6. **Có làm outer loop không** — nếu có, ai chủ trì buổi tổng hợp nguyên nhân hàng tháng?

## 8. Chưa giải quyết trong tài liệu này
- Nội dung cụ thể từng playbook (mẫu câu, kịch bản) — vòng sau
- Thiết kế bảng/schema — cần vòng riêng theo §1.5, §1.6 (câu phải quyết: một lần chạm gắn nhãn `mon` hay gắn cả đứa trẻ?)
- Định giá — vẫn treo từ tài liệu 01

---

## Nguồn
[Gainsight — Customer Health Scores](https://www.gainsight.com/blog/customer-health-scores/) · [Planhat — CS Playbooks](https://www.planhat.com/customer-success/playbooks) · [Velaris — Health Score Template](https://www.velaris.io/articles/how-to-create-a-customer-health-score-template) · [CustomerGauge — Closing the Loop with NPS](https://customergauge.com/benchmarks/blog/4-ways-to-close-the-loop-with-net-promoter) · [Zonka — Inner Loop in Net Promoter System](https://www.zonkafeedback.com/blog/inner-loop-in-net-promoter-system) · [Sopact — NPS Detractor Workflow](https://www.sopact.com/use-case/nps-detractor) · [impact.com/advocate](https://impact.com/advocate/) · [Ambassador](https://getambassador.com/referralmarketing) · [BrandChamp](https://brandchamp.io/platform/referral-sales-tracking/) · [DotB — CRM trung tâm](https://dotb.vn/news/crm-cho-trung-tam-ngoai-ngu/) · [EasyEdu — CRM giáo dục](https://easyedu.vn/phan-mem-crm-cho-trung-tam-giao-duc-dao-tao/) · [MISA EMIS](https://emis.misa.vn/emis-kindergarten/phan-mem-quan-ly-trung-tam-nang-khieu/)
