-- BUG 08-07 (Thùy: "điểm MT chưa lưu được"): `getOrCreateKyThiMTChoBuoi` check-rồi-insert KHÔNG an-toàn-race
-- → 2 lần gọi đồng thời (StrictMode dev double-fire useEffect / 2 tab / 2 người) đẻ 2 `ky_thi` TRÙNG cho 1 buổi.
-- Điểm ghi kỳ A, lần mở sau đọc kỳ B (rỗng) ⇒ "chưa lưu". Code đã vá đọc deterministic (created_at asc);
-- đây là chặn TẬN GỐC = unique partial index (buoi_hoc_id) WHERE loai='mt_sat_hach'.
--
-- Dedup TRƯỚC khi tạo index (nếu không index fail). Chỉ xoá bản trùng KHÔNG có điểm (an-toàn — diem_thi
-- ON DELETE CASCADE, xoá kỳ có điểm = mất data). GIỮ bản CŨ NHẤT mỗi buổi (khớp hàm đọc created_at asc).
-- Nếu còn buổi nào có >1 kỳ mà NHIỀU kỳ đều có điểm (không tự dọn được) → tạo index sẽ fail lớn tiếng để
-- người xử tay (đúng tinh thần "thà dừng còn hơn xoá nhầm điểm"). Idempotent: chạy lại không còn gì để xoá.
delete from ky_thi k
where k.loai = 'mt_sat_hach'
  and not exists (select 1 from diem_thi d where d.ky_thi_id = k.id)          -- kỳ rỗng
  and exists (                                                                -- có kỳ khác cùng buổi, cũ hơn (hoặc bằng, tie-break theo id) → k là bản thừa
    select 1 from ky_thi o
    where o.loai = 'mt_sat_hach' and o.buoi_hoc_id = k.buoi_hoc_id and o.id <> k.id
      and (o.created_at, o.id) < (k.created_at, k.id)
  );

create unique index if not exists ky_thi_mt_1_per_buoi
  on ky_thi (buoi_hoc_id)
  where loai = 'mt_sat_hach' and buoi_hoc_id is not null;
