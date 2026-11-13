-- Tác dụng phụ của migration trước (202609191359 — thêm 'hinh_hoc' vào KHO_MON['Toán'].nhanh để câu
-- hiện ở màn Duyệt): màn "Chưa có lời giải" (ChuaGiaiTab) giờ cũng lặp qua nhánh 'hinh_hoc' và
-- fn_kho_cau_chua_giai/fn_kho_dem_cau_chua_giai LEFT JOIN cứng bảng "<nhánh>_cau_hoi_yeu_cau_giai" —
-- bảng này CHƯA TỪNG được tạo cho hinh_hoc ⇒ lỗi "relation does not exist" (không liên quan tới 41 câu
-- vừa nhập — mọi câu đó đều đã có loi_giai nên vốn không xuất hiện ở tab "Chưa có lời giải").
--
-- MẤT GÌ (Luật xoá): không — chỉ thêm bảng mới, mirror y hệt shape dai_cau_hoi_yeu_cau_giai (đọc live
-- từ DB, không chép lại migration cũ vì cột đã được ALTER nhiều lần sau đó — vd nguoi_giai/trang_thai/
-- han_at thêm ở 202609060122). Chỉ tạo bảng cho ĐỦ để 2 hàm trên không vỡ; CHƯA nối worker "giaibai" nào
-- ghi/đọc bảng này cho nhánh hinh_hoc — đó là việc khác, để sau khi cần thật (không có ai gọi tới thì
-- bảng luôn rỗng, hai hàm trên vẫn chạy đúng vì LEFT JOIN với bảng rỗng ra NULL, y hệt hành vi "chưa ai
-- đặt giải" ở các nhánh khác).
create table if not exists public.hinh_hoc_cau_hoi_yeu_cau_giai (
  id uuid primary key default gen_random_uuid(),
  ma_cau text not null references public.hinh_hoc_cau_hoi(ma_cau) on delete cascade,
  ghi_chu text,
  nguoi_yeu_cau uuid references public.nhan_su(id) on delete set null,
  created_at timestamptz not null default now(),
  xu_ly_at timestamptz,
  nguoi_giai uuid references public.nhan_su(id) on delete set null,
  trang_thai text not null default 'cho_claude',
  han_at timestamptz,
  nop_at timestamptz,
  cap_nhat_at timestamptz,
  loi_giai_nhap text,
  anh_nhap text,
  dap_an_nhap text,
  tu_choi_lan integer not null default 0,
  ly_do_tu_choi text,
  tu_choi_at timestamptz,
  duyet_boi uuid references public.nhan_su(id) on delete set null,
  duyet_at timestamptz,
  so_ky_tu integer,
  so_cong_thuc integer,
  loi_giai_ai text,
  ai_model text,
  che_do text not null default 'giai',
  y_nhap jsonb,
  constraint hinh_hoc_cau_hoi_yeu_cau_giai_che_do_check check (che_do = any (array['giai', 'hoan_thien'])),
  constraint hinh_hoc_cau_hoi_yeu_cau_giai_trang_thai_chk check (
    (trang_thai = any (array['cho_claude', 'da_xong', 'dang_giai', 'cho_duyet', 'can_sua', 'da_duyet', 'da_tra', 'qua_han', 'tu_choi_3']))
    and ((nguoi_giai is null) = (trang_thai = any (array['cho_claude', 'da_xong'])))
  )
);
create unique index if not exists hinh_hoc_cau_hoi_yeu_cau_giai_cho_uniq on public.hinh_hoc_cau_hoi_yeu_cau_giai (ma_cau) where xu_ly_at is null;
create index if not exists hinh_hoc_cau_hoi_yeu_cau_giai_nguoi_giai_idx on public.hinh_hoc_cau_hoi_yeu_cau_giai (nguoi_giai) where nguoi_giai is not null;
alter table public.hinh_hoc_cau_hoi_yeu_cau_giai enable row level security;
drop policy if exists hinh_hoc_cau_hoi_yeu_cau_giai_member_all on public.hinh_hoc_cau_hoi_yeu_cau_giai;
create policy hinh_hoc_cau_hoi_yeu_cau_giai_member_all on public.hinh_hoc_cau_hoi_yeu_cau_giai
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on public.hinh_hoc_cau_hoi_yeu_cau_giai to authenticated;
