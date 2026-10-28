-- Gán lop_id cho giáo trình bản đồ mới dựa theo tên lớp có sẵn trong tên giáo trình.
-- Trước đó giáo trình chưa gắn lớp (mô hình cũ: dùng chung), từ 28/10 bắt buộc 1 giáo trình = 1 lớp.
-- 15 giáo trình match sạch (tên trùng khớp hoặc prefix duy nhất trong khối).
-- Riêng "Giáo trình 4A" (b68cd3e8) ambiguous giữa 4A1/4A2 → để CEO quyết tay, không ghi ở đây.

begin;

update tai_lieu set lop_id = '743e3488-db69-4512-be8e-738fa0658fdc' where id = 'fdf743bf-cf5d-4134-acaa-143401df50f6' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = '87c0ad07-e6c3-4953-9cc8-3686d9d805ed' where id = 'e5136d1a-ad81-490c-840f-9833301eaad6' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'bdd0c68b-cb2f-4a1e-98e3-dacac445cbdc' where id = 'c76818de-67a0-4f0d-ba4e-901726cb00a8' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'b5997fec-977e-42c6-a13d-cb965a70adbc' where id = 'c944f0f7-ce28-4110-b6d7-bfebfa1d3d40' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'c00deede-dfe7-40a7-a6d0-5978fcc3c678' where id = 'd7977dc4-d780-4d00-b0b3-16507e19f667' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = '8c2d1c19-3bd4-479d-8e8a-467a5ade52ab' where id = '5bb5ca3b-f627-469c-93ac-4e61922e4066' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = '2e09a4b3-f48b-4f69-a08c-4c204c4ec4fc' where id = '6141f722-ed07-4b6d-8f72-78c111e04841' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'bb49dafd-46e6-4afd-98f2-b20ad61893ac' where id = '0a4f2a31-0649-42c1-8af5-e1d315a39c2d' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'f84a2358-842a-464d-85d3-d56a2455484f' where id = 'a9a56703-6c3c-4b50-9139-c02fcb248fcc' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'b00da067-025d-4e05-9ca0-7b019a7dca03' where id = 'e3e2f784-86ce-46a8-8ac2-ecbc141dd316' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = '5a09e241-e53a-4c4b-a4b5-99e9cfe7aeb6' where id = '61b9fc11-0beb-4f75-831e-57bde6a4dab4' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = '48a8d255-ef5b-45a6-97df-3d3d995a6033' where id = 'eb9c7ece-cded-477f-8a20-89876b0da711' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'a683d9c6-6169-4611-91b5-9d0cccdd5dbc' where id = 'beefd8d8-e366-4ab9-8ba1-d529cec7281f' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'aef4b4a5-16c6-4419-a1e0-bca94d60ea20' where id = 'b47e2221-e8c4-40d8-90af-28a16742c2a7' and loai='giao_trinh' and ban_do='moi' and lop_id is null;
update tai_lieu set lop_id = 'bfd15562-9db7-4047-826f-5419aa597d83' where id = '50393981-e9bf-4a37-b0fe-bc92d1545d55' and loai='giao_trinh' and ban_do='moi' and lop_id is null;

commit;
