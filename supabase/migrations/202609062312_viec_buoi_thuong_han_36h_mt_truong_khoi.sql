-- ============================================================================
-- 202609062312 — viec_buoi_thuong_han_36h_mt_truong_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 06/09 tối):
--   ① Hạn "Đánh giá buổi học" + "Chấm bài trên lớp" (+ Chấm ET) = 36 GIỜ kể từ
--      GIỜ BẮT ĐẦU buổi. Trước: 23:59 ngày buổi (client) / 00:00 hôm sau (DB) /
--      ET 12h trưa hôm sau (client) / ET = han_nop_bai_test (DB) — 4 chỗ, 2 chuẩn.
--   ② MT KHÔNG gán mặc định cho TA lớp nữa ("MT là việc quan trọng") → gán cho
--      TRƯỞNG KHỐI (phan_cong_khoi theo khối × môn, mig 202609062311). Không có
--      trưởng khối cho (khối, môn) đó → về GV phụ trách lớp (GV chính nếu có, không
--      có chính thì mọi GV). Hạn MT = 72 GIỜ kể từ giờ bắt đầu ca thi (= giờ bắt
--      đầu buổi — MT là phase của buổi thường, không có bảng ca thi riêng).
--   ③ Công thức deadline + owner task từ nay CHỈ 1 NƠI (§2.0): `fn_han_viec` (hạn)
--      + `fn_viec_buoi_thuong` (derive task buổi thường cho GV/TA/trưởng khối).
--      Client getMyTasks/listAllStaffTasks + fn_ta_dashboard/fn_gv_dashboard đều
--      đọc từ đây — hết cảnh app và KPI tháng chấm "trễ" theo 2 chuẩn khác nhau.
--   ④ Tiện thể sửa drift đã thấy: `buoi_ke_tiep` (DB) KHÔNG né buổi đã HUỶ ad-hoc
--      + không xét ngay_khai_giang — client caTiepTheo đã fix 07-19, DB chưa. Hệ
--      quả cũ: hạn BTVN (cả HS lẫn TA) tính theo buổi đã huỷ, ngắn vô lý.
--
--   Anchor giờ bắt đầu: buoi_hoc.gio_bat_dau (662/663 buổi có) → thiếu thì tra
--   thoi_khoa_bieu → vẫn thiếu thì 00:00 ngày buổi (hạn ngắn hơn, không phải dài
--   hơn — an toàn về phía kỷ luật).
--
--   KPI: MT rời khỏi fn_ta_dashboard (không còn là việc TA). GV nhận MT fallback
--   thì MT vào fn_gv_dashboard (task list = KPI, 1 nguồn). Trưởng khối chưa có
--   dashboard riêng — MT của họ chỉ hiện ở Việc của tôi + Chất lượng vận hành.
--
-- MẤT GÌ (Luật xoá): không xoá dữ liệu/bảng. CREATE OR REPLACE 4 hàm cùng chữ ký
--   (buoi_ke_tiep, fn_ta_dashboard, fn_gv_dashboard) + 2 hàm mới. Không overload.
-- ============================================================================

-- ④ buoi_ke_tiep: né buổi đã huỷ + chưa khai giảng (cùng luật với client caTiepTheo 07-19)
create or replace function public.buoi_ke_tiep(p_lop uuid, p_tu date)
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
  and not exists (
    select 1 from buoi_hoc bh
    where bh.lop_id = p_lop and bh.ngay = d::date and bh.loai = 'thuong' and bh.trang_thai = 'huy'
  )
  and coalesce((select l.ngay_khai_giang from lop l where l.id = p_lop), d::date) <= d::date
  order by d
  limit 1
$$;
comment on function public.buoi_ke_tiep(uuid, date) is
  'Ngày buổi học kế tiếp của lớp theo TKB, BỎ QUA ngày có buổi thường đã huỷ và ngày trước khai giảng. NULL = không thấy trong 60 ngày.';

-- ① hạn của 1 việc nhân sự trên buổi thường — NGUỒN DUY NHẤT
create or replace function public.fn_han_viec(p_lop uuid, p_ngay date, p_gio_bat_dau time, p_tab text)
returns timestamptz
language plpgsql
stable
as $$
declare
  v_gio time := p_gio_bat_dau;
  v_bat timestamptz;
begin
  if p_tab = 'btvn' then return public.han_nop_bai_test(p_lop, p_ngay, 'btvn'); end if;
  if p_tab not in ('ingame', 'danhgia', 'et', 'mt') then return null; end if;
  if v_gio is null then
    select t.gio_bat_dau into v_gio
    from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from p_ngay) = 0 then 8 else extract(dow from p_ngay) + 1 end)
      and t.hieu_luc_tu <= p_ngay
      and (t.hieu_luc_den is null or p_ngay <= t.hieu_luc_den)
    order by t.gio_bat_dau asc
    limit 1;
  end if;
  v_bat := (p_ngay::text || ' ' || coalesce(v_gio, '00:00'::time)::text)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  return v_bat + (case when p_tab = 'mt' then interval '72 hours' else interval '36 hours' end);
end $$;
comment on function public.fn_han_viec(uuid, date, time, text) is
  'Hạn việc nhân sự trên buổi thường (Thùy 06/09): ingame/danhgia/et = giờ bắt đầu buổi +36h · mt = +72h · btvn = han_nop_bai_test(btvn). Giờ bắt đầu: tham số → TKB → 00:00.';
grant execute on function public.fn_han_viec(uuid, date, time, text) to authenticated;

-- ②③ derive task buổi thường — pure-derive (§4), KHÔNG đẻ row.
--   vai: gv (đánh giá + chấm bài) · tg (chấm bài + ET + BTVN) · tk (trưởng khối — Chấm MT)
--   Buổi có gán MT: CHỈ 1 việc Chấm MT (mig 202609061907), owner = trưởng khối (khối × môn) → GV lớp.
--   p_tat_ca=true: mọi nhân sự (dashboard/duyệt/gậy) · false: chỉ người đang đăng nhập.
create or replace function public.fn_viec_buoi_thuong(p_tu date default null, p_den date default null, p_tat_ca boolean default false)
returns table (
  nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date,
  vai text, tab text, dong_at timestamptz, han timestamptz, et_online boolean
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
         public.fn_han_viec(d.lop_id, d.ngay, d.gio_bat_dau, d.tab) as han, d.et_online
  from dedup d, me
  where p_tat_ca or d.nhan_su_id = me.id
$$;
comment on function public.fn_viec_buoi_thuong(date, date, boolean) is
  'Việc nhân sự trên buổi thường (pure-derive). vai gv/tg theo phan_cong_lop; buổi có MT chỉ 1 việc mt: vai tk (phan_cong_khoi khối×môn) → fallback gv lớp (la_chinh ưu tiên). han = fn_han_viec. p_tat_ca=false → chỉ người đang đăng nhập.';
grant execute on function public.fn_viec_buoi_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_buoi_thuong(date, date, boolean) from anon;

-- fn_ta_dashboard: _ta_viec đọc từ fn_viec_buoi_thuong (vai tg; MT không còn là việc TA;
-- ET online vẫn loại khỏi KPI như trước — máy chấm, TA chỉ bấm xác nhận).
create or replace function public.fn_ta_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_now timestamptz := now();
  c_nguong_cl constant numeric := 80;
  c_nguong_rank constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong_ta integer; v_ds jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month')::date;

  create temp table _ta_viec on commit drop as
  select v.nhan_su_id, v.buoi_id, v.ten_lop, v.ngay, v.tab, v.dong_at, v.han,
    case
      when d.id is not null then case when d.tien_do >= 100 and d.chat_luong >= c_nguong_cl then 'dat' else 'khong_dat' end
      when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
      when v.han < v_now then 'khong_dat'
      else 'cho'
    end as kq,
    case
      when d.id is not null and (d.tien_do < 100 or d.chat_luong < c_nguong_cl) then
        case when d.chat_luong < c_nguong_cl then 'chat_luong' else 'tre' end
      when v.dong_at is not null and v.dong_at > v.han then 'tre'
      when v.dong_at is null and v.han < v_now then 'no_qua_han'
      else null
    end as ly_do
  from public.fn_viec_buoi_thuong(v_tu, v_den - 1, true) v
  left join viec_van_hanh_duyet d
    on d.buoi_hoc_id = v.buoi_id and d.tab = v.tab and d.nhan_su_id = v.nhan_su_id
  where v.vai = 'tg' and not (v.tab = 'et' and v.et_online);

  create temp table _ta_tk on commit drop as
  select w.nhan_su_id, ns.ho_ten,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    case when count(*) filter (where kq <> 'cho') = 0 then null
         else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end as pct
  from _ta_viec w join nhan_su ns on ns.id = w.nhan_su_id
  group by w.nhan_su_id, ns.ho_ten;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
           (pct = 100 and den_han >= c_nguong_rank) as dat_moc_thuong,
           (den_han >= c_nguong_rank) as du_dieu_kien_xep_hang
    from _ta_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong_ta from _ta_tk where den_han >= c_nguong_rank;
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ta_tk where den_han >= c_nguong_rank) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _ta_tk where den_han >= c_nguong_rank
        order by pct desc, dat desc, ho_ten limit 3) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_ds
  from (select ten_lop, ngay, tab, ly_do from _ta_viec
        where nhan_su_id = v_me and kq = 'khong_dat' order by ngay desc limit 30) x;

  drop table _ta_viec, _ta_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongTaXepHang', v_tong_ta,
    'top', v_top, 'khongDat', v_ds, 'nguongChatLuong', c_nguong_cl, 'nguongXepHang', c_nguong_rank);
end $$;
grant execute on function public.fn_ta_dashboard(text) to authenticated;
revoke execute on function public.fn_ta_dashboard(text) from anon;

-- fn_gv_dashboard: việc vai gv của tôi (đánh giá + chấm bài; + Chấm MT khi là fallback không có trưởng khối).
create or replace function public.fn_gv_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_now timestamptz := now();
  v_me_row jsonb; v_ds jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month')::date;

  create temp table _gv_viec on commit drop as
  select v.buoi_id, v.ten_lop, v.ngay, v.tab, v.dong_at, v.han,
    case
      when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
      when v.han < v_now then 'khong_dat'
      else 'cho'
    end as kq,
    case
      when v.dong_at is not null and v.dong_at > v.han then 'tre'
      when v.dong_at is null and v.han < v_now then 'no_qua_han'
      else null
    end as ly_do
  from public.fn_viec_buoi_thuong(v_tu, v_den - 1, false) v
  where v.vai = 'gv';

  select to_jsonb(x) into v_me_row from (
    select count(*) as tong,
      count(*) filter (where kq = 'cho') as cho,
      count(*) filter (where kq <> 'cho') as den_han,
      count(*) filter (where kq = 'dat') as dat,
      count(*) filter (where kq = 'khong_dat') as khong_dat,
      case when count(*) filter (where kq <> 'cho') = 0 then null
           else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end as pct
    from _gv_viec) x;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_ds
  from (select ten_lop, ngay, tab, ly_do from _gv_viec
        where kq = 'khong_dat' order by ngay desc limit 30) x;

  drop table _gv_viec;
  return jsonb_build_object('ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'khongDat', v_ds);
end $$;
grant execute on function public.fn_gv_dashboard(text) to authenticated;
