-- ============================================================================
-- 202609070046 — ops_gop_task_theo_ca
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 07/09 sáng, sau khi thấy Quỳnh Trang 79 task/tháng chỉ vì
-- trực vài ca): 1 ca OPS đang tính N việc (1/lớp report, 1/lớp báo tan, 1/phòng
-- prep) — nhiều gấp chục lần 1 buổi TA/GV. CEO chốt gộp: MỖI LOẠI VIỆC TRONG 1
-- CA = ĐÚNG 1 TASK (report tối nay = 1 task dù báo mấy lớp; điểm danh cả ca =
-- 1 task; báo tan cả ca = 1 task; prep 7 phòng = 1 task). Đạt/không đạt của cả
-- nhóm: CEO chốt ngưỡng ≥90% mục trong nhóm đạt thì tính nhóm ĐẠT (hạ chuẩn có
-- chủ đích để tập huấn giai đoạn đầu, sẽ siết dần — KHÔNG phải "1 lỗi = sập
-- nhóm" như đề xuất ban đầu của Claude).
-- ĐIỂM DANH tách hẳn khỏi "Báo tan" (CEO: "2 việc khác nhau mà") — trước đó gộp
-- nhầm vì tưởng cùng 1 hành động; giờ thêm nguồn riêng (buoi_hoc_hs.diem_danh).
--   ⚠ GIỚI HẠN DỮ LIỆU đã nói trước với CEO: buoi_hoc_hs KHÔNG có cột thời điểm
--   điểm danh (chỉ có diem_danh có/không) — nên "điểm danh" chỉ biết ĐÃ XONG hay
--   CHƯA tại thời điểm xem, KHÔNG phân biệt được "xong đúng giờ" hay "xong rất
--   trễ nhưng cuối cùng cũng xong". Muốn chính xác tuyệt đối cần migration thêm
--   cột timestamp — chưa làm vì ngoài phạm vi yêu cầu lần này.
--
-- KIẾN TRÚC:
--   fn_viec_ops_thuong (SỬA — thêm cột `ca` + nguồn điểm danh riêng, vẫn là
--   RAW theo TỪNG lớp/phòng — không đổi đơn vị ở đây, giữ cho chỗ khác còn
--   dùng được nếu cần chi tiết).
--   fn_ops_viec_nhom_thang (MỚI) — gộp raw theo (nhan_su, ngay, ca, loại việc)
--   thành 1 dòng/nhóm, tính % đạt trong nhóm, sinh ref_key MỚI theo NHÓM (không
--   phải theo từng lớp/phòng nữa) — đây là điểm mấu chốt: gậy tự động và
--   dashboard giờ nói cùng 1 thứ tiếng (1 nhóm = 1 ref_key = 1 quyết định gậy).
--   fn_ops_viec_thang (SỬA — đọc từ fn_ops_viec_nhom_thang thay vì raw) — áp
--   gậy-override + ân xá trước 01/09, giữ NGUYÊN chữ ký/cột trả về nên
--   fn_ops_dashboard/fn_xephang_chung KHÔNG cần sửa gì thêm.
--   gay.ts (client) — quét OPS đổi sang đọc fn_ops_viec_nhom_thang (nhóm),
--   KHÔNG còn đề xuất theo từng lớp/phòng nữa.
--
-- ĐƠN GIẢN HOÁ CHỦ ĐỘNG (nói rõ, không giấu): gậy-override cho OPS giờ áp
-- đồng loạt cho MỌI nhóm không đạt (không tách trễ-hạn/chất-lượng như TA/GV
-- nữa) — vì 1 nhóm có thể vừa có mục trễ vừa có mục chất lượng kém, tách theo
-- lý do ở cấp NHÓM không còn ý nghĩa rõ ràng như ở cấp TỪNG VIỆC.
--
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. fn_viec_ops_thuong đổi cột trả về
-- (thêm `ca`) → phải DROP rồi tạo lại (cùng lý do kỹ thuật như fn_viec_buoi_thuong
-- ở migration trước). gay_de_xuat/gay_ledger cũ (theo từng lớp/phòng, ref_key
-- cũ dạng "vh:ops:<tkb>@<ngay>|...") vẫn nằm nguyên trong DB làm vết lịch sử —
-- chỉ là KHÔNG còn khớp với ref_key nhóm mới nên không ảnh hưởng tính toán
-- dashboard nữa (coi như đã "mồ côi" nhưng vô hại, không cần dọn).
-- ============================================================================

drop function if exists public.fn_viec_ops_thuong(date, date, boolean);
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
-- ĐIỂM DANH (mới, tách khỏi Báo tan — CEO 07/09 "2 việc khác nhau"). Nguồn: buoi_hoc_hs.diem_danh —
-- KHÔNG có cột thời điểm nên dong_at chỉ là XẤP XỈ (= han khi đã xong đủ, null khi chưa) để tái dùng
-- đúng công thức dong_at<=han có sẵn — không phân biệt được "xong đúng giờ" hay "xong rất trễ".
diemdanh_rows as (
  select public.fn_nguoi_truc_ca(t.thu, public.fn_ca_cua_gio(t.gio_bat_dau), gs.ngay) as nhan_su_id,
    ('Điểm danh — ' || t.ten_lop) as ten_viec,
    gs.ngay, public.fn_ca_cua_gio(t.gio_bat_dau) as ca, 'ops_diemdanh'::text as tab,
    (case when dd.tong > 0 and dd.da_danh >= dd.tong
       then (((gs.ngay)::text || ' ' || t.gio_ket_thuc::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '15 minutes'
       else null end) as dong_at,
    100::numeric as chat_luong,
    (((gs.ngay)::text || ' ' || t.gio_ket_thuc::text)::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '15 minutes' as han,
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
  'RAW từng lớp/phòng (report/tan/điểm danh/prep/coi test), pure-derive — nguồn cho fn_ops_viec_nhom_thang gộp lại. KHÔNG dùng trực tiếp cho dashboard/gậy nữa (dùng bản đã gộp).';
grant execute on function public.fn_viec_ops_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_ops_thuong(date, date, boolean) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- fn_ops_viec_nhom_thang — GỘP raw theo (người, ngày, ca, loại việc) = 1 NHÓM =
-- 1 TASK (CEO 07/09). Đạt khi ≥90% mục trong nhóm đạt (hằng số CHỈNH Ở ĐÂY —
-- hạ chuẩn có chủ đích để tập huấn, sẽ siết dần theo thời gian). ref_key MỚI
-- theo NHÓM — gậy tự động (gay.ts) và dashboard đọc CHUNG 1 khoá này.
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_ops_viec_nhom_thang(p_tu date, p_den date, p_tat_ca boolean default false)
returns table (nhan_su_id uuid, ten_viec text, ngay date, tab text, kq_raw text, so_dat integer, so_tong integer, han timestamptz, ref_key text)
language sql stable as $$
  with raw as (
    select o.nhan_su_id, o.ngay, o.ca, o.tab, o.han,
      (o.dong_at is not null and o.dong_at <= o.han and o.chat_luong >= 80) as dat
    from public.fn_viec_ops_thuong(p_tu, p_den, p_tat_ca) o
  ),
  nhom as (
    select nhan_su_id, tab, ngay as g_ngay, ca as g_ca,
      count(*) as so_tong, count(*) filter (where dat) as so_dat, max(han) as han
    from raw
    group by nhan_su_id, tab, ngay, ca
  )
  select n.nhan_su_id,
    (case n.tab
       when 'ops_report' then 'Report tối ' || to_char(n.g_ngay, 'DD/MM')
       when 'ops_diemdanh' then 'Điểm danh (ca ' || n.g_ca || ') ' || to_char(n.g_ngay, 'DD/MM')
       when 'ops_tan' then 'Báo tan (ca ' || n.g_ca || ') ' || to_char(n.g_ngay, 'DD/MM')
       when 'ops_prep' then 'Prep phòng (ca ' || n.g_ca || ') ' || to_char(n.g_ngay, 'DD/MM')
       else 'Coi test đầu vào (ca ' || n.g_ca || ') ' || to_char(n.g_ngay, 'DD/MM')
     end || ' — ' || n.so_dat || '/' || n.so_tong) as ten_viec,
    n.g_ngay as ngay, n.tab,
    (case when n.han > now() then 'cho'
          when n.so_dat::numeric / n.so_tong >= 0.9 then 'dat'
          else 'khong_dat' end) as kq_raw,
    n.so_dat, n.so_tong, n.han,
    ('vh:ops:grp:' || n.tab || '|' || n.g_ngay::text || coalesce('@' || n.g_ca, '') || '|' || n.nhan_su_id::text) as ref_key
  from nhom n
$$;
comment on function public.fn_ops_viec_nhom_thang(date, date, boolean) is
  'Nhóm việc OPS theo (người, ngày, ca, loại việc) = 1 task/nhóm (CEO 07/09). Đạt khi ≥90% mục trong nhóm đạt (ngưỡng tạm, sẽ siết dần). kq_raw CHƯA áp gậy — dùng cho cả dashboard (qua fn_ops_viec_thang) lẫn quét gậy tự động (gay.ts đọc trực tiếp hàm này).';
grant execute on function public.fn_ops_viec_nhom_thang(date, date, boolean) to authenticated;
revoke execute on function public.fn_ops_viec_nhom_thang(date, date, boolean) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- fn_ops_viec_thang — đọc từ bản ĐÃ GỘP thay vì raw. GIỮ NGUYÊN chữ ký + cột
-- trả về như trước (nhan_su_id, ho_ten, an_xep_hang, ten_viec, ngay, tab, kq,
-- ly_do) nên fn_ops_dashboard/fn_xephang_chung KHÔNG cần sửa. Đơn giản hoá:
-- gậy-override áp cho MỌI nhóm không đạt (không tách trễ/chất lượng — xem lý
-- do ở đầu file). ly_do giờ là mô tả "x/y không đạt" thay vì mã tre/chat_luong.
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_ops_viec_thang(p_tu date, p_den date)
returns table (nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_viec text, ngay date, tab text, kq text, ly_do text)
language sql stable as $$
  with g as (
    select * from public.fn_ops_viec_nhom_thang(p_tu, p_den, true)
  ),
  adj as (
    select g.nhan_su_id, g.ten_viec, g.ngay, g.tab, g.so_dat, g.so_tong,
      (case when g.kq_raw = 'khong_dat' then
         (case when public.fn_gay_dang_hieu_luc(g.ref_key) then 'khong_dat' else 'dat' end)
       else g.kq_raw end) as kq
    from g
  ),
  final as (
    select a.nhan_su_id, a.ten_viec, a.ngay, a.tab, a.so_dat, a.so_tong,
      (case when a.ngay < date '2026-09-01' and a.kq = 'khong_dat' then 'dat' else a.kq end) as kq
    from adj a
  )
  select f.nhan_su_id, ns.ho_ten, ns.an_xep_hang, f.ten_viec, f.ngay, f.tab, f.kq,
    (case when f.kq <> 'khong_dat' then null else (f.so_tong - f.so_dat) || '/' || f.so_tong || ' không đạt' end) as ly_do
  from final f join nhan_su ns on ns.id = f.nhan_su_id
$$;
grant execute on function public.fn_ops_viec_thang(date, date) to authenticated;
revoke execute on function public.fn_ops_viec_thang(date, date) from anon;
