-- Shopping (CEO 07/09, design anhgoc_shopping): kệ hàng có TAB Tất cả / Đồ ăn / Đồ uống / Hot và nhãn
-- "Hot" / "Mới" trên card → thêm 2 cột phân loại cho shop_vat_pham. ("Yêu thích" cần bảng favorite
-- theo người — chưa làm, đợt sau.)
alter table public.shop_vat_pham
  add column if not exists loai text not null default 'khac'
    constraint shop_vat_pham_loai_chk check (loai in ('do_an', 'do_uong', 'khac')),
  add column if not exists nhan text
    constraint shop_vat_pham_nhan_chk check (nhan is null or nhan in ('hot', 'moi'));
comment on column public.shop_vat_pham.loai is 'Tab kệ hàng: do_an · do_uong · khac (voucher, sổ tay…)';
comment on column public.shop_vat_pham.nhan is 'Nhãn góc card: hot · moi · null';

-- SEED kệ ban đầu = 6 món trong ảnh thiết kế (tên · tagline · giá điểm · ảnh cắt từ design). Giá là số
-- trong design — admin chỉnh lại trong DB khi có bảng giá thật. Chỉ chèn khi kệ còn rỗng (không đè dữ liệu).
insert into public.shop_vat_pham (ten, mo_ta, anh_url, gia_diem, active, thu_tu, loai, nhan)
select * from (values
  ('Trà sữa',     'Thêm năng lượng cho ngày học tập!',   '/bk-ui/shop_tra_sua.png',  80, true, 1, 'do_uong', 'hot'),
  ('Kem',         'Ngọt ngào xua tan mệt mỏi!',          '/bk-ui/shop_kem.png',      70, true, 2, 'do_an',   null),
  ('Tokbokki',    'Cay cay, vui vui làm việc hăng say!', '/bk-ui/shop_tokbokki.png', 100, true, 3, 'do_an',  'hot'),
  ('Snack',       'Ăn vặt tí thôi là lại có sức!',       '/bk-ui/shop_snack.png',    60, true, 4, 'do_an',   null),
  ('Voucher nhỏ', 'Giảm giá xinh xinh cho TA đáng iu!',  '/bk-ui/shop_voucher.png',  120, true, 5, 'khac',   'moi'),
  ('Sổ tay BK',   'Ghi chép ước mơ. So nice!',           '/bk-ui/shop_so_tay.png',   150, true, 6, 'khac',   null)
) as v(ten, mo_ta, anh_url, gia_diem, active, thu_tu, loai, nhan)
where not exists (select 1 from public.shop_vat_pham);
