# NTL-NC-2026 · trạm 21 — kiểm MÙ (Opus, 24/10)

Giải từ ảnh `t-13.png`, `t-14.png` + hình `de_tk1-bai4.png` (Đề tham khảo số 1, phần tự luận Bài 2–5), CHƯA mở bản soạn. Số kiểm bằng `node -e`.

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| TK1 Bài 2a | $x=375$ ($8.115-15.8=920-120=800$; $2x=750$) | Dấu `.` = nhân (K6). |
| TK1 Bài 2b | $x=2$ ($4.5^2=100$; $5^{x+1}=125=5^3$) | — |
| TK1 Bài 2c | $x\in\{5;15\}$ — `tu_luan` | Phóng to 400 dpi: kí hiệu là ⋮ (ba chấm dọc) ⇒ $15\vdots x$, $x\in\text{Ư}(15)=\{1;3;5;15\}$, lọc $x>3$. |
| TK1 Bài 3 | a) $11.(4+6)=110$ chiếc, $110.6000=660000$ đồng · b) Sai — `tu_luan` | a) Đọc "dùng cả hai loại khay nướng 11 lần" = mỗi lần nướng dùng cả hai khay (10 chiếc/lần) — cách hiểu duy nhất cho ra một đáp số. b) Lập luận chắc với MỌI cách hiểu: số bánh $=4.a+6.b$ (dù mỗi lần dùng cả hai khay, $a=b$), $4.a\vdots 2$, $6.b\vdots 2$ ⇒ tổng chẵn, 123 lẻ ⇒ đếm sai. (Cách hiểu 10 chiếc/lần thì số bánh tận cùng 0 — cũng sai; nên trình bày bằng chia hết của tổng cho 2 để không phụ thuộc cách hiểu.) |
| TK1 Bài 4 | a) Hình bình hành; $50.120=6000$ m² · b) còn lại $150.120-6000=12000$ m²; đường mới $=18000:2=9000$ m² ⇒ đáy mới $9000:120=75$ m ⇒ dịch chuyển $75-50=25$ m — `tu_luan` | Hình: E trên AB, F trên DC, $FG=50$ m, EF ∥ BG, EB ∥ FG (nằm trên AB ∥ DC) ⇒ EBGF là hình bình hành, đáy $EB=FG=50$, chiều cao $=AD=120$. "Đoạn dịch chuyển" = E trượt trên AB (F trượt trên DC) về phía A (D) — tức đoạn $EE'=FF'$. Khoảng cách VUÔNG GÓC giữa EF cũ và mới KHÔNG tính được (đề không cho $AE$ và $DF$ để biết độ nghiêng), nên chỉ cách hiểu "trượt dọc cạnh" là giải được ⇒ 25 m. Hình không đúng tỉ lệ (đo pixel: $EB\approx 56$, $FG\approx 66$) — không ảnh hưởng. |
| TK1 Bài 5.1 | $S=2023.2^{2025}$ ⇒ $S\vdots 2023$ — `tu_luan` | Máy: $S\bmod 2023=0$, $S=2023.2^{2025}$ (BigInt, đúng). Cách lớp 6: $2S-S$ rồi tổng $2^3+\dots+2^{2024}=2^{2025}-2^3$ (nhân 2 rồi trừ). |
| TK1 Bài 5.2 | 7 (`tra_loi_ngan`) | Đề tiếng Anh. Số câu sai: $4$, $7$, $12$, tổng $23$ ⇒ ít nhất $30-23=7$ câu cả ba cùng đúng; đạt được khi ba tập câu sai rời nhau. |
