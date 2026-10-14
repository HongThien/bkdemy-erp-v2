KẾT LUẬN: ĐẠT

# Biên bản soát gói 5 — Nâng cao quan hệ chia hết (Opus, 14/10)

- Đã soát: **11 dạng = 22 ví dụ** (NNB00913: NDB00384, 385, 386, 387, 815 · NNB00911: NDB00378, 379, 380, 381 · NNB00912: NDB00382, 383) + **2 khối lý thuyết MỚI** NNB00914 (dạng tích: ĐN · TC 4 dòng · PP 5 bước · CY 4→5 dòng · 2 VD) và NNB00915 (dạng tổng: TC 4 dòng · PP 4 bước · CY 3 dòng · 2 VD).
- Đáp số tính lại bằng máy (`node`, BigInt + vét cạn), giải lại từ đề trước khi đọc lời giải:
  - Chia hết / số dư dãy luỹ thừa (BigInt): $4^2..4^{11}$ ⋮ 5 · $5..5^{100}$ ⋮ 30 · $3..3^{12}$ ⋮ 13 · $4..4^{15}$ ⋮ 21 · $4..4^{2025}$ chia 5 dư **4** · $3^2..3^{100}$ chia 4 dư **1** · $2..2^{100}$ chia 7 dư **2** · $3..3^{101}$ chia 13 dư **12** · $2+2^3+..+2^{99}$ ⋮ 10 · $2..2^{20}$ ⋮ 5 — khớp hết; số số hạng, số nhóm, số hạng thừa từng ví dụ đếm lại đúng.
  - Tìm $n$ (vét cạn $n<2000$): {3;4;9;16} · {0;2} · {0;1;4} · {0;1;2;9} · {0;3} · {0;1} · {0;5} · {1;7} — khớp. Hai ví dụ NDB00378 (hệ số tử không chia hết hệ số mẫu, phải nhân trước) **có bước thử lại**; VD2 thử lại loại đúng $n=0$, $n=2$.
  - Cặp biểu thức (vét cạn $0\le x,y<60$): 4 mệnh đề đều đúng; mọi đẳng thức hệ số kiểm lại.
  - Số nguyên $x,y$ (vét cạn $|x|,|y|\le 60$ / nguyên dương): $(x-2)(y+3)=7$ → 4 cặp · $xy+2x-3y=11$ → 4 cặp · $3x+4y=22$ → {(2;4);(6;1)} · $5x+7y=52$ → {(9;1);(2;6)} — khớp, không thiếu cặp.
- Lý thuyết NNB00914/915: từng khẳng định soát lại — định nghĩa chia hết trong $\mathbb{Z}$, ước số nguyên = ước dương + số đối, $A.B=k\ne0$ ⇒ $A,B\in\text{Ư}(k)$, dấu của tích, $(x+b).(y+a)=x.y+a.x+b.y+a.b$, chặn $a.x\le c-b$ khi $x,y$ nguyên dương, tách hệ số $b=a.q+r$ ⇒ $r.y$ và $c$ cùng số dư khi chia cho $a$ — đúng; 2 chỗ thiếu điều kiện đã bổ sung (bảng dưới).
- Kiến thức lớp 6: không chuyển vế, không $(a^m)^n$, không đồng dư, không viện "số nguyên tố nên…" (NDB00383 gỡ hệ số bằng $8B-7B$). Định dạng: không `\cdot` / `\times`, `\text{Ư}`, `\vdots`.
- Bản gốc: `out-5.goc.json`. Cổng `kiem-goi.mjs`: **✔ đạt cổng**.

## Chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NDB00815 (VD2) | dạng | Thay $C=2+2^3+\dots+2^{35}$ ⋮ 21 (ghép 3 số hạng liền nhau của dãy mũ lẻ) bằng $A=2+2^2+\dots+2^{20}$ ⋮ 5: dãy mũ liền nhau, ghép $2$ với $2^3$, $2^2$ với $2^4$ (vì $1+2^2=5$), 10 cặp | Ví dụ cũ là NDB00385 trá hình ($21=1+4+4^2$, cơ số $4=2^2$), không có "ghép cách"; ví dụ mới chỉ giải được bằng ghép cách (ghép 2 liền nhau → 3, ghép 3 liền nhau → 7) |
| NDB00383 (VD1) | kiến thức | Bỏ dòng $3.(2x+5y)-2.(3x+4y)=6x+15y-6x-8y=7y$, viết $3.(2x+5y)=(6x+8y)+7y=2.(3x+4y)+7y$ rồi lấy hiệu hai số chia hết cho 7 | Bỏ ngoặc có dấu trừ đằng trước = quy tắc dấu ngoặc Ch III, ngoài whitelist Ch I–II |
| NDB00382 (VD1, VD2), NDB00383 (VD1, VD2) | đề mơ hồ | Đề ghi rõ "Cho các số tự nhiên $x$, $y$ thoả mãn …" | Lời giải dùng "hiệu của hai số chia hết cho $m$" trên số tự nhiên; đề không nói $x,y$ thuộc tập nào |
| NNB00914 (ĐN) | toán | "Các ước của số nguyên $a$ ($a\neq 0$) gồm các ước dương … và số đối" | Với $a=0$ mọi số nguyên khác 0 đều là ước — câu cũ thiếu điều kiện |
| NNB00914 (CY) | toán (thiếu bẫy) | Thêm dòng: thừa số có hệ số (vd $A=2x+1$) thì có ước của $k$ không cho $x$ nguyên — phải loại | PP bước 5 chỉ nhắc loại theo "số tự nhiên / nguyên dương", bỏ sót ca $x$ không nguyên |
| NNB00915 (TC) | toán | "$a$, $b$, $c$ là các số **tự nhiên khác 0** cho trước" (cũ: "các số cho trước") | Phép chặn $a.x\le c-b$ và "hữu hạn giá trị" chỉ đúng khi $a,b>0$ |

## Ghi chú gửi CEO (trong `ghi_chu` của out)

1. **NNB00914 / NNB00915 — cách hiểu "dạng tích" / "dạng tổng"** (nhóm không mô tả, không dạng bài): trạm soạn hiểu dạng tích = đưa về $A.B=k$ rồi xét ước của $k$; dạng tổng = $a.x+b.y=c$ với $x,y$ nguyên dương (chặn khoảng + chia hết / tách hệ số). Soát thấy toán đúng, nhưng CEO cần chốt đúng ý "dạng tổng".
2. **NNB00914 dùng ước của SỐ NGUYÊN + nhân/chia số nguyên âm (Ch III)** — k6.md §1 luật 3: Ch III chưa có lý thuyết trên bản đồ. Lý thuyết tự nêu lại định nghĩa ước số nguyên; ví dụ 2 dùng nhân phân phối với số âm ($(x-3).(y+2)=x.y+2x-3y-6$). CEO duyệt khuôn.
3. **NDB00382 "Nhân 1" / NDB00383 "Nhân 2"** mô tả trống, 0 ứng viên. Soát thêm: cả 2 ví dụ "Nhân 2" đều giải được bằng nhân 1 biểu thức ($5.(2x+5y)-(3x+4y)=7x+21y$; $3.(4x+y)=(x+3y)+11x$) ⇒ ranh giới nằm ở cách làm, không ở đề. Chờ CEO mô tả dạng.
4. **NDB00815 "ghép cách"**: VD1 còn lại (dãy mũ lẻ $2+2^3+\dots+2^{99}$, ghép hai số hạng liền nhau của dãy) đúng chữ ví dụ "$2+2^3$" trong mô tả nhưng cũng khớp chữ mô tả NDB00384 ("số mũ cách đều, nhóm hai số hạng liên tiếp"). CEO chốt "ghép cách" là dãy mũ cách đều hay cách ghép bỏ quãng trên dãy mũ liền nhau — nếu là cách sau thì thay luôn VD1.
5. **NDB00379 VD1** ($14\vdots x-2$ ⇒ {3;4;9;16}): đúng trong số tự nhiên; sau khi học số nguyên thì $x=0$, $x=1$ cũng thoả. Giữ như lý thuyết nhóm hiện có.
6. (của trạm soạn) Lý thuyết nhóm NNB00912 hiện có gỡ hệ số bằng "Mà $3\nmid 13$ ⇒ …" (lập luận thực chất cần $\text{ƯCLN}(3;13)=1$, chưa có trong lý thuyết; kí hiệu `\nmid` ngoài bộ kí hiệu K6) và dùng `\cdot`; NNB00913 hiện có dùng `\cdot`, `\textbf` — ngoài gói này, cổng không bắt, CEO sửa chữ trên bản đồ.
7. (của trạm soạn) Ứng viên cũ phần lớn không dùng được (NDB00386/387 mang câu chứng minh chia hết thay vì tìm số dư; 4 dạng NNB00911 chung một bộ 8 câu) — ví dụ tự soạn, số liệu khác các ví dụ đang nằm trong lý thuyết nhóm.
