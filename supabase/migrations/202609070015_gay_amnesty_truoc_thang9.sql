-- ============================================================================
-- 202609070015 — gay_amnesty_truoc_thang9
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 07/09 sáng, ngay sau khi thấy 862 đề xuất gậy tồn đọng từ
-- trước): bật gậy-override cho OPS lộ ra cả núi việc trễ TRƯỚC KHI có luật này —
-- phạt ngược cho luật mới không công bằng. CEO chốt: MỌI VIỆC CÓ NGÀY TRƯỚC
-- 01/09/2026 → coi như ĐẠT CHUẨN hết, không xét gậy/trễ hạn gì nữa. Luật gậy-
-- driven chỉ áp dụng cho việc TỪ THÁNG 9 TRỞ ĐI. Đây là MỘT MỐC LỊCH SỬ CỐ ĐỊNH
-- (không phải "tháng hiện tại" — không tự trôi theo thời gian).
--
-- MẤT GÌ (Luật xoá): không xoá gì — CREATE OR REPLACE 3 hàm cùng chữ ký/cột trả
-- về (fn_ta_viec_thang, fn_gv_viec_thang, fn_ops_viec_thang), chỉ thêm 1 điều
-- kiện ân xá ở cuối. gay_de_xuat/gay_ledger cũ vẫn giữ nguyên (vết lịch sử, chỉ
-- là KHÔNG còn ảnh hưởng đạt/không-đạt của dashboard nữa).
-- ============================================================================

create or replace function public.fn_ta_viec_thang(p_tu date, p_den date)
returns table (nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text)
language sql stable as $$
  with raw as (
    select v.nhan_su_id, v.ten_lop, v.ngay, v.tab, v.ref_key,
      case
        when d.id is not null then case when d.tien_do >= 100 and d.chat_luong >= 80 then 'dat' else 'khong_dat' end
        when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
        when v.han < now() then 'khong_dat'
        else 'cho'
      end as kq_raw,
      case
        when d.id is not null and (d.tien_do < 100 or d.chat_luong < 80) then
          case when d.chat_luong < 80 then 'chat_luong' else 'tre' end
        when v.dong_at is not null and v.dong_at > v.han then 'tre'
        when v.dong_at is null and v.han < now() then 'no_qua_han'
        else null
      end as ly_do_raw
    from public.fn_viec_buoi_thuong(p_tu, p_den, true) v
    left join viec_van_hanh_duyet d on d.buoi_hoc_id = v.buoi_id and d.tab = v.tab and d.nhan_su_id = v.nhan_su_id
    where v.vai = 'tg' and not (v.tab = 'et' and v.et_online)
  ),
  gay_adj as (
    select r.nhan_su_id, r.ten_lop, r.ngay, r.tab,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
         (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
       else r.kq_raw end) as kq,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
         then null else r.ly_do_raw end) as ly_do
    from raw r
  )
  -- Ân xá lịch sử (CEO 07/09): việc TRƯỚC 01/09/2026 luôn ĐẠT CHUẨN, bất kể gậy — luật gậy-driven
  -- chỉ tính từ tháng 9. Mốc cố định, KHÔNG phải "tháng hiện tại".
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang, g.ten_lop, g.ngay, g.tab,
    (case when g.ngay < date '2026-09-01' and g.kq = 'khong_dat' then 'dat' else g.kq end) as kq,
    (case when g.ngay < date '2026-09-01' then null else g.ly_do end) as ly_do
  from gay_adj g join nhan_su ns on ns.id = g.nhan_su_id
$$;
grant execute on function public.fn_ta_viec_thang(date, date) to authenticated;
revoke execute on function public.fn_ta_viec_thang(date, date) from anon;

create or replace function public.fn_gv_viec_thang(p_tu date, p_den date)
returns table (nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text)
language sql stable as $$
  with raw as (
    select v.nhan_su_id, v.ten_lop, v.ngay, v.tab, v.ref_key,
      case
        when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
        when v.han < now() then 'khong_dat'
        else 'cho'
      end as kq_raw,
      case
        when v.dong_at is not null and v.dong_at > v.han then 'tre'
        when v.dong_at is null and v.han < now() then 'no_qua_han'
        else null
      end as ly_do_raw
    from public.fn_viec_buoi_thuong(p_tu, p_den, true) v
    where v.vai = 'gv'
  ),
  gay_adj as (
    select r.nhan_su_id, r.ten_lop, r.ngay, r.tab,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
         (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
       else r.kq_raw end) as kq,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
         then null else r.ly_do_raw end) as ly_do
    from raw r
  )
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang, g.ten_lop, g.ngay, g.tab,
    (case when g.ngay < date '2026-09-01' and g.kq = 'khong_dat' then 'dat' else g.kq end) as kq,
    (case when g.ngay < date '2026-09-01' then null else g.ly_do end) as ly_do
  from gay_adj g join nhan_su ns on ns.id = g.nhan_su_id
$$;
grant execute on function public.fn_gv_viec_thang(date, date) to authenticated;
revoke execute on function public.fn_gv_viec_thang(date, date) from anon;

create or replace function public.fn_ops_viec_thang(p_tu date, p_den date)
returns table (nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_viec text, ngay date, tab text, kq text, ly_do text)
language sql stable as $$
  with raw as (
    select o.nhan_su_id, o.ten_viec, o.ngay, o.tab, o.ref_key,
      case
        when o.dong_at is not null then case when o.dong_at <= o.han and o.chat_luong >= 80 then 'dat' else 'khong_dat' end
        when o.han < now() then 'khong_dat'
        else 'cho'
      end as kq_raw,
      case
        when o.dong_at is not null and o.chat_luong < 80 then 'chat_luong'
        when o.dong_at is not null and o.dong_at > o.han then 'tre'
        when o.dong_at is null and o.han < now() then 'no_qua_han'
        else null
      end as ly_do_raw
    from public.fn_viec_ops_thuong(p_tu, p_den, true) o
  ),
  gay_adj as (
    select r.nhan_su_id, r.ten_viec, r.ngay, r.tab,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
         (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
       else r.kq_raw end) as kq,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
         then null else r.ly_do_raw end) as ly_do
    from raw r
  )
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang, g.ten_viec, g.ngay, g.tab,
    (case when g.ngay < date '2026-09-01' and g.kq = 'khong_dat' then 'dat' else g.kq end) as kq,
    (case when g.ngay < date '2026-09-01' then null else g.ly_do end) as ly_do
  from gay_adj g join nhan_su ns on ns.id = g.nhan_su_id
$$;
grant execute on function public.fn_ops_viec_thang(date, date) to authenticated;
revoke execute on function public.fn_ops_viec_thang(date, date) from anon;
