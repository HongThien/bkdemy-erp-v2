# ot — biên bản SOÁT (Ôn tập chương III + Kiểm tra cuối chương, Đề 1 và Đề 2)

- Số câu: trạm soạn **163**, sau soát **162** (giang 43 · luyen 119), vì gộp ÔT-24-a và ÔT-24-b thành **ÔT-24** (bài chứng minh, xem bảng sửa). Bản gốc của trạm soạn giữ ở `ot.goc.json`. Sửa bằng script Node (scratchpad `sua-ot.cjs`).
- Lệch đáp số giữa bản giải mù (`ot.kiem.md`) và bản soạn: **trước 0 / sau 0**. Cả 163 kết luận cuối khớp, kể cả 16 câu trắc nghiệm.
- Kiểm máy sau sửa: JSON hợp lệ · 162/162 câu có mọi `kiem` ra `true` · cả file không còn `\cdot` `\times` `\left` `\right` `|` · số `$` chẵn · mã NDB có trong `dich.md` · Phần 1 đủ 3–6 bước · trả lời ngắn ≤ 4 ký tự, tự luận `—` · trắc nghiệm kết "Chọn X.".
- Dạng sau soát: cao 149 · vừa 10 · để trống 3 (14A, 14B, 27).

## Các câu LỆCH SÁCH / đoán sửa đề của trạm soạn: tôi tự xét

| id | sách in | bản soạn (= bản mù của tôi) | xét |
|---|---|---|---|
| ÔT-2B-b | 40 | −40 | $8.(-5)=-40$. Sách sai dấu. **Đồng ý.** |
| ÔT-6A-d | 72 | 52 | Lời giải sách dừng ở $70+2$, quên số hạng $-20$. **Đồng ý.** |
| ÔT-9B-a | * = −2 | * = 2 | Chữ số không âm. Số cần tìm là $-27$. **Đồng ý.** |
| ÔT-10A-c | $a-c$ | $a-2b-c$ | Thay số $a=1,b=2,c=3$: vế đề bằng $-6$, $a-c=-2$. Sách sai. **Đồng ý.** |
| ÔT-12B | (1; 2) | (1; −2) | Bảng của chính sách ghi $y=-2$. **Đồng ý.** |
| ÔT-16-a | có "−17" | có −13 | Dãy đề có −13, không có −17. **Đồng ý.** |
| ÔT-26-a | (5; 1) | (5; −1) | $x-3=2\Rightarrow y+4=3\Rightarrow y=-1$. **Đồng ý.** |
| ÔT-29-a | x = 1 | x = −1 | $(x+1)^2=0\Rightarrow x=-1$. Giá trị nhỏ nhất −7 khớp sách. **Đồng ý.** |
| ÔT-Đ2-B1 a/b | a) 101;…;−706 · b) −70;…;74 | theo đề | Đáp án sách lấy hai dãy của Đề 1 nhưng sắp theo chiều của Đề 2, tức là hoán nhãn. Giải theo đề như in là đúng. **Đồng ý.** |
| ÔT-13B-b (sửa đề) | "−1+3−5+7−…+25−26" | "−1+3−5+7−…−53+55" | Đề in trộn lẫn đuôi của câu 13B-a. Đáp số sách 28 = 14 cặp, mỗi cặp bằng 2 ⇒ số cuối **duy nhất** là 55. **Đồng ý**, cần Thùy gật. |
| ÔT-27 (sửa đề) | số hạng cuối $2^{2010}$ | $3^{2010}$ | Dãy là luỹ thừa của 3. Lời giải sách cũng nhóm tới $3^{2009}+3^{2010}$, và chỗ "(1+4)", "13(2^1+…)" trong đó là lỗi gõ. **Đồng ý.** |
| ÔT-Đ1-B4 (sửa đề) | "…−22n ⋮ 2n−1" | $2n^2+3n-22$ | Lời giải sách viết $2n^2+3n-22=(2n-1)(n+2)-20$. **Đồng ý.** |
| ÔT-Đ2-B3b (sửa đề) | "−27:x+1" | $-27\vdots(x+1)$ | Lời giải sách: $x+1\in\{\pm1;\pm3;\pm9;\pm27\}$. **Đồng ý.** |
| ÔT-Đ2-B4 | đề: $+19$ · lời giải sách: $+15$ | giữ đề $+19$ ⇒ n ∈ {−6; −1; 0; 5} | Máy kiểm cả hai: với $+19$ thì dư 22 ⇒ {−6; −1; 0; 5}; với $+15$ thì dư 18 ⇒ {−5; −2; −1; 0; 1; 4} (đúng đáp số sách). Không biết đề hay lời giải in sai ⇒ **giữ đề như in, chờ Thùy.** |

## Các sửa đã làm

| id | lỗi | sửa gì |
|---|---|---|
| 26 câu (1A-a, 1B-a, 2A-a, 2B-a, 4A, 4B, 15, 16, 17-a, 18-a…c, 19, Đ1-B1, Đ2-B1…) | lời giải: thuật ngữ "phần số" | đổi thành "phần số tự nhiên" như SGK và như b1–b5 |
| ÔT-17-a | lời giải: Phần 1 chép nhầm khuôn của 1A-a ("tính trong ngoặc vuông trước: tổng của hai số âm"). Đề không có ngoặc vuông, có 4 số hạng | viết lại Phần 1: tổng 4 số âm, cộng lần lượt từ trái sang phải |
| ÔT-17-b | lời giải: Bước 1 nói "hai dấu trừ liền nhau thành dấu cộng", đề không có $-(-a)$ | viết lại Phần 1: trừ liên tiếp số dương bắt đầu từ một số âm |
| ÔT-17-c | lời giải: Bước 2 bảo "viết lại không còn ngoặc", Phần 2 lại tính trong ngoặc trước | viết lại Phần 1 cho khớp Phần 2 |
| ÔT-7A-c, 7B-c | lời giải: Phần 1 bảo "viết 54 = 6.9 rồi đặt thừa số chung", Phần 2 lại nhân phân phối rồi triệt tiêu | Phần 2 viết đúng theo Phần 1: $=6.9-6.(17+9)=6.[9-(17+9)]=6.(-17)$. Dạng NDB01308 nâng **vừa → cao** |
| ÔT-4A-a…c, 4B-a…c, 19-a…d (10 câu) | lời giải: Phần 1 lộ đáp án. Bước 1 nêu sẵn dấu từng tích ("là tích hai số khác dấu", "(−17).5 âm, (−5).(−2) dương"). Với câu so với 0 hay so âm với dương thì đó chính là đáp án | Bước 1 viết thành bước chung (xét dấu bằng cùng/khác dấu). Chú ý đổi thành "số âm nhỏ hơn 0 và mọi số dương — có khi chỉ cần biết dấu". Phần 2 giữ nguyên |
| ÔT-8A-a…c, 8B-a…c, 23-a, Đ1-C2, Đ2-C2 (9 câu) | lời giải: Bước 3 và Chú ý nói về $x^2=a$ trong khi đề chỉ có thừa số bậc nhất | Bước 3: giải từng trường hợp bằng tìm số hạng / số bị trừ. Chú ý: xét đủ mọi thừa số |
| ÔT-Đ1-B4, Đ2-B4 | lời giải: Phần 2 đưa ra phân tích $(2n-1).(n+2)-20$ mà không cho thấy vì sao | thêm dòng nhân phân phối $(2n-1).(n+2)=2n^2+3n-2$ (và $(2n+1).(n-3)=2n^2-5n-3$), thêm `kiem` cho đồng nhất thức |
| ÔT-Đ1-B2a | **phạm vi**: đề có $7.\lvert-2\rvert$ (giá trị tuyệt đối, khối 6 chưa học). Lời giải giảng "khoảng cách tới O" và còn dấu `\|` trong file | đề đổi thành $-4^2+\{-54:[(-2)^3-7.(-2)]\}$ (cùng giá trị, đáp số −25). Không đổi thành $7.2$ vì khi đó trùng hẳn ÔT-20-d (sách tự làm 20-d từ chính đề này). Viết lại lời giải, dạng nâng cao. **Chờ Thùy duyệt** |
| ÔT-Đ2-B2a | **phạm vi**: đề có $-\lvert-10\rvert$ | đề đổi thành $[316-(5^2.4+16)]:(-2)^3+(-10)$ (đáp số −35). Viết lại Phần 2, dạng nâng cao. **Chờ Thùy duyệt** |
| ÔT-24-a, 24-b → ÔT-24 | **tách ý / đề**: sách ghi "Rút gọn biểu thức sau: … = …" nhưng cho sẵn vế phải, nên thực chất là chứng minh. Brief: bài chứng minh không tách | gộp thành một câu "Chứng tỏ các đẳng thức sau đúng: a) …; b) …", Phần 1 viết lại cho cả hai ý, Phần 2 ghi a) b), `kiem` gộp |
| ÔT-Đ1-B2c | loại câu: đáp số 2268 (4 ký tự) để `tu_luan`, trong khi 1225, 1580, 4000… đều là trả lời ngắn | đổi thành `tra_loi_ngan`, `dap_an` "2268" |
| ÔT-13A-a | định dạng: "(503 số hạng)" nằm trong `$…$` có `\ `, khác 13A-b, 13B | đưa ra ngoài công thức như các câu cùng loại |
| 8 câu trắc nghiệm (Đ1-C1, C2, C3, C6 · Đ2-C1, C2, C3, C6), 14 phương án | định dạng: phương án số âm viết trần "A. -1" (dấu gạch nối, không qua KaTeX) | bọc `$…$`: "A. $-1$" |

## Đã soát, không sửa

- **Đề chuẩn hoá:** đối chiếu cả 163 câu với .txt. Số, dấu, ngoặc, số mũ đều giữ đúng. Ở 7A, 8A, 10A, 10B sách in theo cột (a/d, b/e…), map nhãn vẫn đúng. Những chỗ đã chữa: `\cdot` → `.` (2B, Đ2-B2a), thêm dấu chấm nhân "2(21−18)" → "2.(21−18)" (5A-d, 20-b, 22-e, 22-f, 7A-c, 7B-c), "2a.b" → "2ab" (6B-c). Nhãn ý gõ bằng chữ "а" Cyrillic (5B, 8B, 16, 18, 23) đã bỏ cùng nhãn, file không còn ký tự Cyrillic.
- **`vai`:** nA ⇒ giang (1A…14A), nB + về nhà 15–29 + Đề 1/2 ⇒ luyen. Đúng brief.
- **Tách ý:** các bài tính / tìm x / rút gọn / so sánh / sắp xếp có ý độc lập đều tách. 12A, 12B, 14A, 14B, 27, 28 giữ một câu.
- **Dạng:** đồng ý các mã trạm soạn gán (đã đối chiếu `dich.md`, luật dạng sau thắng). Các câu "vừa" còn lại: 1A-a, 1B-a (01300 / 01302), 5A-a (nhiều cấp ngoặc không luỹ thừa: 01309 / 01310), 9A, 9B (thay chữ số *: 01315 / 01316), 13B-b (đề đã sửa), ÔT-24, Đ2-B4 — chấp nhận.
- **3 câu `dang_bai = null` (14A, 14B, 27):** **đồng ý**. Chia hết của tổng luỹ thừa cùng cơ số (nhóm 2 / nhóm 3 số hạng) không có trong chủ đề Số nguyên của `dich.md`. Dạng gần nhất là NNB00913 "Dãy luỹ thừa chia hết" ở Chương I (Số tự nhiên). Lời giải đã đếm số số hạng trước khi nhóm, đúng khuôn NNB00913.
- **Phạm vi:** ngoài hai câu giá trị tuyệt đối đã đổi, không câu nào dùng chuyển vế, $(a^m)^n$, hay công thức tổng dãy. Đếm số số hạng "(số cuối − số đầu) : khoảng cách + 1" có trong khuôn NNB00913 của k6.md. 23-b dùng "$x.x\ge0$", 29 dùng "$(\dots)^2\ge0$": đều tự lập luận được ở lớp 6.

## Còn nghi, cần CEO

1. **ÔT-Đ2-B4:** đề là $2n^2-5n+19$ (như in, n ∈ {−6; −1; 0; 5}) hay $2n^2-5n+15$ (như lời giải sách, n ∈ {−5; −2; −1; 0; 1; 4})? File đang giữ +19.
2. **ÔT-Đ1-B2a / Đ2-B2a (giá trị tuyệt đối):** duyệt cách đổi đề. Đề xuất: Đ1 đổi "+7.|−2|" thành "−7.(−2)", Đ2 đổi "−|−10|" thành "+(−10)". Cả hai giữ nguyên đáp số sách, chỉ dùng số đối và quy tắc dấu. Phương án khác: thay thẳng bằng 2 / 10. Nhưng khi đó Đ1-B2a trùng hẳn ÔT-20-d.
3. **ÔT-13B-b, ÔT-27:** gật đề đã sửa (−…−53+55; $3^{2010}$).
4. **ÔT-24:** duyệt lời dẫn "Chứng tỏ các đẳng thức sau đúng" thay cho "Rút gọn biểu thức sau" của sách, và việc gộp hai ý thành một câu.
5. **Câu trùng nhau trong file:** ÔT-Đ1-B1a ≡ ÔT-Đ2-B1b (tăng dần −83; 35; 101; −706; −51; 0; −101) và ÔT-Đ1-B1b ≡ ÔT-Đ2-B1a (giảm dần 74; −45; …). Đề 2 lặp lại Bài 1 của Đề 1. Tôi chưa xoá câu nào. Thùy chọn: nhập cả hai, hay câu Đề 2 trỏ về câu Đề 1.
6. **14A, 14B, 27:** để trống dạng, hay gán sang NNB00913 (Chương I)?
