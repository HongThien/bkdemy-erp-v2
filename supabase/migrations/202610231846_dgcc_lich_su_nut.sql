-- ============================================================================
-- 202610231846 — dgcc_lich_su_nut
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10: popup một ô phải giống Dashboard học tập — mỗi LẦN cho thấy "% hiện tại" ngay sau lần đó
--   (TB cửa sổ dài tính tới lần đó) và lần đó làm % hiện tại tăng/giảm bao nhiêu; dòng mới nhất = lần tăng giảm gần nhất.
--   Kèm TB ngắn tới lần đó + chênh (TB ngắn − TB dài) để đọc được trend đã đổi qua từng lần.
--   Hàm MỚI fn_dgcc_lich_su_nut (không đổi kiểu trả về của fn_dgcc_lan_nut — làm vậy phải DROP; màn chuyển sang hàm mới,
--   fn_dgcc_lan_nut để lại chờ Thùy gật rồi mới dọn — Luật xoá).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: chỉ thêm hàm.
-- ============================================================================

create or replace function fn_dgcc_lich_su_nut(p_hs uuid, p_tang text, p_nut text, p_cha text DEFAULT NULL, p_mon text DEFAULT 'Toán')
returns table(stt integer, ngay date, kenh text, so_cau integer, diem numeric, ti_le numeric,
              hien_tai numeric, tang_giam numeric, tb_ngan numeric, chenh numeric, trong_ngan boolean, trong_dai boolean)
language sql stable set search_path to 'public' as $$
  with w as (select * from _dgcc_cua_so() where tang = p_tang),
  l as (
    select l.*, row_number() over (order by l.t, l.luot)::integer as cu  -- 1 = lần cũ nhất
      from _dgcc_lan(array[p_hs], p_mon) l
     where l.tang = p_tang and l.nut = p_nut and l.cha is not distinct from p_cha
  ),
  r as (
    -- "tới lần k": TB của tối đa (dai) / (ngan) lần gần nhất tính đến lần k
    select l.*,
           (select avg(x.ti_le) from l x where x.cu between l.cu - w.dai + 1 and l.cu)  as tb_dai_k,
           (select avg(x.ti_le) from l x where x.cu between l.cu - w.ngan + 1 and l.cu) as tb_ngan_k,
           count(*) over () as tong, w.ngan, w.dai
      from l cross join w
  ),
  d as (select r.*, r.tb_dai_k - lag(r.tb_dai_k) over (order by r.cu) as tg from r)
  select (d.tong - d.cu + 1)::integer, d.ngay, d.kenh, d.so_cau, round(d.diem, 2), round(d.ti_le * 100, 1),
         round(d.tb_dai_k * 100, 1), round(d.tg * 100, 1),
         round(d.tb_ngan_k * 100, 1),
         case when d.cu > d.ngan then round((d.tb_ngan_k - d.tb_dai_k) * 100, 1) end,
         d.tong - d.cu + 1 <= d.ngan, d.tong - d.cu + 1 <= d.dai
    from d
   order by d.cu desc
$$;

revoke execute on function fn_dgcc_lich_su_nut(uuid, text, text, text, text) from public, anon;
grant execute on function fn_dgcc_lich_su_nut(uuid, text, text, text, text) to authenticated;
