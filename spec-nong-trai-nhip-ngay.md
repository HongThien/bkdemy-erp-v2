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
- **(CEO 30/09 tối, kèm ảnh Nông trại vui vẻ bản Zing Me) CHƠI MÀN NGANG + bố cục y như ảnh.** CEO: *"bố cục như này thôi, không cần quá rộng đâu, mình đâu có làm giống Hay Day"* · *"điện thoại hay iPad cũng xoay ngang ra mà chơi"*.
  - **Bỏ thế giới rộng kiểu Hay Day:** đường cái, suối, cầu, hồ lớn, cổng, xe tải, silo.
  - **Bố cục:**
    - ruộng lớn bên trái: 12 ô (4×3) **liền nhau, ô to**; ô chưa mở là **ô cỏ**;
    - sân đất có rào ở góc trên phải: nhà, kho, chuồng gà, chuồng bò;
    - chó + nhà chó ngay trước cổng sân;
    - ao có vịt ở góc dưới phải;
    - chợ và bảng tin lớp bên trái.
  - **Góc nhìn** như ảnh: hàng ô chạy chéo xuống phải thoai thoải, cột ô chạy chéo xuống trái dốc. Ống kính hẹp cho gần kiểu nhìn phẳng.
    - Điện thoại ngang: khung ôm ruộng + sân.
    - iPad ngang: khung ôm thêm chợ + ao.
    - Kéo và phóng trong khung.
  - **Cầm dọc thì hiện màn "Xoay ngang máy để chơi".** Lý do: iPhone/iPad không cho web tự khoá hướng; Android khi cài như app thì khoá được, manifest ghi `landscape`.
  - **HUD màn ngang:**
    - 1 hàng: cấp · mùa · lượt · ví · điểm;
    - nút thử (Ngày mới, +điểm) xuống góc dưới trái;
    - điện thoại ngang thì thanh "Việc hôm nay" mặc định thu gọn để không che ruộng.
  - Bố cục cũ (xếp dọc cho điện thoại dọc) còn trong lịch sử git NongTrai trước commit này.
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
xu ví ──(mua bịch/đồ, trần chi 5 xu/tháng)──┐
                                               ├─► bịch hạt ─► chăm ─► nông sản ─► (bán luôn | cho gà bò ăn) ─► EXP ─► xu ví
điểm chăm chỉ ─(học, trần 30 câu/ngày)───────┘      (mỗi ngày mua tối đa số bịch = số ô)          (trần 30 xu/tháng · mùa đầu 45)
```

- **Trần xu nông trại trả ra: 30 xu/tháng/HS. Mùa đầu (2 tháng): 45 xu/tháng.** CEO chốt 30/09.
  - Chạm trần thì bán vẫn được EXP. EXP chỉ dồn lại, sang tháng sau mới đổi ra xu.
- **Trần chi: 5 xu/tháng (500 EXP), tính MỌI khoản mua** — cả EXP lẻ lẫn xu chẵn. CEO 30/09: *"chỉ nên cho HS dùng 5 xu và kiếm về tầm 10 xu"*.
  - Phải tính cả EXP lẻ: nếu không, tiền bán hàng quay vòng mua bịch mãi, HS không học vẫn kiếm 20–33 xu/tháng (bot bắt được 30/09).
  - Không thể dùng xu mua mãi — muốn thêm bịch thì trả bằng điểm, tức là phải học.
- **Trộm là chuyển đồ giữa các HS, không đẻ thêm xu ⇒ không làm BK tốn thêm.**
  - Thưởng giúp bạn là điểm nhà nông và cơ hội rơi đồ, **không phải xu**. Nếu là xu thì thành một vòi tiền mới.
- **Mục tiêu cân bằng (CEO 30/09, lần 5)** — kiểm bằng `tools/kich-ban.mjs` + `tools/gia-lap.mjs`, số đo ở mục 9:
  - **HS chơi chăm chỉ** (vào vườn mỗi ngày, chăm đủ, học đều): **tháng đầu khoảng 30 xu, các tháng sau giảm dần**.
  - Học càng nhiều càng được nhiều, tới trần 45/30.
  - **HS không học, chỉ trả bằng xu:** "bỏ ~5 xu, thu về ~10 xu"/tháng.
  - **HS bỏ chăm:** được ít hơn hẳn. Tưới đủ +80% nên không tưới là mất gần nửa sản lượng.

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

- **(CEO 30/09) Bắt đầu 4 ô. Tuần đầu chỉ 4 ô. Hết tháng đầu đủ 8 ô là được.** Ô 9–12 mở dần trong tháng 2–3.
  - CEO: *"trồng 4 ô và 12 ô về cơ bản không khác gì nhau, nhưng ít thì m sẽ trân trọng và hiểu nó sâu hơn"*.
- Mỗi ô cần **đủ cấp + trả điểm chăm chỉ** (CEO: phải dùng điểm để mở dần).
- **(CEO 30/09) Mua theo BỊCH HẠT GIỐNG: 1 bịch = 1 ô**, trong bịch bao nhiêu hạt không quan trọng. **Mỗi ngày mua tối đa số bịch bằng số ô**, tính cả trả xu lẫn trả điểm.

| Ô thứ | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|
| Cấp | 3 | 5 | 7 | 9 | 12 | 14 | 16 | 18 |
| Ngày (HS vào mỗi ngày) | ~8 | ~15 | ~22 | ~27 | ~43 | ~56 | ~70 | ~85 |
| Điểm chăm chỉ | 10 | 15 | 20 | 20 | 30 | 40 | 50 | 60 |

- Điểm mở ô là tự đặt. Em học 1 lượt/ngày phải để dành vài ngày mới mở được ô, nên ô 8 thường tới muộn hơn cấp vài ngày.

### 5.2 Cây và chăm sóc

- Cây **1, 2 hoặc 3 ngày**. Mỗi bịch có 2 giá: EXP hoặc điểm chăm chỉ.
- **Mọi cây đều tưới và bón được** (CEO):
  - **Tưới:** mỗi ngày nông trại cây đang lớn tưới được 1 lần. Tưới đủ mọi ngày thì **+80% sản lượng**, tưới thiếu thì cộng theo tỉ lệ số ngày.
    - Lần 5 nâng từ +50% lên +80%. Đây là cách tăng nguồn thu từ trồng cây qua việc CHĂM mỗi ngày, không qua đường xu.
  - **Bón phân:** tốn 1 phân bón, mỗi vụ 1 lần. **+25% sản lượng và ×3 tỉ lệ rơi vật phẩm bất ngờ.** Phân mua 10 EXP (bán lại 5).
    - CEO: tác dụng mạnh thì phải đắt. Chỉ đáng bón cho cây đắt hoặc cây lâu ngày.
  - **Sâu:** mỗi ngày cây đang lớn có khoảng 25% bị sâu. Bắt thì hết. Sâu còn lại lúc thu thì **−20% mỗi con**.
  - **Cây không héo, không chết.**
- **Sản lượng hiện rõ cho HS tính:** "Dự kiến 18 củ = gốc 5 · tưới +80% · bón +25% · mùa +60%". Phần lẻ được làm tròn theo xác suất, cố định theo ô.
- **LUẬT GIÁ hiện hành (CEO 30/09, lần 5) — MỞ KHOÁ DẦN:**
  - **Tuần đầu 2 loại cây. Khoảng mỗi tuần mở thêm 1 loại. 8 tuần (mùa đầu) đủ 8 loại.** CEO: *"8 tuần 2 tháng cũng chỉ cần 8 loại cây thôi"*.
  - **Cây mở sau lãi/ngày nhỉnh hơn cây trước một chút (~6%/bậc), nhưng bịch đắt hơn (cả EXP lẫn điểm)** ⇒ HS phải cân nhắc tích luỹ.
  - **Bịch trả bằng xu = giá trị thu khi tưới đủ ÷ 1,6** (lần 4: giảm xu kiếm từ đường xu). Lãi đường xu chỉ có khi chăm; không tưới thì lỗ nhẹ.
  - **Bịch trả bằng điểm:** 1 điểm đổi được 5,0 EXP nông sản ở bậc 1, lên 6,4 ở bậc 8.
  - Để dành điểm mua bịch xịn thì lời hơn. Đây là bài toán tích luỹ CEO muốn dạy.

| Bậc | Cây | Ngày chín | Mở ở cấp (≈ tuần) | Bịch: EXP · điểm | Thu khi tưới đủ, chưa bonus (EXP) | Thu/ô/ngày | Lãi/ô/ngày (trả xu) | EXP / 1 điểm |
|---|---|---|---|---|---|---|---|---|
| 1 | Lúa mì | 1 | 1 (tuần 1) | 16 · 5 | 25 | 25 | 9 | 5,0 |
| 2 | Cà rốt | 1 | 1 (tuần 1) | 17 · 5 | 27 | 27 | 10 | 5,4 |
| 3 | Ngô | 2 | 3 (tuần 2) | 36 · 10 | 58 | 29 | 11 | 5,8 |
| 4 | Khoai tây | 2 | 5 (tuần 3) | 37 · 10 | 59 | 30 | 11 | 5,9 |
| 5 | Cà chua | 2 | 7 (tuần 4) | 39 · 10 | 63 | 32 | 12 | 6,3 |
| 6 | Bí ngô | 3 | 9 (tuần 4–5) | 63 · 16 | 101 | 34 | 13 | 6,3 |
| 7 | Hoa hướng dương | 3 | 11 (tuần 6) | 68 · 17 | 108 | 36 | 13 | 6,4 |
| 8 | Dâu tây | 3 | 13 (tuần 7–8) | 72 · 18 | 115 | 38 | 14 | 6,4 |

- Lúa mì và ngô trồng quanh năm (làm thức ăn cho gà bò). Hướng dương xếp vào Thu Đông vì hướng dương Nghệ An nở tháng 11–12.
- Cây mùa sau đặt ngang bậc 7–8 vì tới lúc đó HS đã qua mùa đầu:
  - Tết: ớt, dưa hấu.
  - Xuân: đậu nành, lúa nước, mía.
- Bảng đầy đủ (số quả gốc, giá 1 quả): `data.js` nhánh `nhip-ngay`.
- **Bonus mùa đầu giảm dần:** tháng 1 **+60%**, tháng 2 **+30%**, sau đó hết (bonus chỉ còn ở sự kiện). Bonus tính theo ngày gieo.
- **Vật phẩm bất ngờ khi thu hoạch:**
  - Gốc 5%/ô, bón phân thì 15%.
  - Pha 1 rơi ra: 80% phân bón · 20% "đồ quý" bán được 50 EXP. Pha 2 có thêm đồ trang trí.

### 5.3 Mùa

- **Mỗi mùa có bộ cây và quả riêng.** Có vài cây quanh năm (lúa mì, ngô) vì còn làm thức ăn và làm bánh.
- **Mùa đầu dài 2 tháng** và có bonus sản lượng **giảm dần: tháng 1 +60%, tháng 2 +30%** (CEO lần 5: tháng đầu cao nhất, các tháng sau giảm dần).
  - Lý do 2 tháng (CEO đồng ý): theo Lally và cộng sự (2010), trung bình 66 ngày mới thành thói quen.
- **Sau đó mỗi mùa 1 tháng**, khớp nhịp chốt xu tháng của BK. Bonus chỉ còn ở sự kiện.
- **Hết mùa:** hạt của mùa cũ không bán nữa. Cây đã gieo vẫn lớn và thu bình thường.
- Nên theo **mùa nông sản Việt Nam thật** để HS học luôn. Ví dụ Thu Đông có bí, cà rốt, khoai tây, cà chua; Tết có dưa hấu; hè có vải.

### 5.4 Con vật nuôi: gà, bò

- **Gà:** mở ở cấp 4 (~tuần 2). Mỗi ngày cho ăn 1 lúa mì hoặc 1 ngô ⇒ sáng hôm sau đẻ 1 trứng. Có 30% ra thêm **phân gà** (dùng làm phân bón).
- **Bò:** mở ở cấp 10 (~tuần 5). Mỗi ngày ăn 2 ngô hoặc bí ⇒ 1 sữa, 50% ra **phân bò**.
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
  - thu 1 ô: **+3 × số ngày cây lớn**, nên trồng cây dài không thiệt;
  - tưới 1 ô: **+2**;
  - +1 mỗi lượt giúp, mỗi sản phẩm con vật;
  - +2 mỗi mẻ bánh (pha 2).
- **Trần 8 điểm nhà nông/ngày** (lần 5), giống trần điểm chăm chỉ.
  - Thu 1 ô + tưới vài ô là đủ trần ⇒ **cấp đi theo SỐ NGÀY CHĂM VƯỜN**.
  - Học nhiều hay giúp nhiều không mở khoá sớm hơn. Học nhiều được thưởng bằng thu nhập.
  - Lý do: không có trần thì em học 3 lượt đủ 8 loại cây từ tuần 5, em 1 lượt tới tuần 10. CEO muốn nhịp theo tuần.
  - Quà hướng dẫn tân thủ không tính trần.
- **Lịch mở khoá của HS vào mỗi ngày** (bảng mốc `NN_MOC` trong `data.js`, đo bằng bot):

| Cấp | Ngày ≈ | Mở |
|---|---|---|
| 1 | 1 | 4 ô · lúa mì · cà rốt |
| 3 | 8 | ô 5 · ngô |
| 4 | 11 | gà |
| 5 | 15 | ô 6 · khoai tây |
| 7 | 22 | ô 7 · cà chua |
| 9 | 27 | ô 8 · bí ngô ⇒ **hết tháng đầu đủ 8 ô** |
| 10 | 33 | bò |
| 11 | 37 | hoa hướng dương |
| 12 | 43 | ô 9 |
| 13 | 49 | dâu tây ⇒ **8 tuần đủ 8 loại cây** |
| 14 / 16 / 18 | 56 / 70 / 85 | ô 10 / 11 / 12 |

- Cấp không mở gì thì quà là phân bón. Pha 2 thêm lò bánh, mèo, chim, chỗ trang trí; cấp của chúng đặt lúc làm pha 2.

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
    - `fc796d5`: bố cục gọn + thanh dụng cụ + giao diện mới;
    - `4a5eb25` / `912019b`: mua theo bịch, trần chi 5 xu/tháng, giảm đường xu, giảm trộm;
    - `55f1b03`: bot dùng chung + giả lập nghìn HS;
    - `89d754b`: **lần 5** — mở khoá dần theo tuần, tưới +80%, bonus giảm dần, trần điểm nhà nông/ngày.
  - Hướng dẫn chạy trọn từ đầu tới cuối bằng thao tác thật.
  - **⚠ Chưa có remote: code chỉ nằm trên máy công ty.**
- **Giả lập kinh tế (lần 5, 30/09)**:
  - Chạy từ 01/10, 92 ngày.
  - "Xu ròng" = xu nông trại trả ra trừ xu HS đã tiêu.
  - T10 = tháng đầu (+60%), T11 = tháng 2 (+30%), T12 = mùa Tết (không bonus).
  - **HS chăm** (`gia-lap.mjs`): vào vườn hằng ngày, tưới ≥ 70%, làm bài ≥ 7 câu đúng, không bỏ game.

| HS chăm, số lượt bài/ngày | Xu ròng T10 / T11 / T12 | Có ô 8 (trung vị) | Đủ 8 loại cây (trung vị) |
|---|---|---|---|
| 0 lượt (không học) | 8 / 6 / 4 | chưa (không có điểm mở ô) | — |
| 1 lượt | 23 / 19 / 16 | ngày 36 | ngày 54 |
| 2 lượt | 36 / 33 / 26 | ngày 28 | ngày 50 |
| 3 lượt | 42 / 41 / 28 (chạm trần 45/30) | ngày 27 | ngày 49 |

  - **Toàn bộ 5.000 HS** (quần thể tự giả định, kể cả em bỏ game): TB 13,1 / 9,8 / 7,2 xu/HS/tháng ⇒ **BK chi ~1.300 / 980 / 720 xu mỗi 100 HS**.
    - Trước lần 5: 1.020 / 1.020 / 665.
  - Nguồn thu gần hết là trồng cây: 14,5 xu. Con vật 0,7, hái trộm 0,5.
  - Mỗi ngày vào vườn chơi khoảng 1,4 phút (ước lượng thô), còn xa mốc 10–15 phút.
  - **10 kịch bản** (`kich-ban.mjs`):
    - Chăm mẫu mực (3 lượt): 45/45/30, ô 8 ngày 26, 8 loại cây ngày 46.
    - Học vừa phải (1 lượt): 24/24/15, ô 8 ngày 29, 8 loại ngày 52.
    - Chỉ chơi không học: 11/12/8.
    - Quên chăm (2 lượt, không tưới): 22/18/17.
  - Số đầy đủ: `tools/ket-qua-gia-lap.json`.
- **Chạy:**
  - `node tools/test-engine.mjs` (luật);
  - `node tools/kich-ban.mjs` (10 kịch bản);
  - `node tools/gia-lap.mjs 5000` (khoảng 2 phút).
- **Chạy:** launch `nong-trai` (port 5270). Kiểm luật: `node NongTrai/tools/test-engine.mjs`.
- **Bẫy three r128:**
  - `Texture` không có `userData`.
  - `InstancedMesh` cắt khung theo khối bao của hình gốc ⇒ chia ô có khối bao riêng, hoặc đặt `frustumCulled = false`.
- **Chụp khi Browser pane ẩn:** `NT_SCENE.chup(tên, số khung)`.
