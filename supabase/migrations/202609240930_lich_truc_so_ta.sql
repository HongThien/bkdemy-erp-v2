-- Thùy 24/09 (spec-xep-bo-tro-chung.md §2, bước 1): lịch trực thành nguồn lực CHUNG của 3 loại bổ trợ, tính bằng ĐƠN VỊ (30' × 1 TA).
-- Ca có 1 hoặc 2 TA (2 TA = 12 đơn vị/60'). Giả định G3: 2 TA = 1 dòng lịch trực có 2 người, cùng phòng. Sức chứa mặc định 3 em/TA.
alter table public.lich_truc_bo_tro
  add column if not exists so_ta smallint not null default 1 check (so_ta between 1 and 2),
  add column if not exists nhan_su_2_id uuid references public.nhan_su(id);
-- Đơn vị của ca = 3 × (phút / 30) × số TA — cột suy, 1 nguồn công thức (§2.0).
alter table public.lich_truc_bo_tro
  add column if not exists don_vi smallint generated always as
    ((3 * (extract(epoch from (gio_ket_thuc - gio_bat_dau)) / 1800)::int * so_ta)::smallint) stored;
comment on column public.lich_truc_bo_tro.don_vi is '1 đơn vị = 30 phút × 1 TA. Đuổi 4 · Bù 4 · Yếu L2 4 · Yếu L1 2 (spec-xep-bo-tro-chung.md §1).';
