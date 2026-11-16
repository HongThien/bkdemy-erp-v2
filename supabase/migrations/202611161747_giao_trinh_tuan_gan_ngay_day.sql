-- ============================================================================
-- 202611161747 — giao_trinh_tuan_gan_ngay_day
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Giáo trình tuần bước 5 (spec-giao-trinh-tuan.md §3.6): ngày dạy GV gán buổi cho lớp (luồng GanLopBdm → trichBuoiBdm: chèn
--   tai_lieu loai 'giao_trinh_buoi' (lop_id, ngay, nguon_buoi) rồi RPC chép nội dung). GV gán một buổi KHÁC buổi kế hoạch ⇒ liên kết
--   ca ⇄ buổi phải đổi theo (1-1, "cái nào đổi cái kia đổi theo" — Thùy 16/11), trong CÙNG giao dịch với dòng gán.
--   Dòng gán chèn từ client (không qua RPC) ⇒ đặt ở trigger trên chính dòng đó (CLAUDE §2.0: trạng thái suy từ bảng khác = trigger).
--   Chỉ áp khi buổi nguồn là nút 'buoi' của giáo trình CỦA ĐÚNG LỚP (luật của gtt_ca); buổi từ giáo trình chung / bản đồ cũ ⇒ bỏ qua,
--   KHÔNG chặn việc gán. Buổi đó đang gắn ca ngày khác của lớp ⇒ chuyển liên kết sang ngày thật được dạy (ca cũ trở về "chưa có khung").
--   Xoá dòng gán (Gán lại xoá rồi chèn) ⇒ KHÔNG đụng kế hoạch.
--   K28 (thêm trigger lên bảng có người ghi): chỉ chạy cho dòng loai 'giao_trinh_buoi' (điều kiện WHEN) — đo trước–sau ở DEVLOG 16/11.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Trigger có xoá DÒNG LIÊN KẾT gtt_ca (không xoá buổi, không xoá nội dung) khi buổi được gán dạy ở ngày khác ngày kế hoạch — có vết ở gtt_ca_log.
-- ============================================================================

set local lock_timeout = '3s';

create or replace function _gtt_theo_ngay_day() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_buoi uuid;
begin
  if new.lop_id is null or new.ngay is null or new.nguon_buoi is null
     or new.nguon_buoi !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return null;
  end if;
  v_buoi := new.nguon_buoi::uuid;
  -- chỉ buổi của giáo trình CỦA LỚP (cùng luật _gtt_ca_kiem) — khác thì bỏ qua, không chặn việc gán
  if not exists (
    select 1 from tai_lieu_phan p join tai_lieu t on t.id = p.tai_lieu_id join lop l on l.id = new.lop_id
     where p.id = v_buoi and p.loai_phan = 'buoi' and t.loai = 'giao_trinh' and t.lop_id = new.lop_id and t.mon = l.mon) then
    return null;
  end if;
  if exists (select 1 from gtt_ca g where g.lop_id = new.lop_id and g.ngay = new.ngay and g.buoi_id = v_buoi) then
    return null;   -- đúng kế hoạch
  end if;
  delete from gtt_ca g where g.buoi_id = v_buoi and not (g.lop_id = new.lop_id and g.ngay = new.ngay);
  insert into gtt_ca (lop_id, ngay, buoi_id, mon) values (new.lop_id, new.ngay, v_buoi, (select l.mon from lop l where l.id = new.lop_id))
  on conflict (lop_id, ngay) do update set buoi_id = excluded.buoi_id;
  return null;
end $$;
revoke execute on function _gtt_theo_ngay_day() from public, anon, authenticated;

create trigger trg_gtt_theo_ngay_day after insert or update of nguon_buoi, lop_id, ngay on tai_lieu
  for each row when (new.loai = 'giao_trinh_buoi') execute function _gtt_theo_ngay_day();
