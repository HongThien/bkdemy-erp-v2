# Nghiên cứu đồ hoạ: Little Habitats (Danny Limanseta) → áp cho game BK

> 30/09/2026 · Thùy giao: "BK đang gặp vấn đề đồ hoạ game — đọc ông này, tìm cách xử lý tương tự".
> Nguồn: mổ bản build thật của game trên wavedash (JS đã minify, three r186) + tweet công khai của Danny.
> Đây là **tài liệu học CÁCH LÀM**. Không chép code/bảng màu của anh ấy vào game BK; mọi thông số dưới đây dùng làm mốc để tự chỉnh.

---

## 1. Kết luận chính (1 câu)

**Game đẹp không phải nhờ model đẹp.** Little Habitats **không tải một file model hay texture nào**: toàn bộ bản build gồm 1,4 MB JS và three.js. Mọi cây, nhà, con vật đều **do Opus viết bằng code** từ khối cơ bản (cầu, trụ, hộp). Danny tự xác nhận: *"Opus generated all these assets in code!"* Game thứ hai của anh ấy, Wildbrush (kiểu Zelda, làm trong 1 ngày thứ Bảy với 2 con), cũng vậy: 0 GLB, 0 texture.

Cái đẹp đến từ **một hệ thống nghệ thuật thống nhất (art direction / look-dev)**. Hệ thống đó có 3 phần:
1. **Một** bảng màu,
2. **Một** bộ dựng hình,
3. **Một** chuỗi ánh sáng và chỉnh màu.

Mọi vật trong game đều đi qua đúng 3 phần này. Vì vậy dù hình rất đơn giản, cả cảnh vẫn "ăn nhập" với nhau.

---

## 2. Mười kỹ thuật đo được trong bản build

| # | Kỹ thuật | Thông số thật |
|---|---|---|
| 1 | **Bảng màu cố định có tên** (~60 màu pastel, 1 object `K`) | Cỏ `#8fbf5a` (xanh dịu, KHÔNG xanh chuối) · đất `#b07a4f` · đá `#b9b1a6` · cát `#e6d3a3` · nước `#8fd3cf`→`#3f8fa3` · lá `#5f9e4a` · mực UI `#4a3b2f` · giấy `#fbf5e9` |
| 2 | **Bộ dựng hình từ khối cơ bản.** Ghép cầu/trụ đã xoay, chỉnh cỡ thành 1 geometry, **nướng màu vào đỉnh** | Tối dần xuống chân (giả AO), sàn 22% · mặt úp xuống ngả lạnh (R×0.72, G×0.78, B×0.96) · thuộc tính `aGlow` (phát sáng) + `aFlex` (độ lắc theo gió, tăng dần theo chiều cao) |
| 3 | **Mắt ngộ nghĩnh:** 1 cầu tối `#2d2433` + 1 chấm trắng nhỏ phát sáng | Chấm trắng = 34% cỡ mắt, đặt lệch về phía camera |
| 4 | **Vá vật liệu dùng chung.** Mọi `MeshStandardMaterial` được chèn cùng bộ uniform toàn cục qua `onBeforeCompile` | `uTime · uWindDir · uWindStrength · uDaylight · uSunDir · uSnow · uAutumn`. Nhờ vậy cả thế giới cùng lắc theo gió, cùng phủ tuyết, cùng ngả thu |
| 5 | **Viền sáng (fresnel rim) + lá xuyên sáng** | Viền ban ngày ấm `(1,.93,.8)`, ban đêm xanh `(.42,.5,.95)`. Lá được cộng sáng khi đứng ngược mặt trời |
| 6 | **Lệch màu từng bản sao** | Mỗi cây/bụi lệch sáng ±7% và lệch ấm/lạnh ±3,5%, nên 100 bụi không giống hệt nhau |
| 7 | **Ánh sáng** | Mặt trời `#fff1d6` cường độ 3 · Hemisphere trời `#d4e6f8` / **đất `#bdae8c` (be ấm)** cường độ 1.3 · bóng PCFSoft 2048 (máy khoẻ 4096), khung bóng ôm sát đảo ±19.5 · sương mù cùng màu nền |
| 8 | **Chuỗi hậu kỳ** (thư viện `postprocessing` của pmndrs) | Bộ đệm HalfFloat + MSAA 4 → **Bloom** ngưỡng 1.05 (chỉ đèn lồng/đom đóm mới toả) → **Tilt-shift** (mờ trên/dưới, nhìn như mô hình thu nhỏ) → **Grade** tự viết |
| 9 | **Grade tự viết** (thay tone mapping của renderer; renderer để `NoToneMapping`) | Tone map **Khronos PBR Neutral** (giữ nguyên sắc pastel) → cân trắng → **split toning** (bóng ngả tím-xanh, sáng ngả ấm) → S-contrast ~1.05 → saturation ~1.03 → nâng đen về màu bóng (không bao giờ đen tuyền) → vignette có màu 0.3 → hạt film 0.03 |
| 10 | **9 khung giờ trong ngày** nội suy MỌI thông số trên | Màu trời, màu hemisphere, màu bóng, vignette, exposure, sat, contrast, fog, bloom. "Không khí" là **dữ liệu** chỉnh được, không nằm cứng trong code |

**Phụ trợ:**
- Camera phối cảnh FOV 32, đặt ở (24, 22, 26), nhìn gần như isometric kiểu diorama.
- Tự hạ chất lượng khi FPS tụt, theo thứ tự: DPR 1.5→1.25→1 · MSAA 4→2→0 · bóng 2048→1024.
- Nước dùng texture "khoảng cách tới bờ" để vẽ bọt ven bờ và chuyển màu nông→sâu.
- Hạt bay (cánh hoa, phấn, đom đóm) chạy hết trên GPU.

**Quy trình của Danny** (tweet 05/04/2026). Anh ấy khuyên "bảo AI thêm shader" theo danh sách: noise cho nước lăn tăn · fresnel viền sáng · hậu kỳ đổi tông màu · shader cây lắc/vật rung. Anh ấy là product designer, không biết code. Anh ấy đưa **game tham chiếu** (Townscaper, Tiny Glade) và **gu thẩm mỹ**; Opus viết toàn bộ.

---

## 3. So với Nông Trại BK hiện tại (`E:\BK ACADEMY\Gaming\KayKit\NongTrai`, ảnh `.snap/i2.jpg`)

| Hạng mục | Little Habitats | Nông Trại BK | Hậu quả nhìn thấy |
|---|---|---|---|
| Nguồn hình | 1 bộ dựng bằng code, 1 bảng màu | **2 gói khác style**: KayKit (nhà mái đỏ/xanh chói) + Quaternius (bụi tròn) | Nhà và cây nhìn như từ 2 game khác nhau |
| Màu | Pastel tiết chế, sat ~1.03 | Cố ý **tăng độ tươi texture**, `NoToneMapping` và không grade | Cỏ xanh chuối phẳng lì, chói mắt |
| Ánh sáng dội từ đất | Hemisphere đất **be ấm** `#bdae8c` | Hemisphere đất **xanh chuối** `0x8fcf5a` (`scene.js:60`) | Mọi vật (cả nhà, đá) bị hắt xanh lá, càng thêm "một màu" |
| Mặt trời | Cường độ 3, ấm | Cường độ 1.05 | Tương phản sáng/tối yếu, khối kém nổi |
| Màu bóng | Tím-xanh (split toning), không đen | Bóng xám mặc định | Bóng "bẩn", thiếu chiều sâu |
| Hậu kỳ | Bloom + tilt-shift + grade + vignette + grain | Không có | Thiếu cảm giác "mô hình thu nhỏ", mép khung không có điểm dừng mắt |
| Mặt đất | Shader có noise, viền sáng mép, đổi màu theo mùa | Mặt phẳng 1 màu | Nền trống, như tấm nhựa |
| Sống động | Gió lắc toàn bộ cây, lệch màu từng bản sao, hạt bay | Chưa có gió; bụi giống hệt nhau | Cảnh tĩnh, lặp |
| three.js | r186 | **r128** | Muốn dùng `postprocessing` phải nâng three (đổi `outputEncoding`→`outputColorSpace`, chỉnh lại cường độ đèn) |

**Chẩn đoán gốc:** BK đang chỉnh từng thứ cho **"tươi"** (tăng sat, bỏ tone map). Little Habitats làm ngược lại: **tiết chế màu gốc, rồi để lớp grade tạo không khí**. Thêm nữa, BK trộn 2 gói asset nên không có một "tay vẽ" chung.

---

## 4. Hướng xử lý cho BK (đề xuất CTO, chờ CEO chọn)

**Bước A: "lớp hoàn thiện" chung (giữ nguyên asset hiện có). Rẻ, thấy kết quả ngay.**
1. Nâng three r128 → bản mới (r18x), thêm `postprocessing`: Bloom + tilt-shift + grade (Neutral tone map, split toning, vignette, grain).
2. Sửa ánh sáng: hemisphere đất sang màu be ấm, mặt trời ấm và mạnh hơn, bóng ngả tím.
3. Bảng màu BK: **một** file `palette.js`. Ép vật liệu của cả 2 gói KayKit/Quaternius về bảng này (remap màu theo tên vật liệu). Bỏ bước "tăng độ tươi".
4. Mặt đất bằng shader: noise loang màu + viền sáng.
5. Gió lắc cây (chèn qua `onBeforeCompile`) + lệch màu từng bản sao.

→ Xử lý được: màu chói, cảnh phẳng, thiếu không khí. **Chưa** xử lý được: 2 gói asset lệch style.

**Bước B: asset bằng code, cách Danny làm. Chuyển dần từng nhóm vật.**
- Viết 1 "bộ dựng" (khối cơ bản → geometry gộp + màu đỉnh nướng AO + glow/flex) và 1 hàm mắt ngộ nghĩnh.
- Cho Opus dựng lại dần: cây trồng → cây/bụi → con vật → nhà/máy. Ưu tiên thay vật lệch style nhất trước (nhà KayKit mái chói).
- Lợi ích: style thống nhất tuyệt đối · không phụ thuộc gói CC0 · file nhẹ · đổi mùa/ngày đêm/tuyết ăn theo tự động · thêm vật mới chỉ cần mô tả bằng lời.

**Áp chung cho các game 3D khác** (KHTN du hành `khtn-site/`, BK Catan 3D): bước A dùng lại gần như nguyên xi, vì bảng màu, grade và ánh sáng là một module tách riêng.

---

## 5. Game thứ ba: Poseidia (poseidia.vercel.app, bổ sung 30/09)

Thành phố Atlantis có lời dẫn (narration). three r186, **không có model hay texture nào**: toàn bộ là 1,4 MB JS. Cách làm giống Little Habitats, nhưng hậu kỳ nặng kiểu điện ảnh hơn:
- **N8AO**: bóng khuất tính theo màn hình (thư viện mở của N8python). Nó tạo **bóng tiếp đất** ở chân mọi vật, nên vật không bị "dán" lên nền. Đây chính là lỗi đang thấy ở Nông Trại.
- **DoF** (mờ tiền/hậu cảnh) + bloom + vignette + god rays.
- Địa hình được **nướng sẵn 3 bản đồ trên GPU** (`LandHeight` / `LandSun` / `LandAO`), rồi shader đọc lại để tô bóng và khe tối.
- Hàng nghìn vật (nhà, cây, người, thuyền, chim, cá heo) vẽ bằng `InstancedMesh`. Có tầng bóng riêng cho cảnh xa (`FarShadowCascade`).

→ **Cả 3 game 3D đã phát hành của Danny đều 0 model.** Làm hình bằng code là cách anh ấy thật sự dùng cho 3D, không phải ngoại lệ.

---

## 6. Luồng Grok Bot tạo asset (tweet 12/08 và 28/08/2026) và hướng C: model 3D bằng AI

**Grok Bot** là "đồng đội AI" của xAI (beta từ 12/08/2026): tự đăng nhập công cụ và làm việc trên máy riêng của nó. Danny dùng nó như sau:
- **2D (dùng thật):** bot đọc code game → viết prompt riêng cho từng asset → gọi trang tạo ảnh riêng của Danny → cắt, xoá nền thành PNG → gắn lại vào game. Kết quả: **74 hình lá bài trong ~2 giờ**, cho game thẻ bài 2D.
- **Template "Game Art Director":**
  - từ ý tưởng game ra style guide, bảng màu và bộ prompt;
  - cắt sprite sheet;
  - **kiểm lệch bảng màu / lệch lưới** giữa các hình (chống mỗi hình một kiểu).
- **3D (anh ấy chỉ nhắc là "có thể"):** vẽ concept art → nhờ bot đăng nhập **Tripo/Meshy** để đổi ảnh thành model 3D. Nhưng không game 3D nào anh ấy phát hành dùng đường này (xem mục 5).

**Đánh giá cho BK:**
- **Không cần Grok Bot.** Claude Code đã chạy được đúng vòng đó: đọc code → viết prompt → gọi công cụ → xử lý → gắn vào game. Cái BK thiếu là **công cụ tạo ảnh** và (nếu đi hướng C) **dịch vụ ảnh→3D**.
- **Tripo/Meshy (giá tra 30/09/2026):**
  - Meshy: gói Free 100 credit/tháng, **không có API**, hình ra là CC BY 4.0 (phải ghi nguồn). Gói Pro $20/tháng mới có API.
  - Tripo: gói Free ~200–300 credit/tháng, model công khai, CC BY 4.0, **không dùng thương mại**. Gói Pro ~$20/tháng thì model riêng tư. API trả trước $1/100 credit.
- **Điểm mạnh:** con vật hoặc nhà chi tiết, dễ thương khi nhìn gần. Làm nhanh.
- **Điểm yếu cần lường:**
  1. Mỗi model sinh riêng nên dễ **lệch style**. Phải có style guide và concept art cùng một bộ, đúng lý do Danny làm template kiểm lệch.
  2. Lưới nặng, cấu trúc lưới rối → phải giảm đa giác.
  3. Texture **dính sẵn ánh sáng/bóng**, đánh nhau với ánh sáng của cảnh.
  4. Muốn con vật cử động thì phải gắn xương. Chưa kiểm Tripo/Meshy tự gắn xương cho 4 chân tốt tới đâu.
- **Hướng lai hợp lý nếu thử C:** model AI chỉ dùng cho **vật chính nhìn gần** (gà, bò, heo, nhà chính). Code dùng cho **vật số đông** (cỏ, cây, bụi, đá, hàng rào, đường). Cả hai đều phải qua **lớp hoàn thiện chung (bước A)**.

---

**Tên gọi / đứng trên vai ai (R7):**
- Look development và color grading với split toning: kỹ thuật chuẩn của điện ảnh.
- Tilt-shift miniature: nhiếp ảnh.
- Procedural modeling "asset là code": Townscaper (Oskar Stålberg), Tiny Glade (Pounce Light).
- Baked vertex AO và fresnel rim lighting: kỹ thuật chuẩn của stylized rendering.
- Khronos PBR Neutral: tone mapper do Khronos công bố năm 2024 cho màu sản phẩm/pastel.
