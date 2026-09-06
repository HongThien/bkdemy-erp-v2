-- ============================================================================
-- 202609070201 — hoan_et_online_giu_thu_cong_cham_cong
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 07/09): "Vụ ET online để phase sau, không cần bỏ công vào đấy — tạm thời TA
-- vẫn đóng ET thủ công." Migration 202609070151 đã lỡ (a) bỏ việc ET của buổi ET-online khỏi
-- fn_viec_buoi_thuong và (b) cho chuẩn ET = 0 với lớp toàn ET-online. HOÀN LẠI cả hai — TA
-- thấy lại việc "Xác nhận ET (online)", Tiến trình đếm ET như mọi buổi. Giữ nguyên phần
-- còn lại của 151 (ta_vang, TA chính, tích lũy, shop).
-- Kèm fn_ta_buoi_thang cho box Chấm công (lead ghi TA vắng).
--
-- MẤT GÌ (Luật xoá): không. CREATE OR REPLACE fn_viec_buoi_thuong (về đúng thân 202609062344)
-- + fn_ta_tien_trinh; 1 hàm mới.
-- ============================================================================

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
  'Việc nhân sự trên buổi thường (pure-derive). vai gv/tg theo phan_cong_lop; buổi có MT chỉ 1 việc mt. ET online vẫn là việc TA (xác nhận tay — CEO 07/09 để phase sau). han = fn_han_viec. ref_key = khoá gậy tự động.';
grant execute on function public.fn_viec_buoi_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_buoi_thuong(date, date, boolean) from anon;

-- fn_ta_tien_trinh v3 = v2 (TA chính, trừ vắng) nhưng ET đếm mọi buổi, chuẩn ET luôn = định mức.
create or replace function public.fn_ta_tien_trinh(p_ym text)
returns jsonb language plpgsql stable as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_den_thuc date;
  k_buoi numeric; k_btvn numeric; k_et numeric; k_botro numeric;
  v_lop jsonb; v_botro jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
  v_den_thuc := least(v_den, v_today);

  select gia_tri into k_buoi  from ta_dinh_muc where ma = 'buoi_x_tuan';
  select gia_tri into k_btvn  from ta_dinh_muc where ma = 'btvn';
  select gia_tri into k_et    from ta_dinh_muc where ma = 'et';
  select gia_tri into k_botro from ta_dinh_muc where ma = 'botro_gio';

  with tg as (
    select pc.lop_id, pc.nhan_su_id, pc.la_chinh,
      count(*) over (partition by pc.lop_id) as so_tg,
      bool_or(pc.la_chinh) over (partition by pc.lop_id) as co_chinh
    from phan_cong_lop pc where pc.vai_tro = 'tg'
  ),
  lop_toi as (   -- lớp tôi là TA CHÍNH (hoặc TA duy nhất); lớp ≥2 TA không ai chính → vẫn hiện, kèm cờ
    select distinct l.id, l.ten_lop, (t.so_tg > 1 and not t.co_chinh) as khong_ro_chinh
    from tg t join lop l on l.id = t.lop_id
    where t.nhan_su_id = v_me and l.trang_thai = 'dang_hoc'
      and (t.la_chinh or t.so_tg = 1 or not t.co_chinh)
  ),
  tuan as (
    select lt.id as lop_id, count(distinct t.thu) as buoi_tuan
    from lop_toi lt join thoi_khoa_bieu t on t.lop_id = lt.id
    where t.hieu_luc_tu <= v_den and (t.hieu_luc_den is null or t.hieu_luc_den >= v_tu)
    group by lt.id
  ),
  thuc as (
    select lt.id as lop_id,
      count(*) filter (where b.ngay <= v_den_thuc
        and not exists (select 1 from ta_vang v where v.buoi_hoc_id = b.id and v.nhan_su_id = v_me)) as buoi_thuc,
      count(*) filter (where b.ngay <= v_den_thuc
        and exists (select 1 from ta_vang v where v.buoi_hoc_id = b.id and v.nhan_su_id = v_me)) as buoi_vang,
      count(*) filter (where b.btvn_dong_at is not null) as btvn_thuc,
      count(*) filter (where b.et_dong_at is not null) as et_thuc
    from lop_toi lt left join buoi_hoc b
      on b.lop_id = lt.id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
    group by lt.id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'lop_id', lt.id, 'ten_lop', lt.ten_lop, 'khong_ro_chinh', lt.khong_ro_chinh,
      'buoi_tuan', coalesce(tu.buoi_tuan, 0),
      'buoi_chuan', coalesce(tu.buoi_tuan, 0) * k_buoi, 'buoi_thuc', coalesce(th.buoi_thuc, 0), 'buoi_vang', coalesce(th.buoi_vang, 0),
      'btvn_chuan', k_btvn, 'btvn_thuc', coalesce(th.btvn_thuc, 0),
      'et_chuan', k_et, 'et_thuc', coalesce(th.et_thuc, 0)
    ) order by lt.ten_lop), '[]'::jsonb)
  into v_lop
  from lop_toi lt left join tuan tu on tu.lop_id = lt.id left join thuc th on th.lop_id = lt.id;

  select jsonb_build_object(
      'chuan_gio', k_botro, 'so_ca', count(*),
      'thuc_gio', round(coalesce(sum(coalesce(extract(epoch from (b.gio_ket_thuc - b.gio_bat_dau)) / 3600, 1)), 0)::numeric, 1))
  into v_botro
  from buoi_hoc b
  where b.loai = 'bo_tro_yeu' and b.trang_thai <> 'huy' and b.nguoi_day_tg = v_me and b.ngay between v_tu and v_den_thuc;

  return jsonb_build_object('ym', p_ym, 'lop', v_lop, 'botro', v_botro,
    'dinh_muc', jsonb_build_object('buoi_x_tuan', k_buoi, 'btvn', k_btvn, 'et', k_et, 'botro_gio', k_botro));
end $$;
grant execute on function public.fn_ta_tien_trinh(text) to authenticated;
revoke execute on function public.fn_ta_tien_trinh(text) from anon;

-- Chấm công TA (lead ghi vắng): buổi thường đã diễn ra trong tháng của lớp TA đó, kèm cờ vắng.
create or replace function public.fn_ta_buoi_thang(p_ns uuid, p_ym text)
returns table (buoi_id uuid, ten_lop text, ngay date, gio_bat_dau time, vang boolean, ly_do text)
language sql stable as $$
  select b.id, l.ten_lop, b.ngay, b.gio_bat_dau, (v.id is not null), v.ly_do
  from buoi_hoc b
  join lop l on l.id = b.lop_id
  join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg'
  left join ta_vang v on v.buoi_hoc_id = b.id and v.nhan_su_id = p_ns
  where b.loai = 'thuong' and b.trang_thai <> 'huy'
    and b.ngay >= (p_ym || '-01')::date and b.ngay < ((p_ym || '-01')::date + interval '1 month')::date
    and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
  order by b.ngay desc, l.ten_lop
$$;
grant execute on function public.fn_ta_buoi_thang(uuid, text) to authenticated;
revoke execute on function public.fn_ta_buoi_thang(uuid, text) from anon;
