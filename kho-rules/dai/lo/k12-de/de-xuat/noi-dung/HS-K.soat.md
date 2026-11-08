KẾT LUẬN: ĐẠT

# Biên bản soát HS-K (nhóm C4.3, C4.5, C4.6 · dạng C4.3.1–3, C4.5.1–2, C4.6.1–3) — 03/11

- 3 nhóm · 8 dạng · 17 ví dụ (16 của trạm soạn + 1 ví dụ gara mới) đều tự giải lại bằng máy · 1 hình (C4.5.2 ví dụ 2) đã kiểm khớp đề và lời giải · 9 chỗ sửa nội dung + cập nhật GHI CHÚ.
- Máy kiểm `kiem-moi.mjs HS … C4.3,C4.5,C4.6,C4.3.1,C4.3.2,C4.3.3,C4.5.1,C4.5.2,C4.6.1,C4.6.2,C4.6.3`: lỗi 0, cảnh báo 0.
- Bản gốc trạm soạn: `HS-K.goc.txt`.
- Script soát (độc lập trạm soạn): `S\soat\HS-K\kiem.cjs` (quét lưới GTLN/GTNN 2·10⁶ điểm cho mọi bài tối ưu, sai phân cho đạo hàm, phân số/số thực cho các đáp số, kiểm $g'$ của bài gara bằng sai phân, dựng toạ độ 4 góc xe tại vị trí tối ưu, đếm số lần đổi dấu của $h$), `S\soat\HS-K\gara.cjs` (mô hình gara, tái tạo đúng đáp số đề thật $3{,}7$ với xe $5\times1{,}9$, đường $2{,}6$).
- Đối chiếu đề thi thật: `cau-dang.cjs HS <dạng>` cho cả 8 dạng (C4.3.1 37 câu · C4.3.2 35 · C4.3.3 16 · C4.5.1 55 · C4.5.2 46 · C4.6.1 18 · C4.6.2 36 · C4.6.3 9).
- Đối chiếu sách: Word PNL Bài 5 bản GV — Dạng 02 tối ưu đơn giản, Dạng 03 tăng trưởng, Dạng 05 tốc độ liên quan (trích ra `S\sach\b5\pnl-d2.md`, `pnl-d3.md`, `pnl-d5.md`); PNL Bài 5 Dạng 01 lý thuyết (`S\txt\pnl\BAI 5…\…_GV.txt`: định nghĩa vận tốc, gia tốc, chi phí biên ≈ chi phí đơn vị thứ $x+1$ — khớp); hồ sơ `k12-hs/ho-so/hoso-nbv-3-4.md` (K16–K19), `hoso-pnl-3-5.md` (5.2.f hành lang + gara). NBV có kiểu "góc lớn nhất" (K19, 1 câu) nhưng đề thật không có ⇒ không đưa vào.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C4.3.2 | lý thuyết dạng | toán | "$d^2$ là tam thức bậc hai (khi hai vật đi trên hai đường vuông góc)" hiểu nhầm là chỉ đúng khi vuông góc; sửa: luôn bậc hai, vuông góc dùng Pi-ta-go, hợp góc $\varphi$ dùng định lí côsin (đề thật có câu góc $30^\circ$). |
| C4.3.2 | lý thuyết dạng | thiếu kiểu đề | Thêm: đề cho $AB$ của hai điểm cùng phía thì $S=\sqrt{AB^2-(b-a)^2}$ (đa số câu "trạm bơm" cho $AB$). |
| C4.3.2 | lý thuyết dạng (CY) | thiếu kiểu đề | Thêm chú ý $A'B'\ne AB$, phải tính trước khi đặt ẩn. |
| C4.3.2 | ví dụ 2 | bám đề | Thay ví dụ cầu qua sông (4 câu đề) bằng trạm bơm cùng phía bờ, cho $AB=13$ (kiểu nhiều nhất, ~9 câu): $A'B'=12$, $x=\tfrac83$, tổng $15$ km. Cầu vẫn giữ ở lý thuyết + chú ý. |
| C4.3.3 | lý thuyết dạng | thiếu kiểu đề | Thêm khung NX "Xe hình chữ nhật rẽ sang đường vuông góc (gara)": $d\ge g(\alpha)=L\sin\alpha+\dfrac{W-w\sin\alpha}{\cos\alpha}$, tìm **lớn nhất**, $g'=0\Leftrightarrow L\cos^3\alpha+W\sin\alpha=w$ (3 câu đề thật). |
| C4.3.3 | ví dụ 3 (mới) | thiếu kiểu đề | Ví dụ gara: xe $5\times2$, đường vào gara $2{,}68$ ⇒ đường đầu rộng ít nhất $3{,}76$ m (tối ưu tại $\sin\alpha=0{,}8$; kiểm 4 góc xe nằm trong đường, $h$ đổi dấu đúng 1 lần). |
| C4.3.3 | lý thuyết dạng | thiếu kiểu đề | Danh sách "điểm cố định" thêm cọc ở góc hồ, điểm con đường phải đi qua (5 câu đề cùng mô hình). |
| C4.5.1 | lý thuyết dạng | thiếu kiểu đề | Thêm: cho sẵn $v(t)$, hỏi gia tốc tăng ⇒ xét dấu $a'=v''$ (4 câu Hubble). |
| C4.6.2 | ví dụ 1 | trình bày / số liệu | $N=-t^3+15t^2$ trùng đề thật T1120000005872 và cho tốc độ âm cuối đoạn (số người nhiễm tích luỹ giảm). Đổi sang $N=-t^3+21t^2$, $0\le t\le14$: lớn nhất tuần 7, $147$ trăm người/tuần, giảm trên $(7;14)$. |
| — | GHI CHÚ CHO CEO | — | Cập nhật: sách đã đọc thêm, C4.3.2/C4.3.3 đã xử lý, Hubble kèm id, C4.6.3 không có câu thang trượt thuần. |

Các ví dụ còn lại (C4.3.1 ×2, C4.3.2 ví dụ 1, C4.3.3 ví dụ 1–2, C4.5.1 ×2, C4.5.2 ×2, C4.6.1 ×2, C4.6.2 ví dụ 2, C4.6.3 ×2) đúng toán, đúng dạng, ví dụ 2 khó hơn ví dụ 1, số liệu không suy biến; hình C4.5.2 ví dụ 2 ($s=-t^3+6t^2$ trên $[0;4]$) đi qua $O$, tiếp xúc trục hoành tại $O$, cực đại $(4;32)$ — khớp lời giải.

## Cần CEO xem

- **C4.3.3** — tên/mô tả dạng có "góc nhìn lớn nhất" nhưng không có câu đề thật nào; đề nghị đổi tên thành "Thang, sào, xe qua góc; độ chiếu sáng lớn nhất" (đã bỏ phần góc nhìn, thêm gara).
- **C4.3.3** — ví dụ gara phải giải $5\cos^3\alpha+2\sin\alpha=2{,}68$ bằng thử nghiệm + bảng giá trị máy tính (như cách sách PNL và đề thật làm); CEO xem có chấp nhận mức này ở ví dụ 3 không.
- **C4.5.1 — Hubble nghi sai đề:** T1120000006168, T112020402008 dùng hệ số $-0{,}08029t^2$ (đáp số $105$); nguồn Larson và T1120000003566, T1120000006707 dùng $-0{,}09029t^2$. Nếu hệ số đúng là $0{,}09029$ thì đáp số câu "khoảng thời gian gia tốc tăng" là $126-23{,}1\approx103$, không phải $105$. Cả 4 câu còn chép $v(t)=\dots+23$ thay vì $+23{,}61t-3{,}083$ (không ảnh hưởng đáp số).
- **C4.6.3** — đề thật không có câu thang trượt thuần (chỉ kiến bò trên thanh trượt); ví dụ 1a vẫn giữ thang trượt vì mô tả dạng nêu tên. Bể có vật chắn (2 câu, cần thể tích chỏm cầu) chưa có ví dụ.
