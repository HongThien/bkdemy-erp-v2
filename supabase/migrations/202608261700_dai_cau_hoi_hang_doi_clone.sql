-- 202608261700 — Kho Đại: hàng đợi yêu cầu clone (đặt lệnh qua ERP) + bảng nháp chờ duyệt.
-- Story 1 (theo bàn với Thùy 26/08): nhân sự bấm "✨ Clone" trên 1 câu có sẵn → thay vì gọi
-- API ngay (đồng bộ, tốn tiền), CÓ THÊM lựa chọn "đưa vào hàng đợi" — Claude Code (quota
-- subscription, không phải API trả phí) quét định kỳ/theo lệnh, xử lý cả lô.
--
-- 2 bảng tách biệt, không đụng dai_cau_hoi:
--  · dai_cau_hoi_yeu_cau_clone — YÊU CẦU (câu gốc, ghi chú, số lượng). xu_ly_at NULL = chưa xử lý.
--  · dai_cau_hoi_clone_cho_duyet — KẾT QUẢ Claude sinh ra, CHƯA vào dai_cau_hoi thật — vì
--    da_duyet trên dai_cau_hoi chỉ là nhãn hậu kiểm (không chặn dùng), còn câu clone MỚI thì
--    phải chặn hẳn tới khi có người duyệt (khác nghĩa nhau — xem thảo luận 26/08).
--  Duyệt = insert bản ghi này sang dai_cau_hoi (da_duyet=true luôn, vừa được người kiểm xong)
--  rồi xoá khỏi bảng nháp. Từ chối = chỉ đánh dấu tu_choi_*, không đụng dai_cau_hoi.

create table if not exists dai_cau_hoi_yeu_cau_clone (
  id uuid primary key default gen_random_uuid(),
  ma_cau_goc text not null references dai_cau_hoi(ma_cau) on delete cascade,
  so_bien_the int not null default 5,
  ghi_chu text,
  nguoi_yeu_cau uuid references nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz
);
alter table dai_cau_hoi_yeu_cau_clone enable row level security;
create policy dai_cau_hoi_yeu_cau_clone_member_all on dai_cau_hoi_yeu_cau_clone
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on dai_cau_hoi_yeu_cau_clone to authenticated;

create table if not exists dai_cau_hoi_clone_cho_duyet (
  id uuid primary key default gen_random_uuid(),
  yeu_cau_id uuid references dai_cau_hoi_yeu_cau_clone(id) on delete set null,
  dang_chinh text not null,
  loai_cau text not null,
  noi_dung text not null,
  lua_chon jsonb,
  dap_an text,
  loi_giai text,
  parent_ma_cau text references dai_cau_hoi(ma_cau) on delete set null,
  clone_method text not null default 'claude_code_batch',
  created_at timestamptz not null default now(),
  duyet_boi uuid references nhan_su(id) on delete set null,
  duyet_at timestamptz,
  tu_choi_boi uuid references nhan_su(id) on delete set null,
  tu_choi_at timestamptz,
  tu_choi_ly_do text
);
alter table dai_cau_hoi_clone_cho_duyet enable row level security;
create policy dai_cau_hoi_clone_cho_duyet_member_all on dai_cau_hoi_clone_cho_duyet
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on dai_cau_hoi_clone_cho_duyet to authenticated;
