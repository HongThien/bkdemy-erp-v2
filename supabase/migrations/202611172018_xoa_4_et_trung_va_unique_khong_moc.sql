-- Thùy 17/11 "Xoá 4 bản trùng": 4 buổi tháng 11 có 2 ET bản đồ mới giống hệt (lưu chồng, cách nhau 1–2 giây — spec-builder §12 L11).
-- Xoá bản tạo TRƯỚC của mỗi cặp: bản tạo SAU là bản được sửa tiếp (cấu hình mã đề đầy đủ hơn) và là bản lưới chấm lấy (getETByBuoi = mới nhất).
-- Bản trước: 0 bài trên app · 0 buổi trỏ · 0 bản con · 0 ca test. Mất theo cascade: 4 phần · 20 dòng tai_lieu_cau · 4 job in.
-- Bản chép trước khi xoá: _luu-tru/du-lieu/et-trung-thang-11-17-11.json. Sau đó thay unique index có mốc ngày bằng index KHÔNG mốc.
do $$
declare v_n int;
begin
  delete from tai_lieu t
   where t.id in ('83641f29-1ef7-4d66-8ba7-03b2151b2c91', '55f6b4f7-efcc-4179-a7bd-2656cf54256e',
                  '2f706d09-eb84-4af1-96c4-c46f7474f6c7', '04c60bd8-9fe0-4185-8506-9ba79c33051b')
     and t.loai = 'et' and t.ban_do = 'moi'
     and exists (select 1 from tai_lieu x where x.loai = 'et' and x.ban_do = 'moi' and x.lop_id = t.lop_id and x.ngay = t.ngay and x.created_at > t.created_at)
     and not exists (select 1 from bai_test b where b.nguon_tai_lieu_id = t.id)
     and not exists (select 1 from buoi_hoc b where b.de_id = t.id);
  get diagnostics v_n = row_count;
  if v_n <> 4 then raise exception 'xoá % bản, cần đúng 4', v_n; end if;
end $$;

drop index if exists public.tai_lieu_et_moi_mot_buoi_uidx;
create unique index tai_lieu_et_moi_mot_buoi_uidx on public.tai_lieu (lop_id, ngay)
  where loai = 'et' and ban_do = 'moi' and lop_id is not null and ngay is not null;
