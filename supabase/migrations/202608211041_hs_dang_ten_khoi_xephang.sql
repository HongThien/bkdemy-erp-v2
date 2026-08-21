-- ============================================================================
-- Màn "Thông tin học tập" (Thùy 21/08: "giống app phụ huynh" — hiện dạng yếu) cần TÊN dạng/chuyên
-- đề, không chỉ ma_dang thô. Mở rộng hs_dang_evals (CREATE OR REPLACE — file gốc 202608201111 ĐÃ
-- áp, không sửa trực tiếp theo CLAUDE.md §2.1) thêm ten_dang/ten_chuyen_de/muc_do từ đúng bảng ban_do
-- ĐÃ join sẵn (bd/bd2/bd3) — không cần round-trip RPC thứ hai để tra tên.
--
-- Thêm 2 RPC mới:
-- (1) hs_khoi_cua_toi() — khối THÔ của HS (khác hs_cap1_cua_toi trả boolean; cần giá trị thô để lọc
--     '5T' riêng cho tính năng xếp hạng, KHÔNG đẻ RPC boolean mới cho từng khối).
-- (2) hs_xep_hang_tu_luyen(p_khoi) — Thùy: "xếp hạng các bạn 5T về thành tích làm tự luyện ở nhà".
--     Chỉ số = SỐ CÂU ĐÚNG cộng dồn (all-time — tính năng mới ra, chưa cần lọc mùa). Model giống
--     "báo cáo cả lớp" ET đã có ở app PH (stu-list): hiện tên + điểm TOÀN BỘ bạn cùng khối, không có
--     gì nhạy hơn báo cáo lớp hiện tại. HS KHÔNG làm tự luyện lần nào thì KHÔNG có dòng (INNER JOIN
--     tự nhiên loại — §1.5 "thiếu data = không có dòng", tránh hiện "0 điểm" gây tủi cho em chưa làm).
-- ============================================================================

create or replace function public.hs_dang_evals(p_mon text, p_nhanh text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  execute format($q$
    select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join %1$I bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = $1 and p.phase in ('et','mt','btvn')

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd2.ten_dang, bd2.ten_chuyen_de, bd2.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      join %1$I bd2 on bd2.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = $1 and blc.verdict is not null and bt.mon = $2
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd3.ten_dang, bd3.ten_chuyen_de, bd3.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      join %1$I bd3 on bd3.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = $1 and tl.mon = $2
    ) x
  $q$, v_bd)
  into v_out using v_hs, p_mon;
  return v_out;
end $$;
grant execute on function public.hs_dang_evals(text, text) to authenticated;
-- (mở rộng thêm src='tu_luyen' ở nhánh bai_lam_cau — trước đó tu_luyen bị gộp lẫn vào 'btvn' cùng
-- lỗi đã sửa bên mastery.ts/fetchOnlineEvals hôm nay; sửa nốt ở đây cho ĐỒNG BỘ 1 nguồn sự thật.)

create or replace function public.hs_khoi_cua_toi()
returns text
language sql stable security definer set search_path = public as $$
  select khoi from hoc_sinh where id = public.my_hoc_sinh_id()
$$;
grant execute on function public.hs_khoi_cua_toi() to authenticated;

create or replace function public.hs_xep_hang_tu_luyen(p_khoi text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x order by x.so_cau_dung desc, x.ho_ten asc), '[]'::jsonb) from (
    select h.ma_hs, h.ho_ten,
           count(*) filter (where blc.verdict = 'correct')::int as so_cau_dung,
           (h.id = public.my_hoc_sinh_id()) as la_toi
    from hoc_sinh h
    join bai_test bt on bt.hoc_sinh_id = h.id and bt.loai = 'tu_luyen'
    join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = h.id
    join bai_lam_cau blc on blc.bai_lam_id = bl.id
    where h.khoi = p_khoi and h.trang_thai = 'dang_hoc'
    group by h.id, h.ma_hs, h.ho_ten
  ) x
$$;
grant execute on function public.hs_xep_hang_tu_luyen(text) to authenticated;
