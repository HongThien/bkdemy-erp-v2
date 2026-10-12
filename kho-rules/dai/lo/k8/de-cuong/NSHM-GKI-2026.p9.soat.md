KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 9 (Bài 16, 17, 18 — Hình học)

- Số câu: **3** (3 tự luận, kho `hinh_hoc`).
- Khớp Pha 1 ngay từ đầu: **3/3**. Cả ba bài trạm soạn đi đúng hướng chứng minh như bản giải mù (`NSHM-GKI-2026.p9.kiem.md`); máy toạ độ `<LV>\tam\soat_mu_p9.mjs` kiểm mọi khẳng định trên nhiều bộ số.
- Số câu phải sửa: **2** (Bài 17, Bài 18) — chỉ phần cờ `Chưa chắc` / `Chú ý` / ghi chú; **không** sửa đề, đáp số, lời giải hay hình.
- Bản gốc: `NSHM-GKI-2026.p9.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Đã soát

- **Đề:** cả ba chép đúng ảnh `4.png` (đã phóng to).
- **Luật kiến thức:** không dùng đường trung bình, Thalès, đồng dạng, Pythagore — kể cả ngầm:
  - Bài 16 b) $MN\perp AC$ qua trung tuyến ứng cạnh huyền $HM=\frac12AB$ + hai tam giác bằng nhau (c.c.c) — không ngầm dùng $MN\parallel BH$; c) $K$ trung điểm $BH$ KHÔNG được dùng, đi qua HBH $MNKB$ (định nghĩa) rồi $NKCP$; d) trực tâm $\triangle NBC$ (nền lớp 7).
  - Bài 17 c) $KC\parallel BD$ qua HBH $NKCM$ (không qua đường trung bình $NO$ của $\triangle AKC$); d) trung điểm $M$ của $AP$, $C$ của $KP$ qua HBH $NMPC$ (không qua chiều đảo đường trung bình) ⇒ ba trung tuyến $\triangle AKP$.
  - Bài 18 b) qua $\triangle CHE=\triangle EDB$ (cạnh huyền – góc nhọn); c) chiều đảo trung tuyến ứng cạnh huyền (C3 B4, được dùng); d) chuỗi bốn cặp tam giác bằng nhau — không dùng tứ giác nội tiếp / đường tròn. Đoạn chứng minh $I$ thuộc tia $AF$ dùng đúng điều kiện $AB>AC$ (máy xác nhận).
- **Phần 1 / Phần 2:** mỗi bài 5 bước, đi chiều "muốn có … cần …", Phần 2 đi ngược và khớp mắt xích; mỗi khẳng định có lí do.
- **Hình giải** (mở từng tệp): `giai_bai16.png`, `giai_bai17.png`, `giai_bai18.png` dựng bằng toạ độ (chân vuông góc, trung điểm, giao điểm tính bằng phép tính), đủ điểm mọi ý, chỉ đánh dấu giả thiết, không đè nhãn; Bài 17 vẽ $AB>AD$, Bài 18 vẽ $AB>AC$. Trong `ve_p9.mjs` dòng 19 biến `K = foot(N,B,H)` dựng sai (chân vuông góc) nhưng **không dùng** — hình dùng `Kk` (giao $BH$ với đường qua $N$ song song $AB$), đúng. Không vẽ lại.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 17 | định dạng (Chưa chắc) | Viết lại `**Chưa chắc:**`: chốt đáp án ý c là **hình thang cân (hai đáy $KC$, $DB$)**, nêu đủ ba trường hợp $AB>AD$ / $AB<AD$ / hình vuông; nối thêm vào `**Chú ý:**` Phần 1 cách thấy hình thang cân khi $AB<AD$ (đường chéo $DK=DA=CB$) | Trạm soát dựng toạ độ $AB:AD=6:4,\ 8:3$ ($DKCB$ lồi, $DC=KB$), $4:6$ ($DKCB$ tự cắt, $DCKB$ lồi, $DK=CB$), $5:5$ ($K\equiv C$, $N\equiv M$). $KC\parallel BD$ và hai cặp $DC=KB$, $DK=CB$ đúng ở mọi trường hợp không vuông ⇒ "hình thang cân" luôn đúng, chỉ tên đỉnh phụ thuộc $AB>AD$. Bản cũ chỉ nói "lời giải lấy $AB>AD$", chưa chốt câu trả lời |
| Bài 18 | định dạng (cờ thừa) | Xoá `**Chưa chắc:**` ý b (hỏi có cho dùng đường trung bình); sửa mục GHI CHÚ CHO NGƯỜI DUYỆT tương ứng | Lời giải ý b tự chứng minh trọn vẹn trong whitelist, đúng dù CEO quyết thế nào; câu hỏi chính sách đã có ở Bài 16 (ghi rõ "áp luôn cho Bài 18 ý b") — tránh hỏi CEO hai lần một việc |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 16** — ý b, c: dữ kiện đúng là bài đường trung bình ($M,N$ trung điểm $AB, AH$; $NK\parallel AB$ ⇒ $K$ trung điểm $BH$). Lời giải không dùng đường trung bình (đi qua trung tuyến ứng cạnh huyền + HBH). CEO quyết có cho dùng đường trung bình ở đề cương này không (áp cả Bài 18 ý b).
- **Bài 17** — đề không cho $AB>AD$: đáp án "hình thang cân" đúng với mọi hình chữ nhật không vuông, nhưng tên $DKCB$ chỉ là tứ giác (không tự cắt) khi $AB>AD$; khi $AB<AD$ phải gọi $DCKB$; hình vuông làm b, c, d suy biến. CEO xem có thêm "$(AB>AD)$" vào đề không.
