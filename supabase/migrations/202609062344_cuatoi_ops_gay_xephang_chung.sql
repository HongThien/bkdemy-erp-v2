-- ============================================================================
-- 202609062344 — cuatoi_ops_gay_xephang_chung
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 06/09 tối, sau khi hỏi kỹ 3 vòng — xem chat):
--   ① App OPS chưa có "Của tôi" như TA/GV — thêm fn_ops_dashboard cùng khuôn,
--      phủ ĐỦ 4 việc: Điểm danh · Report+Báo tan · Prep phòng · Coi test đầu vào
--      (CEO: "đưa tất cả vào chứ" — điểm danh/test gắn theo NGƯỜI TRỰC CA, y hệt
--      report/tan, KHÔNG phải team-wide như tưởng ban đầu).
--   ② GẬY = THƯỚC ĐO DUY NHẤT của "không đạt chuẩn" do TRỄ HẠN (CEO): task có gậy
--      ĐANG HIỆU LỰC (đã chốt, chưa thu hồi) → không đạt; CHƯA chốt (đề xuất còn
--      'cho') hoặc đã BỎ QUA hoặc đã chốt-rồi-THU HỒI → đạt. Trước giờ 2 hệ
--      (fn_ta_dashboard/fn_gv_dashboard vs gay_de_xuat) tính ĐỘC LẬP — sửa gậy
--      không bao giờ cập nhật lại dashboard. Chỉ áp cho nhóm TRỄ HẠN (tre/
--      no_qua_han) — nhóm CHẤT LƯỢNG (chat_luong<80) giữ tính TRỰC TIẾP từ điểm
--      (CEO: "chất lượng thì chính là gậy thủ công rồi" — không auto-quét).
--   ③ XẾP HẠNG: đổi ngưỡng "vào bảng" — CHÍNH THỨC khi ≥20 việc đến hạn/tháng;
--      TẠM THỜI (chưa đủ 20, tháng đang chạy) khi khối lượng đang nằm TOP 10
--      người nhiều việc nhất pool đó (chặn "làm 1 việc 100% nhảy top 3"). Đo bằng
--      TỈ LỆ % đạt chuẩn (không phải đếm tuyệt đối). Áp CHO CẢ RIÊNG (cùng vai
--      trò TA/GV/OPS) LẪN CHUNG (toàn bộ nhân sự BK, gộp mọi vai trò 1 người có).
--      GV trước đây CHƯA có xếp hạng riêng — thêm mới cùng khuôn TA.
--   ④ Danh sách việc tháng: trả ĐỦ dat+khong_dat (không chỉ khongDat như cũ) để
--      UI làm accordion "cả hoàn thành và mắc lỗi, bấm mới xoè" (CEO).
--
-- KIẾN TRÚC (tránh 2 nơi giữ 1 công thức — CLAUDE §2.0):
--   fn_viec_buoi_thuong (đã có, thêm cột ref_key) + fn_viec_ops_thuong (MỚI, 4
--   việc OPS) = 2 NGUỒN DUY NHẤT của "việc nào, hạn bao nhiêu, ref_key gì".
--   fn_gay_dang_hieu_luc = NGUỒN DUY NHẤT của "gậy ref_key này còn hiệu lực không".
--   fn_ta_viec_thang / fn_gv_viec_thang / fn_ops_viec_thang = NGUỒN DUY NHẤT của
--   "1 việc đạt/không đạt chuẩn" (áp gậy-override) — fn_*_dashboard CHỈ tổng hợp
--   + xếp hạng từ đây, fn_xephang_chung gộp cả 3 lại. gay.ts (client) quét OPS
--   đọc THẲNG ref_key do fn_viec_ops_thuong trả (không tự ghép chuỗi lần 2).
--
-- MẤT GÌ (Luật xoá): KHÔNG xoá bảng/cột/dữ liệu nào. CREATE OR REPLACE
--   fn_viec_buoi_thuong (thêm 1 cột ref_key, giữ nguyên các cột cũ) + fn_ta_dashboard
--   + fn_gv_dashboard (đổi công thức đạt/không-đạt + ngưỡng xếp hạng — SỐ HIỂN THỊ
--   sẽ đổi cho các tháng có gậy được bỏ qua/thu hồi, đúng ý đồ). Toàn bộ phần còn
--   lại là hàm MỚI, không đụng gì đã có.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- A) HELPER dùng chung (thu trong tuần · ca trực theo giờ · người trực 1 ca)
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_thu_cua_ngay(p_ngay date)
returns smallint language sql immutable as $$
  select (case when extract(dow from p_ngay) = 0 then 8 else extract(dow from p_ngay) + 1 end)::smallint
$$;
comment on function public.fn_thu_cua_ngay(date) is 'Thu trong tuần theo quy ước TKB (CN=8, T2=2..T7=7).';

create or replace function public.fn_ca_cua_gio(p_gio time)
returns text language sql immutable as $$
  select case
    when p_gio >= '08:00' and p_gio < '12:00' then 'sang'
    when p_gio >= '14:00' and p_gio < '18:00' then 'chieu'
    when p_gio >= '18:00' and p_gio < '21:30' then 'toi'
    else null
  end
$$;
comment on function public.fn_ca_cua_gio(time) is
  'Ca trực OPS chứa giờ này (đồng bộ CA_TRUC_DEF trong opsvanhanh.ts — đổi giờ ca thì sửa CẢ 2 nơi). NULL = ngoài 3 ca.';

create or replace function public.fn_nguoi_truc_ca(p_thu smallint, p_ca text, p_ngay date)
returns uuid language sql stable as $$
  select nhan_su_id from phan_cong_ca
  where thu = p_thu and ca = p_ca and hieu_luc_tu <= p_ngay and (hieu_luc_den is null or hieu_luc_den >= p_ngay)
  limit 1
$$;
comment on function public.fn_nguoi_truc_ca(smallint, text, date) is
  'Người trực ca (thu, ca) vào 1 ngày cụ thể (resolve effective-date phan_cong_ca). NULL = chưa gán.';

-- ────────────────────────────────────────────────────────────────────────────
-- B) GẬY — nguồn DUY NHẤT trả lời "ref_key này còn gậy hiệu lực không". Hiệu lực
--    = đã CHỐT (có dòng gay_ledger, tất nhiên vì chỉ chốt mới đẻ ledger) VÀ CHƯA
--    bị thu hồi. Đề xuất còn 'cho' hoặc đã 'bo_qua' → KHÔNG có dòng ledger dương
--    ứng với ref_key đó → trả false → dashboard tính ĐẠT (CEO §2 ở trên).
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_gay_dang_hieu_luc(p_ref_key text)
returns boolean language sql stable as $$
  select exists (
    select 1 from gay_ledger gl
    where gl.ref_loai = 'vanhanh' and gl.ref_id = p_ref_key and gl.thu_hoi_at is null and gl.so_gay > 0
  )
$$;
comment on function public.fn_gay_dang_hieu_luc(text) is
  'true = ref_key này đang mang 1 gậy TỰ ĐỘNG hiệu lực (đã chốt, chưa thu hồi) — nguồn duy nhất cho "không đạt chuẩn do trễ hạn".';
grant execute on function public.fn_gay_dang_hieu_luc(text) to authenticated;
revoke execute on function public.fn_gay_dang_hieu_luc(text) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- C) fn_viec_buoi_thuong — THÊM cột ref_key (giữ NGUYÊN mọi cột + logic cũ từ
--    202609062312). ref_key khớp CHÍNH XÁC chuỗi gay.ts:quetGayTuDong đang ghép
--    tay (`vh:${buoiId}|${tab}|${nhanSuId}`) — có cột này rồi thì cả gay.ts lẫn
--    fn_ta_viec_thang/fn_gv_viec_thang đọc CHUNG 1 chỗ, không ai tự ghép chuỗi nữa.
-- ────────────────────────────────────────────────────────────────────────────
-- Thêm cột ref_key vào return table → Postgres coi là ĐỔI KIỂU TRẢ VỀ, phải drop trước khi tạo lại
-- (CREATE OR REPLACE không cho phép thêm/bớt cột của bảng trả về). Không mất gì: tạo lại NGAY sau đó,
-- cùng tên/tham số/permissions — không có khoảng hở nào gọi được hàm mà thiếu nó (cùng 1 transaction).
drop function if exists public.fn_viec_buoi_thuong(date, date, boolean);
create or replace function public.fn_viec_buoi_thuong(p_tu date default null, p_den date default null, p_tat_ca boolean default false)
returns table (
  nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date,
  vai text, tab text, dong_at timestamptz, han timestamptz, et_online boolean, ref_key text
)
language sql
stable
as $$
  with me as (select public.current_nhan_su_id() as id),
  b as (
    select bh.id, bh.lop_id, l.ten_lop, l.khoi, l.mon, bh.ngay, bh.gio_bat_dau,
           bh.ingame_dong_at, bh.et_dong_at, bh.danh_gia_xong_at, bh.btvn_dong_at, bh.mt_dong_at,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt,
           exists (select 1 from bai_test bt where bt.lop_id = bh.lop_id and bt.ngay = bh.ngay and bt.loai = 'et') as et_online
    from buoi_hoc bh
    join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and (p_tu is null or bh.ngay >= p_tu)
      and (p_den is null or bh.ngay <= p_den)
  ),
  thuong as (
    select pc.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           pc.vai_tro as vai, t.tab, b.gio_bat_dau, b.et_online,
           case t.tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at
                      when 'danhgia' then b.danh_gia_xong_at else b.btvn_dong_at end as dong_at,
           case pc.vai_tro when 'gv' then 1 else 2 end as uu_tien
    from b
    join phan_cong_lop pc on pc.lop_id = b.lop_id
    cross join lateral (
      select unnest(case pc.vai_tro when 'gv' then array['danhgia', 'ingame'] else array['ingame', 'et', 'btvn'] end) as tab
    ) t
    where not b.co_mt
  ),
  mt_tk as (
    select pk.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'tk'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 0 as uu_tien
    from b
    join phan_cong_khoi pk on pk.khoi = b.khoi and pk.mon = b.mon
    where b.co_mt
  ),
  mt_gv as (
    select pc.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'gv'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 1 as uu_tien
    from b
    join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.vai_tro = 'gv'
    where b.co_mt
      and not exists (select 1 from mt_tk k where k.buoi_id = b.id)
      and (pc.la_chinh or not exists (
            select 1 from phan_cong_lop p2 where p2.lop_id = b.lop_id and p2.vai_tro = 'gv' and p2.la_chinh))
  ),
  tat_ca as (
    select * from thuong union all select * from mt_tk union all select * from mt_gv
  ),
  dedup as (
    select distinct on (nhan_su_id, buoi_id, tab) *
    from tat_ca
    order by nhan_su_id, buoi_id, tab, uu_tien
  )
  select d.nhan_su_id, d.buoi_id, d.lop_id, d.ten_lop, d.ngay, d.vai, d.tab, d.dong_at,
         public.fn_han_viec(d.lop_id, d.ngay, d.gio_bat_dau, d.tab) as han, d.et_online,
         ('vh:' || d.buoi_id::text || '|' || d.tab || '|' || d.nhan_su_id::text) as ref_key
  from dedup d, me
  where p_tat_ca or d.nhan_su_id = me.id
$$;
comment on function public.fn_viec_buoi_thuong(date, date, boolean) is
  'Việc nhân sự trên buổi thường (pure-derive). vai gv/tg theo phan_cong_lop; buổi có MT chỉ 1 việc mt: vai tk (phan_cong_khoi khối×môn) → fallback gv lớp (la_chinh ưu tiên). han = fn_han_viec. ref_key = khoá gậy tự động (vh:buoi|tab|nhansu). p_tat_ca=false → chỉ người đang đăng nhập.';
grant execute on function public.fn_viec_buoi_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_buoi_thuong(date, date, boolean) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- D) fn_viec_ops_thuong — NGUỒN DUY NHẤT 4 việc OPS (report/tan/prep/test), y hệt
--    vai trò fn_viec_buoi_thuong bên TA/GV. Điểm danh KHÔNG đẻ việc riêng — bản
--    chất là "Báo tan" (tan = đóng buổi + hoàn tất điểm danh, đã dùng chung
--    deadline gio_ket_thuc+15p) nên KHÔNG trùng lặp việc; CEO xác nhận điểm danh
--    "gắn theo ops trực ca" = ĐÚNG NGƯỜI đang chịu trách nhiệm "tan" của buổi đó.
--    Report/Báo tan/Prep: công thức sở hữu + hạn COPY NGUYÊN từ opsvanhanh.ts
--    (getMyOpsTasks/luotPrepCuaKhoang/prepCuaThoiGian) — đổi 1 bên phải đổi cả 2
--    (chưa gộp về 1 nguồn được vì TS bên kia còn phục vụ UI "Hôm nay" query theo
--    NGƯỜI ĐANG ĐĂNG NHẬP, khác nhu cầu p_tat_ca=true ở đây).
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_viec_ops_thuong(p_tu date, p_den date, p_tat_ca boolean default false)
returns table (
  nhan_su_id uuid, ten_viec text, ngay date, tab text,
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
    (gs.ngay - 1) as ngay, 'ops_report'::text as tab,
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
    gs.ngay, 'ops_tan'::text as tab,
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
phong_list as (select phong from (values ('101'), ('102'), ('201'), ('202'), ('301'), ('302'), ('303')) as x(phong)),
ca_list as (select luot, gio_dau from (values ('sang', '08:00'::time), ('chieu', '14:00'::time), ('toi', '18:00'::time)) as x(luot, gio_dau)),
prep_rows as (
  select public.fn_nguoi_truc_ca(public.fn_thu_cua_ngay(gs.ngay), c.luot, gs.ngay) as nhan_su_id,
    ('Prep phòng ' || p.phong || ' (' || c.luot || ')') as ten_viec,
    gs.ngay, 'ops_prep'::text as tab,
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
    ct.ngay, 'ops_test'::text as tab,
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
  union all select * from prep_rows
  union all select * from test_rows
)
select d.nhan_su_id, d.ten_viec, d.ngay, d.tab, d.dong_at, d.han, d.chat_luong, d.ref_key
from tat_ca d, me
where d.nhan_su_id is not null
  and d.ngay between p_tu and p_den
  and (p_tat_ca or d.nhan_su_id = me.id)
$$;
comment on function public.fn_viec_ops_thuong(date, date, boolean) is
  'Việc nhân sự OPS (report/báo tan/prep/coi test đầu vào), pure-derive. Sở hữu = NGƯỜI TRỰC CA (phan_cong_ca) đúng ngày×ca của từng việc — điểm danh không tách việc riêng, tính chung vào "tan". ref_key = khoá gậy tự động, cùng quy ước vh:...|tab|nhansu như fn_viec_buoi_thuong (namespace ops: phân biệt nguồn).';
grant execute on function public.fn_viec_ops_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_ops_thuong(date, date, boolean) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- E) fn_ta_viec_thang / fn_gv_viec_thang / fn_ops_viec_thang — 1 VIỆC = 1 DÒNG,
--    kq đã áp gậy-override (chỉ nhóm tre/no_qua_han) + an_xep_hang đi kèm để nơi
--    gọi lọc xếp hạng mà không phải join lại nhan_su. Đây là NGUỒN DUY NHẤT của
--    "task này đạt hay không đạt chuẩn" — dashboard + xếp hạng chung đều đọc đây.
-- ────────────────────────────────────────────────────────────────────────────
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
  )
  select r.nhan_su_id, ns.ho_ten, ns.an_xep_hang, r.ten_lop, r.ngay, r.tab,
    (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
       (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
     else r.kq_raw end) as kq,
    (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
       then null else r.ly_do_raw end) as ly_do
  from raw r join nhan_su ns on ns.id = r.nhan_su_id
$$;
comment on function public.fn_ta_viec_thang(date, date) is
  '1 việc TA (ingame/et/btvn) = 1 dòng, kq đạt/không_đạt/cho — nhóm trễ hạn áp gậy-override (fn_gay_dang_hieu_luc), nhóm chất lượng giữ nguyên trực tiếp từ điểm duyệt.';
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
  )
  select r.nhan_su_id, ns.ho_ten, ns.an_xep_hang, r.ten_lop, r.ngay, r.tab,
    (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
       (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
     else r.kq_raw end) as kq,
    (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
       then null else r.ly_do_raw end) as ly_do
  from raw r join nhan_su ns on ns.id = r.nhan_su_id
$$;
comment on function public.fn_gv_viec_thang(date, date) is
  '1 việc GV (đánh giá + chấm bài + Chấm MT fallback) = 1 dòng, kq áp gậy-override như fn_ta_viec_thang.';
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
  )
  select r.nhan_su_id, ns.ho_ten, ns.an_xep_hang, r.ten_viec, r.ngay, r.tab,
    (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
       (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
     else r.kq_raw end) as kq,
    (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
       then null else r.ly_do_raw end) as ly_do
  from raw r join nhan_su ns on ns.id = r.nhan_su_id
$$;
comment on function public.fn_ops_viec_thang(date, date) is
  '1 việc OPS (report/tan/prep/test) = 1 dòng, kq áp gậy-override như fn_ta_viec_thang; chất lượng <80 (report/tan/prep) giữ trực tiếp, không qua gậy.';
grant execute on function public.fn_ops_viec_thang(date, date) to authenticated;
revoke execute on function public.fn_ops_viec_thang(date, date) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- F) DASHBOARD (TA/GV/OPS) — cùng khuôn: bar cá nhân · 4 số · xếp hạng RIÊNG
--    (ngưỡng ≥20 việc CHÍNH THỨC hoặc TOP 10 khối lượng TẠM THỜI) · items đầy đủ
--    (dat+khong_dat, UI tự làm accordion).
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_ta_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_cl constant numeric := 80;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _ta_items on commit drop as
  select * from public.fn_ta_viec_thang(v_tu, v_den);

  create temp table _ta_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _ta_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (pct = 100 and den_han >= c_nguong_rank_final) as dat_moc_thuong,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _ta_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _ta_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ta_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _ta_tk
        where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)
        order by pct desc, dat desc, ho_ten limit 3) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_lop, ngay, tab, kq, ly_do from _ta_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 100) x;

  drop table _ta_items, _ta_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongChatLuong', c_nguong_cl,
    'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
grant execute on function public.fn_ta_dashboard(text) to authenticated;
revoke execute on function public.fn_ta_dashboard(text) from anon;

create or replace function public.fn_gv_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _gv_items on commit drop as
  select * from public.fn_gv_viec_thang(v_tu, v_den);

  create temp table _gv_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _gv_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _gv_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _gv_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _gv_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _gv_tk
        where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)
        order by pct desc, dat desc, ho_ten limit 3) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_lop, ngay, tab, kq, ly_do from _gv_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 100) x;

  drop table _gv_items, _gv_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
grant execute on function public.fn_gv_dashboard(text) to authenticated;
revoke execute on function public.fn_gv_dashboard(text) from anon;

create or replace function public.fn_ops_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_cl constant numeric := 80;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _ops_items on commit drop as
  select * from public.fn_ops_viec_thang(v_tu, v_den);

  create temp table _ops_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _ops_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _ops_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _ops_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ops_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _ops_tk
        where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)
        order by pct desc, dat desc, ho_ten limit 3) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_viec, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_viec, ngay, tab, kq, ly_do from _ops_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 200) x;

  drop table _ops_items, _ops_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongChatLuong', c_nguong_cl,
    'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
comment on function public.fn_ops_dashboard(text) is
  'Của tôi — app OPS. 4 việc: report/báo tan/prep/coi test. Cùng khuôn fn_ta_dashboard (bar+4số+xếp hạng riêng+items).';
grant execute on function public.fn_ops_dashboard(text) to authenticated;
revoke execute on function public.fn_ops_dashboard(text) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- G) XẾP HẠNG CHUNG (toàn bộ nhân sự BK, gộp mọi vai trò 1 người đang có) — % đạt
--    chuẩn, cùng ngưỡng ≥20 CHÍNH THỨC / TOP 10 khối lượng TẠM THỜI. Gộp 3 nguồn
--    fn_*_viec_thang (đã áp gậy-override) — 1 người vừa TA vừa GV thì CỘNG dat/
--    den_han của cả 2 vai trước khi tính %.
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_xephang_chung(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _chung_tk on commit drop as
  with gop as (
    select nhan_su_id, kq from public.fn_ta_viec_thang(v_tu, v_den)
    union all
    select nhan_su_id, kq from public.fn_gv_viec_thang(v_tu, v_den)
    union all
    select nhan_su_id, kq from public.fn_ops_viec_thang(v_tu, v_den)
  )
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ns.ho_ten) as vol_rank
  from gop g join nhan_su ns on ns.id = g.nhan_su_id
  group by g.nhan_su_id, ns.ho_ten, ns.an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select den_han, dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _chung_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _chung_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _chung_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _chung_tk
        where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)
        order by pct desc, dat desc, ho_ten limit 3) t;

  drop table _chung_tk;
  return jsonb_build_object('ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
comment on function public.fn_xephang_chung(text) is
  'Bảng xếp hạng CHUNG toàn công ty (mọi vai trò TA/GV/OPS gộp lại theo nhan_su_id) — % đạt chuẩn, ngưỡng ≥20 việc/tháng CHÍNH THỨC hoặc TOP 10 khối lượng TẠM THỜI.';
grant execute on function public.fn_xephang_chung(text) to authenticated;
revoke execute on function public.fn_xephang_chung(text) from anon;
