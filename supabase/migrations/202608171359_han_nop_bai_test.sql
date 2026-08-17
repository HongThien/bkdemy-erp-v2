-- ============================================================================
-- HẠN NỘP cho test online — tính Ở POSTGRES (CLAUDE.md §2: ngày/giờ VN tính ở DB).
--
-- LUẬT (Thùy chốt 17/08):
--   · et          → 12:00 trưa HÔM SAU buổi                    (spec-test-online §4)
--   · btvn        → 23:59 NGÀY TRƯỚC buổi học tiếp theo của lớp (Thùy 17/08, sửa từ
--                   "24h trước buổi kế" cho khớp mốc ngày thay vì mốc giờ trôi)
--   · giao_trinh  → HẾT BUỔI hôm đó (gio_ket_thuc của TKB); không có TKB → 23:59 hôm đó
--   · de_thi      → NULL, staff tự đặt (đề dùng lại nhiều lớp/lần)
--
-- ⚠ "Buổi học tiếp theo" KHÔNG lấy từ `buoi_hoc`: bảng đó chỉ có buổi ĐÃ DIỄN RA
--   (17/08: 497 dòng, dòng mới nhất 16/08, KHÔNG có dòng tương lai nào) — buổi được
--   tạo khi nó xảy ra, không sinh trước. Nguồn đúng là `thoi_khoa_bieu` (lịch lặp,
--   có cửa sổ hiệu lực). Quy ước `thu`: CN=8, T2..T7=2..7 (khớp gami.ts/opsvanhanh.ts).
--
-- KHÔNG có job đóng test: "hết hạn" SUY từ deadline < now() (CLAUDE.md §4 — đừng đẻ
--   state chờ). `trang_thai='dong'` để dành cho việc staff đóng TAY (có actor).
-- ============================================================================

-- Ngày diễn ra buổi kế tiếp của lớp, sau p_tu. Quét tối đa 60 ngày; không thấy → NULL
-- (KHÔNG đoán — §1.5 "thà bỏ trống còn hơn đánh sai"; chỗ gọi phải cảnh báo cho người).
create or replace function buoi_ke_tiep(p_lop uuid, p_tu date)
returns date
language sql
stable
as $$
  select d::date
  from generate_series(p_tu + 1, p_tu + 60, interval '1 day') d
  where exists (
    select 1 from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from d) = 0 then 8 else extract(dow from d) + 1 end)
      and t.hieu_luc_tu <= d::date
      and (t.hieu_luc_den is null or d::date <= t.hieu_luc_den)
  )
  order by d
  limit 1
$$;

comment on function buoi_ke_tiep(uuid, date) is
  'Ngày buổi học kế tiếp của lớp theo thoi_khoa_bieu (buoi_hoc không có dòng tương lai). NULL = không tìm thấy trong 60 ngày.';

-- Hạn nộp của 1 test. NULL = không đặt được (de_thi, hoặc btvn không tìm ra buổi kế).
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
    -- 12:00 trưa hôm sau, giờ VN
    return ((p_ngay + 1)::text || ' 12:00')::timestamp at time zone 'Asia/Ho_Chi_Minh';

  elsif p_loai = 'btvn' then
    v_ke := buoi_ke_tiep(p_lop, p_ngay);
    if v_ke is null then return null; end if;
    return ((v_ke - 1)::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh';

  elsif p_loai = 'giao_trinh' then
    -- hết buổi hôm đó: gio_ket_thuc của slot TKB khớp đúng thứ + còn hiệu lực
    select t.gio_ket_thuc into v_ket
    from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from p_ngay) = 0 then 8 else extract(dow from p_ngay) + 1 end)
      and t.hieu_luc_tu <= p_ngay
      and (t.hieu_luc_den is null or p_ngay <= t.hieu_luc_den)
    order by t.gio_ket_thuc desc
    limit 1;
    return (p_ngay::text || ' ' || coalesce(v_ket, time '23:59')::text)::timestamp
           at time zone 'Asia/Ho_Chi_Minh';

  else
    return null; -- de_thi và loại mới: staff tự đặt
  end if;
end;
$$;

comment on function han_nop_bai_test(uuid, date, text) is
  'Hạn nộp theo loại test. et=12h hôm sau · btvn=23:59 ngày trước buổi kế · giao_trinh=hết buổi · khác=NULL.';

grant execute on function buoi_ke_tiep(uuid, date) to authenticated;
grant execute on function han_nop_bai_test(uuid, date, text) to authenticated;
