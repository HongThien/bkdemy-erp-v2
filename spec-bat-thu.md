# BK Bắt Thú — game bắt thú kiểu Palworld

> **Nguồn thiết kế** cho game bắt thú. CEO chốt 30/09 (khuya) – 01/10/2026. Diễn biến ở DEVLOG cùng ngày.
> Code: repo riêng **`HongThien/bk-bat-thu`** (GitHub, riêng tư) — máy nhà ở `C:\Users\Admin\Desktop\BKERP\BatThu`.
> Research nền móng: `design/nghien-cuu-nen-mong-game-bat-thu.md` · nguồn mô hình boss: `design/nguon-mo-hinh-boss-bat-thu.md`.
> Số liệu trong code ghi **TỰ ĐẶT** = số chạy thử, chỉnh sau khi chơi thật.

---

## 0. CHIẾN LƯỢC (CEO 01/10/2026) — mọi tính năng game/gami phải phục vụ chuỗi này

> **Hứng thú kéo HS vào app → muốn chơi thì phải học (vd làm đúng 30 câu thì game mở khoá) → kết quả học dùng để chơi và khoe với bạn → học nhiều hơn → gắn bó với trung tâm.**

- **Vai trò của game:** áp lực (BTVN bắt buộc, GV, PH) chỉ ép được HS *vào app*, không ép được *cố gắng*. Game phải đủ thú vị để HS chịu "trả giá" bằng khoảng 30 phút học nghiêm túc.
- **Kết quả học = tài sản trong game:** hạt giống, năng lượng, trứng pet, chiêu thức… Không chỉ là chìa khoá mở cổng.
- **Khoe với bạn** qua Thế giới BK. HS chơi vì có bạn bè và để có thêm xu (§1 #16).
- **Tốt cho số đông là đủ.** Không thiết kế cho 100%; ngoại lệ xử từng ca.
- **Kinh doanh — superapp tạo gắn bó.** Chuyển trung tâm là mất vườn, pet, bộ sưu tập, bạn chơi cùng. Đây là chi phí chuyển đổi + hiệu ứng mạng lưới (Shapiro & Varian).
- **Tên lý thuyết:** nguyên lý Premack · temptation bundling (Milkman 2014) · gắn nội tại một phần (Habgood & Ainsworth 2011) · SDT gắn kết.
- **CTO đề xuất (chờ CEO):** cổng đếm **số câu đúng** (vd 30), không đếm tỉ lệ. Tự luyện đã ra câu vừa sức; em yếu mất thêm vài phút chứ không bị chặn; bớt lý do đoán bừa.

## 1. Đã chốt (CEO)

| # | Quyết định | Ghi chú |
|---|---|---|
| 1 | **Kiểu Palworld:** đánh thú cho **yếu máu** rồi **ném bóng** bắt | Không phải quăng dây, không phải dụ ăn |
| 2 | Thú bắt được: **cả vật nuôi lẫn thú rừng**, bắt cả pet về nuôi | |
| 3 | **Làm TÁCH RIÊNG khỏi Nông Trại** trước, gộp sau | Repo riêng |
| 4 | Thú có **chiêu thức tấn công** để đánh boss | |
| 5 | **Game phải là MMO:** người chơi thấy nhau; ổn thì **party đánh boss** | Làm sau bản thử một người |
| 6 | Trọng tâm đợt đầu: **hoạt cảnh ném bóng bắt** + **tấn công bằng chiêu** | |
| 7 | Đánh nhau **thời gian thực**: máu liên tục, chạy tự do, cast chiêu | CEO: "Palworld vẫn có máu liên tục" |
| 8 | **2 bản đồ hoạ:** bản **Đẹp** cho máy xịn + bản **Nhẹ** cho iPad gen 7 — **"đừng làm bản cùi"** | Mốc thấp nhất vẫn là iPad gen 7 |
| 9 | **Chưa gắn với việc học** | |
| 10 | Pet chỉ cần **đẹp** — không bám phong cách Hay Day | |
| 11 | **Không chat gõ tự do** (tạm thời) | Chỉ câu soạn sẵn / biểu cảm |
| 12 | **Boss phải là thú ngầu:** rồng, khủng long, hổ, cá voi, đại bàng… **Quái cũng phải đẹp.** | CEO nhấn "quan trọng" |
| 13 | Xu, lượt bắt: **tính sau** — "làm game đã" | |
| 14 | Mỗi người **chỉ thấy tối đa 10 người khác**, **ưu tiên bạn bè** (01/10) | Trong tầm 35 m: bạn bè trước, chỗ còn lại là người lạ gần nhất. Máy chủ cũng chỉ gửi 10 người này (vùng quan tâm) |

| 15 | **Gộp với Nông Trại thành 1 game**: trồng trọt · khám phá (bắt thú) · ấp trứng nuôi pet kiểu Dragon City (01/10) | Ý Palworld: pet bắt được giúp việc trong căn cứ/vườn |
| 16 | **Định vị: HS chơi vì có bạn bè + để kiếm thêm xu**, KHÔNG đi đường làm game thật hay (01/10) | Lợi thế BK = bạn cùng lớp ngoài đời |
| 17 | **Pháp lý (NĐ 147/2024): CEO không lo** — game chạy local, không trả xu trực tiếp, không có giao dịch tiền (01/10) | Đánh giá: `design/danh-gia-game-bat-thu-cho-bk.md` |

- **Hệ quả của #7 với luật §2.0 CLAUDE.md:** sát thương tính 20 lần/giây trên **máy chủ game** (Colyseus), không qua Postgres từng đòn.
  Postgres (`fn_game_*`) giữ những gì **có giá trị lâu dài**: kết quả bắt, exp/cấp, bộ sưu tập, (sau này) xu có trần ngày.
  Luật trận viết **thuần** trong `src/luat/` (có hạt giống ngẫu nhiên) để chạy nguyên trên máy chủ, máy khách chỉ diễn lại.

## 2. Nền kỹ thuật (research 30/09, đã tự kiểm 4 sự thật quyết định)

- **three.js r186 `WebGLRenderer`** (dự phòng Babylon.js 9). iPad gen 7 kẹt iPadOS 18 ⇒ Safari 18 ⇒ **chỉ WebGL2**, không WebGPU.
- **Hạt hiệu ứng:** three.quarks 0.17 (MIT) + shader tự viết.
- **Nhân vật người:** KayKit (CC0) + bộ 161 động tác KayKit (có sẵn *Throw*).
- **Thú:** khung xương dùng chung theo **khuôn dáng** (cách Game Freak làm >1.000 Pokémon). Bản thử đang dùng Quaternius Ultimate Monsters (CC0).
- **MMO (sau):** Colyseus 0.18 tự chạy trên VPS Singapore (~30 USD/tháng @500 người online); Supabase Realtime **không** gánh được di chuyển (trần 2.500 tin/giây).

## 3. Đã có ở bản thử (01/10)

- Đồng cỏ đồi thấp: cỏ lay theo gió, hoa, cây, đá, hồ; trời chuyển màu.
- Chọn 1 trong 3 thú khởi đầu: Rồng Lửa · Cá Mập Nhí · Xương Rồng.
- 23 loài, 6 hệ (Thường, Lửa, Nước, Cỏ, Điện, Băng) có khắc chế.
- 13 chiêu hiện theo 7 kiểu: cắn · húc · đạn · sét · gai mọc từ đất · phun hình nón · sóng âm.
  - Mỗi đòn có báo trước, dừng hình khi trúng, rung màn, số sát thương, "Hiệu quả!".
- Thú hoang đánh trả (bằng 60% sức); thú dữ tự lao vào; thú nhát bỏ chạy khi yếu.
  - Dưới 25% máu thì thú **choáng 1 lần** ("Ném bóng ngay!").
  - Thú của mình tự đánh thường nhưng **dừng khi mục tiêu đã yếu**, để HS chủ động ném.
- **Hoạt cảnh bắt:**
  1. Ngắm: đường cong + **tỉ lệ bắt thật** (một hàm duy nhất tính ra).
  2. Ném, chạm thì dừng hình; bóng bật lên mở nắp.
  3. Tia hút; thú hoá ánh sáng, co vào bóng.
  4. Bóng rơi nảy, camera áp sát dần.
  5. **Lắc 3 lần = 3 lần kiểm** (P^4/9 · P^3/9 · P^2/9, nhân lại đúng bằng tỉ lệ hiển thị), 3 đèn vàng sáng dần.
  6. Kết quả: bắt được (sao, vòng sáng, giấy màu, tiếng tách, bóng bay về tay, thẻ "Bắt được!") hoặc bóng bung, thú thoát kèm câu "Suýt nữa!".
- Đội 5 con, đổi thú có hoạt cảnh thả/thu; hộp thú; sổ thú; exp + lên cấp; lưu trên máy (localStorage).
- 2 bản đồ hoạ:
  - Tự đoán theo máy: iPhone/iPad chưa có WebGPU thì dùng bản Nhẹ.
  - Bản Đẹp mà FPS < 35 thì tự hạ xuống Nhẹ.
  - Có nút đổi tay.
- Đo ở Browser pane: Đẹp ~75 FPS · ~100 lệnh vẽ · ~320k tam giác; Nhẹ 75 FPS · ~70 lệnh vẽ · ~190k. **Chưa đo trên iPad gen 7 thật.**

### 3.0 Khu đấu boss (01/10)

- **Vị trí:** góc tây bắc bản đồ, sàn đá tròn bán kính 13 m.
  - Có vòng ký tự phát sáng, 8 cột (4 lửa, 4 pha lê) và hàng rào ma thuật.
  - Bước vào thì: rào dựng lên, trời chuyển hoàng hôn đỏ tím, nhạc trống trận, boss gầm, hiện bảng tên lớn.
- **Boss:** Bạo Chúa Lửa, cấp 12, máu ×4 (mô hình TẠM, chờ §4.1). Số liệu ở `BOSS` trong `du-lieu.ts`.
- **4 đòn, luôn có vùng đỏ lan dần báo trước.** Sát thương cố định: né được là không mất máu.

  | Đòn | Vùng báo | Sát thương |
  |---|---|---|
  | Cắn | Hình quạt | 26 |
  | Dậm đất | Vòng tròn 7,5 m | 22 |
  | Mưa thiên thạch | Rơi vào từng người + vài chỗ ngẫu nhiên | 18 |
  | Phun lửa quét | Quạt rộng | 6/nhịp |

- **Mốc máu:**
  - Còn 50%: **nổi giận** (nhanh hơn, gấp đôi thiên thạch, nhạc dồn).
  - Còn 15%: **kiệt sức 8 giây** = cửa sổ ném bóng. Tỉ lệ bắt khoảng 18% với thú cấp 6.
- **Người chơi:** có máu 100; nút né lăn (💨 / Shift), bất tử 0,45 giây.
- **Kết thúc:**
  - Thua: hồi sinh ngoài rào, boss hồi đầy máu.
  - Thắng: EXP ×5.
  - Thu phục: boss vào đội, thu nhỏ còn ~2,4 m.
  - Boss sinh lại sau 45 giây.
- **Sẵn cho party (MMO):** thiên thạch đã nhắm từng người; máu boss nhân theo số người khi có máy chủ.

### 3.0b Sổ Trùm — bản thiết kế 8 trùm (01/10, CHỜ CEO DUYỆT)

Trang xem: https://claude.ai/artifact/2zWHd4mF6NAhX2UnVVzaDV

- **Mỗi trùm dạy 1 kỹ năng:** đọc vùng đỏ → phản xạ → canh thời điểm → giữ chỗ đứng → chia việc → núp sau vật chắn → chuyển giai đoạn → tổng hợp.
- **Luật chung:** có điểm yếu hệ (lý do đi bắt thú nhiều hệ) · thu phục được khi kiệt sức · máu nhân theo số người trong party.

| Bậc | Trùm | Hệ | Dạy | Cơ chế riêng |
|---|---|---|---|---|
| Đầu đàn (đánh một mình) | Bạo Chúa Lửa (khủng long) — **đã có** | Lửa | đọc vùng đỏ | nổi giận 50% |
| | Lôi Hổ | Điện | phản xạ (vồ lao thẳng) | xích sét giữa người đứng gần ⇒ giãn đội hình |
| | Thần Ưng Bão Tố (đại bàng) | Thường/gió | canh thời điểm | bay 12 giây (không đánh được) ↔ đáp 10 giây |
| Trùm vùng (2–4 người) | Băng Long | Băng | giữ chỗ đứng | sàn băng trượt, pha bay thả bom |
| | Rùa Cổ Thụ | Cỏ | chia việc | hoa hồi máu mọc ở mép sân, phải phá |
| | Kình Ngư Biển Sâu (cá voi) | Nước | núp sau vật chắn | sóng thần cả sân, đá chắn vỡ dần |
| Huyền thoại (bắt buộc party) | Phượng Hoàng | Lửa | chuyển giai đoạn | gục ⇒ trứng lửa, 20 giây phải phá |
| | Long Vương | đổi hệ Lửa → Băng → Điện | tổng hợp | 3 pha, phải đổi thú theo hệ |

- **Chờ CEO:**
  1. Duyệt danh sách (dự trữ: Sư Tử Vàng · Voi Ma Mút · Mãng Xà · Khủng Long Ba Sừng).
  2. Thứ tự làm. Đề xuất Lôi Hổ → Băng Long, vì cùng nhà mô hình N-hance.
  3. Cá voi: tự làm hay đổi thành Vua Bạch Tuộc.
  4. Mua thử mô hình.
  5. Thêm hệ Đất? Hiện chưa hệ nào đánh mạnh vào Điện.
- Số liệu (máu, sát thương, thưởng, giờ sinh lại) để bàn sau.

### 3.1 Đo đám đông (01/10, `?nguoi=100`, máy bàn ở nhà — CHƯA phải iPad)

- 100 người chơi giả (mỗi người 1 thú đồng hành), mỗi máy thấy 10.
  - Bản Đẹp: 71 lệnh vẽ · 377k tam giác · **4,9 ms/khung** (95%: 7,7).
  - Bản Nhẹ: 45 lệnh vẽ · 208k tam giác · **4,2 ms/khung** (95%: 6,8).
- Trước khi tối ưu (vẽ cả 100): 1.768 lệnh vẽ · 1,73 triệu tam giác · ~20 ms.
- 4 việc tối ưu đã làm:
  1. gộp 6 mảnh nhân vật KayKit thành 1;
  2. bật lại bỏ-qua-ngoài-khung cho lưới có xương;
  3. chỉ người gần mới đổ bóng;
  4. người ở xa cập nhật động tác 15 lần/giây.
- **Ước iPad gen 7** (chậm hơn máy bàn khoảng 5–8 lần): khoảng 20–35 ms/khung ⇒ **30–50 FPS ở bản Nhẹ**. Phải đo máy thật.
- **Máy chủ 100 người** (chưa dựng): mỗi máy chỉ nhận vị trí của 10 người, 10 lần/giây. Theo research, Colyseus trên 1 VPS nhỏ thừa sức. **Phải test tải** khi dựng.

## 4. Chờ CEO

1. **Nguồn mô hình boss + pet** (`design/nguon-mo-hinh-boss-bat-thu.md`). Không nhà bán nào có đủ cả boss ngầu lẫn pet đẹp cùng một phong cách.
   - **Đề xuất** (~465 USD, 68 mẫu): Meshtint Cute Series (pet 3 bậc tiến hoá + boss biển) + N-hance Stylized Fantasy Creatures/Dragons (hổ, đại bàng, sói, gấu, rồng Whelp → Elder) + FSaur (T-rex).
     - Đã kiểm: [N-hance bundle](https://assetstore.unity.com/packages/3d/characters/animals/stylized-fantasy-creatures-bundle-184409) 21 con, có hổ và đại bàng, 149,99 USD, nặng 580 MB, phải nén cho web.
     - Đã kiểm: [Meshtint Pack 02](https://assetstore.unity.com/packages/3d/characters/creatures/monsters-ultimate-pack-02-cute-series-179083) 24 con × 3 bậc tiến hoá, 159,90 USD, file FBX.
   - **Nên mua thử 1 món mỗi bên**, đặt cạnh nhau xem trước khi mua cả bộ.
   - **Cá voi:** chưa có bản stylized nào kèm động tác tấn công ⇒ tự làm, hoặc đổi boss biển thành Vua Bạch Tuộc / Cá Mập.
   - Giấy phép: file GLB gửi xuống trình duyệt thì tải được ⇒ đóng gói + nén, và hỏi nhà bán xác nhận bằng văn bản là dùng được với web three.js.
2. Chơi thử bản này, chỉnh cảm giác đánh + bắt.
3. **Xu khi bắt thú — 2 lời CEO đang vênh nhau** (phát hiện lúc gộp máy nhà + máy công ty, 01/10):
   - 30/09, máy công ty (`spec-game-bat-quai.md` §5.2): *"nông sản bán luôn được 3 xu, làm bóng bắt quái thì phần thưởng 4–5 xu, nhưng bắt có xác suất hụt nên phải cân nhắc — giống ngoài đời đầu tư, có thể ăn có thể xịt"*.
     Luật đã ghi theo câu này:
     - hai đường "bán luôn" và "làm bóng" ngang giá trị kỳ vọng;
     - tỉ lệ bắt hiện công khai, kỹ năng quyết định phần lớn, trần 90%;
     - bóng chỉ làm từ nông sản.
   - 01/10, máy nhà (§1 #17): *"không trả xu trực tiếp"*.
   - Cần CEO chọn. Nếu giữ ý 30/09 thì thưởng bắt thú là xu ⇒ phải tính chung trần tháng với Nông Trại. Nếu giữ ý 01/10 thì bài học "đầu tư có rủi ro" đổi sang đơn vị khác (vật liệu, trứng…).

## 5. Việc kế tiếp (CTO)

1. Đo trên iPad gen 7 thật (FPS, bộ nhớ tab, 20 phút liên tục không tự tải lại).
2. Boss: khu đấu riêng + thanh máu lớn + chiêu diện rộng có báo trước; party 2–4.
3. MMO: Colyseus (vùng + kênh, 10 lần/giây) + đăng nhập tài khoản BK + `fn_game_*`.
4. Làm mờ cây/đá khi che người chơi.
