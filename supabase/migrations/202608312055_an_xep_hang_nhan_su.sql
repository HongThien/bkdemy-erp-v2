-- ============================================================================
-- 202608312055 — ẨN NHÂN SỰ KHỎI BẢNG XẾP HẠNG trên các app (CEO 31/08: "gỡ Thùy và
-- Trang ra khỏi các bảng xếp hạng hiển thị trên các app").
-- Cách làm DATA-DRIVEN: cột cờ `nhan_su.an_xep_hang` (không hard-code tên trong code —
-- symmetry test §1.6; bật/tắt cho bất kỳ ai bằng 1 UPDATE). Fn lọc cờ này khỏi POOL xếp
-- hạng: người bị ẩn không có rank, không vào top 3, không tính vào mẫu số tongTaXepHang;
-- BAR + 4 stat CỦA CHÍNH HỌ vẫn tính bình thường (chỉ ẩn so-sánh-với-người-khác).
-- Bảng xếp hạng nhân sự trên app hiện chỉ có 1 nơi: fn_ta_dashboard (app TA — rank + top 3).
-- fn_gv_dashboard chưa có xếp hạng (tầng A). Xếp hạng HS (app HS) không liên quan nhân sự.
-- ⚠ SEED cờ cho Thùy + Trang KHÔNG nằm trong migration (không đoán tên thật trong DB —
-- §1.5 thà bỏ trống còn hơn đánh sai): chạy tay 2 câu ở cuối file (comment) với đúng ma_ns.
-- MẤT GÌ (Luật xoá): không — thêm 1 cột default false + replace 1 fn.
-- ============================================================================

alter table nhan_su add column if not exists an_xep_hang boolean not null default false;
comment on column nhan_su.an_xep_hang is
  'true = ẩn khỏi mọi bảng xếp hạng nhân sự trên app (rank/top/mẫu số). Không ảnh hưởng bar/stat của chính họ.';

-- ── fn_ta_dashboard v2 = v1 (202608310120) + lọc an_xep_hang khỏi pool xếp hạng ──
create or replace function public.fn_ta_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_now timestamptz := now();
  c_nguong_cl constant numeric := 80;  -- chất lượng đạt ≥ 80 (CHỈNH Ở ĐÂY)
  c_nguong_rank constant integer := 10; -- ≥10 việc đến hạn mới vào bảng xếp hạng (CEO chốt)
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong_ta integer; v_ds jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month')::date;

  create temp table _ta_viec on commit drop as
  with viec as (
    select distinct pc.nhan_su_id, b.id as buoi_id, l.ten_lop, b.ngay, t.tab,
      case t.tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at else b.btvn_dong_at end as dong_at,
      case t.tab
        when 'ingame' then ((b.ngay + 1)::text || ' 00:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'
        when 'et' then public.han_nop_bai_test(b.lop_id, b.ngay, 'et')
        else coalesce(public.han_nop_bai_test(b.lop_id, b.ngay, 'btvn'),
                      ((b.ngay + 3)::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh')
      end as han
    from buoi_hoc b
    join lop l on l.id = b.lop_id
    join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.vai_tro = 'tg'
    cross join (values ('ingame'), ('et'), ('btvn')) as t(tab)
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay >= v_tu and b.ngay < v_den
      and not (t.tab = 'et' and exists (
        select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et'))
  )
  select v.nhan_su_id, v.buoi_id, v.ten_lop, v.ngay, v.tab, v.dong_at, v.han,
    case
      when d.id is not null then case when d.tien_do >= 100 and d.chat_luong >= c_nguong_cl then 'dat' else 'khong_dat' end
      when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
      when v.han < v_now then 'khong_dat'   -- nợ quá hạn: đóng sau cũng đã muộn
      else 'cho'
    end as kq,
    case
      when d.id is not null and (d.tien_do < 100 or d.chat_luong < c_nguong_cl) then
        case when d.chat_luong < c_nguong_cl then 'chat_luong' else 'tre' end
      when v.dong_at is not null and v.dong_at > v.han then 'tre'
      when v.dong_at is null and v.han < v_now then 'no_qua_han'
      else null
    end as ly_do
  from viec v
  left join viec_van_hanh_duyet d
    on d.buoi_hoc_id = v.buoi_id and d.tab = v.tab and d.nhan_su_id = v.nhan_su_id;

  create temp table _ta_tk on commit drop as
  select w.nhan_su_id, ns.ho_ten, ns.an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    case when count(*) filter (where kq <> 'cho') = 0 then null
         else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end as pct
  from _ta_viec w join nhan_su ns on ns.id = w.nhan_su_id
  group by w.nhan_su_id, ns.ho_ten, ns.an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
           (pct = 100 and den_han >= c_nguong_rank) as dat_moc_thuong,
           (den_han >= c_nguong_rank and not an_xep_hang) as du_dieu_kien_xep_hang
    from _ta_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong_ta from _ta_tk where den_han >= c_nguong_rank and not an_xep_hang;
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ta_tk where den_han >= c_nguong_rank and not an_xep_hang) r
  where r.nhan_su_id = v_me;

  -- Top 3 công khai (chốt ③: TA thấy MÌNH + top 3, không thấy full bảng) — bỏ người an_xep_hang
  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _ta_tk where den_han >= c_nguong_rank and not an_xep_hang
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

-- ── SEED (chạy TAY, KHÔNG trong migration — tra đúng người rồi mới bật cờ): ──
-- select ma_ns, ho_ten from nhan_su where ho_ten ilike '%thùy%' or ho_ten ilike '%trang%';
-- update nhan_su set an_xep_hang = true where ma_ns in ('NS___', 'NS___');  -- điền ma_ns Thùy + Trang
