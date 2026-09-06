-- Bảng giá shop THẬT (CEO 07/09): Trà sữa 2000 điểm · Kem 1000 · Tokbokki 5000. Snack, Voucher nhỏ, Sổ tay BK
-- CEO chưa ghi giá → tạm ẨN khỏi kệ (active=false), giữ dòng để bật lại khi có giá. (100 điểm ≈ 1k nhưng không
-- quy tiền — điểm chỉ đổi quà.)
update public.shop_vat_pham set gia_diem = 2000 where ten = 'Trà sữa';
update public.shop_vat_pham set gia_diem = 1000 where ten = 'Kem';
update public.shop_vat_pham set gia_diem = 5000 where ten = 'Tokbokki';
update public.shop_vat_pham set active = false where ten in ('Snack', 'Voucher nhỏ', 'Sổ tay BK');
