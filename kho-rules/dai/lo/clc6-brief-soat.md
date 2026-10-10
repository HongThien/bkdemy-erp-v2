# Brief ĐỌC SOÁT lời giải — đề thi vào lớp 6 CLC (bộ 58 đề), 10/10

Bạn là người ĐỌC SOÁT (người làm ≠ người kiểm) cho MỘT đề thi vào lớp 6 đã được người khác soạn lời giải. HS lớp 5 sẽ đọc các lời giải này.
**Đáp số đã được so ba nguồn độc lập ở khâu khác** — việc của bạn là soát LỜI GIẢI: đúng toán từng dòng, đúng kiến thức lớp 5, đúng luật trình bày, dễ hiểu.

**Đọc trước (bắt buộc, đọc HẾT)** — để biết luật mà người soạn phải theo:
1. `kho-rules/dai/lo/clc6-brief-soan.md` (brief soạn của bộ đề này) và 2 tài liệu "Đọc trước" nêu trong đó
   (`kho-rules/dai/lo/k5T-brief-soan.md`; `kho-rules/dai/k5T.md` mục §2, §2b).
2. `kho-rules/dai/clc6-mau-thu.md` — bản mẫu CEO đã duyệt (khuôn chuẩn để so).

## Đầu vào
- `<IN>` — đề (`cau[]`: `ma_nguon`, `kieu`, `noi_dung`, `lua_chon`, `hinh[]`, `luu_y_de`). Câu có `hinh[]` ⇒ **mở ảnh bằng Read** trước khi soát.
- `<SOAN>` — bản soạn: mảng `{ ma_nguon, dap_an, loi_giai, so_do_mo_ta?, ghi_chu_nghi?, bo? }`. Chỉ soát các câu có trong `<IN>`.

## Soát TỪNG câu — theo đúng thứ tự này
1. **Đúng đề.** Lời giải dùng đúng số liệu, đúng điều đề hỏi, đủ mọi ý (a, b, c…), làm theo `luu_y_de` nếu có. Dữ kiện lấy từ hình có đúng với hình không.
2. **Đúng toán từng dòng.** Mỗi phép tính trong Phần 2: tính lại (phép nào không nhẩm chắc được thì chạy `node -e`). Mỗi câu lập luận: có suy ra được từ dòng trước không,
   có nhảy bước, có dùng điều chưa chứng minh không. Kết quả cuối của Phần 2 phải trùng `dap_an` (trắc nghiệm: dòng cuối `Chọn X.` trùng `dap_an`).
3. **Đúng kiến thức lớp 5.** Không đặt ẩn / lập phương trình / chuyển vế, không số âm, không kiến thức lớp 6 trở lên (tam giác đồng dạng, Ta-lét, luỹ thừa, căn, đồng dư…),
   trừ kí hiệu đề đã dùng. Lập luận chia hết chỉ dùng dấu hiệu chia hết và phép chia có dư.
4. **Đúng cách chuẩn CEO đã chốt** (bảng §2b của `k5T.md` + mục "Cách chuẩn CEO chốt riêng cho đề thi" của brief soạn): bài tích hai đại lượng + phần trăm không "giả sử 100";
   sơ đồ đúng luật (bài nào bắt buộc có, hàng hơn 12 phần thì bỏ, nhãn sơ đồ không lộ đáp số); bài nhiều cách có `ghi_chu_nghi`.
5. **Phần 1 (card).** 3–6 bước là **bước nghĩ thật** của bài này (không chung chung "đọc kĩ đề", không vụn, không chép lại Phần 2), **không lộ đáp số cuối**,
   "Mấu chốt" nêu đúng ý quyết định của bài. Phần 1 và Phần 2 cùng một cách giải.
6. **Phần 2 (trình bày).** Câu lời giải – phép tính – đơn vị – "Đáp số" theo khuôn lớp 5; mỗi dòng một ý; HS lớp 5 đọc hiểu được mà không phải tự bù bước.
7. **`ghi_chu_nghi`.** Cách hiểu đề của người soạn có hợp lí không; có cách hiểu tự nhiên hơn cho đáp số khác không.

## Phân mức
- `sai` — sai toán, sai dữ kiện, thiếu ý, lập luận hỏng, dùng kiến thức ngoài lớp 5, lộ đáp số ở Phần 1, trái cách chuẩn CEO. **Bắt buộc sửa.**
- `nen_sua` — đúng nhưng khó hiểu / nhảy bước / dài dòng rõ rệt. Sửa nếu bạn chắc bản sửa tốt hơn.
- `hoi` — bạn không phân xử được (đề mơ hồ, hai cách hiểu, nghi `dap_an` sai). **Không sửa**, chỉ báo.
Đừng báo chuyện vặt (đổi một từ đồng nghĩa, thứ tự hai câu tương đương). Câu không có vấn đề thì không ghi gì.

## Sửa
- Chỉ sửa chỗ bạn **chắc chắn**. **KHÔNG đổi `dap_an`** — nghi đáp số sai thì báo mức `hoi` kèm phép tính của bạn.
- Sửa câu nào thì viết lại **nguyên cả câu** (đủ mọi trường như bản soạn) vào `<SUA>` = mảng JSON chỉ gồm các câu đã sửa.
  Viết bằng một script `.mjs` dùng `String.raw` rồi `JSON.stringify` (không gõ JSON tay, không dán LaTeX qua dòng lệnh — gạch ngược sẽ hỏng).
- Bản sửa phải qua lại các cổng của người soạn: `kiemP1(phan1)` trả mảng rỗng (`scripts/kho/sach/kiem-p1-card.mjs`), số `$` chẵn, KaTeX không lỗi,
  số lần "Ta có sơ đồ:" bằng số phần tử `so_do_mo_ta`, sơ đồ sửa thì chạy lại máy vẽ như brief soạn 5T hướng dẫn.

## Đầu ra
1. `<BB>` = biên bản JSON: `{ "ma_de": "...", "so_cau": n, "ket_luan": "ĐẠT" | "CHƯA ĐẠT", "van_de": [ { "ma_nguon": "...", "muc": "sai|nen_sua|hoi", "loai": "toán|dữ kiện|kiến thức|cách chuẩn|phần 1|trình bày|sơ đồ|hiểu đề|đáp số", "mo_ta": "...", "da_sua": true|false } ] }`
   (`ket_luan` = "CHƯA ĐẠT" khi còn vấn đề mức `sai` mà bạn chưa sửa được).
2. `<SUA>` = mảng các câu đã sửa (mảng rỗng `[]` nếu không sửa câu nào).

## Cấm
Không mở PDF / lời giải có sẵn / kết quả kiểm của bộ đề. Không ghi DB. Không sửa tệp trong repo (kể cả `<SOAN>`) — chỉ ghi `<BB>`, `<SUA>` và thư mục nháp của bạn.

## Trả lời cuối
Vài dòng: kết luận · số vấn đề theo mức · câu nào đã sửa (sửa gì) · các câu mức `hoi`.
