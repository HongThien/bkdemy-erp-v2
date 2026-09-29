# Nông Trại BK — chuyển sang NHỊP NGÀY (kiểu Nông trại vui vẻ / Khu vườn trên mây)

> CEO chốt hướng 29/09/2026 (tối). Tài liệu này là **thiết kế để build bản demo kế tiếp**. Chưa có dòng code nào của nhịp ngày.
> Bản demo hiện tại (nhịp Hay Day) vẫn chạy nguyên, xem mục 8.

---

## 1. Vì sao đổi

- Đặc trưng app BK: **HS vào 1 lần/ngày**. Bài học của Thùy: *"mỗi ngày vào thu hoạch mua đồ tý, xong trồng cây hôm sau vào tiếp. Hayday nhịp quá nhanh phải mất nhiều thời gian chơi hơn."*
- Hay Day được thiết kế cho **nhiều phiên ngắn trong ngày**. Lõi của nó là chuỗi máy → hàng → đơn. Ai vào ít thì máy đứng, đơn treo, thấy mình tụt lại.
- Nông trại vui vẻ và Khu vườn trên mây dùng **appointment mechanic** (cơ chế hẹn giờ quay lại): cây chín sau một khoảng giờ, tức là game hẹn người chơi quay lại đúng lúc đó.
  - Cây chín khoảng 1 ngày thì game hẹn đúng 1 lần/ngày, khớp y hệt nhịp dùng app BK.
  - Cùng họ với chuỗi ngày liên tiếp của Duolingo, hay vòng "hook" của Nir Eyal: nhắc → làm → thưởng → đầu tư.
- **Hái trộm** gây nghiện vì đánh vào **loss aversion** (sợ mất mạnh hơn thích được).
  - Bài học có thật: năm 2009 ở Trung Quốc, trào lưu "trộm rau" (偷菜) từ Happy Farm thành hiện tượng xã hội. Người lớn đặt báo thức nửa đêm để đi trộm hoặc canh vườn.
  - Vì vậy phải có rào (mục 2).

## 2. ĐÃ CHỐT (Thùy 29/09)

1. **Giờ vàng.** Cây chín xong có một khoảng giờ (đề xuất 12–24 giờ) **chỉ chủ vườn được hái**. Hết giờ vàng bạn mới hái trộm được.
   - Ai vào mỗi ngày không bao giờ mất gì. Chỉ vườn bị bỏ bê mới bị trộm.
   - Hái trộm là hình phạt cho việc bỏ vườn, không phải cuộc đua thức khuya.
2. **Trộm ít.** Mỗi ô mỗi người chỉ hái trộm được 1–2 quả, chủ luôn giữ phần lớn.
3. **Chỉ thăm vườn bạn cùng lớp.** BK có sẵn danh sách lớp.
4. **Có việc tốt đi kèm.** Tưới hộ, bắt sâu, nhổ cỏ cho bạn thì được thưởng, để đi thăm vườn không chỉ là đi trộm.
5. **Cây không héo, không chết.** Bị trộm đã là hình phạt đủ. Sâu/cỏ/khô chỉ làm giảm sản lượng.
6. **Trần mỗi ngày cho cả TRỘM lẫn GIÚP**, để HS không online quá nhiều.
   - Đề xuất: 5 lượt trộm và 10 lượt giúp mỗi ngày. Đếm theo ngày giờ VN, làm mới lúc 0 giờ.

## 3. CHƯA CHỐT — đang tạm theo đề xuất, Thùy duyệt khi xem demo

| Câu hỏi | Đang tạm | Phương án khác |
|---|---|---|
| Chuyển hẳn hay lai với Hay Day? | **Chuyển hẳn**: tắt máy, bảng đơn, sạp. Chỉ TẮT bằng cờ, không xoá code | Lai: nhịp ngày là chính, giữ vài máy cho cấp cao |
| Mỗi ngày chơi bao lâu? | **3–5 phút** — quyết định mỗi ngày có bao nhiêu việc | — |
| Có hiện tên người trộm không? | **Hiện** trong hộp thư, như game ngày xưa | Ẩn tên, chỉ báo "có bạn hái 2 cà rốt" |
| Số giờ vàng, trần trộm, trần giúp | 12–24 giờ · 5 trộm · 10 giúp | chỉnh sau khi chơi thử |

## 4. VÒNG CHƠI 1 NGÀY (mục tiêu 3–5 phút)

1. Vào game, **thu hoạch** ruộng chín (vuốt như hiện tại) và nhặt trứng/sữa.
2. **Chăm vườn:** bắt sâu, nhổ cỏ, tưới ô bị khô.
3. **Thăm vườn bạn cùng lớp:** hái trộm ô đã hết giờ vàng, giúp bạn bắt sâu/nhổ cỏ/tưới. Mỗi việc đều có trần mỗi ngày.
4. **Bán** nông sản thừa, **mua hạt**, **gieo** lại.
5. Thoát. Hôm sau vào tiếp.

## 5. LUẬT CHI TIẾT (đề xuất — mọi số là TỰ ĐẶT, chỉnh khi chơi thật)

### 5.1 Cây ruộng

- **Tính giá trị theo NGÀY, không theo giờ.** Vào 1 lần/ngày thì cây chín 4 giờ hay 18 giờ cũng chỉ thu được 1 lần.
- **Cây "1 ngày" chín sau khoảng 18 giờ, không phải 24.** Hôm qua gieo lúc 20 giờ, hôm nay vào sớm lúc 16 giờ vẫn chín.
- **Cây "2 ngày"** chín sau khoảng 40 giờ. Lãi/ngày khoảng 85–90% cây 1 ngày cùng cấp, đổi lại được nghỉ 1 ngày không thiệt.
- **Cây nhiều vụ** (thu N lần, mọc lại sau X giờ): tiết kiệm tiền hạt và thao tác gieo.
- Có 1–2 **cây ngắn** (vài giờ) ở cấp thấp: ngày đầu có cái để thu, ai vào 2 lần/ngày có thêm chút.
- **Gieo = trả xu mua hạt ngay lúc gieo**, kiểu Nông trại vui vẻ. Bỏ luật Hay Day "lấy nông sản làm hạt".
- Mỗi vụ ra nhiều quả (khoảng 6–20), không phải 2 như Hay Day, để hái trộm 1–2 quả có ý nghĩa mà chủ vẫn giữ phần lớn.
- Số ô ruộng: bắt đầu 6, tăng dần tới khoảng 24 ở cấp 30. Có vuốt gieo/gặt nên 24 ô vẫn khoảng 1 phút.
- Nhịp lên cấp (mục tiêu, người chơi vào 1 lần/ngày):

| Cấp | Mốc |
|---|---|
| 2 | ngay ngày đầu, nhờ hướng dẫn |
| 5 | khoảng ngày 3–4 |
| 10 | khoảng 2–3 tuần |
| 20 | khoảng 2–3 tháng |

### 5.2 Sâu · cỏ · khô

- Trong lúc cây lớn có thể phát sinh 0–2 sự cố: sâu, cỏ, hoặc khô cần tưới.
- Sự cố **suy từ hạt giống của ô** (mã ô + lúc gieo), không lưu thành dòng "chờ xử lý". Khớp luật chống NULL và nguyên tắc "tính thuần, không đẻ dòng chờ" trong CLAUDE.md: bản online chỉ ghi dòng khi có người xử lý.
- Mỗi sự cố **còn lại lúc thu** trừ 15% sản lượng, tối đa 45%.
- Chủ vườn tự xử lý không tính vào trần. Bạn xử lý giúp thì tính vào trần giúp của bạn.

### 5.3 Hái trộm và giúp

- Chỉ hái trộm ô đã **chín quá giờ vàng**. Mỗi người mỗi ô 1 lần, lấy 1–2 quả.
- Tổng bị trộm mỗi ô tối đa khoảng 25–30% sản lượng.
- Người trộm được nông sản + 1 XP. Người giúp được XP + vài xu.
- Hộp thư ghi ai trộm gì, ai giúp gì.

### 5.4 Con vật và cây ăn quả

- **Con vật:** cho ăn 1 lần/ngày bằng nông sản trực tiếp, vì đã bỏ máy cám. Ví dụ gà ăn lúa mì, bò ăn ngô, ong ăn hướng dương. Có sản phẩm sau khoảng 18–20 giờ.
- **Cây ăn quả:** ra quả theo chu kỳ ngày, **không héo, không chết**. Bỏ luật Hay Day "hái 4 lần rồi chặt".

### 5.5 Bán hàng và phần còn lại

- **Bán:** bán thẳng từ kho, giá cố định.
- **Máy, bảng đơn, sạp:** tắt bằng cờ chế độ, giữ code. Ô đất của máy trong cảnh để trống/trang trí.
- **Hướng dẫn tân thủ viết lại:**
  1. Gieo (mua hạt).
  2. Phân bón thần cho chín ngay.
  3. Gặt.
  4. Bắt sâu (có sẵn 1 con).
  5. Thăm 1 bạn ảo, hái trộm 1 ô, giúp 1 ô.
  6. Về bán hàng.
  7. Nhận quà.
- **Sổ nhiệm vụ và thành tích:** giữ khung, đổi mẫu nhiệm vụ cho hợp nhịp ngày (thu N nông sản, giúp bạn N lần, gieo N ô…). Bỏ mẫu gắn máy/đơn/sạp.

## 6. BƯỚC 1 — BẢN DEMO OFFLINE (việc làm tiếp)

Mục đích: Thùy thử **cảm giác** vòng chơi ngày + thăm/trộm/giúp trước khi đầu tư online.

- **"Vườn bạn ảo":** khoảng 6 bạn tên giả, không dùng tên HS thật.
  - Mỗi bạn có giờ vào cố định mỗi ngày.
  - Vài bạn "lười", 2–3 ngày mới vào, nên có ô quá giờ vàng để hái trộm.
  - Vườn bạn suy từ đồng hồ game, không lưu.
- **Bạn ảo cũng trộm và giúp mình**, để cảm được giờ vàng và hộp thư có tin.
- **Thăm vườn:** vẽ lại cùng cảnh 3D bằng state của bạn (`dongBo(stateBạn)`), chế độ khách.
  - Chạm ô chín quá giờ vàng thì hái trộm.
  - Chạm ô có sự cố thì giúp.
  - Chạm ô còn giờ vàng thì báo "còn X giờ".
  - Có nút "Về nhà".
- **HUD** hiện lượt còn lại: trộm x/5 · giúp y/10.
- Giữ nút ⏩ tua giờ để thử 1 tuần chơi trong vài phút.

### Kế hoạch code

Làm trên **nhánh git riêng `nhip-ngay`** của repo NongTrai, để bản Hay Day ở `main` nguyên vẹn.

- **`data.js`:** thêm cờ `CHE_DO = 'ngay'` và bảng cây theo giờ (giờ chín, số vụ, quả/vụ, giá hạt, giá bán). Thêm `LUAT` mới: giờ vàng, trần trộm/giúp, tỉ lệ sự cố, % trừ, % trộm tối đa, thức ăn con vật = nông sản, cây ăn quả không héo.
- **`engine.js`:**
  - `trong` trả xu mua hạt.
  - `ruongTT` thêm sự cố, giờ vàng, phần bị trộm.
  - `thu` tính sản lượng trừ sự cố và phần bị trộm, rồi mọc lại nếu còn vụ.
  - Hàm mới: `xuLy(s, i, loai)`, `ban(s, id, n)`.
  - Vườn bạn: `banAo(s, k)` suy state bạn theo giờ; `trom(s, k, i)` và `giup(s, k, i, loai)` có trần theo ngày VN.
  - Hộp thư: bạn ảo trộm/giúp mình, tính khi `capNhat`.
- **`scene.js`:**
  - Hình sâu/cỏ/khô trên ô, hoặc bong bóng icon cho rõ.
  - Chế độ khách.
  - **Dọn bớt con vật và cây ăn quả khi state nhỏ hơn.** Hiện chỉ dọn ruộng, đổi sang state khác bị lỗi `conVatTT … reading 'an'`.
  - Ẩn máy, bảng đơn, sạp khi `CHE_DO = 'ngay'`.
- **`ui.js`:**
  - Bong bóng gieo hiện giá hạt.
  - Kho có nút Bán.
  - Nút 👫 Thăm bạn → danh sách bạn, mỗi bạn kèm số ô hái được và số ô cần giúp.
  - Thanh "Vườn của …" + nút Về nhà.
  - Hộp thư.
  - Lượt còn lại trên HUD.
- **`nhiemvu.js`:** hướng dẫn mới (mục 5.5), mẫu nhiệm vụ mới, thành tích mới.
- **`tools/test-engine.mjs`:** thêm test cho giờ vàng, trần ngày (làm mới 0 giờ VN), trừ sự cố, trộm tối đa. Thêm bot giả lập "vào 1 lần/ngày" để đo nhịp lên cấp so với bảng ở 5.1.

## 7. BƯỚC 2 — ONLINE (sau khi demo đúng cảm giác)

- Online là **lõi** của nhịp ngày: thăm và trộm cần máy chủ. Không còn là "làm trước khi phát" như bản Hay Day.
- Gồm: tài khoản BK · danh sách lớp · giờ tính trên máy chủ (`now()`) · luật chuyển thành hàm Postgres `fn_nt_*` (CLAUDE.md §2.0).
- Sự cố suy từ hash, chỉ ghi dòng khi trộm/giúp/xử lý. Trần ngày đếm bằng dòng có thật.
- Nối ví xu / việc học và giới hạn giờ chơi: CEO nói để sau.
  - Nhịp ngày rất hợp để móc vào việc học, ví dụ "nước tưới" có được từ BTVN. Chưa làm.

## 8. HIỆN TRẠNG CODE (29/09)

- **Repo:** `E:\BK ACADEMY\Gaming\KayKit\NongTrai`, git riêng, nhánh `main`. Commit cuối là `5f0a1e0` (cảnh quan kiểu Hay Day).
  - **⚠ Chưa có remote: code CHỈ nằm trên máy công ty.**
- **Chạy:** `node NongTrai/serve.mjs 5270`, hoặc launch `nong-trai` trong `.claude/launch.json` của ERP (trỏ đường dẫn E:). Kiểm luật: `node NongTrai/tools/test-engine.mjs`.
- **Đang có (nhịp Hay Day, cấp 1–30, Việt hoá):**
  - 15 cây ruộng, 7 cây ăn quả, 5 con vật, 12 máy, khoảng 60 món.
  - Bảng đơn, sạp, hướng dẫn Bác Hai (tạm), sổ nhiệm vụ + con đường quà, 14 thành tích.
  - Cảnh quan kiểu Hay Day:
    - đường cái ở mép trái, xe tải và bảng đơn ven đường, cổng "NÔNG TRẠI BK";
    - suối, 2 cầu gỗ, hồ có vịt;
    - rừng cây bông xù, đường đất mềm vẽ 2 lớp.
  - Chi tiết từng phần: README trong repo NongTrai.
- **Dùng lại được cho nhịp ngày:** toàn bộ cảnh 3D và đồ hoạ, thao tác vuốt gieo/gặt, kho, cửa hàng, cấp/XP, khung nhiệm vụ/thành tích, âm thanh, hiệu ứng.
- **Bẫy three r128 đã gặp:**
  - `Texture` không có `userData`.
  - `InstancedMesh` cắt khung theo khối bao của hình gốc ở gốc toạ độ, kéo camera xa là mất cả cụm. Cách xử lý: chia ô có khối bao riêng, hoặc `frustumCulled = false`.
- **Kiểm hình khi Browser pane ẩn:** `NT_SCENE.chup(tên, số khung)` ghi `.snap/*.jpg`.
  - Muốn xem state giả (ví dụ cấp 30) thì tạm tắt `NT_UI._cb.khung`, gọi `NT_SCENE.dongBo(stateGiả)`, chụp, rồi **nạp lại trang**.
  - Không đổi ngược về state thật tại chỗ được, vì cảnh chưa dọn bớt con vật.
