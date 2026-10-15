-- ============================================================================
-- so_do_ta_xoa_o_truong_khoi_7
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 15/10 "OK" — xoá ô "Trưởng khối 7" đã bỏ trống sau khi gộp khối 6·7 (mig 202610151915).
-- MẤT GÌ (Luật xoá — Thùy đã gật): 1 dòng vi_tri 292481ff-34ce-4f92-93f4-aa85a7914744 "Trưởng khối 7" team Trợ giảng —
--   không người giữ, khoi_quan_ly rỗng, không ô con (điều kiện kiểm ngay trong câu lệnh; sai thì không xoá gì).
-- ============================================================================
delete from vi_tri v
 where v.id = '292481ff-34ce-4f92-93f4-aa85a7914744' and v.ten = 'Trưởng khối 7'
   and v.nhan_su_id is null and v.khoi_quan_ly = '{}'
   and not exists (select 1 from vi_tri c where c.cha_id = v.id);
