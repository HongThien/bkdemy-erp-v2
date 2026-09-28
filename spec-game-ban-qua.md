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

## 6. Còn hỏi Thùy
- Chế độ đội: đạn trúng xe đội mình có mất máu? bắn trúng hộp quà có cộng điểm đội? (chưa trả lời — CTO tạm: có mất máu nhưng không tính điểm; đội chỉ bắn nhau)
- EXP đội: rương Vàng (TB 300) / Bạc (TB 250) của Mở Rương ⇒ TB ~260–275/HS, **cao hơn mốc 200**. Giữ, hay đội thua = Gỗ (175)?
