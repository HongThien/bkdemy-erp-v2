-- ĐỢT 2 — BƯỚC 3 (13/11/2026): "Việc của tôi" lọc theo NGƯỜI GỌI trước (spec-kien-truc.md K2 — hàm client gọi chỉ tốn theo một người).
-- Trước: dựng việc của MỌI nhân sự trên mọi buổi rồi mới lọc d.nhan_su_id = tôi ở dòng cuối. Sau: chỉ dựng trên các lớp tôi có thể có việc.
-- Kết quả không đổi (đã so cũ–mới cho từng nhân sự trước khi áp). Nhánh p_tat_ca = true (fn_viec_buoi_thuong_lh, cron) giữ nguyên.
do $g$ begin if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_viec_buoi_thuong(date,date,boolean)'::regprocedure) is distinct from 'a936c2a642a277bed58cbc900265832d' then raise exception 'fn_viec_buoi_thuong đã đổi từ lúc sinh migration — sinh lại'; end if; end $g$;

CREATE OR REPLACE FUNCTION public.fn_viec_buoi_thuong(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date, p_tat_ca boolean DEFAULT false)
 RETURNS TABLE(nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, vai text, tab text, dong_at timestamp with time zone, han timestamp with time zone, et_online boolean, ref_key text)
 LANGUAGE sql
 STABLE
AS $function$
  with me as (select public.current_nhan_su_id() as id),
  -- [đợt 2 bước 3, 13/11] LỌC THEO NGƯỜI GỌI TRƯỚC: chỉ những lớp tôi có thể có việc = lớp tôi được phân công ∪ lớp thuộc (môn, khối) tôi là khối vận hành.
  -- Mọi dòng trả về cho tôi đều nằm trong tập lớp này (thuong/mt_gv cần phân công; mt_tk cần khối vận hành) ⇒ kết quả không đổi, chỉ bớt quét buổi của người khác.
  lop_toi as (
    select pc.lop_id from phan_cong_lop pc, me where pc.nhan_su_id = me.id
    union
    select l.id
      from (select distinct l0.mon, l0.khoi from lop l0) mk
      join lop l on l.mon is not distinct from mk.mon and l.khoi is not distinct from mk.khoi
     where exists (select 1 from public._khoi_van_hanh(mk.mon, mk.khoi) pk, me where pk.nhan_su_id = me.id)
  ),
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
      and (p_tat_ca or bh.lop_id in (select lt.lop_id from lop_toi lt))
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
      -- Thùy 28/10: "Chấm bài trên lớp" (ingame) không còn là việc của ai, từ 01/10/2026; trước đó giữ nguyên.
      select unnest(case pc.vai_tro
                        when 'gv' then case when b.ngay >= date '2026-10-01' then array['danhgia'] else array['danhgia', 'ingame'] end
                        when 'tg' then case when b.ngay >= date '2026-10-01' then array['et', 'btvn'] else array['ingame', 'et', 'btvn'] end
                        else case when b.ngay >= date '2026-10-01' then array['et', 'btvn'] else array['ingame', 'et', 'btvn'] end end) as tab
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
