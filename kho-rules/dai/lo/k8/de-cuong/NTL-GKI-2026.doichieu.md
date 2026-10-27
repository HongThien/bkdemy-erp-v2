# Biên bản ĐỐI CHIẾU ĐỀ — NTL-GKI-2026 (THCS Nam Từ Liêm, Toán 8 GKI 2026–2027) — 24/10

- Nguồn: `<LV>\anh\t-01.png … t-15.png` (t-16 chỉ là bóng mờ, bỏ); phóng to `pdftoppm -r 260` tại các chỗ nghi (trang 1 toàn bộ, Tiết 20 Bài 3a, Dạng 1 Bài 6, Dạng 3 Bài 3, Đề 2 Bài 3a, Tiết 19 VN Bài 4).
- Số câu: **201 trước → 201 sau** · 17 phần · **23 trạm (không đổi, không có tệp `.p<N>.soan.md` thừa)** · 12 hình đề · chạy lại build in "✔".
- **Tiết 19 (trang 1, có chữ viết tay của HS)**: đã đối chiếu từng câu ở 260 dpi — Câu 1–5 (đủ 4 phương án, đúng nội dung), Bài 1a–d, 2a–d, 3a–d, Bài 4, Bài 5a–b, VN Bài 1–4: **khớp hoàn toàn**, không lỗi chép.
- Tách ý / nhãn: đúng như yêu cầu (Đề 1 đủ 5 bài; Đề 4 Bài 1 → 1a/1b/1c; Dạng 1 Bài 2, 4, 5 đổi mục 1)…n) thành a, b, c; Tiết 20 VN Bài 1 nhãn e, g như in; Hình Bài 2 một câu). Không sửa nhãn nào.
- Trắc nghiệm: 43 câu, tất cả đủ 4 phương án A–D, đúng nội dung và đúng thứ tự (Đề 1 Câu 3 đề in xen cột A–C / B–D — đã xếp đúng A, B, C, D).

## Lỗi và sửa

| Câu | Lỗi | Sửa gì |
|---|---|---|
| Dạng 3 Bài 1d | định dạng — dấu chấm kết câu nằm TRONG công thức (`…+45.$`) | đổi sang `bt(...)` ⇒ chấm ngoài `$` |
| Dạng 2 Bài 2 | thiếu dữ kiện trong lời đề — bảng số tấm chỉ nằm ở ghi chú "Đọc hình" | thêm bảng `\begin{array}` (Số tấm mỗi loại × A, B, C; Lần 1: 2, 4, 5; Lần 2: 4, 3, 6) vào `noi_dung`, thêm ghi chú |
| Đề 3 Bài 4a (4.1) | phân kho — đặt `dai` | đổi `hinh_hoc`: câu thuộc Bài 4 phần hình của đề (hình thang cân → hình chữ nhật, toán hình học thực tế cùng loại "Hình Dạng 1"); sửa ghi chú |
| Hình Câu 1, 2 · Đề 1 Câu 5 · Đề 2 Câu 4, 5 (PA C), 6 · Đề 3 Câu 5 · Đề 4 Câu 4 (PA A) | ký hiệu — đề in góc không có mũ ("A = 60°", "A = C", "ADC = BCD", "M = P"…), bản gõ để trần dễ đọc thành điểm/đoạn | gõ `\widehat{…}` + ghi chú "đề in không có ký hiệu góc" (cùng cách bản gõ đã làm ở Hình Câu 4, Tiết 21 VN Bài 2; Đề 4 Câu 6 đề in sẵn mũ) |
| Tiết 20 Bài 4 | ghi chú "Đọc hình" dùng `\times` (K8 cấm) | viết lại "hình vuông cạnh $x$ / cạnh $y$, hình chữ nhật kích thước $x$ và $y$" |
| Đề 2 Bài 6b | ghi chú hình sai chữ: "cốc úp miệng rộng lên trên" (hình là cốc để NGỬA) | "cốc để ngửa (miệng rộng hướng lên trên)" |
| hình `de_cay_co_thu.png` | hình — mép dưới dính dòng "…m D trên cạnh AB, điểm E trên cạnh…", mép trên dính đáy hình EFGH | cắt lại (r200, x860 y530 W545 H367), giữ đủ nhãn "90 m", D, C; làm trắng chữ in xuyên trang ở nền (trừ vùng cây) |
| hình `de_hinh_thang_can.png` | hình — dính dòng đề phía trên và chữ xuyên trang mép dưới/phải | cắt lại (r200, x855 y1393 W465 H240) + làm trắng nền (ngưỡng sáng) — còn đủ D, C, A, B, 60° |
| hình `de_hop_bia.png` | hình — **mất nhãn "z cm"** (số liệu chiều rộng nằm ngoài khung cắt cũ) + chữ xuyên trang | cắt lại (r200, x750 y195 W740 H455) có cả "z cm", "y cm", 8 nhãn "x cm"; làm trắng nền |
| hình `de_tam_kinh.png` | hình — mép dưới dính nửa dòng "Lập đa thức…", mép trên sát dòng chữ | cắt lại (r200, x325 y1128 W1090 H286) — đủ bảng + Hình 1 |
| hình `de_san_bong.png` | hình — mép dưới dính dấu của dòng "a) Viết biểu thức…" | cắt lại (r200, x548 y172 W575 H320) — đủ "10x + 5y (m)", "10x - 5y (m)" |
| hình `de_hinh_vuong_chia.png` | hình — chữ xuyên trang mờ trong nền | làm trắng nền (không đổi khung) |

Các hình còn lại (`de_khoi_go`, `de_cau_thang`, `de_hinh_kinh_efgh`, `de_manh_vuon`, `de_5_coc`, `de_hinh_thang_ban_dat`): đủ khung, đúng bài, "Đọc hình" khớp; `de_khoi_go` còn chữ xuyên trang rất mờ trong nền (hình màu, không lọc ngưỡng được) — không ảnh hưởng đọc.

## Hạ 8 cờ CHƯA CHẮC → ghi chú thường (luật Thùy 24/10 "đề sai: giải bình thường, ghi rõ đề sai")

Tất cả 8 chỗ đều **đọc rõ trên ảnh** — là lỗi in / thừa chữ / vênh dữ kiện, không phải chữ không đọc được:

| Câu | Ảnh in | Ghi chú mới |
|---|---|---|
| Tiết 19 VN Bài 4 | "Người ta **làm** muốn quy hoạch…", "$6x-6\,\text{m}^2$" | thừa chữ; hiểu là diện tích $(6x-6)\,\text{m}^2$ |
| Dạng 1 Bài 6a | rõ ràng **$(x^2+1)$** (phóng 260 dpi) | đề in sai: với $(x^2+1)$ đẳng thức sai (vế trái bậc 7); lời giải ghi rõ, chứng minh với $(x+1)$ |
| Hình Câu 3 | $AB=5\,\text{cm}$, $AD=1{,}2\,\text{cm}$, phương án tính bằng m | đề in nhầm đơn vị |
| Hình Dạng 1 Bài 1 | "cộng trình" | lỗi chính tả = "công trình" |
| Đề 1 Câu 6 | "dưới nào đây" | thừa chữ |
| Đề 1 Bài 4b | "$BFH=ADG$" không ký hiệu | đã kiểm: $\triangle BFH=\triangle ADG$ (c.c.c: $BF=AD$, $BH=AG$, $FH=DG$) nên cũng có cặp góc bằng nhau — lời giải chứng minh tam giác rồi suy ra góc |
| Đề 2 Bài 4 | lời đề $15x+5y$, hình $10x+5y$ | vênh lời–hình; giải theo lời đề, ghi rõ hình in khác |
| Đề 3 Câu 3 | phương án C ≡ D ($-10x^2y+4xy^2$) | in trùng; đáp án đúng là A ($-4x^2y+3xy^2$) nên câu vẫn làm được |

**Danh sách CHƯA CHẮC cuối cùng: KHÔNG CÒN câu nào.**

## Điều nghi, không tự quyết

- **Đề 4 Bài 1b**: bản gõ chép lại biểu thức $A$ của 1a vào đề để câu đứng riêng (đúng ý brief tách 1a/1b/1c) — trạm soạn nhớ 1b phụ thuộc 1a.
- **Dạng 2 Bài 2**: bảng đưa vào lời đề bằng `\begin{array}` có `\text{Số tấm mỗi loại}`, `\text{Lần 1}` — KaTeX in cảnh báo "No character metrics for 'ạ'" (chỉ cảnh báo phông, vẫn dựng được). Nếu màn app không hiển thị `array` đẹp thì đổi sang 2 dòng chữ.
- **Dạng 3 Bài 1**: đề chỉ ghi "Tìm giá trị lớn nhất (nhỏ nhất)" chung — trạm soạn tự xác định ý nào GTLN (b, c: hệ số $x^2$ âm), ý nào GTNN (a, d).
- **Đề 2 Bài 3a**: "$+3b^5$" in rõ — biểu thức rút gọn được ($3a^5+3b^5$), không phải lỗi.
- **Hình Bài 2 (9 khẳng định)** giữ một câu tự luận như yêu cầu.
