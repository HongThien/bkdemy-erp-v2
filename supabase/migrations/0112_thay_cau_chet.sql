-- 0112 — Thay MỌI tham chiếu câu chết bằng câu CÙNG DẠNG (Thùy chốt 07-21: "thay tự động đi").
--
-- Bối cảnh: trước khi có kho rác (0111), xoá câu là xoá cứng → 150 dòng `tai_lieu_cau` trỏ câu
-- không còn tồn tại. `getTaiLieuFull` lọc `.filter(Boolean)` nên câu chết RỤNG IM LẶNG: tài liệu in
-- thiếu câu mà không ai biết. Nặng nhất là tài liệu MẪU (Giáo trình 11A thiếu 24 câu) vì mẫu còn tái
-- dùng cho mọi lớp mới.
--
-- Suy dạng: mã câu = MÃ DẠNG (8 ký tự) + STT 3 số. Kiểm chứng trên 8675 câu còn sống: đúng 8667
-- (99,9%); 8 ngoại lệ đều là mã đời đầu kiểu DC000006/DCDEMO01 không theo hệ mã.
-- Chọn câu thay: cùng dạng · chưa có trong CHÍNH tài liệu đó · ÍT DÙNG NHẤT trước (cùng luật
-- `suggestCauForDang`) · tie-break theo mã cho tất định.
--
-- KHÔNG xoá dòng nào — chỉ ĐỔI `ma_cau` của 149 dòng. Câu cũ vốn đã không tồn tại nên không
-- mất gì thêm. Mỗi lệnh có guard `and ma_cau = '<mã cũ>'` → chạy lại = no-op, và nếu ai đã sửa tay
-- trước đó thì lệnh tự đứng yên thay vì đè.
--
-- KHÔNG thay được 1 dòng (không suy được dạng / dạng rỗng):
--   DC000012 trong "GT 12A1 18/06/2026 · Buổi 1 : Đơn điệu hàm số"

-- BTVN 9B1 14/07/2026 · Buổi 12: Giải toán bằng cách lập Phương trình · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304030' where id = '1b2b5ed5-bef5-4ea3-bcb5-7ce023ecdcec' and ma_cau = '09020304023';
-- BTVN 9B1 14/07/2026 · Buổi 12: Giải toán bằng cách lập Phương trình · thứ tự 2 · dạng 09020305
update tai_lieu_cau set ma_cau = '09020305011' where id = '96c909b6-296f-4e16-9093-a80e7f8f9364' and ma_cau = '09020305010';
-- BTVN 7B2 01/07/2026 · Buổi 1 · thứ tự 0 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102014' where id = '02183d2f-e9dd-4cd9-90e6-f2344b9f8068' and ma_cau = '07010102005';
-- BTVN 7B2 01/07/2026 · Buổi 1 · thứ tự 1 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102015' where id = '8473a75b-bb85-42ef-8722-81da43657ffd' and ma_cau = '07010102010';
-- BTVN 9S1 13/07/2026 · Buổi 11 · thứ tự 1 · dạng 09020305
update tai_lieu_cau set ma_cau = '09020305021' where id = '8480ae61-8e61-4885-8b2c-c7f7855f07ab' and ma_cau = '09020305010';
-- BTVN 11A1 11/07/2026 · Buổi 4 · thứ tự 0 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502029' where id = '1c2d96f0-085f-48e1-ae18-2118bdd35024' and ma_cau = '11010502004';
-- BTVN 11A1 11/07/2026 · Buổi 4 · thứ tự 1 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502037' where id = '69c17447-3f18-4fb7-ba6d-10bbef302b57' and ma_cau = '11010502005';
-- BTVN 11A1 11/07/2026 · Buổi 4 · thứ tự 6 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502038' where id = '5b956d24-aa96-4e30-8983-3c2288e4f9ac' and ma_cau = '11010502002';
-- BTVN 11A1 11/07/2026 · Buổi 4 · thứ tự 2 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102019' where id = 'c669b66a-da58-44aa-86b7-32a86f1e3bc8' and ma_cau = '11020102002';
-- BTVN 11A1 11/07/2026 · Buổi 4 · thứ tự 3 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102020' where id = '889dff46-8648-47ef-973a-0847debbe2c4' and ma_cau = '11020102004';
-- BTVN 11A1 11/07/2026 · Buổi 4 · thứ tự 6 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102023' where id = '57868387-39b7-4926-ac27-04bc75eb8f41' and ma_cau = '11020102012';
-- GT 9A1 13/07/2026 · Buổi 15: Giải toán bằng cách lập Phương trình · thứ tự 2 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302018' where id = '46f535e3-535c-4aaa-85ff-5f85444fde63' and ma_cau = '09020302002';
-- GT 9A1 13/07/2026 · Buổi 15: Giải toán bằng cách lập Phương trình · thứ tự 3 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302001' where id = '74728e3e-6eae-4258-9285-64c3f9b3458a' and ma_cau = '09020302005';
-- GT 9S1 13/07/2026 · Buổi 11 · thứ tự 1 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304033' where id = 'b9daf762-e4a5-416b-9a89-1d95e18c7c72' and ma_cau = '09020304011';
-- Giáo trình 7A [MẪU] · thứ tự 1 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102017' where id = '23e82360-52d6-4052-936e-645f0290955e' and ma_cau = '07010102005';
-- Giáo trình 7A [MẪU] · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102018' where id = 'd82a2888-01c1-4525-b6e5-8cfa1a065fc2' and ma_cau = '07010102006';
-- Giáo trình 7A [MẪU] · thứ tự 5 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102019' where id = 'c90b0c56-2d32-4f7c-a808-bfcf1bdea458' and ma_cau = '07010102008';
-- Giáo trình 8A [MẪU] · thứ tự 6 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202002' where id = '6bb11171-9a3c-4ea9-9791-1b7d43e0ccc2' and ma_cau = '08010202025';
-- Giáo trình 8A [MẪU] · thứ tự 7 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202004' where id = 'be9b5876-718d-4e33-9c5c-f30fb85429df' and ma_cau = '08010202026';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 1 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502049' where id = '3bbe996f-fd07-46f2-b198-66bbcbfd1ce0' and ma_cau = '11010502003';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 2 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502050' where id = '9d5c3fbd-b327-47b9-96ed-8f69eda4034e' and ma_cau = '11010502004';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502056' where id = '0ead047d-18eb-45cb-9e82-a8d494098a86' and ma_cau = '11010502005';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502060' where id = '3f9efa7f-5f50-4c99-8a97-9d75fe43cb68' and ma_cau = '11010502006';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 5 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502061' where id = '813ac0ad-e866-4072-aa8d-de8d439bb137' and ma_cau = '11010502009';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 8 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502062' where id = '4f59d624-0c56-4549-9ded-f026f7028735' and ma_cau = '11010502014';
-- BTVN 11A1 08/07/2026 · Buổi 3 · thứ tự 9 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502066' where id = '71105647-59e9-4878-a62b-abfff9e88202' and ma_cau = '11010502007';
-- GT 7S2 06/07/2026 · Buổi 2 : Các phép toán với số hữu tỉ · thứ tự 9 · dạng 07010207
update tai_lieu_cau set ma_cau = '07010207003' where id = '131a45c2-cd88-47fa-81f9-5021f162ddc9' and ma_cau = '07010207024';
-- BTVN 7S1 01/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102020' where id = '11bb1bd1-a6ca-4a09-9c16-a7e782494d2f' and ma_cau = '07010102010';
-- Giáo trình 9C1-Giải bài toán bằng cách lập phương trình [MẪU] · thứ tự 0 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302008' where id = '941294d4-ad3d-4b75-8b5f-df18b49006e6' and ma_cau = '09020302006';
-- Giáo trình 11A [MẪU] · thứ tự 0 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502068' where id = 'b547cd66-9c52-4c46-80b8-e50db51706e0' and ma_cau = '11010502004';
-- Giáo trình 11A [MẪU] · thứ tự 0 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502069' where id = 'e81ca60c-d5e9-4883-8c58-6eaf928dfde5' and ma_cau = '11010502003';
-- Giáo trình 11A [MẪU] · thứ tự 1 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502070' where id = '5214612b-847a-4136-8de4-1599f2374f2a' and ma_cau = '11010502005';
-- Giáo trình 11A [MẪU] · thứ tự 1 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502074' where id = 'e21a5cf6-24fd-4dca-a7ac-a9d615255046' and ma_cau = '11010502003';
-- Giáo trình 11A [MẪU] · thứ tự 2 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502029' where id = '6bd111d9-764d-4265-8d73-c46f9165ba7f' and ma_cau = '11010502004';
-- Giáo trình 11A [MẪU] · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502030' where id = '9c3970db-0df9-4626-942a-2dedd18af7c1' and ma_cau = '11010502010';
-- Giáo trình 11A [MẪU] · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502037' where id = 'db0fdbb1-625c-4bde-893a-6ead65b19c46' and ma_cau = '11010502006';
-- Giáo trình 11A [MẪU] · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502038' where id = 'f8bf0442-c5b8-4fd8-be52-3b8d13c59878' and ma_cau = '11010502005';
-- Giáo trình 11A [MẪU] · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502043' where id = '1d5b2dbc-7162-44bd-ba98-9490c3c88ae2' and ma_cau = '11010502006';
-- Giáo trình 11A [MẪU] · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502044' where id = '3f885209-5f85-4cc6-913f-6518292ea050' and ma_cau = '11010502009';
-- Giáo trình 11A [MẪU] · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502049' where id = 'f1d5f03e-8a41-46be-8888-f4929e064d2d' and ma_cau = '11010502008';
-- Giáo trình 11A [MẪU] · thứ tự 5 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502050' where id = '458276ed-b792-4830-8804-60ade70df034' and ma_cau = '11010502009';
-- Giáo trình 11A [MẪU] · thứ tự 6 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502055' where id = 'bbe1f3b0-d2ad-4b3a-825d-0055fd4f5a21' and ma_cau = '11010502002';
-- Giáo trình 11A [MẪU] · thứ tự 6 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502056' where id = 'fbb3f125-edf4-41cd-92b5-6a50eeb2809c' and ma_cau = '11010502010';
-- Giáo trình 11A [MẪU] · thứ tự 8 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502060' where id = '51024621-7e6c-4c84-be15-f2045ccf4c5d' and ma_cau = '11010502014';
-- Giáo trình 11A [MẪU] · thứ tự 9 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502061' where id = '71c605dc-0957-4385-af7c-7830faa9cd53' and ma_cau = '11010502007';
-- Giáo trình 11A [MẪU] · thứ tự 2 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102031' where id = '9657c5f1-3211-4517-b06b-b0a1467fa6e9' and ma_cau = '11020102016';
-- Giáo trình 11A [MẪU] · thứ tự 2 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102034' where id = 'af0af95c-2ce1-49fc-90ff-57b7feb0f966' and ma_cau = '11020102002';
-- Giáo trình 11A [MẪU] · thứ tự 3 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102035' where id = '4906de58-76ef-4df2-9baf-9e48a39cbdfe' and ma_cau = '11020102004';
-- Giáo trình 11A [MẪU] · thứ tự 5 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102036' where id = 'edeab987-beb7-4007-a5fc-7a2af84b4ec3' and ma_cau = '11020102006';
-- Giáo trình 11A [MẪU] · thứ tự 6 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102037' where id = '483c8cbd-2638-42d6-bc95-4408551379e1' and ma_cau = '11020102012';
-- Giáo trình 11A [MẪU] · thứ tự 0 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103019' where id = '368ea3e1-da7e-44d9-973c-420ffad43779' and ma_cau = '11020103001';
-- Giáo trình 11A [MẪU] · thứ tự 1 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103020' where id = 'a9b2cad3-f854-4134-9a28-b213064c6ca4' and ma_cau = '11020103003';
-- Giáo trình 11A [MẪU] · thứ tự 2 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103021' where id = '5419f15a-85cf-4fba-8ab0-01b8beb7b516' and ma_cau = '11020103004';
-- BTVN 9A2 11/07/2026 · Buổi 15 · thứ tự 2 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302008' where id = '3021adc8-816c-41ed-bebf-476e43c28bbb' and ma_cau = '09020302006';
-- BTVN 9A2 11/07/2026 · Buổi 15 · thứ tự 2 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304014' where id = 'f782bf70-e5c5-4a4e-a2fc-b60d64f98bf7' and ma_cau = '09020304023';
-- BTVN 9A2 11/07/2026 · Buổi 15 · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304015' where id = '9c2be8de-0a2f-49d4-bd88-4e651c5f1e5d' and ma_cau = '09020304036';
-- BTVN 9A1 13/07/2026 · Buổi 15: Giải toán bằng cách lập Phương trình · thứ tự 2 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302010' where id = '3bbc40c1-97f6-44d3-9b6e-3c191a2a726f' and ma_cau = '09020302006';
-- BTVN 9A1 13/07/2026 · Buổi 15: Giải toán bằng cách lập Phương trình · thứ tự 2 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304017' where id = '1751c7db-7ea3-4315-85f4-d9dcce007b3a' and ma_cau = '09020304023';
-- BTVN 9A1 13/07/2026 · Buổi 15: Giải toán bằng cách lập Phương trình · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304019' where id = '965810c6-87d5-42ec-ae24-cf981e6a9fee' and ma_cau = '09020304036';
-- ET 11A1 · 08/07/2026 · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502062' where id = '64e2aebc-dfef-4f43-bd06-c4de888a5bc1' and ma_cau = '11010502015';
-- BTVN 7A1 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 1 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102021' where id = 'faf091c4-fcdc-4387-b499-76d271137dd5' and ma_cau = '07010102005';
-- GT 9A2 11/07/2026 · Buổi 15 · thứ tự 2 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302009' where id = 'fe10ee29-388c-49fa-a6b5-01303420a990' and ma_cau = '09020302002';
-- GT 9A2 11/07/2026 · Buổi 15 · thứ tự 3 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302012' where id = '541e154f-4f8a-4314-aeec-b114b9c7784f' and ma_cau = '09020302005';
-- BTVN 8A2 02/07/2026 · Buổi 1: Đơn thức - Đa thức · thứ tự 6 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202002' where id = '3f04a064-b3f0-419c-b48c-c0b6027b03d6' and ma_cau = '08010202025';
-- BTVN 8A2 02/07/2026 · Buổi 1: Đơn thức - Đa thức · thứ tự 7 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202005' where id = 'da8667b2-7851-44b9-888e-51eab29f8181' and ma_cau = '08010202026';
-- BTVN 12A1 30/06/2026 · Buổi 4 : Hàm số bậc hai trên bậc nhất · thứ tự 0 · dạng 12020302
update tai_lieu_cau set ma_cau = '12020302001' where id = '40509aa5-df19-4128-b1b1-d4309e4861cb' and ma_cau = '12020302010';
-- BTVN 12A1 30/06/2026 · Buổi 4 : Hàm số bậc hai trên bậc nhất · thứ tự 2 · dạng 12020302
update tai_lieu_cau set ma_cau = '12020302022' where id = 'e0d12316-5e74-4fa9-a9f8-97016b35b6d9' and ma_cau = '12020302015';
-- BTVN 12A1 30/06/2026 · Buổi 4 : Hàm số bậc hai trên bậc nhất · thứ tự 3 · dạng 12020302
update tai_lieu_cau set ma_cau = '12020302023' where id = 'ed12ee1d-1615-40b7-b736-7b620af6dae7' and ma_cau = '12020302016';
-- BTVN 11B1 12/07/2026 · Buổi 3 · thứ tự 1 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502066' where id = 'f12ee1db-e96b-4d51-a484-2f4942d6f12e' and ma_cau = '11010502014';
-- BTVN 11B1 12/07/2026 · Buổi 3 · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502068' where id = 'f7beb3e7-28b4-46f7-a4bb-6fba34ca2dc7' and ma_cau = '11010502003';
-- BTVN 11B1 12/07/2026 · Buổi 3 · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502069' where id = 'e0d11522-0b17-4dc9-b32e-68251a393d77' and ma_cau = '11010502004';
-- BTVN 11B1 12/07/2026 · Buổi 3 · thứ tự 5 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502070' where id = '1591f0dc-e536-4e45-8225-b7b5eae1d0f4' and ma_cau = '11010502009';
-- BTVN 11B1 12/07/2026 · Buổi 3 · thứ tự 8 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502074' where id = '913e5c5b-8cbf-44d2-b07f-b88476faa056' and ma_cau = '11010502008';
-- BTVN 7B1 05/07/2026 · Buổi 1 · thứ tự 0 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102022' where id = 'b025731d-fd1b-48d0-9d15-087acb9b5e73' and ma_cau = '07010102005';
-- BTVN 7B1 05/07/2026 · Buổi 1 · thứ tự 1 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102013' where id = 'df63bbb4-a5b0-4f60-9b1e-4e598c155cef' and ma_cau = '07010102010';
-- GT 7S1 01/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102014' where id = 'bd867635-ec55-415b-8ed2-422b284aed8b' and ma_cau = '07010102005';
-- GT 7S1 01/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 4 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102015' where id = '762ea649-bde3-4450-8414-33a7a7b88a72' and ma_cau = '07010102006';
-- GT 7S1 01/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 5 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102016' where id = '0e05bb06-bf28-4e7d-a712-7549ae4adeac' and ma_cau = '07010102008';
-- BTVN 8B1 02/07/2026 · Buổi 1 · thứ tự 2 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202001' where id = '61522187-9a7b-4d6b-be8e-e5b41d176735' and ma_cau = '08010202025';
-- BTVN 8B1 02/07/2026 · Buổi 1 · thứ tự 3 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202007' where id = 'd0da733f-f176-44b8-b6c1-e866eece2cc6' and ma_cau = '08010202029';
-- Giáo trình 5T2 [MẪU] · thứ tự 1 · dạng 5T010102
update tai_lieu_cau set ma_cau = '5T010102010' where id = 'd19a83f9-780d-4389-85c7-f6ba26aecde6' and ma_cau = '5T010102035';
-- GT 9B2 10/07/2026 · Buổi 11 · thứ tự 3 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302014' where id = 'b766fc96-f8de-4f99-8d97-e1ee63c43963' and ma_cau = '09020302005';
-- ET 9B2 · 13/07/2026 · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304025' where id = '38e0bceb-3672-4b1e-94e6-6ff22b303770' and ma_cau = '09020304023';
-- Ôn tập hàm số [MẪU] · thứ tự 0 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302016' where id = '9a64528b-b548-4a54-9ef3-057dd0539408' and ma_cau = '12010302024';
-- Ôn tập hàm số [MẪU] · thứ tự 0 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302019' where id = 'bfc96ed5-5a68-4dc1-a783-f16ba2f62d31' and ma_cau = '12010302015';
-- Ôn tập hàm số [MẪU] · thứ tự 0 · dạng 12010304
update tai_lieu_cau set ma_cau = '12010304013' where id = '509ee204-72da-4c32-ab32-ec21727044e3' and ma_cau = '12010304011';
-- Ôn tập hàm số [MẪU] · thứ tự 6 · dạng 12020201
update tai_lieu_cau set ma_cau = '12020201008' where id = '263076ca-0971-4249-b545-981b97032384' and ma_cau = '12020201022';
-- GT 7S2 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102017' where id = '88b6f637-4256-4565-83dd-49722cac5b56' and ma_cau = '07010102005';
-- GT 7S2 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 4 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102018' where id = '47b7893e-c7ec-47f0-abc8-3f093459fa63' and ma_cau = '07010102006';
-- GT 7S2 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 5 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102019' where id = '9103fa51-905d-4d01-ace3-9664770ce3d6' and ma_cau = '07010102008';
-- GT 5T1 12/07/2026 · Buổi 1 : Bài toán tỉ số hai đại lượng · thứ tự 1 · dạng 5T010102
update tai_lieu_cau set ma_cau = '5T010102011' where id = '6d72f65b-71d7-4c6c-bcd9-58296a127529' and ma_cau = '5T010102023';
-- Giáo trình 7B [MẪU] · thứ tự 0 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102020' where id = '5b4a6dd9-9004-4c5d-9927-f8eb6a01ef06' and ma_cau = '07010102005';
-- Giáo trình 7B [MẪU] · thứ tự 1 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102021' where id = 'b7e98fe4-b9e7-4f53-b54f-bcdfbce91f24' and ma_cau = '07010102010';
-- Giáo trình 9B [MẪU] · thứ tự 3 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302008' where id = '0b7002cf-8fac-4df3-9bf1-904d735322a0' and ma_cau = '09020302005';
-- Giáo trình 9B [MẪU] · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304030' where id = '0d75c786-232c-43a8-9d29-d772bdb108d9' and ma_cau = '09020304023';
-- Giáo trình 9B [MẪU] · thứ tự 2 · dạng 09020305
update tai_lieu_cau set ma_cau = '09020305008' where id = 'ffc57a69-a001-4133-9c98-329290744bc4' and ma_cau = '09020305010';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 0 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502075' where id = 'a2848ae1-5f64-4a34-a3eb-249990170050' and ma_cau = '11010502015';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 1 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502025' where id = 'f70c15dd-27c1-4b7f-b7cf-b49b554cee20' and ma_cau = '11010502001';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 2 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502026' where id = '2952a069-496b-45c0-b3e2-74f51bdf6110' and ma_cau = '11010502007';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502028' where id = '9b63249f-7a8e-4b11-920c-d46e59fd25d9' and ma_cau = '11010502002';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 5 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502029' where id = '5a9e0da4-9f19-433b-adb8-fd1bed30acee' and ma_cau = '11010502005';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 6 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502030' where id = '3f139543-c5df-4ff4-bece-7ebfcaa0211e' and ma_cau = '11010502006';
-- GT 11B1 12/07/2026 · Buổi 3 · thứ tự 7 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502031' where id = '141c4a8d-8130-4d59-8993-ad7023b5080d' and ma_cau = '11010502010';
-- Giáo trình 5T1 [MẪU] · thứ tự 1 · dạng 5T010102
update tai_lieu_cau set ma_cau = '5T010102012' where id = 'c14b9ac3-d2eb-45e1-9f5c-5aa8ca3897df' and ma_cau = '5T010102023';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 0 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502032' where id = 'ebd66526-d970-424b-b595-c3f4c7156195' and ma_cau = '11010502003';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502033' where id = 'd3cc6911-49c2-4b0a-a682-00e11c60e110' and ma_cau = '11010502006';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502034' where id = 'bb6d34a1-3519-426f-9624-4c41fd74c16e' and ma_cau = '11010502009';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 6 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502035' where id = '4a0f9e5a-fdf0-4cbd-8321-eaf29bf23101' and ma_cau = '11010502010';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 2 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102038' where id = '07bc0082-3087-49a7-8920-42da48a31a11' and ma_cau = '11020102016';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 5 · dạng 11020102
update tai_lieu_cau set ma_cau = '11020102039' where id = '99b27b87-26ec-4dea-b90f-9169150623ea' and ma_cau = '11020102006';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 0 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103023' where id = '4ed973e2-83f6-48a1-b52b-2e68e3f7948b' and ma_cau = '11020103001';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 1 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103024' where id = '08f15198-d0db-4917-b774-04ff34b766bd' and ma_cau = '11020103003';
-- GT 11A1 11/07/2026 · Buổi 4 · thứ tự 2 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103025' where id = '47a64401-b5ba-4812-be46-d7bc3280c73d' and ma_cau = '11020103004';
-- BTVN 7S2 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102022' where id = '4b34902e-3750-4e1b-abfd-9ef1d936f448' and ma_cau = '07010102010';
-- ET 12A1 · 23/06/2026 · thứ tự 0 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302020' where id = 'db03bd50-ece5-40c7-be25-c323bfb6a5f0' and ma_cau = '12010302001';
-- Giáo trình 9S [MẪU] · thứ tự 1 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304026' where id = '5aae672f-49ec-40d3-9b2e-29150e5255d9' and ma_cau = '09020304011';
-- Giáo trình 9S [MẪU] · thứ tự 1 · dạng 09020305
update tai_lieu_cau set ma_cau = '09020305011' where id = 'a67424ae-a344-4e93-b6fe-f0ebc3188265' and ma_cau = '09020305010';
-- Giáo trình 7S [MẪU] · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102012' where id = '28e4b696-23fe-493d-b68e-9a2f3b43dd7b' and ma_cau = '07010102010';
-- Giáo trình 7S [MẪU] · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102013' where id = '6262ca75-d645-4983-9dc2-b76aba6357f8' and ma_cau = '07010102005';
-- Giáo trình 7S [MẪU] · thứ tự 4 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102014' where id = '5774bd5a-7db8-4dd3-b637-57bc7466b3a1' and ma_cau = '07010102006';
-- Giáo trình 7S [MẪU] · thứ tự 5 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102015' where id = 'f54b25e9-5388-4dcf-925e-d6413619f9bc' and ma_cau = '07010102008';
-- Giáo trình 7S [MẪU] · thứ tự 9 · dạng 07010207
update tai_lieu_cau set ma_cau = '07010207008' where id = '757a95e0-af67-4bc8-afe2-68e80f972f8f' and ma_cau = '07010207024';
-- ET 11A1 · 11/07/2026 · thứ tự 5 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502036' where id = '1de87a20-91ec-459e-8cc5-c5532b8b9f8f' and ma_cau = '11010502001';
-- ET 11A1 · 11/07/2026 · thứ tự 6 · dạng 11020103
update tai_lieu_cau set ma_cau = '11020103026' where id = '5032cbf5-7032-4ce0-a488-0a5315a85b21' and ma_cau = '11020103001';
-- BTVN 8A1 02/07/2026 · Buổi 1: Đơn thức - Đa thức · thứ tự 6 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202006' where id = '9ad10324-e863-4ae4-ab01-bc16f1c3f338' and ma_cau = '08010202025';
-- BTVN 8A1 02/07/2026 · Buổi 1: Đơn thức - Đa thức · thứ tự 7 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202008' where id = 'd3304231-5cc8-4b3e-be4e-128e824ac930' and ma_cau = '08010202026';
-- BTVN 9B2 13/07/2026 · Buổi 12 · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304027' where id = '39defa99-9076-4e3d-a172-a4aae617b051' and ma_cau = '09020304023';
-- BTVN 9B2 13/07/2026 · Buổi 12 · thứ tự 2 · dạng 09020305
update tai_lieu_cau set ma_cau = '09020305021' where id = 'ef45d9b7-9198-43d7-8430-a98a05da2a00' and ma_cau = '09020305010';
-- Giáo trình 9A [MẪU] · thứ tự 2 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302015' where id = '047a64fd-f413-4525-8803-b67e4a5c8c00' and ma_cau = '09020302006';
-- Giáo trình 9A [MẪU] · thứ tự 2 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302022' where id = '9f2908eb-2809-420e-9900-1d0cfb886e8b' and ma_cau = '09020302002';
-- Giáo trình 9A [MẪU] · thứ tự 3 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302001' where id = '7d25099f-146c-4539-810e-8e39678aa095' and ma_cau = '09020302005';
-- Giáo trình 9A [MẪU] · thứ tự 2 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304031' where id = 'a939006e-b5cd-48cb-abe8-6168752150f3' and ma_cau = '09020304023';
-- Giáo trình 9A [MẪU] · thứ tự 3 · dạng 09020304
update tai_lieu_cau set ma_cau = '09020304033' where id = 'b7ac64c8-4353-40b5-bd1a-5078b4ed0a42' and ma_cau = '09020304036';
-- GT 7S3 04/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102016' where id = '6405f4fa-bfd1-4935-9066-c6a0caa8cb27' and ma_cau = '07010102005';
-- GT 7S3 04/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 4 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102017' where id = '4ce51a8a-38cc-4b76-8db2-ad26d433d4d7' and ma_cau = '07010102006';
-- GT 7S3 04/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 5 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102018' where id = '7bcc1c25-48b9-472a-8589-c00d8d9cd883' and ma_cau = '07010102008';
-- ET 12A1 · 23/06/2026 · thứ tự 2 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302026' where id = '8cdc1cc5-4d18-4584-b317-ea155abdd27c' and ma_cau = '12010302004';
-- ET 12A1 · 23/06/2026 · thứ tự 3 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302027' where id = 'bd199c7b-40aa-45c0-a6e2-27174c795281' and ma_cau = '12010302006';
-- ET 12A1 · 23/06/2026 · thứ tự 5 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302028' where id = '02aa8827-5c44-43a5-9226-603f5e46b7eb' and ma_cau = '12010302009';
-- ET 12A1 · 23/06/2026 · thứ tự 7 · dạng 12010302
update tai_lieu_cau set ma_cau = '12010302029' where id = 'c8a7c682-f511-4603-8df7-af5b32d1fe6b' and ma_cau = '12010302013';
-- BTVN 7S3 04/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102019' where id = '7d0c7f47-9087-4b65-9d14-d34f04fb64d5' and ma_cau = '07010102010';
-- GT 5T2 11/07/2026 · Buổi 1 : Bài toán Tổng tỉ - Hiệu tỉ · thứ tự 1 · dạng 5T010102
update tai_lieu_cau set ma_cau = '5T010102013' where id = 'da06bc6e-514d-4f33-a0b9-950c26b8dcbd' and ma_cau = '5T010102035';
-- ET 8B1 · 02/07/2026 · thứ tự 6 · dạng 08010202
update tai_lieu_cau set ma_cau = '08010202009' where id = 'd39cda03-8758-467f-9da2-7783355c6641' and ma_cau = '08010202029';
-- GT 11A1 08/07/2026 · Buổi 3 · thứ tự 3 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502037' where id = 'ac4edcc2-818e-4ce4-bf8b-e14d1ddc23ff' and ma_cau = '11010502010';
-- GT 11A1 08/07/2026 · Buổi 3 · thứ tự 4 · dạng 11010502
update tai_lieu_cau set ma_cau = '11010502038' where id = '12adc24a-5cd5-4731-96a6-64c67d1ed003' and ma_cau = '11010502008';
-- BTVN 9C1 10/07/2026 · Buổi 10 · thứ tự 0 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302016' where id = 'e2db547b-9bdb-45ff-899d-5927f8d08572' and ma_cau = '09020302006';
-- GT 7A1 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 3 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102020' where id = '07e18934-783a-45da-ac0d-3ec813b4a9dd' and ma_cau = '07010102006';
-- GT 7A1 03/07/2026 · Buổi 1 : Số hữu tỉ · thứ tự 5 · dạng 07010102
update tai_lieu_cau set ma_cau = '07010102021' where id = '6f5f895f-1fb3-45e8-9a6e-41909f301342' and ma_cau = '07010102008';
-- GT 9B1 11/07/2026 · Buổi 11 · thứ tự 3 · dạng 09020302
update tai_lieu_cau set ma_cau = '09020302018' where id = '213c0ad0-ebbd-4256-af95-2237c5553c15' and ma_cau = '09020302005';
