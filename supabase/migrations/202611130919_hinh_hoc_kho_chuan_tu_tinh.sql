-- ============================================================================
-- 202611130919 — hinh_hoc_kho_chuan_tu_tinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   LUẬT DUYỆT 13/11 (Thùy): câu chưa chắc ⇒ người kiểm, không được dùng như câu chuẩn. Ở Đại/HGT `kho_chuan` là cột suy
--   (_kho_cau_chuan) nên câu `kiem_may='nghi'` chưa duyệt tự ra khỏi kho chuẩn. Ở Hình–Học `kho_chuan` là cột THƯỜNG mặc định
--   true (mig 202609181852, chủ ý: câu Hình chưa duyệt vẫn chọn được cho giáo trình) ⇒ 28/34 câu Hình vừa rút về người kiểm
--   (13/11) vẫn là "chuẩn".
--   Thùy 13/11 chọn PHƯƠNG ÁN B: Hình KHÔNG theo Đại hoàn toàn (giữ quyết định 18/09 — câu chưa duyệt vẫn dùng được), chỉ thêm
--   luật "câu NGHI mà CHƯA DUYỆT thì không chuẩn". Cột `kho_chuan=false` từ 09/11 còn mang nghĩa thứ hai: "câu cả bài cũ đã tách ý,
--   rút khỏi chọn câu" (kho-rules/hinh/lo/tach-y/ghi.mjs, mig 202611091902) — nghĩa đó tách ra cột riêng `rut_khoi_kho` để không mất.
--   kho_chuan = (không bị rút) AND (đã duyệt HOẶC không bị nghi) — cột suy (CLAUDE.md §2.0: suy được từ cột cùng dòng ⇒ generated).
--   Đo 13/11 trước khi áp: 322 câu đang false — cả 322 là `ma_cau_goc` của một bài đã tách ý (hinh_hoc_bai_y) ⇒ chép sang rut_khoi_kho.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá — Thùy gật 13/11 "Phương án B"):
--   • DROP cột `hinh_hoc_cau_hoi.kho_chuan` (cột thường) rồi TẠO LẠI là cột suy cùng tên. Giá trị tay hiện có: 322 false đã CHÉP
--     sang `rut_khoi_kho` trước khi drop (không mất thông tin); 5.799 true là mặc định.
--   • DROP + tạo lại y nguyên index `hinh_hoc_cau_hoi_chuan_song_idx`.
--   Kết quả đổi: câu nghi chưa duyệt rời kho chuẩn (đo 13/11 ≈ 32 câu). Không câu nào khác đổi.
-- ============================================================================

alter table public.hinh_hoc_cau_hoi add column if not exists rut_khoi_kho boolean not null default false;
comment on column public.hinh_hoc_cau_hoi.rut_khoi_kho is
  'Câu bị rút khỏi chọn câu (vd câu cả bài cũ đã tách ý — 09/11). Thay cho việc ghi tay kho_chuan=false (13/11).';

update public.hinh_hoc_cau_hoi set rut_khoi_kho = true where not kho_chuan;

do $$
declare n_rut int; n_la int;
begin
  select count(*) into n_rut from public.hinh_hoc_cau_hoi where rut_khoi_kho;
  select count(*) into n_la from public.hinh_hoc_cau_hoi q where rut_khoi_kho
    and exists (select 1 from public.hinh_hoc_bai_y y where y.ma_cau_goc = q.ma_cau);
  -- mọi câu đang false phải là câu gốc của bài đã tách ý — nghĩa khác ⇒ dừng, không đoán
  if n_rut <> n_la then
    raise exception 'kho_chuan=false có % câu nhưng chỉ % là câu gốc tách ý — có nghĩa khác, dừng', n_rut, n_la;
  end if;
  raise notice 'rut_khoi_kho = % câu (đều là câu gốc tách ý)', n_rut;
end $$;

drop index if exists public.hinh_hoc_cau_hoi_chuan_song_idx;
alter table public.hinh_hoc_cau_hoi drop column kho_chuan;
alter table public.hinh_hoc_cau_hoi add column kho_chuan boolean
  generated always as ((not rut_khoi_kho) and (da_duyet or kiem_may is distinct from 'nghi')) stored;
comment on column public.hinh_hoc_cau_hoi.kho_chuan is
  'Cột SUY (13/11, phương án B): không bị rút và (đã duyệt hoặc không bị máy/AI nghi). Câu Hình chưa duyệt vẫn chuẩn (quyết định 18/09).';
create index if not exists hinh_hoc_cau_hoi_chuan_song_idx on public.hinh_hoc_cau_hoi using btree (dang_chinh)
  where ((kho_chuan = true) and (xoa_at is null));
