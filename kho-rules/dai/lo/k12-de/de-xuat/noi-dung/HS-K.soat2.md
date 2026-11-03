KẾT LUẬN: ĐẠT

# Soát phần BỔ SUNG — HS lượt K (C4.3, C4.5, C4.6), 03/11

Phạm vi: `diff HS-K.truoc-bs.txt HS-K.txt` gồm 5 ví dụ mới (C4.3.1 VD3 robot qua bãi cát · C4.3.3 VD4 cọc góc hồ · C4.6.3 VD3 bể có khối cầu chắn, VD4 kiến trên thang trượt, VD5 xe trong Oxyz), 2 ý lý thuyết + 1 chú ý ở C4.3.1, 4 ý lý thuyết ở C4.6.3, đổi tên C4.3.3, cập nhật GHI CHÚ. Phần cũ: rà nhanh, chạy máy kiểm.

## Tự giải lại (script riêng `S\soat2\HS-K\giai.cjs`, giải bằng quét số trực tiếp, không dùng công thức của bài)
| Ví dụ | Kết quả máy | Khớp lời giải |
|---|---|---|
| C4.3.1 VD3 robot | T nhỏ nhất 2,23607 = √5 phút tại d ≈ 45; T(0)=2,6, T(18)=2,6515, T(60)=2,2835; xuất phát 8:07:45,836 → 8:07:45 | Đúng |
| C4.3.3 VD4 cọc K(16;2) | PQ nhỏ nhất 22,3607 = 10√5; AP=20, AQ=10, S=100 | Đúng |
| C4.6.3 VD3 bể + khối cầu | V′(h) tại h=5 là 75π; h′=0,2 dm/phút | Đúng |
| C4.6.3 VD4 kiến | h lớn nhất 0,75 m tại t ≈ 3,536 = 5/√2 | Đúng |
| C4.6.3 VD5 xe Oxyz | d(3)=300, d′(3)=36 m/phút | Đúng |

## Đối chiếu đề thật (`cau-dang.cjs`)
- Robot: T1120000006062 (khu đất vuông 200 m, bãi cát chính giữa, 3 và 2 m/s); "xuất phát muộn nhất lúc mấy giờ" có ở câu bạn Hoa (C4.3.1). Ví dụ cùng kiểu, số liệu khác.
- Cọc góc hồ: T1120000006428 (K cách 3 m và 9 m, hỏi diện tích) và câu K cách 2 m và 6 m (hỏi chiều dài). Ví dụ dùng 2 m và 16 m, cùng kiểu, không chép đề.
- Bể có khối cầu: T112020402217 (cạnh 50√π cm, R=30). Ví dụ dùng cạnh 10√π dm, R=5 dm, không cùng tỉ lệ.
- Kiến: T1120000002959 (1,2 m; 0,4; 0,2). Ví dụ dùng 2,5 m; 0,5; 0,3.
- Xe Oxyz: T312010802028 (mô tô, 600 m/6 phút, C(1500;600;0), phút thứ 8 ⇒ 80). Ví dụ dùng 240 m/4 phút, phút thứ 3 ⇒ 36. Ranh giới: chỉ dùng toạ độ để ghi vị trí, không có phương trình mặt phẳng/đường thẳng/mặt cầu, phần tính là đạo hàm khoảng cách theo t ⇒ vẫn là bài Hàm số (tốc độ thay đổi).
- C4.3.3: tên mới khớp `HS.json`; lý thuyết (thang/sào, gara, độ chiếu sáng) và 4 ví dụ không còn ý góc nhìn.
- Miền thực tế: robot d∈[0;60], kiến t∈[0;5] và kiến chưa tới A (1,5 < 2,5), bể h∈(0;10] chưa vượt đỉnh khối cầu, xe t∈[0;10]. Không có ca suy biến.

## Chỗ đã sửa
| Vị trí | Lỗi | Sửa |
|---|---|---|
| C4.5.2 VD2, hình đồ thị | Máy kiểm báo "tỉ lệ 1:1 quá nhỏ" (luật đồ thị mới); hai trục là giờ và km, khác đơn vị | Thêm `"tyle":"tudo"` (dựng lại SVG bằng `ve.mjs`: khung 380×290) |
| GHI CHÚ CHO CEO | Đường dẫn script hỏng (`\b`, `\t` thành ký tự điều khiển: `SbsHS-K<tab>hu.cjs`) | Ghi lại `S\bs\HS-K\thu.cjs`, thêm script soát `S\soat2\HS-K\giai.cjs` và ghi chú tyle tudo |

Máy kiểm: `kiem-moi.mjs HS HS-K.txt …` ⇒ 3 nhóm · 8 dạng · 22 ví dụ · 1 hình · **lỗi 0** · cảnh báo 0.

## Cần CEO xem
- C4.6.3 VD4 (kiến trên thang trượt) thực chất là bài tìm lớn nhất theo t, không phải "tốc độ liên quan". Giữ ở C4.6.3 vì câu đề thật T1120000002959 được ánh xạ vào dạng này; nếu muốn, chuyển cả câu đề và ví dụ sang C4.3.2 (khoảng cách/quãng đường lớn nhất).
- Đề thật hỏi kiểu "xe trong Oxyz" mang mã T3… (chương toạ độ). Nội dung là đạo hàm nên để ở Hàm số là hợp; cần CEO xác nhận không xếp trùng ở PP toạ độ.
