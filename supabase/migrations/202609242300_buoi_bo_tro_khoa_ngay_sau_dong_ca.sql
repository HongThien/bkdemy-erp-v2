-- Thùy 24/09 tối: "Triệu Đức Tùng xếp mãi vẫn ở Cần xếp — check + fix để lỗi này KHÔNG LẶP LẠI".
-- Gốc lỗi: form Xếp bổ trợ yếu (bản trước 36224d3) mở buổi 'mo' ĐÃ HỌC + ĐÃ ĐÓNG CA ở chế độ SỬA ⇒ bấm "xếp" chỉ ĐỔI NGÀY buổi cũ, không đẻ buổi mới
-- ⇒ case không bao giờ có "buổi chờ học" ⇒ kẹt ở Cần xếp; buổi đã học bị dời sang tương lai (hiện sai trên app TA + Lịch phòng).
-- Rà toàn hệ 24/09: 4 buổi dính (1 là dữ liệu test của Tùng — xử riêng, chờ CEO gật xoá). 3 em thật dưới đây trả về NGÀY HỌC THẬT; mỗi ngày có
-- ≥2 nhân chứng độc lập trùng nhau (ngày đóng ca · ngày em làm bài · ngày nhận xét · ngày sinh bài) — CLAUDE.md §2 "nhân chứng thứ hai":
--   Bùi Tuệ An        21/09 → 18/09 (đóng ca · làm bài · nhận xét · sinh bài đều 18/09; bị đổi 21/09 18:29)
--   Minh Quân         27/09 → 20/09 (đóng ca · nhận xét 20/09; bị đổi 24/09 15:16)
--   Nguyễn Quang Minh 28/09 → 21/09 (đóng ca · làm bài · nhận xét · sinh bài đều 21/09; bị đổi 24/09 15:30)
-- Kèm gỡ khỏi ca trực tương lai (Lịch phòng đã gắn nhầm 2 buổi vào ca 27/09, 28/09 và trừ đơn vị).

-- 1. Trả ngày thật (điều kiện where giữ đúng ngày SAI hiện tại ⇒ chạy lại không đè gì)
update public.buoi_hoc set ngay = '2026-09-18', thu = public._thu_cua_ngay('2026-09-18'), ca_bo_tro_id = null, updated_at = now()
  where id = '3c1a5004-22fc-4151-a24f-c96fb8b67587' and ngay = '2026-09-21';
update public.buoi_hoc set ngay = '2026-09-20', thu = public._thu_cua_ngay('2026-09-20'), ca_bo_tro_id = null, updated_at = now()
  where id = '66de5df1-ed63-4028-aaa7-c300db2776e0' and ngay = '2026-09-27';
update public.buoi_hoc set ngay = '2026-09-21', thu = public._thu_cua_ngay('2026-09-21'), ca_bo_tro_id = null, updated_at = now()
  where id = 'a14dee91-af54-4930-a03d-acc4b23cf4dd' and ngay = '2026-09-28';
update public.buoi_hoc_hs set don_vi = null, xac_nhan_ph_at = null, xac_nhan_boi = null
  where buoi_hoc_id in ('3c1a5004-22fc-4151-a24f-c96fb8b67587', '66de5df1-ed63-4028-aaa7-c300db2776e0', 'a14dee91-af54-4930-a03d-acc4b23cf4dd');

-- 2. CHẶN TẬN GỐC: buổi bổ trợ (yếu · bù · đuổi) đã học xong (đóng ca / hoàn tất) thì KHÔNG đổi được ngày/giờ — bất kể sửa từ màn nào.
--    Học tiếp = xếp BUỔI MỚI. (Trigger là "hidden code" — CLAUDE.md §2: lỗi hiện rõ chữ, không 400 câm.)
create or replace function public._trg_buoi_bo_tro_khoa_ngay() returns trigger
language plpgsql as $$
begin
  if old.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')
     and (old.danh_gia_xong_at is not null or old.trang_thai = 'hoan_tat')
     and (new.ngay is distinct from old.ngay or new.gio_bat_dau is distinct from old.gio_bat_dau or new.gio_ket_thuc is distinct from old.gio_ket_thuc) then
    raise exception 'Buổi % % đã học xong (đóng ca) — không đổi ngày/giờ được. Muốn học tiếp thì XẾP BUỔI MỚI.',
      to_char(old.ngay, 'DD/MM'), coalesce(to_char(old.gio_bat_dau, 'HH24:MI'), '');
  end if;
  return new;
end $$;
drop trigger if exists trg_buoi_bo_tro_khoa_ngay on public.buoi_hoc;
create trigger trg_buoi_bo_tro_khoa_ngay before update of ngay, gio_bat_dau, gio_ket_thuc on public.buoi_hoc
  for each row execute function public._trg_buoi_bo_tro_khoa_ngay();
