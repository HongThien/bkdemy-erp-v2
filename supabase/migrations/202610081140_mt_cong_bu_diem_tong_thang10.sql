-- ============================================================================
-- mt_cong_bu_diem_tong_thang10
-- ----------------------------------------------------------------------------
-- VÌ SAO: điểm MT tổng tự cộng bằng TRIGGER khi điểm câu đổi (mig 202610081051). HS chấm xong TRƯỚC khi có trigger
-- (sáng 08/10, màn Chấm MT chi tiết cũ) không có lần đổi nào ⇒ chưa có điểm tổng ⇒ màn Chấm MT hiện "xong" mà
-- điểm "—" (thấy ở 9S1). Cộng bù 1 lần cho các buổi MT từ 01/10 (đề cuối tháng 9 trở đi): dựng khung từng buổi
-- (điểm tối đa + phần Nâng cao), rồi đồng bộ điểm tổng từng HS đã có điểm câu. Luật y hệt trigger: chỉ ghi khi
-- HS đủ điểm mọi câu; dòng nhập tay ('tay') KHÔNG đụng. Đo trước (ROLLBACK): +19 dòng 'cau' (9B1 13 · 9C1 3 ·
-- 9S1 3), 225 dòng tay giữ nguyên. Buổi trước 01/10 KHÔNG đụng (điểm tháng cũ đã chốt xếp hạng).
-- MẤT GÌ: không.
-- ============================================================================
do $$
declare r record;
begin
  for r in select distinct b.id from buoi_hoc b join gami_session_problems s on s.buoi_hoc_id = b.id and s.phase = 'mt'
            where b.ngay >= date '2026-10-01' and b.loai = 'thuong' and b.trang_thai <> 'huy'
  loop perform fn_mt_khung_buoi(r.id); end loop;
  perform _mt_dong_bo_diem_thi(x.buoi_hoc_id, x.hoc_sinh_id)
    from (select distinct g.buoi_hoc_id, g.hoc_sinh_id
            from gami_grades g join gami_session_problems s on s.id = g.problem_id and s.phase = 'mt'
            join buoi_hoc b on b.id = g.buoi_hoc_id
           where b.ngay >= date '2026-10-01') x;
end $$;
