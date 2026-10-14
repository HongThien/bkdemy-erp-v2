KẾT LUẬN: ĐẠT

# Biên bản SOÁT gói 1 — Tập hợp · Số La Mã · Tính toán số tự nhiên (14/10)

- Trạm soát: Opus. Bản soạn: `out-1.json` (Sonnet). Bản gốc trước khi sửa: `out-1.goc.json`.
- **Đã soát: 8 ví dụ mới** (6 dạng: NDB00335, 336, 337, 338, 339, 340; NDB00341 đã đủ 2 ví dụ nên không viết thêm, đúng brief) · **0 khối lý thuyết** (gói không có nhóm nào `can_ly_thuyet: true`).
- Đọc thêm (không sửa vì không thuộc out): `vi_du_hien_co` của 7 dạng và `ly_thuyet_hien_co` của 4 nhóm.
- Cổng: `kiem-goi.mjs` → **✔ đạt cổng** (6 dạng · 0 nhóm · 6 ghi chú).

## Tính lại bằng máy (`node -e`)

| Dạng | Ví dụ | Kết quả máy | Khớp |
|---|---|---|---|
| NDB00335 | $C=\{x\in\mathbb{N}\mid x<5\}$: $3,5,0$ | $C=\{0;1;2;3;4\}$ ⇒ $3\in$, $5\notin$, $0\in$ | ✔ |
| NDB00336 | lẻ, $10<x<20$ · $\mathbb{N}^*$, $\le 5$ | $\{11;13;15;17;19\}$ · $\{1;2;3;4;5\}$ | ✔ |
| NDB00337 | $\{1..7\}$ · $\{0;2;4;6;8\}$ | $\{x\in\mathbb{N}^*\mid x<8\}$ · $\{x\in\mathbb{N}\mid x$ chẵn, $x<10\}$ | ✔ |
| NDB00338 | "NHA TRANG" · tháng 30 ngày | N,H,A,T,R,G · tháng 4, 6, 9, 11; tháng 2 $\notin$ | ✔ |
| NDB00339 | XVIII · XXIX · 24 | 18 · 29 · XXIV | ✔ |
| NDB00340 | $356+478$ · $1000-257$ | 834 · 743 | ✔ |

Kiến thức: không chuyển vế, không luỹ thừa, không dấu hiệu chia hết — nằm trọn Ch I. Định dạng: không `\cdot`/`\times`, chữ trong công thức bọc `\text{…}`, mỗi khối `##VD` không có dòng trống ở giữa (đúng quy ước khối của `spec-format-noidung.md` §1). Dạng: mỗi ví dụ đúng yêu cầu của dạng mình (liệt kê ↔ tính chất đặc trưng tách đúng; NDB00338 phần tử không phải số).

## Bảng chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NDB00337 | (ghi chú thừa) | Bỏ mục `ghi_chu` "coi 0 là số chẵn — cần CEO xác nhận" | Không phải điểm nghi: $0$ chia hết cho 2 nên là số chẵn (SGK KNTT 6, số chẵn = tận cùng 0, 2, 4, 6, 8). Ví dụ giữ nguyên, đúng. |

Không có ví dụ nào sai toán / sai dạng / sai kiến thức / sai khuôn / đề mơ hồ.

## Lỗi ở nội dung CÓ SẴN trên bản đồ (không sửa trong out — gửi CEO)

- **NDB00340 — `vi_du_hien_co` ví dụ 1 SAI TOÁN:** "$43+28=61$", đúng là **$43+28=71$** (máy tính lại). Đang hiện trước mặt HS ⇒ cần sửa trên bản đồ. Ví dụ 2 ($67-19=48$) đúng.
- NDB00341 — `vi_du_hien_co` đúng toán ($14.7=98$, $192:12=16$) nhưng dùng `\times` và tag `##VD:` (parser vẫn đọc được) — nên chuẩn về `$14.7=98$`.
- Lý thuyết nhóm lệch chuẩn (đã ghi trong `ghi_chu`): NNB00889/00891/00892 có `##VD` ngay trong lý thuyết dù nhóm có dạng bài (NNB00889 trùng ví dụ của NDB00335); NNB00892 dùng `\times`; NNB00890 viết `\mathbb{N}` ngoài `$…$`.

## `ghi_chu` còn lại gửi CEO (6 mục trong out)

1. NDB00340 ví dụ có sẵn sai ($43+28=61$ → 71) — như trên.
2. NDB00341 ví dụ có sẵn dùng `\times` — nên chuẩn hoá chữ.
3. `ung_vien` không dùng được cho NDB00336/337/338/340/341 (cùng một bộ câu của cụm cũ, NDB00341 nhận toàn câu phép trừ) và NDB00335 (TN thiếu phương án) ⇒ ví dụ tự soạn.
4. NDB00338 "Tập hợp khác" có `mo_ta` trống — đề xuất mô tả: phần tử không phải số (chữ cái, đồ vật, tháng…).
5. NDB00336 / NDB00337 có mô tả gần như trùng, chỉ khác yêu cầu "liệt kê" ↔ "tính chất đặc trưng".
6. Lý thuyết nhóm lệch chuẩn (tag `##DN`/`##tc`, `##VD` trong lý thuyết, `\times`, `\mathbb{N}` ngoài `$`).

Điểm nhỏ, không sửa: NDB00339 ví dụ 2 b) có chiều *viết* số La Mã (24 → XXIV) trong khi `mo_ta` chỉ nói "đọc" — giữ vì tên dạng là "Viết đọc Số la mã". NDB00338 ví dụ 2 hỏi thêm "tháng 2 có thuộc $C$" (chạm nhóm NNB00889) — chỉ là ý phụ, trọng tâm vẫn là liệt kê.
