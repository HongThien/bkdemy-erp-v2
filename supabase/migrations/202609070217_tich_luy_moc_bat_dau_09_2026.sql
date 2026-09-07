-- ============================================================================
-- tich_luy_moc_bat_dau_09_2026
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 07/09): "Trước tháng 8 không tính, chỉ tính từ tháng 9." Bản 202609070151 chưa
-- có mốc bắt đầu: _tich_luy_cua('2026-08') vẫn trả 1400–2400 điểm cho OPS/TA (việc trước 01/09
-- luôn tính đạt ⇒ chuỗi T8 = số ngày có việc, là "điểm quà tặng"), và fn_tich_luy_chot_thang
-- không chặn chốt T8 ⇒ admin lỡ chốt là thành điểm thật. Mốc đặt TRONG hàm (§2.0, 1 nguồn):
--   • _tich_luy_cua: tháng < 09/2026 → 0 điểm, chuỗi 0 (app bấm ‹ về T8 thấy 0, không thấy "dự kiến").
--   • fn_tich_luy_chot_thang: kỳ < 01/09/2026 → raise.
-- Mốc là hằng chính sách một lần (ta_dinh_muc.gia_tri là numeric, không chứa date) → hardcode
-- có comment. Thân hàm còn lại CHÉP NGUYÊN 202609070151.
-- MẤT GÌ (Luật xoá): không xoá gì. CREATE OR REPLACE 2 hàm, cùng chữ ký.
-- ============================================================================

create or replace function public._tich_luy_cua(p_ns uuid, p_ym text)
returns table (diem_thang integer, chuoi integer, ngay_cuoi date, ngay_trot date)
language plpgsql stable as $$
declare
  v_tu date; v_den date; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  k_diem integer; r record; v_chuoi integer := 0; v_cuoi date := null; v_trot date := null;
  k_moc constant date := date '2026-09-01';   -- CEO 07/09: tích lũy chỉ tính từ tháng 9/2026
begin
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
  if v_tu < k_moc then
    return query select 0, 0, null::date, null::date; return;
  end if;
  select gia_tri::integer into k_diem from ta_dinh_muc where ma = 'diem_moi_ngay';
  for r in
    with viec as (
      select ngay, kq from public.fn_ta_viec_thang(v_tu, v_den) where nhan_su_id = p_ns
      union all select ngay, kq from public.fn_gv_viec_thang(v_tu, v_den) where nhan_su_id = p_ns
      union all select ngay, kq from public.fn_ops_viec_thang(v_tu, v_den) where nhan_su_id = p_ns
    )
    select ngay, bool_or(kq = 'khong_dat') as trot
    from viec where ngay < v_today and kq <> 'cho'
    group by ngay order by ngay
  loop
    if r.trot then v_chuoi := 0; v_trot := r.ngay; else v_chuoi := v_chuoi + 1; end if;
    v_cuoi := r.ngay;
  end loop;
  return query select v_chuoi * coalesce(k_diem, 100), v_chuoi, v_cuoi, v_trot;
end $$;

create or replace function public.fn_tich_luy_chot_thang(p_ky date)
returns integer language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id(); v_ym text; v_tu date; v_den date; r record; t record; n integer := 0;
  k_moc constant date := date '2026-09-01';   -- CEO 07/09: không chốt kỳ trước tháng 9/2026
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  if p_ky <> date_trunc('month', p_ky)::date then raise exception 'p_ky phải là ngày 1 của tháng'; end if;
  if p_ky < k_moc then raise exception 'Điểm tích lũy chỉ tính từ tháng 09/2026 — không chốt kỳ %.', to_char(p_ky, 'MM/YYYY'); end if;
  if p_ky >= date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date then
    raise exception 'Chỉ chốt tháng ĐÃ KẾT THÚC.'; end if;
  v_ym := to_char(p_ky, 'YYYY-MM'); v_tu := p_ky; v_den := (p_ky + interval '1 month' - interval '1 day')::date;
  for r in
    select distinct nhan_su_id from (
      select nhan_su_id from public.fn_ta_viec_thang(v_tu, v_den)
      union all select nhan_su_id from public.fn_gv_viec_thang(v_tu, v_den)
      union all select nhan_su_id from public.fn_ops_viec_thang(v_tu, v_den)) x
  loop
    select * into t from public._tich_luy_cua(r.nhan_su_id, v_ym);
    insert into tich_luy_chot_thang (ky, nhan_su_id, diem, chuoi, nguoi_chot, chot_at)
      values (p_ky, r.nhan_su_id, t.diem_thang, t.chuoi, v_me, now())
      on conflict (ky, nhan_su_id) do update set diem = excluded.diem, chuoi = excluded.chuoi, nguoi_chot = excluded.nguoi_chot, chot_at = now();
    n := n + 1;
  end loop;
  return n;
end $$;
