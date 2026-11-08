# NQ-GKI-2026 · p2 (PHẦN 2 — Dạng 2: giải bài toán bằng cách lập hệ phương trình) — GIẢI MÙ của trạm soát

Nguồn: ảnh `trang/p-2.png` (Dạng 2, Bài 1–3). Script kiểm: `<LV>\tam\soat_mu.mjs` (thay đáp số vào từng dữ kiện + quét lưới; mọi dòng OK).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1 | Dự định $x$ chi tiết/giờ, thời gian $y$ giờ: $xy=88$, $(x+3)\left(y-\dfrac25\right)=90$ ⇒ quy về $x^2+8x-660=0$ ⇒ $(x-22)(x+30)=0$ ⇒ **22 chi tiết máy/giờ** (dự định 4 giờ; thực tế 25 chi tiết/giờ, 3,6 giờ). Lưới chỉ một nghiệm dương. `tra_loi_ngan`, `22` | Đề "lập hệ" nhưng bài một ẩn cũng giải được; cả hai cách đều ra phương trình bậc hai ⇒ phương trình tích. |
| Bài 2 | Vận tốc $x$ km/h, thời gian $y$ giờ: $(x+14)(y-2)=xy$, $(x-4)(y+1)=xy$ ⇒ $-2x+14y=28$, $x-4y=4$ ⇒ **vận tốc 28 km/h, thời gian 6 giờ** (quãng đường 168 km: $42\cdot4=24\cdot7=168$). `tu_luan` | — |
| Bài 3 | Chiều rộng $x$, chiều dài $y$ (m): $(x+4)(y+4)=xy+156$ ⇒ $x+y=35$; $(x-3)(y+5)=xy$ ⇒ $5x-3y=15$ ⇒ $x=15$, $y=20$ ⇒ **diện tích 300 m²**. `tra_loi_ngan`, `300` | — |
