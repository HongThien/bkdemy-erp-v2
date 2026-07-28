-- 0100 — bổ trợ đuổi: BƯỚC DUYỆT DẠNG của team HỌC THUẬT (Thùy 07-15).
-- Luồng mới: Ops tạo card đuổi TRƠN (chỉ HS + lớp + lý do) → team học thuật (ghế team `hoc_thuat`
-- của đúng MÔN, xem vi_tri.mon) CHỐT dạng cần đuổi + số buổi = DUYỆT → thông tin chảy về để xếp/dạy.
-- GV dạy bám scope dạng đã duyệt, tick "đã dạy" mỗi buổi (đã có từ 0099).
--
-- dang_duyet_at NULL = CHƯA duyệt → derive task cho học thuật (không bảng tasks). Có giá trị = đã duyệt.
-- Gate MỀM (Thùy chốt): Ops vẫn xếp lịch được khi chưa duyệt (card mang cờ ⚠), GV dạy chưa có dạng
-- để tick tới khi học thuật duyệt xong. dang_duyet_boi = nhân sự duyệt (hiển thị "duyệt bởi X").
alter table bo_tro_duoi add column if not exists dang_duyet_at timestamptz;
alter table bo_tro_duoi add column if not exists dang_duyet_boi uuid references nhan_su(id) on delete set null;

-- Grandfather: đợt ĐÃ có kế hoạch (so_buoi_du_kien đã set) coi như đã duyệt — khỏi bắt team học thuật
-- duyệt lại các đợt đang chạy (dang_duyet_boi để NULL vì không rõ người duyệt lịch sử).
update bo_tro_duoi set dang_duyet_at = created_at
  where so_buoi_du_kien is not null and dang_duyet_at is null;
