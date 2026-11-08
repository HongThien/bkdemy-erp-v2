KẾT LUẬN: ĐẠT

# nbv-b1-d — soát (nhân chứng thứ hai)

- Số câu: 21 (đủ Câu 1–21 của phần D sách NBV, không bỏ / thừa; không câu nào bỏ vì hình — ảnh ở Câu 11, 12 chỉ minh hoạ, đề đủ chữ).
- Toàn bộ 21 câu: `vai = luyen`, `loai_cau = dung_sai`, `dang_bai = null`, `dap_an = null`, 4 mệnh đề a–d — đúng brief.
- Lệch đáp án Pha 1 (giải mù, `nbv-b1-d.kiem.md`) so với bản soạn: **trước 0 / sau 0** (84/84 mệnh đề khớp). Bản soạn cũng khớp đáp án sách ở cả 21 câu.
- Đề chuẩn hoá: đối chiếu từng câu với nguồn `.txt` — giữ đúng số, dấu, số mũ; chỉ thêm `\lim\limits_{n\to+\infty}` ở nơi sách viết `\lim` trần, sửa `D(a;1]` → `D=(a;1]` (Câu 9, lỗi in hiển nhiên), đánh lại nhãn ý lặp a,b,a,b → a–d (Câu 21). Không đổi nghĩa.
- Phạm vi: không L'Hôpital / đạo hàm; Câu 15 ý d dùng giới hạn hàm tại vô cực (trong chương V). `kiem` đều tính lại từ dữ kiện đề (vài biểu thức đơn giản như `4!==0`, `-5/2<-1` yếu nhưng không phải tautology, có biểu thức khác trong cùng câu tính lại giá trị).
- `kiem.mjs` sau sửa: ✔ đạt. Bản gốc: `nbv-b1-d.goc.json`.

## Lỗi đã sửa

| id | lỗi | sửa gì |
|---|---|---|
| nbv-b1-d-1 | lời giải (Phần 1 Bước 1 diễn đạt sai: "luỹ thừa của $n$ ở số mũ") | → "dãy có dạng $q^{n}$ ($n$ nằm ở số mũ)" |
| nbv-b1-d-3 | lời giải (Phần 1 Bước 4 sai ý: "mỗi phần nhỏ dần" — thực ra $v_n-n\to\frac13$, không nhỏ dần) | → "xét riêng giới hạn của $n(v_n-n)$ và $n(u_n-n)$" |
| nbv-b1-d-6 | lời giải (Phần 2 ý c câu lủng củng hai chữ "vì") | → "Sai vì $-\frac23\in[-1;1]$ nên phương trình … có nghiệm." |
| nbv-b1-d-12 | lời giải (Mấu chốt LỘ đáp án: nêu công bội $\frac{\sqrt2}{2}$ ⇒ lộ ý a Đúng; "tổng chu vi là 4 lần tổng" ⇒ lộ ý c Sai) | viết lại Mấu chốt không nêu số / hệ số |
| nbv-b1-d-19 | định dạng (ý b dùng `1/2` dạng gạch chéo trong `\dfrac`) | → `\dfrac{\frac{1}{2}}{1-\frac{1}{2}}` |
| nbv-b1-d-21 | lời giải (Phần 1 Bước 2 "đan dấu thì công bội âm" ⇒ lộ ý b Sai) | → nhắc chú ý dấu từng số hạng khi lập tỉ số, không nêu kết luận |

Không câu nào sai đáp số / đề / tách ý / dạng.

## Các điểm trạm soạn nêu — đã tự kiểm

- **Câu 10**: sách ghi "Suy ra $a=-\infty;\ b=2$" nhưng chính dòng trên tính $b=0$; đáp án sách Đ,Đ,Đ,S chỉ khớp với $b=0$ (ý b: $x=0$; ý c: $\lim(\frac1{2024})^n=0$; ý d: $u_3=1\ne2$). Bản soạn dùng $b=0$ — đúng. Ghi chú "LỆCH SÁCH" ở đây là lệch lời giải sách, không lệch đáp án.
- **Câu 13 trùng Câu 8**: đề y hệt, chỉ khác "có một nghiệm là" / "có nghiệm là" ở ý c; đáp án như nhau (S, Đ, Đ, S). Đang giữ cả hai.
- **Câu 9 ý b**: đề gọi giới hạn vô cực là "$=a$" rồi viết $(a;1]$. Hiểu $a=-\infty$ thì $(a;1]=(-\infty;1]$ là đúng TXĐ ⇒ Đúng (khớp sách). Ý a cũng dùng $a$ như số ($a\cdot b=-\infty\ne3$ ⇒ Sai, khớp).
- **Câu 15 ý d**: sách kết luận "$a=100$" (sai lập luận; đúng là $a\le100$). Kết luận Sai của ý d không đổi; lời giải bản soạn lập luận đúng ($a>100$ ⇒ $u(t)>100$ khi $t$ đủ lớn).
- **Câu 18 ý d**: sách ghi mẫu $=\frac{2(2^{n+1}-1)}{1}$ (nhầm, đúng là $2^{n+1}-1$); bản soạn dùng $2^{n+1}-1$, kết luận $+\infty$ ⇒ Đúng không đổi. Đã kiểm số: tỉ số $=(\frac32)^n\cdot\frac{3(1-3^{-n})}{4(1-2^{-n-1})}$.

## Câu còn nghi cần CEO

| id | lý do | sách | bản soát |
|---|---|---|---|
| nbv-b1-d-13 | Trùng gần như nguyên văn nbv-b1-d-8 — giữ cả hai trong kho luyện hay bỏ một? | có cả Câu 8 và Câu 13 | giữ cả hai (chưa xoá), chờ Thùy chọn |
| nbv-b1-d-9, nbv-b1-d-10 | Đề đặt "giới hạn vô cực $=a$" rồi dùng $a$ như một số (tích $a\cdot b$, khoảng $(a;1]$, "$=a$") — cách viết không chuẩn SGK, có thể gây nhiễu cho HS | Đ/S như bản soạn | giữ theo sách; nếu muốn chuẩn có thể sửa đề sau |
