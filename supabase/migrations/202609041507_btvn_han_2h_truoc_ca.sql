-- ============================================================================
-- 202609041507 — btvn_han_2h_truoc_ca
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 04/09): "Mở giới hạn BTVN thành trước 2h trước buổi học".
--   Hạn BTVN cũ (mig 202608171359) = 23:59 NGÀY TRƯỚC buổi kế ⇒ HS học chiều/tối hôm sau mất
--   nguyên buổi sáng+trưa để làm. Quay về mốc GIỜ như tuan.ts/getMyTasks vẫn dùng cho task TA:
--   hạn = gio_bat_dau của ca kế tiếp − 2 giờ (ca kế tiếp = buoi_ke_tiep + slot TKB sớm nhất
--   trong ngày đó). Không tìm ra buổi kế (không TKB) → NULL như cũ (chỗ gọi đã cảnh báo staff).
--   Backfill: test btvn đang 'mo' tính lại theo luật mới (BTVN = tham khảo, không phải phép đo
--   đã chốt như ET — nới hạn không đổi kết quả nào).
--
-- MẤT GÌ (Luật xoá): không drop/alter. UPDATE bai_test.deadline cho btvn trang_thai='mo'
--   (giá trị cũ suy lại được từ luật cũ: 23:59 ngày trước buoi_ke_tiep).
-- ============================================================================

create or replace function han_nop_bai_test(p_lop uuid, p_ngay date, p_loai text)
returns timestamptz
language plpgsql
stable
as $$
declare
  v_ke date;
  v_ket time;
  v_bat time;
begin
  if p_loai = 'et' then
    -- HẾT CA + 15 phút (mig 202609031701). Không có TKB → 23:59 hôm đó.
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
    -- 2 GIỜ TRƯỚC ca học kế tiếp (Thùy 04/09): ngày = buoi_ke_tiep, giờ = gio_bat_dau slot sớm nhất.
    v_ke := buoi_ke_tiep(p_lop, p_ngay);
    if v_ke is null then return null; end if;
    select t.gio_bat_dau into v_bat
    from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from v_ke) = 0 then 8 else extract(dow from v_ke) + 1 end)
      and t.hieu_luc_tu <= v_ke
      and (t.hieu_luc_den is null or v_ke <= t.hieu_luc_den)
    order by t.gio_bat_dau asc
    limit 1;
    if v_bat is null then return null; end if; -- buoi_ke_tiep tìm thấy thì slot phải có; phòng hờ
    return (v_ke::text || ' ' || v_bat::text)::timestamp at time zone 'Asia/Ho_Chi_Minh'
           - interval '2 hours';

  elsif p_loai = 'giao_trinh' then
    return null; -- bài luyện: không hạn (Thùy 03/09)

  else
    return null; -- de_thi và loại mới: staff tự đặt
  end if;
end;
$$;

comment on function han_nop_bai_test(uuid, date, text) is
  'Hạn nộp theo loại test. et=hết ca +15'' (không TKB → 23:59 hôm đó) · btvn=gio_bat_dau ca kế tiếp −2h (không TKB → NULL) · giao_trinh=NULL · khác=NULL.';

-- Backfill: BTVN đang mở tính lại theo luật mới (chỉ khi luật mới ra được hạn — không xoá hạn cũ thành NULL).
update bai_test bt
   set deadline = han_nop_bai_test(bt.lop_id, bt.ngay, 'btvn')
 where bt.loai = 'btvn' and bt.trang_thai = 'mo'
   and han_nop_bai_test(bt.lop_id, bt.ngay, 'btvn') is not null;
