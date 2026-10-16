-- ============================================================================
-- 202610161358 — troly_bu_dong_ho_so_kem_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO: dòng 'Đóng hồ sơ buổi bù' của báo cáo Sư phạm có doi_tuong = tên HS (không có lớp). Trợ lý cá nhân theo khối
--   (fn_troly_ca_nhan_lay) lọc việc theo TÊN LỚP trong doi_tuong ⇒ dòng này rơi khỏi báo cáo của mọi trưởng khối (hụt im lặng).
--   Buổi bù luôn có lop_id = null (491/491), lớp của em nằm ở buổi GỐC: buoi_hoc_hs.bu_cho_buoi_id → buoi_hoc.lop_id.
--   Sửa: doi_tuong = 'họ tên · tên lớp gốc', cùng khuôn với 2 nhánh còn lại. Chỉ đổi nhãn doi_tuong; số đếm, phụ trách, hạn, điều kiện KHÔNG đổi.
-- Thân hàm lấy từ pg_get_functiondef bản đang chạy; chỉ nhánh thứ 3 đổi (left join buoi gốc + lớp).
-- MẤT GÌ: không xoá gì.
-- ============================================================================
create or replace function public._troly_bc_viec_bu(p_tu date, p_den date)
 returns table(muc text, loai text, ngay date, doi_tuong text, viec text, phu_trach text, han timestamp with time zone, xong_luc timestamp with time zone, tinh_trang text)
 language plpgsql
 stable
as $function$
#variable_conflict use_column
declare v_nay date := public._troly_hom_nay();
begin
  perform public._troly_gac();
  return query
  with vang as (
    select b.ngay, l.ten_lop, hs.ho_ten,
      (exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                  and ((bb.trang_thai = 'hoan_tat' and x.diem_danh = 'co_mat') or bb.trang_thai = 'mo'))) as dang_co_buoi_bu,
      (exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id)) as tung_xep
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join lop l on l.id = b.lop_id
    join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
    where h.diem_danh in ('vang', 'vang_phep') and b.ngay between p_tu and p_den and b.ngay >= date '2026-08-10'
      and not exists (select 1 from bang_khong_bu kb where kb.buoi_hoc_hs_id = h.id)
  )
  select 'bo_tro_bu'::text, 'miss'::text, vang.ngay, vang.ho_ten || ' · ' || vang.ten_lop, 'Xếp bù lại'::text,
         (public._troly_truong_van_hanh() || ' (trưởng vận hành)')::text, null::timestamptz, null::timestamptz,
         format('Vắng %s — đã xếp bù nhưng trượt (vắng buổi bù hoặc buổi bù bị huỷ), chưa xếp lại', to_char(vang.ngay, 'DD/MM'))
  from vang where not vang.dang_co_buoi_bu and vang.tung_xep
  union all
  select 'bo_tro_bu', 'cham', vang.ngay, vang.ho_ten || ' · ' || vang.ten_lop, 'Xếp bù',
         public._troly_truong_van_hanh() || ' (trưởng vận hành)',
         ((vang.ngay + 2)::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         format('Vắng %s, quá hạn xếp bù 48h — đã %s ngày chưa xếp', to_char(vang.ngay, 'DD/MM'), v_nay - vang.ngay)
  from vang where not vang.dang_co_buoi_bu and not vang.tung_xep and v_nay - vang.ngay > 2
  union all
  select 'bo_tro_bu', 'cham', b.ngay,
         hs.ho_ten || coalesce(' · ' || lg.ten_lop, ''),
         'Đóng hồ sơ buổi bù',
         coalesce(nullif(concat_ws(', ', ns1.ho_ten, ns2.ho_ten), ''), 'chưa gán người dạy'),
         (b.ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         format('Buổi bù %s em đã học, hồ sơ còn khuyết: %s', to_char(b.ngay, 'DD/MM'),
                concat_ws(' · ', case when b.et_dong_at is null then 'ET' end, case when b.danh_gia_xong_at is null then 'đánh giá' end))
  from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id = b.id
  join hoc_sinh hs on hs.id = h.hoc_sinh_id
  left join buoi_hoc bg on bg.id = h.bu_cho_buoi_id
  left join lop lg on lg.id = bg.lop_id
  left join nhan_su ns1 on ns1.id = b.nguoi_day left join nhan_su ns2 on ns2.id = b.nguoi_day_tg
  where b.loai = 'bu' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den and b.ngay < v_nay
    and h.diem_danh = 'co_mat' and (b.et_dong_at is null or b.danh_gia_xong_at is null);
end $function$;
