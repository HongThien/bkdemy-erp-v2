# Nông Trại BK — NHỊP NGÀY (kiểu Nông trại vui vẻ / Khu vườn trên mây)

> **Nguồn thiết kế duy nhất** cho bản nhịp ngày. CEO chốt qua 2 buổi sparring 29–30/09/2026. Diễn biến quyết định ở DEVLOG 29/09 tối và 30/09.
> Số liệu ghi **TỰ ĐẶT** = số khởi điểm để chạy thử. Chỉnh sau khi bot giả lập + chơi thật. **Trần xu là số CEO đã chốt.**
> Bản demo nhịp Hay Day cũ vẫn giữ nguyên ở nhánh `main` của repo NongTrai (mục 9).

---

## 1. Mục tiêu và lý do

- **Mục tiêu (CEO):** tăng thời gian HS ở trong app, biến việc vào app thành **thói quen và cảm hứng mỗi ngày**. Chấp nhận mất tiền (xu thật) giai đoạn đầu, cân đối sau.
- **Nhịp:** HS vào **1 lần/ngày**. Đi học ban ngày, về mới vào. **Một phiên 10–15 phút.**
- **Vì sao không theo Hay Day:** Hay Day cần vào nhiều lần trong ngày (chuỗi máy → hàng → đơn). Nông trại vui vẻ và Khu vườn trên mây dùng **appointment mechanic**: cây chín theo ngày, game hẹn HS quay lại hôm sau.
- **Nối với việc học mà không bắt học trong game:** hạt giống mua được bằng **điểm chăm chỉ** kiếm từ làm bài. Cùng họ với Habitica (việc thật đổi ra vàng/EXP trong game) và Prodigy (game toán).
- **Thưởng NỖ LỰC, không thưởng điểm số** (Carol Dweck, growth mindset): em trung bình chịu làm vẫn có hạt.
- **HS được chọn** trả bằng xu hay bằng điểm (thuyết tự quyết của Deci & Ryan: có quyền chọn thì thấy game là của mình).
- **Dạy kinh tế và toán:** giá, sản lượng, lãi đều hiện rõ. HS tự tính "hạt nào lời nhất", đổi tiền lẻ, thấy chăm sóc thì có lãi.

## 2. Vòng chơi 1 ngày (10–15 phút)

| Việc | Thời gian | Trần mỗi ngày |
|---|---|---|
| Thu hoạch ruộng chín, nhặt trứng/sữa, lấy bánh | 2–3 phút | — |
| Tưới, bón phân, bắt sâu cho cây của mình | 1–2 phút | mỗi ô tưới 1 lần/ngày |
| Sang vườn bạn: **giúp** (tưới hộ, bắt sâu hộ) | 3–5 phút (gộp với trộm) | **5 lượt** |
| Sang vườn bạn: **hái trộm** | tính chung dòng trên | **3 lượt** |
| Ra chợ bán nông sản, mua hạt, gieo, cho gà bò ăn, nướng bánh | 2–3 phút | tiêu tối đa 3 xu/tuần cho mua hàng |
| Trang trí bằng đồ rơi · xoa đầu chó, vuốt mèo, cho chim ăn | 2–3 phút | mỗi con 1 lần |

**Luật chung:**
- Mọi thứ trong game đều **chậm**: chín, đẻ, nướng xong đều tính **theo ngày**.
- **Mở khoá dần theo cấp.** Không có chuỗi chế biến dài.

### 2.1 Bố cục, giao diện, phạm vi pha 1 (CEO 30/09, kèm ảnh mẫu Nông trại vui vẻ)

- **Bố cục gọn:** 1 khung nhìn thấy trọn nông trại, không cần bản đồ rộng. Đồ hoạ giữ kiểu 3D hiện đại. *"Mục tiêu chính vẫn là xu"* (CEO).
  - Xếp dọc cho hợp điện thoại dọc: nhà + kho ở trên · 12 ô ruộng (4×3) ở giữa · nhà chó bên trái · chuồng gà rồi bãi bò bên dưới.
  - Khung tự vừa màn dọc lẫn ngang (iPad ngang: khung ôm phần lõi, kéo xuống thấy bãi bò). Chỉ kéo và phóng trong khung.
- **Thanh dụng cụ ở đáy** như Nông trại vui vẻ:
  - 👆 tay · 🌱 gieo (bảng chọn hạt ghi giá, số quả thu, lãi/ngày) · 💧 tưới · 🐛 bắt sâu · bón phân · 🧺 thu.
  - Chạm hoặc vuốt qua các ô. Cầm nhầm dụng cụ thì làm như tay, trẻ không bị kẹt.
  - Ở vườn bạn: chạm tay thì **giúp trước, hái sau**. Cầm 🧺 mới hái ngay.
- **Nút:** Chợ · Kho · Bạn bè · Thư ở góc trên phải. HUD gọn 1 hàng: cấp · ví (xu + EXP lẻ) · điểm chăm chỉ, dưới là mùa + lượt giúp/hái.
- **Pha 1 = trồng cây + cùng lắm gà, bò** (CEO). Lò bánh, mèo, chim, đồ trang trí **tắt bằng cờ `PHA`** trong `data.js`, không xoá. Quà trang trí đổi thành phân bón.

## 3. Tiền tệ và kinh tế

### 3.1 Ba thứ "tiền"

| Tên | Là gì | Có được từ | Dùng vào |
|---|---|---|---|
| **Xu** | **Xu ví BK thật** (đổi quà được) | bán nông sản (qua EXP) | mua hạt, phân bón, con vật |
| **EXP** | Đơn vị lẻ của xu: **100 EXP = 1 xu** (quy tắc BK có sẵn) | giá bán mọi thứ ở chợ tính bằng EXP | như xu |
| **Điểm chăm chỉ** | Điểm từ học. **Không đổi thẳng ra xu** | làm bài (mục 3.3) | mua hạt · **mở ô ruộng** |

- **Ví hiện như tiền lẻ**, ví dụ "12 xu · 37 EXP".
  - Bán hàng cộng EXP; đủ 100 EXP thì tự thành 1 xu. Phần lẻ giữ lại, không bao giờ có 0,1 xu.
  - Mua đồ trừ vào phần lẻ trước; thiếu thì tự đổi 1 xu ra 100 EXP.
- **⚠ Kỹ thuật:** `fn_xu_tu_exp` hiện có **làm tròn LÊN** (1 EXP ⇒ 1 xu). Nông trại phải làm tròn xuống, giữ phần lẻ. Không dùng lại hàm đó.
- Nông trại **không phải dữ liệu học tập** nên không mang nhãn môn.
  - Trần xu của nông trại là trần riêng, không ăn vào trần xu app 30/tháng/môn.
  - Nguồn điểm chăm chỉ là bài làm (có môn), nhưng số dư điểm chăm chỉ là chung mọi môn, giống ví xu.

### 3.2 Trần và vòi/cống (faucet & sink)

```
xu ví ──(mua hạt/đồ, trần 3 xu/tuần)──┐
                                          ├─► hạt ─► chăm ─► nông sản ─► (bán luôn | cho gà bò ăn | nướng bánh) ─► EXP ─► xu ví
điểm chăm chỉ ─(học, trần 30 câu/ngày)──┘                                                         (trần 30 xu/tháng · mùa đầu 45)
```

- **Trần xu nông trại trả ra: 30 xu/tháng/HS. Mùa đầu (2 tháng): 45 xu/tháng.** CEO chốt 30/09.
  - Chạm trần thì bán vẫn được EXP. EXP chỉ dồn lại, sang tháng sau mới đổi ra xu.
- **Trần tiêu xu cho mua hàng: 3 xu/tuần** (tự đặt). Không thể dùng xu mua mãi, muốn làm vườn to hơn phải học.
- **Trộm là chuyển đồ giữa các HS, không đẻ thêm xu ⇒ không làm BK tốn thêm.**
  - Thưởng giúp bạn là điểm nhà nông và cơ hội rơi đồ, **không phải xu**. Nếu là xu thì thành một vòi tiền mới.
- **Mục tiêu cân bằng** (bot giả lập kiểm, mục 8):
  - HS **chăm học + chăm vườn**, vườn đủ ô: chạm trần khoảng cuối tháng.
  - HS **không học, chỉ mua bằng xu**: lãi ròng vài xu/tháng, vườn trống một phần.
  - HS **bỏ chăm**: hoà hoặc lỗ nhẹ.

### 3.3 Điểm chăm chỉ

- Mỗi **lượt 10 câu** (Tự luyện tổng hợp hoặc Thử thách) **đúng ≥ 70%** thì được **điểm = số câu đúng** (7–10).
- Làm bao nhiêu lượt cũng được. **Trần 30 điểm/ngày** (khoảng 3 lượt). CEO: 20–30 câu, nhiều quá dễ nản. Điểm chưa tiêu được để dành.
- Rank đang lấy ngưỡng 80%, nông trại lấy 70% là cố ý: em trung bình vẫn có hạt.
- **Tính ra từ lịch sử làm bài có sẵn** (hàm Postgres), không cần bảng ghi riêng. Số dư = kiếm được − đã tiêu.
- Gian lận (tra mạng) xử lý từng ca riêng. **Không đổi luật vì vài trường hợp** (CEO).

## 4. Ngày nông trại

- **Ngày nông trại đổi lúc 5 giờ sáng giờ VN.** CEO: giờ nào cũng được, t chọn 5 giờ để không ai thức qua nửa đêm chơi được 2 lượt.
- **Cây lớn theo ngày lịch, không theo giờ.** Gieo lúc nào trong ngày cũng được: cây 1 ngày thì sáng mai chín, cây 3 ngày thì sáng ngày thứ 3.
- Tưới, lượt trộm, lượt giúp, trần điểm, cho con vật ăn, xoa đầu thú cưng đều làm mới khi sang ngày.

## 5. Luật chi tiết

### 5.1 Ô ruộng

- **(CEO 30/09) Bắt đầu 4 ô.** HS chăm đủ 12 ô sau khoảng 1 tháng. Mở ô 5–12 ở cấp **2, 3, 4, 5, 6, 7, 9, 11** (điểm 10 → 60). Bảng cũ bên dưới đã bỏ.
- **(CEO 30/09) 1 ô = 1 hạt. Mỗi ngày mua tối đa số hạt bằng số ô**, tính cả trả xu lẫn trả điểm. Đây là cái chặn thay cho trần 3 xu/tuần (đã bỏ).
- ~~Bắt đầu 3 ô~~, mở dần tới 12 ô. Mỗi ô cần **đủ cấp + trả điểm chăm chỉ** (CEO: phải dùng điểm để mở dần).

| Ô thứ | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| Cấp | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 |
| Điểm chăm chỉ | 10 | 15 | 20 | 25 | 30 | 40 | 50 | 60 | 80 |

- Tự đặt. Tổng 330 điểm, khoảng 15–20 ngày học đều.
- Đầu game vườn nhỏ nên tốn ít hạt: điểm dư dồn vào mở ô. Về sau vườn to thì điểm dồn vào hạt.

### 5.2 Cây và chăm sóc

- Cây **1, 2 hoặc 3 ngày**. Mỗi hạt có 2 giá: EXP hoặc điểm chăm chỉ.
- **Mọi cây đều tưới và bón được** (CEO):
  - **Tưới:** mỗi ngày nông trại cây đang lớn tưới được 1 lần. Tưới đủ mọi ngày thì **+50% sản lượng**, tưới thiếu thì cộng theo tỉ lệ số ngày.
  - **Bón phân:** tốn 1 phân bón, mỗi vụ 1 lần. **+25% sản lượng và ×3 tỉ lệ rơi vật phẩm bất ngờ.**
  - **Sâu:** mỗi ngày cây đang lớn có khoảng 25% bị sâu. Bắt thì hết. Sâu còn lại lúc thu thì **−20% mỗi con**.
  - **Cây không héo, không chết.**
- **Sản lượng hiện rõ cho HS tính:** "Dự kiến 7 củ = gốc 4 · tưới +50% · bón +25%". Phần lẻ được làm tròn theo xác suất, cố định theo ô.
- **LUẬT GIÁ (CEO 30/09, thay bảng mục tiêu bên dưới):** *"cây bằng xu phải có lãi — cái chặn là giới hạn số lần mua"*.
  - Không chăm thì hoà vốn. Tưới đủ thì **lãi khoảng 50%** (sau mùa đầu 3–5,5 EXP/ô/ngày; mùa đầu 7,5–12).
  - Giá hạt bằng điểm giữ **1 điểm ≈ 4,5 EXP**.
  - **Phân bón 8 EXP** (bán lại 4): chỉ đáng bón cho cây đắt / lâu ngày, bón cây 1 ngày thì lỗ.
  - Bảng đầy đủ: `data.js` (nhánh `nhip-ngay`).
- ~~Mục tiêu giá cũ~~ (bỏ 30/09):

| Loại | Hạt (EXP hoặc điểm) | Thu, chăm đủ | Lãi/ngày | Không chăm |
|---|---|---|---|---|
| 1 ngày | 5 hoặc 2 | khoảng 8 | 3 | lỗ nhẹ |
| 2 ngày | 10 hoặc 3 | khoảng 17 | 3,5 | hoà |
| 3 ngày | 14 hoặc 4 | khoảng 26 | 4 | hoà |

- Cây dài lãi/ngày cao hơn một chút, đổi lại phải chăm nhiều ngày hơn.
- **Mùa đầu +50% sản lượng.**
- **Vật phẩm bất ngờ khi thu hoạch:**
  - Gốc 5%/ô, bón phân thì 15%.
  - Rơi ra: 60% đồ trang trí · 30% phân bón · 10% "đồ quý" bán được 50 EXP.

### 5.3 Mùa

- **Mỗi mùa có bộ cây và quả riêng.** Có vài cây quanh năm (lúa mì, ngô) vì còn làm thức ăn và làm bánh.
- **Mùa đầu dài 2 tháng** và có bonus sản lượng.
  - Lý do 2 tháng (CEO đồng ý): theo Lally và cộng sự (2010), trung bình 66 ngày mới thành thói quen.
- **Sau đó mỗi mùa 1 tháng**, khớp nhịp chốt xu tháng của BK. Bonus chỉ còn ở sự kiện.
- **Hết mùa:** hạt của mùa cũ không bán nữa. Cây đã gieo vẫn lớn và thu bình thường.
- Nên theo **mùa nông sản Việt Nam thật** để HS học luôn. Ví dụ Thu Đông có bí, cà rốt, khoai tây, cà chua; Tết có dưa hấu; hè có vải.

### 5.4 Con vật nuôi: gà, bò

- **Gà:** mở ở cấp 3. Mỗi ngày cho ăn 1 lúa mì hoặc 1 ngô ⇒ sáng hôm sau đẻ 1 trứng. Có 30% ra thêm **phân gà** (dùng làm phân bón).
- **Bò:** mở ở cấp 6. Mỗi ngày ăn 2 ngô hoặc bí ⇒ 1 sữa, 50% ra **phân bò**.
- Mua con bằng EXP/xu. Số con mở dần theo cấp.
- Phân bón đến từ chính con vật nuôi (phân chuồng). Đây là vòng tuần hoàn thật và dạy được một kiến thức nông nghiệp.

### 5.5 Làm bánh (chậm)

- **Lò bánh**, mở ở cấp 4. Một lò nướng 1 mẻ, **sáng hôm sau xong**. Ví dụ:
  - 3 lúa mì ⇒ bánh mì;
  - 2 ngô + 1 trứng ⇒ bánh ngô;
  - bí + trứng + sữa ⇒ bánh bí (cấp cao).
- Giá trị tăng thêm vừa phải, không để bánh thành cách kiếm xu chính.
- **Không có đơn hàng, không có xe tải.** Muốn thêm máy (vd xưởng sữa) thì mở dần theo cấp, vẫn nhịp ngày.

### 5.6 Chợ

- Bán nông sản, trứng, sữa, bánh, đồ quý với **giá cố định bằng EXP**.
- Mua hạt, phân bón, con vật.
- Mỗi món hiện rõ giá để HS so sánh.
- Ý tưởng để sau: **"giá trái mùa"**, tức để dành hàng tới hết mùa thì bán giá cao hơn. Đây là bài học cung cầu dễ hiểu nhất.

### 5.7 Sang vườn bạn: giúp và trộm

- **Chỉ bạn cùng lớp.** Có bảng tin lớp liệt kê các bạn, kèm số ô giúp được và số ô hái được.
- **Giúp: 5 lượt/ngày.**
  - Mỗi lượt là tưới hộ 1 ô chưa tưới hôm nay, hoặc bắt 1 con sâu.
  - Người giúp được điểm nhà nông + cơ hội rơi đồ. Chủ vườn được lợi như tự chăm.
- **Hái trộm: 3 lượt/ngày.**
  - Chỉ hái được ô **đã chín từ hôm trước mà chủ chưa hái**. Cả ngày cây chín là giờ vàng của chủ.
  - Mỗi lượt lấy 1–2 quả. Mỗi ô mất tối đa 30% sản lượng. Mỗi người trộm mỗi ô 1 lần.
  - Ô từ 3 quả trở lên luôn hái được ít nhất 1 quả. Ô dưới 3 quả thì không ai hái được. (30/09: trước đó ô 3 quả làm tròn xuống 0, không hái được.)
- **Chó giữ vườn:** thiện cảm càng cao thì càng dễ đuổi trộm. Trộm hụt vẫn mất lượt.
- **Hộp thư** ghi ai giúp gì, ai hái gì. Mặc định hiện tên, như game ngày xưa.

### 5.8 Thú cưng: chó, mèo, chim (thiện cảm)

- Mỗi con **tương tác 1 lần/ngày**: xoa đầu chó, vuốt mèo, cho chim ăn (tốn 1 lúa mì). Mỗi lần **+5 thiện cảm**, tối đa 100.
- Có phản ứng dễ thương: tim bay, vẫy đuôi, hót. Lên mốc 20 / 50 / 100 thì có phản ứng mới + 1 lợi ích nhỏ:
  - **Chó:** đuổi trộm 20% / 40% / 60%.
  - **Chim:** từ mốc 50, mỗi ngày tự bắt 1 con sâu trong vườn.
  - **Mèo:** mỗi ngày có tỉ lệ tha về 1 món nhỏ (phân bón, đồ trang trí), tăng theo thiện cảm.
- Kiểu Nintendogs / Animal Crossing: gắn bó dần với con vật, không phải kiểu nuôi Tamagotchi dễ chết.

### 5.9 Trang trí

- Đồ rơi được đặt vào các **chỗ trang trí cố định** quanh nhà và dọc đường. **Chỉ để đẹp, không cộng tiền.**
- Bạn ghé thăm sẽ thấy. Sau này khoe được lên Thế giới BK.

### 5.10 Cấp nông trại

- **Không gọi là EXP/XP** để khỏi lẫn với EXP ra xu. Tạm gọi là **điểm nhà nông**:
  - +1 mỗi ô thu hoạch, mỗi lượt giúp, mỗi sản phẩm con vật;
  - +2 mỗi mẻ bánh.
- Mục tiêu nhịp lên cấp với người vào 1 lần/ngày (tự đặt, bot kiểm):

| Cấp | Mốc |
|---|---|
| 2 | ngay ngày đầu (có hướng dẫn) |
| 5 | khoảng ngày 4–5 |
| 10 | khoảng 3 tuần |
| 15 | khoảng 2 tháng |

- **Mở khoá theo cấp:** ô ruộng (kèm điểm), giống cây, gà (3), lò bánh (4), bò (6), chỗ trang trí, công thức bánh mới.

### 5.11 Hướng dẫn tân thủ

1. Chào.
2. Gieo cà rốt, trả bằng điểm; tặng sẵn điểm.
3. Tưới.
4. Phép "sang ngày mới".
5. Thu hoạch.
6. Ra chợ bán.
7. Sang vườn bạn, tưới hộ 1 ô.
8. Hái trộm 1 ô.
9. Xoa đầu chó.
10. Nhận quà.

- Người dẫn tạm là Bác Hai, sau này thay bằng thầy cô BK.
- **Nhiệm vụ ngày và thành tích:** làm sau khi vòng chơi chính đã đúng cảm giác (ví dụ thu 10 nông sản, giúp bạn 3 lần, cho gà ăn).

## 6. Không làm ở bản này

- Chuỗi máy kiểu Hay Day, bảng đơn + xe tải, sạp bán cho nhau, heo, cừu, ong, cây ăn quả hái 4 lần rồi chặt.
- Code cũ vẫn ở `main`.
- Cây ăn quả lâu năm (cam, xoài, vải…) có thể quay lại sau, làm "cây của mùa" có chu kỳ vài ngày, không chết.

## 7. Online (sau khi demo đúng cảm giác)

- **Thăm và trộm bắt buộc phải có máy chủ.** Cần tài khoản BK, danh sách lớp, giờ tính trên máy chủ `now()`, và luật chuyển thành hàm Postgres `fn_nt_*` (CLAUDE.md §2.0).
- **Tính thuần, không đẻ dòng chờ:**
  - sâu, rơi đồ, phân bón suy từ hash (ô, ngày);
  - chỉ ghi dòng khi có việc thật (gieo, tưới, thu, trộm, giúp);
  - trần ngày đếm bằng dòng có thật.
- **Điểm chăm chỉ** là hàm đọc lịch sử lượt Tự luyện/Thử thách (có sẵn) trừ đi số đã tiêu.
- **Xu:** ghi giao dịch vào ví BK, giống game sự kiện đang trả xu theo từng ván.

## 8. Bản demo offline — việc làm tiếp

Làm trên **nhánh `nhip-ngay`** của repo NongTrai. Cảnh 3D, đồ hoạ, thao tác vuốt, âm thanh, hiệu ứng dùng lại hết.

- **Giả lập trong demo:**
  - Ví xu giả, bắt đầu 20 xu.
  - Nút **"📘 +điểm"**: giả lập 1 lượt đạt, hỏi số câu đúng 7–10.
  - Nút **"⏭ Sang ngày mới"** thay cho nút tua giờ.
  - **6 bạn ảo**, tên giả, vườn suy ra theo ngày. Có bạn chăm, có bạn lười để có ô hái trộm. Bạn ảo cũng giúp và trộm mình.
- **Cảnh:**
  - 12 ô xếp 4×3; ô chưa mở là đất hoang có biển giá.
  - Dấu hiệu cần tưới, đã tưới (đất sẫm), có sâu, đã bón.
  - Chuồng gà, bò. Lò bánh.
  - Sạp ven đường thành **chợ**, bảng đơn thành **bảng tin lớp**.
  - Chó, mèo, chim, chỗ trang trí.
  - Ẩn máy, chuồng, đồ không dùng.
  - Sang vườn bạn = vẽ lại cùng cảnh bằng state của bạn.
- **Test luật** (`tools/test-engine.mjs`):
  - đổi ngày lúc 5 giờ;
  - trần 30 điểm, 3 trộm, 5 giúp, 3 xu/tuần;
  - trộm tối đa 30%, chỉ trộm được sau ngày chín;
  - sản lượng theo chăm sóc;
  - trần xu tháng.
- **Bot giả lập 60 ngày** cho 3 kiểu HS ở mục 3.2, đo xu/tháng và nhịp lên cấp so với mục 5.10.

## 9. Hiện trạng code

- **Repo:** `E:\BK ACADEMY\Gaming\KayKit\NongTrai`, git riêng.
  - `main` là bản nhịp Hay Day cấp 1–30 + cảnh quan kiểu Hay Day (commit `5f0a1e0`).
  - **`nhip-ngay` là bản NHỊP NGÀY pha 1** (30/09):
    - `8805502`: lõi luật + test + bot;
    - `fc796d5`: bố cục gọn + thanh dụng cụ + giao diện mới.
  - Hướng dẫn chạy trọn từ đầu tới cuối bằng thao tác thật.
  - **⚠ Chưa có remote: code chỉ nằm trên máy công ty.**
- **Bot 90 ngày (pha 1)** — "xu ròng" = xu nông trại trả ra trừ xu đã tiêu:

| Kiểu HS | Xu ròng/tháng | Lên cấp 5 / 10 / 15 | Số ô |
|---|---|---|---|
| Chăm học + chăm vườn | chạm trần: ~37 trong tháng mùa đầu, 30 tháng sau | ngày 5 / 24 / 70 | đủ 12 ô ở ngày 58 |
| Không học, chăm vườn | ~6–15 | cấp 5 ngày 6, cấp 10 ngày 43 | giữ 3 ô (không có điểm để mở) |
| Học ít, 2 ngày vào 1 lần, không tưới | ~2–4 | — | 4 ô, bị trộm 43 quả |
- **Chạy:** launch `nong-trai` (port 5270). Kiểm luật: `node NongTrai/tools/test-engine.mjs`.
- **Bẫy three r128:**
  - `Texture` không có `userData`.
  - `InstancedMesh` cắt khung theo khối bao của hình gốc ⇒ chia ô có khối bao riêng, hoặc đặt `frustumCulled = false`.
- **Chụp khi Browser pane ẩn:** `NT_SCENE.chup(tên, số khung)`.
