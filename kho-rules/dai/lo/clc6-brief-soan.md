# Brief SOẠN lời giải — đề thi vào lớp 6 CLC (bộ 58 đề), 10/10

Bạn soạn lời giải cho MỘT đề thi vào lớp 6 (kiến thức Toán lớp 5 nâng cao). Lời giải vào kho câu hỏi của trung tâm, HS lớp 5 đọc.

**Đọc trước (bắt buộc, đọc HẾT) — luật giải đã được CEO duyệt, áp Y NGUYÊN:**
1. `kho-rules/dai/lo/k5T-brief-soan.md` — khuôn lời giải 2 phần, Phần 1 dạng CARD **3–6 bước**, luật sơ đồ, các lỗi hay vấp.
2. `kho-rules/dai/k5T.md` mục §2, §2b — cách giải chuẩn từng dạng lớp 5 (tổng–tỉ, hai hiệu số, giả thiết tạm, tỉ số %, chuyển động, tỉ số diện tích…).

Brief này chỉ nêu phần KHÁC của đề thi.

## Đầu vào
`<IN>` = `{ ma_de, ten_de, phan[], cau[] }`. Mỗi câu: `ma_nguon` (vd `"LTV 2018 · 7"`, `"CG 2022 · P1.3"`), `kieu`, `noi_dung`, `lua_chon` (nếu trắc nghiệm), `hinh[]` (đường dẫn ảnh — **phải mở bằng Read** rồi mới giải),
`luu_y_de` (nếu có — cách hiểu đề đã được người duyệt chốt: **làm đúng theo đó** và nói rõ giả thiết ấy trong lời giải).
Đề đã được đối chiếu với bản PDF gốc và sửa lỗi chép trước khi giao cho bạn.

## Mỗi câu của đề = MỘT câu kho
- **Không tách ý**, kể cả câu có a) b) c) — giữ đúng đơn vị câu của đề (đề thi sau này còn in lại nguyên đề).
- Soạn theo đúng thứ tự `cau[]`, `ma_nguon` chép y nguyên.

## Ba kiểu câu
| `kieu` | `dap_an` | Phần 2. Trình bày |
|---|---|---|
| `dien` (điền đáp số) | đáp số gọn như HS ghi vào ô: số + đơn vị (`$36000$ đồng`, `$x=4$`, `Thứ Ba`) | trình bày ĐẦY ĐỦ như bài tự luận lớp 5 (câu lời giải – phép tính – đáp số); bài "Tính / Tìm $x$" thì biến đổi từng dòng |
| `trac_nghiem` | **một chữ cái** `A`/`B`/`C`/`D` | giải ra kết quả như trên, dòng cuối: `Chọn B.` (không lặp lại nội dung phương án trong `dap_an`) |
| `tu_luan` | `a) …; b) …` (mỗi ý một đáp số) | `a)` … `b)` …, mỗi ý trình bày đầy đủ; ý sau DÙNG LẠI kết quả ý trước |
| `dung_sai` (bốn mệnh đề a–d, trả lời Đúng – Sai) | `a) Đúng; b) Sai; c) Sai; d) Đúng` (đủ mọi mệnh đề, đúng thứ tự) | tính các số liệu chung trước, rồi `a)` … `b)` … mỗi mệnh đề một đoạn: tính / so sánh rồi kết luận "Đúng." hoặc "Sai." |

- Trắc nghiệm: phải GIẢI ra kết quả rồi mới đối chiếu phương án — không thử từng phương án (trừ khi đề đúng là bài "thử chọn").
  Kết quả không trùng phương án nào ⇒ `dap_an: ""` + `ghi_chu_nghi` nêu kết quả tính được; **không chọn bừa**.
- Đề thi có câu ngoài khuôn sách (lịch – thứ ngày, suy luận lôgic, đếm, xoá chữ số…): vẫn Phần 1 card 3–6 bước, Phần 2 lập luận bằng câu văn ngắn + phép tính.

## Cách chuẩn CEO chốt riêng cho đề thi (ngoài bảng §2b của k5T.md)
- **Một đại lượng = tích hai đại lượng, đề cho phần trăm thay đổi** (doanh thu = giá vé × số người; diện tích = dài × rộng; quãng đường = vận tốc × thời gian…)
  ⇒ **KHÔNG "giả sử lúc đầu có 100 …"**. Làm bằng tỉ số phần trăm của từng đại lượng so với lúc đầu, rồi nhân/chia các tỉ số:
  "Doanh thu sau so với lúc đầu bằng: $100\%+8\%=108\%$ · Số khán giả sau so với lúc đầu bằng: $100\%+20\%=120\%$ ·
  Giá vé sau so với lúc đầu bằng: $108\%:120\%=1,08:1,2=0,9=90\%$ · Giá vé sau khi giảm là: $40000\times 90\%=36000$ (đồng)".
  **Mấu chốt phải nêu công thức gốc** (Doanh thu $=$ giá vé $\times$ số khán giả) và ý "hai đại lượng trong phép tính thay đổi thì đại lượng còn lại thay đổi tương ứng".
- **Sơ đồ quá lớn thì BỎ sơ đồ** (CEO 10/10): một hàng của sơ đồ có **hơn 12 phần** (vd Toán 83 phần, Tiếng Anh 60 phần) ⇒ không vẽ, không ghi
  "Ta có sơ đồ:", chỉ viết bằng lời "… là 83 phần, … là 60 phần như thế" rồi tính. Các luật sơ đồ khác của 5T giữ nguyên.
- **Bài nhiều cách mà bảng §2b chưa có:** chọn cách bám công thức / quan hệ gốc của bài (không chọn số giả định), và ghi `ghi_chu_nghi`: "nhiều cách: …" để CEO chốt.

## Đề có vấn đề — KHÔNG tự bịa dữ kiện
- Thiếu hình mà đề nói "hình bên", thiếu dữ kiện, số liệu vô lí, điểm/tên không xác định ⇒ ghi `ghi_chu_nghi` (nói rõ thiếu gì, bạn đã hiểu đề thế nào).
  Không thể giải nếu không đoán ⇒ thêm `"bo": "<lý do>"` cho câu đó (vẫn giữ phần tử trong mảng) và bỏ trống lời giải.
- Hình lệch với chữ ⇒ theo đề chữ + ghi chú (như brief 5T, khối "Bài có hình").
- Đề hỏi lửng ("là:", "bằng bao nhiêu") ⇒ giữ nguyên đề, không sửa câu chữ.

## Cấm
- **Không mở bất kỳ tệp PDF / lời giải có sẵn nào** của bộ đề — bạn là người giải độc lập; đáp số sẽ được đối chiếu với nguồn khác.
- Không đặt ẩn / lập phương trình / kiến thức lớp 6+ (trừ kí hiệu đề đã dùng: $x$, $\overline{ab}$…). Không ghi "(như VD … của sách)".
- Không ghi đáp số cuối trong các bước của Phần 1.

## Đầu ra
Tệp `<RA>` = mảng JSON, đúng thứ tự đề:
`[{ "ma_nguon": "...", "dap_an": "...", "loi_giai": "**Phần 1. Hướng dẫn**\n\n…\n\n**Phần 2. Trình bày**\n\n…", "so_do_mo_ta": {…} (nếu có), "ghi_chu_nghi": "..." (nếu có), "bo": "..." (nếu bỏ) }]`
- Viết bằng một script `.mjs` dùng `String.raw` cho từng lời giải rồi `JSON.stringify` (đừng gõ JSON tay — gạch ngược LaTeX sẽ hỏng).
- LaTeX: `\dfrac`, `\times`, chia `:`, số thập phân dấu phẩy, đơn vị ngoài công thức hoặc `\text{cm}^2`; không chữ Việt trong `$…$`.

## Tự kiểm trước khi nộp
1. Tính lại TỪNG đáp số bằng code (script node riêng, phân số chính xác) — độc lập với lời giải đã viết.
2. Phần 1 mọi câu qua bộ kiểm card: `import { kiemP1 } from '<repo>/scripts/kho/sach/kiem-p1-card.mjs'` — `kiemP1(phan1)` phải trả mảng rỗng.
3. Số `$` chẵn, KaTeX không lỗi.
Không ghi DB, không sửa tệp trong repo. Báo cáo ngắn: số câu, câu nào có `ghi_chu_nghi` / `bo` và vì sao, câu nào bạn kém chắc nhất.
