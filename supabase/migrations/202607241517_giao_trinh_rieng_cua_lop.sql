-- ============================================================================
-- 202607241517 — giao_trinh_rieng_cua_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO: 1 giáo trình master (vd 10 buổi) gán cho nhiều lớp, nhưng mỗi lớp học
-- một TẬP CON khác nhau (9A1 học buổi 1,2,3,6,7,8,10 · 9A2 học 1..7). Doc trích
-- xuất copy NGUYÊN tiêu đề buổi của master → phiếu của 9A1 in ra "Buổi 10" trong
-- khi với lớp đó nó mới là buổi thứ 7. Số thứ tự buổi phải là số của LỚP, không
-- phải số của giáo trình gốc (nội dung thì vẫn ánh xạ từ master).
--
-- KHÔNG đẻ bảng mới: doc vận hành (giao_trinh_buoi / btvn) đã bám (lop_id, ngay)
-- + nguon_id/nguon_buoi (đường ánh xạ về buổi gốc) — chỉ thiếu ĐÚNG một thứ là
-- số thứ tự của buổi TRONG LỚP.
--
-- stt_lop = hạng của `ngay` trong các ngày đã gán của LỚP đó (1,2,3…), TÍNH LẠI
-- cả lớp mỗi lần gán / gán lại / xoá (renumberBuoiLop, lib/tailieu.ts) — không
-- phải "số lúc tạo": gán thêm buổi vào GIỮA lịch thì các buổi sau phải dồn số.
-- GT + BTVN cùng (lop_id, ngay) = cùng một buổi ⇒ cùng stt_lop.
-- NULL = doc không thuộc lớp nào (master giáo trình, ET, đề thi…).
--
-- MẤT GÌ: không mất gì — chỉ THÊM 1 cột nullable + 1 index.
-- ============================================================================

alter table tai_lieu add column if not exists stt_lop int;

-- Tra "bộ giáo trình riêng của lớp X, theo thứ tự buổi của lớp".
create index if not exists tai_lieu_lop_stt_idx on tai_lieu (lop_id, stt_lop)
  where lop_id is not null and loai in ('giao_trinh_buoi', 'btvn');
