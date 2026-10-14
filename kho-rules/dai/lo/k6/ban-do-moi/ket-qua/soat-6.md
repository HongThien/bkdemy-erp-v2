KẾT LUẬN: ĐẠT

# Biên bản SOÁT gói 6 — Nâng cao số nguyên tố / nguyên tố cùng nhau (14/10)

- Trạm soát: Opus. Bản soạn: `out-6.json` (Sonnet). Bản gốc trước khi sửa: `out-6.goc.json`.
- **Đã soát: 24 ví dụ** (12 dạng × 2: NDB00388–399, 3 nhóm NNB00916 · NNB00917 · NNB00918) · **0 khối lý thuyết** trong `ly_thuyet` (gói không có nhóm `can_ly_thuyet: true`).
- **Thêm theo yêu cầu:** khoá `de_xuat_ly_thuyet.NNB00917` — lý thuyết ĐỀ XUẤT đúng tên nhóm (`##ĐN` · `##TC` · `##PP` 5 bước · `##CY`), KaTeX sạch, không `##VD`. KHÔNG ghi vào `ly_thuyet` (nhóm đã có chữ; `ghi-db.mjs` chỉ đọc `ly_thuyet`/`vi_du` nên khoá mới không lọt DB).
- Cổng: `kiem-goi.mjs` → **✔ đạt cổng** (12 dạng · 0 nhóm · 8 ghi chú).

## Tính lại bằng máy (`node -e`, vét cạn)

| Dạng | Ví dụ | Máy | Khớp |
|---|---|---|---|
| NDB00388 | $n+7$, $n+8$ · $n$, $n+1$ | ƯCLN $=1$ với mọi $n<5000$ | ✔ |
| NDB00389 | $3n+4$, $n+1$ · $5n+2$, $15n+7$ | ƯCLN $=1$, hiệu sau nhân $=1$ | ✔ |
| NDB00390 | $3n+2$, $2n+1$ · $4n+3$, $6n+5$ | ƯCLN $=1$ | ✔ |
| NDB00391 | $\frac{2n+3}{3n+4}$ · $\frac{5n+4}{4n+3}$ | ƯCLN $=1$ | ✔ |
| NDB00392 | $\frac{2n+3}{4n+8}$ (hiệu 2, loại $d=2$) · $\frac{3n+2}{6n+7}$ (hiệu 3, loại $d=3$) | ƯCLN $=1$ với mọi $n$; lập luận loại đúng | ✔ |
| NDB00397–399 | 6 cặp $xa+yb$, $za+tb$ | định thức $xt-yz=\pm1$ cả 6; vét $a,b<200$ nguyên tố cùng nhau: ƯCLN $=1$ | ✔ |
| NDB00393 | $p+9,p+15$ · $3p+1,5p+3,7p+3$ | $p<200000$: chỉ $p=2$ | ✔ |
| NDB00394 | $p+2,p+4$ · $p+10,p+14$ | chỉ $p=3$ | ✔ |
| NDB00395 | $p+2,6,8,14$ · $p+6,12,18,24$ | chỉ $p=5$; mỗi số dư 1–4 có đúng biểu thức ⋮5 như lời giải | ✔ |
| NDB00396 | $p+2,6,8,12,14$ · $p+2,6,14,2p+1,4p+3$ | chỉ $p=5$; từng số dư khớp | ✔ |

Dạng: mỗi ví dụ khớp `mo_ta` và tách được với dạng anh em (không nhân / nhân 1 biểu thức / nhân 2 biểu thức; cơ bản: hiệu $=1$ ↔ khó: hiệu $=k>1$ phải loại ước; $=2$ ↔ $=3$ ↔ 4 biểu thức ↔ >4 biểu thức). Không trùng nguyên văn ví dụ trong lý thuyết nhóm.

**Chia có dư ("p chia 3/5 dư r ⇒ p=3k+r")** — kiểm theo yêu cầu: lập luận **chặt** (số nguyên tố khác $m$ thì không chia hết $m$; đủ mọi số dư; biểu thức ⋮ $m$ đều được nói rõ lớn hơn $m$; $p=2$, $p=3$ xét riêng khi $m=5$ vì $3+2=5$ nguyên tố — đúng chỗ dễ sai). **Trong lớp 6:** phép chia có dư $a=b.q+r$ có ở SGK KNTT 6 Bài 4 (Ch I); chỉ thay vào biểu thức bậc nhất rồi đặt thừa số chung. Không đồng dư, không $(3k\pm1)^2$ (cái CEO cấm 10/10 ở GKI-03). Không có chuyển vế, hằng đẳng thức, dấu hiệu 4/8/11/25.

## Bảng chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NDB00389, 390, 391, 392, 398, 399 | định dạng | `3(2n+3)` → `3.(2n+3)` (22 chỗ, chỉ trong `$…$`) | k6.md §3: dấu chấm giữa hai thừa số kể cả trước ngoặc (`$6.(x+1)$`); bản soạn lẫn hai kiểu (`2.(k+5)` ở gói này nhưng `3(2n+3)` ở chỗ khác) |
| NDB00397, 398, 399 | định dạng / đề | `$(a,b)=1$` → `$\text{ƯCLN}(a,b)=1$` ở đề và dòng kết luận (8 chỗ) | Đề HS đọc: kí hiệu $(a,b)$ cho ƯCLN không có trong SGK; lý thuyết NNB00918 cũng viết "ƯCLN(a,b)=1". Giữ `Gọi $d=(…)$` vì đó là khuôn k6.md §2 |
| NDB00399 (2 ví dụ) | khuôn (lập luận) | "Lần 2" bỏ `$\Rightarrow$` đầu dòng, thêm "cũng từ $2a+3b\vdots d$ và $3a+5b\vdots d$ ta có:" | Bản soạn đặt `⇒` ngay sau dòng $b\vdots d$, đọc như suy ra từ $b\vdots d$ — sai mạch; lần khử thứ hai đi ra từ hệ ban đầu |
| NDB00395, 396 | khuôn (chặt) | TH4 nói rõ "vì $p$ nguyên tố lớn hơn 5 nên $p\not\vdots 5$ … tức là $p=5k+1,…,5k+4$ ($k\in\mathbb{N}^*$)" | Bản soạn dùng $p=5k+r$ mà không giới thiệu $k$ (NDB00394 thì có) |
| NNB00917 | thiếu lý thuyết đúng tên | Thêm `de_xuat_ly_thuyet.NNB00917` (không đè `ly_thuyet`) | Lý thuyết đang có là bản sao NNB00916 (nguyên tố cùng nhau) |

Không có ví dụ nào sai toán, sai dạng hay đề mơ hồ.

## `ghi_chu` gửi CEO (8 mục trong out)

1. `ung_vien` không dùng được: mỗi nhóm nhận cùng một bộ câu cho mọi dạng ⇒ 24 ví dụ tự soạn (đã vét cạn).
2. **NNB00917: lý thuyết hiện có là bản sao NNB00916**, `mo_ta` trống ⇒ xem `de_xuat_ly_thuyet.NNB00917`, CEO duyệt thì dán thay.
3. Chia có dư trong NDB00393–396 — soạn hỏi, soát kết luận: **chặt, trong lớp 6** (mục 8 của out). Nếu CEO muốn tránh hẳn thì dạng "Xét số dư cho 5" không có cách lớp 6 nào khác.
4. Ranh giới dạng theo cách hiểu của trạm soạn: NDB00395 = 4 biểu thức $p+a$; NDB00396 = 5 biểu thức (ví dụ 2 có $2p+1$, $4p+3$); NDB00392 "ước chung là 1 và một số khác" = sau khi khử $n$ được $k>1$, phải loại ước khác 1. Soát thấy hợp lý.
5. NNB00918: dạng "Không nhân hệ số" $a+xb$, $a+yb$ chỉ nguyên tố cùng nhau khi $x$, $y$ hơn kém đúng 1; "Nhân hệ số 1 lần" chỉ luôn đúng khi định thức $=\pm1$ (vd $2a+3b$, $4a+7b$ KHÔNG nguyên tố cùng nhau) — lưu ý khi sinh câu.
6. Lý thuyết hiện có NNB00916/918 lệch chuẩn chữ: `UCLN`, `UC`, `BCNN $(2,1)$` không bọc `\text{}`, dấu nhân `2(n+1)` thiếu chấm, lẫn "Lời giải"/"Hướng dẫn giải" — nên chuẩn hoá khi CEO sửa.
7. Mục soát ghi thêm về `de_xuat_ly_thuyet` (mục 7 của out).

Điểm nhỏ, không sửa: NDB00396 ví dụ 1 chỉ thêm một biểu thức $p+12$ vào ví dụ 1 của NDB00395 nên "rất khó" chưa khó hơn rõ (ví dụ 2 có $2p+1$, $4p+3$ mới thật sự khó hơn). Nhận xét ở NDB00394 ví dụ 1 ("ba số có số dư khác nhau khi chia cho 3") nêu không chứng minh — chỉ là nhận xét định hướng, phần trình bày đã chặt.
