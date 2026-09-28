# Game "Bắn Quà" (artillery kiểu Worms / GunBound) — spec (NHÁP, đang hỏi–đáp với Thùy)

> Thùy 28/09: game giờ ra chơi, dùng điểm làm bài; chơi CÁ NHÂN (bắn hộp quà → xếp hạng → EXP) hoặc ĐỘI (hỗn chiến 2–4 đội).
> Thể loại: **artillery game** (Scorched Earth 1991 → Worms 1995 → GunBound 2002). Luật do Thùy viết; CTO lo kịch bản kỹ thuật + nối ERP.
> Trạng thái: CHƯA code. Đang chờ Thùy trả lời §4.

## 1. Đã chốt (Thùy 28/09)

| # | Câu | Chốt |
|---|---|---|
| 1 | "Bắn xa thì yếu" | Chỉ **nổ xa tâm mục tiêu thì yếu** (nổ lan). Khoảng cách người bắn → mục tiêu KHÔNG giảm sát thương |
| 2 | Gió | **Có**, đổi ngẫu nhiên mỗi lượt (nguồn may mắn chính) |
| 3 | Ngắm | **Chỉnh góc + kéo thanh lực** (kiểu GunBound) — "chơi dần là quen" |
| 4 | Địa hình | **Phá được** — nổ khoét hố (kiểu Worms) |
| 5 | Đạn | 5 loại: Thường · Bom to (rộng/yếu) · Xuyên (hẹp/mạnh) · Chùm (tách 3) · Nảy — luật "phạm vi rộng thì dmg bé, hẹp thì dmg to" |
| 6 | Điểm làm bài → đạn | Sau xếp hạng buổi, **vòng quay đạn cho cả lớp: mỗi bạn quay ra 3 loại, tới lượt chọn 1 trong 3** |
| 7 | Số phát | Cá nhân **1 phát/bạn**. Đội: số phát = số người của **đội đông nhất** (đội ít người thì có bạn bắn 2 lần) |
| 8 | Hộp quà | 3 loại đứng yên (nhỏ ít máu/ít điểm … to nhiều máu/nhiều điểm), rải ngẫu nhiên |
| 9 | Thưởng | Cá nhân: xếp hạng theo điểm → **mỗi hạng EXP cố định**. Đội: **thắng → rương Vàng, thua → rương Bạc**, mở rương thì từng thành viên nhận quà (xem §4 câu 1) |
| 10 | Trà sữa | **Có** (hộp trà sữa hiếm trên bản đồ) |
| 11 | Đội | **Cả đội chung 1 nhân vật** (kiểu GunBound), thành viên thay nhau bắn |
| 12 | Kết thúc đội | **GV đặt thời gian**; hết giờ xếp theo **tổng sát thương gây ra** (không theo máu còn) — vì hỗn chiến |
| 13 | Số đội | **2 · 3 · 4 đội, hỗn chiến** |
| 14 | Thiết bị | **1–2 iPad/lớp** (lớp rất đông tối đa 4) + TV |

## 2. Kỹ thuật (CTO tự quyết — R2)

- **Lần lượt** (không bắn cùng lúc): 1–2 iPad không cho phép cùng lúc; thể loại vốn theo lượt. ~8s ngắm (đồng hồ) + ~4s bay/nổ
  ⇒ lớp 10 bạn ≈ 2 phút. iPad = tay cầm chuyền tay; không có iPad thì chơi thẳng trên laptop TV bằng chuột.
- **2.5D**: three.js (như Mở Rương/Chiếm Đất), camera nhìn ngang. Địa hình = lớp 2D (bitmap mặt nạ) để khoét hố + tính va chạm
  chính xác; nhân vật / pháo / hộp quà / đạn là model 3D KayKit đặt lên trên. Vật lý đạn: trọng lực + gió, tự viết (không cần thư viện).
- **EXP ở DB (§2.0)**: TV chỉ báo điểm game thô (sát thương từng phát) lên; **quy ra hạng / EXP / trần** bằng hàm Postgres. Rương đội
  rút ở DB như Mở Rương. Trà sữa rút theo `game_lop_qua_dac_biet`.

## 3. Asset (đã rà 28/09 — tất cả CÓ SẴN trong `Documents/ChatGPT/KayKit`, CC0 / BK đã mua, không phải tải)

| Vai trò | Asset | Nguồn |
|---|---|---|
| Nhân vật bắn | Engineer (hợp "thợ pháo") · Ranger · Knight · Mage … | KayKit Adventurers — **đã dùng trong BK Hero Universe** ⇒ sau này ERP truyền nhân vật HS vào |
| Súng / xe của đội | `snowball_cannon` (pháo) · `siege-catapult` (máy bắn đá) · `siege-ballista` · `kart` | KayKit Holiday · Kenney Castle · Kenney Car |
| Hộp quà | `present_A…F` (6 dáng × 5 màu) · `present_sphere` | KayKit Holiday |
| Hộp trà sữa | `hot_chocolate_decorated` (ly có kem) | KayKit Holiday |
| Đạn | `snowball` · `basketball` (nảy) · `snowball_pile` (chùm) | KayKit Holiday |
| Địa hình / trang trí | block đất-cỏ / cát / đá-vàng (texture) · đèn lồng · bia | KayKit BlockBits · Holiday · Prototype |
| Hiệu ứng nổ | KHÔNG có asset ⇒ tự vẽ (tia lửa, khói, mảnh đất) như Mở Rương/Chiếm Đất | — |

⚠ KayKit Adventurers bản SOURCE là hàng trả phí — không đưa file source lên repo public (chỉ GLB runtime như Hero Universe).

## 4. Chốt đợt 2 (Thùy 28/09)

| # | Câu | Chốt |
|---|---|---|
| 15 | Rương đội | **Mở 1 lần cho cả đội, cả đội nhận CHUNG 1 quà** ("mỗi người tự mở lâu quá") |
| 16 | EXP cá nhân | Như luật cũ, **TB 200** — CTO phân: tuyến tính **Nhất 300 → cuối 100**, bước 10; bằng điểm = cùng hạng, chia TB EXP các hạng đó |
| 17 | Vòng quay đạn | **Giải khác nhau**: Nhất dễ ra đạn xịn (xuyên/bom to/chùm) hơn — bảng trọng số `QUAY` trong game (bản chính thức: DB) |
| 18 | Hình ảnh | **Pháo/súng**, **2D kiểu Worms, hiệu ứng mượt, KHÔNG cần 3D** ⇒ bỏ three.js; sprite render sẵn từ KayKit (`games-site/assets/ban-qua/`) |
| 19 | Bối cảnh | **Chung chung (không Trung thu), sẽ có nhiều bối cảnh** — làm 1 cái test trước (`THEMES.dong_co` "Đồng cỏ") |

## 5. BẢN CHƠI THỬ v0 (28/09) — `games-site/ban-qua.html` (hub: 🎯 Bắn Quà · THỬ NGHIỆM)

- Chế độ CÁ NHÂN, chạy trên laptop (← → góc · 1 2 3 đạn · GIỮ Space nạp / THẢ bắn) hoặc cảm ứng (nút phải dưới + chạm thẻ đạn).
- Luồng: gõ danh sách **Tên | giải** → 🎰 vòng quay (mỗi bạn 3 đạn, thứ tự bắn xáo) → mỗi bạn 1 phát, 10s ngắm (hết giờ mất lượt) →
  🏆 bảng kết quả + EXP. Gió −10…+10 đổi mỗi lượt (mây trôi theo gió), vạch **lực + góc lượt trước** để lớp học theo nhau.
- Đạn: Thường r58/45 · Bom to r115/28 · Xuyên r28/100 · Chùm tách 3 ở đỉnh r42/24 · Nảy 2 lần r58/45; mép nổ còn 30%. Hộp: nhỏ 40 máu/+30 ·
  vừa 80/+80 · to 140/+150 khi phá; điểm = sát thương gây ra + thưởng phá hộp. Máu hộp giữ qua các lượt (bạn sau "ăn" hộp bạn trước đánh dở).
- Địa hình bitmap khoét hố + cháy xém, hộp/pháo rơi khi mất đất. Hiệu ứng: chớp màn, cầu lửa, sóng xung kích, khói, đất văng, tàn lửa,
  pháo giấy + xu khi phá hộp, số sát thương, "CHÍNH XÁC!" khi trúng gần tâm, rung màn, hit-stop. Âm thanh WebAudio tổng hợp.
- `?trasua=1` đặt 1 hộp trà sữa (phá ⇒ hiệu ứng `lib/bk-tra-sua.js`) · `?cham=0.25` quay chậm để soi hiệu ứng.
- Verify: chơi tự động trọn 10 lượt (bắn thật qua vật lý) → bảng 10 hạng, EXP 300…100 TB đúng 200, 0 lỗi console.
- CHƯA: chế độ đội · nối ERP (danh sách/giải từ Buổi học, vòng quay + EXP rút ở DB, trà sữa theo `game_lop_qua_dac_biet`) · iPad làm tay cầm ·
  thêm bối cảnh · Thùy chơi thử & chỉnh số.

## 5b. v1 (Thùy 28/09 chơi thử v0 ⇒ 3 góp ý) — THAY luật hộp của v0

| # | Góp ý Thùy | Đã làm |
|---|---|---|
| 1 | Sau súng phải có địa hình chắn, buộc ngẩng lên trời, không bắn ngang | **Tường đá KHÔNG phá được** (lớp `DA` riêng, `khoet` không đụng) cao tới y≈330 ngay trước súng ⇒ bắn thẳng ngang là đâm tường |
| 2 | Map to hơn · nhiều hộp hơn · khó ở điểm cao chứ không khó bắn trúng · treo hộp đặc biệt trên trời | Thế giới **2400 px** (1,5×) + **camera**: ngắm = lùi xa thấy cả map, đạn bay = bám đạn zoom gần, nổ = giữ rồi lùi ra, mini-map khi zoom. **12–14 hộp dưới đất + 4 hộp vàng treo bóng bay**. Điểm ghi trên hộp: gần nhỏ 20 · vừa 40 · xa to 70 · **trên trời vàng 120** |
| 3 | Người bắn sau lợi vì phá hộp dở · bỏ HP · chỉ có "Chính xác 100%" = trúng điểm đặc biệt ⇒ +20% | **Bỏ máu: trúng là vỡ.** Điểm = điểm hộp × hệ số đạn × (1 → 0,4 ra mép nổ). **Trúng NƠ** (vòng nhấp nháy trên nắp hộp, bán kính 18) ⇒ "🎯 CHÍNH XÁC 100%! +20%". **Hộp vỡ mọc lại chỗ mới đầu lượt sau** ⇒ ai cũng đối mặt số hộp như nhau |

- Hệ số đạn (thay "sát thương"): Thường ×1 r60 · Bom to ×0,55 r120 (dính nhiều hộp) · Xuyên ×1,6 r30 · Chùm 3×0,55 r46 · Nảy ×1 r60.
- Đo 28/09 (máy bắn "bừa" góc 45–75°, lực 30–90, gió ngẫu nhiên, 10 lượt): **7/10 phát trúng**, điểm 0–51; mỗi lượt đều thấy 16 hộp (mọc lại đúng).
  Bắn trúng nơ hộp 40 ⇒ 48 (đúng +20%). 8 lần sinh map: 0 hộp chồng nhau (hết chỗ thì bỏ bớt 1 hộp, không chồng).

## 5c. v2 (Thùy 28/09) — THAY "mọc lại" của v1

- **Mỗi lượt RESET về đúng map ban đầu** (đất đã khoét + hộp đã vỡ trở lại nguyên trạng — `chupMap()` lúc vào trận, `resetMap()` đầu mỗi lượt).
  Lý do Thùy: bắn cá nhân mà người trước bắn vỡ hết quà thì người sau thiệt ⇒ ai cũng bắn cùng 1 bàn. Gió vẫn đổi mỗi lượt (may mắn).
- **Hộp trời "siêu khó":** 2 hộp nhỏ (rộng 54), treo rất cao (y −150…40, gần đỉnh cung bắn), **trôi ngang qua lại** ±100–170px,
  **chỉ vỡ khi đạn CHẠM TRỰC TIẾP** (nổ lan không tính), 150 điểm. Hộp trà sữa cùng luật.
  Đo (mô phỏng 4.000 phát bắn "bừa" góc 45–75°, lực 30–90, gió ngẫu nhiên): **2,7% trúng hộp trời** ⇒ lớp 10 bạn ≈ 1/4 số ván có người ăn.
- Khung toàn cảnh nâng mặt đất lên trên bảng điều khiển (trước đó thẻ đạn đè khẩu súng); vùng hộp trời tránh bảng gió + bảng điểm.

## 5d. Cân đạn bằng giả lập (Thùy 28/09: "không cân đối các loại đạn")

Giả lập `games-site/lib/ban-qua-gia-lap.js` (mở `ban-qua.html?gia_lap=1` → nút 🧪): đúng vật lý + điểm của game; mỗi phát = 1 map mới
(vì game reset map mỗi lượt). HS nhắm nơ 1 hộp đất ngẫu nhiên, lệch góc/lực theo tay nghề (giỏi ±2,5°/±3,4 · TB ±6,8°/±8,5 · kém ±13,6°/±17), KHÔNG bù gió.

| Đạn | hệ số cũ → mới | TB điểm (TB) TRƯỚC | SAU (8 map, 200 phát/ô) | giỏi / kém | % trúng |
|---|---|---|---|---|---|
| Thường | 1,0 → 1,0 | 32 | **38** | 41 / 27 | 79% |
| Bom to | 0,55 → **0,76** | 27 (bét) | **36** | 42 / 29 | 80% |
| Nảy | 1,0 → **0,95** | 37 | **39** | 42 / 31 | 81% |
| Chùm | 0,55 → **0,42** mỗi viên | 52 (gần ×2) | **41** | 45 / 33 | 87% |
| Xuyên | 1,6 → **1,27** | 50 | **41** | 44 / 31 | 69% |

Đích CTO chọn: Thường ≈ Bom to ≈ Nảy (±5%), đạn "xịn" Chùm/Xuyên ≈ +8–10% (vì vòng quay cho Nhất dễ ra xịn — Thùy §4#17). Mỗi đạn khác
nhau ở CÁCH ra điểm (Xuyên trúng ít mà trúng đậm; Chùm/Bom to dễ trúng mà điểm vụn), không khác ở kỳ vọng.
⚠ "Chính xác 100%" đang xảy ra ~20% số phát (Chùm 46% vì 3 viên) — đã xử lý ở §5e.

## 5e. 10 loại đạn, CÂN ĐỀU (Thùy 28/09: "tự cân bằng cho đều nhau, để các loại đạn đều kịch tính" + "thêm ~5 đạn đặc biệt, tham khảo các game kia")

**Kiến trúc:** vật lý + tính điểm gom về **1 bộ máy thuần** trong `ban-qua.html` (`taoPhien/phatMoi/buocPhien` — không vẽ, không âm thanh, trả điểm +
danh sách sự kiện). Game chỉ "diễn" sự kiện (`dienSuKien`); giả lập `lib/ban-qua-gia-lap.js` chạy CHÍNH bộ máy đó (xoá bản vật lý thứ 2 của §5d —
tránh "công thức 2 nơi"). `canBang()` tự chỉnh `he` cho điểm TB (tay nghề TB) mọi đạn bằng đạn Thường.

| Đạn | Nguồn ý tưởng | Cơ chế | he |
|---|---|---|---|
| ❄️ Thường | — | nổ vừa r60 | 1,00 |
| 💣 Bom to | — | nổ r120 | 0,72 |
| 🏀 Nảy | — | nảy 2 lần rồi nổ | 0,87 |
| 🎯 Xuyên | — | nổ r30 | 1,16 |
| 🎆 Chùm | GunBound | tách 3 viên ở đỉnh cung | 0,37/viên |
| 🐑 **Cừu nổ** | Worms "Sheep" | đáp đất rồi CHẠY (leo dốc ≤16px, vướng thì quay đầu + nhảy); **HS bấm Space để nổ**; chạm hộp tự nổ; tự nổ sau 3s · r80 | 0,81 |
| 🍌 **Chuối bom** | Worms "Banana Bomb" | nổ r40 + văng 5 quả chuối, mỗi quả nổ r44 (he×0,6) | 0,45 |
| ☄️ **Sao băng** | Worms "Air Strike" | chạm đất gọi 5 sao băng rơi từ trời quanh chỗ đó, mỗi viên r52 (he×0,6); camera lùi xa giữ mặt đất | 0,48 |
| 🔥 **Lửa lan** | Worms "Napalm" | vỡ 7 giọt lửa lăn trên đất 1,8s, giọt chạm hộp ĐẤT là đốt (he×0,8) | 0,43 |
| ⚡ **Sét** | GunBound "Lightning" | nổ r30 + 3 tia sét đánh 3 hộp đất ngẫu nhiên trong ±380px (he×0,8) | 0,39 |

- Hộp trời vẫn CHỈ vỡ khi chạm trực tiếp (sét/lửa không đánh hộp trời).
- **"Chính xác 100%"**: vòng nơ 18→**11px** và **chỉ xét ở vụ nổ ĐẦU** của phát. Trước: 20% số phát (Chùm 46%).
- Vòng quay: 10 loại, Nhất nghiêng về đạn đặc biệt (`QUAY`); đạn đặc biệt ô vàng lấp lánh. EV mọi đạn như nhau ⇒ "xịn" = kịch tính hơn, không phải điểm cao hơn.
- **Kết quả cân** (canBang 3 vòng × 8 map, kiểm lại 10 map MỚI, 200 phát/ô): tay nghề TB mọi đạn **35–39 điểm/phát**; giỏi 37–44 · kém 27–31;
  % trúng 68% (Xuyên) … 94% (Sét); chính xác 10–13%. Trước khi cân: đạn đặc biệt gấp đôi (Sét 86 · Sao băng 78 · Chuối 74 · Lửa 72 vs Thường 34).
- Verify trong game: mưa sao băng + 3 tia sét chụp màn hình; Chuối tách 5 quả (44 điểm); Space kích nổ Cừu ngay (0,17s); ván 10 lượt đạn ngẫu nhiên chạy hết không lỗi.

## 6. Còn hỏi Thùy
- Chế độ đội: đạn trúng xe đội mình có mất máu? bắn trúng hộp quà có cộng điểm đội? (CTO tạm: có mất máu nhưng không tính điểm; đội chỉ bắn nhau)
- EXP đội: rương Vàng (TB 300) / Bạc (TB 250) của Mở Rương ⇒ TB ~260–275/HS, **cao hơn mốc 200**. Giữ, hay đội thua = Gỗ (175)?
