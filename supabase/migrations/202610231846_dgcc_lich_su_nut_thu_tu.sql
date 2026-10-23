-- ============================================================================
-- 202610231846 — dgcc_lich_su_nut_thu_tu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Đo ngay sau mig 202610231846_dgcc_lich_su_nut: 2 lần CÙNG NGÀY (ET + BTVN cùng buổi) bị xếp ngược với fn_dgcc_hs
--   (bản trước xếp t tăng, luot tăng; fn_dgcc_hs xếp t giảm, luot tăng) ⇒ dòng mới nhất của popup lệch thẻ (TB5 88,2 vs 87,2).
--   Dùng ĐÚNG thứ tự của fn_dgcc_hs (rn = row_number() over (order by t desc, luot)) — một thứ tự duy nhất cho cả thẻ và popup.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: thay THÂN fn_dgcc_lich_su_nut (chữ ký giữ nguyên).
-- ============================================================================

create or replace function fn_dgcc_lich_su_nut(p_hs uuid, p_tang text, p_nut text, p_cha text DEFAULT NULL, p_mon text DEFAULT 'Toán')
returns table(stt integer, ngay date, kenh text, so_cau integer, diem numeric, ti_le numeric,
              hien_tai numeric, tang_giam numeric, tb_ngan numeric, chenh numeric, trong_ngan boolean, trong_dai boolean)
language sql stable set search_path to 'public' as $$
  with w as (select * from _dgcc_cua_so() where tang = p_tang),
  l as (
    select l.*, row_number() over (order by l.t desc, l.luot)::integer as rn  -- 1 = mới nhất (cùng thứ tự fn_dgcc_hs)
      from _dgcc_lan(array[p_hs], p_mon) l
     where l.tang = p_tang and l.nut = p_nut and l.cha is not distinct from p_cha
  ),
  r as (
    -- "tới lần rn": TB của tối đa (dai) / (ngan) lần gần nhất tính đến lần đó (lần đó + các lần cũ hơn)
    select l.*, w.ngan, w.dai, count(*) over () as tong,
           (select avg(x.ti_le) from l x where x.rn between l.rn and l.rn + w.dai - 1)  as tb_dai_k,
           (select avg(x.ti_le) from l x where x.rn between l.rn and l.rn + w.ngan - 1) as tb_ngan_k
      from l cross join w
  ),
  d as (select r.*, r.tb_dai_k - lead(r.tb_dai_k) over (order by r.rn) as tg from r)
  select d.rn, d.ngay, d.kenh, d.so_cau, round(d.diem, 2), round(d.ti_le * 100, 1),
         round(d.tb_dai_k * 100, 1), round(d.tg * 100, 1),
         round(d.tb_ngan_k * 100, 1),
         case when d.tong - d.rn + 1 > d.ngan then round((d.tb_ngan_k - d.tb_dai_k) * 100, 1) end,
         d.rn <= d.ngan, d.rn <= d.dai
    from d
   order by d.rn
$$;
