-- ============================================================================
-- 202608311240 — APP GV: rank MT batch theo lớp + dashboard GV tầng A + CHECK nguon chuông
-- (CEO chốt 31/08: ① MT không "trung bình" — hiện điểm THEO THÁNG + rank khối nhỏ bên cạnh
--  · ② đánh giá sau buổi thêm chuông đỏ bổ trợ, nguon='danhgia', ghi chú BẮT BUỘC (UI enforce)
--  · ④ dashboard GV: mới làm TẦNG A (đạt-chuẩn/đến-hạn 2 khâu) — CHƯA mốc thưởng/xếp hạng/chất
--  lượng vì "chưa đủ logic", tầng B/C còn phải nghĩ — xem PLAN-app-gv.md §6)
-- ----------------------------------------------------------------------------
-- MẤT GÌ (Luật xoá): không mất data — 2 fn mới + 1 CHECK NOT VALID (không quét dòng cũ).
-- ============================================================================

-- ── ① fn_rank_diem_mt_lop — bản BATCH của fn_rank_diem_mt cho tab Lớp app GV ──
-- Gọi fn per-HS cho cả lớp là N+1 RPC → 1 call trả (điểm tb + rank khối) mọi HS đang học của lớp.
-- LUẬT GIỮ NGUYÊN VĂN (202608300743 / Thùy 08-19+08-21): điểm CỦA EM ĐI THEO EM (avg mọi
-- diem_thi mt_sat_hach đúng môn trong cửa sổ 25/tháng → hết mùng 10 tháng sau, ngày theo
-- buoi_hoc.ngay); roster xếp hạng = TOÀN BỘ HS đang học các lớp cùng (mon, khối); chưa thi = 0đ
-- CHỈ trong xếp hạng (tb trả NULL để ô hiển thị vẫn "—").
create or replace function public.fn_rank_diem_mt_lop(p_lop uuid, p_mon text, p_ym text)
returns table (hoc_sinh_id uuid, tb numeric, rank_now integer, rank_total integer)
language sql stable as $$
  with lop_hs as (
    select hl.hoc_sinh_id, hs.khoi
    from hoc_sinh_lop hl join hoc_sinh hs on hs.id = hl.hoc_sinh_id
    where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
  ),
  roster as (  -- per khối có mặt trong lớp: mọi HS đang học ở lớp cùng (mon, khối)
    select distinct l.khoi, hl.hoc_sinh_id
    from lop l
    join (select distinct khoi from lop_hs) k on k.khoi = l.khoi
    join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
    where l.mon = p_mon
  ),
  win as (
    select (p_ym || '-25')::date as tu,
           ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date as den
  ),
  diem as (
    select dt.hoc_sinh_id, avg(dt.diem) as tb
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
    cross join win
    where dt.hoc_sinh_id in (select hoc_sinh_id from roster)
      and dt.diem is not null and b.ngay >= win.tu and b.ngay < win.den
    group by dt.hoc_sinh_id
  ),
  ranked as (
    select r.khoi, r.hoc_sinh_id, d.tb as tb_that,
           rank() over (partition by r.khoi order by coalesce(d.tb, 0) desc) as rk,
           count(*) over (partition by r.khoi) as tot
    from roster r left join diem d on d.hoc_sinh_id = r.hoc_sinh_id
  )
  select lh.hoc_sinh_id, round(rk.tb_that, 2), rk.rk::int, rk.tot::int
  from lop_hs lh join ranked rk on rk.hoc_sinh_id = lh.hoc_sinh_id and rk.khoi = lh.khoi
$$;
grant execute on function public.fn_rank_diem_mt_lop(uuid, text, text) to authenticated;

-- ── ② DASHBOARD GV THÁNG — TẦNG A (§2.0 — đếm ở Postgres, app chỉ gọi) ──
-- Việc = 2 khâu (ingame + danhgia) × buổi THƯỜNG của lớp phân công vai 'gv' trong tháng.
-- Deadline CẢ 2 khâu = hết ngày buổi (khớp deadlineOf gami.ts). GV không nhận task bù/bổ trợ
-- (route nguoi_day_tg — Thùy 07-26) nên không vào mẫu số.
-- CHƯA CÓ (chờ chốt B/C — PLAN-app-gv.md §6): chất lượng duyệt · xếp hạng · mốc thưởng.
-- (volatile vì temp table)
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
  with viec as (
    select distinct b.id as buoi_id, l.ten_lop, b.ngay, t.tab,
      case t.tab when 'ingame' then b.ingame_dong_at else b.danh_gia_xong_at end as dong_at,
      ((b.ngay + 1)::text || ' 00:00')::timestamp at time zone 'Asia/Ho_Chi_Minh' as han
    from buoi_hoc b
    join lop l on l.id = b.lop_id
    join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.vai_tro = 'gv' and pc.nhan_su_id = v_me
    cross join (values ('ingame'), ('danhgia')) as t(tab)
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay >= v_tu and b.ngay < v_den
  )
  select v.buoi_id, v.ten_lop, v.ngay, v.tab, v.dong_at, v.han,
    case
      when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
      when v.han < v_now then 'khong_dat'   -- nợ quá hạn: đóng sau cũng đã muộn
      else 'cho'
    end as kq,
    case
      when v.dong_at is not null and v.dong_at > v.han then 'tre'
      when v.dong_at is null and v.han < v_now then 'no_qua_han'
      else null
    end as ly_do
  from viec v;

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
revoke execute on function public.fn_gv_dashboard(text) from anon;

-- ── ③ Vá nợ: CHECK cho canh_bao_yeu.nguon (bài học cột text tự do — §2.1) ──
-- DB hiện chỉ có 'btvn' (mọi writer đi qua themCanhBao); app GV thêm 'danhgia'.
-- NOT VALID: không quét dòng cũ, chỉ chặn giá trị lạ từ giờ.
alter table canh_bao_yeu drop constraint if exists canh_bao_yeu_nguon_chk;
alter table canh_bao_yeu add constraint canh_bao_yeu_nguon_chk
  check (nguon in ('btvn', 'danhgia')) not valid;
