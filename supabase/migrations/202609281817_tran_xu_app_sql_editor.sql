-- ============================================================================
-- 202609281817 — tran_xu_app_sql_editor   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (hàm owner `postgres`, claude_build không sửa được)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 28/09 (B-L1..B-L3): xu kiếm TRÊN APP tối đa 30 / HS / tháng / MÔN (vòng quay 10 · nhiệm vụ 15 · thành tựu 5), chặn ở hàm chốt
--   xu tháng; EXP vẫn ghi đủ, chỉ phần đổi ra xu bị chặn; xu từ học trên lớp KHÔNG tính vào trần.
--   fn_gami_exp_xu_thang là hàm chốt (ChotXuScreen + ví/thành tích HS đều đọc) ⇒ thêm nhánh EXP app từ fn_exp_app_thang (mig 202609281810):
--     xu = xu(EXP lớp) + min(tran_xu_app, xu(EXP app)).
--   Gộp luôn 'exp_tren_lop' (việc của mig 202609272045 đang treo chờ SQL Editor) — chạy file này xong thì 202609272045 tự "bỏ qua"
--   (nó kiểm đã có exp_tren_lop), chỉ cần ghi sổ cả hai.
--   Thân cũ lấy từ bản ĐANG CHẠY (pg_get_functiondef 28/09), giữ nguyên chữ ký + kiểu trả về.
--   moc_ke / xu_moc_ke: khúc 100 EXP kế tiếp trên TỔNG EXP, +1 xu (dùng cho thanh tiến độ).
--   ⚠ Áp bằng SQL Editor ⇒ anon được grant tường minh (bài học 18/09) ⇒ revoke anon ở cuối.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không. create or replace cùng chữ ký.
-- ============================================================================
create or replace function public.fn_gami_exp_xu_thang(p_ym text, p_hoc_sinh_id uuid default null, p_mon text default null)
returns table(hoc_sinh_id uuid, mon text, exp integer, xu integer, moc_ke integer, xu_moc_ke integer)
language sql stable as $$
  with cua_so as (
    select ((p_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((p_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ), lop as (   -- EXP học trên lớp (không trần)
    select l.hoc_sinh_id, coalesce(l.mon, '') as mon, sum(l.amount)::integer as exp
    from public.gami_exp_ledger l, cua_so w
    where (p_hoc_sinh_id is null or l.hoc_sinh_id = p_hoc_sinh_id)
      and (p_mon is null or l.mon = p_mon)
      and (
        (l.source in ('exp_thang', 'exp_et', 'exp_btvn', 'exp_btvn_thang', 'exp_tren_lop') and l.note = p_ym)
        or (l.source = 'attend_floor' and l.created_at >= w.tu and l.created_at < w.den)
      )
    group by 1, 2
  ), app as (   -- EXP trên app (nhiệm vụ + vòng quay), trần xu theo môn
    select a.hoc_sinh_id, a.mon, a.exp_app from public.fn_exp_app_thang(p_ym, p_hoc_sinh_id, p_mon) a
  ), gop as (
    select coalesce(l.hoc_sinh_id, a.hoc_sinh_id) as hs, coalesce(l.mon, a.mon) as mon,
           coalesce(l.exp, 0) as exp_lop, coalesce(a.exp_app, 0) as exp_app
    from lop l full join app a on a.hoc_sinh_id = l.hoc_sinh_id and a.mon = l.mon
  ), tinh as (
    select g.*, public.fn_xu_tu_exp(g.exp_lop) + least(coalesce(c.tran_xu_app, 0), public.fn_xu_tu_exp(g.exp_app)) as xu
    from gop g left join public.nhiem_vu_cau_hinh c on c.mon = g.mon and c.bat
  )
  select t.hs, t.mon, t.exp_lop + t.exp_app, t.xu,
         ((floor(greatest(t.exp_lop + t.exp_app, 0) / 100.0) + 1) * 100)::integer, t.xu + 1
  from tinh t
$$;
revoke execute on function public.fn_gami_exp_xu_thang(text, uuid, text) from anon;

-- Kiểm (kỳ vọng: co_exp_tren_lop = true, co_app = true, anon = false)
select position('exp_tren_lop' in pg_get_functiondef('public.fn_gami_exp_xu_thang(text,uuid,text)'::regprocedure)) > 0 as co_exp_tren_lop,
       position('fn_exp_app_thang' in pg_get_functiondef('public.fn_gami_exp_xu_thang(text,uuid,text)'::regprocedure)) > 0 as co_app,
       has_function_privilege('anon', 'public.fn_gami_exp_xu_thang(text,uuid,text)', 'execute') as anon;
