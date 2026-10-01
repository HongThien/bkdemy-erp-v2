# FLOW: từ ảnh gốc của Thùy → NPC "Boss cuối" của hành trình BK

> Soạn 01/10/2026. Thùy giao: *"cần flow thiết kế để đi từ ảnh của T đến cuối cùng biến thành 1 NPC trong game, cụ thể là boss cuối,
> có lời thoại, animation, thậm chí cả kỹ năng trong hành trình của BK."*
> Đây là **flow thiết kế + phân việc**, chưa phải code. Đọc cùng: `spec-v1-app-hs.md` §4 + §13.4 · `design/STYLE-HS.md` ·
> `design/DON-HANG-SKIN-HS.md` (Đơn 6) · `design/nghien-cuu-do-hoa-little-habitats.md` · `design/nguon-mo-hinh-boss-bat-thu.md` ·
> `spec-bk-world.md` · `src/screens/hocsinh/tutorial/noiDungTutorial.ts` (mẫu file lời thoại Thùy tự sửa).
> Mâu thuẫn với spec: **spec thắng**, sửa file này.

---

## 0. Đọc trước: 5 điều quyết định cả flow

1. **"Boss cuối" hiện CHƯA tồn tại trong spec.** `_phieu_luu_bo()` (mig 202610011520) chỉ có 4 boss loài `rong_con · golem_pha_le · phuong_hoang · bach_tuoc`,
   gán xoay vòng cho **boss khu vực** (mỗi khu vực 1 màn boss = dạng mức độ cao nhất). Không có "boss của cả hành trình". ⇒ NPC này là
   **slot mới**, và phải thêm vào hợp đồng dữ liệu §13.4 (xem §7).
2. **Hai nơi NPC này có thể sống, 2 công nghệ KHÁC nhau** (đừng trộn):
   | | App HS "Giải cứu thế giới" (V1, **06/10**) | BK World / game bắt thú (V1.1+) |
   |---|---|---|
   | Hình | **2D PNG** ChatGPT vẽ, mỗi loài vài trạng thái | **3D** three.js, GLB |
   | Animation | **làm bằng code** trên ảnh (CSS/Canvas) | AI 3D chỉ tự có **đi bộ**; tấn công/gầm/chết phải key tay (`nguon-mo-hinh-boss-bat-thu.md` §5) |
   | NPC là gì | Boss cuối của bản đồ phiêu lưu | NPC giao nhiệm vụ lấy xu (`spec-bk-world.md` §1 #6) |
   **Flow này đi nhánh 2D cho V1.** Nhánh 3D ở §11, chỉ để biết không cần làm lại phần thiết kế (hồ sơ nhân vật, lời thoại, kỹ năng dùng chung).
3. **Một nguồn thật duy nhất = "hồ sơ nhân vật" (§2).** Hình, lời thoại, kỹ năng, animation đều sinh ra từ nó. Không ai vẽ/viết trước khi hồ sơ được Thùy duyệt
   (bài học Đơn 4: hình vẽ trong chat đẹp, file giao lại là bản dựng khác; và mỗi hình ChatGPT sinh riêng thì dễ lệch nét).
4. **Kỹ năng của boss là kiến thức, không phải hiệu ứng.** Máu boss = khoảng cách tới "đạt" (spec §4.2); mỗi câu đúng = 1 đòn. Chiêu của boss
   chỉ là *vỏ* cho luật đó. Không có HP/số liệu bịa riêng cho boss (CLAUDE §1.5, §2.0).
5. **Hạn:** 06/10. Hình là rủi ro lớn nhất (spec-v1 §8). Phạm vi V1 an toàn ở §10: **1 boss cuối (Toán), 6 ảnh, 14 câu thoại, 3 chiêu**.

> **(Đã xác nhận 01/10, xem §A và §12.) Giả định ban đầu:** "T" = Thùy, ảnh gốc là ảnh/hình của chính Thùy (hoặc nhân vật Thùy đã có). Nếu là ảnh người khác
> (GV, nhân sự, HS) thì cần họ đồng ý bằng chữ trước khi đưa lên game cho HS. Tôi chưa thấy file ảnh này trong repo
> (ảnh gần nhất `public/bk-ui/Ảnh ChatGPT 17_29_41 28 thg 9, 2026-9.png` là ngôi sao vàng, không phải).

---

## A. ⭐ CÁCH LÀM ASSET (Thùy chốt 01/10: ảnh chân dung của Thùy · làm 1 boss MẪU trước · sau này mỗi GV 1 boss)

> Phần này là trọng tâm; các mục sau (gameplay, ghép dữ liệu) chỉ là bối cảnh. **Làm thành KHUÔN lặp lại**: ảnh GV vào → cùng một dây chuyền → ra bộ asset.
> Gameplay (điều kiện mở, thưởng…) chưa cần chốt lúc này.

### A.1 Nguyên tắc (áp cho mọi GV)
1. **KHÔNG đi thẳng ảnh thật → model.** Luôn qua **1 bước nhân vật cách điệu 2D** (concept) rồi mới ra asset. Lý do: (a) mọi GV cùng một nét vẽ ⇒ đồng bộ style (rủi ro "mỗi hình một kiểu" ở `nghien-cuu-do-hoa` §6); (b) không đưa mặt thật của người thật lên game cho HS; (c) AI ảnh→3D từ ảnh thật hay cho mặt méo/sáp.
2. **Mặt là chính, quần áo không quan trọng** (Thùy 01/10): nhân vật **CHIBI** (đầu ~1/2 thân), giữ các nét làm nhận ra mặt (kính, kiểu tóc, nụ cười, dáng mặt); trang phục để ChatGPT tự chọn hợp style. Ghi các nét nhận mặt vào hồ sơ (§2) của từng người; phép thử duy nhất = người trong ảnh tự nhìn có nhận ra không.
3. **Người thật = cần đồng ý bằng chữ.** Thùy tự quyết cho chân dung của mình; **với GV khác: xin xác nhận (tin nhắn/giấy) trước khi xử lý ảnh**, ghi lại ở hồ sơ. Không làm boss từ ảnh HS/phụ huynh.
4. **Nhân vật là NGƯỜI (humanoid, tỉ lệ chibi)** ⇒ Mixamo auto-rig được (chỉ hỗ trợ humanoid), lợi thế so với boss thú (AI chỉ tự cho "đi bộ", xem `nguon-mo-hinh-boss-bat-thu.md` §5). Chibi đầu to có thể làm Mixamo rig lệch/xuyên đầu-vai khi anim mạnh ⇒ khi làm 3D phải thử sớm; **trang phục ôm thân, không cánh/đuôi/váy xoè**.
5. Không đưa asset đã mua/ảnh bản quyền vào AI (EULA Unity/Meshtint cấm). Ảnh của GV là ảnh của chính họ nên được.

### A.2 Hai đường ra asset (cùng 1 concept gốc)

| | **Đường 2D — app HS V1 (06/10)** | **Đường 3D — BK World / NPC sau** |
|---|---|---|
| Ra | 6 PNG trong suốt + 1 chân dung (§4.1) | 1 GLB rig + ~8 clip animation |
| Công cụ | ChatGPT tạo ảnh (1 hình/lượt) → Claude nén | Tripo/Meshy (ảnh→3D) → Mixamo (rig + anim) → Blender (dọn) → gltf-transform (nén) |
| Animation | code (§6) | clip Mixamo + VFX shader |
| Chi phí | ~0 | gói trả phí Tripo/Meshy 1 tháng (~$20; **bắt buộc** để dùng thương mại — gói Free là CC BY/không thương mại) · Mixamo miễn phí (tài khoản Adobe) |
| Thời gian/boss | ~1–1,5 ngày (chủ yếu chờ ChatGPT) | ~2–3 ngày lần đầu, ~1–2 ngày khi đã có khuôn (ước lượng, chưa đo) |
| Rủi ro | lệch nét giữa các pose | mặt/tay méo sau AI · rig · hiệu năng iPad |

**Khuyến nghị: làm Đường 2D trước (đúng deadline), giữ concept + hồ sơ để Đường 3D không phải thiết kế lại.** Chỉ làm 3D khi BK World thật sự cần NPC đi lại trong cảnh.

### A.3 Dây chuyền ĐƯỜNG 2D (từng bước)

| # | Bước | Ai | Xong khi |
|---|---|---|---|
| 1 | **Chuẩn bị ảnh gốc:** chân dung rõ mặt, sáng đều, nhìn thẳng, không filter, ≥1000px; thêm 1 ảnh nửa người nếu có (lấy tỉ lệ). Đặt vào `design/bk-ui-src/boss/<ma_gv>/goc.jpg` (boss mẫu Thùy: ảnh đang ở `design/bk-ui-src/anh_thuy.jpg`, chuyển vào thư mục này khi làm khuôn) | GV/Thùy | ảnh đủ nét |
| 2 | **Điền hồ sơ** (§2) gồm 3 nét nhận dạng + trang phục boss | Claude soạn, Thùy sửa | Thùy duyệt |
| 3 | **Concept 3 phương án** (ChatGPT; đính ảnh gốc + ảnh style RPG tham chiếu + hồ sơ) | ChatGPT | Thùy chọn 1 |
| 4 | **Hình GỐC:** toàn thân, đứng thẳng, **A-pose** (tay hơi dang, để dùng chung cho 3D), 3/4, nền **trong suốt thật**, 1254×1254 | ChatGPT | Thùy duyệt, **khoá** |
| 5 | **5 pose còn lại** (§4.1), mỗi lượt đính lại hình gốc + câu mô tả cố định, MỖI LƯỢT 1 HÌNH. Lệch nét ⇒ sinh lại từ hình gốc, không sửa tiếp trên hình lệch | ChatGPT | 6 ảnh cùng mặt/áo/cỡ |
| 6 | **Kiểm máy:** alpha thật (không viền trắng) · chiều cao đầu lệch ≤3% giữa các pose · cùng nguồn sáng trái-trên · màu chủ đạo nằm trong palette style · không chữ | Claude (script) | báo cáo ✔ |
| 7 | **Nén + đặt vào style** (§4.2): tên mới, không đè file cũ; `check:style-hs` ✔ | Claude | build qua |
| 8 | **Animation code** (§6) chạy thử trên trang xem-thử dữ liệu giả (kiểu `?xem=…` đã dùng) | Claude | 7 trạng thái chạy, FPS ổn |

### A.4 Dây chuyền ĐƯỜNG 3D (khi cần)

1. **Từ HÌNH GỐC 2D (không từ ảnh thật):** thêm lượt ChatGPT vẽ **turnaround** (trước · bên · sau, cùng A-pose, nền trơn). AI 3D cần đa góc để không bịa mặt sau.
2. **Ảnh → mesh:** Tripo hoặc Meshy (gói trả phí), chế độ image/multiview-to-3D, bật A-pose, **~10–15k tam giác** (mục tiêu boss ≤15k). Sinh 3–4 bản, chọn bản mặt ít méo nhất. Rodin nếu cần quad sạch (không rig sẵn).
3. **Dọn mesh (Blender):** gộp mesh, xoá mảnh thừa, sửa tay/ngón/mắt, **nướng ánh sáng ra khỏi texture** (AI hay dính sẵn bóng, đánh nhau với đèn cảnh), texture ≤1024, ≤3 material.
4. **Rig + animation:** upload FBX/OBJ A-pose lên **Mixamo** (auto-rig humanoid) → tải clip: `idle` · `talk/gesture` · `cast` · `hit` · `angry` · `death/kneel` · `walk` · `wave`. Hiệu ứng Mixamo không có (vd "tan thành ánh sáng") **làm bằng shader/VFX**, không key tay.
5. **Xuất GLB:** Blender → glTF; nén `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp`. Mục tiêu ≤2–3 MB/boss.
6. **Render thống nhất:** vào three.js qua **lớp hoàn thiện chung** (toon/cel + outline + grade, bảng màu 1 file — `nghien-cuu-do-hoa` §4 bước A). Khuôn mặt giữ bằng texture vẽ, không PBR tả thực.
7. **Không để URL `.glb` trần** (đóng gói nhị phân + ToS cấm tái sử dụng, `nguon-mo-hinh` §1) để người khác không rip nhân vật GV.

### A.5 KHUÔN cho "mỗi GV một boss" (làm 1 lần ở boss mẫu, lần sau chỉ thay đầu vào)

```
design/bk-ui-src/boss/<ma_gv>/
  goc.jpg           ← đầu vào duy nhất khác nhau giữa các GV
  ho_so.md          ← 3 nét nhận dạng, trang phục, câu cửa miệng, xác nhận đồng ý (ngày + cách xác nhận)
  prompt_cdinh.md   ← ĐOẠN MÔ TẢ CỐ ĐỊNH dán lại mọi lượt ChatGPT (nét vẽ, nguồn sáng, bảng màu, A-pose)
  out/              ← 6 png + chân dung (ảnh gốc chưa nén)
public/bk-ui/hs/skin/rpg/boss_<ma_gv>_{dung,noi,chieu,trung,gian,ha,chandung}.png
```
- **Dùng chung (làm 1 lần):** prompt khung style · script kiểm máy (A.3#6) · module animation (§6) · component trận · khuôn dữ liệu chiêu/thoại (§5.3, §8). **Riêng từng GV:** ảnh, hồ sơ, 6 ảnh, bộ thoại, tên chiêu.
- Mã boss = mã GV (`boss_<ma_gv>`), khớp tên file ảnh như `loai_quai` (§13.4). Thêm GV = thêm **dòng dữ liệu + thư mục ảnh**, không sửa code (không `if (gv === …)`).
- **Boss mẫu = Thùy.** Dùng nó để *chốt khuôn*: đo thời gian từng bước, ghi chỗ ChatGPT hay lệch, chỉnh `prompt_cdinh.md`, rồi mới nhân lên.
- Tự động hoá được (kiểm máy, nén, khai style, tạo khung hồ sơ): viết thành `scripts/boss-new.mjs <ma_gv>` **sau** boss mẫu khi khuôn đã ổn, không làm trước.

---

## 0.5 TRẠNG THÁI (cập nhật 01/10 tối)

✔ Trạm 0–3: hồ sơ, concept, 6 pose + chân dung (ChatGPT), nén + khai `Skin.boss` · ✔ Trạm 4: hoạt ảnh (2D CSS `boss/BossSan.tsx`, 3D `skin/the3d/quaiAnh.ts`) ·
✔ Trạm 6: 14 câu thoại nháp `boss/noiDungBoss.ts` · ✔ Trạm 5 (bản dữ liệu): 3 chiêu trong `noiDungBoss.ts` · ✔ cắm vào trận 3D qua `nguonQuai`.
Xem thử: `hs.html?xem=boss` (6 tư thế + hội thoại) · `&tran=1` (trận 3D, boss vào sau elite thứ nhất).
⏳ Chưa làm: Trạm 7 dữ liệu thật (`fn_boss_cuoi_cua_toi`, điều kiện mở, 2 pha theo % máu, chiêu gọi câu theo loại) · pha 2/`giaiDoan(2)`, `baoHieu()` đã có trong `QuaiBoss` nhưng chưa có trận nào gọi · âm thanh · cutscene mở/kết ghép vào luồng thật · Trạm 8–9 (soi bằng tài khoản HS thật, deploy thủ công).

---

## 1. Toàn cảnh pipeline (9 trạm, 4 cổng duyệt)

```
ẢNH GỐC của T
   │
[0] Chốt hồ sơ nhân vật ─────────────► ◆ CỔNG 1: Thùy duyệt hồ sơ (giấy 1 trang)
   │
[1] Concept: ảnh T → nhân vật ───────► ◆ CỔNG 2: Thùy duyệt phong cách + gương mặt (1 hình "gốc" khoá cứng)
   │
[2] Bộ trạng thái (6 ảnh + chân dung)
   │
[3] Nén + đặt vào style (không phá file cũ) ──► check:style-hs ✔
   │
[4] Animation bằng code ─┐
[5] Kỹ năng (chiêu)      ├─ song song, cùng đọc hồ sơ
[6] Lời thoại            ┘
   │
[7] Gắn vào hành trình (dữ liệu: boss cuối, trận 3 pha, cutscene, phần thưởng)
   │
[8] QA 1180×820 · 1440×900 · 390×844, tài khoản HS thật ──► ◆ CỔNG 3: Thùy duyệt trên iPad
   │
[9] Deploy thủ công ─────────────────► ◆ CỔNG 4: Thùy bấm Create Deployment (auto-deploy đã tắt)
```

Ai làm gì: **Thùy** (ảnh gốc, 4 cổng duyệt, sửa chữ lời thoại) · **ChatGPT** (vẽ ảnh, 1 hình/lượt) · **Claude** (hồ sơ, đơn đặt hàng, nén ảnh, animation, dữ liệu, tích hợp, QA).

---

## 2. Trạm 0 — Hồ sơ nhân vật (Claude soạn, Thùy duyệt) · ~0,5 ngày

Giấy 1 trang, mọi trạm sau chỉ đọc nó. Mẫu để Thùy điền/sửa:

```
BOSS CUỐI — HỒ SƠ
Tên (VN):           ...                      Mã file: boss_cuoi_<mon>      (vd boss_cuoi_toan)
Môn / hành trình:   Toán (mỗi môn 1 boss cuối riêng, cùng khuôn — xem §7 Symmetry)
Vị trí:             đứng sau lục địa cuối của hành trình môn đó
Nguồn gốc:          ảnh gốc của T (đính kèm) → GIỮ: ____ · BIẾN ĐỔI: ____ · BỎ: ____
Vai trong truyện:   (vd "Người gác cổng của Tháp Tri Thức" / "thầy cô hóa thành quản trò")
Tính cách:          3 từ (vd nghiêm · hóm · công bằng)
Giọng nói:          (vd xưng "ta", gọi HS là "chiến binh", KHÔNG mỉa mai, KHÔNG làm HS xấu hổ)
Silhouette:         3 đặc điểm nhận ra từ xa (vd áo choàng dài · quyển sách phát sáng · kính)
Bảng màu:           3 màu chủ đạo + 1 màu nhấn (lấy từ palette style RPG; không màu mới)
Style áp dụng:      RPG (V1) · Thị trấn (nếu đủ hình: bản "dễ thương", cùng nhân vật khác nét)
Phản diện hay thầy: boss là thử thách CÔNG BẰNG — thắng được bằng học, không bằng may
3 chiêu:            xem §5
Câu cửa miệng:      1 câu lặp ở các tình huống (gây nhớ)
Điều CẤM:           (vd không gợi sợ hãi, không máu, không hình thể giễu cợt)
```

**Quyết định hồ sơ phải chốt trước khi vẽ** (CTO đề xuất mặc định, §12 hỏi Thùy):
- *Giống Thùy đến mức nào*: đề xuất **cách điệu anime RPG nhận ra được qua 2–3 nét** (kiểu tóc/kính/trang phục), không chân dung chép thực. Lợi: ChatGPT giữ nét dễ hơn qua nhiều hình, và không thành "ảnh thật của một người đứng ra đánh học sinh".
- *Hình thể thứ hai*: pha 2 của trận (nổi giận) là **cùng nhân vật đổi trang bị/hào quang**, không biến thành quái vật. Giữ một khuôn mặt xuyên suốt cho cảm giác "đây là Thùy".

---

## 3. Trạm 1 — Ảnh T → nhân vật (ChatGPT) · ~0,5–1 ngày

**Luật giao hàng (như Đơn 1 v2/Đơn 6, đã trả giá đắt):** context ChatGPT MỚI → dán `design/CHATGPT-UI-KIT.md` → dán đơn → đính ảnh gốc của T
+ ảnh style tham chiếu (`design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png`) · **MỖI LƯỢT = ĐÚNG 1 HÌNH** vẽ bằng công cụ tạo ảnh
· **cấm** dựng bằng code/SVG/ghép khối · **cấm** zip/DESIGN.md · ảnh trong chat LÀ file giao.

Thứ tự (dừng chờ "tiếp" sau mỗi hình):

| # | Hình | Mục đích | Cổng |
|---|---|---|---|
| 1 | `concept_a` — 3 phương án nhân vật từ ảnh T (1 ảnh gồm 3, chỉ để chọn, không cắt dùng) | Chọn hướng cách điệu | Thùy chọn 1 |
| 2 | `boss_cuoi_<mon>_goc` — toàn thân, đứng thẳng, 3/4, nền **trong suốt thật**, 1254×1254 | **Hình GỐC**: khoá gương mặt, trang phục, bảng màu | **◆ CỔNG 2** |
| 3 | `turnaround` — thân trước · 3/4 · bên · sau (1 ảnh, tham chiếu, không dùng game) | Giữ nhất quán cho các pose sau | — |

**Mẹo giữ nhất quán qua nhiều lượt (ChatGPT dễ trôi nét):** từ hình #2 trở đi, MỖI lượt đều đính lại hình gốc + dán lại *câu mô tả cố định* (§2: silhouette + bảng màu).
Nếu nét trôi: không sửa tiếp trên hình lệch, quay lại hình gốc và sinh lại pose đó.

**Kiểm trước khi nhận** (Claude làm): nền trong suốt thật (alpha, không viền trắng) · cùng nguồn sáng (từ trái-trên, như Đơn 1) · vật thể ~80% khung, chừa lề cho hào quang/vũ khí ·
cùng cỡ đầu giữa các pose · không chữ/số trong ảnh · không dính bản quyền nhân vật game nào.

---

## 4. Trạm 2–3 — Bộ trạng thái + đưa vào style

### 4.1 Danh sách ảnh (V1 = 6 ảnh + 1 chân dung)

Mẫu của quái thường (spec-v1 §4.4): *đứng · trúng đòn · bị hạ*. Boss cuối cần thêm vì có thoại + chiêu + 2 pha:

| # | File (`public/bk-ui/hs/skin/rpg/`) | Dùng khi | Ghi chú vẽ |
|---|---|---|---|
| 1 | `boss_cuoi_<mon>_dung.png` | đứng chờ (idle), nghe HS trả lời | = hình gốc |
| 2 | `boss_cuoi_<mon>_noi.png` | **đang nói** (miệng mở, tay giơ) | cùng khuôn mặt, chỉ đổi miệng/tay — để *đổi mặt khi thoại* |
| 3 | `boss_cuoi_<mon>_chieu.png` | gồng/niệm chiêu (báo hiệu trước đòn) | tư thế tích lực, hào quang sáng dần |
| 4 | `boss_cuoi_<mon>_trung.png` | trúng đòn (HS trả lời đúng) | nhăn mặt nhẹ, **không đau đớn/máu** |
| 5 | `boss_cuoi_<mon>_gian.png` | pha 2 (≤50% máu) | đổi hào quang/trang bị, **cùng mặt** |
| 6 | `boss_cuoi_<mon>_ha.png` | bị hạ (kết) | mỉm cười công nhận, tan thành ánh sáng — **không ngã/chết** |
| 7 | `boss_cuoi_<mon>_chandung.png` | khung hội thoại (cắt ngực trở lên) 512×512 | dùng cho bong bóng thoại ở màn nhỏ |

Sau V1 (nếu còn giờ): `_vui.png` (khen), `_nghi.png` (chờ HS nghĩ), bản **Thị trấn** (§9).
**Tại sao 6 chứ không 20:** animation sống bằng code (§6), ảnh chỉ cần *những tư thế khác nhau thật*. 20 ảnh = 20 lượt ChatGPT = trễ hạn + lệch nét.

### 4.2 Nén + đặt vào style (Claude)

- Nén PNG trong suốt ≤ ~300 KB/ảnh, đích 1024px cạnh dài (hiển thị cần ≤ 640px; giữ dư cho iPad retina).
- **TÊN MỚI, không đè/xoá file cũ** (PWA còn giữ JS cũ — `STYLE-HS.md` §2). Ảnh gốc chưa nén → `design/bk-ui-src/boss/`.
- Khai vào style: thêm khoá `boss` trong `skin/styles/rpg.ts` (hợp đồng `kieu.ts`) — **mọi style khai đủ**, thiếu thì `check:style-hs` báo. **Không `if (skin === 'rpg')`.**
- `npm run check:style-hs` ✔ trước commit.

---

## 5. Trạm 5 — Kỹ năng của boss (thiết kế)

### 5.1 Nguyên tắc
- **Chiêu = hình thức hoá của 1 luật học.** Mỗi chiêu phải trả lời được: *"nó thử HS về cái gì?"* — và cái đó đọc từ dữ liệu có thật (dạng/cụm/mức độ), không bịa.
- **Công bằng, đo được:** HS thua vì chưa nắm dạng nào ⇒ hệ ghi nhận đó là dạng yếu (đã làm sẵn qua mastery), boss không "hồi máu ngẫu nhiên".
- **Không hộp quà may mắn:** không chiêu nào cho HS trả xu/điểm mua lợi thế (spec-bk-world §3.2 #4).
- Trẻ em: không "đánh HS". Chiêu của boss là **câu đố hoá hiện tượng** (đòn nhắm vào *bài*, không vào *em*).

### 5.2 Ba chiêu V1 (CTO đề xuất — Thùy sửa tên/ý)

| Chiêu | Hiện trên màn | Luật học thật (suy từ dữ liệu) | Phase |
|---|---|---|---|
| **Cổng Kiểm Tra** (mở màn) | boss gồng, hiện "khiên" = số dạng em *đã đạt* | Số khiên = số dạng của khu vực cuối ở trạng thái `dat`. Mỗi câu đúng phá 1 khiên (không máu vô lý) | 1 |
| **Sương Mù Chưa Biết** | sương phủ quanh ô boss | Dùng dạng em `chua_do` (sương mù đã có trên bản đồ): boss ra câu thuộc dạng chưa đo — trả lời đúng = "tan sương" = *mở ô đo mới* (HS × dạng) | 1→2 |
| **Ôn Lại Dạng Cũ** | boss gọi lại 1 dạng yếu cũ | Câu lấy từ dạng em `yeu` ở lục địa trước (hàm chọn câu có sẵn, `_btyeu_chon_cau` kiểu MCQ tuyệt đối). Đúng = "quái cũ bị hạ lần nữa", boss kiệt sức | 2 |

- Số pha, máu từng pha = **tính ở Postgres** (`fn_boss_cuoi_*`, §7), client chỉ vẽ.
- Câu hỏi trong trận: **chỉ MCQ** (spec-mcq-form: luồng bài làm trên app dùng điều kiện `_kho_dk_mcq_sql`). Dạng chưa có MCQ ⇒ không vào trận boss (báo rõ), không nới luật.
- Ngoại lệ sau V1: chiêu "đặc sản" theo môn (Toán: *Phép Chứng Minh*…) — khi đó mỗi môn khai 1 dòng, không code riêng.

### 5.3 Bảng dữ liệu kỹ năng (khuôn, để mở rộng không động vào code)

```
boss_chieu(ma_boss, ma_chieu, ten, mo_ta_ngan, phase, loai_cau,  -- 'dat'|'chua_do'|'yeu'
           anh_hieu_ung, thoi_luong_ms, thu_tu)                    -- anh_hieu_ung = khoá hiệu ứng code §6
```
Thêm chiêu = thêm dòng, không sửa component. (V1 có thể là file TS như `noiDungTutorial.ts`; chuyển DB khi >1 boss.)

---

## 6. Trạm 4 — Animation (Claude, bằng code)

### 6.1 Vì sao code, không video/sprite sheet
- ChatGPT = 1 hình/lượt, **không** cho animation nhất quán; sprite sheet nhiều frame sẽ lệch nét (đúng rủi ro đã ghi ở `nghien-cuu-do-hoa` §6).
- Bài học Little Habitats: *đẹp = hệ thống thống nhất*, không phải nhiều asset. Cho 6 ảnh + chuyển động bằng code → nhẹ (iPad Gen 7), chạy mọi style.
- Chỉ dùng `transform`/`opacity` (GPU), không animate `width/top/filter blur lớn`. Tôn trọng `prefers-reduced-motion` (tắt rung/nháy, giữ đổi ảnh).

### 6.2 Bảng chuyển động (component `QuaiHS`/`BossHS` đọc `boss` của style)

| Trạng thái | Ảnh | Chuyển động code | Thời lượng |
|---|---|---|---|
| `idle` | `_dung` | thở: scaleY 1→1.015 + bob ±3px; hào quang pulse chậm | vòng 3,2 s |
| `noi` | `_noi` ↔ `_dung` | **đổi ảnh theo nhịp chữ** (typewriter: mỗi ~120 ms) + nghiêng nhẹ khi nhấn từ | theo độ dài câu |
| `bao_hieu` (trước chiêu) | `_chieu` | lùi + phóng 1.04, hào quang sáng dần, vòng báo trước hiện ở ô sắp bị "đánh" | 700 ms |
| `ra_chieu` | `_chieu` | lao tới (translateX) + hạt hiệu ứng (khoá `anh_hieu_ung`) → thu về | 450 ms |
| `trung_don` | `_trung` | nháy trắng 1 frame + rung ngang 6px×3 + thanh máu tụt có trễ + số "−N" nổi | 400 ms |
| `gian` (qua 50%) | `_gian` | flash toàn màn + hào quang đổi màu + nhạc/âm đổi | 900 ms |
| `bi_ha` | `_ha` | ngồi dần (scale 0.96) → **tan thành hạt sáng** (opacity + hạt bay lên) — không ngã | 1,6 s |

- Hiệu ứng hạt, nháy, sóng: viết **một** module VFX dùng chung (một bảng màu, theo kiểu Little Habitats: palette riêng của style) — chiêu chỉ gọi khoá.
- Âm thanh: V1 **không bắt buộc**; nếu có, 4 tiếng (gầm nhẹ báo hiệu · trúng · pha 2 · hạ), tắt được. Không âm thanh gây sợ.
- Hiệu năng: cảnh trận ≤ 1 boss + ≤ 40 hạt; đo FPS trên iPad Gen 7 (mục tiêu thiết bị thấp nhất của BK) trước cổng 3.

---

## 7. Trạm 7 — Gắn vào hành trình (dữ liệu + trận)

### 7.1 Vị trí trong bản đồ
Bản đồ hiện: Môn → Lục địa → Khu vực → Màn(dạng) → Quái(cụm). Boss khu vực = màn có `la_man_boss`. **Boss cuối = một "màn" đặc biệt SAU lục địa cuối** của hành trình môn đó:
- Mở khi nào: (đề xuất) khi em đã `dat` ≥ N% dạng của mọi boss khu vực — hoặc đơn giản hơn V1: khi em đã **chinh phục (cắm cờ) mọi boss khu vực** ở lục địa cuối. *Hỏi Thùy §12.*
- **Đối xứng môn (CLAUDE §1.6):** khuôn y hệt cho Toán/Văn/Anh/KHTN; mỗi môn một dòng cấu hình boss cuối (tên, ảnh, thoại). **Cấm** `if (mon === 'Toán')` trong code chung. Đây cũng là data HỌC TẬP ⇒ **mang nhãn `mon`**.
- Tiếng Anh: boss + chiêu dựng từ giáo trình Anh, không bê khuôn Toán (memory: `anh-khong-be-khuon-toan`).

### 7.2 Hợp đồng dữ liệu (bổ sung §13.4; luồng SỐ LIỆU làm thật, GIAO DIỆN dựng giả theo hình này)

```ts
// fn_boss_cuoi_cua_toi(p_mon text) → jsonb      (ĐỀ XUẤT — chưa có)
{ mon: string,
  ma_boss: string,                // 'boss_cuoi_toan' — khớp tên file ảnh của style (như loai_quai)
  mo: boolean,                    // đủ điều kiện vào chưa (SUY, không lưu)
  ly_do_chua_mo: string | null,   // cho thoại "chưa đủ sức": 'thieu_boss_khu_vuc' | 'thieu_dang' | null
  da_ha: boolean,                 // SUY từ mastery — không có cột "đã thắng boss"
  phase: 1 | 2,                   // theo % máu còn
  mau_con: number, mau_tong: number,   // = khoảng cách tới 'đạt' (fn_*, §4.2) — KHÔNG số riêng
  chieu: { ma: string, phase: number, loai_cau: 'dat'|'chua_do'|'yeu' }[] }
```
- **Trạng thái thắng = suy từ mastery, không lưu** (CLAUDE §1: mastery suy động; §4: không đẻ row chờ). Chỉ khi cần "khoe" ⇒ tin Thế giới `kieu='boss_cuoi'` tự đẻ bằng trigger như tin `chuoi` (mốc A/S).
- Mọi con số (máu, pha, khiên, ngưỡng mở) nằm ở `fn_boss_cuoi_*` Postgres. Client: `supabase.rpc`, render.
- Mỗi lượt trận = lượt học thật → đi qua cổng `_luot_hoc_that()` (≥5/10 · không lặp câu · ≥6 s/câu). Boss không phải đường lách để cày điểm.
- **Kho rác, không xoá cứng** nếu bảng boss/lời thoại sau này chuyển sang DB và có bảng khác trỏ text tới nó (CLAUDE §2: tham chiếu text không FK).
- Mọi migration: timestamp (`npm run new-migration`), áp bằng `npm run migrate`, `npm run schema`, kiểm `check` CHECK nếu thêm giá trị (`kieu`, `loai_quai`…).

### 7.3 Dòng chảy một trận (màn hình)
```
Bản đồ ─ chạm "Boss cuối" ─► [CUTSCENE MỞ] 3–5 bong bóng thoại, boss _noi, nền tối dần
   ─► [TRẬN P1] Cổng Kiểm Tra + Sương Mù (câu MCQ, mỗi câu đúng = 1 đòn; sai = boss ra chiêu nhẹ, không trừ "mạng" của em)
   ─► (≤50% máu) [CHUYỂN PHA] _gian + thoại pha 2
   ─► [TRẬN P2] Ôn Lại Dạng Cũ
   ─► máu = 0 ► [CUTSCENE KẾT] _ha, thoại công nhận, phần thưởng
        └ hết lượt/thoát giữa chừng ► thoại "hẹn gặp lại" (KHÔNG trừng phạt, KHÔNG báo công khai em thua)
```
- Sai câu: không "game over" kiểu mất điểm tiền. Boss chỉ "hồi 1 nấc" tối đa theo luật cố định (công khai), vì phần thưởng thật là học.
- Kết quả trận (mỗi câu đúng/sai) ghi như mọi lượt luyện (không bảng riêng) — ô (HS × dạng) lấp dần theo đo thật.

### 7.4 Phần thưởng (đề xuất; số cụ thể tính ở DB)
- Huy hiệu **"Chinh phục \<Môn\>"** (gami, hình đặt qua đơn gami) + **tin S lên Thế giới BK** (khoe được).
- **Không** cho xu/điểm vượt trần: nếu thưởng xu thì tính **chung trần tháng** (spec-bk-world §3.2 #1).
- Mở **chế độ "gặp lại boss"** (đánh luyện vui, không thưởng lặp) + NPC nói chuyện/giao mini-nhiệm vụ (nối BK World sau).

---

## 8. Trạm 6 — Lời thoại (Thùy sửa chữ, Claude gắn vào)

### 8.1 Cách lưu
V1: **`src/screens/hocsinh/boss/noiDungBoss.ts`** — cùng mẫu `noiDungTutorial.ts` (Thùy sửa chữ ở đó, không đụng code màn). Mỗi dòng:
`{ ma, khi, noi, mat }` — `mat` ∈ `dung | noi | chieu | trung | gian | ha` (ảnh nào hiện khi câu này hiện).
Khi >1 boss hoặc cần chỉnh runtime không deploy ⇒ chuyển bảng `boss_loi_thoai`.

### 8.2 Danh mục tình huống V1 (14 câu — Thùy viết/duyệt giọng; Claude soạn nháp)

| Mã | Khi nào | Số câu | Ý |
|---|---|---|---|
| `gap_lan_dau` | lần đầu chạm boss | 3 | tự giới thiệu, nêu luật công bằng ("ta không đánh em, ta thử bài") |
| `chua_du_suc` | `mo = false` | 1–2 | gợi *đúng* thiếu gì (theo `ly_do_chua_mo`), khích lệ quay lại |
| `bat_dau` | vào trận | 1 | câu cửa miệng |
| `dung` | HS trả lời đúng | 2 (xoay) | công nhận cụ thể ("dạng này em nắm rồi") |
| `sai` | HS sai | 2 (xoay) | **không mỉa**; gợi hướng, nối `ma_loi` **chỉ khi chắc 100%**, không chắc thì nói chung (CLAUDE §1.5) |
| `mau_75/50/25` | mốc máu | 1 mỗi mốc | nhịp kịch tính |
| `chuyen_pha` | qua 50% | 1 | "Giờ ta nghiêm túc đây" (vẫn thân thiện) |
| `ha` | hạ boss | 2 | công nhận, nói điều em đã làm được (đọc từ số liệu: số dạng, số ngày chuỗi) |
| `roi_giua_tran` | thoát/hết giờ | 1 | "hẹn em lần sau" |
| `gap_lai` | sau khi đã thắng | 1–2 | vui, nhắc ôn dạng yếu mới |

Sau V1: thoại theo **cấp lớp** (giọng cấp 1 khác cấp 3, cùng nội dung) · theo **chuỗi** ("em giữ chuỗi 12 ngày rồi nhỉ") · biến thể theo style (Thị trấn: giọng dễ thương hơn).

### 8.3 Luật giọng (đánh dấu cho cả Thùy và Claude)
- ≤ **2 câu / bong bóng**, ≤ 90 ký tự mỗi bong bóng (đọc được trên điện thoại 390px). Tiếng Việt có dấu, xưng hô cố định theo hồ sơ.
- Không chê HS, không so sánh với bạn, không "yếu/kém", không đe doạ. Thất bại = "chưa tới".
- Dữ kiện nói về HS (số dạng, số ngày) **lấy từ hàm DB**, không để client tự đếm.
- Chữ nằm trong `TheHS`/bong bóng của skin, không đặt thẳng trên tranh nền (STYLE-HS §2).

---

## 9. Style 2 (Thị trấn) — nếu đủ hình
Cùng hồ sơ, **cùng ma_boss**, khác nét: bản dễ thương (linh vật hoá/ nhân vật chibi). Spec-v1 §4.4/§5 yêu cầu mỗi style đủ bộ mới tính "xong";
V1 chấp nhận boss cuối **chỉ RPG**, Thị trấn rơi về hình RPG tạm (hoặc ẩn boss cuối) cho tới khi có hình, và *phải ghi rõ* — không để vỡ ngầm.

---

## 10. Lịch gợi ý bám deadline 06/10 (hôm nay 01/10)

| Ngày | Việc | Cần Thùy |
|---|---|---|
| 01/10 | Trạm 0: hồ sơ (Claude soạn nháp, Thùy sửa) · gửi ảnh gốc của T | **Ảnh gốc + duyệt hồ sơ (CỔNG 1)** |
| 02/10 | Trạm 1: concept → hình gốc | **Chọn phương án + duyệt hình gốc (CỔNG 2)** |
| 02–03/10 | Trạm 2: 6 ảnh + chân dung (ChatGPT, 1 hình/lượt) · Claude làm animation + thoại nháp *song song* bằng hình tạm | Gõ "tiếp" từng hình |
| 03–04/10 | Trạm 3 nén + khai style · Trạm 5/6 chốt · hợp đồng `fn_boss_cuoi_cua_toi` (nhờ luồng SỐ LIỆU qua Hộp thư §13.6) | Duyệt thoại |
| 04–05/10 | Trạm 7: trận 2 pha trên dữ liệu giả → thật | |
| 06/10 | Trạm 8: soi bằng tài khoản HS thật, iPad | **CỔNG 3 + 4 (duyệt, bấm deploy)** |

**Rủi ro & cách giảm:**
- ChatGPT lệch nét giữa pose → giữ hình gốc làm ảnh tham chiếu mọi lượt; thà ít pose còn hơn lệch; V1 chỉ 6.
- Hình về trễ → animation + thoại chạy được bằng **hình tạm** (hình gốc dùng cho mọi trạng thái, đổi bằng code: nháy/màu), thay ảnh thật là đổi 1 dòng khai style.
- Kịp deadline không nổi → **cắt theo thứ tự:** (1) Style Thị trấn · (2) pha 2 · (3) cutscene dài → còn: 1 trận, 1 pha, thoại cơ bản. Không cắt: công bằng + gắn mastery thật.

---

## 11. Nhánh 3D — NPC trong BK World (sau V1, chỉ để khỏi làm lại)

Dùng lại **nguyên hồ sơ (§2), lời thoại (§8), kỹ năng (§5)**. Khác ở hình + animation:
- **Hình:** concept 2D đã duyệt → Tripo/Meshy (Pro, dùng thương mại) hoặc Rodin tạo mesh quad sạch rồi rig tay. Giá/giấy phép đã tra 30/09 (`nghien-cuu-do-hoa` §6): Free = CC BY / không thương mại ⇒ cần gói trả phí.
- **Animation:** AI tự rig chỉ cho **đi bộ**; *gầm/tung chiêu/trúng đòn/chết* phải animator key tay (~1–3 ngày/con, ước lượng chưa đo — `nguon-mo-hinh-boss-bat-thu.md` §5). Nhân vật dạng **người** thì Mixamo dùng được (nó chỉ hỗ trợ humanoid) — lợi thế của việc boss là *người cách điệu* chứ không phải thú.
- **Render:** qua lớp hoàn thiện chung (shader toon/outline/grade, bảng màu một file) để khớp style game; không dùng asset mua đưa vào AI (cấm theo EULA).
- **Vai NPC:** bảng nhiệm vụ → xu, **chung trần tháng** (spec-bk-world §3.2 #1, §4 câu 3).
- Tên "BK World" đang trùng "Thế giới BK" (spec-bk-world §3.2 #6) — chờ Thùy đặt tên khác trước khi in lên NPC/thoại.

---

## 12. Đã chốt (Thùy 01/10) + còn chờ

**Đã chốt:** (1) ảnh gốc = chân dung của Thùy · (2) làm **1 boss mẫu** trước; sau này mỗi GV một boss riêng ⇒ làm khuôn lặp lại (§A.5) · (3) điều kiện mở/thưởng thuộc gameplay, **chưa cần quyết** (dùng mặc định ở §7, đổi sau không ảnh hưởng asset).

**Còn chờ (chỉ liên quan asset):**
1. ✔ **Ảnh gốc đã có:** `design/bk-ui-src/anh_thuy.jpg` (928×1120, nửa người, nền trắng, nhìn thẳng, 2 ngón cái). Cần cắt bỏ logo sao góc dưới phải trước khi đính vào ChatGPT. Ảnh KHÔNG có thân dưới ⇒ tỉ lệ toàn thân để ChatGPT suy; kiểm kỹ ở hình gốc.
2. ✔ **Đã chốt:** mặt là chính, chibi, quần áo tuỳ ChatGPT. Nét nhận mặt + đơn ChatGPT: `design/DON-HANG-BOSS-THUY.md`.
3. **Làm đường 3D ngay không?** Mặc định: **chỉ 2D** cho V1; 3D khi BK World cần NPC.

---

## 13. Checklist nghiệm thu (trước CỔNG 3)

- [ ] Hồ sơ có chữ ký duyệt của Thùy; hình gốc khoá.
- [ ] 6 ảnh + chân dung: alpha thật, cùng nguồn sáng, cùng mặt, đặt tên mới, **không đè file cũ**.
- [ ] Khai trong `rpg.ts`; `npm run check:style-hs` ✔; không màu gõ tay, không `if (skin===…)`.
- [ ] Animation: 7 trạng thái §6.2 đủ; `prefers-reduced-motion` ổn; FPS iPad Gen 7 ổn.
- [ ] Mọi số (máu/pha/khiên/mở) từ `fn_boss_cuoi_*`; client không `reduce/filter.length` nghiệp vụ (CLAUDE §2.0).
- [ ] Dữ liệu học tập có nhãn `mon`; không có nhánh riêng một môn trong code chung.
- [ ] Sau mutation (xong 1 câu) không blank màn/refetch cả danh sách (CLAUDE §2); thoát trận rồi vào lại về đúng chỗ.
- [ ] Trận chỉ MCQ; dạng thiếu MCQ báo rõ, không nới luật.
- [ ] Lượt trận đi qua `_luot_hoc_that()`, có báo "lượt chưa tính" ở kết quả (`ketQuaLuotHocThat`).
- [ ] Thoại: ≤2 câu/bong bóng, không chê HS, dữ kiện từ DB, đọc được 390×844.
- [ ] Soi 1180×820 · 1440×900 · 390×844 bằng **tài khoản HS thật** (script không thấy RLS).
- [ ] Deploy thủ công — nhắc Thùy bấm Create Deployment.

---

## 14. Đứng trên vai ai (R7)
- **Boss fight là dạy học:** Vygotsky ZPD (câu vừa sức qua mastery) + **faded worked examples** (đã dùng ở `spec-dien-o.md`) + *worked boss* của Duolingo "legendary" (thử thách tổng kết).
- **Boss 2 pha / báo hiệu chiêu:** thiết kế *telegraphing* của Souls-like (đòn có báo trước — công bằng) · Slay the Spire (ý đồ của quái hiển thị).
- **Hoạt hoá ảnh tĩnh:** kỹ thuật *cut-out/puppet animation* & *juice* (Vlambeer "Art of Screenshake") — rung/nháy/hạt tạo cảm giác lực dù ảnh ít.
- **Look-dev thống nhất:** Little Habitats / Poseidia (`nghien-cuu-do-hoa` §1, §5).
- **Trục dữ liệu "thắng = suy ra":** invariant của CLAUDE §4 (không bảng "boss đã thắng", chỉ suy từ đo).
