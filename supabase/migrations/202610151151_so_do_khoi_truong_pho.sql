-- ============================================================================
-- 202610151151 — so_do_khoi_truong_pho
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì) — Thùy 15/10:
--   "Phân công là phân công PHẠM VI. Chức danh phải đưa về SƠ ĐỒ TỔ CHỨC team trợ giảng." Cấu trúc khối:
--   Trưởng = GV (thấy hết, giao việc, xử lý sự cố + đánh giá) · Phó = TA tốt (thấy hết, giúp vận hành, KHÔNG thao tác
--   lên người khác) · Thành viên. "Danh sách phụ trách khối (phan_cong_khoi) bản chất là Phó" ⇒ hai nguồn "ai phụ
--   trách khối" đang lệch nhau (khối 7/8/3-5) ⇒ gộp về MỘT nguồn: vi_tri của team 'ta' (cap + khoi_quan_ly + mon).
--   · Ô "Trưởng khối …" đang để cap 'thanh_vien' ⇒ 'truong'; ô "Phó khối …" ⇒ 'pho' + chi_xem.
--   · Thêm Phó khối 3·4·5 = Phạm Bảo Ngân (phan_cong_khoi khối 3/4/5 = Ngân, Trưởng = Lộ Thị Dương). Khối không có
--     Phó riêng thì để trống (Thùy: "chưa có thì để trống").
--   · _khoi_van_hanh(mon, khoi) = Phó khối, không có Phó ⇒ Trưởng. Dùng cho: người nhận việc Chấm MT
--     (fn_viec_buoi_thuong) + người được bot tag (_tg_ban_tin_du_lieu). Kết quả hôm nay TRÙNG với phan_cong_khoi
--     (kiểm trong rollback trước khi áp) — chỉ đổi NGUỒN, không đổi người.
--   · fn_khoi_cua_toi(): khối × môn tôi là Phó trở lên ⇒ quyền chấm mọi lớp cùng khối (Thùy: "Phó trở lên mới có
--     quyền chấm") — thay phan_cong_khoi ở màn Buổi học. fn_khoi_quan_ly_ds(): màn Phân công hiện Trưởng/Phó chỉ xem.
--   TA thành viên treo dưới TRƯỞNG khối của lớp chính (không dưới Phó): quyền giao việc đi theo cây (fn_task_cap_duoi)
--   và không xét chi_xem ⇒ Phó không có cấp dưới = không giao việc được, đúng vai.
--   phan_cong_khoi: KHÔNG còn hàm nào đọc; giữ nguyên bảng (không xoá — Luật xoá), app không ghi vào nữa.
--
-- MẤT GÌ (Luật xoá): không xoá gì. Đổi cap/chi_xem các ô khối của team Trợ giảng, thêm 1 ô Phó khối 3·4·5.
-- ============================================================================

update vi_tri v set cap = 'truong', chi_xem = false
  from team t where t.id = v.team_id and t.ma = 'ta' and v.ten ~* '^trưởng khối' and v.cap <> 'truong';
update vi_tri v set cap = 'pho', chi_xem = true
  from team t where t.id = v.team_id and t.ma = 'ta' and v.ten ~* '^phó khối' and v.cap <> 'pho';

insert into vi_tri (team_id, ten, cap, cha_id, nhan_su_id, vai_tro_id, mon, khoi_quan_ly, chi_xem)
select t.id, 'Phó khối 3 4 5', 'pho', tr.id, n.id, tr.vai_tro_id, 'Toán', array['3', '4', '5'], true
  from team t
  join vi_tri tr on tr.team_id = t.id and tr.ten = 'Trưởng khối 3 4 5'
  join nhan_su n on n.ho_ten = 'Phạm Bảo Ngân' and n.trang_thai = 'dang_lam'
 where t.ma = 'ta'
   and not exists (select 1 from vi_tri x where x.team_id = t.id and x.ten = 'Phó khối 3 4 5');

-- Trưởng / Phó của mọi khối (team Trợ giảng)
create or replace function public._khoi_quan_ly()
returns table (mon text, khoi text, nhan_su_id uuid, cap text, vi_tri_id uuid)
language sql stable security definer set search_path = public as $$
  select v.mon, k, v.nhan_su_id, v.cap, v.id
    from vi_tri v join team t on t.id = v.team_id and t.ma = 'ta'
    join nhan_su n on n.id = v.nhan_su_id and n.trang_thai = 'dang_lam'
    cross join unnest(v.khoi_quan_ly) k
   where v.cap in ('truong', 'pho') and v.mon is not null
$$;
revoke all on function public._khoi_quan_ly() from public, anon, authenticated;

-- Người VẬN HÀNH khối: Phó; khối chưa có Phó ⇒ Trưởng
create or replace function public._khoi_van_hanh(p_mon text, p_khoi text)
returns table (nhan_su_id uuid)
language sql stable security definer set search_path = public as $$
  with q as (select * from public._khoi_quan_ly() x where x.mon = p_mon and x.khoi = p_khoi)
  select distinct q.nhan_su_id from q
   where q.cap = case when exists (select 1 from q where q.cap = 'pho') then 'pho' else 'truong' end
$$;
revoke all on function public._khoi_van_hanh(text, text) from public, anon, authenticated;

create or replace function public.fn_khoi_cua_toi()
returns table (khoi text, mon text, cap text)
language sql stable security definer set search_path = public as $$
  select distinct x.khoi, x.mon, x.cap from public._khoi_quan_ly() x where x.nhan_su_id = public.current_nhan_su_id()
$$;
revoke all on function public.fn_khoi_cua_toi() from public, anon;
grant execute on function public.fn_khoi_cua_toi() to authenticated;

create or replace function public.fn_khoi_quan_ly_ds()
returns table (mon text, khoi text, nhan_su_id uuid, ho_ten text, cap text)
language sql stable security definer set search_path = public as $$
  select x.mon, x.khoi, x.nhan_su_id, n.ho_ten, x.cap
    from public._khoi_quan_ly() x join nhan_su n on n.id = x.nhan_su_id
   where public.la_thanh_vien()
   order by x.mon, x.khoi, x.cap desc, n.ho_ten
$$;
revoke all on function public.fn_khoi_quan_ly_ds() from public, anon;
grant execute on function public.fn_khoi_quan_ly_ds() to authenticated;

CREATE OR REPLACE FUNCTION public.fn_viec_buoi_thuong(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date, p_tat_ca boolean DEFAULT false)
 RETURNS TABLE(nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, vai text, tab text, dong_at timestamp with time zone, han timestamp with time zone, et_online boolean, ref_key text)
 LANGUAGE sql
 STABLE
AS $function$
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
      select unnest(case pc.vai_tro when 'gv' then array['danhgia', 'ingame']
                        -- Thùy 15/10: "Chấm bài trên lớp" ra khỏi TA (chỉ GV). Từ 01/10/2026; tháng trước giữ nguyên (hiệu suất/thưởng đã tính).
                        when 'tg' then case when b.ngay >= date '2026-10-01' then array['et', 'btvn'] else array['ingame', 'et', 'btvn'] end
                        else array['ingame', 'et', 'btvn'] end) as tab
    ) t
    where not b.co_mt
  ),
  mt_tk as (
    select pk.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'tk'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 0 as uu_tien
    from b
    join public._khoi_van_hanh(b.mon, b.khoi) pk on true   -- Phó khối (không có Phó ⇒ Trưởng) theo SƠ ĐỒ TỔ CHỨC team Trợ giảng (Thùy 15/10)
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
$function$;

CREATE OR REPLACE FUNCTION public._tg_ban_tin_du_lieu(p_ngay date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with v as (select * from public._tg_viec_ton(p_ngay) x
              where x.loai in ('et', 'btvn', 'bu_et', 'btvn_bu', 'cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
                and x.ngay_goc >= public._ta_moc_cham_cong()),   -- Thùy 15/10: chỉ ET · BTVN · chấm công, chỉ từ tháng 10
  -- Cảnh báo BTVN (Thùy 15/10): em của lớp TA có 2 kết quả BTVN GẦN NHẤT liên tiếp cùng là "không làm" hoặc cùng "nộp muộn"
  -- (xin phép không tính, không ngắt chuỗi); chỉ nêu khi bài gần nhất trong chuỗi ở 7 ngày qua (cũ hơn = đã nhắc rồi).
  kq as (
    select pc.nhan_su_id, l.id as lop_id, l.ten_lop, h.id as hs_id, h.ho_ten, b.ngay, k.trang_thai_nop,
           row_number() over (partition by pc.nhan_su_id, l.id, h.id order by b.ngay desc) as rn
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
      join hoc_sinh h on h.id = k.hoc_sinh_id
      join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
     where k.trang_thai_nop in ('nop_dung_han', 'nop_muon', 'khong_lam')
       and b.ngay >= public._ta_moc_cham_cong() and b.ngay < p_ngay
  ),
  canh as (
    select x.nhan_su_id, jsonb_agg(jsonb_build_object('ho_ten', x.ho_ten, 'ten_lop', x.ten_lop, 'loai', x.tt, 'ngays', x.ngays)
                                   order by x.tt, x.ten_lop, x.ho_ten) as canh_bao
      from (select nhan_su_id, ten_lop, ho_ten, max(trang_thai_nop) as tt, array_agg(ngay order by ngay) as ngays, max(ngay) as moi
              from kq where rn <= 2
             group by nhan_su_id, lop_id, ten_lop, hs_id, ho_ten
            having count(*) = 2 and min(trang_thai_nop) = max(trang_thai_nop)) x
     where x.tt in ('khong_lam', 'nop_muon') and x.moi >= p_ngay - 7
     group by x.nhan_su_id
  ),
  ds as (select d.nhan_su_id, n.ho_ten, l.tg_user_id
           from public._tg_ds_ta(p_ngay) d join nhan_su n on n.id = d.nhan_su_id
           left join tg_lien_ket l on l.nhan_su_id = d.nhan_su_id and l.den_at is null),
  thuong as (   -- việc không phải chấm công, gom theo loại; cùng lớp + cùng ngày gộp 1 mục kèm số (vd BTVN bù 2 em)
    select v.nhan_su_id, v.loai, min(v.nhan) as nhan, min(v.ngay_goc) as ngay_dau,
           jsonb_agg(jsonb_build_object('ten_lop', v.ten_lop, 'ngay_goc', v.ngay_goc, 'so_luong', v.so_luong)
                     order by v.ngay_goc, v.ten_lop) as muc
      from (select x.nhan_su_id, x.loai, min(x.nhan) as nhan, x.ten_lop, x.ngay_goc, sum(x.so_luong)::int as so_luong
              from v x group by x.nhan_su_id, x.loai, x.ten_lop, x.ngay_goc) v where v.loai not in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
     group by v.nhan_su_id, v.loai
  ),
  cong as (
    select v.nhan_su_id,
           jsonb_build_object('so_buoi', count(*) filter (where v.loai = 'cong_buoi'),
                              'so_ca', count(*) filter (where v.loai = 'cong_ca'),
                              'so_bo_tro', count(*) filter (where v.loai = 'cong_bo_tro'),
                              'quen_checkout', count(*) filter (where v.loai = 'quen_checkout'),
                              'tu', min(v.ngay_goc), 'den', max(v.ngay_goc)) as cong
      from v where v.loai in ('cong_buoi', 'cong_ca', 'cong_bo_tro', 'quen_checkout')
     group by v.nhan_su_id
  ),
  pt as (       -- Phó khối (không có Phó ⇒ Trưởng) của các khối TA có việc, theo sơ đồ tổ chức (trừ chính TA đó)
    select x.nhan_su_id, jsonb_agg(distinct jsonb_build_object('ho_ten', n.ho_ten, 'tg_user_id', l.tg_user_id)) as phu_trach
      from (select distinct v.nhan_su_id, v.mon, v.khoi from v where v.khoi is not null) x
      join public._khoi_van_hanh(x.mon, x.khoi) pk on pk.nhan_su_id <> x.nhan_su_id
      join nhan_su n on n.id = pk.nhan_su_id and n.trang_thai = 'dang_lam'
      left join tg_lien_ket l on l.nhan_su_id = pk.nhan_su_id and l.den_at is null
     group by x.nhan_su_id
  ),
  ta as (
    select ds.nhan_su_id, ds.ho_ten, ds.tg_user_id,
           (select count(*) from v where v.nhan_su_id = ds.nhan_su_id) as so_viec,
           coalesce(pt.phu_trach, '[]'::jsonb) as phu_trach,
           coalesce((select jsonb_agg(jsonb_build_object('loai', t.loai, 'nhan', t.nhan, 'muc', t.muc) order by t.ngay_dau, t.loai)
                       from thuong t where t.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as nhom,
           cong.cong, coalesce(canh.canh_bao, '[]'::jsonb) as canh_bao,
           coalesce((select jsonb_agg(jsonb_build_object('ref_key', v.ref_key, 'loai', v.loai, 'nhan', v.nhan, 'ten_lop', v.ten_lop,
                                                          'khoi', v.khoi, 'mon', v.mon, 'ngay_goc', v.ngay_goc, 'han', v.han, 'so_luong', v.so_luong)
                                       order by v.ngay_goc, v.loai)
                       from v where v.nhan_su_id = ds.nhan_su_id), '[]'::jsonb) as viec
      from ds left join pt on pt.nhan_su_id = ds.nhan_su_id left join cong on cong.nhan_su_id = ds.nhan_su_id
      left join canh on canh.nhan_su_id = ds.nhan_su_id
  )
  select jsonb_build_object(
    'ngay', p_ngay,
    'ta', coalesce((select jsonb_agg(to_jsonb(ta) order by ta.ho_ten)
                      from ta where ta.so_viec > 0 or jsonb_array_length(ta.canh_bao) > 0), '[]'::jsonb),
    'sach', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.so_viec = 0 and jsonb_array_length(ta.canh_bao) = 0), '[]'::jsonb),
    'chua_noi', coalesce((select jsonb_agg(ta.ho_ten order by ta.ho_ten) from ta where ta.tg_user_id is null), '[]'::jsonb))
$function$;
