-- ============================================================================
-- 202609031701 — mo_han_et_15p_bo_han_giao_trinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 03/09): "Mở giới hạn ET: 15 phút so với ca học · Bỏ giới hạn với bài
--   tập trên lớp".
--   · ET là bài THI làm TRONG ca; hạn cũ "12h trưa hôm sau" (mig 202608171359) rộng
--     quá — HS về nhà vẫn nộp được. Giờ: HẾT CA + 15 phút (gio_ket_thuc của slot TKB
--     khớp thứ + còn hiệu lực, cộng 15'). Không có TKB → 23:59 hôm đó (cùng fallback
--     giao_trinh cũ; KHÔNG trả NULL vì NULL = mở vĩnh viễn, ngược ý "thi trong ca").
--   · Bài tập trên lớp (giao_trinh) là bài LUYỆN — hạn cũ "hết buổi" khoá HS ngay khi
--     tan lớp, về nhà không làm tiếp được (8/8 test đang 'mo' đều đã "quá hạn").
--     Giờ: NULL = không hạn (bai_test_con_han đã coi NULL là còn hạn; app HS không
--     hiện dòng ⏳ khi deadline null).
--   · Backfill: test giao_trinh đang 'mo' → deadline NULL để HS mở lại được ngay
--     (đang bị khoá "quá hạn" toàn bộ). ET đã phát hành GIỮ NGUYÊN hạn cũ — đổi hạn
--     của bài đã phát là đổi luật giữa chừng phép đo; luật mới áp cho lần phát sau.
--
-- MẤT GÌ (Luật xoá): không drop/alter. UPDATE bai_test.deadline → NULL cho 8 dòng
--   giao_trinh trang_thai='mo' (giá trị cũ suy lại được = gio_ket_thuc TKB của ngày đó).
-- ============================================================================

create or replace function han_nop_bai_test(p_lop uuid, p_ngay date, p_loai text)
returns timestamptz
language plpgsql
stable
as $$
declare
  v_ke date;
  v_ket time;
begin
  if p_loai = 'et' then
    -- HẾT CA + 15 phút (Thùy 03/09). Không có TKB → 23:59 hôm đó.
    select t.gio_ket_thuc into v_ket
    from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from p_ngay) = 0 then 8 else extract(dow from p_ngay) + 1 end)
      and t.hieu_luc_tu <= p_ngay
      and (t.hieu_luc_den is null or p_ngay <= t.hieu_luc_den)
    order by t.gio_ket_thuc desc
    limit 1;
    if v_ket is null then
      return (p_ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh';
    end if;
    return (p_ngay::text || ' ' || v_ket::text)::timestamp at time zone 'Asia/Ho_Chi_Minh'
           + interval '15 minutes';

  elsif p_loai = 'btvn' then
    v_ke := buoi_ke_tiep(p_lop, p_ngay);
    if v_ke is null then return null; end if;
    return ((v_ke - 1)::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh';

  elsif p_loai = 'giao_trinh' then
    return null; -- bài luyện: không hạn (Thùy 03/09)

  else
    return null; -- de_thi và loại mới: staff tự đặt
  end if;
end;
$$;

comment on function han_nop_bai_test(uuid, date, text) is
  'Hạn nộp theo loại test. et=hết ca +15'' (không TKB → 23:59 hôm đó) · btvn=23:59 ngày trước buổi kế · giao_trinh=NULL (không hạn) · khác=NULL.';

-- Backfill: mở lại bài tập trên lớp đang bị khoá vì hạn "hết buổi".
update bai_test set deadline = null
where loai = 'giao_trinh' and trang_thai = 'mo' and deadline is not null;
