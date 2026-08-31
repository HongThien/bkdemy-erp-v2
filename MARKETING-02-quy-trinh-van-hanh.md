# Marketing BKdemy — Quy trình vận hành hàng tuần

> **Mục tiêu:** 300 → 600 HS. Tự nhiên đạt ~450 ⇒ **marketing phải tạo thêm ~150 HS**.
> **Cửa chính:** Toán, cấp 2. **Địa bàn:** Geleximco (khu A), Gemek 1–2, Golden, nhà dân quanh Lê Trọng Tấn.
> **Ngày:** 31/08/2026 · Chốt giữa CEO (Thùy) và CTO (Claude).

---

## 0. Nguyên tắc thiết kế — đọc trước, đây là lý do plan viết kiểu này

**Nút thắt của BK là năng lực RA QUYẾT ĐỊNH, không phải nhân lực.** Nhiều nhân sự trẻ có thời gian, không ai đủ sức lead. Vậy nên:

1. **Không việc nào được đòi phán đoán.** Mỗi việc phải có: dấu hiệu kích hoạt (lấy từ ERP) → hành động → mẫu câu → cách biết là xong.
2. **Việc TỰ HIỆN RA, không ai giao.** Áp đúng mô hình §4 CLAUDE.md: việc = chênh lệch **(must-exist)** vs **(does-exist)**. Chiến dịch thì hết hơi sau 6 tuần; invariant thì mỗi sáng tự có danh sách.
3. **Mỗi luồng đúng MỘT người chịu trách nhiệm.** "Cả đội làm" = không ai chịu. Người khác phụ, nhưng tên người chịu là một.
4. **Material sinh từ SỰ KIỆN THẬT trong ERP, không sinh từ lịch đăng bài.** Cùng logic §4: không đẻ row rỗng để lấp chỗ trống. Không đẻ nội dung rỗng để lấp lịch.
5. **Mỗi lần chạm phụ huynh phải mang một sự thật cụ thể về con họ mà họ chưa biết.** Không có sự thật cụ thể thì **không chạm**. Hỏi thăm chung chung tốn thời gian và sinh 0 referral.

---

## 1. Ba luồng và người chịu trách nhiệm

| Luồng | Vai trò cần | Trọng số | Ghi chú |
|---|---|---|---|
| **A — CSKH → Referral** | 1 người chịu (ưu tiên nhân sự tâm lý) + OPS/TA phụ | **60%** | Trục chính. Chạy ngay tuần 1 |
| **B — Material (vật chứng)** | 1 người chịu (GenZ dựng video) | 25% | Nuôi cả A và C |
| **C — Community** | 1 người chịu | 15% → tăng dần | Mở khi đủ hạt nhân |

*(Fanpage + ads do QuangDh phụ trách — nằm ngoài plan này, nhưng xem §6 về điểm khớp bắt buộc.)*

---

## 2. LUỒNG A — CSKH → Referral (trục chính)

### 2.1 Vì sao đây là trục

**Referral không sinh ra từ "hài lòng" — sinh ra từ "có chuyện để kể".**

Phụ huynh hài lòng lặng lẽ không giới thiệu ai: không có dịp, không có gì bật ra. BK đang kẹt đúng đó — chất lượng cao, phụ huynh hài lòng, nhưng trao đổi "hơi khô" nên không có khoảnh khắc, không có chuyện, referral chỉ chạy khi tình cờ có người hỏi.

CSKH của BK **không phải chăm sóc cho ấm — là nhà máy sản xuất khoảnh khắc.**

Và BK có nguyên liệu không trung tâm nào có: đo theo **dạng**, nên nhắn được câu cụ thể thay vì lời khen chung. Phụ huynh kể lại câu đó cho người khác **không phải vì nó khen BK, mà vì nó làm họ tự hào về con mình** — người ta chia sẻ thứ làm chính họ trông tốt (*social currency*, Jonah Berger).

### 2.2 Invariant CSKH — việc tự hiện ra

Ghi theo §1.5: **chỉ tạo dòng khi đã chạm THẬT**. Không insert trước điền sau. Thiếu chạm = không có dòng, không phải dòng NULL.

| Mã | Quy tắc | Thiếu ⇒ |
|---|---|---|
| **R-CS1** | ∀ HS đang học ⇒ ∃ ≥1 lần chạm có nội dung cụ thể trong **30 ngày** gần nhất | task, có owner |
| **R-CS2** | ∀ báo cáo tháng đã công bố (`bao_cao_ph.cong_bo_at`) ⇒ ∃ 1 lần gửi + 1 lần hỏi phản hồi trong **72h** | task |
| **R-CS3** | ∀ ca `bo_tro_yeu` đóng có kết quả tốt ⇒ ∃ 1 tin báo PH trong **48h** | task |
| **R-CS4** | ∀ `canh_bao_yeu` mới ⇒ ∃ 1 tin báo PH trong **48h**, kèm kế hoạch xử lý | task |

→ Mỗi sáng OPS mở màn hình, thấy **danh sách phải chạm hôm nay**. Không ai phải nhớ, không ai phải giao.

### 2.3 Bốn loại điểm chạm — kích hoạt → nội dung

| Kích hoạt (từ ERP) | Trong | Nội dung |
|---|---|---|
| Báo cáo tháng công bố | 24h | Gửi ảnh báo cáo + **1 câu diễn giải bằng tiếng người** + 1 câu hỏi mở |
| Ca bổ trợ đóng, kết quả tốt | 48h | *"Trước bé bỏ trống dạng X, giờ làm được Y/Z"* |
| **Cảnh báo yếu mới (tin xấu)** | 48h | Báo sớm + đã có kế hoạch bổ trợ |
| Level up / mốc Elo | 1 tuần | Tin vui ngắn, kèm ảnh |

**⭐ Dòng thứ ba là dòng quan trọng nhất và phản trực giác nhất.** Chủ động báo tin xấu **trước khi phụ huynh tự phát hiện** là thứ xây lòng tin mạnh nhất, và gần như không trung tâm nào dám làm. Nó nói: *chúng tôi nhìn thấy con chị, và chúng tôi nói thật.* Trung tâm khác chỉ báo tin tốt — phụ huynh biết thừa, nên tin tốt của họ bị chiết khấu hết.

**Mẫu câu — bắt buộc dùng, không tự chế:**
- ❌ *"Chị thấy bé học ổn không ạ?"* → phụ huynh trả lời "ổn em ạ", hết chuyện, 0 giá trị.
- ✅ *"Chị ơi, ba tháng trước bé Minh gặp dạng phương trình chứa tham số là bỏ trống. Tháng này làm đúng 7/8 câu. Em muốn chị biết."*

### 2.4 Quy trình đề nghị giới thiệu

**Luật cứng: chỉ đề nghị SAU một khoảnh khắc tốt. TUYỆT ĐỐI không đề nghị lúc thu học phí.**

Ba thời điểm hợp lệ:
1. Sau khi PH phản hồi tích cực về báo cáo tháng
2. Sau khi báo tin ca bổ trợ đóng thành công
3. Sau kỳ thi con làm tốt

**Cách nói — mở cửa, không xin:**
> *"Chị có ai quanh khu đang tìm chỗ cho con không? Lớp [X] tháng này em còn 2 chỗ, em để dành."*

Khan hiếm ở đây **là sự thật** (lớp nhỏ là chủ ý), nên nói được mà không phải diễn.

**Thưởng hai chiều:** người giới thiệu **và** người được giới thiệu cùng có lợi. Một chiều thì người giới thiệu thấy mình đang đi bán hàng hộ. Cơ chế đã có sẵn: dòng `giam_gioi_thieu` trong hoá đơn.

---

## 3. LUỒNG B — Material = vật chứng, không phải content

### 3.1 Nguyên liệu có sẵn, không cần nghĩ ra

ERP tự đẻ mỗi ngày: báo cáo tháng · cảnh báo yếu · ca bổ trợ đóng · level up · Elo · thành tích ghim.
**Việc của luồng B là LẤY RA và đóng gói, không phải NGHĨ RA.**

### 3.2 Một nguyên liệu — ba đầu ra

Một buổi quay / một sự kiện dùng ba chỗ:
1. **Gửi 1-1 qua Zalo** cho PH đang cân nhắc ← quan trọng nhất
2. **Đăng FB cá nhân của Thùy** + fanpage
3. **Cắt dọc đăng TikTok**

**Không có dây chuyền TikTok riêng.** TikTok là nơi đăng lại, không phải nguồn công việc. Đăng đều thì tốt, nhưng nó là **sản phẩm phụ**, không được phép hút giờ của luồng A.

### 3.3 Vì sao ưu tiên gửi 1-1, không phải đăng

Nhóm cư dân quanh Geleximco/Gemek phần lớn không sống (đúng nhận định của CEO: không có nội khu ăn uống nên không có chủ đề thương mại để nuôi group). **Truyền miệng ở khu này diễn ra offline** — sảnh, thang máy, đưa đón chung. Truyền miệng offline cần thứ **forward được 1-1 qua Zalo**, không cần bài đăng.

### 3.4 ⭐ Chỗ DUY NHẤT phải thuê ngoài

Đội không có ai chuyên design. Nghiệp dư chấp nhận được ở **video** — thầy cô giải thích, khoảnh khắc lớp học thật, quay màn hình; thô ráp đọc thành chân thật.

**Nhưng KHÔNG chấp nhận được ở một thứ: template ảnh báo cáo tháng (`anh_bao_cao_url`).**

Vì đó chính là **vật phụ huynh cầm đi khoe**. Nó là bộ mặt của sản phẩm. Không ai forward một thứ trông rẻ tiền — kể cả khi nội dung bên trong xuất sắc. Thuê designer làm template **một lần**, dùng mãi. Đây là khoản chi đáng nhất trong toàn bộ plan.

---

## 4. LUỒNG C — Community

### 4.1 Vì sao đáng làm

Khu An Khánh chỉ đủ chỗ cho **một** group phụ huynh thực sự sống. Ai lập trước và nuôi được thì **sở hữu cái mặt bằng** nơi mọi phụ huynh trong vùng đi hỏi "cho con học ở đâu". Đây là tài sản có phòng thủ — khác fanpage và TikTok, hai thứ ai cũng lập được cái thứ hai.

### 4.2 Điều kiện mở — chặn bởi HẠT NHÂN, không phải bởi lịch

**Chỉ mở group khi có ≥15–20 phụ huynh BK sẵn sàng lên tiếng.** Hạt nhân đó do luồng A tạo ra.

Mở sớm khi chưa có hạt nhân ⇒ group im lặng mà admin là trung tâm ⇒ đọc ra ngay là fanpage trá hình ⇒ không ai ở lại. **Và group chết không lập lại được** — người đã vào, thấy vắng, out ra thì lần sau không vào nữa. Đây là mũi duy nhất trong ba mũi có **chi phí thất bại vĩnh viễn**.

### 4.3 Ba luật khi mở

1. **Tên group KHÔNG mang tên BK.** Kiểu *"Phụ huynh An Khánh — đồng hành cùng con"*. Group mang tên trung tâm thì không ai coi là chỗ trung lập.
2. **Cấm quảng cáo — kể cả của BK.** Chính luật này làm group đáng tin. BK thắng bằng cách **làm chủ sân**, không phải bằng cách rao trên sân.
3. **Nuôi bằng nội dung tiện ích:** lịch thi, đề + đáp án, thống kê điểm chuẩn, giải đáp thắc mắc. Không bao giờ bằng bài bán hàng.

### 4.4 Test rẻ trước (tuần 3–4)

Trước khi lập group thật: thả 1–2 nội dung tiện ích vào group cư dân còn thoi thóp và group phụ huynh sẵn có. Xem có ai tương tác không. Rẻ, và trả lời được câu "dân khu này có sinh hoạt group về chủ đề học hành không".

---

## 5. Vá khâu kiểm chứng — làm MỘT LẦN, tuần 1

Tra "BKdemy" trên mạng hiện ra **gần như không có gì** (tên "BK" còn bị nuốt bởi Bách Khoa). Nghĩa là người **đã được giới thiệu** đi kiểm chứng thì rụng im lặng — mất lead sau khi đã tốn công có được nó. Đây là rò rỉ, rẻ hơn nhiều so với đi kiếm thêm reach.

- [ ] Website: có trang nói rõ BK là ai, dạy gì, ở đâu, khác gì — kèm ảnh báo cáo mẫu
- [ ] **Zalo OA: bật và dùng thật** (đang có mà chưa dùng) — đây là kênh chạm 1-1 chính
- [ ] Google Maps: xin review từ phụ huynh hài lòng (đã có điểm, thiếu review)
- [ ] Fanpage: ghim 3 bài chứng minh — báo cáo mẫu, một ca bổ trợ, một lời phụ huynh

---

## 6. Điểm khớp bắt buộc với QuangDh

QuangDh chạy fanpage + ads. Một câu hỏi phải chốt trước khi tiêu đồng nào: **ads dẫn về đâu?**

Đổ traffic vào fanpage đẹp mà không có gì chứng minh = trả tiền đổ nước vào thùng thủng. §5 phải xong trước khi ads bật.

---

## 7. Đo — bốn con số, không hơn

| # | Chỉ số | Vì sao |
|---|---|---|
| 1 | HS mới/tháng **theo nguồn** | Không có cái này thì 3 tháng nữa cãi nhau bằng cảm giác |
| 2 | % HS có ≥1 lần chạm trong 30 ngày | Đo **việc** — biết ngay tuần này, không phải chờ 3 tháng |
| 3 | Số **lời giới thiệu** thật/tháng | Đếm lời giới thiệu, không đếm HS. Đây là biến số thật |
| 4 | Tỷ lệ giới thiệu → nhập học | Biết nút thắt ở đầu vào hay ở khâu chốt |

**Chặn ở đây:** `hoc_sinh` hiện **không có cột nguồn**. Cần bổ sung chỗ ghi *"biết BK qua ai/đâu"* + *"ai giới thiệu"*, và một chỗ ghi các lần chạm CSKH.
→ Việc kỹ thuật, cần một vòng thiết kế riêng theo §1.5 (chỉ ghi dòng khi có thật) và §1.6 (dữ liệu học tập phải có nhãn `mon` — cần quyết: một lần chạm là theo môn hay theo cả đứa trẻ).

---

## 8. Lịch tuần

| Khi | Ai | Việc |
|---|---|---|
| Mỗi sáng | OPS | Mở danh sách chạm hôm nay (R-CS1..4), làm hết |
| Trong ngày | CSKH | Chạm theo mẫu câu; ghi lại lần chạm **đã xảy ra** |
| Thứ 3 | Material | Lấy 1 nguyên liệu từ ERP tuần trước → dựng → 3 đầu ra |
| Thứ 5 | Thùy | Viết 1 bài FB cá nhân (thứ mày vốn đang nghĩ, không cần nghĩ thêm) |
| Thứ 6 | Người chịu luồng A | Rà: PH nào vừa có khoảnh khắc tốt → đưa vào danh sách đề nghị giới thiệu tuần sau |
| Cuối tuần | Thùy | Xem 4 con số. **15 phút, không họp dài** |

---

## 9. Tuần 0 — phải xong trước khi bắt đầu

1. [ ] **Xác nhận `bao_cao_ph` đang gửi ĐỀU hàng tháng.** Toàn bộ luồng A đứng trên cái này. Nếu đang chập chờn thì việc tuần 1 là làm nó chạy đều, không phải CSKH.
2. [ ] Chốt tên người chịu từng luồng (một tên, không phải "đội")
3. [ ] Bổ sung chỗ ghi nguồn HS + người giới thiệu
4. [ ] Thuê designer làm template ảnh báo cáo
5. [ ] Viết bộ mẫu câu cho 4 loại điểm chạm — đội non phải có sẵn chữ, không tự chế

---

## 10. Giả định và rủi ro

**Giả định chưa xác nhận:** `bao_cao_ph` gửi đều hàng tháng. Sai ⇒ đổi thứ tự tuần 1.

**Rủi ro 1 — CSKH trượt thành hỏi thăm chung chung.** Đây là cách chết phổ biến nhất. Chặn bằng luật §0.5: không có sự thật cụ thể thì không chạm.

**Rủi ro 2 — mở community quá sớm.** Chi phí thất bại vĩnh viễn. Chặn bằng điều kiện hạt nhân §4.2.

**Rủi ro 3 — TikTok hút giờ khỏi luồng A.** Chặn bằng luật: TikTok chỉ nhận đầu ra có sẵn, không được sinh việc riêng.

**Rủi ro 4 — "ruồi bu": nhiều người, không ai chịu.** Chặn bằng một tên cho mỗi luồng.

**Chưa giải quyết trong plan này:** định giá. BK đang rẻ hơn MathExpress dù lớp nhỏ hơn, và chưa ai chê đắt mà bỏ — dấu hiệu định giá dưới biên. Trong thị trường credence good, giá cũng là một tín hiệu chất lượng. Cần một vòng bàn riêng, không gộp vào đây.
