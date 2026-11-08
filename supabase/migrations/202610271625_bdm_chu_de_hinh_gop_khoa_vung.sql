-- ============================================================================
-- 202610271625 — bdm_chu_de_hinh_gop_khoa_vung
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 27/10: (1) "1 chủ đề gộp đi" — Hình cùng một chương có 2 phần Học (bài học) + Luyện (cây mô hình) ⇒ MỘT chủ đề vùng
--   'hinh', hai phần là hai mặt bên dưới (bảng riêng như cũ: hinh_hoc_bai / hinh_mo_hinh), không còn 2 chủ đề vùng hinh_hoc /
--   hinh_luyen. Đo 27/10 thấy đúng lỗi chọn nhầm: K7 «Đường thẳng song song» vùng Học mà chứa 8 mô hình Luyện, K11 «Quan hệ song
--   song trong không gian» vùng Luyện mà chứa 1 bài học. (2) "Đại, giải tích chỉ có 1 option… cần khoá… tự do thay đổi dễ chọn nhầm
--   lắm" ⇒ trigger KHOÁ VÙNG: chủ đề đã có nội dung thì không đổi được vùng; chủ đề còn rỗng (vừa tạo nhầm) vẫn sửa được.
--   Hai vùng cũ hinh_hoc / hinh_luyen không cho ghi mới (giữ trong CHECK cho lịch sử log).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — đổi vùng 9 chủ đề Hình sang 'hinh' (nội dung giữ nguyên chỗ), thêm 2 hàm + 1 trigger. 2 chủ đề trùng rỗng ở K9
--   (NCD00181, NCD00183) CHƯA xoá — chờ Thùy gật (Luật xoá).
-- ============================================================================

update dai_bdm_chu_de set nhanh = 'hinh' where nhanh in ('hinh_hoc', 'hinh_luyen');

-- chủ đề đã có nội dung chưa (chuyên đề/nhóm Đại–HGT · bài học Hình · mô hình / nhóm mô hình Hình · kho Đúng/Sai)
create or replace function _bdm_chu_de_co_noi_dung(p_id text) returns boolean
language sql stable as $$
  select exists (select 1 from dai_bdm_o where chu_de_id = p_id)
      or exists (select 1 from dai_bdm_nhom where chu_de_id = p_id)
      or exists (select 1 from hinh_hoc_bai where chu_de_id = p_id)
      or exists (select 1 from hinh_mo_hinh where chu_de_id = p_id)
      or exists (select 1 from hinh_nhom_mo_hinh where chu_de_id = p_id)
      or exists (select 1 from dai_bdm_kho_ds where chu_de_id = p_id)
      or exists (select 1 from hgt_bdm_kho_ds where chu_de_id = p_id)
$$;

create or replace function _trg_bdm_chu_de_khoa_vung() returns trigger language plpgsql as $$
begin
  if new.nhanh in ('hinh_hoc', 'hinh_luyen') then
    raise exception 'Vùng Hình – Học / Hình – Luyện đã gộp: chọn vùng «Hình» (một chủ đề có cả phần Học và phần Luyện)';
  end if;
  if tg_op = 'UPDATE' and new.nhanh is distinct from old.nhanh and public._bdm_chu_de_co_noi_dung(old.id) then
    raise exception 'Chủ đề «%» đã có nội dung — vùng bị khoá (đổi vùng dễ làm lạc chỗ của câu / bài). Cần đổi thật thì báo người quản trị.', old.ten;
  end if;
  return new;
end $$;
drop trigger if exists trg_bdm_chu_de_khoa_vung on dai_bdm_chu_de;
create trigger trg_bdm_chu_de_khoa_vung before insert or update of nhanh on dai_bdm_chu_de
  for each row execute function _trg_bdm_chu_de_khoa_vung();
