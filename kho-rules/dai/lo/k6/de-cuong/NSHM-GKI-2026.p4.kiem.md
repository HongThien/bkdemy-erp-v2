# NSHM-GKI-2026 — Phần 4 (Bài 7 Tính tổng) — trạm SOÁT, Pha 1 giải MÙ

Giải từ ảnh trang `p-1.png` (Bài 7 a–d) và `p-2.png` (Bài 7 e–k), CHƯA mở bản soạn. Mọi đáp số vét cạn bằng `node -e` (BigInt, cộng từng số hạng), đối chiếu với lời giải tay.

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 7a | $A=\sum_{k=1}^{99}k(k+1)=\dfrac{99.100.101}{3}=333300$ | — |
| Bài 7b | $B=2.4+4.6+\dots+100.102=4.(1.2+2.3+\dots+50.51)=4.\dfrac{50.51.52}{3}=176800$ | — |
| Bài 7c | $C=\dfrac{98.99.100.101}{4}=24497550$ | — |
| Bài 7d | $D=\dfrac{100.101.201}{6}=338350$ (qua $D=A-(1+2+\dots+99)+100^2$ hoặc $D=(1.2+\dots+99.100)-(1+\dots+99)+\dots$) | — |
| Bài 7e | $E=2^2.(1^2+\dots+50^2)=4.42925=171700$ | — |
| Bài 7f | $F=1^2+4^2+\dots+2026^2$ (676 số hạng, cách 3) $=926061526$ | Số hạng $(3k+1)^2$, $k=0..675$ |
| Bài 7g | $G=\sum_{k=1}^{99}k(k+1)^2=25164150$ | — |
| Bài 7h | $H=(1+2+\dots+2026)^2=2053351^2=4216250329201$ | — |
| Bài 7k | Theo quy luật (số lẻ bình phương): $I=1^2+3^2+\dots+2023^2+2025^2=1386011925$ | **ĐỀ IN LỖI**: ảnh ghi rõ $2023^3$ (phóng to 3× vẫn là mũ 3), lệch quy luật $1^2+3^2+5^2+\dots$. Đúng phải là $2023^2$. Nếu giữ nguyên $2023^3$ thì $I=9661105563$ (không có dạng gọn, không phải ý đề). |
