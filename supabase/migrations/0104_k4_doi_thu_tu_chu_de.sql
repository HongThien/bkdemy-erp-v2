-- Đổi thứ tự chủ đề K4 Toán (khoi='4'). Thực chất là 2 cặp hoán đổi:
--   0403 Tính chất của phân số  ↔  0408 Đơn vị đo lường
--   0404 Phép toán với phân số  ↔  0409 Hình học
-- 0401/0402/0405/0406/0407 giữ nguyên mã.
--
-- Mã lồng prefix (chủ đề 4 → chuyên đề 6 → dạng 8 → câu 11) nên phải đổi cả cây con.
-- Hoán đổi ⇒ đi qua prefix tạm '99xx' để tránh đụng PK giữa chừng.
-- Khối '4T' (Tăng cường) prefix '4T…', KHÔNG đụng tới.

-- ── A. FK sang ON UPDATE CASCADE ───────────────────────────────────────────
-- Mã là prefix vị trí, còn đổi nữa về sau; giữ nguyên on delete cũ.
alter table dai_dang_thuoc_tinh drop constraint dai_dang_thuoc_tinh_ma_dang_fkey;
alter table dai_dang_thuoc_tinh add constraint dai_dang_thuoc_tinh_ma_dang_fkey
  foreign key (ma_dang) references dai_ban_do(ma_dang) on update cascade on delete cascade;

alter table dai_dang_ly_thuyet drop constraint dai_dang_ly_thuyet_ma_dang_fkey;
alter table dai_dang_ly_thuyet add constraint dai_dang_ly_thuyet_ma_dang_fkey
  foreign key (ma_dang) references dai_ban_do(ma_dang) on update cascade on delete cascade;

alter table dai_cau_hoi drop constraint dai_cau_hoi_dang_chinh_fkey;
alter table dai_cau_hoi add constraint dai_cau_hoi_dang_chinh_fkey
  foreign key (dang_chinh) references dai_ban_do(ma_dang) on update cascade on delete restrict;

alter table dai_cau_bo_de drop constraint dai_cau_bo_de_ma_cau_fkey;
alter table dai_cau_bo_de add constraint dai_cau_bo_de_ma_cau_fkey
  foreign key (ma_cau) references dai_cau_hoi(ma_cau) on update cascade on delete cascade;

-- Self-FK: bỏ tạm. Cascade trên chính bảng đang UPDATE hàng loạt là không xác định
-- thứ tự (1 dòng vừa là cha vừa là con) → cập nhật tay 2 cột rồi gắn lại ở mục C.
alter table dai_cau_hoi drop constraint dai_cau_hoi_parent_ma_cau_fkey;

-- ── B1. Sang prefix tạm '99' ───────────────────────────────────────────────
update dai_ban_do set
  ma_chu_de    = '99' || substr(ma_chu_de, 3),
  ma_chuyen_de = '99' || substr(ma_chuyen_de, 3),
  ma_dang      = '99' || substr(ma_dang, 3)
where khoi = '4' and ma_chu_de in ('0403', '0404', '0408', '0409');
-- dang_chinh của dai_cau_hoi tự chạy theo nhờ cascade ở mục A.

update dai_cau_hoi set ma_cau = '99' || substr(ma_cau, 3)
where substr(ma_cau, 1, 4) in ('0403', '0404', '0408', '0409');

update dai_cau_hoi set parent_ma_cau = '99' || substr(parent_ma_cau, 3)
where substr(parent_ma_cau, 1, 4) in ('0403', '0404', '0408', '0409');

-- ── B2. Về mã đích ─────────────────────────────────────────────────────────
update dai_ban_do b set
  ma_chu_de    = m.moi,
  ma_chuyen_de = m.moi || substr(b.ma_chuyen_de, 5),
  ma_dang      = m.moi || substr(b.ma_dang, 5)
from (values ('9903', '0408'), ('9904', '0409'),
             ('9908', '0404'), ('9909', '0403')) as m(cu, moi)
where b.khoi = '4' and b.ma_chu_de = m.cu;

update dai_cau_hoi q set ma_cau = m.moi || substr(q.ma_cau, 5)
from (values ('9903', '0408'), ('9904', '0409'),
             ('9908', '0404'), ('9909', '0403')) as m(cu, moi)
where substr(q.ma_cau, 1, 4) = m.cu;

update dai_cau_hoi q set parent_ma_cau = m.moi || substr(q.parent_ma_cau, 5)
from (values ('9903', '0408'), ('9904', '0409'),
             ('9908', '0404'), ('9909', '0403')) as m(cu, moi)
where substr(q.parent_ma_cau, 1, 4) = m.cu;

-- ── C. Gắn lại self-FK ─────────────────────────────────────────────────────
alter table dai_cau_hoi add constraint dai_cau_hoi_parent_ma_cau_fkey
  foreign key (parent_ma_cau) references dai_cau_hoi(ma_cau) on update cascade on delete set null;

-- ── D. Chốt chặn: không được sót mã tạm nào ─────────────────────────────────
do $$
declare n int;
begin
  select count(*) into n from dai_ban_do
   where ma_chu_de like '99%' or ma_chuyen_de like '99%' or ma_dang like '99%';
  if n > 0 then raise exception 'Còn % dòng dai_ban_do kẹt prefix tạm 99', n; end if;

  select count(*) into n from dai_cau_hoi
   where ma_cau like '99%' or parent_ma_cau like '99%' or dang_chinh like '99%';
  if n > 0 then raise exception 'Còn % dòng dai_cau_hoi kẹt prefix tạm 99', n; end if;

  select count(*) into n from dai_ban_do where khoi = '4' and ma_dang !~ '^[0-9]{8}$';
  if n > 0 then raise exception '% dòng K4 sai quy ước mã 8 chữ số', n; end if;
end $$;
