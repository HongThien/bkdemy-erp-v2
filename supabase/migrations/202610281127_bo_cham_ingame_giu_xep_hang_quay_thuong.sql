-- ============================================================================
-- 202610281127 — bo_cham_ingame_giu_xep_hang_quay_thuong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 28/10: tab "Chấm bài trên lớp" bỏ phần chấm mức 1–5 (đánh giá trong buổi). Không còn là việc giao cho
--   GV hay TA nữa; tab chỉ còn XẾP HẠNG BUỔI + QUAY THƯỞNG (game trong buổi).
--   ① fn_viec_buoi_thuong: khâu 'ingame' không còn sinh việc cho BẤT KỲ vai nào, buổi từ 01/10/2026 (cùng mốc với
--      lần bỏ khỏi TA 15/10 — tháng 9 trở về giữ nguyên, hiệu suất/thưởng tháng cũ không bị viết lại).
--   ② fn_buoi_recompute_hoan_tat: buổi từ 01/10 "hoàn tất" KHÔNG còn đòi ingame_dong_at (nếu không buổi kẹt 'mo' mãi
--      vì không ai còn đóng khâu này).
--   ③ Đề xuất gậy ĐANG CHỜ cho việc này (buổi từ 01/10) ⇒ rút. Gậy đã đánh KHÔNG đụng.
--   Thân hàm lấy từ bản đang chạy (pg_get_functiondef 28/10), chỉ đổi đúng chỗ trên.
--
-- MẤT GÌ (Luật xoá): không xoá gì. 2 hàm viết lại thân (cùng chữ ký). gay_de_xuat: 'cho' → 'bo_qua' cho đúng các đề
--   xuất 'ingame' của buổi từ 01/10 (trigger log_gay_de_xuat ghi vết). Dữ liệu chấm đã có (gami_grades) giữ nguyên.
-- ============================================================================

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

CREATE OR REPLACE FUNCTION public.fn_buoi_recompute_hoan_tat(p_buoi_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare b record; v_has_mt boolean; v_next text;
begin
  select trang_thai, lop_id, ngay, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at
    into b from buoi_hoc where id = p_buoi_id;
  if b is null or b.trang_thai = 'huy' then return; end if;
  select exists(select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = b.lop_id and tl.ngay = b.ngay)
    into v_has_mt;
  v_next := case
    when v_has_mt then (case when b.mt_dong_at is not null then 'hoan_tat' else 'mo' end)
    -- Thùy 28/10: buổi từ 01/10/2026 không còn khâu ingame ⇒ hoàn tất = ET + đánh giá + BTVN
    when (b.ingame_dong_at is not null or b.ngay >= date '2026-10-01') and b.et_dong_at is not null
          and b.danh_gia_xong_at is not null and b.btvn_dong_at is not null
     then 'hoan_tat' else 'mo'
  end;
  if b.trang_thai <> v_next then
    update buoi_hoc set trang_thai = v_next, updated_at = now() where id = p_buoi_id;
  end if;
end $function$;

update gay_de_xuat g set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null,
       ly_do_bo_qua = 'Thùy 28/10: chấm bài trên lớp không còn là việc của GV/TA (từ 01/10/2026)'
  from buoi_hoc b
 where g.trang_thai = 'cho' and g.nguon = 'vanhanh' and g.ref_key ~ '^vh:[0-9a-f-]{36}[|]ingame[|]'
   and b.id = split_part(substr(g.ref_key, 4), '|', 1)::uuid and b.ngay >= date '2026-10-01';
