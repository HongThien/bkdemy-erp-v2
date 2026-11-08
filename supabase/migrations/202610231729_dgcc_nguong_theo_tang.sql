-- ============================================================================
-- 202610231729 — dgcc_nguong_theo_tang
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10 chốt ngưỡng xu hướng THEO TẦNG, dựa trên đo toàn bộ HS 5T · 9 · 12 (2.342 ô có xu hướng):
--   độ lệch chuẩn của chênh (TB ngắn − TB dài) = chủ đề 6,5 · chuyên đề 7,1 · nhóm bài 9,6; ngưỡng ≈ 0,5 SD / 1,5 SD
--   ⇒ chủ đề + chuyên đề GIỮ 3/10 (khớp dữ liệu), nhóm bài đổi 5/15 (cửa sổ 3/5 lần nên dao động mạnh hơn; 3/10 gắn "rõ" cho ~331 ô nhiễu).
--   Ngưỡng chuyển sang _dgcc_nguong() (1 dòng / tầng). Cột nguong_nhe / nguong_ro của _dgcc_tham_so() KHÔNG còn được đọc —
--   giữ nguyên vì đổi kiểu trả về phải DROP hàm (Luật xoá: chờ Thùy gật rồi mới dọn).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: thêm _dgcc_nguong, thay THÂN fn_dgcc_hs (chữ ký giữ nguyên) — nhãn xu hướng tầng nhóm bài đổi theo ngưỡng mới.
-- ============================================================================

create or replace function _dgcc_nguong()
returns table(tang text, nhe numeric, ro numeric)
language sql immutable as $$
  values ('chu_de', 3::numeric, 10::numeric), ('chuyen_de', 3, 10), ('nhom', 5, 15)
$$;

create or replace function fn_dgcc_hs(p_hs uuid[], p_mon text DEFAULT 'Toán')
returns table(hoc_sinh_id uuid, tang text, nut text, cha text, ten text, thu_tu integer, so_lan integer,
              cua_so_ngan integer, cua_so_dai integer, tb_ngan numeric, tb_dai numeric, chenh numeric, xu_huong text, lan_cuoi date)
language sql stable set search_path to 'public' as $$
  with l as (
    select l.*, row_number() over (partition by l.hoc_sinh_id, l.tang, l.nut, l.cha order by l.t desc, l.luot) as rn
      from _dgcc_lan(p_hs, p_mon) l
  ),
  a as (
    select l.hoc_sinh_id, l.tang, l.nut, l.cha, count(*)::integer as so_lan, max(w.ngan) as ngan, max(w.dai) as dai,
           avg(l.ti_le) filter (where l.rn <= w.ngan) as tb_ngan,
           avg(l.ti_le) filter (where l.rn <= w.dai) as tb_dai,
           max(l.ngay) as lan_cuoi
      from l join _dgcc_cua_so() w on w.tang = l.tang
     group by l.hoc_sinh_id, l.tang, l.nut, l.cha
  )
  select a.hoc_sinh_id, a.tang, a.nut, a.cha, tn.ten, tn.thu_tu, a.so_lan, a.ngan, a.dai,
         round(a.tb_ngan * 100, 1), round(a.tb_dai * 100, 1),
         case when a.so_lan > a.ngan then round((a.tb_ngan - a.tb_dai) * 100, 1) end,
         case when a.so_lan <= a.ngan then 'chua_du'
              when (a.tb_ngan - a.tb_dai) * 100 >  ng.ro  then 'tang_ro'
              when (a.tb_ngan - a.tb_dai) * 100 >= ng.nhe then 'tang_nhe'
              when (a.tb_ngan - a.tb_dai) * 100 < -ng.ro  then 'giam_ro'
              when (a.tb_ngan - a.tb_dai) * 100 <= -ng.nhe then 'giam_nhe'
              else 'di_ngang' end,
         a.lan_cuoi
    from a
    join _dgcc_nguong() ng on ng.tang = a.tang
    left join lateral _dgcc_ten(a.tang, a.nut, a.cha) tn on true
$$;

revoke execute on function _dgcc_nguong() from public, anon;
grant execute on function _dgcc_nguong() to authenticated;
