-- 0108 — Xoá doc ET MỒ CÔI của 7S2 · 13/07/2026 (Thùy duyệt 07-21).
--
-- 7S2 13/07 có HAI doc ET cùng (lớp+ngày). App chỉ dùng bản MỚI NHẤT (getETByBuoi order created_at
-- desc) = `29bf8409`, và lưới chấm khớp đúng bản đó. Bản cũ `4efd950c` (tạo 12:28, bản dùng thật tạo
-- 13:03) không nơi nào đọc — nhưng nó CHÍNH LÀ thứ làm script quét đời đầu báo động giả "7S2 lệch
-- dạng", và sẽ còn làm nhiễu mọi lần chẩn đoán sau.
--
-- CÁI SẼ MẤT (đếm chính xác trước khi chạy):
--   · 1 dòng tai_lieu           (id 4efd950c-c8b4-43c8-8420-2cb764938afe, "ET 7S2 · 13/07/2026")
--   · 1 dòng tai_lieu_phan      (cascade)
--   · 5 dòng tai_lieu_cau       (cascade) — CHỈ là con trỏ tới câu trong kho, KHÔNG phải câu
--   · 1 dòng linkgen_jobs       (cascade)
--   · 0 dòng gami_grades / gami_session_problems — không ô chấm nào trỏ vào doc này
-- File PDF trong bucket `kho-tailieu` (file_url của doc) KHÔNG bị xoá — storage phải dọn tay nếu cần.
--
-- Guard: chỉ xoá khi vẫn còn ≥1 doc ET KHÁC cho đúng (lớp 7S2 + ngày 13/07) — không bao giờ để lớp
-- mất sạch ET vì migration này. Chạy lại = no-op.

delete from tai_lieu tl
where  tl.id = '4efd950c-c8b4-43c8-8420-2cb764938afe'
  and  tl.loai = 'et'
  and  exists (
         select 1 from tai_lieu khac
         where khac.loai = 'et' and khac.lop_id = tl.lop_id and khac.ngay = tl.ngay
           and khac.id <> tl.id);
