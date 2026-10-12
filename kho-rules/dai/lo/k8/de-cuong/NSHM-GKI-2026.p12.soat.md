KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 12 (Bài 28–32, số chính phương nâng cao) — trạm soát Opus, 12/10

- Số câu: **5** (0 TLN · 5 tự luận).
- Khớp Pha 1 (giải mù, `NSHM-GKI-2026.p12.kiem.md`) ngay từ đầu: **5/5** — Bài 28 không tồn tại (cùng đường: $y-x\ge 2a+1$, $a>x$) · Bài 29 $4B+1=(k^2+3k+1)^2$ · Bài 30 $2n-1=q^2$, $n=a^2+(a+1)^2$ (loại $2n+1=q^2$ bằng số dư mod 3) · Bài 31 kẹp $(n^2+n)^2<A<(n^2+n+1)^2$ · Bài 32 $A=\left[n(n+1)\right]^2\left[(n-1)^2+1\right]$, kẹp thừa số giữa $(n-1)^2$ và $n^2$.
- Máy (`<LV>\tam\soat_mu_p12.mjs`, BigInt): Bài 28 vét mọi cặp $999\le x\ne y\le 1993$ — 0 cặp · Bài 29 đúng $k=1\dots3000$ · Bài 30 các $n$ thoả đề với $m\le 2\cdot10^6$ ($1, 13, 181, 2521, 35113, 489061$) đều là tổng hai bình phương liên tiếp, đều có $2n-1$ chính phương, $\dfrac{2n+1}{3}$ chính phương · Bài 31 phân tích + kẹp đúng $n=1\dots10^5$, $A$ chính phương chỉ khi $n=0$ · Bài 32 phân tích đúng $n=0\dots10^5$, $A$ chính phương chỉ khi $n=0,1$ (đúng như Chú ý của bản soạn).
- Đề chép đúng ảnh `5.webp` (phóng to ×2,2): 5/5.
- Phân loại: 5/5 đúng (`tu_luan`, `dap_an=—`; Bài 28 đáp "không" không phải số).
- Soát từng bước kẹp / chia hết / bổ đề với MỌI giá trị biến: Bài 28 $b\ge a+1$, $(b-a)(b+a)\ge b+a$, $a>x\ge999\Rightarrow a\ge1000$ ✓ · Bài 30 ước chung của $2n-1$, $2n+1$ là 1 (dùng $2n-1$ lẻ, $n\ge1$) ✓, ước chung của $2n-1$ và $p$ (của $q$ và $2n+1$) là 1 ✓, $n=1$ ($a=0$) đi đúng nhánh ✓ · Bài 31 hai hiệu $(n+1)^2>0$, $n^2>0$ đúng mọi $n\ge1$ ✓ · Bài 32 $u=n(n+1)>0$, $2n-2>0$ cần đúng $n>1$ ✓; bổ đề "$u^2k$ chính phương ⇒ $k$ chính phương" chứng minh trọn qua phân số tối giản + ước nguyên tố (lớp 6–7) ✓.
- Kiến thức: chỉ hằng đẳng thức (Ch II), phân tích nhân tử bằng nhóm hạng tử, ước chung, số nguyên tố, phân tích ra thừa số nguyên tố, số dư — trong phạm vi. Không phân thức, không phương trình, không quy nạp.
- Câu phải sửa: **1** (Bài 30). Bản gốc: `NSHM-GKI-2026.p12.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 30 | kiến thức (bổ đề chưa chứng minh trong Phần 2) | Trường hợp 1: thay câu trích "hai số nguyên tố cùng nhau có tích là số chính phương nên…" bằng 2 dòng chứng minh qua phân tích ra thừa số nguyên tố (mỗi thừa số nguyên tố của $(2m+1)^2$ có số mũ chẵn; $2n-1$ và $p$ không chung ước nguyên tố nên số mũ trong $2n-1$ bằng số mũ trong $(2m+1)^2$). Trường hợp 2: "(lập luận như Trường hợp 1)" | Bổ đề không có trong KNTT 6–8 ⇒ k8.md §1.1 luật 3 bắt chứng minh ngay trong lời giải; bản soạn chỉ phác ở `**Chú ý:**` Phần 1, Phần 2 dùng như định lí. Bài 32 của cùng bản soạn đã tự chứng minh bổ đề của nó trong Phần 2 ⇒ giữ cùng mức |

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

*Ghi nhận (không sửa):* Bài 30 và Bài 32 dùng tính chất "số nguyên tố chia hết một tích thì chia hết một thừa số" (Bài 30: 3 chia hết $(2n-1)(2n+1)$; Bài 32: $r\mid p^2\Rightarrow r\mid p$) như điều đã biết — suy trực tiếp từ tính duy nhất của phân tích ra thừa số nguyên tố (KNTT 6), mức dùng phổ biến ở bài nâng cao THCS, không coi là lỗi.
