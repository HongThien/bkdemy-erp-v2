-- ============================================================================
-- 202609220930 — fn_duoi_giay_sinh_do_kho
-- ----------------------------------------------------------------------------
-- Đồng bộ với mig 202609220900: bài test GIẤY (TA tự sinh, kịch bản 3 — không
-- thiết bị) cũng phải theo ĐÚNG luật số câu theo độ khó dạng (3 nếu muc_do 4-5,
-- 5 nếu ≤3) — trước đó hardcode 10 câu, lệch với đường online. Chỉ đổi số câu
-- test; luyện giữ nguyên p_so_cau do TA chọn (mặc định 5) — không đổi.
--
-- MẤT GÌ (Luật xoá): không — CREATE OR REPLACE 1 hàm, không đổi tham số/bảng.
-- ============================================================================

create or replace function public.fn_duoi_giay_sinh(
  p_buoi uuid, p_hoc_sinh uuid, p_mon text, p_ma_dang text, p_loai text, p_so_cau integer default 5
)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_lop uuid; v_nhanh text; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[];
        v_bt uuid; i integer := 0; c text; v_n integer; v_muc_do smallint;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in/hiện được đề.'; end if;
  if p_loai not in ('htd_luyen', 'htd_test') then raise exception 'loai không hợp lệ: %', p_loai; end if;
  if p_loai = 'htd_test' then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end; -- khớp luật online, mig 202609220900
  else
    v_n := greatest(1, least(coalesce(p_so_cau, 5), 10));
  end if;

  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = p_hoc_sinh and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', p_mon; end if;

  v_nhanh := public._kho_nhanh_cua_dang(p_mon, p_ma_dang);
  v_cautbl := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl := public._kho_lt_tbl(p_mon, v_nhanh);

  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt2 join bai_test_cau btc on btc.bai_test_id = bt2.id
    where bt2.hoc_sinh_id = p_hoc_sinh and bt2.mon = p_mon and bt2.loai in ('htd_luyen', 'htd_test')
      and btc.ma_dang = p_ma_dang and btc.ma_cau is not null;

  v_caus := public._htd_chon_cau_bat_ky(v_cautbl, p_ma_dang, v_tru, v_n);
  if coalesce(array_length(v_caus, 1), 0) = 0 then
    raise exception 'Dạng % chưa có câu nào trong kho — chưa sinh được bài.', p_ma_dang;
  end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, p_hoc_sinh, current_date, p_loai, p_mon, 0, 'mo', p_buoi, now(), public.jwt_uid())
    returning id into v_bt;
  foreach c in array v_caus loop
    i := i + 1;
    perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
  end loop;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $$;
