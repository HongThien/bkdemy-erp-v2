-- ============================================================================
-- 202609070054 — diemdanh_han_45p_sau_bat_dau
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 07/09): hạn ĐIỂM DANH đổi từ "giờ kết thúc buổi +15p" (copy
-- tạm từ Báo tan lúc mới tách) sang ĐÚNG bản chất riêng của nó — điểm danh phải
-- làm ĐẦU giờ, không phải cuối giờ: hạn = giờ BẮT ĐẦU ca học + 45 phút.
-- Báo tan/Report giữ nguyên hạn cũ (không đụng).
--
-- MẤT GÌ (Luật xoá): không xoá gì — CREATE OR REPLACE fn_viec_ops_thuong, GIỮ
-- NGUYÊN chữ ký + cột trả về (không cần drop như 2 lần trước), chỉ sửa công
-- thức `han` trong CTE diemdanh_rows.
-- ============================================================================

create or replace function public.fn_viec_ops_thuong(p_tu date, p_den date, p_tat_ca boolean default false)
returns table (
  nhan_su_id uuid, ten_viec text, ngay date, ca text, tab text,
  dong_at timestamptz, han timestamptz, chat_luong numeric, ref_key text
)
language sql
stable
as $$
with me as (select public.current_nhan_su_id() as id),
gs as (select d::date as ngay from generate_series(p_tu - 1, p_den + 1, interval '1 day') d),
tkb as (
  select t.id, t.lop_id, l.ten_lop, t.thu, t.gio_bat_dau, t.gio_ket_thuc, t.hieu_luc_tu, t.hieu_luc_den, l.ngay_khai_giang
  from thoi_khoa_bieu t join lop l on l.id = t.lop_id
),
report_rows as (
  select public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(gs.ngay - 1), 'toi', gs.ngay - 1) as nhan_su_id,
    ('Report — ' || t.ten_lop) as ten_viec,
    (gs.ngay - 1) as ngay, 'toi'::text as ca, 'ops_report'::text as tab,
    ot.dong_at, ot.chat_luong,
    ((gs.ngay - 1)::text || ' 20:00')::timestamp at time zone 'Asia/Ho_Chi_Minh' as han,
    ('vh:ops:' || t.id::text || '@' || (gs.ngay - 1)::text || '|ops_report|' ||
      coalesce(public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(gs.ngay - 1), 'toi', gs.ngay - 1)::text, 'x')) as ref_key
  from gs
  join tkb t on t.thu = public.fn_thu_cua_ngay(gs.ngay)
    and t.hieu_luc_tu <= gs.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= gs.ngay)
    and (t.ngay_khai_giang is null or t.ngay_khai_giang <= gs.ngay)
  left join vh_ops_task ot on ot.tkb_id = t.id and ot.ngay = gs.ngay - 1 and ot.tab = 'report'
),
tan_rows as (
  select public.fn_nguoi_truc_ca(t.thu, public.fn_ca_cua_gio(t.gio_bat_dau), gs.ngay) as nhan_su_id,
    ('Báo tan — ' || t.ten_lop) as ten_viec,
    gs.ngay, public.fn_ca_cua_gio(t.gio_bat_dau) as ca, 'ops_tan'::text as tab,
    ot.dong_at, ot.chat_luong,
    (((gs.ngay)::text || ' ' || t.gio_ket_thuc::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '15 minutes' as han,
    ('vh:ops:' || t.id::text || '@' || gs.ngay::text || '|ops_tan|' ||
      coalesce(public.fn_nguoi_truc_ca(t.thu, public.fn_ca_cua_gio(t.gio_bat_dau), gs.ngay)::text, 'x')) as ref_key
  from gs
  join tkb t on t.thu = public.fn_thu_cua_ngay(gs.ngay)
    and t.hieu_luc_tu <= gs.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= gs.ngay)
    and (t.ngay_khai_giang is null or t.ngay_khai_giang <= gs.ngay)
    and public.fn_ca_cua_gio(t.gio_bat_dau) is not null
  left join vh_ops_task ot on ot.tkb_id = t.id and ot.ngay = gs.ngay and ot.tab = 'tan'
),
-- ĐIỂM DANH — hạn = giờ BẮT ĐẦU ca học + 45 phút (CEO 07/09, đổi khỏi "giờ kết thúc +15p"
-- copy tạm từ Báo tan lúc mới tách — điểm danh phải làm ĐẦU giờ, không phải cuối giờ).
-- dong_at vẫn là XẤP XỈ (= han khi đã điểm danh đủ, null khi chưa) — buoi_hoc_hs không có
-- cột thời điểm nên không phân biệt được "xong đúng giờ" hay "xong rất trễ" (đã báo CEO).
diemdanh_rows as (
  select public.fn_nguoi_truc_ca(t.thu, public.fn_ca_cua_gio(t.gio_bat_dau), gs.ngay) as nhan_su_id,
    ('Điểm danh — ' || t.ten_lop) as ten_viec,
    gs.ngay, public.fn_ca_cua_gio(t.gio_bat_dau) as ca, 'ops_diemdanh'::text as tab,
    (case when dd.tong > 0 and dd.da_danh >= dd.tong
       then (((gs.ngay)::text || ' ' || t.gio_bat_dau::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '45 minutes'
       else null end) as dong_at,
    100::numeric as chat_luong,
    (((gs.ngay)::text || ' ' || t.gio_bat_dau::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '45 minutes' as han,
    ('vh:ops:' || bh.id::text || '|ops_diemdanh|' ||
      coalesce(public.fn_nguoi_truc_ca(t.thu, public.fn_ca_cua_gio(t.gio_bat_dau), gs.ngay)::text, 'x')) as ref_key
  from gs
  join tkb t on t.thu = public.fn_thu_cua_ngay(gs.ngay)
    and t.hieu_luc_tu <= gs.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= gs.ngay)
    and (t.ngay_khai_giang is null or t.ngay_khai_giang <= gs.ngay)
    and public.fn_ca_cua_gio(t.gio_bat_dau) is not null
  join buoi_hoc bh on bh.lop_id = t.lop_id and bh.ngay = gs.ngay and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
  left join lateral (
    select count(*) as tong, count(*) filter (where diem_danh is not null) as da_danh
    from buoi_hoc_hs where buoi_hoc_id = bh.id
  ) dd on true
),
phong_list as (select phong from (values ('101'), ('102'), ('201'), ('202'), ('301'), ('302'), ('303')) as x(phong)),
ca_list as (select luot, gio_dau from (values ('sang', '08:00'::time), ('chieu', '14:00'::time), ('toi', '18:00'::time)) as x(luot, gio_dau)),
prep_rows as (
  select public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(gs.ngay), c.luot, gs.ngay) as nhan_su_id,
    ('Prep phòng ' || p.phong || ' (' || c.luot || ')') as ten_viec,
    gs.ngay, c.luot as ca, 'ops_prep'::text as tab,
    pp.dong_at, coalesce(pp.gv_diem_nen, 100) as chat_luong,
    (case when c.luot = 'toi'
       then ((gs.ngay::text || ' ' || c.gio_dau::text)::timestamp at time zone 'Asia/Ho_Chi_Minh')
       else ((gs.ngay::text || ' ' || c.gio_dau::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') - interval '30 minutes'
     end) as han,
    ('vh:ops:' || p.phong || '@' || gs.ngay::text || '@' || c.luot || '|ops_prep|' ||
      coalesce(public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(gs.ngay), c.luot, gs.ngay)::text, 'x')) as ref_key
  from gs cross join phong_list p cross join ca_list c
  left join prep_phong pp on pp.phong = p.phong and pp.ngay = gs.ngay and pp.luot = c.luot
),
test_rows as (
  select public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(ct.ngay), public.fn_ca_cua_gio(ct.gio_bat_dau), ct.ngay) as nhan_su_id,
    ('Coi test đầu vào — ' || ct.mon) as ten_viec,
    ct.ngay, public.fn_ca_cua_gio(ct.gio_bat_dau) as ca, 'ops_test'::text as tab,
    ct.hoan_thanh_at as dong_at, 100::numeric as chat_luong,
    (((ct.ngay::text || ' ' || ct.gio_bat_dau::text)::timestamp at time zone 'Asia/Ho_Chi_Minh')
      + (ct.thoi_luong_phut || ' minutes')::interval + interval '15 minutes') as han,
    ('vh:ops:' || ct.id::text || '|ops_test|' ||
      coalesce(public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(ct.ngay), public.fn_ca_cua_gio(ct.gio_bat_dau), ct.ngay)::text, 'x')) as ref_key
  from ca_test ct
),
tat_ca as (
  select * from report_rows
  union all select * from tan_rows
  union all select * from diemdanh_rows
  union all select * from prep_rows
  union all select * from test_rows
)
select d.nhan_su_id, d.ten_viec, d.ngay, d.ca, d.tab, d.dong_at, d.han, d.chat_luong, d.ref_key
from tat_ca d, me
where d.nhan_su_id is not null
  and d.ngay between p_tu and p_den
  and (p_tat_ca or d.nhan_su_id = me.id)
$$;
comment on function public.fn_viec_ops_thuong(date, date, boolean) is
  'RAW từng lớp/phòng (report/tan/điểm danh/prep/coi test), pure-derive — nguồn cho fn_ops_viec_nhom_thang gộp lại. Điểm danh hạn = giờ bắt đầu ca +45p (CEO 07/09). KHÔNG dùng trực tiếp cho dashboard/gậy nữa (dùng bản đã gộp).';
grant execute on function public.fn_viec_ops_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_ops_thuong(date, date, boolean) from anon;
