-- CEO 19/09: "chưa thấy hiện lên ở bảng duyệt mà chỉ thấy trong kho" — 41 câu vừa nhập cho nhánh
-- hinh_hoc (phase Học, K11 HH00087) không hiện ở màn "Duyệt lời giải AI".
--
-- NGUYÊN NHÂN: màn Duyệt (fn_kho_hang_duyet/fn_kho_dem_hang_duyet/fn_kho_duyet_cau/fn_kho_tu_choi_cau)
-- dispatch bảng qua fn_kho_tbl(p_mon) — hàm này CHƯA từng biết 'hinh_hoc' (chỉ có toan/khtn/hgt), khác
-- registry NHANH_CUA_MON/khoCuaMon ở src/lib/tailieu.ts (dùng cho Giáo trình, ĐÃ biết hinh_hoc từ 16/09).
-- Hai registry độc lập, chỉ 1 được cập nhật khi xây phase Học Hình học.
--
-- Sửa cho ĐỦ (không chỉ thêm 1 case), vì fn_kho_hang_duyet còn giả định 2 điều mà hinh_hoc_* chưa có:
--   (1) một bảng "<nhánh>_ban_do" để join lấy ten_dang/ten_chuyen_de/khoi — hinh_hoc dùng hinh_hoc_bai
--       kiêm luôn vai trò bản đồ (mỗi Bài = 1 dạng), đã có sẵn đúng các cột cần (ma_dang/ten_dang/khoi/
--       ma_chuyen_de/ten_chuyen_de) → chỉ cần 1 VIEW đặt tên đúng "hinh_hoc_ban_do", KHÔNG phải bảng mới.
--   (2) các cột "kiểm máy"/"AI đề xuất dạng"/"duyệt nguồn" mà hinh_hoc_cau_hoi CHƯA có (migration
--       202609161521 đã ghi chú "chưa dùng ngay — thêm sau khi cần" — giờ là lúc cần).
-- MẤT GÌ (Luật xoá): không — chỉ thêm cột/view/case, không xoá/đổi gì đang có. 58 câu hiện có của
-- hinh_hoc_cau_hoi đều nhận giá trị NULL cho các cột mới (an toàn, không cần backfill).

-- (1) View "bản đồ" cho nhánh hinh_hoc — trỏ thẳng vào hinh_hoc_bai (đang tự đóng vai trò bản đồ).
create or replace view public.hinh_hoc_ban_do as
  select ma_dang, ten_dang, khoi, ma_chuyen_de, ten_chuyen_de, muc_do
    from public.hinh_hoc_bai;

-- (2) Các cột "kiểm máy" / "AI đề xuất dạng" / "duyệt nguồn" — khớp shape dai_cau_hoi mà fn_kho_hang_duyet
--     / fn_kho_duyet_cau / fn_kho_tu_choi_cau đang SELECT/UPDATE chung cho mọi nhánh.
alter table public.hinh_hoc_cau_hoi
  add column if not exists dang_ai_de_xuat text,
  add column if not exists giai_method text,
  add column if not exists kiem_may text,
  add column if not exists kiem_may_boi text,
  add column if not exists kiem_may_ghi text,
  add column if not exists kiem_may_at timestamptz,
  add column if not exists duyet_nguon text;

alter table public.hinh_hoc_cau_hoi
  drop constraint if exists hinh_hoc_cau_hoi_duyet_nguon_check;
alter table public.hinh_hoc_cau_hoi
  add constraint hinh_hoc_cau_hoi_duyet_nguon_check check (duyet_nguon = any (array['nguoi', 'may', 'ai']));

-- (3) Dạy fn_kho_tbl biết 'hinh_hoc' — mọi hàm duyệt dùng chung hàm này nên tự động "biết" theo.
create or replace function public.fn_kho_tbl(p_mon text) returns text
language sql immutable as $$
  select case p_mon when 'toan' then 'dai' when 'khtn' then 'khtn' when 'hgt' then 'hgt' when 'hinh_hoc' then 'hinh_hoc' end
$$;
