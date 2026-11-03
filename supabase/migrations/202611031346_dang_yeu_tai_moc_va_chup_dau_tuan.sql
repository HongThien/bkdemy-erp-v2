-- DẠNG YẾU TẠI MỐC D + CHỤP ĐẦU TUẦN TỰ ĐỘNG — spec-bao-cao-tuan.md §2.6, Pha P1 (Thùy chốt 03/11).
-- Một hàm dạng yếu tại mốc D = đúng định nghĩa đang chạy (fn_btyeu_dang_yeu_2_cua_so_moi: mastery < 0,5 + có đo trong 2 cửa sổ gần nhất)
-- nhưng chỉ dùng lần đo có thời điểm < D.
--   · fn_mastery_cells_bdm đã có p_den (t < p_den) — dùng thẳng.
--   · _mastery_cells_hinh_tai = thân fn_mastery_cells_hinh ĐANG CHẠY (pg_get_functiondef 03/11) + điều kiện mốc.
--   · _btyeu_moc_2_cua_so_tai(d) = mốc 2 cửa sổ tính theo ngày d thay vì hôm nay.
-- File này CHỈ THÊM hàm mới, không đụng hàm đang chạy. Nối hàm cũ sang hàm mới (một nguồn công thức) ở migration sau, SAU KHI đối chiếu
-- kết quả hai bên khớp nhau trên dữ liệu thật.
-- Thùy 03/11: KHÔNG tính ngược dạng yếu các tuần trước — bắt đầu từ tuần 02/11 (chụp 1 lần cho mốc 02/11 00:00), từ đó cron tự chụp.
-- Chụp từ HÀM, không từ bảng dang_yeu_hien_tai (bảng đó làm mới lười — chụp từ đó là chụp số cũ). HS = HS ở lớp của môn TẠI MỐC
-- (hoc_sinh_lop.ngay_vao / ngay_roi). Chỉ có dòng cho HS đã từng được đo ở môn trước mốc (§1.5: chưa đo ≠ 0 dạng yếu).

create or replace function public._btyeu_moc_2_cua_so_tai(p_d date)
 returns date
 language sql immutable
as $$
  select case when extract(day from p_d) <= 15 then (date_trunc('month', p_d) - interval '1 month' + interval '15 days')::date
              else date_trunc('month', p_d)::date end
$$;

CREATE OR REPLACE FUNCTION public._mastery_cells_hinh_tai(p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, hinh_baitoan_id uuid, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  with m as (
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.hinh_baitoan_id is not null
      and (sp.phase in ('et', 'mt') or (p_include_btvn and sp.phase = 'btvn'))
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)   -- 03/11: tính tại mốc
    union all
    -- 14/10 BỔ TRỢ: kết quả luyện / phiếu giấy / test cuối ca / retest của dạng = bài mô hình (bai_test_cau.ma_dang = hinh_baitoan.ma).
    -- Cùng cách fn_mastery_cells: test cuối ca ('bo_tro_test') = 'et' (luôn tính); luyện + retest = 'btvn' (chỉ khi p_include_btvn).
    select bl.hoc_sinh_id, hb.id,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai = 'bo_tro_test' then 'et' else 'btvn' end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    join hinh_baitoan hb on hb.ma = btc.ma_dang
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
      and bt.loai in ('bo_tro', 'bo_tro_test', 'retest')
      and (bt.loai = 'bo_tro_test' or p_include_btvn)
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)   -- 03/11: tính tại mốc
  ),
  rk as (
    select m.*, case m.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by m.hoc_sinh_id, m.hinh_baitoan_id
                              order by m.t desc, m.src, m.value desc) as rn
    from m
  )
  select hoc_sinh_id, hinh_baitoan_id,
         sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0),
         count(*),
         case when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= 3 then 'cao' when count(*) >= 2 then 'tb' else 'thap' end
  from rk group by hoc_sinh_id, hinh_baitoan_id
$function$;

-- Dạng yếu của NHIỀU HS × một môn tại mốc p_moc (null = bây giờ — phải ra y hệt fn_btyeu_dang_yeu_2_cua_so_moi).
create or replace function public._dang_yeu_tai_lo(p_hs uuid[], p_mon text, p_moc timestamptz)
 returns table(hoc_sinh_id uuid, ma_dang text, ten_dang text, score numeric, n integer)
 language plpgsql stable security definer set search_path to 'public'
as $function$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon);
  -- ngày làm mốc cửa sổ: mốc T2 00:00 ⇒ ngày CN (lần đo cuối được tính là của CN)
  v_d date := case when p_moc is null then (now() at time zone 'Asia/Ho_Chi_Minh')::date
                   else ((p_moc - interval '1 second') at time zone 'Asia/Ho_Chi_Minh')::date end;
  v_moc date := public._btyeu_moc_2_cua_so_tai(v_d);
begin
  if v_bd is null or cardinality(coalesce(p_hs, '{}')) = 0 then return; end if;
  return query execute format($q$
    select m.hoc_sinh_id, m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells_bdm($1, true, null, 5, 5, 3, $4) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang)
    where m.muc = 'yeu'
      and m.ma_dang in (select public._do_o_bdm(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = m.hoc_sinh_id and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2
                                and ($4 is null or coalesce(b.ngay, g.graded_at::date) <= $5)) d)
    order by m.hoc_sinh_id, (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon, p_moc, v_d;
  -- dạng = bài mô hình Hình (14/10), cùng luật
  return query
    select h.hoc_sinh_id, hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public._mastery_cells_hinh_tai(p_hs, true, null, p_moc) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = h.hoc_sinh_id and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc
                    and (p_moc is null or coalesce(b.ngay, g.graded_at::date) <= v_d))
    order by h.hoc_sinh_id, (h.n >= 2) desc, h.score;
end $function$;

-- Chụp ảnh dạng yếu ĐẦU TUẦN p_tuan (thứ 2) cho mọi môn: tính tại mốc p_tuan 00:00 giờ VN → dang_yeu_dau_tuan (thay ảnh cũ của tuần đó).
create or replace function public._dang_yeu_chup_tuan(p_tuan date)
 returns integer
 language plpgsql security definer set search_path to 'public'
as $$
declare
  v_moc timestamptz := (p_tuan::timestamp at time zone 'Asia/Ho_Chi_Minh');
  r record; n int := 0; k int;
begin
  for r in select distinct l.mon from lop l where l.trang_thai = 'dang_hoc' and l.mon is not null loop
    delete from dang_yeu_dau_tuan where tuan = p_tuan and mon = r.mon;
    with hs as (     -- HS ở lớp của môn TẠI MỐC
      select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.khoi
        from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
       where l.mon = r.mon and l.khoi is not null
         and hl.ngay_vao < p_tuan and (hl.ngay_roi is null or hl.ngay_roi >= p_tuan - 1)
       order by hl.hoc_sinh_id, hl.ngay_vao desc
    ),
    co_do as (       -- chỉ HS đã từng được đo ở môn trước mốc (chưa đo ≠ 0 dạng yếu)
      select hs.* from hs
       where exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                       join buoi_hoc b on b.id = p.buoi_hoc_id join lop l2 on l2.id = b.lop_id
                      where g.hoc_sinh_id = hs.hoc_sinh_id and l2.mon = r.mon and b.ngay < p_tuan)
    ),
    dy as (select * from public._dang_yeu_tai_lo(array(select c.hoc_sinh_id from co_do c), r.mon, v_moc))
    insert into dang_yeu_dau_tuan (tuan, mon, khoi, hoc_sinh_id, so_dang_yeu, dang, tinh_at, chot_id)
    select p_tuan, r.mon, c.khoi, c.hoc_sinh_id, count(dy.ma_dang)::int,
           coalesce(jsonb_agg(jsonb_build_object('ma_dang', dy.ma_dang, 'ten_dang', dy.ten_dang, 'score', dy.score, 'n', dy.n))
                    filter (where dy.ma_dang is not null), '[]'::jsonb),
           now(), null
      from co_do c left join dy on dy.hoc_sinh_id = c.hoc_sinh_id
     group by c.hoc_sinh_id, c.khoi;
    get diagnostics k = row_count; n := n + k;
  end loop;
  return n;
end $$;

-- Việc tự động SÁNG THỨ 2 (cron 00:05 VN — file *_cron_sql_editor riêng): chụp dạng yếu đầu tuần + cập nhật Tổng kết tuần tuần vừa rồi.
-- (03/11: Tổng kết tuần là bộ đệm tính LƯỜI — chỉ tính khi có người mở màn ⇒ tuần 26/10–01/11 chưa có, bảng Học tập tuần đứng ở 19/10.)
create or replace function public._tu_dong_sang_t2()
 returns jsonb
 language plpgsql security definer set search_path to 'public'
as $$
declare
  v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
  v_chup int; v_tk int;
begin
  v_chup := public._dang_yeu_chup_tuan(v_tuan);
  perform set_config('troly.noi_bo', '1', true);   -- cùng cơ chế "hệ tự tính" của fn_troly_tuan_tu_dong
  v_tk := public._troly_tuan_cap_nhat(v_tuan - 7, true, 3);
  perform set_config('troly.noi_bo', '', true);
  return jsonb_build_object('tuan', v_tuan, 'chup_dang_yeu', v_chup, 'tong_ket_tuan', v_tk);
end $$;

revoke execute on function public._mastery_cells_hinh_tai(uuid[], boolean, timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public._dang_yeu_tai_lo(uuid[], text, timestamptz) from public, anon, authenticated;
revoke execute on function public._dang_yeu_chup_tuan(date) from public, anon, authenticated;
revoke execute on function public._tu_dong_sang_t2() from public, anon, authenticated;
