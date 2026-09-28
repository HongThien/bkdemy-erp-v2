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

## 4. Còn hỏi Thùy
Xem trả lời CTO 28/09 (DEVLOG). Câu 1 = rương đội rút chung hay riêng từng người.
