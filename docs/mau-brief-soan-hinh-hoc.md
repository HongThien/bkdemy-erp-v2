# MẪU BRIEF giao subagent soạn câu — luồng kho kiểu 1 (xem `luong-kho-kieu-1-hinh-hoc.md`)

> Bản dưới đây là brief đã dùng thật cho bài HH00104 (08/10/2026). Bài mới: đổi mã bài, thư mục nguồn (`b5` → thư mục trích của bài đó), **WHITELIST** (= lý thuyết bài đó + các bài trước), ghi chú đánh số/hình lệch chỗ, và đường dẫn scratchpad. Giữ nguyên phần luật, định dạng, vẽ hình, verify, đầu ra.

# BRIEF CHUNG — bài HH00104 "Tam giác cân. Đường trung trực của đoạn thẳng" (Hình 7, phần HỌC)

Mày là một trong 4 người soạn (nhom1..nhom4). Tên nhóm + danh sách câu của mày ghi ở cuối lời giao việc. Thay `<NHOM>` bên dưới bằng tên nhóm của mày (vd `nhom2`).

## Việc phải làm
Với CÁC CÂU ĐƯỢC GIAO: (1) soạn ĐỀ hoàn chỉnh, (2) soạn LỜI GIẢI CHI TIẾT chuẩn lớp 7 Việt Nam, (3) VẼ HÌNH bằng code cho từng câu. KHÔNG ghi DB, KHÔNG sửa file trong repo — chỉ ghi file nháp + ảnh vào scratchpad. Làm CẨN THẬN: một khẳng định sai trong lời giải là lỗi nặng; không chắc thì ghi vào mục nghi vấn, KHÔNG bịa.

Scratchpad = `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\fc494534-c14a-4d0e-94ae-f8e006777e11\scratchpad\`

## Nguồn (đã trích sẵn)
- Văn bản: `<scratchpad>\b5\van_ban.md` — mỗi đoạn 1 dòng. Công thức Word là ảnh WMF nên text mất sạch; chúng được đánh dấu NGAY CHỖ bằng `⟦imageN.wmf⟧` (vd "a) ⟦image24.wmf⟧." = công thức của ý a); đọc đúng thứ tự). Đầu file là TÓM TẮT LÝ THUYẾT của bài — đọc kỹ, đó là whitelist kiến thức. Cuối file là "HƯỚNG DẪN GIẢI - ĐÁP SỐ" (gợi ý ngắn, nhiều chỗ "tương tự", "HS tự làm") — dùng đối chiếu, nhưng phải viết lời giải ĐẦY ĐỦ từng bước.
- Ảnh: `<scratchpad>\b5\png\imageN.png` (công thức WMF đã đổi PNG phóng 4x) hoặc `imageN.jpeg/png` (hình vẽ gốc). Dùng Read tool để XEM ảnh. Phải xem hết ảnh của câu mình mới ghép được đề.
- Hình jpeg/png nổi trong Word hay NẰM LỆCH CHỖ so với câu (đứng trước/sau câu khác) — đối chiếu NỘI DUNG hình (tên điểm, cấu hình) với đề trước khi dùng. Công thức WMF MẤT DẤU MŨ góc (vd "ABC = ACB" có thể là $\widehat{ABC}=\widehat{ACB}$) — suy từ ngữ cảnh + hướng dẫn giải.
- Đánh số trong Word: có hai chỗ ghi "13."; ba ý "a) Tính … b) Chứng minh … c) Chứng minh … đều" ngay sau câu "12." thuộc về câu 12 (đánh số nhầm); "13. Cho … vuông cân" mới là câu 13 thật.

## LUẬT BẮT BUỘC — đọc 3 file trước khi viết
1. `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\docs\log-giai-hinh-hoc-bai.md` (R1: sau dấu chấm xuống dòng · R2: KHÔNG dòng trống thừa · luồng hình đề · lưu ý typo).
2. `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\spec-giai-bai-ai.md` (ý sau dùng lại kết quả ý trước; verify bằng toạ độ trước khi chốt; đề mâu thuẫn hình → ưu tiên hình, ghi chú, không tự sửa).
3. Mẫu hình vẽ: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\scripts\anh\ve_hinh_hh101_102.mjs` và thư viện `...\scripts\anh\ve_hinh_lib.mjs` (seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu).
Mẫu đầu ra ĐÃ hoàn chỉnh của bài trước để bắt chước nhịp (đề + lời giải + ghi chú hình): `<scratchpad>\draft_B4_nhom2.md`.

### WHITELIST kiến thức (bài HH00104)
ĐƯỢC dùng: toàn bộ kiến thức lớp 6 + lớp 7 các bài trước (tổng 3 góc, định lí góc ngoài của tam giác, kề bù, đối đỉnh, so le trong/đồng vị/trong cùng phía, song song/vuông góc, tiên đề Ơ-clit, tia phân giác, trung điểm, c.c.c / c.g.c / g.c.g, 4 trường hợp bằng nhau của tam giác vuông viết tắt "(ch - gn)", "(cgv - cgv)", "(cgv - gn)", "(ch - cgv)", cạnh–góc tương ứng) + lý thuyết CỦA CHÍNH BÀI NÀY: tam giác cân (định nghĩa; hai góc đáy bằng nhau; dấu hiệu: hai cạnh bằng nhau / hai góc bằng nhau ⇒ cân), tam giác vuông cân (hai góc nhọn bằng 45°; dấu hiệu), tam giác đều (ba góc bằng 60°; dấu hiệu: ba cạnh / ba góc bằng nhau / tam giác cân có một góc 60°), đường trung trực của đoạn thẳng (định nghĩa: đường thẳng vuông góc với đoạn thẳng tại trung điểm của nó; tính chất: điểm nằm trên đường trung trực thì cách đều hai mút).
CẤM: định lý Pytago, đồng dạng, Ta-lét, hình bình hành, lượng giác, đường trung bình; chiều ĐẢO của tính chất trung trực ("điểm cách đều hai mút thì nằm trên trung trực") — KHÔNG có trong lý thuyết ⇒ muốn chứng minh một đường thẳng là trung trực phải dùng ĐỊNH NGHĨA (vuông góc tại trung điểm), đúng như hướng dẫn 6A/7B; tính chất "trong tam giác cân, phân giác ở đỉnh đồng thời là đường cao/trung tuyến/trung trực" KHÔNG có trong lý thuyết ⇒ phải chứng minh qua tam giác bằng nhau. Không giải được trong whitelist → KHÔNG dùng công cụ ngoài; ghi rõ ở mục nghi vấn.

### ĐỊNH DẠNG (R1 + R2 — Thùy đã chê lỗi này, đừng lặp lại)
- `noi_dung` (đề): KHÔNG có dòng trống nào. Câu dẫn, ý a), b), c)… mỗi thứ một dòng, nối nhau bằng 1 xuống dòng đơn.
- `loi_giai`: xuống dòng ĐƠN sau mỗi câu/dòng (không dòng trống); cách đúng MỘT dòng trống chỉ TRƯỚC ý b), c), d)… Không bao giờ 2 dòng trống liền. Mỗi điều kiện khi "Xét hai tam giác" nằm 1 dòng riêng.
- LaTeX: `\triangle ABC`, `\widehat{ABC}`, `\parallel`, `\perp`, `\Rightarrow`, `\dfrac`, `^\circ`; mỗi công thức bọc riêng `$...$`. Dùng "(giả thiết)", "(hai góc tương ứng)", "(hai cạnh tương ứng)", "(hai góc kề bù)", "(hai góc đối đỉnh)", "(hai góc so le trong)", "(tổng ba góc của tam giác)", "(tính chất góc ngoài của tam giác)", "($\triangle ABC$ cân tại $A$)". Kết ý bằng "Vậy …" / "Do đó …". Thứ tự đỉnh khi viết tam giác bằng nhau phải khớp tương ứng. Ý sau dùng lại kết quả ý trước ("theo câu a)").
- Đề PHẢI TỰ ĐỦ dữ kiện không cần nhìn hình: mọi dữ kiện chỉ có trên hình (gạch bằng nhau, góc vuông, SỐ ĐO GÓC) phải ghi thẳng vào đề dạng "biết …". Ký hiệu đánh dấu góc bằng nhau trên hình là GÓC, đừng gọi "cung" (cung lớp 9).
- Mẫu lời giải đã được Thùy duyệt (đúng nhịp):
```
a) Xét $\triangle ABH$ và $\triangle ACH$ có:
$AB=AC$ (giả thiết);
$\widehat{BAH}=\widehat{CAH}$ (giả thiết);
$AH$ chung.
Do đó $\triangle ABH=\triangle ACH$ (c.g.c).

b) Vì $\triangle ABH=\triangle ACH$ (câu a) nên $\widehat{ABH}=\widehat{ACH}$ (hai góc tương ứng).
```

## VẼ HÌNH (bắt buộc cho MỌI câu có thể vẽ — Thùy: "nhiều câu đề cần hình")
- Viết 1 file `<scratchpad>\ve_B5_<NHOM>.mjs`, import thư viện bằng URL file tuyệt đối: `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`. Chạy bằng `node <file>` từ thư mục scratchpad. Mỗi hình gọi `luu(dirRa, ten, w, h, svgDoc(w, h, T(dx, dy, body)))`. dirRa = `<scratchpad>\hinh_B5_<NHOM>\`. Tên file = nhãn câu: `B5_2A.png`… (một câu nhiều hình con a), b), c) / H1, H2 → ghép thành MỘT ảnh, mỗi hình con kèm nhãn bên dưới).
- Hình phải DỰNG ĐÚNG theo dữ kiện đề (song song/bằng nhau/vuông góc/phân giác/số đo góc tính bằng toạ độ, không ước mắt); KHÔNG vẽ sẵn dữ kiện là ĐÁP ÁN (vd câu "tính số đo góc" thì không ghi số đo cần tìm; câu "chứng minh tam giác cân" thì không đánh dấu cặp cạnh bằng nhau cần chứng minh); hai góc kề nhau đánh dấu bằng 2 bán kính khác nhau; góc vuông dùng rightAngle; số đo góc cho trước ghi bằng label gần đỉnh. Câu có hình trong Word: vẽ lại trung thành bố cục + ký hiệu (xem ảnh). Câu dựng bằng lời: dựng từ giả thiết.
- Chừa ≥ 35px dưới nhãn đáy; canvas cao ≲ 450px (app thu hình về cao tối đa 288px); nhãn không đè lên đường/điểm khác.
- Sau khi vẽ: gom ảnh thành bảng và XEM bằng Read: `node <scratchpad>\bang.mjs <dirRa> <dirRa>\_bang.png "^B5_"` rồi Read `_bang.png`; sửa mọi hình cắt nhãn / sai ký hiệu / sai dữ kiện rồi vẽ lại cho tới khi đúng.

## VERIFY
Dựng toạ độ số cho từng câu (script node trong scratchpad, tạo bằng Write tool — KHÔNG dùng heredoc cho nội dung có LaTeX) và kiểm TỪNG khẳng định trong lời giải (bằng nhau, vuông góc, song song, thẳng hàng, số đo góc, tương ứng đỉnh); điểm "bất kỳ" thử ≥2 bộ toạ độ. Chỉ chốt lời giải khi verify PASS.

## ĐẦU RA
File `<scratchpad>\draft_B5_<NHOM>.md`, mỗi câu một khối đúng khuôn:
```
### <nhãn, vd 2A> → HH00104
**noi_dung:**
<đề>
**loi_giai:**
<lời giải>
**cấu hình hình / nghi vấn:**
<mô tả hình; typo; câu nào verify; công cụ ngoài whitelist nếu có>
**hinh:** <tên file png, vd B5_2A.png>
```
Cuối cùng báo lại ≤200 từ: câu nào xong, câu nào còn nghi vấn / bị chặn bởi whitelist, hình nào chưa chắc.
